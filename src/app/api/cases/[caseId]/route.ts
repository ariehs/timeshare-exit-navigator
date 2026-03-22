import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', params.caseId)
      .eq('user_id', userId)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/cases/[caseId] error:', err)
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const updates = await req.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('cases')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', params.caseId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH /api/cases/[caseId] error:', err)
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 })
  }
}
