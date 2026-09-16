"use client";

import { useEffect, useState } from "react";
import CaseMosaic from "./CaseMosaic";
import type { PortfolioItem } from "@/data/portfolio";

export default function PortfolioBrowser({ items, categories }: { items: PortfolioItem[]; categories: string[] }) {
  const [active, setActive] = useState("전체");

  // 홈의 업종 칩(/portfolio#헬스장)에서 들어오면 해당 업종으로 시작
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

  return (
    <>
      <div className="filters" role="group" aria-label="업종별 보기">
        {["전체", ...categories].map((c) => (
          <button key={c} type="button" aria-pressed={active === c} onClick={() => setActive(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {active} 사례 {shown.length}개
      </p>
      <CaseMosaic items={shown} />
    </>
  );
}
