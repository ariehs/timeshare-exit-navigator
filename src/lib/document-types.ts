// ─── Document Type Registry ──────────────────────────────────────────────────
// Each type defines what facts it can unlock, confidence ceiling, and UI metadata

export type DocumentTypeKey =
  | 'PURCHASE_CONTRACT'
  | 'PUBLIC_OFFERING_STATEMENT'
  | 'DEED'
  | 'MEMBERSHIP_CERTIFICATE'
  | 'WELCOME_LETTER'
  | 'MAINTENANCE_FEE_STATEMENT'
  | 'LOAN_STATEMENT'
  | 'PROPERTY_TAX_BILL'
  | 'BANK_STATEMENTS'
  | 'SALES_MATERIALS'
  | 'DEVELOPER_CORRESPONDENCE'
  | 'UPGRADE_CONTRACT'
  | 'EXIT_COMPANY_CONTRACT'
  | 'DENIAL_LETTER'
  | 'ATTORNEY_CORRESPONDENCE'
  | 'OTHER'

export interface DocumentTypeConfig {
  key: DocumentTypeKey
  label: string
  shortLabel: string
  icon: string
  description: string
  examplesOf: string[]
  /** Which case facts this doc can populate */
  unlocksFields: string[]
  /** Max confidence score this doc type can yield (contract = 1.0, bank stmt = 0.6) */
  confidenceCeiling: number
  /** Which analysis paths this doc strengthens */
  strengthensPaths: string[]
  /** Warning to show user if this is their primary doc */
  limitationNote?: string
  category: 'CONTRACT' | 'FINANCIAL' | 'CORRESPONDENCE' | 'LEGAL'
}

export const DOCUMENT_TYPES: Record<DocumentTypeKey, DocumentTypeConfig> = {
  PURCHASE_CONTRACT: {
    key: 'PURCHASE_CONTRACT',
    label: 'Original Purchase Contract',
    shortLabel: 'Purchase Contract',
    icon: '📄',
    description: 'The main timeshare purchase agreement you signed',
    examplesOf: ['Vacation ownership agreement', 'Purchase and sale agreement', 'Timeshare contract'],
    unlocksFields: ['purchase_date', 'purchase_price', 'developer_name', 'resort_name', 'resort_state',
      'contract_number', 'points_or_weeks', 'annual_points', 'rescission_period_days',
      'rescission_deadline', 'deed_type', 'perpetuity_clause', 'heirs_obligation',
      'exit_provisions', 'transfer_restrictions', 'interest_rate', 'loan_balance'],
    confidenceCeiling: 1.0,
    strengthensPaths: ['RESCISSION', 'OFFICIAL_EXIT', 'HARDSHIP', 'COMPLAINT'],
    category: 'CONTRACT',
  },

  PUBLIC_OFFERING_STATEMENT: {
    key: 'PUBLIC_OFFERING_STATEMENT',
    label: 'Public Offering Statement (POS)',
    shortLabel: 'POS / Disclosure',
    icon: '📋',
    description: 'Developer-issued disclosure document required by law. Contains all material terms.',
    examplesOf: ['Public offering statement', 'Disclosure document', 'Resort disclosure'],
    unlocksFields: ['developer_name', 'resort_name', 'resort_state', 'rescission_period_days',
      'maintenance_fee_annual', 'exit_provisions', 'perpetuity_clause', 'transfer_restrictions'],
    confidenceCeiling: 0.95,
    strengthensPaths: ['RESCISSION', 'COMPLAINT', 'OFFICIAL_EXIT'],
    limitationNote: 'Strong supplement to the contract — almost as useful for key terms.',
    category: 'CONTRACT',
  },

  DEED: {
    key: 'DEED',
    label: 'Deed or Title Document',
    shortLabel: 'Deed / Title',
    icon: '🏛️',
    description: 'Recorded deed showing property ownership and description',
    examplesOf: ['Warranty deed', 'Timeshare deed', 'Vacation ownership deed', 'Title transfer'],
    unlocksFields: ['developer_name', 'resort_name', 'resort_state', 'deed_type',
      'perpetuity_clause', 'heirs_obligation', 'purchase_date'],
    confidenceCeiling: 0.9,
    strengthensPaths: ['OFFICIAL_EXIT', 'HARDSHIP'],
    limitationNote: 'Good for confirming ownership and deed type. Missing fee and financial details.',
    category: 'CONTRACT',
  },

  MEMBERSHIP_CERTIFICATE: {
    key: 'MEMBERSHIP_CERTIFICATE',
    label: 'Membership Certificate',
    shortLabel: 'Membership Cert',
    icon: '🎫',
    description: 'Points-based membership certificate issued after purchase',
    examplesOf: ['Vacation club membership', 'Points certificate', 'Member agreement'],
    unlocksFields: ['developer_name', 'resort_name', 'annual_points', 'contract_number',
      'points_or_weeks', 'purchase_date'],
    confidenceCeiling: 0.8,
    strengthensPaths: ['OFFICIAL_EXIT'],
    limitationNote: 'Confirms membership details. Limited financial and legal term data.',
    category: 'CONTRACT',
  },

  WELCOME_LETTER: {
    key: 'WELCOME_LETTER',
    label: 'Welcome Letter / Confirmation Packet',
    shortLabel: 'Welcome Letter',
    icon: '✉️',
    description: 'Post-purchase welcome letter or owner confirmation from the developer',
    examplesOf: ['New owner welcome packet', 'Confirmation of purchase letter', 'Owner welcome kit'],
    unlocksFields: ['developer_name', 'resort_name', 'contract_number', 'purchase_date',
      'annual_points', 'purchase_price'],
    confidenceCeiling: 0.75,
    strengthensPaths: ['OFFICIAL_EXIT'],
    limitationNote: 'Useful for confirming key details. Missing legal terms and financial specifics.',
    category: 'CORRESPONDENCE',
  },

  MAINTENANCE_FEE_STATEMENT: {
    key: 'MAINTENANCE_FEE_STATEMENT',
    label: 'Maintenance Fee Statement',
    shortLabel: 'Fee Statement',
    icon: '💳',
    description: 'Annual or monthly maintenance fee bill or account statement',
    examplesOf: ['Annual assessment statement', 'HOA fee statement', 'Maintenance fee invoice',
      'Special assessment notice'],
    unlocksFields: ['maintenance_fee_annual', 'maintenance_fee_status', 'developer_name',
      'resort_name', 'contract_number', 'special_assessment_history'],
    confidenceCeiling: 0.85,
    strengthensPaths: ['OFFICIAL_EXIT', 'HARDSHIP', 'COMPLAINT'],
    limitationNote: 'Excellent for fee history and current status. No contract or loan terms.',
    category: 'FINANCIAL',
  },

  LOAN_STATEMENT: {
    key: 'LOAN_STATEMENT',
    label: 'Loan or Mortgage Statement',
    shortLabel: 'Loan Statement',
    icon: '🏦',
    description: 'Timeshare loan statement showing balance, rate, and lender',
    examplesOf: ['Loan statement', 'Mortgage statement', 'Financing account statement',
      'Payoff letter'],
    unlocksFields: ['loan_balance', 'interest_rate', 'developer_name', 'contract_number'],
    confidenceCeiling: 0.9,
    strengthensPaths: ['OFFICIAL_EXIT', 'HARDSHIP', 'COMPLAINT'],
    limitationNote: 'Critical for deed-back eligibility. Confirms exact payoff amount.',
    category: 'FINANCIAL',
  },

  PROPERTY_TAX_BILL: {
    key: 'PROPERTY_TAX_BILL',
    label: 'Property Tax Bill',
    shortLabel: 'Tax Bill',
    icon: '🧾',
    description: 'County property tax bill for the timeshare unit',
    examplesOf: ['Property tax statement', 'County tax bill', 'Annual tax notice'],
    unlocksFields: ['resort_state', 'resort_name', 'deed_type', 'purchase_date'],
    confidenceCeiling: 0.7,
    strengthensPaths: ['OFFICIAL_EXIT'],
    limitationNote: 'Confirms deeded ownership and location. Limited to basic property facts.',
    category: 'FINANCIAL',
  },

  BANK_STATEMENTS: {
    key: 'BANK_STATEMENTS',
    label: 'Bank / Credit Card Statements',
    shortLabel: 'Bank Statements',
    icon: '💰',
    description: 'Statements showing payment history for fees, loans, or purchase charges',
    examplesOf: ['Bank statements', 'Credit card statements showing timeshare charges',
      'Payment history printout'],
    unlocksFields: ['maintenance_fee_annual', 'maintenance_fee_status', 'loan_balance',
      'purchase_price', 'special_assessment_history'],
    confidenceCeiling: 0.65,
    strengthensPaths: ['COMPLAINT', 'HARDSHIP'],
    limitationNote: 'Good evidence of payment history and fee escalation. Not a substitute for contract.',
    category: 'FINANCIAL',
  },

  SALES_MATERIALS: {
    key: 'SALES_MATERIALS',
    label: 'Sales Presentation Materials',
    shortLabel: 'Sales Materials',
    icon: '📊',
    description: 'Brochures, handouts, or printed promises from the sales presentation',
    examplesOf: ['Sales brochure', 'Presentation handout', 'Rental income projections',
      'Resale value estimates', '"Gift" offer letter'],
    unlocksFields: [],
    confidenceCeiling: 0.8,
    strengthensPaths: ['COMPLAINT'],
    limitationNote: 'Powerful for misrepresentation claims. No contract facts, but critical evidence.',
    category: 'CORRESPONDENCE',
  },

  DEVELOPER_CORRESPONDENCE: {
    key: 'DEVELOPER_CORRESPONDENCE',
    label: 'Developer Correspondence',
    shortLabel: 'Developer Letters',
    icon: '📬',
    description: 'Emails or letters exchanged with the developer or management company',
    examplesOf: ['Emails with developer', 'Exit request denial letter', 'Fee dispute correspondence',
      'Customer service responses'],
    unlocksFields: ['developer_name', 'contract_number', 'maintenance_fee_status'],
    confidenceCeiling: 0.7,
    strengthensPaths: ['COMPLAINT', 'OFFICIAL_EXIT'],
    limitationNote: 'Valuable evidence of developer responses and exit attempt history.',
    category: 'CORRESPONDENCE',
  },

  UPGRADE_CONTRACT: {
    key: 'UPGRADE_CONTRACT',
    label: 'Upgrade / Reload Contract',
    shortLabel: 'Upgrade Contract',
    icon: '📝',
    description: 'A subsequent purchase or upgrade contract from the same developer',
    examplesOf: ['Points upgrade agreement', 'Reload contract', 'Add-on purchase agreement'],
    unlocksFields: ['purchase_date', 'purchase_price', 'annual_points', 'contract_number',
      'loan_balance', 'interest_rate', 'rescission_period_days'],
    confidenceCeiling: 1.0,
    strengthensPaths: ['RESCISSION', 'COMPLAINT', 'OFFICIAL_EXIT'],
    limitationNote: 'Each upgrade is a separate contract — may have its own rescission period.',
    category: 'CONTRACT',
  },

  EXIT_COMPANY_CONTRACT: {
    key: 'EXIT_COMPANY_CONTRACT',
    label: 'Prior Exit Company Contract',
    shortLabel: 'Exit Co. Contract',
    icon: '⚠️',
    description: 'Contract with a third-party exit company you previously hired',
    examplesOf: ['Exit company agreement', 'Cancellation service contract', 'Timeshare relief agreement'],
    unlocksFields: [],
    confidenceCeiling: 0.9,
    strengthensPaths: ['COMPLAINT'],
    limitationNote: 'Critical evidence if you were scammed. Enables FTC/AG fraud complaint.',
    category: 'LEGAL',
  },

  DENIAL_LETTER: {
    key: 'DENIAL_LETTER',
    label: 'Exit or Hardship Denial Letter',
    shortLabel: 'Denial Letter',
    icon: '🚫',
    description: 'A letter from the developer denying your exit or hardship request',
    examplesOf: ['Deed-back denial', 'Hardship request denial', 'Exit program denial'],
    unlocksFields: ['developer_name', 'contract_number'],
    confidenceCeiling: 0.85,
    strengthensPaths: ['COMPLAINT', 'HARDSHIP'],
    limitationNote: 'Proves prior good-faith attempt to exit. Strengthens complaint filing.',
    category: 'CORRESPONDENCE',
  },

  ATTORNEY_CORRESPONDENCE: {
    key: 'ATTORNEY_CORRESPONDENCE',
    label: 'Prior Attorney Correspondence',
    shortLabel: 'Attorney Letters',
    icon: '⚖️',
    description: 'Letters or emails from a prior attorney regarding this timeshare',
    examplesOf: ['Demand letter', 'Attorney cease and desist', 'Legal representation letter'],
    unlocksFields: ['developer_name', 'contract_number', 'resort_state'],
    confidenceCeiling: 0.8,
    strengthensPaths: ['COMPLAINT'],
    limitationNote: 'Shows prior legal action. May affect current options.',
    category: 'LEGAL',
  },

  OTHER: {
    key: 'OTHER',
    label: 'Other Document',
    shortLabel: 'Other',
    icon: '📎',
    description: 'Any other document related to your timeshare',
    examplesOf: ['Any other relevant document'],
    unlocksFields: [],
    confidenceCeiling: 0.5,
    strengthensPaths: [],
    limitationNote: 'We\'ll do our best to extract relevant information.',
    category: 'CORRESPONDENCE',
  },
}

// Grouped for UI display
export const DOCUMENT_TYPE_GROUPS = [
  {
    label: 'Contract Documents',
    description: 'Strongest evidence — extract all key legal terms',
    types: ['PURCHASE_CONTRACT', 'PUBLIC_OFFERING_STATEMENT', 'DEED', 'MEMBERSHIP_CERTIFICATE', 'WELCOME_LETTER', 'UPGRADE_CONTRACT'] as DocumentTypeKey[],
  },
  {
    label: 'Financial Documents',
    description: 'Fee history, loan balance, payment records',
    types: ['MAINTENANCE_FEE_STATEMENT', 'LOAN_STATEMENT', 'PROPERTY_TAX_BILL', 'BANK_STATEMENTS'] as DocumentTypeKey[],
  },
  {
    label: 'Correspondence & Evidence',
    description: 'Supports misrepresentation and complaint paths',
    types: ['SALES_MATERIALS', 'DEVELOPER_CORRESPONDENCE', 'DENIAL_LETTER', 'ATTORNEY_CORRESPONDENCE', 'EXIT_COMPANY_CONTRACT'] as DocumentTypeKey[],
  },
  {
    label: 'Other',
    types: ['OTHER'] as DocumentTypeKey[],
  },
]

/** Returns minimum docs needed to run a useful analysis */
export function getDocumentSufficiency(uploadedTypes: DocumentTypeKey[]): {
  sufficient: boolean
  score: number
  missing: string[]
  message: string
} {
  const hasContract = uploadedTypes.some(t =>
    ['PURCHASE_CONTRACT', 'PUBLIC_OFFERING_STATEMENT', 'DEED', 'UPGRADE_CONTRACT'].includes(t)
  )
  const hasFinancial = uploadedTypes.some(t =>
    ['MAINTENANCE_FEE_STATEMENT', 'LOAN_STATEMENT', 'BANK_STATEMENTS'].includes(t)
  )
  const hasCorrespondence = uploadedTypes.some(t =>
    ['DEVELOPER_CORRESPONDENCE', 'SALES_MATERIALS', 'DENIAL_LETTER'].includes(t)
  )

  const score = (hasContract ? 60 : 0) + (hasFinancial ? 25 : 0) + (hasCorrespondence ? 15 : 0)
  const missing = []
  if (!hasContract) missing.push('A contract or disclosure document (most important)')
  if (!hasFinancial) missing.push('A fee statement or loan statement')

  return {
    sufficient: score >= 25, // financial alone is enough to start
    score,
    missing,
    message: hasContract
      ? 'Good — contract documents enable full analysis'
      : hasFinancial
        ? 'Partial analysis possible from financial docs. Add a contract for full results.'
        : 'Upload at least one document to begin analysis',
  }
}
