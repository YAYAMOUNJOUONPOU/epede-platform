// src/types/engineeringRoles.ts
// EPEDE Canonical Engineering Roles & Active Discipline Definitions

export interface CanonicalRole {
  slug: string;
  domain_code: string;
  name_fr: string;
  name_en: string;
  short_fr: string;
  short_en: string;
  badge_color: 'amber' | 'blue' | 'emerald' | 'purple' | 'cyan';
  filiere_fr: string;
  filiere_en: string;
}

export const CANONICAL_ROLES: CanonicalRole[] = [
  {
    slug: 'protection-engineer',
    domain_code: 'D11',
    name_fr: 'Ingénieur en Protection & Contrôle',
    name_en: 'Protection & Control Engineer',
    short_fr: 'Protection & IED',
    short_en: 'Protection & IED',
    badge_color: 'amber',
    filiere_fr: 'Ingénierie Système & Réglages Relais',
    filiere_en: 'System Protection & Relay Coordination',
  },
  {
    slug: 'substation-design-engineer',
    domain_code: 'D04',
    name_fr: 'Ingénieur Conception Postes HT/MT',
    name_en: 'Substation Design Engineer (AIS/GIS)',
    short_fr: 'Postes HT/MT',
    short_en: 'Substations',
    badge_color: 'blue',
    filiere_fr: 'Ingénierie Électromécanique & Haute Tension',
    filiere_en: 'Electromechanical & High Voltage Sizing',
  },
  {
    slug: 'grid-dispatcher',
    domain_code: 'D02',
    name_fr: 'Dispatcher / Ingénieur Conduite Réseau',
    name_en: 'Grid Dispatcher & System Operator',
    short_fr: 'Dispatching & SCADA',
    short_en: 'Dispatching & SCADA',
    badge_color: 'emerald',
    filiere_fr: 'Exploitation & Conduite Temps Réel',
    filiere_en: 'Real-Time Grid Operations & Stability',
  },
  {
    slug: 'commissioning-lead',
    domain_code: 'D16',
    name_fr: 'Chef d\'Essais & Réception FAT/SAT',
    name_en: 'Commissioning & FAT/SAT Lead',
    short_fr: 'Essais FAT / SAT',
    short_en: 'FAT / SAT Testing',
    badge_color: 'purple',
    filiere_fr: 'Contrôle Conformité & Mise en Service',
    filiere_en: 'Compliance Assurance & Site Energization',
  },
  {
    slug: 'transmission-engineer',
    domain_code: 'D03',
    name_fr: 'Ingénieur Lignes & Transport THT',
    name_en: 'Transmission Lines & THT Engineer',
    short_fr: 'Lignes THT / Câbles',
    short_en: 'THT Lines & Cables',
    badge_color: 'cyan',
    filiere_fr: 'Transport d\'Énergie & Liaisons Interconnectées',
    filiere_en: 'Bulk Power Transmission & Regional Interties',
  },
];
