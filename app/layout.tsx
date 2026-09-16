import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import { Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./fonts/pretendard.css";
import "./globals.css";

// 제목 전용 세리프. 한글은 unicode-range 조각으로 필요한 글자만 내려받음.
const serif = Noto_Serif_KR({
  weight: ["700"],
  preload: false,
  display: "swap",
  variable: "--font-serif",
});

const description =
  "헬스장, 뷰티샵, 학원 등 소규모 매장을 위한 업종별 맞춤 웹사이트 제작·관리 대행, 도이온. 수원 율전동에서 대표가 직접 상담하고 약 2주 안에 만듭니다.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "doion(도이온) — 소규모 매장 웹사이트 제작·관리 대행", template: "%s — doion(도이온)" },
  description,
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/assets/favicon.svg", type: "image/svg+xml" }], apple: "/assets/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ko_KR",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  verification: { other: { "naver-site-verification": site.naverVerification } },
};

export const viewport: Viewport = {
  themeColor: "#0f1b2e",
};

// 첫 페인트 전에 테마·모션 설정을 적용해 깜빡임 방지
const prefsScript = `try{var d=document.documentElement,t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.dataset.theme=t;var m=localStorage.getItem('motion');if(m)d.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={serif.variable} suppressHydrationWarning>
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
        <a className="fab-call" href={`tel:${site.phone.replaceAll("-", "")}`} aria-label={`전화 상담 ${site.phone}`}>
          <Phone size={22} aria-hidden />
        </a>
      </body>
    </html>
  );
}
