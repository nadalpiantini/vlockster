'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import { Play, Film, Users, DollarSign, ArrowRight, Star, Heart, MessageCircle, Search, Bell, Info, Clock, Check, Calendar, Sparkles, Zap, Target, TrendingUp, User, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progressPercentage = (mockCampaign.currentAmount / mockCampaign.goalAmount) * 100

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#ff0000]/10"></div>
      </div>

      {/* Header with enhanced UX */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 py-2' 
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/items/vlockster_logo.png"
                  alt="VLOCKSTER"
                  width={150}
                  height={40}
                  className="object-contain h-10 w-auto"
                  priority
                />
              </motion.div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {[
                { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'watch', label: 'Watch', icon: <Play className="w-4 h-4" /> },
                { id: 'gallery', label: 'Gallery', icon: <Film className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <Rocket className="w-4 h-4" /> },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'text-[#FF0000] bg-white/10'
                      : 'text-white hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 w-40"
                />
              </div>
              <motion.button
                className="p-2 text-white hover:text-white transition-colors"
                aria-label="Notifications"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-lg shadow-red-500/30"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 0, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main id="main-content" className="relative z-10 pt-20" role="main">
        {/* Hero Section - Enhanced */}
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

        {/* Featured Content - Enhanced */}
        <section className="py-8 -mt-32 relative z-10">
          {contentRows.map((row, idx) => (
            <div key={idx} className="mb-8">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF0000]" />
                  {row.title}
                </h2>
              </div>
              <HorizontalCarousel title={row.title} showAllLink={row.items.length > 8 ? "/watch" : undefined}>
                {row.items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="relative"
                    whileHover={{ scale: 1.03, zIndex: 10 }}
                    transition={{ duration: 0.2 }}
                  >
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
                  </motion.div>
                ))}
              </HorizontalCarousel>
            </div>
          ))}
        </section>

        {/* AI-Powered Features Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#FF0000] bg-clip-text text-transparent">
                Power of AI & Agents
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience cinema like never before with our AI-powered platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Smart Recommendations",
                  description: "AI-powered suggestions based on your viewing history",
                  icon: <Target className="w-8 h-8 text-[#FF0000]" />,
                  gradient: "from-blue-500 to-purple-500"
                },
                {
                  title: "Intelligent Search",
                  description: "Find content using natural language queries",
                  icon: <Search className="w-8 h-8 text-[#FF0000]" />,
                  gradient: "from-green-500 to-teal-500"
                },
                {
                  title: "Creator Analytics",
                  description: "AI insights for filmmakers to optimize their projects",
                  icon: <TrendingUp className="w-8 h-8 text-[#FF0000]" />,
                  gradient: "from-red-500 to-orange-500"
                },
                {
                  title: "Community Matching",
                  description: "Connect with like-minded filmmakers and fans",
                  icon: <Users className="w-8 h-8 text-[#FF0000]" />,
                  gradient: "from-pink-500 to-rose-500"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Crowdfunding Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-black/80 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden"
              >
                {/* Campaign Header */}
                <div className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <span className="text-sm opacity-90 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Film & Video
                      </span>
                      <h3 className="text-3xl font-bold mt-2 flex items-center gap-3">
                        {mockCampaign.title}
                        <motion.span 
                          className="text-sm bg-white/20 px-3 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          NEW
                        </motion.span>
                      </h3>
                    </div>
                    <Link
                      href="/projects"
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 justify-center"
                      prefetch={false}
                    >
                      <Heart className="w-4 h-4" />
                      Back Project
                    </Link>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-8 border-b border-white/10">
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="text-4xl font-black text-[#FF0000] mb-1">
                          ${mockCampaign.currentAmount.toLocaleString()}
                        </div>
                        <div className="text-white">raised of ${mockCampaign.goalAmount.toLocaleString()} goal</div>
                      </div>
                      <div className="text-right md:text-left">
                        <div className="text-3xl font-black text-white">{Math.round(progressPercentage)}%</div>
                        <div className="text-white">funded</div>
                      </div>
                    </div>
                    <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-white mb-1">{mockCampaign.backers}</div>
                      <div className="text-sm text-white flex items-center justify-center gap-1">
                        <Users className="w-4 h-4" />
                        backers
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-white mb-1">{mockCampaign.daysLeft}</div>
                      <div className="text-sm text-white flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4" />
                        days left
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-white mb-1">${mockCampaign.avgPledge}</div>
                      <div className="text-sm text-white">avg pledge</div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-white mb-1">25%</div>
                      <div className="text-sm text-white">funded</div>
                    </div>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#FF0000]" />
                    <h4 className="text-2xl font-bold text-white">About this project</h4>
                  </div>
                  <div className="prose max-w-none text-white space-y-4 mb-8">
                    <p>
                      Este proyecto busca revolucionar la forma en que se produce y distribuye el cine independiente.
                      Con tu apoyo, podremos crear una plataforma completa que combine streaming, crowdfunding y comunidad.
                    </p>
                    <p>
                      Our AI-powered tools help filmmakers reach their audience more effectively and provide backers with
                      real-time updates on project progress.
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockCampaign.features.map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Section - Enhanced */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#FF0000] bg-clip-text text-transparent">
                Creator Community
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Connect with filmmakers, share ideas, and collaborate on projects
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Forums",
                  description: "Discuss films, share ideas, and connect with creators.",
                  count: "1,234",
                  label: "active discussions",
                  icon: <MessageCircle className="w-8 h-8 text-[#FF0000]" />
                },
                {
                  title: "Memberships",
                  description: "Exclusive access to premieres and creator content.",
                  count: "567",
                  label: "active members",
                  icon: <Heart className="w-8 h-8 text-[#FF0000]" />
                },
                {
                  title: "Project Tracking",
                  description: "Follow your favorite projects from concept to release.",
                  count: "89",
                  label: "active projects",
                  icon: <Users className="w-8 h-8 text-[#FF0000]" />
                }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
                      {card.icon}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-4">{card.title}</h3>
                    <p className="text-white mb-6 flex-grow">{card.description}</p>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-3xl font-bold">{card.count}</span>
                      <span className="text-sm text-white">{card.label}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator CTA Section - Enhanced */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/30 backdrop-blur-sm mx-auto md:mx-0">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">FOR CREATORS</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-black text-white leading-tight text-center md:text-left">
                    Are you a filmmaker?
                    <span className="block text-2xl md:text-3xl text-white mt-2 font-semibold">
                      Request Creator Access
                    </span>
                  </h3>
                  <p className="text-lg text-white max-w-2xl leading-relaxed text-center md:text-left">
                    Publish, raise funds, and collaborate with your audience using our AI-powered tools.
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/apply"
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-2xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>REQUEST ACCESS</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced */}
      <footer className="relative z-10 border-t border-gray-800 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">VLOCKSTER</span>
              <span className="text-white/60">• Independent Cinema</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/legal/privacy" className="text-white hover:text-white/80 transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="text-white hover:text-white/80 transition-colors">
                Terms
              </Link>
              <Link href={"/menu" as Route} className="text-white hover:text-white/80 transition-colors">
                Gallery
              </Link>
              <Link href="/apply" className="text-white hover:text-white/80 transition-colors">
                For Creators
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 text-white hover:text-white/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 text-white hover:text-white/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}