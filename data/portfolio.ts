// 사례 추가 방법: 아래 배열에 항목 하나 + public/assets/portfolio/ 에 썸네일 한 장. (docs/portfolio-guide.md)

export type PortfolioItem = {
  name: string;
  category: string; // 필터 탭에 그대로 쓰임
  summary: string;
  href?: string; // 라이브 URL
  thumb: string; // public 기준 경로, 가로형 약 2:1 권장
  demo?: boolean; // 영업용 데모면 true — 카드에 '데모'로 표기
  published: boolean; // 공개 동의 미확인이면 false (렌더 안 함)
  order: number; // 작을수록 앞
};

const items: PortfolioItem[] = [
  {
    name: "뭐무까~",
    category: "웹앱",
    summary: "성균관대 자연과학캠퍼스 도보권 맛집 166곳. 지금 문 연 곳만 골라 도보 거리·가격으로 정렬하는 모바일 웹앱.",
    href: "https://yuljeonfood.co.kr",
    thumb: "/assets/portfolio/sungdae-bapjip-thumb.jpg",
    published: true,
    order: 1,
  },
  {
    name: "피티홀릭짐",
    category: "헬스장",
    summary: "수원 율전동 PT 전문 헬스장. Next.js로 전면 리빌드해 운영 중.",
    href: "https://ptholic-1.vercel.app",
    thumb: "/assets/portfolio/ptholic-thumb.jpg",
    published: true,
    order: 2,
  },
  {
    name: "빠둠뮤직 보컬 트레이닝 센터",
    category: "학원",
    summary: "부산 양정·서울 충무로 보컬·음성재활 트레이닝 센터. 데이터 기반 훈련을 앞세운 사이트.",
    href: "https://bbadoom-music.vercel.app",
    thumb: "/assets/portfolio/bbadoom-thumb.jpg",
    published: true,
    order: 3,
  },
  {
    name: "키훈 Beauty Archive",
    category: "인플루언서",
    summary: "인스타그램 팔로워 8.7K 뷰티 크리에이터의 제품 아카이브. 인스타그램 연동형.",
    href: "https://keyhoon.vercel.app",
    thumb: "/assets/portfolio/keyhoon-thumb.jpg",
    published: true,
    order: 4,
  },
  {
    name: "장안설비대장",
    category: "디렉토리",
    summary: "수원 장안구 보일러·냉난방·샷시 등 설비 소상공인을 업종별로 모아 연결하는 지역 디렉토리.",
    href: "https://jangan-equipment.vercel.app",
    thumb: "/assets/portfolio/jangan-equipment-thumb.jpg",
    published: true,
    order: 5,
  },
  {
    name: "체대입시 실기 기록판",
    category: "디렉토리",
    summary: "실기 기준·입시요강·일정을 정리하고 지역별 학원을 연결하는 정보 허브.",
    href: "https://chedae-ipsi.vercel.app",
    thumb: "/assets/portfolio/chedae-ipsi-thumb.jpg",
    published: true,
    order: 6,
  },
  {
    name: "온담요양원",
    category: "요양원",
    summary: "노인요양시설 제안용 데모. 상담·입소 절차 안내부터 시설 소개까지.",
    href: "https://care-demo-git-main-me-68b9.vercel.app",
    thumb: "/assets/portfolio/ondam-care-thumb.jpg",
    demo: true,
    published: true,
    order: 7,
  },
  {
    name: "다솜교회",
    category: "교회",
    summary: "교회 제안용 데모. 예배 시간 안내부터 새가족 안내까지.",
    href: "https://dasom-church-demo.vercel.app",
    thumb: "/assets/portfolio/dasom-church-thumb.jpg",
    demo: true,
    published: true,
    order: 8,
  },
];

export const portfolio = items.filter((i) => i.published).sort((a, b) => a.order - b.order);
export const categories = [...new Set(portfolio.map((i) => i.category))];

export const proposals = [
  { title: "헬스장·피트니스 센터", file: "gym-fitness.pdf", desc: "NFC/QR 현장 연동, 예약 통합, Doion Care 관리까지." },
  { title: "뷰티샵·미용실", file: "beauty-salon.pdf", desc: "시술 메뉴·가격, 예약 연동, 후기 노출. 1인샵에도 맞춤." },
  { title: "학원·교육 기관", file: "academy.pdf", desc: "커리큘럼 안내, 상담 신청, 수강생 후기." },
  { title: "패션 매거진·에디토리얼", file: "magazine.pdf", desc: "화보·인터뷰 아카이브, 구독·미디어킷 연동." },
  { title: "교회·종교 시설", file: "church.pdf", desc: "예배 안내, 설교 다시보기, 새가족 온라인 등록." },
  { title: "요양원·요양시설", file: "nursing-home.pdf", desc: "시설·프로그램 소개, 평가등급 공개, 입소 상담 신청." },
];
