// src/i18n/index.ts
// EPEDE 2.0 Centralized Bilingual Message Catalog (Task T-204)

export type Locale = 'fr' | 'en';

export interface TranslationDictionary {
  common: {
    appName: string;
    tagline: string;
    normativeBadge: string;
    didacticDisclaimer: string;
    loading: string;
    back: string;
    next: string;
    learnMore: string;
    viewDetails: string;
    cameroonContext: string;
    operatingPrinciple: string;
    systemPurpose: string;
    normativeStandard: string;
    workedExample: string;
    keyEquipment: string;
  };
  navigation: {
    home: string;
    powerChain: string;
    equipmentCatalog: string;
    engineeringDomains: string;
    calculators: string;
    simulationLab: string;
    cameroonGrid: string;
    standards: string;
  };
  powerChain: {
    title: string;
    subtitle: string;
    upstream: string;
    downstream: string;
    stageOf: string;
  };
}

export const MESSAGES: Record<Locale, TranslationDictionary> = {
  fr: {
    common: {
      appName: 'EPEDE 2.0',
      tagline: 'Environnement Pédagogique Numérique de Génie Électrique',
      normativeBadge: 'NORME TECHNIQUE (CEI / IEEE / NF C)',
      didacticDisclaimer:
        'Plateforme pédagogique didactique à visée universitaire et professionnelle. Ne remplace pas une note de calcul certifiée bureau d’études.',
      loading: 'Chargement en cours...',
      back: 'Retour',
      next: 'Suivant',
      learnMore: 'En savoir plus',
      viewDetails: 'Consulter les détails',
      cameroonContext: 'Application Terrain au Cameroun',
      operatingPrinciple: 'Principe Physique Fondamental',
      systemPurpose: 'Rôle & Finalité Système',
      normativeStandard: 'Norme de Référence',
      workedExample: 'Exemple Pratique Résolu',
      keyEquipment: 'Équipements Clés',
    },
    navigation: {
      home: 'Accueil',
      powerChain: 'Chaîne Électrique',
      equipmentCatalog: 'Catalogue Équipements',
      engineeringDomains: 'Domaines d’Ingénierie',
      calculators: 'Calculateurs Didactiques',
      simulationLab: 'Laboratoire Virtuel',
      cameroonGrid: 'Réseau Camerounais',
      standards: 'Bibliothèque Normative',
    },
    powerChain: {
      title: 'Chaîne Physique de Puissance',
      subtitle: 'De la centrale de production aux récepteurs terminaux',
      upstream: 'Amont',
      downstream: 'Aval',
      stageOf: 'Étape {current} sur {total}',
    },
  },
  en: {
    common: {
      appName: 'EPEDE 2.0',
      tagline: 'Electrical Power Engineering Digital Environment',
      normativeBadge: 'TECHNICAL STANDARD (IEC / IEEE / NF C)',
      didacticDisclaimer:
        'Authoritative didactic learning environment. Sizing for real-world projects requires certified engineering calculation notes.',
      loading: 'Loading...',
      back: 'Back',
      next: 'Next',
      learnMore: 'Learn more',
      viewDetails: 'View details',
      cameroonContext: 'Cameroon Grid Application',
      operatingPrinciple: 'Core Physical Principle',
      systemPurpose: 'System Purpose & Objective',
      normativeStandard: 'Normative Standard',
      workedExample: 'Worked Engineering Example',
      keyEquipment: 'Key Equipment',
    },
    navigation: {
      home: 'Home',
      powerChain: 'Power Chain',
      equipmentCatalog: 'Equipment Catalog',
      engineeringDomains: 'Engineering Domains',
      calculators: 'Didactic Calculators',
      simulationLab: 'Virtual Laboratory',
      cameroonGrid: 'Cameroon Grid',
      standards: 'Normative Standards',
    },
    powerChain: {
      title: 'Physical Power Chain',
      subtitle: 'From power generation stations down to final loads',
      upstream: 'Upstream',
      downstream: 'Downstream',
      stageOf: 'Stage {current} of {total}',
    },
  },
};

export function t<K1 extends keyof TranslationDictionary, K2 extends keyof TranslationDictionary[K1]>(
  section: K1,
  key: K2,
  locale: Locale = 'fr'
): string {
  const dict = MESSAGES[locale] || MESSAGES.fr;
  return (dict[section]?.[key] as string) || '';
}

