import type { NextConfig } from "next";

// 기존 정적 사이트(.html) URL → 새 경로. 표는 docs/redirects.md와 동일하게 유지.
const legacy = ["pricing", "portfolio", "process", "contact", "privacy"];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", statusCode: 301 as const },
      ...legacy.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, statusCode: 301 as const })),
    ];
  },
};

export default nextConfig;
