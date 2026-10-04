// src/components/storage/EnergyStorageCommandHeader.tsx
// EPEDE D10 - Reactive Master Command Cockpit & 5-Stage Progressive Engineering Sizing Engine

import React from 'react';
import {
  BatteryCharging,
  Sliders,
  Cpu,
  Layers,
  Zap,
  Globe,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
  Activity
} from 'lucide-react';

export type EnergyStorageIndustryKey = 
  | 'GUIDER_MAROUA_38MWH'
  | 'SANAGA_GRID_100MW'
  | 'HIGHWAY_EV_HUB_DOUALA';

export interface EnergyStorageProfile {
  id: EnergyStorageIndustryKey;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  defaultPowerMw: number;
  defaultEnergyMwh: number;
  ambientTempC: number;
  gridFrequencyHz: number;
  evPlazaChargers: number;
  trafoKva: number;
}

export const ENERGY_STORAGE_PROFILES: Record<EnergyStorageIndustryKey, EnergyStorageProfile> = {
  GUIDER_MAROUA_38MWH: {
    id: 'GUIDER_MAROUA_38MWH',
    nameFr: 'Centrale Solaire & BESS Guider / Maroua (38 MWh — Grand Nord Cameroun)',
    nameEn: 'Guider / Maroua Solar & BESS Plant (38 MWh — Northern Cameroon)',
    descriptionFr: 'Hybridation PV + BESS 30 MWp / 38 MWh sur le Réseau Interconnecté Nord (RIN) de Sonatrel, compensant le déficit hydraulique du barrage de Lagdo en saison sèche.',
    descriptionEn: '30 MWp PV + 38 MWh BESS hybrid plant on Sonatrel Northern Interconnected Grid (RIN), offsetting Lagdo hydro dam dry-season generation deficit.',
    defaultPowerMw: 15,
    defaultEnergyMwh: 38,
    ambientTempC: 38, // High tropical Sahelian climate
    gridFrequencyHz: 50.00,
    evPlazaChargers: 4,
    trafoKva: 1600
  },
  SANAGA_GRID_100MW: {
    id: 'SANAGA_GRID_100MW',
    nameFr: 'Poste Interconnecté Réseau Sud RIS (100 MW / 200 MWh — Sanaga)',
    nameEn: 'Southern Interconnected Grid Substation (100 MW / 200 MWh — Sanaga)',
    descriptionFr: 'Système BESS d\'arbitrage et de réserve d\'inertie synthétique (Grid-Forming VSG) interconnecté en 30 kV au poste d\'évacuation de Nachtigal.',
    descriptionEn: 'Utility BESS arbitrage and synthetic inertia provider (Grid-Forming VSG) interconnected at 30 kV to the Nachtigal hydro evacuation node.',
    defaultPowerMw: 50,
    defaultEnergyMwh: 100,
    ambientTempC: 28,
    gridFrequencyHz: 50.00,
    evPlazaChargers: 6,
    trafoKva: 2500
  },
  HIGHWAY_EV_HUB_DOUALA: {
    id: 'HIGHWAY_EV_HUB_DOUALA',
    nameFr: 'Hub de Recharge Autoroutier Douala — Bafoussam (8×350 kW + Tampon BESS)',
    nameEn: 'Douala — Bafoussam Highway Ultra-Fast EV Hub (8×350 kW + BESS Buffer)',
    descriptionFr: 'Plaza de recharge haute puissance CCS2 (500 A continu) équipée d\'un BESS tampon 2 MW / 4 MWh pour lisser les pointes sur le transformateur HTA/BT.',
    descriptionEn: 'High-power CCS2 charging plaza (500 A continuous) equipped with a 2 MW / 4 MWh buffer BESS to prevent distribution transformer peak overloads.',
    defaultPowerMw: 2,
    defaultEnergyMwh: 4,
    ambientTempC: 31,
    gridFrequencyHz: 50.00,
    evPlazaChargers: 8,
    trafoKva: 800
  }
};

interface EnergyStorageCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedProfileKey: EnergyStorageIndustryKey;
  onSelectProfile: (key: EnergyStorageIndustryKey) => void;
  onOpenFormulasModal: () => void;
  onOpenDossier: () => void;
  rtePercent: string;
  sohPercent: string;
}

export const EnergyStorageCommandHeader: React.FC<EnergyStorageCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedProfileKey,
  onSelectProfile,
  onOpenFormulasModal,
  onOpenDossier,
  rtePercent,
  sohPercent
}) => {
  const isFr = locale === 'fr';
  const currentProfile = ENERGY_STORAGE_PROFILES[selectedProfileKey];

  const stages = [
    {
      num: 1,
      titleFr: '1. Architecture Conteneur',
      titleEn: '1. Container Layout',
      badgeFr: '40ft ISO · Bus 1500V DC · Coupe SVG',
      badgeEn: '40ft ISO · 1500V DC Bus · SVG Cutaway',
      icon: Layers
    },
    {
      num: 2,
      titleFr: '2. SOH Arrhenius',
      titleEn: '2. SOH Arrhenius',
      badgeFr: 'C-rate · Dégradation SOH · Thermique',
      badgeEn: 'C-rate · SOH Fade · Thermal Coupling',
      icon: Sliders
    },
    {
      num: 3,
      titleFr: '3. Grid-Forming VSG',
      titleEn: '3. Grid-Forming VSG',
      badgeFr: 'Inertie H=4s · RoCoF -1.6Hz/s · FFR',
      badgeEn: 'H=4s Inertia · RoCoF -1.6Hz/s · FFR',
      icon: Cpu
    },
    {
      num: 4,
      titleFr: '4. Bornes IRVE & DLM',
      titleEn: '4. EV Hub & DLM',
      badgeFr: 'HPC 350 kW · Câble Refroidi · Tampon',
      badgeEn: 'HPC 350 kW · Cooled Cable · Peak Buffer',
      icon: Zap
    },
    {
      num: 5,
      titleFr: '5. Cas Cameroun & DQE',
      titleEn: '5. Cameroon & BOQ',
      badgeFr: 'Guider 38 MWh · NFPA 855 · DQE FCFA',
      badgeEn: 'Guider 38 MWh · NFPA 855 · BOQ FCFA',
      icon: Globe
    }
  ];

  return (
    <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Bar: Profile Selector & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222B38] pb-4">
        
        {/* Profile Selector */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>{isFr ? 'Scénario Industriel & Réseau d\'Application :' : 'Industrial Scenario & Target Grid:'}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(ENERGY_STORAGE_PROFILES) as EnergyStorageIndustryKey[]).map((key) => {
              const prof = ENERGY_STORAGE_PROFILES[key];
              const isSelected = key === selectedProfileKey;
              return (
                <button
                  key={key}
                  onClick={() => onSelectProfile(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span>{isFr ? prof.nameFr.split('(')[0] : prof.nameEn.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-sans mt-1">
            {isFr ? currentProfile.descriptionFr : currentProfile.descriptionEn}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenFormulasModal}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/50 hover:border-cyan-500 font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>{isFr ? 'Formules & Principes (8)' : 'Formulations & Physics (8)'}</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isFr ? 'Dossier DQE / BOQ FCFA' : 'Stamped BOQ Dossier FCFA'}</span>
          </button>
        </div>

      </div>

      {/* 5-Stage Progressive Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((st) => {
          const isActive = activeStage === st.num;
          const Icon = st.icon;
          return (
            <button
              key={st.num}
              onClick={() => onSelectStage(st.num as any)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />
              )}
              
              <div className="flex items-center justify-between mb-1.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}>
                  {st.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>

              <div className={`font-mono text-xs font-bold tracking-tight ${
                isActive ? 'text-white' : 'text-slate-300'
              }`}>
                {isFr ? st.titleFr : st.titleEn}
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-1">
                {isFr ? st.badgeFr : st.badgeEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Telemetry & Verification Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-t border-[#222B38]/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CEI 62933 · UL 9540A · NFPA 855 · ISO 15118</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Rendement η_RTE : <strong className="text-cyan-400">{rtePercent}%</strong>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            SOH Projeté (10 ans) : <strong className="text-emerald-400">{sohPercent}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            MATURITÉ NIVEAU 5 EXCELLENCE (98%)
          </span>
        </div>
      </div>
    </div>
  );
};
