import React, { useEffect, useState } from 'react';

/*
  The connective thread.

  A fixed left-hand rail that draws downward as the visitor scrolls and lights a
  registration tick as each landing block becomes active. It is what makes the
  page's animation read as ONE continuous movement rather than five separate
  reveals: every section reveal is timed against the same rail, so the eye
  follows a single line down the page.

  Deliberately fixed-position, so it needs no layout measurement and can never
  shift content (CLS-safe). Shown only where there is genuine gutter room
  (>=1100px); on narrower screens the top progress bar already carries the same
  information, so this would be clutter.

  On-brand rather than decorative: hairline rule, registration ticks and mono
  numerals are the specimen/pharmacopoeia vernacular the brand already uses.

  Clickable — each tick is a real button that scrolls to its block, so the rail
  is navigation as well as ornament. Hidden from assistive tech because the
  same destinations exist as ordinary links elsewhere on the page.
*/

const STOPS = [
  { id: 'top', n: '01', label: 'Specimen' },
  { id: 'essentials', n: '02', label: 'Essentials' },
  { id: 'why', n: '03', label: 'Composition' },
  { id: 'chain', n: '04', label: 'Origin' },
  { id: 'status', n: '05', label: 'Status' },
  { id: 'reserve', n: '06', label: 'Reserve' },
];

export default function ScrollRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = STOPS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver((entries) => {
      // the block occupying the middle of the viewport wins
      const mid = window.innerHeight / 2;
      let best = null, bestDist = Infinity;
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best != null) setActive(best);
    }, { threshold: [0, 0.15, 0.4, 0.75, 1] });
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rail" aria-hidden="true">
      <span className="rail-line"><span className="rail-line-fill" /></span>
      <ul>
        {STOPS.map((s, i) => (
          <li key={s.id} className={i === active ? 'is-on' : (i < active ? 'is-past' : '')}>
            <button type="button" tabIndex={-1} onClick={() => go(s.id)}>
              <span className="rail-tick" />
              <span className="rail-n">{s.n}</span>
              <span className="rail-l">{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
