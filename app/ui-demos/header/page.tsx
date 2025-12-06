import Link from 'next/link'
import Image from 'next/image'
import { Search, User, Bell } from 'lucide-react'
import { DemoHeader } from '@/components/DemoHeader'

export default function HeaderDemoPage() {
  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#050505',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header STREAMLAB Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.jpeg"
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
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Watch
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Side: Search, Profile, SUBSCRIBE */}
            <div className="flex items-center gap-4">
              {/* Search Icon */}
              <button
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                className="p-2 text-gray-300 hover:text-white transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF0000] rounded-full"></span>
              </button>

              {/* Profile */}
              <button
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* SUBSCRIBE Button */}
              <Link
                href="#"
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-lg font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-lg shadow-red-500/40"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/ui-demos"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              ← Volver a Demos
            </Link>

            {/* Title */}
            <h1 className="font-display text-6xl md:text-7xl font-bold mb-6" style={{ letterSpacing: '-0.03em' }}>
              Header/Navegación
            </h1>
            <p className="font-display text-2xl text-[#FF0000] mb-4 font-semibold" style={{ letterSpacing: '-0.01em' }}>
              STREAMLAB Style
            </p>
            <p className="text-lg text-gray-300 mb-12 font-sans">
              Header fijo con efecto glassmorphism, navegación central y botón CTA destacado
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Características</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Fixed position (z-50)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Backdrop blur (glassmorphism)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Altura: 80px (h-20)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Navegación central con hover effects
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-3">Elementos</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Logo VLOCKSTER
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Links de navegación
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Search, Notifications, Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF0000] rounded-full"></span>
                    Botón SUBSCRIBE (rojo gradient)
                  </li>
                </ul>
              </div>
            </div>

            {/* Scroll Demo */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Scroll para ver el efecto fixed</h2>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <p className="text-gray-300">
                    Sección {i + 1} - El header permanece fijo en la parte superior mientras
                    haces scroll. Observa el efecto glassmorphism y cómo el header mantiene su
                    posición.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

