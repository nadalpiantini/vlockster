import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Remove deprecated experimental.typedRoutes warning
  typedRoutes: true,
  // Force Node.js runtime by default
  runtime: 'nodejs',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflarestream.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors/warnings. Only use if you understand the risks.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors. Only use if you understand the risks.
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/requests',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
