/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 FIX: Trailing slashes disable kar diye taaki duplicate URLs na banein
  trailingSlash: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
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
