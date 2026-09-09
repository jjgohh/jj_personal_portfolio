# Global Land Consortium Sdn Bhd — website

Phase 0 (research and plan) is complete. There is no production code yet, by design: the brief asks for the research, positioning, sitemap, design plan, extracted data and open questions to be approved first.

## Read in this order

1. **`research/positioning-and-sitemap.md`** — what this company is, the three audiences, and the eight pages.
2. **`research/design-plan.md`** — the design plan for reaction. Section 8 lists the six decisions that need a yes or a no.
3. **`research/data-extraction.md`** — the 47 projects, the recomputed totals, and why they differ from the figures in the brief.
4. **`research/privacy-and-disclosure.md`** — the decisions to make with the family before anything is published.
5. **`content/open-questions.md`** — everything unconfirmed, with the blocking items marked.

Also in `research/`: the photo audit of all 75 photographs in the profile, the credentials verification record, the stack decision, and the profile PDF as clean text.

## Two things did not go to plan

**The reference-site audit could not be done.** This environment's egress policy blocks outbound page requests, so none of the seven reference sites could be opened. Rather than describe websites I have not seen, `research/reference-audit.md` records the positioning argument (which does not depend on fetching anything), states plainly what is lost, and sets out a ready-to-run audit method for anyone with ordinary web access. Roughly two hours of work, and nothing in Phase 1 depends on it.

**CIDB and PDPA claims are unverified.** `cidb.gov.my` and `pdp.gov.my` are blocked too. `research/credentials-verification.md` splits every claim into what is verified from GLC's own certificates (publishable) and what is not (must not be published). The G6 tender ceiling is in the second group: several sources say RM10 million, no primary source was reachable, so no figure goes on a page until someone confirms it. About 45 minutes of work for someone with web access.

## What Phase 1 will do

Astro project, design tokens, layout primitives, the content collection schema, all 47 projects loaded, routing and i18n scaffolding. Navigable and minimally styled. It needs three answers first, all in `content/open-questions.md`: the current address (A1), whether a logo exists (A2), and the one-sentence description of what the company does (C3).
