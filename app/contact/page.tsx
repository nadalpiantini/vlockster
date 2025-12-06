import { Metadata } from 'next'
import { Mail, Phone, MapPin, Send, User, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | VLOCKSTER',
  description: 'Get in touch with the VLOCKSTER team for questions and support'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-red-400 to-orange-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about VLOCKSTER? We{'\''}d love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-red-500" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <p className="text-gray-400">support@vlockster.com</p>
                    <p className="text-gray-400 text-sm">General inquiries and support</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Business hours: Mon-Fri 9AM-5PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Address</h3>
                    <p className="text-gray-400">123 Creative Street</p>
                    <p className="text-gray-400 text-sm">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-400" />
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-red-400">Closed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <Send className="w-6 h-6 text-red-500" />
              Send us a Message
            </h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-900">Select a subject</option>
                  <option value="support" className="bg-gray-900">Technical Support</option>
                  <option value="creator" className="bg-gray-900">Creator Application</option>
                  <option value="partnership" className="bg-gray-900">Partnership Inquiry</option>
                  <option value="feedback" className="bg-gray-900">General Feedback</option>
                  <option value="other" className="bg-gray-900">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-500/30"
              >
                Send Message
                <Send className="w-5 h-5 ml-2 inline-block" />
              </button>
            </form>
          </div>
        </div>

        {/* Support Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Technical Support',
              description: 'Issues with streaming, platform functionality, or account access',
              icon: '⚙️'
            },
            {
              title: 'Creator Support',
              description: 'Application process, project management, and creator tools',
              icon: '🎬'
            },
            {
              title: 'General Inquiry',
              description: 'Questions, feedback, or business opportunities',
              icon: '💬'
            }
          ].map((support, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/30 transition-all text-center group">
              <div className="text-4xl mb-4">{support.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{support.title}</h3>
              <p className="text-gray-400">{support.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}