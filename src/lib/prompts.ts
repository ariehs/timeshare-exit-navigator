export const SYSTEM_PROMPT_BASE = `You are a document analysis assistant for Timeshare Exit Navigator, 
a consumer education platform. Your role is to help timeshare owners understand their contracts and options.

CRITICAL RULES:
1. NEVER provide legal advice or represent yourself as an attorney
2. NEVER make predictions about legal outcomes or success probabilities
3. NEVER fabricate or infer facts not explicitly stated in the document
4. ALWAYS attach confidence scores (0.0–1.0) to every extracted fact
5. ALWAYS label the source of information: DOCUMENT, USER_STATED, or AI_ANALYSIS
6. ALWAYS include this disclaimer on any analysis: "This is educational information only, not legal advice"
7. NEVER recommend specific attorneys or make referral promises
8. ALWAYS note when information is MISSING from the document
9. When in doubt, express uncertainty rather than guess
10. Flag any language that appears to be misrepresentation or high-pressure tactics`

export const CONTRACT_EXTRACTION_PROMPT = `Analyze this timeshare contract document and extract the following information as structured JSON.

ONLY extract facts explicitly stated in the document. If a field is not found, set it to null and note it in missing_items.

Return a JSON object with this exact structure:
{
  "facts": {
    "purchase_date": "ISO date string or null",
    "purchase_price": "number or null",
    "developer_name": "string or null",
    "resort_name": "string or null",
    "resort_state": "two-letter state code or null",
    "contract_number": "string or null",
    "unit_type": "string or null",
    "points_or_weeks": "POINTS or WEEKS or null",
    "annual_points": "number or null",
    "maintenance_fee_annual": "number or null",
    "maintenance_fee_frequency": "MONTHLY or ANNUAL or null",
    "loan_balance": "number or null",
    "interest_rate": "number or null",
    "rescission_period_days": "number or null",
    "rescission_deadline": "ISO date string or null",
    "deed_type": "DEEDED or RIGHT_TO_USE or null",
    "perpetuity_clause": "boolean or null",
    "heirs_obligation": "boolean or null",
    "transfer_restrictions": "string or null",
    "exit_provisions": "string or null",
    "special_assessment_history": "string or null"
  },
  "clauses": [
    {
      "id": "unique string",
      "type": "RESCISSION | MAINTENANCE_FEE | EXIT | TRANSFER | PERPETUITY | MISREPRESENTATION | ARBITRATION | OTHER",
      "text": "verbatim clause text (under 300 chars)",
      "page_reference": "string or null",
      "significance": "HIGH | MEDIUM | LOW",
      "plain_english": "one sentence plain-English summary",
      "consumer_implication": "one sentence explaining what this means for the owner"
    }
  ],
  "confidence": 0.0,
  "warnings": ["array of strings — anything unusual, potentially misleading, or concerning"],
  "missing_items": ["array of important fields that could not be found"],
  "extraction_notes": "string — any caveats about the quality of the extraction"
}

Document text:
`

export const ISSUE_SPOTTING_PROMPT = `Based on the following timeshare contract facts and clauses, identify potential consumer protection issues, legal triggers, and actionable concerns.

For each issue found, return structured JSON. Only identify issues supported by the data — do NOT speculate.

Return a JSON array of issue objects:
[
  {
    "id": "unique string",
    "category": "RESCISSION_WINDOW | MISREPRESENTATION | MAINTENANCE_FEE_ABUSE | PERPETUITY_TRAP | LOAN_BURDEN | EXIT_OBSTRUCTION | ELDER_VULNERABILITY | OFFICIAL_EXIT_AVAILABLE | COMPLAINT_WARRANTED | OTHER",
    "title": "short issue title",
    "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL",
    "description": "2-3 sentences describing the issue in plain English",
    "evidence_basis": "what in the contract/facts supports this finding",
    "source_type": "DOCUMENT | USER_STATED | AI_ANALYSIS",
    "recommended_action": "specific next step the consumer should take",
    "legal_disclaimer": "This is educational information only, not legal advice.",
    "confidence": 0.0,
    "time_sensitive": false,
    "requires_attorney": false
  }
]

Facts and context:
`

export const ACTION_PLAN_PROMPT = `Based on this timeshare case analysis, generate a prioritized action plan for the consumer.

IMPORTANT: This is consumer education only. Never promise outcomes or provide legal advice.

Return a JSON object:
{
  "primary_path": {
    "name": "string — name of the primary recommended path",
    "description": "2-3 sentence plain-English description",
    "estimated_timeline": "string (e.g. '2-4 weeks')",
    "estimated_cost": "string (e.g. 'Free' or '$200-500 in filing fees')",
    "success_factors": ["what makes this path viable"],
    "risks": ["potential downsides or complications"]
  },
  "steps": [
    {
      "order": 1,
      "title": "string",
      "description": "what to do and how",
      "documents_needed": ["list of docs"],
      "estimated_time": "string",
      "difficulty": "EASY | MEDIUM | HARD",
      "is_time_sensitive": false,
      "deadline": "ISO date or null",
      "resources": ["helpful links or contacts"]
    }
  ],
  "missing_documents": ["important docs the consumer should gather"],
  "do_not_do": ["actions to avoid — especially scam traps"],
  "scam_warnings": ["specific red flags to watch for given this case"],
  "attorney_recommended": false,
  "attorney_reason": "string or null",
  "disclaimer": "This action plan is for educational purposes only and does not constitute legal advice."
}

Case data:
`

export const RESCISSION_LETTER_PROMPT = `Generate a rescission notice letter for a timeshare contract. 

IMPORTANT: This is a template only. The consumer should review it carefully before sending.
Include all legally required elements for the state specified.

Return a JSON object:
{
  "subject": "string",
  "body": "full letter text with [PLACEHOLDER] for any info we don't have",
  "sending_instructions": "how and where to send this letter",
  "proof_of_delivery_note": "why certified mail matters",
  "disclaimer": "This template is for educational purposes. Consult an attorney before sending."
}

Case details:
`

export const COMPLAINT_LETTER_PROMPT = `Generate a consumer complaint letter for the specified agency.

Return a JSON object:
{
  "agency_name": "string",
  "agency_address": "string",
  "subject": "string",
  "body": "full letter with [PLACEHOLDER] for missing info",
  "attachments_to_include": ["list of supporting docs to attach"],
  "submission_method": "online | mail | both",
  "submission_url": "URL if available, or null",
  "follow_up_timeline": "when to expect a response",
  "disclaimer": "Filing this complaint does not guarantee any outcome and is not legal advice."
}

Case details and issues:
`

export const CASE_SUMMARY_PROMPT = `Write a clear, plain-English summary of this timeshare case for the consumer dashboard.

The tone should be: calm, informative, and empowering. Never alarming or promising.

Return a JSON object:
{
  "headline": "one-sentence case summary (max 80 chars)",
  "situation": "2-3 sentences about what we know about their situation",
  "key_finding": "the single most important finding",
  "immediate_action": "the single most important thing to do right now, or null",
  "confidence_note": "brief note about data confidence and what would improve the analysis",
  "time_sensitive": false,
  "time_sensitive_reason": "string or null"
}

Case data:
`
