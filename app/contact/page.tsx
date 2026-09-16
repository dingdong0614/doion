import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LiveStatus from "@/components/LiveStatus";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "무료 상담 신청",
  description: "수원 율전동 doion에 웹사이트 제작 무료 상담을 신청하세요. 대표가 직접 연락드립니다. 010-9786-2433 · ceo@doion.co.kr",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="hero wrap">
      <div className="split top">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <h1 className="title-lg">
            무료 상담 <span className="dim">신청.</span>
          </h1>
          <p className="lead">간단히 남겨주시면 대표가 직접 연락드립니다. 전화가 편하시면 바로 걸어주세요.</p>
          <LiveStatus />
          <dl style={{ display: "grid", gap: 14, marginTop: 12 }}>
            <div>
              <dt className="muted">전화</dt>
              <dd>
                <a className="link" href={`tel:${site.phone.replaceAll("-", "")}`}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="muted">이메일</dt>
              <dd>
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="muted">지역</dt>
              <dd>수원 율전동 중심, 수원 전역</dd>
            </div>
          </dl>
        </div>
        <div className="form-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
