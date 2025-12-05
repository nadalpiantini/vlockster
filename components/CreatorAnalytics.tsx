'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/StatsCard'
import { 
  Eye, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Film, 
  Target,
  MessageSquare,
  Loader2
} from 'lucide-react'

interface AnalyticsData {
  period: {
    start: string
    end: string
    days: number
  }
  videos: {
    total: number
    total_views: number
    total_likes: number
    avg_views_per_video: number
  }
  projects: {
    total: number
    active: number
    funded: number
    total_goal: number
    total_raised: number
  }
  backings: {
    total: number
    total_revenue: number
    avg_backing: number
  }
  engagement: {
    total: number
    likes: number
    comments: number
  }
}

export function CreatorAnalytics({ creatorId }: { creatorId?: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const url = creatorId
          ? `/api/analytics/creator?creator_id=${creatorId}&days=${days}`
          : `/api/analytics/creator?days=${days}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Error cargando analytics')
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [creatorId, days])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Cargando estadísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" aria-label="Cargando analytics" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-400">No se pudieron cargar las estadísticas</p>
        </CardContent>
      </Card>
    )
  }

  const conversionRate =
    analytics.projects.total_goal > 0
      ? ((analytics.projects.total_raised / analytics.projects.total_goal) * 100).toFixed(1)
      : '0'

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-sm rounded ${
                days === d
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label={`Ver analytics de últimos ${d} días`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Views"
          value={analytics.videos.total_views.toLocaleString()}
          description={`${analytics.videos.total} videos`}
          icon={Eye}
        />
        <StatsCard
          title="Likes Totales"
          value={analytics.videos.total_likes.toLocaleString()}
          description={`${analytics.engagement.comments} comentarios`}
          icon={Heart}
        />
        <StatsCard
          title="Revenue Total"
          value={`$${analytics.backings.total_revenue.toLocaleString()}`}
          description={`${analytics.backings.total} backings`}
          icon={DollarSign}
        />
        <StatsCard
          title="Proyectos Fundados"
          value={analytics.projects.funded}
          description={`${analytics.projects.active} activos`}
          icon={Target}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Videos Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5" aria-hidden="true" />
              Estadísticas de Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total de videos</span>
              <span className="font-semibold">{analytics.videos.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Promedio de views/video</span>
              <span className="font-semibold">
                {analytics.videos.avg_views_per_video.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de views</span>
              <span className="font-semibold">
                {analytics.videos.total_views.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de likes</span>
              <span className="font-semibold">
                {analytics.videos.total_likes.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Projects Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
              Estadísticas de Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Proyectos activos</span>
              <span className="font-semibold">{analytics.projects.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Proyectos fundados</span>
              <span className="font-semibold text-green-400">
                {analytics.projects.funded}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total recaudado</span>
              <span className="font-semibold">
                ${analytics.projects.total_raised.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Meta total</span>
              <span className="font-semibold">
                ${analytics.projects.total_goal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tasa de conversión</span>
              <span className="font-semibold">{conversionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {analytics.engagement.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">Total engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {analytics.engagement.likes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {analytics.engagement.comments.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">Comentarios</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

