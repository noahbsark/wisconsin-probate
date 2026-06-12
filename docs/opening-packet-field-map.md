# Wisconsin Informal Probate Opening Packet - Form Field Map

Date: June 8, 2026

## Purpose

This field map converts the opening-packet Wisconsin PR forms into a shared intake schema. The goal is to ask each question once, store the answer in a stable data path, and reuse it across all required forms.

This is a planning map, not the final technical template map. The next technical step is to keep tagging each Word template field with the matching data path and create automated tests for populated documents.

## Opening Packet Forms

| Form | Name | MVP role |
|---|---|---|
| PR-1801 | Application for Informal Administration | Main intake spine |
| PR-1803 | Waiver and Consent | Generated per eligible interested person |
| PR-1804 | Notice to Creditors | Generated after application filing info and claim deadline are known |
| PR-1805 | Notice Setting Time to Hear Application and Deadline for Filing Claims | Used when all waivers are not available and the decedent had a will |
| PR-1806 | Proof of Heirship | Generated from family tree/heirship module |
| PR-1807 | Consent to Serve | Generated for proposed PR and resident agent if needed |
| PR-1808 | Statement of Informal Administration | Court order draft from PR-1801 facts |
| PR-1810 | Domiciliary Letters | Authority document draft from decedent and PR facts |
| PR-1817 | Declaration of Service | Generated from service log |

## Shared Data Paths

### Estate and court

| Data path | Description | Used by |
|---|---|---|
| estate.county | Wisconsin county for probate venue | All forms |
| estate.case_number | Court case number, once assigned | All forms after assignment |
| estate.administration_type | informal or formal; MVP defaults to informal | PR-1806, PR-1807, PR-1810 |
| estate.is_amended | Whether a generated form is amended | All forms with amended checkbox |

### Opening path

| Data path | Description | Used by |
|---|---|---|
| opening.waiver_status | all_signed, not_all, or unknown | Branches to waiver opening, PR-1805 notice path, or more intake |
| opening.path_recommendation | Derived path: waiver, notice_1805, or formal_review | Review screen and packet checklist |
| opening.unknown_interested_persons_status | none, some_unknown, or unknown | PR-1805 publication/service planning |
| notice_1805.courthouse_county | Court/courthouse name for hearing notice | PR-1805 |
| notice_1805.courthouse_address | Hearing and claim filing address | PR-1805 |
| notice_1805.room | Room number if known | PR-1805 |
| notice_1805.registrar_name | Probate Registrar name/label if provided | PR-1805 |
| notice_1805.hearing_date | Hearing date, usually supplied by the Probate Registrar | PR-1805 |
| notice_1805.hearing_time | Hearing time, usually supplied by the Probate Registrar | PR-1805 |
| notice_1805.claim_deadline | Claims deadline, usually supplied by the Probate Registrar | PR-1805 |
| notice_1805.unknown_interested_persons | Text naming unknown persons or address groups | PR-1805 |
| notice_1805.accommodation_phone | Court accommodation phone number | PR-1805 |
| notice_1805.check_exact_time | Whether to check exact time/date with named person | PR-1805 |
| notice_1805.newspaper_name | Newspaper selected for publication | PR-1805 |

Branch rule for this map: if every interested person can sign PR-1803, use the waiver opening path and prepare PR-1804 after filing/claims information is available. If not all waivers are available and the decedent had a will, use PR-1805. If not all waivers are available and the decedent did not have a will, flag the case for formal-administration or attorney review instead of generating PR-1805.

### Decedent

| Data path | Description | Used by |
|---|---|---|
| decedent.full_name | Decedent legal name | All captions |
| decedent.aliases | Other names, if needed | Caption attachment or review screen |
| decedent.date_of_birth | Date of birth | PR-1801, PR-1804, PR-1810 |
| decedent.date_of_death | Date of death | PR-1801, PR-1804, PR-1808, PR-1810 |
| decedent.domicile_county | Domicile county | PR-1801, PR-1804, PR-1810 |
| decedent.domicile_state | Domicile state | PR-1801, PR-1804, PR-1810 |
| decedent.last_mailing_address | Decedent mailing address | PR-1801, PR-1804 |

### Applicant

| Data path | Description | Used by |
|---|---|---|
| applicant.person.full_name | Applicant name | PR-1801 signature |
| applicant.person.address | Applicant address | PR-1801 signature |
| applicant.person.email | Applicant email | PR-1801 signature |
| applicant.person.phone | Applicant phone | PR-1801 signature |
| applicant.person.state_bar_number | Bar number if applicant is attorney | PR-1801 signature if applicable |
| applicant.interested_capacity | Why applicant is interested | PR-1801 question 2 |
| applicant.signature_date | Signature date | PR-1801 signature |

### Personal representative

| Data path | Description | Used by |
|---|---|---|
| personal_representatives[].person.full_name | Proposed PR name | PR-1801, PR-1803, PR-1807, PR-1808, PR-1810 |
| personal_representatives[].person.address | PR address | PR-1807 signature |
| personal_representatives[].person.email | PR email | PR-1807 signature |
| personal_representatives[].person.phone | PR phone | PR-1807 signature |
| personal_representatives[].is_wisconsin_resident | Residency flag | PR-1807 |
| personal_representatives[].requires_resident_agent | Derived from nonresident status | PR-1807 |
| personal_representatives[].resident_agent | Resident agent person | PR-1807 |
| personal_representatives[].bond_required | Whether bond required | PR-1808 |
| personal_representatives[].bond_type | none, signature, surety | PR-1808 |
| personal_representatives[].bond_amount | Surety bond amount if required | PR-1808 |

### Will and codicils

| Data path | Description | Used by |
|---|---|---|
| will.exists | yes/no/unknown | PR-1801, PR-1803, PR-1808 |
| will.date | Will date | PR-1801, PR-1803, PR-1808 |
| will.codicils[].date | Codicil dates | PR-1801, PR-1803, PR-1808 |
| will.original_location_status | possession of court, accompanies application, probated elsewhere, en route | PR-1801, PR-1808 |
| will.prior_probate_case_number | Prior case number if will in court/probated elsewhere | PR-1801 |
| will.named_personal_representatives | PRs named in will/codicil | PR-1801 |
| will.nominated_personal_representatives | PRs nominated in application | PR-1801, PR-1803, PR-1808, PR-1810 |
| will.named_trustees | Trustees named in will/codicil | PR-1801 |
| will.nominated_trustees | Trustees nominated in application | PR-1801, PR-1808 |
| will.trusts[] | Trust name and trustee info | PR-1801, PR-1808 |

### Public benefits

| Data path | Description | Used by |
|---|---|---|
| benefits.medical_assistance | did, did not, unknown | PR-1801 question 5 |
| benefits.family_care_or_partnership | did, did not, unknown | PR-1801 question 5 |
| benefits.community_options_program | did, did not, unknown | PR-1801 question 5 |
| benefits.chronic_disease_program | did, did not, unknown | PR-1801 question 5 |
| benefits.state_or_county_institution | was, was not, unknown | PR-1801 question 5 |
| benefits.explanation | Explanation text | PR-1801 question 5 |
| benefits.lack_information | User lacks information for section | PR-1801 question 5 |

### Spouse and marital history

| Data path | Description | Used by |
|---|---|---|
| spouses[].person.full_name | Spouse/former spouse name | PR-1801 question 6 |
| spouses[].is_living | living/deceased | PR-1801 question 6 |
| spouses[].status_at_death | married or divorced at death | PR-1801 question 6 |
| spouses[].community_options_program | did/did not/unknown | PR-1801 question 6 |
| spouses[].chronic_disease_program | did/did not/unknown | PR-1801 question 6 |
| spouses[].lack_information | User lacks information | PR-1801 question 6 |
| spouses.requires_attachment | More than one spouse/former spouse or overflow | PR-1801 question 6 |

### Interested persons

| Data path | Description | Used by |
|---|---|---|
| interested_persons[].person.full_name | Name | PR-1801, PR-1817 |
| interested_persons[].relationship_label | Heir, beneficiary, fiduciary, etc. | PR-1801 |
| interested_persons[].person.address | Mailing address | PR-1801, PR-1817 |
| interested_persons[].person.date_of_birth | Date of birth if minor | PR-1801 |
| interested_persons[].is_minor | Minor flag | PR-1801, waiver rules |
| interested_persons[].has_guardian | Guardian flag | PR-1801, waiver rules |
| interested_persons[].guardian_person | Guardian of estate if applicable | PR-1801 |
| interested_persons[].is_in_military | Military flag | PR-1801 |
| interested_persons[].attorney_or_attorney_in_fact | Military attorney/attorney-in-fact | PR-1801 |
| interested_persons.requires_attachment | Too many rows or protected details | PR-1801 |

### Preparer

| Data path | Description | Used by |
|---|---|---|
| preparer.full_name | Form completed by name | All forms with preparer block |
| preparer.address | Preparer address | All forms with preparer block |
| preparer.email | Preparer email | Forms with email in preparer block |
| preparer.phone | Preparer telephone | All forms with preparer block |
| preparer.state_bar_number | Bar number if any | All forms with preparer block |
| preparer.mode | attorney, staff, self-represented | Determines default block |

## PR-1801 Detailed Field Map

### Caption and header

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| County | estate.county | county select | Required |
| Estate of name | decedent.full_name | text | Required |
| Amended checkbox | estate.forms.pr_1801.is_amended | boolean | Usually false for first filing |
| Case number | estate.case_number | text | Often blank before filing |

### Declaration question 1 - decedent domicile

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Date of birth | decedent.date_of_birth | date | Required unless unknown policy set |
| Date of death | decedent.date_of_death | date | Required |
| Domicile county | decedent.domicile_county | county text/select | Required |
| Domicile state | decedent.domicile_state | state select | Required; expected Wisconsin for primary path |
| Mailing address | decedent.last_mailing_address | address | Required if known |

### Declaration question 2 - applicant interest

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| I am interested as | applicant.interested_capacity | select/text | Examples: heir, beneficiary, nominated PR, creditor, spouse |

### Declaration question 3 - other proceedings

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Proceedings are pending | estate.other_proceedings.status | yes/no/unknown | Required |
| Explain | estate.other_proceedings.explanation | long text | Required if pending or unknown/problem |

### Declaration question 4 - estimated net value

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Estimated net value | estate.estimated_net_probate_value | currency | Used for triage and opening form |
| Gross probate estimate | estate.estimated_gross_probate_value | currency | Not directly on PR-1801 but needed for Transfer by Affidavit screening |

### Declaration question 5 - decedent benefits

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Medical Assistance/Medicaid did/did not | benefits.medical_assistance | yes/no/unknown | If unknown, consider lack-information checkbox |
| Family Care/Partnership did/did not | benefits.family_care_or_partnership | yes/no/unknown | Plain-language explanation needed |
| Community Options Program did/did not | benefits.community_options_program | yes/no/unknown | Plain-language explanation needed |
| Wisconsin Chronic Disease Program did/did not | benefits.chronic_disease_program | yes/no/unknown | Plain-language explanation needed |
| State/county hospital or institution was/was not | benefits.state_or_county_institution | yes/no/unknown | Includes responsibility for person owing obligation |
| Explain | benefits.explanation | long text | Required for yes or uncertain cases |
| I lack information | benefits.lack_information | boolean | Set when user cannot answer |

### Declaration question 6 - spouse history

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| See attached for more than one spouse | spouses.requires_attachment | boolean | Auto true if more than one spouse/former spouse |
| Name of spouse | spouses[0].person.full_name | text | Required if decedent was ever married |
| Living/deceased | spouses[0].is_living | enum | Required if spouse row exists |
| Married/divorced at death | spouses[0].status_at_death | enum | Required if spouse row exists |
| Spouse COP did/did not | spouses[0].community_options_program | yes/no/unknown | Required unless lack information |
| Spouse Chronic Disease did/did not | spouses[0].chronic_disease_program | yes/no/unknown | Required unless lack information |
| Lack information | spouses[0].lack_information | boolean | If user cannot answer spouse benefit section |

### Declaration question 7 - will path

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Question 7 selected | will.exists == true | derived checkbox | Mutually exclusive with question 8 |
| Will checkbox | will.exists | boolean | Checked when will exists |
| Will date | will.date | date | Required if will exists |
| Codicil checkbox | will.has_codicils | boolean | Derived from codicils array |
| Codicil dates | will.codicils[].date | repeating dates | Use comma-separated text or attachment |
| Original in possession of court | will.original_location_status | enum | One of four statuses |
| Court case number | will.prior_probate_case_number | text | If in court/probated elsewhere and known |
| Accompanies application | will.original_location_status | enum | One of four statuses |
| Probated elsewhere | will.original_location_status | enum | Requires authenticated copy |
| En route to court | will.original_location_status | enum | For eFilers |
| PR named in will/codicil | will.named_personal_representatives | repeating person names | Use attachment if overflow |
| I nominate PR | will.nominated_personal_representatives | repeating person names | Required |
| Trustees named | will.named_trustees | repeating person names | Optional |
| I nominate trustees | will.nominated_trustees | repeating person names | Optional unless trustee appointment requested |

### Declaration question 8 - no-will path

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Question 8 selected | will.exists == false | derived checkbox | Mutually exclusive with question 7 |
| Diligent inquiry/no unrevoked will | will.no_will_diligent_inquiry_confirmed | boolean | Required if no-will path |
| I nominate PR | intestacy.nominated_personal_representatives | repeating person names | Same people as personal_representatives array |

### Declaration question 9 - interested persons

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| See attached | interested_persons.requires_attachment | boolean | Auto true if rows exceed form capacity |
| Name | interested_persons[].person.full_name | repeating text | Required |
| Relationship | interested_persons[].relationship_label | repeating text | Required |
| Mailing address | interested_persons[].person.address | repeating address | Required unless unknown and attorney-review flag |
| Minor date of birth | interested_persons[].person.date_of_birth | date | Required if minor |
| Guardian/attorney details | interested_persons[].representative_details | attachment text | Required when flagged |

### Declaration question 10 - other

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Other selected | estate.forms.pr_1801.other_selected | boolean | Optional |
| Other text | estate.forms.pr_1801.other_text | long text | Required if selected |

### Requests section

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Statement of informal administration requested | estate.requests.statement_informal_administration | boolean | Default true |
| Will/codicils admitted | estate.requests.admit_will | derived boolean | True if will exists |
| Domiciliary letters issued to | estate.requests.domiciliary_letters_to | repeating person names | Usually personal_representatives |
| Trustee appointment selected | estate.requests.appoint_trustee | boolean | True if trust appointment requested |
| Trustee names | estate.requests.trustee_names | repeating person names | Required if selected |
| Trust name | estate.requests.trust_name | text | Required if selected |
| See attachment additional trusts | estate.requests.additional_trusts_attachment | boolean | Derived if multiple trusts |
| Other selected | estate.requests.other_selected | boolean | Optional |
| Other text | estate.requests.other_text | long text | Required if selected |

### Applicant signature and preparer block

| Form location | Data path | Input type | Notes |
|---|---|---|---|
| Applicant signature line | applicant.signature_placeholder | generated blank/signature | Leave blank for wet/e-signature |
| Name printed or typed | applicant.person.full_name | text | Required |
| Address | applicant.person.address | address | Required |
| Email | applicant.person.email | email | Optional but helpful |
| Telephone | applicant.person.phone | phone | Required if available |
| Date | applicant.signature_date | date | User enters at signing or left blank |
| State Bar No. | applicant.person.state_bar_number | text | Only if applicable |
| Form completed by name | preparer.full_name | text | Attorney profile or self-represented user |
| Form completed by address | preparer.address | address | Required |
| Form completed by email | preparer.email | email | Required if available |
| Form completed by phone | preparer.phone | phone | Required |
| Form completed by bar number | preparer.state_bar_number | text | If any |

## PR-1803 Waiver and Consent Map

Generate one waiver packet per eligible adult interested person who can consent.

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Amended checkbox | estate.forms.pr_1803.is_amended | Usually false |
| Will copy received | waiver.recipient_received_will_copy | Used for will cases |
| Notice of bequest received | waiver.recipient_received_bequest_notice | Alternative will-case option |
| Decedent died leaving no will | will.exists == false | Used for no-will cases |
| Consent to admission of will | waiver.consent_to_admit_will | Usually true in will waiver |
| Will/codicil dates | will.date, will.codicils[].date | Shared |
| Consent to PR appointment | personal_representatives[].person.full_name | Shared |
| Other | waiver.other_text | Optional |
| Signer blocks | waiver.signers[] | Usually one signer per generated packet, but form allows many |
| Preparer block | preparer.* | Shared |

Rules:

- Do not generate a standard personal waiver for minors or incompetent persons without attorney workflow.
- If no will, select the no-will option and omit will/codicil consent unless attorney overrides.
- If will exists, require user to choose copy of will or bequest notice option.

## PR-1804 Notice to Creditors Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Amended checkbox | estate.forms.pr_1804.is_amended | Usually false |
| Decedent date of birth | decedent.date_of_birth | Shared |
| Decedent date of death | decedent.date_of_death | Shared |
| Domicile county/state | decedent.domicile_county, decedent.domicile_state | Shared |
| Mailing address | decedent.last_mailing_address | Shared |
| Claim deadline | creditors.claim_deadline | User/court value; validate format |
| County courthouse | court.county_courthouse_name | County data table |
| Courthouse address | court.courthouse_address | County data table |
| Room | court.probate_room | County data table or manual entry |
| Publication newspaper | publication.newspaper_name | Used in non-print instruction area |
| Preparer block | preparer.* | Shared |

Rules:

- Claim deadline and publication details should be editable because the court/register may provide them.
- App should warn that the non-print newspaper instruction section may need removal or special handling depending on generated output.

## PR-1806 Proof of Heirship Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Informal administration checkbox | estate.administration_type == informal | Default true |
| Informant name/address/relationship | heirship.informant.person.*, heirship.informant.relationship_to_decedent | Can default to applicant |
| Surviving spouse/domestic partner yes/no | heirship.surviving_spouse.exists | Required |
| Surviving spouse/domestic partner name | heirship.surviving_spouse.person.full_name | Required if yes |
| Children yes/no | heirship.children.exists | Required |
| Children list | heirship.children[] | Include deceased date if applicable |
| Descendants of deceased children | heirship.deceased_child_descendant_groups[] | Attachment if complex |
| All children also children of surviving spouse | heirship.all_children_of_surviving_spouse | Required if surviving spouse and children |
| Details if no | heirship.blended_family_details | Required if no |
| Surviving parents yes/no | heirship.parents.exists | Asked only if no living spouse/descendants |
| Parent names | heirship.parents[] | Required if yes |
| Siblings yes/no | heirship.siblings.exists | Asked if no spouse/descendants/parents |
| Sibling list | heirship.siblings[] | Include deceased date |
| Descendants of deceased siblings | heirship.deceased_sibling_descendant_groups[] | Attachment if complex |
| Grandparents/descendants | heirship.grandparent_lines | Asked if no closer living heirs |
| 120-hour deaths | heirship.persons_died_within_120_hours[] | Required yes/no |
| Signature block | heirship.informant.signature.* | Usually informant |
| Preparer block | preparer.* | Shared |

Rules:

- The UI should branch exactly like the form: if living persons exist in questions 2 through 4, skip parents/siblings/grandparents and go to question 8.
- Complex descendants should generate attachments rather than forcing cramped text into form rows.
- The 120-hour question must always be asked before completion.

## PR-1807 Consent to Serve Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Informal administration checkbox | estate.administration_type == informal | Default true |
| Role personal representative | consent_to_serve.role == personal_representative | Default for MVP |
| Role special administrator | consent_to_serve.role == special_administrator | Later/attorney workflow |
| Required bond statement | personal_representatives[].bond_required | Form text says PR will file any required bond |
| Nonresident checkbox | personal_representatives[].is_wisconsin_resident == false | Required if nonresident |
| Resident agent name | personal_representatives[].resident_agent.person.full_name | Required if nonresident |
| PR signature block | personal_representatives[].person.* | One form per PR if needed |
| Resident agent acceptance | resident_agent.signature.* | Required if nonresident |
| Preparer block | preparer.* | Shared |

Rules:

- If PR is nonresident, block completion until resident agent information is entered.
- If multiple PRs, generate a separate consent or a multi-signer packet depending on template capacity and court preference.

## PR-1808 Statement of Informal Administration Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Notice given or waived | estate.notice_status | Derived from waivers/service |
| Date of death | decedent.date_of_death | Shared |
| No will | will.exists == false | Derived |
| Will date | will.date | Shared |
| Codicil dates | will.codicils[].date | Shared |
| Will location option | will.original_location_status | Shared |
| Nominated PRs | personal_representatives[].person.full_name | Shared |
| Other administration pending/no pending | estate.other_proceedings.status | Shared |
| Other findings | estate.forms.pr_1808.other_findings | Optional |
| Application granted | estate.requests.statement_informal_administration | Default true |
| Will admitted | estate.requests.admit_will | Derived |
| Codicils admitted | estate.requests.admit_codicils | Derived |
| Domiciliary letters issued to | estate.requests.domiciliary_letters_to | Shared |
| Bond checkbox/amount | personal_representatives[].bond_type, bond_amount | Attorney/court controlled |
| Trustee appointment | estate.requests.trusts[] | Optional |
| Other orders | estate.forms.pr_1808.other_orders | Optional |
| Preparer block | preparer.* | Shared |

Rules:

- Treat PR-1808 as a proposed court document. The platform should label it as draft/proposed until accepted by the probate registrar.
- Bond and trustee fields should be attorney-review fields in public mode.

## PR-1810 Domiciliary Letters Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Informal administration checkbox | estate.administration_type == informal | Default true |
| To | personal_representatives[].person.full_name and address | Recipient/PR authority line |
| Decedent date of birth | decedent.date_of_birth | Shared |
| Decedent date of death | decedent.date_of_death | Shared |
| Domicile county/state | decedent.domicile_county, decedent.domicile_state | Shared |
| Other | estate.forms.pr_1810.other_text | Optional/court controlled |
| Preparer block | preparer.* | Shared |

Rules:

- This form depends on appointment. In public mode, label as draft until issued by the court.

## PR-1817 Declaration of Service Map

| Form location | Data path | Notes |
|---|---|---|
| County/caption/case | estate.*, decedent.full_name | Shared |
| Declarant name | service_event.server.person.full_name | Required |
| Declarant city | service_event.server.city | Required |
| Declarant state | service_event.server.state | Required |
| Service date | service_event.service_date | Required |
| Documents provided | service_event.documents_provided[] | Required |
| Original on file | service_event.original_on_file == true | Select one |
| Copy attached | service_event.copy_attached == true | Select one |
| See attached | service_event.recipients_require_attachment | Derived if many recipients |
| Recipient names | service_event.recipients[].person.full_name | Required |
| Mailing addresses | service_event.recipients[].person.address | Required |
| Type of service | service_event.recipients[].service_type | personal, mail, certified mail return receipt |
| Signature block | service_event.server.signature.* | Required |
| Preparer block | preparer.* | Shared |

Rules:

- PR-1817 should always be generated from a saved ServiceEvent.
- The same service event should support later service of inventory, account, receipts, and closing documents.

## Intake Question Groups

### Group A - Start and triage

| Question | Stores to | Required for |
|---|---|---|
| Did the person live in Wisconsin at death? | decedent.domicile_state | Triage, PR-1801 |
| Which county? | decedent.domicile_county, estate.county | All forms |
| What is the estimated gross probate property? | estate.estimated_gross_probate_value | Triage |
| What is the estimated net probate property? | estate.estimated_net_probate_value | PR-1801 |
| Is anyone expected to object? | estate.risk_flags.expected_objection | Triage |
| Are all interested persons known and locatable? | estate.risk_flags.missing_interested_persons | Triage/review |

### Group B - Decedent

| Question | Stores to | Required for |
|---|---|---|
| Legal name | decedent.full_name | All captions |
| Date of birth | decedent.date_of_birth | PR-1801, PR-1804, PR-1810 |
| Date of death | decedent.date_of_death | PR-1801, PR-1804, PR-1808, PR-1810 |
| Last mailing address | decedent.last_mailing_address | PR-1801, PR-1804 |

### Group C - Applicant and PR

| Question | Stores to | Required for |
|---|---|---|
| Who is applying? | applicant.person.* | PR-1801 |
| Why are they interested? | applicant.interested_capacity | PR-1801 |
| Who should serve as PR? | personal_representatives[] | PR-1801, PR-1803, PR-1807, PR-1808, PR-1810 |
| Is the PR a Wisconsin resident? | personal_representatives[].is_wisconsin_resident | PR-1807 |
| If not, who is resident agent? | personal_representatives[].resident_agent | PR-1807 |

### Group D - Will/no will

| Question | Stores to | Required for |
|---|---|---|
| Is there a will? | will.exists | PR-1801, PR-1803, PR-1808 |
| Will date | will.date | Will path forms |
| Codicil dates | will.codicils[] | Will path forms |
| Where is the original will? | will.original_location_status | PR-1801, PR-1808 |
| Who is named PR/trustee? | will.named_personal_representatives, will.named_trustees | PR-1801 |

### Group E - Family and interested persons

| Question | Stores to | Required for |
|---|---|---|
| Surviving spouse/domestic partner? | heirship.surviving_spouse | PR-1806 |
| Children and descendants? | heirship.children, heirship.descendants | PR-1806 |
| Parents/siblings/grandparents as needed? | heirship.parent_sibling_grandparent_lines | PR-1806 |
| Interested persons list | interested_persons[] | PR-1801, PR-1803, PR-1817 |
| Any minors/guardians/military issues? | interested_persons[].flags | PR-1801, review checker |

### Group F - Service

| Question | Stores to | Required for |
|---|---|---|
| What documents were served? | service_event.documents_provided[] | PR-1817 |
| Who served them? | service_event.server | PR-1817 |
| Who received them? | service_event.recipients[] | PR-1817 |
| How were they served? | service_event.recipients[].service_type | PR-1817 |
| When were they served? | service_event.service_date | PR-1817 |

## MVP Validation Rules

| Rule | Severity | Applies to |
|---|---|---|
| Decedent name is required | blocker | All forms |
| County is required | blocker | All forms |
| Date of death is required | blocker | PR-1801, PR-1804, PR-1808, PR-1810 |
| Will and no-will paths cannot both be selected | blocker | PR-1801, PR-1803, PR-1808 |
| If will exists, will date is required | blocker | PR-1801, PR-1803, PR-1808 |
| If codicil selected, at least one codicil date is required | blocker | PR-1801, PR-1803, PR-1808 |
| If no will, diligent inquiry confirmation is required | blocker | PR-1801 |
| Applicant name and capacity are required | blocker | PR-1801 |
| Proposed PR name is required | blocker | PR-1801, PR-1803, PR-1807, PR-1808, PR-1810 |
| Nonresident PR requires resident agent | blocker | PR-1807 |
| Interested persons require mailing addresses | warning/blocker | PR-1801, PR-1817 |
| Minor/incompetent interested person requires attorney-review flag | warning | PR-1801, PR-1803 |
| Public benefits unknown should be explicitly marked lack information | blocker | PR-1801 |
| PR-1806 must answer 120-hour death question | blocker | PR-1806 |
| Service declaration requires document list, date, recipient, address, and service type | blocker | PR-1817 |

## Template Tagging Recommendation

For each official Word template:

1. Store the original template unchanged.
2. Create a tagged working template with internal field names.
3. Track source filename, source form number, source revision date if available, import date, and internal template version.
4. Map every Word field to a data path in this document.
5. Add automated tests that generate each form from sample estate JSON.
6. Visually review generated DOCX/PDF output after each template change.

## First Technical Milestone

Build PR-1801 end to end:

- Intake screens for all PR-1801 fields.
- Shared estate JSON.
- Generated PR-1801 DOCX.
- Generated PR-1801 PDF.
- Review checker for missing fields and will/no-will contradictions.

Once PR-1801 works reliably, reuse the same schema to generate PR-1806 and PR-1807 next.
