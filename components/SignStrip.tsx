import { signs } from "@/data/portfolio";

// 상호 띠(고유 장치): 실제 고객 상호를 간판 글자처럼 굵게 조판해 위아래를 자른 띠.
// 실사 교체 자리: 고객 간판 정면을 같은 높이로 촬영해 가로로 잘라 이은 사진 띠(docs/photo-pipeline.md).
export default function SignStrip({ dir = "left", className = "" }: { dir?: "left" | "right" | "none"; className?: string }) {
  // 한 벌(6곳)이면 화면 폭 + 흐르는 거리(35vw)보다 길어 반복하지 않는다
  const row = signs;
  return (
    <div className={`strip ${className}`} aria-hidden="true" data-strip={dir}>
      <div className="strip-in">
        {row.map((s, i) => (
          <span key={i} style={{ display: "contents" }}>
            <span>{s}</span>
            <i className="dia" />
          </span>
        ))}
      </div>
    </div>
  );
}
