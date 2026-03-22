-- ============================================================
-- SEED DATA — Florida/Marriott MVP Pack
-- ============================================================

-- Developer: Marriott Vacation Club
INSERT INTO developer_brands (id, name, slug, parent_company, official_exit_url,
  consumer_relations_phone, consumer_relations_email, notes)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Marriott Vacation Club',
  'marriott-vacation-club',
  'Marriott International',
  'https://www.marriottvacationclub.com/ownership/exit-options',
  '1-800-860-9384',
  'ownerservices@mvci.com',
  'Largest vacation ownership brand. Has documented deed-back and exit programs. Part of Marriott Vacations Worldwide (MVW).'
);

-- Developer: Vistana Signature Experiences (Marriott subsidiary)
INSERT INTO developer_brands (id, name, slug, parent_company, official_exit_url,
  consumer_relations_phone)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Vistana Signature Experiences',
  'vistana',
  'Marriott Vacations Worldwide',
  'https://www.vistana.com/ownership',
  '1-888-220-7688',
  'Formerly Sheraton and Westin vacation ownership. Now under Marriott umbrella.'
);

-- State Rules: Florida
INSERT INTO state_rules (
  state_code, state_name, rescission_window_days, rescission_statute,
  rescission_notes, complaint_agency_primary, complaint_agency_url,
  complaint_agency_phone, ag_office_url, additional_protections
) VALUES (
  'FL',
  'Florida',
  10,
  'Florida Statute § 721.10',
  'Florida provides a 10-calendar-day rescission period from the date of contract execution or receipt of all required documents, whichever is later. The notice must be in writing and sent by certified mail, return receipt requested, or hand-delivered. Florida has among the strongest timeshare consumer protections in the US.',
  'Florida Department of Business and Professional Regulation (DBPR) — Division of Florida Condominiums, Timeshares, and Mobile Homes',
  'https://www.myfloridalicense.com/DBPR/condominiums-timeshares-mobile-homes/',
  '1-850-487-1395',
  'https://myfloridalegal.com',
  '{
    "public_offering_statement_required": true,
    "oral_misrepresentation_protections": true,
    "cooling_off_applies_to_exchange_programs": true,
    "developer_must_provide_rescission_notice": true,
    "misrepresentation_remedies": "Rescission + damages under FL 721.10 and FDUTPA",
    "key_statutes": ["FL Stat 721", "FDUTPA § 501.201-501.213"],
    "cfpb_mortgage_applicable": true
  }'::jsonb
);

-- State Rules: South Carolina (secondary target)
INSERT INTO state_rules (
  state_code, state_name, rescission_window_days, rescission_statute,
  complaint_agency_primary, complaint_agency_url, complaint_agency_phone
) VALUES (
  'SC',
  'South Carolina',
  5,
  'SC Code § 27-32-60',
  'South Carolina Attorney General Consumer Protection Division',
  'https://www.scag.gov/consumer-protection',
  '1-803-737-3953'
);

-- Official Exit Programs: Marriott Vacation Club
INSERT INTO official_exit_programs (
  developer_brand_id, program_name, program_type,
  eligibility_criteria, application_url, contact_phone,
  estimated_timeline_days, fees_involved, fee_description,
  success_rate_note, last_verified_date, source_url
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Marriott Vacation Club Abound Exit / Deed-Back Program',
  'deed_back',
  '{
    "account_must_be_current": true,
    "no_outstanding_loans": true,
    "ownership_duration_min_years": 1,
    "no_active_rentals": true,
    "notes": "Marriott has an internal surrender/deed-back process. Eligibility is not publicly posted and evaluated case-by-case. Hardship cases may receive priority consideration. Owners with financing are significantly less likely to qualify."
  }'::jsonb,
  'https://www.marriottvacationclub.com/ownership/contact-us',
  '1-800-860-9384',
  180,
  false,
  'No stated fee, but owners forfeit all paid amounts and equity.',
  'Marriott does not publish success rates. Industry estimates suggest 20-40% of applicants qualify for surrender. Having an attorney contact them may improve odds.',
  '2024-10-01',
  'https://www.marriottvacationclub.com/ownership'
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Marriott Vacation Club Resale/Transfer Assistance',
  'resale_assistance',
  '{
    "notes": "MVC operates an internal resale channel (Marriott Resales). Resale prices are typically far below purchase price. NOT a guaranteed exit — market is extremely limited.",
    "realistic_expectation": "Most points/weeks sell for $1-$5 per point vs $20+ purchase price"
  }'::jsonb,
  'https://www.marriottvacationclub.com/resales',
  '1-800-860-9384',
  365,
  false,
  'Seller pays closing costs (~$500-2,000). No upfront fees.',
  'Resale is highly unlikely to recoup purchase price. Useful only if goal is to end future fee obligations.',
  '2024-10-01',
  'https://www.marriottvacationclub.com/resales'
);

-- Attorney Referral Triggers
INSERT INTO attorney_referral_triggers (trigger_code, description, urgency_level, trigger_logic, referral_message) VALUES
(
  'RESCISSION_NEAR_EXPIRY',
  'Rescission window closes in 48 hours or less',
  'critical',
  '{"condition": "rescission_deadline_within_hours", "threshold": 48}'::jsonb,
  'Your rescission window is closing VERY soon. If you have a valid rescission claim, you may need a licensed attorney to review and send the notice immediately to ensure it is legally compliant and timely.'
),
(
  'ACTIVE_LITIGATION',
  'User has mentioned active lawsuit or legal proceedings',
  'critical',
  '{"condition": "user_stated_active_litigation"}'::jsonb,
  'You have indicated there are active legal proceedings. Do not take any action without consulting your attorney. This platform can help you organize evidence but cannot advise on active litigation.'
),
(
  'LARGE_LOAN_BALANCE',
  'Outstanding loan balance over $30,000',
  'high',
  '{"condition": "loan_balance_gt", "threshold": 30000}'::jsonb,
  'With a significant outstanding loan balance, your exit options are more limited and the financial stakes are high. A real estate or consumer protection attorney consultation is strongly recommended before taking any exit action.'
),
(
  'FRAUD_INDICATORS_HIGH',
  'Multiple high-severity misrepresentation flags identified',
  'high',
  '{"condition": "issue_flags_count", "category": "misrepresentation_resale", "severity": "high", "threshold": 2}'::jsonb,
  'We have identified potential indicators of misrepresentation in your case. These may support a legal claim. A consumer protection attorney in your state can advise whether you have actionable claims.'
),
(
  'PRIOR_EXIT_COMPANY_SCAM',
  'User already paid an exit company',
  'high',
  '{"condition": "user_stated_prior_exit_company_payment"}'::jsonb,
  'If you have already paid an exit company and received no results, you may be a victim of fraud. An attorney can advise on options to recover those funds. Report the company to your state AG and the FTC.'
),
(
  'ELDER_FINANCIAL_VULNERABILITY',
  'Owner is over 70 and reports financial hardship',
  'medium',
  '{"conditions": ["age_over_70", "hardship_financial"]}'::jsonb,
  'As an older adult facing financial difficulty with a timeshare, you may have additional legal protections. Some states have specific elder consumer protection laws. An attorney consultation is recommended.'
);

-- Scoring Weights (must sum to ~1.0)
INSERT INTO scoring_weights (factor_key, factor_label, weight, description) VALUES
('rescission_window_open', 'Rescission Window Open', 0.25, 'Highest weight — if rescission is still available, this dramatically increases actionability'),
('official_exit_path_available', 'Official Developer Exit Program', 0.15, 'Whether a documented official exit path exists and user may qualify'),
('document_completeness', 'Documentation Completeness', 0.15, 'How complete the uploaded documents are for analysis'),
('hardship_indicators', 'Hardship Factors Present', 0.12, 'Medical, financial, or age-related hardship strengthens many paths'),
('misrepresentation_evidence', 'Misrepresentation Evidence', 0.12, 'Evidence of sales misrepresentation or pressure tactics'),
('financing_burden', 'Financing Burden', 0.08, 'Outstanding loan makes exit harder; lower score = higher burden'),
('fee_current_status', 'Maintenance Fee Status', 0.05, 'Being current on fees is required for most official exit paths'),
('contract_age', 'Contract Age', 0.05, 'Older contracts may have different options; very new = rescission likely'),
('prior_developer_contact', 'Prior Developer Contact', 0.03, 'Has user already attempted to resolve directly?'),
('extraction_confidence', 'Data Extraction Confidence', 0.10, 'How reliably we could extract facts from documents');

-- Complaint Agency Templates
INSERT INTO complaint_agency_templates (
  agency_name, agency_acronym, state_code, complaint_url, complaint_type, letter_template, required_fields
) VALUES
(
  'Florida Department of Business and Professional Regulation',
  'DBPR',
  'FL',
  'https://www.myfloridalicense.com/DBPR/condominiums-timeshares-mobile-homes/file-a-complaint/',
  'timeshare_misrepresentation',
  'Dear DBPR Division of Condominiums, Timeshares, and Mobile Homes,

I am writing to file a formal complaint against {{developer_name}} regarding my timeshare purchase at {{resort_name}}, located in {{resort_state}}.

CONTRACT DETAILS:
- Purchase Date: {{contract_date}}
- Purchase Price: {{purchase_price}}
- Timeshare Type: {{contract_type}}
- Contract Number: {{contract_number}}

NATURE OF COMPLAINT:
{{complaint_description}}

MISREPRESENTATIONS ALLEGED:
{{misrepresentation_details}}

DOCUMENTS ENCLOSED:
{{document_list}}

I request that the DBPR investigate this matter under Florida Statute Chapter 721.

Respectfully,
{{owner_full_name}}
{{owner_address}}
{{owner_phone}}
{{owner_email}}
Date: {{current_date}}',
  '["developer_name", "resort_name", "contract_date", "purchase_price", "complaint_description"]'::jsonb
),
(
  'Consumer Financial Protection Bureau',
  'CFPB',
  NULL,
  'https://www.consumerfinance.gov/complaint/',
  'timeshare_financing',
  'I am filing a complaint regarding timeshare financing provided in connection with a {{developer_name}} timeshare purchase.

FINANCING DETAILS:
- Original Loan Amount: {{loan_amount}}
- Interest Rate: {{interest_rate}}
- Monthly Payment: {{monthly_payment}}
- Loan Servicer: {{loan_servicer}}

COMPLAINT:
{{complaint_description}}

I believe the financing practices may violate TILA and/or RESPA disclosure requirements.',
  '["developer_name", "loan_amount", "complaint_description"]'::jsonb
);
