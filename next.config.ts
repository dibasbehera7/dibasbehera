import type { NextConfig } from "next";

/**
 * Public URL path prefix for the deployed site.
 *
 * GitHub Pages serves a project site under `/<repo>/` and an account site at
 * the root, so the prefix differs per deployment target and is supplied at
 * build time rather than hardcoded. Empty means "served from the root".
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;