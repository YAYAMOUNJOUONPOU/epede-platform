// src/components/calculators/modules/BessSizingCalculator.tsx
import React, { useState } from 'react';
import { Battery, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface BessSizingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const BessSizingCalculator: React.FC<BessSizingCalculatorProps> = ({ locale, onOpenReport }) => {
  // 11. BESS BATTERY ENERGY STORAGE SIZING (IEC 62933 / IEEE 2800)
  const [bessEusableMwh, setBessEusableMwh] = useState<number>(50); // 50 MWh usable
  const [bessPpcsMw, setBessPpcsMw] = useState<number>(25); // 25 MW PCS inverter power
  const [bessChemistry, setBessChemistry] = useState<'LFP' | 'NMC'>('LFP');
  const [bessDod, setBessDod] = useState<number>(0.90); // 90% Depth of Discharge
  const [bessRte, setBessRte] = useState<number>(0.88); // 88% Round-Trip Efficiency
  const [bessEolSoh, setBessEolSoh] = useState<number>(0.75); // 75% End-of-Life SOH
  const [bessLifetimeYears, setBessLifetimeYears] = useState<number>(15); // 15 years contractual
  const [bessCyclesPerDay, setBessCyclesPerDay] = useState<number>(1.2); // 1.2 cycles / day

  // Sizing calculations
  // BOL nameplate capacity required to guarantee EOL usable energy
  const bessNameplateBolMwh = bessEusableMwh / (bessDod * bessEolSoh * bessRte);
  const bessDischargeHours = bessEusableMwh / bessPpcsMw;
  const bessCRate = bessPpcsMw / bessNameplateBolMwh;

  // Standard 20ft container module capacity = 3.35 MWh (liquid-cooled LFP utility scale)
  const bessContainerUnitMwh = 3.35;
  const bessContainersCount = Math.ceil(bessNameplateBolMwh / bessContainerUnitMwh);
  const bessInstalledCapacityMwh = bessContainersCount * bessContainerUnitMwh;

  // Cumulative lifetime cycling & throughput
  const bessTotalCycles = Math.round(365 * bessLifetimeYears * bessCyclesPerDay);
  const bessTotalThroughputGwh = (bessTotalCycles * bessEusableMwh) / 1000;

  // Technology degradation rating
  const bessMaxCycleRating = bessChemistry === 'LFP' ? 7500 : 3500;
  const isBessCycleLifeCompliant = bessTotalCycles <= bessMaxCycleRating;

  // Short circuit current estimation for grid interconnection (33 kV bus)
  // Inverter fault contribution is current-limited to ~1.15x In
  const bessInverterInAmps = (bessPpcsMw * 1000) / (Math.sqrt(3) * 33);
  const bessShortCircuitKa = (bessInverterInAmps * 1.15) / 1000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-emerald-400" />
            {locale === 'fr' ? 'DIMENSIONNEMENT DU SYSTÈME DE STOCKAGE BESS (BATTERIES & PCS)' : 'BESS BATTERY STORAGE & PCS SIZING'}
          </span>
          <span className="text-emerald-400">CEI 62933-2-1 / IEEE 2800</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-[#161C24] p-4 rounded-xl border border-emerald-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">CAPACITÉ BRUTE BOL REQUISE</div>
            <div className="text-2xl font-black text-emerald-300">
              {bessNameplateBolMwh.toFixed(1)} <span className="text-xs font-normal text-neutral-400">MWh</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `Énergie utile EOL: ${bessEusableMwh} MWh` : `Usable EOL: ${bessEusableMwh} MWh`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-cyan-900/40 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">AUTONOMIE DE DÉCHARGE</div>
            <div className="text-2xl font-black text-cyan-300">
              {bessDischargeHours.toFixed(1)} <span className="text-xs font-normal text-neutral-400">heures</span>
            </div>
            <div className="text-[10px] text-neutral-500">
              {locale === 'fr' ? `À puissance PCS = ${bessPpcsMw} MW` : `At PCS power = ${bessPpcsMw} MW`}
            </div>
          </div>

          <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">RÉGIME C-RATE ÉQUIVALENT</div>
            <div className="text-2xl font-black text-amber-300">
              {bessCRate.toFixed(2)} C
            </div>
            <div className="text-[10px] text-neutral-500">
              {bessCRate <= 0.3 ? 'Stockage long (Peak Shaving)' : bessCRate <= 1.0 ? 'Stockage moyen (FCR)' : 'Forte puissance'}
            </div>
          </div>
        </div>

        {/* Second row of installation metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">CONTENEURS 20FT (3.35 MWh)</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{bessContainersCount} conteneurs</div>
            <div className="text-[10px] text-neutral-500">{bessInstalledCapacityMwh.toFixed(1)} MWh installés</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">CYCLAGE TOTAL VIE</div>
            <div className={`text-base font-bold mt-0.5 ${isBessCycleLifeCompliant ? 'text-white' : 'text-red-400'}`}>
              {bessTotalCycles} cycles
            </div>
            <div className="text-[10px] text-neutral-500">{bessLifetimeYears} ans · {bessCyclesPerDay} cyc/j</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">ÉNERGIE TRANSITÉE</div>
            <div className="text-base font-bold text-cyan-300 mt-0.5">{bessTotalThroughputGwh.toFixed(1)} GWh</div>
            <div className="text-[10px] text-neutral-500">Throughput cumulé</div>
          </div>
          <div className="bg-[#11161D] p-3 rounded-xl border border-[#252E38]">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT C-C PCS (33 kV)</div>
            <div className="text-base font-bold text-amber-300 mt-0.5">{bessShortCircuitKa.toFixed(2)} kA</div>
            <div className="text-[10px] text-neutral-500">Limité à 1.15 In</div>
          </div>
        </div>

        {/* Technology Comparison Card */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2 font-mono text-xs">
          <div className="text-neutral-300 font-bold uppercase text-[11px] flex justify-between">
            <span>{locale === 'fr' ? 'ÉVALUATION CHIMIQUE CELLULES' : 'CELL CHEMISTRY EVALUATION'}</span>
            <span className="text-emerald-400 font-bold">{bessChemistry === 'LFP' ? 'LFP (LiFePO4) Recommandé' : 'NMC'}</span>
          </div>
          <p className="text-neutral-300 leading-relaxed font-sans text-xs">
            {bessChemistry === 'LFP'
              ? (locale === 'fr'
                  ? 'La chimie LFP (Lithium Fer Phosphate) offre une stabilité thermique exceptionnelle (température d\'emballement > 270°C), une durée de vie élevée (6000 à 8000 cycles à 90% DoD), et l\'absence de cobalt toxique. Idéale pour les applications de réseaux de transport et distribution (33/225 kV).'
                  : 'LFP chemistry provides superior thermal runaway safety (>270°C), high cycle life (6000-8000 cycles at 90% DoD), and zero cobalt. Standard for utility-scale BESS.')
              : (locale === 'fr'
                  ? 'La chimie NMC présente une densité volumique supérieure mais une endurance cyclique plus faible (3000 à 4000 cycles) et une sensibilité accrue au vieillissement thermique. Un système anti-incendie NFPA 855 renforcé est requis.'
                  : 'NMC provides high energy density but lower cycle life (3000-4000 cycles) and higher thermal sensitivity.')}
          </p>
        </div>

        {/* Compliance Banner */}
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs font-mono ${
          isBessCycleLifeCompliant
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
        }`}>
          {isBessCycleLifeCompliant ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          )}
          <div className="space-y-0.5">
            <div className="font-bold text-[11px]">
              {isBessCycleLifeCompliant
                ? (locale === 'fr' ? 'Tenue d\'Endurance et Vieillissement Validée' : 'Cycle Life & Degradation Verified')
                : (locale === 'fr' ? 'Attention : Stratégie d\'Augmentation Requise' : 'Warning: Augmentation Required')}
            </div>
            <div className="text-[10px] text-neutral-300 leading-relaxed">
              {locale === 'fr'
                ? `Le profil de cyclage (${bessTotalCycles} cycles sur ${bessLifetimeYears} ans) reste dans les limites de la chimie ${bessChemistry} (endurance max ~${bessMaxCycleRating} cycles). Le surdimensionnement BOL de ${(bessNameplateBolMwh - bessEusableMwh).toFixed(1)} MWh compense parfaitement le vieillissement SOH jusqu'à ${(bessEolSoh * 100).toFixed(0)}% et le rendement RTE de ${(bessRte * 100).toFixed(0)}%.`
                : `Sizing accounts for ${(bessEolSoh * 100).toFixed(0)}% EOL SOH degradation and ${(bessRte * 100).toFixed(0)}% RTE.`}
            </div>
          </div>
        </div>

        {/* Formulas Box */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5 font-mono text-[11px]">
          <div className="text-emerald-400 font-bold mb-1">{locale === 'fr' ? 'Formulations Mathématiques de Référence (CEI 62933 / IEEE 2800) :' : 'Standard Mathematical Formulations:'}</div>
          <div className="text-neutral-300">• Capacité BOL = E_utile / (DoD · SOH_eol · RTE) = {bessEusableMwh} / ({bessDod} · {bessEolSoh} · {bessRte}) = {bessNameplateBolMwh.toFixed(2)} MWh</div>
          <div className="text-neutral-300">• Régime C-Rate = P_PCS / Capacité_BOL = {bessPpcsMw} MW / {bessNameplateBolMwh.toFixed(1)} MWh = {bessCRate.toFixed(2)} C</div>
          <div className="text-neutral-300">• Conteneurs N = ⌈{bessNameplateBolMwh.toFixed(1)} MWh / 3.35 MWh⌉ = {bessContainersCount} unités</div>
          <div className="text-neutral-300">• Cycles totaux = 365 · {bessLifetimeYears} ans · {bessCyclesPerDay} cyc/j = {bessTotalCycles} cycles</div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES BESS' : 'BESS PARAMETERS'}</span>
          <span className="text-emerald-400 font-normal">CEI 62933</span>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Énergie utile requise (EOL) :' : 'Usable Energy (EOL):'}</span>
            <span className="text-emerald-400 font-bold">{bessEusableMwh} MWh</span>
          </label>
          <input
            type="range"
            min={5}
            max={150}
            step={5}
            value={bessEusableMwh}
            onChange={(e) => setBessEusableMwh(parseFloat(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'Puissance PCS onduleur :' : 'PCS Inverter Power:'}</span>
            <span className="text-cyan-400 font-bold">{bessPpcsMw} MW</span>
          </label>
          <input
            type="range"
            min={2}
            max={50}
            step={1}
            value={bessPpcsMw}
            onChange={(e) => setBessPpcsMw(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300">{locale === 'fr' ? 'Chimie des cellules :' : 'Cell Chemistry:'}</label>
          <select
            value={bessChemistry}
            onChange={(e) => setBessChemistry(e.target.value as any)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-emerald-300 font-bold focus:border-emerald-400 focus:outline-none"
          >
            <option value="LFP">LFP · Lithium Fer Phosphate (6000-8000 cycles · Sécurité max)</option>
            <option value="NMC">NMC · Nickel Manganèse Cobalt (3000-4000 cycles · Haute densité)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'DoD (%) :' : 'DoD (%):'}</label>
            <input
              type="number"
              min={50}
              max={100}
              value={Math.round(bessDod * 100)}
              onChange={(e) => setBessDod((parseFloat(e.target.value) || 90) / 100)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'Rendement RTE (%) :' : 'RTE (%):'}</label>
            <input
              type="number"
              min={70}
              max={98}
              value={Math.round(bessRte * 100)}
              onChange={(e) => setBessRte((parseFloat(e.target.value) || 88) / 100)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'Durée visée (ans) :' : 'Lifetime (yrs):'}</label>
            <input
              type="number"
              min={5}
              max={25}
              value={bessLifetimeYears}
              onChange={(e) => setBessLifetimeYears(parseInt(e.target.value, 10) || 15)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px]">{locale === 'fr' ? 'Cycles / jour :' : 'Cycles / day:'}</label>
            <input
              type="number"
              step={0.1}
              min={0.5}
              max={3}
              value={bessCyclesPerDay}
              onChange={(e) => setBessCyclesPerDay(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-neutral-300 flex justify-between">
            <span>{locale === 'fr' ? 'SOH fin de vie (EOL) :' : 'End-of-Life SOH:'}</span>
            <span className="text-amber-300 font-bold">{Math.round(bessEolSoh * 100)} %</span>
          </label>
          <input
            type="range"
            min={0.65}
            max={0.90}
            step={0.05}
            value={bessEolSoh}
            onChange={(e) => setBessEolSoh(parseFloat(e.target.value))}
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
              <span>{locale === 'fr' ? 'Éditer Note de Calcul BESS' : 'Generate BESS Sizing Sheet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
