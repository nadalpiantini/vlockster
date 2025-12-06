'use client'

import Link from 'next/link'
import Image from 'next/image'

interface BrandHeaderProps {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function BrandHeader({ showText = true, size = 'md' }: BrandHeaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link
      href="/"
      className="flex items-center space-x-3 group"
      aria-label="VLOCKSTER - Ir al inicio"
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/items/vlockster_logo.png"
          alt="VLOCKSTER Logo"
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          priority
        />
      </div>
      {showText && (
        <span
          className={`${textSizes[size]} font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent`}
        >
          VLOCKSTER
        </span>
      )}
    </Link>
  )
}

