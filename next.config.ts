import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',        // Enable static export
  basePath: '/contribfest', // GitHub Pages project site path
  trailingSlash: true,     // Clean URLs
  images: {
    unoptimized: true      // Required for static export
  }
}

export default nextConfig
