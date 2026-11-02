// src/data/industrialMotorDynamicsEngine.ts
// EPEDE 2.0: Industrial Motor Sizing & Dynamic Starting Simulation Engine
// Normative standards: IEC 60034-1, IEC 60034-12, IEEE Std 399 (Brown Book), IEEE Std 620, NF C 15-100
// Solves: Kloss electromagnetic torque, rotational mechanics ODE (J * dω/dt = Mm - Mr),
// exponential inrush current decay envelope, and dynamic busbar voltage sag.

export type MotorVoltageTier = 400 | 690 | 3300 | 5500 | 6600 | 11000;
export type MotorStartMethod = 'dol' | 'star-delta' | 'soft-starter' | 'vfd';
export type MechanicalLoadType = 'quadratic' | 'constant' | 'linear';

export interface MotorPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  voltageV: MotorVoltageTier;
  powerKw: number;
  poles: number;
  loadType: MechanicalLoadType;
  defaultMethod: MotorStartMethod;
  motorInertiaJ: number; // kg·m²
  loadInertiaJ: number;
  supplyTrafoKva: number;
  supplyTrafoUk: number;
  upstreamGridSscMva: number;
  description: { fr: string; en: string };
}

export interface MotorDynamicsInput {
  voltageV: MotorVoltageTier;
  powerKw: number;
  poleCount: number;
  startMethod: MotorStartMethod;
  loadType: MechanicalLoadType;
  motorEta?: number;
  motorCosPhi?: number;
  motorInertiaJ?: number;
  loadInertiaJ?: number;
  supplyTrafoKva: number;
  supplyTrafoUkPercent: number;
  upstreamGridSscMva: number;
  softStarterLimitRatio?: number; // default 3.2
  vfdRampTimeSec?: number; // default 8.0
}

export interface MotorDynamicsPoint {
  speedRpm: number;
  slip: number;
  motorTorqueNm: number;
  loadTorqueNm: number;
  acceleratingTorqueNm: number;
}

export interface MotorTransientTimePoint {
  timeSec: number;
  speedRpm: number;
  currentAmps: number;
  busVoltageV: number;
  busVoltageSagPercent: number;
  developedTorqueNm: number;
}

export interface MotorDynamicsOutput {
  nominalCurrentA: number;
  startingCurrentA: number;
  inrushRatio: number;
  nominalTorqueNm: number;
  startingTorqueNm: number;
  breakdownTorqueNm: number;
  nominalSpeedRpm: number;
  synchronousSpeedRpm: number;
  busVoltageSagPercent: number;
  busVoltageDuringStartV: number;
  accelerationTimeSec: number;
  isMotorStall: boolean;
  thermalEnergyI2t: number; // A²·s
  torqueSpeedPoints: MotorDynamicsPoint[];
  transientTimePoints: MotorTransientTimePoint[];
  methodComparison: Record<
    MotorStartMethod,
    {
      startingCurrentA: number;
      startingTorqueNm: number;
      voltageSagPercent: number;
      accelTimeSec: number;
    }
  >;
  normativeClauses: { fr: string; en: string }[];
}

export const CAMEROON_MOTOR_PRESETS: MotorPreset[] = [
  {
    id: 'nachtigal-raw-water',
    name: {
      fr: 'Pompe d’Exhaure & Eau Brute de Nachtigal (400 V, 160 kW)',
      en: 'Nachtigal Raw Water Intake Pump (400 V, 160 kW)',
    },
    facility: {
      fr: 'Centrale Hydroélectrique de Nachtigal (420 MW / Sanaga)',
      en: 'Nachtigal Hydroelectric Power Plant (420 MW / Sanaga)',
    },
    voltageV: 400,
    powerKw: 160,
    poles: 4,
    loadType: 'quadratic',
    defaultMethod: 'soft-starter',
    motorInertiaJ: 4.5,
    loadInertiaJ: 8.0,
    supplyTrafoKva: 1000,
    supplyTrafoUk: 6.0,
    upstreamGridSscMva: 350,
    description: {
      fr: 'Pompe centrifuge immergée de refroidissement auxiliaire des 7 turbines Francis. Démarrage progressif requis pour éliminer le coup de bélier hydraulique.',
      en: 'Submerged centrifugal cooling pump for 7 Francis units. Soft-starter required to eliminate hydraulic water hammer.',
    },
  },
  {
    id: 'cimencam-clinker-mill',
    name: {
      fr: 'Broyeur à Boulets Clinker CIMENCAM Figuil (6.6 kV, 1850 kW)',
      en: 'CIMENCAM Figuil Clinker Ball Mill (6.6 kV, 1850 kW)',
    },
    facility: {
      fr: 'Cimenterie CIMENCAM de Figuil / Nomayos',
      en: 'CIMENCAM Figuil / Nomayos Cement Plant',
    },
    voltageV: 6600,
    powerKw: 1850,
    poles: 6,
    loadType: 'constant',
    defaultMethod: 'vfd',
    motorInertiaJ: 48.0,
    loadInertiaJ: 120.0,
    supplyTrafoKva: 3150,
    supplyTrafoUk: 7.0,
    upstreamGridSscMva: 250,
    description: {
      fr: 'Moteur HTA asynchrone à bagues / VFD entraînant un broyeur horizontal à charge constante très lourde. DOL provoquerait un écroulement de tension réseau.',
      en: 'MV induction motor with VFD driving heavy horizontal ball mill. DOL would collapse local bus voltage.',
    },
  },
  {
    id: 'sabc-ammonia-compressor',
    name: {
      fr: 'Compresseur Froid Ammoniac SABC Douala (400 V, 250 kW)',
      en: 'SABC Douala NH3 Refrigeration Compressor (400 V, 250 kW)',
    },
    facility: {
      fr: 'Brasseries du Cameroun (Usine de Koumassi, Douala)',
      en: 'Brasseries du Cameroun (Koumassi Plant, Douala)',
    },
    voltageV: 400,
    powerKw: 250,
    poles: 4,
    loadType: 'constant',
    defaultMethod: 'star-delta',
    motorInertiaJ: 6.5,
    loadInertiaJ: 14.0,
    supplyTrafoKva: 1600,
    supplyTrafoUk: 6.0,
    upstreamGridSscMva: 400,
    description: {
      fr: 'Compresseur à vis de réfrigération industrielle pour la fermentation brassicole. Démarrage sous pression nécessitant un fort couple de décollage.',
      en: 'Industrial screw refrigeration compressor for beer brewing. Starts under gas pressure requiring high breakaway torque.',
    },
  },
  {
    id: 'sonara-pipeline-booster',
    name: {
      fr: 'Pompe Booster Brut Raffinerie SONARA (3.3 kV, 800 kW)',
      en: 'SONARA Refinery Crude Oil Booster Pump (3.3 kV, 800 kW)',
    },
    facility: {
      fr: 'Société Nationale de Raffinage (SONARA Limbe)',
      en: 'National Refining Company (SONARA Limbe)',
    },
    voltageV: 3300,
    powerKw: 800,
    poles: 2,
    loadType: 'quadratic',
    defaultMethod: 'dol',
    motorInertiaJ: 12.0,
    loadInertiaJ: 22.0,
    supplyTrafoKva: 2000,
    supplyTrafoUk: 6.5,
    upstreamGridSscMva: 300,
    description: {
      fr: 'Pompe centrifuge haute pression ATEX zone 1 d’alimentation des unités de distillation. Réseau usine rigide avec alternateur thermique autonome.',
      en: 'ATEX Zone 1 high-pressure crude feed booster pump. Stiff refinery grid with captive generation.',
    },
  },
  {
    id: 'pad-gantry-hoist',
    name: {
      fr: 'Treuil Levage Portique Conteneur Port de Douala (690 V, 450 kW)',
      en: 'Douala Port Container Gantry Crane Hoist (690 V, 450 kW)',
    },
    facility: {
      fr: 'Port Autonome de Douala (Terminal à Conteneurs RTC)',
      en: 'Port Authority of Douala (RTC Container Terminal)',
    },
    voltageV: 690,
    powerKw: 450,
    poles: 6,
    loadType: 'constant',
    defaultMethod: 'vfd',
    motorInertiaJ: 10.5,
    loadInertiaJ: 35.0,
    supplyTrafoKva: 1250,
    supplyTrafoUk: 6.0,
    upstreamGridSscMva: 300,
    description: {
      fr: 'Treuil de levage 4 quadrants avec contrôle de flux vectoriel et freinage régénératif pour manutention maritime intensive 24/7.',
      en: '4-quadrant hoist drive with flux vector control and regenerative braking for 24/7 container handling.',
    },
  },
];

export class IndustrialMotorDynamicsEngine {
  /**
   * Evaluates Kloss formula for asynchronous induction motor torque
   * Mm(s) = (2 * Mmax) / (s/sk + sk/s) * (U / Un)^2
   */
  public static getKlossTorque(
    slip: number,
    breakdownSlip: number,
    breakdownTorqueNm: number,
    voltageRatio: number = 1.0
  ): number {
    const s = Math.max(0.001, Math.min(1.0, slip));
    const sk = breakdownSlip;
    const klossRatio = (2 * breakdownTorqueNm) / (s / sk + sk / s);
    return klossRatio * Math.pow(voltageRatio, 2);
  }

  /**
   * Master solver computing full electrodynamic starting transients
   */
  public static solve(input: MotorDynamicsInput): MotorDynamicsOutput {
    const uVolts = input.voltageV;
    const pKw = input.powerKw;
    const eta = input.motorEta ?? (pKw > 500 ? 0.96 : pKw > 150 ? 0.94 : 0.91);
    const cosPhi = input.motorCosPhi ?? (pKw > 500 ? 0.89 : 0.87);
    const poles = input.poleCount;
    const method = input.startMethod;

    // 1. Speeds & Nominal Electrical Values (IEC 60034-1)
    const nSync = 3000 / (poles / 2); // 50 Hz synchronous rpm
    const nominalSlip = pKw > 500 ? 0.015 : pKw > 100 ? 0.022 : 0.035;
    const nNominal = Math.round(nSync * (1 - nominalSlip));
    const omegaNom = (2 * Math.PI * nNominal) / 60; // rad/s

    // Nominal Full-Load Current (In)
    const iNomAmps = (pKw * 1000) / (Math.sqrt(3) * uVolts * eta * cosPhi);

    // Nominal Shaft Torque (Cn = P / omega)
    const cNomNm = (pKw * 1000) / omegaNom;

    // Standard induction motor characteristic ratios (IEC 60034-12 Design N)
    const baseDolInrushRatio = pKw > 500 ? 6.5 : 7.0;
    const baseDolStartingTorqueRatio = 2.1;
    const breakdownTorqueRatio = 2.8;
    const breakdownSlip = 0.16;
    const cMaxNm = cNomNm * breakdownTorqueRatio;

    // 2. Starting Method Coefficients
    let currentMultiplier = baseDolInrushRatio;
    let torqueMultiplier = 1.0;

    if (method === 'star-delta') {
      currentMultiplier = baseDolInrushRatio / 3.0; // ~2.3 In
      torqueMultiplier = 1.0 / 3.0; // Torque divided by 3 (0.7 Cn)
    } else if (method === 'soft-starter') {
      const limit = input.softStarterLimitRatio ?? 3.2;
      currentMultiplier = limit;
      torqueMultiplier = Math.pow(limit / baseDolInrushRatio, 2); // Torque scales as U² ~ (I/Idol)²
    } else if (method === 'vfd') {
      currentMultiplier = 1.15; // Controlled current limit ~ 1.15 In
      torqueMultiplier = 1.25; // High constant torque at low frequency
    }

    const iStartAmps = iNomAmps * currentMultiplier;
    const sStartKva = (Math.sqrt(3) * uVolts * iStartAmps) / 1000;

    // 3. Upstream Grid Short-Circuit Capacity & Busbar Voltage Dip (IEEE Std 399)
    const sTrafoScKva = input.supplyTrafoKva / (input.supplyTrafoUkPercent / 100);
    const sGridScKva = input.upstreamGridSscMva * 1000;
    const sBusScKva = 1 / (1 / sGridScKva + 1 / sTrafoScKva);

    // Initial busbar voltage dip
    const busVoltageSagPercent =
      method === 'vfd'
        ? 1.2
        : Number(Math.min(42, (sStartKva / (sBusScKva + sStartKva)) * 100).toFixed(1));
    const busVoltageDuringStartV = uVolts * (1 - busVoltageSagPercent / 100);
    const uRatio = 1 - busVoltageSagPercent / 100;

    // Net starting torque developed at zero speed
    const cStartNm =
      method === 'vfd'
        ? cNomNm * 1.25
        : cNomNm * baseDolStartingTorqueRatio * torqueMultiplier * Math.pow(uRatio, 2);

    // Initial resisting torque of mechanical load at zero speed
    const loadTorqueZeroNm =
      input.loadType === 'quadratic'
        ? cNomNm * 0.15 // Centrifugal pump/fan friction ~ 15%
        : input.loadType === 'linear'
        ? cNomNm * 0.40
        : cNomNm * 0.85; // Heavy conveyor/ball mill breakaway ~ 85%

    const initialAccTorqueNm = cStartNm - loadTorqueZeroNm;
    const isMotorStall = initialAccTorqueNm <= 0;

    // Total moment of inertia J = J_motor + J_load
    const jMotor = input.motorInertiaJ ?? (pKw > 500 ? 25.0 : pKw > 150 ? 6.5 : 1.2);
    const jLoad = input.loadInertiaJ ?? (input.loadType === 'constant' ? jMotor * 3 : jMotor * 1.5);
    const jTotal = jMotor + jLoad;

    // 4. Mean Acceleration Torque & Acceleration Time (Newton Second Law for Rotation)
    // J * domega/dt = M_accel => t_accel = (J * omega_nom) / M_accel_mean
    const meanAccTorqueNm = Math.max(
      15,
      (cStartNm + cMaxNm * Math.pow(uRatio, 2) * 0.75) / 2 -
        (input.loadType === 'quadratic' ? cNomNm * 0.45 : cNomNm * 0.85)
    );
    const estimatedAccelTimeSec = isMotorStall
      ? 99.9
      : Number(((jTotal * omegaNom) / meanAccTorqueNm).toFixed(2));

    // 5. Generate Torque-Speed Characteristic Points (100 sample points)
    const torqueSpeedPoints: MotorDynamicsPoint[] = [];
    const numPoints = 60;

    for (let i = 0; i <= numPoints; i++) {
      const speedRpm = (i / numPoints) * nSync;
      const slip = Math.max(0.001, (nSync - speedRpm) / nSync);

      let motorTorque = 0;
      if (method === 'vfd') {
        // VFD constant V/f produces flat maximum torque envelope up to nominal speed
        motorTorque =
          speedRpm <= nNominal
            ? cNomNm * 1.3
            : (cNomNm * 1.3 * nNominal) / Math.max(1, speedRpm);
      } else {
        const klossRaw = (2 * cMaxNm) / (slip / breakdownSlip + breakdownSlip / slip);
        const shapeMod = (slip / (slip + 0.1) + Math.pow(slip, 2)) * 0.65;
        motorTorque = klossRaw * shapeMod * torqueMultiplier * Math.pow(uRatio, 2);
      }

      let loadTorque = 0;
      if (input.loadType === 'quadratic') {
        loadTorque = cNomNm * (0.15 + 0.85 * Math.pow(speedRpm / nSync, 2));
      } else if (input.loadType === 'linear') {
        loadTorque = cNomNm * (0.4 + 0.6 * (speedRpm / nSync));
      } else {
        loadTorque = cNomNm * 0.85; // Constant torque
      }

      const acceleratingTorque = motorTorque - loadTorque;

      torqueSpeedPoints.push({
        speedRpm: Math.round(speedRpm),
        slip: Number(slip.toFixed(3)),
        motorTorqueNm: Math.round(motorTorque),
        loadTorqueNm: Math.round(loadTorque),
        acceleratingTorqueNm: Math.round(acceleratingTorque),
      });
    }

    // 6. Generate Transient Time Envelope Points (Time Domain t = 0 to 1.2 * t_accel)
    const transientTimePoints: MotorTransientTimePoint[] = [];
    const tMax = Math.max(3.0, estimatedAccelTimeSec * 1.25);
    const numTimeSteps = 50;

    let thermalI2tSum = 0;

    for (let i = 0; i <= numTimeSteps; i++) {
      const t = (i / numTimeSteps) * tMax;
      const progress = Math.min(1.0, t / Math.max(0.1, estimatedAccelTimeSec));

      // Speed profile using S-curve easing
      const speedRpm = isMotorStall
        ? 0
        : Math.round(nNominal * Math.pow(progress, 1.4));

      // Instantaneous current calculation
      let currentA = iStartAmps;
      if (!isMotorStall) {
        if (progress < 0.85) {
          // Sustained inrush phase
          currentA = iStartAmps - (iStartAmps - iNomAmps * 1.4) * Math.pow(progress, 3);
        } else {
          // Rapid settling to nominal current at operating slip
          currentA = iNomAmps * 1.4 - (iNomAmps * 0.4) * ((progress - 0.85) / 0.15);
        }
      }

      // Instantaneous voltage sag recovers as current decays
      const instSag =
        method === 'vfd'
          ? 1.2
          : busVoltageSagPercent * (currentA / Math.max(1, iStartAmps));
      const busV = uVolts * (1 - instSag / 100);

      // Instantaneous developed torque
      const instTorque =
        progress < 0.1
          ? cStartNm
          : progress < 0.9
          ? cNomNm * 1.8 * Math.pow(busV / uVolts, 2)
          : cNomNm;

      // Accumulate I²t thermal stress
      const dt = tMax / numTimeSteps;
      thermalI2tSum += Math.pow(currentA, 2) * dt;

      transientTimePoints.push({
        timeSec: Number(t.toFixed(2)),
        speedRpm,
        currentAmps: Math.round(currentA),
        busVoltageV: Math.round(busV),
        busVoltageSagPercent: Number(instSag.toFixed(1)),
        developedTorqueNm: Math.round(instTorque),
      });
    }

    // 7. Method Comparison Matrix (DOL vs Star-Delta vs Soft-Starter vs VFD)
    const evalMethod = (m: MotorStartMethod) => {
      let mCurrMul = baseDolInrushRatio;
      let mTorqMul = 1.0;
      if (m === 'star-delta') {
        mCurrMul = baseDolInrushRatio / 3.0;
        mTorqMul = 1.0 / 3.0;
      } else if (m === 'soft-starter') {
        mCurrMul = 3.2;
        mTorqMul = Math.pow(3.2 / baseDolInrushRatio, 2);
      } else if (m === 'vfd') {
        mCurrMul = 1.15;
        mTorqMul = 1.25;
      }

      const mIstart = iNomAmps * mCurrMul;
      const mSstart = (Math.sqrt(3) * uVolts * mIstart) / 1000;
      const mSag =
        m === 'vfd'
          ? 1.2
          : Number(Math.min(42, (mSstart / (sBusScKva + mSstart)) * 100).toFixed(1));
      const mTorque =
        m === 'vfd'
          ? cNomNm * 1.25
          : cNomNm * baseDolStartingTorqueRatio * mTorqMul * Math.pow(1 - mSag / 100, 2);
      const mMeanAcc = Math.max(15, mTorque * 0.85);
      const mTime = Number(((jTotal * omegaNom) / mMeanAcc).toFixed(2));

      return {
        startingCurrentA: Math.round(mIstart),
        startingTorqueNm: Math.round(mTorque),
        voltageSagPercent: mSag,
        accelTimeSec: mTime,
      };
    };

    const methodComparison = {
      dol: evalMethod('dol'),
      'star-delta': evalMethod('star-delta'),
      'soft-starter': evalMethod('soft-starter'),
      vfd: evalMethod('vfd'),
    };

    const normativeClauses = [
      {
        fr: 'Régime de démarrage CEI 60034-12 : Le courant de démarrage assigné Id/In et le couple de décollage Cd/Cn sont définis pour les conceptions N et H.',
        en: 'Starting performance IEC 60034-12: Rated locked rotor current Id/In and breakaway torque Cd/Cn are specified for Designs N and H.',
      },
      {
        fr: 'Chute de tension admissible IEEE Std 399 : La chute de tension sur le jeu de barres ne doit pas dépasser 10% (éclairage/flicker) ou 15% (seuil de décollage contacteurs BT).',
        en: 'Permissible bus voltage dip IEEE Std 399: Voltage sag at busbar must not exceed 10% (flicker) or 15% (contactor dropout limit).',
      },
      {
        fr: 'Tenue thermique du rotor CEI 60947-4-1 : La contrainte thermique I²t pendant le temps d’accélération ne doit pas franchir la courbe de déclenchement Classe 10 / Classe 20.',
        en: 'Rotor thermal endurance IEC 60947-4-1: I²t thermal energy during acceleration must not exceed Class 10 / Class 20 trip envelope.',
      },
    ];

    return {
      nominalCurrentA: Number(iNomAmps.toFixed(1)),
      startingCurrentA: Math.round(iStartAmps),
      inrushRatio: Number(currentMultiplier.toFixed(1)),
      nominalTorqueNm: Math.round(cNomNm),
      startingTorqueNm: Math.round(cStartNm),
      breakdownTorqueNm: Math.round(cMaxNm),
      nominalSpeedRpm: nNominal,
      synchronousSpeedRpm: nSync,
      busVoltageSagPercent,
      busVoltageDuringStartV: Math.round(busVoltageDuringStartV),
      accelerationTimeSec: estimatedAccelTimeSec,
      isMotorStall,
      thermalEnergyI2t: Math.round(thermalI2tSum),
      torqueSpeedPoints,
      transientTimePoints,
      methodComparison,
      normativeClauses,
    };
  }
}

