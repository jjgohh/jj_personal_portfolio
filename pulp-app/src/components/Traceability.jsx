import React from 'react';
import { Rise, Raw } from '../lib.jsx';

/*
  WORKSTREAM 1 — Traceable provenance.

  The supply chain is the centrepiece, not a line of copy. PULP's structural
  advantage is that the chain is real and unusually short: Malaysian palm fruit
  -> DavosLife E3 (KLK OLEO) -> a Malaysian bottle.

  Regulatory notes for future editors:
  - Every statement here is a PROVENANCE fact (what / where / who). No health
    claims, no efficacy, no disease language. Keep it that way.
  - The batch list is COMMITMENT language ("we will publish"), because no batch
    exists yet. Do not restate it as an existing certification.
  - NO photorealistic plantation or factory imagery in this section, AI-generated
    or otherwise. On a provenance-led brand, fabricated provenance imagery would
    discredit the whole page. The map below is an explicitly-labelled schematic.
*/

// Schematic Malaysia outline — hand-authored paths, no mapping library, no tile
// requests, inline and ~2KB. Deliberately simplified: it is labelled a schematic
// so it can never be mistaken for survey-accurate cartography.
const MALAYSIA = `<svg viewBox="0 0 420 190" fill="none" role="img"
  aria-label="Schematic outline map of Malaysia. A marker on the west coast of Peninsular Malaysia indicates the sourcing and extraction region.">
  <g stroke="var(--forest)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <!-- Peninsular Malaysia -->
    <path d="M96 26 C112 30 120 42 118 56 C116 70 122 78 120 92 C118 108 108 120 100 134
             C94 146 88 152 82 150 C76 148 74 138 76 126 C78 112 74 104 76 90
             C78 74 82 62 84 48 C86 34 88 24 96 26 Z" fill="var(--cream-2)"/>
    <!-- Sarawak -->
    <path d="M212 108 C230 96 252 92 274 90 C292 88 306 84 320 78 C332 73 340 78 336 88
             C332 100 320 110 306 118 C288 128 268 136 248 140 C232 143 218 140 210 132
             C204 126 204 114 212 108 Z" fill="var(--cream-2)"/>
    <!-- Sabah -->
    <path d="M322 74 C334 62 342 48 352 40 C362 32 372 34 374 44 C376 56 370 68 362 78
             C354 88 344 94 334 92 C324 90 316 82 322 74 Z" fill="var(--cream-2)"/>
  </g>
  <!-- sourcing + extraction marker: west-coast Peninsular Malaysia -->
  <g>
    <circle cx="86" cy="88" r="13" fill="var(--pulp)" opacity=".16"/>
    <circle cx="86" cy="88" r="5" fill="var(--pulp)"/>
  </g>
  <g font-family="var(--mono)" font-size="8" letter-spacing="1.6" fill="var(--taupe)">
    <text x="108" y="92">SOURCE + EXTRACTION</text>
    <text x="228" y="162">BORNEO</text>
  </g>
</svg>`;

const STEPS = [
  {
    code: 'STEP 01',
    name: 'Fruit',
    what: 'Non-GMO oil palm fruit (Elaeis guineensis) is harvested and pressed for crude palm oil.',
    where: 'Malaysia',
    who: 'Malaysian oil palm estates',
    link: null,
  },
  {
    code: 'STEP 02',
    name: 'Extraction',
    what: 'The tocotrienol-rich fraction is separated from the crude palm oil and concentrated into the branded ingredient DavosLife E3.',
    where: 'Malaysia',
    who: 'KLK OLEO — DavosLife E3',
    link: { href: 'https://www.davoslife.com/', label: 'davoslife.com' },
  },
  {
    code: 'STEP 03',
    name: 'Formulation',
    what: 'The ingredient is blended and encapsulated into softgels at 50 mg tocotrienol complex per softgel.',
    where: 'Malaysia',
    who: '[CO-PACKER NAME]',
    link: null,
  },
  {
    code: 'STEP 04',
    name: 'Bottle',
    what: 'Sixty softgels are bottled, sealed and batch-coded, then held pending NPRA product notification.',
    where: 'Malaysia',
    who: '[CO-PACKER NAME]',
    link: null,
  },
];

const BATCH = [
  ['Batch number', 'Printed on every bottle and published here.'],
  ['Isomer profile', 'The measured α-, β-, γ-, δ-tocotrienol and α-tocopherol split for that batch.'],
  ['Certificate of analysis', 'Downloadable, matched to the batch number.'],
  ['Manufacture date', 'Date of encapsulation and date of bottling.'],
];

export default function Traceability() {
  return (
    <section className="chapter amb" id="traceability">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">Fig. 02 — Traceability</span>
          <span className="rule-draw" />
          <span className="lab">Fruit → Bottle</span>
        </div>

        <h1 className="h-lines" style={{ marginBottom: 12 }}>
          <span className="line"><span className="inner">Grown, extracted and</span></span>
          <span className="line"><span className="inner"><em>bottled in Malaysia.</em></span></span>
        </h1>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(28px,4.4vw,46px)' }}>
          Four steps, one country. Every step names who does it.
        </Rise>

        <div className="trace-grid">
          <ol className="trace-chain">
            {STEPS.map((s, i) => (
              <li className="trace-step" key={s.code}>
                <div className="trace-head">
                  <span className="trace-code">{s.code}</span>
                  <h2 className="trace-name">{s.name}</h2>
                </div>
                <p className="trace-what">{s.what}</p>
                <dl className="trace-meta">
                  <div><dt>Where</dt><dd>{s.where}</dd></div>
                  <div>
                    <dt>Who</dt>
                    <dd>
                      {s.who}
                      {s.link && <> · <a href={s.link.href} target="_blank" rel="noopener">{s.link.label}</a></>}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          <Rise as="figure" className="trace-map">
            <Raw as="div" className="trace-map-art" html={MALAYSIA} />
            <figcaption>
              Schematic illustration — not a survey map. Sourcing and extraction both sit in
              Peninsular Malaysia; formulation and bottling are Malaysian too.
            </figcaption>
          </Rise>
        </div>

        <Rise as="div" className="batch-commit">
          <div className="batch-commit-head">
            <span className="kie">What we will publish for every batch</span>
            <p className="batch-commit-note">
              A forward commitment. No batch has been produced yet — nothing below is a
              certification we currently hold.
            </p>
          </div>
          <dl className="batch-list">
            {BATCH.map(([k, v]) => (
              <div className="batch-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </section>
  );
}
