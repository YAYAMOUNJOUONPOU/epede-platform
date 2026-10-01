// src/components/simulation/modules/LiveOscilloscopePanel.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Sliders, 
  Camera, 
  Download, 
  Maximize2, 
  RotateCcw,
  Zap,
  Gauge,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export interface LiveOscilloscopeProps {
  locale: 'fr' | 'en';
  faultMode?: 'NONE' | '3PH_FAULT' | '1PH_EARTH' | 'INRUSH_HARMONIC';
  initialFrequency?: number;
  initialIkKa?: number;
  initialKappa?: number;
  compact?: boolean;
}

export const LiveOscilloscopePanel: React.FC<LiveOscilloscopeProps> = ({
  locale,
  faultMode: initialFaultMode = 'NONE',
  initialFrequency = 50,
  initialIkKa = 12.5,
  initialKappa = 1.8,
  compact = false
}) => {
  const isFr = locale === 'fr';

  // Interactive controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [faultType, setFaultType] = useState<'NONE' | '3PH_FAULT' | '1PH_EARTH' | 'INRUSH_HARMONIC'>(initialFaultMode);
  const [freq, setFreq] = useState<number>(initialFrequency);
  const [timeDiv, setTimeDiv] = useState<number>(5); // ms per division
  const [voltsDiv, setVoltsDiv] = useState<number>(100); // V/div or kA/div
  const [showPhaseA, setShowPhaseA] = useState<boolean>(true);
  const [showPhaseB, setShowPhaseB] = useState<boolean>(true);
  const [showPhaseC, setShowPhaseC] = useState<boolean>(true);
  const [showNeutral, setShowNeutral] = useState<boolean>(true);
  const [triggerLevel, setTriggerLevel] = useState<number>(0);
  const [h3Percent, setH3Percent] = useState<number>(initialFaultMode === 'INRUSH_HARMONIC' ? 18 : 3);
  const [h5Percent, setH5Percent] = useState<number>(initialFaultMode === 'INRUSH_HARMONIC' ? 24 : 5);
  const [decayTauMs, setDecayTauMs] = useState<number>(45); // Subtransient DC decay time constant
  const [cursorPosMs, setCursorPosMs] = useState<number>(10);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Digital calculations
  const omega = 2 * Math.PI * freq;
  const thd = useMemo(() => {
    return Math.sqrt(h3Percent * h3Percent + h5Percent * h5Percent);
  }, [h3Percent, h5Percent]);

  // Peak and RMS metrics
  const vPeak = 400 * Math.sqrt(2) / Math.sqrt(3); // ~ 326.6 V
  const vRms = vPeak / Math.sqrt(2);
  const crestFactor = vPeak / (vRms || 1);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tOffset = 0;

    const render = () => {
      const parent = canvas.parentElement;
      const w = (canvas.width = parent?.clientWidth || (compact ? 500 : 780));
      const h = (canvas.height = compact ? 260 : 360);

      if (isRunning) {
        tOffset += (0.015 * freq) / 50;
      }

      // Background CRT aesthetic
      ctx.fillStyle = '#060A10';
      ctx.fillRect(0, 0, w, h);

      // Grid division
      const xDivs = 10;
      const yDivs = 8;
      const dx = w / xDivs;
      const dy = h / yDivs;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;

      // Sub-grid dots / fine grid
      for (let x = 0; x <= w; x += dx) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += dy) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshair axes
      const centerY = h / 2;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Trigger level line
      const trigY = centerY - (triggerLevel / 100) * (dy * 2);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, trigY);
      ctx.lineTo(w, trigY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trigger arrow marker
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.moveTo(4, trigY - 4);
      ctx.lineTo(12, trigY);
      ctx.lineTo(4, trigY + 4);
      ctx.fill();

      // Time scaling
      // Total visible window = 10 divs * timeDiv (ms)
      const totalTimeMs = xDivs * timeDiv;
      const msPerPx = totalTimeMs / w;
      const pxPerVolt = (dy * 3) / 400; // 3 divisions ~ 400V

      // Phase signals definitions
      const phases = [
        {
          name: 'L1',
          show: showPhaseA,
          color: '#F43F5E', // Rose / Red
          glow: 'rgba(244, 63, 94, 0.4)',
          phaseShift: 0,
          isFaulted: faultType === '3PH_FAULT' || faultType === '1PH_EARTH'
        },
        {
          name: 'L2',
          show: showPhaseB,
          color: '#10B981', // Emerald
          glow: 'rgba(16, 185, 129, 0.4)',
          phaseShift: (2 * Math.PI) / 3,
          isFaulted: faultType === '3PH_FAULT'
        },
        {
          name: 'L3',
          show: showPhaseC,
          color: '#06B6D4', // Cyan
          glow: 'rgba(6, 182, 212, 0.4)',
          phaseShift: (4 * Math.PI) / 3,
          isFaulted: faultType === '3PH_FAULT'
        }
      ];

      // Draw each phase waveform
      phases.forEach(phase => {
        if (!phase.show) return;

        ctx.strokeStyle = phase.color;
        ctx.shadowColor = phase.glow;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        for (let px = 0; px < w; px++) {
          const tMs = px * msPerPx;
          const tSec = (tMs / 1000) + tOffset;
          const angle = omega * tSec + phase.phaseShift;

          let val = Math.sin(angle);

          // Harmonics injection
          if (h3Percent > 0) {
            val += (h3Percent / 100) * Math.sin(3 * angle);
          }
          if (h5Percent > 0) {
            val += (h5Percent / 100) * Math.sin(5 * angle);
          }

          // Fault transient envelope (IEC 60909 subtransient DC decaying offset)
          if (phase.isFaulted && faultType !== 'NONE') {
            const faultTimeInWindowMs = (tMs % totalTimeMs);
            const dcOffset = Math.exp(-faultTimeInWindowMs / decayTauMs) * (initialKappa - 1) * 1.4;
            val = (val * (initialFaultMode === '3PH_FAULT' ? 2.5 : 2.0)) + dcOffset;
          }

          // Scale to voltage & pixels
          const instantVolts = val * vPeak;
          const py = centerY - instantVolts * pxPerVolt;

          if (px === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // Neutral / Earth Residual Current if 1PH_EARTH
      if (showNeutral && faultType === '1PH_EARTH') {
        ctx.strokeStyle = '#EAB308'; // Amber
        ctx.shadowColor = 'rgba(234, 179, 8, 0.5)';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let px = 0; px < w; px++) {
          const tMs = px * msPerPx;
          const tSec = (tMs / 1000) + tOffset;
          const angle = omega * tSec;
          // Homopolar zero-sequence sum 3*I0
          const i0 = Math.sin(angle) * 1.8 * Math.exp(-(tMs % totalTimeMs) / decayTauMs);
          const py = centerY - (i0 * vPeak * 0.7) * pxPerVolt;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // reset glow

      // Vertical measurement cursor
      const cursorPx = (cursorPosMs / totalTimeMs) * w;
      if (cursorPx >= 0 && cursorPx <= w) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(cursorPx, 0);
        ctx.lineTo(cursorPx, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cursor label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.fillText(`T=${cursorPosMs.toFixed(1)}ms`, cursorPx + 4, 14);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [
    isRunning,
    faultType,
    freq,
    timeDiv,
    voltsDiv,
    showPhaseA,
    showPhaseB,
    showPhaseC,
    showNeutral,
    triggerLevel,
    h3Percent,
    h5Percent,
    decayTauMs,
    cursorPosMs,
    compact,
    omega,
    vPeak,
    initialKappa,
    initialFaultMode
  ]);

  // Export Screenshot
  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `epede_oscilloscope_${Date.now()}.png`;
    a.click();
  };

  // Export CSV waveform samples
  const handleExportCsv = () => {
    let csv = 'Time_ms,Phase_A_V,Phase_B_V,Phase_C_V,Neutral_V\n';
    const totalMs = 10 * timeDiv;
    const stepMs = 0.2;
    for (let t = 0; t <= totalMs; t += stepMs) {
      const tSec = t / 1000;
      const vA = Math.sin(omega * tSec) * vPeak;
      const vB = Math.sin(omega * tSec + (2 * Math.PI) / 3) * vPeak;
      const vC = Math.sin(omega * tSec + (4 * Math.PI) / 3) * vPeak;
      const vN = vA + vB + vC;
      csv += `${t.toFixed(2)},${vA.toFixed(1)},${vB.toFixed(1)},${vC.toFixed(1)},${vN.toFixed(1)}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epede_waveform_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="bg-[#0A0E17] border border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 font-mono">
      {/* Scope Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className={`h-3 w-3 rounded-full inline-block ${isRunning ? 'bg-cyan-400 animate-ping opacity-75' : 'bg-red-400'}`} />
            <span className={`h-2.5 w-2.5 rounded-full absolute top-0.5 left-0.5 ${isRunning ? 'bg-cyan-400' : 'bg-red-400'}`} />
          </div>
          <div>
            <span className="font-bold text-slate-100 tracking-wider">
              {isFr ? 'OSCILLOSCOPE NUMÉRIQUE TEMPS-RÉEL' : 'REAL-TIME DIGITAL OSCILLOSCOPE'}
            </span>
            <span className="text-[10px] text-cyan-400/80 ml-2 hidden sm:inline">
              (CEI 60909 / CEI 61000-4-30 Class A)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* RUN / FREEZE Button */}
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all shadow-md ${
              isRunning
                ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
                : 'bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900'
            }`}
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isRunning ? (isFr ? 'GELER (HOLD)' : 'FREEZE') : (isFr ? 'RELANCER' : 'RESUME')}</span>
          </button>

          {/* Quick PNG Export */}
          <button
            type="button"
            onClick={handleExportPng}
            title={isFr ? 'Capturer l’oscillogramme en PNG' : 'Capture oscilloscope PNG'}
            className="p-1.5 bg-[#151D2A] border border-[#252E38] hover:border-cyan-500/50 rounded text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>

          {/* Export CSV Data */}
          <button
            type="button"
            onClick={handleExportCsv}
            title={isFr ? 'Exporter les points d’onde en CSV' : 'Export waveform points to CSV'}
            className="p-1.5 bg-[#151D2A] border border-[#252E38] hover:border-cyan-500/50 rounded text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Screen Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-900/40 bg-black shadow-inner">
        <canvas ref={canvasRef} className="w-full block" />

        {/* Real-time CRT HUD overlay */}
        <div className="absolute top-2 left-3 text-[10px] text-cyan-400/90 pointer-events-none space-y-0.5">
          <div>SCALE: {timeDiv} ms/div • {voltsDiv} V/div</div>
          <div>FREQ: {freq.toFixed(2)} Hz • THD: {thd.toFixed(2)}%</div>
          {faultType !== 'NONE' && (
            <div className="text-amber-400 font-bold animate-pulse">
              FAULT: {faultType} (τ_dc = {decayTauMs}ms)
            </div>
          )}
        </div>

        <div className="absolute top-2 right-3 text-[10px] text-slate-400 pointer-events-none text-right">
          <div>V_RMS: {vRms.toFixed(0)} V • V_PK: {vPeak.toFixed(0)} V</div>
          <div>CREST FACTOR: {crestFactor.toFixed(2)}</div>
        </div>
      </div>

      {/* Channel Toggles & Fault Injection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Phase Switches */}
        <div className="bg-[#111722] border border-[#1E293B] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{isFr ? 'VOIES ACTIVES' : 'CHANNELS'}:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPhaseA(!showPhaseA)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                showPhaseA ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}
            >
              L1
            </button>
            <button
              type="button"
              onClick={() => setShowPhaseB(!showPhaseB)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                showPhaseB ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}
            >
              L2
            </button>
            <button
              type="button"
              onClick={() => setShowPhaseC(!showPhaseC)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                showPhaseC ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}
            >
              L3
            </button>
            <button
              type="button"
              onClick={() => setShowNeutral(!showNeutral)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                showNeutral ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}
            >
              3I₀ / PE
            </button>
          </div>
        </div>

        {/* Transient Fault Injection Modes */}
        <div className="bg-[#111722] border border-[#1E293B] rounded-xl p-3 space-y-1.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{isFr ? 'RÉGIME TRANSITOIRE' : 'TRANSIENT REGIME'}:</span>
            <Zap className="h-3 w-3 text-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setFaultType('NONE')}
              className={`py-1 rounded border text-center font-bold ${
                faultType === 'NONE'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {isFr ? 'Nominal' : 'Normal'}
            </button>
            <button
              type="button"
              onClick={() => setFaultType('3PH_FAULT')}
              className={`py-1 rounded border text-center font-bold ${
                faultType === '3PH_FAULT'
                  ? 'bg-rose-950 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              Court-Circ 3~
            </button>
            <button
              type="button"
              onClick={() => setFaultType('1PH_EARTH')}
              className={`py-1 rounded border text-center font-bold ${
                faultType === '1PH_EARTH'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              Défaut Terre 1~
            </button>
            <button
              type="button"
              onClick={() => setFaultType('INRUSH_HARMONIC')}
              className={`py-1 rounded border text-center font-bold ${
                faultType === 'INRUSH_HARMONIC'
                  ? 'bg-purple-950 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              Enclenchement Trafo
            </button>
          </div>
        </div>

        {/* Timebase and Amplitude Controls */}
        <div className="bg-[#111722] border border-[#1E293B] rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Base Temps:</span>
            <span className="font-bold text-cyan-400">{timeDiv} ms/div</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={timeDiv}
            onChange={e => setTimeDiv(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />

          <div className="flex justify-between text-[11px] text-slate-300 pt-1">
            <span>Fréquence Réseau:</span>
            <span className="font-bold text-cyan-400">{freq} Hz</span>
          </div>
          <input
            type="range"
            min="45"
            max="65"
            step="0.5"
            value={freq}
            onChange={e => setFreq(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Subtransient DC & Harmonics Tuning */}
        <div className="bg-[#111722] border border-[#1E293B] rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Amortissement DC (τ):</span>
            <span className="font-bold text-amber-400">{decayTauMs} ms</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={decayTauMs}
            onChange={e => setDecayTauMs(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />

          <div className="flex justify-between text-[11px] text-slate-300 pt-1">
            <span>Curseur Mesure (T):</span>
            <span className="font-bold text-slate-200">{cursorPosMs.toFixed(1)} ms</span>
          </div>
          <input
            type="range"
            min="0"
            max={10 * timeDiv}
            step="0.5"
            value={cursorPosMs}
            onChange={e => setCursorPosMs(parseFloat(e.target.value))}
            className="w-full accent-white cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>
      </div>
    </div>
  );
};
