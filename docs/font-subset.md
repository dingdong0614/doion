# 폰트 서브셋 (2026-09-29, Pretendard Variable로 전환)

서체는 Pretendard Variable(OFL) 한 종. 얇은 제목(굵기 250·300·350)이 필요해 굵기 축이 400부터인 Wanted Sans Variable에서 바꿨다.
쓰는 굵기: 250(display), 300(h2), 350(선언문), 400(본문), 500(캡션·버튼), 800(상호 띠).

## 파일 세 단계
1. `app/fonts/PretendardCritical.woff2`: 페이지마다 첫 화면에 보이는 글자(`app/fonts/critical-chars.txt`) + ASCII만. next/font/local로 preload(약 56KB).
2. `public/fonts/PretendardSubset.woff2`: 사이트 소스(app, components, data, lib)에 쓰인 글자 전부(약 109KB). `components/FontFallback.tsx`가 load 뒤 한가할 때 FontFace로 붙인다.
3. `public/fonts/pretendard/`: Pretendard Variable 조각 폰트 92개(npm pretendard 1.3.9 dist/web/variable). 2까지에도 없는 글자(폼에 입력하는 글자 등)만 받는다. 2가 붙고 3초 뒤 스타일시트를 붙인다.

CSS 순서: `--font: var(--font-first), "Pretendard Subset", "Pretendard Variable", "Pretendard Fallback", 시스템 서체`.

## 다시 생성하는 법(문구를 바꿨을 때)
1. `pip install fonttools brotli playwright` (한 번만)
2. `npm run build && npm run start` 로 사이트를 띄운다.
3. `python3 scripts/critical-chars.py http://localhost:3000` : 첫 화면 글자를 `app/fonts/critical-chars.txt`로 저장(처리방침은 제외).
4. `python3 scripts/font-subset.py <PretendardVariable.ttf>` : 원본 ttf는 npm 패키지 pretendard의 `dist/public/variable/PretendardVariable.ttf`. 굵기 축을 200~800으로 줄이고 1·2 파일을 만든다.
5. 다시 빌드. 빠진 글자가 있어도 다음 단계 폰트가 채우므로 깨지지는 않는다.
