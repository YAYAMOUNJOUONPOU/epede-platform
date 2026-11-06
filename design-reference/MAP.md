# EPEDE — Codebase Architecture & Redesign Implementation Map (`MAP.md`)

> **Purpose**: Authoritative technical map of the existing EPEDE codebase prepared prior to executing the **ProCode Visual Redesign** (`design-reference/PROCODE_REDESIGN_PROMPT.md` and `design-reference/EPEDE Master.dc.html`).
> **Constraint**: Presentation and experience redesign only — preserve every existing route, bilingual EN/FR behavior, engineering formula, dataset, interactive module, safety state, provenance citation, and synthesis disclaimer.

---

## 1. Framework, Build Pipeline & Runtime Architecture

| Layer | Technology / File | Role |
| :--- | :--- | :--- |
| **UI Framework** | `react@^19.0.1`, `react-dom@^19.0.1`, `typescript@~5.8.2` | SPA client rendered into `#root` via `src/main.tsx` and `src/App.tsx`. |
| **Bundler & Dev Server** | `vite@^6.2.3`, `@vitejs/plugin-react@^5.0.4`, `esbuild@^0.25.0`, `express@^4.21.2` (`server.ts`) | Vite builds client assets (`dist/`); `esbuild` bundles `server.ts` into `dist/server.cjs`. |
| **Styling System** | `tailwindcss@^4.1.14`, `@tailwindcss/vite@^4.1.14`, `src/index.css` | Tailwind v4 `@import "tailwindcss";` + CSS custom properties (`--bg-primary`, `--text-primary`, etc.) and utility classes in `src/index.css`. |
| **Animation & 3D** | `framer-motion@^13.2.0`, `motion@^12.23.24`, `three@^0.186.0`, `@react-three/fiber`, `@react-three/drei` | Route transitions, interactive SVG/canvas motion, and 3D substation/ecosystem views. |
| **Icons & Export** | `lucide-react@^0.546.0`, `jspdf@^4.2.1`, `jspdf-autotable@^5.0.8` | UI iconography and engineering calculation PDF/CSV/JSON report generation. |
| **Validation & Gatekeeper** | `zod@^4.6.7`, `scripts/generate-meta.ts`, `scripts/runTests.ts`, `scripts/doctor.ts` | Pre-build content validation (`npm run validate:content` → `public/content-manifest.json`) and 34 automated unit/routing/solver tests (`npm test`). |
| **Auth & Persistence** | `firebase@^12.19.0` (`src/services/firebase.ts`, `src/services/AuthContext.tsx`) + `localStorage` | Optional Google Cloud Sync + local offline persistence for locale (`epede-locale-v2`), theme (`epede_theme`), saved studies, bookmarks, SLD annotations, and context trail. |

---

## 2. Router & Complete Route Inventory

### 2.1 Router Architecture
- **Router Engine**: `src/services/routerService.ts` (`parseRouteHash`, `buildRouteHash`, `getDocumentTitle`) + state/effect synchronization in `src/App.tsx`.
- **Routing Mechanism**: Hash-based routing (`window.location.hash` + `hashchange` listener) supporting:
  - **Locale prefixes**: `#/en/...` (English) and `#/fr/...` or unprefixed `#/...` (French/legacy aliases).
  - **Query parameters**: `?data=...` / `?p=...` (encoded calculator study parameters via `favoritesAndHistoryService.decodeCalculationParams`) and `?restoreTrail=...` (`contextStackSessionStore`).
  - **Code splitting**: `HomeView` is eagerly loaded; all 33 secondary views and 5 global modals are lazy-loaded via `React.lazy` + `<Suspense fallback={<EngineeringLoadingSkeleton />}>`.

### 2.2 Complete Route Table (`AppViewType` → Hash Routes → Component)

| `AppViewType` | Canonical EN Route | Canonical FR Route | Legacy / Alias Hashes Supported | Target View Component |
| :--- | :--- | :--- | :--- | :--- |
| `'home'` | `#/en/` | `#/` | `#/home`, `#/accueil`, `""` | `src/components/home/HomeView.tsx` |
| `'thematic-journeys'` | `#/en/learn` (`/:id`) | `#/apprendre` (`/:id`) | `#/learn`, `#/parcours`, `#/pathways`, `#/thematic-journeys` | `src/components/journey/ThematicJourneysWorkbench.tsx` |
| `'journey'` | `#/en/electrical-systems` (`/:stage`) | `#/systemes-electriques` (`/:stage`) | `#/journey`, `#/chaine-puissance`, `#/power-chain`, `#/electrical-systems` | `src/components/journey/JourneyView.tsx` |
| `'equipment-list'` | `#/en/equipment` | `#/materiel` | `#/equipment`, `#/equipement`, `#/equipements`, `#/reference`, `#/catalogue` | `src/components/equipment/EquipmentListView.tsx` |
| `'equipment'` | `#/en/equipment/:id` | `#/materiel/:id` | `#/equipment/:id`, `#/catalogue/:id` | `src/components/equipment/EquipmentDetailView.tsx` |
| `'equipment-reference'` | `#/en/equipment-reference` (`/:id`) | `#/referentiel-materiel` (`/:id`) | `#/equipment-reference` | `src/components/reference/ElectricalEquipmentReferenceView.tsx` |
| `'industrial-projects'` | `#/en/industrial-engineering` | `#/genie-industriel` | `#/industrial-projects`, `#/industrial-engineering`, `#/projets` | `src/components/projects/IndustrialProjectsView.tsx` |
| `'domains'` | `#/en/domains` | `#/domaines` | `#/domains`, `#/domaine`, `#/domain` | `src/components/domain/DomainsListView.tsx` |
| `'domain'` (`D01`–`D16`) | `#/en/domains/D01` … `D16` | `#/domaines/D01` … `D16` | `#/domain/D01` … `#/domain/D16`, `#/domaine/D01` … `D16` | `src/components/domain/DomainDetailView.tsx` |
| `'calculators'` | `#/en/calculators` (`/:tab`) | `#/calculateurs` (`/:slug`) | `#/calculators`, `#/calcul` (19 solver slugs in EN & FR) | `src/components/calculators/CalculatorsView.tsx` |
| `'cameroon-grid'` | `#/en/cameroon-grid` (`/:cat`) | `#/reseau-cameroun` (`/:cat`) | `#/cameroon-grid`, `#/cameroun`, `#/demarcation`, `#/multidisciplinary` | `src/components/grid/CameroonGridView.tsx` |
| `'simulation'` | `#/simulation` (`/:tab`) | `#/simulation` (`/:tab`) | 19 workbench tabs (`oscilloscope`, `power-triangle`, `transformer`, `short-circuit`, `coordination`, `ferranti`, `motor-start`, `distance-protection`, `transient-stability`, `differential-protection`, `directional-earth-fault`, `harmonic-filter`, `generator-capability`, `synchrocheck`, `substation-interlocking`, `ct-saturation`, `surge-arrester`, `cable-thermal`, `solar-bess`) | `src/components/simulation/SimulationLabView.tsx` |
| `'laboratory'` | `#/en/laboratory` (`/:tab`) | `#/laboratoire` (`/:tab`) | `#/laboratory`, `#/lab` | `src/components/laboratory/LaboratoryView.tsx` |
| `'diagrams'` | `#/diagrams` (`/:topology`) | `#/diagrams` (`/:topology`) | `#/sld`, `#/unifilaire` (`single_bus`, `double_bus`, `breaker_and_half`, `rmu_distribution`, `solar_bess`) | `src/components/diagrams/InteractiveSldView.tsx` |
| `'hydropower'` | `#/hydropower` | `#/hydropower` | `#/hydro` | `src/components/hydropower/HydropowerMasterWorkbench.tsx` |
| `'standards'` | `#/en/standards` (`/:ref`) | `#/normes` (`/:ref`) | `#/standards`, `#/norme`, `#/standard` | `src/components/standards/StandardsView.tsx` |
| `'regulatory'` | `#/regulatory` | `#/reglementation` | `#/en/regulatory`, `#/fr/reglementation` | `src/components/regulatory/RegulatoryView.tsx` |
| `'about'` | `#/en/about` | `#/a-propos` | `#/about`, `#/auteur`, `#/author` | `src/components/about/AboutView.tsx` |
| `'glossary'` | `#/en/glossary` | `#/glossaire` | `#/glossary`, `#/termes`, `#/acronymes` | `src/components/glossary/GlossaryView.tsx` |
| `'reference-hub'` | `#/en/reference-hub` | `#/centre-reference` | `#/reference-hub`, `#/reference-technique`, `#/hub` | `src/components/reference/TechnicalReferenceHubView.tsx` |
| `'roles'` | `#/roles` (`/:slug`) | `#/metiers` (`/:slug`) | `#/en/roles` | `src/components/roles/RolesView.tsx` |
| `'lifecycle'` | `#/lifecycle` | `#/cycle-de-vie` | `#/en/lifecycle` | `src/components/lifecycle/LifecycleView.tsx` |
| `'context-stack'` | `#/context-stack` (`/:nodeId`) | `#/context-stack` (`/:nodeId`) | — | `src/components/common/EngineeringContextStack.tsx` |
| `'engineers-chain'` | `#/engineers-chain` | `#/ingenieurs` | — | `src/components/engineers/EngineersChainView.tsx` |
| `'ecosystem'` | `#/ecosystem` | `#/ecosysteme` | Full-screen 3D/panoramic canvas | `src/components/ecosystem/ElectricalEcosystemView.tsx` |
| `'architectures'` | `#/architectures` | `#/architectures` | AIS/GIS/TCO comparator | `src/components/comparison/ArchitectureComparisonWorkbench.tsx` |
| `'protection'` | `#/protection` | `#/protections` | — | `src/components/protection/ProtectionEngineeringWorkbench.tsx` |
| `'commissioning'` | `#/commissioning` | `#/essais` | FAT/SAT protocols | `src/components/commissioning/CommissioningDashboardView.tsx` |
| `'knowledge-graph'` | `#/knowledge-graph` (`/:id`) | `#/knowledge-graph` (`/:id`) | — | `src/components/graph/KnowledgeGraphExplorer.tsx` |
| `'follow-the-energy'` | `#/follow-the-energy` | `#/follow-the-energy` | — | `src/components/energy/FollowTheEnergyView.tsx` |
| `'scenarios'` | `#/scenarios` (`/:id`) | `#/scenarios` (`/:id`) | — | `src/components/scenarios/PedagogicalScenariosWorkbench.tsx` |
| `'traceability'` | `#/traceability` | `#/traceability` | Data provenance registry | `src/components/trust/DataProvenanceRegistryView.tsx` |
| `'asset-management'` | `#/asset-management` (`/:pillar`) | `#/maintenance` (`/:pillar`) | ISO 55000 / IEC 60599 DGA | `src/components/assets/AssetManagementDiagnosticsWorkbench.tsx` |
| `'phase2'` | `#/phase2` | `#/phase2` | Governance & 21-domain matrices | `src/components/phase2/Phase2MasterView.tsx` |
| `'not-found'` | `#/404` | `#/404` | Any unmatched hash | `src/components/common/NotFoundView.tsx` |

---

## 3. Shared Layout, Navigation & Common UI Components

### 3.1 Layout Components (`src/components/layout/`) — **[PRESENTATION]**
- `Header.tsx`: Fixed top navigation bar. Currently renders sidebar toggle, EPEDE brand mark, 7-item center navigation (`Home`, `Learn`, `Electrical Systems`, `Equipment`, `Industrial Engineering`, `Engineering Library` dropdown, `About EPEDE`), right-side `Search` (`Ctrl+K`), `EN · FR` toggle, `AI Guide` button, User Profile/Role/Sync dropdown, and `ENTER EPEDE` button.
- `Sidebar.tsx`: Slide-out / collapsible left drawer containing full D01–D16 domain taxonomy, L01–L06 transversal layers, and tool shortcuts.
- `Disclaimer.tsx`: Route-ending `ENGINEERING SYNTHESIS NOTICE` / `RÉFÉRENTIEL TECHNIQUE` card (`#epede-discreet-disclaimer`). Currently the only page-ending footer element on inner routes (a shared sitewide footer must be added immediately after it per ProCode spec).
- `MobileFieldQuickDock.tsx`: Fixed bottom mobile navigation bar (`md:hidden`) with 4 items (`Home`, `Learn`, `Calculate`, `Equipment`).
- `ScadaTelemetryBar.tsx`: Top strip shown on `simulation`/`diagrams` or when `isContextHUDOpen` (`Ctrl+B`) is active.
- `PersistentEngineeringContextBar.tsx` & `PersistentEngineeringContextDock.tsx`: Toggleable context trail bars (`Ctrl+B`).
- `UsageLevelSwitcher.tsx`: Beginner / Technician / Engineer pedagogical depth selector (`src/services/UsageLevelContext.tsx`).
- `MobileQrScannerModal.tsx`: Mobile QR/barcode equipment lookup modal.

### 3.2 Shared Common & UI Primitives (`src/components/common/`, `src/components/ui/`, `src/components/context/`, `src/components/trust/`)
- **Visual & Page Headers [PRESENTATION]**:
  - `src/components/common/EngineeringBackground.tsx` (Currently renders fixed dark grid/radial background across views — to be replaced/toned down for the warm paper `#F6F4EE` editorial shell).
  - `src/components/common/PedagogicalPageOrientationHeader.tsx`
  - `src/components/common/AuthoritativeEcosystemHero.tsx`
  - `src/components/common/GlobalBreadcrumbs.tsx`
  - `src/components/common/PowerChain.tsx`
  - `src/components/common/EngineeringImageWithMeta.tsx` (Renders verified asset photos with captions, license/credit metadata, and callout annotations).
  - `src/components/ui/DynamicSectionBackground.tsx`, `FormulaBlock.tsx`, `StandardBadge.tsx`, `VoltageIndicator.tsx`.
- **Context, Provenance & Trust Badges [HYBRID: CONTENT + PRESENTATION]**:
  - `src/components/trust/EvidenceTrustBadge.tsx`, `AuditedValueBadge.tsx`, `EvidenceProvenanceModal.tsx`, `DataProvenanceRegistryView.tsx`.
  - `src/components/context/AssumptionsLimitationsCard.tsx`, `SystemBoundaryCard.tsx`, `WhyThisMattersCard.tsx`, `KeyEngineeringDecisionsCard.tsx`, `EngineeringRelationshipTraceCard.tsx`, `ObjectRelationshipActionBar.tsx`, `RoleExplorationToolbar.tsx`, `RecentlyExploredDrawer.tsx`.

---

## 4. Global CSS, Typography & Design Tokens

### 4.1 Current State (`index.html`, `src/index.css`, `src/components/epede/epede-hero.css`)
- **Fonts loaded in `index.html`**: `Inter`, `Outfit`, `Space Grotesk`, `IBM Plex Sans`, `IBM Plex Mono`, `JetBrains Mono`.
  - *Note from `design-reference/EPEDE Master.dc.html` & `PROCODE_REDESIGN_PROMPT.md`*: The redesign uses `Manrope` (or existing readable sans-serif) for display/body, `Instrument Serif` (italic editorial emphasis in hero/section headers per `EPEDE Master.dc.html`), and `IBM Plex Mono` strictly for short engineering values, voltage labels, asset IDs, units, and schematic identifiers.
- **Current CSS Variables in `src/index.css`**:
  - Defaults to dark theme (`--bg-primary: #0B0F12`, `--bg-surface-1: #151C1E`, `--text-primary: #F4F1E8`, `--accent-amber: #D7A64A`, `--accent-cyan: #567A87`) with a `.light` override (`#F4F1E8`).
  - Many page components currently hardcode dark Tailwind classes (`bg-[#0B0F12]`, `bg-slate-950`, `bg-slate-900`, `text-slate-100`, `.epede-card`, `.epede-glass-panel`).

### 4.2 Target Redesign Tokens (`PROCODE_REDESIGN_PROMPT.md` & `EPEDE Master.dc.html`)
- **Warm Editorial Shell**:
  - `--bg-paper` / `--bg-primary`: `#F6F4EE` (Warm paper main background)
  - `--bg-narrative` / `--bg-surface-1`: `#FFFDF9` (Alternate narrative surface)
  - `--bg-subtle`: `#E9E5DA` / `#EEF0EA` (Soft section washes)
  - `--text-ink` / `--text-primary`: `#17282C` (Deep ink primary text)
  - `--text-body`: `#33474B` (Editorial body copy)
  - `--text-slate` / `--text-secondary`: `#5C6C70` (Slate secondary text)
  - `--rule-hairline`: `#DEDACF` / `#CFCABD` / `#EEEAE0` (Fine editorial rules replacing boxed borders)
  - `--accent-teal`: `#147C78` (Hover `#0E5E5B`; active engineering brand teal)
  - `--accent-amber`: `#B8872D` (Selected stage / voltage / energy accent)
- **Focused Technical Workbench Surface** (used selectively for active oscilloscopes, SLD canvases, simulators, motor starter workbench, and dense instruments):
  - `--workbench-bg`: `#10191D` (Graphite technical workbench background)
  - `--workbench-fg`: `#F4F1E8` (Workbench primary foreground)
  - `--workbench-muted`: `#B9C2C0` / `#8A9694`
  - `--workbench-line`: `#2A383C` / `#4A5A5E`
  - `--workbench-energized`: `#6CC3BD`
  - `--workbench-trip`: `#E07A5F` / `#F2A48F`
- **Reduced Motion & Print**:
  - `@media (prefers-reduced-motion: reduce)` already exists in `src/index.css` (lines 421–440) and will be preserved and extended.
  - `@media print` rules in `src/index.css` (lines 465–529) for formal engineering calculation notes will be preserved.

---

## 5. Image & Visual Assets Inventory

### 5.1 Local Static Assets (`public/` & `src/assets/`)
- **Photographic Batches (`public/images/homepage_uploads/`)**: 35 local infrastructure photographs:
  - `batch_01_image_001.jpg` to `batch_01_image_005.jpg`
  - `batch_02_image_006.jpg` to `batch_02_image_010.jpg`
  - `batch_03_image_011.jpg` to `batch_03_image_015.jpg`
  - `batch_04_image_016.jpg` to `batch_04_image_020.jpg`
  - `batch_05_image_021.jpg` to `batch_05_image_025.jpg`
  - `batch_06_image_026.jpg` to `batch_06_image_030.jpg`
  - `batch_07_image_031_hydro_turbine_hall.jpg`
  - `batch_07_image_032_mv_lv_switchgear_mcc.jpg`
  - `batch_07_image_033_substation_night_transformer_bay.jpg`
  - `batch_07_image_034_wind_farm_renewable.jpg`
  - `batch_07_image_035_scada_control_room.jpg`
- **Ecosystem Panoramas (`public/assets/ecosystem/` & `src/assets/ecosystem/`)**:
  - `power-generation-ecosystem.jpg`
  - `power-transmission-ecosystem.jpg`
  - `power-substation-ecosystem.jpg`
  - `distribution-installation-ecosystem.jpg`
  - `electrical-energy-ecosystem.jpg`

### 5.2 Typed Asset Registries (`src/data/`) — **[CONTENT]**
- `src/data/assets/epedeAssetRegistry.ts`: Central typed asset registry (`EPEDE_ASSET_REGISTRY`) with domain mapping, voltage class, standards, callout annotations, license, attribution, and bilingual `altText`/`caption`.
- `src/data/homepageImageLibrary.ts`: Curated mapping (`HOMEPAGE_IMAGE_LIBRARY`) of the 35 local `batch_01`–`batch_07` images to power-chain stages, domains, and equipment.
- `src/data/equipmentPhotographicRegistry.ts`: Photographic and cutaway references for the 39 canonical equipment items.
- `src/data/cinematicSlidesData.ts`: Hero carousel themes and slide metadata.
- `src/data/visualInventory.ts` & `src/data/engineeringInfographics.ts`: Technical SVG infographic registry.

---

## 6. Data, Content & Normative Solver Sources (`src/data/`, `src/i18n/`, `src/types/`)

All files in this section hold **Authoritative Engineering Content, Data Models, or Normative Calculation Physics** and **MUST NOT** have their formulas, ratings, uncertainty notes, or schemas altered during the visual redesign:

### 6.1 Core Taxonomy & Domain Content — **[CONTENT]**
- `src/data/epedeData.ts`: Canonical `DOMAINS` (D01–D16), `LAYERS` (L01–L06), `D01_SUBDOMAINS`, `OTHER_SUBDOMAINS`, `SUBDOMAIN_CONTENTS`, `EQUIPMENT_ITEMS` (39 items), `FORMULAS`, `STANDARDS`, `ENGINEERING_ROLES`.
- `src/data/canonicalPowerChain.ts`: The 9 canonical stages of the electrical power journey (`Stage 01 Generation` → `Stage 09 Automation & Control`).
- `src/data/learningPathwaysData.ts` & `src/data/thematicJourneysData.ts`: The 8 structured learning pathways and step-by-step pedagogical journeys.
- `src/components/domain/domainPedagogicalRegistry.ts` & `src/components/domain/domainPedagogicalContentRegistry.ts`: The "Three Key Questions", operating principles, and pedagogical guides for D01–D16.
- `src/data/phase2Specs.ts` & `src/data/phase2Matrices.ts`: Phase 2 subdomain specifications and cross-domain matrices.
- `src/data/electrotechnicalGlossaryData.ts`: Bilingual IEC 60050 electrotechnical glossary terms.
- `src/data/regulatoryData.ts`: Cameroon Electricity Law 2011/022, grid codes, ARSEL/SONATREL/ENEO/EDC/MINEE institutional framework.
- `src/data/lifecycleData.ts`: EPC / FAT / SAT / O&M lifecycle stages.
- `src/data/evidenceProvenanceData.ts`: Source citations and provenance audit registry.

### 6.2 Equipment Catalogue Data (39 Canonical Entries) — **[CONTENT]**
- `src/data/equipment/canonicalEquipmentRegistry.ts`
- `src/data/equipment/canonicalEquipmentSlice.ts`
- `src/data/equipment/sliceTransmissionAndSubstation.ts`
- `src/data/equipment/sliceDistributionAndInstallation.ts`
- `src/data/equipment/sliceTerminalAndLoads.ts`
- `src/data/equipment/sliceAncillaryAndGrid.ts`
- `src/data/equipment/sliceAdvancedDomains.ts`

### 6.3 Cameroon National Grid Datasets (RIS & RIN) — **[CONTENT]**
- `src/data/cameroonGridData.ts`, `src/data/cameroonGrid2026.ts`, `src/data/cameroonGridGeoData.ts`, `src/data/cameroonGeoMapData.ts`
- `src/data/cameroonGridReferenceData.ts` (18 power plants, 17 substations, 14 HV corridors, MV/LV distribution, 8 institutions, 1953–2035 timeline, 8 official documents)
- `src/data/cameroonSeasonalHydrologyData.ts` (4 hydrological basins, 5 plant Jan–Dec seasonal profiles, 12-month grid calendar, 24h load curve, 6 case studies)
- `src/data/cameroonContractualBoundariesData.ts`, `src/data/cameroonGridSolver.ts`

### 6.4 Normative Engineering Solver Engines — **[CONTENT / LOGIC]**
- `src/data/iec60909Engine.ts` (Short-circuit $I_k''$, $i_p$, $I_b$, $I_{th}$)
- `src/data/vectorVoltageDropEngine.ts` (IEC 60364-5-52 / NF C 15-105 $\Delta U$)
- `src/data/iec60287CableAmpacityEngine.ts` (Cable ampacity & thermal derating)
- `src/data/iec60255RelayEngine.ts` & `src/data/tccCoordinationEngine.ts` (IDMT relay curves & selectivity)
- `src/data/ieee80EarthingGridEngine.ts` (Substation mesh touch/step voltage)
- `src/data/iec60865BusbarEngine.ts` (Busbar electrodynamic forces)
- `src/data/iec60826TensionSagEngine.ts` (Overhead line catenary sag & SIL)
- `src/data/iec61869CtSizingEngine.ts` (CT knee-point $V_k$ & saturation)
- `src/data/iec60099SurgeArresterEngine.ts` (ZnO surge arrester MCOV/TOV)
- `src/data/iec61936AisClearanceEngine.ts` (AIS phase-to-earth / phase-to-phase clearances)
- `src/data/harmonicResonanceEngine.ts` & `src/data/industrialMotorDynamicsEngine.ts`
- `src/data/normativeFormulaRegistry.ts` & `src/data/workedExamplesRegistry.ts`

### 6.5 Hydropower Digital Twin Datasets (22 Files) — **[CONTENT]**
- `src/data/hydropowerData.ts`, `hydropowerDesignData.ts`, `hydropowerSubsystemsData.ts`, `hydropowerTransientsData.ts`, `hydropowerFleetData.ts`, `hydropowerRegionalGridData.ts`, `hydropowerGridSafetyData.ts`, `hydropowerAssetHealthData.ts`, `hydropowerStandardsData.ts`, `hydropowerOtsData.ts`, `hydropowerBlackStartData.ts`, `hydropowerWamsInertiaData.ts`, `hydropowerClimateSedimentData.ts`, `hydropowerCyberOtData.ts`, `hydropowerPshStorageData.ts`, `hydropowerEsgBioData.ts`, `hydropowerDamBreakData.ts`, `hydropowerEnergyTradingData.ts`, `hydropowerAiAutonomousData.ts`, `hydropowerHybridHydrogenData.ts`, `hydropowerSpatialTwinData.ts`, `hydropowerMasterOpsData.ts`.

---

## 7. Interactive Engineering Modules & Workbenches

These modules combine **stateful engineering simulation/calculation logic** with **interactive UI controls and canvases** (**[HYBRID: LOGIC + PRESENTATION]**):

1. **Calculators Suite (`src/components/calculators/`)**:
   - Container: `CalculatorsView.tsx` + `FormulaDerivationPanel.tsx`, `CalculationReportModal.tsx`, `SavedStudiesDrawer.tsx`, `CalculationStudyHistoryDrawer.tsx`.
   - 19 Solvers (`src/components/calculators/modules/`): `PowerCalculator.tsx`, `VoltageDropCalculator.tsx`, `CableEndShortCircuitCalculator.tsx`, `LoadScheduleCalculator.tsx`, `TransformerCalculator.tsx`, `MotorCalculator.tsx`, `SilCalculator.tsx`, `EarthingCalculator.tsx`, `ArcFlashCalculator.tsx`, `CtSizingCalculator.tsx`, `PfcCalculator.tsx`, `SolarSizingCalculator.tsx`, `BessSizingCalculator.tsx`, `SurgeArresterCalculator.tsx`, `BusbarElectrodynamicCalculator.tsx`, `CableAmpacityCalculator.tsx`, `TransmissionLineCalculator.tsx`, `NeutralGroundingCalculator.tsx`, `RelayTccCalculator.tsx`.
2. **Simulation Laboratory (`src/components/simulation/`)**:
   - Container: `SimulationLabView.tsx`.
   - 19 Workbenches (`src/components/simulation/modules/`): `OscilloscopeTab.tsx`, `PowerTriangleTab.tsx`, `TransformerLabTab.tsx`, `ShortCircuitLabTab.tsx`, `RelayCoordinationTab.tsx`, `FerrantiLabTab.tsx`, `MotorStartLabTab.tsx`, `DistanceProtectionTab.tsx`, `TransientStabilityTab.tsx`, `DifferentialProtectionTab.tsx`, `DirectionalEarthFaultTab.tsx`, `HarmonicFilterLabTab.tsx`, `GeneratorCapabilityLabTab.tsx`, `SynchrocheckLabTab.tsx`, `SubstationInterlockingLabTab.tsx`, `CtSaturationLabTab.tsx`, `SurgeArresterLabTab.tsx`, `CableThermalTransientLabTab.tsx`, `SolarBessLabTab.tsx`.
3. **Interactive Single-Line Diagrams (`src/components/diagrams/`)**:
   - Container: `InteractiveSldView.tsx` + `modules/useSldSimulation.ts`, `SldHeaderToolbar.tsx`, `SldCanvasViewport.tsx`, `SldTelemetryPanel.tsx`, `SldFaultSimulationPanel.tsx`, `SldSoeLogPanel.tsx`, `SldOscillographyViewer.tsx`.
   - Topologies: `SingleBusSubstationSvg.tsx`, `DoubleBusSubstationSvg.tsx`, `BreakerAndHalfSubstationSvg.tsx`, `RmuDistributionSvg.tsx`, `SolarBessSubstationSvg.tsx`.
   - 22 SVG Infographics (`src/components/diagrams/infographics/*.tsx`).
4. **Cameroon Grid Observatory (`src/components/grid/`)**:
   - Container: `CameroonGridView.tsx` + `RealCameroonGeographicMap.tsx` + `InteractiveCameroonGridMap.tsx`.
   - Workbenches (`src/components/grid/modules/`): `CameroonPowerFlowJourney.tsx`, `CameroonGenerationPortfolioVisualizer.tsx`, `CameroonTransmissionEngineeringVisualizer.tsx`, `CameroonSubstationArchitectureExplorer.tsx`, `CameroonDistributionNetworkViewer.tsx`, `CameroonSeasonalReliabilityWorkbench.tsx`, `CameroonReferenceEncyclopediaModules.tsx`, `CameroonGridSldSynoptic.tsx`, `CameroonGridContingencySimulator.tsx`, `NationalScadaDispatchingCockpit.tsx`, `SanagaHydrometCascadeWorkbench.tsx`, `GenerationMasterPlan2035Workbench.tsx`, `RegionalInterconnectionPirectWorkbench.tsx`, `IndustrialOfftakersMatrixViewer.tsx`.
5. **Domain-Specific Workbenches (`D01`–`D16`)**:
   - `D01`: `src/components/production/EnergyProductionMainView.tsx` & `HydropowerVisualJourney.tsx`
   - `D02`: `src/components/grid-architecture/GridArchitectureVisualJourney.tsx`
   - `D03`: `src/components/transmission/TransmissionWorkbench.tsx`
   - `D04`: `src/components/substations/SubstationsWorkbench.tsx` & `D04PedagogicalPilotView.tsx`
   - `D05`: `src/components/distribution/DistributionWorkbench.tsx`
   - `D06`: `src/components/installations/InstallationsWorkbench.tsx`
   - `D07`: `src/components/automation/AutomationControlWorkbench.tsx`
   - `D08`: `src/components/elv/ExtraLowVoltageWorkbench.tsx`
   - `D09`: `src/components/ai/AdvancedAiWorkbench.tsx`
   - `D10`: `src/components/storage/EnergyStorageWorkbench.tsx`
   - `D11`: `src/components/protection/ProtectionEngineeringWorkbench.tsx`
   - `D12`: `src/components/scada/ScadaAutomationWorkbench.tsx`
   - `D13`: `src/components/telecom/TelecomIec61850Workbench.tsx`
   - `D14`: `src/components/power-quality/PowerQualityEmcWorkbench.tsx`
   - `D15`: `src/components/metering/SmartMeteringGridDigitalizationWorkbench.tsx`
   - `D16`: `src/components/safety/SubstationEarthingLightningWorkbench.tsx`
6. **Hydropower Suite (`src/components/hydropower/`)**:
   - `HydropowerMasterWorkbench.tsx` + 23 specialized hydropower views.

---

## 8. File Classification Matrix: Content vs. Presentation vs. Hybrid

| Directory / File Path | Classification | Redesign Action |
| :--- | :--- | :--- |
| `src/data/**` (75 files) | **CONTENT & SOLVER LOGIC** | **DO NOT ALTER** formulas, ratings, or schemas. Optionally extend asset metadata in `epedeAssetRegistry.ts` / `homepageImageLibrary.ts` if needed for responsive crops. |
| `src/types/**` (27 files) | **CONTENT SCHEMAS** | **PRESERVE** all existing types. |
| `src/services/routerService.ts` | **ROUTING LOGIC** | **PRESERVE** all routes, aliases (`#/journey` ↔ `#/en/electrical-systems`), `#/domain/D01`–`D16`, and query decoders. |
| `src/services/**` (16 files) | **STATE & SERVICES** | **PRESERVE** auth, persistence, history, PDF export, and IEC 61850 services. |
| `src/index.css` & `index.html` | **PRESENTATION TOKENS** | **UPDATE** central CSS custom properties (`#F6F4EE` warm paper, `#FFFDF9` narrative surface, `#17282C` deep ink, `#5C6C70` slate, `#147C78` teal, `#B8872D` amber, `#10191D` workbench graphite), fluid typography (`Manrope`, `Instrument Serif`, `IBM Plex Mono`), focus rings, and reduced-motion rules. |
| `src/App.tsx` | **HYBRID (ROUTER + SHELL)** | **UPDATE SHELL** (`bg-[#F6F4EE] text-[#17282C]`), remove sitewide dark starfield/grid background, integrate shared `Footer` after `Disclaimer`, preserve all route state and lazy views. |
| `src/components/layout/Header.tsx` | **PRESENTATION** | **REDESIGN** into the 72 px bright editorial header (`Home`, `Learn`, `Electrical Systems`, `Equipment`, `Industrial Engineering`, searchable grouped `Library` panel closed by default, `About`, right-side `Search`, `EN/FR`, restrained `Profile` & `Enter EPEDE`) + accessible mobile menu. |
| `src/components/layout/Footer.tsx` *(to create)* & `Disclaimer.tsx` | **PRESENTATION** | **ADD** shared sitewide footer (`#17282C` deep ink footer per `EPEDE Master.dc.html`) immediately following the preserved route-specific `Disclaimer`. |
| `src/components/layout/MobileFieldQuickDock.tsx` | **PRESENTATION** | **REFINE** to avoid duplicate navigation clutter, support safe-area insets, and never cover form controls. |
| `src/components/home/HomeView.tsx` & `src/components/home/*` | **HYBRID (NARRATIVE + UI)** | **REDESIGN** into the 10-scene bright editorial sequence defined in `EPEDE Master.dc.html` & `PROCODE_REDESIGN_PROMPT.md` (photo-led 92svh hero with pause/tabs, 9-stage flow line, Generation photo story, 9-stage interactive system journey, 4 open learning moves, Cameroon grid RIS/RIN teaser, featured + directory learning pathways, graphite `#10191D` DOL motor-starter workbench, Cameroon projects & Nachtigal case study rows, final CTA). |
| `src/components/journey/ThematicJourneysWorkbench.tsx` (`#/en/learn`) | **HYBRID** | **REDESIGN** presentation into a bright editorial introduction, recommended entry point, audience filters, power-system sequence visual, and readable list of all 8 pathways (not 8 boxed cards). |
| `src/components/journey/JourneyView.tsx` (`#/journey`, `#/en/electrical-systems`) | **HYBRID** | **REDESIGN** presentation into the connected 9-stage horizontal stepper + open editorial stage view (image, stage focal title, concise voltage/domain strip, purpose, key apparatus list, library link) while preserving all 9 stages and interactive modals/drawers. |
| `src/components/equipment/EquipmentListView.tsx` & `EquipmentDetailView.tsx` | **HYBRID** | **REDESIGN** presentation into a bright scannable catalogue with responsive filter toolbar, active filter chips, comparison bar, genuine asset photography/cutaways, and 1-column mobile list with filter drawer. |
| `src/components/projects/IndustrialProjectsView.tsx` (`#/en/industrial-engineering`) | **HYBRID** | **REDESIGN** into a bright field-story lead + editorial project rows with photo/diagram, scope, location, and links to motor starter, SLD, and domains. |
| `src/components/domain/DomainsListView.tsx` (`#/domains`) | **HYBRID** | **REDESIGN** into a bright editorial index grouping `D01–D06` (physical chain) and `D07–D16` (transversal disciplines/protection/safety) + balanced 3×2 grid for the 6 foundations (`L01–L06`). |
| `src/components/domain/DomainDetailView.tsx` (`#/domain/D01`–`D16`) | **HYBRID** | **REDESIGN** shared domain shell (back-to-directory link, domain title/lead, domain-specific visual/diagram for D01–D16, optional "three questions" index, technical content, workbenches, related domains, disclaimer + shared footer). |
| `src/components/calculators/CalculatorsView.tsx` & `modules/*` | **HYBRID** | **REDESIGN** shell to replace the horizontal 19-item strip with a searchable, categorized solver picker + labeled secondary toolbar (`Share`, `Study History`, `Saved Studies`, `Technical Note`, `PDF`), clear result-first hierarchy, and mobile stacked layout while preserving all 19 solvers. |
| `src/components/grid/CameroonGridView.tsx` & `modules/*` | **HYBRID** | **REDESIGN** shell with bright editorial intro, compact source/date-linked KPI strip, large GIS map (`#10191D` technical frame) with persistent mapped-vs-schematic legend, and preserved seasonal/hydrology/network tabs. |
| `src/components/simulation/SimulationLabView.tsx` & `modules/*` | **HYBRID** | **REDESIGN** shell with light editorial page context, searchable/categorized 19-workbench selector, and `#10191D` graphite surface reserved for the active waveform/instrument canvas. |
| `src/components/diagrams/InteractiveSldView.tsx` & `modules/*` | **HYBRID** | **REDESIGN** shell with clear separation between the `#10191D` SLD drawing canvas, explicit legend/status bar, and selected-element inspector panel (with mobile detail panel & fit-to-view). |
| `src/components/hydropower/HydropowerMasterWorkbench.tsx` | **HYBRID** | **REDESIGN** shell leading with a strong hydro image/diagram and continuous water-to-wire energy conversion sequence, keeping the simulator in an explicitly labeled technical workbench. |
| `src/components/standards/StandardsView.tsx` | **HYBRID** | **REDESIGN** into a bright editorial reference index with search first, compact issuer/category/domain filters, stable hierarchy per standard, and Cameroon operating-envelope note. |
| `src/components/regulatory/RegulatoryView.tsx` | **HYBRID** | **REDESIGN** into a bright legal/reference index & timeline with simple institutional diagram, adjacent date/source/status metadata, and explicit JSON/data export action area. |
| `src/components/about/AboutView.tsx` | **HYBRID** | **REDESIGN** into a bright mission-led editorial page with platform overview, what it connects, creator attribution (Mounjouonpou Yaya), and next step to Learn or the system journey. |

