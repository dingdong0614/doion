// 문의 폼 검증 — 클라이언트와 서버가 같은 함수를 씀.
export const industries = ["헬스장·피트니스", "뷰티샵·미용실", "학원·교육", "교회·종교시설", "요양원·요양시설", "음식점·카페", "기타"];

export type Inquiry = { shop: string; name: string; phone: string; industry: string; message: string; consent: boolean };
export type Errors = Partial<Record<keyof Inquiry, string>>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validate(raw: Record<string, unknown>): { data: Inquiry; errors: Errors } {
  const data: Inquiry = {
    shop: str(raw.shop).slice(0, 60),
    name: str(raw.name).slice(0, 30),
    phone: str(raw.phone).slice(0, 20),
    industry: str(raw.industry),
    message: str(raw.message).slice(0, 1000),
    consent: raw.consent === true || raw.consent === "on",
  };
  const errors: Errors = {};
  if (!data.shop) errors.shop = "매장 이름을 적어주세요.";
  if (!data.name) errors.name = "담당자 이름을 적어주세요.";
  if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(data.phone)) errors.phone = "연락 가능한 번호를 010-0000-0000 형식으로 적어주세요.";
  if (!industries.includes(data.industry)) errors.industry = "업종을 골라주세요.";
  if (!data.consent) errors.consent = "상담 연락을 위해 개인정보 수집·이용 동의가 필요합니다.";
  return { data, errors };
}
