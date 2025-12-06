import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

export default function SpruceStylePage() {
  const posts = [
    {
      id: 1,
      author: 'Indie Director',
      content: 'Primera semana de producción completada! El equipo está súper contento con el progreso.',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: 'Film Creator',
      content: 'Nuevo update del proyecto disponible en la plataforma. Check it out!',
      likes: 18,
      comments: 3
    },
    {
      id: 3,
      author: 'Cinema Pro',
      content: 'Gracias a todos los backers que nos están apoyando. Estamos cerca de la meta!',
      likes: 31,
      comments: 8
    }
  ]

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: '#F5F5F5',
        color: '#111827',
        minHeight: '100vh'
      }}
    >
      {/* Header Spruce Style - Simple */}
      <header className="bg-white border-b border-gray-200">
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
            <nav className="flex items-center gap-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Projects</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Community</Link>
              <div className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Create Post - Spruce Minimalist */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center text-white font-bold">
                +
              </div>
              <input
                type="text"
                placeholder="Share an update..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF0000]"
              />
              <button className="px-4 py-2 bg-[#FF0000] text-white rounded-lg font-medium hover:bg-[#FF1a1a] transition-colors">
                Post
              </button>
            </div>
          </div>

          {/* Posts Feed - Spruce Minimalist */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{post.author}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">2h ago</span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6 text-gray-500">
                      <button className="flex items-center gap-2 hover:text-[#FF0000] transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#FF0000] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#FF0000] transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

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

