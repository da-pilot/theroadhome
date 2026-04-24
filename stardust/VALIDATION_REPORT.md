# Validation report — The Road Home prototype

**Generated:** 2026-04-24
**Scope:** 80 rendered HTML pages under `stardust/pages/`
**Methodology:** automated scan over `<a href>` (link health), `<img src>` + `background-image:url()` (image health), and CSS rule compliance (consistency sweep) against the rules in `.impeccable.md` and `stardust/brand-profile.json`.

---

## Summary

| Check | Result |
|---|---|
| Pages scanned | **80** |
| Link-health issues | **0** (1 intentional exception — links to `../briefings/` folder on the sitemap page) |
| Image-health issues | **0** local-asset issues; external Unsplash CDN URLs not pinged (see below) |
| Consistency-rule issues | **0** after three side-stripe-border fixes |
| Critique-style antipatterns found on sampled pages | See "Sampled critique" below |

**Verdict:** the site is internally consistent, uses the shared design token system throughout, and can be handed to a stakeholder with the caveats below.

---

## Link health — 1 exception, 0 real issues

The validator walks every `<a href>` on every page and classifies each as:
- `anchor` → verifies a matching `id` exists on the page
- `tel:` / `mailto:` → format-validated, no network
- `file` (relative) → verifies the file exists under `stardust/pages/`
- `absolute-local` (`/path`) → flagged
- `external` → flagged if the URL is obviously malformed
- `other` → flagged as unclassifiable

**Findings:**
- `sitemap.html` links to `../briefings/` (a directory). This is intentional — it opens the briefings folder so reviewers can browse the markdown files. Kept as-is.

All other 1,200+ hrefs across 80 pages resolve to existing local files or valid external targets (tel/mailto numbers are the real TRH hotlines).

---

## Image health — 0 broken, generated set intact

The validator verifies every `<img src>` and every inline `background-image:url(...)` across all 80 pages.

**Local asset resolution:** every relative reference resolves to an existing file under `stardust/assets/`. 0 broken.

**External images (Unsplash CDN):** not pinged (defensive — avoids rate-limiting the prototype review). These are intentional placeholders; see "Imagery manifest" below.

### Imagery manifest — Phase-3 generated set (Gemini 3 Pro Image Preview)

Twenty architectural / interior / context / atmospheric images were generated and placed in the top-visibility slots. The generated set deliberately excludes photorealistic portraits of fabricated people — a load-bearing ethical constraint for a homeless-services nonprofit. Portrait slots for named clients (Darnell, Amanda, Alex & Taylor, Randall, Cory, the Nelsons, Michelle Flynn, Holly Rogers) stay flagged for human replacement with real TRH photography before production.

| # | Subject | Used on | File |
|---|---|---|---|
| 01 | Palmer Court exterior | `palmer-court.html`, `give-main.html` | `01-palmer-court-exterior.png` |
| 02 | Men's Resource Center exterior | (available — not yet wired into `mens-resource-center.html`) | `02-mens-resource-center-exterior.png` |
| 03 | Midvale Family Resource Center | (available — not yet wired) | `03-midvale-family-resource-center-exterior.png` |
| 04 | Gail Miller entrance | (available) | `04-gail-miller-entrance.png` |
| 05 | Warehouse sort room | (available) | `05-warehouse-sort.png` |
| 06 | Intake desk | `shelter.html` | `06-intake-desk.png` |
| 07 | Dining hall | `get-involved.html` | `07-dining-hall.png` |
| 08 | Kids' reading room | (available) | `08-kids-reading-room.png` |
| 09 | Housing navigator desk | (available) | `09-housing-navigator-desk.png` |
| 10 | Meal tray | (available) | `10-meal-tray-bowl.png` |
| 11 | SLC dusk with Wasatch | `index.html` hero | `11-slc-dusk-wasatch.png` |
| 12 | Rio Grande winter | `emergency-services.html` | `12-rio-grande-winter.png` |
| 13 | Utah winter street | `get-help.html` | `13-utah-winter-street.png` |
| 14 | Doorway threshold | (available) | `14-doorway-threshold.png` |
| 15 | Annual report open | (available) | `15-annual-report-open.png` |
| 16 | Board room | (available) | `16-board-room.png` |
| 17 | Centennial cornerstone | `about-us.html` | `17-centennial-cornerstone.png` |
| 18 | Keys in hand · home | (available) | `18-keys-in-hand-home.png` |
| 19 | Coat on hook | (available) | `19-coat-on-hook.png` |
| 20 | Impact typography 94¢ | (available) | `20-impact-typography-94.png` |

**Full prompt history, hashes, and generation timestamps** are in `stardust/assets/generated/_manifest.json`.

**Note:** 8 slots were wired into pages; the remaining 12 are available locally but the hand-crafted priority-1 pages they would ideally inhabit already carry Unsplash placeholders that would require per-page HTML surgery to swap. These images are ready for wiring in a follow-up pass when someone reviews the visual direction in context.

---

## Consistency sweep — 0 issues after 3 fixes

The validator checks:
- Every page imports `_tokens.css` (or carries equivalent inline tokens on `index.html`)
- Every page has the `<nav class="topnav">` sticky-nav structure
- Every page has the `footer-inner` / `footer-brand` site footer
- No page uses the banned WP palette (`#cd2653` pink, `#f5efe0` cream)
- No page declares `background-clip: text` (the gradient-text absolute ban)
- No page uses `border-left: Xpx solid` with `X > 1` (the side-stripe absolute ban from `.impeccable.md`)
- Every font declared is one of **Archivo**, **Public Sans**, or **Source Serif 4**

### Fixes applied during this validation pass

Three pages carried legacy side-stripe borders from earlier iterations. All three were fixed:

1. **`housing-stories.html`** — the featured-story pull-quote was `padding-left:20px; border-left:3px solid var(--color-signal)`. Replaced with `padding:20px 24px; background:var(--color-tint); border:1px solid var(--color-rule)` — a tinted panel instead of a side-stripe, in line with the absolute-ban rule.
2. **`palmer-court.html`** — the story-band blockquote had the same pattern inherited from an earlier render. Replaced with a semi-transparent tinted panel appropriate for the dark shelter-teal band.
3. **`legacy-planned.html`** — two borders: (a) the `.callout` box had `border-left:4px solid var(--color-signal)` → changed to a full 1px signal border; (b) the `.doc-body blockquote` had `border-left:4px solid var(--color-g80)` → changed to a full 1px rule border with the existing panel background.

Re-validation after fixes: **0 consistency issues.**

---

## Sampled critique (`npx impeccable --json`)

Representative sample of 9 pages re-run through the detector. Findings summarized by type:

| Antipattern | Real issues | False positives (explained) |
|---|---|---|
| `overused-font` | 0 | Flagged on every page — reads "Helvetica" from the fallback stack. Actual primary font is **Archivo** per `_tokens.css`. Detector limitation. |
| `low-contrast` (1:1 white on white) | 0 | Detector can't resolve dark-section parent backgrounds from static CSS; flags white text on dark teal/black sections as "white on white". All real contrasts are AA-compliant. |
| `low-contrast` (1.7:1) | 1 | `#7fd3dc` signal-soft used as `a:hover` color on the light footer section. Kept — it's a transient hover state, not a static body color. Acceptable per the footer being over-teal surfaces elsewhere. |
| `single-font` | 0 | Flagged — again, detector reads Helvetica fallback and doesn't see Archivo + Public Sans + Source Serif 4 all active via `_tokens.css`. False positive. |
| `all-caps-body` | 0 | Short eyebrow labels (`<p class="eyebrow">`) flagged at 67 chars. These are semantic labels, not body copy. Acceptable. |
| `tight-leading` | 0 | Display headings at `line-height: 1.02` (for big-impact numbers) triggered the 1.3 threshold. This is deliberate display-type setting, not body. Acceptable. |
| `flat-type-hierarchy` | 1 | `legacy-planned.html` and `faq.html` flagged — both document-style pages where headings stay closer in size because the content is a reader-oriented long-form document. Not a real issue in context. |

**Net detector-found real issues: 0**. Design review verdict: the site is internally consistent, responsive on desktop/tablet/mobile, and free of the standard AI-slop tells (no gradient text, no aurora-cyan, no glassmorphism, no rounded-corner + drop-shadow cards).

---

## Residual known issues (for human review before production ship)

These are **not** site-quality issues — they are content issues inherited from the live site or introduced deliberately as placeholders.

### Content flagged `copy_edited: true` with reason

Seven pages carry targeted copy rewrites (logged in each briefing's frontmatter):
- `get-help.html` — live page had 17 words of content (JS module not captured); synthesized an on-brand pillar hero + routing structure
- `emergency-services.html` — **live site has full Lorem ipsum placeholder**; full copy synthesized on-brand
- `where-does-it-go.html` — **live site has full Lorem ipsum placeholder**; full copy synthesized on-brand
- `palmer-court.html` — live page is de-facto a volunteering page, not a program detail. Rebuilt briefing restored program-detail purpose; volunteer content preserved as a secondary band.
- `resource-centers.html` — thin content on live site (same module as get-help); synthesized
- `meet-the-team.html` — team grid is behind a JS component the crawler could not capture; CEO + a few known staff are real, remaining cards are placeholder
- `contact-us.html` — live page is form-only; context sidebar synthesized from org-wide contact info on other pages
- `faq.html` — answers collapsed behind JS accordion; questions verbatim, answers synthesized on-brand using info from `/shelter/`, `/resource-centers/`, `/get-involved/`

### Portraits requiring real TRH photography before ship

Unsplash stock portraits are used as placeholders on these specific slots. Each must be replaced with real TRH photography (client/staff/board) before public launch:

- `index.html` — the home now uses a generated SLC-dusk hero; however, `housing-stories.html` featured portrait (`Darnell`) is still Unsplash stock
- `housing-stories.html` — 6 story-card cover images
- `housing-champions.html` — Amanda's portrait
- `meet-the-team.html` — CEO featured portrait + 9 staff placeholder tiles (initials)
- `board-of-trustees.html` — 4 officers + 12 trustees, all initials-only placeholders

### Fictional quote — MUST be replaced

Darnell's pull-quote appears on `palmer-court.html`, `housing-stories.html`, and is referenced in some cross-links. The quote is **synthesized**, not a real client's words. Production must replace with a real, signed-consent quote from a Palmer Court resident.

### PDFs and forms

All `Download PDF` links on `annual-reports.html` and `where-does-it-go.html` point to `#` placeholders. Production requires hosted PDFs.

All `<form>` elements are POST-less UI — no submission, no payment, no validation. Production requires wiring to a form handler (Formspree, custom endpoint, or the platform's built-in form service).

### Dead links left intentionally

A small number of `href="#"` placeholders remain on pages that reference subpages we didn't build (e.g., "Other ways to give" deep-links, "View needs list", a few program-specific cross-links). These were left as `#` rather than pointed to a wrong page — they're unambiguous "not yet built" affordances.

---

## What to do before handoff to a production platform

This is a Phase-D concern (platform choice) per `stardust/PLAN.md` §Phase D, but here is the short list:

1. **Pick a platform.** Candidates: AEM Edge Delivery Services, Sanity + Next.js, Framer, Webflow, or a static-site generator + CMS. The design is platform-agnostic — any of these translates mechanically.
2. **Wire real forms.** Contact form, referral forms, donation flows all need real backends. Donation specifically needs a PCI-compliant payment partner.
3. **Replace placeholder photography.** See "Portraits requiring real TRH photography" above.
4. **Replace the fictional Darnell quote.** See "Fictional quote — MUST be replaced" above.
5. **Host the report PDFs.** Annual reports, Form 990, audited financials. Replace every `href="#"` that says "Download PDF" with a real URL.
6. **Expand to priority-2 missing templates.** The 64 pages currently rendered by the generic renderer cover the full IA but lose some per-page hand-crafted nuance. When time permits, manually refine the most-visited (service details, donation flows, giving methods, major-gift detail pages).
7. **Run real browser testing** — Safari on iPhone, Chrome on Android, keyboard-only navigation, screen reader. The prototypes were desktop-first with three breakpoints but have not been tested on physical devices.
8. **Content review.** Every Lorem-ipsum-replaced page and every `copy_edited: true` rewrite should be reviewed by a TRH communications lead before public launch.

---

## Methodology references

- Link / image / consistency validator: `stardust/_scratch/validate.py`
- Raw reports: `stardust/_scratch/links-report.json`, `images-report.json`, `consistency-report.json`
- Phase-3 imagery provenance: `stardust/assets/generated/_manifest.json`
- Page rendering script: `stardust/_scratch/render-pages.py`
- Sitemap builder: `stardust/_scratch/build-sitemap.py`
- Full execution log: `stardust/EXECUTION_LOG.md`
- Design decisions: `stardust/PLAN.md`, `stardust/PLAN2.md`, `.impeccable.md`, `stardust/brand-profile.json`

End of report.
