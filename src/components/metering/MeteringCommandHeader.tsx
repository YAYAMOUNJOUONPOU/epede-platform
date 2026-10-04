// src/components/metering/MeteringCommandHeader.tsx
// EPEDE Domain D15 - Interactive Executive Command Cockpit for Smart Metering & Grid Digitalization

import React from 'react';
import {
  Gauge,
  Radio,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Zap,
  Coins,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import {
  type MeteringSiteKey,
  METERING_SITE_PROFILES,
  type MeteringProjectStoreType
} from './services/useMeteringProjectStore';

interface MeteringCommandHeaderProps {
  locale: 'fr' | 'en';
  store: MeteringProjectStoreType;
  onOpenFormulasModal: () => void;
}

export const MeteringCommandHeader: React.FC<MeteringCommandHeaderProps> = ({
  locale,
  store,
  onOpenFormulasModal
}) => {
  const {
    activeStage,
    setActiveStage,
    selectedSiteKey,
    switchSiteProfile,
    activeProfile,
    financialAnalytics,
    energyBalanceAnalytics
  } = store;

  const stagesList = [
    {
      num: 1,
      code: 'STAGE_1_METROLOGY_DLMS',
      titleFr: '1. Métrologie & DLMS/COSEM',
      titleEn: '1. Metrology & DLMS/COSEM',
      icon: Gauge,
      descFr: 'Classe 0.5S/1.0 & OBIS',
      descEn: 'Class 0.5S/1.0 & OBIS'
    },
    {
      num: 2,
      code: 'STAGE_2_STS_PREPAYMENT',
      titleFr: '2. Prépaiement STS & Tokens',
      titleEn: '2. STS Tokens & Vending',
      icon: Coins,
      descFr: 'Tokens 20 Chiffres & KRN',
      descEn: '20-Digit Token & KRN'
    },
    {
      num: 3,
      code: 'STAGE_3_ENERGY_BALANCE_ANTI_TAMPER',
      titleFr: '3. Anti-Fraude & Balance Poste',
      titleEn: '3. Anti-Tamper & Substation',
      icon: ShieldAlert,
      descFr: 'Balance MT/BT & Shunts',
      descEn: 'MV/LV Balance & Shunts'
    },
    {
      num: 4,
      code: 'STAGE_4_MDM_REMOTE_CONTROL',
      titleFr: '4. MDM & Télé-conduite Relais',
      titleEn: '4. MDM & Remote Relay Control',
      icon: Radio,
      descFr: 'Relais 100A & Télé-relève',
      descEn: '100A Relay & Telemetry'
    },
    {
      num: 5,
      code: 'STAGE_5_DELIVERABLES_DQE',
      titleFr: '5. Cas Cameroun & DQE FCFA',
      titleEn: '5. Cameroon Cases & BOQ FCFA',
      icon: MapPin,
      descFr: 'Eneo Rollout & Devis AMI',
      descEn: 'Eneo Rollout & AMI BOQ'
    }
  ];

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md mb-6 space-y-5">
      {/* Top Bar: Cameroon Deployment Site Selector & Global Telemetry Strip */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Site Profile Picker */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              {locale === 'fr'
                ? 'Périmètre de Déploiement & Réseau de Distribution Eneo'
                : 'Utility Deployment Perimeter & Eneo Grid Node'}
            </div>
            <select
              value={selectedSiteKey}
              onChange={(e) => switchSiteProfile(e.target.value as MeteringSiteKey)}
              aria-label={locale === 'fr' ? 'Sélectionner le périmètre de comptage' : 'Select metering deployment site'}
              className="mt-1 bg-slate-950 border border-slate-700 text-white font-mono text-xs md:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {Object.values(METERING_SITE_PROFILES).map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {locale === 'fr' ? prof.nameFr : prof.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-Time Commercial & Technical KPI Badges Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Recoverable Savings Badge */}
          <div className="px-3 py-1.5 rounded-xl border border-emerald-800/80 bg-emerald-950/60 text-emerald-300 flex items-center gap-2 text-xs font-mono">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>
              Recouvrement ROI : <strong className="font-bold">+{financialAnalytics.annualSavingsMillionXaf.toLocaleString()} M FCFA/an</strong>
            </span>
          </div>

          {/* Tamper / Fraud Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              energyBalanceAnalytics.fraudAlertLevel === 'NORMAL'
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : energyBalanceAnalytics.fraudAlertLevel === 'ELEVATED'
                ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            }`}
          >
            {energyBalanceAnalytics.fraudAlertLevel === 'NORMAL' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              Écart Balance : <strong className="font-bold">{energyBalanceAnalytics.lossPercentage}%</strong>{' '}
              ({energyBalanceAnalytics.fraudAlertLevel})
            </span>
          </div>

          {/* Relay State Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              store.remoteRelayState === 'CONNECTED'
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>
              Relais 100A : <strong className="font-bold">{store.remoteRelayState === 'CONNECTED' ? 'FERMÉ (ON)' : 'OUVERT (OFF)'}</strong>
            </span>
          </div>

          {/* Standards & Math Formulations Button */}
          <button
            onClick={onOpenFormulasModal}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title={locale === 'fr' ? 'Formulations mathématiques et normes' : 'Mathematical formulations & standards'}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Formules & OBIS' : 'Formulas & OBIS'}</span>
          </button>
        </div>
      </div>

      {/* Cameroon Deployment Context Ribbon */}
      <div className="text-xs text-slate-300 bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-emerald-300 font-bold">
            {locale === 'fr' ? 'Référence Terrain Eneo :' : 'Cameroon Eneo Reference:'}
          </span>
          <span className="text-slate-300">{activeProfile.cameroonReference}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Parc Actif: {activeProfile.totalMetersInstalled.toLocaleString()} compteurs | Transfo HTA/BT: {activeProfile.mvLvSubstationRatingKva} kVA
        </div>
      </div>

      {/* 5-Stage Progressive Engineering Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
        {stagesList.map((stage) => {
          const isActive = activeStage === stage.num;
          const IconComponent = stage.icon;
          return (
            <button
              key={stage.num}
              onClick={() => setActiveStage(stage.num as 1 | 2 | 3 | 4 | 5)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/20'
                  : 'bg-slate-950/80 border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ÉTAPE {stage.num}
                </span>
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
              </div>
              <div>
                <div className="text-xs font-bold font-sans line-clamp-1">
                  {locale === 'fr' ? stage.titleFr : stage.titleEn}
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    isActive ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {locale === 'fr' ? stage.descFr : stage.descEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
