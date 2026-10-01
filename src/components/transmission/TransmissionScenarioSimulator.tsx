// src/components/transmission/TransmissionScenarioSimulator.tsx
// EPEDE D03 - Complete Interactive Transmission Operational Scenario Simulator (16 Scenarios)

import React, { useState } from 'react';
import {
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldAlert,
  Compass,
  Radio,
  FileText,
  Sliders,
  Info
} from 'lucide-react';
import { TRANSMISSION_16_SCENARIOS, DetailedTransmissionScenario } from './data/transmission16Scenarios';

interface TransmissionScenarioSimulatorProps {
  locale: 'fr' | 'en';
}

export const TransmissionScenarioSimulator: React.FC<TransmissionScenarioSimulatorProps> = ({
  locale
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(TRANSMISSION_16_SCENARIOS[0].id);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FAULT' | 'OUTAGE_RESTORATION' | 'MAINTENANCE'>('ALL');
  const [simulatedStateProgress, setSimulatedStateProgress] = useState<'INITIAL' | 'TRIGGERED' | 'CLEARED_RESTORED'>('INITIAL');

  // Live Scenario Parameters Slider (Active Power Flow & Pre-fault Voltage)
  const [simTransitPowerMw, setSimTransitPowerMw] = useState<number>(320);
  const [simPreFaultKv, setSimPreFaultKv] = useState<number>(225);

  // Dynamic calculations based on state
  const isTriggered = simulatedStateProgress === 'TRIGGERED';
  const isRestored = simulatedStateProgress === 'CLEARED_RESTORED';

  const liveVoltageKv = isTriggered ? Math.round(simPreFaultKv * 0.38) : isRestored ? simPreFaultKv : simPreFaultKv;
  const liveCurrentA = isTriggered ? Math.round(((simTransitPowerMw * 1e6) / (Math.sqrt(3) * simPreFaultKv * 1e3 * 0.95)) * 6.5) : isRestored ? Math.round((simTransitPowerMw * 1e6) / (Math.sqrt(3) * simPreFaultKv * 1e3 * 0.95)) : Math.round((simTransitPowerMw * 1e6) / (Math.sqrt(3) * simPreFaultKv * 1e3 * 0.95));
  const liveFrequencyHz = isTriggered ? 49.35 : isRestored ? 50.02 : 50.00;

  const filteredScenarios = TRANSMISSION_16_SCENARIOS.filter((s) => {
    if (filterCategory === 'ALL') return true;
    return s.category === filterCategory;
  });

  const selectedScenario: DetailedTransmissionScenario =
    TRANSMISSION_16_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    TRANSMISSION_16_SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38] shadow-xl font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              PILLIER 8 · SIMULATEUR DE SCÉNARIOS D'EXPLOITATION HTB (16 CAS CEI / CIGRE)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Simulateur d\'Événements Réseau, Défauts & Restauration'
                  : 'Interactive Grid Events, Fault Dynamics & Restoration Scenarios'}
              </span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label_fr: 'Tous (16)', label_en: 'All (16)' },
              { id: 'FAULT', label_fr: 'Défauts (7)', label_en: 'Faults (7)' },
              { id: 'OUTAGE_RESTORATION', label_fr: 'Coupure & Restauration (7)', label_en: 'Outage & Restore (7)' },
              { id: 'MAINTENANCE', label_fr: 'Maintenance LOTO (2)', label_en: 'Maintenance LOTO (2)' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-[#0D1117] text-slate-400 border-[#252E38] hover:text-white'
                }`}
              >
                {locale === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#252E38] text-[10px] text-slate-400 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            {locale === 'fr'
              ? 'Chaque scénario modélise la chaîne complète : Déclencheur → Impact topologique → Réaction électrotechnique → Téléaction de protection → Consignes de sécurité et protocole de rétablissement.'
              : 'Every scenario models the complete operational chain: Trigger → Topological impact → Electrotechnical reaction → Protective relaying & teleprotection → Safety warnings and restoration protocol.'}
          </span>
        </div>
      </div>

      {/* 2. 16-Scenario Selection Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs">
        {filteredScenarios.map((scen) => {
          const isSelected = scen.id === selectedScenario.id;
          return (
            <button
              key={scen.id}
              type="button"
              onClick={() => {
                setSelectedScenarioId(scen.id);
                setSimulatedStateProgress('INITIAL');
              }}
              className={`p-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-[#161B22] border-[#252E38] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                  SCÉNARIO {scen.number < 10 ? `0${scen.number}` : scen.number}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
              </div>
              <div className="text-[10px] font-bold line-clamp-2 mt-1 leading-tight text-slate-200">
                {locale === 'fr' ? scen.title_fr.split('. ')[1] : scen.title_en.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Interactive Simulation Panel for Selected Scenario */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-6 shadow-2xl font-mono text-xs">
        {/* Scenario Title & Category Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SCÉNARIO #{selectedScenario.number}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {selectedScenario.category}
              </span>
              <span className="text-slate-400 text-[11px]">
                Ouvrage affecté : <span className="text-white font-bold">{selectedScenario.affected_object}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>{locale === 'fr' ? selectedScenario.title_fr : selectedScenario.title_en}</span>
            </h3>
          </div>

          {/* Interactive Simulation Sequence Controller */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulatedStateProgress('INITIAL')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                simulatedStateProgress === 'INITIAL'
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'bg-[#0D1117] text-slate-400 border-[#252E38]'
              }`}
            >
              1. État Initial
            </button>
            <button
              type="button"
              onClick={() => setSimulatedStateProgress('TRIGGERED')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                simulatedStateProgress === 'TRIGGERED'
                  ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20'
                  : 'bg-[#0D1117] text-slate-400 border-[#252E38]'
              }`}
            >
              <Play className="h-3 w-3" />
              <span>2. Déclenchement Défaut</span>
            </button>
            <button
              type="button"
              onClick={() => setSimulatedStateProgress('CLEARED_RESTORED')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                simulatedStateProgress === 'CLEARED_RESTORED'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-[#0D1117] text-slate-400 border-[#252E38]'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>3. Élimination & Rétablissement</span>
            </button>
          </div>
        </div>

        {/* Dynamic State Machine Progress Indicator */}
        <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">Transition d'État :</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
              {selectedScenario.initial_state}
            </span>
            <span className="text-amber-400">──►</span>
            <span className={`px-2 py-0.5 rounded font-bold border ${
              simulatedStateProgress === 'TRIGGERED'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : simulatedStateProgress === 'CLEARED_RESTORED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {selectedScenario.final_state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Impact Topologique Visuel :</span>
            <span className="text-white font-bold">
              {locale === 'fr'
                ? selectedScenario.visual_topology_impact_fr
                : selectedScenario.visual_topology_impact_en}
            </span>
          </div>
        </div>

        {/* Live SCADA Telemetry & Fault Waveform Oscillogram */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-3">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>TÉLÉMESURES SCADA EN TEMPS RÉEL (PHASOR MEASUREMENT UNIT)</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              isTriggered ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isTriggered ? 'PERTURBATION DÉTECTÉE' : 'RÉGIME NOMINAL'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[10px] text-slate-500 block">Tension Ligne</span>
              <span className={`text-base font-bold font-mono ${isTriggered ? 'text-red-400' : 'text-cyan-400'}`}>
                {liveVoltageKv} kV
              </span>
              <span className="text-[9px] text-slate-500 block">{isTriggered ? 'Effondrement résiduel' : 'Tension assignée'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[10px] text-slate-500 block">Courant Transit</span>
              <span className={`text-base font-bold font-mono ${isTriggered ? 'text-red-400' : 'text-amber-400'}`}>
                {liveCurrentA} A
              </span>
              <span className="text-[9px] text-slate-500 block">{isTriggered ? 'Courant de court-circuit' : 'Charge nominale'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[10px] text-slate-500 block">Fréquence Réseau</span>
              <span className={`text-base font-bold font-mono ${liveFrequencyHz < 49.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                {liveFrequencyHz.toFixed(2)} Hz
              </span>
              <span className="text-[9px] text-slate-500 block">Tolérance 50.00 ± 0.2 Hz</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[10px] text-slate-500 block">Puissance Transitée</span>
              <span className="text-base font-bold font-mono text-white">
                {isTriggered ? 0 : simTransitPowerMw} MW
              </span>
              <span className="text-[9px] text-slate-500 block">{isTriggered ? 'Coupure d\'injection' : 'Débit de consigne'}</span>
            </div>
          </div>
        </div>

        {/* 4 Multi-Dimensional Cards: Preconditions, Electrical Reaction, Protections, Safety & Restore */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Trigger & Preconditions */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
            <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>Déclencheur & Préconditions</span>
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Événement Déclencheur :</span>
                <span className="text-white font-bold">
                  {locale === 'fr' ? selectedScenario.trigger_fr : selectedScenario.trigger_en}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Préconditions Réseau :</span>
                <span>
                  {locale === 'fr' ? selectedScenario.preconditions_fr : selectedScenario.preconditions_en}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Electrotechnical Effect */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
            <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              <span>Comportement Électrique</span>
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Effet sur P, Q, V & Courants :</span>
                <span className="text-cyan-200">
                  {locale === 'fr' ? selectedScenario.electrical_effect_fr : selectedScenario.electrical_effect_en}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Protection & Communication */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
            <span className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>Réaction des Protections & Télécom</span>
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Automatisme Relais 21 / 87L :</span>
                <span className="text-white">
                  {locale === 'fr' ? selectedScenario.protection_response_fr : selectedScenario.protection_response_en}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Téléaction OPGW / SCADA :</span>
                <span className="text-slate-400">
                  {locale === 'fr' ? selectedScenario.communication_context_fr : selectedScenario.communication_context_en}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Safety & Restoration Protocol */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-amber-500/30 space-y-2.5">
            <span className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Sécurité & Rétablissement</span>
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] leading-tight">
                <span className="font-bold uppercase block mb-0.5">Consigne de Sécurité :</span>
                {locale === 'fr' ? selectedScenario.safety_warning_fr : selectedScenario.safety_warning_en}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Protocole de Rétablissement :</span>
                <span className="text-emerald-300 font-bold">
                  {locale === 'fr' ? selectedScenario.restoration_concept_fr : selectedScenario.restoration_concept_en}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
