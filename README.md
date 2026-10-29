# EPEDE — Electrical Power Engineering Digital Environment

**EPEDE** is a professional, research-driven, interconnected electrical power engineering knowledge environment designed by **Mounjouonpou Yaya** (Electrical and Power Systems Engineer).

It helps early-career electrical engineers, technicians, engineers transitioning into power systems, students preparing for practice, and seasoned professionals understand how electrical power systems work in real life—from generation plants and high-voltage transmission lines to substations, distribution networks, protection schemes, and industrial loads—with a dedicated focus on **African and Cameroonian electrical power infrastructure (RIS & RIN)**.

> **Scope Statement:** EPEDE is an interactive technical knowledge and infrastructure exploration platform. It complements—and does not replace—certified power system study and CAD suites such as ETAP, DIgSILENT PowerFactory, PSS®E, or AutoCAD Electrical.

---

## 1. Visual Identity & Design Tokens

EPEDE implements a dark engineering interface engineered for long-form technical reading, schematic clarity, and controlled contrast:

| Token | Hex Code | Role |
| :--- | :--- | :--- |
| `--epede-bg-primary` | `#0B0F12` | Primary obsidian canvas background |
| `--epede-bg-secondary` | `#151C1E` | Secondary technical panel and card surface |
| `--epede-text-primary` | `#F4F1E8` | Warm parchment primary text for high readability |
| `--epede-text-secondary` | `#A9ADA5` | Muted technical ash for secondary metadata |
| `--epede-accent-gold` | `#D7A64A` | Engineering gold accent (CTAs, active states, busbar highlights) |
| `--epede-tech-blue` | `#567A87` | Technical blue-grey (borders, structural dividers, badges) |

---

## 2. Knowledge Architecture (21 Interconnected Pillars)

The platform organizes over 100 modules, 39 industrial equipment specifications, and 80+ international standards (`IEC`, `IEEE`, `CIGRE`, `NF C`, `SONATREL Grid Code`) into three coherent macro-groups:

1. **Group I — The Physical Power System Chain (`D01`–`D06`)**
   - `D01` Electrical Power Generation (Hydro, Thermal Gas, Solar PV)
   - `D02` Electrical Machines & Power Transformers
   - `D03` High-Voltage Transmission (`90 kV` / `110 kV` / `225 kV` / `400 kV`)
   - `D04` HV/MV Electrical Substations (AIS / GIS topologies, primary & secondary engineering)
   - `D05` Medium-Voltage Distribution (`15 kV` / `30 kV` RMU rings, urban & rural feeders)
   - `D06` Low-Voltage Distribution & Industrial Installations (`400 V`, `TN-S` / `TN-C-S` / `TT` / `IT`)
2. **Group II — Control, Protection, Storage & Operational Integrity (`D07`–`D16`)**
   - `D07` Power Electronics, Drives & FACTS
   - `D08` Energy Storage & Hybrid Microgrids (BESS)
   - `D09` Power System Analysis & Stability
   - `D10` Power Quality, Harmonics & EMC
   - `D11` Protection Systems & Relay Coordination (`ANSI 21`, `87T`, `87B`, `50/51`, `67N`)
   - `D12` Substation Automation, SCADA & `IEC 61850`
   - `D13` Electrical Instrumentation & Metering (`CT` / `VT` accuracy & saturation)
   - `D14` Earthing Systems & Lightning Protection (`IEEE 80`, `IEC 62305`)
   - `D15` Testing, Commissioning (FAT/SAT) & Diagnostics (`DGA`, `SFRA`, `Tan Delta`)
   - `D16` Electrical Safety, Arc Flash & Maintenance (`LOTO`, `NFPA 70E`)
3. **Group III — Cross-Cutting Engineering Foundations (`L01`–`L05`)**
   - `L01` Electrotechnical Fundamentals & Per-Unit Theory
   - `L02` Materials, Dielectrics (`SF6`, mineral oil, XLPE) & Thermal Physics
   - `L03` International Standards (`IEC`, `IEEE`, `CIGRE`, `NF C`) & IEV Terminology (`IEC 60050`)
   - `L04` Engineering Documentation, Schematics & Project Lifecycle
   - `L05` National Grid Context & Institutional Governance (Cameroon `SONATREL`, `Eneo`, `EDC`, `ARSEL`, `NHPC`)

---

## 3. Real-World Cameroon Power Network Explorer & Research Integrity

The **Cameroon Power Network Explorer** (`#/en/cameroon-grid`) provides a structured engineering observatory of Cameroon's electrical power system:
- **Southern Interconnected Grid (RIS):** `225 kV` and `90 kV` backbone linking Sanaga basin hydropower plants (**Nachtigal 420 MW**, **Songloulou 384 MW**, **Edéa 276 MW**), the Southern **Memve'ele 211 MW** hydro plant, and coastal thermal plants (**Kribi 216 MW**, **Limbe 85 MW**, **Logbaba**) to major load centers in **Yaoundé (Oyomabang, Ahala, Ngousso, Nsimalen)** and **Douala (Bekoko, Logbaba, Koumassi, Makepe, Deido)**.
- **Northern Interconnected Grid (RIN):** **Lagdo 72 MW** hydropower plant and **Maroua / Guider** solar PV + BESS hybrid plants supplying **Garoua**, **Ngaoundéré**, and **Maroua** across `110 kV` and `90 kV` corridors.
- **Eastern Regional System:** **Lom Pangar** regulating dam (`6 billion m³` reservoir) and `30 MW` toe-of-dam powerhouse.
- **Data Provenance & Verification:** Every power plant, substation, and transmission corridor explicitly records its `verification_status` (`CONFIRMED_PUBLIC_SOURCE`, `UNDER_CONSTRUCTION_VERIFIED`, or `ENGINEERING_REFERENCE_MODEL`), `source_citation`, `source_date`, and engineering scope notes.

---

## 4. Technical Stack & Backend API

- **Frontend:** React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, Motion, Three.js / `@react-three/fiber` (3D equipment cutaways), D3 (knowledge graph & TCC curves), Leaflet (GIS network views), `pdf-lib` (vector PDF technical exports).
- **Backend (`server.ts`):** Express + TypeScript REST API (`/api/v1/*`) with `helmet`, `cors`, `express-rate-limit`, and `zod` schema validation:
  - `GET /api/v1/health` — API health check
  - `GET /api/v1/domains` & `GET /api/v1/domains/:code` — 16 Electrical Domains & metadata
  - `GET /api/v1/equipment` & `GET /api/v1/equipment/:id` — 39 real-world equipment datasheets
  - `GET /api/v1/cameroon-grid` (`/plants`, `/substations`, `/corridors`) — Verified Cameroon grid dataset with source provenance
  - `GET /api/v1/graph` — Interconnected knowledge graph nodes and edges
  - `GET /api/v1/search?q=...` — Unified full-text search across domains, equipment, standards, and grid assets
  - `GET /api/v1/workbenches`, `/api/v1/scenarios`, `/api/v1/field-engineering` — Simulation & commissioning endpoints

---

## 5. Local Development & Production Build

### Prerequisites
- Node.js `>= 20.x`
- npm `>= 10.x`

### Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack development server (Express API + Vite HMR on port 3000)
npm run dev

# 3. Run TypeScript static type checking
npm run lint

# 4. Build for production (Vite frontend bundle in dist/ + esbuild server bundle in dist-server/)
npm run build

# 5. Start the production server
npm run start
```

