import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/role-check'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'

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
  const user = await getCurrentUser()

  if (!video) {
    notFound()
  }

  // Verificar permisos de acceso según visibilidad
  const canWatch =
    video.visibility === 'public' ||
    (user && video.visibility === 'members') ||
    (user && video.uploader_id === user.id)

  if (!canWatch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Contenido Restringido</CardTitle>
            <CardDescription>
              Este video solo está disponible para miembros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Video Player */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-950 flex items-center justify-center">
              {video.stream_id ? (
                <div className="w-full h-full">
                  {process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID ? (
                    <iframe
                      src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${video.stream_id}/iframe`}
                      className="w-full h-full"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-400 mb-2">Cloudflare Stream no configurado</p>
                      <p className="text-sm text-gray-500">
                        Video ID: {video.stream_id}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Video no disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{video.title}</CardTitle>
                <CardDescription>
                  {video.created_at
                    ? new Date(video.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Fecha no disponible'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {video.description || 'Sin descripción'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Creator Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Creador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">
                    {video.uploader?.name || 'Desconocido'}
                  </p>
                  {video.uploader?.bio && (
                    <p className="text-sm text-gray-400 mt-2">
                      {video.uploader.bio}
                    </p>
                  )}
                </div>
                {video.uploader?.public_profile_slug && (
                  <Link
                    href={`/c/${video.uploader.public_profile_slug}` as any}
                  >
                    <Button className="w-full" variant="outline">
                      Ver Perfil
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
