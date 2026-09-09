#!/usr/bin/env python3
"""
Generate the Global Land Consortium logo suite.

    python3 tools/make_logo.py

Everything is drawn from the geometry defined below on a 64-unit grid, so the
whole suite is one construction rather than a drawing that has been redrawn by
hand at each size. Wordmarks are converted to real outlines from the Archivo
font files, so an SVG opened on a machine without Archivo installed still shows
the correct letterforms.

Originality: every shape here is a rectangle placed on a stated grid, or a
letterform outlined from Archivo (SIL Open Font License, which permits this).
Nothing is traced from, adapted from, or derived from any existing logo. That
addresses copyright in the artwork. It does NOT clear the mark for trade mark
use — see docs/logo-and-trademark.md.
"""
import os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "brand"
FONTS = ROOT / "src" / "fonts"
NODE_CWD = ("/tmp/claude-0/-home-user-jj-personal-portfolio/"
            "b0b4eaf6-7ae2-542b-8d4f-296c5064a7e6/scratchpad")

NAVY   = "#14212F"
CYAN   = "#00A0E0"
PAPER  = "#EDEFF1"
BLACK  = "#000000"
WHITE  = "#FFFFFF"

# ── the mark, on a 64-unit grid ──────────────────────────────────────────
# A portal frame standing on the ground.
#   column + beam  = the frame we build (navy)
#   ground bar     = the land, and it runs wider than the frame on both sides
# Read together: a building section, and a steel portal frame of the kind in
# the company's own warehouse photographs.
G = dict(
    ground=dict(x=3,  y=47, w=58, h=11),   # x  3 → 61
    column=dict(x=11, y=9,  w=11, h=38),   # y  9 → 47, sits on the ground
    beam  =dict(x=11, y=9,  w=42, h=11),   # x 11 → 53
)
BOX = (0, 0, 64, 64)          # nominal canvas
INK_BOUNDS = (3, 9, 61, 58)   # actual drawn extent: x3–61, y9–58

def rect(r, fill):
    return (f'<rect x="{r["x"]}" y="{r["y"]}" width="{r["w"]}" '
            f'height="{r["h"]}" fill="{fill}"/>')

def mark(frame=NAVY, ground=CYAN):
    return (rect(G["ground"], ground) + rect(G["beam"], frame)
            + rect(G["column"], frame))

def svg(w, h, body, vb=None, title=""):
    vb = vb or f"0 0 {w} {h}"
    t = f"<title>{title}</title>" if title else ""
    hidden = "" if title else ' aria-hidden="true"'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'width="{w}" height="{h}" role="img"{hidden}>{t}{body}</svg>\n')

# ── text to outlines ─────────────────────────────────────────────────────
def outline(text, font_file, size, tracking=0.0, fill=NAVY):
    """Return (svg_group, advance_width, cap_height) with text as real paths."""
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen

    f = TTFont(FONTS / font_file)
    upm = f["head"].unitsPerEm
    cap = f["OS/2"].sCapHeight if hasattr(f["OS/2"], "sCapHeight") else upm * 0.7
    cmap = f.getBestCmap()
    gs = f.getGlyphSet()
    hmtx = f["hmtx"]

    k = size / upm
    track_units = tracking / k          # tracking given in output units
    pen_out = SVGPathPen(gs)
    x = 0.0
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            x += upm * 0.3 + track_units
            continue
        tp = TransformPen(pen_out, (1, 0, 0, 1, x, 0))
        gs[gname].draw(tp)
        x += hmtx[gname][0] + track_units
    total = (x - track_units) * k
    d = pen_out.getCommands()
    g = (f'<g transform="scale({k:.6f},{-k:.6f})">'
         f'<path d="{d}" fill="{fill}"/></g>')
    return g, total, cap * k

# ── lockups ──────────────────────────────────────────────────────────────
ARCHIVO_700 = "archivo-latin-700-normal.ttf"
ARCHIVO_500 = "archivo-latin-500-normal.ttf"
PLEX_400 = "ibm-plex-mono-latin-400-normal.ttf"

def horizontal(frame=NAVY, ground=CYAN, ink=NAVY, sub=None):
    """Mark on the left, two lines of type on the right. For headers, letterheads."""
    sub = sub or ink
    MS = 52                     # mark height in output units
    s = MS / 49                 # the mark's drawn height is 49 units (y9–58)
    mw = 58 * s                 # drawn width is 58 units
    gap = 22
    name, nw, ncap = outline("GLOBAL LAND CONSORTIUM", ARCHIVO_700, 20, 1.35, ink)
    line2, lw, lcap = outline("SDN BHD  ·  1089230-X", PLEX_400, 12.5, 0.9, sub)
    tx = mw + gap
    # optical centring: cap height of line 1 sits above the baseline
    y1 = 26 + ncap / 2
    y2 = y1 + 20
    body = (f'<g transform="translate(0,0) scale({s:.5f}) '
            f'translate({-INK_BOUNDS[0]},{-INK_BOUNDS[1]})">{mark(frame, ground)}</g>'
            f'<g transform="translate({tx:.2f},{y1:.2f})">{name}</g>'
            f'<g transform="translate({tx:.2f},{y2:.2f})">{line2}</g>')
    W = tx + max(nw, lw) + 2
    return svg(round(W, 1), 56, body, f"0 0 {W:.1f} 56",
               "Global Land Consortium Sdn Bhd")

def stacked(frame=NAVY, ground=CYAN, ink=NAVY, sub=None):
    """Mark above the name. For signage, site boards, shirts, stamps."""
    sub = sub or ink
    MS = 72
    s = MS / 49
    mw = 58 * s
    name, nw, ncap = outline("GLOBAL LAND CONSORTIUM", ARCHIVO_700, 19, 1.3, ink)
    line2, lw, lcap = outline("SDN BHD  ·  1089230-X", PLEX_400, 12, 0.85, sub)
    W = max(mw, nw, lw)
    body = (f'<g transform="translate({(W-mw)/2:.2f},0) scale({s:.5f}) '
            f'translate({-INK_BOUNDS[0]},{-INK_BOUNDS[1]})">{mark(frame, ground)}</g>'
            f'<g transform="translate({(W-nw)/2:.2f},{MS+34:.2f})">{name}</g>'
            f'<g transform="translate({(W-lw)/2:.2f},{MS+56:.2f})">{line2}</g>')
    H = MS + 66
    return svg(round(W, 1), H, body, f"0 0 {W:.1f} {H}",
               "Global Land Consortium Sdn Bhd")

def badge(bg=NAVY, frame=PAPER, ground=CYAN, size=64):
    """The mark inside a filled square. Favicon, avatar, social, app icon."""
    inner = size * 0.62
    s = inner / 49
    mw, mh = 58 * s, 49 * s
    body = (f'<rect width="{size}" height="{size}" fill="{bg}"/>'
            f'<g transform="translate({(size-mw)/2:.2f},{(size-mh)/2:.2f}) '
            f'scale({s:.5f}) translate({-INK_BOUNDS[0]},{-INK_BOUNDS[1]})">'
            f'{mark(frame, ground)}</g>')
    return svg(size, size, body, f"0 0 {size} {size}", "Global Land Consortium")

def mark_only(frame=NAVY, ground=CYAN):
    w, h = 58, 49
    body = (f'<g transform="translate({-INK_BOUNDS[0]},{-INK_BOUNDS[1]})">'
            f'{mark(frame, ground)}</g>')
    return svg(w, h, body, f"0 0 {w} {h}", "Global Land Consortium")

def wordmark_glc(ink=NAVY, rule=CYAN):
    """Alternative B: the initials with the datum rule. No pictorial mark."""
    letters, lw, cap = outline("GLC", ARCHIVO_700, 64, 2.0, ink)
    RULE_H, OVER = 9, 10
    W = lw + OVER * 2
    body = (f'<g transform="translate({OVER},{cap:.2f})">{letters}</g>'
            f'<rect x="0" y="{cap + 14:.2f}" width="{W:.1f}" height="{RULE_H}" '
            f'fill="{rule}"/>')
    H = cap + 14 + RULE_H
    return svg(round(W, 1), round(H, 1), body, f"0 0 {W:.1f} {H:.1f}",
               "GLC — Global Land Consortium")

# ── export ───────────────────────────────────────────────────────────────
FILES = {
    # primary — full colour
    "glc-mark.svg":                 lambda: mark_only(),
    "glc-horizontal.svg":           lambda: horizontal(),
    "glc-stacked.svg":              lambda: stacked(),
    "glc-badge.svg":                lambda: badge(),
    # reversed, for navy or photographic backgrounds
    "glc-mark-reversed.svg":        lambda: mark_only(PAPER, CYAN),
    "glc-horizontal-reversed.svg":  lambda: horizontal(PAPER, CYAN, PAPER, PAPER),
    "glc-stacked-reversed.svg":     lambda: stacked(PAPER, CYAN, PAPER, PAPER),
    # one colour — stamps, faxes, embroidery, engraving, single-colour print
    "glc-mark-mono-navy.svg":       lambda: mark_only(NAVY, NAVY),
    "glc-mark-mono-black.svg":      lambda: mark_only(BLACK, BLACK),
    "glc-mark-mono-white.svg":      lambda: mark_only(WHITE, WHITE),
    "glc-horizontal-mono-black.svg":lambda: horizontal(BLACK, BLACK, BLACK, BLACK),
    "glc-stacked-mono-black.svg":   lambda: stacked(BLACK, BLACK, BLACK, BLACK),
    # alternative B
    "glc-wordmark-initials.svg":    lambda: wordmark_glc(),
    "glc-wordmark-initials-reversed.svg": lambda: wordmark_glc(PAPER, CYAN),
}

PNG = [("glc-badge.svg", "glc-icon-1024.png", 1024),
       ("glc-badge.svg", "glc-icon-512.png", 512),
       ("glc-badge.svg", "glc-icon-180.png", 180),
       ("glc-horizontal.svg", "glc-horizontal-1600.png", 1600),
       ("glc-stacked.svg", "glc-stacked-1200.png", 1200)]

def rasterise(pairs):
    """Render SVG to PNG with the headless Chromium that is already installed."""
    import json
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
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
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
    script = Path(NODE_CWD) / "_glc_shot.mjs"   # node resolves imports from here
    script.write_text(js)
    r = subprocess.run(["node", str(script)], capture_output=True, text=True,
                       cwd=NODE_CWD)
    print((r.stdout or "").rstrip() or (r.stderr or "").rstrip()[:500])
    script.unlink(missing_ok=True)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in FILES.items():
        (OUT / name).write_text(fn())
    print(f"  {len(FILES)} SVG files in src/brand/")
    rasterise(PNG)

if __name__ == "__main__":
    main()
