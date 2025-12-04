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

async function getPublicVideos() {
  const supabase = await createClient()

  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch uploader profiles separately if needed
  if (videos && videos.length > 0) {
    const uploaderIds = [...new Set(videos.map((v) => v.uploader_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug')
      .in('id', uploaderIds)

    if (profiles) {
      const profileMap = new Map(profiles.map((p) => [p.id, p]))
      videos.forEach((video) => {
        ;(video as any).uploader = profileMap.get(video.uploader_id) || null
      })
    }
  }

  if (error) throw error
  return videos || []
}

export default async function WatchPage() {
  const videos = await getPublicVideos()

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
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
        )}
      </div>
    </div>
  )
}
