import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal mx-auto mb-3" />
        <p className="text-ink/40 font-sans text-sm">Loading...</p>
      </div>
    </div>
  )
}
