import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* iOS Safari collapses/expands its address bar during scroll, which fires a
   resize and makes ScrollTrigger recalculate every trigger mid-gesture — the
   page visibly jumps and pinned/scrubbed sections snap. This tells ScrollTrigger
   to ignore that particular resize, which is the documented remedy. */
ScrollTrigger.config({ ignoreMobileResize: true });

/*
  Scroll choreography.

  The goal is ONE continuous movement down the page, not a pile of separate
  reveals. Three things buy that coherence:

  1. A shared vocabulary — every reveal uses the same easing (EASE), the same
     stagger (STAGGER) and the same trigger point (START). Because the cadence
     never changes, consecutive sections read as one system handing off to the
     next rather than five different animations.
  2. A literal thread — the fixed left rail fills with page progress, and each
     `.linked` section draws a hairline connector down into the next one. The eye
     follows an unbroken line from hero to reservation.
  3. Overlap, not sequence — each section begins revealing while the previous is
     still finishing, so there is never a dead beat between blocks.

  Division of labour with the rest of the app: Rise (IntersectionObserver + CSS)
  owns container-level fades; GSAP owns the children inside those containers and
  everything scroll-linked. They never target the same node, so the two systems
  cannot fight.

  Graceful degradation: no hidden start state is baked into CSS for anything GSAP
  owns — all start states are set at runtime by gsap.from(). If the bundle fails,
  every element sits at its natural, visible position. All motion is inside a
  prefers-reduced-motion: no-preference block; the pin is additionally gated to
  wide viewports, because pinning on a phone trades layout stability for very
  little.
*/

const EASE = 'power3.out';
const EASE_IO = 'power2.inOut';
const STAGGER = 0.08;
const START = 'top 84%';
const once = { toggleActions: 'play none none none' };

export default function ScrollFX() {
  const barRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (s) => gsap.utils.toArray(s);
      const has = (s) => !!document.querySelector(s);

      /* ── 1. page-level progress: the top bar and the left rail move together ── */
      const prog = { start: 0, end: 'max', scrub: 0.3 };
      if (barRef.current) {
        gsap.fromTo(barRef.current, { scaleX: 0 },
          { scaleX: 1, ease: 'none', transformOrigin: 'left center', scrollTrigger: prog });
      }
      if (has('.rail-line-fill')) {
        gsap.fromTo('.rail-line-fill', { scaleY: 0 },
          { scaleY: 1, ease: 'none', transformOrigin: 'top center', scrollTrigger: prog });
      }

      /* ── 2. the connector each `.linked` section draws into the next ──
         A pseudo-element can't be tweened directly, so we animate a custom
         property the ::after consumes. */
      q('.linked').forEach((sec) => {
        gsap.fromTo(sec, { '--link': 0 }, {
          '--link': 1, ease: 'none',
          scrollTrigger: { trigger: sec, start: 'bottom 88%', end: 'bottom 42%', scrub: true },
        });
      });

      /* ── 3. hero hand-off: the glow drifts and the cue retires as you leave ── */
      if (has('.hero')) {
        gsap.fromTo('.hero-copy', { y: 0 }, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (has('.scrollcue')) {
        gsap.to('.scrollcue', {
          opacity: 0, y: 14, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true },
        });
      }

      /* ── 4. every section's eyebrow rule draws itself in ── */
      q('.eyebrow-row .rule-draw').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 58%', scrub: true },
        });
      });

      /* ── 5. headline lines wipe up from their own baseline ── */
      q('.h-lines').forEach((h) => {
        const lines = h.querySelectorAll('.inner');
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 108, duration: 0.9, ease: EASE, stagger: STAGGER,
          scrollTrigger: { trigger: h, start: START, ...once },
        });
      });

      /* ── 6. ESSENTIALS: four cells wipe in on the same beat ── */
      if (has('.ess-grid')) {
        gsap.from('.ess-grid > div', {
          yPercent: 14, opacity: 0, duration: 0.7, ease: EASE, stagger: STAGGER,
          scrollTrigger: { trigger: '.ess-grid', start: START, ...once },
        });
      }

      /* ── 7. COMPOSITION: glyphs land, then the family diagram fills ── */
      const glyphs = q('.why-glyphs .glyph');
      if (glyphs.length) {
        gsap.from(glyphs, {
          yPercent: 46, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.09,
          scrollTrigger: { trigger: '.why-vis', start: START, ...once },
        });
        gsap.fromTo('.why-glyphs', { yPercent: 5 }, {
          yPercent: -5, ease: 'none',
          scrollTrigger: { trigger: '#why', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
      if (has('.fam')) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.fam', start: 'top 82%', ...once },
        });
        tl.from('.fam-row', { opacity: 0, x: -14, duration: 0.5, ease: EASE, stagger: 0.12 })
          // all eight appear as equals…
          .from('.fam-node', { scale: 0.4, opacity: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.045 }, '-=0.2')
          // …then the five that are actually in the bottle assert themselves
          .fromTo('.fam-node.is-in',
            { '--fill': 0 },
            { '--fill': 1, duration: 0.5, ease: EASE_IO, stagger: 0.06 }, '+=0.05');
      }

      /* ── 8. CHAIN: the most literally connected beat on the page — each step
             lands, then the rule draws across into the next step ── */
      if (has('.chain')) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.chain', start: 'top 82%', ...once },
        });
        const steps = q('.chain-step');
        const links = q('.chain-link-fill');
        steps.forEach((s, i) => {
          tl.from(s, { opacity: 0, y: 22, scale: 0.94, duration: 0.5, ease: EASE }, i === 0 ? 0 : '>-0.12');
          if (links[i]) {
            tl.fromTo(links[i], { scaleX: 0 },
              { scaleX: 1, transformOrigin: 'left center', duration: 0.45, ease: 'none' }, '>-0.08');
          }
        });
      }

      /* ── 9. STATUS: chips arrive in reading order ── */
      if (has('.trust-row')) {
        gsap.from('.trust-row li', {
          opacity: 0, y: 18, duration: 0.55, ease: EASE, stagger: STAGGER,
          scrollTrigger: { trigger: '.trust-row', start: START, ...once },
        });
      }

      /* ── 10. RESERVE: the cap number drifts against the scroll ── */
      if (has('.bf-n')) {
        gsap.fromTo('.bf-n', { yPercent: 8 }, {
          yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: '#reserve', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }

      /* ── 11. deep-page pieces (only present on their own routes) ── */
      q('.botmark').forEach((el) => {
        gsap.fromTo(el, { yPercent: -12 }, {
          yPercent: 12, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true,
          },
        });
      });
      q('.trace-step').forEach((el) => {
        gsap.from(el, {
          x: -18, opacity: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', ...once },
        });
      });
      if (has('.proof-strip')) {
        gsap.from('.proof-cell', {
          opacity: 0, y: 16, duration: 0.5, ease: EASE, stagger: 0.06,
          scrollTrigger: { trigger: '.proof-strip', start: START, ...once },
        });
      }
      if (has('.glyph-band')) {
        gsap.from('.glyph-band .glyph', {
          y: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: EASE,
          scrollTrigger: { trigger: '.glyph-band', start: 'top 82%', ...once },
        });
      }
    });

    // flagship pin — desktop only, and only on the composition route
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

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  });

  return <div className="gsx-progress" aria-hidden="true" ref={barRef} />;
}
