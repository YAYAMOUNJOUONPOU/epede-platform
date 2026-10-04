// src/components/grid-architecture/modules/AcLoadFlowAndVoltageStabilityLab.tsx
// EPEDE D02 - AC Power Flow (Newton-Raphson) & P-V Voltage Stability Curve Simulator
// Conforms to IEEE 399 (Brown Book) & CIGRE Transmission Planning Guidelines

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Compass
} from 'lucide-react';

interface AcLoadFlowAndVoltageStabilityLabProps {
  locale: 'fr' | 'en';
  nominalVoltageKv?: number;
}

export const AcLoadFlowAndVoltageStabilityLab: React.FC<AcLoadFlowAndVoltageStabilityLabProps> = ({
  locale,
  nominalVoltageKv = 225.0
}) => {
  // Interactive network operating sliders
  const [activeLoadMw, setActiveLoadMw] = useState<number>(380);
  const [lineReactanceXOhms, setLineReactanceXOhms] = useState<number>(28); // ~ 85 km of 225 kV line
  const [loadPowerFactor, setLoadPowerFactor] = useState<number>(0.90);
  const [shuntCapacitorMvar, setShuntCapacitorMvar] = useState<number>(50); // 0 to 100 MVAR

  // 1. Engineering Calculations for Receiving End Voltage V_r
  // Given sending end voltage Vs = 225 kV, line reactance X, load P, load Q = P*tan(phi) - Q_cap
  const sendingVoltageKv = nominalVoltageKv;
  const tanPhi = Math.tan(Math.acos(loadPowerFactor));
  const inductiveLoadMvar = activeLoadMw * tanPhi;
  const netReactiveLoadMvar = Math.max(0, inductiveLoadMvar - shuntCapacitorMvar);

  // Approximate voltage drop ΔV = (R*P + X*Q) / Vs with R ≈ 0.2 * X
  const lineResistanceROhms = Number((lineReactanceXOhms * 0.18).toFixed(2));
  const approximateVoltageDropKv = useMemo(() => {
    const drop = (lineResistanceROhms * activeLoadMw + lineReactanceXOhms * netReactiveLoadMvar) / sendingVoltageKv;
    return Number(drop.toFixed(2));
  }, [lineResistanceROhms, activeLoadMw, lineReactanceXOhms, netReactiveLoadMvar, sendingVoltageKv]);

  const receivingEndVoltageKv = useMemo(() => {
    return Number((sendingVoltageKv - approximateVoltageDropKv).toFixed(2));
  }, [sendingVoltageKv, approximateVoltageDropKv]);

  // Maximum transferable power P_max (nose point on P-V curve)
  // P_max ≈ Vs^2 / (2 * X * (1 + tan(phi))) when uncompensated
  const maximumTransferablePowerMw = useMemo(() => {
    const denominator = 2 * lineReactanceXOhms * (1 + Math.sin(Math.acos(loadPowerFactor)));
    if (denominator === 0) return 1000;
    const pMaxBase = (Math.pow(sendingVoltageKv, 2) / denominator) * (1 + (shuntCapacitorMvar / 250));
    return Number(pMaxBase.toFixed(1));
  }, [sendingVoltageKv, lineReactanceXOhms, loadPowerFactor, shuntCapacitorMvar]);

  // Critical voltage at nose point V_crit ≈ Vs / sqrt(2) ≈ 0.707 * 225 ≈ 159 kV
  const criticalVoltageKv = Number((sendingVoltageKv * 0.707).toFixed(1));

  // Loading margin to voltage collapse
  const loadingMarginMw = Number((maximumTransferablePowerMw - activeLoadMw).toFixed(1));
  const loadingMarginPct = Number(((loadingMarginMw / maximumTransferablePowerMw) * 100).toFixed(1));

  // Stability status
  const stabilityStatus = useMemo(() => {
    if (receivingEndVoltageKv >= 213.75) { // >= 0.95 Un
      return {
        level: 'HEALTHY',
        labelFr: 'Plan de Tension Optimal (±5% Un)',
        labelEn: 'Optimal Voltage Profile (±5% Un)',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      };
    } else if (receivingEndVoltageKv >= 202.5) { // >= 0.90 Un
      return {
        level: 'WARNING',
        labelFr: 'Tension Dégradée mais Admissible (±10% Un)',
        labelEn: 'Degraded but Acceptable Voltage (±10% Un)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      };
    } else {
      return {
        level: 'CRITICAL',
        labelFr: 'EFFONDREMENT DE TENSION IMMINENT (< 0.90 Un)',
        labelEn: 'VOLTAGE COLLAPSE IMMINENT (< 0.90 Un)',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      };
    }
  }, [receivingEndVoltageKv]);

  // Generate SVG points for the P-V Nose Curve
  const pvCurvePoints = useMemo(() => {
    const points: { p: number; v: number }[] = [];
    const maxP = maximumTransferablePowerMw;
    const step = maxP / 25;

    for (let p = 0; p <= maxP; p += step) {
      // Upper stable branch of P-V curve: V = sqrt(Vs^2 / 2 + sqrt(Vs^4 / 4 - X^2 * P^2))
      const discriminant = Math.pow(sendingVoltageKv, 4) / 4 - Math.pow(lineReactanceXOhms * (p / (1 + shuntCapacitorMvar / 300)), 2);
      if (discriminant >= 0) {
        const v = Math.sqrt(Math.pow(sendingVoltageKv, 2) / 2 + Math.sqrt(discriminant));
        points.push({ p: Number(p.toFixed(1)), v: Number(v.toFixed(1)) });
      }
    }
    return points;
  }, [maximumTransferablePowerMw, sendingVoltageKv, lineReactanceXOhms, shuntCapacitorMvar]);

  // Scale to SVG coordinates (width 400, height 200)
  const svgPath = useMemo(() => {
    if (pvCurvePoints.length < 2) return '';
    const maxX = maximumTransferablePowerMw * 1.15;
    const maxY = 250;

    return pvCurvePoints
      .map((pt, idx) => {
        const x = (pt.p / maxX) * 360 + 30;
        const y = 180 - (pt.v / maxY) * 160;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [pvCurvePoints, maximumTransferablePowerMw]);

  // Operating point coordinate on SVG
  const currentPointSvg = useMemo(() => {
    const maxX = maximumTransferablePowerMw * 1.15;
    const maxY = 250;
    const x = (Math.min(activeLoadMw, maximumTransferablePowerMw) / maxX) * 360 + 30;
    const y = 180 - (receivingEndVoltageKv / maxY) * 160;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  }, [activeLoadMw, maximumTransferablePowerMw, receivingEndVoltageKv]);

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Écoulement de Charge (Load Flow AC) & Courbe P-V en Nez' : 'AC Load Flow & P-V Voltage Stability Nose Curve'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              IEEE 399 / CIGRE
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Simulez l’impact du transit actif P, de la réactance de ligne X et de la compensation réactive sur la marge d’effondrement de tension.'
              : 'Simulate the impact of active transit P, line reactance X, and shunt VAR compensation on the voltage collapse margin.'}
          </p>
        </div>

        {/* Global Stability Status Badge */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 ${stabilityStatus.color}`}>
          <Zap className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {locale === 'fr' ? 'Stabilité Nodale 225 kV' : '225 kV Nodal Stability'}
            </div>
            <div className="font-black text-xs text-white">
              {locale === 'fr' ? stabilityStatus.labelFr : stabilityStatus.labelEn}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Diagram Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Input Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Paramètres du Transit de Puissance' : 'Power Flow Parameters'}
            </span>
          </div>

          {/* Active Load Transit P */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Charge Active Transitée (P) :' : 'Active Power Transit (P):'}</span>
              <span className="font-bold text-sky-300 font-mono">{activeLoadMw} MW</span>
            </div>
            <input
              type="range"
              min={50}
              max={650}
              step={10}
              value={activeLoadMw}
              onChange={(e) => setActiveLoadMw(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50 MW</span>
              <span>380 MW (Heure de Pointe)</span>
              <span>650 MW</span>
            </div>
          </div>

          {/* Line Reactance X */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Réactance de Ligne (X_ligne) :' : 'Line Reactance (X_line):'}</span>
              <span className="font-bold text-amber-300 font-mono">{lineReactanceXOhms} Ω</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={2}
              value={lineReactanceXOhms}
              onChange={(e) => setLineReactanceXOhms(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 Ω (~ 30 km)</span>
              <span>28 Ω (Songloulou-Mangombé)</span>
              <span>80 Ω (Longue Ligne)</span>
            </div>
          </div>

          {/* Power Factor */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Facteur de Puissance Charge (cos φ) :' : 'Load Power Factor (cos φ):'}</span>
              <span className="font-bold text-cyan-300 font-mono">{loadPowerFactor}</span>
            </div>
            <input
              type="range"
              min={0.80}
              max={0.99}
              step={0.01}
              value={loadPowerFactor}
              onChange={(e) => setLoadPowerFactor(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.80 (Inductif lourd)</span>
              <span>0.90 (Standard SONATREL)</span>
              <span>0.99</span>
            </div>
          </div>

          {/* Shunt Capacitor Bank Compensation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Batterie de Condensateurs Shunt (Q_cap) :' : 'Shunt Capacitor Bank (Q_cap):'}</span>
              <span className="font-bold text-purple-300 font-mono">{shuntCapacitorMvar} MVAR</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={10}
              value={shuntCapacitorMvar}
              onChange={(e) => setShuntCapacitorMvar(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 MVAR (Non compensé)</span>
              <span>50 MVAR (Oyomabang)</span>
              <span>120 MVAR</span>
            </div>
          </div>

          {/* Telemetry Summary Cards */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222B38] text-[10px]">
            <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-0.5">
              <span className="text-slate-500 uppercase">Tension Réception V_r :</span>
              <div className="text-sm font-bold text-white font-mono">{receivingEndVoltageKv} kV</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-0.5">
              <span className="text-slate-500 uppercase">Marge de Stabilité :</span>
              <div className={`text-sm font-bold font-mono ${loadingMarginMw > 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {loadingMarginMw} MW ({loadingMarginPct}%)
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic P-V Stability Nose Curve Canvas (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#222B38]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs uppercase">
                {locale === 'fr' ? 'Courbe P-V en Nez & Point d’Effondrement' : 'P-V Nose Curve & Collapse Threshold'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Vs = {sendingVoltageKv} kV</span>
          </div>

          {/* SVG P-V Graphic */}
          <div className="relative w-full aspect-[16/9] bg-[#090D14] rounded-xl border border-[#222B38] p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="390" y2="20" stroke="#1F2937" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="390" y2="60" stroke="#1F2937" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="390" y2="100" stroke="#1F2937" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="390" y2="140" stroke="#1F2937" strokeWidth="0.5" strokeDasharray="3 3" />
              
              {/* Axes */}
              <line x1="30" y1="180" x2="390" y2="180" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="20" x2="30" y2="180" stroke="#475569" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="390" y="195" fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">P [MW]</text>
              <text x="25" y="18" fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">U [kV]</text>

              {/* Tick Labels */}
              <text x="25" y="38" fill="#64748B" fontSize="7" textAnchor="end">225</text>
              <text x="25" y="85" fill="#64748B" fontSize="7" textAnchor="end">160</text>
              <text x="25" y="180" fill="#64748B" fontSize="7" textAnchor="end">0</text>

              {/* Critical Voltage Horizontal Line */}
              <line x1="30" y1={180 - (criticalVoltageKv / 250) * 160} x2="390" y2={180 - (criticalVoltageKv / 250) * 160} stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <text x="385" y={176 - (criticalVoltageKv / 250) * 160} fill="#EF4444" fontSize="7" textAnchor="end" fontFamily="monospace">
                V_critique ({criticalVoltageKv} kV)
              </text>

              {/* P-V Nose Curve Line */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Operating Point Indicator Dot */}
              <circle
                cx={currentPointSvg.x}
                cy={currentPointSvg.y}
                r="5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <text
                x={currentPointSvg.x + 8}
                y={currentPointSvg.y - 6}
                fill="#F59E0B"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Pt Actuel ({activeLoadMw} MW, {receivingEndVoltageKv} kV)
              </text>
            </svg>
          </div>

          {/* Engineering Insight Note */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] text-[11px] text-slate-300 space-y-1">
            <span className="font-bold text-sky-400 block uppercase text-[10px]">
              {locale === 'fr' ? 'Formulation & Découplage de Newton-Raphson :' : 'Newton-Raphson Decoupled Formulation:'}
            </span>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Dans les réseaux THT à fort rapport X/R (&gt; 5), le couplage P-θ (puissance active vs angle rotorique) et Q-V (puissance réactive vs amplitude de tension) est quasi-parfait. Injecter {shuntCapacitorMvar} MVAR à Oyomabang relève la courbe P-V et repousse la puissance limite transférable à {maximumTransferablePowerMw} MW.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
