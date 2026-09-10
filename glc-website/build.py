#!/usr/bin/env python3
"""
Build the Global Land Consortium static site into site/.

    python3 build.py

Reads content/projects.extracted.json, writes plain HTML with clean URLs.
Netlify serves site/ directly: no build command, no Node, no framework.
Re-run after editing the JSON or src/site.css.

Privacy rules are enforced here, not by good intentions:
  * private individual clients are never named
  * contract values are never published
  * the deck's planning-approval titles carry lot and street numbers, so the
    address tail is cut on every residential project
A gate at the end fails the build if any of that leaks.
"""
import json, os, re, shutil, sys
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).parent
SITE = ROOT / "site"
DATA = json.loads((ROOT / "content" / "projects.extracted.json").read_text())
PHOTO_SRC = ROOT / "src" / "photos"

DOMAIN = os.environ.get("GLC_DOMAIN", "https://globallandconsortium.com").rstrip("/")

# Search engines are blocked until the client has finished the pre-launch list in
# DEPLOY.md — above all, asking the eleven named corporate clients for permission.
# The site is reachable by anyone with the link either way; this only keeps it out
# of search results. Flip it with:  GLC_PUBLISH=1 python3 build.py
INDEXABLE = os.environ.get("GLC_PUBLISH") == "1"
TEL, TEL_H = "+60379729516", "+603-7972 9516"
WA = "60379729516"
EMAIL = "infoglcsb99@gmail.com"
CO, CRN = "Global Land Consortium Sdn Bhd", "1089230-X"

MON = ["", "January", "February", "March", "April", "May", "June", "July",
       "August", "September", "October", "November", "December"]
SECTOR = {"residential": "Residential", "industrial": "Industrial", "commercial": "Commercial",
          "institutional": "Institutional", "retail": "Retail", "religious": "Religious"}
SCOPES = ["main contract", "RC structure", "steel structure & roofing",
          "renovation & A&A", "fit-out", "demolition & rebuild", "earthworks"]
SCOPE_LABEL = {
    "main contract": "Main contract building works",
    "RC structure": "Reinforced concrete structure",
    "steel structure & roofing": "Steel structure and roofing",
    "renovation & A&A": "Renovation, addition and alteration",
    "fit-out": "Interior fit-out",
    "demolition & rebuild": "Demolition and rebuild",
    "earthworks": "Earthworks and retaining structures",
}
SCOPE_SHORT = {
    "main contract": "Main contract", "RC structure": "RC structure",
    "steel structure & roofing": "Steel and roofing", "renovation & A&A": "Renovation and A&A",
    "fit-out": "Interior fit-out", "demolition & rebuild": "Demolish and rebuild",
    "earthworks": "Earthworks",
}
SCOPE_CIDB = {
    "main contract": "G6 B", "RC structure": "G6 B · CE", "steel structure & roofing": "G6 B",
    "renovation & A&A": "G6 B", "fit-out": "G6 B", "demolition & rebuild": "G6 B",
    "earthworks": "G6 CE",
}
SCOPE_WHAT = {
    "main contract": "We take the whole building: setting out, substructure, frame, envelope, finishes and handover, with a director and our own site supervisors on site and our own trades under us. Most of the buildings we have completed since 2015 were taken this way, from a small works package to an RM8.85 million business centre.",
    "RC structure": "Reinforced concrete frames, ground slabs, retaining walls and substructure, taken either inside a main contract or as a structure-only package under a main contractor. Our project director is a quantity surveyor, so a structure package is priced off the drawings rather than estimated.",
    "steel structure & roofing": "Portal frames, roof trusses, purlins, metal roofing and cladding for warehouses and factories, taken as a package on its own where a main contractor wants the structure and the envelope in one pair of hands. Our roof-truss and steel fabricator has worked with us since 2016.",
    "renovation & A&A": "Additions and alterations to buildings that are standing and often still occupied: extra storeys, extensions, re-planning, new structural openings. Careful work next to something someone already owns, on houses, a six-storey commercial block and a three-storey factory warehouse.",
    "fit-out": "Interior builder works: partitions, ceilings, joinery, finishes and services co-ordination. We fitted out retail units in six shopping malls for one client between 2015 and 2018, and delivered a RM4.8 million school interior in Rawang in four months.",
    "demolition & rebuild": "Taking down an existing house and rebuilding on the same lot, including the party-wall protection and neighbour management that make it different from building on a clear site.",
    "earthworks": "Bulk excavation, cut-and-fill platforms and reinforced concrete retaining structures, on the sloping sites that are common right across the Klang Valley.",
}

# ── photographs, mapped to projects, with honest captions ────────────────
PHOTOS = {
 "P1": [("p20_2", "Steel roof structure over the reinforced concrete frame, looking along the length of the building.", 1),
        ("p20_3", "Foundation and ground-slab works: concrete delivery, crawler crane, reinforcement cages in the excavation.", 0)],
 "P2": [("p19_2", "The completed elevation after renovation, with new vertical screening to the office frontage.", 1),
        ("p19_3", "The completed ground-floor showroom interior.", 1),
        ("p19_1", "The building during the works, with demolition arisings still on the forecourt.", 0)],
 "C1": [("p32_1", "The completed single-storey warehouse extension alongside the existing building.", 0)],
 "C3": [("p33_1", "The six-storey building on completion of the addition and alteration works.", 0)],
 "C5": [("p36_1", "The completed supermarket at Pekan Mantin.", 1)],
 "C6": [("p37_1", "Inside the completed single-storey warehouse before handover.", 0)],
 "C7": [("p23_1", "The completed three-and-a-half-storey bungalow from the street.", 1),
        ("p23_3", "The lap pool and screened side courtyard on completion.", 1)],
 "C8": [("p34_1", "The completed warehouse extension: cladding and roller shutters.", 1),
        ("p34_2", "Inside the completed extension, painted steel portal frame over the full span.", 1)],
 "C10": [("p38_1", "The completed four-storey classroom block.", 1)],
 "C11": [("p25_3", "Pool and timber deck to the rear of the house after the extension and fit-out.", 1)],
 "C12": [("p39_1", "The campus after the interior works, from the entrance road.", 1),
         ("p39_2", "Fitted joinery and wall units in a completed teaching room.", 1),
         ("p39_3", "The completed entrance lobby and reception.", 1)],
 "C13": [("p41_2", "The business centre on completion.", 0)],
 "C15": [("p26_1", "The completed house across the rear lawn.", 1),
         ("p26_3", "The swimming pool seen through the rear opening.", 1),
         ("p26_4", "Completed interior: kitchen island and dining run.", 1)],
 "C16": [("p27_1", "The rebuilt three-storey bungalow late in the works, forecourt being laid.", 0),
         ("p27_3", "The completed living room.", 1)],
 "C17": [("p42_2", "Inside the completed warehouse: the steel structure and roofing package we delivered.", 1)],
 "C18": [("p28_1", "The semi-detached house from the street during the works, site hoarding in place.", 0),
         ("p28_3", "Inside during the works: floor protection down, ceilings and openings formed.", 0)],
 "C19": [("p29_1", "The fair-faced reinforced concrete retaining wall with starter bars, in the laterite cut.", 1),
         ("p29_2", "Bulk excavation and the cut platform, with the wall line set out.", 1),
         ("p29_3", "The completed platform and the full run of the retaining wall.", 0)],
 "C22": [("p30_3", "The completed three-storey bungalow and boundary wall from the street.", 1)],
 "C24": [("p40_2", "The temple during the works, roof structure under scaffolding.", 1)],
 "R1": [("p46_1", "Completed two-storey link houses on the scheme.", 0)],
 "R3": [("p48_1", "Completed bungalows on the estate road at College Heights, Pajam.", 0)],
 "R13": [("p58_1", "The completed three-storey building at Kampung Dato' Lee Kim Sai.", 0)],
 "R18": [("p63_1", "The completed three-storey house with basement.", 0)],
}

# Sector entry tiles: how a customer self-identifies on the landing page.
TILES = [
 ("Houses and bungalows", "p26_1", "/projects/sector/residential/", "residential"),
 ("Warehouses and factories", "p34_1", "/projects/sector/industrial/", "industrial"),
 ("Shops, offices and commercial", "p36_1", "/projects/sector/commercial/", "commercial"),
 ("Interiors and fit-out", "p19_3", "/projects/scope/fit-out/", "fit-out"),
]

# Landing-page gallery: photographs first, in a deliberate order.
GALLERY = ["p20_2", "p26_1", "p34_1", "p38_1", "p19_2", "p29_1", "p36_1", "p23_3",
           "p42_2", "p30_3", "p25_3", "p40_2", "p34_2", "p19_3", "p39_2", "p27_3"]

# ── helpers ──────────────────────────────────────────────────────────────
def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", str(s).lower()).strip("-")

def fmt(ym):
    if not ym: return "—"
    if len(ym) == 4: return ym
    y, m = ym.split("-")
    return f"{MON[int(m)]} {y}"

def rm_m(n): return f"RM {n/1e6:.1f} million"

def short_title(t):
    return t if re.search(r"unverified", t, re.I) else re.sub(r"\s*\([^)]*\)\s*$", "", t)

# Cut the address tail off a planning-approval title. The scope wording before
# it is what a consultant recognises; the tail is somebody's home address.
CUT = re.compile(r"""\s(?:
      DI\s+ATAS(?:\s+SEBAHAGIAN)?\b | DI\s+NO\b | DI\s+LOT\b | DI\s+SEKSYEN\b
    | DI\s+\d | DI\s+JALAN\b | ON\s+LOT\b | ON\s+\d | AT\s+LOT\b | AT\s+NO\b | AT\s+\d
    | FOR\s+HOUSE\s+NO\b | HOUSE\s+NO\b )""", re.I | re.X)

def cut_address(t):
    m = CUT.search(t or "")
    if not m: return t, False
    head = t[:m.start()].rstrip(" ,.-")
    return (head + " […]", True) if head else (t, False)

# ── build the project model ──────────────────────────────────────────────
def build_projects():
    out = []
    for p in DATA["projects"]:
        corporate = p["client_type"] in ("corporate", "institutional", "association")
        orig, redacted = (cut_address(p["title_original"]) if p["sector"] == "residential"
                          else (p["title_original"], False))
        photos = [{"k": k, "cap": c, "hero": bool(h)} for k, c, h in PHOTOS.get(p["id"], [])]
        out.append({
            "id": p["id"], "slug": p["slug"],
            "title": short_title(p["title_en"]), "full_title": p["title_en"],
            "orig": orig, "redacted": redacted,
            "sector": p["sector"], "scope": [s for s in SCOPES if s in p["scope"]],
            "location": p["location"], "state": p["state"],
            "client": p["client"] if corporate else "Private client",
            "client_named": corporate,
            "role": ("Sub-contractor" if p["is_subcontract"] is True
                     else "Main contractor" if p["is_subcontract"] is False
                     else "Role being confirmed"),
            "start": fmt(p["start"]), "end": fmt(p["completion"]),
            "status": p["status"], "prior": p["attributed_to"] != "company",
            "value": p["contract_value_myr"], "photos": photos,
            "sortkey": p["completion"] or p["start"] or "0000",
        })
    return out

P = build_projects()
BY_ID = {p["id"]: p for p in P}
BY_SLUG = {p["slug"]: p for p in P}
IMG_OWNER = {ph["k"]: p for p in P for ph in p["photos"]}

CUR = [p for p in P if p["status"] == "current"]
COMP = sorted([p for p in P if p["status"] == "completed" and not p["prior"]],
              key=lambda p: p["sortkey"], reverse=True)
PRIOR = sorted([p for p in P if p["prior"]], key=lambda p: p["sortkey"], reverse=True)
OWN = CUR + COMP

STATS = {
    "cur_n": len(CUR), "cur_v": sum(p["value"] for p in CUR),
    "comp_n": len(COMP), "comp_v": sum(p["value"] for p in COMP),
    "prior_n": len(PRIOR), "prior_v": sum(p["value"] for p in PRIOR),
    "comp_from": min(p["end"][-4:] for p in COMP), "comp_to": max(p["end"][-4:] for p in COMP),
    "states": sorted({p["state"] for p in P}),
    "scope_n": {s: sum(1 for p in OWN if s in p["scope"]) for s in SCOPES},
}

def statline(p):
    if p["status"] == "current":
        return f'<span class="live">On site since {p["start"]}</span>'
    return f'Completed {p["end"]}'

PRIOR_NOTE = ("Delivered by our directors before Global Land Consortium was "
              "incorporated in 2015.")

# ── shell ────────────────────────────────────────────────────────────────
WA_ICON = ('<svg class="wa-i" width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 '
           '2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 '
           '1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68'
           '-1.42 1.3-1.96 1.35-.54.05-1.05.24-3.55-.74-3.02-1.19-4.9-4.32-5.05-4.52-.15-.2'
           '-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.02-2.43.27-.29.58-.37.78-.37h.56c.18 0 .42'
           '-.07.65.5.24.58.81 1.98.88 2.12.07.15.12.32.02.51-.1.2-.15.32-.29.5l-.44.53c-.15'
           '.15-.3.31-.13.61.17.29.76 1.25 1.62 2.03 1.11 1 2.04 1.31 2.33 1.46.29.15.46.12.'
           '63-.07.17-.2.73-.85.93-1.14.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.95.29.15.49.22.'
           '56.34.07.13.07.73-.17 1.41z"/></svg>')

def wa_link(msg):
    from urllib.parse import quote
    return f"https://wa.me/{WA}?text={quote(msg)}"

AC = ' aria-current="page"'          # extracted: f-strings here predate PEP 701
NAV = [("/projects/", "Projects"), ("/capabilities/", "Capabilities"),
       ("/credentials/", "Credentials"), ("/about/", "About"), ("/contact/", "Contact")]

def page(path, title, desc, body, nav_key="", jsonld=None, og_img="og.jpg"):
    """Write one page. path is a site-relative directory or file."""
    canon = DOMAIN + ("/" if path in ("", ".") else f"/{path.strip('/')}/")
    if path.endswith(".html"):
        canon = DOMAIN + "/" + path
    wa = wa_link("Hello, I would like to discuss a building project.")
    navhtml = "".join(
        '<a class="navlink" href="%s"%s>%s</a>' % (h, AC if h == nav_key else "", t)
        for h, t in NAV)
    drawer = "".join(f'<a href="{h}">{t}</a>' for h, t in NAV)
    ld = f'<script type="application/ld+json">{json.dumps(jsonld)}</script>' if jsonld else ""
    norobots = ("" if INDEXABLE else
                '<meta name="robots" content="noindex,nofollow">\n')
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
{norobots}
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{esc(CO)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{DOMAIN}/assets/img/{og_img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
{ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="/"><span class="brand-m">GLC</span><span class="brand-t">
      <b>Global Land Consortium</b><span>Sdn Bhd · {CRN}</span></span></a>
    <nav aria-label="Main">{navhtml}</nav>
    <div class="hdr-cta">
      <a class="btn-2" href="tel:{TEL}">{TEL_H}</a>
      <a class="btn" href="{wa}" rel="noopener">WhatsApp</a>
    </div>
    <button class="menu" id="menu" aria-expanded="false" aria-controls="drawer">Menu</button>
  </div>
  <div class="wrap drawer" id="drawer">{drawer}
    <div class="btns" style="margin-top:var(--sp5)">
      <a class="btn" href="{wa}" rel="noopener">{WA_ICON}WhatsApp us</a>
      <a class="btn-2" href="tel:{TEL}">Call</a>
    </div>
  </div>
</header>
<main id="main">
{body}
</main>
<section class="on-navy">
  <div class="in cta-grid">
    <div>
      <p class="lbl">Start here</p>
      <h2 style="margin-top:var(--sp4)">Tell us what you are building.</h2>
      <p style="margin-top:var(--sp4); max-width:52ch">A director will call you back. Send your
        drawings with the message and we will price off the drawings rather than guess.</p>
    </div>
    <div class="btns">
      <a class="btn" href="{wa}" rel="noopener">{WA_ICON}WhatsApp us</a>
      <a class="btn-2" href="/contact/">Send an enquiry</a>
    </div>
  </div>
</section>
<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>
        <h2>{esc(CO)}</h2>
        <p class="mono dim">Company registration {CRN}<br>Incorporated 24 February 2015</p>
        <p class="todo" style="margin-top:var(--sp4)">Registered office to be confirmed before
          launch — three addresses appear in the company records.</p>
      </div>
      <div>
        <h2>Contact</h2>
        <ul>
          <li><a href="tel:{TEL}">{TEL_H}</a></li>
          <li><a href="{wa}" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li class="dim">Fax +603-7972 9615</li>
        </ul>
      </div>
      <div>
        <h2>Work</h2>
        <ul>
          <li><a href="/projects/">All projects</a></li>
          <li><a href="/projects/sector/residential/">Houses and bungalows</a></li>
          <li><a href="/projects/sector/industrial/">Warehouses and factories</a></li>
          <li><a href="/capabilities/">Capabilities</a></li>
        </ul>
      </div>
      <div>
        <h2>Registrations</h2>
        <ul class="mono">
          <li>CIDB 0120181011-WP018050</li>
          <li>Grade G6 — B · CE · ME</li>
          <li>MOF 357-0002411991</li>
          <li><a href="/credentials/">All credentials</a></li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <span>© 2026 {esc(CO)}</span>
      <span><a href="/privacy/">Privacy notice</a></span>
    </div>
  </div>
</footer>
<div class="mbar-pad"></div>
<div class="mbar">
  <a href="{wa}" rel="noopener">{WA_ICON}WhatsApp</a>
  <a href="tel:{TEL}">Call us</a>
</div>
<script>
(function(){{
  var b=document.getElementById('menu'),d=document.getElementById('drawer');
  if(!b||!d)return;
  b.addEventListener('click',function(){{
    var open=d.hasAttribute('data-open');
    if(open){{d.removeAttribute('data-open')}}else{{d.setAttribute('data-open','')}}
    b.setAttribute('aria-expanded',String(!open));
  }});
}})();
</script>
</body>
</html>
"""
    target = SITE / path if path.endswith(".html") else SITE / path / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html)
    return canon

# ── components ───────────────────────────────────────────────────────────
_DIMS = {}
def dims(k):
    """Intrinsic pixel size of a photograph, so the browser reserves the space."""
    if k not in _DIMS:
        try:
            from PIL import Image
            with Image.open(PHOTO_SRC / f"{k}.jpg") as im:
                _DIMS[k] = im.size
        except Exception:
            _DIMS[k] = (None, None)
    return _DIMS[k]

def img(k, alt, cls="", loading="lazy"):
    w, h = dims(k)
    wh = f' width="{w}" height="{h}"' if w else ""
    return (f'<img src="/assets/img/{k}.jpg" alt="{esc(alt)}" class="{cls}"{wh}'
            f' loading="{loading}" decoding="async">')

def card(p, loading="lazy"):
    if p["photos"]:
        ph = p["photos"][0]
        visual = f'<div class="shot">{img(ph["k"], ph["cap"], loading=loading)}</div>'
    else:
        body = p["orig"] or "Scope not yet confirmed."
        visual = (f'<div class="titleblock"><span class="tb-k">Planning-approval title</span>'
                  f'{esc(body)}</div>')
    scope = " · ".join(SCOPE_SHORT[s] for s in p["scope"]) or "Scope being confirmed"
    prior = f'<p class="prior-tag">{PRIOR_NOTE}</p>' if p["prior"] else ""
    return (f'<a class="card" href="/projects/{p["slug"]}/">{visual}'
            f'<h3>{esc(p["title"])}</h3>{prior}'
            f'<p class="meta"><b>{esc(scope)}</b>{statline(p)}</p></a>')

def cards(items, cls="grid grid-3", first_eager=0):
    return (f'<div class="{cls}">' +
            "".join(card(p, "eager" if i < first_eager else "lazy")
                    for i, p in enumerate(items)) + "</div>")

def trust_bar():
    rows = [("CIDB grade", "G6 &nbsp;B · CE · ME"),
            ("Government works", "Valid to 14.09.2028"),
            ("CIDB SCORE", "3 stars, 2025"),
            ("Ministry of Finance", "357-0002411991")]
    lis = "".join(f"<li><span>{a}</span><b>{b}</b></li>" for a, b in rows)
    return (f'<section class="trust"><div class="wrap"><ul>{lis}</ul></div></section>')

def gallery():
    out = []
    for k in GALLERY:
        owner = IMG_OWNER[k]
        cap = next(ph["cap"] for ph in owner["photos"] if ph["k"] == k)
        cls = "gitem"
        out.append(f'<a class="gitem" href="/projects/{owner["slug"]}/">'
                   f'{img(k, cap)}<figcaption>{esc(owner["title"])}</figcaption></a>')
    return f'<div class="gal">{"".join(out)}</div>'

# ── pages ────────────────────────────────────────────────────────────────
ORG_LD = {
    "@context": "https://schema.org", "@type": "GeneralContractor",
    "name": CO, "legalName": CO, "url": DOMAIN + "/",
    "telephone": TEL, "email": EMAIL, "faxNumber": "+60379729615",
    "foundingDate": "2015-02-24", "identifier": CRN,
    "image": f"{DOMAIN}/assets/img/og.jpg",
    "address": {"@type": "PostalAddress", "addressLocality": "Kuala Lumpur",
                "addressCountry": "MY"},
    "areaServed": [{"@type": "AdministrativeArea", "name": s} for s in STATS["states"]],
    "knowsLanguage": ["en", "ms"],
    "hasCredential": [
        {"@type": "EducationalOccupationalCredential",
         "credentialCategory": "CIDB Malaysia contractor registration",
         "identifier": "0120181011-WP018050",
         "name": "CIDB Grade G6 — categories B, CE and ME"},
        {"@type": "EducationalOccupationalCredential",
         "credentialCategory": "Sijil Perolehan Kerja Kerajaan",
         "name": "Government works certificate", "validUntil": "2028-09-14"},
        {"@type": "EducationalOccupationalCredential",
         "credentialCategory": "CIDB SCORE", "name": "3-star rating, 2025",
         "identifier": "SC150741", "validUntil": "2027-06-09"},
        {"@type": "EducationalOccupationalCredential",
         "credentialCategory": "Ministry of Finance Malaysia registration",
         "identifier": "357-0002411991", "validUntil": "2027-10-31"},
    ],
}

def home():
    hero_p, hero_ph = BY_ID["P1"], PHOTOS["P1"][0]
    tiles = "".join(
        f'<a class="tile" href="{href}">{img(k, lbl, loading="eager")}'
        f'<span class="tile-t"><b>{lbl}</b>'
        f'<span>{count} projects &rarr;</span></span></a>'
        for lbl, k, href, key in TILES
        for count in [sum(1 for p in OWN if p["sector"] == key or key in p["scope"])])
    featured = [BY_ID[i] for i in ("P1", "C10", "C8", "C5", "C19", "C21") if i in BY_ID]
    scoperows = "".join(
        f'<a class="scoperow" href="/projects/scope/{slugify(s)}/">'
        f'<span class="sn">{SCOPE_LABEL[s]}</span>'
        f'<span class="sx">{STATS["scope_n"][s]} project'
        f'{"" if STATS["scope_n"][s]==1 else "s"} &nbsp;·&nbsp; CIDB {SCOPE_CIDB[s]}</span></a>'
        for s in SCOPES)
    body = f"""
<section class="wrap hero">
  <div>
    <h1>We build warehouses, factories, houses and shop interiors in the Klang Valley.</h1>
    <p class="lead">A G6 building contractor with a director on every site. {STATS['comp_n']}
      buildings completed since 2015, {STATS['cur_n']} more on site now.</p>
    <div class="btns">
      <a class="btn" href="{wa_link('Hello, I would like to discuss a building project.')}"
         rel="noopener">{WA_ICON}WhatsApp us</a>
      <a class="btn-2" href="/projects/">See our work</a>
    </div>
  </div>
  <figure class="hero-shot">
    {img(hero_ph[0], hero_ph[1], loading="eager")}
    <figcaption class="hero-cap"><span>On site now</span>
      <b>{esc(hero_p['title'])}</b>Steel roof structure over the reinforced concrete frame.</figcaption>
  </figure>
</section>
{trust_bar()}
<section class="wrap band">
  <div class="lbl-row"><p class="lbl">What are you building?</p>
    <a href="/projects/">Browse all {len(OWN)} projects</a></div>
  <div class="tiles">{tiles}</div>
</section>
<section class="wrap band">
  <div class="lbl-row"><p class="lbl">Recent work</p>
    <a href="/projects/">All projects since 2015</a></div>
  {cards(featured)}
</section>
<section class="wrap band">
  <div class="lbl-row"><p class="lbl">On our sites</p>
    <p class="dim mono">Every photograph is of the project it is attached to</p></div>
  {gallery()}
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">What we take on</p>
  <div class="scopes">{scoperows}</div>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">How we work</p>
  <div class="steps">
    <div class="step"><h3>A director on site</h3>
      <p>We are a small company and we do not subcontract the supervision. A director is on site,
        our own two supervisors are on site, and our quantity surveyor measures the work in
        house.</p></div>
    <div class="step"><h3>Trades we have used for years</h3>
      <p>The plumber and the aluminium fabricator have worked with our directors since 2004, the
        tiler since 2007, the steel and roof-truss fabricator since 2016. When you ask who will
        be on your site, we can answer.</p></div>
    <div class="step"><h3>Priced off the drawings</h3>
      <p>Our project director is a qualified quantity surveyor. Send drawings and you get a price
        built from them, not a figure worked backwards from a budget.</p></div>
  </div>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">The record</p>
  <div class="figs">
    <div class="fig"><p class="n">{rm_m(STATS['comp_v'])}</p>
      <p class="d">completed by the company, {STATS['comp_from']}–{STATS['comp_to']}</p></div>
    <div class="fig"><p class="n">{STATS['comp_n']} buildings</p>
      <p class="d">handed over since incorporation in 2015</p></div>
    <div class="fig"><p class="n">{rm_m(STATS['cur_v'])}</p>
      <p class="d">on site now, across {STATS['cur_n']} projects</p></div>
    <div class="fig"><p class="n">Since 1987</p>
      <p class="d">our executive director's first year in the industry; our project
        director's, 1998</p></div>
  </div>
  <p class="prose dim" style="margin-top:var(--sp7); font-size:var(--s-1)">Before the company was
    incorporated our directors delivered a further {STATS['prior_n']} projects worth
    {rm_m(STATS['prior_v'])}, between 2002 and 2015. Those are
    <a href="/projects/status/directors/">listed separately and labelled</a>, because they are
    their record rather than the company's.</p>
</section>"""
    page("", f"{CO} — G6 building contractor, Klang Valley",
         f"A CIDB G6 building contractor in the Klang Valley. {STATS['comp_n']} buildings "
         f"completed since 2015 and {STATS['cur_n']} on site now: warehouses, factories, "
         f"houses, shop and school interiors. WhatsApp {TEL_H}.",
         body, "", ORG_LD)

def projects_index(items, title, desc, h1, intro, path, nav_key="/projects/",
                   active=None, extra=""):
    def chipset(label, base, opts, cur):
        cs = "".join(
            '<a class="chip" href="%s%s/"%s>%s</a>'
            % (base, slug, AC if cur == slug else "", esc(lbl))
            for slug, lbl in opts)
        all_chip = '<a class="chip" href="/projects/"%s>All</a>' % (AC if cur is None else "")
        return (f'<div class="chipset"><p class="lbl">{label}</p>'
                f'<div class="chips">{all_chip if label=="Scope" else ""}{cs}</div></div>')
    a = active or {}
    filters = (
        chipset("Scope", "/projects/scope/",
                [(slugify(s), SCOPE_SHORT[s]) for s in SCOPES], a.get("scope")) +
        chipset("Sector", "/projects/sector/",
                [(k, v) for k, v in SECTOR.items()], a.get("sector")) +
        chipset("State", "/projects/state/",
                [(slugify(s), s) for s in STATS["states"]], a.get("state")) +
        chipset("Status", "/projects/status/",
                [("on-site", "On site now"), ("completed", "Completed"),
                 ("directors", "Directors, before 2015")], a.get("status")))
    groups = []
    for label, sub in (("On site now", [p for p in items if p["status"] == "current"]),
                       ("Completed by the company",
                        [p for p in items if p["status"] == "completed" and not p["prior"]]),
                       ("Delivered by our directors before 2015",
                        [p for p in items if p["prior"]])):
        if not sub: continue
        groups.append(f'<section class="wrap band"><div class="lbl-row">'
                      f'<p class="lbl">{label}</p><p class="mono dim">{len(sub)}</p></div>'
                      f'{cards(sub, first_eager=3)}</section>')
    body = f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp6)">
  <h1 style="font-size:var(--s4)">{esc(h1)}</h1>
  <p class="lead" style="margin-top:var(--sp5)">{intro}</p>
</section>
<section class="wrap band band-lite">{filters}</section>
{extra}
{"".join(groups) or '<section class="wrap band"><p class="prose">Nothing here yet.</p></section>'}"""
    page(path, title, desc, body, nav_key)

def project_page(p):
    hero = next((ph for ph in p["photos"] if ph["hero"]), p["photos"][0] if p["photos"] else None)
    rest = [ph for ph in p["photos"] if ph is not hero]
    rows = [
        ("Our scope", "<br>".join(SCOPE_LABEL[s] for s in p["scope"])
         or '<span class="mono dim">Being confirmed</span>'),
        ("Role", esc(p["role"])),
        ("Sector", esc(SECTOR[p["sector"]])),
        ("Location", esc(p["location"])),
        ("Period", f'{esc(p["start"])} – {esc(p["end"])}'),
        ("Client", esc(p["client"])),
        ("Contract value", '<span class="mono dim">Not published</span>'),
    ]
    facts = "".join(f"<div><dt>{a}</dt><dd>{b}</dd></div>" for a, b in rows)
    similar = [q for q in P if q["slug"] != p["slug"]
               and any(s in p["scope"] for s in q["scope"])]
    similar.sort(key=lambda q: (len(q["photos"]) > 0, q["sortkey"]), reverse=True)
    similar = similar[:3]
    herohtml = ""
    if hero:
        herohtml = (f'<section class="wrap band"><figure>{img(hero["k"], hero["cap"], loading="eager")}'
                    f'<figcaption>{esc(hero["cap"])}</figcaption></figure></section>')
    resthtml = ""
    if rest:
        figs = "".join(f'<figure>{img(ph["k"], ph["cap"])}'
                       f'<figcaption>{esc(ph["cap"])}</figcaption></figure>' for ph in rest)
        inner = figs if len(rest) == 1 else '<div class="shotpair">%s</div>' % figs
        resthtml = ('<section class="wrap band"><div class="shots">%s'
                    '</div></section>' % inner)
    origtext = p["orig"] or ("Not available. The company records repeat another project's "
                             "description here, so the scope is being confirmed.")
    redact_note = (" The lot number and street are removed: this is somebody's home."
                   if p["redacted"] else "")
    nophoto = ("" if p["photos"] else
               ' We have no photograph of this project on file yet.')
    ld = {"@context": "https://schema.org", "@type": "Project", "name": p["full_title"],
          "url": f"{DOMAIN}/projects/{p['slug']}/",
          "location": {"@type": "Place", "address": {"@type": "PostalAddress",
                       "addressLocality": p["location"], "addressCountry": "MY"}},
          "startDate": "", "provider": {"@type": "GeneralContractor", "name": CO,
                                        "url": DOMAIN + "/"}}
    if p["photos"]:
        ld["image"] = f"{DOMAIN}/assets/img/{p['photos'][0]['k']}.jpg"
    body = f"""
<section class="wrap" style="padding-block:var(--sp6) var(--sp7)">
  <p class="crumb"><a href="/projects/">Projects</a> /
    <a href="/projects/sector/{p['sector']}/">{SECTOR[p['sector']]}</a></p>
  <h1 style="font-size:var(--s4); max-width:30ch; margin-top:var(--sp4)">{esc(p['title'])}</h1>
  {f'<p class="lead dim" style="margin-top:var(--sp4); font-size:var(--s0)">{PRIOR_NOTE}</p>'
     if p['prior'] else ''}
  <p class="lead" style="margin-top:var(--sp5)">{statline(p)}.{nophoto}</p>
</section>
{herohtml}
<section class="wrap band">
  <div class="split">
    <dl class="facts">{facts}</dl>
    <div>
      <p class="lbl" style="margin-bottom:var(--sp4)">Planning-approval title</p>
      <div class="origbox"><p lang="ms">{esc(origtext)}</p></div>
      <p class="origcap">As submitted to the local authority. We keep the wording because it is
        what a consultant or a council officer recognises.{redact_note}</p>
    </div>
  </div>
</section>
{resthtml}
{f'<section class="wrap band"><p class="lbl" style="margin-bottom:var(--sp5)">Similar work</p>{cards(similar)}</section>' if similar else ''}"""
    scope_txt = ", ".join(SCOPE_SHORT[s] for s in p["scope"]) or "building works"
    page(f"projects/{p['slug']}", f"{p['title']} — {CO}",
         f"{p['title']}. {scope_txt} in {p['location']}, "
         f"{'on site since ' + p['start'] if p['status']=='current' else 'completed ' + p['end']}. "
         f"A CIDB G6 contractor project.",
         body, "/projects/", ld,
         og_img=f"{p['photos'][0]['k']}.jpg" if p["photos"] else "og.jpg")

def capabilities():
    secs = []
    for s in SCOPES:
        ex = [p for p in P if s in p["scope"]]
        ex.sort(key=lambda q: (len(q["photos"]) > 0, q["sortkey"]), reverse=True)
        secs.append(f"""
<section class="wrap band" id="{slugify(s)}">
  <div class="lbl-row"><p class="lbl">{SCOPE_LABEL[s]}</p>
    <p class="mono dim">CIDB {SCOPE_CIDB[s]} &nbsp;·&nbsp; {STATS['scope_n'][s]} of our projects</p></div>
  <p class="prose" style="font-size:var(--s1); line-height:1.5">{SCOPE_WHAT[s]}</p>
  {cards(ex[:3])}
  <p style="margin-top:var(--sp6)"><a class="morelink"
    href="/projects/scope/{slugify(s)}/">All {SCOPE_SHORT[s].lower()} projects &rarr;</a></p>
</section>""")
    body = f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp7)">
  <h1 style="font-size:var(--s4)">What we take on</h1>
  <p class="lead" style="margin-top:var(--sp5)">Six kinds of work, the projects that evidence each
    one, and the CIDB category we are registered in for it.</p>
</section>
{"".join(secs)}
<section class="wrap band" id="mechanical-and-electrical">
  <div class="lbl-row"><p class="lbl">Mechanical and electrical</p>
    <p class="mono dim">CIDB G6 ME</p></div>
  <p class="prose" style="font-size:var(--s1); line-height:1.5">We hold the G6 ME registration, and
    our long-standing trades cover electrical work, plumbing and water reticulation, fire
    protection and air-conditioning ducting. We have not led a mechanical and electrical contract
    in its own right, so we are not claiming one.</p>
</section>"""
    page("capabilities", f"Capabilities — {CO}",
         "Main contract building works, reinforced concrete structure, steel structure and "
         "roofing, renovation and A&A, interior fit-out, demolition and rebuild, earthworks. "
         "CIDB G6 in categories B, CE and ME.", body, "/capabilities/")

def credentials():
    regs = [
        ("CIDB registration number", "0120181011-WP018050", "First registered 11 October 2018"),
        ("CIDB grade and categories", "G6 — B, CE, ME",
         "B (Pembinaan Bangunan) · CE (Pembinaan Kejuruteraan Awam) · ME (Mekanikal dan Elektrikal)"),
        ("Sijil Perolehan Kerja Kerajaan", "Effective 12.09.2025, expires 14.09.2028",
         "Government works certificate, issued by CIDB Malaysia"),
        ("CIDB SCORE", "3 stars, for the year 2025",
         "Valid until 09.06.2027 · certificate reference SC150741"),
        ("Ministry of Finance certificate", "K98463596913999914",
         "Reference 357-0002411991 · valid 01.11.2024 to 31.10.2027"),
        ("MOF field 090101", "Bahan binaan",
         "Bahan binaan dan peralatan keselamatan jalan raya / Bahan binaan"),
        ("MOF field 090102", "Paip dan kelengkapan",
         "Bahan binaan dan peralatan keselamatan jalan raya / Bahan binaan"),
        ("MOF field 221401", "Hiasan dalaman", "Perkhidmatan / Pengindahan / Bangunan"),
        ("Company registration", CRN, "Incorporated in Malaysia, 24 February 2015"),
        ("Banker", "Public Bank Berhad", "Taman Desa branch, Kuala Lumpur"),
    ]
    plant = [("Scaffolding", "600 sets"), ("Concrete mixer", "3 × 7-tonne"),
             ("Generator set", "2 × 7.5 kVA petrol, 1 × 2 kVA"),
             ("Air compressor", "2 × 3 HP"), ("Lorry", "1 × 1 tonne")]
    body = f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp7)">
  <h1 style="font-size:var(--s4)">Credentials</h1>
  <p class="lead" style="margin-top:var(--sp5)">Every registration number and validity date in
    plain text, so you can check us against a tender submission in half a minute without
    downloading anything.</p>
</section>
{trust_bar()}
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">Registrations in full</p>
  <dl class="facts" style="max-width:82ch">
    {"".join(f'<div><dt>{esc(a)}</dt><dd>{esc(b)}<br><span class="mono dim">{esc(c)}</span></dd></div>' for a,b,c in regs)}
  </dl>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">Plant and equipment</p>
  <dl class="facts" style="max-width:56ch">
    {"".join(f'<div><dt>{esc(a)}</dt><dd class="mono">{esc(b)}</dd></div>' for a,b in plant)}
  </dl>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">Trades and suppliers</p>
  <p class="prose" style="font-size:var(--s1); line-height:1.5">We work with the same trades job
    after job: piling, carpentry and barbending, plumbing and water reticulation, electrical,
    tiling, aluminium and glazing, painting and skimcoating, roof trusses and steel, fire
    protection, and air-conditioning ducting. The plumber and the aluminium fabricator have been
    with our directors since 2004, the tiler since 2007. Six builders' merchants supply us on 30
    to 60 day terms, two of them since 2004 and 2008.</p>
  <p class="prose dim" style="margin-top:var(--sp5); font-size:var(--s-1)">We do not publish their
    names or contact details here. The full list, with the year each relationship started, goes
    out with a tender submission on request.</p>
</section>"""
    page("credentials", f"Credentials — CIDB G6 · {CO}",
         "CIDB registration 0120181011-WP018050, Grade G6 in categories B, CE and ME. "
         "Government works certificate valid to 14.09.2028. CIDB SCORE 3 stars. Ministry of "
         "Finance registration 357-0002411991.", body, "/credentials/", ORG_LD)

def about():
    body = f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp7)">
  <h1 style="font-size:var(--s4); max-width:26ch">Six people, and forty years of building in the
    Klang Valley.</h1>
  <p class="lead" style="margin-top:var(--sp5)">Global Land Consortium was incorporated on
    24 February 2015. Our directors were building long before that.</p>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">Who we are</p>
  <dl class="facts" style="max-width:80ch">
    <div><dt>Chairman</dt><dd>Dato' Ahmad Fathiri Bin Ahmad Fadzlah<br>
      <span class="mono dim">MBA (Professional Master in Administration), Universiti Teknologi
      Malaysia. In construction and project management since 2003.</span></dd></div>
    <div><dt>Executive Director</dt><dd>Mr Goh Nai Koon<br>
      <span class="mono dim">Shareholder. In the construction industry since 1987: apartments,
      terrace houses, semi-detached houses, bungalows, shops and factories.</span></dd></div>
    <div><dt>Project Director</dt><dd>Mr Yip Chee Tack<br>
      <span class="mono dim">Shareholder, and a qualified quantity surveyor. In the industry
      since leaving Technical Institute, Kuala Lumpur in 1998.</span></dd></div>
    <div><dt>Site team</dt><dd>Two site supervisors and one senior quantity surveyor<br>
      <span class="mono dim">In house, on our own sites.</span></dd></div>
  </dl>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">How we work</p>
  <div class="prose" style="font-size:var(--s1); line-height:1.5">
    <p>We are a small company and we do not subcontract the supervision. A director is on site,
      our own supervisors are on site, and our quantity surveyor prices and measures the work in
      house. That is the whole method, and it is why we take on a handful of buildings at a time
      rather than a page of them.</p>
    <p>The trades that build them have been with us for years: the plumber and the aluminium
      fabricator since 2004, the tiler since 2007, the roof-truss and steel fabricator since
      2016. When a client asks who will actually be on their site, we can answer.</p>
  </div>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">The record, split honestly</p>
  <div class="figs">
    <div class="fig"><p class="n">{STATS['comp_n']} buildings</p>
      <p class="d">completed by the company, {STATS['comp_from']}–{STATS['comp_to']}, worth
        {rm_m(STATS['comp_v'])}</p></div>
    <div class="fig"><p class="n">{STATS['cur_n']} sites</p>
      <p class="d">running now, worth {rm_m(STATS['cur_v'])}</p></div>
    <div class="fig"><p class="n">{STATS['prior_n']} projects</p>
      <p class="d">delivered by our directors before 2015, worth {rm_m(STATS['prior_v'])}</p></div>
    <div class="fig"><p class="n">{len(STATS['states'])} states</p>
      <p class="d">{esc(", ".join(STATS['states']))}</p></div>
  </div>
  <p class="prose dim" style="margin-top:var(--sp7); font-size:var(--s-1)">Our company deck lists
    the pre-2015 work alongside the rest. We separate it. It is nearly forty years of continuous
    experience between two directors, and it is worth more stated accurately than folded into a
    bigger number.</p>
</section>
<section class="wrap band">
  <p class="lbl" style="margin-bottom:var(--sp5)">Working with us</p>
  <p class="prose">We take on site supervisors and quantity surveyors from time to time. Email
    <a href="mailto:{EMAIL}">{EMAIL}</a> and tell us what you have built.</p>
</section>"""
    page("about", f"About — {CO}",
         "Incorporated in February 2015. A chairman, an executive director in the industry since "
         "1987, a project director who is a quantity surveyor, two site supervisors and a senior "
         "QS. A director on every site.", body, "/about/")

def contact():
    opts = lambda xs: "".join(f"<option>{esc(x)}</option>" for x in xs)
    body = f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp7)">
  <h1 style="font-size:var(--s4)">Contact us</h1>
  <p class="lead" style="margin-top:var(--sp5)">WhatsApp is quickest, and a director will answer.
    If you have drawings, send them with the message and we will price off the drawings.</p>
  <div class="btns" style="margin-top:var(--sp6)">
    <a class="btn" href="{wa_link('Hello, I would like to discuss a building project.')}"
       rel="noopener">{WA_ICON}WhatsApp {TEL_H}</a>
    <a class="btn-2" href="tel:{TEL}">Call {TEL_H}</a>
  </div>
</section>
<section class="wrap band">
  <div class="split">
    <div>
      <p class="lbl" style="margin-bottom:var(--sp5)">Reach us</p>
      <dl class="facts">
        <div><dt>WhatsApp</dt><dd><a href="{wa_link('Hello, I would like to discuss a building project.')}" rel="noopener">{TEL_H}</a></dd></div>
        <div><dt>Telephone</dt><dd><a href="tel:{TEL}">{TEL_H}</a></dd></div>
        <div><dt>Fax</dt><dd class="mono">+603-7972 9615</dd></div>
        <div><dt>Email</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
        <div><dt>Office</dt><dd><span class="mono dim">To be confirmed before launch. Three
          addresses appear in the company records, and the published one must match the Google
          Business Profile exactly.</span></dd></div>
      </dl>
    </div>
    <div>
      <p class="lbl" style="margin-bottom:var(--sp5)">Or send an enquiry</p>
      <form name="enquiry" method="POST" action="/thanks/" data-netlify="true"
            netlify-honeypot="bot-field">
        <p class="hp"><label>Do not fill this in <input name="bot-field"></label></p>
        <div class="f2">
          <label class="field"><span>Your name</span>
            <input name="name" autocomplete="name" required></label>
          <label class="field"><span>Phone</span>
            <input name="phone" type="tel" autocomplete="tel" required></label>
        </div>
        <label class="field"><span>Email (optional)</span>
          <input name="email" type="email" autocomplete="email"></label>
        <label class="field"><span>What are you building?</span>
          <select name="project-type">{opts(['A new building','An extension or renovation','Demolish and rebuild','A structure package only','An interior fit-out','Not sure yet'])}</select></label>
        <label class="field"><span>Where?</span>
          <input name="location" placeholder="The town is enough"></label>
        <label class="field"><span>What stage are you at?</span>
          <select name="stage">{opts(['Just an idea','I have drawings','I have drawings and approval','Tendering now'])}</select></label>
        <label class="field"><span>Rough budget</span>
          <select name="budget">{opts(['Under RM 500,000','RM 500,000 to 1 million','RM 1 to 3 million','RM 3 to 10 million','Prefer not to say'])}</select></label>
        <label class="field"><span>Anything else</span>
          <textarea name="message"></textarea></label>
        <p><button class="btn" type="submit">Send enquiry</button></p>
        <p class="dim" style="font-size:var(--s-1)">We use what you send only to answer your
          enquiry. See our <a href="/privacy/">privacy notice</a>.</p>
      </form>
    </div>
  </div>
</section>"""
    page("contact", f"Contact — {CO}",
         f"WhatsApp or call {TEL_H}, or send an enquiry. A CIDB G6 building contractor in the "
         f"Klang Valley. Send your drawings and we will price off the drawings.",
         body, "/contact/")

def simple_pages():
    page("thanks", f"Thank you — {CO}",
         "Your enquiry has reached us and a director will be in touch.", f"""
<section class="wrap" style="padding-block:var(--sp9)">
  <h1 style="font-size:var(--s4)">Thank you — we have your enquiry.</h1>
  <p class="lead" style="margin-top:var(--sp5)">A director will call you back. If it is urgent,
    WhatsApp us on {TEL_H} and you will get an answer sooner.</p>
  <div class="btns" style="margin-top:var(--sp7)">
    <a class="btn" href="{wa_link('Hello, I have just sent an enquiry through your website.')}"
       rel="noopener">{WA_ICON}WhatsApp us</a>
    <a class="btn-2" href="/projects/">See our work</a>
  </div>
</section>""", "/contact/")

    page("privacy", f"Privacy notice — {CO}",
         "What we collect through the enquiry form and WhatsApp, why, how long we keep it, and "
         "how to ask us to correct or delete it.", f"""
<section class="wrap" style="padding-block:var(--sp7) var(--sp7)">
  <h1 style="font-size:var(--s4)">Privacy notice</h1>
  <p class="lead" style="margin-top:var(--sp5)">Plain language, and short. This notice covers the
    enquiry form on this website and the WhatsApp link.</p>
</section>
<section class="wrap band">
  <div class="prose">
    <p><b>What we collect.</b> If you use the enquiry form: your name, phone number, and
      optionally your email address, together with what you tell us about your project. If you
      use the WhatsApp link, the conversation happens on WhatsApp and is subject to WhatsApp's
      own terms and privacy policy, not ours.</p>
    <p><b>Why.</b> Only to answer your enquiry and, if you ask us to, to prepare a quotation.</p>
    <p><b>Who sees it.</b> The directors of {esc(CO)}. Form submissions are handled by our
      website host as a processor on our behalf. We do not sell your details and we do not pass
      them to anyone else.</p>
    <p><b>How long.</b> We keep enquiries for as long as we are in contact with you about a
      project, and no more than two years after our last contact, unless you become a client and
      we need the records for the contract.</p>
    <p><b>Your rights.</b> You can ask us what we hold about you, ask us to correct it, or ask us
      to delete it. Email <a href="mailto:{EMAIL}">{EMAIL}</a> or call {TEL_H} and we will deal
      with it.</p>
    <p><b>Analytics.</b> This website does not run analytics or advertising trackers, and sets no
      cookies of its own.</p>
    <p class="todo">Before launch: have this notice checked against the Personal Data Protection
      Act 2010 and the Personal Data Protection (Amendment) Act 2024, and publish a Bahasa
      Malaysia version alongside it.</p>
  </div>
</section>""", "")

    page("404.html", f"Page not found — {CO}",
         "That page is not here. Try our projects or our credentials.", """
<section class="wrap" style="padding-block:var(--sp9)">
  <h1 style="font-size:var(--s4)">That page is not here.</h1>
  <p class="lead" style="margin-top:var(--sp5)">It may have moved. Our work and our registrations
    are both a click away.</p>
  <div class="btns" style="margin-top:var(--sp7)">
    <a class="btn" href="/projects/">See our projects</a>
    <a class="btn-2" href="/credentials/">Our credentials</a>
  </div>
</section>""", "")

# ── facet pages ──────────────────────────────────────────────────────────
def facets():
    for s in SCOPES:
        items = [p for p in P if s in p["scope"]]
        projects_index(items, f"{SCOPE_LABEL[s]} projects — {CO}",
            f"{SCOPE_LABEL[s]} by a CIDB G6 contractor in the Klang Valley: "
            f"{len(items)} projects. {SCOPE_WHAT[s][:110]}...",
            f"{SCOPE_LABEL[s]}",
            f"{len(items)} projects where this was our scope. "
            f"We are registered CIDB {SCOPE_CIDB[s]} for it. "
            f'<a class="morelink" href="/capabilities/#{slugify(s)}">What this work '
            f'involves &rarr;</a>',
            f"projects/scope/{slugify(s)}", active={"scope": slugify(s)})
    for k, v in SECTOR.items():
        items = [p for p in P if p["sector"] == k]
        projects_index(items, f"{v} projects — {CO}",
            f"{v} building projects by a CIDB G6 contractor in the Klang Valley: "
            f"{len(items)} projects, with photographs, dates and the scope we delivered.",
            f"{v} projects",
            f"{len(items)} {v.lower()} projects, newest first.",
            f"projects/sector/{k}", active={"sector": k})
    for st in STATS["states"]:
        items = [p for p in P if p["state"] == st]
        projects_index(items, f"Projects in {st} — {CO}",
            f"{len(items)} building projects in {st} by a CIDB G6 contractor: warehouses, "
            f"factories, houses and interiors, with photographs and dates.",
            f"Projects in {st}",
            f"{len(items)} projects in {st}.",
            f"projects/state/{slugify(st)}", active={"state": slugify(st)})
    for slug, label, items, blurb in (
        ("on-site", "On site now", CUR,
         f"{len(CUR)} projects running now, worth {rm_m(STATS['cur_v'])} between them."),
        ("completed", "Completed by the company", COMP,
         f"{len(COMP)} buildings handed over since the company was incorporated in 2015, "
         f"worth {rm_m(STATS['comp_v'])}."),
        ("directors", "Delivered by our directors before 2015", PRIOR,
         f"{len(PRIOR)} projects our directors delivered between 2002 and 2015, worth "
         f"{rm_m(STATS['prior_v'])}, before Global Land Consortium was incorporated. We list "
         f"them separately because they are their record rather than the company's.")):
        projects_index(items, f"{label} — {CO}", blurb[:155], label, blurb,
                       f"projects/status/{slug}", active={"status": slug})

# ── assets ───────────────────────────────────────────────────────────────
def assets():
    css_dst = SITE / "assets" / "css"
    css_dst.mkdir(parents=True, exist_ok=True)
    shutil.copy(ROOT / "src" / "site.css", css_dst / "site.css")

    img_dst = SITE / "assets" / "img"
    img_dst.mkdir(parents=True, exist_ok=True)
    used = {ph["k"] for p in P for ph in p["photos"]}
    missing = []
    for k in sorted(used):
        src = PHOTO_SRC / f"{k}.jpg"
        if src.exists():
            shutil.copy(src, img_dst / f"{k}.jpg")
        else:
            missing.append(k)
    if missing:
        sys.exit(f"BUILD FAILED — missing photographs in src/photos: {', '.join(missing)}")

    brand = ROOT / "src" / "brand"
    shutil.copy(brand / "glc-badge.svg", SITE / "assets" / "favicon.svg")
    if (brand / "glc-icon-180.png").exists():
        shutil.copy(brand / "glc-icon-180.png", SITE / "assets" / "apple-touch-icon.png")
    # the whole brand suite is downloadable from the site
    bdst = SITE / "assets" / "brand"
    bdst.mkdir(parents=True, exist_ok=True)
    for f in sorted(brand.glob("glc-*")):
        shutil.copy(f, bdst / f.name)

    fdst = SITE / "assets" / "fonts"
    fdst.mkdir(parents=True, exist_ok=True)
    for f in sorted((ROOT / "src" / "fonts").glob("*.woff2")):
        shutil.copy(f, fdst / f.name)

    if INDEXABLE:
        (SITE / "robots.txt").write_text(
            f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
    else:
        (SITE / "robots.txt").write_text(
            "# Not open to search engines yet: corporate client names on this site\n"
            "# have not been cleared. See DEPLOY.md before publishing.\n"
            "User-agent: *\nDisallow: /\n")

    urls = ["/", "/projects/", "/capabilities/", "/credentials/", "/about/", "/contact/",
            "/privacy/"]
    urls += [f"/projects/{p['slug']}/" for p in P]
    urls += [f"/projects/scope/{slugify(s)}/" for s in SCOPES]
    urls += [f"/projects/sector/{k}/" for k in SECTOR]
    urls += [f"/projects/state/{slugify(s)}/" for s in STATS["states"]]
    urls += [f"/projects/status/{s}/" for s in ("on-site", "completed", "directors")]
    body = "".join(
        f"<url><loc>{DOMAIN}{u}</loc>"
        f"<priority>{'1.0' if u=='/' else '0.8' if u.count('/')==2 else '0.6'}</priority></url>"
        for u in urls)
    (SITE / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"{body}</urlset>\n")
    return len(urls)

def social_images():
    """1200x630 Open Graph card and an apple-touch-icon, composed from a real photo."""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("  ! Pillow not installed — skipping og.jpg and apple-touch-icon.png")
        return
    img_dst = SITE / "assets" / "img"
    base = Image.open(PHOTO_SRC / "p20_2.jpg").convert("RGB")
    W, H = 1200, 630
    scale = max(W / base.width, H / base.height)
    im = base.resize((round(base.width * scale), round(base.height * scale)), Image.LANCZOS)
    im = im.crop(((im.width - W) // 2, (im.height - H) // 3,
                  (im.width - W) // 2 + W, (im.height - H) // 3 + H))
    ov = Image.new("RGBA", (W, H), (20, 33, 47, 0))
    d = ImageDraw.Draw(ov)
    d.rectangle([0, H - 250, W, H], fill=(20, 33, 47, 232))
    d.rectangle([0, H - 250, W, H - 244], fill=(0, 160, 224, 255))
    im = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(im)
    def font(sz, bold=True):
        for p in (f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",):
            if os.path.exists(p):
                return ImageFont.truetype(p, sz)
        return ImageFont.load_default()
    d.text((56, H - 208), "GLOBAL LAND CONSORTIUM SDN BHD", font=font(31), fill=(237, 239, 241))
    d.text((56, H - 152), "Warehouses, factories, houses and shop", font=font(37, False),
           fill=(237, 239, 241))
    d.text((56, H - 104), "interiors in the Klang Valley", font=font(37, False),
           fill=(237, 239, 241))
    d.text((56, H - 50), "CIDB G6  ·  B / CE / ME", font=font(25), fill=(0, 160, 224))
    im.save(img_dst / "og.jpg", "JPEG", quality=84, optimize=True, progressive=True)

    # apple-touch-icon comes from the brand suite, not from here.

# ── privacy and accuracy gate ────────────────────────────────────────────
PRIVATE_NAMES = [
    "william ong", "lim teng wai", "loo chai lai", "azahar", "narendra", "redzuan",
    "ng chi seong", "parvin", "yee kim yap", "tai soon", "wan azhar", "tan hui choon",
    "nurjesmi", "thong lay ying", "tan bee lay", "chin yuen", "chiam", "chaim",
    "yong cho joong", "norsiha", "lee keok", "chen soon", "chan fung", "arulananthan",
    "yap kah keong", "ling kean", "foong chin", "leong kwok", "aprel", "nor azrini",
]
def gate():
    problems = []
    residential = {p["slug"] for p in P if p["sector"] == "residential"}
    for f in SITE.rglob("*.html"):
        t = f.read_text()
        low = t.lower()
        for n in PRIVATE_NAMES:
            if n in low:
                problems.append(f"{f.relative_to(SITE)}: private client name '{n}'")
        for ic in ("760927145515", "630720076385"):
            if ic in t:
                problems.append(f"{f.relative_to(SITE)}: IC number")
        if re.search(r"RM\s?10[,.]000[,.]000", t):
            problems.append(f"{f.relative_to(SITE)}: asserts a CIDB tender ceiling")
        if re.search(r"\bISO\s?\d{4}\b|QLASSIC|SHASSIC", t):
            problems.append(f"{f.relative_to(SITE)}: claims a credential the company lacks")
        if "RM " in t and re.search(r'Contract value</dt><dd>(?!<span class="mono dim">Not)', t):
            problems.append(f"{f.relative_to(SITE)}: publishes a contract value")
    for p in P:
        if p["sector"] == "residential" and p["orig"]:
            if re.search(r"\bLOT\b|\bPT\s*\d|\bJALAN\b|\bLORONG\b|\bNO\.?\s*\d", p["orig"], re.I):
                problems.append(f"{p['slug']}: residential address survives in the planning title")
    return problems

# ── main ─────────────────────────────────────────────────────────────────
def main():
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir(parents=True)
    home()
    projects_index(P, f"Projects — {CO}",
        f"All {len(P)} projects in our records: {STATS['cur_n']} on site now, "
        f"{STATS['comp_n']} completed by the company since 2015, and {STATS['prior_n']} "
        f"delivered by our directors before that. Filter by scope, sector or state.",
        "Projects",
        f"Everything we have built, filterable by what we actually did on it. "
        f"Contract values are not published; the totals on the home page are computed from them.",
        "projects")
    for p in P:
        project_page(p)
    facets()
    capabilities(); credentials(); about(); contact(); simple_pages()
    n_urls = assets()
    social_images()

    problems = gate()
    pages = sum(1 for _ in SITE.rglob("*.html"))
    imgs = sum(1 for _ in (SITE / "assets" / "img").glob("*.jpg"))
    size = sum(f.stat().st_size for f in SITE.rglob("*") if f.is_file()) / 1024 / 1024
    print(f"  {pages} pages · {imgs} photographs · {n_urls} URLs in sitemap · {size:.1f} MB")
    print(f"  search engines: {'ALLOWED' if INDEXABLE else 'blocked (set GLC_PUBLISH=1 to allow)'}")
    print(f"  canonical domain: {DOMAIN}")
    if problems:
        print("\nBUILD FAILED — privacy and accuracy gate:")
        for x in problems:
            print("   ·", x)
        sys.exit(1)
    print("  privacy and accuracy gate: passed")

if __name__ == "__main__":
    main()
