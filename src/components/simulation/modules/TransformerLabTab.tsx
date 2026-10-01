// src/components/simulation/modules/TransformerLabTab.tsx
import React, { useState } from 'react';

interface TransformerLabTabProps {
  locale: 'fr' | 'en';
}

export const TransformerLabTab: React.FC<TransformerLabTabProps> = ({ locale }) => {
  const [trafoRatingKva, setTrafoRatingKva] = useState(1000); // 1000 kVA
  const [trafoUk, setTrafoUk] = useState(6.0); // uk = 6%
  const [trafoPfe] = useState(1.8); // Core iron losses (kW)
  const [trafoPcuNom] = useState(10.5); // Full load copper losses (kW)
  const [trafoLoadPercent, setTrafoLoadPercent] = useState(80); // Load %

  // Efficiency calculation at load k
  const kLoad = trafoLoadPercent / 100;
  const pcuActual = trafoPcuNom * kLoad * kLoad;
  const pOut = trafoRatingKva * kLoad * 0.95; // at PF = 0.95
  const pIn = pOut + trafoPfe + pcuActual;
  const efficiencyPercent = pIn > 0 ? (pOut / pIn) * 100 : 0;
  // Maximum efficiency occurs when Pcu(k) = Pfe => k_opt = sqrt(Pfe / PcuNom)
  const kOptPercent = Math.min(100, Math.sqrt(trafoPfe / trafoPcuNom) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
          <span className="font-bold text-[#F3F4F6] uppercase">
            {locale === 'fr' ? 'SCHÉMA ÉQUIVALENT EN T & COURBE DE RENDEMENT' : 'T-EQUIVALENT CIRCUIT & EFFICIENCY CURVE'}
          </span>
          <span className="text-cyan-400">{trafoRatingKva} kVA · uk = {trafoUk}%</span>
        </div>

        {/* Efficiency Metric Display */}
        <div className="bg-[#161C24] p-5 rounded-xl border border-[#252E38] flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-neutral-500 text-xs">
              {locale === 'fr' ? 'RENDEMENT DU TRANSFORMATEUR (η)' : 'TRANSFORMER EFFICIENCY (η)'}
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {efficiencyPercent.toFixed(2)} <span className="text-base text-neutral-400">%</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-neutral-500 text-xs">
              {locale === 'fr' ? 'POINT DE RENDEMENT OPTIMAL' : 'OPTIMAL EFFICIENCY POINT'}
            </div>
            <div className="text-xl font-bold text-cyan-300 mt-1">
              {kOptPercent.toFixed(1)} % {locale === 'fr' ? 'de charge' : 'load'}
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? 'Quand Pertes Cuivre = Pertes Fer' : 'When Copper Losses = Core Losses'}
            </div>
          </div>
        </div>

        {/* Losses breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
            <div className="text-neutral-400 uppercase text-[10px]">
              {locale === 'fr' ? 'Pertes Fer (Constantes, à vide P0)' : 'Core Iron Losses (No-Load P0)'}
            </div>
            <div className="text-xl font-bold text-sky-400 mt-1">{trafoPfe.toFixed(2)} kW</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              {locale === 'fr' ? 'Hystérésis & Courants de Foucault' : 'Hysteresis & Eddy Currents'}
            </div>
          </div>

          <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
            <div className="text-neutral-400 uppercase text-[10px]">
              {locale === 'fr' ? 'Pertes Cuivre (Variables en k²)' : 'Copper Losses (Variable in k²)'}
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1">{pcuActual.toFixed(2)} kW</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              {locale === 'fr' ? 'Pertes Joule dans les enroulements R·I²' : 'Joule Losses in Windings R·I²'}
            </div>
          </div>
        </div>

        {/* Steinmetz Circuit Schematic visualization */}
        <div className="p-4 bg-[#080B10] rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
          <div className="text-neutral-400 uppercase text-[10px]">
            {locale === 'fr' ? 'PARAMÈTRES D\'IMPÉDANCE DU TRANSFORMATEUR' : 'TRANSFORMER IMPEDANCE PARAMETERS'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-300">
            <div className="bg-[#161C24] p-2 rounded">
              <div className="text-neutral-500 text-[9px]">{locale === 'fr' ? 'I_nom (Secondaire 400V)' : 'I_nom (Secondary 400V)'}</div>
              <div className="font-bold text-cyan-300">{(trafoRatingKva / (Math.sqrt(3) * 0.4)).toFixed(0)} A</div>
            </div>
            <div className="bg-[#161C24] p-2 rounded">
              <div className="text-neutral-500 text-[9px]">{locale === 'fr' ? 'Courant C-C (I_sc)' : 'Short-Circuit I_sc'}</div>
              <div className="font-bold text-red-400">{((trafoRatingKva / (Math.sqrt(3) * 0.4)) / (trafoUk / 100) / 1000).toFixed(1)} kA</div>
            </div>
            <div className="bg-[#161C24] p-2 rounded">
              <div className="text-neutral-500 text-[9px]">{locale === 'fr' ? 'Pertes Totales' : 'Total Losses'}</div>
              <div className="font-bold text-amber-300">{(trafoPfe + pcuActual).toFixed(2)} kW</div>
            </div>
            <div className="bg-[#161C24] p-2 rounded">
              <div className="text-neutral-500 text-[9px]">{locale === 'fr' ? 'Puissance Sortie' : 'Output Power'}</div>
              <div className="font-bold text-emerald-400">{pOut.toFixed(1)} kW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Controls */}
      <div className="space-y-4 font-mono">
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
            {locale === 'fr' ? 'CONFIGURATION DU TRANSFORMATEUR' : 'TRANSFORMER CONFIGURATION'}
          </div>

          {/* Load slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>{locale === 'fr' ? 'Taux de Charge:' : 'Loading Ratio:'}</span>
              <span className="font-bold text-cyan-300">{trafoLoadPercent} %</span>
            </div>
            <input
              type="range"
              min="5"
              max="125"
              step="5"
              value={trafoLoadPercent}
              onChange={(e) => setTrafoLoadPercent(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Transformer Rating */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>{locale === 'fr' ? 'Puissance Nominale:' : 'Rated Power:'}</span>
              <span className="font-bold text-cyan-300">{trafoRatingKva} kVA</span>
            </div>
            <input
              type="range"
              min="160"
              max="2500"
              step="100"
              value={trafoRatingKva}
              onChange={(e) => setTrafoRatingKva(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* uk Impedance */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>{locale === 'fr' ? 'Tension de Court-Circuit (uk):' : 'Short-Circuit Impedance (uk):'}</span>
              <span className="font-bold text-amber-400">{trafoUk} %</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.5"
              value={trafoUk}
              onChange={(e) => setTrafoUk(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
