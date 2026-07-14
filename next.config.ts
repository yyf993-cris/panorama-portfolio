import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.notion.so",
      },
      {
        protocol: "https",
        hostname: "notion.so",
      },
    ],
  },
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/works/:filename(.+\\.(?:jpg|jpeg|png|gif|webp|svg))",
        destination: "/api/serve-file/:filename",
      },
    ],
    fallback: [],
  }),
};

export default nextConfig;
