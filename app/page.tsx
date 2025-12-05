'use client'

import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Logo */}
      <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
        <div className="relative w-full max-w-[240px] sm:max-w-[288px] md:max-w-[384px] lg:max-w-[384px]">
          <Image
            src="/items/vlockster_logo.jpeg"
            alt="VLOCKSTER Logo"
            width={450}
            height={450}
            className="w-full h-auto object-contain"
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}
