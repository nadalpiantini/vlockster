'use client'

import Link from 'next/link'
import { User, Calendar, Target, TrendingUp, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface CrowdfundingProjectProps {
  id: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  currency?: string
  deadline: string
  creator: {
    name: string | null
    avatar?: string | null
  }
  backersCount: number
  className?: string
}

export function CrowdfundingProject({
  id,
  title,
  description,
  goalAmount,
  currentAmount,
  currency = 'USD',
  deadline,
  creator,
  backersCount,
  className = ''
}: CrowdfundingProjectProps) {
  const progressPercentage = Math.min(100, Math.round((currentAmount / goalAmount) * 100))
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link 
      href={`/projects/${id}`}
      className={`block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}
      role="article"
      aria-label={`Proyecto de crowdfunding: ${title}`}
    >
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-900">
              {progressPercentage}% financiado
            </span>
            <span className="text-sm text-gray-600">
              {daysLeft > 0 ? `${daysLeft} días restantes` : 'Finalizado'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{title}</h3>
          
          <p className="text-gray-600 line-clamp-3">{description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 font-bold text-lg mb-1">
                <DollarSign className="w-4 h-4" />
                <span>{currentAmount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">Recaudado</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-700 font-bold text-lg mb-1">
                <Users className="w-4 h-4" />
                <span>{backersCount}</span>
              </div>
              <div className="text-xs text-gray-500">Backers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-700 font-bold text-lg mb-1">
                <Target className="w-4 h-4" />
                <span>{goalAmount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">Meta</div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center pt-4 border-t border-gray-100">
            <div className="flex-shrink-0 mr-3">
              {creator.avatar ? (
                <img 
                  src={creator.avatar} 
                  alt={creator.name || 'Creador'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {creator.name || 'Creador anónimo'}
              </p>
              <p className="text-xs text-gray-500">
                Finaliza: {format(new Date(deadline), 'd MMM yyyy', { locale: es })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}