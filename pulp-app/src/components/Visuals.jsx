import React from 'react';

/*
  Code-authored landing-page visuals. No photography, no fabricated provenance
  imagery, nothing that could be mistaken for documentation we do not have.

  REGULATORY: both diagrams below are COMPOSITIONAL or PROCESS-descriptive.
  FAMILY shows which of the eight vitamin E molecules are in the bottle; CHAIN
  shows where the material physically travels. Neither says anything about an
  effect on a body, and neither may be relabelled to.

  Animation hooks are class names only (.fam-node, .chain-step, …) so ScrollFX
  owns all motion and these stay pure markup. Every element is visible by
  default — if GSAP never runs, both diagrams simply sit there, complete.
*/

/* ---- the vitamin E family: 8 molecules, PULP contains 5 of them ---- */
const FAMILY = [
  { g: 'α', k: 'T3', in: true }, { g: 'β', k: 'T3', in: true },
  { g: 'γ', k: 'T3', in: true }, { g: 'δ', k: 'T3', in: true },
  { g: 'α', k: 'T', in: true }, { g: 'β', k: 'T', in: false },
  { g: 'γ', k: 'T', in: false }, { g: 'δ', k: 'T', in: false },
];

export function FamilyDiagram() {
  return (
    <figure className="fam">
      <div className="fam-rows">
        <div className="fam-row">
          <span className="fam-rk">Tocotrienols</span>
          <div className="fam-nodes">
            {FAMILY.filter((f) => f.k === 'T3').map((f, i) => (
              <span key={i} className={'fam-node' + (f.in ? ' is-in' : '')}>
                <span className="fam-g">{f.g}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="fam-row">
          <span className="fam-rk">Tocopherols</span>
          <div className="fam-nodes">
            {FAMILY.filter((f) => f.k === 'T').map((f, i) => (
              <span key={i} className={'fam-node' + (f.in ? ' is-in' : '')}>
                <span className="fam-g">{f.g}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        The eight forms of vitamin&nbsp;E. Filled nodes are in every PULP softgel —
        all four tocotrienols, plus α-tocopherol.
      </figcaption>
    </figure>
  );
}

/* ---- fruit → oil → softgel, as a teaser out to the full chain ---- */
const ICONS = {
  fruit: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M24 9c1.6 2.6 1.6 4.8 0 7"/><path d="M29 11c3-.4 5.2 1.4 4.9 4.4"/>
    <g fill="currentColor" stroke="none"><circle cx="19" cy="20" r="4.1"/><circle cx="28" cy="20" r="4.1"/>
    <circle cx="15" cy="28" r="4.1"/><circle cx="24" cy="28" r="4.1"/><circle cx="33" cy="28" r="4.1"/>
    <circle cx="19" cy="36" r="4.1"/><circle cx="28" cy="36" r="4.1"/></g></svg>`,
  oil: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
    <path d="M24 8c6 8.4 8.4 13 8.4 17.4A8.4 8.4 0 0 1 24 33.8a8.4 8.4 0 0 1-8.4-8.4C15.6 21 18 16.4 24 8z" fill="currentColor" fill-opacity=".18"/>
    <path d="M20 26a4 4.6 0 0 0 4 4" stroke-linecap="round"/></svg>`,
  gel: `<svg viewBox="0 0 48 48" fill="none">
    <rect x="17" y="9" width="14" height="30" rx="7" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.5"/>
    <rect x="20.5" y="13" width="3" height="12" rx="1.5" fill="currentColor" fill-opacity=".5"/></svg>`,
};

const STEPS = [
  { ic: ICONS.fruit, n: '01', t: 'Malaysian palm fruit' },
  { ic: ICONS.oil, n: '02', t: 'Tocotrienol fraction' },
  { ic: ICONS.gel, n: '03', t: 'One 50 mg softgel' },
];

export function ChainTeaser() {
  return (
    <div className="chain" role="img"
      aria-label="Three-step diagram: Malaysian palm fruit, then the tocotrienol fraction extracted from it, then one 50 milligram softgel.">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="chain-step">
            <span className="chain-ic" dangerouslySetInnerHTML={{ __html: s.ic }} />
            <span className="chain-n">{s.n}</span>
            <span className="chain-t">{s.t}</span>
          </div>
          {i < STEPS.length - 1 && (
            <span className="chain-link" aria-hidden="true"><span className="chain-link-fill" /></span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
