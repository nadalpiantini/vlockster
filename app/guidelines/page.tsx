import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Guidelines | VLOCKSTER',
  description: 'Guidelines and resources for creators on the VLOCKSTER platform'
}

export default function CreatorGuidelinesPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Creator Guidelines</h1>
        <div className="prose prose-invert max-w-none">
          <h2>Getting Started as a Creator</h2>
          <p>Welcome to VLOCKSTER! As a creator, you have the opportunity to showcase your independent cinema projects to a supportive audience that can help fund and promote your work.</p>
          
          <h3>Content Requirements</h3>
          <ul>
            <li>All content must be original work owned by the creator</li>
            <li>Projects must align with our community guidelines</li>
            <li>Complete project information is required for approval</li>
            <li>Provide high-quality promotional materials</li>
          </ul>
          
          <h3>Project Submission Process</h3>
          <ol>
            <li>Submit your project details through the Creator Portal</li>
            <li>Our team will review your submission (typically within 3 business days)</li>
            <li>Upon approval, set up your project page</li>
            <li>Launch your crowdfunding campaign</li>
            <li>Engage with your community</li>
          </ol>
          
          <h3>Best Practices</h3>
          <ul>
            <li>Create compelling project descriptions</li>
            <li>Include high-quality visual materials</li>
            <li>Set realistic funding goals</li>
            <li>Provide meaningful rewards for backers</li>
            <li>Maintain regular communication with your supporters</li>
          </ul>
          
          <div className="mt-8 p-6 bg-gray-900 rounded-lg">
            <h4>Need Help?</h4>
            <p>Visit our <a href="/apply" className="text-red-400 hover:underline">Apply as Creator</a> page to get started or contact our creator support team.</p>
          </div>
        </div>
      </div>
    </div>
  )
}