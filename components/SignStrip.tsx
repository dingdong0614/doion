import { signs } from "@/data/portfolio";

// 상호 띠(고유 장치): 실제 고객 상호를 간판 글자처럼 굵게 조판한 띠.
// 흐르는 띠(left/right)는 같은 줄을 두 벌 이어 붙여 CSS로 천천히 끝없이 흐른다(3차 검수: 1440에서 폭 66%에서 끊김).
// 작은 띠(sm)는 한 벌이 화면보다 짧아 한 벌 안에 목록을 3번 반복한다. 움직임 줄이기면 멈춘 채 폭을 채운다.
// 실사 교체 자리: 고객 간판 정면을 같은 높이로 촬영해 가로로 잘라 이은 사진 띠(docs/photo-pipeline.md).
function Row({ times }: { times: number }) {
  return (
    <>
      {Array.from({ length: times }, (_, k) =>
        signs.map((s, i) => (
          <span key={`${k}-${i}`} style={{ display: "contents" }}>
            <span>{s}</span>
            <i className="dia" />
          </span>
        ))
      )}
    </>
  );
}

export default function SignStrip({ dir = "left", className = "" }: { dir?: "left" | "right" | "none"; className?: string }) {
  if (dir === "none") {
    return (
      <div className={`strip ${className}`} aria-hidden="true">
        <div className="strip-in">
          <Row times={1} />
        </div>
      </div>
    );
  }
  const times = className.includes("sm") ? 3 : 1;
  return (
    <div className={`strip flow ${className}`} aria-hidden="true" data-dir={dir}>
      <div className="strip-in">
        <div className="strip-run">
          <Row times={times} />
        </div>
        <div className="strip-run">
          <Row times={times} />
        </div>
      </div>
    </div>
  );
}
