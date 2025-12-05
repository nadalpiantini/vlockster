'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrandHeader } from '@/components/BrandHeader'
import { Play, Film, Users, DollarSign, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation Header */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <BrandHeader />
            <div className="flex items-center space-x-6" role="menubar">
              <Link 
                href="/watch" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Ver catálogo de videos"
              >
                Watch
              </Link>
              <Link 
                href="/projects" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Ver proyectos de crowdfunding"
              >
                Projects
              </Link>
              <Link 
                href="/community" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Ver comunidades"
              >
                Community
              </Link>
              <Link 
                href="/login" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Iniciar sesión"
              >
                Login
              </Link>
              <Link href="/signup" aria-label="Crear cuenta nueva">
                <Button className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] hover:from-[#FF1a1a] hover:to-[#FF7B45]">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="main-content"
        className="relative min-h-screen flex items-center justify-center pt-20 px-4"
        role="main"
        aria-label="Sección principal"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_60%)]" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <Image
                src="/items/vlockster_logo.jpeg"
                alt="VLOCKSTER Logo"
                fill
                className="object-contain"
                priority
                fetchPriority="high"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            VLOCKSTER
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streaming, crowdfunding, and community for independent filmmakers
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
            Watch extraordinary stories. Fund creative projects. Join a vibrant community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/watch" aria-label="Comenzar a ver contenido">
              <Button size="lg" className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] hover:from-[#FF1a1a] hover:to-[#FF7B45] text-lg px-8 py-6">
                <Play className="mr-2" aria-hidden="true" />
                Start Watching
              </Button>
            </Link>
            <Link href="/dashboard" aria-label="Ir al dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/20 hover:bg-white/10">
                Go to Dashboard
                <ArrowRight className="ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/50" aria-label="Características de la plataforma">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" id="features-heading">Three Platforms in One</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-500/50 transition-colors" role="article" aria-labelledby="streaming-heading">
              <Film className="w-16 h-16 mx-auto mb-4 text-red-500" aria-hidden="true" />
              <h3 id="streaming-heading" className="text-2xl font-semibold mb-4">Streaming</h3>
              <p className="text-gray-300 mb-6">
                Discover and watch independent films and series. Support creators by watching their content.
              </p>
              <Link href="/watch" aria-label="Explorar contenido de streaming">
                <Button variant="outline" className="w-full">
                  Explore Content
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-500/50 transition-colors" role="article" aria-labelledby="crowdfunding-heading">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-red-500" aria-hidden="true" />
              <h3 id="crowdfunding-heading" className="text-2xl font-semibold mb-4">Crowdfunding</h3>
              <p className="text-gray-300 mb-6">
                Fund independent film projects. Get exclusive rewards and be part of the creative process.
              </p>
              <Link href="/projects" aria-label="Ver proyectos de crowdfunding">
                <Button variant="outline" className="w-full">
                  View Projects
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-500/50 transition-colors" role="article" aria-labelledby="community-heading">
              <Users className="w-16 h-16 mx-auto mb-4 text-red-500" aria-hidden="true" />
              <h3 id="community-heading" className="text-2xl font-semibold mb-4">Community</h3>
              <p className="text-gray-300 mb-6">
                Join discussions, share ideas, and connect with filmmakers and film enthusiasts.
              </p>
              <Link href="/community" aria-label="Unirse a la comunidad">
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" aria-label="Llamado a la acción">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join VLOCKSTER today and be part of the future of independent cinema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" aria-label="Crear cuenta nueva en VLOCKSTER">
              <Button size="lg" className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] hover:from-[#FF1a1a] hover:to-[#FF7B45] text-lg px-8 py-6">
                Create Account
              </Button>
            </Link>
            <Link href="/login" aria-label="Iniciar sesión en VLOCKSTER">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/20 hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4" role="contentinfo" aria-label="Pie de página">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <BrandHeader />
          <nav className="flex gap-6 mt-4 md:mt-0" role="navigation" aria-label="Enlaces legales">
            <Link href="/legal/privacy" className="text-gray-300 hover:text-white transition-colors" aria-label="Política de privacidad">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-gray-300 hover:text-white transition-colors" aria-label="Términos y condiciones">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
