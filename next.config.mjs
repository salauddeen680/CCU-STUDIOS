/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 🔥 Next-gen fast formats (80% file size chota karega)
    formats: ['image/avif', 'image/webp'],
    // 🔥 Phone memory aur CDN mein 30 din tak image save rahegi (instant reload)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://ccu-studios.firebaseapp.com/__/auth/:path*',
      },
    ];
  },
}

export default nextConfig;
