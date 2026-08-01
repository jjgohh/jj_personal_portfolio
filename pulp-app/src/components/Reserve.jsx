import React, { useRef, useState } from 'react';

/*
  WORKSTREAM 5 — honest scarcity + the reservation form.

  ── INTEGRATION POINT ──────────────────────────────────────────────────────
  Replace submitReservation() below with the real email provider call. It is the
  ONLY place the network is touched, deliberately, so no provider is hardcoded
  into the UI. Contract:

    submitReservation(email) -> Promise<{ position?: number }>

  Resolve to { position } if the backend can report a queue position; resolve to
  {} if it cannot. The confirmation renders the position ONLY when a real number
  comes back — it never invents one.

  The SAME endpoint is where a payment gateway drops in at NPRA clearance: the
  reservation record gains an order id and the confirmation gains a pay step.
  No redesign needed — the form, states and copy all stay.
  ───────────────────────────────────────────────────────────────────────────

  SCARCITY / PRICING NOTES:
  - BATCH_CAP is a real cap. If the number changes, change it here and nowhere
    else. Never show a countdown that resets, and never show a "remaining"
    counter until it is fed by real reservation data — see REMAINING below.
  - Founders' price and RRP are BLOCKING PLACEHOLDERS. They are stated as two
    plain facts. Do NOT style the RRP as a struck-through discount: this is a
    price anchor before launch, not a promotion.
  - This is a RESERVATION, not a purchase. No cart, no checkout, no payment.
    Every CTA on the site reads "Reserve your bottle".
*/

export const BATCH_CAP = 88; // fengshui-favourable double-prosperity count. 168 also valid.

// Real remaining count or nothing. Set to a number ONLY when fed by live data.
const REMAINING = null;

/*
  INTEGRATION POINT. The implementation MUST THROW on a non-2xx response —
  fetch() resolves for 500/502/429, so `return r.json()` alone would render
  "You're on the list" while the provider was rate-limiting you, silently losing
  exactly the launch-day spike you most want to capture.
*/
export async function submitReservation(email) {
  await new Promise((r) => setTimeout(r, 450));
  return {};
}

const TIMEOUT_MS = 15000;

/*
  One submit path for every reservation surface. This exists because the modal —
  which is the primary CTA on the hero, the nav, the sticky mobile bar, the PDP
  and the CTA band on all six deep routes — used to validate the email and jump
  straight to a success message WITHOUT ever calling submitReservation. Every
  reservation taken through it was discarded behind a checkmark. Any new surface
  must use this hook rather than reimplementing submit.
*/
export function useReservation() {
  const [status, setStatus] = useState('idle');  // idle | busy | error | done
  const [error, setError] = useState('');
  const [position, setPosition] = useState(null);

  const submit = async (email) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email address, for example you@email.com.');
      setStatus('error');
      return false;
    }
    setError('');
    setStatus('busy');
    let timer;
    try {
      // Without this a stalled connection leaves the button disabled and
      // reading "Reserving…" forever, with no way back but a page reload.
      const res = await Promise.race([
        submitReservation(email),
        new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS); }),
      ]);
      if (res && typeof res === 'object' && typeof res.position === 'number') setPosition(res.position);
      setStatus('done');
      return true;
    } catch (err) {
      // Never swallow silently: with no server acknowledging reservations, a
      // broken form otherwise produces zero signal anywhere.
      console.error('[reservation] submit failed', err);
      setError(err && err.message === 'timeout'
        ? 'That took too long — check your connection and try again.'
        : "We couldn't save your reservation. Please try again, or email hello@pulp.my.");
      setStatus('error');
      return false;
    } finally {
      clearTimeout(timer);
    }
  };

  return { status, error, position, submit };
}

export default function Reserve() {
  const inputRef = useRef(null);
  const { status, error, position, submit: send } = useReservation();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await send((inputRef.current.value || '').trim());
    if (!ok && inputRef.current) inputRef.current.focus();
  };

  const shareText = encodeURIComponent(
    'PULP — full-spectrum tocotrienol vitamin E, grown, extracted and bottled in Malaysia. ' +
    'The first batch is capped at ' + BATCH_CAP + '. https://pulp.my'
  );

  return (
    <section className="close reserve" id="reserve">
      <div className="in">
        <div className="kie">Founders' batch · No. 001</div>
        <h2>Reserve your <em>bottle.</em></h2>

        {/* honest scarcity — a stated cap, never a live-looking fake counter */}
        <div className="batch-facts">
          <div className="bf">
            <span className="bf-n">{BATCH_CAP}</span>
            <span className="bf-k">bottles in the first batch</span>
          </div>
          <p className="bf-note">
            {REMAINING === null ? (
              <>The cap is {BATCH_CAP} bottles — a plain fact, not a countdown. We'll publish
              the remaining count here once reservations are live and the number is real.</>
            ) : (
              <>{REMAINING} of {BATCH_CAP} still unreserved.</>
            )}
          </p>
        </div>

        <dl className="price-anchor">
          <div><dt>Founders' price</dt><dd>[FOUNDERS PRICE]</dd></div>
          <div><dt>Price after the first batch</dt><dd>[RRP]</dd></div>
        </dl>
        <p className="price-note">
          Two facts, stated plainly. Reserving costs nothing now and commits you to nothing —
          we cannot sell until our NPRA product notification is complete.
        </p>

        {status !== 'done' ? (
          <>
            <form className="rsv-form" onSubmit={submit} noValidate>
              <div className="rsv-field">
                <label htmlFor="rsv-email">Email address</label>
                <input
                  id="rsv-email" ref={inputRef} type="email" name="email"
                  autoComplete="email" inputMode="email" placeholder="you@email.com"
                  aria-describedby="rsv-status" aria-invalid={status === 'error'}
                  required
                />
              </div>
              <button type="submit" className="rsv-btn" disabled={status === 'busy'}>
                {status === 'busy' ? 'Reserving…' : 'Reserve your bottle'}
              </button>
            </form>
            {/* Status markers sit WITH the control, not in a distant section:
                the objections a buyer has are strongest at the moment they act. */}
            <ul className="rsv-trust">
              <li>Non-GMO Malaysian palm fruit</li>
              <li>50 mg per softgel · 60 per bottle</li>
              <li>NPRA notification pending</li>
              <li>No payment taken</li>
            </ul>
            {/* reserved height: status changes never shift layout */}
            <p className="rsv-note" id="rsv-status" role="status" aria-live="polite">
              {status === 'error'
                ? <span className="rsv-err">{error}</span>
                : 'One email. No spam, no newsletter — we write when No. 001 is cleared to ship.'}
            </p>
          </>
        ) : (
          <div className="rsv-done" role="status" aria-live="polite">
            <span className="rsv-tick" aria-hidden="true">✦</span>
            <h3>You're on the list.</h3>
            {position !== null && (
              <p className="rsv-pos">You're number <strong>{position}</strong> in the queue.</p>
            )}
            <ol className="rsv-next">
              <li>We finish NPRA product notification.</li>
              <li>You get one email — before anyone else — when No.&nbsp;001 can ship.</li>
              <li>Your founders' price is held for the first {BATCH_CAP} bottles.</li>
            </ol>
            <a className="rsv-share"
              href={`https://wa.me/?text=${shareText}`}
              target="_blank" rel="noopener">
              Share PULP on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
