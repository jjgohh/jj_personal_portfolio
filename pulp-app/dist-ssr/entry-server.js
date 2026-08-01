import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { renderToString } from "react-dom/server";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
const ROUTES = {
  "/": "Home",
  "/product": "The Specimen",
  "/composition": "Composition",
  "/traceability": "Traceability",
  "/proof": "Proof & Label",
  "/research": "Research",
  "/story": "Our Story",
  "/faq": "FAQ"
};
function read() {
  if (typeof window === "undefined") return "/";
  const raw = (window.location.hash || "").replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  const legacy = {
    "/spectrum": "/composition",
    "/reserve": "/",
    "/top": "/",
    "/founder": "/story",
    "/specimen": "/product"
  };
  const path = raw.startsWith("/") ? raw : "/" + raw;
  const clean = path.split("?")[0].replace(/\/$/, "") || "/";
  return legacy[clean] || (ROUTES[clean] ? clean : "/");
}
function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
function navigate(to) {
  if (window.location.hash.replace(/^#/, "") === to) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  window.location.hash = to;
}
function href(to) {
  return "#" + to;
}
const LEARN = ["/composition", "/traceability", "/proof", "/research", "/story", "/faq"];
function Nav({ route, onReserve, cta }) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const itemsRef = useRef([]);
  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [route]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      var _a, _b;
      if (((_a = popRef.current) == null ? void 0 : _a.contains(e.target)) || ((_b = btnRef.current) == null ? void 0 : _b.contains(e.target))) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  const pendingFocus = useRef(null);
  useEffect(() => {
    if (!open || pendingFocus.current == null) return;
    const i = pendingFocus.current;
    pendingFocus.current = null;
    const raf = requestAnimationFrame(() => focusItem(i));
    return () => cancelAnimationFrame(raf);
  }, [open]);
  const focusItem = (i) => {
    var _a;
    const list = itemsRef.current.filter(Boolean);
    if (!list.length) return;
    const n = (i + list.length) % list.length;
    (_a = list[n]) == null ? void 0 : _a.focus();
  };
  const onBtnKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) focusItem(0);
      else {
        pendingFocus.current = 0;
        setOpen(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) focusItem(-1);
      else {
        pendingFocus.current = -1;
        setOpen(true);
      }
    } else if (e.key === "Escape") setOpen(false);
  };
  const onItemKey = (e, i) => {
    var _a;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      (_a = btnRef.current) == null ? void 0 : _a.focus();
    } else if (e.key === "Tab" && !e.shiftKey && i === LEARN.length - 1) setOpen(false);
  };
  const go = (to) => (e) => {
    e.preventDefault();
    setOpen(false);
    setMobileOpen(false);
    navigate(to);
  };
  const isLearn = LEARN.includes(route);
  return /* @__PURE__ */ jsx("header", { className: "nav", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("a", { className: "brand", href: href("/"), onClick: go("/"), "aria-label": "PULP home", children: [
      /* @__PURE__ */ jsxs("span", { className: "mark", children: [
        "P",
        /* @__PURE__ */ jsx("span", { className: "u", children: "u" }),
        "lp"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "sub", children: "金果 · Est. 2026" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "links" + (mobileOpen ? " open" : ""), "aria-label": "Main", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "navlink" + (route === "/product" ? " is-current" : ""),
          href: href("/product"),
          onClick: go("/product"),
          "aria-current": route === "/product" ? "page" : void 0,
          children: "The Specimen"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "dd", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            ref: btnRef,
            type: "button",
            className: "navlink ddbtn" + (isLearn ? " is-current" : ""),
            "aria-expanded": open,
            "aria-controls": "dd-learn",
            onKeyDown: onBtnKey,
            onClick: () => setOpen((o) => !o),
            children: [
              "Learn",
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "ddcaret",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.8",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "ddpop" + (open ? " open" : ""), id: "dd-learn", ref: popRef, children: /* @__PURE__ */ jsx("ul", { children: LEARN.map((to, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "a",
          {
            ref: (el) => itemsRef.current[i] = el,
            href: href(to),
            onClick: go(to),
            onKeyDown: (e) => onItemKey(e, i),
            tabIndex: open ? 0 : -1,
            "aria-current": route === to ? "page" : void 0,
            className: route === to ? "is-current" : void 0,
            children: [
              /* @__PURE__ */ jsx("span", { className: "ddt", children: ROUTES[to] }),
              /* @__PURE__ */ jsx("span", { className: "ddd", children: DESCR[to] })
            ]
          }
        ) }, to)) }) })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: href("/"),
          className: "nav-cta",
          onClick: (e) => {
            e.preventDefault();
            setMobileOpen(false);
            onReserve();
          },
          children: cta
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "burger",
        "aria-label": mobileOpen ? "Close menu" : "Open menu",
        "aria-expanded": mobileOpen,
        onClick: (e) => {
          e.stopPropagation();
          setMobileOpen((o) => !o);
        },
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": "true", children: mobileOpen ? /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) : /* @__PURE__ */ jsx("path", { d: "M3 6h18M3 12h18M3 18h18" }) })
      }
    )
  ] }) });
}
const DESCR = {
  "/composition": "What is actually in the softgel",
  "/traceability": "Fruit to bottle, named at every step",
  "/proof": "Certifications, pending states, full label",
  "/research": "Published literature on tocotrienols",
  "/story": "Why we built this",
  "/faq": "Questions, answered plainly"
};
const REDUCE_Q = "(prefers-reduced-motion: reduce)";
function prefersReduce() {
  return typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCE_Q).matches : false;
}
if (typeof document !== "undefined" && !prefersReduce()) {
  document.documentElement.classList.add("js-anim");
}
function useReducedMotion() {
  const [reduce, setReduce] = useState(prefersReduce);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REDUCE_Q);
    const on = () => setReduce(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on);
  }, []);
  return reduce;
}
function useInViewOnce(ref, { margin = "0px 0px -12% 0px" } = {}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, margin]);
  return seen;
}
function Raw({ html, as = "span", className, ...rest }) {
  const Tag = as;
  return /* @__PURE__ */ jsx(Tag, { className, dangerouslySetInnerHTML: { __html: html }, ...rest });
}
function Rise({ as: Tag = "div", children, className, y = 26, delay = 0, style, ...rest }) {
  const ref = useRef(null);
  const inView = useInViewOnce(ref);
  return /* @__PURE__ */ jsx(
    Tag,
    {
      ref,
      className,
      "data-rise": "",
      ...inView ? { "data-rise-in": "" } : {},
      style: { "--ry": `${y}px`, "--rd": `${delay}s`, ...style },
      ...rest,
      children
    }
  );
}
function Counter({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInViewOnce(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(to);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf, start;
    const step = (t) => {
      if (start == null) start = t;
      const p = Math.min((t - start) / (duration * 1e3), 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);
  return /* @__PURE__ */ jsx("span", { ref, children: val.toLocaleString() });
}
function useLockBody(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
const BATCH_CAP = 88;
async function submitReservation(email) {
  await new Promise((r) => setTimeout(r, 450));
  return {};
}
function Reserve() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [position, setPosition] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    const email = (inputRef.current.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address, for example you@email.com.");
      setStatus("error");
      inputRef.current.focus();
      return;
    }
    setError("");
    setStatus("busy");
    try {
      const res = await submitReservation(email);
      if (res && typeof res.position === "number") setPosition(res.position);
      setStatus("done");
    } catch (err) {
      setError("We couldn't save your reservation. Please try again.");
      setStatus("error");
    }
  };
  const shareText = encodeURIComponent(
    "PULP — full-spectrum tocotrienol vitamin E, grown, extracted and bottled in Malaysia. The first batch is capped at " + BATCH_CAP + ". https://pulp.my"
  );
  return /* @__PURE__ */ jsx("section", { className: "close reserve", id: "reserve", children: /* @__PURE__ */ jsxs("div", { className: "in", children: [
    /* @__PURE__ */ jsx("div", { className: "kie", children: "Founders' batch · No. 001" }),
    /* @__PURE__ */ jsxs("h2", { children: [
      "Reserve your ",
      /* @__PURE__ */ jsx("em", { children: "bottle." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "batch-facts", children: [
      /* @__PURE__ */ jsxs("div", { className: "bf", children: [
        /* @__PURE__ */ jsx("span", { className: "bf-n", children: BATCH_CAP }),
        /* @__PURE__ */ jsx("span", { className: "bf-k", children: "bottles in the first batch" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "bf-note", children: /* @__PURE__ */ jsxs(Fragment, { children: [
        "The cap is ",
        BATCH_CAP,
        " bottles — a plain fact, not a countdown. We'll publish the remaining count here once reservations are live and the number is real."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("dl", { className: "price-anchor", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "Founders' price" }),
        /* @__PURE__ */ jsx("dd", { children: "[FOUNDERS PRICE]" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "Price after the first batch" }),
        /* @__PURE__ */ jsx("dd", { children: "[RRP]" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "price-note", children: "Two facts, stated plainly. Reserving costs nothing now and commits you to nothing — we cannot sell until our NPRA product notification is complete." }),
    status !== "done" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("form", { className: "rsv-form", onSubmit: submit, noValidate: true, children: [
        /* @__PURE__ */ jsxs("div", { className: "rsv-field", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "rsv-email", children: "Email address" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "rsv-email",
              ref: inputRef,
              type: "email",
              name: "email",
              autoComplete: "email",
              inputMode: "email",
              placeholder: "you@email.com",
              "aria-describedby": "rsv-status",
              "aria-invalid": status === "error",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "rsv-btn", disabled: status === "busy", children: status === "busy" ? "Reserving…" : "Reserve your bottle" })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "rsv-trust", children: [
        /* @__PURE__ */ jsx("li", { children: "Non-GMO Malaysian palm fruit" }),
        /* @__PURE__ */ jsx("li", { children: "50 mg per softgel · 60 per bottle" }),
        /* @__PURE__ */ jsx("li", { children: "NPRA notification pending" }),
        /* @__PURE__ */ jsx("li", { children: "No payment taken" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "rsv-note", id: "rsv-status", role: "status", "aria-live": "polite", children: status === "error" ? /* @__PURE__ */ jsx("span", { className: "rsv-err", children: error }) : "One email. No spam, no newsletter — we write when No. 001 is cleared to ship." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "rsv-done", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsx("span", { className: "rsv-tick", "aria-hidden": "true", children: "✦" }),
      /* @__PURE__ */ jsx("h3", { children: "You're on the list." }),
      position !== null && /* @__PURE__ */ jsxs("p", { className: "rsv-pos", children: [
        "You're number ",
        /* @__PURE__ */ jsx("strong", { children: position }),
        " in the queue."
      ] }),
      /* @__PURE__ */ jsxs("ol", { className: "rsv-next", children: [
        /* @__PURE__ */ jsx("li", { children: "We finish NPRA product notification." }),
        /* @__PURE__ */ jsx("li", { children: "You get one email — before anyone else — when No. 001 can ship." }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Your founders' price is held for the first ",
          BATCH_CAP,
          " bottles."
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "rsv-share",
          href: `https://wa.me/?text=${shareText}`,
          target: "_blank",
          rel: "noopener",
          children: "Share PULP on WhatsApp"
        }
      )
    ] })
  ] }) });
}
const STOPS = [
  { id: "top", n: "01", label: "Specimen" },
  { id: "essentials", n: "02", label: "Essentials" },
  { id: "why", n: "03", label: "Composition" },
  { id: "chain", n: "04", label: "Origin" },
  { id: "status", n: "05", label: "Status" },
  { id: "reserve", n: "06", label: "Reserve" }
];
function ScrollRail() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = STOPS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver((entries) => {
      const mid = window.innerHeight / 2;
      let best = null, bestDist = Infinity;
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best != null) setActive(best);
    }, { threshold: [0, 0.15, 0.4, 0.75, 1] });
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "rail", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("span", { className: "rail-line", children: /* @__PURE__ */ jsx("span", { className: "rail-line-fill" }) }),
    /* @__PURE__ */ jsx("ul", { children: STOPS.map((s, i) => /* @__PURE__ */ jsx("li", { className: i === active ? "is-on" : i < active ? "is-past" : "", children: /* @__PURE__ */ jsxs("button", { type: "button", tabIndex: -1, onClick: () => go(s.id), children: [
      /* @__PURE__ */ jsx("span", { className: "rail-tick" }),
      /* @__PURE__ */ jsx("span", { className: "rail-n", children: s.n }),
      /* @__PURE__ */ jsx("span", { className: "rail-l", children: s.label })
    ] }) }, s.id)) })
  ] });
}
const FAMILY = [
  { g: "α", k: "T3", in: true },
  { g: "β", k: "T3", in: true },
  { g: "γ", k: "T3", in: true },
  { g: "δ", k: "T3", in: true },
  { g: "α", k: "T", in: true },
  { g: "β", k: "T", in: false },
  { g: "γ", k: "T", in: false },
  { g: "δ", k: "T", in: false }
];
function FamilyDiagram() {
  return /* @__PURE__ */ jsxs("figure", { className: "fam", children: [
    /* @__PURE__ */ jsxs("div", { className: "fam-rows", children: [
      /* @__PURE__ */ jsxs("div", { className: "fam-row", children: [
        /* @__PURE__ */ jsx("span", { className: "fam-rk", children: "Tocotrienols" }),
        /* @__PURE__ */ jsx("div", { className: "fam-nodes", children: FAMILY.filter((f) => f.k === "T3").map((f, i) => /* @__PURE__ */ jsx("span", { className: "fam-node" + (f.in ? " is-in" : ""), children: /* @__PURE__ */ jsx("span", { className: "fam-g", children: f.g }) }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "fam-row", children: [
        /* @__PURE__ */ jsx("span", { className: "fam-rk", children: "Tocopherols" }),
        /* @__PURE__ */ jsx("div", { className: "fam-nodes", children: FAMILY.filter((f) => f.k === "T").map((f, i) => /* @__PURE__ */ jsx("span", { className: "fam-node" + (f.in ? " is-in" : ""), children: /* @__PURE__ */ jsx("span", { className: "fam-g", children: f.g }) }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("figcaption", { children: "The eight forms of vitamin E. Filled nodes are in every PULP softgel — all four tocotrienols, plus α-tocopherol." })
  ] });
}
const ICONS = {
  fruit: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M24 9c1.6 2.6 1.6 4.8 0 7"/><path d="M29 11c3-.4 5.2 1.4 4.9 4.4"/>
    <g fill="currentColor" stroke="none"><circle cx="19" cy="20" r="4.1"/><circle cx="28" cy="20" r="4.1"/>
    <circle cx="15" cy="28" r="4.1"/><circle cx="24" cy="28" r="4.1"/><circle cx="33" cy="28" r="4.1"/>
    <circle cx="19" cy="36" r="4.1"/><circle cx="28" cy="36" r="4.1"/></g></svg>`,
  oil: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
    <path d="M24 8c6 8.4 8.4 13 8.4 17.4A8.4 8.4 0 0 1 24 33.8a8.4 8.4 0 0 1-8.4-8.4C15.6 21 18 16.4 24 8z" fill="currentColor" fill-opacity=".18"/>
    <path d="M20 26a4 4.6 0 0 0 4 4" stroke-linecap="round"/></svg>`,
  gel: `<svg viewBox="0 0 48 48" fill="none">
    <rect x="17" y="9" width="14" height="30" rx="7" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.5"/>
    <rect x="20.5" y="13" width="3" height="12" rx="1.5" fill="currentColor" fill-opacity=".5"/></svg>`
};
const STEPS$1 = [
  { ic: ICONS.fruit, n: "01", t: "Malaysian palm fruit" },
  { ic: ICONS.oil, n: "02", t: "Tocotrienol fraction" },
  { ic: ICONS.gel, n: "03", t: "One 50 mg softgel" }
];
function ChainTeaser() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "chain",
      role: "img",
      "aria-label": "Three-step diagram: Malaysian palm fruit, then the tocotrienol fraction extracted from it, then one 50 milligram softgel.",
      children: STEPS$1.map((s, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "chain-step", children: [
          /* @__PURE__ */ jsx("span", { className: "chain-ic", dangerouslySetInnerHTML: { __html: s.ic } }),
          /* @__PURE__ */ jsx("span", { className: "chain-n", children: s.n }),
          /* @__PURE__ */ jsx("span", { className: "chain-t", children: s.t })
        ] }),
        i < STEPS$1.length - 1 && /* @__PURE__ */ jsx("span", { className: "chain-link", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "chain-link-fill" }) })
      ] }, s.n))
    }
  );
}
const ThreeHero = lazy(
  () => import("./assets/ThreeHero-BQVrRteC.js").catch(() => ({ default: () => null }))
);
function useAffords3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const q = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!q.matches) return;
    const start = () => setOk(true);
    const id = "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => "cancelIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id);
  }, []);
  return ok;
}
function Home({ onReserve, cta }) {
  const show3D = useAffords3D();
  const go = (to) => (e) => {
    e.preventDefault();
    navigate(to);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ScrollRail, {}),
    /* @__PURE__ */ jsxs("section", { className: "hero", id: "top", children: [
      show3D && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(ThreeHero, {}) }),
      /* @__PURE__ */ jsx("div", { className: "hero-inner", children: /* @__PURE__ */ jsx("div", { className: "wrap", children: /* @__PURE__ */ jsxs("div", { className: "hero-copy", children: [
        /* @__PURE__ */ jsxs("span", { className: "eyebrow mono", "data-hero": "", style: { "--hd": ".10s" }, children: [
          /* @__PURE__ */ jsx("span", { className: "sq" }),
          "Specimen No. 001 · Full-Spectrum Vitamin E"
        ] }),
        /* @__PURE__ */ jsxs("h1", { "data-hero": "", style: { "--hd": ".20s" }, children: [
          "The vitamin E most",
          /* @__PURE__ */ jsx("br", {}),
          "supplements skip.",
          /* @__PURE__ */ jsx("span", { className: "ital", children: "Grown, extracted and bottled in Malaysia." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "lede", "data-hero": "", style: { "--hd": ".32s" }, children: "Four tocotrienols plus α-tocopherol — 50 mg of full-spectrum vitamin E in one daily softgel." }),
        /* @__PURE__ */ jsxs("div", { className: "cta-row", "data-hero": "", style: { "--hd": ".44s" }, children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: href("/"),
              className: "btn btn-primary",
              onClick: (e) => {
                e.preventDefault();
                onReserve();
              },
              children: cta
            }
          ),
          /* @__PURE__ */ jsx("a", { href: href("/product"), className: "btn btn-ghost", onClick: go("/product"), children: "See the specimen →" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cred", "data-hero": "", style: { "--hd": ".56s" }, children: "Non-GMO Malaysian palm fruit · DavosLife E3 by KLK OLEO · NPRA notification pending" })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "scrollcue", children: [
        /* @__PURE__ */ jsx("span", { className: "mono", children: "SCROLL" }),
        /* @__PURE__ */ jsx("span", { className: "ln" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "chapter essentials linked", id: "essentials", "aria-labelledby": "ess-h", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsx("h2", { id: "ess-h", className: "sr-only", children: "The essentials" }),
      /* @__PURE__ */ jsxs(Rise, { as: "div", className: "ess-panel", children: [
        /* @__PURE__ */ jsxs("dl", { className: "ess-grid", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Per softgel" }),
            /* @__PURE__ */ jsxs("dd", { children: [
              /* @__PURE__ */ jsx(Counter, { to: 50 }),
              " mg"
            ] }),
            /* @__PURE__ */ jsx("dd", { className: "ess-sub", children: "tocotrienol complex" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "In the bottle" }),
            /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(Counter, { to: 60 }) }),
            /* @__PURE__ */ jsx("dd", { className: "ess-sub", children: "softgels · ~2 months" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "How to take it" }),
            /* @__PURE__ */ jsx("dd", { children: "One daily" }),
            /* @__PURE__ */ jsx("dd", { className: "ess-sub", children: "with any meal" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Made in" }),
            /* @__PURE__ */ jsx("dd", { children: "Malaysia" }),
            /* @__PURE__ */ jsx("dd", { className: "ess-sub", children: "grown, extracted, bottled" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ess-notes", children: [
          /* @__PURE__ */ jsxs("div", { className: "ess-note", children: [
            /* @__PURE__ */ jsx("span", { className: "ess-note-k", children: "The routine" }),
            /* @__PURE__ */ jsx("p", { children: "One softgel with breakfast. Sixty in a bottle, so about two months per bottle. That is the whole thing — no loading phase, nothing to measure." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ess-note ess-note--care", children: [
            /* @__PURE__ */ jsx("span", { className: "ess-note-k", children: "Before you reserve" }),
            /* @__PURE__ */ jsx("p", { children: "PULP is a food supplement, not a medicine, and is not intended to replace medicine. Keep out of reach of children. Not suitable for anyone with a known sensitivity to any listed ingredient. If you are pregnant, nursing or taking medication, speak to your doctor or pharmacist before use." }),
            /* @__PURE__ */ jsx("a", { href: href("/proof"), onClick: go("/proof"), children: "Read the full label and warnings →" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "chapter amb linked", id: "why", "aria-labelledby": "why-h", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
        /* @__PURE__ */ jsx("span", { className: "fig", children: "Why this form" }),
        /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
        /* @__PURE__ */ jsx("span", { className: "lab", children: "α β γ δ" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "why", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { id: "why-h", className: "h-lines", style: { marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: "Most vitamin E is" }) }),
            /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: /* @__PURE__ */ jsx("em", { children: "one molecule." }) }) })
          ] }),
          /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", children: "Vitamin E is a family of eight. Most supplements contain one of them — α-tocopherol. PULP contains the four tocotrienols, plus α-tocopherol." }),
          /* @__PURE__ */ jsx(Rise, { as: "p", className: "why-more", children: /* @__PURE__ */ jsx("a", { href: href("/composition"), onClick: go("/composition"), children: "See exactly what's inside →" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "why-vis", children: [
          /* @__PURE__ */ jsxs("div", { className: "why-glyphs", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("span", { className: "glyph", children: "α" }),
            /* @__PURE__ */ jsx("span", { className: "glyph", children: "β" }),
            /* @__PURE__ */ jsx("span", { className: "glyph", children: "γ" }),
            /* @__PURE__ */ jsx("span", { className: "glyph", children: "δ" })
          ] }),
          /* @__PURE__ */ jsx(FamilyDiagram, {})
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "chapter chainsec linked", id: "chain", "aria-labelledby": "chain-h", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
        /* @__PURE__ */ jsx("span", { className: "fig", children: "Fruit to softgel" }),
        /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
        /* @__PURE__ */ jsx("span", { className: "lab", children: "One country" })
      ] }),
      /* @__PURE__ */ jsx("h2", { id: "chain-h", className: "h-lines", style: { marginBottom: "clamp(22px,3.2vw,34px)" }, children: /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsxs("span", { className: "inner", children: [
        "Three steps, ",
        /* @__PURE__ */ jsx("em", { children: "all Malaysian." })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChainTeaser, {}),
      /* @__PURE__ */ jsx(Rise, { as: "p", className: "why-more", children: /* @__PURE__ */ jsx("a", { href: href("/traceability"), onClick: go("/traceability"), children: "See every step, and who does it →" }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "chapter alt linked", id: "status", "aria-labelledby": "trust-h", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
        /* @__PURE__ */ jsx("span", { className: "fig", children: "Where we stand" }),
        /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
        /* @__PURE__ */ jsx("span", { className: "lab", children: "Status" })
      ] }),
      /* @__PURE__ */ jsx("h2", { id: "trust-h", className: "h-lines", style: { marginBottom: 18 }, children: /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsxs("span", { className: "inner", children: [
        "Nothing ticked before it's ",
        /* @__PURE__ */ jsx("em", { children: "true." })
      ] }) }) }),
      /* @__PURE__ */ jsxs(Rise, { as: "ul", className: "trust-row", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "tb tb--ok", children: "CONFIRMED" }),
          /* @__PURE__ */ jsx("span", { className: "tk", children: "Made in Malaysia" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "tb tb--ok", children: "CONFIRMED" }),
          /* @__PURE__ */ jsx("span", { className: "tk", children: "Non-GMO palm fruit" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "tb", children: "PENDING" }),
          /* @__PURE__ */ jsx("span", { className: "tk", children: "NPRA notification" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "tb", children: "PENDING" }),
          /* @__PURE__ */ jsx("span", { className: "tk", children: "JAKIM halal" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Rise, { as: "p", className: "why-more", children: /* @__PURE__ */ jsx("a", { href: href("/proof"), onClick: go("/proof"), children: "See all six checks and the full label →" }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "chapter fnote linked", id: "fnote", "aria-labelledby": "fnote-h", children: /* @__PURE__ */ jsx("div", { className: "wrap", children: /* @__PURE__ */ jsxs(Rise, { as: "blockquote", className: "fnote-q", children: [
      /* @__PURE__ */ jsx("h2", { id: "fnote-h", className: "sr-only", children: "A note from the founder" }),
      /* @__PURE__ */ jsx("p", { children: "“We ship this fruit out of Malaysia and buy it back on a foreign label. PULP is my attempt at the other order of things.”" }),
      /* @__PURE__ */ jsxs("footer", { children: [
        /* @__PURE__ */ jsx("span", { className: "fnote-nm", children: "— [FOUNDER NAME]" }),
        /* @__PURE__ */ jsx("span", { className: "fnote-role", children: "Founder · Golden Pulp Sdn Bhd" }),
        /* @__PURE__ */ jsx("a", { href: href("/story"), onClick: go("/story"), children: "Read the full note →" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Reserve, {})
  ] });
}
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
  { id: "softgel", label: "Softgel", svg: SOFTGEL_SVG, cap: "One softgel — 50 mg full-spectrum tocotrienol, daily. Tap a dot to explore." },
  { id: "bottle", label: "Bottle", svg: BOTTLE_SVG, cap: "60 softgels — about two months. Non-GMO Malaysian palm fruit." },
  { id: "cut", label: "Cross-section", svg: CUT_SVG, cap: "Inside: amber oil — all four tocotrienols (α β γ δ) plus tocopherol." }
];
const HOTSPOTS = [
  { top: "24%", label: "Softgel shell detail", detail: "Halal softgel shell (notification pending) — one small softgel, once a day." },
  { top: "50%", label: "Strength detail", detail: "50 mg full-spectrum tocotrienol — the whole α β γ δ family in a single softgel." },
  { top: "74%", label: "Oil source detail", detail: "Amber tocotrienol oil, pressed from non-GMO Malaysian palm fruit." }
];
function ProductViewer() {
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState(-1);
  const [tip, setTip] = useState({ show: false, text: "", left: 0, top: 0, ax: 0, below: false });
  const stageRef = useRef(null);
  const tipRef = useRef(null);
  const tabRefs = useRef([]);
  const swipe = useRef({ x: 0, y: 0, on: false });
  const select = (i, focus) => {
    var _a;
    setActive(i);
    setPressed(-1);
    setTip((t) => ({ ...t, show: false }));
    if (focus) (_a = tabRefs.current[i]) == null ? void 0 : _a.focus();
  };
  const onTabKey = (e, i) => {
    let n;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % VIEWS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + VIEWS.length) % VIEWS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = VIEWS.length - 1;
    if (n != null) {
      e.preventDefault();
      select(n, true);
    }
  };
  const showTip = (dotEl, h, idx) => {
    const stage = stageRef.current, tipEl = tipRef.current;
    if (!stage || !tipEl) return;
    tipEl.textContent = h.detail;
    const sr = stage.getBoundingClientRect(), dr = dotEl.getBoundingClientRect();
    const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    const dotX = dr.left + dr.width / 2 - sr.left, dotTop = dr.top - sr.top, dotBottom = dr.bottom - sr.top;
    let left = Math.max(8, Math.min(dotX - tw / 2, sr.width - tw - 8));
    let top = dotTop - th - 12, below = false;
    if (top < 8) {
      top = dotBottom + 12;
      below = true;
    }
    setPressed(idx);
    setTip({ show: true, text: h.detail, left, top, ax: dotX - left, below });
  };
  const onHotspot = (e, h, idx) => {
    e.stopPropagation();
    if (pressed === idx) {
      setPressed(-1);
      setTip((t) => ({ ...t, show: false }));
    } else showTip(e.currentTarget, h, idx);
  };
  return /* @__PURE__ */ jsxs("div", { className: "viewer", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "viewer-stage",
        ref: stageRef,
        onClick: (e) => {
          if (!e.target.closest(".hotspot")) {
            setPressed(-1);
            setTip((t) => ({ ...t, show: false }));
          }
        },
        onTouchStart: (e) => {
          const t = e.touches[0];
          swipe.current = { x: t.clientX, y: t.clientY, on: true };
        },
        onTouchEnd: (e) => {
          const s = swipe.current;
          if (!s.on) return;
          s.on = false;
          const t = e.changedTouches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.6) {
            const ni = dx < 0 ? Math.min(active + 1, VIEWS.length - 1) : Math.max(active - 1, 0);
            if (ni !== active) select(ni, false);
          }
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "tag", children: "No. 001" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "viewer-panel",
              id: `vp-${VIEWS[active].id}`,
              role: "tabpanel",
              "aria-labelledby": `vt-${VIEWS[active].id}`,
              children: /* @__PURE__ */ jsx(Raw, { html: VIEWS[active].svg })
            },
            VIEWS[active].id
          ),
          active === 0 && HOTSPOTS.map((h, i) => /* @__PURE__ */ jsx(
            "button",
            {
              className: "hotspot",
              type: "button",
              style: { left: "50%", top: h.top },
              "aria-pressed": pressed === i,
              "aria-label": h.label,
              onClick: (e) => onHotspot(e, h, i)
            },
            i
          )),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "hotspot-tip" + (tip.show ? " show" : "") + (tip.below ? " below" : ""),
              ref: tipRef,
              role: "status",
              "aria-live": "polite",
              "aria-hidden": !tip.show,
              style: { left: tip.left + "px", top: tip.top + "px", "--ax": tip.ax + "px" },
              children: tip.text
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "viewer-tabs", role: "tablist", "aria-label": "Product views", children: VIEWS.map((v, i) => /* @__PURE__ */ jsx(
      "button",
      {
        ref: (el) => tabRefs.current[i] = el,
        className: "viewer-tab",
        type: "button",
        role: "tab",
        id: `vt-${v.id}`,
        "aria-controls": `vp-${v.id}`,
        "aria-selected": active === i,
        tabIndex: active === i ? 0 : -1,
        onClick: () => select(i, false),
        onKeyDown: (e) => onTabKey(e, i),
        children: v.label
      },
      v.id
    )) }),
    /* @__PURE__ */ jsx("p", { className: "viewer-cap", "aria-live": "polite", children: VIEWS[active].cap })
  ] });
}
function Product({ onReserve, cta }) {
  const go = (to) => (e) => {
    e.preventDefault();
    navigate(to);
  };
  return /* @__PURE__ */ jsx("section", { className: "chapter pdp-wrap", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "No. 001 — The Specimen" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "PULP Complete" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdp", children: [
      /* @__PURE__ */ jsx(Rise, { as: "div", className: "pdp-gallery", children: /* @__PURE__ */ jsx(ProductViewer, {}) }),
      /* @__PURE__ */ jsxs(Rise, { as: "div", className: "pdp-box", children: [
        /* @__PURE__ */ jsxs("h1", { className: "pdp-title", children: [
          "P",
          /* @__PURE__ */ jsx("span", { className: "u", children: "u" }),
          "lp ",
          /* @__PURE__ */ jsx("em", { children: "Complete" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "pdp-sub", children: "Full-spectrum tocotrienol vitamin E · 50 mg · 60 softgels" }),
        /* @__PURE__ */ jsxs("dl", { className: "pdp-price", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Founders' price" }),
            /* @__PURE__ */ jsx("dd", { className: "pdp-price-main", children: "[FOUNDERS PRICE]" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Price after the first batch" }),
            /* @__PURE__ */ jsx("dd", { children: "[RRP]" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdp-actions", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-primary pdp-cta", onClick: onReserve, children: cta }),
          /* @__PURE__ */ jsx("p", { className: "pdp-cta-note", children: "Reserving costs nothing and commits you to nothing. We cannot sell until our NPRA product notification is complete." })
        ] }),
        /* @__PURE__ */ jsxs("dl", { className: "pdp-facts", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Active" }),
            /* @__PURE__ */ jsx("dd", { children: "Tocotrienol complex from Malaysian palm fruit" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Isomers" }),
            /* @__PURE__ */ jsx("dd", { children: "α-, β-, γ-, δ-tocotrienol + α-tocopherol" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Ingredient" }),
            /* @__PURE__ */ jsx("dd", { children: "DavosLife E3 · KLK OLEO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Softgel shell" }),
            /* @__PURE__ */ jsx("dd", { children: "Gelatin (halal bovine), glycerol, purified water" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Directions" }),
            /* @__PURE__ */ jsx("dd", { children: "One softgel daily, with food" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Origin" }),
            /* @__PURE__ */ jsx("dd", { children: "Grown, extracted, formulated and bottled in Malaysia" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Status" }),
            /* @__PURE__ */ jsx("dd", { children: "MAL[NUMBER] — NPRA notification pending" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "pdp-links", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: href("/proof"), onClick: go("/proof"), children: "Full Supplement Facts label →" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: href("/composition"), onClick: go("/composition"), children: 'What "full spectrum" means →' }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: href("/traceability"), onClick: go("/traceability"), children: "Where it comes from →" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "pdp-disc", children: "This product is not a medicine and is not intended to replace medicine. If symptoms persist, consult your doctor or pharmacist." })
      ] })
    ] })
  ] }) });
}
const QA = [
  {
    q: "What is tocotrienol vitamin E?",
    a: /* @__PURE__ */ jsx(Fragment, { children: 'Vitamin E is not one molecule but a family of eight: four tocopherols and four tocotrienols. Most supplements labelled "vitamin E" contain a single one, α-tocopherol. PULP contains the four tocotrienols (α, β, γ, δ) together with α-tocopherol — 50 mg of the complex per softgel.' })
  },
  {
    q: "How is this different from the vitamin E already on the shelf?",
    a: /* @__PURE__ */ jsxs(Fragment, { children: [
      "It is a difference of composition, not of dose. A typical vitamin E capsule is one isomer; PULP is the full tocotrienol spectrum plus α-tocopherol. We describe what is in the bottle and let you compare labels — see",
      " ",
      /* @__PURE__ */ jsx("a", { href: href("/composition"), onClick: (e) => {
        e.preventDefault();
        navigate("/composition");
      }, children: "Composition" }),
      "."
    ] })
  },
  {
    q: "When can I actually buy it?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "Not yet. PULP is going through product notification with Malaysia's National Pharmaceutical Regulatory Agency (NPRA), and we will not sell before that is complete. Reserving now puts you first in line and costs nothing." })
  },
  {
    q: "Does reserving cost anything, or commit me to anything?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "No. No payment is taken and no card details are collected. A reservation is an email address on a list, and you can leave it at any time. Nothing is charged unless and until you choose to order after launch." })
  },
  {
    q: "Is PULP halal certified?",
    a: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Not yet — and we will not display a JAKIM mark before it is issued. What we can state as an ingredient fact today: the softgel shell uses gelatin (halal bovine). Certification status is listed honestly alongside our other checks on",
      " ",
      /* @__PURE__ */ jsx("a", { href: href("/proof"), onClick: (e) => {
        e.preventDefault();
        navigate("/proof");
      }, children: "Proof & Label" }),
      "."
    ] })
  },
  {
    q: "Where is it made?",
    a: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Entirely in Malaysia. The fruit is Malaysian non-GMO oil palm; the tocotrienol fraction is extracted by KLK OLEO as the branded ingredient DavosLife E3; formulation and bottling are Malaysian too. Each step is named on",
      " ",
      /* @__PURE__ */ jsx("a", { href: href("/traceability"), onClick: (e) => {
        e.preventDefault();
        navigate("/traceability");
      }, children: "Traceability" }),
      "."
    ] })
  },
  {
    q: "How do I take it?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "One softgel daily, with food. Store below 30 °C, away from direct sunlight." })
  },
  {
    q: "Who should not take it?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "Keep out of reach of children. It is not suitable for anyone with a known sensitivity to any listed ingredient. If you are pregnant, nursing, or taking medication, speak to your doctor or pharmacist before use. PULP is a food supplement, not a medicine, and is not intended to replace medicine." })
  },
  {
    q: "What will you publish for each batch?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "The batch number, the measured isomer split for that batch, a downloadable certificate of analysis matched to it, and the manufacture date. That is a forward commitment — no batch has been produced yet." })
  },
  {
    q: "How will I be able to pay, and where do you ship?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "At launch we intend to accept FPX, DuitNow QR, Touch 'n Go eWallet, GrabPay, Visa and Mastercard. Shipping details, rates and coverage will be confirmed before the first batch ships: [SHIPPING POLICY]." })
  },
  {
    q: "What is your returns policy?",
    a: /* @__PURE__ */ jsx(Fragment, { children: "To be published before the first order is taken: [RETURNS POLICY]. Since nothing can be purchased yet, no order is currently subject to it." })
  }
];
function Faq() {
  return /* @__PURE__ */ jsx("section", { className: "chapter", id: "faq", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "FAQ" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "Answered plainly" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "h-lines", style: { marginBottom: 14 }, children: /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsxs("span", { className: "inner", children: [
      "Questions, ",
      /* @__PURE__ */ jsx("em", { children: "answered." })
    ] }) }) }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", style: { marginBottom: "clamp(24px,3.6vw,38px)" }, children: "If something here is unclear, ask us directly — the contact details in the footer are real people." }),
    /* @__PURE__ */ jsx(Rise, { as: "div", className: "faq", children: QA.map(({ q, a }, i) => /* @__PURE__ */ jsxs("details", { className: "faq-item", children: [
      /* @__PURE__ */ jsxs("summary", { children: [
        /* @__PURE__ */ jsx("span", { className: "faq-q", children: q }),
        /* @__PURE__ */ jsx("span", { className: "faq-i", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "faq-a", children: /* @__PURE__ */ jsx("p", { children: a }) })
    ] }, i)) })
  ] }) });
}
const ISOMERS = [
  { g: "α", name: "Alpha-tocotrienol", toc: false },
  { g: "β", name: "Beta-tocotrienol", toc: false },
  { g: "γ", name: "Gamma-tocotrienol", toc: false },
  { g: "δ", name: "Delta-tocotrienol", toc: false },
  { g: "α", name: "Alpha-tocopherol", toc: true, sub: "tocopherol" }
];
function Spectrum() {
  return /* @__PURE__ */ jsx("section", { className: "chapter", id: "spectrum", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "Fig. 01 — Composition" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "α β γ δ + toc" })
    ] }),
    /* @__PURE__ */ jsxs("h1", { className: "h-lines", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: "Most vitamin E is" }) }),
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: /* @__PURE__ */ jsx("em", { children: "one molecule." }) }) })
    ] }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", style: { marginBottom: "clamp(26px,4vw,40px)" }, children: "Vitamin E is a family of eight related molecules — four tocopherols and four tocotrienols. Most supplements contain one of them. PULP contains the four tocotrienols, plus α-tocopherol." }),
    /* @__PURE__ */ jsxs(Rise, { as: "div", className: "glyph-band", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("span", { className: "glyph", children: "α" }),
      /* @__PURE__ */ jsx("span", { className: "glyph", children: "β" }),
      /* @__PURE__ */ jsx("span", { className: "glyph", children: "γ" }),
      /* @__PURE__ */ jsx("span", { className: "glyph", children: "δ" })
    ] }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "glyph-cap", children: "The four tocotrienol isomers. Set in Inter Tight — the brand's body face, and the one carrying the Greek glyphs." }),
    /* @__PURE__ */ jsx(Rise, { as: "div", className: "cmpx", children: /* @__PURE__ */ jsxs("fieldset", { className: "cmpx-switch", children: [
      /* @__PURE__ */ jsx("legend", { className: "cmpx-legend", children: "Composition comparison — which forms of vitamin E are present" }),
      /* @__PURE__ */ jsxs("div", { className: "cmpx-opts", children: [
        /* @__PURE__ */ jsx("input", { type: "radio", name: "cmpx", id: "cmpx-toc", className: "cmpx-radio", defaultChecked: true }),
        /* @__PURE__ */ jsx("label", { htmlFor: "cmpx-toc", className: "cmpx-label", children: "Tocopherol only" }),
        /* @__PURE__ */ jsx("input", { type: "radio", name: "cmpx", id: "cmpx-full", className: "cmpx-radio" }),
        /* @__PURE__ */ jsx("label", { htmlFor: "cmpx-full", className: "cmpx-label", children: "Full spectrum" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "cmpx-panels", children: [
        /* @__PURE__ */ jsx("div", { className: "cmpx-grid", children: ISOMERS.map((iso, i) => /* @__PURE__ */ jsxs("div", { className: "iso" + (iso.toc ? " iso--toc" : ""), children: [
          /* @__PURE__ */ jsx("span", { className: "iso-g", children: iso.g }),
          /* @__PURE__ */ jsx("span", { className: "iso-n", children: iso.name }),
          /* @__PURE__ */ jsx("span", { className: "iso-state" })
        ] }, i)) }),
        /* @__PURE__ */ jsx("p", { className: "cmpx-foot", children: "A comparison of ingredient composition only. Not a comparison of effect." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Rise, { as: "dl", className: "dose-row", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "Per softgel" }),
        /* @__PURE__ */ jsx("dd", { children: "50 mg tocotrienol complex" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "Count" }),
        /* @__PURE__ */ jsx("dd", { children: "60 softgels" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: "Directions" }),
        /* @__PURE__ */ jsx("dd", { children: "One daily, with food" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "spectrum-more", children: /* @__PURE__ */ jsx("a", { href: "#research", children: "Read the published research on tocotrienols →" }) })
  ] }) });
}
const MALAYSIA = `<svg viewBox="0 0 420 190" fill="none" role="img"
  aria-label="Schematic outline map of Malaysia. A marker on the west coast of Peninsular Malaysia indicates the sourcing and extraction region.">
  <g stroke="var(--forest)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <!-- Peninsular Malaysia -->
    <path d="M96 26 C112 30 120 42 118 56 C116 70 122 78 120 92 C118 108 108 120 100 134
             C94 146 88 152 82 150 C76 148 74 138 76 126 C78 112 74 104 76 90
             C78 74 82 62 84 48 C86 34 88 24 96 26 Z" fill="var(--cream-2)"/>
    <!-- Sarawak -->
    <path d="M212 108 C230 96 252 92 274 90 C292 88 306 84 320 78 C332 73 340 78 336 88
             C332 100 320 110 306 118 C288 128 268 136 248 140 C232 143 218 140 210 132
             C204 126 204 114 212 108 Z" fill="var(--cream-2)"/>
    <!-- Sabah -->
    <path d="M322 74 C334 62 342 48 352 40 C362 32 372 34 374 44 C376 56 370 68 362 78
             C354 88 344 94 334 92 C324 90 316 82 322 74 Z" fill="var(--cream-2)"/>
  </g>
  <!-- sourcing + extraction marker: west-coast Peninsular Malaysia -->
  <g>
    <circle cx="86" cy="88" r="13" fill="var(--pulp)" opacity=".16"/>
    <circle cx="86" cy="88" r="5" fill="var(--pulp)"/>
  </g>
  <g font-family="var(--mono)" font-size="8" letter-spacing="1.6" fill="var(--taupe)">
    <text x="108" y="92">SOURCE + EXTRACTION</text>
    <text x="228" y="162">BORNEO</text>
  </g>
</svg>`;
const STEPS = [
  {
    code: "STEP 01",
    name: "Fruit",
    what: "Non-GMO oil palm fruit (Elaeis guineensis) is harvested and pressed for crude palm oil.",
    where: "Malaysia",
    who: "Malaysian oil palm estates",
    link: null
  },
  {
    code: "STEP 02",
    name: "Extraction",
    what: "The tocotrienol-rich fraction is separated from the crude palm oil and concentrated into the branded ingredient DavosLife E3.",
    where: "Malaysia",
    who: "KLK OLEO — DavosLife E3",
    link: { href: "https://www.davoslife.com/", label: "davoslife.com" }
  },
  {
    code: "STEP 03",
    name: "Formulation",
    what: "The ingredient is blended and encapsulated into softgels at 50 mg tocotrienol complex per softgel.",
    where: "Malaysia",
    who: "[CO-PACKER NAME]",
    link: null
  },
  {
    code: "STEP 04",
    name: "Bottle",
    what: "Sixty softgels are bottled, sealed and batch-coded, then held pending NPRA product notification.",
    where: "Malaysia",
    who: "[CO-PACKER NAME]",
    link: null
  }
];
const BATCH = [
  ["Batch number", "Printed on every bottle and published here."],
  ["Isomer profile", "The measured α-, β-, γ-, δ-tocotrienol and α-tocopherol split for that batch."],
  ["Certificate of analysis", "Downloadable, matched to the batch number."],
  ["Manufacture date", "Date of encapsulation and date of bottling."]
];
function Traceability() {
  return /* @__PURE__ */ jsx("section", { className: "chapter amb", id: "traceability", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "Fig. 02 — Traceability" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "Fruit → Bottle" })
    ] }),
    /* @__PURE__ */ jsxs("h1", { className: "h-lines", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: "Grown, extracted and" }) }),
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: /* @__PURE__ */ jsx("em", { children: "bottled in Malaysia." }) }) })
    ] }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", style: { marginBottom: "clamp(28px,4.4vw,46px)" }, children: "Four steps, one country. Every step names who does it." }),
    /* @__PURE__ */ jsxs("div", { className: "trace-grid", children: [
      /* @__PURE__ */ jsx("ol", { className: "trace-chain", children: STEPS.map((s, i) => /* @__PURE__ */ jsxs(Rise, { as: "li", className: "trace-step", delay: i * 0.07, children: [
        /* @__PURE__ */ jsxs("div", { className: "trace-head", children: [
          /* @__PURE__ */ jsx("span", { className: "trace-code", children: s.code }),
          /* @__PURE__ */ jsx("h2", { className: "trace-name", children: s.name })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "trace-what", children: s.what }),
        /* @__PURE__ */ jsxs("dl", { className: "trace-meta", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Where" }),
            /* @__PURE__ */ jsx("dd", { children: s.where })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Who" }),
            /* @__PURE__ */ jsxs("dd", { children: [
              s.who,
              s.link && /* @__PURE__ */ jsxs(Fragment, { children: [
                " · ",
                /* @__PURE__ */ jsx("a", { href: s.link.href, target: "_blank", rel: "noopener", children: s.link.label })
              ] })
            ] })
          ] })
        ] })
      ] }, s.code)) }),
      /* @__PURE__ */ jsxs(Rise, { as: "figure", className: "trace-map", children: [
        /* @__PURE__ */ jsx(Raw, { as: "div", className: "trace-map-art", html: MALAYSIA }),
        /* @__PURE__ */ jsx("figcaption", { children: "Schematic illustration — not a survey map. Sourcing and extraction both sit in Peninsular Malaysia; formulation and bottling are Malaysian too." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Rise, { as: "div", className: "batch-commit", children: [
      /* @__PURE__ */ jsxs("div", { className: "batch-commit-head", children: [
        /* @__PURE__ */ jsx("span", { className: "kie", children: "What we will publish for every batch" }),
        /* @__PURE__ */ jsx("p", { className: "batch-commit-note", children: "A forward commitment. No batch has been produced yet — nothing below is a certification we currently hold." })
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "batch-list", children: BATCH.map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "batch-row", children: [
        /* @__PURE__ */ jsx("dt", { children: k }),
        /* @__PURE__ */ jsx("dd", { children: v })
      ] }, k)) })
    ] })
  ] }) });
}
const PROOF = [
  {
    k: "NPRA notification",
    v: "MAL[NUMBER]",
    state: "pending",
    note: "Product notification in progress. Not for sale until complete."
  },
  {
    k: "JAKIM halal",
    v: "[JAKIM MARK]",
    state: "pending",
    note: "Not yet certified. Softgel shell uses halal bovine gelatin as an ingredient fact."
  },
  {
    k: "GMP manufacture",
    v: "[CO-PACKER NAME]",
    state: "pending",
    note: "Co-packer to be named on appointment."
  },
  {
    k: "Non-GMO",
    v: "Confirmed",
    state: "ok",
    note: "Non-GMO Malaysian oil palm fruit."
  },
  {
    k: "Certificate of analysis",
    v: "Per batch",
    state: "pending",
    note: "Published against the batch number once the first batch is produced."
  },
  {
    k: "Made in Malaysia",
    v: "Confirmed",
    state: "ok",
    note: "Grown, extracted, formulated and bottled in Malaysia."
  }
];
function Proof() {
  return /* @__PURE__ */ jsx("section", { className: "chapter alt", id: "proof", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "Fig. 03 — Proof" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "Status & label" })
    ] }),
    /* @__PURE__ */ jsxs("h1", { className: "h-lines", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: "What we can show you," }) }),
      /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsx("span", { className: "inner", children: /* @__PURE__ */ jsx("em", { children: "and what we can't yet." }) }) })
    ] }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", style: { marginBottom: "clamp(26px,4vw,42px)" }, children: "Six checks. Two confirmed, four pending. Nothing is ticked before it is true." }),
    /* @__PURE__ */ jsx(Rise, { as: "ul", className: "proof-strip", children: PROOF.map((p) => /* @__PURE__ */ jsxs("li", { className: "proof-cell proof-cell--" + p.state, children: [
      /* @__PURE__ */ jsx("span", { className: "proof-k", children: p.k }),
      /* @__PURE__ */ jsx("span", { className: "proof-v", children: p.v }),
      /* @__PURE__ */ jsx("span", { className: "proof-badge", children: p.state === "ok" ? "CONFIRMED" : "PENDING" }),
      /* @__PURE__ */ jsx("span", { className: "proof-note", children: p.note })
    ] }, p.k)) }),
    /* @__PURE__ */ jsxs("div", { className: "spec", children: [
      /* @__PURE__ */ jsx(Rise, { as: "div", style: { width: "100%" }, children: /* @__PURE__ */ jsx(ProductViewer, {}) }),
      /* @__PURE__ */ jsxs(Rise, { as: "div", className: "sfacts", children: [
        /* @__PURE__ */ jsxs("div", { className: "sfacts-top", children: [
          /* @__PURE__ */ jsx("span", { className: "kie", children: "Supplement Facts" }),
          /* @__PURE__ */ jsx("span", { className: "sfacts-sku", children: "No. 001 · PULP Complete" })
        ] }),
        /* @__PURE__ */ jsxs("table", { className: "sfacts-table", children: [
          /* @__PURE__ */ jsx("caption", { className: "sr-only", children: "Supplement facts for PULP Complete, a full-spectrum tocotrienol vitamin E softgel." }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { className: "sf-serving", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "Serving size" }),
              /* @__PURE__ */ jsx("td", { children: "1 softgel" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-serving", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "Servings per container" }),
              /* @__PURE__ */ jsx("td", { children: "60" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { scope: "col", children: "Each softgel contains" }),
            /* @__PURE__ */ jsx("th", { scope: "col", children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { className: "sf-total", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "Tocotrienol complex (from Malaysian palm fruit)" }),
              /* @__PURE__ */ jsx("td", { children: "50 mg" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-sub", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "α-tocotrienol" }),
              /* @__PURE__ */ jsx("td", { children: "Per batch" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-sub", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "β-tocotrienol" }),
              /* @__PURE__ */ jsx("td", { children: "Per batch" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-sub", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "γ-tocotrienol" }),
              /* @__PURE__ */ jsx("td", { children: "Per batch" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-sub", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "δ-tocotrienol" }),
              /* @__PURE__ */ jsx("td", { children: "Per batch" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "sf-sub", children: [
              /* @__PURE__ */ jsx("th", { scope: "row", children: "α-tocopherol" }),
              /* @__PURE__ */ jsx("td", { children: "Per batch" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "sfacts-nrv", children: "The measured isomer split varies by batch and is published on that batch's certificate of analysis. Nutrient reference value for tocotrienols is not established." }),
        /* @__PURE__ */ jsxs("dl", { className: "sfacts-meta", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Other ingredients" }),
            /* @__PURE__ */ jsx("dd", { children: "Softgel shell — gelatin (halal bovine), glycerol, purified water. Carrier — palm oil." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Directions" }),
            /* @__PURE__ */ jsx("dd", { children: "One softgel daily, with food." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Storage" }),
            /* @__PURE__ */ jsx("dd", { children: "Store below 30 °C, away from direct sunlight. Keep the bottle closed." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { children: "Warnings" }),
            /* @__PURE__ */ jsx("dd", { children: "Keep out of reach of children. Not suitable for anyone with a known sensitivity to any listed ingredient. If you are pregnant, nursing or taking medication, speak to your doctor or pharmacist before use." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "sfacts-reg", children: "REG. NO. MAL[NUMBER] (PENDING NPRA NOTIFICATION) · KKLIU [NUMBER]" }),
        /* @__PURE__ */ jsx("p", { className: "sfacts-disc", children: "This product is not a medicine and is not intended to replace medicine. If symptoms persist, consult your doctor or pharmacist." })
      ] })
    ] })
  ] }) });
}
function Founder() {
  return /* @__PURE__ */ jsx("section", { className: "chapter", id: "founder", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "Fig. 04 — Founder" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "A note" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "h-lines", style: { marginBottom: "clamp(24px,3.6vw,40px)" }, children: /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsxs("span", { className: "inner", children: [
      "Why we built ",
      /* @__PURE__ */ jsx("em", { children: "PULP." })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Rise, { as: "div", className: "fnd", children: [
      /* @__PURE__ */ jsxs("figure", { className: "fnd-portrait", children: [
        /* @__PURE__ */ jsxs("div", { className: "fnd-frame", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "assets/founder.jpg",
              width: "640",
              height: "800",
              loading: "lazy",
              alt: "[FOUNDER PHOTO] — portrait of the founder of PULP",
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "fnd-ph", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("span", { className: "mk", children: "[FOUNDER PHOTO]" }),
            /* @__PURE__ */ jsx("span", { className: "sj", children: "Portrait" }),
            /* @__PURE__ */ jsx("span", { className: "rt", children: "4 : 5 · required" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("figcaption", { children: "Selangor, Malaysia" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "fnd-body", children: [
        /* @__PURE__ */ jsxs("blockquote", { className: "fnd-quote", children: [
          /* @__PURE__ */ jsx("p", { children: "I grew up seeing oil palm everywhere in Malaysia — on the drive to school, on the news, in arguments about what this country exports. What I never saw was a Malaysian brand making the most complete nutrient in that fruit the centre of a product. We ship the raw material out and buy it back on a foreign label." }),
          /* @__PURE__ */ jsx("p", { children: "PULP is my attempt at the other order of things: grown here, extracted here, bottled here — and sold with the supply chain written on the page. One product. Sixty softgels. Everything we know about it, published." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "fnd-sign", children: [
          /* @__PURE__ */ jsx("span", { className: "nm", children: "— [FOUNDER NAME]" }),
          /* @__PURE__ */ jsx("span", { className: "role", children: "Founder · Golden Pulp Sdn Bhd · 金果" })
        ] })
      ] })
    ] })
  ] }) });
}
const PAPERS = [
  {
    authors: "Yang, et al.",
    title: "Tocotrienols exhibit superior ferroptosis inhibition over tocopherols",
    journal: "Scientific Reports",
    detail: "16:4497 (2026)",
    method: "In-vitro study in human cells.",
    href: "https://www.nature.com/articles/s41598-025-34673-1"
  },
  {
    authors: "Pharmaceuticals (MDPI) editorial collection",
    title: "Self-emulsifying delivery systems for tocotrienol oral bioavailability",
    journal: "Pharmaceuticals",
    detail: "2023;16:1403",
    method: "Review of formulation and delivery-system literature.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10610013/"
  }
];
function Research() {
  return /* @__PURE__ */ jsx("section", { className: "chapter alt", id: "research", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "eyebrow-row", children: [
      /* @__PURE__ */ jsx("span", { className: "fig", children: "Fig. 06 — Research" }),
      /* @__PURE__ */ jsx("span", { className: "rule-draw" }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "Ingredient class" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "h-lines", style: { marginBottom: 12 }, children: /* @__PURE__ */ jsx("span", { className: "line", children: /* @__PURE__ */ jsxs("span", { className: "inner", children: [
      "Published research on ",
      /* @__PURE__ */ jsx("em", { children: "tocotrienols." })
    ] }) }) }),
    /* @__PURE__ */ jsx(Rise, { as: "p", className: "lede-2", style: { marginBottom: "clamp(24px,3.6vw,38px)" }, children: "These are references to the published literature on tocotrienols as an ingredient class. They are not claims about this product, and PULP makes no claim to treat, cure or prevent any disease." }),
    /* @__PURE__ */ jsx(Rise, { as: "ol", className: "cites", children: PAPERS.map((p, i) => /* @__PURE__ */ jsxs("li", { className: "cite-row", children: [
      /* @__PURE__ */ jsx("span", { className: "cite-n", children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsxs("div", { className: "cite-body", children: [
        /* @__PURE__ */ jsxs("p", { className: "cite-main", children: [
          p.authors,
          " ",
          /* @__PURE__ */ jsxs("span", { className: "cite-title", children: [
            "“",
            p.title,
            ".”"
          ] }),
          " ",
          /* @__PURE__ */ jsx("em", { children: p.journal }),
          " ",
          p.detail
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "cite-method", children: [
          "Examined: ",
          p.method
        ] }),
        /* @__PURE__ */ jsx("a", { href: p.href, target: "_blank", rel: "noopener", className: "cite-link", children: "Read the source →" })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs(Rise, { as: "p", className: "cites-foot", children: [
      "Wider research on tocotrienols is collected independently at",
      " ",
      /* @__PURE__ */ jsx("a", { href: "https://tocotrienolresearch.org", target: "_blank", rel: "noopener", children: "tocotrienolresearch.org" }),
      ". PULP is a food supplement, not a medicine."
    ] })
  ] }) });
}
const PAYMENTS = ["FPX", "DuitNow QR", "Touch 'n Go eWallet", "GrabPay", "Visa", "Mastercard"];
function SiteFooter() {
  return /* @__PURE__ */ jsx("footer", { className: "site-footer", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "foot-top", children: [
      /* @__PURE__ */ jsxs("div", { className: "foot-brand", children: [
        /* @__PURE__ */ jsxs("span", { className: "mark", children: [
          "P",
          /* @__PURE__ */ jsx("span", { className: "u", children: "u" }),
          "lp"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Full-spectrum tocotrienol vitamin E, grown, extracted and bottled in Malaysia." }),
        /* @__PURE__ */ jsx("p", { className: "cn", children: "金果 · Golden Pulp Sdn Bhd" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h2", { className: "foot-h", children: "Explore" }),
        /* @__PURE__ */ jsx("a", { href: "#/product", children: "The Specimen" }),
        /* @__PURE__ */ jsx("a", { href: "#/composition", children: "Composition" }),
        /* @__PURE__ */ jsx("a", { href: "#/traceability", children: "Traceability" }),
        /* @__PURE__ */ jsx("a", { href: "#/proof", children: "Proof & label" }),
        /* @__PURE__ */ jsx("a", { href: "#/research", children: "Research" }),
        /* @__PURE__ */ jsx("a", { href: "#/faq", children: "FAQ" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h2", { className: "foot-h", children: "Contact" }),
        /* @__PURE__ */ jsx("a", { href: "mailto:hello@pulp.my", children: "hello@pulp.my" }),
        /* @__PURE__ */ jsx("a", { href: "https://wa.me/[WHATSAPP NUMBER]", target: "_blank", rel: "noopener", children: "WhatsApp — [WHATSAPP NUMBER]" }),
        /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/pulpmy/", target: "_blank", rel: "noopener", children: "@pulpmy" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "foot-col", children: [
        /* @__PURE__ */ jsx("h2", { className: "foot-h", children: "Registered entity" }),
        /* @__PURE__ */ jsx("p", { children: "Golden Pulp Sdn Bhd (金果有限公司)" }),
        /* @__PURE__ */ jsx("p", { children: "Company no. [SSM NUMBER]" }),
        /* @__PURE__ */ jsx("p", { children: "[REGISTERED ADDRESS]" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pay-row", children: [
      /* @__PURE__ */ jsx("span", { className: "pay-k", children: "Payment methods at launch" }),
      /* @__PURE__ */ jsx("ul", { className: "pay-list", children: PAYMENTS.map((p) => /* @__PURE__ */ jsx("li", { children: p }, p)) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "reg-line", children: "REG. NO. MAL[NUMBER] (PENDING NPRA NOTIFICATION) · KKLIU [NUMBER] · HALAL CERT: NOT YET CERTIFIED" }),
    /* @__PURE__ */ jsx("p", { className: "disclaimer", children: "This product is not a medicine and is not intended to replace medicine. If symptoms persist, consult your doctor or pharmacist. Research references on this site describe tocotrienols as an ingredient class and are not claims about this product." }),
    /* @__PURE__ */ jsxs("div", { className: "foot-bottom", children: [
      /* @__PURE__ */ jsx("span", { children: "© 2026 GOLDEN PULP SDN BHD · 金果有限公司 · ALL RIGHTS RESERVED" }),
      /* @__PURE__ */ jsx("span", { children: "PRIVATE PREVIEW — NOT FOR SALE UNTIL NPRA NOTIFICATION IS COMPLETE" })
    ] })
  ] }) });
}
const EASE = "power3.out";
const EASE_IO = "power2.inOut";
const STAGGER = 0.08;
const START = "top 84%";
const once = { toggleActions: "play none none none" };
function ScrollFX() {
  const barRef = useRef(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = (s) => gsap.utils.toArray(s);
      const has = (s) => !!document.querySelector(s);
      const prog = { start: 0, end: "max", scrub: 0.3 };
      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", transformOrigin: "left center", scrollTrigger: prog }
        );
      }
      if (has(".rail-line-fill")) {
        gsap.fromTo(
          ".rail-line-fill",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", transformOrigin: "top center", scrollTrigger: prog }
        );
      }
      q(".linked").forEach((sec) => {
        gsap.fromTo(sec, { "--link": 0 }, {
          "--link": 1,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "bottom 88%", end: "bottom 42%", scrub: true }
        });
      });
      if (has(".hero")) {
        gsap.fromTo(".hero-copy", { y: 0 }, {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      }
      if (has(".scrollcue")) {
        gsap.to(".scrollcue", {
          opacity: 0,
          y: 14,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "30% top", scrub: true }
        });
      }
      q(".eyebrow-row .rule-draw").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 58%", scrub: true }
        });
      });
      q(".h-lines").forEach((h) => {
        const lines = h.querySelectorAll(".inner");
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 108,
          duration: 0.9,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: h, start: START, ...once }
        });
      });
      if (has(".ess-grid")) {
        gsap.from(".ess-grid > div, .ess-note", {
          yPercent: 14,
          opacity: 0,
          duration: 0.7,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: ".ess-grid", start: START, ...once }
        });
      }
      const glyphs = q(".why-glyphs .glyph");
      if (glyphs.length) {
        gsap.from(glyphs, {
          yPercent: 46,
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          stagger: 0.09,
          scrollTrigger: { trigger: ".why-vis", start: START, ...once }
        });
        gsap.fromTo(".why-glyphs", { yPercent: 5 }, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: "#why", start: "top bottom", end: "bottom top", scrub: true }
        });
      }
      if (has(".fam")) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".fam", start: "top 82%", ...once }
        });
        tl.from(".fam-row", { opacity: 0, x: -14, duration: 0.5, ease: EASE, stagger: 0.12 }).from(".fam-node", { scale: 0.4, opacity: 0, duration: 0.45, ease: "back.out(2)", stagger: 0.045 }, "-=0.2").fromTo(
          ".fam-node.is-in",
          { "--fill": 0 },
          { "--fill": 1, duration: 0.5, ease: EASE_IO, stagger: 0.06 },
          "+=0.05"
        );
      }
      if (has(".chain")) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".chain", start: "top 82%", ...once }
        });
        const steps = q(".chain-step");
        const links = q(".chain-link-fill");
        steps.forEach((s, i) => {
          tl.from(s, { opacity: 0, y: 22, scale: 0.94, duration: 0.5, ease: EASE }, i === 0 ? 0 : ">-0.12");
          if (links[i]) {
            tl.fromTo(
              links[i],
              { scaleX: 0 },
              { scaleX: 1, transformOrigin: "left center", duration: 0.45, ease: "none" },
              ">-0.08"
            );
          }
        });
      }
      if (has(".trust-row")) {
        gsap.from(".trust-row li", {
          opacity: 0,
          y: 18,
          duration: 0.55,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: ".trust-row", start: START, ...once }
        });
      }
      if (has(".bf-n")) {
        gsap.fromTo(".bf-n", { yPercent: 8 }, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: "#reserve", start: "top bottom", end: "bottom top", scrub: true }
        });
      }
      q(".botmark").forEach((el) => {
        gsap.fromTo(el, { yPercent: -12 }, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
      q(".trace-step").forEach((el) => {
        gsap.from(el, {
          x: -18,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", ...once }
        });
      });
      if (has(".proof-strip")) {
        gsap.from(".proof-cell", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: ".proof-strip", start: START, ...once }
        });
      }
      if (has(".glyph-band")) {
        gsap.from(".glyph-band .glyph", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: EASE,
          scrollTrigger: { trigger: ".glyph-band", start: "top 82%", ...once }
        });
      }
    });
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const sec = document.querySelector("#spectrum");
      const band = document.querySelector(".glyph-band");
      if (!sec || !band) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=45%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          refreshPriority: -1,
          invalidateOnRefresh: true
        }
      }).fromTo(band, { scale: 0.92 }, { scale: 1.08, ease: "none" });
    });
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  });
  return /* @__PURE__ */ jsx("div", { className: "gsx-progress", "aria-hidden": "true", ref: barRef });
}
const CTA = "Reserve your bottle";
function ReserveModal({ open, onClose }) {
  const modalRef = useRef(null), emailRef = useRef(null), lastFocus = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useLockBody(open);
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      const t = setTimeout(() => emailRef.current && emailRef.current.focus(), 80);
      return () => clearTimeout(t);
    } else if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, [open]);
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = modalRef.current.querySelectorAll("button, input, a[href]");
        if (!f.length) return;
        const a = f[0], b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  const submit = (e) => {
    e.preventDefault();
    const v = (emailRef.current.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setError("Enter a valid email address, for example you@email.com.");
      setStatus("error");
      emailRef.current.focus();
      return;
    }
    setError("");
    setStatus("done");
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "modal-overlay" + (open ? " open" : ""),
      "aria-hidden": !open,
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxs("div", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modalTitle", ref: modalRef, children: [
        /* @__PURE__ */ jsxs("div", { className: "m-top", children: [
          /* @__PURE__ */ jsx("span", { className: "mono", children: "SPECIMEN · RESERVE No. 001" }),
          /* @__PURE__ */ jsx("button", { className: "modal-close", "aria-label": "Close", onClick: onClose, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "sample-mini", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("h3", { id: "modalTitle", children: [
          "Reserve your ",
          /* @__PURE__ */ jsx("em", { children: "bottle." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "m-lede", children: "The first batch is capped at 88 bottles. Reserving costs nothing and commits you to nothing — we cannot sell until NPRA notification is complete." }),
        status !== "done" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("form", { className: "wl-form", onSubmit: submit, noValidate: true, children: [
            /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "modal-email", children: "Email address" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "modal-email",
                type: "email",
                ref: emailRef,
                placeholder: "you@email.com",
                autoComplete: "email",
                inputMode: "email",
                "aria-invalid": status === "error",
                "aria-describedby": "modal-status",
                required: true
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "submit", children: CTA })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "wl-note", id: "modal-status", role: "status", "aria-live": "polite", children: status === "error" ? /* @__PURE__ */ jsx("span", { className: "rsv-err", children: error }) : "One email at launch · unsubscribe anytime" })
        ] }) : /* @__PURE__ */ jsx("p", { className: "wl-success show", role: "status", "aria-live": "polite", children: "You're on the list. We'll write when No. 001 is ready. ✦" })
      ] })
    }
  );
}
function MobileCta({ onOpen, overlayOpen, route }) {
  const [past, setPast] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > 420);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [route]);
  const [atReserve, setAtReserve] = useState(false);
  useEffect(() => {
    const el = document.getElementById("reserve");
    if (!el || !("IntersectionObserver" in window)) {
      setAtReserve(false);
      return;
    }
    const io = new IntersectionObserver((es) => setAtReserve(es.some((e) => e.isIntersecting)), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [route]);
  const hide = !past || overlayOpen || dismissed || atReserve;
  return /* @__PURE__ */ jsxs("div", { className: "mcta" + (hide ? " hide" : ""), children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: href("/"),
        className: "mcta-btn",
        onClick: (e) => {
          e.preventDefault();
          onOpen();
        },
        children: CTA
      }
    ),
    /* @__PURE__ */ jsx("button", { className: "mcta-x", "aria-label": "Dismiss", onClick: () => setDismissed(true), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
  ] });
}
function CtaBand({ onReserve }) {
  return /* @__PURE__ */ jsx("section", { className: "ctaband", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
    /* @__PURE__ */ jsx("p", { children: "The first batch is capped at 88 bottles." }),
    /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-primary", onClick: onReserve, children: CTA })
  ] }) });
}
function App() {
  const route = useRoute();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    const el = mainRef.current;
    if (el) {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
      el.removeAttribute("tabindex");
    }
    document.title = route === "/" ? "PULP — Full-Spectrum Vitamin E, Grown and Bottled in Malaysia" : `${ROUTES[route]} · PULP`;
  }, [route]);
  const page = () => {
    switch (route) {
      case "/product":
        return /* @__PURE__ */ jsx(Product, { onReserve: openModal, cta: CTA });
      case "/composition":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Spectrum, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      case "/traceability":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Traceability, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      case "/proof":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Proof, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      case "/research":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Research, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      case "/story":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Founder, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      case "/faq":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Faq, {}),
          /* @__PURE__ */ jsx(CtaBand, { onReserve: openModal })
        ] });
      default:
        return /* @__PURE__ */ jsx(Home, { onReserve: openModal, cta: CTA });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("a", { className: "skip", href: "#main", children: "Skip to content" }),
    /* @__PURE__ */ jsx("div", { className: "grain", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx(ScrollFX, {}, route),
    /* @__PURE__ */ jsx("div", { className: "util", children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsx("span", { className: "mono", children: "— MALAYSIA — · TOCOTRIENOL COMPLEX" }),
      /* @__PURE__ */ jsxs("div", { className: "right", children: [
        /* @__PURE__ */ jsxs("span", { className: "badge mono hide-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "dot" }),
          "PRIVATE PREVIEW · NOTIFICATION PENDING"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mono", children: "No. 001" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Nav, { route, onReserve: openModal, cta: CTA }),
    /* @__PURE__ */ jsx("main", { id: "main", ref: mainRef, children: page() }),
    /* @__PURE__ */ jsx(SiteFooter, {}),
    /* @__PURE__ */ jsx(MobileCta, { onOpen: openModal, overlayOpen: modalOpen, route }),
    /* @__PURE__ */ jsx(ReserveModal, { open: modalOpen, onClose: () => setModalOpen(false) })
  ] });
}
function render() {
  return renderToString(/* @__PURE__ */ jsx(App, {}));
}
export {
  render
};
