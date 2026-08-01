import { useEffect, useState, useCallback } from 'react';

/*
  Minimal hash router — no dependency, ~1KB.

  WHY HASH ROUTING and not real paths:
  1. It works in the single-file Artifact build, which has no server at all.
     Path-based routing would 404 there.
  2. It needs no host rewrite rules, so the same build is correct on Netlify,
     a plain S3 bucket, or opened straight from disk.
  3. No router dependency, which matters because first-load JS is on a hard
     105KB gzipped budget.

  TRADE-OFF, stated honestly: hash fragments are weaker for SEO than real paths,
  and pre-launch that is an acceptable price. At NPRA clearance, when organic
  search starts to matter, migrate to real paths — the page components below are
  already route-agnostic, so that change is confined to this file plus a Vite
  multi-entry config or a server rewrite.
*/

export const ROUTES = {
  '/': 'Home',
  '/product': 'The Specimen',
  '/composition': 'Composition',
  '/traceability': 'Traceability',
  '/proof': 'Proof & Label',
  '/research': 'Research',
  '/story': 'Our Story',
  '/faq': 'FAQ',
};

/* Last resolved route. An unrecognised hash — an in-page anchor like #main from
   the skip link, or a third-party fragment — must LEAVE THE ROUTE ALONE rather
   than fall back to '/'. Resetting to Home meant activating "Skip to content" on
   any deep page navigated away from it. */
let current = '/';

function read() {
  // The prerender step runs in Node, where there is no location.
  if (typeof window === 'undefined') return '/';
  const raw = (window.location.hash || '').replace(/^#/, '');
  if (!raw || raw === '/') return '/';
  // tolerate legacy in-page anchors (#spectrum) from older links//bookmarks
  const legacy = {
    '/spectrum': '/composition', '/reserve': '/', '/top': '/',
    '/founder': '/story', '/specimen': '/product',
  };
  const path = raw.startsWith('/') ? raw : '/' + raw;
  const clean = path.split('?')[0].replace(/\/$/, '') || '/';
  const next = legacy[clean] || (ROUTES[clean] ? clean : current);
  current = next;
  return next;
}

export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function navigate(to) {
  if (window.location.hash.replace(/^#/, '') === to) {
    // same route — just return to the top rather than doing nothing
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  window.location.hash = to;
}

export function useLinkHandler() {
  return useCallback((to) => (e) => {
    if (e) e.preventDefault();
    navigate(to);
  }, []);
}

export function href(to) {
  return '#' + to;
}
