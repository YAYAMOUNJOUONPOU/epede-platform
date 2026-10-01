// src/components/simulation/modules/FerrantiLabTab.tsx
import React, { useState } from 'react';
import { Radio, AlertTriangle, CheckCircle2, ShieldCheck, Sliders, RotateCcw } from 'lucide-react';

interface FerrantiLabTabProps {
  locale: 'fr' | 'en';
}

export const FerrantiLabTab: React.FC<FerrantiLabTabProps> = ({ locale }) => {
  const [lineKv, setLineKv] = useState<number>(225); // 90, 225, 400 kV
  const [lineLengthKm, setLineLengthKm] = useState<number>(240); // 240 km (Songloulou - Yaoundé)
  const [lineInductanceMh, setLineInductanceMh] = useState<number>(1.05); // mH/km
  const [lineCapacitanceNf, setLineCapacitanceNf] = useState<number>(11.2); // nF/km
  const [shuntReactorMvar, setShuntReactorMvar] = useState<number>(25); // 25 Mvar at receiving end
  const [lineLoadMw, setLineLoadMw] = useState<number>(0); // 0 = No-load (Ferranti worst case)
  const [lineLoadPf] = useState<number>(0.95);

  const omega = 2 * Math.PI * 50;
  const lH = lineInductanceMh * 1e-3;
  const cF = lineCapacitanceNf * 1e-9;
  const betaRadPerKm = omega * Math.sqrt(lH * cF);
  const zcOhm = Math.sqrt(lH / cF);
  const silMw = Math.pow(lineKv, 2) / zcOhm;
  const qcMvar = (omega * cF * lineLengthKm * Math.pow(lineKv * 1e3, 2)) / 1e6;

  // Ferranti no-load receiving end voltage
  const betaL = betaRadPerKm * lineLengthKm;
  const uR0Kv = lineKv / Math.max(0.1, Math.cos(betaL));
  const deltaUR0Percent = ((uR0Kv - lineKv) / lineKv) * 100;

  // With load & shunt reactor compensation:
  const xlLine = omega * lH * lineLengthKm;
  const loadQReq = lineLoadMw > 0 ? lineLoadMw * Math.tan(Math.acos(lineLoadPf)) : 0;
  const netMvarGenerated = qcMvar - shuntReactorMvar - loadQReq;
  const deltaUCompKv = (netMvarGenerated * (xlLine / 2)) / lineKv;
  const uRCompKv = Math.max(0, lineKv + deltaUCompKv);
  const deltaUCompPercent = ((uRCompKv - lineKv) / lineKv) * 100;

  // IEC 60071 highest permissible continuous operating voltage Um
  const umKv = lineKv === 400 ? 420 : lineKv === 225 ? 245 : 100;
  const isFerrantiOvervoltage = uR0Kv > umKv;
  const isCompSafe = uRCompKv <= umKv && uRCompKv >= lineKv * 0.95;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Spatial Voltage Profile Canvas & Telemetry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-indigo-400 animate-pulse" />
                <span className="font-bold text-[#F3F4F6] uppercase">
                  {locale === 'fr' 
                    ? 'Profil Spatial de Tension V(x) le long de la Ligne de Transport'
                    : 'Spatial Voltage Profile V(x) along Transmission Line'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 font-bold">
                  {lineLengthKm} km · {lineKv} kV
                </span>
              </div>
            </div>

            {/* Vector SVG Spatial Line Chart */}
            <div className="w-full bg-[#080B10] rounded-xl border border-[#252E38] p-4 relative overflow-hidden">
              <svg viewBox="0 0 700 280" className="w-full h-64 select-none">
                {/* Background Grid */}
                {[50, 100, 150, 200, 250].map((y) => (
                  <line key={y} x1="60" y1={y} x2="680" y2={y} stroke="#1A2330" strokeDasharray="3 3" />
                ))}
                {[60, 215, 370, 525, 680].map((x) => (
                  <line key={x} x1={x} y1="30" x2={x} y2="250" stroke="#1A2330" strokeDasharray="3 3" />
                ))}

                {/* Axis labels */}
                <text x="60" y="270" fill="#6B7280" fontSize="10" fontFamily="monospace">x = 0 (Départ)</text>
                <text x="370" y="270" fill="#6B7280" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {Math.round(lineLengthKm / 2)} km
                </text>
                <text x="680" y="270" fill="#6B7280" fontSize="10" fontFamily="monospace" textAnchor="end">
                  x = {lineLengthKm} km (Arrivée)
                </text>

                {/* Voltage Scale Y-Axis */}
                <text x="50" y="45" fill="#EF4444" fontSize="9" fontFamily="monospace" textAnchor="end">1.15 p.u.</text>
                <text x="50" y="85" fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="end">{umKv} kV (Um)</text>
                <text x="50" y="154" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="end">{lineKv} kV (1.0)</text>
                <text x="50" y="220" fill="#6B7280" fontSize="9" fontFamily="monospace" textAnchor="end">0.90 p.u.</text>

                {/* Limit line: Um (Highest continuous system voltage) */}
                {(() => {
                  const umPu = umKv / lineKv;
                  const yUm = 150 - (umPu - 1.0) * 400;
                  return (
                    <g>
                      <line x1="60" y1={yUm} x2="680" y2={yUm} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 4" />
                      <text x="670" y={yUm - 4} fill="#EF4444" fontSize="9" fontFamily="monospace" textAnchor="end">
                        Seuil CEI 60071 Um ({umKv} kV)
                      </text>
                    </g>
                  );
                })()}

                {/* Nominal line (1.0 p.u. = lineKv) */}
                <line x1="60" y1="150" x2="680" y2="150" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />

                {/* Curve 1: Uncompensated Ferranti Profile */}
                {(() => {
                  const points: string[] = [];
                  for (let i = 0; i <= 20; i++) {
                    const frac = i / 20;
                    const xPx = 60 + frac * 620;
                    const vPu = 1.0 + ((uR0Kv / lineKv - 1.0) * (Math.pow(frac, 1.8)));
                    const yPx = 150 - (vPu - 1.0) * 400;
                    points.push(`${xPx.toFixed(1)},${yPx.toFixed(1)}`);
                  }
                  return (
                    <g>
                      <polyline
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        points={points.join(' ')}
                      />
                      <circle
                        cx="680"
                        cy={(150 - (uR0Kv / lineKv - 1.0) * 400).toFixed(1)}
                        r="4.5"
                        fill="#EF4444"
                      />
                    </g>
                  );
                })()}

                {/* Curve 2: Compensated Line Profile */}
                {(() => {
                  const pointsComp: string[] = [];
                  for (let i = 0; i <= 20; i++) {
                    const frac = i / 20;
                    const xPx = 60 + frac * 620;
                    const vPuComp = 1.0 + ((uRCompKv / lineKv - 1.0) * frac);
                    const yPx = 150 - (vPuComp - 1.0) * 400;
                    pointsComp.push(`${xPx.toFixed(1)},${yPx.toFixed(1)}`);
                  }
                  return (
                    <g>
                      <polyline
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="3"
                        points={pointsComp.join(' ')}
                      />
                      <circle
                        cx="680"
                        cy={(150 - (uRCompKv / lineKv - 1.0) * 400).toFixed(1)}
                        r="5"
                        fill="#38BDF8"
                      />
                    </g>
                  );
                })()}
              </svg>

              {/* Graph Legend */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-2 border-t border-[#252E38] text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#EF4444] rounded" />
                    <span className="text-neutral-300">À vide non compensé ({uR0Kv.toFixed(1)} kV)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#38BDF8] rounded" />
                    <span className="text-neutral-300">Compensé + Shunt ({uRCompKv.toFixed(1)} kV)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#10B981] border-b border-dashed border-[#10B981]" />
                    <span className="text-neutral-400">Tension nominale 1.0 p.u.</span>
                  </div>
                </div>
                <span className="text-neutral-400 text-[11px]">
                  {locale === 'fr' ? 'Échelle spatiale x = 0 à L' : 'Spatial scale x = 0 to L'}
                </span>
              </div>
            </div>

            {/* Key Telemetry Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Tension Arrivée Vide (UR0)</span>
                <div className={`text-lg font-bold mt-0.5 ${isFerrantiOvervoltage ? 'text-red-400' : 'text-amber-400'}`}>
                  {uR0Kv.toFixed(1)} kV
                </div>
                <span className="text-[10px] text-neutral-500">
                  +{deltaUR0Percent.toFixed(1)} % (Ferranti)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Tension avec Réactance</span>
                <div className={`text-lg font-bold mt-0.5 ${isCompSafe ? 'text-cyan-300' : 'text-red-400'}`}>
                  {uRCompKv.toFixed(1)} kV
                </div>
                <span className="text-[10px] text-neutral-500">
                  {deltaUCompPercent >= 0 ? '+' : ''}{deltaUCompPercent.toFixed(1)} % ({isCompSafe ? 'Sécurisé' : 'Hors Gabarit'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Production Ligne (Qc)</span>
                <div className="text-lg font-bold text-amber-300 mt-0.5">
                  {qcMvar.toFixed(1)} Mvar
                </div>
                <span className="text-[10px] text-neutral-500">
                  Charge capacitive naturelle
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Puissance Naturelle (SIL)</span>
                <div className="text-lg font-bold text-indigo-300 mt-0.5">
                  {silMw.toFixed(0)} MW
                </div>
                <span className="text-[10px] text-neutral-500">
                  Zc = {zcOhm.toFixed(0)} Ω
                </span>
              </div>
            </div>
          </div>

          {/* Engineering Standard & Real Cameroon Context Note */}
          <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase text-[11px]">
              <ShieldCheck className="h-4 w-4" />
              <span>Cas Réel Réseau SONATREL 225 kV & Recommandations CEI 60071</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Sur les liaisons 225 kV à longue distance au Cameroun (axe Songloulou - Mangombé - Ahala Yaoundé, env. 240 km),
              la mise sous tension à vide ou en période d'étiage sans compensation par inductance shunt
              provoque une surtension de Ferranti dépassant la tension maximale de service CEI 60071 (Um = 245 kV).
              L'installation de réactances shunt (20 à 30 Mvar) aux nœuds terminaux neutralise la composante capacitive
              et protège les transformateurs 225/30 kV contre la surfluxation diélectrique (V/f).
            </p>
          </div>
        </div>

        {/* Right Col: Parameter Controls & Slider Panel */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Paramètres Ligne & Réactance</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLineKv(225);
                setLineLengthKm(240);
                setShuntReactorMvar(25);
                setLineInductanceMh(1.05);
                setLineCapacitanceNf(11.2);
              }}
              className="p-1 rounded hover:bg-[#161C24] text-neutral-400 hover:text-white"
              title="Réinitialiser"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tension de la Ligne */}
          <div>
            <label className="text-[10px] text-neutral-400 uppercase font-bold flex justify-between">
              <span>Tension Assignée (kV)</span>
              <span className="text-cyan-300">{lineKv} kV (Um = {umKv} kV)</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[90, 225, 400].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setLineKv(v)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    lineKv === v
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-white'
                  }`}
                >
                  {v} kV
                </button>
              ))}
            </div>
          </div>

          {/* Longueur de la Ligne */}
          <div>
            <div className="flex justify-between text-[10px] text-neutral-400 uppercase font-bold mb-1">
              <span>Longueur de Ligne (L)</span>
              <span className="text-white font-bold">{lineLengthKm} km</span>
            </div>
            <input
              type="range"
              min="50"
              max="450"
              step="10"
              value={lineLengthKm}
              onChange={(e) => setLineLengthKm(parseInt(e.target.value) || 50)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
              <span>50 km</span>
              <span>Songloulou-Ahala (240 km)</span>
              <span>450 km</span>
            </div>
          </div>

          {/* Inductance Shunt de Compensation */}
          <div>
            <div className="flex justify-between text-[10px] text-neutral-400 uppercase font-bold mb-1">
              <span>Réactance Shunt Arrivée</span>
              <span className="text-cyan-300 font-bold">{shuntReactorMvar} Mvar</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={shuntReactorMvar}
              onChange={(e) => setShuntReactorMvar(parseInt(e.target.value) || 0)}
              className="w-full accent-indigo-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
              <span>0 Mvar (Non compensé)</span>
              <span>25 Mvar</span>
              <span>100 Mvar</span>
            </div>
          </div>

          {/* Charge Active en Ligne */}
          <div>
            <div className="flex justify-between text-[10px] text-neutral-400 uppercase font-bold mb-1">
              <span>Charge Active Transmise (P)</span>
              <span className="text-amber-300 font-bold">{lineLoadMw} MW</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={lineLoadMw}
              onChange={(e) => setLineLoadMw(parseInt(e.target.value) || 0)}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
              <span>0 MW (À vide / Ferranti)</span>
              <span>SIL ({silMw.toFixed(0)} MW)</span>
              <span>350 MW</span>
            </div>
          </div>

          {/* Paramètres Physiques Câble / Ligne */}
          <div className="border-t border-[#252E38] pt-3 space-y-2 text-[11px]">
            <span className="text-neutral-400 font-bold uppercase text-[10px] block">
              Constantes Linéiques (Aster / Almelec)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-500">l (mH/km) :</label>
                <input
                  type="number"
                  step="0.05"
                  value={lineInductanceMh}
                  onChange={(e) => setLineInductanceMh(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-500">c (nF/km) :</label>
                <input
                  type="number"
                  step="0.1"
                  value={lineCapacitanceNf}
                  onChange={(e) => setLineCapacitanceNf(parseFloat(e.target.value) || 10.0)}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Diagnostics & Warning Box */}
          <div className={`p-3 rounded-xl border text-xs leading-snug ${
            isFerrantiOvervoltage
              ? 'bg-red-950/40 border-red-800 text-red-200'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isFerrantiOvervoltage ? (
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              )}
              <span>
                {isFerrantiOvervoltage
                  ? 'DANGER : Surtension diélectrique à vide'
                  : 'Régime stabilisé conforme CEI 60071'}
              </span>
            </div>
            <p className="text-[11px]">
              {isFerrantiOvervoltage
                ? `La tension d'extrémité non compensée (${uR0Kv.toFixed(1)} kV) dépasse le maximum continu admissible Um (${umKv} kV). Réactance shunt obligatoire pour la mise sous tension.`
                : `Avec ${shuntReactorMvar} Mvar de compensation, la tension terminale (${uRCompKv.toFixed(1)} kV) reste dans le gabarit d'exploitation normal.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
