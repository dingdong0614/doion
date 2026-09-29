import { buildPlans, carePlans } from "@/data/offer";

const col = (c: string, cm?: string) => ({ "--c": c, ...(cm ? { "--cm": cm } : {}) }) as React.CSSProperties;

// 가격 문서: 제작비는 큰 숫자 세 줄(영수증처럼 tabular-nums), 관리비는 조밀한 세 칸.
// 추천은 배지 대신 파랑 윗선 + 글자.
export function BuildRows() {
  return (
    <div className="sub doc-row">
      <p className="t-cap doc-label" style={col("1 / 4")}>
        제작비
      </p>
      <div className="sub" style={col("4 / 25")}>
        {buildPlans.map((p) => (
          <div key={p.name} className="sub bigrow" data-rec={Boolean(p.recommended)}>
            {/* 안쪽 격자는 21컬럼(4~25) 기준 번호 */}
            <p className="plan-name" style={col("1 / 5")}>
              {p.name}
              {p.recommended && <em>추천</em>}
            </p>
            <p className="price" style={col("5 / 15")}>
              <span className="num">{p.price}</span>
              <span className="unit">만원</span>
            </p>
            <ul className="feat tight" style={col("15 / 22")}>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CareCols({ intro = true }: { intro?: boolean }) {
  return (
    <div className="sub doc-row">
      <p className="t-cap doc-label" style={col("1 / 4")}>
        관리비
      </p>
      {intro && (
        <div className="measure" style={col("4 / 25")}>
          <p className="t-st">만든 뒤 관리는 월 {carePlans.map((c) => c.price).join("·")}만원.</p>
          <p className="mute" style={{ marginTop: 8 }}>
            매달 필요한 수정만 맡기는 관리 서비스입니다. 필요할 때 신청하시면 됩니다.
          </p>
        </div>
      )}
      {carePlans.map((p, i) => (
        <div key={p.name} className="plan" style={col(["4 / 11", "11 / 18", "18 / 25"][i])}>
          <p className="plan-name">{p.name}</p>
          <p className="price sm">
            <span className="num">월 {p.price}</span>
            <span className="unit">만원</span>
          </p>
          <ul className="feat">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
