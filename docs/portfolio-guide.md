# 포트폴리오 사례 추가하기

코드 수정 없이 **데이터 한 항목 + 캡처 이미지**로 끝납니다.

1. 캡처 두 장을 `public/assets/work/`에 넣습니다(파일명 영문).
   - `이름-d.jpg`: 데스크톱 1440×900 화면 캡처 → 노트북 프레임에 들어감
   - `이름-m.jpg`: 모바일 390×844, 2배율(780×1688) 캡처 → 휴대폰 프레임에 들어감
   - 팝업·안내창이 닫힌 첫 화면으로 찍으세요. 공유용 썸네일(`public/assets/portfolio/`, 약 2:1)도 한 장 넣습니다.
2. `data/portfolio.ts`의 `items` 배열에 항목을 하나 추가하고(`slug`는 영문 짧은 이름, `sign`은 상호 띠에 쓸 짧은 상호), `scripts/tone.py`의 `CAPTURES`에 같은 slug로 캡처 파일을 적은 뒤 `python3 scripts/tone.py`를 실행해 보정본(4:5, 16:9, 1:1)을 만듭니다.

```ts
{
  name: "매장 이름",
  slug: "shop",                // public/assets/tone/shop-45.jpg 등
  sign: "짧은 상호",            // 상호 띠에 씀. 데모는 띠에 안 나옴
  category: "뷰티샵",          // 필터 탭에 그대로 나옴. 새 이름을 쓰면 탭이 자동으로 생김
  summary: "한두 문장 설명",
  href: "https://라이브주소",   // 없으면 생략
  thumb: "/assets/portfolio/파일명.jpg",
  desktop: "/assets/work/이름-d.jpg",  // 없으면 생략 → 좁은 칸(휴대폰 화면)에만 배치
  mobile: "/assets/work/이름-m.jpg",   // 필수. 모바일에서는 이 화면을 가로로 넘겨 보여줌
  demo: false,                 // 영업용 데모면 true → '영업용 데모' 표시
  published: true,             // 고객 공개 동의 전이면 false → 화면에 안 나옴
  order: 9,                    // 작을수록 앞. 홈에는 앞 7개만 나옴
},
```

3. `npm run dev`로 `/`와 `/portfolio`를 확인한 뒤 배포합니다.

- 홈: 피티홀릭짐이 풀블리드 한 장, 나머지는 가로 트랙 카드(4:5 보정본)로 자동 배치됩니다. /portfolio: 목록 + 고정 미리보기.
- 카테고리 이름은 /portfolio 업종 필터에 그대로 나옵니다(`/portfolio#헬스장`처럼 해시로 시작 가능).
- 사례를 바꾸면 사례 릴 영상도 다시 만듭니다(`scripts/make-reel.py` 또는 `scripts/record-reel.mjs`, docs/photo-pipeline.md).
- 업종별 제안서 PDF는 같은 파일의 `proposals` 배열과 `public/assets/proposals/`에서 관리합니다.
- 가격, 관리 요금, 진행 단계, 차별점 문구는 `data/offer.ts`에서 고칩니다.

리허설(2026-09-16): 임시 항목을 추가하자 `/portfolio`의 카드 수와 필터 탭이 코드 수정 없이 반영되는 것을 확인했습니다. 확인 후 되돌렸습니다.
