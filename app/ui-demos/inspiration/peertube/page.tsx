import Link from 'next/link'
import Image from 'next/image'
import { Play, ThumbsUp, Share2, Download, Bell, Settings } from 'lucide-react'

export default function PeerTubeStylePage() {
  const videos = [
    { id: 1, title: 'Independent Film: The Journey', views: '12.5K', duration: '15:30', thumbnail: 'bg-gradient-to-br from-red-500/20 to-red-600/20' },
    { id: 2, title: 'Crowdfunding Success Stories', views: '8.3K', duration: '22:15', thumbnail: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20' },
    { id: 3, title: 'Community Building Tips', views: '5.7K', duration: '18:45', thumbnail: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' },
    { id: 4, title: 'Film Production Workflow', views: '9.1K', duration: '25:20', thumbnail: 'bg-gradient-to-br from-green-500/20 to-green-600/20' },
    { id: 5, title: 'Marketing Your Project', views: '6.4K', duration: '20:10', thumbnail: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20' },
    { id: 6, title: 'Behind the Scenes', views: '11.2K', duration: '14:25', thumbnail: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20' }
  ]

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#0F0F0F',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header PeerTube Style */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A] border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.png"
                alt="VLOCKSTER"
                width={150}
                height={40}
                className="object-contain h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="font-display text-xl font-bold text-white hidden md:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-gray-300 hover:text-white">Browse</Link>
              <Link href="#" className="text-gray-300 hover:text-white">Channels</Link>
              <Link href="#" className="text-gray-300 hover:text-white">Trending</Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                <span className="text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player - PeerTube Style */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">0:00 / 15:30</span>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF0000] w-[0%]"></div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2">Independent Film: The Journey</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>12.5K views</span>
                  <span>•</span>
                  <span>2 days ago</span>
                  <span>•</span>
                  <span>By Creator Channel</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <button className="px-6 py-2 bg-[#FF0000] rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Like (234)
                  </button>
                  <button className="px-6 py-2 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button className="px-6 py-2 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-gray-300 leading-relaxed">
                    Una historia épica sobre cineastas independientes que desafían el sistema tradicional
                    de distribución. Descubre cómo esta plataforma revoluciona el cine independiente.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Videos Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4">Related Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.slice(1).map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-2 group-hover:scale-105 transition-transform">
                      <div className={`absolute inset-0 ${video.thumbnail}`}></div>
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-[#FF0000] transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-sm text-gray-400">
                      Creator Channel • {video.views} views
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar - Channel Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center text-2xl">
                    🎬
                  </div>
                  <div>
                    <h3 className="font-bold">Creator Channel</h3>
                    <p className="text-sm text-gray-400">1.2K subscribers</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-[#FF0000] rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                  Subscribe
                </button>
              </div>

              <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                <h3 className="font-semibold mb-4">Playlist</h3>
                <div className="space-y-2">
                  {videos.slice(0, 4).map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="w-16 h-10 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-gray-400">{video.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link
          href="/ui-demos"
          className="px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors shadow-lg"
        >
          ← Volver
        </Link>
      </div>
    </div>
  )
}

