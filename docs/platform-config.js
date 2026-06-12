window.PROBATE_PLATFORM_CONFIG = {
  environment: "prototype-local",
  dataModelVersion: "platform-foundation-2026-06-09",
  launch: {
    mode: "controlled_beta",
    publicPaidLaunchAllowed: false,
    betaPriceLabel: "$0 beta",
    targetInformalProbatePrice: "$499 target launch price",
    targetTransferAffidavitPrice: "$149 target launch price"
  },
  company: {
    companyName: "Wisconsin Probate Forms",
    companyLegalName: "[Company Name TBD]",
    supportEmail: "support@example.com",
    isLawFirm: false,
    providesLegalAdvice: false,
    founderLawFirmReferralEnabled: false,
    attorneyHandoffEnabled: false,
    attorneyDirectoryEnabled: false
  },
  featureFlags: {
    attorneyHandoff: false,
    attorneyDirectory: false,
    affiliatedLawFirmReview: false,
    sponsoredAttorneyListings: false,
    hostedAccounts: false,
    productionPayments: false,
    secureDocumentDelivery: false
  },
  storage: {
    adapter: "localPrototype",
    plannedAdapter: "secureServerDatabase",
    encryptionAtRestRequired: true,
    auditLogsRequired: true,
    consentLogsRequired: true,
    dataExportRequestSupportRequired: true,
    deletionRequestSupportRequired: true,
    sensitiveDataPolicy: "Do not collect Social Security numbers, full bank account numbers, or unrelated financial records unless specifically required by a future production workflow."
  },
  auditActions: [
    "save_matter",
    "load_matter",
    "generate_packet",
    "download_packet",
    "export_handoff_summary",
    "checkout_completed",
    "delete_matter_request",
    "data_export_request"
  ]
};
