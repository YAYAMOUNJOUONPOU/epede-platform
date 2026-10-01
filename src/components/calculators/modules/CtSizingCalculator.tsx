// src/components/calculators/modules/CtSizingCalculator.tsx
import React, { useState } from 'react';
import { Gauge, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface CtSizingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const CtSizingCalculator: React.FC<CtSizingCalculatorProps> = ({ locale, onOpenReport }) => {
  // 8. PHASE 2: CURRENT TRANSFORMER (CT) BURDEN & SATURATION KNEE-POINT (IEC 61869-2)
  const [ctIpn, setCtIpn] = useState<number>(1000); // 1000 A primary
  const [ctIsn, setCtIsn] = useState<number>(1); // 1 A secondary
  const [ctAlfn, setCtAlfn] = useState<number>(20); // 5P20 -> ALF = 20
  const [ctVaRating, setCtVaRating] = useState<number>(15); // 15 VA
  const [ctRctOhms, setCtRctOhms] = useState<number>(3.5); // Internal secondary resistance Rct (Ω)
  const [ctCableLengthM, setCtCableLengthM] = useState<number>(50); // Cable distance to relay (m)
  const [ctCableSectionMm2, setCtCableSectionMm2] = useState<number>(4); // Cable section (mm²)
  const [ctRelayBurdenVa, setCtRelayBurdenVa] = useState<number>(0.2); // Digital IED relay burden (VA)
  const [ctMaxFaultCurrentKa, setCtMaxFaultCurrentKa] = useState<number>(25); // Max prospective short-circuit current (kA)
  const [ctXrRatio, setCtXrRatio] = useState<number>(14); // Network X/R ratio

  // Resistivity of copper at 75°C
  const rhoCu75 = 0.0216; // Ω·mm²/m
  const rLeadOhms = (2 * rhoCu75 * ctCableLengthM) / ctCableSectionMm2;
  const rRelayOhms = ctRelayBurdenVa / (ctIsn ** 2);
  const rBurdenActual = rLeadOhms + rRelayOhms;
  const rBurdenNominal = ctVaRating / (ctIsn ** 2);
  
  // Effective ALF
  const alfEffective = ctAlfn * ((ctRctOhms + rBurdenNominal) / (ctRctOhms + rBurdenActual));
  
  // Secondary fault current
  const iFaultSecA = (ctMaxFaultCurrentKa * 1000) * (ctIsn / ctIpn);
  const faultMultiple = iFaultSecA / ctIsn;
  
  // Transient factor Ktd for DC offset: Ktd = 1 + (X/R) * (1 - exp(-0.04 / ((X/R)/314)))
  const tauPrimarySec = (ctXrRatio / 314.159);
  const ktd = 1 + ctXrRatio * (1 - Math.exp(-0.04 / (tauPrimarySec > 0 ? tauPrimarySec : 0.01)));
  
  // Knee-point voltage requirement (approximate Vk = Ktd * Ifault_sec * (Rct + Rburden))
  const vkRequiredVolts = ktd * iFaultSecA * (ctRctOhms + rBurdenActual);
  const vkRatedEstimate = ctAlfn * ctIsn * (ctRctOhms + rBurdenNominal);
  
  // Saturation check
  const isCtSafeFromSaturation = alfEffective >= (faultMultiple * Math.min(ktd, 1.8));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-cyan-400" />
            {locale === 'fr' ? 'DIMENSIONNEMENT & VÉRIFICATION DE SATURATION TC (CEI 61869-2)' : 'CURRENT TRANSFORMER SIZING & SATURATION'}
          </span>
          <span className="text-cyan-400">CLASSE PROTECTION 5P / 10P</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">ALF EFFECTIF (RÉEL EN CHARGE)</div>
            <div className={`text-2xl font-black ${alfEffective >= faultMultiple ? 'text-emerald-400' : 'text-red-400'}`}>
              {alfEffective.toFixed(1)} <span className="text-xs font-normal text-neutral-400">/ {ctAlfn} nom.</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Multiplicateur de défaut: ${faultMultiple.toFixed(1)} × In` : `Fault multiple: ${faultMultiple.toFixed(1)} × In`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">CHARGE RÉELLE CONNECTÉE (Rb)</div>
            <div className="text-2xl font-black text-cyan-300">
              {rBurdenActual.toFixed(2)} <span className="text-xs font-normal text-neutral-400">Ω</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Nominale: ${rBurdenNominal.toFixed(2)} Ω (${ctVaRating} VA)` : `Rated: ${rBurdenNominal.toFixed(2)} Ω (${ctVaRating} VA)`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION DE COUDE REQUISE (Vk)</div>
            <div className="text-2xl font-black text-amber-300">
              {vkRequiredVolts.toFixed(0)} <span className="text-xs font-normal text-neutral-400">V</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Facteur transitoire Ktd: ${ktd.toFixed(2)}` : `Transient factor Ktd: ${ktd.toFixed(2)}`}
            </div>
          </div>
        </div>

        {/* Detailed Cable & Burden Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">RÉSISTANCE FILERIE</div>
            <div className="text-base font-bold text-white mt-0.5">{rLeadOhms.toFixed(3)} Ω</div>
            <div className="text-[10px] text-neutral-500">Aller-Retour 2L</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">RÉSISTANCE RELAIS</div>
            <div className="text-base font-bold text-white mt-0.5">{rRelayOhms.toFixed(3)} Ω</div>
            <div className="text-[10px] text-neutral-500">Burden IED</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT SECONDAIRE</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{iFaultSecA.toFixed(1)} A</div>
            <div className="text-[10px] text-neutral-500">Sous {ctMaxFaultCurrentKa} kA C-C</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">Vk ESTIMÉE TC</div>
            <div className="text-base font-bold text-cyan-400 mt-0.5">~{vkRatedEstimate.toFixed(0)} V</div>
            <div className="text-[10px] text-neutral-500">Au coude magnétique</div>
          </div>
        </div>

        {/* Compliance Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 font-mono text-xs ${
          isCtSafeFromSaturation
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/20 border-red-500/40 text-red-300'
        }`}>
          {isCtSafeFromSaturation ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          )}
          <div className="space-y-1">
            <div className="font-bold text-sm">
              {isCtSafeFromSaturation
                ? (locale === 'fr' ? 'TC Protégé contre la Saturation Prématurée (Conforme)' : 'CT Protected from Early Saturation (Compliant)')
                : (locale === 'fr' ? 'Risque Majeur de Saturation du TC (Non-Conforme)' : 'Severe CT Saturation Risk (Non-Compliant)')}
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              {isCtSafeFromSaturation
                ? (locale === 'fr' 
                    ? `L'ALF effectif (${alfEffective.toFixed(1)}) excède le multiple de court-circuit nécessaire (${faultMultiple.toFixed(1)}). Le tore magnétique du transformateur de courant restera dans sa zone linéaire pendant l'élimination du défaut, garantissant le déclenchement instantané des protections différentielles ou surintensité.`
                    : `Effective ALF (${alfEffective.toFixed(1)}) exceeds required fault multiple (${faultMultiple.toFixed(1)}). The CT will not saturate prematurely.`)
                : (locale === 'fr'
                    ? `ATTENTION : L'ALF effectif (${alfEffective.toFixed(1)}) est inférieur au niveau requis sous défaut franc (${faultMultiple.toFixed(1)}). Le noyau saturera en régime asymétrique (composante apériodique DC), provoquant un retard critique au déclenchement ou un déclenchement intempestif. Augmenter la section du câble ou la puissance de précision (VA).`
                    : `WARNING: CT will saturate under fault conditions. Increase cable cross section or TC VA rating.`)}
            </p>
          </div>
        </div>

        {/* Reference Formulas */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-cyan-400 font-bold mb-1">{locale === 'fr' ? 'Formulations Normalisées CEI 61869-2 :' : 'IEC 61869-2 Standard Formulas:'}</div>
          <div className="text-neutral-300">• ALF_effectif = ALF_nominal · [(Rct + Rbn) / (Rct + Rb_réel)] = {ctAlfn} · [({ctRctOhms} + {rBurdenNominal.toFixed(2)}) / ({ctRctOhms} + {rBurdenActual.toFixed(2)})] = {alfEffective.toFixed(2)}</div>
          <div className="text-neutral-300">• R_filerie (boucle 2L) = (2 · ρ_cu · L) / S = (2 · {rhoCu75} · {ctCableLengthM}) / {ctCableSectionMm2} = {rLeadOhms.toFixed(3)} Ω</div>
          <div className="text-neutral-300">• Vk_requis = Ktd · I_défaut_sec · (Rct + Rb) = {ktd.toFixed(2)} · {iFaultSecA.toFixed(1)} A · ({ctRctOhms} + {rBurdenActual.toFixed(2)}) = {vkRequiredVolts.toFixed(1)} V</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES DU TC' : 'CT PARAMETERS'}</span>
          <span className="text-cyan-400 font-normal">CEI 61869-2</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Primaire Ipn (A) :' : 'Primary Ipn (A):'}</label>
            <select
              value={ctIpn}
              onChange={(e) => setCtIpn(parseInt(e.target.value, 10))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value={200}>200 A</option>
              <option value={400}>400 A</option>
              <option value={600}>600 A</option>
              <option value={1000}>1000 A</option>
              <option value={1250}>1250 A</option>
              <option value={2000}>2000 A</option>
              <option value={3150}>3150 A</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Secondaire Isn (A) :' : 'Secondary Isn (A):'}</label>
            <select
              value={ctIsn}
              onChange={(e) => setCtIsn(parseInt(e.target.value, 10))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value={1}>1 A (Recommandé)</option>
              <option value={5}>5 A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Facteur ALF :' : 'ALF Rating:'}</label>
            <select
              value={ctAlfn}
              onChange={(e) => setCtAlfn(parseInt(e.target.value, 10))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value={10}>ALF = 10 (5P10)</option>
              <option value={15}>ALF = 15 (5P15)</option>
              <option value={20}>ALF = 20 (5P20)</option>
              <option value={30}>ALF = 30 (5P30)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-neutral-300">{locale === 'fr' ? 'Puissance (VA) :' : 'Burden Rating:'}</label>
            <select
              value={ctVaRating}
              onChange={(e) => setCtVaRating(parseFloat(e.target.value))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value={5}>5 VA</option>
              <option value={10}>10 VA</option>
              <option value={15}>15 VA</option>
              <option value={30}>30 VA</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Résistance interne Rct :' : 'Internal CT Res (Rct):'}</span>
            <span className="text-cyan-400 font-bold">{ctRctOhms} Ω</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.1}
            value={ctRctOhms}
            onChange={(e) => setCtRctOhms(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Longueur câble filerie :' : 'Wiring Cable Length:'}</span>
            <span className="text-cyan-400 font-bold">{ctCableLengthM} m</span>
          </label>
          <input
            type="range"
            min={10}
            max={250}
            step={5}
            value={ctCableLengthM}
            onChange={(e) => setCtCableLengthM(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Section câble filerie :' : 'Cable Section:'}</span>
            <span className="text-cyan-400 font-bold">{ctCableSectionMm2} mm²</span>
          </label>
          <select
            value={ctCableSectionMm2}
            onChange={(e) => setCtCableSectionMm2(parseFloat(e.target.value))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value={2.5}>2.5 mm² Cu</option>
            <option value={4}>4.0 mm² Cu</option>
            <option value={6}>6.0 mm² Cu</option>
            <option value={10}>10.0 mm² Cu</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Courant C-C max (kA) :' : 'Max Fault (kA):'}</span>
            <span className="text-red-400 font-bold">{ctMaxFaultCurrentKa} kA</span>
          </label>
          <input
            type="range"
            min={5}
            max={63}
            step={1}
            value={ctMaxFaultCurrentKa}
            onChange={(e) => setCtMaxFaultCurrentKa(parseFloat(e.target.value))}
            className="w-full accent-red-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Rapport X/R réseau :' : 'Network X/R Ratio:'}</span>
            <span className="text-amber-400 font-bold">{ctXrRatio}</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={ctXrRatio}
            onChange={(e) => setCtXrRatio(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
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
              <span>{locale === 'fr' ? 'Éditer Note de Calcul TC' : 'Generate CT Sizing Sheet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
