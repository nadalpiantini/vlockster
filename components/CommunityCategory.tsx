'use client'

import Link from 'next/link'
import { MessageCircle, Users, Eye, Lock } from 'lucide-react'

interface CommunityCategoryProps {
  id: string
  name: string
  description: string
  postCount: number
  memberCount: number
  viewCount: number
  isPrivate?: boolean
  className?: string
}

export function CommunityCategory({
  id,
  name,
  description,
  postCount,
  memberCount,
  viewCount,
  isPrivate = false,
  className = ''
}: CommunityCategoryProps) {
  return (
    <Link 
      href={`/community/${id}`}
      className={`bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-colors ${className}`}
      role="article"
      aria-label={`Categoría de comunidad: ${name}`}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
          {isPrivate ? (
            <Lock className="w-6 h-6 text-white" aria-hidden="true" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-lg">{name}</h3>
            {isPrivate && (
              <span className="text-xs px-2 py-0.5 bg-red-900 text-red-200 rounded-full">
                Privado
              </span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-3">{description}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" aria-hidden="true" />
              <span>{postCount} discusiones</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" aria-hidden="true" />
              <span>{memberCount} miembros</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>{viewCount} vistas</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}