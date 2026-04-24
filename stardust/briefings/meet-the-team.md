---
slug: meet-the-team
url: https://theroadhome.org/meet-the-team/
template: T-07
priority: 1
status: draft
copy_edited: true
copy_edited_reason: live page has only a CTA ("Would you like to work with us?") — the team grid is in a JS component the crawler did not capture. Team roles synthesized from the case-management-team page and board-of-trustees page titles, with placeholder cards flagged for real photos.
imagery: reused-trh
---

# Intent

Directory of Road Home staff. Filterable by team (leadership, case management, outreach, resource-center managers, volunteer coordinators). Each card flips to a short bio.

# Audience

**Prospective employee** browsing leadership before applying.
**Partner agency** looking up a specific staff contact.
**Journalist** finding a named source.

# Sections

1. Global nav + breadcrumbs
2. Hero-light — "Meet the team"
3. Filter chips (Leadership · Case Management · Outreach · Resource Centers · Volunteer Coordination · Development)
4. People grid (12–24 cards)
5. "Would you like to work with us?" band (verbatim)
6. Careers CTA
7. Footer

# Copy

## Hero-light (synthesized)
**eyebrow:** About · Meet the Team
**headline:** The people who do the work.
**sub:** From our CEO to the case manager sitting with a family on intake night — meet the team that keeps The Road Home running, 365 days a year.

## Filter chips (synthesized categories from live IA)
- **All** · Leadership · Case Management · Outreach · Resource Centers · Volunteer Coordination · Development

## People grid (synthesized cards — real data to be added from the live team sitemap in a follow-up pass)
Cards render with: portrait · name · role · short title line. Bio expands on click.

Known people from live scrapes:
- **Michelle Flynn** — CEO (linked separately at /michelle-flynn/)
- **Holly Rogers** — Director of Development · 801-819-7294 · hrogers@theroadhome.org
- **[Volunteer Coordinator]** — volunteer@theroadhome.org · 385-351-2389
- _(remaining team cards populated from `/team-sitemap.xml` — a second crawl target for a follow-up sprint)_

## "Would you like to work with us?" band (verbatim)
**WOULD YOU LIKE TO WORK WITH US?**
The Road Home relies on a diverse staff to provide excellent care and service to the hundreds of people we help each day.
**See open positions →** (links to /careers-positions/)

# Imagery

- Hero-light: group photo of staff if available; else typographic treatment of the headline.
- People grid cards: portrait per person. Where a real portrait isn't scraped, use a monogram tile (initials on a teal-tinted ground).
