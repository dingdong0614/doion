# 환경변수

값은 Vercel 프로젝트 Settings → Environment Variables에만 넣습니다. 코드·문서·채팅에는 적지 않습니다. `.env*`는 gitignore 처리돼 있습니다.

| 이름 | 필수 | 용도 | 없으면 |
|---|---|---|---|
| `RESEND_API_KEY` | 운영 필수 | 상담 신청 알림 메일 발송 | 개발: 콘솔 로그만 남김 / 운영: 신청 시 "전화 주세요" 오류(조용히 유실되지 않게) |
| `CONTACT_FROM` | 선택 | 보내는 주소. 기본값 `doion 상담 신청 <noreply@doion.co.kr>` | 기본값 사용. **Resend에서 doion.co.kr 도메인 인증이 필요** |
| `CONTACT_TO` | 선택 | 받는 주소. 기본값 `ceo@doion.co.kr` | 기본값 사용 |
| `KV_REST_API_URL` | 권장 | KV(Upstash Redis): 관리자 상태·실적 지표 저장, 신청 횟수 제한 | 상태·지표는 기본값으로 표시되고, 횟수 제한은 인스턴스 메모리로 대체 |
| `KV_REST_API_TOKEN` | 권장 | 위와 같음 | 위와 같음 |
| `ADMIN_TOKEN` | 관리자 사용 시 | `/admin.html` 로그인 비밀번호 | 관리자 저장 불가(401) |

기존 doion 프로젝트에 KV·ADMIN_TOKEN이 이미 있으면 같은 값을 새 프로젝트에도 연결하면 됩니다. `NEXT_PUBLIC_` 접두사는 쓰지 않습니다.
