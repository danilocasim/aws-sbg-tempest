import type { NextConfig } from "next";
import path from "node:path";
const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Vanity handle → canonical profile (ADR-0005). In production this is a DB lookup in middleware.
  async redirects() {
    return [
      { source: "/@maya", destination: "/p/7hq2k", permanent: true },
      { source: "/@rjdelacruz", destination: "/p/k3m9pz", permanent: true },
    ];
  },
};
export default config;
