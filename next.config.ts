import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
        pathname: '/firebasejs/**',
      },
    ],
  },
};

export default nextConfig;
