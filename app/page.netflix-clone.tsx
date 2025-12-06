'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Plus, ThumbsUp, ChevronDown, Search, Bell, User, Star, Clock, Calendar, Heart, MessageCircle, TrendingUp, Users, DollarSign, ArrowRight, Film } from 'lucide-react'
import { inter, spaceGrotesk } from '../fonts'

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

// Mock data based on VLOCKSTER content
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

export default function NetflixClonePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Netflix-styled Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link href="/">
                <Image
                  src="/items/vlockster_logo.png"
                  alt="VLOCKSTER"
                  width={100}
                  height={32}
                  className="object-contain h-8 w-auto"
                />
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
                  <Link key={item} href={item === 'Home' ? '/' : '#'} className="text-white hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:text-gray-300 transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <button className="p-2 text-white hover:text-gray-300 transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center cursor-pointer">
                <span className="text-xs font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Netflix-style Hero Section */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-black/60 z-0">
          <Image
            src={featuredContent[0].image}
            alt={featuredContent[0].title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-4">{featuredContent[0].title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-green-500 font-bold">{featuredContent[0].rating} Rating</span>
              <span className="text-white">{featuredContent[0].year}</span>
              <span className="text-white">{featuredContent[0].duration}</span>
              <span className="border border-white/50 px-2 py-1 text-xs">{featuredContent[0].genre}</span>
            </div>
            <p className="text-lg mb-8">
              The platform for independent cinema. Streaming, crowdfunding, and community in one place for creators and fans.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
              <button className="flex items-center gap-2 bg-gray-600/70 text-white px-8 py-3 rounded font-bold hover:bg-gray-600/90 transition-colors">
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Netflix-style Content Rows */}
      <main className="relative z-10 -mt-32">
        {contentRows.map((row, idx) => (
          <section key={idx} className="mb-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{row.title}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
                {row.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 relative group"
                    style={{ minWidth: '190px' }}
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0">
                        <h3 className="font-bold text-white truncate text-sm">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                          <span>{item.year}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
                          <span>•</span>
                          <span>{item.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{item.genre}</p>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <Play className="w-5 h-5 ml-0.5 text-black fill-current" />
                        </button>
                      </div>
                      
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/80 transition-colors">
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/80 transition-colors">
                          <ThumbsUp className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-3 right-3">
                        <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/80 transition-colors">
                          <ChevronDown className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Netflix-style Movie Detail Modal (Hidden by default) */}
      <div className="fixed inset-0 bg-black/90 z-50 hidden">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-4xl w-full bg-gray-900 p-8 rounded-xl relative">
            <button className="absolute top-4 right-4 text-white">
              <X className="w-8 h-8" />
            </button>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Image
                  src={featuredContent[0].image}
                  alt={featuredContent[0].title}
                  width={300}
                  height={450}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">{featuredContent[0].title}</h2>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-green-500 font-bold">{featuredContent[0].rating} Rating</span>
                  <span className="text-white">{featuredContent[0].year}</span>
                  <span className="text-white">{featuredContent[0].duration}</span>
                  <span className="border border-white/50 px-2 py-1 text-xs">{featuredContent[0].genre}</span>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                    Play
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gray-600/70 flex items-center justify-center hover:bg-gray-600/90 transition-colors">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gray-600/70 flex items-center justify-center hover:bg-gray-600/90 transition-colors">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <p className="text-gray-300 mb-6">
                  {featuredContent[0].title} - An extraordinary journey that captures the essence of independent cinema. 
                  This film represents the unique vision and creativity that only emerges from passionate independent filmmaking.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Director</span>
                    <p className="text-white">Various Directors</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Studio</span>
                    <p className="text-white">VLOCKSTER Studios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crowdfunding Project Section - Minimal Netflix-style */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-white">Featured Projects</h2>
          
          <div className="bg-gray-900 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Image
                  src={mockCampaign.title === 'Una Ola A La Vez' ? featuredContent[0].image : '/items/posters/POSTER NOCHE DE CIRCO.jpg'}
                  alt={mockCampaign.title}
                  width={300}
                  height={400}
                  className="rounded-lg w-full h-auto"
                />
              </div>
              
              <div className="md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-bold text-green-500">CROWDFUNDING ACTIVE</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{mockCampaign.title}</h3>
                <p className="text-gray-300 mb-6">
                  This project is seeking funding to complete production. Join {mockCampaign.backers} backers supporting independent cinema.
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>${mockCampaign.currentAmount.toLocaleString()} raised</span>
                    <span>${mockCampaign.goalAmount.toLocaleString()} goal</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                      style={{ width: `${(mockCampaign.currentAmount / mockCampaign.goalAmount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {(mockCampaign.currentAmount / mockCampaign.goalAmount * 100).toFixed(0)}% funded • {mockCampaign.daysLeft} days left
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
                  <button className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors">
                    Support Project
                  </button>
                  <button className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold border border-white/30 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Support Includes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockCampaign.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Netflix Style */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
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
              <p className="text-gray-400 text-sm max-w-md">
                Streaming, crowdfunding, and community for independent cinema.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                  <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Preferences</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Connect</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link href="/watch" className="hover:text-white transition-colors">Watch</Link></li>
                  <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 VLOCKSTER. Independent Cinema Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}