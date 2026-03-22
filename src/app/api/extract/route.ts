import { NextRequest, NextResponse } from 'next/server'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase/server'
import { CONTRACT_EXTRACTION_PROMPT, SYSTEM_PROMPT_BASE } from '@/lib/prompts'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentText, caseId, documentId } = await req.json()

    if (!documentText || documentText.trim().length < 100) {
      return NextResponse.json({ error: 'Document text too short or empty' }, { status: 400 })
    }

    // Truncate to ~80k chars to stay within context limits
    const truncatedText = documentText.slice(0, 80000)
    const wasTruncated = documentText.length > 80000

    // Call Claude for extraction
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT_BASE,
      messages: [
        {
          role: 'user',
          content: CONTRACT_EXTRACTION_PROMPT + truncatedText,
        },
      ],
    })

    // Parse the JSON response
    const responseText = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    let extraction: Record<string, unknown>
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      extraction = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      console.error('Failed to parse Claude response:', parseErr)
      return NextResponse.json(
        { error: 'Failed to parse extraction result', rawResponse: responseText },
        { status: 422 }
      )
    }

    // Persist to Supabase
    const supabase = createServerClient()

    if (documentId) {
      await supabase
        .from('uploaded_documents')
        .update({ extraction_status: 'COMPLETE', extracted_at: new Date().toISOString() })
        .eq('id', documentId)
    }

    // Store extracted facts
    const facts = extraction.facts as Record<string, unknown>
    if (caseId && facts) {
      const factInserts = Object.entries(facts)
        .filter(([, value]) => value !== null)
        .map(([key, value]) => ({
          case_id: caseId,
          fact_key: key,
          fact_value: String(value),
          source_type: 'DOCUMENT',
          confidence: (extraction.confidence as number) ?? 0.7,
          document_id: documentId ?? null,
        }))

      if (factInserts.length > 0) {
        await supabase.from('extracted_facts').insert(factInserts)
      }

      // Store clauses
      const clauses = extraction.clauses as unknown[]
      if (clauses?.length) {
        const clauseInserts = clauses.map((clause: unknown) => ({
          case_id: caseId,
          document_id: documentId ?? null,
          ...(clause as Record<string, unknown>),
        }))
        await supabase.from('contract_clauses').insert(clauseInserts)
      }

      // Update case with extracted key facts
      const updates: Record<string, unknown> = {}
      if (facts.developer_name) updates.developer_name = facts.developer_name
      if (facts.resort_name) updates.resort_name = facts.resort_name
      if (facts.resort_state) updates.resort_state = facts.resort_state
      if (facts.purchase_date) updates.purchase_date = facts.purchase_date
      if (facts.purchase_price) updates.purchase_price = Number(facts.purchase_price)
      if (facts.loan_balance !== undefined) updates.loan_balance = Number(facts.loan_balance)
      if (facts.maintenance_fee_annual) updates.maintenance_fee_annual = Number(facts.maintenance_fee_annual)
      if (facts.rescission_deadline) updates.rescission_deadline = facts.rescission_deadline

      if (Object.keys(updates).length > 0) {
        updates.status = 'DOCUMENT_ANALYZED'
        await supabase.from('cases').update(updates).eq('id', caseId)
      }
    }

    return NextResponse.json({
      extraction,
      wasTruncated,
      model: CLAUDE_MODEL,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    })
  } catch (err) {
    console.error('POST /api/extract error:', err)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
