'use client'

import Link from 'next/link'
import { MessageCircle, Heart, Share2, MoreHorizontal, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface CommunityPostProps {
  id: string
  title: string
  content: string
  author: {
    name: string | null
    avatar?: string | null
    role?: string
  }
  community: string
  createdAt: string
  likeCount: number
  commentCount: number
  isLiked?: boolean
  onLike?: (id: string) => void
  className?: string
}

export function CommunityPost({
  id,
  title,
  content,
  author,
  community,
  createdAt,
  likeCount,
  commentCount,
  isLiked = false,
  onLike,
  className = ''
}: CommunityPostProps) {
  const handleLike = () => {
    onLike?.(id)
  }

  return (
    <article 
      className={`bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors ${className}`}
      role="article"
      aria-labelledby={`post-title-${id}`}
    >
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            {author.avatar ? (
              <img 
                src={author.avatar} 
                alt={author.name || 'Autor'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-1">
            <h3 
              id={`post-title-${id}`}
              className="font-semibold text-white"
              aria-label={`Título del post: ${title}`}
            >
              {author.name || 'Usuario Anónimo'}
            </h3>
            {author.role && (
              <span className="text-xs px-2 py-0.5 bg-blue-900 text-blue-200 rounded-full">
                {author.role}
              </span>
            )}
            <span className="text-gray-400">•</span>
            <Link 
              href={`/community/${community}`} 
              className="text-xs text-red-400 hover:text-red-300"
              aria-label={`Ir a la comunidad ${community}`}
            >
              {community}
            </Link>
          </div>

          {/* Time */}
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es })}
          </p>

          {/* Content */}
          <div className="mb-4">
            <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
            <p className="text-gray-300 whitespace-pre-line">{content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
                aria-label={isLiked ? 'Desme gustar este post' : 'Me gusta este post'}
              >
                <Heart 
                  className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} 
                  aria-hidden="true" 
                />
                <span>{likeCount}</span>
              </button>

              <button 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Comentar este post"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{commentCount}</span>
              </button>

              <button 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Compartir este post"
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Más opciones"
            >
              <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}