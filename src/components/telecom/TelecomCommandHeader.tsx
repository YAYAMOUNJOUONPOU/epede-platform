// src/components/telecom/TelecomCommandHeader.tsx
// EPEDE D13 - Reactive Master Command Cockpit & 5-Stage Progressive Engineering Sizing Engine for Network Telecom

import React from 'react';
import {
  Radio,
  Network,
  Activity,
  Clock,
  ShieldCheck,
  Zap,
  Globe,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Share2
} from 'lucide-react';

export type TelecomScenarioKey = 
  | 'MANGOMBE_225KV_DIGITAL_SUB'
  | 'OPGW_WAN_MANGOMBE_OYOMABANG'
  | 'ENEO_DISTRIBUTION_SCADA_LTE';

export interface TelecomScenarioProfile {
  id: TelecomScenarioKey;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  defaultLineLengthKm: number;
  defaultWavelength: 1310 | 1550;
  defaultSpliceCount: number;
  defaultPtpClock: 'LOCKED_GNSS' | 'HOLDOVER_RUBIDIUM' | 'HOLDOVER_OCXO';
  defaultRedundancy: 'PRP' | 'HSR';
  defaultSampleRate: 4000 | 12800;
}

export const TELECOM_SCENARIO_PROFILES: Record<TelecomScenarioKey, TelecomScenarioProfile> = {
  MANGOMBE_225KV_DIGITAL_SUB: {
    id: 'MANGOMBE_225KV_DIGITAL_SUB',
    nameFr: 'Poste Numérique 225/90 kV Mangombé (Édéa — Carrefour Énergétique RIS)',
    nameEn: '225/90 kV Mangombé Digital Substation (Édéa — RIS Energy Hub)',
    descriptionFr: 'Poste haute tension d\'évacuation hydroélectrique équipé d\'un bus de process CEI 61850-9-2LE, réseau PRP double étoile et horloge Grandmaster GNSS PTP.',
    descriptionEn: 'High-voltage hydro evacuation node engineered with an optical IEC 61850-9-2LE process bus, dual PRP star network, and GNSS PTP Grandmaster clock.',
    defaultLineLengthKm: 115,
    defaultWavelength: 1550,
    defaultSpliceCount: 38,
    defaultPtpClock: 'LOCKED_GNSS',
    defaultRedundancy: 'PRP',
    defaultSampleRate: 4000
  },
  OPGW_WAN_MANGOMBE_OYOMABANG: {
    id: 'OPGW_WAN_MANGOMBE_OYOMABANG',
    nameFr: 'Dorsale OPGW 225 kV Mangombé — Oyomabang (115 km — Liaison Littoral/Centre)',
    nameEn: '225 kV Mangombé — Oyomabang OPGW Backbone (115 km — Coastal to Capital Line)',
    descriptionFr: 'Ligne de transport stratégique 225 kV interconnectant les centrales de la Sanaga (Songloulou/Édéa) à la capitale Yaoundé, sécurisée par télé-protection différentielle 87L sur OPGW.',
    descriptionEn: 'Strategic 225 kV transmission line linking Sanaga hydro plants (Songloulou/Édéa) to Yaoundé capital, protected via line differential 87L over OPGW fiber.',
    defaultLineLengthKm: 115,
    defaultWavelength: 1550,
    defaultSpliceCount: 38,
    defaultPtpClock: 'LOCKED_GNSS',
    defaultRedundancy: 'PRP',
    defaultSampleRate: 4000
  },
  ENEO_DISTRIBUTION_SCADA_LTE: {
    id: 'ENEO_DISTRIBUTION_SCADA_LTE',
    nameFr: 'Réseau Téléconduite HTA & Télé-surveillance Eneo (Douala / Yaoundé)',
    nameEn: 'Eneo MV Distribution Telecontrol & Substation Automation Network',
    descriptionFr: 'Réseau de téléconduite des postes HTA/BT urbains et ruraux avec passerelles CEI 60870-5-104, télé-actions DNP3 et dorsale radio privée LTE/VHF.',
    descriptionEn: 'Urban and rural MV/LV distribution telecontrol network featuring IEC 60870-5-104 gateways, DNP3 tele-actions, and private LTE/VHF telecommunication links.',
    defaultLineLengthKm: 45,
    defaultWavelength: 1310,
    defaultSpliceCount: 15,
    defaultPtpClock: 'HOLDOVER_OCXO',
    defaultRedundancy: 'HSR',
    defaultSampleRate: 4000
  }
};

interface TelecomCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedScenarioKey: TelecomScenarioKey;
  onSelectScenario: (key: TelecomScenarioKey) => void;
  onOpenFormulasModal: () => void;
  onOpenDossier: () => void;
  gooseLatencyMs: number;
  ptpDriftNs: number;
}

export const TelecomCommandHeader: React.FC<TelecomCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedScenarioKey,
  onSelectScenario,
  onOpenFormulasModal,
  onOpenDossier,
  gooseLatencyMs,
  ptpDriftNs
}) => {
  const isFr = locale === 'fr';
  const currentScenario = TELECOM_SCENARIO_PROFILES[selectedScenarioKey];

  const stages = [
    {
      num: 1,
      titleFr: '1. Bus de Process SV',
      titleEn: '1. Process Bus SV',
      badgeFr: 'CEI 61850-9-2LE · 4000 Hz · Rogowski',
      badgeEn: 'IEC 61850-9-2LE · 4000 Hz · Rogowski',
      icon: Activity
    },
    {
      num: 2,
      titleFr: '2. GOOSE & PRP/HSR',
      titleEn: '2. GOOSE & PRP/HSR',
      badgeFr: 'Latence < 3ms · Zéro-Coupure · CEI 62439-3',
      badgeEn: 'Latency < 3ms · Zero-Recovery · IEC 62439-3',
      icon: Network
    },
    {
      num: 3,
      titleFr: '3. PTP IEEE 1588v2',
      titleEn: '3. PTP IEEE 1588v2',
      badgeFr: 'Sub-microseconde · Rubidium · Dérive Angle',
      badgeEn: 'Sub-microsecond · Rubidium · Phase Drift',
      icon: Clock
    },
    {
      num: 4,
      titleFr: '4. WAN OPGW & CPL',
      titleEn: '4. WAN OPGW & PLC',
      badgeFr: 'Bilan Optique · 1550nm · Line Trap CPL',
      badgeEn: 'Link Budget · 1550nm · PLC Line Trap',
      icon: Radio
    },
    {
      num: 5,
      titleFr: '5. Cas Cameroun & DQE',
      titleEn: '5. Cameroon & BOQ',
      badgeFr: 'Sonatrel Mangombé 225 kV · DQE FCFA',
      badgeEn: 'Sonatrel Mangombé 225 kV · BOQ FCFA',
      icon: Globe
    }
  ];

  return (
    <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Bar: Scenario Selector & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222B38] pb-4">
        
        {/* Scenario Selector */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>{isFr ? 'Scénario Télécom & Réseau Cible :' : 'Telecom Scenario & Target Grid System:'}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(TELECOM_SCENARIO_PROFILES) as TelecomScenarioKey[]).map((key) => {
              const prof = TELECOM_SCENARIO_PROFILES[key];
              const isSelected = key === selectedScenarioKey;
              return (
                <button
                  key={key}
                  onClick={() => onSelectScenario(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-teal-400 animate-ping' : 'bg-slate-600'}`} />
                  <span>{isFr ? prof.nameFr.split('(')[0] : prof.nameEn.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-sans mt-1">
            {isFr ? currentScenario.descriptionFr : currentScenario.descriptionEn}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenFormulasModal}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-800/50 hover:border-teal-500 font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Calculator className="w-4 h-4 text-teal-400" />
            <span>{isFr ? 'Formules & Principes (8)' : 'Formulations & Physics (8)'}</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
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
                  ? 'bg-slate-900 border-teal-500 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500" />
              )}
              
              <div className="flex items-center justify-between mb-1.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}>
                  {st.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
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
          <span className="flex items-center gap-1.5 text-teal-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CEI 61850-9-2LE · CEI 62439-3 (PRP/HSR) · IEEE 1588v2 · UIT-T G.652D</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Latence GOOSE : <strong className="text-emerald-400">{gooseLatencyMs} ms</strong> (&lt; 3 ms)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Dérive PTP : <strong className="text-cyan-400">{ptpDriftNs} ns</strong> (&lt; 1 µs)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[10px] font-bold">
            MATURITÉ NIVEAU 5 EXCELLENCE (98%)
          </span>
        </div>
      </div>
    </div>
  );
};
