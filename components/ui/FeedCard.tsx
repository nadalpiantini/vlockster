import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

export interface FeedCardProps {
  id: string
  author: {
    name: string
    avatar: string
    role?: 'creator' | 'moderator' | 'viewer'
    href?: Route | string
  }
  content: string
  media?: {
    type: 'image' | 'video'
    url: string
    alt?: string
  }
  timestamp: string
  likes: number
  comments: number
  shares?: number
  isLiked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onMore?: () => void
  href?: Route | string
}

export function FeedCard({
  id: _id,
  author,
  content,
  media,
  timestamp,
  likes,
  comments,
  shares,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  onMore,
  href,
}: FeedCardProps) {
  const roleColors = {
    creator: 'bg-vlockster-gold text-vlockster-black',
    moderator: 'bg-vlockster-red text-vlockster-white',
    viewer: 'bg-vlockster-gray text-vlockster-white',
  }

  const roleBadge = author.role && author.role !== 'viewer' && (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded ${roleColors[author.role]}`}
    >
      {author.role.toUpperCase()}
    </span>
  )

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <article className="bg-vlockster-gray-dark rounded-lg overflow-hidden hover:ring-2 hover:ring-vlockster-white/10 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <Link
            href={(author.href || `/profile/${author.name}`) as Route}
            className="flex-shrink-0"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-vlockster-gray hover:ring-vlockster-red transition-colors">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={(author.href || `/profile/${author.name}`) as Route}
                className="font-semibold text-vlockster-white hover:text-vlockster-red transition-colors"
              >
                {author.name}
              </Link>
              {roleBadge}
            </div>
            <time className="text-sm text-vlockster-gray-text">
              {timestamp}
            </time>
          </div>
        </div>

        {/* More Options */}
        {onMore && (
          <button
            onClick={onMore}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-vlockster-white/10 flex items-center justify-center transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5 text-vlockster-gray-text" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-vlockster-white whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      </div>

      {/* Media */}
      {media && (
        <div className="relative w-full aspect-video bg-vlockster-black">
          {media.type === 'image' ? (
            <Image
              src={media.url}
              alt={media.alt || 'Post media'}
              fill
              className="object-contain"
            />
          ) : (
            <video
              src={media.url}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-5 py-4 border-t border-vlockster-gray">
        {/* Like */}
        <button
          onClick={onLike}
          className="flex items-center gap-2 group transition-colors"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked
                ? 'fill-vlockster-red text-vlockster-red'
                : 'text-vlockster-gray-text group-hover:text-vlockster-red'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isLiked
                ? 'text-vlockster-red'
                : 'text-vlockster-gray-text group-hover:text-vlockster-white'
            }`}
          >
            {formatNumber(likes)}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={onComment}
          className="flex items-center gap-2 group transition-colors"
          aria-label="Comment"
        >
          <MessageCircle className="w-5 h-5 text-vlockster-gray-text group-hover:text-vlockster-white transition-colors" />
          <span className="text-sm font-medium text-vlockster-gray-text group-hover:text-vlockster-white">
            {formatNumber(comments)}
          </span>
        </button>

        {/* Share */}
        {shares !== undefined && (
          <button
            onClick={onShare}
            className="flex items-center gap-2 group transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-vlockster-gray-text group-hover:text-vlockster-white transition-colors" />
            <span className="text-sm font-medium text-vlockster-gray-text group-hover:text-vlockster-white">
              {formatNumber(shares)}
            </span>
          </button>
        )}

        {/* View Post Link */}
        {href && (
          <Link
            href={href as Route}
            className="ml-auto text-sm font-medium text-vlockster-red hover:text-vlockster-red-light transition-colors"
          >
            View Post
          </Link>
        )}
      </div>
    </article>
  )
}

// Compact variant for sidebars
export interface CompactFeedCardProps {
  author: string
  content: string
  timestamp: string
  href?: Route | string
}

export function CompactFeedCard({
  author,
  content,
  timestamp,
  href,
}: CompactFeedCardProps) {
  return (
    <Link
      href={(href || '#') as Route}
      className="block p-4 bg-vlockster-gray-dark rounded-lg hover:bg-vlockster-card-hover transition-colors"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-vlockster-white">
            {author}
          </span>
          <time className="text-xs text-vlockster-gray-text">{timestamp}</time>
        </div>
        <p className="text-sm text-vlockster-white-soft line-clamp-2">
          {content}
        </p>
      </div>
    </Link>
  )
}
