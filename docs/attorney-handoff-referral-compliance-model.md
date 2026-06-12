# Attorney Handoff and Referral Compliance Model

Date: June 9, 2026

## Purpose

This document maps how the Wisconsin probate platform can help users reach attorneys when a case is not a good DIY informal-probate or Transfer by Affidavit candidate.

This is a product and risk model, not a legal ethics opinion. Before selling attorney leads, charging lawyers for placement, or sharing user case data with attorneys, the model should be reviewed by Wisconsin ethics counsel.

## Product Principle

The first launch should make money from user-paid document packages and attorney software subscriptions, not from per-lead attorney referral fees.

Safer first revenue lanes:

- Transfer by Affidavit package fee.
- Informal probate opening packet fee.
- Attorney SaaS subscription for intake, form automation, county defaults, deadline tracking, and client handoff.
- Flat attorney advertising/listing fee only if clearly labeled and not tied to case value, legal fees, or user selection.

Do not launch yet:

- Selling individual probate leads to attorneys.
- Charging a lawyer per referred case.
- Taking a percentage of attorney fees.
- Ranking attorneys as "recommended" because they paid.
- Sending user data to attorneys without express user consent.

## Launch-Safe Handoff Model

### User-Selected Export

The app may create a neutral attorney handoff package that the user downloads or chooses to share.

Package contents:

- Case summary.
- Probate path-router result.
- Opening packet readiness issues.
- Interested-person and service list.
- Asset/inventory snapshot.
- User notes and questions.
- Optional structured case-data JSON.

Required UI controls:

- Consent checkbox before package creation.
- Clear statement that nothing is sent automatically.
- User chooses the attorney or downloads the file.
- User may exclude structured case-data JSON.

Why this is the preferred first model:

- User remains in control.
- No attorney receives confidential information unless the user decides.
- No fee is tied to a lawyer receiving a specific lead.
- It supports later attorney workflow without prematurely creating a referral business.

## Attorney Directory Options

### Option A: Neutral Directory

Show a list of Wisconsin probate attorneys with objective filters:

- County served.
- Practice areas.
- Languages.
- Virtual/in-person availability.
- Flat-fee availability if attorney supplies it.
- Response time if objectively measured.

Do not claim the app recommends, endorses, or rates attorneys unless there is a reviewed, defensible basis.

### Option B: Sponsored Listings

Sponsored attorneys may appear in clearly labeled ad placements.

Rules for the product:

- Label as "Sponsored" or "Advertisement."
- Do not describe sponsored attorneys as best, preferred, verified, top, or recommended merely because they paid.
- Keep organic directory results separate from paid ad units.
- Charge flat advertising or subscription fees, not per retained client or percentage of attorney fees.

### Option C: Attorney SaaS Subscription

Attorneys pay for software access, not leads.

Possible plan:

- Monthly subscription per attorney or firm.
- Client intake portal.
- Saved probate cases.
- Form automation.
- Attorney profile/preparer fields.
- Secure document sharing.
- Case handoff import.

This is likely the cleanest attorney-side revenue model.

## Higher-Risk Models

### Per-Lead Sale

Risk: may be treated as paying for recommendations, impermissible fee sharing, misleading advertising, or improper solicitation depending on structure.

Do not implement until reviewed.

If ever considered, ethics review should answer:

- Is the company a lawyer referral service, advertising service, marketplace, or legal document platform?
- Can attorneys pay for leads if payment is not contingent on retention?
- Can the app use matching logic without becoming a recommendation?
- What disclosures must users see?
- What disclosures must attorneys make?
- Can the company charge users and attorneys for the same matter?
- How are conflicts, confidentiality, and nonresponse handled?

### Percentage of Attorney Fee

Do not use.

This likely creates fee-sharing and recommendation issues and would be hard to defend for a non-lawyer-owned technology company.

### Exclusive Routing

Do not use without review.

Examples to avoid:

- One paying lawyer gets every formal probate case in a county.
- Users are told a lawyer is "best" or "recommended" because of payment.
- App hides nonpaying attorneys if the user needs legal help.

## Required Consent and Privacy Controls

Before any attorney receives user data:

- User sees exactly what will be shared.
- User selects the receiving attorney or confirms the attorney selected.
- User confirms consent.
- User can download the package instead of sending it through the platform.
- App records date/time, recipient, and data shared.
- User can revoke future sharing, though prior attorney receipt cannot be undone.

Sensitive data to protect:

- Names and addresses of heirs/beneficiaries.
- Dates of birth/death.
- Minor/protected-person facts.
- Asset and account details.
- Real estate details.
- Public benefits/estate recovery facts.
- Family conflict or disinheritance facts.

## User-Facing Disclosures

Recommended disclosure themes:

- The app provides document automation and general procedural information, not legal advice.
- Users should consult an attorney for disputes, minors/protected persons, missing heirs, unclear title, public benefits/estate recovery, tax issues, litigation, or formal probate concerns.
- Attorney directory listings, if any, are informational.
- Sponsored listings are paid advertisements.
- The user chooses whether to contact or share information with any attorney.
- The company does not guarantee an attorney-client relationship.
- Attorneys are independent and set their own fees.

## Attorney-Facing Terms

Attorney participants should agree:

- They are responsible for their own compliance with Wisconsin professional rules.
- They will not treat a handoff package as creating representation until engagement terms are completed.
- They will protect received user data.
- They will promptly decline or respond when they cannot assist.
- They will not imply endorsement by the platform unless expressly authorized and reviewed.
- They will keep profile/advertising claims accurate.

## Recommended Product Sequence

### Phase 1: No Attorney Monetization

- Build attorney handoff package.
- User downloads package.
- Optional manually curated attorney directory with no paid ranking.
- Track how often cases need attorney review.

### Phase 2: Attorney SaaS

- Attorneys pay for software tools.
- Attorneys can invite clients into the intake.
- Users can export case files to their chosen attorney.
- Revenue does not depend on a referred case.

### Phase 3: Sponsored Directory

- Add clearly labeled sponsored attorney placements.
- Keep neutral search/filtering.
- Flat fee only.
- Review advertising copy and placement with ethics counsel.

### Phase 4: Lead/Referral Model Only After Ethics Review

- Consider only if Wisconsin ethics counsel approves the exact structure.
- Build disclosures, audit logs, attorney agreements, and user consent around the reviewed model.

## MVP Compliance Requirements for the Current Prototype

Add or preserve these safeguards:

- Attorney handoff package requires user consent.
- Package is downloaded by user or sent only after explicit selection.
- No automatic attorney matching.
- No claim that the platform recommends a lawyer.
- No per-lead billing logic in the app.
- App labels attorney handoff as neutral and non-monetized until ethics review.

## Open Questions for Wisconsin Ethics Counsel

1. Can a non-lawyer-owned Wisconsin probate software company charge attorneys a flat monthly fee for directory placement?
2. Can sponsored attorney placements appear next to probate self-help content if clearly labeled?
3. Can the company charge public users for document automation and separately charge attorneys for SaaS tools?
4. What language should be used to avoid implying legal advice or attorney recommendation?
5. Can users request that their case file be shared with multiple attorneys for review?
6. Can the platform charge attorneys for receiving user-authorized case summaries if not contingent on retention?
7. What disclaimers are required for public probate articles, eligibility screens, and document generation?
8. What recordkeeping should be maintained for user consent and attorney advertising disclosures?

## Current Recommendation

For launch, use this model:

- Public user pays for Transfer by Affidavit or informal probate document package.
- If the case is not DIY-suitable, user receives a free or low-cost attorney handoff package.
- Attorneys pay for software access, not leads.
- Any attorney directory is neutral or clearly labeled sponsored advertising.
- Per-lead/referral monetization waits until Wisconsin ethics counsel reviews and approves the exact model.
