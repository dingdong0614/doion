@AGENTS.md

## doion 사이트 안내
- 사이트: doion(도이온) 자체 사이트 (소규모 매장 웹사이트 제작·관리 대행)
- GitHub: dingdong0614/doion (origin). 기본 브랜치: main. 옛 정적 사이트는 legacy-static 브랜치
- 라이브: https://doion.co.kr. Vercel 프로젝트: doion (함수 리전 icn1, vercel.json)
- 스택: Next 16.3.6 (App Router) + React 19 + TypeScript + Tailwind, GSAP, Lenis, @vercel/analytics. 서체 Pretendard Variable 서브셋
- 빌드·로컬 확인: npm run dev (localhost:3000), npm run build, npm run lint
- 배포: 기본 브랜치(main)에 push하면 Vercel 자동 배포(수동 vercel deploy는 저장소와 어긋나므로 쓰지 않음). 미리보기 브랜치 배포는 Vercel 로그인 보호. push는 대표 요청·승인 후에만.
- 폰트·문구 변경 시: 문구를 바꾸면 scripts/critical-chars.py 다음 scripts/font-subset.py (docs/font-subset.md 참고). 사례 사진은 scripts/tone.py, 히어로 휴대폰 영상은 scripts/make-hero-video.py 다음 scripts/hero-poster.py
- 검사 스크립트: scripts/verify.py (배포 전 자동 검사: 긴 대시·이모지, 콘솔 에러, 가로 넘침, 터치 영역 48px 등. Playwright 필요)
- 건드리면 안 되는 것: 대표가 확정한 디자인(웜 오프화이트, 얇은 제목, 실사 사진, 글로우 금지)은 유지하고 "최신화"는 내용만 바꿈. data/portfolio.ts의 published:false 항목(빠둠뮤직)은 대표 확인 전 공개 금지. 원격 wip/live-feedback, design/signboard 브랜치는 옛 작업본이라 확인 없이 main에 병합 금지. AGENTS.md는 Next가 자동 생성하므로 수정하지 않음
- 자료: docs/status.md(현황), docs/portfolio-guide.md, docs/env.md
- 공통 규칙: doion 공통 규칙은 doion 프로젝트 메모리(제작 방식·실무표준)를 따름.
