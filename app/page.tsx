import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Play, Film, Users, DollarSign, ArrowRight, Star, Heart, MessageCircle, Search, Bell, Info, Clock, Check, Calendar } from 'lucide-react'

export default function HomePage() {
  const featuredContent = [
    { 
      id: 1, 
      title: 'Una Ola A La Vez', 
      year: '2024', 
      rating: '9.2', 
      duration: '2h 15m',
      genre: 'Documentary',
      image: '/items/posters/Una Ola A La Vez Poster.png'
    },
    { 
      id: 2, 
      title: 'Granito de Arena', 
      year: '2020', 
      rating: '8.7', 
      duration: '1h 45m',
      genre: 'Documentary',
      image: '/items/posters/Granito de Arena Poster.JPG'
    },
    { 
      id: 3, 
      title: 'Atravesando el Jordán', 
      year: '2020', 
      rating: '9.0', 
      duration: '2h 30m',
      genre: 'Drama',
      image: '/items/posters/Atravesando el Jordan Poster.jpg'
    },
    { 
      id: 4, 
      title: 'Kintsugi', 
      year: '2024', 
      rating: '8.8', 
      duration: '1h 50m',
      genre: 'Drama',
      image: '/items/posters/kintsugi poster.jpg'
    },
    { 
      id: 5, 
      title: 'Una Breve Historia de Amor', 
      year: '2024', 
      rating: '8.6', 
      duration: '1h 30m',
      genre: 'Romance',
      image: '/items/posters/Una Breve Historia de Amor Poster.jpg'
    },
    { 
      id: 6, 
      title: 'Motel', 
      year: '2024', 
      rating: '8.9', 
      duration: '1h 40m',
      genre: 'Thriller',
      image: '/items/posters/Motel Poster Final.png'
    },
    { 
      id: 7, 
      title: 'En La Oscuridad', 
      year: '2024', 
      rating: '8.7', 
      duration: '1h 55m',
      genre: 'Horror',
      image: '/items/posters/POSTER EN LA OSCURIDAD.jpg'
    },
    { 
      id: 8, 
      title: 'Noche de Circo', 
      year: '2024', 
      rating: '8.8', 
      duration: '2h 10m',
      genre: 'Drama',
      image: '/items/posters/POSTER NOCHE DE CIRCO.jpg'
    },
  ]

  const contentRows = [
    { title: 'Trending Now', items: featuredContent.slice(0, 8) },
    { title: 'Popular on VLOCKSTER', items: featuredContent.slice(0, 8) },
    { title: 'Documentaries', items: featuredContent.filter(item => item.genre === 'Documentary') },
    { title: 'Independent Films', items: featuredContent.filter(item => item.genre !== 'Documentary') }
  ]

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundColor: '#000000'
      }}
    >
      {/* Header - STREAMLAB Style with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.png"
                alt="VLOCKSTER"
                width={150}
                height={40}
                className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="font-display text-xl font-bold text-white hidden md:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>

            {/* Navigation Links - Central */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              <Link
                href="/"
                className="text-white hover:text-white transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/watch"
                className="text-white hover:text-white transition-colors duration-300 relative group"
              >
                Watch
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href={"/menu" as Route}
                className="text-white hover:text-white transition-colors duration-300 relative group"
              >
                Gallery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/projects"
                className="text-white hover:text-white transition-colors duration-300 relative group"
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Right Side: Search, Notifications, SUBSCRIBE */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-white hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-white hover:text-white transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-lg shadow-red-500/30"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - BD Screens / Nextflix Style Combined */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/5 via-transparent to-[#FF6B35]/5 z-0"></div>
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <Image
              src={featuredContent[0].image}
              alt="Hero background"
              fill
              className="object-cover opacity-50"
              priority
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/50"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            {/* Badge - BD Screens Style */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/30 backdrop-blur-sm mb-6 shadow-lg">
              <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-wider text-white">NEW RELEASE</span>
            </div>
            
            {/* Main Title - BD Screens Style */}
            <h1 
              className="font-display text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ letterSpacing: '-0.04em' }}
            >
              {featuredContent[0].title}
            </h1>
            
            {/* Ratings - BD Screens Style */}
            <div className="flex items-center gap-4 mb-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white">{featuredContent[0].rating}</span>
              </div>
              <span className="text-white">•</span>
              <span className="text-white">{featuredContent[0].year}</span>
              <span className="text-white">•</span>
              <span className="px-3 py-1 border border-white/40 text-xs rounded text-white bg-white/10 backdrop-blur-sm">{featuredContent[0].genre}</span>
              <span className="text-white">•</span>
              <span className="text-white">{featuredContent[0].duration}</span>
            </div>
            
            <p className="text-lg text-white mb-8 leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              The platform for independent cinema. Streaming, crowdfunding, and community in one place for creators and fans.
            </p>

            {/* CTA Buttons - BD Screens Style */}
            <div className="flex gap-4" role="group" aria-label="Main actions">
              <Link
                href="/watch"
                data-testid="cta-watch"
                className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-lg"
              >
                <Play className="w-6 h-6 fill-current" />
                Play
              </Link>
              <Link
                href="/signup"
                data-testid="cta-signup"
                className="px-8 py-4 bg-gray-600/70 text-white rounded-lg font-semibold hover:bg-gray-600/90 transition-colors flex items-center gap-2 text-lg backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
                More Info
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
        {/* Content Rows - Nextflix/BD Screens Style */}
        <div className="relative z-10 -mt-32 pb-16">
          {contentRows.map((row, idx) => (
            <section key={idx} className="mb-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl md:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                    {row.title}
                  </h2>
                  {row.items.length > 8 && (
                    <Link href="/watch" className="flex items-center gap-1 text-white hover:text-[#FF0000] transition-colors font-sans">
                      See all <ArrowRight className="w-4 h-4 text-[#FF0000]" />
                    </Link>
                  )}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {row.items.map((item) => (
                    <Link
                      key={item.id}
                      href="/watch"
                      className="group relative flex-shrink-0 w-48 md:w-56 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gray-900">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover opacity-100"
                          unoptimized
                          priority={idx === 0 && row.items.indexOf(item) < 4}
                        />
                      </div>
                      
                      {/* Light gradient overlay always visible for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>
                      
                      {/* Title always visible at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black via-black/90 to-transparent">
                        <h3 className="font-display text-sm font-bold mb-1 text-white" style={{ letterSpacing: '-0.01em', textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)' }}>
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,1)' }}>
                          <span>{item.year}</span>
                          <span className="text-white">•</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                      
                      {/* Rating Badge - Always visible */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded border border-white/30 shadow-lg z-10">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-white">{item.rating}</span>
                      </div>
                      
                      {/* Play button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 shadow-xl">
                          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      
                      {/* Additional overlay on hover for better contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <button className="w-full px-3 py-1.5 bg-white text-black rounded text-xs font-semibold hover:bg-gray-200 transition-colors shadow-lg">
                            ▶ Play
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Features Section - Glassmorphism Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <Film className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                  Streaming
                </h3>
                <p className="text-white leading-relaxed">
                  Launch secure premieres with access control and analytics.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                  Crowdfunding
                </h3>
                <p className="text-white leading-relaxed">
                  Set goals, rewards, and pre-releases for your community.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                  Community
                </h3>
                <p className="text-white leading-relaxed">
                  Activate forums, memberships, and project tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Crowdfunding Section - Open Crowd Fund Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Crowdfunding projects">
          <div className="mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              Active Campaigns
            </h2>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Campaign Card - Open Crowd Fund Style */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              {/* Campaign Header */}
              <div className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm opacity-90">Film & Video</span>
                    <h3 className="text-3xl font-bold mt-2">Una Ola A La Vez</h3>
                  </div>
                  <Link
                    href="/projects"
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-colors"
                  >
                    Back Project
                  </Link>
                </div>
              </div>

              {/* Progress Bar - Large and Clear */}
              <div className="p-8 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-4xl font-black text-[#FF0000] mb-1">$125,000</div>
                      <div className="text-gray-600">raised of $500,000 goal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-gray-900">25%</div>
                      <div className="text-gray-600">funded</div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">234</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      backers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">45</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4" />
                      days left
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">$534</div>
                    <div className="text-sm text-gray-600">avg pledge</div>
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-8">
                <h4 className="text-2xl font-bold mb-4">About this project</h4>
                <div className="prose max-w-none text-gray-700 space-y-4 mb-8">
                  <p>
                    Este proyecto busca revolucionar la forma en que se produce y distribuye el cine independiente.
                    Con tu apoyo, podremos crear una plataforma completa que combine streaming, crowdfunding y comunidad.
                  </p>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Early access to the film',
                    'Exclusive behind-the-scenes content',
                    'Producer credit in the film',
                    'Digital download of the final cut'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                      <Check className="w-5 h-5 text-[#FF0000] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section - STREAMLAB Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-label="Community">
          <div className="mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              Join the Community
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Community Card 1 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>Forums</h3>
                <p className="text-white mb-4">Discuss films, share ideas, and connect with creators.</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl font-bold">1,234</span>
                  <span className="text-sm text-white">active discussions</span>
                </div>
              </div>
            </div>
            
            {/* Community Card 2 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>Memberships</h3>
                <p className="text-white mb-4">Exclusive access to premieres and creator content.</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl font-bold">567</span>
                  <span className="text-sm text-white">active members</span>
                </div>
              </div>
            </div>
            
            {/* Community Card 3 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#FF0000]" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>Project Tracking</h3>
                <p className="text-white mb-4">Follow your favorite projects from concept to release.</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl font-bold">89</span>
                  <span className="text-sm text-white">active projects</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator CTA Section - STREAMLAB Style */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16" role="group" aria-label="CTA para creators">
          <div className="relative p-8 md:p-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/30 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></span>
                  <span className="text-sm font-bold uppercase tracking-wider text-white">FOR CREATORS</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  Are you a filmmaker?
                  <span className="block text-2xl md:text-3xl text-white mt-2 font-semibold">
                    Request Creator Access
                  </span>
                </h3>
                <p className="text-lg text-white max-w-2xl leading-relaxed">
                  Publish, raise funds, and collaborate with your audience.
                </p>
              </div>
              <Link
                href="/apply"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 flex items-center gap-2 whitespace-nowrap"
              >
                <span>REQUEST ACCESS</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              <span className="text-white">· Independent Cinema</span>
            </div>
            <div className="flex gap-6">
              <Link href="/legal/privacy" className="text-white hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="text-white hover:text-white transition-colors">
                Terms
              </Link>
              <Link href={"/menu" as Route} className="text-white hover:text-white transition-colors">
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
