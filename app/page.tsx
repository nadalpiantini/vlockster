import Image from 'next/image'
import Link from 'next/link'
import { Play, Film, Users, DollarSign, ArrowRight, Star, ChevronLeft, ChevronRight, TrendingUp, Heart, MessageCircle } from 'lucide-react'

export default function HomePage() {
  const featuredContent = [
    { 
      id: 1, 
      title: 'Una Ola A La Vez', 
      year: '2024', 
      rating: '9.2', 
      image: '/items/posters/Una Ola A La Vez Poster.png'
    },
    { 
      id: 2, 
      title: 'Granito de Arena', 
      year: '2020', 
      rating: '8.7', 
      image: '/items/posters/Granito de Arena Poster.JPG'
    },
    { 
      id: 3, 
      title: 'Dos Policías en Apuros', 
      year: '2024', 
      rating: '8.9', 
      image: '/items/posters/Dos Policias en Apuros Poster.jpg'
    },
    { 
      id: 4, 
      title: 'Atravesando el Jordán', 
      year: '2020', 
      rating: '9.0', 
      image: '/items/posters/Atravesando el Jordan Poster.jpg'
    },
    { 
      id: 5, 
      title: 'Kintsugi', 
      year: '2024', 
      rating: '8.8', 
      image: '/items/posters/kintsugi poster.jpg'
    },
    { 
      id: 6, 
      title: 'Una Breve Historia de Amor', 
      year: '2024', 
      rating: '8.6', 
      image: '/items/posters/Una Breve Historia de Amor Poster.jpg'
    },
    { 
      id: 7, 
      title: 'En Tu Piel', 
      year: '2024', 
      rating: '8.5', 
      image: '/items/posters/En Tu Piel Poster.jpeg'
    },
    { 
      id: 8, 
      title: 'Motel', 
      year: '2024', 
      rating: '8.9', 
      image: '/items/posters/Motel Poster Final.png'
    },
    { 
      id: 9, 
      title: 'En La Oscuridad', 
      year: '2024', 
      rating: '8.7', 
      image: '/items/posters/POSTER EN LA OSCURIDAD.jpg'
    },
    { 
      id: 10, 
      title: 'Noche de Circo', 
      year: '2024', 
      rating: '8.8', 
      image: '/items/posters/POSTER NOCHE DE CIRCO.jpg'
    },
  ]

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundColor: '#000000',
        backgroundImage: 'linear-gradient(to bottom, #0a0a0a 0%, #000000 50%, #0a0a0a 100%)'
      }}
    >
      {/* Header - Netflix Style */}
      <header className="bg-gradient-to-b from-black via-black/80 to-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.jpeg"
                alt="VLOCKSTER"
                width={180}
                height={45}
                className="object-contain h-10 w-auto transition-opacity duration-300 group-hover:opacity-80"
                priority
              />
              <span className="font-display text-2xl font-bold text-white hidden sm:block">
                VLOCKSTER
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm" role="navigation" aria-label="Main navigation">
              <Link href="/watch" className="text-gray-300 hover:text-white transition-colors">
                Watch
              </Link>
              <Link href="/menu" className="text-gray-300 hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
                Registrarse
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Nextflix Style */}
      <section className="relative min-h-[90vh] flex items-end pb-20 pt-20 overflow-hidden">
        {/* Hero Background - Nextflix Style */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-900">
            <Image
              src={featuredContent[0].image}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          {/* Netflix-style gradient overlay - Más oscuro para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/60"></div>
          {/* Overlay adicional para asegurar legibilidad */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            {/* Badge - Netflix Style */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-600/95 backdrop-blur-sm mb-4 shadow-lg">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-white">Independent Cinema · Streaming · Crowdfunding</span>
            </div>
            
            {/* Main Title - Nextflix Style con sombra para legibilidad */}
            <h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              VLOCKSTER
            </h1>
            
            {/* Featured Film Title */}
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {featuredContent[0].title}
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold text-white">{featuredContent[0].rating}</span>
              </div>
              <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">•</span>
              <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{featuredContent[0].year}</span>
            </div>
            
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed max-w-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-medium">
              The platform for independent cinema. Streaming, crowdfunding, and community in one place for creators and fans.
            </p>

            {/* CTA Buttons - Netflix Style */}
            <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="Main actions">
              <Link
                href="/signup"
                data-testid="cta-signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded-md font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Comenzar Gratis
              </Link>
              <Link
                href="/watch"
                data-testid="cta-watch"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-600/70 text-white rounded-md font-semibold text-lg hover:bg-gray-600/90 transition-colors backdrop-blur-sm"
              >
                Explorar Contenido
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main
        id="main-content"
        className="relative z-10 pb-16"
        role="main"
        aria-label="Plataforma VLOCKSTER"
      >

        {/* Features Section - Netflix Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <Film className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Streaming
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Launch secure premieres with access control and analytics.
                </p>
              </div>
            </div>
            
            <div className="group relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Crowdfunding
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Set goals, rewards, and pre-releases for your community.
                </p>
              </div>
            </div>
            
            <div className="group relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Comunidad
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Activate forums, memberships, and project tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now - Nextflix Style Horizontal Carousel */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Trending now">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Trending Now
            </h2>
          </div>
          
          {/* Horizontal Scrollable Carousel - Nextflix Style */}
          <div className="overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-3 md:gap-4" style={{ width: 'max-content' }}>
              {featuredContent.map((item) => (
                <Link
                  key={item.id}
                  href="/watch"
                  className="group relative flex-shrink-0 w-40 md:w-56 aspect-[2/3] rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="absolute inset-0 bg-gray-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                      unoptimized
                    />
                  </div>
                  
                  {/* Netflix-style gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Hover Play Button - Nextflix Style */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-6 h-6 text-black fill-black ml-1" />
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-white">{item.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Films Grid - PeerTube Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Featured films">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Featured Films
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredContent.map((item) => (
              <Link
                key={item.id}
                href="/watch"
                className="group relative aspect-[2/3] rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gray-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    unoptimized
                  />
                </div>
                
                {/* Netflix-style gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-white">{item.rating}</span>
                </div>
                
                {/* Title on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300">{item.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Crowdfunding Section - KickBacker Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Crowdfunding projects">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Active Campaigns
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Card 1 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Una Ola A La Vez
                  </h3>
                  <p className="text-gray-400">Documentary · 2024</p>
                </div>
                
                {/* Progress Bar - KickBacker Style */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-white font-semibold">$125,000</span>
                    <span className="text-gray-400">of $500,000</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">25% funded · 45 days left</p>
                </div>
                
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Support Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Campaign Card 2 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Granito de Arena
                  </h3>
                  <p className="text-gray-400">Documentary · 2020</p>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-white font-semibold">$75,000</span>
                    <span className="text-gray-400">of $300,000</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">25% funded · 30 days left</p>
                </div>
                
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Support Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section - OrKa Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Community">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Join the Community
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Community Card 1 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Forums</h3>
                <p className="text-gray-400 mb-4">Discuss films, share ideas, and connect with creators.</p>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-xl font-semibold">1,234</span>
                  <span className="text-sm">active discussions</span>
                </div>
              </div>
            </div>
            
            {/* Community Card 2 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Memberships</h3>
                <p className="text-gray-400 mb-4">Exclusive access to premieres and creator content.</p>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-xl font-semibold">567</span>
                  <span className="text-sm">active members</span>
                </div>
              </div>
            </div>
            
            {/* Community Card 3 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Project Tracking</h3>
                <p className="text-gray-400 mb-4">Follow your favorite projects from concept to release.</p>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-xl font-semibold">89</span>
                  <span className="text-sm">active projects</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator CTA Section - Netflix Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" role="group" aria-label="CTA para creators">
          <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-600/90 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">For Creators</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Are you a filmmaker?
                  <span className="block text-2xl md:text-3xl text-gray-300 mt-2">
                    Request Creator Access
                  </span>
                </h3>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                  Publish, raise funds, and collaborate with your audience.
                </p>
              </div>
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-md font-semibold text-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                Solicitar Acceso de Creator
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Netflix Style */}
      <footer className="relative z-10 border-t border-gray-800 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white">VLOCKSTER</span>
              <span className="text-gray-400">· Independent Cinema</span>
            </div>
            <div className="flex gap-6">
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
