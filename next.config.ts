import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/anton-p1-exam1" : "";

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
    : {
        skipTrailingSlashRedirect: true,
        async rewrites() {
          return [
            { source: "/chinese", destination: "/chinese/index.html" },
            { source: "/chinese/", destination: "/chinese/index.html" },
          ];
        },
      }),
};

export default nextConfig;
