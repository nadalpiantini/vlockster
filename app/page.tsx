import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VLOCKSTER',
  description: 'VLOCKSTER',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md px-8">
        <Image
          src="/items/vlockster_logo.png"
          alt="VLOCKSTER Logo"
          width={800}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  )
}
