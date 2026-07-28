import React from 'react';
import { Rise } from '../lib.jsx';

/*
  WORKSTREAM 2 — research, cited neutrally.

  HARD REGULATORY RULE for this section:
  - These are references to the published literature on TOCOTRIENOLS AS AN
    INGREDIENT CLASS. They are not claims about PULP.
  - Each entry gives authors, title, journal, year and a link out. The "Examined"
    line states only what the study LOOKED AT and its method. It must never state
    findings, outcomes, magnitudes or benefits. Do not add "showed that…",
    "was more effective…", percentages or multipliers.
  - This section must never sit next to a CTA, and nothing here may be repeated
    as a product benefit anywhere else on the site.
*/

const PAPERS = [
  {
    authors: 'Yang, et al.',
    title: 'Tocotrienols exhibit superior ferroptosis inhibition over tocopherols',
    journal: 'Scientific Reports',
    detail: '16:4497 (2026)',
    method: 'In-vitro study in human cells.',
    href: 'https://www.nature.com/articles/s41598-025-34673-1',
  },
  {
    authors: 'Pharmaceuticals (MDPI) editorial collection',
    title: 'Self-emulsifying delivery systems for tocotrienol oral bioavailability',
    journal: 'Pharmaceuticals',
    detail: '2023;16:1403',
    method: 'Review of formulation and delivery-system literature.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10610013/',
  },
];

export default function Research() {
  return (
    <section className="chapter alt" id="research">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">Fig. 06 — Research</span>
          <span className="rule-draw" />
          <span className="lab">Ingredient class</span>
        </div>

        <h2 className="h-lines" style={{ marginBottom: 12 }}>
          <span className="line">
            <Rise as="span" className="inner">Published research on <em>tocotrienols.</em></Rise>
          </span>
        </h2>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(24px,3.6vw,38px)' }}>
          These are references to the published literature on tocotrienols as an ingredient
          class. They are not claims about this product, and PULP makes no claim to treat,
          cure or prevent any disease.
        </Rise>

        <Rise as="ol" className="cites">
          {PAPERS.map((p, i) => (
            <li className="cite-row" key={i}>
              <span className="cite-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="cite-body">
                <p className="cite-main">
                  {p.authors} <span className="cite-title">“{p.title}.”</span>{' '}
                  <em>{p.journal}</em> {p.detail}
                </p>
                <p className="cite-method">Examined: {p.method}</p>
                <a href={p.href} target="_blank" rel="noopener" className="cite-link">
                  Read the source →
                </a>
              </div>
            </li>
          ))}
        </Rise>

        <Rise as="p" className="cites-foot">
          Wider research on tocotrienols is collected independently at{' '}
          <a href="https://tocotrienolresearch.org" target="_blank" rel="noopener">
            tocotrienolresearch.org
          </a>. PULP is a food supplement, not a medicine.
        </Rise>
      </div>
    </section>
  );
}
