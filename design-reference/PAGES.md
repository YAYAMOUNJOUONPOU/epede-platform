# EPEDE Platform Routes & Page Types Mapping (PAGES.md)
> Aligned with `design-reference/SITEWIDE-REDESIGN.md` Section 3

This document lists every active route across the EPEDE platform, tagged strictly with the authoritative pattern specified in `SITEWIDE-REDESIGN.md`.

---

## 1. Core Narrative & Foundational Routes

| Route Clean Path | Route Hash | View ID | Page Type | Description & Pattern Applied |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `#/` | `home` | **Homepage Pattern** | Full editorial homepage: Header, 01 Hero, 02 Trust, 02b Voltage band, 03 Journey, 04 Cameroon grid, 05 Workbench, 06 Case study, 07 Projects, 08 Pathways, 09 Final CTA, Dark Footer. |
| `/journey` | `#/journey` | `journey` | **Domain pages D01–D16 / Journey Pattern** | Page header (ice background) → sticky stage index on the left (progress bar) + content on right → key apparatus as numbered lists → voltage tags → final CTA. |
| `/thematic-journeys` | `#/thematic-journeys` | `thematic-journeys` | **Learn / pathways** | Pathways pattern: Audience filter pills + vertical numbered index list on left with amber active bar + sticky detail panel on right (cover photo, topics, action CTA). |
| `/about` | `#/about` | `about` | **About** | Page header → editorial split rows (photo + text) → architecture pillars → final CTA. |
| `/glossary` | `#/glossary` | `glossary` | **Standards / Regulatory / Library** | Page header → search and filter pills → list rows (number, term title, category, definition) with fine rules. |

---

## 2. 16 Electrotechnical Knowledge Domains (D01 – D16)

*Pattern: **Domain pages D01–D16***
*Structure: Page header with ice background `#EEF4F8`, mono eyebrow `Dxx · DOMAIN NAME`, rising H1, intro paragraph, DataStrip key figures, sticky left section rail + right stream, equipment numbered list, standards mono tags, related domains links, and navy final CTA.*

| Route Clean Path | Route Hash | Domain Code | Domain Title (EN / FR) | Page Type |
| :--- | :--- | :--- | :--- | :--- |
| `/domain/D01` | `#/domain/D01` | `D01` | Energy Resources & Generation / Production | **Domain pages D01–D16** |
| `/domain/D02` | `#/domain/D02` | `D02` | Grid Architecture & Planning / Architecture Réseau | **Domain pages D01–D16** |
| `/domain/D03` | `#/domain/D03` | `D03` | Transmission Networks / Transport Haute Tension | **Domain pages D01–D16** |
| `/domain/D04` | `#/domain/D04` | `D04` | Substations & Grid Nodes / Postes de Transformation | **Domain pages D01–D16** |
| `/domain/D05` | `#/domain/D05` | `D05` | Distribution Networks / Réseaux de Distribution MT/BT | **Domain pages D01–D16** |
| `/domain/D06` | `#/domain/D06` | `D06` | Electrical Installations & LV / Installations BT | **Domain pages D01–D16** |
| `/domain/D07` | `#/domain/D07` | `D07` | Industrial Automation & Drives / Automatisme Industriel | **Domain pages D01–D16** |
| `/domain/D08` | `#/domain/D08` | `D08` | Extra-Low Voltage & Special Systems / Courants Faibles | **Domain pages D01–D16** |
| `/domain/D09` | `#/domain/D09` | `D09` | Advanced Technologies & Digital Twin / Jumeau Numérique | **Domain pages D01–D16** |
| `/domain/D10` | `#/domain/D10` | `D10` | Energy Storage & EV / Stockage & Électromobilité | **Domain pages D01–D16** |
| `/domain/D11` | `#/domain/D11` | `D11` | Protection Relaying & Studies / Protection & Court-Circuit | **Domain pages D01–D16** |
| `/domain/D12` | `#/domain/D12` | `D12` | Substation Automation & IEC 61850 / Contrôle-Commande | **Domain pages D01–D16** |
| `/domain/D13` | `#/domain/D13` | `D13` | Operational Telecom & OT Networks / Télécoms Opérationnelles | **Domain pages D01–D16** |
| `/domain/D14` | `#/domain/D14` | `D14` | Power Quality & EMC / Qualité d'Énergie & CEM | **Domain pages D01–D16** |
| `/domain/D15` | `#/domain/D15` | `D15` | Smart Metering & Digitalization / Comptage Intelligent | **Domain pages D01–D16** |
| `/domain/D16` | `#/domain/D16` | `D16` | Earthing & Lightning Safety / Mise à la Terre & Foudre | **Domain pages D01–D16** |
| `/domains` | `#/domains` | `domains` | All 16 Domains Index | **Standards / Regulatory / Library** |

---

## 3. Engineering Workbenches & Interactive Solvers

*Pattern: **Calculators / Simulation (Navy Workbench Pattern)***
*Structure: Background navy `#0B1B2B`, text `#F3F7FA`, inputs and sliders on the left, results in large mono on the right, stated assumptions, KaTeX normative formulas, and live selectivity/event readouts.*

| Route Clean Path | Route Hash | View ID | Page Type | Description & Pattern Applied |
| :--- | :--- | :--- | :--- | :--- |
| `/calculators` | `#/calculators` | `calculators` | **Calculators** | Navy Workbench pattern: Input parameters on left, calculation results on right in large mono, assumptions in small text, normative formula block. |
| `/simulation` | `#/simulation` | `simulation` | **Simulation** | Navy Workbench pattern: Dynamic animated diagram / oscilloscope on left, real-time controls, telemetry readouts, and event log on right. |
| `/diagrams` | `#/diagrams` | `diagrams` | **Simulation** | Interactive Single-Line Diagram (SLD) and bay interlocking simulator: SVG breaker controls on left, live busbar energization highlighting, interlock rules. |
| `/hydropower` | `#/hydropower` | `hydropower` | **Calculators / Simulation** | Hydropower Master Workbench: Hydraulic equation solver ($P = \rho \cdot g \cdot Q \cdot H \cdot \eta$), turbine hill-charts, transients, dispatch simulation. |
| `/industrial-projects` | `#/industrial-projects` | `industrial-projects` | **Calculators / Simulation** | D06 Master Installations Workbench: TGBT builder, selective coordination TCC curves, arc flash hazard, cable sizing derating matrix. |

---

## 4. Cameroon Grid Observatory & Spatial Analysis

*Pattern: **Cameroon grid page***
*Structure: Homepage grid section at full size (big capacity count-up + data strip + map iframe) followed by verifiable record tables with fine rules.*

| Route Clean Path | Route Hash | View ID | Page Type | Description & Pattern Applied |
| :--- | :--- | :--- | :--- | :--- |
| `/cameroon-grid` | `#/cameroon-grid` | `cameroon-grid` | **Cameroon grid page** | Full-scale Cameroon Grid Explorer: 2,033 MW count-up, 3,233.9 km HV lines, RIS/RIN islanding solver, dispatch profiles, embedded interactive map, and primary source citations. |

---

## 5. Equipment Catalog & Reference Hub

*Pattern: **Equipment catalogue***
*Structure: Filter pills (audience / voltage / category) + grid of cards (white `#FFFFFF`, 1px `#D5E0E8` border, radius 6px, apparatus photo on top, mono specifications line).*

| Route Clean Path | Route Hash | View ID | Page Type | Description & Pattern Applied |
| :--- | :--- | :--- | :--- | :--- |
| `/equipment-list` | `#/equipment-list` | `equipment-list` | **Equipment catalogue** | 39 Canonical physical equipment types: category pills (Generation, Transmission, Substation, Distribution, Industrial), photo cards, technical ratings. |
| `/equipment/:id` | `#/equipment/:id` | `equipment` | **Lesson / article pages** | Single-equipment cutaway anatomy and engineering specification: 760px column, photo with credits, mono rating table, ANSI device numbers, field maintenance warnings. |
| `/equipment-reference` | `#/equipment-reference` | `equipment-reference` | **Equipment catalogue** | Detailed equipment reference sheets with nameplate parameters, vector groups, and cross-domain links. |
| `/reference-hub` | `#/reference-hub` | `reference-hub` | **Standards / Regulatory / Library** | Unified reference hub connecting standards, worked examples, and equipment specifications. |

---

## 6. Standards, Regulatory, Roles & Knowledge Governance

*Pattern: **Standards / Regulatory / Library***
*Structure: Page header → search and filter pills → list rows (number · title · mono standard reference · arrow).*

| Route Clean Path | Route Hash | View ID | Page Type | Description & Pattern Applied |
| :--- | :--- | :--- | :--- | :--- |
| `/standards` | `#/standards` | `standards` | **Standards / Regulatory / Library** | International standards index (IEC, IEEE, NF C, CIGRE, SONATREL): search bar, committee filter pills, list rows with normative clause references. |
| `/regulatory` | `#/regulatory` | `regulatory` | **Standards / Regulatory / Library** | Legal, statutory, and grid code framework (Cameroon Law N° 2011/022, ARSEL regulations, SONATREL Grid Code). |
| `/roles` | `#/roles` | `roles` | **Learn / pathways** | 8 Canonical Engineering Roles: role list on left, detailed daily responsibilities, tools, and learning pathways on right. |
| `/laboratory` | `#/laboratory` | `laboratory` | **Standards / Regulatory / Library** | Testing & Commissioning Laboratory procedures, FAT/SAT test forms, calibration tolerances. |
| `/context-stack` | `#/context-stack` | `context-stack` | **Lesson / article pages** | Context-Stack traceability viewer: hierarchical causal links between apparatus, protection relays, and system disturbances. |
| `/lifecycle` | `#/lifecycle` | `lifecycle` | **Lesson / article pages** | 7-Stage Substation Engineering Lifecycle: Planning, Tender, Design, Procurement, Construction, Commissioning, Operations & Asset Retirement. |
| `/engineers-chain` | `#/engineers-chain` | `engineers-chain` | **Lesson / article pages** | Complete 9-stage engineering workflow across disciplines. |
| `/ecosystem` | `#/ecosystem` | `ecosystem` | **Simulation** | Interactive 3D WebGL / Three.js electrotechnical ecosystem explorer. |
| `/architectures` | `#/architectures` | `architectures` | **Lesson / article pages** | Standard substation busbar architectures (Single Bus, Double Bus with Coupler, 1.5 Breaker, Ring Bus). |
| `/protection` | `#/protection` | `protection` | **Lesson / article pages** | Protection relaying philosophy, coordination margin grading ($\Delta t = 0.3\text{ s}$), and ANSI code matrix. |
| `/commissioning` | `#/commissioning` | `commissioning` | **Lesson / article pages** | Primary and secondary injection testing checklists and relay trip verification. |
| `/knowledge-graph` | `#/knowledge-graph` | `knowledge-graph` | **Simulation** | Interactive node-link causal graph explorer connecting all equipment, faults, and standards. |
| `/follow-the-energy` | `#/follow-the-energy` | `follow-the-energy` | **Simulation** | Real-time animated vector power flow across Cameroon generation, transmission, and load nodes. |
| `/scenarios` | `#/scenarios` | `scenarios` | **Simulation** | N-1 contingency, blackout recovery, and islanding scenario simulator. |
| `/asset-management` | `#/asset-management` | `asset-management` | **Lesson / article pages** | ISO 55000 asset health indexing, dissolved gas analysis (DGA - Duval Triangle), transformer lifespan estimation. |

