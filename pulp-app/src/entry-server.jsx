/*
  Prerender entry. Run in Node at build time to turn the app into static HTML
  that gets baked into #root.

  Why this exists: without it, #root ships empty and 100% of the page comes from
  JavaScript — so the file is blank in any context that does not execute it. The
  iPhone Files app is exactly such a context: tapping an .html file opens it in
  Quick Look, a preview that does not run page scripts. Same story for a
  JS-blocking extension, a bot, or a bundle that fails to parse.

  With this, the file is readable everywhere and React hydrates on top when it can.
*/
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export function render() {
  return renderToString(<App />);
}
