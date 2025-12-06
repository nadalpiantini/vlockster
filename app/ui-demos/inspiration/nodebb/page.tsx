import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react'

export default function NodeBBStylePage() {
  const categories = [
    { name: 'Film Projects', count: 24, icon: '🎬', color: 'from-red-500 to-red-600' },
    { name: 'Crowdfunding', count: 18, icon: '💰', color: 'from-purple-500 to-purple-600' },
    { name: 'Community', count: 42, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { name: 'Technical', count: 15, icon: '⚙️', color: 'from-green-500 to-green-600' }
  ]

  const topics = [
    {
      id: 1,
      title: 'How to optimize video uploads for streaming?',
      category: 'Technical',
      author: 'Tech Expert',
      replies: 12,
      views: 234,
      lastActivity: '2h ago',
      pinned: true
    },
    {
      id: 2,
      title: 'Best practices for crowdfunding campaigns',
      category: 'Crowdfunding',
      author: 'Creator Pro',
      replies: 28,
      views: 567,
      lastActivity: '5h ago',
      pinned: false
    },
    {
      id: 3,
      title: 'Community guidelines and moderation',
      category: 'Community',
      author: 'Admin',
      replies: 8,
      views: 189,
      lastActivity: '1d ago',
      pinned: false
    }
  ]

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: '#F8F9FA',
        color: '#111827',
        minHeight: '100vh'
      }}
    >
      {/* Header NodeBB Style */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
              <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Recent</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Unread</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Tags</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF0000] rounded-full"></span>
                🔔
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - NodeBB Style */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF0000]" />
                  Trending
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">#indiefilm</span>
                    <span className="text-[#FF0000] font-semibold">42</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">#crowdfunding</span>
                    <span className="text-[#FF0000] font-semibold">28</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">#filmmaking</span>
                    <span className="text-[#FF0000] font-semibold">35</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF0000]" />
                  Online
                </h3>
                <div className="text-2xl font-bold text-[#FF0000]">1,234</div>
                <div className="text-sm text-gray-500">users online</div>
              </div>
            </div>
          </aside>

          {/* Main Content - NodeBB Style */}
          <main className="lg:col-span-3">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                      <p className="text-sm text-gray-500">{cat.count} topics</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Topics List - NodeBB Style */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Recent Topics</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B35] flex items-center justify-center text-white font-bold flex-shrink-0">
                        {topic.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.pinned && (
                            <span className="px-2 py-0.5 bg-[#FF0000] text-white text-xs font-semibold rounded">
                              PINNED
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {topic.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#FF0000] transition-colors">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {topic.replies}
                          </span>
                          <span>{topic.views} views</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {topic.lastActivity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

