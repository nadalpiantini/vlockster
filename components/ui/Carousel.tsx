'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReactNode, useRef, useState } from 'react'

export interface CarouselProps {
  title?: string
  subtitle?: string
  children: ReactNode
  itemWidth?: number
  gap?: number
  showControls?: boolean
  className?: string
}

export function Carousel({
  title,
  subtitle,
  children,
  itemWidth = 300,
  gap = 16,
  showControls = true,
  className = '',
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = itemWidth * 3 + gap * 2
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })

    setTimeout(checkScroll, 300)
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4 px-4 md:px-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-vlockster-white mb-1">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-vlockster-gray-text text-sm">{subtitle}</p>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showControls && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-vlockster-black via-vlockster-black/80 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 rounded-full bg-vlockster-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-vlockster-white/20 transition-colors border border-vlockster-white/20">
              <ChevronLeft className="w-6 h-6 text-vlockster-white" />
            </div>
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>

        {/* Right Arrow */}
        {showControls && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-vlockster-black via-vlockster-black/80 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 rounded-full bg-vlockster-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-vlockster-white/20 transition-colors border border-vlockster-white/20">
              <ChevronRight className="w-6 h-6 text-vlockster-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

// Carousel Item Component
export interface CarouselItemProps {
  children: ReactNode
  width?: number
  className?: string
}

export function CarouselItem({
  children,
  width = 300,
  className = '',
}: CarouselItemProps) {
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  )
}
