# PR-1801 Prototype

Open `static/index.html` in a browser to use the standalone prototype.

What it does:

- Guides a user through the first PR-1801 intake.
- Adds a free front-door Probate Path Router for Transfer by Affidavit vs. informal probate vs. attorney-review/formal-probate review.
- Adds a Transfer by Affidavit MVP interview for likely small estates, including affiant facts, waiting-period/pending-probate confirmations, entitled-person review, asset/holder rows, readiness review, and package export.
- Adds State Bar Transfer by Affidavit source PDFs to the templates folder for reference: Transfer by Affidavit, Affidavit of Heirship addendum, Affidavit of Service/Waiver addendum, and instructions.
- Adds a public-facing funnel view with “start free,” Transfer by Affidavit pricing, informal probate pricing, and attorney handoff positioning.
- Adds an opening-path screen for waiver opening vs. PR-1805 notice opening.
- Adds a product ladder concept: lower-cost Transfer by Affidavit package, paid informal probate opening packet, and neutral attorney handoff package.
- Adds a payment-gate design so users can complete intake and preview readiness for free, then unlock final Word/ZIP downloads.
- Adds a consent-based attorney handoff ZIP with case summary, interested-person/service list, readiness notes, inventory snapshot, and optional case data.
- Adds a written attorney handoff/referral compliance model in `outputs/attorney-handoff-referral-compliance-model.md`.
- Adds PR-1803 waiver settings and generates a waiver packet for eligible interested persons.
- Adds PR-1804 Notice to Creditors fields for the all-waivers path.
- Adds a first-pass PR-1806 heirship interview.
- Adds PR-1807 consent-to-serve fields for the proposed personal representative.
- Adds PR-1808 Statement of Informal Administration court-draft fields.
- Adds PR-1810 Domiciliary Letters generation.
- Adds PR-1817 Declaration of Service fields and an automatic service attachment for multiple recipients.
- Adds a path-based opening packet checklist showing what to file, serve, publish, and wait for.
- Adds a packet readiness gate that separates must-fix items from court/county-supplied blanks and review notes.
- Adds a final Opening Packet Filing Instructions screen covering what to sign, file, serve/mail, publish, wait for, and do after letters issue.
- Uses one visible estimated probate-property value in the early filing interview, adds address-format placeholders, and keeps PR-1801/PR-1806 relationship fields concise.
- Improves spouse/domestic partner intake for PR-1801 section 6 while still deriving the PR-1806 surviving-spouse answer.
- Adds PR-1811 Inventory intake with asset rows, encumbrances, marital-property flagging, totals, and Word generation.
- Adds a task and deadline tracker for service, publication, letters, inventory, claims, and closing review.
- Exports a ZIP opening packet with selected forms, checklist, task list, service list, inventory snapshot, and case data.
- Includes a filing handoff in the opening packet ZIP so the file/serve/publish/wait instructions travel with the forms.
- Adds an in-app roadmap view for the product plan, mobile direction, secure sharing direction, and next build sequence.
- Includes a product roadmap and production architecture plan in this folder.
- Saves work in the browser's local storage.
- Loads a simple no-will waiver-path sample estate.
- Runs a live missing-information checker.
- Generates PR-1801, PR-1803, PR-1804, PR-1805, PR-1806, PR-1807, PR-1808, PR-1810, PR-1811, and PR-1817 Word documents directly in the browser.
- Uses embedded copies of the attached PR-1801, PR-1803, PR-1804, PR-1805, PR-1806, PR-1807, PR-1808, PR-1810, PR-1811, and PR-1817 templates.
- Clears hardcoded preparer data unless the user supplies preparer information.
- Adds an interested-person attachment when more than one interested person is entered.
- Includes smarter interested-person roster syncing for heirs, will beneficiaries, trust beneficiaries, trustees, charity beneficiaries, minors/protected persons, and missing-address service review.
- Includes 18 formal test scenarios covering waiver, PR-1805 notice, no-will guardrails, blended family, deceased-child descendants, minor/protected persons, trust beneficiaries, charity beneficiaries, missing addresses, nonresident PR issues, and auto-synced party treatment.

Opening-path logic:

- The front-door router first screens for Transfer by Affidavit, informal probate, or attorney review based on probate-property value, known/locatable parties, cooperation, capacity issues, public-benefit concerns, creditor/dispute issues, and formal-review flags.
- If Transfer by Affidavit may fit, the prototype shows a dedicated affidavit package interview and a separate Transfer by Affidavit product unlock.
- The uploaded `PR-1831.pdf` is a court notice page pointing users to the State Bar forms, not a fillable affidavit form. The app now keeps that notice page plus the State Bar source PDFs in `templates`.
- The Transfer by Affidavit package currently generates a PR-1831-style MVP DOCX plus checklist ZIP. It follows the current State Bar form sections, but still should be reviewed against the official PDF before production use.
- If all interested persons can sign waivers, the prototype recommends the waiver path and enables PR-1803 and PR-1804.
- If not all waivers are available and there is a will, the prototype enables PR-1805 notice generation.
- If not all waivers are available and there is no will, the prototype stops the PR-1805 path and flags the case for formal-administration or attorney review.
- Final PR form downloads and the opening-packet ZIP are locked behind a prototype payment gate; the gate is a placeholder for live payment processing.
- Attorney handoff export is not monetized in this prototype and does not perform attorney matching or referral handling.

Optional local server:

```powershell
& "C:\Users\brad\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "C:\Users\brad\Documents\Codex\2026-06-08\files-mentioned-by-the-user-pr\outputs\pr1801-prototype\server.py" 8765
```

Then open:

```text
http://127.0.0.1:8765
```

Verification completed:

- Python generator syntax check passed.
- Browser-side app script syntax check passed.
- Free route-check, product-ladder, prototype payment gate, and attorney handoff package code paths were added.
- Transfer by Affidavit MVP package path was added and browser-tested for route display, product unlock, and ZIP export.
- Public funnel view was browser-tested on desktop and mobile widths.
- Browser-side DOCX generation was exercised through a local test harness for PR-1801, PR-1803, PR-1804, PR-1805, PR-1806, PR-1807, PR-1808, PR-1810, PR-1811, and PR-1817.
- Generated DOCX files contained the sample decedent and expected sample people.
- Generated DOCX files cleared the old attorney email and bar number from the templates.
- Generated PR-1801 included the interested-person attachment.
- Generated PR-1803 passed structural Word XML validation and blocks minor waiver signers.
- Generated PR-1804 passed structural Word XML validation.
- Generated PR-1805 passed structural Word XML validation.
- The no-will/no-waiver scenario blocks PR-1805 generation.
- Formal scenario runner passed 26 probate fact patterns with 313 checks, including Transfer by Affidavit cases for under/over $50,000, pending probate, real estate notice, named-PR real estate limitation, public benefits/Estate Recovery, unknown successors, and vehicle transfer.
- Generated PR-1806 passed structural Word XML validation.
- Generated PR-1807 passed structural Word XML validation.
- Generated PR-1807 nonresident sample populated the resident-agent branch.
- Generated PR-1808 passed structural Word XML validation and blocks generation until an opening path is selected.
- Generated PR-1810 passed structural Word XML validation.
- Generated PR-1811 passed structural Word XML validation and populated inventory totals/schedule rows.
- Generated PR-1817 passed structural Word XML validation and included a service attachment for multiple recipients.
- Generated opening-packet ZIP includes forms, checklist, service list, task list, inventory snapshot, and case data.
- All generated client-sample Word files passed package-level XML parsing.
- Local browser smoke checks confirmed the waiver path enables PR-1803, PR-1804, PR-1808, PR-1810, and PR-1817 while disabling PR-1805.
- Local browser smoke checks confirmed the notice path checklist switches to PR-1805, serve, publish, and wait steps.
- Local browser smoke checks confirmed inventory totals, task rows, PR-1811 generation availability, and ZIP export availability.

Visual render QA note:

- Headless DOCX rendering could not be completed in this environment because the document converter executable is unavailable.
