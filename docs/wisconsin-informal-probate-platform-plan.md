# Wisconsin Informal Probate Platform Plan

Date: June 8, 2026

## Goal

Build a guided website for Wisconsin informal probate that works like TurboTax: it asks plain-language questions once, stores the answers in a structured estate file, and generates the correct Wisconsin probate PR forms with repeated information carried into the right places.

The first release should focus on opening the informal probate and producing the form packet accurately. The data model should still be designed from the beginning to support the later inventory, accounting, receipt, and closing workflow.

## Product Positioning

The product should have two modes:

1. Public self-help mode
   - Plain-language guided interview.
   - Eligibility screening before users invest time.
   - Clear warnings when the estate is not a good DIY candidate.
   - Court-ready draft forms and filing checklists.
   - No hidden legal conclusions presented as certainty.

2. Attorney mode
   - Client intake portal.
   - Attorney profile reusable across cases.
   - Faster data entry and editable review screen.
   - Client signature packet.
   - Matter dashboard with deadlines, generated forms, and service history.

Important note from the attached forms: several copies include Bradley J. Sarkauskas / Heritage Law information in the "Form completed by" section. The platform should strip that out of public templates and populate it dynamically from either the attorney profile or the self-represented user's information.

## Sources Checked

- Wisconsin Court System probate self-help page: https://www.wicourts.gov/services/public/selfhelp/probate.htm
- Wisconsin Court System probate forms list: https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=26&FormName=&FormNumber=&StatuteCite=&beg_date=05%2F30%2F2024&end_date=05%2F30%2F2024
- A Personal Representative's Guide to Informal Estate Administration in Wisconsin: https://www.wicourts.gov/services/public/selfhelp/docs/probateguide.pdf
- Wisconsin Court System PR-1801 summary: https://www.wicourts.gov/formdisplay/PR-1801_summary.pdf?formNumber=PR-1801&formType=Summary&formatId=2&language=en
- Wisconsin Court System PR-1831 Transfer by Affidavit listing: https://www.wicourts.gov/forms1/circuit/ccform.jsp?FormNumber=PR-1831

## Forms in the Attached Packet

Opening and appointment:

| Form | Purpose | User data needed |
|---|---|---|
| PR-1801 | Application for Informal Administration | County, decedent, applicant, domicile, prior proceedings, estate value estimate, public benefits, spouse history, will/codicil details, interested persons, nominated PR/trustee |
| PR-1803 | Waiver and Consent | Interested person identity, will/no-will status, will/codicil dates, proposed PR, signature block |
| PR-1806 | Proof of Heirship | Informant, spouse/domestic partner, children, descendants, parents, siblings, grandparents/descendants if needed, survival/death details |
| PR-1807 | Consent to Serve | Proposed PR, role, Wisconsin residency, resident agent if needed |
| PR-1808 | Statement of Informal Administration | Court-facing order draft, will/no-will findings, PR appointment, bond/trustee terms |
| PR-1810 | Domiciliary Letters | Decedent, DOB/DOD, domicile, PR authority, case number |
| PR-1804 | Notice to Creditors | Decedent, domicile, claim deadline, courthouse address, publication details |
| PR-1817 | Declaration of Service | Server, documents served, recipients, addresses, service type |

Post-appointment:

| Form | Purpose | User data needed |
|---|---|---|
| PR-1811 | Inventory | Date of death values, assets subject to administration, encumbrances/liens, marital property flag, net value |
| PR-1814 | Estate Account | Inventory net value, receipts, disbursements, distributions, assets on hand, proposed final distribution, fees |
| PR-1815 | Estate Receipt | Recipient, item/money received, full/partial distribution, claim satisfaction, trust distribution |
| PR-1816 | Personal Representative's Statement to Close Estate | Notice/creditor/inventory/account completion, unpaid liabilities, attorney fees, closing verification |

Likely missing conditional forms to add to the platform:

| Form | When needed |
|---|---|
| PR-1802 | A nominated PR or trustee declines to serve or resigns |
| PR-1809A / bond forms | Bond required by will, court, or circumstances |
| PR-1930 | Testamentary trustee consent |
| PR-1819 | Claim against estate, usually creditor-side but relevant to accounting |
| PR-1820 / GAL-related forms | Minor, incompetent, unborn, unknown, or otherwise protected interested persons |
| PR-1831 | Transfer by Affidavit may be an alternative when Wisconsin property subject to administration is $50,000 gross or less |

## User Journey

### 1. Start With Eligibility Screening

Ask only enough questions to decide whether informal probate is appropriate:

- Did the person die domiciled in Wisconsin?
- What county?
- Is there real estate or other property titled only in the decedent's name?
- Is the gross probate property $50,000 or less, making Transfer by Affidavit worth considering?
- Is there a will?
- Is anyone likely to object?
- Are all interested persons known and locatable?
- Are there minors, incompetent persons, missing heirs, nonmarital children, blended family issues, or disputed beneficiaries?
- Are there large debts, tax problems, a business, farm, litigation, out-of-state property, or Medicaid/estate recovery issues?

Output:

- "Informal probate appears potentially suitable."
- "A simpler non-probate transfer may be available."
- "This looks like an attorney-review case."
- "This may require formal probate or a different proceeding."

### 2. Build the Estate Profile

Collect common information once:

- Court county and courthouse filing information.
- Decedent legal name, aliases, date of birth, date of death, domicile county/state, mailing address.
- Applicant information and basis as an interested person.
- Proposed personal representative information.
- Attorney/preparer information if applicable.
- Case number once assigned.
- Will/codicil details and nominated fiduciaries.
- Public benefits and institution questions.
- Spouse/former spouse details.
- Interested persons list.
- Service preferences and addresses.

This profile should auto-populate headers, captions, signature blocks, and repeated facts across every PR form.

### 3. Family Tree / Heirship Builder

The hardest consumer-facing section should be visual and conversational.

The system should ask:

- Surviving spouse or domestic partner?
- Children, including adopted or deceased children?
- Descendants of deceased children?
- If no spouse/descendants, parents?
- If no parents, siblings and descendants?
- If no living persons in those categories, grandparents and descendants?

The user should see a simple family-tree preview and a generated interested-person list. The platform should explain that "heirs" and "beneficiaries under a will" can be different groups and may both need notice.

### 4. Opening Packet Generator

For the MVP, generate:

- PR-1801 Application for Informal Administration.
- PR-1806 Proof of Heirship.
- PR-1807 Consent to Serve.
- PR-1803 Waiver and Consent packets for each interested person, when appropriate.
- PR-1804 Notice to Creditors.
- PR-1808 Statement of Informal Administration.
- PR-1810 Domiciliary Letters.
- PR-1817 Declaration of Service for served documents.
- A filing checklist specific to the user's county, with a placeholder if the county has local requirements not yet built into the system.

The user should be able to download:

- Editable Word files.
- Flattened PDFs for filing/review.
- A single filing packet.
- A signature packet grouped by signer.

### 5. Inventory Module

This should come immediately after the opening packet, but can be phase two.

Asset categories:

- Real estate.
- Bank accounts.
- Brokerage/investment accounts.
- Vehicles.
- Tangible personal property.
- Business interests.
- Refunds, final wages, insurance payable to estate.
- Digital property if applicable.
- Other probate assets.

For each asset:

- Description.
- Owner/title status.
- Probate/non-probate classification.
- Date of death value.
- Encumbrance/lien/charge.
- Marital property flag.
- Valuation source.
- Documents uploaded.

Outputs:

- PR-1811 Inventory.
- Supporting schedules.
- Filing fee estimate based on inventory net value, flagged for attorney/user verification.
- Declaration of Service after inventory is mailed to interested persons.

### 6. Ledger and Accounting Module

Design this data structure now, even if the UI comes later.

Each entry should be a transaction tied to:

- Asset or cash account.
- Date.
- Payee/payer.
- Amount.
- Category mapped to PR-1814 schedules A-O.
- Receipt/disbursement/distribution/assets-on-hand classification.
- Document proof.
- Whether it affects inventory value, cash, gain/loss, or final distribution.

PR-1814 reconciliation rule:

Receipts side:

- Inventory net value.
- Added property.
- Dividends.
- Interest.
- Capital gains/losses.
- Other receipts.

Disbursements side:

- Funeral expenses.
- Debts.
- Claims.
- Taxes.
- Interest paid.
- Administration expenses.
- Other payments.
- Distributions paid to date.
- Assets on hand.

The platform should not let the final account be marked ready until total receipts equal total disbursements plus assets on hand, and Schedule O proposed distribution matches assets on hand.

### 7. Receipts and Closing

After accounting:

- Generate PR-1815 Estate Receipt for each distributee, creditor, claimant, or trust as needed.
- Track who signed and who has not.
- Generate PR-1817 Declaration of Service for account and closing documents.
- Generate PR-1816 Personal Representative's Statement to Close Estate.
- Produce a closing checklist including claims deadline, publication proof, tax/fiduciary closing certificate if applicable, inventory/account service, receipts, and final filing.

## Data Model

Core tables/objects:

- EstateCase
- CourtCounty
- Decedent
- Person
- Address
- Relationship
- InterestedPerson
- Applicant
- Fiduciary
- AttorneyProfile
- WillDocument
- Codicil
- PublicBenefitsAnswers
- HeirshipTree
- Asset
- Liability
- Claim
- Transaction
- DistributionPlan
- ServiceEvent
- GeneratedDocument
- SignatureRequest
- Deadline
- AuditLog

Every form field should map to a stable JSON path, for example:

- estate.county
- decedent.full_name
- decedent.aliases
- decedent.date_of_birth
- decedent.date_of_death
- applicant.interested_capacity
- fiduciaries.personal_representatives[]
- will.exists
- will.date
- codicils[].date
- interested_persons[]
- inventory.assets[]
- ledger.transactions[]

## Form Generation Approach

Use official Wisconsin Court System forms as versioned templates. Do not visually redraw the forms in HTML unless needed for review. The court forms state that they should not be modified, though they may be supplemented.

Recommended approach:

1. Maintain a clean template library.
2. Create a field map for each form.
3. Populate Word forms through an OpenXML-based document engine.
4. Generate supplemental schedules when the form rows overflow.
5. Convert to PDF for user review and filing.
6. Run automated visual comparison tests to catch broken layouts.

Avoid using raw x/y PDF coordinate stamping as the primary system. It is brittle when official forms change.

## Consumer UX Principles

- Ask one question per screen for complex legal facts.
- Use "I don't know" options where the form permits lack of information.
- Show a "why this matters" help drawer, not long paragraphs in the main flow.
- Let users save and resume.
- Let users invite a co-PR, heir, beneficiary, or attorney.
- Always show what documents have been generated and what remains to be done.
- Use warning screens for high-risk answers instead of letting users blindly continue.

## Legal and Compliance Guardrails

- Attorney-reviewed content for all legal explanations and branching rules.
- Public mode should provide legal information, not legal advice.
- Strong referral points for contested estates, minor/incompetent interested persons, insolvent estates, complicated marital property, nonresident decedents, ancillary administration, tax issues, missing heirs, possible will contests, creditor disputes, and real estate complications.
- Clear disclaimers, but not as a substitute for accurate workflow design.
- Protect confidential information. The Wisconsin guide specifically warns against putting protected identifiers such as Social Security numbers and financial account numbers on public documents unless handled through the proper confidential disclosure process.
- Audit trail of all user answers, form versions, generated documents, and changes.
- Encryption at rest and in transit.
- Role-based access for attorney staff and clients.
- Retention/deletion policy.
- Annual or automated form-version review against Wisconsin Court System forms.

## Technical Stack

Recommended stack:

- Frontend: Next.js / React with TypeScript.
- Backend: TypeScript API or .NET API.
- Database: PostgreSQL.
- ORM: Prisma or Entity Framework.
- Document engine: OpenXML SDK, docxtemplater, or a custom OpenXML layer after prototype testing.
- File storage: encrypted object storage.
- Authentication: email/password plus passkeys or MFA for attorney accounts.
- Payments: Stripe if charging consumers or law-firm subscriptions.
- Hosting: cloud provider with strong audit/security posture.

## MVP Scope

MVP should include:

- Eligibility screen.
- Estate profile.
- Decedent/applicant/PR intake.
- Will/no-will path.
- Interested persons list.
- Heirship questionnaire.
- Opening packet document generation.
- Signature packet generation.
- Service tracking.
- County filing checklist with manual local-rule notes.
- Attorney profile and public self-represented profile.

MVP should exclude:

- Direct court e-filing integration.
- Full inventory reconciliation.
- Automated legal advice about contested rights.
- Tax return preparation.
- Estate bank account integration.
- Automatic determination of every county-specific local practice.

## Development Phases

### Phase 1 - Form and Rules Blueprint, 2-3 weeks

- Build the master field map for each attached form.
- Identify conditional forms not attached.
- Draft the guided interview.
- Create canonical estate JSON schema.
- Create the attorney/public UX prototype.
- Confirm county-specific requirements strategy.

### Phase 2 - Opening Packet MVP, 6-8 weeks

- Build intake workflow.
- Build people/interested-person system.
- Build heirship questionnaire.
- Build Word/PDF generation for PR-1801, PR-1803, PR-1806, PR-1807, PR-1808, PR-1810, PR-1804, and PR-1817.
- Build review screen and downloadable packets.
- Add test cases for common scenarios.

### Phase 3 - Inventory, 4-6 weeks

- Build asset intake.
- Classify probate vs non-probate assets.
- Generate PR-1811 and supporting schedules.
- Add filing fee estimate and service tracking.

### Phase 4 - Accounting and Closing, 8-10 weeks

- Build ledger.
- Map ledger categories to PR-1814 schedules.
- Add reconciliation checks.
- Generate PR-1814, PR-1815, PR-1816, and PR-1817.
- Add final closing checklist.

### Phase 5 - Attorney Practice Features, 4-8 weeks

- Client portal.
- Staff roles.
- Matter dashboard.
- Form review comments.
- Bulk client reminders.
- Optional law-firm branding.

## Testing Plan

Create scenario-based test estates:

- No will, surviving spouse only.
- No will, spouse plus children all from same spouse.
- No will, spouse plus children from another relationship.
- Will with named PR and all waivers.
- Will with nominated PR declining.
- Nonresident PR needing resident agent.
- Minor interested person requiring attorney review/GAL workflow.
- Probate assets under $50,000 where Transfer by Affidavit may be better.
- Real estate with mortgage.
- Inventory with marital property.
- Final account with sale gain/loss and partial distributions.

For each scenario:

- Verify required forms.
- Verify omitted forms.
- Verify repeated facts match across forms.
- Verify checkboxes.
- Verify math.
- Verify signature packets.
- Verify supplemental schedules when rows overflow.

## Recommended First Build Decision

Start with the opening packet MVP, but create the full estate data model and ledger placeholders now. That gives consumers immediate value and avoids reworking the app when inventory and accounting are added.

The first polished demo should let a user complete a simple uncontested Wisconsin informal probate with:

- Decedent information.
- Applicant and PR information.
- Will/no-will facts.
- Interested persons.
- Heirship facts.
- Generated opening packet.
- Filing and signature checklist.

That demo will prove the central idea before investing in the more complex accounting engine.
