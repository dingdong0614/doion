"""배포 전 자동 검사 (2026-09-29 독립 채점에서 보고와 실측이 달랐던 항목을 기계 검사로).

검사
1. 저장소 전체 긴 대시(U+2014)·이모지 grep (node_modules, .next, .git 제외. AGENTS.md는 next dev가 자동 생성·재작성하는 영문 안내라 제외)
2. 페이지 x (1440x900 데스크톱, 390x844 모바일 터치)
   - 콘솔·페이지 에러 0 (404 페이지 문서 자체의 404 응답 1줄은 정상이라 제외)
   - 문서 가로 넘침 0, 내부 가로 스크롤 0 (의도한 손 넘김 트랙 .track, 상호 띠 .strip 제외)
   - 터치 영역 48x48px 미만 0 (보이는 a, button, select, textarea, summary, 입력칸, 라벨 칩·동의 라벨 전수. 문장 속 링크도 예외 없음)
   - 제목·선언문 한 단어 외톨이 줄 0 (h1, h2, h3, .t-h2, .t-st, .promise li. 줄 span으로 나눈 제목은 줄마다 검사, br로 나눈 제목은 설계 줄바꿈이라 제외)
3. (--lighthouse) 페이지마다 Lighthouse 모바일 3회 중앙값: 성능 90 이상, LCP 2.5초 이하, CLS 0.1 이하
실행: next build && next start 뒤
  python3 scripts/verify.py http://localhost:3000            (1, 2)
  CHROME_PATH=<chromium> python3 scripts/verify.py http://localhost:3000 --lighthouse   (1, 2, 3)
필요: pip install playwright && playwright install chromium, Lighthouse는 npx lighthouse
하나라도 실패하면 종료 코드 1.
"""
import asyncio, json, os, re, statistics, subprocess, sys, tempfile
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = next((a for a in sys.argv[1:] if a.startswith("http")), "http://localhost:3000").rstrip("/")
PAGES = ["/", "/portfolio", "/pricing", "/process", "/contact", "/privacy", "/__verify-404"]
SIZES = [("1440", {"width": 1440, "height": 900}, False), ("390", {"width": 390, "height": 844}, True)]
DASH = chr(0x2014)
EMOJI = re.compile("[" + "".join(f"{chr(a)}-{chr(b)}" for a, b in [(0x1F000, 0x1FAFF), (0x2600, 0x27BF), (0x2B00, 0x2BFF)]) + chr(0xFE0F) + "]")
fails = []


def repo_scan():
    out = []
    for root, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".next", ".git")]
        for f in files:
            p = Path(root) / f
            if p.name == "AGENTS.md":
                continue
            try:
                text = p.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            for i, line in enumerate(text.splitlines(), 1):
                if DASH in line or EMOJI.search(line):
                    out.append(f"{p.relative_to(ROOT)}:{i}")
    return out


PAGE_JS = """() => {
  // 화면 밖 구간(.cv)을 전부 그려 두고 검사
  document.querySelectorAll('.cv').forEach(e => e.style.contentVisibility = 'visible');
  const vis = (e) => {
    if (e.closest('.sr-only, .hp, [aria-hidden="true"], [hidden]')) return false;
    const c = getComputedStyle(e);
    if (c.display === 'none' || c.visibility === 'hidden') return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const de = document.documentElement;
  const res = { overflow: de.scrollWidth - de.clientWidth, inner: [], small: [], orphans: [] };
  for (const e of document.querySelectorAll('body *')) {
    const c = getComputedStyle(e);
    if ((c.overflowX === 'auto' || c.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 1 && !e.closest('.track, .strip') && vis(e))
      res.inner.push(e.tagName + '.' + e.className + ' ' + e.scrollWidth + '>' + e.clientWidth);
  }
  const sel = 'a[href], button, select, textarea, summary, input:not([type=hidden]):not([type=radio]):not([type=checkbox]), label.chip, label.check';
  for (const e of document.querySelectorAll(sel)) {
    if (e.classList.contains('skip')) continue; // 초점 전에는 화면 밖(초점 시 48px)
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 48 || r.height < 48) res.small.push((e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  // 수동 줄 구조(.ln, .a/.b)가 있는 제목은 줄 하나하나를, br로 나눈 제목은 제외(설계한 줄바꿈)
  const heads = [...document.querySelectorAll('h1, h2, h3, .t-h2, .t-st, .promise li')].filter(e => !e.querySelector('br, .ln, .a, .b, .hero-a'));
  const targets = [...heads, ...document.querySelectorAll('.ln > span, h1 .b, .hero-b')];
  for (const e of targets) {
    if (!vis(e) || e.closest('.cover, .loader')) continue;
    const words = [];
    const walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const n = walk.currentNode;
      if (n.parentElement.closest('.sr-only')) continue;
      const re = /\\S+/g; let m;
      while ((m = re.exec(n.textContent))) {
        const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
        const rs = rg.getClientRects(); if (!rs.length) continue;
        words.push({ w: m[0], top: Math.round(rs[rs.length - 1].top) });
      }
    }
    const lines = [...new Set(words.map(x => x.top))].sort((a, b) => a - b);
    if (lines.length > 1) {
      const last = words.filter(x => x.top === lines[lines.length - 1]);
      if (last.length === 1) res.orphans.push(e.textContent.trim().slice(0, 30) + ' / 외톨이: ' + last[0].w);
    }
  }
  return res;
}"""


async def page_checks():
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, mobile in SIZES:
            ctx = await b.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile)
            for path in PAGES:
                pg = await ctx.new_page()
                errs = []
                pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
                pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.goto(BASE + path + "?noloader", wait_until="networkidle")
                await pg.mouse.move(5, 5)
                await pg.wait_for_timeout(1500)
                r = await pg.evaluate(PAGE_JS)
                await pg.wait_for_timeout(300)
                if path.startswith("/__verify-404"):
                    errs = [e for e in errs if "status of 404" not in e]
                r["errors"] = errs
                out[f"{name} {path}"] = r
                for k in ("inner", "small", "orphans", "errors"):
                    if r[k]:
                        fails.append(f"{name} {path} {k}: {r[k]}")
                if r["overflow"] > 0:
                    fails.append(f"{name} {path} overflow {r['overflow']}px")
                await pg.close()
            await ctx.close()
        await b.close()
    return out


def lighthouse():
    out = {}
    tmp = tempfile.mkdtemp()
    for path in PAGES[:-1]:
        runs = []
        for i in range(3):
            f = f"{tmp}/lh{i}.json"
            subprocess.run(
                ["npx", "-y", "lighthouse", BASE + path, "--quiet", "--chrome-flags=--headless=new --no-sandbox",
                 "--only-categories=performance,accessibility,seo,best-practices", "--output=json", f"--output-path={f}"],
                check=False, capture_output=True,
            )
            d = json.load(open(f))
            a = d["audits"]
            runs.append({
                "perf": round(d["categories"]["performance"]["score"] * 100),
                "a11y": round(d["categories"]["accessibility"]["score"] * 100),
                "lcp": a["largest-contentful-paint"]["numericValue"],
                "cls": a["cumulative-layout-shift"]["numericValue"],
            })
        med = {k: statistics.median(r[k] for r in runs) for k in runs[0]}
        out[path] = {"runs": runs, "median": med}
        if med["perf"] < 90 or med["lcp"] > 2500 or med["cls"] > 0.1:
            fails.append(f"lighthouse {path} median perf {med['perf']} LCP {med['lcp']:.0f}ms CLS {med['cls']:.3f}")
    return out


if __name__ == "__main__":
    report = {"repo_dash_emoji": repo_scan()}
    if report["repo_dash_emoji"]:
        fails.append(f"repo dash/emoji: {report['repo_dash_emoji']}")
    report["pages"] = asyncio.run(page_checks())
    if "--lighthouse" in sys.argv:
        report["lighthouse"] = lighthouse()
    report["fails"] = fails
    print(json.dumps(report, ensure_ascii=False, indent=1))
    sys.exit(1 if fails else 0)
