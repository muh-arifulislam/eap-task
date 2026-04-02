

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.100",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sudokkho.fleekcommerce.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.sudokkho.xyz",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true, 
  },
};

export default nextConfig;