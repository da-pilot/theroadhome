# The Road Home — phase-2 plan · ship to stakeholder

End-to-end plan covering the remaining work to deliver the final site. Designed to be executed autonomously in one run; all decisions are locked up front so execution does not pause for questions.

**Status at the start of this run (as of 2026-04-24)**
- Brand · personality · tokens system · 20 priority-1 pages · all complete and responsive
- Home page (variant B) critiqued + fixed (typeset, emergency ribbon, services asymmetry, dead-link harden, polish)
- Remaining 19 priority-1 pages have inherited the shared token changes but have **not** been individually critiqued
- Priority-2 (~40 pages) and priority-3 (~24 pages) are not yet scraped or rendered

**Deliverable at the end of this run**
- `/index.html` (project root) still the stakeholder entry point
- `stardust/pages/` populated with every non-holiday real page from theroadhome.org (~64 more HTML files on top of the 20 already there)
- `stardust/pages/sitemap.html` updated to list every page
- `stardust/VALIDATION_REPORT.md` summarizing link, image, and consistency checks + the fixes applied
- `stardust/EXECUTION_LOG.md` appended with honest notes on what was completed, what was stubbed, what needs human review

---

## Decisions locked · no re-asking

1. **Scope.** Every non-holiday, non-test page from theroadhome.org's `page-sitemap.xml` — ~64 pages in addition to the 20 already done. Holiday1–6, sample-page, test pages, and asset URLs stay excluded (per PLAN.md §4).
2. **Imagery.** Reuse TRH photography from the scrape; Unsplash placeholder for slots with no TRH asset. Production must swap in real photography before ship (flagged in the validation report).
3. **Copy.** Verbatim from the live site by default. Targeted rewrite only when (a) the live copy is Lorem ipsum or an obviously-broken placeholder, (b) the live copy repeats itself in-page, or (c) the live page's architecture is incoherent (e.g. `/palmer-court/` = volunteer page — restore to program detail). Every rewrite gets `copy_edited: true` + reason in the briefing frontmatter.
4. **New templates.** Four are required to cover the remaining clusters: **T-08 Person detail**, **T-10 Get-involved program detail**, **T-13 History / timeline**, **T-15 Legal / policy**. Each gets built once as the page that best represents the cluster, then reused for siblings.
5. **Stub policy.** Priority-3 pages that don't materially change the user journey (decades of old fundraisers, personal-page variants, one-off holidays we already excluded) get a **styled stub page**: same nav + footer + breadcrumbs, a single "This page is part of the site rebuild but has not yet been prioritized. Content is available on the live site at theroadhome.org/<slug>." card, and navigation back to the relevant pillar. Stubs count as "delivered but incomplete" in the final log.
6. **Critique pass.** Cover the remaining 19 priority-1 pages via a **sampled critique**: one representative per template type. Findings that apply globally are fixed once in `_tokens.css` or via a page-wide sweep. Per-page findings on representative pages are fixed individually; derivative pages inherit automatically.
7. **Validation.** Every HTML file under `stardust/pages/*.html` runs through (a) a link-health checker (verify every `href` points to either an existing file, an external URL, a `tel:`/`mailto:` scheme, or an in-page anchor that exists), (b) an image-load check (verify every `<img src>` and background-image URL returns an OK response), and (c) a consistency grep sweep (nav structure, footer structure, token usage, and palette discipline). Every issue found is logged; every fix is logged.
8. **Stop conditions.** If total elapsed exceeds **4 hours**, the run writes a partial validation report and stops; whatever is rendered stays rendered. No page that was partially started is left in a half-broken state — each page either ships complete or is replaced by a stub.

---

## Phase 1 · Finish the critique (remaining 19 priority-1 pages)

**Goal.** One consolidated list of cross-page design issues, plus page-specific issues on each template representative. Fix globally where possible; fix locally where needed.

### Step 1 · Representative sample (1 page per template)

For each of the 8 templates represented in priority-1 (other than T-01 Home, which is done), pick one representative page to critique:

| Template | Representative page |
|---|---|
| T-02 Pillar hub | `get-help.html` (the crisis-audience entry; the other three pillar hubs are derivatives) |
| T-03 Service detail | `shelter.html` |
| T-04 Donate flow | `donate.html` |
| T-05 Giving-method detail | `legacy-planned.html` |
| T-06 Transparency | `where-does-it-go.html` |
| T-07 People directory | `meet-the-team.html` |
| T-09 Stories listing | `housing-stories.html` |
| T-11 Form | `contact-us.html` |
| T-12 FAQ | `faq.html` |

### Step 2 · Run two-pass critique per representative (9 pages)

For each, run both passes from the `impeccable:critique` skill:
- **Assessment A** — sub-agent LLM design review against the DON'T guidelines, Nielsen's 10 heuristics, cognitive-load checklist, persona walkthroughs
- **Assessment B** — `npx impeccable --json <page>` detector

Collect all findings into `stardust/_scratch/critique-phase1.json`.

### Step 3 · Classify findings

Walk the findings and bucket each into:
- **Global** — fix once in `_tokens.css` or by sweeping all `pages/*.html`
- **Template-level** — fix in the representative; re-render derivatives from the fixed template
- **Page-specific** — fix inline

### Step 4 · Apply fixes

Apply fixes in this order: global first, then template-level, then page-specific. Re-check a subset by running the detector on 3 random pages after fixes.

**Expected outputs:**
- Updated `_tokens.css` (if global fixes apply)
- Updated representative pages
- Appended log in `EXECUTION_LOG.md` listing each fix and the page(s) it affected

---

## Phase 2 · Migrate remaining pages (~64)

**Goal.** Render every non-holiday, non-test page from the live site. Use existing templates where they fit; build new templates for the four gaps (T-08, T-10, T-13, T-15).

### Step 1 · Crawl the remaining pages (~64 URLs)

Extend `stardust/_scratch/crawl.js` to cover the priority-2 and priority-3 targets. Target list is derived from `page-sitemap.xml` minus the 20 already scraped and minus the exclusions.

**Priority-2 cluster (40 pages — full templates, real copy):**

| Cluster | Target template | Pages |
|---|---|---|
| Service / program detail | T-03 | `/mens-resource-center/`, `/midvale-family-resource-center/`, `/housing-navigation-program/`, `/all-housing-programs/`, `/permanent-housing/`, `/landlord-resources/`, `/community-referral-page/`, `/insurance/` |
| Donate flow | T-04 | `/one-time-donation/`, `/recurring-donation/`, `/donation-form/`, `/housing-champions-2/`, `/housing-champions-donation/`, `/donate-2/`, `/item-donations/`, `/in-honor-and-memory/`, `/double-donation/` |
| Giving-method detail | T-05 | `/give-main/real-property/`, `/give-main/trusts/`, `/give-main/life-insurance/`, `/give-main/donor-advised-fund/`, `/give-main/stock-wire-transfer/`, `/give-main/in-kind-donations/`, `/give-main/donor-bill-of-rights/`, `/give-main/manage-donations/`, `/other-ways-to-give/` |
| Transparency | T-06 | `/data-finances/`, `/data-dashboard/` |
| People directory | T-07 | `/case-management-team/` |
| Person detail | **T-08 (new)** | `/michelle-flynn/` |
| Stories listing | T-09 | `/moments-that-matter/`, `/team-stories/`, `/videos/`, `/blog/`, `/media-center/` |
| Get-involved program | **T-10 (new)** | `/fundraiser/`, `/mediathon/`, `/sponsor-page/`, `/eagle-scouts/`, `/events/`, `/internships/`, `/court-ordered-volunteering/`, `/get-involved/careers/`, `/careers-positions/` |
| Form | T-11 | `/mvpreferral/`, `/get-help/mvpfacility/`, `/stvinnyreferral/`, `/ssvf-referral/`, `/tanf-rapid-rehousing-program-referral-form/`, `/fundraiser-form/`, `/trh-feedback-form/`, `/secure-file-upload/`, `/tell-your-story/` |
| History timeline | **T-13 (new)** | `/history/`, `/centennialcelebration/`, `/decades/`, `/awards/` |
| Legal | **T-15 (new)** | `/privacy-policy/` |
| Singleton | — | `/item/` (likely a catalog page — render as T-09 stub or skip based on content) |

**Priority-3 cluster (~24 pages — stub policy):**
Any remaining URL in `page-sitemap.xml` that does not fall into the above table gets a styled stub per the stub policy in §5 of the locked decisions. Expected stubs: `/holiday*/` already excluded; any one-off fundraiser pages or old landing pages from previous campaigns.

### Step 2 · Build the four new templates

Build each once using the best-fit priority-2 page as the representative:

- **T-08 Person detail** — render as `michelle-flynn.html`. Structure: hero portrait + bio + signed CEO letter + role strip + "read more stories" cross-link.
- **T-10 Get-involved program detail** — render as `fundraiser.html`. Structure: hero + at-a-glance sidebar (age, time commitment, cost) + narrative + how to sign up + related opportunities + volunteer-contact band. Similar to T-03 but tuned for volunteer vs. crisis audience.
- **T-13 History / timeline** — render as `history.html`. Structure: hero + long editorial + decade anchors (1920s → 2020s) with period photography + milestones list + "where we are now" close. Uses Source Serif 4 for editorial specimen.
- **T-15 Legal / policy** — render as `privacy-policy.html`. Structure: hero (no image) + sticky TOC + long-form prose (sections, subsections) + last-updated badge + contact for questions.

Each template gets added to the stardust catalog with a one-line description and reuses `_tokens.css` exclusively (no new tokens unless genuinely missing from the system).

### Step 3 · Build briefings for the ~64 pages

Same format as the existing briefings. Frontmatter + Intent + Audience + Sections + verbatim #Copy + #Imagery. One briefing per real page. Stubs get a minimal stub briefing.

### Step 4 · Render every page

**Template reuse strategy.** For pages that share a template with a completed sibling, render mechanically: read the briefing, read the template's HTML, substitute the page-specific blocks (hero copy, eyebrow, main content, breadcrumbs), write to `stardust/pages/{slug}.html`.

For new-template pages (T-08, T-10, T-13, T-15), render the representative by hand, then batch the siblings with substitution.

**Stub renderer.** For priority-3 pages: read the briefing, render a generic stub-page template (nav + breadcrumbs + stub-card + footer) and write to disk. Same CSS system.

### Step 5 · Update the sitemap

Rewrite `stardust/pages/sitemap.html` to list every rendered page — full set, grouped by template — and to flag stubs separately from full pages.

**Expected outputs:**
- `stardust/briefings/*.md` grows from 19 to ~83 files
- `stardust/pages/*.html` grows from 21 (including sitemap + index) to ~85 files
- Four new template prototypes rendered as their representative pages
- Updated sitemap

---

## Phase 3 · Site validation

**Goal.** A concrete, auditable proof that the site is ready to hand to a stakeholder. Every link works or is flagged; every image loads or has a fallback; every page uses the shared system consistently.

### Step 1 · Link health check

Write `stardust/_scratch/check-links.js`. Walk every `stardust/pages/*.html`. For each `<a href>`:
- `https?://*` external — `HEAD` request; 200–399 = OK; 4xx/5xx/timeout = flagged
- `tel:` and `mailto:` — format-validate only; no network
- `#anchor` — verify the anchor exists in the same page (`id` attribute present)
- `*.html` (relative) — verify the file exists under `stardust/pages/`
- Other — flag as suspicious

Output: `stardust/_scratch/links-report.json` — per-page list of broken / suspicious links.

### Step 2 · Image health check

Same pattern for every `<img src>` and every inline `background-image:url(...)` on every page. Local files resolved against `stardust/assets/`. External URLs (Unsplash CDN) pinged with `HEAD`. Any 4xx/5xx gets flagged.

Output: `stardust/_scratch/images-report.json`.

### Step 3 · Design consistency sweep

Deterministic grep-style checks:
- Every page imports `_tokens.css` OR (for home-b/home-a and index.html) has inline tokens that match the shared system
- Every page has the same top utility bar structure and nav structure (sanity regex)
- Every page's footer uses `<footer class="site">` (or the identical inline equivalent on home) and has the same 5-column layout
- No page uses a fresh `#cd2653` pink or `#f5efe0` cream (pulled into brand-profile as "WP theme defaults, not real brand")
- No page uses a font other than Archivo / Public Sans / Source Serif 4 — grep for `font-family:` and flag deviations
- No page has `border-left: Xpx solid` with X > 1 (the absolute-ban check from `.impeccable.md`)
- No page has `background-clip: text` (gradient text ban)

Output: `stardust/_scratch/consistency-report.json`.

### Step 4 · Critique sweep on random sample

Pick 5 random pages from the full set and run `npx impeccable --json` on each. Any NEW antipattern that wasn't in the Phase-1 findings gets escalated.

### Step 5 · Apply fixes

For each issue found:
- **Broken internal link** → either point to the correct file or convert to a styled "not yet available" link
- **Broken image** → swap to a Unsplash fallback matched to the image's intent (portrait, building, data, etc.) + log it
- **Inconsistency** → fix in `_tokens.css` or sweep all pages
- **New critique finding** → evaluate: if global, fix in tokens; if single-page, fix inline

Re-run steps 1–3 after fixes until the reports are clean OR the run is at its time budget.

### Step 6 · Write the validation report

`stardust/VALIDATION_REPORT.md` — a clean, stakeholder-readable summary:
- Total pages shipped (full vs. stubbed)
- Link health: N/N OK, M/N flagged (with the flagged list)
- Image health: same
- Design consistency: any deviations + the reason they weren't fixed (if any)
- Residual known issues (e.g., "Darnell's pull-quote is fictional — must be replaced with a real client story before ship")
- What to do before handoff to a production platform (Phase D from the original PLAN)

---

## File deliverables summary

By the end of the run, the tree should look like:

```
theroadhouse/
├── index.html                                   ← stakeholder landing (unchanged)
├── .impeccable.md
├── stardust/
│   ├── brand-profile.json
│   ├── brand-board.html
│   ├── PLAN.md                                   ← original plan
│   ├── PLAN2.md                                  ← this document
│   ├── EXECUTION_LOG.md                          ← appended with Phase-1/2/3 notes
│   ├── VALIDATION_REPORT.md                      ← new · stakeholder-readable
│   ├── assets/
│   ├── briefings/                                ← grows to ~83 files
│   ├── prototypes/
│   │   ├── _tokens.css                           ← may gain fixes from Phase 1
│   │   ├── home-a.html
│   │   └── home-b.html
│   └── pages/                                    ← grows to ~85 files
│       ├── index.html
│       ├── sitemap.html                          ← rewritten to list everything
│       ├── (20 existing priority-1 pages)
│       ├── (~40 priority-2 pages, full templates)
│       ├── (~24 priority-3 pages, styled stubs)
│       └── (new template originals for T-08, T-10, T-13, T-15)
```

---

## Stop conditions (same shape as the Phase-1 plan)

- Elapsed > 4 hours → write partial `VALIDATION_REPORT.md` explaining where the run stopped, and stop.
- A single page blocks the render (asset fetch loop, bad content from the scraper) → skip it with a log entry, keep going.
- Playwright blocked by the source site repeatedly → fall back to serving whatever content the Phase-1 scrape already captured; do not re-attempt per page beyond 3 retries.
- A new antipattern that triggers a `/typeset`-level redesign mid-run → defer that fix to the validation report as a recommendation, do not attempt to re-typeset mid-run.

---

## What I will NOT do (explicit scope caps)

- I will not change the brand palette, the typography pair, or the `_tokens.css` architecture beyond what Phase-1 critique demands.
- I will not touch home-a.html (retained as design history).
- I will not migrate blog posts, individual story pages, or individual team-member detail pages beyond what's in `page-sitemap.xml` (the team/story sitemaps contain a separate long tail that's out of scope for this run).
- I will not implement real form submission, payment integration, CMS wiring, platform handoff, or production image optimization. Those remain Phase-D concerns.
- I will not produce marketing copy, campaign pages, or fundraising event pages beyond what the live site already carries.

---

## Open for approval

This is the contract for the autonomous run. Confirm to execute.
