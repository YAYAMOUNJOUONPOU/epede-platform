// src/components/production/modules/GeneratorPqCapabilityCurveSimulator.tsx
// EPEDE D01 - Interactive Generator P-Q Capability Curve & Operational Limits Simulator (IEC 60034-1)

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
  Maximize2,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface GeneratorPqCapabilityCurveSimulatorProps {
  locale: 'fr' | 'en';
  ratedMva?: number;
  ratedPowerFactor?: number;
  voltageKv?: number;
}

export const GeneratorPqCapabilityCurveSimulator: React.FC<GeneratorPqCapabilityCurveSimulatorProps> = ({
  locale,
  ratedMva = 70.0, // Nachtigal generator unit: ~66.7 MVA (60 MW @ cos phi = 0.90)
  ratedPowerFactor = 0.90,
  voltageKv = 15.0
}) => {
  // Operating Point Inputs
  const [activePowerP, setActivePowerP] = useState<number>(55.0); // MW
  const [reactivePowerQ, setReactivePowerQ] = useState<number>(15.0); // Mvar (+ = lagging / overexcited, - = leading / underexcited)
  const [shortCircuitRatioScr, setShortCircuitRatioScr] = useState<number>(1.10); // SCR typically 1.0 - 1.2 for hydro

  // Maximum thermal ratings
  const sNom = ratedMva;
  const pNom = sNom * ratedPowerFactor;
  const qOverMax = Math.sqrt(Math.max(0, Math.pow(sNom, 2) - Math.pow(pNom, 2)));

  // Operating Point Metrics
  const metrics = useMemo(() => {
    const sCurrent = Math.sqrt(Math.pow(activePowerP, 2) + Math.pow(reactivePowerQ, 2));
    const powerFactor = sCurrent > 0 ? Number((activePowerP / sCurrent).toFixed(3)) : 1.0;
    const isOverexcited = reactivePowerQ >= 0;

    // Stator thermal limit check: S <= S_nom
    const isStatorOverloaded = sCurrent > sNom * 1.02;

    // Rotor field heating limit (Overexcited region):
    // Simplified rotor limit circle centered at (0, -V^2/Xd) with radius proportional to If_max
    // For normalized display: max Q allowable at current P
    const rotorQLimit = Math.sqrt(Math.max(0, Math.pow(sNom * 1.15, 2) - Math.pow(activePowerP + 5, 2)));
    const isRotorOverheated = reactivePowerQ > rotorQLimit;

    // Underexcited stability limit (Practical steady-state stability limit with 10% margin)
    // P_limit(Q) based on synchronous reactance Xd ~ 1 / SCR
    const xdPu = 1 / shortCircuitRatioScr;
    const stabilityQLimit = - (0.5 * (1 / xdPu) * sNom) + (activePowerP * 0.25);
    const isStabilityViolated = reactivePowerQ < stabilityQLimit;

    // Stator end-region core heating limit (leads to eddy current hotspot in teeth ends during underexcitation)
    const endCoreQLimit = - (0.35 * sNom);
    const isEndCoreOverheated = reactivePowerQ < endCoreQLimit && activePowerP > pNom * 0.6;

    const isOperatingSafe = !isStatorOverloaded && !isRotorOverheated && !isStabilityViolated && !isEndCoreOverheated;

    // Stator current: I = S / (sqrt(3) * U)
    const currentAmps = Math.round((sCurrent * 1e6) / (Math.sqrt(3) * voltageKv * 1e3));

    return {
      sCurrent: Number(sCurrent.toFixed(1)),
      powerFactor,
      isOverexcited,
      isStatorOverloaded,
      isRotorOverheated,
      isStabilityViolated,
      isEndCoreOverheated,
      isOperatingSafe,
      currentAmps
    };
  }, [activePowerP, reactivePowerQ, sNom, pNom, shortCircuitRatioScr, voltageKv]);

  // SVG Chart Dimensions (ViewBox: 0 0 520 420)
  // Center (P=0, Q=0) at SVG coordinate (260, 360)
  // P positive points UP (-Y), Q positive (lagging) points RIGHT (+X), Q negative (leading) points LEFT (-X)
  const scale = 2.8; // pixels per MW/Mvar
  const originX = 260;
  const originY = 360;

  // Convert (Q, P) in MW/Mvar to SVG (x, y)
  const toSvgX = (q: number) => originX + q * scale;
  const toSvgY = (p: number) => originY - p * scale;

  // Stator Current Limit Arc: S = sNom (Circle radius = sNom * scale)
  const statorRadiusPx = sNom * scale;

  // Active Operating Point in SVG
  const opX = toSvgX(reactivePowerQ);
  const opY = toSvgY(activePowerP);

  return (
    <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-5 font-mono text-xs shadow-xl">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            {locale === 'fr'
              ? 'Diagramme de Capabilité P-Q de l’Alternateur Synchrone (CEI 60034-1)'
              : 'Synchronous Generator P-Q Capability Curve Simulator (IEC 60034-1)'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 text-[11px] ${
            metrics.isOperatingSafe
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {metrics.isOperatingSafe ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Point d’Opération SÉCURISÉ' : 'SAFE Operating Point'}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Limite de Capabilité VIOLÉE' : 'CAPABILITY LIMIT VIOLATED'}</span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG P-Q Graphical Chart */}
        <div className="lg:col-span-7 bg-[#0E141F] rounded-2xl border border-[#222B38] p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-[#222B38]">
            <span className="flex items-center gap-1 text-sky-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Plan de Puissance Active P / Réactive Q' : 'Active P / Reactive Q Power Plane'}</span>
            </span>
            <span className="text-[10px] text-slate-500">Sn = {sNom} MVA • Un = {voltageKv} kV</span>
          </div>

          <svg viewBox="0 0 520 420" className="w-full max-h-[380px] select-none">
            <defs>
              {/* Gradients */}
              <radialGradient id="safeZoneGrad" cx="50%" cy="85%" r="60%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
              </radialGradient>
              <linearGradient id="opLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[-60, -40, -20, 0, 20, 40, 60].map((q) => (
              <line
                key={`grid-q-${q}`}
                x1={toSvgX(q)}
                y1={40}
                x2={toSvgX(q)}
                y2={390}
                stroke="#1B2533"
                strokeWidth={q === 0 ? 1.5 : 0.8}
                strokeDasharray={q === 0 ? 'none' : '3 3'}
              />
            ))}
            {[0, 20, 40, 60, 80].map((p) => (
              <line
                key={`grid-p-${p}`}
                x1={60}
                y1={toSvgY(p)}
                x2={460}
                y2={toSvgY(p)}
                stroke="#1B2533"
                strokeWidth={p === 0 ? 1.5 : 0.8}
                strokeDasharray={p === 0 ? 'none' : '3 3'}
              />
            ))}

            {/* Axes */}
            <line x1={originX} y1={390} x2={originX} y2={30} stroke="#64748B" strokeWidth="1.5" />
            <line x1={40} y1={originY} x2={480} y2={originY} stroke="#64748B" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x={originX + 8} y={45} fill="#38BDF8" fontSize="10" fontWeight="bold">
              + P (MW) Active
            </text>
            <text x={425} y={originY - 8} fill="#F59E0B" fontSize="10" fontWeight="bold">
              + Q (Mvar) Surenroulé
            </text>
            <text x={45} y={originY - 8} fill="#94A3B8" fontSize="10">
              - Q (Sous-excité)
            </text>

            {/* Safe Operational Capability Region Polygon */}
            {/* 1. Prime Mover (Turbine) Max P line: P = pNom */}
            <line
              x1={toSvgX(-35)}
              y1={toSvgY(pNom)}
              x2={toSvgX(qOverMax)}
              y2={toSvgY(pNom)}
              stroke="#E11D48"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x={toSvgX(qOverMax) - 60} y={toSvgY(pNom) - 6} fill="#E11D48" fontSize="9">
              Limite Turbine (MW max)
            </text>

            {/* 2. Stator Armature Thermal Arc: S = S_nom */}
            <path
              d={`M ${toSvgX(-sNom * 0.7)} ${toSvgY(sNom * 0.71)} A ${statorRadiusPx} ${statorRadiusPx} 0 0 1 ${toSvgX(sNom * 0.7)} ${toSvgY(sNom * 0.71)}`}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <text x={toSvgX(sNom * 0.55)} y={toSvgY(sNom * 0.65)} fill="#38BDF8" fontSize="9">
              Limite Statorique S_nom
            </text>

            {/* 3. Underexcited Steady-State Stability Margin Curve */}
            <path
              d={`M ${toSvgX(-45)} ${originY} Q ${toSvgX(-35)} ${toSvgY(30)} ${toSvgX(-15)} ${toSvgY(pNom)}`}
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text x={toSvgX(-52)} y={toSvgY(25)} fill="#EC4899" fontSize="8">
              Marge Stabilité (10%)
            </text>

            {/* Operating Vector from (0,0) to (Q, P) */}
            <line
              x1={originX}
              y1={originY}
              x2={opX}
              y2={opY}
              stroke="url(#opLineGrad)"
              strokeWidth="2.5"
            />

            {/* Operating Point Indicator */}
            <circle
              cx={opX}
              cy={opY}
              r="7"
              fill={metrics.isOperatingSafe ? '#10B981' : '#EF4444'}
              stroke="#FFFFFF"
              strokeWidth="2"
              className="animate-pulse"
            />

            {/* Coordinates Tooltip on Chart */}
            <g transform={`translate(${opX + 10}, ${opY - 10})`}>
              <rect width="90" height="32" rx="6" fill="#090D14" stroke="#222B38" />
              <text x="8" y="14" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                P: {activePowerP} MW
              </text>
              <text x="8" y="26" fill={reactivePowerQ >= 0 ? '#F59E0B' : '#94A3B8'} fontSize="9">
                Q: {reactivePowerQ} Mvar
              </text>
            </g>
          </svg>
        </div>

        {/* Operating Controls & Diagnostic Analysis */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sliders Box */}
          <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3.5">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Consignes de Conduite Groupe' : 'Unit Operating Setpoints'}</span>
            </span>

            {/* Active Power P Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>{locale === 'fr' ? 'Puissance Active P :' : 'Active Power P:'}</span>
                <span className="text-white font-bold">{activePowerP} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.round(sNom * 1.05)}
                step="1"
                value={activePowerP}
                onChange={(e) => setActivePowerP(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 MW</span>
                <span>P_nom = {Math.round(pNom)} MW</span>
              </div>
            </div>

            {/* Reactive Power Q Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>{locale === 'fr' ? 'Puissance Réactive Q :' : 'Reactive Power Q:'}</span>
                <span className={`font-bold ${reactivePowerQ >= 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {reactivePowerQ > 0 ? `+${reactivePowerQ}` : reactivePowerQ} Mvar ({reactivePowerQ >= 0 ? 'Surenroulé' : 'Sous-excité'})
                </span>
              </div>
              <input
                type="range"
                min={- Math.round(sNom * 0.6)}
                max={Math.round(sNom * 0.7)}
                step="1"
                value={reactivePowerQ}
                onChange={(e) => setReactivePowerQ(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>- {Math.round(sNom * 0.6)} Mvar (Capacitif)</span>
                <span>+ {Math.round(sNom * 0.7)} Mvar (Inductif)</span>
              </div>
            </div>

            {/* SCR Adjustment Slider */}
            <div className="space-y-1 pt-1 border-t border-[#222B38]">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>{locale === 'fr' ? 'Rapport Court-Circuit (SCR) :' : 'Short-Circuit Ratio (SCR):'}</span>
                <span className="text-emerald-400 font-bold">{shortCircuitRatioScr}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={shortCircuitRatioScr}
                onChange={(e) => setShortCircuitRatioScr(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {locale === 'fr' ? 'Roue à pôles saillants typique : SCR = 1.0 à 1.3' : 'Salient pole rotor standard: SCR = 1.0 to 1.3'}
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38]">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Facteur de Puissance' : 'Power Factor cos φ'}</div>
              <div className="text-base font-bold text-white">{metrics.powerFactor}</div>
              <div className="text-[10px] text-slate-400">
                {metrics.isOverexcited ? 'Arrière (Inductif)' : 'Avant (Capacitif)'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38]">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Apparente S' : 'Apparent Power S'}</div>
              <div className={`text-base font-bold ${metrics.isStatorOverloaded ? 'text-rose-400' : 'text-sky-400'}`}>
                {metrics.sCurrent} MVA
              </div>
              <div className="text-[10px] text-slate-400">
                Charge : {Math.round((metrics.sCurrent / sNom) * 100)}% de Sn
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38]">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Courant Statorique' : 'Stator Current'}</div>
              <div className="text-base font-bold text-amber-400">{metrics.currentAmps.toLocaleString()} A</div>
              <div className="text-[10px] text-slate-400">@ Un = {voltageKv} kV</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38]">
              <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Régime Excitation' : 'Excitation Mode'}</div>
              <div className="text-base font-bold text-emerald-400">
                {reactivePowerQ >= 0 ? 'Surenroulement' : 'Sous-excitation'}
              </div>
              <div className="text-[10px] text-slate-400">
                {reactivePowerQ >= 0 ? 'Soutien tension réseau' : 'Absorption réactif'}
              </div>
            </div>
          </div>

          {/* Safety Violations Alerts */}
          {!metrics.isOperatingSafe && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1 text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{locale === 'fr' ? 'Alerte Dépassement Capabilité :' : 'Capability Exceeded Warning:'}</span>
              </div>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-rose-300/90">
                {metrics.isStatorOverloaded && (
                  <li>{locale === 'fr' ? 'Échauffement thermique bobinage statorique (S > Snom).' : 'Stator winding thermal overheating (S > Snom).'}</li>
                )}
                {metrics.isRotorOverheated && (
                  <li>{locale === 'fr' ? 'Courant d’excitation If excessif : risque de brûlure des pôles rotoriques.' : 'Excessive field current If: rotor pole thermal breakdown risk.'}</li>
                )}
                {metrics.isStabilityViolated && (
                  <li>{locale === 'fr' ? 'Risque de décrochage synchrone (perte de synchronisme réseau ANSI 78).' : 'Risk of loss of grid synchronism / pole slip (ANSI 78).'}</li>
                )}
                {metrics.isEndCoreOverheated && (
                  <li>{locale === 'fr' ? 'Courants de Foucault destructeurs dans les dents d’extrémité stator.' : 'Destructive eddy current heating in stator end-core laminations.'}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
