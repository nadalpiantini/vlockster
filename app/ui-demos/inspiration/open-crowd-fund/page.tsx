import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Users, Calendar } from 'lucide-react'

export default function OpenCrowdFundStylePage() {
  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: '#FFFFFF',
        color: '#111827',
        minHeight: '100vh'
      }}
    >
      {/* Header Open Crowd Fund Style - Minimal */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.png"
                alt="VLOCKSTER"
                width={150}
                height={40}
                className="object-contain h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="font-display text-xl font-bold text-[#FF0000] hidden md:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900">Projects</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">How it works</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              <button className="px-4 py-2 bg-[#FF0000] text-white rounded-lg font-medium hover:bg-[#FF1a1a] transition-colors">
                Start Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Open Crowd Fund Minimal */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-gray-900" style={{ letterSpacing: '-0.03em' }}>
              Fund Your
              <span className="block text-[#FF0000]">Independent Film</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Una plataforma simple y clara para financiar tus proyectos cinematográficos
              con el apoyo directo de tu comunidad.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors flex items-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Example - Open Crowd Fund Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              {/* Campaign Header */}
              <div className="bg-gradient-to-r from-[#FF0000] to-[#FF6B35] p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm opacity-90">Film & Video</span>
                    <h2 className="text-3xl font-bold mt-2">The Last Frame</h2>
                  </div>
                  <button className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-colors">
                    Back Project
                  </button>
                </div>
              </div>

              {/* Progress Bar - Large and Clear */}
              <div className="p-8 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-4xl font-black text-[#FF0000] mb-1">$45,230</div>
                      <div className="text-gray-600">raised of $60,000 goal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-gray-900">75%</div>
                      <div className="text-gray-600">funded</div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] rounded-full" style={{ width: '75%' }}></div>
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
                    <div className="text-2xl font-bold text-gray-900 mb-1">28</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4" />
                      days left
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">$258</div>
                    <div className="text-sm text-gray-600">avg pledge</div>
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">About this project</h3>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>
                    Este proyecto busca revolucionar la forma en que se produce y distribuye el cine independiente.
                    Con tu apoyo, podremos crear una plataforma completa que combine streaming, crowdfunding y comunidad.
                  </p>
                  <p>
                    El objetivo es crear una experiencia única donde los cineastas puedan financiar sus proyectos,
                    distribuirlos directamente a su audiencia y construir una comunidad alrededor de su trabajo.
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </section>

      {/* Back Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link
          href="/ui-demos"
          className="px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors shadow-lg"
        >
          ← Volver
        </Link>
      </div>
    </div>
  )
}

