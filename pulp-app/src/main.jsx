import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App.jsx';

const root = document.getElementById('root');
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/* The single-file build ships prerendered markup inside #root so the page is
   readable with no JavaScript at all. Hydrate that rather than discarding it;
   fall back to a fresh render for the dev server, where #root is empty. */
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
