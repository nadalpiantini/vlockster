import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Remove deprecated experimental.typedRoutes warning
  typedRoutes: true,
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
