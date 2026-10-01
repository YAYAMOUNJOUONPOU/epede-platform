// src/components/journey/LightningSimulationModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  CloudLightning, 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  ShieldAlert, 
  Zap, 
  CheckCircle2,
  Activity
} from 'lucide-react';
import { LIGHTNING_SIMULATION_STEPS } from './data/ecosystemData';

interface LightningSimulationModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment: (equipmentId: string) => void;
}

export const LightningSimulationModal: React.FC<LightningSimulationModalProps> = ({
  locale,
  isOpen,
  onClose,
  onSelectEquipment,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = LIGHTNING_SIMULATION_STEPS[currentStepIdx];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= LIGHTNING_SIMULATION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, isOpen, currentStepIdx]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <CloudLightning className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'SIMULATION TRANSOIRE : IMPACT DE FOUDRE' : 'TRANSIENT SIMULATION : LIGHTNING STRIKE'}</span>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-bold">
                  IEC 60099 / IEEE 1243
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Décharge électrostatique atmosphérique et réponse coordonnée des protections (8 étapes)'
                  : 'Atmospheric electrostatic discharge and coordinated protection response (8 steps)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Animated SVG Simulation Stage */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
            <svg viewBox="0 0 800 240" className="w-full h-auto select-none">
              {/* Storm Cloud at Top */}
              <path
                d="M 280 40 Q 300 20, 330 25 Q 360 15, 390 30 Q 420 20, 450 35 Q 480 30, 490 50 Q 510 70, 480 80 L 300 80 Q 270 70, 280 40 Z"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="2"
              />
              <text x="360" y="55" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Nuage d'orage (-Q)
              </text>

              {/* Ground & Tower */}
              <line x1="0" y1="210" x2="800" y2="210" stroke="#94A3B8" strokeWidth="2" />
              
              {/* Tower Body */}
              <polygon points="400,90 380,210 420,210" fill="none" stroke="#64748B" strokeWidth="2" />
              {/* Tower Crossarms */}
              <line x1="360" y1="120" x2="440" y2="120" stroke="#64748B" strokeWidth="2.5" />
              {/* Conductors */}
              <line x1="50" y1="135" x2="750" y2="135" stroke="#4F46E5" strokeWidth="3" />
              {/* Shield Wire OPGW on top peak */}
              <line 
                x1="50" 
                y1="90" 
                x2="750" 
                y2="90" 
                stroke={step.stepNumber >= 2 ? "#D97706" : "#94A3B8"} 
                strokeWidth={step.stepNumber === 2 ? "3" : "1.5"} 
              />

              {/* Step 1 & 2: Lightning Bolt */}
              {step.stepNumber === 1 && (
                <path
                  d="M 390 70 L 398 90 L 392 105 L 400 120"
                  stroke="#D97706"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  fill="none"
                  className="animate-pulse"
                />
              )}

              {step.stepNumber >= 2 && step.stepNumber <= 4 && (
                <path
                  d="M 390 70 L 395 78 L 388 84 L 400 90"
                  stroke="#D97706"
                  strokeWidth="4"
                  fill="none"
                  filter="drop-shadow(0 0 6px rgba(217,119,6,0.5))"
                />
              )}

              {/* Step 3: Traveling wave expanding along conductors */}
              {step.stepNumber === 3 && (
                <g stroke="#D97706" strokeWidth="3">
                  <circle cx="340" cy="90" r="10" fill="none" className="animate-ping" />
                  <circle cx="460" cy="90" r="10" fill="none" className="animate-ping" />
                  <line x1="400" y1="90" x2="250" y2="90" stroke="#D97706" strokeWidth="3" />
                  <line x1="400" y1="90" x2="550" y2="90" stroke="#D97706" strokeWidth="3" />
                  <text x="260" y="80" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Onde transitoire U = Zc·I →
                  </text>
                </g>
              )}

              {/* Step 4: Ground discharge down the tower frame */}
              {step.stepNumber === 4 && (
                <g stroke="#0284C7" strokeWidth="3">
                  <line x1="400" y1="90" x2="390" y2="210" stroke="#0284C7" strokeWidth="3" />
                  <line x1="400" y1="90" x2="410" y2="210" stroke="#0284C7" strokeWidth="3" />
                  <text x="340" y="225" fill="#0369A1" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Écoulement terre (Rt &lt; 10 Ω)
                  </text>
                </g>
              )}

              {/* Step 5: Surge arrester clamping on right substation entry */}
              {step.stepNumber >= 5 && (
                <g transform="translate(680, 135)">
                  <rect x="-6" y="0" width="12" height="30" fill="#E2E8F0" stroke="#D97706" strokeWidth="2" />
                  <line x1="0" y1="30" x2="0" y2="60" stroke="#94A3B8" strokeWidth="2" />
                  <text x="-24" y="-8" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Parafoudre ZnO
                  </text>
                  {step.stepNumber === 5 && (
                    <circle cx="0" cy="15" r="14" fill="#F59E0B" fillOpacity="0.3" className="animate-ping" />
                  )}
                </g>
              )}

              {/* Step 7 & 8: Circuit Breaker */}
              <g transform="translate(730, 135)">
                <rect 
                  x="-12" 
                  y="-12" 
                  width="24" 
                  height="24" 
                  fill="#FFFFFF" 
                  stroke={step.stepNumber === 7 ? "#DC2626" : "#059669"} 
                  strokeWidth="2" 
                  rx="3" 
                />
                <line 
                  x1="-6" 
                  y1={step.stepNumber === 7 ? "-10" : "-6"} 
                  x2="6" 
                  y2={step.stepNumber === 7 ? "2" : "6"} 
                  stroke={step.stepNumber === 7 ? "#DC2626" : "#059669"} 
                  strokeWidth="2.5" 
                />
                <text x="-16" y="24" fill="#334155" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  {step.stepNumber === 7 ? 'DJ OUVERT' : 'DJ FERMÉ'}
                </text>
              </g>
            </svg>
          </div>

          {/* Current Step Technical Detail Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <h4 className="text-sm font-bold text-slate-900 uppercase">
                  {step.title[locale]}
                </h4>
              </div>
              <span className="text-xs text-slate-500">
                Étape {step.stepNumber} sur {LIGHTNING_SIMULATION_STEPS.length}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              {step.description[locale]}
            </p>

            <div className="bg-white p-3 rounded-lg border border-sky-200 text-xs text-sky-900 shadow-2xs">
              <span className="text-amber-800 font-bold block mb-1">
                {locale === 'fr' ? 'DÉTAIL ÉLECTROTECHNIQUE :' : 'ELECTRICAL ENGINEERING DETAIL :'}
              </span>
              {step.technicalDetail[locale]}
            </div>

            {/* Clickable Active Equipment Links */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">Équipements sollicités:</span>
              {step.activeElements.map((elem) => (
                <button
                  key={elem}
                  type="button"
                  onClick={() => onSelectEquipment(elem)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 text-[11px] shadow-2xs"
                >
                  {elem}
                </button>
              ))}
            </div>
          </div>

          {/* Step Timeline Player Buttons */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isPlaying 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'PAUSE' : 'LANCER LA SÉQUENCE'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIdx((prev) => Math.min(prev + 1, LIGHTNING_SIMULATION_STEPS.length - 1))}
                disabled={currentStepIdx >= LIGHTNING_SIMULATION_STEPS.length - 1}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 text-xs font-mono flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              >
                <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Step'}</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStepIdx(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 shadow-2xs"
                title="Recommencer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* 8-step indicator dots */}
            <div className="flex items-center gap-1.5">
              {LIGHTNING_SIMULATION_STEPS.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`h-7 px-2.5 rounded-md text-xs font-mono font-bold transition-all shadow-2xs ${
                    idx === currentStepIdx
                      ? 'bg-amber-500 text-white shadow-xs'
                      : idx < currentStepIdx
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {s.stepNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
