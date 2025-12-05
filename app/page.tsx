'use client'

import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
      {/* Logo */}
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
  )
}
