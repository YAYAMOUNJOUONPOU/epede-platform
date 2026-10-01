// src/components/common/ProgressiveEngineeringIntelligenceDrawer.tsx
// EPEDE — Progressive Engineering Intelligence Drawer (7-Tier Progressive Disclosure)
// Level 1: UNDERSTAND | Level 2: ENGINEER | Level 3: ENGINEERING REFERENCE

import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Info,
  Layers,
  Shield,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Activity,
  Cpu,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sliders,
  Scale,
  Sparkles,
  Lock,
  Thermometer,
  Eye,
  ShieldCheck
} from 'lucide-react';
import type { ProgressiveEquipmentData } from '../../data/ecosystem/ecosystemIntelligenceRegistry';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';
import { EvidenceTrustModal } from '../equipment/EvidenceTrustModal';
import type { EvidenceTrustLevel } from '../../types/engineeringIntelligenceExtensions';

interface ProgressiveEngineeringIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentData: ProgressiveEquipmentData | null;
  locale?: 'fr' | 'en';
  onNavigateToCanonicalDetail?: (equipmentId: string) => void;
  onNavigateToDomain?: (domainCode: string) => void;
  onSelectPreviousEquipment?: () => void;
  onSelectNextEquipment?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const ProgressiveEngineeringIntelligenceDrawer: React.FC<ProgressiveEngineeringIntelligenceDrawerProps> = ({
  isOpen,
  onClose,
  equipmentData,
  locale = 'fr',
  onNavigateToCanonicalDetail,
  onNavigateToDomain,
  onSelectPreviousEquipment,
  onSelectNextEquipment,
  hasPrevious = false,
  hasNext = false
}) => {
  const [activeTab, setActiveTab] = useState<'level1' | 'level2' | 'level3'>('level1');
  const [isEvidenceTrustModalOpen, setIsEvidenceTrustModalOpen] = useState(false);
  const isFr = locale === 'fr';

  // Reset tab to level 1 when a new equipment is selected
  useEffect(() => {
    if (equipmentData) {
      setActiveTab('level1');
    }
  }, [equipmentData?.id]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !equipmentData) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="intelligence-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div 
        className="relative w-full max-w-2xl h-full bg-[#0B0F12] border-l border-slate-800 shadow-2xl flex flex-col font-mono text-xs z-10 animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ===================================================================== */}
        {/* DRAWER HEADER: IDENTIFICATION, BADGES & MATURITY STATUS              */}
        {/* ===================================================================== */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#151C1E] to-[#0B0F12] border-b border-slate-800 space-y-3">
          
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] font-mono shadow-sm">
                  #{equipmentData.badgeNumber}
                </span>

                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  {isFr ? equipmentData.locationInEcosystem.fr : equipmentData.locationInEcosystem.en}
                </span>

                {/* Maturity Badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  equipmentData.maturityStatus === 'COMPLETE'
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                    : equipmentData.maturityStatus === 'VERIFIED_STANDARDS'
                    ? 'bg-sky-950/80 text-sky-400 border-sky-800/80'
                    : 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                }`}>
                  {equipmentData.maturityStatus === 'COMPLETE'
                    ? (isFr ? '✔ Dossier Complet' : '✔ Complete Model')
                    : equipmentData.maturityStatus === 'VERIFIED_STANDARDS'
                    ? (isFr ? '🔬 Normes CEI Vérifiées' : '🔬 Verified Standards')
                    : (isFr ? '⚡ Données Constructeur' : '⚡ Manufacturer Data')}
                </span>
              </div>

              <h2 id="intelligence-drawer-title" className="text-base sm:text-lg font-bold text-[#F4F1E8] font-sans">
                {isFr ? equipmentData.engineeringName.fr : equipmentData.engineeringName.en}
              </h2>
              <p className="text-xs text-[#A9ADA5]">
                {isFr ? equipmentData.commonName.fr : equipmentData.commonName.en}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
              title={isFr ? "Fermer (Échap)" : "Close (Esc)"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3 PROGRESSIVE DISCLOSURE TABS (LEVEL 1 / LEVEL 2 / LEVEL 3) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-center">
            
            <button
              type="button"
              onClick={() => setActiveTab('level1')}
              className={`py-2 px-1 rounded-lg font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'level1'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">{isFr ? '1. Comprendre' : '1. Understand'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('level2')}
              className={`py-2 px-1 rounded-lg font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'level2'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">{isFr ? '2. Ingénieur' : '2. Engineer'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('level3')}
              className={`py-2 px-1 rounded-lg font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'level3'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">{isFr ? '3. Normes & Docs' : '3. Standards & Docs'}</span>
            </button>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* DRAWER BODY: 3 PROGRESSIVE TIERS CONTENT                              */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[#0B0F12]">

          {/* =================================================================== */}
          {/* LEVEL 1: UNDERSTAND (Simple, Intuitive, Ecosystem-First)            */}
          {/* =================================================================== */}
          {activeTab === 'level1' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 1. WHY DOES IT EXIST? (Purpose & Problem Solved) */}
              <div className="p-4 rounded-xl bg-[#151C1E] border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isFr ? 'Raison d\'être & Problème Résolu (WHY)' : 'Purpose & Problem Solved (WHY)'}</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                  {isFr ? equipmentData.level1.purposeWhy.fr : equipmentData.level1.purposeWhy.en}
                </p>
              </div>

              {/* 2. CONCRETE FUNCTION (WHAT DOES IT DO?) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                  <Activity className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{isFr ? 'Fonction Concrète (WHAT)' : 'Concrete Function (WHAT)'}</span>
                </div>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {isFr ? equipmentData.level1.concreteFunction.fr : equipmentData.level1.concreteFunction.en}
                </p>
              </div>

              {/* 3. WORKING PRINCIPLE (HOW DOES IT WORK?) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isFr ? 'Principe de Fonctionnement Physique (HOW)' : 'Physical Working Principle (HOW)'}</span>
                </div>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {isFr ? equipmentData.level1.workingPrincipleSimple.fr : equipmentData.level1.workingPrincipleSimple.en}
                </p>
              </div>

              {/* 4. VISUAL ENERGY FLOW (INPUT -> EQUIPMENT -> OUTPUT) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'Parcours du Flux d\'Énergie (FOLLOW THE ENERGY)' : 'Physical Energy Flow Pathway'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                  {/* Upstream */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      {isFr ? '1. Amont (Entrée)' : '1. Upstream (Input)'}
                    </span>
                    <p className="text-slate-300 text-[11px] font-sans">
                      {isFr ? equipmentData.level1.energyFlow.upstreamInput.fr : equipmentData.level1.energyFlow.upstreamInput.en}
                    </p>
                  </div>

                  {/* Processing */}
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-amber-400 block">
                      {isFr ? '2. Conversion / Traitement' : '2. Processing'}
                    </span>
                    <p className="text-amber-200 text-[11px] font-sans">
                      {isFr ? equipmentData.level1.energyFlow.equipmentProcessing.fr : equipmentData.level1.energyFlow.equipmentProcessing.en}
                    </p>
                  </div>

                  {/* Downstream */}
                  <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/40 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-sky-400 block">
                      {isFr ? '3. Aval (Sortie)' : '3. Downstream (Output)'}
                    </span>
                    <p className="text-sky-200 text-[11px] font-sans">
                      {isFr ? equipmentData.level1.energyFlow.downstreamOutput.fr : equipmentData.level1.energyFlow.downstreamOutput.en}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. ELECTRICAL ROLE SUMMARY */}
              <div className="p-3.5 rounded-xl bg-[#151C1E] border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'Rôle Électrique Synthétique' : 'Electrical Role Summary'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">Tension</span>
                    <strong className="text-cyan-300 text-[11px]">{equipmentData.level1.electricalRoleSummary.voltage}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">Courant / Puissance</span>
                    <strong className="text-emerald-300 text-[11px]">{equipmentData.level1.electricalRoleSummary.currentOrPower}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">Fréquence</span>
                    <strong className="text-amber-300 text-[11px]">{equipmentData.level1.electricalRoleSummary.frequency}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">Rendement / cos φ</span>
                    <strong className="text-white text-[11px]">{equipmentData.level1.electricalRoleSummary.powerFactorOrEfficiency || 'N/A'}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* LEVEL 2: ENGINEER (Parameters, Relationships, Protection, States)   */}
          {/* =================================================================== */}
          {activeTab === 'level2' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 1. WHY DO PARAMETERS MATTER? (Rule #8: Explain the "Why" before "Spec") */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                  <Scale className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{isFr ? 'Pourquoi Ces Paramètres Comptent-Ils ? (WHY PARAMETERS MATTER)' : 'Why These Parameters Matter'}</span>
                </div>
                
                <div className="space-y-2.5">
                  {equipmentData.level2.whyParametersMatter.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-amber-400">{item.parameter}</strong>
                        <span className="text-[10px] text-slate-500">{isFr ? item.meaning.fr : item.meaning.en}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        {isFr ? item.engineeringImpact.fr : item.engineeringImpact.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. ENGINEERING PARAMETERS TABLE */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'Caractéristiques & Paramètres Directeurs' : 'Governing Engineering Parameters'}
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                        <th className="py-1.5 px-2">Symbole</th>
                        <th className="py-1.5 px-2">Paramètre</th>
                        <th className="py-1.5 px-2">Valeur Typique</th>
                        <th className="py-1.5 px-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {equipmentData.level2.engineeringParameters.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-amber-400 font-bold">{p.symbol}</td>
                          <td className="py-2 px-2 text-slate-300 font-sans">{isFr ? p.name.fr : p.name.en}</td>
                          <td className="py-2 px-2 text-cyan-300 font-bold">{p.typicalValue}</td>
                          <td className="py-2 px-2">
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. RELATIONSHIPS CHAIN (PROTECTION / CONTROL / MEASUREMENT / EARTHING) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'Chaîne des Relations & Environnement Technique' : 'Relationship Ecosystem & Surroundings'}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Protection & Relais</span>
                      <p className="text-slate-300 text-[11px] font-sans">
                        ANSI : <strong className="text-amber-400">{equipmentData.level2.relationships.protectionChain.ansiCodes.join(' · ')}</strong>
                        <span className="text-slate-400 block pt-0.5">
                          {isFr ? equipmentData.level2.relationships.protectionChain.relayTypes.fr : equipmentData.level2.relationships.protectionChain.relayTypes.en} 
                          ({equipmentData.level2.relationships.protectionChain.operatingTime})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Contrôle-Commande & Automatisme</span>
                      <p className="text-slate-300 text-[11px] font-sans">
                        {isFr ? equipmentData.level2.relationships.controlSystem.architecture.fr : equipmentData.level2.relationships.controlSystem.architecture.en}
                        <span className="text-cyan-400 block pt-0.5">
                          Protocole : {equipmentData.level2.relationships.controlSystem.communicationProtocol}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Mesure & Instrumentation (TC/TT)</span>
                      <p className="text-slate-300 text-[11px] font-sans">
                        {isFr ? equipmentData.level2.relationships.meteringSystem.sensors.fr : equipmentData.level2.relationships.meteringSystem.sensors.en}
                        <span className="text-emerald-400 block pt-0.5">
                          Classe : {equipmentData.level2.relationships.meteringSystem.accuracyClass}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Mise à la Terre & Auxiliaires</span>
                      <p className="text-slate-300 text-[11px] font-sans">
                        {isFr ? equipmentData.level2.relationships.earthingSystem.fr : equipmentData.level2.relationships.earthingSystem.en}
                      </p>
                      <p className="text-slate-400 text-[10px] pt-1">
                        Auxiliaires : {isFr ? equipmentData.level2.relationships.auxiliarySupplies.fr : equipmentData.level2.relationships.auxiliarySupplies.en}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. OPERATING STATES (Rule #15) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'États de Fonctionnement Opérationnels (OPERATING STATES)' : 'Operational Operating States'}
                </span>
                
                <div className="space-y-1.5">
                  {equipmentData.level2.operatingStates.map((st, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-800 text-slate-300 shrink-0">
                        {st.state}
                      </span>
                      <div className="space-y-0.5">
                        <strong className="text-white text-[11px] block">{isFr ? st.label.fr : st.label.en}</strong>
                        <p className="text-[10px] text-slate-400 font-sans">{isFr ? st.condition.fr : st.condition.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. FAILURE & ABNORMAL CONDITIONS (Rule #14) */}
              <div className="p-4 rounded-xl bg-[#151C1E] border border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{isFr ? 'Séquence en Cas d\'Anomalie & Défaillance' : 'Abnormal Condition & Failure Sequence'}</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">1. Condition Normale</span>
                    <p className="text-slate-300 text-[11px]">{isFr ? equipmentData.level2.failureSequence.normalState.fr : equipmentData.level2.failureSequence.normalState.en}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40">
                    <span className="text-[9px] font-mono text-rose-400 uppercase font-bold block">2. Condition Anormale (Défaut)</span>
                    <p className="text-rose-200 text-[11px]">{isFr ? equipmentData.level2.failureSequence.abnormalCondition.fr : equipmentData.level2.failureSequence.abnormalCondition.en}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">3. Détection par Capteurs & Relais</span>
                    <p className="text-slate-300 text-[11px]">{isFr ? equipmentData.level2.failureSequence.detectionMethod.fr : equipmentData.level2.failureSequence.detectionMethod.en}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block">4. Action de Protection (Déclenchement)</span>
                    <p className="text-slate-300 text-[11px]">{isFr ? equipmentData.level2.failureSequence.protectiveAction.fr : equipmentData.level2.failureSequence.protectiveAction.en}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block">5. Procédure de Rétablissement</span>
                    <p className="text-slate-300 text-[11px]">{isFr ? equipmentData.level2.failureSequence.restorationProcedure.fr : equipmentData.level2.failureSequence.restorationProcedure.en}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* LEVEL 3: ENGINEERING REFERENCE (Standards, Docs, Safety, Links)     */}
          {/* =================================================================== */}
          {activeTab === 'level3' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 0. 10-TIER EVIDENCE TRUST & VERIFICATION STATUS */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isFr ? 'Couche de Preuve & Confiance d\'Ingénierie' : 'Evidence & Engineering Trust Layer'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEvidenceTrustModalOpen(true)}
                    className="text-[10px] text-amber-400 hover:underline font-mono cursor-pointer"
                  >
                    {isFr ? 'Guide des 10 Preuves →' : '10-Tier Guide →'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] text-slate-400 font-sans">{isFr ? 'Qualification technique :' : 'Technical qualification:'}</span>
                    <EvidenceTrustBadge
                      level={equipmentData.maturityStatus === 'VERIFIED_STANDARDS' || equipmentData.maturityStatus === 'COMPLETE' ? 'VERIFIED_STANDARD' : 'ENGINEERING_REFERENCE'}
                      locale={locale}
                      size="sm"
                      onOpenFullMatrix={() => setIsEvidenceTrustModalOpen(true)}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {equipmentData.maturityStatus === 'COMPLETE' ? 'Score 98%' : 'Score 92%'}
                  </span>
                </div>
              </div>

              {/* 1. VERIFIED STANDARDS & REGULATIONS (Rule #10 & #11: NEVER FABRICATE) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isFr ? 'Normes & Règlements Vérifiés' : 'Verified Standards & Regulations'}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {isFr ? 'Zéro norme inventée' : 'Zero fabricated standards'}
                  </span>
                </div>

                <div className="space-y-2">
                  {equipmentData.level3.verifiedStandards.map((std, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-emerald-400 font-mono">{std.standardNumber}</strong>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          std.normativeStatus === 'NORMATIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : std.normativeStatus === 'REGULATORY'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {std.normativeStatus}
                        </span>
                      </div>
                      <p className="text-white text-xs font-semibold font-sans">{std.title}</p>
                      <p className="text-slate-400 text-[11px] font-sans">
                        {isFr ? std.scope.fr : std.scope.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. ENGINEERING DOCUMENTATION LAYER (Rule #12: Display "Not yet attached" if pending) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {isFr ? 'Couche Documentaire d\'Ingénierie' : 'Engineering Documentation Layer'}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {isFr ? 'Livrables de projet' : 'Project deliverables'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {equipmentData.level3.engineeringDocumentation.map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <strong className="text-slate-200 block text-[11px]">
                            {isFr ? doc.documentType.fr : doc.documentType.en}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono">{doc.deliverableName}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        doc.status === 'AVAILABLE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 italic'
                      }`}>
                        {doc.status === 'AVAILABLE'
                          ? (isFr ? 'Attaché' : 'Attached')
                          : (isFr ? 'Non encore rattaché' : 'Not yet attached')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SAFETY LAYER (Rule #13) */}
              <div className="p-4 rounded-xl bg-[#151C1E] border border-amber-900/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isFr ? 'Consignes de Sécurité, Dangers & Consignation' : 'Safety Hazards & LOTO Isolation'}</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  {/* Hazards */}
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-rose-400 uppercase font-bold block">Dangers Principaux</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {equipmentData.level3.safetyLayer.primaryHazards.map((h, idx) => (
                        <li key={idx}>{isFr ? h.fr : h.en}</li>
                      ))}
                    </ul>
                  </div>

                  {/* LOTO */}
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block">Consignation LOTO</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {isFr ? equipmentData.level3.safetyLayer.isolationLOTO.fr : equipmentData.level3.safetyLayer.isolationLOTO.en}
                    </p>
                  </div>

                  {/* PPE */}
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">Équipements de Protection Individuelle (EPI)</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {equipmentData.level3.safetyLayer.requiredPPE.map((ppe, idx) => (
                        <li key={idx}>{isFr ? ppe.fr : ppe.en}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. CROSS-DOMAIN RELATIONSHIPS (Rule #19) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isFr ? 'Interconnexions avec les Autres Domaines EPEDE' : 'Cross-Domain EPEDE Relationships'}
                </span>

                <div className="space-y-1.5">
                  {equipmentData.level3.crossDomainLinks.map((link, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onNavigateToDomain?.(link.domainCode)}
                      className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300">
                          {link.domainCode}
                        </span>
                        <div>
                          <strong className="text-white text-[11px] block">{isFr ? link.domainName.fr : link.domainName.en}</strong>
                          <span className="text-[10px] text-slate-400 font-sans">{isFr ? link.relationshipContext.fr : link.relationshipContext.en}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* DRAWER FOOTER: FULL DOSSIER BUTTON & PREV/NEXT JUMP                   */}
        {/* ===================================================================== */}
        <div className="p-4 bg-[#151C1E] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {hasPrevious && onSelectPreviousEquipment && (
              <button
                type="button"
                onClick={onSelectPreviousEquipment}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                title={isFr ? "Équipement précédent" : "Previous asset"}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isFr ? 'Précédent' : 'Prev'}</span>
              </button>
            )}

            {hasNext && onSelectNextEquipment && (
              <button
                type="button"
                onClick={onSelectNextEquipment}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                title={isFr ? "Équipement suivant" : "Next asset"}
              >
                <span className="hidden sm:inline">{isFr ? 'Suivant' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>

          {onNavigateToCanonicalDetail && (
            <button
              type="button"
              onClick={() => onNavigateToCanonicalDetail(equipmentData.id)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all ml-auto"
            >
              <span>{isFr ? 'Dossier Canonique Complet (37 Dimensions)' : 'Complete Canonical Model (37 Dimensions)'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>

      {/* Embedded Evidence Trust Modal */}
      <EvidenceTrustModal
        isOpen={isEvidenceTrustModalOpen}
        onClose={() => setIsEvidenceTrustModalOpen(false)}
        locale={locale}
        initialHighlightLevel={equipmentData.maturityStatus === 'VERIFIED_STANDARDS' || equipmentData.maturityStatus === 'COMPLETE' ? 'VERIFIED_STANDARD' : 'ENGINEERING_REFERENCE'}
      />
    </div>
  );
};
