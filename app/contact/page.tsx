import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LiveStatus from "@/components/LiveStatus";
import PageHead from "@/components/PageHead";
import { og, site, tel } from "@/lib/site";

export const metadata: Metadata = {
  title: "무료 상담 신청",
  description: "수원 율전동 doion에 웹사이트 제작 무료 상담을 신청하세요. 대표가 직접 연락드립니다. 010-9786-2433 · ceo@doion.co.kr",
  alternates: { canonical: "/contact" },
  openGraph: og("/contact"),
};

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

export default function ContactPage() {
  return (
    <>
      <PageHead a="무료 상담" b="신청." capL="상담" capR={site.region} align="left">
        <div style={col("13 / 25")} className="measure">
          <p>간단히 남겨주시면 대표가 직접 연락드립니다. 전화가 편하시면 바로 걸어주세요.</p>
          <div style={{ marginTop: 12 }}>
            <LiveStatus />
          </div>
        </div>
      </PageHead>

      {/* 전화·이메일·지역을 먼저, 그 아래 전체 폭 폼 */}
      <section className="g contact" aria-label="상담 신청 양식" style={{ paddingTop: 64 }}>
        <dl className="sub info" style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
          <div style={col("1 / 9", "1 / 4")}>
            <dt>전화</dt>
            <dd>
              <a className="ul" href={tel}>
                {site.phone}
              </a>
            </dd>
          </div>
          <div style={col("9 / 17", "4 / 7")}>
            <dt>이메일</dt>
            <dd>
              <a className="ul" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div style={col("17 / 25")}>
            <dt>지역</dt>
            <dd>수원 율전동 중심, 수원 전역</dd>
          </div>
        </dl>
        <ContactForm />
      </section>
    </>
  );
}
