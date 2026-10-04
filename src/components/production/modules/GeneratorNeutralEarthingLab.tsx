// src/components/production/modules/GeneratorNeutralEarthingLab.tsx
// EPEDE D01 - Generator Stator Neutral Grounding & Earth-Fault Protection Lab (IEEE C37.101 / IEEE 142)

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Calculator,
  Activity
} from 'lucide-react';

interface GeneratorNeutralEarthingLabProps {
  locale: 'fr' | 'en';
  voltageKv?: number;
  ratedMva?: number;
}

export const GeneratorNeutralEarthingLab: React.FC<GeneratorNeutralEarthingLabProps> = ({
  locale,
  voltageKv = 15.0,
  ratedMva = 70.0
}) => {
  // Grounding System State
  const [groundingType, setGroundingType] = useState<'HIGH_RESISTANCE_NGT' | 'LOW_RESISTANCE' | 'RESONANT_PETERSON'>('HIGH_RESISTANCE_NGT');
  const [totalZeroSeqCapacitanceMicroF, setTotalZeroSeqCapacitanceMicroF] = useState<number>(0.35); // 0.25 - 0.60 uF typical (stator + IPB + GSU)
  const [targetFaultCurrentAmps, setTargetFaultCurrentAmps] = useState<number>(8.0); // 5 to 10 A typical for high-resistance NGT
  const [ngtTurnRatio, setNgtTurnRatio] = useState<number>(15000 / 240); // 15 kV / 240 V transformer

  // Calculations
  const results = useMemo(() => {
    const vPhaseVolts = (voltageKv * 1e3) / Math.sqrt(3);
    const omega = 2 * Math.PI * 50; // 50 Hz

    // Total zero-sequence capacitive current under bolted phase-to-ground fault:
    // I_c0 = 3 * omega * C_0 * V_phase
    const capacitiveFaultCurrentAmps = Number((3 * omega * (totalZeroSeqCapacitanceMicroF * 1e-6) * vPhaseVolts).toFixed(2));

    // To prevent transient overvoltages from arcing grounds (IEEE C37.101 requirement):
    // Resistor resistive current I_R must be >= total capacitive charging current I_c0
    // => R_prim_max = V_phase / I_c0
    const primaryResistorReqOhm = Number((vPhaseVolts / Math.max(1, targetFaultCurrentAmps)).toFixed(1));

    // Secondary resistance reflected across NGT transformer:
    // R_sec = R_prim / (turnRatio)^2
    const secondaryResistorOhm = Number((primaryResistorReqOhm / Math.pow(ngtTurnRatio, 2)).toFixed(2));

    // Total fault current magnitude: I_fault = sqrt(I_R^2 + I_c0^2)
    const totalFaultCurrentAmps = Number(Math.sqrt(Math.pow(targetFaultCurrentAmps, 2) + Math.pow(capacitiveFaultCurrentAmps, 2)).toFixed(2));

    // Secondary voltage under full displacement (59N pickup):
    const secondaryFullGroundVoltageV = Math.round(vPhaseVolts / ngtTurnRatio);

    // Resistor thermal power dissipation rating (10 seconds or continuous):
    const resistorContinuousPowerKw = Number(((Math.pow(secondaryFullGroundVoltageV, 2) / Math.max(0.1, secondaryResistorOhm)) / 1000).toFixed(1));

    // Lamination burning hazard limit:
    // When I_fault <= 10 A, no burning of stator magnetic iron core laminations occurs
    const isCoreDamagePrevented = totalFaultCurrentAmps <= 15.0;

    return {
      vPhaseVolts: Math.round(vPhaseVolts),
      capacitiveFaultCurrentAmps,
      primaryResistorReqOhm,
      secondaryResistorOhm,
      totalFaultCurrentAmps,
      secondaryFullGroundVoltageV,
      resistorContinuousPowerKw,
      isCoreDamagePrevented
    };
  }, [voltageKv, totalZeroSeqCapacitanceMicroF, targetFaultCurrentAmps, ngtTurnRatio]);

  return (
    <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-5 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            {locale === 'fr'
              ? 'Laboratoire de Mise à la Terre du Neutre Statorique (IEEE C37.101 & CEI 60034)'
              : 'Generator Stator Neutral Grounding & Fault Protection Lab (IEEE C37.101)'}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{locale === 'fr' ? 'Protection Fer Statorique Conforme' : 'Lamination Protection Verified'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Grounding Method Selector & Sliders */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Technologie de Raccordement Neutre' : 'Neutral Grounding Method'}</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'HIGH_RESISTANCE_NGT' as const, labelFr: 'Transformateur NGT (Haute R)', labelEn: 'NGT (High-R Distribution)' },
                { id: 'LOW_RESISTANCE' as const, labelFr: 'Résistance Directe (MT)', labelEn: 'Direct Resistor (MV)' },
                { id: 'RESONANT_PETERSON' as const, labelFr: 'Bobine Peterson (Résonant)', labelEn: 'Peterson Coil (Tuned)' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGroundingType(m.id)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                    groundingType === m.id
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-[#090D14] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? m.labelFr : m.labelEn}
                </button>
              ))}
            </div>

            {/* Slider 1: Total Zero-Sequence Capacitance 3*C0 */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>{locale === 'fr' ? 'Capacité Homopolaire Totale 3·C0 :' : 'Total Zero-Seq Capacitance 3·C0:'}</span>
                <span className="text-sky-400 font-bold">{totalZeroSeqCapacitanceMicroF} µF</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={totalZeroSeqCapacitanceMicroF}
                onChange={(e) => setTotalZeroSeqCapacitanceMicroF(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {locale === 'fr' ? 'Comprend : Enroulement statorique + Gaine à phases séparées (IPB) + Enroulement BT transformateur GSU' : 'Includes: Stator bars + Isolated Phase Bus (IPB) + GSU LV delta winding'}
              </div>
            </div>

            {/* Slider 2: Target Fault Current Amps */}
            <div className="space-y-1 pt-2 border-t border-[#222B38]">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>{locale === 'fr' ? 'Courant de Défaut Actif Cible IR :' : 'Target Resistive Fault Current IR:'}</span>
                <span className="text-amber-400 font-bold">{targetFaultCurrentAmps} A</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="25.0"
                step="1.0"
                value={targetFaultCurrentAmps}
                onChange={(e) => setTargetFaultCurrentAmps(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {locale === 'fr' ? 'Règle de l’art IEEE C37.101 : IR ≥ Ic0 (évite les surtensions d’amorçage d’arc)' : 'IEEE C37.101 rule: IR ≥ Ic0 to prevent ferroresonance and arcing restrikes'}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Protection Scheme Matrix */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Dimensionnement Résistance & Relais 59N / 64S' : 'Resistor Sizing & Relay 59N / 64S'}</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Courant Capacitif Naturel Ic0' : 'Natural Capacitive Ic0'}</div>
                <div className="text-base font-bold text-sky-400">{results.capacitiveFaultCurrentAmps} A</div>
                <div className="text-[10px] text-slate-400">@ 50 Hz, {results.vPhaseVolts} V phase</div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Courant Défaut Total If' : 'Total Fault Current If'}</div>
                <div className={`text-base font-bold ${results.isCoreDamagePrevented ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.totalFaultCurrentAmps} A
                </div>
                <div className="text-[10px] text-slate-400">
                  {results.isCoreDamagePrevented ? 'Sécurisé (Pas de fusion tôles)' : 'DANGER Fusion Tôles Stator'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Résistance Secondaire Rsec' : 'Secondary Resistor Rsec'}</div>
                <div className="text-base font-bold text-amber-400">{results.secondaryResistorOhm} Ω</div>
                <div className="text-[10px] text-slate-400">Rprim = {results.primaryResistorReqOhm} Ω (Côté 15 kV)</div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38]">
                <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Thermique R' : 'Resistor Thermal Power'}</div>
                <div className="text-base font-bold text-white">{results.resistorContinuousPowerKw} kW</div>
                <div className="text-[10px] text-slate-400">Régime 10 secondes @ 240 V</div>
              </div>
            </div>

            {/* Scheme Technical Note */}
            <div className="p-3 rounded-xl bg-[#090D14] border border-sky-500/20 text-[11px] text-slate-300 space-y-1.5">
              <div className="font-bold text-sky-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Schéma de Protection Terre Statorique 100% :' : '100% Stator Ground Fault Scheme:'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                {locale === 'fr'
                  ? 'Le relais 59N mesure la tension aux bornes de Rsec (seuil typique 5 V, couvrant 95% du bobinage). Les 5% restants près du neutre sont protégés par le relais 64S via injection de signal sous-harmonique 20 Hz ou analyse de la 3ème harmonique naturelle.'
                  : 'Relay 59N monitors voltage across Rsec (typical 5 V pickup, covering 95% of stator winding). The remaining 5% near the neutral point is covered by relay 64S using 20 Hz sub-harmonic injection or 3rd harmonic residual voltage monitoring.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
