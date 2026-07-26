import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  Page-level scroll choreography (GSAP ScrollTrigger).

  Layered ON TOP of the existing framer-motion reveals, on purpose: framer
  owns the one-time inner-element fades + the hero load, GSAP owns continuous,
  scroll-linked motion (progress, parallax depth, scrub reveals, a pinned
  flagship). To avoid two libraries fighting over one node, GSAP only targets
  elements framer does NOT drive (section .wrap containers, .rule-draw,
  .botmark, .plate-img, .bigstat, .sci .num).

  Graceful degradation: no start state is baked into CSS, so if GSAP never
  runs (error / very old browser) every element sits at its natural, visible
  position. All motion lives inside a `(prefers-reduced-motion: no-preference)`
  matchMedia block, so reduced-motion users get a calm, static page.
*/
export default function ScrollFX() {
  const barRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1 — scroll progress bar (top of page)
      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', transformOrigin: 'left center',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
        );
      }

      // 2 — every section lifts in as it enters (container-level, y only so it
      //     composes cleanly with framer's inner fades)
      gsap.utils.toArray('.chapter .wrap, .close .in, footer .wrap').forEach((el) => {
        gsap.from(el, {
          y: 46, autoAlpha: 1, ease: 'power2.out', duration: 0.85,
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
        });
      });

      // 3 — the Fig. rule draws itself across as each section arrives
      gsap.utils.toArray('.eyebrow-row .rule-draw').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 58%', scrub: true },
        });
      });

      // 4 — faint botanical watermarks drift for depth
      gsap.utils.toArray('.botmark').forEach((el) => {
        gsap.fromTo(el, { yPercent: -12 }, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // 5 — cinematic parallax inside every image / video plate window
      gsap.utils.toArray('.plate-img, .plate-vid').forEach((el) => {
        gsap.fromTo(el, { yPercent: -7, scale: 1.14 }, {
          yPercent: 7, scale: 1.14, ease: 'none',
          scrollTrigger: { trigger: el.closest('.plate') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // 6 — big numbers drift against the scroll
      gsap.utils.toArray('.bigstat, .sci .num').forEach((el) => {
        gsap.fromTo(el, { yPercent: 10 }, {
          yPercent: -10, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // 7 — flagship: pin the Science chapter and scrub the "15×" up in scale.
      //     Science has no touch UI, so pinning is safe here.
      const sci = document.querySelector('#science');
      const sciNum = document.querySelector('#science .num');
      if (sci && sciNum) {
        gsap.timeline({
          scrollTrigger: {
            trigger: sci, start: 'top top', end: '+=55%',
            pin: true, pinSpacing: true, scrub: 1, refreshPriority: -1,
            invalidateOnRefresh: true,
          },
        }).fromTo(sciNum, { scale: 0.8, opacity: 0.55 }, { scale: 1.14, opacity: 1, ease: 'none' });
      }
    });

    // recalc once web fonts / late layout settle (positions depend on them)
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  });

  return <div className="gsx-progress" aria-hidden="true" ref={barRef} />;
}
