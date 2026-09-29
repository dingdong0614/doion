"use client";

// 폰트 2단계: 첫 화면 서브셋(preload) 다음에, 브라우저가 한가할 때
// 1) 사이트 전체 글자 서브셋("Pretendard Subset")을 FontFace로 붙이고
// 2) 서브셋에도 없는 글자(폼에 입력하는 글자 등)용 조각 폰트(Pretendard Variable dynamic subset) 스타일시트를 붙인다.
// 첫 화면 아래 글자는 전체 서브셋이 도착하면 같은 서체로 바뀐다(화면 밖이라 레이아웃 이동 없음).
import { useEffect } from "react";

const CSS = "/fonts/pretendard/pretendardvariable-dynamic-subset.css";
const FULL = "/fonts/PretendardSubset.woff2";

export default function FontFallback() {
  useEffect(() => {
    if (document.documentElement.dataset.fontFull) return;
    document.documentElement.dataset.fontFull = "1";
    const addCss = () => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = CSS;
      document.head.appendChild(l);
    };
    // 조각 폰트는 전체 서브셋이 붙은 뒤에(먼저 붙이면 서브셋 도착 전 조각을 잔뜩 받는다)
    const add = () => {
      if (!("FontFace" in window)) return addCss();
      const f = new FontFace("Pretendard Subset", `url(${FULL}) format("woff2")`, { weight: "200 800", display: "swap" });
      f.load()
        .then((ff) => {
          document.fonts.add(ff);
          setTimeout(addCss, 3000);
        })
        .catch(addCss);
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const go = () => (ric ? ric(add, { timeout: 2500 }) : setTimeout(add, 1200));
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
  }, []);
  return null;
}
