# Site-wide redesign rules for Claude Code

The homepage (`EPEDE Master v2.dc.html`) is the design system. Every other page must look like it belongs to the same site.
Rule zero: **change presentation only**. Never change content, data, formulas, units, warnings, links, routes or tool logic.

## 1. Shared shell (every page)
- Same header, mobile menu, search overlay, EN/FR toggle, scroll progress bar and dark footer as the homepage.
- Same colour system, fonts, spacing and motion as listed in HOMEPAGE-EXACT-MATCH.md.

## 2. Page header (top of every inner page)
- Ice background `#EEF4F8`, padding `clamp(120px,14vw,180px) 0 clamp(56px,7vw,96px)`.
- Breadcrumb in mono 12px muted (Home / Section / Page).
- Eyebrow in mono 12px cobalt, uppercase, letter-spacing .12em (e.g. `D04 · SUBSTATIONS`).
- H1 `clamp(2.4rem,5vw,4.6rem)`, weight 700, letter-spacing -.045em, words rise in on load (`data-words`).
- Intro paragraph, max-width 640px, read-along (`data-read`).
- Optional key facts row: values separated by fine rules (DataStrip), never boxes.
- Optional full-width photo below the header: radius 6px, clip reveal.

## 3. Page types → which homepage patterns to use
- **Domain pages D01–D16:** page header → sticky section index on the left (like the Journey rail) + content on the right → key equipment as numbered lists → standards as mono tags → links to related domains → final CTA.
- **Lesson / article pages:** page header → single column max 760px, body 1.08rem / 1.7 → figures with captions and credits → formulas in mono on an ice panel → warnings as a left amber rule plus bold label (no coloured boxes) → previous/next lesson links.
- **Learn / pathways:** the homepage Pathways pattern (index list + sticky detail).
- **Equipment catalogue:** filter pills (same style as the audience filters) + grid of entries. Cards are allowed here (catalogue entries): white, 1px `#D5E0E8` border, radius 6px, image on top, mono spec line.
- **Calculators:** navy Workbench pattern. Inputs on the left, results on the right in large mono, assumptions in small text, and the formula shown.
- **Simulation:** navy Workbench pattern with the diagram on the left and controls, readouts and event log on the right.
- **Cameroon grid page:** the homepage grid section (big number + data strip + map) at full size, then the record tables with fine rules only.
- **Standards / Regulatory / Library:** page header → search and filter pills → list rows (number · title · mono reference · arrow), like the pathway rows.
- **About:** page header → editorial split rows (image plus text) → final CTA.

## 4. Components (reuse, don't invent)
Header, Footer, PageHeader, DataStrip, StickyIndex, NumberedList, EditorialSplit, PathwayIndex, Workbench, FilterPills, CatalogueCard, ListRow, FormulaBlock, Warning, FinalCTA, scroll-reveal helpers (`data-words`, `data-read`, `data-reveal`).

## 5. Forbidden
- New colours, fonts or shadows not in the system.
- Decorative cards or boxes around plain text.
- Gradients other than the photo washes.
- Changing any wording, number or behaviour.

## 6. Done when
- Every route renders with no console errors.
- All tools, calculators, maps, filters and exports work as before.
- No sideways scroll at 360 / 768 / 1024 / 1440 px.
- Text contrast ≥ 4.5:1; keyboard focus visible; reduced motion respected.
- EN/FR complete on every page.
