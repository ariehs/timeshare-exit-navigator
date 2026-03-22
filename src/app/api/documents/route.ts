import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const caseId = formData.get('caseId') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

    // Validate file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and image files are supported' },
        { status: 400 }
      )
    }

    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File exceeds 20MB limit' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verify case ownership
    const { data: caseData } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .eq('user_id', userId)
      .single()

    if (!caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() ?? 'pdf'
    const storagePath = `${userId}/${caseId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Create signed URL (1 hour)
    const { data: signedData } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600)

    // Record in DB
    const { data: doc, error: dbError } = await supabase
      .from('uploaded_documents')
      .insert({
        case_id: caseId,
        user_id: userId,
        file_name: file.name,
        file_type: file.type,
        file_size_bytes: file.size,
        storage_path: storagePath,
        extraction_status: 'PENDING',
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({
      document: doc,
      signedUrl: signedData?.signedUrl,
      message: 'Upload successful. Call /api/extract to analyze this document.',
    }, { status: 201 })
  } catch (err) {
    console.error('POST /api/documents error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const caseId = req.nextUrl.searchParams.get('caseId')
    if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

    const supabase = createServerClient()

    const { data: docs } = await supabase
      .from('uploaded_documents')
      .select('id, file_name, file_type, file_size_bytes, extraction_status, extracted_at, created_at')
      .eq('case_id', caseId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return NextResponse.json({ documents: docs ?? [] })
  } catch (err) {
    console.error('GET /api/documents error:', err)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
