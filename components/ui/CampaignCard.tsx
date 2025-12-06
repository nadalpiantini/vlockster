import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Heart, Users } from 'lucide-react'
import { ProgressBar } from './ProgressBar'

export interface CampaignCardProps {
  id: string
  title: string
  creator: string
  thumbnail: string
  current: number
  goal: number
  backers: number
  daysLeft: number
  category?: string
  href?: Route | string
  onLike?: () => void
  isLiked?: boolean
  featured?: boolean
}

export function CampaignCard({
  id,
  title,
  creator,
  thumbnail,
  current,
  goal,
  backers,
  daysLeft,
  category,
  href,
  onLike,
  isLiked = false,
  featured = false,
}: CampaignCardProps) {
  const cardHref = href || `/projects/${id}`
  const percentage = Math.min((current / goal) * 100, 100)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div
      className={`group relative bg-vlockster-gray-dark rounded-lg overflow-hidden hover:ring-2 hover:ring-vlockster-red transition-all duration-300 ${
        featured ? 'ring-2 ring-vlockster-gold' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-vlockster-gold text-vlockster-black text-xs font-bold rounded-full">
          FEATURED
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onLike?.()
        }}
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-vlockster-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-vlockster-red transition-colors border border-vlockster-white/10"
        aria-label={isLiked ? 'Unlike project' : 'Like project'}
      >
        <Heart
          className={`w-5 h-5 ${
            isLiked
              ? 'fill-vlockster-red text-vlockster-red'
              : 'text-vlockster-white'
          }`}
        />
      </button>

      {/* Thumbnail */}
      <Link href={cardHref as Route} className="block relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-vlockster-black via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-vlockster-black/80 backdrop-blur-sm text-vlockster-white text-xs font-semibold rounded">
            {category}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Creator */}
        <div>
          <Link
            href={cardHref as Route}
            className="block group-hover:text-vlockster-red transition-colors"
          >
            <h3 className="text-lg font-bold text-vlockster-white line-clamp-2 mb-1">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-vlockster-gray-text">by {creator}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xl font-bold text-vlockster-white">
                {formatCurrency(current)}
              </div>
              <div className="text-xs text-vlockster-gray-text">
                raised of {formatCurrency(goal)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-vlockster-green">
                {percentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-vlockster-black rounded-full overflow-hidden">
            <div
              className="h-full bg-vlockster-green transition-all duration-700 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-vlockster-gray">
          <div className="flex items-center gap-1.5 text-vlockster-gray-text">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {formatNumber(backers)}
            </span>
          </div>
          <div className="text-sm text-vlockster-gray-text">
            {daysLeft} days left
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact variant for smaller spaces
export interface CompactCampaignCardProps {
  id: string
  title: string
  thumbnail: string
  current: number
  goal: number
  href?: Route | string
}

export function CompactCampaignCard({
  id,
  title,
  thumbnail,
  current,
  goal,
  href,
}: CompactCampaignCardProps) {
  const cardHref = href || `/projects/${id}`
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <Link
      href={cardHref as Route}
      className="block group bg-vlockster-gray-dark rounded-lg overflow-hidden hover:ring-2 hover:ring-vlockster-red transition-all"
    >
      <div className="relative aspect-video">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3 space-y-2">
        <h4 className="text-sm font-semibold text-vlockster-white line-clamp-2 group-hover:text-vlockster-red transition-colors">
          {title}
        </h4>
        <div className="w-full h-1.5 bg-vlockster-black rounded-full overflow-hidden">
          <div
            className="h-full bg-vlockster-green transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
