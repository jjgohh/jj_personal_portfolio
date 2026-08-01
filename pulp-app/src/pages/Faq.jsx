import React from 'react';
import { Rise } from '../lib.jsx';
import { href, navigate } from '../router.jsx';

/*
  FAQ — native <details>/<summary>, so it needs no JavaScript, is keyboard
  operable for free, and is searchable by in-page find because closed content
  still exists in the DOM.

  REGULATORY: every answer below is composition, provenance, fulfilment or
  regulatory status. None describes an effect on the body. The two questions most
  likely to tempt an editor into a health claim — "what does it do" and "should I
  take it" — are deliberately answered with what the product IS and a referral to
  a pharmacist. Keep it that way.
*/

const QA = [
  {
    q: 'What is tocotrienol vitamin E?',
    a: (
      <>
        Vitamin E is not one molecule but a family of eight: four tocopherols and four
        tocotrienols. Most supplements labelled "vitamin E" contain a single one,
        α-tocopherol. PULP contains the four tocotrienols (α, β, γ, δ) together with
        α-tocopherol — 50&nbsp;mg of the complex per softgel.
      </>
    ),
  },
  {
    q: 'How is this different from the vitamin E already on the shelf?',
    a: (
      <>
        It is a difference of composition, not of dose. A typical vitamin E capsule is
        one isomer; PULP is the full tocotrienol spectrum plus α-tocopherol. We describe
        what is in the bottle and let you compare labels — see{' '}
        <a href={href('/composition')} onClick={(e) => { e.preventDefault(); navigate('/composition'); }}>
          Composition
        </a>.
      </>
    ),
  },
  {
    q: 'When can I actually buy it?',
    a: (
      <>
        Not yet. PULP is going through product notification with Malaysia's National
        Pharmaceutical Regulatory Agency (NPRA), and we will not sell before that is
        complete. Reserving now puts you first in line and costs nothing.
      </>
    ),
  },
  {
    q: 'Does reserving cost anything, or commit me to anything?',
    a: (
      <>
        No. No payment is taken and no card details are collected. A reservation is an
        email address on a list, and you can leave it at any time. Nothing is charged
        unless and until you choose to order after launch.
      </>
    ),
  },
  {
    q: 'Is PULP halal certified?',
    a: (
      <>
        Not yet — and we will not display a JAKIM mark before it is issued. What we can
        state as an ingredient fact today: the softgel shell uses gelatin (halal bovine).
        Certification status is listed honestly alongside our other checks on{' '}
        <a href={href('/proof')} onClick={(e) => { e.preventDefault(); navigate('/proof'); }}>
          Proof &amp; Label
        </a>.
      </>
    ),
  },
  {
    q: 'Where is it made?',
    a: (
      <>
        Entirely in Malaysia. The fruit is Malaysian non-GMO oil palm; the tocotrienol
        fraction is extracted by KLK OLEO as the branded ingredient DavosLife E3;
        formulation and bottling are Malaysian too. Each step is named on{' '}
        <a href={href('/traceability')} onClick={(e) => { e.preventDefault(); navigate('/traceability'); }}>
          Traceability
        </a>.
      </>
    ),
  },
  {
    q: 'How do I take it?',
    a: <>One softgel daily, with food. Store below 30&nbsp;°C, away from direct sunlight.</>,
  },
  {
    q: 'Who should not take it?',
    a: (
      <>
        Keep out of reach of children. It is not suitable for anyone with a known
        sensitivity to any listed ingredient. If you are pregnant, nursing, or taking
        medication, speak to your doctor or pharmacist before use. PULP is a food
        supplement, not a medicine, and is not intended to replace medicine.
      </>
    ),
  },
  {
    q: 'What will you publish for each batch?',
    a: (
      <>
        The batch number, the measured isomer split for that batch, a downloadable
        certificate of analysis matched to it, and the manufacture date. That is a
        forward commitment — no batch has been produced yet.
      </>
    ),
  },
  {
    q: 'How will I be able to pay, and where do you ship?',
    a: (
      <>
        At launch we intend to accept FPX, DuitNow QR, Touch&nbsp;'n&nbsp;Go eWallet,
        GrabPay, Visa and Mastercard. Shipping details, rates and coverage will be
        confirmed before the first batch ships: [SHIPPING POLICY].
      </>
    ),
  },
  {
    q: 'What is your returns policy?',
    a: (
      <>
        To be published before the first order is taken: [RETURNS POLICY]. Since nothing
        can be purchased yet, no order is currently subject to it.
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section className="chapter" id="faq">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="fig">FAQ</span>
          <span className="rule-draw" />
          <span className="lab">Answered plainly</span>
        </div>

        <h1 className="h-lines" style={{ marginBottom: 14 }}>
          <span className="line"><span className="inner">Questions, <em>answered.</em></span></span>
        </h1>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(24px,3.6vw,38px)' }}>
          If something here is unclear, ask us directly — the contact details in the footer
          are real people.
        </Rise>

        <Rise as="div" className="faq">
          {QA.map(({ q, a }, i) => (
            <details className="faq-item" key={i}>
              <summary>
                <span className="faq-q">{q}</span>
                <span className="faq-i" aria-hidden="true" />
              </summary>
              <div className="faq-a"><p>{a}</p></div>
            </details>
          ))}
        </Rise>
      </div>
    </section>
  );
}
