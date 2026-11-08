// src/components/production/GenerationCommandHeader.tsx
// EPEDE D01 - Master Interactive Command Header & Multi-Technology Generation Orchestrator

import React from 'react';
import {
  Waves,
  Sun,
  Flame,
  Wind,
  TreePine,
  Zap,
  Activity,
  Compass,
  FileCheck,
  Layers,
  Sliders,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Cpu,
  Atom,
  ArrowRight
} from 'lucide-react';
import {
  CAMEROON_GENERATION_FLEET,
  type CameroonPowerPlant
} from './data/cameroonGenerationFleet';
import type { GenerationTechnology } from './services/useGenerationProjectStore';

interface GenerationCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  activeTechnology: GenerationTechnology;
  onSelectTechnology: (tech: GenerationTechnology) => void;
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenPrinciplesDrawer?: () => void;
  onOpenDossier?: () => void;
  activePlant: CameroonPowerPlant;
  powerMw: number;
  currentAmps: number;
  headM: number;
  flowM3s: number;
  voltageKv: number;
  stepUpKv: number;
}

export const GenerationCommandHeader: React.FC<GenerationCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  activeTechnology,
  onSelectTechnology,
  selectedPlantId,
  onSelectPlant,
  onOpenPrinciplesDrawer,
  onOpenDossier,
  activePlant,
  powerMw,
  currentAmps,
  headM,
  flowM3s,
  voltageKv,
  stepUpKv
}) => {
  const technologies: {
    id: GenerationTechnology;
    labelFr: string;
    labelEn: string;
    subFr: string;
    subEn: string;
    icon: any;
    color: string;
    badgeFr: string;
    badgeEn: string;
    activeBorder: string;
    activeBg: string;
  }[] = [
    {
      id: 'hydro',
      labelFr: 'Hydroélectrique',
      labelEn: 'Hydroelectric',
      subFr: 'Barrages & Turbines',
      subEn: 'Dams & Turbines',
      icon: Waves,
      color: 'text-sky-400',
      badgeFr: 'Pilier 90% Énergie CM',
      badgeEn: '90% CM Energy Backbone',
      activeBorder: 'border-sky-400',
      activeBg: 'bg-sky-500/20 text-white ring-1 ring-sky-400/40 shadow-sky-500/10'
    },
    {
      id: 'solar',
      labelFr: 'Solaire Photovoltaïque',
      labelEn: 'Solar PV',
      subFr: 'Silicium & Onduleurs MPPT',
      subEn: 'Silicon & MPPT Inverters',
      icon: Sun,
      color: 'text-amber-400',
      badgeFr: 'Maroua / Guider 30 MW',
      badgeEn: 'Maroua / Guider 30 MW',
      activeBorder: 'border-amber-400',
      activeBg: 'bg-amber-500/20 text-white ring-1 ring-amber-400/40 shadow-amber-500/10'
    },
    {
      id: 'wind',
      labelFr: 'Éolien Onshore & Offshore',
      labelEn: 'Wind Power',
      subFr: 'Rotor, Nacelle & DFIG',
      subEn: 'Rotor, Nacelle & DFIG',
      icon: Wind,
      color: 'text-cyan-400',
      badgeFr: 'Limite Betz Cp ≤ 59.3%',
      badgeEn: 'Betz Limit Cp ≤ 59.3%',
      activeBorder: 'border-cyan-400',
      activeBg: 'bg-cyan-500/20 text-white ring-1 ring-cyan-400/40 shadow-cyan-500/10'
    },
    {
      id: 'thermal',
      labelFr: 'Thermique & Cycles CCGT',
      labelEn: 'Thermal CCGT',
      subFr: 'Turbines Gaz / Vapeur',
      subEn: 'Gas & Steam Turbines',
      icon: Flame,
      color: 'text-orange-400',
      badgeFr: 'Kribi Gaz 216 MW',
      badgeEn: 'Kribi Gas 216 MW',
      activeBorder: 'border-orange-400',
      activeBg: 'bg-orange-500/20 text-white ring-1 ring-orange-400/40 shadow-orange-500/10'
    },
    {
      id: 'nuclear',
      labelFr: 'Nucléaire (PWR / EPR)',
      labelEn: 'Nuclear PWR',
      subFr: 'Fission U-235 & Vapeur 155b',
      subEn: 'U-235 Fission & 155b Steam',
      icon: Atom,
      color: 'text-violet-400',
      badgeFr: 'Base Décarbonée 1 650 MW',
      badgeEn: 'Baseload Zero-CO2',
      activeBorder: 'border-violet-400',
      activeBg: 'bg-violet-500/20 text-white ring-1 ring-violet-400/40 shadow-violet-500/10'
    },
    {
      id: 'biomass',
      labelFr: 'Biomasse & Cogénération',
      labelEn: 'Biomass & CHP',
      subFr: 'Valorisation & Lit fluidisé',
      subEn: 'Waste & Fluidized Bed',
      icon: TreePine,
      color: 'text-emerald-400',
      badgeFr: 'Agro-industrie SOSUCAM',
      badgeEn: 'Agro-industrial SOSUCAM',
      activeBorder: 'border-emerald-400',
      activeBg: 'bg-emerald-500/20 text-white ring-1 ring-emerald-400/40 shadow-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* 1. TOP COMMAND BAR: Multi-Technology Generation Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#090D14] via-[#101827] to-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        
        {/* ROW A: 6 Canonical Generation Technologies Switcher */}
        <div className="space-y-2 pb-3 border-b border-[#222B38]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {locale === 'fr' ? 'Filières de Production & Technologies de Conversion (6 Systèmes)' : 'Generation Sectors & Conversion Technologies (6 Systems)'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              {locale === 'fr' ? 'Normes CEI 60034 / CEI 61400 / CEI 62817 / ASME PTC' : 'IEC 60034 / IEC 61400 / IEC 62817 / ASME PTC'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {technologies.map((tech) => {
              const isSelected = activeTechnology === tech.id;
              const Icon = tech.icon;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => onSelectTechnology(tech.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${tech.activeBg} ${tech.activeBorder} shadow-lg`
                      : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200 hover:bg-[#161F2E]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isSelected ? 'text-white' : tech.color}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{locale === 'fr' ? tech.labelFr : tech.labelEn}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{locale === 'fr' ? tech.subFr : tech.subEn}</span>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {locale === 'fr' ? tech.badgeFr : tech.badgeEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW B: Contextual Reference Asset & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#222B38]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {locale === 'fr' ? 'Référentiel National Cameroun :' : 'Cameroon National Asset :'}
              </span>
            </div>

            {/* Quick Plant Selector Dropdown */}
            <select
              value={selectedPlantId}
              onChange={(e) => onSelectPlant(e.target.value)}
              className="bg-[#0E141F] text-sky-400 border border-sky-500/40 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
            >
              {CAMEROON_GENERATION_FLEET.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} ({plant.installedCapacityMw} MW - {plant.gridZone})
                </option>
              ))}
            </select>

            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px]">
              {activePlant.gridZone === 'RIS' ? 'Réseau Interconnecté Sud (RIS)' : activePlant.gridZone === 'RIN' ? 'Réseau Interconnecté Nord (RIN)' : 'Réseau Isolé'}
            </span>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            {onOpenPrinciplesDrawer && (
              <button
                type="button"
                onClick={onOpenPrinciplesDrawer}
                className="px-3 py-1.5 rounded-xl bg-[#0E141F] hover:bg-[#161F2E] text-slate-300 hover:text-white border border-[#222B38] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Lois & Principes' : 'Laws & Principles'}</span>
              </button>
            )}

            {onOpenDossier && (
              <button
                type="button"
                onClick={onOpenDossier}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Dossier DQE FCFA' : 'BOQ Dossier FCFA'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ROW C: Reactive Dynamic Telemetry Sizing HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {activeTechnology === 'hydro' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Active P' : 'Active Power P'}</div>
                <div className="text-base font-bold text-sky-400">{powerMw} MW</div>
                <div className="text-[10px] text-slate-400">{activePlant.unitsCount} groupe(s) unitaire(s)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Courant Statorique In' : 'Stator Current In'}</div>
                <div className="text-base font-bold text-amber-400">{currentAmps.toLocaleString()} A</div>
                <div className="text-[10px] text-slate-400">@ cos φ = 0.90</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Chute Nette H' : 'Net Head H'}</div>
                <div className="text-base font-bold text-emerald-400">{headM > 0 ? `${headM} m` : '50.5 m'}</div>
                <div className="text-[10px] text-slate-400">{headM < 30 ? 'Basse Chute' : headM <= 350 ? 'Moyenne Chute' : 'Haute Chute'}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Débit Turbiné Q' : 'Turbine Flow Q'}</div>
                <div className="text-base font-bold text-cyan-400">{flowM3s > 0 ? `${flowM3s} m³/s` : '140 m³/s'}</div>
                <div className="text-[10px] text-slate-400">Francis vertical</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Tension Générateur Un' : 'Generator Voltage Un'}</div>
                <div className="text-base font-bold text-violet-400">{voltageKv} kV</div>
                <div className="text-[10px] text-slate-400">50 Hz Triphasé</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-sky-500/30 bg-sky-950/20">
                <div className="text-[10px] text-sky-400 uppercase">{locale === 'fr' ? 'Évacuation Réseau' : 'Grid Evacuation'}</div>
                <div className="text-base font-bold text-white">{stepUpKv} kV THT</div>
                <div className="text-[10px] text-sky-300">Vers D04 Postes / D03</div>
              </div>
            </>
          )}

          {activeTechnology === 'solar' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Crête Pdc' : 'DC Peak Power Pdc'}</div>
                <div className="text-base font-bold text-amber-400">30.0 MWc</div>
                <div className="text-[10px] text-slate-400">Guider / Maroua</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Irradiance GHI' : 'Solar Irradiance GHI'}</div>
                <div className="text-base font-bold text-yellow-300">1 000 W/m²</div>
                <div className="text-[10px] text-slate-400">Conditions STC 25°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Rendement Cellule' : 'Cell Efficiency'}</div>
                <div className="text-base font-bold text-emerald-400">21.8%</div>
                <div className="text-[10px] text-slate-400">Mono-Si PERC / TOPCon</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Tension Chaîne Vmp' : 'String Voltage Vmp'}</div>
                <div className="text-base font-bold text-cyan-400">1 500 Vcc</div>
                <div className="text-[10px] text-slate-400">Architecture 1.5 kV</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Rendement Onduleur' : 'Inverter Efficiency'}</div>
                <div className="text-base font-bold text-violet-400">98.8%</div>
                <div className="text-[10px] text-slate-400">IGBT MPPT Centralisé</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-amber-500/30 bg-amber-950/20">
                <div className="text-[10px] text-amber-400 uppercase">{locale === 'fr' ? 'Collecte & Injection' : 'Collection & Feeding'}</div>
                <div className="text-base font-bold text-white">33 kV / 110 kV</div>
                <div className="text-[10px] text-amber-300">Injection RIN Grand Nord</div>
              </div>
            </>
          )}

          {activeTechnology === 'wind' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Nominale Pn' : 'Rated Power Pn'}</div>
                <div className="text-base font-bold text-cyan-400">4.5 MW / turbine</div>
                <div className="text-[10px] text-slate-400">Parc 100 MW (22 turbines)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Vitesse Vent Nominale' : 'Rated Wind Speed'}</div>
                <div className="text-base font-bold text-emerald-400">11.5 m/s</div>
                <div className="text-[10px] text-slate-400">Démarrage 3.0 m/s</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Limite de Betz Cp' : 'Betz Coefficient Cp'}</div>
                <div className="text-base font-bold text-sky-400">48.5%</div>
                <div className="text-[10px] text-slate-400">Max théorique 59.3%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Vitesse Rotation Rotor' : 'Rotor Speed'}</div>
                <div className="text-base font-bold text-amber-400">9 - 14 tr/min</div>
                <div className="text-[10px] text-slate-400">Diamètre rotor 150 m</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Génératrice & Convertisseur' : 'Generator & Converter'}</div>
                <div className="text-base font-bold text-violet-400">DFIG / PMSG</div>
                <div className="text-[10px] text-slate-400">Convertisseur 4-quadrants</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-cyan-500/30 bg-cyan-950/20">
                <div className="text-[10px] text-cyan-400 uppercase">{locale === 'fr' ? 'Évacuation Réseau' : 'Grid Interconnection'}</div>
                <div className="text-base font-bold text-white">690 V → 33 kV → 225 kV</div>
                <div className="text-[10px] text-cyan-300">Régulation P(f) & Q(U)</div>
              </div>
            </>
          )}

          {activeTechnology === 'thermal' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Nette Pe' : 'Net Power Pe'}</div>
                <div className="text-base font-bold text-orange-400">216 MW</div>
                <div className="text-[10px] text-slate-400">Centrale Gaz Kribi</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Rendement Cycle CCGT' : 'CCGT Efficiency'}</div>
                <div className="text-base font-bold text-emerald-400">58.5%</div>
                <div className="text-[10px] text-slate-400">Brayton (Gaz) + Rankine (Vapeur)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Température Flamme' : 'Firing Temperature'}</div>
                <div className="text-base font-bold text-red-400">1 450 °C</div>
                <div className="text-[10px] text-slate-400">Combustion continue gaz</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Pression Vapeur HP' : 'HP Steam Pressure'}</div>
                <div className="text-base font-bold text-cyan-400">120 bar</div>
                <div className="text-[10px] text-slate-400">Chaudière HRSG</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Vitesse Ligne d\'Arbre' : 'Shaft Speed'}</div>
                <div className="text-base font-bold text-violet-400">3 000 tr/min</div>
                <div className="text-[10px] text-slate-400">Alternateur 2 pôles 50 Hz</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-orange-500/30 bg-orange-950/20">
                <div className="text-[10px] text-orange-400 uppercase">{locale === 'fr' ? 'Évacuation Réseau' : 'Grid Evacuation'}</div>
                <div className="text-base font-bold text-white">15 kV → 225 kV</div>
                <div className="text-[10px] text-orange-300">Injection RIS Mangombé</div>
              </div>
            </>
          )}

          {activeTechnology === 'nuclear' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Électrique Pe' : 'Net Electric Pe'}</div>
                <div className="text-base font-bold text-violet-400">1 650 MWe</div>
                <div className="text-[10px] text-slate-400">Réacteur EPR 4 boucles</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Thermique Pth' : 'Thermal Core Pth'}</div>
                <div className="text-base font-bold text-sky-400">4 500 MWth</div>
                <div className="text-[10px] text-slate-400">Fission contrôlée U-235</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Pression Circuit Primaire' : 'Primary Pressure'}</div>
                <div className="text-base font-bold text-red-400">155 bar</div>
                <div className="text-[10px] text-slate-400">Maintien eau sous-refroidie</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Température Cuve' : 'Core Outlet Temp'}</div>
                <div className="text-base font-bold text-amber-400">328 °C</div>
                <div className="text-[10px] text-slate-400">Entrée 295°C / ΔT 33°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Vapeur Secondaire GV' : 'Secondary Steam'}</div>
                <div className="text-base font-bold text-cyan-400">78 bar / 293 °C</div>
                <div className="text-[10px] text-slate-400">4 Générateurs de vapeur</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-violet-500/30 bg-violet-950/20">
                <div className="text-[10px] text-violet-400 uppercase">{locale === 'fr' ? 'Alternateur & Réseau' : 'Generator & Grid'}</div>
                <div className="text-base font-bold text-white">24 kV → 400 kV</div>
                <div className="text-[10px] text-violet-300">Inertie H = 5.5 s (Base)</div>
              </div>
            </>
          )}

          {activeTechnology === 'biomass' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Électrique' : 'Electric Output'}</div>
                <div className="text-base font-bold text-emerald-400">25.0 MW</div>
                <div className="text-[10px] text-slate-400">Agro-industrie SOSUCAM</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Débit Vapeur Produit' : 'Steam Output'}</div>
                <div className="text-base font-bold text-amber-400">110 t/h</div>
                <div className="text-[10px] text-slate-400">Vapeur process usine</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Pression Chaudière' : 'Boiler Pressure'}</div>
                <div className="text-base font-bold text-cyan-400">65 bar</div>
                <div className="text-[10px] text-slate-400">Lit fluidisé bouillonnant</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Température Surchauffe' : 'Superheat Temp'}</div>
                <div className="text-base font-bold text-red-400">480 °C</div>
                <div className="text-[10px] text-slate-400">Bagasse / bois / coques</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Rendement Global Cogé' : 'CHP Overall Efficiency'}</div>
                <div className="text-base font-bold text-violet-400">82.0%</div>
                <div className="text-[10px] text-slate-400">Électricité + Chaleur</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-emerald-500/30 bg-emerald-950/20">
                <div className="text-[10px] text-emerald-400 uppercase">{locale === 'fr' ? 'Raccordement Réseau' : 'Grid Connection'}</div>
                <div className="text-base font-bold text-white">11 kV → 33 kV</div>
                <div className="text-[10px] text-emerald-300">Surplus injecté au réseau MT</div>
              </div>
            </>
          )}
        </div>

        {/* ROW D: Journey Selector */}
        {activeTechnology === 'hydro' ? (
          <div className="pt-2 border-t border-[#222B38]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                {
                  stage: 1 as const,
                  titleFr: '1. Ressources & Parc National',
                  titleEn: '1. Resources & National Fleet',
                  subFr: 'Hydrologie, Solaire, Thermique & Sizing',
                  subEn: 'Hydrology, Solar, Thermal & Sizing',
                  icon: Waves
                },
                {
                  stage: 2 as const,
                  titleFr: '2. Génie Civil & Turbines',
                  titleEn: '2. Civil Works & Turbines',
                  subFr: '17 Étapes SVG, Conduites & Hill Chart',
                  subEn: '17-Stage SVG, Penstocks & Hill Chart',
                  icon: Cpu
                },
                {
                  stage: 3 as const,
                  titleFr: '3. Alternateur & Stabilité',
                  titleEn: '3. Alternator & Stability',
                  subFr: 'Diagramme P-Q, AVR & Statisme f-P',
                  subEn: 'P-Q Curve, AVR & Droop f-P',
                  icon: Zap
                },
                {
                  stage: 4 as const,
                  titleFr: '4. Auxiliaires BoP & Protections',
                  titleEn: '4. Station Auxiliaries & Protection',
                  subFr: 'Services Propres & 12 Relais ANSI',
                  subEn: 'Station BoP & 12 ANSI Relays',
                  icon: ShieldCheck
                },
                {
                  stage: 5 as const,
                  titleFr: '5. Essais, O&M & Dossier DQE',
                  titleEn: '5. Commissioning, O&M & BOQ',
                  subFr: 'Délestage, Vibrations & DQE FCFA',
                  subEn: 'Load Rejection, O&M & BOQ FCFA',
                  icon: FileCheck
                }
              ].map((st) => {
                const isSelected = activeStage === st.stage;
                const Icon = st.icon;
                return (
                  <button
                    key={st.stage}
                    type="button"
                    onClick={() => onSelectStage(st.stage)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                        : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200 hover:bg-[#161F2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? st.titleFr : st.titleEn}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate">
                      {locale === 'fr' ? st.subFr : st.subEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-[#222B38] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase">
                {locale === 'fr' ? 'Filière Active' : 'Active Sector'}
              </span>
              <span className="font-bold text-white">
                {locale === 'fr' 
                  ? technologies.find(t => t.id === activeTechnology)?.labelFr 
                  : technologies.find(t => t.id === activeTechnology)?.labelEn}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-[11px]">
                {locale === 'fr' ? 'Chaîne de conversion physique & dossiers d’appareillages' : 'Physical conversion chain & apparatus dossiers'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectTechnology('hydro')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{locale === 'fr' ? '← Revenir à l\'Hydroélectricité' : '← Return to Hydroelectric'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
