// src/utils/engineeringDisplayUtils.ts
/**
 * Engineering Display Utilities
 * Formats internal entity codes into human-readable electrotechnical terms.
 */

const ENTITY_TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  POWERTRANSFORMER: { fr: 'Transformateur de Puissance', en: 'Power Transformer' },
  TRANSFORMER: { fr: 'Transformateur', en: 'Transformer' },
  CIRCUITBREAKER: { fr: 'Disjoncteur Haute Tension', en: 'Circuit Breaker' },
  CIRCUIT_BREAKER: { fr: 'Disjoncteur', en: 'Circuit Breaker' },
  PROTECTIONIED: { fr: 'Relais Numérique (IED)', en: 'Protection IED' },
  DIGITALPROTECTIONIED: { fr: 'Relais Numérique (IED)', en: 'Digital Protection IED' },
  DISCONNECTOR: { fr: 'Sectionneur de Ligne', en: 'Line Disconnector' },
  EARTHSWITCH: { fr: 'Sectionneur de Terre', en: 'Earthing Switch' },
  SURGEARRESTER: { fr: 'Parafoudre d\'Oxyde Métallique', en: 'Surge Arrester' },
  CURRENTTRANSFORMER: { fr: 'Transformateur de Courant (TC)', en: 'Current Transformer (CT)' },
  VOLTAGETRANSFORMER: { fr: 'Transformateur de Tension (TT)', en: 'Voltage Transformer (VT)' },
  BUSBAR: { fr: 'Jeu de Barres', en: 'Busbar System' },
  CABLE: { fr: 'Câble d\'Énergie HTA/BT', en: 'Power Cable' },
  HYDROGENERATOR: { fr: 'Hydro-Alternateur Synchrone', en: 'Hydro Generator' },
  TURBINE: { fr: 'Turbine Hydraulique', en: 'Hydraulic Turbine' },
  FEEDER: { fr: 'Départ Réseau', en: 'Feeder Bay' },
  RINGMAINUNIT: { fr: 'Tableau Compact RMU', en: 'Ring Main Unit (RMU)' },
  SWITCHBOARD: { fr: 'Tableau Général Basse Tension (TGBT)', en: 'Main LV Switchboard (TGBT)' },
  MOTOR: { fr: 'Moteur Asynchrone Triphasé', en: 'Induction Motor' },
  SUBSTATIONAPPARATUS: { fr: 'Appareillage de Poste', en: 'Substation Apparatus' },
  DISTRIBUTIONAPPARATUS: { fr: 'Appareil de Distribution', en: 'Distribution Apparatus' }
};

export function formatEntityType(rawType?: string | null, locale: 'fr' | 'en' = 'fr'): string {
  if (!rawType) return '';
  const key = rawType.toUpperCase().replace(/[\s_-]/g, '');
  if (ENTITY_TYPE_LABELS[key]) {
    return locale === 'fr' ? ENTITY_TYPE_LABELS[key].fr : ENTITY_TYPE_LABELS[key].en;
  }
  // Convert camelCase or PascalCase into space-separated capitalized words
  return rawType
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatVoltageTag(voltageLevel?: string | null, nominalVoltage?: string | null): string {
  if (nominalVoltage) return nominalVoltage;
  if (!voltageLevel) return '';
  switch (voltageLevel.toUpperCase()) {
    case 'EHV':
    case 'THT':
      return '225 kV (THT / HTB)';
    case 'HV':
    case 'HT':
    case 'HTB':
      return '63-225 kV (HTB)';
    case 'MV':
    case 'MT':
    case 'HTA':
      return '15-30 kV (HTA)';
    case 'LV':
    case 'BT':
      return '400V / 230V (BT)';
    case 'DC':
      return 'Courant Continu (CC)';
    default:
      return voltageLevel;
  }
}
