'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

interface UploadedFile {
  id: string
  file_name: string
  file_type: string
  file_size_bytes: number
  extraction_status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED'
}

interface DocumentUploadProps {
  caseId: string
  userId?: string
  onExtracted?: (extraction: unknown) => void
}

export default function DocumentUpload({ caseId, userId = 'demo-user', onExtracted }: DocumentUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractionResult, setExtractionResult] = useState<unknown>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('caseId', caseId)

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'x-user-id': userId },
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Upload failed')
      }

      const { document } = await res.json()
      setUploadedDoc(document)

      // Auto-trigger extraction if PDF
      if (file.type === 'application/pdf') {
        await extractText(document.id, file)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [caseId, userId])

  const extractText = async (documentId: string, file: File) => {
    setExtracting(true)
    try {
      // Read file as text (PDF.js would be better in prod — this is a simplified version)
      const text = await file.text().catch(() => '')

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ documentText: text, caseId, documentId }),
      })

      if (!res.ok) throw new Error('Extraction failed')
      const data = await res.json()
      setExtractionResult(data.extraction)
      setUploadedDoc(prev => prev ? { ...prev, extraction_status: 'COMPLETE' } : null)
      onExtracted?.(data.extraction)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed')
      setUploadedDoc(prev => prev ? { ...prev, extraction_status: 'FAILED' } : null)
    } finally {
      setExtracting(false)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!uploadedDoc && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${dragging ? 'border-teal bg-teal-50' : 'border-parchment-400 hover:border-teal/40 hover:bg-parchment-100'}`}
        >
          <input
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={onInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal" />
              <p className="text-sm font-sans text-ink/60">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-parchment-200 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-ink/40" />
              </div>
              <div>
                <p className="font-medium font-sans text-ink text-sm">
                  {dragging ? 'Drop it here' : 'Upload your contract'}
                </p>
                <p className="text-xs text-ink/40 font-sans mt-1">PDF, JPG, PNG up to 20MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded file */}
      {uploadedDoc && (
        <div className={`rounded-xl border p-4 
          ${uploadedDoc.extraction_status === 'COMPLETE' ? 'border-teal-200 bg-teal-50' :
            uploadedDoc.extraction_status === 'FAILED' ? 'border-rose-200 bg-rose-50' :
            'border-parchment-300 bg-white'}`}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-white rounded-lg border border-parchment-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-ink/40" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium font-sans text-sm text-ink truncate">{uploadedDoc.file_name}</div>
              <div className="text-xs text-ink/40 font-sans">{formatSize(uploadedDoc.file_size_bytes)}</div>
              <div className="mt-2 flex items-center gap-2">
                {extracting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin text-teal" /><span className="text-xs text-teal font-sans">Extracting with AI...</span></>
                ) : uploadedDoc.extraction_status === 'COMPLETE' ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-teal" /><span className="text-xs text-teal font-sans">Extraction complete</span></>
                ) : uploadedDoc.extraction_status === 'FAILED' ? (
                  <><AlertTriangle className="w-3.5 h-3.5 text-rose" /><span className="text-xs text-rose font-sans">Extraction failed</span></>
                ) : (
                  <span className="text-xs text-ink/40 font-sans">Uploaded</span>
                )}
              </div>
            </div>
            <button
              onClick={() => { setUploadedDoc(null); setExtractionResult(null) }}
              className="text-ink/30 hover:text-ink/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="warning-box text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Extraction preview */}
      {extractionResult && (
        <div className="card text-xs">
          <div className="section-label mb-2">Extracted Facts Preview</div>
          <div className="space-y-1.5 font-mono">
            {Object.entries((extractionResult as Record<string, unknown>).facts ?? {})
              .filter(([, v]) => v !== null)
              .slice(0, 8)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-ink/40">{key.replace(/_/g, ' ')}</span>
                  <span className="text-ink font-medium truncate max-w-[200px]">{String(value)}</span>
                </div>
              ))}
          </div>
          <p className="text-ink/30 mt-3 font-sans text-xs">
            Confidence: {Math.round(((extractionResult as Record<string, number>).confidence ?? 0) * 100)}%
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer-box text-xs">
        Your document is stored securely and used only to generate your analysis. 
        Extraction results are labeled with confidence scores and source type.
      </div>
    </div>
  )
}
