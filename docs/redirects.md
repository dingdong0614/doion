# 301 리다이렉트 표

설정 위치: `next.config.ts` `redirects()` (statusCode 301). 표와 코드를 함께 고칠 것.

| 기존 URL | 새 URL | 확인(로컬 dev, 2026-09-16) |
|---|---|---|
| /index.html | / | 301 ✓ |
| /pricing.html | /pricing | 301 ✓ |
| /portfolio.html | /portfolio | 301 ✓ |
| /process.html | /process | 301 ✓ |
| /contact.html | /contact | 301 ✓ |
| /privacy.html | /privacy | 301 ✓ |

그대로 유지되는 경로(리다이렉트 없음):

- `/admin.html` (관리자 페이지, public에 원본 복사)
- `/assets/**` (로고·파비콘·OG 이미지·포트폴리오 썸네일·제안서 PDF, 기존 경로와 동일)
- `/cce6ed560d2835e73f311f296b9cfaa0.txt` (IndexNow 키)
- `/robots.txt`, `/sitemap.xml` (이제 `app/robots.ts`, `app/sitemap.ts`가 생성)

배포 후 확인:

```bash
for p in index pricing portfolio process contact privacy; do
  curl -s -o /dev/null -w "/$p.html %{http_code} -> %{redirect_url}\n" https://doion.co.kr/$p.html
done
```
