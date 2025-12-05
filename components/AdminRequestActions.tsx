'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface AdminRequestActionsProps {
  requestId: string
}

export function AdminRequestActions({ requestId }: AdminRequestActionsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleApprove() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/approve-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al aprobar solicitud')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/reject-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al rechazar solicitud')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2" role="group" aria-label="Acciones de solicitud">
      {error && (
        <div 
          className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-2 rounded-md text-sm"
          role="alert"
          aria-live="polite"
          aria-label={`Error: ${error}`}
        >
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <Button
          onClick={handleApprove}
          disabled={loading}
          variant="default"
          aria-label={loading ? 'Procesando aprobación' : `Aprobar solicitud ${requestId}`}
          aria-busy={loading}
        >
          {loading ? 'Procesando...' : 'Aprobar'}
        </Button>
        <Button
          onClick={handleReject}
          disabled={loading}
          variant="destructive"
          aria-label={loading ? 'Procesando rechazo' : `Rechazar solicitud ${requestId}`}
          aria-busy={loading}
        >
          {loading ? 'Procesando...' : 'Rechazar'}
        </Button>
      </div>
    </div>
  )
}

