import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { og, site, twitterCard } from "@/lib/site";
import localFont from "next/font/local";
import "./fonts/wanted/wanted-sans.css";
import "./globals.css";

// 사이트에 실제 쓰인 글자만 담은 Wanted Sans(약 90KB, 굵기 300~700) 1파일을 preload.
// 여기 없는 글자는 --font 다음 순서의 조각 폰트(wanted-sans.css)가 필요한 조각만 받아 채운다.
// 문구를 크게 바꾸면 docs/font-subset.md 순서대로 다시 생성.
const wantedSubset = localFont({
  src: "./fonts/WantedSansSubset.woff2",
  weight: "300 700",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  variable: "--font-subset",
});

const description =
  "헬스장, 뷰티샵, 학원 등 소규모 매장을 위한 업종별 맞춤 웹사이트 제작·관리 대행, 도이온. 수원 율전동에서 대표가 직접 상담하고 약 2주 안에 만듭니다.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "doion(도이온) — 소규모 매장 웹사이트 제작·관리 대행", template: "%s — doion(도이온)" },
  description,
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/assets/favicon.svg", type: "image/svg+xml" }], apple: "/assets/apple-touch-icon.png" },
  openGraph: og("/"),
  twitter: twitterCard,
  verification: { other: { "naver-site-verification": site.naverVerification } },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
};

// 첫 페인트 전에 테마·모션 설정을 적용해 깜빡임 방지
const prefsScript = `try{var d=document.documentElement,t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.dataset.theme=t;var m=localStorage.getItem('motion');if(m)d.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={wantedSubset.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <a href="#main" className="skip">
          본문 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* 쿠키 없는 방문 통계(Vercel Web Analytics) */}
        <Analytics />
      </body>
    </html>
  );
}
