// src/components/installations/EarthingAndNeutralExplorer.tsx
// EPEDE D06 - Earthing Arrangements (TT, TN-S, TN-C, TN-C-S, IT) & Phase Balancing / Neutral Current Simulator

import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Sliders,
  Scale,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Calculator
} from 'lucide-react';
import {
  EARTHING_SYSTEMS_SPECS,
  type EarthingSystemType
} from './data/installationCatalog';

interface EarthingAndNeutralExplorerProps {
  locale: 'fr' | 'en';
  selectedEarthing: EarthingSystemType;
  onSelectEarthing: (earth: EarthingSystemType) => void;
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

export const EarthingAndNeutralExplorer: React.FC<EarthingAndNeutralExplorerProps> = ({
  locale,
  selectedEarthing,
  onSelectEarthing,
  onNavigateToWorkbenchTab
}) => {
  // Phase balancing state (Currents in Amperes on L1, L2, L3)
  const [currentL1, setCurrentL1] = useState<number>(65);
  const [currentL2, setCurrentL2] = useState<number>(45);
  const [currentL3, setCurrentL3] = useState<number>(50);

  // Neutral current computation for 120° phase shifted currents
  // In = sqrt(I1^2 + I2^2 + I3^2 - (I1*I2 + I2*I3 + I3*I1))
  const neutralCurrent = Math.sqrt(
    Math.max(
      0,
      currentL1 * currentL1 +
        currentL2 * currentL2 +
        currentL3 * currentL3 -
        (currentL1 * currentL2 + currentL2 * currentL3 + currentL3 * currentL1)
    )
  );

  const avgCurrent = (currentL1 + currentL2 + currentL3) / 3;
  const maxDeviation = Math.max(
    Math.abs(currentL1 - avgCurrent),
    Math.abs(currentL2 - avgCurrent),
    Math.abs(currentL3 - avgCurrent)
  );
  const unbalancePercent = avgCurrent > 0 ? (maxDeviation / avgCurrent) * 100 : 0;

  const activeSpec =
    EARTHING_SYSTEMS_SPECS.find((s) => s.id === selectedEarthing) || EARTHING_SYSTEMS_SPECS[0];

  const handleBalanceEqually = () => {
    const mean = Math.round(avgCurrent);
    setCurrentL1(mean);
    setCurrentL2(mean);
    setCurrentL3(mean);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[10px]">
              EARTHING SYSTEMS & NEUTRAL
            </span>
            <span className="text-slate-400 text-xs">IEC 60364-4-41 · Schémas des Liaisons à la Terre (SLT)</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Régimes de Neutre (TT, TN-S, TN-C, TN-C-S, IT) & Équilibrage des Phases'
              : 'Earthing Regimes (TT, TN-S, TN-C, TN-C-S, IT) & Phase Balancing Engine'}
          </h2>
        </div>
      </div>

      {/* 5 Earthing Regimes Comparative Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-300 block">
          {locale === 'fr'
            ? 'Sélectionnez un Régime de Neutre pour inspecter la boucle de défaut :'
            : 'Select an Earthing Regime to inspect the fault loop:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {EARTHING_SYSTEMS_SPECS.map((spec) => {
            const isSelected = spec.id === selectedEarthing;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectEarthing(spec.id)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-[#0E1522] text-slate-300 border-[#1C2538] hover:border-emerald-400'
                }`}
              >
                <div className="text-xs font-black">{spec.code}</div>
                <div className="text-[9px] opacity-80 mt-0.5 truncate">
                  {spec.id === 'TT'
                    ? 'DDR obligatoire'
                    : spec.id === 'TN_S'
                    ? 'Court-circuit franc'
                    : spec.id === 'TN_C'
                    ? 'PEN commun'
                    : spec.id === 'TN_C_S'
                    ? 'PME amont'
                    : 'Neutre isolé / CPI'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Earthing Regime Deep Engineering Card */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1C2538]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-black text-xs">
              {activeSpec.code}
            </span>
            <span className="text-xs font-bold text-white">
              {locale === 'fr' ? activeSpec.name_fr : activeSpec.name_en}
            </span>
          </div>
          <div className="text-[10px] text-amber-400 font-bold">
            {locale === 'fr' ? 'Temps max coupure : ' : 'Max trip time: '}
            <strong className="text-white">{activeSpec.disconnection_time_limit}</strong>
          </div>
        </div>

        {/* 4 Technical Characteristics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {locale === 'fr' ? '1. Raccordement du Neutre Source :' : '1. Source Neutral Connection:'}
            </span>
            <p className="text-slate-200 font-sans leading-relaxed">
              {locale === 'fr' ? activeSpec.source_neutral_connection_fr : activeSpec.source_neutral_connection_en}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {locale === 'fr' ? '2. Raccordement des Masses Bâtiment :' : '2. Enclosure Grounding (PE):'}
            </span>
            <p className="text-slate-200 font-sans leading-relaxed">
              {locale === 'fr'
                ? activeSpec.exposed_conductive_parts_connection_fr
                : activeSpec.exposed_conductive_parts_connection_en}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {locale === 'fr' ? '3. Nature de la Boucle de Défaut :' : '3. Fault Loop Characteristics:'}
            </span>
            <p className="text-slate-200 font-sans leading-relaxed">
              {locale === 'fr' ? activeSpec.fault_loop_nature_fr : activeSpec.fault_loop_nature_en}
            </p>
            <div className="text-[10px] text-amber-400 font-bold mt-1">
              Courant de défaut : {activeSpec.fault_current_magnitude}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {locale === 'fr' ? '4. Organe de Coupure Obligatoire :' : '4. Mandatory Protection Device:'}
            </span>
            <p className="text-emerald-300 font-bold font-sans leading-relaxed">
              {activeSpec.mandatory_protection_device}
            </p>
          </div>
        </div>

        {/* Advantages vs Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#1C2538]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              {locale === 'fr' ? 'Avantages Majeurs :' : 'Key Advantages:'}
            </span>
            <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
              {(locale === 'fr' ? activeSpec.main_advantages_fr : activeSpec.main_advantages_en).map((adv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {locale === 'fr' ? 'Contraintes & Limites :' : 'Key Limitations:'}
            </span>
            <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
              {(locale === 'fr' ? activeSpec.main_limitations_fr : activeSpec.main_limitations_en).map((lim, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Phase Balancing & Neutral Current Vector Simulator */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-white">
              {locale === 'fr'
                ? 'Simulateur d\'Équilibrage Triphasé & Courant dans le Neutre (I_N)'
                : '3-Phase Balancing Simulator & Calculated Neutral Current (I_N)'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBalanceEqually}
            className="px-2.5 py-1 rounded-lg bg-[#141C2B] text-sky-300 hover:text-white border border-sky-800/40 text-[10px] font-bold cursor-pointer"
          >
            {locale === 'fr' ? 'Équilibrer à 100%' : 'Balance 100%'}
          </button>
        </div>

        {/* 3 Interactive Phase Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1 Slider */}
          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-[10px]">Phase L1 (Brun)</span>
              <span className="text-white font-black text-sm">{currentL1} A</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentL1}
              onChange={(e) => setCurrentL1(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Phase 2 Slider */}
          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold text-[10px]">Phase L2 (Noir)</span>
              <span className="text-white font-black text-sm">{currentL2} A</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentL2}
              onChange={(e) => setCurrentL2(parseInt(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer"
            />
          </div>

          {/* Phase 3 Slider */}
          <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-[10px]">Phase L3 (Gris)</span>
              <span className="text-white font-black text-sm">{currentL3} A</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentL3}
              onChange={(e) => setCurrentL3(parseInt(e.target.value))}
              className="w-full accent-slate-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Real-time Neutral Current Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#080B12] border border-[#1C2538]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Courant dans le Neutre (I_N) :</span>
            <strong
              className={`text-base font-black ${
                neutralCurrent > 30 ? 'text-rose-400' : neutralCurrent > 15 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {neutralCurrent.toFixed(1)} A
            </strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Taux de Déséquilibre :</span>
            <strong
              className={`text-base font-black ${
                unbalancePercent > 20 ? 'text-rose-400' : unbalancePercent > 10 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {unbalancePercent.toFixed(1)} %
            </strong>
          </div>

          <div className="flex items-center text-[10px] text-slate-300 font-sans">
            {neutralCurrent === 0 ? (
              <span className="text-emerald-400 font-bold">
                ✓ Système parfaitement équilibré : I_N = 0 A (Zéro perte Joule dans le neutre).
              </span>
            ) : neutralCurrent > 30 ? (
              <span className="text-rose-400 font-bold">
                ⚠️ Déséquilibre sévère : Risque de surchauffe thermique du câble de neutre !
              </span>
            ) : (
              <span className="text-slate-300">
                Courant de déséquilibre modéré absorbé par le conducteur neutre.
              </span>
            )}
          </div>
        </div>

        {/* Workbench Deep Calculation Gateway */}
        {onNavigateToWorkbenchTab && (
          <div className="pt-3 border-t border-[#1C2538] flex flex-wrap items-center justify-between gap-3">
            <span className="text-slate-400 text-xs">
              {locale === 'fr'
                ? 'Calculer la boucle de défaut et la prise de terre dans l\'Atelier Projet :'
                : 'Calculate fault loop impedance and earth electrode in the Design Workbench:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('EARTHING_TOUCH_VOLTAGE')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '15. Prise de Terre & Tensions Toucher' : '15. Earthing & Touch Voltage'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('SHORT_CIRCUIT_IMPEDANCE')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? '5. Court-Circuit & Impédances' : '5. Short-Circuit & Impedances'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
