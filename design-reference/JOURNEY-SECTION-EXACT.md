# Journey section — copy EXACTLY ("Nine stages. One continuous path.")

Source of truth: `EPEDE Master v2.dc.html` (section `id="journey"`, lines ~143–212) and the open-me HTML file. Rebuild this section **pixel for pixel**. Do not restyle, re-space, re-word or simplify it.

## 1. What the user sees
Desktop (≥1100 px): 2 columns — **240 px sticky stage rail** on the left + **stage articles** on the right (gap 56 px).
- Rail sticks at `top:110px`. A grey 2px line (#D5E0E8) runs down it; an **amber fill line (#F2A541)** grows to show progress: height = activeIndex / 8 × 100%, transition .5s cubic-bezier(.2,.8,.2,1).
- Each rail item: 14px dot + mono voltage line (11px) + stage name (16px).
  - Active: dot #D9821C, ring #D9821C, glow `0 0 0 6px rgba(242,165,65,.18)`, name weight 700 #0B1B2B, voltage #1F5FAE.
  - Passed: dot & ring #D9821C. Upcoming: dot #FBFCFD, ring #A9BAC6, name weight 500 #5B6B7B.
  - Clicking an item smooth-scrolls to its article (offset 110 px; 150 px on mobile).
- Each article (9 total, vertical gap clamp(72px,10vw,140px)):
  1. 16:9 photo, radius 4px, caption bar fading in at bottom (mono 11px, "NN / 09" in cobalt).
  2. Below: 2 columns — left: voltage (mono, clamp(1.6rem,3vw,2.6rem), #1F5FAE) → title h3 (clamp(1.9rem,3.2vw,3rem), 700, -.04em) → purpose paragraph → "Open Dxx — Domain →" link. Right: "KEY APPARATUS" label + numbered list with 1px #D5E0E8 rules.
- **Active stage** = the article closest to 45% of viewport height. Active article: opacity 1, photo `grayscale(.1) contrast(1.05)` + `scale(1.04)` (transform 6s ease). Inactive: opacity .38, photo `grayscale(1) brightness(1.05) opacity(.8)`, scale(1). Filter transition 1s.
Mobile (<1100 px): rail hidden; instead a **sticky bar at top:68px** with "NN · Stage" + voltage and 9 segmented progress bars (filled #D9821C up to active). All articles opacity 1.

## 2. Scroll animations (must match)
- Heading lines `data-words`: each word is masked and rises from `translateY(110%) rotate(4deg)` → none, 1.1s cubic-bezier(.16,1,.3,1), 55 ms stagger, when 20% visible.
- Intro paragraph `data-read`: words start at opacity .18 and light up to 1 as it scrolls from 88% → 46% of viewport height.
- `data-reveal="up"`: opacity 0 + translateY(32px) → visible. `"left"`: translateX(-24px). `"clip"` (photos): clip-path inset(12% 8% 12% 8%) + scale(1.08) → inset(0) + none.
  Timing: opacity .9s, transform 1.2s, clip-path 1.3s, all cubic-bezier(.16,1,.3,1); siblings stagger 80 ms (max 6). Trigger: IntersectionObserver threshold .12, rootMargin "0px 0px -8% 0px", fire once.
- `prefers-reduced-motion: reduce` → everything visible immediately, no zoom, no word animation.
