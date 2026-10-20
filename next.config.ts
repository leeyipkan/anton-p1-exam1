import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/sunny-class" : "";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right",
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(pages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
