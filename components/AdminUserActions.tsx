'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Role = 'viewer' | 'creator' | 'moderator' | 'admin'

interface AdminUserActionsProps {
  userId: string
  currentRole: Role
  onRoleUpdated?: () => void
}

export function AdminUserActions({
  userId,
  currentRole,
  onRoleUpdated,
}: AdminUserActionsProps) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRole = async (newRole: Role) => {
    if (newRole === currentRole) return

    setUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar rol')
      }

      if (onRoleUpdated) {
        onRoleUpdated()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rol')
    } finally {
      setUpdating(false)
    }
  }

  const roles: Role[] = ['viewer', 'creator', 'moderator', 'admin']

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <div className="flex gap-1 flex-wrap" role="group" aria-label="Opciones de rol de usuario">
        {roles.map((role) => (
          <Button
            key={role}
            size="sm"
            variant={currentRole === role ? 'default' : 'outline'}
            onClick={() => updateRole(role)}
            disabled={updating || currentRole === role}
            className="text-xs"
            aria-label={`Cambiar rol a ${role}${currentRole === role ? ' (rol actual)' : ''}`}
            aria-pressed={currentRole === role}
          >
            {role === 'viewer' && '👤'}
            {role === 'creator' && '🎬'}
            {role === 'moderator' && '🛡️'}
            {role === 'admin' && '👑'}
            {' '}
            {role}
          </Button>
        ))}
      </div>
    </div>
  )
}

