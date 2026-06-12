# Wisconsin Informal Probate Platform - MVP Product Requirements

Date: June 8, 2026

## Purpose

Create the first build-ready version of a guided Wisconsin informal probate platform. The MVP should help a public user or attorney collect the information needed for a simple uncontested informal probate and generate a court-ready opening packet from Wisconsin PR forms.

The MVP is not the full estate administration product. It should create the foundation for inventory, accounting, service tracking, receipts, and closing, but the first working release should focus on opening the estate correctly.

## Primary Users

### Public self-represented user

A family member or nominated personal representative who wants to understand whether informal probate may be appropriate and prepare the opening packet without starting from blank court forms.

Needs:

- Plain-language questions.
- Save and resume.
- Warnings when attorney review is strongly recommended.
- Downloadable forms and a filing checklist.
- Signature packets for family members or other interested persons.

### Attorney or law firm user

An attorney or staff member preparing informal probate forms for a client.

Needs:

- Faster intake.
- Reusable attorney/preparer profile.
- Editable review screen.
- Client signature packets.
- Matter dashboard with generated documents, deadlines, and missing items.

## MVP Outcome

At the end of the MVP workflow, the user should have:

- A completed estate profile.
- An opening-packet document checklist.
- Draft Wisconsin informal probate opening forms.
- A grouped signature packet.
- A filing checklist.
- A list of missing answers or attorney-review flags.

## In Scope

### 1. Eligibility and path triage

The platform asks initial questions to decide whether the user should continue:

- Wisconsin domicile.
- County of domicile.
- Date of death.
- Estimated gross and net probate property.
- Whether probate property appears to be $50,000 or less.
- Whether the decedent had a will.
- Whether anyone is expected to object.
- Whether all interested persons are known and locatable.
- Whether minors, incompetent persons, missing heirs, or military-service issues appear.
- Whether the estate involves real estate, a business, litigation, large creditor issues, public benefits, or possible tax complexity.

The output should be one of:

- Continue with informal probate intake.
- Consider Transfer by Affidavit or another simpler procedure.
- Attorney review recommended before continuing.
- This may require formal probate or a different proceeding.

### 2. Guided estate intake

The platform collects core estate information once and reuses it across all forms:

- Court county.
- Decedent name.
- Decedent date of birth.
- Decedent date of death.
- Decedent domicile county/state.
- Decedent last mailing address.
- Applicant information.
- Applicant relationship or interested-person capacity.
- Proposed personal representative information.
- Attorney/preparer information if applicable.
- Case number, when known.

### 3. Will and no-will workflow

The user chooses:

- Decedent died with a will/codicil.
- Decedent died without a will.
- User does not know yet.

For a will case, collect:

- Will date.
- Codicil dates.
- Whether the original will is with the court, accompanies the application, was probated elsewhere, or is being delivered to the court.
- Named personal representative.
- Nominated personal representative.
- Named trustee, if any.
- Nominated trustee, if any.
- Whether the will appears to require bond or prohibit informal administration.

For a no-will case, collect:

- Confirmation that user made diligent inquiry and is unaware of an unrevoked will.
- Nominated personal representative.

### 4. Heirship and interested persons

The platform builds both:

- Heirship facts for PR-1806.
- Interested-person list for PR-1801, PR-1803, and service packets.

The user should be guided through:

- Surviving spouse or domestic partner.
- Children, including living, deceased, natural, and adopted children.
- Descendants of deceased children.
- Whether all decedent's children are also children of the surviving spouse/domestic partner.
- Parents, if no spouse/descendants.
- Siblings and descendants, if no parents.
- Grandparents and descendants, if no closer living heirs.
- Persons who died within 120 hours after decedent.
- Minor, disability, guardianship, military, missing-address, and fiduciary flags.

### 5. Public benefits and institution questions

Collect the PR-1801 public-benefits questions:

- Medical Assistance/Medicaid.
- Family Care and/or Partnership benefits through MCO/CMO.
- Community Options Program.
- Wisconsin Chronic Disease Program.
- State or county hospital/institution status.
- Lack of information option.

For spouse/former spouse:

- Living or deceased.
- Married or divorced at death.
- Community Options Program.
- Wisconsin Chronic Disease Program.
- Lack of information option.

### 6. Opening-packet document generation

The MVP generates:

- PR-1801 Application for Informal Administration.
- PR-1803 Waiver and Consent.
- PR-1804 Notice to Creditors.
- PR-1806 Proof of Heirship.
- PR-1807 Consent to Serve.
- PR-1808 Statement of Informal Administration.
- PR-1810 Domiciliary Letters.
- PR-1817 Declaration of Service.

Each form should be generated from a versioned official-template copy, not recreated visually from scratch.

### 7. Review and rejection checker

Before download, the system checks for:

- Missing required fields.
- Name mismatches.
- Date of death inconsistency.
- Date of birth missing on forms that need it.
- Missing county.
- Missing domicile state.
- Will/no-will contradictions.
- Case number presence/absence based on stage.
- Missing proposed personal representative.
- Missing interested-person addresses.
- Minor or incompetent interested person flags.
- Nonresident personal representative without resident agent.
- Unanswered public-benefits section.
- PR-1806 family tree gaps.
- PR-1803 waiver generated for someone who is a minor or incompetent.
- Service packet missing recipient, address, document list, date, or service type.

### 8. Download packet

The user can download:

- Individual editable Word documents.
- Individual PDFs.
- Combined opening packet PDF.
- Signature packet grouped by signer.
- Filing checklist.

## Out of Scope for MVP

The following should be designed for later but not built in the first release:

- PR-1811 inventory engine.
- PR-1814 estate account engine.
- PR-1815 estate receipts.
- PR-1816 closing statement.
- Full ledger reconciliation.
- Direct court e-filing integration.
- Automated newspaper publication submission.
- Payment of filing fees.
- Bank/account integrations.
- Full county-specific local-practice automation.
- AI legal advice or legal conclusions.
- Tax return preparation.

## Core Screens

1. Account start
   - Public user or attorney/law firm.
   - Save-and-resume account.

2. Eligibility triage
   - Simple questions.
   - Continue, pause, or attorney-review recommendation.

3. Estate basics
   - County, decedent, domicile, date of death, date of birth, last address.

4. Applicant and personal representative
   - Applicant details.
   - Proposed personal representative.
   - Wisconsin resident/nonresident.
   - Resident agent if needed.

5. Will path
   - Will or no will.
   - Will/codicil dates.
   - Original will location.
   - Named PR/trustee.
   - Nominated PR/trustee.

6. Benefits and institutions
   - Decedent benefits.
   - Spouse/former spouse benefits.

7. Family tree
   - Heirship questions.
   - Family-tree review.

8. Interested persons
   - Names, roles, addresses.
   - Minor, disability, military, fiduciary flags.
   - Beneficiary/heir/fiduciary relationship tags.

9. Notice and service
   - Waivers needed.
   - Notice to creditors.
   - Declaration of service.

10. Review
   - Form-by-form missing item checker.
   - Attorney-review flags.
   - User confirms answers.

11. Download
   - Opening packet.
   - Signature packets.
   - Filing checklist.

## Key Data Objects

### EstateCase

- id
- jurisdiction_state
- county
- case_number
- stage
- created_by_user_id
- attorney_profile_id
- is_public_user
- created_at
- updated_at

### Decedent

- full_name
- aliases
- date_of_birth
- date_of_death
- domicile_county
- domicile_state
- last_mailing_address
- marital_history
- public_benefits_answers

### Person

- full_name
- mailing_address
- email
- phone
- date_of_birth
- is_minor
- is_incompetent_or_has_guardian
- has_guardian_of_estate
- is_in_military
- attorney_or_attorney_in_fact
- is_deceased
- date_of_death

### InterestedPerson

- person_id
- estate_case_id
- relationship_to_decedent
- role_tags
- beneficiary_under_will
- heir_at_law
- fiduciary
- waiver_needed
- waiver_status
- service_required
- service_status

### WillDocument

- exists
- will_date
- codicil_dates
- original_location_status
- prior_probate_case_number
- named_personal_representatives
- nominated_personal_representatives
- named_trustees
- nominated_trustees
- bond_language_flag
- informal_admin_problem_flag

### HeirshipTree

- surviving_spouse_or_domestic_partner
- children
- descendants_of_deceased_children
- parents
- siblings
- descendants_of_deceased_siblings
- grandparents
- descendants_of_grandparents
- persons_died_within_120_hours
- requires_attachment

### ServiceEvent

- service_date
- server_person_id
- server_city
- server_state
- documents_provided
- original_on_file_or_copy_attached
- recipients
- service_type
- generated_pr_1817_id

## Business Rules

- The platform should collect information once and reuse it everywhere.
- Users should not be able to generate a final packet if required fields are blank.
- Users can generate a draft packet with watermarked "draft" status before all fields are complete.
- Public users should see attorney-review prompts for high-risk facts.
- Attorney users can override warnings with an explanation.
- Minors and incompetent persons should not receive PR-1803 waiver packets as if they can sign personally.
- A nonresident PR requires a resident-agent section on PR-1807.
- The service log should generate PR-1817; users should not have to retype service details into each declaration.
- Form templates must be versioned by source form number, revision date if available, import date, and internal template version.

## Acceptance Criteria

The MVP is ready for testing when:

- A user can complete a simple no-will estate and generate an opening packet.
- A user can complete a simple will estate and generate an opening packet.
- PR-1801 is populated from the shared estate profile without duplicate entry.
- PR-1806 is populated from the family-tree/heirship module.
- PR-1803 waiver packets can be generated for multiple eligible interested persons.
- PR-1807 includes resident-agent information when the proposed PR is not a Wisconsin resident.
- PR-1817 can be generated from a service event.
- The review checker catches missing county, decedent name, date of death, proposed PR, interested-person address, and will/no-will contradiction.
- The user can download individual Word documents, PDFs, and a combined packet.

## First Prototype Scenario

Use this as the first development test case:

- Decedent domiciled in Milwaukee County, Wisconsin.
- Decedent died without a will.
- One adult child is applicant and proposed personal representative.
- No surviving spouse.
- Two adult children total.
- No known objections.
- No public benefits known.
- Probate assets exceed $50,000.
- All interested persons are adults and locatable.

Expected output:

- PR-1801 with no-will path selected.
- PR-1806 showing no spouse, children listed, and heirship flow ending at children.
- PR-1807 for proposed PR.
- PR-1803 waiver for other adult child.
- PR-1804 notice to creditors.
- PR-1808 statement draft.
- PR-1810 domiciliary letters draft.
- PR-1817 service declaration if service event is entered.

## Recommended Build Order

1. Build schema and form-field map.
2. Build static clickable intake prototype.
3. Build PR-1801 generation.
4. Add PR-1806 generation.
5. Add PR-1807 and PR-1803.
6. Add PR-1804, PR-1808, PR-1810, and PR-1817.
7. Add review checker.
8. Add packet download.
9. Add basic matter dashboard.
