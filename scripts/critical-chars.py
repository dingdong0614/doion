"""첫 화면 글자 모으기(첫 화면용 작은 폰트 서브셋 재료).

next start 로 띄운 사이트에서 페이지마다 390x844, 1440x900 첫 화면에 보이는 글자와
헤더·모바일 메뉴·하단 바·로더·페이지 전환 덮개에 나올 수 있는 글자를 모아 app/fonts/critical-chars.txt 로 저장한다.
실행: python3 scripts/critical-chars.py [http://localhost:3000]   (playwright 필요)
문구를 바꾸면 이 스크립트 다음 scripts/font-subset.py 를 실행한다. 빠진 글자는 전체 서브셋이 채우므로 깨지지는 않는다.
"""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
PAGES = ["/", "/portfolio", "/pricing", "/process", "/contact", "/404-check"]  # 처리방침은 긴 문서라 제외(전체 서브셋이 채움)
OUT = Path(__file__).resolve().parent.parent / "app/fonts/critical-chars.txt"

JS = """(vh) => {
  let t = '';
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    const n = walk.currentNode, el = n.parentElement;
    if (!el) continue;
    const fixed = el.closest('.hdr, .mnav, .m-bar, .loader, .cover, .skip');
    const r = el.getBoundingClientRect();
    if (fixed || (r.top < vh && r.bottom > 0)) t += n.textContent;
  }
  document.querySelectorAll('a[data-label]').forEach(a => t += a.dataset.label);
  return t;
}"""


async def main():
    chars = set()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w, h in [(390, 844), (1440, 900)]:
            ctx = await b.new_context(viewport={"width": w, "height": h})
            pg = await ctx.new_page()
            for path in PAGES:
                await pg.goto(BASE + path + "?noloader", wait_until="networkidle")
                chars |= set(await pg.evaluate(JS, h))
            await ctx.close()
        await b.close()
    chars = {c for c in chars if c.isprintable() and ord(c) > 0x7E}
    OUT.write_text("".join(sorted(chars)), encoding="utf-8")
    print(f"첫 화면 글자 {len(chars)}자 -> {OUT}")


asyncio.run(main())
