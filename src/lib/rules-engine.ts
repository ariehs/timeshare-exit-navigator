export interface RulesEngineInput {
  purchaseDate?: string
  rescissionDeadline?: string
  resortState?: string
  developerName?: string
  loanBalance?: number
  maintenanceFeeAnnual?: number
  maintenanceFeeStatus?: 'CURRENT' | 'DELINQUENT' | 'UNKNOWN'
  hasHardship?: boolean
  hardshipType?: string[]
  priorExitCompany?: boolean
  issueCategories?: string[]
  elderlyOwner?: boolean
  extractedFacts?: Record<string, unknown>
}

export interface ActionStep {
  id: string
  title: string
  description: string
  path: string
  priority: number
  timeSensitive: boolean
  deadline?: string
  estimatedCost: string
  estimatedTime: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  documentsNeeded: string[]
}

export interface RulesEngineOutput {
  triggeredPaths: string[]
  actionSteps: ActionStep[]
  scamWarnings: string[]
  missingEvidence: string[]
  requiresAttorney: boolean
  attorneyReason?: string
  actionabilityScore: ActionabilityScore
}

export interface ScoreFactor {
  key: string
  label: string
  weight: number
  score: number
  explanation: string
}

export interface ActionabilityScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  label: string
  factors: ScoreFactor[]
  explanation: string
}

const FLORIDA_RULES = {
  rescissionDays: 10,
  keyStatutes: ['FL Stat § 721.10', 'FL Stat § 721.06', 'FL Stat § 721.165'],
  complaintAgencies: [
    { name: 'FL DBPR', url: 'https://www.myfloridalicense.com', priority: 1 },
    { name: 'FL Attorney General', url: 'https://www.myfloridalicense.com', priority: 2 },
    { name: 'CFPB', url: 'https://www.consumerfinance.gov/complaint', priority: 3 },
    { name: 'FTC', url: 'https://reportfraud.ftc.gov', priority: 4 },
  ],
  consumerProtections: [
    'Right to cancel within 10 days of signing (FL Stat § 721.10)',
    'Developer must disclose all fees and assessments',
    'Public offering statement required before purchase',
    'Resale advertising restrictions',
  ],
}

const MARRIOTT_RULES = {
  brandNames: ['marriott', 'mvc', 'marriott vacation club', 'mvw'],
  officialExitPaths: [
    {
      name: 'Deed-Back Program',
      eligibility: ['No outstanding loan balance', 'Maintenance fees current', 'Account in good standing'],
      process: 'Contact Marriott Owner Services at 800-860-9384. Request deed-back evaluation. Allow 60-90 days.',
      estimatedTime: '60-90 days',
      cost: 'Free (may have transfer fees)',
    },
    {
      name: 'Resale Assistance Program',
      eligibility: ['Account in good standing', 'Points-based contract'],
      process: 'Contact Marriott about their SellMyTimeshareNow partnership',
      estimatedTime: '6-18 months',
      cost: 'Agent commission ~10-15%',
    },
  ],
  ownerServicesPhone: '800-860-9384',
  escalationPath: [
    'Call Owner Services (800-860-9384)',
    'Request supervisor escalation',
    'Submit written request via certified mail',
    'File with FL DBPR if no response in 30 days',
    'File CFPB complaint',
    'Consult consumer protection attorney',
  ],
  redFlags: [
    'Third-party exit companies charging upfront fees',
    'Promises of guaranteed cancellation',
    'Claims of "special connections" with Marriott',
    'Requests to stop paying maintenance fees',
    'Transfer of deed to unknown third parties',
  ],
}

export function runRulesEngine(input: RulesEngineInput): RulesEngineOutput {
  const steps: ActionStep[] = []
  const triggeredPaths: string[] = []
  const scamWarnings: string[] = []
  const missingEvidence: string[] = []
  let requiresAttorney = false
  let attorneyReason: string | undefined

  // Rule 1: Rescission Window
  if (input.rescissionDeadline) {
    const deadline = new Date(input.rescissionDeadline)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining > 0) {
      triggeredPaths.push('RESCISSION')
      steps.push({
        id: 'rescission-notice',
        title: `Send Rescission Notice — ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`,
        description: `You are within your ${input.resortState === 'FL' ? '10' : ''}-day rescission window. Send a written cancellation notice immediately via certified mail with return receipt.`,
        path: 'RESCISSION',
        priority: 1,
        timeSensitive: true,
        deadline: input.rescissionDeadline,
        estimatedCost: 'Free (postal fees only)',
        estimatedTime: 'Same day',
        difficulty: 'EASY',
        documentsNeeded: ['Original signed contract', 'Rescission letter', 'Proof of certified mail'],
      })

      if (daysRemaining <= 2) {
        requiresAttorney = true
        attorneyReason = 'Rescission deadline is critically close. An attorney can help ensure proper delivery.'
      }
    }
  } else {
    missingEvidence.push('Contract signing date (needed to calculate rescission deadline)')
  }

  // Rule 2: Official Marriott Exit Path
  const isMarriott = MARRIOTT_RULES.brandNames.some(b =>
    input.developerName?.toLowerCase().includes(b)
  )

  if (isMarriott) {
    triggeredPaths.push('OFFICIAL_EXIT')
    const deedBackEligible = !input.loanBalance || input.loanBalance === 0
    const feesCurrentOrUnknown = input.maintenanceFeeStatus !== 'DELINQUENT'

    if (deedBackEligible && feesCurrentOrUnknown) {
      steps.push({
        id: 'marriott-deedback',
        title: 'Request Marriott Deed-Back Evaluation',
        description: 'Marriott offers a deed-back program for owners in good standing with no outstanding loan. Contact Owner Services and request a deed-back evaluation.',
        path: 'OFFICIAL_EXIT',
        priority: 2,
        timeSensitive: false,
        estimatedCost: 'Free (possible transfer fees)',
        estimatedTime: '60-90 days',
        difficulty: 'MEDIUM',
        documentsNeeded: ['Account statement showing $0 loan balance', 'Proof of current maintenance fees'],
      })
    } else {
      steps.push({
        id: 'marriott-contact',
        title: 'Contact Marriott Owner Services Directly',
        description: 'Before engaging any third-party exit company, contact Marriott Owner Services at 800-860-9384 to discuss your options directly.',
        path: 'OFFICIAL_EXIT',
        priority: 2,
        timeSensitive: false,
        estimatedCost: 'Free',
        estimatedTime: '1 hour',
        difficulty: 'EASY',
        documentsNeeded: ['Contract number', 'Account number'],
      })
    }
  }

  // Rule 3: Hardship Path
  if (input.hasHardship) {
    triggeredPaths.push('HARDSHIP')
    const isElder = input.elderlyOwner || input.hardshipType?.includes('age')
    const isMedical = input.hardshipType?.includes('medical') || input.hardshipType?.includes('disability')

    steps.push({
      id: 'hardship-request',
      title: 'Submit Hardship Exit Request',
      description: `Document your hardship in writing and submit to ${isMarriott ? 'Marriott' : 'the developer'} via certified mail. Financial hardship, medical issues, and age-related inability to travel are factors developers may consider.`,
      path: 'HARDSHIP',
      priority: 3,
      timeSensitive: false,
      estimatedCost: 'Free (postal fees)',
      estimatedTime: '30-60 days for response',
      difficulty: 'MEDIUM',
      documentsNeeded: [
        'Hardship letter',
        isMedical ? 'Medical documentation' : '',
        'Financial statements if applicable',
        'Certified mail receipt',
      ].filter(Boolean),
    })

    if (isElder || isMedical) {
      requiresAttorney = true
      attorneyReason = 'Elder or medical hardship cases may qualify for additional consumer protections. An attorney can help maximize your options.'
    }
  }

  // Rule 4: Issue-Based Complaint Path
  if (input.issueCategories?.length) {
    const hasComplaintWorthy = input.issueCategories.some(c =>
      ['MISREPRESENTATION', 'MAINTENANCE_FEE_ABUSE', 'EXIT_OBSTRUCTION'].includes(c)
    )

    if (hasComplaintWorthy) {
      triggeredPaths.push('COMPLAINT')
      const agencies = input.resortState === 'FL' ? FLORIDA_RULES.complaintAgencies : [
        { name: 'CFPB', url: 'https://www.consumerfinance.gov/complaint', priority: 1 },
        { name: 'FTC', url: 'https://reportfraud.ftc.gov', priority: 2 },
        { name: 'State Attorney General', url: '#', priority: 3 },
      ]

      steps.push({
        id: 'file-complaint',
        title: `File Consumer Complaint — ${agencies[0].name}`,
        description: `Based on identified issues, filing a complaint with ${agencies[0].name} is recommended. Complaints create a paper trail, may trigger investigations, and sometimes result in direct resolution.`,
        path: 'COMPLAINT',
        priority: 4,
        timeSensitive: false,
        estimatedCost: 'Free',
        estimatedTime: '30-90 days for response',
        difficulty: 'MEDIUM',
        documentsNeeded: ['Contract', 'Correspondence with developer', 'Evidence of issues', 'Timeline of events'],
      })
    }
  }

  // Rule 5: Scam Warnings
  if (input.priorExitCompany) {
    scamWarnings.push('You mentioned a prior third-party exit company. Beware of "recovery scams" — companies that charge fees to recover money lost to exit scams.')
    scamWarnings.push('Legitimate exit assistance is almost always free (developer programs) or billed hourly (attorneys). Upfront fees are a major red flag.')
  }

  scamWarnings.push(...MARRIOTT_RULES.redFlags.slice(0, 3))

  // Rule 6: Missing Evidence
  if (!input.purchaseDate) missingEvidence.push('Purchase date (required for rescission calculation)')
  if (!input.resortState) missingEvidence.push('Resort state (determines applicable laws)')
  if (!input.maintenanceFeeStatus) missingEvidence.push('Maintenance fee payment status')
  if (!input.loanBalance && input.loanBalance !== 0) missingEvidence.push('Current loan balance')

  // Rule 7: Low-likelihood fallback
  if (steps.length === 0) {
    triggeredPaths.push('GENERAL_EDUCATION')
    steps.push({
      id: 'gather-docs',
      title: 'Gather Your Contract Documents',
      description: 'Upload your full timeshare contract to enable a complete analysis. Key documents: original purchase agreement, all addenda, maintenance fee statements, and any correspondence with the developer.',
      path: 'GENERAL_EDUCATION',
      priority: 10,
      timeSensitive: false,
      estimatedCost: 'Free',
      estimatedTime: '1-2 hours',
      difficulty: 'EASY',
      documentsNeeded: ['Original purchase agreement', 'All addenda', 'Maintenance fee statements'],
    })
  }

  // Sort steps by priority
  steps.sort((a, b) => a.priority - b.priority)

  const actionabilityScore = computeActionabilityScore(input)

  return {
    triggeredPaths,
    actionSteps: steps,
    scamWarnings,
    missingEvidence,
    requiresAttorney,
    attorneyReason,
    actionabilityScore,
  }
}

function computeActionabilityScore(input: RulesEngineInput): ActionabilityScore {
  const factors: ScoreFactor[] = []

  // Factor 1: Rescission window (weight: 25)
  let rescissionScore = 0
  if (input.rescissionDeadline) {
    const daysRemaining = Math.ceil(
      (new Date(input.rescissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    rescissionScore = daysRemaining > 0 ? 100 : 0
  }
  factors.push({
    key: 'rescission_window_open',
    label: 'Rescission Window',
    weight: 0.25,
    score: rescissionScore,
    explanation: rescissionScore > 0
      ? 'Rescission window is still open — strongest possible option'
      : 'Rescission window has passed',
  })

  // Factor 2: Official exit path (weight: 15)
  const isMarriott = MARRIOTT_RULES.brandNames.some(b =>
    input.developerName?.toLowerCase().includes(b)
  )
  const officialExitScore = isMarriott ? 80 : 40
  factors.push({
    key: 'official_exit_path',
    label: 'Official Exit Program',
    weight: 0.15,
    score: officialExitScore,
    explanation: isMarriott
      ? 'Marriott has known deed-back and resale programs'
      : 'Developer exit programs unknown — research recommended',
  })

  // Factor 3: Document completeness (weight: 15)
  const knownFields = [
    input.purchaseDate,
    input.resortState,
    input.developerName,
    input.loanBalance !== undefined,
    input.maintenanceFeeAnnual,
    input.rescissionDeadline,
  ].filter(Boolean).length
  const docScore = Math.round((knownFields / 6) * 100)
  factors.push({
    key: 'document_completeness',
    label: 'Document Completeness',
    weight: 0.15,
    score: docScore,
    explanation: `${knownFields}/6 key data points found in documents`,
  })

  // Factor 4: Hardship (weight: 12)
  const hardshipScore = input.hasHardship ? 70 : 20
  factors.push({
    key: 'hardship',
    label: 'Documented Hardship',
    weight: 0.12,
    score: hardshipScore,
    explanation: input.hasHardship
      ? 'Hardship factors increase likelihood of developer accommodation'
      : 'No hardship documented',
  })

  // Factor 5: Financing burden (weight: 8)
  const financeScore = (!input.loanBalance || input.loanBalance === 0) ? 80 : 30
  factors.push({
    key: 'financing_burden',
    label: 'Financing Status',
    weight: 0.08,
    score: financeScore,
    explanation: financeScore === 80
      ? 'No outstanding loan — deed-back eligible'
      : 'Outstanding loan complicates exit options',
  })

  // Factor 6: Fee status (weight: 5)
  const feeScore = input.maintenanceFeeStatus === 'CURRENT' ? 80
    : input.maintenanceFeeStatus === 'DELINQUENT' ? 20 : 50
  factors.push({
    key: 'fee_status',
    label: 'Maintenance Fee Status',
    weight: 0.05,
    score: feeScore,
    explanation: input.maintenanceFeeStatus === 'CURRENT'
      ? 'Fees current — eligible for most programs'
      : input.maintenanceFeeStatus === 'DELINQUENT'
        ? 'Delinquent fees restrict exit options'
        : 'Fee status unknown',
  })

  const total = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  )

  const grade = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : total >= 35 ? 'D' : 'F'
  const label = total >= 80 ? 'Strong Options Available'
    : total >= 65 ? 'Good Options Available'
    : total >= 50 ? 'Moderate Options Available'
    : total >= 35 ? 'Limited Options — More Info Needed'
    : 'Minimal Options Identified'

  const topFactor = factors.sort((a, b) => (b.score * b.weight) - (a.score * a.weight))[0]

  return {
    total,
    grade,
    label,
    factors,
    explanation: `Score driven primarily by: ${topFactor.label}. ${total >= 50 ? 'Real action paths exist.' : 'Gathering more documents may reveal additional options.'}`,
  }
}
