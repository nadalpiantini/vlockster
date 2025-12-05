import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/SearchBar'
import { BrandHeader } from '@/components/BrandHeader'
import { logger } from '@/lib/utils/logger'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Film, DollarSign } from 'lucide-react'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Video = Database['public']['Tables']['videos']['Row']
type Project = Database['public']['Tables']['projects']['Row']

async function searchContent(query: string) {
  const supabase = await createClient()

  // Buscar videos
  const { data: videos } = await supabase
    .from('videos')
    .select('id, title, description, thumbnail_url, genre, view_count')
    .ilike('title', `%${query}%`)
    .eq('visibility', 'public')
    .limit(20)

  // Buscar proyectos
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, description, category, goal_amount, current_amount, status')
    .ilike('title', `%${query}%`)
    .in('status', ['active', 'funded'])
    .limit(20)

  // Manejar errores de query
  if (projectsError) {
    logger.error('Error fetching projects', projectsError, { page: 'search', query })
  }

  return {
    videos: (videos || []) as Video[],
    projects: (projects && !projectsError ? projects : []) as Project[],
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const results = query ? await searchContent(query) : { videos: [], projects: [] }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <BrandHeader />
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Búsqueda</h1>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {!query ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">
                Ingresa un término de búsqueda para comenzar
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Resultados para: <span className="text-white font-semibold">&quot;{query}&quot;</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {results.videos.length + results.projects.length} resultados encontrados
              </p>
            </div>

            {/* Videos Results */}
            {results.videos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Film className="w-6 h-6" aria-hidden="true" />
                  Videos ({results.videos.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.videos.map((video) => (
                    <Link
                      key={video.id}
                      href={`/watch/${video.id}`}
                      className="block"
                      aria-label={`Ver video: ${video.title}`}
                    >
                      <Card className="hover:border-red-500/50 transition-colors cursor-pointer h-full">
                        {video.thumbnail_url && (
                          <div className="relative w-full h-48 mb-3">
                            <Image
                              src={video.thumbnail_url}
                              alt={video.title}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                          {video.genre && (
                            <CardDescription className="text-xs">{video.genre}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {video.description}
                          </p>
                          {video.view_count !== null && (
                            <p className="text-xs text-gray-500 mt-2">
                              {video.view_count.toLocaleString()} views
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Results */}
            {results.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" aria-hidden="true" />
                  Proyectos ({results.projects.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.projects.map((project) => {
                    const progress =
                      project.goal_amount > 0
                        ? ((project.current_amount || 0) / project.goal_amount) * 100
                        : 0

                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block"
                        aria-label={`Ver proyecto: ${project.title}`}
                      >
                        <Card className="hover:border-red-500/50 transition-colors cursor-pointer h-full">
                          <CardHeader>
                            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                            {project.category && (
                              <CardDescription className="text-xs">{project.category}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progreso</span>
                                <span className="font-semibold">{progress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <p className="text-lg font-bold text-blue-400">
                                  ${(project.current_amount || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400">
                                  de ${project.goal_amount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-green-400">
                                  {project.status === 'funded' ? 'Fundado' : 'Activo'}
                                </p>
                                <p className="text-xs text-gray-400">Estado</p>
                              </div>
                            </div>
                            {project.description && (
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.videos.length === 0 && results.projects.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400 mb-4">
                    No se encontraron resultados para &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-gray-500">
                    Intenta con otros términos de búsqueda
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}

