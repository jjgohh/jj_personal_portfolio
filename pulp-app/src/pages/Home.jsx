import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Rise, Counter } from '../lib.jsx';
import Reserve from '../components/Reserve.jsx';
import ScrollRail from '../components/ScrollRail.jsx';
import { FamilyDiagram, ChainTeaser } from '../components/Visuals.jsx';
import { href, navigate } from '../router.jsx';

/* 3D stays deferred and desktop-only. The .catch is load-bearing: in the
   single-file Artifact build the chunk does not exist, and an uncaught lazy()
   rejection would unmount the whole tree. */
const ThreeHero = lazy(() =>
  import('../ThreeHero.jsx').catch(() => ({ default: () => null }))
);

function useAffords3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const q = window.matchMedia(
      '(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (!q.matches) return;
    const start = () => setOk(true);
    const id = 'requestIdleCallback' in window
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return ok;
}

/*
  THE LANDING PAGE — deliberately shallow.

  It carries only what a cold visitor needs to decide: what this is, what is in
  it, that it is credible, and how to reserve. Every deeper story (composition,
  traceability, the label, research, the founder's note, FAQ) now lives on its
  own route behind the "Learn" dropdown. Nothing below is a summary of a section
  further down this page — the page simply ends at the reservation.

  Rule for future editors: if you want to add a section here, replace one
  instead. The landing page earns its conversion rate by what it leaves out.
*/
export default function Home({ onReserve, cta }) {
  const show3D = useAffords3D();
  const go = (to) => (e) => { e.preventDefault(); navigate(to); };

  return (
    <>
      <ScrollRail />
      <section className="hero" id="top">
        {show3D && <Suspense fallback={null}><ThreeHero /></Suspense>}
        <div className="hero-inner"><div className="wrap"><div className="hero-copy">
          <span className="eyebrow mono" data-hero="" style={{ '--hd': '.10s' }}>
            <span className="sq" />Specimen No. 001 · Full-Spectrum Vitamin E
          </span>
          <h1 data-hero="" style={{ '--hd': '.20s' }}>
            The vitamin&nbsp;E most<br />supplements skip.
            <span className="ital">Grown, extracted and bottled in Malaysia.</span>
          </h1>
          <p className="lede" data-hero="" style={{ '--hd': '.32s' }}>
            Four tocotrienols plus α-tocopherol — 50&nbsp;mg of full-spectrum vitamin&nbsp;E
            in one daily softgel.
          </p>
          <div className="cta-row" data-hero="" style={{ '--hd': '.44s' }}>
            <a href={href('/')} className="btn btn-primary"
              onClick={(e) => { e.preventDefault(); onReserve(); }}>{cta}</a>
            <a href={href('/product')} className="btn btn-ghost" onClick={go('/product')}>
              See the specimen →
            </a>
          </div>
          <div className="cred" data-hero="" style={{ '--hd': '.56s' }}>
            Non-GMO Malaysian palm fruit · DavosLife E3 by KLK OLEO ·
            NPRA notification pending
          </div>
        </div></div></div>
        <div className="scrollcue"><span className="mono">SCROLL</span><span className="ln" /></div>
      </section>

      {/* THE ESSENTIALS — the only product facts on the landing page */}
      <section className="chapter essentials linked" id="essentials" aria-labelledby="ess-h">
        <div className="wrap">
          <h2 id="ess-h" className="sr-only">The essentials</h2>
          {/* One panel, one set of hairlines. The stat row and the two notes
              share a single outer border so the right edge lines up and the
              whole thing reads as one specimen data panel rather than a
              full-width grid with two narrower boxes orphaned underneath. */}
          <Rise as="div" className="ess-panel">
            <dl className="ess-grid">
              <div><dt>Per softgel</dt><dd><Counter to={50} /> mg</dd><dd className="ess-sub">tocotrienol complex</dd></div>
              <div><dt>In the bottle</dt><dd><Counter to={60} /></dd><dd className="ess-sub">softgels · ~2 months</dd></div>
              <div><dt>How to take it</dt><dd>One daily</dd><dd className="ess-sub">with any meal</dd></div>
              <div><dt>Made in</dt><dd>Malaysia</dd><dd className="ess-sub">grown, extracted, bottled</dd></div>
            </dl>

            <div className="ess-notes">
              {/* the moment of use, made concrete — a usage instruction, not a claim */}
              <div className="ess-note">
                <span className="ess-note-k">The routine</span>
                <p>
                  One softgel with breakfast. Sixty in a bottle, so about two months per
                  bottle. That is the whole thing — no loading phase, nothing to measure.
                </p>
              </div>

              {/* safety early and in plain sight, not buried in the FAQ */}
              <div className="ess-note ess-note--care">
                <span className="ess-note-k">Before you reserve</span>
                <p>
                  PULP is a food supplement, not a medicine, and is not intended to replace
                  medicine. Keep out of reach of children. Not suitable for anyone with a
                  known sensitivity to any listed ingredient. If you are pregnant, nursing
                  or taking medication, speak to your doctor or pharmacist before use.
                </p>
                <a href={href('/proof')} onClick={go('/proof')}>Read the full label and warnings →</a>
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* WHY THIS FORM — three lines, then out to the full explainer */}
      <section className="chapter amb linked" id="why" aria-labelledby="why-h">
        <div className="wrap">
          <div className="eyebrow-row">
            <span className="fig">Why this form</span>
            <span className="rule-draw" />
            <span className="lab">α β γ δ</span>
          </div>
          <div className="why">
            <div>
              <h2 id="why-h" className="h-lines" style={{ marginBottom: 14 }}>
                <span className="line"><Rise as="span" className="inner">Most vitamin E is</Rise></span>
                <span className="line"><Rise as="span" className="inner" delay={0.05}><em>one molecule.</em></Rise></span>
              </h2>
              <Rise as="p" className="lede-2">
                Vitamin E is a family of eight. Most supplements contain one of them —
                α-tocopherol. PULP contains the four tocotrienols, plus α-tocopherol.
              </Rise>
              <Rise as="p" className="why-more">
                <a href={href('/composition')} onClick={go('/composition')}>
                  See exactly what's inside →
                </a>
              </Rise>
            </div>
            <div className="why-vis">
              <div className="why-glyphs" aria-hidden="true">
                <span className="glyph">α</span><span className="glyph">β</span>
                <span className="glyph">γ</span><span className="glyph">δ</span>
              </div>
              <FamilyDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* WHERE IT COMES FROM — a visual, not a paragraph. Full chain on /traceability. */}
      <section className="chapter chainsec linked" id="chain" aria-labelledby="chain-h">
        <div className="wrap">
          <div className="eyebrow-row">
            <span className="fig">Fruit to softgel</span>
            <span className="rule-draw" />
            <span className="lab">One country</span>
          </div>
          <h2 id="chain-h" className="h-lines" style={{ marginBottom: 'clamp(22px,3.2vw,34px)' }}>
            <span className="line">
              <Rise as="span" className="inner">Three steps, <em>all Malaysian.</em></Rise>
            </span>
          </h2>
          <ChainTeaser />
          <Rise as="p" className="why-more">
            <a href={href('/traceability')} onClick={go('/traceability')}>
              See every step, and who does it →
            </a>
          </Rise>
        </div>
      </section>

      {/* TRUST AT A GLANCE — status summary, detail lives on /proof */}
      <section className="chapter alt linked" id="status" aria-labelledby="trust-h">
        <div className="wrap">
          <div className="eyebrow-row">
            <span className="fig">Where we stand</span>
            <span className="rule-draw" />
            <span className="lab">Status</span>
          </div>
          <h2 id="trust-h" className="h-lines" style={{ marginBottom: 18 }}>
            <span className="line">
              <Rise as="span" className="inner">Nothing ticked before it's <em>true.</em></Rise>
            </span>
          </h2>
          <Rise as="ul" className="trust-row">
            <li><span className="tb tb--ok">CONFIRMED</span><span className="tk">Made in Malaysia</span></li>
            <li><span className="tb tb--ok">CONFIRMED</span><span className="tk">Non-GMO palm fruit</span></li>
            <li><span className="tb">PENDING</span><span className="tk">NPRA notification</span></li>
            <li><span className="tb">PENDING</span><span className="tk">JAKIM halal</span></li>
          </Rise>
          <Rise as="p" className="why-more">
            <a href={href('/proof')} onClick={go('/proof')}>
              See all six checks and the full label →
            </a>
          </Rise>
        </div>
      </section>

      {/* A named human before the ask. PULP has no customers yet, so there are
          no reviews to show and none will be invented — the founder is the
          honest substitute for social proof. */}
      <section className="chapter fnote linked" id="fnote" aria-labelledby="fnote-h">
        <div className="wrap">
          <Rise as="blockquote" className="fnote-q">
            <h2 id="fnote-h" className="sr-only">A note from the founder</h2>
            <p>
              “We ship this fruit out of Malaysia and buy it back on a foreign label.
              PULP is my attempt at the other order of things.”
            </p>
            <footer>
              <span className="fnote-nm">— [FOUNDER NAME]</span>
              <span className="fnote-role">Founder · Golden Pulp Sdn Bhd</span>
              <a href={href('/story')} onClick={go('/story')}>Read the full note →</a>
            </footer>
          </Rise>
        </div>
      </section>

      {/* THE CONVERSION MOMENT — the page ends here, by design */}
      <Reserve />
    </>
  );
}
