import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  Page-level scroll choreography (GSAP ScrollTrigger).

  All motion lives inside a `(prefers-reduced-motion: no-preference)` matchMedia
  block, and the pin is additionally gated to wide viewports — pinning on a phone
  costs layout stability for very little payoff, which is the wrong trade for
  Instagram traffic on mid-range Android.

  Graceful degradation: no start state is baked into CSS for anything GSAP owns,
  so if GSAP never runs every element sits at its natural, visible position.
*/
export default function ScrollFX() {
  const barRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1 — scroll progress bar
      if (barRef.current) {
        gsap.fromTo(barRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: 'none', transformOrigin: 'left center',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
      }

      // 2 — each section lifts in (container-level, y only; the per-element
      //     fades are owned by Rise/IntersectionObserver so these never collide)
      gsap.utils.toArray('.chapter .wrap, .close .in, footer .wrap').forEach((el) => {
        gsap.from(el, {
          y: 44, ease: 'power2.out', duration: 0.85,
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
        });
      });

      // 3 — the Fig. rule draws across as each section arrives
      gsap.utils.toArray('.eyebrow-row .rule-draw').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 58%', scrub: true },
        });
      });

      // 4 — botanical watermarks drift for depth
      gsap.utils.toArray('.botmark').forEach((el) => {
        gsap.fromTo(el, { yPercent: -12 }, {
          yPercent: 12, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom', end: 'bottom top', scrub: true,
          },
        });
      });

      // 5 — the isomer glyphs stagger in, then drift against the scroll
      const glyphs = gsap.utils.toArray('.glyph-band .glyph');
      if (glyphs.length) {
        gsap.from(glyphs, {
          y: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.glyph-band', start: 'top 82%', toggleActions: 'play none none none' },
        });
        gsap.fromTo('.glyph-band', { yPercent: 6 }, {
          yPercent: -6, ease: 'none',
          scrollTrigger: { trigger: '#spectrum', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }

      // 6 — the batch-cap number drifts
      if (document.querySelector('.bf-n')) {
        gsap.fromTo('.bf-n', { yPercent: 8 }, {
          yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: '#reserve', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }

      // 7 — traceability chain: each step draws in as it arrives
      gsap.utils.toArray('.trace-step').forEach((el, i) => {
        gsap.from(el, {
          x: -18, opacity: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    });

    // 8 — flagship pin: DESKTOP ONLY. Scrubs the glyph band up in scale while
    //     the Spectrum section holds. Never pins on a phone.
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const sec = document.querySelector('#spectrum');
      const band = document.querySelector('.glyph-band');
      if (!sec || !band) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sec, start: 'top top', end: '+=45%',
          pin: true, pinSpacing: true, scrub: 1,
          refreshPriority: -1, invalidateOnRefresh: true,
        },
      }).fromTo(band, { scale: 0.92 }, { scale: 1.08, ease: 'none' });
    });

    // recalc once fonts / late layout settle
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  });

  return <div className="gsx-progress" aria-hidden="true" ref={barRef} />;
}
