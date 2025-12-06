import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/SearchBar'
import { VideoCard } from '@/components/VideoCard'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import { Pagination } from '@/components/Pagination'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Video = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  uploader_id: string
  duration_seconds: number | null
  created_at: string | null
  like_count: number | null
  uploader?: { name: string | null; public_profile_slug: string | null } | null
}

const VIDEOS_PER_PAGE = 16

async function getPublicVideos(page: number = 1): Promise<{
  videos: Video[]
  total: number
  totalPages: number
  currentPage: number
}> {
  const supabase = await createClient()
  const from = (page - 1) * VIDEOS_PER_PAGE
  const to = from + VIDEOS_PER_PAGE - 1

  type VideoRow = Database['public']['Tables']['videos']['Row']
  type Profile = Database['public']['Tables']['profiles']['Row']

  const { data: videos, error, count } = await supabase
    .from('videos')
    .select('id, title, description, thumbnail_url, uploader_id, duration_seconds, created_at, like_count', { count: 'exact' })
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(from, to)

  // Fetch uploader profiles separately if needed
  if (videos && videos.length > 0) {
    const videosTyped = videos as VideoRow[]
    const uploaderIds = [...new Set(videosTyped.map((v) => v.uploader_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug')
      .in('id', uploaderIds)

    if (profiles) {
      const profileMap = new Map((profiles as Profile[]).map((p) => [p.id, p]))
      videosTyped.forEach((video) => {
        ;(video as VideoRow & { uploader: Profile | null }).uploader = profileMap.get(video.uploader_id) || null
      })
    }
  }

  if (error) throw error
  return {
    videos: (videos || []) as Video[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / VIDEOS_PER_PAGE),
    currentPage: page,
  }
}

export default async function WatchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const { videos, total: _total, totalPages, currentPage } = await getPublicVideos(page)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto" role="main" aria-label="Catálogo de videos">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Catálogo</h1>
              <p className="text-gray-300">
                Descubre contenido independiente de creadores alrededor del mundo
              </p>
            </div>
            <div className="w-full md:w-auto max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No hay videos disponibles</h3>
            <p className="text-gray-400">
              Los creadores aún no han subido contenido
            </p>
          </div>
        ) : (
          <>
            {/* Categorías de contenido */}
            <div className="space-y-12">
              <HorizontalCarousel title="Populares" showAllLink="/watch">
                {videos.map((video: Video) => (
                  <div key={video.id} role="listitem">
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      description={video.description || undefined}
                      thumbnailUrl={video.thumbnail_url || undefined}
                      uploader={video.uploader || undefined}
                      duration={video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m` : undefined}
                      year={video.created_at ? new Date(video.created_at).getFullYear().toString() : undefined}
                      rating={video.like_count ? `${video.like_count} likes` : undefined}
                      className="min-w-[190px] md:min-w-[220px]"
                    />
                  </div>
                ))}
              </HorizontalCarousel>

              <HorizontalCarousel title="Recientes" showAllLink="/watch">
                {videos.slice(0, 8).map((video: Video) => (
                  <div key={`recent-${video.id}`} role="listitem">
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      description={video.description || undefined}
                      thumbnailUrl={video.thumbnail_url || undefined}
                      uploader={video.uploader || undefined}
                      duration={video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m` : undefined}
                      year={video.created_at ? new Date(video.created_at).getFullYear().toString() : undefined}
                      rating={video.like_count ? `${video.like_count} likes` : undefined}
                      className="min-w-[190px] md:min-w-[220px]"
                    />
                  </div>
                ))}
              </HorizontalCarousel>

              <HorizontalCarousel title="Documentales" showAllLink="/watch">
                {videos.filter(v => v.title.toLowerCase().includes('documentary') || (v.description && v.description.toLowerCase().includes('documentary'))).slice(0, 8).map((video: Video) => (
                  <div key={`doc-${video.id}`} role="listitem">
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      description={video.description || undefined}
                      thumbnailUrl={video.thumbnail_url || undefined}
                      uploader={video.uploader || undefined}
                      duration={video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m` : undefined}
                      year={video.created_at ? new Date(video.created_at).getFullYear().toString() : undefined}
                      rating={video.like_count ? `${video.like_count} likes` : undefined}
                      className="min-w-[190px] md:min-w-[220px]"
                    />
                  </div>
                ))}
              </HorizontalCarousel>

              <HorizontalCarousel title="Más Vistos" showAllLink="/watch">
                {videos.slice(0, 8).map((video: Video) => (
                  <div key={`trending-${video.id}`} role="listitem">
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      description={video.description || undefined}
                      thumbnailUrl={video.thumbnail_url || undefined}
                      uploader={video.uploader || undefined}
                      duration={video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m` : undefined}
                      year={video.created_at ? new Date(video.created_at).getFullYear().toString() : undefined}
                      rating={video.like_count ? `${video.like_count} likes` : undefined}
                      className="min-w-[190px] md:min-w-[220px]"
                    />
                  </div>
                ))}
              </HorizontalCarousel>
            </div>

            {/* Paginación al final */}
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/watch"
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
