// src/components/ecosystem/EcosystemEquipmentModal.tsx
import React from 'react';
import {
  X,
  ExternalLink,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  FileCheck2,
  ArrowRight,
  BookOpen,
  SlidersHorizontal,
  Workflow
} from 'lucide-react';
import { EcosystemEquipmentDetail, EcosystemViewMode } from './ecosystemData';

interface EcosystemEquipmentModalProps {
  equipment: EcosystemEquipmentDetail | null;
  onClose: () => void;
  locale: 'fr' | 'en';
  viewMode: EcosystemViewMode;
  onOpenInEpedeDomain: (domainCode: string, equipmentId: string) => void;
  onOpenSimulation?: () => void;
  onOpenProtection?: () => void;
  onOpenCalculator?: () => void;
}

export const EcosystemEquipmentModal: React.FC<EcosystemEquipmentModalProps> = ({
  equipment,
  onClose,
  locale,
  viewMode,
  onOpenInEpedeDomain,
  onOpenSimulation,
  onOpenProtection,
  onOpenCalculator,
}) => {
  if (!equipment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0E14] border border-[#233038] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0E1520]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-base shadow-inner">
              {equipment.badgeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {equipment.name[locale]}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold">
                  {equipment.tagIec}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40">
                  {equipment.epedeDomainCode}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                {equipment.subtitle[locale]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Hero Card with Real-World Equipment Photo and Primary Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#111827]/80 p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-5 h-48 sm:h-56 rounded-lg overflow-hidden relative border border-slate-700">
              <img
                src={equipment.imageUrl}
                alt={equipment.name[locale]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                  {locale === 'fr' ? 'Photographie Industrielle de Référence' : 'Industrial Reference Photograph'}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  {locale === 'fr' ? 'Caractéristiques Électriques Clés' : 'Key Electrical Ratings'}
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">{locale === 'fr' ? 'Tension Nominale (Un)' : 'Rated Voltage (Un)'}</span>
                    <span className="text-white font-bold text-sm text-cyan-300">{equipment.voltage}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">{locale === 'fr' ? 'Courant Nominal (In)' : 'Rated Current (In)'}</span>
                    <span className="text-white font-bold text-sm text-emerald-300">{equipment.current}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 col-span-2">
                    <span className="text-slate-400 text-[10px] block">{locale === 'fr' ? 'Puissance Assignée / Capacité' : 'Rated Capacity / Power'}</span>
                    <span className="text-white font-bold text-sm text-amber-300">{equipment.power}</span>
                  </div>
                </div>
              </div>

              {/* Power Flow Context Upstream -> Downstream */}
              <div className="p-2.5 rounded-lg bg-[#0C121D] border border-cyan-900/40 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold mb-1">
                  <Workflow className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Chaîne de Puissance' : 'Power Flow Continuity'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-slate-400 truncate max-w-[45%]">← {equipment.upstream}</span>
                  <ArrowRight className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="text-amber-300 truncate max-w-[45%] text-right">{equipment.downstream} →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Principle and Engineering Role */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-2 mb-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Rôle dans l\'Écosystème Énergétique' : 'Role in the Energy Ecosystem'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {equipment.role[locale]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-2 mb-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>{locale === 'fr' ? 'Principe Physique & Électrotechnique' : 'Physical & Electrical Working Principle'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {equipment.workingPrinciple[locale]}
              </p>
            </div>
          </div>

          {/* Components Grid */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2 mb-2.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'Sous-Ensembles & Composants Principaux' : 'Main Sub-Assemblies & Components'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {equipment.mainComponents[locale].map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#0B0F17] border border-slate-800 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Protections & Standards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>{locale === 'fr' ? 'Protections & Fonctions ANSI' : 'Protection & ANSI Functions'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {equipment.protectionTypes.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 text-[10px] font-mono font-bold">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
                <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{locale === 'fr' ? 'Normes Internationales CEI / IEEE' : 'International Standards (IEC / IEEE)'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {equipment.applicableStandards.map((std, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-[10px] font-mono font-bold">
                    {std}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0E1520] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            {locale === 'fr'
              ? 'Intégré au graphe de connaissances EPEDE Domaine ' + equipment.epedeDomainCode
              : 'Linked to EPEDE Knowledge Graph Domain ' + equipment.epedeDomainCode}
          </span>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onOpenSimulation && (
              <button
                type="button"
                onClick={onOpenSimulation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-all"
                title={locale === 'fr' ? 'Lancer le banc de simulation' : 'Launch Simulation Lab'}
              >
                <Activity className="h-3.5 w-3.5 text-sky-400" />
                <span>{locale === 'fr' ? 'Simulateur' : 'Simulation'}</span>
              </button>
            )}

            {onOpenProtection && (
              <button
                type="button"
                onClick={onOpenProtection}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-all"
                title={locale === 'fr' ? 'Ouvrir Studio de Protection TCC' : 'Open Protection Studio'}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>{locale === 'fr' ? 'Protection' : 'Protection'}</span>
              </button>
            )}

            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-all"
                title={locale === 'fr' ? 'Ouvrir calculateur dimensionnement' : 'Open Sizing Calculator'}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
                <span>{locale === 'fr' ? 'Calculs' : 'Calc'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenInEpedeDomain(equipment.epedeDomainCode, equipment.canonicalEquipmentId)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Dossier EPEDE' : 'EPEDE Dossier'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
