import Link from 'next/link'
import Image from 'next/image'
import { Heart, Share2, Flag, Calendar, Users, DollarSign } from 'lucide-react'

export default function KickBackerStylePage() {
  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: '#FFFFFF',
        color: '#111827',
        minHeight: '100vh'
      }}
    >
      {/* Header KickBacker Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ui-demos" className="flex items-center gap-3 group">
              <Image
                src="/items/vlockster_logo.jpeg"
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
              <Link href="#" className="text-gray-600 hover:text-gray-900">Discover</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Start a Project</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Sign In</button>
              <button className="px-4 py-2 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Project Hero - KickBacker Style */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>Film & Video</span>
                    <span>•</span>
                    <span>Independent Cinema</span>
                  </div>
                  <h1 className="font-display text-5xl md:text-6xl font-bold mb-4" style={{ letterSpacing: '-0.03em' }}>The Last Frame: An Independent Film Journey</h1>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Una historia épica sobre cineastas independientes que desafían el sistema tradicional.
                    Únete a nuestra comunidad y apoya el cine independiente.
                  </p>
                </div>

                {/* Progress Bar - KickBacker Style */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-3xl font-bold text-[#FF0000] mb-1">$45,230</div>
                      <div className="text-sm text-gray-500">of $60,000 goal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">75%</div>
                      <div className="text-sm text-gray-500">funded</div>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#FF0000] rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">234</div>
                      <div className="text-xs text-gray-500">backers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">28</div>
                      <div className="text-xs text-gray-500">days to go</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">$258</div>
                      <div className="text-xs text-gray-500">avg pledge</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button className="flex-1 px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Back this project
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Flag className="w-5 h-5" />
                    Report
                  </button>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About this project</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p className="mb-4">
                        Este proyecto busca revolucionar la forma en que se produce y distribuye el cine independiente.
                        Con tu apoyo, podremos crear una plataforma completa que combine streaming, crowdfunding y comunidad.
                      </p>
                      <p className="mb-4">
                        El objetivo es crear una experiencia única donde los cineastas puedan financiar sus proyectos,
                        distribuirlos directamente a su audiencia y construir una comunidad alrededor de su trabajo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Rewards */}
              <aside className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Select a reward</h3>
                    <div className="space-y-4">
                      {/* Reward Tier 1 */}
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF0000] transition-colors cursor-pointer">
                        <div className="font-bold text-lg mb-2">$25</div>
                        <h4 className="font-semibold mb-2">Early Supporter</h4>
                        <p className="text-sm text-gray-600 mb-3">Get early access to the film</p>
                        <div className="text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="w-4 h-4" />
                            <span>45 backers</span>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                          Select
                        </button>
                      </div>

                      {/* Reward Tier 2 */}
                      <div className="p-4 border-2 border-[#FF0000] rounded-lg bg-[#FF0000]/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-lg">$50</div>
                          <span className="px-2 py-1 bg-[#FF0000] text-white text-xs font-semibold rounded">POPULAR</span>
                        </div>
                        <h4 className="font-semibold mb-2">Film Lover</h4>
                        <p className="text-sm text-gray-600 mb-3">Early access + exclusive behind-the-scenes content</p>
                        <div className="text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="w-4 h-4" />
                            <span>128 backers</span>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                          Select
                        </button>
                      </div>

                      {/* Reward Tier 3 */}
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF0000] transition-colors cursor-pointer">
                        <div className="font-bold text-lg mb-2">$100</div>
                        <h4 className="font-semibold mb-2">Producer Credit</h4>
                        <p className="text-sm text-gray-600 mb-3">All previous rewards + producer credit in the film</p>
                        <div className="text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="w-4 h-4" />
                            <span>61 backers</span>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
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

