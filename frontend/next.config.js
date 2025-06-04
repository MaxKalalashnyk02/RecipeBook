/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['axios'],
  },
};

module.exports = nextConfig; 