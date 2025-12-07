/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-feather', 'framer-motion', 'recharts'],
  },
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;
