"use client";

import { useState } from "react";
import WorkTile, { spansFor } from "./WorkTile";
import type { PortfolioItem } from "@/data/portfolio";

export default function PortfolioBrowser({ items, categories }: { items: PortfolioItem[]; categories: string[] }) {
  const [active, setActive] = useState("전체");
  const shown = items.filter((c) => active === "전체" || c.category === active);
  const spans = spansFor(shown.length);

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
      <div className="tiles">
        {shown.map((item, i) => (
          <WorkTile key={item.name} item={item} span={spans[i]} />
        ))}
      </div>
    </>
  );
}
