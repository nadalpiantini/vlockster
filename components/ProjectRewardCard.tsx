'use client'

import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { logger } from '@/lib/utils/logger'

interface Reward {
  id: string
  title: string
  description: string | null
  amount: number
  limit: number | null
  backers_count: number
}

type User = {
  id: string
  email: string
  name?: string | null
  role: 'viewer' | 'creator' | 'moderator' | 'admin'
} | null

interface ProjectRewardCardProps {
  reward: Reward
  projectId: string
  projectStatus: string
  user: User
}

export function ProjectRewardCard({
  reward,
  projectId,
  projectStatus,
  user,
}: ProjectRewardCardProps) {
  const isAvailable =
    !reward.limit || reward.backers_count < reward.limit
  const remaining = reward.limit ? reward.limit - reward.backers_count : null

  return (
    <Card
      className={`${!isAvailable ? 'opacity-50' : ''}`}
      aria-label={`Recompensa: ${reward.title} por $${Number(reward.amount).toLocaleString()} USD`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reward.title}</CardTitle>
            <CardDescription>
              ${Number(reward.amount).toLocaleString()} USD
            </CardDescription>
          </div>
          {!isAvailable && (
            <span
              className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded-full"
              role="status"
              aria-label="Recompensa agotada"
            >
              Agotado
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reward.description && (
          <p className="text-gray-300 text-sm mb-4">{reward.description}</p>
        )}
        {remaining !== null && (
          <p className="text-xs text-gray-400 mb-3">
            {remaining} disponibles de {reward.limit}
          </p>
        )}
        {!isAvailable || projectStatus !== 'active' ? (
          <Button
            className="w-full"
            disabled
            aria-label={!isAvailable ? `Recompensa ${reward.title} agotada` : 'Campaña cerrada'}
          >
            {!isAvailable ? 'Agotado' : 'Campaña cerrada'}
          </Button>
        ) : user ? (
          <PayPalButton
            projectId={projectId}
            rewardId={reward.id}
            amount={Number(reward.amount)}
            onSuccess={() => {
              window.location.reload()
            }}
            onError={(error) => {
              logger.error('Payment error in ProjectRewardCard', new Error(error), {
                projectId,
                rewardId: reward.id,
                userId: user.id,
              })
            }}
          />
        ) : (
          <PayPalButtonPlaceholder />
        )}
      </CardContent>
    </Card>
  )
}

