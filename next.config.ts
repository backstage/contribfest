import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',     // Enable static export
  trailingSlash: true,  // Clean URLs
  images: {
    unoptimized: true   // Required for static export
  }
}

export default nextConfig
