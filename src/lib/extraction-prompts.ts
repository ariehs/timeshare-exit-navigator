import { DocumentTypeKey } from './document-types'

// Base JSON structure returned by all extraction prompts
const BASE_RESPONSE_STRUCTURE = `
Return a JSON object with this exact structure:
{
  "facts": { ... (fields listed above, null if not found) },
  "clauses": [ { "id": "string", "type": "string", "text": "verbatim text under 300 chars", "significance": "HIGH|MEDIUM|LOW", "plain_english": "string", "consumer_implication": "string" } ],
  "confidence": 0.0,
  "document_type_confirmed": "string — what type of document this appears to be",
  "warnings": ["array of concerns or unusual items found"],
  "missing_items": ["important fields not found in this document"],
  "extraction_notes": "any caveats about this extraction",
  "cross_reference_needed": ["facts that should be verified against other documents"]
}
`

// ─── Contract Documents ───────────────────────────────────────────────────────

export const PURCHASE_CONTRACT_PROMPT = `Analyze this timeshare PURCHASE CONTRACT and extract all key terms.

Extract these facts (null if not present):
- purchase_date, purchase_price, developer_name, resort_name, resort_state
- contract_number, unit_type, points_or_weeks (POINTS/WEEKS), annual_points
- maintenance_fee_annual, maintenance_fee_frequency (MONTHLY/ANNUAL)
- loan_balance, interest_rate, loan_term_months, lender_name
- rescission_period_days, rescission_deadline (calculate from purchase_date if possible)
- deed_type (DEEDED/RIGHT_TO_USE), perpetuity_clause (true/false)
- heirs_obligation (true/false), transfer_restrictions, exit_provisions
- special_assessment_history, arbitration_clause (true/false)

Pay special attention to:
- Any rescission/cancellation language and exact deadline
- Perpetuity and inheritance clauses — these are frequently misunderstood
- Exit or resale provisions — are there any developer buyback terms?
- Any language that seems inconsistent with what a buyer might expect
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const PUBLIC_OFFERING_STATEMENT_PROMPT = `Analyze this PUBLIC OFFERING STATEMENT (POS) / disclosure document for a timeshare.

This is a developer-issued disclosure document, legally required before purchase.

Extract these facts (null if not present):
- developer_name, resort_name, resort_state, resort_address
- rescission_period_days (this should be explicitly stated — flag if missing)
- maintenance_fee_annual, fee_escalation_cap
- exit_provisions, transfer_restrictions
- perpetuity_clause, heirs_obligation
- developer_financial_health_notes (any disclosed risks)
- pending_litigation (any disclosed lawsuits)

Pay special attention to:
- The exact rescission period — this is legally required to be disclosed
- Any disclosed risks, pending litigation, or financial instability
- Exit and resale provisions — what does the developer say owners can do?
- Fee escalation caps or lack thereof
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const DEED_PROMPT = `Analyze this DEED or TITLE DOCUMENT for a timeshare property.

Extract these facts (null if not present):
- developer_name (grantor), owner_name (grantee)
- resort_name, resort_state, resort_address
- property_description, unit_number, parcel_id
- deed_type (DEEDED/RIGHT_TO_USE — look for "fee simple", "timeshare estate", "right to use")
- purchase_date (recording date or transfer date)
- purchase_price (if stated — often shown as consideration)
- perpetuity_clause (look for "in perpetuity", "forever", "and assigns")
- heirs_obligation (look for "heirs and assigns", "successors")
- county_of_record

Pay special attention to:
- "Fee simple" vs "right to use" — critical distinction for exit options
- Any language transferring obligation to heirs
- Recording date vs purchase date discrepancy
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const MEMBERSHIP_CERTIFICATE_PROMPT = `Analyze this TIMESHARE MEMBERSHIP CERTIFICATE or club membership document.

Extract these facts (null if not present):
- developer_name, resort_name, club_name
- contract_number, membership_number
- annual_points, points_expiration_policy
- purchase_date, membership_start_date
- home_resort, home_week
- points_or_weeks (should be POINTS for most certificates)
- membership_tier, membership_benefits

Pay special attention to:
- Points expiration rules — do points carry over? Roll over? Expire?
- Home resort vs exchange network distinctions
- Any membership tier differences that affect exit options
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const WELCOME_LETTER_PROMPT = `Analyze this WELCOME LETTER or owner confirmation packet from a timeshare developer.

Extract these facts (null if not present):
- developer_name, resort_name, resort_state
- contract_number, account_number, membership_number
- purchase_date, annual_points
- purchase_price (sometimes confirmed here)
- customer_service_phone, customer_service_email
- owner_services_url
- any_rescission_reminder (does it mention cancellation rights?)

Pay special attention to:
- Any mention of rescission/cancellation rights — developers are required to remind buyers
- Contact information for owner services — useful for escalation
- Whether the welcome letter matches what was in the contract
${BASE_RESPONSE_STRUCTURE}
Document text:
`

// ─── Financial Documents ──────────────────────────────────────────────────────

export const MAINTENANCE_FEE_STATEMENT_PROMPT = `Analyze this MAINTENANCE FEE STATEMENT or annual assessment notice.

Extract these facts (null if not present):
- developer_name, resort_name, management_company
- contract_number, account_number
- maintenance_fee_annual (current year amount)
- maintenance_fee_due_date
- maintenance_fee_status (CURRENT/DELINQUENT/PAID — based on balance due)
- balance_due (exact amount owed right now)
- special_assessment_amount (any extra charges beyond regular fees)
- special_assessment_reason
- late_fees_accrued
- payment_history (list any prior year amounts if shown — to show escalation)
- fee_increase_from_prior_year

Pay special attention to:
- Year-over-year fee increases — document the escalation pattern
- Special assessments — these are often undisclosed at time of sale
- Any delinquency notices, collection threats, or credit reporting warnings
- Management company name (sometimes different from developer — relevant for complaints)
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const LOAN_STATEMENT_PROMPT = `Analyze this LOAN STATEMENT or mortgage statement for a timeshare.

Extract these facts (null if not present):
- lender_name, loan_account_number
- loan_balance (current remaining balance — this is critical)
- original_loan_amount
- interest_rate (APR)
- monthly_payment
- loan_origination_date
- maturity_date
- payoff_amount (if shown — may differ from balance due to interest)
- delinquent_amount (if any past-due balance)
- developer_name (may appear as original creditor)

Pay special attention to:
- The exact current payoff amount — this determines deed-back eligibility
- Interest rate — timeshare loans often carry 14-20% APR; flag if so
- Any delinquency or default notices
- Whether the lender is the developer or a third-party (affects exit options differently)
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const PROPERTY_TAX_PROMPT = `Analyze this PROPERTY TAX BILL for a timeshare property.

Extract these facts (null if not present):
- resort_name, resort_address, resort_state
- county_name
- parcel_id, property_description
- assessed_value
- tax_amount_annual
- tax_year
- owner_name_on_record
- deed_type (infer from property description — "timeshare unit", "interval", etc.)
- tax_delinquency (any past-due taxes)

Pay special attention to:
- Owner name on record (confirms deeded ownership vs right-to-use)
- Assessed value (sometimes useful for negotiation reference)
- Any delinquent tax notices — unpaid property taxes complicate deed transfers
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const BANK_STATEMENTS_PROMPT = `Analyze these BANK or CREDIT CARD STATEMENTS for evidence of timeshare-related charges.

Extract these facts from transaction records (null if not found):
- developer_name (from payee names in transactions)
- resort_name (infer from payee names)
- maintenance_fee_annual (calculate from recurring annual or monthly charges)
- maintenance_fee_status (CURRENT if recent payments, note if payments stopped)
- loan_payment_monthly (recurring loan payments)
- special_assessment_amount (any one-time large charges)
- purchase_price (from original purchase transaction if present)
- payment_history_summary (describe the pattern: e.g. "payments current through Jan 2024, then stopped")
- fee_escalation_evidence (compare charges year over year if multiple years shown)
- exit_company_payments (any payments to third-party exit companies — flag these)

Pay special attention to:
- Pattern of payments — are fees being paid? Did they stop? When?
- Any charges to exit companies or "timeshare relief" services
- Fee escalation over time (very useful for hardship and complaint claims)
- Note: bank statements have lower confidence than direct statements — flag inferences
${BASE_RESPONSE_STRUCTURE}
Document text:
`

// ─── Correspondence & Evidence ────────────────────────────────────────────────

export const SALES_MATERIALS_PROMPT = `Analyze these SALES PRESENTATION MATERIALS or marketing documents for a timeshare.

These are typically brochures, handouts, or printed materials given during the sales presentation.
The goal is to identify claims that may not match the actual contract terms.

Extract these facts (null if not found):
- developer_name, resort_name
- claimed_resale_value (any claim about resale or appreciation)
- claimed_rental_income (any promised or projected rental income)
- claimed_exchange_benefits (what exchange networks were promised)
- claimed_flexibility (any promises about booking ease or availability)
- urgency_language (any "today only" or limited offer claims)

Most importantly, extract an array of CLAIMS made in the materials:
"claims": [
  {
    "claim_text": "verbatim or close paraphrase of the claim",
    "claim_type": "RESALE_VALUE | RENTAL_INCOME | AVAILABILITY | EXCHANGE | INVESTMENT | OTHER",
    "potentially_misleading": true/false,
    "reason": "why this may be misleading if applicable"
  }
]

Pay special attention to:
- Any claims about investment value or appreciation (timeshares are not investments)
- Rental income projections or guarantees
- Claims about easy resale or buyback programs
- Availability promises ("book anywhere, anytime")
- This type of evidence is most valuable for MISREPRESENTATION complaints
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const DEVELOPER_CORRESPONDENCE_PROMPT = `Analyze this CORRESPONDENCE with a timeshare developer, management company, or HOA.

Extract these facts (null if not found):
- developer_name, management_company
- contract_number, account_number
- correspondence_date, correspondence_direction (SENT_BY_OWNER / SENT_BY_DEVELOPER)
- subject_matter (EXIT_REQUEST | FEE_DISPUTE | HARDSHIP_REQUEST | COMPLAINT | GENERAL | OTHER)
- developer_response_type (DENIAL | APPROVAL | OFFER | INFORMATION | NO_RESPONSE)
- any_exit_offer_made (true/false — did developer offer any exit terms?)
- exit_offer_details (if yes, what were the terms?)
- any_deadlines_mentioned
- any_threats_made (collections, credit reporting, legal action)

Also extract a "timeline_entry":
{
  "date": "ISO date",
  "event_type": "EXIT_ATTEMPT | FEE_DISPUTE | HARDSHIP_REQUEST | COMPLAINT | RESPONSE",
  "summary": "one sentence description",
  "outcome": "DENIED | APPROVED | PENDING | NO_RESPONSE"
}

Pay special attention to:
- Any good-faith exit attempt by the owner — this is important context for complaints
- Any threats or aggressive collection language
- Any promises or offers made by the developer
- Dates — useful for building a timeline of events
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const EXIT_COMPANY_CONTRACT_PROMPT = `Analyze this CONTRACT WITH A THIRD-PARTY EXIT COMPANY.

This is a contract between the timeshare owner and a company that promised to cancel or exit their timeshare.

Extract these facts (null if not found):
- exit_company_name, exit_company_address
- contract_date, contract_amount (total fee paid)
- upfront_fee (amount paid before services rendered — major red flag)
- promised_timeline (when they said exit would be complete)
- promised_outcome (exactly what they guaranteed)
- guarantee_language (verbatim guarantee text if present)
- refund_policy
- actual_outcome (if evident from document — was it completed?)
- attorney_name_if_any (some companies use attorneys as fronts)

Also identify red flags:
"red_flags": [
  { "flag": "description of the red flag", "severity": "HIGH|MEDIUM|LOW" }
]

Common red flags: large upfront fees, guaranteed outcomes, "stop paying fees" advice,
power of attorney requests, instructions not to contact developer directly.

Pay special attention to:
- Upfront fee amount — this is the #1 indicator of a scam
- Any "guaranteed" cancellation language — this is almost always fraudulent
- Instructions to stop paying maintenance fees — this can damage credit
- This document is primary evidence for an FTC / AG complaint
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const DENIAL_LETTER_PROMPT = `Analyze this DENIAL LETTER from a timeshare developer or management company.

This is a letter denying an exit, hardship, or deed-back request from the owner.

Extract these facts (null if not found):
- developer_name, sender_name, sender_title
- denial_date
- denial_type (EXIT_DENIED | HARDSHIP_DENIED | DEED_BACK_DENIED | OTHER)
- reason_given (what reason did they give for the denial?)
- contract_number, account_number
- any_alternatives_offered (did they offer any other options?)
- any_appeal_process_mentioned
- any_deadlines_in_letter
- tone (PROFESSIONAL | THREATENING | FORM_LETTER | OTHER)

Also extract a timeline entry:
{
  "date": "ISO date of denial",
  "event_type": "EXIT_DENIED",
  "reason": "stated reason",
  "next_steps_offered": "any alternatives mentioned"
}

Pay special attention to:
- This proves the owner made a good-faith exit attempt — critical for complaints
- Any stated reasons can be addressed in a complaint or escalation
- Whether they offered alternatives or completely stonewalled
${BASE_RESPONSE_STRUCTURE}
Document text:
`

export const GENERIC_PROMPT = `Analyze this document related to a timeshare ownership situation.

Extract any relevant facts you can find (null if not present):
- developer_name, resort_name, resort_state
- contract_number, account_number
- any dates mentioned, any dollar amounts
- any party names (owner, developer, lender, management company)
- any terms or conditions
- document_type_identified (what type of document does this appear to be?)

Extract any clauses, terms, or statements that appear legally or financially significant.

${BASE_RESPONSE_STRUCTURE}
Document text:
`

// ─── Prompt Router ────────────────────────────────────────────────────────────

export function getExtractionPrompt(docType: DocumentTypeKey): string {
  const map: Partial<Record<DocumentTypeKey, string>> = {
    PURCHASE_CONTRACT: PURCHASE_CONTRACT_PROMPT,
    PUBLIC_OFFERING_STATEMENT: PUBLIC_OFFERING_STATEMENT_PROMPT,
    DEED: DEED_PROMPT,
    MEMBERSHIP_CERTIFICATE: MEMBERSHIP_CERTIFICATE_PROMPT,
    WELCOME_LETTER: WELCOME_LETTER_PROMPT,
    UPGRADE_CONTRACT: PURCHASE_CONTRACT_PROMPT, // same structure as contract
    MAINTENANCE_FEE_STATEMENT: MAINTENANCE_FEE_STATEMENT_PROMPT,
    LOAN_STATEMENT: LOAN_STATEMENT_PROMPT,
    PROPERTY_TAX_BILL: PROPERTY_TAX_PROMPT,
    BANK_STATEMENTS: BANK_STATEMENTS_PROMPT,
    SALES_MATERIALS: SALES_MATERIALS_PROMPT,
    DEVELOPER_CORRESPONDENCE: DEVELOPER_CORRESPONDENCE_PROMPT,
    DENIAL_LETTER: DENIAL_LETTER_PROMPT,
    EXIT_COMPANY_CONTRACT: EXIT_COMPANY_CONTRACT_PROMPT,
  }
  return map[docType] ?? GENERIC_PROMPT
}
