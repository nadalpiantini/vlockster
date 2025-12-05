import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { CookieConsent } from '@/components/CookieConsent'
import { WebVitals } from '@/components/WebVitals'
import { inter, spaceGrotesk } from './fonts'

export const metadata: Metadata = {
  title: 'VLOCKSTER | cine independiente, Streaming & Crowdfunding',
  description:
    'Streaming, crowdfunding y comunidad para cine independiente en VLOCKSTER',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Skip to main content"
          tabIndex={0}
        >
          Skip to main content
        </a>
        {children}
        <CookieConsent />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  )
}
