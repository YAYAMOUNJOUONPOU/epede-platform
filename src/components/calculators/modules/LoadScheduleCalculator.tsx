// src/components/calculators/modules/LoadScheduleCalculator.tsx
// EPEDE Layer 02 (Engineering Calculations) - Comprehensive Load Schedule & Power Balance
// Governing Standards: NF C 14-100 / NF C 15-100 / IEC 60364-5-52 / UTE C 15-105

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Cpu, Zap, CheckCircle2, ShieldCheck, Download, Sliders } from 'lucide-react';

interface LoadItem {
  id: string;
  name: string;
  category: 'moteur' | 'eclairage' | 'hvac' | 'informatique' | 'divers';
  ratedKw: number;
  qty: number;
  cosPhi: number;
  ku: number; // Utilization factor
  ks: number; // Coincidence factor
}

interface LoadScheduleCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: Record<string, any>;
  injectedContextInfo?: {
    equipmentName?: string;
    equipmentTag?: string;
  };
  onParamsChange?: (params: Record<string, any>) => void;
}

export const LoadScheduleCalculator: React.FC<LoadScheduleCalculatorProps> = ({
  locale,
  initialParams,
  injectedContextInfo,
  onParamsChange,
}) => {
  const [voltageV, setVoltageV] = useState<number>(initialParams?.voltageV || 400);
  const [globalDiversityFactor, setGlobalDiversityFactor] = useState<number>(initialParams?.diversityFactor || 0.90);
  const [expansionMarginPercent, setExpansionMarginPercent] = useState<number>(20);

  const [loads, setLoads] = useState<LoadItem[]>([
    { id: '1', name: 'Groupes Froids & CTA (HVAC)', category: 'hvac', ratedKw: 75, qty: 2, cosPhi: 0.85, ku: 0.80, ks: 0.85 },
    { id: '2', name: 'Pompes de Process (Moteurs)', category: 'moteur', ratedKw: 37, qty: 3, cosPhi: 0.84, ku: 0.85, ks: 0.70 },
    { id: '3', name: 'Éclairage Général LED & Balisage', category: 'eclairage', ratedKw: 22, qty: 1, cosPhi: 0.95, ku: 1.00, ks: 0.90 },
    { id: '4', name: 'Salle Serveurs & IT Ondulé', category: 'informatique', ratedKw: 30, qty: 1, cosPhi: 0.98, ku: 0.90, ks: 1.00 },
    { id: '5', name: 'Compresseurs d\'Air Comprimé', category: 'moteur', ratedKw: 45, qty: 1, cosPhi: 0.86, ku: 0.75, ks: 0.80 },
    { id: '6', name: 'Prises de Courant Ateliers', category: 'divers', ratedKw: 25, qty: 1, cosPhi: 0.80, ku: 0.50, ks: 0.60 },
  ]);

  // Compute load schedule aggregates
  const computedRows = loads.map((l) => {
    const installedKw = l.ratedKw * l.qty;
    const absorbedKw = installedKw * l.ku * l.ks;
    const tanPhi = Math.tan(Math.acos(Math.min(1, Math.max(0, l.cosPhi))));
    const absorbedKvar = absorbedKw * tanPhi;
    const apparentKva = Math.sqrt(absorbedKw * absorbedKw + absorbedKvar * absorbedKvar);
    return {
      ...l,
      installedKw,
      absorbedKw,
      absorbedKvar,
      apparentKva,
    };
  });

  const totalInstalledKw = computedRows.reduce((acc, r) => acc + r.installedKw, 0);
  const rawAbsorbedKw = computedRows.reduce((acc, r) => acc + r.absorbedKw, 0);
  const rawAbsorbedKvar = computedRows.reduce((acc, r) => acc + r.absorbedKvar, 0);

  // Apply global diversity factor
  const totalActiveKw = rawAbsorbedKw * globalDiversityFactor;
  const totalReactiveKvar = rawAbsorbedKvar * globalDiversityFactor;
  const totalApparentKva = Math.sqrt(totalActiveKw * totalActiveKw + totalReactiveKvar * totalReactiveKvar);
  const globalCosPhi = totalActiveKw / (totalApparentKva || 1);
  const totalIbCurrentA = (totalApparentKva * 1000) / (Math.sqrt(3) * voltageV);

  // Standard transformer sizing (with expansion margin)
  const requiredTrafoKva = totalApparentKva * (1 + expansionMarginPercent / 100);
  const STANDARD_TRAFO_SIZES = [100, 160, 250, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
  const recommendedTrafoKva = STANDARD_TRAFO_SIZES.find((s) => s >= requiredTrafoKva) || 3150;
  const trafoLoadingPercent = (totalApparentKva / recommendedTrafoKva) * 100;

  // Standby generator sizing (typically requires 1.25x load + step-load reserve)
  const recommendedGensetKva = STANDARD_TRAFO_SIZES.find((s) => s >= totalApparentKva * 1.30) || 3150;

  // Emit params for sync
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange({
        voltageV,
        totalActiveKw,
        totalReactiveKvar,
        totalApparentKva,
        globalCosPhi,
        diversityFactor: globalDiversityFactor,
        trafoKva: recommendedTrafoKva,
      });
    }
  }, [voltageV, totalActiveKw, totalReactiveKvar, totalApparentKva, globalCosPhi, globalDiversityFactor, recommendedTrafoKva, onParamsChange]);

  const handleAddRow = () => {
    const newId = (loads.length + 1).toString();
    setLoads([
      ...loads,
      {
        id: newId,
        name: locale === 'fr' ? `Nouveau Départ Circuit ${newId}` : `New Feeder Circuit ${newId}`,
        category: 'divers',
        ratedKw: 15,
        qty: 1,
        cosPhi: 0.85,
        ku: 0.80,
        ks: 0.80,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (loads.length <= 1) return;
    setLoads(loads.filter((l) => l.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof LoadItem, val: any) => {
    setLoads(loads.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  return (
    <div className="space-y-6">
      {injectedContextInfo && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {locale === 'fr' ? 'Nœud Réseau :' : 'Grid Node:'} <strong>{injectedContextInfo.equipmentName}</strong>
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">NF C 15-100</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-black text-white">
              {locale === 'fr' ? 'Bilan de Puissance, Foisonnement & Dimensionnement Source' : 'Load Schedule, Power Balance & Source Sizing'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {locale === 'fr'
                ? 'Conforme NF C 14-100, NF C 15-100 & CEI 60364-5-52. Calcul des puissances appelées avec facteurs ku et ks.'
                : 'Compliant with NF C 14-100, NF C 15-100 & IEC 60364-5-52. Computes coincident demand with ku and ks.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Ajouter Circuit' : 'Add Feeder'}</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Voltage & Global Diversity */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            {locale === 'fr' ? 'Tension assignée du tableau (Un)' : 'Switchboard Nominal Voltage (Un)'}
          </label>
          <select
            value={voltageV}
            onChange={(e) => setVoltageV(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:border-emerald-500"
          >
            <option value={400}>400 V (Triphasé Basse Tension)</option>
            <option value={230}>230 V (Monophasé)</option>
            <option value={690}>690 V (Industrie Lourde / Mine)</option>
            <option value={15000}>15 kV (HTA Moyenne Tension)</option>
            <option value={30000}>30 kV (HTA Réseau SONATREL/Eneo)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            {locale === 'fr' ? 'Facteur de foisonnement global (ks)' : 'Global Coincidence Factor (ks)'} : <strong>{globalDiversityFactor}</strong>
          </label>
          <input
            type="range"
            min={0.5}
            max={1.0}
            step={0.05}
            value={globalDiversityFactor}
            onChange={(e) => setGlobalDiversityFactor(Number(e.target.value))}
            className="w-full accent-emerald-500 mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            {locale === 'fr' ? 'Marge d\'extension future (%)' : 'Future Expansion Margin (%)'} : <strong>{expansionMarginPercent}%</strong>
          </label>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={expansionMarginPercent}
            onChange={(e) => setExpansionMarginPercent(Number(e.target.value))}
            className="w-full accent-sky-500 mt-2"
          />
        </div>
      </div>

      {/* Interactive Load Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">{locale === 'fr' ? 'Désignation Circuit' : 'Feeder Description'}</th>
              <th className="py-3 px-2 text-right">Pn (kW)</th>
              <th className="py-3 px-2 text-center">{locale === 'fr' ? 'Qté' : 'Qty'}</th>
              <th className="py-3 px-2 text-right">cos φ</th>
              <th className="py-3 px-2 text-right">ku</th>
              <th className="py-3 px-2 text-right">ks</th>
              <th className="py-3 px-3 text-right text-emerald-400 font-bold">{locale === 'fr' ? 'P appelée (kW)' : 'Demand P (kW)'}</th>
              <th className="py-3 px-3 text-right text-sky-400 font-bold">{locale === 'fr' ? 'S appelée (kVA)' : 'Demand S (kVA)'}</th>
              <th className="py-3 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {computedRows.map((r, index) => (
              <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 px-3 text-slate-500">{index + 1}</td>
                <td className="py-2.5 px-3 min-w-[200px]">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => handleUpdateRow(r.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:border-emerald-500 focus:outline-hidden"
                  />
                </td>
                <td className="py-2.5 px-2 text-right w-20">
                  <input
                    type="number"
                    min={0.1}
                    max={5000}
                    step={1}
                    value={r.ratedKw}
                    onChange={(e) => handleUpdateRow(r.id, 'ratedKw', Math.max(0.1, Number(e.target.value)))}
                    className="w-full text-right px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </td>
                <td className="py-2.5 px-2 text-center w-16">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={r.qty}
                    onChange={(e) => handleUpdateRow(r.id, 'qty', Math.max(1, Number(e.target.value)))}
                    className="w-full text-center px-1 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </td>
                <td className="py-2.5 px-2 text-right w-20">
                  <input
                    type="number"
                    min={0.5}
                    max={1.0}
                    step={0.01}
                    value={r.cosPhi}
                    onChange={(e) => handleUpdateRow(r.id, 'cosPhi', Math.min(1, Math.max(0.5, Number(e.target.value))))}
                    className="w-full text-right px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </td>
                <td className="py-2.5 px-2 text-right w-18">
                  <input
                    type="number"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={r.ku}
                    onChange={(e) => handleUpdateRow(r.id, 'ku', Math.min(1, Math.max(0.1, Number(e.target.value))))}
                    className="w-full text-right px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </td>
                <td className="py-2.5 px-2 text-right w-18">
                  <input
                    type="number"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={r.ks}
                    onChange={(e) => handleUpdateRow(r.id, 'ks', Math.min(1, Math.max(0.1, Number(e.target.value))))}
                    className="w-full text-right px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                  {r.absorbedKw.toFixed(1)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-sky-400">
                  {r.apparentKva.toFixed(1)}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(r.id)}
                    disabled={loads.length <= 1}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                    title={locale === 'fr' ? 'Supprimer ce départ' : 'Delete feeder'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary KPI Cards & Sizing Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            {locale === 'fr' ? 'Puissance Installée Totale' : 'Total Installed Power'}
          </span>
          <div className="text-2xl font-mono font-black text-white mt-1">
            {totalInstalledKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 block mt-1">
            {loads.length} {locale === 'fr' ? 'circuits départs' : 'feeder circuits'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            {locale === 'fr' ? 'Puissance Active Foisonnée (P)' : 'Coincident Active Power (P)'}
          </span>
          <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
            {totalActiveKw.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 block mt-1">
            Q = {totalReactiveKvar.toFixed(1)} kvar
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            {locale === 'fr' ? 'Puissance Apparente Totale (S)' : 'Total Apparent Power (S)'}
          </span>
          <div className="text-2xl font-mono font-black text-sky-400 mt-1">
            {totalApparentKva.toFixed(1)} <span className="text-xs font-normal text-slate-400">kVA</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 block mt-1">
            cos φ global = {globalCosPhi.toFixed(2)} · Ib = {totalIbCurrentA.toFixed(0)} A
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/30">
          <span className="text-[10px] font-mono uppercase text-indigo-300 block font-bold">
            {locale === 'fr' ? 'Transformateur Recommandé' : 'Recommended Transformer'}
          </span>
          <div className="text-2xl font-mono font-black text-amber-400 mt-1">
            {recommendedTrafoKva} <span className="text-xs font-bold text-slate-300">kVA</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
            <span>{locale === 'fr' ? 'Taux de charge :' : 'Loading :'}</span>
            <span className="font-bold text-emerald-400">{trafoLoadingPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white font-mono uppercase">
            {locale === 'fr' ? 'Synthèse de Dimensionnement Source' : 'Source Sizing Synthesis'}
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {locale === 'fr'
              ? `Le transformateur normalisé de ${recommendedTrafoKva} kVA (ou groupe électrogène secouru de ${recommendedGensetKva} kVA) alimente l'ensemble des ${loads.length} départs sous un courant nominal d'emploi Ib de ${totalIbCurrentA.toFixed(1)} A. Avec un taux de charge de ${trafoLoadingPercent.toFixed(1)}%, la marge d'extension disponible est de ${(100 - trafoLoadingPercent).toFixed(1)}%, assurant une longévité thermique optimale selon CEI 60076.`
              : `Standard ${recommendedTrafoKva} kVA transformer (or ${recommendedGensetKva} kVA standby generator) supplies all ${loads.length} feeders under rated current Ib of ${totalIbCurrentA.toFixed(1)} A. Operating at ${trafoLoadingPercent.toFixed(1)}% loading preserves ${(100 - trafoLoadingPercent).toFixed(1)}% expansion headroom per IEC 60076.`}
          </p>
        </div>
      </div>
    </div>
  );
};
