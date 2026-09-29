"use client";

// 사례 목록 + 고정 미리보기(데스크톱). 줄에 마우스를 올리거나 초점이 가면 오른쪽 4:5 화면이 그 사례로 바뀐다.
// 모바일은 줄마다 화면이 붙는다. 업종 필터는 /portfolio#헬스장 처럼 해시로도 시작.
// 사진은 load 뒤에 받는다(첫 화면 글자 먼저, LCP).
import DeferredImage from "./DeferredImage";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { tone, type PortfolioItem } from "@/data/portfolio";

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

export default function PortfolioIndex({ items, categories }: { items: PortfolioItem[]; categories: string[] }) {
  const [active, setActive] = useState("전체");
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const pick = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (categories.includes(hash)) setActive(hash);
    };
    pick();
    addEventListener("hashchange", pick);
    return () => removeEventListener("hashchange", pick);
  }, [categories]);

  const shown = items.filter((c) => active === "전체" || c.category === active);
  const current = shown[hover] ?? shown[0];

  return (
    <section className="g pf" aria-labelledby="list-title">
      <h2 id="list-title" className="sr-only">
        사례 목록
      </h2>
      <div className="chips" role="group" aria-label="업종별 보기" style={col("1 / 25")}>
        {["전체", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={active === c}
            onClick={() => {
              setActive(c);
              setHover(0);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {active} 사례 {shown.length}개
      </p>

      <ol className="pf-list" style={col("1 / 15")}>
        {shown.map((c, i) => (
          <li key={c.name}>
            <a
              className="pf-row"
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
            >
              <p className="t-cap cat">
                {c.category}
                {c.demo && <span className="mute"> · 데모</span>}
              </p>
              <h3 className="t-st">{c.name}</h3>
              <p className="sum mute">{c.summary}</p>
              {/* 모바일에서만 보이는 줄 사진(데스크톱은 오른쪽 고정 미리보기) */}
              <div className="media r45 tone">
                <DeferredImage src={tone(c, "45")} alt="" width={780} height={975} sizes="(max-width: 767px) 92vw, 1px" />
              </div>
              <span className="ul">
                사이트 보기<span className="sr-only"> (새 탭)</span> <Icon name="out" />
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="pf-preview" style={col("16 / 25")} aria-hidden="true">
        <div className="media r45">
          {shown.map((c) => (
            <DeferredImage
              key={c.name}
              src={tone(c, "45")}
              alt=""
              width={780}
              height={975}
              sizes="(max-width: 767px) 1px, 36vw"
              data-on={c === current}
              className="tone-img"
            />
          ))}
        </div>
        {current && <p className="t-cap mute fig-cap">{current.name} 사이트, 모바일 첫 화면</p>}
      </div>
    </section>
  );
}
