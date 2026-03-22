# TIMESHARE EXIT NAVIGATOR — Product Backlog

## PHASE 1 — MVP Core (Weeks 1–6)

### P1-001: Auth & User Profile
- [ ] Supabase Auth setup (email/password + Google OAuth)
- [ ] User profile creation with consent + disclaimer logging
- [ ] Protected route middleware
- [ ] Account settings page (email, password, delete account)
- [ ] Session security (15-min idle warning, secure logout)

### P1-002: Case Creation & Intake Wizard
- [ ] 8-step intake wizard (all steps designed)
  - Step 1: Developer & Resort selection (with "not listed" fallback)
  - Step 2: Contract details (date, location, type, points)
  - Step 3: Financial overview (price, financing, fees)
  - Step 4: Sales experience (promises, pressure tactics)
  - Step 5: Dissatisfaction reasons (multi-select)
  - Step 6: Hardship factors (medical, financial, age)
  - Step 7: Prior actions (contacted developer, exit company)
  - Step 8: Document upload gateway
- [ ] Progress save (auto-save every step to DB)
- [ ] Case naming and case list view
- [ ] Intake edit/review mode

### P1-003: Document Upload & Storage
- [ ] Secure file upload (Supabase Storage, encrypted bucket)
- [ ] File type validation (PDF, JPG, PNG, DOCX)
- [ ] File size limits (50MB per file)
- [ ] Upload progress indicator
- [ ] Virus/malware scan hook (ClamAV or similar)
- [ ] Document type labeling (contract, disclosure, etc.)
- [ ] Document list view with status indicators

### P1-004: OCR & Text Extraction
- [ ] Server-side PDF text extraction (pdf-parse)
- [ ] Image OCR pipeline (Tesseract or AWS Textract)
- [ ] Raw text storage per document
- [ ] Extraction status tracking

### P1-005: Claude-Powered Clause Extraction
- [ ] Contract extraction prompt (18 key facts)
- [ ] Extraction API route with error handling
- [ ] Schema validation for extraction output
- [ ] Confidence scoring display
- [ ] Source snippet storage and display
- [ ] "Needs review" flagging
- [ ] Extracted facts panel in UI

### P1-006: Case Dashboard
- [ ] Actionability Score display with breakdown
- [ ] Primary path recommendation card
- [ ] Key info grid (rescission, loan, fees, governing law)
- [ ] Issue map panel
- [ ] Action steps panel
- [ ] Ready letters panel
- [ ] Scam warning component
- [ ] Disclaimer banner

---

## PHASE 2 — Intelligence Layer (Weeks 7–10)

### P2-001: Rules Engine
- [ ] TypeScript rules engine with JSON config
- [ ] Florida rule pack (rescission, agencies, statutes)
- [ ] Marriott brand rule pack (exit paths, contacts, escalation)
- [ ] Rules engine API route
- [ ] Trigger attorney referral logic
- [ ] Deadline computation

### P2-002: Issue-Spotting Engine
- [ ] Issue-spotting prompt (11 categories)
- [ ] Issue flagging UI with severity indicators
- [ ] Source labeling (document / user-stated / AI)
- [ ] User confirmation/denial of issues
- [ ] Issue detail modal with legal disclaimer

### P2-003: Action Plan Generator
- [ ] Action plan prompt
- [ ] Step-by-step plan UI
- [ ] "This week" prioritization
- [ ] Missing documents checklist
- [ ] Deadline tracking
- [ ] Do-not-do list (scam warnings)

### P2-004: Letter Generator
- [ ] Rescission notice generator (FL-aware)
- [ ] Hardship deed-back request generator (Marriott-aware)
- [ ] DBPR complaint generator
- [ ] Attorney-ready evidence summary
- [ ] Letter review UI with edit capability
- [ ] Letter version history

### P2-005: Scoring Engine
- [ ] 8-factor scoring computation
- [ ] Factor-by-factor explanation UI
- [ ] Score history (re-analyze on new documents)

---

## PHASE 3 — Completion & Export (Weeks 11–14)

### P3-001: Evidence Timeline
- [ ] Timeline event creation (manual + auto-computed)
- [ ] Timeline visualization
- [ ] Evidence attachment to timeline events
- [ ] Key evidence flagging

### P3-002: Case Packet Export
- [ ] Case summary PDF
- [ ] Issues + facts compilation
- [ ] Letter drafts included
- [ ] Action plan export
- [ ] Attorney-ready format option
- [ ] Download + email delivery

### P3-003: Complaint Workflows
- [ ] DBPR complaint complete flow
- [ ] CFPB complaint flow (financing)
- [ ] FL AG complaint flow
- [ ] FTC report guidance
- [ ] Links to online portals with pre-filled guidance

### P3-004: Admin CMS
- [ ] Admin auth (role: admin)
- [ ] State rules CRUD interface
- [ ] Developer/brand management
- [ ] Official exit programs management
- [ ] Complaint templates management
- [ ] Scoring weights adjustment
- [ ] Disclaimer text management
- [ ] Attorney referral triggers management

### P3-005: Security & Compliance
- [ ] Audit log viewer
- [ ] Data export (GDPR/CCPA)
- [ ] Account deletion flow
- [ ] PII masking in logs
- [ ] Retention policy UI
- [ ] Privacy policy and ToS pages

---

## PHASE 4 — Expansion (Post-MVP)

### P4-001: Additional States
- [ ] California rule pack (CA Civil Code § 1689.6)
- [ ] Nevada rule pack
- [ ] South Carolina rule pack
- [ ] Texas rule pack
- [ ] Multi-state case support

### P4-002: Additional Brands
- [ ] Wyndham Destinations pack
- [ ] Disney Vacation Club pack
- [ ] Hilton Grand Vacations pack
- [ ] Bluegreen Vacations pack
- [ ] Holiday Inn Club Vacations pack

### P4-003: Monetization
- [ ] Freemium gating (3 uploads free, unlimited on paid)
- [ ] Subscription billing (Stripe)
- [ ] Letter generation tokens (à la carte)
- [ ] Export as paid feature
- [ ] White-label for attorney firms

### P4-004: Attorney Network
- [ ] Attorney referral directory
- [ ] Case sharing with attorney (secure link)
- [ ] Attorney intake integration
- [ ] Referral fee tracking

---

## TECH DEBT / ONGOING

- [ ] Error boundary and graceful fallback for LLM failures
- [ ] Rate limiting for extraction API
- [ ] Background job queue for document processing
- [ ] Email notifications (Resend) for case status changes
- [ ] Mobile responsive polish
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Analytics (privacy-respecting — Plausible or PostHog)
- [ ] LLM output caching to reduce API costs
- [ ] Admin dashboard usage metrics
