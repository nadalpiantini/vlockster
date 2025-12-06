import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center | VLOCKSTER',
  description: 'Get help with using the VLOCKSTER platform for independent cinema'
}

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-red-400 to-orange-500 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to your questions about using VLOCKSTER for streaming, crowdfunding, and community engagement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Getting Started',
              description: 'Learn how to navigate VLOCKSTER and find great independent films',
              icon: '🎥',
              topics: [
                'Creating an account',
                'Navigating the platform',
                'Finding films to watch',
                'Joining communities'
              ]
            },
            {
              title: 'Streaming & Watching',
              description: 'Troubleshoot video playback and discover features',
              icon: '📺',
              topics: [
                'Video playback issues',
                'Subtitles and audio',
                'Mobile streaming',
                'Offline viewing'
              ]
            },
            {
              title: 'Support & Contact',
              description: 'Get in touch with our support team',
              icon: '💬',
              topics: [
                'Contact support',
                'Report a problem',
                'Feature requests',
                'Community guidelines'
              ]
            }
          ].map((section, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-red-500/30 transition-all group">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white">{section.title}</h3>
              <p className="text-gray-400 mb-6">{section.description}</p>
              <ul className="space-y-3">
                {section.topics.map((topic, topicIdx) => (
                  <li key={topicIdx} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {topic}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all">
                View Guides
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'How do I support a film project?',
                answer: 'You can support film projects by navigating to the project page and clicking the "Support Project" button. Choose your contribution level and rewards, then complete the payment process securely.'
              },
              {
                question: 'Can I watch films without supporting them?',
                answer: 'Yes, all films on VLOCKSTER are available for streaming to all users. Supporting projects gives you exclusive access to special rewards and early releases.'
              },
              {
                question: 'How does the crowdfunding work?',
                answer: 'Our crowdfunding system allows filmmakers to raise funds for their projects while offering backers exclusive rewards. Funds are only collected if the project reaches its goal.'
              },
              {
                question: 'How do I become a creator?',
                answer: 'Click the "Apply as Creator" button in the header, fill out the application form with your project details, and our team will review your application.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-black/40 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you with any questions about using VLOCKSTER.
            Contact us and we{'\''}ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all">
              Contact Support
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-lg font-bold border border-white/20 hover:bg-white/20 transition-all">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}