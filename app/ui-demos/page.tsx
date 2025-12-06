import Link from 'next/link'
import type { Route } from 'next'
import Image from 'next/image'

export default function UIDemosPage() {
  const demos = [
    {
      id: 'header',
      title: 'Header/Navegación',
      description: 'Header fijo con glassmorphism, navegación central y botón CTA',
      link: '/ui-demos/header',
      features: ['Fixed position', 'Backdrop blur', 'Navegación central', 'Botón SUBSCRIBE']
    },
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Hero section estilo STREAMLAB con badge, ratings, botones CTA y mini preview',
      link: '/ui-demos/hero',
      features: ['Badge trending', 'Ratings IMDb', 'PLAY NOW / WATCH TRAILER', 'Mini preview']
    },
    {
      id: 'thumbnails',
      title: 'Thumbnails Horizontales',
      description: 'Secciones de contenido con scroll horizontal de thumbnails',
      link: '/ui-demos/thumbnails',
      features: ['Scroll horizontal', 'Hover effects', 'Badges de género', 'Acciones rápidas']
    },
    {
      id: 'glassmorphism',
      title: 'Glassmorphism Cards',
      description: 'Cards con efecto glassmorphism y hover effects',
      link: '/ui-demos/glassmorphism',
      features: ['Backdrop blur', 'Bordes sutiles', 'Hover animations', 'Transparencias']
    },
    {
      id: 'buttons',
      title: 'Botones CTA',
      description: 'Variantes de botones: Primary (rojo), Secondary (outline), Ghost',
      link: '/ui-demos/buttons',
      features: ['Primary gradient', 'Secondary outline', 'Ghost variant', 'Hover effects']
    }
  ]

  const inspirationDemos = [
    {
      id: 'nextflix',
      title: 'Nextflix Style',
      description: 'UI tipo Netflix moderna - Posters grandes, carruseles horizontales, diseño cinematográfico',
      link: '/ui-demos/inspiration/nextflix',
      source: 'github.com/Apestein/nextflix',
      demo: 'nextflix-v2.vercel.app',
      category: 'Streaming'
    },
    {
      id: 'netflix-clone',
      title: 'Netflix Clone (Material)',
      description: 'Netflix + Material UI - Fondos oscuros, overlays, mini reproductor modal',
      link: '/ui-demos/inspiration/netflix-clone',
      source: 'github.com/SudoKMaar/netflix-clone-nextjs',
      demo: 'netflix-clone-nextjs-zeta.vercel.app',
      category: 'Streaming'
    },
    {
      id: 'orka',
      title: 'OrKa Community',
      description: 'Plataforma de comunidad moderna - Feed estilo redes sociales, sidebar minimalista',
      link: '/ui-demos/inspiration/orka',
      source: 'github.com/DimiMikadze/orca',
      demo: 'demo.orcacloud.io',
      category: 'Comunidad'
    },
    {
      id: 'spruce',
      title: 'Spruce Social',
      description: 'UI simple para social feed - Feed minimalista, perfiles, cards geométricas',
      link: '/ui-demos/inspiration/spruce',
      source: 'github.com/dan-divy/spruce',
      demo: 'Screenshots en repo',
      category: 'Comunidad'
    },
    {
      id: 'nodebb',
      title: 'NodeBB Forum',
      description: 'Línea gráfica tipo foro moderno - Tarjetas de categorías, notificaciones, sidebar',
      link: '/ui-demos/inspiration/nodebb',
      source: 'github.com/NodeBB/NodeBB',
      demo: 'community.nodebb.org',
      category: 'Comunidad'
    },
    {
      id: 'peertube',
      title: 'PeerTube Video',
      description: 'UI profesional de video - Reproductor maduro, canal, grillas, branding adaptable',
      link: '/ui-demos/inspiration/peertube',
      source: 'github.com/Chocobozzz/PeerTube',
      demo: 'peertube.tv',
      category: 'Video'
    },
    {
      id: 'kickbacker',
      title: 'KickBacker',
      description: 'UI Crowdfunding - Página de proyecto, meta, progreso, rewards, dashboard creador',
      link: '/ui-demos/inspiration/kickbacker',
      source: 'github.com/taylormusolf/KickBacker',
      demo: 'Screenshots en repo',
      category: 'Crowdfunding'
    },
    {
      id: 'open-crowd-fund',
      title: 'Open Crowd Fund',
      description: 'UI simple de campaña - Landing limpia, barra de progreso, estilo SaaS minimalista',
      link: '/ui-demos/inspiration/open-crowd-fund',
      source: 'github.com/rwieruch/open-crowd-fund',
      demo: 'open-crowd-fund.com',
      category: 'Crowdfunding'
    },
    {
      id: 'bd-screens',
      title: 'BD Screens Style',
      description: 'UI completa estilo streaming - Hero con collage, categorías, thumbnails, diseño oscuro moderno',
      link: '/ui-demos/inspiration/bd-screens',
      source: 'Inspiración BD Screens',
      demo: 'UI completa funcional',
      category: 'Streaming'
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
      <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.png"
                alt="VLOCKSTER"
                width={180}
                height={45}
                className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="font-display text-2xl font-bold text-white hidden sm:block">VLOCKSTER</span>
            </Link>
            <Link 
              href="/ui-demos" 
              className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
            >
              UI Demos
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 
              className="font-display text-6xl md:text-7xl font-bold mb-6"
              style={{ 
                background: 'linear-gradient(to right, #FFFFFF, #E5E5E5, #A0A0A0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.1',
                letterSpacing: '-0.03em'
              }}
            >
              UI Demos
            </h1>
            <p 
              className="font-display text-2xl text-[#FF0000] mb-4 font-semibold"
              style={{ letterSpacing: '-0.01em' }}
            >
              STREAMLAB Style
            </p>
            <p 
              className="text-xl"
              style={{ 
                color: '#E5E5E5',
                lineHeight: '1.6',
                letterSpacing: '0.01em'
              }}
            >
              Explora cada patrón de UI aplicado a VLOCKSTER según las UI/UX Guidelines
            </p>
          </div>

          {/* STREAMLAB Patterns Section */}
          <div className="mb-16">
            <h2 
              className="font-display text-4xl font-bold mb-8"
              style={{ 
                color: '#FFFFFF',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              Patrones STREAMLAB
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demos.map((demo) => (
                <Link
                  key={demo.id}
                  href={demo.link as Route}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="relative z-10">
                    <h2 
                      className="font-display text-2xl font-bold mb-3"
                      style={{ 
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {demo.title}
                    </h2>
                    <p 
                      className="mb-4"
                      style={{ 
                        color: '#E5E5E5',
                        lineHeight: '1.75',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {demo.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {demo.features.map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="text-sm flex items-center gap-2"
                          style={{ 
                            color: '#A0A0A0',
                            lineHeight: '1.5',
                            marginBottom: '0.5rem'
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: '#FF0000' }}
                          ></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-[#FF0000] font-semibold group-hover:text-[#FF6B35] transition-colors">
                      Ver Demo →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Inspiration Demos Section */}
          <div className="mb-16">
            <h2 
              className="font-display text-4xl font-bold mb-4"
              style={{ 
                color: '#FFFFFF',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              Inspiración Open Source
            </h2>
            <p 
              className="mb-6"
              style={{ 
                color: '#A0A0A0',
                lineHeight: '1.6'
              }}
            >
              Diferentes estilos visuales aplicados a VLOCKSTER basados en repos open source
            </p>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Todos', 'Streaming', 'Comunidad', 'Video', 'Crowdfunding'].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirationDemos.map((demo) => (
                <Link
                  key={demo.id}
                  href={demo.link as Route}
                  className="group relative p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/30">
                        {demo.category}
                      </span>
                    </div>
                    <h2 
                      className="font-display text-xl font-bold mb-2"
                      style={{ 
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {demo.title}
                    </h2>
                    <p 
                      className="text-sm mb-4"
                      style={{ 
                        color: '#E5E5E5',
                        lineHeight: '1.75'
                      }}
                    >
                      {demo.description}
                    </p>
                    <div className="text-[#FF0000] font-semibold text-sm group-hover:text-[#FF6B35] transition-colors">
                      Ver Demo →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

