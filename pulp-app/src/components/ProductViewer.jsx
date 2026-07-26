import React, { useRef, useState } from 'react';
import { Raw } from '../lib.jsx';

const SOFTGEL_SVG = `
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" aria-label="PULP amber softgel">
  <defs><linearGradient id="vgel" x1="30%" y1="8%" x2="72%" y2="96%">
    <stop offset="0" stop-color="#F4C67E"/><stop offset="40%" stop-color="#C85A28"/><stop offset="100%" stop-color="#6E2F0F"/>
  </linearGradient></defs>
  <ellipse cx="104" cy="276" rx="46" ry="11" fill="#6E2F0F" opacity=".26"/>
  <rect x="64" y="36" width="72" height="228" rx="36" fill="url(#vgel)"/>
  <rect x="64" y="36" width="72" height="228" rx="36" fill="none" stroke="#5F280D" stroke-width="1" opacity=".4"/>
  <path d="M86 66 q-11 68 4 150" stroke="#fff" stroke-width="11" stroke-linecap="round" fill="none" opacity=".32"/>
  <ellipse cx="90" cy="72" rx="7" ry="15" fill="#fff" opacity=".5"/>
</svg>`;

const BOTTLE_SVG = `
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" aria-label="PULP bottle of 60 softgels">
  <defs><linearGradient id="vbottle" x1="20%" y1="0" x2="90%" y2="100%">
    <stop offset="0" stop-color="#C8722F"/><stop offset="55%" stop-color="#9C4A1E"/><stop offset="100%" stop-color="#5F280D"/>
  </linearGradient></defs>
  <ellipse cx="100" cy="288" rx="56" ry="10" fill="#6E2F0F" opacity=".24"/>
  <rect x="74" y="26" width="52" height="26" rx="4" fill="#2E4A34"/>
  <rect x="80" y="50" width="40" height="18" fill="#8D4A1F"/>
  <path d="M70 70 q30 -6 60 0 l5 24 q5 14 5 40 v100 a18 18 0 0 1 -18 18 h-44 a18 18 0 0 1 -18 -18 v-100 q0 -26 5 -40 z" fill="url(#vbottle)"/>
  <rect x="66" y="150" width="68" height="84" rx="3" fill="#F7EEDC" opacity=".96"/>
  <text x="100" y="177" text-anchor="middle" font-family="Caprasimo, serif" font-size="21" fill="#3A4E3A">P<tspan fill="#C85A28">u</tspan>lp</text>
  <text x="100" y="197" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="11" fill="#8D4A1F">Complete</text>
  <line x1="78" y1="207" x2="122" y2="207" stroke="#D9C9A8"/>
  <text x="100" y="223" text-anchor="middle" font-family="DM Mono, monospace" font-size="8" letter-spacing="1" fill="#7A6B58">NO. 001 · 60</text>
  <rect x="74" y="80" width="11" height="150" rx="6" fill="#fff" opacity=".16"/>
</svg>`;

const CUT_SVG = `
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-label="Cross-section of the softgel showing amber tocotrienol oil">
  <defs><radialGradient id="vcut" cx="42%" cy="38%" r="66%">
    <stop offset="0" stop-color="#F0B266"/><stop offset="100%" stop-color="#B4691E"/>
  </radialGradient></defs>
  <circle cx="110" cy="110" r="86" fill="#8D4A1F"/>
  <circle cx="110" cy="110" r="80" fill="url(#vcut)"/>
  <circle cx="110" cy="110" r="80" fill="none" stroke="#6E2F0F" stroke-width="1"/>
  <g font-family="'Inter Tight',sans-serif" font-weight="600" text-anchor="middle">
    <circle cx="86" cy="92" r="17" fill="#3A4E3A"/><text x="86" y="98" font-size="16" fill="#F7EEDC">γ</text>
    <circle cx="133" cy="86" r="15" fill="#C85A28"/><text x="133" y="92" font-size="15" fill="#F7EEDC">α</text>
    <circle cx="141" cy="129" r="13" fill="#B4691E"/><text x="141" y="134" font-size="13" fill="#F7EEDC">α</text>
    <circle cx="95" cy="135" r="11" fill="#7B8554"/><text x="95" y="140" font-size="12" fill="#F7EEDC">δ</text>
    <circle cx="114" cy="112" r="8" fill="#2A1F16"/><text x="114" y="116" font-size="9" fill="#F7EEDC">β</text>
  </g>
  <ellipse cx="80" cy="78" rx="14" ry="9" fill="#fff" opacity=".28"/>
</svg>`;

const VIEWS = [
  { id: 'softgel', label: 'Softgel', svg: SOFTGEL_SVG, cap: 'One softgel — 50 mg full-spectrum tocotrienol, daily. Tap a dot to explore.' },
  { id: 'bottle', label: 'Bottle', svg: BOTTLE_SVG, cap: '60 softgels — about two months. Non-GMO Malaysian palm fruit.' },
  { id: 'cut', label: 'Cross-section', svg: CUT_SVG, cap: 'Inside: amber oil — all four tocotrienols (α β γ δ) plus tocopherol.' },
];

const HOTSPOTS = [
  { top: '24%', label: 'Softgel shell detail', detail: 'Halal softgel shell (notification pending) — one small softgel, once a day.' },
  { top: '50%', label: 'Strength detail', detail: '50 mg full-spectrum tocotrienol — the whole α β γ δ family in a single softgel.' },
  { top: '74%', label: 'Oil source detail', detail: 'Amber tocotrienol oil, pressed from non-GMO Malaysian palm fruit.' },
];

export default function ProductViewer() {
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState(-1);
  const [tip, setTip] = useState({ show: false, text: '', left: 0, top: 0, ax: 0, below: false });
  const stageRef = useRef(null);
  const tipRef = useRef(null);
  const tabRefs = useRef([]);
  const swipe = useRef({ x: 0, y: 0, on: false });

  const select = (i, focus) => { setActive(i); setPressed(-1); setTip((t) => ({ ...t, show: false })); if (focus) tabRefs.current[i]?.focus(); };

  const onTabKey = (e, i) => {
    let n;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % VIEWS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + VIEWS.length) % VIEWS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = VIEWS.length - 1;
    if (n != null) { e.preventDefault(); select(n, true); }
  };

  const showTip = (dotEl, h, idx) => {
    const stage = stageRef.current, tipEl = tipRef.current;
    if (!stage || !tipEl) return;
    // measure with content set
    tipEl.textContent = h.detail;
    const sr = stage.getBoundingClientRect(), dr = dotEl.getBoundingClientRect();
    const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    const dotX = dr.left + dr.width / 2 - sr.left, dotTop = dr.top - sr.top, dotBottom = dr.bottom - sr.top;
    let left = Math.max(8, Math.min(dotX - tw / 2, sr.width - tw - 8));
    let top = dotTop - th - 12, below = false;
    if (top < 8) { top = dotBottom + 12; below = true; }
    setPressed(idx);
    setTip({ show: true, text: h.detail, left, top, ax: dotX - left, below });
  };

  const onHotspot = (e, h, idx) => {
    e.stopPropagation();
    if (pressed === idx) { setPressed(-1); setTip((t) => ({ ...t, show: false })); }
    else showTip(e.currentTarget, h, idx);
  };

  return (
    <div className="viewer">
      <div className="viewer-stage" ref={stageRef}
        onClick={(e) => { if (!e.target.closest('.hotspot')) { setPressed(-1); setTip((t) => ({ ...t, show: false })); } }}
        onTouchStart={(e) => { const t = e.touches[0]; swipe.current = { x: t.clientX, y: t.clientY, on: true }; }}
        onTouchEnd={(e) => {
          const s = swipe.current; if (!s.on) return; s.on = false;
          const t = e.changedTouches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.6) {
            const ni = dx < 0 ? Math.min(active + 1, VIEWS.length - 1) : Math.max(active - 1, 0);
            if (ni !== active) select(ni, false);
          }
        }}>
        <span className="tag">No. 001</span>
        <div className="viewer-panel" key={VIEWS[active].id} id={`vp-${VIEWS[active].id}`} role="tabpanel"
          aria-labelledby={`vt-${VIEWS[active].id}`}>
          <Raw html={VIEWS[active].svg} />
        </div>
        {active === 0 && HOTSPOTS.map((h, i) => (
          <button key={i} className="hotspot" type="button" style={{ left: '50%', top: h.top }}
            aria-pressed={pressed === i} aria-label={h.label}
            onClick={(e) => onHotspot(e, h, i)} />
        ))}
        <div className={'hotspot-tip' + (tip.show ? ' show' : '') + (tip.below ? ' below' : '')} ref={tipRef}
          role="status" aria-live="polite" aria-hidden={!tip.show}
          style={{ left: tip.left + 'px', top: tip.top + 'px', '--ax': tip.ax + 'px' }}>
          {tip.text}
        </div>
      </div>
      <div className="viewer-tabs" role="tablist" aria-label="Product views">
        {VIEWS.map((v, i) => (
          <button key={v.id} ref={(el) => (tabRefs.current[i] = el)} className="viewer-tab" type="button"
            role="tab" id={`vt-${v.id}`} aria-controls={`vp-${v.id}`} aria-selected={active === i}
            tabIndex={active === i ? 0 : -1} onClick={() => select(i, false)} onKeyDown={(e) => onTabKey(e, i)}>
            {v.label}
          </button>
        ))}
      </div>
      <p className="viewer-cap" aria-live="polite">{VIEWS[active].cap}</p>
    </div>
  );
}
