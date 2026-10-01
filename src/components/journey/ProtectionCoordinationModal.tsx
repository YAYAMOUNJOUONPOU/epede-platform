// src/components/journey/ProtectionCoordinationModal.tsx
// EPEDE - Interactive Protection Coordination & Time-Current Characteristic (TCC) Selectivity Lab
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Clock,
  Layers,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

interface ProtectionCoordinationModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment?: (equipmentId: string) => void;
}

export const ProtectionCoordinationModal: React.FC<ProtectionCoordinationModalProps> = ({
  locale,
  isOpen,
  onClose,
  onSelectEquipment,
}) => {
  // Fault simulation parameters
  const [faultCurrentA, setFaultCurrentA] = useState<number>(1800); // 10 A to 40 000 A
  const [mcbRating, setMcbRating] = useState<number>(16); // 10A, 16A, 32A
  const [tmsHta, setTmsHta] = useState<number>(0.15); // 0.05 to 0.5
  const [tmsHtb, setTmsHtb] = useState<number>(0.35); // 0.1 to 0.8
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // IEC 60255 Standard Inverse Curve formula:
  // t = TMS * [ 0.14 / ((I / Is)^0.02 - 1) ]
  // For HTA feeder: Is = 300 A referred to LV equivalent or primary
  // For comparison, let's normalize all currents referred to 400 V base or display real currents.
  // We plot in real secondary/primary scaled coordinates:
  
  // Calculate operating times for the given faultCurrentA:
  // 1. Domestic MCB (Curve C: thermal for 1.13-1.45 In, magnetic trip for 5-10 In = 5-10 * mcbRating)
  const mcbMagThreshold = mcbRating * 7;
  let tMcbSec = 999;
  if (faultCurrentA > mcbMagThreshold) {
    tMcbSec = 0.015; // 15 ms instantaneous magnetic trip
  } else if (faultCurrentA > mcbRating) {
    // Thermal curve approximation: t = 20 / (I/In - 1)^1.5
    const ratio = faultCurrentA / mcbRating;
    tMcbSec = Math.max(0.05, 20 / Math.pow(ratio - 1, 1.4));
  }

  // 2. MV Feeder 30 kV (ref: Is = 250 A. At 400V, 250A in 30kV is 250*(30000/400) = 18750 A. But let's evaluate on 30kV fault)
  // Let's assume fault current is specified at the 30 kV bus / feeder level:
  // Is_hta = 300 A
  const isHta = 300;
  let tHtaSec = 999;
  if (faultCurrentA > 3500) {
    tHtaSec = 0.08; // Definite time 50 instantaneous
  } else if (faultCurrentA > isHta) {
    const ratio = faultCurrentA / isHta;
    tHtaSec = tmsHta * (0.14 / (Math.pow(ratio, 0.02) - 1));
  }

  // 3. Substation Incomer / Transformer 225/30 kV (Is = 600 A)
  const isHtb = 600;
  let tHtbSec = 999;
  if (faultCurrentA > 7000) {
    tHtbSec = 0.28; // Definite time 50 stage
  } else if (faultCurrentA > isHtb) {
    const ratio = faultCurrentA / isHtb;
    tHtbSec = tmsHtb * (0.14 / (Math.pow(ratio, 0.02) - 1));
  }

  // Coordination grading margin between HTA and HTB:
  const gradingMarginMs = Math.round((tHtbSec - tHtaSec) * 1000);
  const isSelectivityGood = gradingMarginMs >= 200 && tHtaSec < tHtbSec;

  // Determine who trips first:
  let firstTripName = locale === 'fr' ? 'Aucun déclenchement (courant sous le seuil)' : 'No trip (sub-threshold)';
  let firstTripTime = 999;
  let tripColor = 'text-slate-500';

  if (faultCurrentA > isHtb && tHtbSec < firstTripTime) {
    firstTripTime = tHtbSec;
    firstTripName = locale === 'fr' ? 'Arrivée Transfo 225/30 kV (Relais 51)' : 'Substation Incomer (51)';
    tripColor = 'text-sky-700';
  }
  if (faultCurrentA > isHta && tHtaSec < firstTripTime) {
    firstTripTime = tHtaSec;
    firstTripName = locale === 'fr' ? 'Départ Ligne HTA 30 kV (Relais 50/51)' : '30 kV Feeder (50/51)';
    tripColor = 'text-amber-700';
  }
  if (faultCurrentA > mcbRating && tMcbSec < firstTripTime) {
    firstTripTime = tMcbSec;
    firstTripName = locale === 'fr' ? `Disjoncteur BT Domestique ${mcbRating}A (Courbe C)` : `Domestic MCB ${mcbRating}A`;
    tripColor = 'text-emerald-700';
  }

  // Log-Log coordinate conversion helper for SVG (X: 10 A to 50 000 A -> log10: 1 to 4.7, Y: 0.01 s to 100 s -> log10: -2 to 2)
  const svgW = 600;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;

  const logMinI = 1; // 10 A
  const logMaxI = 4.7; // 50 000 A
  const logMinT = -2; // 0.01 s
  const logMaxT = 2; // 100 s

  const xToSvg = (current: number) => {
    const logVal = Math.log10(Math.max(10, current));
    return padL + ((logVal - logMinI) / (logMaxI - logMinI)) * (svgW - padL - padR);
  };

  const yToSvg = (timeSec: number) => {
    const logVal = Math.log10(Math.min(100, Math.max(0.01, timeSec)));
    return padT + (1 - (logVal - logMinT) / (logMaxT - logMinT)) * (svgH - padT - padB);
  };

  // Generate SVG path for HTA curve
  const generateIecPath = (is: number, tms: number, instI: number, instT: number) => {
    const points: string[] = [];
    const stepCount = 50;
    for (let i = 0; i <= stepCount; i++) {
      const curr = is * 1.05 + ((instI - is * 1.05) * i) / stepCount;
      const ratio = curr / is;
      const t = tms * (0.14 / (Math.pow(ratio, 0.02) - 1));
      if (t <= 100 && t >= instT) {
        points.push(`${xToSvg(curr).toFixed(1)},${yToSvg(t).toFixed(1)}`);
      }
    }
    // Instantaneous horizontal line
    points.push(`${xToSvg(instI).toFixed(1)},${yToSvg(instT).toFixed(1)}`);
    points.push(`${xToSvg(40000).toFixed(1)},${yToSvg(instT).toFixed(1)}`);
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  };

  const pathHta = generateIecPath(isHta, tmsHta, 3500, 0.08);
  const pathHtb = generateIecPath(isHtb, tmsHtb, 7000, 0.28);

  const handleCopyReport = () => {
    const text = `=== EPEDE : RAPPORT DE COORDINATION & SÉLECTIVITÉ DES PROTECTIONS ===
Norme de référence : CEI 60255-151 / IEEE Std 242 (Buff Book)
Point de défaut simulé : If = ${faultCurrentA} A
1. Disjoncteur BT Maison ${mcbRating}A :
   - Temps de fonctionnement : ${(tMcbSec * 1000).toFixed(0)} ms
2. Relais Départ HTA 30 kV (Is = ${isHta} A, TMS = ${tmsHta}) :
   - Temps de fonctionnement : ${(tHtaSec * 1000).toFixed(0)} ms
3. Relais Arrivée Transfo 225/30 kV (Is = ${isHtb} A, TMS = ${tmsHtb}) :
   - Temps de fonctionnement : ${(tHtbSec * 1000).toFixed(0)} ms
Marge de sélectivité chronométrique : ${gradingMarginMs} ms (Requis: >= 200 ms)
Statut de coordination : ${isSelectivityGood ? 'SÉLECTIVITÉ TOTALE ASSURÉE' : 'ATTENTION : RISQUE DE DÉCLENCHEMENT INTEMPESTIF'}
Premier organe à ouvrir : ${firstTripName} (${(firstTripTime * 1000).toFixed(0)} ms)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'LABORATOIRE DE SÉLECTIVITÉ & PLAN DE PROTECTION' : 'PROTECTION COORDINATION & SELECTIVITY LAB'}</span>
                <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200 font-bold">
                  CEI 60255 / IEEE 242
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Courbes Temps-Courant (TCC) et échelonnement chronométrique amont / aval' 
                  : 'Time-Current Characteristic (TCC) curves & upstream/downstream selectivity'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Copier le rapport"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Bilan' : 'Copy Report')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Top Controls: Fault Current Injector and Relay Adjustments */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-600" />
                <span>{locale === 'fr' ? 'INJECTION DE COURANT DE DÉFAUT & RÉGLAGES DES RELAIS' : 'FAULT INJECTION & RELAY SETTINGS'}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Marge d'échelonnement requise : Δt ≥ 200 ms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Fault Current Slider */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Courant de Défaut (If)' : 'Fault Current (If)'}</span>
                  <span className="text-rose-600 font-bold">{faultCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="12000"
                  step="50"
                  value={faultCurrentA}
                  onChange={(e) => setFaultCurrentA(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>50 A (Maison)</span>
                  <span>3 kA (HTA)</span>
                  <span>12 kA (HTB)</span>
                </div>
              </div>

              {/* HTA Feeder TMS */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Relais HTA 30 kV (TMS)' : 'MV Relay (TMS)'}</span>
                  <span className="text-amber-700 font-bold">{tmsHta.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.01"
                  value={tmsHta}
                  onChange={(e) => setTmsHta(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Is = 300 A</span>
                  <span>CEI Normal Inverse</span>
                </div>
              </div>

              {/* HTB Incomer TMS */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{locale === 'fr' ? 'Relais Arrivée 225 kV (TMS)' : 'HV Relay (TMS)'}</span>
                  <span className="text-sky-700 font-bold">{tmsHtb.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.7"
                  step="0.02"
                  value={tmsHtb}
                  onChange={(e) => setTmsHtb(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Is = 600 A</span>
                  <span>CEI Normal Inverse</span>
                </div>
              </div>
            </div>
          </div>

          {/* Log-Log TCC Chart Visualizer */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-600" />
                <span>{locale === 'fr' ? 'COURBES TEMPS-COURANT (LOG-LOG TCC)' : 'TIME-CURRENT CHARACTERISTIC (TCC) GRAPH'}</span>
              </span>
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" /> Disjoncteur BT
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-600" /> Départ HTA 30 kV
                </span>
                <span className="flex items-center gap-1 text-sky-700">
                  <span className="h-2 w-2 rounded-full bg-sky-600" /> Arrivée 225 kV
                </span>
              </div>
            </div>

            {/* SVG Graph Area */}
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-64 bg-white rounded-lg border border-slate-200 shadow-inner">
                {/* Logarithmic Grid Lines (Currents: 10, 100, 1k, 10k A) */}
                {[10, 100, 1000, 10000].map((val) => {
                  const x = xToSvg(val);
                  return (
                    <g key={val}>
                      <line x1={x} y1={padT} x2={x} y2={svgH - padB} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
                      <text x={x} y={svgH - padB + 14} fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {val >= 1000 ? `${val / 1000} kA` : `${val} A`}
                      </text>
                    </g>
                  );
                })}

                {/* Logarithmic Grid Lines (Times: 0.01s, 0.1s, 1s, 10s, 100s) */}
                {[0.01, 0.1, 1, 10, 100].map((val) => {
                  const y = yToSvg(val);
                  return (
                    <g key={val}>
                      <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
                      <text x={padL - 8} y={y + 3} fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">
                        {val < 1 ? `${val * 1000} ms` : `${val} s`}
                      </text>
                    </g>
                  );
                })}

                {/* TCC Curves */}
                {/* 1. HTA 30 kV Curve */}
                <path d={pathHta} fill="none" stroke="#D97706" strokeWidth="2.5" />
                {/* 2. HTB 225 kV Curve */}
                <path d={pathHtb} fill="none" stroke="#0284C7" strokeWidth="2.5" />

                {/* Vertical Fault Current Cursor */}
                <line
                  x1={xToSvg(faultCurrentA)}
                  y1={padT}
                  x2={xToSvg(faultCurrentA)}
                  y2={svgH - padB}
                  stroke="#E11D48"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle
                  cx={xToSvg(faultCurrentA)}
                  cy={yToSvg(tHtaSec)}
                  r="4"
                  fill="#D97706"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx={xToSvg(faultCurrentA)}
                  cy={yToSvg(tHtbSec)}
                  r="4"
                  fill="#0284C7"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />

                {/* Labels */}
                <text x={svgW - padR - 10} y={yToSvg(0.08) - 6} fill="#B45309" fontSize="9" textAnchor="end" fontWeight="bold">
                  50 HTA (80 ms)
                </text>
                <text x={svgW - padR - 10} y={yToSvg(0.28) - 6} fill="#0369A1" fontSize="9" textAnchor="end" fontWeight="bold">
                  50 HTB (280 ms)
                </text>
              </svg>
            </div>
          </div>

          {/* Real-time Discrimination & Selectivity Analysis Result Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 Result: Operating Times */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <span className="text-slate-500 block text-[11px] uppercase font-bold">
                {locale === 'fr' ? 'TEMPS DE FONCTIONNEMENT CALCULÉS' : 'CALCULATED OPERATING TIMES'}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-emerald-700 font-medium">Disjoncteur BT :</span>
                  <span className="font-bold text-slate-900">{(tMcbSec * 1000).toFixed(0)} ms</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-amber-700 font-medium">Départ HTA 30 kV :</span>
                  <span className="font-bold text-slate-900">{(tHtaSec * 1000).toFixed(0)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700 font-medium">Arrivée Transfo 225 kV :</span>
                  <span className="font-bold text-slate-900">{(tHtbSec * 1000).toFixed(0)} ms</span>
                </div>
              </div>
            </div>

            {/* Step 2 Result: Selectivity Verdict */}
            <div className={`p-4 rounded-xl border ${isSelectivityGood ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'} space-y-2`}>
              <div className="flex items-center gap-2">
                {isSelectivityGood ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                )}
                <span className={`font-bold uppercase ${isSelectivityGood ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {isSelectivityGood 
                    ? (locale === 'fr' ? 'SÉLECTIVITÉ PARFAITE' : 'FULL SELECTIVITY') 
                    : (locale === 'fr' ? 'RISQUE DE DISJONCTION INTEMPESTIVE' : 'SELECTIVITY ISSUE')}
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Marge d'échelonnement : <span className="font-bold text-slate-900">{gradingMarginMs} ms</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                {isSelectivityGood
                  ? (locale === 'fr' 
                      ? 'L\'organe aval élimine le défaut bien avant que la protection amont n\'entame son temps d\'attente (marge > 200 ms respectée).' 
                      : 'Downstream breaker clears fault before upstream relay reaches trip threshold.')
                  : (locale === 'fr' 
                      ? 'L\'intervalle est trop court (< 200 ms). Risque de coupure générale sur le transformateur principal.' 
                      : 'Grading interval too narrow (< 200 ms). Risk of substation tripping.')}
              </p>
            </div>

            {/* Step 3 Result: First Interrupter */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <span className="text-slate-500 block text-[11px] uppercase font-bold">
                {locale === 'fr' ? 'PREMIER ORGANE QUI SÉPARE LE DÉFAUT' : 'PRIMARY CLEARING BREAKER'}
              </span>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
                <span className={`font-black text-sm ${tripColor}`}>
                  {firstTripName}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                {locale === 'fr' 
                  ? `Coupure en ${(firstTripTime * 1000).toFixed(0)} ms. Aucun client non concerné n'est privé de courant.`
                  : `Clearing in ${(firstTripTime * 1000).toFixed(0)} ms. Healthy consumers remain energized.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
