import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Spectrum from './components/Spectrum.jsx';
import Traceability from './components/Traceability.jsx';
import Proof from './components/Proof.jsx';
import Founder from './components/Founder.jsx';
import Reserve from './components/Reserve.jsx';
import Research from './components/Research.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import ScrollFX from './components/ScrollFX.jsx';
import { useLockBody, useReducedMotion } from './lib.jsx';

/*
  WORKSTREAM 4 — Three.js is no longer on the critical path.

  It was 172KB gzipped, 54% of the whole payload, on the metric that matters most
  for Instagram traffic on mid-range Android. It now loads ONLY when the session
  can actually appreciate it: fine pointer, wide viewport, motion allowed. It is
  code-split by lazy() so mobile never downloads it at all, and gated behind a
  post-paint idle callback so it can never compete with LCP.
*/
/* The .catch is load-bearing, not defensive noise. In the single-file Artifact
   build the dynamic chunk cannot be inlined and therefore does not exist, so the
   import rejects. An uncaught lazy() rejection unmounts the whole React tree —
   i.e. a blank page. Resolving to a null component instead means the 3D simply
   never appears and the rest of the site is untouched. Same protection on a flaky
   network. */
const ThreeHero = lazy(() =>
  import('./ThreeHero.jsx').catch(() => ({ default: () => null }))
);

function useAffords3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const q = window.matchMedia(
      '(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (!q.matches) return;
    // wait until the main thread is genuinely idle, after first paint
    const start = () => setOk(true);
    const id = 'requestIdleCallback' in window
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return ok;
}

/* ---------- nav ----------
   ONE CTA verb across the entire site: "Reserve your bottle". Never mix in
   "Join the waitlist" / "Buy" — the button, the confirmation and the email must
   all use the same word. */
const CTA = 'Reserve your bottle';
const LINKS = [
  ['#spectrum', 'Composition'],
  ['#traceability', 'Traceability'],
  ['#proof', 'Proof'],
  ['#research', 'Research'],
];

function Nav({ menuOpen, setMenuOpen, onReserve }) {
  const burgerRef = useRef(null), menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)
        && burgerRef.current && !burgerRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen, setMenuOpen]);
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#top" aria-label="PULP home">
          <span className="mark">P<span className="u">u</span>lp</span>
          <span className="sub">金果 · Est. 2026</span>
        </a>
        <nav className={'links' + (menuOpen ? ' open' : '')} id="menu" ref={menuRef}>
          {LINKS.map(([href, label]) => (
            <a key={href} className="navlink" href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a href="#reserve" className="nav-cta"
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); onReserve(); }}>{CTA}</a>
        </nav>
        <button className="burger" ref={burgerRef} aria-label="Open menu" aria-expanded={menuOpen}
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ---------- hero ----------
   Headline chosen from three candidates: leads with the ownable gap in plain
   language, then the structural fact no competitor can copy. Zero jargon in
   position one; the isomer specifics move to the lede. No health claim. */
function Hero({ onReserve }) {
  const show3D = useAffords3D();
  return (
    <section className="hero" id="top">
      {show3D && (
        <Suspense fallback={null}>
          <ThreeHero />
        </Suspense>
      )}
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
          <a href="#reserve" className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); onReserve(); }}>{CTA}</a>
          <a href="#spectrum" className="btn btn-ghost">See what's inside ↓</a>
        </div>
        <div className="cred" data-hero="" style={{ '--hd': '.56s' }}>
          Non-GMO Malaysian palm fruit · DavosLife E3 by KLK OLEO · 60 softgels ·
          NPRA notification pending
        </div>
      </div></div></div>
      <div className="scrollcue"><span className="mono">SCROLL</span><span className="ln" /></div>
    </section>
  );
}

/* ---------- reservation modal (same verb, same copy as the section) ---------- */
function ReserveModal({ open, onClose }) {
  const modalRef = useRef(null), emailRef = useRef(null), lastFocus = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
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

  const submit = (e) => {
    e.preventDefault();
    const v = (emailRef.current.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setError('Enter a valid email address, for example you@email.com.');
      setStatus('error'); emailRef.current.focus(); return;
    }
    setError(''); setStatus('done');
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
          The first batch is capped at 88 bottles. Reserving costs nothing and commits you to
          nothing — we cannot sell until NPRA notification is complete.
        </p>
        {status !== 'done' ? (
          <>
            <form className="wl-form" onSubmit={submit} noValidate>
              <label className="sr-only" htmlFor="modal-email">Email address</label>
              <input id="modal-email" type="email" ref={emailRef} placeholder="you@email.com"
                autoComplete="email" inputMode="email" aria-invalid={status === 'error'}
                aria-describedby="modal-status" required />
              <button type="submit">{CTA}</button>
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

/* ---------- sticky mobile CTA — thumb zone, dismissible, safe-area aware ---------- */
function MobileCta({ onOpen, overlayOpen }) {
  const [hiddenBySection, setHidden] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setHidden(false); return; }
    const hero = document.getElementById('top');
    const rsv = document.getElementById('reserve');
    const ft = document.querySelector('footer');
    const vis = { hero: true, rsv: false, ft: false };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.target === hero) vis.hero = e.isIntersecting;
        else if (e.target === rsv) vis.rsv = e.isIntersecting;
        else if (e.target === ft) vis.ft = e.isIntersecting;
      });
      setHidden(vis.hero || vis.rsv || vis.ft);
    }, { threshold: 0.01 });
    [hero, rsv, ft].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const hide = hiddenBySection || overlayOpen || dismissed;
  return (
    <div className={'mcta' + (hide ? ' hide' : '')}>
      <a href="#reserve" className="mcta-btn"
        onClick={(e) => { e.preventDefault(); onOpen(); }}>{CTA}</a>
      <button className="mcta-x" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

/* ===================================================================== */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useLockBody(menuOpen);
  const openModal = () => setModalOpen(true);

  return (
    <>
      <a className="skip" href="#spectrum">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <ScrollFX />

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

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onReserve={openModal} />

      <main>
        <Hero onReserve={openModal} />
        <Spectrum />
        <Traceability />
        <Proof />
        <Founder />
        <Reserve />
        <Research />
      </main>

      <SiteFooter />

      <MobileCta onOpen={openModal} overlayOpen={modalOpen || menuOpen} />
      <ReserveModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
