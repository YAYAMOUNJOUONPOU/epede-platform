// src/data/phase2Matrices.ts
// EPEDE Phase 2 - Global Matrices (Section 35)
// Formally validated baseline by EPEDE Supreme Engineering Council

export interface CompletenessMatrixRow {
  domainCode: string;
  domainName: string;
  subdomains: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  systems: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  technologies: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  equipment: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  components: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  functions: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  protection: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  control: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  instrumentation: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  communication: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  standards: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  safety: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  lifecycle: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  roles: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  applications: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  failure: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  maintenance: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  digital: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'REQUIRES VALIDATION';
  overallStatus: 'COMPLETE' | 'PARTIAL' | 'REQUIRES VALIDATION';
}

export interface RelationshipMatrixRow {
  id: string;
  sourceObject: string;
  relationship: string;
  targetObject: string;
  domain: string;
  provenance: string;
  verification: 'VERIFIED' | 'REFERENCE' | 'ESTIMATED' | 'SOURCE GAP';
}

export interface StandardsMatrixRow {
  id: string;
  standard: string;
  title: string;
  equipment: string;
  function: string;
  technology: string;
  phase: string;
  role: string;
  jurisdiction: string;
  status: 'VERIFIED' | 'REFERENCE' | 'MANDATORY' | 'RECOMMENDED';
}

export interface RoleMatrixRow {
  id: string;
  role: string;
  discipline: string;
  domain: string;
  system: string;
  equipment: string;
  task: string;
  deliverable: string;
  skill: string;
  tool: string;
  standard: string;
  phase: string;
}

export interface LifecycleMatrixRow {
  id: string;
  objectName: string;
  domain: string;
  feasibility: string;
  concept: string;
  basicEng: string;
  detailedEng: string;
  procurement: string;
  manufacturing: string;
  installation: string;
  testing: string;
  commissioning: string;
  operation: string;
  maintenance: string;
  refurbishment: string;
  decommissioning: string;
}

export interface FailureMaintenanceRow {
  id: string;
  equipment: string;
  domain: string;
  failureMode: string;
  cause: string;
  effect: string;
  detection: string;
  protection: string;
  diagnostic: string;
  maintenanceStrategy: 'PREVENTIVE' | 'PREDICTIVE' | 'CORRECTIVE' | 'CONDITION-BASED';
  spareParts: string;
}

// -------------------------------------------------------------------------------------------------
// MATRIX A: CONTENT COMPLETENESS MATRIX
// -------------------------------------------------------------------------------------------------
export const COMPLETENESS_MATRIX: CompletenessMatrixRow[] = [
  {
    domainCode: 'D01',
    domainName: 'Energy Resources & Generation',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D02',
    domainName: 'Power-System Architecture & Grid Planning',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D03',
    domainName: 'Transmission Networks',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D04',
    domainName: 'Substations & Grid Nodes',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D05',
    domainName: 'Distribution Networks',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D06',
    domainName: 'Electrical Installations & Utilization',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D07',
    domainName: 'Electrical Machines & Power Conversion',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D08',
    domainName: 'Industrial Electrical & Process Systems',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D09',
    domainName: 'Renewable Energy & DER',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D10',
    domainName: 'Energy Storage & Charging',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D11',
    domainName: 'Protection, Measurements & System Studies',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D12',
    domainName: 'Automation, Instrumentation & Control',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D13',
    domainName: 'Communications & Operational Technology',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D14',
    domainName: 'Power Quality & EMC',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D15',
    domainName: 'Metering, Smart Grids & Grid Digitalization',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  },
  {
    domainCode: 'D16',
    domainName: 'Electrical Safety, Earthing & Lightning',
    subdomains: 'COMPLETE',
    systems: 'COMPLETE',
    technologies: 'COMPLETE',
    equipment: 'COMPLETE',
    components: 'COMPLETE',
    functions: 'COMPLETE',
    protection: 'COMPLETE',
    control: 'COMPLETE',
    instrumentation: 'COMPLETE',
    communication: 'COMPLETE',
    standards: 'COMPLETE',
    safety: 'COMPLETE',
    lifecycle: 'COMPLETE',
    roles: 'COMPLETE',
    applications: 'COMPLETE',
    failure: 'COMPLETE',
    maintenance: 'COMPLETE',
    digital: 'COMPLETE',
    overallStatus: 'COMPLETE'
  }
];

// -------------------------------------------------------------------------------------------------
// MATRIX B: RELATIONSHIP MATRIX
// -------------------------------------------------------------------------------------------------
export const RELATIONSHIP_MATRIX: RelationshipMatrixRow[] = [
  {
    id: 'REL-001',
    sourceObject: 'D01.01 (Hydro Generation)',
    relationship: 'feeds_power_to',
    targetObject: 'D04.01 (Transmission Substations)',
    domain: 'D01 ↔ D04',
    provenance: 'Nachtigal 225 kV switchyard single line diagram',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-002',
    sourceObject: 'D01.01 (Hydro Turbine)',
    relationship: 'regulated_by',
    targetObject: 'D12.01 (Digital Governor PID)',
    domain: 'D01 ↔ D12',
    provenance: 'IEC 61362 Turbine Governing Standard',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-003',
    sourceObject: 'EQ-GEN-01 (Alternateur Synchrone)',
    relationship: 'protected_by',
    targetObject: 'ANSI 87G (Generator Differential)',
    domain: 'D01 ↔ D11',
    provenance: 'IEEE C37.102 AC Generator Protection Guide',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-004',
    sourceObject: 'D03.01 (HV Overhead Lines)',
    relationship: 'subject_to',
    targetObject: 'PHYS-FERRANTI (No-Load Capacitive Rise)',
    domain: 'D03 ↔ D14',
    provenance: 'CIGRE WG B2 / IEEE 738',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-005',
    sourceObject: 'D04.02 (Substation Ground Mat)',
    relationship: 'governed_by',
    targetObject: 'IEEE Std 80 (Substation Grounding)',
    domain: 'D04 ↔ D16',
    provenance: 'IEEE Std 80-2013 calculation guide',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-006',
    sourceObject: 'D11.02 (Protection IEDs)',
    relationship: 'communicates_via',
    targetObject: 'IEC 61850-8-1 (GOOSE / MMS)',
    domain: 'D11 ↔ D13',
    provenance: 'IEC 61850 standard profile',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-007',
    sourceObject: 'D07.01 (Induction Motor)',
    relationship: 'causes',
    targetObject: 'PHYS-VDROP (Direct-on-line Voltage Dip)',
    domain: 'D07 ↔ D14',
    provenance: 'IEC 60034-12 starting characteristics',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-008',
    sourceObject: 'D09.01 (Solar PV Inverter)',
    relationship: 'requires',
    targetObject: 'D02.04 (Grid Code LVRT Compliance)',
    domain: 'D09 ↔ D02',
    provenance: 'EN 50549 / Cameroon ARSEL Grid Code',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-009',
    sourceObject: 'D10.01 (BESS Battery Storage)',
    relationship: 'provides',
    targetObject: 'FUNC-FCR (Fast Frequency Containment Reserve)',
    domain: 'D10 ↔ D02',
    provenance: 'ENTSO-E NC RfG requirements',
    verification: 'VERIFIED'
  },
  {
    id: 'REL-010',
    sourceObject: 'D15.01 (Smart Grid AMI)',
    relationship: 'telemeters_via',
    targetObject: 'DLMS/COSEM Protocol (IEC 62056)',
    domain: 'D15 ↔ D13',
    provenance: 'DLMS User Association blue/green books',
    verification: 'VERIFIED'
  }
];

// -------------------------------------------------------------------------------------------------
// MATRIX C: STANDARDS APPLICABILITY MATRIX
// -------------------------------------------------------------------------------------------------
export const STANDARDS_MATRIX: StandardsMatrixRow[] = [
  {
    id: 'STD-001',
    standard: 'IEC 60034-1',
    title: 'Rotating electrical machines - Rating and performance',
    equipment: 'Hydro & Thermal Alternators, Industrial Induction Motors',
    function: 'Thermal class rating (Class F/B), duty cycles, efficiency',
    technology: 'Synchronous & Asynchronous machines',
    phase: 'Manufacturing (FAT), Commissioning (SAT)',
    role: 'Electrical Machines Engineer',
    jurisdiction: 'International / CENELEC / Cameroon',
    status: 'MANDATORY'
  },
  {
    id: 'STD-002',
    standard: 'IEC 60076-1',
    title: 'Power transformers - General specifications and temperature rise',
    equipment: 'GSU Step-up, Substation Autotransformers, MV/LV Distribution',
    function: 'Impedance voltage Uk%, no-load and load loss verification',
    technology: 'Oil-immersed (ONAN/ONAF/OFAF) & Dry-type',
    phase: 'Design, FAT, Operation',
    role: 'Transformer Design & Substation Engineer',
    jurisdiction: 'International / IEC',
    status: 'MANDATORY'
  },
  {
    id: 'STD-003',
    standard: 'IEC 60909-0',
    title: 'Short-circuit currents in three-phase a.c. systems - Calculation of currents',
    equipment: 'All grid nodes, busbars, switchgear, breakers',
    function: 'Symmetrical initial short-circuit current Ik", peak current ip, breaking current Ib',
    technology: 'All AC voltage levels (400V to 225kV)',
    phase: 'Basic Engineering, Detailed Engineering',
    role: 'Power System Study Engineer',
    jurisdiction: 'International',
    status: 'MANDATORY'
  },
  {
    id: 'STD-004',
    standard: 'IEEE Std 80',
    title: 'IEEE Guide for Safety in AC Substation Grounding',
    equipment: 'Substation ground mat, grounding rods, crushed rock surfacing',
    function: 'Tolerable touch voltage Etouch, step voltage Estep, grid resistance Rg',
    technology: 'High-voltage air-insulated (AIS) & gas-insulated (GIS) substations',
    phase: 'Basic Engineering, Detailed Engineering, SAT',
    role: 'Earthing & Lightning Protection Engineer',
    jurisdiction: 'IEEE / Global Engineering Standard',
    status: 'MANDATORY'
  },
  {
    id: 'STD-005',
    standard: 'IEC 61850 Series',
    title: 'Communication networks and systems for power utility automation',
    equipment: 'Protection IEDs, Merging Units, Bay Controllers, Substation Gateways',
    function: 'GOOSE fast interlocking (<4ms), SV sampled values, MMS SCADA reporting',
    technology: 'Substation Process Bus & Station Bus over optical Ethernet (PRP/HSR)',
    phase: 'Detailed Engineering, FAT, SAT, Commissioning',
    role: 'Substation Automation & Protection Engineer',
    jurisdiction: 'International / Global Standard',
    status: 'MANDATORY'
  },
  {
    id: 'STD-006',
    standard: 'NFPA 70E / IEEE 1584',
    title: 'Guide for Performing Arc-Flash Hazard Calculations',
    equipment: 'MV switchgear cubicles, LV MCC motor control centers',
    function: 'Incident energy (cal/cm²), arc-flash boundary distance, PPE category selection',
    technology: 'Industrial distribution boards',
    phase: 'Detailed Engineering, Safety Audit, O&M',
    role: 'Electrical Safety & Protection Engineer',
    jurisdiction: 'North America / Global Industrial Reference',
    status: 'MANDATORY'
  },
  {
    id: 'STD-007',
    standard: 'IEC 61000-4-30',
    title: 'Electromagnetic compatibility (EMC) - Power quality measurement methods',
    equipment: 'Class A power quality analyzers, grid revenue meters',
    function: 'Harmonics THDu, flicker Pst/Plt, voltage sags/swells, unbalance V2/V1',
    technology: 'Transmission & Distribution grid monitoring',
    phase: 'Commissioning, Operation',
    role: 'Power Quality Engineer',
    jurisdiction: 'International / IEC',
    status: 'MANDATORY'
  },
  {
    id: 'STD-008',
    standard: 'IEC 62443-3-3',
    title: 'Security for industrial automation and control systems - System security requirements',
    equipment: 'SCADA servers, RTUs, PLCs, industrial firewalls, protection relays',
    function: 'Security level SL 1-4, defense-in-depth zoning, RBAC, encrypted conduits',
    technology: 'OT Industrial Networks & Grid Control Centers',
    phase: 'Detailed Engineering, Commissioning, Cyber Audit',
    role: 'OT Cybersecurity Engineer',
    jurisdiction: 'International / ISA',
    status: 'MANDATORY'
  }
];

// -------------------------------------------------------------------------------------------------
// MATRIX D: ENGINEERING ROLE MATRIX
// -------------------------------------------------------------------------------------------------
export const ROLE_MATRIX: RoleMatrixRow[] = [
  {
    id: 'ROL-001',
    role: 'Power System Study Engineer',
    discipline: 'Electrical Power Engineering',
    domain: 'D02 (Grid Planning) & D11 (System Studies)',
    system: 'Bulk Transmission Network (225 kV / 90 kV)',
    equipment: 'Transmission lines, GSU transformers, shunt reactors, capacitors',
    task: 'Execute load flow, N-1 contingency, short-circuit and dynamic stability simulations',
    deliverable: 'Grid Connection Impact Study, System Planning Report',
    skill: 'PSS/E, DIgSILENT PowerFactory, ETAP, Python scripting, symmetric components',
    tool: 'PowerFactory, PSS/E, MATLAB',
    standard: 'IEC 60909, ENTSO-E Grid Codes, IEEE 399',
    phase: 'Feasibility, Concept, Basic Engineering'
  },
  {
    id: 'ROL-002',
    role: 'Protection & Control (P&C) Specialist',
    discipline: 'Protection Engineering & Automation',
    domain: 'D11 (Protection) & D12 (Automation)',
    system: 'Substation Protection Schemes & Generator Interties',
    equipment: 'Numerical relays (ANSI 21, 87T, 87L, 87G, 50/51, 67N), CTs, VTs',
    task: 'Calculate relay pickup thresholds, time multipliers, slope restraints, and trip matrices',
    deliverable: 'Protection Setting Philosophy Note, Relay Setting Sheets, CID/ICD files',
    skill: 'Relay coordination curves, directional grading, CT saturation sizing, IEC 61850 GOOSE',
    tool: 'AcSELerator, DIGSI 5, PCM600, Omicron Test Universe',
    standard: 'IEEE C37.102, IEEE C37.113, IEC 60255',
    phase: 'Detailed Engineering, FAT, SAT, Commissioning'
  },
  {
    id: 'ROL-003',
    role: 'High-Voltage Substation Lead Engineer',
    discipline: 'Substation Engineering',
    domain: 'D04 (Substations & Grid Nodes)',
    system: 'AIS & GIS Substations (90 kV to 225 kV)',
    equipment: 'Circuit breakers, disconnectors, instrument transformers, surge arresters, busbars',
    task: 'Prepare substation layout, electrical clearances, equipment sizing, cable routing',
    deliverable: 'Substation SLD, General Arrangement Drawing, Equipment Specifications',
    skill: 'High-voltage insulation coordination, busbar ampacity, cantilever load mechanical design',
    tool: 'AutoCAD Electrical, Bentley Substation, CymCAP',
    standard: 'IEC 61936-1, IEC 62271-100, IEC 60071',
    phase: 'FEED, Detailed Engineering, Construction'
  },
  {
    id: 'ROL-004',
    role: 'Earthing & Lightning Specialist',
    discipline: 'Safety & Electromagnetic Transient Engineering',
    domain: 'D16 (Electrical Safety, Earthing & Lightning)',
    system: 'Plant & Substation Grounding Infrastructure',
    equipment: 'Buried copper grid, deep earth boreholes, air terminals, down conductors',
    task: 'Analyze soil resistivity Wenner soundings, model grid resistance and touch/step safety',
    deliverable: 'Grounding Calculation Note, Lightning Risk Assessment Report (IEC 62305)',
    skill: 'Multilayer soil stratification, Ground Potential Rise (GPR), rolling sphere method',
    tool: 'CDEGS (SES), ETAP Ground Grid, EMTP-RV',
    standard: 'IEEE Std 80, IEC 62305-1 to 4, NFC 13-200',
    phase: 'Basic Engineering, Detailed Engineering, Field SAT'
  },
  {
    id: 'ROL-005',
    role: 'OT Network & Cybersecurity Architect',
    discipline: 'Operational Technology & Digital Engineering',
    domain: 'D13 (Communications) & D12 (Automation)',
    system: 'Substation LAN, Plant SCADA, Remote Teleprotection Channels',
    equipment: 'Industrial Ethernet switches (PRP/HSR), security gateways, RTUs, OPGW SDH/MPLS',
    task: 'Design IEC 62443 zone/conduit segmentation, configure zero-loss redundant rings, audit access',
    deliverable: 'OT Network Architecture Drawing, Cybersecurity Hardening Guide',
    skill: 'IEC 61850 packet analysis, VLAN tagging, firewall rule whitelisting, IEEE 1588 PTP',
    tool: 'Wireshark (IEC 61850 dissector), Hirschmann Industrial HiVision, Nessus OT',
    standard: 'IEC 62443, IEC 62351, IEC 62439-3 (PRP/HSR)',
    phase: 'Detailed Engineering, Commissioning, Operations'
  }
];

// -------------------------------------------------------------------------------------------------
// MATRIX E: LIFECYCLE MATRIX
// -------------------------------------------------------------------------------------------------
export const LIFECYCLE_MATRIX: LifecycleMatrixRow[] = [
  {
    id: 'LC-001',
    objectName: 'Hydro Turbine-Generator (Francis / Kaplan)',
    domain: 'D01.01',
    feasibility: 'Hydrological flow study, catchment yield',
    concept: 'Turbine type selection (Francis vs Pelton)',
    basicEng: 'Spiral casing sizing, powerhouse footprint',
    detailedEng: 'FEA stress analysis, stator winding details',
    procurement: 'Cast steel runner & forged shaft RFP',
    manufacturing: 'Runner dynamic balancing & NDT in shop',
    installation: 'Draft tube lining, stator core stacking',
    testing: 'Dielectric HV withstand, winding resistance',
    commissioning: 'Spin unexcited, first synchronization, 100% trip',
    operation: 'Baseload dispatch & spinning reserve',
    maintenance: 'Annual cavitation weld overlay, oil analysis',
    refurbishment: 'CFD runner profile replacement (+3% eff.)',
    decommissioning: 'Scraping, recycling copper & oil'
  },
  {
    id: 'LC-002',
    objectName: 'Generator Step-Up (GSU) Transformer',
    domain: 'D01.10 / D04.01',
    feasibility: 'Substation evacuation capacity check',
    concept: 'Three-phase vs single-phase bank choice',
    basicEng: 'Uk% impedance & BIL impulse levels',
    detailedEng: 'Loss evaluation formula & winding cooling',
    procurement: 'Transformer vendor tender evaluation',
    manufacturing: 'Core assembly, vacuum drying & oil fill',
    installation: 'Skid onto foundation pad, bushing erection',
    testing: 'Turns ratio, winding insulation resistance, oil DGA',
    commissioning: 'Energization under no-load inrush check',
    operation: 'Continuous 225 kV bulk power evacuation',
    maintenance: 'Periodic oil breakdown voltage & Buchholz test',
    refurbishment: 'Gasket replacement, oil reconditioning',
    decommissioning: 'Drain mineral oil, core/copper salvage'
  },
  {
    id: 'LC-003',
    objectName: '225 kV Transmission Line Corridor',
    domain: 'D03.01',
    feasibility: 'Environmental & Right-of-Way (RoW) survey',
    concept: 'Single-circuit vs Double-circuit tower choice',
    basicEng: 'Conductor bundle selection (e.g., Aster 570)',
    detailedEng: 'Sag-tension curves, tower spotting, foundations',
    procurement: 'Lattice tower steel & ACSR/AAAC conductors',
    manufacturing: 'Galvanized steel fabrication & testing',
    installation: 'Tower erection, stringing under tension, OPGW',
    testing: 'Conductor continuity, phase rotation, line impedance',
    commissioning: 'Soak test under voltage (Ferranti check)',
    operation: 'Bulk power transmission across regional corridors',
    maintenance: 'Aerial helicopter line patrol, insulator washing',
    refurbishment: 'HTLS reconductoring for capacity increase',
    decommissioning: 'Tower dismantling, wire spooling & site restoration'
  },
  {
    id: 'LC-004',
    objectName: 'Substation Grounding Grid',
    domain: 'D16.01',
    feasibility: 'Soil resistivity preliminary soundings',
    concept: 'Perimeter ring vs fully mesh ground mat',
    basicEng: 'IEEE Std 80 calculation of Rg, Etouch, Estep',
    detailedEng: 'Trenching layout, riser details to equipment',
    procurement: 'Bare copper conductor (95-120 mm²) & cadweld',
    manufacturing: 'Chemical exothermic weld moulds',
    installation: 'Trench digging, conductor burial at 0.8m, cadwelding',
    testing: 'Fall-of-potential grounding resistance measurement',
    commissioning: 'Continuity check from all equipment risers',
    operation: 'Personnel safety and lightning fault dissipation',
    maintenance: '5-year visual riser inspection & soil resistance test',
    refurbishment: 'Supplemental deep borehole ground rods',
    decommissioning: 'Abandoned in place (copper inert in soil)'
  }
];

// -------------------------------------------------------------------------------------------------
// MATRIX F: FAILURE & MAINTENANCE MATRIX
// -------------------------------------------------------------------------------------------------
export const FAILURE_MAINTENANCE_MATRIX: FailureMaintenanceRow[] = [
  {
    id: 'FMM-001',
    equipment: 'Hydro Generator Stator Winding',
    domain: 'D01.01',
    failureMode: 'Phase-to-Ground Dielectric Breakdown',
    cause: 'Thermal aging, slot bar vibration, partial discharge (PD)',
    effect: 'Severe short circuit, core lamination melting, fire',
    detection: 'Online PD couplers (IEC 60034-27), RTD slot temp',
    protection: 'ANSI 87G (Differential), ANSI 59N (Neutral zero-sequence)',
    diagnostic: 'Polarization Index (PI), Tan Delta, offline PD test',
    maintenanceStrategy: 'CONDITION-BASED',
    spareParts: 'Spare Roebel stator coils, semi-conductive packing wedges'
  },
  {
    id: 'FMM-002',
    equipment: 'GSU Power Transformer',
    domain: 'D04.01',
    failureMode: 'Winding Inter-Turn Short Circuit',
    cause: 'Mechanical through-fault forces, paper insulation moisture',
    effect: 'Local hotspot, oil gas generation, severe tank pressure',
    detection: 'Online Dissolved Gas Analysis (DGA - acetylene C2H2)',
    protection: 'ANSI 87T (Differential), Buchholz Relay (ANSI 63), Rapid Pressure',
    diagnostic: 'Frequency Response Analysis (SFRA), winding resistance',
    maintenanceStrategy: 'PREDICTIVE',
    spareParts: 'Spare 225 kV condenser bushings, silica gel, gas relays'
  },
  {
    id: 'FMM-003',
    equipment: '225 kV SF6 Circuit Breaker',
    domain: 'D04.01',
    failureMode: 'SF6 Gas Pressure Drop / Leakage',
    cause: 'EPDM seal degradation, flange corrosion, temperature swings',
    effect: 'Loss of dielectric insulation and current interruption capacity',
    detection: 'Temperature-compensated SF6 density monitor (2-stage contact)',
    protection: 'Alarm at stage 1 (5.2 bar), Trip lockout at stage 2 (5.0 bar)',
    diagnostic: 'Laser SF6 gas camera imaging, pressure logging',
    maintenanceStrategy: 'PREVENTIVE',
    spareParts: 'SF6 gas cylinders, top-up valves, replacement O-rings'
  },
  {
    id: 'FMM-004',
    equipment: 'HV Transmission Line Insulator String',
    domain: 'D03.01',
    failureMode: 'Pollution Flashover / Puncture',
    cause: 'Heavy dust/salt deposition + morning dew moisture',
    effect: 'Single line-to-ground fault, feeder breaker trip',
    detection: 'Ultrasonic corona discharge detector, line fault locator',
    protection: 'ANSI 21 (Distance Zone 1 trip <20ms), ANSI 67N',
    diagnostic: 'Infrared thermography, drone optical inspection',
    maintenanceStrategy: 'CONDITION-BASED',
    spareParts: 'Glass / composite insulator strings, corona rings'
  },
  {
    id: 'FMM-005',
    equipment: 'Industrial MV Induction Motor (6.6 kV)',
    domain: 'D07.01 / D08.01',
    failureMode: 'Rotor Broken Bar / End Ring Crack',
    cause: 'Repeated high-inertia heavy starts, thermal fatigue',
    effect: 'Torque pulsations, excessive vibration, stator rub',
    detection: 'Motor Current Signature Analysis (MCSA sideband peaks)',
    protection: 'ANSI 49 (Thermal replica), ANSI 46 (Current unbalance)',
    diagnostic: 'Vibration FFT spectrum at pole pass frequency (2sf_L)',
    maintenanceStrategy: 'PREDICTIVE',
    spareParts: 'Complete replacement cage rotor, bearing sleeves'
  },
  {
    id: 'FMM-006',
    equipment: 'Station Battery Bank (110 V DC)',
    domain: 'D01.10 / D04.01',
    failureMode: 'Loss of DC Tripping Supply',
    cause: 'Cell internal open-circuit, sulfation, charger rectifier failure',
    effect: 'Total inability to trip switchgear circuit breakers during grid fault',
    detection: 'Continuous DC bus undervoltage / earth fault relay (ANSI 27DC/64DC)',
    protection: 'Backup battery string automatic tie contactor transfer',
    diagnostic: 'Internal cell impedance / conductance test, discharge capacity test',
    maintenanceStrategy: 'PREVENTIVE',
    spareParts: 'Individual 2V VRLA/NiCd replacement cells, float charger boards'
  }
];
