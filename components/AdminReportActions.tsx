'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AdminReportActionsProps {
  reportId: string
  contentType: string
  contentId: string
  onResolved?: () => void
}

export function AdminReportActions({
  reportId,
  contentType,
  contentId,
  onResolved,
}: AdminReportActionsProps) {
  const [resolving, setResolving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const resolveReport = async (action: 'resolve' | 'dismiss') => {
    setResolving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/resolve-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          action,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al resolver reporte')
      }

      if (onResolved) {
        onResolved()
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver reporte')
    } finally {
      setResolving(false)
    }
  }

  const getContentUrl = () => {
    switch (contentType) {
      case 'video':
        return `/watch/${contentId}`
      case 'project':
        return `/projects/${contentId}`
      case 'post':
        return `/community/post/${contentId}`
      default:
        return '#'
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(getContentUrl())}
          disabled={resolving}
        >
          Ver Contenido
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => resolveReport('resolve')}
          disabled={resolving}
        >
          {resolving ? 'Resolviendo...' : 'Resolver'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => resolveReport('dismiss')}
          disabled={resolving}
        >
          {resolving ? 'Rechazando...' : 'Rechazar'}
        </Button>
      </div>
    </div>
  )
}

