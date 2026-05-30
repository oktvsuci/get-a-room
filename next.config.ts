import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.56.1",      // IP VirtualBox host-only kamu
    "192.168.1.*",       // opsional: cover semua IP LAN lokal
  ],
};

export default nextConfig;