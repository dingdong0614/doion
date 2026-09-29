"""사이트 글자만 담은 Pretendard Variable 서브셋 두 벌 만들기 (docs/font-subset.md).

1. app, components, data, lib 의 .ts/.tsx/.md/.json 에서 쓰인 글자 + ASCII 0x20~0x7E + 기본 기호를 모은다.
2. PretendardVariable.ttf(npm pretendard, dist/public/variable)의 굵기 축을 200~800으로 줄인다.
3. 첫 화면용: app/fonts/critical-chars.txt(scripts/critical-chars.py) + ASCII -> app/fonts/PretendardCritical.woff2 (preload)
   전체: 1의 글자 전부 -> public/fonts/PretendardSubset.woff2 (FontFallback이 한가할 때 붙임)
실행: python3 scripts/font-subset.py <PretendardVariable.ttf 경로>   (fonttools, brotli 필요)
"""
import subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIRS = ["app", "components", "data", "lib"]
EXTRA = "·…‘’“”「」『』○×→←↑↓%~₩©®™"

chars = set(chr(c) for c in range(0x20, 0x7F)) | set(EXTRA)
for d in SRC_DIRS:
    for p in (ROOT / d).rglob("*"):
        if p.suffix in {".ts", ".tsx", ".md", ".json"} and "fonts" not in p.parts:
            chars |= set(p.read_text(encoding="utf-8"))
chars = {c for c in chars if c.isprintable() or c == " "}

ttf = sys.argv[1]
ascii_extra = set(chr(c) for c in range(0x20, 0x7F)) | set(EXTRA)
critical = ascii_extra | set((ROOT / "app/fonts/critical-chars.txt").read_text(encoding="utf-8"))
with tempfile.TemporaryDirectory() as tmp:
    inst = Path(tmp) / "inst.ttf"
    subprocess.run([sys.executable, "-m", "fontTools.varLib.instancer", ttf, "wght=200:800", "-o", str(inst)], check=True)
    for name, cs, out in [
        ("critical", critical, ROOT / "app/fonts/PretendardCritical.woff2"),
        ("full", chars, ROOT / "public/fonts/PretendardSubset.woff2"),
    ]:
        txt = Path(tmp) / f"{name}.txt"
        txt.write_text("".join(sorted(cs)), encoding="utf-8")
        subprocess.run(
            [
                "pyftsubset", str(inst), f"--text-file={txt}", "--flavor=woff2",
                "--layout-features=kern,liga,calt,tnum,lnum,ccmp,locl,mark,mkmk",
                f"--output-file={out}",
            ],
            check=True,
        )
        hangul = sum(1 for c in cs if "\uac00" <= c <= "\ud7a3")
        print(f"{name}: 한글 {hangul}자, 전체 {len(cs)}자 -> {out.relative_to(ROOT)} {out.stat().st_size // 1024}KB")
