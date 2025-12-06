import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'
import { Play, ExternalLink, CheckCircle, Clock } from 'lucide-react'

export default function IntegrationMenuPage() {
  const uiDemosRoute = "/ui-demos" as Route
  
  const repositories = [
    {
      id: 'nextflix',
      name: 'Nextflix Style',
      category: 'Streaming',
      status: 'demo',
      description: 'UI tipo Netflix moderna - Posters grandes, carruseles horizontales',
      link: '/ui-demos/inspiration/nextflix',
      source: 'github.com/Apestein/nextflix',
      features: ['Hero section masivo', 'Carruseles horizontales', 'Posters grandes', 'Diseño cinematográfico'],
      color: 'from-red-600 to-red-800',
      image: 'https://private-user-images.githubusercontent.com/107362680/263873887-6d2d89d0-63f3-4d6c-97a7-3a12f514868e.png',
      poster: '🎬'
    },
    {
      id: 'netflix-clone',
      name: 'Netflix Clone (Material)',
      category: 'Streaming',
      status: 'demo',
      description: 'Netflix + Material UI - Fondos oscuros, overlays, mini reproductor',
      link: '/ui-demos/inspiration/netflix-clone',
      source: 'github.com/SudoKMaar/netflix-clone-nextjs',
      features: ['Material UI components', 'Mini reproductor modal', 'Overlays semitransparentes', 'Grids responsivos'],
      color: 'from-purple-600 to-purple-800',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
      poster: '🎭'
    },
    {
      id: 'bd-screens',
      name: 'BD Screens Style',
      category: 'Streaming',
      status: 'demo',
      description: 'UI completa estilo streaming - Hero con collage, categorías, thumbnails',
      link: '/ui-demos/inspiration/bd-screens',
      source: 'Inspiración BD Screens',
      features: ['Hero con collage de posters', 'Múltiples categorías', 'Ratings y metadata', 'Diseño oscuro moderno'],
      color: 'from-blue-600 to-blue-800',
      image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=600&fit=crop',
      poster: '📺'
    },
    {
      id: 'orka',
      name: 'OrKa Community',
      category: 'Comunidad',
      status: 'demo',
      description: 'Plataforma de comunidad moderna - Feed estilo redes sociales',
      link: '/ui-demos/inspiration/orka',
      source: 'github.com/DimiMikadze/orca',
      features: ['Feed social', 'Sidebar minimalista', 'Interacción moderna', 'Cards limpias'],
      color: 'from-green-600 to-green-800',
      image: 'https://res.cloudinary.com/dkkf9iqnd/image/upload/v1633071697/community/Home_Page.png',
      poster: '👥'
    },
    {
      id: 'spruce',
      name: 'Spruce Social',
      category: 'Comunidad',
      status: 'demo',
      description: 'UI simple para social feed - Feed minimalista, perfiles',
      link: '/ui-demos/inspiration/spruce',
      source: 'github.com/dan-divy/spruce',
      features: ['Feed minimalista', 'Perfiles simples', 'Cards geométricas', 'Diseño ligero'],
      color: 'from-teal-600 to-teal-800',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      poster: '💬'
    },
    {
      id: 'nodebb',
      name: 'NodeBB Forum',
      category: 'Comunidad',
      status: 'demo',
      description: 'Línea gráfica tipo foro moderno - Tarjetas de categorías',
      link: '/ui-demos/inspiration/nodebb',
      source: 'github.com/NodeBB/NodeBB',
      features: ['Tarjetas de categorías', 'Notificaciones en tiempo real', 'Sidebar + header limpio', 'Navegación intuitiva'],
      color: 'from-indigo-600 to-indigo-800',
      image: 'http://i.imgur.com/VCoOFyq.png',
      poster: '💭'
    },
    {
      id: 'peertube',
      name: 'PeerTube Video',
      category: 'Video',
      status: 'demo',
      description: 'UI profesional de video - Reproductor maduro, canal, grillas',
      link: '/ui-demos/inspiration/peertube',
      source: 'github.com/Chocobozzz/PeerTube',
      features: ['Reproductor profesional', 'Página de canal', 'Explorador de videos', 'Branding adaptable'],
      color: 'from-cyan-600 to-cyan-800',
      image: 'https://lutim.cpy.re/9CLXh0Ys.png',
      poster: '🎥'
    },
    {
      id: 'kickbacker',
      name: 'KickBacker',
      category: 'Crowdfunding',
      status: 'demo',
      description: 'UI Crowdfunding - Página de proyecto, meta, progreso, rewards',
      link: '/ui-demos/inspiration/kickbacker',
      source: 'github.com/taylormusolf/KickBacker',
      features: ['Página de proyecto', 'Meta y progreso', 'Tiers/rewards', 'Dashboard del creador'],
      color: 'from-orange-600 to-orange-800',
      image: 'https://user-images.githubusercontent.com/71670060/119078326-d25fba80-b9aa-11eb-8578-35f03d680a2b.PNG',
      poster: '💰'
    },
    {
      id: 'open-crowd-fund',
      name: 'Open Crowd Fund',
      category: 'Crowdfunding',
      status: 'demo',
      description: 'UI simple de campaña - Landing limpia, barra de progreso',
      link: '/ui-demos/inspiration/open-crowd-fund',
      source: 'github.com/rwieruch/open-crowd-fund',
      features: ['Landing page limpia', 'Barra de progreso grande', 'Estilo SaaS minimalista', 'Interfaz agradable'],
      color: 'from-pink-600 to-pink-800',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      poster: '📊'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'demo':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Demo UI
          </span>
        )
      case 'integrated':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Integrado
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-full text-xs font-semibold">
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  const categories = Array.from(new Set(repositories.map(r => r.category)))

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#050505',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
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
            <div className="flex items-center gap-4">
              <Link href={uiDemosRoute} className="text-sm text-gray-400 hover:text-white transition-colors font-sans">
                UI Demos
              </Link>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors font-sans">
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 
              className="font-display text-6xl md:text-7xl font-bold mb-6"
              style={{ letterSpacing: '-0.03em' }}
            >
              Galería de Integraciones
            </h1>
            <p className="text-xl text-gray-300 mb-4 font-sans">
              Versiones adaptadas de repositorios de referencia para VLOCKSTER
            </p>
            <p className="text-sm text-gray-500 font-sans">
              {repositories.length} adaptaciones disponibles • Selecciona una para ver la demo completa
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <button className="px-4 py-2 bg-[#FF0000]/20 border border-[#FF0000]/50 text-[#FF0000] rounded-lg font-semibold hover:bg-[#FF0000]/30 transition-colors">
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg font-semibold hover:bg-white/10 hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Repositories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Preview Image/Color */}
                <div className={`relative h-64 bg-gradient-to-br ${repo.color} overflow-hidden`}>
                  {/* Background Image */}
                  {repo.image && (
                    <div className="absolute inset-0">
                      <Image
                        src={repo.image}
                        alt={repo.name}
                        fill
                        className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                        unoptimized
                      />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${repo.color} mix-blend-multiply`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Poster Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-20 group-hover:opacity-40 transition-opacity">
                      {repo.poster}
                    </div>
                  </div>
                  
                  {/* Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-2xl">
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    {getStatusBadge(repo.status)}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-xs font-bold text-white border border-white/20">
                      {repo.category}
                    </span>
                  </div>
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-4 right-4 z-10 text-right">
                    <h3 className="font-display text-lg font-bold text-white drop-shadow-lg" style={{ letterSpacing: '-0.01em' }}>
                      {repo.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-4 font-sans line-clamp-2">
                    {repo.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {repo.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                          <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Source */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <a
                      href={`https://${repo.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#FF0000] transition-colors font-sans"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {repo.source}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={repo.link}
                      className="flex-1 px-4 py-2.5 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors text-center text-sm flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Ver Demo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-16 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h3 className="font-display text-lg font-bold mb-3">Estado de Integración</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-sans">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  <strong className="text-white">{repositories.filter(r => r.status === 'demo').length}</strong> Demos UI
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">
                  <strong className="text-white">0</strong> Integrados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-yellow-400">⏳</span>
                <span className="text-gray-300">
                  <strong className="text-white">0</strong> Pendientes
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

