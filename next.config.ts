import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This wild symbol means "Allow ALL websites"
      },
    ],
  },
};

export default nextConfig;