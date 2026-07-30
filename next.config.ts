import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // Attributed local demo copies remain deterministic until
    // approved venue assets replace these temporary files.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
      ],
    }];
  },
};

export default nextConfig;
