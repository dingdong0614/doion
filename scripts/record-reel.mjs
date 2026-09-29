// 사례 릴을 라이브 사이트 스크롤 녹화본으로 바꾸기(대표 PC에서 실행).
// 작업 환경에서는 vercel.app 접속이 막혀 캡처 넘김 영상(scripts/make-reel.py)으로 대신했다.
// 준비: npm i -D playwright && npx playwright install chromium   (ffmpeg 필요)
// 실행: node scripts/record-reel.mjs            -> public/assets/video/reel.webm, reel.mp4, reel-poster.jpg 덮어씀
// 사이트 목록은 data/portfolio.ts 순서와 같게(데모 포함 8곳). 2MB 넘으면 CRF 값을 올린다.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, renameSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SITES = (process.env.REEL_SITES ?? [
  "https://ptholic-1.vercel.app",
  "https://yuljeonfood.co.kr",
  "https://bbadoom-music.vercel.app",
  "https://keyhoon.vercel.app",
  "https://jangan-equipment.vercel.app",
  "https://chedae-ipsi.vercel.app",
  "https://care-demo-git-main-me-68b9.vercel.app",
  "https://dasom-church-demo.vercel.app",
].join(",")).split(",");
const W = 600, H = 750; // 4:5, 사이트 모바일 폭 390을 1.54배로 녹화
const OUT = "public/assets/video";

const dir = mkdtempSync(join(tmpdir(), "reel-"));
const browser = await chromium.launch();
const parts = [];
for (const [i, url] of SITES.entries()) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 488 },
    deviceScaleFactor: W / 390,
    recordVideo: { dir, size: { width: W, height: H } },
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" }).catch(() => undefined);
  await page.waitForTimeout(600);
  // 1.8초 동안 천천히 아래로(사이트 쪽 스크롤 연출이 보이도록 휠 대신 scrollTo 보간)
  await page.evaluate(async () => {
    const end = Math.min(document.documentElement.scrollHeight - innerHeight, 1400);
    const t0 = performance.now();
    await new Promise((res) => {
      const step = (t) => {
        const p = Math.min((t - t0) / 1800, 1);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        scrollTo(0, end * e);
        if (p < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });
  });
  await page.waitForTimeout(500);
  const video = page.video();
  await ctx.close();
  const src = await video.path();
  const dst = join(dir, `part${i}.webm`);
  renameSync(src, dst);
  parts.push(dst);
}
await browser.close();

// 각 조각의 첫 0.4초(로딩)를 자르고 이어 붙인다
const list = join(dir, "list.txt");
const trimmed = parts.map((p, i) => {
  const t = join(dir, `t${i}.mp4`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "0.4", "-i", p, "-an", "-r", "24", "-vf", `scale=${W}:${H}`, "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", t]);
  return t;
});
writeFileSync(list, trimmed.map((t) => `file '${t}'`).join("\n"));
const joined = join(dir, "joined.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", joined]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", joined, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", join(OUT, "reel.webm")]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", joined, "-an", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, "reel.mp4")]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", joined, "-frames:v", "1", "-q:v", "4", join(OUT, "reel-poster.jpg")]);
for (const f of ["reel.webm", "reel.mp4", "reel-poster.jpg"]) console.log(f, Math.round(statSync(join(OUT, f)).size / 1024), "KB");
