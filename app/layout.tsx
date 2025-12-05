import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from '@/components/CookieConsent'

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
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
