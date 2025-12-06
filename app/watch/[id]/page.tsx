import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Route } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/role-check'
import { EnhancedVideoPlayer } from '@/components/EnhancedVideoPlayer'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'
import { User, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type VideoRow = Database['public']['Tables']['videos']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

type VideoWithUploader = VideoRow & {
  uploader?: ProfileRow | null
}

async function getVideo(id: string): Promise<VideoWithUploader | null> {
  const supabase = await createClient()

  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !video) return null

  const videoTyped = video as VideoRow

  // Fetch uploader profile separately
  if (videoTyped.uploader_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug, bio')
      .eq('id', videoTyped.uploader_id)
      .single()

    if (profile) {
      ;(videoTyped as VideoWithUploader).uploader = profile as ProfileRow
    }
  }

  return videoTyped as VideoWithUploader
}

export default async function WatchVideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const video = await getVideo(id)
  const _user = await getCurrentUser()

  if (!video) {
    notFound()
  }

  // Everything is open - no restrictions
  // All videos are accessible to everyone

  return (
    <div className="min-h-screen bg-vlockster-black text-vlockster-white">
      <main
        id="main-content"
        className="container mx-auto max-w-7xl px-4 py-8"
        role="main"
        aria-label={`Reproductor de video: ${video.title}`}
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div role="region" aria-label="Reproductor de video">
              {video.stream_id && process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID ? (
                <EnhancedVideoPlayer
                  videoId={video.stream_id}
                  title={video.title}
                  poster={video.thumbnail_url || undefined}
                  controls={true}
                />
              ) : (
                <div className="aspect-video bg-vlockster-gray-dark rounded-lg flex items-center justify-center">
                  <div className="text-center p-8" role="alert">
                    <p className="text-vlockster-white-soft mb-2">
                      {video.stream_id
                        ? 'Cloudflare Stream no configurado'
                        : 'Video no disponible'}
                    </p>
                    {video.stream_id && (
                      <p className="text-sm text-vlockster-gray-text">
                        Video ID: {video.stream_id}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div
              className="bg-vlockster-gray-dark rounded-lg p-6 space-y-4"
              role="article"
              aria-labelledby="video-title"
            >
              <div>
                <h1
                  id="video-title"
                  className="text-3xl font-bold text-vlockster-white mb-3"
                  aria-label={`Título del video: ${video.title}`}
                >
                  {video.title}
                </h1>

                <div className="flex items-center gap-4 text-vlockster-gray-text text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time
                      aria-label={`Fecha de publicación: ${
                        video.created_at
                          ? new Date(video.created_at).toLocaleDateString(
                              'es-ES',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : 'Fecha no disponible'
                      }`}
                    >
                      {video.created_at
                        ? new Date(video.created_at).toLocaleDateString(
                            'es-ES',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'Fecha no disponible'}
                    </time>
                  </div>
                </div>
              </div>

              {video.description && (
                <div className="pt-4 border-t border-vlockster-gray">
                  <h2 className="text-sm font-semibold text-vlockster-white mb-2 uppercase tracking-wide">
                    Descripción
                  </h2>
                  <p
                    className="text-vlockster-white-soft whitespace-pre-wrap leading-relaxed"
                    aria-label={`Descripción: ${video.description}`}
                  >
                    {video.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6" role="complementary" aria-label="Información del creador">
            {/* Creator Card */}
            <div className="bg-vlockster-gray-dark rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-semibold text-vlockster-white uppercase tracking-wide">
                Creador
              </h2>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-vlockster-gray overflow-hidden flex items-center justify-center">
                  <User className="w-8 h-8 text-vlockster-gray-text" />
                </div>
                <div className="flex-1">
                  <p
                    className="font-bold text-lg text-vlockster-white"
                    aria-label={`Creador: ${video.uploader?.name || 'Desconocido'}`}
                  >
                    {video.uploader?.name || 'Desconocido'}
                  </p>
                  {video.uploader?.bio && (
                    <p
                      className="text-sm text-vlockster-gray-text mt-1"
                      aria-label={`Biografía: ${video.uploader.bio}`}
                    >
                      {video.uploader.bio}
                    </p>
                  )}
                </div>
              </div>

              {video.uploader?.public_profile_slug && (
                <Link
                  href={`/c/${video.uploader.public_profile_slug}` as Route}
                  aria-label={`Ver perfil de ${video.uploader?.name || 'creador'}`}
                >
                  <Button
                    className="w-full bg-vlockster-red hover:bg-vlockster-red-dark text-vlockster-white"
                    aria-label={`Ver perfil de ${video.uploader.name || 'creador'}`}
                  >
                    Ver Perfil
                  </Button>
                </Link>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
