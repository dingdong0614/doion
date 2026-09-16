"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { nav } from "@/lib/site";
import { useRootAttr } from "@/lib/use-root-attr";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // 첫 페인트 전 스크립트가 저장값 또는 OS 설정으로 data-theme을 채워 둠
  const theme = useRootAttr("theme") ?? "dark";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // 페이지 이동하면 메뉴 닫기
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    document.documentElement.dataset.theme = next;
  };

  return (
    <header className="site-header" data-open={open}>
      <div className="wrap bar">
        <Link href="/" className="logo" aria-label="doion 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="on-dark" src="/assets/logo-dark.png" alt="" width={69} height={28} loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="on-light" src="/assets/logo-light.png" alt="" width={69} height={28} loading="lazy" />
        </Link>
        <nav className="main-nav" id="main-nav" aria-label="주요 메뉴">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="m-only" aria-current={path === "/contact" ? "page" : undefined}>
            무료 상담 신청
          </Link>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "어두운 화면으로 바꾸기" : "밝은 화면으로 바꾸기"}
          >
            {theme === "light" ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
          </button>
          <Link href="/contact" className="btn btn-primary">
            무료 상담 신청
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
