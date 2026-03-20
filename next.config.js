/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
    ],
    formats: ['image/avif', 'image/webp'],   // serve modern formats = 40% smaller
    minimumCacheTTL: 86400,                   // cache images 24hrs
    deviceSizes: [640, 750, 828, 1080, 1200], // only generate needed sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compress all responses
  compress: true,
  // Power header for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
