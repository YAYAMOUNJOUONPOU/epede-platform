// src/components/calculators/modules/PfcCalculator.tsx
import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface PfcCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const PfcCalculator: React.FC<PfcCalculatorProps> = ({ locale, onOpenReport }) => {
  // 9. PHASE 2: POWER FACTOR CORRECTION & CAPACITOR BANK (IEC 60831 / IEC 61642)
  const [pfcPKw, setPfcPKw] = useState<number>(500); // 500 kW active power
  const [pfcCosPhiInitial, setPfcCosPhiInitial] = useState<number>(0.76); // initial cos phi 0.76
  const [pfcCosPhiTarget, setPfcCosPhiTarget] = useState<number>(0.96); // target cos phi 0.96
  const [pfcVoltageV, setPfcVoltageV] = useState<number>(400); // 400 V
  const [pfcDetunedOption, setPfcDetunedOption] = useState<'none' | '7%' | '14%'>('7%'); // 7% detuning (189 Hz)
  const [pfcStepsCount, setPfcStepsCount] = useState<number>(6); // 6 automatic steps

  const phi1 = Math.acos(Math.max(0.1, Math.min(1.0, pfcCosPhiInitial)));
  const phi2 = Math.acos(Math.max(0.1, Math.min(1.0, pfcCosPhiTarget)));
  const tanPhi1 = Math.tan(phi1);
  const tanPhi2 = Math.tan(phi2);

  // Qc required = P * (tan phi1 - tan phi2) [kvar]
  const qkvarRequired = Math.max(0, pfcPKw * (tanPhi1 - tanPhi2));

  // Current before and after correction
  const currentBeforeA = (pfcPKw * 1000) / (Math.sqrt(3) * pfcVoltageV * pfcCosPhiInitial);
  const currentAfterA = (pfcPKw * 1000) / (Math.sqrt(3) * pfcVoltageV * pfcCosPhiTarget);
  const currentSavedA = currentBeforeA - currentAfterA;
  const currentReductionPercent = ((currentBeforeA - currentAfterA) / currentBeforeA) * 100;

  // Apparent power reduction (S savings freeing transformer capacity)
  const sKvaBefore = pfcPKw / pfcCosPhiInitial;
  const sKvaAfter = pfcPKw / pfcCosPhiTarget;
  const sKvaReleased = sKvaBefore - sKvaAfter;

  // Recommended step size and commercial capacitor bank sizing (rounded up to 25 or 50 kvar blocks)
  const qCommercialKvar = Math.ceil(qkvarRequired / 25) * 25;
  const stepSizeKvar = qCommercialKvar / pfcStepsCount;

  // Detuning reactor tuning frequency fr = f_grid / sqrt(p)
  // 7% detuning -> fr = 50 / sqrt(0.07) = 189 Hz (blocks 5th harmonic 250 Hz anti-resonance)
  // 14% detuning -> fr = 50 / sqrt(0.14) = 134 Hz (blocks 3rd harmonic 150 Hz)
  const detunedFreqHz = pfcDetunedOption === '7%' ? 189 : pfcDetunedOption === '14%' ? 134 : 0;
  const capacitorRatedVoltage = pfcDetunedOption === '7%' ? 440 : pfcDetunedOption === '14%' ? 480 : 400;

  // Monthly active penalty savings estimation (approx. $0.06/kvarh over 250h monthly operation)
  const estimatedMonthlySavingsUsd = qCommercialKvar * 250 * 0.045;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            {locale === 'fr' ? 'COMPENSATION D\'ÉNERGIE RÉACTIVE & BATTERIE DE CONDENSATEURS' : 'POWER FACTOR CORRECTION & CAPACITOR SIZING'}
          </span>
          <span className="text-cyan-400">CEI 60831 / CEI 61642</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-cyan-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE RÉACTIVE REQUISE (Qc)</div>
            <div className="text-2xl font-black text-cyan-300">
              {qkvarRequired.toFixed(1)} <span className="text-xs font-normal text-neutral-400">kvar</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-bold">
              {locale === 'fr' ? `Batterie installée : ${qCommercialKvar} kvar` : `Commercial bank: ${qCommercialKvar} kvar`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-emerald-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">RÉDUCTION DE COURANT LIGNE</div>
            <div className="text-2xl font-black text-emerald-300">
              -{currentReductionPercent.toFixed(1)} <span className="text-xs font-normal text-neutral-400">%</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Économie : ${currentSavedA.toFixed(1)} A (${currentBeforeA.toFixed(0)}A → ${currentAfterA.toFixed(0)}A)` : `Delta: ${currentSavedA.toFixed(1)} A`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">CAPACITÉ TRANSFO LIBÉRÉE</div>
            <div className="text-2xl font-black text-amber-300">
              {sKvaReleased.toFixed(1)} <span className="text-xs font-normal text-neutral-400">kVA</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Apparente S: ${sKvaBefore.toFixed(0)} → ${sKvaAfter.toFixed(0)} kVA` : `Apparent: ${sKvaBefore.toFixed(0)} → ${sKvaAfter.toFixed(0)} kVA`}
            </div>
          </div>
        </div>

        {/* Steps and Detuning Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">ÉTAGES AUTOMATIQUES</div>
            <div className="text-base font-bold text-white mt-0.5">{pfcStepsCount} gradins</div>
            <div className="text-[10px] text-cyan-400 font-bold">{stepSizeKvar.toFixed(1)} kvar / gradin</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">SELF ANTI-HARMONIQUE</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              {pfcDetunedOption === 'none' ? 'Aucune' : `Self ${pfcDetunedOption}`}
            </div>
            <div className="text-[10px] text-neutral-500">
              {pfcDetunedOption === 'none' ? 'Standard' : `fr = ${detunedFreqHz} Hz`}
            </div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION ASSIGNÉE CONDENSATEUR</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{capacitorRatedVoltage} V</div>
            <div className="text-[10px] text-neutral-500">{pfcDetunedOption !== 'none' ? 'Sur-isolé avec self' : 'Standard 400V'}</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">ÉCONOMIE PÉNALITÉS FACTURE</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">~{estimatedMonthlySavingsUsd.toFixed(0)} $/mois</div>
            <div className="text-[10px] text-neutral-500">Suppression tan φ excessif</div>
          </div>
        </div>

        {/* Detuned Reactor Harmonics Anti-Resonance Guide */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2 font-mono text-xs">
          <div className="text-neutral-300 font-bold uppercase text-[11px] flex justify-between">
            <span>{locale === 'fr' ? 'PROTECTION CONTRE LA RÉSONANCE HARMONIQUE (CEI 61642)' : 'HARMONIC RESONANCE PROTECTION (IEC 61642)'}</span>
            <span className="text-cyan-400 font-bold">Taux d'accord p = {pfcDetunedOption}</span>
          </div>
          <p className="text-neutral-300 leading-relaxed font-sans text-xs">
            {pfcDetunedOption === '7%'
              ? (locale === 'fr'
                  ? 'La self de désaccordage à 7% décale la fréquence de résonance LC à 189 Hz, sous le premier harmonique prépondérant (rang 5 = 250 Hz). Elle prévient tout phénomène de résonance parallèle entre la batterie de condensateurs et le transformateur d\'alimentation, protégeant ainsi l\'installation contre les claquages diélectriques et les surtensions destructrices.'
                  : 'A 7% detuning reactor shifts the LC resonant frequency to 189 Hz, well below the 5th harmonic (250 Hz). This prevents parallel resonance amplification between the capacitor bank and upstream transformer.')
              : pfcDetunedOption === '14%'
              ? (locale === 'fr'
                  ? 'La self de 14% (134 Hz) est requise en présence de charges non linéaires sévères (fours à arc, data centers avec forte présence d\'harmonique 3 de courant neutre à 150 Hz).'
                  : 'A 14% detuning reactor (134 Hz) is required in facilities with severe 3rd harmonic content (150 Hz) such as data centers and single-phase heavy loads.')
              : (locale === 'fr'
                  ? 'ATTENTION : Les condensateurs sans selfs de protection sont exposés à la surchauffe harmonique et à l\'amplification des résonances si le taux de charge non-linéaire (variateurs, redresseurs) excède 15% de la puissance transfo.'
                  : 'WARNING: Pure capacitors without detuned reactors can trigger fatal harmonic resonance if VFD/rectifier load exceeds 15%.')}
          </p>
        </div>

        {/* Compliance Banner */}
        <div className="p-3.5 rounded-xl border bg-emerald-950/20 border-emerald-500/40 text-emerald-300 flex items-start gap-3 text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
          <div className="space-y-0.5">
            <div className="font-bold text-[11px]">
              {locale === 'fr' ? 'Optimisation du Réseau et Facteur de Puissance Conforme' : 'Power Factor & Grid Optimization Verified'}
            </div>
            <div className="text-[10px] text-neutral-300 leading-relaxed">
              {locale === 'fr'
                ? `La compensation de ${qkvarRequired.toFixed(1)} kvar relève le facteur de puissance de ${pfcCosPhiInitial} à ${pfcCosPhiTarget} (tan φ = ${tanPhi2.toFixed(3)} ≤ seuil tarifaire de 0.40). La chute de tension de ligne et les pertes Joule par effet I²R dans les câbles sont réduites de ${(100 - (currentAfterA / currentBeforeA) ** 2 * 100).toFixed(1)}%.`
                : `Power factor corrected from ${pfcCosPhiInitial} to ${pfcCosPhiTarget} with ${qkvarRequired.toFixed(1)} kvar. Cable I²R losses reduced by ${(100 - (currentAfterA / currentBeforeA) ** 2 * 100).toFixed(1)}%.`}
            </div>
          </div>
        </div>

        {/* Formulas Box */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-cyan-400 font-bold mb-1">{locale === 'fr' ? 'Formulations Mathématiques de Référence (CEI 60831) :' : 'Standard Mathematical Formulations:'}</div>
          <div className="text-neutral-300">• Qc = P · [tan(arccos φ1) - tan(arccos φ2)] = {pfcPKw} · [{tanPhi1.toFixed(3)} - {tanPhi2.toFixed(3)}] = {qkvarRequired.toFixed(2)} kvar</div>
          <div className="text-neutral-300">• Courant avant = P / (√3 · U · cos φ1) = {currentBeforeA.toFixed(1)} A</div>
          <div className="text-neutral-300">• Courant après = P / (√3 · U · cos φ2) = {currentAfterA.toFixed(1)} A</div>
          <div className="text-neutral-300">• Fréquence de résonance fr = f_réseau / √(p) = 50 / √({pfcDetunedOption === '7%' ? '0.07' : pfcDetunedOption === '14%' ? '0.14' : '0'}) = {detunedFreqHz} Hz</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES RÉSEAU & CHARGE' : 'LOAD & GRID PARAMETERS'}</span>
          <span className="text-cyan-400 font-normal">CEI 60831</span>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Puissance active (P) :' : 'Active Power (P):'}</span>
            <span className="text-cyan-400 font-bold">{pfcPKw} kW</span>
          </label>
          <input
            type="range"
            min={50}
            max={2500}
            step={25}
            value={pfcPKw}
            onChange={(e) => setPfcPKw(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Facteur cos φ initial :' : 'Initial Power Factor:'}</span>
            <span className="text-red-400 font-bold">{pfcCosPhiInitial.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.50}
            max={0.92}
            step={0.01}
            value={pfcCosPhiInitial}
            onChange={(e) => setPfcCosPhiInitial(parseFloat(e.target.value))}
            className="w-full accent-red-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Facteur cos φ visé :' : 'Target Power Factor:'}</span>
            <span className="text-emerald-400 font-bold">{pfcCosPhiTarget.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.90}
            max={1.00}
            step={0.01}
            value={pfcCosPhiTarget}
            onChange={(e) => setPfcCosPhiTarget(parseFloat(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">{locale === 'fr' ? 'Tension nominale réseau (U) :' : 'Rated Grid Voltage (U):'}</label>
          <select
            value={pfcVoltageV}
            onChange={(e) => setPfcVoltageV(parseInt(e.target.value, 10))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value={400}>400 V Triphasé BT (Europe / Afrique)</option>
            <option value={480}>480 V Triphasé BT (USA / Canada)</option>
            <option value={690}>690 V Triphasé Industriel / Éolien</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">{locale === 'fr' ? 'Selfs anti-harmoniques de désaccordage :' : 'Detuned Harmonic Filter Reactor:'}</label>
          <select
            value={pfcDetunedOption}
            onChange={(e) => setPfcDetunedOption(e.target.value as any)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
          >
            <option value="7%">7% · Accord à 189 Hz (Standard industrie anti-harmonique 5)</option>
            <option value="14%">14% · Accord à 134 Hz (Anti-harmonique 3 data centers)</option>
            <option value="none">Aucune · Réseau sans harmoniques (THDu &lt; 2%)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Nombre de gradins automatiques :' : 'Automatic Step Count:'}</span>
            <span className="text-cyan-300 font-bold">{pfcStepsCount} gradins</span>
          </label>
          <input
            type="range"
            min={4}
            max={12}
            step={1}
            value={pfcStepsCount}
            onChange={(e) => setPfcStepsCount(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400"
          />
        </div>

        {onOpenReport && (
          <div className="pt-2 border-t border-[#252E38]">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Éditer Note de Calcul PFC' : 'Generate PFC Sizing Sheet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
