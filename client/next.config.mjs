/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация production build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Оптимизация bundle
  swcMinify: true,
  
  // Production source maps (для debugging)
  productionBrowserSourceMaps: false,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
};

export default nextConfig;
