import { Metadata } from 'next'
import { Shield, User, Film, DollarSign, Lock, Gavel, AlertTriangle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | VLOCKSTER',
  description: 'Terms and conditions for using the VLOCKSTER platform'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-red-400 to-orange-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300">
            Last updated: December 2025
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-500" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using VLOCKSTER, you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by these terms, you are not authorized to use or access this site.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-500" />
              User Accounts
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                When you create an account on VLOCKSTER, you are responsible for maintaining the confidentiality of your 
                account and password and for restricting access to your computer.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-4">
                <li>You agree to accept responsibility for all activities that occur under your account or password.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>VLOCKSTER reserves the right to refuse service, terminate accounts, or remove or edit content.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Film className="w-6 h-6 text-green-500" />
              Content Guidelines
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                VLOCKSTER provides a platform for independent filmmakers to share their work and raise funds. 
                All content must comply with our community guidelines and legal requirements.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-4">
                <li>Content must be original work owned by the creator</li>
                <li>No copyrighted material without proper authorization</li>
                <li>Content must not violate any laws or regulations</li>
                <li>Films must be appropriate for the intended audience</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-yellow-500" />
              Crowdfunding Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                Our crowdfunding features allow creators to raise funds for their projects. Both creators and backers 
                must understand these terms to protect all parties involved.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-4">
                <li>Funds are only collected if the campaign reaches its goal</li>
                <li>Backers receive rewards as specified by the creator</li>
                <li>Creators are responsible for fulfilling promised rewards</li>
                <li>VLOCKSTER is not responsible for project completion</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-500" />
              Privacy Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your information. We use cookies to improve your experience and analyze 
              platform usage.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Gavel className="w-6 h-6 text-indigo-500" />
              Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                All content on VLOCKSTER, including but not limited to text, graphics, logos, and images, 
                is the property of VLOCKSTER or its licensors and is protected by intellectual property laws.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-4">
                <li>Users may not reproduce, distribute, or create derivative works from our content</li>
                <li>Creators retain ownership of their submitted content</li>
                <li>We reserve the right to remove any infringing content</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              Limitation of Liability
            </h2>
            <p className="text-gray-300 leading-relaxed">
              VLOCKSTER is not liable for any damages arising from your use of the platform. This includes 
              but is not limited to direct, indirect, incidental, or consequential damages. We provide
              the service {'"as is"'} without warranties of any kind.
            </p>
          </section>

          <section className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-red-400" />
              Contact Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-4">
                <li>Email: legal@vlockster.com</li>
                <li>Address: 123 Creative Street, New York, NY 10001</li>
                <li>Support: Visit our Help Center</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>
            By using VLOCKSTER, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}