import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "@/data/portfolio";

type Slot = { span: number; kind: "d" | "m" };

// 넓은 칸(d)은 데스크톱 캡처, 좁은 칸(m)은 모바일 캡처. 목업 없이 맨 스크린샷.
const ROWS: Slot[][] = [
  [
    { span: 8, kind: "d" },
    { span: 4, kind: "m" },
  ],
  [
    { span: 3, kind: "m" },
    { span: 6, kind: "d" },
    { span: 3, kind: "m" },
  ],
  [
    { span: 6, kind: "d" },
    { span: 6, kind: "d" },
  ],
];

// 순서를 최대한 지키면서 칸 종류에 맞는 사례를 채움. 마지막 줄이 덜 차면 남은 개수로 균등 분할.
export function layout(items: PortfolioItem[]) {
  const left = [...items];
  const out: { item: PortfolioItem; span: number; kind: "d" | "m" }[] = [];
  for (let r = 0; left.length; r++) {
    const row = ROWS[r % ROWS.length];
    if (left.length < row.length) {
      const n = left.length;
      for (const item of left.splice(0)) out.push({ item, span: 12 / n, kind: item.desktop ? "d" : "m" });
      break;
    }
    for (const slot of row) {
      const i = slot.kind === "d" ? Math.max(0, left.findIndex((x) => x.desktop)) : 0;
      const [item] = left.splice(i, 1);
      out.push({ item, span: slot.span, kind: slot.kind === "d" && item.desktop ? "d" : "m" });
    }
  }
  return out;
}

export default function CaseMosaic({ items }: { items: PortfolioItem[] }) {
  const cells = layout(items);
  return (
    <div className="mosaic">
      {cells.map(({ item, span, kind }) => (
        <article key={item.name} className="case" data-kind={kind} style={{ gridColumn: `span ${span}` }}>
          <div className="shot">
            {kind === "d" && (
              <Image className="d-only" src={item.desktop!} alt={`${item.name} 데스크톱 화면`} fill sizes={`${Math.round((span / 12) * 1240)}px`} />
            )}
            <Image
              className={kind === "d" ? "m-only" : undefined}
              src={item.mobile}
              alt={`${item.name} 모바일 화면`}
              fill
              sizes={`(max-width: 760px) 64vw, ${Math.round((span / 12) * 1240)}px`}
            />
          </div>
          <div className="cap">
            <b>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
              ) : (
                item.name
              )}
              {item.demo && <span className="demo">데모</span>}
            </b>
            <span>
              {item.category}
              {item.href && <ArrowUpRight size={14} aria-hidden style={{ display: "inline", marginLeft: 4, verticalAlign: -2 }} />}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
