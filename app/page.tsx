'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Play, Film, Users, DollarSign, ArrowRight, Star, Heart, MessageCircle, Search, Bell, Info, Clock, Check, Calendar, Sparkles, Zap, Target, TrendingUp, User, Rocket, Crown, Gem, Sparkle, Star as StarIcon, Award, Camera, Ticket, Popcorn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroVideo } from '@/components/HeroVideo'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import { VideoCard } from '@/components/VideoCard'

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

// Mock data
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
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlowPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const progressPercentage = (mockCampaign.currentAmount / mockCampaign.goalAmount) * 100

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Glowing cursor effect */}
      <div 
        className="fixed w-96 h-96 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 transition-all duration-300"
        style={{
          left: glowPosition.x,
          top: glowPosition.y,
          background: 'radial-gradient(600px circle at center, rgba(255, 0, 0, 0.15), transparent 40%)',
        }}
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header with enhanced glamor */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2' 
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with glamour effect */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/items/vlockster_logo.png"
                  alt="VLOCKSTER"
                  width={150}
                  height={40}
                  className="relative object-contain h-10 w-auto z-10"
                  priority
                />
              </motion.div>
            </Link>

            {/* Navigation with glamour */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {[
                { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'watch', label: 'Watch', icon: <Play className="w-4 h-4" /> },
                { id: 'gallery', label: 'Gallery', icon: <Film className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <Rocket className="w-4 h-4" /> },
              ].map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all relative group ${
                    activeTab === item.id
                      ? 'text-[#FF0000] bg-white/10'
                      : 'text-white/80 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {item.icon}
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-[#FF6B35]/20 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Right Side with glamour */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search films..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 w-48 transition-all duration-300 group-focus-within:w-64 group-focus-within:bg-white/20"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
              <motion.button
                className="p-3 text-white hover:text-white transition-colors relative group"
                aria-label="Notifications"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </motion.button>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-[#FF0000] via-[#FF4500] to-[#FF6B35] text-white rounded-full font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 relative overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(255, 0, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkle className="w-4 h-4" />
                  JOIN NOW
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main id="main-content" className="relative z-10 pt-20" role="main">
        {/* Glamorous Hero Section */}
        <div ref={heroRef} className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 z-0">
            <Image
              src={featuredContent[0].image}
              alt={featuredContent[0].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
          </div>
          
          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF0000]/20 to-[#FF6B35]/20 border border-[#FF0000]/30 backdrop-blur-sm mb-6">
                <Crown className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">FEATURED FILM</span>
                <Award className="w-4 h-4 text-[#FFD700]" />
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-white via-[#FFD700] to-[#FF0000] bg-clip-text text-transparent">
                {featuredContent[0].title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold">{featuredContent[0].rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-white" />
                  <span className="text-white">{featuredContent[0].duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white">{featuredContent[0].year}</span>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-10">
                The platform for independent cinema. Streaming, crowdfunding, and community in one place for creators and fans.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-full font-bold text-lg group"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(255, 0, 0, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6" />
                  <span>WATCH NOW</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border border-white/20 hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-6 h-6" />
                  <span>HEART IT</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Content - Enhanced */}
        <section className="py-16 relative z-10 -mt-32">
          {contentRows.map((row, idx) => (
            <div key={idx} className="mb-16">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <motion.h2 
                    className="text-3xl font-bold text-white flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <TrendingUp className="w-6 h-6 text-[#FF0000]" />
                    {row.title}
                    <Gem className="w-6 h-6 text-[#FFD700]" />
                  </motion.h2>
                  <motion.button
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All
                  </motion.button>
                </div>
              </div>
              <div className="px-4">
                <HorizontalCarousel title={row.title} showAllLink={row.items.length > 8 ? "/watch" : undefined}>
                  {row.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.id}
                      className="relative group"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onHoverStart={() => setHoveredCard(item.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: itemIdx * 0.1 }}
                    >
                      <div className="relative">
                        <VideoCard
                          id={item.id.toString()}
                          title={item.title}
                          description={`${item.title} - ${item.genre}`}
                          thumbnailUrl={item.image}
                          duration={item.duration}
                          year={item.year}
                          rating={item.rating}
                          className="min-w-[200px] md:min-w-[240px] rounded-2xl overflow-hidden"
                        />
                        <AnimatePresence>
                          {hoveredCard === item.id && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl flex items-end p-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <div className="text-white">
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <p className="text-sm text-white/80">{item.genre}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </HorizontalCarousel>
              </div>
            </div>
          ))}
        </section>

        {/* AI-Powered Features Section - Glamorous */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
                <span className="text-sm font-bold uppercase tracking-wider text-white/80">AI-POWERED</span>
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-[#FFD700] to-[#FF0000] bg-clip-text text-transparent">
                The Future of Cinema
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience films like never before with our cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Smart Recommendations",
                  description: "AI-powered suggestions based on your viewing history and preferences",
                  icon: <Target className="w-10 h-10 text-[#FF0000]" />,
                  gradient: "from-blue-500 to-purple-500",
                  stat: "95%",
                  statLabel: "Accuracy"
                },
                {
                  title: "Intelligent Search",
                  description: "Find content using natural language queries with semantic understanding",
                  icon: <Search className="w-10 h-10 text-[#FF0000]" />,
                  gradient: "from-green-500 to-teal-500",
                  stat: "10M+",
                  statLabel: "Indexed Films"
                },
                {
                  title: "Creator Analytics",
                  description: "Advanced AI insights for filmmakers to optimize their projects and reach",
                  icon: <TrendingUp className="w-10 h-10 text-[#FF0000]" />,
                  gradient: "from-red-500 to-orange-500",
                  stat: "300%",
                  statLabel: "ROI Increase"
                },
                {
                  title: "Community Matching",
                  description: "Connect with like-minded filmmakers and fans using advanced algorithms",
                  icon: <Users className="w-10 h-10 text-[#FF0000]" />,
                  gradient: "from-pink-500 to-rose-500",
                  stat: "1M+",
                  statLabel: "Creators"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/70 mb-6">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-white">{feature.stat}</div>
                        <div className="text-sm text-white/60">{feature.statLabel}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Crowdfunding Section - Glamorous */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-black/80 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent"></div>
                
                {/* Campaign Header */}
                <div className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] p-10 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),_transparent_70%)]"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-4">
                          <Film className="w-4 h-4" />
                          <span className="text-sm">Film & Video</span>
                        </div>
                        <h3 className="text-4xl font-black flex items-center gap-4">
                          {mockCampaign.title}
                          <motion.span 
                            className="text-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full text-black font-bold"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            🎬 PREMIUM
                          </motion.span>
                        </h3>
                        <p className="text-white/90 mt-2 text-lg">
                          An award-winning documentary about the power of cinema
                        </p>
                      </div>
                      <Link
                        href="/projects"
                        className="px-8 py-4 bg-white text-[#FF0000] rounded-xl font-black text-lg hover:bg-gray-100 transition-colors flex items-center gap-3 justify-center group"
                      >
                        <motion.button
                          className="w-full h-full flex items-center justify-center gap-3 bg-transparent border-none cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                          <span>SUPPORT FILM</span>
                          <Ticket className="w-6 h-6" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-10 border-b border-white/10">
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <div className="text-5xl font-black text-[#FF0000] mb-2">
                          ${mockCampaign.currentAmount.toLocaleString()}
                        </div>
                        <div className="text-white/80 text-lg">raised of ${mockCampaign.goalAmount.toLocaleString()} goal</div>
                      </div>
                      <div className="text-right md:text-left">
                        <div className="text-4xl font-black text-white">{Math.round(progressPercentage)}%</div>
                        <div className="text-white/80 text-lg">funded</div>
                      </div>
                    </div>
                    <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#FF0000] via-[#FF4500] to-[#FF6B35] rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.3),_transparent_70%)]"></div>
                      </motion.div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                    <div className="text-center py-4">
                      <div className="text-4xl font-black text-white mb-2">{mockCampaign.backers}</div>
                      <div className="flex items-center justify-center gap-2 text-white/80">
                        <Users className="w-5 h-5" />
                        backers
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-4xl font-black text-white mb-2">{mockCampaign.daysLeft}</div>
                      <div className="flex items-center justify-center gap-2 text-white/80">
                        <Calendar className="w-5 h-5" />
                        days left
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-4xl font-black text-white mb-2">${mockCampaign.avgPledge}</div>
                      <div className="text-white/80">avg pledge</div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-4xl font-black text-white mb-2">25%</div>
                      <div className="text-white/80">funded</div>
                    </div>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-[#FF0000]" />
                    <h4 className="text-3xl font-black text-white">About this project</h4>
                    <Camera className="w-6 h-6 text-[#FF0000]" />
                  </div>
                  <div className="prose max-w-none text-white space-y-6 mb-10">
                    <p className="text-lg leading-relaxed">
                      Este proyecto busca revolucionar la forma en que se produce y distribuye el cine independiente.
                      Con tu apoyo, podremos crear una plataforma completa que combine streaming, crowdfunding y comunidad.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Our AI-powered tools help filmmakers reach their audience more effectively and provide backers with
                      real-time updates on project progress and exclusive behind-the-scenes content.
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockCampaign.features.map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 group hover:bg-gradient-to-r hover:from-[#FF0000]/10 hover:to-[#FF6B35]/10 transition-all"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Check className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-lg text-white">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Section - Enhanced Glamor */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Popcorn className="w-6 h-6 text-[#FFD700]" />
                <span className="text-4xl font-black text-white">Creator</span>
                <Sparkles className="w-6 h-6 text-[#FF0000]" />
                <span className="text-4xl font-black text-white">Community</span>
                <Ticket className="w-6 h-6 text-[#FFD700]" />
              </div>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Connect with filmmakers, share ideas, and collaborate on groundbreaking projects
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "Premium Forums",
                  description: "Exclusive discussions with award-winning filmmakers and industry experts.",
                  count: "1,234",
                  label: "active discussions",
                  icon: <MessageCircle className="w-10 h-10 text-[#FF0000]" />,
                  badge: "🏆"
                },
                {
                  title: "VIP Memberships",
                  description: "Exclusive access to premieres, creator content, and behind-the-scenes footage.",
                  count: "567",
                  label: "active members",
                  icon: <Heart className="w-10 h-10 text-[#FF0000]" />,
                  badge: "💎"
                },
                {
                  title: "Project Hub",
                  description: "Follow your favorite projects from concept to release with real-time updates.",
                  count: "89",
                  label: "active projects",
                  icon: <Users className="w-10 h-10 text-[#FF0000]" />,
                  badge: "🚀"
                }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -15, scale: 1.03 }}
                  className="group relative p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="absolute top-4 right-4 text-2xl">{card.badge}</div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
                      {card.icon}
                    </div>
                    <h3 className="font-display text-3xl font-black text-white mb-6">{card.title}</h3>
                    <p className="text-white/80 mb-8 flex-grow text-lg">{card.description}</p>
                    <div className="flex items-center gap-3 text-white">
                      <span className="text-4xl font-black">{card.count}</span>
                      <div className="text-left">
                        <div className="text-lg text-white/80">{card.label}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator CTA Section - Ultra Glamorous */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FF0000]/5 via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-6 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF0000]/20 to-[#FF6B35]/20 border border-[#FF0000]/30 backdrop-blur-sm mx-auto md:mx-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Crown className="w-5 h-5 text-[#FFD700]" />
                    </motion.div>
                    <span className="text-sm font-black uppercase tracking-wider text-white">FOR CREATORS</span>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Gem className="w-5 h-5 text-[#FFD700]" />
                    </motion.div>
                  </div>
                  
                  <h3 className="font-display text-4xl md:text-5xl font-black text-white leading-tight text-center md:text-left">
                    <span className="bg-gradient-to-r from-white to-[#FFD700] bg-clip-text text-transparent">Are you a</span>
                    <br />
                    <span className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] bg-clip-text text-transparent">Filmmaker?</span>
                    <br />
                    <span className="text-xl md:text-2xl text-white/80 font-semibold block mt-4">
                      Request Creator Access
                    </span>
                  </h3>
                  
                  <p className="text-xl text-white/80 max-w-2xl leading-relaxed text-center md:text-left">
                    Join our exclusive creator network and unlock advanced tools, analytics, and funding opportunities.
                  </p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-3xl blur-xl opacity-50"></div>
                  <button className="group relative px-10 py-6 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-3xl font-black text-xl hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 flex items-center gap-3 whitespace-nowrap">
                    <Rocket className="w-7 h-7" />
                    <span>REQUEST ACCESS</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced Glamor */}
      <footer className="relative z-10 border-t border-white/20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-white">VLOCKSTER</span>
                  <span className="text-white/60 block">• Independent Cinema Excellence</span>
                </div>
              </div>
              <p className="text-white/70 max-w-md">
                The premier platform for independent filmmakers and cinema enthusiasts. 
                Discover, create, and fund the next generation of cinematic experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-white text-lg mb-4">Explore</h4>
              <ul className="space-y-2">
                {['Films', 'Series', 'Documentaries', 'Shorts'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-white text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Contact', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm">
              © 2025 VLOCKSTER. All rights reserved. For independent cinema.
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <motion.button
                className="p-3 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-3 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-3 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}