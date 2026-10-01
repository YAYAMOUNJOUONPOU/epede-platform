// src/components/substations/SubstationCommandHeader.tsx
// EPEDE D04 - Substation Engineering Interactive Command Header

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
  AlertTriangle
} from 'lucide-react';
import type { SubstationWorkbenchPillar } from './SubstationsWorkbench';

export type SubstationRepresentationView = 'PHYSICAL' | 'ELECTRICAL_SLD' | 'FUNCTIONAL';
export type SubstationVoltageContext = '400kV' | '225kV' | '90kV';

interface SubstationCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar: SubstationWorkbenchPillar;
  onSelectPillar: (pillar: SubstationWorkbenchPillar) => void;
  activeView: SubstationRepresentationView;
  onSelectView: (view: SubstationRepresentationView) => void;
  selectedSubstationType: string;
  onSelectSubstationType: (typeId: string) => void;
  selectedVoltage: SubstationVoltageContext;
  onSelectVoltage: (v: SubstationVoltageContext) => void;
  currentBreadcrumb?: string[];
  onOpenPrinciplesDrawer?: () => void;
}

export const SubstationCommandHeader: React.FC<SubstationCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  activeView,
  onSelectView,
  selectedSubstationType,
  onSelectSubstationType,
  selectedVoltage,
  onSelectVoltage,
  currentBreadcrumb = ['Nœud Électrique Bekoko 225/90 kV', 'Travée Arrivée Ligne Nachtigal L1'],
  onOpenPrinciplesDrawer
}) => {
  return (
    <div className="space-y-3 font-mono">
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
                SONATREL / RIS REPÉRAGE ACTIF
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
                ? 'Station maîtresse d\'ingénierie des postes HTB/HTA : topologie électrique unifilaire, architecture des travées, comparaison AIS/GIS/Hybride, transformateurs de puissance et régleurs en charge (OLTC), protections différentielles (87T/87B), auxiliaires AC/DC (110Vcc) et sécurisation LOTO.'
                : 'Master engineering workstation for HV/EHV substations: single-line electrical topology, bay architecture, AIS/GIS/Hybrid comparative analysis, power transformers and OLTC tap regulation, differential protection (87T/87B), AC/DC auxiliaries (110Vdc), and interlocking safety.'}
            </p>
          </div>

          {/* Right Live Substation Telemetry HUD & Formulas Trigger */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            {/* Live Substation Node Telemetry Card */}
            <div className="p-3 rounded-xl bg-[#070A10] border border-[#222B38] text-[11px] text-slate-300 space-y-1.5 w-full sm:w-auto min-w-[250px]">
              <div className="flex items-center justify-between gap-3 text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Radio className="h-3 w-3 text-amber-400 animate-pulse" />
                  POSTE BEKOKO 225/90 kV
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  EXPLOITATION NOMINALE
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] text-slate-500 block">Tension Barres :</span>
                  <span className="text-white font-bold text-xs">227.4 kV</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Charge TR1 :</span>
                  <span className="text-emerald-400 font-bold text-xs">68.5 MVA</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">T° Huile TR :</span>
                  <span className="text-amber-400 font-bold text-xs">58.2 °C</span>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Batterie 110 Vcc : <strong className="text-emerald-400">126.4 V</strong></span>
                <span>SF6 Disjoncteur : <strong className="text-sky-400">0.62 MPa</strong></span>
              </div>
            </div>

            {/* Principles Drawer Quick Trigger Button */}
            {onOpenPrinciplesDrawer && (
              <button
                type="button"
                onClick={onOpenPrinciplesDrawer}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-amber-500/10 cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Formules & Principes de Calcul' : 'Formulas & Substation Laws'}</span>
                <ChevronRight className="h-3 w-3 text-amber-400/70" />
              </button>
            )}
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
                ? 'Exploration visuelle de la topologie électrique, des appareillages HTB, des protections, du contrôle-commande et de la sécurité. Données représentatives et conceptuelles. Non destiné à la commande en temps réel, aux autorisations de manœuvre réelles ou à l\'approbation de réglages de protection.'
                : 'Visual exploration of electrical topology, equipment, relationships, protection, control, safety, and operational concepts. Conceptual and representative. Not for live control, switching authorization, final design approval, protection settings, safety authorization, or project acceptance.'}
            </span>
          </div>
        </div>

        {/* 3. Interactive Tri-View Switcher + Voltage Level + Substation Type Selector */}
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
              <span>{locale === 'fr' ? '3. Vue Fonctionnelle (Automate/SAS)' : '3. Functional View (SAS / States)'}</span>
            </button>
          </div>

          {/* Voltage Level Context Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Palier de Tension :' : 'Voltage Level:'}
            </span>
            {(['400kV', '225kV', '90kV'] as SubstationVoltageContext[]).map((v) => {
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
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                      : 'bg-[#070A10] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{v}</span>
                  <span className="text-[10px] ml-1 font-normal opacity-75 hidden sm:inline">
                    {v === '400kV' ? '(THT)' : v === '225kV' ? '(Dorsale)' : '(Sous-Trans)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Substation Architecture Type Selector Bar */}
        <div className="mt-3 pt-3 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold">
              {locale === 'fr' ? 'Type d\'Ouvrage :' : 'Substation Type:'}
            </span>
            <select
              value={selectedSubstationType}
              onChange={(e) => onSelectSubstationType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#070A10] border border-[#222B38] text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="SUB_TRANS_AIS">Poste de Transport Ouvert (AIS 225/400 kV)</option>
              <option value="SUB_TRANS_GIS">Poste Sous Enveloppe Métallique (GIS Blindé)</option>
              <option value="SUB_STEP_UP">Poste Évacuateur de Centrale (GSU Step-Up 15/225 kV)</option>
              <option value="SUB_STEP_DOWN">Poste Source d\'Abaissement (Step-Down 225/90/15 kV)</option>
              <option value="SUB_SWITCHING">Poste d\'Aiguillage & Manœuvre (Switching Node)</option>
              <option value="SUB_INTERCO">Poste d\'Interconnexion Régionale / Internationale</option>
              <option value="SUB_HYBRID">Poste Hybride / Mixte (MTS - Barres AIS + Disjoncteur GIS)</option>
              <option value="SUB_HV_MV">Poste de Distribution Primaire (HV/MV 90/15 kV)</option>
            </select>
          </div>

          {/* Quick Jump Action Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[10px] text-slate-500 mr-1 uppercase">Accès Direct :</span>
            <button
              type="button"
              onClick={() => onSelectPillar('JOURNEY')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-slate-300 hover:text-white border border-[#222B38] hover:border-slate-500 transition-colors"
            >
              Parcours Électrique
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('TRANSFORMER')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-amber-300 hover:text-amber-200 border border-[#222B38] hover:border-amber-500/40 transition-colors"
            >
              Transformateur & OLTC
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('AIS_GIS_COMPARE')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-cyan-300 hover:text-cyan-200 border border-[#222B38] hover:border-cyan-500/40 transition-colors"
            >
              AIS vs GIS
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('PROTECTION')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-red-300 hover:text-red-200 border border-[#222B38] hover:border-red-500/40 transition-colors"
            >
              Protections 87T / 87B
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('AUXILIARIES')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-emerald-300 hover:text-emerald-200 border border-[#222B38] hover:border-emerald-500/40 transition-colors"
            >
              Auxiliaires 110Vcc
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('SCENARIOS')}
              className="px-2.5 py-1 rounded-md bg-[#070A10] text-orange-300 hover:text-orange-200 border border-[#222B38] hover:border-orange-500/40 transition-colors"
            >
              Scénarios LOTO
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
