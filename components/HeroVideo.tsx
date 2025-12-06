'use client'

import { Play, Info } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroVideoProps {
  title: string
  description: string
  imageUrl: string
  year: string
  duration: string
  rating: string
  genre: string
  videoId: string
}

export function HeroVideo({
  title,
  description,
  imageUrl,
  year,
  duration,
  rating,
  genre,
  videoId
}: HeroVideoProps) {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center pt-20 pb-12 overflow-hidden"
      aria-label={`Video destacado: ${title}`}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-50"
            priority
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 mb-6 text-lg">
            <span className="font-bold text-white">{rating}</span>
            <span className="text-white">•</span>
            <span className="text-white">{year}</span>
            <span className="text-white">•</span>
            <span className="text-white">{duration}</span>
            <span className="text-white">•</span>
            <span className="px-3 py-1 border border-white/40 text-xs rounded text-white bg-white/10 backdrop-blur-sm">
              {genre}
            </span>
          </div>

          {/* Description */}
          <p className="text-lg text-white mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4" role="group" aria-label="Acciones del video">
            <Link
              href={`/watch/${videoId}`}
              className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-lg"
              aria-label={`Reproducir ${title}`}
            >
              <Play className="w-6 h-6 fill-current" />
              Reproducir
            </Link>
            <Link
              href={`/watch/${videoId}`}
              className="px-8 py-4 bg-gray-600/70 text-white rounded-lg font-semibold hover:bg-gray-600/90 transition-colors flex items-center gap-2 text-lg backdrop-blur-sm"
              aria-label={`Más información sobre ${title}`}
            >
              <Info className="w-5 h-5" />
              Más Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}