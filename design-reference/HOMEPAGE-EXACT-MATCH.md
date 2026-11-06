# Homepage: exact match brief for Claude Code

The homepage must look and behave **exactly** like `design-reference/EPEDE Homepage v2 (open me).html`.
The editable source of that file is `design-reference/EPEDE Master v2.dc.html`. Take every value from that source: copy, colours, sizes, spacing, order, animation timings.

## Colour system (current)
- Backgrounds: white `#FBFCFD` (hero, voltage band, journey, projects) · ice `#EEF4F8` (trust, Cameroon grid, case study, pathways) · navy `#0B1B2B` (workbench, final CTA) · footer `#07131F`
- Text: ink `#0B1B2B`, body `#3A4B5C`, muted `#5B6B7B`; on navy: `#F3F7FA` / `#C3CFDA` / `#93A4B4`
- Accent text & links: cobalt `#1F5FAE` (hover `#174A88`); on navy: amber `#F2A541`
- Buttons: navy `#0B1B2B` + white text, hover cobalt; on navy sections: amber + navy text
- Energy only: amber `#F2A541` (pulse, progress bar, markers), live lines `#D9821C`
- Lines `#D5E0E8`, panels `#E3ECF2`; on navy: lines `#1E3347`, panels `#10263A`

## Rules
1. **Pixel-match, not "inspired by".** Use the exact hex colours, font families and weights, `clamp()` font sizes, paddings, gaps, max-widths, border widths, radii and line-heights written inline in the source. Do not round, substitute or "improve" anything.
2. **Same section order:** Header → 01 Hero → 02 Trust strip → 02b Voltage band → 03 Journey (9 stages) → 04 Cameroon grid (big number + map) → 05 Workbench → 06 Case study → 07 Projects → 08 Pathways (8 parcours: index list + sticky detail panel) → 09 Final CTA → Footer (dark).
3. **Same copy.** EN and FR text are both in the source (the `DICT`, `ST`, `HERO`, `PATHS`, `PROJ` and `LOG` objects). Move them into our translation files word for word.
4. **Same behaviour:**
   - hero photos crossfade every 6.5 s with a slow zoom; pause button
   - the one-line diagram's pulse runs from G to M over 7 s, and each piece of equipment lights up as the pulse passes
   - the journey rail stays pinned beside the stages (≥1100 px) or becomes a top progress bar (<1100 px), and the active stage follows scroll
   - "2,033" counts up when it enters view
   - the workbench state machine: stopped / running / overload→trip after 1.6 s / short-circuit / reset, with conductor colours and the event log
   - pathway filters by audience
   - the EN/FR toggle switches the whole page and the map
   - scroll animations: headings rise word by word (55 ms stagger, 1.1 s), paragraphs light up word by word as you scroll, images open from a clipped frame, list rows slide in, hero parallax and fade, the voltage band moves sideways with scroll
   - everything is static under `prefers-reduced-motion`
5. **Same assets:** photos from `design-reference/assets/hero/…` with the same files per section and the same credits. Copy them into our public/assets folder.
6. **Map:** embed our existing Cameroon grid map component in section 04, styled to match `design-reference/Cameroon Grid Map.html`. If we have none, embed that file.
7. **Responsive:** check at 1440, 1024, 768 and 375 px. It must match the reference at each width, with no sideways scroll.
8. **Keep our app working:** keep our router, header links and real routes. Where the reference uses `#anchors` for pages we really have (Learn, Calculators, Library…), link to our real routes instead.

## Process
1. Open the reference HTML in a browser and screenshot it at 1440 and 375 px. Save the screenshots to `design-reference/shots/`.
2. Build the homepage section by section. After each section, screenshot ours at the same widths and compare it side by side with the reference. Fix every difference before moving on.
3. When all sections are done, run a final side-by-side comparison of the full page at both widths and list any remaining differences, which should be none.
