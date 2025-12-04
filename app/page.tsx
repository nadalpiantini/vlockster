import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  Play,
  TrendingUp,
  Users,
  Film,
  DollarSign,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'VLOCKSTER - El futuro del cine independiente',
  description:
    'Streaming, crowdfunding y comunidad para cine independiente. Descubre, financia y forma parte de historias extraordinarias.',
  keywords: [
    'cine independiente',
    'streaming',
    'crowdfunding',
    'películas indie',
    'creadores',
    'comunidad cinematográfica',
  ],
  openGraph: {
    title: 'VLOCKSTER - El futuro del cine independiente',
    description:
      'Streaming, crowdfunding y comunidad para cine independiente',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VLOCKSTER - El futuro del cine independiente',
    description:
      'Streaming, crowdfunding y comunidad para cine independiente',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/vlockster_logo.png"
                  alt="VLOCKSTER Logo"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                VLOCKSTER
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Iniciar sesión en VLOCKSTER"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-[#E50914] to-[#B20710] text-white rounded-lg font-semibold text-sm hover:from-[#F40612] hover:to-[#C11119] transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                aria-label="Registrarse en VLOCKSTER"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main role="main" className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,224,110,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,113,235,0.08),transparent_50%)]" />
          </div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#14E06E]" />
                <span className="text-sm text-gray-300">
                  La plataforma definitiva para cine independiente
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  El futuro del cine
                </span>
                <span className="block mt-2 bg-gradient-to-r from-[#E50914] via-[#F40612] to-[#E50914] bg-clip-text text-transparent animate-gradient">
                  independiente está aquí
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Streaming de calidad Netflix • Crowdfunding como Kickstarter • Comunidad vibrante como Skool
              </p>

              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                VLOCKSTER une a creadores y amantes del cine indie en una plataforma única donde puedes ver, financiar y formar parte de historias extraordinarias.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  href="/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#E50914] to-[#B20710] text-white rounded-xl font-semibold text-lg hover:from-[#F40612] hover:to-[#C11119] transition-all duration-300 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Comenzar Gratis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/watch"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Explorar Contenido</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#14E06E]" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#14E06E]" />
                  <span>Acceso inmediato</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#14E06E]" />
                  <span>Cancelar cuando quieras</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Todo en una plataforma
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Tres poderosas herramientas unidas para transformar el cine independiente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Streaming Feature */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#0071EB]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0071EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0071EB] to-[#0056B3] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Streaming Premium</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Accede a una biblioteca curada de cine independiente de alta calidad. Descubre historias únicas de creadores de todo el mundo, con calidad de transmisión tipo Netflix.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0071EB]" />
                      <span>Calidad 4K disponible</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0071EB]" />
                      <span>Sin anuncios</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0071EB]" />
                      <span>Descarga offline</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Crowdfunding Feature */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#14E06E]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#14E06E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#14E06E] to-[#0FA968] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Crowdfunding Inteligente</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Financia proyectos cinematográficos y forma parte de su creación. Sistema de recompensas exclusivas tipo Kickstarter, con seguimiento en tiempo real.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14E06E]" />
                      <span>Recompensas exclusivas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14E06E]" />
                      <span>Progreso en tiempo real</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14E06E]" />
                      <span>Pagos seguros</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Community Feature */}
              <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#E50914]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E50914] to-[#B20710] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Comunidad Vibrante</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Conéctate con otros cinéfilos y creadores. Participa en discusiones, eventos y talleres exclusivos. Una experiencia tipo Skool para el cine.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
                      <span>Foros de discusión</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
                      <span>Eventos exclusivos</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
                      <span>Networking profesional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 bg-black border-y border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#E50914] to-[#F40612] bg-clip-text text-transparent mb-2">
                  1000+
                </div>
                <div className="text-sm text-gray-400">Películas Indie</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#14E06E] to-[#0FA968] bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-400">Proyectos Financiados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#0071EB] to-[#0056B3] bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-sm text-gray-400">Miembros Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-400">Países</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section for Creators */}
        <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-4xl mx-auto bg-gradient-to-br from-[#E50914]/20 via-[#14E06E]/10 to-[#0071EB]/20 backdrop-blur-sm rounded-3xl p-12 sm:p-16 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.1),transparent_70%)]" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                  <Sparkles className="w-5 h-5 text-[#14E06E]" />
                  <span className="text-sm text-gray-300">Para Creadores</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ¿Eres un creador de contenido indie?
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Solicita acceso como creator y comparte tu trabajo con una audiencia global apasionada por el cine independiente. Monetiza tu contenido y construye tu comunidad.
                </p>
                <Link
                  href="/apply"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#14E06E] to-[#0FA968] text-black rounded-xl font-semibold text-lg hover:from-[#16F075] hover:to-[#11C56E] transition-all duration-300 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
                >
                  <span>Solicitar Acceso de Creator</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative border-t border-white/10 bg-black py-12"
        role="contentinfo"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/vlockster_logo.png"
                    alt="VLOCKSTER Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  VLOCKSTER
                </span>
              </Link>
              <p className="text-sm text-gray-500">
                La plataforma definitiva para cine independiente
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/watch" className="hover:text-white transition-colors">
                    Streaming
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-white transition-colors">
                    Crowdfunding
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Comunidad
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Para Creadores</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/apply" className="hover:text-white transition-colors">
                    Convertirse en Creator
                  </Link>
                </li>
                <li>
                  <Link href="/projects/create" className="hover:text-white transition-colors">
                    Crear Proyecto
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-white transition-colors">
                    Subir Contenido
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:text-white transition-colors"
                    aria-label="Leer términos de uso"
                  >
                    Términos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-white transition-colors"
                    aria-label="Leer política de privacidad"
                  >
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>&copy; 2025 VLOCKSTER. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
