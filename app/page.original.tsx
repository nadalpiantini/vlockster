'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Search, Bell, User, Star, Clock, Calendar, Award, MessageCircle, Heart, TrendingUp, Users, DollarSign, ArrowRight, Film } from 'lucide-react'

// Types
interface ContentItem {
  id: number
  title: string
  year: string
  rating: string
  duration: string
  genre: string
  image: string
}

interface Campaign {
  title: string
  currentAmount: number
  goalAmount: number
  backers: number
  daysLeft: number
  avgPledge: number
  features: string[]
}

// Mock data - inspired by Nextflix, PeerTube, and Netflix clones
const featuredContent: ContentItem[] = [
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

const mockCampaign: Campaign = {
  title: 'Una Ola A La Vez',
  currentAmount: 125000,
  goalAmount: 500000,
  backers: 234,
  daysLeft: 45,
  avgPledge: 534,
  features: [
    'Early access to the film',
    'Exclusive behind-the-scenes content',
    'Producer credit in the film',
    'Digital download of the final cut'
  ]
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progressPercentage = (mockCampaign.currentAmount / mockCampaign.goalAmount) * 100

  return (
    <div className="min-h-screen text-white relative bg-black">
      {/* Nextflix-inspired Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800 py-2' 
            : 'bg-black/70 py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Nextflix style */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/items/vlockster_logo.png"
                alt="VLOCKSTER"
                width={120}
                height={32}
                className="object-contain h-8 w-auto"
                priority
              />
            </Link>

            {/* Navigation - Inspired by Nextflix */}
            <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : '#'}
                  className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Right side - Inspired by Nextflix + OrKa */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center cursor-pointer">
                <span className="text-xs font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Netflix-style Hero Section - Inspired by Netflix Clone */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src={featuredContent[0].image}
            alt={featuredContent[0].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content - Netflix/Nextflix style */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-white">
              {featuredContent[0].title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white text-lg">{featuredContent[0].rating}</span>
              </div>
              <span className="text-white">{featuredContent[0].year}</span>
              <span className="text-white">{featuredContent[0].duration}</span>
              <span className="text-white border border-white/30 px-2 py-1 text-xs rounded">
                {featuredContent[0].genre}
              </span>
            </div>
            
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {featuredContent[0].title} - An extraordinary journey that captivates audiences with its innovative storytelling and powerful cinematography.
            </p>
            
            <div className="flex gap-4">
              <Link href={`/watch/${featuredContent[0].id}`}>
                <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                  Play
                </button>
              </Link>
              <Link href={`/projects/${featuredContent[0].id}`}>
                <button className="flex items-center gap-2 bg-gray-600/70 text-white px-8 py-3 rounded font-bold hover:bg-gray-500/70 transition-colors">
                  <Heart className="w-5 h-5" />
                  Support Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rows - Nextflix/Netflix style */}
      <main className="relative z-10 -mt-32">
        {contentRows.map((row, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4">
              {row.title}
            </h2>
            <div className="px-4">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {row.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 relative group"
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="w-64 h-36 relative rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="font-bold">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{item.year}</span>
                          <span>•</span>
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* PeerTube-inspired Community Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Community</h2>
            <Link href="/community" className="text-gray-300 hover:text-white flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Inspired by OrKa and NodeBB */}
            {[
              { title: 'Film Discussions', posts: 1247, icon: MessageCircle, color: 'text-blue-500' },
              { title: 'Creator Spotlights', posts: 892, icon: Award, color: 'text-yellow-500' },
              { title: 'Behind the Scenes', posts: 2156, icon: Film, color: 'text-purple-500' },
              { title: 'Fan Reviews', posts: 3421, icon: Star, color: 'text-red-500' }
            ].map((forum, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <forum.icon className={`w-8 h-8 ${forum.color}`} />
                  <h3 className="text-lg font-bold text-white">{forum.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{forum.posts.toLocaleString()} posts</p>
                <div className="mt-4">
                  <div className="text-xs text-gray-500">Latest: {featuredContent[index % featuredContent.length].title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KickBacker-inspired Crowdfunding Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
            <Link href="/projects" className="text-gray-300 hover:text-white flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <Image
                  src={mockCampaign.title === 'Una Ola A La Vez' ? featuredContent[0].image : '/items/posters/POSTER NOCHE DE CIRCO.jpg'}
                  alt={mockCampaign.title}
                  width={300}
                  height={400}
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>
              
              <div className="lg:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-bold text-green-500">FUNDING ACTIVE</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{mockCampaign.title}</h3>
                <p className="text-gray-300 mb-6">
                  Help bring this award-winning documentary to life. Join {mockCampaign.backers} backers supporting independent cinema.
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>${mockCampaign.currentAmount.toLocaleString()} raised</span>
                    <span>${mockCampaign.goalAmount.toLocaleString()} goal</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {Math.round(progressPercentage)}% funded • {mockCampaign.daysLeft} days left
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{mockCampaign.backers}</div>
                    <div className="text-gray-400 text-sm">Backers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{mockCampaign.daysLeft}</div>
                    <div className="text-gray-400 text-sm">Days Left</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">${mockCampaign.avgPledge}</div>
                    <div className="text-gray-400 text-sm">Avg Pledge</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold transition-colors">
                    Support Project
                  </button>
                  <button className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded font-bold transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OrKa-inspired Creator Spotlight */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Creator Spotlight</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Alejandro González', role: 'Documentary Director', followers: 12500, image: '/items/vlockster_logo.png' },
              { name: 'María Rodríguez', role: 'Independent Filmmaker', followers: 8900, image: '/items/vlockster_logo.png' },
              { name: 'Carlos Mendoza', role: 'Cinematographer', followers: 6400, image: '/items/vlockster_logo.png' }
            ].map((creator, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{creator.name}</h3>
                    <p className="text-gray-400 text-sm">{creator.role}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{creator.followers.toLocaleString()} followers</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Inspired by multiple sources */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/items/vlockster_logo.png"
                  alt="VLOCKSTER"
                  width={100}
                  height={27}
                  className="object-contain h-6 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm">
                VLOCKSTER - The platform for independent cinema. Streaming, crowdfunding, and community in one place.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Browse</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/watch" className="hover:text-white transition-colors">Watch</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">For Creators</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/apply" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/menu" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/watch" className="hover:text-white transition-colors">Watch</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2025 VLOCKSTER. All rights reserved. Independent Cinema Platform.
          </div>
        </div>
      </footer>
    </div>
  )
}