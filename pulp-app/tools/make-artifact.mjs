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
import { pathToFileURL } from 'node:url';

const outDir = process.argv[2] || '.';
const src = 'dist-artifact/index.html';

if (!fs.existsSync(src)) {
  console.error(`missing ${src} — run: npx vite build --config vite.artifact.config.js`);
  process.exit(1);
}

/*
  PRERENDER. Without this, #root ships empty and the whole page depends on
  JavaScript running — which means a blank page in the iPhone Files app, whose
  Quick Look preview does not execute page scripts. Baking the markup in makes
  the file readable everywhere; React hydrates on top when it can.
*/
let prerendered = '';
const ssrEntry = 'dist-ssr/entry-server.js';
if (fs.existsSync(ssrEntry)) {
  const { render } = await import(pathToFileURL(path.resolve(ssrEntry)).href);
  prerendered = render();
  assertPrerender(prerendered);
} else {
  console.error(`missing ${ssrEntry} — run: npx vite build --config vite.ssr.config.js`);
  process.exit(1);
}

const html = fs.readFileSync(src, 'utf8');
/*
  A first-match regex silently drops a second block and truncates at any nested
  </style> or </script>, and the old `if (!css)` guard only caught TOTAL absence —
  partial capture was indistinguishable from success. Count the matches and refuse
  anything but exactly one of each.
*/
const one = (re, label) => {
  const all = [...html.matchAll(re)];
  if (all.length !== 1) {
    console.error(`expected exactly 1 ${label} block in ${src}, found ${all.length} — refusing to guess`);
    process.exit(1);
  }
  return all[0][1];
};
const css = one(/<style[^>]*>([\s\S]*?)<\/style>/g, '<style>');
const js = one(/<script[^>]*>([\s\S]*?)<\/script>/g, '<script>');
if (!css.trim() || !js.trim()) {
  console.error('an inlined block was empty — is viteSingleFile still configured?');
  process.exit(1);
}

// Fail loudly if anything external survived: the Artifact CSP blocks every host,
// and a phone opening the file offline would silently lose fonts.
const external = [...html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
if (external.length) {
  console.error('external references found, which will break under CSP / offline:');
  external.forEach((u) => console.error('  ' + u));
  process.exit(1);
}

// A CLASSIC script, not type="module": browsers apply module/CORS rules to
// file:// URLs and this file is opened straight off disk. The artifact build
// emits IIFE for exactly this reason.
const fragment =
  `<style>\n${css}\n</style>\n` +
  `<div id="root">${prerendered}</div>\n` +
  `<script>\n${js}\n</script>\n`;

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

/* Read back what was actually written. Every failure mode above used to exit 0
   with a success banner and a plausible KB figure. */
verifyOutput(fragPath, { fragment: true });
verifyOutput(fullPath, { fragment: false });

const kb = (s) => Math.round(s.length / 1024) + 'KB';
console.log(`no external references  ✓`);
console.log(`prerendered markup      ${Math.round(prerendered.length / 1024)}KB into #root`);
console.log(`${fragPath}  ${kb(fragment)}`);
console.log(`${fullPath}  ${kb(head + fragment)}`);


/*
  A length floor of 2000 was useless: the page chrome alone (utility bar, nav,
  footer) renders ~5.4KB, so a build whose <main> came out completely empty sailed
  past it and shipped a file with a header, a footer and nothing between. And
  `undefined < 2000` is false, so any non-string — a Promise from a streaming
  renderer, say — passed too and shipped "[object Promise]".
*/
function assertPrerender(markup) {
  if (typeof markup !== 'string') {
    console.error(`prerender returned ${typeof markup}, expected a string`);
    process.exit(1);
  }
  const required = ['id="reserve"', 'ess-panel', 'trust-row', 'fnote-q', 'chain-step', 'data-rise'];
  const missing = required.filter((m) => !markup.includes(m));
  if (missing.length) {
    console.error('prerender is missing expected content: ' + missing.join(', '));
    process.exit(1);
  }
  if (markup.length < 12000) {
    console.error(`prerender is ${markup.length} chars, expected ~16000 — refusing to ship`);
    process.exit(1);
  }
}

/*
  Checks must be ANCHORED, not substring counts. The emitted file embeds an entire
  JS bundle, and that bundle legitimately contains the literal strings `<script>`,
  `<html`, `<head` and `<body` (react-dom builds markup from strings). A naive
  `out.match(/<script/g).length !== 1` therefore fails on a perfectly good file —
  it did, first time out. Only look at the document's edges and at #root.
*/
function verifyOutput(file, { fragment }) {
  const out = fs.readFileSync(file, 'utf8');
  const problems = [];

  const rootOpen = out.indexOf('<div id="root">');
  const scriptOpen = out.indexOf('<script>', rootOpen);
  if (rootOpen === -1) problems.push('no <div id="root"> found');
  else if (scriptOpen === -1) problems.push('no <script> found after #root');
  else {
    const inner = out.slice(rootOpen + '<div id="root">'.length, scriptOpen);
    if (inner.length < 12000) problems.push(`#root holds only ${inner.length} chars of markup`);
  }

  const head = out.slice(0, 60).toLowerCase();
  if (fragment) {
    if (head.includes('<!doctype')) problems.push('fragment must not start with a doctype');
    if (!out.startsWith('<style>')) problems.push('fragment must start with its <style> block');
  } else {
    if (!head.includes('<!doctype html>')) problems.push('standalone file must start with a doctype');
    if (!out.trimEnd().endsWith('</html>')) problems.push('standalone file must end with </html>');
  }
  if (!out.trimEnd().endsWith(fragment ? '</script>' : '</html>')) {
    if (fragment) problems.push('fragment must end with its </script>');
  }

  if (problems.length) {
    console.error(`${file} failed verification:`);
    problems.forEach((x) => console.error('  ' + x));
    process.exit(1);
  }
}
