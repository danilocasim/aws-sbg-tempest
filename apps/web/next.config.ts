import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  transpilePackages: ["@tempest/ui", "@tempest/db", "@tempest/email"],
  poweredByHeader: false,
  images: { formats: ["image/webp"] },
};

export default config;
