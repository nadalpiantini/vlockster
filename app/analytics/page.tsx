import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Analytics | VLOCKSTER',
  description: 'Analytics and insights for creators on the VLOCKSTER platform'
}

export default function CreatorAnalyticsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Creator Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-white">12,456</p>
            <p className="text-green-400 text-sm">+12.5% from last month</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Backers</h3>
            <p className="text-3xl font-bold text-white">892</p>
            <p className="text-green-400 text-sm">+8.3% from last month</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Funding Raised</h3>
            <p className="text-3xl font-bold text-white">$45,678</p>
            <p className="text-green-400 text-sm">+15.2% from last month</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Engagement</h3>
            <p className="text-3xl font-bold text-white">45%</p>
            <p className="text-green-400 text-sm">+5.1% from last month</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Project Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Una Ola A La Vez</span>
                  <span className="text-gray-400">$24,500 / $50,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '49%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Granito de Arena</span>
                  <span className="text-gray-400">$18,250 / $30,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '61%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Atravesando el Jordán</span>
                  <span className="text-gray-400">$12,400 / $25,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Audience Insights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Geographic Distribution</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-gray-300">
                    <span>United States</span>
                    <span>34%</span>
                  </li>
                  <li className="flex justify-between text-gray-300">
                    <span>Spain</span>
                    <span>22%</span>
                  </li>
                  <li className="flex justify-between text-gray-300">
                    <span>Latin America</span>
                    <span>28%</span>
                  </li>
                  <li className="flex justify-between text-gray-300">
                    <span>Other</span>
                    <span>16%</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white mb-2">Top Referral Sources</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Social Media (42%)</li>
                  <li>Direct Traffic (28%)</li>
                  <li>Email Campaigns (18%)</li>
                  <li>Partner Networks (12%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-8 border border-red-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Creator Resources</h2>
          <p className="text-gray-300 mb-6">Access detailed guides and support materials to maximize your success on VLOCKSTER.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors">
              Download Analytics Report
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold border border-white/20 transition-colors">
              Creator Best Practices
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold border border-white/20 transition-colors">
              Audience Growth Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}