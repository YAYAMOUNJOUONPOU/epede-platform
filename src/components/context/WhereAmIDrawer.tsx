// src/components/context/WhereAmIDrawer.tsx
// EPEDE - "Where Am I?" Engineering Context & Orientation Engine
// Answers all 16 foundational engineering orientation questions for any selected object or system.

import React from 'react';
import {
  Compass,
  X,
  Zap,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Globe,
  Radio,
  Sliders,
  Scale,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { engineeringContextService } from '../../services/engineeringContextService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';
import { canonicalGraph } from '../../data/canonicalGraphEngine';
import { EQUIPMENT_ITEMS } from '../../data/epedeData';
import { soundEffects } from '../../services/soundEffectsService';

interface WhereAmIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onNavigateDomain?: (domainCode: string) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateSimulation?: (tab: any) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
}

export const WhereAmIDrawer: React.FC<WhereAmIDrawerProps> = ({
  isOpen,
  onClose,
  locale,
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateContextStack,
}) => {
  if (!isOpen) return null;

  const ctx = engineeringContextService.getCurrentContext();
  const contextStack = ctx.objectId ? canonicalGraph.buildContextStack(ctx.objectId) : null;
  const activeNode = contextStack?.selectedNode || null;
  const activeEquip = ctx.objectId ? EQUIPMENT_ITEMS.find((e) => e.id === ctx.objectId) : null;

  const upstreamNodes = contextStack?.upstreamChain || [];
  const downstreamNodes = contextStack?.downstreamChain || [];
  const protections = contextStack?.crossDiscipline?.protections || [];
  const controls = contextStack?.crossDiscipline?.controls || [];
  const measurements = contextStack?.crossDiscipline?.measurements || [];

  const handleLinkClick = (cb?: () => void) => {
    soundEffects.playSwitchClick();
    if (cb) cb();
    onClose();
  };

  const getChainPositionName = (pos: string) => {
    switch (pos) {
      case 'generation':
        return locale === 'fr' ? '1. Production Hydro / Thermique / Solaire' : '1. Hydro / Thermal / Solar Generation';
      case 'step_up_substation':
        return locale === 'fr' ? '2. Poste Élévateur GSU (10.5/225 kV)' : '2. Step-Up Substation GSU (10.5/225 kV)';
      case 'transmission_grid':
        return locale === 'fr' ? '3. Réseau de Transport HTB (225 kV / 90 kV)' : '3. HV Transmission Grid (225 kV / 90 kV)';
      case 'primary_substation':
        return locale === 'fr' ? '4. Poste Source de Transformation (225/30 kV)' : '4. Primary Grid Substation (225/30 kV)';
      case 'distribution_network':
        return locale === 'fr' ? '5. Réseau de Distribution HTA (30 kV)' : '5. MV Distribution Network (30 kV)';
      case 'industrial_commercial_load':
        return locale === 'fr' ? '6. Installations Industrielles & Moteurs (400 V)' : '6. Industrial Installations & Loads (400 V)';
      case 'auxiliary_system':
      default:
        return locale === 'fr' ? 'Services Auxiliaires (110 Vcc / 400 Vca)' : 'Auxiliary Power Systems (110 Vdc / 400 Vac)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-200 font-mono text-xs">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  {locale === 'fr' ? 'BOUSSOLE D\'ORIENTATION CONTEXTUELLE' : 'ENGINEERING CONTEXT COMPASS'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {locale === 'fr' ? 'Réponses aux 16 questions fondamentales de positionnement' : 'Instant answers to all 16 foundational engineering orientation questions'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.playSwitchClick();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
            
            {/* 1. WHERE AM I? & WHAT SYSTEM AM I EXPLORING? */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Compass className="h-3.5 w-3.5" />
                <span>1 & 2. {locale === 'fr' ? 'OÙ SUIS-JE & QUEL SYSTÈME ?' : 'WHERE AM I & WHAT SYSTEM?'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block">{locale === 'fr' ? 'Position dans la chaîne énergétique :' : 'Energy Chain Stage:'}</span>
                  <span className="text-cyan-300 font-bold text-xs">{getChainPositionName(ctx.energyChainPosition)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{locale === 'fr' ? 'Domaine Actif :' : 'Active Domain:'}</span>
                  <span className="text-amber-300 font-bold">{ctx.domainTitle ? ctx.domainTitle[locale] : (ctx.domainCode || 'Ecosystème')}</span>
                </div>
              </div>
            </div>

            {/* 3. WHAT OBJECT IS SELECTED? */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700/50 space-y-3">
              <div className="text-cyan-300 font-bold uppercase text-[11px] flex items-center justify-between border-b border-cyan-800/60 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>3. {locale === 'fr' ? 'ÉLÉMENT SÉLECTIONNÉ' : 'SELECTED OBJECT'}</span>
                </span>
                <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" />
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>
                    {activeNode?.name[locale] ||
                      (activeEquip ? (locale === 'fr' ? activeEquip.name_fr : activeEquip.name_en) : undefined) ||
                      ctx.objectName?.[locale] ||
                      (locale === 'fr' ? 'Équipement du Réseau' : 'Grid Equipment')}
                  </span>
                  {(activeNode?.tag || ctx.objectTag) && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-900 border border-cyan-600 text-cyan-200 text-[10px]">
                      {activeNode?.tag || ctx.objectTag}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  {activeNode?.description[locale] ||
                    (activeEquip ? (locale === 'fr' ? activeEquip.description_fr : activeEquip.description_en) : undefined) ||
                    (locale === 'fr' ? 'Équipement interconnecté sur le réseau électrique EPEDE.' : 'Interconnected grid asset in EPEDE environment.')}
                </p>
              </div>
            </div>

            {/* 4 & 5. WHAT FEEDS IT & WHAT DOES IT FEED? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feeds from */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-sky-400 font-bold text-[10px] uppercase flex items-center gap-1">
                  <span>⚡ 4. {locale === 'fr' ? 'ALIMENTÉ PAR (AMONT)' : 'FED BY (UPSTREAM)'}</span>
                </span>
                {upstreamNodes.length > 0 ? (
                  <div className="space-y-1.5">
                    {upstreamNodes.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleLinkClick(() => onNavigateContextStack?.(u.id))}
                        className="w-full text-left p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-sky-500/60 text-slate-300 hover:text-white transition-all text-[10px] flex items-center justify-between"
                      >
                        <span className="truncate">{u.name[locale]}</span>
                        <ChevronRight className="h-3 w-3 text-sky-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[10px] italic">{locale === 'fr' ? 'Source Primaire (Amont non applicable)' : 'Primary Source (No upstream)'}</span>
                )}
              </div>

              {/* Feeds to */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                  <span>🔌 5. {locale === 'fr' ? 'ALIMENTE (AVAL)' : 'FEEDS TO (DOWNSTREAM)'}</span>
                </span>
                {downstreamNodes.length > 0 ? (
                  <div className="space-y-1.5">
                    {downstreamNodes.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleLinkClick(() => onNavigateContextStack?.(d.id))}
                        className="w-full text-left p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500/60 text-slate-300 hover:text-white transition-all text-[10px] flex items-center justify-between"
                      >
                        <span className="truncate">{d.name[locale]}</span>
                        <ChevronRight className="h-3 w-3 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[10px] italic">{locale === 'fr' ? 'Récepteur Final' : 'Final Load Receiver'}</span>
                )}
              </div>
            </div>

            {/* 6 & 7. WHAT PROTECTS & MEASURES IT? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Protections */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold text-[10px] uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>6. {locale === 'fr' ? 'PROTECTIONS ANSI / CEI' : 'PROTECTIONS ANSI / IEC'}</span>
                </span>
                {protections.length > 0 ? (
                  <div className="space-y-1">
                    {protections.map((p) => (
                      <div key={p.id} className="p-1 rounded bg-slate-950 text-[10px] text-rose-300 font-mono flex items-center justify-between">
                        <span>{p.name[locale]}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-400 font-bold">{p.tag || 'ANSI'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[10px]">{locale === 'fr' ? 'Protections différentielles & surcharge 50/51' : 'Differential & Overcurrent 50/51'}</span>
                )}
              </div>

              {/* Measurements */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold text-[10px] uppercase flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>7. {locale === 'fr' ? 'MESURES & TÉLÉMÉTRIES' : 'MEASUREMENTS & SCADA'}</span>
                </span>
                {measurements.length > 0 ? (
                  <div className="space-y-1">
                    {measurements.map((m) => (
                      <div key={m.id} className="p-1 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono">
                        {m.name[locale]}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[10px]">{locale === 'fr' ? 'TC 2000/1A, TT 225kV/√3, SCADA RTU' : 'CT 2000/1A, VT 225kV/√3, SCADA RTU'}</span>
                )}
              </div>
            </div>

            {/* 8, 9 & 10. WHAT CONTROLS, COMMUNICATES & EARTHING CONTEXT? */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Cpu className="h-3.5 w-3.5" />
                <span>8, 9 & 10. {locale === 'fr' ? 'CONTRÔLE, TÉLÉCOM & RÉGIME DE NEUTRE' : 'CONTROL, TELECOM & EARTHING'}</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Contrôle-Commande :' : 'Control (BCU):'}</span>
                  <span className="text-slate-200">BCU IEC 61850 + Interverrouillages 52/89</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Télécommunication :' : 'Telecom Bus:'}</span>
                  <span className="text-slate-200">GOOSE (Sub-4ms) + MMS SCADA</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Régime de Neutre :' : 'Earthing Regime:'}</span>
                  <span className="text-amber-300 font-bold">{activeNode?.earthingRegime || 'Solid (225 kV) / NGR (30 kV)'}</span>
                </div>
              </div>
            </div>

            {/* 11 & 12. ENGINEERING DECISIONS & GOVERNING STANDARDS */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-emerald-400 font-bold text-[11px] uppercase flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>11 & 12. {locale === 'fr' ? 'DÉCISIONS & NORMES APPLICABLES' : 'DECISIONS & GOVERNING STANDARDS'}</span>
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="text-slate-300">
                  <strong className="text-white">{locale === 'fr' ? 'Arbitrage Design :' : 'Design Trade-Off:'}</strong>{' '}
                  {locale === 'fr'
                    ? 'Optimisation TCO entre isolation dans l\'air (AIS) et poste sous enveloppe métallique (GIS) selon la pollution saline et l\'emprise foncière.'
                    : 'TCO optimization between Air-Insulated (AIS) and Gas-Insulated (GIS) switchgear based on footprint and coastal pollution.'}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-mono text-[10px]">IEC 62271-100</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-mono text-[10px]">IEC 60076</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-mono text-[10px]">IEC 61850</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-mono text-[10px]">IEEE 80</span>
                </div>
              </div>
            </div>

            {/* 13, 14, 15 & 16. EVIDENCE, ASSUMPTIONS & NEXT STEP RECOMMENDATION */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1.5 border-b border-amber-500/30 pb-1.5">
                <Scale className="h-3.5 w-3.5" />
                <span>13-16. {locale === 'fr' ? 'CONFIANCE & QUE CONSULTER ENSUITE ?' : 'TRUST & WHAT TO EXPLORE NEXT?'}</span>
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" />
                  <EvidenceTrustBadge type="CAMEROON_CONTEXT" locale={locale} size="sm" />
                  <EvidenceTrustBadge type="SIMULATION" locale={locale} size="sm" />
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleLinkClick(() => onNavigateCalculator?.('transformer'))}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-amber-400 transition-colors"
                  >
                    <span>{locale === 'fr' ? 'Ouvrir Calculateur Associé' : 'Open Linked Calculator'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(() => onNavigateSimulation?.('differential-protection'))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <span>{locale === 'fr' ? 'Tester en Simulation Lab' : 'Test in Simulation Lab'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">EPEDE Context Intelligence Layer v2.0</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {locale === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
