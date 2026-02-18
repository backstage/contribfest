import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',        // Enable static export
  basePath: '/contribfest', // GitHub Pages project site path
  env: {
    NEXT_PUBLIC_BASE_PATH: '/contribfest',
  },
  trailingSlash: true,     // Clean URLs
  images: {
    unoptimized: true      // Required for static export
  }
}

export default nextConfig
