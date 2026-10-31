# EPEDE — Electrical Power Engineering Digital Environment
**Authoritative Power Systems Knowledge & Cameroon Infrastructure Observatory**

**Platform Lead & Architect:** Mounjouonpou Yaya (Electrical and Power Systems Engineer)  
**Target Environment:** https://epede-platform.vercel.app  
**Repository:** https://github.com/YAYAMOUNJOUONPOU/epede-platform.git  
**Version:** 2.0 (Enterprise Knowledge Architecture)

---

## 1. Product Boundary & Purpose (Owner Decision D-1)

**EPEDE is an authoritative, bilingual (French & English) electrical power engineering knowledge and infrastructure exploration environment.**

Its mission is to bridge the gap between abstract academic electrical engineering theory and the physical realities of generation facilities, high-voltage transmission grids, substations, medium/low voltage distribution networks, industrial plant switchboards, and motor control centers.

### Operational Boundaries
- **Educational Worked Examples:** All 19 calculation modules on the platform are **interactive worked examples** designed to illustrate normative formulas, parameter sensitivities, and calculation steps. 
- **Non-Replacement of Certified CAD/EDA Tools:** EPEDE complements—and explicitly does **not** replace—specialized power systems simulation and design tools such as ETAP, DIgSILENT PowerFactory, PSS®E, or AutoCAD Electrical.
- **No Commercial Sizing Liability:** EPEDE does not issue certified calculation notes, protection approval certificates, or legally binding installation sizing reports. All real installations must be verified by licensed professional engineers using certified software.

---

## 2. Canonical Information Architecture: The Unified Electrical Chain

EPEDE organizes all technical content around **One Continuous Physical Chain, 6 Cross-Cutting Disciplines, and 4 Shared Libraries**:

```text
0. FOUNDATIONS (Circuits & AC Theory, Symbols & Schematics, Electrical Safety & LOTO)
   │
   ├── 1. Generation (Hydro, Thermal Gas, Solar PV, Synchronous Alternators)
   ├── 2. Transmission (90 kV / 110 kV / 225 kV Lines, Lattice Towers, SIL)
   ├── 3. Substations (AIS & GIS Switchyards, Busbar Schemes, Interlocking)
   ├── 4. MV/LV Distribution (30 kV / 15 kV Rings, RMUs, H61 Pole Transformers)
   ├── 5. Installations (Main LV Switchboards / TGBT Form 1-4b, Earthing TT/TN/IT)
   ├── 6. Motors & Drives (DOL, Star-Delta, Soft Starters, VFDs, Harmonics)
   ├── 7. Automation & Instrumentation (PLCs, P&ID ISA-5.1, 4-20mA, Sensors)
   └── 8. Final Electrical Loads (Industrial Motors, Lighting, HVAC, Power Quality)

CROSS-CUTTING DISCIPLINES:
- Protection & Control (ANSI 50/51, 21, 87T, 67N, Selectivity)
- Earthing & Lightning (IEEE 80-2013 Mesh Potentials, IEC 62305)
- Power Quality & EMC (IEEE 519-2022, IEC 61000-4-30, THD)
- Renewables & Energy Storage (BESS, Inverters, Microgrids)
- ELV, Telecom & Security (CFA, CCTV, Access Control, Fire Alarm)
- Testing, Maintenance & Commissioning (FAT/SAT, IR, PI, DGA)

SHARED LIBRARIES:
- Equipment Catalog (38 Canonical Types with Technical Cutaways)
- Standards Governance (IEC, IEEE, CIGRE, NF C clause-cited registry)
- Bilingual Electrotechnical Glossary (IEC 60050 IEV terminology)
- Cameroon National Power Grid (SONATREL / ENEO Observatory)
```

---

## 3. Real-World Cameroon Power Network Explorer

The **Cameroon Power Network Explorer** provides a structured, evidence-based engineering observatory of Cameroon's interconnected power systems:
- **Southern Interconnected Grid (RIS):** 225 kV and 90 kV backbone linking Sanaga basin hydropower facilities (**Nachtigal 420 MW**, **Song Loulou 384 MW**, **Edéa 276 MW**), the **Memve'ele 211 MW** hydro plant (evacuated via 225 kV line Nyabizan $\rightarrow$ Ebolowa $\rightarrow$ Ahala), and coastal thermal plants (**Kribi 216 MW**, **Dibamba 88 MW**) to major metropolitan centers in **Yaoundé** (Oyomabang, Nyom II, Ahala) and **Douala** (Bekoko, Logbaba, Koumassi).
- **Sanaga River Regulation:** The **Lom Pangar** reservoir dam ($6\text{ billion m}^3$) regulates Sanaga river discharge at $\sim 1,000\text{ m}^3/\text{s}$ throughout the dry season, sustaining generation at Song Loulou, Edéa, and Nachtigal.
- **Northern Interconnected Grid (RIN):** **Lagdo 72 MW** hydropower plant and emergency thermal plants supplying Garoua, Maroua, and Ngaoundéré across 110 kV and 90 kV lines.
- **RIS–RIN Interconnection Project (PIRECT):** 225 kV transmission link ($\sim 530\text{ km}$ from Nachtigal to Wouro Soua with new substations at Ntui, Yoko, Tibati, and Wouro Soua) currently **under construction** to integrate the northern and southern systems.

---

## 4. Technology Stack & Architecture

- **Frontend Core:** React 19, TypeScript 5.8, Tailwind CSS v4, Vite 6, Lucide Icons.
- **Engineering Graphics:** Three.js / `@react-three/fiber` (3D switchyard cutaways), SVG Vector Single-Line Diagrams, Canvas Particle Flow engines.
- **Offline & Cache Protection:** Service Worker v2.4 with auto-purging chunk protection and inline `vite:preloadError` dynamic recovery in `index.html`.
- **Pre-Rendered Semantic SEO:** Native semantic HTML fallback inside `<div id="root">` enabling instant AI indexing (Claude, Gemini, search crawlers) and machine-readable discovery via `/llms.txt` and `/llms-full.txt`.

---

## 5. Local Development & Verification

### Prerequisites
- Node.js `>= 20.x`
- npm `>= 10.x`

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Static TypeScript typecheck (blocking CI gate)
npm run lint

# 4. Production build (typecheck + vite bundle)
npm run build
```
