import React, { useCallback, useEffect, useRef, useState } from 'react';

const ROWS = [
  { g: 'γ', t: 'Gamma-tocotrienol', after: '100%', color: 'var(--forest)', val: '32%' },
  { g: 'α', t: 'Alpha-tocotrienol', after: '81%', color: 'var(--pulp)', val: '26%' },
  { g: 'α', t: 'Alpha-tocopherol', after: '75%', color: 'var(--amber)', val: '24%', lone: true, beforeW: '75%' },
  { g: 'δ', t: 'Delta-tocotrienol', after: '25%', color: 'var(--moss)', val: '8%' },
  { g: 'β', t: 'Beta-tocotrienol', after: '9%', color: 'var(--espresso)', val: '3%' },
];

function Bars({ variant }) {
  return (
    <div className="rvset">
      {ROWS.map((r, i) => (
        <div className={'rvrow' + (variant === 'before' && r.lone ? ' lone' : '')} key={i}>
          <span className="g">{r.g}</span>
          <span className="t">{r.t}</span>
          <span className="bar">
            <span className="fill" style={
              variant === 'after'
                ? { width: r.after, background: r.color }
                : { width: r.lone ? r.beforeW : '0', background: 'var(--taupe)' }
            } />
          </span>
          <span className="val">{variant === 'after' ? r.val : (r.lone ? 'only' : '—')}</span>
        </div>
      ))}
    </div>
  );
}

export default function SpectrumReveal() {
  const [p, setP] = useState(50);
  const stageRef = useRef(null);
  const dragging = useRef(false);

  const clamp = (v) => Math.max(0, Math.min(100, v));
  const label = (v) => v >= 94 ? 'Almost entirely ordinary vitamin E'
    : v <= 6 ? 'Almost entirely PULP full spectrum'
    : `${Math.round(v)} percent ordinary vitamin E, ${Math.round(100 - v)} percent PULP full spectrum`;

  const fromX = useCallback((x) => {
    const el = stageRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setP(clamp(((x - r.left) / r.width) * 100));
  }, []);

  useEffect(() => {
    const move = (e) => { if (dragging.current) fromX(e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [fromX]);

  const onKey = (e) => {
    const step = e.shiftKey ? 10 : 2;
    let handled = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setP((v) => clamp(v - step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setP((v) => clamp(v + step));
    else if (e.key === 'Home') setP(0);
    else if (e.key === 'End') setP(100);
    else if (e.key === 'PageDown') setP((v) => clamp(v - 10));
    else if (e.key === 'PageUp') setP((v) => clamp(v + 10));
    else handled = false;
    if (handled) e.preventDefault();
  };

  return (
    <div className="reveal">
      <div className="reveal-stage" ref={stageRef} style={{ '--p': p + '%' }}
        onPointerDown={(e) => { if (e.target.closest('.reveal-handle')) return; dragging.current = true; fromX(e.clientX); }}>
        <span className="reveal-tag reveal-tag--l">Ordinary vitamin E</span>
        <span className="reveal-tag reveal-tag--r">PULP · Full spectrum</span>
        <div className="reveal-lyr reveal-before" aria-hidden="true"><Bars variant="before" /></div>
        <div className="reveal-lyr reveal-after" aria-hidden="true"><Bars variant="after" /></div>
        <div className="reveal-divider" aria-hidden="true" />
        <div className="reveal-handle" role="slider" tabIndex={0}
          aria-label="Compare ordinary vitamin E with PULP full spectrum"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p)} aria-valuetext={label(p)}
          onPointerDown={(e) => { dragging.current = true; try { e.target.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); }}
          onKeyDown={onKey}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 7l-4 5 4 5M15 7l4 5-4 5" /></svg>
        </div>
      </div>
      <p className="reveal-cap">A comparison of ingredient form — not a health claim.</p>
    </div>
  );
}
