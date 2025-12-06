import Link from 'next/link'
import Image from 'next/image'

export default function GlassmorphismDemoPage() {
  const cards = [
    {
      title: 'Streaming Platform',
      description: 'Distribuye tus proyectos con streaming seguro y de alta calidad',
      icon: '🎬',
      color: 'from-red-500/20 to-red-600/20'
    },
    {
      title: 'Crowdfunding',
      description: 'Financia tus proyectos con el apoyo directo de tu comunidad',
      icon: '💰',
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      title: 'Community Tools',
      description: 'Construye una comunidad activa alrededor de tu contenido',
      icon: '👥',
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Analytics',
      description: 'Métricas detalladas de visualizaciones, engagement y revenue',
      icon: '📊',
      color: 'from-green-500/20 to-green-600/20'
    },
    {
      title: 'Creator Dashboard',
      description: 'Gestiona todos tus proyectos desde un panel centralizado',
      icon: '⚡',
      color: 'from-orange-500/20 to-orange-600/20'
    },
    {
      title: 'Secure Payments',
      description: 'Integración con PayPal para transacciones seguras',
      icon: '🔒',
      color: 'from-pink-500/20 to-pink-600/20'
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
      {/* Background with gradient orbs for glassmorphism effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
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
      <main className="relative z-10 py-16">
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
              Glassmorphism Cards
            </h1>
            <p className="font-display text-2xl text-[#FF0000] mb-4 font-semibold" style={{ letterSpacing: '-0.01em' }}>
              STREAMLAB Style
            </p>
            <p className="text-lg text-gray-300 mb-12 font-sans">
              Cards con efecto glassmorphism, backdrop blur y hover effects sutiles
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-white/8 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Different Glassmorphism Variants */}
            <div className="space-y-8 mb-16">
              <h2 className="text-3xl font-bold">Variantes de Glassmorphism</h2>

              {/* Variant 1: Subtle */}
              <div className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">Variante Sutil</h3>
                <p className="text-gray-300 mb-4">
                  Background: rgba(255, 255, 255, 0.05) | Backdrop blur: 10px | Border: white/10
                </p>
                <code className="text-sm text-gray-400 bg-black/30 px-3 py-2 rounded">
                  bg-white/5 backdrop-blur-sm border-white/10
                </code>
              </div>

              {/* Variant 2: Medium */}
              <div className="p-8 rounded-xl border border-white/20 bg-white/8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-2">Variante Media</h3>
                <p className="text-gray-300 mb-4">
                  Background: rgba(255, 255, 255, 0.08) | Backdrop blur: 12px | Border: white/20
                </p>
                <code className="text-sm text-gray-400 bg-black/30 px-3 py-2 rounded">
                  bg-white/8 backdrop-blur-md border-white/20
                </code>
              </div>

              {/* Variant 3: Strong */}
              <div className="p-8 rounded-xl border border-white/30 bg-white/10 backdrop-blur-xl">
                <h3 className="text-xl font-bold mb-2">Variante Fuerte</h3>
                <p className="text-gray-300 mb-4">
                  Background: rgba(255, 255, 255, 0.10) | Backdrop blur: 16px | Border: white/30
                </p>
                <code className="text-sm text-gray-400 bg-black/30 px-3 py-2 rounded">
                  bg-white/10 backdrop-blur-xl border-white/30
                </code>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Características</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Backdrop blur (glassmorphism)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Bordes sutiles (white/10 a white/30)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Hover: aumenta opacidad y border
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Transform translateY en hover
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Uso</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Cards de contenido
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Modales y overlays
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Headers y navegación
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Paneles de información
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

