// src/components/elv/ElvCommandHeader.tsx
// EPEDE D08 - Master Command Header HUD & Engineering Sizing Bar for Extra Low Voltage Systems

import React from 'react';
import {
  Building2,
  Network,
  Video,
  Flame,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  FileCheck,
  Zap,
  Activity,
  BatteryCharging,
  Sliders,
  Compass
} from 'lucide-react';
import {
  ELV_BUILDING_PROFILES,
  BuildingTypologyKey,
  BuildingTypologyProfile,
  ElvCalculations
} from './services/useElvProjectStore';

interface ElvCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedBuildingId: BuildingTypologyKey;
  onSelectBuilding: (id: BuildingTypologyKey) => void;
  activeProfile: BuildingTypologyProfile;
  calculations: ElvCalculations;
  onOpenDossier: () => void;
  onOpenPrinciplesModal: () => void;
}

export const ElvCommandHeader: React.FC<ElvCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedBuildingId,
  onSelectBuilding,
  activeProfile,
  calculations,
  onOpenDossier,
  onOpenPrinciplesModal
}) => {
  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* Top Ribbon: Building Profile Selector & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#222B38]">
        
        {/* Building Selector Dropdown / Pills */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              {locale === 'fr' ? 'Typologie d’Ouvrage Actif (Projet Cameroun) :' : 'Active Facility Typology (Cameroon Project):'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(ELV_BUILDING_PROFILES) as BuildingTypologyKey[]).map((bKey) => {
              const prof = ELV_BUILDING_PROFILES[bKey];
              const isSelected = prof.id === selectedBuildingId;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => onSelectBuilding(prof.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer truncate max-w-xs ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white hover:bg-[#141B26]'
                  }`}
                  title={`${prof.nameFr} — Réf: ${prof.cameroonReference}`}
                >
                  {locale === 'fr' ? prof.nameFr.split('(')[0] : prof.nameEn.split('(')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Formules et Principes */}
          <button
            type="button"
            onClick={onOpenPrinciplesModal}
            className="px-3 py-2 rounded-xl bg-[#0E141F] hover:bg-[#162030] text-slate-300 border border-[#222B38] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title={locale === 'fr' ? 'Formulations Mathématiques CFA' : 'Mathematical Formulations'}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Formulations' : 'Formulations'}</span>
          </button>

          {/* Dossier DQE CFA */}
          <button
            type="button"
            onClick={onOpenDossier}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Dossier DQE FCFA' : 'ELV BOQ FCFA'}</span>
          </button>
        </div>

      </div>

      {/* 6-Parameter Live Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        
        {/* 1. Profil & Établissement */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Surface Bâtie' : 'Facility Area'}</span>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-black text-white font-mono">{activeProfile.totalAreaM2.toLocaleString('fr-FR')} m²</div>
          <div className="text-[9px] text-slate-500 font-mono truncate">{activeProfile.cameroonReference}</div>
        </div>

        {/* 2. Marge Optique Fibre */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Marge Fibre' : 'Optical Margin'}</span>
            <Network className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className={`text-base font-black font-mono ${calculations.isFiberBudgetPass ? 'text-emerald-400' : 'text-rose-400'}`}>
            +{calculations.opticalPowerMarginDb} dB
          </div>
          <div className="text-[9px] text-slate-500 font-mono">{calculations.isFiberBudgetPass ? 'Certifié TIA-568' : 'Perte Trop Forte'}</div>
        </div>

        {/* 3. Stockage Vidéo RAID 6 */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Stockage CCTV' : 'NVR Storage'}</span>
            <Video className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base font-black text-cyan-300 font-mono">{calculations.totalStorageRaidTb} TB</div>
          <div className="text-[9px] text-slate-500 font-mono">{calculations.usableDisksCount} Disques 8TB RAID 6</div>
        </div>

        {/* 4. Puissance PoE Totale */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Bilan PoE Total' : 'Total PoE'}</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-base font-black text-yellow-300 font-mono">{calculations.totalPoePowerWatts} W</div>
          <div className="text-[9px] text-slate-500 font-mono">{calculations.recommendedPoeSwitchesCount} Switches 24P PoE+</div>
        </div>

        {/* 5. Autonomie Batteries AES (EN 54-4) */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Batteries EN 54-4' : 'Safety Batteries'}</span>
            <BatteryCharging className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base font-black text-purple-300 font-mono">{calculations.batteryAutonomyAh} Ah</div>
          <div className="text-[9px] text-slate-500 font-mono">72h Veille + 30m Alarme</div>
        </div>

        {/* 6. Points Supervision GTB */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Points GTB' : 'BMS Points'}</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-black text-emerald-300 font-mono">{calculations.totalBmsPointsCount} I/O</div>
          <div className="text-[9px] text-slate-500 font-mono">BACnet/IP & KNX</div>
        </div>

      </div>

      {/* 5-Stage Progressive Navigation Bar */}
      <div className="pt-2 border-t border-[#222B38]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {[
            { stage: 1 as const, titleFr: '1. VDI, Fibre & Bilan PoE', titleEn: '1. Structured Cabling & PoE', desc: 'Liaison Optique & 802.3bt' },
            { stage: 2 as const, titleFr: '2. CCTV (DORI) & Contrôle d’Accès', titleEn: '2. CCTV (DORI) & Access', desc: 'RAID 6, DORI & Sas Interlock' },
            { stage: 3 as const, titleFr: '3. SSI Incendie & Batteries EN 54-4', titleEn: '3. Fire SSI & Life Safety', desc: 'Boucles, Décibels & 72h AES' },
            { stage: 4 as const, titleFr: '4. GTB/BMS & Smart Building', titleEn: '4. BMS & Smart Building', desc: 'BACnet, KNX & Asservissements' },
            { stage: 5 as const, titleFr: '5. Chantiers Cameroun & Dossier DQE', titleEn: '5. Field Cases & BOQ FCFA', desc: 'Retours Terrain & Devis Estimatif' }
          ].map((st) => {
            const isSelected = activeStage === st.stage;
            return (
              <button
                key={st.stage}
                type="button"
                onClick={() => onSelectStage(st.stage)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black shadow-lg shadow-amber-600/25 ring-1 ring-amber-300'
                    : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">
                    {locale === 'fr' ? st.titleFr : st.titleEn}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0 animate-ping" />}
                </div>
                <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
