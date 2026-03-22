import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
        <ShieldCheck className="w-7 h-7 text-teal" />
      </div>
      <h1 className="text-4xl font-serif text-ink mb-3">Page not found</h1>
      <p className="text-ink/50 font-sans mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary">
        Return home
      </Link>
    </div>
  )
}
