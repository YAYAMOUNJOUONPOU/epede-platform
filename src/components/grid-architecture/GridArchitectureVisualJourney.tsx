// src/components/grid-architecture/GridArchitectureVisualJourney.tsx
// EPEDE - Master Container for Power-System Architecture & Grid Planning (D02)

import React, { useState } from 'react';
import { 
  Layers, 
  Activity, 
  Zap, 
  GitFork, 
  Compass, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Share2,
  FileText,
  Network,
  Cpu
} from 'lucide-react';
import { MasterPowerSystemJourney } from './MasterPowerSystemJourney';
import { SubstationArchitectureSld } from './SubstationArchitectureSld';
import { VoltageBandsAndPhysics } from './VoltageBandsAndPhysics';
import { NetworkTopologiesAndReliability } from './NetworkTopologiesAndReliability';
import { GridPlanningAndN1Lab } from './GridPlanningAndN1Lab';

interface GridArchitectureVisualJourneyProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const GridArchitectureVisualJourney: React.FC<GridArchitectureVisualJourneyProps> = ({
  locale,
  onSelectEquipment,
  onNavigateDomain
}) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'substation' | 'voltage_bands' | 'topologies' | 'planning'>('journey');

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0D1117] via-[#161B22] to-[#0D1117] border border-[#252E38] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                DOMAINE D02 · ARCHITECTURE RÉSEAU & PLANIFICATION
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                RÉFÉRENTIEL CEI & SONATREL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {locale === 'fr' ? '5 Piliers d\'Ingénierie Système' : '5 System Engineering Pillars'}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {locale === 'fr'
                ? 'Architecture des Réseaux Électriques & Études de Planification'
                : 'Power-System Architecture & Transmission Grid Planning'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
              {locale === 'fr'
                ? 'Exploration intégrée du système électrique haute tension : chaîne continue de transport 15 étapes, manœuvres et verrouillages de poste 225 kV, physique des paliers de tension, topologies & résilience SAIDI/SAIFI, et laboratoire de contingence déterministe N-1.'
                : 'Comprehensive high-voltage power system platform: 15-stage continuous grid backbone, 225 kV substation switching interlocks, voltage scaling physics, network topologies & SAIDI/SAIFI reliability, and deterministic N-1 contingency studies.'}
            </p>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Tension Dorsale' : 'Backbone Voltage'}</div>
              <div className="text-sm font-bold font-mono text-sky-400">225 kV RIS</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">{locale === 'fr' ? 'Critère Sécurité' : 'Security Rule'}</div>
              <div className="text-sm font-bold font-mono text-emerald-400">N-1 Strict</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Architecture Navigation Ribbon */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-2 shadow-lg overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-[760px]">
          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-300" />
            <span>{locale === 'fr' ? '1. Parcours Maître (15 Étapes)' : '1. Master Journey (15 Stages)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('substation')}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'substation'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-300" />
            <span>{locale === 'fr' ? '2. Poste HTB & Verrouillages' : '2. Substation & Interlocks'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voltage_bands')}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'voltage_bands'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{locale === 'fr' ? '3. Paliers & Physique' : '3. Voltage Bands & Physics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('topologies')}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'topologies'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GitFork className="w-4 h-4 text-indigo-300" />
            <span>{locale === 'fr' ? '4. Topologies & SAIDI' : '4. Topologies & SAIDI'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('planning')}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'planning'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>{locale === 'fr' ? '5. Planification & N-1' : '5. Planning & N-1 Lab'}</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'journey' && (
        <MasterPowerSystemJourney
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateDomain={onNavigateDomain}
        />
      )}

      {activeTab === 'substation' && (
        <SubstationArchitectureSld
          locale={locale}
          onSelectEquipment={onSelectEquipment}
        />
      )}

      {activeTab === 'voltage_bands' && (
        <VoltageBandsAndPhysics
          locale={locale}
        />
      )}

      {activeTab === 'topologies' && (
        <NetworkTopologiesAndReliability
          locale={locale}
        />
      )}

      {activeTab === 'planning' && (
        <GridPlanningAndN1Lab
          locale={locale}
        />
      )}
    </div>
  );
};

