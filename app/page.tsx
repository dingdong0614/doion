import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import Light from "@/components/Light";
import LiveStatus from "@/components/LiveStatus";
import { BuildRows, CareCols } from "@/components/PriceDoc";
import HeroPhones from "@/components/HeroPhones";
import SignStrip from "@/components/SignStrip";
import { portfolio, signs, tone } from "@/data/portfolio";
import { buildPlans, reasons, steps } from "@/data/offer";
import { site, tel } from "@/lib/site";

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;
const prices = buildPlans.map((p) => p.price * 10000);

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
  // 제작비 범위는 data/offer.ts 에서 계산(가격을 바꾸면 자동 반영)
  priceRange: `₩${Math.min(...prices).toLocaleString("en-US")}~₩${Math.max(...prices).toLocaleString("en-US")}`,
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
    "대학가 맛집 웹앱",
    "설치형 웹앱(PWA) 제작",
  ],
};

function find(name: string) {
  return portfolio.find((p) => p.name === name)!;
}

export default function Home() {
  const cases = portfolio;
  const [nfc, ...why] = reasons;
  const careImg = find("빠둠뮤직 보컬 트레이닝 센터");
  const processImg = find("체대입시 실기 기록판");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. 첫 화면: 24컬럼 타입 배치. 첫 줄은 내용 폭을 채우는 display, 둘째 줄 우측 정렬(비대칭) */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="g hero-top">
          <p className="t-cap" style={col("1 / 9", "1 / 5")}>
            소규모 매장 웹사이트 제작·관리 대행
          </p>
          <p className="t-cap" style={{ ...col("17 / 25", "5 / 7"), textAlign: "right" }}>
            {site.region}
          </p>
          <h1 className="hero-h" id="hero-title" style={col("1 / 17")} data-light>
            <span className="sr-only">간판 다음으로, 손님이 보는 곳.</span>
            <span className="hero-a t-display" aria-hidden="true">
              <Light text="간판 다음으로," />
            </span>
            <span className="hero-b t-h2" aria-hidden="true">
              <Light text="손님이 보는 곳." start={8} />
            </span>
          </h1>
          <div className="hero-visual-wrap" style={col("17 / 25")}>
            <HeroPhones />
          </div>
          <p className="hero-lead measure" style={col("1 / 11")}>
            수원 율전동에서 동네 가게 홈페이지를 만들고, 만든 뒤에도 매달 관리합니다.
          </p>
          <div className="hero-cta" style={col("1 / 13")}>
            <Link className="btn btn-ink" href="#contact">
              무료 상담 신청
            </Link>
            <Link className="ul" href="/portfolio" data-label="사례">
              포트폴리오 보기 <Icon name="out" />
            </Link>
          </div>
          <p className="hero-note t-cap mute" style={col("1 / 13")}>
            상담은 무료이고, 대표가 직접 연락드립니다.
          </p>
        </div>
        {/* 상호 띠 자리 1(히어로). 첫 화면에서는 작게(h2 크기): 주인공은 제목 하나 */}
        <SignStrip dir="left" className="sm" />
        <p className="sr-only">doion이 만든 가게: {signs.join(", ")}</p>
      </section>

      {/* 2. 사례: 머리 + 가로 트랙(대표 피드백으로 저해상도 풀블리드 캡처 제거) */}
      <section id="work" aria-labelledby="work-title">
        <div className="g work-head">
          <h2 className="t-h2" id="work-title" style={col("1 / 17")} data-reveal>
            <span className="ln">
              <span>만든 사이트,</span>
            </span>
            <span className="ln">
              <span>간판 다음에 손님이 보는 화면.</span>
            </span>
          </h2>
          <p className="measure mute" style={col("18 / 25")}>
            실제 운영 중인 사이트와 업종별 영업용 데모를 함께 모았습니다. 지금 열어볼 수 있어요. 카드를 누르면 라이브 사이트가 새 탭에서 열립니다.
          </p>
        </div>
      </section>

      {/* 3. 사례 가로 트랙: 데스크톱은 세로 스크롤이 옆으로 넘기고, 모바일은 손으로 밀어 넘긴다 */}
      <section className="track-sec" aria-label="사례 목록" data-track>
        <div className="track-pin">
          <div className="g track-top">
            <p className="t-cap" style={col("1 / 5", "1 / 4")}>
              전체 사례 {portfolio.length}개
            </p>
            <div className="progress" style={col("5 / 21", "4 / 7")} aria-hidden="true">
              <i />
            </div>
            <p className="t-cap mute" style={{ ...col("21 / 25"), textAlign: "right" }}>
              라이브 사이트는 새 탭에서 열립니다
            </p>
          </div>
          <ul className="track">
            {cases.map((c) => (
              <li key={c.name} className="card">
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  <div className="slice" aria-hidden="true">
                    <span>{c.sign ?? c.name}</span>
                  </div>
                  <div className="media r45 tone">
                    <Image src={tone(c, "45")} alt={`${c.name} 사이트 모바일 화면`} width={780} height={975} sizes="(max-width: 767px) 80vw, 25vw" />
                  </div>
                  <h3 className="card-name">{c.name}</h3>
                  <p className="t-cap mute card-meta">
                    {c.category}
                    {c.demo && " · 데모"}
                  </p>
                  <p className="card-sum">{c.summary}</p>
                  <span className="ul card-more">
                    사이트 보기<span className="sr-only"> (새 탭)</span> <Icon name="out" />
                  </span>
                </a>
              </li>
            ))}
            <li className="card end">
              <Link href="#contact" data-label="상담 신청">
                <span className="t-h2">
                  우리 매장도
                  <br />
                  상담받기
                </span>
                <span className="ul" style={{ alignSelf: "flex-start" }}>
                  무료 상담 신청 <Icon name="down" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. 선언문 + 흩어진 격자. 선언문 단어가 스크롤에 따라 간판 불 켜지듯 밝아진다 */}
      <section className="g care cv" aria-labelledby="care-title">
        <p className="t-st" style={col("5 / 21")} data-words>
          {"사장님은 장사만 하세요. 문구 수정, 사진 교체, 이벤트 페이지, 태그 관리까지 매달 저희가 챙깁니다."
            .split(" ")
            .map((w, i, a) => (
              <span key={i}>
                <span className="w">{w}</span>
                {i < a.length - 1 && " "}
              </span>
            ))}
        </p>
        <h2 className="t-h2 care-h" id="care-title" style={col("1 / 13")} data-reveal>
          <span className="ln">
            <span>맡기면 이렇게 달라집니다.</span>
          </span>
        </h2>
        <div className="reason r1" style={col("1 / 10")}>
          <h3 className="t-st">{why[0].title}</h3>
          <p className="mute">{why[0].body}</p>
        </div>
        <div className="reason r2" style={col("12 / 21")}>
          <h3 className="t-st">{why[1].title}</h3>
          <p className="mute">{why[1].body}</p>
        </div>
        {/* 실사 교체 자리 A: 카운터에 붙인 NFC 태그에 손님이 휴대폰을 대는 손 클로즈업(1:1).
            촬영 전까지는 실제 고객 사이트 캡처를 같은 보정 프리셋으로 씀 */}
        <figure className="care-img" style={col("21 / 25", "2 / 7")}>
          <div className="media r11 tone">
            <Image src={tone(careImg, "11")} alt={`${careImg.name} 사이트 모바일 화면`} width={780} height={780} sizes="(max-width: 767px) 80vw, 17vw" />
          </div>
          <figcaption className="t-cap mute fig-cap">{careImg.name} 사이트, 모바일 첫 화면</figcaption>
        </figure>
        <div className="reason r3" style={col("4 / 13")}>
          <h3 className="t-st">{why[2].title}</h3>
          <p className="mute">{why[2].body}</p>
        </div>
        <div className="reason r4" style={col("15 / 24")}>
          <h3 className="t-st">{why[3].title}</h3>
          <p className="mute">{why[3].body}</p>
          <a className="ul" href="/assets/docs/doion-merits.pdf" target="_blank" rel="noopener noreferrer" style={{ justifySelf: "start" }}>
            <Icon name="doc" /> 전체 비교자료 PDF 보기
          </a>
        </div>
      </section>

      {/* 5. 제작 방식: 7 + 2 + 15 비대칭 분할. 어두운 섹션은 이 한 곳만 */}
      <section className="g process dark cv" id="process" aria-labelledby="process-title">
        <div className="p-left" style={col("1 / 8")}>
          <h2 className="t-h2" id="process-title" data-reveal>
            <span className="ln">
              <span>상담부터</span>
            </span>
            <span className="ln">
              <span>운영까지,</span>
            </span>
            <span className="ln">
              <span>네 단계.</span>
            </span>
          </h2>
          <p className="mute">상담부터 납품까지 약 2주.</p>
          {/* 실사 교체 자리 B: 대표가 매장에서 사장님과 상담하는 장면(4:5). 지금은 실제 고객 사이트 화면 */}
          <figure>
            <div className="media r45 tone">
              <Image src={tone(processImg, "45")} alt={`${processImg.name} 사이트 모바일 화면`} width={780} height={975} sizes="(max-width: 767px) 90vw, 25vw" />
            </div>
            <figcaption className="t-cap mute fig-cap">{processImg.name} 사이트, 모바일 첫 화면</figcaption>
          </figure>
        </div>
        <div style={col("10 / 25")}>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title} className="step">
                <h3 className="t-h2">{s.title}</h3>
                <p>{s.body}</p>
                {s.time && <span className="t-cap when">{s.time}</span>}
              </li>
            ))}
          </ol>
          <div className="nfc">
            <h3 className="t-st">휴대폰을 대면, 바로 우리 가게 페이지.</h3>
            <p className="measure mute">{nfc.body}</p>
            <div className="row-links">
              <Link className="btn btn-ink" href="#contact" data-label="상담 신청">
                NFC/QR 설치 상담
              </Link>
              <Link className="ul" href="/process" data-label="진행 방식">
                진행 방식 자세히 <Icon name="out" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 가격: 문서 칸. 왼쪽 3컬럼은 항목 이름 */}
      <section className="g pricing" id="pricing" aria-labelledby="pricing-title">
        <h2 className="t-h2" id="pricing-title" style={col("1 / 15")} data-reveal>
          <span className="ln">
            <span>가격은 처음부터 공개합니다.</span>
          </span>
        </h2>
        <p className="t-cap mute" style={{ ...col("18 / 25"), alignSelf: "end" }}>
          VAT 별도. 도메인·서버 비용은 상담 때 따로 안내드립니다.
        </p>
        <div className="sub">
          <BuildRows />
          <CareCols />
          <div className="sub doc-row">
            <p className="t-cap doc-label" style={col("1 / 4")}>
              약속
            </p>
            <ul className="promise t-st" style={col("4 / 18")}>
              <li>관리비는 계약일부터 최소 1년 동안 오르지 않습니다.</li>
              <li>디자인 방향을 먼저 확정하고, 확인받은 뒤 만들기 시작합니다.</li>
              <li>도메인 연결과 검색 등록까지 끝내서 넘겨드립니다.</li>
            </ul>
            <div style={{ ...col("20 / 25"), justifySelf: "start" }}>
              <Link className="ul" href="/pricing" data-label="가격">
                구성 자세히 비교 <Icon name="out" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 상담: 전체 폭 폼 격자(기존 /api/contact 그대로) */}
      <section className="g contact cv" id="contact" aria-labelledby="contact-title">
        <h2 className="t-h2 contact-h" id="contact-title" style={col("1 / 25")} data-reveal>
          <span className="ln">
            <span>매장 이야기부터</span>
          </span>
          <span className="ln">
            <span className="big">들려주세요.</span>
          </span>
        </h2>
        <div style={col("1 / 9")} className="measure">
          <p>간단히 남겨주시면 대표가 직접 연락드립니다. 전화가 편하시면 바로 걸어주세요.</p>
          <div style={{ marginTop: 12 }}>
            <LiveStatus />
          </div>
        </div>
        <ContactForm />
        <dl className="sub info">
          <div style={col("1 / 7", "1 / 4")}>
            <dt>전화</dt>
            <dd>
              <a className="ul" href={tel}>
                {site.phone}
              </a>
            </dd>
          </div>
          <div style={col("7 / 13", "4 / 7")}>
            <dt>이메일</dt>
            <dd>
              <a className="ul" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div style={col("13 / 19")}>
            <dt>지역</dt>
            <dd>수원 율전동 중심, 수원 전역</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
