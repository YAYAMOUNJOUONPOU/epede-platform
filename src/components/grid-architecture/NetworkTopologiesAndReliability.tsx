// src/components/grid-architecture/NetworkTopologiesAndReliability.tsx
// EPEDE - Grid Topologies, Fault Simulation & SAIDI/SAIFI Reliability Engineering

import React, { useState } from 'react';
import { 
  GitFork, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  BarChart3,
  Network
} from 'lucide-react';
import { NETWORK_TOPOLOGIES } from './data/networkTopologiesData';
import { NetworkTopologyModel } from './types';

interface NetworkTopologiesAndReliabilityProps {
  locale: 'fr' | 'en';
}

export const NetworkTopologiesAndReliability: React.FC<NetworkTopologiesAndReliabilityProps> = ({ locale }) => {
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>('open_ring');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeTopology = NETWORK_TOPOLOGIES.find(t => t.id === selectedTopologyId) || NETWORK_TOPOLOGIES[1];

  const handleSelectTopology = (id: string) => {
    setSelectedTopologyId(id);
    setSimulationStep(0);
    setIsSimulating(false);
  };

  const handleNextStep = () => {
    if (simulationStep < activeTopology.faultSequence[locale].length) {
      setSimulationStep(s => s + 1);
    }
  };

  const handleResetSim = () => {
    setSimulationStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            TOPOLOGIES DE RÉSEAU & INDICES SAIDI / SAIFI
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {locale === 'fr' ? 'Architectures Électriques & Résilience face aux Défaillances' : 'Network Structures & Fault Resilience Engineering'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          {locale === 'fr' 
            ? 'Topologies de Réseau, Comparateur de Résilience & Simulateur de Panne' 
            : 'Grid Topologies, Reliability Metrics (SAIDI / SAIFI) & Fault Simulator'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
          {locale === 'fr'
            ? 'La forme géométrique et logique du réseau détermine directement son comportement lors d\'un incident. Comparez les 4 grandes architectures : Radiale, Boucle Ouverte, Maillée et Interconnectée multi-zones.'
            : 'The spatial and electrical topology governs system reliability. Compare the 4 foundational grid structures: Radial, Open Loop, Meshed and Regional Interconnected systems.'}
        </p>
      </div>

      {/* 4 Topologies Selector Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {NETWORK_TOPOLOGIES.map((topo) => {
          const isSelected = topo.id === selectedTopologyId;
          return (
            <button
              key={topo.id}
              type="button"
              onClick={() => handleSelectTopology(topo.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20 shadow-md shadow-sky-500/10'
                  : 'bg-[#0D1117] border-[#252E38] hover:border-slate-700 hover:bg-[#161B22]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  topo.reliabilityRating.includes('N-1') || topo.reliabilityRating.includes('Maximale')
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {topo.reliabilityRating}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {topo.investmentCost}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white mt-2">
                {topo.name[locale]}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {topo.schematicSummary[locale]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Fault Sequence Simulation */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252E38] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === 'fr' ? 'Simulateur Séquentiel d\'Incident & Réalimentation' : 'Sequential Fault & Service Restoration Lab'}
              </h3>
              <span className="text-xs text-slate-400">
                {activeTopology.name[locale]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSim}
              className="px-3 py-1.5 rounded-lg border border-[#252E38] bg-[#161B22] hover:bg-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={simulationStep >= activeTopology.faultSequence[locale].length}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-600/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                {simulationStep === 0 
                  ? (locale === 'fr' ? 'Déclencher Défaut' : 'Simulate Fault')
                  : (locale === 'fr' ? 'Étape Suivante' : 'Next Step')}
              </span>
            </button>
          </div>
        </div>

        {/* Step-by-step Fault Flow */}
        <div className="space-y-2.5">
          {activeTopology.faultSequence[locale].map((stepText, idx) => {
            const isCompleted = idx < simulationStep;
            const isCurrent = idx === simulationStep - 1;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-950/20'
                    : isCompleted
                    ? 'bg-[#161B22] border-[#252E38] text-slate-300'
                    : 'bg-[#0D1117] border-[#1E2633] opacity-40 text-slate-500'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                    ? 'bg-sky-500 text-white ring-4 ring-sky-500/20' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-mono leading-relaxed">
                  {stepText}
                </p>
              </div>
            );
          })}
        </div>

        {simulationStep === 0 && (
          <div className="p-3.5 bg-[#161B22] border border-[#252E38] rounded-xl text-xs text-slate-400 text-center font-mono">
            {locale === 'fr'
              ? 'Cliquez sur "Déclencher Défaut" pour observer pas à pas la réponse des protections et le processus de réalimentation.'
              : 'Click "Simulate Fault" to step through protection tripping and automated reconfiguration.'}
          </div>
        )}
      </div>

      {/* SAIDI / SAIFI Engineering Panel & Topology Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reliability Indices (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wide">
                {locale === 'fr' ? 'INDICES DE CONTINUITÉ DE FOURNITURE (CEI 60050 / IEEE 1366)' : 'RELIABILITY INDICES (IEEE 1366)'}
              </span>
            </div>
            <span className="text-xs font-mono text-indigo-300 font-bold bg-indigo-500/15 px-2.5 py-0.5 rounded border border-indigo-500/30">
              SAIDI · SAIFI · CAIDI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-4 bg-[#161B22] rounded-xl border border-[#252E38] space-y-1.5">
              <span className="text-slate-400 block text-[10px] font-bold">SAIDI (System Average Interruption Duration Index)</span>
              <span className="font-bold text-white block text-xs">
                {locale === 'fr' ? 'Impact sur la durée :' : 'Duration Impact:'}
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {activeTopology.saidiImpact[locale]}
              </p>
            </div>

            <div className="p-4 bg-[#161B22] rounded-xl border border-[#252E38] space-y-1.5">
              <span className="text-slate-400 block text-[10px] font-bold">SAIFI (System Average Interruption Frequency Index)</span>
              <span className="font-bold text-white block text-xs">
                {locale === 'fr' ? 'Impact sur la fréquence :' : 'Frequency Impact:'}
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {activeTopology.saifiImpact[locale]}
              </p>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="p-4 rounded-xl bg-[#161B22] border border-indigo-500/30 text-xs font-mono space-y-2">
            <span className="font-bold text-indigo-300 block">
              {locale === 'fr' ? 'Formulations Mathématiques Normalisées :' : 'Standard Mathematical Formulations:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
                <code>SAIDI = Σ(r_i · N_i) / N_Total [h/client/an]</code>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
                <code>SAIFI = Σ(N_i) / N_Total [interruptions/an]</code>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              {locale === 'fr' 
                ? 'r_i = durée de la coupure i en heures ; N_i = nombre de clients impactés ; N_Total = total des usagers.' 
                : 'r_i = restoration duration in hours; N_i = customers affected; N_Total = total connected customers.'}
            </div>
          </div>

          {/* Real Cameroon Case Study */}
          {activeTopology.cameroonExample && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs space-y-1">
              <span className="font-bold text-emerald-300 block flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {locale === 'fr' ? 'Exemple Réel sur le Réseau Camerounais :' : 'Real Cameroon Network Application:'}
              </span>
              <p className="text-emerald-200/90 font-sans leading-relaxed">
                {activeTopology.cameroonExample[locale]}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Strengths & Weaknesses Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-4">
          <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wide block border-b border-[#252E38] pb-2">
            {locale === 'fr' ? 'Bilan Technico-Économique' : 'Techno-Economic Assessment'}
          </span>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#161B22] text-xs space-y-1.5">
              <span className="font-mono font-bold text-emerald-400 block">
                ✓ {locale === 'fr' ? 'Avantages Majeurs' : 'Major Advantages'}
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
                {activeTopology.advantages[locale].map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#161B22] text-xs space-y-1.5">
              <span className="font-mono font-bold text-amber-400 block">
                ⚠️ {locale === 'fr' ? 'Contraintes & Inconvénients' : 'Constraints & Trade-offs'}
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
                {activeTopology.disadvantages[locale].map((dis, i) => (
                  <li key={i}>{dis}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
