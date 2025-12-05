import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { CookieConsent } from '@/components/CookieConsent'
import { WebVitals } from '@/components/WebVitals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VLOCKSTER - Indie Cinema Platform',
  description:
    'Streaming, crowdfunding, and community for independent filmmakers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Saltar al contenido principal"
          tabIndex={0}
        >
          Saltar al contenido principal
        </a>
        {children}
        <CookieConsent />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  )
}
