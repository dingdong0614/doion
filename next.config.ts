import type { NextConfig } from "next";

// 기존 정적 사이트(.html) URL → 새 경로. 표는 docs/redirects.md와 동일하게 유지.
const legacy = ["pricing", "portfolio", "process", "contact", "privacy"];

// Content-Security-Policy (Report-Only 선배포, 2026-10-01). 사이트가 실제로 쓰는 리소스만 허용:
//  - script/style: Next 인라인(prefsScript, JSON-LD, styled-jsx, 인라인 style 속성) 때문에 'unsafe-inline' 필요
//  - connect: 상담폼이 /api/contact(자체)와 api.web3forms.com(국외 relay)로 브라우저에서 직접 fetch
//  - img/font: 전부 자체 호스팅(+data: 서브셋·파비콘). 외부 CDN/구글폰트/iframe 없음(Vercel Analytics는 동일 출처)
//  차단 모드 전환은 report 수집 후 대표 승인 시 Content-Security-Policy 헤더명으로 교체.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  // 기본 보안 헤더(실무표준 02). CSP는 Report-Only로 선배포, 차단 전환은 대표 확인 후.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
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
