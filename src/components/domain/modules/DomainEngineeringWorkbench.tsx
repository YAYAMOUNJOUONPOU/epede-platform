// src/components/domain/modules/DomainEngineeringWorkbench.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Wrench, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  Radio, 
  Gauge, 
  Users, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Globe, 
  Sliders, 
  HelpCircle,
  ExternalLink,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import type { DomainCode, Equipment } from '../../../types/epede';
import { DOMAINS, EQUIPMENT_ITEMS, STANDARDS, ENGINEERING_ROLES } from '../../../data/epedeData';
import { DOMAIN_WORKBENCH_DATA, DomainWorkbenchProfile } from './domainWorkbenchData';
import { InteractiveScadaHmiView } from '../../visual/InteractiveScadaHmiView';
import { InteractiveSldDiagram } from '../../visual/InteractiveSldDiagram';
import { InteractiveProtectionTripDiagram } from '../../visual/InteractiveProtectionTripDiagram';
import { EngineeringLayersExploration } from '../../visual/EngineeringLayersExploration';
import { DomainDocumentationSection } from '../../docs/DomainDocumentationSection';

interface DomainEngineeringWorkbenchProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onSelectStandard?: (ref: string) => void;
  onSelectRole?: (slug: string) => void;
  onNavigateDomain?: (code: DomainCode) => void;
  onNavigateCalculator?: (tab: string) => void;
  onNavigateSimulation?: (tab: string) => void;
}

export const DomainEngineeringWorkbench: React.FC<DomainEngineeringWorkbenchProps> = ({
  domainCode,
  locale,
  onSelectEquipment,
  onSelectStandard,
  onSelectRole,
  onNavigateDomain,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const profile: DomainWorkbenchProfile = DOMAIN_WORKBENCH_DATA[domainCode] || DOMAIN_WORKBENCH_DATA['D07'];
  const [activeSection, setActiveSection] = useState<'architecture' | 'equipment' | 'protection' | 'control' | 'disciplines' | 'casestudy' | 'layers' | 'documentation'>('architecture');
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = useState<number>(0);
  const [simSliderValue, setSimSliderValue] = useState<number>(profile.interactiveDemo?.initialValue || 50);

  const currentDomain = DOMAINS.find(d => d.code === domainCode) || DOMAINS[6];

  return (
    <div className="space-y-8 font-sans text-neutral-200">
      
      {/* 1. HERO & DOMAIN IDENTITY HEADER */}
      <div className="rounded-3xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-widest uppercase bg-[#151C1E] text-amber-400 border border-amber-500/30">
                {domainCode} · {locale === 'fr' ? 'INGÉNIERIE SPÉCIALISÉE' : 'SPECIALIZED ENGINEERING'}
              </span>
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {locale === 'fr' ? 'Système & Actifs Validés CEI / IEEE' : 'IEC / IEEE Validated Systems'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              {locale === 'fr' ? profile.titleFr : profile.titleEn}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              {locale === 'fr' ? profile.summaryFr : profile.summaryEn}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex md:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-xl border border-[#252E38] bg-[#151C1E] font-mono text-center">
              <div className="text-xs text-neutral-400 uppercase">{locale === 'fr' ? 'Tension de Service' : 'Operating Voltage'}</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{profile.voltageRange}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-[#252E38] bg-[#151C1E] font-mono text-center">
              <div className="text-xs text-neutral-400 uppercase">{locale === 'fr' ? 'Norme Maîtresse' : 'Lead Standard'}</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{profile.primaryStandard}</div>
            </div>
          </div>
        </div>

        {/* System Inputs -> Domain -> Outputs Flow Bar */}
        <div className="mt-8 pt-6 border-t border-[#252E38]/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#151C1E]/60 border border-[#252E38] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold shrink-0">IN</div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-neutral-400">{locale === 'fr' ? 'Entrées & Flux Amont' : 'Inputs & Upstream Feeds'}</div>
              <div className="text-sm font-semibold text-white mt-1">{locale === 'fr' ? profile.inputsFr : profile.inputsEn}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151C1E]/60 border border-amber-500/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-bold shrink-0">CORE</div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-amber-400">{domainCode} · {locale === 'fr' ? 'Transformation du Domaine' : 'Domain Function'}</div>
              <div className="text-sm font-semibold text-white mt-1">{locale === 'fr' ? profile.coreTransformFr : profile.coreTransformEn}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151C1E]/60 border border-[#252E38] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold shrink-0">OUT</div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-neutral-400">{locale === 'fr' ? 'Sorties & Usagers Aval' : 'Outputs & Downstream Nodes'}</div>
              <div className="text-sm font-semibold text-white mt-1">{locale === 'fr' ? profile.outputsFr : profile.outputsEn}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR ACROSS 6 ENGINEERING WORKBENCH SECTIONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'architecture', labelFr: '01. Architecture & Procédés', labelEn: '01. Architecture & Process', icon: Layers },
          { id: 'equipment', labelFr: '02. Équipements & Fiches Réelles', labelEn: '02. Real Equipment Dossiers', icon: Cpu },
          { id: 'protection', labelFr: '03. Protection & Défaillances', labelEn: '03. Protection & Fault Physics', icon: ShieldAlert },
          { id: 'control', labelFr: '04. Contrôle & Téléconduite', labelEn: '04. Control & Automation', icon: Sliders },
          { id: 'disciplines', labelFr: '05. Métiers & Échanges Techniques', labelEn: '05. Disciplines & Interactions', icon: Users },
          { id: 'casestudy', labelFr: '06. Références & Cameroun', labelEn: '06. Benchmarks & Cameroon', icon: Globe },
          { id: 'layers', labelFr: '07. 6 Couches Systèmes', labelEn: '07. 6 System Layers', icon: Layers },
          { id: 'documentation', labelFr: '08. Dossiers & Spécifications (Sec 3-4)', labelEn: '08. Docs & Specs (Sec 3-4)', icon: FolderOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                isActive
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                  : 'border-[#252E38] bg-[#0B0F12] text-neutral-400 hover:text-white hover:border-[#3E4C59]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. WORKBENCH SECTION CONTENT */}
      
      {/* SECTION 1: SYSTEM ARCHITECTURE & PROCESS FLOW */}
      {activeSection === 'architecture' && (
        <div className="space-y-8">
          {/* Engineering Process Diagram */}
          <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-amber-400">◈</span>
                  <span>{locale === 'fr' ? 'Architecture du Procédé & Écoulement Électrique' : 'Process Architecture & Power Flow'}</span>
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {locale === 'fr' ? 'Schéma synoptique détaillé des sous-systèmes interconnectés et points de couplage' : 'Detailed functional block layout of interconnected subsystems and coupling points'}
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#151C1E] text-neutral-300 border border-[#252E38]">
                CEI 60617 / IEEE 315
              </span>
            </div>

            {/* Visual Process Architecture Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {profile.architectureStages.map((stage, idx) => (
                <div key={idx} className="relative p-5 rounded-xl border border-[#252E38] bg-[#151C1E] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                      <span>ÉTAPE 0{idx + 1}</span>
                      <span className="font-bold text-amber-400">{stage.tag}</span>
                    </div>
                    <h4 className="font-mono text-sm font-bold text-white uppercase">
                      {locale === 'fr' ? stage.nameFr : stage.nameEn}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {locale === 'fr' ? stage.descFr : stage.descEn}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#252E38] flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>{stage.parameter}</span>
                    <span>{stage.nominalValue}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Physics & Design Simulator Box */}
            {profile.interactiveDemo && (
              <div className="rounded-xl border border-amber-500/30 bg-[#151C1E]/80 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-amber-300 uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <span>{locale === 'fr' ? profile.interactiveDemo.titleFr : profile.interactiveDemo.titleEn}</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">
                      {locale === 'fr' ? profile.interactiveDemo.descFr : profile.interactiveDemo.descEn}
                    </p>
                  </div>
                  <div className="font-mono text-xs px-3 py-1 rounded bg-[#0B0F12] text-amber-400 border border-amber-500/40">
                    {profile.interactiveDemo.paramName} = {simSliderValue} {profile.interactiveDemo.unit}
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={profile.interactiveDemo.min}
                    max={profile.interactiveDemo.max}
                    step={profile.interactiveDemo.step}
                    value={simSliderValue}
                    onChange={(e) => setSimSliderValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#0B0F12] rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between font-mono text-[11px] text-neutral-500">
                    <span>{profile.interactiveDemo.min} {profile.interactiveDemo.unit}</span>
                    <span>{profile.interactiveDemo.max} {profile.interactiveDemo.unit}</span>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {profile.interactiveDemo.calculate(simSliderValue).map((res, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38] font-mono">
                      <div className="text-[11px] text-neutral-400">{locale === 'fr' ? res.labelFr : res.labelEn}</div>
                      <div className="text-base font-bold text-white mt-0.5">{res.value} <span className="text-xs text-amber-400">{res.unit}</span></div>
                      <div className="text-[10px] text-neutral-500 mt-1">{locale === 'fr' ? res.statusFr : res.statusEn}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Single-Line Diagram */}
          <div className="mt-8">
            <InteractiveSldDiagram
              initialTopology={
                ['D01', 'D09'].includes(domainCode) ? 'generation_transmission' :
                ['D02', 'D03', 'D04', 'D11'].includes(domainCode) ? 'substation_double_bus' :
                ['D05', 'D14', 'D15'].includes(domainCode) ? 'distribution_feeder' :
                'industrial_mcc'
              }
              locale={locale}
              onSelectEquipment={onSelectEquipment}
              onSelectStandard={onSelectStandard}
            />
          </div>
        </div>
      )}

      {/* SECTION 2: REAL EQUIPMENT DOSSIERS */}
      {activeSection === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Apparatus Selector List */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {locale === 'fr' ? 'APPAREILS MAJEURS DU DOMAINE' : 'MAJOR DOMAIN APPARATUS'}
              </h3>
              <div className="space-y-2">
                {profile.equipmentList.map((eq, index) => {
                  const isSelected = selectedEquipmentIndex === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedEquipmentIndex(index)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-white shadow-md ring-1 ring-amber-400/30'
                          : 'border-[#252E38] bg-[#0B0F12] text-neutral-400 hover:border-[#3E4C59] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-amber-400 font-bold">{eq.tag}</span>
                        <span className="text-[11px] text-neutral-500">{eq.standard}</span>
                      </div>
                      <div className="font-mono text-sm font-bold mt-1 text-white">
                        {locale === 'fr' ? eq.nameFr : eq.nameEn}
                      </div>
                      <div className="text-xs text-neutral-400 font-sans line-clamp-1 mt-1">
                        {locale === 'fr' ? eq.roleFr : eq.roleEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Apparatus Deep Technical Card */}
            {profile.equipmentList[selectedEquipmentIndex] && (() => {
              const eq = profile.equipmentList[selectedEquipmentIndex];
              return (
                <div className="lg:col-span-2 rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252E38] pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {eq.tag} · {eq.category}
                        </span>
                        <span className="font-mono text-xs text-neutral-400">{eq.standard}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                        {locale === 'fr' ? eq.nameFr : eq.nameEn}
                      </h3>
                    </div>
                    {eq.epedeEquipmentId && onSelectEquipment && (
                      <button
                        type="button"
                        onClick={() => onSelectEquipment(eq.epedeEquipmentId!)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-colors"
                      >
                        <span>{locale === 'fr' ? 'Dossier 30 Sections' : '30-Section Dossier'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-mono text-xs font-bold uppercase text-neutral-400 tracking-wider">
                        {locale === 'fr' ? 'Rôle & Principe de Fonctionnement' : 'Purpose & Working Principle'}
                      </h4>
                      <p className="text-sm text-neutral-200 mt-1 leading-relaxed font-sans">
                        {locale === 'fr' ? eq.workingPrincipleFr : eq.workingPrincipleEn}
                      </p>
                    </div>

                    {/* Sub-Components Breakdown */}
                    <div>
                      <h4 className="font-mono text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2">
                        {locale === 'fr' ? 'Composants Principaux' : 'Main Internal Components'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(locale === 'fr' ? eq.componentsFr : eq.componentsEn).map((comp, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#151C1E] border border-[#252E38] text-xs font-mono flex items-center gap-2 text-neutral-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Ratings Table */}
                    <div>
                      <h4 className="font-mono text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2">
                        {locale === 'fr' ? 'Grandeurs & Paramètres Assignés (Ratings)' : 'Key Electrical Ratings'}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {eq.ratings.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38] font-mono">
                            <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? r.labelFr : r.labelEn}</div>
                            <div className="text-sm font-bold text-white mt-0.5">{r.value} <span className="text-xs text-amber-400">{r.unit}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Critical Failure Modes */}
                    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-1">
                      <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{locale === 'fr' ? 'Modes de Défaillance Critiques & Surveillance' : 'Critical Failure Modes & Monitoring'}</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                        {locale === 'fr' ? eq.failureModesFr : eq.failureModesEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 3: PROTECTION & FAULT PHYSICS */}
      {activeSection === 'protection' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
              <div>
                <h3 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>{locale === 'fr' ? 'Philosophie de Protection & Fonctions ANSI' : 'Protection Philosophy & ANSI Functions'}</span>
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {locale === 'fr' ? 'Surveillance des grandeurs physiques, détection d\'anomalies et discrimination sélective' : 'Electrical parameter monitoring, fault anomaly detection, and selective tripping'}
                </p>
              </div>
              <span className="font-mono text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
                Temps d'élimination : &lt; {profile.faultClearingTime}
              </span>
            </div>

            {/* ANSI Relays Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.protections.map((prot, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-[#252E38] bg-[#151C1E] space-y-3">
                  <div className="flex items-center justify-between font-mono">
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                      ANSI {prot.ansiCode}
                    </span>
                    <span className="text-[11px] text-neutral-500">{prot.standard}</span>
                  </div>
                  <h4 className="font-mono text-sm font-bold text-white uppercase">
                    {locale === 'fr' ? prot.nameFr : prot.nameEn}
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {locale === 'fr' ? prot.principleFr : prot.principleEn}
                  </p>
                  <div className="pt-2 border-t border-[#252E38] font-mono text-[11px] text-amber-400">
                    <span className="text-neutral-500">{locale === 'fr' ? 'Réglage type : ' : 'Typical setting: '}</span>
                    {prot.typicalSetting}
                  </div>
                </div>
              ))}
            </div>

            {/* What Happens During a Fault Sequence */}
            <div className="rounded-xl border border-[#252E38] bg-[#151C1E] p-5 space-y-3">
              <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>{locale === 'fr' ? 'Chronologie de Déclenchement sur Défaut Majeur' : 'Sequence of Events During Severe Fault'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
                {profile.faultSequence.map((step, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38] space-y-1">
                    <div className="text-rose-400 font-bold">{step.time}</div>
                    <div className="text-white font-semibold">{locale === 'fr' ? step.eventFr : step.eventEn}</div>
                    <div className="text-[11px] text-neutral-400">{locale === 'fr' ? step.detailFr : step.detailEn}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Real-Time Fault & Protection Trip Animation */}
            <div className="mt-8">
              <InteractiveProtectionTripDiagram
                locale={locale}
                faultCurrentKa={['D03', 'D04'].includes(domainCode) ? 40 : 25}
                relayType={domainCode === 'D04' ? 'ANSI 87T' : 'ANSI 50/51'}
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CONTROL, AUTOMATION & SCADA */}
      {activeSection === 'control' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-4">
              <div>
                <h3 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Contrôle-Commande, Capteurs & Automatisation' : 'Control Systems, Sensors & Automation'}</span>
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {locale === 'fr' ? 'Régulation locale vs téléconduite dispatching, protocoles de communication et instrumentation' : 'Local closed-loop vs dispatching remote control, field protocols, and instrumentation'}
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#151C1E] text-cyan-300 border border-cyan-500/30">
                SCADA / PLC / RTU
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monitored Parameters & Sensors */}
              <div className="p-5 rounded-xl border border-[#252E38] bg-[#151C1E] space-y-4">
                <h4 className="font-mono text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Grandeurs Mesurées & Capteurs' : 'Monitored Quantities & Instrumentation'}</span>
                </h4>
                <div className="space-y-2.5">
                  {profile.monitoredParameters.map((param, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38] flex items-center justify-between font-mono text-xs">
                      <div>
                        <div className="font-bold text-white">{locale === 'fr' ? param.nameFr : param.nameEn}</div>
                        <div className="text-[11px] text-neutral-400">{locale === 'fr' ? param.sensorFr : param.sensorEn}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">{param.rate}</div>
                        <div className="text-[10px] text-neutral-500">{param.protocol}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Control Architecture Hierarchy */}
              <div className="p-5 rounded-xl border border-[#252E38] bg-[#151C1E] space-y-4">
                <h4 className="font-mono text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Niveaux de Conduite & Verrouillages' : 'Control Hierarchy & Permissives'}</span>
                </h4>
                <div className="space-y-3 font-sans text-xs">
                  {profile.controlLevels.map((lvl, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38] space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-cyan-400 font-bold">{lvl.level}</span>
                        <span className="text-[10px] text-neutral-500">{lvl.response}</span>
                      </div>
                      <div className="font-bold text-white font-mono text-sm">{locale === 'fr' ? lvl.nameFr : lvl.nameEn}</div>
                      <div className="text-neutral-300 leading-relaxed">{locale === 'fr' ? lvl.descFr : lvl.descEn}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive SCADA / HMI Telecontrol Screen */}
            <div className="mt-8">
              <InteractiveScadaHmiView
                mode={
                  ['D01', 'D09'].includes(domainCode) ? 'generation' :
                  ['D02', 'D03', 'D04', 'D11', 'D13'].includes(domainCode) ? 'substation' :
                  ['D05', 'D14', 'D15'].includes(domainCode) ? 'distribution' :
                  domainCode === 'D10' ? 'bess' :
                  'industry'
                }
                locale={locale}
                onNavigateEquipment={onSelectEquipment}
                onNavigateStandard={onSelectStandard}
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DISCIPLINES & INTERACTIONS */}
      {activeSection === 'disciplines' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#252E38] pb-4">
              <h3 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{locale === 'fr' ? 'Disciplines d\'Ingénierie & Matrice d\'Interactions' : 'Engineering Disciplines & Interaction Matrix'}</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                {locale === 'fr' ? 'Qui interagit avec qui · Quelles données sont échangées · Quelles décisions sont prises' : 'Who interacts with whom · What data is exchanged · What design decisions are made'}
              </p>
            </div>

            <div className="space-y-4">
              {profile.engineeringInteractions.map((inter, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-[#252E38] bg-[#151C1E] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252E38] pb-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{locale === 'fr' ? inter.roleFromFr : inter.roleFromEn}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-cyan-400 font-bold">{locale === 'fr' ? inter.roleToFr : inter.roleToEn}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#0B0F12] text-neutral-400 border border-[#252E38]">
                      {inter.phase}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans pt-1">
                    <div>
                      <span className="font-mono font-bold text-neutral-400 uppercase text-[11px] block">{locale === 'fr' ? 'Données Transmises :' : 'Data Exchanged:'}</span>
                      <span className="text-white font-medium">{locale === 'fr' ? inter.dataExchangedFr : inter.dataExchangedEn}</span>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-neutral-400 uppercase text-[11px] block">{locale === 'fr' ? 'Décision Clé :' : 'Key Decision:'}</span>
                      <span className="text-amber-300 font-medium">{locale === 'fr' ? inter.decisionFr : inter.decisionEn}</span>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-neutral-400 uppercase text-[11px] block">{locale === 'fr' ? 'Impact Réseau :' : 'Grid Impact:'}</span>
                      <span className="text-neutral-300">{locale === 'fr' ? inter.impactFr : inter.impactEn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: BENCHMARKS & CAMEROON CONTEXT */}
      {activeSection === 'casestudy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* International Benchmark */}
            <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {locale === 'fr' ? 'RÉFÉRENCE INTERNATIONALE' : 'INTERNATIONAL BENCHMARK'}
                </span>
                <span className="font-mono text-xs text-neutral-500">{profile.internationalCase.location}</span>
              </div>
              <h3 className="font-mono text-lg font-bold text-white">
                {locale === 'fr' ? profile.internationalCase.titleFr : profile.internationalCase.titleEn}
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <span className="text-neutral-400 block">{locale === 'fr' ? 'Capacité installée :' : 'Installed capacity:'}</span>
                  <span className="text-white font-bold">{profile.internationalCase.capacity}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <span className="text-neutral-400 block">{locale === 'fr' ? 'Spécificité technique :' : 'Technical highlights:'}</span>
                  <span className="text-cyan-300 font-sans font-medium">{locale === 'fr' ? profile.internationalCase.highlightsFr : profile.internationalCase.highlightsEn}</span>
                </div>
              </div>
            </div>

            {/* Cameroon Context */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#0B0F12] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  {locale === 'fr' ? 'APPLICATION RÉELLE AU CAMEROUN' : 'REAL CAMEROON GRID CONTEXT'}
                </span>
                <span className="font-mono text-xs text-neutral-400">SONATREL · ENEO · ARSEL</span>
              </div>
              <h3 className="font-mono text-lg font-bold text-white">
                {locale === 'fr' ? profile.cameroonCase.titleFr : profile.cameroonCase.titleEn}
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <span className="text-neutral-400 block">{locale === 'fr' ? 'Actifs & Localisation :' : 'Asset & Location:'}</span>
                  <span className="text-white font-bold">{profile.cameroonCase.assetLocation}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <span className="text-neutral-400 block">{locale === 'fr' ? 'Défi Technique & Solution Locale :' : 'Technical Challenge & Solution:'}</span>
                  <span className="text-amber-300 font-sans font-medium">{locale === 'fr' ? profile.cameroonCase.notesFr : profile.cameroonCase.notesEn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: 6 SYSTEM LAYERS ARCHITECTURE */}
      {activeSection === 'layers' && (
        <div className="space-y-6">
          <EngineeringLayersExploration
            domainCode={domainCode}
            locale={locale}
          />
        </div>
      )}

      {/* SECTION 8: SECTIONS 3 & 4 FORMAL DOCUMENTATION & STRUCTURED SPECIFICATIONS */}
      {activeSection === 'documentation' && (
        <DomainDocumentationSection
          domainCode={domainCode}
          locale={locale}
          onNavigateEquipment={onSelectEquipment}
          onNavigateStandard={onSelectStandard}
        />
      )}

      {/* 4. CROSS-DOMAIN INTERCONNECTION FOOTER */}
      <div className="rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Liaisons & Navigation Inter-Domaines EPEDE' : 'Cross-Domain EPEDE Relationships'}</span>
          </h4>
          <span className="font-mono text-xs text-neutral-500">
            {profile.relatedDomains.length} {locale === 'fr' ? 'domaines connectés' : 'connected domains'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {profile.relatedDomains.map((rel, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigateDomain?.(rel.code as DomainCode)}
              className="p-3.5 rounded-xl border border-[#252E38] bg-[#151C1E] hover:border-amber-400/60 text-left transition-all group font-mono"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-400 group-hover:text-amber-300">{rel.code}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs font-bold text-white truncate font-sans">
                {locale === 'fr' ? rel.nameFr : rel.nameEn}
              </div>
              <div className="text-[11px] text-neutral-400 font-sans line-clamp-1 mt-0.5">
                {locale === 'fr' ? rel.relationshipFr : rel.relationshipEn}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
