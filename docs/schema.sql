-- ============================================================
-- TIMESHARE EXIT NAVIGATOR — DATABASE SCHEMA
-- PostgreSQL / Supabase
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- REFERENCE / CONFIG TABLES (Admin-managed)
-- ============================================================

CREATE TABLE developer_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,                          -- e.g. "Marriott Vacation Club"
  slug TEXT UNIQUE NOT NULL,                   -- e.g. "marriott-vacation-club"
  parent_company TEXT,                         -- e.g. "Marriott International"
  official_exit_url TEXT,
  consumer_relations_phone TEXT,
  consumer_relations_email TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_brand_id UUID REFERENCES developer_brands(id),
  name TEXT NOT NULL,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'USA',
  resort_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE state_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_code CHAR(2) NOT NULL,               -- e.g. "FL"
  state_name TEXT NOT NULL,
  rescission_window_days INTEGER,            -- e.g. 10 for Florida
  rescission_statute TEXT,                   -- e.g. "FL Statute 721.10"
  rescission_notes TEXT,
  complaint_agency_primary TEXT,
  complaint_agency_url TEXT,
  complaint_agency_phone TEXT,
  ag_office_url TEXT,
  cfpb_applicable BOOLEAN DEFAULT true,
  ftc_applicable BOOLEAN DEFAULT true,
  additional_protections JSONB DEFAULT '{}',  -- flex field for extra rules
  rule_version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE official_exit_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_brand_id UUID REFERENCES developer_brands(id),
  program_name TEXT NOT NULL,                -- e.g. "Marriott Vacation Club Abound Exit"
  program_type TEXT NOT NULL CHECK (program_type IN (
    'deed_back', 'surrender', 'resale_assistance', 'points_forgiveness',
    'hardship_relief', 'legal_settlement', 'other'
  )),
  eligibility_criteria JSONB,                -- structured eligibility rules
  application_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  estimated_timeline_days INTEGER,
  fees_involved BOOLEAN DEFAULT false,
  fee_description TEXT,
  success_rate_note TEXT,                    -- honest note, not a guarantee
  last_verified_date DATE,
  source_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE complaint_agency_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_name TEXT NOT NULL,                 -- e.g. "Florida DBPR"
  agency_acronym TEXT,
  state_code CHAR(2),                        -- NULL = federal
  complaint_url TEXT,
  complaint_type TEXT,                       -- "timeshare_fraud", "misrepresentation", etc.
  letter_template TEXT,                      -- base template with {{variable}} placeholders
  required_fields JSONB,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attorney_referral_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trigger_code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  trigger_logic JSONB,                       -- conditions that fire this trigger
  referral_message TEXT,                     -- what to tell the user
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scoring_weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  factor_key TEXT UNIQUE NOT NULL,
  factor_label TEXT NOT NULL,
  weight NUMERIC(5,4) DEFAULT 0.1,          -- 0.0 to 1.0, sum = 1.0
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER & CASE TABLES
-- ============================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  state_of_residence TEXT,
  consent_given_at TIMESTAMPTZ,
  disclaimer_acknowledged_at TIMESTAMPTZ,
  marketing_opt_in BOOLEAN DEFAULT false,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  case_name TEXT,                            -- user-facing label, e.g. "My Marriott Ko Olina Contract"
  status TEXT DEFAULT 'intake' CHECK (status IN (
    'intake', 'documents_pending', 'analyzing', 'plan_ready',
    'in_progress', 'escalated', 'closed', 'archived'
  )),

  -- Developer / Resort
  developer_brand_id UUID REFERENCES developer_brands(id),
  resort_id UUID REFERENCES resorts(id),
  developer_name_manual TEXT,               -- if not in our DB yet

  -- Contract basics
  contract_date DATE,
  signing_location_city TEXT,
  signing_location_state TEXT,
  governing_law_state CHAR(2),
  contract_type TEXT CHECK (contract_type IN ('deeded', 'points', 'right_to_use', 'unknown')),
  points_owned INTEGER,

  -- Financial
  purchase_price NUMERIC(12,2),
  financing_involved BOOLEAN,
  loan_balance NUMERIC(12,2),
  interest_rate NUMERIC(5,4),
  monthly_payment NUMERIC(10,2),
  annual_maintenance_fee NUMERIC(10,2),
  maintenance_fee_current BOOLEAN,
  total_paid_to_date NUMERIC(12,2),

  -- Situation
  dissatisfaction_reasons TEXT[],           -- array of coded reasons
  hardship_factors TEXT[],                  -- "medical", "financial", "age", "disability", etc.
  sales_rep_promises TEXT,                  -- free-text from intake
  usage_history TEXT,                       -- how much have they used it
  already_contacted_developer BOOLEAN DEFAULT false,
  developer_response TEXT,
  prior_exit_company_contact BOOLEAN DEFAULT false,
  prior_exit_company_details TEXT,

  -- Computed
  actionability_score NUMERIC(5,2),        -- 0-100
  actionability_score_breakdown JSONB,     -- factor-by-factor explanation
  recommended_primary_path TEXT,           -- e.g. "rescission", "official_exit", "complaint"
  case_classification TEXT[],              -- multiple tags
  rescission_window_open BOOLEAN,
  rescission_deadline DATE,
  rescission_analysis TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE TABLE uploaded_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,                   -- "purchase_contract", "disclosure", "finance_agreement", etc.
  mime_type TEXT,
  storage_path TEXT NOT NULL,               -- Supabase storage path
  file_size_bytes INTEGER,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN (
    'pending', 'scanning', 'scanned', 'extracting', 'extracted', 'failed'
  )),
  ocr_completed BOOLEAN DEFAULT false,
  raw_text TEXT,                             -- full extracted text
  page_count INTEGER,
  checksum TEXT,                             -- SHA-256 for integrity
  is_deleted BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE extracted_facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  document_id UUID REFERENCES uploaded_documents(id),
  fact_key TEXT NOT NULL,                    -- e.g. "rescission_window_days", "governing_law"
  fact_label TEXT NOT NULL,                  -- human-readable label
  fact_value TEXT,                           -- normalized value
  fact_value_raw TEXT,                       -- as extracted
  source_snippet TEXT,                       -- quoted text from document
  source_page INTEGER,
  source_location TEXT,                      -- "page 3, paragraph 2"
  confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
  extraction_method TEXT CHECK (extraction_method IN ('regex', 'llm', 'manual', 'computed')),
  needs_review BOOLEAN DEFAULT false,
  reviewer_notes TEXT,
  fact_category TEXT,                        -- "rescission", "financing", "fees", "arbitration", etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contract_clauses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES uploaded_documents(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id),
  clause_type TEXT NOT NULL,                 -- "rescission", "merger", "arbitration", "venue", etc.
  clause_text TEXT NOT NULL,                 -- full clause text
  clause_summary TEXT,                       -- plain-English summary
  page_number INTEGER,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  confidence NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ISSUE SPOTTING
-- ============================================================

CREATE TABLE issue_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  issue_code TEXT NOT NULL,
  issue_category TEXT NOT NULL CHECK (issue_category IN (
    'rescission_timing', 'misrepresentation_resale', 'misrepresentation_rental',
    'pressure_tactics', 'hidden_fees', 'availability_mismatch', 'financing_burden',
    'hardship', 'oral_promises_contradiction', 'incomplete_documents',
    'denied_benefits', 'other'
  )),
  issue_title TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  evidence_basis TEXT,                       -- what triggered this flag
  source_type TEXT CHECK (source_type IN ('document', 'user_stated', 'computed', 'rules_engine')),
  related_document_id UUID REFERENCES uploaded_documents(id),
  related_fact_id UUID REFERENCES extracted_facts(id),
  is_confirmed BOOLEAN,                      -- user confirms/denies
  user_notes TEXT,
  legal_disclaimer TEXT,                     -- disclaimer for this specific issue
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTION PLANS & LETTERS
-- ============================================================

CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  plan_version INTEGER DEFAULT 1,
  summary TEXT,
  primary_path TEXT,
  steps JSONB NOT NULL DEFAULT '[]',         -- [{step, title, description, deadline, priority, status}]
  missing_documents JSONB DEFAULT '[]',
  urgent_items JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  is_current BOOLEAN DEFAULT true
);

CREATE TABLE generated_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  letter_type TEXT NOT NULL CHECK (letter_type IN (
    'rescission_notice', 'hardship_request', 'developer_contact',
    'complaint_dbpr', 'complaint_ag', 'complaint_cfpb', 'complaint_ftc',
    'attorney_summary', 'cease_desist', 'other'
  )),
  letter_title TEXT NOT NULL,
  recipient TEXT,
  subject TEXT,
  body_text TEXT NOT NULL,
  body_html TEXT,
  variables_used JSONB,                      -- which facts/fields were injected
  warnings_included TEXT[],                  -- disclaimers added
  version INTEGER DEFAULT 1,
  is_draft BOOLEAN DEFAULT true,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  last_edited_at TIMESTAMPTZ
);

CREATE TABLE evidence_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  document_id UUID REFERENCES uploaded_documents(id),
  item_type TEXT CHECK (item_type IN (
    'document', 'email', 'text_message', 'call_note', 'photo', 'receipt',
    'denial_letter', 'prior_complaint', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  is_key_evidence BOOLEAN DEFAULT false,
  relevance_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type TEXT,                           -- "purchase", "first_complaint", "denial", etc.
  title TEXT NOT NULL,
  description TEXT,
  is_deadline BOOLEAN DEFAULT false,
  deadline_passed BOOLEAN,
  source TEXT CHECK (source IN ('document', 'user_stated', 'computed', 'system')),
  related_document_id UUID REFERENCES uploaded_documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  case_id UUID REFERENCES cases(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "user_profiles_own" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "cases_own" ON cases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "documents_own" ON uploaded_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "facts_via_case" ON extracted_facts
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

CREATE POLICY "issues_via_case" ON issue_flags
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

CREATE POLICY "plans_via_case" ON action_plans
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

CREATE POLICY "letters_via_case" ON generated_letters
  FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE user_id = auth.uid())
  );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_documents_case_id ON uploaded_documents(case_id);
CREATE INDEX idx_facts_case_id ON extracted_facts(case_id);
CREATE INDEX idx_facts_key ON extracted_facts(fact_key);
CREATE INDEX idx_issues_case_id ON issue_flags(case_id);
CREATE INDEX idx_issues_severity ON issue_flags(severity);
CREATE INDEX idx_timeline_case_date ON timeline_events(case_id, event_date);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
