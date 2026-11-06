# EPEDE redesign — Claude Code guide (v2 "Light Grid")

Design source of truth: `design-reference/EPEDE Master v2.dc.html`.
Never change content, formulas, data or routes during the redesign.

## Step 1 — Put this folder in your repo
Unzip, move `design-reference/` into your project root, then ask Claude Code:
> Create a git branch called redesign and commit the design-reference folder.

## Step 2 — Map the site (no edits)
> Read design-reference/EPEDE Master v2.dc.html and GUIDE-v2.md. Do not edit anything. Inspect this codebase and write design-reference/MAP.md: framework, router and every route, shared layout/components, global CSS/tokens, image assets, content sources, interactive modules. Mark which files hold content and which hold presentation.

## Step 3 — Design tokens only
> Extract these tokens into our styling system (CSS variables / Tailwind / theme — match what we use). No components yet. Show me the diff.

- Backgrounds: paper `#F2F0EA`, stone `#ECE8DF` (alternate per section), panel `#E4DFD4`, card `#E6E1D6`
- Lines: `#D9D5CA` (paper), `#D6D0C3` (stone), strong `#9E9789`
- Text: ink `#0E1A1C`, body `#3C4C4F`, muted `#56676A`
- Accent text (bronze): `#8A4F08`, hover `#6E3E05`
- Accent fill (amber, buttons only): `#F2A541`, hover `#FFC277`, text on it `#0E1A1C`
- Live diagram lines: `#D9821C`; dead lines `#9E9789`; fault `#C4302B` / `#E5484D`
- Footer only: background `#0E1A1C`, text `#F2F0EA`, muted `#AEB9B8`, divider `#2A3A3D`, link hover `#F2A541`
- Fonts: Space Grotesk (400–700) for all text; IBM Plex Mono (400–600) for eyebrows, values, units
- Type: display `clamp(2.4rem,5.6vw,5.4rem)`, section h2 `clamp(2.4rem,5vw,4.6rem)`, h3 `clamp(1.9rem,3.2vw,3rem)`, body 1.05–1.15rem / 1.6, eyebrow mono 12px +0.12em
- Layout: max-width 1360px, side padding `clamp(20px,4vw,48px)`, section padding `clamp(80px,10vw,140px)`
- Radii: pills for buttons, 4–6px for images/panels. No decorative cards.
- Motion: controls 150–250ms; reveals 900–1300ms `cubic-bezier(.16,1,.3,1)`; all off under `prefers-reduced-motion`

## Step 4 — Shared shell
> Rebuild the shared layout: fixed 68px header (transparent → stone on scroll) with nav, Search, EN/FR, "Start learning" pill; mobile menu below 1100px; 2px amber scroll-progress bar; search overlay; footer with synthesis notice, version line and photo credits. Add a scroll-animation module: word-by-word heading rise (`data-words`), read-along paragraphs (`data-read`), fade/slide/clip reveals (`data-reveal="up|left|clip"`), scroll parallax (`data-px`). Keep all routes. Confirm every route loads.

## Step 5 — Section components (content via props)
HeroLiveGrid (rotating duotone photos + animated one-line diagram) · TrustStrip · VoltageMarquee · StickyJourney (9 stages, sticky rail / mobile progress bar) · BigNumber + DataStrip · MapEmbed · Workbench (motor starter SLD) · CaseStudy4Moves · ProjectRows · PathwayDirectory · FinalCTA
> Create these components. Each takes content as props; no hard-coded copy except labels.

## Step 6 — Migrate one page at a time
Home → Journey → D01 → Learn → Equipment → Calculators → Cameroon Grid → Simulation → D02–D16 → Standards, Regulatory, About.
> Redesign [route] with the new shell and components. Keep every piece of content, data, link, formula, warning and interaction exactly as is. Only change layout and presentation. List anything you couldn't map.

Check desktop + 375px, commit, next page.

## Step 7 — Images
> Create an image manifest (subject, path, alt, focal point, crops, credit) from design-reference/assets/hero/manifest.json and point sections to it. Use our own photos first; list slots still needing real photography (Nachtigal, Memve'ele, Lom Pangar).

## Step 8 — Bilingual
> Move all new UI labels into our EN/FR translation files. Check no page mixes languages.

## Step 9 — Final check
> For every route: no console errors; search, filters, calculators, exports, maps, simulations work; no sideways scroll at 360/768/1024/1440; keyboard focus visible; reduced motion respected; text contrast ≥ 4.5:1. Report results.
