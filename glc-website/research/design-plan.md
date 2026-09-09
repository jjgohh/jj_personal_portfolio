# Design plan — Pass 1, for reaction before anything is built

React to section 8 first. Everything else follows from those six decisions.

## 1. The concept

A contractor sets out from a **datum**: one level line, struck once on the formwork, that every dimension afterwards refers to. It is the most characteristic mark of careful supervised building work, and it is the opposite of decoration — it exists only so that everything else lands where it should.

So: one hairline rule, full width, repeated as the only structural device on every page. Section labels sit above it, content hangs below it. No cards floating in space, no boxes with shadows, no panels. Just a stack of measured bands, left-aligned to a single edge.

**The boldness is spent in exactly one place: the size of the plain-English sentence at the top of each page.** 65px on the homepage, 52px on a project. Everything else on the site is 17px body text, 13px monospaced data, and hairlines. There is no accent colour in the interface at all.

That last decision is deliberate and it is the plan's main argument. The photographs already supply every warm colour this company owns — laterite cut-earth, ochre render, blue-painted steel portal frames, the pale hazy Klang Valley sky. If the interface adds a hue on top of that, it competes with the only evidence on the page. So the interface is cured-concrete grey and near-black, and the buildings are the only colour. A site with no accent colour also cannot look like a template, because every template has one.

## 2. Tokens

Six colours. Ratios below are computed with the WCAG 2.x relative-luminance formula, not estimated.

| Token | Hex | Role |
|---|---|---|
| `--ground` | `#ECEDE9` | Page background. Cured concrete: pale, cool, faintly green-grey. Not cream |
| `--raise` | `#F6F7F4` | The one lighter surface: table stripes, form fields, the planning-title box |
| `--ink` | `#16181A` | All primary text, and the focus ring on light ground |
| `--ink-2` | `#4C5152` | Secondary text: captions, meta, labels |
| `--rule` | `#C4C7BF` | Decorative hairlines and the datum rule |
| `--rule-strong` | `#82877F` | Any hairline that carries meaning: table borders, input borders |
| `--slab` | `#1E2422` | The dark band: enquiry block and footer |
| `--mark` | `#173F4D` | Links and interactive text on light ground. Galvanised steel in shade |
| `--mark-on-dark` | `#8CC7D6` | Links inside the dark slab |

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `ink` on `ground` — body text | **15.14:1** | 4.5 | pass |
| `ink` on `raise` — body on panels | **16.55:1** | 4.5 | pass |
| `ink-2` on `ground` — captions, meta | **6.85:1** | 4.5 | pass |
| `ink-2` on `raise` | **7.49:1** | 4.5 | pass |
| `mark` on `ground` — links | **9.63:1** | 4.5 | pass |
| `mark` on `raise` | **10.53:1** | 4.5 | pass |
| `ground` on `slab` — text in the dark band | **13.42:1** | 4.5 | pass |
| `mark-on-dark` on `slab` — links in the dark band | **8.46:1** | 4.5 | pass |
| `rule-strong` on `ground` — meaningful borders | **3.12:1** | 3.0 | pass |
| `rule-strong` on `raise` | **3.41:1** | 3.0 | pass |
| `ink` on `rule` — text on a filled hairline | **10.40:1** | 4.5 | pass |

`--rule` at `#C4C7BF` is 1.46:1 against `--ground` and is therefore used **only** for the decorative datum line and never for a border that a reader has to perceive to understand the content. Anything structural uses `--rule-strong`, which clears 3:1. This is the one place the token system deliberately splits a colour in two, and it is why.

**Focus.** `outline: 2px solid var(--ink); outline-offset: 2px` on light ground (15.14:1 against the page), inverting to `var(--ground)` inside the dark slab (13.42:1). A single-colour ring in `--mark` would only manage 1.57:1 against `--ink` where a focused link sits next to body text, so the ring is ink, not mark.

## 3. Typography

**Archivo** (variable, SIL Open Font License, self-hosted as woff2) for everything. Weight axis 400–700, width axis 75–100. One family, and the width axis is the reason: the Malay planning-approval titles are 200-character uppercase strings, and Archivo's narrow widths set them at a readable size without a second typeface. Archivo is a grotesque drawn in the American gothic tradition — it belongs on a signboard and a drawing title block, which is exactly right here, and it is not one of the two or three faces that currently signal machine-made websites.

**IBM Plex Mono** (400 only, OFL, self-hosted) in one role and no other: registration numbers, certificate references, dates in tables, contract values, and the planning-approval titles. Monospaced numerals mean a column of RM values aligns on the decimal without any CSS, and a certificate reference in mono reads as a thing to be checked rather than a thing to be admired.

Two families, four files: Archivo variable (roman), Archivo variable (roman, narrow instance if the variable font is not used), Plex Mono 400, and nothing else. Subset to Latin. `font-display: swap` with a metric-compatible system fallback stack so there is no layout shift.

Type scale: a 1.25 modular scale anchored on a 17px body. 17px, not 16px, because a meaningful part of this audience is reading on a phone, outdoors, in their fifties and sixties.

| Step | px | rem | Line height | Use |
|---|---|---|---|---|
| `s-1` | 13 | 0.8125 | 1.45 | Meta, captions, table cells, all mono data |
| `s0` | 17 | 1.0625 | 1.55 | Body |
| `s1` | 21 | 1.3125 | 1.45 | Lead paragraph, card titles |
| `s2` | 27 | 1.6875 | 1.28 | Sub-headings |
| `s3` | 33 | 2.0625 | 1.22 | Section headings, mobile |
| `s4` | 42 | 2.625 | 1.15 | Section headings desktop, page title mobile |
| `s5` | 52 | 3.25 | 1.08 | Project page title, desktop |
| `s6` | 65 | 4.0625 | 1.04 | The homepage statement. Used once on the whole site |

Body measure capped at **68ch**, which is about 578px at 17px Archivo — comfortably inside the brief's 80-character limit.

**Setting the Malay planning titles.** These are the credential the professional audience recognises instantly, and they are also 200 characters of unbroken capitals, which is a typographic problem. The treatment: IBM Plex Mono at 13px, `text-transform: none` so the profile's own capitals are preserved verbatim, letter-spacing at `0.01em`, line height 1.5, set inside a `--raise` box with a `--rule-strong` hairline, at a measure of 44ch, labelled **PLANNING-APPROVAL TITLE** above it in 13px Archivo. Monospaced, boxed and labelled, the string reads as a quoted document — which is what it is — rather than as shouting. It sits in the right-hand column of the project page's fact band, opposite the scope, where a consultant will find it in one glance and a private client can ignore it.

## 4. Layout

Twelve columns, 24px gutter, page margins 24 / 48 / 64px at mobile / tablet / desktop, maximum page width 1280px. Spacing scale on a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144.

**Alignment: everything hangs from the left edge of column 1.** No centred text anywhere on the site, including headings and the enquiry block. Prose occupies columns 1–7 of 12 so the measure is right and the right-hand third stays empty, which is what makes a text page look composed rather than stretched. Data tables and photo grids use the full twelve. The datum rule is full width inside the page margins.

**The datum rule.** `1px solid var(--rule)`, full width, at the top of every band. The band's label sits above it in 13px Archivo at weight 600, letter-spacing `0.06em`, in `--ink-2`. Content begins 32px below it. This is the only repeated ornament on the site and it costs one CSS rule.

**The credentials strip.** Not badges, not logos — GLC has no licence to reproduce the CIDB or MOF marks, and a badge implies an endorsement that a registration is not. Four cells divided by vertical `--rule-strong` hairlines, each with a 13px Archivo label above and the value in 13px Plex Mono below: `CIDB GRADE / G6 B CE ME`, `GOVERNMENT WORKS / to 14.09.2028`, `CIDB SCORE / ★★★ 2025, valid 09.06.2027`, `MINISTRY OF FINANCE / 357-0002411991, valid to 31.10.2027`. It appears once on the homepage and once at the head of the credentials page, and nowhere else. On mobile it stacks to two columns and then one, with horizontal hairlines.

**Project cards, with a photograph.** Photo at 4:3, `object-fit: cover`, native width never upscaled beyond 1.5× (the photo audit records the native pixel width of every image, and a card that would upscale further falls back to the data block below). Then the plain-English title at `s1`. Then a `--rule-strong` hairline. Then two lines of 13px Plex Mono: the scope, and the status with its date. Nothing else. No shadow, no border radius, no hover lift — the whole card is a link, and on hover and focus the title takes an underline and the photo drops to 92% brightness. That is the entire interaction.

**Project cards, without a photograph.** This is the plan's answer to the photo problem, and it should look like the better option rather than the fallback. In place of the image, a `--slab` block at the same 4:3 ratio carrying the project's own Malay planning title in `--ground` at 13px Plex Mono, wrapped, left-aligned, top-aligned, clipped with a soft fade at the bottom edge where it overflows. Below it, the same title / hairline / mono lines as any other card. It reads as a drawing title block, it is unmistakably specific to that one project, and it is the reason four unphotographed projects can sit in the same grid as twenty photographed ones without looking like gaps. There is no grey placeholder anywhere on this site.

**Attribution band.** Any project that pre-dates February 2015 carries, directly under its title on both the card and the page, a single line at 13px in `--ink-2` above a `--rule-strong` hairline: *Delivered by our directors before Global Land Consortium was incorporated in 2015.* Same wording every time, never abbreviated, never in a tooltip.

**Contact affordances.** Desktop: phone and WhatsApp in the header's right end, and a full-width `--slab` enquiry band above the footer on every page. Mobile (below 900px): a sticky bottom bar, 64px tall, two equal 48px-minimum targets — **WhatsApp** and **Call** — in `--slab` with `--ground` text, with `env(safe-area-inset-bottom)` padding. The WhatsApp link is a `wa.me` URL with a pre-filled message naming the page the reader came from, so the family can see which project prompted the enquiry. The form sits below on the contact page and is never the only route.

## 5. Wireframes

Home, desktop:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ GLOBAL LAND CONSORTIUM SDN BHD    Projects  Capabilities  Credentials     │
│ 1089230-X                         About  Contact     +603-7972 9516  ⌂WA  │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│                                                                            │
│  We build warehouses, factories, houses and                                │ s6/65px
│  shop interiors in the Klang Valley, and we                                │ cols 1-8
│  supervise every site ourselves.                                           │
│                                                                            │
│  A G6 building contractor registered with CIDB since 2018. Twenty          │ s1/21px
│  completed buildings since 2015. Three sites running now.                  │ cols 1-6
│                                                                            │
╞═══════════════╤═══════════════╤═══════════════╤═══════════════════════════╡ datum
│ CIDB GRADE    │ GOVERNMENT    │ CIDB SCORE    │ MINISTRY OF FINANCE       │ s-1 label
│ G6  B CE ME   │ WORKS         │ ★★★  2025     │ 357-0002411991            │ mono
│               │ to 14.09.2028 │ valid 09.06.27│ valid to 31.10.2027       │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ SELECTED WORK                                        All 23 projects →     │
│ ┌───────────────────────────┐  ┌───────────────────────────┐              │
│ │ ▀▀▀▀ photograph 4:3 ▀▀▀▀▀ │  │ ▀▀▀▀ photograph 4:3 ▀▀▀▀▀ │              │
│ │ Single-storey warehouse,  │  │ Four-storey school block, │  s1          │
│ │ Jalan Kilang, Petaling J. │  │ SJK(C) Kuang, Rawang      │              │
│ │ ───────────────────────── │  │ ───────────────────────── │  rule-strong │
│ │ RC + steel structure      │  │ Main contract             │  mono s-1    │
│ │ On site since Oct 2025    │  │ Completed Feb 2018        │              │
│ └───────────────────────────┘  └───────────────────────────┘              │
│ ┌───────────────────────────┐  ┌───────────────────────────┐              │
│ │ ███ CADANGAN MEMBINA ████ │  │ ▀▀▀▀ photograph 4:3 ▀▀▀▀▀ │  ← no-photo  │
│ │ ███ SEBUAH PEJABAT  █████ │  │                           │    variant   │
│ │ ███ URUSAN 1 TINGKAT ████ │  │ Supermarket,              │              │
│ │ ███ DI ATAS LOT 34534,░░░ │  │ Pekan Mantin              │              │
│ │ Office building, Balakong │  │ ───────────────────────── │              │
│ │ ───────────────────────── │  │ Main contract             │              │
│ │ Main contract             │  │ Completed Nov 2016        │              │
│ │ Completed Mar 2024        │  │                           │              │
│ └───────────────────────────┘  └───────────────────────────┘              │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ WHAT WE TAKE ON                                                            │
│ Main contract building works ····································· G6 B    │
│ RC structure ····················································· G6 B CE │
│ Steel structure and roofing ······································ G6 B    │
│ Renovation and A&A ··············································· G6 B    │
│ Interior fit-out ················································· G6 B    │
│ Mechanical and electrical ········································ G6 ME   │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ RM 61.3 million      20 buildings       3 sites now      Since 1987       │
│ completed by the     completed          RM 10.3 m        our directors'   │
│ company, 2015–2024   2015–2024          on site          first year       │
╞═══════════════════════════════════════════════════════════════════════════╡
│ ███████████████████████████ slab █████████████████████████████████████████│
│ ██ Tell us what you are building.                                       ██│
│ ██ [ WhatsApp +60… ]   [ Call +603-7972 9516 ]   or send the form →      ██│
│ ███████████████████████████████████████████████████████████████████████████│
│ Global Land Consortium Sdn Bhd (1089230-X) · address · tel · email        │
│ CIDB 0120181011-WP018050 · MOF 357-0002411991      Privacy · Bahasa M.    │
└───────────────────────────────────────────────────────────────────────────┘
```

Home, mobile (375px):

```
┌─────────────────────────────┐
│ GLC SDN BHD          ☰      │
╞═════════════════════════════╡ datum
│ We build warehouses,        │  s4/42px
│ factories, houses and       │
│ shop interiors in the       │
│ Klang Valley, and we        │
│ supervise every site        │
│ ourselves.                  │
│                             │
│ A G6 building contractor    │  s0/17px
│ registered with CIDB since  │
│ 2018. Twenty completed      │
│ buildings since 2015.       │
╞══════════════╤══════════════╡ datum
│ CIDB GRADE   │ GOVT WORKS   │
│ G6 B CE ME   │ to 14.09.28  │
├──────────────┼──────────────┤
│ CIDB SCORE   │ MOF          │
│ ★★★ 2025     │ 357-0002…    │
╞═════════════════════════════╡ datum
│ SELECTED WORK               │
│ ┌─────────────────────────┐ │
│ │ ▀▀▀ photograph 4:3 ▀▀▀▀ │ │
│ │ Single-storey warehouse │ │
│ │ ─────────────────────── │ │
│ │ RC + steel structure    │ │
│ │ On site since Oct 2025  │ │
│ └─────────────────────────┘ │
│         (one per row)       │
╞═════════════════════════════╡
│ … scopes, figures, footer   │
├─────────────────────────────┤
│ ███ WhatsApp ███│███ Call ███│ ← sticky, 64px, 48px targets
└─────────────────────────────┘
```

Project detail, desktop:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ header                                                                     │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ Projects / Industrial                                                      │ s-1
│                                                                            │
│ Single-storey warehouse,                                                   │ s5/52px
│ Jalan Kilang, Petaling Jaya                                                │ cols 1-8
│                                                                            │
│ Structural sub-contract for a design-and-construct warehouse.              │ s1
│ On site since October 2025.                                                │ cols 1-6
╞════════════════════════════════════╤══════════════════════════════════════╡ datum
│ OUR SCOPE            cols 1-5      │ PLANNING-APPROVAL TITLE   cols 7-12  │
│   RC structure                     │ ┌──────────────────────────────────┐ │
│   Steel structure and roofing      │ │ DESIGN CONSTRUCT PROPOSED SINGLE │ │ mono
│ ───────────────────────            │ │ STOREY WAREHOUSE AT LOT 95, HM   │ │ 13px
│ ROLE                               │ │ 5613, JALAN KILANG 51/205, 46050 │ │ raise
│   Sub-contractor                   │ │ PETALING JAYA, SELANGOR DARUL    │ │ +rule
│ ───────────────────────            │ │ EHSAN FOR MESSRS RENNES          │ │ 44ch
│ SECTOR        Industrial           │ │ PROPERTIES SDN BHD – SUB         │ │
│ LOCATION      Section 51,          │ │ CONTRACT STRUCTURE WORKS         │ │
│               Petaling Jaya        │ └──────────────────────────────────┘ │
│ PERIOD        Oct 2025 – Aug 2026  │ As submitted for planning approval.  │ s-1
│ CLIENT        Main contractor      │                                      │
│ VALUE         [only if approved]   │                                      │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ ▀▀▀▀▀▀▀▀ photograph, native width, never upscaled >1.5× ▀▀▀▀▀▀▀▀▀▀▀▀ │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│ Steel roof structure over the RC frame, looking along the length of the    │ s-1
│ building. Photographed on site, February 2026.                            │ ink-2
│                                                                            │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐          │
│ │ ▀▀▀▀▀▀ photograph ▀▀▀▀▀▀▀▀▀ │ │ ▀▀▀▀▀▀ photograph ▀▀▀▀▀▀▀▀▀ │          │
│ └─────────────────────────────┘ └─────────────────────────────┘          │
│ Caption.                        Caption.                                  │
╞═══════════════════════════════════════════════════════════════════════════╡ datum
│ SIMILAR WORK — same scope                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                                    │
╞═══════════════════════════════════════════════════════════════════════════╡
│ ██ enquiry slab ██ · footer                                                │
└───────────────────────────────────────────────────────────────────────────┘
```

Project detail, mobile: single column, in this order — breadcrumb, title at `s4`, lead, first photograph full width, the fact list as label-above-value pairs, the planning-title box, remaining photographs one per row with captions, similar work, sticky contact bar. **The photograph comes before the facts on mobile and after the facts on desktop.** On a phone the reader is deciding in two seconds whether this looks like their building; on a desktop they are reading.

## 6. Motion and accessibility

**There are no entrance animations.** Nothing fades, nothing slides up, nothing moves on scroll. The only transitions on the site are 120ms on `text-decoration-color`, `filter` and `outline-color` for hover and focus. This is a design decision, not an accessibility concession: a page of measured bands that assembles itself as you scroll is a page that looks unsure of its content. It also means `prefers-reduced-motion` has almost nothing to disable, which is the honest way to satisfy it — the media query is still present and switches the remaining transitions to `0ms`.

The rest of the floor, built without announcing it: visible 2px focus rings with 2px offset, in `--ink` on light and `--ground` on dark; every interactive target at least 48×48px on touch; skip link to main content; one `h1` per page and a heading order that never skips a level; the projects filter as real form controls that work without JavaScript by falling back to filtered URLs; every image with dimensions in the markup so nothing shifts; `lang` and `hreflang` correct on both locales, and `lang="ms"` on the Malay planning titles inside English pages so a screen reader pronounces them as Malay; tables with real `<th scope>`; the star rating rendered as text with an accessible name, not as three star glyphs alone.

## 7. Principles, specific to this company

1. **Evidence before adjectives.** Every claim is a number, a date, a registration or a building you can drive past. If a sentence cannot be checked, it does not go on the site. This is the rule the whole design serves, and it is why there are no badges, no icons and no accent colour: each of those is a way of asserting something without evidence.
2. **The building is the hero, and the company is not.** No photographs of people shaking hands, no hard hats on stock models, no aerial drone footage of a city GLC has not built. Only the twenty-odd buildings, and the structures behind them.
3. **Set out from a datum.** One line organises every page, the way a level line organises a wall. Restraint expressed as a working method, not as a style.
4. **Six people, forty years.** The site should read the way a careful builder talks on site: specific, unhurried, plain, and never louder than the facts. That means short sentences, real dates, and the Malay planning titles left exactly as the council received them.

## 8. Decisions the client should react to

1. **No accent colour at all.** The interface is concrete grey and near-black; the photographs supply every hue. The alternative is a single functional colour, and the token `--mark` (`#173F4D`, a deep galvanised blue-grey) already exists for links. Say if that feels too austere for a business that also builds family homes.
2. **Photographs are used at their real size and never upscaled.** Only two images in the profile exceed 900px wide, so **there is no full-bleed photographic hero on the homepage** — the opening screen is the sentence and the credentials. This is the biggest visual consequence of the photo audit, and a reshoot would change it.
3. **Projects with no photograph get a monospaced planning-title block, not a grey placeholder.** Four company-era projects and every reference project are affected. Look at the wireframe and say whether that reads as deliberate.
4. **The Malay planning title is boxed and labelled on every project page**, in monospace, verbatim including the profile's capitals. It is the credential the professional audience recognises. It is also a wall of capitals, and the family should confirm they want it that prominent.
5. **The headline figures are the company's own record, not the profile's table.** 20 buildings and RM61.3 million since 2015, with the directors' 24 earlier projects and RM40.7 million stated separately. The profile's "22 projects, RM66.7 million" mixes the two. See section 2 of `research/data-extraction.md`.
6. **No accent, no icons, no logos — including CIDB's and MOF's.** Credentials appear as registration numbers and dates in monospace. Reproducing a regulator's mark implies an endorsement that a registration is not, and GLC has no licence to use either mark.

Two alternatives considered and rejected, in a sentence each. A dark interface with the photographs glowing out of it would flatter the weaker images, but it makes a small contractor look like a design studio and the brief rules out the near-black-plus-accent direction. A photographic full-bleed hero with the statement over it is the obvious move and the images simply are not large enough to carry it without upscaling, which would look worse than not doing it.
