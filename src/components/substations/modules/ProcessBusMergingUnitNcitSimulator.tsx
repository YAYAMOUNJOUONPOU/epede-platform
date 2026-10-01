// src/components/substations/modules/ProcessBusMergingUnitNcitSimulator.tsx
// EPEDE Substation Automation Suite: IEC 61850-9-2LE / IEC 61869-9 Sampled Values (SV) Engine,
// Non-Conventional Instrument Transformers (NCIT - Optical Rogowski & Voltage Dividers),
// and IEEE 1588 PTP Synchronization Jitter & Busbar Differential (ANSI 87B) Phase Alignment

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Radio,
  Cpu,
  Activity,
  Clock,
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Layers,
  Network,
  Waves,
  Eye,
  Info,
  ShieldAlert,
  Server
} from 'lucide-react';

interface ProcessBusMergingUnitNcitSimulatorProps {
  locale: 'fr' | 'en';
}

type SensorTechnology = 'ROGOWSKI_OPTICAL_NCIT' | 'CONVENTIONAL_IRON_CORE_CT';
type PtpSyncQuality = 'LOCKED_T1_SUB_100NS' | 'DRIFTING_HOLDOVER' | 'UNSYNCHRONIZED_ALARM';

export const ProcessBusMergingUnitNcitSimulator: React.FC<ProcessBusMergingUnitNcitSimulatorProps> = ({
  locale
}) => {
  // 1. Grid & Measurement Inputs
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.0);
  const [rmsCurrentAmps, setRmsCurrentAmps] = useState<number>(1250); // Nominal ~1250A
  const [faultCurrentMultiplier, setFaultCurrentMultiplier] = useState<number>(1.0); // Fault surge factor (up to 25x = 31.25 kA)
  const [dcOffsetPercent, setDcOffsetPercent] = useState<number>(60); // DC transient offset in fault
  const [sensorTech, setSensorTech] = useState<SensorTechnology>('ROGOWSKI_OPTICAL_NCIT');

  // 2. Merging Unit (IEC 61869-9 / 9-2LE) Sampling Configuration
  const [samplingRateSps, setSamplingRateSps] = useState<4800 | 14400>(4800); // 4800 Hz (9-2LE standard) vs 14.4 kHz (high-speed quality)
  const [muVlanPriority, setMuVlanPriority] = useState<number>(4); // Default VLAN priority 4 for SV

  // 3. IEEE 1588 PTP Synchronization & Time Skew
  const [ptpSyncState, setPtpSyncState] = useState<PtpSyncQuality>('LOCKED_T1_SUB_100NS');
  const [injectedJitterMicroseconds, setInjectedJitterMicroseconds] = useState<number>(0); // 0 to 500 µs jitter/skew

  // Live time ticker for dynamic waveform
  const [timeTick, setTimeTick] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setTimeTick(prev => (prev + delta * 2.5) % 1000);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Effective peak current with fault multiplier
  const effectivePeakCurrent = useMemo(() => {
    return rmsCurrentAmps * Math.SQRT2 * faultCurrentMultiplier;
  }, [rmsCurrentAmps, faultCurrentMultiplier]);

  // Conventional CT Saturation Threshold (Iron core knee-point at approx 12x rated)
  const ctSaturationKneeMultiplier = 10.0;
  const isCtSaturated = sensorTech === 'CONVENTIONAL_IRON_CORE_CT' && faultCurrentMultiplier > ctSaturationKneeMultiplier;

  // Phase Shift Induced by Time Skew: Delta Theta (degrees) = 360 * f * (timeSkewSec)
  const phaseErrorDeg = useMemo(() => {
    const timeSkewSec = (injectedJitterMicroseconds * 1e-6) + (ptpSyncState === 'UNSYNCHRONIZED_ALARM' ? 0.0012 : ptpSyncState === 'DRIFTING_HOLDOVER' ? 0.00015 : 0);
    return (360 * gridFrequencyHz * timeSkewSec);
  }, [injectedJitterMicroseconds, ptpSyncState, gridFrequencyHz]);

  // Differential False Current (ANSI 87B): Idiff = |I_bay1 - I_bay2_skewed|
  const differentialCurrentFalseAmps = useMemo(() => {
    const baseAmps = rmsCurrentAmps * faultCurrentMultiplier;
    const rad = (phaseErrorDeg * Math.PI) / 180;
    // Vector difference: 2 * I * sin(delta_theta / 2)
    const falseDiff = 2 * baseAmps * Math.sin(Math.abs(rad) / 2);
    // Add distortion error if iron core is saturated
    return Math.round(isCtSaturated ? falseDiff + baseAmps * 0.35 : falseDiff);
  }, [rmsCurrentAmps, faultCurrentMultiplier, phaseErrorDeg, isCtSaturated]);

  // ANSI 87B False Trip Condition: If false differential current exceeds 0.2 * Inom or 250A
  const isDifferentialProtectionFalseTripping = differentialCurrentFalseAmps > 350;

  // Generate Real-time Waveform Sampling Points (Simulating 1 full 20ms period = 96 points at 4800Hz)
  const waveformPoints = useMemo(() => {
    const points: { x: number; yTrue: number; ySampled: number; isSaturated: boolean }[] = [];
    const numPoints = 96; // 96 samples per 50Hz cycle at 4800Hz
    const sampleDt = (1 / 50.0) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const t = i * sampleDt + (timeTick * 0.005);
      const angle = 2 * Math.PI * gridFrequencyHz * t;
      
      // Pure mathematical primary current
      let trueVal = Math.sin(angle);
      if (faultCurrentMultiplier > 1.5) {
        // Add decaying DC component
        trueVal += (dcOffsetPercent / 100) * Math.exp(-t * 25);
      }

      // Sampled Output by Sensor + Merging Unit
      let sampledVal = trueVal;
      let saturated = false;

      // If Conventional Iron Core CT saturates at high currents:
      if (sensorTech === 'CONVENTIONAL_IRON_CORE_CT' && faultCurrentMultiplier > ctSaturationKneeMultiplier) {
        // Flatten peaks and introduce harmonic distortion
        if (sampledVal > 0.85) {
          sampledVal = 0.85 - (sampledVal - 0.85) * 0.4;
          saturated = true;
        } else if (sampledVal < -0.85) {
          sampledVal = -0.85 - (sampledVal + 0.85) * 0.4;
          saturated = true;
        }
      }

      // Apply PTP Skew / Time Jitter delay on sampled channel
      const skewedAngle = angle - ((phaseErrorDeg * Math.PI) / 180);
      let timeSkewedSampled = Math.sin(skewedAngle);
      if (sensorTech === 'CONVENTIONAL_IRON_CORE_CT' && saturated) {
        timeSkewedSampled = sampledVal; // already distorted
      }

      // Map to SVG coordinates: X: 0 -> 560, Y: -1.5..1.5 -> 140..20
      const svgX = 20 + (i / (numPoints - 1)) * 520;
      const svgYTrue = 80 - (trueVal / 1.8) * 60;
      const svgYSampled = 80 - (timeSkewedSampled / 1.8) * 60;

      points.push({
        x: svgX,
        yTrue: svgYTrue,
        ySampled: svgYSampled,
        isSaturated: saturated
      });
    }
    return points;
  }, [gridFrequencyHz, faultCurrentMultiplier, dcOffsetPercent, sensorTech, phaseErrorDeg, timeTick]);

  // IEC 61850-9-2LE Ethernet Frame Preview Builder
  const simulatedSvPacket = useMemo(() => {
    const now = new Date();
    const smpCnt = Math.floor((Date.now() % 1000) * 4.8); // 0 to 4799
    return {
      destMac: '01-0C-CD-04-00-01', // Standard SV Multicast MAC
      srcMac: '00-1E-2B-3C-8A-02', // MU MAC address
      tpid: '0x8100', // 802.1Q VLAN Tagged
      vlanId: '100', // Process Bus VLAN
      vlanPri: muVlanPriority, // VLAN Priority
      etherType: '0x88BA', // IEC 61850 SV Ethertype
      appId: '0x4000', // IEC 61850-9-2LE standard AppID for Bay 1
      length: 128,
      svId: 'MU_L1_BAY01', // Merging Unit ID
      smpCnt: smpCnt, // Sample Counter (0..4799)
      confRev: 1,
      smpSynch: ptpSyncState === 'LOCKED_T1_SUB_100NS' ? '2 (Global PTP Clock Synchronized)' : ptpSyncState === 'DRIFTING_HOLDOVER' ? '1 (Local Clock Holdover)' : '0 (Not Synchronized)',
      iaInst: Math.round(effectivePeakCurrent * 0.95),
      ibInst: Math.round(effectivePeakCurrent * -0.47),
      icInst: Math.round(effectivePeakCurrent * -0.48),
      inInst: Math.round(effectivePeakCurrent * 0.02),
      vaInst: Math.round((225000 / Math.sqrt(3)) * Math.SQRT2 * 0.98),
      vbInst: Math.round((225000 / Math.sqrt(3)) * Math.SQRT2 * -0.49),
      vcInst: Math.round((225000 / Math.sqrt(3)) * Math.SQRT2 * -0.49)
    };
  }, [effectivePeakCurrent, muVlanPriority, ptpSyncState]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner: Process Bus & NCIT Architecture */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Waves className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Bus de Process CEI 61850-9-2LE / CEI 61869-9 & Capteurs NCIT Optiques"
                : "IEC 61850-9-2LE / IEC 61869-9 Process Bus Merging Unit & NCIT Simulator"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Échantillonnage numérique à 4800 Hz (96 éch/période à 50Hz) synchronisé par IEEE 1588 PTP. Comparaison tore Rogowski optique vs TC magnétique à fer saturable."
              : "Digital sampling at 4800 Hz (96 samples/cycle at 50Hz) locked via IEEE 1588 PTP. Optical Rogowski coil comparison vs conventional saturable iron-core CT."}
          </p>
        </div>

        {/* Sensor Technology Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSensorTech('ROGOWSKI_OPTICAL_NCIT')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sensorTech === 'ROGOWSKI_OPTICAL_NCIT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? '1. Bobine Rogowski Optique (NCIT)' : '1. Optical Rogowski (NCIT)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSensorTech('CONVENTIONAL_IRON_CORE_CT')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sensorTech === 'CONVENTIONAL_IRON_CORE_CT'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? '2. Transformateur Fer 5A (Saturable)' : '2. Iron-Core CT (Saturable)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Waveform & PTP Synchronization, Right = SV Stream Packet & 87B Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: WAVEFORM SCOPE & SENSING ENGINE (COL 7) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Oscilloscope Temps Réel : Courant Primaire vs Trame Échantillonnée (SV)"
                    : "Real-Time Scope: Primary Current vs Digitized Sampled Value (SV)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold">
                  {samplingRateSps} Hz (9-2LE)
                </span>
                {isCtSaturated && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold animate-pulse">
                    ⚠️ SATURATION FER (COUDE)
                  </span>
                )}
              </div>
            </div>

            {/* SVG Live Oscilloscope */}
            <div className="relative w-full aspect-[16/8] bg-[#05080E] rounded-xl border border-[#1A222E] p-2 overflow-hidden flex flex-col justify-between">
              <svg viewBox="0 0 560 160" className="w-full h-full text-[10px] font-mono select-none">
                {/* Horizontal Center Zero Grid Line */}
                <line x1="20" y1="80" x2="540" y2="80" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="20" y1="20" x2="540" y2="20" stroke="#0F172A" strokeWidth="1" />
                <line x1="20" y1="140" x2="540" y2="140" stroke="#0F172A" strokeWidth="1" />

                {/* Voltage/Current Axis Labels */}
                <text x="25" y="18" fill="#64748B" fontSize="8">+Imax</text>
                <text x="25" y="83" fill="#64748B" fontSize="8">0 A</text>
                <text x="25" y="145" fill="#64748B" fontSize="8">-Imax</text>

                {/* Primary Reference Curve (Cyan dotted) */}
                <polyline
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                  points={waveformPoints.map(p => `${p.x},${p.yTrue}`).join(' ')}
                />

                {/* Digitized Sampled Value Curve (Emerald or Amber if saturated) */}
                <polyline
                  fill="none"
                  stroke={isCtSaturated ? "#F43F5E" : "#10B981"}
                  strokeWidth="2.5"
                  points={waveformPoints.map(p => `${p.x},${p.ySampled}`).join(' ')}
                />

                {/* Discrete IEC 61850 Samples (Dots at each sampling instant) */}
                {waveformPoints.filter((_, idx) => idx % 3 === 0).map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.ySampled}
                    r="2.5"
                    fill={pt.isSaturated ? "#F43F5E" : "#34D399"}
                  />
                ))}
              </svg>

              {/* Legend Bar */}
              <div className="flex items-center justify-between text-[10px] px-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-sky-400 inline-block border-b border-dashed border-sky-400" />
                    <span className="text-slate-400">Courant Réseau Primaire</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-0.5 inline-block ${isCtSaturated ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                    <span className={isCtSaturated ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      Échantillons SV Numérisés (MU)
                    </span>
                  </div>
                </div>

                <div className="text-slate-400">
                  Déphasage Temporel : <span className={`font-bold ${Math.abs(phaseErrorDeg) > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>{phaseErrorDeg.toFixed(1)}°</span>
                </div>
              </div>
            </div>

            {/* Test Fault Multiplier & DC Offset Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Amplitude Défaut Primaire :</span>
                  <span className={`font-bold ${faultCurrentMultiplier > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {faultCurrentMultiplier.toFixed(1)}x In ({Math.round(effectivePeakCurrent)} A crête)
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="25.0"
                  step="0.5"
                  value={faultCurrentMultiplier}
                  onChange={e => setFaultCurrentMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block">
                  {faultCurrentMultiplier > ctSaturationKneeMultiplier
                    ? (sensorTech === 'ROGOWSKI_OPTICAL_NCIT'
                      ? "Rogowski: Linéarité parfaite sans noyau ferreux, saturation impossible."
                      : "TC conventionnel: Saturation sévère du ferromagnétique, perte d'image courant.")
                    : "Régime nominal / faible court-circuit."}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Composante Continue Apériodique :</span>
                  <span className="text-amber-400 font-bold">{dcOffsetPercent} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={dcOffsetPercent}
                  onChange={e => setDcOffsetPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block">
                  Offset asymétrique lors d'enclenchement sur court-circuit franc.
                </span>
              </div>
            </div>
          </div>

          {/* IEEE 1588 PTP Synchronization Quality & Jitter Injection Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Synchronisation PTP IEEE 1588v2 / Power Profile (CEI 61850-9-3)"
                    : "IEEE 1588v2 Precision Time Protocol & Power Profile (IEC 61850-9-3)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                ptpSyncState === 'LOCKED_T1_SUB_100NS'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : ptpSyncState === 'DRIFTING_HOLDOVER'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              }`}>
                {ptpSyncState === 'LOCKED_T1_SUB_100NS' ? 'VERROUILLÉ (< 100 ns)' : ptpSyncState === 'DRIFTING_HOLDOVER' ? 'HOLDOVER TCXO' : 'PERTE SYNCHRO'}
              </span>
            </div>

            {/* PTP State Mode Selector */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { id: 'LOCKED_T1_SUB_100NS', labelFr: '1. GPS Master Locked', labelEn: '1. GPS Master Locked', desc: 'Précision < 50 ns' },
                { id: 'DRIFTING_HOLDOVER', labelFr: '2. Dérive Holdover', labelEn: '2. Clock Holdover', desc: 'Oscillateur local 150 µs' },
                { id: 'UNSYNCHRONIZED_ALARM', labelFr: '3. Perte PTP Totale', labelEn: '3. Loss of Sync (Alarm)', desc: 'Désynchronisation 1.2 ms' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setPtpSyncState(st.id as PtpSyncQuality)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    ptpSyncState === st.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                      : 'bg-[#0D121B] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[11px] block">{locale === 'fr' ? st.labelFr : st.labelEn}</span>
                    <span className="text-[9px] text-slate-500">{st.desc}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[9px]">
                    <span className={`w-2 h-2 rounded-full ${
                      st.id === 'LOCKED_T1_SUB_100NS' ? 'bg-emerald-400' : st.id === 'DRIFTING_HOLDOVER' ? 'bg-amber-400' : 'bg-rose-500'
                    }`} />
                    <span className="font-bold">{st.id === 'LOCKED_T1_SUB_100NS' ? 'PTP CLASS 1' : st.id === 'DRIFTING_HOLDOVER' ? 'DEGRADED' : 'FAULT'}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Manual Jitter Slider */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Gigue / Asymétrie Réseau Injectée (Packet Delay Variation) :</span>
                <span className={`font-bold ${injectedJitterMicroseconds > 100 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {injectedJitterMicroseconds} µs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="10"
                value={injectedJitterMicroseconds}
                onChange={e => setInjectedJitterMicroseconds(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">
                {locale === 'fr'
                  ? "Une désynchronisation temporelle de 100 µs équivaut à un déphasage angulaire de 1.8° sur une onde à 50 Hz, créant un faux courant différentiel au niveau du relais différentiel de barres (ANSI 87B)."
                  : "A 100 µs time skew produces a 1.8° phase shift error at 50 Hz, triggering fictitious differential currents in busbar protection relays (ANSI 87B)."}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: SAMPLE PACKET FRAME & ANSI 87B PROTECTION IMPACT (COL 5) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ANSI 87B Busbar Differential Protection Stability Check */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            isDifferentialProtectionFalseTripping
              ? 'bg-rose-950/30 border-rose-500/70 shadow-rose-950/50'
              : 'bg-[#080C13] border-[#222B38]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${isDifferentialProtectionFalseTripping ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Impact sur Protection Différentielle de Barres (ANSI 87B)"
                    : "Impact on Busbar Differential Protection (ANSI 87B)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isDifferentialProtectionFalseTripping
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isDifferentialProtectionFalseTripping ? 'DÉCLENCHEMENT INTEMPESTIF !' : 'STABLE (RETENUE SAINE)'}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Courant Différentiel Fictif (Idiff) :</span>
                  <span className={`font-bold ${isDifferentialProtectionFalseTripping ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {differentialCurrentFalseAmps} A
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Seuil de Déclenchement ANSI 87B :</span>
                  <span className="text-slate-200">350 A (ou 0.20 Inom)</span>
                </div>
              </div>

              {isDifferentialProtectionFalseTripping ? (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-[11px] font-sans space-y-1">
                  <strong className="font-bold block text-white">
                    {locale === 'fr' ? 'DÉCLENCHEMENT GÉNÉRAL DU POSTE PAR FAUX DIFFÉRENTIEL :' : 'SUBSTATION BLACKOUT TRIGGERED BY SPURIOUS DIFFERENTIAL:'}
                  </strong>
                  <p className="leading-relaxed">
                    {locale === 'fr'
                      ? "Le déphasage induit par le jitter PTP ou la saturation du transformateur conventionnel génère un faux courant Idiff dépassant le seuil 87B. Le relais de barre ordonne le déclenchement de TOUS les départs du poste !"
                      : "Phase shift from PTP clock skew or iron core CT saturation creates an artificial differential current exceeding the 87B pickup threshold. The busbar protection orders total substation trip!"}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans">
                  {locale === 'fr'
                    ? "Courant différentiel résiduel inférieur au seuil de retenue. La protection 87B reste stable sans déclenchement intempestif."
                    : "Residual differential current below stabilization restraint threshold. 87B protection operates stably without false trips."}
                </div>
              )}
            </div>
          </div>

          {/* Real-time IEC 61850-9-2LE / IEC 61869-9 Sampled Value Frame Decoder */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5 font-mono">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Décodeur de Trame SV (IEC 61850-9-2LE Wireshark Emulé)"
                    : "Sampled Values Frame Decoder (IEC 61850-9-2LE)"}
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Couche 2 Ethernet
              </span>
            </div>

            {/* Simulated Protocol Tree View */}
            <div className="p-3 rounded-xl bg-[#05080E] border border-[#1E2634] text-[10px] space-y-2 text-slate-300 overflow-x-auto">
              <div className="text-emerald-400 font-bold">
                &gt; Ethernet II, Src: {simulatedSvPacket.srcMac}, Dst: {simulatedSvPacket.destMac}
              </div>
              <div className="pl-3 text-cyan-300">
                &gt; 802.1Q Virtual LAN, PRI: {simulatedSvPacket.vlanPri}, ID: {simulatedSvPacket.vlanId}, Type: {simulatedSvPacket.etherType} (IEC 61850 SV)
              </div>
              <div className="pl-3 text-amber-300">
                &gt; IEC 61850 Sampled Values Protocol:
              </div>
              <div className="pl-6 space-y-0.5 font-mono text-slate-300">
                <div>APPID: <span className="text-white font-bold">{simulatedSvPacket.appId}</span></div>
                <div>Length: <span className="text-white">{simulatedSvPacket.length} bytes</span></div>
                <div>svID: <span className="text-emerald-300 font-bold">{simulatedSvPacket.svId}</span></div>
                <div>smpCnt: <span className="text-cyan-300 font-bold">{simulatedSvPacket.smpCnt}</span> / 4800 (t = {(simulatedSvPacket.smpCnt / 4800).toFixed(4)} s)</div>
                <div>confRev: <span className="text-slate-400">{simulatedSvPacket.confRev}</span></div>
                <div>smpSynch: <span className={ptpSyncState === 'LOCKED_T1_SUB_100NS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{simulatedSvPacket.smpSynch}</span></div>
              </div>
              
              <div className="pl-3 text-purple-300 pt-1 border-t border-slate-800">
                &gt; Dataset ASDU Instantaneous Measurements (IEEE INT32 / 1 mA & 10 mV LSB):
              </div>
              <div className="pl-6 grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-300 font-mono">
                <div>Phase A: <span className="text-emerald-400 font-bold">{simulatedSvPacket.iaInst} A</span></div>
                <div>Tension A: <span className="text-sky-400 font-bold">{(simulatedSvPacket.vaInst / 1000).toFixed(1)} kV</span></div>
                <div>Phase B: <span className="text-emerald-400">{simulatedSvPacket.ibInst} A</span></div>
                <div>Tension B: <span className="text-sky-400">{(simulatedSvPacket.vbInst / 1000).toFixed(1)} kV</span></div>
                <div>Phase C: <span className="text-emerald-400">{simulatedSvPacket.icInst} A</span></div>
                <div>Tension C: <span className="text-sky-400">{(simulatedSvPacket.vcInst / 1000).toFixed(1)} kV</span></div>
                <div>Neutre: <span className="text-slate-400">{simulatedSvPacket.inInst} A</span></div>
                <div>Qualité SV: <span className="text-emerald-400 font-bold">VALID (0x00000000)</span></div>
              </div>
            </div>

            {/* Explanatory Caption */}
            <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] text-[10px] text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Norme CEI 61869-9 / 61850-9-2LE : 80 échantillons par période à 50 Hz ou 96 éch/période (4800 Hz). Émission en multicast direct couche 2 sans pile TCP/IP, garantissant un déterminisme strict sub-milliseconde."
                : "IEC 61869-9 / 61850-9-2LE standard: 80 or 96 samples per cycle (4800 Hz). Multicast Layer-2 streaming without TCP/IP overhead guarantees deterministic delivery under 1 millisecond."}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
