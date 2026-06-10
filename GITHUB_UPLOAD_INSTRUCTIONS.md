# Wisconsin Probate Forms Prototype - GitHub Upload Instructions

## What This Is

This folder contains the current Wisconsin probate forms prototype. It is a static browser app with local document templates and an optional lightweight Python server.

The app is currently a beta/prototype. It is not ready for paid public launch until the legal-review, official-output, privacy/security, and hosted-account gates are completed.

## How To Run Locally

Option 1: open the static file directly:

`static/index.html`

Option 2: run the local server from this folder:

`python server.py`

Then open the local URL shown by the server.

## Important Launch Notes

- Wisconsin PR forms are standard court forms and should not be altered.
- The current app generates editable Word/DOCX drafts and output manifests.
- Production should provide exact official PDF filing copies or exact approved replicas where required.
- PR-1808 and PR-1810 may need to remain Word/DOCX court-editable drafts for attorney eFiling or court issuance.
- Public users will generally print, wet-sign, and paper file or mail the opening packet.
- Later administration documents such as PR-1811 Inventory should be separated from the opening packet and handled after domiciliary letters issue.

## Before Public Launch

1. Confirm every active PR form against the current Wisconsin Court System form.
2. Finish exact official PDF/print output for launch forms.
3. Complete Wisconsin probate attorney beta review of the hard test scenarios.
4. Replace local browser storage with hosted secure accounts and encrypted matter/document storage.
5. Add production payment processing only after terms, refund policy, support scope, and secure-download flow are approved.

## GitHub Upload

Upload this folder as the project root or place it inside a repository folder. Keep these directories together:

- `static`
- `templates`
- `README.md`
- `PRODUCT_ROADMAP.md`
- `PRODUCTION_ARCHITECTURE.md`
- `GITHUB_UPLOAD_INSTRUCTIONS.md`

The `generated` sample-output folder is not required to run the app and should usually be excluded from GitHub. Do not publish real user probate data, generated client packets, or test files containing private facts.
