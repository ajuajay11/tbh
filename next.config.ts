import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co'],
    formats: ['image/webp', 'image/avif'], // Add this line for modern formats
    // alternatively, for more granular control you can use remotePatterns:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'i.ibb.co',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
