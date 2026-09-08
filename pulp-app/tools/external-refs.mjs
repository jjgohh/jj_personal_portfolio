/*
  Finds external SUBRESOURCES in a blob of markup, shared by make-artifact.mjs
  (which must guarantee the single file works under the Artifact CSP and offline)
  and check-site.mjs (which re-checks the shipped file).

  The distinction that matters, and that both scripts originally got wrong:

    SUBRESOURCE  the browser fetches it to render the page — script src, link
                 rel=stylesheet/icon/preload, img/video src, CSS url(), @import.
                 Under the Artifact CSP these are blocked outright, and on a
                 phone opened offline they are simply missing. These must fail
                 the build.

    METADATA     never fetched — <link rel="canonical">, og:url, og:image,
                 twitter:image. A scan that flags these fails the build over
                 tags that cannot break anything, which is what happened when
                 canonical and og:url were added.

    NAVIGATION   an <a href> the visitor may choose to follow, such as the
                 WhatsApp and Instagram links. Not a subresource either.

  og:image is deliberately NOT flagged even though it names a remote PNG: a
  scraper fetches it server-side from the deployed URL, never the page itself.
*/
export function findExternalSubresources(markup) {
  const hits = [];
  for (const m of markup.matchAll(/\ssrc=["'](?:https?:)?\/\/[^"']+/gi)) hits.push(m[0].trim());
  for (const m of markup.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = (tag.match(/\srel=["']([^"']+)["']/i) || [, ''])[1].toLowerCase();
    const isSub = /\b(stylesheet|preload|prefetch|preconnect|dns-prefetch|icon|apple-touch-icon|manifest)\b/
      .test(rel);
    if (isSub && /\shref=["'](?:https?:)?\/\//i.test(tag)) hits.push(tag.slice(0, 90));
  }
  for (const m of markup.matchAll(/@import\s+(?:url\()?["']?(?:https?:)?\/\//gi)) hits.push(m[0].trim());
  for (const m of markup.matchAll(/url\(\s*["']?(?:https?:)?\/\/[^)]+/gi)) hits.push(m[0].trim());
  return hits;
}
