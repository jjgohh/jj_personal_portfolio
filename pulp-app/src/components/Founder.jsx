import React from 'react';
import { Rise } from '../lib.jsx';

/*
  WORKSTREAM 5 — founder credibility as the stand-in for social proof.

  BLOCKING PLACEHOLDERS: [FOUNDER NAME] and [FOUNDER PHOTO].
  The photo slot holds a 4:5 portrait at assets/founder.jpg. Until that file
  exists the slot renders a labelled placeholder rather than collapsing.

  Regulatory note: this copy deliberately contains no health claim. It is about
  provenance, industry and intent. Do not let an editor slip "helps with…" or
  "good for…" into a founder note — it is advertising copy like any other.
*/
export default function Founder() {
  return (
    <section className="chapter" id="founder">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">Fig. 04 — Founder</span>
          <span className="rule-draw" />
          <span className="lab">A note</span>
        </div>

        <Rise as="div" className="fnd">
          <figure className="fnd-portrait">
            <div className="fnd-frame">
              <img src="assets/founder.jpg" width="640" height="800" loading="lazy"
                alt="[FOUNDER PHOTO] — portrait of the founder of PULP"
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div className="fnd-ph" aria-hidden="true">
                <span className="mk">[FOUNDER PHOTO]</span>
                <span className="sj">Portrait</span>
                <span className="rt">4 : 5 · required</span>
              </div>
            </div>
            <figcaption>Selangor, Malaysia</figcaption>
          </figure>

          <div className="fnd-body">
            <blockquote className="fnd-quote">
              <p>
                I grew up seeing oil palm everywhere in Malaysia — on the drive to school, on
                the news, in arguments about what this country exports. What I never saw was a
                Malaysian brand making the most complete nutrient in that fruit the centre of a
                product. We ship the raw material out and buy it back on a foreign label.
              </p>
              <p>
                PULP is my attempt at the other order of things: grown here, extracted here,
                bottled here — and sold with the supply chain written on the page. One product.
                Sixty softgels. Everything we know about it, published.
              </p>
            </blockquote>
            <div className="fnd-sign">
              <span className="nm">— [FOUNDER NAME]</span>
              <span className="role">Founder · Golden Pulp Sdn Bhd · 金果</span>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
