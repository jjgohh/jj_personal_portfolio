#!/usr/bin/env python3
"""
Package the built site as a zip you can drag straight into Netlify.

    python3 build.py && python3 tools/make_zip.py

Netlify's drag-and-drop deploy expects the site root at the top level of the
archive, so the contents of site/ go at the root of the zip, not inside a
folder. A netlify.toml written for that layout is added at the root too: the
repository's own netlify.toml points at glc-website/site and would be wrong
here.
"""
import shutil, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = ROOT.parent / "glc-website-netlify.zip"

if not SITE.exists():
    sys.exit("site/ not found — run `python3 build.py` first")

# Headers only. No [build] block: inside this archive the root *is* the
# publish directory, so a publish path would point at nothing.
DEPLOY_TOML = """# Dropped into Netlify as a zip: the root of this archive is the site root.
# Caching and security headers only — there is no build step.

[build.processing]
  skip_processing = false
[build.processing.html]
  pretty_urls = true

[[headers]]
  for = "/assets/img/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/css/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    # Nothing is loaded from outside the site: fonts are self-hosted.
    Content-Security-Policy = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'"
"""

README = """HOW TO PUT THIS ONLINE
======================

1. Sign in at app.netlify.com.
2. Open the project that is already waiting for it:
   https://app.netlify.com/projects/global-land-consortium
3. Go to the Deploys tab.
4. Drag THIS ZIP FILE onto the drop area. Do not unzip it first.
5. It is live in under a minute at
   https://global-land-consortium.netlify.app

To collect enquiries from the contact form:
  Forms -> Settings -> Form notifications -> Add notification -> Email
  Put in the address that should receive them, then send yourself a test.

A note you should read
----------------------
This site is deliberately hidden from Google. Every page carries a noindex
tag and robots.txt disallows everything, because the project pages name
eleven corporate and institutional clients and none of them has been asked
for permission yet. Anyone with the link can still read it, which is what a
review site should be. See DEPLOY.md in the repository for the five things
to settle before opening it to search engines.
"""


def main():
    if OUT.exists():
        OUT.unlink()
    n = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for f in sorted(SITE.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(SITE).as_posix())
                n += 1
        z.writestr("netlify.toml", DEPLOY_TOML)
        z.writestr("_README-HOW-TO-DEPLOY.txt", README)
        n += 2

    with zipfile.ZipFile(OUT) as z:
        names = z.namelist()
        assert "index.html" in names, "index.html must sit at the archive root"
        bad = z.testzip()
        assert bad is None, f"corrupt entry: {bad}"

    mb = OUT.stat().st_size / 1024 / 1024
    print(f"  {OUT.name}  {n} files  {mb:.2f} MB")
    print(f"  root entries: {', '.join(sorted({p.split('/')[0] for p in names})[:9])}")


if __name__ == "__main__":
    main()
