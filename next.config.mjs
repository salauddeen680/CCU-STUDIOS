/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Yeh add karna zaroori hai
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Static export ke liye yeh zaroori hai
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig;
