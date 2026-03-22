// ============================================================
// TIMESHARE EXIT NAVIGATOR — Core Types
// ============================================================

export type CaseStatus =
  | 'intake'
  | 'documents_pending'
  | 'analyzing'
  | 'plan_ready'
  | 'in_progress'
  | 'escalated'
  | 'closed'
  | 'archived';

export type ContractType = 'deeded' | 'points' | 'right_to_use' | 'unknown';

export type IssueCategory =
  | 'rescission_timing'
  | 'misrepresentation_resale'
  | 'misrepresentation_rental'
  | 'pressure_tactics'
  | 'hidden_fees'
  | 'availability_mismatch'
  | 'financing_burden'
  | 'hardship'
  | 'oral_promises_contradiction'
  | 'incomplete_documents'
  | 'denied_benefits'
  | 'other';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type LetterType =
  | 'rescission_notice'
  | 'hardship_request'
  | 'developer_contact'
  | 'complaint_dbpr'
  | 'complaint_ag'
  | 'complaint_cfpb'
  | 'complaint_ftc'
  | 'attorney_summary'
  | 'cease_desist'
  | 'other';

export type ExitPath =
  | 'rescission'
  | 'official_exit'
  | 'hardship_program'
  | 'complaint_escalation'
  | 'attorney_review'
  | 'resale'
  | 'low_likelihood';

// ============================================================
// INTAKE FORM
// ============================================================

export interface IntakeFormData {
  // Step 1: Developer & Resort
  developerBrandId?: string;
  developerNameManual?: string;
  resortId?: string;
  resortNameManual?: string;

  // Step 2: Contract Details
  contractDate?: string;
  signingLocationCity?: string;
  signingLocationState?: string;
  governingLawState?: string;
  contractType?: ContractType;
  pointsOwned?: number;

  // Step 3: Financial
  purchasePrice?: number;
  financingInvolved?: boolean;
  loanBalance?: number;
  interestRate?: number;
  monthlyPayment?: number;
  annualMaintenanceFee?: number;
  maintenanceFeeCurrent?: boolean;
  totalPaidToDate?: number;

  // Step 4: Usage
  usageHistory?: string;
  yearsOwned?: number;
  timesUsed?: number;

  // Step 5: Dissatisfaction
  dissatisfactionReasons?: string[];
  dissatisfactionDetails?: string;

  // Step 6: Sales Experience
  salesRepPromises?: string;
  salesPressureTactics?: boolean;
  presentationDurationHours?: number;
  offeredGiftsIncentives?: boolean;

  // Step 7: Hardship
  hardshipFactors?: string[];
  hardshipDetails?: string;

  // Step 8: Prior Actions
  alreadyContactedDeveloper?: boolean;
  developerResponse?: string;
  priorExitCompanyContact?: boolean;
  priorExitCompanyDetails?: string;
  priorExitCompanyPaid?: boolean;
  priorExitCompanyAmount?: number;
}

// ============================================================
// EXTRACTION
// ============================================================

export interface ExtractedFact {
  id: string;
  factKey: string;
  factLabel: string;
  factValue: string | null;
  sourceSnippet: string | null;
  sourcePage: number | null;
  confidence: number; // 0.0 - 1.0
  extractionMethod: 'regex' | 'llm' | 'manual' | 'computed';
  needsReview: boolean;
  factCategory: string;
}

export interface ExtractionResult {
  documentId: string;
  facts: ExtractedFact[];
  clauses: ContractClause[];
  rawText: string;
  confidence: number;
  warnings: string[];
  missingItems: string[];
}

export interface ContractClause {
  id: string;
  clauseType: string;
  clauseText: string;
  clauseSummary: string;
  pageNumber?: number;
  isFlagged: boolean;
  flagReason?: string;
  confidence: number;
}

// ============================================================
// ISSUE FLAGS
// ============================================================

export interface IssueFlag {
  id: string;
  issueCode: string;
  issueCategory: IssueCategory;
  issueTitle: string;
  issueDescription: string;
  severity: IssueSeverity;
  evidenceBasis: string;
  sourceType: 'document' | 'user_stated' | 'computed' | 'rules_engine';
  legalDisclaimer?: string;
}

// ============================================================
// ACTION PLAN
// ============================================================

export interface ActionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  actionType: 'send_letter' | 'gather_document' | 'contact_developer' |
              'file_complaint' | 'consult_attorney' | 'wait' | 'review';
  deadline?: string;
  urgency: 'immediate' | 'this_week' | 'this_month' | 'when_ready';
  isCompleted: boolean;
  relatedLetterType?: LetterType;
  instructions?: string[];
  warnings?: string[];
}

export interface ActionPlan {
  id: string;
  caseId: string;
  primaryPath: ExitPath;
  summary: string;
  steps: ActionStep[];
  missingDocuments: string[];
  urgentItems: string[];
  warnings: string[];
  generatedAt: string;
}

// ============================================================
// SCORING
// ============================================================

export interface ActionabilityScore {
  total: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // For display clarity
  label: string; // e.g. "Strong Position", "Limited Options"
  breakdown: ScoreFactor[];
  explanation: string;
  primaryPath: ExitPath;
  recommendedPaths: ExitPath[];
  criticalWarnings: string[];
}

export interface ScoreFactor {
  factorKey: string;
  factorLabel: string;
  score: number; // 0-100 for this factor
  weight: number; // weight in final score
  contribution: number; // weight × score
  explanation: string;
  status: 'positive' | 'neutral' | 'negative' | 'unknown';
}

// ============================================================
// RULES ENGINE
// ============================================================

export interface RulesEngineInput {
  caseData: Partial<Case>;
  extractedFacts: ExtractedFact[];
  issueFlags: IssueFlag[];
  stateRules?: StateRule;
  officialPrograms?: OfficialExitProgram[];
}

export interface RulesEngineOutput {
  recommendedPaths: { path: ExitPath; rationale: string; urgency: string }[];
  requiredNextActions: string[];
  deadlines: { description: string; date?: string; isUrgent: boolean }[];
  missingEvidence: string[];
  escalationOrder: string[];
  warnings: string[];
  caveats: string[];
  triggerAttorneyReferral: boolean;
  attorneyReferralReasons: string[];
}

// ============================================================
// DATABASE ENTITIES (simplified for frontend)
// ============================================================

export interface Case {
  id: string;
  userId: string;
  caseName: string;
  status: CaseStatus;
  developerName?: string;
  resortName?: string;
  contractDate?: string;
  governingLawState?: string;
  contractType?: ContractType;
  purchasePrice?: number;
  financingInvolved?: boolean;
  loanBalance?: number;
  annualMaintenanceFee?: number;
  actionabilityScore?: number;
  actionabilityScoreBreakdown?: ActionabilityScore;
  recommendedPrimaryPath?: ExitPath;
  rescissionWindowOpen?: boolean;
  rescissionDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedDocument {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  uploadStatus: 'pending' | 'scanning' | 'scanned' | 'extracting' | 'extracted' | 'failed';
  ocrCompleted: boolean;
  pageCount?: number;
  uploadedAt: string;
}

export interface StateRule {
  stateCode: string;
  stateName: string;
  rescissionWindowDays: number;
  rescissionStatute: string;
  rescissionNotes: string;
  complaintAgencyPrimary: string;
  complaintAgencyUrl: string;
  complaintAgencyPhone: string;
  agOfficeUrl: string;
  additionalProtections: Record<string, unknown>;
}

export interface OfficialExitProgram {
  id: string;
  developerBrandId: string;
  programName: string;
  programType: string;
  eligibilityCriteria: Record<string, unknown>;
  applicationUrl?: string;
  contactPhone?: string;
  estimatedTimelineDays?: number;
  feesInvolved: boolean;
  feeDescription?: string;
  successRateNote?: string;
}
