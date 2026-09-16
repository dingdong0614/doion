"use client";

import { useEffect, useState } from "react";
import { statDefaults } from "@/data/offer";

type Stats = typeof statDefaults;

const rows: { key: keyof Stats; label: string; unit: string }[] = [
  { key: "stores", label: "누적 제작 매장", unit: "곳" },
  { key: "days", label: "평균 제작 기간", unit: "일" },
  { key: "tags", label: "설치한 NFC 태그", unit: "개" },
];

export default function Ledger() {
  const [shown, setShown] = useState<Stats>(statDefaults);

  useEffect(() => {
    let raf = 0;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);

    fetch("/api/stats", { cache: "no-store", signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => (d.configured ? ({ stores: d.stores, days: d.days, tags: d.tags } as Stats) : statDefaults))
      .catch(() => statDefaults)
      .then((target) => {
        clearTimeout(timer);
        const reduced =
          matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
        if (reduced) return setShown(target);
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / 1100, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setShown({
            stores: Math.round(target.stores * e),
            days: Math.round(target.days * e),
            tags: Math.round(target.tags * e),
          });
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      });

    return () => {
      ctrl.abort();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <dl className="ledger">
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{r.label}</dt>
          <dd>
            {shown[r.key]}
            <small>{r.unit}</small>
          </dd>
        </div>
      ))}
    </dl>
  );
}
