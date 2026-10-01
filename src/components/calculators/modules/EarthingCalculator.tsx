// src/components/calculators/modules/EarthingCalculator.tsx
import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface EarthingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const EarthingCalculator: React.FC<EarthingCalculatorProps> = ({ locale, onOpenReport }) => {
  // 6. EARTHING GRID & TOUCH / STEP VOLTAGE (IEEE 80 / IEC 60479)
  const [earthRho, setEarthRho] = useState<number>(100); // 100 Ω·m soil resistivity
  const [earthIfaultKa, setEarthIfaultKa] = useState<number>(20); // 20 kA fault to earth
  const [earthClearTimeSec, setEarthClearTimeSec] = useState<number>(0.2); // 200 ms
  const [gridAreaL, setGridAreaL] = useState<number>(40); // 40 m grid length
  const [gridAreaW, setGridAreaW] = useState<number>(30); // 30 m grid width
  const [gridRodsCount, setGridRodsCount] = useState<number>(16); // 16 earth rods (3m each)
  const [crushedRockThicknessMm, setCrushedRockThicknessMm] = useState<number>(100); // 100 mm gravel surface layer

  // Surface layer derating factor Cs (crushed rock rho_s = 2500 Ω·m)
  const rhoSurface = 2500;
  const kSurface = (earthRho - rhoSurface) / (earthRho + rhoSurface);
  const csDerating = 1 - (0.09 * (1 - earthRho / rhoSurface)) / (2 * (crushedRockThicknessMm / 1000) + 0.09);

  // IEEE 80 Permissible Touch and Step voltages (Body weight = 70 kg)
  // E_touch_70 = (1000 + 1.5 · Cs · rho_s) · 0.157 / sqrt(ts)
  const eTouchTolerable = (1000 + 1.5 * csDerating * rhoSurface) * (0.157 / Math.sqrt(earthClearTimeSec));
  // E_step_70 = (1000 + 6 · Cs · rho_s) · 0.157 / sqrt(ts)
  const eStepTolerable = (1000 + 6.0 * csDerating * rhoSurface) * (0.157 / Math.sqrt(earthClearTimeSec));

  // Grid Resistance Rg (Sverak simplified formula)
  const gridAreaM2 = gridAreaL * gridAreaW;
  const conductorsTotalLengthM = (gridAreaL * (Math.round(gridAreaW / 5) + 1)) + (gridAreaW * (Math.round(gridAreaL / 5) + 1));
  const totalBuriedLengthLt = conductorsTotalLengthM + (gridRodsCount * 3);
  const gridResistanceRg = earthRho * (1 / totalBuriedLengthLt + (1 / Math.sqrt(20 * gridAreaM2)) * (1 + (1 / (1 + 0.5 * Math.sqrt(20 / gridAreaM2)))));

  // Ground Potential Rise (GPR = If * Rg)
  const faultCurrentToGridA = earthIfaultKa * 1000 * 0.6; // 60% grid split factor
  const groundPotentialRiseV = faultCurrentToGridA * gridResistanceRg;

  // Maximum mesh touch voltage estimate (Em = Km * Ki * rho * Ig / Lt)
  const eMeshCalculated = (0.75 * 1.35 * earthRho * faultCurrentToGridA) / totalBuriedLengthLt;
  const eStepCalculated = (0.45 * 1.15 * earthRho * faultCurrentToGridA) / totalBuriedLengthLt;

  const isTouchSafe = eMeshCalculated < eTouchTolerable;
  const isStepSafe = eStepCalculated < eStepTolerable;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {locale === 'fr' ? 'CALCUL DE MISE À LA TERRE & TENSIONS DE PAS / TOUCHER (IEEE 80 / CEI 60479)' : 'SUBSTATION EARTHING & STEP/TOUCH SAFETY'}
          </span>
          <span className="text-emerald-400">SÉCURITÉ DES PERSONNES (70 KG)</span>
        </div>

        {/* Big Alert KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">RÉSISTANCE DE PRISE DE TERRE (Rg)</div>
            <div className={`text-2xl font-black ${gridResistanceRg <= 1.0 ? 'text-emerald-400' : gridResistanceRg <= 5.0 ? 'text-amber-400' : 'text-red-400'}`}>
              {gridResistanceRg.toFixed(2)} <span className="text-xs font-normal text-neutral-400">Ω</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {gridResistanceRg <= 1.0 ? 'Excellente (< 1 Ω poste HT)' : 'Poste MT / Distribution'}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">MONTÉE EN POTENTIEL (GPR)</div>
            <div className="text-2xl font-black text-cyan-300">
              {(groundPotentialRiseV / 1000).toFixed(1)} <span className="text-xs font-normal text-neutral-400">kV</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Courant de grille: ${(faultCurrentToGridA / 1000).toFixed(1)} kA` : `Grid fault: ${(faultCurrentToGridA / 1000).toFixed(1)} kA`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION DE TOUCHER (Em vs Etol)</div>
            <div className={`text-2xl font-black ${isTouchSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {eMeshCalculated.toFixed(0)} <span className="text-xs font-normal text-neutral-400">/ {eTouchTolerable.toFixed(0)} V</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {isTouchSafe ? 'Conforme IEEE 80 (Sécurisé)' : 'DANGER : Tensions excessives'}
            </div>
          </div>
        </div>

        {/* Detailed Safety Breakdown Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className={`p-4 rounded-xl border ${isTouchSafe ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-red-950/20 border-red-500/40 text-red-300'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold uppercase text-[11px]">{locale === 'fr' ? 'Tension de Toucher (Touch Voltage) :' : 'Mesh Touch Voltage:'}</span>
              <span className="text-xs font-bold">{isTouchSafe ? 'CONFORME' : 'NON-CONFORME'}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-300">Tension de maille calculée (Em) :</span>
                <span className="font-bold">{eMeshCalculated.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Limite tolérable sécuritaire (Etouch) :</span>
                <span className="font-bold">{eTouchTolerable.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Marge de sécurité :</span>
                <span>{(eTouchTolerable - eMeshCalculated).toFixed(1)} V</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isStepSafe ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-red-950/20 border-red-500/40 text-red-300'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold uppercase text-[11px]">{locale === 'fr' ? 'Tension de Pas (Step Voltage) :' : 'Step Voltage:'}</span>
              <span className="text-xs font-bold">{isStepSafe ? 'CONFORME' : 'NON-CONFORME'}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-300">Tension de pas calculée (Es) :</span>
                <span className="font-bold">{eStepCalculated.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Limite tolérable sécuritaire (Estep) :</span>
                <span className="font-bold">{eStepTolerable.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Marge de sécurité :</span>
                <span>{(eStepTolerable - eStepCalculated).toFixed(1)} V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 font-mono text-xs ${
          isTouchSafe && isStepSafe
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/20 border-red-500/40 text-red-300'
        }`}>
          {isTouchSafe && isStepSafe ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          )}
          <div className="space-y-1">
            <div className="font-bold text-sm">
              {isTouchSafe && isStepSafe
                ? (locale === 'fr' ? 'Réseau de Terre et Sécurité Humaine Conforme' : 'Grounding Grid Safe for Personnel')
                : (locale === 'fr' ? 'DANGER : Risque de Fibrillation Ventriculaire' : 'DANGER: Lethal Shock Hazard')}
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              {isTouchSafe && isStepSafe
                ? (locale === 'fr'
                    ? `La tension maximale de toucher (${eMeshCalculated.toFixed(0)} V) reste en-deçà du seuil limite de fibrillation cardiaque (${eTouchTolerable.toFixed(0)} V) pour un intervenant de 70 kg avec élimination en ${earthClearTimeSec} s. La couche de gravier de ${crushedRockThicknessMm} mm apporte une résistance de contact additionnelle déterminante.`
                    : `Mesh voltages stay safely below the ventricular fibrillation threshold for 70 kg personnel under ${earthClearTimeSec} s clearance.`)
                : (locale === 'fr'
                    ? `ATTENTION : Les tensions de contact générées sous un défaut de ${earthIfaultKa} kA dépassent les tolérances IEEE 80. Action requise : ajouter des piquets de terre, resserrer la maille de grille (5x5m) ou augmenter l'épaisseur du gravier de surface.`
                    : `WARNING: Touch voltage exceeds IEEE 80 tolerable limits. Reduce mesh spacing or increase surface crushed rock thickness.`)}
            </p>
          </div>
        </div>

        {/* IEEE 80 Reference Formulas */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-emerald-400 font-bold mb-1">{locale === 'fr' ? 'Formulations Mathématiques de Référence IEEE 80 :' : 'IEEE 80 Governing Formulations:'}</div>
          <div className="text-neutral-300">• E_touch_70 = (1000 + 1.5 · Cs · ρ_s) · 0.157 / √(ts) = {eTouchTolerable.toFixed(1)} V</div>
          <div className="text-neutral-300">• E_step_70 = (1000 + 6.0 · Cs · ρ_s) · 0.157 / √(ts) = {eStepTolerable.toFixed(1)} V</div>
          <div className="text-neutral-300">• Facteur de derating gravier Cs = {csDerating.toFixed(3)} (Gravier {crushedRockThicknessMm} mm, ρ_s = 2500 Ω·m)</div>
          <div className="text-neutral-300">• Longueur totale conducteurs enfouis Lt = {totalBuriedLengthLt.toFixed(0)} m (Maille + {gridRodsCount} piquets)</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES DE TERRE' : 'EARTHING PARAMETERS'}</span>
          <span className="text-emerald-400 font-normal">IEEE 80-2013</span>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Résistivité du sol (ρ) :' : 'Soil Resistivity (ρ):'}</span>
            <span className="text-emerald-400 font-bold">{earthRho} Ω·m</span>
          </label>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={earthRho}
            onChange={(e) => setEarthRho(parseFloat(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Courant de défaut à la terre :' : 'Earth Fault Current:'}</span>
            <span className="text-red-400 font-bold">{earthIfaultKa} kA</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={earthIfaultKa}
            onChange={(e) => setEarthIfaultKa(parseFloat(e.target.value))}
            className="w-full accent-red-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Temps d\'élimination défaut (ts) :' : 'Fault Clear Time (ts):'}</span>
            <span className="text-cyan-400 font-bold">{earthClearTimeSec} s</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={1.0}
            step={0.05}
            value={earthClearTimeSec}
            onChange={(e) => setEarthClearTimeSec(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Longueur (m) :' : 'Length (m):'}</label>
            <input
              type="number"
              value={gridAreaL}
              onChange={(e) => setGridAreaL(parseFloat(e.target.value) || 10)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Largeur (m) :' : 'Width (m):'}</label>
            <input
              type="number"
              value={gridAreaW}
              onChange={(e) => setGridAreaW(parseFloat(e.target.value) || 10)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Nombre de piquets (3m) :' : 'Earth Rods (3m each):'}</span>
            <span className="text-cyan-400 font-bold">{gridRodsCount}</span>
          </label>
          <input
            type="range"
            min={0}
            max={40}
            step={2}
            value={gridRodsCount}
            onChange={(e) => setGridRodsCount(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Épaisseur gravier surface :' : 'Crushed Rock Layer:'}</span>
            <span className="text-amber-400 font-bold">{crushedRockThicknessMm} mm</span>
          </label>
          <input
            type="range"
            min={0}
            max={250}
            step={25}
            value={crushedRockThicknessMm}
            onChange={(e) => setCrushedRockThicknessMm(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400"
          />
        </div>

        {onOpenReport && (
          <div className="pt-2 border-t border-[#252E38]">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Éditer Note de Calcul Mise à la Terre' : 'Generate Earthing Report'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
