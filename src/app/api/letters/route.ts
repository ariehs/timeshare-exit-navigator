import { NextRequest, NextResponse } from 'next/server'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase/server'
import {
  RESCISSION_LETTER_PROMPT,
  COMPLAINT_LETTER_PROMPT,
  SYSTEM_PROMPT_BASE,
} from '@/lib/prompts'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { caseId, letterType, agencyName } = await req.json()
    if (!caseId || !letterType) {
      return NextResponse.json({ error: 'caseId and letterType required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: caseData } = await supabase
      .from('cases')
      .select('*, extracted_facts(*), issue_flags(*)')
      .eq('id', caseId)
      .eq('user_id', userId)
      .single()

    if (!caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const contextString = JSON.stringify(caseData, null, 2)

    let prompt: string
    switch (letterType) {
      case 'RESCISSION':
        prompt = RESCISSION_LETTER_PROMPT
        break
      case 'COMPLAINT':
        prompt = COMPLAINT_LETTER_PROMPT + `\nAgency: ${agencyName ?? 'State Regulatory Agency'}\n`
        break
      default:
        return NextResponse.json({ error: `Unknown letter type: ${letterType}` }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT_BASE,
      messages: [{ role: 'user', content: prompt + contextString }],
    })

    const responseText = response.content.filter(b => b.type === 'text').map(b => b.text).join('')

    let letterData: Record<string, unknown> = {}
    try {
      const match = responseText.match(/\{[\s\S]*\}/)
      if (match) letterData = JSON.parse(match[0])
    } catch {
      letterData = { body: responseText, subject: `${letterType} Letter` }
    }

    // Persist letter
    const { data: letter } = await supabase
      .from('generated_letters')
      .insert({
        case_id: caseId,
        letter_type: letterType,
        subject: letterData.subject,
        body: letterData.body,
        sending_instructions: letterData.sending_instructions,
        agency_name: agencyName,
        generated_by: 'AI',
        status: 'DRAFT',
      })
      .select()
      .single()

    return NextResponse.json({ letter, letterData })
  } catch (err) {
    console.error('POST /api/letters error:', err)
    return NextResponse.json({ error: 'Letter generation failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

    const supabase = createServerClient()
    const { data: letters } = await supabase
      .from('generated_letters')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })

    return NextResponse.json({ letters: letters ?? [] })
  } catch (err) {
    console.error('GET /api/letters error:', err)
    return NextResponse.json({ error: 'Failed to fetch letters' }, { status: 500 })
  }
}
