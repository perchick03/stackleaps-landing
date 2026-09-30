import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only. Without this, loading the dev server over the LAN IP (phone testing)
  // blocks the JS chunks, and every Framer Motion section stays at its opacity-0
  // initial state - the page renders as a blank body under the header.
  // Wildcard, not one IP: the LAN address changes with the network (DHCP).
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
};

export default nextConfig;
