# 포트폴리오 사례 추가하기

코드 수정 없이 **데이터 한 항목 + 캡처 이미지**로 끝납니다.

1. 캡처 두 장을 `public/assets/work/`에 넣습니다(파일명 영문).
   - `이름-d.jpg`: 데스크톱 1440×900 화면 캡처 → 노트북 프레임에 들어감
   - `이름-m.jpg`: 모바일 390×844, 2배율(780×1688) 캡처 → 휴대폰 프레임에 들어감
   - 팝업·안내창이 닫힌 첫 화면으로 찍으세요. 공유용 썸네일(`public/assets/portfolio/`, 약 2:1)도 한 장 넣습니다.
2. `data/portfolio.ts`의 `items` 배열에 항목을 하나 추가합니다.

```ts
{
  name: "매장 이름",
  category: "뷰티샵",          // 필터 탭에 그대로 나옴. 새 이름을 쓰면 탭이 자동으로 생김
  summary: "한두 문장 설명",
  href: "https://라이브주소",   // 없으면 생략
  thumb: "/assets/portfolio/파일명.jpg",
  desktop: "/assets/work/이름-d.jpg",  // 없으면 생략 → 휴대폰 화면만 나옴
  mobile: "/assets/work/이름-m.jpg",
  tile: { bg: "#0f5c3c", tone: "dark" }, // 카드 배경 = 고객 브랜드 대표색. 밝은 색이면 tone: "light"
  demo: false,                 // 영업용 데모면 true → '영업용 데모' 표시
  published: true,             // 고객 공개 동의 전이면 false → 화면에 안 나옴
  order: 9,                    // 작을수록 앞. 홈에는 앞 7개만 나옴
},
```

3. `npm run dev`로 `/`와 `/portfolio`를 확인한 뒤 배포합니다.

- 카드 크기는 개수에 맞춰 7·5 / 4·4·4 / 6·6 줄로 자동 배치되고, 빈칸이 남지 않게 마지막 줄을 조정합니다. 넓은 카드에는 노트북, 좁은 카드에는 휴대폰 화면이 나옵니다.
- 홈에는 앞의 7개가 나옵니다(`app/page.tsx`의 `HOME_TILES`).
- 업종별 제안서 PDF는 같은 파일의 `proposals` 배열과 `public/assets/proposals/`에서 관리합니다.
- 가격, 관리 요금, 진행 단계, 차별점 문구는 `data/offer.ts`에서 고칩니다.

리허설(2026-09-16): 임시 항목을 추가하자 `/portfolio`의 카드 수와 필터 탭이 코드 수정 없이 반영되는 것을 확인했습니다. 확인 후 되돌렸습니다.
