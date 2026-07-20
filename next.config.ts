import type { NextConfig } from "next";

function r2RemotePattern() {
  if (!process.env.R2_PUBLIC_URL) return [];
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePattern(),
  },
};

export default nextConfig;
