import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Play, Film, Users, DollarSign, ArrowRight, Star, Heart, MessageCircle, Search, Bell, Info, Clock, Check, Calendar } from 'lucide-react'
import { HeroVideo } from '@/components/HeroVideo'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import { VideoCard } from '@/components/VideoCard'

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

      {/* Hero Section - Netflix Style */}
      <HeroVideo
        title={featuredContent[0].title}
        description="The platform for independent cinema. Streaming, crowdfunding, and community in one place for creators and fans."
        imageUrl={featuredContent[0].image}
        year={featuredContent[0].year}
        duration={featuredContent[0].duration}
        rating={featuredContent[0].rating}
        genre={featuredContent[0].genre}
        videoId={featuredContent[0].id.toString()}
      />

      <main
        id="main-content"
        className="relative z-10 pb-16"
        role="main"
        aria-label="Plataforma VLOCKSTER"
      >
        {/* Content Rows - Nextflix Style */}
        <div className="relative z-10 -mt-32 pb-16">
          {contentRows.map((row, idx) => (
            <HorizontalCarousel
              key={idx}
              title={row.title}
              showAllLink={row.items.length > 8 ? "/watch" : undefined}
            >
              {row.items.map((item) => (
                <div key={item.id} role="listitem">
                  <VideoCard
                    id={item.id.toString()}
                    title={item.title}
                    description={`${item.title} - ${item.genre}`}
                    thumbnailUrl={item.image}
                    duration={item.duration}
                    year={item.year}
                    rating={item.rating}
                    className="min-w-[190px] md:min-w-[220px]"
                  />
                </div>
              ))}
            </HorizontalCarousel>
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
            <div className="bg-gray-900 rounded-2xl border-2 border-white/10 shadow-lg overflow-hidden">
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
              <div className="p-8 border-b border-white/10">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-4xl font-black text-[#FF0000] mb-1">$125,000</div>
                      <div className="text-white">raised of $500,000 goal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white">25%</div>
                      <div className="text-white">funded</div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">234</div>
                    <div className="text-sm text-white flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      backers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">45</div>
                    <div className="text-sm text-white flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4" />
                      days left
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">$534</div>
                    <div className="text-sm text-white">avg pledge</div>
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-8">
                <h4 className="text-2xl font-bold mb-4 text-white">About this project</h4>
                <div className="prose max-w-none text-white space-y-4 mb-8">
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
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <Check className="w-5 h-5 text-[#FF0000] flex-shrink-0" />
                      <span className="text-white">{feature}</span>
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
