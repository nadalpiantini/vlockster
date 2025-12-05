'use client'

import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'
import { logger } from '@/lib/utils/logger'

type User = {
  id: string
  email: string
  name?: string | null
  role: 'viewer' | 'creator' | 'moderator' | 'admin'
} | null

interface ProjectBackingCardProps {
  projectId: string
  projectStatus: string
  goalAmount: number
  user: User
}

export function ProjectBackingCard({
  projectId,
  projectStatus,
  goalAmount,
  user,
}: ProjectBackingCardProps) {
  if (projectStatus === 'active' && user) {
    return (
      <PayPalButton
        projectId={projectId}
        amount={goalAmount}
        onSuccess={() => {
          window.location.reload()
        }}
        onError={(error) => {
          logger.error('Payment error in ProjectBackingCard', new Error(error), {
            projectId,
            userId: user.id,
          })
        }}
      />
    )
  }

  if (projectStatus === 'active' && !user) {
    return <PayPalButtonPlaceholder />
  }

  return null
}

