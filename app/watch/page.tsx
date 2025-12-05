import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/SearchBar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    .select('*', { count: 'exact' })
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
  const { videos, total, totalPages, currentPage } = await getPublicVideos(page)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto" role="main" aria-label="Catálogo de videos">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Video Catalog</h1>
              <p className="text-gray-300">
                Discover independent content from creators around the world
              </p>
            </div>
            <div className="w-full md:w-auto max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-300 mb-4">
                No videos available yet
              </p>
              <p className="text-sm text-gray-300">
                Creators will start uploading content soon
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Lista de videos">
              {videos.map((video: Video) => (
              <Link key={video.id} href={`/watch/${video.id}`} aria-label={`Ver video: ${video.title}`}>
                <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full" role="listitem">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-300" role="img" aria-label="Sin miniatura">
                        <span className="text-6xl" aria-hidden="true">🎬</span>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {video.description || 'No description'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-300">
                      By: {video.uploader?.name || 'Unknown'}
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
      </main>
    </div>
  )
}
