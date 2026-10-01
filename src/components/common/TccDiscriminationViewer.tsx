// src/components/common/TccDiscriminationViewer.tsx
// EPEDE Wave 2: Interactive SVG Log-Log Time-Current Characteristic (TCC) Discrimination Curve Chart
// Certifies protection selectivity across the canonical chain with dynamic grading margin (Delta t) evaluation.

import React, { useState } from 'react';
import {
  TccCoordinationEngine,
  TccCurveDefinition,
} from '../../data/tccCoordinationEngine';
import {
  Shield,
  Clock,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TccDiscriminationViewerProps {
  locale: 'fr' | 'en';
}

export const TccDiscriminationViewer: React.FC<TccDiscriminationViewerProps> = ({ locale }) => {
  const [testCurrentA, setTestCurrentA] = useState<number>(4500); // 4500 A referred to 400 V base
  const curves = TccCoordinationEngine.getCanonicalProtectionChain();

  // Reference currents for log grid: 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000 A
  const currentGrid = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  // Reference times for log grid: 0.01, 0.1, 1, 10, 100, 1000 s
  const timeGrid = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000];

  // Log-log coordinate mapping to SVG (width: 700, height: 420, margins: l:60, r:20, t:20, b:40)
  const xMin = Math.log10(100);
  const xMax = Math.log10(50000);
  const yMin = Math.log10(0.01);
  const yMax = Math.log10(1000);

  const mapX = (currentA: number) => {
    const val = Math.log10(Math.max(100, Math.min(50000, currentA)));
    return 60 + ((val - xMin) / (xMax - xMin)) * (700 - 80);
  };

  const mapY = (timeSec: number) => {
    const val = Math.log10(Math.max(0.01, Math.min(1000, timeSec)));
    return 380 - ((val - yMin) / (yMax - yMin)) * (380 - 20);
  };

  // Generate discrete currents to plot smooth curves
  const sampleCurrents: number[] = [];
  for (let i = 100; i <= 50000; i *= 1.08) {
    sampleCurrents.push(Math.round(i));
  }

  // Selectivity analysis at current test point
  const selectivity1 = TccCoordinationEngine.analyzeSelectivity(curves[1], curves[0], testCurrentA);
  const selectivity2 = TccCoordinationEngine.analyzeSelectivity(curves[2], curves[1], testCurrentA);
  const selectivity3 = TccCoordinationEngine.analyzeSelectivity(curves[3], curves[2], testCurrentA);

  const testX = mapX(testCurrentA);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {locale === 'fr'
                ? 'Plan de Coordination & Courbes Temps-Courant (TCC Log-Log)'
                : 'Protection Coordination & Time-Current Characteristic (TCC)'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {locale === 'fr'
                ? 'Discrimination chronométrique et ampèremétrique selon CEI 60255 (Base commune ramenée à 400 V BT)'
                : 'Time-current grading according to IEC 60255 (Referred to common 400 V LV base)'}
            </p>
          </div>
        </div>

        {/* Prospective Fault Current Slider */}
        <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-slate-300 font-medium">
            {locale === 'fr' ? 'Courant de Défaut Test :' : 'Test Fault Current:'}
          </span>
          <input
            type="range"
            min={500}
            max={25000}
            step={250}
            value={testCurrentA}
            onChange={(e) => setTestCurrentA(Number(e.target.value))}
            className="w-28 accent-blue-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-blue-400 font-mono min-w-[60px]">
            {testCurrentA} A
          </span>
        </div>
      </div>

      {/* SVG Log-Log Plot */}
      <div className="w-full overflow-x-auto bg-slate-950 rounded-xl border border-slate-800 p-2">
        <svg viewBox="0 0 700 420" className="w-full min-w-[600px] h-auto select-none">
          {/* Grid Background */}
          <rect x="60" y="20" width="620" height="360" fill="#0B0F19" stroke="#1E293B" strokeWidth="1" />

          {/* Vertical Log Grid Lines (Current) */}
          {currentGrid.map((i) => {
            const x = mapX(i);
            return (
              <g key={`x-${i}`}>
                <line x1={x} y1="20" x2={x} y2="380" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
                <text x={x} y="400" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                  {i >= 1000 ? `${i / 1000}k` : i}
                </text>
              </g>
            );
          })}
          <text x="370" y="415" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold">
            {locale === 'fr' ? 'Courant ramené à 400 V (Ampères, échelle log)' : 'Current referred to 400 V (Amperes, log scale)'}
          </text>

          {/* Horizontal Log Grid Lines (Time) */}
          {timeGrid.map((t) => {
            const y = mapY(t);
            const isMajor = t === 0.01 || t === 0.1 || t === 1 || t === 10 || t === 100 || t === 1000;
            return (
              <g key={`y-${t}`}>
                <line x1="60" y1={y} x2="680" y2={y} stroke={isMajor ? '#334155' : '#1E293B'} strokeWidth="1" strokeDasharray={isMajor ? undefined : '2 2'} />
                {isMajor && (
                  <text x="52" y={y + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                    {t >= 1 ? t : t}s
                  </text>
                )}
              </g>
            );
          })}
          <text x="25" y="200" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" transform="rotate(-90, 25, 200)">
            {locale === 'fr' ? 'Temps de Déclenchement (secondes, échelle log)' : 'Operating Time (seconds, log scale)'}
          </text>

          {/* Plot Each Protection Curve */}
          {curves.map((curve) => {
            const pts = TccCoordinationEngine.generateCurvePoints(curve, sampleCurrents);
            if (pts.length < 2) return null;

            const pathD = pts
              .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.currentA).toFixed(1)} ${mapY(p.timeSec).toFixed(1)}`)
              .join(' ');

            return (
              <g key={curve.id}>
                <path d={pathD} fill="none" stroke={curve.color} strokeWidth="3" strokeLinecap="round" />
              </g>
            );
          })}

          {/* Test Current Vertical Cursor */}
          <line x1={testX} y1="20" x2={testX} y2="380" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
          <text x={testX} y="15" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
            I_test = {testCurrentA} A
          </text>

          {/* Intersections and Tripping Times at Test Current */}
          {curves.map((curve) => {
            const pts = TccCoordinationEngine.generateCurvePoints(curve, [testCurrentA]);
            if (pts.length === 0) return null;
            const t = pts[0].timeSec;
            const cy = mapY(t);

            return (
              <g key={`pt-${curve.id}`}>
                <circle cx={testX} cy={cy} r="5" fill={curve.color} stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x={testX + 8} y={cy - 9} width="58" height="18" rx="3" fill="#0F172A" stroke={curve.color} strokeWidth="1" />
                <text x={testX + 12} y={cy + 4} fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {t < 1 ? `${(t * 1000).toFixed(0)} ms` : `${t.toFixed(2)} s`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Device Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {curves.map((c) => (
          <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5" style={{ color: c.color }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.deviceTag}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{c.curveFamily.toUpperCase()}</span>
            </div>
            <div className="text-slate-200 font-medium truncate">{c.name[locale]}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Seuil Ir : <strong className="text-slate-200">{c.pickupAmperes} A</strong>
              {c.tms !== undefined && ` • TMS : ${c.tms}`}
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Selectivity Grading Audit */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>{locale === 'fr' ? 'Certification des Marges Sélectives (Grading Margins Δt)' : 'Selectivity Grading Margin Certification'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Check 1: Motor vs LV ACB */}
          <div className={`p-3 rounded-lg border text-xs space-y-1 ${
            selectivity1.isSelective ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-amber-950/40 border-amber-800/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Moteur → ACB BT</span>
              <span className="font-mono text-emerald-400 font-bold">
                Δt = {(selectivity1.gradingMarginDeltaTSec * 1000).toFixed(0)} ms
              </span>
            </div>
            <p className="text-[11px] text-slate-300">{selectivity1.assessment[locale]}</p>
          </div>

          {/* Check 2: LV ACB vs Feeder 30 kV */}
          <div className={`p-3 rounded-lg border text-xs space-y-1 ${
            selectivity2.isSelective ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-red-950/40 border-red-800/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">ACB BT → Départ 30 kV</span>
              <span className="font-mono text-blue-400 font-bold">
                Δt = {(selectivity2.gradingMarginDeltaTSec * 1000).toFixed(0)} ms
              </span>
            </div>
            <p className="text-[11px] text-slate-300">{selectivity2.assessment[locale]}</p>
          </div>

          {/* Check 3: Feeder 30 kV vs Substation 225/30 kV */}
          <div className={`p-3 rounded-lg border text-xs space-y-1 ${
            selectivity3.isSelective ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-red-950/40 border-red-800/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Départ 30 kV → Incomer 225 kV</span>
              <span className="font-mono text-purple-400 font-bold">
                Δt = {(selectivity3.gradingMarginDeltaTSec * 1000).toFixed(0)} ms
              </span>
            </div>
            <p className="text-[11px] text-slate-300">{selectivity3.assessment[locale]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
