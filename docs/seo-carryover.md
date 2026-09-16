# SEO 자산 이어받기 체크

| 항목 | 새 사이트에서 | 상태 |
|---|---|---|
| IndexNow 키 파일 | `public/cce6ed560d2835e73f311f296b9cfaa0.txt` (내용 동일) | 로컬 200 ✓ |
| 네이버 서치어드바이저 메타 | `lib/site.ts` `naverVerification` → `app/layout.tsx` `metadata.verification.other` | `<head>`에 출력 ✓ |
| 구글 서치콘솔 | DNS TXT 인증이라 코드와 무관. **DNS 레코드 건드리지 말 것** | 유지 |
| JSON-LD | 홈(`app/page.tsx`) `ProfessionalService`. email ceo@doion.co.kr, telephone, areaServed 수원시·율전동·천천동, priceRange ₩300,000~₩800,000 | ✓ |
| robots.txt | `app/robots.ts`. `/admin.html`, `/api/` 차단 + `Sitemap:` 지시어 | ✓ |
| sitemap.xml | `app/sitemap.ts`. 새 경로(확장자 없음) 6개 | ✓ |
| canonical·title·description | 페이지마다 `metadata` | ✓ |
| OG 이미지 | 기존 `/assets/og-image.png` 1200×630 재사용 | ✓ |

## 기존 대비 바뀐 점

- JSON-LD `@type`: 기존 사이트는 실제로 `Organization`이었고 email이 없었음 → 지시서대로 `ProfessionalService` + email ceo@로 바꿈.
- 교회·요양원은 `knowsAbout`에 역량으로만 넣음. 포트폴리오에서는 "영업용 데모"로 표기.
- sitemap URL이 `.html` → 확장자 없는 경로로 바뀜. 옛 URL은 301로 넘어감.

## 배포 직후 할 일

1. 서치콘솔·서치어드바이저에 새 `sitemap.xml` 다시 제출.
2. IndexNow 재제출 (클라우드에서 막히면 로컬에서 실행):

```bash
curl -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json; charset=utf-8" -d '{
  "host": "doion.co.kr",
  "key": "cce6ed560d2835e73f311f296b9cfaa0",
  "keyLocation": "https://doion.co.kr/cce6ed560d2835e73f311f296b9cfaa0.txt",
  "urlList": ["https://doion.co.kr/","https://doion.co.kr/portfolio","https://doion.co.kr/pricing","https://doion.co.kr/process","https://doion.co.kr/contact","https://doion.co.kr/privacy"]
}'
```

3. 옛 `.html` URL 301 확인 (`docs/redirects.md`).
