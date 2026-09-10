import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only. Without this, loading the dev server over the LAN IP (phone testing)
  // blocks the JS chunks, and every Framer Motion section stays at its opacity-0
  // initial state - the page renders as a blank body under the header.
  allowedDevOrigins: ["192.168.1.8"],
};

export default nextConfig;
