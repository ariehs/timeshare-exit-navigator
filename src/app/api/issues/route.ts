import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

    const supabase = createServerClient()

    // Verify ownership
    const { data: caseData } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .eq('user_id', userId)
      .single()

    if (!caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const { data: issues } = await supabase
      .from('issue_flags')
      .select('*')
      .eq('case_id', caseId)
      .order('severity', { ascending: true })

    return NextResponse.json({ issues: issues ?? [] })
  } catch (err) {
    console.error('GET /api/issues error:', err)
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}
