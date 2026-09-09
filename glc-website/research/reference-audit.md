# Reference audit — status: BLOCKED, and what to do about it

## Read this first

The brief's section 3 asks me to fetch and study seven named websites plus three or four mid-size Malaysian contractors I find myself. **I could not fetch any of them.** This session runs behind an egress proxy whose policy blocks outbound page requests; every attempt returned `EGRESS_BLOCKED`, including `gamuda.com.my`, `ijm.com`, `sunwayconstruction.com.my`, `kerjayaprospek.com.my`, `uem.com.my`, `gt-maxconstruction.com.my`, `tcsgroup.com.my`, and also `cidb.gov.my`, `pdp.gov.my` and `docs.astro.build`. Web *search* works, so the search index is reachable, but no page can be loaded and read.

I am not going to write an audit of seven websites I have not seen. Describing their navigation, palettes or project pages from memory or from search snippets would produce exactly the plausible-sounding filler the brief forbids, and it would be filler in the one document whose whole purpose is first-hand observation.

So this file contains two things: the positioning argument, which does not depend on fetching anything, and a ready-to-run audit method for whoever can reach the sites.

## What the positioning argument does not need

The brief's own section 2 already states the structural case, and nothing I could learn from fetching those sites would change it. It rests on facts that are matters of record rather than observation:

- Gamuda, IJM, Sunway Construction, Kerjaya Prospek and UEM (via UEM Sunrise / UEM Edgenta) are listed on Bursa Malaysia or are subsidiaries of listed groups. A listed company's website carries content it is *obliged* to carry: quarterly results, annual reports, Bursa announcements, board and governance disclosure, sustainability reporting. That architecture exists to serve investors and regulators.
- Global Land Consortium is a private Sdn Bhd with three current projects worth RM10.3 million and no reporting obligations to anyone but its own shareholders and the Companies Commission.
- Therefore the listed-group architecture is not merely unnecessary here, it is actively wrong: an investor-relations section with nothing in it, or a sustainability framework page on a six-person company, tells a procurement officer that the company is presenting itself as something it is not. That is the credibility cost the brief describes, and it follows from the corporate facts, not from how the sites look.

The instruction to steal TCS Group's habit of publishing independently-assessed QLASSIC and SHASSIC scores in a plain table also survives without fetching: it is a good idea on its own terms, and the brief's own note on it is enough to act on. The relevant finding for GLC is a negative one and it comes from the profile, not from TCS's website: **the company profile contains no QLASSIC assessment, no SHASSIC assessment, no ISO certificate and no safety record.** So the pattern to copy is the *form* — verifiable third-party evidence stated in a table without adjectives — applied to the evidence GLC actually holds, which is its CIDB grade and categories, its SPKK validity, its SCORE rating and its MOF registration. That is what the Credentials page does.

GT Max Construction is described in the brief as the closest structural analogue and its weaknesses are listed there specifically enough to act on: thin copy, duplicated sections, stock service icons, a stale copyright line, no real project detail. Those are all things to beat on substance, and every one of them is beaten by the content model in section 4 of the brief rather than by anything I would learn from looking.

## What is genuinely lost

Three things, and they are real:

1. **Layout and typographic intelligence from the big groups.** The brief asks me to borrow their visual and structural discipline. I have designed without that reference. The design plan is grounded in the material vocabulary of GLC's own photographs instead, which is a defensible substitute, but it is a substitute.
2. **Enquiry-path patterns from mid-size Malaysian contractors.** Specifically: how prominent WhatsApp is in practice, what their enquiry forms actually ask, whether they publish contract values. These directly affect the contact page and the form fields, and I have had to reason from the market facts in the brief's section 8 instead of from observation.
3. **The comparison set of three or four G6/G7 firms.** Not attempted, since discovering them requires opening candidate sites to confirm they are contractors rather than directories.

## The audit method, ready to run

Anyone with ordinary web access can complete this in about two hours. Run it before Phase 2 design build, not before Phase 1 skeleton, since nothing in the skeleton depends on it.

For each of the seven named sites, load: home, about/corporate, projects (both completed and ongoing if separated), services/capabilities, certifications or credentials, contact. Record:

- **Information architecture** — the main nav items verbatim, and what the homepage is organised around, section by section.
- **Who it is built for** — judged from what the first screen leads with and what the nav puts first.
- **One thing worth taking, one thing to avoid** — concrete, quotable.
- **Projects list** — is it filterable, and by what? Does each project get its own page? What facts does a project page state (value, client, dates, scope, consultants)? How many photos?
- **Credentials display** — CIDB grade shown or not; ISO claims; awards; certificates as images, PDFs or plain text; any QLASSIC/SHASSIC table.
- **Enquiry CTA** — form fields, WhatsApp presence, phone treatment, where it sits, whether it is sticky on mobile.
- **Staleness signals** — copyright year, date of the most recent news item, dead links.
- **Visual notes** — palette, typefaces, imagery source (own photography or stock), how much animation, whether it reads as a bought template.

Then find three or four private G6/G7 Sdn Bhd building contractors with their own sites, preferably Klang Valley, and record the same three columns of specific interest: projects list, credentials display, enquiry CTA. Search terms that should surface candidates: `kontraktor G7 bangunan Selangor`, `building contractor Sdn Bhd CIDB G7 Klang Valley`, `renovation contractor Sdn Bhd Petaling Jaya CIDB`. Exclude directories, listing sites and subsidiaries of listed groups.

Write it up as a per-site entry of three to five lines plus one comparison table, and a short "what this means for GLC" section. Then revisit the design plan's decisions in the light of it.

## One thing search did establish

A single fact worth recording, because it bears on the Credentials page. Multiple sources agree that since March 2024 a CIDB SCORE rating of at least 3 stars has been a **requirement** for G2–G7 contractors renewing or upgrading their registration, and for G5–G7 contractors entering government tenders. If that is right, GLC's 3-star rating is a threshold met rather than a distinction earned, and the site should present it as *current and valid* rather than as an achievement. It is recorded with its sources, and its verification status, in `research/credentials-verification.md`. Do not put an adjective in front of it until that is confirmed.
