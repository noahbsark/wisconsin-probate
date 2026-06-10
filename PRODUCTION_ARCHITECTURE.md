# Production Architecture Plan

This plan describes how the current Wisconsin informal probate prototype should evolve into a secure website or app for public users and attorneys.

## Product Shape

Recommended first production form: responsive web app.

Why:

- Works on desktop, tablet, and phone.
- Easier to update Wisconsin forms, county defaults, and rule logic in one place.
- Lower cost than maintaining separate iOS and Android apps.
- Can later become an installable Progressive Web App.

Native mobile app can be considered later if users need offline access, push notifications, device scanning, or high-volume mobile workflows.

## Main User Types

- Public user: starts a case, answers the guided interview, generates packets, receives reminders.
- Attorney: manages many cases, reviews client answers, edits forms, sends secure links.
- Staff: assists attorney with intake, document preparation, and task tracking.
- Personal representative: may be the public user or an invited participant.
- Interested person: may receive a waiver, notice packet, or document download link.
- Admin: maintains form templates, county defaults, official newspaper records, and release checks.

## Core Data Model

Suggested entities:

- User: login identity, contact info, role, security settings.
- Case: county, status, decedent, filing path, owner, attorney, dates.
- Party: applicant, proposed PR, heirs, beneficiaries, trustees, resident agent, interested persons.
- PartyRole: heir, will beneficiary, trustee, named PR, minor/protected, military flag, signer, recipient.
- InterviewAnswer: versioned answers with source step and change history.
- FormTemplate: PR form version, template file, field map, active dates.
- GeneratedDocument: form key, generated date, template version, file pointer, packet membership.
- Task: opening packet, waivers, service, publication, letters, inventory, claims, closing.
- Deadline: claims deadline, inventory due date, service dates, hearing/objection dates.
- Delivery: secure link, recipient, permissions, expiration, opened/downloaded status.
- AuditEvent: who did what, when, from where, and why it matters.
- CountyDefault: courthouse, probate office, registrar, publication newspaper, local notes, last verified.
- TestScenario: fact pattern, expected packet path, expected forms, expected blockers/warnings.

## Application Modules

### Guided Intake

Purpose: collect facts once and reduce user confusion.

Important requirements:

- Consumer interview mode.
- Attorney review/edit mode.
- Conditional questions so irrelevant will, trust, spouse, resident-agent, and public-benefits sections do not clutter the flow.
- Party picker so the same person can be reused across applicant, PR, child, beneficiary, heir, trustee, and recipient sections.

### Packet Decision Engine

Purpose: decide waiver path vs. PR-1805 notice path and explain the result.

Important requirements:

- Rules must be versioned.
- Each decision should produce a plain-language explanation.
- Each decision should identify included forms, excluded forms, blockers, warnings, and attorney-review flags.
- Formal test scenarios should run before release.

### Form Generation

Purpose: generate Wisconsin PR forms from structured case data.

Important requirements:

- Versioned templates.
- Field maps separated from interview UI where possible.
- Document generation logs.
- Court-supplied blanks treated differently from user-missing facts.
- Export individual forms and packet ZIPs.

### Tasks and Deadlines

Purpose: help users file, serve, publish, wait, inventory, and close.

Important requirements:

- Timeline sorted in probate order.
- Deadline calculations where reliable.
- Manual override for court-supplied dates.
- Reminders by email and possibly SMS.

### Secure Document Delivery

Purpose: send documents to the PR, attorney, and selected parties.

Recommended default:

- Email a secure link, not ordinary attachments.
- Link requires the intended recipient to verify email or use a one-time code.
- Links expire.
- Downloads are logged.
- Case owner can revoke links.

Optional later:

- Recipient portal with waiver status and upload/signing instructions.
- E-signature integration if legally and practically appropriate.

## Security and Privacy

Probate data can include addresses, dates of birth/death, family relationships, assets, debts, and legal documents. Production should include:

- HTTPS only.
- User authentication.
- Role-based access control.
- Encrypted database storage where appropriate.
- Encrypted file storage.
- Audit logging for case access, edits, generation, and delivery.
- Expiring secure document links.
- Backups and recovery plan.
- Clear privacy policy and data retention policy.
- Administrative access controls.

## Technology Direction

Reasonable production stack:

- Frontend: React or similar component framework.
- Styling: design-system components based on the current TurboTax-like green/blue UI.
- Backend: Node/TypeScript or Python API.
- Database: PostgreSQL.
- File storage: cloud object storage with private buckets.
- Email: transactional email provider for secure-link notifications.
- Background jobs: document generation, reminders, delivery expiration, audit tasks.
- Testing: unit tests for rules, scenario tests for packets, browser tests for workflows, document-generation tests for templates.

The current static prototype can continue serving as the design and rule sandbox while the production app is scaffolded separately.

## Release Gates

Before a public beta:

- Legal review of intake language and rule explanations.
- Security review of account and document-delivery system.
- County-default verification workflow defined.
- Official newspaper data verification workflow defined.
- Accessibility review.
- Form-output review on real Word/PDF viewers.
- Formal test scenarios passing.
- Disaster recovery and backup process tested.

## Suggested Build Order

1. Freeze the current opening-packet MVP behavior with scenario tests.
2. Define the production database schema.
3. Create account/case/document/task foundations.
4. Move the opening-packet interview into the production app.
5. Connect secure storage and document generation.
6. Add secure document delivery.
7. Pilot with attorney-reviewed test cases before public use.
