import React, { useEffect, useRef, useState } from 'react';
import { ROUTES, href, navigate } from '../router.jsx';

/*
  Ecommerce-style nav: a shallow landing page, with depth behind a dropdown.

  The dropdown is a real disclosure, built to the WAI-ARIA menu-button pattern:
  - button carries aria-expanded + aria-controls
  - Enter / Space / ArrowDown open it and focus the first item
  - ArrowUp / ArrowDown move between items, Home / End jump to the ends
  - Escape closes and returns focus to the button
  - Tab out, or an outside click, closes it
  It is a <nav> of links (not role="menu"), because these navigate rather than
  perform actions — role="menu" would make screen readers announce it as an
  application menu, which is the wrong promise.
*/

const LEARN = ['/composition', '/traceability', '/proof', '/research', '/story', '/faq'];

export default function Nav({ route, onReserve, cta }) {
  const [open, setOpen] = useState(false);       // dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const itemsRef = useRef([]);

  // close everything on route change
  useEffect(() => { setOpen(false); setMobileOpen(false); }, [route]);

  // outside click / focus-out
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // queue an index to focus once the popup is actually visible
  const pendingFocus = useRef(null);
  useEffect(() => {
    if (!open || pendingFocus.current == null) return;
    const i = pendingFocus.current;
    pendingFocus.current = null;
    const raf = requestAnimationFrame(() => focusItem(i));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const focusItem = (i) => {
    const list = itemsRef.current.filter(Boolean);
    if (!list.length) return;
    const n = (i + list.length) % list.length;
    list[n]?.focus();
  };

  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) focusItem(0); else { pendingFocus.current = 0; setOpen(true); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) focusItem(-1); else { pendingFocus.current = -1; setOpen(true); }
    } else if (e.key === 'Escape') setOpen(false);
  };

  const onItemKey = (e, i) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(-1); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); btnRef.current?.focus(); }
    else if (e.key === 'Tab' && !e.shiftKey && i === LEARN.length - 1) setOpen(false);
  };

  const go = (to) => (e) => { e.preventDefault(); setOpen(false); setMobileOpen(false); navigate(to); };
  const isLearn = LEARN.includes(route);

  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href={href('/')} onClick={go('/')} aria-label="PULP home">
          <span className="mark">P<span className="u">u</span>lp</span>
          <span className="sub">金果 · Est. 2026</span>
        </a>

        <nav className={'links' + (mobileOpen ? ' open' : '')} aria-label="Main">
          <a className={'navlink' + (route === '/product' ? ' is-current' : '')}
            href={href('/product')} onClick={go('/product')}
            aria-current={route === '/product' ? 'page' : undefined}>
            The Specimen
          </a>

          {/* ---- dropdown ---- */}
          <div className="dd">
            <button ref={btnRef} type="button" className={'navlink ddbtn' + (isLearn ? ' is-current' : '')}
              aria-expanded={open} aria-controls="dd-learn" onKeyDown={onBtnKey}
              onClick={() => setOpen((o) => !o)}>
              Learn
              <svg className="ddcaret" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className={'ddpop' + (open ? ' open' : '')} id="dd-learn" ref={popRef}>
              <ul>
                {LEARN.map((to, i) => (
                  <li key={to}>
                    <a ref={(el) => (itemsRef.current[i] = el)} href={href(to)} onClick={go(to)}
                      onKeyDown={(e) => onItemKey(e, i)} tabIndex={open ? 0 : -1}
                      aria-current={route === to ? 'page' : undefined}
                      className={route === to ? 'is-current' : undefined}>
                      <span className="ddt">{ROUTES[to]}</span>
                      <span className="ddd">{DESCR[to]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a href={href('/')} className="nav-cta"
            onClick={(e) => { e.preventDefault(); setMobileOpen(false); onReserve(); }}>{cta}</a>
        </nav>

        <button className="burger" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={(e) => { e.stopPropagation(); setMobileOpen((o) => !o); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
    </header>
  );
}

const DESCR = {
  '/composition': 'What is actually in the softgel',
  '/traceability': 'Fruit to bottle, named at every step',
  '/proof': 'Certifications, pending states, full label',
  '/research': 'Published literature on tocotrienols',
  '/story': 'Why we built this',
  '/faq': 'Questions, answered plainly',
};
