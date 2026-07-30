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

// Arm the animated start state exactly once, on the client, motion permitting.
if (typeof document !== 'undefined' && !prefersReduce()) {
  document.documentElement.classList.add('js-anim');
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
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
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

// True on touch/coarse-pointer devices.
export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (window.matchMedia) setTouch(window.matchMedia('(hover:none) and (pointer:coarse)').matches);
  }, []);
  return touch;
}
