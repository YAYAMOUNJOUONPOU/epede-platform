// src/data/equipment/canonicalEquipmentRegistry.ts
// EPEDE - Unified Master Registry for all Canonical Equipment Objects

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';
import { BACKBONE_EQUIPMENT_ITEMS } from './canonicalEquipmentSlice';
import { TRANSMISSION_SUBSTATION_ITEMS } from './sliceTransmissionAndSubstation';
import { DISTRIBUTION_INSTALLATION_ITEMS } from './sliceDistributionAndInstallation';
import { TERMINAL_AND_LOADS_ITEMS } from './sliceTerminalAndLoads';
import { ANCILLARY_AND_GRID_ITEMS } from './sliceAncillaryAndGrid';
import { ADVANCED_DOMAINS_ITEMS } from './sliceAdvancedDomains';

export const ALL_CANONICAL_EQUIPMENT: CanonicalEquipmentObject[] = [
  ...BACKBONE_EQUIPMENT_ITEMS,
  ...TRANSMISSION_SUBSTATION_ITEMS,
  ...DISTRIBUTION_INSTALLATION_ITEMS,
  ...TERMINAL_AND_LOADS_ITEMS,
  ...ANCILLARY_AND_GRID_ITEMS,
  ...(ADVANCED_DOMAINS_ITEMS as CanonicalEquipmentObject[])
];

// Mapping between legacy epedeData IDs, substation apparatus codes, and canonical 37-dimension objects
export const LEGACY_ID_MAP: Record<string, string> = {
  // Advanced Cross-Domain Equipment
  'node-bess-10mwh': 'eq-exp-bess-container-5mw',
  'eq-bess-10mwh': 'eq-exp-bess-container-5mw',
  'node-statcom-50mvar': 'eq-exp-statcom-mmc-50mvar',
  'eq-statcom-50mvar': 'eq-exp-statcom-mmc-50mvar',
  'node-ai-duval': 'eq-exp-dga-online-monitor',
  'eq-ai-duval': 'eq-exp-dga-online-monitor',
  'node-sw-iec61850': 'eq-exp-switch-iec62443',
  'eq-sw-iec61850': 'eq-exp-switch-iec62443',
  'node-ami-meter': 'eq-exp-ami-smartmeter-3p',
  'eq-ami-meter': 'eq-exp-ami-smartmeter-3p',
  'eq-ev-hpc-350kw': 'eq-exp-ev-hpc-350kw',

  // Legacy Core Equipment
  'eq-hydro-songloulou-01': 'eq-exp-hydro-gen-01',
  'eq-trafo-hta-01': 'eq-exp-gsu-trafo-01',
  'eq-tower-225kv': 'eq-exp-tower-225kv',
  'eq-gis-bay-225kv': 'eq-exp-gis-bay-225k',
  'eq-cell-mv-30k-01': 'eq-exp-cell-mv-30k',
  'eq-kiosk-30kv-400v': 'eq-exp-kiosk-30kv-400v',
  'eq-tgbt-main-400v': 'eq-exp-tgbt-main-400v',
  'eq-cb-sf6-01': 'eq-exp-gis-bay-225k',
  'eq-ct-225k': 'eq-exp-ct-225k',
  'eq-ied-relay-61850': 'eq-exp-relay-ied-61850',
  'eq-relay-87t-01': 'eq-exp-relay-ied-61850',
  'eq-motor-250': 'eq-exp-motor-ind-250kw',
  'node-motor-250': 'eq-exp-motor-ind-250kw',
  'node-gen-g1': 'eq-exp-hydro-gen-01',
  'node-line-225-bekoko': 'eq-exp-tower-225kv',
  'node-feeder-30-ind': 'eq-exp-cell-mv-30k',
  'node-tgbt-400': 'eq-exp-tgbt-main-400v',
  'node-trafo-main-30': 'eq-exp-sub-trafo-225-30',
  'node-trafo-gsu': 'eq-exp-gsu-trafo-01',
  'node-bay-song-225': 'eq-exp-gis-bay-225k',
  'node-trafo-client-bt': 'eq-exp-kiosk-30kv-400v',
  'node-substation-225': 'eq-exp-sub-trafo-225-30',

  // Substation Apparatus Codes (SubstationBayArchitectureExplorer & Journey)
  'q0': 'eq-exp-gis-bay-225k',
  'q0-line': 'eq-exp-gis-bay-225k',
  'q0-tr': 'eq-exp-gis-bay-225k',
  'q0-cpl': 'eq-exp-gis-bay-225k',
  'cb-225': 'eq-exp-gis-bay-225k',
  'disjoncteur': 'eq-exp-gis-bay-225k',
  'disjoncteur sf6 tripolaire à autosoufflage q0': 'eq-exp-gis-bay-225k',
  'disjoncteur secondaire transformateur 90 kv': 'eq-exp-gis-bay-225k',

  // Disconnectors & Earthing Switches
  'q9': 'eq-exp-disconnector-225k',
  'q8': 'eq-exp-disconnector-225k',
  'q1': 'eq-exp-disconnector-225k',
  'q2': 'eq-exp-disconnector-225k',
  'eq-disconnector-225k': 'eq-exp-disconnector-225k',
  'q9-line': 'eq-exp-disconnector-225k',
  'q9-tr': 'eq-exp-disconnector-225k',
  'q1-bus1': 'eq-exp-disconnector-225k',
  'q2-bus2': 'eq-exp-disconnector-225k',
  'q1/q2-bus': 'eq-exp-disconnector-225k',
  'q1/q2-tr': 'eq-exp-disconnector-225k',
  'q1-cpl': 'eq-exp-disconnector-225k',
  'q2-cpl': 'eq-exp-disconnector-225k',
  'ds-225': 'eq-exp-disconnector-225k',
  'q8-line': 'eq-exp-disconnector-225k',
  'es-225': 'eq-exp-disconnector-225k',
  'sectionneur': 'eq-exp-disconnector-225k',
  'sectionneur de ligne q9 à coupure centrale': 'eq-exp-disconnector-225k',
  'sectionneur de terre rapide q8': 'eq-exp-disconnector-225k',
  'sectionneurs d\'aiguillage q1 et q2': 'eq-exp-disconnector-225k',
  'sectionneurs de mise à la terre des barres': 'eq-exp-disconnector-225k',

  // Surge Arresters (ZnO)
  'f1': 'eq-exp-surge-arrester-225k',
  'eq-surge-arrester-225k': 'eq-exp-surge-arrester-225k',
  'f1-sa': 'eq-exp-surge-arrester-225k',
  'f1-sa-tr': 'eq-exp-surge-arrester-225k',
  'sa-225': 'eq-exp-surge-arrester-225k',
  'parafoudre': 'eq-exp-surge-arrester-225k',
  'parafoudre zno sans éclateur classe 4': 'eq-exp-surge-arrester-225k',
  'compteur de décharges de foudre': 'eq-exp-surge-arrester-225k',
  'milliammètre de fuite continu': 'eq-exp-surge-arrester-225k',
  'liaison terre isolée': 'eq-exp-surge-arrester-225k',

  // Instrument Transformers (CT & VT / CVT)
  't1': 'eq-exp-ct-225k',
  't2': 'eq-exp-ct-225k',
  't1-ct': 'eq-exp-ct-225k',
  't1-ct-tr': 'eq-exp-ct-225k',
  't1-ct-cpl': 'eq-exp-ct-225k',
  'ct-225': 'eq-exp-ct-225k',
  't1-cvt': 'eq-exp-ct-225k',
  'vt-225': 'eq-exp-ct-225k',
  'transformateur de tension capacitif (cvt)': 'eq-exp-ct-225k',
  'transformateur de courant type tête (top-core ct)': 'eq-exp-ct-225k',
  'transformateurs de mesure 90 kv': 'eq-exp-ct-225k',
  'circuit de détection ferro-résonance': 'eq-exp-ct-225k',
  'boîte de jonction secondaire': 'eq-exp-ct-225k',

  // Power Transformers & Autotransformers
  'eq-autotrafo-225-90': 'eq-exp-sub-trafo-225-30',
  'tr-225': 'eq-exp-sub-trafo-225-30',
  'transfo_puissance': 'eq-exp-sub-trafo-225-30',
  'transformateur triphasé 225/90/15 kv ynyd11': 'eq-exp-sub-trafo-225-30',
  'régleur en charge à vide (oltc) 17 plots': 'eq-exp-sub-trafo-225-30',
  'conservateur d\'huile avec dessiccateur au silicagel': 'eq-exp-sub-trafo-225-30',
  'aéroréfrigérants onaf (ventilateurs & pompes)': 'eq-exp-sub-trafo-225-30',

  // Gantries & Overhead lines
  'gantry': 'eq-exp-tower-225kv',
  'portique': 'eq-exp-tower-225kv',
  'portique treillis d\'amarrage': 'eq-exp-tower-225kv',
  'chaînes d\'isolateurs en verre cap-and-pin': 'eq-exp-tower-225kv',
  'anneaux pare-effluves corona': 'eq-exp-tower-225kv',
  'boîte d\'épissure opgw': 'eq-exp-tower-225kv',
  'départs lignes 90 kv vers villes secondaires': 'eq-exp-tower-225kv',

  // Busbars
  'bb-225': 'eq-exp-gis-bay-225k',
  'busbar': 'eq-exp-gis-bay-225k',
  'jeu_de_barres': 'eq-exp-gis-bay-225k',
  'tubes d\'aluminium 120 mm suspendus': 'eq-exp-gis-bay-225k',
  'jeu de barres 90 kv aluminium': 'eq-exp-gis-bay-225k',
  'travée de couplage (q0-cpl, tc-cpl)': 'eq-exp-gis-bay-225k',

  // Resistors & Distribution Reclosers
  'eq-ner-30k': 'eq-exp-cell-mv-30k',
  'sectionneur de mise au neutre avec résistance rmn': 'eq-exp-cell-mv-30k',
  'eq-recloser-30k': 'eq-exp-cell-mv-30k',
  'recloser': 'eq-exp-cell-mv-30k',
  'disjoncteur réenclencheur à coupure sous vide': 'eq-exp-cell-mv-30k',
  'disjoncteurs départs avec réenclenchement rapide': 'eq-exp-cell-mv-30k',
  'câbles souterrains xlpe 90 kv': 'eq-exp-cell-mv-30k',
  'départs cellules mt 15 kv urbaines': 'eq-exp-cell-mv-30k'
};

// Helper methods for quick lookup
export function getEquipmentById(id: string): CanonicalEquipmentObject | undefined {
  return ALL_CANONICAL_EQUIPMENT.find(item => item.id === id);
}

export function resolveCanonicalEquipment(idOrTag: string): CanonicalEquipmentObject | undefined {
  if (!idOrTag) return undefined;

  // 1. Direct ID match
  const direct = ALL_CANONICAL_EQUIPMENT.find(item => item.id === idOrTag);
  if (direct) return direct;

  // 2. Legacy / Apparatus code mapped ID match (case-insensitive)
  const normalizedKey = idOrTag.trim().toLowerCase();
  const mappedId = LEGACY_ID_MAP[idOrTag] || LEGACY_ID_MAP[normalizedKey];
  if (mappedId) {
    const mapped = ALL_CANONICAL_EQUIPMENT.find(item => item.id === mappedId);
    if (mapped) return mapped;
  }

  // 3. Tag IEC match
  const byTag = ALL_CANONICAL_EQUIPMENT.find(item => item.tagIec.toLowerCase() === normalizedKey);
  if (byTag) return byTag;

  // 4. Fuzzy match across IDs, tags, aliases, and names
  return ALL_CANONICAL_EQUIPMENT.find(item => {
    const idLower = item.id.toLowerCase();
    const tagLower = item.tagIec.toLowerCase();
    const nameFr = item.name.fr.toLowerCase();
    const nameEn = item.name.en.toLowerCase();
    
    return (
      idLower.includes(normalizedKey) ||
      normalizedKey.includes(idLower) ||
      tagLower.includes(normalizedKey) ||
      normalizedKey.includes(tagLower) ||
      nameFr.includes(normalizedKey) ||
      normalizedKey.includes(nameFr) ||
      nameEn.includes(normalizedKey) ||
      normalizedKey.includes(nameEn) ||
      item.aliases.fr.some(a => a.toLowerCase().includes(normalizedKey) || normalizedKey.includes(a.toLowerCase())) ||
      item.aliases.en.some(a => a.toLowerCase().includes(normalizedKey) || normalizedKey.includes(a.toLowerCase()))
    );
  });
}

export function getEquipmentByDomain(domainId: string): CanonicalEquipmentObject[] {
  return ALL_CANONICAL_EQUIPMENT.filter(item => item.parentDomain === domainId);
}

export function getEquipmentByStage(stage: string): CanonicalEquipmentObject[] {
  return ALL_CANONICAL_EQUIPMENT.filter(item => item.systemStage === stage);
}

export function searchEquipment(query: string, lang: 'fr' | 'en' = 'fr'): CanonicalEquipmentObject[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_CANONICAL_EQUIPMENT;

  return ALL_CANONICAL_EQUIPMENT.filter(item => {
    const nameMatch = item.name[lang]?.toLowerCase().includes(q) || item.name.fr.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q);
    const tagMatch = item.tagIec.toLowerCase().includes(q);
    const aliasMatch = item.aliases[lang]?.some(a => a.toLowerCase().includes(q)) || item.aliases.fr.some(a => a.toLowerCase().includes(q));
    const typeMatch = item.equipmentType.toLowerCase().includes(q);
    const codeMatch = item.keyEngineeringValues.some(v => v.key.toLowerCase().includes(q));
    return nameMatch || tagMatch || aliasMatch || typeMatch || codeMatch;
  });
}
