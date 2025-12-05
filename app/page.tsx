import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VLOCKSTER',
  description: 'VLOCKSTER',
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
