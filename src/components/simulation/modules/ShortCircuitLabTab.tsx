import React, { useState } from 'react';
import { LiveOscilloscopePanel } from './LiveOscilloscopePanel';

interface ShortCircuitLabTabProps {
  locale: 'fr' | 'en';
}

export const ShortCircuitLabTab: React.FC<ShortCircuitLabTabProps> = ({ locale }) => {
  const [gridUnKv, setGridUnKv] = useState(30.0); // 30 kV
  const [gridSscMva, setGridSscMva] = useState(500); // 500 MVA upstream grid

  // Network impedance Z_grid
  const zGridOhm = (gridUnKv * gridUnKv) / gridSscMva;
  // Initial symmetrical short-circuit current I''k
  const cFactor = 1.10; // Voltage factor c for MV/HV per IEC 60909
  const ik3Ka = (cFactor * gridUnKv) / (Math.sqrt(3) * zGridOhm);
  // Peak dynamic current ip (assuming kappa ~ 1.8)
  const kappa = 1.80;
  const ipKa = kappa * Math.sqrt(2) * ik3Ka;
  // Breaking capacity Ib
  const ibKa = ik3Ka * 0.98;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
          <span className="font-bold text-[#F3F4F6] uppercase">
            {locale === 'fr' ? 'CALCUL DES COURANTS DE COURT-CIRCUIT SELON CEI 60909' : 'SHORT-CIRCUIT CURRENT CALCULATION (IEC 60909)'}
          </span>
          <span className="text-cyan-400">U_n = {gridUnKv} kV</span>
        </div>

        {/* Key Short-Circuit Currents Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          {/* Ik'' Initial Symmetrical Current */}
          <div className="bg-[#161C24] p-4 rounded-xl border border-red-900/60 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'COURANT SYMÉTRIQUE INITIAL (I\'\'k)' : 'INITIAL SYMMETRICAL CURRENT (I\'\'k)'}
            </div>
            <div className="text-2xl font-black text-red-400">
              {ik3Ka.toFixed(2)} <span className="text-xs font-normal text-neutral-400">kA</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Puissance de court-circuit: ${gridSscMva} MVA` : `Fault power capacity: ${gridSscMva} MVA`}
            </div>
          </div>

          {/* ip Peak Dynamic Current */}
          <div className="bg-[#161C24] p-4 rounded-xl border border-amber-900/60 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'COURANT CRÊTE DYNAMIQUE (ip)' : 'PEAK DYNAMIC CURRENT (ip)'}
            </div>
            <div className="text-2xl font-black text-amber-400">
              {ipKa.toFixed(2)} <span className="text-xs font-normal text-neutral-400">kA</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? 'Contrainte électrodynamique (κ = 1.80)' : 'Electrodynamic peak stress (κ = 1.80)'}
            </div>
          </div>

          {/* Ib Breaking Capacity */}
          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'POUVOIR DE COUPURE REQUIS (Ib)' : 'BREAKING CAPACITY REQUIRED (Ib)'}
            </div>
            <div className="text-2xl font-black text-cyan-300">
              {ibKa.toFixed(2)} <span className="text-xs font-normal text-neutral-400">kA</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? 'Temps de coupure t = 0.05 s' : 'Breaking time t = 0.05 s'}
            </div>
          </div>
        </div>

        {/* Explanation box */}
        <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
          <div className="text-cyan-400 font-bold uppercase text-[11px]">
            {locale === 'fr' ? 'CRITÈRES DE DIMENSIONNEMENT D\'APPAREILLAGE' : 'SWITCHGEAR SIZING CRITERIA'}
          </div>
          <p className="text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? (
              <>
                Le disjoncteur haute tension doit obligatoirement posséder un pouvoir de coupure assigné (Icu) supérieur à <strong className="font-mono text-cyan-300">{ik3Ka.toFixed(1)} kA</strong> et une tenue électrodynamique crête (Icm) supérieure à <strong className="font-mono text-amber-300">{ipKa.toFixed(1)} kA</strong>.
              </>
            ) : (
              <>
                The high-voltage circuit breaker must possess a rated short-circuit breaking capacity (Icu) higher than <strong className="font-mono text-cyan-300">{ik3Ka.toFixed(1)} kA</strong> and a peak withstand capability (Icm) higher than <strong className="font-mono text-amber-300">{ipKa.toFixed(1)} kA</strong>.
              </>
            )}
          </p>
        </div>

        {/* Live IEC 60909 Fault Transient Oscilloscope */}
        <div className="pt-2">
          <LiveOscilloscopePanel
            locale={locale}
            faultMode="3PH_FAULT"
            initialFrequency={50}
            initialIkKa={ik3Ka}
            initialKappa={kappa}
          />
        </div>
      </div>

      {/* Fault Controls */}
      <div className="space-y-4 font-mono">
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
            {locale === 'fr' ? 'PARAMÈTRES DU RÉSEAU AMONT' : 'UPSTREAM GRID PARAMETERS'}
          </div>

          {/* Voltage Un */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>{locale === 'fr' ? 'Tension Nominale (Un):' : 'Nominal Voltage (Un):'}</span>
              <span className="font-bold text-cyan-300">{gridUnKv} kV</span>
            </div>
            <input
              type="range"
              min="15"
              max="225"
              step="15"
              value={gridUnKv}
              onChange={(e) => setGridUnKv(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Ssc MVA */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>{locale === 'fr' ? 'Puissance C-C Réseau (Ssc):' : 'Grid Short-Circuit Power (Ssc):'}</span>
              <span className="font-bold text-red-400">{gridSscMva} MVA</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={gridSscMva}
              onChange={(e) => setGridSscMva(parseInt(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
