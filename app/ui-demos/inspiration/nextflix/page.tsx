import Link from 'next/link'
import Image from 'next/image'
import { Play, Plus, Info } from 'lucide-react'

export default function NextflixStylePage() {
  const featuredContent = {
    title: 'The Last Frame',
    description: 'Una historia épica sobre cineastas independientes que desafían el sistema',
    year: '2024',
    duration: '2h 15m',
    rating: 'TV-MA',
    genres: ['Drama', 'Thriller', 'Independent']
  }

  const contentRows = [
    { title: 'Trending Now', items: 8 },
    { title: 'Popular on VLOCKSTER', items: 8 },
    { title: 'Documentaries', items: 8 },
    { title: 'Independent Films', items: 8 }
  ]

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#000000',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header Nextflix Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">Home</Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">Projects</Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">Community</Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">My List</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300">🔍</button>
              <button className="text-white hover:text-gray-300">👤</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Nextflix Style */}
      <section className="relative h-[85vh] flex items-end pb-20">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">
              {featuredContent.title}
            </h1>
            <div className="flex items-center gap-4 mb-4 text-lg">
              <span className="text-green-500 font-bold">98% Match</span>
              <span>{featuredContent.year}</span>
              <span className="px-2 py-1 border border-gray-500 text-xs">{featuredContent.rating}</span>
              <span>{featuredContent.duration}</span>
            </div>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {featuredContent.description}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white text-black rounded font-bold hover:bg-gray-300 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
              <button className="px-8 py-3 bg-gray-600/70 text-white rounded font-semibold hover:bg-gray-600/90 transition-colors flex items-center gap-2 backdrop-blur-sm">
                <Info className="w-5 h-5" />
                More Info
              </button>
              <button className="p-3 bg-gray-600/70 text-white rounded-full hover:bg-gray-600/90 transition-colors backdrop-blur-sm border-2 border-white/20">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Rows - Nextflix Style */}
      <main className="relative z-20 -mt-32 pb-16">
        {contentRows.map((row, idx) => (
          <section key={idx} className="mb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-bold mb-4" style={{ letterSpacing: '-0.01em' }}>{row.title}</h2>
              <div className="flex gap-2 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {Array.from({ length: row.items }).map((_, i) => {
                  const colors = [
                    'from-red-600 to-red-800',
                    'from-blue-600 to-blue-800',
                    'from-purple-600 to-purple-800',
                    'from-green-600 to-green-800',
                    'from-orange-600 to-orange-800',
                    'from-pink-600 to-pink-800',
                    'from-yellow-600 to-yellow-800',
                    'from-cyan-600 to-cyan-800'
                  ]
                  return (
                    <div
                      key={i}
                      className="flex-shrink-0 w-48 group cursor-pointer"
                    >
                      <div className={`relative aspect-[2/3] rounded overflow-hidden bg-gradient-to-br ${colors[i % colors.length]} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-display text-sm font-bold mb-2 text-white" style={{ letterSpacing: '-0.01em' }}>Project {i + 1}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <span>2024</span>
                            <span>•</span>
                            <span>1h 30m</span>
                          </div>
                          <button className="mt-3 w-full px-3 py-1.5 bg-white text-black rounded text-xs font-semibold hover:bg-gray-200 transition-colors">
                            ▶ Play
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Back Button - Simple */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link
          href="/ui-demos"
          className="px-6 py-3 bg-[#E50914] text-white rounded-lg font-semibold hover:bg-[#F40612] transition-colors shadow-lg"
        >
          ← Volver
        </Link>
      </div>

    </div>
  )
}

