import Link from 'next/link'
import Image from 'next/image'
import { Play, Download, Share2, Heart, Plus } from 'lucide-react'

export default function ButtonsDemoPage() {
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
                src="/items/vlockster_logo.png"
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
          <div className="max-w-6xl mx-auto">
            {/* Back Link */}
            <Link
              href="/ui-demos"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              ← Volver a Demos
            </Link>

            {/* Title */}
            <h1 className="font-display text-6xl md:text-7xl font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>
              Botones CTA
            </h1>
            <p className="font-display text-2xl text-[#FF0000] mb-4 font-semibold" style={{ letterSpacing: '-0.01em' }}>
              STREAMLAB Style
            </p>
            <p className="text-lg text-gray-300 mb-12 font-sans">
              Variantes de botones según las UI/UX Guidelines: Primary, Secondary y Ghost
            </p>

            {/* Primary Buttons Section */}
            <section className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Primary (Rojo Gradient)</h2>
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40">
                    SUBSCRIBE
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    PLAY NOW
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-lg font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-lg shadow-red-500/30">
                    Small Primary
                  </button>
                </div>
              </div>
              <code className="block text-sm text-gray-400 bg-black/30 px-4 py-3 rounded">
                className=&quot;px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40&quot;
              </code>
            </section>

            {/* Secondary Buttons Section */}
            <section className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Secondary (Outline)</h2>
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all">
                    WATCH TRAILER
                  </button>
                  <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    DOWNLOAD
                  </button>
                  <button className="px-6 py-3 border-2 border-white/20 text-white rounded-lg font-medium hover:border-white/40 hover:bg-white/10 transition-all">
                    Small Secondary
                  </button>
                </div>
              </div>
              <code className="block text-sm text-gray-400 bg-black/30 px-4 py-3 rounded">
                className=&quot;px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all&quot;
              </code>
            </section>

            {/* Ghost Buttons Section */}
            <section className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Ghost</h2>
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors">
                    Learn More
                  </button>
                  <button className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                    Small Ghost
                  </button>
                </div>
              </div>
              <code className="block text-sm text-gray-400 bg-black/30 px-4 py-3 rounded">
                className=&quot;px-6 py-2.5 text-gray-300 hover:text-white transition-colors&quot;
              </code>
            </section>

            {/* Icon Buttons Section */}
            <section className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Icon Buttons</h2>
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-[#FF0000] hover:border-[#FF0000] transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="p-4 rounded-xl bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-lg shadow-red-500/30">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
            </section>

            {/* States Section */}
            <section className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Estados</h2>
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold opacity-50 cursor-not-allowed">
                    Disabled
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold animate-pulse">
                    Loading...
                  </button>
                  <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed">
                    Disabled Outline
                  </button>
                </div>
              </div>
            </section>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Variantes</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Primary: Rojo gradient con shadow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Secondary: Outline con hover
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Ghost: Texto simple, hover color
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Icon: Botones circulares/redondeados
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Uso Recomendado</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Primary: Acciones principales (CTA)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Secondary: Acciones secundarias
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Ghost: Acciones terciarias/links
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Icon: Acciones rápidas en cards
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

