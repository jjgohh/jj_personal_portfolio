/*
  Site verification harness. `npm run check` (after `npm run build`).

  Every assertion here exists because it caught a real bug that shipped. Read the
  comment above each one before weakening it.

  Playwright is not a project dependency — it lives in the container image — so a
  missing install is reported and skipped rather than failing the build.
*/
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.CHECK_PORT || 4321);
const BASE = `http://localhost:${PORT}`;
const ROUTES = ['/', '/product', '/composition', '/traceability', '/proof', '/research', '/story', '/faq'];
const ARTIFACT = resolve(ROOT, 'PULP-final.html');

let chromium;
try {
  // playwright is CommonJS, so under ESM its exports arrive on .default.
  const mod = await import('/opt/node22/lib/node_modules/playwright/index.js');
  chromium = (mod.default || mod).chromium;
} catch { /* fall through to the skip below */ }
if (!chromium) {
  console.log('check-site: playwright not available in this environment — skipped.');
  process.exit(0);
}
const EXEC = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome']
  .find((p) => existsSync(p));

if (!existsSync(resolve(ROOT, 'dist/index.html'))) {
  console.error('check-site: dist/index.html missing — run `npm run build` first.');
  process.exit(1);
}

let fails = 0;
const fail = (m) => { fails++; console.log('  ✗ ' + m); };
const pass = (m) => console.log('  ✓ ' + m);

/* ---------------------------------------------------------------------------
   In-page probe.

   contrast: walks the WHOLE DOM. An earlier version iterated a hand-written
   list of tag names, omitted div and em, and therefore missed two real AA
   failures that an external tool found. Never narrow this back to a selector
   list. Two documented exemptions, both verified by hand:
     .fam-g  glyph sits on a ::before fill the ancestor walk cannot see —
             measured directly against that fill at 4.51:1, passes.
     .rail-l intentionally opacity:0 until its tick is active; aria-hidden, and
             the rail is display:none below 1100px.

   invisible: text-bearing elements at opacity<0.05. Two separate bugs shipped
   invisible content — four headlines and all four Traceability steps — because
   a reveal wrapper and a GSAP from() both owned the same element and the
   inline style won.

   These are CANDIDATES ONLY, tagged with data-check-invis for the harness to
   re-verify by scrolling each one into view. A single measurement is not enough:
   reveals are driven by IntersectionObserver plus a 700ms opacity transition, so
   an element can read 0 simply because the main thread was busy (the desktop
   three.js hero is the usual culprit) or because it is legitimately offscreen.
   The honest question is "can the user ever see this", and only a
   scroll-to-it-and-look measurement answers that. Do not collapse this back into
   a one-shot check — a flaky invisible-content alarm gets ignored, and being
   ignored is how both of those bugs reached production.
   --------------------------------------------------------------------------- */
const PROBE = `(() => {
  const lum = (c) => { const m = c.match(/[\\d.]+/g).map(Number);
    const f = m.slice(0,3).map(v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
    return 0.2126*f[0] + 0.7152*f[1] + 0.0722*f[2]; };
  const ratio = (a,b) => { const la=lum(a), lb=lum(b); return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05); };
  const bgOf = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor;
    if (c && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(c)) return c; e = e.parentElement; } return 'rgb(247,238,220)'; };
  const ownText = (el) => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
  const exempt = (el) => el.classList.contains('fam-g') || el.classList.contains('rail-l');

  const contrast = [], invisible = [];
  document.querySelectorAll('[data-check-invis]').forEach((el) => el.removeAttribute('data-check-invis'));
  document.querySelectorAll('#root *').forEach((el) => {
    const t = ownText(el); if (!t || exempt(el)) return;
    const cs = getComputedStyle(el);
    if (!el.offsetParent && cs.position !== 'fixed') return;
    if (parseFloat(cs.opacity) < 0.05) {
      el.setAttribute('data-check-invis', '1');
      invisible.push((String(el.className) || el.tagName).slice(0,24) + ' :: ' + t.slice(0,24));
      return;
    }
    const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight) || 400;
    const need = (fs >= 24 || (fs >= 18.66 && fw >= 700)) ? 3.0 : 4.5;
    try { const r = ratio(cs.color, bgOf(el));
      if (r < need - 0.02) contrast.push((String(el.className) || el.tagName).slice(0,24) + ' ' + r.toFixed(2) + '<' + need);
    } catch {}
  });

  const heads = [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map(h => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i-1] > 1) skips++;

  return {
    rootKids: document.getElementById('root').children.length,
    text: (document.querySelector('main')?.innerText || '').trim().length,
    h1: document.querySelectorAll('main h1').length,
    headingSkips: skips,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    contrast, invisible,
    danglingAria: [...document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]')]
      .flatMap(e => ['aria-controls','aria-labelledby','aria-describedby']
        .map(a => e.getAttribute(a)).filter(Boolean)
        .flatMap(v => v.split(/\\s+/)).filter(id => !document.getElementById(id))),
    noAlt: [...document.querySelectorAll('img')].filter(i => i.getAttribute('alt') === null).length,
  };
})()`;

async function sweep(page, h, js) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= H; y += Math.round(h * 0.55)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(js ? 100 : 25);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(js ? 800 : 120);
}

/*
  Second opinion on every invisible candidate: scroll it to the middle of the
  viewport and look again, after the 700ms reveal transition has had time to run.
  Returns only the ones a real visitor could never see.
*/
async function confirmInvisible(page) {
  const n = await page.locator('[data-check-invis]').count();
  const stuck = [];
  for (let i = 0; i < n; i++) {
    const el = page.locator('[data-check-invis]').nth(i);
    try {
      await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(950);
      const r = await el.evaluate((e) => ({
        op: +getComputedStyle(e).opacity,
        what: (String(e.className) || e.tagName).slice(0, 24),
        text: [...e.childNodes].filter((x) => x.nodeType === 3).map((x) => x.textContent.trim()).join('').slice(0, 24),
      }));
      if (r.op < 0.05) stuck.push(`${r.what} :: ${r.text}`);
    } catch { /* element went away with a route change — not a finding */ }
  }
  return stuck;
}

function judge(label, o, { minText = 400 } = {}) {
  const bad = [];
  // The single worst regression this project shipped: #root emptied, blank page.
  if (o.rootKids === 0) bad.push('ROOT EMPTY');
  if (o.text < minText) bad.push(`text=${o.text} < ${minText}`);
  if (o.confirmedInvisible?.length) bad.push('invisible even when scrolled into view: ' + o.confirmedInvisible.join(' | '));
  if (o.contrast.length) bad.push('contrast: ' + o.contrast.join(' | '));
  if (o.overflow > 1) bad.push(`h-overflow ${o.overflow}px`);
  if (o.h1 !== 1) bad.push(`h1 count = ${o.h1}`);
  if (o.headingSkips) bad.push(`${o.headingSkips} skipped heading level(s)`);
  if (o.danglingAria.length) bad.push('dangling aria refs: ' + [...new Set(o.danglingAria)].join(','));
  if (o.noAlt) bad.push(`${o.noAlt} img without alt`);
  if (bad.length) fail(`${label} → ${bad.join('  |  ')}`);
  return bad.length === 0;
}

/* ------------------------------ server ------------------------------ */
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid); } catch {} };
process.on('exit', stop);
for (let i = 0; i < 40; i++) {
  try { const r = await fetch(BASE + '/'); if (r.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 250));
}

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const VIEWPORTS = [['laptop', 1440, 900], ['iphone', 440, 956]];

/* 1. FRESH LOAD of every route.

   This must be a real navigation per route, each in its own context. An earlier
   version reused one page and only changed the hash, so it exercised hashchange
   and never a cold load — and missed that every deep hash mismatched the
   prerendered Home markup, logging six React #418s plus a #423 and discarding
   the whole prerender. Do not "optimise" this back into a shared page. */
console.log('\nfresh load, JS on');
for (const [name, w, h] of VIEWPORTS) {
  for (const r of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('THROW ' + e.message.slice(0, 90)));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const t = m.text();
      if (/ERR_(CONNECTION|FILE)|GroupMarkerNotSet|WebGL|GPU stall/.test(t)) return;
      errs.push('CONSOLE ' + t.slice(0, 90));
    });
    await page.goto(`${BASE}/#${r}`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await sweep(page, h, true);
    const o = await page.evaluate(PROBE);
    o.confirmedInvisible = await confirmInvisible(page);
    const okd = judge(`${name} ${r}`, o, { minText: r === '/' ? 1500 : 400 });
    if (errs.length) fail(`${name} ${r} console/page errors: ${[...new Set(errs)].join(' ; ')}`);
    else if (okd) pass(`${name} ${r} text=${o.text} clean`);
    await ctx.close();
  }
}

/* 2. HASH NAVIGATION through every route on one page, which is what a visitor
      clicking the nav actually does. Catches state left behind by the previous
      route: stale ScrollTriggers, leaked listeners, an accumulating canvas. */
console.log('\nhash navigation on a single page');
for (const [name, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('THROW ' + e.message.slice(0, 90)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/ERR_(CONNECTION|FILE)|GroupMarkerNotSet|WebGL|GPU stall/.test(t)) return;
    errs.push('CONSOLE ' + t.slice(0, 90));
  });
  await page.goto(`${BASE}/#/`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  let worst = 0;
  for (const r of [...ROUTES, ...ROUTES]) {
    await page.evaluate((v) => { window.location.hash = v; }, r);
    await page.waitForTimeout(450);
    await sweep(page, h, true);
    const o = await page.evaluate(PROBE);
    o.confirmedInvisible = await confirmInvisible(page);
    if (!judge(`${name} nav→${r}`, o, { minText: r === '/' ? 1500 : 400 })) worst++;
  }
  // End on Home, where the hero lives. Ending on a route without a canvas made
  // the assertion below vacuous — it passed by measuring nothing.
  await page.evaluate(() => { window.location.hash = '/'; });
  await page.waitForTimeout(1800);
  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  // Each hero mount creates a WebGL context; browsers hard-cap those, so an
  // accumulating canvas count means the unmount cleanup regressed.
  if (canvases > 2) fail(`${name} ${canvases} canvases after 16 navigations — hero cleanup leaking`);
  if (errs.length) fail(`${name} nav console/page errors: ${[...new Set(errs)].join(' ; ')}`);
  if (!worst && canvases <= 2 && !errs.length) pass(`${name} 16 navigations clean, canvases=${canvases}`);
  await ctx.close();
}

/* 3. JAVASCRIPT DISABLED.

   The no-JS fallback uses `animation-timeline: view()`, which is REVERSIBLE: an
   element below the fold sits at progress 0 and reads opacity:0 legitimately.
   So each element is scrolled to the centre of the viewport and measured there.
   Measuring from scrollTop 0 reports every offscreen element as invisible and is
   simply wrong. */
console.log('\nJavaScript disabled');
const NOJS_SEL = ['.h-lines', '.h-lines .inner', '.lede-2', '.ess-panel', '.ess-grid > div', '.fam-node',
  '.chain-t', '.chain-step', '.trace-step', '.trust-row li', '.bf-n', '.glyph-band', '.dose-row div', '.rsv-trust li'];
for (const [name, w, h, rm] of [['440', 440, 956, 'no-preference'], ['1440', 1440, 900, 'no-preference'], ['reduced-motion', 440, 956, 'reduce']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500, javaScriptEnabled: false, reducedMotion: rm });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  const hidden = [];
  for (const sel of NOJS_SEL) {
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) {
      const el = page.locator(sel).nth(i);
      await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(170);
      if (await el.evaluate((e) => +getComputedStyle(e).opacity) < 0.05) hidden.push(`${sel}[${i}]`);
    }
  }
  const rootKids = await page.evaluate(() => document.getElementById('root').children.length);
  if (!rootKids) fail(`no-JS ${name}: #root is empty — the prerender step did not run`);
  else if (hidden.length) fail(`no-JS ${name} invisible when in view: ${hidden.join(', ')}`);
  else pass(`no-JS ${name}: prerender present, every reveal target visible in view`);
  await ctx.close();
}

/* 4. THE SINGLE-FILE DELIVERABLE over file://, with JS off as well as on.
      JS off is the case that matters: it is what iOS Quick Look renders when the
      file is opened from the Files app, and it shipped blank once. */
if (existsSync(ARTIFACT)) {
  console.log('\nsingle-file build over file://');
  const html = readFileSync(ARTIFACT, 'utf8');
  /*
    Only SUBRESOURCES matter here. The Artifact CSP blocks requests to other
    hosts — scripts, stylesheets, fonts, images, fetch — so any of those must be
    inlined. It does not block a plain <a href> to another site, which is an
    ordinary outbound link the visitor chooses to follow. An earlier version of
    this check matched every href and flagged the WhatsApp and Instagram links as
    CSP violations, which they are not.
  */
  const sub = [
    ...html.matchAll(/\ssrc=["'](?:https?:)?\/\/[^"']+/gi),
    ...html.matchAll(/<link\b[^>]*\shref=["'](?:https?:)?\/\/[^"']+/gi),
    ...html.matchAll(/@import\s+(?:url\()?["']?(?:https?:)?\/\//gi),
    ...html.matchAll(/url\(\s*["']?(?:https?:)?\/\/[^)]+/gi),
  ].map((m) => m[0].trim().slice(0, 70));
  if (sub.length) fail(`${sub.length} external SUBRESOURCE(S) — the Artifact CSP blocks these: ${sub.slice(0, 3).join(' | ')}`);
  else pass('no external subresources (outbound <a href> links are fine)');

  /*
    Unfilled placeholders inside a URL are a different problem: they ship as a
    live, broken link. https://wa.me/[WHATSAPP NUMBER] is the one that exists
    today. Blocking for launch, harmless in preview — so it is reported by name
    rather than lumped in with the CSP check.
  */
  const badUrls = [...html.matchAll(/(?:href|src)=["'][^"']*\[[A-Z][A-Z ]+\][^"']*/g)].map((m) => m[0].slice(0, 70));
  if (badUrls.length) fail(`${badUrls.length} link(s) contain an unfilled placeholder and will be broken at launch: ${[...new Set(badUrls)].join(' | ')}`);
  else pass('no unfilled placeholders inside links');
  for (const [name, w, h, js] of [['iphone JS-on', 440, 956, true], ['iphone JS-off (Quick Look)', 440, 956, false], ['laptop JS-on', 1440, 900, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500, javaScriptEnabled: js });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));
    await page.goto('file://' + ARTIFACT, { waitUntil: 'load' });
    await page.waitForTimeout(js ? 1800 : 400);
    const o = await page.evaluate(PROBE);
    const bad = [];
    if (!o.rootKids) bad.push('ROOT EMPTY');
    if (o.text < 1500) bad.push('text=' + o.text);
    if (o.overflow > 1) bad.push(`h-overflow ${o.overflow}px`);
    if (errs.length) bad.push('errors: ' + [...new Set(errs)].join(' ; '));
    if (bad.length) fail(`artifact ${name} → ${bad.join(' | ')}`);
    else pass(`artifact ${name} text=${o.text}`);
    await ctx.close();
  }
} else {
  console.log(`\nsingle-file build not present (run \`npm run build:artifact\`) — skipped.`);
}

await browser.close();
stop();
console.log(fails ? `\n${fails} CHECK FAILURE(S)\n` : '\nALL CHECKS PASSED\n');
process.exit(fails ? 1 : 0);
