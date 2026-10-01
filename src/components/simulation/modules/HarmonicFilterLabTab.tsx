// src/components/simulation/modules/HarmonicFilterLabTab.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Download,
  Copy,
  FileText,
  Printer
} from 'lucide-react';

interface HarmonicFilterLabTabProps {
  locale: 'fr' | 'en';
}

export type GridPresetId = 'sonatrel_225kv' | 'douala_30kv' | 'mv_plant_15kv' | 'lv_plant_400v';
export type LoadPresetId = 'vfd_6pulse' | 'vfd_12pulse' | 'arc_furnace' | 'solar_ev_hub' | 'custom';
export type FilterTopology = 'none' | 'standard_cap' | 'detuned_reactor' | 'single_tuned' | 'high_pass' | 'active_apf';

export const HarmonicFilterLabTab: React.FC<HarmonicFilterLabTabProps> = ({ locale }) => {
  // ---------------------------------------------------------------------------
  // 1. SYSTEM & GRID PARAMETERS
  // ---------------------------------------------------------------------------
  const [gridPreset, setGridPreset] = useState<GridPresetId>('douala_30kv');
  const [unKv, setUnKv] = useState<number>(30); // Nominal voltage (kV LL)
  const [sscMva, setSscMva] = useState<number>(350); // Grid short-circuit power (MVA)
  const [xrRatio, setXrRatio] = useState<number>(10); // Grid X/R ratio
  const [f1Hz] = useState<number>(50); // 50 Hz fundamental

  // ---------------------------------------------------------------------------
  // 2. LOAD & HARMONIC EMISSION PARAMETERS
  // ---------------------------------------------------------------------------
  const [loadPreset, setLoadPreset] = useState<LoadPresetId>('vfd_6pulse');
  const [pLoadMw, setPLoadMw] = useState<number>(8.5); // Fundamental active power (MW)
  const [cosPhiLoad, setCosPhiLoad] = useState<number>(0.82); // Initial displacement power factor (lagging)
  
  // Harmonic injection currents (% of fundamental I1)
  const [ihPct, setIhPct] = useState<{ [h: number]: number }>({
    3: 3,
    5: 22,
    7: 15,
    11: 9,
    13: 7,
    17: 4.5,
    19: 3.5,
    23: 2.5,
    25: 2.0
  });

  // ---------------------------------------------------------------------------
  // 3. FILTER / COMPENSATION PARAMETERS
  // ---------------------------------------------------------------------------
  const [topology, setTopology] = useState<FilterTopology>('detuned_reactor');
  const [qcMvar, setQcMvar] = useState<number>(3.5); // Nominal reactive power rating (MVAR)
  const [detuningFactorPct, setDetuningFactorPct] = useState<number>(7.0); // p = 7% (189 Hz), 5.67% (210 Hz), 14% (134 Hz)
  const [tunedHarmonicOrder, setTunedHarmonicOrder] = useState<number>(4.8); // Tuning order for single-tuned (e.g. 4.8h = 240 Hz)
  const [filterQualityFactor, setFilterQualityFactor] = useState<number>(45); // Quality factor Q = X0 / R
  const [highPassCornerOrder, setHighPassCornerOrder] = useState<number>(11.0); // Corner order for high-pass
  const [apfEfficiencyPct, setApfEfficiencyPct] = useState<number>(92); // Active filter compensation efficiency (%)

  // ---------------------------------------------------------------------------
  // 4. DISPLAY CONTROLS
  // ---------------------------------------------------------------------------
  const [displayDomain, setDisplayDomain] = useState<'impedance' | 'waveform' | 'spectrum' | 'bom'>('impedance');
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  // Canvases
  const impedanceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Hover Probe for Impedance Canvas (1)
  const [impedanceHover, setImpedanceHover] = useState<{
    f: number;
    zBus: number;
    zGrid: number;
    x: number;
    y: number;
  } | null>(null);

  // Waveform Scope Controls (3)
  const [showFundamentalRef, setShowFundamentalRef] = useState<boolean>(true);
  const [showUnfilteredOverlay, setShowUnfilteredOverlay] = useState<boolean>(true);
  const [waveformTimeShift, setWaveformTimeShift] = useState<number>(0);

  // ---------------------------------------------------------------------------
  // PRESET HANDLERS
  // ---------------------------------------------------------------------------
  const applyGridPreset = (preset: GridPresetId) => {
    setGridPreset(preset);
    if (preset === 'sonatrel_225kv') {
      setUnKv(225);
      setSscMva(3500);
      setXrRatio(15);
      setPLoadMw(120);
      setQcMvar(40);
    } else if (preset === 'douala_30kv') {
      setUnKv(30);
      setSscMva(350);
      setXrRatio(10);
      setPLoadMw(8.5);
      setQcMvar(3.5);
    } else if (preset === 'mv_plant_15kv') {
      setUnKv(15);
      setSscMva(180);
      setXrRatio(8);
      setPLoadMw(4.0);
      setQcMvar(1.5);
    } else if (preset === 'lv_plant_400v') {
      setUnKv(0.4);
      setSscMva(15);
      setXrRatio(3.5);
      setPLoadMw(0.45);
      setQcMvar(0.18);
    }
  };

  const applyLoadPreset = (preset: LoadPresetId) => {
    setLoadPreset(preset);
    if (preset === 'vfd_6pulse') {
      setIhPct({ 3: 3, 5: 22, 7: 15, 11: 9, 13: 7, 17: 4.5, 19: 3.5, 23: 2.5, 25: 2.0 });
    } else if (preset === 'vfd_12pulse') {
      setIhPct({ 3: 1, 5: 3, 7: 2, 11: 10, 13: 8, 17: 1.5, 19: 1.2, 23: 3.5, 25: 3.0 });
    } else if (preset === 'arc_furnace') {
      setIhPct({ 3: 18, 5: 28, 7: 20, 11: 12, 13: 9, 17: 6.5, 19: 5.0, 23: 3.5, 25: 2.8 });
    } else if (preset === 'solar_ev_hub') {
      setIhPct({ 3: 8, 5: 14, 7: 9, 11: 6, 13: 4, 17: 3.0, 19: 2.5, 23: 1.5, 25: 1.0 });
    }
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL & PHYSICAL COMPUTATIONS
  // ---------------------------------------------------------------------------
  const omega1 = 2 * Math.PI * f1Hz; // rad/s
  const vPhNomVolts = (unKv * 1000) / Math.sqrt(3);

  // Fundamental Grid Impedance (Thevenin equivalent)
  const zscMag = (unKv * unKv) / sscMva; // Ohms at fundamental
  const thetaGrid = Math.atan(xrRatio);
  const rsc = zscMag * Math.cos(thetaGrid); // Ohms
  const xsc1 = zscMag * Math.sin(thetaGrid); // Ohms
  const lsc = xsc1 / omega1; // Henry

  // Fundamental Load Current
  const i1FundAmps = (pLoadMw * 1e6) / (Math.sqrt(3) * (unKv * 1e3) * cosPhiLoad);

  // Capacitor Fundamental Reactance and Capacitance
  // Q_c = 3 * Vph^2 / X_c => X_c = (U_n)^2 / Q_c
  const xc1Nom = (unKv * unKv) / Math.max(qcMvar, 0.001); // Ohms
  const cFarads = 1 / (omega1 * xc1Nom); // Farads
  const cMicroFarads = cFarads * 1e6;

  // Filter Branch Reactances depending on topology
  let pFrac = 0;
  let xl1 = 0;
  let lFilterH = 0;
  let rFilterOhm = 0;
  let fResHz = 0;
  let hRes = 0;
  let vCapacitorRisePct = 0;

  if (topology === 'standard_cap') {
    // Pure capacitor
    hRes = Math.sqrt(xc1Nom / xsc1);
    fResHz = f1Hz * hRes;
  } else if (topology === 'detuned_reactor') {
    pFrac = detuningFactorPct / 100;
    xl1 = pFrac * xc1Nom; // Ohms
    lFilterH = xl1 / omega1;
    rFilterOhm = xl1 / 25; // Small internal coil resistance
    // Natural resonant frequency of LC branch: f_tuning = f1 / sqrt(p)
    fResHz = f1Hz / Math.sqrt(pFrac);
    hRes = 1 / Math.sqrt(pFrac);
    // Capacitor overvoltage due to series reactor: Uc = Un / (1 - p)
    vCapacitorRisePct = (pFrac / (1 - pFrac)) * 100;
  } else if (topology === 'single_tuned') {
    // Tuned precisely to tunedHarmonicOrder
    const ht = tunedHarmonicOrder;
    xl1 = xc1Nom / (ht * ht);
    lFilterH = xl1 / omega1;
    const x0 = Math.sqrt(xl1 * xc1Nom);
    rFilterOhm = x0 / Math.max(filterQualityFactor, 1);
    fResHz = f1Hz * ht;
    hRes = ht;
    vCapacitorRisePct = (1 / (ht * ht - 1)) * 100;
  } else if (topology === 'high_pass') {
    const ht = highPassCornerOrder;
    xl1 = xc1Nom / (ht * ht);
    lFilterH = xl1 / omega1;
    const x0 = Math.sqrt(xl1 * xc1Nom);
    rFilterOhm = x0 * 1.5; // Damping resistor in parallel with L
    fResHz = f1Hz * ht;
    hRes = ht;
  }

  // Frequency response impedance evaluation helper Z_bus(f)
  const computeBusImpedance = (f: number) => {
    const h = f / f1Hz;
    const w = 2 * Math.PI * f;

    // Grid impedance at freq f: Z_grid = R_sc + j * w * L_sc
    const rGrid = rsc;
    const xGrid = w * lsc;

    if (topology === 'none') {
      return {
        r: rGrid,
        x: xGrid,
        mag: Math.sqrt(rGrid * rGrid + xGrid * xGrid)
      };
    }

    if (topology === 'active_apf') {
      // APF acts as a virtual damping conductance or cancels current
      // Effective grid impedance is damped
      const dampingFactor = 0.35;
      const mag = Math.sqrt(rGrid * rGrid + xGrid * xGrid) * dampingFactor;
      return { r: rGrid * dampingFactor, x: xGrid * dampingFactor, mag };
    }

    // Passive Branch impedance Z_b = R_b + j * X_b
    let rb = 0;
    let xb = 0;

    const xc_f = 1 / (w * cFarads);

    if (topology === 'standard_cap') {
      rb = 0.05; // tiny internal dissipation
      xb = -xc_f;
    } else if (topology === 'detuned_reactor' || topology === 'single_tuned') {
      const xl_f = w * lFilterH;
      rb = rFilterOhm;
      xb = xl_f - xc_f;
    } else if (topology === 'high_pass') {
      // Series C with parallel R-L
      const xl_f = w * lFilterH;
      const rp = rFilterOhm;
      // Z_parallel_RL = (j*xl * rp) / (rp + j*xl) = (xl^2 * rp + j * xl * rp^2) / (rp^2 + xl^2)
      const denom = rp * rp + xl_f * xl_f;
      const r_rl = (xl_f * xl_f * rp) / denom;
      const x_rl = (xl_f * rp * rp) / denom;
      rb = r_rl;
      xb = x_rl - xc_f;
    }

    // Parallel combination Z_parallel = (Z_grid * Z_b) / (Z_grid + Z_b)
    // Numerator: (rGrid + j*xGrid) * (rb + j*xb) = (rGrid*rb - xGrid*xb) + j*(rGrid*xb + xGrid*rb)
    const numR = rGrid * rb - xGrid * xb;
    const numX = rGrid * xb + xGrid * rb;
    // Denominator: (rGrid + rb) + j*(xGrid + xb)
    const denR = rGrid + rb;
    const denX = xGrid + xb;
    const denMag2 = denR * denR + denX * denX;

    if (denMag2 < 1e-9) {
      return { r: 1e5, x: 0, mag: 1e5 };
    }

    const rRes = (numR * denR + numX * denX) / denMag2;
    const xRes = (numX * denR - numR * denX) / denMag2;
    const mag = Math.sqrt(rRes * rRes + xRes * xRes);

    return { r: rRes, x: xRes, mag };
  };

  // ---------------------------------------------------------------------------
  // HARMONIC DISTORTION & IEEE 519 EVALUATION
  // ---------------------------------------------------------------------------
  const harmonicOrders = [3, 5, 7, 11, 13, 17, 19, 23, 25];

  interface HarmonicMetric {
    h: number;
    f: number;
    iInjA: number;
    zBusMagUnfiltered: number;
    zBusMagFiltered: number;
    vhVoltsUnfiltered: number;
    vhVoltsFiltered: number;
    hdvPctUnfiltered: number;
    hdvPctFiltered: number;
    hdiPctFiltered: number;
    ieeeLimitPct: number;
    compliant: boolean;
  }

  const harmonicMetrics: HarmonicMetric[] = useMemo(() => {
    return harmonicOrders.map((h) => {
      const f = h * f1Hz;
      const iInjA = (i1FundAmps * (ihPct[h] || 0)) / 100;

      // Unfiltered grid impedance at harmonic h
      const zGridH = Math.sqrt(rsc * rsc + Math.pow(h * xsc1, 2));
      const vhUnfiltered = iInjA * zGridH;
      const hdvUnfiltered = (vhUnfiltered / vPhNomVolts) * 100;

      // Filtered bus impedance at harmonic h
      let zBusFiltered = computeBusImpedance(f).mag;
      let vhFiltered = iInjA * zBusFiltered;

      if (topology === 'active_apf') {
        const remainingFraction = 1 - apfEfficiencyPct / 100;
        vhFiltered = vhUnfiltered * remainingFraction;
        zBusFiltered = zGridH * remainingFraction;
      }

      const hdvFiltered = (vhFiltered / vPhNomVolts) * 100;

      // Current harmonic flowing to grid
      const ihGrid = vhFiltered / Math.max(zGridH, 1e-4);
      const hdiFiltered = (ihGrid / i1FundAmps) * 100;

      // IEEE 519-2022 individual harmonic voltage limits
      // V <= 1.0 kV: 5.0%
      // 1.0 kV < V <= 69 kV: 3.0%
      // 69 kV < V <= 161 kV: 1.5%
      // V > 161 kV: 1.0%
      let ieeeLimit = 3.0;
      if (unKv <= 1.0) ieeeLimit = 5.0;
      else if (unKv <= 69) ieeeLimit = 3.0;
      else if (unKv <= 161) ieeeLimit = 1.5;
      else ieeeLimit = 1.0;

      return {
        h,
        f,
        iInjA,
        zBusMagUnfiltered: zGridH,
        zBusMagFiltered: zBusFiltered,
        vhVoltsUnfiltered: vhUnfiltered,
        vhVoltsFiltered: vhFiltered,
        hdvPctUnfiltered: hdvUnfiltered,
        hdvPctFiltered: hdvFiltered,
        hdiPctFiltered: hdiFiltered,
        ieeeLimitPct: ieeeLimit,
        compliant: hdvFiltered <= ieeeLimit
      };
    });
  }, [
    harmonicOrders,
    f1Hz,
    i1FundAmps,
    ihPct,
    rsc,
    xsc1,
    vPhNomVolts,
    topology,
    apfEfficiencyPct,
    unKv,
    qcMvar,
    detuningFactorPct,
    tunedHarmonicOrder,
    filterQualityFactor,
    highPassCornerOrder
  ]);

  // Overall Total Harmonic Distortion (THD)
  const thdVUnfiltered = Math.sqrt(
    harmonicMetrics.reduce((acc, m) => acc + Math.pow(m.hdvPctUnfiltered, 2), 0)
  );

  const thdVFiltered = Math.sqrt(
    harmonicMetrics.reduce((acc, m) => acc + Math.pow(m.hdvPctFiltered, 2), 0)
  );

  const thdIFiltered = Math.sqrt(
    harmonicMetrics.reduce((acc, m) => acc + Math.pow(m.hdiPctFiltered, 2), 0)
  );

  // IEEE 519 THD limit
  let ieeeThdLimit = 5.0;
  if (unKv <= 1.0) ieeeThdLimit = 8.0;
  else if (unKv <= 69) ieeeThdLimit = 5.0;
  else if (unKv <= 161) ieeeThdLimit = 2.5;
  else ieeeThdLimit = 1.5;

  const isThdCompliant = thdVFiltered <= ieeeThdLimit;
  const isIndividualAllCompliant = harmonicMetrics.every((m) => m.compliant);

  // Power Factor improvement
  const qLoadMvar = pLoadMw * Math.tan(Math.acos(cosPhiLoad));
  let qFilterFundMvar = 0;
  if (topology === 'standard_cap') {
    qFilterFundMvar = qcMvar;
  } else if (topology === 'detuned_reactor') {
    // Q_net = Q_c / (1 - p)
    qFilterFundMvar = qcMvar / (1 - pFrac);
  } else if (topology === 'single_tuned') {
    const ht = tunedHarmonicOrder;
    qFilterFundMvar = qcMvar * (ht * ht / (ht * ht - 1));
  } else if (topology === 'active_apf') {
    qFilterFundMvar = qLoadMvar * 0.85; // APF can also compensate reactive power
  }

  const qNetMvar = Math.max(0, qLoadMvar - qFilterFundMvar);
  const sNetMva = Math.sqrt(pLoadMw * pLoadMw + qNetMvar * qNetMvar);
  const cosPhiCompensated = Math.min(0.999, pLoadMw / sNetMva);

  // Resonance Risk Level
  let resonanceAlert: 'none' | 'critical' | 'warning' = 'none';
  let resonanceMessage = '';
  if (topology === 'standard_cap') {
    const diff5 = Math.abs(hRes - 5);
    const diff7 = Math.abs(hRes - 7);
    if (diff5 < 0.4 || diff7 < 0.4) {
      resonanceAlert = 'critical';
      resonanceMessage =
        locale === 'fr'
          ? `DANGER CRITIQUE DE RÉSONANCE PARALLÈLE ! Le rang propre (${hRes.toFixed(2)}h = ${fResHz.toFixed(1)} Hz) coïncide avec une harmonique injectée majeure (rang ${diff5 < 0.4 ? '5' : '7'}). Risque d'explosion condensateur et surtensions destructrices !`
          : `CRITICAL PARALLEL RESONANCE HAZARD! Natural tuning (${hRes.toFixed(2)}h = ${fResHz.toFixed(1)} Hz) closely matches a dominant harmonic order (order ${diff5 < 0.4 ? '5' : '7'}). Severe risk of capacitor destruction and excessive voltage magnification!`;
    } else if (diff5 < 0.8 || diff7 < 0.8) {
      resonanceAlert = 'warning';
      resonanceMessage =
        locale === 'fr'
          ? `Attention : résonance parallèle proche d'un rang harmonique (${hRes.toFixed(2)}h). Risque d'amplification d'harmoniques.`
          : `Warning: parallel resonance near a harmonic order (${hRes.toFixed(2)}h). Harmonic amplification hazard.`;
    }
  }

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 1: IMPEDANCE SPECTRUM |Z(f)|
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (displayDomain !== 'impedance' || !impedanceCanvasRef.current) return;
    const canvas = impedanceCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background & grid
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    const padLeft = 60;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 40;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Freq range: 25 Hz to 1300 Hz
    const fMin = 25;
    const fMax = 1300;

    // Calculate maximum impedance in range for vertical scaling
    let maxZ = 0;
    for (let f = fMin; f <= fMax; f += 2) {
      const z = computeBusImpedance(f).mag;
      if (z > maxZ) maxZ = z;
    }
    maxZ = Math.min(Math.max(maxZ * 1.15, zscMag * 15, 10), 500); // sensible ceiling

    // Draw horizontal grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '10px JetBrains Mono, monospace';

    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (maxZ / yTicks) * i;
      const y = padTop + plotH - (i / yTicks) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
      ctx.fillText(`${val.toFixed(1)} Ω`, 10, y + 3);
    }

    // Draw vertical frequency lines for characteristic harmonics
    const harmLines = [3, 5, 7, 11, 13, 17, 19, 23, 25];
    harmLines.forEach((h) => {
      const f = h * f1Hz;
      if (f > fMax) return;
      const x = padLeft + ((f - fMin) / (fMax - fMin)) * plotW;

      ctx.strokeStyle = '#1E293B';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.fillText(`${h}h`, x, padTop + plotH + 15);
      ctx.fillText(`${f}Hz`, x, padTop + plotH + 26);
    });

    // 1. Draw Grid Pure Inductive Impedance curve (dashed gray)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let f = fMin; f <= fMax; f += 5) {
      const w = 2 * Math.PI * f;
      const zGrid = Math.sqrt(rsc * rsc + w * lsc * (w * lsc));
      const x = padLeft + ((f - fMin) / (fMax - fMin)) * plotW;
      const y = padTop + plotH - Math.min(zGrid / maxZ, 1) * plotH;
      if (f === fMin) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Combined Bus Impedance Curve |Z_total(f)|
    ctx.strokeStyle =
      topology === 'none'
        ? '#38BDF8'
        : topology === 'standard_cap'
        ? '#F43F5E'
        : '#10B981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let peakX = 0;
    let peakY = 0;
    let peakVal = 0;

    for (let f = fMin; f <= fMax; f += 1.5) {
      const z = computeBusImpedance(f).mag;
      if (z > peakVal) {
        peakVal = z;
        peakX = padLeft + ((f - fMin) / (fMax - fMin)) * plotW;
        peakY = padTop + plotH - Math.min(z / maxZ, 1) * plotH;
      }
      const x = padLeft + ((f - fMin) / (fMax - fMin)) * plotW;
      const y = padTop + plotH - Math.min(z / maxZ, 1) * plotH;
      if (f === fMin) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // If parallel resonance exists, mark the peak
    if (topology === 'standard_cap' && peakVal > 0) {
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#FECDD3';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Pic Résonance : ${peakVal.toFixed(1)} Ω (${fResHz.toFixed(0)} Hz)`,
        peakX,
        Math.max(peakY - 12, padTop + 10)
      );
    }

    // Legend
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.fillText('-- Réseau sans filtre (Z_grid)', padLeft + 10, padTop + 15);
    ctx.fillStyle =
      topology === 'none'
        ? '#38BDF8'
        : topology === 'standard_cap'
        ? '#F43F5E'
        : '#10B981';
    ctx.fillText(
      `— Impédance résultante au PCC (${topology.toUpperCase()})`,
      padLeft + 220,
      padTop + 15
    );

    // 3. Interactive Hover Probe
    if (impedanceHover) {
      // Draw vertical probe line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(impedanceHover.x, padTop);
      ctx.lineTo(impedanceHover.x, padTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point on combined bus curve
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(impedanceHover.x, impedanceHover.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Tooltip box
      const ttW = 175;
      const ttH = 48;
      let ttX = impedanceHover.x + 10;
      if (ttX + ttW > width - 10) ttX = impedanceHover.x - ttW - 10;
      const ttY = Math.max(padTop + 5, Math.min(impedanceHover.y - 20, padTop + plotH - ttH - 5));

      ctx.fillStyle = '#0B111A';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(ttX, ttY, ttW, ttH, 6);
      } else {
        ctx.rect(ttX, ttY, ttW, ttH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`f: ${impedanceHover.f.toFixed(1)} Hz (H${(impedanceHover.f / f1Hz).toFixed(2)})`, ttX + 8, ttY + 16);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`|Z_bus|: ${impedanceHover.zBus.toFixed(2)} Ω`, ttX + 8, ttY + 30);
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`Z_grid: ${impedanceHover.zGrid.toFixed(2)} Ω`, ttX + 8, ttY + 42);
    }
  }, [
    displayDomain,
    unKv,
    sscMva,
    xrRatio,
    qcMvar,
    topology,
    detuningFactorPct,
    tunedHarmonicOrder,
    filterQualityFactor,
    highPassCornerOrder,
    locale,
    impedanceHover
  ]);

  // Mouse handlers for Impedance Canvas probe
  const handleImpedanceMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = impedanceCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;

    const padLeft = 60;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 40;
    const plotW = canvas.width - padLeft - padRight;
    const plotH = canvas.height - padTop - padBottom;
    const fMin = 25;
    const fMax = 1300;

    if (mouseX < padLeft || mouseX > padLeft + plotW) {
      setImpedanceHover(null);
      return;
    }

    const f = fMin + ((mouseX - padLeft) / plotW) * (fMax - fMin);
    const zBus = computeBusImpedance(f).mag;
    const w = 2 * Math.PI * f;
    const zGrid = Math.sqrt(rsc * rsc + w * lsc * (w * lsc));

    let maxZ = 0;
    for (let fTemp = fMin; fTemp <= fMax; fTemp += 5) {
      const z = computeBusImpedance(fTemp).mag;
      if (z > maxZ) maxZ = z;
    }
    maxZ = Math.min(Math.max(maxZ * 1.15, zscMag * 15, 10), 500);

    const y = padTop + plotH - Math.min(zBus / maxZ, 1) * plotH;

    setImpedanceHover({
      f,
      zBus,
      zGrid,
      x: mouseX,
      y
    });
  };

  const handleImpedanceMouseLeave = () => {
    setImpedanceHover(null);
  };

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 2: WAVEFORM SCOPE (Time Domain v(t) & i(t))
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (displayDomain !== 'waveform' || !waveformCanvasRef.current) return;
    const canvas = waveformCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    const padLeft = 50;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 30;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;
    const midY = padTop + plotH / 2;

    // Grid center line
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, midY);
    ctx.lineTo(padLeft + plotW, midY);
    ctx.stroke();

    // Time window: 2 full cycles (40 ms at 50 Hz)
    const tTotal = 0.04;
    const samples = 300;

    // Helper to evaluate instantaneous phase voltage v(t) in per-unit
    const evalVoltagePu = (t: number, filtered: boolean) => {
      // Fundamental component
      let val = Math.sin(omega1 * t);

      // Add harmonic distortions
      harmonicMetrics.forEach((m) => {
        const hdv = filtered ? m.hdvPctFiltered : m.hdvPctUnfiltered;
        const magPu = hdv / 100;
        // Phase angle approximation
        const phi = (m.h * Math.PI) / 4;
        val += magPu * Math.sin(m.h * omega1 * t + phi);
      });
      return val;
    };

    // Helper to evaluate instantaneous current i(t) in per-unit
    const evalCurrentPu = (t: number, filtered: boolean) => {
      // Fundamental current lagging by phi
      const phi1 = Math.acos(cosPhiLoad);
      let val = Math.sin(omega1 * t - (filtered ? Math.acos(cosPhiCompensated) : phi1));

      harmonicMetrics.forEach((m) => {
        const hdi = filtered ? m.hdiPctFiltered : ihPct[m.h] || 0;
        const magPu = hdi / 100;
        const phi = (m.h * Math.PI) / 6;
        val += magPu * Math.sin(m.h * omega1 * t - phi);
      });
      return val;
    };

    // Draw Pure Fundamental Ideal Reference (dashed white) if enabled
    if (showFundamentalRef) {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * tTotal + waveformTimeShift;
        const vFund = Math.sin(omega1 * t);
        const x = padLeft + (i / samples) * plotW;
        const y = midY - vFund * (plotH * 0.38);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 0. Optional: Raw Unfiltered Voltage Overlay
    if (showUnfilteredOverlay && topology !== 'none') {
      ctx.strokeStyle = '#F43F5E70';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * tTotal + waveformTimeShift;
        const vRaw = evalVoltagePu(t, false);
        const x = padLeft + (i / samples) * plotW;
        const y = midY - vRaw * (plotH * 0.38);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 1. Draw Distorted Voltage v(t) (Resulting)
    ctx.strokeStyle = isThdCompliant ? '#06B6D4' : '#F43F5E';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tTotal + waveformTimeShift;
      const v = evalVoltagePu(t, true);
      const x = padLeft + (i / samples) * plotW;
      const y = midY - v * (plotH * 0.38);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Draw Distorted Current i(t) (Resulting)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tTotal + waveformTimeShift;
      const iCur = evalCurrentPu(t, true);
      const x = padLeft + (i / samples) * plotW;
      const y = midY - iCur * (plotH * 0.38);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legend & Time markers
    ctx.fillStyle = '#64748B';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('0 ms', padLeft, padTop + plotH + 15);
    ctx.fillText('10 ms (T/2)', padLeft + plotW * 0.25, padTop + plotH + 15);
    ctx.fillText('20 ms (1 période)', padLeft + plotW * 0.5, padTop + plotH + 15);
    ctx.fillText('40 ms (2 périodes)', padLeft + plotW - 60, padTop + plotH + 15);

    ctx.fillStyle = isThdCompliant ? '#06B6D4' : '#F43F5E';
    ctx.fillText(`— Tension résultante v(t) [THD_v = ${thdVFiltered.toFixed(2)}%]`, padLeft + 10, padTop + 15);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText(`— Courant réseau i(t) [THD_i = ${thdIFiltered.toFixed(2)}%]`, padLeft + 270, padTop + 15);
    if (showUnfilteredOverlay && topology !== 'none') {
      ctx.fillStyle = '#F43F5E';
      ctx.fillText(`-- Tension brute non-filtrée`, padLeft + 510, padTop + 15);
    }
  }, [
    displayDomain,
    harmonicMetrics,
    thdVFiltered,
    thdIFiltered,
    cosPhiLoad,
    cosPhiCompensated,
    isThdCompliant,
    omega1,
    showFundamentalRef,
    showUnfilteredOverlay,
    waveformTimeShift,
    topology
  ]);

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 3: HARMONIC SPECTRUM BAR CHART
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (displayDomain !== 'spectrum' || !spectrumCanvasRef.current) return;
    const canvas = spectrumCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    const padLeft = 60;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 40;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxBar = Math.max(
      ...harmonicMetrics.map((m) => Math.max(m.hdvPctUnfiltered, m.hdvPctFiltered)),
      ieeeThdLimit,
      10
    );

    // Horizontal grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '10px JetBrains Mono, monospace';

    for (let i = 0; i <= 5; i++) {
      const val = (maxBar / 5) * i;
      const y = padTop + plotH - (i / 5) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
      ctx.fillText(`${val.toFixed(1)}%`, 15, y + 3);
    }

    // Draw IEEE Limit horizontal line
    const yLimit = padTop + plotH - (harmonicMetrics[0]?.ieeeLimitPct / maxBar) * plotH;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padLeft, yLimit);
    ctx.lineTo(padLeft + plotW, yLimit);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#FCA5A5';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Limite IEEE 519 (${harmonicMetrics[0]?.ieeeLimitPct}% max)`,
      padLeft + plotW,
      yLimit - 6
    );

    // Bars for each harmonic
    const barGroupWidth = plotW / harmonicMetrics.length;
    const barWidth = barGroupWidth * 0.35;

    harmonicMetrics.forEach((m, idx) => {
      const groupX = padLeft + idx * barGroupWidth;

      // 1. Unfiltered bar (grayish red)
      const hUnfiltered = (m.hdvPctUnfiltered / maxBar) * plotH;
      const yUnfiltered = padTop + plotH - hUnfiltered;
      ctx.fillStyle = '#475569';
      ctx.fillRect(groupX + 5, yUnfiltered, barWidth, hUnfiltered);

      // 2. Filtered bar (emerald or bright rose if non-compliant)
      const hFiltered = (m.hdvPctFiltered / maxBar) * plotH;
      const yFiltered = padTop + plotH - hFiltered;
      ctx.fillStyle = m.compliant ? '#10B981' : '#F43F5E';
      ctx.fillRect(groupX + 5 + barWidth + 3, yFiltered, barWidth, hFiltered);

      // Harmonic label on X axis
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.fillText(`H${m.h}`, groupX + barGroupWidth / 2, padTop + plotH + 15);
      ctx.fillText(`${m.f}Hz`, groupX + barGroupWidth / 2, padTop + plotH + 27);
    });

    // Legend
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.fillRect(padLeft + 10, padTop + 10, 12, 10);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(
      locale === 'fr' ? 'Sans filtre / Brut' : 'Unfiltered raw',
      padLeft + 28,
      padTop + 18
    );

    ctx.fillStyle = '#10B981';
    ctx.fillRect(padLeft + 160, padTop + 10, 12, 10);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(
      locale === 'fr' ? 'Avec solution de filtrage' : 'With filtered solution',
      padLeft + 178,
      padTop + 18
    );
  }, [displayDomain, harmonicMetrics, ieeeThdLimit, locale]);

  // ---------------------------------------------------------------------------
  // BILL OF MATERIALS (BOM) & DETAILED SIZING (4)
  // ---------------------------------------------------------------------------
  const bomMetrics = useMemo(() => {
    const cStarUf = cMicroFarads;
    const cDeltaUf = cMicroFarads / 3;
    const iFundA = (qcMvar * 1e6) / (Math.sqrt(3) * unKv * 1e3);
    const iHarmSumSq = harmonicMetrics.reduce((sum, m) => sum + Math.pow(m.iInjA, 2), 0);
    const iRmsA = Math.sqrt(iFundA * iFundA + iHarmSumSq);

    // Capacitor dielectric ratings
    const vCapPhaseFundKv = (unKv / Math.sqrt(3)) * (1 + vCapacitorRisePct / 100);
    const vCapRatedMinKv = (unKv * (1 + vCapacitorRisePct / 100)) * 1.1; // 10% safety margin per IEC 60871

    // Dissipation losses
    const pCapLossKw = (qcMvar * 1000) * 0.0002; // typical 0.2 W/kVAR
    const rReactorEff = rFilterOhm > 0 ? rFilterOhm : (topology === 'detuned_reactor' ? 0.08 : 0.05);
    const pReactorLossKw = (topology === 'detuned_reactor' || topology === 'single_tuned' || topology === 'high_pass')
      ? (3 * Math.pow(iRmsA, 2) * rReactorEff) / 1000
      : 0;
    const pTotalLossKw = pCapLossKw + pReactorLossKw;
    const coolingAirFlowM3h = Math.round(pTotalLossKw * 310);
    const iSatReactorA = iRmsA * 1.8; // Linear core threshold (IEC 60076-6)

    return {
      cStarUf,
      cDeltaUf,
      iFundA,
      iRmsA,
      vCapPhaseFundKv,
      vCapRatedMinKv,
      pCapLossKw,
      pReactorLossKw,
      pTotalLossKw,
      coolingAirFlowM3h,
      iSatReactorA,
      rReactorEff
    };
  }, [cMicroFarads, qcMvar, unKv, vCapacitorRisePct, harmonicMetrics, rFilterOhm, topology]);

  // Generate formal engineering calculation note
  const generateFullEngineeringNote = () => {
    return `================================================================================
CONSEIL SUPÉRIEUR D'INGÉNIERIE & ARCHITECTURE NUMÉRIQUE - EPEDE
NOTE DE CALCUL DE DIMENSIONNEMENT DU FILTRAGE HARMONIQUE & AUDIT DE CONFORMITÉ
RÉFÉRENTIELS : IEEE 519-2022 / CEI 61000-3-6 / CEI 60871-1 / CEI 60076-6
================================================================================
Date du calcul : ${new Date().toISOString().split('T')[0]}
Point de Raccordement Commun (PCC) : ${gridPreset.toUpperCase()}
Tension Nominale Réseau (Un) : ${unKv} kV (Ph-Ph)
Puissance de Court-Circuit (Ssc) : ${sscMva} MVA | Rapport X/R : ${xrRatio}
Courant de Court-Circuit (Isc) : ${((sscMva * 1e3) / (Math.sqrt(3) * unKv)).toFixed(1)} A

1. CARACTÉRISTIQUES DE LA CHARGE NON-LINÉAIRE
--------------------------------------------------------------------------------
- Profil de charge : ${loadPreset.toUpperCase()}
- Puissance active appelée : ${pLoadMw} MW
- Facteur de puissance initial (cos phi 0) : ${cosPhiLoad.toFixed(2)} (Inductif)
- Facteur de puissance après compensation : ${cosPhiCompensated.toFixed(3)}
- Courant fondamental de charge : ${((pLoadMw * 1e3) / (Math.sqrt(3) * unKv * cosPhiLoad)).toFixed(1)} A
- THD tension initial au PCC : ${thdVUnfiltered.toFixed(2)} % (NON-CONFORME sans filtre)

2. TOPOLOGIE DE MITIGATION & DIMENSIONNEMENT ÉLECTROTECHNIQUE
--------------------------------------------------------------------------------
- Topologie retenue : ${topology.toUpperCase()}
- Puissance réactive installée (Qc) : ${qcMvar} MVAR
- Capacité par phase (Montage Étoile) : ${bomMetrics.cStarUf.toFixed(2)} uF
- Capacité par branche (Montage Triangle) : ${bomMetrics.cDeltaUf.toFixed(2)} uF
${topology === 'detuned_reactor' ? `- Taux de désaccord (p) : ${detuningFactorPct} %
- Fréquence d'anti-résonance (fr) : ${fResHz.toFixed(1)} Hz (Rang ${hRes.toFixed(2)}h)
- Surtension fondamentale aux bornes du condensateur (delta U) : +${vCapacitorRisePct.toFixed(1)} %
- Tension assignée minimale du condensateur (Uc) : >= ${bomMetrics.vCapRatedMinKv.toFixed(1)} kV (selon CEI 60871)` : ''}
${topology === 'single_tuned' ? `- Fréquence d'accord (fr) : ${fResHz.toFixed(1)} Hz (Rang ${tunedHarmonicOrder}h)
- Facteur de qualité (Q = X0 / R) : ${filterQualityFactor}` : ''}
- Inductance de self (L) : ${lFilterH > 0 ? (lFilterH * 1000).toFixed(3) + ' mH' : 'N/A'}
- Courant assigné fondamental de la branche (I1) : ${bomMetrics.iFundA.toFixed(1)} A
- Courant efficace global continu (Irms) : ${bomMetrics.iRmsA.toFixed(1)} A
- Seuil de linéarité magnétique sans saturation (Isat >= 1.8 Irms) : ${bomMetrics.iSatReactorA.toFixed(1)} A

3. BILAN THERMIQUE & DISSIPATION DES PERTES
--------------------------------------------------------------------------------
- Pertes diélectriques condensateurs : ${bomMetrics.pCapLossKw.toFixed(2)} kW
- Pertes cuivre & fer self de filtrage : ${bomMetrics.pReactorLossKw.toFixed(2)} kW
- Pertes calorifiques totales à évacuer : ${bomMetrics.pTotalLossKw.toFixed(2)} kW
- Débit d'air de ventilation d'armoire requis (delta T = 10°C) : ~${bomMetrics.coolingAirFlowM3h} m3/h

4. RÉSULTATS & CONFORMITÉ NORMATIVE AU PCC (IEEE 519-2022)
--------------------------------------------------------------------------------
- THD Tension résultant au PCC : ${thdVFiltered.toFixed(2)} % (Limite admissible : ${ieeeThdLimit} %)
- THD Courant injecté au réseau : ${thdIFiltered.toFixed(2)} %
- Décomposition par rang harmonique :
${harmonicMetrics.map(m => `  * H${m.h.toString().padEnd(2)} (${m.f} Hz) : ${m.hdvPctFiltered.toFixed(2)}% [Limite : ${m.ieeeLimitPct}%] -> ${m.compliant ? 'CONFORME' : 'DÉPASSÉ'}`).join('\n')}

VERDICT GLOBAL : ${isThdCompliant && isIndividualAllCompliant ? 'CONFORME AUX EXIGENCES IEEE 519-2022 & CEI 61000-3-6' : 'NON-CONFORME - RÉAJUSTER LE DIMENSIONNEMENT'}
================================================================================`;
  };

  // Copy engineering summary
  const handleCopySummary = () => {
    const summary = generateFullEngineeringNote();
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2500);
    });
  };

  // Download note as text file
  const handleDownloadNote = () => {
    const element = document.createElement('a');
    const file = new Blob([generateFullEngineeringNote()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Note_Calcul_Filtrage_PCC_${unKv}kV_${topology.toUpperCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LAB #12 &bull; POWER QUALITY & HARMONICS
              </span>
              <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>IEEE 519-2022 &bull; CEI 61000-3-6</span>
              </span>
              <span className="text-xs font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                ANTI-RESONANCE & TUNED NOTCH DESIGN
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2.5">
              <Activity className="h-6 w-6 text-cyan-400" />
              <span>
                {locale === 'fr'
                  ? 'Laboratoire de Filtrage Harmonique & Résonance Parallèle'
                  : 'Harmonic Filter Design & Parallel Resonance Laboratory'}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-4xl leading-relaxed">
              {locale === 'fr'
                ? 'Simulation interactive du profil d’impédance réseau Z(f), dimensionnement des batteries désaccordées (self anti-résonance p=7%) et des filtres résonants passifs/actifs. Détection des risques de surtension par résonance harmonique et vérification des critères d’acceptabilité IEEE 519.'
                : 'Interactive frequency impedance modeling Z(f), sizing of detuned capacitor banks (anti-resonance reactor p=7%), passive notch filters, and active power filters. Detects parallel resonance hazards and validates harmonic compliance per IEEE 519-2022.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#11161D] hover:bg-neutral-800 text-neutral-200 border border-[#252E38] hover:border-cyan-400 transition-all"
            >
              <Copy className="h-3.5 w-3.5 text-cyan-400" />
              <span>{copiedStatus ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Synthèse' : 'Copy Note')}</span>
            </button>
          </div>
        </div>

        {/* Resonance Hazard Alert Bar if critical */}
        {resonanceAlert !== 'none' && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 animate-pulse ${
              resonanceAlert === 'critical'
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
            }`}
          >
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider font-mono">
                {locale === 'fr' ? 'ALERTE DE RÉSONANCE HARMONIQUE' : 'HARMONIC RESONANCE ALERT'}
              </span>
              <p>{resonanceMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid & Non-Linear Load Presets Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grid Preset */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-2.5">
          <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Topologie Réseau & Tension PCC :' : 'Grid PCC Configuration:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'douala_30kv', label: 'Douala 30 kV (Eneo)', desc: 'Ind. Bassa' },
              { id: 'sonatrel_225kv', label: 'HTB 225 kV (SONATREL)', desc: 'Nachtigal' },
              { id: 'mv_plant_15kv', label: 'Usine MT 15 kV', desc: 'Ind. Lourde' },
              { id: 'lv_plant_400v', label: 'TGBT BT 400 V', desc: 'Tertiaire' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyGridPreset(p.id as GridPresetId)}
                className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                  gridPreset === p.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-[#080B10] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                <div className="truncate">{p.label}</div>
                <div className="text-[10px] text-neutral-500 truncate">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Load Preset */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-2.5">
          <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Spectre de Charge Non-Linéaire :' : 'Non-Linear Harmonic Profile:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'vfd_6pulse', label: 'Variateurs 6P (VFD)', desc: 'I5=22%, I7=15%' },
              { id: 'vfd_12pulse', label: 'Convertisseur 12P', desc: 'I11=10%, I13=8%' },
              { id: 'arc_furnace', label: 'Four à Arc / ALUCAM', desc: 'I3=18%, I5=28%' },
              { id: 'solar_ev_hub', label: 'Parc PV & Bornes VE', desc: 'I5=14%, I7=9%' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyLoadPreset(p.id as LoadPresetId)}
                className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                  loadPreset === p.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                    : 'bg-[#080B10] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                <div className="truncate">{p.label}</div>
                <div className="text-[10px] text-neutral-500 truncate">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Solution Selector */}
        <div className="space-y-4">
          {/* Solution Selector */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'Technologie de Filtrage / Compensation :' : 'Filtering / Mitigation Strategy:'}</span>
            </h3>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                {
                  id: 'none',
                  name_fr: 'Aucun condensateur (Réseau brut)',
                  name_en: 'No capacitor (Base grid only)',
                  badge: 'BASE'
                },
                {
                  id: 'standard_cap',
                  name_fr: 'Condensateur Shunt standard (Sans self)',
                  name_en: 'Standard Shunt Capacitor (Un-detuned)',
                  badge: 'DANGER RES.'
                },
                {
                  id: 'detuned_reactor',
                  name_fr: 'Batterie Désaccordée (Self anti-résonance p=7%)',
                  name_en: 'Detuned Capacitor Bank (Reactor p=7%)',
                  badge: 'RECOMMANDÉ'
                },
                {
                  id: 'single_tuned',
                  name_fr: 'Filtre Résonant Shunt Passe-Bande (LC)',
                  name_en: 'Passive Single-Tuned Notch Filter (LC)',
                  badge: 'PIÈGE H5/H7'
                },
                {
                  id: 'high_pass',
                  name_fr: 'Filtre Passe-Haut Amorti 2nd ordre',
                  name_en: '2nd Order High-Pass Damped Filter',
                  badge: 'H >= 11'
                },
                {
                  id: 'active_apf',
                  name_fr: 'Filtre Actif Numérique (APF / D-STATCOM)',
                  name_en: 'Active Power Filter (APF / D-STATCOM)',
                  badge: 'IGBT 10 kHz'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTopology(opt.id as FilterTopology)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    topology === opt.id
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 font-bold shadow-xs'
                      : 'bg-[#080B10] text-neutral-400 hover:text-white border-[#252E38]'
                  }`}
                >
                  <span className="truncate">{locale === 'fr' ? opt.name_fr : opt.name_en}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 font-bold ${
                      opt.id === 'standard_cap'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : opt.id === 'detuned_reactor'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Sliders */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'Paramètres d\'Ingénierie :' : 'Engineering Sizing Parameters:'}</span>
            </h3>

            {/* Reactive Power Sizing */}
            {topology !== 'none' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    {locale === 'fr' ? 'Puissance Réactive Qc (MVAR) :' : 'Reactive Power Qc (MVAR):'}
                  </span>
                  <span className="text-cyan-300 font-bold">{qcMvar.toFixed(2)} MVAR</span>
                </div>
                <input
                  type="range"
                  min={unKv < 1 ? 0.05 : 0.5}
                  max={unKv < 1 ? 1.0 : unKv > 100 ? 100 : 25}
                  step={unKv < 1 ? 0.01 : 0.25}
                  value={qcMvar}
                  onChange={(e) => setQcMvar(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
                  <span>Capacité C : {cMicroFarads.toFixed(1)} µF / ph</span>
                  <span>Xc : {xc1Nom.toFixed(2)} Ω</span>
                </div>
              </div>
            )}

            {/* Detuned Reactor factor p */}
            {topology === 'detuned_reactor' && (
              <div className="space-y-1.5 border-t border-[#252E38] pt-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    {locale === 'fr' ? 'Taux de désaccord p (%) :' : 'Detuning Factor p (%):'}
                  </span>
                  <span className="text-emerald-400 font-bold">{detuningFactorPct}% ({fResHz.toFixed(1)} Hz)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                  {[
                    { p: 5.67, label: '5.67% (210Hz)' },
                    { p: 7.0, label: '7.0% (189Hz)' },
                    { p: 14.0, label: '14.0% (134Hz)' }
                  ].map((btn) => (
                    <button
                      key={btn.p}
                      type="button"
                      onClick={() => setDetuningFactorPct(btn.p)}
                      className={`p-1.5 rounded text-center border transition-all ${
                        detuningFactorPct === btn.p
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                          : 'bg-[#080B10] text-neutral-400 hover:text-white border-[#252E38]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-1">
                  {locale === 'fr'
                    ? `* Surtension imposée au condensateur : +${vCapacitorRisePct.toFixed(1)}% (Uc requis = ${(unKv * (1 + vCapacitorRisePct / 100)).toFixed(1)} kV)`
                    : `* Voltage rise across capacitor: +${vCapacitorRisePct.toFixed(1)}% (Required Uc = ${(unKv * (1 + vCapacitorRisePct / 100)).toFixed(1)} kV)`}
                </div>
              </div>
            )}

            {/* Single-tuned harmonic order */}
            {topology === 'single_tuned' && (
              <div className="space-y-1.5 border-t border-[#252E38] pt-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    {locale === 'fr' ? 'Accord Harmonique (Rang ht) :' : 'Tuning Order (ht):'}
                  </span>
                  <span className="text-cyan-300 font-bold">{tunedHarmonicOrder}h ({fResHz.toFixed(0)} Hz)</span>
                </div>
                <input
                  type="range"
                  min="2.8"
                  max="13.2"
                  step="0.1"
                  value={tunedHarmonicOrder}
                  onChange={(e) => setTunedHarmonicOrder(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] font-mono text-neutral-500">
                  {locale === 'fr'
                    ? 'Astuce : accorder à 4.8h (240 Hz) pour piéger l\'harmonique 5 avec marge de dérive thermique.'
                    : 'Tip: tune to 4.8h (240 Hz) to trap 5th harmonic with thermal and aging margin.'}
                </div>
              </div>
            )}

            {/* Active Filter Efficiency */}
            {topology === 'active_apf' && (
              <div className="space-y-1.5 border-t border-[#252E38] pt-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    {locale === 'fr' ? 'Taux d\'atténuation APF (%) :' : 'APF Compensation Efficiency (%):'}
                  </span>
                  <span className="text-cyan-300 font-bold">{apfEfficiencyPct}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  step="1"
                  value={apfEfficiencyPct}
                  onChange={(e) => setApfEfficiencyPct(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Short-Circuit Power S_sc */}
            <div className="space-y-1.5 border-t border-[#252E38] pt-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">
                  {locale === 'fr' ? 'Puissance de Court-Circuit Ssc :' : 'Grid Short-Circuit Power Ssc:'}
                </span>
                <span className="text-neutral-200 font-bold">{sscMva} MVA</span>
              </div>
              <input
                type="range"
                min={unKv < 1 ? 5 : 50}
                max={unKv < 1 ? 50 : 5000}
                step={unKv < 1 ? 1 : 25}
                value={sscMva}
                onChange={(e) => setSscMva(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center & Right 2 Cols: Main Graphics & Compliance Dashboard */}
        <div className="lg:col-span-2 space-y-4">
          {/* Visual Display Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-2 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDisplayDomain('impedance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'impedance'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                1. {locale === 'fr' ? 'Spectre Impédance Z(f)' : 'Impedance Spectrum Z(f)'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('spectrum')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'spectrum'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                2. {locale === 'fr' ? 'Barres Harmoniques (%)' : 'Harmonic Spectrum (%)'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('waveform')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'waveform'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                3. {locale === 'fr' ? 'Oscilloscope v(t) & i(t)' : 'Waveform Scope v(t) & i(t)'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('bom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'bom'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                4. {locale === 'fr' ? 'Bordereau Matériel & Note (BOM)' : 'Engineering BOM & Report'}
              </button>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
              {locale === 'fr' ? 'Moteur Fréquentiel 25 Hz - 1300 Hz' : 'Frequency Solver 25 Hz - 1300 Hz'}
            </div>
          </div>

          {/* Canvases Viewport */}
          <div className="bg-[#080B10] border border-[#252E38] rounded-xl p-4 overflow-hidden relative shadow-inner">
            {displayDomain === 'impedance' && (
              <div className="space-y-2">
                <canvas
                  ref={impedanceCanvasRef}
                  width={700}
                  height={320}
                  onMouseMove={handleImpedanceMouseMove}
                  onMouseLeave={handleImpedanceMouseLeave}
                  className="w-full h-auto rounded-lg cursor-crosshair"
                />
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                  <span>
                    {locale === 'fr'
                      ? '💡 Survolez le graphe pour inspecter précisément la fréquence f (Hz) et l\'impédance |Z(f)| (Ω).'
                      : '💡 Hover over the canvas to inspect precise frequency f (Hz) and impedance |Z(f)| (Ω).'}
                  </span>
                  {impedanceHover && (
                    <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      f = {impedanceHover.f.toFixed(1)} Hz &bull; |Z_bus| = {impedanceHover.zBus.toFixed(2)} Ω &bull; Z_grid = {impedanceHover.zGrid.toFixed(2)} Ω
                    </span>
                  )}
                </div>
              </div>
            )}

            {displayDomain === 'spectrum' && (
              <canvas
                ref={spectrumCanvasRef}
                width={700}
                height={320}
                className="w-full h-auto rounded-lg"
              />
            )}

            {displayDomain === 'waveform' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1.5 bg-[#0D1117] border border-[#252E38] rounded-lg text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showFundamentalRef}
                        onChange={(e) => setShowFundamentalRef(e.target.checked)}
                        className="rounded accent-cyan-400"
                      />
                      <span>{locale === 'fr' ? 'Réf. 50 Hz sinusoïdale' : '50 Hz ideal sine ref'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showUnfilteredOverlay}
                        onChange={(e) => setShowUnfilteredOverlay(e.target.checked)}
                        className="rounded accent-rose-400"
                      />
                      <span>{locale === 'fr' ? 'Superposer onde brute non-filtrée' : 'Overlay raw unfiltered wave'}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[11px]">{locale === 'fr' ? 'Translation t :' : 'Time shift t:'}</span>
                    <input
                      type="range"
                      min="0"
                      max="0.02"
                      step="0.0005"
                      value={waveformTimeShift}
                      onChange={(e) => setWaveformTimeShift(parseFloat(e.target.value))}
                      className="w-24 accent-cyan-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setWaveformTimeShift(0)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <canvas
                  ref={waveformCanvasRef}
                  width={700}
                  height={320}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* TAB 4: BILL OF MATERIALS & COMPLIANCE NOTE */}
            {displayDomain === 'bom' && (
              <div className="space-y-5">
                {/* Header & Action bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {locale === 'fr'
                        ? 'Bordereau Technique de Dimensionnement & Note Réglementaire'
                        : 'Technical Sizing Bill of Materials & Regulatory Report'}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">
                      IEEE 519-2022 &bull; CEI 61000-3-6 &bull; CEI 60871-1 &bull; CEI 60076-6
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedStatus ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier la Note' : 'Copy Report')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadNote}
                      className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0D1117] text-neutral-300 border border-[#252E38] hover:text-white hover:border-neutral-500 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Télécharger .txt' : 'Download .txt'}</span>
                    </button>
                  </div>
                </div>

                {/* Sizing Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. Capacitor Bank */}
                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {locale === 'fr' ? 'Batterie Condensateurs' : 'Capacitor Bank'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">CEI 60871-1</span>
                    </div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Puissance Qc :</span>
                        <span className="font-bold text-white">{qcMvar} MVAR</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Capacité Étoile (Y) :</span>
                        <span className="text-cyan-300 font-bold">{bomMetrics.cStarUf.toFixed(2)} µF/ph</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Capacité Triangle (Δ) :</span>
                        <span>{bomMetrics.cDeltaUf.toFixed(2)} µF/br</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Tension Nom. Minimale :</span>
                        <span className="text-amber-300 font-bold">&ge; {bomMetrics.vCapRatedMinKv.toFixed(1)} kV</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Courant Fondamental I1 :</span>
                        <span>{bomMetrics.iFundA.toFixed(1)} A</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Detuning / Tuning Reactor */}
                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {locale === 'fr' ? 'Self de Désaccord / Filtre' : 'Filter / Detuning Reactor'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">CEI 60076-6</span>
                    </div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Inductance L :</span>
                        <span className="font-bold text-white">
                          {lFilterH > 0 ? `${(lFilterH * 1000).toFixed(3)} mH` : 'N/A (Sans self)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Fréq. Accord / Anti-R :</span>
                        <span className="text-amber-300 font-bold">{fResHz.toFixed(1)} Hz</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Courant Efficace Irms :</span>
                        <span className="text-white font-bold">{bomMetrics.iRmsA.toFixed(1)} A</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Seuil Saturation Isat :</span>
                        <span className="text-emerald-400 font-bold">&ge; {bomMetrics.iSatReactorA.toFixed(1)} A</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Résistance Cuivre :</span>
                        <span>~{bomMetrics.rReactorEff.toFixed(3)} Ω</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Losses & Thermal Cooling */}
                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-400">
                        {locale === 'fr' ? 'Thermique & Ventilation' : 'Thermal & Ventilation'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Bilan Pertes</span>
                    </div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Pertes Condensateurs :</span>
                        <span>{bomMetrics.pCapLossKw.toFixed(2)} kW</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Pertes Self (Cu+Fe) :</span>
                        <span>{bomMetrics.pReactorLossKw.toFixed(2)} kW</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Pertes Totales à Évacuer :</span>
                        <span className="text-purple-300 font-bold">{bomMetrics.pTotalLossKw.toFixed(2)} kW</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Débit Air Requis (ΔT 10°C) :</span>
                        <span className="text-cyan-300 font-bold">~{bomMetrics.coolingAirFlowM3h} m³/h</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Indice de Protection :</span>
                        <span>IP31 / IP54</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Harmonic Compliance Verification Table */}
                <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-neutral-300">
                      {locale === 'fr'
                        ? 'Matrice de Conformité par Rang Harmonique (IEEE 519-2022)'
                        : 'Harmonic-by-Harmonic Compliance Matrix (IEEE 519-2022)'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      THD Global : {thdVFiltered.toFixed(2)}% (Max {ieeeThdLimit}%)
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#252E38] text-neutral-400">
                          <th className="pb-1">Rang</th>
                          <th className="pb-1">Fréq.</th>
                          <th className="pb-1">HDv Brut</th>
                          <th className="pb-1">HDv Filtré</th>
                          <th className="pb-1">Limite IEEE</th>
                          <th className="pb-1">Atténuation</th>
                          <th className="pb-1 text-right">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A222D]">
                        {harmonicMetrics.map((m) => {
                          const atten = m.hdvPctUnfiltered > 0 ? ((m.hdvPctUnfiltered - m.hdvPctFiltered) / m.hdvPctUnfiltered) * 100 : 0;
                          return (
                            <tr key={m.h} className="hover:bg-neutral-800/30">
                              <td className="py-1 text-cyan-400 font-bold">H{m.h}</td>
                              <td className="py-1 text-neutral-400">{m.f} Hz</td>
                              <td className="py-1 text-neutral-400">{m.hdvPctUnfiltered.toFixed(2)}%</td>
                              <td className={`py-1 font-bold ${m.compliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {m.hdvPctFiltered.toFixed(2)}%
                              </td>
                              <td className="py-1 text-neutral-400">{m.ieeeLimitPct}%</td>
                              <td className="py-1 text-neutral-300">
                                {atten > 0 ? `-${atten.toFixed(0)}%` : `+${Math.abs(atten).toFixed(0)}%`}
                              </td>
                              <td className="py-1 text-right">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    m.compliant
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  {m.compliant ? 'CONFORME' : 'DÉPASSÉ'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Certified Calculation Note Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{locale === 'fr' ? 'Note de Calcul Brute Formatée (Texte Réglementaire) :' : 'Raw Formatted Engineering Note:'}</span>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedStatus ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier tout' : 'Copy all')}</span>
                    </button>
                  </div>
                  <pre className="bg-[#05070A] border border-[#252E38] rounded-xl p-3 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-56 select-all whitespace-pre-wrap leading-relaxed">
                    {generateFullEngineeringNote()}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Key Engineering Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* THD V */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                {locale === 'fr' ? 'THD Tension PCC' : 'PCC Voltage THD'}
              </div>
              <div
                className={`text-lg font-mono font-bold ${
                  isThdCompliant ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {thdVFiltered.toFixed(2)} %
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {locale === 'fr' ? `Initial : ${thdVUnfiltered.toFixed(1)}%` : `Initial: ${thdVUnfiltered.toFixed(1)}%`}
              </div>
            </div>

            {/* IEEE 519 Status */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                {locale === 'fr' ? 'Statut IEEE 519' : 'IEEE 519 Status'}
              </div>
              <div
                className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isThdCompliant && isIndividualAllCompliant
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {isThdCompliant && isIndividualAllCompliant ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>CONFORME</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>NON CONFORME</span>
                  </>
                )}
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                Seuil : &le; {ieeeThdLimit}%
              </div>
            </div>

            {/* Power Factor cos phi */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                {locale === 'fr' ? 'Facteur de Puissance' : 'Power Factor cos φ'}
              </div>
              <div className="text-lg font-mono font-bold text-cyan-300">
                {cosPhiCompensated.toFixed(3)}
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {locale === 'fr' ? `Initial : ${cosPhiLoad.toFixed(2)}` : `Initial: ${cosPhiLoad.toFixed(2)}`}
              </div>
            </div>

            {/* Frequency Tuning */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                {locale === 'fr' ? 'Accord / Résonance' : 'Tuning / Resonance'}
              </div>
              <div className="text-lg font-mono font-bold text-amber-300">
                {fResHz > 0 ? `${fResHz.toFixed(0)} Hz` : 'N/A'}
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {hRes > 0 ? `Rang ${hRes.toFixed(2)}h` : 'Linear'}
              </div>
            </div>
          </div>

          {/* Harmonic Detailed Table */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Détail des Harmoniques (CEI 61000-3-6 / IEEE 519) :' : 'Harmonic Table Analysis:'}</span>
              <span className="text-neutral-500 text-[10px] font-normal">
                {locale === 'fr' ? 'PCC 3-Phases Séquence Directe & Inverse' : '3-Phase Positive & Negative Sequence PCC'}
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#252E38] text-neutral-400 text-[11px]">
                    <th className="py-2 px-2">Rang h</th>
                    <th className="py-2 px-2">Fréq.</th>
                    <th className="py-2 px-2">I_inj (A)</th>
                    <th className="py-2 px-2">|Z_res| (Ω)</th>
                    <th className="py-2 px-2">HD_v Initial</th>
                    <th className="py-2 px-2">HD_v Filtré</th>
                    <th className="py-2 px-2">Limite IEEE</th>
                    <th className="py-2 px-2">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A222D]">
                  {harmonicMetrics.map((m) => (
                    <tr key={m.h} className="hover:bg-neutral-800/30">
                      <td className="py-1.5 px-2 font-bold text-cyan-400">H{m.h}</td>
                      <td className="py-1.5 px-2 text-neutral-400">{m.f} Hz</td>
                      <td className="py-1.5 px-2 text-neutral-300">{m.iInjA.toFixed(1)} A</td>
                      <td className="py-1.5 px-2 text-neutral-300">{m.zBusMagFiltered.toFixed(2)} Ω</td>
                      <td className="py-1.5 px-2 text-neutral-400">{m.hdvPctUnfiltered.toFixed(2)}%</td>
                      <td
                        className={`py-1.5 px-2 font-bold ${
                          m.compliant ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {m.hdvPctFiltered.toFixed(2)}%
                      </td>
                      <td className="py-1.5 px-2 text-neutral-400">{m.ieeeLimitPct}%</td>
                      <td className="py-1.5 px-2">
                        {m.compliant ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            OK
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            DEPASSE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
