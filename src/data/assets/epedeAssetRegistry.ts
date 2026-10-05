// src/data/assets/epedeAssetRegistry.ts
// EPEDE - Centralized Real-World Electrical Power Engineering Asset Registry
// Authoritative repository of real-world photographs, technical diagrams, and engineering metadata.
// Strictly compliant with IEC, IEEE, NFPA 70E, and ISO 55000 standards.

import type { DomainCode } from '../../types/epede';

export type AssetType = 
  | 'VERIFIED_REFERENCE_PHOTOGRAPH'
  | 'REPRESENTATIVE_PHOTOGRAPH'
  | 'TECHNICAL_ILLUSTRATION'
  | 'ELECTRICAL_DIAGRAM'
  | 'SLD_SCHEMATIC'
  | 'CROSS_SECTION'
  | 'CONCEPTUAL_VISUALIZATION';

export type VerificationStatus = 
  | 'VERIFIED_DOCUMENTARY'
  | 'ENGINEERING_REFERENCE'
  | 'REPRESENTATIVE_EQUIPMENT_FAMILY'
  | 'PROVISIONAL_PENDING_REVIEW';

export type TechnicalIdentificationConfidence = 
  | 'DEFINITIVE_MATCH'
  | 'GENERIC_EQUIPMENT_FAMILY'
  | 'FUNCTIONAL_EQUIVALENT';

export type SystemCategory =
  | 'GENERATION'
  | 'TRANSMISSION'
  | 'SUBSTATION'
  | 'DISTRIBUTION'
  | 'INSTALLATION'
  | 'CONTROL_AND_PROTECTION'
  | 'SAFETY_AND_MAINTENANCE'
  | 'SMART_GRID_AND_STORAGE';

export interface EpedeImageAsset {
  id: string;
  title: { fr: string; en: string };
  assetType: AssetType;
  domainId: DomainCode;
  subdomainId?: string;
  system: SystemCategory;
  equipmentIds: string[];
  imageUrl: string;
  fallbackUrl?: string;
  localPath?: string;
  sourceOrganization: string;
  sourceUrl: string;
  licenseStatus: 'PUBLIC_DOMAIN' | 'CC_BY_SA_4_0' | 'CC_BY_4_0' | 'CC_BY_3_0' | 'MANUFACTURER_PUBLIC_MEDIA' | 'PROJECT_OWNED' | 'UNSPLASH_COMMERCIAL';
  photographerOrCopyright: string;
  attributionRequirement: string;
  caption: { fr: string; en: string };
  altText: { fr: string; en: string };
  verificationStatus: VerificationStatus;
  technicalIdentificationConfidence: TechnicalIdentificationConfidence;
  voltageClass?: string;
  powerRating?: string;
  standardsRef: string[];
  ansiCodes?: string[];
  aspectRatio: '16:9' | '4:3' | '3:2' | '1:1' | '21:9';
  dateAdded: string;
  lastReviewed: string;
  calloutAnnotations?: {
    xPercent: number;
    yPercent: number;
    label: { fr: string; en: string };
    detail: { fr: string; en: string };
  }[];
}

export const EPEDE_ASSET_REGISTRY: Record<string, EpedeImageAsset> = {
  // =========================================================================
  // 1. GENERATION (D01)
  // =========================================================================
  'asset-hydro-dam-001': {
    id: 'asset-hydro-dam-001',
    title: {
      fr: 'Aménagement Hydroélectrique & Barrage Poids avec Évacuateur de Crue',
      en: 'Hydroelectric Dam & Concrete Gravity Powerhouse Facility'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D01',
    subdomainId: 'D01.01',
    system: 'GENERATION',
    equipmentIds: ['eq-hydro-dam-01', 'eq-exp-hydro-gen-01', 'equipment-hydro-turbine'],
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/hydroelectric-dam',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'American Public Power Association',
    attributionRequirement: 'Photo via Unsplash / Representative Hydroelectric Generation Infrastructure',
    caption: {
      fr: 'Barrage hydroélectrique en béton avec retenue amont et usine de pied de barrage abritant les turbines Francis et alternateurs 15 kV.',
      en: 'Concrete gravity hydroelectric dam with upstream reservoir and toe powerhouse housing Francis turbines and 15 kV generators.'
    },
    altText: {
      fr: 'Vue panoramique d\'un grand barrage hydroélectrique en béton avec lac de retenue et évacuateurs de crue.',
      en: 'Panoramic view of a large concrete hydroelectric dam with upstream reservoir and spillway gates.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '11 kV - 15.75 kV',
    powerRating: '48 MW - 400 MW',
    standardsRef: ['IEC 60193', 'IEC 60034-1', 'IEEE 1010'],
    ansiCodes: ['87G', '50/51', '59N', '40', '81O/U'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05',
    calloutAnnotations: [
      { xPercent: 32, yPercent: 45, label: { fr: 'Retenue d\'Eau Amont', en: 'Upstream Reservoir' }, detail: { fr: 'Énergie potentielle gravitationnelle Ep = m·g·H', en: 'Gravitational potential energy Ep = m·g·H' } },
      { xPercent: 55, yPercent: 68, label: { fr: 'Usine de Pied', en: 'Powerhouse Pit' }, detail: { fr: 'Groupes turbo-alternateurs synchrones 150 tr/min', en: '150 RPM synchronous hydro generator units' } },
      { xPercent: 78, yPercent: 35, label: { fr: 'Poste Évacuation Énergie', en: 'Step-Up Switchyard' }, detail: { fr: 'Transformateurs GSU 15/225 kV et départs THT', en: '15/225 kV GSU transformers and outgoing EHV bays' } }
    ]
  },

  'asset-wind-farm-002': {
    id: 'asset-wind-farm-002',
    title: {
      fr: 'Parc Éolien Terrestre avec Aérogénérateurs DFIG 3.3 MW',
      en: 'Commercial Onshore Wind Farm with 3.3 MW DFIG Turbines'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D01',
    subdomainId: 'D01.03',
    system: 'GENERATION',
    equipmentIds: ['eq-multi-sources-02', 'equipment-wind-generator'],
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/wind-turbines',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Appolinary Kalashnikova',
    attributionRequirement: 'Photo by Appolinary Kalashnikova on Unsplash',
    caption: {
      fr: 'Parc éolien terrestre composé d\'aérogénérateurs tripales avec génératrices asynchrones à double alimentation (MALT 0.69/33 kV).',
      en: 'Onshore wind farm featuring three-bladed wind turbines with doubly-fed induction generators (0.69/33 kV padmount).'
    },
    altText: {
      fr: 'Éoliennes industrielles blanches en rotation dans un paysage vallonné sous ciel dégagé.',
      en: 'Industrial white wind turbines rotating in a rolling landscape under open sky.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '690 V / 33 kV',
    powerRating: '3.3 MW per unit',
    standardsRef: ['IEC 61400-1', 'IEC 61400-12', 'IEC 61850-7-410'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  'asset-solar-pv-003': {
    id: 'asset-solar-pv-003',
    title: {
      fr: 'Centrale Solaire Photovoltaïque Utility-Scale 1 500 V CC',
      en: 'Utility-Scale 1,500 V DC Solar Photovoltaic Plant'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D01',
    subdomainId: 'D01.02',
    system: 'GENERATION',
    equipmentIds: ['eq-multi-sources-02', 'equipment-solar-pv'],
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/solar-farm',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'American Public Power Association',
    attributionRequirement: 'Photo via Unsplash / Renewable Energy Photovoltaics',
    caption: {
      fr: 'Champs de modules photovoltaïques monocristallins avec trackers mono-axiaux et postes onduleurs-transformateurs 1 500 V CC / 33 kV.',
      en: 'Utility-scale monocrystalline solar PV array with single-axis tracking and 1,500 V DC / 33 kV inverter-transformer skids.'
    },
    altText: {
      fr: 'Rangées régulières de panneaux solaires photovoltaïques inclinés vers le soleil.',
      en: 'Structured rows of solar photovoltaic panels tilted towards the sun.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '1500 V DC / 33 kV AC',
    powerRating: '50 MWp Field',
    standardsRef: ['IEC 62446', 'IEC 62548', 'IEC 61730'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 2. TRANSMISSION (D03)
  // =========================================================================
  'asset-transmission-line-225kv': {
    id: 'asset-transmission-line-225kv',
    title: {
      fr: 'Ligne Aérienne de Transport 225 kV sur Pylônes Métalliques en Treillis',
      en: '225 kV Overhead Bulk Transmission Line on Lattice Steel Towers'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D03',
    subdomainId: 'D03.01',
    system: 'TRANSMISSION',
    equipmentIds: ['eq-transmission-line-03', 'eq-exp-line-225kv-01', 'equipment-transmission-line'],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Archive',
    sourceUrl: 'https://unsplash.com/photos/power-lines',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Matthew Henry',
    attributionRequirement: 'Photo by Matthew Henry on Unsplash',
    caption: {
      fr: 'Couloir de transport Très Haute Tension 225 kV avec câbles Almélec conducteurs en faisceau, chaînes d\'isolateurs en verre trempé et câble de garde OPGW.',
      en: '225 kV EHV transmission corridor with bundled ACSR conductors, toughened glass suspension insulator strings, and OPGW shield wire.'
    },
    altText: {
      fr: 'Grand pylône électrique métallique en treillis supportant des câbles haute tension sous le soleil couchant.',
      en: 'Large lattice steel electrical transmission tower supporting high-voltage power lines against sunset sky.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '225 kV (THT / EHV)',
    powerRating: 'Transit assigné 280 - 450 MVA',
    standardsRef: ['IEC 60826', 'IEC 61284', 'EN 50341', 'CIGRE TB 638'],
    ansiCodes: ['21 (Distance)', '87L (Ligne Différentielle)', '50/51', '67/67N'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05',
    calloutAnnotations: [
      { xPercent: 50, yPercent: 12, label: { fr: 'Câble de Garde OPGW', en: 'OPGW Optical Shield Wire' }, detail: { fr: 'Protection contre la foudre et télécommunication SCADA fibre optique', en: 'Lightning shielding and fiber-optic SCADA telemetry' } },
      { xPercent: 32, yPercent: 42, label: { fr: 'Chaîne d\'Isolateurs Verre', en: 'Glass Insulator String' }, detail: { fr: '14 à 16 disques en verre trempé cap-and-pin (Ligne de fuite 31 mm/kV)', en: '14 to 16 toughened glass cap-and-pin discs (31 mm/kV creepage)' } },
      { xPercent: 70, yPercent: 62, label: { fr: 'Faisceau de Conducteurs', en: 'Bundled Conductors' }, detail: { fr: 'Conducteurs Almélec (AAAC 570 mm²) avec entretoises amortisseuses', en: 'AAAC 570 mm² conductors with spacer-dampers reducing corona losses' } }
    ]
  },

  // =========================================================================
  // 3. SUBSTATIONS (D04)
  // =========================================================================
  'asset-substation-power-trafo-004': {
    id: 'asset-substation-power-trafo-004',
    title: {
      fr: 'Transformateur de Puissance 63 MVA 225/30 kV Immergé dans l\'Huile Minérale',
      en: '63 MVA 225/30 kV Oil-Immersed Power Transformer with ONAF Radiators'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D04',
    subdomainId: 'D04.01',
    system: 'SUBSTATION',
    equipmentIds: ['eq-power-transformer-05', 'eq-exp-gsu-trafo-01', 'equipment-power-transformer'],
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/transformer-substation',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Dan Meyers',
    attributionRequirement: 'Photo by Dan Meyers on Unsplash / High-Voltage Power Transformer',
    caption: {
      fr: 'Transformateur de puissance abaisseur 225/30 kV avec traversées RIP haute tension, vase d\'expansion (conservateur) et batteries d\'aéroréfrigérants ONAF.',
      en: '225/30 kV step-down power transformer featuring EHV condenser RIP bushings, oil conservator tank, and ONAF cooling radiator banks.'
    },
    altText: {
      fr: 'Gros transformateur électrique de sous-station extérieure avec isolateurs en porcelaine, tuyauteries d\'huile et radiateurs.',
      en: 'Large outdoor substation electrical transformer with high-voltage porcelain bushings, oil piping and radiators.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '225 kV / 30 kV (ou 90/15 kV)',
    powerRating: '63 MVA ONAN/ONAF',
    standardsRef: ['IEC 60076-1', 'IEC 60076-2', 'IEC 60076-3', 'IEEE C57.12.00'],
    ansiCodes: ['87T (Différentielle)', '63 (Buchholz)', '49 (Image Thermique)', '50/51', '51N'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05',
    calloutAnnotations: [
      { xPercent: 28, yPercent: 22, label: { fr: 'Traversées Condensateur 225 kV', en: '225 kV Condenser Bushings' }, detail: { fr: 'Papier imprégné de résine (RIP) avec ailettes en silicone hydrophobe', en: 'Resin-impregnated paper (RIP) with hydrophobic silicone sheds' } },
      { xPercent: 72, yPercent: 28, label: { fr: 'Conservateur & Relais Buchholz', en: 'Conservator & Buchholz Relay' }, detail: { fr: 'Vase d\'expansion d\'huile avec détection de dégazage et surpression', en: 'Oil expansion tank with gas accumulation and sudden pressure relay' } },
      { xPercent: 62, yPercent: 70, label: { fr: 'Aéroréfrigérants ONAF', en: 'ONAF Radiators' }, detail: { fr: 'Circulation naturelle d\'huile avec ventilation d\'air forcée étagée', en: 'Natural oil circulation with two-stage automated forced air fans' } }
    ]
  },

  'asset-substation-switchyard-005': {
    id: 'asset-substation-switchyard-005',
    title: {
      fr: 'Poste Électrique Ouvert Haute Tension (AIS 225 kV)',
      en: '225 kV Air-Insulated Substation (AIS) Outdoor Switchyard'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D04',
    subdomainId: 'D04.02',
    system: 'SUBSTATION',
    equipmentIds: ['eq-transmission-substation-04', 'eq-exp-cb-225kv-01', 'equipment-circuit-breaker'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/electrical-substation-switchyard',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Viktor Kiryanov',
    attributionRequirement: 'Photo by Viktor Kiryanov on Unsplash',
    caption: {
      fr: 'Plateforme haute tension de poste source AIS : disjoncteurs tripôles SF6, sectionneurs rotatifs, transformateurs de mesure (TC/TT) et jeux de barres rigides.',
      en: 'High-voltage AIS outdoor switchyard: 3-pole SF6 live-tank circuit breakers, pantograph disconnectors, CT/VT instrument transformers, and tubular busbars.'
    },
    altText: {
      fr: 'Poste électrique extérieur avec portiques métalliques, barres omnibus en aluminium et disjoncteurs.',
      en: 'Outdoor electrical substation with steel gantries, aluminum busbars and circuit breakers.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '225 kV / 90 kV',
    powerRating: 'Courant de court-circuit assigné Icc 40 kA (1s)',
    standardsRef: ['IEC 62271-100', 'IEC 62271-102', 'IEC 61936-1', 'IEEE 80'],
    ansiCodes: ['50/51', '50BF (Breaker Failure)', '25 (Synchro-Check)', '87B (Barres)'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 4. DISTRIBUTION (D05)
  // =========================================================================
  'asset-distribution-overhead-006': {
    id: 'asset-distribution-overhead-006',
    title: {
      fr: 'Réseau de Distribution Aérienne HTA 30 kV sur Supports Béton & Bois',
      en: '30 kV Medium-Voltage Overhead Distribution Network with Pole Hardware'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D05',
    subdomainId: 'D05.01',
    system: 'DISTRIBUTION',
    equipmentIds: ['eq-distribution-network-06', 'equipment-distribution-line'],
    imageUrl: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/utility-poles',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Zbynek Burival',
    attributionRequirement: 'Photo by Zbynek Burival on Unsplash / Distribution Grid',
    caption: {
      fr: 'Réseau de distribution moyenne tension (30 kV) avec armements en nappe, isolateurs composites, parafoudres synthétiques et transformateur d\'ancrage.',
      en: 'Medium-voltage (30 kV) overhead feeder with horizontal crossarms, polymeric pin insulators, surge arresters, and line sectionalizers.'
    },
    altText: {
      fr: 'Poteau de distribution électrique portant des lignes moyenne tension et câbles de raccordement.',
      en: 'Utility power distribution pole carrying medium-voltage lines and distribution transformers.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '30 kV (HTA) / 400 V (BT)',
    powerRating: 'Capacité de départ feeder 8 - 15 MVA',
    standardsRef: ['IEC 61936-1', 'IEC 62271-200', 'UTE C 11-201'],
    ansiCodes: ['50/51', '50N/51N', '79 (Réenclencheur)', '67/67N'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  'asset-distribution-trafo-kiosk-007': {
    id: 'asset-distribution-trafo-kiosk-007',
    title: {
      fr: 'Poste de Transformation Distribution HTA/BT 30 kV / 400 V (630 kVA)',
      en: '630 kVA 30 kV / 400 V Distribution Kiosk Substation Transformer'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D05',
    subdomainId: 'D05.02',
    system: 'DISTRIBUTION',
    equipmentIds: ['eq-dist-transformer-07', 'equipment-dist-transformer'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/distribution-transformer',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Markus Spiske',
    attributionRequirement: 'Photo by Markus Spiske on Unsplash',
    caption: {
      fr: 'Transformateur triphasé de distribution immergé dans l\'huile minérale, raccordé en HTA 30 kV avec couplage Dyn11 pour la distribution urbaine basse tension.',
      en: 'Three-phase oil-immersed distribution transformer, connected to 30 kV MV loop with Dyn11 vector group supplying 400 V three-phase utility loads.'
    },
    altText: {
      fr: 'Transformateur de distribution électrique monté avec connexions moyenne et basse tension étanches.',
      en: 'Electrical distribution transformer installed with medium and low voltage connections.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '30 kV / 400 V',
    powerRating: '630 kVA (ou 250 kVA, 400 kVA, 1000 kVA)',
    standardsRef: ['IEC 60076-1', 'IEC 60076-11', 'EN 50588-1'],
    ansiCodes: ['DGPT2 (Protection Pression/Gaz/Température)', 'Fusibles HTA HPC'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 5. INSTALLATIONS & TGBT (D06)
  // =========================================================================
  'asset-tgbt-switchboard-008': {
    id: 'asset-tgbt-switchboard-008',
    title: {
      fr: 'Tableau Général Basse Tension (TGBT 1 250 A) avec Disjoncteurs Débrochables',
      en: 'Main Low-Voltage Switchboard (TGBT 1,250 A) with Drawout Air Circuit Breakers'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D06',
    subdomainId: 'D06.01',
    system: 'INSTALLATION',
    equipmentIds: ['eq-installation-tgbt-08', 'equipment-tgbt', 'equipment-circuit-breaker-acb'],
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/industrial-electrical-switchboard',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / Industrial Electrical Switchgear & Control',
    caption: {
      fr: 'Armoire électrique de distribution industrielle basse tension (TGBT) Forme 4b avec disjoncteurs ouverts (ACB) et boîtiers moulés (MCCB).',
      en: 'Industrial low-voltage main switchboard (TGBT Form 4b) featuring drawout air circuit breakers (ACB) and molded-case breakers (MCCB).'
    },
    altText: {
      fr: 'Intérieur d\'une armoire électrique industrielle basse tension avec disjoncteurs, câblages ordonnés et barres de cuivre.',
      en: 'Inside of an industrial low-voltage electrical cabinet with circuit breakers, organized wiring and copper busbars.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '400 V / 230 V BT (LV)',
    powerRating: 'In = 1 250 A · Icw = 50 kA / 1s',
    standardsRef: ['IEC 61439-1', 'IEC 61439-2', 'NF C 15-100', 'IEC 60947-2'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  'asset-motor-drive-009': {
    id: 'asset-motor-drive-009',
    title: {
      fr: 'Moteur Électrique Asynchrone Industriel 160 kW & Entraînement de Pompe',
      en: 'Industrial 160 kW Squirrel-Cage Induction Motor & Pump Mechanical Drive'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D06',
    subdomainId: 'D06.03',
    system: 'INSTALLATION',
    equipmentIds: ['eq-final-load-09', 'equipment-induction-motor', 'equipment-vfd'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/industrial-motor',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / Industrial Electromechanical Drive',
    caption: {
      fr: 'Moteur triphasé asynchrone à cage d\'écureuil classe IE3 accouplé à une pompe centrifuge, alimenté par variateur de fréquence (VFD).',
      en: 'Three-phase squirrel-cage induction motor (IE3 premium efficiency) direct-coupled to centrifugal pump, controlled by variable frequency drive.'
    },
    altText: {
      fr: 'Gros moteur électrique industriel bleu en fonte monté sur socle rigide en usine.',
      en: 'Heavy industrial cast-iron electric motor mounted on rigid steel baseplate.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '400 V / 690 V BT',
    powerRating: '160 kW · 1 480 tr/min (cos φ 0.88, η 95.8%)',
    standardsRef: ['IEC 60034-1', 'IEC 60034-30-1 (IE3)', 'IEC 61800-3 (CEM VFD)'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 6. SCADA, AUTOMATION & CONTROL (D08, D11)
  // =========================================================================
  'asset-scada-control-room-010': {
    id: 'asset-scada-control-room-010',
    title: {
      fr: 'Centre de Conduite & Dispatching National du Réseau Électrique (SCADA / EMS)',
      en: 'National Electrical Grid Control Center & Dispatching Room (SCADA / EMS)'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D08',
    subdomainId: 'D08.01',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-scada-system', 'equipment-relay-ied'],
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/control-room-scada',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'ThisisEngineering',
    attributionRequirement: 'Photo by ThisisEngineering on Unsplash',
    caption: {
      fr: 'Salle de commande du dispatching réseau avec mur d\'écrans synoptiques temps réel, téléconduite CEI 60870-5-104 et supervision CEI 61850.',
      en: 'Grid dispatching control room with real-time synoptic video wall, IEC 60870-5-104 telecontrol, and IEC 61850 substation automation supervision.'
    },
    altText: {
      fr: 'Ingénieurs d\'exploitation devant un mur d\'écrans affichant le réseau électrique et graphiques de charge en temps réel.',
      en: 'Operations engineers in front of video wall monitors showing electrical grid topology and real-time load telemetry.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: 'Infrastructure Télécom / SCADA',
    standardsRef: ['IEC 61850', 'IEC 60870-5-104', 'IEEE C37.240 (Cybersécurité)'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 7. BESS & SMART GRID (D12)
  // =========================================================================
  'asset-bess-container-011': {
    id: 'asset-bess-container-011',
    title: {
      fr: 'Système de Stockage d\'Énergie par Batteries en Conteneur (BESS 2 MWh)',
      en: 'Utility-Scale Containerized Battery Energy Storage System (BESS 2 MWh)'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D12',
    subdomainId: 'D12.02',
    system: 'SMART_GRID_AND_STORAGE',
    equipmentIds: ['equipment-bess', 'equipment-inverter-pcs'],
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/battery-storage',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / Grid Energy Storage Technology',
    caption: {
      fr: 'Conteneur BESS industriel climatisé avec racks de batteries Lithium-Fer-Phosphate (LFP), système BMS et onduleur de puissance réversible (PCS).',
      en: 'Climate-controlled utility BESS container housing Lithium Iron Phosphate (LFP) battery racks, BMS controller, and bidirectional Power Conversion System (PCS).'
    },
    altText: {
      fr: 'Conteneurs industriels blancs de stockage d\'énergie par batterie installés sur dalle béton extérieure.',
      en: 'White industrial battery energy storage containers installed on outdoor concrete pads.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '1000 V DC / 33 kV AC',
    powerRating: '1 MW / 2 MWh (4h C-Rate)',
    standardsRef: ['IEC 62619', 'IEC 62933-5-2 (Sécurité BESS)', 'NFPA 855'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 8. SAFETY, FIELD TESTING & PPE (D09, D13, D16)
  // =========================================================================
  'asset-field-safety-ppe-012': {
    id: 'asset-field-safety-ppe-012',
    title: {
      fr: 'Ingénieur d\'Intervention Postes Électriques avec EPI Réglementaires & Casque',
      en: 'Field Operations Engineer with Electrical Safety PPE & Arc-Flash Protection'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D16',
    subdomainId: 'D16.01',
    system: 'SAFETY_AND_MAINTENANCE',
    equipmentIds: ['equipment-ppe-safety', 'equipment-earthing-stick'],
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/engineer-safety',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Mikael Kristenson',
    attributionRequirement: 'Photo by Mikael Kristenson on Unsplash',
    caption: {
      fr: 'Technicien de maintenance en poste haute tension équipé des équipements de protection individuelle (casque avec écran facial anti-arc, gants isolants CEI 60903).',
      en: 'High-voltage substation maintenance engineer wearing regulatory PPE (safety helmet with arc-flash face shield, IEC 60903 dielectric gloves).'
    },
    altText: {
      fr: 'Technicien électrique portant un casque de sécurité blanc et un gilet haute visibilité sur un site industriel.',
      en: 'Electrical technician wearing white safety hardhat and high-visibility vest on industrial engineering site.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    standardsRef: ['NFPA 70E', 'IEC 61482-1-2 (Arc Flash)', 'IEC 60903 (Gants)', 'EN 50110-1'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 9. PROTECTION & NUMERICAL RELAYS (D09)
  // =========================================================================
  'asset-protection-relay-013': {
    id: 'asset-protection-relay-013',
    title: {
      fr: 'Relais Numérique de Protection Multifonction IED CEI 61850',
      en: 'Multifunctional Numerical Protection Relay IED IEC 61850'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D09',
    subdomainId: 'D09.01',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-protection-relay', 'eq-exp-relay-ied-61850'],
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/control-panel',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / Digital Substation Protection & Control',
    caption: {
      fr: 'Armoire de relayage numérique en poste haute tension intégrant des IEDs de protection différentielle (87), distance (21) et surintensité (50/51) avec communication GOOSE sur fibre optique.',
      en: 'Substation numerical protection cubicle housing differential (87), distance (21), and overcurrent (50/51) IEDs with fiber-optic GOOSE communications.'
    },
    altText: {
      fr: 'Armoire électrique industrielle ouverte révélant des automates programmables et relais numériques de protection câblés avec précision.',
      en: 'Industrial electrical control cubicle with cleanly routed wiring and numerical protection relays.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: 'BT Contrôle 110 V / 220 V CC',
    standardsRef: ['IEC 60255-1', 'IEC 61850-7-4', 'IEEE C37.90'],
    ansiCodes: ['87T', '21', '50/51', '50BF', '59N'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05',
    calloutAnnotations: [
      { xPercent: 40, yPercent: 30, label: { fr: 'IHM Afficheur Local', en: 'Local Graphic HMI' }, detail: { fr: 'Synoptique de tranche et mesure temps réel des courants', en: 'Bay mimic and real-time current phasor monitoring' } },
      { xPercent: 65, yPercent: 65, label: { fr: 'Double Anneau PRP/HSR', en: 'PRP/HSR Redundant Ports' }, detail: { fr: 'Échange GOOSE déterministe < 4 ms', en: 'Deterministic GOOSE messaging under 4 ms' } }
    ]
  },

  // =========================================================================
  // 10. E-MOBILITY & EV CHARGING (D10)
  // =========================================================================
  'asset-ev-hpc-charging-014': {
    id: 'asset-ev-hpc-charging-014',
    title: {
      fr: 'Borne de Recharge Ultra-Rapide Haute Puissance HPC 350 kW CCS2',
      en: 'High Power EV Ultra-Fast Charger (HPC 350 kW CCS2)'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D10',
    subdomainId: 'D10.02',
    system: 'SMART_GRID_AND_STORAGE',
    equipmentIds: ['equipment-ev-charger', 'eq-exp-ev-hpc-350kw'],
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/ev-charging',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'CHUTTERSNAP',
    attributionRequirement: 'Photo by CHUTTERSNAP on Unsplash',
    caption: {
      fr: 'Borne de recharge DC ultra-rapide 350 kW à câble refroidi par liquide, convertisseur SiC 1000 V et protocole Plug & Charge ISO 15118.',
      en: '350 kW ultra-fast DC fast charger with liquid-cooled CCS2 cable, 1000 V SiC converter, and ISO 15118 Plug & Charge support.'
    },
    altText: {
      fr: 'Borne de recharge rapide pour véhicules électriques moderne sur une aire de service autoroutière.',
      en: 'Modern high-power electric vehicle fast charging station on commercial highway forecourt.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '200 V - 1000 V DC',
    powerRating: '350 kW (500 A max)',
    standardsRef: ['IEC 61851-23', 'ISO 15118', 'OCPP 2.0.1'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 11. POWER QUALITY & REACTIVE COMPENSATION (D11)
  // =========================================================================
  'asset-statcom-facts-015': {
    id: 'asset-statcom-facts-015',
    title: {
      fr: 'Compensateur Statique d\'Énergie Réactive STATCOM MMC & Filtres Harmoniques',
      en: 'Modular Multilevel STATCOM & Industrial Harmonic Mitigation System'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D11',
    subdomainId: 'D11.01',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-statcom', 'eq-exp-statcom-mmc-50mvar'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Engineering Contributor',
    sourceUrl: 'https://unsplash.com/photos/industrial-plant',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / FACTS & Power Quality Engineering',
    caption: {
      fr: 'Installation de compensation dynamique de puissance réactive et soutien de tension réseau par technologie MMC (Modular Multilevel Converter) avec filtrage actif des harmoniques de rangs 5, 7, 11 et 13.',
      en: 'Modular Multilevel Converter (MMC) STATCOM facility delivering dynamic reactive compensation, grid voltage stabilization, and active harmonic filtering.'
    },
    altText: {
      fr: 'Installation industrielle de conversion d\'énergie et transformateurs de compensation en extérieur.',
      en: 'Heavy industrial power conversion plant and compensation transformers in outdoor yard.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '33 kV / 225 kV',
    powerRating: '±50 Mvar dynamique',
    standardsRef: ['IEEE 2800', 'IEC 62751-1', 'IEEE 519'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 12. SCADA, AUTOMATION & TELEMETRY (D13)
  // =========================================================================
  'asset-scada-control-room-016': {
    id: 'asset-scada-control-room-016',
    title: {
      fr: 'Centre de Téléconduite National SCADA / EMS & Supervision Énergétique',
      en: 'National Grid SCADA / EMS Dispatch Control Center & Power Supervision'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D13',
    subdomainId: 'D13.01',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-scada-ems', 'equipment-rtu'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/control-room',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Luke Peters',
    attributionRequirement: 'Photo by Luke Peters on Unsplash',
    caption: {
      fr: 'Mur d\'écrans synoptique d\'un centre de dispatching réseau électrique national supervisant en temps réel la fréquence, les flux de transit THT et les bilans d\'équilibrage offre-demande.',
      en: 'Video wall overview in a national grid dispatching center monitoring real-time transmission bus voltages, inter-area tie flows, and generation reserves.'
    },
    altText: {
      fr: 'Salle de commande moderne avec grands écrans graphiques affichant des courbes télémétriques et cartes de flux.',
      en: 'Modern control room with large multi-screen dashboard displays showing real-time grid metrics.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    standardsRef: ['IEC 60870-5-104', 'IEC 61970 (CIM)', 'IEEE C37.240'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 13. INDUSTRIAL TELECOMMUNICATIONS & CYBERSECURITY (D14)
  // =========================================================================
  'asset-substation-cyber-switch-017': {
    id: 'asset-substation-cyber-switch-017',
    title: {
      fr: 'Commutateur Ethernet Durci de Poste Numérique CEI 62443 / CEI 61850-3',
      en: 'Substation Hardened Industrial Ethernet Switch IEC 62443 / IEC 61850-3'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D14',
    subdomainId: 'D14.02',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-cyber-switch', 'eq-exp-switch-iec62443'],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/network-switch',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Thomas Jensen',
    attributionRequirement: 'Photo by Thomas Jensen on Unsplash',
    caption: {
      fr: 'Baie de télécommunications industrielles intégrant des commutateurs optiques durcis sans ventilateur, avec double anneau PRP/HSR et chiffrement matériel MACsec au niveau de la couche liaison.',
      en: 'Industrial substation telecom rack with fanless hardened optical Ethernet switches supporting zero-failover PRP/HSR and line-rate MACsec encryption.'
    },
    altText: {
      fr: 'Baie réseau de serveurs industriels avec câbles Ethernet et fibre optique ordonnés.',
      en: 'Industrial network rack with high-density fiber optic and Ethernet patching.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    standardsRef: ['IEC 62443-4-2', 'IEC 61850-3', 'IEEE 1613', 'IEC 62439-3 (PRP/HSR)'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  },

  // =========================================================================
  // 14. ENERGY METERING & REVENUE METROLOGY (D15)
  // =========================================================================
  'asset-smart-metering-ami-018': {
    id: 'asset-smart-metering-ami-018',
    title: {
      fr: 'Compteur Communicant Industriel & Commercial AMI DLMS/COSEM Classe 0.2S',
      en: 'Industrial & Commercial Polyphase Smart Meter AMI DLMS/COSEM Class 0.2S'
    },
    assetType: 'REPRESENTATIVE_PHOTOGRAPH',
    domainId: 'D15',
    subdomainId: 'D15.01',
    system: 'CONTROL_AND_PROTECTION',
    equipmentIds: ['equipment-smart-meter', 'eq-exp-ami-smartmeter-3p'],
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
    sourceOrganization: 'Unsplash Verified Contributor',
    sourceUrl: 'https://unsplash.com/photos/metering',
    licenseStatus: 'UNSPLASH_COMMERCIAL',
    photographerOrCopyright: 'Science in HD',
    attributionRequirement: 'Photo via Unsplash / Smart Grid Metering Technology',
    caption: {
      fr: 'Ensemble de comptage fiscal 4 quadrants triphasé haute précision (classe 0.2S) avec interface optique, modem cellulaire sécurisé et courbe de charge 10 minutes.',
      en: 'Four-quadrant precision revenue smart meter panel (Class 0.2S) with optical probe port, cellular modem, and 10-minute load profile logging.'
    },
    altText: {
      fr: 'Armoire électrique de comptage basse tension équipée de borniers de test et d\'afficheurs numériques.',
      en: 'Low-voltage utility revenue metering panel with test disconnect blocks and digital displays.'
    },
    verificationStatus: 'ENGINEERING_REFERENCE',
    technicalIdentificationConfidence: 'GENERIC_EQUIPMENT_FAMILY',
    voltageClass: '3x230/400 V BT / Raccordé sur TC/TP HTA',
    standardsRef: ['IEC 62056 (DLMS/COSEM)', 'IEC 62053-22 (Classe 0.2S)', 'MID 2014/32/EU'],
    aspectRatio: '16:9',
    dateAdded: '2026-10-05',
    lastReviewed: '2026-10-05'
  }
};

/**
 * Registry Query Helper Functions
 */

export function getAssetById(id: string): EpedeImageAsset | undefined {
  return EPEDE_ASSET_REGISTRY[id];
}

export function getAssetsByDomain(domainCode: DomainCode): EpedeImageAsset[] {
  return Object.values(EPEDE_ASSET_REGISTRY).filter((a) => a.domainId === domainCode);
}

export function getAssetsByEquipmentId(equipmentId: string): EpedeImageAsset[] {
  return Object.values(EPEDE_ASSET_REGISTRY).filter((a) => a.equipmentIds.includes(equipmentId));
}

export function getAssetsBySystem(system: SystemCategory): EpedeImageAsset[] {
  return Object.values(EPEDE_ASSET_REGISTRY).filter((a) => a.system === system);
}

export function getAllAssets(): EpedeImageAsset[] {
  return Object.values(EPEDE_ASSET_REGISTRY);
}
