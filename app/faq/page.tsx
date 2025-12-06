import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | VLOCKSTER',
  description: 'Frequently asked questions about the VLOCKSTER platform'
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-red-400 to-orange-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300">
            Find answers to common questions about VLOCKSTER
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              question: 'What is VLOCKSTER?',
              answer: 'VLOCKSTER is a platform for independent cinema that combines streaming, crowdfunding, and community features. Creators can showcase their work and raise funds, while audiences can discover unique films and support projects they believe in.'
            },
            {
              question: 'How can I support a film project?',
              answer: 'You can support film projects by navigating to the project page and selecting a contribution tier. Each tier offers different benefits like early access, producer credits, physical rewards, or exclusive experiences with the filmmakers.'
            },
            {
              question: 'Can I watch films without contributing?',
              answer: 'Yes, all films on VLOCKSTER are available for streaming to all users regardless of whether they contribute. Contributing gives you special rewards and helps bring projects to life.'
            },
            {
              question: 'How do I become a creator on VLOCKSTER?',
              answer: 'Click the "Apply as Creator" button in the header, fill out the application form with information about yourself and your project, and our team will review your application. Once approved, you can create and fund your projects.'
            },
            {
              question: 'What types of projects are accepted?',
              answer: 'We welcome all types of independent film projects - documentaries, dramas, comedies, experimental films, and more. Projects must be original work and align with our community guidelines.'
            },
            {
              question: 'How does the crowdfunding work?',
              answer: 'Our crowdfunding system allows filmmakers to set funding goals and offer rewards to supporters. Funds are only collected if the project reaches its funding goal. If not, all contributions are refunded.'
            },
            {
              question: 'Is there a fee to use the platform?',
              answer: 'VLOCKSTER charges a small percentage of successful funding campaigns. There is no fee for browsing, watching films, or supporting projects. Creator account applications are free.'
            },
            {
              question: 'How can I stay updated on projects I\'ve supported?',
              answer: 'You\'ll receive email updates from creators, and all updates appear on the project page. You can also follow creators and projects in your community feed.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-red-500/30 transition-all">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-sm">Q</div>
                {faq.question}
              </h3>
              <p className="text-gray-300 pl-11">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-gray-400 mb-8">
            If you need more help, our support team is ready to assist you.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}