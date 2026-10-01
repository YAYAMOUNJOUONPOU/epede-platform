// src/components/grid/MultiDisciplinaryInterfaceMatrixViewer.tsx
// EPEDE - Multidisciplinary Engineering Interface Matrix & Contractual Demarcation Viewer
// Displays 8-discipline handovers and Cameroon utility interface boundaries (SONATREL, ENEO, IPPs, Heavy Industry)

import React, { useState } from 'react';
import {
  Network,
  Zap,
  Shield,
  Activity,
  Building,
  Flame,
  Cpu,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  Scale,
  DollarSign,
  Gavel,
  BookOpen,
  Info,
  Clock,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ENGINEERING_DISCIPLINES,
  DISCIPLINE_INTERFACES,
  CAMEROON_UTILITY_ACTORS,
  CAMEROON_CONTRACTUAL_INTERFACES,
  DisciplineId,
  EngineeringDiscipline,
  DisciplineInterfaceItem,
  UtilityContractualInterface
} from '../../data/engineeringDisciplinesInterfaceData';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface MultiDisciplinaryInterfaceMatrixViewerProps {
  locale?: 'fr' | 'en';
  embedded?: boolean;
}

export const MultiDisciplinaryInterfaceMatrixViewer: React.FC<MultiDisciplinaryInterfaceMatrixViewerProps> = ({
  locale = 'fr',
  embedded = false
}) => {
  const isFr = locale === 'fr';

  const [activeMainTab, setActiveMainTab] = useState<'DISCIPLINES' | 'CONTRACTUAL'>('DISCIPLINES');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<DisciplineId>('ELECTRICAL_HV');
  const [selectedContractId, setSelectedContractId] = useState<string>(CAMEROON_CONTRACTUAL_INTERFACES[0].id);

  const selectedDiscipline = ENGINEERING_DISCIPLINES.find(d => d.id === selectedDisciplineId) || ENGINEERING_DISCIPLINES[0];
  const relatedInterfaces = DISCIPLINE_INTERFACES.filter(
    i => i.primaryDiscipline === selectedDisciplineId || i.interfacingDiscipline === selectedDisciplineId
  );

  const activeContract = CAMEROON_CONTRACTUAL_INTERFACES.find(c => c.id === selectedContractId) || CAMEROON_CONTRACTUAL_INTERFACES[0];

  const getDisciplineIcon = (id: DisciplineId) => {
    switch (id) {
      case 'ELECTRICAL_HV': return Zap;
      case 'PROTECTION_AUTOMATION': return Shield;
      case 'SCADA_TELEMETRY': return Activity;
      case 'CIVIL_STRUCTURAL': return Building;
      case 'FLUIDS_ENVIRONMENT': return Flame;
      case 'AUXILIARY_DC_AC': return Cpu;
      case 'TELECOM_CYBER': return Network;
      case 'EARTHING_LIGHTNING': return AlertTriangle;
      default: return Zap;
    }
  };

  return (
    <div className={`space-y-6 font-sans ${embedded ? '' : 'p-4 sm:p-6 max-w-7xl mx-auto'}`}>
      
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-4 h-4 text-blue-400" />
                <span>{isFr ? 'INTERFACES & RESPONSABILITÉS CONTRACTUELLES' : 'INTERFACES & CONTRACTUAL DEMARCATION'}</span>
              </span>
              <EvidenceTrustBadge level="CAMEROON_CONTEXT" locale={locale} size="sm" />
              <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
              {isFr
                ? 'Matrice des 8 Disciplines d\'Ingénierie & Frontières Réseau'
                : '8-Discipline Engineering Matrix & Utility Contractual Demarcation'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isFr
                ? 'Clarification sans ambiguïté des points de passage de témoin (handovers) entre les métiers d\'ingénierie et des frontières d\'exploitation SONATREL (Transport), ENEO (Distribution) et producteurs IPP.'
                : 'Unambiguous technical handover points across the 8 engineering disciplines and contractual boundary demarcation between SONATREL, ENEO, IPPs, and heavy industrial offtakers.'}
            </p>
          </div>

          {/* Main Mode Toggle: Disciplines vs Contractual */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveMainTab('DISCIPLINES')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeMainTab === 'DISCIPLINES'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? '1. 8 Métiers d\'Ingénierie' : '1. 8 Engineering Disciplines'}
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab('CONTRACTUAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeMainTab === 'CONTRACTUAL'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? '2. Frontières Cameroun (SONATREL / ENEO)' : '2. Cameroon Utility Boundaries'}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: THE 8 ENGINEERING DISCIPLINES & CROSS-DISCIPLINARY INTERFACES   */}
      {/* ===================================================================== */}
      {activeMainTab === 'DISCIPLINES' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* 8 Disciplines Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ENGINEERING_DISCIPLINES.map((d) => {
              const Icon = getDisciplineIcon(d.id);
              const isSelected = selectedDisciplineId === d.id;

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDisciplineId(d.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-lg ring-1 ring-amber-500/30'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-sans font-semibold leading-tight line-clamp-2">
                    {isFr ? d.name_fr : d.name_en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Discipline Header & Interface Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Discipline Dossier Profile */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] shadow-xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {isFr ? 'Fiche Métier d\'Ingénierie' : 'Discipline Dossier'}
                </span>
                <h3 className="text-base font-bold text-white font-sans">
                  {isFr ? selectedDiscipline.name_fr : selectedDiscipline.name_en}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isFr ? selectedDiscipline.leadRole_fr : selectedDiscipline.leadRole_en}
                </p>
              </div>

              {/* Governing Standards */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {isFr ? 'Normes Régissantes :' : 'Governing Standards:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedDiscipline.governingStandards.map((std, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px]">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-sans text-xs">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">
                  {isFr ? 'Livrables Clés Produits :' : 'Key Engineering Deliverables:'}
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11.5px]">
                  {(isFr ? selectedDiscipline.keyDeliverables_fr : selectedDiscipline.keyDeliverables_en).map((del, idx) => (
                    <li key={idx}>{del}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Cross-Disciplinary Interfaces */}
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
                {isFr
                  ? `Points de Démarcation & Interfaces avec les Autres Disciplines (${relatedInterfaces.length})`
                  : `Demarcation Handovers with Other Disciplines (${relatedInterfaces.length})`}
              </span>

              {relatedInterfaces.length === 0 ? (
                <div className="p-8 text-center text-slate-500 rounded-2xl border border-slate-800 bg-[#0B0F15]">
                  <p>{isFr ? 'Toutes les interfaces de cette discipline sont en conformité directe avec les normes générales.' : 'Interfaces follow standard engineering guidelines.'}</p>
                </div>
              ) : (
                relatedInterfaces.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] shadow-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white font-sans">
                          {isFr ? item.interfaceTitle_fr : item.interfaceTitle_en}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {item.primaryDiscipline}
                        </span>
                        <span className="text-slate-500">↔</span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {item.interfacingDiscipline}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">
                          {isFr ? 'Limite & Démarcation Physique :' : 'Physical Demarcation Point:'}
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {isFr ? item.demarcationBoundary_fr : item.demarcationBoundary_en}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                        <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">
                          {isFr ? 'Critère de Réception & Passage de Témoin :' : 'Handover & Acceptance Criterion:'}
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {isFr ? item.handoverCriterion_fr : item.handoverCriterion_en}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-[11px] text-rose-300 font-sans flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-400 font-mono uppercase text-[10px] block">
                          {isFr ? 'Risque Majeur de Conflit ou d\'Incompatibilité sur Chantier :' : 'Major Inter-Discipline Conflict Risk:'}
                        </span>
                        <span>{isFr ? item.conflictRisk_fr : item.conflictRisk_en}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: CAMEROON UTILITY CONTRACTUAL DEMARCATION (SONATREL / ENEO / NHPC)*/}
      {/* ===================================================================== */}
      {activeMainTab === 'CONTRACTUAL' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Actors Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CAMEROON_UTILITY_ACTORS.map((act) => (
              <div key={act.actorCode} className="p-4 rounded-xl border border-slate-800 bg-[#0B0F15] shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono font-black text-xs" style={{ backgroundColor: `${act.badgeColor}22`, color: act.badgeColor, border: `1px solid ${act.badgeColor}44` }}>
                    {act.actorCode}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{act.voltagePerimeter}</span>
                </div>

                <strong className="text-white text-xs font-sans block leading-tight">
                  {isFr ? act.name_fr : act.name_en}
                </strong>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {isFr ? act.roleDescription_fr : act.roleDescription_en}
                </p>
              </div>
            ))}
          </div>

          {/* Contractual Boundaries Selector & Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Interface List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
                {isFr ? 'Frontières Contractuelles Régies par l\'ARSEL' : 'ARSEL Regulated Contractual Interfaces'}
              </span>

              <div className="space-y-2">
                {CAMEROON_CONTRACTUAL_INTERFACES.map((c) => {
                  const isSelected = selectedContractId === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContractId(c.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-[#121A26] shadow-lg ring-1 ring-amber-500/30'
                          : 'border-slate-800 bg-[#0B0F15] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1.5 border-b border-slate-800/80">
                        <span className="text-amber-400 font-bold">{c.upstreamParty}</span>
                        <span>↔</span>
                        <span className="text-sky-400 font-bold">{c.downstreamParty}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white font-sans mt-2">
                        {isFr ? c.boundaryName_fr : c.boundaryName_en}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Boundary Dossier */}
            <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0B0F15] shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    {isFr ? 'Protocole de Démarcation Officiel' : 'Official Demarcation Protocol'}
                  </span>
                  <h3 className="text-base font-bold text-white font-sans">
                    {isFr ? activeContract.boundaryName_fr : activeContract.boundaryName_en}
                  </h3>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    {activeContract.upstreamParty}
                  </span>
                  <span className="text-slate-500">➜</span>
                  <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40">
                    {activeContract.downstreamParty}
                  </span>
                </div>
              </div>

              {/* 4 Pillars of Demarcation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-sans">
                
                {/* Physical Delivery */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isFr ? 'Point de Livraison Physique :' : 'Physical Delivery Point:'}</span>
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isFr ? activeContract.physicalDeliveryPoint_fr : activeContract.physicalDeliveryPoint_en}
                  </p>
                </div>

                {/* Ownership Demarcation */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-purple-400 font-mono uppercase font-bold block flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isFr ? 'Limite de Propriété des Ouvrages :' : 'Asset Ownership Demarcation:'}</span>
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isFr ? activeContract.ownershipDemarcation_fr : activeContract.ownershipDemarcation_en}
                  </p>
                </div>

                {/* Operational Responsibility */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFr ? 'Responsabilité Opérationnelle & LOTO :' : 'Operational & LOTO Mandate:'}</span>
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isFr ? activeContract.operationalResponsibility_fr : activeContract.operationalResponsibility_en}
                  </p>
                </div>

                {/* Metering & Settlement */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isFr ? 'Comptage & Facturation TURPE (Classe 0.2S) :' : 'Settlement Tariff Metering (0.2S):'}</span>
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isFr ? activeContract.meteringDemarcation_fr : activeContract.meteringDemarcation_en}
                  </p>
                </div>

              </div>

              {/* Dispute & Regulatory Authority */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between text-xs font-mono text-amber-300">
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isFr ? 'Autorité de Régulation & Arbitrage :' : 'Regulatory Authority & Dispute Escalation:'}</span>
                  <strong className="text-white">{isFr ? activeContract.disputeEscalationAuthority_fr : activeContract.disputeEscalationAuthority_en}</strong>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
