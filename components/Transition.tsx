"use client";

// 페이지 전환(App Router). 사이트 안 링크를 누르면 덮개가 아래에서 덮고, 덮인 뒤 router.push.
// 새 페이지의 template이 붙으면 PageEnter가 덮개를 걷고 h1에 초점을 옮긴다.
// 링크는 그대로 next/link라 프리페치·크롤링·새 탭 열기는 영향이 없다.
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { coverIn, coverOut, focusPageStart, getLenis, isCovered, isReduced, renderAll, scrollToEl } from "@/lib/motion";

const SKIP = /\.(pdf|txt|xml|png|jpe?g|webp|avif|mp4|webm|html?)$/i;

export function TransitionRoot() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || !a.href) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.dataset.nocover !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || SKIP.test(url.pathname) || url.pathname.startsWith("/api/")) return;

      // 같은 페이지 안: 앵커면 부드럽게 이동 후 그 섹션에 초점
      if (url.pathname === location.pathname && url.search === location.search) {
        e.preventDefault();
        const id = decodeURIComponent(url.hash.slice(1));
        const t = id ? document.getElementById(id) : null;
        const focus = (el: HTMLElement) => {
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        };
        if (t) {
          history.replaceState(history.state, "", url.hash);
          scrollToEl(t, () => focus(t));
        } else {
          const l = getLenis();
          if (l && !isReduced()) l.scrollTo(0, { duration: 1.2 });
          else scrollTo(0, 0);
        }
        return;
      }

      if (isReduced() || isCovered()) return; // 움직임 줄이기: 기본 이동
      e.preventDefault();
      const label = a.dataset.label ?? (a.textContent ?? "").trim();
      coverIn(label.slice(0, 24)).then(() => router.push(url.pathname + url.search + url.hash));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div className="cover" aria-hidden="true">
      <p className="t-h2" />
    </div>
  );
}

export function PageEnter() {
  useEffect(() => {
    // 주소에 #이 붙어 바로 들어온 경우(예: /#contact)도 화면 밖 구간을 그려 목표 위치를 맞춘다
    if (location.hash && !isCovered()) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        renderAll();
        requestAnimationFrame(() => el.scrollIntoView());
      }
      return;
    }
    if (!isCovered()) return;
    const l = getLenis();
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id ? document.getElementById(id) : null;
    if (t) {
      renderAll();
      t.scrollIntoView();
    } else if (l) l.scrollTo(0, { immediate: true, force: true });
    else scrollTo(0, 0);
    l?.resize();
    requestAnimationFrame(() => {
      coverOut();
      focusPageStart();
    });
  }, []);
  return null;
}
