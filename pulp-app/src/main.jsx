import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App.jsx';

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

/* The single-file build ships prerendered markup inside #root so the page is
   readable with no JavaScript at all. Hydrate that rather than discarding it;
   fall back to a fresh render for the dev server, where #root is empty. */
const onErr = (err) => console.error('[pulp] recoverable render error', err);
if (root.firstElementChild) hydrateRoot(root, tree, { onRecoverableError: onErr });
else createRoot(root).render(tree);
