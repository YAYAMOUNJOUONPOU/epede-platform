// src/components/epede/types.ts
import type { DomainCode } from '../../types/epede';

export type PowerNodeId =
  | 'generation'
  | 'transformation'
  | 'transmission'
  | 'substation'
  | 'distribution'
  | 'intelligent_grid';

export interface PowerNode {
  id: PowerNodeId;
  label: string;
  labelFr: string;
  shortLabel: string;
  category: string;
  categoryFr: string;
  voltage: string;
  description: string;
  descriptionFr: string;
  position: { x: number; y: number }; // Percentage 0 - 100
  accent: string;
  domainCode?: DomainCode;
  navTarget?: 'domains' | 'equipment' | 'diagrams' | 'journey' | 'simulation';
}

export const POWER_NODES: PowerNode[] = [
  {
    id: 'generation',
    label: 'Generation Facilities',
    labelFr: 'Installations de Production',
    shortLabel: 'GEN',
    category: 'Energy Conversion',
    categoryFr: 'Conversion d\'Énergie',
    voltage: '11 kV – 24 kV',
    description: 'Hydroelectric alternators, photovoltaic arrays, and thermal turbines converting primary energy into 3-phase alternating current.',
    descriptionFr: 'Alternateurs hydroélectriques, centrales photovoltaïques et turbines thermiques convertissant l\'énergie primaire en courant alternatif triphasé.',
    position: { x: 12, y: 50 },
    accent: '#D7A64A', // Copper / Gold
    domainCode: 'D01',
    navTarget: 'journey',
  },
  {
    id: 'transformation',
    label: 'Step-Up Transformation',
    labelFr: 'Transformation Élévatrice',
    shortLabel: 'STEP-UP',
    category: 'Electromagnetic Induction',
    categoryFr: 'Induction Électromagnétique',
    voltage: '15 kV → 225 kV',
    description: 'Generation step-up (GSU) power transformers with Buchholz relays, on-load tap changers, and neutral earthing reactors.',
    descriptionFr: 'Transformateurs élévateurs de centrale (GSU) avec relais Buchholz, régleurs en charge et réactance de mise à la terre.',
    position: { x: 28, y: 32 },
    accent: '#567A87', // Steel Blue
    domainCode: 'D04',
    navTarget: 'equipment',
  },
  {
    id: 'transmission',
    label: 'Transmission Corridor',
    labelFr: 'Couloir de Transport THT',
    shortLabel: 'HV LINES',
    category: 'Bulk Energy Transport',
    categoryFr: 'Transport d\'Énergie en Vrac',
    voltage: '90 kV – 225 kV – 400 kV',
    description: 'High-voltage bundle conductors (Aster/Almelec) on steel lattice towers with composite insulators and OPGW ground wires.',
    descriptionFr: 'Conducteurs en faisceaux (Almelec) sur pylônes treillis avec isolateurs composites et câble de garde à fibre optique (OPGW).',
    position: { x: 48, y: 22 },
    accent: '#75A88C', // Operational Green
    domainCode: 'D03',
    navTarget: 'journey',
  },
  {
    id: 'substation',
    label: 'Transmission Substation',
    labelFr: 'Poste de Transformation & Manœuvre',
    shortLabel: 'SUBSTATION',
    category: 'Switchgear & Protection',
    categoryFr: 'Appareillage & Protection',
    voltage: '225 kV → 90 kV / 30 kV',
    description: 'Air-Insulated (AIS) and Gas-Insulated (GIS) switchyards featuring SF6 circuit breakers, disconnectors, and numerical protection relays (ANSI 87T, 21, 50/51).',
    descriptionFr: 'Postes ouverts (AIS) et blindés (GIS) avec disjoncteurs SF6, sectionneurs et relais de protection numériques (ANSI 87T, 21, 50/51).',
    position: { x: 68, y: 38 },
    accent: '#D7A64A', // Copper
    domainCode: 'D04',
    navTarget: 'diagrams',
  },
  {
    id: 'distribution',
    label: 'Medium Voltage Distribution',
    labelFr: 'Distribution Moyenne Tension',
    shortLabel: 'DISTRIB',
    category: 'Network Branching',
    categoryFr: 'Ramification Réseau',
    voltage: '30 kV / 15 kV → 400 V',
    description: 'Underground cables and overhead ring-main units feeding industrial plants, commercial districts, and pole-mounted transformers for residential supply.',
    descriptionFr: 'Câbles souterrains et boucles HTA alimentant les industries, les zones tertiaires et transformateurs HTA/BT pour les abonnés finaux.',
    position: { x: 86, y: 56 },
    accent: '#567A87', // Steel Blue
    domainCode: 'D05',
    navTarget: 'journey',
  },
  {
    id: 'intelligent_grid',
    label: 'Smart Grid & Storage (BESS)',
    labelFr: 'Réseau Intelligent & Stockage',
    shortLabel: 'SMART GRID',
    category: 'Digital Operations & Flexibility',
    categoryFr: 'Exploitation Numérique & Flexibilité',
    voltage: 'Bidirectional / 30 kV',
    description: 'Utility-scale battery energy storage systems (BESS), microgrid controllers, and IEC 61850 GOOSE telemetry balancing renewable intermittency.',
    descriptionFr: 'Systèmes de stockage par batteries (BESS), contrôleurs de microréseaux et télémesures CEI 61850 GOOSE équilibrant l\'intermittence renouvelable.',
    position: { x: 62, y: 78 },
    accent: '#D49A4A', // Safety Amber
    domainCode: 'D02',
    navTarget: 'simulation',
  },
];

export const POWER_CONNECTIONS: [PowerNodeId, PowerNodeId][] = [
  ['generation', 'transformation'],
  ['transformation', 'transmission'],
  ['transmission', 'substation'],
  ['substation', 'distribution'],
  ['substation', 'intelligent_grid'],
  ['intelligent_grid', 'distribution'],
  ['generation', 'intelligent_grid'],
];

export const NODE_BY_ID: Record<PowerNodeId, PowerNode> = POWER_NODES.reduce(
  (acc, node) => {
    acc[node.id] = node;
    return acc;
  },
  {} as Record<PowerNodeId, PowerNode>
);
