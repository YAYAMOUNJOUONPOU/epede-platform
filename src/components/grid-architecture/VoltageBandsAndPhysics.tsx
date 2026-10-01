// src/components/grid-architecture/VoltageBandsAndPhysics.tsx
// EPEDE - Voltage Bands Definition, Grid Code Hierarchy & Transformation Physics

import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  Calculator, 
  TrendingDown, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { VOLTAGE_BANDS_DATA } from './data/voltageBandsData';
import { VoltageBandInfo } from './types';

interface VoltageBandsAndPhysicsProps {
  locale: 'fr' | 'en';
}

export const VoltageBandsAndPhysics: React.FC<VoltageBandsAndPhysicsProps> = ({ locale }) => {
  const [selectedBandId, setSelectedBandId] = useState<'EHV' | 'HV' | 'MV' | 'LV'>('EHV');

  // Physics calculation interactive parameters
  const [transmittedPowerMw, setTransmittedPowerMw] = useState<number>(300); // 300 MW
  const [lineResistanceOhm, setLineResistanceOhm] = useState<number>(8.0); // 8 ohms (e.g. 100 km of 225 kV conductor)
  const [powerFactor, setPowerFactor] = useState<number>(0.92);

  const activeBand = VOLTAGE_BANDS_DATA.find(b => b.band === selectedBandId) || VOLTAGE_BANDS_DATA[0];

  // Helper calculation function: I = P / (sqrt(3) * U * cosPhi), Ploss = 3 * R * I^2
  const calculateMetricsForVoltage = (voltageKv: number) => {
    const pWatts = transmittedPowerMw * 1e6;
    const uVolts = voltageKv * 1e3;
    const currentA = pWatts / (Math.sqrt(3) * uVolts * powerFactor);
    const lossWatts = 3 * lineResistanceOhm * Math.pow(currentA, 2);
    const lossMw = lossWatts / 1e6;
    const lossPct = (lossMw / transmittedPowerMw) * 100;

    return {
      currentA: Math.round(currentA),
      lossMw: lossMw < 1000 ? lossMw.toFixed(2) : Math.round(lossMw),
      lossPct: lossPct < 100 ? lossPct.toFixed(1) : '>100%'
    };
  };

  const comp11kV = calculateMetricsForVoltage(11);
  const comp30kV = calculateMetricsForVoltage(30);
  const comp90kV = calculateMetricsForVoltage(90);
  const comp225kV = calculateMetricsForVoltage(225);
  const comp400kV = calculateMetricsForVoltage(400);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            PHYSIQUE DE LA TRANSFORMATION & PALIERS DE TENSION
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {locale === 'fr' ? 'Lois Fondamentales & Pourquoi Nous Élevons la Tension' : 'Governing Laws & Why Power Systems Step-Up Voltage'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          {locale === 'fr' 
            ? 'Niveaux de Tension Normalisés, Paliers de Réseau & Équations de Pertes' 
            : 'Standardized Voltage Bands, Grid Hierarchy & Transmission Loss Physics'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
          {locale === 'fr'
            ? 'Les niveaux de tension et leurs classifications (THT, HT, MT, BT) varient selon les pays, les exploitants et les codes de réseau (ex: CEI 60038 vs IEEE 141). Voici les paliers de référence rigoureusement documentés selon les normes CEI et le Code de Réseau du Cameroun (SONATREL).'
            : 'Voltage levels and classifications vary by country and utility practice (e.g. IEC 60038 vs ANSI/IEEE C84.1). Below are the verified representative bands benchmarked against international IEC standards and the Cameroon SONATREL Grid Code.'}
        </p>
      </div>

      {/* Interactive Physics Calculator: P = sqrt(3)*U*I*cosPhi & Ploss = 3*R*I^2 */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252E38] pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-white">
              {locale === 'fr' ? 'Démonstrateur Physique : Pourquoi Élever la Tension ?' : 'Physics Demonstrator: Why Step Up Voltage?'}
            </h3>
          </div>
          <span className="text-xs font-mono text-sky-300/80 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
            Formules CEI : P = √3·U·I·cosφ · Pertes = 3·R·I²
          </span>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#161B22] p-4 rounded-xl border border-[#252E38]">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
              {locale === 'fr' ? 'Puissance Active à Transiter (P) :' : 'Active Power Transit (P):'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={transmittedPowerMw}
                onChange={(e) => setTransmittedPowerMw(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="font-mono text-xs font-bold text-sky-400 shrink-0 w-16 text-right">
                {transmittedPowerMw} MW
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ex: Nachtigal (420 MW)</span>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
              {locale === 'fr' ? 'Résistance Totale de Ligne (R) :' : 'Total Feeder Resistance (R):'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={lineResistanceOhm}
                onChange={(e) => setLineResistanceOhm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="font-mono text-xs font-bold text-sky-400 shrink-0 w-16 text-right">
                {lineResistanceOhm} Ω
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ex: ~100 km de terne Almelec</span>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
              {locale === 'fr' ? 'Facteur de Puissance (cos φ) :' : 'Power Factor (cos φ):'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.80"
                max="1.00"
                step="0.02"
                value={powerFactor}
                onChange={(e) => setPowerFactor(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="font-mono text-xs font-bold text-sky-400 shrink-0 w-16 text-right">
                {powerFactor.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Seuil contractuel ≥ 0.90</span>
          </div>
        </div>

        {/* Dynamic Voltage Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-[#252E38]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#252E38] bg-[#161B22] text-slate-300">
                <th className="py-3 px-3">{locale === 'fr' ? 'Tension de Transit (U)' : 'Operating Voltage (U)'}</th>
                <th className="py-3 px-3">{locale === 'fr' ? 'Palier Typique' : 'Grid Band'}</th>
                <th className="py-3 px-3">{locale === 'fr' ? 'Courant par Phase (I)' : 'Phase Current (I)'}</th>
                <th className="py-3 px-3">{locale === 'fr' ? 'Pertes Joule (3·R·I²)' : 'Joule Losses (3·R·I²)'}</th>
                <th className="py-3 px-3">{locale === 'fr' ? '% de Pertes' : 'Loss Percentage'}</th>
                <th className="py-3 px-3">{locale === 'fr' ? 'Faisabilité Industrielle' : 'Technical Feasibility'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252E38] bg-[#0D1117]">
              {/* 11 kV */}
              <tr className="hover:bg-red-950/20 text-red-200 bg-red-950/10">
                <td className="py-3 px-3 font-bold text-white">11 kV</td>
                <td className="py-3 px-3 text-slate-400">Sortie Alternateur</td>
                <td className="py-3 px-3 font-bold text-red-400">{comp11kV.currentA.toLocaleString()} A</td>
                <td className="py-3 px-3 font-bold text-red-400">{comp11kV.lossMw} MW</td>
                <td className="py-3 px-3 text-red-400 font-bold">{comp11kV.lossPct}%</td>
                <td className="py-3 px-3 text-red-300 font-sans">
                  ❌ Impossible sur 100 km (conducteurs fondraient instantanément)
                </td>
              </tr>

              {/* 30 kV */}
              <tr className="hover:bg-amber-950/20 text-amber-200 bg-amber-950/10">
                <td className="py-3 px-3 font-bold text-white">30 kV</td>
                <td className="py-3 px-3 text-slate-400">Moyenne Tension (MT)</td>
                <td className="py-3 px-3 font-bold text-amber-400">{comp30kV.currentA.toLocaleString()} A</td>
                <td className="py-3 px-3 font-bold text-amber-400">{comp30kV.lossMw} MW</td>
                <td className="py-3 px-3 text-amber-400 font-bold">{comp30kV.lossPct}%</td>
                <td className="py-3 px-3 text-amber-300 font-sans">
                  ⚠️ Inadapté au transport massif de {transmittedPowerMw} MW
                </td>
              </tr>

              {/* 90 kV */}
              <tr className="hover:bg-slate-800/40 text-slate-300">
                <td className="py-3 px-3 font-bold text-white">90 kV</td>
                <td className="py-3 px-3 text-slate-400">Haute Tension (HTB-1)</td>
                <td className="py-3 px-3 font-bold text-sky-400">{comp90kV.currentA.toLocaleString()} A</td>
                <td className="py-3 px-3 font-bold text-sky-400">{comp90kV.lossMw} MW</td>
                <td className="py-3 px-3 text-sky-400 font-bold">{comp90kV.lossPct}%</td>
                <td className="py-3 px-3 text-slate-400 font-sans">
                  Acceptable sur moyenne distance (30-60 km)
                </td>
              </tr>

              {/* 225 kV */}
              <tr className="hover:bg-emerald-950/30 text-emerald-200 bg-emerald-950/20">
                <td className="py-3 px-3 font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>225 kV</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">RÉF CAMEROUN</span>
                </td>
                <td className="py-3 px-3 text-emerald-400 font-bold">Très Haute Tension (THT)</td>
                <td className="py-3 px-3 font-bold text-emerald-400">{comp225kV.currentA.toLocaleString()} A</td>
                <td className="py-3 px-3 font-bold text-emerald-400">{comp225kV.lossMw} MW</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">{comp225kV.lossPct}%</td>
                <td className="py-3 px-3 text-emerald-300 font-sans font-bold">
                  ✓ Standard optimal : pertes réduites à un niveau économique
                </td>
              </tr>

              {/* 400 kV */}
              <tr className="hover:bg-slate-800/40 text-slate-300">
                <td className="py-3 px-3 font-bold text-white">400 kV</td>
                <td className="py-3 px-3 text-slate-400">Ultra Haute Tension (THT-2)</td>
                <td className="py-3 px-3 font-bold text-indigo-400">{comp400kV.currentA.toLocaleString()} A</td>
                <td className="py-3 px-3 font-bold text-indigo-400">{comp400kV.lossMw} MW</td>
                <td className="py-3 px-3 text-indigo-400 font-bold">{comp400kV.lossPct}%</td>
                <td className="py-3 px-3 text-slate-400 font-sans">
                  Optimal pour interconnexions transcontinentales &gt; 500 km
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Voltage Bands Selector & Detailed Matrix */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252E38] pb-3">
          <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wide">
            {locale === 'fr' ? 'Explorer les 4 Paliers Réglementaires & Techniques' : 'Explore the 4 Standard Voltage Tiers'}
          </span>

          <div className="flex rounded-xl border border-[#252E38] bg-[#161B22] p-1 text-xs font-mono">
            {VOLTAGE_BANDS_DATA.map(b => (
              <button
                key={b.band}
                type="button"
                onClick={() => setSelectedBandId(b.band)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedBandId === b.band
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b.band}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Voltage Band Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {activeBand.band}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {activeBand.nominalRange}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {activeBand.name[locale]}
              </h3>
            </div>

            <div className="p-4 bg-[#161B22] rounded-xl border border-[#252E38] text-xs text-slate-300 leading-relaxed">
              <span className="font-bold block text-white mb-1 font-mono">
                {locale === 'fr' ? 'Pourquoi ce niveau de tension est utilisé :' : 'Why this voltage tier is selected:'}
              </span>
              {activeBand.whyUsed[locale]}
            </div>

            <div className="p-4 bg-[#161B22] rounded-xl border border-sky-500/30 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold block text-sky-300 mb-1 font-mono">
                {locale === 'fr' ? 'Philosophie de Protection Sélective :' : 'Selective Protection Philosophy:'}
              </span>
              {activeBand.protectionPhilosophy[locale]}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#161B22]">
                <span className="font-mono font-bold text-emerald-400 block mb-1">
                  ✓ {locale === 'fr' ? 'Avantages Majeurs' : 'Major Advantages'}
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {activeBand.advantages[locale].map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-[#161B22]">
                <span className="font-mono font-bold text-amber-400 block mb-1">
                  ⚠️ {locale === 'fr' ? 'Contraintes & Limites' : 'Constraints & Limitations'}
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {activeBand.limitations[locale].map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Electrical Properties Box */}
            <div className="bg-[#161B22] border border-[#252E38] rounded-xl p-4 text-xs font-mono space-y-3">
              <span className="font-bold text-slate-300 block uppercase">
                {locale === 'fr' ? 'Paramètres d\'Isolement & Régime de Neutre' : 'Insulation & Earthing Metrics'}
              </span>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                  <span className="text-slate-400 block text-[10px]">
                    {locale === 'fr' ? 'Distances d\'isolement dans l\'air :' : 'Air clearance distances:'}
                  </span>
                  <span className="font-bold text-white text-sm">{activeBand.insulationDistanceAir}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                  <span className="text-slate-400 block text-[10px]">
                    {locale === 'fr' ? 'Régime de neutre typique :' : 'Typical earthing method:'}
                  </span>
                  <span className="text-slate-300 font-sans">{activeBand.typicalEarthing[locale]}</span>
                </div>
              </div>
            </div>

            {/* Cameroon Grid Code Standards */}
            <div className="bg-[#161B22] border border-[#252E38] rounded-xl p-4 text-xs space-y-2">
              <span className="font-mono font-bold text-slate-300 block uppercase">
                {locale === 'fr' ? 'Tensions Normalisées au Cameroun (SONATREL / Eneo)' : 'Standard Voltages in Cameroon'}
              </span>
              <div className="space-y-1.5 font-mono">
                {activeBand.cameroonGridLevels.map((lvl, i) => (
                  <div key={i} className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300">
                    {lvl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
