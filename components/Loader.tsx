import SignStrip from "./SignStrip";

// 첫 방문 로더(1.6초). 표시 여부는 layout의 첫 페인트 전 스크립트가 html[data-loader]로 정한다.
// 움직임은 CSS 키프레임만 써서 스크립트 로딩과 무관하게 끝난다.
export default function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="loader-logo" src="/assets/logo-light-2x.png" alt="" width={69} height={28} />
      <SignStrip dir="none" />
      <p className="t-cap loader-cap">간판 다음으로, 손님이 보는 곳.</p>
    </div>
  );
}
