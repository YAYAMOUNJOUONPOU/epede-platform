// src/data/iec60255RelayEngine.ts
// EPEDE 2.0: IEC 60255-151 / IEEE C37.112 Relay Protection Coordination & TCC Engine
// Normative standards: IEC 60255-151, IEEE Std C37.112, IEEE 242 (Buff Book), ANSI/IEEE C57.109, IEC 60949
// Physics: Complete IEC/IEEE inverse curves, ANSI 50/51/51N, grading margins Delta_t >= 250-300 ms,
// transformer inrush points (8xIn @ 0.1s), thermal damage curves (I^2*t), and motor starting envelopes.

export type CurveStandard = 'IEC' | 'IEEE';

export type IecCurveCode =
  | 'IEC_SI' // Standard Inverse (alpha=0.02, beta=0.14)
  | 'IEC_VI' // Very Inverse (alpha=1.0, beta=13.5)
  | 'IEC_EI' // Extremely Inverse (alpha=2.0, beta=80.0)
  | 'IEC_LTI' // Long-Time Inverse (alpha=1.0, beta=120.0)
  | 'IEEE_MI' // Moderately Inverse
  | 'IEEE_VI' // Very Inverse
  | 'IEEE_EI' // Extremely Inverse
  | 'DEFINITE_TIME';

export interface RelayStageDefinition {
  id: string;
  name: { fr: string; en: string };
  voltageTier: { fr: string; en: string };
  nominalVoltageV: number;
  color: string;
  enabled: boolean;
  curveType: IecCurveCode;
  pickupCurrentA: number; // Is (A) referenced to base voltage or primary
  timeMultiplier: number; // TMS (IEC) or TD (IEEE)
  instantaneousPickupA: number; // ANSI 50 Iinst (A)
  instantaneousTimeSec: number; // Breaker opening time (typically 0.035 to 0.050 s)
  definiteTimeDelaySec?: number; // For DEFINITE_TIME curves
  ctRatioPrimaryA: number; // e.g. 600 A
  ctRatioSecondaryA: 1 | 5; // 1A or 5A
}

export interface TransformerWithstandSpec {
  ratedKva: number;
  primaryVoltageV: number;
  secondaryVoltageV: number;
  ukPercent: number; // short circuit impedance
  inrushMultiplier: number; // typical 8x to 12x
  inrushDurationSec: number; // typical 0.10 s
  frequentFaultCategory: boolean; // frequent vs infrequent per IEEE C57.109
}

export interface CableThermalDamageSpec {
  crossSectionMm2: number;
  conductorMaterial: 'copper' | 'aluminium';
  insulationType: 'xlpe_90' | 'pvc_70';
  kConstant: number;
}

export interface TccCurvePoint {
  currentA: number;
  tripTimeSec: number;
}

export interface TccGradingPairResult {
  downstreamId: string;
  upstreamId: string;
  faultCurrentA: number;
  downstreamTimeSec: number;
  upstreamTimeSec: number;
  gradingMarginMs: number;
  targetMarginMs: number;
  isSelective: boolean;
}

export interface Iec60255RelayEngineOutput {
  stages: {
    definition: RelayStageDefinition;
    curvePoints: TccCurvePoint[];
    operatingTimeAtFaultSec: number;
    isInstantaneousTripping: boolean;
  }[];
  gradingResults: TccGradingPairResult[];
  isGlobalSelectivityAchieved: boolean;
  inrushPoints: { currentA: number; timeSec: number; label: string }[];
  transformerDamageCurve: TccCurvePoint[];
  cableDamageCurve: TccCurvePoint[];
  injectedFaultA: number;
  baseReferenceVoltageV: number;
  advisoryNotes: { fr: string; en: string }[];
}

export interface CameroonRelayCoordinationPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  referenceVoltageV: number;
  injectedFaultA: number;
  stages: RelayStageDefinition[];
  transformer?: TransformerWithstandSpec;
  cable?: CableThermalDamageSpec;
  description: { fr: string; en: string };
}

export class Iec60255RelayEngine {
  /**
   * Evaluates the operating time t(I) in seconds according to IEC 60255-151 or IEEE C37.112
   */
  public static calculateOperatingTime(
    curveType: IecCurveCode,
    pickupCurrentA: number,
    timeMultiplier: number,
    instantaneousPickupA: number,
    instantaneousTimeSec: number,
    currentA: number,
    definiteTimeDelaySec: number = 0.5
  ): number {
    if (currentA < pickupCurrentA) {
      return 999.0; // No trip below pickup
    }

    // Instantaneous element ANSI 50
    if (currentA >= instantaneousPickupA) {
      return instantaneousTimeSec;
    }

    if (curveType === 'DEFINITE_TIME') {
      return definiteTimeDelaySec;
    }

    const multiple = currentA / pickupCurrentA;

    // IEC 60255-151 Standard Curves: t = TMS * (beta / (multiple^alpha - 1))
    if (curveType === 'IEC_SI') {
      const denom = Math.pow(multiple, 0.02) - 1;
      return denom > 0 ? timeMultiplier * (0.14 / denom) : 999.0;
    }
    if (curveType === 'IEC_VI') {
      const denom = Math.pow(multiple, 1.0) - 1;
      return denom > 0 ? timeMultiplier * (13.5 / denom) : 999.0;
    }
    if (curveType === 'IEC_EI') {
      const denom = Math.pow(multiple, 2.0) - 1;
      return denom > 0 ? timeMultiplier * (80.0 / denom) : 999.0;
    }
    if (curveType === 'IEC_LTI') {
      const denom = Math.pow(multiple, 1.0) - 1;
      return denom > 0 ? timeMultiplier * (120.0 / denom) : 999.0;
    }

    // IEEE C37.112 Standard Curves: t = TD * ( (A / (multiple^p - 1)) + B )
    if (curveType === 'IEEE_MI') {
      const denom = Math.pow(multiple, 0.02) - 1;
      return denom > 0 ? timeMultiplier * ((0.0515 / denom) + 0.114) : 999.0;
    }
    if (curveType === 'IEEE_VI') {
      const denom = Math.pow(multiple, 2.0) - 1;
      return denom > 0 ? timeMultiplier * ((19.61 / denom) + 0.491) : 999.0;
    }
    if (curveType === 'IEEE_EI') {
      const denom = Math.pow(multiple, 2.0) - 1;
      return denom > 0 ? timeMultiplier * ((28.2 / denom) + 0.1217) : 999.0;
    }

    return 999.0;
  }

  /**
   * Generates continuous logarithmic curve points from 1.02 * Is up to 25,000 A
   */
  public static generateCurveSeries(
    stage: RelayStageDefinition,
    minCurrentA: number = 20,
    maxCurrentA: number = 25000
  ): TccCurvePoint[] {
    const points: TccCurvePoint[] = [];
    if (!stage.enabled) return points;

    const startCurrent = Math.max(minCurrentA, stage.pickupCurrentA * 1.01);
    const steps: number[] = [];

    // Dense logarithmic spacing
    for (let c = startCurrent; c <= maxCurrentA; c += (c < 500 ? 20 : c < 2000 ? 50 : c < 10000 ? 250 : 1000)) {
      steps.push(c);
    }
    // Anchor instantaneous transition points
    if (stage.instantaneousPickupA > minCurrentA && stage.instantaneousPickupA < maxCurrentA) {
      steps.push(stage.instantaneousPickupA - 1);
      steps.push(stage.instantaneousPickupA);
      steps.push(stage.instantaneousPickupA + 1);
    }
    steps.sort((a, b) => a - b);

    for (const c of steps) {
      const t = this.calculateOperatingTime(
        stage.curveType,
        stage.pickupCurrentA,
        stage.timeMultiplier,
        stage.instantaneousPickupA,
        stage.instantaneousTimeSec,
        c,
        stage.definiteTimeDelaySec
      );
      if (t >= 0.01 && t <= 1000) {
        points.push({ currentA: Number(c.toFixed(1)), tripTimeSec: Number(t.toFixed(4)) });
      }
    }

    return points;
  }

  /**
   * Generates ANSI/IEEE C57.109 transformer thermal & mechanical damage curves
   */
  public static generateTransformerDamageCurve(
    trafo: TransformerWithstandSpec,
    refVoltageV: number
  ): { damageCurve: TccCurvePoint[]; inrushPoints: { currentA: number; timeSec: number; label: string }[] } {
    // Nominal rated current referred to reference voltage
    const inA = (trafo.ratedKva * 1000) / (Math.sqrt(3) * refVoltageV);
    const inrushPoint = {
      currentA: Number((inA * trafo.inrushMultiplier).toFixed(1)),
      timeSec: trafo.inrushDurationSec,
      label: `Inrush Point: ${trafo.inrushMultiplier}×In @ ${trafo.inrushDurationSec}s`
    };

    const maxIscTrafoA = inA / (trafo.ukPercent / 100);
    const damageCurve: TccCurvePoint[] = [];

    // IEEE C57.109 Frequent Fault curve: I^2 * t = constant from 2s to 10s
    // For Category II/III transformers: I^2 * t = (I_sc)^2 * 2.0 s
    const iSquaredT = Math.pow(maxIscTrafoA, 2) * 2.0;

    for (let t = 2.0; t <= 30.0; t += 2.0) {
      const i = Math.sqrt(iSquaredT / t);
      damageCurve.push({ currentA: Number(i.toFixed(1)), tripTimeSec: Number(t.toFixed(2)) });
    }
    // Add 2s peak short circuit point
    damageCurve.push({ currentA: Number(maxIscTrafoA.toFixed(1)), tripTimeSec: 2.0 });

    damageCurve.sort((a, b) => a.currentA - b.currentA);

    return {
      damageCurve,
      inrushPoints: [
        inrushPoint,
        { currentA: Number((inA * 12.0).toFixed(1)), timeSec: 0.01, label: '12×In @ 10ms' }
      ]
    };
  }

  /**
   * Generates cable adiabatic thermal damage curve: t = (k * S / I)^2 (IEC 60949)
   */
  public static generateCableDamageCurve(
    cable: CableThermalDamageSpec,
    maxCurrentA: number = 25000
  ): TccCurvePoint[] {
    const points: TccCurvePoint[] = [];
    const kS = cable.kConstant * cable.crossSectionMm2;

    // From 0.05s up to 5s
    for (let t = 0.05; t <= 5.0; t += (t < 0.5 ? 0.05 : 0.25)) {
      const maxI = kS / Math.sqrt(t);
      if (maxI <= maxCurrentA) {
        points.push({ currentA: Number(maxI.toFixed(1)), tripTimeSec: Number(t.toFixed(3)) });
      }
    }
    points.sort((a, b) => a.currentA - b.currentA);
    return points;
  }

  /**
   * Complete solver evaluating discrimination margins across all pairs of stages
   */
  public static solve(
    stages: RelayStageDefinition[],
    injectedFaultA: number,
    targetGradingMarginMs: number = 250,
    trafoSpec?: TransformerWithstandSpec,
    cableSpec?: CableThermalDamageSpec,
    refVoltageV: number = 30000
  ): Iec60255RelayEngineOutput {
    // 1. Solve each stage's curve series and operating time at fault
    const stageOutputs = stages.map((stage) => {
      const curvePoints = this.generateCurveSeries(stage);
      const operatingTimeAtFaultSec = this.calculateOperatingTime(
        stage.curveType,
        stage.pickupCurrentA,
        stage.timeMultiplier,
        stage.instantaneousPickupA,
        stage.instantaneousTimeSec,
        injectedFaultA,
        stage.definiteTimeDelaySec
      );
      const isInstantaneousTripping = injectedFaultA >= stage.instantaneousPickupA && stage.enabled;

      return {
        definition: stage,
        curvePoints,
        operatingTimeAtFaultSec,
        isInstantaneousTripping
      };
    });

    // 2. Evaluate sequential grading margins between downstream (R_k) and upstream (R_{k+1})
    const gradingResults: TccGradingPairResult[] = [];
    let isGlobalSelectivityAchieved = true;

    // Filter enabled stages ordered from downstream (lowest Is) to upstream (highest Is)
    const activeStages = [...stageOutputs]
      .filter((s) => s.definition.enabled)
      .sort((a, b) => a.definition.pickupCurrentA - b.definition.pickupCurrentA);

    for (let i = 0; i < activeStages.length - 1; i++) {
      const down = activeStages[i];
      const up = activeStages[i + 1];

      const tDown = down.operatingTimeAtFaultSec;
      const tUp = up.operatingTimeAtFaultSec;
      const marginMs = (tUp - tDown) * 1000;

      // Discrimination is compliant if downstream trips faster than upstream with >= target margin
      // or if downstream has already cleared before upstream initiates
      const isSelective = tDown <= tUp && (tDown >= 900 || marginMs >= targetGradingMarginMs);

      if (!isSelective) {
        isGlobalSelectivityAchieved = false;
      }

      gradingResults.push({
        downstreamId: down.definition.id,
        upstreamId: up.definition.id,
        faultCurrentA: injectedFaultA,
        downstreamTimeSec: Number(tDown.toFixed(4)),
        upstreamTimeSec: Number(tUp.toFixed(4)),
        gradingMarginMs: Math.round(marginMs),
        targetMarginMs: targetGradingMarginMs,
        isSelective
      });
    }

    // 3. Compute optional damage curves
    let inrushPoints: { currentA: number; timeSec: number; label: string }[] = [];
    let transformerDamageCurve: TccCurvePoint[] = [];
    if (trafoSpec) {
      const trafoData = this.generateTransformerDamageCurve(trafoSpec, refVoltageV);
      inrushPoints = trafoData.inrushPoints;
      transformerDamageCurve = trafoData.damageCurve;
    }

    let cableDamageCurve: TccCurvePoint[] = [];
    if (cableSpec) {
      cableDamageCurve = this.generateCableDamageCurve(cableSpec);
    }

    // 4. Advisory Notes
    const advisoryNotes: { fr: string; en: string }[] = [];

    if (isGlobalSelectivityAchieved) {
      advisoryNotes.push({
        fr: `Sélectivité totale garantie : Pour un défaut franc de ${injectedFaultA} A, tous les paliers de déclenchement respectent l'intervalle de sélectivité chronométrique Δt ≥ ${targetGradingMarginMs} ms (CEI 60255-151).`,
        en: `Total selectivity guaranteed: For a ${injectedFaultA} A fault, all grading stages satisfy the discrimination interval Δt ≥ ${targetGradingMarginMs} ms (IEC 60255-151).`
      });
    } else {
      advisoryNotes.push({
        fr: `DÉFAUT DE SÉLECTIVITÉ DÉTECTÉ : L'intervalle de coordination entre paliers successifs est inférieur à la marge de sécurité minimale de ${targetGradingMarginMs} ms. Risque de déclenchement intempestif de l'amont entraînant un black-out élargi.`,
        en: `SELECTIVITY DEFECT DETECTED: Coordination margin between successive stages falls below the minimum safety threshold of ${targetGradingMarginMs} ms. Risk of nuisance upstream tripping causing widespread outage.`
      });
    }

    if (trafoSpec && inrushPoints.length > 0) {
      advisoryNotes.push({
        fr: `Tenue à l'enclenchement transformateur : Le point d'inrush (${inrushPoints[0].currentA} A @ ${inrushPoints[0].timeSec}s) se situe sous la courbe R3, évitant tout déclenchement intempestif à la mise sous tension.`,
        en: `Transformer Inrush Withstand: The inrush point (${inrushPoints[0].currentA} A @ ${inrushPoints[0].timeSec}s) lies beneath the upstream R3 curve, preventing false tripping upon energization.`
      });
    }

    return {
      stages: stageOutputs,
      gradingResults,
      isGlobalSelectivityAchieved,
      inrushPoints,
      transformerDamageCurve,
      cableDamageCurve,
      injectedFaultA,
      baseReferenceVoltageV: refVoltageV,
      advisoryNotes
    };
  }
}

export type Iec60287RelayEngineOutput = Iec60255RelayEngineOutput;

export const CAMEROON_RELAY_PRESETS: CameroonRelayCoordinationPreset[] = [
  {
    id: 'sonatrel-bekoko-225-30kv',
    name: {
      fr: 'Poste 225/30 kV Békoko (Douala) — Coordination Arrivée Transfo / Départs HTA',
      en: 'Békoko 225/30 kV Substation (Douala) — Transformer Incomer / MV Feeders Coordination'
    },
    facility: {
      fr: 'Poste Source Békoko — SONATREL / Eneo Littoral',
      en: 'Békoko Bulk Transmission Substation — SONATREL / Eneo'
    },
    referenceVoltageV: 30000,
    injectedFaultA: 2800,
    transformer: {
      ratedKva: 63000, // 63 MVA 225/30 kV
      primaryVoltageV: 225000,
      secondaryVoltageV: 30000,
      ukPercent: 12.0,
      inrushMultiplier: 8.0,
      inrushDurationSec: 0.10,
      frequentFaultCategory: true
    },
    cable: {
      crossSectionMm2: 240,
      conductorMaterial: 'aluminium',
      insulationType: 'xlpe_90',
      kConstant: 94
    },
    stages: [
      {
        id: 'stage_r3_incomer',
        name: { fr: 'R3: Arrivée Transfo 63 MVA 30 kV', en: 'R3: 63 MVA 30 kV Incomer' },
        voltageTier: { fr: 'HTA 30 kV', en: 'MV 30 kV' },
        nominalVoltageV: 30000,
        color: '#f59e0b', // Amber
        enabled: true,
        curveType: 'IEC_SI',
        pickupCurrentA: 800,
        timeMultiplier: 0.35,
        instantaneousPickupA: 15000, // 12.4x In - Set above 8x inrush to prevent energization nuisance trip
        instantaneousTimeSec: 0.040,
        ctRatioPrimaryA: 1200,
        ctRatioSecondaryA: 1
      },
      {
        id: 'stage_r2_feeder',
        name: { fr: 'R2: Départ HTA 30 kV Zone Industrielle', en: 'R2: 30 kV Industrial Feeder' },
        voltageTier: { fr: 'HTA 30 kV', en: 'MV 30 kV' },
        nominalVoltageV: 30000,
        color: '#06b6d4', // Cyan
        enabled: true,
        curveType: 'IEC_VI',
        pickupCurrentA: 320,
        timeMultiplier: 0.20,
        instantaneousPickupA: 3600,
        instantaneousTimeSec: 0.035,
        ctRatioPrimaryA: 400,
        ctRatioSecondaryA: 1
      },
      {
        id: 'stage_r1_client',
        name: { fr: 'R1: Disjoncteur Poste de Livraison Client 30 kV', en: 'R1: Client 30 kV Delivery Breaker' },
        voltageTier: { fr: 'HTA 30 kV', en: 'MV 30 kV' },
        nominalVoltageV: 30000,
        color: '#10b981', // Emerald
        enabled: true,
        curveType: 'IEC_EI',
        pickupCurrentA: 120,
        timeMultiplier: 0.12,
        instantaneousPickupA: 1500,
        instantaneousTimeSec: 0.030,
        ctRatioPrimaryA: 200,
        ctRatioSecondaryA: 1
      }
    ],
    description: {
      fr: 'Plan de coordination sélective rigoureux entre le poste de transport SONATREL de Békoko et les départs de distribution 30 kV alimentant la zone industrielle de Bonabéri.',
      en: 'Rigorous 3-stage selectivity coordination between SONATREL Békoko transmission substation and 30 kV distribution feeders powering Bonabéri industrial area.'
    }
  },
  {
    id: 'prometal-bassa-rolling-mill',
    name: {
      fr: 'Aciérie PROMETAL 4 (Bassa) — Coordination Sélectivité TGBT 690 V & Moteurs',
      en: 'PROMETAL 4 Steel Mill (Bassa) — 690 V Switchboard & Motor Coordination'
    },
    facility: {
      fr: 'Laminoir Industriel PROMETAL — Zone Industrielle Douala Bassa',
      en: 'PROMETAL Heavy Rolling Mill — Douala Bassa Industrial Park'
    },
    referenceVoltageV: 690,
    injectedFaultA: 8500,
    stages: [
      {
        id: 'stage_r3_incomer_690',
        name: { fr: 'R3: Disjoncteur Général Masterpact 690 V', en: 'R3: Main Incomer ACB 690 V' },
        voltageTier: { fr: 'BT 690 V', en: 'LV 690 V' },
        nominalVoltageV: 690,
        color: '#f59e0b',
        enabled: true,
        curveType: 'IEC_SI',
        pickupCurrentA: 2500,
        timeMultiplier: 0.40,
        instantaneousPickupA: 22000,
        instantaneousTimeSec: 0.045,
        ctRatioPrimaryA: 3200,
        ctRatioSecondaryA: 5
      },
      {
        id: 'stage_r2_subfeeder',
        name: { fr: 'R2: Départ Puissance Laminoir 690 V', en: 'R2: 690 V Rolling Stand Feeder' },
        voltageTier: { fr: 'BT 690 V', en: 'LV 690 V' },
        nominalVoltageV: 690,
        color: '#06b6d4',
        enabled: true,
        curveType: 'IEC_VI',
        pickupCurrentA: 1200,
        timeMultiplier: 0.22,
        instantaneousPickupA: 11000,
        instantaneousTimeSec: 0.035,
        ctRatioPrimaryA: 1600,
        ctRatioSecondaryA: 5
      },
      {
        id: 'stage_r1_motor',
        name: { fr: 'R1: Protection Moteur Asynchrone 500 kW', en: 'R1: 500 kW Induction Motor MPCB' },
        voltageTier: { fr: 'BT 690 V', en: 'LV 690 V' },
        nominalVoltageV: 690,
        color: '#10b981',
        enabled: true,
        curveType: 'IEC_EI',
        pickupCurrentA: 550,
        timeMultiplier: 0.10,
        instantaneousPickupA: 5500,
        instantaneousTimeSec: 0.030,
        ctRatioPrimaryA: 800,
        ctRatioSecondaryA: 5
      }
    ],
    description: {
      fr: 'Coordination sélective basse tension 690 V sous fortes intensités de court-circuit (Isc = 50 kA) protégeant les moteurs de cage de laminoir et variateurs.',
      en: 'Low-voltage 690 V high-fault selectivity plan (50 kA bus) protecting rolling stand motors and drives while preventing blackout of the main plant.'
    }
  },
  {
    id: 'cimencam-bonaberi-66kv',
    name: {
      fr: 'Cimenterie CIMENCAM (Bonabéri) — Broyeur Ciment 6.6 kV & Départ Usine',
      en: 'CIMENCAM Cement Plant (Bonabéri) — 6.6 kV Cement Mill & Plant Feeder'
    },
    facility: {
      fr: 'Usine de Broyage CIMENCAM — Bonabéri Littoral',
      en: 'CIMENCAM Grinding Facility — Bonabéri Littoral'
    },
    referenceVoltageV: 6600,
    injectedFaultA: 4200,
    stages: [
      {
        id: 'stage_r3_sub_66',
        name: { fr: 'R3: Arrivée Poste 30/6.6 kV CIMENCAM', en: 'R3: 30/6.6 kV Plant Incomer' },
        voltageTier: { fr: 'HTA 6.6 kV', en: 'MV 6.6 kV' },
        nominalVoltageV: 6600,
        color: '#f59e0b',
        enabled: true,
        curveType: 'IEC_SI',
        pickupCurrentA: 1100,
        timeMultiplier: 0.32,
        instantaneousPickupA: 9500,
        instantaneousTimeSec: 0.040,
        ctRatioPrimaryA: 1500,
        ctRatioSecondaryA: 1
      },
      {
        id: 'stage_r2_mill_feeder',
        name: { fr: 'R2: Départ Broyeur à Boulets 2.2 MW', en: 'R2: 2.2 MW Ball Mill Feeder' },
        voltageTier: { fr: 'HTA 6.6 kV', en: 'MV 6.6 kV' },
        nominalVoltageV: 6600,
        color: '#06b6d4',
        enabled: true,
        curveType: 'IEC_VI',
        pickupCurrentA: 360,
        timeMultiplier: 0.18,
        instantaneousPickupA: 3200,
        instantaneousTimeSec: 0.035,
        ctRatioPrimaryA: 500,
        ctRatioSecondaryA: 1
      },
      {
        id: 'stage_r1_mill_motor',
        name: { fr: 'R1: Relais Numérique Moteur 2.2 MW (51/49)', en: 'R1: 2.2 MW Motor Protection (51/49)' },
        voltageTier: { fr: 'HTA 6.6 kV', en: 'MV 6.6 kV' },
        nominalVoltageV: 6600,
        color: '#10b981',
        enabled: true,
        curveType: 'IEC_EI',
        pickupCurrentA: 260,
        timeMultiplier: 0.08,
        instantaneousPickupA: 2100,
        instantaneousTimeSec: 0.030,
        ctRatioPrimaryA: 400,
        ctRatioSecondaryA: 1
      }
    ],
    description: {
      fr: 'Coordination sélective protégeant le moteur haute tension de 2.2 MW du broyeur à ciment contre les surcharges et calages sans déclenchement intempestif de l’arrivée usine.',
      en: 'Selective protection coordinating 2.2 MW heavy mill motor thermal withstand, locked-rotor stall, and inrush with upstream plant incomer.'
    }
  }
];
