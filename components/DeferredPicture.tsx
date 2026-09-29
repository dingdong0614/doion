"use client";

// 첫 화면 바로 아래 큰 사진: 페이지 load 뒤 한가할 때 받는다(첫 화면 글자가 먼저 그려지도록).
// 자리는 비율로 고정돼 레이아웃 이동이 없고, 스크립트가 없으면 noscript 이미지가 보인다.
import { useEffect, useState } from "react";

type Img = { src: string; srcSet?: string; sizes?: string; width?: number | `${number}`; height?: number | `${number}`; alt: string };

export default function DeferredPicture({ img, mobileSrcSet }: { img: Img; mobileSrcSet?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const go = () => (ric ? ric(() => setReady(true), { timeout: 1500 }) : setTimeout(() => setReady(true), 300));
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
  }, []);

  const tag = (
    <picture>
      {mobileSrcSet && <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />}
      <img src={img.src} srcSet={img.srcSet} sizes={img.sizes} width={img.width} height={img.height} alt={img.alt} decoding="async" />
    </picture>
  );
  return ready ? tag : <noscript>{tag}</noscript>;
}
