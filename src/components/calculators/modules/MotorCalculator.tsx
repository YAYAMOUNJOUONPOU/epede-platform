// src/components/calculators/modules/MotorCalculator.tsx
// EPEDE D06/D07: Industrial Motor Sizing, Starting Torque & Transient Grid Impact Engine
// Calibrated to IEC 60034-1, IEC 60034-12, IEEE Std 399 (Brown Book) & IEEE Std 620

import React, { useState, useMemo } from 'react';
import { Zap, AlertTriangle, CheckCircle2, Sliders, Activity, Info, Play, FileText } from 'lucide-react';
import { IndustrialMotorDynamicSimulator } from '../../simulation/modules/IndustrialMotorDynamicSimulator';

interface MotorCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export type MotorVoltageLevel = 400 | 690 | 3300 | 5500 | 6600 | 11000;
export type MotorStartMethod = 'dol' | 'star-delta' | 'soft-starter' | 'vfd';

export const MotorCalculator: React.FC<MotorCalculatorProps> = ({ locale, onOpenReport }) => {
  // 1. Motor Electrical Specifications
  const [showDynamicSimulator, setShowDynamicSimulator] = useState<boolean>(true);
  const [voltageV, setVoltageV] = useState<MotorVoltageLevel>(400);
  const [motorKw, setMotorKw] = useState<number>(250); // Default 250 kW
  const [motorEta, setMotorEta] = useState<number>(0.94);
  const [motorCosPhi, setMotorCosPhi] = useState<number>(0.87);
  const [startMethod, setStartMethod] = useState<MotorStartMethod>('dol');
  const [motorPoleCount, setMotorPoleCount] = useState<number>(4);
  const [motorSlipPercent, setMotorSlipPercent] = useState<number>(2.5); // 2.5% slip

  // 2. Upstream Grid / Transformer Context for Voltage Dip Estimation
  const [trafoMva, setTrafoMva] = useState<number>(1.6); // Default 1.6 MVA (1600 kVA)
  const [trafoUkPercent, setTrafoUkPercent] = useState<number>(6.0); // 6% Uk

  // Calculations
  const metrics = useMemo(() => {
    const uVolts = voltageV;
    const isMv = uVolts >= 1000;

    // Nominal Current In (Amps) = (P_kW * 1000) / (sqrt(3) * U * eta * cos_phi)
    const inAmps = (motorKw * 1000) / (Math.sqrt(3) * uVolts * motorEta * motorCosPhi);

    // Starting Current & Torque Ratios based on method
    let idRatio = 6.5;
    let cdRatio = 2.0; // Cd / Cn breakdown torque at start
    switch (startMethod) {
      case 'dol':
        idRatio = 6.8;
        cdRatio = 2.1;
        break;
      case 'star-delta':
        idRatio = 2.3;
        cdRatio = 0.7; // Torque divided by 3
        break;
      case 'soft-starter':
        idRatio = 3.2;
        cdRatio = 0.85;
        break;
      case 'vfd':
        idRatio = 1.3;
        cdRatio = 1.6; // High breakaway torque at low frequency
        break;
    }

    const idAmps = inAmps * idRatio;

    // Speeds & Torques (IEC 60034-12)
    const synchRpm = 3000 / (motorPoleCount / 2); // 50 Hz
    const ratedRpm = Math.round(synchRpm * (1 - motorSlipPercent / 100));
    // Rated Torque Cn (N.m) = 9550 * P_kW / N_rpm
    const ratedTorqueNm = (9550 * motorKw) / ratedRpm;
    const startingTorqueNm = ratedTorqueNm * cdRatio;

    // Upstream Transformer Short-Circuit Apparent Power
    // S_sc_trafo (MVA) = S_trafo / (Uk / 100)
    const sScTrafoMva = trafoMva / (trafoUkPercent / 100);
    // Motor Starting Apparent Power S_start (MVA) = sqrt(3) * U * Id
    const sStartMva = (Math.sqrt(3) * uVolts * idAmps) / 1e6;
    // Estimated Busbar Voltage Dip (%) = (S_start / S_sc_trafo) * 100
    const voltageDipPercent = Number(((sStartMva / sScTrafoMva) * 100).toFixed(1));

    return {
      isMv,
      inAmps,
      idRatio,
      idAmps,
      synchRpm,
      ratedRpm,
      ratedTorqueNm,
      startingTorqueNm,
      cdRatio,
      sStartMva,
      voltageDipPercent
    };
  }, [voltageV, motorKw, motorEta, motorCosPhi, startMethod, motorPoleCount, motorSlipPercent, trafoMva, trafoUkPercent]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'COURANT DE DÉMARRAGE, COUPLE & IMPACT RÉSEAU MOTEUR' : 'MOTOR STARTING CURRENT, TORQUE & GRID IMPACT'}</span>
          <span className="text-cyan-400">{motorKw} kW · {voltageV >= 1000 ? `${voltageV / 1000} kV (HTA)` : `${voltageV} V (BT)`} · {startMethod.toUpperCase()}</span>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT NOMINAL (In)</div>
            <div className="text-2xl font-black text-cyan-300">
              {metrics.inAmps.toFixed(1)} <span className="text-sm font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500">Pleine charge nominale</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-amber-900/50 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT DÉMARRAGE (Id)</div>
            <div className="text-2xl font-black text-amber-400">
              {metrics.idAmps.toFixed(0)} <span className="text-sm font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500">Ratio Id/In = {metrics.idRatio.toFixed(1)}</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COUPLE DÉCOLLAGE (Cd)</div>
            <div className="text-2xl font-black text-emerald-400">
              {metrics.startingTorqueNm.toFixed(0)} <span className="text-sm font-normal text-neutral-400">N·m</span>
            </div>
            <div className="text-[10px] text-neutral-500">Cn = {metrics.ratedTorqueNm.toFixed(0)} N·m ({metrics.cdRatio.toFixed(1)}x)</div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">CHUTE DE TENSION BUS</div>
            <div className={`text-2xl font-black ${metrics.voltageDipPercent > 15 ? 'text-red-400' : metrics.voltageDipPercent > 8 ? 'text-amber-400' : 'text-sky-300'}`}>
              -{metrics.voltageDipPercent.toFixed(1)} <span className="text-sm font-normal text-neutral-400">%</span>
            </div>
            <div className="text-[10px] text-neutral-500">Transfo {trafoMva} MVA (Uk {trafoUkPercent}%)</div>
          </div>
        </div>

        {/* Starting Method Technical Impact Commentary */}
        <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
          <div className="text-cyan-400 font-bold uppercase text-[11px] flex items-center justify-between">
            <span>IMPACT ÉLECTROTECHNIQUE DU MODE DE DÉMARRAGE (CEI 60034-12)</span>
            {metrics.voltageDipPercent > 15 && (
              <span className="text-red-400 flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Chute critique (&gt; 15%)
              </span>
            )}
          </div>
          <p className="text-neutral-300 leading-relaxed font-sans">
            {startMethod === 'dol' && (
              <>
                <strong>Démarrage Direct (DOL) :</strong> Fort appel de courant ({metrics.idRatio} In, soit {metrics.idAmps.toFixed(0)} A) avec couple de décollage élevé ({metrics.cdRatio} Cn). Chute de tension transitoire estimée à {metrics.voltageDipPercent}% sur le jeu de barres amont. À réserver aux réseaux rigides où la chute de tension reste inférieure à 10-15%.
              </>
            )}
            {startMethod === 'star-delta' && (
              <>
                <strong>Démarrage Étoile-Triangle (Y/Δ) :</strong> Réduction de l'appel de courant d'un facteur 3 (environ {metrics.idRatio} In). Attention : le couple de démarrage est également divisé par 3 ({metrics.cdRatio} Cn). Ne convient pas aux charges démarrant avec un fort couple résistant (concasseurs, broyeurs, compresseurs à piston).
              </>
            )}
            {startMethod === 'soft-starter' && (
              <>
                <strong>Démarreur Électronique Progressif (Soft-Starter) :</strong> Rampe de tension par gradation d'angle de phase sur thyristors antiparallèles. Appel de courant maîtrisé à {metrics.idRatio} In ({metrics.idAmps.toFixed(0)} A), supprimant les à-coups mécaniques sur les accouplements et réducteurs.
              </>
            )}
            {startMethod === 'vfd' && (
              <>
                <strong>Variateur Électronique de Fréquence (VFD) :</strong> Démarrage à flux orienté sans surintensité transitoire sévère ({metrics.idRatio} In max). Le couple nominal ou surcouple ({metrics.cdRatio} Cn) est disponible dès 0 Hz. La chute de tension réseau est quasi-nulle (-{metrics.voltageDipPercent}%).
              </>
            )}
          </p>

          <div className="pt-2 border-t border-[#252E38] flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">
              {locale === 'fr' ? 'Simulation transitoire ODE (J·dω/dt = Mm - Mr) :' : 'Transient ODE dynamic simulation:'}
            </span>
            <button
              type="button"
              onClick={() => setShowDynamicSimulator(!showDynamicSimulator)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-bold text-xs cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                {showDynamicSimulator
                  ? locale === 'fr' ? 'Masquer Simulateur Dynamique' : 'Hide Dynamic Simulator'
                  : locale === 'fr' ? 'Afficher Simulateur Dynamique' : 'Show Dynamic Simulator'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Motor & Network Inputs */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
          DONNÉES DU MOTEUR & RÉSEAU AMONT
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Tension assignée (Un) :</label>
          <select
            value={voltageV}
            onChange={(e) => setVoltageV(parseInt(e.target.value) as MotorVoltageLevel)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="400">400 V (Basse Tension standard)</option>
            <option value="690">690 V (Basse Tension industrielle / Mines)</option>
            <option value="3300">3.3 kV (Moyenne Tension - Auxiliaires)</option>
            <option value="5500">5.5 kV (Moyenne Tension - Broyeurs)</option>
            <option value="6600">6.6 kV (Moyenne Tension standard)</option>
            <option value="11000">11 kV (Moyenne Tension forte puissance)</option>
          </select>
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
            onChange={(e) => setStartMethod(e.target.value as MotorStartMethod)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="dol">Direct (DOL) - ~6.8 In</option>
            <option value="star-delta">Étoile-Triangle (Y/Δ) - ~2.3 In</option>
            <option value="soft-starter">Démarreur Électronique - ~3.2 In</option>
            <option value="vfd">Variateur de Fréquence (VFD) - ~1.3 In</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">Paires de pôles (Vitesse) :</label>
          <select
            value={motorPoleCount}
            onChange={(e) => setMotorPoleCount(parseInt(e.target.value))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="2">2 pôles (3000 rpm synchronisme)</option>
            <option value="4">4 pôles (1500 rpm synchronisme)</option>
            <option value="6">6 pôles (1000 rpm synchronisme)</option>
            <option value="8">8 pôles (750 rpm synchronisme)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">Rendement (η) :</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="0.99"
              value={motorEta}
              onChange={(e) => setMotorEta(parseFloat(e.target.value) || 0.9)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">Facteur cos φ :</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="1.0"
              value={motorCosPhi}
              onChange={(e) => setMotorCosPhi(parseFloat(e.target.value) || 0.85)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#252E38] space-y-2">
          <div className="text-[10px] text-cyan-400 font-bold uppercase">TRANSFORMATEUR AMONT (CHUTE DE TENSION)</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-neutral-400 text-[10px]">Puissance S (MVA) :</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={trafoMva}
                onChange={(e) => setTrafoMva(parseFloat(e.target.value) || 1.0)}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 text-[10px]">Tension Uk (%) :</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="15"
                value={trafoUkPercent}
                onChange={(e) => setTrafoUkPercent(parseFloat(e.target.value) || 6.0)}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {onOpenReport && (
          <div className="pt-2 border-t border-[#252E38]">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Éditer Dossier de Calcul Moteur' : 'Generate Motor Calculation Dossier'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Transient Simulator Section */}
      {showDynamicSimulator && (
        <div className="lg:col-span-3">
          <IndustrialMotorDynamicSimulator locale={locale} initialPresetId="nachtigal-raw-water" />
        </div>
      )}
    </div>
  );
};
