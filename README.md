# Timeshare Exit Navigator — Next.js App

Consumer education platform for timeshare owners. Analyzes contracts, identifies exit options, and generates action plans. **Not a law firm. Not legal advice.**

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS (custom design system) |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage (encrypted, signed URLs) |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-5`) |
| Email | Resend |
| Deployment | Vercel |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in all values (see below)

# 3. Set up Supabase
# - Run /docs/schema.sql in your Supabase SQL editor
# - Run /docs/seed.sql to populate reference data
# - Create a 'documents' storage bucket (private)

# 4. Run dev server
npm run dev
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## App Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── intake/page.tsx       # 8-step intake wizard
│   ├── dashboard/page.tsx    # Case analysis dashboard
│   ├── cases/page.tsx        # All cases list
│   └── api/
│       ├── cases/            # GET/POST cases, GET single case
│       ├── extract/          # Claude contract extraction
│       ├── analyze/          # Claude issue spotting + action plan
│       ├── letters/          # Claude letter generation
│       ├── documents/        # File upload to Supabase Storage
│       ├── issues/           # Issue flags for a case
│       └── action-plan/      # Action plan for a case
├── components/
│   ├── ui/                   # Badge, Alert, ConfidenceDot, SourceLabel, Skeleton
│   └── documents/            # DocumentUpload (drag-and-drop + extraction)
├── hooks/
│   ├── useCase.ts            # Fetch + analyze a single case
│   └── useCases.ts           # Fetch all cases for a user
└── lib/
    ├── anthropic.ts          # Anthropic client
    ├── prompts.ts            # 8 production Claude prompts
    ├── rules-engine.ts       # FL/Marriott rules + actionability scoring
    └── supabase/
        ├── client.ts         # Browser Supabase client
        └── server.ts         # Server-side Supabase client (service role)
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cases` | List all cases for user |
| POST | `/api/cases` | Create case from intake + run rules engine |
| GET | `/api/cases/[caseId]` | Get single case |
| PATCH | `/api/cases/[caseId]` | Update case fields |
| POST | `/api/extract` | Claude contract text extraction |
| POST | `/api/analyze` | Claude issue spotting + AI action plan |
| GET | `/api/issues?caseId=` | Get issue flags |
| GET | `/api/action-plan?caseId=` | Get action plan |
| POST | `/api/letters` | Generate rescission/complaint letters |
| GET | `/api/letters?caseId=` | List generated letters |
| POST | `/api/documents` | Upload document to Supabase Storage |
| GET | `/api/documents?caseId=` | List uploaded documents |

All routes require `x-user-id` header (replace with real Supabase auth in production).

---

## Supabase Setup

### Storage bucket
```sql
-- In Supabase Storage, create a bucket named 'documents'
-- Set to private (not public)
-- Enable RLS
```

### RLS on storage
```sql
CREATE POLICY "Users access own documents"
ON storage.objects FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Deployment (Vercel)

```bash
# 1. Push to GitHub
# 2. Connect repo in Vercel
# 3. Add all env vars in Vercel dashboard
# 4. Deploy

vercel --prod
```

---

## Key Design Decisions

### Guardrails (non-negotiable)
- Every AI output labeled `AI ANALYSIS` — never presented as fact
- Confidence scores on all extracted data
- "Not legal advice" disclaimer on every page
- Scam warnings surfaced on any case with a prior exit company
- Attorney referral only via state bar — no specific referrals

### Rules Engine vs AI
The rules engine runs first (fast, deterministic, no API cost) for:
- Rescission deadline math
- Marriott deed-back eligibility
- Actionability score calculation

Claude then runs for:
- Contract clause extraction
- Issue identification
- Action plan generation
- Letter drafting
- Case summary

### Authentication
Currently using `x-user-id` header (demo mode). Replace with Supabase Auth:
```ts
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// Protect /dashboard, /intake, /cases, /api/* routes
```

---

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Architecture, schema, types, prompts, rules engine, static UIs | ✅ Complete |
| 2 | Next.js app, API routes, intake wizard, dashboard, document upload | ✅ Complete |
| 3 | Supabase Auth, evidence timeline, PDF export, complaint workflows | 🔜 Next |
| 4 | Multi-state (CA, NV, SC, TX), multi-brand, Stripe monetization | 🔜 Future |

---

## Disclaimer

This platform is for consumer education only. It is not a law firm and does not provide legal advice. Nothing on this platform constitutes an attorney-client relationship. All AI-generated content is clearly labeled. If you have specific legal questions, consult a licensed attorney in your state.
