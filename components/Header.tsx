"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { isReduced } from "@/lib/motion";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  // 페이지 이동하면 메뉴 닫기
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  // 내리면 숨고 올리면 나타남. 움직임 줄이기에서는 숨기지 않음
  useEffect(() => {
    let last = scrollY;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = scrollY;
      setSolid(y > 8);
      setHide(!isReduced() && y > last && y > 320);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (path.startsWith(href) ? "page" : undefined);

  return (
    <>
      <header className="hdr" data-solid={solid || open} data-hide={hide && !open}>
        <div className="hdr-in">
          <Link href="/" className="logo" aria-label="doion(도이온) 처음으로" data-label="doion">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-light-2x.png" alt="" width={69} height={28} />
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            {nav.map((n) => (
              <Link key={n.href} className="u" href={n.href} aria-current={current(n.href)}>
                {n.label}
              </Link>
            ))}
            <Link className="btn btn-ink" href="/contact" aria-current={current("/contact")}>
              무료 상담 신청
            </Link>
          </nav>
          <button
            ref={btn}
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen(!open)}
          >
            {open ? "닫기" : "메뉴"}
          </button>
        </div>
      </header>
      <nav ref={menu} className="mnav" id="mnav" aria-label="모바일 메뉴" hidden={!open}>
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          처음
        </Link>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} aria-current={current(n.href)}>
            {n.label}
          </Link>
        ))}
        <Link href="/contact" aria-current={current("/contact")}>
          무료 상담 신청
        </Link>
      </nav>
    </>
  );
}
