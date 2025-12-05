'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Film, DollarSign, Loader2 } from 'lucide-react'

interface Recommendation {
  id: string
  type: 'video' | 'project'
  title: string
  description: string
  reason: string
  confidence_score: number
}

interface RecommendationsResponse {
  recommendations: Recommendation[]
  insights: string
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true)
        const response = await fetch('/api/recommendations')
        
        if (!response.ok) {
          throw new Error('Error cargando recomendaciones')
        }

        const data: RecommendationsResponse = await response.json()
        setRecommendations(data.recommendations || [])
        setInsights(data.insights || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Recomendaciones para ti
          </CardTitle>
          <CardDescription>
            Analizando tu historial para recomendaciones personalizadas...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || recommendations.length === 0) {
    return null // No mostrar si hay error o no hay recomendaciones
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Recomendaciones para ti
        </CardTitle>
        {insights && (
          <CardDescription>{insights}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(0, 6).map((rec) => (
            <Link
              key={rec.id}
              href={rec.type === 'video' ? `/watch/${rec.id}` : `/projects/${rec.id}`}
              className="block"
            >
              <Card className="hover:border-red-500/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    {rec.type === 'video' ? (
                      <Film className="w-5 h-5 text-blue-400" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-green-400" />
                    )}
                    <span className="text-xs text-gray-400">
                      {Math.round(rec.confidence_score * 100)}% match
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {rec.description}
                  </p>
                  <p className="text-xs text-gray-500 italic line-clamp-2">
                    {rec.reason}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {recommendations.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Ver todas las recomendaciones ({recommendations.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

