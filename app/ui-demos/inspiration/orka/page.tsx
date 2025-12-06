import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell } from 'lucide-react'

export default function OrKaStylePage() {
  const posts = [
    {
      id: 1,
      author: 'Director Indie',
      avatar: '🎬',
      time: '2h ago',
      content: 'Acabamos de alcanzar el 75% de nuestra meta de crowdfunding! Gracias a toda la comunidad por el apoyo.',
      image: true,
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      author: 'Cineasta Pro',
      avatar: '📹',
      time: '5h ago',
      content: 'Nuevo teaser del proyecto disponible. ¿Qué opinan?',
      image: false,
      likes: 28,
      comments: 12
    },
    {
      id: 3,
      author: 'Film Creator',
      avatar: '🎞️',
      time: '1d ago',
      content: 'Primera sesión de grabación completada. El equipo está súper motivado!',
      image: true,
      likes: 67,
      comments: 15
    }
  ]

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#0F0F0F',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Header OrKa Style */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A] border-b border-white/10">
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
              <span className="font-display text-xl font-bold text-white hidden md:block" style={{ letterSpacing: '-0.01em' }}>
                VLOCKSTER
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF0000] rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                <span className="text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - OrKa Style */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <nav className="space-y-2">
                <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span>🏠</span>
                  <span className="font-medium">Home</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span>🎬</span>
                  <span>Projects</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span>👥</span>
                  <span>Community</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span>📊</span>
                  <span>Analytics</span>
                </Link>
              </nav>
              
              <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                <h3 className="font-semibold mb-2">Trending Topics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">#indiefilm</span>
                    <span className="text-[#FF0000]">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">#crowdfunding</span>
                    <span className="text-[#FF0000]">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">#filmmaking</span>
                    <span className="text-[#FF0000]">35</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed - OrKa Style */}
          <main className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                  <span className="text-sm font-bold">+</span>
                </div>
                <input
                  type="text"
                  placeholder="What's happening in your project?"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF0000]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm text-gray-400">
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <span>📷</span>
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <span>🎬</span>
                    <span>Video</span>
                  </button>
                </div>
                <button className="px-6 py-2 bg-[#FF0000] rounded-lg font-semibold hover:bg-[#FF1a1a] transition-colors">
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {posts.map((post) => (
              <article key={post.id} className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center text-xl">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{post.time}</span>
                    </div>
                    <p className="text-gray-200 mb-4 leading-relaxed">{post.content}</p>
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-red-600/20 via-purple-600/20 to-blue-600/20 aspect-video border border-white/10 shadow-lg">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-4xl">🎬</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-6 text-gray-400">
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
                      <button className="ml-auto hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </main>
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

