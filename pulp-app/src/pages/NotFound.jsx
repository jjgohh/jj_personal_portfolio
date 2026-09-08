import React from 'react';
import { Rise } from '../lib.jsx';
import { ROUTES, href, navigate } from '../router.jsx';

/*
  404. Reached when the hash looks like a route we do not have (see read() in
  router.jsx), and served by Netlify for any unknown real path via the SPA
  rewrite, so both kinds of wrong URL land here rather than silently showing the
  wrong page.

  A 404 that only apologises is a dead end. This one lists every real route, so
  the page is a way back rather than a wall — which is the whole point of having
  a custom one instead of the host's default.

  Kept in the site's own register: no "Oops!", no exclamation mark, no cartoon.
*/

// Everything a visitor can actually navigate to. '/404' itself is excluded, and
// so is Home, which gets its own primary action below.
const ELSEWHERE = Object.keys(ROUTES).filter((r) => r !== '/404' && r !== '/');

export default function NotFound() {
  const go = (to) => (e) => { e.preventDefault(); navigate(to); };

  return (
    <section className="chapter nf" id="notfound">
      <div className="wrap">
        <p className="nf-code" aria-hidden="true">404</p>
        <h1 className="h-lines" style={{ marginBottom: 12 }}>
          <span className="line"><span className="inner">That page <em>does not exist.</em></span></span>
        </h1>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(22px,3.4vw,34px)' }}>
          The link may be mistyped, or it may be one we retired while building the site.
          Everything that does exist is below.
        </Rise>

        <Rise as="div" className="nf-actions">
          <a className="btn btn-primary" href={href('/')} onClick={go('/')}>
            Back to the start
          </a>
        </Rise>

        <Rise as="nav" className="nf-map" aria-label="All pages">
          <ul>
            {ELSEWHERE.map((r) => (
              <li key={r}>
                <a href={href(r)} onClick={go(r)}>{ROUTES[r]}</a>
              </li>
            ))}
          </ul>
        </Rise>

        <Rise as="p" className="nf-help">
          If you followed a link from somewhere on this site, that is our mistake — tell us
          at <a href="mailto:hello@pulp.my">hello@pulp.my</a> and we will fix it.
        </Rise>
      </div>
    </section>
  );
}
