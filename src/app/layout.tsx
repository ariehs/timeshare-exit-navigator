import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timeshare Exit Navigator | Understand Your Options',
  description: 'Analyze your timeshare contract, understand your exit options, and take informed action. Not legal advice. Not a law firm.',
  keywords: 'timeshare exit, timeshare cancellation, Marriott Vacation Club, timeshare help, contract analysis',
  openGraph: {
    title: 'Timeshare Exit Navigator',
    description: 'Understand your timeshare exit options. Powered by document analysis.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-parchment-50">
        {children}
      </body>
    </html>
  )
}
