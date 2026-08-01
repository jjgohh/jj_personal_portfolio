import React from 'react';
import { Rise } from '../lib.jsx';
import ProductViewer from './ProductViewer.jsx';

/*
  WORKSTREAM 2 — a verifiable proof stack, not adjectives.

  Regulatory notes for future editors:
  - Every PENDING below must stay PENDING until the certificate physically
    exists. A pending state is legally protective and reads as more honest than
    a wall of unverifiable ticks. Never swap one for a tick to "look finished".
  - "Non-GMO" and "Made in Malaysia" are provenance facts about the ingredient
    and the manufacture location. They are not health claims.
  - The softgel shell fact is "gelatin (halal bovine)" — an INGREDIENT fact.
    That is NOT a halal certification. The JAKIM mark slot stays empty until
    certified.
  - MAL[NUMBER] and KKLIU [NUMBER] are deliberate visible placeholders. Do not
    invent numbers; the real ones only exist after NPRA notification and
    advertising approval respectively.
  - Per-isomer quantities are intentionally NOT stated as label values. The
    measured split is a per-batch figure published on the COA (see Traceability).
    Printing a fixed isomer number here would be an unverifiable spec claim.
*/

const PROOF = [
  { k: 'NPRA notification', v: 'MAL[NUMBER]', state: 'pending',
    note: 'Product notification in progress. Not for sale until complete.' },
  { k: 'JAKIM halal', v: '[JAKIM MARK]', state: 'pending',
    note: 'Not yet certified. Softgel shell uses halal bovine gelatin as an ingredient fact.' },
  { k: 'GMP manufacture', v: '[CO-PACKER NAME]', state: 'pending',
    note: 'Co-packer to be named on appointment.' },
  { k: 'Non-GMO', v: 'Confirmed', state: 'ok',
    note: 'Non-GMO Malaysian oil palm fruit.' },
  { k: 'Certificate of analysis', v: 'Per batch', state: 'pending',
    note: 'Published against the batch number once the first batch is produced.' },
  { k: 'Made in Malaysia', v: 'Confirmed', state: 'ok',
    note: 'Grown, extracted, formulated and bottled in Malaysia.' },
];

export default function Proof() {
  return (
    <section className="chapter alt" id="proof">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">Fig. 03 — Proof</span>
          <span className="rule-draw" />
          <span className="lab">Status &amp; label</span>
        </div>

        <h1 className="h-lines" style={{ marginBottom: 12 }}>
          <span className="line"><span className="inner">What we can show you,</span></span>
          <span className="line"><span className="inner"><em>and what we can't yet.</em></span></span>
        </h1>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(26px,4vw,42px)' }}>
          Six checks. Two confirmed, four pending. Nothing is ticked before it is true.
        </Rise>

        {/* proof strip — honest pending states, never a fake tick */}
        <Rise as="ul" className="proof-strip">
          {PROOF.map((p) => (
            <li className={'proof-cell proof-cell--' + p.state} key={p.k}>
              <span className="proof-k">{p.k}</span>
              <span className="proof-v">{p.v}</span>
              <span className="proof-badge">{p.state === 'ok' ? 'CONFIRMED' : 'PENDING'}</span>
              <span className="proof-note">{p.note}</span>
            </li>
          ))}
        </Rise>

        <div className="spec">
          <Rise as="div" style={{ width: '100%' }}><ProductViewer /></Rise>

          {/* Supplement Facts as real semantic HTML — the brand's best design
              object and its strongest transparency artifact. Never an image. */}
          <Rise as="div" className="sfacts">
            <div className="sfacts-top">
              <span className="kie">Supplement Facts</span>
              <span className="sfacts-sku">No. 001 · PULP Complete</span>
            </div>
            <table className="sfacts-table">
              <caption className="sr-only">
                Supplement facts for PULP Complete, a full-spectrum tocotrienol vitamin E softgel.
              </caption>
              <tbody>
                <tr className="sf-serving">
                  <th scope="row">Serving size</th>
                  <td>1 softgel</td>
                </tr>
                <tr className="sf-serving">
                  <th scope="row">Servings per container</th>
                  <td>60</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th scope="col">Each softgel contains</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="sf-total">
                  <th scope="row">Tocotrienol complex (from Malaysian palm fruit)</th>
                  <td>50 mg</td>
                </tr>
                <tr className="sf-sub"><th scope="row">α-tocotrienol</th><td>Per batch</td></tr>
                <tr className="sf-sub"><th scope="row">β-tocotrienol</th><td>Per batch</td></tr>
                <tr className="sf-sub"><th scope="row">γ-tocotrienol</th><td>Per batch</td></tr>
                <tr className="sf-sub"><th scope="row">δ-tocotrienol</th><td>Per batch</td></tr>
                <tr className="sf-sub"><th scope="row">α-tocopherol</th><td>Per batch</td></tr>
              </tbody>
            </table>
            <p className="sfacts-nrv">
              The measured isomer split varies by batch and is published on that batch's
              certificate of analysis. Nutrient reference value for tocotrienols is not established.
            </p>

            <dl className="sfacts-meta">
              <div>
                <dt>Other ingredients</dt>
                <dd>Softgel shell — gelatin (halal bovine), glycerol, purified water. Carrier — palm oil.</dd>
              </div>
              <div><dt>Directions</dt><dd>One softgel daily, with food.</dd></div>
              <div><dt>Storage</dt><dd>Store below 30&nbsp;°C, away from direct sunlight. Keep the bottle closed.</dd></div>
              <div>
                <dt>Warnings</dt>
                <dd>
                  Keep out of reach of children. Not suitable for anyone with a known
                  sensitivity to any listed ingredient. If you are pregnant, nursing or taking
                  medication, speak to your doctor or pharmacist before use.
                </dd>
              </div>
            </dl>

            <p className="sfacts-reg">
              REG. NO. MAL[NUMBER] (PENDING NPRA NOTIFICATION) · KKLIU [NUMBER]
            </p>
            <p className="sfacts-disc">
              This product is not a medicine and is not intended to replace medicine.
              If symptoms persist, consult your doctor or pharmacist.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
