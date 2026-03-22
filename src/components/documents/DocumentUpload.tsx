'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2, CheckCircle, AlertTriangle, ChevronDown, Info } from 'lucide-react'
import { DOCUMENT_TYPES, DOCUMENT_TYPE_GROUPS, DocumentTypeKey, getDocumentSufficiency } from '@/lib/document-types'

interface UploadedFile {
  id: string
  file_name: string
  file_type: string
  file_size_bytes: number
  extraction_status: string
  document_type?: DocumentTypeKey
}

interface DocumentUploadProps {
  caseId: string
  userId?: string
  uploadedTypes?: DocumentTypeKey[]
  onExtracted?: (extraction: unknown, docType: DocumentTypeKey) => void
  onUploaded?: (doc: UploadedFile) => void
}

export default function DocumentUpload({
  caseId, userId = 'demo-user', uploadedTypes = [], onExtracted, onUploaded,
}: DocumentUploadProps) {
  const [selectedType, setSelectedType] = useState<DocumentTypeKey>('PURCHASE_CONTRACT')
  const [typePickerOpen, setTypePickerOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractionResult, setExtractionResult] = useState<Record<string, unknown> | null>(null)

  const cfg = DOCUMENT_TYPES[selectedType]
  const sufficiency = getDocumentSufficiency([...uploadedTypes, ...(uploadedDoc ? [selectedType] : [])])
  const sufficiencyColor = sufficiency.score >= 60 ? 'bg-teal-500' : sufficiency.score >= 25 ? 'bg-gold-500' : 'bg-parchment-300'

  const handleFile = useCallback(async (file: File) => {
    setError(null); setUploading(true); setTypePickerOpen(false)
    try {
      const fd = new FormData()
      fd.append('file', file); fd.append('caseId', caseId); fd.append('documentType', selectedType)
      const res = await fetch('/api/documents', { method: 'POST', headers: { 'x-user-id': userId }, body: fd })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed')
      const { document } = await res.json()
      const doc: UploadedFile = { ...document, document_type: selectedType }
      setUploadedDoc(doc); onUploaded?.(doc)
      setExtracting(true)
      const text = await file.text().catch(() => '')
      const exRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ documentText: text, caseId, documentId: document.id, documentType: selectedType }),
      })
      if (!exRes.ok) throw new Error('Extraction failed')
      const exData = await exRes.json()
      setExtractionResult(exData.extraction)
      setUploadedDoc(prev => prev ? { ...prev, extraction_status: 'COMPLETE' } : null)
      onExtracted?.(exData.extraction, selectedType)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
      setUploadedDoc(prev => prev ? { ...prev, extraction_status: 'FAILED' } : null)
    } finally {
      setUploading(false); setExtracting(false)
    }
  }, [caseId, userId, selectedType, onExtracted, onUploaded])

  const fmt = (b: number) => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1048576).toFixed(1)} MB`

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium font-sans text-ink mb-2">What type of document?</label>
        <div className="relative">
          <button onClick={() => setTypePickerOpen(!typePickerOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-parchment-300 rounded-xl hover:border-teal/40 transition-colors text-left">
            <span className="text-xl">{cfg.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium font-sans text-sm text-ink">{cfg.label}</div>
              <div className="text-xs text-ink/40 font-sans truncate">{cfg.description}</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink/30 flex-shrink-0 transition-transform ${typePickerOpen ? 'rotate-180' : ''}`} />
          </button>
          {typePickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-parchment-300 rounded-xl shadow-xl z-30 max-h-72 overflow-y-auto">
              {DOCUMENT_TYPE_GROUPS.map(group => (
                <div key={group.label}>
                  <div className="px-4 py-2 bg-parchment-50 border-b border-parchment-200 sticky top-0">
                    <div className="text-xs font-semibold text-ink/50 uppercase tracking-wide">{group.label}</div>
                  </div>
                  {group.types.map(t => {
                    const tc = DOCUMENT_TYPES[t]
                    return (
                      <button key={t} onClick={() => { setSelectedType(t); setTypePickerOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-parchment-50 text-left transition-colors ${selectedType === t ? 'bg-teal-50' : ''}`}>
                        <span className="text-base flex-shrink-0">{tc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-sans font-medium ${selectedType === t ? 'text-teal' : 'text-ink'}`}>
                            {tc.shortLabel}
                            {uploadedTypes.includes(t) && <span className="ml-2 text-xs text-teal/50">✓ uploaded</span>}
                          </div>
                          <div className="text-xs text-ink/40 font-sans truncate">{tc.description}</div>
                        </div>
                        <span className="text-xs text-ink/30 font-mono flex-shrink-0">{Math.round(tc.confidenceCeiling*100)}%</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        {cfg.limitationNote && (
          <div className="mt-2 flex items-start gap-1.5 text-xs text-gold-700 font-sans">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />{cfg.limitationNote}
          </div>
        )}
        {cfg.unlocksFields.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cfg.unlocksFields.slice(0, 5).map(f => (
              <span key={f} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-sans rounded border border-teal-100">
                {f.replace(/_/g, ' ')}
              </span>
            ))}
            {cfg.unlocksFields.length > 5 && <span className="text-xs text-ink/30 font-sans self-center">+{cfg.unlocksFields.length - 5} more</span>}
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink/30 font-sans">Evidence only — strengthens {cfg.strengthensPaths.join(', ')} path</p>
        )}
      </div>

      {!uploadedDoc && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if(f) handleFile(f) }}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${dragging ? 'border-teal bg-teal-50' : 'border-parchment-400 hover:border-teal/40 hover:bg-parchment-50'}`}
        >
          <input type="file" accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f) }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal" />
              <p className="text-sm font-sans text-ink/60">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="text-3xl">{cfg.icon}</span>
              <div>
                <p className="font-medium font-sans text-sm text-ink">{dragging ? 'Drop it here' : `Upload ${cfg.shortLabel}`}</p>
                <p className="text-xs text-ink/40 font-sans mt-1">PDF, JPG, PNG · max 20MB</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink/30 font-sans">
                <Upload className="w-3 h-3" /> drag & drop or click
              </div>
            </div>
          )}
        </div>
      )}

      {uploadedDoc ? (
        <div className={`rounded-xl border p-4 ${uploadedDoc.extraction_status === 'COMPLETE' ? 'border-teal-200 bg-teal-50' : uploadedDoc.extraction_status === 'FAILED' ? 'border-rose-200 bg-rose-50' : 'border-parchment-300 bg-white'}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg border border-parchment-200 flex items-center justify-center flex-shrink-0 text-lg">{cfg.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium font-sans text-sm text-ink truncate">{uploadedDoc.file_name}</div>
              <div className="text-xs text-ink/40 font-sans">{cfg.shortLabel} · {fmt(uploadedDoc.file_size_bytes)}</div>
              <div className="mt-1 flex items-center gap-1.5">
                {extracting ? (<><Loader2 className="w-3.5 h-3.5 animate-spin text-teal" /><span className="text-xs text-teal font-sans">Extracting...</span></>) :
                 uploadedDoc.extraction_status === 'COMPLETE' ? (<><CheckCircle className="w-3.5 h-3.5 text-teal" /><span className="text-xs text-teal font-sans">Done · {Math.round(((extractionResult?.confidence as number) ?? 0)*100)}% confidence</span></>) :
                 uploadedDoc.extraction_status === 'FAILED' ? (<><AlertTriangle className="w-3.5 h-3.5 text-rose" /><span className="text-xs text-rose font-sans">Extraction failed</span></>) :
                 <span className="text-xs text-ink/40 font-sans">Uploaded</span>}
              </div>
            </div>
            <button onClick={() => { setUploadedDoc(null); setExtractionResult(null); setError(null) }} className="text-ink/20 hover:text-ink/50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {extractionResult ? (
        <div className="bg-parchment-50 rounded-xl border border-parchment-200 p-4 text-xs">
          <div className="flex justify-between mb-2">
            <span className="section-label">Extracted Facts</span>
            <span className="font-mono text-ink/30">{Math.round((extractionResult.confidence as number)*100)}% conf</span>
          </div>
          <div className="space-y-1.5 font-mono">
            {Object.entries((extractionResult.facts as Record<string,unknown>) ?? {})
              .filter(([,v]) => v !== null && v !== undefined).slice(0,7)
              .map(([k,v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-ink/40 flex-shrink-0">{k.replace(/_/g,' ')}</span>
                  <span className="text-ink font-medium truncate">{String(v)}</span>
                </div>
              ))}
          </div>
          {(extractionResult.warnings as string[]|undefined)?.length ? (
            <p className="mt-2 text-rose/70 font-sans">{(extractionResult.warnings as string[]).slice(0,1).join('')}</p>
          ) : null}
          {(extractionResult.missing_items as string[]|undefined)?.length ? (
            <p className="mt-1 text-gold-600/70 font-sans">Missing: {(extractionResult.missing_items as string[]).slice(0,3).join(', ')}</p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className="warning-box text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />{error}
        </div>
      ) : null}

      <div className="space-y-1">
        <div className="flex justify-between text-xs font-sans text-ink/40">
          <span>Evidence coverage</span><span>{sufficiency.score}%</span>
        </div>
        <div className="h-1.5 bg-parchment-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${sufficiencyColor}`} style={{ width: `${Math.min(sufficiency.score,100)}%` }} />
        </div>
        <p className="text-xs text-ink/40 font-sans">{sufficiency.message}</p>
      </div>
    </div>
  )
}
