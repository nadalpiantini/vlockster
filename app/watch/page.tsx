import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Video = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  uploader_id: string
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

  const { data: videos, error, count } = await (supabase
    .from('videos') as any)
    .select('*', { count: 'exact' })
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(from, to)

  // Fetch uploader profiles separately if needed
  if (videos && videos.length > 0) {
    const uploaderIds = [...new Set((videos as any[]).map((v: any) => v.uploader_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug')
      .in('id', uploaderIds)

    if (profiles) {
      const profileMap = new Map(profiles.map((p: any) => [p.id, p]))
      ;(videos as any[]).forEach((video: any) => {
        video.uploader = profileMap.get(video.uploader_id) || null
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
  const { videos, total, totalPages, currentPage } = await getPublicVideos(page)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Catálogo de Videos</h1>
          <p className="text-gray-400">
            Descubre contenido independiente de creadores de todo el mundo
          </p>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">
                Aún no hay videos disponibles
              </p>
              <p className="text-sm text-gray-500">
                Los creadores pronto comenzarán a subir contenido
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video: Video) => (
              <Link key={video.id} href={`/watch/${video.id}`}>
                <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title || 'Video thumbnail'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600" role="img" aria-label="Sin miniatura">
                        <span className="text-6xl" aria-hidden="true">🎬</span>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {video.description || 'Sin descripción'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Por: {(video.uploader as any)?.name || 'Desconocido'}
                    </p>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/watch"
            />
          </>
        )}
      </div>
    </div>
  )
}
