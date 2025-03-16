import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all external domains
      },
    ],
  },
  reactStrictMode: true
};

export default nextConfig;
