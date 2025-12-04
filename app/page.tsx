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
  title: 'VLOCKSTER - The Future of Independent Cinema',
  description:
    'Streaming, crowdfunding, and community for independent cinema. Discover, fund, and be part of extraordinary stories.',
  keywords: [
    'independent cinema',
    'streaming',
    'crowdfunding',
    'indie films',
    'creators',
    'cinema community',
  ],
  openGraph: {
    title: 'VLOCKSTER - The Future of Independent Cinema',
    description:
      'Streaming, crowdfunding, and community for independent cinema',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VLOCKSTER - The Future of Independent Cinema',
    description:
      'Streaming, crowdfunding, and community for independent cinema',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5"
        role="navigation"
        aria-label="Main navigation"
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
                aria-label="Sign in to VLOCKSTER"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-lg font-semibold text-sm hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
                aria-label="Sign up for VLOCKSTER"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main role="main" className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* StreamLab Style Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,0,0,0.03)_50%,transparent_100%)]" />
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
              <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#FF0000]" />
                <span className="text-sm text-gray-300">
                  The ultimate platform for independent cinema
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  The future of
                </span>
                <span className="block mt-2 bg-gradient-to-r from-[#FF0000] via-[#FF6B35] to-[#FF0000] bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                  independent cinema is here
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Netflix-quality streaming • Kickstarter-style crowdfunding • Skool-like vibrant community
              </p>

              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                VLOCKSTER unites creators and indie film lovers in a unique platform where you can watch, fund, and be part of extraordinary stories.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  href="/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold text-lg hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all duration-300 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-110 flex items-center space-x-2 animate-pulse-glow"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/watch"
                  className="px-8 py-4 glass-card text-white rounded-xl font-semibold text-lg border border-white/10 hover:border-[#FF0000]/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center space-x-2 glass-card-hover"
                >
                  <Play className="w-5 h-5" />
                  <span>Explore Content</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FF0000]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FF0000]" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FF0000]" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Everything in one platform
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Three powerful tools united to transform independent cinema
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Streaming Feature */}
              <div className="group relative glass-card p-8 rounded-2xl border border-white/10 hover:border-[#FF0000]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 glass-card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0071EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF0000] to-[#FF6B35] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/30">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Premium Streaming</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Access a curated library of high-quality independent cinema. Discover unique stories from creators around the world, with Netflix-quality streaming.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>4K quality available</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>No ads</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>Offline downloads</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Crowdfunding Feature */}
              <div className="group relative glass-card p-8 rounded-2xl border border-white/10 hover:border-[#FF6B35]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 glass-card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF0000] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Smart Crowdfunding</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Fund film projects and be part of their creation. Kickstarter-style exclusive rewards system with real-time tracking.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                      <span>Exclusive rewards</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                      <span>Real-time progress</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                      <span>Secure payments</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Community Feature */}
              <div className="group relative glass-card p-8 rounded-2xl border border-white/10 hover:border-[#FF0000]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 glass-card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF0000] to-[#FF6B35] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/30">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Vibrant Community</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Connect with other cinephiles and creators. Join discussions, events, and exclusive workshops. A Skool-like experience for cinema.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>Discussion forums</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>Exclusive events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                      <span>Professional networking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 bg-[#050505] border-y border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#FF0000] to-[#FF6B35] bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                  1000+
                </div>
                <div className="text-sm text-gray-400">Indie Films</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FF0000] bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">
                  500+
                </div>
                <div className="text-sm text-gray-400">Funded Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#FF0000] to-[#FF6B35] bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                  10K+
                </div>
                <div className="text-sm text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section for Creators */}
        <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-4xl mx-auto glass-card rounded-3xl p-12 sm:p-16 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.15),transparent_70%)]" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-[#FF0000]" />
                  <span className="text-sm text-gray-300">For Creators</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Are you an indie content creator?
                </h3>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Request creator access and share your work with a global audience passionate about independent cinema. Monetize your content and build your community.
                </p>
                <Link
                  href="/apply"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold text-lg hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all duration-300 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-110"
                >
                  <span>Request Creator Access</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative border-t border-white/5 bg-[#050505] py-12"
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
                The ultimate platform for independent cinema
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
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
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">For Creators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/apply" className="hover:text-white transition-colors">
                    Become a Creator
                  </Link>
                </li>
                <li>
                  <Link href="/projects/create" className="hover:text-white transition-colors">
                    Create Project
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-white transition-colors">
                    Upload Content
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
                    aria-label="Read terms of use"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:text-white transition-colors"
                    aria-label="Read privacy policy"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>&copy; 2025 VLOCKSTER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
