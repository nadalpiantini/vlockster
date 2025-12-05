import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidar cada hora

export const metadata: Metadata = {
  title: 'VLOCKSTER - Independent Cinema Platform',
  description: 'Streaming, crowdfunding, and community for independent filmmakers. Watch, fund, and be part of extraordinary stories.',
  keywords: ['independent cinema', 'streaming', 'crowdfunding', 'indie films', 'creators', 'cinema community'],
  openGraph: {
    title: 'VLOCKSTER - Independent Cinema Platform',
    description: 'Streaming, crowdfunding, and community for independent filmmakers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VLOCKSTER - Independent Cinema Platform',
    description: 'Streaming, crowdfunding, and community for independent filmmakers',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-full max-w-md px-8">
        <div className="relative w-full aspect-square max-w-md">
          <Image
            src="/items/vlockster_logo.jpeg"
            alt="VLOCKSTER Logo"
            fill
            className="object-contain"
            style={{
              filter: 'brightness(0) invert(1)',
            }}
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}
