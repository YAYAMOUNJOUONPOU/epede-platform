// src/components/calculators/modules/MotorCalculator.tsx
import React, { useState } from 'react';

interface MotorCalculatorProps {
  locale: 'fr' | 'en';
}

export const MotorCalculator: React.FC<MotorCalculatorProps> = ({ locale }) => {
  // 4. MOTOR SIZING & STARTING CURRENTS
  const [motorKw, setMotorKw] = useState<number>(45);
  const [motorEta, setMotorEta] = useState<number>(0.92);
  const [motorCosPhi, setMotorCosPhi] = useState<number>(0.86);
  const [startMethod, setStartMethod] = useState<'dol' | 'star-delta' | 'vfd'>('dol');
  const [motorPoleCount, setMotorPoleCount] = useState<number>(4);

  // Rated In (Amps) = (P_kW * 1000) / (sqrt(3) * 400 * eta * cos_phi)
  const inMotorAmps = (motorKw * 1000) / (Math.sqrt(3) * 400 * motorEta * motorCosPhi);
  const startRatio = startMethod === 'dol' ? 6.5 : startMethod === 'star-delta' ? 2.2 : 1.3;
  const iStartAmps = inMotorAmps * startRatio;
  const synchRpm = 3000 / (motorPoleCount / 2);
  const ratedRpm = synchRpm * (1 - 0.035); // Approx 3.5% slip

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'COURANT DE DÉMARRAGE MOTEUR ASYNCHRONE TRIPHASÉ' : '3-PHASE ASYNCHRONOUS MOTOR STARTING'}</span>
          <span className="text-cyan-400">{motorKw} kW · {startMethod.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT NOMINAL (In)</div>
            <div className="text-3xl font-black text-cyan-300">
              {inMotorAmps.toFixed(1)} <span className="text-sm font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500">À pleine charge nominale</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-amber-900/50 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT DE DÉMARRAGE (Id)</div>
            <div className="text-3xl font-black text-amber-400">
              {iStartAmps.toFixed(0)} <span className="text-sm font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500">Ratio Id/In = {startRatio.toFixed(1)}</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">VITESSE ROTATION (N)</div>
            <div className="text-3xl font-black text-emerald-400">
              {ratedRpm.toFixed(0)} <span className="text-sm font-normal text-neutral-400">rpm</span>
            </div>
            <div className="text-[10px] text-neutral-500">Synchronisme : {synchRpm} rpm</div>
          </div>
        </div>

        <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
          <div className="text-cyan-400 font-bold uppercase text-[11px]">IMPACT RÉSEAU DU MODE DE DÉMARRAGE</div>
          <p className="text-neutral-300 leading-relaxed font-sans">
            {startMethod === 'dol' && 'Démarrage Direct (DOL) : Fort pic d\'appel (6 à 7 In) provoquant des chutes de tension transitoires sur le jeu de barres.'}
            {startMethod === 'star-delta' && 'Démarrage Étoile-Triangle (Y/Δ) : Réduction de l\'appel de courant par 3 (environ 2.2 In) mais couple de démarrage également divisé par 3.'}
            {startMethod === 'vfd' && 'Variateur Électronique (VFD) : Démarrage sans à-coup à courant contrôlé (1.2 à 1.4 In max) avec couple nominal maintenu dès 0 Hz.'}
          </p>
        </div>
      </div>

      {/* Motor Inputs */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
          DONNÉES DU MOTEUR
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Puissance mécanique (P en kW) :</label>
          <input
            type="number"
            value={motorKw}
            onChange={(e) => setMotorKw(parseFloat(e.target.value) || 1)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Mode de démarrage :</label>
          <select
            value={startMethod}
            onChange={(e) => setStartMethod(e.target.value as any)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="dol">Direct (DOL) - 6.5 In</option>
            <option value="star-delta">Étoile-Triangle (Y/Δ) - 2.2 In</option>
            <option value="vfd">Variateur de Fréquence (VFD) - 1.3 In</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Paires de pôles :</label>
          <select
            value={motorPoleCount}
            onChange={(e) => setMotorPoleCount(parseInt(e.target.value))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="2">2 pôles (3000 rpm)</option>
            <option value="4">4 pôles (1500 rpm)</option>
            <option value="6">6 pôles (1000 rpm)</option>
            <option value="8">8 pôles (750 rpm)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Rendement (η) :</label>
          <input
            type="number"
            step="0.01"
            min="0.5"
            max="0.99"
            value={motorEta}
            onChange={(e) => setMotorEta(parseFloat(e.target.value) || 0.9)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Facteur de puissance (cos φ) :</label>
          <input
            type="number"
            step="0.01"
            min="0.5"
            max="1.0"
            value={motorCosPhi}
            onChange={(e) => setMotorCosPhi(parseFloat(e.target.value) || 0.85)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
