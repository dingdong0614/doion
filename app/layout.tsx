import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./fonts/wanted/wanted-sans.css";
import "./globals.css";

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
  themeColor: "#f7f7f4",
};

// 첫 페인트 전에 테마·모션 설정을 적용해 깜빡임 방지
const prefsScript = `try{var d=document.documentElement,t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.dataset.theme=t;var m=localStorage.getItem('motion');if(m)d.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
