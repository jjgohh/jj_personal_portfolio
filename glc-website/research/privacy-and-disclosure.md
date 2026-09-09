# Privacy and disclosure — decisions needed before anything is published

This is brief §11, surfaced as the brief asks. The company profile is a confidential tender document; the website is public and indexed. The two cannot share content without the decisions below being made with the family, in writing.

## 1. What the profile exposes

- **28 private individuals** are named as clients, each paired with a home address down to the lot or house number and the contract sum they paid. Three planning titles also name homeowners inside the title text (C9 Shah Alam, C11 Bangsar, C19 Taman Duta).
- **Both directors' IC numbers** are printed on the CIDB Sijil Perolehan Kerja Kerajaan (p.9). Mr Yip Chee Tack's IC number is also on the MOF certificate (p.6).
- The banker's officer is named with a direct line (p.4).
- Sub-contractors and suppliers are listed with named contact persons, addresses, credit limits and terms (pp.10–11).
- Technical staff are named with qualifications (p.5).

## 2. Default rules adopted in the data (until the family says otherwise, in writing)

| # | Rule | Implemented as |
|---|---|---|
| 1 | Private individual clients are never named | `client = "Private client"` on all 28 records; printed name kept in an internal-only field |
| 2 | Residential locations are generalised to the neighbourhood | `location` = e.g. "Kota Damansara, Selangor"; lot/house numbers in an internal-only field that will not exist in the public schema |
| 3 | Corporate and institutional clients are named only with permission | `client_publish = false` on every record; template at `content/templates/client-permission-request.md` |
| 4 | Contract values are hidden per project by default; aggregates are shown | `value_publish = false` everywhere; totals computed at build time from all values |
| 5 | IC numbers redacted before any certificate is published | certificate PDFs/scans not committed to the repo until redacted copies are supplied |
| 6 | EXIF/GPS stripped from every photo | to be enforced in the Phase 3 image pipeline (a build step that fails on EXIF-bearing files) |
| 7 | Plain-language privacy notice (EN + BM) for the enquiry form and WhatsApp link | requirements in `research/credentials-verification.md` (PDPA section); page built in Phase 2 |
| 8 | Supplier, sub-contractor and staff names are not published | About page describes the network in general terms ("relationships running to 2004") without names unless each consents |

## 3. Decisions for the family — one row per question

| Decision | Options | Recommendation | Who decides |
|---|---|---|---|
| Publish contract values? | none / corporate and institutional only / all | Corporate and institutional only, and only where the client has agreed to be named; aggregates always | Directors |
| Name corporate clients? | per client | Ask each; see the permission list below | Directors, after client replies |
| Publish certificate PDFs? | yes with IC numbers redacted / no, show reference numbers only | Show registration numbers, grades, validity dates and a QR/verify link in text; publish redacted scans only if the family wants them | Directors |
| Show the directors' pre-2015 record? | yes, labelled / no | Yes, clearly labelled as delivered before incorporation, with the same privacy rules | Directors |
| Repeat-client statement ("several clients have returned for a second project")? | yes / no | Only if true today and the family is comfortable; no names | Directors |
| Which address is public? | Faber Tower / Fabe Plaza / Jalan Maharajalela | Whichever is the operating office, matched exactly with Google Business Profile | Directors |

## 4. Permission list — corporate and institutional clients

Company-era clients (GLC's own projects):

| Client | Project(s) | Value on file | Ask to name? | Ask to show value? |
|---|---|---|---|---|
| CK Building Solutions Sdn Bhd *or* Sorento Sdn Bhd (see P1) | PJ warehouse structure sub-contract (current) | 7,139,227.26 | yes, after the client identity is confirmed | yes |
| Sorento Sdn Bhd | Skudai factory warehouse renovation (current) | 1,125,000.00 | yes | yes |
| Shinju Pearls (M) Sdn Bhd | Six retail outlet fit-outs | ~3,750,000.00 | yes | maybe (programme total only) |
| Yip Fook Weng Construction Sdn Bhd | Mantin supermarket; Tanjung Malim business centre | 8,120,000.00; 8,850,000.00 | yes | yes |
| SJK(C) Kuang (board / PIBG) | School block | 2,870,000.00 | yes | yes |
| KK Straits International Education Sdn Bhd | Straits International School Rawang interior works | 4,800,000.00 | yes | yes |
| PC Straits International Education Sdn Bhd | Penang school hoarding and signboard | 238,206.00 | yes | no (small, and scope is minor) |
| Fantastic Hectares Sdn Bhd | Bukit Raja factory steel structure and roofing | 3,521,253.00 / 3,520,000.00 | yes | yes |
| NX Transport Services (M) Sdn Bhd | Balakong office | 3,630,000.00 | yes | yes |
| Taleng Sdn Bhd | Taman Duta retaining wall | 1,232,000.00 | yes | no (end client is a private home) |
| Persatuan Penganut Dewa Kam Ying Teng | Rawang temple A&A | 1,394,418.00 | yes | maybe |

Directors' pre-2015 clients (must be labelled as prior experience if named): PSM Home Centre Sdn Bhd, Sentoria Bina Sdn Bhd, Excel Multimedia Sdn Bhd, Yeow Yoon Construction Sdn Bhd, Country Heights Sdn Bhd, Manjamas Timur Eng Sdn Bhd, Persatuan Ajaran Taoism Rawang.

Rennes Properties Sdn Bhd is the *developer* on P1, not GLC's client; naming a developer needs the main contractor's permission too.

## 5. IC number redaction

Before any certificate image or PDF is committed: mask the "NO. K/P" values on p.9 (two numbers) and the authorised-person line on p.6 (one number). The QR codes on pp.8–9 resolve to CIDB verification pages and can stay. Keep the unredacted originals out of the repository entirely.

## 6. Photographs

Every photo must be of the project it is attached to, must carry no timestamp/watermark/widget, and must have EXIF stripped. Photos of private homes are still photos of someone's home: publish exteriors only with the owner's agreement where the house is identifiable and the neighbourhood is small. The photo-by-photo audit is in `research/photo-audit.md`.

## 7. The privacy notice

Requirements under Malaysia's PDPA (Notice and Choice Principle; bilingual notice; the 2024 amendments) are recorded with sources in `research/credentials-verification.md`. The notice will be a single page in EN and BM, linked from the form and footer, covering: what is collected via the form and WhatsApp, purpose (responding to an enquiry, preparing a quotation), who it is shared with (nobody except the form provider as processor), retention, the right to access and correct, and a contact for data requests.
