export const site = {
  name: "doion(도이온)",
  url: "https://doion.co.kr",
  ceo: "이현우",
  email: "ceo@doion.co.kr",
  phone: "010-9786-2433",
  region: "수원 율전동",
  // 네이버 서치어드바이저 HTML 메타 인증값 (기존 사이트에서 그대로 이어받음)
  naverVerification: "bc499692f5ad5b3e4ef85972cb1105dcdd0fc76a",
  // 실시간 상담 가능 시간 (관리자 페이지에서 수동으로 덮어쓸 수 있음)
  businessDays: [1, 2, 3, 4, 5],
  businessHours: [9, 18] as const,
};

// 페이지별 metadata.openGraph는 layout 값을 통째로 덮어쓰므로, 공통값을 여기서 같이 넣음
const shareImage = { url: "/assets/og-2026.png", width: 1200, height: 630, alt: "doion — 간판 다음으로, 손님이 보는 곳." };
export const og = (url: string) => ({ type: "website" as const, siteName: site.name, locale: "ko_KR", url, images: [shareImage] });
export const twitterCard = { card: "summary_large_image" as const, images: [shareImage] };

export const nav = [
  { href: "/portfolio", label: "사례" },
  { href: "/pricing", label: "가격" },
  { href: "/process", label: "진행 방식" },
];
