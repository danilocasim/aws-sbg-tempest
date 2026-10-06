import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  transpilePackages: ["@tempest/ui", "@tempest/db", "@tempest/email"],
  poweredByHeader: false,
  // Admin is never indexed and never framed.
  async headers() {
    return [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "X-Frame-Options", value: "DENY" }] }];
  },
};

export default config;
