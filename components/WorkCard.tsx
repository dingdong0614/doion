import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "@/data/portfolio";

export default function WorkCard({ item, span, priority }: { item: PortfolioItem; span: string; priority?: boolean }) {
  const big = span === "span-xl";
  return (
    <article className={`work ${span}`}>
      <div className="shot">
        <Image
          src={item.thumb}
          alt={`${item.name} 사이트 화면`}
          fill
          priority={priority}
          sizes={big ? "(max-width: 960px) 100vw, 700px" : "(max-width: 620px) 100vw, (max-width: 960px) 50vw, 500px"}
        />
      </div>
      <div className="body">
        <div className="meta">
          <span>{item.category}</span>
          {item.demo && <span className="tag tag-demo">영업용 데모</span>}
        </div>
        <h3 className={big ? "h2" : "h3"} style={big ? { fontSize: "clamp(1.6rem, 1.2rem + 1.2vw, 2.2rem)" } : undefined}>
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </h3>
        <p className="muted">{item.summary}</p>
      </div>
      {item.href && (
        <span className="open" aria-hidden>
          <ArrowUpRight size={18} />
        </span>
      )}
    </article>
  );
}
