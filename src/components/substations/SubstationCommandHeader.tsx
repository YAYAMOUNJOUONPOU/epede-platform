// src/components/substations/SubstationCommandHeader.tsx
// EPEDE D04 - Substation Engineering Interactive Command Header & 5-Stage Journey Orchestrator

import React from 'react';
import {
  Zap,
  Layers,
  Activity,
  Sliders,
  Scale,
  ShieldAlert,
  ChevronRight,
  Calculator,
  Radio,
  Share2,
  FolderTree,
  Building2,
  Lock,
  Cpu,
  RefreshCw,
  Info,
  Flame,
  AlertTriangle,
  MapPin,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import type { SubstationWorkbenchPillar } from './SubstationsWorkbench';
import {
  CAMEROON_SUBSTATION_NODES,
  type CameroonSubstationNode
} from './services/useSubstationProjectStore';

export type SubstationRepresentationView = 'PHYSICAL' | 'ELECTRICAL_SLD' | 'FUNCTIONAL';
export type SubstationVoltageContext = '400kV' | '225kV' | '110kV' | '90kV' | '30kV';

interface SubstationCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar?: SubstationWorkbenchPillar;
  onSelectPillar?: (pillar: SubstationWorkbenchPillar) => void;
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  activeView: SubstationRepresentationView;
  onSelectView: (view: SubstationRepresentationView) => void;
  selectedSubstationType: string;
  onSelectSubstationType: (typeId: string) => void;
  selectedVoltage: SubstationVoltageContext;
  onSelectVoltage: (v: SubstationVoltageContext) => void;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  currentBreadcrumb?: string[];
  onOpenPrinciplesDrawer?: () => void;
  onOpenDossier?: () => void;
  totalMva?: number;
  scCurrentKa?: number;
}

export const SubstationCommandHeader: React.FC<SubstationCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  activeStage,
  onSelectStage,
  activeView,
  onSelectView,
  selectedSubstationType,
  onSelectSubstationType,
  selectedVoltage,
  onSelectVoltage,
  selectedNodeId = 'BEKOKO_225KV',
  onSelectNode,
  currentBreadcrumb,
  onOpenPrinciplesDrawer,
  onOpenDossier,
  totalMva = 200,
  scCurrentKa = 31.5
}) => {
  const activeNode = CAMEROON_SUBSTATION_NODES[selectedNodeId] || CAMEROON_SUBSTATION_NODES.BEKOKO_225KV;

  const stages = [
    {
      num: 1 as const,
      title_fr: '1. Nœuds & AIS/GIS',
      title_en: '1. Nodes & AIS/GIS',
      sub_fr: 'Écosystème & Climat',
      sub_en: 'Ecosystem & Climate',
      icon: MapPin,
      color: 'amber'
    },
    {
      num: 2 as const,
      title_fr: '2. Travées & Barres',
      title_en: '2. Bays & Busbars',
      sub_fr: 'Topologies & Efforts',
      sub_en: 'Topologies & Forces',
      icon: Layers,
      color: 'sky'
    },
    {
      num: 3 as const,
      title_fr: '3. Transfos & Auxiliaires',
      title_en: '3. Power Trafo & Aux',
      sub_fr: 'OLTC, DC 110V & ATS',
      sub_en: 'OLTC, DC 110V & ATS',
      icon: Activity,
      color: 'emerald'
    },
    {
      num: 4 as const,
      title_fr: '4. Protections & CEI 61850',
      title_en: '4. Protection & IEC 61850',
      sub_fr: '87T, 21, Process Bus',
      sub_en: '87T, 21, Process Bus',
      icon: ShieldAlert,
      color: 'rose'
    },
    {
      num: 5 as const,
      title_fr: '5. Exploitation & Dossier SAT',
      title_en: '5. Operations & SAT Dossier',
      sub_fr: 'LOTO, IEEE 80 & DQE',
      sub_en: 'LOTO, IEEE 80 & BOQ',
      icon: FileCheck,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Master System Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0D121B] via-[#090D14] to-[#111722] border border-[#222B38] shadow-2xl relative overflow-hidden">
        {/* Ambient subtle glow & accent gradients */}
        <div className="absolute top-0 right-0 w-[550px] h-full bg-gradient-to-l from-amber-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Title & System Description */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-amber-400" />
                DOMAINE D04 · POSTES ÉLECTRIQUES & NŒUDS RÉSEAU
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                CEI 62271 · CEI 60076 · CEI 61850 · IEEE 80
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                {activeNode.network} · {activeNode.region}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
                <Zap className="h-6 w-6 text-amber-400 animate-pulse" />
              </span>
              <span>
                {locale === 'fr'
                  ? 'Postes Électriques & Nœuds Réseau'
                  : 'Substations & Grid Nodes'}
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-sans font-normal">
              {locale === 'fr'
                ? "Parcours d'ingénierie intégrée des postes HTB/HTA en 5 étapes : écosystème des nœuds de transport du Cameroun, topologies de barres, transformateurs et régleurs en charge (OLTC), protections différentielles (87T/21) et CEI 61850, jusqu'à la mise en service SAT et au bordereau DQE en FCFA."
                : 'Integrated 5-stage substation engineering journey: Cameroon national transmission nodes, busbar topologies, power transformers & OLTC, differential protection (87T/21) & IEC 61850, down to SAT commissioning & turn-key BOQ in FCFA.'}
            </p>
          </div>

          {/* Right Live Substation Telemetry HUD & Triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            {/* Live Substation Node Telemetry Card */}
            <div className="p-3 rounded-xl bg-[#070A10] border border-[#222B38] text-[11px] text-slate-300 space-y-1.5 w-full sm:w-auto min-w-[260px]">
              <div className="flex items-center justify-between gap-3 text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold truncate max-w-[170px]">
                  <Radio className="h-3 w-3 text-amber-400 animate-pulse shrink-0" />
                  {activeNode.name_fr.split('(')[0]}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  {selectedVoltage} NOMINAL
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] text-slate-500 block">Capacité :</span>
                  <span className="text-white font-bold text-xs">{totalMva} MVA</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Court-Circuit :</span>
                  <span className="text-rose-400 font-bold text-xs">{scCurrentKa} kA</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Kéraunique :</span>
                  <span className="text-amber-400 font-bold text-xs">{activeNode.keraunicDaysPerYear} j/an</span>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Batterie DC : <strong className="text-emerald-400">126.4 V</strong></span>
                <span>Terre IEEE 80 : <strong className="text-sky-400">{activeNode.soilResistivityOhmM} Ω·m</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onOpenDossier && (
                <button
                  type="button"
                  onClick={onOpenDossier}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Dossier & DQE' : 'Dossier & BOQ'}</span>
                </button>
              )}

              {onOpenPrinciplesDrawer && (
                <button
                  type="button"
                  onClick={onOpenPrinciplesDrawer}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Formulaire' : 'Formulas'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Mandatory Educational Model Classification Callout */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-300 font-bold mr-1.5">
              {locale === 'fr' ? 'MODÈLE D\'INGÉNIERIE PÉDAGOGIQUE DU POSTE :' : 'EDUCATIONAL SUBSTATION ENGINEERING MODEL:'}
            </strong>
            <span className="text-slate-300">
              {locale === 'fr'
                ? 'Simulation interactive de la topologie électrique, des appareillages HTB, des protections, du contrôle-commande et de la sécurité. Données représentatives et conceptuelles pour l\'ingénierie et l\'enseignement.'
                : 'Interactive simulation of electrical topology, switchgear, protection, automation, and safety. Conceptual engineering models for education and technical reference.'}
            </span>
          </div>
        </div>

        {/* 3. Interactive Tri-View Switcher + Voltage Level + Cameroon Node Selector */}
        <div className="mt-4 pt-3.5 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Synchronized Tri-View Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Représentation :' : 'Synchronized View:'}
            </span>

            <button
              type="button"
              onClick={() => onSelectView('PHYSICAL')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'PHYSICAL'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-[#070A10] text-slate-300 border-[#222B38] hover:text-white hover:border-amber-500/40'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '1. Vue Physique (Yard / Bâtiment)' : '1. Physical View (Yard / Hall)'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('ELECTRICAL_SLD')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'ELECTRICAL_SLD'
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                  : 'bg-[#070A10] text-slate-300 border-[#222B38] hover:text-white hover:border-sky-500/40'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '2. Schéma Unifilaire (SLD)' : '2. Electrical SLD'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('FUNCTIONAL')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'FUNCTIONAL'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                  : 'bg-[#070A10] text-slate-300 border-[#222B38] hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '3. Vue Fonctionnelle (SAS)' : '3. Functional View (SAS)'}</span>
            </button>
          </div>

          {/* Voltage Level Context Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Palier de Tension :' : 'Voltage Level:'}
            </span>
            {(['400kV', '225kV', '110kV', '90kV', '30kV'] as SubstationVoltageContext[]).map((v) => {
              const isSelected = selectedVoltage === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onSelectVoltage(v)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? v === '400kV'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                        : v === '225kV'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm'
                      : 'bg-[#070A10] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{v}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Cameroon Grid Node Switcher */}
        {onSelectNode && (
          <div className="mt-3 pt-3 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {locale === 'fr' ? 'Nœud Réseau SONATREL :' : 'SONATREL Grid Node:'}
              </span>
              <select
                value={selectedNodeId}
                onChange={(e) => onSelectNode(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#070A10] border border-[#222B38] text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.values(CAMEROON_SUBSTATION_NODES).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name_fr.split('(')[0]} ({n.primaryVoltage}/{n.secondaryVoltage} - {n.network})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold">
                {locale === 'fr' ? 'Technologie :' : 'Technology:'}
              </span>
              <select
                value={selectedSubstationType}
                onChange={(e) => onSelectSubstationType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#070A10] border border-[#222B38] text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="SUB_TRANS_AIS">Poste Ouvert dans l'Air (AIS 225 kV)</option>
                <option value="SUB_TRANS_GIS">Poste Blindé Métallique (GIS SF6)</option>
                <option value="SUB_HYBRID">Poste Hybride MTS (Mixte AIS/GIS)</option>
                <option value="SUB_STEP_UP">Poste Évacuation Centrale (GSU Nachtigal)</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* 5. Master 5-Stage Engineering Journey Navigation Tray */}
      <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl overflow-x-auto">
        <div className="flex items-center gap-2.5 min-w-max">
          {stages.map((st) => {
            const isCurrent = activeStage === st.num;
            const isCompleted = activeStage > st.num;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => onSelectStage(st.num)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 min-w-[220px] ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : isCompleted
                    ? 'bg-[#0E141F] text-slate-200 border-[#222B38] hover:border-amber-500/40'
                    : 'bg-[#0A0E17] text-slate-400 border-[#1B2330] hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  isCurrent
                    ? 'bg-slate-950 text-amber-300'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {locale === 'fr' ? st.title_fr : st.title_en}
                  </div>
                  <div className={`text-[10px] truncate ${isCurrent ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {locale === 'fr' ? st.sub_fr : st.sub_en}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
