import Light from "./Light";

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

// 하위 페이지 머리: 첫 줄 display(간판 글자처럼 켜짐), 둘째 줄 h2. align으로 둘째 줄 위치를 페이지마다 다르게
export default function PageHead({
  a,
  b,
  capL,
  capR,
  align = "left",
  children,
}: {
  a: string;
  b: string;
  capL: string;
  capR?: string;
  align?: "left" | "indent" | "right";
  children?: React.ReactNode;
}) {
  return (
    <section className="g page-head" data-align={align} aria-labelledby="page-title">
      <p className="t-cap" style={col("1 / 13", "1 / 5")}>
        {capL}
      </p>
      {capR && (
        <p className="t-cap mute" style={{ ...col("17 / 25", "5 / 7"), textAlign: "right" }}>
          {capR}
        </p>
      )}
      <h1 id="page-title" style={col("1 / 25")} data-light>
        <span className="sr-only">
          {a} {b}
        </span>
        <span className="a t-display" aria-hidden="true">
          <Light text={a} />
        </span>
        <span className="b t-h2" aria-hidden="true">
          <Light text={b} start={Array.from(a).length} />
        </span>
      </h1>
      {children}
    </section>
  );
}
