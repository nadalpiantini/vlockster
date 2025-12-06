import Link from 'next/link'
import Image from 'next/image'
import { Heart, Share2, Plus, Clock } from 'lucide-react'

export default function ThumbnailsDemoPage() {
  const thumbnails = [
    {
      id: 1,
      title: 'The Last Frame',
      duration: '2h 15m',
      genre: 'Drama',
      image: 'bg-gradient-to-br from-red-500/20 to-red-600/20'
    },
    {
      id: 2,
      title: 'Indie Dreams',
      duration: '1h 45m',
      genre: 'Comedy',
      image: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20'
    },
    {
      id: 3,
      title: 'Street Stories',
      duration: '1h 30m',
      genre: 'Documentary',
      image: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20'
    },
    {
      id: 4,
      title: 'Night Vision',
      duration: '2h 30m',
      genre: 'Thriller',
      image: 'bg-gradient-to-br from-green-500/20 to-green-600/20'
    },
    {
      id: 5,
      title: 'Urban Legends',
      duration: '1h 50m',
      genre: 'Horror',
      image: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20'
    },
    {
      id: 6,
      title: 'City Lights',
      duration: '1h 20m',
      genre: 'Romance',
      image: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20'
    },
    {
      id: 7,
      title: 'The Journey',
      duration: '2h 5m',
      genre: 'Adventure',
      image: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20'
    },
    {
      id: 8,
      title: 'Final Cut',
      duration: '1h 35m',
      genre: 'Action',
      image: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20'
    }
  ]

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#050505',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header with Logo */}
      <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.jpeg"
                alt="VLOCKSTER"
                width={180}
                height={45}
                className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="font-display text-2xl font-bold text-white hidden sm:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>
            <Link 
              href="/" 
              className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <Link
              href="/ui-demos"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              ← Volver a Demos
            </Link>

            {/* Title */}
            <h1 className="font-display text-6xl md:text-7xl font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>
              Thumbnails Horizontales
            </h1>
            <p className="font-display text-2xl text-[#FF0000] mb-4 font-semibold" style={{ letterSpacing: '-0.01em' }}>
              STREAMLAB Style
            </p>
            <p className="text-lg text-gray-300 mb-12 font-sans">
              Secciones de contenido con scroll horizontal estilo STREAMLAB
            </p>

            {/* Multiple Sections */}
            {['All Time Hits', 'Trending Now', 'New Releases', 'Documentaries'].map((sectionTitle, sectionIdx) => (
              <section key={sectionIdx} className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-4xl font-bold" style={{ letterSpacing: '-0.02em' }}>{sectionTitle}</h2>
                  <button className="text-[#FF0000] hover:text-[#FF6B35] hover:underline transition-colors font-semibold">
                    MORE VIDEOS →
                  </button>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {thumbnails.map((item) => (
                    <div
                      key={item.id}
                      className="group flex-shrink-0 w-64 cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-red-500/20">
                        {/* Thumbnail Image */}
                        <div className={`absolute inset-0 ${item.image}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-2xl">▶</span>
                            </div>
                          </div>
                        </div>

                        {/* Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <h3 className="font-bold text-white mb-1">{item.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}</span>
                            <span className="px-2 py-0.5 rounded bg-[#FF0000]/30 border border-[#FF0000]/50 text-[#FF0000] font-semibold">
                              {item.genre}
                            </span>
                          </div>
                        </div>

                        {/* Action Icons - Hover */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-[#FF0000] hover:border-[#FF0000] transition-colors"
                            aria-label="Like"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                            aria-label="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                            aria-label="Add to list"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Features Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Características</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Scroll horizontal suave
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Hover effects (scale + shadow)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Badges de género
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Acciones rápidas (like, share, add)
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Elementos</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Título de sección destacado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Botón &quot;MORE VIDEOS&quot;
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Aspect ratio 16:9
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Duración y metadata visible
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

