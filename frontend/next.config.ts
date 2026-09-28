import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.106.211.153', 'localhost', '127.0.0.1'],
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};
export default nextConfig;
