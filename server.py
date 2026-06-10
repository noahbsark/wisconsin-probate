from __future__ import annotations

import json
import mimetypes
import re
import sys
import uuid
import zipfile
from html import escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"
TEMPLATE_PATH = ROOT / "templates" / "PR-1801-template.docx"
GENERATED_DIR = ROOT / "generated"


def value_at(data: dict, path: str, default: str = ""):
    current = data
    for part in path.split("."):
        if not isinstance(current, dict):
            return default
        current = current.get(part)
        if current is None:
            return default
    return current


def clean_text(value) -> str:
    if value is None:
        return ""
    if isinstance(value, (int, float)):
        return str(value)
    return str(value).strip()


def date_text(value) -> str:
    return clean_text(value)


def money_text(value) -> str:
    value = clean_text(value).replace("$", "").replace(",", "")
    if not value:
        return ""
    try:
        return f"{float(value):,.2f}"
    except ValueError:
        return value


def join_people(*values: str) -> str:
    names = [clean_text(v) for v in values if clean_text(v)]
    return ", ".join(names)


def first_interested(data: dict) -> dict:
    people = data.get("interestedPersons") or []
    return people[0] if people else {}


def generated_values(data: dict) -> tuple[dict[int, str], dict[int, bool]]:
    county = clean_text(value_at(data, "estate.county"))
    decedent_name = clean_text(value_at(data, "decedent.fullName"))
    pr_name = clean_text(value_at(data, "pr.fullName")) or clean_text(value_at(data, "will.nominatedPr"))
    interested = first_interested(data)
    will_exists = value_at(data, "will.exists")
    codicils = clean_text(value_at(data, "will.codicilDates"))
    will_location = value_at(data, "will.location")
    other_status = value_at(data, "otherProceedings.status")

    text_fields = {
        1: county.upper(),
        2: decedent_name,
        3: decedent_name,
        4: "",
        6: clean_text(value_at(data, "estate.caseNumber")),
        7: date_text(value_at(data, "decedent.dateOfBirth")),
        8: date_text(value_at(data, "decedent.dateOfDeath")),
        9: clean_text(value_at(data, "decedent.domicileCounty")),
        10: clean_text(value_at(data, "decedent.domicileState")),
        11: clean_text(value_at(data, "decedent.lastMailingAddress")),
        12: clean_text(value_at(data, "applicant.capacity")),
        15: clean_text(value_at(data, "otherProceedings.explanation")),
        16: money_text(value_at(data, "estate.estimatedNetValue")),
        27: clean_text(value_at(data, "benefits.explanation")),
        32: clean_text(value_at(data, "spouse.fullName")),
        42: date_text(value_at(data, "will.date")) if will_exists == "yes" else "",
        44: codicils if will_exists == "yes" else "",
        46: clean_text(value_at(data, "will.priorCaseNumber")) if will_exists == "yes" else "",
        50: clean_text(value_at(data, "will.namedPr")) if will_exists == "yes" else "",
        51: pr_name if will_exists == "yes" else "",
        52: clean_text(value_at(data, "will.namedTrustee")) if will_exists == "yes" else "",
        53: clean_text(value_at(data, "will.nominatedTrustee")) if will_exists == "yes" else "",
        55: pr_name if will_exists == "no" else "",
        57: clean_text(interested.get("name")),
        58: clean_text(interested.get("relationship")),
        59: clean_text(interested.get("address")),
        60: clean_text(interested.get("minorDateOfBirth")),
        62: clean_text(value_at(data, "requests.question10OtherText")),
        64: clean_text(value_at(data, "requests.domiciliaryLettersTo")) or pr_name,
        66: clean_text(value_at(data, "requests.trusteeNames")),
        67: clean_text(value_at(data, "requests.trustName")),
        70: clean_text(value_at(data, "requests.otherText")),
        71: "",
        72: clean_text(value_at(data, "applicant.fullName")),
        73: clean_text(value_at(data, "applicant.address")),
        74: clean_text(value_at(data, "applicant.email")),
        75: clean_text(value_at(data, "applicant.phone")),
        76: date_text(value_at(data, "applicant.signatureDate")),
        77: clean_text(value_at(data, "applicant.barNumber")),
        78: clean_text(value_at(data, "preparer.fullName")),
        79: clean_text(value_at(data, "preparer.address")),
        80: clean_text(value_at(data, "preparer.email")),
        81: clean_text(value_at(data, "preparer.phone")),
        82: clean_text(value_at(data, "preparer.barNumber")),
    }

    benefits = data.get("benefits") or {}
    spouse = data.get("spouse") or {}
    requests = data.get("requests") or {}
    interested_people = data.get("interestedPersons") or []

    checkbox_fields = {
        5: bool(value_at(data, "estate.isAmended")),
        13: other_status == "pending",
        14: other_status == "not_pending",
        17: benefits.get("medicalAssistance") == "did",
        18: benefits.get("medicalAssistance") == "did_not",
        19: benefits.get("familyCare") == "did",
        20: benefits.get("familyCare") == "did_not",
        21: benefits.get("communityOptions") == "did",
        22: benefits.get("communityOptions") == "did_not",
        23: benefits.get("chronicDisease") == "did",
        24: benefits.get("chronicDisease") == "did_not",
        25: benefits.get("institution") == "was",
        26: benefits.get("institution") == "was_not",
        28: bool(benefits.get("lackInfo")),
        29: bool(spouse.get("seeAttached")),
        30: spouse.get("livingStatus") == "living",
        31: spouse.get("livingStatus") == "deceased",
        33: spouse.get("statusAtDeath") == "married",
        34: spouse.get("statusAtDeath") == "divorced",
        35: spouse.get("communityOptions") == "did",
        36: spouse.get("communityOptions") == "did_not",
        37: spouse.get("chronicDisease") == "did",
        38: spouse.get("chronicDisease") == "did_not",
        39: bool(spouse.get("lackInfo")),
        40: will_exists == "yes",
        41: will_exists == "yes",
        43: bool(codicils),
        45: will_location == "court",
        47: will_location == "accompanies",
        48: will_location == "probated_elsewhere",
        49: will_location == "en_route",
        54: will_exists == "no",
        56: bool(requests.get("interestedPersonsSeeAttached")) or len(interested_people) > 1,
        61: bool(requests.get("question10OtherSelected")),
        63: will_exists == "yes",
        65: bool(requests.get("appointTrustee")),
        68: bool(requests.get("additionalTrusts")),
        69: bool(requests.get("otherSelected")),
    }
    return text_fields, checkbox_fields


def split_field_chunks(xml: str):
    pattern = re.compile(r'<w:fldChar w:fldCharType="begin"')
    matches = list(pattern.finditer(xml))
    if not matches:
        return [(None, xml)]

    parts = []
    cursor = 0
    for index, match in enumerate(matches, start=1):
        start = match.start()
        end_marker = xml.find('<w:fldChar w:fldCharType="end"/>', start)
        if end_marker == -1:
            continue
        end_run = xml.find("</w:r>", end_marker)
        if end_run == -1:
            continue
        end = end_run + len("</w:r>")
        if start > cursor:
            parts.append((None, xml[cursor:start]))
        parts.append((index, xml[start:end]))
        cursor = end
    if cursor < len(xml):
        parts.append((None, xml[cursor:]))
    return parts


def last_run_start(xml: str, end: int) -> int:
    matches = list(re.finditer(r"<w:r(?:\s|>)", xml[:end]))
    if not matches:
        return -1
    return matches[-1].start()


def replace_field_result(chunk: str, value: str) -> str:
    value = clean_text(value)

    separate = chunk.find('<w:fldChar w:fldCharType="separate"/>')
    end_marker = chunk.rfind('<w:fldChar w:fldCharType="end"/>')
    if separate == -1 or end_marker == -1:
        return chunk

    result_start = chunk.find("</w:r>", separate)
    end_run_start = last_run_start(chunk, end_marker)
    if result_start == -1 or end_run_start == -1:
        return chunk
    result_start += len("</w:r>")

    lines = value.splitlines() if value else [""]
    escaped_parts = []
    for i, line in enumerate(lines):
        if i:
            escaped_parts.append("<w:br/>")
        escaped_parts.append(f'<w:t xml:space="preserve">{escape(line)}</w:t>')
    run = "<w:r><w:rPr><w:noProof/></w:rPr>" + "".join(escaped_parts) + "</w:r>"
    return chunk[:result_start] + run + chunk[end_run_start:]


def set_checkbox(chunk: str, checked: bool) -> str:
    if "<w:checkBox>" not in chunk:
        return chunk

    chunk = re.sub(r"<w:checked(?:\s+w:val=\"[^\"]*\")?\s*/>", "", chunk)
    chunk = re.sub(r"<w:default w:val=\"[^\"]*\"\s*/>", f'<w:default w:val="{1 if checked else 0}"/>', chunk, count=1)
    if checked:
        chunk = chunk.replace("</w:checkBox>", "<w:checked/></w:checkBox>", 1)

    glyph = "&#9745;" if checked else "&#9744;"
    separate = chunk.find('<w:fldChar w:fldCharType="separate"/>')
    end_marker = chunk.rfind('<w:fldChar w:fldCharType="end"/>')
    if separate == -1 or end_marker == -1:
        return chunk
    result_start = chunk.find("</w:r>", separate)
    end_run_start = last_run_start(chunk, end_marker)
    if result_start == -1 or end_run_start == -1:
        return chunk
    result_start += len("</w:r>")
    run = f'<w:r><w:rPr><w:noProof/></w:rPr><w:t>{glyph}</w:t></w:r>'
    return chunk[:result_start] + run + chunk[end_run_start:]


def attachment_paragraph(text: str, bold: bool = False) -> str:
    safe = escape(text)
    bold_xml = "<w:b/>" if bold else ""
    return (
        "<w:p><w:r><w:rPr>"
        f"{bold_xml}"
        "</w:rPr>"
        f'<w:t xml:space="preserve">{safe}</w:t>'
        "</w:r></w:p>"
    )


def append_interested_attachment(xml: str, data: dict) -> str:
    people = data.get("interestedPersons") or []
    if len(people) <= 1:
        return xml

    paragraphs = [
        attachment_paragraph("Attachment to PR-1801: Interested Persons", True),
    ]
    for index, person in enumerate(people, start=1):
        name = clean_text(person.get("name")) or "(name missing)"
        relation = clean_text(person.get("relationship")) or "(relationship missing)"
        address = clean_text(person.get("address")) or "(address missing)"
        minor_dob = clean_text(person.get("minorDateOfBirth"))
        line = f"{index}. {name}; {relation}; {address}"
        if minor_dob:
            line += f"; minor date of birth: {minor_dob}"
        paragraphs.append(attachment_paragraph(line))

    insertion = "".join(paragraphs)
    sect_index = xml.rfind("<w:sectPr")
    body_close = xml.rfind("</w:body>")
    if sect_index != -1 and sect_index < body_close:
        return xml[:sect_index] + insertion + xml[sect_index:]
    return xml.replace("</w:body>", insertion + "</w:body>", 1)


def fill_docx(data: dict, output_path: Path) -> None:
    text_fields, checkbox_fields = generated_values(data)
    with zipfile.ZipFile(TEMPLATE_PATH, "r") as zin:
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                content = zin.read(item.filename)
                if item.filename == "word/document.xml":
                    xml = content.decode("utf-8")
                    new_parts = []
                    for index, chunk in split_field_chunks(xml):
                        if index is None:
                            new_parts.append(chunk)
                            continue
                        if "FORMCHECKBOX" in chunk:
                            if index in checkbox_fields:
                                chunk = set_checkbox(chunk, checkbox_fields[index])
                        elif "FORMTEXT" in chunk or "DOCPROPERTY" in chunk:
                            if index in text_fields:
                                chunk = replace_field_result(chunk, text_fields[index])
                        new_parts.append(chunk)
                    xml = "".join(new_parts)
                    xml = append_interested_attachment(xml, data)
                    content = xml.encode("utf-8")
                zout.writestr(item, content)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return

    def send_json(self, payload: dict, status: int = 200) -> None:
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path == "/":
            self.serve_file(STATIC_DIR / "index.html")
            return
        if path.startswith("/static/"):
            self.serve_file(STATIC_DIR / path.removeprefix("/static/"))
            return
        if path.startswith("/generated/"):
            self.serve_file(GENERATED_DIR / path.removeprefix("/generated/"))
            return
        self.send_error(404)

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/api/generate-pr1801":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            GENERATED_DIR.mkdir(exist_ok=True)
            slug = re.sub(r"[^A-Za-z0-9]+", "-", clean_text(value_at(data, "decedent.fullName"))).strip("-") or "estate"
            filename = f"PR-1801-{slug}-{uuid.uuid4().hex[:8]}.docx"
            output_path = GENERATED_DIR / filename
            fill_docx(data, output_path)
            (GENERATED_DIR / f"{filename}.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
            self.send_json({"ok": True, "file": f"/generated/{filename}", "filename": filename})
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, status=500)

    def serve_file(self, path: Path) -> None:
        try:
            root = ROOT.resolve()
            target = path.resolve()
            if root not in target.parents and target != root:
                self.send_error(403)
                return
            if not target.exists() or not target.is_file():
                self.send_error(404)
                return
            ctype = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
            raw = target.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(raw)))
            if target.suffix.lower() == ".docx":
                self.send_header("Content-Disposition", f'attachment; filename="{target.name}"')
            self.end_headers()
            self.wfile.write(raw)
        except OSError:
            self.send_error(404)


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"PR-1801 prototype running at http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
