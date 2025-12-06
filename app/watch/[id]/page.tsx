import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/role-check'
import { EnhancedVideoPlayer } from '@/components/EnhancedVideoPlayer'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'
import { User, Calendar, Heart, Users, DollarSign } from 'lucide-react'
import { CreatorProjects } from '@/components/CreatorProjects'

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Video Player Section */}
        <div className="mb-8">
          <EnhancedVideoPlayer
            videoId={video.id}
            title={video.title}
            poster={video.thumbnail_url || undefined}
          />
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              {video.uploader?.name && (
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span>By {video.uploader.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>{new Date(video.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{video.description}</p>
            
            <div className="flex gap-4">
              <Button variant="secondary" className="bg-red-600 hover:bg-red-700">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="secondary">Share</Button>
            </div>
          </div>

          {/* Sidebar with creator's other projects */}
          <div>
            {video.uploader?.id && (
              <CreatorProjects 
                creatorId={video.uploader.id} 
                currentVideoId={id}
                title="More from this creator"
              />
            )}

            {/* Related Projects Section - shows projects related to this video */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Related Campaigns
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Support similar projects from this creator
              </p>
              <Link href={`/projects/create?related_to=${id}`} className="block">
                <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Start a Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <textarea 
              placeholder="Add a comment..." 
              className="w-full bg-gray-700 text-white rounded p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            ></textarea>
            <Button>Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  )
}