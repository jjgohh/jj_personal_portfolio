#!/usr/bin/env python3
"""
Bundle the built site into one self-contained HTML file for review.

    python3 build.py && python3 tools/make_preview.py

Reads site/ and writes preview.html: every page, every photograph and both
typefaces inlined, with the internal links rewritten to hash routes so the whole
site can be browsed from a single file. One source of truth — the preview is
generated from the real site, never hand-maintained alongside it.

The output has no <html>, <head> or <body> wrapper, because it is published as a
Claude Artifact and the wrapper is supplied at publish time.
"""
import base64, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUTFILE = ROOT.parent / "glc-site-preview.html"

if not SITE.exists():
    sys.exit("site/ not found — run `python3 build.py` first")


def url_for(p: Path) -> str:
    rel = p.relative_to(SITE).as_posix()
    if rel == "index.html":
        return "/"
    if rel == "404.html":
        return "/404"
    return "/" + rel[: -len("index.html")]


def strip_head(html: str) -> str:
    return html.split("<body>", 1)[1].rsplit("</body>", 1)[0]


# ── collect every page ───────────────────────────────────────────────────
pages, shell = {}, None
for f in sorted(SITE.rglob("*.html")):
    html = f.read_text()
    title = re.search(r"<title>(.*?)</title>", html, re.S).group(1)
    body = strip_head(html)
    m = re.search(r'<main id="main">(.*?)</main>', body, re.S)
    if not m:
        continue
    pages[url_for(f)] = {"t": title, "h": m.group(1)}
    if shell is None:
        shell = body[: m.start()] + '<main id="main"></main>' + body[m.end():]

if shell is None:
    sys.exit("no pages found")

# ── links become hash routes ─────────────────────────────────────────────
KEEP = ("http", "mailto:", "tel:", "#", "data:")


def rewrite(s: str) -> str:
    def sub(m):
        q, href = m.group(1), m.group(2)
        if href.startswith(KEEP) or href.startswith("/assets/"):
            return m.group(0)
        if href.startswith("/"):
            return f'href={q}#{href}{q}'
        return m.group(0)
    s = re.sub(r'href=(["\'])([^"\']*)\1', sub, s)
    # the enquiry form has no endpoint in a preview
    s = s.replace('action="/thanks/"', 'action="#/thanks/"')
    return s


shell = rewrite(shell)
for p in pages.values():
    p["h"] = rewrite(p["h"])

# ── photographs ─────────────────────────────────────────────────────────
# Each photograph is carried once, in a lookup the router reads. Inlining them
# into the markup instead would repeat every file on each page that shows it:
# 24 MB against 3 MB, for the same pixels.
imgs = {}
for jpg in sorted((SITE / "assets" / "img").glob("*.jpg")):
    imgs[jpg.stem] = ("data:image/jpeg;base64,"
                      + base64.b64encode(jpg.read_bytes()).decode())

def deref(s):
    return re.sub(r'src="/assets/img/([^".]+)\.jpg"', r'data-i="\1"', s)

shell = deref(shell)
for p in pages.values():
    p["h"] = deref(p["h"])

# ── inline the stylesheet, with the typefaces as data URIs ───────────────
css = (SITE / "assets" / "css" / "site.css").read_text()
for woff in sorted((SITE / "assets" / "fonts").glob("*.woff2")):
    b64 = base64.b64encode(woff.read_bytes()).decode()
    css = css.replace(f"url('/assets/fonts/{woff.name}')",
                      f"url(data:font/woff2;base64,{b64})")
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)          # drop comments
css = re.sub(r"\n\s*\n", "\n", css)

shell = re.sub(r'<a class="skip"[^>]*>.*?</a>\s*', "", shell, flags=re.S)

# ── the router ───────────────────────────────────────────────────────────
NAV = ["/projects/", "/capabilities/", "/credentials/", "/about/", "/contact/"]
script = """
(function(){
  var PAGES = %s, NAV = %s, IMGS = %s;
  var main = document.getElementById('main');
  function key(){
    var h = location.hash.replace(/^#/, '') || '/';
    return PAGES[h] ? h : (PAGES[h + '/'] ? h + '/' : '/404');
  }
  function paint(){
    var k = key(), p = PAGES[k] || PAGES['/404'] || PAGES['/'];
    main.innerHTML = p.h;
    var ph = main.querySelectorAll('[data-i]');
    for (var n = 0; n < ph.length; n++) {
      var src = IMGS[ph[n].getAttribute('data-i')];
      if (src) { ph[n].src = src; }
    }
    document.title = p.t;
    var active = '';
    for (var i = 0; i < NAV.length; i++) {
      if (k === NAV[i] || k.indexOf(NAV[i]) === 0) { active = NAV[i]; }
    }
    if (k.indexOf('/projects/') === 0) { active = '/projects/'; }
    var links = document.querySelectorAll('.hdr nav a, .drawer a');
    for (var j = 0; j < links.length; j++) {
      var href = links[j].getAttribute('href').replace(/^#/, '');
      if (href === active) { links[j].setAttribute('aria-current', 'page'); }
      else { links[j].removeAttribute('aria-current'); }
    }
    var d = document.getElementById('drawer');
    if (d) { d.removeAttribute('data-open'); }
    var b = document.getElementById('menu');
    if (b) { b.setAttribute('aria-expanded', 'false'); }
    window.scrollTo(0, 0);
  }
  addEventListener('hashchange', paint);
  paint();
  var mb = document.getElementById('menu'), dr = document.getElementById('drawer');
  if (mb && dr) {
    mb.addEventListener('click', function(){
      var open = dr.hasAttribute('data-open');
      if (open) { dr.removeAttribute('data-open'); }
      else { dr.setAttribute('data-open', ''); }
      mb.setAttribute('aria-expanded', String(!open));
    });
  }
  document.addEventListener('submit', function(e){
    e.preventDefault();
    location.hash = '/thanks/';
  });
})();
""" % (json.dumps(pages, separators=(",", ":")), json.dumps(NAV),
       json.dumps(imgs, separators=(",", ":")))

# the per-page menu script from build.py is replaced by the router's own
shell = re.sub(r"<script>\s*\(function\(\)\{\s*var b=document\.getElementById"
               r"\('menu'\).*?</script>", "", shell, flags=re.S)

note = (
    '<div style="background:#14212F;color:#EDEFF1;font:600 11px/1.5 Archivo,'
    'system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;'
    'padding:10px 20px;text-align:center">'
    'Preview of the live site &middot; every link works &middot; '
    'the enquiry form is not connected here</div>')

out = (f"<title>Global Land Consortium</title>\n<style>{css}</style>\n"
       f"{note}\n{shell}\n<script>{script}</script>\n")

left = re.findall(r'(?:src|href)="(/assets/[^"]+)"', out)
OUTFILE.write_text(out)
mb = len(out.encode()) / 1024 / 1024
print(f"  {len(pages)} pages, {len(imgs)} photographs inlined -> "
      f"{OUTFILE.name}  {mb:.2f} MB")
if mb > 15:
    sys.exit("  ! over the 16 MB artifact limit")
if left:
    print(f"  note: {len(set(left))} asset link(s) left unresolved: "
          f"{sorted(set(left))[:4]}")
