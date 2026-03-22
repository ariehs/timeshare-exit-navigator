'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-7 h-7 text-rose" />
      </div>
      <h1 className="text-3xl font-serif text-ink mb-3">Something went wrong</h1>
      <p className="text-ink/50 font-sans mb-8 max-w-sm text-sm">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  )
}
