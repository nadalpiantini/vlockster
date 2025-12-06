import Link from 'next/link'
import type { Route } from 'next'
import { ArrowRight, Play } from 'lucide-react'
import { ReactNode } from 'react'

export interface HeroSectionProps {
  title: string | ReactNode
  description: string
  backgroundImage?: string
  backgroundVideo?: string
  primaryCTA?: {
    label: string
    href: Route | string
    icon?: ReactNode
  }
  secondaryCTA?: {
    label: string
    href: Route | string
    icon?: ReactNode
  }
  badge?: string
  overlay?: 'dark' | 'gradient' | 'none'
  size?: 'default' | 'large'
}

export function HeroSection({
  title,
  description,
  backgroundImage,
  backgroundVideo,
  primaryCTA = {
    label: 'Get Started',
    href: '#',
    icon: <ArrowRight className="w-5 h-5" />,
  },
  secondaryCTA,
  badge,
  overlay = 'gradient',
  size = 'default',
}: HeroSectionProps) {
  const sizeClasses = {
    default: 'min-h-[70vh]',
    large: 'min-h-[90vh]',
  }

  const overlayClasses = {
    dark: 'bg-vlockster-black/70',
    gradient:
      'bg-gradient-to-r from-vlockster-black via-vlockster-black/80 to-transparent',
    none: '',
  }

  return (
    <section
      className={`relative ${sizeClasses[size]} flex items-center overflow-hidden`}
    >
      {/* Background Media */}
      {backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {!backgroundVideo && backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {!backgroundVideo && !backgroundImage && (
        <div className="absolute inset-0 w-full h-full bg-vlockster-black" />
      )}

      {/* Overlay */}
      {overlay !== 'none' && (
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-7xl">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-vlockster-red/95 text-vlockster-white text-sm font-semibold rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-vlockster-white rounded-full animate-pulse" />
              {badge}
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vlockster-white leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-vlockster-white-soft max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Primary CTA */}
            <Link
              href={primaryCTA.href as Route}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vlockster-red text-vlockster-white rounded-md font-semibold text-lg hover:bg-vlockster-red-dark transition-all duration-200 shadow-lg hover:shadow-vlockster-red/50"
            >
              {primaryCTA.icon && <Play className="w-5 h-5" />}
              {primaryCTA.label}
            </Link>

            {/* Secondary CTA */}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href as Route}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vlockster-white/10 text-vlockster-white rounded-md font-semibold text-lg hover:bg-vlockster-white/20 transition-all duration-200 backdrop-blur-sm border border-vlockster-white/20"
              >
                {secondaryCTA.label}
                {secondaryCTA.icon || <ArrowRight className="w-5 h-5" />}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vlockster-black to-transparent" />
    </section>
  )
}
