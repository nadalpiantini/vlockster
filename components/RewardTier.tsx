'use client'

import { Check, Clock, Users } from 'lucide-react'

interface RewardTierProps {
  id: string
  title: string
  description: string
  amount: number
  limit?: number | null
  backersCount?: number
  deliveryDate?: string
  isAvailable: boolean
  className?: string
  onSelect?: () => void
}

export function RewardTier({
  id,
  title,
  description,
  amount,
  limit,
  backersCount = 0,
  deliveryDate,
  isAvailable = true,
  className = '',
  onSelect
}: RewardTierProps) {
  const isLimited = limit !== undefined && limit !== null
  const remaining = isLimited ? limit - backersCount : null
  const isSoldOut = isLimited && backersCount >= limit

  return (
    <div 
      className={`border rounded-lg p-5 transition-all cursor-pointer ${
        isAvailable && !isSoldOut 
          ? 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white' 
          : 'border-gray-100 bg-gray-50 opacity-70'
      } ${className}`}
      onClick={isAvailable && !isSoldOut ? onSelect : undefined}
      role="button"
      tabIndex={isAvailable && !isSoldOut ? 0 : -1}
      aria-disabled={!isAvailable || isSoldOut}
      aria-label={`Recompensa ${title} por $${amount}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <span className="text-2xl font-bold text-red-600">${amount}</span>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="space-y-2">
        {deliveryDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Entrega estimada: {deliveryDate}
          </div>
        )}
        
        {isLimited && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {remaining && remaining > 0 
              ? `${remaining} de ${limit} disponibles`
              : 'Agotado'}
          </div>
        )}
      </div>
      
      {isAvailable && !isSoldOut ? (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-green-600 text-sm">
            <Check className="w-4 h-4 mr-1" />
            Disponible
          </div>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              onSelect?.()
            }}
          >
            Seleccionar
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center py-2 bg-gray-100 text-gray-500 rounded-md text-sm">
          {isSoldOut ? 'Agotado' : 'No disponible'}
        </div>
      )}
    </div>
  )
}