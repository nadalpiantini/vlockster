import Link from 'next/link'
import Image from 'next/image'
import { Play, Info, Volume2, Maximize2 } from 'lucide-react'

export default function NetflixCloneStylePage() {
  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#141414',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header Material + Netflix Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent">
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
              <span className="font-display text-2xl font-bold text-white hidden md:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#" className="text-white font-medium">Home</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Projects</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Community</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">New & Popular</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300">🔍</button>
              <button className="text-white hover:text-gray-300">👤</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero with Material Overlay */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black mb-4">Independent Cinema Revolution</h1>
            <p className="text-lg text-gray-300 mb-6">
              Una plataforma que combina streaming, crowdfunding y comunidad para cineastas independientes.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white text-black rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
              <button className="px-6 py-2.5 bg-gray-600/50 text-white rounded font-medium hover:bg-gray-600/70 transition-colors backdrop-blur-sm flex items-center gap-2">
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid - Material Style */}
      <main className="relative z-20 -mt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="group relative aspect-[2/3] rounded overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-xs font-semibold mb-1">Project {i + 1}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-300">
                      <span>2024</span>
                      <span>•</span>
                      <span>1h 30m</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Player Modal Example */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">Mini Player (Material Style)</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Project Title</h3>
                    <p className="text-sm text-gray-300">2:15 / 1:30:00</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E50914] w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back Button */}
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

