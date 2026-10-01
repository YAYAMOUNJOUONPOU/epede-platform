// src/components/equipment/EquipmentDetailView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { EQUIPMENT_ITEMS, RELATION_EDGES } from '../../data/epedeData';
import { SafetyBadge } from './SafetyBadge';
import { ProvenanceBadge } from './ProvenanceBadge';
import { ApparatusComplianceBadge } from './ApparatusComplianceBadge';
import { EdgeGraph } from './EdgeGraph';
import { VoltageIndicator } from '../ui/VoltageIndicator';
import { ArrowLeft, Scale, Zap, ShieldAlert, Cpu, Layers, FileText, Calculator, Bookmark, Check } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import type { DomainCode, Equipment, Edge } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { EquipmentRatingsTable } from './modules/EquipmentRatingsTable';
import { EquipmentOperatingRegimeCard } from './modules/EquipmentOperatingRegimeCard';
import { EquipmentEngineeringDossierTabs } from './modules/EquipmentEngineeringDossierTabs';
import { EquipmentProfessionalIntelligenceLayer } from './modules/EquipmentProfessionalIntelligenceLayer';
import { EquipmentDossierViewer } from './modules/EquipmentDossierViewer';
import { UniversalEquipmentFiche } from './UniversalEquipmentFiche';
import { EquipmentCutawaySchematicViewer } from './modules/EquipmentCutawaySchematicViewer';
import { EquipmentTraceabilityTree } from './modules/EquipmentTraceabilityTree';
import { EquipmentCalculationBridge } from './EquipmentCalculationBridge';
import { EngineeringContextStack } from '../common/EngineeringContextStack';
import { resolveCanonicalEquipment } from '../../data/equipment/canonicalEquipmentRegistry';
import { AasSubmodelViewer } from '../digitaltwin/AasSubmodelViewer';
import { epedeApi, ApiEquipmentDto, GraphContextDto } from '../../services/epedeApiClient';
import { getDocumentsForEquipment } from '../../data/epedeDocumentationRegistry';
import { getPhotographsForEquipment } from '../../data/equipmentPhotographicRegistry';
import { EquipmentPhotographicGallery } from './modules/EquipmentPhotographicGallery';
import { GlobalBreadcrumbs } from '../common/GlobalBreadcrumbs';
import { EpedeDocumentDetailModal } from '../docs/EpedeDocumentDetailModal';
import type { EpedeDocumentRecord } from '../../types/filesAndDocs';
import { FolderOpen } from 'lucide-react';
import { 
  EngineeringRelationshipTraceCard, 
  RoleExplorationToolbar, 
  ObjectRelationshipActionBar, 
  SystemBoundaryCard 
} from '../context';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface EquipmentDetailViewProps {
  equipmentId: string;
  locale: 'fr' | 'en';
  onBack: () => void;
  onNavigateDomain: (code: DomainCode) => void;
  onNavigateEquipment: (id: string) => void;
  onCompareEquipment?: (id: string) => void;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateStandard?: (ref: string) => void;
}

export const EquipmentDetailView: React.FC<EquipmentDetailViewProps> = ({
  equipmentId,
  locale,
  onBack,
  onNavigateDomain,
  onNavigateEquipment,
  onCompareEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateContextStack,
  onNavigateStandard,
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'universal_fiche' | 'dossier_30_sections' | 'aas_v3_shell' | 'engineering_calculation' | 'documentation'>('overview');
  const [apiEquipment, setApiEquipment] = useState<ApiEquipmentDto | null>(null);
  const [graphContext, setGraphContext] = useState<GraphContextDto | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState<boolean>(false);
  const [selectedDocModal, setSelectedDocModal] = useState<EpedeDocumentRecord | null>(null);
  const { user, isBookmarked, addBookmark, removeBookmark, signInWithGoogle, bookmarks } = useAuth();

  const equipmentDocs = useMemo(() => {
    return getDocumentsForEquipment(equipmentId);
  }, [equipmentId]);

  useEffect(() => {
    let active = true;
    setIsLoadingGraph(true);
    Promise.all([
      epedeApi.getEquipmentById(equipmentId),
      epedeApi.getGraphContext(equipmentId),
    ])
      .then(([eq, ctx]) => {
        if (!active) return;
        if (eq) setApiEquipment(eq);
        if (ctx) setGraphContext(ctx);
        setIsLoadingGraph(false);
      })
      .catch((err) => {
        console.warn('Backend equipment sync error:', err);
        if (active) setIsLoadingGraph(false);
      });
    return () => {
      active = false;
    };
  }, [equipmentId]);

  const canonicalEquipment = resolveCanonicalEquipment(equipmentId);

  // Exact match from legacy equipment or dynamic synthesis from canonical 37-dimension object or API
  const matchedLegacyEquipment = EQUIPMENT_ITEMS.find((eq) => eq.id === equipmentId);

  const equipment: Equipment = matchedLegacyEquipment || (canonicalEquipment ? {
    id: canonicalEquipment.id,
    domain_id: canonicalEquipment.parentDomain || 'D04',
    domain_code: (canonicalEquipment.parentDomain as DomainCode) || 'D04',
    entity_type: canonicalEquipment.equipmentType || 'SubstationApparatus',
    name_fr: canonicalEquipment.name.fr,
    name_en: canonicalEquipment.name.en,
    aliases_fr: canonicalEquipment.aliases.fr,
    aliases_en: canonicalEquipment.aliases.en,
    description_fr: canonicalEquipment.purpose?.fr || canonicalEquipment.definition?.fr || '',
    description_en: canonicalEquipment.purpose?.en || canonicalEquipment.definition?.en || '',
    function_fr: canonicalEquipment.primaryFunction?.fr || '',
    function_en: canonicalEquipment.primaryFunction?.en || '',
    typical_location_fr: canonicalEquipment.typicalLocation?.fr || 'Poste 225 kV',
    typical_location_en: canonicalEquipment.typicalLocation?.en || '225 kV Substation',
    voltage_level: 'HV',
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    technical: canonicalEquipment.keyEngineeringValues.reduce((acc, v) => {
      const labelStr = typeof v.label === 'string' ? v.label : (v.label[locale] || v.label.fr || v.key);
      acc[labelStr] = `${v.value} ${v.unit}`;
      return acc;
    }, {} as Record<string, string | number | boolean>),
    provenance: canonicalEquipment.provenance as any
  } : (apiEquipment ? {
    id: apiEquipment.id,
    domain_id: apiEquipment.domainId,
    domain_code: (apiEquipment.domainId as DomainCode) || 'D04',
    entity_type: apiEquipment.type,
    name_fr: apiEquipment.name.fr,
    name_en: apiEquipment.name.en,
    aliases_fr: [apiEquipment.tag || apiEquipment.id],
    aliases_en: [apiEquipment.tag || apiEquipment.id],
    description_fr: apiEquipment.primaryFunction?.fr || '',
    description_en: apiEquipment.primaryFunction?.en || '',
    function_fr: apiEquipment.primaryFunction?.fr || '',
    function_en: apiEquipment.primaryFunction?.en || '',
    typical_location_fr: apiEquipment.voltageNominal || 'Poste Électrique',
    typical_location_en: apiEquipment.voltageNominal || 'Substation',
    voltage_level: apiEquipment.voltageNominal?.includes('225') ? 'HV' : 'MV',
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    technical: Object.entries(apiEquipment.specifications || {}).reduce((acc, [k, v]) => {
      acc[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
      return acc;
    }, {} as Record<string, string | number | boolean>),
    provenance: {
      id: 'prov-api',
      entity_id: apiEquipment.id,
      entity_type: 'equipment',
      source_ref: 'EPEDE Canonical Knowledge Graph',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Power Engineering Engine',
      verified_at: '2026-09-17',
      notes: 'Grounded in API v1 Graph and IEC/SONATREL topology'
    }
  } : EQUIPMENT_ITEMS[0]));

  const relatedEdges = RELATION_EDGES.filter(
    (e) => e.source_id === equipment.id || e.target_id === equipment.id
  );

  const dynamicEdgesFromGraph = useMemo(() => {
    if (!graphContext) return [];
    const dyn: Edge[] = [];
    const seenEdgeIds = new Set(relatedEdges.map((e) => e.id));

    // Upstream sources
    for (const up of graphContext.upstream) {
      if (!seenEdgeIds.has(up.relationship.id)) {
        seenEdgeIds.add(up.relationship.id);
        dyn.push({
          id: up.relationship.id,
          source_id: up.equipment?.id || up.relationship.sourceId,
          source_name: up.equipment?.name[locale] || up.relationship.sourceId,
          target_id: equipment.id,
          target_name: locale === 'fr' ? equipment.name_fr : equipment.name_en,
          source_type: 'equipment',
          target_type: 'equipment',
          relation: 'feeds',
          direction: 'out',
          notes_fr: up.relationship.description?.fr || 'Alimentation amont',
          notes_en: up.relationship.description?.en || 'Upstream feeding source',
        });
      }
    }

    // Downstream feeds
    for (const down of graphContext.downstream) {
      if (!seenEdgeIds.has(down.relationship.id)) {
        seenEdgeIds.add(down.relationship.id);
        dyn.push({
          id: down.relationship.id,
          source_id: equipment.id,
          source_name: locale === 'fr' ? equipment.name_fr : equipment.name_en,
          target_id: down.equipment?.id || down.relationship.targetId,
          target_name: down.equipment?.name[locale] || down.relationship.targetId,
          source_type: 'equipment',
          target_type: 'equipment',
          relation: 'supplies',
          direction: 'out',
          notes_fr: down.relationship.description?.fr || 'Alimentation aval',
          notes_en: down.relationship.description?.en || 'Downstream outgoer',
        });
      }
    }

    // Protections
    for (const p of graphContext.protections) {
      if (!seenEdgeIds.has(p.relationship.id)) {
        seenEdgeIds.add(p.relationship.id);
        dyn.push({
          id: p.relationship.id,
          source_id: p.equipment?.id || p.relationship.sourceId,
          source_name: p.equipment?.name[locale] || p.relationship.sourceId,
          target_id: equipment.id,
          target_name: locale === 'fr' ? equipment.name_fr : equipment.name_en,
          source_type: 'equipment',
          target_type: 'equipment',
          relation: 'protects',
          direction: 'out',
          notes_fr: p.relationship.description?.fr || 'Appareil de protection associé',
          notes_en: p.relationship.description?.en || 'Associated protection equipment',
        });
      }
    }

    // Standards
    for (const s of graphContext.standards) {
      if (!seenEdgeIds.has(s.relationship.id)) {
        seenEdgeIds.add(s.relationship.id);
        const code = s.standard?.code || s.relationship.targetId;
        dyn.push({
          id: s.relationship.id,
          source_id: equipment.id,
          source_name: locale === 'fr' ? equipment.name_fr : equipment.name_en,
          target_id: code,
          target_name: s.standard?.title?.[locale] ? `${code} - ${s.standard.title[locale]}` : code,
          source_type: 'equipment',
          target_type: 'standard',
          relation: 'governed_by',
          direction: 'out',
          notes_fr: s.relationship.description?.fr || 'Norme CEI de conception',
          notes_en: s.relationship.description?.en || 'Governing IEC standard',
        });
      }
    }

    return dyn;
  }, [graphContext, relatedEdges, equipment, locale]);

  const activeEdges = useMemo(() => {
    return [...relatedEdges, ...dynamicEdgesFromGraph];
  }, [relatedEdges, dynamicEdgesFromGraph]);

  const mappedNodeId =
    equipment.id.toLowerCase().includes('bess') || equipment.id.toLowerCase().includes('storage')
      ? 'node-bess-10mwh'
      : equipment.id.toLowerCase().includes('statcom') || equipment.id.toLowerCase().includes('svc') || equipment.id.toLowerCase().includes('facts')
      ? 'node-statcom-50mvar'
      : equipment.id.toLowerCase().includes('dga') || equipment.id.toLowerCase().includes('photoacoustic') || equipment.id.toLowerCase().includes('duval')
      ? 'node-ai-duval'
      : equipment.id.toLowerCase().includes('switch-iec') || equipment.id.toLowerCase().includes('cyber') || equipment.id.toLowerCase().includes('sw-iec')
      ? 'node-sw-iec61850'
      : equipment.id.toLowerCase().includes('meter') || equipment.id.toLowerCase().includes('ami') || equipment.id.toLowerCase().includes('dlms')
      ? 'node-ami-meter'
      : equipment.id.toLowerCase().includes('arrester') || equipment.id.toLowerCase().includes('parafoudre') || equipment.id.toLowerCase().includes('surge')
      ? 'node-surge-arrester'
      : equipment.id.toLowerCase().includes('gsu')
      ? 'node-trafo-gsu'
      : equipment.id.toLowerCase().includes('gen') || equipment.id.toLowerCase().includes('alternat')
      ? 'node-gen-g1'
      : equipment.id.toLowerCase().includes('bay') || equipment.id.toLowerCase().includes('trav') || equipment.id.toLowerCase().includes('gis') || equipment.id.toLowerCase().includes('disconnector')
      ? 'node-bay-song-225'
      : equipment.id.toLowerCase().includes('line') || equipment.id.toLowerCase().includes('ligne') || equipment.id.toLowerCase().includes('tower') || equipment.id.toLowerCase().includes('pyl')
      ? 'node-line-225-bekoko'
      : equipment.id.toLowerCase().includes('sub-trafo') || equipment.id.toLowerCase().includes('trafo-main') || equipment.id.toLowerCase().includes('225-30')
      ? 'node-trafo-main-30'
      : equipment.id.toLowerCase().includes('sub') || equipment.id.toLowerCase().includes('poste')
      ? 'node-sub-oyomabang'
      : equipment.id.toLowerCase().includes('feeder') || equipment.id.toLowerCase().includes('cell-mv') || equipment.id.toLowerCase().includes('hta')
      ? 'node-feeder-30-ind'
      : equipment.id.toLowerCase().includes('client-bt') || equipment.id.toLowerCase().includes('h61') || equipment.id.toLowerCase().includes('trafo-bt')
      ? 'node-trafo-client-bt'
      : equipment.id.toLowerCase().includes('motor') || equipment.id.toLowerCase().includes('moteur')
      ? 'node-motor-250'
      : equipment.id.toLowerCase().includes('tgbt') || equipment.id.toLowerCase().includes('disj')
      ? 'node-tgbt-400'
      : 'node-trafo-main-30';

  // Substation Apparatus Quick Switcher list
  const isSubstationApparatus =
    equipment.domain_code === 'D04' ||
    equipment.id.includes('225') ||
    equipment.id.includes('gis') ||
    equipment.id.includes('disconnector') ||
    equipment.id.includes('surge') ||
    equipment.id.includes('trafo');

  const substationApparatusList = [
    { id: 'eq-exp-gis-bay-225k', code: 'Q0', name_fr: 'Disjoncteur SF6', name_en: 'SF6 Circuit Breaker' },
    { id: 'eq-exp-disconnector-225k', code: 'Q9/Q8', name_fr: 'Sectionneur & Terre', name_en: 'Disconnector & Earth' },
    { id: 'eq-exp-surge-arrester-225k', code: 'F1', name_fr: 'Parafoudre ZnO', name_en: 'ZnO Surge Arrester' },
    { id: 'eq-exp-ct-225k', code: 'TC/TT', name_fr: 'Transfos de Mesure', name_en: 'Instrument Transformers' },
    { id: 'eq-exp-sub-trafo-225-30', code: 'TR-1', name_fr: 'Transfo 225/30 kV', name_en: 'Power Transformer' },
    { id: 'eq-exp-relay-ied-61850', code: 'IED', name_fr: 'Relais Numérique 61850', name_en: 'Digital IED Relay' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Back Button & CAD Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{locale === 'fr' ? 'RETOUR CATALOGUE' : 'BACK TO CATALOG'}</span>
          </button>

          {onCompareEquipment && (
            <button
              type="button"
              onClick={() => onCompareEquipment(equipment.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Comparer cet appareil' : 'Compare this asset'}</span>
            </button>
          )}

          {onNavigateContextStack && (
            <button
              type="button"
              onClick={() => onNavigateContextStack(mappedNodeId)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/35 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
            </button>
          )}

          {canonicalEquipment && (
            <button
              type="button"
              onClick={() => setViewMode(prev => prev === 'universal_fiche' ? 'overview' : 'universal_fiche')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                viewMode === 'universal_fiche'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {viewMode === 'universal_fiche'
                  ? (locale === 'fr' ? 'Retour Vue CAO' : 'Back to CAD View')
                  : (locale === 'fr' ? 'Fiche Universelle (12 Sec)' : 'Universal Fiche (12 Sec)')}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-200 text-[10px] font-mono border border-amber-700/50">
                12/12
              </span>
            </button>
          )}

          {canonicalEquipment && (
            <button
              type="button"
              onClick={() => setViewMode(prev => prev === 'dossier_30_sections' ? 'overview' : 'dossier_30_sections')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                viewMode === 'dossier_30_sections'
                  ? 'bg-slate-300 text-slate-950 border-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>
                {viewMode === 'dossier_30_sections'
                  ? (locale === 'fr' ? 'Retour Vue CAO' : 'Back to CAD View')
                  : (locale === 'fr' ? 'Dossier 30 Sections' : '30-Sec Dossier')}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-700">
                30/30
              </span>
            </button>
          )}

          {/* AAS v3 Asset Administration Shell Digital Twin Button */}
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'aas_v3_shell' ? 'overview' : 'aas_v3_shell')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              viewMode === 'aas_v3_shell'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-400/20'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/40'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>
              {viewMode === 'aas_v3_shell'
                ? (locale === 'fr' ? 'Retour Vue CAO' : 'Back to CAD View')
                : (locale === 'fr' ? 'Jumeau Numérique AAS v3' : 'AAS v3 Digital Twin')}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-200 text-[10px] font-mono border border-cyan-700/50">
              IEC 63278
            </span>
          </button>

          {/* Connected Scientific Calculations Bridge Button */}
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'engineering_calculation' ? 'overview' : 'engineering_calculation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              viewMode === 'engineering_calculation'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-400/20'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>
              {viewMode === 'engineering_calculation'
                ? (locale === 'fr' ? 'Retour Vue CAO' : 'Back to CAD View')
                : (locale === 'fr' ? 'Calculs & Dimensionnement' : 'Calculations & Sizing')}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-200 text-[10px] font-mono border border-emerald-700/50">
              IEC 60909
            </span>
          </button>

          {/* Master Technical Documentation & Specifications Button (Sections 3 & 4) */}
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'documentation' ? 'overview' : 'documentation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              viewMode === 'documentation'
                ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-md shadow-sky-400/20'
                : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/40'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>
              {viewMode === 'documentation'
                ? (locale === 'fr' ? 'Retour Vue CAO' : 'Back to CAD View')
                : (locale === 'fr' ? 'Dossier Spécifications & Docs' : 'Specs & Doc Dossier')}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-200 text-[10px] font-mono border border-sky-700/50">
              {equipmentDocs.length}
            </span>
          </button>

          {/* Firestore Synchronized Bookmark Button */}
          <button
            type="button"
            onClick={async () => {
              if (!user) {
                await signInWithGoogle();
                return;
              }
              if (isBookmarked(equipment.id)) {
                const existing = bookmarks.find((b) => b.targetId === equipment.id);
                if (existing) await removeBookmark(existing.id);
              } else {
                await addBookmark({
                  targetType: 'equipment',
                  targetId: equipment.id,
                  title: locale === 'fr' ? equipment.name_fr : equipment.name_en,
                  subtitle: equipment.domain_code,
                  notes: equipment.description_fr,
                });
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isBookmarked(equipment.id)
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400/50'
            }`}
            title={locale === 'fr' ? 'Enregistrer dans vos signets Firestore' : 'Save to Firestore bookmarks'}
          >
            {isBookmarked(equipment.id) ? (
              <>
                <Check className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Enregistré' : 'Saved'}</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Signet' : 'Bookmark'}</span>
              </>
            )}
          </button>
        </div>

        <nav aria-label="Breadcrumb" className="font-mono text-xs text-neutral-400 flex items-center gap-1.5 bg-[#0D1117] px-3 py-1.5 rounded-lg border border-[#252E38]">
          <button
            type="button"
            onClick={() => onNavigateDomain(equipment.domain_code)}
            className="text-cyan-400 hover:text-white font-bold"
          >
            {equipment.domain_code}
          </button>
          <span className="text-neutral-600">/</span>
          <span className="uppercase text-neutral-300">{equipment.entity_type}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-bold">{equipment.id}</span>
        </nav>
      </div>

      {/* HIERARCHICAL SYSTEM BREADCRUMB NAVIGATOR */}
      <GlobalBreadcrumbs
        locale={locale}
        items={[
          {
            id: 'home',
            label: locale === 'fr' ? 'Accueil EPEDE' : 'EPEDE Home',
            type: 'HOME',
            onClick: onBack,
          },
          {
            id: `domain-${equipment.domain_code}`,
            label: `${equipment.domain_code} · ${equipment.domain_code === 'D01' ? (locale === 'fr' ? 'Production' : 'Generation') : equipment.domain_code === 'D03' ? (locale === 'fr' ? 'Transport' : 'Transmission') : equipment.domain_code === 'D04' ? (locale === 'fr' ? 'Postes HTB' : 'Substations') : equipment.domain_code === 'D05' ? 'Distribution HTA' : (locale === 'fr' ? 'Installations' : 'Installations')}`,
            type: 'DOMAIN',
            onClick: () => onNavigateDomain(equipment.domain_code),
          },
          {
            id: `type-${equipment.entity_type}`,
            label: equipment.entity_type,
            type: 'BAY',
          },
          {
            id: `eq-${equipment.id}`,
            label: locale === 'fr' ? equipment.name_fr : equipment.name_en,
            type: 'EQUIPMENT',
            active: true,
          }
        ]}
      />

      {/* Substation Bay Apparatus Quick-Switcher Ribbon */}
      {isSubstationApparatus && (
        <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-md">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="p-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-slate-300">
              {locale === 'fr' ? 'Appareils de Travée 225 kV :' : '225 kV Bay Apparatus:'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {substationApparatusList.map((item) => {
              const isCurrent = canonicalEquipment?.id === item.id || equipment.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateEquipment(item.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-[#0E141F] text-slate-300 hover:text-white hover:bg-slate-800 border-[#1E2634]'
                  }`}
                >
                  <span className="font-mono font-extrabold mr-1 opacity-75">{item.code}</span>
                  <span className="hidden sm:inline">· {locale === 'fr' ? item.name_fr : item.name_en}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety Badge */}
      <SafetyBadge
        is_safety_critical={equipment.is_safety_critical}
        hazard_level={equipment.hazard_level}
        locale={locale}
        size="lg"
        voltageText={equipment.voltage_level ? `Niveau assigné : ${equipment.voltage_level}` : undefined}
      />

      {/* Engineering Header */}
      <header className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-6 sm:p-7 shadow-xl cad-grid-dense">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest bg-[#080B10] px-2.5 py-1 rounded border border-[#252E38]">
                {equipment.entity_type}
              </span>
              <span className="font-mono text-xs font-bold text-neutral-400">
                Domaine {equipment.domain_code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
              {locale === 'fr' ? equipment.name_fr : equipment.name_en}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl font-medium">
              {locale === 'fr' ? equipment.description_fr : equipment.description_en}
            </p>
          </div>

          {equipment.voltage_level && (
            <div className="shrink-0">
              <VoltageIndicator level={equipment.voltage_level} size="lg" />
            </div>
          )}
        </div>

        {/* Dynamic Apparatus Compliance Status Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'fr' ? 'Statut Normatif & Confiance :' : 'Normative Status & Evidence:'}
            </span>
            <EvidenceTrustBadge
              type={equipment.provenance?.verification_status === 'verified' ? 'VERIFIED_STANDARD' : 'FIELD_PRACTICE'}
              locale={locale}
              size="sm"
              governingStandard={(apiEquipment as any)?.governingStandard || canonicalEquipment?.governingStandards?.[0] || 'IEC 62271-100'}
            />
            <ApparatusComplianceBadge
              equipment={equipment}
              apiEquipment={apiEquipment}
              locale={locale}
              size="sm"
              onOpenCalculator={(tab) => {
                if (onNavigateCalculator) {
                  const eqName = locale === 'fr' ? equipment.name_fr : equipment.name_en;
                  const tag = equipment.aliases_fr?.[0] || apiEquipment?.tag || equipment.id;
                  onNavigateCalculator(tab, {
                    equipmentId: equipment.id,
                    equipmentName: eqName,
                    equipmentTag: tag,
                    substationOrFeeder: (apiEquipment as any)?.cameroonContext?.substationName || (apiEquipment as any)?.substationId || equipment.typical_location_fr || 'Poste 225 kV',
                    params: {
                      unVolts: 30000,
                      nominalCurrentA: apiEquipment?.specifications?.ratedCurrentA || 630,
                      breakingCapacityKa: apiEquipment?.specifications?.breakingCapacityKa || 31.5,
                    },
                  });
                } else {
                  setViewMode('engineering_calculation');
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* 10-ACTION UNIVERSAL RELATIONSHIP & TRACE HUB */}
      <ObjectRelationshipActionBar
        nodeId={mappedNodeId}
        locale={locale}
        onNavigateContextStack={onNavigateContextStack}
        onNavigateDomain={onNavigateDomain}
        onNavigateCalculator={onNavigateCalculator}
        onNavigateSimulation={onNavigateSimulation}
      />

      {/* Main Content Area: Switch between Overview / CAD, Full 30-Section Dossier, AAS v3 Shell, Dedicated Calculation Workbench, or Documentation Dossier */}
      {viewMode === 'documentation' ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#090D15] border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'DOSSIER TECHNIQUE & SPÉCIFICATIONS APPAREIL' : 'EQUIPMENT TECHNICAL DOSSIER & SPECIFICATIONS'}</span>
                </span>
                <h3 className="text-xl font-black text-white font-mono uppercase">
                  {locale === 'fr' ? equipment.name_fr : equipment.name_en}
                </h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
                {equipmentDocs.length} {locale === 'fr' ? 'Documents Rattachés' : 'Attached Documents'}
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-300">
              {locale === 'fr'
                ? 'Documents d\'ingénierie formels et spécifications matérielles associés à cet appareil, incluant les paramètres physiques et clauses normatives.'
                : 'Formal engineering specifications and technical datasheets associated with this apparatus, with structured parameters and governing clauses.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipmentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocModal(doc)}
                className="p-5 rounded-2xl bg-[#080C14] border border-[#1E293B] hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {doc.documentNumber} ({doc.revision})
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {doc.status}
                    </span>
                  </div>
                  <h4 className="font-mono text-sm font-black text-white group-hover:text-sky-300 transition-colors">
                    {locale === 'fr' ? doc.title_fr : doc.title_en}
                  </h4>
                  <p className="font-sans text-xs text-neutral-300 line-clamp-2">
                    {locale === 'fr' ? doc.summary_fr : doc.summary_en}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#162030] flex items-center justify-between text-xs font-mono text-sky-400 font-bold">
                  <span>{doc.documentType}</span>
                  <span>{locale === 'fr' ? 'Consulter le Document →' : 'View Document →'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : viewMode === 'engineering_calculation' ? (
        <div className="space-y-6">
          <EquipmentCalculationBridge
            equipment={equipment}
            apiEquipment={apiEquipment}
            locale={locale}
            onNavigateCalculator={(tab, context) => onNavigateCalculator && onNavigateCalculator(tab, context)}
          />
        </div>
      ) : viewMode === 'aas_v3_shell' ? (
        <AasSubmodelViewer
          equipment={equipment}
          locale={locale}
          onClose={() => setViewMode('overview')}
        />
      ) : viewMode === 'universal_fiche' && canonicalEquipment ? (
        <UniversalEquipmentFiche
          canonical={canonicalEquipment}
          locale={locale}
          onNavigateEquipment={onNavigateEquipment}
          onNavigateSimulation={onNavigateSimulation}
          onNavigateStandard={onNavigateStandard}
          onNavigateCameroonGrid={() => onNavigateDomain('D04')}
          onNavigateKnowledgeGraph={(id) => onNavigateContextStack?.(id)}
        />
      ) : viewMode === 'dossier_30_sections' && canonicalEquipment ? (
        <EquipmentDossierViewer
          canonical={canonicalEquipment}
          locale={locale}
          onNavigateEquipment={onNavigateEquipment}
          onClose={() => setViewMode('overview')}
        />
      ) : (
        <>
          {/* REAL-WORLD HIGH-RESOLUTION INDUSTRIAL PHOTOGRAPHY & PHYSICAL ORGAN RECOGNITION */}
          <EquipmentPhotographicGallery
            photographs={getPhotographsForEquipment(equipment.id)}
            locale={locale}
            equipmentName={locale === 'fr' ? equipment.name_fr : equipment.name_en}
          />

          {/* HIGH-RESOLUTION INTERACTIVE CAD SCHEMATIC & SWITCHGEAR CUTAWAY */}
          <EquipmentCutawaySchematicViewer
            equipment={equipment}
            locale={locale}
            onNavigateStandard={onNavigateStandard}
          />

          {/* INTERACTIVE CANONICAL TOPOLOGY TRACEABILITY TREE (API v1 GRAPH) */}
          <EquipmentTraceabilityTree
            locale={locale}
            graphContext={graphContext}
            isLoading={isLoadingGraph}
            currentEquipmentName={locale === 'fr' ? equipment.name_fr : equipment.name_en}
            currentVoltage={apiEquipment?.voltageNominal || (equipment.technical?.['Tension primaire (HT)'] as string) || (equipment.technical?.['Tension assignée (Ur)'] as string) || equipment.voltage_level}
            currentTag={equipment.aliases_fr?.[0] || apiEquipment?.tag}
            onNavigateEquipment={onNavigateEquipment}
            onNavigateStandard={onNavigateStandard}
          />

          {/* SYNCHRONIZED SCIENTIFIC CALCULATION WORKBENCH (IEC 60909 / CHUTE DE TENSION) */}
          <EquipmentCalculationBridge
            equipment={equipment}
            apiEquipment={apiEquipment}
            locale={locale}
            onNavigateCalculator={(tab, context) => onNavigateCalculator && onNavigateCalculator(tab, context)}
          />

          {/* SYSTEM BOUNDARY & OPERATIONAL JURISDICTION CARD */}
          <SystemBoundaryCard locale={locale} />

          {/* Two-Column Technical Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Functional Specs & Ratings */}
            <div className="space-y-6">
              
              {/* SYSTEM FUNCTION */}
              <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span>⚡</span> {locale === 'fr' ? 'FONCTION SYSTÈME & RÔLE EN EXPLOITATION' : 'SYSTEM FUNCTION & GRID ROLE'}
                </h3>
                <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                  {locale === 'fr' ? equipment.function_fr : equipment.function_en}
                </p>
                {equipment.typical_location_fr && (
                  <div className="mt-3 pt-3 border-t border-[#252E38] text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                    <span className="text-neutral-500 font-bold">📍 {locale === 'fr' ? 'IMPLANTATION TYPIQUE :' : 'TYPICAL LOCATION:'}</span>
                    <span className="text-white font-bold">{locale === 'fr' ? equipment.typical_location_fr : equipment.typical_location_en}</span>
                  </div>
                )}
              </div>

              {/* DENSE TECHNICAL RATINGS TABLE */}
              <EquipmentRatingsTable technical={equipment.technical} locale={locale} />
            </div>

            {/* Right: Relations Graph & Functional Edges */}
            <div className="space-y-6">
              <EdgeGraph
                edges={activeEdges}
                locale={locale}
                onSelectNode={(id, type) => {
                  if (type === 'equipment') {
                    onNavigateEquipment(id);
                  } else if (type === 'standard' && onNavigateStandard) {
                    onNavigateStandard(id);
                  }
                }}
              />

              {/* Operating Mode Toggle / CAD Insight */}
              <EquipmentOperatingRegimeCard locale={locale} />
            </div>

          </div>

          {/* ROLE EXPLORATION FILTER & MULTI-DISCIPLINARY TRACEABILITY ENGINE */}
          <div className="space-y-6 pt-2">
            <RoleExplorationToolbar locale={locale} />
            
            <EngineeringRelationshipTraceCard
              equipmentId={equipment.id}
              domainCode={equipment.domain_code}
              locale={locale}
              onNavigateToEquipment={onNavigateEquipment}
              onNavigateToStandard={onNavigateStandard}
              onNavigateToDomain={onNavigateDomain}
            />
          </div>

          {/* PROFESSIONAL INTELLIGENCE & DECISION LAYER (Priorities 3, 4, 5, 6, 8, 10) */}
          <EquipmentProfessionalIntelligenceLayer
            equipmentId={equipment.id}
            domainCode={equipment.domain_code}
            locale={locale}
          />

          {/* Bottom Tabbed Engineering Dossier */}
          <EquipmentEngineeringDossierTabs
            locale={locale}
            canonical={canonicalEquipment}
            onOpenFullDossier={() => setViewMode('dossier_30_sections')}
          />
        </>
      )}

      {/* CANONICAL ENGINEERING CONTEXT STACK (UPSTREAM/DOWNSTREAM FLOW & CROSS-DISCIPLINES) */}
      <div className="pt-2">
        <EngineeringContextStack
          locale={locale}
          initialNodeId={mappedNodeId}
          onNavigateDomain={onNavigateDomain}
          onNavigateEquipment={onNavigateEquipment}
          onNavigateCalculator={onNavigateCalculator}
          onNavigateSimulation={onNavigateSimulation}
          embedded={false}
        />
      </div>

      {/* PROVENANCE FOOTER */}
      <ProvenanceBadge provenance={equipment.provenance} locale={locale} />

      {/* DOCUMENT DETAIL MODAL (SECTIONS 3 & 4) */}
      {selectedDocModal && (
        <EpedeDocumentDetailModal
          document={selectedDocModal}
          locale={locale}
          onClose={() => setSelectedDocModal(null)}
          onNavigateEquipment={onNavigateEquipment}
        />
      )}

    </div>
  );
};
