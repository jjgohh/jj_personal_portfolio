/*
  Generates the two raster assets the site needs, from the site's own design
  tokens and fonts. Run with `npm run assets` after `npm run build`.

    public/og.png                1200x630  link preview card
    public/apple-touch-icon.png   180x180  iOS home-screen icon

  WHY GENERATE RATHER THAN DRAW OR SOURCE:
  - A link preview is the first thing anyone sees when this URL is pasted into
    WhatsApp, which is the channel this brand will actually be shared on in
    Malaysia. Without og:image the card is a bare grey box.
  - It uses the real Caprasimo / Fraunces / Inter Tight / DM Mono files from the
    build, so the card cannot drift from the site's typography.
  - No stock photography and no generated imagery. public/assets/README.txt
    forbids anything that could be mistaken for documentation of a supply chain
    we have not photographed; this is brand graphics, which is a different thing,
    but it stays abstract for the same reason.

  Deliberately NOT committed as a hand-written binary: rerun this and the assets
  regenerate from whatever the tokens currently say.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = path.join(ROOT, 'dist', 'fonts');

let chromium;
try {
  const mod = await import('/opt/node22/lib/node_modules/playwright/index.js');
  chromium = (mod.default || mod).chromium;
} catch { /* handled below */ }
if (!chromium) {
  console.log('make-og: playwright unavailable — skipped (existing assets kept).');
  process.exit(0);
}
const EXEC = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome']
  .find((p) => fs.existsSync(p));

if (!fs.existsSync(FONTS)) {
  console.error('make-og: dist/fonts missing — run `npm run build` first.');
  process.exit(1);
}
/*
  Fonts are inlined as base64 rather than referenced by file:// URL. The card is
  rendered via setContent, so the document origin is about:blank, and a subresource
  fetch to file:// from there is blocked — silently. The first version of this
  script used file:// URLs and produced a perfectly plausible card set in Times,
  with no error anywhere. assertFonts() below is what makes that failure loud.
*/
const font = (needle) => {
  const hit = fs.readdirSync(FONTS).find((f) => f.includes(needle));
  if (!hit) { console.error(`make-og: no font file matching "${needle}" in dist/fonts`); process.exit(1); }
  const b64 = fs.readFileSync(path.join(FONTS, hit)).toString('base64');
  return `data:font/woff2;base64,${b64}`;
};

const CREAM = '#F7EEDC', PAPER = '#FBF6EA', FOREST = '#3A4E3A';
const PULP = '#C85A28', ESPRESSO = '#2A1F16', TAUPE = '#736554', LINE = '#D9C9A8';

const OG = `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:Caprasimo;src:url('${font('caprasimo')}') format('woff2')}
  @font-face{font-family:Fraunces;font-style:italic;font-weight:300 500;src:url('${font('fraunces')}') format('woff2')}
  @font-face{font-family:'Inter Tight';font-weight:400 700;src:url('${font('inter-tight-400-normal-latin')}') format('woff2')}
  @font-face{font-family:'DM Mono';src:url('${font('dm-mono-400')}') format('woff2')}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px}
  body{background:
      radial-gradient(120% 100% at 78% 18%, ${PAPER}, ${CREAM} 62%);
    font-family:'Inter Tight',sans-serif;color:${ESPRESSO};
    display:grid;grid-template-columns:1fr 420px;position:relative;overflow:hidden}
  /* hairline frame, the same specimen-sheet device the site uses */
  .frame{position:absolute;inset:26px;border:1px solid ${LINE};pointer-events:none}
  .left{padding:74px 0 66px 74px;display:flex;flex-direction:column;justify-content:space-between}
  .mark{font-family:Caprasimo,serif;font-size:44px;line-height:1;color:${FOREST};letter-spacing:-.01em}
  .mark i{font-style:normal;color:${PULP}}
  .kie{font-family:'DM Mono',monospace;font-size:13px;letter-spacing:.16em;
    text-transform:uppercase;color:${TAUPE};margin-top:14px}
  h1{font-family:Caprasimo,serif;font-size:64px;line-height:1.02;letter-spacing:-.015em;
    color:${ESPRESSO};max-width:15ch}
  h1 em{font-family:Fraunces,serif;font-style:italic;font-weight:300;color:${PULP}}
  .strip{display:flex;gap:0;align-items:stretch;border-top:1px solid ${LINE};padding-top:18px}
  .strip div{padding-right:26px;margin-right:26px;border-right:1px solid ${LINE}}
  .strip div:last-child{border-right:0}
  .k{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;
    text-transform:uppercase;color:${TAUPE};display:block;margin-bottom:5px}
  .v{font-size:19px;font-weight:600;color:${FOREST}}
  .right{position:relative;display:flex;align-items:center;justify-content:center}
  .glyphs{position:absolute;bottom:58px;right:74px;font-size:34px;font-weight:600;
    color:${PULP};opacity:.30;letter-spacing:.16em}
</style>
<div class="frame"></div>
<div class="left">
  <div>
    <div class="mark">P<i>u</i>lp</div>
    <div class="kie">No. 001 &middot; Tocotrienol complex</div>
  </div>
  <h1>The vitamin E most supplements <em>skip.</em></h1>
  <div class="strip">
    <div><span class="k">Spectrum</span><span class="v">&alpha; &beta; &gamma; &delta; + toc</span></div>
    <div><span class="k">Per softgel</span><span class="v">50 mg</span></div>
    <div><span class="k">Origin</span><span class="v">Malaysia</span></div>
  </div>
</div>
<div class="right">
  <svg width="250" height="376" viewBox="0 0 200 300" fill="none">
    <defs><linearGradient id="g" x1="30%" y1="8%" x2="72%" y2="96%">
      <stop offset="0" stop-color="#F4C67E"/><stop offset="40%" stop-color="#C85A28"/>
      <stop offset="1" stop-color="#6E2F0F"/></linearGradient></defs>
    <ellipse cx="104" cy="278" rx="48" ry="11" fill="#6E2F0F" opacity=".22"/>
    <rect x="64" y="34" width="72" height="230" rx="36" fill="url(#g)"/>
    <rect x="64" y="34" width="72" height="230" rx="36" fill="none" stroke="#5F280D" stroke-width="1" opacity=".38"/>
    <path d="M86 64 q-11 70 4 152" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".30"/>
    <ellipse cx="90" cy="70" rx="7" ry="15" fill="#fff" opacity=".48"/>
  </svg>
  <div class="glyphs">&alpha;&beta;&gamma;&delta;</div>
</div>`;

const ICON = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0}html,body{width:180px;height:180px}
  body{background:${FOREST};display:flex;align-items:center;justify-content:center}
</style>
<svg width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${FOREST}"/>
  <ellipse cx="16" cy="16.5" rx="7" ry="9" fill="${PULP}"/>
</svg>`;

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });

/*
  A card set in the wrong typeface still looks fine at a glance, so this is not a
  nicety. Every declared face must report "loaded"; anything else stops the build
  rather than writing a PNG that misrepresents the brand.
*/
async function assertFonts(page, families) {
  const loaded = await page.evaluate(() =>
    [...document.fonts].map((f) => `${f.family}:${f.status}`));
  const missing = families.filter((fam) => !loaded.includes(`${fam}:loaded`));
  if (missing.length) {
    console.error(`make-og: these faces did not load: ${missing.join(', ')}`);
    console.error(`  document.fonts reports: ${loaded.join(', ') || '(none)'}`);
    await browser.close();
    process.exit(1);
  }
  console.log(`make-og: fonts ok (${loaded.join(', ')})`);
}

async function shoot(html, w, h, out, families = []) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  if (families.length) await assertFonts(page, families);
  const file = path.join(ROOT, 'public', out);
  await page.screenshot({ path: file, type: 'png' });
  await page.close();
  console.log(`make-og: ${out} ${w}x${h} (${(fs.statSync(file).size / 1024).toFixed(1)}KB)`);
}
/* No rounded corners on the icon: iOS masks it itself, and baking a radius in
   leaves dark corners outside the mask. */
await shoot(OG, 1200, 630, 'og.png', ['Caprasimo', 'Fraunces', 'Inter Tight', 'DM Mono']);
await shoot(ICON, 180, 180, 'apple-touch-icon.png');   // pure SVG, no type
await browser.close();
