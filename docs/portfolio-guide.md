# 포트폴리오 사례 추가하기

코드 수정 없이 **데이터 한 항목 + 이미지 한 장**으로 끝납니다.

1. 썸네일을 `public/assets/portfolio/`에 넣습니다. 가로형(약 2:1, 가로 1600px 안팎) JPG를 권장하며, 파일명은 영문으로 씁니다.
2. `data/portfolio.ts`의 `items` 배열에 항목을 하나 추가합니다.

```ts
{
  name: "매장 이름",
  category: "뷰티샵",          // 필터 탭에 그대로 나옴. 새 이름을 쓰면 탭이 자동으로 생김
  summary: "한두 문장 설명",
  href: "https://라이브주소",   // 없으면 생략
  thumb: "/assets/portfolio/파일명.jpg",
  demo: false,                 // 영업용 데모면 true → '영업용 데모' 표시
  published: true,             // 고객 공개 동의 전이면 false → 화면에 안 나옴
  order: 9,                    // 작을수록 앞. 홈에는 앞 6개만 나옴
},
```

3. `npm run dev`로 `/`와 `/portfolio`를 확인한 뒤 배포합니다.

- 카드 크기는 개수에 맞춰 자동으로 배치되므로 손댈 필요가 없습니다.
- 업종별 제안서 PDF는 같은 파일의 `proposals` 배열과 `public/assets/proposals/`에서 관리합니다.
- 가격, 관리 요금, 진행 단계, 차별점 문구는 `data/offer.ts`에서 고칩니다.

리허설(2026-09-16): 임시 항목을 추가하자 `/portfolio`의 카드 수와 필터 탭이 코드 수정 없이 반영되는 것을 확인했습니다. 확인 후 되돌렸습니다.
