// src/components/journey/EquipmentDrawer.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Radio, 
  Cpu, 
  ArrowRight,
  Info,
  ExternalLink,
  CheckCircle2,
  Zap,
  ArrowDown,
  ArrowUp,
  Calculator
} from 'lucide-react';
import { EcosystemEquipment } from './types';
import { epedeApi, GraphContextDto } from '../../services/epedeApiClient';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';

interface EquipmentDrawerProps {
  locale: 'fr' | 'en';
  equipment: EcosystemEquipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAnotherEquipment: (eqId: string) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
}

export const EquipmentDrawer: React.FC<EquipmentDrawerProps> = ({
  locale,
  equipment,
  isOpen,
  onClose,
  onSelectAnotherEquipment,
  onNavigateStandard,
  onNavigateCalculator,
}) => {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(2);
  const [graphContext, setGraphContext] = useState<GraphContextDto | null>(null);

  useEffect(() => {
    if (!equipment?.id) {
      setGraphContext(null);
      return;
    }
    let active = true;
    epedeApi.getGraphContext(equipment.id).then((ctx) => {
      if (active && ctx) {
        setGraphContext(ctx);
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [equipment?.id]);

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative z-10 w-full max-w-xl bg-white border-l border-slate-200/90 shadow-2xl flex flex-col animate-slideInRight h-full">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-300">
                {equipment.tag}
              </span>
              {equipment.voltageLevel && (
                <span className="text-xs font-mono text-sky-700 font-bold">
                  {equipment.voltageLevel}
                </span>
              )}
            </div>
            <h3 className="text-lg font-black font-mono text-slate-900">
              {equipment.name[locale]}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateCalculator && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const isTrafo = equipment.id.includes('trafo');
                  const isCable = equipment.id.includes('feeder') || equipment.id.includes('line') || equipment.id.includes('cable');
                  const isBreaker = equipment.id.includes('disjoncteur') || equipment.id.includes('breaker') || equipment.id.includes('cellule') || equipment.id.includes('switchgear');
                  if (isTrafo) {
                    onNavigateCalculator('transformer', {
                      equipmentId: equipment.id,
                      equipmentName: equipment.name[locale],
                      equipmentTag: equipment.tag,
                      params: {
                        trafoKva: 63000,
                        trafoHvKv: 225,
                        trafoLvV: 30000,
                        trafoUkPercent: 12.5,
                      },
                    });
                  } else if (isBreaker) {
                    onNavigateCalculator('relay-tcc', {
                      equipmentId: equipment.id,
                      equipmentName: equipment.name[locale],
                      equipmentTag: equipment.tag,
                      params: {
                        nominalCurrentA: 1250,
                        breakingCapacityKa: 31.5,
                        faultCurrentKa: 16.0,
                        voltageLevel: '30 kV',
                      },
                    });
                  } else if (isCable) {
                    onNavigateCalculator('cable-ampacity', {
                      equipmentId: equipment.id,
                      equipmentName: equipment.name[locale],
                      equipmentTag: equipment.tag,
                      params: {
                        unVolts: 30000,
                        pKw: 5000,
                        cosPhi: 0.90,
                        cableLengthM: 12500,
                        selectedSectionMm2: 150,
                        conductorMaterial: 'aluminium',
                        insulationType: 'xlpe_90',
                        ikKa: 12.5,
                      },
                    });
                  } else {
                    onNavigateCalculator('power', {
                      equipmentId: equipment.id,
                      equipmentName: equipment.name[locale],
                      equipmentTag: equipment.tag,
                    });
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Calculator className="h-3.5 w-3.5 text-cyan-700" />
                <span>{locale === 'fr' ? 'Atelier Calculs ↗' : 'Calculators ↗'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progressive Disclosure Level Tabs (3 Tiers) */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200/80 flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500 text-[10px] uppercase mr-1">
            {locale === 'fr' ? 'Niveau d\'information :' : 'Disclosure level :'}
          </span>
          <button
            type="button"
            onClick={() => setActiveLevel(1)}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeLevel === 1
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {locale === 'fr' ? '1. Grand Public' : '1. Overview'}
          </button>
          <button
            type="button"
            onClick={() => setActiveLevel(2)}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeLevel === 2
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {locale === 'fr' ? '2. Ingénierie' : '2. Engineering'}
          </button>
          <button
            type="button"
            onClick={() => setActiveLevel(3)}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeLevel === 3
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {locale === 'fr' ? '3. Approfondi (FMECA)' : '3. Deep Dive (FMECA)'}
          </button>
        </div>

      {/* Drawer Body Scroll */}
      <div className="p-6 overflow-y-auto space-y-5 font-mono text-xs">
        {/* Tier Narrative Description */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-amber-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-amber-600" />
              <span>
                {activeLevel === 1 
                  ? (locale === 'fr' ? 'SYNTHÈSE VULGARISÉE' : 'ACCESSIBLE SUMMARY')
                  : activeLevel === 2
                    ? (locale === 'fr' ? 'FICHE TECHNIQUE SYSTÈME' : 'SYSTEM TECHNICAL SHEET')
                    : (locale === 'fr' ? 'ÉQUATIONS & CALCULS DÉTAILLÉS' : 'DETAILED CALCULATIONS & EQUATIONS')}
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Tier {activeLevel}/3
            </span>
          </div>

          <p className="text-sm font-sans text-slate-700 leading-relaxed">
            {activeLevel === 1 && (equipment.levels?.level1?.[locale] ?? equipment.shortDesc[locale])}
            {activeLevel === 2 && (equipment.levels?.level2?.[locale] ?? equipment.function[locale])}
            {activeLevel === 3 && (equipment.levels?.level3?.[locale] ?? equipment.function[locale])}
          </p>
        </div>

        {/* Why It Exists */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-2 shadow-2xs">
          <span className="text-cyan-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-cyan-600" />
            <span>{locale === 'fr' ? 'POURQUOI CET ÉQUIPEMENT EXISTE-T-IL ?' : 'WHY DOES THIS EQUIPMENT EXIST?'}</span>
          </span>
          <p className="text-xs font-sans text-slate-700 leading-relaxed">
            {equipment.whyExists[locale]}
          </p>
        </div>

        {/* Electro-Technical Function (Tiers 2 & 3) */}
        {activeLevel >= 2 && (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-2 shadow-2xs">
            <span className="text-slate-800 font-bold uppercase text-[11px] block">
              {locale === 'fr' ? 'FONCTION ÉLECTROTECHNIQUE' : 'ELECTRO-TECHNICAL FUNCTION'}
            </span>
            <p className="text-xs font-sans text-slate-700 leading-relaxed">
              {equipment.function[locale]}
            </p>
          </div>
        )}

        {/* Location & Connections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">
              {locale === 'fr' ? 'OÙ EST-IL INSTALLÉ ?' : 'INSTALLATION LOCATION'}
            </span>
            <span className="text-xs text-slate-800 font-sans">
              {equipment.whereUsed[locale]}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">
              {locale === 'fr' ? 'RACCORDEMENT CHRONOLOGIQUE' : 'CIRCUIT CONNECTIONS'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 font-sans">
              {equipment.connectsTo.map((item, idx) => (
                <React.Fragment key={idx}>
                  <button
                    type="button"
                    onClick={() => onSelectAnotherEquipment(item)}
                    title={locale === 'fr' ? `Inspecter ${item}` : `Inspect ${item}`}
                    className="px-2 py-0.5 rounded bg-white hover:bg-cyan-50 text-cyan-800 hover:text-cyan-900 text-[11px] border border-slate-200 hover:border-cyan-300 transition-colors font-mono cursor-pointer shadow-2xs"
                  >
                    {item} ↗
                  </button>
                  {idx < equipment.connectsTo.length - 1 && (
                    <span className="text-slate-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Canonical Graph Upstream/Downstream & Protection Traceability */}
          {graphContext && (graphContext.upstream.length > 0 || graphContext.downstream.length > 0 || graphContext.protections.length > 0) && (
            <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-900 uppercase flex items-center gap-1">
                  <Zap className="h-3 w-3 text-cyan-600" />
                  {locale === 'fr' ? 'GRAPHE DE TOPOLOGIE CANONIQUE' : 'CANONICAL TOPOLOGY GRAPH'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-200/60 text-cyan-950 font-mono text-[9px] font-bold">
                  API v1
                </span>
              </div>

              {/* Upstream nodes */}
              {graphContext.upstream.length > 0 && (
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="h-2.5 w-2.5 rotate-180 text-cyan-600" />
                    {locale === 'fr' ? 'Alimentation Amont :' : 'Upstream Feed:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {graphContext.upstream.map((up, uIdx) => (
                      <button
                        key={uIdx}
                        type="button"
                        onClick={() => onSelectAnotherEquipment(up.equipment?.id || up.relationship.sourceId)}
                        className="px-2 py-0.5 rounded bg-white border border-cyan-300 text-cyan-900 hover:bg-cyan-100 text-[11px] font-mono font-bold transition-colors"
                      >
                        {up.equipment?.name[locale] || up.relationship.sourceId} ↗
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Downstream nodes */}
              {graphContext.downstream.length > 0 && (
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="h-2.5 w-2.5 text-emerald-600" />
                    {locale === 'fr' ? 'Départs Aval :' : 'Downstream Outgoers:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {graphContext.downstream.map((down, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => onSelectAnotherEquipment(down.equipment?.id || down.relationship.targetId)}
                        className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-[11px] font-mono font-bold transition-colors"
                      >
                        {down.equipment?.name[locale] || down.relationship.targetId} ↗
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Protections */}
              {graphContext.protections.length > 0 && (
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                    <ShieldCheck className="h-2.5 w-2.5 text-rose-600" />
                    {locale === 'fr' ? 'Protections Asservies :' : 'Associated Protections:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {graphContext.protections.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => onSelectAnotherEquipment(p.equipment?.id || p.relationship.sourceId)}
                        className="px-2 py-0.5 rounded bg-rose-50 border border-rose-300 text-rose-900 hover:bg-rose-100 text-[11px] font-mono font-bold transition-colors"
                      >
                        {p.equipment?.name[locale] || p.relationship.sourceId} ↗
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Measurements, Protections, and Controls (Tiers 2 & 3) */}
        {activeLevel >= 2 && (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-3.5 shadow-2xs">
            {/* Physical Measurements */}
            {equipment.measures && equipment.measures.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">
                  {locale === 'fr' ? 'GRANDEURS PHYSIQUES MESURÉES / SURVEILLÉES :' : 'PHYSICAL PARAMETERS MONITORED:'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {equipment.measures.map((m, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-white border border-cyan-200 text-cyan-800 text-[11px] flex items-center gap-1 shadow-2xs">
                      <Activity className="h-3 w-3 text-cyan-600" />
                      <span>{m}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Protections */}
            {equipment.protectedBy && equipment.protectedBy.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">
                  {locale === 'fr' ? 'PROTÉGÉ PAR :' : 'PROTECTED BY:'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {equipment.protectedBy.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="h-3 w-3 text-rose-600" />
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            {equipment.controls && equipment.controls.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">
                  {locale === 'fr' ? 'COMMANDE & PILOTAGE :' : 'CONTROL & ACTUATION:'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {equipment.controls.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 text-[11px] shadow-2xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Communication protocols */}
            {equipment.communicatesVia && equipment.communicatesVia.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {locale === 'fr' ? 'PROTOCOLE DE COMMUNICATION :' : 'COMMUNICATION PROTOCOL:'}
                </span>
                <div className="flex gap-1.5">
                  {equipment.communicatesVia.map((proto, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] shadow-2xs">
                      {proto}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applicable Standards */}
        {equipment.standards && equipment.standards.length > 0 && (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-indigo-200/80 space-y-2 shadow-2xs">
            <span className="text-indigo-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>{locale === 'fr' ? 'NORMES DE CONCEPTION & D\'ESSAIS' : 'DESIGN & TESTING STANDARDS'}</span>
            </span>
            <div className="space-y-1.5">
              {equipment.standards.map((std, idx) => (
                <div key={idx} className="p-2.5 rounded bg-white border border-slate-200 flex items-start justify-between gap-2 shadow-2xs">
                  <div>
                    <span className="text-amber-800 font-bold text-xs mr-2">{std.code}</span>
                    <span className="text-slate-700 font-sans text-xs">{std.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold">
                      {std.org}
                    </span>
                    {onNavigateStandard && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateStandard(std.code);
                        }}
                        className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold border border-indigo-200 transition-colors shadow-2xs"
                      >
                        {locale === 'fr' ? 'Fiche →' : 'Spec →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 3: Deep Engineering FMECA & Maintenance Matrix */}
        {activeLevel === 3 && (
          <>
            {/* Failure Modes (FMECA) */}
            {equipment.failureModes && equipment.failureModes.length > 0 && (
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-3 shadow-2xs">
                <span className="text-rose-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  <span>{locale === 'fr' ? 'MODES DE DÉFAILLANCE & FMECA' : 'FAILURE MODES & FMECA'}</span>
                </span>
                <div className="space-y-2">
                  {equipment.failureModes.map((fm, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-rose-200/80 space-y-1.5 text-xs font-sans shadow-2xs">
                      <div className="text-rose-800 font-bold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span>{fm.mode[locale]}</span>
                      </div>
                      <div className="text-slate-700 text-[11px] pl-3">
                        <span className="text-slate-500 font-mono">Conséquence: </span>
                        {fm.consequence[locale]}
                      </div>
                      <div className="text-emerald-800 text-[11px] pl-3">
                        <span className="text-slate-500 font-mono">Prévention / Mitigation: </span>
                        {fm.mitigation[locale]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Schedule */}
            {equipment.maintenance && equipment.maintenance.length > 0 && (
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 space-y-3 shadow-2xs">
                <span className="text-amber-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-amber-600" />
                  <span>{locale === 'fr' ? 'GAMMES DE MAINTENANCE PRÉVENTIVE' : 'PREVENTIVE MAINTENANCE SCHEDULE'}</span>
                </span>
                <div className="space-y-1.5">
                  {equipment.maintenance.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold shrink-0">
                        {m.frequency[locale]}
                      </span>
                      <span className="text-xs text-slate-700 font-sans">
                        {m.action[locale]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engineering Disciplines */}
            {equipment.disciplines && equipment.disciplines.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {locale === 'fr' ? 'DISCIPLINES D\'INGÉNIERIE IMPLIQUÉES :' : 'ENGINEERING DISCIPLINES INVOLVED:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {equipment.disciplines.map((d, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-2xs">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="px-6 py-3 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500">
          EPEDE Reference Matrix · IEC / IEEE
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold transition-colors border border-slate-200"
        >
          {locale === 'fr' ? 'Fermer' : 'Close'}
        </button>
      </div>
    </div>
  </div>
  );
};

