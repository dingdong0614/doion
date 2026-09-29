import type { NextConfig } from "next";

// 기존 정적 사이트(.html) URL → 새 경로. 표는 docs/redirects.md와 동일하게 유지.
const legacy = ["pricing", "portfolio", "process", "contact", "privacy"];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  // 기본 보안 헤더(실무표준 02). CSP는 report-only 단계부터 대표 확인 후 따로 적용
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", statusCode: 301 as const },
      ...legacy.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, statusCode: 301 as const })),
    ];
  },
};

export default nextConfig;
