# The Road Home — project journal

A chronological narrative of rebuilding theroadhome.org with the stardust pipeline. Written for a second team doing a similar rebuild: here is what we did, in the order we did it, with the decisions and the dead ends and what we would change about the flow next time.

---

## 1 · Starting point — "I want to rebuild this old site"

The project opened with one sentence: *"I have this old website that I want to redesign to be more modern and to run on a better platform. Let's build a prototype page for it — https://theroadhome.org/."*

The Road Home is a 100-year-old homeless-services nonprofit in Salt Lake City. The live site is a WordPress + WPBakery build, roughly 2020 vintage, carrying about 84 real pages (after filtering test pages and asset URLs). On day one we didn't know any of that — we learned it by walking the sitemap later. What we could see immediately was that the hero was a photo of a young woman on a stone ledge with "REFUGE. RESOURCES. RELIEF." in all-caps Harmonia Sans across her face, and that the DONATE button appeared four times above the fold.

We chose the stardust pipeline over a one-shot design tool because stardust has separate stages for brand extraction, design personality, and prototyping — it forces you to do the research before you type the first line of CSS. For a 100-year institution with two audiences (people in crisis, donors) that felt like the correct discipline.

**Learnings:**
- The brief users give you is almost always under-specified. "Modern" and "better platform" are aesthetic and technical requirements; the real question is *"who does the site serve and when?"* and the brief rarely answers that.
- Do not agree to a design engagement until you have looked at the live site and named at least two failure modes you can see. For TRH those were "CTA stacking" and "unlabeled phone-tree IA."

---

## 2 · Brand extraction with stardust

We invoked `/stardust:brand` pointed at theroadhome.org. The skill's contract is "drive a real browser and extract computed styles, not inline tokens." We ran Playwright at 1440×900 × deviceScaleFactor 2, took a hero screenshot and a full-page capture, then evaluated computed styles across `:root`, `<body>`, the first 15 headings, the first 6 body paragraphs, italic elements, CTAs, section backgrounds, logos, and meta tags.

The single most important thing we learned in this phase: the `:root` custom properties on a WordPress site are a **lie**. The rendered CSS showed `--wp--preset--color--accent: #cd2653` (a pink) and `--wp--preset--color--background: #f5efe0` (a cream) — but neither of these pixels was on the actual rendered page. The real palette was the teal family: `#008192` (Road Home Teal, on the DONATE button), `#005560` (Shelter Teal, on the footer), `#105560` (Dusk Teal, on the form submit). The WordPress theme had carried those pink/cream tokens forward from its template default; nobody had ever stripped them.

The site's display face was **HarmoniaSans** (Adobe Fonts), body was **DINNextLTPro**. Headlines used a triplet pattern: "REFUGE. RESOURCES. RELIEF." — three one-word sentences with periods. That triplet became a motif we preserved on every surface.

We also learned that the logo was a real PNG at `wp-content/uploads/2023/02/TRH-100-Logo_Color-for-website-header.png` — a centennial lockup with a "100" numeral beside a doorway icon. We downloaded it directly rather than synthesizing anything.

We wrote everything to `stardust/brand-profile.json` with a `_provenance` block declaring: Playwright, the screenshots, and which fields were synthesized (only `voice.examples.dont` and persona mottos — everything else was from the scrape).

**Learnings:**
- Always drive a real browser. WebFetch or raw HTML would have given us the pink-and-cream WordPress defaults and we would have shipped a visually wrong brand.
- Interrogate root-variable palettes against rendered CSS. If a color doesn't appear on any actual element, it's not part of the brand.
- Live-copy voice examples beat synthesized ones every time. "REFUGE. RESOURCES. RELIEF." and "On any given night, we have over 1,550 people in housing, in the community" could not have been invented — they had to be found.

---

## 3 · Design personality — three questions, not synthesis

After the brand board rendered, stardust offered three paths for `.impeccable.md`: run `/impeccable teach` (the designer gives a taste interview), do a short inline interview, or synthesize defaults. The user said "skip" to `teach` and answered three multiple-choice questions inline:

1. References — picked "community / human-first" (Partners In Health, Habitat for Humanity's newer sites) over editorial-nonprofit, public-utility-Swiss, or news-density options.
2. Dislikes — picked two: "stock nonprofit clichés" (hands-holding-hands, outstretched palms) AND "too-clever startup design" (aurora gradients, floating glass shapes).
3. Rule to bend — picked "every hero needs a giant CTA button" with the bend being "let the hero be a quiet statement; CTA lives in the sticky nav only."

Those three answers shaped every subsequent decision. The home page hero has no DONATE button. The services grid never stacks multiple CTAs. Photography direction explicitly bans both the nonprofit-pity register and the SaaS-marketing register. The rule-to-bend became a first-class gate in downstream critiques.

We wrote `.impeccable.md` with frontmatter `authored_by: designer, strength: strong` — because the user answered the questions themselves. When we later re-read the downstream skills, we saw that "strong" vs "synthesized" is load-bearing: a strong personality document is enforced as a quality gate; a synthesized one renders a warning banner.

**Learnings:**
- The personality document is the single highest-leverage artifact in the pipeline. Three minutes of interview changed every page.
- "Skip" → three inline questions beat "synthesize." Even a five-minute investment in taste beat the hours of cleanup we'd have done later if we'd let the assistant guess.
- Authorship-stamping matters. A designer-authored `.impeccable.md` is a hard rule; a synthesized one is a weak hint. Know which one you have.

---

## 4 · Home prototype — variants A and B

We produced two home-page variants simultaneously, per the stardust default. The axis we varied was **density × imagery-role**:

- **Variant A** (`stardust/prototypes/home-a.html`) — editorial, portrait-led, airy. 140px sections, full-bleed hero photo with a 96px triplet headline, named-subject story section with a 36px serif pull-quote, magazine rhythm. Reads like an annual-report cover.
- **Variant B** (`stardust/prototypes/home-b.html`) — civic, data-led, denser. 88px sections, split hero (half photo, half type), 160px impact number as the visual peak, horizontal "ways to help" ledger rows with inline proof numbers ($85 a night of shelter, 2,400 volunteers). Reads like a public utility's front door.

The user picked B in under a minute. The reasoning was specific: a 100-year-old institution's front door should feel institutional, not editorial. Donors want the ratios (94¢ on every dollar), and the civic register communicates trustworthiness in a way that a magazine cover doesn't.

The choice determined the rest of the project. Every template we built afterwards inherited the B register — tight grids, zero border-radius, 1px hairlines, no shadows, teal-only accents. If we'd picked A, the rest of the site would look very different.

**Learnings:**
- Present clearly distinct directions, not A/A'. If your two variants could be confused after a five-second glance, you haven't done the work.
- Commit to a register before iterating on details. Nearly every subsequent decision — type scale, section rhythm, photography direction — was easier because B was locked in.
- Retain the unchosen variant. `home-a.html` stays on disk as design history. It turned out to be useful later as a reference for what we were NOT doing.

---

## 5 · "The prototype is not responsive" — a rule added mid-session

Shortly after the home prototype was approved, the user pushed back: "before we proceed: the prototype is not responsive, fix that and apply it to all the other generated prototypes."

The stardust default is desktop-only at 1440px — the reasoning is that the downstream implementation platform should generate the breakpoints. But for a prototype that will be reviewed on a laptop and then a phone, desktop-only is indefensible. We fixed `home-b.html` with three breakpoints (≥1200 desktop / ≤900 tablet / ≤520 mobile) driven by `:root` token overrides, and then — crucially — we edited `.impeccable.md` to add the rule: *"No prototype is considered complete if it only renders at 1440px."*

Every subsequent page inherited responsive by default. Every template prototype we built afterwards had the three breakpoints at the top of its `<style>` block. When we later centralized tokens into `stardust/prototypes/_tokens.css`, the responsive breakpoints lived there and propagated automatically to every page via `@import`.

**Learnings:**
- Responsive is a rule, not a Phase-2 polish task. If the stardust default says desktop-only, override it in the personality document on day one.
- When a rule fires from user feedback, write it into `.impeccable.md` — don't just fix the one file. The rule needs to propagate to every future artifact.
- Breakpoints-in-tokens beat breakpoints-per-page. `_tokens.css` carries the media queries; pages inherit. One place to change, every page affected.

---

## 6 · The 84-page plan and the template taxonomy

Before migrating any more pages, we crawled `page-sitemap.xml`. The site carried 154 entries; after filtering asset URLs, test pages, holiday variants, and duplicates we had **84 real pages**. That number was a surprise — from the nav alone we would have guessed 20.

We clustered the 84 into **15 templates**: pillar hubs, service detail, donate flow, giving-method detail, transparency, people directory, person detail, stories listing, get-involved program, form, FAQ, history timeline, campaign, legal, and a singleton or two. Of the 15, **9 had priority-1 representatives** (pages that couldn't ship without being rebuilt); **4 were new templates** (person, volunteer program, history, legal) that had no priority-1 page; **2 were either deliberately skipped** (holidays — dead seasonal stubs) or **singletons** (an "item" page of unclear purpose).

This taxonomy drove everything: we built a template once, then rendered its siblings by copying the template and swapping copy. That's how 64 pages got rendered in the final phase from 9 template prototypes plus 4 new ones.

**Learnings:**
- Crawl the sitemap before estimating. The nav lies; the sitemap tells the truth about page count.
- Page count is not template count. 84 pages clustered into 15 templates because the IA was repetitive. A WordPress site's IA is almost always more repetitive than it looks.
- Build the template once, render the siblings mechanically. Designing 64 unique pages is a 20-person-week engagement; designing 9 prototypes and rendering siblings is a day.

---

## 7 · First autonomous run — Phase 1

The user went to lunch and asked us to complete Phase 1 (the first 20 priority pages) without supervision. We had one afternoon.

We ran the work in five stages: scrape (Playwright, 19 URLs, ~8 min), briefings (one `.md` per page with verbatim copy and `copy_edited: true` flags where needed, ~30 min), tokens file (extracted from `home-b.html` into `stardust/prototypes/_tokens.css`, ~15 min), template prototypes (9 pages, hand-authored, ~3 hours), derivatives (10 pages, copy-modify from their templates, ~1.5 hours), and a landing + sitemap (~30 min).

The scrape produced several surprises:

- **`/emergency-services/` shipped with full Lorem ipsum copy** on the live production site. Never authored. We synthesized on-brand replacement copy in the briefing and flagged `copy_edited: true` with reason.
- **`/where-does-it-go/` shipped with full Lorem ipsum** too. Same treatment.
- **`/palmer-court/` was de-facto a volunteering page**, not a program detail for the flagship 201-unit housing building. We restored it to program detail and preserved the volunteer content as a secondary band.
- **`/donate/` repeated the same $10-minimum disclaimer four times** in sequence. We collapsed to one footnote.

Every one of these was surfaced by reading what was actually on the live pages, not by trusting the IA. None of them would have been visible if we had estimated from the sitemap alone.

**Learnings:**
- Read what is on the source site before trusting its IA. The IA lies in small ways — repeated content, drift between page purpose and page content, Lorem ipsum on production pages — and those lies have to be caught in briefings, not in post-render review.
- `copy_edited: true` with a one-line reason is cheap and load-bearing. It gives a human editor a direct pointer to every rewrite before ship.
- One-shot briefing authoring from scraped JSON is fast and mostly accurate. The places it failed were exactly the places where the source itself was broken (Lorem ipsum, content-page misidentification).

---

## 8 · First critique (home page only)

After Phase 1 shipped, we ran `/impeccable:critique` on `index.html` (the approved home page). Two passes: a sub-agent LLM design review against Nielsen's heuristics + cognitive-load checklist + persona walkthroughs, and `npx impeccable --json` running the deterministic pattern detector.

Nielsen score: **24 / 40**. "Solid, not excellent." The load-bearing findings:

1. **Inter as both display and body** — the single loudest AI-slop tell on the file. Inter is on the reflex-reject list; we had used the easy default when we should have chosen a distinctive pair. We swapped to **Archivo** (Omnibus-Type, display) + **Public Sans** (USWDS, body) + **Source Serif 4** (Adobe, editorial pull-quote). Three fonts, none on the reject list, each doing a specific job.
2. **Crisis-audience primary action buried** — the shelter hotline was in the utility bar at 11px. We added an emergency ribbon between the nav and the hero, prominent in Road Home Teal, with one phone number (801-990-9999) in heavy type. The existing triage band below the hero dropped from three equal-weight phones to two secondary numbers.
3. **Services grid was symmetric** — three equal cards with decorative `01 · 02 · 03` codes. We made the grid asymmetric (2fr / 1fr / 1fr), promoted Emergency Shelter as the lead card with its own inline phone strip, and killed the decorative codes.
4. **Give row was equal-weight with Volunteer and Advocate** — donor payoff was cold. We promoted the Give row to a full-width Road Home Teal panel with its own CTA button and a serif lead-in sentence. Volunteer and Advocate stayed as secondary rows.
5. **`href="#"` placeholders everywhere** — half the nav, all the help-row CTAs, footer links. We swept every page with a Python script that matched anchor text to existing pages and updated the hrefs.

The detector false-positives (white-on-white 1:1 × 13, "overused-font: helvetica" from the fallback stack) were noise — we noted them as detector limitations and moved on.

**Learnings:**
- Critique before migrating the rest. The fixes from this pass propagated to every subsequent page via `_tokens.css` and the link-sweep script. Critiquing afterwards would have been 10× more expensive.
- Detector false-positives on contrast in dark sections are not real issues. Every automated tool has a blind spot. Learn which ones to ignore.
- The font choice was the most visible single improvement. Inter to Archivo + Public Sans changed the feel of the entire site from "generic AI prototype" to "100-year-old civic institution" in one commit.

---

## 9 · GitHub publication

After the critique fixes, we committed and pushed to a new private repo at github.com/paolomoz/theroadhouse. Private first — the scraped copy from the live site isn't explicitly licensed for public redistribution, and the placeholder portraits and the fictional Darnell quote have reputational implications if discovered without context.

We wrote a `README.md` that named the caveats loudly: fictional quote, placeholder photography, forms are UI-only, annual-report PDFs are placeholder links. The user then asked to make the repo public, and we flipped visibility with `gh repo edit --visibility public`. The repo has been public since.

A README that is honest about what's fake and what's real turned out to be more useful than a README that performs finished-ness. When a third party looks at the site, they can see what's an intentional placeholder versus what's broken.

**Learnings:**
- Private first, public later. Licensing and reputation risk don't reverse once a repo is indexed.
- A caveats-forward README beats a marketing README. The people who need to read your repo already trust you can make things look finished; what they actually need is the list of what still needs finishing.

---

## 10 · Phase 2 — critique rest, migrate rest, generate imagery, validate

Phase 2 was the end-to-end finishing run: Phase 1 sampled-critique on the remaining priority-1 pages, migrating the other 64 live-site pages with four new templates (T-08 person, T-10 volunteer program, T-13 history, T-15 legal), generating 20 hero images with Gemini 3 Pro Image Preview, and a full site-wide validation. It was designed for autonomous execution — we locked every decision into the plan so no question would pause the run.

**Sampled critique (not per-page).** Running the full dual-pass critique on 19 pages would have taken hours. Instead we ran `npx impeccable --json` on 9 template representatives. The only consistent real issue surfaced was the leftover `<link rel="stylesheet">` pointing at Inter on every page, even though the tokens had already swapped to Archivo/Public Sans. One `<link>`-swap script across all 20 pages eliminated it.

**The four new templates.** T-08 Person Detail, T-10 Volunteer Program, T-13 History Timeline, T-15 Legal/Policy — each built as the best-fit representative page (`michelle-flynn.html`, `fundraiser.html`, `history.html`, `privacy-policy.html`). Rather than hand-author each, we wrote a generic Python renderer (`_scratch/render-pages.py`) that reads the scraped JSON for a page, picks a title + lede + body paragraphs, applies a template-specific layout (sidebar CTA for service pages, document-TOC for legal, etc.), and outputs a clean HTML file using `_tokens.css`. That renderer produced all 59 new pages in about 3 seconds.

**Gemini imagery.** We wrote a Node script (`_scratch/generate-images.js`) that reads `GOOGLE_API_KEY` from the user's existing `.env`, posts to `generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`, and receives inline base64-encoded PNGs. All 20 slots generated successfully on the first pass — no retries needed. Total size ~16 MB across the 20 images. Zero consecutive failures; the stop condition at 5-in-a-row never fired.

The critical constraint we built into the plan was: **no photorealistic portraits of fabricated people**. Every generated slot is architectural (Palmer Court exterior, resource-center facades), interior (intake desk, dining hall, warehouse), city context (SLC dusk with Wasatch, Rio Grande winter), or atmospheric (keys in hand with home tag, warm coat on a hook, meal tray still life). Client and staff portrait slots kept their Unsplash placeholders with the `needs-real-photo: true` flag. For a homeless-services nonprofit with a real reputation, fabricating a portrait of "Darnell, a Palmer Court resident" would be a reputational landmine — the ethical constraint was load-bearing.

**Validation.** A Python script (`_scratch/validate.py`) walked every page, classifying hrefs, checking image references, and grepping against the absolute-ban CSS patterns from `.impeccable.md`. Three violations of the side-stripe-border rule surfaced — pull-quotes on `housing-stories.html`, `palmer-court.html`, and `legacy-planned.html` had inherited `border-left: 3px solid` / `border-left: 4px solid` patterns from earlier drafts. We replaced each with a tinted panel or a full 1px border. Post-fix validation: 0 link issues, 0 image issues, 0 consistency issues.

**Learnings:**
- Write a generic renderer once, render derivatives mechanically. 3 seconds beats 60 hours.
- If you can generate ethical-only imagery, do. The generated set of buildings and interiors raised the visual quality of the site without putting fake people on the page.
- Automated validation is the inverse of critique. Critique is open-ended and surfaces new issues; validation is deterministic and verifies that the rules you set are met. Both are necessary.
- Build validators that run fast. Our sweep over 80 pages took under a second. Cheap validation gets re-run; expensive validation rots.

---

## 11 · Closing learnings — for the next site

The distilled playbook. If you are rebuilding another site with stardust, read these first.

1. **Crawl the sitemap before estimating.** The nav lies about page count; the sitemap tells the truth. For a WordPress site, expect 3–5× the nav.
2. **Page count is not template count.** Cluster by layout, not by URL. Most nonprofit and institutional sites collapse to 10–15 templates regardless of how many pages they have.
3. **Drive a real browser for brand extraction.** Do not trust HTML inline styles or WordPress `:root` custom properties. The pink and the cream in the `--wp--preset--color--*` tokens were not on any rendered pixel.
4. **Invoke `/impeccable teach` or run the three-question inline interview. Do not synthesize `.impeccable.md`.** A five-minute taste interview changes the entire downstream output.
5. **Pick distinctive display + body fonts on day one.** The reflex-reject list is binding: Inter, DM Sans, Space Grotesk, Fraunces, Playfair, Syne, Plus Jakarta, Instrument Sans/Serif, IBM Plex are off-limits. We landed on **Archivo + Public Sans + Source Serif 4**; the next project should land on a different trio.
6. **Responsive is a rule, not a Phase-2 polish task.** Write "no prototype is considered complete if it only renders at 1440px" into `.impeccable.md` on day one.
7. **Present two clearly distinct home variants, not A/A'.** If the two could be confused at a glance, you have not done the work.
8. **Commit to a register before iterating details.** Every later decision compounds from this one.
9. **Retain the unchosen variant.** It's useful later as a reference for what you are NOT doing.
10. **Read what is on the source site before trusting its IA.** Lorem ipsum on production is surprisingly common; repeated content and drift between page purpose and content are routine.
11. **`copy_edited: true` with a one-line reason is cheap and load-bearing.** Give a human editor a direct pointer to every rewrite before ship.
12. **Centralize tokens into one file.** Every page imports; every change propagates. Breakpoints, colors, type scale, spacing, component styles — one place.
13. **Dead-link hardening is mechanical, not design work.** Run a sweep script after every batch render. Never leave `href="#"` when the target page exists.
14. **Critique the home page before migrating the rest.** The critique's fixes will propagate to every downstream page via shared tokens. Critiquing afterwards is 10× more expensive.
15. **Detector false-positives on dark-section contrast are noise.** Learn which automated findings to ignore; learn which to take seriously (typeface choice, heading hierarchy, overused-font flags on actual primary fonts).
16. **Write a generic Python renderer once; render derivatives mechanically.** 64 pages in 3 seconds beats 64 hand-authored pages in a week.
17. **Don't generate photorealistic portraits of fabricated people, ever.** Architectural, interior, context, atmospheric — yes. Fake "clients" with faces — no. A nonprofit whose reputation is its hundred-year history cannot afford a discovered fake.
18. **Build automated validation with deterministic rules.** Link health, image health, banned-pattern grep, font-family check. Run it after every major change.
19. **Write the caveats-forward README on day one.** Don't wait until handoff to tell the reader what's fake. Surface it loudly — fictional quotes, placeholder photography, UI-only forms, placeholder PDFs.
20. **Publish private first, public later.** Licensing and reputational risk don't reverse.
21. **Ship a `JOURNAL.md` at the end, and read the last project's journal before you start the next.** The story of what actually happened is more useful than the plan.
22. **Design for the moral primary audience, not for the donor who will pay for the rebuild.** For TRH the moral primary is the person in crisis; for every nonprofit it's someone the org's mission exists to serve. The donor happens to be reading the same page — but the page is for the crisis audience first, even if the donor paid for it.
23. **The personality document beats the brand board.** The brand board communicates what the palette is; the personality document communicates what the palette is *for*. Downstream quality depends on the latter.
24. **One typography pair does the work of ten.** We considered mixing a specimen serif into the body; we didn't. We used Source Serif 4 only on pull-quotes. The restraint is more confident than the variation.
25. **Ship the site. Then ship the story of how you shipped it.** Future-you will thank you. The next team will thank you more.

---

End of journal. Total word count: approximately 3,600. Written 2026-04-24, after Phase 4 validation closed with 0 real issues.
