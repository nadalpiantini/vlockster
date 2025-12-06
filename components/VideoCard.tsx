'use client'

import { useState } from 'react'
import { Play, Info } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface VideoCardProps {
  id: string
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  uploader?: { name: string | null; public_profile_slug: string | null } | null
  duration?: string
  year?: string
  rating?: string
  className?: string
}

export function VideoCard({
  id,
  title,
  description = null,
  thumbnailUrl = null,
  uploader = null,
  duration,
  year,
  rating,
  className = ''
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link 
      href={`/watch/${id}`} 
      className={cn(
        "group relative flex-shrink-0 transition-all duration-300 ease-in-out",
        "hover:z-10 hover:scale-110 hover:shadow-2xl",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:z-10 focus:scale-110",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Ver video: ${title}`}
    >
      {/* Card container */}
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-gray-900",
        "transition-all duration-300 ease-in-out",
        "aspect-[2/3] w-48 md:w-56",
        "hover:rounded-none", // Netflix-style edge-to-edge hover
      )}>
        {/* Thumbnail */}
        <div className="absolute inset-0 bg-gray-800">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-4xl" aria-label="Sin miniatura">🎬</span>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent",
          "transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />

        {/* Play and Info buttons on hover */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "flex gap-3",
          "transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <button 
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
            aria-label={`Reproducir ${title}`}
          >
            <Play className="w-5 h-5 ml-0.5 text-black fill-current" />
          </button>
          <button 
            className="w-12 h-12 rounded-full bg-gray-800/70 flex items-center justify-center hover:bg-gray-700/70 transition-colors backdrop-blur-sm shadow-lg"
            aria-label={`Más información sobre ${title}`}
          >
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Title overlay */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-3",
          "bg-gradient-to-t from-black/90 to-transparent",
          "transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
          <h3 className="font-bold text-white truncate text-sm">
            {title}
          </h3>
          {uploader?.name && (
            <p className="text-xs text-gray-300 truncate">
              Por: {uploader.name}
            </p>
          )}
        </div>

        {/* Extended info on hover */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4",
          "translate-y-full group-hover:translate-y-0 transition-transform duration-300",
          isHovered ? "translate-y-0" : ""
        )}>
          <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
          {year && (
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
              <span>{year}</span>
              {duration && (
                <>
                  <span>•</span>
                  <span>{duration}</span>
                </>
              )}
              {rating && (
                <>
                  <span>•</span>
                  <span>{rating}</span>
                </>
              )}
            </div>
          )}
          <p className="text-xs text-gray-200 line-clamp-3 mb-2">
            {description || 'No description available'}
          </p>
          {uploader?.name && (
            <p className="text-xs text-gray-300">
              Por: {uploader.name}
            </p>
          )}
        </div>

        {/* Netflix-style badge */}
        <div className={cn(
          "absolute top-3 right-3",
          "px-2 py-1 rounded bg-black/70 backdrop-blur-sm",
          "text-xs font-bold text-white"
        )}>
          HD
        </div>
      </div>
    </Link>
  )
}