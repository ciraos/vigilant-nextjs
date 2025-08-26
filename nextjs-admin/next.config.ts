import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:6001",
    "http://192.168.253.1:6001",
    "*.ciraos.top"
  ],
  distDir: ".next",
  output: "standalone",
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: false
};

export default nextConfig;
