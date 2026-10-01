// src/components/equipment/modules/EquipmentTraceabilityTree.tsx
// Interactive Upstream/Downstream Electrical Network Traceability & Protection Graph
// Grounded in EPEDE v2.0 Knowledge Graph & Canonical Topology

import React from 'react';
import { ArrowDown, ArrowUp, ShieldCheck, Zap, Cpu, FileText, Activity, Layers, ArrowRight } from 'lucide-react';
import type { GraphContextDto } from '../../../services/epedeApiClient';

interface EquipmentTraceabilityTreeProps {
  locale: 'fr' | 'en';
  graphContext: GraphContextDto | null;
  isLoading: boolean;
  currentEquipmentName: string;
  currentVoltage?: string;
  currentTag?: string;
  onNavigateEquipment: (id: string) => void;
  onNavigateStandard?: (ref: string) => void;
}

export const EquipmentTraceabilityTree: React.FC<EquipmentTraceabilityTreeProps> = ({
  locale,
  graphContext,
  isLoading,
  currentEquipmentName,
  currentVoltage,
  currentTag,
  onNavigateEquipment,
  onNavigateStandard,
}) => {
  const upstream = graphContext?.upstream || [];
  const downstream = graphContext?.downstream || [];
  const protections = graphContext?.protections || [];
  const controls = graphContext?.controls || [];
  const standards = graphContext?.standards || [];

  return (
    <div className="rounded-xl border border-[#252E38] bg-[#0D1117] overflow-hidden shadow-lg">
      {/* Header Bar */}
      <div className="border-b border-[#252E38] px-5 py-3.5 bg-[#161B22] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <span>{locale === 'fr' ? 'TRAÇABILITÉ TOPOLOGIQUE & FLUX ÉLECTRIQUE' : 'TOPOLOGICAL TRACEABILITY & POWER FLOW'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                API v1 Graph
              </span>
            </h3>
            <p className="text-[11px] font-mono text-neutral-400">
              {locale === 'fr'
                ? 'Arbre d’interconnexion amont/aval et chaîne de protection asservie'
                : 'Upstream/downstream interconnection tree & protection chain'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-400">
            {upstream.length} {locale === 'fr' ? 'amont' : 'in'} · {downstream.length} {locale === 'fr' ? 'aval' : 'out'} · {protections.length} {locale === 'fr' ? 'protections' : 'prot'}
          </span>
          {isLoading && (
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* 3-Stage Electrical Flow: UPSTREAM -> CURRENT ASSET -> DOWNSTREAM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* 1. Upstream / Source Feeding */}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <ArrowDown className="h-3.5 w-3.5 rotate-180 text-cyan-400" />
                  {locale === 'fr' ? '1. ALIMENTATION AMONT' : '1. UPSTREAM FEED'}
                </span>
                <span className="text-[10px] text-neutral-400">{upstream.length}</span>
              </div>

              {upstream.length === 0 ? (
                <div className="text-xs text-neutral-400 italic py-3 font-mono">
                  {locale === 'fr' ? 'Source primaire (Générateur / Tête de ligne)' : 'Primary source (Generator / Grid Incomer)'}
                </div>
              ) : (
                <div className="space-y-2">
                  {upstream.map((item, idx) => {
                    const name = item.equipment?.name[locale] || item.relationship.sourceId;
                    const v = item.equipment?.voltageNominal;
                    const desc = item.relationship.description?.[locale] || '';
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-[#252E38] bg-[#161B22] hover:border-cyan-500/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigateEquipment(item.equipment?.id || item.relationship.sourceId)}
                            className="text-xs font-bold font-mono text-cyan-300 hover:text-cyan-200 text-left group-hover:underline flex items-center gap-1"
                          >
                            <span>{name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        </div>
                        {v && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                            <Zap className="h-2.5 w-2.5" />
                            <span>{v}</span>
                          </div>
                        )}
                        {desc && (
                          <p className="mt-1 text-[11px] text-neutral-400 leading-snug line-clamp-2 font-sans">
                            {desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 text-[10px] font-mono text-cyan-500/70 border-t border-cyan-500/10">
              ⚡ {locale === 'fr' ? 'Arrivée puissance & tension' : 'Power injection & voltage'}
            </div>
          </div>

          {/* 2. Current Asset Node */}
          <div className="rounded-lg border-2 border-amber-500/40 bg-amber-950/20 p-3.5 flex flex-col justify-between space-y-3 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-mono font-bold uppercase tracking-wider shadow">
              {locale === 'fr' ? 'APPAREIL INSPECTÉ' : 'ACTIVE ASSET'}
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                <span>{locale === 'fr' ? '2. NŒUD LOCAL' : '2. LOCAL NODE'}</span>
                {currentTag && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                    {currentTag}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg border border-amber-500/30 bg-[#161B22] space-y-2">
                <div className="text-sm font-bold text-white font-mono">
                  {currentEquipmentName}
                </div>
                {currentVoltage && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold">
                    <Zap className="h-3 w-3" />
                    <span>{currentVoltage}</span>
                  </div>
                )}
                <div className="text-[11px] text-neutral-300 font-mono">
                  {locale === 'fr' ? 'Point de jonction, transformation ou coupure' : 'Switching, transformation or junction point'}
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-amber-400/80 border-t border-amber-500/20 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Statut : Exploitation nominale' : 'Status: Nominal in-service'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* 3. Downstream / Outgoing Feeds */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
                  {locale === 'fr' ? '3. DÉPARTS AVAL' : '3. DOWNSTREAM FEED'}
                </span>
                <span className="text-[10px] text-neutral-400">{downstream.length}</span>
              </div>

              {downstream.length === 0 ? (
                <div className="text-xs text-neutral-400 italic py-3 font-mono">
                  {locale === 'fr' ? 'Point terminal (Consommateur / Charge finale)' : 'Terminal point (End-user / Load node)'}
                </div>
              ) : (
                <div className="space-y-2">
                  {downstream.map((item, idx) => {
                    const name = item.equipment?.name[locale] || item.relationship.targetId;
                    const v = item.equipment?.voltageNominal;
                    const desc = item.relationship.description?.[locale] || '';
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-[#252E38] bg-[#161B22] hover:border-emerald-500/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigateEquipment(item.equipment?.id || item.relationship.targetId)}
                            className="text-xs font-bold font-mono text-emerald-300 hover:text-emerald-200 text-left group-hover:underline flex items-center gap-1"
                          >
                            <span>{name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        </div>
                        {v && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                            <Zap className="h-2.5 w-2.5" />
                            <span>{v}</span>
                          </div>
                        )}
                        {desc && (
                          <p className="mt-1 text-[11px] text-neutral-400 leading-snug line-clamp-2 font-sans">
                            {desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 text-[10px] font-mono text-emerald-500/70 border-t border-emerald-500/10">
              🔌 {locale === 'fr' ? 'Alimentation des charges & sous-stations' : 'Feeding loads & substations'}
            </div>
          </div>

        </div>

        {/* Bottom Dual Grid: Protections & Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-[#252E38]">
          
          {/* Protections & Interlocking */}
          <div className="rounded-lg border border-rose-500/20 bg-rose-950/15 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                {locale === 'fr' ? 'SYSTÈME DE PROTECTION & VERROUILLAGE' : 'PROTECTION SYSTEM & INTERLOCKING'}
              </span>
              <span className="text-[10px] text-neutral-400">{protections.length}</span>
            </div>

            {protections.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono italic">
                {locale === 'fr' ? 'Protégé par les protections de zone amont' : 'Protected by upstream zone relays'}
              </p>
            ) : (
              <div className="space-y-2">
                {protections.map((p, idx) => {
                  const pName = p.equipment?.name[locale] || p.relationship.sourceId;
                  const pAnsi = p.equipment?.protectionFunctions || [];
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-[#252E38] bg-[#161B22] flex items-start justify-between gap-2 hover:border-rose-500/40 transition-colors"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => onNavigateEquipment(p.equipment?.id || p.relationship.sourceId)}
                          className="text-xs font-mono font-bold text-rose-300 hover:text-rose-200 text-left hover:underline"
                        >
                          {pName}
                        </button>
                        {p.relationship.description?.[locale] && (
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            {p.relationship.description[locale]}
                          </p>
                        )}
                      </div>
                      {pAnsi.length > 0 && (
                        <div className="flex flex-wrap gap-1 shrink-0">
                          {pAnsi.slice(0, 3).map((ansi, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold"
                            >
                              {ansi}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Applicable Standards */}
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/15 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-400" />
                {locale === 'fr' ? 'NORMES CEI / IEEE DE CONCEPTION' : 'GOVERNING IEC / IEEE STANDARDS'}
              </span>
              <span className="text-[10px] text-neutral-400">{standards.length}</span>
            </div>

            {standards.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono italic">
                {locale === 'fr' ? 'Régie par le code général des réseaux CEI 61936' : 'Governed by general IEC 61936 grid code'}
              </p>
            ) : (
              <div className="space-y-2">
                {standards.map((s, idx) => {
                  const std = s.standard;
                  const code = std?.code || s.relationship.targetId;
                  const title = std?.title?.[locale] || s.relationship.description?.[locale] || '';
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-[#252E38] bg-[#161B22] flex items-center justify-between gap-2 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-2">
                          <span>{code}</span>
                          {std?.organization && (
                            <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[9px]">
                              {std.organization}
                            </span>
                          )}
                        </div>
                        {title && (
                          <p className="text-[11px] text-neutral-400 font-sans truncate mt-0.5">
                            {title}
                          </p>
                        )}
                      </div>

                      {onNavigateStandard && (
                        <button
                          type="button"
                          onClick={() => onNavigateStandard(code)}
                          className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold shrink-0 transition-colors"
                        >
                          {locale === 'fr' ? 'Dossier →' : 'Dossier →'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
