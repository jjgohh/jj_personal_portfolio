import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ThreeHero from './ThreeHero.jsx';
import SpectrumReveal from './components/SpectrumReveal.jsx';
import ProductViewer from './components/ProductViewer.jsx';
import Process from './components/Process.jsx';
import { Rise, Counter, Raw, useLockBody } from './lib.jsx';

/* ---------- graded-image plate slots (image + video) ---------- */
function ImagePlate({ src, alt, mk, sj, rt, cap, ratio = '4/5' }) {
  const [empty, setEmpty] = useState(false);
  return (
    <figure className={'plate' + (empty ? ' is-empty' : '')} style={{ '--ratio': ratio }}>
      <div className="plate-frame"><div className="plate-win">
        <img className="plate-img" src={src} loading="lazy" alt={alt} onError={() => setEmpty(true)} />
        <div className="plate-ph" aria-hidden="true">
          <Raw as="span" html={`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="8.5" cy="9" r="1.5"/><path d="M4 16l5-5 4 4 3-3 4 4"/></svg>`} />
          <span className="mk">{mk}</span><span className="sj">{sj}</span><span className="rt">{rt}</span>
        </div>
        <div className="plate-grade" aria-hidden="true" />
      </div></div>
      <figcaption className="plate-cap">{cap}</figcaption>
    </figure>
  );
}

function VideoPlate({ cap }) {
  const ref = useRef(null);
  const [empty, setEmpty] = useState(true);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    v.muted = true;
    const onData = () => { setEmpty(false); if (!reduce) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } };
    const onErr = () => setEmpty(true);
    v.addEventListener('loadeddata', onData); v.addEventListener('error', onErr);
    try { v.preload = 'metadata'; v.load(); } catch (e) {}
    return () => { v.removeEventListener('loadeddata', onData); v.removeEventListener('error', onErr); };
  }, []);
  return (
    <figure className={'plate' + (empty ? ' is-empty' : '')} style={{ '--ratio': '4/5' }}>
      <div className="plate-frame"><div className="plate-win">
        <video className="plate-vid" ref={ref} muted loop playsInline preload="none"
          aria-label="Origin film: the palm fruit, pressed. Muted, looping, no sound.">
          <source src="assets/origin.webm" type="video/webm" />
          <source src="assets/origin.mp4" type="video/mp4" />
        </video>
        <div className="plate-ph" aria-hidden="true">
          <Raw as="span" html={`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="1.5"/><polygon points="10,8.5 16,12 10,15.5"/></svg>`} />
          <span className="mk">Plate E · Film</span><span className="sj">Origin, pressed</span><span className="rt">4 : 5 · muted loop</span>
        </div>
        <div className="plate-grade" aria-hidden="true" />
        <span className="plate-vid-badge" aria-hidden="true"><span className="d" />Muted film</span>
      </div></div>
      <figcaption className="plate-cap">{cap}</figcaption>
    </figure>
  );
}

/* ---------- absorption bar that grows on scroll ---------- */
function GrowBar({ w, color }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className="fill" style={{ width: w, background: color }} />;
  return (
    <motion.span className="fill" style={{ background: color }} initial={{ width: 0 }}
      whileInView={{ width: w }} viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }} />
  );
}

/* ---------- nav ---------- */
const LINKS = [['#spectrum', 'Spectrum'], ['#science', 'Science'], ['#process', "How it's made"], ['#specimen', 'The Specimen']];
function Nav({ menuOpen, setMenuOpen, onWaitlist }) {
  const burgerRef = useRef(null), menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target) && burgerRef.current && !burgerRef.current.contains(e.target)) setMenuOpen(false); };
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
          <a href="#waitlist" className="nav-cta" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onWaitlist(); }}>Join the waitlist</a>
        </nav>
        <button className="burger" id="burger" ref={burgerRef} aria-label="Open menu" aria-expanded={menuOpen}
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */
function Hero({ onWaitlist }) {
  const reduce = useReducedMotion();
  const items = [
    <span className="eyebrow mono"><span className="sq" />Specimen No. 001 · Full-Spectrum Vitamin E</span>,
    <h1>One nutrient.<br />Done completely.<span className="ital">The whole spectrum of vitamin&nbsp;E — in one daily softgel.</span></h1>,
    <p className="lede">Most vitamin&nbsp;E is one molecule. PULP is the whole family.</p>,
    <div className="cta-row">
      <a href="#waitlist" className="btn btn-primary" onClick={(e) => { e.preventDefault(); onWaitlist(); }}>Join the waitlist</a>
      <a href="#spectrum" className="btn btn-ghost">See the spectrum ↓</a>
    </div>,
    <div className="cred">GRAS-affirmed ingredient · Non-GMO palm fruit · +46% absorption · Halal cert pending</div>,
  ];
  return (
    <section className="hero" id="top">
      <ThreeHero />
      <div className="hero-inner"><div className="wrap"><div className="hero-copy">
        {items.map((el, i) => reduce ? <React.Fragment key={i}>{el}</React.Fragment> : (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 + i * 0.12 }}>{el}</motion.div>
        ))}
      </div></div></div>
      <div className="scrollcue" id="scrollcue"><span className="mono">SCROLL</span><span className="ln" /></div>
    </section>
  );
}

/* ---------- waitlist forms ---------- */
function CloseForm() {
  const [done, setDone] = useState(false);
  const email = useRef(null);
  const submit = (e) => {
    e.preventDefault();
    const v = (email.current.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { email.current.style.outline = '2px solid var(--pulp)'; email.current.focus(); return; }
    setDone(true);
  };
  return (
    <>
      {!done && <>
        <form className="wl" onSubmit={submit} noValidate>
          <input type="email" ref={email} placeholder="you@email.com" aria-label="Email address" required />
          <button type="submit">Notify me at launch</button>
        </form>
        <p className="wl-note">No spam · one email at launch · unsubscribe anytime</p>
      </>}
      <p className={'wl-ok' + (done ? ' show' : '')}>You're on the list. We'll write when No. 001 is ready. ✦</p>
    </>
  );
}

function WaitlistModal({ open, onClose }) {
  const modalRef = useRef(null), emailRef = useRef(null), lastFocus = useRef(null);
  const [done, setDone] = useState(false);
  useLockBody(open);
  useEffect(() => {
    if (open) { lastFocus.current = document.activeElement; const t = setTimeout(() => emailRef.current && emailRef.current.focus(), 80); return () => clearTimeout(t); }
    else if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, [open]);
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = modalRef.current.querySelectorAll('button, input, a[href]');
        if (!f.length) return; const a = f[0], b = f[f.length - 1];
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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { emailRef.current.style.outline = '2px solid var(--pulp)'; emailRef.current.focus(); return; }
    setDone(true);
  };
  return (
    <div className={'modal-overlay' + (open ? ' open' : '')} aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" ref={modalRef}>
        <div className="m-top">
          <span className="mono">SPECIMEN · JOIN No. 001</span>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="sample-mini" aria-hidden="true" />
        <h3 id="modalTitle">Be first in <em>line.</em></h3>
        <p className="m-lede">We're making a small first batch. Leave your email and we'll write the day PULP is cleared to ship.</p>
        {!done && <>
          <form className="wl-form" onSubmit={submit} noValidate>
            <input type="email" ref={emailRef} placeholder="you@email.com" aria-label="Email address" required />
            <button type="submit">Notify me at launch</button>
          </form>
          <p className="wl-note">No spam · one email at launch · unsubscribe anytime</p>
        </>}
        <p className={'wl-success' + (done ? ' show' : '')}>You're on the list. We'll write when No. 001 is ready. ✦</p>
      </div>
    </div>
  );
}

/* ---------- sticky mobile CTA ---------- */
function MobileCta({ onOpen, overlayOpen }) {
  const [hiddenBySection, setHidden] = useState(true);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setHidden(false); return; }
    const hero = document.getElementById('top'), wl = document.getElementById('waitlist'), ft = document.querySelector('footer');
    const vis = { hero: true, wl: false, ft: false };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.target === hero) vis.hero = e.isIntersecting; else if (e.target === wl) vis.wl = e.isIntersecting; else if (e.target === ft) vis.ft = e.isIntersecting; });
      setHidden(vis.hero || vis.wl || vis.ft);
    }, { threshold: 0.01 });
    [hero, wl, ft].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const hide = hiddenBySection || overlayOpen;
  return (
    <div className={'mcta' + (hide ? ' hide' : '')}>
      <a href="#waitlist" className="mcta-btn" onClick={(e) => { e.preventDefault(); onOpen(); }}>Join the waitlist</a>
    </div>
  );
}

/* ---------- benefit + eyebrow helpers ---------- */
const HEART = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor"><path d="M24 6c8 6 14 12 14 22a14 14 0 1 1-28 0C10 18 16 12 24 6Z"/><path d="M24 20v14M18 27h12"/></svg>`;
const CELL = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor"><circle cx="24" cy="24" r="7"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/></svg>`;
const CHART = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor"><path d="M8 40 L20 24 L28 32 L40 12"/><path d="M32 12h8v8"/></svg>`;
// authored palm-frond watermark (decorative brand graphic, not a photo)
const FROND = `<svg viewBox="0 0 240 420" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M120 412 C118 300 118 190 120 34"/>
<path d="M120 34 C112 24 120 14 120 6"/>
<path d="M120 66 C92 52 72 57 54 42"/><path d="M120 66 C148 52 168 57 186 42"/>
<path d="M120 106 C86 93 66 99 46 86"/><path d="M120 106 C154 93 174 99 194 86"/>
<path d="M120 148 C84 135 62 142 42 130"/><path d="M120 148 C156 135 178 142 198 130"/>
<path d="M120 192 C86 180 64 187 46 178"/><path d="M120 192 C154 180 176 187 194 178"/>
<path d="M120 238 C90 227 70 234 54 227"/><path d="M120 238 C150 227 170 234 186 227"/>
<path d="M120 286 C96 277 80 283 68 278"/><path d="M120 286 C144 277 160 283 172 278"/>
</svg>`;

function EyebrowRow({ fig, lab }) {
  return <div className="eyebrow-row"><span className="fig">{fig}</span><span className="rule-draw" /><span className="lab">{lab}</span></div>;
}

/* ===================================================================== */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useLockBody(menuOpen);
  const openModal = () => setModalOpen(true);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="util">
        <div className="wrap">
          <span className="mono">— MALAYSIA — · TOCOTRIENOL COMPLEX</span>
          <div className="right">
            <span className="badge mono hide-sm"><span className="dot" />PRIVATE PREVIEW · NOTIFICATION PENDING</span>
            <span className="mono">No. 001</span>
          </div>
        </div>
      </div>

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onWaitlist={openModal} />
      <Hero onWaitlist={openModal} />

      {/* ORIGIN */}
      <section className="chapter amb" id="origin">
        <div className="botmark" style={{ top: '6%', right: '-3%', width: 'min(320px,32vw)' }} aria-hidden="true"><Raw html={FROND} /></div>
        <div className="wrap">
          <EyebrowRow fig="Fig. 01 — Provenance" lab="Elaeis guineensis" />
          <Rise as="div" style={{ marginBottom: 'clamp(30px,5vw,54px)' }}>
            <ImagePlate ratio="16/9" src="assets/estate.jpg"
              alt="A Malaysian oil-palm estate at golden hour" mk="Plate F" sj="The estate" rt="16 : 9"
              cap="Plate F · Malaysian oil-palm estate." />
          </Rise>
          <div className="prov">
            <div>
              <h2 className="h-lines">
                <span className="line"><Rise as="span" className="inner">Grown here.</Rise></span>
                <span className="line"><Rise as="span" className="inner" delay={0.05}><em>Overlooked everywhere.</em></Rise></span>
              </h2>
              <Rise as="p" className="lede-2">Malaysian palm fruit holds all four tocotrienols — the richest full-spectrum vitamin&nbsp;E in nature.</Rise>
            </div>
            <Rise as="div">
              <div className="bigstat"><Counter to={800} /><span className="unit"> mg/kg</span></div>
              <div className="bigstat-cap">Tocotrienol-rich fraction per kg of palm fruit.</div>
            </Rise>
          </div>
          <div className="media-row">
            <ImagePlate src="assets/origin.jpg" alt="Ripe orange-red oil-palm fruit bunch on the tree at a Malaysian estate"
              mk="Plate A" sj="Palm-fruit origin" rt="4 : 5" cap="Plate A · Where it grows — Malaysian oil-palm estate." />
            <VideoPlate cap="Plate E · A short silent origin film — autoplay pauses if you prefer reduced motion." />
          </div>
        </div>
      </section>

      {/* PROCESS — moved up: the field-to-softgel story leads the page */}
      <Process />

      {/* SPECTRUM */}
      <section className="chapter alt" id="spectrum">
        <div className="wrap">
          <EyebrowRow fig="Fig. 03 — Composition" lab="α β γ δ + toc" />
          <h2 className="h-lines" style={{ marginBottom: 10 }}>
            <span className="line"><Rise as="span" className="inner">Four tocotrienols.</Rise></span>
            <span className="line"><Rise as="span" className="inner" delay={0.05}><em>One softgel.</em></Rise></span>
          </h2>
          <Rise as="p" className="lede-2" style={{ marginBottom: 36 }}>Drag to compare ordinary vitamin&nbsp;E with the full family — the ratio inside every softgel.</Rise>
          <p className="sr-only">A comparison of ingredient form. Ordinary vitamin E is a single alpha-tocopherol. PULP full spectrum contains alpha, beta, gamma and delta tocotrienols plus alpha-tocopherol — gamma-tocotrienol 32 percent, alpha-tocotrienol 26 percent, alpha-tocopherol 24 percent, delta-tocotrienol 8 percent, beta-tocotrienol 3 percent. This is a comparison of ingredient form, not a health claim.</p>
          <SpectrumReveal />
          <div className="spectrum-foot">
            <span className="mono">Full spectrum = α + β + γ + δ tocotrienols + α-tocopherol</span>
            <span className="mono">% of total vitamin E · minor isomers ~7%</span>
          </div>
        </div>
      </section>

      {/* SCIENCE */}
      <section className="chapter amb" id="science">
        <div className="botmark" style={{ bottom: '4%', left: '-4%', width: 'min(300px,30vw)', transform: 'scaleX(-1)' }} aria-hidden="true"><Raw html={FROND} /></div>
        <div className="wrap">
          <EyebrowRow fig="Fig. 04 — Research" lab="Scientific Reports · 2026" />
          <div className="sci">
            <div className="num"><Counter to={15} /><span className="x">×</span></div>
            <div className="body">
              <Rise as="h4">The rarer half often behaves more powerfully.</Rise>
              <Rise as="p">In a 2026 lab study, tocotrienols were ~15× more effective than α-tocopherol at curbing ferroptosis — iron-driven cell damage.</Rise>
              <Rise as="p" className="cite">Yang et al., "Tocotrienols exhibit superior ferroptosis inhibition over tocopherols," <a href="https://www.nature.com/articles/s41598-025-34673-1" target="_blank" rel="noopener">Scientific Reports 16:4497 (2026)</a> · in-vitro, human cells · EC50 0.12 μM vs 2.0 μM. This is early laboratory research on tocotrienols in general, not a claim that PULP treats, cures or prevents any disease.</Rise>
            </div>
          </div>
        </div>
      </section>

      {/* ABSORPTION */}
      <section className="chapter alt" id="absorption">
        <div className="wrap">
          <EyebrowRow fig="Fig. 05 — Delivery" lab="Bio-Enhanced" />
          <h2 className="h-lines" style={{ marginBottom: 10 }}>
            <span className="line"><Rise as="span" className="inner">Getting it in is</Rise></span>
            <span className="line"><Rise as="span" className="inner" delay={0.05}><em>half the battle.</em></Rise></span>
          </h2>
          <Rise as="p" className="lede-2" style={{ marginBottom: 40 }}>Tocotrienols are hard to absorb. PULP's Bio-Enhanced delivery gets more where it's needed.</Rise>
          <div className="cmp">
            <div className="row"><div className="top"><span>PULP · Bio-Enhanced delivery</span><span className="v">+46%</span></div><div className="track"><GrowBar w="100%" color="var(--pulp)" /></div></div>
            <div className="row"><div className="top"><span>Standard tocotrienol formulation</span><span className="v">baseline</span></div><div className="track"><GrowBar w="68%" color="var(--taupe)" /></div></div>
          </div>
          <Rise as="p" className="cite" style={{ marginTop: 24 }}>Ingredient: DavosLife E3 Bio-Enhanced 20 · patented self-emulsifying delivery system · absorbed with or without dietary fat. Self-emulsifying delivery is shown to improve tocotrienol oral bioavailability in <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10610013/" target="_blank" rel="noopener">Pharmaceuticals (MDPI) 2023;16:1403</a>. Relative figure vs standard formulation.</Rise>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="chapter amb" id="benefits">
        <div className="wrap">
          <EyebrowRow fig="Fig. 06 — Everyday" lab="Antioxidant support" />
          <h2 className="h-lines" style={{ marginBottom: 34 }}>
            <span className="line"><Rise as="span" className="inner">Why it earns a <em>daily</em> place.</Rise></span>
          </h2>
          <div className="bens">
            {[['01', HEART, 'Skin barrier', 'A fat-soluble antioxidant that helps defend skin from oxidative stress.'],
              ['02', CELL, 'Cellular defence', "Works inside cell membranes — where water-soluble antioxidants can't."],
              ['03', CHART, 'Start early', 'Built for people who future-proof, not catch up.']]
              .map(([no, ic, h, p], i) => (
                <Rise as="article" className="ben" key={no} delay={i * 0.08}>
                  <span className="no">{no}</span>
                  <Raw as="span" html={ic} />
                  <h4>{h}</h4><p>{p}</p>
                </Rise>
              ))}
          </div>
          <Rise as="div" className="research-line"><span className="d">†</span><span className="txt">These are structure-function statements about vitamin E as a nutrient. PULP is a food supplement and makes no claim to treat, cure or prevent any disease. Wider research on tocotrienols is collected at tocotrienolresearch.org.</span></Rise>
        </div>
      </section>

      {/* SPECIMEN */}
      <section className="chapter alt" id="specimen">
        <div className="wrap">
          <EyebrowRow fig="Fig. 07 — The Specimen" lab="PULP Complete" />
          <div className="spec">
            <Rise as="div" style={{ width: '100%' }}><ProductViewer /></Rise>
            <Rise as="div" className="spec-panel">
              <div className="kie">Certificate of the Specimen</div>
              <h3>P<span className="u">u</span>lp <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--terra)' }}>Complete</span></h3>
              <div className="desc">fifty mg. full-spectrum tocotrienol</div>
              <div className="facts">
                {[['Designation', <>No. 001 · <em>Complete</em></>], ['Active', 'Full-spectrum tocotrienol complex'],
                  ['Strength', <><em>50 mg</em> per softgel</>], ['Count', '60 softgels · ~2 months'],
                  ['Source', 'Non-GMO Malaysian palm fruit'], ['Directions', 'One softgel daily, with food'],
                  ['Status', 'Halal & NPRA notification pending']].map(([k, v], i) => (
                    <div className="r" key={i}><span className="k">{k}</span><span className="v">{v}</span></div>
                  ))}
              </div>
              <a href="#waitlist" className="btn btn-primary" onClick={(e) => { e.preventDefault(); openModal(); }}>Join the waitlist</a>
            </Rise>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="chapter" id="founder">
        <div className="wrap">
          <Rise as="div" className="founder">
            <div className="g"><div className="body">
              <div className="kie">A Note From The Founder</div>
              <h3>Why I built PULP around a fruit the world overlooks.</h3>
              <p>In Malaysia, the oil palm is everywhere — yet no one makes its most complete nutrient the hero. So we did.</p>
              <div className="sign"><span className="nm">— Your name</span><span className="role">Founder · Golden Pulp Sdn Bhd · 金果</span></div>
            </div></div>
          </Rise>
        </div>
      </section>

      {/* WAITLIST CLOSE */}
      <section className="close" id="waitlist">
        <div className="in">
          <div className="kie">Join No. 001</div>
          <h2>Be first in <em>line.</em></h2>
          <p>A small first batch. We won't sell until our product notification with Malaysia's NPRA is complete — leave your email and you'll be first to know.</p>
          <CloseForm />
        </div>
      </section>

      {/* APPENDIX */}
      <section className="chapter alt record">
        <div className="wrap">
          <EyebrowRow fig="Appendix — On This Page" lab="Jump to a section" />
          <div className="grid">
            {[['#science', 'The Science'], ['#spectrum', 'Full Spectrum'], ['#origin', 'Origin'], ['#process', "How it's made"], ['#benefits', 'Benefits'], ['mailto:hello@pulp.my', 'Contact us']].map(([href, t]) => (
              <a className="rec" href={href} key={t}><span className="t">{t}</span><span className="a">→</span></a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <span className="mark">P<span className="u">u</span>lp</span>
              <p>Full-spectrum vitamin E, pressed from Malaysian palm fruit. For people who start early.</p>
              <p className="cn">金果 · Golden Pulp Sdn Bhd</p>
            </div>
            <div className="foot-col">
              <h5>Explore</h5>
              <a href="#science">The Science</a><a href="#spectrum">Full Spectrum</a><a href="#process">How it's made</a><a href="#benefits">Benefits</a>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href="mailto:hello@pulp.my">hello@pulp.my</a>
              <a href="https://wa.me/60000000000" target="_blank" rel="noopener">WhatsApp us</a>
              <a href="https://www.instagram.com/pulp.my/" target="_blank" rel="noopener">@pulp.my</a>
              <p>Selangor, Malaysia</p>
            </div>
          </div>
          <p className="reg-line">REG. NO. MAL•••••••••NC (PENDING NPRA NOTIFICATION) · KKLIU ••••/EXP ••.••.•••• · HALAL CERT: IN PROGRESS</p>
          <p className="disclaimer">This product is not a medicine and is not intended to replace medicine. If symptoms persist, consult your doctor or pharmacist. Research references describe tocotrienols as an ingredient class and are not claims about this product.</p>
          <div className="foot-bottom">
            <span>© 2026 GOLDEN PULP SDN BHD · 金果有限公司 · ALL RIGHTS RESERVED</span>
            <span>PRIVATE PREVIEW — NOT FOR SALE UNTIL NPRA NOTIFICATION IS COMPLETE</span>
          </div>
        </div>
      </footer>

      <MobileCta onOpen={openModal} overlayOpen={modalOpen || menuOpen} />
      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
