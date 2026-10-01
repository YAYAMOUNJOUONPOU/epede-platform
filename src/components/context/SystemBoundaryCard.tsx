// src/components/context/SystemBoundaryCard.tsx
// EPEDE - System Boundary & Operational Responsibility Matrix
// Clarifies electrical battery limits, operational jurisdiction, and handover responsibilities per IEC/CIGRE.

import React from 'react';
import {
  ShieldAlert,
  Layers,
  ArrowRightLeft,
  Building,
  Wrench,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { SystemBoundaryInfo } from '../../types/contextStack';

interface SystemBoundaryCardProps {
  boundaryInfo?: SystemBoundaryInfo;
  locale: 'fr' | 'en';
  className?: string;
}

const DEFAULT_BOUNDARY: SystemBoundaryInfo = {
  systemName: {
    fr: 'Poste d\'Interconnexion HTB 225/30 kV (Oyomabang)',
    en: '225/30 kV Primary Grid Substation (Oyomabang)',
  },
  batteryLimits: {
    upstream: {
      fr: 'Pinces d\'amarrage sous portique de ligne 225 kV (Réseau de transport SONATREL)',
      en: '225 kV Line Gantry Terminal Clamps (SONATREL Transmission Grid)',
    },
    downstream: {
      fr: 'Têtes de câbles HTA 30 kV au départ des cellules sous enveloppe métallique (Réseau Eneo)',
      en: '30 kV MV Cable Terminations at switchgear outgoing feeders (Eneo Distribution Grid)',
    },
    auxiliary: {
      fr: 'Tableau TGBT 400 Vca / Redresseur-Chargeur 110 Vcc (Services Généraux Poste)',
      en: '400 Vac Main LV Switchboard / 110 Vdc Charger (Substation Auxiliary Services)',
    },
  },
  operationalJurisdiction: {
    operator: 'SONATREL (Gestionnaire Réseau de Transport)',
    maintenanceEntity: 'Département Maintenance Postes & Lignes HTB',
    dispatchAuthority: 'Centre National de Conduite Réseau (Dispatching Central)',
  },
  governingStandard: 'CEI 61936-1 / CEI 62271-200 / NF C 18-510',
};

export const SystemBoundaryCard: React.FC<SystemBoundaryCardProps> = ({
  boundaryInfo = DEFAULT_BOUNDARY,
  locale,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 space-y-4 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-[11px]">
          <Layers className="h-4 w-4" />
          <span>{locale === 'fr' ? 'LIMITES DE BATTERIE & RESPONSABILITÉS D\'EXPLOITATION' : 'SYSTEM BOUNDARY & OPERATIONAL JURISDICTION'}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{boundaryInfo.governingStandard}</span>
      </div>

      {/* Battery Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
        
        {/* Upstream Boundary */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="text-sky-400 font-bold uppercase text-[10px] flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" />
            <span>{locale === 'fr' ? 'Limite Amont (Incomer)' : 'Upstream Battery Limit'}</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {boundaryInfo.batteryLimits.upstream[locale]}
          </p>
        </div>

        {/* Downstream Boundary */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" />
            <span>{locale === 'fr' ? 'Limite Aval (Outgoing)' : 'Downstream Battery Limit'}</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {boundaryInfo.batteryLimits.downstream[locale]}
          </p>
        </div>

        {/* Auxiliary Boundary */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="text-amber-400 font-bold uppercase text-[10px] flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>{locale === 'fr' ? 'Services Auxiliaires' : 'Auxiliary System Limit'}</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {boundaryInfo.batteryLimits.auxiliary[locale]}
          </p>
        </div>

      </div>

      {/* Operational Jurisdiction & Responsibilities */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
        <div>
          <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Exploitant Responsable :' : 'Grid Operator:'}</span>
          <span className="text-white font-bold">{boundaryInfo.operationalJurisdiction.operator}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Entité de Maintenance :' : 'Maintenance Entity:'}</span>
          <span className="text-slate-300">{boundaryInfo.operationalJurisdiction.maintenanceEntity}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-bold">{locale === 'fr' ? 'Autorité de Conduite :' : 'Dispatch Authority:'}</span>
          <span className="text-amber-400 font-bold">{boundaryInfo.operationalJurisdiction.dispatchAuthority}</span>
        </div>
      </div>
    </div>
  );
};
