import React from 'react';

/*
  WORKSTREAMS 2 + 5 — contact credibility, local payment rails, disclaimers.

  BLOCKING PLACEHOLDERS: [SSM NUMBER], [REGISTERED ADDRESS], [WHATSAPP NUMBER].
  Valid contact detail is one of the most-cited trust signals in supplement
  buying, and a Malaysian buyer specifically expects WhatsApp — so these are
  conversion blockers, not cosmetic gaps.

  The payment row is DELIBERATELY text, monochrome and quiet. It signals "local
  operation" before a visitor ever reaches a checkout. It is NOT a checkout and
  must not imply one — the wording stays "at launch". No cart, no prices here.

  BNPL (Atome / SPayLater) is the fastest-growing local slice and is worth
  considering at launch. Deliberately NOT built now — pre-notification, offering
  instalments on a product that cannot be sold would be indefensible.
*/

const PAYMENTS = ['FPX', 'DuitNow QR', "Touch 'n Go eWallet", 'GrabPay', 'Visa', 'Mastercard'];

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="mark">P<span className="u">u</span>lp</span>
            <p>
              Full-spectrum tocotrienol vitamin E, grown, extracted and bottled in Malaysia.
            </p>
            <p className="cn">金果 · Golden Pulp Sdn Bhd</p>
          </div>

          <div className="foot-col">
            <h2 className="foot-h">Explore</h2>
            <a href="#spectrum">Composition</a>
            <a href="#traceability">Traceability</a>
            <a href="#proof">Proof &amp; label</a>
            <a href="#research">Research</a>
          </div>

          <div className="foot-col">
            <h2 className="foot-h">Contact</h2>
            <a href="mailto:hello@pulp.my">hello@pulp.my</a>
            <a href="https://wa.me/[WHATSAPP NUMBER]" target="_blank" rel="noopener">
              WhatsApp — [WHATSAPP NUMBER]
            </a>
            <a href="https://www.instagram.com/pulpmy/" target="_blank" rel="noopener">@pulpmy</a>
          </div>

          <div className="foot-col">
            <h2 className="foot-h">Registered entity</h2>
            <p>Golden Pulp Sdn Bhd (金果有限公司)</p>
            <p>Company no. [SSM NUMBER]</p>
            <p>[REGISTERED ADDRESS]</p>
          </div>
        </div>

        {/* quiet, monochrome — a locality signal, not a logo wall */}
        <div className="pay-row">
          <span className="pay-k">Payment methods at launch</span>
          <ul className="pay-list">
            {PAYMENTS.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <p className="reg-line">
          REG. NO. MAL[NUMBER] (PENDING NPRA NOTIFICATION) · KKLIU [NUMBER] · HALAL CERT: NOT YET CERTIFIED
        </p>
        <p className="disclaimer">
          This product is not a medicine and is not intended to replace medicine. If symptoms
          persist, consult your doctor or pharmacist. Research references on this site describe
          tocotrienols as an ingredient class and are not claims about this product.
        </p>
        <div className="foot-bottom">
          <span>© 2026 GOLDEN PULP SDN BHD · 金果有限公司 · ALL RIGHTS RESERVED</span>
          <span>PRIVATE PREVIEW — NOT FOR SALE UNTIL NPRA NOTIFICATION IS COMPLETE</span>
        </div>
      </div>
    </footer>
  );
}
