/*
  Builds the two single-file deliverables from dist-artifact/index.html:

    pulp-artifact.html  — a FRAGMENT (no doctype/head/body). Claude Artifacts
                          wraps it, so it must not carry its own document shell.
    PULP-final.html     — a complete standalone document with the full <head>,
                          for opening on a phone, emailing, or hosting anywhere.

  The head lives here, once, so the two outputs can never drift apart.

  Run:  node tools/make-artifact.mjs [outDir]
*/
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] || '.';
const src = 'dist-artifact/index.html';

if (!fs.existsSync(src)) {
  console.error(`missing ${src} — run: npx vite build --config vite.artifact.config.js`);
  process.exit(1);
}

const html = fs.readFileSync(src, 'utf8');
const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [, ''])[1];
const js = (html.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/) || [, ''])[1];
if (!css) throw new Error('no inlined CSS found — is viteSingleFile still configured?');
if (!js) throw new Error('no inlined JS found — is viteSingleFile still configured?');

// Fail loudly if anything external survived: the Artifact CSP blocks every host,
// and a phone opening the file offline would silently lose fonts.
const external = [...html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
if (external.length) {
  console.error('external references found, which will break under CSP / offline:');
  external.forEach((u) => console.error('  ' + u));
  process.exit(1);
}

const fragment =
  `<style>\n${css}\n</style>\n` +
  `<div id="root"></div>\n` +
  `<script type="module">\n${js}\n</script>\n`;

/*
  iOS / Safari notes on the head below — each line is load-bearing:

  viewport-fit=cover   Without it iOS never reports the safe-area insets, so
                       every env(safe-area-inset-*) in the CSS resolves to 0 and
                       the sticky CTA sits under the home indicator.
  theme-color          Tints the Safari UI to match the dark utility bar at the
                       top of the page instead of leaving a pale seam.
  format-detection     Stops Safari auto-linking number-like strings. Without it
                       registration numbers and batch codes can be turned into
                       blue tel: links.
  apple-mobile-web-app-*  Only apply if the visitor adds the page to their home
                       screen; harmless otherwise.
  No `maximum-scale` / `user-scalable=no`: blocking pinch-zoom is an
  accessibility failure, and iOS ignores it in Safari anyway.
*/
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PULP — Full-Spectrum Vitamin E</title>
<meta name="description" content="PULP No. 001 — the vitamin E most supplements skip. Four tocotrienols plus alpha-tocopherol, 50 mg per softgel, grown, extracted and bottled in Malaysia. NPRA notification pending.">
<meta name="theme-color" content="#2E4A34">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="PULP">
<meta property="og:title" content="PULP — The vitamin E most supplements skip">
<meta property="og:description" content="Four tocotrienols plus alpha-tocopherol, 50 mg per softgel. Grown, extracted and bottled in Malaysia.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232E4A34'/%3E%3Cellipse cx='16' cy='16.5' rx='7' ry='9' fill='%23C85A28'/%3E%3C/svg%3E">
</head>
<body>
`;

fs.mkdirSync(outDir, { recursive: true });
const fragPath = path.join(outDir, 'pulp-artifact.html');
const fullPath = path.join(outDir, 'PULP-final.html');
fs.writeFileSync(fragPath, fragment);
fs.writeFileSync(fullPath, head + fragment + '\n</body>\n</html>\n');

const kb = (s) => Math.round(s.length / 1024) + 'KB';
console.log(`no external references  ✓`);
console.log(`${fragPath}  ${kb(fragment)}`);
console.log(`${fullPath}  ${kb(head + fragment)}`);
