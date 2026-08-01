import React, { useEffect, useRef, useState } from 'react';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Faq from './pages/Faq.jsx';
import Spectrum from './components/Spectrum.jsx';
import Traceability from './components/Traceability.jsx';
import Proof from './components/Proof.jsx';
import Founder from './components/Founder.jsx';
import Research from './components/Research.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import ScrollFX from './components/ScrollFX.jsx';
import { useLockBody, useArmReveals } from './lib.jsx';
import { useReservation, BATCH_CAP } from './components/Reserve.jsx';
import { ROUTES, useRoute, navigate, href } from './router.jsx';

/* ONE CTA verb sitewide. The button, the modal, the confirmation and the
   eventual launch email all use this exact string. */
const CTA = 'Reserve your bottle';

/* ---------- reservation modal ---------- */
function ReserveModal({ open, onClose }) {
  const modalRef = useRef(null), emailRef = useRef(null), lastFocus = useRef(null);
  /* Shared with the Reserve section. Previously this component validated the
     email and set status straight to 'done' without ever contacting the
     integration point, so every reservation taken through the modal — the
     primary CTA everywhere on the site — was thrown away behind a checkmark. */
  const { status, error, submit: send } = useReservation();
  useLockBody(open);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      const t = setTimeout(() => emailRef.current && emailRef.current.focus(), 80);
      return () => clearTimeout(t);
    } else if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = modalRef.current.querySelectorAll('button, input, a[href]');
        if (!f.length) return;
        const a = f[0], b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await send((emailRef.current.value || '').trim());
    if (!ok && emailRef.current) emailRef.current.focus();
  };

  return (
    <div className={'modal-overlay' + (open ? ' open' : '')} aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" ref={modalRef}>
        <div className="m-top">
          <span className="mono">SPECIMEN · RESERVE No. 001</span>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="sample-mini" aria-hidden="true" />
        <h3 id="modalTitle">Reserve your <em>bottle.</em></h3>
        <p className="m-lede">
          The first batch is capped at {BATCH_CAP} bottles. Reserving costs nothing and commits you
          to nothing — we cannot sell until NPRA notification is complete.
        </p>
        {status !== 'done' ? (
          <>
            <form className="wl-form" onSubmit={submit} noValidate>
              <label className="sr-only" htmlFor="modal-email">Email address</label>
              <input id="modal-email" type="email" ref={emailRef} placeholder="you@email.com"
                autoComplete="email" inputMode="email" aria-invalid={status === 'error'}
                aria-describedby="modal-status" required />
              <button type="submit" disabled={status === 'busy'}>
                {status === 'busy' ? 'Reserving…' : CTA}
              </button>
            </form>
            <p className="wl-note" id="modal-status" role="status" aria-live="polite">
              {status === 'error'
                ? <span className="rsv-err">{error}</span>
                : 'One email at launch · unsubscribe anytime'}
            </p>
          </>
        ) : (
          <p className="wl-success show" role="status" aria-live="polite">
            You're on the list. We'll write when No. 001 is ready. ✦
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- sticky mobile CTA ---------- */
function MobileCta({ onOpen, overlayOpen, route }) {
  const [past, setPast] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > 420);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [route]);
  // never compete with the reservation block that already sits on the home page
  const [atReserve, setAtReserve] = useState(false);
  useEffect(() => {
    const el = document.getElementById('reserve');
    if (!el || !('IntersectionObserver' in window)) { setAtReserve(false); return; }
    const io = new IntersectionObserver((es) => setAtReserve(es.some((e) => e.isIntersecting)), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [route]);

  const hide = !past || overlayOpen || dismissed || atReserve;
  return (
    <div className={'mcta' + (hide ? ' hide' : '')}>
      <a href={href('/')} className="mcta-btn"
        onClick={(e) => { e.preventDefault(); onOpen(); }}>{CTA}</a>
      <button className="mcta-x" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- deep pages get a reservation footer band, home already has one ---------- */
function CtaBand({ onReserve }) {
  return (
    <section className="ctaband">
      <div className="wrap">
        <p>The first batch is capped at {BATCH_CAP} bottles.</p>
        <button type="button" className="btn btn-primary" onClick={onReserve}>{CTA}</button>
      </div>
    </section>
  );
}

/* ===================================================================== */
export default function App() {
  const route = useRoute();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  useArmReveals();

  /* Route change: reset scroll and move focus to the new page so keyboard and
     screen-reader users are not left where the previous page was. Skipped on
     first paint so we do not steal focus on load. */
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'auto' });
    const el = mainRef.current;
    if (el) {
      el.focus({ preventScroll: true });
    }
    document.title = route === '/'
      ? 'PULP — Full-Spectrum Vitamin E, Grown and Bottled in Malaysia'
      : `${ROUTES[route]} · PULP`;
  }, [route]);

  const page = () => {
    switch (route) {
      case '/product': return <Product onReserve={openModal} cta={CTA} />;
      case '/composition': return <><Spectrum /><CtaBand onReserve={openModal} /></>;
      case '/traceability': return <><Traceability /><CtaBand onReserve={openModal} /></>;
      case '/proof': return <><Proof /><CtaBand onReserve={openModal} /></>;
      case '/research': return <><Research /><CtaBand onReserve={openModal} /></>;
      case '/story': return <><Founder /><CtaBand onReserve={openModal} /></>;
      case '/faq': return <><Faq /><CtaBand onReserve={openModal} /></>;
      default: return <Home onReserve={openModal} cta={CTA} />;
    }
  };

  return (
    <>
      {/* Focuses <main> directly instead of setting location.hash — on a
          hash-routed site an href="#main" is a navigation, not an anchor. */}
      <a className="skip" href="#main" onClick={(e) => {
        e.preventDefault();
        const el = mainRef.current;
        if (!el) return;
        el.focus();
        el.scrollIntoView({ block: 'start' });
      }}>Skip to content</a>
      <div className="grain" aria-hidden="true" />
      {/* keyed so every scroll animation is rebuilt for the new page's DOM */}
      <ScrollFX key={route} />

      <div className="util">
        <div className="wrap">
          <span className="mono">— MALAYSIA — · TOCOTRIENOL COMPLEX</span>
          <div className="right">
            <span className="badge mono hide-sm">
              <span className="dot" />PRIVATE PREVIEW · NOTIFICATION PENDING
            </span>
            <span className="mono">No. 001</span>
          </div>
        </div>
      </div>

      <Nav route={route} onReserve={openModal} cta={CTA} />

      <main id="main" ref={mainRef} tabIndex={-1}>{page()}</main>

      <SiteFooter />
      <MobileCta onOpen={openModal} overlayOpen={modalOpen} route={route} />
      <ReserveModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
