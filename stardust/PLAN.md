# The Road Home — rebuild plan

Working plan for rebuilding theroadhome.org on a modern platform. Lives under `stardust/` and follows the stardust pipeline (brand → briefings → prototypes).

**Status as of 2026-04-24**
- Brand extracted and approved · `stardust/brand-profile.json`, `stardust/brand-board.html`
- Design personality captured · `.impeccable.md` (authored by designer)
- Home page prototype approved · `stardust/prototypes/home-b.html` (variant B — civic / data-led, denser)
- Variant A retained as design history · `stardust/prototypes/home-a.html`

---

## 1 · Site analysis

The sitemap yields **84 real pages** (after filtering test, orphan, and asset URLs). These cluster into **12 page templates**. Most of the rebuild effort is in designing these 12 templates — each real page is then content authored into its template.

### Page-type catalog

| # | Template | Pages | Description |
|---|---|---|---|
| **T-01** | Landing | 1 | `/` — the home page. Done as `home-b.html`. |
| **T-02** | Pillar hub | 4 | Section-overview pages: `/get-help/`, `/give-main/`, `/get-involved/`, `/about-us/`. Short intro + grid of child pages + pillar CTA. |
| **T-03** | Service / program detail | 12 | `/shelter/`, `/emergency-services/`, `/palmer-court/`, `/mens-resource-center/`, `/midvale-family-resource-center/`, `/resource-centers/`, `/housing-programs/`, `/all-housing-programs/`, `/permanent-housing/`, `/housing-navigation-program/`, `/landlord-resources/`, `/insurance/`. Hero + "at-a-glance" sidebar + narrative + how-to-access + location + related programs. |
| **T-04** | Donate flow | 8 | `/donate/`, `/donate-2/`, `/one-time-donation/`, `/recurring-donation/`, `/housing-champions/`, `/housing-champions-2/`, `/housing-champions-donation/`, `/donation-form/`. CTA-first, amount picker, testimonial, impact math, secure-checkout cues. |
| **T-05** | Giving-method detail | 9 | `/give-main/real-property/`, `/trusts/`, `/life-insurance/`, `/legacy-planned/`, `/donor-advised-fund/`, `/stock-wire-transfer/`, `/in-kind-donations/`, `/donor-bill-of-rights/`, `/manage-donations/`. Document-oriented: explainer + who-it's-for + required info + advisor contact. |
| **T-06** | Transparency / data | 4 | `/where-does-it-go/`, `/data-finances/`, `/data-dashboard/`, `/annual-reports/`. Big numbers, chart placeholders, audit badges, downloads. |
| **T-07** | People directory | 3 | `/board-of-trustees/`, `/meet-the-team/`, `/case-management-team/`. Grid of portrait cards with bio toggles, filter chips. |
| **T-08** | Person detail | 1 | `/michelle-flynn/`. Single-person landing (CEO). Photo + bio + signed note. |
| **T-09** | Stories listing | 6 | `/housing-stories/`, `/moments-that-matter/`, `/team-stories/`, `/videos/`, `/blog/`, `/media-center/`. Editorial grid of story cards with filters. |
| **T-10** | Get-involved program | 8 | `/fundraiser/`, `/mediathon/`, `/sponsor-page/`, `/eagle-scouts/`, `/events/`, `/internships/`, `/court-ordered-volunteering/`, `/get-involved/careers/`, `/careers-positions/`. Like service detail but volunteer-oriented: what you do, who can, schedule, signup. |
| **T-11** | Form page | 10 | `/community-referral-page/`, `/mvpreferral/`, `/mvpfacility/`, `/stvinnyreferral/`, `/ssvf-referral/`, `/tanf-rapid-rehousing-program-referral-form/`, `/fundraiser-form/`, `/trh-feedback-form/`, `/secure-file-upload/`, `/contact-us/`, `/tell-your-story/`, `/item-donations/`, `/in-honor-and-memory/`, `/double-donation/`. Structured form + context sidebar + privacy note. |
| **T-12** | FAQ | 1 | `/faq/`. Categorized Q&A with search. |
| **T-13** | History / timeline | 4 | `/history/`, `/decades/`, `/centennialcelebration/`, `/awards/`. Long editorial, decades as anchors, period photography. |
| **T-14** | Campaign / seasonal | 6 | `/holiday1/` through `/holiday6/`. Light landing variant with one CTA. |
| **T-15** | Legal | 1 | `/privacy-policy/`. TOC + long-form prose + last-updated badge. |

**Total: 15 templates for 84 real pages.** (The "Home" template is only used once, but it earns its own slot because of the variant-B decision already locked.)

### Out of scope (noted but not rebuilt in this plan)

- `/wp-content/` assets (100+ asset URLs in the sitemap) — migrated as-is, not redesigned.
- Test pages, `/sample-page/`, `/miles-test-page/`, etc. — dropped.
- Blog posts, individual stories, individual team members beyond the CEO — rendered by the relevant detail template (T-07 team grid expands members; T-09 stories listing includes cards). A "story detail" template (long-form editorial) is a reasonable future addition (T-16) but not required to ship the 84 core pages.

---

## 2 · Work plan

### Phase A · Briefings for the 84 real pages (1–2 sessions)

**Goal:** one markdown briefing per real page, with verbatim copy extracted from the live site.

Briefings live under `stardust/briefings/{slug}.md` and follow the stardust briefing format. Each briefing carries:

- **Frontmatter** — `template: T-##`, `url: <live url>`, `priority: 1–3`, `status: draft | reviewed`
- `# Intent` — one sentence: why this page exists, for whom
- `# Audience` — which persona (crisis, donor, volunteer, policy) and their mental state arriving
- `# Sections` — ordered list, each with a data-intent tag (hero, triage, services, impact, story, cta, trust, footer, form, etc.)
- `# Copy` — **verbatim from the live site**, per section. No rewriting. Missing sections get a `SYNTHESIZE` marker to flag for later generation.
- `# Imagery` — source hint (path to the live site asset, or direction if we don't have one yet)

#### Sub-steps

- **A1** — Scrape every page's rendered DOM into `stardust/_scratch/pages/{slug}.html` via Playwright (one batch, ~5 min). Capture visible text, headings, images.
- **A2** — For each page, run a parsing pass that extracts headline, section headings, and body copy into a briefing. Script lives at `stardust/_scratch/build-briefing.js`. Output: 84 `.md` files.
- **A3** — Spot-check 8–10 briefings (one per template) for copy fidelity. Fix the scraper if any section is losing structure.
- **A4** — Mark each page's `priority`:
  - `1` (must-have, blocks launch): home, pillar hubs, primary service detail (shelter, emergency-services, palmer-court, resource-centers, one representative housing program), primary donate page, primary giving-method (legacy-planned), where-does-it-go, main FAQ, main contact, about, history — ~20 pages.
  - `2` (important, blocks feature parity): remaining service/donation/giving-method/people pages — ~40 pages.
  - `3` (nice-to-have, can launch with redirects): campaigns, old forms, sponsor, awards, decades — ~24 pages.

**Output:** `stardust/briefings/*.md` (84 files), `stardust/_scratch/pages/*.html` (scrape cache).

---

### Phase B · Template prototypes (the visual system)

**Goal:** one approved HTML prototype per template. Each prototype reuses the `:root` token block and component grammar established by `home-b.html`.

Build in this order (highest leverage first):

| Sprint | Templates | Reason |
|---|---|---|
| B-1 | **T-02 Pillar hub** (1 prototype, 4 pages use it) | Applies variant B's density + rhythm at a simpler scale. Validates that the home system scales down. |
| B-2 | **T-03 Service detail** (1 prototype, 12 pages use it) | Highest real-page yield per template. The crisis-audience backbone. |
| B-3 | **T-11 Form page** (1 prototype, 10+ pages use it) | Unblocks every referral and contact flow. Often overlooked; has big UX leverage for the crisis audience. |
| B-4 | **T-04 Donate flow** + **T-05 Giving-method detail** (2 prototypes, 17 pages) | The donor lane. T-04 is CTA-first; T-05 is document-first. Design them together so the stepdown from hub → detail feels consistent. |
| B-5 | **T-06 Transparency / data** (1 prototype, 4 pages) | Credibility surface. Has the biggest impact on donor trust. |
| B-6 | **T-09 Stories listing** + **T-07 People directory** (2 prototypes, 9 pages) | Editorial/card patterns. These unlock the human-first photography direction from `.impeccable.md`. |
| B-7 | **T-10 Get-involved program** (1 prototype, 8 pages) | Volunteer lane. Largely variant of T-03; likely small design delta. |
| B-8 | **T-13 History / timeline** + **T-12 FAQ** + **T-14 Campaign** + **T-15 Legal** + **T-08 Person detail** (5 prototypes, 13 pages) | The long tail. Build after the main arteries work. |

**For each sprint, the loop is:**

1. Open 1–2 representative live pages from that template's cluster for visual reference.
2. Draft the prototype in variant-B's visual register (same tokens, same component grammar, differences only where the template genuinely needs them).
3. Wire in verbatim copy from the most important briefing in that cluster — the prototype becomes a real instance of the template, not a shell.
4. Open in browser, critique, iterate until approved.
5. Record the final design tokens (any new ones) in a shared `stardust/prototypes/_tokens.css` so all templates stay in sync.

**Variant count per template:** 1 by default. Drop to 2 variants only if the user isn't sure about a specific template's direction.

**Output:** `stardust/prototypes/{template-slug}.html` (12 files, not counting home already done). Plus `stardust/prototypes/_tokens.css` as the shared token source.

---

### Phase C · Apply briefings to templates

**Goal:** for every real page, render its final HTML by combining its briefing (copy) with its template (shell).

This phase is mechanical, not judgmental. Each template takes a briefing as input and renders the page.

- **C1** — Write a small renderer: `stardust/_scratch/render.js` that reads `{slug}.md`, loads the template HTML, substitutes copy slots, and writes `stardust/pages/{slug}.html`.
- **C2** — Render priority-1 pages first (~20 pages). Spot-check each in the browser.
- **C3** — Render priority-2 pages (~40 pages).
- **C4** — Render priority-3 pages (~24 pages) or mark for redirect if the content is stale.

**Output:** `stardust/pages/*.html` (84 files).

---

### Phase D · Platform / migration (separate effort, not in this plan)

Once prototypes and rendered pages are approved, the handoff to a build platform (AEM Edge Delivery, Sanity + Next, Framer, Webflow, etc.) is a **mechanical translation** of the HTML+CSS into that platform's authoring model. Platform selection, headless CMS choice, content-authoring workflow, SEO migration, hosting, and analytics are all Phase-D concerns and intentionally left out of this plan. Resolve them once the design is approved.

---

## 3 · Deliverables summary

By the end of Phase C, the project has:

- `stardust/brand-profile.json` — brand source of truth (done)
- `stardust/brand-board.html` — visual brand reference (done)
- `.impeccable.md` — design personality (done)
- `stardust/PLAN.md` — this document
- `stardust/prototypes/home-b.html` — approved home page (done)
- `stardust/prototypes/home-a.html` — retained variant A (done)
- `stardust/prototypes/{template-slug}.html` — 12 template prototypes (Phase B)
- `stardust/prototypes/_tokens.css` — shared design tokens (Phase B)
- `stardust/briefings/{slug}.md` — 84 page briefings with verbatim copy (Phase A)
- `stardust/pages/{slug}.html` — 84 final rendered pages (Phase C)
- `stardust/_scratch/pages/*.html` — scrape cache (tossable after Phase C)

---

## 4 · Decisions locked · 2026-04-24

1. **Scope** — Start with the 20 priority-1 pages. Continue to priority-2 and priority-3 after those are approved. Plan shape unchanged; Phases B and C pause after priority-1.
2. **Imagery** — **Reuse existing TRH photography** from the live site. Phase A scraper downloads image assets with each page; prototypes substitute them in where Unsplash placeholders currently sit. Final rights check is a pre-launch task, not a design-phase blocker.
3. **Copy fidelity** — **Targeted rewrites allowed on priority-1 pages.** Verbatim is the default; any rewrite is tagged in the briefing frontmatter as `copy_edited: true` with a short justification, so a human editor can review every change.
4. **FAQ & stories sources** — **Snapshot only for now.** Capture whatever the live site renders. CMS re-wiring is a Phase-D platform concern.
5. **Holiday / campaign pages** — **Skipped.** T-14 and `/holiday1–6/` are dropped from the rebuild. Decision recorded; any future seasonal page gets a fresh briefing when needed.

### The 20 priority-1 pages

| # | URL | Template | Reason |
|---|---|---|---|
| 1 | `/` | T-01 Home | Done · `home-b.html` |
| 2 | `/get-help/` | T-02 Pillar hub | Crisis-audience entry |
| 3 | `/give-main/` | T-02 Pillar hub | Donor entry |
| 4 | `/get-involved/` | T-02 Pillar hub | Volunteer/advocate entry |
| 5 | `/about-us/` | T-02 Pillar hub | Credibility entry |
| 6 | `/shelter/` | T-03 Service detail | Most-searched service |
| 7 | `/emergency-services/` | T-03 Service detail | Crisis triage |
| 8 | `/palmer-court/` | T-03 Service detail | Flagship housing program |
| 9 | `/resource-centers/` | T-03 Service detail | Physical locations |
| 10 | `/housing-programs/` | T-03 Service detail | Housing hub |
| 11 | `/donate/` | T-04 Donate flow | Primary CTA destination |
| 12 | `/housing-champions/` | T-04 Donate flow | Recurring-giving program |
| 13 | `/give-main/legacy-planned/` | T-05 Giving-method | Major-gift lane |
| 14 | `/where-does-it-go/` | T-06 Transparency | Donor-trust surface |
| 15 | `/annual-reports/` | T-06 Transparency | Public accountability |
| 16 | `/meet-the-team/` | T-07 People directory | Human credibility |
| 17 | `/board-of-trustees/` | T-07 People directory | Governance |
| 18 | `/housing-stories/` | T-09 Stories listing | Human-first evidence (core to design personality) |
| 19 | `/faq/` | T-12 FAQ | High-traffic support |
| 20 | `/contact-us/` | T-11 Form | Generic reach-out |
| 21 | `/history/` | T-13 History timeline | Centennial narrative |

(21 listed — the user picked "top 20"; `/history/` is the 21st and worth flagging since the centennial is the current org narrative. Pick 20 or keep all 21.)

### Templates needed for priority-1

Ten new prototypes to cover 20 pages (home already done):

- **T-02** Pillar hub — 4 pages
- **T-03** Service detail — 5 pages
- **T-04** Donate flow — 2 pages
- **T-05** Giving-method detail — 1 page
- **T-06** Transparency — 2 pages
- **T-07** People directory — 2 pages
- **T-09** Stories listing — 1 page
- **T-11** Form page — 1 page
- **T-12** FAQ — 1 page
- **T-13** History timeline — 1 page

---

## 5 · Standing requirements for every prototype

Every prototype (Phase B template and the home already done) obeys:

- **Responsive by default.** Breakpoints: ≥1200 desktop · ≤900 tablet · ≤520 mobile. Driven by `:root` token overrides inside `@media` blocks so the type scale and spacing scale together. A prototype that only renders at 1440 is not done.
- Shares `:root` tokens with `home-b.html` via `stardust/prototypes/_tokens.css` — no per-page re-invention of palette, type scale, or spacing.
- Obeys every rule in `.impeccable.md`: no hero CTA button, DONATE lives in the sticky nav, teal-only palette, no stock-nonprofit or startup-design tropes.
- Uses real TRH copy (verbatim or explicitly flagged `copy_edited: true`) and real TRH imagery (downloaded in Phase A1).

## 6 · Autonomous execution schedule

The user has authorized a single autonomous run covering Phases A → B → C for the 20 priority-1 pages (history dropped to keep scope at 20). Execution proceeds without stopping for questions; all defaults are recorded in this section and logged in `stardust/EXECUTION_LOG.md` as steps complete.

### Fixed defaults (no re-asking)

- **Pages:** 20 (no `/history/`). If a page 404s or fails to scrape, it's skipped with an entry in the execution log — not re-prompted.
- **Imagery:** Reuse TRH photos. Scraper downloads every image inside the main content area above 150×150 px to `stardust/assets/pages/{slug}/`. Missing images fall back to Unsplash placeholder that matches `.impeccable.md` photography direction — logged per section.
- **Copy:** Verbatim by default. Targeted rewrites only when the live copy (a) repeats across 3+ sections on the same page, (b) stacks 3+ identical CTAs in one section (violates `.impeccable.md` quiet-hero bend), or (c) is obviously broken WordPress placeholder. Every rewrite gets `copy_edited: true` + a reason in the briefing frontmatter.
- **Template reuse:** The 10 templates share the home-b grammar via `stardust/prototypes/_tokens.css`. Each template is built once as a self-contained HTML that *is* one of the real pages. The remaining real pages derive from their template by substituting copy.
- **Nav links:** The global nav is rewritten to point to the real page files (e.g., `get-help.html`, `donate.html`) so the prototype is a browsable site, not an anchor-only homepage.
- **Index page:** An `index.html` at the root of `stardust/pages/` (and at project root) lists every rendered page for easy inspection when the user returns.

### Step-by-step execution plan

| # | Step | Output | Notes |
|---|---|---|---|
| **A1** | Playwright-crawl the 20 pages + download images | `stardust/_scratch/pages/{slug}.html`, `stardust/assets/pages/{slug}/*` | Single batch script. Retries once per page. |
| **A2** | Parse scraped HTML → briefing per page | `stardust/briefings/{slug}.md` (20 files) | Template: frontmatter + `# Intent` + `# Audience` + `# Sections` + `# Copy` (verbatim) + `# Imagery` (paths) |
| **A3** | Record scraped metadata in `stardust/EXECUTION_LOG.md` | log entry | page titles, word counts, image counts, any failures |
| **B-0** | Write `stardust/prototypes/_tokens.css` | tokens file | Extracted from home-b's `:root`. Imported by every prototype + page. |
| **B-1** | **T-02 Pillar Hub prototype** → page for `/get-help/` | `stardust/pages/get-help.html` | 4 pages will reuse this structure (get-help, give-main, get-involved, about-us). Responsive. |
| **B-2** | **T-03 Service Detail prototype** → `/shelter/` | `stardust/pages/shelter.html` | 5 pages will reuse. Hero photo + at-a-glance sidebar + narrative + location + related. |
| **B-3** | **T-04 Donate prototype** → `/donate/` | `stardust/pages/donate.html` | 2 pages. Amount picker, monthly/one-time tabs, impact math, secure-checkout cues. |
| **B-4** | **T-05 Giving-method prototype** → `/give-main/legacy-planned/` | `stardust/pages/legacy-planned.html` | 1 page priority-1. Document-style with TOC + advisor contact. |
| **B-5** | **T-06 Transparency prototype** → `/where-does-it-go/` | `stardust/pages/where-does-it-go.html` | 2 pages. Data-forward with pie/bar visualizations (pure CSS). |
| **B-6** | **T-07 People Directory prototype** → `/meet-the-team/` | `stardust/pages/meet-the-team.html` | 2 pages. Filterable photo-card grid with bio toggles. |
| **B-7** | **T-09 Stories Listing prototype** → `/housing-stories/` | `stardust/pages/housing-stories.html` | 1 page priority-1. Editorial magazine grid. |
| **B-8** | **T-11 Form prototype** → `/contact-us/` | `stardust/pages/contact-us.html` | Context sidebar + form with TRH's real fields. |
| **B-9** | **T-12 FAQ prototype** → `/faq/` | `stardust/pages/faq.html` | Categorized accordion (CSS-only via `<details>`). |
| **C-1** | Render remaining pillar hubs from T-02 | `give-main.html`, `get-involved.html`, `about-us.html` | Swap copy + hero image; keep structure. |
| **C-2** | Render remaining service details from T-03 | `emergency-services.html`, `palmer-court.html`, `resource-centers.html`, `housing-programs.html` | Same |
| **C-3** | Render remaining donate from T-04 | `housing-champions.html` | Same |
| **C-4** | Render remaining transparency from T-06 | `annual-reports.html` | Same |
| **C-5** | Render remaining people directory from T-07 | `board-of-trustees.html` | Same |
| **Z-1** | Rewire home-b nav to real pages | updated `home-b.html` | anchor hrefs → real page filenames |
| **Z-2** | Write site index / sitemap page | `stardust/pages/index.html` | grid of all 20 pages with thumbnails |
| **Z-3** | Summarize execution in log | `stardust/EXECUTION_LOG.md` | final report: pages done, pages skipped, known issues, what still needs human review |

### File layout at end of run

```
stardust/
├── PLAN.md                         ← this document
├── EXECUTION_LOG.md                ← honest log written during the run
├── brand-profile.json
├── brand-board.html
├── assets/
│   ├── logo.png
│   └── pages/{slug}/...            ← downloaded TRH imagery
├── briefings/
│   └── {slug}.md                   ← 20 briefings
├── prototypes/
│   ├── _tokens.css                 ← shared token system
│   ├── home-a.html                 ← design history
│   └── home-b.html                 ← approved home (responsive, nav-wired)
├── pages/
│   ├── index.html                  ← site-map landing
│   ├── get-help.html               ← pillar hub — T-02
│   ├── give-main.html              ← T-02
│   ├── get-involved.html           ← T-02
│   ├── about-us.html               ← T-02
│   ├── shelter.html                ← service detail — T-03
│   ├── emergency-services.html     ← T-03
│   ├── palmer-court.html           ← T-03
│   ├── resource-centers.html       ← T-03
│   ├── housing-programs.html       ← T-03
│   ├── donate.html                 ← donate flow — T-04
│   ├── housing-champions.html      ← T-04
│   ├── legacy-planned.html         ← giving method — T-05
│   ├── where-does-it-go.html       ← transparency — T-06
│   ├── annual-reports.html         ← T-06
│   ├── meet-the-team.html          ← people — T-07
│   ├── board-of-trustees.html      ← T-07
│   ├── housing-stories.html        ← stories — T-09
│   ├── contact-us.html             ← form — T-11
│   └── faq.html                    ← FAQ — T-12
└── _scratch/...
```

### Explicit scope cuts (honesty)

- No real form submission (all forms are POST-less HTML).
- No individual story detail pages — only the listing.
- No individual team-member detail pages — only directories.
- No CMS wiring. FAQ and Stories render whatever content the scraper captured.
- No real payment integration on donate pages — only the UI.
- `/history/` is not built in this run.
- Priority-2 and priority-3 pages (~64 more) are not touched. Links to them from the priority-1 pages may dead-end — the index page notes this.
- If any page scrapes with < 100 words of usable copy, it's built with the structure from its template and the briefing flags `copy_incomplete: true`.

### Stop conditions (when I will halt and report without completing)

- If the site blocks Playwright repeatedly (unlikely but possible) → halt after 3 retries per page, document in log, keep going on remaining pages.
- If a template prototype has structural issues I can't resolve cleanly within ~20 minutes → ship the best version, flag it in the log for manual review.
- If total elapsed exceeds 3 hours → write EXECUTION_LOG summarizing what's done and stop. Incomplete pages get a clear "not yet rendered" placeholder page.

This plan is the contract for the run. The user should open `stardust/pages/index.html` first when returning to see the browsable site, then check `EXECUTION_LOG.md` for the honest report.
