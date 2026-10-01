import React, { useState, useEffect, useRef } from 'react';
import { Sliders } from 'lucide-react';
import { LiveOscilloscopePanel } from './LiveOscilloscopePanel';

interface OscilloscopeTabProps {
  locale: 'fr' | 'en';
}

export const OscilloscopeTab: React.FC<OscilloscopeTabProps> = ({ locale }) => {
  const [freq, setFreq] = useState(50); // Hz
  const [timeDiv, setTimeDiv] = useState(5); // ms/div
  const [h3Amp, setH3Amp] = useState(4); // %
  const [h5Amp, setH5Amp] = useState(6); // %
  const [h7Amp, setH7Amp] = useState(2); // %
  const [isOscRun, setIsOscRun] = useState(true);

  // Canvas ref for oscilloscope
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute THD
  const thdPercent = Math.sqrt(h3Amp * h3Amp + h5Amp * h5Amp + h7Amp * h7Amp);
  const isThdCompliant = thdPercent < 8.0; // IEC 61000-2-4 Class 2 limit

  // Oscilloscope render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phaseOffset = 0;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 700);
      const h = (canvas.height = 340);

      if (isOscRun) {
        phaseOffset += 0.08;
      }

      // Draw dark background & grid
      ctx.fillStyle = '#080B10';
      ctx.fillRect(0, 0, w, h);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.lineWidth = 1;
      const xDivs = 10;
      const yDivs = 8;
      const dx = w / xDivs;
      const dy = h / yDivs;

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

      // Center baseline
      const centerY = h / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      // Phases to draw
      const phases = [
        { name: 'Phase A (L1)', color: '#EF4444', shift: 0 },
        { name: 'Phase B (L2)', color: '#10B981', shift: (2 * Math.PI) / 3 },
        { name: 'Phase C (L3)', color: '#38BDF8', shift: (4 * Math.PI) / 3 },
      ];

      const scaleY = (h / 2.6) / 1.4; // scale
      const omega = 2 * Math.PI * (freq / 50) * (5 / timeDiv) * 0.005;

      phases.forEach((p) => {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < w; x++) {
          const t = x * omega + phaseOffset + p.shift;
          // Fundamental + Harmonics
          let sample = Math.sin(t);
          // 3rd harmonic
          if (h3Amp > 0) sample += (h3Amp / 100) * Math.sin(3 * t);
          // 5th harmonic
          if (h5Amp > 0) sample += (h5Amp / 100) * Math.sin(5 * t);
          // 7th harmonic
          if (h7Amp > 0) sample += (h7Amp / 100) * Math.sin(7 * t);

          const y = centerY - sample * scaleY;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [freq, timeDiv, h3Amp, h5Amp, h7Amp, isOscRun]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Oscilloscope Screen using LiveOscilloscopePanel */}
      <div className="lg:col-span-2 space-y-4">
        <LiveOscilloscopePanel locale={locale} />
      </div>

      {/* Controls & FFT Spectrum Analysis */}
      <div className="space-y-4">
        {/* Real-time THD Metric Box */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'TAUX DE DISTORSION HARMONIQUE' : 'TOTAL HARMONIC DISTORTION'}</span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                isThdCompliant ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {isThdCompliant ? 'CONFORME CEI' : 'NON-CONFORME'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300">
              {thdPercent.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-neutral-400">% THD_V</span>
          </div>

          <div className="text-xs text-neutral-400 font-sans">
            {locale === 'fr'
              ? 'Seuil limite CEI 61000-2-4 / IEEE 519 : THD_V < 8.0 % pour réseaux industriels classe 2.'
              : 'IEC 61000-2-4 / IEEE 519 limit: THD_V < 8.0 % for industrial class 2 distribution.'}
          </div>

          {/* FFT Spectrum preview */}
          <div className="pt-2 border-t border-[#252E38] space-y-2">
            <div className="text-[10px] text-neutral-400 uppercase">Spectre Harmonique (FFT)</div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <div className="flex justify-between text-neutral-400">
                  <span>h1 (50 Hz Fondamental)</span>
                  <span className="font-bold text-cyan-300">100.0 %</span>
                </div>
                <div className="w-full bg-[#1A2029] h-2 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-cyan-400 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400">
                  <span>h3 (150 Hz Homopolaire)</span>
                  <span className="font-bold text-amber-400">{h3Amp.toFixed(1)} %</span>
                </div>
                <div className="w-full bg-[#1A2029] h-2 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full" style={{ width: `${Math.min(100, h3Amp * 4)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400">
                  <span>h5 (250 Hz Séquence Inverse)</span>
                  <span className="font-bold text-red-400">{h5Amp.toFixed(1)} %</span>
                </div>
                <div className="w-full bg-[#1A2029] h-2 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-red-400 h-full" style={{ width: `${Math.min(100, h5Amp * 4)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400">
                  <span>h7 (350 Hz Séquence Directe)</span>
                  <span className="font-bold text-sky-400">{h7Amp.toFixed(1)} %</span>
                </div>
                <div className="w-full bg-[#1A2029] h-2 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-sky-400 h-full" style={{ width: `${Math.min(100, h7Amp * 4)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders Console */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1.5 border-b border-[#252E38] pb-2">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>PARAMÈTRES D'INJECTION HARMONIQUE</span>
          </div>

          {/* Timebase */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Base de Temps:</span>
              <span className="font-bold text-cyan-300">{timeDiv} ms/div</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={timeDiv}
              onChange={(e) => setTimeDiv(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Fréquence Réseau:</span>
              <span className="font-bold text-cyan-300">{freq} Hz</span>
            </div>
            <input
              type="range"
              min="45"
              max="65"
              step="1"
              value={freq}
              onChange={(e) => setFreq(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Harmonic 3 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Harmonique 3 (h3):</span>
              <span className="font-bold text-amber-400">{h3Amp} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={h3Amp}
              onChange={(e) => setH3Amp(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Harmonic 5 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Harmonique 5 (h5):</span>
              <span className="font-bold text-red-400">{h5Amp} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={h5Amp}
              onChange={(e) => setH5Amp(parseInt(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* Harmonic 7 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300">
              <span>Harmonique 7 (h7):</span>
              <span className="font-bold text-sky-400">{h7Amp} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={h7Amp}
              onChange={(e) => setH7Amp(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
