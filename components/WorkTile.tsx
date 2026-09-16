import type { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { Laptop, Phone } from "./Device";
import type { PortfolioItem } from "@/data/portfolio";

// span: 12칸 그리드에서 차지하는 칸 수. 넓으면 노트북, 좁으면 휴대폰 캡처를 보여줌.
export default function WorkTile({ item, span }: { item: PortfolioItem; span: number }) {
  const wide = span >= 5 && item.desktop;
  const vw = `${Math.round((span / 12) * 100)}vw`;
  return (
    <article
      className={`tile w${span}`}
      data-tone={item.tile.tone}
      style={{ "--tile-bg": item.tile.bg } as CSSProperties}
    >
      <p className="cat">
        {item.category}
        {item.demo && <span className="demo">영업용 데모</span>}
      </p>
      <h3>
        {item.href ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.name}
          </a>
        ) : (
          item.name
        )}
      </h3>
      <p>{item.summary}</p>
      {item.href && (
        <span className="visit" aria-hidden>
          사이트 보기 <ChevronRight size={16} />
        </span>
      )}
      <div className="shot2" style={wide ? { width: span === 12 ? "min(78%, 820px)" : "88%", marginInline: "auto" } : undefined}>
        {wide ? (
          <Laptop src={item.desktop!} alt={`${item.name} 데스크톱 화면`} sizes={`(max-width: 680px) 90vw, (max-width: 960px) 45vw, ${vw}`} />
        ) : (
          item.mobile && <Phone src={item.mobile} alt={`${item.name} 모바일 화면`} sizes="(max-width: 680px) 46vw, 240px" />
        )}
      </div>
    </article>
  );
}

// 7·5 / 4·4·4 / 6·6 순서로 줄을 채우고, 마지막 줄이 덜 차면 남은 개수로 균등 분할
export function spansFor(n: number) {
  const pattern = [
    [7, 5],
    [4, 4, 4],
    [6, 6],
  ];
  const out: number[] = [];
  let r = 0;
  while (out.length < n) {
    const row = pattern[r++ % pattern.length];
    const left = n - out.length;
    out.push(...(left >= row.length ? row : Array(left).fill(12 / left)));
  }
  return out;
}
