# Wisconsin Informal Probate App Roadmap

Working product vision: a guided, TurboTax-style Wisconsin informal probate platform for the public and attorneys. The app should help users decide whether an informal probate is appropriate, gather facts once, generate the correct Wisconsin PR forms, and manage the filing, service, publication, inventory, accounting, and closing tasks.

## Guiding Priorities

1. Keep the first public product narrow enough to be reliable: opening packet first.
2. Use guided interviews for consumers and faster review/edit workflows for attorneys.
3. Treat county-specific filing, service, publication, and deadline rules as first-class product data.
4. Make mobile access part of the core design, not a later cosmetic pass.
5. Use secure links and permissioned access for document delivery rather than ordinary email attachments by default.
6. Preserve a test-scenario library so every rule change can be checked against known probate fact patterns.

## Phase 1: Opening Packet MVP

Goal: reliably prepare the informal probate opening packet.

Core scope:

- Front-door Probate Path Router for Transfer by Affidavit, informal probate, and attorney review.
- Transfer by Affidavit MVP package for likely small estates, including affiant facts, asset/holder rows, official-form section mapping, checklist, product gate, and draft package export.
- Public funnel view for "start free" path check, Transfer by Affidavit pricing, informal probate pricing, and attorney handoff positioning.
- Guided consumer interview for decedent, applicant, proposed personal representative, will/no-will path, heirship, benefits, interested persons, waiver/service status, county filing setup, and opening checklist.
- Form generation for PR-1801, PR-1803, PR-1804, PR-1805, PR-1806, PR-1807, PR-1808, PR-1810, and PR-1817.
- Waiver vs. PR-1805 decision logic, including no-will/not-all-waivers review guardrail.
- Shared waiver and individual waiver modes.
- Opening packet review screen explaining exactly why each form is included.
- Missing-information review with click-through navigation to the right interview area.
- Formal test scenarios for known fact patterns.

Next build items:

- Convert the State Bar Transfer by Affidavit source PDF into a production-grade fillable DOCX/PDF output, including addenda for heirship and service/waiver where required.
- Have Wisconsin probate counsel review Transfer by Affidavit logic, especially waiting period, asset value, real estate, vehicle, public benefits, and creditor issues.
- Keep attorney handoff/referral monetization neutral until Wisconsin ethics counsel reviews the model.
- Expand test scenarios for blended families, deceased children with descendants, trust beneficiaries, charities, out-of-state beneficiaries, military-service flags, and public-benefits follow-up.
- Add a packet readiness gate before export that separates true blockers from court-supplied blanks such as case number, hearing date, and claim deadline.
- Add a plain-language filing instruction screen after packet generation.
- Add attorney review notes for legally sensitive facts.

Definition of done:

- A user can complete a common informal probate opening and export a clean packet.
- The app explains filing, service, publication, and waiting steps based on waiver vs. PR-1805 path.
- All formal test scenarios pass before each release.

## Phase 2: Production Web App Foundation

Goal: move from a browser prototype to a secure, hosted application.

Core scope:

- User accounts for public users, attorneys, staff, and invited case participants.
- Saved case files in a database instead of only browser storage.
- Role-based access: case owner, attorney, staff, personal representative, interested person, read-only recipient.
- Case dashboard with status, deadlines, forms, tasks, and review issues.
- Versioned form templates and versioned decision rules.
- Audit history showing who changed facts, generated forms, sent links, or marked tasks complete.
- Secure document storage and downloads.
- Admin tools for county defaults, official newspaper entries, and form-template maintenance.

Technical direction:

- Responsive web app first.
- Installable PWA once the responsive app is stable.
- Native iOS/Android app only if real usage proves it is worth the added cost.

Definition of done:

- Users can create an account, save a case, return later, and export the same packet from any device.
- Attorneys can manage multiple cases.
- Data is protected with account access, encryption, audit logs, and secure document links.

## Phase 3: Mobile and Secure Sharing

Goal: make the app practical for personal representatives and family members using phones.

Core scope:

- Mobile-first guided interview screens.
- Save-and-resume flow with short steps and clear progress.
- Secure document delivery links to the personal representative, attorney, and selected interested persons.
- Optional email notifications that link to a secure portal.
- Optional SMS reminders for deadlines and missing information.
- Recipient activity tracking: link sent, opened, downloaded, waiver pending, waiver received.

Email/document delivery rule:

- Default to secure download links.
- Avoid attaching probate documents to ordinary email unless the account owner intentionally chooses that option and the risk is explained.

Definition of done:

- A PR can complete or review key steps on a phone.
- The app can send secure packet links and track whether recipients have accessed them.

## Phase 4: Inventory and Estate Accounting

Goal: help the PR administer the estate after letters are issued.

Core scope:

- PR-1811 inventory wizard for real estate, bank accounts, vehicles, investments, personal property, debts/liens, marital property, and non-probate assets.
- Asset attachments and supporting document storage.
- Claims tracking and claim-deadline reminders.
- Estate account ledger with receipts, disbursements, reimbursements, distributions, and running balances.
- Reconciliation tools comparing opening inventory, income, expenses, distributions, and remaining balance.
- Draft accounting/report output for attorney or court review.

Definition of done:

- A PR can enter assets and transactions once and generate inventory/accounting outputs without retyping.
- The app flags common mismatches before closing.

## Phase 5: Closing Workflow

Goal: guide the PR through closing the informal probate.

Core scope:

- Receipts and releases workflow.
- Final tax/public-benefits/claims checklist.
- Closing documents and attorney review prompts.
- Distribution plan and beneficiary signoff tracking.
- Final archive package.

Definition of done:

- The app can tell the PR what remains before closing.
- The estate file can be exported as a clear closing archive.

## Cross-Cutting Backlog

- Accessibility review for screen readers, keyboard navigation, color contrast, and plain-language form labels.
- Legal-content review by Wisconsin probate practitioners before public release.
- County defaults verification process with last-verified dates and sources.
- Official newspaper verification process for all Wisconsin counties.
- Privacy and security review before collecting real user data.
- Error reporting and support workflow.
- Analytics focused on abandoned steps, blocker frequency, and form-generation issues.
- Release checklist tied to test scenarios and form-template validation.

## Immediate Next Build Sequence

1. Add more test scenarios for hard interested-person and heirship patterns.
2. Add packet readiness gating and court-supplied-blank handling.
3. Add filing instruction handoff after packet export.
4. Start production data model design for users, cases, parties, forms, tasks, documents, and audit events.
5. Prototype secure document delivery permissions in the app before connecting real email.
