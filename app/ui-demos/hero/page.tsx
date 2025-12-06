import Link from 'next/link'
import { Play, Info } from 'lucide-react'

export default function HeroDemoPage() {
  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#050505',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Hero Section STREAMLAB Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/10 via-transparent to-[#FF6B35]/10 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Main Content */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/30 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></span>
                  <span className="text-sm font-bold uppercase tracking-wider">TRENDING NOW</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block">The Future of</span>
                  <span className="block bg-gradient-to-r from-[#FF0000] to-[#FF6B35] bg-clip-text text-transparent">
                    Independent Cinema
                  </span>
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/20">
                    TV-MA
                  </span>
                  <span className="text-gray-300">IMDb</span>
                  <span className="text-[#FF0000] font-bold">9.5</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">2024</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">2h 15m</span>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  Una plataforma revolucionaria que combina streaming, crowdfunding y comunidad
                  para cineastas independientes. Produce, distribuye y financia tu proyecto con
                  el apoyo de tu audiencia.
                </p>

                {/* Cast & Genre */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="text-gray-400">Cast:</span>
                  <span className="text-gray-300">Directores independientes</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Genre:</span>
                  <span className="px-2 py-1 rounded bg-white/10 border border-white/20">
                    Drama
                  </span>
                  <span className="px-2 py-1 rounded bg-white/10 border border-white/20">
                    Thriller
                  </span>
                  <span className="px-2 py-1 rounded bg-white/10 border border-white/20">
                    Documentary
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    <span>PLAY NOW</span>
                  </button>
                  <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <span>WATCH TRAILER</span>
                  </button>
                </div>
              </div>

              {/* Right: Mini Preview */}
              <div className="hidden lg:block relative">
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white/20 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/20 to-[#FF6B35]/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm font-semibold">Preview: VLOCKSTER Platform</p>
                      <p className="text-xs text-gray-300">Watch the full experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows (optional) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            ←
          </button>
          <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            →
          </button>
        </div>
      </section>

      {/* Demo Info */}
      <main className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/ui-demos"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              ← Volver a Demos
            </Link>

            {/* Title */}
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>
              Hero Section
            </h2>
            <p className="font-display text-2xl text-[#FF0000] mb-4 font-semibold" style={{ letterSpacing: '-0.01em' }}>
              STREAMLAB Style
            </p>
            <p className="text-lg text-gray-300 mb-12 font-sans">
              Hero section impactante con badge, ratings, descripción y botones CTA
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Elementos Principales</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Badge &quot;TRENDING NOW&quot;
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Título grande con gradient
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Ratings (TV-MA, IMDb 9.5)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Descripción y metadata
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Botones CTA</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    PLAY NOW (rojo gradient)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    WATCH TRAILER (outline)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Mini preview a la derecha
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Flechas de navegación
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

