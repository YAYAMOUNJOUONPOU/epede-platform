// src/services/routerService.ts
// EPEDE - Authoritative Bilingual Router Engine (FR / EN with Legacy Redirects & 404)

import type { DomainCode } from '../types/epede';
import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';
import type { SimulationTabType } from '../components/simulation/SimulationLabView';
import type { SldTopologyType } from '../components/diagrams/modules/SldHeaderToolbar';
import type { StageId } from '../components/journey/types';
import { favoritesAndHistoryService } from './favoritesAndHistoryService';

export type AppViewType =
  | 'home'
  | 'domain'
  | 'domains'
  | 'equipment'
  | 'equipment-list'
  | 'equipment-reference'
  | 'roles'
  | 'standards'
  | 'diagrams'
  | 'simulation'
  | 'calculators'
  | 'phase2'
  | 'lifecycle'
  | 'cameroon-grid'
  | 'regulatory'
  | 'journey'
  | 'context-stack'
  | 'hydropower'
  | 'industrial-projects'
  | 'engineers-chain'
  | 'ecosystem'
  | 'architectures'
  | 'protection'
  | 'commissioning'
  | 'knowledge-graph'
  | 'follow-the-energy'
  | 'scenarios'
  | 'traceability'
  | 'thematic-journeys'
  | 'asset-management'
  | 'glossary'
  | 'laboratory'
  | 'reference-hub'
  | 'about'
  | 'not-found';

export interface InjectedCalculatorContext {
  equipmentId?: string;
  equipmentName?: string;
  equipmentTag?: string;
  substationOrFeeder?: string;
  params?: Record<string, any>;
}

export interface RouteState {
  view: AppViewType;
  lang?: 'fr' | 'en';
  domainCode?: DomainCode;
  equipmentId?: string;
  roleSlug?: string;
  standardRef?: string;
  calculatorTab?: CalculatorTabType;
  calculatorContext?: InjectedCalculatorContext;
  simulationTab?: SimulationTabType;
  topology?: SldTopologyType;
  journeyStage?: StageId;
  contextNodeId?: string;
  gridCategory?: 'map' | 'all' | 'ris' | 'rin' | 'plants' | 'substations' | 'lines' | 'demarcation';
  assetPillar?: string;
  rawPath?: string;
}

export const CALCULATOR_SLUGS_FR_TO_TAB: Record<string, CalculatorTabType> = {
  'chute-de-tension': 'voltage-drop',
  'court-circuit-cable': 'cable-short-circuit',
  'bilan-puissance': 'load-schedule',
  'puissance-triphase': 'power',
  'transformateur': 'transformer',
  'court-circuit': 'transformer',
  'moteur': 'motor',
  'sil': 'sil',
  'mise-a-la-terre': 'earthing',
  'arc-flash': 'arc-flash',
  'arc-electrique': 'arc-flash',
  'transformateur-courant': 'ct-sizing',
  'tc-mesure': 'ct-sizing',
  'compensation-reactive': 'pfc',
  'solaire': 'solar-sizing',
  'stockage': 'bess-sizing',
  'bess-batteries': 'bess-sizing',
  'parafoudre': 'surge-arrester',
  'jeu-de-barres': 'busbar-electrodynamic',
  'courant-admissible-cable': 'cable-ampacity',
  'ligne-transport': 'transmission-line',
  'regime-neutre': 'neutral-grounding',
  'coordination-relais': 'relay-tcc',
};

export const CALCULATOR_TAB_TO_SLUG_FR: Record<CalculatorTabType, string> = {
  'voltage-drop': 'chute-de-tension',
  'cable-short-circuit': 'court-circuit-cable',
  'load-schedule': 'bilan-puissance',
  'power': 'puissance-triphase',
  'transformer': 'transformateur',
  'motor': 'moteur',
  'sil': 'sil',
  'earthing': 'mise-a-la-terre',
  'arc-flash': 'arc-electrique',
  'ct-sizing': 'transformateur-courant',
  'pfc': 'compensation-reactive',
  'solar-sizing': 'solaire',
  'bess-sizing': 'stockage',
  'surge-arrester': 'parafoudre',
  'busbar-electrodynamic': 'jeu-de-barres',
  'cable-ampacity': 'courant-admissible-cable',
  'transmission-line': 'ligne-transport',
  'neutral-grounding': 'regime-neutre',
  'relay-tcc': 'coordination-relais',
};

/**
 * Parses current window.location.hash into structured RouteState
 * Supports:
 * - French canonical URLs by default: #/calculateurs/chute-de-tension
 * - English URLs under #/en/...: #/en/calculators/voltage-drop
 * - Decodes shareable calculation query data (?data=...)
 * - Legacy alias redirects (#/journey, #/simulation, #/standards...)
 * - 404 fallback for invalid routes
 */
export function parseRouteHash(hash: string): RouteState {
  const cleanRaw = hash.replace(/^#\/?/, '').trim();
  if (!cleanRaw || cleanRaw === 'home') {
    return { view: 'home', lang: 'fr' };
  }

  // Extract query parameters if any (e.g. ?data=... or ?p=...)
  const [routePart, queryPart] = cleanRaw.split('?');
  let decodedParams: Record<string, any> | undefined;
  if (queryPart) {
    const qParams = new URLSearchParams(queryPart);
    const dataEncoded = qParams.get('data') || qParams.get('p');
    if (dataEncoded) {
      decodedParams = favoritesAndHistoryService.decodeCalculationParams(dataEncoded) || undefined;
    }
  }

  let parts = routePart.split('/').map((p) => decodeURIComponent(p));
  let detectedLang: 'fr' | 'en' = 'fr';

  // Check language prefix #/en/...
  if (parts[0] === 'en') {
    detectedLang = 'en';
    parts.shift();
  }

  const primary = parts[0]?.toLowerCase() || '';
  const secondary = parts[1];

  const calcContext: InjectedCalculatorContext | undefined = decodedParams
    ? { params: decodedParams }
    : undefined;

  switch (primary) {
    // 1. HOME
    case '':
    case 'home':
    case 'accueil':
      return { view: 'home', lang: detectedLang };

    // 2. LEARN / POWER CHAIN (Apprendre / Chaîne de Puissance / Journey)
    case 'apprendre':
    case 'learn':
    case 'chaine-puissance':
    case 'power-chain':
    case 'journey':
      return {
        view: 'journey',
        lang: detectedLang,
        journeyStage: (secondary as StageId) || undefined,
      };

    // 3. CALCULATORS
    case 'calculateurs':
    case 'calculators':
    case 'calcul':
      if (secondary) {
        const secLower = secondary.toLowerCase();
        const tab = CALCULATOR_SLUGS_FR_TO_TAB[secLower] || (secLower as CalculatorTabType);
        return {
          view: 'calculators',
          lang: detectedLang,
          calculatorTab: tab,
          calculatorContext: calcContext,
        };
      }
      return { view: 'calculators', lang: detectedLang, calculatorContext: calcContext };

    // 4. EQUIPMENT (Matériel / Catalogue / Référence)
    case 'materiel':
    case 'equipment':
    case 'equipement':
    case 'equipements':
    case 'reference':
    case 'catalogue':
      if (secondary) {
        return {
          view: 'equipment',
          lang: detectedLang,
          equipmentId: secondary,
        };
      }
      return { view: 'equipment-list', lang: detectedLang };

    case 'equipment-reference':
      return {
        view: 'equipment-reference',
        lang: detectedLang,
        equipmentId: secondary || undefined,
      };

    // 5. DOMAINS (16 Domaines Électriques)
    case 'domaines':
    case 'domains':
    case 'domaine':
    case 'domain':
      if (secondary) {
        return {
          view: 'domain',
          lang: detectedLang,
          domainCode: secondary.toUpperCase() as DomainCode,
        };
      }
      return { view: 'domains', lang: detectedLang };

    // 6. CAMEROON GRID OBSERVATORY
    case 'reseau-cameroun':
    case 'cameroon-grid':
    case 'cameroun':
    case 'demarcation':
    case 'multidisciplinary':
      return {
        view: 'cameroon-grid',
        lang: detectedLang,
        gridCategory: (secondary as any) || (primary === 'demarcation' || primary === 'multidisciplinary' ? 'demarcation' : undefined),
      };

    // TECHNICAL REFERENCE HUB (Espace Centralisé de Référence Technique)
    case 'centre-reference':
    case 'reference-hub':
    case 'reference-technique':
    case 'hub':
      return {
        view: 'reference-hub',
        lang: detectedLang,
      };

    // 7. LABORATOIRE (Consolidated Laboratory Portal)
    case 'laboratoire':
    case 'laboratory':
    case 'lab':
      return {
        view: 'laboratory',
        lang: detectedLang,
        simulationTab: (secondary as SimulationTabType) || undefined,
      };

    // Legacy Simulation routes redirect to laboratory or simulation
    case 'simulation':
      return {
        view: 'simulation',
        lang: detectedLang,
        simulationTab: (secondary as SimulationTabType) || undefined,
      };

    case 'diagrams':
    case 'sld':
    case 'unifilaire':
      return {
        view: 'diagrams',
        lang: detectedLang,
        topology: (secondary as SldTopologyType) || undefined,
      };

    // 8. STANDARDS
    case 'normes':
    case 'standards':
    case 'norme':
    case 'standard':
      return {
        view: 'standards',
        lang: detectedLang,
        standardRef: secondary || undefined,
      };

    // 9. GLOSSARY
    case 'glossaire':
    case 'glossary':
    case 'termes':
    case 'acronymes':
      return {
        view: 'glossary',
        lang: detectedLang,
      };

    // 10. ABOUT
    case 'a-propos':
    case 'about':
    case 'auteur':
    case 'author':
      return {
        view: 'about',
        lang: detectedLang,
      };

    // Other secondary views with backward compatibility
    case 'roles':
    case 'metiers':
      return { view: 'roles', lang: detectedLang, roleSlug: secondary || 'protection-engineer' };

    case 'context-stack':
      return { view: 'context-stack', lang: detectedLang, contextNodeId: secondary || 'node-trafo-main-30' };

    case 'regulatory':
    case 'reglementation':
      return { view: 'regulatory', lang: detectedLang };

    case 'lifecycle':
    case 'cycle-de-vie':
      return { view: 'lifecycle', lang: detectedLang };

    case 'hydropower':
    case 'hydro':
      return { view: 'hydropower', lang: detectedLang };

    case 'industrial-projects':
    case 'projets':
      return { view: 'industrial-projects', lang: detectedLang };

    case 'engineers-chain':
    case 'ingenieurs':
      return { view: 'engineers-chain', lang: detectedLang };

    case 'ecosystem':
    case 'ecosysteme':
      return { view: 'ecosystem', lang: detectedLang };

    case 'architectures':
      return { view: 'architectures', lang: detectedLang };

    case 'protection':
    case 'protections':
      return { view: 'protection', lang: detectedLang };

    case 'commissioning':
    case 'essais':
      return { view: 'commissioning', lang: detectedLang };

    case 'knowledge-graph':
      return { view: 'knowledge-graph', lang: detectedLang, contextNodeId: secondary || undefined };

    case 'follow-the-energy':
      return { view: 'follow-the-energy', lang: detectedLang };

    case 'scenarios':
      return { view: 'scenarios', lang: detectedLang, contextNodeId: secondary || undefined };

    case 'thematic-journeys':
      return { view: 'thematic-journeys', lang: detectedLang, contextNodeId: secondary || undefined };

    case 'asset-management':
    case 'maintenance':
      return { view: 'asset-management', lang: detectedLang, assetPillar: secondary || undefined };

    // 404 FALLBACK
    default:
      return {
        view: 'not-found',
        lang: detectedLang,
        rawPath: cleanRaw,
      };
  }
}

/**
 * Builds hash string from a route state conforming to:
 * - French by default: #/calculateurs/chute-de-tension
 * - English if state.lang === 'en': #/en/calculators/voltage-drop
 */
export function buildRouteHash(state: RouteState, localeOverride?: 'fr' | 'en'): string {
  const isEn = (localeOverride || state.lang) === 'en';
  const prefix = isEn ? '#/en' : '#';

  switch (state.view) {
    case 'home':
      return isEn ? '#/en/' : '#/';

    case 'journey':
      const journeyBase = isEn ? `${prefix}/power-chain` : `${prefix}/chaine-puissance`;
      return state.journeyStage ? `${journeyBase}/${encodeURIComponent(state.journeyStage)}` : journeyBase;

    case 'calculators':
      const calcBase = isEn ? `${prefix}/calculators` : `${prefix}/calculateurs`;
      if (state.calculatorTab) {
        const slug = isEn ? state.calculatorTab : (CALCULATOR_TAB_TO_SLUG_FR[state.calculatorTab] || state.calculatorTab);
        return `${calcBase}/${encodeURIComponent(slug)}`;
      }
      return calcBase;

    case 'equipment-list':
      return isEn ? `${prefix}/equipment` : `${prefix}/materiel`;

    case 'equipment':
      const eqBase = isEn ? `${prefix}/equipment` : `${prefix}/materiel`;
      return state.equipmentId ? `${eqBase}/${encodeURIComponent(state.equipmentId)}` : eqBase;

    case 'equipment-reference':
      const refBase = isEn ? `${prefix}/equipment-reference` : `${prefix}/materiel`;
      return state.equipmentId ? `${refBase}/${encodeURIComponent(state.equipmentId)}` : refBase;

    case 'domains':
      return isEn ? `${prefix}/domains` : `${prefix}/domaines`;

    case 'domain':
      const domBase = isEn ? `${prefix}/domains` : `${prefix}/domaines`;
      return state.domainCode ? `${domBase}/${state.domainCode}` : domBase;

    case 'cameroon-grid':
      const gridBase = isEn ? `${prefix}/cameroon-grid` : `${prefix}/reseau-cameroun`;
      return state.gridCategory ? `${gridBase}/${encodeURIComponent(state.gridCategory)}` : gridBase;

    case 'laboratory':
      const labBase = isEn ? `${prefix}/laboratory` : `${prefix}/laboratoire`;
      return state.simulationTab ? `${labBase}/${encodeURIComponent(state.simulationTab)}` : labBase;

    case 'standards':
      const stdBase = isEn ? `${prefix}/standards` : `${prefix}/normes`;
      return state.standardRef ? `${stdBase}/${encodeURIComponent(state.standardRef)}` : stdBase;

    case 'glossary':
      return isEn ? `${prefix}/glossary` : `${prefix}/glossaire`;

    case 'reference-hub':
      return isEn ? `${prefix}/reference-hub` : `${prefix}/centre-reference`;

    case 'about':
      return isEn ? `${prefix}/about` : `${prefix}/a-propos`;

    case 'simulation':
      return state.simulationTab ? `#/simulation/${encodeURIComponent(state.simulationTab)}` : '#/simulation';

    case 'diagrams':
      return state.topology ? `#/diagrams/${encodeURIComponent(state.topology)}` : '#/diagrams';

    case 'not-found':
      return '#/404';

    default:
      return isEn ? '#/en/' : '#/';
  }
}

/**
 * Generates an engineering-grade HTML Document title based on current route & locale
 */
export function getDocumentTitle(state: RouteState, locale: 'fr' | 'en'): string {
  const base = 'EPEDE — Electrical Power Engineering Digital Environment';
  const isFr = locale === 'fr';

  switch (state.view) {
    case 'home':
      return base;
    case 'journey':
      return isFr
        ? 'La Chaîne de Continuité Électrique — Du Barrage à la Prise | EPEDE'
        : 'The Power Continuity Chain — From Generation to Load | EPEDE';
    case 'calculators':
      return isFr
        ? `Calculateurs d'Ingénierie (${state.calculatorTab || 'Index'}) | EPEDE`
        : `Engineering Precision Calculators (${state.calculatorTab || 'Index'}) | EPEDE`;
    case 'equipment-list':
    case 'equipment':
    case 'equipment-reference':
      return isFr
        ? `Référentiel Matériels Électriques Réels (${state.equipmentId || 'Catalogue'}) | EPEDE`
        : `Real-World Electrical Equipment Reference (${state.equipmentId || 'Catalog'}) | EPEDE`;
    case 'domains':
    case 'domain':
      return isFr
        ? `Architecture des 16 Domaines Électriques (${state.domainCode || 'Index'}) | EPEDE`
        : `16 Electrical Engineering Domains (${state.domainCode || 'Index'}) | EPEDE`;
    case 'cameroon-grid':
      return isFr
        ? 'Observatoire du Réseau Électrique Camerounais (RIS & RIN 2050 MW) | EPEDE'
        : 'Cameroon Power System Observatory (2,050 MW Grid Model) | EPEDE';
    case 'laboratory':
    case 'simulation':
      return isFr
        ? `Laboratoire Virtuel & Ateliers de Simulation (${state.simulationTab || 'Index'}) | EPEDE`
        : `Virtual Power System Lab & Workbenches (${state.simulationTab || 'Index'}) | EPEDE`;
    case 'reference-hub':
      return isFr
        ? 'Centre de Référence Technique & Calculs Électrotechniques | EPEDE'
        : 'Technical Reference Hub & Power Engineering Solvers | EPEDE';
    case 'standards':
      return isFr
        ? `Référentiel Normatif International (${state.standardRef || 'CEI / IEEE'}) | EPEDE`
        : `International Standards Repository (${state.standardRef || 'IEC / IEEE'}) | EPEDE`;
    case 'glossary':
      return isFr
        ? 'Glossaire Technique Électrotechnique Bilingue (CEI 60050 / IEV) | EPEDE'
        : 'Bilingual Electrotechnical Engineering Glossary (IEC 60050) | EPEDE';
    case 'about':
      return isFr
        ? 'À Propos de l\'Auteur & Mission d\'Ingénierie | EPEDE'
        : 'About the Author & Engineering Mission | EPEDE';
    case 'not-found':
      return isFr ? '404 · Circuit Introuvable | EPEDE' : '404 · Route Not Found | EPEDE';
    default:
      return base;
  }
}
