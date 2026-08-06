import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App.jsx';
import { initialRoute } from './router.jsx';

/*
  React 18 with no error boundary unmounts the whole tree on an uncaught error,
  which EMPTIES the container. The container is #root, which is where the
  prerendered markup is baked — so one throw anywhere would delete the very
  safety net the build refuses to ship without. This boundary renders the
  children unchanged and, on error, returns null so React stops re-rendering
  without tearing the DOM down further.
*/
class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err, info) { console.error('[pulp] render error', err, info); }
  render() { return this.state.failed ? null : this.props.children; }
}

const root = document.getElementById('root');
const tree = (
  <React.StrictMode>
    <Boundary><App /></Boundary>
  </React.StrictMode>
);

/*
  The single-file build ships prerendered markup inside #root so the page is
  readable with no JavaScript at all. Hydrate that rather than discarding it;
  fall back to a fresh render for the dev server, where #root is empty.

  Hydration is only valid when the first client render matches that markup, and
  the markup is ALWAYS Home — the hash fragment is never sent to a server, so the
  prerender cannot know which route was requested. Loading a deep hash directly
  therefore mismatched every time: measured on a fresh load of #/faq, React
  logged six #418s and a #423 and threw the entire prerendered tree away to
  re-render from scratch. Same pixels, but the prerender was wasted and the
  console was full of errors that masked real ones.

  So decide up front. Home hydrates and keeps the benefit. Any other route is a
  known mismatch, so clear the Home markup and client-render deliberately —
  one honest render instead of a failed hydration plus a recovery render.
*/
const onErr = (err) => console.error('[pulp] recoverable render error', err);
if (root.firstElementChild && initialRoute() === '/') {
  hydrateRoot(root, tree, { onRecoverableError: onErr });
} else {
  root.textContent = '';
  createRoot(root).render(tree);
}
