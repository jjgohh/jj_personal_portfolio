# Data extraction report — projects, aggregates, discrepancies

Source: company profile PDF (65 pages). Machine-readable output: `content/projects.extracted.json` (47 records). Clean text of the PDF: `research/source/profile-extract.md`. Extraction date: 9 September 2026.

## 1. Method

1. Text extracted page by page (PyMuPDF); the four certificate pages (pp.6–9) are scanned images and were transcribed by eye at 130 dpi.
2. One record per project. The 22 rows of the completed-projects table (pp.14–17), the 3 current projects (p.13), the 20 "other reference projects" (pp.46–65), plus 2 completed projects that exist only as detail pages (pp.24, 40).
3. Each record carries `source_pages`, `discrepancies[]` and `todos[]`. Nothing was resolved silently: where the table and a detail page disagree, both values are recorded and the table value is used provisionally.
4. Aggregates below are computed from the JSON by script, not typed.

## 2. Aggregates — recomputed

| Set | Count | Total (RM) | Note |
|---|---|---|---|
| Current projects (p.13) | 3 | 10,285,678.66 | Brief says "roughly RM10.3 million" — **matches** |
| Completed-projects table, as printed (pp.14–17) | 22 | 66,650,405.00 | Brief says "22 … roughly RM66.7 million" — **matches** |
| Same, using the p.42 value for the Bukit Raja factory (RM3,520,000 instead of RM3,521,253) | 22 | 66,649,152.00 | immaterial to the headline |
| Completed table + the 2 detail-only completed projects (pp.24, 40) | 24 | 68,673,583.00 | the table under-counts |
| **Table rows that started before incorporation (24 Feb 2015)** | 4 | 7,364,849.00 | C1 PSM Kapar (2012), C2 Sentoria Kuantan (Jul 2014), C3 Rawang 6-storey (Sep 2014), C8 Excel Sungai Buloh (Jan 2015) |
| **Completed, attributable to the company (table only)** | 18 | 59,285,556.00 | |
| **Completed, attributable to the company (incl. 2 detail-only)** | 20 | 61,308,734.00 | **recommended headline basis, pending the attribution answers in §4** |
| Other reference projects (pp.46–65) | 20 | 33,341,462.00 | 2002–2014, all directors' prior experience |
| Directors' prior experience in total (4 + 20) | 24 | 40,706,311.00 | |
| Everything in the profile | 47 | 112,300,723.66 | |

Years: completed table spans 2012–2024 as printed; reference projects 2002–2014. Company-attributable work spans April 2015 (temple, Rawang) to the present.

**Conclusion on the brief's figures.** Both aggregates in the brief are arithmetically correct for the printed table. They are not the figures the website should lead with, for two reasons: (a) four of the 22 rows pre-date the company; (b) two completed projects worth RM2.02m are in the profile but not in the table. The honest company figure is currently **20 completed projects, RM61.3 million (2015–2024)**, plus **3 current projects, RM10.3 million**, plus the directors' prior record of **24 projects, RM40.7 million (2002–2015)**. All of these will be derived at build time from the data, never typed into a template.

## 3. Sector and scope mix (company-attributable completed work, 20 projects)

Sector: residential 10 · commercial 3 · institutional 3 · industrial 2 · retail 1 (a six-outlet programme) · religious 1.
Scope (a project can have more than one): main contract 11 · renovation & A&A 6 · fit-out 5 · demolition & rebuild 3 · RC structure 1 · steel structure & roofing 1 · earthworks 1.
States, all 47 records: Selangor 30 · Kuala Lumpur 11 · Negeri Sembilan 2 · Johor, Pahang, Perak, Pulau Pinang 1 each.
Client types, all 47 records: private individuals 28 · corporate 16 · association 2 · institutional 1.

Taxonomy decisions (revisit with the family): supermarket, business centre, club house and office → *commercial*; warehouses and factories → *industrial*; school block, school interior works and the school hoarding job → *institutional*; temple → *religious*. Retaining wall for a bungalow (C19) is *residential* by sector but *RC structure + earthworks* by scope.

## 4. Attribution — who actually delivered what

The company was incorporated on **24 February 2015**. The profile lists under "completed projects" four jobs that started before that date:

| ID | Project | Start | End | Value | Question |
|---|---|---|---|---|---|
| C1 | Warehouse extension, Kapar, Klang (PSM Home Centre) | Nov 2012 (p.14) / Nov 2011 (p.32) | Mar 2013 / Mar 2012 | 1,350,000 | Which entity contracted? Which year? |
| C2 | Club house RC structure sub-contract, Kuantan (Sentoria Bina) | Jul 2014 | Mar 2015 | 949,500 | Completed one month after incorporation — novated to GLC? |
| C3 | 6-storey building A&A, Jalan Welman, Rawang | Sep 2014 | Feb 2015 | 753,849 | Same month as incorporation |
| C8 | Warehouse extension, Sungai Buloh (Excel Multimedia) | Jan 2015 | Sep 2015 | 4,311,500 | Started 4 weeks before incorporation; most of the work happened after |

The rule applied in the data: `attributed_to = "company"` only when the start month is on or after February 2015; otherwise `"directors_prior_experience"`. The 20 "other reference projects" (2002–2014) are all `directors_prior_experience`. If the family confirms that any of C1–C3/C8 were contracted by Global Land Consortium Sdn Bhd (e.g. by novation or because the letter of award post-dates incorporation), the flag flips and the aggregates update automatically.

Recommended public wording for the earlier work: *"Delivered by our directors before Global Land Consortium was incorporated in 2015."* Shown on the project card and page, never buried in a footnote.

## 5. Discrepancy register

### 5a. Items listed in the brief (§10) — all confirmed in the PDF

| Where | Issue | Status in data |
|---|---|---|
| pp.19, 20, 25, 26, 28, 29, 30 | "RESINDENTIAL" | not carried over |
| pp.19–20 | Headed "RESIDENTIAL PROJECT"; both are warehouse/factory works | sector = industrial |
| p.20 vs p.13 | PJ warehouse client: Sorento Sdn Bhd (p.20) vs CK Building Solutions Sdn Bhd (p.13) | recorded on P1; **open question** |
| p.5 | "twenty four (25) years" | not used; "in the industry since 1998" used instead |
| p.39 | "RM 4,800,00.00" | 4,800,000.00 (p.15) used |
| pp.16, 42 | "FANSTATIC" | Fantastic Hectares Sdn Bhd |
| p.3 | "OTHERS REFRENCE PROJECTS" | "Other reference projects" |
| p.11 | Sub-contractor numbering (two rows numbered 6) | list re-sequenced in the extract, noted |
| p.37 | Headed "SCHOOL PROJECT"; it is a warehouse at Lot 623, Pekan Kuang; "ANG" vs "ONG" Tai Soon | sector = industrial; client is a private individual and is not published anyway |
| p.22 | Headed "RESIDENTIAL BUNGALOW"; it is a two-terrace-house renovation | title_en corrected |
| p.64 | Detail text copy-pasted from the Kajang bungalow (p.59) | R19 title_original = null, `TODO(verify)` |
| pp.39, 12 | "STRAIT" → Straits; "YANAHA" → Yamaha | corrected |
| various | BUNGLAOW, SESEBUIAH, PRECINT, STRUCTION, DEARAH, SELANOR, PERUBAHN, VILLEGE, MEGAMAL, LEKTRIK, PENDANUT, TAOSIM | corrected in `title_original`; verbatim kept in `title_original_as_printed` |
| addresses | No. 13 Faber Tower (p.4) / 13D Fabe Plaza (MOF cert, p.6) / 25-1 Jalan Maharajalela (CIDB cert, p.9) | **open question**; note that 25-1 Jalan Maharajalela is the company secretary's address (p.4: Lok Sam Wah & Company, No. 25, 1st Floor, Jalan Maharajalela) — i.e. the statutory registered office, while Taman Desa is the operating address |

### 5b. Additional discrepancies found during extraction (not in the brief)

| # | Where | Issue | Effect |
|---|---|---|---|
| 1 | C1, p.14 vs p.32 | Dates a full year apart: Nov 2012–Mar 2013 (table) vs Nov 2011–Mac 2012 (detail) | ask |
| 2 | C17, p.16 vs p.42 | Value RM3,521,253.00 vs RM3,520,000.00; p.42 adds "(STEEL STRUCTURE & ROOFING WORKS ONLY)" while the table title reads like the whole factory | scope set to steel structure & roofing; is_subcontract = true; ask for value |
| 3 | C13, p.15 vs p.41 | Completion Feb 2020 vs "FEB 2020 – EXTENDED TO MARCH 2021" | ask |
| 4 | C19, p.16 vs p.29 | Table title: "CADANGAN MEMBINA **RETAINING WALL UNTUK** SEBUAH RUMAH BANGLO…"; detail page drops "retaining wall untuk" and reads as if the whole bungalow was built. The planning title also names the two homeowners | scope = RC structure + earthworks pending answer; homeowner names must be stripped from any published title |
| 5 | C10, p.15 vs p.38 | Two different project descriptions (upgrade & addition of a 4-storey block with 18 classrooms vs "membina dan menyiapkan sebuah bangunan 4 tingkat dan sebuah kanteen 1 tingkat"); client "STJKC" vs "SRJKC" Kuang | table title used; client normalised to SJK(C) Kuang |
| 6 | C4, p.14 vs p.44 | "SHINJU PEARLS SDN BHD" vs "SHINJU PEARL (M) SDN BHD"; value shown as "~ RM 3,750,000" (approximate); dates are years only | ask for legal name, dates, whether one contract or six |
| 7 | C14, p.15 | The Penang job is a **hoarding and project-signboard** permit/works package (RM238,206), not the construction of a school. The brief's phrase "two school buildings" overstates: the profile shows one school block (SJK(C) Kuang), one international-school interior fit-out (Rawang) and one hoarding job (Penang) | title_en says hoarding and signboard works |
| 8 | pp.24, 40 | Two completed projects are missing from the completed-projects table: Lucky Garden terrace rebuild (RM628,760, 2016–17) and the Rawang Chinese temple A&A (RM1,394,418, 2015–16) | added as C23, C24 |
| 9 | p.36 | Header "COMMERCIAL WARE HOUSE" on the Mantin supermarket | sector = commercial |
| 10 | p.34 | Header "COMMERCIAL BUILDING" on a warehouse extension | sector = industrial |
| 11 | p.15 | Table "YEAR" column says 2017 for C9 although it started Mar 2016 | ignored; start/end months used |
| 12 | pp.52, 65 | Client "CHAIM" vs "CHIAM" Han Twee — likely the same repeat client | private individual; not published |
| 13 | pp.55, 60 | Yong Cho Joong appears twice (2008 and 2012) — a repeat private client | not published; note for the "repeat clients" point on About only if the family agrees |
| 14 | p.13 | Two current projects have scheduled completion dates already in the past (Apr 2026 and Aug 2026; today is 9 Sep 2026) | ask for actual status before publishing "current" |
| 15 | p.9 vs brief | The brief lists "CIDB registration … first registered 11/10/2018" and "Sijil Perolehan Kerja Kerajaan valid 12/09/2025–14/09/2028" as two credentials. In the profile they are the same document (p.9). There is **no Perakuan Pendaftaran Kontraktor (PPK) card** in the profile | ask for the current PPK and its expiry |
| 16 | brief §1 | The brief's "named corporate clients that can plausibly be cited" includes Country Heights Sdn Bhd and Yeow Yoon Construction Sdn Bhd — both are pre-incorporation reference projects (2005–06 and 2002–03), so they are the directors' clients, not GLC's. Taleng Sdn Bhd (2021–22) and Manjamas Timur Eng Sdn Bhd (2011) are corporate clients the brief omits | permission list updated accordingly |
| 17 | p.5 | Chairman styled "YAB Dato'" — YAB (Yang Amat Berhormat) is the honorific for a Prime Minister, Deputy PM, Menteri Besar or Chief Minister; a Dato' would ordinarily be "YBhg." | ask which honorific to use; do not copy "YAB" blindly |
| 18 | p.12 | Machinery list shows two different generator sets under one running number | cosmetic |

## 6. Field-level decisions in the JSON

- `title_original` — the BM planning-approval title with only obvious spelling errors corrected and the client's personal name removed where the title contained one (C9, C11, C19). `title_original_as_printed` keeps the verbatim string for traceability. Both are kept because the brief wants the BM title visible *and* wants the typos gone.
- `location` — generalised to neighbourhood/town for every record. `location_precise_source` (lot and house numbers) is **internal only** and will be excluded from the Phase 1 content schema, so it cannot leak into a template.
- `client` — "Private client" for every individual. The printed name sits in `client_as_printed` (internal only). Corporate, institutional and association names are kept but `client_publish` defaults to `false`.
- `contract_value_myr` — numeric, always present; `value_publish` defaults to `false`. Aggregates use the values regardless of the publish flag.
- Dates — `YYYY-MM`. The profile's MAC/MARCH/Marc/Feb styles were normalised; "2015"–"2018" (Shinju Pearls) kept as years.
- `is_subcontract` — `true` where the title says sub-contract or a structure-only package; `null` where a construction company is the client and the role is unclear (C5, C13, C12, C14, R3, R12).
- `summary` — every record is `TODO(verify)`; per the brief the family writes or approves these.

## 7. Photo coverage from the profile alone

Records with no photograph anywhere in the profile: P3 (USJ rebuild, not yet started when the profile was made), C14 (Penang hoarding), C20 (PJ Section 6 rebuild, 2024), C21 (Balakong office, 2024). The last two are recent, company-attributable jobs and should be first on the reshoot list. The full per-photo audit is in `research/photo-audit.md`.
