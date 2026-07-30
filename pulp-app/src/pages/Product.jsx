import React from 'react';
import { Rise } from '../lib.jsx';
import ProductViewer from '../components/ProductViewer.jsx';
import { href, navigate } from '../router.jsx';

/*
  PRODUCT PAGE (PDP) — deliberately built to standard ecommerce anatomy:
  gallery on the left, a "buy box" on the right carrying name, dose, price,
  primary action, key facts and fulfilment info.

  It is a RESERVE box, not a buy box, because the product is not yet NPRA
  notified and cannot legally be sold. The anatomy is identical to a real one on
  purpose: at clearance you replace the reserve action with add-to-cart, fill in
  the two price slots, and the layout, hierarchy and copy structure all survive.
  See Reserve.jsx for the single integration point.

  No health claims anywhere on this page. Facts, composition, provenance,
  fulfilment. Benefit language belongs nowhere near a transaction control.
*/
export default function Product({ onReserve, cta }) {
  const go = (to) => (e) => { e.preventDefault(); navigate(to); };
  return (
    <section className="chapter pdp-wrap">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">No. 001 — The Specimen</span>
          <span className="rule-draw" />
          <span className="lab">PULP Complete</span>
        </div>

        <div className="pdp">
          <Rise as="div" className="pdp-gallery"><ProductViewer /></Rise>

          <Rise as="div" className="pdp-box">
            <h1 className="pdp-title">
              P<span className="u">u</span>lp <em>Complete</em>
            </h1>
            <p className="pdp-sub">Full-spectrum tocotrienol vitamin&nbsp;E · 50&nbsp;mg · 60 softgels</p>

            {/* price anchor: two facts, no struck-through discount styling */}
            <dl className="pdp-price">
              <div>
                <dt>Founders' price</dt>
                <dd className="pdp-price-main">[FOUNDERS PRICE]</dd>
              </div>
              <div>
                <dt>Price after the first batch</dt>
                <dd>[RRP]</dd>
              </div>
            </dl>

            <div className="pdp-actions">
              <button type="button" className="btn btn-primary pdp-cta" onClick={onReserve}>
                {cta}
              </button>
              <p className="pdp-cta-note">
                Reserving costs nothing and commits you to nothing. We cannot sell until our
                NPRA product notification is complete.
              </p>
            </div>

            <dl className="pdp-facts">
              <div><dt>Active</dt><dd>Tocotrienol complex from Malaysian palm fruit</dd></div>
              <div><dt>Isomers</dt><dd>α-, β-, γ-, δ-tocotrienol + α-tocopherol</dd></div>
              <div><dt>Ingredient</dt><dd>DavosLife E3 · KLK OLEO</dd></div>
              <div><dt>Softgel shell</dt><dd>Gelatin (halal bovine), glycerol, purified water</dd></div>
              <div><dt>Directions</dt><dd>One softgel daily, with food</dd></div>
              <div><dt>Origin</dt><dd>Grown, extracted, formulated and bottled in Malaysia</dd></div>
              <div><dt>Status</dt><dd>MAL[NUMBER] — NPRA notification pending</dd></div>
            </dl>

            <ul className="pdp-links">
              <li><a href={href('/proof')} onClick={go('/proof')}>Full Supplement Facts label →</a></li>
              <li><a href={href('/composition')} onClick={go('/composition')}>What "full spectrum" means →</a></li>
              <li><a href={href('/traceability')} onClick={go('/traceability')}>Where it comes from →</a></li>
            </ul>

            <p className="pdp-disc">
              This product is not a medicine and is not intended to replace medicine.
              If symptoms persist, consult your doctor or pharmacist.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
