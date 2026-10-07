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
    // 🔥 Sirf yeh line zaroori hai limit bachane ke liye
    unoptimized: true,
    
    // Yahan se formats aur cache wali lines hata di hain taaki conflict na ho
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
