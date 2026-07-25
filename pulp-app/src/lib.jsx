import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// Render trusted, static inline SVG/markup (our own brand line-art) verbatim.
export function Raw({ html, as = 'span', className, ...rest }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

// Scroll-triggered reveal. Falls back to a static, visible element under
// reduced-motion so nothing moves involuntarily.
export function Rise({ as = 'div', children, className, y = 26, delay = 0, style, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as] || motion.div;
  if (reduce) {
    const Tag = as;
    return <Tag className={className} style={style} {...rest}>{children}</Tag>;
  }
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Count-up that runs once when scrolled into view (static under reduced-motion).
export function Counter({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
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
