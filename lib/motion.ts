"use client";

// 모션 공용 상태: Lenis 인스턴스, 움직임 줄이기 판단, 페이지 전환 덮개.
import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

const RM = "(prefers-reduced-motion: reduce)";

export function isReduced() {
  return matchMedia(RM).matches || document.documentElement.dataset.motion === "reduced";
}

function subscribe(cb: () => void) {
  const mq = matchMedia(RM);
  mq.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}

// 서버와 첫 하이드레이션에서는 null(판단 전). 효과는 false일 때만 켠다.
export function useReduced(): boolean | null {
  return useSyncExternalStore(subscribe, isReduced, () => null);
}

// 첫 사용자 입력(스크롤·휠·터치·포인터·키)까지 무거운 모션 코드를 미룬다.
// 첫 화면은 CSS만으로 완성돼 있고, 스크롤 연출은 화면 아래에서 시작하므로 체감 차이가 없다(첫 로드 메인 스레드 절약).
let started = false;
const waiters = new Set<() => void>();
const EVENTS = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;
function fire() {
  if (started) return;
  started = true;
  EVENTS.forEach((e) => removeEventListener(e, fire));
  waiters.forEach((w) => w());
  waiters.clear();
}
export function onFirstInput(cb: () => void): () => void {
  if (started) {
    cb();
    return () => {};
  }
  if (!waiters.size) EVENTS.forEach((e) => addEventListener(e, fire, { passive: true, once: true }));
  waiters.add(cb);
  return () => waiters.delete(cb);
}

export const EASE_OUT = "cubic-bezier(0.19, 1, 0.22, 1)";
export const EASE_INOUT = "cubic-bezier(0.65, 0.05, 0.36, 1)";

// ---------- 페이지 전환 덮개 ----------
// 링크를 누르면 오프화이트 면이 아래에서 덮고(0.6s), 새 페이지가 붙으면 위로 걷힌다(0.6s).
let covered = false;
let safety = 0;

const coverEl = () => document.querySelector<HTMLElement>(".cover");

export function coverIn(label: string): Promise<void> {
  const el = coverEl();
  if (!el) return Promise.resolve();
  const text = el.querySelector("p");
  if (text) text.textContent = label;
  el.style.visibility = "visible";
  covered = true;
  clearTimeout(safety);
  // 새 페이지가 5초 안에 붙지 않으면 덮개를 걷는다(오류 화면이라도 보이게)
  safety = window.setTimeout(() => coverOut(), 5000);
  const anim = el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], {
    duration: 600,
    easing: EASE_INOUT,
    fill: "forwards",
  });
  return anim.finished.then(() => undefined).catch(() => undefined);
}

export function isCovered() {
  return covered;
}

export function coverOut() {
  const el = coverEl();
  clearTimeout(safety);
  if (!el || !covered) return;
  covered = false;
  const anim = el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
    duration: 600,
    easing: EASE_INOUT,
    fill: "forwards",
  });
  anim.finished
    .then(() => {
      el.style.visibility = "hidden";
      anim.cancel();
    })
    .catch(() => undefined);
}

// 이동한 뒤 초점: 새 페이지의 h1(없으면 main)
export function focusPageStart() {
  const h1 = document.querySelector<HTMLElement>("main h1");
  const target = h1 ?? document.querySelector<HTMLElement>("main");
  if (!target) return;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

// 앵커로 건너뛸 때는 화면 밖 구간(.cv)을 모두 그려 두어 목표 위치가 정확하게 한다
export function renderAll() {
  document.querySelectorAll<HTMLElement>(".cv").forEach((e) => (e.style.contentVisibility = "visible"));
}

export function scrollToEl(el: HTMLElement, done?: () => void) {
  renderAll();
  const l = getLenis();
  if (l && !isReduced()) {
    l.scrollTo(el, { offset: -80, duration: 1.2, onComplete: () => done?.() });
  } else {
    el.scrollIntoView();
    done?.();
  }
}
