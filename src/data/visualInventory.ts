// src/data/visualInventory.ts
// Central Engineering Visual Inventory for EPEDE
// Tracks every engineering photograph, technical illustration, schematic diagram, and interactive visualization.
// Follows: PAGE → SECTION → CONTENT → VISUAL REQUIREMENT → IMAGE → INTEGRATION → REVIEW

export type VisualType = 
  | 'PHOTOGRAPH' 
  | 'TECHNICAL_ILLUSTRATION' 
  | 'SCHEMATIC_DIAGRAM' 
  | 'SYSTEM_ARCHITECTURE' 
  | 'EQUIPMENT_VIEW' 
  | 'INDUSTRIAL_ENVIRONMENT' 
  | 'AI_GENERATED' 
  | 'INTERACTIVE_VISUALIZATION';

export type VisualStatus = 'PLANNED' | 'SOURCED' | 'INTEGRATED' | 'REVIEWED';

export interface VisualInventoryItem {
  id: string;
  page: string;
  section: string;
  visualTitle: string;
  type: VisualType;
  purpose: string;
  source: string;
  standardsRef?: string;
  status: VisualStatus;
  aspectRatio: '16:9' | '4:3' | '3:2' | '1:1' | '21:9';
  notes?: string;
}

export const EPEDE_VISUAL_INVENTORY: VisualInventoryItem[] = [
  // --- HOMEPAGE ---
  {
    id: 'vis-home-hero-powerchain',
    page: 'Home',
    section: 'CommandHeader / Hero',
    visualTitle: 'Complete Electrical Power System Architecture Panorama',
    type: 'SYSTEM_ARCHITECTURE',
    purpose: 'Provide immediate visual context for the end-to-end power ecosystem from generation to user loads',
    source: 'EPEDE CAD / Curated High-Voltage Panorama',
    standardsRef: 'IEC 60038 / IEC 60076',
    status: 'INTEGRATED',
    aspectRatio: '21:9',
    notes: 'Interactive chain node highlights: 15 kV Gen → 225 kV GSU → 225 kV Lines → 90 kV Substation → 30 kV RMU → 400 V TGBT'
  },
  {
    id: 'vis-home-scene01-awakening',
    page: 'Home',
    section: 'Scene 01: System Awakening',
    visualTitle: 'High-Voltage 225 kV Substation Switchyard at Twilight',
    type: 'PHOTOGRAPH',
    purpose: 'Establish realistic physical atmosphere of bulk power transmission nodes',
    source: 'Authoritative Industrial Transmission Photography',
    standardsRef: 'IEC 61936-1 / IEEE 80',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene02-hierarchy',
    page: 'Home',
    section: 'Scene 02: 6-Level Hierarchy',
    visualTitle: 'Interactive 6-Level Engineering Hierarchy Diagram',
    type: 'TECHNICAL_ILLUSTRATION',
    purpose: 'Visually explain the EPEDE architectural model: Energy → System → Equipment → Engineering → Digital → Knowledge',
    source: 'EPEDE Vector Engineering Engine',
    standardsRef: 'EPEDE Architecture v1.1',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene03-hydro',
    page: 'Home',
    section: 'Scene 03: Generation',
    visualTitle: 'Nachtigal Hydroelectric Francis Turbine Runner',
    type: 'PHOTOGRAPH',
    purpose: 'Show precision stainless-steel runner coupled to 15 kV salient-pole synchronous generator',
    source: 'Industrial Powerhouse Documentation',
    standardsRef: 'IEC 60193 / IEC 60034',
    status: 'INTEGRATED',
    aspectRatio: '4:3'
  },
  {
    id: 'vis-home-scene04-transformer',
    page: 'Home',
    section: 'Scene 04: Voltage Transformation',
    visualTitle: 'EHV 225 kV Step-Up (GSU) Power Transformer',
    type: 'PHOTOGRAPH',
    purpose: 'Illustrate oil-immersed core-and-coil assembly with RIP bushings and ONAF cooling',
    source: 'Substation Manufacturer Technical Archive',
    standardsRef: 'IEC 60076 / IEEE C57.12',
    status: 'INTEGRATED',
    aspectRatio: '4:3'
  },
  {
    id: 'vis-home-scene05-transmission',
    page: 'Home',
    section: 'Scene 05: Transmission',
    visualTitle: '225 kV Overhead Lattice Steel Tower Corridor',
    type: 'PHOTOGRAPH',
    purpose: 'Display duplex bundle conductor spacing and toughened glass suspension insulator strings',
    source: 'Grid Operator Field Transmission Photography',
    standardsRef: 'IEC 60826 / IEEE 738',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene06-breaker',
    page: 'Home',
    section: 'Scene 06: Substations',
    visualTitle: 'Interactive SF6 Puffer Circuit Breaker Bay Simulation',
    type: 'INTERACTIVE_VISUALIZATION',
    purpose: 'Allow engineers to open/close breaker and observe arc quenching & current interruption in real-time',
    source: 'EPEDE Physics Engine',
    standardsRef: 'IEC 62271-100',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene07-rmu',
    page: 'Home',
    section: 'Scene 07: Distribution',
    visualTitle: '30 kV Ring Main Unit (RMU) Modular Switchgear',
    type: 'EQUIPMENT_VIEW',
    purpose: 'Show compact medium-voltage feeder bays with vacuum/SF6 switches for open-loop urban networks',
    source: 'Distribution Switchgear Archive',
    standardsRef: 'IEC 62271-200',
    status: 'INTEGRATED',
    aspectRatio: '4:3'
  },
  {
    id: 'vis-home-scene08-earthing',
    page: 'Home',
    section: 'Scene 08: From Grid to Life',
    visualTitle: 'Technical Schematic of Low-Voltage Earthing Systems (TT, TN-S, TN-C, IT)',
    type: 'SCHEMATIC_DIAGRAM',
    purpose: 'Visually explain neutral point connection, PE conductor routing, fault current loops, and RCD protection',
    source: 'EPEDE Electrical Safety Schematics',
    standardsRef: 'IEC 60364-4-41 / NF C 15-100',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene09-mcc',
    page: 'Home',
    section: 'Scene 09: Industry & Automation',
    visualTitle: 'Low Voltage Main Switchboard (TGBT) & Withdrawable Motor Control Center (MCC)',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Show industrial busbar distribution, form separation, and motor feeder draw-out buckets',
    source: 'Industrial Automation Facility',
    standardsRef: 'IEC 61439-1/-2',
    status: 'INTEGRATED',
    aspectRatio: '4:3'
  },
  {
    id: 'vis-home-scene10-scada',
    page: 'Home',
    section: 'Scene 10: SCADA & Smart Grid',
    visualTitle: 'National Power Dispatching Center & IEC 61850 Station Bus',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Establish real-world control room context with multi-screen state estimation and AGC controls',
    source: 'Grid Operations Center Archive',
    standardsRef: 'IEC 60870-5-104 / IEC 61850',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-home-scene11-bess',
    page: 'Home',
    section: 'Scene 11: Storage, Renewables & EV',
    visualTitle: 'Containerized Utility-Scale Battery Energy Storage System (BESS)',
    type: 'PHOTOGRAPH',
    purpose: 'Show modular LFP battery racks, liquid cooling units, and grid-forming 4-quadrant inverters',
    source: 'Renewable Storage Technical Library',
    standardsRef: 'IEC 62933 / NFPA 855',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },

  // --- INDUSTRIAL PROJECTS SHOWCASE ---
  {
    id: 'vis-proj-douala-gensets',
    page: 'Home / Projects',
    section: 'Industrial Projects: Douala Bassa',
    visualTitle: '2.0 MW Synchronised Diesel Generating Sets Plant',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Show heavy industrial synchronized generation, ATS synchronization panel, and soundproof enclosures',
    source: 'Field Industrial Engineering Documentation',
    standardsRef: 'ISO 8528 / IEC 60034',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-proj-mining-substation',
    page: 'Home / Projects',
    section: 'Industrial Projects: Northern Mining Substation',
    visualTitle: '33 kV / 11 kV 5 MVA Open-Pit Mining Primary Substation',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Show outdoor mineral extraction step-down substation with neutral earthing resistor and 87T protection',
    source: 'Mining Electrical Operations Archive',
    standardsRef: 'IEC 61936-1 / IEEE C37.91',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-proj-water-scada',
    page: 'Home / Projects',
    section: 'Industrial Projects: Yaoundé Water Pumping',
    visualTitle: 'Municipal Raw Water Pumping Station SCADA & VFD Inverter Room',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Show Siemens S7-1500 redundant PLC cubicles and 690 V variable speed drive panels',
    source: 'Municipal Water Utility Engineering Archive',
    standardsRef: 'IEC 61131 / IEC 61800',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-proj-hospital-ups',
    page: 'Home / Projects',
    section: 'Industrial Projects: Regional Hospital UPS',
    visualTitle: '800 kVA Modular Static UPS and Sealed Lead-Acid / Lithium Battery Room',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Show medical IT zero-break critical power infrastructure and insulation monitoring CPI',
    source: 'Healthcare Critical Power Engineering',
    standardsRef: 'IEC 62040 / IEC 60364-7-710',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-trans-ohl-vs-ugc-anatomy',
    page: 'Transmission',
    section: 'Pillar 5: Overhead vs Underground Benchmark',
    visualTitle: '225 kV OHL Steel Lattice Corridor vs 225 kV XLPE Trefoil Trench',
    type: 'EQUIPMENT_VIEW',
    purpose: 'Direct side-by-side engineering comparison of right-of-way, thermal dissipation, and charging capacitance',
    source: 'High-Voltage Engineering Operations Archive',
    standardsRef: 'IEC 60826 / IEC 60287 / CIGRÉ TB 680',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-subs-ais-vs-gis-anatomy',
    page: 'Substations',
    section: 'Matrix: AIS vs GIS vs Hybrid MTS',
    visualTitle: '225 kV AIS Air-Insulated Switchyard vs SF6 Metal-Enclosed GIS Indoor Bay',
    type: 'INDUSTRIAL_ENVIRONMENT',
    purpose: 'Illustrate real physical scale, weather exposure, and dielectric phase clearance reduction (meters vs centimeters)',
    source: 'Grid Substation Operations Archive',
    standardsRef: 'IEC 61936-1 / IEC 62271-203',
    status: 'INTEGRATED',
    aspectRatio: '16:9'
  },
  {
    id: 'vis-dist-mv-cable-cross-section',
    page: 'Distribution',
    section: 'Anatomy: Conductor & Pole Cross-Section',
    visualTitle: 'MV 30 kV XLPE Radial Layer Cutaway Diagram & Concrete Pole Assembly',
    type: 'INTERACTIVE_VISUALIZATION',
    purpose: 'Interactive 6-layer concentric dielectric breakdown and real industrial cable extrusion context',
    source: 'EPEDE Vector Engineering Engine / Industrial Cable Archive',
    standardsRef: 'IEC 60502-2 / NF C 33-226 / NF C 11-201',
    status: 'INTEGRATED',
    aspectRatio: '4:3'
  }
];

export function getVisualInventoryStats() {
  const total = EPEDE_VISUAL_INVENTORY.length;
  const integrated = EPEDE_VISUAL_INVENTORY.filter(v => v.status === 'INTEGRATED').length;
  const reviewed = EPEDE_VISUAL_INVENTORY.filter(v => v.status === 'REVIEWED').length;
  return { total, integrated, reviewed };
}
