# ProCode Implementation Prompt — EPEDE Visual Redesign

> **Copy the prompt below into ProCode.** It is intentionally written as a development instruction. It requests a substantial redesign of presentation and interaction while preserving EPEDE's existing engineering behavior and routes.

---

## BEGIN PROMPT

You are the senior product designer and frontend engineer responsible for redesigning EPEDE, the Electrical Power Engineering Digital Environment. Redesign the existing application into a bright, premium, editorial and cinematic engineering-learning experience.

### Non-negotiable: inspect first, preserve functionality

Before changing code, inspect the current project. Identify its framework, route handling, shared layout/components, design tokens, global CSS, image assets, data models, search, localization, interactive engineering modules, persistence, APIs and tests. Produce a short implementation map for yourself, then work from the existing codebase. Do not rebuild the application from scratch.

This task is a presentation and experience redesign, not a domain-content rewrite or backend migration. Preserve:

- Every existing route, including the sitemap and locale-prefixed routes.
- The current relationships/aliases between `#/journey` and `#/en/electrical-systems`.
- All 16 routes `#/domain/D01` through `#/domain/D16`.
- Existing English/French locale behavior and translation architecture.
- Search, learning pathways, domain modules, equipment records, calculations/formulas, units, solver links, saved studies/history, exports/PDF/CSV/PNG, map/filter data, SLD states/interlocks, simulations, user settings/profile, integrations, APIs and backend logic.
- Every technical warning, source citation, uncertainty note, standard reference and engineering-synthesis disclaimer.

Do not silently remove a tool, change an engineering formula, alter sample data, relabel simulation values as live data, modify a safety state, or substitute static mockups for functioning modules. Do not rename routes, change data schemas, or introduce a new dependency without first justifying it. If a feature is hard to style without code changes, make the smallest safe change and preserve its behavior.

### Design outcome

Build a **bright editorial shell with focused technical workbenches**. The application should feel like one intentional digital environment that follows electrical power from generation to end use. It should not feel like a collection of dashboards or rounded cards.

Use full-width editorial compositions, asymmetric photo/text layouts, open typography, whitespace, integrated diagrams and connected section transitions for narrative/information pages. Keep dark panels only where they improve the legibility or focus of a diagram, waveform, map, simulator, calculator or dense instrument. Do not convert every technical tool to a white card and do not eliminate useful containment from real controls.

### Shared visual system

Create central tokens; do not scatter one-off colors and dimensions across page CSS.

**Palette**

- Main page background: warm paper `#F6F4EE`.
- Alternate narrative surface: `#FFFDF9`.
- Primary text: deep ink `#17282C`.
- Secondary text: slate `#5C6C70`.
- Brand/active engineering teal: `#147C78`.
- Energy/selected-stage amber: `#B8872D`.
- Technical workbench background: graphite `#10191D`.
- Technical workbench foreground: `#F4F1E8`.
- Status green, warning amber and risk red must be used only for genuine status/risk meaning. Do not use neon glow, decorative green grids or arbitrary multicolor badges as the default page styling.

**Typography**

Use the existing licensed/local typefaces when suitable. Pair one highly readable sans-serif for display and body text with IBM Plex Mono (or an existing equivalent) only for short engineering values, voltage labels, asset IDs, units and schematic identifiers. Use a fluid scale similar to:

- Hero/display: `clamp(2.75rem, 6vw, 6rem)`, line-height 0.95–1.05.
- Page H1: `clamp(2.2rem, 4vw, 4.25rem)`.
- Section headings: `clamp(1.6rem, 2.5vw, 2.6rem)`.
- Lead copy: 1.15–1.3rem, line-height around 1.55.
- Body copy: 1rem–1.125rem, line-height 1.55–1.7.
- Metadata: normally at least 0.75rem and never use tiny mono text for an entire paragraph.

Keep sentence case for prose. Use uppercase only for short labels. Meet at least 4.5:1 contrast for standard text and provide a clearly visible focus style.

**Layout and spacing**

Use a consistent 8 px spacing scale, common section alignment and a maximum content width around 1,200–1,280 px. Use a 12-column desktop grid where it helps composition. Default section gaps should feel generous, with compact spacing reserved for related controls. Remove decorative borders and shadows from general explanatory copy. Use fine rules, typography, image edges and whitespace rather than enclosing every content group in a rounded rectangle.

**Controls**

Use one primary filled action per scene and a restrained secondary action. Keep control labels explicit. Inputs must have persistent visible labels; do not rely on placeholders. Use consistent active/selected/disabled/focus states. Buttons and touch controls should target at least 44×44 CSS pixels on touch layouts. Preserve relevant existing keyboard shortcuts and add keyboard behavior only where it is safe and clear.

### Shared navigation and page ending

**Desktop header:** create one consistent, approximately 68–76 px header with the logo, a concise primary route set (Home, Learn, Electrical Systems, Equipment, Industrial Engineering, Library, About) and a right-side Search and EN/FR control. Keep profile/settings and ENTER EPEDE behavior, but prevent them from competing equally with primary navigation. Keep the full engineering taxonomy inside one grouped, searchable Library panel. The panel must be closed by default, keyboard accessible, grouped by user task/domain, and not push its contents into the visible homepage before it is opened.

**Mobile header:** collapse primary links into a clearly labeled menu with explicit open/close state. Keep Search, language and profile reachable without reducing their hit targets to tiny icons. Avoid duplicate navigation if the fixed bottom dock remains. If the dock remains, keep it to the most-used destinations, use labels with icons, support safe-area insets, and ensure it never covers page content or form controls. Add sufficient bottom padding to scrollable pages.

**Footer:** implement one shared footer on every route. Include a short EPEDE purpose statement, Learn, Electrical Systems, Equipment, Library/domains, About, EN/FR, source/provenance or accessibility links if those destinations already exist, and a concise version/synthesis note. Preserve route-specific engineering disclaimers immediately before the shared footer where relevant. The disclaimer must not be the only page-ending element. Do not invent legal or support endpoints; use only valid links.

### Image and visual asset instructions

Use the existing authentic infrastructure photographs and diagrams first. Audit the project assets. Build a small typed/central asset manifest with subject, source path, alt text, focal position, desktop/mobile crop and licensing/credit metadata where available. Do not delete or overwrite original assets.

Use real power stations, equipment, substations, transmission corridors, switchboards, industrial controls and Cameroon infrastructure. Use a technically accurate SVG/diagram when photography would be misleading. Do not use generic corporate stock photography, synthetic pseudo-data that looks like live operational data, or unsupported route/asset claims.

Provide art-directed hero sources with `picture`/responsive sources or equivalent so desktop and mobile have suitable crops. Supply appropriate image dimensions/format, reserve layout space, lazy-load below-the-fold images and prioritize only the real first-screen image. Add descriptive alt text when the photo provides content; use empty alt for purely decorative images with equivalent text nearby. Use consistent crop behavior; do not crop out the apparatus/subject needed to understand the scene.

### Motion, transitions and cinematic behavior

Motion must make the power-system sequence easier to understand. Do not add motion merely for decoration.

- Keep transitions to opacity, transform, clip-path or SVG stroke changes where practical; do not animate large layout shifts.
- Use concise 150–250 ms control transitions and restrained 500–800 ms image reveals.
- Add scroll reveal only to key editorial scenes and one continuous power-flow indicator across the homepage/system journey. Avoid scroll-jacking, forced horizontal scrolling, dramatic route wipes, constant video autoplay and parallax on reading text.
- Preserve the hero carousel's manual selection and pause controls. If it rotates automatically, expose pause, stop rotation when the user requests pause, do not auto-rotate under reduced motion, and avoid shifting text layout when a slide changes.
- Honor `prefers-reduced-motion: reduce`: reveal content immediately; disable autoplay, parallax, background movement, long transitions and decorative path animation while retaining full information and operability.
- Do not flash elements or use motion to communicate a critical safety state without text/color-independent labels.

### Required page work

#### 1. Homepage — `/`

Replace the dark grid-heavy hero with an approximately 85–95 svh, photo-led composition using a consistent wide desktop crop and a separate mobile crop. Use a real generation or transmission image with a clear focal point. Keep text directly on a readable gradient/wash, not inside a floating card. Make the first screen immediately explain what EPEDE is. Suggested message: “Understand how electricity is generated, moved and used—from real equipment to complete power systems.” Use one primary CTA: “Explore the power journey”; use one secondary CTA: “Browse learning paths.” Keep a concise, accessible slide/pause control if retaining the four-theme carousel.

Resequence existing homepage material as a deliberate narrative:

1. Hero and purpose.
2. A concise “power source to user” flow line.
3. Generation photo story.
4. Nine-stage interactive system journey.
5. Four open learning-method steps, not four boxed cards.
6. Cameroon grid teaser with source/provenance note.
7. Learning pathways as a compact directory with one featured pathway, not eight repeated cards.
8. One motor-starter/SLD interaction teaser.
9. Cameroon project/context entries as editorial image-and-text rows.
10. Final CTA and shared footer.

Retain the actual content and all links, but do not place every tool module on the home route. Lead visually with one central story at a time. Do not use a sitewide starfield/grid background or persistent decorative particles.

#### 2. Learn hub — `#/en/learn`

Open with a light introduction and a clear recommended entry point for first-time learners. Preserve all eight pathways and their current destinations. Present paths as a filterable, readable list with title, audience/level and one action, not eight equally weighted cards. Retain the existing audience filters, make the selected state clear and keyboard operable, and add a simple sequence visual showing where each path relates to the power-system story. Do not invent learning-duration or progress data.

#### 3. Electrical Systems / journey — `#/journey` and `#/en/electrical-systems`

These routes must continue to show the same existing journey feature. Use one shared page/component behind the existing aliases. Replace cramped nine-stage tiles with a connected nine-stage stepper. On desktop, show all stage numbers/labels legibly along a line; on mobile, show the active stage and previous/next controls plus an accessible horizontal stepper. Keep stage selection changing the existing image, title, voltage, purpose, apparatus and links in place. Make the selected stage title the page focal point, keep voltage/domain metadata in one concise strip, and move explanatory copy into an open reading layout. Preserve all nine actual stages and their existing numeric data. Remove large dead gaps near the page ending and add the shared footer after the synthesis notice.

#### 4. Equipment catalogue — `#/equipment` and `#/en/equipment`

Preserve all 39 entries, search, voltage filters, D01–D16 filters, safety-only filter, comparison state, asset inspection, ratings and solver links. Make title and search easy to locate. Group filters in a clear responsive toolbar with active chips and a clear-filters action. Keep a card/list only as a functional catalogue; remove unnecessary nested boxes. Add a genuine asset photograph, cutaway or technical illustration to entries where the existing asset library supports one. Do not fabricate a thumbnail or imply a cutaway exists if it does not. Keep voltage, risk, domain and key specification scannable. On phones, use a one-column row/list with large inspect target and a filter drawer/sheet.

#### 5. Industrial Engineering — `#/en/industrial-engineering`

Preserve project examples, local context, technical details and route links. Lead with one strong field/project story and one explanatory paragraph. Present projects as editorial rows with photo/diagram, scope, location and one action. Keep standards/capacity details accessible without filling every title area with badges. Link relevant cases to the existing motor starter, SLD and domain experiences.

#### 6. Engineering Library / domain directory — `#/domains`

Preserve the directory and matrix views, six foundations, category filters, search and all domain routes. Present a bright editorial introduction. Group D01–D06 under the physical chain and D07–D16 under transversal disciplines/protection/safety. Make the filter block compact, searchable and mobile responsive. Show domain entries as clear editorial index rows or restrained selectable list items with distinct title, one-line description and one action. Use diagrams selectively. Arrange the six foundations as a balanced 3×2 grid or connected index; do not leave one item alone on a second row.

#### 7. Domain detail pages — `#/domain/D01` to `#/domain/D16`

Keep all existing content, three key questions, apparatus, standards, diagrams, calculators, risk notices and in-page controls. Apply one shared shell: back-to-directory link, domain title/lead, one context-specific visual, optional “three questions” index, technical content, related domains and shared footer. Change the main diagram/photo and accent metadata according to each route. Do not force the same card count or exact vertical rhythm onto all domains.

- `D01`: generation; show source energy → turbine/prime mover → alternator → grid.
- `D02`: grid architecture/planning; show one high-level network balance/architecture visual.
- `D03`: HV/EHV transmission; feature a corridor photo and annotated voltage/route diagram.
- `D04`: substations/grid nodes; use a readable AIS/GIS bay or single-line topology.
- `D05`: distribution networks; show feeder/RMU → transformer → LV/consumer flow.
- `D06`: installations/utilization; give the existing LV single-line diagram priority and make device/protection state legible.
- `D07`: automation/DCS/drives; distinguish control signals, process values and power path in a PLC/DCS/VFD visual.
- `D08`: extra-low-voltage/special systems; group structured cabling, CCTV, access control and related system diagrams.
- `D09`: AI/advanced technology; show data sources → analytics/digital twin → engineering decision, without presenting sample values as real telemetry.
- `D10`: energy storage/charging; show a battery-system cutaway with charge/discharge and grid connections.
- `D11`: protection/measurement/studies; feature a protection zone/CT-VT-relay visual and clear risk/status legend.
- `D12`: substation automation/telecontrol; clarify process/station/telecontrol layers.
- `D13`: communications/OT; show an accurate IEC 61850/OT network separation if the existing content supports it.
- `D14`: power quality/EMC; prioritize the existing waveform/FFT tool with controls separated from read-only results.
- `D15`: metering/smart-grid; show meter → communications → data/utility path.
- `D16`: electrical safety/earthing/lightning; feature the existing earthing-grid/soil/safety visual and retain all warnings.

#### 8. Calculators — `#/calculators`

Keep every formula, engineering unit, input, calculated result, standards reference, assumptions note, study history, saved study, sharing, PDF/technical note, solver and link. Replace the horizontal 19-item strip with a searchable, categorized picker that shows the selected tool and allows access to all solvers without hidden sideways scrolling. Group Share, Study History, Saved Studies, Technical Note and PDF in a labeled secondary toolbar. Keep results, input values and formulas in an obvious hierarchy; show the main result and units first. Put assumptions and derivations directly beneath or in an accessible disclosure. Localize all visible controls and labels to the active locale. On phones, stack output and inputs; do not shrink field labels or put important controls into a narrow two-column grid.

#### 9. Cameroon Grid — `#/cameroon-grid`

Preserve the source-linked network data, GIS/map, region filters, section tabs, generation/capacity figures, RIS/RIN distinction, dates and uncertainty notes. Give the intro room before local section navigation. Keep a large map with clear mapped-vs-schematic route style, legible persistent legend, data-date context and accessible feature selection. Cluster/de-emphasize labels at low zoom and reveal detail on selection. Present the KPIs in a compact data strip with source/date immediately visible, not a crowded grid of dark cards. On mobile, use a simplified map plus an accessible selected-feature detail/list fallback. Never redraw route geometry or upgrade uncertain data to confirmed data as part of a visual-only task.

#### 10. Simulation Laboratory — `#/simulation`

Preserve all 19 workbenches, simulator behavior, parameter values, controls, capture/export/freeze features and disclosures. Add a searchable/category-based workbench selector with a clear current selection. Keep the active waveform/canvas as the main focal surface and group controls beneath it or in a well-labeled side panel. Use a dark technical surface only for the active instrument; use the shared light shell for page context. Increase control labels, spacing and touch targets. Distinguish editable controls, computed results and simulated values. Keep disclaimer visible near the tool and retain all existing safety/context information.

#### 11. SLD/Substations — `#/diagrams`

Preserve existing diagrams, equipment states, topology, interlocks, selection and state behavior. Give the drawing enough responsive space; use an explicit legend/status bar and an inspector that updates from the selected element. Keep diagram and controls visually distinct. Provide zoom, pan, fit/reset and keyboard operability only if already available or added safely. On mobile, open the selected element in a readable detail panel and allow fit-to-view; do not force the user to read a shrunken full-width drawing.

#### 12. Hydropower suite — `#/hydropower`

Preserve the hydropower twin and water-to-wire tools. Lead with a strong hydro image or existing engineering diagram, then show the real energy conversion sequence in one continuous visual. Keep any twin or simulator as an explicitly labeled technical workbench. Do not label local or demo values as live measurements.

#### 13. Standards — `#/standards`

Preserve issuer/category/domain filters, standards records, search, FAT/SAT and compliance information. Make search first, followed by compact filter controls and a readable reference index. Give each record a stable hierarchy for standard identifier, title, issuer, edition/status and link. Keep the Cameroon operating-envelope note and provenance. Do not imply that summaries replace the official source text.

#### 14. Regulatory — `#/regulatory`

Preserve official legal/grid-code references, institutional relationships, RIS/RIN observatory context and exports. Use a readable legal/reference index or timeline and a simple institutional diagram. Keep date, source and status adjacent to each item; group JSON/data export in an explicit action area. Do not rewrite legal meaning.

#### 15. About — `#/en/about`

Preserve author attribution, site purpose, research/engineering scope, routes and disclaimer. Use a bright mission-led page with platform overview, what it connects, creator attribution and one next step to Learn or the system journey. Avoid generic corporate stock art.

### Performance and code quality

- Use the existing application architecture and style conventions where possible. Extract only genuine repeated UI into shared components/tokens; do not create one giant client-side page or rewrite stateful calculations.
- Preserve route-level code splitting where it currently improves performance.
- Avoid adding a heavy animation library if CSS/ existing primitives can deliver the specified effects.
- Keep map, diagram and simulator code functional and performant. Do not animate large SVGs continuously while off-screen.
- Use responsive source assets, reserve image aspect ratio, load only the real hero eagerly, lazy-load other scenes and avoid layout shift.
- Keep the site usable at 200% zoom. Do not block vertical scrolling, hide focus rings or depend on color alone for status.
- Add `prefers-reduced-motion` coverage for every new animation. Preserve and extend the existing rule rather than replacing it.

### Acceptance criteria and required validation

Do not consider the redesign complete until all of the following are true:

1. **Route preservation:** every existing route in the sitemap and primary navigation still opens the same feature; both journey aliases work; D01–D16 all render.
2. **Feature preservation:** search, locale toggle, profile, learning-path actions, catalogue filters/comparison, calculators/units/exports/history, grid filters/map selections, simulations and exports, SLD selection/state, domain links, standards and regulatory controls continue to function. List any control that was already nonfunctional separately; do not hide it.
3. **Visual consistency:** header, buttons, typography, spacing, active states, content width and footer follow the same design system across every route. Informational pages are predominantly bright; workbench backgrounds are used selectively.
4. **No accidental card replacement:** homepage storytelling, Learn, industrial cases and standards/regulatory content are not rendered as repeated boxes by default. Use card/list patterns only when the interaction is genuinely a catalogue, comparison, result or selectable item.
5. **Responsive:** test 360 px, 375 px, 768 px, 1024 px and 1440 px widths. Confirm no document-level horizontal overflow; controls, map, calculator, domains and diagram remain usable; no fixed header/dock covers content; all major buttons/inputs have touch-sized targets.
6. **Accessibility:** verify keyboard navigation, visible focus, meaningful headings/landmarks, alt text, labels, selected states, announcements for changing diagram/stage content and reduced-motion behavior. Do not claim WCAG certification unless formally tested.
7. **Language:** verify representative EN and FR routes so no mixed-language labels remain in a single selected locale.
8. **Images and performance:** confirm every referenced asset exists; no broken images; hero crop is suitable at mobile and desktop; lazy-loading and aspect ratios avoid layout shifts.
9. **Data integrity:** all formulas, units, sources, standards, route uncertainty notes and safety disclaimers remain unchanged unless a change is explicitly documented and justified.
10. **Delivery:** provide a concise list of changed files, routes tested, interaction checks, known limitations and any new assets required. Include before/after screenshots for homepage, journey, one technical tool, Cameroon grid and a 375 px mobile view.

Implement in small, coherent changes. First establish tokens and shared shell; then redesign representative routes; then apply the domain template to D01–D16; finally validate every route and preserve the original functional baseline. Do not stop after polishing only the homepage.

## END PROMPT
