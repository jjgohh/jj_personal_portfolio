/*
  Injects the prerendered markup into dist/index.html — the build Netlify serves.

  Why this exists separately from make-artifact.mjs: that script only ever touched
  the single-file deliverables, so for a while the standalone HTML rendered without
  JavaScript while the DEPLOYED SITE still shipped an empty #root. The live site
  was blank for anything that does not execute scripts, including crawlers, and the
  no-JS CSS animation fallback had nothing to animate. Caught by back-testing the
  dist build with JavaScript disabled, not by reading the code.

  Runs as part of `npm run build`, after the client and SSR builds.
*/
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const target = 'dist/index.html';
const ssrEntry = 'dist-ssr/entry-server.js';

for (const [p, hint] of [[target, 'npx vite build'], [ssrEntry, 'npx vite build --config vite.ssr.config.js']]) {
  if (!fs.existsSync(p)) {
    console.error(`prerender-dist: missing ${p} — run: ${hint}`);
    process.exit(1);
  }
}

const { render } = await import(pathToFileURL(path.resolve(ssrEntry)).href);
const markup = render();
/* Same reasoning as make-artifact.mjs: a length floor of 2000 passes a build whose
   <main> is entirely empty, because the chrome alone is ~5.4KB. Assert content. */
if (typeof markup !== 'string') {
  console.error(`prerender-dist: render() returned ${typeof markup}, expected a string`);
  process.exit(1);
}
const missing = ['id="reserve"', 'ess-panel', 'trust-row', 'chain-step']
  .filter((m) => !markup.includes(m));
if (missing.length) {
  console.error('prerender-dist: prerender is missing expected content: ' + missing.join(', '));
  process.exit(1);
}
if (markup.length < 12000) {
  console.error(`prerender-dist: prerender is ${markup.length} chars, expected ~16000`);
  process.exit(1);
}

const html = fs.readFileSync(target, 'utf8');
if (!/<div id="root">\s*<\/div>/.test(html)) {
  // Already injected, or the shell changed shape. Either way, do not double-inject.
  if (html.includes('data-prerendered')) {
    console.log('prerender-dist: already injected, skipping');
    process.exit(0);
  }
  console.error('prerender-dist: could not find an empty <div id="root"></div> in dist/index.html');
  process.exit(1);
}

const out = html.replace(
  /<div id="root">\s*<\/div>/,
  `<div id="root" data-prerendered>${markup}</div>`
);
fs.writeFileSync(target, out);
console.log(`prerender-dist: injected ${Math.round(markup.length / 1024)}KB into ${target}`);
