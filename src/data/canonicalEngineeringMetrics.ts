// src/data/canonicalEngineeringMetrics.ts
/**
 * EPEDE CANONICAL ENGINEERING METRICS — SINGLE SOURCE OF TRUTH
 * 
 * Every count, figure, rating, and attribution displayed across EPEDE
 * must strictly reference this file to eliminate discrepancies.
 * 
 * Author & Lead Engineer: Mounjouonpou Yaya
 * Domain: https://epede-platform.vercel.app
 */

export interface AuthorProfile {
  name: string;
  titleFr: string;
  titleEn: string;
  roleFr: string;
  roleEn: string;
  bioFr: string;
  bioEn: string;
  platformUrl: string;
  contactEmail: string;
  feedbackUrl: string;
}

export const EPEDE_AUTHOR: AuthorProfile = {
  name: 'Mounjouonpou Yaya',
  titleFr: 'Ingénieur Électrotechnique & Réseaux Électriques',
  titleEn: 'Electrical and Power Systems Engineer',
  roleFr: 'Auteur & Concepteur de la plateforme EPEDE',
  roleEn: 'Author & Lead Designer of the EPEDE Platform',
  bioFr: 'Ingénieur électrotechnique spécialisé dans la modélisation des réseaux haute et moyenne tension, les études de court-circuit, les protections industrielles et l\'intégration des ouvrages de production.',
  bioEn: 'Electrical and power systems engineer specialized in HV/MV grid modeling, short-circuit calculations, industrial protection coordination, and power generation integration.',
  platformUrl: 'https://epede-platform.vercel.app',
  contactEmail: 'contact@epede-platform.vercel.app',
  feedbackUrl: 'https://epede-platform.vercel.app/#/contact'
};

export const EPEDE_CANONICAL_METRICS = {
  // Equipment Catalogue Metrics
  equipment: {
    verifiedCount: 39, // Canonical verified deep-dive technical data sheets
    categoriesCount: 6, // Production, Transformation, Transport, Distribution, Protection, Consommation
    voltageLevelsCovered: ['THT (225 kV)', 'HTA (15-30 kV)', 'BT (400/230 V)'],
    standardsReferenced: 28, // IEC, NF C, IEEE standards
  },

  // Engineering Calculation Engines
  calculators: {
    totalEngines: 17, // The 17 deterministic calculation suites
    domainsCovered: 16,
    verifiedAgainstNorms: 'Formules conformes aux normes CEI 60909-0, NF C 15-105, CEI 60034, IEEE 242',
    deterministic: true,
  },

  // Cameroon Grid Certified Metrics (Sources: SONATREL / ARSEL / EDC Reports 2024-2026)
  cameroonGrid: {
    source: 'Rapports d\'activité SONATREL / ARSEL / EDC (Actualisation 2024-2026)',
    sourceDate: '2024-2026',
    nationalInstalledCapacityMw: 2050, // Including Nachtigal hydro commissioning (7 x 60 MW)
    hydroSharePercent: 68.5,
    thermalGasSharePercent: 28.5,
    solarReSharePercent: 3.0,
    peakDemandMw: 1420,
    transmissionLineKm225kv: 2480,
    transmissionLineKm110kv: 450,
    transmissionLineKm90kv: 1650,
    mainHydroPlants: [
      {
        name: 'Nachtigal Amont',
        capacityMw: 420,
        units: '7 groupes hydro-alternateurs Francis de 60 MW',
        voltageKv: 225,
        generatorVoltageKv: 10.5
      },
      {
        name: 'Songloulou',
        capacityMw: 384,
        units: '8 groupes hydro-alternateurs Francis de 48 MW (57.6 MVA, cos φ 0.83)',
        voltageKv: 225,
        generatorVoltageKv: 10.5
      },
      {
        name: 'Edéa (I, II, III)',
        capacityMw: 276,
        units: '14 groupes hydro-alternateurs (Kaplan & Francis)',
        voltageKv: 90,
        generatorVoltageKv: 10.5
      },
      {
        name: 'Memve\'ele',
        capacityMw: 211,
        units: '4 groupes hydro-alternateurs Francis de 52.75 MW',
        voltageKv: 225,
        generatorVoltageKv: 11
      }
    ],
    tsoOperator: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
    distributionConcessionaire: 'Eneo Cameroon S.A.',
    assetAuthority: 'EDC (Electricity Development Corporation)',
    sectorRegulator: 'ARSEL (Agence de Régulation du Secteur de l\'Électricité)'
  },

  // Platform Doors
  threeDoors: {
    learn: {
      id: 'journey',
      titleFr: 'Apprendre',
      titleEn: 'Learn',
      subtitleFr: 'Parcours guidé à travers la chaîne électrotechnique complète, du barrage à la prise.',
      subtitleEn: 'Guided journey across the full electrotechnical power chain, from dam to socket.'
    },
    calculate: {
      id: 'calculators',
      titleFr: 'Calculer',
      titleEn: 'Calculate',
      subtitleFr: '17 calculateurs métier déterministes vérifiés selon CEI 60909-0, NF C 15-105 et IEEE.',
      subtitleEn: '17 deterministic engineering calculation engines conforming to IEC 60909-0, NF C 15-105 and IEEE.'
    },
    lookup: {
      id: 'equipment',
      titleFr: 'Consulter',
      titleEn: 'Look Up',
      subtitleFr: 'Référentiel de 39 fiches techniques d\'appareillage réel et recueil des normes applicables.',
      subtitleEn: 'Reference catalog of 39 real equipment data sheets and applicable standards registry.'
    }
  }
};
