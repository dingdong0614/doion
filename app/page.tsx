import Link from "next/link";
import { CalendarCheck, ChevronRight, MessagesSquare, PencilRuler, ShieldCheck } from "lucide-react";
import { Laptop, Phone } from "@/components/Device";
import WorkTile, { spansFor } from "@/components/WorkTile";
import Ledger from "@/components/Ledger";
import LiveStatus from "@/components/LiveStatus";
import { portfolio } from "@/data/portfolio";
import { buildPlans, carePlans, reasons, steps } from "@/data/offer";
import { site } from "@/lib/site";

const HOME_TILES = 7;
const reasonIcons = [PencilRuler, MessagesSquare, CalendarCheck, ShieldCheck];

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
  const hero = portfolio.find((p) => p.name === "피티홀릭짐")!;
  const heroPhone = portfolio.find((p) => p.name === "뭐무까~")!;
  const tiles = portfolio.slice(0, HOME_TILES);
  const spans = spansFor(tiles.length);
  const [nfc, ...rest] = reasons;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. 히어로: 카피 + 실제 고객 사이트 */}
      <section className="hero2 wrap center">
        <h1 className="title-xl">
          간판 다음으로,
          <br />
          손님이 보는 곳.
        </h1>
        <p className="lead">
          인스타그램을 보고 온 손님이 가격·위치·예약을 한 화면에서 찾게 만듭니다. 수원 율전동에서 만들고, 만든 뒤에도 매달
          관리합니다.
        </p>
        <div className="hero-cta" style={{ marginTop: 28 }}>
          <Link href="/contact" className="btn btn-primary">
            무료 상담 신청
          </Link>
          <Link href="/portfolio" className="btn btn-ghost">
            포트폴리오 보기
          </Link>
        </div>
        <LiveStatus />

        <div className="stage">
          <Laptop src={hero.desktop!} alt={`${hero.name} 사이트 데스크톱 화면`} sizes="(max-width: 1100px) 88vw, 950px" preload />
          <Phone src={heroPhone.mobile!} alt={`${heroPhone.name} 웹앱 모바일 화면`} sizes="(max-width: 620px) 30vw, 220px" />
        </div>
        <Ledger />
      </section>

      {/* 2. 사례 타일 */}
      <section className="section wrap" aria-labelledby="work-title">
        <div className="section-head row">
          <h2 id="work-title" className="title-lg">
            업종에 맞춰
            <br />
            만든 사이트.
          </h2>
          <Link href="/portfolio" className="more">
            사례 {portfolio.length}개 모두 보기 <ChevronRight size={18} aria-hidden />
          </Link>
        </div>
        <div className="tiles">
          {tiles.map((item, i) => (
            <WorkTile key={item.name} item={item} span={spans[i]} />
          ))}
        </div>
      </section>

      {/* 3. NFC/QR — doion만의 차별점 */}
      <section className="wrap" aria-labelledby="nfc-title">
        <div className="band">
          <div>
            <h2 id="nfc-title" className="title-lg">
              휴대폰을 대면,
              <br />
              바로 우리 매장 페이지.
            </h2>
            <p>{nfc.body}</p>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: 28 }}>
              NFC/QR 설치 상담
            </Link>
          </div>
          <div className="band-visual" aria-hidden>
            <Phone src={hero.mobile!} alt="" sizes="230px" />
            <div className="tagcard">
              <span className="d" />
              <span className="waves">
                <b style={{ height: 6 }} />
                <b style={{ height: 11 }} />
                <b style={{ height: 16 }} />
              </span>
              <small>휴대폰을 대보세요</small>
            </div>
          </div>
        </div>
      </section>

      {/* 4~5. 밝은 띠: 이유 + 진행 */}
      <div className="flip" style={{ marginTop: "clamp(72px, 10vw, 140px)" }}>
      <section className="section wrap" aria-labelledby="why-title">
        <div className="section-head">
          <h2 id="why-title" className="title-lg">
            도이온에 맡기면
            <br />
            좋은 이유.
          </h2>
        </div>
        <ul className="why">
          {rest.map((r, i) => {
            const Icon = reasonIcons[i];
            return (
              <li key={r.title}>
                <Icon size={30} strokeWidth={1.6} aria-hidden />
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 5. 진행 */}
      <section className="section wrap" aria-labelledby="process-title" style={{ paddingTop: 0 }}>
        <div className="section-head row">
          <h2 id="process-title" className="title-lg">
            상담부터 운영까지,
            <br />네 단계.
          </h2>
          <Link href="/process" className="more">
            진행 방식 자세히 <ChevronRight size={18} aria-hidden />
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
      </div>

      {/* 6. 가격 라인업 */}
      <section className="section wrap center" aria-labelledby="price-title">
        <h2 id="price-title" className="title-lg" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
          가격은 처음부터
          <br />
          공개합니다.
        </h2>
        <div className="lineup">
          {buildPlans.map((p) => (
            <div key={p.name}>
              {p.recommended && <span className="rec-label">추천</span>}
              <h3 className="h3" style={{ marginTop: p.recommended ? 10 : 0 }}>
                {p.name}
              </h3>
              <p className="price">
                {p.price}
                <small>만원</small>
              </p>
              <p className="muted">{p.features.slice(-2).join(" · ")}</p>
            </div>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 40 }}>
          만든 뒤 관리는 월 {carePlans.map((c) => c.price).join("·")}만원. 관리비는 최소 1년간 고정, VAT 별도.
        </p>
        <Link href="/pricing" className="more" style={{ marginTop: 8 }}>
          패키지 구성 비교 <ChevronRight size={18} aria-hidden />
        </Link>
      </section>

      {/* 7. 마무리 CTA */}
      <section className="wrap" aria-labelledby="cta-title">
        <div className="cta-band center" style={{ justifyItems: "center" }}>
          <h2 id="cta-title" className="title-lg">
            매장 이야기부터
            <br />
            들려주세요.
          </h2>
          <p className="muted" style={{ maxWidth: "30em" }}>
            어떤 손님이 오는지, 지금 어디서 문의가 끊기는지. 상담은 무료이고, 대표가 직접 연락드립니다.
          </p>
          <div className="hero-cta" style={{ marginTop: 0, justifyContent: "center" }}>
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
