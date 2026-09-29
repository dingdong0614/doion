"use client";

// 히어로 휴대폰 세 대: 간판 다음에 손님이 보는 곳(실제 고객 사이트 화면, 원색).
// 가운데는 피티홀릭짐 모바일 사이트를 한 프레임씩 찍어 만든 60fps 스크롤 영상(scripts/make-hero-video.py).
// 영상은 load 뒤 한가할 때 붙이고(첫 화면 LCP는 포스터 이미지), 움직임 줄이기면 포스터만. 5초 넘는 자동 재생이라 정지 버튼.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useReduced } from "@/lib/motion";

export default function HeroPhones() {
  const reduced = useReduced();
  const v = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const go = () => (ric ? ric(() => setReady(true), { timeout: 1500 }) : setTimeout(() => setReady(true), 300));
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
  }, []);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (reduced !== false || paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => undefined) : el.pause()), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, paused, ready]);

  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) {
      setPaused(false);
      el.play().catch(() => undefined);
    } else {
      setPaused(true);
      el.pause();
    }
  };

  const showVideo = ready && reduced === false;

  return (
    <figure className="hero-visual">
      <div className="phones">
        <div className="phone side l">
          <Image src="/assets/tone/sungdae-phone.jpg" alt="뭐무까~ 앱 휴대폰 첫 화면" width={780} height={1688} sizes="(max-width: 1023px) 30vw, 150px" />
        </div>
        <div className="phone c">
          <Image
            src="/assets/video/hero-poster.jpg"
            alt="피티홀릭짐 사이트 휴대폰 화면"
            width={480}
            height={1038}
            sizes="(max-width: 1023px) 40vw, 200px"
            preload
            fetchPriority="high"
            loading="eager"
          />
          {showVideo && (
            <video ref={v} muted loop playsInline preload="auto" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
              <source src="/assets/video/hero.webm" type="video/webm" />
              <source src="/assets/video/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="phone side r">
          <Image src="/assets/tone/jangan-phone.jpg" alt="장안설비대장 사이트 휴대폰 첫 화면" width={780} height={1688} sizes="(max-width: 1023px) 30vw, 150px" />
        </div>
      </div>
      <figcaption className="phones-cap t-cap mute">
        <span>뭐무까~ · 피티홀릭짐 · 장안설비대장, 손님 휴대폰에서 보이는 화면</span>
        {showVideo && (
          <button type="button" className="ul t-cap" onClick={toggle} aria-pressed={playing}>
            <Icon name={playing ? "pause" : "play"} />
            {playing ? "영상 멈추기" : "영상 재생"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
