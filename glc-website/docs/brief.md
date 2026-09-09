# Build brief — Global Land Consortium Sdn Bhd website

You are building a new marketing website for a Malaysian building contractor. Read this whole brief before writing any code. Do not start coding at Phase 1 until you have completed Phase 0 and I have answered the questions in section 14.

---

## 0. How to work

1. **Phase 0 first.** Study the reference sites (section 3), read the company profile PDF I've given you, and come back with: a positioning summary, a proposed sitemap, a design plan, and the questions from section 14. Do not write production code before I approve these.
2. **Write a `CLAUDE.md`** in the project root early, capturing the company facts, brand tokens, content rules, and the "never invent" list from section 10, so context survives across sessions.
3. **Ask rather than guess.** Where a fact about the business is missing, put `TODO(verify): …` in the content file and list it in an open-questions file. Never fill a gap with plausible-sounding filler. A contractor's website that overstates credentials is a legal and commercial problem, not a copywriting one.
4. **Small commits, working site at every step.** I want to be able to open the site in a browser after every phase.

---

## 1. Ground truth: the company

Treat the attached company profile PDF as the source of truth for facts. Extract these exactly; do not paraphrase numbers, registration codes, or dates.

**Identity**
- Legal name: Global Land Consortium Sdn Bhd
- Company registration no: 1089230-X
- Incorporated: 24 February 2015, in Malaysia
- Registered office (per profile): No. 13, Faber Tower, Jalan Desa Jaya, Taman Desa, 58100 Kuala Lumpur
- Tel: +603-7972 9516 · Fax: +603-7972 9615
- Email on file: infoglcsb99@gmail.com

**People**
- Chairman: YAB Dato' Ahmad Fathiri Bin Ahmad Fadzlah — MBA (Professional Master in Administration), Universiti Teknologi Malaysia; in construction and project management since 2003
- Executive Director / shareholder: Mr Goh Nai Koon — in the construction industry since 1987
- Project Director / shareholder: Mr Yip Chee Tack — Quantity Surveyor; in the industry since 1998
- Technical staff: 2 site supervisors, 1 senior quantity surveyor

**Credentials — the most commercially valuable content on the site**
- CIDB registration no. 0120181011-WP018050, first registered 11/10/2018
- CIDB Grade **G6** in three categories: **B** (Pembinaan Bangunan), **CE** (Pembinaan Kejuruteraan Awam), **ME** (Mekanikal dan Elektrikal)
- Sijil Perolehan Kerja Kerajaan (government works certificate) — valid 12/09/2025 to 14/09/2028
- CIDB **SCORE: 3 stars**, for year 2025, valid until 09/06/2027 (certificate ref SC150741)
- Ministry of Finance (Kementerian Kewangan Malaysia) registration — certificate no. K98463596913999914, reference 357-0002411991, valid 01/11/2024 to 31/10/2027; registered fields: 090101 and 090102 (construction materials / pipes and fittings) and 221401 (building beautification / interior decoration services)
- Banker: Public Bank Berhad, Taman Desa branch

Look up and state correctly what a CIDB G6 grade permits (tender ceiling) and what a 3-star SCORE rating signifies, citing CIDB's own current published source. Do not assert a tender limit from memory — verify it, and if you can't verify it, leave it out rather than guess.

**Track record (verify every figure against the PDF as you extract it)**
- 3 current projects, roughly RM10.3 million combined: a RM7,139,227.26 single-storey warehouse structural subcontract in Petaling Jaya (client CK Building Solutions Sdn Bhd); a RM1,125,000 three-storey factory warehouse renovation in Skudai, Johor (Sorento Sdn Bhd); a RM2,021,451.40 demolish-and-rebuild two-storey house in USJ, Subang Jaya (private client)
- 22 completed projects listed under the company, roughly RM66.7 million combined, from 2012 to 2024
- An additional ~20 earlier reference projects, 2002–2014
- Sectors actually delivered: detached houses and bungalows, terrace/semi-detached renovation and rebuild, warehouses and factories, a supermarket, shoplots and a business centre, two school buildings, an international school fit-out, retail outlet fit-outs across six shopping malls, an office building, and a Chinese temple
- Named corporate clients that can plausibly be cited: Sentoria Bina Sdn Bhd, Yip Fook Weng Construction Sdn Bhd, Excel Multimedia Sdn Bhd, Shinju Pearls (M) Sdn Bhd, KK Straits International Education Sdn Bhd, PC Straits International Education Sdn Bhd, NX Transport Services (M) Sdn Bhd, Fantastic Hectares Sdn Bhd, PSM Home Centre Sdn Bhd, Sorento Sdn Bhd, CK Building Solutions Sdn Bhd, Country Heights Sdn Bhd, Yeow Yoon Construction Sdn Bhd
- Retail fit-out locations: Pavilion KL, Mid Valley Megamall, Bangsar Shopping Centre, Bangsar Village, Gateway@KLIA2, Paradigm Mall

Recompute both aggregate values yourself from the extracted data and tell me if you get different numbers than the ones above. Flag any discrepancy rather than silently adopting one figure.

---

## 2. Positioning: which references to copy, and which not to

This is the single most important judgement in the project, so get it right before you design anything.

Gamuda, IJM, SunCon, UEM and Kerjaya Prospek are Bursa-listed groups with order books in the billions. Their websites are built for **investors, analysts and regulators**: quarterly results, annual reports, ESG and sustainability frameworks, board governance, Bursa announcements, corporate structure charts, careers at scale. If you copy that architecture onto a G6 contractor with a RM10 million order book, the site will read as pretense and will actively cost credibility with the people GLC needs.

TCS Group is also listed, but it is closer to GLC's actual line of work and shows one pattern worth stealing outright: it publishes **QLASSIC and SHASSIC assessment scores per project in a plain table**. Independently-scored, verifiable quality and safety evidence, stated without adjectives. That is exactly the right instinct for a contractor. If GLC has any QLASSIC/SHASSIC/ISO results, they belong on the site the same way. If it doesn't, do not fabricate an equivalent.

GT Max Construction is the closest structural analogue: a private Selangor-based Sdn Bhd, site organised around services, credentials, client logos, completed vs work-in-progress projects, and a single clear enquiry path. Its weaknesses are also instructive — thin copy, duplicated sections, stock service icons, a 2020 copyright line, and no real project detail. Beat it on substance.

**So: borrow visual and structural discipline from the big groups, and information architecture from GT Max and TCS. The site's job is to win tenders and referrals, not to impress shareholders.**

Three audiences, in priority order:
1. **Private and corporate clients** — a factory owner needing a warehouse, a developer needing a subcontractor, a family building a bungalow. They want to see similar completed work and be reassured the company won't collapse mid-project.
2. **Main contractors and consultants** looking for a G6 subcontractor for RC structure, steel structure, or fit-out packages.
3. **Government and GLC procurement officers** checking MOF and CIDB credentials against a tender submission.

Every page should be answerable to: *does this help one of those three decide to call?*

---

## 3. Reference study assignment (Phase 0)

Fetch and study these. For each, write me 3–5 lines: what its information architecture is, who it's clearly built for, one thing worth taking, one thing to avoid.

- https://gamuda.com.my
- https://www.ijm.com
- https://www.sunwayconstruction.com.my
- https://www.kerjayaprospek.com.my
- https://www.uem.com.my
- https://gt-maxconstruction.com.my
- https://tcsgroup.com.my

Then look at 3–4 more mid-size Malaysian G6/G7 building contractors you find yourself, so the comparison set isn't all listed companies. Note specifically how each handles: the projects list, credentials display, and the enquiry call-to-action.

Deliver this as `research/reference-audit.md`.

---

## 4. Content model

Projects are the product. Build them as structured data, not hand-written pages — I need to add a project a year from now without touching layout code.

One record per project:

```
slug
title_en                  # plain English, client-facing
title_original            # the Bahasa Malaysia planning-approval title, verbatim
sector                    # residential | industrial | institutional | retail | commercial | religious
scope[]                   # main contract | RC structure | steel structure & roofing | renovation & A&A | fit-out | demolition & rebuild | earthworks
location                  # e.g. "Kota Damansara, Selangor"
state                      # for filtering
client                    # see section 11 before publishing this
contract_value_myr        # numeric; see section 11 before publishing this
start                     # YYYY-MM
completion                # YYYY-MM
status                    # current | completed | reference
is_subcontract            # boolean
attributed_to             # company | directors_prior_experience   <- see section 10
images[]                  # path, alt, caption, credit
summary                   # 2–3 sentences, written by me or approved by me
```

Notes:
- Keep `title_original` visible somewhere on each project page. A Malaysian consultant or council officer recognises "Cadangan membina sebuah rumah banglo 3 tingkat…" instantly; translating it away loses credibility with exactly the audience that matters.
- `scope` matters more than sector for subcontract enquiries. Someone looking for a steel structure subcontractor should be able to filter to it in one click.
- Derive all statistics (project counts, total value, years active, sector mix) from this data at build time. No hard-coded numbers anywhere in the templates.

---

## 5. Sitemap

Keep it small. Every page must justify itself.

- **Home** — what the company does, in one sentence, above the fold; credentials strip (CIDB G6 B/CE/ME, MOF, SCORE 3-star); 3–4 featured projects; sectors served; enquiry CTA.
- **About** — incorporated 2015, the directors' combined experience, how the company actually works (in-house supervision + a long-standing subcontractor and supplier network, some relationships running to 2004). Name the leadership. No mission-statement boilerplate unless the family writes it themselves.
- **Capabilities** — one page, anchored sections per scope: main contract building works, RC structure, steel structure and roofing, renovation and A&A, interior fit-out, mechanical & electrical. Each section: what it involves, 2–3 real examples linked to project pages, relevant CIDB category.
- **Projects** — filterable index (sector, scope, state, status). Cards, not a wall of text.
- **Projects/[slug]** — one page per project. Photos, the structured facts, `title_original`, scope delivered, and what was actually difficult about it if the family can tell you.
- **Credentials** — CIDB, MOF, SCORE, bank reference, plant and equipment, subcontractor and supplier network. This page exists so a procurement officer can verify GLC in 30 seconds. Include downloadable PDFs of the certificates **only if the family confirms they're happy to publish them** — certificate scans contain IC numbers (both directors' IC numbers appear in the profile) which must be redacted first.
- **Contact** — address, map, phone, WhatsApp, email, a short enquiry form.
- Optional later: **News/Updates**. Only build it if the family will actually post. An empty or stale news page is worse than none — see GT Max's 2020 copyright notice.

Explicitly **not** building: investor relations, ESG framework, sustainability report, board charter, awards page (unless there are awards), careers portal (a single "we're hiring — email us" line on About is enough).

---

## 6. Design brief

Work in two passes: propose a design plan, let me react, then build.

**Pass 1 — plan.** Give me a compact token system: 4–6 named hex values, the typefaces and their roles, a layout concept with ASCII wireframes for home and project-detail, alignment guidance, and 3–4 principles specific to *this* company.

Ground the visual language in the material vocabulary of the work GLC actually does — reinforced concrete, steel roof trusses, formwork, cement render, site hoarding, Klang Valley light — not in generic "construction industry" signifiers. The company's real character is a small team doing careful supervised work on someone else's biggest asset. That should feel present.

**Anti-brief.** These are defaults, not choices, and they will make the site look machine-made. Avoid unless you can argue specifically why this brief needs one:
- Warm cream background with high-contrast serif display and a terracotta accent
- Near-black background with a single acid-green or vermilion accent
- Everything chopped into identical rounded cards with the same soft grey shadow
- Tracked-out ALL-CAPS eyebrow labels above every heading
- Numbered markers (01 / 02 / 03) on content that isn't a sequence
- Meta strings joined with middle dots
- An arrow appended to every link and button label
- Accenting one word of a headline in a different colour or weight
- Fade-and-slide-up entrance animation on every section, hover lift on every card
- Stock hero video of an unrelated skyscraper, and stock icons for services

Spend boldness in one place; keep everything else quiet. Typography carries the personality — pick one or two families deliberately, set a real type scale, keep body line length under 80 characters.

**Photography is the hard constraint.** The profile's photos are inconsistent: some good, several with visible phone timestamp overlays and "Timemark camera" watermarks, one with a "Hello I'm here Tuesday 24°C" weather widget burned in, one with a "2016 Happy New Year" sticker. Design a layout that works with a *small number* of genuinely good photographs rather than one that demands 60 polished images. Tell me which projects need a photo reshoot; the family can send someone to photograph completed buildings. Never substitute stock imagery for a project photo.

Quality floor, built without announcing it: responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected, WCAG AA contrast, no layout shift.

---

## 7. Tech stack

Unless you can make a better case in Phase 0, use:

- **Astro** with content collections for the project data (Markdown/MDX front matter, schema-validated with Zod). Static output, near-zero JS, trivial to host, and a non-technical family member can add a project by copying a file.
- **Tailwind** with a project-specific token config — not out-of-the-box defaults.
- Images through Astro's image pipeline: AVIF/WebP, correct dimensions, lazy loading below the fold.
- Forms: a hosted endpoint (Netlify Forms, Formspree or similar) plus spam protection. No backend, no database.
- Hosting: Netlify or Cloudflare Pages, deploy from Git.

Do not reach for a CMS, Next.js with a server runtime, or a headless-anything. The content changes a few times a year.

Set up: TypeScript strict, ESLint + Prettier, a `pnpm dev` / `pnpm build` / `pnpm preview` script set, and a README a non-developer can follow to add a project and publish it.

---

## 8. Malaysian market specifics

- **Bilingual EN + BM.** English primary. Build i18n routing in from the start even if BM content lands later; retrofitting is painful. `title_original` already gives you real BM content for every project.
- **WhatsApp is the primary contact channel** for this market. A `wa.me` click-to-chat button with a pre-filled message should be at least as prominent as the form, and sticky on mobile.
- Phone numbers as `tel:` links in +60 international format.
- **Google Business Profile** — set it up and match the NAP (name, address, phone) exactly to the site footer. This matters more for inbound leads than anything on the site itself.
- Currency as `RM` with thousands separators, consistently.
- Dates as `Month YYYY`, not the mixed `MAC 2012` / `MARCH 2013` / `Feb 2017` styles in the profile.
- Keep the Malay planning-approval terminology (`cadangan`, `tambahan dan pindaan`, `banglo`, `gudang`, `mukim`, `daerah`) intact where it appears — it's searchable vocabulary for the professional audience.

---

## 9. SEO, performance, accessibility

- Target queries: contractor + scope + place. "kontraktor bina rumah banglo Selangor", "warehouse construction contractor Selangor", "G6 contractor Kuala Lumpur", "renovation contractor Petaling Jaya", "steel structure subcontractor Klang Valley". Build the capabilities and project pages so they answer these naturally; no keyword stuffing.
- `schema.org` structured data: `GeneralContractor` (with `areaServed`, `hasCredential`) on the org, and per-project markup. Validate it.
- Unique title and meta description per page, generated from the content data.
- `sitemap.xml`, `robots.txt`, canonical URLs, OpenGraph images.
- Lighthouse: 95+ on performance, accessibility, best practices, SEO on both mobile and desktop. Report the actual scores; don't claim them.
- Test on a throttled 3G mobile profile. A lot of this audience will open the site on a phone on a site visit.

---

## 10. Content hygiene: fix, verify, never invent

**The profile PDF contains errors. Fix these; do not carry them onto the website.**

| Where | Issue |
|---|---|
| Multiple slide headers | "RESINDENTIAL" → "Residential" |
| Current projects, pp. 19–20 | Headed "RESIDENTIAL PROJECT" but both are warehouse/factory works |
| p. 20 | Client shown as Sorento Sdn Bhd; the table on p. 13 says CK Building Solutions Sdn Bhd for the same project — confirm which |
| p. 5 | "the past twenty four (25) years" — internally inconsistent |
| p. 39 | "RM 4,800,00.00" — should be RM 4,800,000.00 |
| pp. 17, 42 | "FANSTATIC HECTARES" vs "FANTASTIC HECTARES" |
| p. 3 | "OTHERS REFRENCE PROJECTS" → "Other reference projects" |
| p. 11 | Sub-contractor list numbering: two rows numbered 6, sequence out of order |
| p. 37 | Headed "SCHOOL PROJECT" but the project is a warehouse at Lot 623, Pekan Kuang; client "MR ANG TAI SOON" vs "MR ONG TAI SOON" in the table |
| p. 22 | Headed "RESIDENTIAL BUNGALOW" but the project is a two-terrace-house renovation |
| p. 64 | Project detail text is copy-pasted from the Kajang bungalow on p. 59 — location and client don't match the description. The real scope for the Taman Yarl project is unknown; mark `TODO(verify)` |
| pp. 39, 12 | "STRAIT" vs "STRAITS" International School; "YANAHA" → Yamaha |
| Various | "BUNGLAOW", "SESEBUIAH", "MEROBOH" inconsistencies, "PRECINT" → "Precinct", "STRUCTION" → "Construction" |
| Registered address | Three different addresses appear across the profile and the certificates: No. 13 Faber Tower / 13D Fabe Plaza (MOF cert) / 25-1 Jalan Maharajalela (CIDB cert). Ask which is current before publishing any of them |

**Attribution — get this right.** The company was incorporated in **February 2015**, but the "completed projects" list includes work from 2012 and 2014, and the "other reference projects" section runs back to 2002. Those earlier projects are the **directors' personal track record**, not the company's. Do not present them as GLC's own delivery history. Use the `attributed_to` field and label them honestly — something like "Delivered by our directors prior to the incorporation of Global Land Consortium." Handled well, this is a strength: it shows nearly 40 years of continuous experience. Handled sloppily, it's a misrepresentation a competitor or a procurement officer could raise.

**Never invent:**
- ISO certifications. GT Max and TCS both advertise ISO 9001 / 14001 / 45001. There is no evidence GLC holds any. Do not imply, imitate, or gesture at them.
- Awards, QLASSIC or SHASSIC scores, safety records, headcount, "years of experience" figures, project counts, or turnover.
- Client testimonials, logos, or quotes.
- Project photos. Every image must be of the project it's attached to.
- Vision and mission statements. Leave a placeholder and ask the family to write them.

Anything the family hasn't confirmed goes in `content/open-questions.md`, not on a page.

---

## 11. Privacy and disclosure — read before publishing any project

This matters and it's easy to get wrong. **The company profile is a confidential tender document. The website is public.** Those are different disclosure contexts, and the profile's contents cannot simply be transplanted.

Specifically, the profile pairs, for private residential clients, a **named individual** with **their home address down to the lot number** and **what they paid**. Publishing that on an indexed public website is a serious problem — for the clients, and for GLC's reputation with future private clients who will assume the same will happen to them.

Default rules, unless the family instructs otherwise in writing:

1. **Private individual clients: do not name.** Use "private client" and generalise the location to the neighbourhood ("Kota Damansara, Selangor"), never the lot or house number.
2. **Corporate and institutional clients: name only with permission.** Sentoria, Shinju Pearls, the schools and so on are reasonable asks — but they're asks. Prepare a short permission-request email template the family can send.
3. **Contract values: ask before publishing any of them, individually.** There's a real argument for publishing values on corporate projects (it demonstrates capacity) and a real argument against on private homes. Build the data model so each project can have its value shown or hidden independently, and default to hidden.
4. **Redact IC numbers.** Both directors' IC numbers appear on the CIDB and MOF certificates in the profile. If certificate scans go on the site, redact them first.
5. Aggregate figures ("RM66.7 million delivered across 22 projects") are safe and persuasive even when individual values are hidden. Lead with those.
6. Strip EXIF/GPS data from all uploaded photographs.
7. Add a plain-language privacy notice covering the enquiry form, and check what Malaysia's PDPA requires of it.

Surface this section to me explicitly in Phase 0. I need to make these calls with the family before you publish anything.

---

## 12. Phases

- **Phase 0 — Research and plan.** Reference audit, positioning summary, sitemap, design plan, extracted project data with discrepancies flagged, open-questions list, and the section 11 decisions surfaced. No production code.
- **Phase 1 — Skeleton.** Astro project, tokens, layout primitives, content collection schema, all project data in, routing, i18n scaffolding. Unstyled or minimally styled but navigable.
- **Phase 2 — Design build.** Home, About, Capabilities, Credentials, Contact to final quality. One project detail page as the template.
- **Phase 3 — Projects at scale.** Full index with filtering, all project pages, image pipeline, per-project photo gap list.
- **Phase 4 — Polish and ship.** SEO, structured data, forms, Lighthouse, cross-browser and mobile testing, accessibility pass, deploy, README, handover notes.

Stop at the end of each phase and show me the result.

---

## 13. Acceptance criteria

- Every fact on the site traces to the profile PDF, a verified external source, or an explicit family confirmation. No exceptions.
- No invented credential, award, certification, score, testimonial, or statistic anywhere.
- No private individual named, and no residential address more precise than the neighbourhood.
- All headline statistics computed from the project data at build time, not hard-coded.
- A non-developer can add a project and deploy it by following the README.
- Lighthouse 95+ across all four categories, mobile and desktop, with the real report attached.
- Keyboard-navigable throughout; visible focus states; AA contrast verified with a tool, not by eye.
- Works on a phone on a slow connection.
- Site does not look like it came from a template or from a generative model. If you can't tell, it does — revise.

---

## 14. Ask me these before you start

Compile your own list too, but at minimum:

1. Which of the three addresses is the current registered office and correspondence address?
2. Is there an existing logo, brand colour or letterhead? Or does the site need to establish the visual identity from scratch?
3. Domain name — is one registered? Is a proper `@domain` email address wanted in place of the Gmail one?
4. Do we publish contract values? On all projects, corporate only, or none?
5. Which clients can be named? Has anyone been asked?
6. Are the CIDB, MOF and SCORE certificates OK to publish as downloadable PDFs, with IC numbers redacted?
7. Does GLC hold any ISO certification, QLASSIC or SHASSIC assessment, or safety record worth publishing?
8. Are there better photographs than the ones in the profile? Can someone photograph the completed buildings?
9. Is a Bahasa Malaysia version needed at launch, or later?
10. Who maintains the site afterwards, and how technical are they?
11. Is a news or updates section realistic — will anyone post to it?
12. What does a good enquiry look like? What should the form ask so the family can qualify a lead without three rounds of email?
13. Vision and mission — will the family write these, or should the site do without them?
