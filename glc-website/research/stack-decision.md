# Stack decision

The brief's proposal in section 7 is right and I am not arguing with it. Astro with content collections, Tailwind with project tokens, the Astro image pipeline, a hosted form endpoint, static hosting from Git. For a site whose content changes a few times a year, whose editors are non-technical, and whose audience opens it on a phone on a site visit, that is the correct shape: no server, no database, no CMS to keep patched, and a project is added by copying one file.

## Versions, checked against the npm registry today

The registry is reachable from this session even though page fetching is not, so these are current facts rather than recollections:

| Package | Current version |
|---|---|
| `astro` | 7.3.2 |
| `tailwindcss` | 4.3.3 |
| `@tailwindcss/vite` | 4.3.3 |
| `@astrojs/sitemap` | 3.7.4 |
| `@astrojs/check` | 0.9.10 |
| `typescript` | 7.0.2 |
| `sharp` | 0.35.4 |
| `prettier` | 3.9.6 |
| `eslint` | 10.10.0 |

Two consequences worth flagging before Phase 1:

- **Astro 7 and TypeScript 7 are both beyond my training data**, and the official documentation site is blocked here. So Phase 1 starts by installing Astro and reading the API surface from the installed package itself — its own type definitions, README and templates — rather than from anything I remember about Astro 4 or 5. Content collections, the loader API and the i18n routing options must all be confirmed against the version actually installed. Do not let me write a `content.config.ts` from memory.
- **Tailwind 4 configures tokens in CSS**, not in a `tailwind.config.js`, via an `@theme` block, and installs as a Vite plugin rather than a PostCSS plugin. The design plan's tokens are already written as CSS custom properties, which maps onto that directly. Confirm against the installed version.

## Decisions inside the brief's proposal

**Tailwind, but thin.** The design has six colours, one spacing scale, two typefaces and eight type steps. That is a token file, not a utility framework's worth of configuration. Tailwind earns its place for the responsive and state variants and for not shipping unused CSS; it does not earn the right to bring its default palette, its default type scale or its default shadows. Every one of those defaults is disabled and replaced with the plan's tokens. If the CSS ends up small enough that plain CSS with custom properties would do the same job, that is a legitimate Phase 2 simplification.

**No component framework.** No React, no Svelte, no islands. The only interactive thing on the site is the projects filter, and it should work without JavaScript: real form controls that submit to a filtered URL, progressively enhanced to filter in place. The mobile contact bar is CSS. Target zero JavaScript on every page except `/projects`, and a few hundred bytes there.

**Images.** Astro's pipeline with AVIF and WebP, explicit dimensions on every image so nothing shifts, lazy below the fold, eager on the one image above it. The hard constraint is the source material: the photo audit records the native pixel width of all 75 photographs and most are between 400 and 750px. The pipeline must be configured never to upscale — an upscaled AVIF of a 452px photo looks worse than the original at its real size and costs more bytes.

**Forms.** Netlify Forms if hosting is Netlify: no JavaScript, a honeypot field, and the submission emailed to the family. Cloudflare Pages has no equivalent built in, so it would need Turnstile plus a Pages Function, which is more moving parts than this site should have. **Recommendation: Netlify**, and the hosting choice therefore follows the form choice rather than the other way round. Either way the form is never the only contact route — WhatsApp is at least as prominent, per the brief's section 8.

**i18n.** Astro's own routing, configured in Phase 1 even though the Malay content lands later: English at the root with no prefix, Malay under `/ms/`. `astro-i18next` is at `1.0.0-beta.21` and has been at a beta for a long time; do not add it. The site has eight page types and a few dozen strings — a typed dictionary per locale and Astro's built-in routing is less code and less risk. Note that `title_original` already gives every project real Malay content on day one, which is unusual and useful: the Malay project pages are not empty even before anything is translated.

**Content model.** One Markdown file per project under `content/projects/`, front matter validated by a Zod schema that mirrors the brief's section 4 exactly. Two rules the schema must enforce, because they are the privacy rules from section 11 expressed as code rather than as good intentions:

1. The fields `client_as_printed` and `location_precise_source` in `content/projects.extracted.json` **do not exist in the published schema at all.** They stay in the extraction file, outside the content collection, so no template can reach them and no future edit can leak a private client's name or house number onto a page.
2. `value_publish` and `client_publish` default to `false`, and the templates read the value and the client name only through a helper that returns `null` when the flag is false. Defaulting to hidden means a new project added by a non-technical editor is private until someone deliberately publishes it.

**Toolchain.** TypeScript strict, `@astrojs/check` in the build, ESLint and Prettier, and `pnpm dev` / `pnpm build` / `pnpm preview`. One extra script worth having: a `pnpm check:content` that fails the build if any photograph carries EXIF data, if any project has `value_publish: true` without a recorded permission, or if any published `title_original` still contains a personal name. Three checks, and they turn the section 11 rules into something that cannot be forgotten at 11pm a year from now.

**A README a non-developer can follow.** Written in Phase 4, and it should cover exactly two tasks: add a project, and publish. Not "getting started with Astro".
