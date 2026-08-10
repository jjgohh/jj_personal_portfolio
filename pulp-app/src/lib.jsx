import React, { useEffect, useRef, useState } from 'react';

/*
  WORKSTREAM 4 — framer-motion removed.

  GSAP (ScrollFX) already owns scroll choreography, so framer-motion was ~40KB
  gzipped of duplicate capability on the critical path. These helpers reproduce
  the same API (Rise / Counter) on an IntersectionObserver + CSS transitions,
  costing well under 1KB.

  Graceful degradation is the whole trick: the hidden start state lives behind
  `html.js-anim`, a class this module adds only when JS runs AND the visitor has
  not asked for reduced motion. If the bundle fails, or reduced motion is on,
  the class is never added and every element renders at its natural, visible
  position. Nothing is ever hidden by CSS alone.
*/

const REDUCE_Q = '(prefers-reduced-motion: reduce)';

function prefersReduce() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia(REDUCE_Q).matches
    : false;
}

/*
  Arms the animated start state. Deliberately NOT called at module scope: the gate
  hides real content (`html.js-anim [data-rise]{opacity:0}`) and is lifted only by
  React writing data-rise-in. Setting it during module evaluation meant a throw
  anywhere in the remaining bundle left content hidden with nothing left to reveal
  it. Call this from a mounted component, so it can only arm once React is proven
  alive; the timer disarms it if no element has been revealed, so nothing can stay
  hidden indefinitely.
*/
const REVEAL_BACKSTOP_MS = 4000;

export function useArmReveals() {
  useEffect(() => {
    if (prefersReduce()) return;
    const html = document.documentElement;
    html.classList.add('js-anim');
    const t = setTimeout(() => {
      if (!document.querySelector('[data-rise][data-rise-in]')) {
        html.classList.remove('js-anim');
        console.warn('[pulp] no reveals fired within 4s — disarming the hide gate');
      }
    }, REVEAL_BACKSTOP_MS);
    return () => clearTimeout(t);
  }, []);
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(prefersReduce);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REDUCE_Q);
    const on = () => setReduce(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);
  return reduce;
}

// Fires once when the element first enters the viewport.
export function useInViewOnce(ref, { margin = '0px 0px -12% 0px' } = {}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    // Fail OPEN on a missing ref or a missing observer: no dependency here ever
    // changes, so returning early would leave the element hidden permanently.
    if (!el) { setSeen(true); return; }
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    // If the observer never fires — element clipped, or in a display:none subtree —
    // reveal anyway rather than hide content for good. This is the failure mode
    // that cost four headlines.
    const backstop = setTimeout(() => setSeen(true), 3000);
    return () => { io.disconnect(); clearTimeout(backstop); };
  }, [ref, seen, margin]);
  return seen;
}

// Render trusted, static inline SVG/markup (our own brand line-art) verbatim.
export function Raw({ html, as = 'span', className, ...rest }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

// Scroll-triggered reveal. Same call signature as the old framer version.
export function Rise({ as: Tag = 'div', children, className, y = 26, delay = 0, style, ...rest }) {
  const ref = useRef(null);
  const inView = useInViewOnce(ref);
  return (
    <Tag
      ref={ref}
      className={className}
      data-rise=""
      {...(inView ? { 'data-rise-in': '' } : {})}
      style={{ '--ry': `${y}px`, '--rd': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Count-up that runs once when scrolled into view (static under reduced-motion).
export function Counter({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInViewOnce(ref, { margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  /* Starts at the FINAL value, not 0. Prerendered HTML has to read correctly for
     someone whose JavaScript never runs — "0 mg" would be a wrong fact on the
     page. The client starts there too, so hydration matches; the count-up then
     ramps from 0 when the element scrolls into view, which is below the fold in
     every current use, so the final value is never seen before it animates. */
  const [val, setVal] = useState(to);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    let raf, start;
    const step = (t) => {
      if (start == null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

// Lock body scroll while a menu/modal is open.
export function useLockBody(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}
