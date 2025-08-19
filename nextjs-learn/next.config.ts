import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: ".next",
  output: "standalone",
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: false
};

export default nextConfig;
