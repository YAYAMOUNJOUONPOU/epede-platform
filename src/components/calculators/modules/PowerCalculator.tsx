// src/components/calculators/modules/PowerCalculator.tsx
import React, { useState } from 'react';

interface PowerCalculatorProps {
  locale: 'fr' | 'en';
}

export const PowerCalculator: React.FC<PowerCalculatorProps> = ({ locale }) => {
  // 1. THREE-PHASE POWER CALCULATOR
  const [uVolts, setUVolts] = useState<number>(400); // 400V
  const [pKwInput, setPKwInput] = useState<number>(75); // 75 kW
  const [pfInput, setPfInput] = useState<number>(0.85); // cos phi 0.85

  // Calculations:
  // S = P / cos_phi
  const sKvaCalculated = pKwInput / (pfInput || 0.01);
  // Q = sqrt(S^2 - P^2)
  const qKvarCalculated = Math.sqrt(Math.max(0, sKvaCalculated ** 2 - pKwInput ** 2));
  // I = P / (sqrt(3) * U * cos_phi)
  const iCalculatedAmps = (pKwInput * 1000) / (Math.sqrt(3) * uVolts * (pfInput || 0.01));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'CALCUL DE COURANT ET PUISSANCES SELON FORMULE CEI' : 'CALCULATION OF CURRENT & POWER'}</span>
          <span className="text-cyan-400">S = √3 · U · I</span>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-cyan-500/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT EN LIGNE (I)</div>
            <div className="text-3xl font-black text-cyan-300">
              {iCalculatedAmps.toFixed(1)} <span className="text-sm font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500">Courant nominal par phase</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE APPARENTE (S)</div>
            <div className="text-2xl font-black text-sky-400">
              {sKvaCalculated.toFixed(1)} <span className="text-sm font-normal text-neutral-400">kVA</span>
            </div>
            <div className="text-[10px] text-neutral-500">Dimensionnement source</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE RÉACTIVE (Q)</div>
            <div className="text-2xl font-black text-amber-400">
              {qKvarCalculated.toFixed(1)} <span className="text-sm font-normal text-neutral-400">kvar</span>
            </div>
            <div className="text-[10px] text-neutral-500">Énergie magnétisante</div>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
          <div className="text-cyan-400 font-bold uppercase text-[11px]">FORMULES DE CONVERSION APPLIQUÉES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
            <div>
              <span className="text-neutral-500">Courant assigné :</span>
              <div className="font-bold text-cyan-300 mt-0.5">I = P / (√3 × U × cos φ)</div>
            </div>
            <div>
              <span className="text-neutral-500">Puissance apparente :</span>
              <div className="font-bold text-sky-300 mt-0.5">S = P / cos φ = √(P² + Q²)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Side Panel */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
          DONNÉES D'ENTRÉE (INPUTS)
        </div>

        {/* Voltage U */}
        <div className="space-y-1">
          <label className="text-neutral-300">Tension Composée (U en V) :</label>
          <input
            type="number"
            value={uVolts}
            onChange={(e) => setUVolts(parseFloat(e.target.value) || 1)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
          <div className="flex gap-1 text-[10px] text-neutral-500">
            <button type="button" onClick={() => setUVolts(400)} className="hover:text-cyan-400">400V (BT)</button>
            <span>·</span>
            <button type="button" onClick={() => setUVolts(15000)} className="hover:text-cyan-400">15kV</button>
            <span>·</span>
            <button type="button" onClick={() => setUVolts(30000)} className="hover:text-cyan-400">30kV (HTA)</button>
          </div>
        </div>

        {/* Active Power P */}
        <div className="space-y-1">
          <label className="text-neutral-300">Puissance Active (P en kW) :</label>
          <input
            type="number"
            value={pKwInput}
            onChange={(e) => setPKwInput(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Power Factor cos phi */}
        <div className="space-y-1">
          <label className="text-neutral-300">Facteur de Puissance (cos φ) :</label>
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="1.0"
            value={pfInput}
            onChange={(e) => setPfInput(parseFloat(e.target.value) || 0.8)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
