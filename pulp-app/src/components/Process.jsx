import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Raw, Rise } from '../lib.jsx';

const IC = {
  harvest: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M32 9c2 3.5 2 6.5 0 9.5"/><path d="M39 12c4-.5 7 2 6.5 6"/><g fill="#C85A28" stroke="none"><circle cx="26" cy="24" r="5.6"/><circle cx="38" cy="24" r="5.6"/><circle cx="20" cy="34" r="5.6"/><circle cx="32" cy="34" r="5.6"/><circle cx="44" cy="34" r="5.6"/><circle cx="26" cy="44" r="5.6"/><circle cx="38" cy="44" r="5.6"/><circle cx="32" cy="52" r="5.6"/></g></svg>`,
  press: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16h36"/><path d="M22 16v6M32 16v6M42 16v6"/><path d="M18 30h28l-6 11H24z" fill="#C85A28" stroke="#6E2F0F"/><path d="M32 45c2.4 3.4 2.4 6.5 0 6.5s-2.4-3.1 0-6.5z" fill="#B4691E" stroke="none"/></svg>`,
  concentrate: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M30 14c8 11 11 17 11 23a11 11 0 0 1-22 0c0-6 3-12 11-23z" fill="#B4691E" stroke="#6E2F0F"/><path d="M25 38a5 6 0 0 0 5 5" stroke="#fff" stroke-linecap="round"/><path d="M48 16l1.4 4 4 1.4-4 1.4L48 27l-1.4-4.2-4-1.4 4-1.4z" fill="#C85A28" stroke="none"/></svg>`,
  encapsulate: `<svg viewBox="0 0 64 64"><rect x="24" y="10" width="16" height="44" rx="8" fill="#C85A28" stroke="#6E2F0F" stroke-width="1.4"/><rect x="28" y="16" width="4" height="20" rx="2" fill="#fff" opacity=".45"/></svg>`,
  bottle: `<svg viewBox="0 0 64 64" fill="none" stroke="#6E2F0F" stroke-width="1.4" stroke-linejoin="round"><rect x="26" y="8" width="12" height="7" rx="2" fill="#2E4A34" stroke="none"/><path d="M24 17h16l2 8q2 5 2 12v13a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V37q0-7 2-12z" fill="#C8722F"/><rect x="24" y="35" width="16" height="15" rx="2" fill="#F7EEDC" stroke="none"/><path d="M28 43h8" stroke="#8D4A1F"/></svg>`,
};

const STEPS = [
  { n: '01 · Harvest', ic: IC.harvest, h: 'Fresh fruit bunches', p: 'Ripe oil-palm fruit, harvested at a Malaysian estate.' },
  { n: '02 · Press', ic: IC.press, h: 'Milled & pressed', p: 'The fruit is milled and pressed for its crude palm oil.' },
  { n: '03 · Concentrate', ic: IC.concentrate, h: 'Tocotrienols concentrated', p: 'The tocotrienol-rich fraction is separated and concentrated.' },
  { n: '04 · Encapsulate', ic: IC.encapsulate, h: 'Sealed in a softgel', p: 'The amber oil is filled into a single daily softgel.' },
  { n: '05 · Bottle', ic: IC.bottle, h: 'PULP No. 001', p: 'Bottled — 60 softgels. Product notification pending.' },
];

export default function Process() {
  const reduce = useReducedMotion();
  const flowRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: flowRef, offset: ['start 0.82', 'end 0.55'] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="chapter" id="process">
      <div className="wrap">
        <div className="eyebrow-row"><span className="fig">Fig. 02 — Process</span><span className="rule-draw" /><span className="lab">Field → Softgel</span></div>
        <h2 className="h-lines" style={{ marginBottom: 10 }}>
          <span className="line"><Rise as="span" className="inner">From fresh fruit bunch</Rise></span>
          <span className="line"><Rise as="span" className="inner" delay={0.05}><em>to a single softgel.</em></Rise></span>
        </h2>
        <Rise as="p" className="lede-2" style={{ marginBottom: 38 }}>Five steps take the ripe palm fruit from a Malaysian estate to the amber oil sealed inside PULP No. 001.</Rise>

        <motion.div className="process" style={reduce ? undefined : { '--draw': draw }}>
          <div className="flow-rail" aria-hidden="true"><span className="rail-fill" /></div>
          <ol className="flow" ref={flowRef}>
            {STEPS.map((s, i) => {
              const inner = (
                <>
                  <span className="n">{s.n}</span>
                  <Raw className="ic" html={s.ic} aria-hidden="true" />
                  <h4>{s.h}</h4>
                  <p>{s.p}</p>
                </>
              );
              return reduce ? (
                <li className="step" key={i}>{inner}</li>
              ) : (
                <motion.li className="step" key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.12 }}>
                  {inner}
                </motion.li>
              );
            })}
          </ol>
          <p className="process-foot">An illustration of the production process · PULP is a food supplement, not a medicine.</p>
        </motion.div>
      </div>
    </section>
  );
}
