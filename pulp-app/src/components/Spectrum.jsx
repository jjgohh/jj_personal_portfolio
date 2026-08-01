import React from 'react';
import { Rise } from '../lib.jsx';
import { href, navigate } from '../router.jsx';

/*
  WORKSTREAM 3 — the ownable "why this form" explainer.

  Regulatory notes for future editors:
  - Everything here is COMPOSITIONAL. What the molecule family is, what
    "full-spectrum" means, what is in the bottle. Never what it does to a body.
  - Do not add efficacy, performance, absorption or before/after framing here,
    and do not put a research citation next to this section's CTA. Research
    lives in its own section, neutrally attributed.
  - "Most vitamin E is tocopherol" is a factual statement about the category's
    composition, not a claim of superiority. Keep it that way.

  The toggle is built on real <input type="radio"> + CSS :checked, so the
  interaction requires ZERO JavaScript and gets native keyboard support
  (Tab into the group, arrow keys between options).
*/

const ISOMERS = [
  { g: 'α', name: 'Alpha-tocotrienol', toc: false },
  { g: 'β', name: 'Beta-tocotrienol', toc: false },
  { g: 'γ', name: 'Gamma-tocotrienol', toc: false },
  { g: 'δ', name: 'Delta-tocotrienol', toc: false },
  { g: 'α', name: 'Alpha-tocopherol', toc: true, sub: 'tocopherol' },
];

export default function Spectrum() {
  return (
    <section className="chapter" id="spectrum">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">Fig. 01 — Composition</span>
          <span className="rule-draw" />
          <span className="lab">α β γ δ + toc</span>
        </div>

        <h1 className="h-lines" style={{ marginBottom: 12 }}>
          <span className="line"><span className="inner">Most vitamin E is</span></span>
          <span className="line"><span className="inner"><em>one molecule.</em></span></span>
        </h1>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(26px,4vw,40px)' }}>
          Vitamin E is a family of eight related molecules — four tocopherols and four
          tocotrienols. Most supplements contain one of them. PULP contains the four
          tocotrienols, plus α-tocopherol.
        </Rise>

        {/* the isomer glyphs — the visual signature, and the one place to be bold */}
        <div className="glyph-band" aria-hidden="true">
          <span className="glyph">α</span>
          <span className="glyph">β</span>
          <span className="glyph">γ</span>
          <span className="glyph">δ</span>
        </div>
        <Rise as="p" className="glyph-cap">
          The four tocotrienol isomers. Set in Inter Tight — the brand's body face, and the
          one carrying the Greek glyphs.
        </Rise>

        {/* composition comparison — CSS-driven, no JS required */}
        <Rise as="div" className="cmpx">
          <fieldset className="cmpx-switch">
            <legend className="cmpx-legend">
              Composition comparison — which forms of vitamin E are present
            </legend>
            {/* The inputs MUST be siblings of .cmpx-panels. They used to live
                inside .cmpx-opts, which put .cmpx-panels outside the reach of
                `#cmpx-toc:checked ~ .cmpx-panels` — so the toggle did nothing and
                every isomer read PRESENT in both states, misrepresenting ordinary
                vitamin E as containing tocotrienols. label[for] still associates
                them, so the visual grouping is unaffected. */}
            <input type="radio" name="cmpx" id="cmpx-toc" className="cmpx-radio" defaultChecked />
            <input type="radio" name="cmpx" id="cmpx-full" className="cmpx-radio" />
            <div className="cmpx-opts">
              <label htmlFor="cmpx-toc" className="cmpx-label">Tocopherol only</label>
              <label htmlFor="cmpx-full" className="cmpx-label">Full spectrum</label>
            </div>

            <div className="cmpx-panels">
              <div className="cmpx-grid">
                {ISOMERS.map((iso, i) => (
                  <div className={'iso' + (iso.toc ? ' iso--toc' : '')} key={i}>
                    <span className="iso-g">{iso.g}</span>
                    <span className="iso-n">{iso.name}</span>
                    <span className="iso-state" />
                  </div>
                ))}
              </div>
              <p className="cmpx-foot">
                A comparison of ingredient composition only. Not a comparison of effect.
              </p>
            </div>
          </fieldset>
        </Rise>

        {/* dose stated plainly — never behind a "proprietary complex" framing */}
        <Rise as="dl" className="dose-row">
          <div><dt>Per softgel</dt><dd>50&nbsp;mg tocotrienol complex</dd></div>
          <div><dt>Count</dt><dd>60 softgels</dd></div>
          <div><dt>Directions</dt><dd>One daily, with food</dd></div>
        </Rise>

        <Rise as="p" className="spectrum-more">
          <a href={href('/research')} onClick={(e) => { e.preventDefault(); navigate('/research'); }}>
            Read the published research on tocotrienols →
          </a>
        </Rise>
      </div>
    </section>
  );
}
