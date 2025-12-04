'use client'

import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ProjectBackingCardProps {
  projectId: string
  projectStatus: string
  goalAmount: number
  user: any
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
          console.error('PayPal error:', error)
        }}
      />
    )
  }

  if (projectStatus === 'active' && !user) {
    return <PayPalButtonPlaceholder />
  }

  return null
}

