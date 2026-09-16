"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";
import type { PortfolioItem } from "@/data/portfolio";

// 첫 줄 2개 크게, 이후 3개씩 작게. 마지막 줄이 1~2개로 남으면 반폭으로 채워 빈칸이 안 생기게.
function spanFor(i: number, n: number) {
  if (n === 3) return "span-sm";
  if (n <= 2 || i < 2) return "span-half";
  const rest = (n - 2) % 3;
  const tail = rest === 1 ? 4 : rest; // 1개 남으면 앞줄 3개와 합쳐 반폭 2줄
  return i >= n - tail ? "span-half" : "span-sm";
}

export default function PortfolioBrowser({ items, categories }: { items: PortfolioItem[]; categories: string[] }) {
  const [active, setActive] = useState("전체");
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
      <div className="bento">
        {shown.map((item, i) => (
          <WorkCard key={item.name} item={item} span={spanFor(i, shown.length)} priority={i < 2} />
        ))}
      </div>
    </>
  );
}
