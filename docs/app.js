const storageKey = "pr1801-prototype-state-v1";
const ADDRESS_EXAMPLE = "Street address, City, State ZIP";
const BETA_UNLOCK_ENABLED = true;
const PLATFORM_CONFIG = (typeof window !== "undefined" && window.PROBATE_PLATFORM_CONFIG) ? window.PROBATE_PLATFORM_CONFIG : {};
const COMPANY_CONFIG = {
  companyName: "Wisconsin Probate Forms",
  companyLegalName: "[Company Name TBD]",
  supportEmail: "support@example.com",
  isLawFirm: false,
  providesLegalAdvice: false,
  founderLawFirmReferralEnabled: false,
  attorneyHandoffEnabled: false,
  attorneyDirectoryEnabled: false,
  ...(PLATFORM_CONFIG.company || {})
};
const PLATFORM_FEATURE_FLAGS = PLATFORM_CONFIG.featureFlags || {};
const PLATFORM_STORAGE_CONFIG = {
  adapter: "localPrototype",
  plannedAdapter: "secureServerDatabase",
  encryptionAtRestRequired: true,
  auditLogsRequired: true,
  consentLogsRequired: true,
  dataExportRequestSupportRequired: true,
  deletionRequestSupportRequired: true,
  ...(PLATFORM_CONFIG.storage || {})
};
const PLATFORM_DATA_MODEL_VERSION = PLATFORM_CONFIG.dataModelVersion || "platform-foundation-2026-06-09";
const FEATURE_ATTORNEY_HANDOFF = Boolean(PLATFORM_FEATURE_FLAGS.attorneyHandoff);
const FEATURE_ATTORNEY_DIRECTORY = Boolean(PLATFORM_FEATURE_FLAGS.attorneyDirectory);
const FEATURE_AFFILIATED_LAW_FIRM_REVIEW = Boolean(PLATFORM_FEATURE_FLAGS.affiliatedLawFirmReview);
const FEATURE_SPONSORED_ATTORNEY_LISTINGS = Boolean(PLATFORM_FEATURE_FLAGS.sponsoredAttorneyListings);
const LEGAL_DISCLAIMER_FULL = "This service provides legal information and document automation for Wisconsin probate forms. It is not a law firm and does not provide legal advice. Use of this service does not create an attorney-client relationship. Probate requirements can vary by county and by case facts. A court, Register in Probate, or attorney may require additional forms, information, or steps.";
const LEGAL_DISCLAIMER_SHORT = "Not a law firm. Not legal advice. Probate requirements may vary by county and case facts.";
const CONSENT_VERSIONS = {
  terms: "terms-2026-06-09",
  privacy: "privacy-2026-06-09",
  download: "download-2026-06-09",
  attorneyHandoff: "attorney-handoff-disabled-2026-06-09"
};
const STANDARD_FORM_INTEGRITY_POLICY = {
  version: "official-form-integrity-2026-06-10",
  rule: "Wisconsin PR forms are standard court forms. Production output must place user answers into the current official form or an exact approved replica without changing court form language, numbering, section order, captions, certification text, signature blocks, or required margins.",
  allowed: [
    "Map interview answers into official blank fields.",
    "Generate separate filing instructions, checklists, manifests, and read-me files outside the court form.",
    "Keep court-editable drafts such as PR-1808 and PR-1810 in Word/editable format when that is the correct filing workflow."
  ],
  prohibited: [
    "Do not redesign the PR form.",
    "Do not rewrite court form text.",
    "Do not remove or reorder official sections.",
    "Do not combine app guidance into the face of the court form."
  ]
};
const OFFICIAL_FORM_TEMPLATE_VAULT = {
  pr1801: { formNumber: "PR-1801", title: "Application for Informal Administration", localTemplate: "templates/PR-1801-template.docx", officialPdf: "templates/PR-1801-official.pdf", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_started" },
  pr1803: { formNumber: "PR-1803", title: "Waiver and Consent", localTemplate: "templates/PR-1803-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  pr1804: { formNumber: "PR-1804", title: "Notice to Creditors", localTemplate: "templates/PR-1804-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  pr1805: { formNumber: "PR-1805", title: "Notice Setting Time to Hear Application and Deadline for Filing Claims", localTemplate: "templates/PR-1805-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  pr1806: { formNumber: "PR-1806", title: "Proof of Heirship", localTemplate: "templates/PR-1806-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  pr1807: { formNumber: "PR-1807", title: "Consent to Serve as Personal Representative", localTemplate: "templates/PR-1807-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  pr1808: { formNumber: "PR-1808", title: "Statement of Informal Administration", localTemplate: "templates/PR-1808-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_word_court_draft" },
  pr1810: { formNumber: "PR-1810", title: "Domiciliary Letters", localTemplate: "templates/PR-1810-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_word_court_draft" },
  pr1811: { formNumber: "PR-1811", title: "Inventory", localTemplate: "templates/PR-1811-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_later_stage" },
  pr1817: { formNumber: "PR-1817", title: "Declaration of Service", localTemplate: "templates/PR-1817-template.docx", officialPdf: "", source: "Wisconsin Court System", outputStatus: "official_docx_registered_pdf_overlay_needed" },
  "transfer-affidavit": { formNumber: "PR-1831", title: "Transfer by Affidavit", localTemplate: "templates/PR-1831.pdf", officialPdf: "templates/PR-1831.pdf", source: "Wisconsin Court System", outputStatus: "official_pdf_registered_overlay_needed" }
};
const FORM_FORMAT_CONFIG = {
  "transfer-affidavit": {
    formNumber: "PR-1831",
    signatureWorkflow: "Affiant signs before use; additional holder or heirship materials may require separate signed pages.",
    publicPackage: "Print/sign official PDF packet after template mapping.",
    attorneyEfileDefault: "Signed PDF package unless a receiving party/court requests another format.",
    wordCopy: "Editable worksheet/support draft for review.",
    pdfCopy: "Official PR-1831 PDF/print copy is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "official_template_needed"
  },
  pr1801: {
    formNumber: "PR-1801",
    signatureWorkflow: "Applicant/preparer signature should be wet-signed before paper filing or scanned for eFiling.",
    publicPackage: "Print/sign official filing copy.",
    attorneyEfileDefault: "Signed PDF after wet signature and exact overlay.",
    wordCopy: "Editable working copy for correction before signature.",
    pdfCopy: "Exact official PDF overlay is the production filing copy.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_pilot_started"
  },
  pr1803: {
    formNumber: "PR-1803",
    signatureWorkflow: "Each waiver signer wet-signs either a shared waiver or an individual waiver.",
    publicPackage: "Print waiver(s), collect wet signatures, then file/scan as needed.",
    attorneyEfileDefault: "Signed PDF after waivers are returned.",
    wordCopy: "Editable waiver working copy for logistics.",
    pdfCopy: "Exact official PDF waiver set is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_needed"
  },
  pr1804: {
    formNumber: "PR-1804",
    signatureWorkflow: "Usually prepared for filing/publication rather than party signature; county/registrar details must be verified.",
    publicPackage: "Print/file/publish as county requires.",
    attorneyEfileDefault: "PDF filing/publication copy.",
    wordCopy: "Editable working copy for court/county details.",
    pdfCopy: "Exact official PDF notice is the production target.",
    efileDefault: "pdf",
    pdfStatus: "overlay_needed"
  },
  pr1805: {
    formNumber: "PR-1805",
    signatureWorkflow: "Notice copy for hearing/service path; signature handling depends on current court form and local practice.",
    publicPackage: "Print/file/serve/publish as county requires.",
    attorneyEfileDefault: "PDF notice copy unless the county requests an editable notice.",
    wordCopy: "Editable working copy for hearing/service details.",
    pdfCopy: "Exact official PDF notice is the production target.",
    efileDefault: "pdf_or_county_word",
    pdfStatus: "overlay_needed"
  },
  pr1806: {
    formNumber: "PR-1806",
    signatureWorkflow: "Declarant wet-signs Proof of Heirship before paper filing or scanned eFiling.",
    publicPackage: "Print/sign/file.",
    attorneyEfileDefault: "Signed PDF after wet signature.",
    wordCopy: "Editable working copy before signature.",
    pdfCopy: "Exact official PDF proof is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_needed"
  },
  pr1807: {
    formNumber: "PR-1807",
    signatureWorkflow: "Proposed PR and resident agent, if needed, wet-sign before filing or scanned eFiling.",
    publicPackage: "Print/sign/file.",
    attorneyEfileDefault: "Signed PDF after wet signature.",
    wordCopy: "Editable working copy before signature.",
    pdfCopy: "Exact official PDF consent is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_needed"
  },
  pr1808: {
    formNumber: "PR-1808",
    signatureWorkflow: "Prepared for Probate Registrar/court signature; parties usually submit the draft with the opening packet.",
    publicPackage: "Include a court draft with the opening packet if local practice accepts.",
    attorneyEfileDefault: "Word/DOCX court-editable draft when required for eFiling or court issuance.",
    wordCopy: "Primary court-editable draft.",
    pdfCopy: "PDF preview/copy after review, not the only output.",
    efileDefault: "word_docx",
    pdfStatus: "word_primary"
  },
  pr1810: {
    formNumber: "PR-1810",
    signatureWorkflow: "Prepared for court issuance/signature; parties usually submit the draft and wait for issued letters.",
    publicPackage: "Include a court draft with the opening packet if local practice accepts.",
    attorneyEfileDefault: "Word/DOCX court-editable draft when required for eFiling or court issuance.",
    wordCopy: "Primary court-editable draft.",
    pdfCopy: "PDF preview/copy after review, not the only output.",
    efileDefault: "word_docx",
    pdfStatus: "word_primary"
  },
  pr1811: {
    formNumber: "PR-1811",
    signatureWorkflow: "Personal representative signs after appointment before paper filing or scanned eFiling.",
    publicPackage: "Print/sign/file after appointment.",
    attorneyEfileDefault: "Signed PDF after wet signature.",
    wordCopy: "Editable inventory working copy before signature.",
    pdfCopy: "Exact official PDF inventory is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_needed"
  },
  pr1817: {
    formNumber: "PR-1817",
    signatureWorkflow: "Declarant wet-signs after service is complete before filing or scanned eFiling.",
    publicPackage: "Print/sign/file after service.",
    attorneyEfileDefault: "Signed PDF after wet signature.",
    wordCopy: "Editable declaration working copy before signature.",
    pdfCopy: "Exact official PDF declaration is the production target.",
    efileDefault: "signed_pdf",
    pdfStatus: "overlay_needed"
  }
};

function newLocalId(prefix = "id") {
  const random = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${String(random).replace(/[^a-zA-Z0-9-]/g, "")}`;
}

function emptyState() {
  return {
    matter: {
      id: newLocalId("matter"),
      ownerUserId: "",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: "",
      storageMode: "localPrototype",
      dataModelVersion: PLATFORM_DATA_MODEL_VERSION,
      dataClassification: "sensitive_probate_intake",
      lastSavedAt: "",
      lastGeneratedAt: "",
      lastDownloadedAt: "",
      dataExportRequestedAt: "",
      deletionRequestedAt: "",
      reviewerStatus: "not_reviewed"
    },
    estate: {
      county: "",
      caseNumber: "",
      estimatedGrossValue: "",
      estimatedNetValue: "",
      isAmended: false
    },
    intake: {
      userRole: ""
    },
    account: {
      userId: newLocalId("user"),
      fullName: "",
      email: "",
      accessCode: "",
      role: "public",
      lastSavedAt: "",
      resumeStatus: "",
      testerType: "",
      betaTermsAccepted: false,
      privacyAcknowledged: false,
      feedback: "",
      feedbackCategory: "general",
      feedbackSeverity: "medium",
      feedbackCanBecomeScenario: true,
      feedbackIssueId: "",
      feedbackSubmittedAt: "",
      launchConsent: false
    },
    pathRouter: {
      grossValue: "",
      hasRealEstate: "",
      allInterestedKnown: "",
      allAdultsCapable: "",
      everyoneAgrees: "",
      publicBenefits: "",
      creditorDispute: "",
      formalConcern: "",
      notes: ""
    },
    transferAffidavit: {
      isAmended: false,
      amendedDocumentNumber: "",
      affiantName: "",
      affiantAddress: "",
      affiantEmail: "",
      affiantPhone: "",
      affiantRelationship: "",
      affiantCapacity: "heir",
      daysSinceDeathConfirmed: "",
      noPendingProbate: "",
      grossValueConfirmed: "",
      entitledPersonsKnown: "",
      realEstateIncluded: "",
      vehicleIncluded: "",
      publicBenefitsFollowup: "",
      estateRecoveryNoticeSent: "",
      realEstateHeirNoticeComplete: "",
      creditorConcern: "",
      documentRecipient: "",
      successorBasis: "",
      entitledPersonsSummary: "",
      spouseSummary: "",
      draftedBy: "",
      notes: "",
      assets: [
        emptyTransferAsset()
      ]
    },
    payment: {
      status: "unpaid",
      productKey: "",
      email: "",
      deliveryMode: "download",
      exportAudience: "public",
      agreedToTerms: false,
      unlockedAt: ""
    },
    attorneyHandoff: {
      status: "DISABLED",
      consent: false,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      county: "",
      notes: "",
      includeCaseData: true,
      generatedAt: "",
      requests: []
    },
    consentLogs: [],
    auditLogs: [],
    analyticsEvents: [],
    betaIssues: [],
    signatureStatus: {},
    secureDeliveryLinks: [],
    attorneyBetaReviews: {},
    legalReview: {
      reviewerName: "",
      reviewerRole: "",
      reviewedAt: "",
      overallNotes: "",
      lockedAt: "",
      lockedBy: "",
      lockNotes: "",
      lockedScenarioSummary: null,
      items: {}
    },
    ui: {
      mode: "guided",
      interviewStepId: "role"
    },
    decedent: {
      fullName: "",
      dateOfBirth: "",
      dateOfDeath: "",
      domicileCounty: "",
      domicileState: "Wisconsin",
      lastMailingAddress: ""
    },
    applicant: {
      fullName: "",
      capacity: "",
      address: "",
      email: "",
      phone: "",
      signatureDate: "",
      barNumber: ""
    },
    pr: {
      sameAsApplicant: true,
      fullName: "",
      address: "",
      email: "",
      phone: "",
      isWisconsinResident: "",
      signatureDate: "",
      barNumber: "",
      residentAgent: {
        name: "",
        address: "",
        email: "",
        phone: "",
        signatureDate: "",
        barNumber: ""
      }
    },
    otherProceedings: {
      status: "",
      explanation: ""
    },
    will: {
      exists: "",
      date: "",
      hasCodicils: "",
      codicilDates: "",
      location: "",
      priorCaseNumber: "",
      namedPr: "",
      namedPrNone: false,
      namedTrustee: "",
      namedTrusteeNone: false,
      nominatedTrustee: "",
      nominatedTrusteeNone: false,
      hasNamedBeneficiaries: "",
      noWillDiligentInquiry: false
    },
    opening: {
      waiverStatus: "",
      unknownInterestedPersonsStatus: "",
      noticeReason: "",
      peopleWhoCannotSign: "",
      peopleNotFound: "",
      publicationNotes: ""
    },
    countyDefaults: {
      courthouseCounty: "",
      courthouseAddress: "",
      room: "",
      probateOfficeName: "",
      registrarName: "",
      newspaperName: "",
      accommodationPhone: "",
      localNotes: "",
      lastVerified: "",
      sourceUrl: ""
    },
    waiver: {
      signatureMode: "single",
      receivedWillCopy: true,
      receivedBequestNotice: false,
      consentToAdmitWill: true,
      otherSelected: false,
      otherText: "",
      signatureDate: ""
    },
    notice1804: {
      courthouseCounty: "",
      courthouseAddress: "",
      room: "",
      claimDeadline: "",
      newspaperName: ""
    },
    notice1805: {
      courthouseCounty: "",
      courthouseAddress: "",
      room: "",
      registrarName: "",
      hearingDate: "",
      hearingTime: "",
      claimDeadline: "",
      unknownInterestedPersons: "",
      accommodationPhone: "",
      checkExactTime: false,
      newspaperName: ""
    },
    heirship: {
      informant: {
        name: "",
        address: "",
        relationship: ""
      },
      spouse: {
        exists: "",
        name: ""
      },
      children: {
        exists: "",
        people: [
          emptyHeirshipChild()
        ],
        list: "",
        deceasedChildDescendants: "",
        allOfSurvivingSpouse: "",
        blendedDetails: ""
      },
      parents: {
        exists: "",
        names: ""
      },
      siblings: {
        exists: "",
        names: "",
        deceasedSiblingDescendants: ""
      },
      grandparents: {
        summary: ""
      },
      survivorship120: {
        exists: "",
        details: ""
      }
    },
    benefits: {
      medicalAssistance: "",
      familyCare: "",
      communityOptions: "",
      chronicDisease: "",
      institution: "",
      explanation: "",
      lackInfo: false
    },
    spouse: {
      everMarried: "",
      fullName: "",
      livingStatus: "",
      statusAtDeath: "",
      communityOptions: "",
      chronicDisease: "",
      seeAttached: false,
      lackInfo: false
    },
    willBeneficiaries: [
      { name: "", role: "beneficiary", relationship: "", address: "", minorDateOfBirth: "", notes: "" }
    ],
    interestedPersons: [
      emptyInterestedPerson()
    ],
    requests: {
      domiciliaryLettersTo: "",
      appointTrustee: false,
      trusteeNames: "",
      trustName: "",
      additionalTrusts: false,
      otherSelected: false,
      otherText: "",
      question10OtherSelected: false,
      question10OtherText: "",
      interestedPersonsSeeAttached: false
    },
    service: {
      declarantName: "",
      declarantCity: "",
      declarantState: "Wisconsin",
      declarantAddress: "",
      declarantEmail: "",
      declarantPhone: "",
      declarantBarNumber: "",
      serviceDate: "",
      documentsProvided: "",
      originalOnFile: true,
      copyAttached: false,
      method: "Mail",
      signatureDate: ""
    },
    courtDrafts: {
      prBondType: "none",
      prBondAmount: "",
      trusteeBondType: "none",
      trusteeBondAmount: "",
      otherFindingsSelected: false,
      otherFindingsText: "",
      otherOrdersSelected: false,
      otherOrdersText: "",
      lettersOtherText: ""
    },
    inventory: {
      signatureDate: "",
      items: [
        emptyInventoryItem()
      ]
    },
    deadlines: {
      lettersIssuedDate: "",
      serviceCompletedDate: "",
      firstPublicationDate: "",
      proofPublicationReceivedDate: "",
      claimDeadline: "",
      inventoryDueDate: "",
      inventoryFiledDate: "",
      closingReviewDate: ""
    },
    taskStatus: {},
    preparer: {
      fullName: "",
      address: "",
      email: "",
      phone: "",
      barNumber: ""
    }
  };
}

let state = loadState();

function loadState() {
  if (typeof localStorage === "undefined") {
    return emptyState();
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const merged = mergeDeep(emptyState(), saved || {});
    migrateLoadedState(merged, saved || {});
    return merged;
  } catch {
    return emptyState();
  }
}

function mergeDeep(base, incoming) {
  for (const [key, value] of Object.entries(incoming || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key]) {
      mergeDeep(base[key], value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function migrateLoadedState(merged, saved) {
  ensurePlatformIdentity(merged, { persist: false });
  if (saved.pr && !Object.prototype.hasOwnProperty.call(saved.pr, "sameAsApplicant")) {
    merged.pr.sameAsApplicant = applicantMatchesPr(saved.applicant || {}, saved.pr || {});
  }
  if (saved.will && !Object.prototype.hasOwnProperty.call(saved.will, "hasCodicils") && hasValue(saved.will.codicilDates)) {
    merged.will.hasCodicils = "yes";
  }
  if (!hasValue(merged.spouse.everMarried)) {
    merged.spouse.everMarried = hasValue(merged.spouse.fullName) || merged.heirship.spouse.exists === "yes" ? "yes" : "";
  }
  if (!hasValue(merged.estate.estimatedNetValue) && hasValue(merged.estate.estimatedGrossValue)) {
    merged.estate.estimatedNetValue = merged.estate.estimatedGrossValue;
  }
  syncPathRouterValueFields(merged, { persist: false });
  merged.interestedPersons = (merged.interestedPersons || []).map(normalizeInterestedPerson);
  merged.interestedPersons = removePartialPrefixInterestedPersons(merged.interestedPersons);
  if (!merged.interestedPersons.length) merged.interestedPersons = [emptyInterestedPerson()];
  if (!merged.willBeneficiaries?.length) merged.willBeneficiaries = [emptyWillBeneficiary()];
  if (!merged.transferAffidavit?.assets?.length) merged.transferAffidavit.assets = [emptyTransferAsset()];
  if (!Array.isArray(merged.betaIssues)) merged.betaIssues = [];
  if (!merged.signatureStatus || typeof merged.signatureStatus !== "object" || Array.isArray(merged.signatureStatus)) merged.signatureStatus = {};
  if (!Array.isArray(merged.secureDeliveryLinks)) merged.secureDeliveryLinks = [];
  if (!merged.attorneyBetaReviews || typeof merged.attorneyBetaReviews !== "object" || Array.isArray(merged.attorneyBetaReviews)) merged.attorneyBetaReviews = {};
  if (!merged.heirship.children.people?.length) {
    const children = splitInterestedNames(merged.heirship.children.list).map((name) => ({ ...emptyHeirshipChild(), name }));
    merged.heirship.children.people = children.length ? children : [emptyHeirshipChild()];
  }
  if (!merged.inventory?.items?.length) merged.inventory.items = [emptyInventoryItem()];
  syncHeirshipChildrenList(merged, { persist: false });
  syncApplicantToPr(merged, { persist: false });
  syncSurvivingSpouseFromSpouseHistory(merged, { persist: false });
}

function ensurePlatformIdentity(target = state, options = {}) {
  if (!target.account) target.account = emptyState().account;
  if (!target.matter) target.matter = emptyState().matter;
  if (!hasValue(target.account.userId)) target.account.userId = newLocalId("user");
  if (!hasValue(target.account.role)) target.account.role = "public";
  if (!hasValue(target.matter.id)) target.matter.id = newLocalId("matter");
  if (!hasValue(target.matter.ownerUserId)) target.matter.ownerUserId = target.account.userId;
  if (!hasValue(target.matter.createdAt)) target.matter.createdAt = new Date().toISOString();
  target.matter.updatedAt = target.matter.updatedAt || "";
  target.matter.storageMode = PLATFORM_STORAGE_CONFIG.adapter;
  target.matter.dataModelVersion = PLATFORM_DATA_MODEL_VERSION;
  target.matter.dataClassification = "sensitive_probate_intake";
  if (target.attorneyHandoff && !FEATURE_ATTORNEY_HANDOFF) target.attorneyHandoff.status = "DISABLED";
  if (!Array.isArray(target.consentLogs)) target.consentLogs = [];
  if (!Array.isArray(target.auditLogs)) target.auditLogs = [];
  if (!Array.isArray(target.analyticsEvents)) target.analyticsEvents = [];
  if (!Array.isArray(target.betaIssues)) target.betaIssues = [];
  if (!target.signatureStatus || typeof target.signatureStatus !== "object" || Array.isArray(target.signatureStatus)) target.signatureStatus = {};
  if (!Array.isArray(target.secureDeliveryLinks)) target.secureDeliveryLinks = [];
  if (!target.attorneyBetaReviews || typeof target.attorneyBetaReviews !== "object" || Array.isArray(target.attorneyBetaReviews)) target.attorneyBetaReviews = {};
  if (options.persist !== false && target === state) saveState();
}

function applicantMatchesPr(applicant, pr) {
  return ["fullName", "address", "email", "phone", "signatureDate", "barNumber"].every((key) => {
    return comparableText(applicant[key]) === comparableText(pr[key]);
  });
}

function comparableText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function addressHintApplies(input) {
  const path = [
    input.dataset.path,
    input.dataset.guidedPath,
    input.dataset.personField,
    input.dataset.beneficiaryField,
    input.dataset.inventoryField,
    input.closest("label")?.textContent
  ].filter(Boolean).join(" ").toLowerCase();
  return input.tagName === "INPUT" && path.includes("address") && !input.placeholder;
}

function applyAddressPlaceholders(root = document) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll("input").forEach((input) => {
    if (addressHintApplies(input)) input.placeholder = ADDRESS_EXAMPLE;
  });
}

function syncEstateValueFields(target = state, options = {}) {
  if (hasValue(target.estate?.estimatedGrossValue) && !hasValue(target.estate?.estimatedNetValue)) {
    target.estate.estimatedNetValue = target.estate.estimatedGrossValue;
    if (options.persist !== false && target === state) saveState();
  }
}

function syncPathRouterValueFields(target = state, options = {}) {
  if (!target.pathRouter) target.pathRouter = emptyState().pathRouter;
  const estateValue = target.estate?.estimatedGrossValue || "";
  const routerValue = target.pathRouter?.grossValue || "";
  if (hasValue(estateValue) && !hasValue(routerValue)) {
    target.pathRouter.grossValue = estateValue;
  } else if (hasValue(routerValue) && !hasValue(estateValue)) {
    target.estate.estimatedGrossValue = routerValue;
    target.estate.estimatedNetValue = routerValue;
  }
  if (options.persist !== false && target === state) saveState();
}

function syncSurvivingSpouseFromSpouseHistory(target = state, options = {}) {
  const spouse = target.spouse || {};
  if (spouse.everMarried === "no") {
    target.heirship.spouse.exists = "no";
    target.heirship.spouse.name = "";
  } else if (spouse.everMarried === "yes") {
    if (hasValue(spouse.fullName)) target.heirship.spouse.name = spouse.fullName;
    const survived = spouse.livingStatus === "living" && spouse.statusAtDeath === "married";
    if (hasValue(spouse.livingStatus) && hasValue(spouse.statusAtDeath)) {
      target.heirship.spouse.exists = survived ? "yes" : "no";
    }
  }
  if (options.persist !== false && target === state) saveState();
}

function hasStableSuggestedName(value) {
  const name = cleanSuggestedPersonName(value);
  if (!name || name.length < 5) return false;
  if (/^[A-Za-z]$/.test(name)) return false;
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words[0].length >= 2 && words[words.length - 1].length >= 2) return true;
  return /\b(trust|foundation|church|inc|llc|corp|corporation|company|bank|credit union|charity|clinic|hospital|department|county|state)\b/i.test(name);
}

function hasSelectablePersonName(value) {
  const name = cleanSuggestedPersonName(value);
  return name.length >= 2 && !/^[A-Za-z]$/.test(name);
}

function isPrefixOfLongerName(shortName, longName) {
  const shortKey = normalizedPersonName(shortName);
  const longKey = normalizedPersonName(longName);
  return shortKey && longKey && longKey !== shortKey && longKey.startsWith(shortKey) && longKey.length >= shortKey.length + 1;
}

function partialGeneratedInterestedPerson(person = {}, allPeople = []) {
  const normalized = normalizeInterestedPerson(person);
  if (!hasValue(normalized.name)) return false;
  if (hasValue(normalized.address) || hasValue(normalized.email) || hasValue(normalized.phone) || hasValue(normalized.minorDateOfBirth)) return false;
  if (hasStableSuggestedName(normalized.name) && !allPeople.some((other) => isPrefixOfLongerName(normalized.name, other.name))) return false;
  return allPeople.some((other) => other !== person && isPrefixOfLongerName(normalized.name, other.name));
}

function removePartialPrefixInterestedPersons(people = []) {
  const normalized = people.map(normalizeInterestedPerson);
  const cleaned = normalized.filter((person) => !partialGeneratedInterestedPerson(person, normalized));
  return cleaned.length ? cleaned : [emptyInterestedPerson()];
}

function emptyInterestedPerson() {
  return {
    name: "",
    relationship: "",
    address: "",
    minorDateOfBirth: "",
    email: "",
    phone: "",
    barNumber: "",
    roles: {
      heir: false,
      beneficiary: false,
      namedPr: false,
      trustee: false,
      trustBeneficiary: false,
      minor: false,
      needsGuardian: false,
      military: false
    },
    service: {
      waiverStatus: "",
      locationStatus: "known",
      needsMailedNotice: false,
      protectedPerson: false
    }
  };
}

function emptyWillBeneficiary() {
  return { name: "", role: "beneficiary", relationship: "", address: "", minorDateOfBirth: "", notes: "" };
}

function emptyHeirshipChild() {
  return { name: "", address: "", livingStatus: "living", minorDateOfBirth: "", notes: "" };
}

function emptyInventoryItem(category = "") {
  return { category, description: "", value: "", encumbrance: "", marital: false, notes: "" };
}

function emptyTransferAsset() {
  return { type: "", holder: "", description: "", value: "", accountOrIdentifier: "", releaseInstructions: "", notes: "" };
}

function hasTrustInvolved(target = state) {
  const requests = target.requests || {};
  const will = target.will || {};
  const courtDrafts = target.courtDrafts || {};
  const trustText = [
    will.namedTrustee,
    will.nominatedTrustee,
    requests.trusteeNames,
    requests.trustName
  ].some(hasValue);
  const trustRequests = Boolean(requests.appointTrustee || requests.additionalTrusts);
  const trusteeBond = courtDrafts.trusteeBondType && courtDrafts.trusteeBondType !== "none";
  const willRoles = target.will?.hasNamedBeneficiaries === "yes" && (target.willBeneficiaries || []).some((person) => {
    const text = `${person.role || ""} ${person.relationship || ""} ${person.notes || ""}`.toLowerCase();
    return text.includes("trust") || text.includes("trustee");
  });
  const interestedRoles = (target.interestedPersons || []).some((person) => {
    const normalized = normalizeInterestedPerson(person);
    const text = `${normalized.relationship || ""}`.toLowerCase();
    return normalized.roles.trustee || normalized.roles.trustBeneficiary || text.includes("trust") || text.includes("trustee");
  });
  return Boolean((will.exists === "yes" && (trustText || willRoles || interestedRoles)) || trustRequests || trusteeBond);
}

function normalizeInterestedPerson(person = {}) {
  return mergeDeep(emptyInterestedPerson(), person);
}

function interestedPersonServiceStatus(person = {}) {
  const normalized = applyInterestedPersonInferences(person);
  const roles = normalized.roles || {};
  const service = normalized.service || {};
  const locationStatus = service.locationStatus || "known";
  const waiverStatus = service.waiverStatus || "";
  const addressKnown = hasValue(normalized.address) && locationStatus === "known";
  const protectedPerson = Boolean(service.protectedPerson || roles.minor || roles.needsGuardian || hasValue(normalized.minorDateOfBirth));
  const missingAddress = locationStatus === "missing_address" || !addressKnown;
  const unknownOrMissing = ["cannot_locate", "unknown_person"].includes(locationStatus);
  const unableToWaive = ["cannot_sign", "will_not_sign", "not_eligible"].includes(waiverStatus) || protectedPerson;
  const canSignWaiver = waiverStatus === "can_sign" && !unableToWaive && !unknownOrMissing;
  const needsMailedNotice = Boolean(service.needsMailedNotice || unableToWaive || unknownOrMissing);
  const needsAttention = unknownOrMissing || unableToWaive || service.needsMailedNotice || missingAddress || !hasValue(waiverStatus);
  const reasons = [];
  if (!hasValue(waiverStatus)) reasons.push("waiver status not answered");
  if (waiverStatus === "can_sign") reasons.push("can sign waiver");
  if (waiverStatus === "cannot_sign") reasons.push("cannot sign waiver");
  if (waiverStatus === "will_not_sign") reasons.push("will not sign waiver");
  if (waiverStatus === "not_eligible") reasons.push("not eligible to sign waiver");
  if (waiverStatus === "unknown") reasons.push("waiver status unknown");
  if (protectedPerson) reasons.push("minor/protected-person review");
  if (roles.military) reasons.push("military-service review");
  if (!addressKnown) reasons.push("mailing address not confirmed");
  if (locationStatus === "missing_address") reasons.push("address missing");
  if (locationStatus === "cannot_locate") reasons.push("cannot be located");
  if (locationStatus === "unknown_person") reasons.push("unknown or not reasonably ascertainable");
  if (service.needsMailedNotice) reasons.push("needs mailed notice");
  return {
    person: normalized,
    addressKnown,
    missingAddress,
    protectedPerson,
    unknownOrMissing,
    unableToWaive,
    canSignWaiver,
    needsMailedNotice,
    needsAttention,
    reasons
  };
}

function interestedPersonServiceSummary(data = state) {
  const statuses = (data.interestedPersons || [])
    .filter(hasInterestedPersonContent)
    .map(interestedPersonServiceStatus);
  const requiresNotice = statuses.some((status) => status.unableToWaive || status.unknownOrMissing || status.needsMailedNotice);
  return {
    statuses,
    total: statuses.length,
    canSignWaiverCount: statuses.filter((status) => status.canSignWaiver).length,
    requiresNotice,
    unknownOrMissingCount: statuses.filter((status) => status.unknownOrMissing).length,
    protectedCount: statuses.filter((status) => status.protectedPerson).length,
    mailedNoticeCount: statuses.filter((status) => status.needsMailedNotice).length,
    missingAddressCount: statuses.filter((status) => status.missingAddress).length,
    unansweredWaiverCount: statuses.filter((status) => !hasValue(status.person.service?.waiverStatus)).length
  };
}

function normalizeHeirshipChild(child = {}) {
  return { ...emptyHeirshipChild(), ...child };
}

function hasHeirshipChildContent(child = {}) {
  return ["name", "address", "minorDateOfBirth", "notes"].some((key) => hasValue(child[key])) || child.livingStatus === "deceased";
}

function childLine(child = {}) {
  const normalized = normalizeHeirshipChild(child);
  const name = cleanText(normalized.name);
  if (!name) return "";
  const parts = [name];
  if (normalized.livingStatus === "deceased") parts.push("deceased");
  return parts.filter(Boolean).join(" - ");
}

function childrenTextFromPeople(children = state.heirship.children.people) {
  return (children || []).filter(hasHeirshipChildContent).map(childLine).filter(Boolean).join("; ");
}

function syncHeirshipChildrenList(target = state, options = {}) {
  if (!target.heirship?.children) return;
  target.heirship.children.people = (target.heirship.children.people || []).map(normalizeHeirshipChild);
  if (!target.heirship.children.people.length) target.heirship.children.people = [emptyHeirshipChild()];
  const structuredText = childrenTextFromPeople(target.heirship.children.people);
  if (structuredText || target.heirship.children.exists === "yes") {
    target.heirship.children.list = structuredText;
  }
  if (options.persist !== false) saveState();
}

function saveState() {
  if (typeof localStorage === "undefined") {
    return;
  }
  if (state?.matter) {
    state.matter.updatedAt = new Date().toISOString();
    state.matter.storageMode = PLATFORM_STORAGE_CONFIG.adapter;
    state.matter.dataModelVersion = PLATFORM_DATA_MODEL_VERSION;
  }
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getPath(path) {
  return path.split(".").reduce((current, part) => current?.[part], state);
}

function setPath(path, value) {
  const parts = path.split(".");
  let current = state;
  for (const part of parts.slice(0, -1)) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[parts.at(-1)] = value;
  saveState();
}

function pathCanChangePeopleRoster(path = "") {
  return [
    "applicant.",
    "pr.",
    "spouse.",
    "heirship.",
    "will.",
    "willBeneficiaries.",
    "interestedPersons."
  ].some((prefix) => path.startsWith(prefix));
}

function refreshPeopleSuggestionsForPath(path = "") {
  if (!pathCanChangePeopleRoster(path)) return;
  renderInterestedSuggestions();
}

function wisconsinCountyOptions() {
  const library = typeof window !== "undefined" ? window.WI_COUNTY_DEFAULTS : null;
  const counties = library
    ? Object.values(library).map((entry) => entry.county).filter(Boolean).sort((a, b) => a.localeCompare(b))
    : [];
  return [
    { label: "Select county", value: "" },
    ...counties.map((county) => ({ label: county, value: county }))
  ];
}

function countyOptionsHtml(selected = "") {
  return wisconsinCountyOptions().map((option) => `
    <option value="${escapeAttr(option.value)}" ${valuesEqual(selected, option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>
  `).join("");
}

function populateCountySelects() {
  document.querySelectorAll('select[data-path="estate.county"]').forEach((select) => {
    const current = select.value || state.estate.county || "";
    select.innerHTML = countyOptionsHtml(current);
    select.value = current;
  });
}

function renderFields() {
  syncHeirshipChildrenList(state, { persist: false });
  syncEstateValueFields(state, { persist: false });
  syncPathRouterValueFields(state, { persist: false });
  syncSurvivingSpouseFromSpouseHistory(state, { persist: false });
  populateCountySelects();
  document.querySelectorAll("[data-path]").forEach((field) => {
    const value = getPath(field.dataset.path);
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? "";
    }
  });
  applyConditionalVisibility();
  applyAddressPlaceholders(document);
  ensureVisibleEditPanel();
}

function bindFields() {
  document.querySelectorAll("[data-path]").forEach((field) => {
    const update = () => {
      const path = field.dataset.path;
      const value = field.type === "checkbox" ? field.checked : field.value;
      setPath(path, value);
      if ((path === "pr.sameAsApplicant" || path.startsWith("applicant.")) && state.pr.sameAsApplicant) {
        syncApplicantToPr();
      }
      if (path === "pr.fullName" && !state.pr.sameAsApplicant && !state.requests.domiciliaryLettersTo) {
        state.requests.domiciliaryLettersTo = value;
        saveState();
      }
      if (path.startsWith("countyDefaults.")) {
        applyCountyDefaults({ force: true });
      } else if (path === "estate.county") {
        syncCountyDefaultsFromCounty();
      }
      if (path === "estate.estimatedGrossValue") {
        state.estate.estimatedNetValue = value;
        state.pathRouter.grossValue = value;
      }
      if (path === "pathRouter.grossValue") {
        state.estate.estimatedGrossValue = value;
        state.estate.estimatedNetValue = value;
      }
      if (path.startsWith("spouse.")) {
        syncSurvivingSpouseFromSpouseHistory();
      }
      if (path === "heirship.children.exists" && value === "yes" && !state.heirship.children.people.some(hasHeirshipChildContent)) {
        state.heirship.children.people = [emptyHeirshipChild()];
      }
      if (path === "will.exists") {
        renderWillBeneficiaries();
        renderInterestedSuggestions();
      }
      if (path === "will.hasNamedBeneficiaries") {
        if (value === "yes" && !state.willBeneficiaries.length) {
          state.willBeneficiaries.push(emptyWillBeneficiary());
        }
        renderWillBeneficiaries();
        renderInterestedSuggestions();
      }
      if (path.startsWith("heirship.children.")) {
        syncHeirshipChildrenList();
        renderHeirshipChildren();
      }
      refreshPeopleSuggestionsForPath(path);
      renderReview();
      renderFields();
      renderInterviewStatus();
    };
    field.addEventListener("input", update);
    if (field.tagName === "SELECT") {
      field.addEventListener("change", update);
    }
  });
}

function syncApplicantToPr(target = state, options = {}) {
  if (!target.pr?.sameAsApplicant) {
    return;
  }
  const previousName = target.pr.fullName;
  ["fullName", "address", "email", "phone", "signatureDate", "barNumber"].forEach((key) => {
    target.pr[key] = target.applicant?.[key] || "";
  });
  if (target.requests) {
    const currentLettersTo = target.requests.domiciliaryLettersTo;
    if (!hasValue(currentLettersTo) || comparableText(currentLettersTo) === comparableText(previousName)) {
      target.requests.domiciliaryLettersTo = target.pr.fullName;
    }
  }
  if (options.persist !== false) {
    saveState();
  }
}

function applyConditionalVisibility() {
  document.querySelectorAll("[data-show-when]").forEach((element) => {
    const shouldShow = shouldShowConditional(element.dataset.showWhen);
    element.hidden = !shouldShow;
    element.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  });
}

function ensureVisibleEditPanel() {
  const activePanel = document.querySelector(".panel.active");
  if (activePanel && activePanel.hidden) {
    const firstVisibleStep = [...document.querySelectorAll(".step")].find((step) => !step.hidden);
    if (firstVisibleStep) activateEditStep(firstVisibleStep.dataset.step);
  }
}

function shouldShowConditional(condition) {
  const spouseExists = state.heirship.spouse.exists;
  const childrenExist = state.heirship.children.exists;
  const fallbackRelatives = spouseExists === "no" && childrenExist === "no";
  const fallbackSiblings = fallbackRelatives && state.heirship.parents.exists === "no";
  const benefitNeedsExplanation = [
    state.benefits.medicalAssistance,
    state.benefits.familyCare,
    state.benefits.communityOptions,
    state.benefits.chronicDisease
  ].includes("did") || state.benefits.institution === "was" || state.benefits.lackInfo;

  const checks = {
    prSame: Boolean(state.pr.sameAsApplicant),
    prDifferent: !state.pr.sameAsApplicant,
    residentAgent: state.pr.isWisconsinResident === "no",
    willYes: state.will.exists === "yes",
    willNo: state.will.exists === "no",
    willBeneficiariesYes: state.will.exists === "yes" && state.will.hasNamedBeneficiaries === "yes",
    hasCodicils: state.will.exists === "yes" && state.will.hasCodicils === "yes",
    willPriorCase: state.will.exists === "yes" && ["court", "probated_elsewhere"].includes(state.will.location),
    benefitExplanation: benefitNeedsExplanation,
    spouseYes: spouseExists === "yes",
    childrenYes: childrenExist === "yes",
    spouseAndChildrenYes: spouseExists === "yes" && childrenExist === "yes",
    blendedChildren: spouseExists === "yes" && childrenExist === "yes" && state.heirship.children.allOfSurvivingSpouse === "no",
    fallbackParents: fallbackRelatives,
    parentsYes: fallbackRelatives && state.heirship.parents.exists === "yes",
    fallbackSiblings,
    siblingsYes: fallbackSiblings && state.heirship.siblings.exists === "yes",
    fallbackGrandparents: fallbackSiblings && state.heirship.siblings.exists === "no",
    survivorshipYes: state.heirship.survivorship120.exists === "yes",
    trustInvolved: hasTrustInvolved(),
    prSuretyBond: state.courtDrafts.prBondType === "surety",
    trusteeSuretyBond: hasTrustInvolved() && state.courtDrafts.trusteeBondType === "surety",
    otherFinding: Boolean(state.courtDrafts.otherFindingsSelected),
    otherOrder: Boolean(state.courtDrafts.otherOrdersSelected),
    otherRequest: Boolean(state.requests.otherSelected),
    question10Other: Boolean(state.requests.question10OtherSelected)
  };
  return checks[condition] ?? true;
}

const interviewSteps = [
  {
    id: "role",
    group: "Start",
    title: "Who is completing this probate?",
    help: "This answer helps tailor later wording, but it does not change the forms.",
    fields: [
      {
        path: "intake.userRole",
        type: "choice",
        required: true,
        options: [
          { label: "Family member", value: "family" },
          { label: "Nominated PR", value: "nominated_pr" },
          { label: "Attorney", value: "attorney" },
          { label: "Paralegal", value: "paralegal" }
        ]
      }
    ]
  },
  {
    id: "path-router",
    group: "Start",
    title: "Start your Wisconsin probate forms",
    help: "Start free with the Wisconsin Probate Form Starter. The software keeps collecting useful facts whether Transfer by Affidavit, informal probate forms, or attorney review may be the next step.",
    render: renderProbatePathRouter,
    complete: () => probatePathRouterComplete(),
    statusMessage: () => probatePathRouterMessage(),
    fields: []
  },
  {
    id: "transfer-affidavit",
    group: "Small Estate",
    title: "Can this use a Transfer by Affidavit package?",
    help: "For smaller Wisconsin estates, this can be the lower-cost path before opening informal probate. This MVP prepares a draft package and checklist until the official PR-1831 template is added.",
    visible: () => probatePathDecision().key === "transfer_affidavit",
    render: renderTransferAffidavitInterview,
    complete: () => validateTransferAffidavit().blockers.length === 0,
    statusMessage: () => transferAffidavitStatusMessage(),
    fields: []
  },
  {
    id: "county",
    group: "Estate",
    title: "Where will this informal probate be filed?",
    help: "Use one estimated probate-property value here. The app uses it for the PR-1801 value field and the Transfer by Affidavit warning.",
    fields: [
      { path: "estate.county", label: "Wisconsin county", type: "select", options: wisconsinCountyOptions },
      { path: "estate.estimatedGrossValue", label: "Estimated probate property value", inputmode: "decimal", placeholder: "85000", required: false }
    ]
  },
  {
    id: "county-court-setup",
    group: "Estate",
    title: "What should the app use for this county's court details?",
    help: "These defaults flow into PR-1804 and PR-1805 so the same courthouse, probate office, registrar, and newspaper do not need to be typed repeatedly.",
    render: renderCountyCourtSetup,
    complete: () => countyDefaultsStatus().requiredMissing === 0,
    statusMessage: () => countyDefaultsMessage(),
    fields: []
  },
  {
    id: "other-proceedings",
    group: "Estate",
    title: "Are there any other estate proceedings pending?",
    fields: [
      {
        path: "otherProceedings.status",
        type: "choice",
        options: [
          { label: "No", value: "not_pending" },
          { label: "Yes", value: "pending" }
        ]
      },
      {
        path: "otherProceedings.explanation",
        label: "Brief explanation",
        visible: () => state.otherProceedings.status === "pending"
      }
    ]
  },
  {
    id: "decedent-basics",
    group: "Decedent",
    title: "What is the decedent's name and date of death?",
    fields: [
      { path: "decedent.fullName", label: "Full legal name", placeholder: "Jane A. Decedent" },
      { path: "decedent.dateOfDeath", label: "Date of death", type: "date" },
      { path: "decedent.dateOfBirth", label: "Date of birth", type: "date", required: false }
    ]
  },
  {
    id: "decedent-domicile",
    group: "Decedent",
    title: "Where did the decedent live?",
    fields: [
      { path: "decedent.domicileCounty", label: "Domicile county", placeholder: "Milwaukee" },
      { path: "decedent.domicileState", label: "Domicile state", placeholder: "Wisconsin" },
      { path: "decedent.lastMailingAddress", label: "Last mailing address", placeholder: ADDRESS_EXAMPLE, required: false }
    ]
  },
  {
    id: "decedent-benefits",
    group: "Decedent",
    title: "Did the decedent receive public benefits?",
    help: "PR-1801 asks about Medical Assistance, Family Care, Community Options, Chronic Disease Program benefits, and state or county institutions.",
    render: renderGuidedBenefits,
    complete: () => guidedBenefitsComplete(),
    statusMessage: () => guidedBenefitsMessage(),
    fields: []
  },
  {
    id: "applicant-name",
    group: "Applicant",
    title: "What is your name and address?",
    fields: [
      { path: "applicant.fullName", label: "Your full name" },
      { path: "applicant.address", label: "Your mailing address", placeholder: ADDRESS_EXAMPLE },
      { path: "applicant.capacity", label: "Your relationship or interest", placeholder: "Adult child, spouse, heir, nominated PR" }
    ]
  },
  {
    id: "applicant-contact",
    group: "Applicant",
    title: "What is your contact information?",
    fields: [
      { path: "applicant.email", label: "Email", type: "email", required: false },
      { path: "applicant.phone", label: "Phone", type: "tel", required: false },
      { path: "applicant.signatureDate", label: "Signature date", type: "date", required: false },
      { path: "applicant.barNumber", label: "State Bar number", required: false }
    ]
  },
  {
    id: "personal-rep",
    group: "Personal Representative",
    title: "Will you be serving as Personal Representative?",
    fields: [
      {
        path: "pr.sameAsApplicant",
        type: "choice",
        options: [
          { label: "Yes, I will serve", value: true },
          { label: "No, someone else", value: false }
        ]
      },
      {
        path: "pr.isWisconsinResident",
        label: "Is the proposed Personal Representative a Wisconsin resident?",
        type: "choice",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      }
    ]
  },
  {
    id: "personal-rep-details",
    group: "Personal Representative",
    title: "Who will serve as Personal Representative?",
    visible: () => !state.pr.sameAsApplicant,
    fields: [
      { path: "pr.fullName", label: "Full name" },
      { path: "pr.address", label: "Mailing address" },
      { path: "pr.email", label: "Email", type: "email", required: false },
      { path: "pr.phone", label: "Phone", type: "tel", required: false }
    ]
  },
  {
    id: "resident-agent",
    group: "Personal Representative",
    title: "Who is the Wisconsin resident agent?",
    visible: () => state.pr.isWisconsinResident === "no",
    fields: [
      { path: "pr.residentAgent.name", label: "Resident agent name" },
      { path: "pr.residentAgent.address", label: "Resident agent mailing address" },
      { path: "pr.residentAgent.email", label: "Email", type: "email", required: false },
      { path: "pr.residentAgent.phone", label: "Phone", type: "tel", required: false }
    ]
  },
  {
    id: "will-status",
    group: "Will",
    title: "Did the decedent leave a will?",
    fields: [
      {
        path: "will.exists",
        type: "choice",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not sure", value: "unknown" }
        ]
      }
    ]
  },
  {
    id: "will-details",
    group: "Will",
    title: "Tell us about the will.",
    visible: () => state.will.exists === "yes",
    fields: [
      { path: "will.date", label: "Will date", type: "date" },
      {
        path: "will.hasCodicils",
        label: "Are there any codicils?",
        type: "choice",
        options: [
          { label: "No", value: "no" },
          { label: "Yes", value: "yes" }
        ]
      },
      {
        path: "will.location",
        label: "Original will status",
        type: "select",
        options: [
          { label: "Select", value: "" },
          { label: "In possession of the court", value: "court" },
          { label: "Accompanies this application", value: "accompanies" },
          { label: "Probated elsewhere", value: "probated_elsewhere" },
          { label: "En route to court", value: "en_route" }
        ]
      }
    ]
  },
  {
    id: "codicils",
    group: "Will",
    title: "What are the codicil dates?",
    visible: () => state.will.exists === "yes" && state.will.hasCodicils === "yes",
    fields: [
      { path: "will.codicilDates", label: "Codicil date or dates", placeholder: "Separate multiple dates with commas" }
    ]
  },
  {
    id: "will-names",
    group: "Will",
    title: "Does the will name anyone for a role?",
    visible: () => state.will.exists === "yes",
    help: "Use people already entered when possible, or type a new name. This is only for roles named in the will, not asset values.",
    render: renderGuidedWillRoles,
    complete: () => true,
    fields: []
  },
  {
    id: "will-beneficiaries",
    group: "Will",
    title: "Does the will name beneficiaries or trust beneficiaries?",
    help: "For opening, collect names and mailing addresses for notice and waivers. Asset values and specific bequest details can wait for inventory and accounting.",
    visible: () => state.will.exists === "yes",
    render: renderGuidedWillBeneficiaries,
    complete: () => guidedWillBeneficiariesComplete(),
    statusMessage: () => guidedWillBeneficiariesMessage(),
    fields: []
  },
  {
    id: "no-will",
    group: "Will",
    title: "Have you made diligent inquiry for a will?",
    visible: () => state.will.exists === "no",
    fields: [
      {
        path: "will.noWillDiligentInquiry",
        type: "choice",
        options: [
          { label: "Yes, no unrevoked will found", value: true },
          { label: "Not yet", value: false }
        ]
      }
    ]
  },
  {
    id: "heirship-informant",
    group: "Heirship",
    title: "Who will answer the heirship questions?",
    fields: [
      { type: "partySelect", label: "Choose from people already entered", target: "heirshipInformant", required: false },
      { path: "heirship.informant.name", label: "Name" },
      { path: "heirship.informant.relationship", label: "Relationship to decedent" },
      { path: "heirship.informant.address", label: "Mailing address" }
    ]
  },
  {
    id: "spouse",
    group: "Heirship",
    title: "Was the decedent ever married or in a domestic partnership?",
    help: "PR-1801 asks about spouse/domestic partner history. PR-1806 separately needs to know whether a spouse or domestic partner survived the decedent.",
    render: renderGuidedSpouseHistory,
    complete: () => guidedSpouseHistoryComplete(),
    statusMessage: () => guidedSpouseHistoryMessage(),
    fields: []
  },
  {
    id: "spouse-benefits",
    group: "Heirship",
    title: "Do we need spouse or domestic partner benefit details?",
    help: "PR-1801 has spouse/domestic partner fields for Community Options Program and Chronic Disease Program benefits when the decedent was ever married or in a domestic partnership.",
    visible: () => state.spouse.everMarried === "yes",
    render: renderGuidedSpouseBenefits,
    complete: () => guidedSpouseBenefitsComplete(),
    statusMessage: () => guidedSpouseBenefitsMessage(),
    fields: []
  },
  {
    id: "children",
    group: "Heirship",
    title: "Did the decedent have any children, living or deceased?",
    render: renderGuidedChildren,
    complete: () => state.heirship.children.exists === "no" || (state.heirship.children.exists === "yes" && state.heirship.children.people.some((child) => hasValue(child.name))),
    statusMessage: () => state.heirship.children.exists === "yes" && !state.heirship.children.people.some((child) => hasValue(child.name)) ? "Because this is marked Yes, add at least one child name. If there were no children, choose No." : "",
    fields: []
  },
  {
    id: "blended-family",
    group: "Heirship",
    title: "Are all children also children of the surviving spouse or domestic partner?",
    visible: () => state.heirship.spouse.exists === "yes" && state.heirship.children.exists === "yes",
    fields: [
      {
        path: "heirship.children.allOfSurvivingSpouse",
        type: "choice",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      {
        path: "heirship.children.blendedDetails",
        label: "Details",
        visible: () => state.heirship.children.allOfSurvivingSpouse === "no"
      }
    ]
  },
  {
    id: "fallback-relatives",
    group: "Heirship",
    title: "Are there surviving parents, siblings, or other relatives?",
    visible: () => state.heirship.spouse.exists === "no" && state.heirship.children.exists === "no",
    fields: [
      {
        path: "heirship.parents.exists",
        label: "Surviving parents?",
        type: "choice",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      {
        path: "heirship.parents.names",
        label: "Parent names",
        visible: () => state.heirship.parents.exists === "yes"
      },
      {
        path: "heirship.siblings.exists",
        label: "Surviving brothers or sisters?",
        type: "choice",
        visible: () => state.heirship.parents.exists === "no",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      {
        path: "heirship.siblings.names",
        label: "Sibling names",
        visible: () => state.heirship.parents.exists === "no" && state.heirship.siblings.exists === "yes"
      },
      {
        path: "heirship.grandparents.summary",
        label: "Grandparents or descendants",
        visible: () => state.heirship.parents.exists === "no" && state.heirship.siblings.exists === "no"
      }
    ]
  },
  {
    id: "survivorship",
    group: "Heirship",
    title: "Did any listed person die within 120 hours after the decedent?",
    fields: [
      {
        path: "heirship.survivorship120.exists",
        type: "choice",
        options: [
          { label: "No", value: "no" },
          { label: "Yes", value: "yes" }
        ]
      },
      {
        path: "heirship.survivorship120.details",
        label: "Names, dates, descendants",
        visible: () => state.heirship.survivorship120.exists === "yes"
      }
    ]
  },
  {
    id: "people-roster",
    group: "People",
    title: "Who is in this case so far?",
    help: "This master roster merges applicant, PR, will, heirship, beneficiary, and interested-person answers so duplicates are easier to spot before notices or waivers are prepared.",
    render: renderMasterPeopleRoster,
    complete: () => peopleRosterStatus().missingSuggested === 0,
    statusMessage: () => peopleRosterMessage(),
    fields: []
  },
  {
    id: "interested-person",
    group: "Interested Persons",
    title: "Who should receive notice or sign a waiver?",
    help: "Start by adding the people suggested from the will, heirship, applicant, and proposed PR answers.",
    render: renderGuidedInterestedSuggestions,
    complete: () => guidedInterestedSuggestionsComplete(),
    statusMessage: () => guidedInterestedSuggestionsMessage(),
    fields: []
  },
  {
    id: "interested-details",
    group: "Interested Persons",
    title: "Confirm each interested person's details.",
    help: "Confirm names, mailing addresses, and roles before deciding waivers or notice.",
    render: renderGuidedInterestedPersonDetails,
    complete: () => guidedInterestedPersonsComplete(),
    statusMessage: () => guidedInterestedPersonsMessage(),
    fields: []
  },
  {
    id: "interested-service",
    group: "Interested Persons",
    title: "Can each interested person sign a waiver?",
    help: "This step drives whether the case can open on PR-1803 waivers or needs PR-1805 notice.",
    render: renderGuidedInterestedService,
    complete: () => guidedInterestedServiceComplete(),
    statusMessage: () => guidedInterestedServiceMessage(),
    fields: []
  },
  {
    id: "interested-source-review",
    group: "Interested Persons",
    title: "Interested Person Audit",
    help: "Review every person or entity the app found, why each one is included or excluded, and what waiver/notice action is needed.",
    render: renderInterestedPersonsSourceReview,
    complete: () => interestedPersonSourceReviewItems().some((item) => item.current),
    statusMessage: () => interestedPersonSourceReviewMessage(),
    fields: []
  },
  {
    id: "address-contact-review",
    group: "Contact Review",
    title: "Which addresses or contact details are still missing?",
    help: "Mailing addresses are needed for waivers, notices, and service. Phone and email help with follow-up but do not replace service requirements.",
    render: renderAddressContactReview,
    complete: () => addressContactStatus().missingRequired === 0,
    statusMessage: () => addressContactReviewMessage(),
    fields: []
  },
  {
    id: "opening-path",
    group: "Opening Path",
    title: "Can this estate open on waivers, or does it need notice?",
    help: "Answer who can sign, who cannot be found, and whether publication will be needed. The app will show the packet result immediately.",
    render: renderOpeningPathInterview,
    complete: () => openingPathInterviewComplete(),
    statusMessage: () => openingPathInterviewMessage(),
    fields: []
  },
  {
    id: "attorney-handoff",
    group: "Attorney Review",
    title: "Attorney review is recommended.",
    help: "The software can organize an information summary that the user may download and choose whether to share with a Wisconsin probate attorney.",
    visible: () => attorneyHandoffRecommended(),
    render: renderAttorneyHandoff,
    complete: () => attorneyHandoffComplete(),
    statusMessage: () => attorneyHandoffMessage(),
    fields: []
  },
  {
    id: "opening-docs-ready",
    group: "Opening Path",
    title: "Do you want to prepare the opening documents now?",
    help: "The opening packet can be generated now, or you can continue to inventory and come back to forms later.",
    render: renderOpeningDocsHandoff,
    complete: () => openingDocumentReadiness().ready,
    statusMessage: () => openingDocumentReadinessMessage(),
    fields: []
  },
  {
    id: "opening-filing-instructions",
    group: "Opening Path",
    title: "Opening Packet Filing Instructions",
    help: "Use this plain-English handoff before signing, filing, serving, publishing, or waiting for letters.",
    render: renderOpeningFilingInstructions,
    complete: () => openingDocumentReadiness().ready,
    statusMessage: () => openingFilingInstructionsMessage(),
    fields: []
  },
  {
    id: "post-opening-handoff",
    group: "After Opening",
    title: "Were domiciliary letters issued yet?",
    help: "After the court issues domiciliary letters, enter the appointment dates and deadlines so inventory and claims tasks are tracked correctly.",
    render: renderPostOpeningHandoff,
    complete: () => hasValue(state.deadlines.lettersIssuedDate) && hasValue(state.deadlines.inventoryDueDate),
    statusMessage: () => postOpeningHandoffMessage(),
    fields: []
  },
  {
    id: "inventory-starter",
    group: "Inventory",
    title: "What property should start the PR-1811 inventory?",
    help: "Add the first bank accounts, vehicles, real estate, personal property, liens, and marital-property flags. This is a starter inventory, not the final accounting.",
    render: renderGuidedInventoryWizard,
    complete: () => guidedInventoryComplete(),
    statusMessage: () => guidedInventoryMessage(),
    fields: []
  },
  {
    id: "review",
    group: "Review",
    title: "Review the answers and generate the forms.",
    help: "Use Review/Edit answers for the full worksheet, more interested persons, service details, inventory, and generated PR forms.",
    fields: []
  }
];

const interviewNavLabels = {
  role: "Start",
  "path-router": "Path check",
  "transfer-affidavit": "Affidavit",
  county: "County",
  "county-court-setup": "Court setup",
  "other-proceedings": "Other proceedings",
  "decedent-basics": "Decedent",
  "decedent-domicile": "Residence",
  "decedent-benefits": "Benefits",
  "applicant-name": "Applicant",
  "applicant-contact": "Contact",
  "personal-rep": "PR choice",
  "personal-rep-details": "PR details",
  "resident-agent": "Resident agent",
  "will-status": "Will",
  "will-details": "Will details",
  codicils: "Codicils",
  "will-names": "Will roles",
  "will-beneficiaries": "Beneficiaries",
  "no-will": "No will",
  "heirship-informant": "Heirship helper",
  spouse: "Spouse",
  "spouse-benefits": "Spouse benefits",
  children: "Children",
  "blended-family": "Blended family",
  "fallback-relatives": "Other relatives",
  survivorship: "120 hours",
  "people-roster": "People roster",
  "interested-person": "Interested person",
  "interested-details": "Details",
  "interested-service": "Waivers/service",
  "interested-source-review": "Source review",
  "address-contact-review": "Addresses",
  "opening-path": "Opening path",
  "attorney-handoff": "Attorney review",
  "opening-docs-ready": "Packet ready",
  "opening-filing-instructions": "Filing instructions",
  "post-opening-handoff": "Letters issued",
  "inventory-starter": "Inventory",
  review: "Review"
};

const interviewPhaseConfigs = [
  {
    key: "start",
    label: "Start",
    groups: ["Start", "Small Estate"],
    detail: "Choose the likely path before the app asks for probate details."
  },
  {
    key: "case",
    label: "Case facts",
    groups: ["Estate", "Decedent", "Applicant", "Personal Representative", "Will"],
    detail: "Collect the facts that drive PR-1801 and the court opening packet."
  },
  {
    key: "family",
    label: "Family tree",
    groups: ["Heirship", "People", "Interested Persons", "Contact Review"],
    detail: "Identify heirs, beneficiaries, missing addresses, and waiver/notice treatment."
  },
  {
    key: "opening",
    label: "Opening packet",
    groups: ["Opening Path", "Attorney Review"],
    detail: "Decide waiver path vs. PR-1805 notice and prepare the opening instructions."
  },
  {
    key: "after",
    label: "After opening",
    groups: ["After Opening", "Inventory"],
    detail: "Track letters, deadlines, inventory, and post-opening administration."
  },
  {
    key: "review",
    label: "Review",
    groups: ["Review"],
    detail: "Review answers and generate forms."
  }
];

function interviewPhaseForStep(step = {}) {
  return interviewPhaseConfigs.find((phase) => phase.groups.includes(step.group)) || interviewPhaseConfigs.at(-1);
}

function interviewPhaseGroups(steps = visibleInterviewSteps()) {
  return interviewPhaseConfigs
    .map((phase) => {
      const phaseSteps = steps.filter((step) => interviewPhaseForStep(step).key === phase.key);
      return {
        ...phase,
        steps: phaseSteps,
        completeCount: phaseSteps.filter(isInterviewStepComplete).length
      };
    })
    .filter((phase) => phase.steps.length);
}

function visibleInterviewSteps() {
  return interviewSteps.filter((step) => !step.visible || step.visible());
}

function syncVisibleInterviewStep() {
  const steps = visibleInterviewSteps();
  if (!steps.length) return steps;
  if (!steps.some((step) => step.id === state.ui?.interviewStepId)) {
    state.ui.interviewStepId = steps[0].id;
    saveState();
  }
  return steps;
}

function visibleInterviewFields(step) {
  return (step.fields || []).filter((field) => !field.visible || field.visible());
}

function currentInterviewIndex(steps = visibleInterviewSteps()) {
  const currentId = state.ui?.interviewStepId;
  const index = steps.findIndex((step) => step.id === currentId);
  return index >= 0 ? index : 0;
}

function setViewMode(mode) {
  state.ui.mode = mode;
  saveState();
  renderViewMode();
  renderFields();
  renderInterestedPersons();
  renderWillBeneficiaries();
  renderInventoryItems();
  renderTaskTracker();
  renderReview();
  renderInterview();
}

function renderViewMode() {
  const guided = state.ui.mode !== "edit";
  const funnel = state.ui.mode === "funnel";
  const forms = state.ui.mode === "forms";
  const roadmap = state.ui.mode === "roadmap";
  const admin = state.ui.mode === "admin";
  const scenarios = state.ui.mode === "scenarios";
  const funnelView = document.getElementById("funnelView");
  const interviewView = document.getElementById("interviewView");
  const formsView = document.getElementById("formsView");
  const roadmapView = document.getElementById("roadmapView");
  const adminView = document.getElementById("adminView");
  const scenarioView = document.getElementById("scenarioView");
  const editView = document.getElementById("editView");
  const funnelModeBtn = document.getElementById("funnelModeBtn");
  const guidedModeBtn = document.getElementById("guidedModeBtn");
  const formsModeBtn = document.getElementById("formsModeBtn");
  const roadmapModeBtn = document.getElementById("roadmapModeBtn");
  const adminModeBtn = document.getElementById("adminModeBtn");
  const scenariosModeBtn = document.getElementById("scenariosModeBtn");
  const editModeBtn = document.getElementById("editModeBtn");
  if (!funnelView || !interviewView || !editView || !formsView || !roadmapView || !adminView || !scenarioView) return;
  funnelView.hidden = !funnel;
  interviewView.hidden = !guided || funnel || forms || roadmap || admin || scenarios;
  formsView.hidden = !forms;
  roadmapView.hidden = !roadmap;
  adminView.hidden = !admin;
  scenarioView.hidden = !scenarios;
  editView.hidden = state.ui.mode !== "edit";
  funnelModeBtn?.classList.toggle("active", funnel);
  guidedModeBtn?.classList.toggle("active", state.ui.mode === "guided" || !state.ui.mode);
  formsModeBtn?.classList.toggle("active", forms);
  roadmapModeBtn?.classList.toggle("active", roadmap);
  adminModeBtn?.classList.toggle("active", admin);
  scenariosModeBtn?.classList.toggle("active", scenarios);
  editModeBtn?.classList.toggle("active", state.ui.mode === "edit");
  if (forms) renderFormsView();
  if (roadmap) renderRoadmapView();
  if (admin) renderAdminView();
  if (scenarios) renderScenarioView();
}

function activateEditStep(stepName) {
  document.querySelectorAll(".step").forEach((step) => step.classList.toggle("active", step.dataset.step === stepName));
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === stepName));
}

function bindModeControls() {
  document.getElementById("funnelModeBtn")?.addEventListener("click", () => setViewMode("funnel"));
  document.querySelectorAll("[data-funnel-start]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.mode = "guided";
      state.ui.interviewStepId = "path-router";
      saveState();
      renderViewMode();
      renderInterview();
      scrollInterviewToTop();
    });
  });
  document.querySelectorAll("[data-funnel-forms]").forEach((button) => {
    button.addEventListener("click", () => setViewMode("forms"));
  });
  document.getElementById("guidedModeBtn")?.addEventListener("click", () => setViewMode("guided"));
  document.getElementById("formsModeBtn")?.addEventListener("click", () => setViewMode("forms"));
  document.getElementById("formsBackBtn")?.addEventListener("click", () => setViewMode("guided"));
  document.getElementById("roadmapModeBtn")?.addEventListener("click", () => setViewMode("roadmap"));
  document.getElementById("roadmapBackBtn")?.addEventListener("click", () => setViewMode("guided"));
  document.getElementById("roadmapScenariosBtn")?.addEventListener("click", () => setViewMode("scenarios"));
  document.getElementById("adminModeBtn")?.addEventListener("click", () => setViewMode("admin"));
  document.getElementById("adminBackBtn")?.addEventListener("click", () => setViewMode("guided"));
  document.getElementById("adminSaveMatterBtn")?.addEventListener("click", () => {
    persistMatterCheckpoint("admin_save_matter_checkpoint");
    renderAdminView();
  });
  document.getElementById("scenariosModeBtn")?.addEventListener("click", () => setViewMode("scenarios"));
  document.getElementById("scenariosBackBtn")?.addEventListener("click", () => setViewMode("guided"));
  document.getElementById("runAllScenariosBtn")?.addEventListener("click", renderScenarioView);
  document.getElementById("editModeBtn")?.addEventListener("click", () => setViewMode("edit"));
  document.getElementById("interviewEditBtn")?.addEventListener("click", () => setViewMode("edit"));
}

function bindInterviewControls() {
  document.getElementById("interviewBackBtn")?.addEventListener("click", () => moveInterview(-1));
  document.getElementById("interviewNextBtn")?.addEventListener("click", () => moveInterview(1));
}

function moveInterview(delta) {
  const steps = syncVisibleInterviewStep();
  const index = currentInterviewIndex(steps);
  const current = steps[index];
  if (delta > 0 && current?.id === "role" && !isInterviewStepComplete(current)) {
    renderInterviewStatus();
    const message = document.getElementById("interviewMessage");
    if (message) message.textContent = "Choose who is completing the forms before continuing.";
    return;
  }
  if (delta > 0 && index >= steps.length - 1) {
    setViewMode("edit");
    scrollInterviewToTop();
    return;
  }
  const nextIndex = Math.max(0, Math.min(steps.length - 1, index + delta));
  state.ui.interviewStepId = steps[nextIndex].id;
  saveState();
  renderInterview();
  scrollInterviewToTop();
}

function goToInterviewStep(stepId) {
  const steps = visibleInterviewSteps();
  if (!steps.some((step) => step.id === stepId)) return;
  state.ui.interviewStepId = stepId;
  saveState();
  renderInterview();
  scrollInterviewToTop();
}

function scrollInterviewToTop() {
  window.requestAnimationFrame(() => {
    const target = document.querySelector(".interview-panel") || document.getElementById("interviewFields");
    target?.scrollIntoView({ block: "start" });
    window.scrollTo({ top: 0, left: 0 });
  });
}

function renderInterview() {
  const card = document.getElementById("interviewFields");
  if (!card) return;
  const steps = syncVisibleInterviewStep();
  let index = currentInterviewIndex(steps);
  let step = steps[index] || steps[0];
  if (!step) return;
  if (state.ui.interviewStepId !== step.id) {
    state.ui.interviewStepId = step.id;
    saveState();
  }

  document.getElementById("interviewGroupTitle").textContent = interviewPhaseForStep(step).label;
  document.getElementById("interviewQuestion").textContent = step.title;
  const helpElement = document.getElementById("interviewHelp");
  helpElement.innerHTML = step.help
    ? `<details class="interview-help-details"><summary>Why this matters</summary><p>${escapeHtml(step.help)}</p></details>`
    : "";
  document.getElementById("interviewStepMeta").textContent = `Step ${index + 1} of ${steps.length}`;
  card.innerHTML = "";

  const fields = visibleInterviewFields(step);
  if (typeof step.render === "function") {
    card.appendChild(step.render());
  } else if (!fields.length) {
    const complete = document.createElement("div");
    complete.className = "interview-complete";
    complete.innerHTML = `
      <h3>Ready for the worksheet</h3>
      <p>The guided interview has captured the core opening facts. The full review screen has the remaining advanced details and form-generation buttons.</p>
    `;
    card.appendChild(complete);
  } else {
    fields.forEach((field) => card.appendChild(renderInterviewField(field)));
  }
  applyAddressPlaceholders(card);
  renderInterviewStatus();
}

function renderInterviewField(field) {
  if (field.type === "choice") {
    return renderChoiceField(field);
  }
  if (field.type === "partySelect") {
    return renderInterviewPartySelect(field);
  }
  const label = document.createElement("label");
  label.className = "interview-label";
  label.textContent = field.label || "";
  const control = field.type === "textarea" ? document.createElement("textarea") : document.createElement(field.type === "select" ? "select" : "input");
  control.dataset.interviewPath = field.path;
  if (field.type && !["select", "textarea"].includes(field.type)) control.type = field.type;
  if (field.placeholder) control.placeholder = field.placeholder;
  if (!field.placeholder && `${field.path || ""} ${field.label || ""}`.toLowerCase().includes("address")) {
    control.placeholder = ADDRESS_EXAMPLE;
  }
  if (field.inputmode) control.inputMode = field.inputmode;
  if (field.type === "textarea") control.rows = field.rows || 3;
  if (field.type === "select") {
    const options = typeof field.options === "function" ? field.options() : (field.options || []);
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      control.appendChild(optionElement);
    });
  }
  control.value = getPath(field.path) ?? "";
  control.addEventListener("input", () => updateInterviewState(field.path, control.value, { rerender: false }));
  control.addEventListener("change", () => updateInterviewState(field.path, control.value, { rerender: field.type === "select" }));
  label.appendChild(control);
  return label;
}

function renderInterviewPartySelect(field) {
  const label = document.createElement("label");
  label.className = "interview-label party-picker";
  label.textContent = field.label || "Choose existing person";
  const select = document.createElement("select");
  select.innerHTML = existingPartyOptionsHtml();
  select.addEventListener("change", () => {
    const party = existingPartyFromSelectValue(select.value);
    if (!party) return;
    applyExistingParty(field.target, field.index, party);
  });
  label.appendChild(select);
  return label;
}

function renderChoiceField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "interview-choice-field";
  if (field.label) {
    const label = document.createElement("div");
    label.className = "interview-choice-label";
    label.textContent = field.label;
    wrapper.appendChild(label);
  }
  const choices = document.createElement("div");
  choices.className = "choice-grid";
  const current = getPath(field.path);
  (field.options || []).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = option.label;
    button.setAttribute("aria-pressed", valuesEqual(current, option.value) ? "true" : "false");
    button.classList.toggle("selected", valuesEqual(current, option.value));
    button.addEventListener("click", () => updateInterviewState(field.path, option.value, { rerender: true }));
    choices.appendChild(button);
  });
  wrapper.appendChild(choices);
  return wrapper;
}

function valuesEqual(first, second) {
  return first === second || String(first) === String(second);
}

function updateInterviewState(path, value, options = {}) {
  setPath(path, value);
  if ((path === "pr.sameAsApplicant" || path.startsWith("applicant.")) && state.pr.sameAsApplicant) {
    syncApplicantToPr();
  }
  if (path === "pr.fullName" && !state.pr.sameAsApplicant && !state.requests.domiciliaryLettersTo) {
    state.requests.domiciliaryLettersTo = value;
    saveState();
  }
  if (path.startsWith("countyDefaults.")) {
    applyCountyDefaults({ force: true });
  } else if (path === "estate.county") {
    syncCountyDefaultsFromCounty();
  }
  if (path === "estate.estimatedGrossValue") {
    state.estate.estimatedNetValue = value;
    state.pathRouter.grossValue = value;
  }
  if (path === "pathRouter.grossValue") {
    state.estate.estimatedGrossValue = value;
    state.estate.estimatedNetValue = value;
  }
  if (path.startsWith("spouse.")) {
    syncSurvivingSpouseFromSpouseHistory();
  }
  if (path === "heirship.children.exists" && value === "yes" && !state.heirship.children.people.some(hasHeirshipChildContent)) {
    state.heirship.children.people = [emptyHeirshipChild()];
  }
  if (path === "will.exists") {
    renderWillBeneficiaries();
    renderInterestedSuggestions();
  }
  if (path === "will.hasNamedBeneficiaries") {
    if (value === "yes" && !state.willBeneficiaries.length) {
      state.willBeneficiaries.push(emptyWillBeneficiary());
    }
    renderWillBeneficiaries();
    renderInterestedSuggestions();
  }
  if (path.startsWith("heirship.children.")) {
    syncHeirshipChildrenList();
    renderHeirshipChildren();
    renderInterestedSuggestions();
  }
  if (path.startsWith("interestedPersons.")) {
    renderInterestedPersons();
  }
  if (path.startsWith("willBeneficiaries.")) {
    renderWillBeneficiaries();
    renderInterestedSuggestions();
  }
  refreshPeopleSuggestionsForPath(path);
  renderFields();
  renderReview();
  if (options.rerender) {
    renderInterview();
  } else {
    renderInterviewStatus();
  }
}

function renderInterviewStatus() {
  const steps = visibleInterviewSteps();
  const index = currentInterviewIndex(steps);
  const current = steps[index];
  const currentPhase = interviewPhaseForStep(current);
  const progress = document.getElementById("interviewProgress");
  const fill = document.getElementById("interviewMeterFill");
  const message = document.getElementById("interviewMessage");
  const back = document.getElementById("interviewBackBtn");
  const next = document.getElementById("interviewNextBtn");
  if (!progress || !current) return;
  const completeCount = steps.filter(isInterviewStepComplete).length;
  fill.style.width = `${Math.round((completeCount / Math.max(steps.length, 1)) * 100)}%`;
  progress.innerHTML = "";
  interviewPhaseGroups(steps).forEach((phase) => {
    const phaseActive = phase.key === currentPhase.key;
    const phaseComplete = phase.completeCount === phase.steps.length;
    const item = document.createElement("li");
    item.className = "phase-progress-item";
    item.classList.toggle("active", phaseActive);
    item.classList.toggle("complete", phaseComplete);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-step";
    button.classList.toggle("active", phaseActive);
    button.classList.toggle("complete", phaseComplete);
    button.innerHTML = `
      <strong>${escapeHtml(phase.label)}</strong>
      <em>${phase.completeCount}/${phase.steps.length}</em>
    `;
    button.addEventListener("click", () => goToInterviewStep(phase.steps[0].id));
    item.appendChild(button);
    if (phaseActive) {
      const detail = document.createElement("div");
      detail.className = "phase-detail";
      detail.innerHTML = `
        <p>${escapeHtml(phase.detail)}</p>
        <div class="phase-step-list">
          ${phase.steps.map((step) => `
            <button type="button" class="phase-step ${step.id === current.id ? "active" : ""} ${isInterviewStepComplete(step) ? "complete" : ""}" data-phase-step="${escapeAttr(step.id)}">
              ${escapeHtml(interviewNavLabels[step.id] || step.title)}
            </button>
          `).join("")}
        </div>
      `;
      detail.querySelectorAll("[data-phase-step]").forEach((stepButton) => {
        stepButton.addEventListener("click", () => goToInterviewStep(stepButton.dataset.phaseStep));
      });
      item.appendChild(detail);
    }
    progress.appendChild(item);
  });
  if (back) back.disabled = index === 0;
  if (next) next.textContent = index >= steps.length - 1 ? "Review answers" : "Next";
  if (message) {
    if (typeof current.statusMessage === "function") {
      message.textContent = current.statusMessage();
    } else {
      const fields = visibleInterviewFields(current);
      const unanswered = fields.filter((field) => field.required !== false && !fieldHasAnswer(field));
      message.textContent = unanswered.length ? "You can continue, but this screen still has an unanswered question." : "";
    }
  }
  renderInterviewSummary();
}

function isInterviewStepComplete(step) {
  if (typeof step.complete === "function") {
    return step.complete();
  }
  const requiredFields = visibleInterviewFields(step).filter((field) => field.required !== false);
  if (!requiredFields.length) return true;
  return requiredFields.every(fieldHasAnswer);
}

function fieldHasAnswer(field) {
  const value = getPath(field.path);
  if (typeof value === "boolean") return true;
  return hasValue(value);
}

function renderInterviewSummary() {
  const summary = document.getElementById("interviewAnswerSummary");
  const pathSummary = document.getElementById("interviewPathSummary");
  if (!summary || !pathSummary) return;
  const rows = [
    ["County", state.estate.county || "Not set"],
    ["Decedent", state.decedent.fullName || "Not set"],
    ["Applicant", state.applicant.fullName || "Not set"],
    ["PR", state.pr.fullName || "Not set"],
    ["Will", willSummaryText()],
    ["Heirship", heirshipSummaryText()],
    ["Addresses", addressContactSummaryText()]
  ];
  summary.innerHTML = rows.map(([label, value]) => `
    <div class="summary-row">
      <span>${escapeHtml(label)}</span>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
  const route = probatePathDecision();
  const opening = openingPathDecision();
  const routeTone = route.tone === "bad" ? "bad" : route.tone === "warn" ? "warn" : "";
  pathSummary.className = `path-card mini ${routeTone}`;
  pathSummary.innerHTML = `
    <h3>${escapeHtml(route.title)}</h3>
    <p>${escapeHtml(route.detail)}</p>
    <p class="helper-text">Opening packet: ${escapeHtml(opening.title)}</p>
  `;
}

function willSummaryText() {
  if (state.will.exists === "yes") return state.will.date ? `Will dated ${state.will.date}` : "Will";
  if (state.will.exists === "no") return "No will";
  if (state.will.exists === "unknown") return "Not sure";
  return "Not set";
}

function heirshipSummaryText() {
  const spouse = state.heirship.spouse.exists === "yes" ? "spouse" : state.heirship.spouse.exists === "no" ? "no spouse" : "spouse not set";
  const children = state.heirship.children.exists === "yes" ? "children" : state.heirship.children.exists === "no" ? "no children" : "children not set";
  return `${spouse}, ${children}`;
}

function probatePathDecision(data = state) {
  const router = data.pathRouter || {};
  const grossValue = numberValue(router.grossValue || data.estate?.estimatedGrossValue || data.estate?.estimatedNetValue);
  const reviewReasons = [];
  const missingAnswers = [];
  const reviewFlags = [
    ["allInterestedKnown", "no", "Not all heirs, beneficiaries, or interested persons are known or locatable."],
    ["allAdultsCapable", "no", "A minor, protected person, or capacity issue may require counsel or special notice handling."],
    ["everyoneAgrees", "no", "A disagreement or missing cooperation may make the DIY path risky."],
    ["creditorDispute", "yes", "Creditor pressure, disputes, or unusual claims may require attorney review."],
    ["formalConcern", "yes", "The user flagged a dispute, objection, litigation, unclear title, or another formal-probate concern."]
  ];
  if (openingPathDecision(data).key === "blocked_no_will") {
    reviewReasons.push("No-will estate without all waivers is flagged for attorney or probate-office review.");
  }
  if (data.will?.exists === "unknown") {
    reviewReasons.push("Will status is unknown.");
  }
  reviewFlags.forEach(([key, triggerValue, reason]) => {
    if (router[key] === triggerValue) {
      reviewReasons.push(reason);
    }
    if (!hasValue(router[key]) || router[key] === "unknown") {
      missingAnswers.push(reason);
    }
  });
  if (!hasValue(router.hasRealEstate) || router.hasRealEstate === "unknown") {
    missingAnswers.push("Real estate status is not confirmed.");
  }
  if (!hasValue(router.publicBenefits) || router.publicBenefits === "unknown") {
    missingAnswers.push("Public-benefits status is not confirmed.");
  }
  if (!grossValue) {
    missingAnswers.push("Estimated probate-property value is needed for the Wisconsin Probate Check.");
  }

  if (reviewReasons.length) {
    return {
      key: "attorney_review",
      tone: "bad",
      title: "Attorney review is recommended.",
      summary: "Your answers show one or more issues that may require legal advice or formal probate. The software can still help organize your information, but it should not be used as a substitute for advice from a Wisconsin probate attorney.",
      detail: reviewReasons[0],
      reasons: reviewReasons,
      productKey: "information_summary"
    };
  }

  if (grossValue && grossValue <= 50000) {
    const reasons = ["Estimated probate property is $50,000 or less."];
    if (router.hasRealEstate === "yes") reasons.push("Real estate may require recording and title follow-up even if the affidavit route fits.");
    if (router.publicBenefits === "yes") reasons.push("Public benefits may require estate-recovery notice or review before transfer.");
    if (missingAnswers.length) reasons.push("Confirm the remaining route answers before relying on this result.");
    return {
      key: "transfer_affidavit",
      tone: missingAnswers.length || router.publicBenefits === "yes" ? "warn" : "ok",
      title: "You may be able to use Wisconsin Transfer by Affidavit.",
      summary: "Based on your answers, the estate may fit Wisconsin's simplified affidavit process. The software can help prepare a Transfer by Affidavit package and checklist for eligible situations.",
      detail: "Before you download, review the information included, missing items, and final price.",
      reasons,
      productKey: "transfer_affidavit"
    };
  }

  if (missingAnswers.length) {
    return {
      key: "unknown",
      tone: "warn",
      title: "More information is needed.",
      summary: "The software needs a few early answers before it can show what Wisconsin probate forms it may be able to prepare.",
      detail: missingAnswers[0],
      reasons: missingAnswers,
      productKey: "informal_probate"
    };
  }

  return {
    key: "informal_probate",
    tone: "ok",
    title: "You may need Wisconsin informal probate forms.",
    summary: "Based on your answers, informal probate may be the right starting process. The software can help prepare the opening packet, waiver or notice documents, and filing checklist for eligible uncontested estates.",
    detail: "Continue the free guided intake. Payment should come only before the final completed packet download.",
    reasons: ["Estimated probate property is over $50,000.", "No early dispute, missing-person, or capacity issue has been flagged."],
    productKey: "informal_probate"
  };
}

function probatePathRouterComplete() {
  const router = state.pathRouter || {};
  return ["grossValue", "hasRealEstate", "allInterestedKnown", "allAdultsCapable", "everyoneAgrees", "publicBenefits", "creditorDispute", "formalConcern"]
    .every((key) => hasValue(router[key]) && router[key] !== "unknown");
}

function probatePathRouterMessage() {
  const decision = probatePathDecision();
  if (!probatePathRouterComplete()) return decision.detail || "Answer the Wisconsin Probate Check questions to improve the result.";
  return decision.summary;
}

function routeResultHtml(decision = probatePathDecision()) {
  const reasonRows = (decision.reasons || []).slice(0, 4).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("");
  return `
    <div class="route-result ${escapeAttr(decision.tone)}">
      <p class="eyebrow">Your Wisconsin probate result</p>
      <h3>${escapeHtml(decision.title)}</h3>
      <p>${escapeHtml(decision.summary)}</p>
      ${reasonRows ? `<ul>${reasonRows}</ul>` : ""}
      ${legalDisclaimerHtml("result")}
    </div>
  `;
}

function productLadderHtml() {
  const route = probatePathDecision();
  const productKeys = ["transfer_affidavit", "informal_probate"];
  if (route.key === "attorney_review") productKeys.push("information_summary");
  if (FEATURE_ATTORNEY_HANDOFF) productKeys.push("attorney_handoff");
  return `
    <div class="product-ladder">
      ${productKeys.map((key) => {
        const info = productInfo(key);
        const active = route.productKey === key;
        return `
          <section class="product-card ${active ? "active" : ""}">
            <span class="badge ${active ? "" : "warn"}">${active ? "Recommended next step" : "Software package"}</span>
            <h4>${escapeHtml(info.title)}</h4>
            <strong>${escapeHtml(info.price)}</strong>
            <p>${escapeHtml(info.free)}</p>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function pathRouterStarted() {
  const router = state.pathRouter || {};
  return ["grossValue", "hasRealEstate", "allInterestedKnown", "allAdultsCapable", "everyoneAgrees", "publicBenefits", "creditorDispute", "formalConcern"].some((key) => hasValue(router[key]));
}

function probateStartHeroHtml() {
  return `
    <div class="probate-start-hero">
      <div>
        <p class="eyebrow">Wisconsin probate starter</p>
        <h3>Start free. Answer a few questions. Build the right packet.</h3>
        <p>The interview will help decide whether this looks like Transfer by Affidavit, informal probate, or a case that should be reviewed before documents are filed.</p>
      </div>
      <div class="start-hero-steps">
        <span><strong>1</strong> Answer starter questions</span>
        <span><strong>2</strong> Complete the guided intake</span>
        <span><strong>3</strong> Unlock, print, sign, and file</span>
      </div>
      <p class="helper-text">${escapeHtml(LEGAL_DISCLAIMER_SHORT)}</p>
    </div>
  `;
}

function renderProbatePathRouter() {
  const decision = probatePathDecision();
  const started = pathRouterStarted();
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat path-router-screen";
  wrapper.innerHTML = `
    ${probateStartHeroHtml()}
    ${started ? routeResultHtml(decision) : ""}
    <div class="guided-person-card">
      <h3>About how much probate property is involved?</h3>
      <p>Use a rough gross value for assets that would need probate transfer. This can be corrected later.</p>
      <label class="interview-label">Estimated probate property value
        <input data-guided-path="pathRouter.grossValue" value="${escapeAttr(state.pathRouter.grossValue || state.estate.estimatedGrossValue)}" inputmode="decimal" placeholder="85000" />
      </label>
    </div>
    <div class="route-question">
      <h3>Does the probate property include Wisconsin real estate?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.hasRealEstate", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.hasRealEstate", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.hasRealEstate", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Are all likely heirs, beneficiaries, and interested persons known and locatable?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.allInterestedKnown", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.allInterestedKnown", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.allInterestedKnown", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Are the people involved adults who can act for themselves?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.allAdultsCapable", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.allAdultsCapable", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.allAdultsCapable", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Is everyone likely to cooperate?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.everyoneAgrees", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.everyoneAgrees", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.everyoneAgrees", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Did the decedent receive Medicaid, Family Care, or similar public benefits?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.publicBenefits", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.publicBenefits", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.publicBenefits", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Are there creditor disputes, objections, unclear title issues, or litigation concerns?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.creditorDispute", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.creditorDispute", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.creditorDispute", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Do you already think a judge or attorney may need to review this?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("pathRouter.formalConcern", "no", "No")}
        ${guidedChoiceButtonHtml("pathRouter.formalConcern", "yes", "Yes")}
        ${guidedChoiceButtonHtml("pathRouter.formalConcern", "unknown", "Not sure")}
      </div>
    </div>
    <label class="interview-label">Route notes
      <textarea rows="3" data-guided-path="pathRouter.notes" placeholder="Anything unusual about the estate, family, property, or creditor situation">${escapeHtml(state.pathRouter.notes)}</textarea>
    </label>
    ${started ? productLadderHtml() : ""}
    <div class="guided-note">
      <p>This starts the probate intake. The detailed interview still checks waivers, PR-1805 notice, missing information, and attorney-review warnings before any final packet is downloaded.</p>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  bindGuidedChoiceButtons(wrapper);
  return wrapper;
}

function transferAffidavitAssets() {
  if (!state.transferAffidavit.assets?.length) state.transferAffidavit.assets = [emptyTransferAsset()];
  return state.transferAffidavit.assets;
}

function transferAssetHasContent(asset = {}) {
  return [asset.type, asset.holder, asset.description, asset.value, asset.accountOrIdentifier, asset.releaseInstructions, asset.notes].some(hasValue);
}

function transferAffidavitGrossValue(data = state) {
  const assetTotal = (data.transferAffidavit?.assets || [])
    .filter(transferAssetHasContent)
    .reduce((sum, asset) => sum + numberValue(asset.value), 0);
  return assetTotal || numberValue(data.transferAffidavit?.grossValueConfirmed || data.pathRouter?.grossValue || data.estate?.estimatedGrossValue);
}

function daysSinceDeath(data = state) {
  const raw = cleanText(data.decedent?.dateOfDeath);
  if (!raw) return null;
  const death = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(death.getTime())) return null;
  const today = new Date();
  const start = new Date(death.getFullYear(), death.getMonth(), death.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((end - start) / 86400000);
}

function transferAffidavitReadiness(data = state) {
  const tba = data.transferAffidavit || {};
  const blockers = [];
  const warnings = [];
  const gross = transferAffidavitGrossValue(data);
  const elapsed = daysSinceDeath(data);
  if (!hasValue(data.decedent?.fullName)) blockers.push("Transfer by Affidavit package needs the decedent name.");
  if (!hasValue(data.decedent?.dateOfDeath)) blockers.push("Transfer by Affidavit package needs the date of death.");
  if (elapsed !== null && elapsed < 30 && tba.daysSinceDeathConfirmed !== "yes") {
    blockers.push("Confirm that the waiting period after death is satisfied before relying on the affidavit path.");
  }
  if (!hasValue(tba.daysSinceDeathConfirmed)) blockers.push("Confirm the waiting-period question.");
  if (tba.daysSinceDeathConfirmed === "no") blockers.push("Transfer by Affidavit should wait until the statutory waiting period is satisfied.");
  if (!hasValue(tba.noPendingProbate)) blockers.push("Confirm whether a probate proceeding is already pending.");
  if (tba.noPendingProbate === "no") blockers.push("A pending probate proceeding should be reviewed before using the affidavit path.");
  if (!gross) blockers.push("Enter the gross Wisconsin property value for the affidavit path.");
  if (gross > 50000) blockers.push("Transfer by Affidavit is only being offered here for gross Wisconsin property of $50,000 or less.");
  if (!hasValue(transferAffidavitAffiantName(data))) blockers.push("Add the affiant name.");
  if (!hasValue(transferAffidavitAffiantAddress(data))) blockers.push("Add the affiant mailing address.");
  if (!hasValue(tba.affiantRelationship)) blockers.push("Add the affiant relationship or basis for claiming property.");
  if (!hasValue(tba.affiantCapacity)) blockers.push("Choose the affiant capacity from the official form options.");
  if (tba.affiantCapacity === "named_pr" && tba.realEstateIncluded === "yes") blockers.push("A person signing only as nominated personal representative may not use the affidavit to transfer real estate.");
  const assets = (tba.assets || []).filter(transferAssetHasContent);
  if (!assets.length) blockers.push("Add at least one asset or holder for the affidavit package.");
  assets.forEach((asset, index) => {
    if (!hasValue(asset.description)) blockers.push(`Transfer asset ${index + 1} needs a description.`);
    if (!hasValue(asset.value)) blockers.push(`Transfer asset ${index + 1} needs an estimated value.`);
  });
  if (!hasValue(tba.entitledPersonsKnown)) blockers.push("Confirm whether all entitled persons are known.");
  if (tba.entitledPersonsKnown === "no") warnings.push("Unknown or disputed successors should be attorney-reviewed before using the affidavit path.");
  if (tba.realEstateIncluded === "yes") {
    warnings.push("Real estate transfer may require recording, legal-description, tax, and title review.");
    if (tba.realEstateHeirNoticeComplete !== "yes") blockers.push("Real estate transfers require heir notice at least 30 days before recording or waivers from heirs.");
  }
  if (tba.vehicleIncluded === "yes") warnings.push("Vehicle transfer may require DMV-specific title steps in addition to the affidavit package.");
  if (data.pathRouter?.publicBenefits === "yes" || tba.publicBenefitsFollowup === "yes") {
    warnings.push("Public-benefits or estate-recovery issues should be reviewed before transfer.");
    if (tba.estateRecoveryNoticeSent !== "yes") blockers.push("If listed public benefits were received, send required notice to the Wisconsin Estate Recovery Program before transfer.");
  }
  if (tba.creditorConcern === "yes") warnings.push("Known creditor disputes or unpaid claims should be reviewed before property is transferred.");
  return { blockers, warnings, gross, elapsed, assets };
}

function validateTransferAffidavit(data = state) {
  const readiness = transferAffidavitReadiness(data);
  return { blockers: readiness.blockers, warnings: readiness.warnings };
}

function transferAffidavitStatusMessage() {
  const readiness = transferAffidavitReadiness();
  return readiness.blockers[0] || readiness.warnings[0] || "Transfer by Affidavit package can be exported after the product unlock.";
}

function transferAffidavitAffiantName(data = state) {
  return cleanText(data.transferAffidavit?.affiantName) || cleanText(data.applicant?.fullName);
}

function transferAffidavitAffiantAddress(data = state) {
  return cleanText(data.transferAffidavit?.affiantAddress) || cleanText(data.applicant?.address);
}

function transferAffidavitReadinessHtml(readiness = transferAffidavitReadiness()) {
  const stats = [
    [`$${currencyText(readiness.gross)}`, "gross affidavit property"],
    [readiness.elapsed === null ? "Not set" : String(readiness.elapsed), "days since death"],
    [String(readiness.assets.length), "assets/holders"]
  ];
  return `
    <div class="readiness-dashboard transfer-dashboard">
      ${stats.map(([value, label]) => `
        <div class="readiness-stat ${readiness.blockers.length ? "warn" : ""}">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("")}
    </div>
    ${readiness.blockers.length ? readinessIssueListHtml("Before using the affidavit package", readiness.blockers, "", "blockers") : ""}
    ${readiness.warnings.length ? readinessIssueListHtml("Review notes", readiness.warnings, "warn", "reviewWarnings") : ""}
  `;
}

function transferAssetTypeOptions(value = "") {
  const options = ["", "Bank account", "Vehicle", "Real estate", "Refund/check", "Personal property", "Investment account", "Other"];
  return options.map((option) => `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option || "Select")}</option>`).join("");
}

function affiantCapacityOptions(value = "") {
  const options = [
    ["heir", "Heir"],
    ["trustee", "Trustee of decedent's revocable trust"],
    ["guardian", "Guardian at time of death"],
    ["named_pr", "Person named in will as PR"]
  ];
  return options.map(([optionValue, label]) => `<option value="${escapeAttr(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
}

function transferAssetCardHtml(asset, index) {
  return `
    <section class="guided-person-card repeated-card">
      <div class="repeat-card-header">
        <div class="repeat-card-title">
          <span class="card-number-badge">Asset ${index + 1}</span>
          <h3>${escapeHtml(asset.description || asset.holder || `Transfer asset ${index + 1}`)}</h3>
          <span class="repeat-card-subtitle">${escapeHtml(asset.type || "Asset type needed")}</span>
        </div>
        <button type="button" class="ghost danger-button" data-remove-transfer-asset="${index}">Remove</button>
      </div>
      <div class="repeat-card-body grid two compact">
        <label>Asset type
          <select data-guided-path="transferAffidavit.assets.${index}.type">${transferAssetTypeOptions(asset.type)}</select>
        </label>
        <label>Holder or agency
          <input data-guided-path="transferAffidavit.assets.${index}.holder" value="${escapeAttr(asset.holder)}" placeholder="Bank, DMV, county register, employer" />
        </label>
        <label>Description
          <input data-guided-path="transferAffidavit.assets.${index}.description" value="${escapeAttr(asset.description)}" placeholder="Checking account ending 1234, 2018 Ford F-150, etc." />
        </label>
        <label>Estimated value
          <input data-guided-path="transferAffidavit.assets.${index}.value" value="${escapeAttr(asset.value)}" inputmode="decimal" placeholder="0.00" />
        </label>
        <label>Account, VIN, parcel, or identifier
          <input data-guided-path="transferAffidavit.assets.${index}.accountOrIdentifier" value="${escapeAttr(asset.accountOrIdentifier)}" />
        </label>
        <label>Release/transfer instructions
          <input data-guided-path="transferAffidavit.assets.${index}.releaseInstructions" value="${escapeAttr(asset.releaseInstructions)}" placeholder="Pay to affiant, retitle vehicle, release funds" />
        </label>
        <label class="full-span">Notes
          <input data-guided-path="transferAffidavit.assets.${index}.notes" value="${escapeAttr(asset.notes)}" />
        </label>
      </div>
    </section>
  `;
}

function addTransferAsset() {
  state.transferAffidavit.assets.push(emptyTransferAsset());
  saveState();
  renderInterview();
  renderReview();
}

function removeTransferAsset(index) {
  state.transferAffidavit.assets.splice(index, 1);
  if (!state.transferAffidavit.assets.length) state.transferAffidavit.assets.push(emptyTransferAsset());
  saveState();
  renderInterview();
  renderReview();
}

function renderTransferAffidavitInterview() {
  const readiness = transferAffidavitReadiness();
  transferAffidavitAssets();
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat transfer-affidavit-screen";
  wrapper.innerHTML = `
    ${routeResultHtml(probatePathDecision())}
    ${transferAffidavitReadinessHtml(readiness)}
    <div class="handoff-card ${readiness.blockers.length ? "warn" : "ready"}">
      <p class="eyebrow">Transfer by Affidavit MVP</p>
      <h3>${readiness.blockers.length ? "Finish the affidavit facts before export" : "Affidavit package is ready for prototype export"}</h3>
      <p>This MVP creates a draft affidavit worksheet, asset release checklist, and case summary. Replace this with the official Wisconsin PR-1831 template before production filing.</p>
      <div class="handoff-actions">
        <button type="button" class="primary" data-export-transfer-affidavit ${readiness.blockers.length ? "disabled" : ""}>Download Transfer by Affidavit package</button>
        <button type="button" class="secondary" data-continue-informal-probate>Continue to informal probate instead</button>
      </div>
      <div id="guidedDownloadArea" class="download-area"></div>
    </div>
    ${paymentGateHtml("transfer", "transfer_affidavit")}
    <div class="guided-person-card">
      <h3>Affiant</h3>
      <p>The affiant is the person asking the holder to transfer the decedent's property.</p>
      <div class="grid two compact">
        <label>
          <input type="checkbox" data-guided-path="transferAffidavit.isAmended" ${state.transferAffidavit.isAmended ? "checked" : ""} />
          Amended affidavit
        </label>
        <label>Prior recorded document number
          <input data-guided-path="transferAffidavit.amendedDocumentNumber" value="${escapeAttr(state.transferAffidavit.amendedDocumentNumber)}" />
        </label>
        <label>Name
          <input data-guided-path="transferAffidavit.affiantName" value="${escapeAttr(transferAffidavitAffiantName())}" />
        </label>
        <label>Mailing address
          <input data-guided-path="transferAffidavit.affiantAddress" value="${escapeAttr(transferAffidavitAffiantAddress())}" />
        </label>
        <label>Email
          <input type="email" data-guided-path="transferAffidavit.affiantEmail" value="${escapeAttr(state.transferAffidavit.affiantEmail || state.applicant.email)}" />
        </label>
        <label>Phone
          <input type="tel" data-guided-path="transferAffidavit.affiantPhone" value="${escapeAttr(state.transferAffidavit.affiantPhone || state.applicant.phone)}" />
        </label>
        <label>Relationship / basis
          <input data-guided-path="transferAffidavit.affiantRelationship" value="${escapeAttr(state.transferAffidavit.affiantRelationship)}" placeholder="Surviving spouse, heir, beneficiary, trustee, PR nominee" />
        </label>
        <label>Official capacity
          <select data-guided-path="transferAffidavit.affiantCapacity">${affiantCapacityOptions(state.transferAffidavit.affiantCapacity)}</select>
        </label>
        <label>Who should receive the transferred property?
          <input data-guided-path="transferAffidavit.documentRecipient" value="${escapeAttr(state.transferAffidavit.documentRecipient || transferAffidavitAffiantName())}" />
        </label>
        <label>Drafted by
          <input data-guided-path="transferAffidavit.draftedBy" value="${escapeAttr(state.transferAffidavit.draftedBy || state.preparer.fullName || state.applicant.fullName)}" />
        </label>
      </div>
    </div>
    <div class="route-question">
      <h3>Is the affidavit waiting period satisfied?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("transferAffidavit.daysSinceDeathConfirmed", "yes", "Yes")}
        ${guidedChoiceButtonHtml("transferAffidavit.daysSinceDeathConfirmed", "no", "No")}
        ${guidedChoiceButtonHtml("transferAffidavit.daysSinceDeathConfirmed", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Is there already a probate proceeding pending?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("transferAffidavit.noPendingProbate", "yes", "No pending probate")}
        ${guidedChoiceButtonHtml("transferAffidavit.noPendingProbate", "no", "Yes, something is pending")}
        ${guidedChoiceButtonHtml("transferAffidavit.noPendingProbate", "unknown", "Not sure")}
      </div>
    </div>
    <div class="route-question">
      <h3>Are all people entitled to the property known?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("transferAffidavit.entitledPersonsKnown", "yes", "Yes")}
        ${guidedChoiceButtonHtml("transferAffidavit.entitledPersonsKnown", "no", "No")}
        ${guidedChoiceButtonHtml("transferAffidavit.entitledPersonsKnown", "unknown", "Not sure")}
      </div>
      <label class="interview-label">Entitled persons summary
        <textarea rows="3" data-guided-path="transferAffidavit.entitledPersonsSummary" placeholder="List heirs, beneficiaries, surviving spouse, or others who may be entitled">${escapeHtml(state.transferAffidavit.entitledPersonsSummary)}</textarea>
      </label>
      <label class="interview-label">Spouse / domestic partner summary
        <textarea rows="2" data-guided-path="transferAffidavit.spouseSummary" placeholder="Name, living/deceased, married/divorced at death, or lack of information">${escapeHtml(state.transferAffidavit.spouseSummary || state.spouse.fullName || state.heirship.spouse.name)}</textarea>
      </label>
    </div>
    <div class="route-question">
      <h3>Does the package include real estate, a vehicle, public-benefits follow-up, or creditor concerns?</h3>
      <div class="grid two compact">
        <label>Real estate included?
          <select data-guided-path="transferAffidavit.realEstateIncluded">
            <option value="">Select</option>
            <option value="no" ${state.transferAffidavit.realEstateIncluded === "no" ? "selected" : ""}>No</option>
            <option value="yes" ${state.transferAffidavit.realEstateIncluded === "yes" ? "selected" : ""}>Yes</option>
          </select>
        </label>
        <label>Vehicle included?
          <select data-guided-path="transferAffidavit.vehicleIncluded">
            <option value="">Select</option>
            <option value="no" ${state.transferAffidavit.vehicleIncluded === "no" ? "selected" : ""}>No</option>
            <option value="yes" ${state.transferAffidavit.vehicleIncluded === "yes" ? "selected" : ""}>Yes</option>
          </select>
        </label>
        <label>Public-benefits follow-up?
          <select data-guided-path="transferAffidavit.publicBenefitsFollowup">
            <option value="">Select</option>
            <option value="no" ${state.transferAffidavit.publicBenefitsFollowup === "no" ? "selected" : ""}>No / not known</option>
            <option value="yes" ${state.transferAffidavit.publicBenefitsFollowup === "yes" ? "selected" : ""}>Yes</option>
          </select>
        </label>
        <label>Estate Recovery notice sent?
          <select data-guided-path="transferAffidavit.estateRecoveryNoticeSent">
            <option value="">Select</option>
            <option value="not_needed" ${state.transferAffidavit.estateRecoveryNoticeSent === "not_needed" ? "selected" : ""}>Not needed</option>
            <option value="yes" ${state.transferAffidavit.estateRecoveryNoticeSent === "yes" ? "selected" : ""}>Yes</option>
            <option value="no" ${state.transferAffidavit.estateRecoveryNoticeSent === "no" ? "selected" : ""}>No</option>
          </select>
        </label>
        <label>Real estate heir notice / waivers complete?
          <select data-guided-path="transferAffidavit.realEstateHeirNoticeComplete">
            <option value="">Select</option>
            <option value="not_needed" ${state.transferAffidavit.realEstateHeirNoticeComplete === "not_needed" ? "selected" : ""}>Not needed</option>
            <option value="yes" ${state.transferAffidavit.realEstateHeirNoticeComplete === "yes" ? "selected" : ""}>Yes</option>
            <option value="no" ${state.transferAffidavit.realEstateHeirNoticeComplete === "no" ? "selected" : ""}>No</option>
          </select>
        </label>
        <label>Creditor concern?
          <select data-guided-path="transferAffidavit.creditorConcern">
            <option value="">Select</option>
            <option value="no" ${state.transferAffidavit.creditorConcern === "no" ? "selected" : ""}>No / not known</option>
            <option value="yes" ${state.transferAffidavit.creditorConcern === "yes" ? "selected" : ""}>Yes</option>
          </select>
        </label>
      </div>
    </div>
    <div class="guided-card-list">
      ${state.transferAffidavit.assets.map(transferAssetCardHtml).join("")}
    </div>
    <div class="list-bottom-actions">
      <button type="button" class="secondary" data-add-transfer-asset>Add asset / holder</button>
    </div>
    <label class="interview-label">Affidavit package notes
      <textarea rows="3" data-guided-path="transferAffidavit.notes" placeholder="Holder requirements, title issues, contact notes, or county recording questions">${escapeHtml(state.transferAffidavit.notes)}</textarea>
    </label>
    <div class="guided-note warn">
      <p>Production task: add and map the official Wisconsin PR-1831 Transfer by Affidavit form. This MVP package is for workflow and product testing.</p>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  bindGuidedChoiceButtons(wrapper);
  bindPaymentGate(wrapper);
  bindReadinessIssueButtons(wrapper, readiness);
  wrapper.querySelector("[data-export-transfer-affidavit]")?.addEventListener("click", (event) => exportTransferAffidavitPackage(event));
  wrapper.querySelector("[data-continue-informal-probate]")?.addEventListener("click", () => goToInterviewStep("county"));
  wrapper.querySelector("[data-add-transfer-asset]")?.addEventListener("click", addTransferAsset);
  wrapper.querySelectorAll("[data-remove-transfer-asset]").forEach((button) => {
    button.addEventListener("click", () => removeTransferAsset(Number(button.dataset.removeTransferAsset)));
  });
  return wrapper;
}

function benefitsNeedExplanation() {
  return [
    state.benefits.medicalAssistance,
    state.benefits.familyCare,
    state.benefits.communityOptions,
    state.benefits.chronicDisease
  ].includes("did") || state.benefits.institution === "was" || state.benefits.lackInfo;
}

function guidedBenefitsComplete() {
  const required = [
    state.benefits.medicalAssistance,
    state.benefits.familyCare,
    state.benefits.communityOptions,
    state.benefits.chronicDisease,
    state.benefits.institution
  ];
  if (state.benefits.lackInfo) return hasValue(state.benefits.explanation);
  if (required.some((value) => !hasValue(value))) return false;
  return !benefitsNeedExplanation() || hasValue(state.benefits.explanation);
}

function guidedBenefitsMessage() {
  if (state.benefits.lackInfo && !hasValue(state.benefits.explanation)) return "Briefly explain what information is missing.";
  const missing = [
    state.benefits.medicalAssistance,
    state.benefits.familyCare,
    state.benefits.communityOptions,
    state.benefits.chronicDisease,
    state.benefits.institution
  ].filter((value) => !hasValue(value)).length;
  if (missing && !state.benefits.lackInfo) return "Answer each public-benefits question, or mark that you lack information.";
  if (benefitsNeedExplanation() && !hasValue(state.benefits.explanation)) return "Add the explanation needed for PR-1801 question 5.";
  return "";
}

function benefitChoiceHtml(path, value, label, detail = "") {
  return guidedChoiceButtonHtml(path, value, label, detail);
}

function renderGuidedBenefits() {
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Public benefits received by the decedent</h3>
      <p>Answer these for PR-1801 question 5. If you do not know yet, mark that you lack information and add a short note.</p>
    </div>
    <div class="benefit-question">
      <h3>Medical Assistance or Medicaid</h3>
      <div class="choice-grid">
        ${benefitChoiceHtml("benefits.medicalAssistance", "did", "Did receive")}
        ${benefitChoiceHtml("benefits.medicalAssistance", "did_not", "Did not receive")}
      </div>
    </div>
    <div class="benefit-question">
      <h3>Family Care or Partnership</h3>
      <div class="choice-grid">
        ${benefitChoiceHtml("benefits.familyCare", "did", "Did receive")}
        ${benefitChoiceHtml("benefits.familyCare", "did_not", "Did not receive")}
      </div>
    </div>
    <div class="benefit-question">
      <h3>Community Options Program</h3>
      <div class="choice-grid">
        ${benefitChoiceHtml("benefits.communityOptions", "did", "Did receive")}
        ${benefitChoiceHtml("benefits.communityOptions", "did_not", "Did not receive")}
      </div>
    </div>
    <div class="benefit-question">
      <h3>Wisconsin Chronic Disease Program</h3>
      <div class="choice-grid">
        ${benefitChoiceHtml("benefits.chronicDisease", "did", "Did receive")}
        ${benefitChoiceHtml("benefits.chronicDisease", "did_not", "Did not receive")}
      </div>
    </div>
    <div class="benefit-question">
      <h3>State or county institution</h3>
      <div class="choice-grid">
        ${benefitChoiceHtml("benefits.institution", "was", "Was a patient or inmate")}
        ${benefitChoiceHtml("benefits.institution", "was_not", "Was not a patient or inmate")}
      </div>
    </div>
    <label class="checkline">
      <input type="checkbox" data-guided-path="benefits.lackInfo" ${state.benefits.lackInfo ? "checked" : ""} />
      I lack information to complete this section
    </label>
    ${benefitsNeedExplanation() ? `
      <label class="interview-label">Explanation
        <input data-guided-path="benefits.explanation" value="${escapeAttr(state.benefits.explanation)}" placeholder="Benefit received, institution, or information missing" />
      </label>
    ` : ""}
  `;
  bindGuidedChoiceButtons(wrapper);
  bindGuidedPathInputs(wrapper);
  return wrapper;
}

function guidedSpouseHistoryComplete() {
  if (state.spouse.everMarried === "no") return true;
  if (state.spouse.everMarried !== "yes") return false;
  return [
    state.spouse.fullName || state.heirship.spouse.name,
    state.spouse.livingStatus,
    state.spouse.statusAtDeath
  ].every(hasValue);
}

function guidedSpouseHistoryMessage() {
  if (!hasValue(state.spouse.everMarried)) return "Answer whether the decedent was ever married or in a domestic partnership.";
  if (state.spouse.everMarried === "no") return "";
  if (!hasValue(state.spouse.fullName || state.heirship.spouse.name)) return "Enter the spouse or domestic partner name.";
  if (!hasValue(state.spouse.livingStatus)) return "Answer whether the spouse or domestic partner is living or deceased.";
  if (!hasValue(state.spouse.statusAtDeath)) return "Answer whether they were married/domestic partners at death or divorced/terminated before death.";
  return "";
}

function survivingSpouseDerivedText() {
  if (state.spouse.everMarried === "no") return "No spouse/domestic partner history entered for PR-1801, and PR-1806 will mark no surviving spouse/domestic partner.";
  if (state.spouse.everMarried !== "yes") return "Answer the first question to determine the spouse/domestic partner fields.";
  if (!hasValue(state.spouse.livingStatus) || !hasValue(state.spouse.statusAtDeath)) return "Answer living status and status at death so the app can decide whether PR-1806 has a surviving spouse/domestic partner.";
  return state.heirship.spouse.exists === "yes"
    ? "PR-1806 will mark that the decedent was survived by a spouse/domestic partner."
    : "PR-1806 will mark no surviving spouse/domestic partner because the spouse/domestic partner was deceased or the relationship ended before death.";
}

function renderGuidedSpouseHistory() {
  syncGuidedSpouseName();
  syncSurvivingSpouseFromSpouseHistory(state, { persist: false });
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Spouse or domestic partner history</h3>
      <p>Use this for PR-1801 section 6. The app will also derive the PR-1806 surviving-spouse answer from these facts.</p>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("spouse.everMarried", "yes", "Yes", "The decedent was married or in a domestic partnership at some point.")}
        ${guidedChoiceButtonHtml("spouse.everMarried", "no", "No", "Skip spouse/domestic partner benefit questions.")}
      </div>
    </div>
    ${state.spouse.everMarried === "yes" ? `
      <div class="guided-person-card">
        <div class="grid two compact">
          <label>Name
            <input data-guided-path="spouse.fullName" value="${escapeAttr(state.spouse.fullName || state.heirship.spouse.name)}" />
          </label>
          <label>Living status
            <select data-guided-path="spouse.livingStatus">
              <option value="">Select</option>
              <option value="living" ${state.spouse.livingStatus === "living" ? "selected" : ""}>Living</option>
              <option value="deceased" ${state.spouse.livingStatus === "deceased" ? "selected" : ""}>Deceased</option>
            </select>
          </label>
          <label>Status at death
            <select data-guided-path="spouse.statusAtDeath">
              <option value="">Select</option>
              <option value="married" ${state.spouse.statusAtDeath === "married" ? "selected" : ""}>Married/domestic partner at death</option>
              <option value="divorced" ${state.spouse.statusAtDeath === "divorced" ? "selected" : ""}>Divorced/terminated before death</option>
            </select>
          </label>
        </div>
        <div class="guided-note">
          <p>${escapeHtml(survivingSpouseDerivedText())}</p>
        </div>
      </div>
    ` : ""}
  `;
  bindGuidedChoiceButtons(wrapper);
  bindGuidedPathInputs(wrapper);
  return wrapper;
}

function syncGuidedSpouseName() {
  if (!hasValue(state.spouse.fullName) && hasValue(state.heirship.spouse.name)) {
    state.spouse.fullName = state.heirship.spouse.name;
    saveState();
  }
  if (!hasValue(state.heirship.spouse.name) && hasValue(state.spouse.fullName)) {
    state.heirship.spouse.name = state.spouse.fullName;
    saveState();
  }
}

function guidedSpouseBenefitsComplete() {
  if (state.spouse.everMarried !== "yes") return true;
  if (state.spouse.lackInfo || state.spouse.seeAttached) return hasValue(state.spouse.fullName) || hasValue(state.heirship.spouse.name);
  return [
    state.spouse.fullName || state.heirship.spouse.name,
    state.spouse.communityOptions,
    state.spouse.chronicDisease
  ].every(hasValue);
}

function guidedSpouseBenefitsMessage() {
  if (state.spouse.everMarried !== "yes") return "";
  if (!hasValue(state.spouse.fullName || state.heirship.spouse.name)) return "Enter the spouse or domestic partner name.";
  if (state.spouse.lackInfo || state.spouse.seeAttached) return "";
  const missing = [
    state.spouse.communityOptions,
    state.spouse.chronicDisease
  ].filter((value) => !hasValue(value)).length;
  return missing ? "Answer the spouse/domestic partner benefit questions, or mark lack of information/see attached." : "";
}

function renderGuidedSpouseBenefits() {
  syncGuidedSpouseName();
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Spouse or domestic partner details for PR-1801</h3>
      <p>These benefit answers complete the spouse/domestic partner portion of PR-1801 section 6. If the information is incomplete, mark lack of information or see attached.</p>
      <div class="summary">
        <div class="summary-row"><span>Name</span><span>${escapeHtml(state.spouse.fullName || state.heirship.spouse.name || "Not set")}</span></div>
        <div class="summary-row"><span>Living status</span><span>${escapeHtml(state.spouse.livingStatus || "Not set")}</span></div>
        <div class="summary-row"><span>Status at death</span><span>${escapeHtml(state.spouse.statusAtDeath || "Not set")}</span></div>
      </div>
      <div class="grid two compact">
        <label>Community Options Program
          <select data-guided-path="spouse.communityOptions">
            <option value="">Select</option>
            <option value="did" ${state.spouse.communityOptions === "did" ? "selected" : ""}>Did receive</option>
            <option value="did_not" ${state.spouse.communityOptions === "did_not" ? "selected" : ""}>Did not receive</option>
          </select>
        </label>
        <label>Wisconsin Chronic Disease Program
          <select data-guided-path="spouse.chronicDisease">
            <option value="">Select</option>
            <option value="did" ${state.spouse.chronicDisease === "did" ? "selected" : ""}>Did receive</option>
            <option value="did_not" ${state.spouse.chronicDisease === "did_not" ? "selected" : ""}>Did not receive</option>
          </select>
        </label>
      </div>
      <div class="inline-checks compact-checks">
        <label class="checkline">
          <input type="checkbox" data-guided-path="spouse.seeAttached" ${state.spouse.seeAttached ? "checked" : ""} />
          See attached
        </label>
        <label class="checkline">
          <input type="checkbox" data-guided-path="spouse.lackInfo" ${state.spouse.lackInfo ? "checked" : ""} />
          I lack information
        </label>
      </div>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  return wrapper;
}

function existingParties() {
  const parties = [];
  addExistingParty(parties, {
    name: state.applicant.fullName,
    address: state.applicant.address,
    email: state.applicant.email,
    phone: state.applicant.phone,
    relationship: state.applicant.capacity || "Applicant",
    source: "Applicant"
  }, { allowSelectableName: true });
  addExistingParty(parties, {
    name: state.pr.fullName,
    address: state.pr.address,
    email: state.pr.email,
    phone: state.pr.phone,
    relationship: relationshipText(["Proposed Personal Representative", sameName(state.pr.fullName, state.will.namedPr) ? "Named PR in will" : ""]),
    source: "Personal Representative"
  }, { allowSelectableName: true });
  addExistingParty(parties, {
    name: state.pr.residentAgent.name,
    address: state.pr.residentAgent.address,
    email: state.pr.residentAgent.email,
    phone: state.pr.residentAgent.phone,
    relationship: "Resident agent",
    source: "Personal Representative"
  }, { allowSelectableName: true });
  addExistingParty(parties, {
    name: state.heirship.informant.name,
    address: state.heirship.informant.address,
    relationship: state.heirship.informant.relationship || "Heirship informant",
    source: "Heirship"
  }, { allowSelectableName: true });
  addExistingParty(parties, {
    name: state.heirship.spouse.name,
    address: sameName(state.heirship.spouse.name, state.applicant.fullName) ? state.applicant.address : "",
    relationship: "Surviving spouse/domestic partner",
    source: "Heirship"
  }, { allowSelectableName: true });
  const structuredChildren = state.heirship.children.exists === "yes"
    ? state.heirship.children.people.filter(hasHeirshipChildContent)
    : [];
  structuredChildren.forEach((child) => {
    const normalized = normalizeHeirshipChild(child);
    addExistingParty(parties, {
      name: normalized.name,
      address: normalized.address || (sameName(normalized.name, state.applicant.fullName) ? state.applicant.address : ""),
      relationship: relationshipText([
        "Child/descendant",
        normalized.livingStatus === "deceased" ? "deceased" : "",
        normalized.notes
      ]),
      minorDateOfBirth: normalized.minorDateOfBirth,
      source: "Heirship"
    });
  });
  if (state.heirship.children.exists === "yes" && !structuredChildren.length) {
    splitInterestedNames(state.heirship.children.list).forEach((name) => addExistingParty(parties, {
      name,
      address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
      relationship: "Child/descendant",
      source: "Heirship"
    }));
  }
  splitInterestedNames(state.heirship.parents.names).forEach((name) => addExistingParty(parties, {
    name,
    address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
    relationship: "Parent",
    source: "Heirship"
  }));
  splitInterestedNames(state.heirship.siblings.names).forEach((name) => addExistingParty(parties, {
    name,
    address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
    relationship: "Sibling",
    source: "Heirship"
  }));
  if (state.will.exists === "yes") {
    addExistingParty(parties, {
      name: state.will.namedPr,
      address: sameName(state.will.namedPr, state.pr.fullName) ? state.pr.address : "",
      relationship: "Named Personal Representative",
      source: "Will"
    });
    addExistingParty(parties, {
      name: state.will.namedTrustee,
      relationship: "Trustee named in will",
      source: "Will"
    });
    addExistingParty(parties, {
      name: state.will.nominatedTrustee,
      relationship: "Nominated trustee",
      source: "Will"
    });
    if (state.will.hasNamedBeneficiaries === "yes") {
      state.willBeneficiaries.forEach((person) => addExistingParty(parties, {
        name: person.name,
        address: person.address,
        relationship: relationshipText([beneficiaryRoleLabel(person.role), person.relationship]),
        minorDateOfBirth: person.minorDateOfBirth,
        source: "Will beneficiaries"
      }));
    }
  }
  state.interestedPersons.forEach((person) => addExistingParty(parties, {
    name: person.name,
    address: person.address,
    email: person.email,
    phone: person.phone,
    relationship: interestedRelationship(person),
    minorDateOfBirth: person.minorDateOfBirth,
    roles: normalizeInterestedPerson(person).roles,
    source: "Interested persons"
  }));
  return parties;
}

function masterPeopleRoster() {
  const suggestions = interestedPersonSuggestions();
  return existingParties().map((party) => {
    const matchingSuggestion = suggestions.find((suggestion) => sameName(suggestion.name, party.name));
    const interestedIndex = existingInterestedPersonIndex(party.name);
    const suggestionLike = matchingSuggestion || {
      name: party.name,
      relationship: party.relationship,
      address: party.address,
      minorDateOfBirth: party.minorDateOfBirth,
      source: party.source
    };
    const reasons = interestedPersonSourceReasons({
      name: party.name,
      relationship: party.relationship,
      address: party.address,
      minorDateOfBirth: party.minorDateOfBirth,
      roles: party.roles || {}
    }, matchingSuggestion ? [matchingSuggestion] : []);
    return {
      ...party,
      suggestion: suggestionLike,
      suggestedInterestedPerson: Boolean(matchingSuggestion),
      interestedIndex,
      missingAddress: !hasValue(party.address),
      missingContact: !hasValue(party.email) && !hasValue(party.phone),
      sources: splitSourceParts(party.source),
      reasons
    };
  });
}

function splitSourceParts(value) {
  return cleanText(value)
    .split(/\s+\+\s+|;/)
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function peopleRosterStatus() {
  const people = masterPeopleRoster();
  const suggestions = interestedPersonSuggestions();
  const missingSuggested = suggestions.filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0).length;
  return {
    total: people.length,
    missingAddress: people.filter((person) => person.missingAddress).length,
    missingContact: people.filter((person) => person.missingContact).length,
    missingSuggested
  };
}

function peopleRosterMessage() {
  const status = peopleRosterStatus();
  if (!status.total) return "Enter applicant, will, or heirship answers to start the people roster.";
  if (status.missingSuggested) return `${status.missingSuggested} suggested interested person${status.missingSuggested === 1 ? "" : "s"} not yet added.`;
  if (status.missingAddress) return `${status.missingAddress} person${status.missingAddress === 1 ? "" : "s"} still need a mailing address somewhere in the file.`;
  return "";
}

function renderMasterPeopleRoster() {
  syncInterestedPersonRoster({ addMissing: false });
  const people = masterPeopleRoster();
  const status = peopleRosterStatus();
  const missingSuggestions = interestedPersonSuggestions().filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0);
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="roster-stat-grid">
      <div class="contact-stat">
        <span>${status.total}</span>
        <p>People and entities found</p>
      </div>
      <div class="contact-stat ${status.missingSuggested ? "warn" : ""}">
        <span>${status.missingSuggested}</span>
        <p>Suggested interested persons not added</p>
      </div>
      <div class="contact-stat ${status.missingAddress ? "bad" : ""}">
        <span>${status.missingAddress}</span>
        <p>Missing mailing addresses</p>
      </div>
    </div>
    <div class="guided-toolbar">
      <span class="badge">${people.length} on roster</span>
      <button type="button" class="secondary" data-sync-interested-roster>Sync interested-person treatment</button>
      ${missingSuggestions.length ? `<button type="button" class="secondary" data-roster-add-all-suggested>Add all suggested interested persons</button>` : ""}
    </div>
    <div class="roster-list">
      ${people.length ? people.map((person, index) => rosterPersonCardHtml(person, index)).join("") : `
        <div class="suggestion-empty">No people have been entered yet. Start with the applicant, proposed PR, will, and heirship questions.</div>
      `}
    </div>
  `;
  wrapper.querySelector("[data-roster-add-all-suggested]")?.addEventListener("click", () => {
    addAllInterestedPersonSuggestions();
    renderInterview();
  });
  wrapper.querySelector("[data-sync-interested-roster]")?.addEventListener("click", () => {
    syncInterestedRosterAndRefresh(true);
  });
  wrapper.querySelectorAll("[data-roster-add-interested]").forEach((button) => {
    button.addEventListener("click", () => {
      const person = people[Number(button.dataset.rosterAddInterested)];
      if (!person) return;
      addInterestedPersonSuggestion(person.suggestion);
      renderInterview();
    });
  });
  return wrapper;
}

function rosterPersonCardHtml(person, index) {
  const sourceChips = person.sources.length ? person.sources : ["Manually entered"];
  const reasonChips = person.reasons.length ? person.reasons : [person.relationship || "Person in case"];
  const added = person.interestedIndex >= 0;
  const canAdd = person.suggestedInterestedPerson && !added;
  return `
    <div class="roster-card ${person.missingAddress ? "warn" : ""}">
      <div>
        <div class="row-heading">
          <div>
            <h3>${escapeHtml(person.name || `Person ${index + 1}`)}</h3>
            <p>${escapeHtml(person.relationship || "Role not set")}</p>
          </div>
          <span class="badge ${added ? "" : canAdd ? "warn" : ""}">${added ? "Interested person" : canAdd ? "Suggested" : "Roster only"}</span>
        </div>
        <span>${escapeHtml(person.address || "Address needed")}</span>
        <div class="source-chip-list">
          ${sourceChips.map((source) => `<span class="source-chip">${escapeHtml(source)}</span>`).join("")}
        </div>
        <div class="source-chip-list muted-chip-list">
          ${reasonChips.slice(0, 6).map((reason) => `<span class="source-chip">${escapeHtml(reason)}</span>`).join("")}
        </div>
      </div>
      <div class="suggestion-actions">
        ${canAdd ? `<button type="button" class="secondary" data-roster-add-interested="${index}">Add to interested persons</button>` : ""}
      </div>
    </div>
  `;
}

function addExistingParty(parties, party = {}, options = {}) {
  if (!hasValue(party.name)) return;
  const name = cleanSuggestedPersonName(party.name);
  const validName = options.allowSelectableName ? hasSelectablePersonName(name) : hasStableSuggestedName(name);
  if (!validName) return;
  const key = normalizedPersonName(name);
  if (!key) return;
  const relationship = compactRelationshipText(party.relationship, { maxParts: 4 }) || cleanText(party.relationship);
  const existing = parties.find((item) => item.key === key);
  if (existing) {
    existing.address = existing.address || cleanText(party.address);
    existing.email = existing.email || cleanText(party.email);
    existing.phone = existing.phone || cleanText(party.phone);
    existing.relationship = compactRelationshipText(relationshipText([existing.relationship, relationship]), { maxParts: 4 });
    existing.minorDateOfBirth = existing.minorDateOfBirth || cleanText(party.minorDateOfBirth);
    existing.source = relationshipText([existing.source, party.source], " + ");
    existing.roles = { ...(existing.roles || {}), ...(party.roles || {}) };
    return;
  }
  parties.push({
    key,
    name,
    address: cleanText(party.address),
    email: cleanText(party.email),
    phone: cleanText(party.phone),
    relationship,
    minorDateOfBirth: cleanText(party.minorDateOfBirth),
    roles: party.roles || {},
    source: cleanText(party.source)
  });
}

function existingPartyOptionsHtml() {
  const parties = existingParties();
  if (!parties.length) {
    return `<option value="">No people entered yet</option>`;
  }
  return [
    `<option value="">Select existing person</option>`,
    ...parties.map((party, index) => {
      const detail = relationshipText([compactRelationshipText(party.relationship, { maxParts: 3 }), party.address], " - ");
      const label = detail ? `${party.name} (${detail})` : party.name;
      return `<option value="${index}">${escapeHtml(label)}</option>`;
    })
  ].join("");
}

function existingPartyFromSelectValue(value) {
  if (!hasValue(value)) return null;
  const index = Number(value);
  if (!Number.isInteger(index) || index < 0) return null;
  return existingParties()[index] || null;
}

function partyPickerHtml(target, index = "", label = "Use existing person") {
  return `
    <label class="party-picker">${escapeHtml(label)}
      <select data-party-picker="${escapeAttr(target)}" data-party-index="${escapeAttr(index)}">
        ${existingPartyOptionsHtml()}
      </select>
    </label>
  `;
}

function bindPartyPickers(root) {
  root.querySelectorAll("[data-party-picker]").forEach((select) => {
    select.addEventListener("change", () => {
      const party = existingPartyFromSelectValue(select.value);
      if (!party) return;
      applyExistingParty(select.dataset.partyPicker, select.dataset.partyIndex, party);
    });
  });
}

function applyExistingParty(target, index, party) {
  if (!party) return;
  if (target === "willBeneficiary") {
    const item = state.willBeneficiaries[Number(index)];
    if (!item) return;
    item.name = party.name;
    item.address = party.address || item.address || "";
    item.relationship = party.relationship || item.relationship || "";
    item.minorDateOfBirth = party.minorDateOfBirth || item.minorDateOfBirth || "";
    item.role = willBeneficiaryRoleFromParty(party, item.role);
  }
  if (target === "interestedPerson") {
    const personIndex = Number(index);
    state.interestedPersons[personIndex] = normalizeInterestedPerson(state.interestedPersons[personIndex]);
    const person = state.interestedPersons[personIndex];
    if (!person) return;
    person.name = party.name;
    person.address = party.address || person.address || "";
    person.email = party.email || person.email || "";
    person.phone = party.phone || person.phone || "";
    person.relationship = party.relationship || person.relationship || "Interested person";
    person.minorDateOfBirth = party.minorDateOfBirth || person.minorDateOfBirth || "";
    person.roles = { ...person.roles, ...rolesFromSuggestionRelationship(party.relationship), ...(party.roles || {}) };
    if (person.minorDateOfBirth) person.roles.minor = true;
    state.interestedPersons[personIndex] = applyInterestedPersonInferences(person, party);
  }
  if (target === "heirshipInformant") {
    state.heirship.informant.name = party.name;
    state.heirship.informant.address = party.address || state.heirship.informant.address || "";
    state.heirship.informant.relationship = compactRelationshipText(party.relationship) || state.heirship.informant.relationship || "";
  }
  if (target === "survivingSpouse") {
    state.heirship.spouse.name = party.name;
    state.spouse.everMarried = "yes";
    state.spouse.fullName = party.name;
    if (!hasValue(state.spouse.statusAtDeath)) state.spouse.statusAtDeath = "married";
    syncSurvivingSpouseFromSpouseHistory();
  }
  if (target === "heirshipChild") {
    const childIndex = Number(index);
    state.heirship.children.people[childIndex] = normalizeHeirshipChild(state.heirship.children.people[childIndex]);
    const child = state.heirship.children.people[childIndex];
    if (!child) return;
    child.name = party.name;
    child.address = party.address || child.address || "";
    child.minorDateOfBirth = party.minorDateOfBirth || child.minorDateOfBirth || "";
    syncHeirshipChildrenList();
  }
  if (target === "willNamedPr") {
    state.will.namedPr = party.name;
    state.will.namedPrNone = false;
  }
  if (target === "willNamedTrustee") {
    state.will.namedTrustee = party.name;
    state.will.namedTrusteeNone = false;
  }
  if (target === "willNominatedTrustee") {
    state.will.nominatedTrustee = party.name;
    state.will.nominatedTrusteeNone = false;
  }
  saveState();
  renderFields();
  renderHeirshipChildren();
  renderWillBeneficiaries();
  renderInterestedPersons();
  renderInterestedSuggestions();
  renderReview();
  renderInterview();
}

function willBeneficiaryRoleFromParty(party, currentRole = "beneficiary") {
  const text = cleanText(party.relationship).toLowerCase();
  if (text.includes("trust beneficiary")) return "trust_beneficiary";
  if (text.includes("trustee")) return "trustee";
  if (text.includes("codicil")) return "codicil_beneficiary";
  if (text.includes("organization") || text.includes("charity")) return "entity";
  if (text.includes("beneficiary")) return "beneficiary";
  return currentRole || "beneficiary";
}

function hasInterestedPersonContent(person = {}) {
  const normalized = normalizeInterestedPerson(person);
  const relationship = cleanText(normalized.relationship);
  const relationshipIsPlaceholder = comparableText(relationship) === "interested person";
  return [
    normalized.name,
    relationshipIsPlaceholder ? "" : relationship,
    normalized.address,
    normalized.email,
    normalized.phone,
    normalized.minorDateOfBirth
  ].some(hasValue) || Object.values(normalized.roles || {}).some(Boolean);
}

function hasWillBeneficiaryContent(person = {}) {
  return [
    person.name,
    person.relationship,
    person.address,
    person.minorDateOfBirth,
    person.notes
  ].some(hasValue);
}

function guidedWillBeneficiariesComplete() {
  if (state.will.hasNamedBeneficiaries === "no") return true;
  if (state.will.hasNamedBeneficiaries !== "yes") return false;
  const people = state.willBeneficiaries.filter(hasWillBeneficiaryContent);
  if (!people.length) return false;
  return people.every((person) => hasValue(person.name) && hasValue(person.address));
}

function guidedWillBeneficiariesMessage() {
  if (!hasValue(state.will.hasNamedBeneficiaries)) return "Answer whether the will names beneficiaries or trust beneficiaries.";
  if (state.will.hasNamedBeneficiaries === "no") return "";
  if (state.will.hasNamedBeneficiaries === "unknown") return "Review the will before relying on the interested-person list.";
  const people = state.willBeneficiaries.filter(hasWillBeneficiaryContent);
  if (!people.length) return "Because this is marked Yes, add each named beneficiary, trust beneficiary, organization, or trustee who should receive notice.";
  const missing = people.filter((person) => !hasValue(person.name) || !hasValue(person.address)).length;
  return missing ? `${missing} named person still needs a name or mailing address.` : "";
}

function guidedInterestedPersonsComplete() {
  const people = state.interestedPersons.filter(hasInterestedPersonContent);
  if (!people.length) return false;
  return people.every((person) => hasValue(person.name) && hasValue(interestedRelationship(person)) && hasValue(person.address));
}

function guidedInterestedPersonsMessage() {
  const missingSuggestions = interestedPersonSuggestions().filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0).length;
  if (missingSuggestions) return `${missingSuggestions} suggested interested person${missingSuggestions === 1 ? "" : "s"} not yet added.`;
  const people = state.interestedPersons.filter(hasInterestedPersonContent);
  if (!people.length) return "Add at least one interested person.";
  const missing = people.filter((person) => !hasValue(person.name) || !hasValue(interestedRelationship(person)) || !hasValue(person.address)).length;
  return missing ? `${missing} interested person${missing === 1 ? "" : "s"} still need a name, role, or mailing address.` : "";
}

function interestedPersonSourceReviewMessage() {
  const items = interestedPersonSourceReviewItems();
  const suggested = items.filter((item) => item.status === "suggested").length;
  const included = items.filter((item) => item.status === "included").length;
  const missingAddress = items.filter((item) => item.status === "included" && item.service?.missingAddress).length;
  if (!items.length) return "Enter applicant, will, heirship, or beneficiary answers before auditing interested persons.";
  if (!included) return "Add at least one interested person before relying on waivers, notice, or service decisions.";
  if (suggested) return `${suggested} suggested interested person${suggested === 1 ? "" : "s"} still not added.`;
  if (missingAddress) return `${missingAddress} included interested person${missingAddress === 1 ? "" : "s"} still need mailing-address review.`;
  return "";
}

function interestedPersonSourceReviewItems() {
  syncInterestedPersonRoster({ addMissing: false, persist: false });
  const suggestions = interestedPersonSuggestions();
  const people = masterPeopleRoster();
  const items = people.map((person, rosterIndex) => {
    const matchingSuggestions = suggestions.filter((suggestion) => sameName(suggestion.name, person.name));
    const status = interestedPersonAuditStatus(person);
    const currentPerson = person.interestedIndex >= 0 ? normalizeInterestedPerson(state.interestedPersons[person.interestedIndex]) : null;
    const service = currentPerson ? interestedPersonServiceStatus(currentPerson) : null;
    const reasons = interestedPersonSourceReasons(currentPerson || person, matchingSuggestions);
    return {
      ...person,
      rosterIndex,
      current: person.interestedIndex >= 0,
      status: status.key,
      statusLabel: status.label,
      tone: status.tone,
      relationship: currentPerson ? interestedRelationship(currentPerson) : person.relationship,
      address: currentPerson?.address || person.address,
      service,
      reasons,
      decision: interestedPersonAuditDecisionText(person, status.key, service),
      action: interestedPersonAuditActionText(person, status.key, service)
    };
  });

  suggestions.forEach((suggestion, suggestionIndex) => {
    if (items.some((item) => sameName(item.name, suggestion.name))) return;
    const status = { key: "suggested", label: "Suggested", tone: "warn" };
    items.push({
      key: normalizedPersonName(suggestion.name),
      name: suggestion.name,
      relationship: suggestion.relationship || "Interested person",
      address: suggestion.address,
      source: suggestion.source,
      sources: splitSourceParts(suggestion.source),
      reasons: interestedPersonSourceReasons(suggestion, [suggestion]),
      suggestion,
      suggestionIndex,
      suggestedInterestedPerson: true,
      interestedIndex: -1,
      current: false,
      status: status.key,
      statusLabel: status.label,
      tone: status.tone,
      service: null,
      decision: interestedPersonAuditDecisionText(suggestion, status.key, null),
      action: interestedPersonAuditActionText(suggestion, status.key, null)
    });
  });

  const order = { included: 0, suggested: 1, excluded: 2 };
  return items.sort((first, second) => {
    const statusSort = (order[first.status] ?? 9) - (order[second.status] ?? 9);
    if (statusSort) return statusSort;
    return cleanText(first.name).localeCompare(cleanText(second.name));
  });
}

function interestedPersonAuditStatus(person = {}) {
  if (person.interestedIndex >= 0) return { key: "included", label: "Included", tone: "" };
  if (person.suggestedInterestedPerson) return { key: "suggested", label: "Suggested", tone: "warn" };
  return { key: "excluded", label: "Excluded", tone: "bad" };
}

function interestedPersonAuditDecisionText(person = {}, status = "excluded", service = null) {
  if (status === "included") {
    const serviceText = service?.reasons?.length ? ` Service review: ${service.reasons.join("; ")}.` : "";
    return `Included in PR-1801 interested persons and waiver/notice/service treatment.${serviceText}`;
  }
  if (status === "suggested") {
    return "The app found a likely interested-person reason, but this person or entity has not been added to the active list yet.";
  }
  const text = cleanText(relationshipText([person.relationship, person.source])).toLowerCase();
  if (text.includes("resident agent")) return "Excluded for now because a resident agent is not automatically an interested person unless also an heir, beneficiary, fiduciary, trustee, or other required party.";
  if (text.includes("informant")) return "Excluded for now because the proof-of-heirship informant is not automatically an interested person unless another answer makes them one.";
  return "Excluded from waiver/notice/service treatment for now because the current answers do not show an heir, beneficiary, fiduciary, trustee, or other interested-person basis.";
}

function interestedPersonAuditActionText(person = {}, status = "excluded", service = null) {
  if (status === "included") {
    if (service?.missingAddress) return "Confirm the mailing address before relying on waivers, notice, or service.";
    if (!hasValue(service?.person?.service?.waiverStatus)) return "Answer whether this person can sign a waiver.";
    if (service?.unknownOrMissing || service?.needsMailedNotice) return "Use this service status when deciding PR-1803 waiver vs. PR-1805 notice.";
    return "Keep included if this person should receive notice or sign a waiver.";
  }
  if (status === "suggested") return "Add this person/entity before generating final waivers, notices, or service documents, unless a lawyer confirms exclusion.";
  return "Leave excluded unless additional facts show this person/entity should receive notice, sign a waiver, or be listed as interested.";
}

function interestedPersonSourceReasons(person, matchingSuggestions = []) {
  const normalized = applyInterestedPersonInferences(person, matchingSuggestions[0] || {});
  const roles = normalized.roles || {};
  const reasons = [];
  matchingSuggestions.forEach((suggestion) => {
    if (hasValue(suggestion.source)) reasons.push(suggestion.source);
    if (hasValue(suggestion.relationship)) reasons.push(suggestion.relationship);
  });
  if (sameName(normalized.name, state.applicant.fullName)) reasons.push("Applicant");
  if (sameName(normalized.name, state.pr.fullName)) reasons.push("Proposed Personal Representative");
  if (state.will.exists === "yes" && sameName(normalized.name, state.will.namedPr)) reasons.push("Personal Representative named in will");
  if (state.will.exists === "yes" && sameName(normalized.name, state.will.namedTrustee)) reasons.push("Trustee named in will");
  if (state.will.exists === "yes" && sameName(normalized.name, state.will.nominatedTrustee)) reasons.push("Nominated trustee");
  if (sameName(normalized.name, state.heirship.spouse.name)) reasons.push("Surviving spouse/domestic partner");
  if (roles.heir) reasons.push("Heir");
  if (roles.beneficiary) reasons.push("Will beneficiary");
  if (roles.namedPr) reasons.push("Named Personal Representative");
  if (roles.trustee) reasons.push("Trustee");
  if (roles.trustBeneficiary) reasons.push("Trust beneficiary");
  if (roles.minor || hasValue(normalized.minorDateOfBirth)) reasons.push("Minor/protected-person review");
  const unique = [];
  reasons.map(cleanText).filter(Boolean).forEach((reason) => {
    if (!unique.some((existing) => comparableText(existing) === comparableText(reason))) unique.push(reason);
  });
  return unique.length ? unique : ["Manually added"];
}

function renderInterestedPersonsSourceReview() {
  syncInterestedPersonRoster({ addMissing: false });
  const items = interestedPersonSourceReviewItems();
  const stats = {
    included: items.filter((item) => item.status === "included").length,
    suggested: items.filter((item) => item.status === "suggested").length,
    excluded: items.filter((item) => item.status === "excluded").length,
    attention: items.filter((item) => item.status === "included" && item.service?.needsAttention).length
  };
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="audit-stat-grid">
      <div class="contact-stat">
        <span>${stats.included}</span>
        <p>Included</p>
      </div>
      <div class="contact-stat ${stats.suggested ? "warn" : ""}">
        <span>${stats.suggested}</span>
        <p>Suggested, not added</p>
      </div>
      <div class="contact-stat ${stats.excluded ? "bad" : ""}">
        <span>${stats.excluded}</span>
        <p>Excluded / roster only</p>
      </div>
      <div class="contact-stat ${stats.attention ? "warn" : ""}">
        <span>${stats.attention}</span>
        <p>Need service review</p>
      </div>
    </div>
    <div class="guided-toolbar">
      <span class="badge">${items.length} audited</span>
      ${stats.suggested ? `<button type="button" class="secondary" data-add-all-source-suggestions>Add all suggested people</button>` : ""}
      <button type="button" class="secondary" data-sync-source-audit>Sync audit from answers</button>
    </div>
    <div class="guided-note">
      <p>Removing someone here only removes that person from the active interested-person list. It will not change applicant, will, heirship, or beneficiary answers; if those answers still point to the same person, the app may suggest adding that person again.</p>
    </div>
    <div class="source-review-list">
      ${items.length ? items.map((item, index) => sourceReviewCardHtml(item, index)).join("") : `
        <div class="suggestion-empty">Enter applicant, will, heirship, beneficiary, or interested-person answers to build the audit.</div>
      `}
    </div>
  `;
  wrapper.querySelector("[data-add-all-source-suggestions]")?.addEventListener("click", () => {
    addAllInterestedPersonSuggestions();
    renderInterview();
  });
  wrapper.querySelector("[data-sync-source-audit]")?.addEventListener("click", () => {
    syncInterestedRosterAndRefresh(false);
  });
  wrapper.querySelectorAll("[data-add-source-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items[Number(button.dataset.addSourceSuggestion)];
      addInterestedPersonSuggestion(item?.suggestion || item);
      renderInterview();
    });
  });
  wrapper.querySelectorAll("[data-remove-source-current]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeSourceCurrent);
      state.interestedPersons.splice(index, 1);
      if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
      saveState();
      renderInterestedPersons();
      renderInterestedSuggestions();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function sourceReviewCardHtml(item, auditIndex) {
  const serviceBadges = item.current && item.service ? serviceStatusBadgesHtml(item.service.person) : "";
  const reasonChips = item.reasons.length ? item.reasons : ["No source reason available"];
  const sourceChips = item.sources?.length ? item.sources : splitSourceParts(item.source || "");
  const open = item.status === "suggested" || item.service?.needsAttention;
  return `
    <details class="source-review-card ${escapeAttr(item.status)} ${escapeAttr(item.tone || "")}" ${open ? "open" : ""}>
      <summary class="audit-summary">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.relationship || "Interested person")}</p>
          <span>${escapeHtml(item.address || "Address needed")}</span>
        </div>
        <div class="suggestion-actions">
          <span class="badge ${escapeAttr(item.tone || "")}">${escapeHtml(item.statusLabel)}</span>
        </div>
      </summary>
      <div class="audit-card-body">
        ${serviceBadges}
        <div class="audit-decision">
          <strong>${escapeHtml(item.decision)}</strong>
          <span>${escapeHtml(item.action)}</span>
        </div>
        <div class="source-chip-list">
          ${reasonChips.map((reason) => `<span class="source-chip">${escapeHtml(reason)}</span>`).join("")}
        </div>
        ${sourceChips.length ? `
          <div class="source-chip-list muted-chip-list">
            ${sourceChips.map((source) => `<span class="source-chip">${escapeHtml(source)}</span>`).join("")}
          </div>
        ` : ""}
        <div class="audit-card-actions">
          ${item.current
            ? `<button type="button" class="ghost" data-remove-source-current="${Number(item.interestedIndex)}">Remove from list</button>`
            : `<button type="button" class="secondary" data-add-source-suggestion="${Number(auditIndex)}">Add anyway</button>`}
        </div>
      </div>
    </details>
  `;
}

function addressContactSummaryText() {
  const status = addressContactStatus();
  if (status.missingRequired) return `${status.missingRequired} address${status.missingRequired === 1 ? "" : "es"} needed`;
  if (status.missingHelpful) return "Addresses ready, contact info optional";
  return "Addresses ready";
}

function addressContactReviewMessage() {
  const status = addressContactStatus();
  if (status.missingRequired) return `${status.missingRequired} required mailing address${status.missingRequired === 1 ? "" : "es"} still missing.`;
  if (status.missingHelpful) return "Mailing addresses are complete. Optional phone or email details can still be added.";
  return "";
}

function beneficiaryRoleOptionsHtml(role) {
  return [
    ["beneficiary", "Will beneficiary"],
    ["codicil_beneficiary", "Codicil beneficiary"],
    ["trust_beneficiary", "Trust beneficiary"],
    ["trustee", "Trustee"],
    ["entity", "Organization or charity"],
    ["other", "Other person named in will"]
  ].map(([value, label]) => `<option value="${value}" ${role === value ? "selected" : ""}>${label}</option>`).join("");
}

const willRoleConfigs = [
  {
    title: "Personal Representative named in will",
    field: "namedPr",
    noneField: "namedPrNone",
    target: "willNamedPr",
    placeholder: "Name of person named as PR"
  },
  {
    title: "Trustee named in will",
    field: "namedTrustee",
    noneField: "namedTrusteeNone",
    target: "willNamedTrustee",
    placeholder: "Name of trustee, if any"
  },
  {
    title: "Nominated trustee",
    field: "nominatedTrustee",
    noneField: "nominatedTrusteeNone",
    target: "willNominatedTrustee",
    placeholder: "Name of nominated trustee, if any"
  }
];

function renderGuidedWillRoles() {
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-note">
      <p>At this stage, collect names only. Asset values, exact bequest amounts, and distribution details can wait for inventory and estate accounting.</p>
    </div>
    <div class="guided-card-list">
      ${willRoleConfigs.map(willRoleCardHtml).join("")}
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelectorAll("[data-will-role-picker]").forEach((select) => {
    select.addEventListener("change", () => {
      const party = existingPartyFromSelectValue(select.value);
      if (!party) return;
      applyExistingParty(select.dataset.willRolePicker, "", party);
    });
  });
  wrapper.querySelectorAll("[data-will-role-has]").forEach((button) => {
    button.addEventListener("click", () => {
      const config = willRoleConfigs.find((item) => item.noneField === button.dataset.willRoleHas);
      if (!config) return;
      state.will[config.noneField] = false;
      saveState();
      renderInterview();
    });
  });
  wrapper.querySelectorAll("[data-will-role-none]").forEach((button) => {
    button.addEventListener("click", () => {
      const config = willRoleConfigs.find((item) => item.noneField === button.dataset.willRoleNone);
      if (!config) return;
      state.will[config.field] = "";
      state.will[config.noneField] = true;
      saveState();
      renderFields();
      renderInterestedSuggestions();
      renderReview();
      renderInterview();
    });
  });
  wrapper.querySelectorAll("[data-will-role-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const config = willRoleConfigs.find((item) => item.noneField === input.dataset.willRoleInput);
      if (!config || !hasValue(input.value)) return;
      state.will[config.noneField] = false;
      saveState();
      renderInterviewStatus();
    });
  });
  return wrapper;
}

function willRoleCardHtml(config) {
  const value = cleanText(state.will[config.field]);
  const none = Boolean(state.will[config.noneField]);
  return `
    <div class="guided-person-card">
      <div class="row-heading">
        <div>
          <h3>${escapeHtml(config.title)}</h3>
          <p>${value ? escapeHtml(value) : none ? "Will does not name anyone for this role." : "Not answered yet."}</p>
        </div>
        <span class="badge ${none ? "warn" : ""}">${value ? "Named" : none ? "None named" : "Optional"}</span>
      </div>
      <div class="choice-grid role-choice-grid">
        <button type="button" class="choice-button ${!none ? "selected" : ""}" data-will-role-has="${escapeAttr(config.noneField)}" aria-pressed="${!none ? "true" : "false"}">
          <strong>Will names someone</strong>
          <span>Select an existing person or type a new name.</span>
        </button>
        <button type="button" class="choice-button ${none ? "selected" : ""}" data-will-role-none="${escapeAttr(config.noneField)}" aria-pressed="${none ? "true" : "false"}">
          <strong>No one named</strong>
          <span>Mark this role as not named in the will.</span>
        </button>
      </div>
      ${!none ? `
        <label class="interview-label party-picker">Choose from people already entered
          <select data-will-role-picker="${escapeAttr(config.target)}">
            ${existingPartyOptionsHtml()}
          </select>
        </label>
        <label class="interview-label">Or enter a new name
          <input data-guided-path="will.${escapeAttr(config.field)}" data-will-role-input="${escapeAttr(config.noneField)}" value="${escapeAttr(value)}" placeholder="${escapeAttr(config.placeholder)}" />
        </label>
      ` : ""}
    </div>
  `;
}

function renderGuidedWillBeneficiaries() {
  if (state.will.hasNamedBeneficiaries === "yes" && !state.willBeneficiaries.length) state.willBeneficiaries.push(emptyWillBeneficiary());
  const addBeneficiary = () => {
    state.will.hasNamedBeneficiaries = "yes";
    state.willBeneficiaries.push(emptyWillBeneficiary());
    saveState();
    renderWillBeneficiaries();
    renderInterestedSuggestions();
    renderReview();
    renderInterview();
  };
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  const namedCount = state.willBeneficiaries.filter(hasWillBeneficiaryContent).length;
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Does the will or codicil name beneficiaries, trust beneficiaries, or organizations?</h3>
      <p>For the opening packet, enter names and mailing addresses only. Asset values, account numbers, and specific distribution details come later with inventory and estate accounting.</p>
      <div class="choice-grid stacked-choice-grid">
        ${guidedChoiceButtonHtml("will.hasNamedBeneficiaries", "yes", "Yes", "Add the named people or entities for notice/waiver purposes.")}
        ${guidedChoiceButtonHtml("will.hasNamedBeneficiaries", "no", "No", "Skip this list for now.")}
        ${guidedChoiceButtonHtml("will.hasNamedBeneficiaries", "unknown", "Not sure", "Flag this for review before relying on the packet.")}
      </div>
    </div>
    ${state.will.hasNamedBeneficiaries === "yes" ? `
    <div class="guided-toolbar">
      <span class="badge">${namedCount} named</span>
      <button type="button" class="secondary" data-add-guided-beneficiary>Add beneficiary or trustee</button>
    </div>
    <div class="guided-card-list">
      ${state.willBeneficiaries.map((person, index) => {
        const displayName = cleanText(person.name) || `Named person ${index + 1}`;
        const roleLabel = beneficiaryRoleLabel(person.role);
        return `
        <div class="guided-person-card repeated-card named-person-card">
          <div class="repeat-card-header">
            <div class="repeat-card-title">
              <span class="card-number-badge">Named person ${index + 1}</span>
              <h3>${escapeHtml(displayName)}</h3>
              <span class="repeat-card-subtitle">${escapeHtml(roleLabel)}</span>
            </div>
            <button type="button" class="ghost" data-remove-guided-beneficiary="${index}">Remove</button>
          </div>
          <div class="repeat-card-body">
            ${partyPickerHtml("willBeneficiary", index)}
            <div class="grid two compact">
              <label>Name
                <input data-guided-path="willBeneficiaries.${index}.name" value="${escapeAttr(person.name)}" />
              </label>
              <label>Role
                <select data-guided-path="willBeneficiaries.${index}.role">
                  ${beneficiaryRoleOptionsHtml(person.role)}
                </select>
              </label>
              <label>Relationship or description
                <input data-guided-path="willBeneficiaries.${index}.relationship" value="${escapeAttr(person.relationship)}" placeholder="Child, friend, charity, trust" />
              </label>
              <label>Mailing address
                <input data-guided-path="willBeneficiaries.${index}.address" value="${escapeAttr(person.address)}" />
              </label>
              <label>Minor date of birth
                <input type="date" data-guided-path="willBeneficiaries.${index}.minorDateOfBirth" value="${escapeAttr(person.minorDateOfBirth)}" />
              </label>
              <label>Notes
                <input data-guided-path="willBeneficiaries.${index}.notes" value="${escapeAttr(person.notes)}" />
              </label>
            </div>
          </div>
        </div>
      `;
      }).join("")}
    </div>
    <div class="list-bottom-actions">
      <button type="button" class="secondary" data-add-guided-beneficiary-bottom>Add beneficiary or trustee</button>
    </div>
    ` : state.will.hasNamedBeneficiaries === "no" ? `
      <div class="guided-note">
        <p>No will beneficiaries will be added from this screen. Heirs and other interested persons can still be added in the next section.</p>
      </div>
    ` : state.will.hasNamedBeneficiaries === "unknown" ? `
      <div class="guided-note warn">
        <p>Review the will before generating final waivers or notices. Beneficiaries are usually interested persons.</p>
      </div>
    ` : ""}
  `;
  bindGuidedChoiceButtons(wrapper);
  bindPartyPickers(wrapper);
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-add-guided-beneficiary]")?.addEventListener("click", addBeneficiary);
  wrapper.querySelector("[data-add-guided-beneficiary-bottom]")?.addEventListener("click", addBeneficiary);
  wrapper.querySelectorAll("[data-remove-guided-beneficiary]").forEach((button) => {
    button.addEventListener("click", () => {
      state.willBeneficiaries.splice(Number(button.dataset.removeGuidedBeneficiary), 1);
      if (!state.willBeneficiaries.length) state.willBeneficiaries.push(emptyWillBeneficiary());
      saveState();
      renderWillBeneficiaries();
      renderInterestedSuggestions();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function renderGuidedChildren() {
  syncHeirshipChildrenList(state, { persist: false });
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Did the decedent have any children, living or deceased?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("heirship.children.exists", "yes", "Yes", "Add each child below, including deceased children if applicable.")}
        ${guidedChoiceButtonHtml("heirship.children.exists", "no", "No", "Continue to parents, siblings, or other relatives if needed.")}
      </div>
    </div>
    ${state.heirship.children.exists === "yes" ? `
      <div class="guided-card-list">
        ${state.heirship.children.people.map((child, index) => guidedChildCardHtml(normalizeHeirshipChild(child), index)).join("")}
      </div>
      <div class="list-bottom-actions">
        <button type="button" class="secondary" data-add-guided-child>Add child</button>
      </div>
      <label class="interview-label">Descendants of deceased children
        <textarea rows="3" data-guided-path="heirship.children.deceasedChildDescendants">${escapeHtml(state.heirship.children.deceasedChildDescendants)}</textarea>
      </label>
    ` : ""}
  `;
  bindGuidedChoiceButtons(wrapper);
  bindGuidedPathInputs(wrapper);
  bindPartyPickers(wrapper);
  wrapper.querySelector("[data-add-guided-child]")?.addEventListener("click", () => {
    state.heirship.children.people.push(emptyHeirshipChild());
    syncHeirshipChildrenList();
    saveState();
    renderHeirshipChildren();
    renderInterestedSuggestions();
    renderReview();
    renderInterview();
  });
  wrapper.querySelectorAll("[data-remove-guided-child]").forEach((button) => {
    button.addEventListener("click", () => {
      state.heirship.children.people.splice(Number(button.dataset.removeGuidedChild), 1);
      if (!state.heirship.children.people.length) state.heirship.children.people.push(emptyHeirshipChild());
      syncHeirshipChildrenList();
      saveState();
      renderHeirshipChildren();
      renderInterestedSuggestions();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function guidedChildCardHtml(child, index) {
  const displayName = cleanText(child.name) || `Child ${index + 1}`;
  const statusLabels = {
    living: "Living child",
    deceased: "Deceased child",
    unknown: "Living status unknown"
  };
  const subtitle = statusLabels[child.livingStatus] || "Child";
  return `
    <div class="guided-person-card repeated-card child-card">
      <div class="repeat-card-header">
        <div class="repeat-card-title">
          <span class="card-number-badge">Child ${index + 1}</span>
          <h3>${escapeHtml(displayName)}</h3>
          <span class="repeat-card-subtitle">${escapeHtml(subtitle)}</span>
        </div>
        <button type="button" class="ghost" data-remove-guided-child="${index}">Remove</button>
      </div>
      <div class="repeat-card-body">
        ${partyPickerHtml("heirshipChild", index)}
        <div class="grid two compact">
          <label>Name
            <input data-guided-path="heirship.children.people.${index}.name" value="${escapeAttr(child.name)}" />
          </label>
          <label>Living status
            <select data-guided-path="heirship.children.people.${index}.livingStatus">
              <option value="living" ${child.livingStatus === "living" ? "selected" : ""}>Living</option>
              <option value="deceased" ${child.livingStatus === "deceased" ? "selected" : ""}>Deceased</option>
              <option value="unknown" ${child.livingStatus === "unknown" ? "selected" : ""}>Unknown</option>
            </select>
          </label>
          <label>Mailing address
            <input data-guided-path="heirship.children.people.${index}.address" value="${escapeAttr(child.address)}" />
          </label>
          <label>Minor date of birth
            <input type="date" data-guided-path="heirship.children.people.${index}.minorDateOfBirth" value="${escapeAttr(child.minorDateOfBirth)}" />
          </label>
          <label>Notes
            <input data-guided-path="heirship.children.people.${index}.notes" value="${escapeAttr(child.notes)}" placeholder="Adopted, deceased date, descendants, or follow-up" />
          </label>
        </div>
      </div>
    </div>
  `;
}

function activeInterestedDraftIndex() {
  const index = Number(state.ui.activeInterestedDraftIndex);
  return Number.isInteger(index) && index >= 0 ? index : -1;
}

function addBlankGuidedInterestedPerson() {
  state.interestedPersons.push(emptyInterestedPerson());
  state.ui.activeInterestedDraftIndex = state.interestedPersons.length - 1;
  state.ui.interviewStepId = "interested-details";
  saveState();
  renderInterestedPersons();
  renderReview();
  renderInterview();
}

function renderGuidedInterestedSuggestions() {
  if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
  syncInterestedPersonRoster({ addMissing: false });
  const suggestions = interestedPersonSuggestions();
  const missingSuggestions = suggestions.filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0);
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="contact-status-grid">
      <div class="contact-stat">
        <span>${suggestions.length}</span>
        <p>Found from your answers</p>
      </div>
      <div class="contact-stat ${missingSuggestions.length ? "warn" : ""}">
        <span>${missingSuggestions.length}</span>
        <p>Not yet added</p>
      </div>
      <div class="contact-stat">
        <span>${state.interestedPersons.filter(hasInterestedPersonContent).length}</span>
        <p>Interested persons listed</p>
      </div>
    </div>
    <div class="guided-toolbar">
      <span class="badge">${suggestions.length} found</span>
      <button type="button" class="secondary" data-sync-guided-interested>Sync roster and service flags</button>
      <button type="button" class="secondary" data-add-all-guided-suggestions ${missingSuggestions.length ? "" : "disabled"}>Add all suggestions</button>
      <button type="button" class="secondary" data-add-guided-person>Add person manually</button>
    </div>
    <div class="guided-suggestions">
      ${suggestions.length ? suggestions.map((suggestion, index) => {
        const existingIndex = existingInterestedPersonIndex(suggestion.name);
        return `
          <div class="suggestion-card">
            <div>
              <h3>${escapeHtml(suggestion.name)}</h3>
              <p>${escapeHtml(suggestion.relationship || "Interested person")}</p>
              <span>${escapeHtml(suggestion.address || "Address needed")}</span>
            </div>
            <div class="suggestion-actions">
              <span class="badge ${existingIndex >= 0 ? "" : "warn"}">${existingIndex >= 0 ? "Added" : suggestion.source || "Suggested"}</span>
              <button type="button" class="secondary" data-add-guided-suggestion="${index}" ${existingIndex >= 0 ? "disabled" : ""}>${existingIndex >= 0 ? "Added" : "Add"}</button>
            </div>
          </div>
        `;
      }).join("") : `
        <div class="suggestion-empty">Answer applicant, will, heirship, and beneficiary questions to build suggested interested persons.</div>
      `}
    </div>
  `;
  wrapper.querySelector("[data-add-all-guided-suggestions]")?.addEventListener("click", () => {
    addAllInterestedPersonSuggestions();
    renderInterview();
  });
  wrapper.querySelector("[data-sync-guided-interested]")?.addEventListener("click", () => {
    syncInterestedRosterAndRefresh(true);
  });
  wrapper.querySelectorAll("[data-add-guided-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      addInterestedPersonSuggestion(suggestions[Number(button.dataset.addGuidedSuggestion)]);
      renderInterview();
    });
  });
  wrapper.querySelector("[data-add-guided-person]")?.addEventListener("click", addBlankGuidedInterestedPerson);
  return wrapper;
}

function guidedInterestedSuggestionsComplete() {
  syncInterestedPersonRoster({ addMissing: false, persist: false });
  return state.interestedPersons.some(hasInterestedPersonContent)
    && interestedPersonSuggestions().filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0).length === 0;
}

function guidedInterestedSuggestionsMessage() {
  syncInterestedPersonRoster({ addMissing: false, persist: false });
  const missing = interestedPersonSuggestions().filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0).length;
  if (missing) return `${missing} suggested interested person${missing === 1 ? "" : "s"} not yet added.`;
  if (!state.interestedPersons.some(hasInterestedPersonContent)) return "Add at least one interested person, or continue if no suggestions appear yet.";
  return "";
}

function renderGuidedInterestedPersonDetails() {
  if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
  syncInterestedPersonRoster({ addMissing: false });
  const activeDraft = activeInterestedDraftIndex();
  const visiblePeople = state.interestedPersons
    .map((person, index) => ({ person: normalizeInterestedPerson(person), index }))
    .filter(({ person, index }) => hasInterestedPersonContent(person) || index === activeDraft);
  const completedCount = visiblePeople.filter(({ person }) => hasInterestedPersonContent(person)).length;
  const draftCount = visiblePeople.length - completedCount;
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-toolbar">
      <span class="badge">${completedCount} listed${draftCount ? `, ${draftCount} new` : ""}</span>
      <button type="button" class="secondary" data-add-guided-person>Add person</button>
    </div>
    <div class="guided-card-list">
      ${visiblePeople.length
        ? visiblePeople.map(({ person, index }, displayIndex) => guidedInterestedPersonDetailsCardHtml(person, index, displayIndex)).join("")
        : `<div class="suggestion-empty">No interested persons have been added yet. Use Add person or the suggested roster screen to add heirs, beneficiaries, trustees, or other required people.</div>`}
    </div>
    <div class="list-bottom-actions">
      <button type="button" class="secondary" data-add-guided-person-bottom>Add person</button>
    </div>
  `;
  bindPartyPickers(wrapper);
  bindGuidedPathInputs(wrapper);
  bindGuidedInterestedRoleInputs(wrapper);
  wrapper.querySelector("[data-add-guided-person]")?.addEventListener("click", addBlankGuidedInterestedPerson);
  wrapper.querySelector("[data-add-guided-person-bottom]")?.addEventListener("click", addBlankGuidedInterestedPerson);
  bindGuidedInterestedRemoveButtons(wrapper);
  return wrapper;
}

function renderGuidedInterestedService() {
  syncInterestedPersonRoster({ addMissing: false });
  const people = state.interestedPersons.filter(hasInterestedPersonContent).map(normalizeInterestedPerson);
  const summary = interestedPersonServiceSummary();
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="service-focus-card">
      <h3>Choose a waiver answer for each person.</h3>
      <p>Use "can sign" only when the person is an adult, located, and willing to sign. Anything else may require mailed notice or PR-1805 review.</p>
    </div>
    <details class="compact-help service-summary-details">
      <summary>Waiver status summary</summary>
      <div class="packet-stat-grid compact-stat-grid">
        <div class="packet-stat">
          <strong>${summary.canSignWaiverCount}/${summary.total}</strong>
          <span>can sign waiver</span>
        </div>
        <div class="packet-stat">
          <strong>${summary.mailedNoticeCount}</strong>
          <span>need mailed notice</span>
        </div>
        <div class="packet-stat">
          <strong>${summary.unknownOrMissingCount}</strong>
          <span>unknown/not located</span>
        </div>
        <div class="packet-stat">
          <strong>${summary.protectedCount}</strong>
          <span>minor/protected</span>
        </div>
        <div class="packet-stat">
          <strong>${summary.unansweredWaiverCount}</strong>
          <span>waiver answers missing</span>
        </div>
      </div>
    </details>
    <div class="guided-toolbar">
      <span class="badge">${summary.unansweredWaiverCount} unanswered</span>
      <button type="button" class="secondary" data-sync-service-treatment>Sync service treatment</button>
      <button type="button" class="secondary" data-mark-eligible-waivers ${summary.total ? "" : "disabled"}>Mark eligible known adults can sign</button>
    </div>
    <div class="guided-card-list">
      ${people.length ? state.interestedPersons.map((person, index) => hasInterestedPersonContent(person) ? guidedInterestedServiceCardHtml(normalizeInterestedPerson(person), index) : "").join("") : `
        <div class="suggestion-empty">Add interested persons before answering waiver and service questions.</div>
      `}
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-sync-service-treatment]")?.addEventListener("click", () => {
    syncInterestedRosterAndRefresh(true);
  });
  wrapper.querySelector("[data-mark-eligible-waivers]")?.addEventListener("click", markEligibleKnownAdultsCanSign);
  return wrapper;
}

function markEligibleKnownAdultsCanSign() {
  state.interestedPersons = state.interestedPersons.map((person) => {
    const normalized = applyInterestedPersonInferences(person);
    if (!hasInterestedPersonContent(normalized)) return normalized;
    const status = interestedPersonServiceStatus(normalized);
    const waiverStatus = normalized.service?.waiverStatus || "";
    const hardStop = ["cannot_sign", "will_not_sign", "not_eligible"].includes(waiverStatus) || status.protectedPerson || status.unknownOrMissing;
    if (hardStop || !hasValue(normalized.address)) return normalized;
    if (!hasValue(waiverStatus) || waiverStatus === "unknown" || waiverStatus === "can_sign") {
      normalized.service.waiverStatus = "can_sign";
      normalized.service.locationStatus = "known";
      normalized.service.needsMailedNotice = false;
    }
    return normalized;
  });
  const summary = interestedPersonServiceSummary();
  if (summary.total && summary.canSignWaiverCount === summary.total && !summary.requiresNotice) {
    state.opening.waiverStatus = "all_signed";
    state.opening.unknownInterestedPersonsStatus = "none";
  }
  saveState();
  renderInterestedPersons();
  renderReview();
  renderInterview();
}

function guidedInterestedServiceComplete() {
  const summary = interestedPersonServiceSummary();
  return summary.total > 0 && summary.unansweredWaiverCount === 0;
}

function guidedInterestedServiceMessage() {
  const summary = interestedPersonServiceSummary();
  if (!summary.total) return "Add interested persons before answering waiver and service questions.";
  if (summary.unansweredWaiverCount) return `${summary.unansweredWaiverCount} interested person${summary.unansweredWaiverCount === 1 ? "" : "s"} still need a waiver-status answer.`;
  if (summary.missingAddressCount) return `${summary.missingAddressCount} interested person${summary.missingAddressCount === 1 ? "" : "s"} still need address/location review.`;
  return "";
}

function renderGuidedInterestedPersons() {
  if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
  syncInterestedPersonRoster({ addMissing: false });
  const suggestions = interestedPersonSuggestions();
  const missingSuggestions = suggestions.filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0);
  const addPersonFromBottom = () => {
    state.interestedPersons.push(emptyInterestedPerson());
    saveState();
    renderInterestedPersons();
    renderReview();
    renderInterview();
  };
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-toolbar">
      <span class="badge">${state.interestedPersons.filter(hasInterestedPersonContent).length} listed</span>
      <button type="button" class="secondary" data-sync-guided-combined-interested>Sync roster and service flags</button>
      <button type="button" class="secondary" data-add-all-guided-suggestions ${missingSuggestions.length ? "" : "disabled"}>Add all suggestions</button>
      <button type="button" class="secondary" data-add-guided-person>Add person</button>
    </div>
    <div class="guided-suggestions">
      ${suggestions.length ? suggestions.map((suggestion, index) => {
        const existingIndex = existingInterestedPersonIndex(suggestion.name);
        return `
          <div class="suggestion-card">
            <div>
              <h3>${escapeHtml(suggestion.name)}</h3>
              <p>${escapeHtml(suggestion.relationship || "Interested person")}</p>
              <span>${escapeHtml(suggestion.address || "Address needed")}</span>
            </div>
            <div class="suggestion-actions">
              <span class="badge ${existingIndex >= 0 ? "" : "warn"}">${existingIndex >= 0 ? "Added" : suggestion.source || "Suggested"}</span>
              <button type="button" class="secondary" data-add-guided-suggestion="${index}" ${existingIndex >= 0 ? "disabled" : ""}>${existingIndex >= 0 ? "Added" : "Add"}</button>
            </div>
          </div>
        `;
      }).join("") : `
        <div class="suggestion-empty">Answer will and heirship questions to build suggested interested persons.</div>
      `}
    </div>
    <div class="guided-card-list">
      ${state.interestedPersons.map((person, index) => guidedInterestedPersonCardHtml(normalizeInterestedPerson(person), index)).join("")}
    </div>
    <div class="list-bottom-actions">
      <button type="button" class="secondary" data-add-guided-person-bottom>Add person</button>
    </div>
  `;
  bindPartyPickers(wrapper);
  bindGuidedPathInputs(wrapper);
  bindGuidedInterestedRoleInputs(wrapper);
  wrapper.querySelector("[data-add-all-guided-suggestions]")?.addEventListener("click", () => {
    addAllInterestedPersonSuggestions();
    renderInterview();
  });
  wrapper.querySelector("[data-sync-guided-combined-interested]")?.addEventListener("click", () => {
    syncInterestedRosterAndRefresh(true);
  });
  wrapper.querySelectorAll("[data-add-guided-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      addInterestedPersonSuggestion(suggestions[Number(button.dataset.addGuidedSuggestion)]);
      renderInterview();
    });
  });
  wrapper.querySelector("[data-add-guided-person]")?.addEventListener("click", addPersonFromBottom);
  wrapper.querySelector("[data-add-guided-person-bottom]")?.addEventListener("click", addPersonFromBottom);
  wrapper.querySelectorAll("[data-remove-guided-person]").forEach((button) => {
    button.addEventListener("click", () => {
      state.interestedPersons.splice(Number(button.dataset.removeGuidedPerson), 1);
      if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
      saveState();
      renderInterestedPersons();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function guidedInterestedPersonCardHtml(person, index) {
  return `
    <div class="guided-person-card">
      <div class="row-heading">
        <h3>Interested person ${index + 1}</h3>
        <button type="button" class="ghost" data-remove-guided-person="${index}">Remove</button>
      </div>
      ${partyPickerHtml("interestedPerson", index)}
      <div class="grid two compact">
        <label>Name
          <input data-guided-path="interestedPersons.${index}.name" value="${escapeAttr(person.name)}" />
        </label>
        <label>Relationship or role
          <input data-guided-path="interestedPersons.${index}.relationship" value="${escapeAttr(person.relationship)}" placeholder="Heir, beneficiary, fiduciary" />
        </label>
        <label>Mailing address
          <input data-guided-path="interestedPersons.${index}.address" value="${escapeAttr(person.address)}" />
        </label>
        <label>Minor date of birth
          <input type="date" data-guided-path="interestedPersons.${index}.minorDateOfBirth" value="${escapeAttr(person.minorDateOfBirth)}" />
        </label>
        <label>Email
          <input type="email" data-guided-path="interestedPersons.${index}.email" value="${escapeAttr(person.email)}" />
        </label>
        <label>Phone
          <input type="tel" data-guided-path="interestedPersons.${index}.phone" value="${escapeAttr(person.phone)}" />
        </label>
      </div>
      <div class="role-grid">
        ${guidedRoleCheckboxHtml(index, "heir", "Heir")}
        ${guidedRoleCheckboxHtml(index, "beneficiary", "Will beneficiary")}
        ${guidedRoleCheckboxHtml(index, "namedPr", "Named PR")}
        ${guidedRoleCheckboxHtml(index, "trustee", "Trustee")}
        ${guidedRoleCheckboxHtml(index, "trustBeneficiary", "Trust beneficiary")}
        ${guidedRoleCheckboxHtml(index, "minor", "Minor")}
        ${guidedRoleCheckboxHtml(index, "needsGuardian", "Guardian/agent info needed")}
        ${guidedRoleCheckboxHtml(index, "military", "Military service")}
      </div>
      <div class="service-status-box">
        <div class="row-heading compact-heading">
          <h4>Waiver and service</h4>
          ${serviceStatusBadgesHtml(person)}
        </div>
        <div class="grid two compact">
          <label>Waiver status
            <select data-guided-path="interestedPersons.${index}.service.waiverStatus">
              ${waiverStatusOptionsHtml(person.service?.waiverStatus || "")}
            </select>
          </label>
          <label>Address/location status
            <select data-guided-path="interestedPersons.${index}.service.locationStatus">
              ${locationStatusOptionsHtml(person.service?.locationStatus || "known")}
            </select>
          </label>
        </div>
        <div class="inline-checks compact-checks">
          <label class="checkline">
            <input type="checkbox" data-guided-path="interestedPersons.${index}.service.needsMailedNotice" ${person.service?.needsMailedNotice ? "checked" : ""} />
            Needs mailed notice
          </label>
          <label class="checkline">
            <input type="checkbox" data-guided-path="interestedPersons.${index}.service.protectedPerson" ${person.service?.protectedPerson ? "checked" : ""} />
            Minor/protected-person review
          </label>
        </div>
      </div>
    </div>
  `;
}

function guidedInterestedPersonDetailsCardHtml(person, index, displayIndex = index) {
  const displayName = cleanText(person.name) || `Interested person ${displayIndex + 1}`;
  return `
    <div class="guided-person-card repeated-card">
      <div class="repeat-card-header">
        <div class="repeat-card-title">
          <span class="card-number-badge">Person ${displayIndex + 1}</span>
          <h3>${escapeHtml(displayName)}</h3>
          <span class="repeat-card-subtitle">${escapeHtml(interestedRelationship(person) || "Role needed")}</span>
        </div>
        <button type="button" class="ghost" data-remove-guided-person="${index}">Remove</button>
      </div>
      <div class="repeat-card-body">
        ${partyPickerHtml("interestedPerson", index)}
        <div class="grid two compact">
          <label>Name
            <input data-guided-path="interestedPersons.${index}.name" value="${escapeAttr(person.name)}" />
          </label>
          <label>Relationship or role
            <input data-guided-path="interestedPersons.${index}.relationship" value="${escapeAttr(person.relationship)}" placeholder="Heir, beneficiary, fiduciary" />
          </label>
          <label>Mailing address
            <input data-guided-path="interestedPersons.${index}.address" value="${escapeAttr(person.address)}" />
          </label>
          <label>Minor date of birth
            <input type="date" data-guided-path="interestedPersons.${index}.minorDateOfBirth" value="${escapeAttr(person.minorDateOfBirth)}" />
          </label>
          <label>Email
            <input type="email" data-guided-path="interestedPersons.${index}.email" value="${escapeAttr(person.email)}" />
          </label>
          <label>Phone
            <input type="tel" data-guided-path="interestedPersons.${index}.phone" value="${escapeAttr(person.phone)}" />
          </label>
        </div>
        <div class="role-grid">
          ${guidedRoleCheckboxHtml(index, "heir", "Heir")}
          ${guidedRoleCheckboxHtml(index, "beneficiary", "Will beneficiary")}
          ${guidedRoleCheckboxHtml(index, "namedPr", "Named PR")}
          ${guidedRoleCheckboxHtml(index, "trustee", "Trustee")}
          ${guidedRoleCheckboxHtml(index, "trustBeneficiary", "Trust beneficiary")}
          ${guidedRoleCheckboxHtml(index, "minor", "Minor")}
          ${guidedRoleCheckboxHtml(index, "needsGuardian", "Guardian/agent info needed")}
          ${guidedRoleCheckboxHtml(index, "military", "Military service")}
        </div>
      </div>
    </div>
  `;
}

function guidedInterestedServiceCardHtml(person, index) {
  const status = interestedPersonServiceStatus(person);
  const displayName = cleanText(person.name) || `Interested person ${index + 1}`;
  return `
    <div class="guided-person-card ${status.needsAttention ? "warn" : ""}">
      <div class="row-heading compact-heading">
        <div>
          <h3>${escapeHtml(displayName)}</h3>
          <p>${escapeHtml(interestedRelationship(person) || "Interested person")}</p>
          <p>${escapeHtml(person.address || "Address needed")}</p>
        </div>
        ${serviceStatusBadgesHtml(person)}
      </div>
      <div class="grid two compact">
        <label>Waiver status
          <select class="decision-select" data-guided-path="interestedPersons.${index}.service.waiverStatus">
            ${waiverStatusOptionsHtml(person.service?.waiverStatus || "")}
          </select>
        </label>
        <label>Address/location status
          <select class="decision-select" data-guided-path="interestedPersons.${index}.service.locationStatus">
            ${locationStatusOptionsHtml(person.service?.locationStatus || "known")}
          </select>
        </label>
      </div>
      <div class="inline-checks compact-checks">
        <label class="checkline">
          <input type="checkbox" data-guided-path="interestedPersons.${index}.service.needsMailedNotice" ${person.service?.needsMailedNotice ? "checked" : ""} />
          Needs mailed notice
        </label>
        <label class="checkline">
          <input type="checkbox" data-guided-path="interestedPersons.${index}.service.protectedPerson" ${person.service?.protectedPerson ? "checked" : ""} />
          Minor/protected-person review
        </label>
      </div>
      ${status.reasons.length ? `
        <details class="compact-help service-reasons">
          <summary>Why this status?</summary>
          <div class="source-chip-list">
            ${status.reasons.slice(0, 6).map((reason) => `<span class="source-chip">${escapeHtml(reason)}</span>`).join("")}
          </div>
        </details>
      ` : ""}
    </div>
  `;
}

function bindGuidedInterestedRemoveButtons(root) {
  root.querySelectorAll("[data-remove-guided-person]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeGuidedPerson);
      state.interestedPersons.splice(index, 1);
      if (activeInterestedDraftIndex() === index) state.ui.activeInterestedDraftIndex = "";
      if (!state.interestedPersons.length) state.interestedPersons.push(emptyInterestedPerson());
      saveState();
      renderInterestedPersons();
      renderReview();
      renderInterview();
    });
  });
}

function guidedRoleCheckboxHtml(index, role, label) {
  const person = normalizeInterestedPerson(state.interestedPersons[index]);
  return `
    <label class="checkline role-check">
      <input type="checkbox" data-guided-person-role="${role}" data-guided-person-index="${index}" ${person.roles[role] ? "checked" : ""} />
      ${label}
    </label>
  `;
}

function bindGuidedInterestedRoleInputs(root) {
  root.querySelectorAll("[data-guided-person-role]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.dataset.guidedPersonIndex);
      const key = input.dataset.guidedPersonRole;
      state.interestedPersons[index] = normalizeInterestedPerson(state.interestedPersons[index]);
      state.interestedPersons[index].roles[key] = input.checked;
      saveState();
      renderInterestedPersons();
      renderReview();
      renderInterviewStatus();
    });
  });
}

function bindGuidedPathInputs(root) {
  applyAddressPlaceholders(root);
  root.querySelectorAll("[data-guided-path]").forEach((input) => {
    const update = (rerender = false) => {
      const path = input.dataset.guidedPath;
      const value = input.type === "checkbox" ? input.checked : input.value;
      setPath(path, value);
      if ((path === "pr.sameAsApplicant" || path.startsWith("applicant.")) && state.pr.sameAsApplicant) {
        syncApplicantToPr();
      }
      if (path.startsWith("countyDefaults.")) {
        applyCountyDefaults({ force: true });
      } else if (path === "estate.county") {
        syncCountyDefaultsFromCounty();
      }
      if (path === "pathRouter.grossValue") {
        state.estate.estimatedGrossValue = value;
        state.estate.estimatedNetValue = value;
      }
      if (path === "estate.estimatedGrossValue") {
        state.pathRouter.grossValue = value;
        state.estate.estimatedNetValue = value;
      }
      if (path.startsWith("interestedPersons.")) {
        renderInterestedPersons();
        if (path.includes(".service.")) {
          renderInterview();
        }
      }
      if (path.startsWith("benefits.")) {
        renderFields();
        renderReview();
        if (path === "benefits.lackInfo") {
          renderInterview();
          return;
        }
      }
      if (path.startsWith("willBeneficiaries.")) {
        renderWillBeneficiaries();
        renderInterestedSuggestions();
      }
      if (path.startsWith("heirship.children.")) {
        syncHeirshipChildrenList();
        renderHeirshipChildren();
        renderInterestedSuggestions();
      }
      if (path.startsWith("inventory.")) {
        renderInventoryItems();
        renderInventoryTotals();
        updateGuidedInventoryTotals();
      }
      if (path.startsWith("deadlines.")) {
        renderTaskTracker();
        if (path === "deadlines.lettersIssuedDate") {
          renderFields();
          renderReview();
          renderInterview();
          return;
        }
      }
      refreshPeopleSuggestionsForPath(path);
      renderFields();
      renderReview();
      if (rerender) {
        renderInterview();
      } else {
        renderInterviewStatus();
      }
    };
    input.addEventListener("input", () => update(false));
    if (input.tagName === "SELECT" || input.type === "checkbox") {
      input.addEventListener("change", () => update(false));
    }
  });
}

function addressContactStatus() {
  const items = addressContactItems();
  return {
    total: items.length,
    missingRequired: items.filter((item) => item.missingAddress).length,
    missingHelpful: items.filter((item) => item.missingContact).length
  };
}

function addressContactItems() {
  const items = [];
  addAddressContactItem(items, {
    key: "applicant",
    title: "Applicant",
    name: state.applicant.fullName || "Applicant",
    detail: state.applicant.capacity,
    addressPath: "applicant.address",
    emailPath: "applicant.email",
    phonePath: "applicant.phone",
    requiredAddress: true,
    contactRecommended: true
  });
  if (!state.pr.sameAsApplicant) {
    addAddressContactItem(items, {
      key: "pr",
      title: "Proposed Personal Representative",
      name: state.pr.fullName || "Proposed Personal Representative",
      detail: state.pr.isWisconsinResident === "no" ? "Nonresident PR" : "Proposed PR",
      addressPath: "pr.address",
      emailPath: "pr.email",
      phonePath: "pr.phone",
      requiredAddress: true,
      contactRecommended: true
    });
  }
  if (state.pr.isWisconsinResident === "no") {
    addAddressContactItem(items, {
      key: "resident-agent",
      title: "Wisconsin Resident Agent",
      name: state.pr.residentAgent.name || "Resident agent",
      detail: "Required for a nonresident PR",
      addressPath: "pr.residentAgent.address",
      emailPath: "pr.residentAgent.email",
      phonePath: "pr.residentAgent.phone",
      requiredAddress: true,
      contactRecommended: true
    });
  }
  addAddressContactItem(items, {
    key: "informant",
    title: "Proof of Heirship Informant",
    name: state.heirship.informant.name || "Heirship informant",
    detail: state.heirship.informant.relationship,
    addressPath: "heirship.informant.address",
    requiredAddress: true
  });
  if (state.will.exists === "yes" && state.will.hasNamedBeneficiaries === "yes") {
    state.willBeneficiaries.forEach((person, index) => {
      if (!hasWillBeneficiaryContent(person)) return;
      addAddressContactItem(items, {
        key: `will-beneficiary-${index}`,
        title: beneficiaryRoleLabel(person.role),
        name: person.name || `Named person ${index + 1}`,
        detail: person.relationship,
        addressPath: `willBeneficiaries.${index}.address`,
        requiredAddress: true
      });
    });
  }
  state.interestedPersons.forEach((person, index) => {
    if (!hasInterestedPersonContent(person)) return;
    addAddressContactItem(items, {
      key: `interested-${index}`,
      title: "Interested Person",
      name: person.name || `Interested person ${index + 1}`,
      detail: interestedRelationship(person),
      addressPath: `interestedPersons.${index}.address`,
      emailPath: `interestedPersons.${index}.email`,
      phonePath: `interestedPersons.${index}.phone`,
      requiredAddress: true,
      contactRecommended: true
    });
  });
  return items;
}

function addAddressContactItem(items, item) {
  const address = item.addressPath ? getPath(item.addressPath) : "";
  const email = item.emailPath ? getPath(item.emailPath) : "";
  const phone = item.phonePath ? getPath(item.phonePath) : "";
  items.push({
    ...item,
    address,
    email,
    phone,
    missingAddress: Boolean(item.requiredAddress && !hasValue(address)),
    missingContact: Boolean(item.contactRecommended && !hasValue(email) && !hasValue(phone)),
    suggestedAddress: !hasValue(address) ? knownAddressForName(item.name, item.addressPath) : ""
  });
}

function knownAddressForName(name, excludePath = "") {
  if (!hasValue(name)) return "";
  const sources = [
    { name: state.applicant.fullName, address: state.applicant.address, path: "applicant.address" },
    { name: state.pr.fullName, address: state.pr.address, path: "pr.address" },
    { name: state.pr.residentAgent.name, address: state.pr.residentAgent.address, path: "pr.residentAgent.address" },
    { name: state.heirship.informant.name, address: state.heirship.informant.address, path: "heirship.informant.address" }
  ];
  if (state.will.exists === "yes" && state.will.hasNamedBeneficiaries === "yes") {
    state.willBeneficiaries.forEach((person, index) => {
      sources.push({ name: person.name, address: person.address, path: `willBeneficiaries.${index}.address` });
    });
  }
  state.interestedPersons.forEach((person, index) => {
    sources.push({ name: person.name, address: person.address, path: `interestedPersons.${index}.address` });
  });
  const match = sources.find((source) => source.path !== excludePath && hasValue(source.address) && sameName(source.name, name));
  return match ? match.address : "";
}

function renderAddressContactReview() {
  const items = addressContactItems();
  const missing = items.filter((item) => item.missingAddress || item.missingContact);
  const complete = items.filter((item) => !item.missingAddress && !item.missingContact);
  const status = addressContactStatus();
  const shown = [...missing, ...complete];
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="contact-status-grid">
      <div class="contact-stat ${status.missingRequired ? "bad" : ""}">
        <span>${status.missingRequired}</span>
        <p>Required addresses missing</p>
      </div>
      <div class="contact-stat ${status.missingHelpful ? "warn" : ""}">
        <span>${status.missingHelpful}</span>
        <p>Optional contacts missing</p>
      </div>
    </div>
    <div class="guided-card-list">
      ${shown.length ? shown.map(addressContactCardHtml).join("") : `
        <div class="interview-complete">
          <h3>No contacts yet</h3>
          <p>Add interested persons first, then this screen will collect addresses for them.</p>
        </div>
      `}
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelectorAll("[data-fill-known-address]").forEach((button) => {
    button.addEventListener("click", () => {
      setPath(button.dataset.fillKnownAddress, button.dataset.fillKnownValue || "");
      saveState();
      renderFields();
      renderInterestedPersons();
      renderWillBeneficiaries();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function addressContactCardHtml(item) {
  const statusClass = item.missingAddress ? "bad" : item.missingContact ? "warn" : "";
  const statusText = item.missingAddress ? "Address needed" : item.missingContact ? "Phone or email helpful" : "Complete";
  return `
    <div class="guided-person-card contact-card ${statusClass}">
      <div class="row-heading">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(relationshipText([item.title, item.detail]))}</p>
        </div>
        <span class="badge ${statusClass}">${statusText}</span>
      </div>
      <div class="grid two compact">
        <label>Mailing address
          <input data-guided-path="${escapeAttr(item.addressPath)}" value="${escapeAttr(item.address)}" />
        </label>
        ${item.emailPath ? `
          <label>Email
            <input type="email" data-guided-path="${escapeAttr(item.emailPath)}" value="${escapeAttr(item.email)}" />
          </label>
        ` : ""}
        ${item.phonePath ? `
          <label>Phone
            <input type="tel" data-guided-path="${escapeAttr(item.phonePath)}" value="${escapeAttr(item.phone)}" />
          </label>
        ` : ""}
      </div>
      ${item.suggestedAddress ? `
        <button type="button" class="secondary mini-action" data-fill-known-address="${escapeAttr(item.addressPath)}" data-fill-known-value="${escapeAttr(item.suggestedAddress)}">Use known address</button>
      ` : ""}
    </div>
  `;
}

function syncCountyDefaultsFromCounty() {
  let changed = false;
  const libraryDefault = countyLibraryDefault(state.estate.county);
  const countyChanged = hasValue(state.estate.county) && countyKey(state.countyDefaults.courthouseCounty) !== countyKey(state.estate.county);
  if (hasValue(state.estate.county) && (!hasValue(state.countyDefaults.courthouseCounty) || countyChanged)) {
    state.countyDefaults.courthouseCounty = state.estate.county;
    changed = true;
  }
  if (libraryDefault) {
    for (const key of ["courthouseCounty", "courthouseAddress", "room", "probateOfficeName", "registrarName", "newspaperName", "accommodationPhone", "localNotes"]) {
      const value = libraryDefault[key] || "";
      if ((countyChanged || !hasValue(state.countyDefaults[key])) && state.countyDefaults[key] !== value) {
        state.countyDefaults[key] = value;
        changed = true;
      }
    }
    if (state.countyDefaults.lastVerified !== libraryDefault.lastVerified) {
      state.countyDefaults.lastVerified = libraryDefault.lastVerified;
      changed = true;
    }
    const sourceUrl = libraryDefault.sources?.[0]?.url || "";
    if (state.countyDefaults.sourceUrl !== sourceUrl) {
      state.countyDefaults.sourceUrl = sourceUrl;
      changed = true;
    }
  }
  if (countyChanged && !hasValue(state.countyDefaults.newspaperName)) {
    if (hasValue(state.notice1804.newspaperName)) {
      state.notice1804.newspaperName = "";
      changed = true;
    }
    if (hasValue(state.notice1805.newspaperName)) {
      state.notice1805.newspaperName = "";
      changed = true;
    }
  }
  applyCountyDefaults({ force: countyChanged, persist: false });
  if (changed) saveState();
}

function countyKey(value) {
  return cleanText(value).replace(/\s+county$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function countyLibraryDefault(countyName) {
  if (!hasValue(countyName) || typeof window === "undefined" || !window.WI_COUNTY_DEFAULTS) return null;
  return window.WI_COUNTY_DEFAULTS[countyKey(countyName)] || null;
}

function countyDefaultsStatus() {
  const requiredMissing = [
    state.countyDefaults.courthouseCounty || state.estate.county,
    state.countyDefaults.courthouseAddress
  ].filter((value) => !hasValue(value)).length;
  const helpfulMissing = [
    state.countyDefaults.probateOfficeName,
    state.countyDefaults.registrarName,
    state.countyDefaults.newspaperName
  ].filter((value) => !hasValue(value)).length;
  return { requiredMissing, helpfulMissing };
}

function countyDefaultsMessage() {
  const status = countyDefaultsStatus();
  if (status.requiredMissing) return "Add the courthouse county/name and courthouse address before relying on PR-1804 or PR-1805.";
  if (status.helpfulMissing) return "Court address is ready. Probate office, registrar, and publication newspaper can still be added if known.";
  return "";
}

function applyCountyDefaults(options = {}) {
  const force = Boolean(options.force);
  const defaults = state.countyDefaults || {};
  const courthouseCounty = defaults.courthouseCounty || state.estate.county;
  const newspaper = defaults.newspaperName || state.notice1804.newspaperName || state.notice1805.newspaperName;
  const pairs = [
    ["notice1804.courthouseCounty", courthouseCounty],
    ["notice1804.courthouseAddress", defaults.courthouseAddress],
    ["notice1804.room", defaults.room],
    ["notice1804.newspaperName", newspaper],
    ["notice1805.courthouseCounty", courthouseCounty],
    ["notice1805.courthouseAddress", defaults.courthouseAddress],
    ["notice1805.room", defaults.room],
    ["notice1805.registrarName", defaults.registrarName],
    ["notice1805.accommodationPhone", defaults.accommodationPhone],
    ["notice1805.newspaperName", newspaper]
  ];
  pairs.forEach(([path, value]) => {
    if (!hasValue(value)) return;
    if (force || !hasValue(getPath(path))) {
      setPath(path, value);
    }
  });
  if (options.persist !== false) saveState();
}

function loadCountyLibraryDefault(options = {}) {
  const defaults = countyLibraryDefault(state.estate.county);
  if (!defaults) return false;
  for (const key of ["courthouseCounty", "courthouseAddress", "room", "probateOfficeName", "registrarName", "newspaperName", "accommodationPhone", "localNotes", "lastVerified", "sourceUrl"]) {
    const value = key === "sourceUrl" ? defaults.sources?.[0]?.url : defaults[key];
    if (!hasValue(value)) continue;
    if (options.force || !hasValue(state.countyDefaults[key])) {
      state.countyDefaults[key] = value;
    }
  }
  saveState();
  return true;
}

function renderCountyCourtSetup() {
  syncCountyDefaultsFromCounty();
  const status = countyDefaultsStatus();
  const libraryDefault = countyLibraryDefault(state.estate.county);
  const verified = state.countyDefaults.lastVerified || libraryDefault?.lastVerified || "";
  const defaultStatus = libraryDefault
    ? `Library defaults available. Last verified: ${verified || "not set"}.`
    : "No library defaults found for this county name yet.";
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="contact-status-grid">
      <div class="contact-stat ${status.requiredMissing ? "bad" : ""}">
        <span>${status.requiredMissing}</span>
        <p>Required court defaults missing</p>
      </div>
      <div class="contact-stat ${status.helpfulMissing ? "warn" : ""}">
        <span>${status.helpfulMissing}</span>
        <p>Helpful local details missing</p>
      </div>
    </div>
    <div class="guided-person-card">
      <div class="row-heading">
        <div>
          <h3>${escapeHtml(state.estate.county || "County")} filing defaults</h3>
          <details class="compact-help">
            <summary>County default details</summary>
            <p>These values can fill creditor notice and PR-1805 notice fields when they are blank.</p>
            <p>${escapeHtml(defaultStatus)}</p>
          </details>
        </div>
        <div class="inline-actions">
          <button type="button" class="secondary" data-load-county-library ${libraryDefault ? "" : "disabled"}>Use library defaults</button>
          <button type="button" class="secondary" data-apply-county-defaults>Apply to notice forms</button>
        </div>
      </div>
      <div class="grid two compact">
        <label>Courthouse county/name
          <input data-guided-path="countyDefaults.courthouseCounty" value="${escapeAttr(state.countyDefaults.courthouseCounty || state.estate.county)}" placeholder="Milwaukee" />
        </label>
        <label>Courthouse address
          <input data-guided-path="countyDefaults.courthouseAddress" value="${escapeAttr(state.countyDefaults.courthouseAddress)}" placeholder="Street, city, state, zip" />
        </label>
        <label>Room or branch
          <input data-guided-path="countyDefaults.room" value="${escapeAttr(state.countyDefaults.room)}" />
        </label>
        <label>Probate office
          <input data-guided-path="countyDefaults.probateOfficeName" value="${escapeAttr(state.countyDefaults.probateOfficeName)}" placeholder="Probate Division" />
        </label>
        <label>Probate registrar
          <input data-guided-path="countyDefaults.registrarName" value="${escapeAttr(state.countyDefaults.registrarName)}" />
        </label>
        <label>Publication newspaper
          <input data-guided-path="countyDefaults.newspaperName" value="${escapeAttr(state.countyDefaults.newspaperName)}" />
        </label>
        <label>Accommodation phone
          <input data-guided-path="countyDefaults.accommodationPhone" value="${escapeAttr(state.countyDefaults.accommodationPhone)}" />
        </label>
        <label>Local notes
          <textarea rows="3" data-guided-path="countyDefaults.localNotes">${escapeHtml(state.countyDefaults.localNotes)}</textarea>
        </label>
      </div>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-load-county-library]")?.addEventListener("click", () => {
    loadCountyLibraryDefault({ force: true });
    applyCountyDefaults({ force: true });
    renderFields();
    renderReview();
    renderInterview();
  });
  wrapper.querySelector("[data-apply-county-defaults]")?.addEventListener("click", () => {
    applyCountyDefaults({ force: true });
    renderFields();
    renderReview();
    renderInterview();
  });
  return wrapper;
}

function openingPathInterviewComplete() {
  const serviceSummary = interestedPersonServiceSummary();
  const hasPersonPathAnswers = serviceSummary.total > 0 && serviceSummary.unansweredWaiverCount === 0;
  if (!hasValue(state.opening.waiverStatus) && !hasPersonPathAnswers) return false;
  if (!hasValue(state.opening.unknownInterestedPersonsStatus) && !hasPersonPathAnswers) return false;
  if (openingPathDecision().key === "unknown") return false;
  if (state.opening.waiverStatus === "not_all" && !hasValue(state.opening.noticeReason)) return false;
  if (state.opening.unknownInterestedPersonsStatus === "some_unknown" && !hasValue(state.notice1805.unknownInterestedPersons)) return false;
  return true;
}

function openingPathInterviewMessage() {
  const serviceSummary = interestedPersonServiceSummary();
  const hasPersonPathAnswers = serviceSummary.total > 0 && serviceSummary.unansweredWaiverCount === 0;
  if (!hasValue(state.opening.waiverStatus) && !hasPersonPathAnswers) return "Answer each person's waiver status, or choose whether everyone can sign a waiver.";
  if (!hasValue(state.opening.unknownInterestedPersonsStatus) && !hasPersonPathAnswers) return "Answer whether anyone is unknown or cannot be located.";
  if (state.opening.waiverStatus === "not_all" && !hasValue(state.opening.noticeReason)) return "Choose why the case cannot open entirely on waivers.";
  if (state.opening.unknownInterestedPersonsStatus === "some_unknown" && !hasValue(state.notice1805.unknownInterestedPersons)) return "Describe the unknown or not-located interested persons.";
  const decision = openingPathDecision();
  if (decision.key === "unknown") return decision.detail;
  return "";
}

function packetStatusLabel(status) {
  const labels = {
    included: "Included",
    pending: "Pending",
    later: "Later",
    review: "Review",
    "not-in-path": "Not in this path"
  };
  return labels[status] || "Review";
}

function packetFormLabel(form) {
  return `${form.title}${form.name ? ` ${form.name}` : ""}`;
}

function openingPacketFormDetails(data = state) {
  const decision = openingPathDecision(data);
  const serviceSummary = interestedPersonServiceSummary(data);
  const isWaiver = decision.key === "waiver";
  const isNotice = decision.key === "notice";
  const pathPending = decision.key === "unknown";
  const blocked = decision.key === "blocked_no_will";
  const hasInventory = (data.inventory?.items || []).some(inventoryItemHasContent);
  const details = [
    {
      key: "pr1801",
      title: "PR-1801",
      name: "Application for Informal Administration",
      status: "included",
      reason: "Starts the informal probate case and gives the registrar the core estate, applicant, will, and requested-order facts."
    },
    {
      key: "pr1806",
      title: "PR-1806",
      name: "Proof of Heirship",
      status: "included",
      reason: "Explains the family tree so the court can confirm heirs and interested persons."
    },
    {
      key: "pr1807",
      title: "PR-1807",
      name: "Consent to Serve",
      status: "included",
      reason: "Shows the proposed personal representative accepts appointment and supplies resident-agent information if needed."
    },
    {
      key: "pr1808",
      title: "PR-1808",
      name: "Statement of Informal Administration",
      status: "included",
      reason: "Prepared as a proposed court document for the probate registrar to sign if the application is approved."
    },
    {
      key: "pr1810",
      title: "PR-1810",
      name: "Domiciliary Letters",
      status: "included",
      reason: "Prepared as the proof of authority the personal representative will use after appointment."
    }
  ];

  details.push({
    key: "originalWill",
    title: "Original will/codicil",
    name: "",
    status: data.will.exists === "yes" ? "included" : data.will.exists === "no" ? "not-in-path" : "pending",
    reason: data.will.exists === "yes"
      ? "Because a will or codicil exists, the original instrument belongs in the opening packet."
      : data.will.exists === "no"
        ? "Not included because this is currently marked as a no-will estate."
        : "Will status is not answered yet."
  });

  details.push({
    key: "pr1803",
    title: "PR-1803",
    name: "Waiver and Consent",
    status: isWaiver ? "included" : pathPending ? "pending" : "not-in-path",
    reason: isWaiver
      ? `${serviceSummary.canSignWaiverCount || "All"} interested person(s) can sign waivers, so the case can open without a PR-1805 hearing notice. Waiver mode: ${waiverSignatureModeLabel(data.waiver?.signatureMode)}.`
      : pathPending
        ? "The app needs the waiver/service answers before deciding whether PR-1803 belongs in this packet."
        : "Not included because at least one required waiver is unavailable or the case needs the notice path."
  });

  details.push({
    key: "pr1804",
    title: "PR-1804",
    name: "Notice to Creditors",
    status: isWaiver ? "included" : pathPending ? "pending" : "not-in-path",
    reason: isWaiver
      ? "Used with the waiver opening packet to publish creditor notice and start the claims deadline."
      : pathPending
        ? "Creditor-publication form depends on the selected opening path."
        : "Not included because PR-1805 handles the notice-path publication and claims deadline."
  });

  details.push({
    key: "pr1805",
    title: "PR-1805",
    name: "Notice Setting Time to Hear Application",
    status: isNotice ? "included" : blocked ? "review" : pathPending ? "pending" : "not-in-path",
    reason: isNotice
      ? "Included because at least one waiver is unavailable, a person cannot be located, or mailed/published notice is needed and the estate is marked as a will case."
      : blocked
        ? "This prototype flags a no-will case without all waivers for attorney or probate-office review before generating PR-1805."
        : pathPending
          ? "The app needs the waiver/service answers and will status before deciding whether PR-1805 belongs in this packet."
          : "Not included because all required interested persons can use PR-1803 waivers."
  });

  details.push({
    key: "pr1817",
    title: "PR-1817",
    name: "Declaration of Service",
    status: isNotice || serviceSummary.mailedNoticeCount ? "included" : "later",
    reason: isNotice || serviceSummary.mailedNoticeCount
      ? "Use after PR-1805 or other opening documents are mailed, personally served, or otherwise delivered."
      : "Usually not filed with an all-waiver opening unless some document is separately served."
  });

  details.push({
    key: "pr1811",
    title: "PR-1811",
    name: "Inventory",
    status: hasInventory ? "later" : "pending",
    reason: hasInventory
      ? "Inventory items have been started; PR-1811 is an administration step after appointment, not the core opening packet."
      : "Inventory is due later, after appointment; add assets when ready."
  });

  return details;
}

function openingPacketResults(data = state) {
  const decision = openingPathDecision(data);
  const formDetails = openingPacketFormDetails(data);
  const serviceSummary = interestedPersonServiceSummary(data);
  if (decision.key === "waiver") {
    return {
      tone: "ok",
      title: "Waiver opening packet",
      summary: "Use this when every required interested person can sign PR-1803 and no person-level service answer points to PR-1805.",
      forms: formDetails.filter((item) => item.status === "included").map(packetFormLabel),
      formDetails,
      serviceSummary,
      serve: "Collect signed waivers from all eligible interested persons; keep service notes for anything separately mailed.",
      publish: "Publish PR-1804 Notice to Creditors in the selected newspaper.",
      wait: "Wait for the Probate Registrar to issue the statement and letters, then track the claims deadline."
    };
  }
  if (decision.key === "notice") {
    return {
      tone: "warn",
      title: "PR-1805 notice packet",
      summary: "Use this when there is a will and at least one waiver is unavailable, an interested person cannot be found, or notice/publication is needed.",
      forms: formDetails.filter((item) => item.status === "included").map(packetFormLabel),
      formDetails,
      serviceSummary,
      serve: "Serve PR-1805 and required opening documents on all known interested persons.",
      publish: "Publish PR-1805 in the selected newspaper and keep proof of publication.",
      wait: "Wait for the hearing or objection deadline shown on PR-1805 before letters are issued."
    };
  }
  if (decision.key === "blocked_no_will") {
    return {
      tone: "bad",
      title: "Attorney review needed",
      summary: "A no-will case without all waivers should not use PR-1805 in this prototype.",
      forms: formDetails.filter((item) => item.status === "included").map(packetFormLabel),
      formDetails,
      serviceSummary,
      serve: "Identify whether formal administration or another procedure is required.",
      publish: "Publication should wait until the correct procedure is confirmed.",
      wait: "Pause the DIY flow and review with counsel or the probate office."
    };
  }
  return {
    tone: "warn",
    title: "Packet not chosen yet",
    summary: "Answer the waiver and missing-person questions to choose the correct opening packet.",
    forms: formDetails.filter((item) => item.status === "included").map(packetFormLabel),
    formDetails,
    serviceSummary,
    serve: "Service instructions depend on the opening path.",
    publish: "Publication instructions depend on the opening path.",
    wait: "Waiting steps depend on the opening path."
  };
}

function packetFormSortValue(item) {
  const match = String(item.title || "").match(/PR-(\d{4})/);
  if (match) return Number(match[1]);
  return 9999;
}

function sortedPacketRows(rows) {
  return [...rows].sort((first, second) => {
    const numberSort = packetFormSortValue(first) - packetFormSortValue(second);
    if (numberSort) return numberSort;
    return packetFormLabel(first).localeCompare(packetFormLabel(second));
  });
}

function packetFormRowsHtml(rows) {
  return sortedPacketRows(rows).map((item) => `
    <div class="packet-form-row ${escapeAttr(item.status)}">
      <div>
        <h4>${escapeHtml(packetFormLabel(item))}</h4>
        <p>${escapeHtml(item.reason)}</p>
      </div>
      <span class="badge ${item.status === "review" || item.status === "pending" || item.status === "later" ? "warn" : item.status === "not-in-path" ? "bad" : ""}">${escapeHtml(packetStatusLabel(item.status))}</span>
    </div>
  `).join("");
}

function packetServiceSummaryHtml(summary) {
  if (!summary.total) {
    return `<p class="helper-text">No interested persons have been added yet. Add heirs, beneficiaries, trustees, and other required parties so the app can choose the packet more accurately.</p>`;
  }
  const stats = [
    [`${summary.canSignWaiverCount}/${summary.total}`, "can sign waiver"],
    [`${summary.mailedNoticeCount}`, "need mailed notice"],
    [`${summary.unknownOrMissingCount}`, "unknown/not located"],
    [`${summary.protectedCount}`, "minor/protected"],
    [`${summary.missingAddressCount}`, "address issue"]
  ];
  const rows = summary.statuses.slice(0, 6).map((status, index) => {
    const name = cleanText(status.person.name) || `Person ${index + 1}`;
    const flags = status.reasons.length ? status.reasons.slice(0, 4).join("; ") : "No service issues flagged";
    return `
      <div class="packet-person-row">
        <strong>${escapeHtml(name)}</strong>
        <span>${escapeHtml(flags)}</span>
      </div>
    `;
  }).join("");
  const extra = summary.statuses.length > 6 ? `<p class="helper-text">${summary.statuses.length - 6} additional interested person(s) are included in the full list.</p>` : "";
  return `
    <div class="packet-stat-grid">
      ${stats.map(([value, label]) => `
        <div class="packet-stat">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("")}
    </div>
    <div class="packet-person-list">${rows}</div>
    ${extra}
  `;
}

function openingPacketContentHtml(result) {
  const included = result.formDetails.filter((item) => item.status === "included");
  const other = result.formDetails.filter((item) => item.status !== "included");
  return `
    <h3>${escapeHtml(result.title)}</h3>
    <p>${escapeHtml(result.summary)}</p>
    <div class="packet-review-block">
      <h4>Your packet includes</h4>
      <div class="packet-form-list">
        ${packetFormRowsHtml(included)}
      </div>
    </div>
    <div class="packet-result-grid">
      <div>
        <h4>Waiver and service check</h4>
        ${packetServiceSummaryHtml(result.serviceSummary)}
      </div>
      <div>
        <h4>Serve</h4>
        <p>${escapeHtml(result.serve)}</p>
        <h4>Publish</h4>
        <p>${escapeHtml(result.publish)}</p>
        <h4>Wait</h4>
        <p>${escapeHtml(result.wait)}</p>
      </div>
    </div>
    ${other.length ? `
      <details class="packet-other-forms">
        <summary>Other forms checked by this review</summary>
        <div class="packet-form-list compact">
          ${packetFormRowsHtml(other)}
        </div>
      </details>
    ` : ""}
  `;
}

function openingPacketResultsHtml(data = state) {
  const result = openingPacketResults(data);
  return `
    <div class="path-card ${result.tone === "bad" ? "bad" : result.tone === "warn" ? "warn" : ""}">
      ${openingPacketContentHtml(result)}
    </div>
  `;
}

function openingFilingRoomHtml(readiness, result) {
  const groups = openingFilingGroups(result);
  return `
    <div class="filing-room">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Final opening review</p>
          <h3>${readiness.ready ? "Ready to print and file" : "Needs review before filing"}</h3>
        </div>
        <span class="badge ${readiness.ready ? "" : "warn"}">${readiness.ready ? "Ready" : "Needs info"}</span>
      </div>
      <div class="filing-room-grid">
        ${groups.map((group) => `
          <section class="filing-room-panel">
            <h4>${escapeHtml(group.title)}</h4>
            <ul>
              ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function openingFilingGroups(result) {
  const decision = openingPathDecision();
  const includedForms = result.formDetails
    .filter((item) => item.status === "included" && item.key !== "pr1811")
    .map(packetFormLabel);
  const serviceSummary = result.serviceSummary || interestedPersonServiceSummary();
  const waiverNames = serviceSummary.statuses
    .filter((status) => status.canSignWaiver || decision.key === "waiver")
    .map((status) => cleanText(status.person.name))
    .filter(Boolean);
  const serviceNames = serviceSummary.statuses
    .filter((status) => decision.key === "notice" || status.needsMailedNotice || status.unknownOrMissing)
    .map((status) => cleanText(status.person.name))
    .filter(Boolean);
  const signItems = [
    `${state.applicant.fullName || "Applicant"} signs PR-1801 Application.`,
    `${state.heirship.informant.name || "Heirship informant"} signs PR-1806 Proof of Heirship.`,
    `${state.pr.fullName || "Proposed Personal Representative"} signs PR-1807 Consent to Serve.`
  ];
  if (decision.key === "waiver") {
    signItems.push(waiverNames.length ? `PR-1803 waiver signer(s): ${waiverNames.join("; ")}.` : "Collect PR-1803 waivers from all required interested persons.");
    signItems.push(`Waiver format: ${waiverSignatureModeLabel()}.`);
  } else if (decision.key === "notice") {
    signItems.push("PR-1805 notice path: waivers are not required from every interested person before filing.");
  }
  if (state.will.exists === "yes") signItems.push("Include the original will and any codicils, or confirm the court-accepted substitute.");
  signItems.push("Leave PR-1808 and PR-1810 unsigned unless the court instructs otherwise; they are prepared for the Probate Registrar or court process.");

  return [
    {
      title: "Sign",
      items: signItems
    },
    {
      title: "File",
      items: includedForms.length ? includedForms : ["Finish the opening-path answers before relying on the filing list."]
    },
    {
      title: "Serve / Mail",
      items: decision.key === "waiver"
        ? [
          "Keep each signed PR-1803 with the opening packet.",
          "If using one shared waiver, keep the fully signed shared form. If using individual waivers, keep every individual signed waiver.",
          "If any opening documents are mailed separately instead of signed or waived, generate PR-1817 to document service."
        ]
        : [
          serviceNames.length ? `Serve known interested person(s): ${serviceNames.join("; ")}.` : "Serve PR-1805 and required opening documents on all known interested persons.",
          "Use the mailing address and service status shown for each interested person.",
          "Use PR-1817 to document the served opening documents."
        ]
    },
    {
      title: "Publish",
      items: [
        result.publish,
        `Newspaper: ${publicationNewspaperForDecision() || "Confirm county publication newspaper before filing."}`
      ]
    },
    {
      title: "Wait",
      items: [
        result.wait,
        "Save the proof of publication and any filed proof of service.",
        "Do not make final distributions before reviewing the creditor claim deadline and any court requirements."
      ]
    },
    {
      title: "After letters issue",
      items: [
        "Enter the letters-issued date, claim deadline, and inventory due date in the app.",
        "Use PR-1810 Domiciliary Letters as proof of authority when dealing with banks, DMV, real estate, and other asset holders.",
        "Start or update PR-1811 Inventory and file it by the inventory deadline.",
        "Keep receipts, releases, sale documents, claim information, and accounting records for the later estate account or closing."
      ]
    }
  ];
}

function publicationNewspaperForDecision() {
  const decision = openingPathDecision();
  if (decision.key === "notice") return state.notice1805.newspaperName || state.countyDefaults.newspaperName;
  return state.notice1804.newspaperName || state.countyDefaults.newspaperName;
}

function isCourtSuppliedOpeningWarning(message) {
  return /case number|assigned case number|hearing date|hearing time|claim deadline|Probate Registrar|court-supplied|supplied by the court|exact time/i.test(message);
}

function isRoutineOpeningAdminBlank(message) {
  return /PR-1804 claim deadline is usually supplied by the Probate Registrar|PR-1808 usually needs the assigned case number|PR-1810 usually needs the assigned case number|PR-1811 usually needs the assigned case number/i.test(message);
}

function openingReadinessFormRows(readiness) {
  return readiness.checks.map(([label, review]) => {
    const blockers = review.blockers || [];
    const warnings = (review.warnings || []).filter((warning) => !isRoutineOpeningAdminBlank(warning));
    const courtSupplied = warnings.filter(isCourtSuppliedOpeningWarning);
    const reviewWarnings = warnings.filter((warning) => !isCourtSuppliedOpeningWarning(warning));
    return {
      label,
      blockers,
      courtSupplied,
      reviewWarnings,
      status: blockers.length ? "needs-info" : reviewWarnings.length ? "review" : courtSupplied.length ? "court" : "ready"
    };
  });
}

function openingReadinessStatusLabel(status) {
  const labels = {
    "needs-info": "Needs info",
    review: "Review",
    court: "Court/county info",
    ready: "Ready"
  };
  return labels[status] || "Review";
}

function openingDocumentReadiness() {
  const decision = openingPathDecision();
  const decisionReady = decision.key === "waiver" || decision.key === "notice";
  const checks = [
    ["PR-1801", validate()],
    ["PR-1806", validate1806()],
    ["PR-1807", validate1807()],
    ["PR-1808", validate1808()],
    ["PR-1810", validate1810()]
  ];
  if (decision.key === "waiver") {
    checks.push(["PR-1803", validate1803()], ["PR-1804", validate1804()]);
  } else if (decision.key === "notice") {
    checks.push(["PR-1805", validate1805()]);
  }
  const blockers = [];
  const warnings = [];
  if (!decisionReady) blockers.push(decision.detail);
  if (!openingPathInterviewComplete()) blockers.push(openingPathInterviewMessage() || "Complete the waiver/notice path before relying on the opening packet.");
  const sourceReviewMessage = interestedPersonSourceReviewMessage();
  if (sourceReviewMessage) blockers.push(sourceReviewMessage);
  const addressReviewMessage = addressContactReviewMessage();
  if (addressContactStatus().missingRequired && addressReviewMessage) blockers.push(addressReviewMessage);
  checks.forEach(([label, review]) => {
    review.blockers.forEach((text) => blockers.push(`${label}: ${text}`));
    review.warnings.forEach((text) => {
      const issueText = `${label}: ${text}`;
      if (!isRoutineOpeningAdminBlank(issueText)) warnings.push(issueText);
    });
  });
  const uniqueBlockers = uniqueMessages(blockers);
  const uniqueWarnings = uniqueMessages(warnings);
  const courtSupplied = uniqueWarnings.filter(isCourtSuppliedOpeningWarning);
  const reviewWarnings = uniqueWarnings.filter((warning) => !isCourtSuppliedOpeningWarning(warning));
  const formRows = openingReadinessFormRows({ checks });
  return {
    decision,
    ready: decisionReady && openingPathInterviewComplete() && uniqueBlockers.length === 0,
    blockers: uniqueBlockers,
    warnings: uniqueWarnings,
    courtSupplied,
    reviewWarnings,
    formRows,
    checks
  };
}

function uniqueMessages(messages) {
  const unique = [];
  messages.map(cleanText).filter(Boolean).forEach((message) => {
    if (!unique.some((existing) => comparableText(existing) === comparableText(message))) unique.push(message);
  });
  return unique;
}

function openingDocumentReadinessMessage() {
  const readiness = openingDocumentReadiness();
  if (readiness.ready) return "";
  if (readiness.blockers.length) return readiness.blockers[0];
  return "Review the opening documents before printing or filing.";
}

function openingReadinessDashboardHtml(readiness, result) {
  const includedCount = result.formDetails.filter((item) => item.status === "included" && item.key !== "pr1811").length;
  const stats = [
    [readiness.ready ? "Ready" : "Needs info", "packet status", readiness.ready ? "" : "warn"],
    [String(includedCount), "opening forms", ""],
    [String(readiness.blockers.length), "must-fix items", readiness.blockers.length ? "bad" : ""],
    [String(readiness.courtSupplied.length), "court/county blanks", readiness.courtSupplied.length ? "warn" : ""],
    [String(readiness.reviewWarnings.length), "review notes", readiness.reviewWarnings.length ? "warn" : ""]
  ];
  return `
    <div class="readiness-dashboard">
      ${stats.map(([value, label, tone]) => `
        <div class="readiness-stat ${tone}">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("")}
    </div>
    <div class="readiness-form-table">
      ${readiness.formRows.map((row) => `
        <div class="readiness-form-row ${escapeAttr(row.status)}">
          <strong>${escapeHtml(row.label)}</strong>
          <span>${escapeHtml(openingReadinessStatusLabel(row.status))}</span>
          ${openingReadinessFormIssuesHtml(row)}
        </div>
      `).join("")}
    </div>
  `;
}

function openingReadinessFormIssuesHtml(row) {
  const issues = [
    ...row.blockers.map((issue) => ({ issue, className: "blocker" })),
    ...row.courtSupplied.map((issue) => ({ issue, className: "" })),
    ...row.reviewWarnings.map((issue) => ({ issue, className: "" }))
  ];
  if (!issues.length) return `<p>${escapeHtml(openingReadinessFormNote(row))}</p>`;
  return `
    <div class="readiness-row-issues">
      ${issues.slice(0, 3).map(({ issue, className }) => issueJumpButtonHtml(issue, className)).join("")}
    </div>
  `;
}

function openingReadinessFormNote(row) {
  if (row.blockers.length) return row.blockers[0];
  if (row.reviewWarnings.length) return row.reviewWarnings[0];
  if (row.courtSupplied.length) return row.courtSupplied[0];
  return "No required information is missing for this opening packet review.";
}

function readinessIssueListHtml(title, issues, tone = "", kind = "blockers") {
  if (!issues.length) return "";
  return `
    <div class="handoff-issues ${escapeAttr(tone)}">
      <h4>${escapeHtml(title)}</h4>
      ${issues.slice(0, 10).map((issue, index) => {
        const target = issueTargetFor(issue);
        return target
          ? `<button type="button" class="issue issue-link ${tone === "warn" ? "" : "blocker"}" data-readiness-issue="${index}" data-readiness-kind="${escapeAttr(kind)}">${escapeHtml(issue)}</button>`
          : `<p>${escapeHtml(issue)}</p>`;
      }).join("")}
    </div>
  `;
}

function bindReadinessIssueButtons(wrapper, readiness) {
  wrapper.querySelectorAll("[data-readiness-issue]").forEach((button) => {
    button.addEventListener("click", () => {
      const sources = {
        blockers: readiness.blockers,
        courtSupplied: readiness.courtSupplied,
        reviewWarnings: readiness.reviewWarnings
      };
      const source = sources[button.dataset.readinessKind] || readiness.blockers;
      const issue = source[Number(button.dataset.readinessIssue)];
      jumpToIssueTarget(issueTargetFor(issue));
    });
  });
}

function productInfo(key = "informal_probate") {
  const products = {
    informal_probate: {
      key: "informal_probate",
      title: "Informal Probate Forms Package",
      price: BETA_UNLOCK_ENABLED ? "$0 beta" : "$499 target launch price",
      free: "Start your Wisconsin probate forms for free. Answer simple questions, identify missing information, and review the package price before download.",
      paid: BETA_UNLOCK_ENABLED
        ? "Beta document packet and filing checklist download for testing and feedback. Target launch price can be turned on later."
        : "Completed Wisconsin informal probate opening forms and filing checklist download."
    },
    transfer_affidavit: {
      key: "transfer_affidavit",
      title: "Transfer by Affidavit Package",
      price: BETA_UNLOCK_ENABLED ? "$0 beta" : "$149 target launch price",
      free: "Start free, answer simple questions, identify missing information, and review the package price before download.",
      paid: BETA_UNLOCK_ENABLED
        ? "Beta affidavit document packet and transfer checklist download for testing and feedback."
        : "Completed Transfer by Affidavit packet and transfer checklist download."
    },
    information_summary: {
      key: "information_summary",
      title: "Information Summary",
      price: "Free",
      free: "Download your information summary and choose whether to contact a Wisconsin probate attorney.",
      paid: "No attorney referral or data sharing is included."
    },
    attorney_handoff: {
      key: "attorney_handoff",
      title: "Attorney Review Handoff Packet",
      price: "Disabled",
      free: "Future optional feature. Not available in the public funnel.",
      paid: "No attorney referral or data sharing is enabled."
    }
  };
  return products[key] || products.informal_probate;
}

function documentProductKey() {
  return "informal_probate";
}

function accountEmail() {
  return cleanText(state.account?.email || state.payment?.email || state.applicant?.email || state.attorneyHandoff?.contactEmail);
}

function accountDisplayName() {
  return cleanText(state.account?.fullName || state.applicant?.fullName || state.attorneyHandoff?.contactName);
}

function platformFoundationStatus() {
  const redacted = matterRedactedSnapshot(state);
  return {
    environment: PLATFORM_CONFIG.environment || "prototype-local",
    storageMode: PLATFORM_STORAGE_CONFIG.adapter,
    plannedStorage: PLATFORM_STORAGE_CONFIG.plannedAdapter,
    dataModelVersion: PLATFORM_DATA_MODEL_VERSION,
    matterId: redacted.matterId,
    userId: state.account?.userId || "",
    consentLogCount: redacted.consentLogCount,
    auditLogCount: redacted.auditLogCount,
    analyticsEventCount: redacted.analyticsEventCount,
    hostedAccountsReady: Boolean(PLATFORM_FEATURE_FLAGS.hostedAccounts),
    secureDeliveryReady: Boolean(PLATFORM_FEATURE_FLAGS.secureDocumentDelivery),
    productionPaymentsReady: Boolean(PLATFORM_FEATURE_FLAGS.productionPayments)
  };
}

function platformAccountStatusHtml() {
  const status = platformFoundationStatus();
  const rows = [
    ["Environment", status.environment],
    ["Matter ID", status.matterId],
    ["User ID", status.userId],
    ["Storage now", `${status.storageMode} -> ${status.plannedStorage}`],
    ["Data model", status.dataModelVersion],
    ["Consent logs", String(status.consentLogCount)],
    ["Audit logs", String(status.auditLogCount)],
    ["Analytics events", String(status.analyticsEventCount)]
  ];
  return `
    <div class="platform-status-grid">
      ${rows.map(([label, value]) => `
        <div class="platform-status-row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "Not set")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function accountStorageKey() {
  const email = accountEmail().toLowerCase();
  const code = cleanText(state.account?.accessCode).toLowerCase();
  if (!email || !code) return "";
  return `pr1801-prototype-resume:${email.replace(/[^a-z0-9@._-]+/g, "-")}:${code.replace(/[^a-z0-9_-]+/g, "-")}`;
}

function matterStorageKey(matterId = state.matter?.id) {
  return `probate-platform:matter:${matterId || "current"}`;
}

function matterIndexStorageKey() {
  return "probate-platform:matter-index-v1";
}

function matterRedactedSnapshot(data = state) {
  return withTemporaryState(data, () => {
    const route = probatePathDecision(data);
    const opening = openingPathDecision(data);
    const readiness = openingDocumentReadiness();
    const service = interestedPersonServiceSummary(data);
    return {
      matterId: data.matter?.id || "missing",
      ownerUserId: data.account?.userId || "missing",
      county: cleanText(data.estate?.county) || "Not selected",
      storageMode: data.matter?.storageMode || PLATFORM_STORAGE_CONFIG.adapter,
      dataModelVersion: data.matter?.dataModelVersion || PLATFORM_DATA_MODEL_VERSION,
      packetType: route.key,
      openingResult: opening.key,
      paymentStatus: data.payment?.status || "unpaid",
      reviewerStatus: data.matter?.reviewerStatus || "not_reviewed",
      redFlagCount: route.key === "attorney_review" ? (route.reasons || []).length || 1 : 0,
      missingInfoCount: readiness.blockers.length,
      interestedPersonCount: service.total,
      consentLogCount: (data.consentLogs || []).length,
      auditLogCount: (data.auditLogs || []).length,
      analyticsEventCount: (data.analyticsEvents || []).length,
      createdAt: data.matter?.createdAt || "",
      updatedAt: data.matter?.updatedAt || "",
      lastSavedAt: data.matter?.lastSavedAt || data.account?.lastSavedAt || "",
      lastGeneratedAt: data.matter?.lastGeneratedAt || "",
      lastDownloadedAt: data.matter?.lastDownloadedAt || "",
      dataExportRequestedAt: data.matter?.dataExportRequestedAt || "",
      deletionRequestedAt: data.matter?.deletionRequestedAt || ""
    };
  });
}

function readMatterIndex() {
  if (typeof localStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(matterIndexStorageKey()));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMatterIndex(records = []) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(matterIndexStorageKey(), JSON.stringify(records.slice(0, 100)));
}

function upsertMatterIndexRecord(record) {
  const records = readMatterIndex().filter((item) => item.matterId !== record.matterId);
  records.unshift(record);
  writeMatterIndex(records);
}

function persistMatterCheckpoint(reason = "save_matter") {
  if (typeof localStorage === "undefined") return;
  ensurePlatformIdentity(state, { persist: false });
  state.matter.lastSavedAt = new Date().toISOString();
  state.account.lastSavedAt = state.matter.lastSavedAt;
  recordAuditLog(reason, { storageMode: PLATFORM_STORAGE_CONFIG.adapter });
  localStorage.setItem(matterStorageKey(), JSON.stringify(caseExportData(), null, 2));
  upsertMatterIndexRecord(matterRedactedSnapshot(state));
  saveState();
}

function redactedMatterRecords() {
  const records = readMatterIndex();
  const current = matterRedactedSnapshot(state);
  if (!records.some((record) => record.matterId === current.matterId)) {
    return [current, ...records];
  }
  return records.map((record) => record.matterId === current.matterId ? current : record);
}

function saveResumeCheckpoint() {
  const key = accountStorageKey();
  if (!key) {
    state.account.resumeStatus = "Enter an email and access code before saving a resume checkpoint.";
    saveState();
    renderFormsView();
    return;
  }
  state.account.lastSavedAt = new Date().toISOString();
  state.account.resumeStatus = `Saved checkpoint for ${accountEmail()}.`;
  localStorage.setItem(key, JSON.stringify(caseExportData(), null, 2));
  persistMatterCheckpoint("save_matter");
  saveState();
  renderFormsView();
  setDownloadArea("Resume checkpoint saved in this browser prototype.", "success");
}

function loadResumeCheckpoint() {
  const key = accountStorageKey();
  if (!key) {
    state.account.resumeStatus = "Enter the same email and access code used to save the checkpoint.";
    saveState();
    renderFormsView();
    return;
  }
  const saved = localStorage.getItem(key);
  if (!saved) {
    state.account.resumeStatus = "No saved checkpoint was found for that email/access code in this browser.";
    saveState();
    renderFormsView();
    return;
  }
  try {
    const parsed = JSON.parse(saved);
    const incoming = parsed.state || parsed;
    const currentAccount = { ...state.account };
    const merged = mergeDeep(emptyState(), incoming || {});
    migrateLoadedState(merged, incoming || {});
    merged.account = { ...merged.account, email: currentAccount.email, accessCode: currentAccount.accessCode, resumeStatus: "Loaded saved checkpoint.", lastSavedAt: merged.account?.lastSavedAt || parsed.savedAt || "" };
    state = merged;
    saveState();
    renderAll();
    setViewMode("forms");
    setDownloadArea("Resume checkpoint loaded.", "success");
  } catch (error) {
    state.account.resumeStatus = error.message || "The saved checkpoint could not be loaded.";
    saveState();
    renderFormsView();
  }
}

function requestMatterDataExport() {
  ensurePlatformIdentity(state, { persist: false });
  state.matter.dataExportRequestedAt = new Date().toISOString();
  recordAuditLog("data_export_request", { requestType: "user_request" });
  saveState();
  renderFormsView();
  if (state.ui.mode === "admin") renderAdminView();
  setDownloadArea("Data export request logged for this prototype matter.", "success");
}

function requestMatterDeletionReview() {
  ensurePlatformIdentity(state, { persist: false });
  state.matter.deletionRequestedAt = new Date().toISOString();
  recordAuditLog("delete_matter_request", { requestType: "user_request" });
  saveState();
  renderFormsView();
  if (state.ui.mode === "admin") renderAdminView();
  setDownloadArea("Deletion review request logged. Prototype data has not been deleted.", "success");
}

function betaIssueCategoryLabel(value = "") {
  const labels = {
    general: "General",
    interview: "Interview flow",
    interested_persons: "Interested-person logic",
    packet_decision: "Packet decision",
    form_output: "Form output",
    signing_efiling: "Signing/eFiling",
    county_defaults: "County defaults",
    payment_delivery: "Payment/download"
  };
  return labels[value] || "General";
}

function betaIssueSeverityLabel(value = "") {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    launch_blocker: "Launch blocker"
  };
  return labels[value] || "Medium";
}

function feedbackSummary(text = "") {
  const clean = cleanText(text).replace(/\s+/g, " ");
  return clean.length > 96 ? `${clean.slice(0, 93)}...` : clean;
}

function createBetaIssueFromFeedback() {
  ensurePlatformIdentity(state, { persist: false });
  const detail = cleanText(state.account?.feedback);
  if (!detail) return null;
  const issue = {
    id: newLocalId("betaissue"),
    createdAt: new Date().toISOString(),
    matterId: state.matter?.id || "",
    category: state.account?.feedbackCategory || "general",
    severity: state.account?.feedbackSeverity || "medium",
    summary: feedbackSummary(detail),
    detail,
    testerType: state.account?.testerType || "unknown",
    route: probatePathDecision().key,
    openingDecision: openingPathDecision().key,
    candidateScenario: state.account?.feedbackCanBecomeScenario !== false,
    convertedToScenario: false,
    status: "new"
  };
  state.betaIssues = [issue, ...(state.betaIssues || [])].slice(0, 50);
  state.account.feedbackIssueId = issue.id;
  return issue;
}

function betaIssueQueueText(data = state) {
  const issues = data.betaIssues || [];
  return [
    "Beta Issue Queue",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    issues.length ? issues.map((issue, index) => [
      `${index + 1}. ${issue.summary || "(no summary)"}`,
      `ID: ${issue.id || "(missing)"}`,
      `Category: ${betaIssueCategoryLabel(issue.category)}`,
      `Severity: ${betaIssueSeverityLabel(issue.severity)}`,
      `Status: ${issue.status || "new"}`,
      `Scenario candidate: ${issue.candidateScenario ? "Yes" : "No"}`,
      `Route/opening: ${issue.route || "(not set)"} / ${issue.openingDecision || "(not set)"}`,
      `Detail: ${issue.detail || "(none)"}`
    ].join("\n")).join("\n\n") : "No beta issues captured yet."
  ].join("\n");
}

function betaIssueQueueHtml(data = state) {
  const issues = (data.betaIssues || []).slice(0, 5);
  return `
    <div class="beta-issue-panel">
      <div class="row-heading">
        <div>
          <strong>Beta issue queue</strong>
          <p>Feedback saved here can be turned into future test scenarios.</p>
        </div>
        <span class="badge ${issues.length ? "warn" : ""}">${issues.length ? `${issues.length} issue(s)` : "No issues"}</span>
      </div>
      <div class="beta-issue-list">
        ${issues.length ? issues.map((issue) => `
          <div class="beta-issue-row">
            <strong>${escapeHtml(issue.summary || "(no summary)")}</strong>
            <span>${escapeHtml(betaIssueCategoryLabel(issue.category))} | ${escapeHtml(betaIssueSeverityLabel(issue.severity))}</span>
            <p>${escapeHtml(issue.candidateScenario ? "Scenario candidate" : "Feedback only")}</p>
          </div>
        `).join("") : `<p class="helper-text">Submit beta feedback to add the first issue.</p>`}
      </div>
    </div>
  `;
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function createSecureDeliveryRecord(productKey = state.payment?.productKey || documentProductKey()) {
  ensurePlatformIdentity(state, { persist: false });
  const token = newLocalId("securelink");
  const record = {
    id: token,
    matterId: state.matter?.id || "",
    productKey,
    email: state.payment?.email || accountEmail(),
    audience: state.payment?.exportAudience || "public",
    status: "prototype_created",
    createdAt: new Date().toISOString(),
    expiresAt: addDaysIso(14),
    downloadLimit: 3,
    downloadCount: 0,
    revokedAt: "",
    url: `${PLATFORM_CONFIG.secureDownloadBaseUrl || "https://secure-download.example/probate"}/${token}`
  };
  state.secureDeliveryLinks = [record, ...(state.secureDeliveryLinks || [])].slice(0, 20);
  state.payment.deliveryMode = "secure_link";
  recordAuditLog("secure_delivery_link_created", { productKey, audience: record.audience });
  saveState();
  return record;
}

function createSecureDeliveryLinkFromUi() {
  const record = createSecureDeliveryRecord();
  renderFormsView();
  setDownloadArea(`Prototype secure delivery link created for ${record.email || "the user"}.`, "success");
}

function secureDeliveryManifestText(data = state) {
  const links = data.secureDeliveryLinks || [];
  return [
    "Secure Delivery Prototype Manifest",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    "Production rule",
    "Final probate documents should be delivered by authenticated account access or expiring secure link, not ordinary email attachments.",
    "",
    links.length ? links.map((link, index) => [
      `${index + 1}. ${link.productKey || "(product)"}`,
      `Recipient: ${link.email || "(not set)"}`,
      `Audience: ${link.audience || "(not set)"}`,
      `Status: ${link.status || "prototype_created"}`,
      `Created: ${documentDate(String(link.createdAt || "").slice(0, 10)) || "(not set)"}`,
      `Expires: ${documentDate(String(link.expiresAt || "").slice(0, 10)) || "(not set)"}`,
      `Limit: ${link.downloadLimit || 0}`,
      `URL placeholder: ${link.url || "(not set)"}`
    ].join("\n")).join("\n\n") : "No secure delivery links have been created in this prototype session."
  ].join("\n");
}

function secureDeliveryPanelHtml(data = state) {
  const links = (data.secureDeliveryLinks || []).slice(0, 3);
  return `
    <div class="secure-delivery-panel">
      <div class="row-heading">
        <div>
          <strong>Secure delivery prototype</strong>
          <p>Models expiring download links for hosted beta. The local prototype records links but does not email or host documents.</p>
        </div>
        <button type="button" class="secondary" data-create-secure-delivery-link>Create link</button>
      </div>
      <div class="secure-link-list">
        ${links.length ? links.map((link) => `
          <div class="secure-link-row">
            <strong>${escapeHtml(link.productKey || "document package")}</strong>
            <span>${escapeHtml(link.email || "No email")}</span>
            <p>Expires ${escapeHtml(documentDate(String(link.expiresAt || "").slice(0, 10)) || "not set")} | ${escapeHtml(link.status || "prototype")}</p>
          </div>
        `).join("") : `<p class="helper-text">Create a prototype link to model the hosted download flow.</p>`}
      </div>
    </div>
  `;
}

function productionLaunchHandoffText(data = state) {
  return withTemporaryState(data, () => {
    const legalLock = legalLogicLockStatus(data);
    const attorneyBeta = attorneyBetaReviewSummary(data);
    const integrity = officialFormIntegritySummary(formPreviewDefinitions());
    return [
      "Production Launch Handoff",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Launch gates",
      `Official form output: ${integrity.exactOutputNeeded ? `${integrity.exactOutputNeeded} active exact-output item(s) still need final approval` : "active outputs reviewed"}`,
      `Attorney beta validation: ${attorneyBeta.approved}/${attorneyBeta.total} approved`,
      `Legal logic lock: ${legalLock.locked ? "locked" : legalLock.ready ? "ready to lock" : "blocked"}`,
      "",
      "Accounts and storage",
      "- Replace local browser storage with secure server-side accounts.",
      "- Store probate matters by authenticated user/matter ID.",
      "- Encrypt sensitive probate data and generated documents at rest.",
      "- Keep immutable consent, audit, download, and document-generation logs.",
      "",
      "Payment and download",
      "- Keep $0 beta mode until review/testing is complete.",
      "- Add real payment processing only after terms, refund policy, support scope, and final output scope are approved.",
      "- After payment/unlock, provide a secure download page or expiring authenticated link.",
      "- Do not email final probate documents as ordinary attachments unless a lawyer-approved delivery policy allows it.",
      "",
      "Document output",
      "- Public users usually print, wet-sign, and paper file or mail the opening packet.",
      "- Attorneys may need both editable Word/DOCX and signed/scanned PDF lanes depending on the eFiling form.",
      "- PR-1808 and PR-1810 should remain court-editable drafts where local practice or eFiling requires Word/DOCX.",
      "- Later administration forms such as PR-1811 should live in a later-stage folder after letters issue.",
      "",
      "GitHub/deployment",
      "- Upload the static app, templates, documentation, and server helper together.",
      "- Configure production company/support/legal text before public launch.",
      "- Do not enable paid public downloads until official output and legal-review gates are complete."
    ].join("\n");
  });
}

function productionLaunchHandoffPanelHtml() {
  const legalLock = legalLogicLockStatus();
  const attorneyBeta = attorneyBetaReviewSummary();
  const integrity = officialFormIntegritySummary(formPreviewDefinitions());
  const items = [
    ["Official outputs", integrity.exactOutputNeeded ? `${integrity.exactOutputNeeded} need final exact-output approval` : "Ready", integrity.exactOutputNeeded ? "warn" : ""],
    ["Attorney beta", `${attorneyBeta.approved}/${attorneyBeta.total} approved`, attorneyBeta.ready ? "" : "warn"],
    ["Legal lock", legalLock.locked ? "Locked" : legalLock.ready ? "Ready to lock" : "Blocked", legalLock.locked ? "" : legalLock.ready ? "warn" : "bad"],
    ["Payment", BETA_UNLOCK_ENABLED ? "$0 beta mode" : "Paid mode", BETA_UNLOCK_ENABLED ? "warn" : ""],
    ["Secure delivery", PLATFORM_FEATURE_FLAGS.secureDocumentDelivery ? "Backend flag enabled" : "Prototype manifest only", PLATFORM_FEATURE_FLAGS.secureDocumentDelivery ? "" : "warn"]
  ];
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Production launch handoff</p>
          <h3>Accounts, payment, and secure downloads</h3>
          <p>This summarizes what must move from local prototype behavior to hosted production behavior before public paid launch.</p>
        </div>
        <span class="badge warn">Pre-launch</span>
      </div>
      <div class="admin-readiness-list">
        ${items.map(([label, value, tone]) => `
          <div class="admin-readiness-row ${escapeAttr(tone)}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(value)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function submitBetaFeedback() {
  ensurePlatformIdentity(state, { persist: false });
  if (!hasValue(state.account?.feedback)) {
    state.account.resumeStatus = "Enter feedback before submitting it for beta review.";
    saveState();
    renderFormsView();
    return;
  }
  const issue = createBetaIssueFromFeedback();
  state.account.feedbackSubmittedAt = new Date().toISOString();
  recordAnalyticsEvent("beta_feedback_submitted", {
    testerType: state.account?.testerType || "unknown",
    category: state.account?.feedbackCategory || "general",
    severity: state.account?.feedbackSeverity || "medium",
    scenarioCandidate: Boolean(state.account?.feedbackCanBecomeScenario),
    hasEmail: Boolean(accountEmail()),
    feedbackLengthBucket: cleanText(state.account.feedback).length > 500 ? "long" : cleanText(state.account.feedback).length > 120 ? "medium" : "short"
  });
  recordAuditLog("beta_feedback_submitted", {
    testerType: state.account?.testerType || "unknown",
    category: state.account?.feedbackCategory || "general",
    severity: state.account?.feedbackSeverity || "medium",
    issueId: issue?.id || "",
    feedbackCaptured: true
  });
  persistMatterCheckpoint("beta_feedback_checkpoint");
  state.account.resumeStatus = `Feedback submitted ${documentDate(state.account.feedbackSubmittedAt.slice(0, 10))}.`;
  saveState();
  renderFormsView();
  if (state.ui.mode === "admin") renderAdminView();
  setDownloadArea("Beta feedback saved with this prototype matter.", "success");
}

function betaTesterInstructionsText(data = state) {
  return withTemporaryState(data, () => [
    "Wisconsin Probate Forms Beta Tester Guide",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    "Purpose",
    "This beta is for testing the guided interview, packet decisions, interested-person logic, output package, and filing handoff. It is not a final production release and does not provide legal advice.",
    "",
    "Suggested test path",
    "1. Start at the Public site or Guided interview.",
    "2. Try the front-door path router: Transfer by Affidavit vs informal probate vs attorney review.",
    "3. Enter applicant, PR, decedent, will/no-will, heirship, and interested-person facts.",
    "4. Review the Interested Person Audit and waiver/PR-1805 decision.",
    "5. Continue to opening packet readiness, unlock the $0 beta download, and review the ZIP contents.",
    "6. Submit feedback from the View Forms account checkpoint panel.",
    "",
    "What to look for",
    "- Did the interview ask questions in a logical order?",
    "- Were any screens confusing, cluttered, or too long?",
    "- Did the app identify the correct interested persons?",
    "- Did the app choose waiver vs PR-1805 notice correctly for the facts entered?",
    "- Did the packet include the expected PR forms?",
    "- Did any form output place information in a surprising or wrong place?",
    "- Did the filing instructions tell the user what to sign, file, serve, publish, wait for, and do next?",
    "",
    "Current case snapshot",
    `County: ${cleanText(data.estate?.county) || "(not set)"}`,
    `Route: ${probatePathDecision(data).title}`,
    `Opening path: ${openingPathDecision(data).title}`,
    `Opening readiness: ${openingDocumentReadiness().ready ? "Ready" : "Needs info"}`
  ].join("\n"));
}

function betaKnownLimitationsText(data = state) {
  return withTemporaryState(data, () => [
    "Known Beta Limitations",
    "",
    "Court forms",
    "- Wisconsin PR forms are standard court forms and must not be altered.",
    "- Current beta downloads are DOCX drafts and mapping aids unless marked otherwise.",
    "- Production output must use official PDFs or exact approved replicas for filing copies.",
    "- Wet-signed documents generally need to be scanned/flattened to PDF before attorney eFiling.",
    "- PR-1808 and PR-1810 may need Word/editable format for attorney eFiling or court editing; final per-form rules are still being confirmed.",
    "",
    "County practice",
    "- County courthouse, probate office, registrar, publication newspaper, and local-practice notes must be verified before relying on output.",
    "- Publication newspaper defaults are a library aid, not a substitute for county confirmation.",
    "",
    "Legal logic",
    "- Edge cases involving formal probate, disputes, minors/protected persons, missing heirs, unknown addresses, military service, trusts, charities, public benefits, or unusual assets should be attorney-reviewed.",
    "- The attorney referral/handoff model is intentionally neutral and not monetized in this prototype.",
    "",
    "Security",
    "- Save/resume is local browser prototype storage only.",
    "- Production needs secure hosted accounts, encrypted storage, access logs, retention/deletion policy, and secure document delivery links.",
    "",
    "Payment",
    "- The beta unlock is $0 and models the future payment gate.",
    "- Real pricing, payment processing, refund terms, and secure delivery must be finalized before launch."
  ].join("\n"));
}

function betaFeedbackPromptsText() {
  return [
    "Beta Feedback Prompts",
    "",
    "Start / router",
    "- Did the app quickly tell you whether Transfer by Affidavit, informal probate, or attorney review seemed likely?",
    "- Was the start-free/payment timing clear?",
    "",
    "Interview",
    "- Which question felt confusing or unnecessary?",
    "- Did the app ask for anything too early?",
    "- Did Next take you where you expected?",
    "",
    "Interested persons",
    "- Did the app suggest the correct heirs, beneficiaries, PRs, trustees, minors, and missing-address people?",
    "- Did the waiver vs notice treatment match your understanding?",
    "",
    "Opening packet",
    "- Did the readiness review explain exactly what was missing?",
    "- Did the packet include the expected PR forms?",
    "- Were the signing, filing, service, publication, and waiting instructions clear?",
    "",
    "Documents",
    "- Did the Word/PDF format expectation make sense?",
    "- Was it clear which documents need wet signatures before paper filing or attorney eFiling?",
    "- Did any field appear wrong, cramped, missing, or on the wrong form?",
    "",
    "Overall",
    "- Would a public user understand this without a lawyer?",
    "- Would an attorney trust this enough to use as a drafting tool?",
    "- What is the one thing that must be fixed before public launch?"
  ].join("\n");
}

function betaTesterChecklistText(data = state) {
  return withTemporaryState(data, () => {
    const suite = scenarioSuiteSummary();
    const readiness = openingDocumentReadiness();
    const output = outputReadinessSummary();
    const integrity = officialFormIntegritySummary();
    return [
      "Beta Tester Checklist",
      "",
      `[ ] Save/resume tested with email and access code.`,
      `[ ] Beta acknowledgements accepted.`,
      `[ ] Feedback submitted from View Forms.`,
      `[ ] Path router result reviewed: ${probatePathDecision(data).title}.`,
      `[ ] Opening path reviewed: ${openingPathDecision(data).title}.`,
      `[ ] Interested Person Audit reviewed.`,
      `[ ] Opening readiness reviewed: ${readiness.ready ? "Ready" : "Needs info"}.`,
      `[ ] Output format matrix reviewed: ${output.overlayNeeded} overlay(s), ${output.editableDrafts} editable court draft(s).`,
      `[ ] Official form integrity reviewed: ${integrity.exactOutputNeeded} exact output item(s) remain.`,
      `[ ] Scenario suite checked: ${suite.passCount}/${suite.total} scenarios and ${suite.totalChecks - suite.failedChecks}/${suite.totalChecks} checks passing.`,
      `[ ] ZIP contents reviewed.`,
      `[ ] Known limitations understood.`
    ].join("\n");
  });
}

function betaDemoCaseData() {
  return baseTestScenarioState({
    account: {
      fullName: "Beta Tester",
      email: "tester@example.com",
      accessCode: "demo123",
      testerType: "public",
      betaTermsAccepted: true,
      privacyAcknowledged: true,
      launchConsent: true
    },
    ui: {
      mode: "guided",
      interviewStepId: "path-router"
    }
  });
}

async function buildBetaTesterPackageZip(data = state) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const zip = new JSZip();
  zip.file("00-beta-tester-guide.txt", betaTesterInstructionsText(data));
  zip.file("01-known-limitations.txt", betaKnownLimitationsText(data));
  zip.file("02-feedback-prompts.txt", betaFeedbackPromptsText());
  zip.file("03-beta-tester-checklist.txt", betaTesterChecklistText(data));
  zip.file("04-current-case-export.json", JSON.stringify(withTemporaryState(data, () => caseExportData()), null, 2));
  zip.file("05-demo-case-import.json", JSON.stringify({
    app: "wisconsin-informal-probate-prototype",
    version: 1,
    savedAt: new Date().toISOString(),
    state: betaDemoCaseData()
  }, null, 2));
  zip.file("06-output-format-manifest.txt", outputManifestText(data));
  zip.file("07-official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("08-official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("09-legal-logic-audit.txt", legalLogicAuditText(data));
  zip.file("10-legal-review-checklist.txt", legalReviewChecklistText(data));
  zip.file("11-attorney-beta-validation.txt", attorneyBetaReviewText(data));
  zip.file("12-scenario-suite-summary.txt", scenarioSuiteSummaryText());
  zip.file("13-legal-disclaimer.txt", LEGAL_DISCLAIMER_FULL);
  zip.file("14-per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  zip.file("15-beta-issue-log.txt", betaIssueQueueText(data));
  zip.file("16-signature-tracking.txt", signatureTrackingText(data));
  zip.file("17-secure-delivery-manifest.txt", secureDeliveryManifestText(data));
  zip.file("18-legal-logic-beta-lock.txt", legalLogicLockText(data));
  zip.file("19-production-launch-handoff.txt", productionLaunchHandoffText(data));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

async function exportBetaTesterPackage(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget);
  const defaultText = button?.textContent || "Download beta tester package";
  if (button) {
    button.disabled = true;
    button.textContent = "Building package...";
  }
  try {
    const blob = await buildBetaTesterPackageZip(state);
    recordAnalyticsEvent("beta_tester_package_downloaded", {
      testerType: state.account?.testerType || "unknown",
      hasEmail: Boolean(accountEmail())
    });
    recordAuditLog("download_beta_tester_package", { testerType: state.account?.testerType || "unknown" });
    showDownloadLink(blob, `beta-tester-package-${estateSlug()}.zip`);
  } catch (error) {
    setDownloadArea(error.message || "The beta tester package could not be created.", "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = defaultText;
    }
    renderReview();
  }
}

function betaTesterStatusHtml() {
  const rows = [
    ["Account", accountEmail() && state.account?.accessCode ? "Save/resume ready" : "Add email and access code"],
    ["Acknowledgements", state.account?.betaTermsAccepted && state.account?.privacyAcknowledged && state.account?.launchConsent ? "Accepted" : "Needs beta acknowledgements"],
    ["Feedback", state.account?.feedbackSubmittedAt ? `Submitted ${documentDate(state.account.feedbackSubmittedAt.slice(0, 10))}` : hasValue(state.account?.feedback) ? "Draft feedback ready" : "Feedback not entered"],
    ["Download", paymentUnlockedFor(state.payment?.productKey || documentProductKey()) || state.payment?.status === "paid" ? "Unlocked in this session" : "$0 beta unlock available"],
    ["Delivery", state.payment?.deliveryMode === "secure_link" ? "Secure-link mode selected (prototype placeholder)" : "Browser download mode"]
  ];
  return `
    <div class="beta-status-panel">
      <strong>Controlled beta status</strong>
      <div class="beta-status-grid">
        ${rows.map(([label, value]) => `
          <div>
            <span>${escapeHtml(label)}</span>
            <p>${escapeHtml(value)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function accountPortalHtml() {
  const savedDate = cleanText(state.account?.lastSavedAt).slice(0, 10);
  return `
    <div class="account-portal">
      <div>
        <p class="eyebrow">Save and resume prototype</p>
        <h3>Account checkpoint</h3>
        <p>This models the hosted beta account flow. In production this becomes secure login, encrypted case storage, payment history, feedback, and controlled document delivery.</p>
      </div>
      ${betaTesterStatusHtml()}
      ${platformAccountStatusHtml()}
      <div class="account-grid">
        <label>Name
          <input data-account-field="fullName" value="${escapeAttr(accountDisplayName())}" placeholder="Alex Decedent" />
        </label>
        <label>Email
          <input type="email" data-account-field="email" value="${escapeAttr(accountEmail())}" placeholder="name@example.com" />
        </label>
        <label>Resume access code
          <input data-account-field="accessCode" value="${escapeAttr(state.account?.accessCode || "")}" placeholder="Create a private code" />
        </label>
        <label>Tester type
          <select data-account-field="testerType">
            <option value="" ${state.account?.testerType === "" ? "selected" : ""}>Select</option>
            <option value="public" ${state.account?.testerType === "public" ? "selected" : ""}>Public tester</option>
            <option value="attorney" ${state.account?.testerType === "attorney" ? "selected" : ""}>Attorney tester</option>
            <option value="staff" ${state.account?.testerType === "staff" ? "selected" : ""}>Legal staff tester</option>
          </select>
        </label>
        <label class="account-feedback">Beta feedback
          <textarea rows="3" data-account-field="feedback" placeholder="What was confusing, missing, or wrong?">${escapeHtml(state.account?.feedback || "")}</textarea>
        </label>
        <label>Feedback area
          <select data-account-field="feedbackCategory">
            <option value="general" ${state.account?.feedbackCategory === "general" ? "selected" : ""}>General</option>
            <option value="interview" ${state.account?.feedbackCategory === "interview" ? "selected" : ""}>Interview flow</option>
            <option value="interested_persons" ${state.account?.feedbackCategory === "interested_persons" ? "selected" : ""}>Interested-person logic</option>
            <option value="packet_decision" ${state.account?.feedbackCategory === "packet_decision" ? "selected" : ""}>Packet decision</option>
            <option value="form_output" ${state.account?.feedbackCategory === "form_output" ? "selected" : ""}>Form output</option>
            <option value="signing_efiling" ${state.account?.feedbackCategory === "signing_efiling" ? "selected" : ""}>Signing/eFiling</option>
            <option value="county_defaults" ${state.account?.feedbackCategory === "county_defaults" ? "selected" : ""}>County defaults</option>
            <option value="payment_delivery" ${state.account?.feedbackCategory === "payment_delivery" ? "selected" : ""}>Payment/download</option>
          </select>
        </label>
        <label>Severity
          <select data-account-field="feedbackSeverity">
            <option value="low" ${state.account?.feedbackSeverity === "low" ? "selected" : ""}>Low</option>
            <option value="medium" ${state.account?.feedbackSeverity === "medium" ? "selected" : ""}>Medium</option>
            <option value="high" ${state.account?.feedbackSeverity === "high" ? "selected" : ""}>High</option>
            <option value="launch_blocker" ${state.account?.feedbackSeverity === "launch_blocker" ? "selected" : ""}>Launch blocker</option>
          </select>
        </label>
        <div class="beta-acknowledgements">
          <label class="inline-check">
            <input type="checkbox" data-account-field="betaTermsAccepted" ${state.account?.betaTermsAccepted ? "checked" : ""} />
            <span>I understand this service provides document automation and legal information, not legal advice.</span>
          </label>
          <label class="inline-check">
            <input type="checkbox" data-account-field="privacyAcknowledged" ${state.account?.privacyAcknowledged ? "checked" : ""} />
            <span>I understand probate intake may contain sensitive personal, family, and financial information and should be stored securely before public launch.</span>
          </label>
          <label class="inline-check">
            <input type="checkbox" data-account-field="launchConsent" ${state.account?.launchConsent ? "checked" : ""} />
            <span>The user consents to saving this beta checkpoint in the current prototype browser/session.</span>
          </label>
          <label class="inline-check">
            <input type="checkbox" data-account-field="feedbackCanBecomeScenario" ${state.account?.feedbackCanBecomeScenario !== false ? "checked" : ""} />
            <span>This feedback can become a formal test scenario.</span>
          </label>
        </div>
        <div class="account-actions">
          <button type="button" class="secondary" data-save-resume-checkpoint>Save checkpoint</button>
          <button type="button" class="secondary" data-submit-beta-feedback>Submit beta feedback</button>
          <button type="button" class="secondary" data-download-beta-package>Download beta tester package</button>
          <button type="button" class="secondary" data-load-resume-checkpoint>Load checkpoint</button>
          <button type="button" class="secondary" data-request-data-export>Request data export</button>
          <button type="button" class="ghost" data-request-deletion-review>Request deletion review</button>
        </div>
      </div>
      ${betaIssueQueueHtml()}
      ${secureDeliveryPanelHtml()}
      ${legalDisclaimerHtml("account")}
      ${privacyNoticeHtml()}
      <p class="helper-text">${escapeHtml(state.account?.resumeStatus || (savedDate ? `Last saved ${documentDate(savedDate)}.` : "No checkpoint saved in this browser yet."))}</p>
    </div>
  `;
}

function bindAccountPortal(root) {
  root.querySelectorAll("[data-account-field]").forEach((input) => {
    const update = () => {
      const value = input.type === "checkbox" ? input.checked : input.value;
      state.account[input.dataset.accountField] = value;
      if (input.dataset.accountField === "email") state.payment.email = value;
      if (input.type === "checkbox" && value) {
        const consentMap = {
          betaTermsAccepted: ["TERMS_ACCEPTANCE", "I understand this service provides document automation and legal information, not legal advice.", CONSENT_VERSIONS.terms],
          privacyAcknowledged: ["PRIVACY_ACCEPTANCE", "I understand probate intake may contain sensitive personal, family, and financial information and should be stored securely before public launch.", CONSENT_VERSIONS.privacy],
          launchConsent: ["TERMS_ACCEPTANCE", "The user consents to saving this beta checkpoint in the current prototype browser/session.", CONSENT_VERSIONS.terms]
        };
        const consent = consentMap[input.dataset.accountField];
        if (consent) recordConsent(consent[0], consent[1], true, consent[2]);
      }
      saveState();
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
  root.querySelector("[data-save-resume-checkpoint]")?.addEventListener("click", saveResumeCheckpoint);
  root.querySelector("[data-submit-beta-feedback]")?.addEventListener("click", submitBetaFeedback);
  root.querySelector("[data-download-beta-package]")?.addEventListener("click", exportBetaTesterPackage);
  root.querySelector("[data-load-resume-checkpoint]")?.addEventListener("click", loadResumeCheckpoint);
  root.querySelector("[data-request-data-export]")?.addEventListener("click", requestMatterDataExport);
  root.querySelector("[data-request-deletion-review]")?.addEventListener("click", requestMatterDeletionReview);
  root.querySelector("[data-create-secure-delivery-link]")?.addEventListener("click", createSecureDeliveryLinkFromUi);
}

function readinessTone(complete, caution = false) {
  if (complete) return caution ? "warn" : "ok";
  return "bad";
}

function betaLaunchReadinessItems() {
  const suite = scenarioSuiteSummary();
  const output = outputReadinessSummary();
  const integrity = officialFormIntegritySummary();
  return [
    {
      label: "Save/resume identity",
      status: accountEmail() && state.account?.accessCode ? "Ready for beta prototype" : "Needs email and access code",
      tone: readinessTone(accountEmail() && state.account?.accessCode),
      detail: "Uses browser checkpoint storage now; production must replace this with secure login and server-side storage."
    },
    {
      label: "Beta acknowledgements",
      status: state.account?.betaTermsAccepted && state.account?.privacyAcknowledged && state.account?.launchConsent ? "Accepted" : "Needs acknowledgements",
      tone: readinessTone(state.account?.betaTermsAccepted && state.account?.privacyAcknowledged && state.account?.launchConsent),
      detail: "Keeps testers aware this is not legal advice and generated documents must be reviewed before filing."
    },
    {
      label: "$0 beta unlock",
      status: paymentUnlockedFor(state.payment?.productKey || documentProductKey()) || state.payment?.status === "paid" ? "Unlocked in this session" : "Ready to test",
      tone: readinessTone(true, state.payment?.status !== "paid"),
      detail: "Models the future payment gate while keeping the beta free for feedback."
    },
    {
      label: "Feedback capture",
      status: state.betaIssues?.length ? `${state.betaIssues.length} issue(s) queued` : state.account?.feedbackSubmittedAt ? "Feedback submitted" : hasValue(state.account?.feedback) ? "Draft feedback ready" : "Feedback field ready",
      tone: state.betaIssues?.some((issue) => issue.severity === "launch_blocker" || issue.severity === "high") ? "bad" : readinessTone(true, !state.account?.feedbackSubmittedAt),
      detail: state.betaIssues?.length ? "Issue queue can be converted into future scenario tests." : state.account?.feedbackSubmittedAt ? `Last submitted ${documentDate(state.account.feedbackSubmittedAt.slice(0, 10))}.` : "Production should store feedback with case ID, tester type, browser, and app version."
    },
    {
      label: "Secure hosted storage",
      status: "Backend needed",
      tone: "bad",
      detail: "Before public use: authentication, encryption at rest, backups, access logs, retention policy, and privacy/terms pages."
    },
    {
      label: "Document delivery",
      status: state.payment?.deliveryMode === "secure_link" ? "Secure-link path selected" : "Download-only prototype",
      tone: readinessTone(state.payment?.deliveryMode === "secure_link", true),
      detail: "Emailing documents should use expiring secure links, not ordinary attachments."
    },
    {
      label: "Scenario safety net",
      status: `${suite.passCount}/${suite.total} scenarios passing`,
      tone: readinessTone(suite.failedChecks === 0),
      detail: `${suite.totalChecks - suite.failedChecks}/${suite.totalChecks} logic checks currently pass.`
    },
    {
      label: "Official output readiness",
      status: output.overlayNeeded || output.templateNeeded ? "Exact-form work remains" : "Output rules reviewed",
      tone: readinessTone(!(output.overlayNeeded || output.templateNeeded), true),
      detail: `${output.overlayNeeded} PDF overlay(s), ${output.editableDrafts} Word court draft(s), ${output.templateNeeded} official template(s) remain in the active packet.`
    },
    {
      label: "Standard form integrity",
      status: integrity.exactOutputNeeded ? "Official overlays/templates remain" : "Integrity rules clear",
      tone: readinessTone(!integrity.exactOutputNeeded, true),
      detail: `${integrity.activeCount} active standard form(s); ${integrity.exactOutputNeeded} need exact official output work; ${integrity.editableCourtDrafts} remain editable court drafts.`
    }
  ];
}

function betaLaunchReadinessHtml() {
  const items = betaLaunchReadinessItems();
  const ready = items.filter((item) => item.tone === "ok").length;
  const caution = items.filter((item) => item.tone === "warn").length;
  const blocked = items.filter((item) => item.tone === "bad").length;
  return `
    <section class="launch-readiness-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Hosted beta foundation</p>
          <h3>Launch readiness checkpoint</h3>
          <p>This separates what is usable for controlled beta testing from what must be built before a public paid launch.</p>
        </div>
        <span class="badge ${blocked ? "bad" : caution ? "warn" : ""}">${blocked ? "Backend needed" : caution ? "Beta ready with cautions" : "Ready"}</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        ${[
          [String(ready), "ready", ""],
          [String(caution), "caution", caution ? "warn" : ""],
          [String(blocked), "blocked", blocked ? "bad" : ""]
        ].map(([value, label, tone]) => `
          <div class="readiness-stat ${tone}">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
      <div class="launch-readiness-list">
        ${items.map((item) => `
          <div class="launch-readiness-row ${escapeAttr(item.tone)}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.status)}</span>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}
      </div>
      <div class="handoff-actions">
        <button type="button" class="secondary" data-roadmap-open-forms>Open beta account and payment gate</button>
        <button type="button" class="secondary" data-roadmap-download-beta-package>Download beta tester package</button>
        <button type="button" class="secondary" data-roadmap-run-scenarios>Run scenario suite</button>
      </div>
    </section>
  `;
}

function scenarioSuiteSummary() {
  const results = (testScenarios || []).map(evaluateTestScenario);
  const totalChecks = results.reduce((sum, result) => sum + result.checks.length, 0);
  const failedChecks = results.reduce((sum, result) => sum + result.checks.filter((check) => !check.pass).length, 0);
  return {
    total: results.length,
    passCount: results.filter((result) => result.pass).length,
    totalChecks,
    failedChecks
  };
}

function scenarioSuiteSummaryText() {
  const results = (testScenarios || []).map(evaluateTestScenario);
  const summary = scenarioSuiteSummary();
  return [
    "Formal Test Scenario Suite",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    `Scenarios passing: ${summary.passCount}/${summary.total}`,
    `Checks passing: ${summary.totalChecks - summary.failedChecks}/${summary.totalChecks}`,
    "",
    ...results.map((result) => [
      `${result.pass ? "[PASS]" : "[FAIL]"} ${result.scenario.id}`,
      result.scenario.title,
      ...(result.pass ? [] : result.checks.filter((check) => !check.pass).map((check) => `- ${check.label}`))
    ].join("\n"))
  ].join("\n\n");
}

function probateLogicAuditItems() {
  const route = probatePathDecision();
  const decision = openingPathDecision();
  const serviceSummary = interestedPersonServiceSummary();
  const sourceMessage = interestedPersonSourceReviewMessage();
  const contactStatus = addressContactStatus();
  const readiness = openingDocumentReadiness();
  const suite = scenarioSuiteSummary();
  const willAnswered = ["yes", "no", "unknown"].includes(state.will.exists);
  const benefitsAnswered = guidedBenefitsComplete();
  const countyReady = hasValue(state.estate.county) && (hasValue(state.countyDefaults.newspaperName) || hasValue(state.notice1804.newspaperName) || hasValue(state.notice1805.newspaperName));
  const noWillRisk = state.will.exists === "no" && decision.key !== "waiver";
  return [
    {
      label: "Front-door path router",
      status: route.title,
      tone: route.key === "attorney_review" ? "warn" : "ok",
      detail: route.detail
    },
    {
      label: "Waiver vs. PR-1805 decision",
      status: decision.title,
      tone: decision.key === "unknown" || decision.key === "blocked_no_will" || noWillRisk ? "bad" : decision.key === "notice" ? "warn" : "ok",
      detail: decision.detail
    },
    {
      label: "Interested-person roster",
      status: sourceMessage ? "Needs review" : "Roster reconciled",
      tone: sourceMessage ? "bad" : "ok",
      detail: sourceMessage || "Applicant, PR, heirship, will beneficiary, trustee, and manual entries are reconciled."
    },
    {
      label: "Waiver/service treatment",
      status: `${serviceSummary.canSignWaiverCount}/${serviceSummary.total} can sign waiver`,
      tone: serviceSummary.total && serviceSummary.unansweredWaiverCount === 0 ? serviceSummary.requiresNotice ? "warn" : "ok" : "bad",
      detail: `${serviceSummary.unansweredWaiverCount} unanswered, ${serviceSummary.unknownOrMissingCount} unknown/not located, ${serviceSummary.protectedCount} minor/protected, ${serviceSummary.missingAddressCount} address issue(s).`
    },
    {
      label: "Address/contact completeness",
      status: contactStatus.missingRequired ? "Missing addresses" : "Mailing addresses ready",
      tone: contactStatus.missingRequired ? "bad" : contactStatus.helpfulMissing ? "warn" : "ok",
      detail: `${contactStatus.missingRequired} required mailing address issue(s), ${contactStatus.helpfulMissing} helpful contact detail issue(s).`
    },
    {
      label: "Will/no-will branch",
      status: willAnswered ? `Will answer: ${state.will.exists}` : "Not answered",
      tone: willAnswered ? noWillRisk ? "bad" : "ok" : "bad",
      detail: noWillRisk ? "No-will estates without all waivers should route to attorney/formal review in this prototype." : "Will-dependent questions are controlling visibility and packet path."
    },
    {
      label: "Public benefits questions",
      status: benefitsAnswered ? "Answered" : "Needs answers",
      tone: benefitsAnswered ? "ok" : "warn",
      detail: "PR-1801 benefit/public assistance answers affect required notice and review."
    },
    {
      label: "County/publication setup",
      status: countyReady ? "County setup usable" : "Needs county defaults",
      tone: countyReady ? "ok" : "warn",
      detail: countyReady ? "County and publication newspaper are available for packet drafting." : "Select county and confirm publication newspaper/courthouse details before relying on output."
    },
    {
      label: "Opening packet readiness",
      status: readiness.ready ? "Ready" : "Needs info",
      tone: readiness.ready ? "ok" : "bad",
      detail: readiness.blockers[0] || "No must-fix blockers in the opening packet readiness review."
    },
    {
      label: "Scenario regression suite",
      status: `${suite.passCount}/${suite.total} scenarios passing`,
      tone: suite.failedChecks ? "bad" : "ok",
      detail: `${suite.totalChecks - suite.failedChecks}/${suite.totalChecks} checks passing.`
    }
  ];
}

function logicAuditPanelHtml() {
  const items = probateLogicAuditItems();
  const bad = items.filter((item) => item.tone === "bad").length;
  const warn = items.filter((item) => item.tone === "warn").length;
  return `
    <section class="logic-audit-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Wisconsin probate logic audit</p>
          <h3>Decision safety checklist</h3>
          <p>Use this before beta release to see whether the current case and the app's test suite support the packet decision.</p>
        </div>
        <span class="badge ${bad ? "bad" : warn ? "warn" : ""}">${bad ? `${bad} blocker(s)` : warn ? `${warn} caution(s)` : "Clean"}</span>
      </div>
      <div class="logic-audit-list">
        ${items.map((item) => `
          <div class="logic-audit-row ${escapeAttr(item.tone)}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.status)}</span>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}
      </div>
      ${logicDecisionTraceHtml()}
      ${logicInterestedTreatmentAuditHtml()}
      ${logicPacketFormsAuditHtml()}
    </section>
  `;
}

function logicDecisionTraceItems() {
  const route = probatePathDecision();
  const decision = openingPathDecision();
  const service = interestedPersonServiceSummary();
  const readiness = openingDocumentReadiness();
  return [
    ["Probate route", route.title, route.detail],
    ["Opening path", decision.title, decision.detail],
    ["Waiver capacity", `${service.canSignWaiverCount}/${service.total} can sign`, `${service.unansweredWaiverCount} unanswered; ${service.requiresNotice ? "notice/service issue exists" : "no service issue requires PR-1805 from current answers"}.`],
    ["Unknown/missing parties", String(service.unknownOrMissingCount), service.unknownOrMissingCount ? "One or more people are unknown, missing, or cannot be located." : "No unknown/missing party is flagged."],
    ["Minor/protected-person review", String(service.protectedCount), service.protectedCount ? "Minor/protected-person status may prevent waiver treatment." : "No minor/protected person is flagged in service treatment."],
    ["Packet readiness", readiness.ready ? "Ready" : "Needs info", readiness.blockers[0] || "No must-fix opening packet blockers."]
  ];
}

function logicDecisionTraceHtml() {
  return `
    <div class="logic-detail-panel">
      <h4>Decision trace</h4>
      <div class="logic-detail-list">
        ${logicDecisionTraceItems().map(([label, status, detail]) => `
          <div class="logic-detail-row">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(status)}</span>
            <p>${escapeHtml(detail)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function logicInterestedTreatmentAuditHtml() {
  const items = interestedPersonSourceReviewItems();
  const rows = items.slice(0, 12);
  return `
    <div class="logic-detail-panel">
      <div class="row-heading compact-heading">
        <h4>Interested-person treatment</h4>
        <span class="badge">${items.length} person/entity record(s)</span>
      </div>
      <div class="logic-person-list">
        ${rows.length ? rows.map((item) => `
          <div class="logic-person-row ${escapeAttr(item.tone || "")}">
            <strong>${escapeHtml(item.name || "Unnamed")}</strong>
            <span>${escapeHtml(item.statusLabel || item.status)}</span>
            <p>${escapeHtml((item.reasons || []).slice(0, 4).join("; ") || item.decision || "No reason available")}</p>
            <p>${escapeHtml(item.action || "")}</p>
          </div>
        `).join("") : `<p class="helper-text">No interested-person audit records yet.</p>`}
      </div>
      ${items.length > rows.length ? `<p class="helper-text">Showing first ${rows.length} records. Use the Interested Person Audit interview screen for the full roster.</p>` : ""}
    </div>
  `;
}

function logicPacketFormsAuditHtml() {
  const result = openingPacketResults();
  const rows = result.formDetails.filter((item) => item.key !== "pr1811");
  return `
    <div class="logic-detail-panel">
      <div class="row-heading compact-heading">
        <h4>Form inclusion audit</h4>
        <span class="badge">${rows.filter((row) => row.status === "included").length} included</span>
      </div>
      <div class="logic-form-list">
        ${rows.map((row) => `
          <div class="logic-form-row ${row.status === "included" ? "" : row.status === "not-in-path" ? "bad" : "warn"}">
            <strong>${escapeHtml(packetFormLabel(row))}</strong>
            <span>${escapeHtml(packetStatusLabel(row.status))}</span>
            <p>${escapeHtml(row.reason || "No reason recorded.")}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function legalLogicAuditText(data = state) {
  return withTemporaryState(data, () => {
    const items = probateLogicAuditItems();
    const people = interestedPersonSourceReviewItems();
    const result = openingPacketResults();
    return [
      "Wisconsin Probate Logic Audit",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Decision trace",
      logicDecisionTraceItems().map(([label, status, detail]) => `${label}: ${status}\n${detail}`).join("\n\n"),
      "",
      "Checklist",
      items.map((item) => `${item.label}: ${item.status}\nTone: ${item.tone}\n${item.detail}`).join("\n\n"),
      "",
      "Interested-person treatment",
      people.map((item) => [
        `${item.name || "(unnamed)"}: ${item.statusLabel || item.status}`,
        `Reasons: ${(item.reasons || []).join("; ") || "(none)"}`,
        `Decision: ${item.decision || "(none)"}`,
        `Action: ${item.action || "(none)"}`
      ].join("\n")).join("\n\n") || "(none)",
      "",
      "Form inclusion",
      result.formDetails.map((item) => `${packetFormLabel(item)}: ${packetStatusLabel(item.status)}\n${item.reason || "(no reason)"}`).join("\n\n")
    ].join("\n");
  });
}

function legalReviewChecklistItems() {
  return [
    {
      key: "official_form_format",
      label: "Official form format",
      detail: "Confirm statewide form layout, margins, PDF/Word handling, signatures, and county eFiling expectations."
    },
    {
      key: "pr1801_mapping",
      label: "PR-1801 field mapping",
      detail: "Approve the interview-to-PR-1801 map before the PDF overlay pilot becomes production output."
    },
    {
      key: "transfer_affidavit",
      label: "Transfer by Affidavit",
      detail: "Review PR-1831 route logic, 50,000 dollar threshold handling, public-benefits notice, and checklist language."
    },
    {
      key: "opening_path",
      label: "Waiver vs. PR-1805",
      detail: "Approve the decision logic for opening on PR-1803 waivers or using PR-1805 notice/publication."
    },
    {
      key: "interested_persons",
      label: "Interested persons",
      detail: "Review who is included or excluded as heirs, will beneficiaries, trustees, PRs, minors, protected persons, and unknown-address parties."
    },
    {
      key: "minor_military_protected",
      label: "Special service issues",
      detail: "Confirm treatment for minors, protected persons, guardian/agent needs, military service, and people who cannot sign."
    },
    {
      key: "spouse_heirship",
      label: "Spouse and heirship",
      detail: "Review PR-1801 spouse/domestic partner questions and PR-1806 family-tree logic, including deceased children with descendants."
    },
    {
      key: "public_benefits",
      label: "Public benefits",
      detail: "Confirm estate-recovery/public-benefits questions, warnings, and handoff points."
    },
    {
      key: "county_defaults",
      label: "County defaults",
      detail: "Approve courthouse, probate office, registrar, newspaper, source notes, and local-practice warnings."
    },
    {
      key: "filing_handoff",
      label: "Filing handoff",
      detail: "Review final instructions for what to sign, file, serve, publish, wait for, and do after letters issue."
    },
    {
      key: "payment_gate",
      label: "Start-free/payment gate",
      detail: "Approve the free preview, beta unlock, price gate, refund language, and final download flow."
    },
    {
      key: "attorney_handoff_ethics",
      label: "Attorney handoff/referrals",
      detail: "Review neutral directory, sponsorship, subscription, lead-fee, and consent-based export options before monetizing referrals."
    },
    {
      key: "privacy_security",
      label: "Accounts and security",
      detail: "Confirm saved accounts, document storage, email delivery, consent, and secure-download requirements before public launch."
    }
  ];
}

function attorneyBetaCaseDefinitions() {
  const focus = {
    "no-will-all-waivers": "Baseline no-will waiver opening.",
    "will-all-waivers": "Will path with beneficiaries and all waivers.",
    "will-notice-person-will-not-sign": "PR-1805 notice when a person will not sign.",
    "will-unknown-person": "Unknown or missing interested person.",
    "will-minor-protected": "Minor/protected-person service issue.",
    "nonresident-pr-resident-agent": "Out-of-state PR and resident-agent handling.",
    "blended-family-spouse-and-nonmarital-child": "Blended-family heirship and spouse/child treatment.",
    "deceased-child-descendants-known": "Deceased child with descendants.",
    "will-trust-beneficiary-and-trustee": "Trustee and trust beneficiary interested-person treatment.",
    "will-charity-beneficiary": "Charity beneficiary treatment.",
    "no-will-not-all-waivers": "No-will/not-all-waivers attorney-review edge case.",
    "missing-address-waiver-warning": "Missing address and waiver readiness."
  };
  return Object.entries(focus).map(([id, reviewFocus]) => {
    const scenario = (testScenarios || []).find((item) => item.id === id);
    return {
      id,
      title: scenario?.title || id,
      detail: scenario?.detail || "",
      reviewFocus
    };
  });
}

function attorneyBetaReviewRecord(id, data = state) {
  const record = data.attorneyBetaReviews?.[id] || {};
  return {
    status: record.status || "pending",
    reviewer: record.reviewer || "",
    reviewedAt: record.reviewedAt || "",
    notes: record.notes || ""
  };
}

function attorneyBetaReviewStatusLabel(status = "pending") {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    needs_revision: "Needs revision",
    county_dependent: "County-specific"
  };
  return labels[status] || labels.pending;
}

function attorneyBetaReviewSummary(data = state) {
  const rows = attorneyBetaCaseDefinitions().map((definition) => ({
    definition,
    record: attorneyBetaReviewRecord(definition.id, data)
  }));
  const counts = rows.reduce((result, row) => {
    result[row.record.status] = (result[row.record.status] || 0) + 1;
    return result;
  }, {});
  return {
    total: rows.length,
    approved: counts.approved || 0,
    needsRevision: counts.needs_revision || 0,
    countyDependent: counts.county_dependent || 0,
    pending: counts.pending || 0,
    rows,
    ready: rows.length > 0 && rows.every((row) => row.record.status === "approved")
  };
}

function attorneyBetaReviewOptionsHtml(selected = "pending") {
  return ["pending", "approved", "needs_revision", "county_dependent"].map((status) => `
    <option value="${escapeAttr(status)}" ${selected === status ? "selected" : ""}>${escapeHtml(attorneyBetaReviewStatusLabel(status))}</option>
  `).join("");
}

function attorneyBetaReviewPanelHtml(data = state) {
  const summary = attorneyBetaReviewSummary(data);
  const tone = summary.needsRevision ? "bad" : summary.pending || summary.countyDependent ? "warn" : "";
  return `
    <section class="attorney-beta-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Attorney beta validation</p>
          <h3>Review the hard Wisconsin fact patterns</h3>
          <p>Mark each scenario after a Wisconsin probate attorney or qualified reviewer confirms the app's routing, interested-person treatment, waiver/notice path, and form output expectations.</p>
        </div>
        <span class="badge ${escapeAttr(tone)}">${escapeHtml(summary.ready ? "Ready" : "Review open")}</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        <div class="readiness-stat"><strong>${escapeHtml(String(summary.approved))}</strong><span>approved</span></div>
        <div class="readiness-stat ${summary.needsRevision ? "bad" : ""}"><strong>${escapeHtml(String(summary.needsRevision))}</strong><span>needs revision</span></div>
        <div class="readiness-stat ${summary.countyDependent ? "warn" : ""}"><strong>${escapeHtml(String(summary.countyDependent))}</strong><span>county-specific</span></div>
        <div class="readiness-stat ${summary.pending ? "warn" : ""}"><strong>${escapeHtml(String(summary.pending))}</strong><span>pending</span></div>
      </div>
      <div class="attorney-beta-list">
        ${summary.rows.map(({ definition, record }) => `
          <div class="attorney-beta-row ${record.status === "needs_revision" ? "bad" : record.status === "pending" || record.status === "county_dependent" ? "warn" : ""}">
            <div>
              <strong>${escapeHtml(definition.title)}</strong>
              <p>${escapeHtml(definition.reviewFocus)}</p>
            </div>
            <label>Status
              <select data-attorney-beta-status="${escapeAttr(definition.id)}">
                ${attorneyBetaReviewOptionsHtml(record.status)}
              </select>
            </label>
            <label>Reviewer
              <input data-attorney-beta-reviewer="${escapeAttr(definition.id)}" value="${escapeAttr(record.reviewer)}" placeholder="Reviewer" />
            </label>
            <label>Notes
              <textarea rows="2" data-attorney-beta-notes="${escapeAttr(definition.id)}" placeholder="Review note or county exception">${escapeHtml(record.notes)}</textarea>
            </label>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function bindAttorneyBetaReview(root) {
  if (!root) return;
  if (!state.attorneyBetaReviews || typeof state.attorneyBetaReviews !== "object" || Array.isArray(state.attorneyBetaReviews)) state.attorneyBetaReviews = {};
  const updateRecord = (id, patch) => {
    const existing = attorneyBetaReviewRecord(id);
    state.attorneyBetaReviews[id] = {
      ...existing,
      ...patch,
      reviewedAt: patch.status || patch.notes || patch.reviewer ? (existing.reviewedAt || new Date().toISOString().slice(0, 10)) : existing.reviewedAt
    };
    saveState();
  };
  root.querySelectorAll("[data-attorney-beta-status]").forEach((select) => {
    select.addEventListener("change", () => {
      updateRecord(select.dataset.attorneyBetaStatus, { status: select.value });
      renderRoadmapView();
      if (state.ui.mode === "admin") renderAdminView();
    });
  });
  root.querySelectorAll("[data-attorney-beta-reviewer]").forEach((input) => {
    input.addEventListener("input", () => updateRecord(input.dataset.attorneyBetaReviewer, { reviewer: input.value }));
  });
  root.querySelectorAll("[data-attorney-beta-notes]").forEach((textarea) => {
    textarea.addEventListener("input", () => updateRecord(textarea.dataset.attorneyBetaNotes, { notes: textarea.value }));
  });
}

function attorneyBetaReviewText(data = state) {
  const summary = attorneyBetaReviewSummary(data);
  return [
    "Attorney Beta Validation Review",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    `Approved: ${summary.approved}/${summary.total}`,
    `Needs revision: ${summary.needsRevision}`,
    `County-specific: ${summary.countyDependent}`,
    `Pending: ${summary.pending}`,
    "",
    ...summary.rows.map(({ definition, record }) => [
      `${definition.title}`,
      `Scenario ID: ${definition.id}`,
      `Focus: ${definition.reviewFocus}`,
      `Status: ${attorneyBetaReviewStatusLabel(record.status)}`,
      `Reviewer: ${cleanText(record.reviewer) || "(not set)"}`,
      `Review date: ${documentDate(record.reviewedAt) || "(not set)"}`,
      `Notes: ${cleanText(record.notes) || "(none)"}`
    ].join("\n"))
  ].join("\n\n");
}

function ensureLegalReviewState(target = state) {
  if (!target.legalReview) target.legalReview = emptyState().legalReview;
  if (!target.legalReview.items) target.legalReview.items = {};
  if (!Object.prototype.hasOwnProperty.call(target.legalReview, "lockedAt")) target.legalReview.lockedAt = "";
  if (!Object.prototype.hasOwnProperty.call(target.legalReview, "lockedBy")) target.legalReview.lockedBy = "";
  if (!Object.prototype.hasOwnProperty.call(target.legalReview, "lockNotes")) target.legalReview.lockNotes = "";
  if (!Object.prototype.hasOwnProperty.call(target.legalReview, "lockedScenarioSummary")) target.legalReview.lockedScenarioSummary = null;
  return target.legalReview;
}

function legalReviewItemState(key, data = state) {
  const review = data.legalReview || {};
  const item = review.items?.[key] || {};
  return {
    status: item.status || "pending",
    notes: item.notes || "",
    updatedAt: item.updatedAt || ""
  };
}

function legalReviewStatusLabel(status = "pending") {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    needs_revision: "Needs revision",
    county_dependent: "County-specific"
  };
  return labels[status] || labels.pending;
}

function legalReviewStatusTone(status = "pending") {
  if (status === "approved") return "ok";
  if (status === "needs_revision") return "bad";
  if (status === "county_dependent") return "warn";
  return "warn";
}

function legalReviewSummary(data = state) {
  const items = legalReviewChecklistItems().map((item) => legalReviewItemState(item.key, data));
  const counts = items.reduce((result, item) => {
    result[item.status] = (result[item.status] || 0) + 1;
    return result;
  }, {});
  return {
    total: items.length,
    approved: counts.approved || 0,
    needsRevision: counts.needs_revision || 0,
    countyDependent: counts.county_dependent || 0,
    pending: counts.pending || 0,
    status: counts.needs_revision ? "needs_revision" : counts.pending ? "pending" : counts.county_dependent ? "county_dependent" : "approved"
  };
}

function legalReviewStatusOptionsHtml(selected = "pending") {
  return ["pending", "approved", "needs_revision", "county_dependent"].map((status) => `
    <option value="${escapeAttr(status)}" ${selected === status ? "selected" : ""}>${escapeHtml(legalReviewStatusLabel(status))}</option>
  `).join("");
}

function legalReviewChecklistHtml() {
  const review = ensureLegalReviewState();
  const summary = legalReviewSummary();
  const tone = legalReviewStatusTone(summary.status);
  const roleOptions = ["", "Wisconsin probate attorney", "Attorney", "Paralegal", "Developer", "Other"].map((role) => `
    <option value="${escapeAttr(role)}" ${review.reviewerRole === role ? "selected" : ""}>${escapeHtml(role || "Reviewer role")}</option>
  `).join("");
  const stats = [
    [String(summary.approved), "approved", ""],
    [String(summary.countyDependent), "county-specific", summary.countyDependent ? "warn" : ""],
    [String(summary.needsRevision), "needs revision", summary.needsRevision ? "bad" : ""],
    [String(summary.pending), "pending", summary.pending ? "warn" : ""]
  ];
  return `
    <section class="legal-review-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Attorney/legal review</p>
          <h3>Launch approval checklist</h3>
          <p>Use this to track which probate rules, form outputs, county defaults, and business-model items have been reviewed before public release.</p>
        </div>
        <span class="badge ${escapeAttr(tone === "bad" ? "bad" : tone === "warn" ? "warn" : "")}">${escapeHtml(legalReviewStatusLabel(summary.status))}</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        ${stats.map(([value, label, statTone]) => `
          <div class="readiness-stat ${escapeAttr(statTone)}">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
      <div class="legal-review-meta">
        <label>Reviewer name
          <input data-legal-review-field="reviewerName" value="${escapeAttr(review.reviewerName || "")}" placeholder="Reviewer name" />
        </label>
        <label>Role
          <select data-legal-review-field="reviewerRole">${roleOptions}</select>
        </label>
        <label>Review date
          <input type="date" data-legal-review-field="reviewedAt" value="${escapeAttr(review.reviewedAt || "")}" />
        </label>
        <label>Overall notes
          <textarea rows="2" data-legal-review-field="overallNotes" placeholder="Open legal, county, or launch questions">${escapeHtml(review.overallNotes || "")}</textarea>
        </label>
      </div>
      <div class="legal-review-list">
        ${legalReviewChecklistItems().map((definition) => {
          const item = legalReviewItemState(definition.key);
          const itemTone = legalReviewStatusTone(item.status);
          return `
            <div class="legal-review-row ${escapeAttr(itemTone === "bad" ? "bad" : itemTone === "warn" ? "warn" : "")}">
              <div>
                <strong>${escapeHtml(definition.label)}</strong>
                <p>${escapeHtml(definition.detail)}</p>
              </div>
              <label>Status
                <select data-legal-review-status="${escapeAttr(definition.key)}">
                  ${legalReviewStatusOptionsHtml(item.status)}
                </select>
              </label>
              <label>Notes
                <textarea rows="2" data-legal-review-note="${escapeAttr(definition.key)}" placeholder="Reviewer note or county exception">${escapeHtml(item.notes)}</textarea>
              </label>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function bindLegalReviewInputs(root) {
  if (!root) return;
  ensureLegalReviewState();
  root.querySelectorAll("[data-legal-review-field]").forEach((input) => {
    const update = () => {
      state.legalReview[input.dataset.legalReviewField] = input.value;
      saveState();
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
  root.querySelectorAll("[data-legal-review-status]").forEach((select) => {
    select.addEventListener("change", () => {
      const key = select.dataset.legalReviewStatus;
      state.legalReview.items[key] = {
        ...legalReviewItemState(key),
        status: select.value,
        updatedAt: new Date().toISOString()
      };
      if (!state.legalReview.reviewedAt) state.legalReview.reviewedAt = new Date().toISOString().slice(0, 10);
      saveState();
      renderRoadmapView();
      if (state.ui.mode === "forms") renderFormsView();
    });
  });
  root.querySelectorAll("[data-legal-review-note]").forEach((textarea) => {
    const update = () => {
      const key = textarea.dataset.legalReviewNote;
      state.legalReview.items[key] = {
        ...legalReviewItemState(key),
        notes: textarea.value,
        updatedAt: new Date().toISOString()
      };
      saveState();
    };
    textarea.addEventListener("input", update);
    textarea.addEventListener("change", update);
  });
}

function legalReviewChecklistText(data = state) {
  const review = data.legalReview || {};
  const summary = legalReviewSummary(data);
  const rows = legalReviewChecklistItems().map((definition) => {
    const item = legalReviewItemState(definition.key, data);
    return [
      `${definition.label}: ${legalReviewStatusLabel(item.status)}`,
      `Issue: ${definition.detail}`,
      `Notes: ${cleanText(item.notes) || "(none)"}`,
      item.updatedAt ? `Updated: ${item.updatedAt}` : "Updated: (not set)"
    ].join("\n");
  }).join("\n\n");
  return [
    "Attorney/Legal Review Checklist",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    `Reviewer: ${cleanText(review.reviewerName) || "(not set)"}`,
    `Role: ${cleanText(review.reviewerRole) || "(not set)"}`,
    `Review date: ${documentDate(review.reviewedAt) || "(not set)"}`,
    "",
    "Summary",
    `Approved: ${summary.approved}/${summary.total}`,
    `County-specific: ${summary.countyDependent}`,
    `Needs revision: ${summary.needsRevision}`,
    `Pending: ${summary.pending}`,
    "",
    "Overall notes",
    cleanText(review.overallNotes) || "(none)",
    "",
    rows
  ].join("\n");
}

function legalLogicLockStatus(data = state) {
  ensureLegalReviewState(data);
  const review = data.legalReview || {};
  const reviewSummary = legalReviewSummary(data);
  const attorneyBeta = attorneyBetaReviewSummary(data);
  const scenarioSummary = scenarioSuiteSummary();
  const issues = data.betaIssues || [];
  const blockers = [];
  if (reviewSummary.status !== "approved") {
    blockers.push(`Attorney/legal checklist is ${legalReviewStatusLabel(reviewSummary.status).toLowerCase()}.`);
  }
  if (!attorneyBeta.ready) {
    blockers.push(`Attorney beta validation has ${attorneyBeta.pending} pending, ${attorneyBeta.needsRevision} needing revision, and ${attorneyBeta.countyDependent} county-specific scenario(s).`);
  }
  if (scenarioSummary.failedChecks) {
    blockers.push(`${scenarioSummary.failedChecks} scenario check(s) are failing.`);
  }
  const severeIssues = issues.filter((issue) => issue.severity === "launch_blocker" || issue.severity === "high");
  if (severeIssues.length) {
    blockers.push(`${severeIssues.length} high-severity beta issue(s) are still open.`);
  }
  return {
    locked: hasValue(review.lockedAt),
    ready: blockers.length === 0,
    blockers,
    reviewSummary,
    attorneyBeta,
    scenarioSummary,
    severeIssues,
    lockedAt: review.lockedAt || "",
    lockedBy: review.lockedBy || "",
    lockNotes: review.lockNotes || "",
    lockedScenarioSummary: review.lockedScenarioSummary || null
  };
}

function legalLogicLockText(data = state) {
  const status = legalLogicLockStatus(data);
  return [
    "Legal Logic Beta Lock",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    `Status: ${status.locked ? "Locked for beta" : status.ready ? "Ready to lock" : "Not ready"}`,
    `Locked at: ${status.lockedAt || "(not locked)"}`,
    `Locked by: ${cleanText(status.lockedBy) || "(not set)"}`,
    `Review checklist: ${status.reviewSummary.approved}/${status.reviewSummary.total} approved; ${status.reviewSummary.pending} pending; ${status.reviewSummary.needsRevision} needs revision; ${status.reviewSummary.countyDependent} county-specific`,
    `Attorney beta scenarios: ${status.attorneyBeta.approved}/${status.attorneyBeta.total} approved; ${status.attorneyBeta.pending} pending; ${status.attorneyBeta.needsRevision} needs revision; ${status.attorneyBeta.countyDependent} county-specific`,
    `Scenario suite: ${status.scenarioSummary.passCount}/${status.scenarioSummary.total} scenarios passing; ${status.scenarioSummary.failedChecks} failed check(s)`,
    `Open high-severity beta issues: ${status.severeIssues.length}`,
    "",
    "Blockers",
    status.blockers.length ? status.blockers.map((blocker) => `- ${blocker}`).join("\n") : "- None.",
    "",
    "Lock notes",
    cleanText(status.lockNotes) || "(none)"
  ].join("\n");
}

function legalLogicLockPanelHtml() {
  const status = legalLogicLockStatus();
  const tone = status.locked ? "" : status.ready ? "warn" : "bad";
  const badgeText = status.locked ? "Locked" : status.ready ? "Ready" : "Blocked";
  return `
    <section class="legal-lock-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Beta release lock</p>
          <h3>Legal logic checkpoint</h3>
          <p>Lock the probate decision logic only after attorney review, scenario tests, and high-severity beta issues are clean.</p>
        </div>
        <span class="badge ${escapeAttr(tone)}">${escapeHtml(badgeText)}</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        <div class="readiness-stat ${status.reviewSummary.status === "approved" ? "" : "warn"}">
          <strong>${escapeHtml(`${status.reviewSummary.approved}/${status.reviewSummary.total}`)}</strong>
          <span>reviewed</span>
        </div>
        <div class="readiness-stat ${status.attorneyBeta.ready ? "" : "warn"}">
          <strong>${escapeHtml(`${status.attorneyBeta.approved}/${status.attorneyBeta.total}`)}</strong>
          <span>beta cases</span>
        </div>
        <div class="readiness-stat ${status.scenarioSummary.failedChecks ? "bad" : ""}">
          <strong>${escapeHtml(`${status.scenarioSummary.passCount}/${status.scenarioSummary.total}`)}</strong>
          <span>scenarios</span>
        </div>
        <div class="readiness-stat ${status.severeIssues.length ? "bad" : ""}">
          <strong>${escapeHtml(String(status.severeIssues.length))}</strong>
          <span>high issues</span>
        </div>
        <div class="readiness-stat ${status.locked ? "" : "warn"}">
          <strong>${escapeHtml(status.locked ? documentDate(String(status.lockedAt).slice(0, 10)) || "Locked" : "Open")}</strong>
          <span>lock status</span>
        </div>
      </div>
      ${status.blockers.length ? `
        <div class="legal-lock-blockers">
          ${status.blockers.map((blocker) => `<p>${escapeHtml(blocker)}</p>`).join("")}
        </div>
      ` : ""}
      <label>Lock notes
        <textarea rows="2" data-legal-lock-notes placeholder="Beta release note or reviewer condition">${escapeHtml(status.lockNotes)}</textarea>
      </label>
      <button type="button" class="secondary-btn" data-lock-legal-logic ${status.ready ? "" : "disabled"}>${status.locked ? "Update beta lock" : "Lock legal logic for beta"}</button>
    </section>
  `;
}

function lockLegalLogicForBeta() {
  ensureLegalReviewState();
  const status = legalLogicLockStatus();
  if (!status.ready) {
    state.legalReview.lockNotes = `Blocked: ${status.blockers.join(" ")}`;
    saveState();
    renderRoadmapView();
    setDownloadArea("Legal logic cannot be locked yet. Clear the listed beta blockers first.", "error");
    return;
  }
  state.legalReview.lockedAt = new Date().toISOString();
  state.legalReview.lockedBy = cleanText(state.legalReview.reviewerName) || "Beta reviewer";
  state.legalReview.lockedScenarioSummary = status.scenarioSummary;
  recordAuditLog("legal_logic_locked_for_beta", {
    reviewer: state.legalReview.lockedBy,
    scenarioPassCount: status.scenarioSummary.passCount,
    scenarioTotal: status.scenarioSummary.total
  });
  saveState();
  renderRoadmapView();
  if (state.ui.mode === "admin") renderAdminView();
  setDownloadArea("Legal logic checkpoint locked for beta.", "success");
}

function bindLegalLogicLock(root) {
  if (!root) return;
  root.querySelector("[data-legal-lock-notes]")?.addEventListener("input", (event) => {
    ensureLegalReviewState();
    state.legalReview.lockNotes = event.currentTarget.value;
    saveState();
  });
  root.querySelector("[data-lock-legal-logic]")?.addEventListener("click", lockLegalLogicForBeta);
}

function renderRoadmapView() {
  const beta = document.getElementById("roadmapBetaReadiness");
  const audit = document.getElementById("roadmapLogicAudit");
  const legal = document.getElementById("roadmapLegalReview");
  if (beta) beta.innerHTML = betaLaunchReadinessHtml();
  if (audit) audit.innerHTML = logicAuditPanelHtml();
  if (legal) {
    legal.innerHTML = `${legalReviewChecklistHtml()}${attorneyBetaReviewPanelHtml()}${legalLogicLockPanelHtml()}`;
    bindLegalReviewInputs(legal);
    bindAttorneyBetaReview(legal);
    bindLegalLogicLock(legal);
  }
  beta?.querySelector("[data-roadmap-open-forms]")?.addEventListener("click", () => setViewMode("forms"));
  beta?.querySelector("[data-roadmap-download-beta-package]")?.addEventListener("click", exportBetaTesterPackage);
  beta?.querySelector("[data-roadmap-run-scenarios]")?.addEventListener("click", () => setViewMode("scenarios"));
}

function platformReadinessItems() {
  const integrity = officialFormIntegritySummary();
  return [
    {
      label: "Environment config",
      status: PLATFORM_CONFIG.environment ? "Configured" : "Using defaults",
      tone: PLATFORM_CONFIG.environment ? "ok" : "warn",
      detail: "Company identity, feature flags, storage mode, and legal-tech guardrails are centralized."
    },
    {
      label: "Hosted accounts",
      status: PLATFORM_FEATURE_FLAGS.hostedAccounts ? "Enabled" : "Prototype only",
      tone: PLATFORM_FEATURE_FLAGS.hostedAccounts ? "ok" : "warn",
      detail: "Production needs secure login, passwordless or MFA options, session controls, and server-side matter ownership."
    },
    {
      label: "Secure matter storage",
      status: PLATFORM_STORAGE_CONFIG.adapter === "localPrototype" ? "Local prototype" : "Server adapter",
      tone: PLATFORM_STORAGE_CONFIG.adapter === "localPrototype" ? "warn" : "ok",
      detail: `Current adapter: ${PLATFORM_STORAGE_CONFIG.adapter}. Planned adapter: ${PLATFORM_STORAGE_CONFIG.plannedAdapter}.`
    },
    {
      label: "Consent logs",
      status: state.consentLogs.length ? `${state.consentLogs.length} logged` : "Ready",
      tone: "ok",
      detail: "Terms, privacy, download acknowledgement, and future attorney-sharing consent can be recorded."
    },
    {
      label: "Audit logs",
      status: state.auditLogs.length ? `${state.auditLogs.length} logged` : "Ready",
      tone: "ok",
      detail: "Sensitive actions such as saving, loading, generating, downloading, and exports are tracked locally."
    },
    {
      label: "Sensitive analytics",
      status: state.analyticsEvents.length ? `${state.analyticsEvents.length} event(s)` : "Ready",
      tone: "ok",
      detail: "Analytics metadata excludes names, addresses, emails, phones, assets, values, creditors, and document contents."
    },
    {
      label: "Secure document delivery",
      status: PLATFORM_FEATURE_FLAGS.secureDocumentDelivery ? "Enabled" : "Not live",
      tone: PLATFORM_FEATURE_FLAGS.secureDocumentDelivery ? "ok" : "warn",
      detail: "Production needs expiring links, access logs, download limits, and revocation."
    },
    {
      label: "Production payments",
      status: PLATFORM_FEATURE_FLAGS.productionPayments ? "Enabled" : "$0 beta mode",
      tone: PLATFORM_FEATURE_FLAGS.productionPayments ? "ok" : "warn",
      detail: "Stripe or another processor should be added after final terms, refund policy, and document-output scope are approved."
    },
    {
      label: "Official court form integrity",
      status: integrity.exactOutputNeeded ? "Exact-form work remains" : "Integrity policy ready",
      tone: integrity.exactOutputNeeded ? "warn" : "ok",
      detail: `${integrity.activeCount} active standard court form(s). Production must fill exact official forms without altering court language or layout.`
    },
    {
      label: "Beta feedback loop",
      status: state.betaIssues?.length ? `${state.betaIssues.length} issue(s) captured` : state.account?.feedbackSubmittedAt ? "Feedback submitted" : "Ready",
      tone: state.betaIssues?.some((issue) => issue.severity === "launch_blocker" || issue.severity === "high") ? "bad" : state.betaIssues?.length || state.account?.feedbackSubmittedAt ? "ok" : "warn",
      detail: state.betaIssues?.length ? "Issue queue can be converted into future scenario tests." : "Use the beta feedback panel to capture tester issues before public launch."
    }
  ];
}

function adminSummaryHtml() {
  const status = platformFoundationStatus();
  const items = platformReadinessItems();
  const warnCount = items.filter((item) => item.tone === "warn").length;
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Hosted app foundation</p>
          <h3>Production readiness snapshot</h3>
          <p>This view is redacted by default. It tracks system status without exposing probate names, addresses, asset values, or uploaded document contents.</p>
        </div>
        <span class="badge ${warnCount ? "warn" : ""}">${warnCount ? `${warnCount} production gap(s)` : "Ready"}</span>
      </div>
      ${platformAccountStatusHtml()}
      <div class="admin-readiness-list">
        ${items.map((item) => `
          <div class="admin-readiness-row ${escapeAttr(item.tone === "warn" ? "warn" : item.tone === "bad" ? "bad" : "")}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.status)}</span>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function hostedBetaLaunchConsoleHtml() {
  const links = state.secureDeliveryLinks || [];
  const issues = state.betaIssues || [];
  const signatureSummary = signatureTrackingSummary();
  const legalLock = legalLogicLockStatus();
  const attorneyBeta = attorneyBetaReviewSummary();
  const blockers = issues.filter((issue) => issue.severity === "launch_blocker" || issue.severity === "high").length;
  const rows = [
    ["Saved accounts", PLATFORM_FEATURE_FLAGS.hostedAccounts ? "Backend enabled" : "Prototype local only", PLATFORM_FEATURE_FLAGS.hostedAccounts ? "" : "warn"],
    ["Secure links", `${links.length} prototype link(s)`, links.length ? "" : "warn"],
    ["Beta issues", `${issues.length} captured`, blockers ? "bad" : issues.length ? "" : "warn"],
    ["Attorney beta cases", `${attorneyBeta.approved}/${attorneyBeta.total} approved`, attorneyBeta.ready ? "" : attorneyBeta.needsRevision ? "bad" : "warn"],
    ["Signature workflow", `${signatureSummary.signed}/${signatureSummary.required} signed`, signatureSummary.pending ? "warn" : ""],
    ["Scenario suite", `${scenarioSuiteSummary().passCount}/${scenarioSuiteSummary().total} passing`, scenarioSuiteSummary().failedChecks ? "bad" : ""],
    ["Legal logic lock", legalLock.locked ? `Locked ${documentDate(String(legalLock.lockedAt).slice(0, 10)) || ""}` : legalLock.ready ? "Ready to lock" : "Blocked", legalLock.locked ? "" : legalLock.ready ? "warn" : "bad"]
  ];
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Hosted beta launch console</p>
          <h3>Operational readiness</h3>
          <p>This is the bridge from local prototype to public beta: accounts, secure delivery, feedback triage, signatures, and scenario safety.</p>
        </div>
        <span class="badge ${blockers ? "bad" : "warn"}">${blockers ? `${blockers} blocker(s)` : "Beta checks"}</span>
      </div>
      <div class="admin-readiness-list">
        ${rows.map(([label, value, tone]) => `
          <div class="admin-readiness-row ${escapeAttr(tone)}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(value)}</span>
            <p>${escapeHtml(label === "Saved accounts" ? "Production needs server-side login, ownership, encryption, and recovery." : label === "Secure links" ? "Production links need authentication, expiration, revocation, and download audit." : label === "Beta issues" ? "High severity feedback should block launch until resolved or waived." : label === "Attorney beta cases" ? "Hard probate fact patterns should be reviewed before public launch." : label === "Signature workflow" ? "Documents needing signatures must be tracked before final filing/eFiling." : label === "Legal logic lock" ? "Public beta should wait until attorney-reviewed logic is locked against passing scenario tests." : "Scenario failures should block launch.")}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function adminBetaIssueDashboardHtml() {
  const issues = state.betaIssues || [];
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Feedback triage</p>
          <h3>Beta issue dashboard</h3>
          <p>Use this to decide what becomes a formal scenario test before launch.</p>
        </div>
        <span class="badge ${issues.some((issue) => issue.severity === "launch_blocker" || issue.severity === "high") ? "bad" : issues.length ? "warn" : ""}">${issues.length} issue(s)</span>
      </div>
      <div class="admin-log-list">
        ${issues.length ? issues.map((issue) => `
          <div class="admin-log-row">
            <strong>${escapeHtml(betaIssueSeverityLabel(issue.severity))}</strong>
            <span>${escapeHtml(betaIssueCategoryLabel(issue.category))}</span>
            <code>${escapeHtml(issue.summary || issue.detail || "(no summary)")}</code>
            <span>${escapeHtml(issue.candidateScenario ? "Scenario candidate" : "Feedback only")}</span>
          </div>
        `).join("") : `<p class="helper-text">No beta issues have been logged yet.</p>`}
      </div>
    </section>
  `;
}

function adminSecureDeliveryDashboardHtml() {
  const links = state.secureDeliveryLinks || [];
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Document delivery</p>
          <h3>Secure link dashboard</h3>
          <p>Prototype records only. Production must store documents server-side and send expiring authenticated links.</p>
        </div>
        <span class="badge ${links.length ? "warn" : ""}">${links.length} link(s)</span>
      </div>
      <div class="admin-log-list">
        ${links.length ? links.map((link) => `
          <div class="admin-log-row">
            <strong>${escapeHtml(link.productKey || "package")}</strong>
            <span>${escapeHtml(link.email || "(email missing)")}</span>
            <code>${escapeHtml(link.url || "(placeholder missing)")}</code>
            <span>${escapeHtml(`Expires ${documentDate(String(link.expiresAt || "").slice(0, 10)) || "not set"}`)}</span>
          </div>
        `).join("") : `<p class="helper-text">No prototype secure delivery links have been created yet.</p>`}
      </div>
    </section>
  `;
}

function adminMatterListHtml() {
  const records = redactedMatterRecords();
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Matters</p>
          <h3>Redacted matter index</h3>
          <p>Production admins should see this kind of operational list first. Opening full matter details should require a need-to-know reason and an audit log.</p>
        </div>
        <span class="badge">${records.length} matter(s)</span>
      </div>
      <div class="admin-table">
        <div class="admin-table-row header">
          <span>Matter</span>
          <span>County</span>
          <span>Packet</span>
          <span>Payment</span>
          <span>Red flags</span>
          <span>Missing</span>
          <span>Logs</span>
        </div>
        ${records.map((record) => `
          <div class="admin-table-row">
            <span>${escapeHtml(record.matterId)}</span>
            <span>${escapeHtml(record.county)}</span>
            <span>${escapeHtml(record.packetType)}</span>
            <span>${escapeHtml(record.paymentStatus)}</span>
            <span>${escapeHtml(String(record.redFlagCount))}</span>
            <span>${escapeHtml(String(record.missingInfoCount))}</span>
            <span>${escapeHtml(`${record.consentLogCount}/${record.auditLogCount}/${record.analyticsEventCount}`)}</span>
          </div>
        `).join("")}
      </div>
      <p class="helper-text">Log counts are shown as consent/audit/analytics. No names, addresses, emails, phones, asset values, creditor details, or document contents are shown here.</p>
    </section>
  `;
}

function adminLogListHtml() {
  const latest = [
    ...state.consentLogs.map((entry) => ({ type: "Consent", action: entry.consentType, at: entry.acceptedAt, metadata: { version: entry.consentVersion } })),
    ...state.auditLogs.map((entry) => ({ type: "Audit", action: entry.action, at: entry.createdAt, metadata: entry.metadata })),
    ...state.analyticsEvents.map((entry) => ({ type: "Analytics", action: entry.event, at: entry.createdAt, metadata: entry.metadata }))
  ].sort((a, b) => cleanText(b.at).localeCompare(cleanText(a.at))).slice(0, 12);
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Events</p>
          <h3>Consent, audit, and analytics</h3>
          <p>These are prototype-local records. Production should store immutable server-side logs with role-based access.</p>
        </div>
        <span class="badge">${latest.length} recent</span>
      </div>
      <div class="admin-log-list">
        ${latest.length ? latest.map((entry) => `
          <div class="admin-log-row">
            <strong>${escapeHtml(entry.type)}</strong>
            <span>${escapeHtml(entry.action)}</span>
            <span>${escapeHtml(cleanText(entry.at).replace("T", " ").slice(0, 19) || "No time")}</span>
            <code>${escapeHtml(JSON.stringify(entry.metadata || {}))}</code>
          </div>
        `).join("") : `<p class="helper-text">No consent, audit, or analytics events have been logged for this matter yet.</p>`}
      </div>
    </section>
  `;
}

function adminDataModelHtml() {
  const models = [
    ["users", "id, email, role, terms/privacy consent status, created/updated timestamps"],
    ["matters", "id, owner_user_id, county, packet_type, status, storage mode, reviewer status, last generated/downloaded"],
    ["parties", "matter_id, party type, role flags, service/waiver status, address completeness"],
    ["forms", "matter_id, form key, template version, output format, generated/downloaded timestamps"],
    ["consent_logs", "matter_id, consent type, version, accepted flag, accepted timestamp"],
    ["audit_logs", "matter_id, admin_user_id, action, safe metadata, created timestamp"],
    ["analytics_events", "event name, safe metadata, created timestamp; no sensitive probate facts"],
    ["documents", "matter_id, document type, storage key, template version, access/download audit"]
  ];
  return `
    <section class="admin-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Data model</p>
          <h3>Tables needed before hosted beta</h3>
          <p>This is the first production schema outline. The static prototype stores locally; the hosted app should move these records into a secure database and object storage.</p>
        </div>
        <span class="badge warn">Schema draft</span>
      </div>
      <div class="admin-data-model">
        ${models.map(([name, fields]) => `
          <div>
            <strong>${escapeHtml(name)}</strong>
            <p>${escapeHtml(fields)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAdminView() {
  ensurePlatformIdentity(state, { persist: false });
  const summary = document.getElementById("adminSummary");
  const matters = document.getElementById("adminMatterList");
  const logs = document.getElementById("adminLogList");
  const model = document.getElementById("adminDataModel");
  if (summary) summary.innerHTML = `${adminSummaryHtml()}${hostedBetaLaunchConsoleHtml()}${productionLaunchHandoffPanelHtml()}${adminBetaIssueDashboardHtml()}${adminSecureDeliveryDashboardHtml()}`;
  if (matters) matters.innerHTML = adminMatterListHtml();
  if (logs) logs.innerHTML = adminLogListHtml();
  if (model) model.innerHTML = adminDataModelHtml();
}

function paymentUnlockedFor(key = documentProductKey()) {
  return state.payment?.status === "paid" && state.payment?.productKey === key;
}

function paymentGateRouteWarningHtml(productKey = documentProductKey()) {
  const route = probatePathDecision();
  if (route.key === "transfer_affidavit" && productKey !== "transfer_affidavit") {
    return `<p class="payment-route-warning">Based on your answers, Transfer by Affidavit may fit. Review that result before paying for an informal probate packet.</p>`;
  }
  if (route.key === "attorney_review") {
    return `<p class="payment-route-warning">Attorney review is recommended. Download your information summary and consider speaking with a Wisconsin probate attorney before relying on a filing packet.</p>`;
  }
  return "";
}

function paymentGateHtml(context = "forms", productKey = documentProductKey()) {
  const info = productInfo(productKey);
  const unlocked = paymentUnlockedFor(info.key);
  const label = context === "filing" || context === "opening" ? "final opening packet" : "final forms";
  const betaMode = BETA_UNLOCK_ENABLED && info.price === "$0 beta";
  const nextStep = context === "opening" ? "opening-filing-instructions" : "";
  return `
    <div class="payment-gate ${unlocked ? "ready" : "locked"} ${betaMode && !unlocked ? "beta" : ""}" ${nextStep ? `data-payment-next-step="${escapeAttr(nextStep)}"` : ""}>
      <div>
        <p class="eyebrow">${unlocked ? "Unlocked" : betaMode ? "Free beta" : "Free preview"}</p>
        <h3>${escapeHtml(unlocked ? "Final downloads are unlocked" : "Your Wisconsin probate packet is ready to generate.")}</h3>
        <p>${escapeHtml(unlocked
          ? `${info.title} can now be downloaded for this browser session.`
          : betaMode
            ? `Unlock the ${label} download for $0 during beta. This models the future payment step while we collect testing feedback.`
            : `Review the forms included, missing items, and attorney-review warnings before purchase. After payment, you can download your completed document packet and filing checklist.`)}</p>
        ${paymentGateRouteWarningHtml(info.key)}
        ${legalDisclaimerHtml("checkout")}
      </div>
      <div class="payment-gate-panel">
        <strong>${escapeHtml(info.price)}</strong>
        <span>${escapeHtml(betaMode ? "Beta access" : "Free preview")}: ${escapeHtml(info.free)}</span>
        <span>${escapeHtml(betaMode ? "Future paid package" : "Paid package")}: ${escapeHtml(info.paid)}</span>
        <span>Refund policy: If you paid but have not downloaded your final packet, you may request a refund within 7 days. After download, refunds are limited to duplicate purchases or technical errors.</span>
        ${unlocked ? `
          <span class="badge">Unlocked ${escapeHtml(documentDate(cleanText(state.payment.unlockedAt).slice(0, 10)))}</span>
        ` : `
          <input type="email" data-payment-email value="${escapeAttr(state.payment.email)}" placeholder="Email for receipt / document delivery" />
          <select data-payment-audience>
            <option value="public" ${state.payment.exportAudience === "public" ? "selected" : ""}>Public user / print packet</option>
            <option value="attorney" ${state.payment.exportAudience === "attorney" ? "selected" : ""}>Attorney / e-file packet</option>
          </select>
          <select data-payment-delivery>
            <option value="download" ${state.payment.deliveryMode === "download" ? "selected" : ""}>Download now</option>
            <option value="secure_link" ${state.payment.deliveryMode === "secure_link" ? "selected" : ""}>Secure email link later</option>
          </select>
          <label class="inline-check">
            <input type="checkbox" data-payment-terms ${state.payment.agreedToTerms ? "checked" : ""} />
            <span>I understand that this service provides document automation and legal information, not legal advice. I understand that court or county staff may request additional information, forms, or steps depending on the facts of the estate.</span>
          </label>
          <button type="button" class="primary full-width" data-payment-unlock="${escapeAttr(info.key)}">${escapeHtml(betaMode ? "Unlock $0 beta downloads" : "Unlock final downloads")}</button>
        `}
      </div>
    </div>
  `;
}

function bindPaymentGate(root) {
  root.querySelectorAll("[data-payment-email]").forEach((input) => {
    input.addEventListener("input", () => {
      state.payment.email = input.value;
      state.account.email = input.value;
      saveState();
    });
  });
  root.querySelectorAll("[data-payment-audience]").forEach((input) => {
    input.addEventListener("change", () => {
      state.payment.exportAudience = input.value;
      saveState();
      renderFormsView();
    });
  });
  root.querySelectorAll("[data-payment-delivery]").forEach((input) => {
    input.addEventListener("change", () => {
      state.payment.deliveryMode = input.value;
      saveState();
    });
  });
  root.querySelectorAll("[data-payment-terms]").forEach((input) => {
    input.addEventListener("change", () => {
      state.payment.agreedToTerms = input.checked;
      saveState();
    });
  });
  root.querySelectorAll("[data-payment-unlock]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.payment.agreedToTerms) {
        setDownloadArea("Check the document-automation acknowledgement before unlocking final downloads.", "error");
        return;
      }
      recordConsent("DOCUMENT_DOWNLOAD_ACKNOWLEDGMENT", "I understand that this service provides document automation and legal information, not legal advice. I understand that court or county staff may request additional information, forms, or steps depending on the facts of the estate.", true, CONSENT_VERSIONS.download);
      state.payment.status = "paid";
      state.payment.productKey = button.dataset.paymentUnlock || documentProductKey();
      state.payment.unlockedAt = new Date().toISOString();
      if (state.payment.deliveryMode === "secure_link") {
        createSecureDeliveryRecord(state.payment.productKey);
      } else {
        saveState();
      }
      recordAnalyticsEvent("checkout_completed", { productKey: state.payment.productKey });
      recordAuditLog("checkout_completed", { productKey: state.payment.productKey });
      const nextStep = button.closest("[data-payment-next-step]")?.dataset.paymentNextStep;
      if (nextStep) {
        goToInterviewStep(nextStep);
      } else {
        renderInterview();
      }
      renderFormsView();
      renderReview();
      setDownloadArea(BETA_UNLOCK_ENABLED ? "Beta document downloads are unlocked for this session." : "Final document downloads are unlocked for this prototype session.", "success");
    });
  });
}

function requireProductUnlock(productKey, label = "final documents") {
  if (paymentUnlockedFor(productKey)) return true;
  renderFormsView();
  renderInterviewStatus();
  recordAnalyticsEvent("checkout_started", { productKey });
  setDownloadArea(`${BETA_UNLOCK_ENABLED ? "Beta preview" : "Free preview"} is ready. Unlock the ${productInfo(productKey).title} before downloading ${label}.`, "error");
  return false;
}

function requireFinalDocumentUnlock(label = "final documents") {
  return requireProductUnlock(documentProductKey(), label);
}

function renderOpeningDocsHandoff() {
  const readiness = openingDocumentReadiness();
  const result = openingPacketResults();
  const includedOpeningForms = result.formDetails.filter((item) => item.status === "included" && item.key !== "pr1811");
  const unlocked = paymentUnlockedFor(documentProductKey());
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="handoff-card ${readiness.ready ? "ready" : "warn"}">
      <p class="eyebrow">Opening packet checkpoint</p>
      <h3>${readiness.ready ? "Review complete. Unlock the opening packet when ready." : "Opening documents need a final review"}</h3>
      <p>${readiness.ready
        ? "Review the packet summary below. After the unlock step, the app will take you to one clean download and filing-instructions page."
        : "The app has enough structure to show the packet, but the items below should be resolved before printing or filing."}</p>
      <div id="guidedDownloadArea" class="download-area"></div>
    </div>
    <div class="flow-divider"><span>Review</span></div>
    ${openingReadinessDashboardHtml(readiness, result)}
    <details class="packet-review-block compact-review-block" ${readiness.ready ? "" : "open"}>
      <summary>Opening packet forms</summary>
      <div class="packet-form-list">${packetFormRowsHtml(includedOpeningForms)}</div>
    </details>
    ${readinessIssueListHtml("Before printing or filing", readiness.blockers, "", "blockers")}
    ${readinessIssueListHtml("Court or county will usually supply", readiness.courtSupplied, "warn", "courtSupplied")}
    ${readinessIssueListHtml("Review notes", readiness.reviewWarnings, "warn", "reviewWarnings")}
    ${readiness.ready ? `
      <div class="flow-divider"><span>${unlocked ? "Unlocked" : "Unlock"}</span></div>
      ${unlocked ? `
        <div class="handoff-card ready compact-handoff-card">
          <p class="eyebrow">Downloads unlocked</p>
          <h3>Continue to download and print.</h3>
          <p>The next page has the opening packet ZIP and the filing checklist.</p>
          <div class="handoff-actions single-action">
            <button type="button" class="primary" data-continue-opening-download>Continue</button>
          </div>
        </div>
      ` : paymentGateHtml("opening")}
    ` : `
      <div class="guided-note warn">
        <p>Fix the must-fix items above before unlocking or downloading the final opening packet.</p>
      </div>
    `}
  `;
  wrapper.querySelector("[data-continue-opening-download]")?.addEventListener("click", () => goToInterviewStep("opening-filing-instructions"));
  bindPaymentGate(wrapper);
  bindReadinessIssueButtons(wrapper, readiness);
  bindIssueJumpButtons(wrapper);
  return wrapper;
}

function openingFilingInstructionsMessage() {
  const readiness = openingDocumentReadiness();
  if (!readiness.ready) return readiness.blockers[0] || "Finish the opening packet review before relying on final filing instructions.";
  return "";
}

function openingCountyFilingNotesHtml() {
  const notes = cleanText(state.countyDefaults.localNotes)
    .split(/\n+/)
    .map((note) => cleanText(note))
    .filter(Boolean);
  const rows = [
    ["County", state.estate.county || "Not selected"],
    ["Probate office", state.countyDefaults.probateOfficeName || state.countyDefaults.courthouseCounty || "Confirm with county"],
    ["Courthouse address", state.countyDefaults.courthouseAddress || state.notice1804.courthouseAddress || state.notice1805.courthouseAddress || "Confirm with county"],
    ["Publication newspaper", publicationNewspaperForDecision() || "Confirm with probate office"],
    ["Last verified", state.countyDefaults.lastVerified || "Not verified"]
  ];
  return `
    <div class="filing-instruction-notes">
      <h4>County filing details</h4>
      <div class="instruction-note-grid">
        ${rows.map(([label, value]) => `
          <div class="instruction-note-row">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `).join("")}
      </div>
      ${notes.length ? `
        <div class="guided-note">
          ${notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function filingInstructionCardHtml(group, index) {
  return `
    <section class="filing-instruction-card">
      <div class="instruction-step-badge">${index + 1}</div>
      <div>
        <h4>${escapeHtml(group.title)}</h4>
        <ul>
          ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function renderOpeningFilingInstructions() {
  const readiness = openingDocumentReadiness();
  const result = openingPacketResults();
  const groups = openingFilingGroups(result);
  const unlocked = paymentUnlockedFor(documentProductKey());
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat filing-instructions-screen";
  wrapper.innerHTML = `
    <div class="handoff-card ${readiness.ready ? "ready" : "warn"} filing-instructions-hero">
      <p class="eyebrow">${unlocked ? "Download and print" : "Final handoff"}</p>
      <h3>${readiness.ready ? "Opening Packet Filing Instructions" : "Finish the packet before filing"}</h3>
      <p>${readiness.ready
        ? unlocked
          ? "Download the ZIP, print or review the documents, then use the checklist below for signing, filing, service, publication, and waiting for letters."
          : "The packet is ready, but final downloads need to be unlocked before the ZIP can be downloaded."
        : "The filing instructions are shown as a preview, but the must-fix items should be resolved before anyone signs, files, serves, publishes, or relies on this packet."}</p>
      ${unlocked ? `
        <div class="handoff-actions single-action">
          <button type="button" class="primary" data-export-final-opening-packet ${readiness.ready ? "" : "disabled"}>Download opening packet ZIP</button>
        </div>
      ` : ""}
      <div id="guidedDownloadArea" class="download-area"></div>
    </div>
    ${readinessIssueListHtml("Before signing, filing, serving, or publishing", readiness.blockers, "", "blockers")}
    ${readinessIssueListHtml("Court or county will usually supply", readiness.courtSupplied, "warn", "courtSupplied")}
    ${readinessIssueListHtml("Review notes", readiness.reviewWarnings, "warn", "reviewWarnings")}
    ${readiness.ready && !unlocked ? paymentGateHtml("filing") : ""}
    ${legalDisclaimerHtml("download")}
    <div class="filing-instruction-flow">
      ${groups.map(filingInstructionCardHtml).join("")}
    </div>
    ${openingCountyFilingNotesHtml()}
    <div class="guided-note">
      <p>Confirm local county practice before filing. This app is organizing the Wisconsin PR forms and workflow, but the probate office can still require county-specific details or corrections.</p>
    </div>
  `;
  wrapper.querySelector("[data-export-final-opening-packet]")?.addEventListener("click", (event) => exportOpeningPacket(event));
  bindPaymentGate(wrapper);
  bindReadinessIssueButtons(wrapper, readiness);
  bindIssueJumpButtons(wrapper);
  return wrapper;
}

function postOpeningHandoffMessage() {
  if (!hasValue(state.deadlines.lettersIssuedDate)) return "Enter the date domiciliary letters were issued when available. You can still draft inventory before then.";
  if (!hasValue(state.deadlines.inventoryDueDate)) return "Add the inventory deadline from the court notice, or use the six-month starter target and confirm it.";
  return "";
}

function openingClaimDeadline() {
  const decision = openingPathDecision();
  return decision.key === "notice"
    ? state.notice1805.claimDeadline || state.deadlines.claimDeadline
    : state.notice1804.claimDeadline || state.deadlines.claimDeadline;
}

function addMonthsIsoDate(value, months) {
  const raw = cleanText(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const result = new Date(year, month + months, day);
  if (result.getDate() !== day) result.setDate(0);
  const yyyy = result.getFullYear();
  const mm = String(result.getMonth() + 1).padStart(2, "0");
  const dd = String(result.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function suggestedInventoryDueDate() {
  return addMonthsIsoDate(state.deadlines.lettersIssuedDate, 6);
}

function renderPostOpeningHandoff() {
  const lettersIssued = hasValue(state.deadlines.lettersIssuedDate);
  const suggestedInventoryDate = suggestedInventoryDueDate();
  const claimDeadline = openingClaimDeadline();
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="handoff-card ${lettersIssued ? "ready" : "warn"}">
      <p class="eyebrow">Administration handoff</p>
      <h3>${lettersIssued ? "Switching into administration mode" : "Waiting for domiciliary letters"}</h3>
      <p>${lettersIssued
        ? "Now track the court-issued deadlines, start or finish PR-1811 Inventory, and watch the creditor claims period before distribution."
        : "The opening packet can be filed first. Once the court issues domiciliary letters, come back here to enter the appointment date and deadlines."}</p>
    </div>
    <div class="post-opening-grid">
      <div class="guided-person-card">
        <h3>Court and appointment dates</h3>
        <div class="grid two compact">
          <label>Case number
            <input data-guided-path="estate.caseNumber" value="${escapeAttr(state.estate.caseNumber)}" placeholder="Blank until assigned" />
          </label>
          <label>Domiciliary letters issued
            <input type="date" data-guided-path="deadlines.lettersIssuedDate" value="${escapeAttr(state.deadlines.lettersIssuedDate)}" />
          </label>
          <label>First publication date
            <input type="date" data-guided-path="deadlines.firstPublicationDate" value="${escapeAttr(state.deadlines.firstPublicationDate)}" />
          </label>
          <label>Proof of publication received
            <input type="date" data-guided-path="deadlines.proofPublicationReceivedDate" value="${escapeAttr(state.deadlines.proofPublicationReceivedDate)}" />
          </label>
        </div>
      </div>
      <div class="guided-person-card">
        <h3>Inventory and claims deadlines</h3>
        <div class="grid two compact">
          <label>Claims deadline
            <input type="date" data-guided-path="deadlines.claimDeadline" value="${escapeAttr(state.deadlines.claimDeadline || claimDeadline)}" />
          </label>
          <label>Inventory due date
            <input type="date" data-guided-path="deadlines.inventoryDueDate" value="${escapeAttr(state.deadlines.inventoryDueDate)}" />
          </label>
          <label>Inventory filed date
            <input type="date" data-guided-path="deadlines.inventoryFiledDate" value="${escapeAttr(state.deadlines.inventoryFiledDate)}" />
          </label>
          <label>Closing review target
            <input type="date" data-guided-path="deadlines.closingReviewDate" value="${escapeAttr(state.deadlines.closingReviewDate)}" />
          </label>
        </div>
        <div class="handoff-actions compact-actions">
          ${claimDeadline && !state.deadlines.claimDeadline ? `<button type="button" class="secondary" data-copy-claim-deadline>Use notice claim deadline (${escapeHtml(documentDate(claimDeadline))})</button>` : ""}
          ${suggestedInventoryDate && !state.deadlines.inventoryDueDate ? `<button type="button" class="secondary" data-use-inventory-target>Use six-month inventory target (${escapeHtml(documentDate(suggestedInventoryDate))})</button>` : ""}
          <button type="button" class="primary" data-continue-inventory>Continue to inventory</button>
        </div>
      </div>
    </div>
    <div class="filing-room">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Next administration tasks</p>
          <h3>${lettersIssued ? "What to do after appointment" : "What waits until appointment"}</h3>
        </div>
        <span class="badge ${lettersIssued ? "" : "warn"}">${lettersIssued ? "Letters issued" : "Not issued yet"}</span>
      </div>
      <div class="filing-room-grid">
        <section class="filing-room-panel">
          <h4>Inventory</h4>
          <ul>
            <li>Start PR-1811 with probate assets and date-of-death values.</li>
            <li>Use the court's inventory deadline if it differs from any starter target.</li>
          </ul>
        </section>
        <section class="filing-room-panel">
          <h4>Claims</h4>
          <ul>
            <li>Track the claim deadline from PR-1804 or PR-1805.</li>
            <li>Do not distribute too early without reviewing creditor claims and expenses.</li>
          </ul>
        </section>
        <section class="filing-room-panel">
          <h4>Service</h4>
          <ul>
            <li>Use PR-1817 later for inventory, account, and closing papers that are served.</li>
            <li>Keep proofs of publication and service with the case file.</li>
          </ul>
        </section>
      </div>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-copy-claim-deadline]")?.addEventListener("click", () => {
    state.deadlines.claimDeadline = claimDeadline;
    saveState();
    renderTaskTracker();
    renderReview();
    renderInterview();
  });
  wrapper.querySelector("[data-use-inventory-target]")?.addEventListener("click", () => {
    state.deadlines.inventoryDueDate = suggestedInventoryDate;
    saveState();
    renderTaskTracker();
    renderReview();
    renderInterview();
  });
  wrapper.querySelector("[data-continue-inventory]")?.addEventListener("click", () => goToInterviewStep("inventory-starter"));
  return wrapper;
}

function guidedChoiceButtonHtml(path, value, label, detail = "") {
  const selected = valuesEqual(getPath(path), value);
  return `
    <button type="button" class="choice-button ${selected ? "selected" : ""}" aria-pressed="${selected ? "true" : "false"}" data-guided-choice-path="${escapeAttr(path)}" data-guided-choice-value="${escapeAttr(value)}">
      <strong>${escapeHtml(label)}</strong>
      ${detail ? `<span>${escapeHtml(detail)}</span>` : ""}
    </button>
  `;
}

function renderOpeningPathInterview() {
  const decision = openingPathDecision();
  const serviceSummary = interestedPersonServiceSummary();
  const noticeLikely = decision.key === "notice" || serviceSummary.requiresNotice || serviceSummary.unknownOrMissingCount > 0 || state.opening.waiverStatus === "not_all" || state.opening.unknownInterestedPersonsStatus === "some_unknown";
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="guided-person-card">
      <h3>Can everyone sign a PR-1803 waiver?</h3>
      <div class="choice-grid stacked-choice-grid">
        ${guidedChoiceButtonHtml("opening.waiverStatus", "all_signed", "Yes", "All known interested persons can sign or have signed.")}
        ${guidedChoiceButtonHtml("opening.waiverStatus", "not_all", "No", "At least one person cannot, will not, or should not sign.")}
        ${guidedChoiceButtonHtml("opening.waiverStatus", "unknown", "Not sure", "Keep gathering information before choosing the packet.")}
      </div>
    </div>
    ${state.opening.waiverStatus === "all_signed" ? `
      <div class="guided-person-card">
        <h3>How should the waiver be signed?</h3>
        <div class="choice-grid stacked-choice-grid">
          ${guidedChoiceButtonHtml("waiver.signatureMode", "single", "One shared waiver", "All available signers sign the same PR-1803.")}
          ${guidedChoiceButtonHtml("waiver.signatureMode", "individual", "Separate waiver for each signer", "Create one PR-1803 per person for easier mailing or email routing.")}
        </div>
      </div>
    ` : ""}
    <div class="guided-person-card">
      <h3>Is anyone unknown or not located?</h3>
      <div class="choice-grid">
        ${guidedChoiceButtonHtml("opening.unknownInterestedPersonsStatus", "none", "No", "All known interested persons are identified and located.")}
        ${guidedChoiceButtonHtml("opening.unknownInterestedPersonsStatus", "some_unknown", "Yes", "Someone is unknown, missing, or not reasonably ascertainable.")}
      </div>
      ${state.opening.unknownInterestedPersonsStatus === "some_unknown" ? `
        <label class="interview-label">Unknown names or addresses
          <textarea rows="3" data-guided-path="notice1805.unknownInterestedPersons">${escapeHtml(state.notice1805.unknownInterestedPersons)}</textarea>
        </label>
      ` : ""}
    </div>
    ${state.opening.waiverStatus === "not_all" || state.opening.waiverStatus === "unknown" ? `
      <div class="guided-person-card">
        <h3>Why might notice be needed?</h3>
        <div class="grid two compact">
          <label>Reason
            <select data-guided-path="opening.noticeReason">
              <option value="">Select</option>
              <option value="refuses" ${state.opening.noticeReason === "refuses" ? "selected" : ""}>Someone will not sign</option>
              <option value="minor" ${state.opening.noticeReason === "minor" ? "selected" : ""}>Minor or protected person</option>
              <option value="not_found" ${state.opening.noticeReason === "not_found" ? "selected" : ""}>Someone cannot be found</option>
              <option value="unknown_person" ${state.opening.noticeReason === "unknown_person" ? "selected" : ""}>Unknown interested person</option>
              <option value="other" ${state.opening.noticeReason === "other" ? "selected" : ""}>Other reason</option>
            </select>
          </label>
          <label>Who cannot sign or should receive notice?
            <input data-guided-path="opening.peopleWhoCannotSign" value="${escapeAttr(state.opening.peopleWhoCannotSign)}" />
          </label>
          <label>Who cannot be found?
            <input data-guided-path="opening.peopleNotFound" value="${escapeAttr(state.opening.peopleNotFound)}" />
          </label>
          <label>Publication newspaper
            <input data-guided-path="notice1805.newspaperName" value="${escapeAttr(state.notice1805.newspaperName)}" />
          </label>
        </div>
        <label class="interview-label">Publication or service notes
          <textarea rows="3" data-guided-path="opening.publicationNotes">${escapeHtml(state.opening.publicationNotes)}</textarea>
        </label>
      </div>
    ` : ""}
    ${noticeLikely ? `<div class="suggestion-empty">Notice path answers are being captured here; final filing details come in the readiness review.</div>` : ""}
  `;
  bindGuidedPathInputs(wrapper);
  bindGuidedChoiceButtons(wrapper);
  return wrapper;
}

function attorneyHandoffRecommended(data = state) {
  const route = probatePathDecision(data);
  const opening = openingPathDecision(data);
  return route.key === "attorney_review" || opening.key === "blocked_no_will" || data.will?.exists === "unknown";
}

function attorneyHandoffContactName(data = state) {
  return cleanText(data.attorneyHandoff?.contactName) || cleanText(data.applicant?.fullName);
}

function attorneyHandoffContactEmail(data = state) {
  return cleanText(data.attorneyHandoff?.contactEmail) || cleanText(data.applicant?.email);
}

function attorneyHandoffComplete() {
  if (!attorneyHandoffRecommended()) return true;
  if (!FEATURE_ATTORNEY_HANDOFF) return true;
  return Boolean(state.attorneyHandoff.consent && attorneyHandoffContactName() && attorneyHandoffContactEmail());
}

function attorneyHandoffMessage() {
  if (!FEATURE_ATTORNEY_HANDOFF) return "Attorney review is recommended. You may download an information summary and choose whether to contact a Wisconsin probate attorney.";
  if (!state.attorneyHandoff.consent) return "Consent is required before creating a share/export package.";
  if (!attorneyHandoffContactName()) return "Add a contact name for the handoff package.";
  if (!attorneyHandoffContactEmail()) return "Add a contact email for the handoff package.";
  return "Attorney handoff package can be exported.";
}

function attorneyHandoffIssueRows(data = state) {
  const route = probatePathDecision(data);
  const opening = openingPathDecision(data);
  const serviceSummary = interestedPersonServiceSummary(data);
  const issues = [
    ...(route.reasons || []),
    opening.key === "blocked_no_will" ? opening.detail : "",
    serviceSummary.protectedCount ? `${serviceSummary.protectedCount} minor/protected-person issue(s) flagged.` : "",
    serviceSummary.unknownOrMissingCount ? `${serviceSummary.unknownOrMissingCount} unknown or not-located interested person(s).` : "",
    serviceSummary.missingAddressCount ? `${serviceSummary.missingAddressCount} interested person address issue(s).` : ""
  ].map(cleanText).filter(Boolean);
  return [...new Set(issues)];
}

function renderAttorneyHandoff() {
  const route = probatePathDecision();
  const issues = attorneyHandoffIssueRows();
  const includeCaseData = state.attorneyHandoff.includeCaseData !== false;
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat attorney-handoff-screen";
  if (!FEATURE_ATTORNEY_HANDOFF) {
    wrapper.innerHTML = `
      ${routeResultHtml(route)}
      <div class="handoff-card warn">
        <p class="eyebrow">Recommended next step</p>
        <h3>Download your information summary</h3>
        <p>Your answers show issues that may make this estate more complicated. You can download your information summary and choose whether to contact a Wisconsin probate attorney.</p>
        <div class="handoff-issue-list">
          ${(issues.length ? issues : ["Attorney review is recommended based on your answers."]).slice(0, 6).map((issue) => `<span>${escapeHtml(issue)}</span>`).join("")}
        </div>
      </div>
      <div class="guided-person-card">
        <h3>What happens next?</h3>
        <p>The software will not send your information to any attorney or law firm. The download is for you to keep and decide whether to share.</p>
        ${legalDisclaimerHtml("attorney-review")}
        <div class="handoff-actions">
          <button type="button" class="primary" data-export-information-summary>Download my information summary</button>
          <button type="button" class="secondary" data-continue-after-handoff>Continue the intake anyway</button>
        </div>
        <div id="guidedDownloadArea" class="download-area"></div>
      </div>
    `;
    wrapper.querySelector("[data-export-information-summary]")?.addEventListener("click", (event) => exportInformationSummary(event));
    wrapper.querySelector("[data-continue-after-handoff]")?.addEventListener("click", () => goToInterviewStep("opening-docs-ready"));
    return wrapper;
  }
  wrapper.innerHTML = `
    ${routeResultHtml(route)}
    <div class="handoff-card warn">
      <p class="eyebrow">Neutral handoff</p>
      <h3>Create a case file for attorney review</h3>
      <p>This package is for the user to review and choose whether to share. It does not select an attorney, sell a referral, or send anything automatically.</p>
      <div class="handoff-issue-list">
        ${(issues.length ? issues : ["The Wisconsin Probate Check says attorney review may be appropriate."]).slice(0, 6).map((issue) => `<span>${escapeHtml(issue)}</span>`).join("")}
      </div>
    </div>
    <div class="guided-person-card">
      <h3>Who should be the contact for attorney review?</h3>
      <div class="grid two compact">
        <label>Contact name
          <input data-guided-path="attorneyHandoff.contactName" value="${escapeAttr(attorneyHandoffContactName())}" />
        </label>
        <label>Contact email
          <input type="email" data-guided-path="attorneyHandoff.contactEmail" value="${escapeAttr(attorneyHandoffContactEmail())}" />
        </label>
        <label>Contact phone
          <input type="tel" data-guided-path="attorneyHandoff.contactPhone" value="${escapeAttr(state.attorneyHandoff.contactPhone || state.applicant.phone)}" />
        </label>
        <label>County
          <input data-guided-path="attorneyHandoff.county" value="${escapeAttr(state.attorneyHandoff.county || state.estate.county)}" />
        </label>
      </div>
      <label class="interview-label">Notes for attorney review
        <textarea rows="3" data-guided-path="attorneyHandoff.notes" placeholder="Questions, urgency, assets, disputes, or known filing deadlines">${escapeHtml(state.attorneyHandoff.notes)}</textarea>
      </label>
      <label class="inline-check">
        <input type="checkbox" data-guided-path="attorneyHandoff.includeCaseData" ${includeCaseData ? "checked" : ""} />
        <span>Include the structured case-data JSON in the package.</span>
      </label>
      <label class="inline-check">
        <input type="checkbox" data-guided-path="attorneyHandoff.consent" ${state.attorneyHandoff.consent ? "checked" : ""} />
        <span>The user consents to creating a package they may choose to share with an attorney.</span>
      </label>
      <div class="handoff-actions">
        <button type="button" class="primary" data-export-attorney-handoff>Download attorney handoff ZIP</button>
        <button type="button" class="secondary" data-continue-after-handoff>Continue the intake anyway</button>
      </div>
      <div id="guidedDownloadArea" class="download-area"></div>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-export-attorney-handoff]")?.addEventListener("click", (event) => exportAttorneyHandoff(event));
  wrapper.querySelector("[data-continue-after-handoff]")?.addEventListener("click", () => goToInterviewStep("opening-docs-ready"));
  return wrapper;
}

function bindGuidedChoiceButtons(root) {
  root.querySelectorAll("[data-guided-choice-path]").forEach((button) => {
    button.addEventListener("click", () => {
      const path = button.dataset.guidedChoicePath;
      const value = button.dataset.guidedChoiceValue;
      setPath(path, value);
      if (path === "opening.waiverStatus" && value === "all_signed") {
        state.opening.unknownInterestedPersonsStatus = "none";
      }
      if (path === "opening.unknownInterestedPersonsStatus" && value === "some_unknown" && !hasValue(state.opening.waiverStatus)) {
        state.opening.waiverStatus = "not_all";
      }
      if (path === "opening.unknownInterestedPersonsStatus" && value === "some_unknown" && state.opening.waiverStatus === "all_signed") {
        state.opening.waiverStatus = "not_all";
      }
      if (path.startsWith("heirship.children.")) {
        if (path === "heirship.children.exists" && value === "yes" && !state.heirship.children.people.some(hasHeirshipChildContent)) {
          state.heirship.children.people = [emptyHeirshipChild()];
        }
        syncHeirshipChildrenList();
        renderHeirshipChildren();
        renderInterestedSuggestions();
      }
      saveState();
      renderFields();
      renderReview();
      renderInterview();
    });
  });
}

function inventoryCategoryPresets() {
  return [
    { category: "Bank account", label: "Bank account", detail: "Checking, savings, CDs, and cash accounts.", placeholder: "Bank name, account type, last four digits" },
    { category: "Vehicle", label: "Vehicle", detail: "Cars, trucks, boats, trailers, and titled vehicles.", placeholder: "Year, make, model, VIN or title details" },
    { category: "Real estate", label: "Real estate", detail: "Residence, land, condos, and rental property.", placeholder: "Street address and legal description summary" },
    { category: "Investment", label: "Investment", detail: "Brokerage, stocks, bonds, and mutual funds.", placeholder: "Institution, account type, last four digits" },
    { category: "Personal property", label: "Personal property", detail: "Household goods, jewelry, tools, collections.", placeholder: "Describe the property group or item" },
    { category: "Business interest", label: "Business interest", detail: "LLC, corporation, partnership, or sole-proprietor value.", placeholder: "Entity name, ownership percentage, valuation note" }
  ];
}

function inventoryCategoryPreset(category) {
  return inventoryCategoryPresets().find((preset) => preset.category === category) || { placeholder: "Describe the estate property" };
}

function inventoryCategoryOptionsHtml(category) {
  const options = ["", ...inventoryCategoryPresets().map((preset) => preset.category), "Other"];
  return options.map((option) => {
    const label = option || "Select";
    return `<option value="${escapeAttr(option)}" ${category === option ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function inventoryItemHasContent(item = {}) {
  return [item.category, item.description, item.value, item.encumbrance, item.notes].some(hasValue) || Boolean(item.marital);
}

function guidedInventoryComplete() {
  const items = state.inventory.items.filter(inventoryItemHasContent);
  if (!items.length) return false;
  return items.every((item) => hasValue(item.description) && hasValue(item.value));
}

function guidedInventoryMessage() {
  const items = state.inventory.items.filter(inventoryItemHasContent);
  if (!items.length) return "Add at least one starter inventory item.";
  const incomplete = items.filter((item) => !hasValue(item.description) || !hasValue(item.value)).length;
  return incomplete ? `${incomplete} inventory item${incomplete === 1 ? "" : "s"} still need a description or date-of-death value.` : "";
}

function addInventoryItemWithCategory(category = "") {
  const blankIndex = state.inventory.items.findIndex((item) => !inventoryItemHasContent(item));
  const next = emptyInventoryItem(category);
  if (blankIndex >= 0) {
    state.inventory.items[blankIndex] = next;
  } else {
    state.inventory.items.push(next);
  }
  saveState();
}

function renderGuidedInventoryWizard() {
  if (!state.inventory.items.length) state.inventory.items.push(emptyInventoryItem());
  const contentItems = state.inventory.items.filter(inventoryItemHasContent);
  const totals = inventoryTotals();
  const addBlankItem = () => {
    state.inventory.items.push(emptyInventoryItem());
    saveState();
    renderInventoryItems();
    renderReview();
    renderInterview();
  };
  const wrapper = document.createElement("div");
  wrapper.className = "guided-repeat";
  wrapper.innerHTML = `
    <div class="contact-status-grid">
      <div class="contact-stat">
        <span>${contentItems.length}</span>
        <p>Inventory items started</p>
      </div>
      <div class="contact-stat ${guidedInventoryComplete() ? "" : "warn"}">
        <span data-guided-inventory-total>$${currencyText(totals.value)}</span>
        <p>Gross date-of-death value</p>
      </div>
    </div>
    <div class="inventory-type-grid">
      ${inventoryCategoryPresets().map((preset) => `
        <button type="button" class="inventory-type-button" data-add-inventory-type="${escapeAttr(preset.category)}">
          <strong>${escapeHtml(preset.label)}</strong>
          <span>${escapeHtml(preset.detail)}</span>
        </button>
      `).join("")}
    </div>
    <div class="guided-card-list">
      ${state.inventory.items.map((item, index) => guidedInventoryItemHtml(item, index)).join("")}
    </div>
    <div class="list-bottom-actions">
      <button type="button" class="secondary" data-add-guided-inventory-blank>Add item</button>
    </div>
  `;
  bindGuidedPathInputs(wrapper);
  wrapper.querySelector("[data-add-guided-inventory-blank]")?.addEventListener("click", addBlankItem);
  wrapper.querySelectorAll("[data-add-inventory-type]").forEach((button) => {
    button.addEventListener("click", () => {
      addInventoryItemWithCategory(button.dataset.addInventoryType);
      renderInventoryItems();
      renderReview();
      renderInterview();
    });
  });
  wrapper.querySelectorAll("[data-remove-guided-inventory]").forEach((button) => {
    button.addEventListener("click", () => {
      state.inventory.items.splice(Number(button.dataset.removeGuidedInventory), 1);
      if (!state.inventory.items.length) state.inventory.items.push(emptyInventoryItem());
      saveState();
      renderInventoryItems();
      renderReview();
      renderInterview();
    });
  });
  return wrapper;
}

function guidedInventoryItemHtml(item, index) {
  const preset = inventoryCategoryPreset(item.category);
  return `
    <div class="guided-person-card">
      <div class="row-heading">
        <div>
          <h3>Inventory item ${index + 1}</h3>
          <p>Use the lien field for mortgages, car loans, or other charges against this item.</p>
        </div>
        <button type="button" class="ghost" data-remove-guided-inventory="${index}">Remove</button>
      </div>
      <div class="grid two compact">
        <label>Category
          <select data-guided-path="inventory.items.${index}.category">
            ${inventoryCategoryOptionsHtml(item.category)}
          </select>
        </label>
        <label>Date-of-death value
          <input data-guided-path="inventory.items.${index}.value" value="${escapeAttr(item.value)}" inputmode="decimal" placeholder="0.00" />
        </label>
        <label>Description
          <input data-guided-path="inventory.items.${index}.description" value="${escapeAttr(item.description)}" placeholder="${escapeAttr(preset.placeholder)}" />
        </label>
        <label>Lien, mortgage, loan, or charge
          <input data-guided-path="inventory.items.${index}.encumbrance" value="${escapeAttr(item.encumbrance)}" inputmode="decimal" placeholder="0.00" />
        </label>
        <label>Notes
          <input data-guided-path="inventory.items.${index}.notes" value="${escapeAttr(item.notes)}" placeholder="Valuation source, title status, or follow-up" />
        </label>
      </div>
      <label class="checkline">
        <input type="checkbox" data-guided-path="inventory.items.${index}.marital" ${item.marital ? "checked" : ""} />
        Marital property interest
      </label>
    </div>
  `;
}

function updateGuidedInventoryTotals() {
  const target = document.querySelector("[data-guided-inventory-total]");
  if (!target) return;
  target.textContent = `$${currencyText(inventoryTotals().value)}`;
}

function bindSteps() {
  document.querySelectorAll(".step").forEach((button) => {
    button.addEventListener("click", () => {
      activateEditStep(button.dataset.step);
    });
  });
}

function renderHeirshipChildren() {
  const list = document.getElementById("heirshipChildList");
  if (!list) return;
  syncHeirshipChildrenList(state, { persist: false });
  list.innerHTML = "";
  state.heirship.children.people.forEach((child, index) => {
    const normalized = normalizeHeirshipChild(child);
    state.heirship.children.people[index] = normalized;
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <div class="row-heading">
        <h3>Child ${index + 1}</h3>
        <button type="button" class="ghost" data-remove-heirship-child="${index}">Remove</button>
      </div>
      ${partyPickerHtml("heirshipChild", index)}
      <div class="grid two compact">
        <label>Name
          <input data-heirship-child-field="name" data-heirship-child-index="${index}" value="${escapeAttr(normalized.name)}" />
        </label>
        <label>Living status
          <select data-heirship-child-field="livingStatus" data-heirship-child-index="${index}">
            <option value="living" ${normalized.livingStatus === "living" ? "selected" : ""}>Living</option>
            <option value="deceased" ${normalized.livingStatus === "deceased" ? "selected" : ""}>Deceased</option>
            <option value="unknown" ${normalized.livingStatus === "unknown" ? "selected" : ""}>Unknown</option>
          </select>
        </label>
        <label>Mailing address
          <input data-heirship-child-field="address" data-heirship-child-index="${index}" value="${escapeAttr(normalized.address)}" />
        </label>
        <label>Minor date of birth
          <input type="date" data-heirship-child-field="minorDateOfBirth" data-heirship-child-index="${index}" value="${escapeAttr(normalized.minorDateOfBirth)}" />
        </label>
        <label>Notes
          <input data-heirship-child-field="notes" data-heirship-child-index="${index}" value="${escapeAttr(normalized.notes)}" placeholder="Adopted, deceased date, descendants, or follow-up" />
        </label>
      </div>
    `;
    list.appendChild(card);
  });
  const actions = document.createElement("div");
  actions.className = "list-bottom-actions";
  actions.innerHTML = `<button type="button" class="secondary" data-add-heirship-child>Add child</button>`;
  list.appendChild(actions);
  applyAddressPlaceholders(list);

  bindPartyPickers(list);
  list.querySelectorAll("[data-heirship-child-field]").forEach((input) => {
    const update = () => {
      const index = Number(input.dataset.heirshipChildIndex);
      state.heirship.children.people[index] = normalizeHeirshipChild(state.heirship.children.people[index]);
      state.heirship.children.people[index][input.dataset.heirshipChildField] = input.value;
      syncHeirshipChildrenList();
      saveState();
      renderInterestedSuggestions();
      renderReview();
      renderInterviewStatus();
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
  list.querySelector("[data-add-heirship-child]")?.addEventListener("click", addHeirshipChild);
  list.querySelectorAll("[data-remove-heirship-child]").forEach((button) => {
    button.addEventListener("click", () => {
      state.heirship.children.people.splice(Number(button.dataset.removeHeirshipChild), 1);
      if (!state.heirship.children.people.length) state.heirship.children.people.push(emptyHeirshipChild());
      syncHeirshipChildrenList();
      saveState();
      renderHeirshipChildren();
      renderInterestedSuggestions();
      renderReview();
      renderInterviewStatus();
    });
  });
}

function addHeirshipChild() {
  if (state.heirship.children.exists !== "yes") state.heirship.children.exists = "yes";
  state.heirship.children.people.push(emptyHeirshipChild());
  syncHeirshipChildrenList();
  saveState();
  renderFields();
  renderHeirshipChildren();
  renderInterestedSuggestions();
  renderReview();
  renderInterviewStatus();
}

function renderWillBeneficiaries() {
  const list = document.getElementById("willBeneficiaryList");
  if (!list) return;
  list.innerHTML = "";
  state.willBeneficiaries.forEach((person, index) => {
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <div class="row-heading">
        <h3>Beneficiary ${index + 1}</h3>
        <button type="button" class="ghost" data-remove-beneficiary="${index}">Remove</button>
      </div>
      ${partyPickerHtml("willBeneficiary", index)}
      <div class="grid two compact">
        <label>Name
          <input data-beneficiary-field="name" data-beneficiary-index="${index}" value="${escapeAttr(person.name)}" />
        </label>
        <label>Role
          <select data-beneficiary-field="role" data-beneficiary-index="${index}">
            <option value="beneficiary" ${person.role === "beneficiary" ? "selected" : ""}>Will beneficiary</option>
            <option value="codicil_beneficiary" ${person.role === "codicil_beneficiary" ? "selected" : ""}>Codicil beneficiary</option>
            <option value="trust_beneficiary" ${person.role === "trust_beneficiary" ? "selected" : ""}>Trust beneficiary</option>
            <option value="trustee" ${person.role === "trustee" ? "selected" : ""}>Trustee</option>
            <option value="entity" ${person.role === "entity" ? "selected" : ""}>Organization or charity</option>
            <option value="other" ${person.role === "other" ? "selected" : ""}>Other person named in will</option>
          </select>
        </label>
        <label>Relationship or description
          <input data-beneficiary-field="relationship" data-beneficiary-index="${index}" value="${escapeAttr(person.relationship)}" placeholder="Child, charity, friend, trust beneficiary" />
        </label>
        <label>Mailing address
          <input data-beneficiary-field="address" data-beneficiary-index="${index}" value="${escapeAttr(person.address)}" />
        </label>
        <label>Minor date of birth
          <input type="date" data-beneficiary-field="minorDateOfBirth" data-beneficiary-index="${index}" value="${escapeAttr(person.minorDateOfBirth)}" />
        </label>
        <label>Notes
          <input data-beneficiary-field="notes" data-beneficiary-index="${index}" value="${escapeAttr(person.notes)}" />
        </label>
      </div>
    `;
    list.appendChild(card);
  });
  const actions = document.createElement("div");
  actions.className = "list-bottom-actions";
  actions.innerHTML = `<button type="button" class="secondary" data-add-beneficiary-bottom>Add beneficiary</button>`;
  list.appendChild(actions);
  applyAddressPlaceholders(list);

  bindPartyPickers(list);
  list.querySelector("[data-add-beneficiary-bottom]")?.addEventListener("click", addWillBeneficiary);
  list.querySelectorAll("[data-beneficiary-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.beneficiaryIndex);
      state.willBeneficiaries[index][input.dataset.beneficiaryField] = input.value;
      saveState();
      renderInterestedSuggestions();
      renderReview();
    });
    input.addEventListener("change", () => {
      const index = Number(input.dataset.beneficiaryIndex);
      state.willBeneficiaries[index][input.dataset.beneficiaryField] = input.value;
      saveState();
      renderInterestedSuggestions();
      renderReview();
    });
  });

  list.querySelectorAll("[data-remove-beneficiary]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeBeneficiary);
      state.willBeneficiaries.splice(index, 1);
      if (!state.willBeneficiaries.length) state.willBeneficiaries.push(emptyWillBeneficiary());
      saveState();
      renderWillBeneficiaries();
      renderInterestedSuggestions();
      renderReview();
    });
  });
}

function addWillBeneficiary() {
  state.will.hasNamedBeneficiaries = "yes";
  state.willBeneficiaries.push(emptyWillBeneficiary());
  saveState();
  renderWillBeneficiaries();
  renderInterestedSuggestions();
  renderReview();
}

function roleCheckboxHtml(index, role, label) {
  const person = normalizeInterestedPerson(state.interestedPersons[index]);
  return `
    <label class="checkline role-check">
      <input type="checkbox" data-person-role="${role}" data-person-index="${index}" ${person.roles[role] ? "checked" : ""} />
      ${label}
    </label>
  `;
}

function waiverStatusOptionsHtml(selected = "") {
  return [
    ["", "Select"],
    ["can_sign", "Can sign waiver"],
    ["cannot_sign", "Cannot sign waiver"],
    ["will_not_sign", "Will not sign"],
    ["not_eligible", "Not eligible to sign"],
    ["unknown", "Not sure yet"]
  ].map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
}

function locationStatusOptionsHtml(selected = "known") {
  return [
    ["known", "Address/person known"],
    ["missing_address", "Address missing"],
    ["cannot_locate", "Cannot locate"],
    ["unknown_person", "Unknown person"]
  ].map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
}

function serviceStatusBadgesHtml(person = {}) {
  const status = interestedPersonServiceStatus(person);
  const badges = [
    status.canSignWaiver ? ["", "Can sign waiver"] : null,
    status.needsMailedNotice ? ["warn", "Needs notice"] : null,
    status.unknownOrMissing ? ["bad", "Unknown/missing"] : null,
    status.protectedPerson ? ["warn", "Minor/protected"] : null,
    status.person.roles?.military ? ["warn", "Military review"] : null,
    status.addressKnown ? ["", "Address known"] : ["warn", "Address needed"]
  ].filter(Boolean);
  return `<div class="service-badges">${badges.map(([tone, label]) => `<span class="badge ${tone}">${escapeHtml(label)}</span>`).join("")}</div>`;
}

function relationshipFromRoles(person = {}) {
  const normalized = normalizeInterestedPerson(person);
  const roles = normalized.roles;
  const labels = [];
  if (roles.heir) labels.push("Heir");
  if (roles.beneficiary) labels.push("Beneficiary");
  if (roles.namedPr) labels.push("Named Personal Representative");
  if (roles.trustee) labels.push("Trustee");
  if (roles.trustBeneficiary) labels.push("Trust beneficiary");
  if (roles.minor) labels.push("Minor");
  if (roles.needsGuardian) labels.push("Guardian/agent information needed");
  if (normalized.service?.protectedPerson) labels.push("Protected person");
  if (roles.military) labels.push("Military service member");
  return relationshipText(labels);
}

function interestedRelationship(person = {}) {
  return relationshipText([person.relationship, relationshipFromRoles(person)]);
}

function rolesFromSuggestionRelationship(relationship) {
  const text = cleanText(relationship).toLowerCase();
  const trustBeneficiary = text.includes("trust beneficiary");
  const protectedPerson = text.includes("minor") || text.includes("protected person") || text.includes("guardian");
  return {
    heir: text.includes("heir") || text.includes("proof of heirship") || text.includes("surviving spouse") || text.includes("domestic partner"),
    beneficiary: text.includes("beneficiary") || text.includes("charity") || text.includes("organization"),
    namedPr: text.includes("personal representative") || text.includes("proposed pr") || text.includes("named pr"),
    trustee: text.includes("trustee") && !trustBeneficiary,
    trustBeneficiary,
    minor: protectedPerson && text.includes("minor"),
    needsGuardian: protectedPerson,
    military: text.includes("military") || text.includes("service member")
  };
}

function mergeInterestedRoles(...roleSets) {
  const roles = { ...emptyInterestedPerson().roles };
  roleSets.forEach((roleSet) => {
    Object.entries(roleSet || {}).forEach(([key, value]) => {
      if (value) roles[key] = true;
    });
  });
  return roles;
}

function personNameInList(name, listValue) {
  if (!hasValue(name) || !hasValue(listValue)) return false;
  return splitInterestedNames(listValue).some((item) => sameName(item, name));
}

function willBeneficiaryRolesForPerson(name) {
  const roles = {};
  if (state.will?.exists !== "yes") return roles;
  (state.willBeneficiaries || []).forEach((beneficiary) => {
    if (!sameName(beneficiary.name, name)) return;
    const role = beneficiary.role || "beneficiary";
    if (role === "trustee") roles.trustee = true;
    if (role === "trust_beneficiary") {
      roles.trustBeneficiary = true;
      roles.beneficiary = true;
    }
    if (role === "entity" || role === "beneficiary" || role === "codicil_beneficiary" || role === "other") {
      roles.beneficiary = true;
    }
    if (hasValue(beneficiary.minorDateOfBirth)) {
      roles.minor = true;
      roles.needsGuardian = true;
    }
  });
  return roles;
}

function heirshipRolesForPerson(name) {
  const roles = {};
  if (!hasValue(name)) return roles;
  if (sameName(name, state.heirship?.spouse?.name)) roles.heir = true;
  (state.heirship?.children?.people || []).forEach((child) => {
    if (!sameName(name, child.name)) return;
    roles.heir = true;
    if (hasValue(child.minorDateOfBirth)) {
      roles.minor = true;
      roles.needsGuardian = true;
    }
  });
  if (personNameInList(name, state.heirship?.children?.list)) roles.heir = true;
  if (personNameInList(name, state.heirship?.children?.deceasedChildDescendants)) roles.heir = true;
  if (personNameInList(name, state.heirship?.parents?.names)) roles.heir = true;
  if (personNameInList(name, state.heirship?.siblings?.names)) roles.heir = true;
  if (personNameInList(name, state.heirship?.siblings?.deceasedSiblingDescendants)) roles.heir = true;
  return roles;
}

function inferredInterestedRoles(person = {}, suggestion = {}) {
  const normalized = normalizeInterestedPerson(person);
  const name = normalized.name || suggestion.name || "";
  const text = relationshipText([
    normalized.relationship,
    suggestion.relationship,
    suggestion.source,
    suggestion.notes
  ]).toLowerCase();
  const roles = mergeInterestedRoles(
    normalized.roles,
    suggestion.roles,
    rolesFromSuggestionRelationship(text),
    willBeneficiaryRolesForPerson(name),
    heirshipRolesForPerson(name)
  );
  if (sameName(name, state.pr?.fullName) || sameName(name, state.will?.namedPr)) roles.namedPr = true;
  if (sameName(name, state.will?.namedTrustee) || sameName(name, state.will?.nominatedTrustee)) roles.trustee = true;
  if (hasValue(normalized.minorDateOfBirth) || hasValue(suggestion.minorDateOfBirth) || text.includes("minor")) {
    roles.minor = true;
    roles.needsGuardian = true;
  }
  if (text.includes("protected person") || text.includes("guardian")) roles.needsGuardian = true;
  if (text.includes("military") || text.includes("service member")) roles.military = true;
  return roles;
}

function inferredInterestedService(person = {}, suggestion = {}) {
  const normalized = normalizeInterestedPerson(person);
  const roles = inferredInterestedRoles(normalized, suggestion);
  const service = { ...emptyInterestedPerson().service, ...(suggestion.service || {}), ...(normalized.service || {}) };
  const locationStatus = service.locationStatus || "known";
  const hasAddress = hasValue(normalized.address || suggestion.address);
  const protectedPerson = Boolean(service.protectedPerson || roles.minor || roles.needsGuardian || hasValue(normalized.minorDateOfBirth) || hasValue(suggestion.minorDateOfBirth));
  const unknownOrMissing = ["cannot_locate", "unknown_person"].includes(locationStatus);
  const unableToWaive = ["cannot_sign", "will_not_sign", "not_eligible"].includes(service.waiverStatus);

  if (!hasAddress && locationStatus === "known") service.locationStatus = "missing_address";
  if (hasAddress && locationStatus === "missing_address") service.locationStatus = "known";
  if (protectedPerson) {
    service.protectedPerson = true;
    if (!["cannot_sign", "will_not_sign", "not_eligible", "unknown"].includes(service.waiverStatus)) {
      service.waiverStatus = "not_eligible";
    }
    service.needsMailedNotice = true;
  }
  if (unknownOrMissing) {
    service.needsMailedNotice = true;
    if (!["cannot_sign", "will_not_sign", "not_eligible", "unknown"].includes(service.waiverStatus)) {
      service.waiverStatus = "unknown";
    }
  }
  if (unableToWaive) service.needsMailedNotice = true;
  if (
    state.opening?.waiverStatus === "all_signed"
    && !hasValue(service.waiverStatus)
    && hasAddress
    && !protectedPerson
    && !unknownOrMissing
  ) {
    service.waiverStatus = "can_sign";
  }
  return service;
}

function applyInterestedPersonInferences(person = {}, suggestion = {}) {
  const normalized = normalizeInterestedPerson(person);
  if (!hasValue(normalized.name) && hasValue(suggestion.name)) normalized.name = cleanSuggestedPersonName(suggestion.name);
  normalized.relationship = relationshipText([normalized.relationship, suggestion.relationship]) || "Interested person";
  if (!hasValue(normalized.address) && hasValue(suggestion.address)) normalized.address = cleanText(suggestion.address);
  if (!hasValue(normalized.minorDateOfBirth) && hasValue(suggestion.minorDateOfBirth)) {
    normalized.minorDateOfBirth = cleanText(suggestion.minorDateOfBirth);
  }
  normalized.roles = inferredInterestedRoles(normalized, suggestion);
  normalized.service = inferredInterestedService(normalized, suggestion);
  return normalized;
}

function enrichInterestedSuggestion(suggestion = {}) {
  const enriched = {
    name: cleanSuggestedPersonName(suggestion.name),
    relationship: cleanText(suggestion.relationship),
    address: cleanText(suggestion.address),
    minorDateOfBirth: cleanText(suggestion.minorDateOfBirth),
    source: cleanText(suggestion.source),
    roles: mergeInterestedRoles(suggestion.roles, rolesFromSuggestionRelationship(relationshipText([suggestion.relationship, suggestion.source])))
  };
  if (hasValue(enriched.minorDateOfBirth)) {
    enriched.roles.minor = true;
    enriched.roles.needsGuardian = true;
  }
  enriched.service = inferredInterestedService(enriched, enriched);
  return enriched;
}

function interestedPersonFromSuggestion(suggestion = {}) {
  const enriched = enrichInterestedSuggestion(suggestion);
  return applyInterestedPersonInferences({
    name: enriched.name,
    relationship: enriched.relationship || "Interested person",
    address: enriched.address || "",
    minorDateOfBirth: enriched.minorDateOfBirth || "",
    roles: enriched.roles,
    service: enriched.service
  }, enriched);
}

function blankInterestedPerson(person = {}) {
  const normalized = normalizeInterestedPerson(person);
  const relationship = cleanText(normalized.relationship);
  const relationshipIsPlaceholder = comparableText(relationship) === "interested person";
  return !hasValue(normalized.name)
    && (!hasValue(relationship) || relationshipIsPlaceholder)
    && !hasValue(normalized.address)
    && !hasValue(normalized.minorDateOfBirth)
    && !hasValue(normalized.email)
    && !hasValue(normalized.phone)
    && !Object.values(normalized.roles || {}).some(Boolean);
}

function syncInterestedPersonRoster(options = {}) {
  const addMissing = Boolean(options.addMissing);
  const persist = options.persist !== false;
  const suggestions = interestedPersonSuggestions();
  let changed = false;
  const beforeCleanupCount = (state.interestedPersons || []).length;
  state.interestedPersons = removePartialPrefixInterestedPersons(state.interestedPersons || []);
  if (state.interestedPersons.length !== beforeCleanupCount) changed = true;
  state.interestedPersons = (state.interestedPersons || []).map((person) => {
    if (blankInterestedPerson(person)) return normalizeInterestedPerson(person);
    const suggestion = suggestions.find((item) => sameName(item.name, person.name));
    const next = applyInterestedPersonInferences(person, suggestion);
    if (JSON.stringify(next) !== JSON.stringify(normalizeInterestedPerson(person))) changed = true;
    return next;
  });
  if (addMissing) {
    suggestions.forEach((suggestion) => {
      if (existingInterestedPersonIndex(suggestion.name) >= 0) return;
      const person = interestedPersonFromSuggestion(suggestion);
      const blankIndex = state.interestedPersons.findIndex(blankInterestedPerson);
      if (blankIndex >= 0) {
        state.interestedPersons[blankIndex] = person;
      } else {
        state.interestedPersons.push(person);
      }
      changed = true;
    });
  }
  if (!state.interestedPersons.length) {
    state.interestedPersons.push(emptyInterestedPerson());
    changed = true;
  }
  if (changed && persist) saveState();
  return changed;
}

function syncInterestedRosterAndRefresh(addMissing = true) {
  syncInterestedPersonRoster({ addMissing });
  saveState();
  renderInterestedPersons();
  renderInterestedSuggestions();
  renderReview();
  renderInterviewStatus();
  renderInterview();
}

function beneficiaryRoleLabel(role) {
  const labels = {
    beneficiary: "Will beneficiary",
    codicil_beneficiary: "Codicil beneficiary",
    trust_beneficiary: "Trust beneficiary",
    trustee: "Trustee named in will",
    entity: "Organization or charity beneficiary",
    other: "Other person named in will"
  };
  return labels[role] || "Will beneficiary";
}

function renderInterestedPersons() {
  syncInterestedPersonRoster({ addMissing: false, persist: false });
  const list = document.getElementById("interestedList");
  list.innerHTML = "";
  state.interestedPersons.forEach((person, index) => {
    const normalized = applyInterestedPersonInferences(person);
    state.interestedPersons[index] = normalized;
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <div class="row-heading">
        <h3>Person ${index + 1}</h3>
        <button type="button" class="ghost" data-remove-person="${index}">Remove</button>
      </div>
      ${partyPickerHtml("interestedPerson", index)}
      <div class="grid two compact">
        <label>Name
          <input data-person-field="name" data-person-index="${index}" value="${escapeAttr(normalized.name)}" />
        </label>
        <label>Relationship
          <input data-person-field="relationship" data-person-index="${index}" value="${escapeAttr(normalized.relationship)}" placeholder="Heir, beneficiary, fiduciary" />
        </label>
        <label>Mailing address
          <input data-person-field="address" data-person-index="${index}" value="${escapeAttr(normalized.address)}" />
        </label>
        <label>Minor date of birth
          <input type="date" data-person-field="minorDateOfBirth" data-person-index="${index}" value="${escapeAttr(normalized.minorDateOfBirth)}" />
        </label>
        <label>Email
          <input type="email" data-person-field="email" data-person-index="${index}" value="${escapeAttr(normalized.email)}" />
        </label>
        <label>Phone
          <input type="tel" data-person-field="phone" data-person-index="${index}" value="${escapeAttr(normalized.phone)}" />
        </label>
      </div>
      <div class="role-grid">
        ${roleCheckboxHtml(index, "heir", "Heir")}
        ${roleCheckboxHtml(index, "beneficiary", "Will beneficiary")}
        ${roleCheckboxHtml(index, "namedPr", "Named PR")}
        ${roleCheckboxHtml(index, "trustee", "Trustee")}
        ${roleCheckboxHtml(index, "trustBeneficiary", "Trust beneficiary")}
        ${roleCheckboxHtml(index, "minor", "Minor")}
        ${roleCheckboxHtml(index, "needsGuardian", "Guardian/agent info needed")}
        ${roleCheckboxHtml(index, "military", "Military service")}
      </div>
      <div class="service-status-box">
        <div class="row-heading compact-heading">
          <h4>Waiver and service</h4>
          ${serviceStatusBadgesHtml(normalized)}
        </div>
        <div class="grid two compact">
          <label>Waiver status
            <select data-person-service-field="waiverStatus" data-person-index="${index}">
              ${waiverStatusOptionsHtml(normalized.service?.waiverStatus || "")}
            </select>
          </label>
          <label>Address/location status
            <select data-person-service-field="locationStatus" data-person-index="${index}">
              ${locationStatusOptionsHtml(normalized.service?.locationStatus || "known")}
            </select>
          </label>
        </div>
        <div class="inline-checks compact-checks">
          <label class="checkline">
            <input type="checkbox" data-person-service-field="needsMailedNotice" data-person-index="${index}" ${normalized.service?.needsMailedNotice ? "checked" : ""} />
            Needs mailed notice
          </label>
          <label class="checkline">
            <input type="checkbox" data-person-service-field="protectedPerson" data-person-index="${index}" ${normalized.service?.protectedPerson ? "checked" : ""} />
            Minor/protected-person review
          </label>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
  const actions = document.createElement("div");
  actions.className = "list-bottom-actions";
  actions.innerHTML = `<button type="button" class="secondary" data-add-person-bottom>Add person</button>`;
  list.appendChild(actions);
  applyAddressPlaceholders(list);

  bindPartyPickers(list);
  list.querySelector("[data-add-person-bottom]")?.addEventListener("click", addPerson);
  list.querySelectorAll("[data-person-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.personIndex);
      const key = input.dataset.personField;
      state.interestedPersons[index][key] = input.value;
      saveState();
      renderReview();
      renderInterviewStatus();
    });
  });

  list.querySelectorAll("[data-person-role]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.dataset.personIndex);
      const key = input.dataset.personRole;
      state.interestedPersons[index] = normalizeInterestedPerson(state.interestedPersons[index]);
      state.interestedPersons[index].roles[key] = input.checked;
      saveState();
      renderReview();
      renderInterviewStatus();
    });
  });

  list.querySelectorAll("[data-person-service-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.dataset.personIndex);
      const key = input.dataset.personServiceField;
      state.interestedPersons[index] = normalizeInterestedPerson(state.interestedPersons[index]);
      state.interestedPersons[index].service[key] = input.type === "checkbox" ? input.checked : input.value;
      saveState();
      renderInterestedPersons();
      renderReview();
      renderInterviewStatus();
    });
  });

  list.querySelectorAll("[data-remove-person]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removePerson);
      state.interestedPersons.splice(index, 1);
      if (!state.interestedPersons.length) {
        state.interestedPersons.push(emptyInterestedPerson());
      }
      saveState();
      renderInterestedPersons();
      renderReview();
      renderInterviewStatus();
    });
  });
}

function interestedPersonSuggestions() {
  syncHeirshipChildrenList(state, { persist: false });
  const suggestions = [];
  const applicantRelationship = relationshipText([
    state.applicant.capacity,
    state.pr.sameAsApplicant ? "Proposed Personal Representative" : "",
    sameName(state.applicant.fullName, state.will.namedPr) ? "Personal Representative named in will" : ""
  ]);
  addInterestedSuggestion(suggestions, {
    name: state.applicant.fullName,
    relationship: applicantRelationship || "Applicant",
    address: state.applicant.address,
    source: "Applicant answers"
  }, { allowSelectableName: true });

  addInterestedSuggestion(suggestions, {
    name: state.pr.sameAsApplicant ? "" : state.pr.fullName,
    relationship: relationshipText(["Proposed Personal Representative", sameName(state.pr.fullName, state.will.namedPr) ? "Personal Representative named in will" : ""]),
    address: state.pr.address,
    source: "Proposed PR answers"
  }, { allowSelectableName: true });

  if (state.will.exists === "yes") {
    addInterestedSuggestion(suggestions, {
      name: state.will.namedPr,
      relationship: "Personal Representative named in will",
      address: sameName(state.will.namedPr, state.pr.fullName) ? state.pr.address : "",
      source: "Will path"
    });
    addInterestedSuggestion(suggestions, {
      name: state.will.namedTrustee,
      relationship: "Trustee named in will",
      address: "",
      source: "Will path"
    });
    addInterestedSuggestion(suggestions, {
      name: state.will.nominatedTrustee,
      relationship: "Nominated trustee",
      address: "",
      source: "Will path"
    });

    if (state.will.hasNamedBeneficiaries === "yes") {
      state.willBeneficiaries.forEach((beneficiary) => {
        addInterestedSuggestion(suggestions, {
          name: beneficiary.name,
          relationship: relationshipText([beneficiaryRoleLabel(beneficiary.role), beneficiary.relationship]),
          address: beneficiary.address,
          minorDateOfBirth: beneficiary.minorDateOfBirth,
          source: "Will beneficiaries"
        });
      });
    }
  }

  if (state.heirship.spouse.exists === "yes") {
    addInterestedSuggestion(suggestions, {
      name: state.heirship.spouse.name,
      relationship: "Heir - surviving spouse/domestic partner",
      address: sameName(state.heirship.spouse.name, state.applicant.fullName) ? state.applicant.address : "",
      source: "Proof of heirship"
    }, { allowSelectableName: true });
  }

  const childAnswersPresent = (state.heirship.children.people || []).some(hasHeirshipChildContent) || hasValue(state.heirship.children.list);
  const childrenMarkedOrPresent = state.heirship.children.exists === "yes" || childAnswersPresent;
  const structuredChildren = childrenMarkedOrPresent
    ? state.heirship.children.people.filter(hasHeirshipChildContent)
    : [];
  structuredChildren.forEach((child) => {
    const normalized = normalizeHeirshipChild(child);
    addInterestedSuggestion(suggestions, {
      name: normalized.name,
      relationship: relationshipText([
        "Heir - child/descendant",
        normalized.livingStatus === "deceased" ? "deceased" : "",
        normalized.notes
      ]),
      address: normalized.address || (sameName(normalized.name, state.applicant.fullName) ? state.applicant.address : ""),
      minorDateOfBirth: normalized.minorDateOfBirth,
      source: "Proof of heirship"
    }, { allowSelectableName: true });
  });
  if (childrenMarkedOrPresent && !structuredChildren.length) {
    splitInterestedNames(state.heirship.children.list).forEach((name) => {
      addInterestedSuggestion(suggestions, {
        name,
        relationship: "Heir - child/descendant",
        address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
        source: "Proof of heirship"
      }, { allowSelectableName: true });
    });
  }
  if (childrenMarkedOrPresent) {
    splitInterestedNames(state.heirship.children.deceasedChildDescendants).forEach((name) => {
      addInterestedSuggestion(suggestions, {
        name,
        relationship: "Heir - descendant of deceased child",
        address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
        source: "Proof of heirship"
      }, { allowSelectableName: true });
    });
  }
  splitInterestedNames(state.heirship.parents.names).forEach((name) => {
    addInterestedSuggestion(suggestions, {
      name,
      relationship: "Heir - parent",
      address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
      source: "Proof of heirship"
    }, { allowSelectableName: true });
  });
  splitInterestedNames(state.heirship.siblings.names).forEach((name) => {
    addInterestedSuggestion(suggestions, {
      name,
      relationship: "Heir - sibling",
      address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
      source: "Proof of heirship"
    }, { allowSelectableName: true });
  });
  splitInterestedNames(state.heirship.siblings.deceasedSiblingDescendants).forEach((name) => {
    addInterestedSuggestion(suggestions, {
      name,
      relationship: "Heir - descendant of deceased sibling",
      address: sameName(name, state.applicant.fullName) ? state.applicant.address : "",
      source: "Proof of heirship"
    }, { allowSelectableName: true });
  });

  return suggestions.filter((suggestion) => hasValue(suggestion.name));
}

function addInterestedSuggestion(suggestions, suggestion, options = {}) {
  if (!hasValue(suggestion.name)) return;
  const enriched = enrichInterestedSuggestion(suggestion);
  const validName = options.allowSelectableName ? hasSelectablePersonName(enriched.name) : hasStableSuggestedName(enriched.name);
  if (!validName) return;
  const normalized = normalizedPersonName(enriched.name);
  if (!normalized) return;
  const existing = suggestions.find((item) => normalizedPersonName(item.name) === normalized);
  if (existing) {
    existing.relationship = relationshipText([existing.relationship, enriched.relationship]);
    existing.address = existing.address || enriched.address || "";
    existing.minorDateOfBirth = existing.minorDateOfBirth || enriched.minorDateOfBirth || "";
    existing.source = relationshipText([existing.source, enriched.source], " + ");
    existing.roles = mergeInterestedRoles(existing.roles, enriched.roles);
    existing.service = inferredInterestedService({ ...existing, roles: existing.roles }, enriched);
    return;
  }
  suggestions.push(enriched);
}

function splitInterestedNames(value) {
  return cleanText(value)
    .split(/\n|;/)
    .map((name) => cleanSuggestedPersonName(name))
    .filter(Boolean);
}

function cleanSuggestedPersonName(value) {
  return cleanText(value)
    .replace(/\s+-\s+.*$/g, "")
    .replace(/\s*\((?:deceased|d\.|date of death).*?\)\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function relationshipText(parts, separator = "; ") {
  const seen = new Set();
  const cleanedParts = parts
    .map((part) => cleanText(part))
    .flatMap((part) => part.split(separator === " + " ? /\s+\+\s+/ : /\s*;\s*/))
    .map((part) => cleanText(part))
    .filter(Boolean)
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return removeRelationshipFragments(cleanedParts).join(separator);
}

function removeRelationshipFragments(parts = []) {
  return parts.filter((part) => {
    const key = comparableText(part).replace(/[^a-z0-9]+/g, " ").trim();
    if (key.length <= 1) return false;
    return !parts.some((other) => {
      const otherKey = comparableText(other).replace(/[^a-z0-9]+/g, " ").trim();
      return otherKey !== key && otherKey.startsWith(key) && key.length < Math.min(otherKey.length, 5);
    });
  });
}

function compactRelationshipText(value, options = {}) {
  const maxParts = options.maxParts || 3;
  const text = cleanText(value).toLowerCase();
  const labels = [];
  const add = (label) => {
    if (!labels.some((existing) => comparableText(existing) === comparableText(label))) labels.push(label);
  };
  if (/\bsurviving spouse\b|\bdomestic partner\b|\bspouse\b/.test(text)) add("Surviving spouse/domestic partner");
  if (/\badult child\b|\bchild\b|\bchildren\b|\bdescendant\b|\bgrandchild\b/.test(text)) add("Child/descendant");
  if (/\bparent\b/.test(text)) add("Parent");
  if (/\bsibling\b|\bbrother\b|\bsister\b/.test(text)) add("Sibling");
  if (/\bheir\b/.test(text)) add("Heir");
  if (/\bpersonal representative\b|\bnamed pr\b|\bproposed pr\b/.test(text)) add(text.includes("named") || text.includes("will") ? "Named PR" : "Proposed PR");
  if (/\bwill beneficiary\b|\bbeneficiary\b|\bcharity\b|\borganization\b/.test(text)) add("Will beneficiary");
  if (/\btrust beneficiary\b/.test(text)) add("Trust beneficiary");
  if (/\btrustee\b/.test(text) && !text.includes("trust beneficiary")) add("Trustee");
  if (/\bresident agent\b/.test(text)) add("Resident agent");
  if (/\bapplicant\b/.test(text)) add("Applicant");
  if (!labels.length && hasValue(value)) {
    cleanText(value).split(/\s*;\s*/).map(cleanText).filter(Boolean).forEach((part) => {
      if (part.length > 1 && !/^[a-z]$/i.test(part)) add(part);
    });
  }
  return relationshipText(labels.slice(0, maxParts));
}

function compactInterestedRelationship(person = {}, options = {}) {
  const normalized = normalizeInterestedPerson(person);
  const roles = normalized.roles || {};
  const labels = [];
  const add = (label) => {
    if (!labels.some((existing) => comparableText(existing) === comparableText(label))) labels.push(label);
  };
  const relationship = cleanText(normalized.relationship);
  if (/spouse|domestic partner/i.test(relationship)) add("Surviving spouse/domestic partner");
  if (/child|descendant|grandchild/i.test(relationship)) add("Child/descendant");
  if (/parent/i.test(relationship)) add("Parent");
  if (/sibling|brother|sister/i.test(relationship)) add("Sibling");
  if (roles.heir || /\bheir\b/i.test(relationship)) add("Heir");
  if (roles.namedPr || /personal representative|named pr|proposed pr/i.test(relationship)) {
    add(/named|will/i.test(relationship) || roles.namedPr ? "Named PR" : "Proposed PR");
  }
  if (roles.beneficiary || /beneficiary|charity|organization/i.test(relationship)) add("Will beneficiary");
  if (roles.trustBeneficiary || /trust beneficiary/i.test(relationship)) add("Trust beneficiary");
  if (roles.trustee || /\btrustee\b/i.test(relationship)) add("Trustee");
  if (roles.minor || hasValue(normalized.minorDateOfBirth)) add("Minor");
  if (!labels.length) return compactRelationshipText(relationship, options) || "Interested person";
  return relationshipText(labels.slice(0, options.maxParts || 3));
}

function normalizedPersonName(value) {
  return cleanSuggestedPersonName(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sameName(first, second) {
  return hasValue(first) && normalizedPersonName(first) === normalizedPersonName(second);
}

function existingInterestedPersonIndex(name) {
  const normalized = normalizedPersonName(name);
  if (!normalized) return -1;
  return state.interestedPersons.findIndex((person) => hasValue(person.name) && normalizedPersonName(person.name) === normalized);
}

function renderInterestedSuggestions() {
  syncInterestedPersonRoster({ addMissing: false, persist: false });
  const list = document.getElementById("interestedSuggestions");
  const addAllButton = document.getElementById("addAllSuggestedInterestedBtn");
  if (!list) return;
  const suggestions = interestedPersonSuggestions();
  const missing = suggestions.filter((suggestion) => existingInterestedPersonIndex(suggestion.name) < 0);
  if (addAllButton) addAllButton.disabled = !missing.length;
  if (!suggestions.length) {
    list.innerHTML = `
      <div class="suggestion-empty">
        Answer applicant, will, and heirship questions to see suggested interested persons here.
      </div>
    `;
    return;
  }
  list.innerHTML = "";
  suggestions.forEach((suggestion, index) => {
    const existingIndex = existingInterestedPersonIndex(suggestion.name);
    const card = document.createElement("div");
    card.className = "suggestion-card";
    card.innerHTML = `
      <div>
        <h3>${escapeHtml(suggestion.name)}</h3>
        <p>${escapeHtml(suggestion.relationship || "Interested person")}</p>
        <span>${escapeHtml(suggestion.address || "Address needed")}</span>
      </div>
      <div class="suggestion-actions">
        <span class="badge ${existingIndex >= 0 ? "" : "warn"}">${existingIndex >= 0 ? "Added" : suggestion.source || "Suggested"}</span>
        <button type="button" class="secondary" data-add-suggestion="${index}" ${existingIndex >= 0 ? "disabled" : ""}>${existingIndex >= 0 ? "Added" : "Add"}</button>
      </div>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll("[data-add-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      addInterestedPersonSuggestion(suggestions[Number(button.dataset.addSuggestion)]);
    });
  });
}

function addInterestedPersonSuggestion(suggestion) {
  if (!suggestion || existingInterestedPersonIndex(suggestion.name) >= 0) return;
  const person = interestedPersonFromSuggestion(suggestion);
  const blankIndex = state.interestedPersons.findIndex(blankInterestedPerson);
  if (blankIndex >= 0) {
    state.interestedPersons[blankIndex] = person;
  } else {
    state.interestedPersons.push(person);
  }
  saveState();
  renderInterestedPersons();
  renderInterestedSuggestions();
  renderReview();
  renderInterviewStatus();
}

function addAllInterestedPersonSuggestions() {
  syncInterestedPersonRoster({ addMissing: true });
  renderInterestedPersons();
  renderInterestedSuggestions();
  renderReview();
  renderInterviewStatus();
}

function renderInventoryItems() {
  const list = document.getElementById("inventoryList");
  if (!list) return;
  list.innerHTML = "";
  state.inventory.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <div class="row-heading">
        <h3>Item ${index + 1}</h3>
        <button type="button" class="ghost" data-remove-inventory="${index}">Remove</button>
      </div>
      <div class="grid two compact">
        <label>Category
          <select data-inventory-field="category" data-inventory-index="${index}">
            ${inventoryCategoryOptionsHtml(item.category)}
          </select>
        </label>
        <label>Date-of-death value
          <input data-inventory-field="value" data-inventory-index="${index}" value="${escapeAttr(item.value)}" inputmode="decimal" />
        </label>
        <label>Description
          <input data-inventory-field="description" data-inventory-index="${index}" value="${escapeAttr(item.description)}" />
        </label>
        <label>Encumbrance, lien, or charge
          <input data-inventory-field="encumbrance" data-inventory-index="${index}" value="${escapeAttr(item.encumbrance)}" inputmode="decimal" />
        </label>
        <label>Notes
          <input data-inventory-field="notes" data-inventory-index="${index}" value="${escapeAttr(item.notes)}" />
        </label>
      </div>
      <label class="checkline">
        <input type="checkbox" data-inventory-field="marital" data-inventory-index="${index}" ${item.marital ? "checked" : ""} />
        Marital property interest
      </label>
    `;
    list.appendChild(card);
  });
  const actions = document.createElement("div");
  actions.className = "list-bottom-actions";
  actions.innerHTML = `<button type="button" class="secondary" data-add-inventory-bottom>Add item</button>`;
  list.appendChild(actions);

  list.querySelector("[data-add-inventory-bottom]")?.addEventListener("click", addInventoryItem);
  list.querySelectorAll("[data-inventory-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.inventoryIndex);
      const key = input.dataset.inventoryField;
      state.inventory.items[index][key] = input.type === "checkbox" ? input.checked : input.value;
      saveState();
      renderInventoryTotals();
      renderReview();
    });
    input.addEventListener("change", () => {
      const index = Number(input.dataset.inventoryIndex);
      const key = input.dataset.inventoryField;
      state.inventory.items[index][key] = input.type === "checkbox" ? input.checked : input.value;
      saveState();
      renderInventoryTotals();
      renderReview();
    });
  });

  list.querySelectorAll("[data-remove-inventory]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeInventory);
      state.inventory.items.splice(index, 1);
      if (!state.inventory.items.length) {
        state.inventory.items.push(emptyInventoryItem());
      }
      saveState();
      renderInventoryItems();
      renderInventoryTotals();
      renderReview();
    });
  });
  renderInventoryTotals();
}

function addInventoryItem() {
  state.inventory.items.push(emptyInventoryItem());
  saveState();
  renderInventoryItems();
  renderReview();
}

function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function addPerson() {
  state.interestedPersons.push(emptyInterestedPerson());
  saveState();
  renderInterestedPersons();
  renderReview();
  renderInterviewStatus();
}

function copyApplicantToPreparer() {
  state.preparer.fullName = state.applicant.fullName;
  state.preparer.address = state.applicant.address;
  state.preparer.email = state.applicant.email;
  state.preparer.phone = state.applicant.phone;
  state.preparer.barNumber = state.applicant.barNumber;
  saveState();
  renderFields();
  renderReview();
}

function applyCountyDefaultsFromButton() {
  applyCountyDefaults({ force: true });
  renderFields();
  renderReview();
  renderInterviewStatus();
}

function loadCountyLibraryFromButton() {
  loadCountyLibraryDefault({ force: true });
  applyCountyDefaults({ force: true });
  renderFields();
  renderReview();
  renderInterviewStatus();
}

function loadSample() {
  state = mergeDeep(emptyState(), {
    estate: {
      county: "Milwaukee",
      estimatedGrossValue: "85000",
      estimatedNetValue: "82500"
    },
    intake: {
      userRole: "family"
    },
    account: {
      fullName: "Alex Decedent",
      email: "alex@example.com",
      accessCode: "sample123",
      lastSavedAt: "",
      resumeStatus: ""
    },
    pathRouter: {
      grossValue: "85000",
      hasRealEstate: "no",
      allInterestedKnown: "yes",
      allAdultsCapable: "yes",
      everyoneAgrees: "yes",
      publicBenefits: "no",
      creditorDispute: "no",
      formalConcern: "no",
      notes: ""
    },
    payment: {
      status: "unpaid",
      productKey: "",
      email: "alex@example.com",
      deliveryMode: "download",
      exportAudience: "public",
      agreedToTerms: false,
      unlockedAt: ""
    },
    attorneyHandoff: {
      consent: false,
      contactName: "Alex Decedent",
      contactEmail: "alex@example.com",
      contactPhone: "414-555-0120",
      county: "Milwaukee",
      notes: "",
      includeCaseData: true,
      generatedAt: ""
    },
    ui: {
      mode: "guided",
      interviewStepId: "role"
    },
    decedent: {
      fullName: "Jane A. Decedent",
      dateOfBirth: "1948-04-12",
      dateOfDeath: "2026-05-20",
      domicileCounty: "Milwaukee",
      domicileState: "Wisconsin",
      lastMailingAddress: "1234 North Lake Drive, Milwaukee, WI 53202"
    },
    applicant: {
      fullName: "Alex Decedent",
      capacity: "Adult child and heir",
      address: "2200 West Park Street, Milwaukee, WI 53213",
      email: "alex@example.com",
      phone: "414-555-0120",
      signatureDate: "2026-06-08"
    },
    pr: {
      sameAsApplicant: true,
      fullName: "Alex Decedent",
      address: "2200 West Park Street, Milwaukee, WI 53213",
      email: "alex@example.com",
      phone: "414-555-0120",
      isWisconsinResident: "yes",
      signatureDate: "2026-06-08",
      barNumber: "",
      residentAgent: {
        name: "",
        address: "",
        email: "",
        phone: "",
        signatureDate: "",
        barNumber: ""
      }
    },
    otherProceedings: {
      status: "not_pending"
    },
    will: {
      exists: "no",
      hasCodicils: "no",
      noWillDiligentInquiry: true
    },
    opening: {
      waiverStatus: "all_signed",
      unknownInterestedPersonsStatus: "none",
      noticeReason: "",
      peopleWhoCannotSign: "",
      peopleNotFound: "",
      publicationNotes: "All listed interested persons are expected to sign waivers."
    },
    countyDefaults: {
      courthouseCounty: "Milwaukee",
      courthouseAddress: "901 North 9th Street, Milwaukee, WI 53233",
      room: "",
      probateOfficeName: "Probate Division",
      registrarName: "",
      newspaperName: "The Daily Reporter",
      accommodationPhone: "",
      localNotes: "Confirm current filing address, publication newspaper, and claim deadline with the probate office before filing."
    },
    waiver: {
      signatureMode: "single",
      receivedWillCopy: false,
      receivedBequestNotice: false,
      consentToAdmitWill: false,
      otherSelected: false,
      otherText: "",
      signatureDate: "2026-06-08"
    },
    notice1804: {
      courthouseCounty: "Milwaukee",
      courthouseAddress: "901 North 9th Street",
      room: "",
      claimDeadline: "2026-10-22",
      newspaperName: "The Daily Reporter"
    },
    notice1805: {
      courthouseCounty: "Milwaukee",
      courthouseAddress: "901 North 9th Street",
      room: "",
      registrarName: "",
      hearingDate: "",
      hearingTime: "",
      claimDeadline: "",
      unknownInterestedPersons: "",
      accommodationPhone: "",
      checkExactTime: true,
      newspaperName: ""
    },
    heirship: {
      informant: {
        name: "Alex Decedent",
        address: "2200 West Park Street, Milwaukee, WI 53213",
        relationship: "Adult child"
      },
      spouse: {
        exists: "no",
        name: ""
      },
      children: {
        exists: "yes",
        list: "Alex Decedent; Morgan Decedent",
        deceasedChildDescendants: "",
        allOfSurvivingSpouse: "not_applicable",
        blendedDetails: ""
      },
      parents: {
        exists: "no",
        names: ""
      },
      siblings: {
        exists: "no",
        names: "",
        deceasedSiblingDescendants: ""
      },
      grandparents: {
        summary: ""
      },
      survivorship120: {
        exists: "no",
        details: ""
      }
    },
    benefits: {
      medicalAssistance: "did_not",
      familyCare: "did_not",
      communityOptions: "did_not",
      chronicDisease: "did_not",
      institution: "was_not"
    },
    spouse: {
      fullName: "",
      lackInfo: true
    },
    interestedPersons: [
      {
        name: "Alex Decedent",
        relationship: "Heir",
        address: "2200 West Park Street, Milwaukee, WI 53213",
        minorDateOfBirth: ""
      },
      {
        name: "Morgan Decedent",
        relationship: "Heir",
        address: "700 South Pine Avenue, Wauwatosa, WI 53213",
        minorDateOfBirth: ""
      }
    ],
    requests: {
      domiciliaryLettersTo: "Alex Decedent",
      interestedPersonsSeeAttached: true
    },
    service: {
      declarantName: "Alex Decedent",
      declarantCity: "Milwaukee",
      declarantState: "Wisconsin",
      declarantAddress: "2200 West Park Street, Milwaukee, WI 53213",
      declarantEmail: "alex@example.com",
      declarantPhone: "414-555-0120",
      declarantBarNumber: "",
      serviceDate: "2026-06-08",
      documentsProvided: "Application for Informal Administration (PR-1801)\nProof of Heirship (PR-1806)\nConsent to Serve (PR-1807)\nWaiver and Consent (PR-1803)",
      originalOnFile: true,
      copyAttached: false,
      method: "Mail",
      signatureDate: "2026-06-08"
    },
    courtDrafts: {
      prBondType: "none",
      prBondAmount: "",
      trusteeBondType: "none",
      trusteeBondAmount: "",
      otherFindingsSelected: false,
      otherFindingsText: "",
      otherOrdersSelected: false,
      otherOrdersText: "",
      lettersOtherText: ""
    },
    inventory: {
      signatureDate: "2026-06-08",
      items: [
        {
          category: "Bank account",
          description: "Checking account at Lake Bank ending 1234",
          value: "24500",
          encumbrance: "",
          marital: false,
          notes: ""
        },
        {
          category: "Vehicle",
          description: "2018 Toyota Camry",
          value: "14500",
          encumbrance: "2500",
          marital: false,
          notes: "Auto loan balance listed as encumbrance"
        },
        {
          category: "Personal property",
          description: "Household goods and personal effects",
          value: "6000",
          encumbrance: "",
          marital: false,
          notes: ""
        }
      ]
    },
    deadlines: {
      lettersIssuedDate: "2026-06-15",
      serviceCompletedDate: "2026-06-08",
      firstPublicationDate: "2026-06-12",
      proofPublicationReceivedDate: "",
      claimDeadline: "2026-10-22",
      inventoryDueDate: "2026-12-15",
      inventoryFiledDate: "",
      closingReviewDate: ""
    },
    taskStatus: {
      openingPacket: true,
      waiversOrNotice: false,
      publication: false,
      serviceDeclaration: false,
      lettersIssued: false,
      inventory: false,
      claims: false,
      closing: false
    },
    preparer: {
      fullName: "Alex Decedent",
      address: "2200 West Park Street, Milwaukee, WI 53213",
      email: "alex@example.com",
      phone: "414-555-0120"
    }
  });
  saveState();
  renderAll();
}

function clearAll() {
  state = emptyState();
  saveState();
  renderAll();
  document.getElementById("downloadArea").innerHTML = "";
}

function caseExportData() {
  return {
    app: "wisconsin-informal-probate-prototype",
    version: 1,
    savedAt: new Date().toISOString(),
    company: COMPANY_CONFIG,
    platform: {
      environment: PLATFORM_CONFIG.environment || "prototype-local",
      dataModelVersion: PLATFORM_DATA_MODEL_VERSION,
      storage: PLATFORM_STORAGE_CONFIG,
      redactedMatter: matterRedactedSnapshot(state)
    },
    featureFlags: {
      attorneyHandoff: FEATURE_ATTORNEY_HANDOFF,
      attorneyDirectory: FEATURE_ATTORNEY_DIRECTORY,
      affiliatedLawFirmReview: FEATURE_AFFILIATED_LAW_FIRM_REVIEW,
      sponsoredAttorneyListings: FEATURE_SPONSORED_ATTORNEY_LISTINGS
    },
    betaReadiness: betaLaunchReadinessItems().map((item) => ({ label: item.label, status: item.status, tone: item.tone })),
    officialFormIntegrity: officialFormIntegritySummary(),
    officialTemplateVaultManifestText: officialTemplateVaultManifestText(state),
    outputReadiness: outputReadinessSummary(),
    outputFormatConfigText: efilingFormatConfigText(state),
    betaIssueQueueText: betaIssueQueueText(state),
    signatureTrackingText: signatureTrackingText(state),
    secureDeliveryManifestText: secureDeliveryManifestText(state),
    productionLaunchHandoffText: productionLaunchHandoffText(state),
    pr1801Overlay: pr1801OverlayMap(state),
    logicAudit: probateLogicAuditItems().map((item) => ({ label: item.label, status: item.status, tone: item.tone, detail: item.detail })),
    legalLogicAuditText: legalLogicAuditText(state),
    legalLogicLockText: legalLogicLockText(state),
    attorneyBetaReviewText: attorneyBetaReviewText(state),
    attorneyBetaReviewSummary: attorneyBetaReviewSummary(state),
    legalReview: {
      summary: legalReviewSummary(),
      lock: legalLogicLockStatus(),
      checklist: legalReviewChecklistItems().map((item) => ({
        key: item.key,
        label: item.label,
        detail: item.detail,
        ...legalReviewItemState(item.key)
      }))
    },
    state
  };
}

function saveCaseFile() {
  persistMatterCheckpoint("save_case_export");
  recordAuditLog("data_export_request", { exportType: "case_json" });
  const blob = new Blob([JSON.stringify(caseExportData(), null, 2)], { type: "application/json" });
  showDownloadLink(blob, `probate-case-${estateSlug()}.json`);
}

function loadCaseFile() {
  document.getElementById("caseFileInput")?.click();
}

async function importCaseFile(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const incoming = parsed.state || parsed;
    const merged = mergeDeep(emptyState(), incoming || {});
    migrateLoadedState(merged, incoming || {});
    state = merged;
    saveState();
    persistMatterCheckpoint("load_matter");
    renderAll();
    setDownloadArea(`Loaded ${file.name}.`, "success");
  } catch (error) {
    setDownloadArea(error.message || "The selected case file could not be loaded.", "error");
  } finally {
    input.value = "";
  }
}

function hasValue(value) {
  return String(value ?? "").trim().length > 0;
}

function validate() {
  const blockers = [];
  const warnings = [];

  if (!hasValue(state.estate.county)) blockers.push("County is required.");
  if (!hasValue(state.decedent.fullName)) blockers.push("Decedent name is required.");
  if (!hasValue(state.decedent.dateOfDeath)) blockers.push("Date of death is required.");
  if (!hasValue(state.decedent.dateOfBirth)) warnings.push("Date of birth should be entered for PR-1801 and related forms.");
  if (!hasValue(state.decedent.domicileCounty)) blockers.push("Domicile county is required.");
  if (!hasValue(state.decedent.domicileState)) blockers.push("Domicile state is required.");
  if (!hasValue(state.decedent.lastMailingAddress)) warnings.push("Last mailing address is blank.");
  if (!hasValue(state.applicant.fullName)) blockers.push("Applicant name is required.");
  if (!hasValue(state.applicant.address)) blockers.push("Applicant needs a mailing address.");
  if (!hasValue(state.applicant.capacity)) blockers.push("Applicant interested-person capacity is required.");
  if (!hasValue(state.pr.fullName)) blockers.push("Proposed personal representative is required.");
  if (!hasValue(state.otherProceedings.status)) blockers.push("Other-proceedings status is required.");
  if (state.otherProceedings.status === "pending" && !hasValue(state.otherProceedings.explanation)) {
    blockers.push("Pending proceedings need an explanation.");
  }
  if (!hasValue(state.estate.estimatedGrossValue) && !hasValue(state.estate.estimatedNetValue)) {
    blockers.push("Estimated probate property value is required.");
  }

  if (!hasValue(state.will.exists)) blockers.push("Choose whether the decedent left a will.");
  if (state.will.exists === "yes") {
    if (!hasValue(state.will.date)) blockers.push("Will date is required for the will path.");
    if (!hasValue(state.will.hasCodicils)) blockers.push("Choose whether the will has codicils.");
    if (state.will.hasCodicils === "yes" && !hasValue(state.will.codicilDates)) {
      blockers.push("Codicil dates are required when codicils are selected.");
    }
    if (!hasValue(state.will.location)) blockers.push("Original will status is required for the will path.");
  }
  if (state.will.exists === "no" && !state.will.noWillDiligentInquiry) {
    blockers.push("No-will path requires the diligent-inquiry confirmation.");
  }
  if (state.will.exists === "unknown") {
    warnings.push("Unknown will status should pause the DIY flow for attorney review.");
  }

  const benefitKeys = ["medicalAssistance", "familyCare", "communityOptions", "chronicDisease", "institution"];
  const missingBenefits = benefitKeys.some((key) => !hasValue(state.benefits[key]));
  if (missingBenefits && !state.benefits.lackInfo) {
    blockers.push("Complete the decedent benefits section or mark lack of information.");
  }

  state.interestedPersons.forEach((person, index) => {
    const normalizedPerson = normalizeInterestedPerson(person);
    if (blankInterestedPerson(normalizedPerson)) return;
    if (!hasValue(normalizedPerson.name)) blockers.push(`Interested person ${index + 1} needs a name.`);
    if (!hasValue(interestedRelationship(normalizedPerson))) blockers.push(`Interested person ${index + 1} needs a relationship or role.`);
    if (!hasValue(normalizedPerson.address)) blockers.push(`Interested person ${index + 1} needs a mailing address.`);
    if (hasValue(normalizedPerson.minorDateOfBirth) || normalizedPerson.roles.minor) {
      warnings.push(`Interested person ${index + 1} appears to be a minor; waiver generation should be attorney-reviewed.`);
    }
    if (normalizedPerson.roles.military) {
      warnings.push(`Interested person ${index + 1} is marked for military-service review.`);
    }
  });

  if (state.pr.isWisconsinResident === "no") {
    warnings.push("Nonresident PR will need resident-agent handling on PR-1807.");
  }

  const gross = Number(String(state.estate.estimatedGrossValue).replace(/[^0-9.]/g, ""));
  if (gross && gross <= 50000) {
    warnings.push("Gross probate property is $50,000 or less; Transfer by Affidavit may be worth considering.");
  }

  if (!hasValue(state.preparer.fullName)) warnings.push("Preparer name is blank.");

  return { blockers, warnings };
}

function validate1806() {
  const blockers = [];
  const warnings = [];
  if (!hasValue(state.estate.county)) blockers.push("PR-1806 needs the county.");
  if (!hasValue(state.decedent.fullName)) blockers.push("PR-1806 needs the decedent name.");
  if (!hasValue(state.heirship.informant.name)) blockers.push("PR-1806 needs the person answering heirship questions.");
  if (!hasValue(state.heirship.informant.address)) blockers.push("PR-1806 needs the informant mailing address.");
  if (!hasValue(state.heirship.informant.relationship)) blockers.push("PR-1806 needs the informant relationship.");
  if (!hasValue(state.heirship.spouse.exists)) blockers.push("PR-1806 needs spouse/domestic partner yes or no.");
  if (state.heirship.spouse.exists === "yes" && !hasValue(state.heirship.spouse.name)) {
    blockers.push("PR-1806 needs the surviving spouse/domestic partner name.");
  }
  const childNamesEntered = state.heirship.children.people.some((child) => hasValue(child.name)) || hasValue(state.heirship.children.list);
  if (!hasValue(state.heirship.children.exists)) blockers.push("PR-1806 needs children yes or no.");
  if (state.heirship.children.exists === "yes" && !childNamesEntered) {
    blockers.push("PR-1806 needs at least one child name because children is marked Yes. If the decedent had no children, change that answer to No.");
  }
  if (state.heirship.spouse.exists === "yes" && state.heirship.children.exists === "yes" && !hasValue(state.heirship.children.allOfSurvivingSpouse)) {
    blockers.push("PR-1806 needs whether all children are also children of the surviving spouse/domestic partner.");
  }
  if (state.heirship.children.allOfSurvivingSpouse === "no" && !hasValue(state.heirship.children.blendedDetails)) {
    blockers.push("PR-1806 needs details for children not of the surviving spouse/domestic partner.");
  }
  if (!hasValue(state.heirship.survivorship120.exists)) blockers.push("PR-1806 needs the 120-hour survivorship answer.");
  if (state.heirship.survivorship120.exists === "yes" && !hasValue(state.heirship.survivorship120.details)) {
    blockers.push("PR-1806 needs details for persons who died within 120 hours.");
  }
  if (state.heirship.spouse.exists === "no" && state.heirship.children.exists === "no" && !hasValue(state.heirship.parents.exists)) {
    warnings.push("If there are no spouse/descendant answers ending the form flow, parents should be completed.");
  }
  return { blockers, warnings };
}

function validate1807() {
  const blockers = [];
  const warnings = [];
  if (!hasValue(state.estate.county)) blockers.push("PR-1807 needs the county.");
  if (!hasValue(state.decedent.fullName)) blockers.push("PR-1807 needs the decedent name.");
  if (!hasValue(state.pr.fullName)) blockers.push("PR-1807 needs the proposed personal representative name.");
  if (!hasValue(state.pr.address)) warnings.push("PR-1807 should include the proposed PR address.");
  if (!hasValue(state.pr.email)) warnings.push("PR-1807 should include the proposed PR email.");
  if (!hasValue(state.pr.phone)) warnings.push("PR-1807 should include the proposed PR phone.");
  if (!hasValue(state.pr.isWisconsinResident)) blockers.push("PR-1807 needs Wisconsin residency yes or no.");
  if (state.pr.isWisconsinResident === "no") {
    if (!hasValue(state.pr.residentAgent.name)) blockers.push("Nonresident PR requires a resident agent name.");
    if (!hasValue(state.pr.residentAgent.address)) blockers.push("Nonresident PR requires a resident agent address.");
    if (!hasValue(state.pr.residentAgent.phone)) warnings.push("Resident agent phone should be entered.");
  }
  return { blockers, warnings };
}

function openingPathDecision(data = state) {
  const waiverStatus = data.opening?.waiverStatus || "";
  const willStatus = data.will?.exists || "";
  const serviceSummary = interestedPersonServiceSummary(data);
  const hasPersonPathAnswers = serviceSummary.total > 0 && serviceSummary.unansweredWaiverCount === 0;
  const broadUnknownOrMissing = data.opening?.unknownInterestedPersonsStatus === "some_unknown";
  const hasUnknownOrMissing = broadUnknownOrMissing || serviceSummary.unknownOrMissingCount > 0;
  const personNoticeNeeded = serviceSummary.requiresNotice;
  const noticeNeeded = waiverStatus === "not_all" || hasUnknownOrMissing || personNoticeNeeded;
  const allPeopleCanWaive = hasPersonPathAnswers && serviceSummary.canSignWaiverCount === serviceSummary.total && !noticeNeeded;
  if (waiverStatus === "unknown") {
    return {
      key: "unknown",
      title: "Choose an opening path",
      detail: "Keep gathering waiver and service information before choosing the opening packet.",
      tone: "warn"
    };
  }
  if (!hasValue(waiverStatus) && !hasPersonPathAnswers) {
    return {
      key: "unknown",
      title: "Choose an opening path",
      detail: "Answer whether every interested person can sign PR-1803 Waiver and Consent, or complete waiver status for each interested person.",
      tone: "warn"
    };
  }
  if (!hasValue(data.opening?.unknownInterestedPersonsStatus) && !hasPersonPathAnswers) {
    return {
      key: "unknown",
      title: "Confirm missing interested persons",
      detail: "Answer whether any interested person is unknown, missing, or not reasonably ascertainable before choosing the opening packet.",
      tone: "warn"
    };
  }
  if ((waiverStatus === "all_signed" || allPeopleCanWaive) && !noticeNeeded) {
    return {
      key: "waiver",
      title: "Open on waiver",
      detail: "Use PR-1803 Waiver and Consent for all eligible interested persons, plus PR-1804 Notice to Creditors.",
      tone: "ok"
    };
  }
  if (willStatus === "yes" && noticeNeeded) {
    return {
      key: "notice",
      title: "Use PR-1805 notice path",
      detail: "Because at least one waiver or service answer requires notice and there is a will, generate PR-1805 and track publication/service.",
      tone: "warn"
    };
  }
  if (willStatus === "no" && noticeNeeded) {
    return {
      key: "blocked_no_will",
      title: "No-will case without all waivers",
      detail: "The probate guide says PR-1805 cannot be used if the decedent did not have a will. This should be flagged for formal-administration or attorney review.",
      tone: "bad"
    };
  }
  return {
    key: "unknown",
    title: "Need will status",
    detail: "If not all waivers are available, the app needs to know whether there is a will before choosing PR-1805.",
    tone: "warn"
  };
}

function validate1805() {
  const blockers = [];
  const warnings = [];
  const decision = openingPathDecision(state);
  if (decision.key !== "notice") {
    blockers.push("PR-1805 is only enabled for the notice path: will exists and not all waivers are available.");
  }
  if (!hasValue(state.estate.county)) blockers.push("PR-1805 needs the county.");
  if (!hasValue(state.decedent.fullName)) blockers.push("PR-1805 needs the decedent name.");
  if (!hasValue(state.decedent.dateOfBirth)) warnings.push("PR-1805 should include date of birth.");
  if (!hasValue(state.decedent.dateOfDeath)) blockers.push("PR-1805 needs date of death.");
  if (!hasValue(state.decedent.domicileCounty)) blockers.push("PR-1805 needs domicile county.");
  if (!hasValue(state.decedent.domicileState)) blockers.push("PR-1805 needs domicile state.");
  if (!hasValue(state.decedent.lastMailingAddress)) warnings.push("PR-1805 should include decedent mailing address.");
  if (!hasValue(state.notice1805.courthouseCounty)) blockers.push("PR-1805 needs courthouse county/name.");
  if (!hasValue(state.notice1805.courthouseAddress)) blockers.push("PR-1805 needs courthouse address.");
  if (!hasValue(state.notice1805.hearingDate)) warnings.push("PR-1805 hearing date is usually filled by the Probate Registrar.");
  if (!hasValue(state.notice1805.claimDeadline)) warnings.push("PR-1805 claim deadline is usually filled by the Probate Registrar.");
  if (state.opening.unknownInterestedPersonsStatus === "some_unknown" && !hasValue(state.notice1805.unknownInterestedPersons)) {
    blockers.push("List unknown or not reasonably ascertainable interested persons, or change the unknown-person status.");
  }
  return { blockers, warnings };
}

function validate1803(data = state) {
  const blockers = [];
  const warnings = [];
  const decision = openingPathDecision(data);
  if (decision.key !== "waiver") {
    blockers.push("PR-1803 is only enabled when the estate is opening on waiver.");
  }
  if (!hasValue(data.estate.county)) blockers.push("PR-1803 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1803 needs the decedent name.");
  if (!hasValue(data.pr.fullName)) blockers.push("PR-1803 needs the proposed personal representative name.");
  if (!data.interestedPersons.length) blockers.push("PR-1803 needs at least one interested person.");
  data.interestedPersons.forEach((person, index) => {
    const status = interestedPersonServiceStatus(person);
    const label = cleanText(person.name) || `signer ${index + 1}`;
    if (!hasValue(person.name)) blockers.push(`PR-1803 signer ${index + 1} needs a name.`);
    if (!hasValue(person.address)) blockers.push(`PR-1803 ${label} needs a mailing address.`);
    if (hasValue(person.minorDateOfBirth) || status.protectedPerson) blockers.push(`PR-1803 ${label} appears to be a minor or protected person; use attorney review before generating a waiver.`);
    if (status.unableToWaive) blockers.push(`PR-1803 ${label} is marked as unable, unwilling, not eligible, or protected; use the notice path or attorney review.`);
    if (status.unknownOrMissing) blockers.push(`PR-1803 ${label} is marked unknown or cannot be located; use the notice path or attorney review.`);
    if (person.service?.needsMailedNotice) warnings.push(`PR-1803 ${label} is marked as needing mailed notice; confirm a waiver-only opening is still appropriate.`);
    if (!hasValue(person.service?.waiverStatus)) warnings.push(`PR-1803 ${label} does not have a waiver status answer yet.`);
  });
  if (data.will.exists === "yes") {
    if (!hasValue(data.will.date)) blockers.push("PR-1803 needs the will date for the will waiver path.");
    if (!hasValue(data.will.hasCodicils)) blockers.push("PR-1803 needs whether the will has codicils.");
    if (data.will.hasCodicils === "yes" && !hasValue(data.will.codicilDates)) {
      blockers.push("PR-1803 needs the codicil date(s).");
    }
    if (!data.waiver.receivedWillCopy && !data.waiver.receivedBequestNotice) {
      blockers.push("Choose whether waiver signers received the will copy or bequest notice.");
    }
  }
  if (data.interestedPersons.length > 8) warnings.push("PR-1803 has room for eight signer blocks; extra signers will be listed on an attachment.");
  return { blockers, warnings };
}

function validate1804(data = state) {
  const blockers = [];
  const warnings = [];
  const decision = openingPathDecision(data);
  if (decision.key !== "waiver") {
    blockers.push("PR-1804 is only enabled when all interested persons waive notice.");
  }
  if (!hasValue(data.estate.county)) blockers.push("PR-1804 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1804 needs the decedent name.");
  if (!hasValue(data.decedent.dateOfBirth)) warnings.push("PR-1804 should include date of birth.");
  if (!hasValue(data.decedent.dateOfDeath)) blockers.push("PR-1804 needs date of death.");
  if (!hasValue(data.decedent.domicileCounty)) blockers.push("PR-1804 needs domicile county.");
  if (!hasValue(data.decedent.domicileState)) blockers.push("PR-1804 needs domicile state.");
  if (!hasValue(data.decedent.lastMailingAddress)) warnings.push("PR-1804 should include decedent mailing address.");
  if (!hasValue(data.notice1804.claimDeadline)) warnings.push("PR-1804 claim deadline is usually supplied by the Probate Registrar.");
  if (!hasValue(data.notice1804.courthouseCounty)) blockers.push("PR-1804 needs courthouse county/name.");
  if (!hasValue(data.notice1804.courthouseAddress)) blockers.push("PR-1804 needs courthouse address.");
  return { blockers, warnings };
}

function validate1817(data = state) {
  const blockers = [];
  const warnings = [];
  if (!hasValue(data.estate.county)) blockers.push("PR-1817 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1817 needs the decedent name.");
  if (!hasValue(data.service.declarantName)) blockers.push("PR-1817 needs the declarant name.");
  if (!hasValue(data.service.declarantCity)) blockers.push("PR-1817 needs the declarant city.");
  if (!hasValue(data.service.declarantState)) blockers.push("PR-1817 needs the declarant state.");
  if (!hasValue(data.service.serviceDate)) blockers.push("PR-1817 needs the service date.");
  if (!hasValue(data.service.documentsProvided)) blockers.push("PR-1817 needs the documents provided.");
  if (!data.service.originalOnFile && !data.service.copyAttached) blockers.push("PR-1817 needs original-on-file or copy-attached selected.");
  if (data.service.originalOnFile && data.service.copyAttached) warnings.push("PR-1817 should usually select either original-on-file or copy-attached, not both.");
  if (!hasValue(data.service.method)) blockers.push("PR-1817 needs the type of service.");
  data.interestedPersons.forEach((person, index) => {
    const status = interestedPersonServiceStatus(person);
    const label = cleanText(person.name) || `recipient ${index + 1}`;
    if (!hasValue(person.name)) blockers.push(`PR-1817 recipient ${index + 1} needs a name.`);
    if (!hasValue(person.address)) blockers.push(`PR-1817 ${label} needs a mailing address.`);
    if (status.unknownOrMissing) warnings.push(`PR-1817 ${label} is marked unknown or cannot be located; confirm whether publication or another notice method is required.`);
    if (status.protectedPerson) warnings.push(`PR-1817 ${label} may need guardian/agent service review.`);
    if (status.person.roles?.military) warnings.push(`PR-1817 ${label} has a military-service flag; review service protections before defaulting.`);
  });
  if (data.interestedPersons.length > 1) warnings.push("PR-1817 will use an attachment for multiple recipients.");
  return { blockers, warnings };
}

function validate1808(data = state) {
  const blockers = [];
  const warnings = [];
  const decision = openingPathDecision(data);
  if (decision.key === "unknown") blockers.push("PR-1808 needs a selected opening path.");
  if (decision.key === "blocked_no_will") blockers.push("PR-1808 should wait for formal-administration or attorney review.");
  if (!hasValue(data.estate.county)) blockers.push("PR-1808 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1808 needs the decedent name.");
  if (!hasValue(data.decedent.dateOfDeath)) blockers.push("PR-1808 needs date of death.");
  if (!hasValue(data.pr.fullName)) blockers.push("PR-1808 needs the proposed personal representative name.");
  if (!hasValue(data.otherProceedings.status)) blockers.push("PR-1808 needs other-proceedings status.");
  if (data.will.exists === "yes") {
    if (!hasValue(data.will.date)) blockers.push("PR-1808 needs the will date for the will path.");
    if (!hasValue(data.will.hasCodicils)) blockers.push("PR-1808 needs whether the will has codicils.");
    if (data.will.hasCodicils === "yes" && !hasValue(data.will.codicilDates)) {
      blockers.push("PR-1808 needs the codicil date(s).");
    }
    if (!hasValue(data.will.location)) blockers.push("PR-1808 needs original will status.");
    if (data.will.location === "en_route") warnings.push("PR-1808 has no en-route checkbox; court review may be needed.");
  }
  if (data.courtDrafts.prBondType === "surety" && !hasValue(data.courtDrafts.prBondAmount)) {
    blockers.push("PR-1808 needs a surety bond amount.");
  }
  if (data.requests.appointTrustee) {
    if (!hasValue(data.requests.trusteeNames)) blockers.push("PR-1808 needs trustee name(s).");
    if (!hasValue(data.requests.trustName)) blockers.push("PR-1808 needs the trust name.");
    if (data.courtDrafts.trusteeBondType === "surety" && !hasValue(data.courtDrafts.trusteeBondAmount)) {
      blockers.push("PR-1808 needs a trustee surety bond amount.");
    }
  }
  if (!hasValue(data.estate.caseNumber)) warnings.push("PR-1808 usually needs the assigned case number before filing.");
  return { blockers, warnings };
}

function validate1810(data = state) {
  const blockers = [];
  const warnings = [];
  if (!hasValue(data.estate.county)) blockers.push("PR-1810 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1810 needs the decedent name.");
  if (!hasValue(data.decedent.dateOfBirth)) warnings.push("PR-1810 should include date of birth.");
  if (!hasValue(data.decedent.dateOfDeath)) blockers.push("PR-1810 needs date of death.");
  if (!hasValue(data.decedent.domicileCounty)) blockers.push("PR-1810 needs domicile county.");
  if (!hasValue(data.decedent.domicileState)) blockers.push("PR-1810 needs domicile state.");
  if (!hasValue(data.pr.fullName)) blockers.push("PR-1810 needs the personal representative name.");
  if (!hasValue(data.pr.address)) warnings.push("PR-1810 should include the personal representative address.");
  if (!hasValue(data.estate.caseNumber)) warnings.push("PR-1810 usually needs the assigned case number before issuance.");
  return { blockers, warnings };
}

function validate1811(data = state) {
  const blockers = [];
  const warnings = [];
  if (!hasValue(data.estate.county)) blockers.push("PR-1811 needs the county.");
  if (!hasValue(data.decedent.fullName)) blockers.push("PR-1811 needs the decedent name.");
  if (!hasValue(data.decedent.dateOfDeath)) blockers.push("PR-1811 needs date of death.");
  if (!hasValue(data.pr.fullName)) blockers.push("PR-1811 needs the personal representative name.");
  if (!hasValue(data.pr.address)) warnings.push("PR-1811 should include the personal representative address.");
  const items = data.inventory.items.filter((item) => hasValue(item.description) || hasValue(item.value));
  if (!items.length) blockers.push("PR-1811 needs at least one inventory item.");
  items.forEach((item, index) => {
    if (!hasValue(item.description)) blockers.push(`Inventory item ${index + 1} needs a description.`);
    if (!hasValue(item.value)) blockers.push(`Inventory item ${index + 1} needs a date-of-death value.`);
  });
  if (items.length > 29) warnings.push("PR-1811 will use an attachment for inventory items beyond the first 29.");
  if (!hasValue(data.estate.caseNumber)) warnings.push("PR-1811 usually needs the assigned case number.");
  return { blockers, warnings };
}

function scenarioPerson(name, relationship, address, options = {}) {
  const base = emptyInterestedPerson();
  return {
    ...base,
    name,
    relationship,
    address,
    minorDateOfBirth: options.minorDateOfBirth || "",
    email: options.email || "",
    phone: options.phone || "",
    barNumber: options.barNumber || "",
    roles: {
      ...base.roles,
      ...(options.roles || {})
    },
    service: {
      ...base.service,
      ...(options.service || {})
    }
  };
}

function scenarioChild(name, address, options = {}) {
  return {
    ...emptyHeirshipChild(),
    name,
    address,
    livingStatus: options.livingStatus || "living",
    minorDateOfBirth: options.minorDateOfBirth || "",
    notes: options.notes || ""
  };
}

function baseTestScenarioState(overrides = {}) {
  const base = mergeDeep(emptyState(), {
    estate: {
      county: "Milwaukee",
      caseNumber: "",
      estimatedGrossValue: "185000",
      estimatedNetValue: "175000"
    },
    intake: {
      userRole: "self"
    },
    ui: {
      mode: "guided",
      interviewStepId: "role"
    },
    decedent: {
      fullName: "Jane A. Decedent",
      dateOfBirth: "1947-03-14",
      dateOfDeath: "2026-05-20",
      domicileCounty: "Milwaukee",
      domicileState: "Wisconsin",
      lastMailingAddress: "1000 North Lake Drive, Milwaukee, WI 53202"
    },
    applicant: {
      fullName: "Alex Decedent",
      capacity: "Adult child and heir",
      address: "2200 West Park Street, Milwaukee, WI 53213",
      email: "alex@example.com",
      phone: "414-555-0120",
      signatureDate: "2026-06-08"
    },
    pr: {
      sameAsApplicant: true,
      isWisconsinResident: "yes",
      signatureDate: "2026-06-08"
    },
    otherProceedings: {
      status: "not_pending",
      explanation: ""
    },
    will: {
      exists: "no",
      date: "",
      hasCodicils: "no",
      codicilDates: "",
      location: "",
      namedPr: "",
      namedPrNone: true,
      namedTrustee: "",
      namedTrusteeNone: true,
      nominatedTrustee: "",
      nominatedTrusteeNone: true,
      hasNamedBeneficiaries: "no",
      noWillDiligentInquiry: true
    },
    opening: {
      waiverStatus: "all_signed",
      unknownInterestedPersonsStatus: "none_unknown",
      noticeReason: "",
      peopleWhoCannotSign: "",
      peopleNotFound: "",
      publicationNotes: ""
    },
    countyDefaults: {
      courthouseCounty: "Milwaukee County Circuit Court",
      courthouseAddress: "901 North 9th Street, Milwaukee, WI 53233",
      room: "Probate Division",
      probateOfficeName: "Probate Division",
      registrarName: "Probate Registrar",
      newspaperName: "The Daily Reporter",
      accommodationPhone: "414-278-5362",
      localNotes: "Scenario default only; verify county details before filing.",
      lastVerified: "2026-06-08",
      sourceUrl: ""
    },
    waiver: {
      signatureMode: "single",
      receivedWillCopy: true,
      receivedBequestNotice: false,
      consentToAdmitWill: true,
      signatureDate: "2026-06-08"
    },
    notice1804: {
      courthouseCounty: "Milwaukee County Circuit Court",
      courthouseAddress: "901 North 9th Street, Milwaukee, WI 53233",
      room: "Probate Division",
      claimDeadline: "2026-10-22",
      newspaperName: "The Daily Reporter"
    },
    notice1805: {
      courthouseCounty: "Milwaukee County Circuit Court",
      courthouseAddress: "901 North 9th Street, Milwaukee, WI 53233",
      room: "Probate Division",
      registrarName: "Probate Registrar",
      hearingDate: "",
      hearingTime: "",
      claimDeadline: "2026-10-22",
      unknownInterestedPersons: "",
      accommodationPhone: "414-278-5362",
      checkExactTime: true,
      newspaperName: "The Daily Reporter"
    },
    heirship: {
      informant: {
        name: "Alex Decedent",
        address: "2200 West Park Street, Milwaukee, WI 53213",
        relationship: "Adult child"
      },
      spouse: {
        exists: "no",
        name: ""
      },
      children: {
        exists: "yes",
        people: [
          scenarioChild("Alex Decedent", "2200 West Park Street, Milwaukee, WI 53213"),
          scenarioChild("Morgan Decedent", "700 South Pine Avenue, Wauwatosa, WI 53213")
        ],
        list: "Alex Decedent; Morgan Decedent",
        deceasedChildDescendants: "",
        allOfSurvivingSpouse: "not_applicable",
        blendedDetails: ""
      },
      parents: {
        exists: "no",
        names: ""
      },
      siblings: {
        exists: "no",
        names: "",
        deceasedSiblingDescendants: ""
      },
      survivorship120: {
        exists: "no",
        details: ""
      }
    },
    benefits: {
      medicalAssistance: "did_not",
      familyCare: "did_not",
      communityOptions: "did_not",
      chronicDisease: "did_not",
      institution: "was_not",
      explanation: "",
      lackInfo: false
    },
    spouse: {
      fullName: "",
      livingStatus: "",
      statusAtDeath: "",
      communityOptions: "",
      chronicDisease: "",
      seeAttached: false,
      lackInfo: false
    },
    willBeneficiaries: [],
    interestedPersons: [
      scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
        roles: { heir: true },
        service: { waiverStatus: "can_sign", locationStatus: "known" }
      }),
      scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
        roles: { heir: true },
        service: { waiverStatus: "can_sign", locationStatus: "known" }
      })
    ],
    requests: {
      domiciliaryLettersTo: "Alex Decedent",
      appointTrustee: false,
      trusteeNames: "",
      trustName: "",
      additionalTrusts: false,
      otherSelected: false,
      otherText: "",
      question10OtherSelected: false,
      question10OtherText: "",
      interestedPersonsSeeAttached: false
    },
    service: {
      declarantName: "Alex Decedent",
      declarantCity: "Milwaukee",
      declarantState: "Wisconsin",
      declarantAddress: "2200 West Park Street, Milwaukee, WI 53213",
      declarantEmail: "alex@example.com",
      declarantPhone: "414-555-0120",
      serviceDate: "2026-06-08",
      documentsProvided: "Application for Informal Administration and related opening documents",
      originalOnFile: true,
      copyAttached: false,
      method: "Mail",
      signatureDate: "2026-06-08"
    },
    courtDrafts: {
      prBondType: "none",
      prBondAmount: "",
      trusteeBondType: "none",
      trusteeBondAmount: "",
      otherFindingsSelected: false,
      otherFindingsText: "",
      otherOrdersSelected: false,
      otherOrdersText: "",
      lettersOtherText: ""
    },
    inventory: {
      signatureDate: "",
      items: [
        emptyInventoryItem()
      ]
    },
    deadlines: {
      firstPublicationDate: "2026-06-12",
      claimDeadline: "2026-10-22",
      inventoryDueDate: "2026-12-15"
    },
    preparer: {
      fullName: "Alex Decedent",
      address: "2200 West Park Street, Milwaukee, WI 53213",
      email: "alex@example.com",
      phone: "414-555-0120"
    }
  });
  const merged = mergeDeep(base, overrides || {});
  migrateLoadedState(merged, overrides || {});
  syncHeirshipChildrenList(merged, { persist: false });
  syncApplicantToPr(merged, { persist: false });
  return merged;
}

const testScenarios = [
  {
    id: "transfer-affidavit-bank-under-50-ready",
    title: "Transfer by Affidavit: bank account under $50,000",
    detail: "A simple non-real-estate small estate should route to the lower-cost affidavit package with no affidavit blockers.",
    state: {
      estate: { estimatedGrossValue: "40000", estimatedNetValue: "40000" },
      pathRouter: {
        grossValue: "40000",
        hasRealEstate: "no",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "no",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Bank account", holder: "Example Bank", description: "Checking account ending 1234", value: "40000", accountOrIdentifier: "****1234", releaseInstructions: "Release to Alex Decedent", notes: "" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      noBlockersFor: ["transferAffidavit"]
    }
  },
  {
    id: "transfer-affidavit-over-50",
    title: "Transfer by Affidavit: over $50,000",
    detail: "An estate above the small-estate threshold should route to informal probate and block the affidavit package.",
    state: {
      estate: { estimatedGrossValue: "75000", estimatedNetValue: "75000" },
      pathRouter: {
        grossValue: "75000",
        hasRealEstate: "no",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "no",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Bank account", holder: "Example Bank", description: "Savings account", value: "75000" }
        ]
      }
    },
    expected: {
      routeKey: "informal_probate",
      transferBlockersContain: ["$50,000 or less"]
    }
  },
  {
    id: "transfer-affidavit-pending-probate",
    title: "Transfer by Affidavit: probate already pending",
    detail: "A pending probate proceeding should stop the affidavit package until reviewed.",
    state: {
      estate: { estimatedGrossValue: "25000", estimatedNetValue: "25000" },
      pathRouter: {
        grossValue: "25000",
        hasRealEstate: "no",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "no",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "no",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Bank account", holder: "Credit Union", description: "Checking account", value: "25000" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      transferBlockersContain: ["pending probate"]
    }
  },
  {
    id: "transfer-affidavit-real-estate-notice-needed",
    title: "Transfer by Affidavit: real estate notice needed",
    detail: "Real estate should require heir notice or waivers before the affidavit package is ready.",
    state: {
      estate: { estimatedGrossValue: "45000", estimatedNetValue: "45000" },
      pathRouter: {
        grossValue: "45000",
        hasRealEstate: "yes",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "yes",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "no",
        creditorConcern: "no",
        assets: [
          { type: "Real estate", holder: "Register of Deeds", description: "Homestead interest, legal description to attach", value: "45000", accountOrIdentifier: "Tax key TBD" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      transferBlockersContain: ["heir notice"],
      transferWarningsContain: ["Real estate transfer"]
    }
  },
  {
    id: "transfer-affidavit-named-pr-real-estate",
    title: "Transfer by Affidavit: named PR cannot transfer real estate",
    detail: "A person signing only as nominated PR should not use the affidavit for real estate.",
    state: {
      estate: { estimatedGrossValue: "30000", estimatedNetValue: "30000" },
      pathRouter: {
        grossValue: "30000",
        hasRealEstate: "yes",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Named PR in will",
        affiantCapacity: "named_pr",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "yes",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "yes",
        creditorConcern: "no",
        assets: [
          { type: "Real estate", holder: "Register of Deeds", description: "Vacant land interest", value: "30000" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      transferBlockersContain: ["nominated personal representative"]
    }
  },
  {
    id: "transfer-affidavit-public-benefits",
    title: "Transfer by Affidavit: public benefits need Estate Recovery notice",
    detail: "If benefits are marked, Estate Recovery notice must be confirmed before transfer.",
    state: {
      estate: { estimatedGrossValue: "20000", estimatedNetValue: "20000" },
      pathRouter: {
        grossValue: "20000",
        hasRealEstate: "no",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "yes",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "no",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "yes",
        estateRecoveryNoticeSent: "no",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Refund/check", holder: "Insurance carrier", description: "Refund check payable to estate", value: "20000" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      transferBlockersContain: ["Estate Recovery Program"],
      transferWarningsContain: ["Public-benefits"]
    }
  },
  {
    id: "transfer-affidavit-unknown-successors",
    title: "Transfer by Affidavit: unknown successors",
    detail: "Unknown or missing successors should push the route to attorney review.",
    state: {
      estate: { estimatedGrossValue: "15000", estimatedNetValue: "15000" },
      pathRouter: {
        grossValue: "15000",
        hasRealEstate: "no",
        allInterestedKnown: "no",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "no",
        realEstateIncluded: "no",
        vehicleIncluded: "no",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Bank account", holder: "Example Bank", description: "Checking account", value: "15000" }
        ]
      }
    },
    expected: {
      routeKey: "attorney_review",
      transferWarningsContain: ["Unknown or disputed successors"]
    }
  },
  {
    id: "transfer-affidavit-vehicle-ready",
    title: "Transfer by Affidavit: vehicle transfer",
    detail: "A vehicle-only transfer can be ready but should flag DMV-specific title steps.",
    state: {
      estate: { estimatedGrossValue: "12000", estimatedNetValue: "12000" },
      pathRouter: {
        grossValue: "12000",
        hasRealEstate: "no",
        allInterestedKnown: "yes",
        allAdultsCapable: "yes",
        everyoneAgrees: "yes",
        publicBenefits: "no",
        creditorDispute: "no",
        formalConcern: "no"
      },
      decedent: { dateOfDeath: "2026-04-01" },
      transferAffidavit: {
        affiantName: "Alex Decedent",
        affiantAddress: "2200 West Park Street, Milwaukee, WI 53213",
        affiantRelationship: "Adult child and heir",
        affiantCapacity: "heir",
        daysSinceDeathConfirmed: "yes",
        noPendingProbate: "yes",
        entitledPersonsKnown: "yes",
        realEstateIncluded: "no",
        vehicleIncluded: "yes",
        publicBenefitsFollowup: "no",
        estateRecoveryNoticeSent: "not_needed",
        realEstateHeirNoticeComplete: "not_needed",
        creditorConcern: "no",
        assets: [
          { type: "Vehicle", holder: "Wisconsin DMV", description: "2018 Ford Escape", value: "12000", accountOrIdentifier: "VIN TBD", releaseInstructions: "Retitle to Alex Decedent" }
        ]
      }
    },
    expected: {
      routeKey: "transfer_affidavit",
      noBlockersFor: ["transferAffidavit"],
      transferWarningsContain: ["Vehicle transfer"]
    }
  },
  {
    id: "no-will-all-waivers",
    title: "No will, all interested persons can sign",
    detail: "Adult children are known, addresses are complete, and everyone can sign PR-1803.",
    expected: {
      decisionKey: "waiver",
      readinessReady: true,
      includedForms: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Alex Decedent", "Morgan Decedent"],
      serviceCounts: { canSignWaiverCount: 2, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "will-all-waivers",
    title: "Will case, all waivers available",
    detail: "The original will accompanies the application, the named PR is known, and beneficiaries can sign.",
    state: {
      will: {
        exists: "yes",
        date: "2021-04-10",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      willBeneficiaries: [
        { name: "Taylor Beneficiary", role: "beneficiary", relationship: "Friend named in will", address: "909 East Mason Street, Milwaukee, WI 53202", minorDateOfBirth: "", notes: "" }
      ],
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Taylor Beneficiary", "Will beneficiary", "909 East Mason Street, Milwaukee, WI 53202", {
          roles: { beneficiary: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      includedForms: ["originalWill", "pr1803", "pr1804", "pr1808", "pr1810"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Alex Decedent", "Morgan Decedent", "Taylor Beneficiary"],
      serviceCounts: { canSignWaiverCount: 3, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808"]
    }
  },
  {
    id: "will-notice-person-will-not-sign",
    title: "Will case, one person will not sign",
    detail: "One adult interested person refuses or will not sign, so the packet should shift to PR-1805 notice.",
    state: {
      will: {
        exists: "yes",
        date: "2020-08-22",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "no",
        noWillDiligentInquiry: false
      },
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "none_unknown",
        noticeReason: "interested_person_will_not_sign",
        peopleWhoCannotSign: "Morgan Decedent",
        peopleNotFound: ""
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "will_not_sign", locationStatus: "known", needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "notice",
      readinessReady: true,
      courtSuppliedContain: ["PR-1805 hearing date is usually filled by the Probate Registrar"],
      includedForms: ["pr1805", "pr1817"],
      excludedForms: ["pr1803", "pr1804"],
      serviceCounts: { mailedNoticeCount: 1, requiresNotice: true },
      noBlockersFor: ["pr1801", "pr1805", "pr1806", "pr1807", "pr1808", "pr1810", "pr1817"]
    }
  },
  {
    id: "will-unknown-person",
    title: "Will case, unknown or missing interested person",
    detail: "A person cannot be located or is not reasonably ascertainable, so PR-1805 and publication/service review should appear.",
    state: {
      will: {
        exists: "yes",
        date: "2019-02-15",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "no",
        noWillDiligentInquiry: false
      },
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "some_unknown",
        noticeReason: "cannot_locate",
        peopleWhoCannotSign: "",
        peopleNotFound: "Unknown descendant of deceased child"
      },
      notice1805: {
        unknownInterestedPersons: "Unknown descendant of deceased child"
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Unknown descendant", "Potential heir", "", {
          roles: { heir: true },
          service: { waiverStatus: "unknown", locationStatus: "unknown_person", needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "notice",
      includedForms: ["pr1805", "pr1817"],
      excludedForms: ["pr1803", "pr1804"],
      serviceCounts: { unknownOrMissingCount: 1, requiresNotice: true },
      blockersContain: ["Interested person 2 needs a mailing address", "PR-1817 Unknown descendant needs a mailing address"],
      noBlockersFor: ["pr1805", "pr1806", "pr1807", "pr1808"]
    }
  },
  {
    id: "will-minor-protected",
    title: "Will case, minor/protected interested person",
    detail: "A minor beneficiary should not be treated as a simple waiver signer and should push the app toward notice/review.",
    state: {
      will: {
        exists: "yes",
        date: "2022-11-03",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      willBeneficiaries: [
        { name: "Jamie Minor", role: "beneficiary", relationship: "Grandchild named in will", address: "300 West Main Street, Madison, WI 53703", minorDateOfBirth: "2012-07-01", notes: "" }
      ],
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "none_unknown",
        noticeReason: "minor_or_protected_person",
        peopleWhoCannotSign: "Jamie Minor",
        peopleNotFound: ""
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Jamie Minor", "Will beneficiary", "300 West Main Street, Madison, WI 53703", {
          minorDateOfBirth: "2012-07-01",
          roles: { beneficiary: true, minor: true, needsGuardian: true },
          service: { waiverStatus: "not_eligible", locationStatus: "known", protectedPerson: true, needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "notice",
      includedForms: ["pr1805", "pr1817"],
      excludedForms: ["pr1803", "pr1804"],
      serviceCounts: { protectedCount: 1, mailedNoticeCount: 1, requiresNotice: true },
      warningsContain: ["may need guardian/agent service review"],
      noBlockersFor: ["pr1801", "pr1805", "pr1806", "pr1807", "pr1808", "pr1817"]
    }
  },
  {
    id: "nonresident-pr-resident-agent",
    title: "Nonresident PR with Wisconsin resident agent",
    detail: "The proposed PR lives outside Wisconsin, so PR-1807 should require and accept resident-agent information.",
    state: {
      applicant: {
        fullName: "Casey Applicant",
        capacity: "Adult child and applicant",
        address: "1200 West Wells Street, Milwaukee, WI 53233",
        email: "casey@example.com",
        phone: "414-555-0144",
        signatureDate: "2026-06-08"
      },
      pr: {
        sameAsApplicant: false,
        fullName: "Jordan PR",
        address: "1440 Lakeshore Drive, Chicago, IL 60610",
        email: "jordan@example.com",
        phone: "312-555-0188",
        isWisconsinResident: "no",
        signatureDate: "2026-06-08",
        residentAgent: {
          name: "Riley Agent",
          address: "500 East Wisconsin Avenue, Milwaukee, WI 53202",
          email: "agent@example.com",
          phone: "414-555-0177",
          signatureDate: "2026-06-08"
        }
      },
      requests: {
        domiciliaryLettersTo: "Jordan PR"
      },
      interestedPersons: [
        scenarioPerson("Casey Applicant", "Adult child and heir; Applicant", "1200 West Wells Street, Milwaukee, WI 53233", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      includedForms: ["pr1807", "pr1803", "pr1804"],
      excludedForms: ["pr1805"],
      serviceCounts: { canSignWaiverCount: 2, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "no-spouse-no-children-parents",
    title: "No spouse or children, parents are heirs",
    detail: "The heirship flow should carry parents forward as interested persons when there are no spouse/descendants.",
    state: {
      applicant: {
        fullName: "Pat Parent",
        capacity: "Parent and heir",
        address: "44 North Main Street, West Allis, WI 53214",
        email: "pat@example.com",
        phone: "414-555-0121",
        signatureDate: "2026-06-08"
      },
      heirship: {
        informant: {
          name: "Pat Parent",
          address: "44 North Main Street, West Allis, WI 53214",
          relationship: "Parent"
        },
        spouse: {
          exists: "no",
          name: ""
        },
        children: {
          exists: "no",
          people: [
            emptyHeirshipChild()
          ],
          list: "",
          deceasedChildDescendants: "",
          allOfSurvivingSpouse: "",
          blendedDetails: ""
        },
        parents: {
          exists: "yes",
          names: "Pat Parent; Robin Parent"
        },
        siblings: {
          exists: "no",
          names: "",
          deceasedSiblingDescendants: ""
        }
      },
      interestedPersons: [
        scenarioPerson("Pat Parent", "Parent and heir; Proposed Personal Representative", "44 North Main Street, West Allis, WI 53214", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Robin Parent", "Parent and heir", "88 South Elm Street, Greenfield, WI 53220", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ],
      preparer: {
        fullName: "Pat Parent",
        address: "44 North Main Street, West Allis, WI 53214",
        email: "pat@example.com",
        phone: "414-555-0121"
      }
    },
    expected: {
      decisionKey: "waiver",
      includedForms: ["pr1803", "pr1804", "pr1806"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Pat Parent", "Robin Parent"],
      serviceCounts: { canSignWaiverCount: 2, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "blended-family-spouse-and-nonmarital-child",
    title: "Blended family, spouse plus child from prior relationship",
    detail: "A surviving spouse and adult children are all known, but not every child is also a child of the surviving spouse.",
    state: {
      heirship: {
        spouse: {
          exists: "yes",
          name: "Sam Spouse"
        },
        children: {
          exists: "yes",
          people: [
            scenarioChild("Alex Decedent", "2200 West Park Street, Milwaukee, WI 53213"),
            scenarioChild("Morgan Decedent", "700 South Pine Avenue, Wauwatosa, WI 53213")
          ],
          list: "Alex Decedent; Morgan Decedent",
          deceasedChildDescendants: "",
          allOfSurvivingSpouse: "no",
          blendedDetails: "Morgan Decedent is the decedent's child from a prior relationship."
        }
      },
      interestedPersons: [
        scenarioPerson("Sam Spouse", "Surviving spouse/domestic partner; Heir", "1500 East Capitol Drive, Shorewood, WI 53211", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: true,
      includedForms: ["pr1803", "pr1804", "pr1806"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Sam Spouse", "Alex Decedent", "Morgan Decedent"],
      serviceCounts: { canSignWaiverCount: 3, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "deceased-child-descendants-known",
    title: "Deceased child with living descendants",
    detail: "A deceased child left descendants, and the living descendants should be carried forward as interested persons.",
    state: {
      heirship: {
        children: {
          exists: "yes",
          people: [
            scenarioChild("Alex Decedent", "2200 West Park Street, Milwaukee, WI 53213")
          ],
          list: "Alex Decedent",
          deceasedChildDescendants: "Casey Grandchild; Drew Grandchild",
          allOfSurvivingSpouse: "not_applicable",
          blendedDetails: "A deceased child left Casey Grandchild and Drew Grandchild."
        }
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Casey Grandchild", "Descendant of deceased child; Heir", "1212 North 4th Street, Milwaukee, WI 53203", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Drew Grandchild", "Descendant of deceased child; Heir", "515 West Wisconsin Avenue, Milwaukee, WI 53203", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: true,
      includedForms: ["pr1803", "pr1804", "pr1806"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Alex Decedent", "Casey Grandchild", "Drew Grandchild"],
      serviceCounts: { canSignWaiverCount: 3, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "no-will-minor-heir-guardian-review",
    title: "No will, minor heir needs guardian review",
    detail: "A minor heir cannot be treated as a routine waiver signer, and a no-will case without all waivers should stop for review.",
    state: {
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "none_unknown",
        noticeReason: "minor_or_protected_person",
        peopleWhoCannotSign: "Jamie Minor",
        peopleNotFound: ""
      },
      heirship: {
        children: {
          exists: "yes",
          people: [
            scenarioChild("Alex Decedent", "2200 West Park Street, Milwaukee, WI 53213"),
            scenarioChild("Jamie Minor", "900 North Minor Street, Milwaukee, WI 53202", { minorDateOfBirth: "2014-05-10" })
          ],
          list: "Alex Decedent; Jamie Minor",
          deceasedChildDescendants: "",
          allOfSurvivingSpouse: "not_applicable",
          blendedDetails: ""
        }
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Jamie Minor", "Minor child and heir", "900 North Minor Street, Milwaukee, WI 53202", {
          minorDateOfBirth: "2014-05-10",
          roles: { heir: true, minor: true, needsGuardian: true },
          service: { waiverStatus: "not_eligible", locationStatus: "known", protectedPerson: true, needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "blocked_no_will",
      readinessReady: false,
      includedForms: ["pr1801", "pr1806", "pr1807", "pr1817"],
      excludedForms: ["pr1803", "pr1804", "pr1805"],
      serviceCounts: { protectedCount: 1, mailedNoticeCount: 1, requiresNotice: true },
      warningsContain: ["guardian/agent service review"],
      blockersContain: ["PR-1808 should wait for formal-administration or attorney review"]
    }
  },
  {
    id: "will-trust-beneficiary-and-trustee",
    title: "Will names trustee and trust beneficiary",
    detail: "A will creates or involves a trust, so trustee and trust beneficiary parties should carry into the interested-person review.",
    state: {
      will: {
        exists: "yes",
        date: "2020-12-01",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        namedTrustee: "Taylor Trustee",
        namedTrusteeNone: false,
        nominatedTrustee: "",
        nominatedTrusteeNone: true,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      requests: {
        domiciliaryLettersTo: "Alex Decedent",
        appointTrustee: true,
        trusteeNames: "Taylor Trustee",
        trustName: "Jane A. Decedent Family Trust"
      },
      willBeneficiaries: [
        { name: "River Trust", role: "trust_beneficiary", relationship: "Trust beneficiary named in will", address: "400 Trust Avenue, Milwaukee, WI 53202", minorDateOfBirth: "", notes: "" },
        { name: "Taylor Trustee", role: "trustee", relationship: "Trustee named in will", address: "725 North Water Street, Milwaukee, WI 53202", minorDateOfBirth: "", notes: "" }
      ],
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("River Trust", "Trust beneficiary", "400 Trust Avenue, Milwaukee, WI 53202", {
          roles: { trustBeneficiary: true, beneficiary: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Taylor Trustee", "Trustee named in will", "725 North Water Street, Milwaukee, WI 53202", {
          roles: { trustee: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: true,
      includedForms: ["originalWill", "pr1803", "pr1804", "pr1808", "pr1810"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Alex Decedent", "Morgan Decedent", "River Trust", "Taylor Trustee"],
      serviceCounts: { canSignWaiverCount: 4, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "will-charity-beneficiary",
    title: "Will includes charity beneficiary",
    detail: "An organization named in the will should be treated as a beneficiary/interested party for packet review.",
    state: {
      will: {
        exists: "yes",
        date: "2021-09-09",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      willBeneficiaries: [
        { name: "Good Works Food Pantry", role: "entity", relationship: "Charity beneficiary named in will", address: "2100 Charity Lane, Milwaukee, WI 53212", minorDateOfBirth: "", notes: "" }
      ],
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Good Works Food Pantry", "Organization or charity beneficiary", "2100 Charity Lane, Milwaukee, WI 53212", {
          roles: { beneficiary: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: true,
      includedForms: ["originalWill", "pr1803", "pr1804"],
      excludedForms: ["pr1805"],
      interestedPersons: ["Good Works Food Pantry"],
      serviceCounts: { canSignWaiverCount: 3, requiresNotice: false },
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806", "pr1807", "pr1808", "pr1810"]
    }
  },
  {
    id: "auto-sync-complex-interested-person-treatment",
    title: "Auto-sync complex interested-person treatment",
    detail: "The roster should pull missing will parties forward and classify trust, charity, trustee, minor, and service treatment before packet selection.",
    autoSyncInterestedPersons: true,
    state: {
      will: {
        exists: "yes",
        date: "2020-12-01",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        namedTrustee: "Taylor Trustee",
        namedTrusteeNone: false,
        nominatedTrustee: "",
        nominatedTrusteeNone: true,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      requests: {
        domiciliaryLettersTo: "Alex Decedent",
        appointTrustee: true,
        trusteeNames: "Taylor Trustee",
        trustName: "Jane A. Decedent Family Trust"
      },
      willBeneficiaries: [
        { name: "River Trust", role: "trust_beneficiary", relationship: "Trust beneficiary named in will", address: "400 Trust Avenue, Milwaukee, WI 53202", minorDateOfBirth: "", notes: "" },
        { name: "Good Works Food Pantry", role: "entity", relationship: "Charity beneficiary named in will", address: "2100 Charity Lane, Milwaukee, WI 53212", minorDateOfBirth: "", notes: "" },
        { name: "Taylor Trustee", role: "trustee", relationship: "Trustee named in will", address: "725 North Water Street, Milwaukee, WI 53202", minorDateOfBirth: "", notes: "" },
        { name: "Jamie Minor", role: "beneficiary", relationship: "Grandchild named in will", address: "300 West Main Street, Madison, WI 53703", minorDateOfBirth: "2012-07-01", notes: "" }
      ],
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "notice",
      readinessReady: true,
      includedForms: ["originalWill", "pr1805", "pr1817", "pr1808", "pr1810"],
      excludedForms: ["pr1803", "pr1804"],
      interestedPersons: ["Alex Decedent", "Morgan Decedent", "River Trust", "Good Works Food Pantry", "Taylor Trustee", "Jamie Minor"],
      serviceCounts: { canSignWaiverCount: 5, protectedCount: 1, mailedNoticeCount: 1, missingAddressCount: 0, requiresNotice: true },
      warningsContain: ["guardian/agent service review"],
      noBlockersFor: ["pr1801", "pr1805", "pr1806", "pr1807", "pr1808", "pr1810", "pr1817"]
    }
  },
  {
    id: "will-beneficiary-address-unknown",
    title: "Will beneficiary address unknown",
    detail: "A will beneficiary is known by name but cannot be located, so PR-1805 notice is expected and readiness should flag address problems.",
    state: {
      will: {
        exists: "yes",
        date: "2018-06-18",
        hasCodicils: "no",
        location: "original_accompanies",
        namedPr: "Alex Decedent",
        namedPrNone: false,
        hasNamedBeneficiaries: "yes",
        noWillDiligentInquiry: false
      },
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "some_unknown",
        noticeReason: "cannot_locate",
        peopleWhoCannotSign: "",
        peopleNotFound: "Beth Missing"
      },
      notice1805: {
        unknownInterestedPersons: "Beth Missing, a will beneficiary whose current address is unknown"
      },
      willBeneficiaries: [
        { name: "Beth Missing", role: "beneficiary", relationship: "Will beneficiary", address: "", minorDateOfBirth: "", notes: "Current address unknown" }
      ],
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Personal Representative named in will", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true, namedPr: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Beth Missing", "Will beneficiary", "", {
          roles: { beneficiary: true },
          service: { waiverStatus: "unknown", locationStatus: "cannot_locate", needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "notice",
      readinessReady: false,
      includedForms: ["pr1805", "pr1817"],
      excludedForms: ["pr1803", "pr1804"],
      interestedPersons: ["Beth Missing"],
      serviceCounts: { unknownOrMissingCount: 1, mailedNoticeCount: 1, missingAddressCount: 1, requiresNotice: true },
      blockersContain: ["Interested person 3 needs a mailing address", "PR-1817 Beth Missing needs a mailing address"],
      noBlockersFor: ["pr1805", "pr1806", "pr1807", "pr1808"]
    }
  },
  {
    id: "out-of-state-pr-missing-resident-agent",
    title: "Out-of-state PR missing resident agent",
    detail: "A nonresident proposed PR should block readiness until Wisconsin resident-agent information is supplied.",
    state: {
      applicant: {
        fullName: "Casey Applicant",
        capacity: "Adult child and applicant",
        address: "1200 West Wells Street, Milwaukee, WI 53233",
        email: "casey@example.com",
        phone: "414-555-0144",
        signatureDate: "2026-06-08"
      },
      pr: {
        sameAsApplicant: false,
        fullName: "Jordan PR",
        address: "1440 Lakeshore Drive, Chicago, IL 60610",
        email: "jordan@example.com",
        phone: "312-555-0188",
        isWisconsinResident: "no",
        signatureDate: "2026-06-08",
        residentAgent: {
          name: "",
          address: "",
          email: "",
          phone: "",
          signatureDate: ""
        }
      },
      requests: {
        domiciliaryLettersTo: "Jordan PR"
      },
      interestedPersons: [
        scenarioPerson("Casey Applicant", "Adult child and heir; Applicant", "1200 West Wells Street, Milwaukee, WI 53233", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: false,
      includedForms: ["pr1803", "pr1804", "pr1807"],
      excludedForms: ["pr1805"],
      serviceCounts: { canSignWaiverCount: 2, requiresNotice: false },
      blockersContain: ["Nonresident PR requires a resident agent name", "Nonresident PR requires a resident agent address"],
      noBlockersFor: ["pr1801", "pr1803", "pr1804", "pr1806"]
    }
  },
  {
    id: "no-will-unknown-heir-no-waiver",
    title: "No will, unknown heir prevents all waivers",
    detail: "A no-will estate with an unknown or not-located heir should remain blocked from PR-1805 in this prototype.",
    state: {
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "some_unknown",
        noticeReason: "cannot_locate",
        peopleWhoCannotSign: "",
        peopleNotFound: "Unknown child or descendant"
      },
      notice1805: {
        unknownInterestedPersons: "Unknown child or descendant"
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Unknown Heir", "Potential heir", "", {
          roles: { heir: true },
          service: { waiverStatus: "unknown", locationStatus: "unknown_person", needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "blocked_no_will",
      readinessReady: false,
      includedForms: ["pr1801", "pr1806", "pr1807", "pr1817"],
      excludedForms: ["pr1803", "pr1804", "pr1805"],
      serviceCounts: { unknownOrMissingCount: 1, mailedNoticeCount: 1, requiresNotice: true },
      blockersContain: ["Interested person 2 needs a mailing address", "PR-1805 is only enabled for the notice path", "PR-1808 should wait for formal-administration or attorney review"]
    }
  },
  {
    id: "missing-address-waiver-warning",
    title: "Waiver path with missing mailing address",
    detail: "A signer can sign, but the app should still flag address quality before waivers, notices, or service are trusted.",
    state: {
      heirship: {
        children: {
          exists: "yes",
          people: [
            scenarioChild("Alex Decedent", "2200 West Park Street, Milwaukee, WI 53213"),
            scenarioChild("Morgan Decedent", "")
          ],
          list: "Alex Decedent; Morgan Decedent",
          deceasedChildDescendants: "",
          allOfSurvivingSpouse: "not_applicable",
          blendedDetails: ""
        }
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "missing_address" }
        })
      ]
    },
    expected: {
      decisionKey: "waiver",
      readinessReady: false,
      includedForms: ["pr1803", "pr1804"],
      excludedForms: ["pr1805"],
      serviceCounts: { missingAddressCount: 1, requiresNotice: false },
      blockersContain: ["PR-1803 Morgan Decedent needs a mailing address"]
    }
  },
  {
    id: "no-will-not-all-waivers",
    title: "No will, not all waivers available",
    detail: "The app should not casually generate PR-1805 for a no-will estate where every waiver is not available.",
    state: {
      opening: {
        waiverStatus: "not_all",
        unknownInterestedPersonsStatus: "none_unknown",
        noticeReason: "interested_person_will_not_sign",
        peopleWhoCannotSign: "Morgan Decedent",
        peopleNotFound: ""
      },
      interestedPersons: [
        scenarioPerson("Alex Decedent", "Adult child and heir; Proposed Personal Representative", "2200 West Park Street, Milwaukee, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "can_sign", locationStatus: "known" }
        }),
        scenarioPerson("Morgan Decedent", "Adult child and heir", "700 South Pine Avenue, Wauwatosa, WI 53213", {
          roles: { heir: true },
          service: { waiverStatus: "will_not_sign", locationStatus: "known", needsMailedNotice: true }
        })
      ]
    },
    expected: {
      decisionKey: "blocked_no_will",
      readinessReady: false,
      includedForms: ["pr1801", "pr1806", "pr1807"],
      excludedForms: ["pr1803", "pr1804", "pr1805"],
      serviceCounts: { mailedNoticeCount: 1, requiresNotice: true },
      blockersContain: ["PR-1808 should wait for formal-administration or attorney review"]
    }
  }
];

function withTemporaryState(tempState, callback) {
  const previous = state;
  state = tempState;
  try {
    return callback();
  } finally {
    state = previous;
  }
}

function scenarioFormReviews() {
  return {
    transferAffidavit: validateTransferAffidavit(),
    pr1801: validate(),
    pr1803: validate1803(),
    pr1804: validate1804(),
    pr1805: validate1805(),
    pr1806: validate1806(),
    pr1807: validate1807(),
    pr1808: validate1808(),
    pr1810: validate1810(),
    pr1811: validate1811(),
    pr1817: validate1817()
  };
}

function evaluateTestScenario(scenario) {
  const data = baseTestScenarioState(scenario.state || {});
  return withTemporaryState(data, () => {
    if (scenario.autoSyncInterestedPersons) {
      syncInterestedPersonRoster({ addMissing: true, persist: false });
    }
    const decision = openingPathDecision(data);
    const route = probatePathDecision(data);
    const packetDetails = openingPacketFormDetails(data);
    const packetMap = Object.fromEntries(packetDetails.map((item) => [item.key, item]));
    const reviews = scenarioFormReviews();
    const readiness = openingDocumentReadiness();
    const serviceSummary = interestedPersonServiceSummary(data);
    const actualInterestedNames = uniqueScenarioNames([
      ...(data.interestedPersons || []).filter(hasInterestedPersonContent).map((person) => person.name),
      ...interestedPersonSuggestions().map((suggestion) => suggestion.name)
    ]);
    const checks = scenarioChecks(scenario.expected || {}, {
      decision,
      route,
      packetMap,
      reviews,
      readiness,
      serviceSummary,
      actualInterestedNames
    });
    return {
      scenario,
      data,
      decision,
      route,
      packetDetails,
      packetMap,
      reviews,
      readiness,
      serviceSummary,
      actualInterestedNames,
      checks,
      pass: checks.every((check) => check.pass)
    };
  });
}

function uniqueScenarioNames(names = []) {
  const seen = new Set();
  return names
    .map(cleanSuggestedPersonName)
    .filter(Boolean)
    .filter((name) => {
      const key = normalizedPersonName(name);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function scenarioChecks(expected, actual) {
  const checks = [];
  const addCheck = (label, pass, expectedValue, actualValue) => {
    checks.push({
      label,
      pass: Boolean(pass),
      expected: expectedValue,
      actual: actualValue
    });
  };

  if (expected.decisionKey) {
    addCheck(
      `Opening decision is ${scenarioDecisionLabel(expected.decisionKey)}`,
      actual.decision.key === expected.decisionKey,
      expected.decisionKey,
      actual.decision.key
    );
  }

  if (expected.routeKey) {
    addCheck(
      `Probate route is ${scenarioDecisionLabel(expected.routeKey)}`,
      actual.route.key === expected.routeKey,
      expected.routeKey,
      actual.route.key
    );
  }

  (expected.includedForms || []).forEach((key) => {
    addCheck(
      `${scenarioFormName(key, actual.packetMap)} is included`,
      actual.packetMap[key]?.status === "included",
      "included",
      actual.packetMap[key]?.status || "missing"
    );
  });

  (expected.excludedForms || []).forEach((key) => {
    addCheck(
      `${scenarioFormName(key, actual.packetMap)} is not included`,
      actual.packetMap[key]?.status !== "included",
      "not included",
      actual.packetMap[key]?.status || "missing"
    );
  });

  Object.entries(expected.formStatus || {}).forEach(([key, status]) => {
    addCheck(
      `${scenarioFormName(key, actual.packetMap)} status is ${packetStatusLabel(status)}`,
      actual.packetMap[key]?.status === status,
      status,
      actual.packetMap[key]?.status || "missing"
    );
  });

  (expected.interestedPersons || []).forEach((name) => {
    const target = normalizedPersonName(name);
    const found = actual.actualInterestedNames.some((actualName) => normalizedPersonName(actualName) === target);
    addCheck(`Interested person carried forward: ${name}`, found, name, actual.actualInterestedNames.join(", "));
  });

  Object.entries(expected.serviceCounts || {}).forEach(([key, value]) => {
    addCheck(
      `Service summary ${scenarioServiceLabel(key)} is ${value}`,
      actual.serviceSummary[key] === value,
      String(value),
      String(actual.serviceSummary[key])
    );
  });

  if (Object.prototype.hasOwnProperty.call(expected, "readinessReady")) {
    addCheck(
      `Opening packet readiness is ${expected.readinessReady ? "ready" : "not ready"}`,
      actual.readiness.ready === expected.readinessReady,
      expected.readinessReady ? "ready" : "not ready",
      actual.readiness.ready ? "ready" : "not ready"
    );
  }

  (expected.courtSuppliedContain || []).forEach((text) => {
    const found = actual.readiness.courtSupplied.some((issue) => issue.toLowerCase().includes(text.toLowerCase()));
    addCheck(
      `Court/county supplied note appears: ${text}`,
      found,
      text,
      found ? "found" : actual.readiness.courtSupplied.join("; ")
    );
  });

  (expected.noBlockersFor || []).forEach((key) => {
    const blockers = actual.reviews[key]?.blockers || [];
    addCheck(
      `${scenarioFormName(key, actual.packetMap)} has no blockers`,
      blockers.length === 0,
      "0 blockers",
      blockers.length ? blockers.join("; ") : "0 blockers"
    );
  });

  const blockers = scenarioIssueList(actual.reviews, "blockers");
  (expected.blockersContain || []).forEach((text) => {
    const found = blockers.some((issue) => issue.toLowerCase().includes(text.toLowerCase()));
    addCheck(`Expected blocker appears: ${text}`, found, text, found ? "found" : blockers.join("; "));
  });

  const warnings = scenarioIssueList(actual.reviews, "warnings");
  (expected.warningsContain || []).forEach((text) => {
    const found = warnings.some((issue) => issue.toLowerCase().includes(text.toLowerCase()));
    addCheck(`Expected warning appears: ${text}`, found, text, found ? "found" : warnings.join("; "));
  });

  (expected.transferBlockersContain || []).forEach((text) => {
    const transferBlockers = actual.reviews.transferAffidavit?.blockers || [];
    const found = transferBlockers.some((issue) => issue.toLowerCase().includes(text.toLowerCase()));
    addCheck(
      `Transfer by Affidavit blocker appears: ${text}`,
      found,
      text,
      found ? "found" : transferBlockers.join("; ")
    );
  });

  (expected.transferWarningsContain || []).forEach((text) => {
    const transferWarnings = actual.reviews.transferAffidavit?.warnings || [];
    const found = transferWarnings.some((issue) => issue.toLowerCase().includes(text.toLowerCase()));
    addCheck(
      `Transfer by Affidavit warning appears: ${text}`,
      found,
      text,
      found ? "found" : transferWarnings.join("; ")
    );
  });

  return checks;
}

function scenarioIssueList(reviews, type) {
  return Object.entries(reviews).flatMap(([formKey, review]) => {
    return (review?.[type] || []).map((issue) => `${scenarioFormName(formKey)} ${issue}`);
  });
}

function scenarioDecisionLabel(key) {
  const labels = {
    waiver: "Open on waiver",
    notice: "Use PR-1805 notice path",
    blocked_no_will: "No-will case without all waivers",
    transfer_affidavit: "Transfer by Affidavit",
    informal_probate: "Informal probate",
    attorney_review: "Attorney review",
    unknown: "Need more information"
  };
  return labels[key] || key;
}

function scenarioServiceLabel(key) {
  const labels = {
    canSignWaiverCount: "can-sign count",
    mailedNoticeCount: "mailed-notice count",
    unknownOrMissingCount: "unknown/missing count",
    protectedCount: "minor/protected count",
    missingAddressCount: "missing-address count",
    requiresNotice: "requires notice"
  };
  return labels[key] || key;
}

function scenarioFormName(key, packetMap = {}) {
  const detail = packetMap[key];
  if (detail) return packetFormLabel(detail);
  const labels = {
    pr1801: "PR-1801",
    pr1803: "PR-1803",
    pr1804: "PR-1804",
    pr1805: "PR-1805",
    pr1806: "PR-1806",
    pr1807: "PR-1807",
    pr1808: "PR-1808",
    pr1810: "PR-1810",
    pr1811: "PR-1811",
    pr1817: "PR-1817",
    transferAffidavit: "Transfer by Affidavit",
    originalWill: "Original will/codicil"
  };
  return labels[key] || key;
}

function renderScenarioView() {
  const summary = document.getElementById("scenarioSummary");
  const list = document.getElementById("scenarioList");
  const audit = document.getElementById("scenarioLogicAudit");
  if (!summary || !list) return;
  const results = testScenarios.map(evaluateTestScenario);
  const passCount = results.filter((result) => result.pass).length;
  const totalChecks = results.reduce((sum, result) => sum + result.checks.length, 0);
  const failedChecks = results.reduce((sum, result) => sum + result.checks.filter((check) => !check.pass).length, 0);
  summary.innerHTML = `
    <div class="scenario-stat ${failedChecks ? "bad" : ""}">
      <strong>${passCount}/${results.length}</strong>
      <span>scenarios passing</span>
    </div>
    <div class="scenario-stat ${failedChecks ? "bad" : ""}">
      <strong>${totalChecks - failedChecks}/${totalChecks}</strong>
      <span>checks passing</span>
    </div>
    <p>The runner uses temporary facts and does not change your current case unless you load a scenario.</p>
  `;
  if (audit) audit.innerHTML = logicAuditPanelHtml();
  list.innerHTML = results.map(scenarioCardHtml).join("");
  list.querySelectorAll("[data-load-scenario]").forEach((button) => {
    button.addEventListener("click", () => loadTestScenario(button.dataset.loadScenario, "guided"));
  });
  list.querySelectorAll("[data-load-scenario-forms]").forEach((button) => {
    button.addEventListener("click", () => loadTestScenario(button.dataset.loadScenarioForms, "forms"));
  });
}

function scenarioCardHtml(result) {
  const included = result.packetDetails.filter((item) => item.status === "included").map((item) => item.title);
  const checkRows = result.checks.map((check) => `
    <div class="scenario-check ${check.pass ? "pass" : "fail"}">
      <span>${check.pass ? "Pass" : "Fail"}</span>
      <div>
        <strong>${escapeHtml(check.label)}</strong>
        <p>Expected: ${escapeHtml(check.expected)} | Actual: ${escapeHtml(check.actual)}</p>
      </div>
    </div>
  `).join("");
  return `
    <section class="scenario-card ${result.pass ? "" : "failed"}">
      <div class="scenario-card-header">
        <div>
          <p class="eyebrow">${escapeHtml(result.scenario.id)}</p>
          <h3>${escapeHtml(result.scenario.title)}</h3>
          <p>${escapeHtml(result.scenario.detail)}</p>
        </div>
        <span class="badge ${result.pass ? "" : "bad"}">${result.pass ? "Passing" : "Needs review"}</span>
      </div>
      <div class="scenario-grid">
        <div>
          <h4>Actual packet decision</h4>
          <p>${escapeHtml(result.decision.title)}</p>
        </div>
        <div>
          <h4>Included forms</h4>
          <p>${escapeHtml(included.join(", ") || "None")}</p>
        </div>
        <div>
          <h4>Interested persons seen</h4>
          <p>${escapeHtml(result.actualInterestedNames.join(", ") || "None")}</p>
        </div>
      </div>
      <div class="scenario-check-list">${checkRows}</div>
      <div class="scenario-actions">
        <button type="button" class="secondary" data-load-scenario="${escapeAttr(result.scenario.id)}">Load into interview</button>
        <button type="button" class="secondary" data-load-scenario-forms="${escapeAttr(result.scenario.id)}">Load and view forms</button>
      </div>
    </section>
  `;
}

function loadTestScenario(id, mode = "guided") {
  const scenario = testScenarios.find((item) => item.id === id);
  if (!scenario) return;
  state = baseTestScenarioState(scenario.state || {});
  state.ui.mode = mode;
  state.ui.interviewStepId = "role";
  saveState();
  renderAll();
  setViewMode(mode);
  scrollInterviewToTop();
}

const issueTargetRules = [
  [/Gross probate property|Estimated probate property value/i, { step: "triage", selector: '[data-path="estate.estimatedGrossValue"]' }],
  [/County is required|PR-1803 needs the county|PR-1804 needs the county|PR-1805 needs the county|PR-1806 needs the county|PR-1807 needs the county|PR-1808 needs the county|PR-1810 needs the county|PR-1811 needs the county/i, { step: "triage", selector: '[data-path="estate.county"]' }],
  [/Case number|assigned case number/i, { step: "triage", selector: '[data-path="estate.caseNumber"]' }],
  [/Other-proceedings|other proceedings|Pending proceedings/i, { step: "triage", selector: '[data-path="otherProceedings.status"]' }],
  [/Decedent name|decedent name/i, { step: "decedent", selector: '[data-path="decedent.fullName"]' }],
  [/Date of death|date of death/i, { step: "decedent", selector: '[data-path="decedent.dateOfDeath"]' }],
  [/Date of birth|date of birth/i, { step: "decedent", selector: '[data-path="decedent.dateOfBirth"]' }],
  [/Domicile county|domicile county/i, { step: "decedent", selector: '[data-path="decedent.domicileCounty"]' }],
  [/Domicile state|domicile state/i, { step: "decedent", selector: '[data-path="decedent.domicileState"]' }],
  [/Last mailing address|decedent mailing address/i, { step: "decedent", selector: '[data-path="decedent.lastMailingAddress"]' }],
  [/Applicant name/i, { step: "applicant", selector: '[data-path="applicant.fullName"]' }],
  [/Applicant needs a mailing address|Applicant mailing address/i, { step: "applicant", selector: '[data-path="applicant.address"]' }],
  [/Applicant interested-person capacity/i, { step: "applicant", selector: '[data-path="applicant.capacity"]' }],
  [/Proposed personal representative|proposed PR|personal representative name/i, { step: "applicant", selector: '[data-path="pr.fullName"]' }],
  [/personal representative address|proposed PR address/i, { step: "applicant", selector: '[data-path="pr.address"]' }],
  [/Wisconsin residency/i, { step: "applicant", selector: '[data-path="pr.isWisconsinResident"]' }],
  [/resident agent name/i, { step: "applicant", selector: '[data-path="pr.residentAgent.name"]' }],
  [/resident agent address/i, { step: "applicant", selector: '[data-path="pr.residentAgent.address"]' }],
  [/resident agent phone|resident-agent handling/i, { step: "applicant", selector: '[data-path="pr.residentAgent.phone"]' }],
  [/left a will|Will date|will date|will path/i, { step: "will", selector: '[data-path="will.exists"]' }],
  [/codicil/i, { step: "will", selector: '[data-path="will.codicilDates"]' }],
  [/Original will status|original will status/i, { step: "will", selector: '[data-path="will.location"]' }],
  [/diligent-inquiry/i, { step: "will", selector: '[data-path="will.noWillDiligentInquiry"]' }],
  [/benefits section/i, { step: "benefits", selector: '[data-path="benefits.medicalAssistance"]' }],
  [/spouse\/domestic partner yes or no|surviving spouse/i, { step: "heirship", selector: '[data-path="heirship.spouse.exists"]' }],
  [/children yes or no|child name|children list|children are also children|children not of/i, { step: "heirship", selector: '[data-path="heirship.children.exists"]' }],
  [/120-hour|120 hours/i, { step: "heirship", selector: '[data-path="heirship.survivorship120.exists"]' }],
  [/parents should be completed/i, { step: "heirship", selector: '[data-path="heirship.parents.exists"]' }],
  [/person answering heirship|informant/i, { step: "heirship", selector: '[data-path="heirship.informant.name"]' }],
  [/Interested person \d+ needs|Interested person \d+ appears/i, { step: "interested-details", selector: '[data-guided-path^="interestedPersons."]' }],
  [/Interested person|interested person|signer \d+|recipient \d+/i, { step: "interested", selector: '#interestedList [data-person-field="name"]' }],
  [/PR-1803|waiver signers|will copy|bequest notice/i, { step: "opening", selector: '[data-path="opening.waiverStatus"]' }],
  [/PR-1804 needs courthouse county\/name/i, { step: "opening", selector: '[data-path="notice1804.courthouseCounty"]' }],
  [/PR-1804 needs courthouse address/i, { step: "opening", selector: '[data-path="notice1804.courthouseAddress"]' }],
  [/PR-1804|claim deadline|Notice to Creditors/i, { step: "opening", selector: '[data-path="notice1804.claimDeadline"]' }],
  [/PR-1805 needs courthouse county\/name/i, { step: "opening", selector: '[data-path="notice1805.courthouseCounty"]' }],
  [/PR-1805 needs courthouse address/i, { step: "opening", selector: '[data-path="notice1805.courthouseAddress"]' }],
  [/PR-1805|unknown or not reasonably ascertainable|hearing date/i, { step: "opening", selector: '[data-path="notice1805.courthouseCounty"]' }],
  [/opening path|waive notice|selected opening path/i, { step: "opening", selector: '[data-path="opening.waiverStatus"]' }],
  [/PR-1817 needs the declarant name/i, { step: "service", selector: '[data-path="service.declarantName"]' }],
  [/PR-1817 needs the declarant city/i, { step: "service", selector: '[data-path="service.declarantCity"]' }],
  [/PR-1817 needs the declarant state/i, { step: "service", selector: '[data-path="service.declarantState"]' }],
  [/PR-1817 needs the service date/i, { step: "service", selector: '[data-path="service.serviceDate"]' }],
  [/PR-1817 needs the documents provided/i, { step: "service", selector: '[data-path="service.documentsProvided"]' }],
  [/PR-1817 needs original-on-file|copy-attached/i, { step: "service", selector: '[data-path="service.originalOnFile"]' }],
  [/PR-1817 needs the type of service/i, { step: "service", selector: '[data-path="service.method"]' }],
  [/PR-1817/i, { step: "service", selector: '[data-path="service.declarantName"]' }],
  [/PR-1808|bond amount|trustee name|trust name/i, { step: "court", selector: '[data-path="courtDrafts.prBondType"]' }],
  [/PR-1810|domiciliary letters/i, { step: "court", selector: '[data-path="courtDrafts.lettersOtherText"]' }],
  [/PR-1811 needs at least one inventory item/i, { step: "inventory", selector: '#inventoryList [data-inventory-field="description"]' }],
  [/Inventory item \d+ needs a description/i, { step: "inventory", selector: '#inventoryList [data-inventory-field="description"]' }],
  [/Inventory item \d+ needs a date-of-death value/i, { step: "inventory", selector: '#inventoryList [data-inventory-field="value"]' }],
  [/PR-1811|inventory/i, { step: "inventory", selector: '#inventoryList [data-inventory-field="description"]' }],
  [/Preparer/i, { step: "requests", selector: '[data-path="preparer.fullName"]' }]
];

function issueTargetFor(text) {
  const rule = issueTargetRules.find(([pattern]) => pattern.test(text));
  return rule ? rule[1] : null;
}

function jumpToIssueTarget(target) {
  if (!target) return;
  if (visibleInterviewSteps().some((step) => step.id === target.step)) {
    state.ui.mode = "guided";
    state.ui.interviewStepId = target.step;
    saveState();
    renderViewMode();
    renderFields();
    renderInterestedPersons();
    renderInventoryItems();
    renderTaskTracker();
    renderReview();
    renderInterview();
    window.setTimeout(() => focusIssueTarget(target), 0);
    return;
  }
  state.ui.mode = "edit";
  saveState();
  renderViewMode();
  activateEditStep(target.step);
  renderFields();
  renderInterestedPersons();
  renderInventoryItems();
  renderTaskTracker();
  renderReview();
  window.setTimeout(() => focusIssueTarget(target), 0);
}

function focusIssueTarget(target) {
  const panel = document.querySelector(`[data-panel="${target.step}"]`)
    || (state.ui.mode === "guided" && state.ui.interviewStepId === target.step ? document.querySelector(".interview-panel") : null);
  const element = target.selector ? document.querySelector(target.selector) : panel;
  const targetElement = element || panel;
  if (!targetElement) return;
  targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof targetElement.focus === "function") {
    targetElement.focus({ preventScroll: true });
  }
  targetElement.classList.add("jump-highlight");
  window.setTimeout(() => targetElement.classList.remove("jump-highlight"), 1600);
}

function renderReview() {
  const { blockers, warnings } = validate();
  const waiverReview = validate1803();
  const creditorsReview = validate1804();
  const heirshipReview = validate1806();
  const consentReview = validate1807();
  const noticeReview = validate1805();
  const serviceReview = validate1817();
  const statementReview = validate1808();
  const lettersReview = validate1810();
  const inventoryReview = validate1811();
  const openingDecision = openingPathDecision();
  const branchIssues = [];
  if (openingDecision.key === "waiver") {
    branchIssues.push(...waiverReview.blockers.slice(0, 2), ...creditorsReview.blockers.slice(0, 2));
  } else if (openingDecision.key === "notice") {
    branchIssues.push(...noticeReview.blockers.slice(0, 2));
  } else if (openingDecision.key === "blocked_no_will") {
    branchIssues.push(openingDecision.detail);
  }
  const issueList = document.getElementById("issueList");
  const statusBadge = document.getElementById("statusBadge");
  const generateBtn = document.getElementById("generateBtn");
  const generate1803Btn = document.getElementById("generate1803Btn");
  const generate1804Btn = document.getElementById("generate1804Btn");
  const generate1806Btn = document.getElementById("generate1806Btn");
  const generate1807Btn = document.getElementById("generate1807Btn");
  const generate1808Btn = document.getElementById("generate1808Btn");
  const generate1810Btn = document.getElementById("generate1810Btn");
  const generate1811Btn = document.getElementById("generate1811Btn");
  const generate1805Btn = document.getElementById("generate1805Btn");
  const generate1817Btn = document.getElementById("generate1817Btn");
  const exportPacketBtn = document.getElementById("exportPacketBtn");

  issueList.innerHTML = "";
  const issues = [
    ...blockers.map((text) => ({ text, type: "blocker" })),
    ...warnings.map((text) => ({ text, type: "warning" })),
    ...branchIssues.map((text) => ({ text, type: "warning" })),
    ...heirshipReview.blockers.slice(0, 3).map((text) => ({ text, type: "warning" })),
    ...heirshipReview.warnings.slice(0, 2).map((text) => ({ text, type: "warning" })),
    ...consentReview.blockers.slice(0, 3).map((text) => ({ text, type: "warning" })),
    ...consentReview.warnings.slice(0, 2).map((text) => ({ text, type: "warning" })),
    ...serviceReview.blockers.slice(0, 2).map((text) => ({ text, type: "warning" })),
    ...statementReview.blockers.slice(0, 2).map((text) => ({ text, type: "warning" })),
    ...lettersReview.blockers.slice(0, 2).map((text) => ({ text, type: "warning" })),
    ...inventoryReview.blockers.slice(0, 2).map((text) => ({ text, type: "warning" }))
  ];

  if (!issues.length) {
    issueList.innerHTML = `<div class="issues"><div class="issue">No blockers found for this PR-1801 draft.</div></div>`;
    statusBadge.textContent = "Ready";
    statusBadge.className = "badge";
  } else {
    const container = document.createElement("div");
    container.className = "issues";
    issues.forEach((issue) => {
      const target = issueTargetFor(issue.text);
      const item = document.createElement(target ? "button" : "div");
      item.className = `issue ${issue.type === "blocker" ? "blocker" : ""}`;
      item.textContent = issue.text;
      if (target) {
        item.type = "button";
        item.classList.add("issue-link");
        item.title = "Go to this section";
        item.addEventListener("click", () => jumpToIssueTarget(target));
      }
      container.appendChild(item);
    });
    issueList.appendChild(container);
    statusBadge.textContent = blockers.length ? "Needs info" : "Review";
    statusBadge.className = `badge ${blockers.length ? "bad" : "warn"}`;
  }

  generateBtn.disabled = false;
  generate1803Btn.disabled = false;
  generate1804Btn.disabled = false;
  generate1806Btn.disabled = false;
  generate1807Btn.disabled = false;
  generate1808Btn.disabled = false;
  generate1810Btn.disabled = false;
  generate1811Btn.disabled = false;
  generate1805Btn.disabled = false;
  generate1817Btn.disabled = false;
  const openingReady = openingDocumentReadiness().ready;
  exportPacketBtn.disabled = !openingReady;
  exportPacketBtn.textContent = openingReady ? "Export opening packet ZIP" : "Opening packet needs review";
  renderOpeningPath();
  renderChecklist();
  renderTaskTracker();
  renderInventoryTotals();
  renderInterestedSuggestions();
  renderSummary();
  renderCountyDefaultsSourceNote();
  if (state.ui.mode === "forms") renderFormsView();
}

function renderCountyDefaultsSourceNote() {
  const note = document.getElementById("countyDefaultsSourceNote");
  const button = document.getElementById("loadCountyLibraryBtn");
  if (!note && !button) return;
  const libraryDefault = countyLibraryDefault(state.estate.county);
  if (button) button.disabled = !libraryDefault;
  if (!note) return;
  if (!libraryDefault) {
    note.textContent = "No county library match for the current county name.";
    return;
  }
  const newspaperSource = libraryDefault.sources?.find((source) => source.fields?.includes("newspaperName"));
  const newspaperText = libraryDefault.newspaperName
    ? ` Publication newspaper defaults to ${libraryDefault.newspaperName}${newspaperSource ? ` from ${newspaperSource.label}` : ""}; confirm with the probate registrar before filing.`
    : " Publication newspaper is not source-verified in the library yet; confirm with the probate registrar.";
  note.textContent = `Library county defaults last verified ${state.countyDefaults.lastVerified || libraryDefault.lastVerified}.${newspaperText}`;
}

function renderSummary() {
  const summary = document.getElementById("summary");
  const rows = [
    ["County", state.estate.county || "Not set"],
    ["Decedent", state.decedent.fullName || "Not set"],
    ["DOD", state.decedent.dateOfDeath || "Not set"],
    ["Applicant", state.applicant.fullName || "Not set"],
    ["PR", state.pr.fullName || "Not set"],
    ["Will path", state.will.exists || "Not set"],
    ["Interested", String(state.interestedPersons.length)]
  ];
  summary.innerHTML = rows.map(([label, value]) => `
    <div class="summary-row">
      <span>${label}</span>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function formPreviewDefinitions() {
  const decision = openingPathDecision();
  const route = probatePathDecision();
  const packetDetails = new Map(openingPacketFormDetails().map((item) => [item.key, item]));
  const packetDetail = (key) => packetDetails.get(key) || {};
  const packetIncluded = (key) => packetDetail(key).status === "included";
  return [
    {
      key: "transfer-affidavit",
      title: "Small estate",
      name: "Transfer by Affidavit package",
      included: route.key === "transfer_affidavit",
      packetStatus: route.key === "transfer_affidavit" ? "included" : "not-in-path",
      reason: route.key === "transfer_affidavit"
        ? "The free path router says the estate may qualify for a lower-cost Transfer by Affidavit package."
        : "Not recommended by the current Wisconsin Probate Check; use the informal probate package or information summary instead.",
      review: validateTransferAffidavit(),
      generate: exportTransferAffidavitPackage,
      fields: [
        ["Gross affidavit value", `$${currencyText(transferAffidavitGrossValue())}`],
        ["Affiant", transferAffidavitAffiantName()],
        ["Assets/holders", String((state.transferAffidavit.assets || []).filter(transferAssetHasContent).length)],
        ["Official template", "PR-1831 template still needed"]
      ]
    },
    {
      key: "pr1801",
      title: "PR-1801",
      name: "Application for Informal Administration",
      included: packetIncluded("pr1801"),
      packetStatus: packetDetail("pr1801").status,
      reason: packetDetail("pr1801").reason,
      review: validate(),
      generate: generatePr1801,
      fields: [
        ["County", state.estate.county],
        ["Decedent", state.decedent.fullName],
        ["Applicant", state.applicant.fullName],
        ["PR", state.pr.fullName],
        ["Will path", willSummaryText()]
      ]
    },
    {
      key: "pr1806",
      title: "PR-1806",
      name: "Proof of Heirship",
      included: packetIncluded("pr1806"),
      packetStatus: packetDetail("pr1806").status,
      reason: packetDetail("pr1806").reason,
      review: validate1806(),
      generate: generatePr1806,
      fields: [
        ["Informant", state.heirship.informant.name],
        ["Spouse", state.heirship.spouse.exists === "yes" ? state.heirship.spouse.name : state.heirship.spouse.exists],
        ["Children", state.heirship.children.exists === "yes" ? state.heirship.children.list : state.heirship.children.exists]
      ]
    },
    {
      key: "pr1807",
      title: "PR-1807",
      name: "Consent to Serve",
      included: packetIncluded("pr1807"),
      packetStatus: packetDetail("pr1807").status,
      reason: packetDetail("pr1807").reason,
      review: validate1807(),
      generate: generatePr1807,
      fields: [
        ["Proposed PR", state.pr.fullName],
        ["Wisconsin resident", state.pr.isWisconsinResident],
        ["Resident agent", state.pr.isWisconsinResident === "no" ? state.pr.residentAgent.name : "Not needed"]
      ]
    },
    {
      key: "pr1803",
      title: "PR-1803",
      name: "Waiver and Consent",
      included: packetIncluded("pr1803"),
      packetStatus: packetDetail("pr1803").status,
      reason: packetDetail("pr1803").reason,
      review: validate1803(),
      generate: generatePr1803,
      fields: [
        ["Opening path", decision.title],
        ["Waiver packet", waiverSignatureModeLabel()],
        ["Interested persons", String(state.interestedPersons.filter(hasInterestedPersonContent).length)],
        ["Will copy/bequest notice", state.waiver.receivedWillCopy ? "Will copy" : state.waiver.receivedBequestNotice ? "Bequest notice" : "Not set"]
      ]
    },
    {
      key: "pr1804",
      title: "PR-1804",
      name: "Notice to Creditors",
      included: packetIncluded("pr1804"),
      packetStatus: packetDetail("pr1804").status,
      reason: packetDetail("pr1804").reason,
      review: validate1804(),
      generate: generatePr1804,
      fields: [
        ["Courthouse", state.notice1804.courthouseAddress],
        ["Newspaper", state.notice1804.newspaperName],
        ["Claim deadline", state.notice1804.claimDeadline]
      ]
    },
    {
      key: "pr1805",
      title: "PR-1805",
      name: "Notice Setting Time to Hear Application",
      included: packetIncluded("pr1805"),
      packetStatus: packetDetail("pr1805").status,
      reason: packetDetail("pr1805").reason,
      review: validate1805(),
      generate: generatePr1805,
      fields: [
        ["Courthouse", state.notice1805.courthouseAddress],
        ["Registrar", state.notice1805.registrarName],
        ["Unknown persons", state.notice1805.unknownInterestedPersons],
        ["Newspaper", state.notice1805.newspaperName]
      ]
    },
    {
      key: "pr1817",
      title: "PR-1817",
      name: "Declaration of Service",
      included: packetIncluded("pr1817"),
      packetStatus: packetDetail("pr1817").status,
      reason: packetDetail("pr1817").reason,
      review: validate1817(),
      generate: generatePr1817,
      fields: [
        ["Declarant", state.service.declarantName],
        ["Service date", state.service.serviceDate],
        ["Method", state.service.method],
        ["Recipients", String(state.interestedPersons.filter(hasInterestedPersonContent).length)]
      ]
    },
    {
      key: "pr1808",
      title: "PR-1808",
      name: "Statement of Informal Administration",
      included: packetIncluded("pr1808"),
      packetStatus: packetDetail("pr1808").status,
      reason: packetDetail("pr1808").reason,
      review: validate1808(),
      generate: generatePr1808,
      fields: [
        ["Opening path", decision.title],
        ["PR", state.pr.fullName],
        ["Bond", state.courtDrafts.prBondType]
      ]
    },
    {
      key: "pr1810",
      title: "PR-1810",
      name: "Domiciliary Letters",
      included: packetIncluded("pr1810"),
      packetStatus: packetDetail("pr1810").status,
      reason: packetDetail("pr1810").reason,
      review: validate1810(),
      generate: generatePr1810,
      fields: [
        ["PR", state.pr.fullName],
        ["Address", state.pr.address],
        ["Case number", state.estate.caseNumber]
      ]
    },
    {
      key: "pr1811",
      title: "PR-1811",
      name: "Inventory",
      included: packetIncluded("pr1811"),
      packetStatus: packetDetail("pr1811").status,
      reason: packetDetail("pr1811").reason,
      review: validate1811(),
      generate: generatePr1811,
      fields: [
        ["Items", String(state.inventory.items.filter(inventoryItemHasContent).length)],
        ["Gross value", `$${currencyText(inventoryTotals().value)}`],
        ["Net value", `$${currencyText(inventoryTotals().net)}`]
      ]
    }
  ];
}

function formFormatConfig(key) {
  return FORM_FORMAT_CONFIG[key] || {
    formNumber: String(key || "form").toUpperCase(),
    signatureWorkflow: "Confirm signature handling before filing.",
    publicPackage: "Print-ready filing copy after final review.",
    attorneyEfileDefault: "Confirm eFiling format.",
    wordCopy: "Editable working copy.",
    pdfCopy: "PDF filing copy after exact output is available.",
    efileDefault: "confirm",
    pdfStatus: "review_needed"
  };
}

function efileDefaultLabel(value = "") {
  const labels = {
    signed_pdf: "Signed PDF",
    pdf: "PDF",
    word_docx: "Word/DOCX",
    pdf_or_county_word: "PDF or county Word request",
    confirm: "Confirm"
  };
  return labels[value] || "Confirm";
}

function activePacketForms(data = state) {
  return withTemporaryState(data, () => formPreviewDefinitions().filter((form) => form.included));
}

function signedPdfFormLabels(forms = activePacketForms()) {
  return forms
    .filter((form) => ["signed_pdf", "pdf"].includes(formFormatConfig(form.key).efileDefault))
    .map((form) => `${formFormatConfig(form.key).formNumber} ${form.name}`);
}

function wordEfileFormLabels(forms = activePacketForms()) {
  return forms
    .filter((form) => formFormatConfig(form.key).efileDefault === "word_docx")
    .map((form) => `${formFormatConfig(form.key).formNumber} ${form.name}`);
}

function formProductionTarget(key) {
  const targets = {
    "transfer-affidavit": "Exact PR-1831 PDF/print package plus editable worksheet",
    pr1801: "Exact statewide form PDF overlay for signed filing plus editable Word working copy",
    pr1803: "Exact statewide PDF/print waiver set plus editable Word logistics copy",
    pr1804: "Exact statewide PDF for filing/publication plus editable Word working copy",
    pr1805: "Exact statewide PDF notice path plus editable Word working copy if county practice requires",
    pr1806: "Signed exact PDF after wet signature plus editable Word working copy",
    pr1807: "Signed exact PDF after wet signature plus editable Word working copy",
    pr1808: "Editable Word court draft plus PDF preview/copy",
    pr1810: "Editable Word court draft plus PDF preview/copy",
    pr1811: "Signed exact PDF after appointment plus editable Word working copy",
    pr1817: "Signed exact PDF after service plus editable Word working copy"
  };
  return targets[key] || "Confirm official form format";
}

function officialFormIntegrityRule(key) {
  const rules = {
    "transfer-affidavit": {
      standardForm: "PR-1831",
      officialOutput: "Exact official PR-1831 PDF/print form before production use",
      betaOutput: "MVP worksheet/DOCX draft only",
      integrityStatus: "official-template-needed",
      attorneyFormat: "PDF/print after exact official template mapping",
      publicFormat: "Print/sign/deliver official form packet",
      note: "Do not treat the current worksheet as the court form."
    },
    pr1801: {
      standardForm: "PR-1801",
      officialOutput: "Exact official PDF overlay or court-approved replica",
      betaOutput: "DOCX draft plus overlay value map",
      integrityStatus: "overlay-map-started",
      attorneyFormat: "Signed PDF eFiling copy after wet signature, exact overlay, and legal review",
      publicFormat: "Print/sign official form packet; editable Word working copy can be offered for corrections",
      note: "Current map identifies values; official PDF template coordinates are still needed."
    },
    pr1803: {
      standardForm: "PR-1803",
      officialOutput: "Exact official PDF/print waiver, shared or individual as selected",
      betaOutput: "DOCX waiver draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "Signed PDF after signatures",
      publicFormat: "Print for signatures",
      note: "Separate logistics are allowed; the form text/layout must stay official."
    },
    pr1804: {
      standardForm: "PR-1804",
      officialOutput: "Exact official PDF for filing/publication",
      betaOutput: "DOCX notice draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "PDF for eFile/publication workflow",
      publicFormat: "Print/file/publish as county requires",
      note: "Court/county-provided claim deadline and official publication details must not be guessed."
    },
    pr1805: {
      standardForm: "PR-1805",
      officialOutput: "Exact official PDF notice path form",
      betaOutput: "DOCX notice draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "PDF unless county requests editable notice",
      publicFormat: "Print/file/serve/publish as county requires",
      note: "Used when the matter cannot open entirely on waivers."
    },
    pr1806: {
      standardForm: "PR-1806",
      officialOutput: "Exact official PDF after signature",
      betaOutput: "DOCX proof draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "Signed PDF",
      publicFormat: "Print/sign/file",
      note: "The heirship logic may be complex; form output must remain the court form."
    },
    pr1807: {
      standardForm: "PR-1807",
      officialOutput: "Exact official PDF after signature",
      betaOutput: "DOCX consent draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "Signed PDF",
      publicFormat: "Print/sign/file",
      note: "Resident-agent fields must follow official form placement."
    },
    pr1808: {
      standardForm: "PR-1808",
      officialOutput: "Official court draft in Word/editable format plus optional PDF preview",
      betaOutput: "DOCX court draft",
      integrityStatus: "editable-court-draft",
      attorneyFormat: "Word/DOCX court-editable draft when required for eFiling or court issuance",
      publicFormat: "Submit as part of opening packet if local practice accepts; court signs/issues it",
      note: "This is prepared for the Probate Registrar/court; do not alter official court language."
    },
    pr1810: {
      standardForm: "PR-1810",
      officialOutput: "Official court draft in Word/editable format plus optional PDF preview",
      betaOutput: "DOCX court draft",
      integrityStatus: "editable-court-draft",
      attorneyFormat: "Word/DOCX court-editable draft when required for eFiling or court issuance",
      publicFormat: "Submit for court issuance if local practice accepts; court signs/issues it",
      note: "Attorneys often need this as Word/editable because the court may issue or edit the letters."
    },
    pr1811: {
      standardForm: "PR-1811",
      officialOutput: "Exact official PDF after appointment",
      betaOutput: "DOCX inventory draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "Signed PDF",
      publicFormat: "Print/sign/file after appointment",
      note: "Inventory is a later administration form, not part of the core opening download unless requested."
    },
    pr1817: {
      standardForm: "PR-1817",
      officialOutput: "Exact official PDF after service",
      betaOutput: "DOCX declaration draft",
      integrityStatus: "overlay-needed",
      attorneyFormat: "Signed PDF",
      publicFormat: "Print/sign/file after service",
      note: "The served-document list changes by stage; do not embed app instructions inside the court form."
    }
  };
  return rules[key] || {
    standardForm: key.toUpperCase(),
    officialOutput: "Confirm exact official form output",
    betaOutput: "DOCX draft",
    integrityStatus: "review-needed",
    attorneyFormat: "Confirm eFiling format",
    publicFormat: "Print-ready official form",
    note: "Confirm official format requirements before production use."
  };
}

function officialTemplateVaultStatusLabel(status = "") {
  const labels = {
    official_docx_registered_pdf_overlay_started: "Official DOCX registered; PDF overlay started",
    official_docx_registered_pdf_overlay_needed: "Official DOCX registered; PDF overlay needed",
    official_docx_registered_word_court_draft: "Official DOCX registered; Word court draft",
    official_docx_registered_later_stage: "Official DOCX registered; later-stage form",
    official_pdf_registered_overlay_needed: "Official PDF registered; overlay needed"
  };
  return labels[status] || "Template review needed";
}

function officialTemplateVaultRows(forms = formPreviewDefinitions()) {
  const activeKeys = new Set(forms.filter((form) => form.included).map((form) => form.key));
  return Object.entries(OFFICIAL_FORM_TEMPLATE_VAULT).map(([key, template]) => ({
    key,
    active: activeKeys.has(key),
    template
  }));
}

function officialTemplateVaultManifestText(data = state) {
  return withTemporaryState(data, () => {
    const rows = officialTemplateVaultRows(formPreviewDefinitions()).map(({ key, active, template }) => [
      `${template.formNumber} ${template.title}`,
      `App key: ${key}`,
      `Active in current packet: ${active ? "yes" : "no"}`,
      `Local template: ${template.localTemplate || "(not registered)"}`,
      `Official PDF/template: ${template.officialPdf || "(not registered yet)"}`,
      `Source: ${template.source || "(not set)"}`,
      `Output status: ${officialTemplateVaultStatusLabel(template.outputStatus)}`,
      `Integrity rule: ${STANDARD_FORM_INTEGRITY_POLICY.rule}`
    ].join("\n")).join("\n\n");
    return [
      "Official Template Vault Manifest",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      `Policy version: ${STANDARD_FORM_INTEGRITY_POLICY.version}`,
      "",
      "Purpose",
      "This manifest tracks the official Wisconsin court forms used by the app. Before production launch, each active filing copy should be confirmed against the current Wisconsin Court System form and either filled in the official DOCX/PDF or through an exact approved overlay/replica.",
      "",
      rows
    ].join("\n");
  });
}

function officialFormIntegrityStatusLabel(status = "") {
  const labels = {
    "official-template-needed": "Official template needed",
    "overlay-map-started": "Overlay map started",
    "overlay-needed": "Exact overlay needed",
    "editable-court-draft": "Editable court draft",
    "review-needed": "Review needed"
  };
  return labels[status] || "Review needed";
}

function officialFormIntegrityStatusTone(status = "") {
  if (status === "official-template-needed") return "bad";
  if (status === "editable-court-draft") return "warn";
  if (status === "overlay-map-started" || status === "overlay-needed" || status === "review-needed") return "warn";
  return "";
}

function officialFormIntegritySummary(forms = formPreviewDefinitions()) {
  const activeForms = forms.filter((form) => form.included);
  const rows = activeForms.map((form) => ({ form, rule: officialFormIntegrityRule(form.key) }));
  return {
    activeCount: activeForms.length,
    exactOutputNeeded: rows.filter(({ rule }) => ["official-template-needed", "overlay-map-started", "overlay-needed"].includes(rule.integrityStatus)).length,
    editableCourtDrafts: rows.filter(({ rule }) => rule.integrityStatus === "editable-court-draft").length,
    standardFormRows: rows
  };
}

function officialFormIntegrityPanelHtml(forms = formPreviewDefinitions()) {
  const summary = officialFormIntegritySummary(forms);
  const stats = [
    [String(summary.activeCount), "active standard forms", ""],
    [String(summary.exactOutputNeeded), "exact outputs needed", summary.exactOutputNeeded ? "warn" : ""],
    [String(summary.editableCourtDrafts), "editable court drafts", summary.editableCourtDrafts ? "warn" : ""]
  ];
  return `
    <div class="official-integrity-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Official court form integrity</p>
          <h3>Do not alter the Wisconsin PR forms.</h3>
          <p>${escapeHtml(STANDARD_FORM_INTEGRITY_POLICY.rule)}</p>
        </div>
        <span class="badge warn">Standard forms</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        ${stats.map(([value, label, tone]) => `
          <div class="readiness-stat ${escapeAttr(tone)}">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
      <div class="integrity-rule-grid">
        <div>
          <strong>Allowed</strong>
          <ul>${STANDARD_FORM_INTEGRITY_POLICY.allowed.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Prohibited</strong>
          <ul>${STANDARD_FORM_INTEGRITY_POLICY.prohibited.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="official-integrity-list">
        ${summary.standardFormRows.map(({ form, rule }) => {
          const tone = officialFormIntegrityStatusTone(rule.integrityStatus);
          return `
            <div class="official-integrity-row ${escapeAttr(tone)}">
              <strong>${escapeHtml(rule.standardForm)}</strong>
              <span>${escapeHtml(officialFormIntegrityStatusLabel(rule.integrityStatus))}</span>
              <p>${escapeHtml(rule.officialOutput)}</p>
              <p>${escapeHtml(rule.note)}</p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function officialFormIntegrityManifestText(data = state) {
  return withTemporaryState(data, () => {
    const summary = officialFormIntegritySummary(formPreviewDefinitions());
    const rows = summary.standardFormRows.map(({ form, rule }) => [
      `${rule.standardForm} ${form.name}`,
      `Integrity status: ${officialFormIntegrityStatusLabel(rule.integrityStatus)}`,
      `Beta output: ${rule.betaOutput}`,
      `Production output: ${rule.officialOutput}`,
      `Public format: ${rule.publicFormat}`,
      `Attorney format: ${rule.attorneyFormat}`,
      `Rule: ${rule.note}`
    ].join("\n")).join("\n\n");
    return [
      "Official Court Form Integrity Manifest",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      `Policy version: ${STANDARD_FORM_INTEGRITY_POLICY.version}`,
      "",
      "Non-alteration rule",
      STANDARD_FORM_INTEGRITY_POLICY.rule,
      "",
      "Allowed",
      STANDARD_FORM_INTEGRITY_POLICY.allowed.map((item) => `- ${item}`).join("\n"),
      "",
      "Prohibited",
      STANDARD_FORM_INTEGRITY_POLICY.prohibited.map((item) => `- ${item}`).join("\n"),
      "",
      "Active form output rules",
      rows
    ].join("\n");
  });
}

function outputReadinessStatus(form) {
  if (!form.included) return { key: "not-in-path", label: "Not in packet", tone: "muted" };
  if (["pr1808", "pr1810"].includes(form.key)) return { key: "editable-court-draft", label: "Word court draft", tone: "warn" };
  if (form.key === "pr1801") return { key: "overlay-map-ready", label: "Overlay map started", tone: "warn" };
  if (form.key === "transfer-affidavit") return { key: "template-needed", label: "Official template needed", tone: "bad" };
  return { key: "overlay-needed", label: "Exact PDF overlay needed", tone: "warn" };
}

function outputReadinessSummary(forms = formPreviewDefinitions()) {
  const activeForms = forms.filter((form) => form.included);
  const statuses = activeForms.map((form) => ({ form, status: outputReadinessStatus(form) }));
  return {
    activeCount: activeForms.length,
    overlayNeeded: statuses.filter((item) => ["overlay-needed", "overlay-map-ready"].includes(item.status.key)).length,
    overlayPilots: statuses.filter((item) => item.status.key === "overlay-map-ready").length,
    editableDrafts: statuses.filter((item) => item.status.key === "editable-court-draft").length,
    templateNeeded: statuses.filter((item) => item.status.key === "template-needed").length,
    statuses
  };
}

function outputReadinessPanelHtml(forms = formPreviewDefinitions()) {
  const summary = outputReadinessSummary(forms);
  const stats = [
    [String(summary.activeCount), "active forms", ""],
    [String(summary.overlayNeeded), "PDF overlays needed", summary.overlayNeeded ? "warn" : ""],
    [String(summary.overlayPilots), "overlay pilot", summary.overlayPilots ? "warn" : ""],
    [String(summary.editableDrafts), "Word court drafts", summary.editableDrafts ? "warn" : ""],
    [String(summary.templateNeeded), "official templates needed", summary.templateNeeded ? "bad" : ""]
  ];
  return `
    <div class="output-readiness-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Court-reliable output</p>
          <h3>Official-form readiness</h3>
          <p>Current downloads are beta Word drafts. Production needs signable Word working copies and exact statewide-form PDF filing copies where appropriate.</p>
          <p class="helper-text">Wet signatures remain part of the workflow. Attorney eFiling should use signed/scanned PDFs for signed documents and Word/DOCX for court-editable drafts when required.</p>
        </div>
        <span class="badge warn">Beta output</span>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        ${stats.map(([value, label, tone]) => `
          <div class="readiness-stat ${tone}">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
      <div class="output-target-list">
        ${summary.statuses.map(({ form, status }) => `
          <div class="output-target-row ${escapeAttr(status.tone)}">
            <strong>${escapeHtml(form.title)}</strong>
            <span>${escapeHtml(status.label)}</span>
            <p>${escapeHtml(formProductionTarget(form.key))}</p>
          </div>
        `).join("")}
      </div>
      ${summary.statuses.some(({ form }) => form.key === "pr1801" && form.included) ? pr1801OverlayPilotHtml() : ""}
    </div>
  `;
}

function formOutputRule(key) {
  const rules = {
    "transfer-affidavit": {
      current: "DOCX draft + official PDFs",
      attorney: "PDF review before e-file or delivery",
      public: "Print packet and sign before use",
      note: "Transfer by Affidavit output should become an exact official-form PDF package."
    },
    pr1801: {
      current: "DOCX draft",
      attorney: "PDF target for e-file after review",
      public: "Print/sign packet",
      note: "Move to official PDF overlay or exact replica before production."
    },
    pr1803: {
      current: "DOCX draft or waiver ZIP",
      attorney: "Signed PDF target after signatures",
      public: "Print for signatures",
      note: "Waivers may be one shared document or individual signature documents."
    },
    pr1804: {
      current: "DOCX draft",
      attorney: "PDF target for publication/e-file",
      public: "Print/file/publish as court requires",
      note: "Publication newspaper and claim deadline must be county-verified."
    },
    pr1805: {
      current: "DOCX draft",
      attorney: "PDF target unless court requests editable notice",
      public: "Print/file/serve/publish as court requires",
      note: "Use when the case cannot open entirely on waivers."
    },
    pr1806: {
      current: "DOCX draft",
      attorney: "PDF target for e-file after signature",
      public: "Print/sign packet",
      note: "Proof of Heirship should be signed and converted/flattened for electronic filing."
    },
    pr1807: {
      current: "DOCX draft",
      attorney: "PDF target for e-file after signature",
      public: "Print/sign packet",
      note: "Nonresident PR resident-agent handling must be complete before final filing."
    },
    pr1808: {
      current: "DOCX court draft",
      attorney: "Word/editable court draft review",
      public: "Usually prepared for court review/signature",
      note: "Court-official signature/editing makes this a Word/editable-format candidate before production rules are finalized."
    },
    pr1810: {
      current: "DOCX court draft",
      attorney: "Word/editable court draft review",
      public: "Court-issued letters after appointment",
      note: "Flagged from project note and eFiling rules: because court editing/signature may be needed, PR-1810 should stay Word/editable for attorney e-file review."
    },
    pr1811: {
      current: "DOCX draft",
      attorney: "PDF target for e-file after signature",
      public: "Print/sign/file after appointment",
      note: "Inventory is usually post-appointment, not the core opening packet."
    },
    pr1817: {
      current: "DOCX draft",
      attorney: "PDF target for e-file after signature",
      public: "Print/sign/file after service",
      note: "Service details determine when this should be filed."
    }
  };
  return rules[key] || {
    current: "DOCX draft",
    attorney: "Confirm e-file format",
    public: "Print-ready packet",
    note: "Final production should confirm official format requirements."
  };
}

function formDualOutputRule(key) {
  const config = formFormatConfig(key);
  return {
    pdf: config.pdfCopy,
    word: config.wordCopy,
    user: `${config.publicPackage} ${config.signatureWorkflow}`,
    efile: config.attorneyEfileDefault,
    efileDefault: config.efileDefault
  };
}

function outputManifestText(data = state) {
  return withTemporaryState(data, () => {
    const forms = formPreviewDefinitions().filter((form) => form.included);
    const summary = outputReadinessSummary(forms);
    const rows = forms.map((form) => {
      const rule = formOutputRule(form.key);
      const dual = formDualOutputRule(form.key);
      const format = formFormatConfig(form.key);
      const status = outputReadinessStatus(form);
      return [
        `${form.title} ${form.name}`,
        `Current: ${rule.current}`,
        `Public target: ${rule.public}`,
        `Attorney target: ${rule.attorney}`,
        `Wet signature workflow: ${format.signatureWorkflow}`,
        `Attorney eFiling default: ${efileDefaultLabel(format.efileDefault)} - ${format.attorneyEfileDefault}`,
        `PDF access: ${dual.pdf}`,
        `Word access: ${dual.word}`,
        `User package: ${dual.user}`,
        `Production target: ${formProductionTarget(form.key)}`,
        `Readiness: ${status.label}`,
        `Note: ${rule.note}`
      ].join("\n");
    }).join("\n\n");
    return [
      "Output Format Manifest",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      `Audience: ${data.payment?.exportAudience === "attorney" ? "Attorney e-file review" : "Public print review"}`,
      "",
      "Production rule",
      "Wisconsin statewide forms must keep the required layout/margins. Users should get signable Word working copies and, once exact overlays/templates are available, official PDF filing copies. Attorney eFiling packages should account for wet signatures: signed documents generally become signed/scanned PDFs, while court-editable drafts may need Word/DOCX.",
      STANDARD_FORM_INTEGRITY_POLICY.rule,
      "Product rule: users should be able to access both an editable Word working copy and a PDF/exact official filing copy when available. Per-form eFiling defaults must remain configurable until Wisconsin form-by-form requirements are confirmed.",
      "",
      "Readiness summary",
      `Active forms: ${summary.activeCount}`,
      `PDF overlays needed: ${summary.overlayNeeded}`,
      `Overlay pilots started: ${summary.overlayPilots}`,
      `Editable Word court drafts: ${summary.editableDrafts}`,
      `Official templates needed: ${summary.templateNeeded}`,
      "",
      rows
    ].join("\n");
  });
}

function efilingFormatConfigText(data = state) {
  return withTemporaryState(data, () => {
    const forms = activePacketForms(data);
    const rows = forms.map((form) => {
      const format = formFormatConfig(form.key);
      return [
        `${format.formNumber} ${form.name}`,
        `Attorney eFiling default: ${efileDefaultLabel(format.efileDefault)}`,
        `Attorney handling: ${format.attorneyEfileDefault}`,
        `Wet signature workflow: ${format.signatureWorkflow}`,
        `Word copy: ${format.wordCopy}`,
        `PDF copy: ${format.pdfCopy}`,
        `PDF status: ${format.pdfStatus}`
      ].join("\n");
    });
    return [
      "Per-Form Word/PDF Filing Configuration",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Working rule",
      "Documents that need a person's signature should be wet-signed before paper filing or scanned/flattened for attorney eFiling. Court-editable drafts may need Word/DOCX. This configuration is intentionally editable until the final Wisconsin form-by-form eFiling list is confirmed.",
      "",
      rows.join("\n\n") || "(No active forms.)"
    ].join("\n");
  });
}

function signingPackageReadmeText(data = state) {
  return withTemporaryState(data, () => {
    const forms = activePacketForms(data);
    const signatureRows = forms.map((form) => {
      const format = formFormatConfig(form.key);
      return `- ${format.formNumber} ${form.name}: ${format.signatureWorkflow}`;
    });
    return [
      "Opening Documents - Print, Sign, and File",
      `Estate: ${cleanText(data.decedent?.fullName) || "(not set)"}`,
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Purpose",
      "This folder contains the opening documents generally prepared before domiciliary letters issue. Public users will usually print these documents, collect wet signatures, and take or mail the packet to the Register in Probate/probate office. Production should also provide exact official PDF filing copies when the official PDF overlays/templates are complete.",
      "",
      "Signature workflow",
      signatureRows.join("\n") || "- No active forms.",
      "",
      "Practical filing note",
      "PR-1808 and PR-1810 are included as court/registrar drafts in the opening packet. The court may complete, sign, issue, or return them according to local practice. Later forms such as PR-1811 Inventory should usually be handled after domiciliary letters issue."
    ].join("\n");
  });
}

function attorneyEfilePackageReadmeText(data = state) {
  return withTemporaryState(data, () => {
    const forms = activePacketForms(data);
    const signedPdf = signedPdfFormLabels(forms);
    const wordDrafts = wordEfileFormLabels(forms);
    return [
      "Attorney eFiling Format Notes",
      `Estate: ${cleanText(data.decedent?.fullName) || "(not set)"}`,
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Use this folder after review and wet signatures.",
      "",
      "Signed/scanned PDF lane",
      signedPdf.length ? signedPdf.map((label) => `- ${label}`).join("\n") : "- None in the active packet.",
      "",
      "Word/DOCX court-editable lane",
      wordDrafts.length ? wordDrafts.map((label) => `- ${label}`).join("\n") : "- None in the active packet.",
      "",
      "Current prototype limitation",
      "The app does not yet convert wet-signed forms into signed PDFs. Production should create exact official PDFs for filing copies and keep Word/DOCX only where the court or eFiling workflow requires editable drafts."
    ].join("\n");
  });
}

function signatureRequirementId(formKey, signer, role = "") {
  return `${formKey}:${cleanText(signer).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "signer"}:${cleanText(role).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "role"}`;
}

function signatureRequirementRows(data = state) {
  return withTemporaryState(data, () => {
    const activeKeys = new Set(activePacketForms(data).map((form) => form.key));
    const rows = [];
    const add = (formKey, formNumber, formName, signer, role, detail, options = {}) => {
      rows.push({
        id: options.id || signatureRequirementId(formKey, signer, role),
        formKey,
        formNumber,
        formName,
        signer: cleanText(signer) || "(name needed)",
        role,
        detail,
        required: options.required !== false,
        partySignature: options.partySignature !== false,
        defaultStatus: options.defaultStatus || (options.required === false ? "not_required" : "not_sent")
      });
    };
    if (activeKeys.has("pr1801")) {
      add("pr1801", "PR-1801", "Application for Informal Administration", data.applicant?.fullName, "Applicant", "Wet-sign before paper filing or scan/flatten for attorney eFiling.");
    }
    if (activeKeys.has("pr1803")) {
      const signers = (data.interestedPersons || []).filter(hasInterestedPersonContent);
      if (data.waiver?.signatureMode === "individual") {
        signers.forEach((person, index) => add("pr1803", "PR-1803", "Waiver and Consent", person.name, "Interested person waiver signer", "Individual waiver should be wet-signed and returned.", { id: signatureRequirementId("pr1803", person.name || `signer-${index + 1}`, "individual-waiver") }));
      } else {
        add("pr1803", "PR-1803", "Waiver and Consent", signers.map((person) => cleanText(person.name)).filter(Boolean).join("; ") || "All waiver signers", "Shared waiver signers", "All available waiver signers wet-sign the shared waiver.", { id: "pr1803:shared-waiver:all-signers" });
      }
    }
    if (activeKeys.has("pr1806")) {
      add("pr1806", "PR-1806", "Proof of Heirship", data.heirship?.informant?.name || data.applicant?.fullName, "Heirship declarant", "Declarant wet-signs proof of heirship before filing.");
    }
    if (activeKeys.has("pr1807")) {
      add("pr1807", "PR-1807", "Consent to Serve", data.pr?.fullName, "Proposed personal representative", "Proposed PR wet-signs consent to serve.");
      if (data.pr?.isWisconsinResident === "no") {
        add("pr1807", "PR-1807", "Consent to Serve", data.pr?.residentAgent?.name, "Resident agent", "Resident agent wet-signs if a nonresident PR is proposed.");
      }
    }
    if (activeKeys.has("pr1817")) {
      add("pr1817", "PR-1817", "Declaration of Service", data.service?.declarantName, "Service declarant", "Declarant wet-signs after service is complete.");
    }
    if (activeKeys.has("pr1811")) {
      add("pr1811", "PR-1811", "Inventory", data.pr?.fullName, "Personal representative", "PR signs inventory after appointment.");
    }
    if (activeKeys.has("pr1808")) {
      add("pr1808", "PR-1808", "Statement of Informal Administration", "Probate Registrar/Court", "Court signature", "Prepared as court-editable draft; court signs/issues if application is approved.", { required: false, partySignature: false, defaultStatus: "not_required" });
    }
    if (activeKeys.has("pr1810")) {
      add("pr1810", "PR-1810", "Domiciliary Letters", "Probate Registrar/Court", "Court issuance", "Prepared as court-editable draft; court signs/issues letters after appointment.", { required: false, partySignature: false, defaultStatus: "not_required" });
    }
    return rows;
  });
}

function signatureRowStatus(row, data = state) {
  return {
    status: data.signatureStatus?.[row.id]?.status || row.defaultStatus,
    signedDate: data.signatureStatus?.[row.id]?.signedDate || "",
    returnedDate: data.signatureStatus?.[row.id]?.returnedDate || "",
    scanned: Boolean(data.signatureStatus?.[row.id]?.scanned),
    efileReady: Boolean(data.signatureStatus?.[row.id]?.efileReady)
  };
}

function signatureTrackingSummary(data = state) {
  const rows = signatureRequirementRows(data);
  const required = rows.filter((row) => row.required);
  return {
    total: rows.length,
    required: required.length,
    signed: required.filter((row) => ["signed", "scanned", "efile_ready"].includes(signatureRowStatus(row, data).status)).length,
    efileReady: required.filter((row) => signatureRowStatus(row, data).status === "efile_ready" || signatureRowStatus(row, data).efileReady).length,
    pending: required.filter((row) => !["signed", "scanned", "efile_ready", "not_required"].includes(signatureRowStatus(row, data).status)).length,
    rows
  };
}

function signatureTrackingText(data = state) {
  const summary = signatureTrackingSummary(data);
  return [
    "Signature Tracking",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    `Required signatures: ${summary.required}`,
    `Signed/returned: ${summary.signed}`,
    `eFile ready: ${summary.efileReady}`,
    `Pending: ${summary.pending}`,
    "",
    summary.rows.map((row) => {
      const status = signatureRowStatus(row, data);
      return [
        `${row.formNumber} ${row.formName}`,
        `Signer: ${row.signer}`,
        `Role: ${row.role}`,
        `Status: ${status.status}`,
        `Signed date: ${documentDate(status.signedDate) || "(not set)"}`,
        `Returned date: ${documentDate(status.returnedDate) || "(not set)"}`,
        `Scanned: ${status.scanned ? "Yes" : "No"}`,
        `eFile ready: ${status.efileReady ? "Yes" : "No"}`,
        `Note: ${row.detail}`
      ].join("\n");
    }).join("\n\n") || "No signature requirements detected."
  ].join("\n");
}

function signatureTrackingPanelHtml(data = state) {
  const summary = signatureTrackingSummary(data);
  const options = [
    ["not_sent", "Not sent"],
    ["sent", "Sent out"],
    ["signed", "Signed"],
    ["scanned", "Scanned PDF"],
    ["efile_ready", "eFile ready"],
    ["not_required", "Not required"]
  ];
  return `
    <div class="signature-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Signature tracking</p>
          <h3>Wet signatures before filing</h3>
          <p>Track who must sign, whether the signed copy came back, and whether it is ready for paper filing or attorney eFiling.</p>
        </div>
        <span class="badge ${summary.pending ? "warn" : ""}">${summary.signed}/${summary.required} signed</span>
      </div>
      <div class="signature-list">
        ${summary.rows.map((row) => {
          const status = signatureRowStatus(row);
          return `
            <div class="signature-row ${row.required ? "" : "muted"}">
              <div>
                <strong>${escapeHtml(row.formNumber)}</strong>
                <span>${escapeHtml(row.formName)}</span>
                <p>${escapeHtml(row.signer)} | ${escapeHtml(row.role)}</p>
              </div>
              <label>Status
                <select data-signature-field="status" data-signature-id="${escapeAttr(row.id)}">
                  ${options.map(([value, label]) => `<option value="${escapeAttr(value)}" ${status.status === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
                </select>
              </label>
              <label>Signed
                <input type="date" data-signature-field="signedDate" data-signature-id="${escapeAttr(row.id)}" value="${escapeAttr(status.signedDate)}" />
              </label>
              <label>Returned
                <input type="date" data-signature-field="returnedDate" data-signature-id="${escapeAttr(row.id)}" value="${escapeAttr(status.returnedDate)}" />
              </label>
              <label class="inline-check compact-check">
                <input type="checkbox" data-signature-field="scanned" data-signature-id="${escapeAttr(row.id)}" ${status.scanned ? "checked" : ""} />
                <span>Scanned</span>
              </label>
              <label class="inline-check compact-check">
                <input type="checkbox" data-signature-field="efileReady" data-signature-id="${escapeAttr(row.id)}" ${status.efileReady ? "checked" : ""} />
                <span>eFile ready</span>
              </label>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function bindSignatureTracking(root) {
  root.querySelectorAll("[data-signature-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.signatureId;
      const field = input.dataset.signatureField;
      if (!id || !field) return;
      const current = state.signatureStatus[id] || {};
      current[field] = input.type === "checkbox" ? input.checked : input.value;
      if (field === "status" && input.value === "efile_ready") {
        current.efileReady = true;
        current.scanned = true;
      }
      state.signatureStatus[id] = current;
      recordAuditLog("signature_status_updated", { signatureId: id, field });
      saveState();
      renderFormsView();
    });
  });
}

function outputFormatMatrixHtml(forms = formPreviewDefinitions()) {
  const activeForms = forms.filter((form) => form.included);
  const audience = state.payment.exportAudience === "attorney" || ["attorney", "paralegal"].includes(state.intake.userRole)
    ? "attorney"
    : "public";
  const audienceText = audience === "attorney"
    ? "Attorney e-file mode: expect a mixed package. Wet-signed documents generally become signed/scanned PDFs; court-editable drafts such as PR-1808/PR-1810 can stay Word/DOCX when required."
    : "Public print mode: users should get editable Word working copies and, when exact official output is available, PDF/print filing copies for signature.";
  return `
    <div class="output-format-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">Output accuracy roadmap</p>
          <h3>Word/PDF filing format matrix</h3>
          <p>${escapeHtml(audienceText)}</p>
          <p class="helper-text">Production note: the form content/layout stays official. This matrix controls package organization and can be updated once the exact Wisconsin eFiling Word/PDF list is confirmed.</p>
        </div>
        <span class="badge ${audience === "attorney" ? "warn" : ""}">${audience === "attorney" ? "Attorney e-file review" : "Public print review"}</span>
      </div>
      <div class="format-matrix">
        ${activeForms.map((form) => {
          const rule = formOutputRule(form.key);
          const dual = formDualOutputRule(form.key);
          const format = formFormatConfig(form.key);
          return `
            <div class="format-row ${["pr1808", "pr1810"].includes(form.key) ? "highlight" : ""}">
              <strong>${escapeHtml(form.title)}</strong>
              <span>${escapeHtml(efileDefaultLabel(format.efileDefault))}</span>
              <span>${escapeHtml(format.signatureWorkflow)}</span>
              <span>${escapeHtml(dual.pdf)}</span>
              <p>${escapeHtml(`${dual.word} ${rule.note}`)}</p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFormsView() {
  const list = document.getElementById("formsPreviewList");
  if (!list) return;
  const forms = formPreviewDefinitions();
  const route = probatePathDecision();
  const activeFormsProduct = route.key === "transfer_affidavit" ? "transfer_affidavit" : documentProductKey();
  list.innerHTML = `
    <div class="forms-packet-review">
      ${accountPortalHtml()}
    </div>
    <div class="forms-packet-review">
      ${officialFormIntegrityPanelHtml(forms)}
    </div>
    <div class="forms-packet-review">
      ${outputReadinessPanelHtml(forms)}
    </div>
    <div class="forms-packet-review">
      ${outputFormatMatrixHtml(forms)}
    </div>
    <div class="forms-packet-review">
      ${signatureTrackingPanelHtml()}
    </div>
    <div class="forms-packet-review">
      ${openingPacketResultsHtml()}
    </div>
    <div class="forms-packet-review">
      ${paymentGateHtml("forms", activeFormsProduct)}
    </div>
    ${forms.map(formPreviewCardHtml).join("")}
  `;
  bindAccountPortal(list);
  bindPaymentGate(list);
  bindIssueJumpButtons(list);
  bindSignatureTracking(list);
  list.querySelector("[data-download-pr1801-overlay-map]")?.addEventListener("click", downloadPr1801OverlayMap);
  list.querySelector("[data-download-pr1801-overlay-pilot]")?.addEventListener("click", downloadPr1801OverlayPilot);
  list.querySelectorAll("[data-form-generate]").forEach((button) => {
    button.addEventListener("click", () => {
      const form = forms.find((item) => item.key === button.dataset.formGenerate);
      if (form?.generate) form.generate(button);
    });
  });
}

function issueJumpButtonHtml(issue, className = "") {
  const target = issueTargetFor(issue);
  if (!target) return `<p>${escapeHtml(issue)}</p>`;
  return `
    <button type="button" class="form-issue-link issue-link ${escapeAttr(className)}" data-issue-step="${escapeAttr(target.step)}" data-issue-selector="${escapeAttr(target.selector || "")}">
      ${escapeHtml(issue)}
    </button>
  `;
}

function bindIssueJumpButtons(root) {
  root.querySelectorAll("[data-issue-step]").forEach((button) => {
    button.addEventListener("click", () => {
      jumpToIssueTarget({
        step: button.dataset.issueStep,
        selector: button.dataset.issueSelector || ""
      });
    });
  });
}

function formPreviewCardHtml(form) {
  const blockers = form.review?.blockers || [];
  const warnings = form.review?.warnings || [];
  const statusClass = blockers.length ? "bad" : warnings.length ? "warn" : "";
  const statusText = blockers.length ? "Needs info" : warnings.length ? "Review" : "Ready";
  const packetStatus = form.packetStatus || (form.included ? "included" : "not-in-path");
  const includedText = packetStatusLabel(packetStatus);
  const packetClass = form.included ? "" : packetStatus === "not-in-path" ? "bad" : "warn";
  const generateLabel = form.key === "transfer-affidavit"
    ? "Download Transfer package"
    : form.included ? `Generate ${form.title}` : `Generate ${form.title} anyway`;
  const shouldOpen = blockers.length;
  return `
    <details class="form-preview-card ${form.included ? "" : "muted-card"}" ${shouldOpen ? "open" : ""}>
      <summary class="form-preview-summary">
        <div>
          <p class="eyebrow">${escapeHtml(form.title)}</p>
          <h3>${escapeHtml(form.name)}</h3>
          ${form.reason ? `<p class="form-reason">${escapeHtml(form.reason)}</p>` : ""}
        </div>
        <div class="form-card-actions">
          <span class="badge ${packetClass}">${escapeHtml(includedText)}</span>
          <span class="badge ${statusClass}">${escapeHtml(statusText)}</span>
        </div>
      </summary>
      <div class="form-preview-body">
        <div class="form-field-grid">
          ${form.fields.map(([label, value]) => `
            <div class="summary-row">
              <span>${escapeHtml(label)}</span>
              <span>${escapeHtml(hasValue(value) ? value : "Not set")}</span>
            </div>
          `).join("")}
        </div>
        ${(blockers.length || warnings.length) ? `
          <div class="form-issues">
            ${blockers.slice(0, 3).map((issue) => issueJumpButtonHtml(issue, "blocker")).join("")}
            ${warnings.slice(0, 2).map((issue) => issueJumpButtonHtml(issue)).join("")}
          </div>
        ` : ""}
        <button type="button" class="secondary full-width" data-form-generate="${escapeAttr(form.key)}">${escapeHtml(generateLabel)}</button>
      </div>
    </details>
  `;
}

function renderOpeningPath() {
  const card = document.getElementById("openingPathCard");
  if (!card) return;
  const result = openingPacketResults();
  card.className = `path-card ${result.tone === "bad" ? "bad" : result.tone === "warn" ? "warn" : ""}`;
  card.innerHTML = openingPacketContentHtml(result);
}

function numberValue(value) {
  const raw = cleanText(value).replaceAll("$", "").replaceAll(",", "");
  if (!raw) return 0;
  const number = Number(raw);
  return Number.isFinite(number) ? number : 0;
}

function inventoryTotals() {
  const value = state.inventory.items.reduce((sum, item) => sum + numberValue(item.value), 0);
  const encumbrance = state.inventory.items.reduce((sum, item) => sum + numberValue(item.encumbrance), 0);
  return {
    value,
    encumbrance,
    net: Math.max(value - encumbrance, 0)
  };
}

function currencyText(number) {
  return Number(number || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderInventoryTotals() {
  const target = document.getElementById("inventoryTotals");
  if (!target) return;
  const totals = inventoryTotals();
  target.textContent = `Gross inventory value: $${currencyText(totals.value)} | Encumbrances: $${currencyText(totals.encumbrance)} | Net inventory value: $${currencyText(totals.net)}`;
}

function taskDefinitions() {
  const decision = openingPathDecision();
  const openingTask = decision.key === "notice"
    ? "Prepare and file the PR-1805 notice-path opening packet."
    : "Prepare and file the waiver-path opening packet.";
  const noticeTask = decision.key === "notice"
    ? "Serve PR-1805 and opening documents on interested persons."
    : "Collect signed PR-1803 waivers from all eligible interested persons.";
  const publicationTask = decision.key === "notice"
    ? "Publish PR-1805 and save the proof of publication."
    : "Publish PR-1804 Notice to Creditors and save the proof of publication.";
  return [
    { phase: "Opening", key: "waiversOrNotice", title: decision.key === "notice" ? "Serve notice" : "Waivers", detail: noticeTask, date: state.deadlines.serviceCompletedDate },
    { phase: "Opening", key: "openingPacket", title: "Opening packet", detail: openingTask, date: "" },
    { phase: "Opening", key: "openingServiceDeclaration", title: "Opening service declaration", detail: "Generate and file PR-1817 only for opening documents that were served; skip this if every required person signed a waiver and no declaration is needed.", date: state.deadlines.serviceCompletedDate },
    { phase: "Publication", key: "publication", title: "Publication", detail: publicationTask, date: state.deadlines.firstPublicationDate },
    { phase: "Publication", key: "proofPublication", title: "Proof of publication", detail: "File or save the proof of publication from the newspaper.", date: state.deadlines.proofPublicationReceivedDate },
    { phase: "Appointment", key: "lettersIssued", title: "Letters issued", detail: "Track when the court issues domiciliary letters.", date: state.deadlines.lettersIssuedDate },
    { phase: "Administration", key: "claims", title: "Claims deadline", detail: "Review creditor claims before distribution or closing.", date: state.deadlines.claimDeadline },
    { phase: "Administration", key: "inventory", title: "Inventory", detail: "Prepare and file PR-1811 Inventory.", date: state.deadlines.inventoryDueDate },
    { phase: "Administration", key: "estateAccount", title: "Estate account", detail: "Prepare the estate account and receipts or releases when the estate is ready for closing.", date: state.deadlines.closingReviewDate },
    { phase: "Administration", key: "inventoryAccountServiceDeclaration", title: "Inventory/account service declaration", detail: "After PR-1811 Inventory and any estate account or closing papers are served, generate and file PR-1817 for those documents.", date: state.deadlines.inventoryFiledDate || state.deadlines.closingReviewDate },
    { phase: "Closing", key: "closing", title: "Closing review", detail: "Review receipts, releases, accounting, and closing requirements.", date: state.deadlines.closingReviewDate }
  ];
}

function renderTaskTracker() {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;
  let phase = "";
  taskList.innerHTML = taskDefinitions().map((task) => {
    const phaseHeader = task.phase !== phase ? `<div class="task-phase">${escapeHtml(task.phase)}</div>` : "";
    phase = task.phase;
    const checked = state.taskStatus[task.key] || (task.key === "openingServiceDeclaration" && state.taskStatus.serviceDeclaration);
    return `
    ${phaseHeader}
    <div class="task-row">
      <input type="checkbox" data-task-key="${escapeAttr(task.key)}" ${checked ? "checked" : ""} />
      <div>
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.detail)}</p>
      </div>
      <div class="task-date">${escapeHtml(documentDate(task.date) || "No date")}</div>
    </div>
  `; }).join("");
  taskList.querySelectorAll("[data-task-key]").forEach((input) => {
    input.addEventListener("change", () => {
      state.taskStatus[input.dataset.taskKey] = input.checked;
      saveState();
      renderReview();
    });
  });
}

function checklistGroups() {
  const decision = openingPathDecision();
  const commonDrafts = [
    "PR-1801 Application for Informal Administration",
    "PR-1806 Proof of Heirship",
    "PR-1807 Consent to Serve",
    "Proposed PR-1808 Statement of Informal Administration",
    "Proposed PR-1810 Domiciliary Letters"
  ];
  if (state.will.exists === "yes") commonDrafts.push("Original will and any codicils, or required authenticated copies");

  if (decision.key === "waiver") {
    return [
      {
        title: "File",
        items: [
          ...commonDrafts,
          "Signed PR-1803 Waiver and Consent from every eligible interested person",
          "PR-1804 Notice to Creditors"
        ]
      },
      {
        title: "Serve or obtain",
        items: [
          "Collect signed PR-1803 waivers before relying on the waiver path",
          "Keep track of who received the opening documents",
          "Use PR-1817 if documents are served instead of personally signed"
        ]
      },
      {
        title: "Publish",
        items: [
          "Publish PR-1804 Notice to Creditors in the selected newspaper",
          "Keep the proof of publication for the court file"
        ]
      },
      {
        title: "Wait",
        items: [
          "Wait for the Probate Registrar to issue the statement and letters",
          "Track the creditor claim deadline before final distribution or closing"
        ]
      }
    ];
  }

  if (decision.key === "notice") {
    return [
      {
        title: "File",
        items: [
          ...commonDrafts,
          "PR-1805 Notice Setting Time to Hear Application and Deadline for Filing Claims"
        ]
      },
      {
        title: "Serve",
        items: [
          "Mail or otherwise serve PR-1805 on interested persons as required",
          "Include the application and will/codicil materials or bequest notice when required",
          "Generate PR-1817 to document service"
        ]
      },
      {
        title: "Publish",
        items: [
          "Publish PR-1805 in the selected newspaper",
          "Keep the proof of publication for the court file"
        ]
      },
      {
        title: "Wait",
        items: [
          "Wait for the hearing or objection deadline shown on PR-1805",
          "Wait for the Probate Registrar to issue the statement and letters",
          "Track the creditor claim deadline before final distribution or closing"
        ]
      }
    ];
  }

  if (decision.key === "blocked_no_will") {
    return [
      {
        title: "Stop",
        items: [
          "Do not use PR-1805 for a no-will case without all waivers",
          "Route this case to formal administration or attorney review"
        ]
      }
    ];
  }

  return [
    {
      title: "Choose path",
      items: [
        "Answer whether every interested person can sign PR-1803",
        "Confirm whether the decedent had a will",
        "Then the app will show the waiver-path or PR-1805-path packet"
      ]
    }
  ];
}

function renderChecklist() {
  const checklist = document.getElementById("packetChecklist");
  if (!checklist) return;
  checklist.innerHTML = displayChecklistGroups().map((group) => `
    <section class="checklist-group">
      <h3>${escapeHtml(group.title)}</h3>
      <ul>
        ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `).join("");
}

function displayChecklistGroups() {
  const groups = checklistGroups();
  const notes = cleanText(state.countyDefaults.localNotes)
    .split(/\n+/)
    .map((note) => cleanText(note))
    .filter(Boolean);
  if (notes.length) {
    groups.push({ title: "County/local notes", items: notes });
  }
  return groups;
}

function packetBlockers(data = state) {
  if (data !== state) {
    return withTemporaryState(data, () => openingDocumentReadiness().blockers);
  }
  return openingDocumentReadiness().blockers;
}

function checklistText() {
  return displayChecklistGroups().map((group) => {
    const items = group.items.map((item) => `- ${item}`).join("\n");
    return `${group.title}\n${items}`;
  }).join("\n\n");
}

function filingInstructionsText() {
  const readiness = openingDocumentReadiness();
  const result = openingPacketResults();
  const groups = openingFilingGroups(result);
  const sections = [
    "Opening Filing Handoff",
    `Packet status: ${readiness.ready ? "Ready to print and file" : "Needs review before filing"}`,
    `Opening path: ${result.title}`,
    "",
    ...groups.map((group) => `${group.title}\n${group.items.map((item) => `- ${item}`).join("\n")}`)
  ];
  if (readiness.blockers.length) {
    sections.push("", "Before printing or filing", readiness.blockers.map((item) => `- ${item}`).join("\n"));
  }
  if (readiness.courtSupplied.length) {
    sections.push("", "Court or county usually supplies", readiness.courtSupplied.map((item) => `- ${item}`).join("\n"));
  }
  if (readiness.reviewWarnings.length) {
    sections.push("", "Review notes", readiness.reviewWarnings.map((item) => `- ${item}`).join("\n"));
  }
  return sections.join("\n");
}

function taskListText() {
  let phase = "";
  return taskDefinitions().map((task) => {
    const checked = state.taskStatus[task.key] || (task.key === "openingServiceDeclaration" && state.taskStatus.serviceDeclaration);
    const done = checked ? "Done" : "Open";
    const date = documentDate(task.date) || "No date set";
    const phaseHeader = task.phase !== phase ? `${task.phase}\n` : "";
    phase = task.phase;
    return `${phaseHeader}${done} | ${task.title} | ${date}\n${task.detail}`;
  }).join("\n\n");
}

function serviceListText() {
  return state.interestedPersons.map((person, index) => {
    const name = cleanText(person.name) || "(name missing)";
    const address = cleanText(person.address) || "(address missing)";
    return `${index + 1}. ${name} | ${address} | ${cleanText(state.service.method) || "service type not set"}`;
  }).join("\n");
}

function inventorySummaryText() {
  const totals = inventoryTotals();
  const items = state.inventory.items.filter(inventoryItemHasContent);
  const rows = items.map((item, index) => {
    const value = hasValue(item.value) ? `$${moneyText(item.value)}` : "(value missing)";
    return `${index + 1}. ${inventoryScheduleDescription(item) || "(description missing)"} | ${value}`;
  }).join("\n") || "(none started)";
  return `Inventory totals\nGross: $${currencyText(totals.value)}\nEncumbrances: $${currencyText(totals.encumbrance)}\nNet: $${currencyText(totals.net)}\n\nItems\n${rows}`;
}

function simpleDocxParagraphXml(text = "", options = {}) {
  const bold = options.bold ? "<w:b/>" : "";
  const size = options.size ? `<w:sz w:val="${options.size}"/><w:szCs w:val="${options.size}"/>` : "";
  const spacing = options.after ? `<w:spacing w:after="${options.after}"/>` : "";
  return `<w:p><w:pPr>${spacing}</w:pPr><w:r><w:rPr>${bold}${size}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

async function buildSimpleDocx(lines = []) {
  if (!window.JSZip) throw new Error("The local document library did not load.");
  const zip = new JSZip();
  const paragraphs = lines.map((line) => {
    if (typeof line === "string") return simpleDocxParagraphXml(line);
    return simpleDocxParagraphXml(line.text, line);
  }).join("");
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.folder("_rels").file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.folder("word").file("document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function transferAffidavitChecklistGroups(data = state) {
  const readiness = transferAffidavitReadiness(data);
  const assetItems = readiness.assets.map((asset, index) => {
    const holder = cleanText(asset.holder) || "holder/agency not set";
    const description = cleanText(asset.description) || "description missing";
    const value = hasValue(asset.value) ? `$${moneyText(asset.value)}` : "value missing";
    return `Asset ${index + 1}: ${description} | ${holder} | ${value}`;
  });
  return [
    {
      title: "Before signing",
      items: [
        "Verify that the official Wisconsin Transfer by Affidavit requirements are satisfied.",
        "Confirm the decedent name, date of death, and waiting-period requirement.",
        "Confirm the total Wisconsin property covered by affidavit is $50,000 or less.",
        "Confirm no probate proceeding is already pending unless an attorney/probate office approves the approach.",
        "Confirm the affiant is entitled to collect the property or is acting for the entitled person."
      ]
    },
    {
      title: "Prepare",
      items: [
        "Use the official Wisconsin PR-1831 Transfer by Affidavit form for filing/transfer.",
        "Attach or bring a certified death certificate if the holder requires it.",
        "Attach supporting title/account documents the holder requests.",
        ...assetItems
      ]
    },
    {
      title: "Sign and deliver",
      items: [
        "Sign the affidavit before a notary if required by the official form or holder.",
        "Deliver the affidavit package to each asset holder or agency.",
        data.transferAffidavit?.realEstateIncluded === "yes" ? "For real estate, confirm recording, legal description, transfer return, and title-company requirements before relying on the package." : "No real estate-specific recording step is marked in this package.",
        data.transferAffidavit?.vehicleIncluded === "yes" ? "For vehicles, confirm Wisconsin DMV title-transfer requirements." : "No vehicle-specific DMV step is marked in this package."
      ]
    },
    {
      title: "After transfer",
      items: [
        "Keep copies of the affidavit, proof of transfer, account closing letters, checks, titles, and receipts.",
        "Do not distribute disputed property until entitlement and creditor issues are resolved.",
        "Use attorney review before transferring property if public-benefits recovery, creditor disputes, missing heirs, or unclear title issues exist."
      ]
    }
  ];
}

function transferAffidavitChecklistText(data = state) {
  return transferAffidavitChecklistGroups(data).map((group) => {
    return `${group.title}\n${group.items.map((item) => `- ${item}`).join("\n")}`;
  }).join("\n\n");
}

function transferAffidavitDocumentLines(data = state) {
  const readiness = transferAffidavitReadiness(data);
  const tba = data.transferAffidavit || {};
  const affiantName = transferAffidavitAffiantName(data) || "(not set)";
  const affiantAddress = transferAffidavitAffiantAddress(data) || "(not set)";
  const assets = readiness.assets.length ? readiness.assets : [emptyTransferAsset()];
  const capacityLabels = {
    heir: "an heir having the listed relationship with the Decedent",
    trustee: "trustee of a revocable trust created by the Decedent",
    guardian: "guardian of the Decedent at the time of death",
    named_pr: "person identified in the Decedent's Will to act as personal representative"
  };
  const lines = [
    { text: "TRANSFER BY AFFIDAVIT", bold: true, size: 32, after: 180 },
    "Official source reference: State Bar of Wisconsin Transfer by Affidavit, §867.03, Wis. Stats. This generated DOCX is an MVP draft mapped from the app data; verify against the official PDF before use.",
    "",
    `${tba.isAmended ? "[X]" : "[ ]"} Amended${tba.isAmended ? `, amending recorded Document No. ${cleanText(tba.amendedDocumentNumber) || "(not set)"}` : ""}`,
    "",
    { text: "Estate of the Decedent", bold: true, size: 26, after: 120 },
    `Estate of: ${cleanText(data.decedent?.fullName) || "(not set)"}`,
    "",
    { text: "1. Decedent information", bold: true, size: 24, after: 80 },
    `The Decedent was born on: ${documentDate(data.decedent?.dateOfBirth) || "(not set)"}`,
    `The Decedent died on: ${documentDate(data.decedent?.dateOfDeath) || "(not set)"}`,
    `Domicile county/state: ${cleanText(data.decedent?.domicileCounty) || cleanText(data.estate?.county) || "(county not set)"}, ${cleanText(data.decedent?.domicileState) || "Wisconsin"}`,
    `Mailing address: ${cleanText(data.decedent?.lastMailingAddress) || "(not set)"}`,
    "",
    { text: "2. Affiant capacity", bold: true, size: 24, after: 80 },
    `Affiant: ${affiantName}`,
    `Address: ${affiantAddress}`,
    `Email: ${cleanText(tba.affiantEmail) || cleanText(data.applicant?.email) || "(not set)"}`,
    `Phone: ${cleanText(tba.affiantPhone) || cleanText(data.applicant?.phone) || "(not set)"}`,
    `Capacity checked: ${capacityLabels[tba.affiantCapacity] || "(not set)"}`,
    `Relationship: ${cleanText(tba.affiantRelationship) || "(not set)"}`,
    tba.affiantCapacity === "named_pr" ? "Note: if signing only as nominated personal representative, this affidavit may not be used to transfer real estate." : "",
    "",
    { text: "3. Gross value", bold: true, size: 24, after: 80 },
    `Total gross value of Decedent's Wisconsin property subject to administration: $${currencyText(readiness.gross)}`,
    `Days since death: ${readiness.elapsed === null ? "(not set)" : readiness.elapsed}`,
    `Waiting-period confirmation: ${cleanText(tba.daysSinceDeathConfirmed) || "(not answered)"}`,
    `No pending probate confirmation: ${cleanText(tba.noPendingProbate) || "(not answered)"}`,
    "",
    { text: "4. Real estate heirship addendum", bold: true, size: 24, after: 80 },
    `Real estate included: ${cleanText(tba.realEstateIncluded) || "(not answered)"}`,
    `Heirs identified / heirship addendum needed: ${tba.realEstateIncluded === "yes" ? "Yes, attach Affidavit of Heirship addendum." : "Not marked as needed."}`,
    `30-day heir notice or waivers complete: ${cleanText(tba.realEstateHeirNoticeComplete) || "(not answered)"}`,
    "",
    { text: "5. Property to transfer", bold: true, size: 24, after: 80 },
    `Requested recipient: ${cleanText(tba.documentRecipient) || affiantName}`,
    ...assets.flatMap((asset, index) => [
      `${index + 1}. ${cleanText(asset.description) || "(description missing)"}`,
      `   Type: ${cleanText(asset.type) || "(not set)"}`,
      `   Holder: ${cleanText(asset.holder) || "(not set)"}`,
      `   Value: ${hasValue(asset.value) ? `$${moneyText(asset.value)}` : "(not set)"}`,
      `   Account/VIN/parcel/tax key/identifier: ${cleanText(asset.accountOrIdentifier) || "(not set)"}`,
      `   Release instructions: ${cleanText(asset.releaseInstructions) || "(not set)"}`,
      `   Notes: ${cleanText(asset.notes) || "(none)"}`
    ]),
    "",
    { text: "6. Real estate notice", bold: true, size: 24, after: 80 },
    `If real estate is included, affiant must provide copy of the affidavit and notice of intent to record to heirs at least 30 days before recording, or obtain waivers. Status: ${cleanText(tba.realEstateHeirNoticeComplete) || "(not answered)"}`,
    "",
    { text: "7. Decedent's spouse(s)", bold: true, size: 24, after: 80 },
    cleanText(tba.spouseSummary) || cleanText(data.spouse?.fullName) || cleanText(data.heirship?.spouse?.name) || "(not set / affiant lacks information not marked)",
    "",
    { text: "8. Government services / Estate Recovery", bold: true, size: 24, after: 80 },
    `Public-benefits follow-up marked: ${cleanText(tba.publicBenefitsFollowup || data.pathRouter?.publicBenefits) || "(not answered)"}`,
    `Estate Recovery notice sent / proof available: ${cleanText(tba.estateRecoveryNoticeSent) || "(not answered)"}`,
    "If listed services were received, attach proof of certified mail delivery to the Wisconsin Department of Health Services Estate Recovery Program before transfer/recording.",
    "",
    { text: "9. Affiant duty after accepting property", bold: true, size: 24, after: 80 },
    "Affiant acknowledges duty to apply transferred property to obligations according to statutory priorities and distribute any balance under the governing instrument or intestacy rules.",
    "",
    { text: "Declaration / notary / drafting", bold: true, size: 24, after: 80 },
    "Declaration: To the best of affiant's knowledge and belief, the document is true, accurate, complete, and in conformity with Wisconsin law.",
    `State / County for notarization: ${cleanText(data.decedent?.domicileState) || "Wisconsin"} / ${cleanText(data.estate?.county) || "(not set)"}`,
    `Signature name: ${affiantName}`,
    `Signature address: ${affiantAddress}`,
    `Drafted by: ${cleanText(tba.draftedBy) || cleanText(data.preparer?.fullName) || cleanText(data.applicant?.fullName) || "(not set)"}`,
    "",
    { text: "MVP readiness notes", bold: true, size: 24, after: 80 },
    ...(readiness.blockers.length ? readiness.blockers.map((item) => `Blocker: ${item}`) : ["No blockers from the MVP readiness check."]),
    ...(readiness.warnings.length ? readiness.warnings.map((item) => `Review: ${item}`) : ["No review warnings from the MVP readiness check."]),
    "",
    { text: "Package notes", bold: true, size: 24, after: 80 },
    cleanText(tba.notes) || "(none)"
  ].filter((line) => typeof line !== "string" || line.length);
  return lines;
}

function transferAffidavitReadmeText(data = state) {
  const readiness = transferAffidavitReadiness(data);
  return [
    "Transfer by Affidavit MVP Package",
    `Estate: ${cleanText(data.decedent?.fullName) || "(not set)"}`,
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    "This MVP package is not yet the official Wisconsin PR-1831 form. Use it for product testing, fact review, and holder checklist development until the official form template is added.",
    "",
    `Readiness: ${readiness.blockers.length ? "Needs info before relying on package" : "Ready for prototype export"}`,
    readiness.blockers.length ? readiness.blockers.map((item) => `- ${item}`).join("\n") : "- No blockers from the MVP readiness check.",
    "",
    "Checklist",
    transferAffidavitChecklistText(data)
  ].join("\n");
}

async function buildTransferAffidavitDocx(data = state) {
  const review = validateTransferAffidavit(data);
  if (review.blockers.length) throw new Error(review.blockers[0]);
  return buildSimpleDocx(transferAffidavitDocumentLines(data));
}

async function buildTransferAffidavitZip(data = state) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const review = validateTransferAffidavit(data);
  if (review.blockers.length) throw new Error(review.blockers[0]);
  const zip = new JSZip();
  const slug = estateSlug();
  await addBlobToZip(zip, "01-affidavit-package", `transfer-by-affidavit-draft-${slug}.docx`, await buildTransferAffidavitDocx(data));
  zip.file("00-read-me.txt", transferAffidavitReadmeText(data));
  zip.file("00-legal-disclaimer.txt", LEGAL_DISCLAIMER_FULL);
  zip.file("00-output-format-manifest.txt", outputManifestText(data));
  zip.file("00-official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("00-official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("00-per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  zip.file("00-legal-logic-audit.txt", legalLogicAuditText(data));
  zip.file("02-asset-handoff-checklist.txt", transferAffidavitChecklistText(data));
  zip.file("case-data.json", JSON.stringify(data, null, 2));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

function informationSummaryText(data = state) {
  return withTemporaryState(data, () => {
    const route = probatePathDecision(data);
    const opening = openingPathDecision(data);
    const readiness = openingDocumentReadiness();
    const issues = attorneyHandoffIssueRows(data);
    const people = (data.interestedPersons || [])
      .filter(hasInterestedPersonContent)
      .map((person, index) => {
        const status = interestedPersonServiceStatus(person);
        return `${index + 1}. ${cleanText(person.name) || "(name missing)"} | ${compactInterestedRelationship(person) || "(role missing)"} | ${cleanText(person.address) || "(address missing)"} | ${status.reasons.join("; ") || "no service issue flagged"}`;
      })
      .join("\n") || "(none entered)";
    return [
      "Wisconsin Probate Information Summary",
      `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
      "",
      "Important",
      LEGAL_DISCLAIMER_FULL,
      "",
      "Contact",
      `Applicant: ${cleanText(data.applicant?.fullName) || "(not set)"}`,
      `Email: ${cleanText(data.applicant?.email) || "(not set)"}`,
      `Phone: ${cleanText(data.applicant?.phone) || "(not set)"}`,
      `County: ${cleanText(data.estate?.county) || "(not set)"}`,
      "",
      "Wisconsin Probate Check",
      `${route.title}: ${route.detail}`,
      "",
      "Opening packet decision",
      `${opening.title}: ${opening.detail}`,
      "",
      "Review issues",
      issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- No special issue entered beyond the route recommendation.",
      "",
      "Packet readiness",
      `Ready: ${readiness.ready ? "Yes" : "No"}`,
      readiness.blockers.length ? readiness.blockers.map((item) => `- ${item}`).join("\n") : "- No must-fix blockers from the current readiness check.",
      "",
      "Interested persons",
      people,
      "",
      "User notes",
      cleanText(data.attorneyHandoff?.notes) || cleanText(data.pathRouter?.notes) || "(none)"
    ].join("\n");
  });
}

function attorneyHandoffSummaryText(data = state) {
  return informationSummaryText(data).replace("Wisconsin Probate Information Summary", "Wisconsin Probate Attorney Review Handoff");
}

async function buildInformationSummaryZip(data = state) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const zip = new JSZip();
  zip.file("information-summary.txt", informationSummaryText(data));
  zip.file("filing-readiness-preview.txt", withTemporaryState(data, () => filingInstructionsText()));
  zip.file("interested-persons-service-list.txt", withTemporaryState(data, () => serviceListText()));
  zip.file("signature-tracking.txt", signatureTrackingText(data));
  zip.file("secure-delivery-manifest.txt", secureDeliveryManifestText(data));
  zip.file("production-launch-handoff.txt", productionLaunchHandoffText(data));
  zip.file("output-format-manifest.txt", outputManifestText(data));
  zip.file("official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  zip.file("legal-logic-audit.txt", legalLogicAuditText(data));
  zip.file("legal-disclaimer.txt", LEGAL_DISCLAIMER_FULL);
  zip.file("case-data.json", JSON.stringify(data, null, 2));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

async function buildAttorneyHandoffZip(data = state) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  if (!FEATURE_ATTORNEY_HANDOFF) throw new Error("Attorney handoff is disabled. Download the information summary instead.");
  if (!data.attorneyHandoff?.consent) throw new Error("Consent is required before creating the attorney handoff package.");
  if (!attorneyHandoffContactName(data)) throw new Error("Add a contact name before creating the attorney handoff package.");
  if (!attorneyHandoffContactEmail(data)) throw new Error("Add a contact email before creating the attorney handoff package.");
  const zip = new JSZip();
  zip.file("attorney-handoff-summary.txt", attorneyHandoffSummaryText(data));
  zip.file("legal-disclaimer.txt", LEGAL_DISCLAIMER_FULL);
  zip.file("output-format-manifest.txt", outputManifestText(data));
  zip.file("official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  zip.file("legal-logic-audit.txt", legalLogicAuditText(data));
  zip.file("production-output/PR-1801-overlay-map.json", JSON.stringify(pr1801OverlayMap(data), null, 2));
  zip.file("production-output/PR-1801-overlay-fields.csv", pr1801OverlayFieldsCsv(data));
  zip.file("production-output/PR-1801-coordinate-checklist.txt", pr1801OverlayCoordinateChecklistText(data));
  zip.file("production-output/PR-1801-overlay-readme.txt", pr1801OverlayReadmeText(data));
  zip.file("legal-review-checklist.txt", legalReviewChecklistText(data));
  zip.file("legal-logic-beta-lock.txt", legalLogicLockText(data));
  zip.file("filing-readiness-preview.txt", withTemporaryState(data, () => filingInstructionsText()));
  zip.file("interested-persons-service-list.txt", withTemporaryState(data, () => serviceListText()));
  zip.file("signature-tracking.txt", signatureTrackingText(data));
  zip.file("secure-delivery-manifest.txt", secureDeliveryManifestText(data));
  zip.file("production-launch-handoff.txt", productionLaunchHandoffText(data));
  zip.file("inventory-snapshot.txt", withTemporaryState(data, () => inventorySummaryText()));
  if (data.attorneyHandoff.includeCaseData !== false) {
    zip.file("case-data.json", JSON.stringify(data, null, 2));
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

async function addBlobToZip(zip, folder, filename, blob) {
  zip.file(`${folder}/${filename}`, await blob.arrayBuffer());
}

function estateSlug() {
  return cleanText(state.decedent.fullName).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "estate";
}

async function buildOpeningPacketZip(data = state) {
  if (data !== state) {
    const previous = state;
    state = data;
    try {
      return await buildOpeningPacketZip(state);
    } finally {
      state = previous;
    }
  }
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const blockers = packetBlockers(data);
  if (blockers.length) throw new Error(blockers[0]);

  const zip = new JSZip();
  const slug = estateSlug();
  const signFolder = "01-opening-documents-print-sign-file";
  const efileFolder = "02-attorney-efile-format-notes";
  const laterFolder = "03-later-after-domiciliary-letters";
  const productionFolder = "04-developer-output-maps";
  await addBlobToZip(zip, signFolder, `01-PR-1801-${slug}.docx`, await buildPr1801Docx(data));
  await addBlobToZip(zip, signFolder, `02-PR-1806-${slug}.docx`, await buildPr1806Docx(data));
  await addBlobToZip(zip, signFolder, `03-PR-1807-${slug}.docx`, await buildPr1807Docx(data));
  if (openingPathDecision(data).key === "waiver") {
    await addPr1803WaiversToZip(zip, data, signFolder, slug);
    await addBlobToZip(zip, signFolder, `05-PR-1804-${slug}.docx`, await buildPr1804Docx(data));
  } else {
    await addBlobToZip(zip, signFolder, `04-PR-1805-${slug}.docx`, await buildPr1805Docx(data));
  }
  await addBlobToZip(zip, signFolder, `06-PR-1808-court-draft-${slug}.docx`, await buildPr1808Docx(data));
  await addBlobToZip(zip, signFolder, `07-PR-1810-court-draft-${slug}.docx`, await buildPr1810Docx(data));
  await addBlobToZip(zip, `${efileFolder}/word-docx-court-drafts`, `PR-1808-${slug}.docx`, await buildPr1808Docx(data));
  await addBlobToZip(zip, `${efileFolder}/word-docx-court-drafts`, `PR-1810-${slug}.docx`, await buildPr1810Docx(data));
  if (!validate1817(data).blockers.length) {
    await addBlobToZip(zip, signFolder, `08-PR-1817-service-declaration-${slug}.docx`, await buildPr1817Docx(data));
  }
  zip.file(`${signFolder}/read-me.txt`, signingPackageReadmeText(data));
  zip.file(`${signFolder}/signature-tracking.txt`, signatureTrackingText(data));
  zip.file(`${laterFolder}/read-me.txt`, [
    "Later administration documents",
    "",
    "Use this folder for forms that are normally completed after domiciliary letters issue, such as PR-1811 Inventory and later accounting/closing documents.",
    "The opening packet folder contains the documents generally prepared to start the informal probate and obtain letters."
  ].join("\n"));
  zip.file(`${efileFolder}/read-me.txt`, attorneyEfilePackageReadmeText(data));
  zip.file(`${efileFolder}/per-form-word-pdf-config.txt`, efilingFormatConfigText(data));
  zip.file(`${efileFolder}/signed-pdf-after-wet-signature-list.txt`, signedPdfFormLabels(activePacketForms(data)).map((label) => `- ${label}`).join("\n") || "- None.");
  zip.file("00-read-me.txt", [
    "Wisconsin Informal Probate Opening Packet",
    `Estate: ${cleanText(data.decedent.fullName) || "(not set)"}`,
    `County: ${cleanText(data.estate.county) || "(not set)"}`,
    `Opening path: ${openingPathDecision(data).title}`,
    `Waiver packet: ${openingPathDecision(data).key === "waiver" ? waiverSignatureModeLabel(data.waiver?.signatureMode) : "Not used"}`,
    `Courthouse: ${cleanText(data.countyDefaults?.courthouseAddress) || cleanText(data.notice1805?.courthouseAddress) || cleanText(data.notice1804?.courthouseAddress) || "(not set)"}`,
    `Probate office: ${cleanText(data.countyDefaults?.probateOfficeName) || "(not set)"}`,
    `Probate registrar: ${cleanText(data.countyDefaults?.registrarName) || cleanText(data.notice1805?.registrarName) || "(not set)"}`,
    `Publication newspaper: ${cleanText(data.countyDefaults?.newspaperName) || cleanText(data.notice1805?.newspaperName) || cleanText(data.notice1804?.newspaperName) || "(not set)"}`,
    `Intended delivery: ${data.payment?.exportAudience === "attorney" ? "Attorney e-file review" : "Public print/sign review"}`,
    `Delivery mode selected: ${data.payment?.deliveryMode === "secure_link" ? "Secure email link later (prototype placeholder)" : "Download now"}`,
    "",
    "Filing format note",
    "This prototype currently generates Word draft files and exact-output mapping aids. Production output should give users editable Word working copies plus exact official PDF filing copies where available. Wet-signed documents generally become signed/scanned PDFs for attorney eFiling; court-editable drafts such as PR-1808/PR-1810 may need Word/DOCX.",
    "",
    filingInstructionsText(),
    "",
    "Checklist",
    checklistText(),
    "",
    "Tasks",
    taskListText(),
    "",
    "Service list",
    serviceListText(),
    "",
    "Inventory snapshot",
    inventorySummaryText()
  ].join("\n"));
  zip.file("00-legal-disclaimer.txt", LEGAL_DISCLAIMER_FULL);
  zip.file("00-output-format-manifest.txt", outputManifestText(data));
  zip.file("00-official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("00-official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("00-per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  zip.file("00-signature-tracking.txt", signatureTrackingText(data));
  zip.file("00-secure-delivery-manifest.txt", secureDeliveryManifestText(data));
  zip.file("00-production-launch-handoff.txt", productionLaunchHandoffText(data));
  zip.file("00-legal-logic-audit.txt", legalLogicAuditText(data));
  zip.file("00-legal-review-checklist.txt", legalReviewChecklistText(data));
  zip.file("00-attorney-beta-validation.txt", attorneyBetaReviewText(data));
  zip.file("00-legal-logic-beta-lock.txt", legalLogicLockText(data));
  zip.file(`${productionFolder}/PR-1801-overlay-map.json`, JSON.stringify(pr1801OverlayMap(data), null, 2));
  zip.file(`${productionFolder}/PR-1801-overlay-fields.csv`, pr1801OverlayFieldsCsv(data));
  zip.file(`${productionFolder}/PR-1801-coordinate-checklist.txt`, pr1801OverlayCoordinateChecklistText(data));
  zip.file(`${productionFolder}/PR-1801-overlay-readme.txt`, pr1801OverlayReadmeText(data));
  zip.file("case-data.json", JSON.stringify(data, null, 2));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function legalDisclaimerText(variant = "footer") {
  return variant === "short" ? LEGAL_DISCLAIMER_SHORT : LEGAL_DISCLAIMER_FULL;
}

function legalDisclaimerHtml(variant = "footer") {
  const compact = variant === "result" || variant === "download";
  return `
    <div class="legal-disclaimer ${escapeAttr(variant)}">
      <strong>${escapeHtml(compact ? "Important" : COMPANY_CONFIG.companyName)}</strong>
      <p>${escapeHtml(compact ? LEGAL_DISCLAIMER_SHORT : LEGAL_DISCLAIMER_FULL)}</p>
    </div>
  `;
}

function privacyNoticeHtml() {
  return `
    <div class="legal-disclaimer privacy">
      <strong>Privacy note</strong>
      <p>Do not enter Social Security numbers, full bank account numbers, or unrelated financial records unless a future production screen specifically requests them.</p>
    </div>
  `;
}

function supportBoundaryResponse() {
  return "That question may require legal advice. This service provides legal information and document automation, but it is not a law firm. You may want to contact a Wisconsin probate attorney before continuing.";
}

function safeEventMetadata(metadata = {}) {
  const blockedKeys = /name|address|email|phone|decedent|heir|beneficiary|asset|creditor|account|value|amount|description|document/i;
  return Object.fromEntries(Object.entries(metadata || {}).filter(([key]) => !blockedKeys.test(key)));
}

function appendBoundedLog(collectionName, entry, maxEntries = 200) {
  if (!Array.isArray(state[collectionName])) state[collectionName] = [];
  state[collectionName].push(entry);
  if (state[collectionName].length > maxEntries) {
    state[collectionName] = state[collectionName].slice(-maxEntries);
  }
  saveState();
}

function recordAnalyticsEvent(name, metadata = {}) {
  appendBoundedLog("analyticsEvents", {
    id: `analytics-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event: name,
    metadata: safeEventMetadata(metadata),
    createdAt: new Date().toISOString()
  });
}

function recordAuditLog(action, metadata = {}) {
  appendBoundedLog("auditLogs", {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    matterId: state?.matter?.id || "prototype-local-case",
    action,
    metadata: safeEventMetadata(metadata),
    createdAt: new Date().toISOString()
  });
}

function recordConsent(consentType, consentText, accepted = true, consentVersion = "") {
  appendBoundedLog("consentLogs", {
    id: `consent-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    matterId: state?.matter?.id || "prototype-local-case",
    consentType,
    consentVersion,
    consentText,
    accepted: Boolean(accepted),
    acceptedAt: new Date().toISOString()
  });
}

const PUBLIC_COPY_PROHIBITED_PHRASES = [
  "court-approved",
  "guaranteed accepted",
  "official Wisconsin probate service",
  "our lawyers will",
  "your lawyer",
  "no lawyer needed",
  "replace a lawyer",
  "we handle probate for you",
  "the exact forms required",
  "guaranteed complete",
  "best probate lawyer",
  "recommended lawyer",
  "matched with the best attorney",
  "send to our law firm"
];

function publicCopyGuardResults(text = "") {
  const source = cleanText(text || (typeof document !== "undefined" ? document.body?.innerText : "")).toLowerCase();
  const findings = [];
  PUBLIC_COPY_PROHIBITED_PHRASES.forEach((phrase) => {
    if (source.includes(phrase.toLowerCase())) findings.push({ phrase, status: "flagged" });
  });
  if (source.includes("legal advice") && !/(not legal advice|does not provide legal advice|not a law firm and does not provide legal advice)/.test(source)) {
    findings.push({ phrase: "legal advice", status: "flagged" });
  }
  if (source.includes("attorney-client relationship") && !/(does not create an attorney-client relationship|no attorney-client relationship)/.test(source)) {
    findings.push({ phrase: "attorney-client relationship", status: "flagged" });
  }
  return {
    passed: findings.length === 0,
    findings
  };
}

function moneyText(value) {
  const raw = cleanText(value).replaceAll("$", "").replaceAll(",", "");
  if (!raw) return "";
  const number = Number(raw);
  return Number.isFinite(number) ? number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : raw;
}

function documentDate(value) {
  const raw = cleanText(value);
  if (!raw) return "";
  return raw.replace(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g, (_match, year, month, day) => {
    return `${Number(month)}/${Number(day)}/${year}`;
  });
}

function waiverSignatureModeLabel(value = state.waiver.signatureMode) {
  return value === "individual" ? "Separate waiver for each signer" : "One shared waiver";
}

function pr1801Values(data) {
  const willExists = data.will.exists;
  const codicils = data.will.hasCodicils === "yes" ? documentDate(data.will.codicilDates) : "";
  const prName = cleanText(data.pr.fullName) || cleanText(data.will.nominatedPr);
  const interested = data.interestedPersons[0] || {};
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: cleanText(data.decedent.fullName),
    4: "",
    6: cleanText(data.estate.caseNumber),
    7: documentDate(data.decedent.dateOfBirth),
    8: documentDate(data.decedent.dateOfDeath),
    9: cleanText(data.decedent.domicileCounty),
    10: cleanText(data.decedent.domicileState),
    11: cleanText(data.decedent.lastMailingAddress),
    12: cleanText(data.applicant.capacity),
    15: cleanText(data.otherProceedings.explanation),
    16: moneyText(data.estate.estimatedGrossValue || data.estate.estimatedNetValue),
    27: cleanText(data.benefits.explanation),
    32: cleanText(data.spouse.fullName || data.heirship.spouse.name),
    42: willExists === "yes" ? documentDate(data.will.date) : "",
    44: willExists === "yes" ? codicils : "",
    46: willExists === "yes" ? cleanText(data.will.priorCaseNumber) : "",
    50: willExists === "yes" ? cleanText(data.will.namedPr) : "",
    51: willExists === "yes" ? prName : "",
    52: willExists === "yes" ? cleanText(data.will.namedTrustee) : "",
    53: willExists === "yes" ? cleanText(data.will.nominatedTrustee) : "",
    55: willExists === "no" ? prName : "",
    57: cleanText(interested.name),
    58: cleanText(compactInterestedRelationship(interested)),
    59: cleanText(interested.address),
    60: documentDate(interested.minorDateOfBirth),
    62: cleanText(data.requests.question10OtherText),
    64: cleanText(data.requests.domiciliaryLettersTo) || prName,
    66: cleanText(data.requests.trusteeNames),
    67: cleanText(data.requests.trustName),
    70: cleanText(data.requests.otherText),
    71: "",
    72: cleanText(data.applicant.fullName),
    73: cleanText(data.applicant.address),
    74: cleanText(data.applicant.email),
    75: cleanText(data.applicant.phone),
    76: documentDate(data.applicant.signatureDate),
    77: cleanText(data.applicant.barNumber),
    78: cleanText(data.preparer.fullName),
    79: cleanText(data.preparer.address),
    80: cleanText(data.preparer.email),
    81: cleanText(data.preparer.phone),
    82: cleanText(data.preparer.barNumber)
  };

  const checkboxFields = {
    5: Boolean(data.estate.isAmended),
    13: data.otherProceedings.status === "pending",
    14: data.otherProceedings.status === "not_pending",
    17: data.benefits.medicalAssistance === "did",
    18: data.benefits.medicalAssistance === "did_not",
    19: data.benefits.familyCare === "did",
    20: data.benefits.familyCare === "did_not",
    21: data.benefits.communityOptions === "did",
    22: data.benefits.communityOptions === "did_not",
    23: data.benefits.chronicDisease === "did",
    24: data.benefits.chronicDisease === "did_not",
    25: data.benefits.institution === "was",
    26: data.benefits.institution === "was_not",
    28: Boolean(data.benefits.lackInfo),
    29: Boolean(data.spouse.seeAttached),
    30: data.spouse.livingStatus === "living",
    31: data.spouse.livingStatus === "deceased",
    33: data.spouse.statusAtDeath === "married",
    34: data.spouse.statusAtDeath === "divorced",
    35: data.spouse.communityOptions === "did",
    36: data.spouse.communityOptions === "did_not",
    37: data.spouse.chronicDisease === "did",
    38: data.spouse.chronicDisease === "did_not",
    39: Boolean(data.spouse.lackInfo),
    40: willExists === "yes",
    41: willExists === "yes",
    43: Boolean(codicils),
    45: data.will.location === "court",
    47: data.will.location === "accompanies",
    48: data.will.location === "probated_elsewhere",
    49: data.will.location === "en_route",
    54: willExists === "no",
    56: Boolean(data.requests.interestedPersonsSeeAttached) || data.interestedPersons.length > 1,
    61: Boolean(data.requests.question10OtherSelected),
    63: willExists === "yes",
    65: Boolean(data.requests.appointTrustee),
    68: Boolean(data.requests.additionalTrusts),
    69: Boolean(data.requests.otherSelected)
  };
  return { textFields, checkboxFields };
}

const PR1801_OVERLAY_TEXT_LABELS = {
  1: "County",
  2: "Decedent name in caption",
  3: "Decedent full name",
  4: "Caption supplement",
  6: "Case number",
  7: "Date of birth",
  8: "Date of death",
  9: "Domicile county",
  10: "Domicile state",
  11: "Last mailing address",
  12: "Applicant interest or relationship",
  15: "Other proceedings explanation",
  16: "Estimated probate property value",
  27: "Public benefits explanation",
  32: "Spouse or domestic partner name",
  42: "Will date",
  44: "Codicil dates",
  46: "Prior probate case number",
  50: "Personal representative named in will",
  51: "Proposed personal representative",
  52: "Trustee named in will",
  53: "Nominated trustee",
  55: "Proposed personal representative if no will",
  57: "Interested person name",
  58: "Interested person relationship",
  59: "Interested person address",
  60: "Interested person minor date of birth",
  62: "Other requested order",
  64: "Domiciliary letters issued to",
  66: "Trustee names",
  67: "Trust name",
  70: "Other request text",
  71: "Reserved/attachment reference",
  72: "Applicant signature name",
  73: "Applicant address",
  74: "Applicant email",
  75: "Applicant phone",
  76: "Applicant signature date",
  77: "Applicant bar number",
  78: "Preparer name",
  79: "Preparer address",
  80: "Preparer email",
  81: "Preparer phone",
  82: "Preparer bar number"
};

const PR1801_OVERLAY_CHECKBOX_LABELS = {
  5: "Amended application",
  13: "Other probate proceedings pending",
  14: "No other probate proceedings pending",
  17: "Decedent received Medical Assistance",
  18: "Decedent did not receive Medical Assistance",
  19: "Decedent received Family Care",
  20: "Decedent did not receive Family Care",
  21: "Decedent received Community Options Program benefits",
  22: "Decedent did not receive Community Options Program benefits",
  23: "Decedent received Chronic Disease Program benefits",
  24: "Decedent did not receive Chronic Disease Program benefits",
  25: "Decedent was patient/inmate of state or county institution",
  26: "Decedent was not patient/inmate of state or county institution",
  28: "Applicant lacks benefit information",
  29: "Spouse/domestic partner information see attached",
  30: "Spouse/domestic partner living",
  31: "Spouse/domestic partner deceased",
  33: "Decedent married/in domestic partnership at death",
  34: "Decedent divorced/partnership terminated",
  35: "Spouse/domestic partner received Community Options Program benefits",
  36: "Spouse/domestic partner did not receive Community Options Program benefits",
  37: "Spouse/domestic partner received Chronic Disease Program benefits",
  38: "Spouse/domestic partner did not receive Chronic Disease Program benefits",
  39: "Applicant lacks spouse/domestic partner benefit information",
  40: "Decedent left a will",
  41: "Will date supplied",
  43: "Codicils supplied",
  45: "Will filed with this court",
  47: "Will accompanies application",
  48: "Will probated elsewhere",
  49: "Will is en route",
  54: "Decedent died without a will",
  56: "Interested persons see attached",
  61: "Other requested order selected",
  63: "Issue domiciliary letters",
  65: "Appoint trustee",
  68: "Additional trusts",
  69: "Other requests"
};

const PR1801_OFFICIAL_TEMPLATE = {
  formNumber: "PR-1801",
  revision: "05/30/2024",
  localPath: "templates/PR-1801-official.pdf",
  sourceUrl: "https://www.wicourts.gov/formdisplay/PR-1801.pdf?formNumber=PR-1801&formType=Form&formatId=2&language=en",
  sourcePage: "https://www.wicourts.gov/forms1/circuit/ccform.jsp?Category=29&FormName=&FormNumber=&StatuteCite=&SubCat=Informal+Administration&beg_date=&end_date=",
  sha256: "C463AF3F5D06AEA0EB1696C86E7AA14E95C29C50F8673403B195736BC6882E49",
  verifiedDate: "2026-06-10",
  pageSize: { width: 612, height: 792, unit: "pt" },
  pages: 2,
  acroformFields: 0,
  note: "Official Wisconsin Courts PDF has no AcroForm fields; production filling requires coordinate overlays."
};

const PR1801_OFFICIAL_TEXT_COORDINATES = {
  1: { page: 1, x: 246.84, y: 744.24, width: 150.12, height: 10 },
  2: { page: 1, x: 46.8, y: 706.32, width: 237.6, height: 10 },
  3: { page: 1, x: 46.8, y: 676.32, width: 237.6, height: 10 },
  6: { page: 1, x: 364.56, y: 672.36, width: 76.2, height: 10 },
  7: { page: 1, x: 228.24, y: 630.24, width: 87.72, height: 10 },
  8: { page: 1, x: 402.0, y: 630.24, width: 84.96, height: 10 },
  9: { page: 1, x: 107.76, y: 618.24, width: 83.04, height: 10 },
  10: { page: 1, x: 268.08, y: 618.12, width: 24.96, height: 10 },
  11: { page: 1, x: 450.36, y: 618.24, width: 108.6, height: 10 },
  12: { page: 1, x: 190.08, y: 594.24, width: 368.88, height: 10 },
  15: { page: 1, x: 174.96, y: 558.24, width: 384, height: 10 },
  16: { page: 1, x: 441.0, y: 534.24, width: 31.44, height: 10 },
  27: { page: 1, x: 158.76, y: 426.24, width: 400.2, height: 10 },
  32: { page: 1, x: 282.48, y: 378.24, width: 276.48, height: 10 },
  42: { page: 1, x: 307.92, y: 287.76, width: 70.44, height: 10 },
  44: { page: 1, x: 360.12, y: 275.76, width: 68.28, height: 10 },
  46: { page: 1, x: 323.64, y: 211.32, width: 72.12, height: 10 },
  50: { page: 1, x: 123.96, y: 142.44, width: 435, height: 10 },
  51: { page: 1, x: 132.12, y: 122.52, width: 255.84, height: 10 },
  52: { page: 1, x: 148.92, y: 90.48, width: 410.04, height: 10 },
  53: { page: 1, x: 132.12, y: 78.48, width: 255.84, height: 10 },
  55: { page: 2, x: 132.12, y: 707.76, width: 255.84, height: 10 },
  57: { page: 2, x: 78.12, y: 633.96, width: 98.52, height: 10 },
  58: { page: 2, x: 176.64, y: 633.96, width: 121.08, height: 10 },
  59: { page: 2, x: 298.2, y: 633.96, width: 197.52, height: 10 },
  60: { page: 2, x: 496.2, y: 633.96, width: 80.52, height: 10 },
  62: { page: 2, x: 113.28, y: 555.36, width: 445.68, height: 10 },
  64: { page: 2, x: 245.4, y: 462.6, width: 313.56, height: 10 },
  66: { page: 2, x: 205.68, y: 414.6, width: 353.28, height: 10 },
  67: { page: 2, x: 113.28, y: 366.6, width: 445.68, height: 10 },
  70: { page: 2, x: 113.28, y: 366.6, width: 445.68, height: 10 },
  72: { page: 2, x: 314.52, y: 277.8, width: 220.56, height: 10 },
  73: { page: 2, x: 314.52, y: 255.72, width: 220.56, height: 10 },
  74: { page: 2, x: 314.52, y: 233.16, width: 110.28, height: 10 },
  75: { page: 2, x: 424.8, y: 233.16, width: 110.28, height: 10 },
  76: { page: 2, x: 314.52, y: 211.56, width: 110.28, height: 10 },
  77: { page: 2, x: 424.8, y: 211.56, width: 110.28, height: 10 },
  78: { page: 2, x: 42.12, y: 186.36, width: 266.76, height: 10 },
  79: { page: 2, x: 41.64, y: 163.32, width: 267.24, height: 10 },
  80: { page: 2, x: 41.64, y: 127.32, width: 267.24, height: 10 },
  81: { page: 2, x: 41.64, y: 100.32, width: 133.32, height: 10 },
  82: { page: 2, x: 175.44, y: 100.32, width: 133.44, height: 10 }
};

function pr1801PdfOverlayForField(type, fieldNumber) {
  const coordinate = type === "text" ? PR1801_OFFICIAL_TEXT_COORDINATES[fieldNumber] : null;
  if (!coordinate) {
    return {
      status: "coordinates_pending",
      page: null,
      x: null,
      y: null,
      width: null,
      height: null
    };
  }
  return {
    status: "official_pdf_coordinate_mapped",
    page: coordinate.page,
    x: coordinate.x,
    y: coordinate.y,
    width: coordinate.width,
    height: coordinate.height
  };
}

function pr1801OverlayFields(data = state) {
  const values = pr1801Values(data);
  const textEntries = Object.entries(values.textFields).map(([fieldNumber, value]) => ({
    canonicalKey: `pr1801_text_${fieldNumber}`,
    source: `textFields.${fieldNumber}`,
    label: PR1801_OVERLAY_TEXT_LABELS[fieldNumber] || `Text field ${fieldNumber}`,
    type: "text",
    value: cleanText(value),
    pdfOverlay: pr1801PdfOverlayForField("text", Number(fieldNumber))
  }));
  const checkboxEntries = Object.entries(values.checkboxFields).map(([fieldNumber, checked]) => ({
    canonicalKey: `pr1801_checkbox_${fieldNumber}`,
    source: `checkboxFields.${fieldNumber}`,
    label: PR1801_OVERLAY_CHECKBOX_LABELS[fieldNumber] || `Checkbox field ${fieldNumber}`,
    type: "checkbox",
    value: Boolean(checked),
    pdfOverlay: pr1801PdfOverlayForField("checkbox", Number(fieldNumber))
  }));
  return [...textEntries, ...checkboxEntries].sort((a, b) => {
    const aNumber = Number(a.source.split(".").at(-1));
    const bNumber = Number(b.source.split(".").at(-1));
    return aNumber - bNumber || a.type.localeCompare(b.type);
  });
}

function pr1801OverlayMap(data = state) {
  const fields = pr1801OverlayFields(data);
  const filledFields = fields.filter((field) => {
    if (field.type === "checkbox") return field.value === true;
    return hasValue(field.value);
  });
  return {
    formKey: "pr1801",
    formNumber: "PR-1801",
    formName: "Application for Informal Administration",
    generatedAt: new Date().toISOString(),
    officialTemplate: {
      ...PR1801_OFFICIAL_TEMPLATE,
      status: "official_pdf_downloaded",
      nextStep: "Review unmapped checkbox positions visually, generate a test filled PDF, and attorney-approve the field placements."
    },
    outputTarget: {
      publicUsers: "Print-ready official PDF after overlay coordinates are approved.",
      attorneys: "PDF eFiling copy after attorney/legal review, unless a county requires a different format."
    },
    qualityGate: {
      fieldMapStatus: "official_pdf_template_registered",
      coordinateStatus: fields.every((field) => field.pdfOverlay.status === "official_pdf_coordinate_mapped") ? "mapped" : "partial_text_coordinates_mapped",
      attorneyReviewStatus: legalReviewItemState("pr1801_mapping", data).status
    },
    summary: {
      totalMappedFields: fields.length,
      filledFields: filledFields.length,
      textFields: fields.filter((field) => field.type === "text").length,
      checkboxFields: fields.filter((field) => field.type === "checkbox").length,
      officialCoordinates: fields.filter((field) => field.pdfOverlay.status === "official_pdf_coordinate_mapped").length,
      pendingCoordinates: fields.filter((field) => field.pdfOverlay.status !== "official_pdf_coordinate_mapped").length
    },
    fields
  };
}

function pr1801OverlayReadmeText(data = state) {
  const map = pr1801OverlayMap(data);
  return [
    "PR-1801 Exact PDF Overlay Pilot",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    "What this is",
    "This file-map is the first production bridge from the current interview answers to an exact official PR-1801 PDF overlay.",
    "",
    "Current status",
    `Mapped fields: ${map.summary.totalMappedFields}`,
    `Fields with values in this case: ${map.summary.filledFields}`,
    `Official PDF template: ${map.officialTemplate.localPath}`,
    `Template revision: ${map.officialTemplate.revision}`,
    `Template SHA-256: ${map.officialTemplate.sha256}`,
    `Field coordinates mapped: ${map.summary.officialCoordinates}`,
    `Field coordinates pending: ${map.summary.pendingCoordinates}`,
    `Attorney/legal review: ${legalReviewStatusLabel(map.qualityGate.attorneyReviewStatus)}`,
    "",
    "Next production step",
    "Review unmapped checkbox coordinates visually, generate a test filled PDF, and replace the beta DOCX-only download with a signed official PDF filing copy after attorney review."
  ].join("\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function pr1801OverlayFieldsCsv(data = state) {
  const fields = pr1801OverlayFields(data);
  const header = ["canonicalKey", "source", "label", "type", "value", "page", "x", "y", "width", "height", "status"];
  const rows = fields.map((field) => [
    field.canonicalKey,
    field.source,
    field.label,
    field.type,
    field.type === "checkbox" ? (field.value ? "checked" : "") : field.value,
    field.pdfOverlay.page ?? "",
    field.pdfOverlay.x ?? "",
    field.pdfOverlay.y ?? "",
    field.pdfOverlay.width ?? "",
    field.pdfOverlay.height ?? "",
    field.pdfOverlay.status
  ]);
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function pr1801OverlayCoordinateChecklistText(data = state) {
  const map = pr1801OverlayMap(data);
  const filled = map.fields.filter((field) => field.type === "checkbox" ? field.value : hasValue(field.value));
  return [
    "PR-1801 Official PDF Coordinate Checklist",
    `Generated: ${documentDate(new Date().toISOString().slice(0, 10))}`,
    "",
    "Goal",
    "Use the current official PR-1801 PDF and this checklist to assign exact overlay coordinates without changing the court form.",
    "",
    "Required before production",
    "[ ] Confirm the official PR-1801 PDF version/date.",
    "[ ] Confirm page size and eFiling margin compatibility.",
    "[ ] Measure page/x/y/width/height for every mapped text field.",
    "[ ] Measure page/x/y/width/height for every checkbox mark.",
    "[ ] Fill a test PDF from the map and compare it visually against the official blank form.",
    "[ ] Attorney/legal reviewer approves field placement and missing-field handling.",
    "[ ] Add regression test comparing expected values to generated overlay map.",
    "",
    "Filled fields in this case",
    filled.map((field) => `- ${field.canonicalKey}: ${field.label}`).join("\n") || "- None currently filled."
  ].join("\n");
}

async function buildPr1801OverlayPilotZip(data = state) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const zip = new JSZip();
  zip.file("PR-1801-overlay-map.json", JSON.stringify(pr1801OverlayMap(data), null, 2));
  zip.file("PR-1801-overlay-fields.csv", pr1801OverlayFieldsCsv(data));
  zip.file("PR-1801-overlay-readme.txt", pr1801OverlayReadmeText(data));
  zip.file("PR-1801-coordinate-checklist.txt", pr1801OverlayCoordinateChecklistText(data));
  zip.file("official-form-integrity-manifest.txt", officialFormIntegrityManifestText(data));
  zip.file("official-template-vault-manifest.txt", officialTemplateVaultManifestText(data));
  zip.file("per-form-word-pdf-config.txt", efilingFormatConfigText(data));
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

function pr1801OverlayPilotHtml() {
  const map = pr1801OverlayMap();
  const reviewStatus = legalReviewItemState("pr1801_mapping").status;
  const stats = [
    [String(map.summary.totalMappedFields), "mapped fields", ""],
    [String(map.summary.filledFields), "filled now", ""],
    [String(map.summary.officialCoordinates), "coordinates", map.summary.pendingCoordinates ? "warn" : ""],
    [String(map.summary.pendingCoordinates), "pending", map.summary.pendingCoordinates ? "warn" : ""],
    [legalReviewStatusLabel(reviewStatus), "legal review", reviewStatus === "approved" ? "" : "warn"]
  ];
  return `
    <div class="pr1801-overlay-panel">
      <div class="row-heading">
        <div>
          <p class="eyebrow">PR-1801 production pilot</p>
          <h3>Exact PDF overlay foundation</h3>
          <p>The official PR-1801 PDF is registered and the main text-field coordinates are mapped. Checkbox coordinates still need visual approval before this becomes production PDF output.</p>
        </div>
        <div class="inline-actions">
          <button type="button" class="secondary" data-download-pr1801-overlay-map>Download map</button>
          <button type="button" class="secondary" data-download-pr1801-overlay-pilot>Download pilot kit</button>
        </div>
      </div>
      <div class="readiness-dashboard compact-dashboard">
        ${stats.map(([value, label, tone]) => `
          <div class="readiness-stat ${escapeAttr(tone)}">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitFieldChunks(xml) {
  const matches = [...xml.matchAll(/<w:fldChar w:fldCharType="begin"/g)];
  if (!matches.length) return [{ index: null, chunk: xml }];
  const parts = [];
  let cursor = 0;
  matches.forEach((match, offset) => {
    const index = offset + 1;
    const start = match.index;
    const endMarker = xml.indexOf('<w:fldChar w:fldCharType="end"/>', start);
    if (endMarker === -1) return;
    const endRun = xml.indexOf("</w:r>", endMarker);
    if (endRun === -1) return;
    const end = endRun + "</w:r>".length;
    if (start > cursor) parts.push({ index: null, chunk: xml.slice(cursor, start) });
    parts.push({ index, chunk: xml.slice(start, end) });
    cursor = end;
  });
  if (cursor < xml.length) parts.push({ index: null, chunk: xml.slice(cursor) });
  return parts;
}

function lastRunStart(xml, end) {
  let result = -1;
  const pattern = /<w:r(?:\s|>)/g;
  let match = pattern.exec(xml.slice(0, end));
  while (match) {
    result = match.index;
    match = pattern.exec(xml.slice(0, end));
  }
  return result;
}

function replaceFieldResult(chunk, value) {
  const safeValue = cleanText(value);
  const separate = chunk.indexOf('<w:fldChar w:fldCharType="separate"/>');
  const endMarker = chunk.lastIndexOf('<w:fldChar w:fldCharType="end"/>');
  if (separate === -1 || endMarker === -1) return chunk;
  let resultStart = chunk.indexOf("</w:r>", separate);
  const endRunStart = lastRunStart(chunk, endMarker);
  if (resultStart === -1 || endRunStart === -1) return chunk;
  resultStart += "</w:r>".length;
  const lines = safeValue ? safeValue.split(/\r?\n/) : [""];
  const content = lines.map((line, index) => {
    const prefix = index ? "<w:br/>" : "";
    return `${prefix}<w:t xml:space="preserve">${escapeXml(line)}</w:t>`;
  }).join("");
  const run = `<w:r><w:rPr><w:noProof/></w:rPr>${content}</w:r>`;
  return chunk.slice(0, resultStart) + run + chunk.slice(endRunStart);
}

function setCheckbox(chunk, checked) {
  if (!chunk.includes("<w:checkBox>")) return chunk;
  let updated = chunk.replace(/<w:checked(?:\s+w:val="[^"]*")?\s*\/>/g, "");
  updated = updated.replace(/<w:default w:val="[^"]*"\s*\/>/, `<w:default w:val="${checked ? 1 : 0}"/>`);
  if (checked) updated = updated.replace("</w:checkBox>", "<w:checked/></w:checkBox>");

  const glyph = checked ? "&#9745;" : "&#9744;";
  const separate = updated.indexOf('<w:fldChar w:fldCharType="separate"/>');
  const endMarker = updated.lastIndexOf('<w:fldChar w:fldCharType="end"/>');
  if (separate === -1 || endMarker === -1) return updated;
  let resultStart = updated.indexOf("</w:r>", separate);
  const endRunStart = lastRunStart(updated, endMarker);
  if (resultStart === -1 || endRunStart === -1) return updated;
  resultStart += "</w:r>".length;
  const run = `<w:r><w:rPr><w:noProof/></w:rPr><w:t>${glyph}</w:t></w:r>`;
  return updated.slice(0, resultStart) + run + updated.slice(endRunStart);
}

function attachmentParagraph(text, bold = false) {
  const boldXml = bold ? "<w:b/>" : "";
  return `<w:p><w:r><w:rPr>${boldXml}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function appendInterestedAttachment(xml, data) {
  if (data.interestedPersons.length <= 1) return xml;
  const rows = [attachmentParagraph("Attachment to PR-1801: Interested Persons", true)];
  data.interestedPersons.forEach((person, index) => {
    let line = `${index + 1}. ${cleanText(person.name) || "(name missing)"}; ${cleanText(compactInterestedRelationship(person)) || "(relationship missing)"}; ${cleanText(person.address) || "(address missing)"}`;
    if (cleanText(person.minorDateOfBirth)) line += `; minor date of birth: ${documentDate(person.minorDateOfBirth)}`;
    rows.push(attachmentParagraph(line));
  });
  const insertion = rows.join("");
  const sectIndex = xml.lastIndexOf("<w:sectPr");
  const bodyClose = xml.lastIndexOf("</w:body>");
  if (sectIndex !== -1 && sectIndex < bodyClose) {
    return xml.slice(0, sectIndex) + insertion + xml.slice(sectIndex);
  }
  return xml.replace("</w:body>", `${insertion}</w:body>`);
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function buildDocxFromTemplate(templateBase64, textFields, checkboxFields, appendXml) {
  const zip = await JSZip.loadAsync(base64ToUint8Array(templateBase64));
  let xml = await zip.file("word/document.xml").async("string");
  xml = splitFieldChunks(xml).map(({ index, chunk }) => {
    if (index === null) return chunk;
    if (chunk.includes("FORMCHECKBOX") && Object.prototype.hasOwnProperty.call(checkboxFields, index)) {
      return setCheckbox(chunk, checkboxFields[index]);
    }
    if ((chunk.includes("FORMTEXT") || chunk.includes("DOCPROPERTY")) && Object.prototype.hasOwnProperty.call(textFields, index)) {
      return replaceFieldResult(chunk, textFields[index]);
    }
    return chunk;
  }).join("");
  if (appendXml) xml = appendXml(xml);
  zip.file("word/document.xml", xml);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

async function buildPr1801Docx(data) {
  if (!window.JSZip || !window.PR1801_TEMPLATE_BASE64) {
    throw new Error("The local document template did not load.");
  }
  const zip = await JSZip.loadAsync(base64ToUint8Array(window.PR1801_TEMPLATE_BASE64));
  let xml = await zip.file("word/document.xml").async("string");
  const { textFields, checkboxFields } = pr1801Values(data);
  xml = splitFieldChunks(xml).map(({ index, chunk }) => {
    if (index === null) return chunk;
    if (chunk.includes("FORMCHECKBOX") && Object.prototype.hasOwnProperty.call(checkboxFields, index)) {
      return setCheckbox(chunk, checkboxFields[index]);
    }
    if ((chunk.includes("FORMTEXT") || chunk.includes("DOCPROPERTY")) && Object.prototype.hasOwnProperty.call(textFields, index)) {
      return replaceFieldResult(chunk, textFields[index]);
    }
    return chunk;
  }).join("");
  xml = appendInterestedAttachment(xml, data);
  zip.file("word/document.xml", xml);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function pr1803Values(data) {
  const willExists = data.will.exists === "yes";
  const codicils = data.will.hasCodicils === "yes" ? documentDate(data.will.codicilDates) : "";
  const signerDate = documentDate(data.waiver.signatureDate) || documentDate(data.applicant.signatureDate);
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    5: cleanText(data.estate.caseNumber),
    7: willExists ? documentDate(data.will.date) : "",
    8: willExists ? codicils : "",
    10: willExists ? documentDate(data.will.date) : "",
    11: willExists ? codicils : "",
    14: willExists ? documentDate(data.will.date) : "",
    15: willExists ? codicils : "",
    16: cleanText(data.pr.fullName),
    18: cleanText(data.waiver.otherText),
    75: cleanText(data.preparer.fullName),
    76: cleanText(data.preparer.address),
    77: cleanText(data.preparer.email),
    78: cleanText(data.preparer.phone),
    79: cleanText(data.preparer.barNumber)
  };

  const signerStarts = [19, 26, 33, 40, 47, 54, 61, 68];
  signerStarts.forEach((start, index) => {
    const signer = data.interestedPersons[index] || {};
    textFields[start] = "";
    textFields[start + 1] = cleanText(signer.name);
    textFields[start + 2] = cleanText(signer.address);
    textFields[start + 3] = cleanText(signer.email);
    textFields[start + 4] = cleanText(signer.phone);
    textFields[start + 5] = hasValue(signer.name) ? signerDate : "";
    textFields[start + 6] = cleanText(signer.barNumber);
  });

  const checkboxFields = {
    4: Boolean(data.estate.isAmended),
    6: willExists && Boolean(data.waiver.receivedWillCopy),
    9: willExists && Boolean(data.waiver.receivedBequestNotice),
    12: data.will.exists === "no",
    13: willExists && Boolean(data.waiver.consentToAdmitWill),
    17: Boolean(data.waiver.otherSelected)
  };
  return { textFields, checkboxFields };
}

function appendPr1803Attachment(xml, data) {
  if (data.interestedPersons.length <= 8) return xml;
  const rows = [
    attachmentParagraph("Attachment to PR-1803: Additional Waiver Signers", true),
    ...data.interestedPersons.slice(8).map((person, index) => {
      const number = index + 9;
      return attachmentParagraph(`${number}. ${cleanText(person.name) || "(name missing)"}; ${cleanText(person.address) || "(address missing)"}`);
    })
  ].join("");
  const sectIndex = xml.lastIndexOf("<w:sectPr");
  const bodyClose = xml.lastIndexOf("</w:body>");
  if (sectIndex !== -1 && sectIndex < bodyClose) {
    return xml.slice(0, sectIndex) + rows + xml.slice(sectIndex);
  }
  return xml.replace("</w:body>", `${rows}</w:body>`);
}

async function buildPr1803Docx(data) {
  if (!window.JSZip || !window.PR1803_TEMPLATE_BASE64) {
    throw new Error("The local PR-1803 template did not load.");
  }
  const review = validate1803(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1803Values(data);
  return buildDocxFromTemplate(window.PR1803_TEMPLATE_BASE64, textFields, checkboxFields, (xml) => appendPr1803Attachment(xml, data));
}

function dataWithSingleWaiverSigner(data, signer) {
  const copy = JSON.parse(JSON.stringify(data));
  copy.interestedPersons = [signer];
  return copy;
}

async function addPr1803WaiversToZip(zip, data, folder, slug) {
  if (data.waiver.signatureMode !== "individual") {
    await addBlobToZip(zip, folder, `04-PR-1803-${slug}.docx`, await buildPr1803Docx(data));
    return;
  }
  const signers = data.interestedPersons.filter(hasInterestedPersonContent);
  for (const [index, signer] of signers.entries()) {
    const signerSlug = cleanText(signer.name).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || `signer-${index + 1}`;
    const signerData = dataWithSingleWaiverSigner(data, signer);
    await addBlobToZip(zip, folder, `04-PR-1803-${slug}-${String(index + 1).padStart(2, "0")}-${signerSlug}.docx`, await buildPr1803Docx(signerData));
  }
}

async function buildPr1803IndividualWaiverZip(data) {
  if (!window.JSZip) throw new Error("The local ZIP library did not load.");
  const review = validate1803(data);
  if (review.blockers.length) throw new Error(review.blockers[0]);
  const signers = data.interestedPersons.filter(hasInterestedPersonContent);
  if (!signers.length) throw new Error("PR-1803 needs at least one interested person.");
  const zip = new JSZip();
  const slug = estateSlug();
  await addPr1803WaiversToZip(zip, data, "PR-1803-individual-waivers", slug);
  zip.file("read-me.txt", [
    "PR-1803 Separate Waiver Packet",
    `Estate: ${cleanText(data.decedent.fullName) || "(not set)"}`,
    `Signers: ${signers.length}`,
    "",
    "Each file contains one signer block for one interested person. Use this when mailing or emailing waivers separately."
  ].join("\n"));
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/zip",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function pr1804Values(data) {
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    6: cleanText(data.estate.caseNumber),
    7: documentDate(data.decedent.dateOfBirth),
    8: documentDate(data.decedent.dateOfDeath),
    9: cleanText(data.decedent.domicileCounty),
    10: cleanText(data.decedent.domicileState),
    11: cleanText(data.decedent.lastMailingAddress),
    12: documentDate(data.notice1804.claimDeadline),
    13: cleanText(data.notice1804.courthouseCounty) || cleanText(data.estate.county),
    14: cleanText(data.notice1804.courthouseAddress),
    15: cleanText(data.notice1804.room),
    16: cleanText(data.preparer.fullName),
    17: cleanText(data.preparer.address),
    18: cleanText(data.preparer.phone),
    19: cleanText(data.preparer.barNumber),
    20: cleanText(data.notice1804.newspaperName)
  };
  const checkboxFields = {
    4: Boolean(data.estate.isAmended)
  };
  return { textFields, checkboxFields };
}

async function buildPr1804Docx(data) {
  if (!window.JSZip || !window.PR1804_TEMPLATE_BASE64) {
    throw new Error("The local PR-1804 template did not load.");
  }
  const review = validate1804(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1804Values(data);
  return buildDocxFromTemplate(window.PR1804_TEMPLATE_BASE64, textFields, checkboxFields);
}

function pr1806Values(data) {
  const h = data.heirship;
  const hasDeceasedChildDetails = hasValue(h.children.deceasedChildDescendants);
  const hasDeceasedSiblingDetails = hasValue(h.siblings.deceasedSiblingDescendants);
  const hasGrandparentDetails = hasValue(h.grandparents.summary);
  const answerParents = h.spouse.exists === "no" && h.children.exists === "no";
  const answerSiblings = answerParents && h.parents.exists === "no";
  const answerGrandparents = answerSiblings && h.siblings.exists === "no";
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    7: cleanText(data.estate.caseNumber),
    8: cleanText(h.informant.name),
    9: cleanText(h.informant.address),
    10: compactRelationshipText(h.informant.relationship),
    13: h.spouse.exists === "yes" ? cleanText(h.spouse.name) : "",
    17: h.children.exists === "yes" ? childrenTextFromPeople(h.children.people) || cleanText(h.children.list) : "",
    18: "",
    20: hasDeceasedChildDetails ? "See attached" : "",
    21: "",
    22: "",
    25: h.children.allOfSurvivingSpouse === "no" ? cleanText(h.children.blendedDetails) : "",
    28: answerParents && h.parents.exists === "yes" ? cleanText(h.parents.names) : "",
    31: answerSiblings && h.siblings.exists === "yes" ? cleanText(h.siblings.names) : "",
    32: "",
    34: answerSiblings && hasDeceasedSiblingDetails ? "See attached" : "",
    35: "",
    36: "",
    38: "",
    39: "",
    40: "",
    41: "",
    42: answerGrandparents && hasGrandparentDetails ? cleanText(h.grandparents.summary) : "",
    43: "",
    46: h.survivorship120.exists === "yes" ? cleanText(h.survivorship120.details) : "",
    47: "",
    48: "",
    49: "",
    50: cleanText(h.informant.name),
    51: cleanText(h.informant.address),
    52: cleanText(data.applicant.email),
    53: cleanText(data.applicant.phone),
    54: documentDate(data.applicant.signatureDate),
    55: cleanText(data.applicant.barNumber),
    56: cleanText(data.preparer.fullName),
    57: cleanText(data.preparer.address),
    58: cleanText(data.preparer.email),
    59: cleanText(data.preparer.phone),
    60: cleanText(data.preparer.barNumber)
  };

  const checkboxFields = {
    4: Boolean(data.estate.isAmended),
    5: true,
    6: false,
    11: h.spouse.exists === "yes",
    12: h.spouse.exists === "no",
    14: h.children.exists === "yes",
    15: h.children.exists === "no",
    16: false,
    19: hasDeceasedChildDetails,
    23: h.children.allOfSurvivingSpouse === "yes",
    24: h.children.allOfSurvivingSpouse === "no",
    26: answerParents && h.parents.exists === "yes",
    27: answerParents && h.parents.exists === "no",
    29: answerSiblings && h.siblings.exists === "no",
    30: answerSiblings && h.siblings.exists === "yes",
    33: answerSiblings && hasDeceasedSiblingDetails,
    37: answerGrandparents && hasGrandparentDetails,
    44: h.survivorship120.exists === "no",
    45: h.survivorship120.exists === "yes"
  };
  return { textFields, checkboxFields };
}

function appendPr1806Attachment(xml, data) {
  const h = data.heirship;
  const rows = [];
  if (hasValue(h.children.deceasedChildDescendants)) {
    rows.push(`Descendants of deceased children: ${cleanText(h.children.deceasedChildDescendants)}`);
  }
  if (hasValue(h.siblings.deceasedSiblingDescendants)) {
    rows.push(`Descendants of deceased siblings: ${cleanText(h.siblings.deceasedSiblingDescendants)}`);
  }
  if (hasValue(h.grandparents.summary)) {
    rows.push(`Grandparents and descendants: ${cleanText(h.grandparents.summary)}`);
  }
  if (!rows.length) return xml;

  const paragraphs = [
    attachmentParagraph("Attachment to PR-1806: Additional Heirship Details", true),
    ...rows.map((row, index) => attachmentParagraph(`${index + 1}. ${row}`))
  ].join("");
  const sectIndex = xml.lastIndexOf("<w:sectPr");
  const bodyClose = xml.lastIndexOf("</w:body>");
  if (sectIndex !== -1 && sectIndex < bodyClose) {
    return xml.slice(0, sectIndex) + paragraphs + xml.slice(sectIndex);
  }
  return xml.replace("</w:body>", `${paragraphs}</w:body>`);
}

async function buildPr1806Docx(data) {
  if (!window.JSZip || !window.PR1806_TEMPLATE_BASE64) {
    throw new Error("The local PR-1806 template did not load.");
  }
  const zip = await JSZip.loadAsync(base64ToUint8Array(window.PR1806_TEMPLATE_BASE64));
  let xml = await zip.file("word/document.xml").async("string");
  const { textFields, checkboxFields } = pr1806Values(data);
  xml = splitFieldChunks(xml).map(({ index, chunk }) => {
    if (index === null) return chunk;
    if (chunk.includes("FORMCHECKBOX") && Object.prototype.hasOwnProperty.call(checkboxFields, index)) {
      return setCheckbox(chunk, checkboxFields[index]);
    }
    if ((chunk.includes("FORMTEXT") || chunk.includes("DOCPROPERTY")) && Object.prototype.hasOwnProperty.call(textFields, index)) {
      return replaceFieldResult(chunk, textFields[index]);
    }
    return chunk;
  }).join("");
  xml = appendPr1806Attachment(xml, data);
  zip.file("word/document.xml", xml);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function pr1807Values(data) {
  const isNonresident = data.pr.isWisconsinResident === "no";
  const agent = data.pr.residentAgent || {};
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: cleanText(data.decedent.fullName),
    4: "",
    9: cleanText(data.estate.caseNumber),
    13: isNonresident ? cleanText(agent.name) : "",
    14: "",
    15: cleanText(data.pr.fullName),
    16: cleanText(data.pr.address),
    17: cleanText(data.pr.email),
    18: cleanText(data.pr.phone),
    19: documentDate(data.pr.signatureDate),
    20: cleanText(data.pr.barNumber),
    21: cleanText(data.preparer.fullName),
    22: "",
    23: isNonresident ? cleanText(agent.name) : "",
    24: isNonresident ? cleanText(agent.address) : "",
    25: isNonresident ? cleanText(agent.email) : "",
    26: isNonresident ? cleanText(agent.phone) : "",
    27: isNonresident ? documentDate(agent.signatureDate) : "",
    28: isNonresident ? cleanText(agent.barNumber) : "",
    29: cleanText(data.preparer.address),
    30: cleanText(data.preparer.email),
    31: cleanText(data.preparer.phone),
    32: cleanText(data.preparer.barNumber)
  };
  const checkboxFields = {
    5: Boolean(data.estate.isAmended),
    6: true,
    8: false,
    10: true,
    11: false,
    12: isNonresident
  };
  return { textFields, checkboxFields };
}

async function buildPr1807Docx(data) {
  if (!window.JSZip || !window.PR1807_TEMPLATE_BASE64) {
    throw new Error("The local PR-1807 template did not load.");
  }
  const zip = await JSZip.loadAsync(base64ToUint8Array(window.PR1807_TEMPLATE_BASE64));
  let xml = await zip.file("word/document.xml").async("string");
  const { textFields, checkboxFields } = pr1807Values(data);
  xml = splitFieldChunks(xml).map(({ index, chunk }) => {
    if (index === null) return chunk;
    if (chunk.includes("FORMCHECKBOX") && Object.prototype.hasOwnProperty.call(checkboxFields, index)) {
      return setCheckbox(chunk, checkboxFields[index]);
    }
    if ((chunk.includes("FORMTEXT") || chunk.includes("DOCPROPERTY")) && Object.prototype.hasOwnProperty.call(textFields, index)) {
      return replaceFieldResult(chunk, textFields[index]);
    }
    return chunk;
  }).join("");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function pr1805Values(data) {
  const unknownSelected = data.opening.unknownInterestedPersonsStatus === "some_unknown";
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    5: cleanText(data.estate.caseNumber),
    6: documentDate(data.decedent.dateOfBirth),
    7: documentDate(data.decedent.dateOfDeath),
    8: cleanText(data.decedent.domicileCounty),
    9: cleanText(data.decedent.domicileState),
    10: cleanText(data.decedent.lastMailingAddress),
    11: cleanText(data.notice1805.courthouseCounty) || cleanText(data.estate.county),
    12: cleanText(data.notice1805.courthouseAddress),
    13: cleanText(data.notice1805.room),
    14: cleanText(data.notice1805.registrarName),
    15: documentDate(data.notice1805.hearingDate),
    16: cleanText(data.notice1805.hearingTime),
    17: documentDate(data.notice1805.claimDeadline),
    18: cleanText(data.notice1805.courthouseCounty) || cleanText(data.estate.county),
    19: cleanText(data.notice1805.courthouseAddress),
    20: cleanText(data.notice1805.room),
    22: unknownSelected ? cleanText(data.notice1805.unknownInterestedPersons) : "",
    23: cleanText(data.notice1805.accommodationPhone),
    25: cleanText(data.preparer.fullName),
    26: cleanText(data.preparer.address),
    27: cleanText(data.preparer.phone),
    28: cleanText(data.preparer.barNumber),
    29: cleanText(data.notice1805.newspaperName)
  };
  const checkboxFields = {
    4: Boolean(data.estate.isAmended),
    21: unknownSelected,
    24: Boolean(data.notice1805.checkExactTime)
  };
  return { textFields, checkboxFields };
}

async function buildPr1805Docx(data) {
  if (!window.JSZip || !window.PR1805_TEMPLATE_BASE64) {
    throw new Error("The local PR-1805 template did not load.");
  }
  const decision = openingPathDecision(data);
  if (decision.key !== "notice") {
    throw new Error(decision.detail);
  }
  const zip = await JSZip.loadAsync(base64ToUint8Array(window.PR1805_TEMPLATE_BASE64));
  let xml = await zip.file("word/document.xml").async("string");
  const { textFields, checkboxFields } = pr1805Values(data);
  xml = splitFieldChunks(xml).map(({ index, chunk }) => {
    if (index === null) return chunk;
    if (chunk.includes("FORMCHECKBOX") && Object.prototype.hasOwnProperty.call(checkboxFields, index)) {
      return setCheckbox(chunk, checkboxFields[index]);
    }
    if ((chunk.includes("FORMTEXT") || chunk.includes("DOCPROPERTY")) && Object.prototype.hasOwnProperty.call(textFields, index)) {
      return replaceFieldResult(chunk, textFields[index]);
    }
    return chunk;
  }).join("");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}

function pr1817Values(data) {
  const recipients = data.interestedPersons.filter((person) => hasValue(person.name) || hasValue(person.address));
  const useAttachment = recipients.length > 1;
  const firstRecipient = recipients[0] || {};
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    6: cleanText(data.estate.caseNumber),
    7: cleanText(data.service.declarantName),
    8: cleanText(data.service.declarantCity),
    9: cleanText(data.service.declarantState),
    10: documentDate(data.service.serviceDate),
    11: cleanText(data.service.documentsProvided),
    15: useAttachment ? "See attached" : cleanText(firstRecipient.name),
    16: useAttachment ? "" : cleanText(firstRecipient.address),
    17: useAttachment ? "" : cleanText(data.service.method),
    18: "",
    19: cleanText(data.service.declarantName),
    20: cleanText(data.service.declarantAddress),
    21: cleanText(data.service.declarantEmail),
    22: cleanText(data.service.declarantPhone),
    23: documentDate(data.service.signatureDate),
    24: cleanText(data.service.declarantBarNumber),
    25: cleanText(data.preparer.fullName),
    26: cleanText(data.preparer.address),
    27: cleanText(data.preparer.email),
    28: cleanText(data.preparer.phone),
    29: cleanText(data.preparer.barNumber)
  };
  const checkboxFields = {
    4: Boolean(data.estate.isAmended),
    12: Boolean(data.service.originalOnFile),
    13: Boolean(data.service.copyAttached),
    14: useAttachment
  };
  return { textFields, checkboxFields };
}

function appendPr1817Attachment(xml, data) {
  const recipients = data.interestedPersons.filter((person) => hasValue(person.name) || hasValue(person.address));
  if (recipients.length <= 1) return xml;
  const rows = [
    attachmentParagraph("Attachment to PR-1817: Persons Served", true),
    ...recipients.map((person, index) => {
      const name = cleanText(person.name) || "(name missing)";
      const address = cleanText(person.address) || "(address missing)";
      const method = cleanText(data.service.method) || "(service type missing)";
      return attachmentParagraph(`${index + 1}. ${name}; ${address}; ${method}`);
    })
  ].join("");
  const sectIndex = xml.lastIndexOf("<w:sectPr");
  const bodyClose = xml.lastIndexOf("</w:body>");
  if (sectIndex !== -1 && sectIndex < bodyClose) {
    return xml.slice(0, sectIndex) + rows + xml.slice(sectIndex);
  }
  return xml.replace("</w:body>", `${rows}</w:body>`);
}

async function buildPr1817Docx(data) {
  if (!window.JSZip || !window.PR1817_TEMPLATE_BASE64) {
    throw new Error("The local PR-1817 template did not load.");
  }
  const review = validate1817(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1817Values(data);
  return buildDocxFromTemplate(window.PR1817_TEMPLATE_BASE64, textFields, checkboxFields, (xml) => appendPr1817Attachment(xml, data));
}

function pr1808Values(data) {
  const willExists = data.will.exists === "yes";
  const codicils = data.will.hasCodicils === "yes" ? documentDate(data.will.codicilDates) : "";
  const prBondType = data.courtDrafts.prBondType || "none";
  const trusteeBondType = data.courtDrafts.trusteeBondType || "none";
  const noticeGiven = openingPathDecision(data).key === "notice";
  const noticeWaived = openingPathDecision(data).key === "waiver";
  const prName = cleanText(data.pr.fullName) || cleanText(data.requests.domiciliaryLettersTo);
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: "",
    5: cleanText(data.estate.caseNumber),
    8: documentDate(data.decedent.dateOfDeath),
    11: willExists ? documentDate(data.will.date) : "",
    12: willExists ? codicils : "",
    16: prName,
    17: cleanText(data.pr.address),
    21: cleanText(data.courtDrafts.otherFindingsText),
    23: willExists ? documentDate(data.will.date) : "",
    25: willExists ? codicils : "",
    26: cleanText(data.requests.domiciliaryLettersTo) || prName,
    31: prBondType === "surety" ? moneyText(data.courtDrafts.prBondAmount) : "",
    33: cleanText(data.requests.trusteeNames),
    34: cleanText(data.requests.trustName),
    39: trusteeBondType === "surety" ? moneyText(data.courtDrafts.trusteeBondAmount) : "",
    42: cleanText(data.courtDrafts.otherOrdersText),
    43: cleanText(data.preparer.fullName),
    44: cleanText(data.preparer.address),
    45: cleanText(data.preparer.phone),
    46: cleanText(data.preparer.barNumber)
  };
  const checkboxFields = {
    4: Boolean(data.estate.isAmended),
    6: noticeGiven,
    7: noticeWaived,
    9: data.will.exists === "no",
    10: willExists,
    13: willExists && data.will.location === "court",
    14: willExists && data.will.location === "accompanies",
    15: willExists && data.will.location === "probated_elsewhere",
    18: data.otherProceedings.status === "not_pending",
    19: data.otherProceedings.status === "pending",
    20: Boolean(data.courtDrafts.otherFindingsSelected),
    22: willExists,
    24: willExists && Boolean(codicils),
    27: prBondType === "none",
    28: prBondType === "signature" || prBondType === "surety",
    29: prBondType === "signature",
    30: prBondType === "surety",
    32: Boolean(data.requests.appointTrustee),
    35: Boolean(data.requests.appointTrustee) && trusteeBondType === "none",
    36: Boolean(data.requests.appointTrustee) && (trusteeBondType === "signature" || trusteeBondType === "surety"),
    37: Boolean(data.requests.appointTrustee) && trusteeBondType === "signature",
    38: Boolean(data.requests.appointTrustee) && trusteeBondType === "surety",
    40: Boolean(data.requests.additionalTrusts),
    41: Boolean(data.courtDrafts.otherOrdersSelected)
  };
  return { textFields, checkboxFields };
}

async function buildPr1808Docx(data) {
  if (!window.JSZip || !window.PR1808_TEMPLATE_BASE64) {
    throw new Error("The local PR-1808 template did not load.");
  }
  const review = validate1808(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1808Values(data);
  return buildDocxFromTemplate(window.PR1808_TEMPLATE_BASE64, textFields, checkboxFields);
}

function pr1810Values(data) {
  const prName = cleanText(data.requests.domiciliaryLettersTo) || cleanText(data.pr.fullName);
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: cleanText(data.decedent.fullName),
    4: "",
    8: cleanText(data.estate.caseNumber),
    9: "",
    10: prName,
    11: cleanText(data.pr.address),
    12: cleanText(data.pr.email) || cleanText(data.pr.phone),
    13: documentDate(data.decedent.dateOfBirth),
    14: documentDate(data.decedent.dateOfDeath),
    15: cleanText(data.decedent.domicileCounty),
    16: cleanText(data.decedent.domicileState),
    17: cleanText(data.courtDrafts.lettersOtherText),
    18: cleanText(data.preparer.fullName),
    19: cleanText(data.preparer.address),
    20: cleanText(data.preparer.phone),
    21: cleanText(data.preparer.barNumber)
  };
  const checkboxFields = {
    5: Boolean(data.estate.isAmended),
    6: true,
    7: false
  };
  return { textFields, checkboxFields };
}

async function buildPr1810Docx(data) {
  if (!window.JSZip || !window.PR1810_TEMPLATE_BASE64) {
    throw new Error("The local PR-1810 template did not load.");
  }
  const review = validate1810(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1810Values(data);
  return buildDocxFromTemplate(window.PR1810_TEMPLATE_BASE64, textFields, checkboxFields);
}

function inventoryScheduleDescription(item) {
  const parts = [];
  if (hasValue(item.category)) parts.push(cleanText(item.category));
  if (hasValue(item.description)) parts.push(cleanText(item.description));
  if (numberValue(item.encumbrance)) parts.push(`Encumbrance/lien: $${moneyText(item.encumbrance)}`);
  if (item.marital) parts.push("Marital property interest");
  if (hasValue(item.notes)) parts.push(cleanText(item.notes));
  return parts.join("; ");
}

function pr1811Values(data) {
  const items = data.inventory.items.filter((item) => hasValue(item.description) || hasValue(item.value));
  const totalValue = items.reduce((sum, item) => sum + numberValue(item.value), 0);
  const totalEncumbrance = items.reduce((sum, item) => sum + numberValue(item.encumbrance), 0);
  const textFields = {
    1: cleanText(data.estate.county).toUpperCase(),
    2: cleanText(data.decedent.fullName),
    3: cleanText(data.decedent.fullName),
    4: "",
    7: "",
    9: "",
    10: cleanText(data.estate.caseNumber),
    11: documentDate(data.decedent.dateOfDeath),
    12: moneyText(totalValue),
    13: moneyText(totalEncumbrance),
    14: moneyText(Math.max(totalValue - totalEncumbrance, 0)),
    15: "",
    16: cleanText(data.pr.fullName),
    17: cleanText(data.pr.address),
    18: cleanText(data.pr.email),
    19: cleanText(data.pr.phone),
    20: documentDate(data.inventory.signatureDate) || documentDate(data.pr.signatureDate),
    21: cleanText(data.pr.barNumber),
    22: "",
    23: "",
    24: "",
    25: "",
    26: "",
    27: "",
    28: "",
    29: cleanText(data.preparer.fullName),
    30: cleanText(data.preparer.address),
    31: cleanText(data.preparer.email),
    32: cleanText(data.preparer.phone),
    33: cleanText(data.preparer.barNumber)
  };
  for (let index = 0; index < 29; index += 1) {
    const item = items[index] || {};
    textFields[34 + index] = item.description ? String(index + 1) : "";
    textFields[63 + index] = inventoryScheduleDescription(item);
    textFields[92 + index] = hasValue(item.value) ? moneyText(item.value) : "";
  }
  const checkboxFields = {
    5: Boolean(data.estate.isAmended),
    6: true,
    8: false
  };
  return { textFields, checkboxFields };
}

function appendPr1811Attachment(xml, data) {
  const items = data.inventory.items.filter((item) => hasValue(item.description) || hasValue(item.value));
  if (items.length <= 29) return xml;
  const rows = [
    attachmentParagraph("Attachment to PR-1811: Additional Inventory Items", true),
    ...items.slice(29).map((item, index) => {
      const number = index + 30;
      const value = hasValue(item.value) ? `$${moneyText(item.value)}` : "(value missing)";
      return attachmentParagraph(`${number}. ${inventoryScheduleDescription(item) || "(description missing)"} | Value: ${value}`);
    })
  ].join("");
  const sectIndex = xml.lastIndexOf("<w:sectPr");
  const bodyClose = xml.lastIndexOf("</w:body>");
  if (sectIndex !== -1 && sectIndex < bodyClose) {
    return xml.slice(0, sectIndex) + rows + xml.slice(sectIndex);
  }
  return xml.replace("</w:body>", `${rows}</w:body>`);
}

async function buildPr1811Docx(data) {
  if (!window.JSZip || !window.PR1811_TEMPLATE_BASE64) {
    throw new Error("The local PR-1811 template did not load.");
  }
  const review = validate1811(data);
  if (review.blockers.length) {
    throw new Error(review.blockers[0]);
  }
  const { textFields, checkboxFields } = pr1811Values(data);
  return buildDocxFromTemplate(window.PR1811_TEMPLATE_BASE64, textFields, checkboxFields, (xml) => appendPr1811Attachment(xml, data));
}

function formFilename(formNumber) {
  return `${formNumber}-${estateSlug()}.docx`;
}

function resolveButtonTarget(buttonTarget, fallbackId = "") {
  if (typeof buttonTarget === "string") return document.getElementById(buttonTarget);
  if (buttonTarget?.currentTarget) return buttonTarget.currentTarget;
  if (buttonTarget?.target?.closest) return buttonTarget.target.closest("button");
  if (buttonTarget?.nodeType === 1) return buttonTarget;
  return fallbackId ? document.getElementById(fallbackId) : null;
}

function setDownloadArea(message, tone = "") {
  document.querySelectorAll("#downloadArea, #formsDownloadArea, #guidedDownloadArea").forEach((downloadArea) => {
    downloadArea.className = `download-area ${tone}`;
    downloadArea.textContent = message || "";
  });
}

function showDownloadLink(blob, filename) {
  const url = URL.createObjectURL(blob);
  let firstLink = null;
  document.querySelectorAll("#downloadArea, #formsDownloadArea, #guidedDownloadArea").forEach((downloadArea) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.textContent = `Download ${filename}`;
    const message = document.createElement("p");
    message.textContent = `Started download for ${filename}.`;
    downloadArea.className = "download-area success";
    downloadArea.replaceChildren(message, link);
    if (!firstLink) firstLink = link;
  });
  firstLink?.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function downloadPr1801OverlayMap() {
  const blob = new Blob([JSON.stringify(pr1801OverlayMap(state), null, 2)], { type: "application/json" });
  showDownloadLink(blob, `pr1801-overlay-map-${estateSlug()}.json`);
}

async function downloadPr1801OverlayPilot(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget);
  const defaultText = button?.textContent || "Download pilot kit";
  if (button) {
    button.disabled = true;
    button.textContent = "Building kit...";
  }
  try {
    const blob = await buildPr1801OverlayPilotZip(state);
    recordAnalyticsEvent("overlay_pilot_downloaded", { formKey: "pr1801" });
    recordAuditLog("download_overlay_pilot", { formKey: "pr1801" });
    showDownloadLink(blob, `pr1801-overlay-pilot-${estateSlug()}.zip`);
  } catch (error) {
    setDownloadArea(error.message || "The PR-1801 overlay pilot kit could not be created.", "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = defaultText;
    }
  }
}

async function generateDocx(buttonTarget, defaultText, filename, buildFn, blockers = []) {
  const button = resolveButtonTarget(buttonTarget);
  if (!button) return;
  if (!requireFinalDocumentUnlock(filename)) return;
  button.disabled = true;
  button.textContent = "Generating...";
  setDownloadArea("", "");
  try {
    if (blockers.length) {
      throw new Error(`Before generating ${filename}: ${blockers[0]}`);
    }
    const blob = await buildFn(state);
    const formKey = (filename.match(/PR-\d{4}|transfer|opening/i) || ["form"])[0].toLowerCase();
    state.matter.lastGeneratedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_generated", { formKey });
    recordAuditLog("generate_packet", { formKey, templateVersion: "prototype-docx" });
    showDownloadLink(blob, filename);
    state.matter.lastDownloadedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_downloaded", { formKey });
    recordAuditLog("download_packet", { formKey });
  } catch (error) {
    setDownloadArea(error.message || "The form could not be generated.", "error");
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
    renderReview();
  }
}

async function generatePr1801(button) {
  return generateDocx(button || "generateBtn", "Generate PR-1801", formFilename("PR-1801"), buildPr1801Docx, validate().blockers);
}

async function generatePr1803(button) {
  if (state.waiver.signatureMode === "individual") {
    return generateDocx(button || "generate1803Btn", "Generate PR-1803", `PR-1803-individual-waivers-${estateSlug()}.zip`, buildPr1803IndividualWaiverZip, validate1803().blockers);
  }
  return generateDocx(button || "generate1803Btn", "Generate PR-1803", formFilename("PR-1803"), buildPr1803Docx, validate1803().blockers);
}

async function generatePr1804(button) {
  return generateDocx(button || "generate1804Btn", "Generate PR-1804", formFilename("PR-1804"), buildPr1804Docx, validate1804().blockers);
}

async function generatePr1806(button) {
  return generateDocx(button || "generate1806Btn", "Generate PR-1806", formFilename("PR-1806"), buildPr1806Docx, validate1806().blockers);
}

async function generatePr1807(button) {
  return generateDocx(button || "generate1807Btn", "Generate PR-1807", formFilename("PR-1807"), buildPr1807Docx, validate1807().blockers);
}

async function generatePr1808(button) {
  return generateDocx(button || "generate1808Btn", "Generate PR-1808", formFilename("PR-1808"), buildPr1808Docx, validate1808().blockers);
}

async function generatePr1810(button) {
  return generateDocx(button || "generate1810Btn", "Generate PR-1810", formFilename("PR-1810"), buildPr1810Docx, validate1810().blockers);
}

async function generatePr1811(button) {
  return generateDocx(button || "generate1811Btn", "Generate PR-1811", formFilename("PR-1811"), buildPr1811Docx, validate1811().blockers);
}

async function generatePr1805(button) {
  return generateDocx(button || "generate1805Btn", "Generate PR-1805", formFilename("PR-1805"), buildPr1805Docx, validate1805().blockers);
}

async function generatePr1817(button) {
  return generateDocx(button || "generate1817Btn", "Generate PR-1817", formFilename("PR-1817"), buildPr1817Docx, validate1817().blockers);
}

async function exportOpeningPacket(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget, "exportPacketBtn");
  if (!button) return;
  if (!requireFinalDocumentUnlock("the opening packet ZIP")) return;
  const defaultText = button.textContent || "Export opening packet ZIP";
  button.disabled = true;
  button.textContent = "Building ZIP...";
  setDownloadArea("", "");
  try {
    const blob = await buildOpeningPacketZip(state);
    const filename = `opening-packet-${estateSlug()}.zip`;
    state.matter.lastGeneratedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_generated", { formKey: "opening_packet" });
    recordAuditLog("generate_packet", { formKey: "opening_packet", templateVersion: "prototype-docx" });
    showDownloadLink(blob, filename);
    state.matter.lastDownloadedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_downloaded", { formKey: "opening_packet" });
    recordAuditLog("download_packet", { formKey: "opening_packet" });
  } catch (error) {
    setDownloadArea(error.message || "The opening packet could not be exported.", "error");
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
    renderReview();
  }
}

async function exportTransferAffidavitPackage(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget);
  if (!button) return;
  if (!requireProductUnlock("transfer_affidavit", "the Transfer by Affidavit package")) return;
  const defaultText = button.textContent || "Download Transfer by Affidavit package";
  button.disabled = true;
  button.textContent = "Building package...";
  setDownloadArea("", "");
  try {
    const blob = await buildTransferAffidavitZip(state);
    state.matter.lastGeneratedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_generated", { formKey: "transfer_affidavit" });
    recordAuditLog("generate_packet", { formKey: "transfer_affidavit", templateVersion: "prototype-docx" });
    showDownloadLink(blob, `transfer-by-affidavit-package-${estateSlug()}.zip`);
    state.matter.lastDownloadedAt = new Date().toISOString();
    recordAnalyticsEvent("packet_downloaded", { formKey: "transfer_affidavit" });
    recordAuditLog("download_packet", { formKey: "transfer_affidavit" });
  } catch (error) {
    setDownloadArea(error.message || "The Transfer by Affidavit package could not be exported.", "error");
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
    renderReview();
    renderInterviewStatus();
  }
}

async function exportInformationSummary(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget);
  if (!button) return;
  const defaultText = button.textContent || "Download my information summary";
  button.disabled = true;
  button.textContent = "Building summary...";
  setDownloadArea("", "");
  try {
    const blob = await buildInformationSummaryZip(state);
    state.matter.lastGeneratedAt = new Date().toISOString();
    recordAnalyticsEvent("handoff_summary_downloaded", { formKey: "information_summary" });
    recordAuditLog("export_handoff_summary", { formKey: "information_summary" });
    showDownloadLink(blob, `information-summary-${estateSlug()}.zip`);
    state.matter.lastDownloadedAt = new Date().toISOString();
    saveState();
  } catch (error) {
    setDownloadArea(error.message || "The information summary could not be exported.", "error");
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
    renderReview();
    renderInterviewStatus();
  }
}

async function exportAttorneyHandoff(buttonTarget) {
  const button = resolveButtonTarget(buttonTarget);
  if (!button) return;
  const defaultText = button.textContent || "Download attorney handoff ZIP";
  button.disabled = true;
  button.textContent = "Building handoff...";
  setDownloadArea("", "");
  try {
    state.attorneyHandoff.generatedAt = new Date().toISOString();
    saveState();
    const blob = await buildAttorneyHandoffZip(state);
    state.matter.lastGeneratedAt = new Date().toISOString();
    recordAnalyticsEvent("attorney_handoff_requested", { formKey: "attorney_handoff" });
    recordAuditLog("share_with_attorney", { formKey: "attorney_handoff" });
    showDownloadLink(blob, `attorney-handoff-${estateSlug()}.zip`);
    state.matter.lastDownloadedAt = new Date().toISOString();
    saveState();
  } catch (error) {
    setDownloadArea(error.message || "The attorney handoff package could not be exported.", "error");
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
    renderReview();
    renderInterviewStatus();
  }
}

function renderAll() {
  ensurePlatformIdentity(state, { persist: false });
  syncApplicantToPr();
  syncCountyDefaultsFromCounty();
  renderFields();
  renderHeirshipChildren();
  renderWillBeneficiaries();
  renderInterestedPersons();
  renderInterestedSuggestions();
  renderInventoryItems();
  renderTaskTracker();
  renderReview();
  renderInterview();
  renderViewMode();
  renderFormsView();
}

if (typeof document !== "undefined") {
  document.getElementById("addPersonBtn").addEventListener("click", addPerson);
  document.getElementById("addAllSuggestedInterestedBtn").addEventListener("click", addAllInterestedPersonSuggestions);
  document.getElementById("addWillBeneficiaryBtn").addEventListener("click", addWillBeneficiary);
  document.getElementById("addInventoryBtn").addEventListener("click", addInventoryItem);
  document.getElementById("copyApplicantBtn").addEventListener("click", copyApplicantToPreparer);
  document.getElementById("loadCountyLibraryBtn").addEventListener("click", loadCountyLibraryFromButton);
  document.getElementById("applyCountyDefaultsBtn").addEventListener("click", applyCountyDefaultsFromButton);
  document.getElementById("saveCaseBtn").addEventListener("click", saveCaseFile);
  document.getElementById("loadCaseBtn").addEventListener("click", loadCaseFile);
  document.getElementById("caseFileInput").addEventListener("change", importCaseFile);
  document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("generateBtn").addEventListener("click", generatePr1801);
  document.getElementById("generate1803Btn").addEventListener("click", generatePr1803);
  document.getElementById("generate1804Btn").addEventListener("click", generatePr1804);
  document.getElementById("generate1806Btn").addEventListener("click", generatePr1806);
  document.getElementById("generate1807Btn").addEventListener("click", generatePr1807);
  document.getElementById("generate1808Btn").addEventListener("click", generatePr1808);
  document.getElementById("generate1810Btn").addEventListener("click", generatePr1810);
  document.getElementById("generate1811Btn").addEventListener("click", generatePr1811);
  document.getElementById("generate1805Btn").addEventListener("click", generatePr1805);
  document.getElementById("generate1817Btn").addEventListener("click", generatePr1817);
  document.getElementById("exportPacketBtn").addEventListener("click", exportOpeningPacket);

  bindModeControls();
  bindInterviewControls();
  bindSteps();
  bindFields();
  renderAll();
}

if (typeof module !== "undefined") {
  module.exports = {
    buildPr1801Docx,
    buildPr1803Docx,
    buildPr1804Docx,
    buildPr1805Docx,
    buildPr1806Docx,
    buildPr1807Docx,
    buildPr1808Docx,
    buildPr1810Docx,
    buildPr1811Docx,
    buildPr1817Docx,
    buildOpeningPacketZip,
    buildTransferAffidavitDocx,
    buildTransferAffidavitZip,
    buildInformationSummaryZip,
    buildBetaTesterPackageZip,
    buildPr1801OverlayPilotZip,
    validateTransferAffidavit,
    buildAttorneyHandoffZip,
    informationSummaryText,
    attorneyHandoffSummaryText,
    betaTesterInstructionsText,
    betaKnownLimitationsText,
    betaFeedbackPromptsText,
    betaTesterChecklistText,
    betaIssueQueueText,
    scenarioSuiteSummaryText,
    efilingFormatConfigText,
    signatureTrackingSummary,
    signatureTrackingText,
    secureDeliveryManifestText,
    productionLaunchHandoffText,
    createSecureDeliveryRecord,
    officialTemplateVaultManifestText,
    attorneyBetaReviewSummary,
    attorneyBetaReviewText,
    pr1801OverlayFieldsCsv,
    pr1801OverlayCoordinateChecklistText,
    legalLogicLockStatus,
    legalLogicLockText,
    formDualOutputRule,
    formFormatConfig,
    PR1801_OFFICIAL_TEMPLATE,
    publicCopyGuardResults,
    supportBoundaryResponse,
    matterRedactedSnapshot,
    redactedMatterRecords,
    persistMatterCheckpoint,
    platformFoundationStatus,
    probatePathDecision,
    testScenarios,
    evaluateTestScenario,
    emptyState,
    mergeDeep,
    pr1801Values,
    pr1803Values,
    pr1804Values,
    pr1805Values,
    pr1806Values,
    pr1807Values,
    pr1808Values,
    pr1810Values,
    pr1811Values,
    pr1817Values
  };
}
