// src/services/protectionCoordinationService.ts
// Standards: IEC 60255-151 (Functional requirements for overcurrent protection)
//            IEC 60909 (Short-circuit currents calculation in three-phase a.c. systems)
//            IEEE 242 (Buff Book - Recommended Practice for Protection and Coordination)

export type IecCurveType = 'IEC_SI' | 'IEC_VI' | 'IEC_EI' | 'IEC_LTI' | 'IEEE_MI' | 'IEEE_VI' | 'IEEE_EI';

export interface CurveParameters {
  k: number;
  alpha: number;
  c?: number; // IEEE constant
  nameFr: string;
  nameEn: string;
  norm: 'IEC 60255' | 'IEEE C37.112';
}

export const CURVE_DEFINITIONS: Record<IecCurveType, CurveParameters> = {
  IEC_SI: {
    k: 0.14,
    alpha: 0.02,
    nameFr: 'CEI Inversée Standard (SI)',
    nameEn: 'IEC Standard Inverse (SI)',
    norm: 'IEC 60255',
  },
  IEC_VI: {
    k: 13.5,
    alpha: 1.0,
    nameFr: 'CEI Très Inversée (VI)',
    nameEn: 'IEC Very Inverse (VI)',
    norm: 'IEC 60255',
  },
  IEC_EI: {
    k: 80.0,
    alpha: 2.0,
    nameFr: 'CEI Extrêmement Inversée (EI)',
    nameEn: 'IEC Extremely Inverse (EI)',
    norm: 'IEC 60255',
  },
  IEC_LTI: {
    k: 120.0,
    alpha: 1.0,
    nameFr: 'CEI Temps Long Inverse (LTI)',
    nameEn: 'IEC Long-Time Inverse (LTI)',
    norm: 'IEC 60255',
  },
  IEEE_MI: {
    k: 0.0515,
    alpha: 0.02,
    c: 0.114,
    nameFr: 'IEEE Modérément Inversée',
    nameEn: 'IEEE Moderately Inverse',
    norm: 'IEEE C37.112',
  },
  IEEE_VI: {
    k: 19.61,
    alpha: 2.0,
    c: 0.491,
    nameFr: 'IEEE Très Inversée',
    nameEn: 'IEEE Very Inverse',
    norm: 'IEEE C37.112',
  },
  IEEE_EI: {
    k: 28.2,
    alpha: 2.0,
    c: 0.1217,
    nameFr: 'IEEE Extrêmement Inversée',
    nameEn: 'IEEE Extremely Inverse',
    norm: 'IEEE C37.112',
  },
};

export interface RelayCoordinationSettings {
  id: string;
  tag: string;
  nameFr: string;
  nameEn: string;
  voltageKv: number;
  ansiCode: string;
  pickupCurrentA: number;
  tms: number; // Time Multiplier Setting / Time Dial
  curveType: IecCurveType;
  instantaneousPickupA?: number; // Stage 50 instantaneous threshold
  instantaneousDelayS?: number; // Definite time delay
  color: string;
  breakerOpenTimeMs: number; // SF6 or Vacuum CB opening time (typically 40-60 ms)
}

/**
 * Calculates relay operating time according to IEC 60255-151 or IEEE C37.112
 * Formula IEC: t = TMS * [ k / ((I / Is)^alpha - 1) ]
 * Formula IEEE: t = TD * [ (k / ((I / Is)^alpha - 1)) + c ]
 */
export function calculateRelayTripTime(
  currentA: number,
  settings: RelayCoordinationSettings
): number {
  if (currentA <= settings.pickupCurrentA) {
    return Infinity;
  }

  // Check instantaneous threshold (ANSI 50)
  if (settings.instantaneousPickupA && currentA >= settings.instantaneousPickupA) {
    return Math.max(0.02, settings.instantaneousDelayS ?? 0.03);
  }

  const curve = CURVE_DEFINITIONS[settings.curveType];
  const ratio = currentA / settings.pickupCurrentA;

  let operatingTime: number;
  if (curve.norm === 'IEEE C37.112' && curve.c !== undefined) {
    operatingTime = settings.tms * (curve.k / (Math.pow(ratio, curve.alpha) - 1) + curve.c);
  } else {
    operatingTime = settings.tms * (curve.k / (Math.pow(ratio, curve.alpha) - 1));
  }

  // Physical minimum floor (relay processing + measurement algorithm window)
  return Math.max(0.03, operatingTime);
}

export interface SelectivityGradingResult {
  downstreamRelayTag: string;
  upstreamRelayTag: string;
  faultCurrentA: number;
  tDownstreamS: number;
  tUpstreamS: number;
  deltaTMs: number;
  minGradingMarginMs: number;
  isSelective: boolean;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'BLINDING_RISK' | 'OVERLAP_TRIP';
  detailsFr: string;
  detailsEn: string;
}

/**
 * Evaluates Selectivity Grading Margin (Δt) between primary (downstream)
 * and backup (upstream) relays per IEC 60255 & IEEE 242.
 * Recommended margin:
 * - Breaker opening time: 50 ms (SF6 / Vacuum)
 * - Relay overshoot/reset: 30 ms
 * - CT & safety margin: 120 ms
 * Total minimum margin Δt >= 250 - 300 ms for electro-mechanical/static, >= 200 ms for numeric relays.
 */
export function evaluateGradingMargin(
  downstream: RelayCoordinationSettings,
  upstream: RelayCoordinationSettings,
  faultCurrentA: number,
  numericRelay: boolean = true
): SelectivityGradingResult {
  const tDownstream = calculateRelayTripTime(faultCurrentA, downstream);
  const tUpstream = calculateRelayTripTime(faultCurrentA, upstream);

  const minMarginMs = numericRelay ? 250 : 300;
  const deltaTMs = (tUpstream - tDownstream) * 1000;

  let isSelective = false;
  let status: SelectivityGradingResult['status'] = 'OVERLAP_TRIP';
  let detailsFr = '';
  let detailsEn = '';

  if (tDownstream === Infinity) {
    status = 'ACCEPTABLE';
    isSelective = true;
    detailsFr = 'Relais aval hors zone de déclenchement pour ce courant.';
    detailsEn = 'Downstream relay out of operating zone for this current.';
  } else if (tUpstream <= tDownstream) {
    status = 'OVERLAP_TRIP';
    isSelective = false;
    detailsFr = `Défaut de coordination critique: le disjoncteur amont déclenche avant l'aval (Δt = ${deltaTMs.toFixed(0)} ms). Coupure intempestive du poste!`;
    detailsEn = `Critical miscoordination: upstream breaker trips before downstream (Δt = ${deltaTMs.toFixed(0)} ms). Uncoordinated blackout!`;
  } else if (deltaTMs < minMarginMs) {
    status = 'BLINDING_RISK';
    isSelective = false;
    detailsFr = `Marge insuffisante: Δt = ${deltaTMs.toFixed(0)} ms < ${minMarginMs} ms requis. Risque d'ouverture simultanée des deux disjoncteurs.`;
    detailsEn = `Insufficient margin: Δt = ${deltaTMs.toFixed(0)} ms < ${minMarginMs} ms required. Risk of simultaneous dual breaker tripping.`;
  } else if (deltaTMs <= 450) {
    status = 'OPTIMAL';
    isSelective = true;
    detailsFr = `Sélectivité optimale: Δt = ${deltaTMs.toFixed(0)} ms (marge conforme aux règles CEI 60255 / IEEE 242).`;
    detailsEn = `Optimal selectivity: Δt = ${deltaTMs.toFixed(0)} ms (margin compliant with IEC 60255 / IEEE 242).`;
  } else {
    status = 'ACCEPTABLE';
    isSelective = true;
    detailsFr = `Sélectivité garantie: Δt = ${deltaTMs.toFixed(0)} ms. Dégagement de défaut aval assuré avec marge de secours large.`;
    detailsEn = `Guaranteed selectivity: Δt = ${deltaTMs.toFixed(0)} ms. Downstream fault cleared safely with ample backup margin.`;
  }

  return {
    downstreamRelayTag: downstream.tag,
    upstreamRelayTag: upstream.tag,
    faultCurrentA,
    tDownstreamS: tDownstream,
    tUpstreamS: tUpstream,
    deltaTMs,
    minGradingMarginMs: minMarginMs,
    isSelective,
    status,
    detailsFr,
    detailsEn,
  };
}

/**
 * Standard substation relay protection configuration presets
 */
export const DEFAULT_SUBSTATION_RELAY_PLAN: {
  feederF1: RelayCoordinationSettings;
  incomerMv: RelayCoordinationSettings;
  trafoHv: RelayCoordinationSettings;
  lineHv: RelayCoordinationSettings;
} = {
  feederF1: {
    id: 'relay_f1',
    tag: 'F1 (ANSI 51)',
    nameFr: 'Départ HTA 30 kV F1 (Yaoundé Sud)',
    nameEn: '30 kV Feeder F1 (South Yaoundé)',
    voltageKv: 30,
    ansiCode: '51/50',
    pickupCurrentA: 250,
    tms: 0.12,
    curveType: 'IEC_SI',
    instantaneousPickupA: 3200,
    instantaneousDelayS: 0.04,
    color: '#F59E0B',
    breakerOpenTimeMs: 45,
  },
  incomerMv: {
    id: 'relay_52_3',
    tag: '52-3 (ANSI 51)',
    nameFr: 'Arrivée HTA 30 kV TR-1 (52-3)',
    nameEn: '30 kV MV Incomer TR-1 (52-3)',
    voltageKv: 30,
    ansiCode: '51/51N',
    pickupCurrentA: 850,
    tms: 0.22,
    curveType: 'IEC_SI',
    instantaneousPickupA: 7500,
    instantaneousDelayS: 0.05,
    color: '#10B981',
    breakerOpenTimeMs: 50,
  },
  trafoHv: {
    id: 'relay_52_2',
    tag: '52-2 (ANSI 51)',
    nameFr: 'Disjoncteur HTB Transfo 225 kV (52-2)',
    nameEn: '225 kV Trafo HV Breaker (52-2)',
    voltageKv: 225,
    ansiCode: '51/87T',
    pickupCurrentA: 220,
    tms: 0.28,
    curveType: 'IEC_SI',
    instantaneousPickupA: 2800,
    instantaneousDelayS: 0.05,
    color: '#8B5CF6',
    breakerOpenTimeMs: 50,
  },
  lineHv: {
    id: 'relay_52_1',
    tag: '52-1 (ANSI 51)',
    nameFr: 'Arrivée Ligne 225 kV (52-1 Mangoumbé)',
    nameEn: '225 kV Line Incomer (52-1 Mangoumbé)',
    voltageKv: 225,
    ansiCode: '51/21',
    pickupCurrentA: 600,
    tms: 0.32,
    curveType: 'IEC_SI',
    instantaneousPickupA: 8000,
    instantaneousDelayS: 0.06,
    color: '#0284C7',
    breakerOpenTimeMs: 50,
  },
};
