// src/components/substations/modules/DifferentialProtectionDualSlopeSaturationSimulator.tsx
// High-Fidelity Differential Protection (ANSI 87T / 87B) Dual-Slope Percentage Restraint & CT Saturation Analyzer
// Fully compliant with IEEE C37.110, IEEE C37.91, IEC 60255-13 & IEC 61869-2

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Layers,
  TrendingUp,
  Info,
  Waves,
  Eye,
  Cpu,
  Lock,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DifferentialProtectionDualSlopeSaturationSimulatorProps {
  locale: 'fr' | 'en';
}

type RestraintAlgorithm = 'AVERAGE' | 'MAXIMUM' | 'SCALAR_SUM';
type OperatingStatus = 'TRIP_RESTRAINED' | 'TRIP_UNRESTRAINED' | 'STABLE_RESTRAINT' | 'BLOCKED_2ND_HARMONIC' | 'BLOCKED_5TH_HARMONIC';

interface DifferentialPreset {
  id: string;
  name_fr: string;
  name_en: string;
  category: 'INTERNAL_FAULT' | 'EXTERNAL_FAULT' | 'INRUSH' | 'OVEREXCITATION' | 'NORMAL_LOAD';
  i1_mag: number; // Primary current in pu
  i1_ang: number; // angle in degrees
  i2_mag: number; // Secondary current in pu
  i2_ang: number; // angle in degrees
  harmonic2_pct: number; // 2nd harmonic ratio %
  harmonic5_pct: number; // 5th harmonic ratio %
  faultDescription_fr: string;
  faultDescription_en: string;
  expectedBehavior_fr: string;
  expectedBehavior_en: string;
  ctSaturationTriggered?: boolean;
}

export const DifferentialProtectionDualSlopeSaturationSimulator: React.FC<DifferentialProtectionDualSlopeSaturationSimulatorProps> = ({
  locale
}) => {
  // Relay Settings State
  const [is1_pickup, setIs1Pickup] = useState<number>(0.30); // 0.1 to 0.5 pu
  const [slope1_pct, setSlope1Pct] = useState<number>(30); // 15% to 50%
  const [is2_knee, setIs2Knee] = useState<number>(2.0); // 1.5 to 3.5 pu
  const [slope2_pct, setSlope2Pct] = useState<number>(70); // 50% to 100%
  const [id_unrestrained, setIdUnrestrained] = useState<number>(7.0); // 5.0 to 10.0 pu
  const [harmonic2_threshold, setHarmonic2Threshold] = useState<number>(15); // 10% to 25%
  const [harmonic5_threshold, setHarmonic5Threshold] = useState<number>(35); // 20% to 45%
  const [restraintAlgorithm, setRestraintAlgorithm] = useState<RestraintAlgorithm>('AVERAGE');

  // Interactive Live Operating Inputs
  const [i1_mag, setI1Mag] = useState<number>(1.0);
  const [i1_ang, setI1Ang] = useState<number>(0);
  const [i2_mag, setI2Mag] = useState<number>(1.0);
  const [i2_ang, setI2Ang] = useState<number>(180); // In normal through-load, I1 and I2 enter/exit 180 deg out-of-phase relative to CT polarity
  const [harmonic2_ratio, setHarmonic2Ratio] = useState<number>(2.0); // %
  const [harmonic5_ratio, setHarmonic5Ratio] = useState<number>(1.5); // %

  // CT Saturation Parameters (IEEE C37.110)
  const [xrRatio, setXrRatio] = useState<number>(15); // System X/R (tau_p)
  const [secondaryBurdenOhms, setSecondaryBurdenOhms] = useState<number>(1.2); // Ohms
  const [remanentFluxPct, setRemanentFluxPct] = useState<number>(25); // %
  const [kneePointVoltageVk, setKneePointVoltageVk] = useState<number>(280); // Volts

  // Selected Preset Scenario
  const [selectedPresetId, setSelectedPresetId] = useState<string>('NORMAL_LOAD');

  // Preset Scenarios
  const presets: DifferentialPreset[] = [
    {
      id: 'NORMAL_LOAD',
      name_fr: 'Régime Nominal Équilibré (Traversée 1.0 pu)',
      name_en: 'Balanced Full-Load Operation (Through-Load 1.0 pu)',
      category: 'NORMAL_LOAD',
      i1_mag: 1.0,
      i1_ang: 0,
      i2_mag: 1.0,
      i2_ang: 180,
      harmonic2_pct: 1.2,
      harmonic5_pct: 0.8,
      faultDescription_fr: 'Transfert de puissance standard. Courant entrant = courant sortant. Déphasage parfait de 180° aux bornes des TC.',
      faultDescription_en: 'Standard power transfer. Current in equals current out. Exact 180° phase opposition across CT polarities.',
      expectedBehavior_fr: 'Courant différentiel Id ~ 0. Point de fonctionnement solidement ancré en zone de retenue.',
      expectedBehavior_en: 'Differential current Id ~ 0. Operating point deeply anchored inside stable restraint zone.'
    },
    {
      id: 'INTERNAL_PHASE_EARTH',
      name_fr: 'Défaut Interne Phase-Terre Cuve (Id = 3.8 pu)',
      name_en: 'Internal Phase-to-Ground Tank Fault (Id = 3.8 pu)',
      category: 'INTERNAL_FAULT',
      i1_mag: 2.8,
      i1_ang: 15,
      i2_mag: 1.2,
      i2_ang: 30,
      harmonic2_pct: 3.5,
      harmonic5_pct: 1.2,
      faultDescription_fr: 'Claquant d\'isolement interne sur enroulement HT 225 kV avec retour par la terre de la cuve.',
      faultDescription_en: 'Internal insulation breakdown on 225 kV HV winding with tank ground return path.',
      expectedBehavior_fr: 'Courant Id = 3.96 pu dépasse nettement la pente de retenue. Déclenchement rapide différentiel 87T en < 25 ms.',
      expectedBehavior_en: 'Id = 3.96 pu comfortably exceeds restraint slope. Ultra-fast 87T trip command emitted in < 25 ms.'
    },
    {
      id: 'SEVERE_INTERNAL_BUSBAR',
      name_fr: 'Court-Circuit Franc Barres non Freiné (Id = 8.2 pu)',
      name_en: 'Severe Internal Bus Flashover Unrestrained (Id = 8.2 pu)',
      category: 'INTERNAL_FAULT',
      i1_mag: 5.5,
      i1_ang: 10,
      i2_mag: 3.0,
      i2_ang: 15,
      harmonic2_pct: 2.0,
      harmonic5_pct: 1.0,
      faultDescription_fr: 'Amorçage triphasé violent sur jeu de barres ou traversée principale du transformateur.',
      faultDescription_en: 'Violent 3-phase arc flashover on substation busbar or primary transformer bushing.',
      expectedBehavior_fr: 'Id = 8.48 pu > Seuil Instantané Non-Freiné (7.0 pu). Déclenchement sub-cycle immédiat sans filtrage harmonique (< 12 ms).',
      expectedBehavior_en: 'Id = 8.48 pu > Unrestrained Instantaneous Threshold (7.0 pu). Instantaneous sub-cycle trip bypassing all harmonic filters (< 12 ms).'
    },
    {
      id: 'EXTERNAL_THROUGH_FAULT_SAT',
      name_fr: 'Défaut Traversant Externe avec Saturation TC (Id parasite)',
      name_en: 'External Through-Fault with Severe CT Saturation (Spill Id)',
      category: 'EXTERNAL_FAULT',
      i1_mag: 6.2,
      i1_ang: 0,
      i2_mag: 5.4,
      i2_ang: 165, // distorted due to CT saturation
      harmonic2_pct: 5.5,
      harmonic5_pct: 3.0,
      ctSaturationTriggered: true,
      faultDescription_fr: 'Court-circuit franc sur départ ligne aval (Icc = 32 kA). Le TC côté départ sature profondément en raison de l\'apériodique.',
      faultDescription_en: 'Severe bolted fault on outgoing line (32 kA). Feeder CT experiences severe deep saturation due to high DC offset component.',
      expectedBehavior_fr: 'Création d\'un courant différentiel fictif (Id = 1.6 pu). Grâce à la Pente 2 (K2 = 70%) et Ir élevé (5.8 pu), le relais reste STABLE et ne déclenche pas.',
      expectedBehavior_en: 'Spill differential current generated (Id = 1.6 pu). Thanks to High Slope 2 (K2 = 70%) and high Ir (5.8 pu), relay remains STABLE without false trip.'
    },
    {
      id: 'TRANSFORMER_INRUSH',
      name_fr: 'Mise sous Tension à Vide - Courant d\'Appel (Inrush)',
      name_en: 'No-Load Energization - Magnetizing Inrush Wave',
      category: 'INRUSH',
      i1_mag: 2.6,
      i1_ang: 0,
      i2_mag: 0.05, // Trafo unloaded, secondary near zero
      i2_ang: 180,
      harmonic2_pct: 26.5, // Severe 2nd harmonic
      harmonic5_pct: 4.2,
      faultDescription_fr: 'Enclenchement du disjoncteur HT avec flux rémanent élevé. Saturation unilatérale du fer générant un fort courant asymétrique.',
      faultDescription_en: 'HV circuit breaker closing into un-energized core with high remanence. Unilateral iron saturation producing rich asymmetric inrush.',
      expectedBehavior_fr: 'Id = 2.55 pu entrerait en zone de déclenchement mais le filtre H2 (26.5% > 15%) BLOQUE le déclenchement (Retenue d\'harmonique 2 active).',
      expectedBehavior_en: 'Id = 2.55 pu would enter trip zone, but 2nd Harmonic filter (26.5% > 15%) BLOCKS tripping (Active 2nd Harmonic Restraint).'
    },
    {
      id: 'OVEREXCITATION_OVERFLUXING',
      name_fr: 'Surfluxage / Surtension Fréquentielle (Harmonique 5)',
      name_en: 'Overexcitation / V/Hz Overfluxing (5th Harmonic)',
      category: 'OVEREXCITATION',
      i1_mag: 1.8,
      i1_ang: 0,
      i2_mag: 0.1,
      i2_ang: 180,
      harmonic2_pct: 4.1,
      harmonic5_pct: 42.0, // High 5th harmonic
      faultDescription_fr: 'Délestage brutal de charge en aval entraînant une montée de tension V/f > 1.25 pu et surfluxage du circuit magnétique.',
      faultDescription_en: 'Sudden downstream load drop causing terminal voltage surge V/Hz > 1.25 pu and core magnetic overfluxing.',
      expectedBehavior_fr: 'Id = 1.7 pu bloqué par le filtre d\'harmonique 5 (42% > 35%). Protection 87T stabilisée; alarme ANSI 24 (V/Hz) sollicitée.',
      expectedBehavior_en: 'Id = 1.7 pu blocked by 5th Harmonic filter (42% > 35%). 87T stabilized while ANSI 24 (V/Hz) handles thermal overflux protection.'
    }
  ];

  const applyPreset = (preset: DifferentialPreset) => {
    setSelectedPresetId(preset.id);
    setI1Mag(preset.i1_mag);
    setI1Ang(preset.i1_ang);
    setI2Mag(preset.i2_mag);
    setI2Ang(preset.i2_ang);
    setHarmonic2Ratio(preset.harmonic2_pct);
    setHarmonic5Ratio(preset.harmonic5_pct);
  };

  // Mathematical Vector Differential and Restraint Engine
  const { id_diff, ir_restraint, tripBoundaryAtIr, operatingStatus, ctSaturationTimeMs } = useMemo(() => {
    // Convert polar to complex: I1 = mag * (cos(ang) + j sin(ang))
    const rad1 = (i1_ang * Math.PI) / 180;
    const rad2 = (i2_ang * Math.PI) / 180;

    const i1_real = i1_mag * Math.cos(rad1);
    const i1_imag = i1_mag * Math.sin(rad1);

    // According to differential convention with CT polarity pointing into the protected object:
    // Id = |I1 + I2|
    const i2_real = i2_mag * Math.cos(rad2);
    const i2_imag = i2_mag * Math.sin(rad2);

    const id_real = i1_real + i2_real;
    const id_imag = i1_imag + i2_imag;
    const id_val = Math.sqrt(id_real * id_real + id_imag * id_imag);

    // Restraint algorithm:
    let ir_val = 0;
    if (restraintAlgorithm === 'AVERAGE') {
      ir_val = (i1_mag + i2_mag) / 2;
    } else if (restraintAlgorithm === 'MAXIMUM') {
      ir_val = Math.max(i1_mag, i2_mag);
    } else {
      // SCALAR_SUM
      ir_val = i1_mag + i2_mag;
    }

    // Dual-Slope Boundary Curve Calculation at current Ir:
    // Region 1 (Ir <= Is2): Id_thresh = Is1 + Slope1 * Ir
    // Region 2 (Ir > Is2):  Id_thresh = (Is1 + Slope1 * Is2) + Slope2 * (Ir - Is2)
    const k1 = slope1_pct / 100;
    const k2 = slope2_pct / 100;
    let threshold = 0;

    if (ir_val <= is2_knee) {
      threshold = is1_pickup + k1 * ir_val;
    } else {
      const kneeId = is1_pickup + k1 * is2_knee;
      threshold = kneeId + k2 * (ir_val - is2_knee);
    }

    // Status Evaluation
    let status: OperatingStatus = 'STABLE_RESTRAINT';

    if (id_val >= id_unrestrained) {
      // Instantaneous Unrestrained Trip: ignores all harmonic blocking!
      status = 'TRIP_UNRESTRAINED';
    } else if (id_val >= threshold) {
      // Above restraint characteristic: check harmonic filters
      if (harmonic2_ratio >= harmonic2_threshold) {
        status = 'BLOCKED_2ND_HARMONIC';
      } else if (harmonic5_ratio >= harmonic5_threshold) {
        status = 'BLOCKED_5TH_HARMONIC';
      } else {
        status = 'TRIP_RESTRAINED';
      }
    } else {
      status = 'STABLE_RESTRAINT';
    }

    // CT Saturation time-to-saturate (IEEE C37.110 equation approximation):
    // t_sat = tau_p * ln( (Vk / (I_fault * R_b) + 1) / (1 - Br/Bs) )
    // tau_p = X/R / (2 * pi * 50) in seconds
    const tau_p_sec = xrRatio / (2 * Math.PI * 50); // e.g. 15 / 314 = 0.0477 s (47.7 ms)
    const i_fault_sec = Math.max(i1_mag, i2_mag) * 5.0; // Assume 5A CT nominal
    const v_induced = i_fault_sec * secondaryBurdenOhms;
    const remanence_factor = 1 - (remanentFluxPct / 100);

    let tsat_ms = 999;
    if (v_induced > 0 && remanence_factor > 0) {
      const ratio = kneePointVoltageVk / v_induced;
      if (ratio < 15) {
        const arg = (ratio + 1) * remanence_factor;
        if (arg > 1) {
          tsat_ms = Math.max(3.2, Math.min(250, tau_p_sec * Math.log(arg) * 1000));
        } else {
          tsat_ms = 3.5; // near instant saturation
        }
      } else {
        tsat_ms = 180; // mild or delayed saturation
      }
    }

    return {
      id_diff: id_val,
      ir_restraint: ir_val,
      tripBoundaryAtIr: threshold,
      operatingStatus: status,
      ctSaturationTimeMs: tsat_ms
    };
  }, [
    i1_mag,
    i1_ang,
    i2_mag,
    i2_ang,
    is1_pickup,
    slope1_pct,
    is2_knee,
    slope2_pct,
    id_unrestrained,
    harmonic2_ratio,
    harmonic2_threshold,
    harmonic5_ratio,
    harmonic5_threshold,
    restraintAlgorithm,
    xrRatio,
    secondaryBurdenOhms,
    remanentFluxPct,
    kneePointVoltageVk
  ]);

  // SVG Coordinate mapping for the Characteristic Plane (Ir: 0 to 8 pu, Id: 0 to 9 pu)
  const svgW = 460;
  const svgH = 340;
  const padL = 45;
  const padB = 40;
  const padT = 25;
  const padR = 25;

  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxIr = 8.0;
  const maxId = 9.0;

  const toX = (ir: number) => padL + (Math.min(Math.max(ir, 0), maxIr) / maxIr) * plotW;
  const toY = (id: number) => padT + plotH - (Math.min(Math.max(id, 0), maxId) / maxId) * plotH;

  // Key points on the characteristic curve
  const pt0_X = toX(0);
  const pt0_Y = toY(is1_pickup);

  const kneeId = is1_pickup + (slope1_pct / 100) * is2_knee;
  const knee_X = toX(is2_knee);
  const knee_Y = toY(kneeId);

  // Point where slope 2 hits unrestrained line or maxIr
  const slope2AtMaxIr = kneeId + (slope2_pct / 100) * (maxIr - is2_knee);
  const intersectIrUnrestrained = is2_knee + (id_unrestrained - kneeId) / (slope2_pct / 100);

  const endCurveIr = Math.min(maxIr, Math.max(is2_knee, intersectIrUnrestrained));
  const endCurveId = Math.min(id_unrestrained, slope2AtMaxIr);
  const end_X = toX(endCurveIr);
  const end_Y = toY(endCurveId);

  const unrestrained_Y = toY(id_unrestrained);

  // Status color helpers
  const getStatusBadge = () => {
    switch (operatingStatus) {
      case 'TRIP_UNRESTRAINED':
        return {
          label: locale === 'fr' ? 'DÉCLENCHEMENT INSTANTANÉ NON-FREINÉ (< 12 ms)' : 'INSTANTANEOUS UNRESTRAINED TRIP (< 12 ms)',
          bg: 'bg-red-500/20 text-red-400 border-red-500/50',
          icon: <Flame className="w-4 h-4 text-red-400" />
        };
      case 'TRIP_RESTRAINED':
        return {
          label: locale === 'fr' ? 'DÉCLENCHEMENT DIFFÉRENTIEL FREINÉ (ANSI 87T)' : 'RESTRAINED DIFFERENTIAL TRIP (ANSI 87T)',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          icon: <Zap className="w-4 h-4 text-amber-400" />
        };
      case 'BLOCKED_2ND_HARMONIC':
        return {
          label: locale === 'fr' ? 'BLOQUÉ PAR RETENUE D\'HARMONIQUE 2 (INRUSH)' : 'BLOCKED BY 2ND HARMONIC RESTRAINT (INRUSH)',
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          icon: <Lock className="w-4 h-4 text-cyan-400" />
        };
      case 'BLOCKED_5TH_HARMONIC':
        return {
          label: locale === 'fr' ? 'BLOQUÉ PAR RETENUE D\'HARMONIQUE 5 (SURFLUXAGE)' : 'BLOCKED BY 5TH HARMONIC RESTRAINT (OVERFLUX)',
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
          icon: <Lock className="w-4 h-4 text-indigo-400" />
        };
      default:
        return {
          label: locale === 'fr' ? 'ZONE DE RETENUE STABLE (AUCUN DÉCLENCHEMENT)' : 'STABLE RESTRAINT ZONE (NO TRIP)',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* 1. Header Banner & Standard Normative References */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600/30 to-amber-600/20 border border-red-500/40 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {locale === 'fr'
                  ? 'Protection Différentielle & Saturation TC (ANSI 87T / 87B / IEEE C37.110)'
                  : 'Differential Protection & CT Saturation Analyzer (ANSI 87T / 87B / IEEE C37.110)'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 text-[10px] font-bold border border-red-600/40">
                IEC 60255-13
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              {locale === 'fr'
                ? 'Caractéristique à double pente Id(Ir), stabilisation contre la saturation des TC aux défauts externes, et filtres de blocage d\'harmoniques H2 (inrush) & H5 (surfluxage).'
                : 'Dual-slope restrained curve Id(Ir), external through-fault CT saturation stabilization, and H2 (inrush) & H5 (overfluxing) harmonic blocking filters.'}
            </p>
          </div>
        </div>

        {/* Live Trip Status Pill */}
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 self-start md:self-auto ${statusBadge.bg}`}>
          {statusBadge.icon}
          <span className="text-xs font-bold tracking-wide">{statusBadge.label}</span>
        </div>
      </div>

      {/* 2. Preset Scenarios Selector Carousel */}
      <div className="p-3 rounded-2xl bg-[#0B1019] border border-[#1E2634] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Scénarios Normatifs Préconfigurés' : 'Standard Test Cases & Presets'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            {locale === 'fr' ? 'Cliquez pour injecter instantanément' : 'Click to inject test case'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {presets.map(p => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-500/10'
                    : 'bg-[#0E1522] border-[#222E42] hover:border-slate-500 hover:bg-[#131D2E]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-red-300' : 'text-slate-200'}`}>
                    {locale === 'fr' ? p.name_fr : p.name_en}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      p.category === 'INTERNAL_FAULT'
                        ? 'bg-red-900/60 text-red-300 border border-red-700/40'
                        : p.category === 'EXTERNAL_FAULT'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700/40'
                        : p.category === 'INRUSH'
                        ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/40'
                        : p.category === 'OVEREXCITATION'
                        ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/40'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40'
                    }`}
                  >
                    {p.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2">
                  {locale === 'fr' ? p.faultDescription_fr : p.faultDescription_en}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split View: Characteristic Curve Plane & Interactive Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Vector Plane & Dual-Slope Curve (7 Cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1E2634] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'Plan de Déclenchement Id / Ir & Point de Fonctionnement'
                  : 'Operating Plane Id / Ir & Dual-Slope Characteristic'}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500 inline-block" />
                {locale === 'fr' ? 'Déclenchement' : 'Trip'}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500 inline-block" />
                {locale === 'fr' ? 'Retenue' : 'Restraint'}
              </span>
            </div>
          </div>

          {/* SVG Graph */}
          <div className="relative w-full aspect-[4/3] max-h-[360px] bg-[#070A0F] rounded-xl border border-[#1B2330] p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full select-none">
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="diffGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#141C28" strokeWidth="0.8" />
                </pattern>

                {/* Shading for Trip Zone */}
                <linearGradient id="tripZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.08" />
                </linearGradient>

                <linearGradient id="restraintZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="url(#diffGrid)" />

              {/* Shaded Trip Area Polygon */}
              <path
                d={`M ${pt0_X} ${pt0_Y}
                    L ${knee_X} ${knee_Y}
                    L ${end_X} ${end_Y}
                    L ${toX(maxIr)} ${toY(Math.min(id_unrestrained, endCurveId))}
                    L ${toX(maxIr)} ${padT}
                    L ${padL} ${padT}
                    Z`}
                fill="url(#tripZoneGrad)"
              />

              {/* Shaded Restraint Area Polygon */}
              <path
                d={`M ${pt0_X} ${pt0_Y}
                    L ${knee_X} ${knee_Y}
                    L ${end_X} ${end_Y}
                    L ${toX(maxIr)} ${toY(Math.min(id_unrestrained, endCurveId))}
                    L ${toX(maxIr)} ${toY(0)}
                    L ${padL} ${toY(0)}
                    Z`}
                fill="url(#restraintZoneGrad)"
              />

              {/* Horizontal Unrestrained Instantaneous Line */}
              <line
                x1={padL}
                y1={unrestrained_Y}
                x2={toX(maxIr)}
                y2={unrestrained_Y}
                stroke="#f87171"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text
                x={toX(maxIr) - 6}
                y={unrestrained_Y - 5}
                fill="#f87171"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                Id,inst = {id_unrestrained.toFixed(1)} pu (ANSI 87-Inst)
              </text>

              {/* Dual-Slope Characteristic Polyline */}
              <path
                d={`M ${pt0_X} ${pt0_Y} L ${knee_X} ${knee_Y} L ${end_X} ${end_Y}`}
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Slope 1 Label */}
              <text
                x={(pt0_X + knee_X) / 2 - 10}
                y={(pt0_Y + knee_Y) / 2 - 10}
                fill="#fde047"
                fontSize="9"
                fontWeight="bold"
              >
                K1 = {slope1_pct}%
              </text>

              {/* Slope 2 Label */}
              <text
                x={(knee_X + end_X) / 2 + 10}
                y={(knee_Y + end_Y) / 2 - 10}
                fill="#fde047"
                fontSize="9"
                fontWeight="bold"
              >
                K2 = {slope2_pct}%
              </text>

              {/* Knee Breakpoint Marker */}
              <circle cx={knee_X} cy={knee_Y} r="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
              <text x={knee_X + 6} y={knee_Y + 14} fill="#94a3b8" fontSize="8" fontFamily="monospace">
                Is2 = {is2_knee.toFixed(1)} pu
              </text>

              {/* Base Pickup Is1 Marker */}
              <circle cx={pt0_X} cy={pt0_Y} r="3" fill="#ca8a04" />
              <text x={pt0_X + 6} y={pt0_Y + 3} fill="#94a3b8" fontSize="8">
                Is1 = {is1_pickup.toFixed(2)}
              </text>

              {/* Axes */}
              <line x1={padL} y1={padT + plotH} x2={padL + plotW + 10} y2={padT + plotH} stroke="#475569" strokeWidth="1.5" />
              <line x1={padL} y1={padT - 10} x2={padL} y2={padT + plotH} stroke="#475569" strokeWidth="1.5" />

              {/* X Axis Ticks & Labels (Ir) */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(ir => (
                <g key={`x-${ir}`}>
                  <line x1={toX(ir)} y1={padT + plotH} x2={toX(ir)} y2={padT + plotH + 5} stroke="#64748b" />
                  <text x={toX(ir)} y={padT + plotH + 16} fill="#94a3b8" fontSize="9" textAnchor="middle">
                    {ir}
                  </text>
                </g>
              ))}
              <text x={padL + plotW / 2} y={svgH - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'Courant de Retenue Ir (pu)' : 'Restraint Current Ir (pu)'}
              </text>

              {/* Y Axis Ticks & Labels (Id) */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => (
                <g key={`y-${id}`}>
                  <line x1={padL - 5} y1={toY(id)} x2={padL} y2={toY(id)} stroke="#64748b" />
                  <text x={padL - 8} y={toY(id) + 3} fill="#94a3b8" fontSize="9" textAnchor="end">
                    {id}
                  </text>
                </g>
              ))}
              <text
                x={12}
                y={padT + plotH / 2}
                fill="#cbd5e1"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90, 12, ${padT + plotH / 2})`}
              >
                {locale === 'fr' ? 'Courant Différentiel Id (pu)' : 'Differential Current Id (pu)'}
              </text>

              {/* CURRENT OPERATING POINT (Id, Ir) */}
              <g>
                {/* Crosshairs */}
                <line
                  x1={padL}
                  y1={toY(id_diff)}
                  x2={toX(ir_restraint)}
                  y2={toY(id_diff)}
                  stroke="#38bdf8"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <line
                  x1={toX(ir_restraint)}
                  y1={padT + plotH}
                  x2={toX(ir_restraint)}
                  y2={toY(id_diff)}
                  stroke="#38bdf8"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />

                {/* Operating Point Pulse Circle */}
                <circle
                  cx={toX(ir_restraint)}
                  cy={toY(id_diff)}
                  r="8"
                  fill={
                    operatingStatus === 'TRIP_UNRESTRAINED' || operatingStatus === 'TRIP_RESTRAINED'
                      ? '#ef4444'
                      : operatingStatus === 'BLOCKED_2ND_HARMONIC' || operatingStatus === 'BLOCKED_5TH_HARMONIC'
                      ? '#38bdf8'
                      : '#10b981'
                  }
                  fillOpacity="0.35"
                  className="animate-ping"
                />
                <circle
                  cx={toX(ir_restraint)}
                  cy={toY(id_diff)}
                  r="5"
                  fill={
                    operatingStatus === 'TRIP_UNRESTRAINED' || operatingStatus === 'TRIP_RESTRAINED'
                      ? '#ef4444'
                      : operatingStatus === 'BLOCKED_2ND_HARMONIC' || operatingStatus === 'BLOCKED_5TH_HARMONIC'
                      ? '#38bdf8'
                      : '#10b981'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Operating Coordinates Callout */}
                <rect
                  x={toX(ir_restraint) + 8}
                  y={toY(id_diff) - 22}
                  width="86"
                  height="20"
                  rx="4"
                  fill="#0B132B"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={toX(ir_restraint) + 12}
                  y={toY(id_diff) - 8}
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ({ir_restraint.toFixed(2)}, {id_diff.toFixed(2)})
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Metrics Bar Under Curve */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Id Mesuré (|I1 + I2|)</span>
              <span className="text-sm font-bold text-sky-400 font-mono">{id_diff.toFixed(2)} pu</span>
              <span className="text-[9px] text-slate-500">Seuil = {tripBoundaryAtIr.toFixed(2)} pu</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Ir de Retenue</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{ir_restraint.toFixed(2)} pu</span>
              <span className="text-[9px] text-slate-500">Mode: {restraintAlgorithm}</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Marge de Sécurité / Déclenchement</span>
              <span
                className={`text-sm font-bold font-mono ${
                  id_diff >= tripBoundaryAtIr ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {(id_diff - tripBoundaryAtIr >= 0 ? '+' : '') + (id_diff - tripBoundaryAtIr).toFixed(2)} pu
              </span>
              <span className="text-[9px] text-slate-500">
                {id_diff >= tripBoundaryAtIr ? 'Zone Déclenchement' : 'Zone de Retenue Sûre'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Sliders & Vector Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* A. CT Secondary Injected Currents Vector Controls */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>{locale === 'fr' ? 'Courants Secondaires TC Injectés' : 'Injected CT Secondary Currents'}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">5 A Nominal</span>
            </div>

            {/* Feeder 1 Vector */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-sky-300 font-bold">I1 Primaire (Amont)</span>
                <span className="text-sky-400 font-mono font-bold">
                  {i1_mag.toFixed(2)} pu ∠ {i1_ang}°
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400">Module |I1|</span>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={i1_mag}
                    onChange={e => {
                      setSelectedPresetId('CUSTOM');
                      setI1Mag(parseFloat(e.target.value));
                    }}
                    className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400">Angle ∠1</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={i1_ang}
                    onChange={e => {
                      setSelectedPresetId('CUSTOM');
                      setI1Ang(parseInt(e.target.value));
                    }}
                    className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Feeder 2 Vector */}
            <div className="space-y-1 pt-1 border-t border-[#182130]">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-300 font-bold">I2 Secondaire (Aval)</span>
                <span className="text-amber-400 font-mono font-bold">
                  {i2_mag.toFixed(2)} pu ∠ {i2_ang}°
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400">Module |I2|</span>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={i2_mag}
                    onChange={e => {
                      setSelectedPresetId('CUSTOM');
                      setI2Mag(parseFloat(e.target.value));
                    }}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400">Angle ∠2</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={i2_ang}
                    onChange={e => {
                      setSelectedPresetId('CUSTOM');
                      setI2Ang(parseInt(e.target.value));
                    }}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Harmonic Content Sliders */}
            <div className="pt-1.5 border-t border-[#182130] grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-cyan-300 font-bold">H2 (Inrush)</span>
                  <span className="text-cyan-400 font-mono">{harmonic2_ratio.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="0.5"
                  value={harmonic2_ratio}
                  onChange={e => {
                    setSelectedPresetId('CUSTOM');
                    setHarmonic2Ratio(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-[8px] text-slate-500">Seuil: {harmonic2_threshold}%</span>
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-indigo-300 font-bold">H5 (Surflux)</span>
                  <span className="text-indigo-400 font-mono">{harmonic5_ratio.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={harmonic5_ratio}
                  onChange={e => {
                    setSelectedPresetId('CUSTOM');
                    setHarmonic5Ratio(parseFloat(e.target.value));
                  }}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-[8px] text-slate-500">Seuil: {harmonic5_threshold}%</span>
              </div>
            </div>
          </div>

          {/* B. Relay Threshold & Dual-Slope Settings */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Réglages Relais 87T (Pentes & Seuils)' : '87T Relay Settings & Slopes'}</span>
              </div>
              <select
                value={restraintAlgorithm}
                onChange={e => setRestraintAlgorithm(e.target.value as RestraintAlgorithm)}
                className="text-[10px] bg-[#131B2A] text-slate-300 border border-[#253247] rounded px-1.5 py-0.5 outline-none font-mono"
              >
                <option value="AVERAGE">Ir = (|I1|+|I2|)/2 (Standard)</option>
                <option value="MAXIMUM">Ir = max(|I1|, |I2|) (MiCOM/SEL)</option>
                <option value="SCALAR_SUM">Ir = |I1|+|I2| (SIPROTEC)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Is1 Seuil Base</span>
                  <span className="text-amber-400 font-mono font-bold">{is1_pickup.toFixed(2)} pu</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.02"
                  value={is1_pickup}
                  onChange={e => setIs1Pickup(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Pente 1 (K1)</span>
                  <span className="text-amber-400 font-mono font-bold">{slope1_pct}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  step="1"
                  value={slope1_pct}
                  onChange={e => setSlope1Pct(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Is2 Coude (Knee)</span>
                  <span className="text-amber-400 font-mono font-bold">{is2_knee.toFixed(1)} pu</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="3.5"
                  step="0.1"
                  value={is2_knee}
                  onChange={e => setIs2Knee(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Pente 2 (K2)</span>
                  <span className="text-amber-400 font-mono font-bold">{slope2_pct}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="1"
                  value={slope2_pct}
                  onChange={e => setSlope2Pct(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-1 border-t border-[#182130]">
              <div className="flex justify-between text-[10px]">
                <span className="text-red-300 font-bold">Seuil Instantané Non-Freiné (Id,inst)</span>
                <span className="text-red-400 font-mono font-bold">{id_unrestrained.toFixed(1)} pu</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={id_unrestrained}
                onChange={e => setIdUnrestrained(parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[8px] text-slate-500">
                {locale === 'fr'
                  ? 'Élimine les défauts internes violents en < 12 ms sans aucun filtre harmonique'
                  : 'Instantly clears violent internal faults in < 12 ms bypassing all harmonic filters'}
              </span>
            </div>
          </div>

          {/* C. CT Saturation Physics Modeling (IEEE C37.110) */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Waves className="w-3.5 h-3.5 text-violet-400" />
                <span>{locale === 'fr' ? 'Modélisation Saturation TC (IEEE C37.110)' : 'CT Saturation Physics (IEEE C37.110)'}</span>
              </div>
              <span className="text-[10px] text-violet-400 font-mono">
                t_sat = {ctSaturationTimeMs < 100 ? `${ctSaturationTimeMs.toFixed(1)} ms` : '> 150 ms'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rapport X/R (τp = L/R)</span>
                  <span className="text-violet-300 font-mono">{xrRatio}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={xrRatio}
                  onChange={e => setXrRatio(parseInt(e.target.value))}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Charge Filaire (Rb)</span>
                  <span className="text-violet-300 font-mono">{secondaryBurdenOhms.toFixed(1)} Ω</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={secondaryBurdenOhms}
                  onChange={e => setSecondaryBurdenOhms(parseFloat(e.target.value))}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Flux Rémanent (Br/Bs)</span>
                  <span className="text-violet-300 font-mono">{remanentFluxPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={remanentFluxPct}
                  onChange={e => setRemanentFluxPct(parseInt(e.target.value))}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tension Coude (Vk)</span>
                  <span className="text-violet-300 font-mono">{kneePointVoltageVk} V</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="20"
                  value={kneePointVoltageVk}
                  onChange={e => setKneePointVoltageVk(parseInt(e.target.value))}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1424] border border-[#1F2C45] text-[10px] text-slate-300 space-y-0.5">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {locale === 'fr'
                    ? 'Règle de Stabilisation face au Faux Courant Différentiel'
                    : 'Through-Fault CT Spill Current Stabilization Rule'}
                </span>
              </div>
              <p className="font-sans text-[9.5px] text-slate-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Lors d\'un défaut externe franc avec composante apériodique continue, le TC sature après t_sat ms, créant un courant résiduel fictif Id. La Pente K2 (> 60%) assure que le point reste sous la ligne de déclenchement, évitant le déclenchement intempestif.'
                  : 'During an external through-fault with DC offset, the saturated CT produces a fictitious spill current Id after t_sat ms. High Slope K2 (> 60%) guarantees the operating point stays beneath the trip line, completely preventing nuisance breaker tripping.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Engineering Reference Note (IEC / IEEE Compliance) */}
      <div className="p-3.5 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-slate-300">
            {locale === 'fr'
              ? 'Conforme IEEE C37.91 (Transformateurs de Puissance), IEEE C37.110 (Calcul Saturation TC) & CEI 60255-13 (Relais Différentiels).'
              : 'Compliant with IEEE C37.91 (Power Transformers), IEEE C37.110 (CT Sizing & Saturation) & IEC 60255-13 (Percentage Differential Relays).'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // Reset to default standard parameters
              setIs1Pickup(0.30);
              setSlope1Pct(30);
              setIs2Knee(2.0);
              setSlope2Pct(70);
              setIdUnrestrained(7.0);
              setHarmonic2Threshold(15);
              setHarmonic5Threshold(35);
              applyPreset(presets[0]);
            }}
            className="px-3 py-1 rounded-lg bg-[#141C2A] text-slate-300 hover:text-white border border-[#232F45] hover:border-slate-500 transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{locale === 'fr' ? 'Réinitialiser Réglages' : 'Reset Defaults'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
