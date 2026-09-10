# Global Land Consortium Sdn Bhd — website

Marketing website for a Malaysian building contractor. Read this file before touching anything. The brief is `docs/brief.md`; the phase deliverables are in `research/`.

**Current state: the site is complete and deployable.** `site/` holds 79 finished pages;
Netlify serves it with no build step.

```
python3 build.py              # regenerate site/ after editing the JSON or the CSS
python3 tools/make_logo.py    # regenerate the wordmark suite
python3 tools/make_preview.py # bundle site/ into ../glc-site-preview.html for review
```

`make_preview.py` produces a single self-contained file that mirrors the real site exactly
— same generator, no second copy to maintain. Deployment steps and the five pre-launch
decisions are in `DEPLOY.md`.

---

## 1. The one rule

**Every fact on this site traces to the company profile PDF, a verified external source, or a written confirmation from the family. There are no exceptions and there is no filler.**

A contractor's website that overstates credentials is a legal and commercial problem, not a copywriting one. If a fact is missing, write `TODO(verify): …` in the content file and add a row to `content/open-questions.md`. Never fill a gap with something plausible.

## 2. Never invent

Not from memory, not "as a placeholder", not "to be replaced later":

- **ISO certifications.** GLC holds none. No 9001, no 14001, no 45001, and no "quality assured" or "safety first" copy either, because those read as ISO-adjacent claims.
- **QLASSIC or SHASSIC scores, safety records, awards, accreditations, professional memberships.** None appear in the profile.
- **Headcount, turnover, "years of experience" figures, project counts.** Counts and totals are computed from the project data at build time. Nothing is typed into a template.
- **Client testimonials, quotes or logos.**
- **Project photographs.** Every image must be of the project it is attached to. Never substitute stock imagery, and never reuse one project's photo on another.
- **Vision and mission statements.** Placeholder until the family writes them.
- **CIDB tender ceilings or SCORE interpretations.** See `research/credentials-verification.md`: the certificate facts are verified, the interpretive claims are not, and the unverified ones must not appear on a page.

## 3. Privacy — read `research/privacy-and-disclosure.md` before publishing any project

The company profile is a confidential tender document. The website is public and indexed. These are different disclosure contexts.

The profile pairs, for 28 private residential clients, a named individual with their home address down to the lot number and what they paid. Default rules, unless the family instructs otherwise in writing:

1. **Private individual clients are never named.** Use "Private client".
2. **Locations are generalised to the neighbourhood.** "Kota Damansara, Selangor", never the lot or house number.
3. **Corporate and institutional clients are named only with written permission.** Template at `content/templates/client-permission-request.md`.
4. **Contract values are hidden per project by default.** Aggregates are always fine.
5. **Both directors' IC numbers appear on the certificates** (CIDB p.9 has two, MOF p.6 has one). Redact before publishing any scan. Keep unredacted originals out of the repository.
6. **Strip EXIF and GPS from every photograph.**
7. Supplier, sub-contractor and staff names are not published.

Two fields in `content/projects.extracted.json` are **internal only and must never exist in the published content schema**: `client_as_printed` and `location_precise_source`. Keeping them outside the content collection is what stops a template reaching them.

## 4. Company facts (verified — profile pp.4–9)

| | |
|---|---|
| Legal name | Global Land Consortium Sdn Bhd |
| Registration no. | 1089230-X |
| Incorporated | 24 February 2015, in Malaysia |
| Tel · Fax | +603-7972 9516 · +603-7972 9615 |
| Email on file | infoglcsb99@gmail.com — a proper domain address is question A3 |
| Registered office | **Unresolved.** Three addresses appear across the profile and certificates. See question A1. Do not publish any of them yet |
| Banker | Public Bank Berhad, Taman Desa branch |

**People.** Chairman: Dato' Ahmad Fathiri Bin Ahmad Fadzlah — MBA (Professional Master in Administration), Universiti Teknologi Malaysia; in construction and project management since 2003. *The profile styles him "YAB Dato'"; YAB is normally reserved for a Prime Minister, Deputy Prime Minister, Menteri Besar or Chief Minister. Confirm the honorific before publishing — question B13.* Executive Director and shareholder: Mr Goh Nai Koon — in the construction industry since 1987. Project Director and shareholder: Mr Yip Chee Tack — quantity surveyor, in the industry since 1998. Technical staff: two site supervisors and one senior quantity surveyor (do not name them without their agreement — question B16).

**Credentials.** CIDB registration 0120181011-WP018050, first registered 11 October 2018. Grade **G6** in three categories: **B** (Pembinaan Bangunan), **CE** (Pembinaan Kejuruteraan Awam), **ME** (Mekanikal dan Elektrikal). Sijil Perolehan Kerja Kerajaan effective 12 September 2025, expires 14 September 2028. CIDB SCORE **3 stars** for the year 2025, valid until 9 June 2027, certificate ref SC150741. Ministry of Finance certificate K98463596913999914, reference 357-0002411991, valid 1 November 2024 to 31 October 2027, registered fields 090101, 090102 and 221401.

Two cautions. There is **no PPK certificate** in the profile, only the SPKK (question B14). The MOF fields are *supply and services* codes for building materials, pipes and fittings, and interior decoration — the site must not imply the MOF registration qualifies GLC for government building works. That is what the CIDB SPKK does.

**Track record** (computed from the data — see `research/data-extraction.md`, and never hard-code these):

- 3 current projects, RM10,285,678.66
- 20 completed projects attributable to the company, RM61,308,734, April 2015 to February 2024
- 24 projects delivered by the directors before incorporation, RM40,706,311, May 2002 to February 2015

**Attribution.** The company was incorporated in February 2015. Any project starting before that is the directors' personal record, not the company's, and is labelled with one fixed sentence: *"Delivered by our directors before Global Land Consortium was incorporated in 2015."* Four rows of the profile's own "completed projects" table fall in this period and are flagged pending question B3. Handled properly this is a strength — nearly forty years of continuous experience. Handled sloppily it is a misrepresentation a competitor or a procurement officer could raise.

## 5. Content rules

- **Keep the Malay planning-approval title on every project page,** visible and labelled. A Malaysian consultant or council officer recognises "Cadangan membina sebuah rumah banglo 3 tingkat…" instantly, and translating it away loses credibility with exactly the audience that matters. `title_original` has obvious spelling errors corrected; `title_original_as_printed` is verbatim; both are kept. Strip any personal name that appears inside a title.
- **Keep Malay planning vocabulary intact** where it appears: *cadangan*, *tambahan dan pindaan*, *banglo*, *gudang*, *mukim*, *daerah*, *pasaraya*. It is searchable vocabulary for the professional audience.
- **`scope` matters more than `sector`** for subcontract enquiries. Someone looking for a steel-structure subcontractor filters to it in one click.
- **Currency:** `RM 1,234,567.00`, always with thousands separators. **Dates:** `Month YYYY`, never the profile's mixed `MAC 2012` / `MARCH 2013` / `Feb 2017` styles. **Phone numbers:** `tel:` links in +60 international format.
- **The profile contains errors. Fix them; do not carry them onto the site.** The full register is in `research/data-extraction.md` §5 — "RESINDENTIAL", "FANSTATIC HECTARES", "STRAIT" for Straits, "YANAHA" for Yamaha, "BUNGLAOW", "SESEBUIAH", "PRECINT", "STRUCTION", the RM4,800,00.00 typo on p.39, and the detail pages headed "RESIDENTIAL" over warehouse projects.
- **WhatsApp is the primary contact channel in this market.** A `wa.me` click-to-chat link with a pre-filled message is at least as prominent as the form, and sticky on mobile.
- Aggregate figures are safe and persuasive even when individual values are hidden. Lead with those.

## 6. Brand and design

**The logo is a plain wordmark: GLC in Archivo Bold with a cyan rule, and lockups that
pair it with the registered company name.** A pictorial mark (a portal frame on the ground)
was drawn and then withdrawn at the client's request; do not reinstate it without being
asked. Generated by `tools/make_logo.py` into `src/brand/`, served at `/assets/brand/`,
letterforms converted to real Archivo outlines so printers need no font installed.

**The logo is original artwork but is NOT trade-mark cleared, and must not be described as
cleared.** MyIPO was unreachable from this environment, and a database lookup would not be
a clearance opinion anyway. `docs/logo-and-trademark.md` holds the full position and the
steps the client must take. **Always keep the registered company name beside the initials**:
in Malaysia "GLC" is the standard shorthand for a government-linked company, and one of this
site's three audiences is government procurement. The lockups do this; the initials alone,
with no name, are what to avoid.

Fonts are **self-hosted** from `src/fonts/` (Archivo, IBM Plex Mono, both SIL OFL). There is
no Google Fonts request and the CSP in `netlify.toml` forbids one. Do not reintroduce it.

Live tokens are in `src/site.css`; the original reasoning is in `research/design-plan.md`.
The palette changed when the client asked for company colours, and the source matters:
**there is no logo anywhere in the company deck** — the image on page 2 is a director's
signature. The only brand artefact is the deck cover, a five-colour photo collage whose
dominant block samples at **#00A0E0**. That cyan is the company's de facto colour, so it
is the brand colour. Bright cyan is illegible as text on light, so it lives on the navy
bands; a deepened version of the same hue carries links and buttons on light. The navy
is sampled from the blue steel cladding on the company's own warehouses.

Tokens, contrast computed not estimated. Light: `--ground #EDEFF1`, `--raise #F7F8F9`,
`--ink #12171C` (15.64:1), `--ink-2 #4B535B` (6.78:1), `--rule #C7CCD1` (1.40:1,
decorative only), `--rule-strong #7F878E` (3.16:1), `--navy #14212F`, `--brand #00A0E0`
(5.51:1 on navy), `--brand-ink #0A6485` (5.74:1 on ground, white on it 6.62:1). Dark is a
designed night set, not an inversion, and every pair clears AA.

Typography and structure are unchanged: Archivo with IBM Plex Mono in the data role, a
1.25 scale on a 17px body, everything left-aligned, hairline section rules, no entrance
animations. The cover's other four hues (green, yellow, purple, red) are deliberately
unused: five saturated hues would fight the photographs, which are the evidence.

Do not use: warm cream with a serif display and a terracotta accent; near-black with an acid accent; identical rounded cards with soft grey shadows; tracked-out all-caps eyebrows above every heading; 01/02/03 markers on things that are not sequences; meta strings joined with middle dots; an arrow on every link; one word of a headline in a different colour; fade-and-slide-up on every section; hover lift on every card; stock hero video; stock service icons. These are the brief's anti-brief and they are defaults, not choices.

**Photographs are used at their real size and never upscaled beyond 1.5×.** Only two of the 75 photographs in the profile exceed 900px wide, so there is no full-bleed photographic hero. A project with no usable photograph gets a monospaced planning-title block on a dark ground, never a grey placeholder. See `research/photo-audit.md`.

Quality floor, built without announcing it: responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected, WCAG AA contrast verified with a tool, no layout shift.

## 7. Stack — a deliberate departure from the brief

The brief proposes Astro. **The site is built by `build.py`, a single Python generator,
and Astro is not used.** The reason is launch reliability: Astro 7 and TypeScript 7 are
both newer than my training data and `docs.astro.build` is blocked from this environment,
so an Astro config would have been written blind and could fail the Netlify build. A
pre-generated static site cannot fail for a toolchain reason, needs no build command, and
can be dragged into Netlify by hand. `research/stack-decision.md` still records the Astro
plan; migrating later is a contained job because the content already lives in one JSON
file and the CSS is framework-free.

What the generator produces: 79 pages with clean URLs, one per project plus facet pages
for every scope, sector, state and status (good for "steel structure subcontractor
Selangor" style queries), unique title and meta description per page, canonical URLs,
Open Graph tags, a generated OG card, `schema.org` GeneralContractor and Project markup,
`sitemap.xml` and `robots.txt`. Zero JavaScript except ~15 lines for the mobile menu;
filtering is real links, not script. Netlify Forms handles the enquiry form with a
honeypot, posting to `/thanks/`.

**The privacy rules are enforced in code.** `build.py` cuts the address tail from every
residential planning title, never emits a private client's name or a contract value, and
ends with a gate that fails the build if a private name, an IC number, a residential
address, a contract value, a CIDB tender ceiling or an ISO/QLASSIC/SHASSIC claim reaches
any page. Do not weaken that gate.

## 8. How to work

- **Phase 0** — research and plan. Done, awaiting review.
- **Phase 1** — skeleton: Astro project, tokens, layout primitives, content schema, all project data in, routing, i18n scaffolding. Navigable, minimally styled.
- **Phase 2** — design build: Home, About, Capabilities, Credentials, Contact to final quality, plus one project page as the template.
- **Phase 3** — projects at scale: full index with filtering, all project pages, image pipeline, per-project photo gap list.
- **Phase 4** — polish and ship: SEO, structured data, forms, Lighthouse, cross-browser and mobile, accessibility pass, deploy, README, handover.

Stop at the end of each phase and show the result. Small commits; the site must open in a browser after every one. Ask rather than guess.

Report Lighthouse scores from an actual run. Never claim them.

## 9. Files

```
build.py                                   generates site/ from the JSON — run this
tools/make_logo.py                         the GLC wordmark suite
tools/make_preview.py                      single-file bundle of site/ for review
docs/logo-and-trademark.md                 the logo, and what is NOT cleared
netlify.toml                               publish glc-website/site, no build command
DEPLOY.md                                  how to launch, for a non-developer
src/site.css                               the live stylesheet and tokens
src/photos/                                the 36 approved, cropped photographs
site/                                      generated output — do not hand-edit
docs/brief.md                              the build brief, verbatim
CLAUDE.md                                  this file
research/positioning-and-sitemap.md        positioning, audiences, sitemap
research/design-plan.md                    Pass 1 design plan, tokens, wireframes
research/data-extraction.md                aggregates, attribution, discrepancy register
research/photo-audit.md                    all 75 photographs, defects, reshoot list
research/credentials-verification.md       what may be published, what is unverified
research/privacy-and-disclosure.md         brief §11 decisions for the family
research/reference-audit.md                BLOCKED — network egress; method to finish it
research/stack-decision.md                 stack, versions, schema privacy rules
research/source/profile-extract.md         the profile PDF as clean text
content/projects.extracted.json            47 project records, machine-readable
content/open-questions.md                  everything unconfirmed
content/templates/client-permission-request.md   bilingual permission email
```
