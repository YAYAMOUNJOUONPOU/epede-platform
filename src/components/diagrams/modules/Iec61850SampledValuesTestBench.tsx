// src/components/diagrams/modules/Iec61850SampledValuesTestBench.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  Radio,
  Wifi,
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Clock,
  Compass,
  FileCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  Iec61850SampledValuesService,
  MergingUnitConfig,
  PtpSyncStatus,
  SvInjectionScenario,
  SvInjectionParameters,
  SampledPoint,
  DEFAULT_MERGING_UNIT,
  DEFAULT_PTP_STATUS,
  DEFAULT_SCENARIOS_PARAMS
} from '../../../services/iec61850SampledValuesService';

interface Iec61850SampledValuesTestBenchProps {
  locale: 'fr' | 'en';
  onTripSimulated?: (tripReason: string) => void;
}

export const Iec61850SampledValuesTestBench: React.FC<Iec61850SampledValuesTestBenchProps> = ({
  locale,
  onTripSimulated,
}) => {
  // Merging Unit & PTP Configuration
  const [muConfig, setMuConfig] = useState<MergingUnitConfig>(DEFAULT_MERGING_UNIT);
  const [ptpStatus, setPtpStatus] = useState<PtpSyncStatus>(DEFAULT_PTP_STATUS);

  // Active scenario and parameters
  const [activeScenario, setActiveScenario] = useState<SvInjectionScenario>('PHASE_A_GROUND_FAULT');
  const [params, setParams] = useState<SvInjectionParameters>(DEFAULT_SCENARIOS_PARAMS['PHASE_A_GROUND_FAULT']);

  // Channel visibility toggles
  const [visibleChannels, setVisibleChannels] = useState<{
    ia: boolean;
    ib: boolean;
    ic: boolean;
    in: boolean;
    va: boolean;
    vb: boolean;
    vc: boolean;
  }>({
    ia: true,
    ib: true,
    ic: true,
    in: true,
    va: true,
    vb: true,
    vc: true,
  });

  // Selected sample point for dissection inspection
  const [inspectedSampleIndex, setInspectedSampleIndex] = useState<number>(0);
  const [isHoveringGraph, setIsHoveringGraph] = useState<boolean>(false);
  const [hoverSampleIndex, setHoverSampleIndex] = useState<number | null>(null);

  // Animation / continuous stream simulation
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamPacketCount, setStreamPacketCount] = useState<number>(148200);
  const [copiedHex, setCopiedHex] = useState<boolean>(false);
  const [copiedPcap, setCopiedPcap] = useState<boolean>(false);

  // Handle scenario switch
  const handleSelectScenario = (sc: SvInjectionScenario) => {
    setActiveScenario(sc);
    setParams(DEFAULT_SCENARIOS_PARAMS[sc]);
  };

  // Synthesize discrete sample points for the cycle
  const samples: SampledPoint[] = useMemo(() => {
    return Iec61850SampledValuesService.synthesizeCycleSamples(params, muConfig);
  }, [params, muConfig]);

  // Reconstruct phasors using full-cycle Discrete Fourier Transform (DFT)
  const phasors = useMemo(() => {
    return Iec61850SampledValuesService.calculateFourierPhasors(samples);
  }, [samples]);

  // Closed-loop relay protection trip evaluation
  const protectionTrip = useMemo(() => {
    const res = Iec61850SampledValuesService.evaluateProtectionResponse(phasors, params);
    return res;
  }, [phasors, params]);

  // Dissected IEC 61850-9-2LE APDU for the currently inspected sample
  const activeSampleIndex = hoverSampleIndex !== null ? hoverSampleIndex : inspectedSampleIndex;
  const currentSample = samples[Math.min(activeSampleIndex, samples.length - 1)] || samples[0];

  const packetDissection = useMemo(() => {
    return Iec61850SampledValuesService.generateSampledValuePacketHex(
      currentSample,
      muConfig,
      ptpStatus
    );
  }, [currentSample, muConfig, ptpStatus]);

  // Simulate continuous streaming tick
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setStreamPacketCount((prev) => prev + 40); // Increment stream count
    }, 100);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Copy hex to clipboard
  const handleCopyHex = () => {
    navigator.clipboard.writeText(packetDissection.hexRaw);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  // Download sample stream as text
  const handleDownloadSamples = () => {
    const csvHeader = 'smpCnt,timeUs,Ia_Raw,Ia_A,Ib_Raw,Ib_A,Ic_Raw,Ic_A,In_Raw,In_A,Va_Raw,Va_V,Vb_Raw,Vb_V,Vc_Raw,Vc_V,qIa,qVa\n';
    const csvRows = samples
      .map(
        (s) =>
          `${s.smpCnt},${s.timeUs},${s.iaRaw},${s.iaEngA.toFixed(2)},${s.ibRaw},${s.ibEngA.toFixed(2)},${s.icRaw},${s.icEngA.toFixed(2)},${s.inRaw},${s.inEngA.toFixed(2)},${s.vaRaw},${s.vaEngV.toFixed(1)},${s.vbRaw},${s.vbEngV.toFixed(1)},${s.vcRaw},${s.vcEngV.toFixed(1)},0x${s.qIa.toString(16)},0x${s.qVa.toString(16)}`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IEC61850_9_2LE_${activeScenario}_Stream.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Graph dimensions
  const svgWidth = 840;
  const svgHeight = 260;
  const padding = { top: 20, right: 30, bottom: 35, left: 60 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Max range auto-scaling for current and voltage
  const maxCurrentEng = useMemo(() => {
    let max = 1000;
    samples.forEach((s) => {
      max = Math.max(max, Math.abs(s.iaEngA), Math.abs(s.ibEngA), Math.abs(s.icEngA), Math.abs(s.inEngA));
    });
    return max * 1.15;
  }, [samples]);

  const maxVoltageEng = useMemo(() => {
    let max = 50000;
    samples.forEach((s) => {
      max = Math.max(max, Math.abs(s.vaEngV), Math.abs(s.vbEngV), Math.abs(s.vcEngV));
    });
    return max * 1.15;
  }, [samples]);

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / (samples.length - 1)) * plotWidth;
  const getYCurrent = (valA: number) => {
    const norm = valA / maxCurrentEng;
    return padding.top + plotHeight / 2 - (norm * (plotHeight / 2));
  };
  const getYVoltage = (valV: number) => {
    const norm = valV / maxVoltageEng;
    return padding.top + plotHeight / 2 - (norm * (plotHeight / 2));
  };

  return (
    <div className="flex flex-col gap-5 text-slate-200">
      {/* Top Banner: Merging Unit & PTP Synchronization Status */}
      <div className="p-4 rounded-2xl bg-[#0F1D32] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wide uppercase">
                {locale === 'fr' 
                  ? 'BANC D’ESSAI SAMPLE VALUES (CEI 61850-9-2LE / CEI 61869-9)' 
                  : 'SAMPLE VALUES TEST BENCH (IEC 61850-9-2LE / IEC 61869-9)'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {muConfig.standard} · {muConfig.sampleRate === 4000 ? '80 smp/cyc (4 kHz)' : '256 smp/cyc (12.8 kHz)'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>BUS DE PROCESS PRP ACTIF</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {locale === 'fr'
                ? 'Injection virtuelle de flux de trames Ethernet optiques échantillonnées, synchro IEEE 1588 PTP et déclenchement de protection en boucle fermée.'
                : 'Virtual injection of optical sampled value Ethernet streams, IEEE 1588 PTP time sync and closed-loop protective relay tripping.'}
            </p>
          </div>
        </div>

        {/* PTP Grandmaster Clock & Stream Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 font-mono text-xs flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-400">PTP GM :</span>
              <span className="text-emerald-400 font-bold">GPS Stratum-1</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400">Offset : </span>
              <span className="text-cyan-300 font-bold">+{ptpStatus.offsetFromMasterNs} ns</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400">Jitter : </span>
              <span className="text-slate-200">±{ptpStatus.jitterNs} ns</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1">
              <span className="text-slate-400">smpSynch : </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {ptpStatus.smpSynchFlag} (Global)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isStreaming
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isStreaming ? 'PAUSE FLUX' : 'DÉMARRER FLUX'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSamples}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
              title="Exporter les échantillons du cycle en format CSV"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'SCÉNARIOS D’INJECTION D’ÉCHANTILLONS' : 'SAMPLE INJECTION SCENARIOS'}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {locale === 'fr' ? 'Sélectionnez un cas de défaut pour générer le train d’ondes instantané' : 'Select a fault case to generate instantaneous waveform train'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            {
              id: 'BALANCED_LOAD',
              nameFr: 'Charge Équilibrée',
              nameEn: 'Balanced Load',
              badge: '630 A · 225 kV',
              color: 'border-slate-700 hover:border-cyan-500/60',
              activeColor: 'bg-cyan-500/20 border-cyan-400 text-cyan-200',
            },
            {
              id: 'PHASE_A_GROUND_FAULT',
              nameFr: 'Défaut Phase A - Terre',
              nameEn: 'Phase A Earth Fault',
              badge: '18.5 kA · Z1 < 12 Ω',
              color: 'border-slate-700 hover:border-rose-500/60',
              activeColor: 'bg-rose-500/20 border-rose-400 text-rose-200',
            },
            {
              id: 'THREE_PHASE_BUS_FAULT',
              nameFr: 'Court-Circuit Triphasé',
              nameEn: 'Three-Phase Bus Fault',
              badge: '31.5 kA · Effondrement',
              color: 'border-slate-700 hover:border-red-500/60',
              activeColor: 'bg-red-500/20 border-red-400 text-red-200',
            },
            {
              id: 'TRANSFORMER_INRUSH',
              nameFr: 'Enclenchement Transfo',
              nameEn: 'Transformer Inrush',
              badge: '24% H2 · Blocage 87',
              color: 'border-slate-700 hover:border-amber-500/60',
              activeColor: 'bg-amber-500/20 border-amber-400 text-amber-200',
            },
            {
              id: 'CT_SATURATION',
              nameFr: 'Saturation Tore TC',
              nameEn: 'CT Core Saturation',
              badge: 'Écrêtage à 18 kA',
              color: 'border-slate-700 hover:border-purple-500/60',
              activeColor: 'bg-purple-500/20 border-purple-400 text-purple-200',
            },
            {
              id: 'VOLTAGE_SAG_UNBALANCE',
              nameFr: 'Creux & Dissymétrie',
              nameEn: 'Voltage Sag & Unbalance',
              badge: 'Sag 40% · I2/I1 élevé',
              color: 'border-slate-700 hover:border-sky-500/60',
              activeColor: 'bg-sky-500/20 border-sky-400 text-sky-200',
            },
          ].map((sc) => {
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id as SvInjectionScenario)}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected ? sc.activeColor : 'bg-[#0B1526] text-slate-400 ' + sc.color
                }`}
              >
                <span className="text-xs font-mono font-bold leading-tight">
                  {locale === 'fr' ? sc.nameFr : sc.nameEn}
                </span>
                <span className="text-[10px] font-mono mt-1 opacity-80">{sc.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Waveform Display (20 ms nominal cycle = 80 samples) */}
      <div className="p-4 rounded-2xl bg-[#091120] border border-[#1B2A42] flex flex-col gap-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'OSCILLOGRAMME DES ÉCHANTILLONS SV (1 CYCLE = 20 ms · 80 ÉCHANTILLONS)' : 'SV SAMPLED VALUES OSCILLOGRAM (1 CYCLE = 20 ms · 80 SAMPLES)'}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Δt = 250 µs / échantillon
            </span>
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Canaux :</span>
            {[
              { id: 'ia', label: 'Ia', color: 'bg-amber-500 text-slate-950 font-bold' },
              { id: 'ib', label: 'Ib', color: 'bg-emerald-500 text-slate-950 font-bold' },
              { id: 'ic', label: 'Ic', color: 'bg-indigo-500 text-white font-bold' },
              { id: 'in', label: 'In', color: 'bg-rose-500 text-white font-bold' },
              { id: 'va', label: 'Va', color: 'bg-amber-400/20 text-amber-300 border border-amber-400/50' },
              { id: 'vb', label: 'Vb', color: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/50' },
              { id: 'vc', label: 'Vc', color: 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/50' },
            ].map((ch) => {
              const active = visibleChannels[ch.id as keyof typeof visibleChannels];
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() =>
                    setVisibleChannels((prev) => ({
                      ...prev,
                      [ch.id]: !prev[ch.id as keyof typeof visibleChannels],
                    }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    active ? ch.color : 'bg-slate-800/80 text-slate-500 border border-slate-700 line-through'
                  }`}
                >
                  {ch.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Waveform Canvas with interactive crosshair hover */}
        <div className="relative w-full overflow-x-auto bg-[#050A14] rounded-xl border border-slate-800 p-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[760px] select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
              if (mouseX >= padding.left && mouseX <= padding.left + plotWidth) {
                const sampleRatio = (mouseX - padding.left) / plotWidth;
                const sampleIdx = Math.round(sampleRatio * (samples.length - 1));
                setHoverSampleIndex(sampleIdx);
                setIsHoveringGraph(true);
              }
            }}
            onMouseLeave={() => {
              setIsHoveringGraph(false);
              setHoverSampleIndex(null);
            }}
            onClick={() => {
              if (hoverSampleIndex !== null) {
                setInspectedSampleIndex(hoverSampleIndex);
              }
            }}
          >
            {/* Grid Lines */}
            <line
              x1={padding.left}
              y1={padding.top + plotHeight / 2}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight / 2}
              stroke="#1E293B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Quarter cycle markers (5 ms, 10 ms, 15 ms) */}
            {[0.25, 0.5, 0.75].map((fraction) => {
              const xPos = padding.left + fraction * plotWidth;
              return (
                <g key={fraction}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={padding.top + plotHeight}
                    stroke="#1E293B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={xPos}
                    y={svgHeight - 10}
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {fraction * 20} ms
                  </text>
                </g>
              );
            })}

            {/* Axes labels */}
            <text x={padding.left} y={svgHeight - 10} fill="#64748B" fontSize="9" fontFamily="monospace">
              0 ms (smpCnt=0)
            </text>
            <text
              x={padding.left + plotWidth}
              y={svgHeight - 10}
              fill="#64748B"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
            >
              20 ms (smpCnt=79)
            </text>
            <text
              x={10}
              y={padding.top + 10}
              fill="#F59E0B"
              fontSize="9"
              fontFamily="monospace"
            >
              +{(maxCurrentEng / 1000).toFixed(1)} kA
            </text>
            <text
              x={10}
              y={padding.top + plotHeight / 2 + 3}
              fill="#64748B"
              fontSize="9"
              fontFamily="monospace"
            >
              0
            </text>
            <text
              x={10}
              y={padding.top + plotHeight}
              fill="#F59E0B"
              fontSize="9"
              fontFamily="monospace"
            >
              -{(maxCurrentEng / 1000).toFixed(1)} kA
            </text>

            {/* Waveform Polylines & Discrete Sample Dots */}
            {/* Voltage Va */}
            {visibleChannels.va && (
              <polyline
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                points={samples.map((s, idx) => `${getX(idx)},${getYVoltage(s.vaEngV)}`).join(' ')}
              />
            )}
            {/* Voltage Vb */}
            {visibleChannels.vb && (
              <polyline
                fill="none"
                stroke="#34D399"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                points={samples.map((s, idx) => `${getX(idx)},${getYVoltage(s.vbEngV)}`).join(' ')}
              />
            )}
            {/* Voltage Vc */}
            {visibleChannels.vc && (
              <polyline
                fill="none"
                stroke="#818CF8"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                points={samples.map((s, idx) => `${getX(idx)},${getYVoltage(s.vcEngV)}`).join(' ')}
              />
            )}

            {/* Current In (Neutral) */}
            {visibleChannels.in && (
              <polyline
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2"
                points={samples.map((s, idx) => `${getX(idx)},${getYCurrent(s.inEngA)}`).join(' ')}
              />
            )}
            {/* Current Ic */}
            {visibleChannels.ic && (
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.2"
                points={samples.map((s, idx) => `${getX(idx)},${getYCurrent(s.icEngA)}`).join(' ')}
              />
            )}
            {/* Current Ib */}
            {visibleChannels.ib && (
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                points={samples.map((s, idx) => `${getX(idx)},${getYCurrent(s.ibEngA)}`).join(' ')}
              />
            )}
            {/* Current Ia */}
            {visibleChannels.ia && (
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                points={samples.map((s, idx) => `${getX(idx)},${getYCurrent(s.iaEngA)}`).join(' ')}
              />
            )}

            {/* Render Discrete Sample Dots (Sampled Values 80 smp/cycle) */}
            {visibleChannels.ia &&
              samples.map((s, idx) => (
                <circle
                  key={`ia-${idx}`}
                  cx={getX(idx)}
                  cy={getYCurrent(s.iaEngA)}
                  r={idx === activeSampleIndex ? '4' : '1.8'}
                  fill={idx === activeSampleIndex ? '#FFFFFF' : '#F59E0B'}
                  stroke="#050A14"
                  strokeWidth="0.8"
                />
              ))}

            {/* Active Selected Sample Marker (Crosshair Line) */}
            <line
              x1={getX(activeSampleIndex)}
              y1={padding.top}
              x2={getX(activeSampleIndex)}
              y2={padding.top + plotHeight}
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <circle
              cx={getX(activeSampleIndex)}
              cy={getYCurrent(currentSample.iaEngA)}
              r="6"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              className="animate-ping"
            />
          </svg>

          {/* Quick Hover Readout Overlay */}
          <div className="mt-2 px-3 py-1.5 rounded-lg bg-[#0C1628] border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-cyan-300 font-bold">
                Échantillon #{currentSample.smpCnt} ({currentSample.timeUs} µs) :
              </span>
              <span className="text-amber-400">
                Ia = {currentSample.iaEngA.toFixed(1)} A ({currentSample.iaRaw} cts)
              </span>
              <span className="text-emerald-400">
                Ib = {currentSample.ibEngA.toFixed(1)} A
              </span>
              <span className="text-indigo-400">
                Ic = {currentSample.icEngA.toFixed(1)} A
              </span>
              <span className="text-rose-400">
                In = {currentSample.inEngA.toFixed(1)} A
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-200">
                Va = {(currentSample.vaEngV / 1000).toFixed(2)} kV
              </span>
              <span className="text-emerald-200">
                Vb = {(currentSample.vbEngV / 1000).toFixed(2)} kV
              </span>
              <span className="text-indigo-200">
                Vc = {(currentSample.vcEngV / 1000).toFixed(2)} kV
              </span>
              <span className="text-slate-400 text-[11px]">
                (Cliquez sur le graphe pour inspecter l'échantillon)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Left = Phasor & Protection / Right = Wireshark Dissector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 Cols): Reconstructed Phasors & Closed-Loop Protection Tripping */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Protection Relay Decision Card */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              protectionTrip.overcurrent50InstantTrip ||
              protectionTrip.groundFault51NTrip ||
              protectionTrip.distance21Zone1Trip ||
              protectionTrip.differential87LTrip
                ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
                : 'bg-[#0B1526] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {protectionTrip.overcurrent50InstantTrip ||
                protectionTrip.groundFault51NTrip ||
                protectionTrip.distance21Zone1Trip ||
                protectionTrip.differential87LTrip ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400 animate-bounce" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                )}
                <span className="text-xs font-mono uppercase font-bold text-white">
                  {locale === 'fr' ? 'DÉCISION RELAIS CEI (BOUCLE FERMÉE)' : 'CLOSED-LOOP RELAY DECISION'}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  protectionTrip.overcurrent50InstantTrip ||
                  protectionTrip.groundFault51NTrip ||
                  protectionTrip.distance21Zone1Trip ||
                  protectionTrip.differential87LTrip
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {protectionTrip.overcurrent50InstantTrip ||
                protectionTrip.groundFault51NTrip ||
                protectionTrip.distance21Zone1Trip ||
                protectionTrip.differential87LTrip
                  ? 'ORDRE TRIP ÉMIS'
                  : 'VEILLE STABLE'}
              </span>
            </div>

            {/* Trip explanation */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs font-mono">
              <span className="text-slate-300">
                {locale === 'fr' ? protectionTrip.tripReasonFr : protectionTrip.tripReasonEn}
              </span>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
                <span>Latence traitement DFT + Algo :</span>
                <span className="text-cyan-300 font-bold">{protectionTrip.iedProcessingLatencyMs} ms</span>
              </div>
            </div>

            {/* Protection Functions status table */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ANSI 50 (I&gt;&gt;) :</span>
                <span
                  className={`font-bold ${
                    protectionTrip.overcurrent50InstantTrip ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {protectionTrip.overcurrent50InstantTrip ? 'DÉCLENCHÉ' : 'REPOS'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ANSI 51N (Io&gt;) :</span>
                <span
                  className={`font-bold ${
                    protectionTrip.groundFault51NTrip ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {protectionTrip.groundFault51NTrip ? 'DÉCLENCHÉ' : 'REPOS'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ANSI 21 (Z1&lt;) :</span>
                <span
                  className={`font-bold ${
                    protectionTrip.distance21Zone1Trip ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {protectionTrip.distance21Zone1Trip
                    ? `TRIP (${protectionTrip.calculatedZ1Ohm} Ω)`
                    : `${protectionTrip.calculatedZ1Ohm} Ω`}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ANSI 87L (Diff) :</span>
                <span
                  className={`font-bold ${
                    protectionTrip.differential87LTrip ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {protectionTrip.differential87LTrip ? 'TRIP' : 'REPOS'}
                </span>
              </div>
            </div>

            {/* GOOSE Intertrip payload notification */}
            {protectionTrip.gooseTripPacketPublished && (
              <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span className="text-indigo-200">
                    Trame GOOSE Trip Déclenchement émise vers Disjoncteur (t &lt; 2 ms)
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  APPID: 0x000A
                </span>
              </div>
            )}
          </div>

          {/* Reconstructed Phasors Card (DFT Engine) */}
          <div className="p-4 rounded-2xl bg-[#0B1526] border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? 'PHASORS RECONSTRUITS (TRANSFORMÉE DE FOURIER DFT)' : 'RECONSTRUCTED PHASORS (DFT ALGORITHM)'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">1 Cycle RMS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <div className="text-[11px] text-amber-400 font-bold">Courant Phase A :</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {phasors.ia.magRms.toLocaleString()} A <span className="text-xs text-slate-400">∠{phasors.ia.phaseDeg}°</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <div className="text-[11px] text-emerald-400 font-bold">Courant Phase B :</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {phasors.ib.magRms.toLocaleString()} A <span className="text-xs text-slate-400">∠{phasors.ib.phaseDeg}°</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <div className="text-[11px] text-indigo-400 font-bold">Courant Phase C :</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {phasors.ic.magRms.toLocaleString()} A <span className="text-xs text-slate-400">∠{phasors.ic.phaseDeg}°</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <div className="text-[11px] text-rose-400 font-bold">Courant Neutre 3Io :</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {phasors.in.magRms.toLocaleString()} A <span className="text-xs text-slate-400">∠{phasors.in.phaseDeg}°</span>
                </div>
              </div>
            </div>

            {/* Symmetrical components & Powers */}
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Composante Directe (I1) :</span>
                <span className="text-cyan-300 font-bold">{phasors.posSeqCurrentI1} A</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Composante Inverse (I2) :</span>
                <span className="text-amber-300 font-bold">{phasors.negSeqCurrentI2} A</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Taux de Dissymétrie (I2/I1) :</span>
                <span
                  className={`font-bold ${
                    phasors.unbalanceRatioPercent > 10 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {phasors.unbalanceRatioPercent} %
                </span>
              </div>
              <div className="h-px bg-slate-800 my-1" />
              <div className="flex items-center justify-between text-slate-400">
                <span>Puissance Active Triphasée :</span>
                <span className="text-slate-200 font-bold">{phasors.activePowerMw} MW</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Puissance Réactive Triphasée :</span>
                <span className="text-slate-200 font-bold">{phasors.reactivePowerMvar} Mvar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Dissected Wireshark-Grade Ethernet APDU Frame */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-[#080E1B] border border-cyan-500/30 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase">
                    {locale === 'fr' 
                      ? 'DISSÉCTEUR DE TRAME SV CEI 61850-9-2LE (STYLE WIRESHARK)' 
                      : 'IEC 61850-9-2LE SV FRAME DISSECTOR (WIRESHARK VIEW)'}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Échantillon sélectionné : smpCnt = {currentSample.smpCnt} / 79 · t = {currentSample.timeUs} µs
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyHex}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                {copiedHex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedHex ? 'COPIÉ !' : 'COPIER HEX'}</span>
              </button>
            </div>

            {/* Raw Hex APDU Stream */}
            <div className="p-3 rounded-xl bg-[#030712] border border-slate-800 text-[11px] font-mono text-emerald-400 break-all leading-relaxed max-h-24 overflow-y-auto">
              {packetDissection.hexRaw}
            </div>

            {/* Tree Dissector View */}
            <div className="flex flex-col divide-y divide-slate-800/80 rounded-xl bg-[#060C17] border border-slate-800/80 overflow-hidden text-xs font-mono">
              {packetDissection.dissectorTree.map((item, idx) => (
                <div key={idx} className="p-2.5 hover:bg-slate-800/40 transition-colors flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3 text-slate-500" />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.hex.slice(0, 24)}...
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] pl-4">{item.value}</div>
                  <div className="text-[10px] text-slate-500 pl-4 italic">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Merging Unit Hardware & Transducer Settings */}
          <div className="p-4 rounded-2xl bg-[#0B1526] border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'PARAMÈTRES TRANSDUCTEURS & RÉDUCTION DE MESURE' : 'TRANSDUCERS & SAMU CONVERTER SETTINGS'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400">Technologie Réducteur (TC / TT) :</span>
                <select
                  value={muConfig.transducerType}
                  onChange={(e) =>
                    setMuConfig((prev) => ({
                      ...prev,
                      transducerType: e.target.value as any,
                    }))
                  }
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none"
                >
                  <option value="CONVENTIONAL_ADC_16BIT">TC/TT Conventionnel (ADC Sigma-Delta 16 bits)</option>
                  <option value="NCIT_ROGOWSKI_LPIT">Capteur Non-Conventionnel NCIT (Bobine Rogowski LPIT)</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400">Fréquence d'Échantillonnage :</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    80 éch/cycle (4 000 Hz) - Protection
                  </span>
                  <span className="text-slate-500 text-[10px]">CEI 61850-9-2LE</span>
                </div>
              </div>
            </div>

            {/* Quality Flags Simulation */}
            <div className="mt-1 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex-wrap text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Drapeaux de Qualité CEI 61850-7-2 :</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.testBitActive}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, testBitActive: e.target.checked }))
                    }
                    className="rounded border-slate-700 text-cyan-500"
                  />
                  <span className="text-slate-300 text-xs">Bit Test (Bit 11)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.qualityInvalidPhsA}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, qualityInvalidPhsA: e.target.checked }))
                    }
                    className="rounded border-slate-700 text-rose-500"
                  />
                  <span className="text-rose-300 text-xs">Défaut Capteur Phase A (Invalid)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
