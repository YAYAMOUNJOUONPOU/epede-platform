// src/components/calculators/modules/SolarSizingCalculator.tsx
import React, { useState } from 'react';
import { Sun, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface SolarSizingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const SolarSizingCalculator: React.FC<SolarSizingCalculatorProps> = ({ locale, onOpenReport }) => {
  // 10. SOLAR PV STRING SIZING & MPPT CALCULATOR (IEC 62548 / IEC 61215)
  const [pvPmpW, setPvPmpW] = useState<number>(550); // 550 Wp module
  const [pvVocStc, setPvVocStc] = useState<number>(49.8); // Voc at STC (V)
  const [pvVmpStc, setPvVmpStc] = useState<number>(41.9); // Vmp at STC (V)
  const [pvBetaVocPercent, setPvBetaVocPercent] = useState<number>(-0.27); // % / °C
  const [pvBetaVmpPercent, setPvBetaVmpPercent] = useState<number>(-0.34); // % / °C
  const [pvTmin, setPvTmin] = useState<number>(-10); // Winter record min temp (°C)
  const [pvTambMax, setPvTambMax] = useState<number>(42); // Summer peak ambient temp (°C)
  const [pvSysVmax, setPvSysVmax] = useState<number>(1500); // 1500 V DC system max
  const [pvInvVmpptMin, setPvInvVmpptMin] = useState<number>(600); // 600 V MPPT min
  const [pvInvVmpptMax, setPvInvVmpptMax] = useState<number>(1400); // 1400 V MPPT max
  const [pvInvPacKw, setPvInvPacKw] = useState<number>(250); // 250 kW central/string inverter
  const [pvSelectedModPerStr, setPvSelectedModPerStr] = useState<number>(26); // User chosen modules/string
  const [pvStringsPerInv, setPvStringsPerInv] = useState<number>(20); // 20 strings per inverter
  const [pvTargetFarmMw, setPvTargetFarmMw] = useState<number>(50); // 50 MWc overall farm

  // Calculations:
  // Coldest cell Voc
  const pvDeltaTcold = pvTmin - 25;
  const pvVocCold = pvVocStc * (1 + (pvBetaVocPercent / 100) * pvDeltaTcold);
  const pvStringVocCold = pvSelectedModPerStr * pvVocCold;

  // Hottest cell Vmp
  // Typical cell temperature rise NOCT ~ 45°C: Tcell = Tamb + (NOCT - 20) * (1000/800) = Tamb + 31.25°C
  const pvTcellMax = pvTambMax + 31.25;
  const pvDeltaThot = pvTcellMax - 25;
  const pvVmpHot = pvVmpStc * (1 + (pvBetaVmpPercent / 100) * pvDeltaThot);
  const pvStringVmpHot = pvSelectedModPerStr * pvVmpHot;

  // Permissible modules per string range:
  const pvNmax = Math.floor(pvSysVmax / pvVocCold);
  const pvNmin = Math.ceil(pvInvVmpptMin / pvVmpHot);

  // Inverter DC capacity & ILR (Inverter Loading Ratio / DC:AC ratio)
  const pvStringPdcKw = (pvSelectedModPerStr * pvPmpW) / 1000;
  const pvActualInvPdcKw = pvStringsPerInv * pvStringPdcKw;
  const pvIlr = pvActualInvPdcKw / pvInvPacKw;

  // Farm level statistics
  const pvTotalInverters = Math.ceil((pvTargetFarmMw * 1000) / pvActualInvPdcKw);
  const pvTotalModules = pvTotalInverters * pvStringsPerInv * pvSelectedModPerStr;
  const pvTotalActualMw = (pvTotalModules * pvPmpW) / 1000000;

  // Compliance checks
  const isPvVocCompliant = pvStringVocCold <= pvSysVmax;
  const isPvMpptCompliant = pvStringVmpHot >= pvInvVmpptMin;
  const isPvIlrOptimal = pvIlr >= 1.15 && pvIlr <= 1.45;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-400" />
            {locale === 'fr' ? 'DIMENSIONNEMENT DES CHAÎNES SOLAIRES PHOTOVOLTAÏQUES' : 'SOLAR PV STRING & MPPT SIZING'}
          </span>
          <span className="text-amber-400">CEI 62548 / CEI 61215 · {pvSysVmax} V DC</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-amber-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION MAX À FROID Voc(Tmin)</div>
            <div className={`text-2xl font-black ${isPvVocCompliant ? 'text-amber-300' : 'text-red-400'}`}>
              {pvStringVocCold.toFixed(1)} <span className="text-xs font-normal text-neutral-400">V DC</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Limite max: ${pvSysVmax} V (Marge ${(pvSysVmax - pvStringVocCold).toFixed(0)} V)` : `Max limit: ${pvSysVmax} V`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-cyan-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION MIN MPPT Vmp(Tmax)</div>
            <div className={`text-2xl font-black ${isPvMpptCompliant ? 'text-cyan-300' : 'text-amber-400'}`}>
              {pvStringVmpHot.toFixed(1)} <span className="text-xs font-normal text-neutral-400">V DC</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Fenêtre MPPT: ${pvInvVmpptMin} - ${pvInvVmpptMax} V` : `MPPT window: ${pvInvVmpptMin}-${pvInvVmpptMax} V`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">RATIO DC/AC ONDULEUR (ILR)</div>
            <div className={`text-2xl font-black ${isPvIlrOptimal ? 'text-emerald-400' : 'text-amber-300'}`}>
              {pvIlr.toFixed(2)} <span className="text-xs font-normal text-neutral-400">×</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? 'Optimal entre 1.15 et 1.45' : 'Optimal range: 1.15 to 1.45'}
            </div>
          </div>
        </div>

        {/* Second row of secondary summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE / CHAÎNE</div>
            <div className="text-base font-bold text-white mt-0.5">{pvStringPdcKw.toFixed(2)} kWc</div>
            <div className="text-[10px] text-neutral-500">{pvSelectedModPerStr} modules</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">CHAÎNES / ONDULEUR</div>
            <div className="text-base font-bold text-white mt-0.5">{pvStringsPerInv} chaînes</div>
            <div className="text-[10px] text-neutral-500">{pvActualInvPdcKw.toFixed(0)} kWc DC</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">TOTAL ONDULEURS</div>
            <div className="text-base font-bold text-cyan-300 mt-0.5">{pvTotalInverters} unités</div>
            <div className="text-[10px] text-neutral-500">{pvInvPacKw} kW AC ch.</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE TOTALE CENTRALE</div>
            <div className="text-base font-bold text-amber-300 mt-0.5">{pvTotalActualMw.toFixed(2)} MWc</div>
            <div className="text-[10px] text-neutral-500">{pvTotalModules.toLocaleString()} modules</div>
          </div>
        </div>

        {/* Interactive String Range Visualizer Card */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-bold uppercase text-[11px]">
              {locale === 'fr' ? 'PLAGE ADMISSIBLE DE MODULES PAR CHAÎNE' : 'PERMISSIBLE MODULES PER STRING RANGE'}
            </span>
            <span className="text-amber-400 font-bold">N_min = {pvNmin} | N_max = {pvNmax} modules</span>
          </div>
          <div className="h-3 w-full bg-[#161C24] rounded-full overflow-hidden relative border border-[#252E38]">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" 
              style={{
                marginLeft: `${(pvNmin / 35) * 100}%`,
                width: `${((pvNmax - pvNmin) / 35) * 100}%`
              }}
            />
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_white]"
              style={{ left: `${(pvSelectedModPerStr / 35) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>0</span>
            <span>N_min ({pvNmin}) : Décrochage MPPT si moins</span>
            <span className="text-white font-bold">Sélection : {pvSelectedModPerStr}</span>
            <span className="text-red-400">N_max ({pvNmax}) : Claquage si plus</span>
            <span>35</span>
          </div>
        </div>

        {/* Compliance Banner */}
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs font-mono ${
          isPvVocCompliant && isPvMpptCompliant
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/20 border-red-500/40 text-red-300'
        }`}>
          {isPvVocCompliant && isPvMpptCompliant ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          )}
          <div className="space-y-0.5">
            <div className="font-bold text-[11px]">
              {isPvVocCompliant && isPvMpptCompliant
                ? (locale === 'fr' ? 'Conformité Normative CEI 62548 Validée' : 'IEC 62548 Normative Compliance Verified')
                : (locale === 'fr' ? 'Non-Conformité : Ajustement Immédiat Requis' : 'Non-Compliance: Adjustment Required')}
            </div>
            <div className="text-[10px] text-neutral-300 leading-relaxed">
              {locale === 'fr'
                ? `La chaîne de ${pvSelectedModPerStr} modules présente une tension maximale à froid de ${pvStringVocCold.toFixed(1)} V (inférieure à ${pvSysVmax} V DC) et une tension minimale à chaud de ${pvStringVmpHot.toFixed(1)} V (supérieure à ${pvInvVmpptMin} V). L'onduleur fonctionnera en permanence dans sa plage optimale de rendement sans risque d'écrêtage excessif.`
                : `String configuration with ${pvSelectedModPerStr} modules satisfies voltage limit (${pvStringVocCold.toFixed(1)} V < ${pvSysVmax} V) and MPPT window.`}
            </div>
          </div>
        </div>

        {/* Formulas Box */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-amber-400 font-bold mb-1">{locale === 'fr' ? 'Formulations Mathématiques de Référence (CEI 62548 / CEI 61215) :' : 'Standard Mathematical Formulations:'}</div>
          <div className="text-neutral-300">• Voc(Tmin) = Voc_STC · [1 + β_Voc · (Tmin - 25°C)] [V]</div>
          <div className="text-neutral-300">• Tcell_max = Tamb_max + [(NOCT - 20°C) / 800 W/m²] · 1000 W/m² = {pvTcellMax.toFixed(1)}°C</div>
          <div className="text-neutral-300">• Vmp(Tcell_max) = Vmp_STC · [1 + β_Voc · (Tcell_max - 25°C)] [V]</div>
          <div className="text-neutral-300">• N_max = ⌊Vsys_max / Voc(Tmin)⌋ = ⌊{pvSysVmax} / {pvVocCold.toFixed(2)}⌋ = {pvNmax} modules</div>
          <div className="text-neutral-300">• N_min = ⌈Vmppt_min / Vmp(Tcell_max)⌉ = ⌈{pvInvVmpptMin} / {pvVmpHot.toFixed(2)}⌉ = {pvNmin} modules</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES SOLAIRES' : 'PV INPUT PARAMETERS'}</span>
          <span className="text-amber-400 font-normal">STC 1000 W/m²</span>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Puissance module (Pmp) :' : 'Module Power (Pmp):'}</span>
            <span className="text-amber-400 font-bold">{pvPmpW} Wc</span>
          </label>
          <input
            type="range"
            min={400}
            max={700}
            step={5}
            value={pvPmpW}
            onChange={(e) => setPvPmpW(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">Voc STC (V) :</label>
            <input
              type="number"
              step={0.1}
              value={pvVocStc}
              onChange={(e) => setPvVocStc(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">Vmp STC (V) :</label>
            <input
              type="number"
              step={0.1}
              value={pvVmpStc}
              onChange={(e) => setPvVmpStc(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'Tmin Hiver (°C) :' : 'Min Temp (°C):'}</label>
            <input
              type="number"
              value={pvTmin}
              onChange={(e) => setPvTmin(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'Tamb Max (°C) :' : 'Max Temp (°C):'}</label>
            <input
              type="number"
              value={pvTambMax}
              onChange={(e) => setPvTambMax(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Tension max système (Vsys) :' : 'Max System Voltage:'}</span>
            <span className="text-white font-bold">{pvSysVmax} V DC</span>
          </label>
          <select
            value={pvSysVmax}
            onChange={(e) => setPvSysVmax(parseInt(e.target.value, 10))}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value={1500}>1500 V DC · Grandes Centrales Utility Scale</option>
            <option value={1000}>1000 V DC · Toitures Industrielles & Tertiaire</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Modules par chaîne :' : 'Modules per string:'}</span>
            <span className="text-amber-300 font-bold">{pvSelectedModPerStr} modules</span>
          </label>
          <input
            type="range"
            min={pvNmin - 2 > 0 ? pvNmin - 2 : 15}
            max={pvNmax + 3}
            step={1}
            value={pvSelectedModPerStr}
            onChange={(e) => setPvSelectedModPerStr(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Chaînes par onduleur :' : 'Strings per inverter:'}</span>
            <span className="text-cyan-300 font-bold">{pvStringsPerInv} chaînes</span>
          </label>
          <input
            type="range"
            min={10}
            max={32}
            step={1}
            value={pvStringsPerInv}
            onChange={(e) => setPvStringsPerInv(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Cible centrale (MWc) :' : 'Farm Target (MWp):'}</span>
            <span className="text-white font-bold">{pvTargetFarmMw} MWc</span>
          </label>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={pvTargetFarmMw}
            onChange={(e) => setPvTargetFarmMw(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400"
          />
        </div>

        {onOpenReport && (
          <div className="pt-2 border-t border-[#252E38]">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Éditer Note de Calcul Solaire' : 'Generate Solar Sizing Sheet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
