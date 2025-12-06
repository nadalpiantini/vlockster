import Link from 'next/link'
import Image from 'next/image'
import { Search, Play, Plus, Clock, Star } from 'lucide-react'

export default function BDScreensStylePage() {
  const featuredContent = {
    title: 'The Last Frame',
    description: 'Una historia épica sobre cineastas independientes que desafían el sistema tradicional de distribución cinematográfica.',
    year: '2024',
    duration: '2h 15m',
    rating: '9.2',
    genre: 'Drama',
    match: '98%'
  }

  const trendingNow = [
    { id: 1, title: 'The Last Frame', year: '2024', duration: '2h 15m', rating: '9.2', genre: 'Drama', color: 'from-red-600 via-red-700 to-red-900', poster: '🎬' },
    { id: 2, title: 'Indie Dreams', year: '2024', duration: '1h 45m', rating: '8.7', genre: 'Comedy', color: 'from-purple-600 via-purple-700 to-purple-900', poster: '🎭' },
    { id: 3, title: 'Street Stories', year: '2023', duration: '1h 30m', rating: '8.9', genre: 'Documentary', color: 'from-blue-600 via-blue-700 to-blue-900', poster: '📹' },
    { id: 4, title: 'Night Vision', year: '2024', duration: '2h 30m', rating: '9.0', genre: 'Thriller', color: 'from-green-600 via-green-700 to-green-900', poster: '🌙' },
    { id: 5, title: 'Urban Legends', year: '2023', duration: '1h 50m', rating: '8.5', genre: 'Horror', color: 'from-orange-600 via-orange-700 to-orange-900', poster: '👻' },
    { id: 6, title: 'City Lights', year: '2024', duration: '1h 20m', rating: '8.8', genre: 'Romance', color: 'from-pink-600 via-pink-700 to-pink-900', poster: '💕' },
    { id: 7, title: 'The Journey', year: '2024', duration: '2h 5m', rating: '9.1', genre: 'Adventure', color: 'from-cyan-600 via-cyan-700 to-cyan-900', poster: '🗺️' },
    { id: 8, title: 'Final Cut', year: '2023', duration: '1h 35m', rating: '8.6', genre: 'Action', color: 'from-yellow-600 via-yellow-700 to-yellow-900', poster: '✂️' },
  ]

  const popularContent = [
    { id: 1, title: 'Wanda Vision', year: '2021', rating: '8.9', color: 'from-purple-600 via-purple-800 to-purple-950', poster: '🔮' },
    { id: 2, title: 'Bandhobi', year: '2019', rating: '8.4', color: 'from-blue-600 via-blue-800 to-blue-950', poster: '👗' },
    { id: 3, title: 'Ekti Shobuj Bogan', year: '2020', rating: '8.7', color: 'from-green-600 via-green-800 to-green-950', poster: '🌿' },
    { id: 4, title: 'Shaadi Zaroor Aana', year: '2018', rating: '8.2', color: 'from-pink-600 via-pink-800 to-pink-950', poster: '💒' },
    { id: 5, title: 'SHOHUKRANU', year: '2021', rating: '8.5', color: 'from-orange-600 via-orange-800 to-orange-950', poster: '🔥' },
    { id: 6, title: 'Ant-man (MARVEL)', year: '2023', rating: '9.0', color: 'from-red-600 via-red-800 to-red-950', poster: '🐜' },
    { id: 7, title: 'Vijjo', year: '2022', rating: '8.3', color: 'from-cyan-600 via-cyan-800 to-cyan-950', poster: '⚡' },
    { id: 8, title: 'GANGSTER', year: '2020', rating: '8.6', color: 'from-yellow-600 via-yellow-800 to-yellow-950', poster: '🔫' },
  ]

  const documentaries = [
    { id: 1, title: 'Cinema Revolution', year: '2024', rating: '9.1', color: 'from-indigo-600 via-indigo-800 to-indigo-950', poster: '🎞️' },
    { id: 2, title: 'Indie Filmmakers', year: '2023', rating: '8.8', color: 'from-teal-600 via-teal-800 to-teal-950', poster: '🎥' },
    { id: 3, title: 'Street Art Stories', year: '2024', rating: '8.9', color: 'from-rose-600 via-rose-800 to-rose-950', poster: '🎨' },
    { id: 4, title: 'Night Photography', year: '2023', rating: '8.5', color: 'from-violet-600 via-violet-800 to-violet-950', poster: '📸' },
    { id: 5, title: 'Urban Culture', year: '2024', rating: '8.7', color: 'from-amber-600 via-amber-800 to-amber-950', poster: '🏙️' },
    { id: 6, title: 'City Documentaries', year: '2023', rating: '8.6', color: 'from-emerald-600 via-emerald-800 to-emerald-950', poster: '🌆' },
  ]

  const independentFilms = [
    { id: 1, title: 'The Frame', year: '2024', duration: '2h 15m', rating: '9.2', color: 'from-red-600 via-red-800 to-red-950', poster: '🖼️' },
    { id: 2, title: 'Dreams', year: '2024', duration: '1h 45m', rating: '8.7', color: 'from-purple-600 via-purple-800 to-purple-950', poster: '💭' },
    { id: 3, title: 'Stories', year: '2023', duration: '1h 30m', rating: '8.9', color: 'from-blue-600 via-blue-800 to-blue-950', poster: '📖' },
    { id: 4, title: 'Vision', year: '2024', duration: '2h 30m', rating: '9.0', color: 'from-green-600 via-green-800 to-green-950', poster: '👁️' },
    { id: 5, title: 'Legends', year: '2023', duration: '1h 50m', rating: '8.5', color: 'from-orange-600 via-orange-800 to-orange-950', poster: '📜' },
    { id: 6, title: 'Lights', year: '2024', duration: '1h 20m', rating: '8.8', color: 'from-pink-600 via-pink-800 to-pink-950', poster: '💡' },
  ]

  const heroPosters = [
    { title: 'CONTRACT', rotation: -15, position: { top: '10%', left: '5%' }, color: 'from-red-600 to-red-900', z: 1 },
    { title: 'TIKI TAKA', rotation: 12, position: { top: '20%', right: '10%' }, color: 'from-blue-600 to-blue-900', z: 2 },
    { title: 'COMMANDO 3', rotation: -8, position: { top: '50%', left: '0%' }, color: 'from-purple-600 to-purple-900', z: 3 },
    { title: 'WTF', rotation: 18, position: { top: '60%', right: '5%' }, color: 'from-green-600 to-green-900', z: 4 },
    { title: 'Break', rotation: -12, position: { bottom: '20%', left: '15%' }, color: 'from-orange-600 to-orange-900', z: 5 },
    { title: 'Minions', rotation: 8, position: { bottom: '10%', right: '0%' }, color: 'from-pink-600 to-pink-900', z: 6 },
    { title: 'মাইনকার', rotation: -18, position: { top: '30%', left: '20%' }, color: 'from-yellow-600 to-yellow-900', z: 7 },
  ]

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#0a0a0a',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header BD Screens Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.jpeg"
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
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:text-gray-300 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="px-6 py-2.5 bg-[#FF0000] text-white rounded font-semibold hover:bg-[#FF1a1a] transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - BD Screens Style */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/5 via-transparent to-[#FF6B35]/5 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Featured Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/30 backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-[#FF0000]">NEW RELEASE</span>
              </div>
              <h1 
                className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
                style={{ letterSpacing: '-0.04em' }}
              >
                {featuredContent.title}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{featuredContent.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{featuredContent.year}</span>
                <span className="text-gray-400">•</span>
                <span className="px-3 py-1 border border-gray-500 text-xs rounded">{featuredContent.genre}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{featuredContent.duration}</span>
                </div>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                {featuredContent.description}
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-lg">
                  <Play className="w-6 h-6 fill-current" />
                  Play
                </button>
                <button className="px-8 py-4 bg-gray-600/70 text-white rounded-lg font-semibold hover:bg-gray-600/90 transition-colors flex items-center gap-2 text-lg backdrop-blur-sm">
                  More Info
                </button>
              </div>
            </div>

            {/* Right: Poster Collage */}
            <div className="relative h-[600px] hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                {heroPosters.map((poster, idx) => (
                  <div
                    key={idx}
                    className="absolute w-36 h-52 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br group cursor-pointer"
                    style={{
                      transform: `rotate(${poster.rotation}deg)`,
                      ...poster.position,
                      zIndex: poster.z,
                    }}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${poster.color} group-hover:scale-110 transition-transform duration-300`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        <span className="font-display text-sm font-bold text-white text-center drop-shadow-lg" style={{ letterSpacing: '-0.01em' }}>
                          {poster.title}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <main className="relative z-10 pb-16 pt-8">
        {/* Trending Now Row */}
        <section className="mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Trending Now
              </h2>
              <Link href="#" className="flex items-center gap-1 text-white hover:text-[#FF0000] transition-colors font-sans">
                See all <Plus className="w-4 h-4 text-[#FF0000]" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {trendingNow.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-80 group cursor-pointer">
                  <div className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-xl`}>
                    {/* Poster Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 flex items-center justify-center text-8xl">
                        {item.poster}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white/30">
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{item.rating}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#FF0000]/30 border border-[#FF0000]/50 text-[#FF0000] text-xs font-bold rounded">
                          {item.genre}
                        </span>
                        <span className="text-xs text-gray-400">{item.year}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-sans">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Most Popular Row */}
        <section className="mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Most Popular
              </h2>
              <Link href="#" className="flex items-center gap-1 text-white hover:text-[#FF0000] transition-colors font-sans">
                See all <Plus className="w-4 h-4 text-[#FF0000]" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {popularContent.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className={`relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                    {/* Poster Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {item.poster}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs">
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{item.rating}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="font-display text-xs font-bold text-white text-center line-clamp-2 mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 text-center font-sans">{item.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentaries Row */}
        <section className="mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Documentaries
              </h2>
              <Link href="#" className="flex items-center gap-1 text-white hover:text-[#FF0000] transition-colors font-sans">
                See all <Plus className="w-4 h-4 text-[#FF0000]" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {documentaries.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className={`relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {item.poster}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs">
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{item.rating}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="font-display text-xs font-bold text-white text-center line-clamp-2 mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 text-center font-sans">{item.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Independent Films Row */}
        <section className="mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Independent Films
              </h2>
              <Link href="#" className="flex items-center gap-1 text-white hover:text-[#FF0000] transition-colors font-sans">
                See all <Plus className="w-4 h-4 text-[#FF0000]" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {independentFilms.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-64 group cursor-pointer">
                  <div className={`relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br ${item.color} group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">
                        {item.poster}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{item.rating}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 to-transparent">
                      <h3 className="font-display text-sm font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-sans">
                        <span>{item.year}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

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

