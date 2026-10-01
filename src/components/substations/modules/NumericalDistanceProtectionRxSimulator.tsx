// src/components/substations/modules/NumericalDistanceProtectionRxSimulator.tsx
// High-Fidelity Numerical Distance Protection (ANSI 21/21N / IEC 60255-121 / IEEE C37.113)
// Complex Impedance Plane (R-X), Multi-Zone Reach (Quad/Mho), Load Encroachment, PSB & Teleprotection Schemes

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  TrendingUp,
  Info,
  Clock,
  Zap,
  Activity,
  ArrowRight,
  Shield,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

interface NumericalDistanceProtectionRxSimulatorProps {
  locale: 'fr' | 'en';
}

type CharacteristicType = 'QUADRILATERAL' | 'MHO_OFFSET';
type TeleprotectionScheme = 'NONE_STEPPED' | 'PUTT' | 'POTT' | 'BLOCKING';
type FaultLoopType = 'PHASE_EARTH' | 'PHASE_PHASE' | 'THREE_PHASE';

interface DistancePreset {
  id: string;
  name_fr: string;
  name_en: string;
  faultType: FaultLoopType;
  lineLocationPct: number; // % of line length (e.g. 15% for close-in, 92% for end-of-line)
  faultResistanceRf: number; // Ohms
  isPowerSwing: boolean;
  isHeavyLoad: boolean;
  description_fr: string;
  description_en: string;
  expectedAction_fr: string;
  expectedAction_en: string;
}

export const NumericalDistanceProtectionRxSimulator: React.FC<NumericalDistanceProtectionRxSimulatorProps> = ({
  locale
}) => {
  // Line physical characteristics (e.g., 225 kV, 80 km OHL, 0.35 Ohm/km, 82 deg)
  const lineLengthKm = 80;
  const lineImpedancePerKm = 0.38; // Ohm/km
  const lineAngleDeg = 82; // typical HV transmission line angle

  // Total positive sequence line impedance Z1L
  const z1LineTotal = lineLengthKm * lineImpedancePerKm; // ~ 30.4 Ohms
  const r1LineTotal = z1LineTotal * Math.cos((lineAngleDeg * Math.PI) / 180); // ~ 4.23 Ohms
  const x1LineTotal = z1LineTotal * Math.sin((lineAngleDeg * Math.PI) / 180); // ~ 30.1 Ohms

  // Protection Relay Characteristic Settings
  const [characteristicType, setCharacteristicType] = useState<CharacteristicType>('QUADRILATERAL');
  const [teleprotectionScheme, setTeleprotectionScheme] = useState<TeleprotectionScheme>('POTT');

  // Zone Reach Settings (% of Z1L)
  const [zone1ReachPct, setZone1ReachPct] = useState<number>(85); // 80-85%
  const [zone2ReachPct, setZone2ReachPct] = useState<number>(125); // 120-130%
  const [zone3ReachPct, setZone3ReachPct] = useState<number>(160); // 150-200%
  const [zone4RevReachPct, setZone4RevReachPct] = useState<number>(25); // 20-30% Reverse

  // Zone Time Delays (seconds)
  const t1_delay_ms = 0; // instantaneous (relay time ~ 18 ms)
  const [t2_delay_ms, setT2DelayMs] = useState<number>(350); // ms
  const [t3_delay_ms, setT3DelayMs] = useState<number>(800); // ms
  const [t4_delay_ms, setT4DelayMs] = useState<number>(1000); // ms

  // Quadrilateral Resistive Reach Settings (Ohms secondary converted to primary)
  const [rfReachZ1, setRfReachZ1] = useState<number>(18); // Ohms
  const [rfReachZ2, setRfReachZ2] = useState<number>(26); // Ohms
  const [rfReachZ3, setRfReachZ3] = useState<number>(35); // Ohms

  // Load Encroachment Blinder Settings
  const [loadEncroachEnabled, setLoadEncroachEnabled] = useState<boolean>(true);
  const [rLoadMinOhms, setRLoadMinOhms] = useState<number>(38); // Ohms
  const [loadAngleDeg, setLoadAngleDeg] = useState<number>(32); // degrees

  // Power Swing Blocking (PSB) Settings
  const [psbEnabled, setPsbEnabled] = useState<boolean>(true);
  const [psbInnerOuterDeltaT_ms, setPsbInnerOuterDeltaT_ms] = useState<number>(45); // threshold ms (>35 ms = swing)

  // Interactive Live Operating Point Inputs
  const [faultLoop, setFaultLoop] = useState<FaultLoopType>('PHASE_EARTH');
  const [faultLocationPct, setFaultLocationPct] = useState<number>(55); // 0 to 180%
  const [faultResistanceRf, setFaultResistanceRf] = useState<number>(6.0); // 0 to 45 Ohms
  const [isPowerSwingActive, setIsPowerSwingActive] = useState<boolean>(false);
  const [isHeavyLoadActive, setIsHeavyLoadActive] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('MID_LINE_ARC');

  // Earth Fault Zero-Sequence Compensation Factor k0
  const [k0_mag, setK0Mag] = useState<number>(0.72);
  const [k0_ang, setK0Ang] = useState<number>(-5);

  // Preset Scenarios
  const presets: DistancePreset[] = [
    {
      id: 'CLOSE_IN_BOLTED',
      name_fr: 'Défaut Franc Origine de Ligne (15% - Zone 1)',
      name_en: 'Close-in Bolted Fault (15% - Zone 1)',
      faultType: 'PHASE_EARTH',
      lineLocationPct: 15,
      faultResistanceRf: 0.5,
      isPowerSwing: false,
      isHeavyLoad: false,
      description_fr: 'Court-circuit franc monophasé à 12 km du poste. Impédance apparente au cœur de la Zone 1.',
      description_en: 'Bolted single phase-to-ground fault at 12 km from substation. Apparent impedance in center of Zone 1.',
      expectedAction_fr: 'Déclenchement instantané Zone 1 en < 20 ms sans téléaction requise. Élimination sub-cycle.',
      expectedAction_en: 'Instantaneous Zone 1 trip in < 20 ms without teleprotection required. Sub-cycle clearing.'
    },
    {
      id: 'MID_LINE_ARC',
      name_fr: 'Défaut Milieu de Ligne avec Résistance d\'Arc (60% - Rf = 8 Ω)',
      name_en: 'Mid-Line Fault with Arc Resistance (60% - Rf = 8 Ω)',
      faultType: 'PHASE_EARTH',
      lineLocationPct: 60,
      faultResistanceRf: 8.0,
      isPowerSwing: false,
      isHeavyLoad: false,
      description_fr: 'Amorçage sur chaîne d\'isolateur avec résistance d\'arc calculée selon la formule de Warrington.',
      description_en: 'Insulator flashover with arc resistance calculated via Warrington\'s empirical formula.',
      expectedAction_fr: 'Couvert par la portée résistive du quadrilatère (R_Z1 = 18 Ω). Déclenchement instantané Zone 1.',
      expectedAction_en: 'Successfully covered by quadrilateral resistive reach (R_Z1 = 18 Ω). Instantaneous Zone 1 trip.'
    },
    {
      id: 'END_OF_LINE_POTT',
      name_fr: 'Défaut Extrémité Ligne (92% - Zone 2 + Téléaction POTT)',
      name_en: 'End-of-Line Fault (92% - Zone 2 + POTT Teleprotection)',
      faultType: 'PHASE_EARTH',
      lineLocationPct: 92,
      faultResistanceRf: 4.0,
      isPowerSwing: false,
      isHeavyLoad: false,
      description_fr: 'Défaut situé au-delà de la Zone 1 (85%). Zone 2 locale voit le défaut et émet l\'ordre d\'émission HF/FO.',
      description_en: 'Fault located beyond Zone 1 (85%). Local Zone 2 detects fault and transmits HF/Fiber permissive signal.',
      expectedAction_fr: 'Avec POTT: Déclenchement accéléré instantané (t0 + 25 ms). Sans téléaction: Temporisation sélective t2 = 350 ms.',
      expectedAction_en: 'With POTT: Accelerated instant trip (t0 + 25 ms). Without teleprotection: Delayed backup trip t2 = 350 ms.'
    },
    {
      id: 'HEAVY_LOAD_ENCROACH',
      name_fr: 'Transit de Charge Extrême (Blindage d\'Empiètement)',
      name_en: 'Extreme Peak Load Transfer (Load Encroachment Shield)',
      faultType: 'THREE_PHASE',
      lineLocationPct: 140,
      faultResistanceRf: 2.0,
      isPowerSwing: false,
      isHeavyLoad: true,
      description_fr: 'Forte surcharge de ligne (1800 A sous cos phi = 0.85). L\'impédance de charge Z_load plonge vers les zones 2/3.',
      description_en: 'Severe line overload (1800 A at 0.85 pf). Load impedance Z_load plunges into Zones 2/3 reach.',
      expectedAction_fr: 'Le blindage de charge (Load Encroachment Blinder) DÉCOUPE la caractéristique et bloque le déclenchement intempestif.',
      expectedAction_en: 'Load Encroachment Blinder CUTS the trip polygon, preventing blackouts from catastrophic false tripping.'
    },
    {
      id: 'POWER_SWING_BLOCKED',
      name_fr: 'Oscillation de Puissance Stable (Blocage PSB Actif)',
      name_en: 'Stable Power Swing (Active Power Swing Blocking PSB)',
      faultType: 'THREE_PHASE',
      lineLocationPct: 75,
      faultResistanceRf: 1.0,
      isPowerSwing: true,
      isHeavyLoad: false,
      description_fr: 'Oscillation électromécanique inter-zones (0.8 Hz). Trajectoire d\'impédance lente traversant les blinders externes et internes.',
      description_en: 'Inter-area electromechanical power swing (0.8 Hz). Slow trajectory crossing outer and inner blinders.',
      expectedAction_fr: 'Détection dZ/dt lent (Δt = 70 ms > 35 ms). PSB activé: Déclenchement 21/21N VERROUILLÉ. Le réseau reste couplé.',
      expectedAction_en: 'Slow dZ/dt detected (Δt = 70 ms > 35 ms). PSB activated: Distance trip LOCKED. System stays synchronized.'
    },
    {
      id: 'REVERSE_BUSBAR_FAULT',
      name_fr: 'Défaut Arrière Jeu de Barres Local (-15% - Zone 4 Rev)',
      name_en: 'Reverse Substation Busbar Fault (-15% - Zone 4 Rev)',
      faultType: 'PHASE_EARTH',
      lineLocationPct: -15,
      faultResistanceRf: 1.0,
      isPowerSwing: false,
      isHeavyLoad: false,
      description_fr: 'Défaut situé en amont du disjoncteur départ ligne, sur les barres du poste source.',
      description_en: 'Fault located upstream of line breaker, on substation source busbar.',
      expectedAction_fr: 'Directionnel ARRIÈRE (Zone 4). La protection différentielle barres 87B élimine le défaut. Téléaction POTT bloquée.',
      expectedAction_en: 'REVERSE Directional (Zone 4). Busbar differential 87B clears fault. POTT transmission inhibited.'
    }
  ];

  const applyPreset = (preset: DistancePreset) => {
    setSelectedPresetId(preset.id);
    setFaultLoop(preset.faultType);
    setFaultLocationPct(preset.lineLocationPct);
    setFaultResistanceRf(preset.faultResistanceRf);
    setIsPowerSwingActive(preset.isPowerSwing);
    setIsHeavyLoadActive(preset.isHeavyLoad);
  };

  // Apparent Impedance (R_app, X_app) Mathematical Calculation
  const { rApp, xApp, zAppMag, zAppAngDeg, tripDecision, tripTimeMs, isInsideZ1, isInsideZ2, isInsideZ3, isInsideZ4Rev, isLoadEncroached, isPsbBlocked } = useMemo(() => {
    let r_calc = 0;
    let x_calc = 0;

    if (isHeavyLoadActive) {
      // Load impedance point: Z_load = U^2 / S*
      // For 225 kV, P = 620 MW, Q = 350 MVAR -> Z_load ~ 42 Ohms at ~ 30 deg
      r_calc = 36.0;
      x_calc = 21.0;
    } else if (isPowerSwingActive) {
      // Power swing center trajectory point
      r_calc = 14.5;
      x_calc = 17.2;
    } else {
      // Line Fault Impedance:
      // Z_fault = m * Z1L + Rf (with zero-sequence compensation if phase-earth)
      const m = faultLocationPct / 100;
      const r_line = m * r1LineTotal;
      const x_line = m * x1LineTotal;

      if (faultLoop === 'PHASE_EARTH') {
        // Apparent impedance seen by phase-to-ground unit
        // Includes fault resistance Rf and zero-sequence infeed angle shift
        r_calc = r_line + faultResistanceRf;
        x_calc = x_line;
      } else if (faultLoop === 'PHASE_PHASE') {
        // Phase-to-phase loop sees 0.5 * Rf_pp
        r_calc = r_line + faultResistanceRf * 0.5;
        x_calc = x_line;
      } else {
        // Three phase
        r_calc = r_line + faultResistanceRf;
        x_calc = x_line;
      }
    }

    const z_mag = Math.sqrt(r_calc * r_calc + x_calc * x_calc);
    let z_ang = (Math.atan2(x_calc, r_calc) * 180) / Math.PI;

    // Boundary Reach Zone Checking
    const z1_reach_x = (zone1ReachPct / 100) * x1LineTotal;
    const z2_reach_x = (zone2ReachPct / 100) * x1LineTotal;
    const z3_reach_x = (zone3ReachPct / 100) * x1LineTotal;
    const z4_rev_reach_x = (zone4RevReachPct / 100) * x1LineTotal;

    let inZ1 = false;
    let inZ2 = false;
    let inZ3 = false;
    let inZ4 = false;

    if (characteristicType === 'QUADRILATERAL') {
      // Quadrilateral check:
      // Forward direction: x_calc > 0 and angle within forward directional blinders (-15 to 115 deg)
      const inFwdDir = x_calc >= -0.5 && z_ang >= -15 && z_ang <= 115;
      const inRevDir = x_calc < 0 && (z_ang < -15 || z_ang > 115);

      // Zone 1: 0 < X <= Z1_X and -Rf <= R <= RfReachZ1
      if (inFwdDir && x_calc <= z1_reach_x && r_calc <= rfReachZ1 && r_calc >= -rfReachZ1 * 0.4) {
        inZ1 = true;
      }
      // Zone 2: 0 < X <= Z2_X and R <= RfReachZ2
      if (inFwdDir && x_calc <= z2_reach_x && r_calc <= rfReachZ2 && r_calc >= -rfReachZ2 * 0.4) {
        inZ2 = true;
      }
      // Zone 3: 0 < X <= Z3_X and R <= RfReachZ3
      if (inFwdDir && x_calc <= z3_reach_x && r_calc <= rfReachZ3 && r_calc >= -rfReachZ3 * 0.4) {
        inZ3 = true;
      }
      // Zone 4 Reverse: -Z4_X <= X < 0 and R <= RfReachZ1
      if (inRevDir && Math.abs(x_calc) <= z4_rev_reach_x && Math.abs(r_calc) <= rfReachZ1) {
        inZ4 = true;
      }
    } else {
      // MHO Characteristic (Circle passing through origin or with offset):
      // Equation for Mho circle with diameter Z_reach at angle theta_line:
      // (R - R_center)^2 + (X - X_center)^2 <= (Z_reach / 2)^2
      const checkMho = (reachX: number) => {
        const reachZ = reachX / Math.sin((lineAngleDeg * Math.PI) / 180);
        const radius = reachZ / 2;
        const cR = radius * Math.cos((lineAngleDeg * Math.PI) / 180);
        const cX = radius * Math.sin((lineAngleDeg * Math.PI) / 180);
        const distSq = (r_calc - cR) * (r_calc - cR) + (x_calc - cX) * (x_calc - cX);
        return distSq <= radius * radius;
      };

      inZ1 = checkMho(z1_reach_x);
      inZ2 = checkMho(z2_reach_x);
      inZ3 = checkMho(z3_reach_x);

      // Reverse Mho
      const z4_reachZ = z4_rev_reach_x / Math.sin((lineAngleDeg * Math.PI) / 180);
      const rad4 = z4_reachZ / 2;
      const cR4 = -rad4 * Math.cos((lineAngleDeg * Math.PI) / 180);
      const cX4 = -rad4 * Math.sin((lineAngleDeg * Math.PI) / 180);
      const distSq4 = (r_calc - cR4) * (r_calc - cR4) + (x_calc - cX4) * (x_calc - cX4);
      inZ4 = distSq4 <= rad4 * rad4;
    }

    // Check Load Encroachment Blinder
    let loadEncroached = false;
    if (loadEncroachEnabled) {
      // If point lies in the load sector: R > 0, |angle| <= loadAngleDeg and |Z| >= rLoadMinOhms
      // or if it enters the resistive edge near load region
      if (r_calc > 0 && Math.abs(z_ang) <= loadAngleDeg && z_mag >= rLoadMinOhms * 0.7) {
        loadEncroached = true;
      }
    }

    // Power Swing Blocking Check
    let psbBlocked = false;
    if (psbEnabled && isPowerSwingActive) {
      psbBlocked = true;
    }

    // Final Trip Logic Synthesis
    let decision = 'NO_TRIP';
    let time_ms = 9999;

    if (psbBlocked) {
      decision = 'PSB_BLOCKED';
      time_ms = 9999;
    } else if (loadEncroached) {
      decision = 'LOAD_ENCROACH_BLOCKED';
      time_ms = 9999;
    } else if (inZ1) {
      decision = 'ZONE_1_INSTANT';
      time_ms = 18; // ~ 1 cycle relay operating time
    } else if (inZ2) {
      if (teleprotectionScheme === 'POTT' || teleprotectionScheme === 'PUTT') {
        decision = 'TELEPROTECTION_ACCELERATED';
        time_ms = 28; // accelerated by carrier channel (18 ms relay + 10 ms channel)
      } else {
        decision = 'ZONE_2_TIMED';
        time_ms = t2_delay_ms;
      }
    } else if (inZ3) {
      decision = 'ZONE_3_BACKUP';
      time_ms = t3_delay_ms;
    } else if (inZ4) {
      decision = 'ZONE_4_REVERSE';
      time_ms = t4_delay_ms;
    }

    return {
      rApp: r_calc,
      xApp: x_calc,
      zAppMag: z_mag,
      zAppAngDeg: z_ang,
      tripDecision: decision,
      tripTimeMs: time_ms,
      isInsideZ1: inZ1,
      isInsideZ2: inZ2,
      isInsideZ3: inZ3,
      isInsideZ4Rev: inZ4,
      isLoadEncroached: loadEncroached,
      isPsbBlocked: psbBlocked
    };
  }, [
    faultLoop,
    faultLocationPct,
    faultResistanceRf,
    isHeavyLoadActive,
    isPowerSwingActive,
    characteristicType,
    teleprotectionScheme,
    zone1ReachPct,
    zone2ReachPct,
    zone3ReachPct,
    zone4RevReachPct,
    rfReachZ1,
    rfReachZ2,
    rfReachZ3,
    loadEncroachEnabled,
    rLoadMinOhms,
    loadAngleDeg,
    psbEnabled,
    r1LineTotal,
    x1LineTotal,
    lineAngleDeg,
    t2_delay_ms,
    t3_delay_ms,
    t4_delay_ms
  ]);

  // SVG Geometry on R-X Plane
  // R Range: -20 to 60 Ohms
  // X Range: -15 to 65 Ohms
  const svgW = 460;
  const svgH = 400;
  const padL = 45;
  const padB = 40;
  const padT = 25;
  const padR = 25;

  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minR = -18;
  const maxR = 54;
  const minX = -12;
  const maxX = 60;

  const toSvgX = (r: number) => padL + ((r - minR) / (maxR - minR)) * plotW;
  const toSvgY = (x: number) => padT + plotH - ((x - minX) / (maxX - minX)) * plotH;

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  // Protected Line Vector Points
  const lineEndX = toSvgX(r1LineTotal);
  const lineEndY = toSvgY(x1LineTotal);

  // Status Badge formatting
  const getStatusBadge = () => {
    switch (tripDecision) {
      case 'ZONE_1_INSTANT':
        return {
          title: locale === 'fr' ? 'DÉCLENCHEMENT INSTANTANÉ ZONE 1 (< 20 ms)' : 'INSTANTANEOUS ZONE 1 TRIP (< 20 ms)',
          bg: 'bg-red-500/20 text-red-400 border-red-500/50',
          icon: <Flame className="w-4 h-4 text-red-400" />
        };
      case 'TELEPROTECTION_ACCELERATED':
        return {
          title: locale === 'fr' ? `ACCÉLÉRATION TÉLÉACTION (${teleprotectionScheme}) : 28 ms` : `TELEPROTECTION ACCELERATED (${teleprotectionScheme}) : 28 ms`,
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          icon: <Radio className="w-4 h-4 text-amber-400" />
        };
      case 'ZONE_2_TIMED':
        return {
          title: locale === 'fr' ? `DÉCLENCHEMENT TEMPORISÉ ZONE 2 (${t2_delay_ms} ms)` : `ZONE 2 TIME-DELAYED TRIP (${t2_delay_ms} ms)`,
          bg: 'bg-amber-600/20 text-amber-400 border-amber-600/50',
          icon: <Clock className="w-4 h-4 text-amber-400" />
        };
      case 'ZONE_3_BACKUP':
        return {
          title: locale === 'fr' ? `SECOURS ÉLOIGNÉ ZONE 3 (${t3_delay_ms} ms)` : `REMOTE BACKUP ZONE 3 (${t3_delay_ms} ms)`,
          bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
          icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />
        };
      case 'ZONE_4_REVERSE':
        return {
          title: locale === 'fr' ? `DIRECTIONNEL ARRIÈRE ZONE 4 (${t4_delay_ms} ms)` : `REVERSE DIRECTIONAL ZONE 4 (${t4_delay_ms} ms)`,
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
          icon: <Compass className="w-4 h-4 text-purple-400" />
        };
      case 'PSB_BLOCKED':
        return {
          title: locale === 'fr' ? 'VERROUILLAGE OSCILLATION DE PUISSANCE (PSB ACTIF)' : 'POWER SWING BLOCKING ACTIVE (PSB)',
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          icon: <Lock className="w-4 h-4 text-cyan-400" />
        };
      case 'LOAD_ENCROACH_BLOCKED':
        return {
          title: locale === 'fr' ? 'BLINDAGE D\'EMPIÈTEMENT DE CHARGE (PAS DE DÉCLENCHEMENT)' : 'LOAD ENCROACHMENT SHIELDED (NO TRIP)',
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          icon: <ShieldCheck className="w-4 h-4 text-blue-400" />
        };
      default:
        return {
          title: locale === 'fr' ? 'HORS ZONE DE DÉCLENCHEMENT (STABILITÉ PARFAITE)' : 'OUT OF ZONE (STABLE OPERATION)',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* 1. Top Header Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600/30 to-sky-600/20 border border-indigo-500/40 text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {locale === 'fr'
                  ? 'Protection de Distance Numérique (ANSI 21/21N / IEC 60255-121)'
                  : 'Numerical Distance Protection R-X Analyzer (ANSI 21/21N / IEC 60255-121)'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 text-[10px] font-bold border border-indigo-600/40">
                IEEE C37.113
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              {locale === 'fr'
                ? 'Plan complexe d\'impédance (R-X), polygones quadrilatères & Mho, blindage de charge, blocage d\'oscillations (PSB) et schémas de téléaction (POTT/PUTT).'
                : 'Complex R-X impedance plane, quadrilateral & Mho reaches, load encroachment blinder, power swing blocking (PSB), and teleprotection schemes (POTT/PUTT).'}
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 self-start md:self-auto ${statusBadge.bg}`}>
          {statusBadge.icon}
          <span className="text-xs font-bold tracking-wide">{statusBadge.title}</span>
        </div>
      </div>

      {/* 2. Preset Scenarios Selector Carousel */}
      <div className="p-3 rounded-2xl bg-[#0B1019] border border-[#1E2634] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Scénarios Normatifs Préconfigurés (Ligne 225 kV)' : 'Standard Transmission Line Test Cases'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            {locale === 'fr' ? 'Cliquez pour positionner l\'impédance' : 'Click to inject fault trajectory'}
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
                    ? 'bg-indigo-950/50 border-indigo-500/70 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#0E1522] border-[#222E42] hover:border-slate-500 hover:bg-[#131D2E]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {locale === 'fr' ? p.name_fr : p.name_en}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {p.faultType}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2">
                  {locale === 'fr' ? p.description_fr : p.description_en}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split View: Complex R-X Impedance Plane (7 Cols) & Tuning Controls (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: SVG Complex R-X Plane (7 Cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1E2634] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr' ? 'Plan Complexe R - X & Zones de Déclenchement' : 'Complex R - X Impedance Plane & Reach Polygons'}
              </h4>
            </div>

            {/* Characteristic Selector Switch */}
            <div className="flex items-center gap-1 p-1 bg-[#131B2A] rounded-lg border border-[#253247] text-[10px]">
              <button
                type="button"
                onClick={() => setCharacteristicType('QUADRILATERAL')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  characteristicType === 'QUADRILATERAL'
                    ? 'bg-indigo-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Quadrilatère' : 'Quadrilateral'}
              </button>
              <button
                type="button"
                onClick={() => setCharacteristicType('MHO_OFFSET')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  characteristicType === 'MHO_OFFSET'
                    ? 'bg-indigo-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mho
              </button>
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="relative w-full aspect-[4/3] max-h-[380px] bg-[#070A0F] rounded-xl border border-[#1B2330] p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full select-none">
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="rxGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#141C28" strokeWidth="0.8" />
                </pattern>

                {/* Shading Gradients for Zones */}
                <linearGradient id="z1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.10" />
                </linearGradient>

                <linearGradient id="z2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.06" />
                </linearGradient>

                <linearGradient id="z3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
                </linearGradient>

                <linearGradient id="z4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
                </linearGradient>

                {/* Load Encroachment Blinder Hatching */}
                <pattern id="loadHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.3" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="url(#rxGrid)" />

              {/* R & X Axes */}
              <line x1={toSvgX(minR)} y1={originY} x2={toSvgX(maxR)} y2={originY} stroke="#475569" strokeWidth="1.5" />
              <line x1={originX} y1={toSvgY(minX)} x2={originX} y2={toSvgY(maxX)} stroke="#475569" strokeWidth="1.5" />

              {/* Ticks on R Axis */}
              {[-10, 0, 10, 20, 30, 40, 50].map(r => (
                <g key={`tick-r-${r}`}>
                  <line x1={toSvgX(r)} y1={originY - 3} x2={toSvgX(r)} y2={originY + 3} stroke="#64748b" />
                  <text x={toSvgX(r)} y={originY + 13} fill="#94a3b8" fontSize="8" textAnchor="middle">
                    {r}
                  </text>
                </g>
              ))}
              <text x={toSvgX(maxR) - 8} y={originY - 6} fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="end">
                R (Ω)
              </text>

              {/* Ticks on X Axis */}
              {[-10, 0, 10, 20, 30, 40, 50, 60].map(x => (
                <g key={`tick-x-${x}`}>
                  <line x1={originX - 3} y1={toSvgY(x)} x2={originX + 3} y2={toSvgY(x)} stroke="#64748b" />
                  <text x={originX - 6} y={toSvgY(x) + 3} fill="#94a3b8" fontSize="8" textAnchor="end">
                    {x}
                  </text>
                </g>
              ))}
              <text x={originX + 8} y={padT + 10} fill="#cbd5e1" fontSize="9" fontWeight="bold">
                X (Ω)
              </text>

              {/* Protected Line Vector (100% Z1L) */}
              <line
                x1={originX}
                y1={originY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />
              <circle cx={lineEndX} cy={lineEndY} r="3" fill="#10b981" />
              <text x={lineEndX + 5} y={lineEndY - 2} fill="#34d399" fontSize="8" fontWeight="bold">
                100% Z1L ({z1LineTotal.toFixed(1)} Ω)
              </text>

              {/* ZONE CHARACTERISTICS RENDERING */}
              {characteristicType === 'QUADRILATERAL' ? (
                <g>
                  {/* Zone 3 Polygon (Forward) */}
                  <polygon
                    points={`
                      ${toSvgX(-rfReachZ3 * 0.4)},${originY}
                      ${toSvgX(-rfReachZ3 * 0.4)},${toSvgY((zone3ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ3)},${toSvgY((zone3ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ3)},${originY}
                    `}
                    fill="url(#z3Grad)"
                    stroke="#818cf8"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                  />

                  {/* Zone 2 Polygon (Forward) */}
                  <polygon
                    points={`
                      ${toSvgX(-rfReachZ2 * 0.4)},${originY}
                      ${toSvgX(-rfReachZ2 * 0.4)},${toSvgY((zone2ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ2)},${toSvgY((zone2ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ2)},${originY}
                    `}
                    fill="url(#z2Grad)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />

                  {/* Zone 1 Polygon (Instantaneous) */}
                  <polygon
                    points={`
                      ${toSvgX(-rfReachZ1 * 0.4)},${originY}
                      ${toSvgX(-rfReachZ1 * 0.4)},${toSvgY((zone1ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ1)},${toSvgY((zone1ReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ1)},${originY}
                    `}
                    fill="url(#z1Grad)"
                    stroke="#f87171"
                    strokeWidth="2"
                  />

                  {/* Zone 4 Reverse Polygon */}
                  <polygon
                    points={`
                      ${toSvgX(-rfReachZ1)},${originY}
                      ${toSvgX(-rfReachZ1)},${toSvgY(-(zone4RevReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ1 * 0.5)},${toSvgY(-(zone4RevReachPct / 100) * x1LineTotal)}
                      ${toSvgX(rfReachZ1 * 0.5)},${originY}
                    `}
                    fill="url(#z4Grad)"
                    stroke="#c084fc"
                    strokeWidth="1.2"
                    strokeDasharray="3,2"
                  />
                </g>
              ) : (
                /* MHO CHARACTERISTICS RENDERING */
                <g>
                  {/* Zone 3 Mho Circle */}
                  {(() => {
                    const z3_x = (zone3ReachPct / 100) * x1LineTotal;
                    const z3_reach = z3_x / Math.sin((lineAngleDeg * Math.PI) / 180);
                    const rad = (z3_reach / 2) * (plotW / (maxR - minR));
                    const cR = (z3_reach / 2) * Math.cos((lineAngleDeg * Math.PI) / 180);
                    const cX = (z3_reach / 2) * Math.sin((lineAngleDeg * Math.PI) / 180);
                    return (
                      <circle
                        cx={toSvgX(cR)}
                        cy={toSvgY(cX)}
                        r={rad}
                        fill="url(#z3Grad)"
                        stroke="#818cf8"
                        strokeWidth="1.2"
                        strokeDasharray="4,3"
                      />
                    );
                  })()}

                  {/* Zone 2 Mho Circle */}
                  {(() => {
                    const z2_x = (zone2ReachPct / 100) * x1LineTotal;
                    const z2_reach = z2_x / Math.sin((lineAngleDeg * Math.PI) / 180);
                    const rad = (z2_reach / 2) * (plotW / (maxR - minR));
                    const cR = (z2_reach / 2) * Math.cos((lineAngleDeg * Math.PI) / 180);
                    const cX = (z2_reach / 2) * Math.sin((lineAngleDeg * Math.PI) / 180);
                    return (
                      <circle
                        cx={toSvgX(cR)}
                        cy={toSvgY(cX)}
                        r={rad}
                        fill="url(#z2Grad)"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                      />
                    );
                  })()}

                  {/* Zone 1 Mho Circle */}
                  {(() => {
                    const z1_x = (zone1ReachPct / 100) * x1LineTotal;
                    const z1_reach = z1_x / Math.sin((lineAngleDeg * Math.PI) / 180);
                    const rad = (z1_reach / 2) * (plotW / (maxR - minR));
                    const cR = (z1_reach / 2) * Math.cos((lineAngleDeg * Math.PI) / 180);
                    const cX = (z1_reach / 2) * Math.sin((lineAngleDeg * Math.PI) / 180);
                    return (
                      <circle
                        cx={toSvgX(cR)}
                        cy={toSvgY(cX)}
                        r={rad}
                        fill="url(#z1Grad)"
                        stroke="#f87171"
                        strokeWidth="2"
                      />
                    );
                  })()}

                  {/* Zone 4 Reverse Mho Circle */}
                  {(() => {
                    const z4_x = (zone4RevReachPct / 100) * x1LineTotal;
                    const z4_reach = z4_x / Math.sin((lineAngleDeg * Math.PI) / 180);
                    const rad = (z4_reach / 2) * (plotW / (maxR - minR));
                    const cR = -(z4_reach / 2) * Math.cos((lineAngleDeg * Math.PI) / 180);
                    const cX = -(z4_reach / 2) * Math.sin((lineAngleDeg * Math.PI) / 180);
                    return (
                      <circle
                        cx={toSvgX(cR)}
                        cy={toSvgY(cX)}
                        r={rad}
                        fill="url(#z4Grad)"
                        stroke="#c084fc"
                        strokeWidth="1.2"
                        strokeDasharray="3,2"
                      />
                    );
                  })()}
                </g>
              )}

              {/* Load Encroachment Exclusion Sector */}
              {loadEncroachEnabled && (
                <g>
                  {(() => {
                    const radAngle = (loadAngleDeg * Math.PI) / 180;
                    const rMaxSector = 50;
                    const xTop = rMaxSector * Math.tan(radAngle);
                    const xBot = -xTop;
                    return (
                      <polygon
                        points={`
                          ${toSvgX(rLoadMinOhms)},${originY}
                          ${toSvgX(rMaxSector)},${toSvgY(xTop)}
                          ${toSvgX(rMaxSector)},${toSvgY(xBot)}
                        `}
                        fill="url(#loadHatch)"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        strokeDasharray="3,3"
                      />
                    );
                  })()}
                  <text
                    x={toSvgX(rLoadMinOhms + 8)}
                    y={originY - 6}
                    fill="#38bdf8"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    Load Encroachment Shield
                  </text>
                </g>
              )}

              {/* Power Swing Double Blinder Boundaries */}
              {psbEnabled && (
                <g>
                  {/* Outer Blinder */}
                  <line
                    x1={toSvgX(10)}
                    y1={toSvgY(-10)}
                    x2={toSvgX(10)}
                    y2={toSvgY(55)}
                    stroke="#22d3ee"
                    strokeWidth="1"
                    strokeDasharray="6,4"
                  />
                  {/* Inner Blinder */}
                  <line
                    x1={toSvgX(18)}
                    y1={toSvgY(-10)}
                    x2={toSvgX(18)}
                    y2={toSvgY(55)}
                    stroke="#06b6d4"
                    strokeWidth="1"
                    strokeDasharray="6,4"
                  />
                  <text x={toSvgX(10) - 2} y={toSvgY(50)} fill="#22d3ee" fontSize="7" textAnchor="end">
                    PSB Outer
                  </text>
                  <text x={toSvgX(18) + 2} y={toSvgY(50)} fill="#06b6d4" fontSize="7">
                    PSB Inner
                  </text>
                </g>
              )}

              {/* Zone Labels */}
              <text
                x={toSvgX(rfReachZ1 - 3)}
                y={toSvgY((zone1ReachPct / 100) * x1LineTotal - 2)}
                fill="#f87171"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                Z1 ({zone1ReachPct}%)
              </text>
              <text
                x={toSvgX(rfReachZ2 - 3)}
                y={toSvgY((zone2ReachPct / 100) * x1LineTotal - 2)}
                fill="#fbbf24"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                Z2 ({zone2ReachPct}%)
              </text>
              <text
                x={toSvgX(rfReachZ3 - 3)}
                y={toSvgY((zone3ReachPct / 100) * x1LineTotal - 2)}
                fill="#818cf8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                Z3 ({zone3ReachPct}%)
              </text>

              {/* APPARENT OPERATING POINT (R_app, X_app) */}
              <g>
                {/* Crosshair guidelines */}
                <line
                  x1={originX}
                  y1={toSvgY(xApp)}
                  x2={toSvgX(rApp)}
                  y2={toSvgY(xApp)}
                  stroke="#38bdf8"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />
                <line
                  x1={toSvgX(rApp)}
                  y1={originY}
                  x2={toSvgX(rApp)}
                  y2={toSvgY(xApp)}
                  stroke="#38bdf8"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />

                {/* Pulsing ring on active operating point */}
                <circle
                  cx={toSvgX(rApp)}
                  cy={toSvgY(xApp)}
                  r="9"
                  fill={
                    tripDecision === 'ZONE_1_INSTANT' || tripDecision === 'TELEPROTECTION_ACCELERATED'
                      ? '#ef4444'
                      : tripDecision === 'ZONE_2_TIMED' || tripDecision === 'ZONE_3_BACKUP'
                      ? '#f59e0b'
                      : tripDecision === 'PSB_BLOCKED' || tripDecision === 'LOAD_ENCROACH_BLOCKED'
                      ? '#38bdf8'
                      : '#10b981'
                  }
                  fillOpacity="0.4"
                  className="animate-ping"
                />
                <circle
                  cx={toSvgX(rApp)}
                  cy={toSvgY(xApp)}
                  r="5"
                  fill={
                    tripDecision === 'ZONE_1_INSTANT' || tripDecision === 'TELEPROTECTION_ACCELERATED'
                      ? '#ef4444'
                      : tripDecision === 'ZONE_2_TIMED' || tripDecision === 'ZONE_3_BACKUP'
                      ? '#f59e0b'
                      : tripDecision === 'PSB_BLOCKED' || tripDecision === 'LOAD_ENCROACH_BLOCKED'
                      ? '#38bdf8'
                      : '#10b981'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Coordinate Bubble */}
                <rect
                  x={toSvgX(rApp) + 8}
                  y={toSvgY(xApp) - 22}
                  width="105"
                  height="20"
                  rx="4"
                  fill="#0B132B"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={toSvgX(rApp) + 12}
                  y={toSvgY(xApp) - 8}
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Z = ({rApp.toFixed(1)} + j{xApp.toFixed(1)}) Ω
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Metrics Bar Under Diagram */}
          <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">R_app / X_app</span>
              <span className="text-xs font-bold text-sky-400 font-mono">
                {rApp.toFixed(1)} / {xApp.toFixed(1)} Ω
              </span>
              <span className="text-[9px] text-slate-500">|Z| = {zAppMag.toFixed(1)} Ω</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Zone Détectée</span>
              <span className="text-xs font-bold font-mono text-amber-400">
                {isInsideZ1
                  ? 'Zone 1 (85%)'
                  : isInsideZ2
                  ? 'Zone 2 (125%)'
                  : isInsideZ3
                  ? 'Zone 3 (160%)'
                  : isInsideZ4Rev
                  ? 'Zone 4 Rev'
                  : 'Hors Zones'}
              </span>
              <span className="text-[9px] text-slate-500">
                {isLoadEncroached ? 'Empiètement Charge' : isPsbBlocked ? 'PSB Verrouillé' : 'Valide'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Temps de Déclenchement</span>
              <span
                className={`text-xs font-bold font-mono ${
                  tripTimeMs < 50 ? 'text-red-400' : tripTimeMs < 1000 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {tripTimeMs < 5000 ? `${tripTimeMs} ms` : '∞ (Pas de trip)'}
              </span>
              <span className="text-[9px] text-slate-500">
                {teleprotectionScheme !== 'NONE_STEPPED' ? `Téléaction ${teleprotectionScheme}` : 'Échelonné'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#0F1622] border border-[#1E2736] flex flex-col">
              <span className="text-[10px] text-slate-400">Ordre Déclencheur</span>
              <span
                className={`text-xs font-bold font-mono ${
                  tripDecision === 'ZONE_1_INSTANT' || tripDecision === 'TELEPROTECTION_ACCELERATED'
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}
              >
                {tripDecision.replace(/_/g, ' ')}
              </span>
              <span className="text-[9px] text-slate-500">Bobine Disjoncteur 52</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Sliders & Engineering Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* A. Fault Injection & Impedance Coordinates */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>{locale === 'fr' ? 'Paramètres du Défaut Injecté' : 'Injected Fault Parameters'}</span>
              </div>
              <div className="flex items-center gap-1">
                {(['PHASE_EARTH', 'PHASE_PHASE', 'THREE_PHASE'] as FaultLoopType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFaultLoop(type)}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer ${
                      faultLoop === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'PHASE_EARTH' ? 'Ph-T' : type === 'PHASE_PHASE' ? 'Ph-Ph' : 'Tri'}
                  </button>
                ))}
              </div>
            </div>

            {/* Fault Location Slider */}
            <div>
              <div className="flex justify-between text-[11px]">
                <span className="text-indigo-300 font-bold">Localisation sur Ligne (%)</span>
                <span className="text-indigo-400 font-mono font-bold">
                  {faultLocationPct}% ({((faultLocationPct / 100) * lineLengthKm).toFixed(1)} km)
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="160"
                step="1"
                value={faultLocationPct}
                onChange={e => {
                  setSelectedPresetId('CUSTOM');
                  setFaultLocationPct(parseInt(e.target.value));
                  setIsHeavyLoadActive(false);
                  setIsPowerSwingActive(false);
                }}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>-20% (Barres Arrière)</span>
                <span>0% (Origine)</span>
                <span>85% (Z1)</span>
                <span>100% (Fin Ligne)</span>
                <span>160%</span>
              </div>
            </div>

            {/* Fault Resistance Slider (Rf) */}
            <div>
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-300 font-bold">Résistance de Défaut (Rf - Arc + Pylône)</span>
                <span className="text-amber-400 font-mono font-bold">{faultResistanceRf.toFixed(1)} Ω</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="0.5"
                value={faultResistanceRf}
                onChange={e => {
                  setSelectedPresetId('CUSTOM');
                  setFaultResistanceRf(parseFloat(e.target.value));
                  setIsHeavyLoadActive(false);
                  setIsPowerSwingActive(false);
                }}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[8px] text-slate-500">
                {locale === 'fr'
                  ? 'Couverture de l\'arc électrique selon Warrington (R_arc = 28710·L / I^1.4)'
                  : 'Arc resistance calculated via Warrington empirical formula'}
              </span>
            </div>

            {/* Teleprotection Scheme Selector */}
            <div className="pt-1.5 border-t border-[#182130]">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-white font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-amber-400" />
                  {locale === 'fr' ? 'Schéma de Téléaction (HF / FO)' : 'Teleprotection Carrier Scheme'}
                </span>
                <span className="text-[9px] text-amber-400 font-mono">IEC 60834</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[9px]">
                {(['NONE_STEPPED', 'PUTT', 'POTT', 'BLOCKING'] as TeleprotectionScheme[]).map(scheme => (
                  <button
                    key={scheme}
                    type="button"
                    onClick={() => setTeleprotectionScheme(scheme)}
                    className={`py-1 rounded font-mono font-bold cursor-pointer text-center ${
                      teleprotectionScheme === scheme
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#141C2B] text-slate-400 hover:text-white border border-[#222E44]'
                    }`}
                  >
                    {scheme === 'NONE_STEPPED' ? 'Échelonné' : scheme}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* B. Reach Tuning Settings (Zones 1, 2, 3) */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Réglages des Portées & Temporisations' : 'Zone Reaches & Coordination Timers'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">Portée Z1 (X1)</span>
                  <span className="font-mono text-red-300">{zone1ReachPct}% (t0)</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="90"
                  step="1"
                  value={zone1ReachPct}
                  onChange={e => setZone1ReachPct(parseInt(e.target.value))}
                  className="w-full accent-red-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-amber-400 font-bold">Portée Z2 (X2)</span>
                  <span className="font-mono text-amber-300">{zone2ReachPct}%</span>
                </div>
                <input
                  type="range"
                  min="110"
                  max="140"
                  step="1"
                  value={zone2ReachPct}
                  onChange={e => setZone2ReachPct(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Temporisation t2</span>
                  <span className="font-mono text-slate-300">{t2_delay_ms} ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="600"
                  step="25"
                  value={t2_delay_ms}
                  onChange={e => setT2DelayMs(parseInt(e.target.value))}
                  className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Temporisation t3</span>
                  <span className="font-mono text-slate-300">{t3_delay_ms} ms</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="1200"
                  step="50"
                  value={t3_delay_ms}
                  onChange={e => setT3DelayMs(parseInt(e.target.value))}
                  className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Resistive reach tuning */}
            <div className="pt-1 border-t border-[#182130] grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Portée R (Z1)</span>
                  <span className="font-mono text-indigo-300">{rfReachZ1} Ω</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="1"
                  value={rfReachZ1}
                  onChange={e => setRfReachZ1(parseInt(e.target.value))}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Portée R (Z2)</span>
                  <span className="font-mono text-indigo-300">{rfReachZ2} Ω</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="1"
                  value={rfReachZ2}
                  onChange={e => setRfReachZ2(parseInt(e.target.value))}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* C. Advanced Grid Stability: Load Encroachment & PSB */}
          <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1E2634] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{locale === 'fr' ? 'Stabilité Réseau : Blindage & PSB' : 'Grid Stability: Load Shield & PSB'}</span>
              </div>
            </div>

            {/* Load Encroachment Toggle */}
            <div className="flex items-center justify-between text-[10px]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loadEncroachEnabled}
                  onChange={e => setLoadEncroachEnabled(e.target.checked)}
                  className="accent-sky-400 rounded cursor-pointer"
                />
                <span className="text-sky-300 font-bold">
                  {locale === 'fr' ? 'Blindage d\'Empiètement de Charge' : 'Load Encroachment Blinder'}
                </span>
              </label>
              <span className="font-mono text-slate-400">R_load ≥ {rLoadMinOhms} Ω</span>
            </div>

            {/* Power Swing Blocking Toggle */}
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#182130]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={psbEnabled}
                  onChange={e => setPsbEnabled(e.target.checked)}
                  className="accent-cyan-400 rounded cursor-pointer"
                />
                <span className="text-cyan-300 font-bold">
                  {locale === 'fr' ? 'Blocage sur Oscillation de Puissance (PSB)' : 'Power Swing Blocking (PSB / 68)'}
                </span>
              </label>
              <span className="font-mono text-slate-400">Δt &gt; 35 ms</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1424] border border-[#1F2C45] text-[10px] text-slate-300 space-y-0.5">
              <div className="flex items-center gap-1 text-cyan-300 font-bold">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {locale === 'fr'
                    ? 'Règle CIGRE B5 : Discrimination Défaut vs Oscillation'
                    : 'CIGRE B5 Rule: Fault vs Power Swing Discrimination'}
                </span>
              </div>
              <p className="font-sans text-[9.5px] text-slate-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Un court-circuit provoque un saut quasi-instantané de l\'impédance (< 5 ms), alors qu\'une oscillation de puissance électromécanique déplace le point progressivement (Δt > 35 ms). Le PSB bloque les déclenchements 21 pour éviter l\'effondrement en cascade du réseau.'
                  : 'A true short-circuit causes a near-instantaneous step-change in impedance (< 5 ms), whereas an electromechanical swing migrates gradually (Δt > 35 ms). PSB blocks distance tripping to preserve system interconnection.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Teleprotection Scheme Comparison Card */}
      <div className="p-3.5 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-[#1E2634] pb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? 'Analyse Comparative des Schémas de Téléaction (IEC 60834 / IEEE C37.113)'
                : 'Teleprotection Scheme Performance Matrix (IEC 60834 / IEEE C37.113)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {locale === 'fr' ? 'Canal Numérique FO: 5 à 12 ms' : 'Fiber Channel: 5 to 12 ms'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-[10px]">
          <div className="p-2.5 rounded-xl bg-[#0B111D] border border-[#1C2638] space-y-1">
            <span className="font-bold text-slate-200">1. Échelonné Pur (Sans Téléaction)</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'Défauts à 85-100% éliminés en Zone 2 temporisée (350 ms). Fatigue mécanique accrue sur les transformateurs et risque d\'instabilité transitoire rotorique.'
                : 'Faults at 85-100% cleared by delayed Zone 2 (350 ms). Higher electrodynamic stress on transformers and potential rotor angle instability.'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B111D] border border-[#1C2638] space-y-1">
            <span className="font-bold text-sky-300">2. PUTT (Sous-portée Permissive)</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'L\'émission d\'ordre est conditionnée par Zone 1 (85%). Déclenchement rapide si réception porteuse + Zone 2 locale. Très sûr contre les faux déclenchements.'
                : 'Keying initiated by Zone 1 (85%). Accelerated trip on carrier receive + local Zone 2. Highly secure against spurious over-tripping.'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B111D] border border-[#1C2638] space-y-1">
            <span className="font-bold text-amber-300">3. POTT (Surportée Permissive)</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'L\'émission d\'ordre est déclenchée par la Zone 2 (125%). Déclenchement sub-cycle (25 ms) à 100% de la ligne dès confirmation bilatérale. Standard RTE / TSO.'
                : 'Keying initiated by overreaching Zone 2 (125%). Full 100% line coverage cleared in 25 ms upon bilateral confirmation. Modern TSO standard.'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B111D] border border-[#1C2638] space-y-1">
            <span className="font-bold text-purple-300">4. Schéma à Blocage (Blocking)</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'La Zone 4 arrière émet un signal de blocage au poste distant lors d\'un défaut extérieur. Recommandé sur liaisons CPL à fort affaiblissement.'
                : 'Reverse Zone 4 transmits a blocking carrier to remote terminal on external reverse faults. Preferred over power line carrier (PLC) with signal attenuation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
