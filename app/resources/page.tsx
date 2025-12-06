import { Metadata } from 'next'
import { Check, MessageCircle, Target, Users, Rocket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Creator Resources | VLOCKSTER',
  description: 'Resources and tools for creators on the VLOCKSTER platform'
}

export default function CreatorResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-red-400 to-orange-500 bg-clip-text text-transparent">
            Creator Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Essential tools, guidelines, and support materials to help you succeed on VLOCKSTER
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Getting Started',
              description: 'Everything you need to begin your journey as a VLOCKSTER creator',
              icon: '🚀',
              items: [
                'Setting up your creator profile',
                'Understanding our platform policies',
                'Creating your first project page',
                'Basic streaming setup guide'
              ]
            },
            {
              title: 'Marketing Materials',
              description: 'Promotional assets and templates for your projects',
              icon: '🎨',
              items: [
                'Official logo packages',
                'Social media templates',
                'Email newsletter formats',
                'Press kit templates'
              ]
            },
            {
              title: 'Technical Guides',
              description: 'Step-by-step instructions for technical aspects',
              icon: '⚙️',
              items: [
                'Video upload specifications',
                'Recommended streaming equipment',
                'Analytics dashboard tutorials',
                'Community engagement tools'
              ]
            }
          ].map((section, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white">{section.title}</h3>
              <p className="text-gray-400 mb-6">{section.description}</p>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all">
                Download Resources
              </button>
            </div>
          ))}
        </div>

        {/* Creator Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Creator Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Video Uploader', description: 'Upload and manage your videos', icon: '📹' },
              { name: 'Analytics Dashboard', description: 'Track performance and engagement', icon: '📊' },
              { name: 'Community Manager', description: 'Engage with your backers', icon: '👥' },
              { name: 'Funding Calculator', description: 'Plan your campaigns', icon: '💰' }
            ].map((tool, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all text-center group">
                <div className="text-3xl mb-4">{tool.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-red-400 transition-colors">{tool.name}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Creator Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">Content Guidelines</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>High-quality video (minimum 720p)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Compelling thumbnail images</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Detailed project descriptions</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Regular community updates</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">Engagement Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Respond to community comments promptly</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Set realistic funding goals</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Build a dedicated supporter base</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Rocket className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Provide regular project updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Need More Help?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our creator support team is here to help you succeed. Reach out for personalized assistance or join our creator community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all">
              Contact Creator Support
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold border border-white/20 hover:bg-white/20 transition-all">
              Join Creator Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}