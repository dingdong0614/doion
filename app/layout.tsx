import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import { TransitionRoot } from "@/components/Transition";
import FontFallback from "@/components/FontFallback";
import { og, site, twitterCard } from "@/lib/site";
import localFont from "next/font/local";
import "./globals.css";

// 폰트(Pretendard Variable, 굵기 200~800) 두 단계:
// 1) 첫 화면 글자만 담은 작은 서브셋(PretendardCritical.woff2)을 next/font/local로 preload.
// 2) 사이트 전체 글자 서브셋(public/fonts/PretendardSubset.woff2)과 조각 폰트는 FontFallback이 한가할 때 붙인다.
// 문구를 바꾸면 docs/font-subset.md 순서대로 다시 생성.
const critical = localFont({
  src: "./fonts/PretendardCritical.woff2",
  weight: "200 800",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  variable: "--font-first",
});

const description =
  "헬스장, 뷰티샵, 학원 등 소규모 매장을 위한 업종별 맞춤 웹사이트 제작·관리 대행, 도이온. 수원 율전동에서 대표가 직접 상담하고 약 2주 안에 만듭니다.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "doion(도이온) | 소규모 매장 웹사이트 제작·관리 대행", template: "%s | doion(도이온)" },
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

// 첫 페인트 전에: 움직임 줄이기 설정 적용, 첫 방문이면 로더(1.6초) 켜기.
// 로더는 CSS 키프레임만으로 끝나고, 1.65초 뒤 속성을 지워 스크롤을 돌려준다(스크립트 로딩과 무관).
// data-first는 로더 뒤에 히어로 글자가 켜지도록 지연을 주는 표시(3초 뒤 제거).
const prefsScript = `try{var d=document.documentElement,m=localStorage.getItem('motion');if(m==='reduced')d.dataset.motion='reduced';var rm=m==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm&&!localStorage.getItem('doion-seen')&&!/[?&]noloader/.test(location.search)){d.setAttribute('data-loader','');d.setAttribute('data-first','');localStorage.setItem('doion-seen','1');setTimeout(function(){d.removeAttribute('data-loader')},1650);setTimeout(function(){d.removeAttribute('data-first')},3000)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={critical.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <a href="#main" className="skip" data-nocover>
          본문 바로가기
        </a>
        <Loader />
        <TransitionRoot />
        <Cursor />
        <SmoothScroll />
        <FontFallback />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* 쿠키 없는 방문 통계(Vercel Web Analytics). Vercel 밖(로컬 측정)에서는 스크립트 경로가 없어 끔 */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
