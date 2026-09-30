"use client";

// 페이지별 스크롤 연출(GSAP ScrollTrigger). template 안에 있어 페이지마다 새로 붙고, 떠날 때 전부 되돌린다.
// GSAP은 첫 화면 이후 동적 import(첫 로드 JS에서 뺌). 움직임 줄이기면 아무것도 걸지 않고 최종 상태로 둔다.
import { useEffect } from "react";
import { getLenis, onFirstInput, useReduced } from "@/lib/motion";

export default function PageMotion() {
  const reduced = useReduced();

  useEffect(() => {
    // 움직임 줄이기: 아무것도 걸지 않음(가로 트랙은 손으로 넘김)
    if (reduced !== false) return;
    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/CustomEase"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      // CSS 토큰과 같은 곡선 2개
      const EO = CustomEase.create("dOut", "0.19,1,0.22,1");
      const EIO = CustomEase.create("dInOut", "0.65,0.05,0.36,1");
      void EIO;

      // Lenis와 같은 프레임에 맞춤(Lenis가 나중에 붙어도 연결)
      const sync = () => ScrollTrigger.update();
      let lenis = getLenis();
      lenis?.on("scroll", sync);
      const onLenis = () => {
        lenis?.off("scroll", sync);
        lenis = getLenis();
        lenis?.on("scroll", sync);
      };
      addEventListener("doion:lenis", onLenis);
      const mms: ReturnType<typeof gsap.matchMedia>[] = [];

      // 켜지기 전 글자는 회색(--mute, 대비 5.7:1)이라 연출 중에도 AA를 지킨다
      const css = getComputedStyle(document.documentElement);
      const mute = css.getPropertyValue("--mute").trim() || "#64625c";
      const ink = css.getPropertyValue("--ink").trim() || "#1b1a17";

      const ctx = gsap.context(() => {
        const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s) as NodeListOf<T>);

        // 1. 섹션 제목만 줄 단위 마스크 리빌(아래 110% 에서 0, 줄 간격 0.08s, 0.8s)
        $$("[data-reveal]").forEach((h) => {
          const lines = $$(".ln", h);
          const inner = $$(".ln > span", h);
          if (!inner.length) return;
          gsap.set(lines, { overflow: "hidden", paddingBottom: "0.06em" });
          gsap.set(inner, { yPercent: 110 });
          ScrollTrigger.create({
            trigger: h,
            start: "top 88%",
            once: true,
            onEnter: () => gsap.to(inner, { yPercent: 0, duration: 0.8, ease: EO, stagger: 0.08 }),
          });
        });

        // 2. 상호 띠는 CSS 애니메이션으로 흐른다(SignStrip, globals.css .strip.flow)

        // 4. 선언문: 단어가 스크롤에 따라 차례로 짙어짐(명도만, 회색에서 글자색)
        $$("[data-words]").forEach((st) => {
          gsap.fromTo($$(".w", st), { color: mute }, { color: ink, ease: "none", stagger: 0.1, scrollTrigger: { trigger: st, start: "top 82%", end: "bottom 50%", scrub: true } });
        });

        // 5. 진행 방식 단어: 화면 가운데를 지날 때 켜짐
        $$("[data-flow] .word").forEach((w) => {
          gsap.fromTo(w, { color: mute }, { color: ink, ease: "none", scrollTrigger: { trigger: w, start: "top 80%", end: "top 45%", scrub: true } });
        });

        // 6. 가로 트랙: 768 이상은 sticky 고정 + 세로 스크롤을 가로 이동으로
        $$("[data-track]").forEach((sec) => {
          const pin = sec.querySelector<HTMLElement>(".track-pin")!;
          const track = sec.querySelector<HTMLElement>(".track")!;
          const bar = sec.querySelector<HTMLElement>(".progress i");
          const mm = gsap.matchMedia();
          mms.push(mm);
          mm.add("(min-width: 768px)", () => {
            sec.dataset.pinned = "true";
            const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);
            // 고정 구간 길이는 옆으로 가는 거리와 화면 1.4개 중 짧은 쪽(3차 검수: 화면 약 4개 → 약 2.4개).
            // 거리가 더 길면 세로 1px에 가로가 1px보다 더 움직인다
            const run = () => Math.min(dist(), innerHeight * 1.4);
            const setH = () => sec.style.setProperty("--track-h", `${innerHeight + run()}px`);
            setH();
            ScrollTrigger.addEventListener("refreshInit", setH);
            gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
                invalidateOnRefresh: true,
                onUpdate: (s) => {
                  if (bar) gsap.set(bar, { scaleX: s.progress });
                },
              },
            });
            return () => {
              delete sec.dataset.pinned;
              sec.style.removeProperty("--track-h");
              ScrollTrigger.removeEventListener("refreshInit", setH);
            };
          });
          mm.add("(max-width: 767px)", () => {
            const onS = () => {
              const m = track.scrollWidth - track.clientWidth;
              if (bar) gsap.set(bar, { scaleX: m > 0 ? track.scrollLeft / m : 0 });
            };
            track.addEventListener("scroll", onS, { passive: true });
            return () => {
              track.removeEventListener("scroll", onS);
            };
          });
        });
      });

      // 폰트가 늦게 도착하거나, 화면 밖 구간(.cv)이 처음 그려지며 높이가 바뀌면 다시 계산
      ScrollTrigger.refresh();
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
      let rT = 0;
      let lastH = document.documentElement.scrollHeight;
      const ro = new ResizeObserver(() => {
        const h = document.documentElement.scrollHeight;
        if (Math.abs(h - lastH) < 2) return;
        lastH = h;
        clearTimeout(rT);
        rT = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      });
      ro.observe(document.body);

      cleanup = () => {
        ro.disconnect();
        clearTimeout(rT);
        removeEventListener("doion:lenis", onLenis);
        lenis?.off("scroll", sync);
        mms.forEach((mm) => mm.revert());
        ctx.revert();
      };
    };
    // 첫 입력 때 GSAP을 불러와 건다. 라이브러리를 못 받아도 내용은 전부 보인다(CSS 기본 상태가 최종 상태)
    const off = onFirstInput(() => void start().catch(() => undefined));

    return () => {
      cancelled = true;
      off();
      cleanup();
    };
  }, [reduced]);

  return null;
}
