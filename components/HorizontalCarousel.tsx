'use client'

import { ReactNode } from 'react'

interface HorizontalCarouselProps {
  title: string
  children: ReactNode
  showAllLink?: string
}

export function HorizontalCarousel({ title, children, showAllLink }: HorizontalCarouselProps) {
  return (
    <section className="mb-8" role="region" aria-labelledby={`carousel-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 
          id={`carousel-${title.toLowerCase().replace(/\s+/g, '-')}`} 
          className="text-xl md:text-2xl font-bold text-white"
        >
          {title}
        </h2>
        {showAllLink && (
          <a 
            href={showAllLink} 
            className="text-red-500 hover:text-red-400 text-sm font-medium"
            aria-label={`Ver todos los ${title.toLowerCase()}`}
          >
            Ver todo
          </a>
        )}
      </div>
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]"
        role="list"
        aria-label={title}
      >
        {children}
      </div>
    </section>
  )
}