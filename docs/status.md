# 리워크 현황 (지시서 15번 결정·확인 항목)

마지막 갱신: 2026-09-26. 운영 중: https://doion.co.kr (GitHub `dingdong0614/doion` main → Vercel 자동 배포. 이전 정적 사이트는 `legacy-static` 브랜치).

| 항목 | 결정·현황 |
|---|---|
| 스택 | **Next.js 16 (App Router) + TypeScript**. `vercel.json`에서 framework를 nextjs로 고정(프로젝트 설정이 정적으로 남아 첫 배포가 404였음) |
| 디자인 방향 | 지시서의 다크 네이비·골드·세리프·글로우는 대표 피드백("구림", 글로우 금지)으로 폐기. 30곳 리서치(`docs/research.md`) 기반 웜 오프화이트 + 얇은 제목 + 실사 사진 + 맨 스크린샷으로 확정. 다크 테마는 토글로 제공 |
| 포트폴리오 공개 목록 | 기존 사이트 표기 그대로: 실사례 8곳(뭐무까~, 피티홀릭짐, 관악중앙교회, 그린중고가전, 빠둠뮤직, 키훈, 장안설비대장, 체대입시 기록판), 영업용 데모 2곳(온담요양원, 다솜교회). 서면 동의는 [확인 필요] |
| 로고·브랜드 색 | 기존 PNG 로고 사용(SVG 원본 [확인 필요]). 포인트 색은 로고 다이아몬드 파랑 #2F5FA8 |
| 애널리틱스 | **Vercel Web Analytics(쿠키 없음)** 연결. 처리방침에 명시. GA는 미사용 |
| WebGL 히어로 | 미사용 |
| 문의 폼 백엔드 | 서버 검증·honeypot·IP 횟수 제한(KV) 후, `RESEND_API_KEY`가 없어 **브라우저에서 Web3Forms로 발송**(기존 사이트와 같은 키). 수신 주소가 ceo@doion.co.kr인지 Web3Forms 대시보드에서 [확인 필요]. Resend 키를 넣으면 자동으로 서버 발송(ceo@)으로 전환 |
| 교회·요양원 | 데모로만 표기, JSON-LD에는 역량(knowsAbout)으로만 |
| 사진 | Unsplash 임시 사진 → 대표 촬영본 교체 [확인 필요] |

## 지시서 대비 적용 안 한 것과 이유
- GSAP·Lenis·Framer Motion·reactbits: 대표가 스크롤 연출·글로우를 반대했고, 모바일 성능이 우선이라 CSS만 사용(카운트업 1개, 호버, 모션 줄이기 토글).
- 벤토 hover 글레어·골드 글로우: 글로우 금지 피드백.
- 사례 상세 페이지(비포·애프터): 비포 자료가 없어 라이브 링크로 대체. 자료가 생기면 추가.
- 포트폴리오 태그(NFC/QR·월관리): 어떤 고객이 쓰는지 확인된 데이터가 없어 필드를 두지 않음.

## 실측 (2026-09-16, 로컬 프로덕션 빌드, Lighthouse 12 모바일)
- 홈 성능 68(데스크톱 97), 사례 87, 가격 84, 문의 88. 접근성·권장사항·SEO 전 페이지 100. CLS 0~0.001.
- 목표 90 미달 원인: 한글 웹폰트(Wanted Sans) 조각 로딩에 따른 레이아웃 재계산. 본문을 시스템 서체로 바꾸면 78~81이지만 Windows에서 가독성이 떨어져 보류.
- axe 위반 0(6페이지 × 라이트·다크), `npm audit` 0건.

## 2026-09-26 내용 최신화 (디자인·레이아웃 변경 없음)
대표 결정: 9/16~17에 확정한 디자인 골격(웜 오프화이트·얇은 제목·실사 사진, 글로우 금지)은 그대로 두고, 9/17 이후 바뀐 사실만 반영.
- `data/portfolio.ts` 뭐무까 요약: "자연과학캠퍼스 도보권 맛집 166곳" → 캠퍼스 11곳·맛집 859곳(2026-09-20 라이브 기준: 자과캠 87·인문캠 119·경희대 국제캠 101·아주대 91·고려대 69·서울대 71·이화여대 85·인하대 68·중앙대 57·한양대 57·연세대 54), 학교색·설치형 웹앱·한/영 전환·영업 중/도보 거리순 정렬·스꾸패스 혜택. 가격 정렬 표현은 priceLevel 누락분이 있어 뺌.
- `app/page.tsx` JSON-LD knowsAbout에 "대학가 맛집 웹앱", "설치형 웹앱(PWA) 제작" 추가.
- `app/portfolio/page.tsx` 메타 설명에 "대학가 맛집 웹앱" 추가.
- `public/llms.txt`에 "대표 제작 사례"(뭐무까) 항목 추가.
- 확인만 하고 그대로 둔 것: 가격(제작 30·60·80만, 관리 5·10·13만, 1년 고정)은 공통 기준과 일치. 업종별 제안서 6종은 파일과 목록 일치. 홈 "사례 N개"는 portfolio 배열 길이로 자동 계산(현재 8). 홈 실적 지표(statDefaults)는 KV로 덮이는 값이라 손대지 않음. sitemap lastModified는 빌드 시각이라 배포하면 자동 갱신.
- 남은 일: 포트폴리오 5곳(장안설비대장·피티홀릭짐·체대입시·온담요양원·다솜교회)은 새 디자인으로 리워크됐으나 미배포라, 배포 후 실제 화면으로 캡처 교체 예정. 뭐무까 모바일 캡처(`sungdae-m.jpg`, 현재 자과캠 87곳 화면)도 다캠퍼스가 보이는 화면으로 교체 검토(클라우드에서 접속 차단돼 Chrome으로 캡처 예정).

## 2026-09-29 "간판 다음" 디자인 이식 (브랜치 design/signboard, 미배포)
- 대표 지시 "도이온 웹사이트 100점으로 만들어": 채점표(100점, 50항목) 기준으로 시안 "간판 다음"을 본 사이트에 이식. push·배포는 대표 승인 후.
- 서체 Wanted Sans → Pretendard Variable(얇은 제목 250 때문). 폰트 2단계 로딩(docs/font-subset.md).
- 스택 추가: GSAP 3.15(ScrollTrigger, CustomEase, 첫 입력 때 동적 import), Lenis 1.3(첫 입력 때 동적 import). lucide-react 제거(자체 아이콘). Next 16.3.6.
- 새 파일: app/template.tsx(페이지 전환), app/not-found.tsx(404), components/Loader·Cursor·Transition·PageMotion·SignStrip·Reel·PriceDoc·PageHead·PortfolioIndex·Light·Icon·FontFallback, scripts/tone.py·make-reel.py·record-reel.mjs·critical-chars.py·font-subset.py, docs/photo-pipeline.md.
- 뺀 것: 다크 테마 토글, 홈 실적 숫자 줄(Ledger, /api/stats·admin은 그대로 둠), 부채꼴 사례, 사례 모자이크, 업종 칩 줄(상담 폼 업종 선택으로 이동), 홈 NFC 번호 3단계(본문 한 단락으로).
- 보안 헤더 4종 추가(next.config.ts headers). 상담 폼 API·rate limit·처리방침·301·IndexNow 키·네이버 인증은 그대로.
- 2026-09-29 독립 채점(정보수집팀 91점) 반영: 첫 화면 상호 띠 작게, 풀블리드를 장안설비대장 캡처로, 제목 줄바꿈(text-wrap balance·쉼표 간격), 사진 무채색 고정(원색은 데스크톱 호버만), /portfolio 사진 load 뒤, 첫 화면 폰트 data URI, 동의 링크 48px, 390 가격 비교표 목록형, 처리방침 localStorage 문구, 긴 대시 제거, 검사 스크립트 scripts/verify.py.
- 2026-09-29 대표 휴대폰 피드백 반영(대표 결정이 채점표·브리프보다 우선): 상호 띠 글자 자르지 않음, 사진·영상 원색 기본(흑백 연출 폐기), 히어로에 고객 사이트 휴대폰 3대(가운데 60fps 영상), 커스텀 커서 제거, 글자 크기 전체 축소(히어로 첫 줄 최대 96px, display 최대 92px, h2 최대 44px, 본문 16px), 저해상도 풀블리드 캡처·데스크톱 DPR 1 캡처 제거, /portfolio 미리보기 표시 폭 390px 상한(원본 780px, 레티나 선명), 저프레임 사례 릴(뭐무까) 제거하고 뭐무까는 선명한 정지 화면, 히어로 가운데 60fps 영상(scripts/make-hero-video.py, 486프레임 8.1초).
- 2026-09-30 대표 지시: 사례에 관악중앙교회(gajach-web.vercel.app, gajach.org는 아직 기존 사이트라 새 사이트 주소로 연결)와 그린중고가전(green-jungogaejeon.vercel.app) 추가. 히어로 휴대폰은 왼쪽 뭐무까~, 가운데 관악중앙교회(60fps 영상), 오른쪽 피티홀릭짐. 캡처는 대표 PC Playwright(390x844 DPR 2).
- 2026-09-30 정보수집팀 3차 검수 10건 반영: 영상 버튼 자리 미리 확보(5초 뒤 밀림 0), 가운데 포스터를 홈 전용 CSS의 WebP data URI로(app/hero-poster.css, scripts/hero-poster.py), 홈 하단 고정 바는 히어로 버튼이 화면 위로 나간 뒤에만(components/MobileBar.tsx), 피티홀릭 휴대폰은 가격 배지 없는 운영 시간 구간 캡처, 휴대폰 묶음 390 기준 340px·겹침 8%, /portfolio 390은 글 왼쪽·사진 오른쪽 작은 칸, PC 사례 고정 구간 화면 약 2.4개, PC 히어로 둘째 줄 들여쓰기, 상호 띠 CSS로 천천히 흐름(폭 전체), 캡션 14px·본문 회색 줄임, __pycache__ 저장소에서 제외.
