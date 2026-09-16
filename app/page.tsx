import Link from "next/link";
import { Check } from "lucide-react";
import WorkCard from "@/components/WorkCard";
import Ledger from "@/components/Ledger";
import LiveStatus from "@/components/LiveStatus";
import { portfolio } from "@/data/portfolio";
import { buildPlans, carePlans, reasons, steps } from "@/data/offer";
import { site } from "@/lib/site";

// 홈 벤토: 앞 6개 사례를 크기 다르게 배치
const spans = ["span-xl", "span-md", "span-md", "span-sm", "span-sm", "span-sm"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  alternateName: "도이온",
  url: `${site.url}/`,
  logo: `${site.url}/assets/logo-dark.png`,
  image: `${site.url}/assets/og-image.png`,
  email: site.email,
  telephone: site.phone,
  priceRange: "₩300,000~₩800,000",
  description:
    "소규모 매장을 위한 웹사이트 제작·관리 대행 서비스. 헬스장, 뷰티샵, 학원 등 업종별 맞춤 웹사이트를 제작하고 NFC/QR 태그 연동과 월 관리를 제공합니다.",
  areaServed: [
    { "@type": "City", name: "수원시" },
    { "@type": "Place", name: "율전동" },
    { "@type": "Place", name: "천천동" },
  ],
  knowsAbout: [
    "웹사이트 제작",
    "헬스장 웹사이트 제작",
    "뷰티샵 홈페이지 제작",
    "네일샵 홈페이지 제작",
    "학원 홈페이지 제작",
    "매거진 홈페이지 제작",
    "소규모 매장 홈페이지 제작",
    "웹사이트 관리 대행",
    "NFC/QR 태그 연동",
    "수원 웹사이트 제작",
    "교회 홈페이지 제작",
    "요양원 홈페이지 제작",
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero wrap">
        <h1 className="display">
          <span className="line">
            <span>간판 다음으로</span>
          </span>
          <span className="line">
            <span>
              손님이 보는 곳<span className="hero-mark" aria-hidden />
            </span>
          </span>
        </h1>
        <div className="fade-in">
          <p className="lead" style={{ marginTop: 24 }}>
            인스타그램을 보고 온 손님이 가격·위치·예약을 한 화면에서 찾게 만듭니다. 수원 율전동에서 헬스장·뷰티샵·학원
            웹사이트를 만들고, 만든 뒤에도 매달 관리합니다.
          </p>
          <div className="hero-cta">
            <Link href="/contact" className="btn btn-primary">
              무료 상담 신청
            </Link>
            <Link href="/portfolio" className="btn btn-ghost">
              포트폴리오 보기
            </Link>
            <span style={{ marginLeft: 8 }}>
              <LiveStatus />
            </span>
          </div>
          <div className="hero-foot">
            <Ledger />
          </div>
        </div>
      </section>

      <section className="wrap" aria-labelledby="work-title" style={{ paddingTop: 16 }}>
        <div className="section-head row">
          <h2 id="work-title" className="h2">
            업종이 다르면
            <br />
            사이트도 달라야 하니까
          </h2>
          <Link href="/portfolio" className="link">
            사례 {portfolio.length}개 모두 보기
          </Link>
        </div>
        <div className="bento">
          {portfolio.slice(0, spans.length).map((item, i) => (
            <WorkCard key={item.name} item={item} span={spans[i]} priority={i === 0} />
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="why-title">
        <div className="split">
          <div className="sticky section-head">
            <h2 id="why-title" className="h2">
              맡기면
              <br />
              이런 게 달라집니다
            </h2>
            <p className="lead">저렴한 견적서 한 장이 아니라, 만든 다음 해에도 연락되는 제작사를 고르시는 거예요.</p>
          </div>
          <ul className="reason-list">
            {reasons.map((r, i) => (
              <li key={r.title} className={i === 0 ? "reason-lead" : undefined}>
                <div>
                  <h3 className="h3">{r.title}</h3>
                  <p>{r.body}</p>
                </div>
                {i === 0 && (
                  <div className="tagcard" aria-hidden>
                    <span className="d" />
                    <span className="waves">
                      <b style={{ height: 6 }} />
                      <b style={{ height: 11 }} />
                      <b style={{ height: 16 }} />
                    </span>
                    <small>휴대폰을 대보세요</small>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wrap rule-top" aria-labelledby="process-title">
        <div className="section-head row">
          <h2 id="process-title" className="h2">
            상담부터 운영까지
            <br />네 단계
          </h2>
          <Link href="/process" className="link">
            진행 방식 자세히
          </Link>
        </div>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.title}>
              <h3 className="h3">{s.title}</h3>
              <p>{s.body}</p>
              {s.time && <span className="time">{s.time}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap rule-top" aria-labelledby="price-title">
        <div className="section-head row">
          <h2 id="price-title" className="h2">가격은 처음부터 공개합니다</h2>
          <Link href="/pricing" className="link">
            패키지 구성 비교
          </Link>
        </div>
        <div className="price-strip">
          {buildPlans.map((p) => (
            <div key={p.name}>
              <p className="muted">{p.name}</p>
              <p className="num" style={{ fontSize: "clamp(2.2rem, 1.8rem + 1.5vw, 3rem)", fontWeight: 700, lineHeight: 1.2 }}>
                {p.price}
                <span style={{ fontSize: "0.45em", marginLeft: 4 }}>만원</span>
              </p>
              <p className="note">{p.features.slice(-1)[0]}</p>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Check size={18} aria-hidden style={{ flex: "none", marginTop: 3, color: "var(--accent-text)" }} />
          만든 뒤 관리는 월 {carePlans.map((c) => c.price).join("·")}만원 세 가지. 관리비는 최소 1년간 고정됩니다. VAT 별도.
        </p>
      </section>

      <section className="wrap" aria-labelledby="cta-title">
        <div className="cta-band">
          <h2 id="cta-title" className="h2">
            매장 이야기부터
            <br />
            들려주세요
          </h2>
          <p className="muted" style={{ maxWidth: "34em" }}>
            어떤 손님이 오는지, 지금 어디서 문의가 끊기는지. 상담은 무료이고, 대표가 직접 연락드립니다.
          </p>
          <div className="hero-cta" style={{ marginTop: 0 }}>
            <Link href="/contact" className="btn btn-primary">
              무료 상담 신청
            </Link>
            <a href={`tel:${site.phone.replaceAll("-", "")}`} className="btn btn-ghost">
              전화 {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
