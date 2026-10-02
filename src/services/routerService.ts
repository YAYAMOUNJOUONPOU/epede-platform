// src/services/routerService.ts
import type { DomainCode } from '../types/epede';
import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';
import type { SimulationTabType } from '../components/simulation/SimulationLabView';
import type { SldTopologyType } from '../components/diagrams/modules/SldHeaderToolbar';
import type { StageId } from '../components/journey/types';

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
  | 'asset-management';

export interface InjectedCalculatorContext {
  equipmentId?: string;
  equipmentName?: string;
  equipmentTag?: string;
  substationOrFeeder?: string;
  params?: Record<string, number | string>;
}

export interface RouteState {
  view: AppViewType;
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
}

/**
 * Parses current window.location.hash into structured RouteState
 */
export function parseRouteHash(hash: string): RouteState {
  const cleanHash = hash.replace(/^#\/?/, '').trim();
  if (!cleanHash || cleanHash === 'home') {
    return { view: 'home' };
  }

  const parts = cleanHash.split('/').map((p) => decodeURIComponent(p));
  const primary = parts[0];
  const secondary = parts[1];

  switch (primary) {
    case 'domains':
      return { view: 'domains' };

    case 'domain':
      if (secondary) {
        return {
          view: 'domain',
          domainCode: secondary.toUpperCase() as DomainCode,
        };
      }
      return { view: 'domains' };

    case 'equipment':
      if (secondary) {
        return {
          view: 'equipment',
          equipmentId: secondary,
        };
      }
      return { view: 'equipment-list' };

    case 'equipment-list':
      return { view: 'equipment-list' };

    case 'equipment-reference':
    case 'reference':
    case 'materiel':
      return {
        view: 'equipment-reference',
        equipmentId: secondary || undefined,
      };

    case 'roles':
      return {
        view: 'roles',
        roleSlug: secondary || 'protection-engineer',
      };

    case 'standards':
      return {
        view: 'standards',
        standardRef: secondary || 'IEC 60255',
      };

    case 'diagrams':
      return {
        view: 'diagrams',
        topology: (secondary as SldTopologyType) || undefined,
      };

    case 'simulation':
      return {
        view: 'simulation',
        simulationTab: (secondary as SimulationTabType) || undefined,
      };

    case 'calculators':
      return {
        view: 'calculators',
        calculatorTab: (secondary as CalculatorTabType) || undefined,
      };

    case 'journey':
      return {
        view: 'journey',
        journeyStage: (secondary as StageId) || undefined,
      };

    case 'context-stack':
      return {
        view: 'context-stack',
        contextNodeId: secondary || 'node-trafo-main-30',
      };

    case 'cameroon-grid':
    case 'demarcation':
    case 'multidisciplinary':
      return { 
        view: 'cameroon-grid',
        gridCategory: (secondary as any) || (primary === 'demarcation' || primary === 'multidisciplinary' ? 'demarcation' : undefined)
      };

    case 'regulatory':
      return { view: 'regulatory' };

    case 'lifecycle':
      return { view: 'lifecycle' };

    case 'phase2':
      return { view: 'phase2' };

    case 'hydropower':
      return { view: 'hydropower' };

    case 'industrial-projects':
      return { view: 'industrial-projects' };

    case 'engineers-chain':
    case 'ingenieurs-chaine':
    case 'engineers':
      return { view: 'engineers-chain' };

    case 'ecosystem':
    case 'energy-ecosystem':
    case '3d-ecosystem':
      return { view: 'ecosystem' };

    case 'architectures':
    case 'substation-architectures':
    case 'architecture-comparison':
      return { view: 'architectures' };

    case 'protection':
    case 'protection-workbench':
      return { view: 'protection' };

    case 'commissioning':
    case 'fat-sat':
      return { view: 'commissioning' };

    case 'knowledge-graph':
    case 'knowledge-graph-explorer':
    case 'kg':
      return {
        view: 'knowledge-graph',
        contextNodeId: secondary || undefined
      };

    case 'follow-the-energy':
    case 'energy-flow':
    case 'pipeline':
      return {
        view: 'follow-the-energy',
        contextNodeId: secondary || undefined
      };

    case 'scenarios':
    case 'incident-replay':
    case 'soe':
      return {
        view: 'scenarios',
        contextNodeId: secondary || undefined
      };

    case 'traceability':
    case 'provenance':
    case 'audit':
      return {
        view: 'traceability',
      };

    case 'thematic-journeys':
    case 'parcours':
    case 'learning-paths':
    case 'cursus':
      return {
        view: 'thematic-journeys',
        contextNodeId: secondary || undefined,
      };

    case 'asset-management':
    case 'assets':
    case 'dga':
    case 'dga-diagnostics':
    case 'duval':
    case 'health-index':
    case 'fleet-risk':
      return {
        view: 'asset-management',
        assetPillar: secondary || (primary === 'dga' || primary === 'duval' || primary === 'dga-diagnostics' ? 'DUVAL_TRIANGLE_DGA' : primary === 'health-index' ? 'HEALTH_INDEX_ISO55000' : primary === 'fleet-risk' ? 'FLEET_RISK_MATRIX' : undefined),
      };

    default:
      return { view: 'home' };
  }
}

/**
 * Builds hash string from a route state
 */
export function buildRouteHash(state: RouteState): string {
  switch (state.view) {
    case 'home':
      return '#/';
    case 'domains':
      return '#/domains';
    case 'domain':
      return state.domainCode ? `#/domain/${state.domainCode}` : '#/domains';
    case 'equipment-list':
      return '#/equipment';
    case 'equipment-reference':
      return state.equipmentId ? `#/equipment-reference/${encodeURIComponent(state.equipmentId)}` : '#/equipment-reference';
    case 'equipment':
      return state.equipmentId ? `#/equipment/${encodeURIComponent(state.equipmentId)}` : '#/equipment';
    case 'roles':
      return state.roleSlug ? `#/roles/${encodeURIComponent(state.roleSlug)}` : '#/roles';
    case 'standards':
      return state.standardRef ? `#/standards/${encodeURIComponent(state.standardRef)}` : '#/standards';
    case 'diagrams':
      return state.topology ? `#/diagrams/${encodeURIComponent(state.topology)}` : '#/diagrams';
    case 'simulation':
      return state.simulationTab ? `#/simulation/${encodeURIComponent(state.simulationTab)}` : '#/simulation';
    case 'calculators':
      return state.calculatorTab ? `#/calculators/${encodeURIComponent(state.calculatorTab)}` : '#/calculators';
    case 'journey':
      return state.journeyStage ? `#/journey/${encodeURIComponent(state.journeyStage)}` : '#/journey';
    case 'context-stack':
      return state.contextNodeId ? `#/context-stack/${encodeURIComponent(state.contextNodeId)}` : '#/context-stack';
    case 'cameroon-grid':
      return state.gridCategory ? `#/cameroon-grid/${encodeURIComponent(state.gridCategory)}` : '#/cameroon-grid';
    case 'regulatory':
      return '#/regulatory';
    case 'lifecycle':
      return '#/lifecycle';
    case 'phase2':
      return '#/phase2';
    case 'hydropower':
      return '#/hydropower';
    case 'industrial-projects':
      return '#/industrial-projects';
    case 'engineers-chain':
      return '#/engineers-chain';
    case 'ecosystem':
      return '#/ecosystem';
    case 'architectures':
      return '#/architectures';
    case 'protection':
      return '#/protection';
    case 'commissioning':
      return '#/commissioning';
    case 'knowledge-graph':
      return state.contextNodeId ? `#/knowledge-graph/${encodeURIComponent(state.contextNodeId)}` : '#/knowledge-graph';
    case 'follow-the-energy':
      return '#/follow-the-energy';
    case 'scenarios':
      return state.contextNodeId ? `#/scenarios/${encodeURIComponent(state.contextNodeId)}` : '#/scenarios';
    case 'traceability':
      return '#/traceability';
    case 'thematic-journeys':
      return state.contextNodeId ? `#/thematic-journeys/${encodeURIComponent(state.contextNodeId)}` : '#/thematic-journeys';
    default:
      return '#/';
  }
}

/**
 * Generates an engineering-grade HTML Document title based on current route & locale
 */
export function getDocumentTitle(state: RouteState, locale: 'fr' | 'en'): string {
  const base = 'EPEDE — Electrical Power Engineering Digital Environment';

  switch (state.view) {
    case 'asset-management':
      return locale === 'fr' ? 'Station Expert Gestion d\'Actifs & Diagnostic DGA | EPEDE' : 'Asset Management & DGA Diagnostics | EPEDE';
    case 'thematic-journeys':
      return locale === 'fr'
        ? 'Parcours Guidés Thématiques (7 Cursus d\'Ingénierie) | EPEDE'
        : 'Thematic Guided Learning Journeys | EPEDE';
    case 'traceability':
      return locale === 'fr'
        ? 'Couche de Données Fiables & Audit de Traçabilité | EPEDE'
        : 'Trustworthy Data & Provenance Registry | EPEDE';
    case 'scenarios':
      return locale === 'fr'
        ? 'Scénarios Pédagogiques & Incident Replay SCADA | EPEDE'
        : 'Pedagogical Scenarios & SCADA Incident Replay | EPEDE';
    case 'follow-the-energy':
      return locale === 'fr'
        ? 'Follow the Energy — Pipeline 8 Étapes & 4 Flux Cyber-Physiques | EPEDE'
        : 'Follow the Energy — 8-Stage Pipeline & 4 Cyber-Physical Flows | EPEDE';
    case 'knowledge-graph':
      return locale === 'fr'
        ? 'Knowledge Graph Explorer — Relations, Protections & Causalité | EPEDE'
        : 'Knowledge Graph Explorer — Relations, Protections & Causality | EPEDE';
    case 'ecosystem':
      return locale === 'fr'
        ? 'Écosystème Énergétique 3D — De la Source au Travail Utile | EPEDE'
        : 'The Electrical Energy Ecosystem — From Energy Source to Useful Work | EPEDE';
    case 'protection':
      return locale === 'fr'
        ? 'Atelier de Protection Électrique & Plan R-X / TCC (CEI 60255) | EPEDE'
        : 'Protection Engineering Workbench & R-X / TCC (IEC 60255) | EPEDE';
    case 'commissioning':
      return locale === 'fr'
        ? 'Atelier Essais & Réception FAT / SAT (CEI 61439 / CEI 60364) | EPEDE'
        : 'FAT / SAT Commissioning & Testing Workbench | EPEDE';
    case 'home':
      return base;
    case 'domains':
      return locale === 'fr' 
        ? 'Architecture des 16 Domaines Électriques | EPEDE' 
        : '16 Electrical System Domains Architecture | EPEDE';
    case 'domain':
      return locale === 'fr' 
        ? `Domaine ${state.domainCode || ''} · Station d'Ingénierie | EPEDE` 
        : `Domain ${state.domainCode || ''} · Engineering Station | EPEDE`;
    case 'equipment-list':
    case 'equipment':
      return locale === 'fr' 
        ? `Appareillage & Catalogue Équipements (${state.equipmentId || ''}) | EPEDE` 
        : `Switchgear & Equipment Catalog (${state.equipmentId || ''}) | EPEDE`;
    case 'equipment-reference':
      return locale === 'fr'
        ? `Référence Matériel Électrique Réel (${state.equipmentId || 'Index Chaîne'}) | EPEDE`
        : `Real-World Electrical Equipment Reference (${state.equipmentId || 'Chain Index'}) | EPEDE`;
    case 'diagrams':
      return locale === 'fr' 
        ? 'Schéma Unifilaire Interactif SLD 225/30 kV | EPEDE' 
        : '225/30 kV Interactive Single-Line Diagram | EPEDE';
    case 'calculators':
      return locale === 'fr' 
        ? `Calculateurs d'Ingénierie (${state.calculatorTab || 'Index'}) | EPEDE` 
        : `Engineering Calculators (${state.calculatorTab || 'Index'}) | EPEDE`;
    case 'simulation':
      return locale === 'fr' 
        ? `Laboratoire de Simulation Réseau (${state.simulationTab || ''}) | EPEDE` 
        : `Power Grid Simulation Lab (${state.simulationTab || ''}) | EPEDE`;
    case 'journey':
      return locale === 'fr' 
        ? 'Les 13 Scènes de la Continuité Électrique | EPEDE' 
        : '13-Scene Continuous Power Journey | EPEDE';
    case 'hydropower':
      return locale === 'fr' 
        ? 'Station d\'Ingénierie Hydroélectrique & PSH | EPEDE' 
        : 'Hydropower Engineering & PSH Station | EPEDE';
    case 'cameroon-grid':
      return locale === 'fr' 
        ? 'Modèle Réseau HTB Cameroun (RIS & RIN) | EPEDE' 
        : 'Cameroon HV Grid Digital Model (RIS & RIN) | EPEDE';
    case 'standards':
      return locale === 'fr' 
        ? `Référentiel Normatif International (${state.standardRef || ''}) | EPEDE` 
        : `International Standards Repository (${state.standardRef || ''}) | EPEDE`;
    case 'roles':
      return locale === 'fr' 
        ? `Métiers & Ingénieurs Spécialistes (${state.roleSlug || ''}) | EPEDE` 
        : `Engineering Disciplines & Roles (${state.roleSlug || ''}) | EPEDE`;
    case 'industrial-projects':
      return locale === 'fr' 
        ? 'Projets Industriels & Cas d\'Ingénierie Terrain | EPEDE' 
        : 'Industrial Projects & Field Engineering Cases | EPEDE';
    case 'engineers-chain':
      return locale === 'fr'
        ? 'Les Ingénieurs de la Chaîne Électrique (35+ Profils) | EPEDE'
        : 'Engineers Across the Power Chain (35+ Roles) | EPEDE';
    case 'context-stack':
      return locale === 'fr' 
        ? 'Graphe Canonique Système & Continuité d\'Énergie | EPEDE' 
        : 'Canonical System Graph & Energy Continuity | EPEDE';
    case 'regulatory':
      return locale === 'fr' 
        ? 'Cadre Réglementaire & Grid Code | EPEDE' 
        : 'Regulatory Framework & Grid Code | EPEDE';
    case 'lifecycle':
      return locale === 'fr' 
        ? 'Cycle de Vie d\'un Projet Électrique | EPEDE' 
        : 'Electrical Project Lifecycle | EPEDE';
    default:
      return base;
  }
}
