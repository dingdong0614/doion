import { layout } from "../components/CaseMosaic";
import { portfolio } from "../data/portfolio";
import assert from "node:assert";
for (let n = 1; n <= portfolio.length; n++) {
  const cells = layout(portfolio.slice(0, n));
  assert.equal(cells.length, n);
  let w = 0;
  for (const c of cells) { w += c.span; assert(w <= 12, `n=${n} overflow`); if (w === 12) w = 0; }
  assert.equal(w, 0, `n=${n} 빈칸`);
  console.log(n, cells.map((c) => `${c.span}${c.kind}`).join(" "));
}
