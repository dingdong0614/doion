import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileText, Phone } from "lucide-react";
import FanTilt from "@/components/FanTilt";
import CaseMosaic from "@/components/CaseMosaic";
import Ledger from "@/components/Ledger";
import LiveStatus from "@/components/LiveStatus";
import { portfolio, categories } from "@/data/portfolio";
import { buildPlans, carePlans, reasons, steps } from "@/data/offer";
import { site } from "@/lib/site";

const HOME_CASES = 7;
const tel = `tel:${site.phone.replaceAll("-", "")}`;

// 홈 칩: 사례 페이지에 있는 업종만 (디렉토리는 제외하고 상담 칩을 끝에)
const chipCategories = categories.filter((c) => c !== "디렉토리");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  alternateName: "도이온",
  url: `${site.url}/`,
  logo: `${site.url}/assets/logo-dark.png`,
  image: `${site.url}/assets/og-2026.png`,
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

function find(name: string) {
  return portfolio.find((p) => p.name === name)!;
}

export default function Home() {
  const fan = [find("체대입시 실기 기록판"), find("피티홀릭짐"), find("빠둠뮤직 보컬 트레이닝 센터")];
  const [nfc, ...why] = reasons;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. 사진 히어로 */}
      <section className="photo-hero" aria-labelledby="hero-title">
        <Image src="/assets/photos/owner-phone.jpg" alt="" fill preload sizes="100vw" />
        <div className="shade" aria-hidden />
        <div className="inner wrap" style={{ paddingInline: "clamp(24px, 5vw, 64px)" }}>
          <h1 id="hero-title" className="title-xl">
            간판 다음으로,
            <br />
            손님이 보는 곳.
          </h1>
          <p className="lead">수원 율전동에서 동네 가게 홈페이지를 만들고, 만든 뒤에도 매달 관리합니다.</p>
          <div className="hero-cta">
            <Link href="/contact" className="btn btn-light">
              무료 상담 신청
            </Link>
            <Link href="/portfolio" className="more" style={{ color: "#fff" }}>
              포트폴리오 보기 <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <p className="reassure">상담은 무료이고, 대표가 직접 연락드립니다.</p>
        </div>
      </section>

      {/* 부채꼴: 실제로 만든 사이트 */}
      <div className="fan" aria-label="doion이 만든 사이트">
        <FanTilt />
        {fan.map((item, i) => (
          <figure key={item.name} className={i === 1 ? "mid" : `side ${i === 0 ? "l" : "r"}`}>
            <a className="card" href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} 사이트 열기 (새 창)`}>
              <Image className="d-shot" src={item.desktop!} alt="" fill sizes="(max-width: 700px) 1px, 760px" />
              <Image className="m-shot" src={item.mobile} alt="" fill sizes="(max-width: 700px) 46vw, 1px" />
              <span className="label" aria-hidden>
                <b>{item.name}</b>
                <span>
                  {item.category} <ArrowUpRight size={14} />
                </span>
              </span>
            </a>
          </figure>
        ))}
      </div>

      <section className="wrap" aria-label="실적" style={{ marginTop: "clamp(40px, 6vw, 72px)" }}>
        <Ledger />
      </section>

      {/* 2. 업종 칩 */}
      <section className="section wrap center" aria-labelledby="chips-title">
        <h2 id="chips-title" className="title-md" style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
          어떤 가게를 하고 계세요?
        </h2>
        <div className="chips">
          {chipCategories.map((c) => (
            <Link key={c} className="chip" href={`/portfolio#${encodeURIComponent(c)}`}>
              {c}
            </Link>
          ))}
          <Link className="chip outline" href="/contact">
            그 외 업종 상담
          </Link>
        </div>
      </section>

      {/* 3. 사례 모자이크 */}
      <section className="wrap" aria-labelledby="work-title">
        <div className="section-head row">
          <h2 id="work-title" className="title-lg">
            만든 사이트, <span className="dim">지금 열어볼 수 있어요.</span>
          </h2>
          <Link href="/portfolio" className="more">
            사례 {portfolio.length}개 모두 보기 <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <CaseMosaic items={portfolio.slice(0, HOME_CASES)} />
      </section>

      {/* 4. 2톤 문단 */}
      <section className="section wrap" aria-label="doion이 하는 일">
        <p className="title-lg statement" style={{ maxWidth: "20em" }}>
          {["사장님은 장사만 하세요.", "문구 수정,", "사진 교체,", "이벤트 페이지,", "태그 관리까지", "매달 저희가 챙깁니다."].map((w, i) => (
            <span key={w} className={i === 0 ? undefined : "ink"} style={{ "--i": i } as React.CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* 5. NFC/QR (짙은 구간) */}
      <section className="night" aria-labelledby="nfc-title">
        <div className="section wrap split">
          <div className="photo">
            <Image src="/assets/photos/nfc-tap.jpg" alt="휴대폰을 리더기에 대는 손" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div>
            <h2 id="nfc-title" className="title-lg">
              휴대폰을 대면, <span className="dim">바로 우리 가게 페이지.</span>
            </h2>
            <p className="lead" style={{ marginTop: 20 }}>
              {nfc.body}
            </p>
            <ol className="rows" style={{ marginTop: 36 }}>
              {["카운터·거울·입구에 태그를 붙입니다", "손님이 휴대폰을 대거나 QR을 찍습니다", "예약·후기·이벤트 페이지가 바로 열립니다"].map((t, i) => (
                <li key={t}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: 32 }}>
              NFC/QR 설치 상담
            </Link>
          </div>
        </div>
      </section>

      {/* 6. 맡기면 좋은 이유 */}
      <section className="section wrap" aria-labelledby="why-title">
        <div className="split top">
          <div className="sticky-desk">
            <div className="photo">
              <Image src="/assets/photos/owner-counter.jpg" alt="카운터 앞에 선 가게 사장님" fill sizes="(max-width: 860px) 100vw, 50vw" />
            </div>
          </div>
          <div>
            <h2 id="why-title" className="title-lg" style={{ marginBottom: 36 }}>
              맡기면 <span className="dim">이렇게 달라집니다.</span>
            </h2>
            <ul className="rows plain">
              {why.map((r) => (
                <li key={r.title}>
                  <h3 className="h3">{r.title}</h3>
                  <p>{r.body}</p>
                </li>
              ))}
            </ul>
            <a href="/assets/docs/doion-merits.pdf" target="_blank" rel="noopener noreferrer" className="more" style={{ marginTop: 20 }}>
              <FileText size={16} aria-hidden /> 전체 비교자료 PDF 보기
            </a>
          </div>
        </div>
      </section>

      {/* 7. 진행 */}
      <section className="wrap" aria-labelledby="process-title">
        <div className="section-head row">
          <h2 id="process-title" className="title-lg">
            상담부터 운영까지, <span className="dim">네 단계.</span>
          </h2>
          <Link href="/process" className="more">
            진행 방식 자세히 <ArrowRight size={16} aria-hidden />
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

      {/* 8. 가격 */}
      <section className="section wrap" aria-labelledby="price-title">
        <div className="section-head row">
          <h2 id="price-title" className="title-lg">
            가격은 <span className="dim">처음부터 공개합니다.</span>
          </h2>
          <Link href="/pricing" className="more">
            구성 자세히 비교 <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="plans">
          {buildPlans.map((p) => (
            <article key={p.name} className="plan" data-rec={Boolean(p.recommended)}>
              {p.recommended && <span className="rec-label">추천</span>}
              <h3 className="h3">{p.name}</h3>
              <p className="price">
                {p.price}
                <small>만원</small>
              </p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Check size={15} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="split top" style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <p className="title-md">
            만든 뒤 관리는 <span className="dim">월 {carePlans.map((c) => c.price).join("·")}만원.</span>
          </p>
          <div>
            <ul className="checks">
              <li>
                <Check size={18} aria-hidden />
                관리비는 계약일부터 최소 1년 동안 오르지 않습니다.
              </li>
              <li>
                <Check size={18} aria-hidden />
                디자인 방향을 먼저 확정하고, 확인받은 뒤 만들기 시작합니다.
              </li>
              <li>
                <Check size={18} aria-hidden />
                도메인 연결과 검색 등록까지 끝내서 넘겨드립니다.
              </li>
            </ul>
            <p className="note" style={{ marginTop: 12 }}>
              VAT 별도. 도메인·서버 비용은 상담 때 따로 안내드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 9. 마무리 */}
      <section className="section wrap cta-band" aria-labelledby="cta-title">
        <h2 id="cta-title" className="title-lg">
          매장 이야기부터 <br />
          <span className="dim">들려주세요.</span>
        </h2>
        <LiveStatus />
        <div className="pair">
          <a className="btn btn-ghost" href={tel}>
            <Phone size={18} aria-hidden /> 전화 상담
          </a>
          <Link className="btn btn-primary" href="/contact">
            상담 신청
          </Link>
        </div>
        <p className="note">
          {site.phone} · {site.email}
        </p>
      </section>
    </>
  );
}
