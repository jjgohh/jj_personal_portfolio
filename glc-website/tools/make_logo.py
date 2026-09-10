#!/usr/bin/env python3
"""
Generate the Global Land Consortium wordmark suite.

    python3 tools/make_logo.py

A plain lettermark: GLC set in Archivo Bold with a cyan rule beneath it, and
lockups that pair it with the full registered company name. No pictorial device
— the client asked for the wording only.

Letterforms are converted to real outlines from the Archivo files in src/fonts
(SIL Open Font License, which permits this), so a printer or signmaker without
the font installed still gets the correct shapes and cannot substitute another
typeface.

Nothing here is traced or adapted from any existing logo. That addresses
copyright in the artwork. It does NOT clear the mark for trade mark use — see
docs/logo-and-trademark.md, and note the caution there about the initials.
"""
import json, os, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "brand"
FONTS = ROOT / "src" / "fonts"
NODE_CWD = ("/tmp/claude-0/-home-user-jj-personal-portfolio/"
            "b0b4eaf6-7ae2-542b-8d4f-296c5064a7e6/scratchpad")

NAVY, CYAN, PAPER = "#14212F", "#00A0E0", "#EDEFF1"
BLACK, WHITE = "#000000", "#FFFFFF"

ARCHIVO_700 = "archivo-latin-700-normal.ttf"
PLEX_400 = "ibm-plex-mono-latin-400-normal.ttf"

# The wordmark's proportions, in units of the cap height.
RULE = 0.155      # thickness of the cyan rule
GAP = 0.24        # space between baseline and rule
OVER = 0.16       # how far the rule runs past the letters, each side
TRACK = 0.035     # letter tracking


def svg(w, h, body, title=""):
    t = f"<title>{title}</title>" if title else ""
    hidden = "" if title else ' aria-hidden="true"'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" '
            f'width="{w:g}" height="{h:g}" role="img"{hidden}>{t}{body}</svg>\n')


def outline(text, font_file, size, tracking=0.0, fill=NAVY):
    """Return (svg_group, advance_width, cap_height); text becomes real paths."""
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen

    f = TTFont(FONTS / font_file)
    upm = f["head"].unitsPerEm
    cap = getattr(f["OS/2"], "sCapHeight", upm * 0.7)
    cmap, gs, hmtx = f.getBestCmap(), f.getGlyphSet(), f["hmtx"]
    k = size / upm
    track = tracking / k
    pen = SVGPathPen(gs)
    x = 0.0
    for ch in text:
        g = cmap.get(ord(ch))
        if g is None:
            x += upm * 0.3 + track
            continue
        gs[g].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
        x += hmtx[g][0] + track
    return (f'<g transform="scale({k:.6f},{-k:.6f})">'
            f'<path d="{pen.getCommands()}" fill="{fill}"/></g>',
            (x - track) * k, cap * k)


def wordmark(ink=NAVY, rule=CYAN, cap=64):
    """GLC with the cyan rule. The primary mark."""
    letters, lw, ch = outline("GLC", ARCHIVO_700, cap / 0.72, TRACK * cap, ink)
    over, gap, rh = OVER * cap, GAP * cap, RULE * cap
    w, h = lw + over * 2, ch + gap + rh
    body = (f'<g transform="translate({over:.2f},{ch:.2f})">{letters}</g>'
            f'<rect x="0" y="{ch + gap:.2f}" width="{w:.2f}" height="{rh:.2f}" '
            f'fill="{rule}"/>')
    return svg(round(w, 1), round(h, 1), body, "GLC — Global Land Consortium")


def _lockup_parts(ink, sub, name_size, sub_size):
    name, nw, ncap = outline("GLOBAL LAND CONSORTIUM", ARCHIVO_700,
                             name_size, name_size * 0.07, ink)
    line2, lw, lcap = outline("SDN BHD  ·  1089230-X", PLEX_400,
                              sub_size, sub_size * 0.07, sub)
    return name, nw, ncap, line2, lw, lcap


def horizontal(ink=NAVY, rule=CYAN, sub=None):
    """Lettermark left, registered name right. Letterhead, header, invoices."""
    sub = sub or ink
    CAP = 34
    letters, lw0, ch = outline("GLC", ARCHIVO_700, CAP / 0.72, TRACK * CAP, ink)
    over, gap, rh = OVER * CAP, GAP * CAP, RULE * CAP
    mw = lw0 + over * 2
    mh = ch + gap + rh
    name, nw, ncap, line2, l2w, lcap = _lockup_parts(ink, sub, 19, 12)
    divx = mw + 20
    tx = divx + 20
    body = (f'<g transform="translate({over:.2f},{ch:.2f})">{letters}</g>'
            f'<rect x="0" y="{ch + gap:.2f}" width="{mw:.2f}" height="{rh:.2f}" '
            f'fill="{rule}"/>'
            f'<rect x="{divx:.2f}" y="0" width="1" height="{mh:.2f}" fill="{sub}" '
            f'opacity=".35"/>'
            f'<g transform="translate({tx:.2f},{ncap + 2:.2f})">{name}</g>'
            f'<g transform="translate({tx:.2f},{ncap + 22:.2f})">{line2}</g>')
    W = tx + max(nw, l2w) + 2
    return svg(round(W, 1), round(mh, 1), body, "Global Land Consortium Sdn Bhd")


def stacked(ink=NAVY, rule=CYAN, sub=None):
    """Lettermark over the name. Signboards, shirts, vehicle doors."""
    sub = sub or ink
    CAP = 58
    letters, lw0, ch = outline("GLC", ARCHIVO_700, CAP / 0.72, TRACK * CAP, ink)
    over, gap, rh = OVER * CAP, GAP * CAP, RULE * CAP
    mw, mh = lw0 + over * 2, ch + gap + rh
    name, nw, ncap, line2, l2w, lcap = _lockup_parts(ink, sub, 18, 11.5)
    W = max(mw, nw, l2w)
    body = (f'<g transform="translate({(W - mw) / 2 + over:.2f},{ch:.2f})">{letters}</g>'
            f'<rect x="{(W - mw) / 2:.2f}" y="{ch + gap:.2f}" width="{mw:.2f}" '
            f'height="{rh:.2f}" fill="{rule}"/>'
            f'<g transform="translate({(W - nw) / 2:.2f},{mh + 34:.2f})">{name}</g>'
            f'<g transform="translate({(W - l2w) / 2:.2f},{mh + 55:.2f})">{line2}</g>')
    return svg(round(W, 1), round(mh + 64, 1), body,
               "Global Land Consortium Sdn Bhd")


def badge(bg=NAVY, ink=PAPER, rule=CYAN, size=64):
    """GLC in a filled square. Favicon, avatars, Google Business Profile."""
    CAP = size * 0.30
    letters, lw, ch = outline("GLC", ARCHIVO_700, CAP / 0.72, TRACK * CAP, ink)
    rh = max(2, round(size * 0.055))
    gap = size * 0.085
    bh = ch + gap + rh
    x0, y0 = (size - lw) / 2, (size - bh) / 2
    body = (f'<rect width="{size}" height="{size}" fill="{bg}"/>'
            f'<g transform="translate({x0:.2f},{y0 + ch:.2f})">{letters}</g>'
            f'<rect x="{x0:.2f}" y="{y0 + ch + gap:.2f}" width="{lw:.2f}" '
            f'height="{rh}" fill="{rule}"/>')
    return svg(size, size, body, "GLC — Global Land Consortium")


FILES = {
    "glc-wordmark.svg":               lambda: wordmark(),
    "glc-wordmark-reversed.svg":      lambda: wordmark(PAPER, CYAN),
    "glc-wordmark-mono-black.svg":    lambda: wordmark(BLACK, BLACK),
    "glc-wordmark-mono-white.svg":    lambda: wordmark(WHITE, WHITE),
    "glc-horizontal.svg":             lambda: horizontal(),
    "glc-horizontal-reversed.svg":    lambda: horizontal(PAPER, CYAN, PAPER),
    "glc-horizontal-mono-black.svg":  lambda: horizontal(BLACK, BLACK, BLACK),
    "glc-stacked.svg":                lambda: stacked(),
    "glc-stacked-reversed.svg":       lambda: stacked(PAPER, CYAN, PAPER),
    "glc-stacked-mono-black.svg":     lambda: stacked(BLACK, BLACK, BLACK),
    "glc-badge.svg":                  lambda: badge(),
}

PNG = [("glc-badge.svg", "glc-icon-1024.png", 1024),
       ("glc-badge.svg", "glc-icon-512.png", 512),
       ("glc-badge.svg", "glc-icon-180.png", 180),
       ("glc-horizontal.svg", "glc-horizontal-1600.png", 1600),
       ("glc-stacked.svg", "glc-stacked-1200.png", 1200)]


def rasterise(pairs):
    chrome = "/opt/pw-browsers/chromium"
    if not os.path.exists(chrome):
        print("  ! Chromium not found — skipping PNG export")
        return
    jobs = [{"src": str(OUT / a), "out": str(OUT / b), "w": w} for a, b, w in pairs]
    js = """
import {chromium} from 'playwright';
import {readFileSync} from 'fs';
const jobs = %s;
const b = await chromium.launch({executablePath: %s});
for (const j of jobs) {
  const svg = readFileSync(j.src, 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/\\s+/).map(Number);
  const h = Math.round(j.w * vb[3] / vb[2]);
  const p = await b.newPage({viewport: {width: j.w, height: h}});
  await p.setContent('<style>html,body{margin:0;background:transparent}'
    + 'svg{display:block;width:100vw;height:auto}</style>' + svg);
  await p.screenshot({path: j.out, omitBackground: true});
  await p.close();
  console.log('  ' + j.out.split('/').pop() + '  ' + j.w + 'x' + h);
}
await b.close();
""" % (json.dumps(jobs), json.dumps(chrome))
    script = Path(NODE_CWD) / "_glc_shot.mjs"
    script.write_text(js)
    r = subprocess.run(["node", str(script)], capture_output=True, text=True,
                       cwd=NODE_CWD)
    print((r.stdout or "").rstrip() or (r.stderr or "").rstrip()[:400])
    script.unlink(missing_ok=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("glc-mark*"):        # the withdrawn pictorial mark
        old.unlink()
    for old in OUT.glob("glc-wordmark-initials*"):
        old.unlink()
    for name, fn in FILES.items():
        (OUT / name).write_text(fn())
    print(f"  {len(FILES)} SVG files in src/brand/")
    rasterise(PNG)


if __name__ == "__main__":
    main()
