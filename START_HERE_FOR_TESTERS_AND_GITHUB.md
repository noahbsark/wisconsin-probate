# Start Here - Wisconsin Probate Forms Prototype

This folder contains the current Wisconsin probate forms prototype.

It is a static browser app. It can be opened directly from the file system and does not require installation for basic testing.

## Quick Start For Testers

1. Unzip the folder.
2. Open `static/index.html` in Chrome, Edge, or another modern browser.
3. Click `Guided interview` to walk through a probate matter.
4. Click `Test scenarios`, then click `Run all scenarios`.
5. The expected current result is `40` scenarios passing with `1109` checks passing.

If a tester wants to enter manual fact patterns:

1. Click `Clear` before starting a new case.
2. Use `Guided interview`.
3. Complete the questions.
4. Use `View forms` to preview the packet status.
5. Use the final review/download flow to generate forms or an opening packet ZIP.

## Optional Local Server

The app can usually run by opening `static/index.html` directly.

If a browser blocks local file downloads or scripts, run the optional local server from this folder:

```powershell
python server.py 8765
```

Then open:

```text
http://127.0.0.1:8765
```

## GitHub Upload Notes

For GitHub, upload this folder as the repository root or place this folder inside a repository.

Keep these together:

- `static`
- `templates`
- `server.py`
- `README.md`
- `GITHUB_UPLOAD_INSTRUCTIONS.md`
- `PRODUCT_ROADMAP.md`
- `PRODUCTION_ARCHITECTURE.md`
- `docs`

The app stores beta case data in the browser's local storage. Do not commit real user case files, generated client packets, private probate data, or downloaded ZIP outputs.

## Current Prototype Status

The prototype includes:

- Wisconsin informal probate guided interview.
- Transfer by Affidavit routing and MVP package flow.
- Interested-person logic and audit.
- Waiver vs. PR-1805 notice path logic.
- PR-1801, PR-1803, PR-1804, PR-1805, PR-1806, PR-1807, PR-1808, PR-1810, PR-1811, and PR-1817 draft generation.
- Opening packet review and filing instructions.
- In-app formal test scenarios.

This is still beta software. It is not a law firm, does not provide legal advice, and is not ready for paid public launch until legal review, official-form output review, privacy/security, account storage, payment, and support policies are completed.

