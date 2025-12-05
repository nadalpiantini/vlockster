'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Analytics {
  videos: {
    total: number
    totalViews: number
    totalWatchTime: number
    totalLikes: number
    completionRate: string
    recent: number
  }
  projects: {
    total: number
    active: number
    funded: number
    totalRaised: string
    totalBackers: number
    recent: number
    recentRevenue: string
  }
  topVideos: Array<{
    id: string
    title: string
    views: number
    likes: number
  }>
  topProjects: Array<{
    id: string
    title: string
    raised: number
    goal: number
    progress: number
  }>
}

export default function MyAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics')

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (response.status === 403) {
        router.push('/dashboard')
        return
      }

      if (!response.ok) {
        throw new Error('Error al cargar analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>Cargando analytics...</p>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {error || 'No se pudieron cargar las estadísticas'}
            </p>
            <Link href="/dashboard" aria-label="Volver al dashboard principal">
              <Button aria-label="Volver al dashboard principal">Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-300">
              Estadísticas de tu contenido y proyectos
            </p>
          </div>
          <Link href="/dashboard" aria-label="Volver al dashboard">
            <Button variant="outline" aria-label="Volver al dashboard">Volver</Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Videos</CardTitle>
              <CardDescription>Contenido publicado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">
                {analytics.videos.total}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                +{analytics.videos.recent} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visualizaciones</CardTitle>
              <CardDescription>Total de views</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-400">
                {analytics.videos.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {analytics.videos.totalWatchTime.toLocaleString()} min vistos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Proyectos</CardTitle>
              <CardDescription>Campañas activas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-400">
                {analytics.projects.active}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {analytics.projects.funded} financiados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingresos</CardTitle>
              <CardDescription>Total recaudado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-400">
                ${Number(analytics.projects.totalRaised).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                +${Number(analytics.projects.recentRevenue).toLocaleString()} este
                mes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Completion Rate</span>
                  <span className="text-2xl font-bold">
                    {analytics.videos.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${parseFloat(analytics.videos.completionRate)}%`,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">Total Likes</p>
                    <p className="text-2xl font-bold">
                      {analytics.videos.totalLikes}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">Avg Watch Time</p>
                    <p className="text-2xl font-bold">
                      {analytics.videos.totalViews > 0
                        ? Math.round(
                            analytics.videos.totalWatchTime /
                              analytics.videos.totalViews
                          )
                        : 0}
                      m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Videos</CardTitle>
                <CardDescription>Más vistos</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topVideos.length === 0 ? (
                  <p className="text-gray-300 text-center py-4">
                    Aún no has subido videos
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topVideos.map((video, index) => (
                      <Link 
                        key={video.id} 
                        href={`/watch/${video.id}`}
                        aria-label={`Ver video: ${video.title}`}
                      >
                        <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                          <span className="text-2xl font-bold text-gray-300">
                            #{index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {video.title}
                            </p>
                            <p className="text-sm text-gray-300">
                              {video.views} views • {video.likes} likes
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Proyectos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">Total Backers</p>
                    <p className="text-2xl font-bold">
                      {analytics.projects.totalBackers}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">
                      Backings este mes
                    </p>
                    <p className="text-2xl font-bold">
                      {analytics.projects.recent}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">
                    Tasa de Éxito
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    {analytics.projects.total > 0
                      ? (
                          (analytics.projects.funded /
                            analytics.projects.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Proyectos</CardTitle>
                <CardDescription>Más exitosos</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topProjects.length === 0 ? (
                  <p className="text-gray-300 text-center py-4">
                    Aún no has creado proyectos
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topProjects.map((project, index) => (
                      <Link 
                        key={project.id} 
                        href={`/projects/${project.id}`}
                        aria-label={`Ver proyecto: ${project.title}`}
                      >
                        <div className="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-gray-300">
                              #{index + 1}
                            </span>
                            <p className="font-semibold flex-1 truncate">
                              {project.title}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>
                              ${project.raised.toLocaleString()} de $
                              {project.goal.toLocaleString()}
                            </span>
                            <span>{project.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(project.progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
