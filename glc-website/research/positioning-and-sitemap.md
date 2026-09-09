# Positioning summary and sitemap

## 1. What this company actually is

Six people. Two directors who have between them been building in the Klang Valley since 1987 and 1998, a chairman who came in from project management in 2003, two site supervisors and one quantity surveyor. A company incorporated in February 2015 that has completed twenty buildings worth RM61.3 million since, and has RM10.3 million of work on site now. A CIDB G6 registration in three categories, a current government-works certificate to 2028, and a sub-contractor network in which the plumber, the aluminium fabricator and the tiler have been with the directors since 2004, 2004 and 2007.

Read the project list and one thing stands out: **this is a company that gets asked back.** Yong Cho Joong appears twice, four years apart. Chiam Han Twee appears twice, six years apart. Yip Fook Weng Construction gave them a RM8.1 million supermarket and then a RM8.85 million business centre. The two Straits International Education companies gave them a school interior and then a hoarding package in another state. That is the actual competitive fact about this business, and it is worth more to a factory owner deciding who to trust with a warehouse than any adjective the site could use.

The second thing that stands out is **range within a narrow size band**. Bungalows and terrace renovations, warehouses and factories, a supermarket, a business centre, two school projects, an international-school fit-out, retail units in six shopping malls, an office building, a Chinese temple, and a retaining wall in Taman Duta. All between about RM200,000 and RM8.9 million. That is the profile of a builder who takes the job in front of them and finishes it, not a specialist.

## 2. The positioning, in one sentence

**A G6 building contractor in the Klang Valley that supervises its own work, and can show you twenty completed buildings, three live sites, and current registrations you can verify in thirty seconds.**

Everything on the site should be answerable to that sentence. Nothing on the site should require the reader to take the company's word for anything.

## 3. What that rules in and out

**In:** verifiable numbers, dates and registrations; the Malay planning-approval titles, verbatim, because the professional audience reads them fluently and their presence is itself a credential; scope-first navigation, because a main contractor looking for a steel-structure subcontractor does not care what sector the building was; photographs of buildings and structures; the honest split between the company's own record and the directors' earlier record; WhatsApp as a first-class contact route.

**Out:** an investor-relations section, an ESG or sustainability framework, a board charter, a corporate-structure chart, a careers portal, an awards page, a news section (unless the family commits to posting), a mission statement written by anyone but the family, stock photography of any kind, service icons, client logos without written permission, and any word that cannot be checked.

**The specific trap:** the temptation to make a RM10 million contractor look like a RM1 billion one. The five listed groups in the brief's reference list have websites built for investors and regulators because they are obliged to. Copying that architecture here produces a site whose empty investor page tells a procurement officer that the company is pretending. The whole argument is in `research/reference-audit.md`.

## 4. The three audiences, and the one question each asks

| Audience | The question they arrive with | Where the site answers it |
|---|---|---|
| **Private and corporate clients** — a factory owner needing a warehouse, a developer needing a builder, a family building a bungalow | "Have they done this before, and will they still be here in eighteen months?" | Projects filtered to something like theirs, with real dates and real photographs; the company's age and continuous record; the credentials strip as reassurance rather than as a claim |
| **Main contractors and consultants** looking for a G6 subcontractor | "Can they take an RC structure, steel structure or fit-out package, and are they registered for it?" | Capabilities page anchored by scope, each section linking to real examples; scope filter on the projects index; the CIDB categories against each capability |
| **Government and GLC procurement officers** checking a tender submission | "Do the registration numbers and validity dates match what this company submitted?" | Credentials page: every number, every date, in plain text, in thirty seconds, with no PDF download required |

Priority order in a conflict: audience 1 gets the homepage, audience 2 gets the capabilities and projects pages, audience 3 gets the credentials page. Nobody has to scroll past someone else's content.

## 5. Sitemap

Eight page types. Every one justifies itself against a specific reader.

```
/                        Home
/about                   About
/capabilities            Capabilities  (anchored sections, one per scope)
/projects                Projects index  (filter: scope · sector · state · status)
/projects/[slug]         Project detail  (47 pages, minus any the family withholds)
/credentials             Credentials
/contact                 Contact
/privacy                 Privacy notice
/404                     Not found
/ms/...                  Bahasa Malaysia mirror of all of the above
```

**Home.** What the company does, in one sentence, above the fold, in plain words. The credentials strip immediately under it: CIDB G6 B/CE/ME · SPKK to 2028 · SCORE 3 stars 2025 · MOF registered. Then three or four featured projects chosen for range, not for size. Then the six scopes as a plain list linking into the capabilities page. Then the aggregate figures, derived at build time. Then the enquiry block. No hero video, no carousel.

**About.** Incorporated February 2015. The three named people and what each of them actually does, with their real start years. How the company works: directors on site, two supervisors, an in-house QS, and a sub-contractor and supplier network with the actual "since" years from pages 10 and 11 of the profile, some of them running to 2004. The honest sentence about the pre-2015 record. One line on hiring, no careers portal. Vision and mission: placeholder until the family writes them, and the page reads perfectly well without them.

**Capabilities.** One page, six anchored sections: main contract building works, RC structure, steel structure and roofing, renovation and A&A, interior fit-out, mechanical and electrical. Each: what it involves in two or three sentences of plain English; two or three real projects linked; the relevant CIDB category. The M&E section is the honest problem — GLC holds the G6 ME category but the profile shows no M&E-led project, only an air-conditioning ducting and a fire-protection sub-contractor in the network. That section states the registration and the sub-contractor capability and claims nothing more. Flagged in the open questions.

**Projects.** Filterable index. Scope filter first, because that is what a subcontract enquiry searches on. Cards, sorted newest first, with current projects in their own group at the top. Reference projects in a clearly labelled group at the bottom.

**Projects/[slug].** One per project. The plain-English title; the facts; the Malay planning-approval title, visible and labelled; the scope delivered; photographs with real captions; the attribution label where it applies. Contract value only where the family has said yes, per project.

**Credentials.** The page that exists so a procurement officer can verify GLC in thirty seconds. Every registration number and validity date in plain text, not in an image. Plant and equipment from page 12. The sub-contractor and supplier network described without names. Certificate PDFs only if the family agrees and only redacted.

**Contact.** Address, map, phone as a `tel:` link, WhatsApp click-to-chat with a pre-filled message, email, and a short form. The form asks the five things that let the family qualify a lead without three rounds of email — proposed in the open questions for the family to confirm.

**Privacy.** Bilingual, linked from the form and the footer.

**Not building:** investor relations, ESG, sustainability, board charter, awards, careers portal, news. News is a Phase 5 decision and only if the family will post; the brief is right that a stale news page is worse than none, and GT Max's 2020 copyright line is the cautionary example.

## 6. How the numbers on the site are produced

Every statistic is derived from the project data at build time. Nothing is typed into a template. The figures, from `content/projects.extracted.json` and recomputed in `research/data-extraction.md`:

- 3 current projects, RM10,285,678.66
- 20 completed projects attributable to the company, RM61,308,734, from April 2015 to February 2024
- 24 further projects delivered by the directors before incorporation, RM40,706,311, from May 2002 to February 2015
- Sectors delivered by the company: residential, industrial, commercial, institutional, retail, religious
- Six states and federal territories: Selangor, Kuala Lumpur, Negeri Sembilan, Johor, Perak, Pulau Pinang

Note that these are **not** the figures in the brief. The brief's "22 completed projects, roughly RM66.7 million" is arithmetically right for the profile's printed table, but four of those 22 started before the company existed, and two completed projects in the profile are missing from that table. The reconciliation is in section 2 of `research/data-extraction.md`. Which basis the site leads with is a decision for the family; the recommendation is the honest company figure, with the directors' record stated separately and prominently, because 40 years of continuous experience presented straight is stronger than a single inflated total that a competitor could pick apart.
