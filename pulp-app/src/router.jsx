import { useEffect, useState } from 'react';

/*
  Minimal hash router — no dependency, ~1KB.

  WHY HASH ROUTING and not real paths:
  1. It works in the single-file Artifact build, which has no server at all.
     Path-based routing would 404 there.
  2. It needs no host rewrite rules, so the same build is correct on Netlify,
     a plain S3 bucket, or opened straight from disk.
  3. No router dependency, which matters because first-load JS is on a budget
     enforced at build time — see CEILING_KB in tools/prerender-dist.mjs. Change
     it there, not here: this comment used to name a figure of its own that the
     bundle had already outgrown, so the argument rested on a stale number.

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
  '/privacy': 'Privacy Notice',
  '/terms': 'Reservation Terms',
  '/404': 'Page not found',
};

/* One-line summary per route, used for <meta name="description">. Search engines
   ignore the hash, so these matter for link previews and for anyone who lands on
   a deep route from a shared URL, not for ranking. */
export const DESCRIPTIONS = {
  '/': 'PULP No. 001 — four tocotrienols plus alpha-tocopherol, 50 mg per softgel. Grown, extracted and bottled in Malaysia. Reserve your bottle.',
  '/product': 'PULP Complete: 50 mg full-spectrum tocotrienol per softgel, 60 softgels per bottle, from non-GMO Malaysian palm fruit.',
  '/composition': 'What is actually in the bottle: the four tocotrienol isomers plus alpha-tocopherol, stated per softgel.',
  '/traceability': 'Fruit to softgel: where PULP is grown, extracted, encapsulated and bottled, named step by step.',
  '/proof': 'Label, batch and regulatory status for PULP No. 001, including our NPRA notification position.',
  '/research': 'Published research on tocotrienols, listed as neutral external citations with full attribution.',
  '/story': 'Why we built PULP in Malaysia, from the founder.',
  '/faq': 'Straight answers on dose, form, sourcing, regulatory status and what reserving actually commits you to.',
  '/privacy': 'What personal data PULP collects, why, where it is stored, and your rights under the Malaysian PDPA 2010. In English and Bahasa Malaysia.',
  '/terms': 'What reserving a bottle of PULP does and does not commit you to, before NPRA notification is complete.',
  '/404': 'That page does not exist.',
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
  const looksLikeRoute = raw.startsWith('/');
  const path = looksLikeRoute ? raw : '/' + raw;
  const clean = path.split('?')[0].replace(/\/$/, '') || '/';
  if (legacy[clean]) { current = legacy[clean]; return current; }
  if (ROUTES[clean]) { current = clean; return current; }
  /* A hash SHAPED like a route that we do not have is a wrong URL, and pretending
     it is the current page hides a broken link from whoever shared it. A bare
     fragment (#main, #section-3) is an in-page anchor, not a route, so that still
     leaves the route alone. */
  current = looksLikeRoute ? '/404' : current;
  return current;
}

/* The prerender always renders Home, because the server never receives the hash
   fragment. The entry point needs to know whether the route about to render is
   that same Home before it decides to hydrate. */
export function initialRoute() {
  return read();
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

export function href(to) {
  return '#' + to;
}
