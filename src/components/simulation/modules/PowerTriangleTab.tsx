// src/components/simulation/modules/PowerTriangleTab.tsx
import React, { useState } from 'react';

interface PowerTriangleTabProps {
  locale: 'fr' | 'en';
}

export const PowerTriangleTab: React.FC<PowerTriangleTabProps> = ({ locale }) => {
  const [pKw, setPKw] = useState(450); // kW
  const [cosPhi1, setCosPhi1] = useState(0.75); // Initial PF
  const [cosPhi2, setCosPhi2] = useState(0.96); // Target PF

  // Calculations:
  const phi1 = Math.acos(cosPhi1);
  const tanPhi1 = Math.tan(phi1);
  const qKvar1 = pKw * tanPhi1;
  const sKva1 = pKw / cosPhi1;

  const phi2 = Math.acos(cosPhi2);
  const tanPhi2 = Math.tan(phi2);
  const qKvar2 = pKw * tanPhi2;
  const sKva2 = pKw / cosPhi2;

  // Required capacitor bank
  const qcRequired = Math.max(0, pKw * (tanPhi1 - tanPhi2));

  // Current at 400V 3-phase
  const vLine = 400; // V
  const current1 = (sKva1 * 1000) / (Math.sqrt(3) * vLine);
  const current2 = (sKva2 * 1000) / (Math.sqrt(3) * vLine);
  const deltaCurrentPercent = ((current1 - current2) / current1) * 100;
  const jouleLossReductionPercent = (1 - (current2 / current1) ** 2) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual Vector Power Triangle SVG */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
          <span className="font-bold text-[#F3F4F6] uppercase">
            {locale === 'fr' ? 'DIAGRAMME VECTORIEL DES PUISSANCES (P, Q, S)' : 'VECTOR POWER TRIANGLE (P, Q, S)'}
          </span>
          <span className="text-cyan-400">P = {pKw} kW</span>
        </div>

        {/* SVG Triangle */}
        <div className="w-full flex justify-center py-6 bg-[#080B10] rounded-xl border border-[#252E38] cad-grid-dense">
          <svg viewBox="0 0 540 320" className="w-full max-w-lg h-auto font-mono select-none">
            {/* Axes */}
            <line x1="60" y1="260" x2="480" y2="260" stroke="#374151" strokeWidth="2" />
            <line x1="60" y1="260" x2="60" y2="40" stroke="#374151" strokeWidth="2" />

            {/* Origin */}
            <circle cx="60" cy="260" r="4" fill="#00E5FF" />
            <text x="45" y="275" fill="#9CA3AF" fontSize="11">0</text>

            {/* Base line: Active Power P */}
            <line x1="60" y1="260" x2="380" y2="260" stroke="#00E5FF" strokeWidth="4" />
            <text x="220" y="285" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle">
              P = {pKw} kW (Active)
            </text>

            {/* Initial Triangle (Uncompensated): Q1 */}
            <line x1="380" y1="260" x2="380" y2="70" stroke="#EF4444" strokeWidth="3" strokeDasharray="4 2" />
            <text x="390" y="150" fill="#EF4444" fontSize="11" fontWeight="bold">
              Q1 = {qKvar1.toFixed(1)} kvar
            </text>

            {/* Initial Hypotenuse: S1 */}
            <line x1="60" y1="260" x2="380" y2="70" stroke="#F59E0B" strokeWidth="3" />
            <text x="200" y="145" fill="#F59E0B" fontSize="12" fontWeight="bold">
              S1 = {sKva1.toFixed(1)} kVA (cos φ1 = {cosPhi1})
            </text>

            {/* Compensated Triangle: Q2 */}
            <line x1="380" y1="260" x2="380" y2="180" stroke="#10B981" strokeWidth="4" />
            <text x="310" y="220" fill="#10B981" fontSize="11" fontWeight="bold">
              Q2 = {qKvar2.toFixed(1)} kvar
            </text>

            {/* Compensated Hypotenuse: S2 */}
            <line x1="60" y1="260" x2="380" y2="180" stroke="#38BDF8" strokeWidth="3.5" />
            <text x="210" y="215" fill="#38BDF8" fontSize="12" fontWeight="bold">
              S2 = {sKva2.toFixed(1)} kVA (cos φ2 = {cosPhi2})
            </text>

            {/* Capacitor Compensation Arrow Qc */}
            <line x1="420" y1="70" x2="420" y2="180" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="430" y="125" fill="#10B981" fontSize="11" fontWeight="bold">
              Q_c = -{qcRequired.toFixed(1)} kvar
            </text>
          </svg>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
            <div className="text-neutral-500 text-[10px] uppercase">CAPACITÉ DE COMPENSATION</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {qcRequired.toFixed(1)} <span className="text-xs font-normal text-neutral-400">kvar</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">Batterie de condensateurs</div>
          </div>

          <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
            <div className="text-neutral-500 text-[10px] uppercase">COURANT DE LIGNE (400V)</div>
            <div className="text-xl font-black text-cyan-300 mt-0.5">
              {current2.toFixed(0)} <span className="text-xs font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              ↓ {deltaCurrentPercent.toFixed(1)} % de courant libéré
            </div>
          </div>

          <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
            <div className="text-neutral-500 text-[10px] uppercase">RÉDUCTION PERTES JOULE (RI²)</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">
              -{jouleLossReductionPercent.toFixed(1)} <span className="text-xs font-normal text-neutral-400">%</span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">Économie de câbles & transfo</div>
          </div>
        </div>
      </div>

      {/* Controls Side Panel */}
      <div className="space-y-4 font-mono">
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
            PARAMÈTRES DE CHARGE
          </div>

          {/* Active Power P */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Puissance Active P:</span>
              <span className="font-bold text-cyan-300">{pKw} kW</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={pKw}
              onChange={(e) => setPKw(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Initial PF */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Facteur de Puissance Initial (cos φ1):</span>
              <span className="font-bold text-red-400">{cosPhi1}</span>
            </div>
            <input
              type="range"
              min="0.55"
              max="0.92"
              step="0.01"
              value={cosPhi1}
              onChange={(e) => setCosPhi1(parseFloat(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
            <div className="text-[10px] text-neutral-500">Angle φ1: {(phi1 * (180 / Math.PI)).toFixed(1)}°</div>
          </div>

          {/* Target PF */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Facteur de Puissance Visé (cos φ2):</span>
              <span className="font-bold text-emerald-400">{cosPhi2}</span>
            </div>
            <input
              type="range"
              min="0.90"
              max="0.99"
              step="0.01"
              value={cosPhi2}
              onChange={(e) => setCosPhi2(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="text-[10px] text-neutral-500">Angle φ2: {(phi2 * (180 / Math.PI)).toFixed(1)}°</div>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-2 text-xs font-mono text-neutral-400">
          <div className="text-[10px] text-cyan-400 uppercase font-bold">FORMULATION SCIENTIFIQUE</div>
          <p className="text-[#F3F4F6] font-bold">
            Q_c = P × (tan φ1 - tan φ2)
          </p>
          <p className="text-[11px] leading-relaxed">
            {locale === 'fr' 
              ? 'Permet de supprimer les pénalités pour dépassement de tangente phi imposées par les distributeurs (ex: Eneo / ARSEL au Cameroun lorsque tan φ > 0.40).' 
              : 'Eliminates reactive power billing penalties imposed by utility operators when tan φ exceeds contractual limits.'}
          </p>
        </div>
      </div>
    </div>
  );
};
