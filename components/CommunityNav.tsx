'use client'

import Link from 'next/link'
import { Hash, Users, MessageCircle, TrendingUp } from 'lucide-react'

interface CommunityNavProps {
  activeTab: 'posts' | 'categories' | 'trending' | 'members'
  communityId?: string
}

export function CommunityNav({ activeTab, communityId }: CommunityNavProps) {
  const tabs = [
    { id: 'posts', label: 'Discusiones', icon: MessageCircle },
    { id: 'categories', label: 'Categorías', icon: Hash },
    { id: 'trending', label: 'Tendencias', icon: TrendingUp },
    { id: 'members', label: 'Miembros', icon: Users },
  ]

  return (
    <nav 
      className="bg-gray-800 rounded-lg p-1 mb-6"
      aria-label="Navegación de comunidad"
    >
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={communityId ? `/community/${communityId}/${tab.id}` : `/community/${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <tab.icon className="w-4 h-4" aria-hidden="true" />
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}