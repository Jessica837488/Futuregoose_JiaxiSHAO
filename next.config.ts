import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Ensure trailing slash for static hosting compatibility
  trailingSlash: false,
  // Disable image optimization (not supported in static export)
  images: { unoptimized: true },
};

export default nextConfig;
