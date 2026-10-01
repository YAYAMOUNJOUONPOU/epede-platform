// src/services/iec61850SampledValuesService.ts
// IEC 61850-9-2LE & IEC 61869-9 Sampled Values (SV) / Process Bus Engineering Service
// Real-time discrete digital waveform synthesizer, PTP IEEE 1588 time synchronizer,
// discrete Fourier transform (DFT) phasor estimator and closed-loop IED trip evaluator.

export interface MergingUnitConfig {
  muId: string;
  muName: string;
  bayName: string;
  svId: string;
  appId: string; // Hex string e.g. "0x4000"
  macDst: string; // "01-0C-CD-04-00-01"
  macSrc: string; // "00-50-C2-88-92-01"
  vlanId: number; // 4
  vlanPriority: number; // 4
  standard: 'IEC_61850_9_2LE' | 'IEC_61869_9';
  sampleRate: 4000 | 12800; // 80 smp/cycle (protection) or 256 smp/cycle (quality)
  nominalFrequency: 50;
  transducerType: 'CONVENTIONAL_ADC_16BIT' | 'NCIT_ROGOWSKI_LPIT';
  currentScaleFactor: number; // 1000 for 1 mA/LSB
  voltageScaleFactor: number; // 100 for 10 mV/LSB
  confRev: number;
}

export interface PtpSyncStatus {
  profile: 'IEC_IEEE_61850_9_3_POWER_UTILITY' | 'IEEE_1588_V2_DEFAULT';
  grandmasterIdentity: string;
  grandmasterClockClass: number; // 6 = GPS locked
  timeAccuracyNs: number; // e.g. 25 ns
  offsetFromMasterNs: number; // e.g. 14 ns
  meanPathDelayNs: number; // e.g. 1180 ns
  jitterNs: number; // e.g. ± 8 ns
  synchLocked: boolean;
  smpSynchFlag: 2 | 1 | 0; // 2=Global (GPS), 1=Local, 0=None
}

export type SvInjectionScenario =
  | 'BALANCED_LOAD'
  | 'PHASE_A_GROUND_FAULT'
  | 'THREE_PHASE_BUS_FAULT'
  | 'TRANSFORMER_INRUSH'
  | 'CT_SATURATION'
  | 'VOLTAGE_SAG_UNBALANCE';

export interface SvInjectionParameters {
  scenario: SvInjectionScenario;
  frequency: number; // 49.0 - 51.0 Hz
  currentIaRms: number; // A
  currentIaPhaseDeg: number;
  currentIbRms: number; // A
  currentIbPhaseDeg: number;
  currentIcRms: number; // A
  currentIcPhaseDeg: number;
  voltageVaRms: number; // V (L-N)
  voltageVaPhaseDeg: number;
  voltageVbRms: number; // V (L-N)
  voltageVbPhaseDeg: number;
  voltageVcRms: number; // V (L-N)
  voltageVcPhaseDeg: number;
  dcDecayTauMs: number; // Time constant for transient DC offset
  harmonic2Percent: number; // Inrush current 2nd harmonic
  harmonic5Percent: number; // Overfluxing 5th harmonic
  ctSaturationKneeA: number; // Threshold beyond which CT saturates
  testBitActive: boolean; // IEC 61850 Quality test flag
  operatorBlocked: boolean; // IEC 61850 OperatorBlocked flag
  qualityInvalidPhsA: boolean; // Simulated ADC converter failure
}

export interface SampledPoint {
  smpCnt: number; // 0 to 79 (or 0 to 255)
  timeUs: number; // Microseconds from cycle start
  iaRaw: number; // Signed 32-bit integer (1 mA/LSB)
  iaEngA: number; // Engineering unit (A)
  ibRaw: number;
  ibEngA: number;
  icRaw: number;
  icEngA: number;
  inRaw: number;
  inEngA: number;
  vaRaw: number; // Signed 32-bit integer (10 mV/LSB)
  vaEngV: number; // Engineering unit (V)
  vbRaw: number;
  vbEngV: number;
  vcRaw: number;
  vcEngV: number;
  vnRaw: number;
  vnEngV: number;
  qIa: number; // 32-bit Quality bitmask
  qVa: number;
}

export interface ReconstructedPhasors {
  ia: { magRms: number; phaseDeg: number };
  ib: { magRms: number; phaseDeg: number };
  ic: { magRms: number; phaseDeg: number };
  in: { magRms: number; phaseDeg: number };
  va: { magRms: number; phaseDeg: number };
  vb: { magRms: number; phaseDeg: number };
  vc: { magRms: number; phaseDeg: number };
  vn: { magRms: number; phaseDeg: number };
  // Symmetrical Components
  posSeqCurrentI1: number;
  negSeqCurrentI2: number;
  zeroSeqCurrentI0: number;
  unbalanceRatioPercent: number; // I2 / I1 * 100
  activePowerMw: number;
  reactivePowerMvar: number;
  apparentPowerMva: number;
  calculatedFrequencyHz: number;
}

export interface ProtectionTripEvaluation {
  overcurrent50InstantTrip: boolean;
  overcurrent50Pickup: boolean;
  groundFault51NTrip: boolean;
  distance21Zone1Trip: boolean;
  calculatedZ1Ohm: number;
  differential87LTrip: boolean;
  calculatedIdiffA: number;
  calculatedIbiasA: number;
  iedProcessingLatencyMs: number; // Discrete Fourier transform + comparator time
  gooseTripPacketPublished: boolean;
  goosePacketHex: string;
  tripReasonFr: string;
  tripReasonEn: string;
}

export const DEFAULT_MERGING_UNIT: MergingUnitConfig = {
  muId: 'MU_BAY_L01',
  muName: 'SAMU-225kV-L01 (Ligne Mangoumbé)',
  bayName: 'Travée Départ Ligne Mangoumbé 225 kV',
  svId: 'MANG_L01_MU01',
  appId: '0x4000',
  macDst: '01-0C-CD-04-00-01',
  macSrc: '00-50-C2-88-92-01',
  vlanId: 4,
  vlanPriority: 4,
  standard: 'IEC_61850_9_2LE',
  sampleRate: 4000, // 80 samples per cycle at 50Hz (250 microseconds per sample)
  nominalFrequency: 50,
  transducerType: 'CONVENTIONAL_ADC_16BIT',
  currentScaleFactor: 1000, // 1 mA per count (e.g. 1000 counts = 1 A)
  voltageScaleFactor: 100, // 10 mV per count (e.g. 100 counts = 1 V)
  confRev: 1,
};

export const DEFAULT_PTP_STATUS: PtpSyncStatus = {
  profile: 'IEC_IEEE_61850_9_3_POWER_UTILITY',
  grandmasterIdentity: '00:1A:2B:FF:FE:44:91:A0',
  grandmasterClockClass: 6, // GPS synchronized (Stratum 1 atomic reference)
  timeAccuracyNs: 25,
  offsetFromMasterNs: 12,
  meanPathDelayNs: 1140,
  jitterNs: 7,
  synchLocked: true,
  smpSynchFlag: 2, // 2 = Synchronized by global clock reference (IEEE 1588 PTP)
};

export const DEFAULT_SCENARIOS_PARAMS: Record<SvInjectionScenario, SvInjectionParameters> = {
  BALANCED_LOAD: {
    scenario: 'BALANCED_LOAD',
    frequency: 50.0,
    currentIaRms: 630, // 630 A nominal load
    currentIaPhaseDeg: 0,
    currentIbRms: 630,
    currentIbPhaseDeg: -120,
    currentIcRms: 630,
    currentIcPhaseDeg: 120,
    voltageVaRms: 129904, // 225 kV / sqrt(3) = 129.9 kV
    voltageVaPhaseDeg: 0,
    voltageVbRms: 129904,
    voltageVbPhaseDeg: -120,
    voltageVcRms: 129904,
    voltageVcPhaseDeg: 120,
    dcDecayTauMs: 0,
    harmonic2Percent: 0,
    harmonic5Percent: 0,
    ctSaturationKneeA: 40000,
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
  PHASE_A_GROUND_FAULT: {
    scenario: 'PHASE_A_GROUND_FAULT',
    frequency: 50.0,
    currentIaRms: 18450, // 18.45 kA severe ground fault
    currentIaPhaseDeg: -78,
    currentIbRms: 620,
    currentIbPhaseDeg: -120,
    currentIcRms: 615,
    currentIcPhaseDeg: 120,
    voltageVaRms: 15200, // Severe voltage collapse on faulted Phase A (15.2 kV)
    voltageVaPhaseDeg: -22,
    voltageVbRms: 135000, // Healthy phases rise slightly due to neutral shift
    voltageVbPhaseDeg: -125,
    voltageVcRms: 134800,
    voltageVcPhaseDeg: 118,
    dcDecayTauMs: 45, // Exponential decaying DC offset
    harmonic2Percent: 2,
    harmonic5Percent: 0,
    ctSaturationKneeA: 40000,
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
  THREE_PHASE_BUS_FAULT: {
    scenario: 'THREE_PHASE_BUS_FAULT',
    frequency: 49.8,
    currentIaRms: 31500, // 31.5 kA busbar short-circuit
    currentIaPhaseDeg: -82,
    currentIbRms: 31500,
    currentIbPhaseDeg: 158,
    currentIcRms: 31500,
    currentIcPhaseDeg: 38,
    voltageVaRms: 4500, // Near total collapse
    voltageVaPhaseDeg: -80,
    voltageVbRms: 4500,
    voltageVbPhaseDeg: 160,
    voltageVcRms: 4500,
    voltageVcPhaseDeg: 40,
    dcDecayTauMs: 65,
    harmonic2Percent: 1,
    harmonic5Percent: 0,
    ctSaturationKneeA: 38000,
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
  TRANSFORMER_INRUSH: {
    scenario: 'TRANSFORMER_INRUSH',
    frequency: 50.0,
    currentIaRms: 3850, // Peak asymmetric inrush
    currentIaPhaseDeg: -15,
    currentIbRms: 1950,
    currentIbPhaseDeg: -140,
    currentIcRms: 1100,
    currentIcPhaseDeg: 105,
    voltageVaRms: 124000,
    voltageVaPhaseDeg: 0,
    voltageVbRms: 126000,
    voltageVbPhaseDeg: -120,
    voltageVcRms: 127000,
    voltageVcPhaseDeg: 120,
    dcDecayTauMs: 90, // Heavy decaying DC
    harmonic2Percent: 24, // 24% 2nd harmonic (triggers harmonic restraint in 87T)
    harmonic5Percent: 3,
    ctSaturationKneeA: 40000,
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
  CT_SATURATION: {
    scenario: 'CT_SATURATION',
    frequency: 50.0,
    currentIaRms: 22000,
    currentIaPhaseDeg: -75,
    currentIbRms: 630,
    currentIbPhaseDeg: -120,
    currentIcRms: 630,
    currentIcPhaseDeg: 120,
    voltageVaRms: 32000,
    voltageVaPhaseDeg: -20,
    voltageVbRms: 130000,
    voltageVbPhaseDeg: -120,
    voltageVcRms: 130000,
    voltageVcPhaseDeg: 120,
    dcDecayTauMs: 50,
    harmonic2Percent: 6,
    harmonic5Percent: 8,
    ctSaturationKneeA: 18000, // CT saturates above 18 kA, clipping waveform
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
  VOLTAGE_SAG_UNBALANCE: {
    scenario: 'VOLTAGE_SAG_UNBALANCE',
    frequency: 50.1,
    currentIaRms: 1200,
    currentIaPhaseDeg: -10,
    currentIbRms: 450,
    currentIbPhaseDeg: -130,
    currentIcRms: 600,
    currentIcPhaseDeg: 115,
    voltageVaRms: 78000, // 40% sag on Phase A
    voltageVaPhaseDeg: -5,
    voltageVbRms: 128000,
    voltageVbPhaseDeg: -120,
    voltageVcRms: 129000,
    voltageVcPhaseDeg: 120,
    dcDecayTauMs: 0,
    harmonic2Percent: 0,
    harmonic5Percent: 4,
    ctSaturationKneeA: 40000,
    testBitActive: false,
    operatorBlocked: false,
    qualityInvalidPhsA: false,
  },
};

export class Iec61850SampledValuesService {
  /**
   * Synthesize discrete sample points for one complete 20 ms electrical cycle.
   * IEC 61850-9-2LE standard: 80 samples per cycle at 50 Hz = 250 us interval.
   */
  public static synthesizeCycleSamples(
    params: SvInjectionParameters,
    muConfig: MergingUnitConfig = DEFAULT_MERGING_UNIT
  ): SampledPoint[] {
    const numSamples = muConfig.sampleRate === 12800 ? 256 : 80;
    const periodSec = 1 / params.frequency;
    const dtSec = periodSec / numSamples;
    const omega = 2 * Math.PI * params.frequency;

    const samples: SampledPoint[] = [];

    // Quality flags bitmask computation per IEC 61850-7-2
    // Bit 0-1: validity (00=good, 01=invalid, 11=questionable)
    // Bit 11: test
    // Bit 12: operatorBlocked
    let qualityCurrent = 0x00000000;
    let qualityVoltage = 0x00000000;
    if (params.testBitActive) {
      qualityCurrent |= (1 << 11);
      qualityVoltage |= (1 << 11);
    }
    if (params.operatorBlocked) {
      qualityCurrent |= (1 << 12);
      qualityVoltage |= (1 << 12);
    }

    let qualityPhsA = qualityCurrent;
    if (params.qualityInvalidPhsA) {
      qualityPhsA = (qualityPhsA & ~0x03) | 0x01; // Bit 0=1 -> Invalid
    }

    for (let i = 0; i < numSamples; i++) {
      const t = i * dtSec;
      const timeUs = Math.round(t * 1e6);

      // Instantaneous fundamental computation
      const degToRad = (deg: number) => (deg * Math.PI) / 180;

      // Exponential DC offset calculation
      const dcDecayA = params.dcDecayTauMs > 0 
        ? Math.exp(-(t * 1000) / params.dcDecayTauMs) 
        : 0;

      // Calculate instantaneous currents (Peak = RMS * sqrt(2))
      const sqrt2 = Math.SQRT2;
      let ia = params.currentIaRms * sqrt2 * Math.sin(omega * t + degToRad(params.currentIaPhaseDeg));
      let ib = params.currentIbRms * sqrt2 * Math.sin(omega * t + degToRad(params.currentIbPhaseDeg));
      let ic = params.currentIcRms * sqrt2 * Math.sin(omega * t + degToRad(params.currentIcPhaseDeg));

      // Inject transient DC offset on Phase A
      if (params.dcDecayTauMs > 0) {
        ia += params.currentIaRms * sqrt2 * 0.85 * dcDecayA;
      }

      // Inject 2nd harmonic (inrush)
      if (params.harmonic2Percent > 0) {
        const h2Factor = params.harmonic2Percent / 100;
        ia += params.currentIaRms * sqrt2 * h2Factor * Math.sin(2 * omega * t);
        ib += params.currentIbRms * sqrt2 * (h2Factor * 0.5) * Math.sin(2 * omega * t);
      }

      // Inject 5th harmonic
      if (params.harmonic5Percent > 0) {
        const h5Factor = params.harmonic5Percent / 100;
        ia += params.currentIaRms * sqrt2 * h5Factor * Math.sin(5 * omega * t);
      }

      // CT Saturation non-linear clipping
      if (params.ctSaturationKneeA < 35000) {
        const kneePeak = params.ctSaturationKneeA * sqrt2;
        if (Math.abs(ia) > kneePeak) {
          const sign = Math.sign(ia);
          // Hard clipping after saturation knee
          ia = sign * (kneePeak + (Math.abs(ia) - kneePeak) * 0.15);
        }
      }

      // Residual neutral current In = Ia + Ib + Ic
      const inVal = ia + ib + ic;

      // Instantaneous voltages
      let va = params.voltageVaRms * sqrt2 * Math.sin(omega * t + degToRad(params.voltageVaPhaseDeg));
      let vb = params.voltageVbRms * sqrt2 * Math.sin(omega * t + degToRad(params.voltageVbPhaseDeg));
      let vc = params.voltageVcRms * sqrt2 * Math.sin(omega * t + degToRad(params.voltageVcPhaseDeg));
      const vn = va + vb + vc;

      // Convert engineering units to raw integer values per IEC 61850-9-2LE
      // 1 count = 1 mA for currents (A * 1000)
      // 1 count = 10 mV for voltages (V * 100)
      const iaRaw = Math.round(ia * muConfig.currentScaleFactor);
      const ibRaw = Math.round(ib * muConfig.currentScaleFactor);
      const icRaw = Math.round(ic * muConfig.currentScaleFactor);
      const inRaw = Math.round(inVal * muConfig.currentScaleFactor);

      const vaRaw = Math.round(va * muConfig.voltageScaleFactor);
      const vbRaw = Math.round(vb * muConfig.voltageScaleFactor);
      const vcRaw = Math.round(vc * muConfig.voltageScaleFactor);
      const vnRaw = Math.round(vn * muConfig.voltageScaleFactor);

      samples.push({
        smpCnt: i,
        timeUs,
        iaRaw,
        iaEngA: ia,
        ibRaw,
        ibEngA: ib,
        icRaw,
        icEngA: ic,
        inRaw,
        inEngA: inVal,
        vaRaw,
        vaEngV: va,
        vbRaw,
        vbEngV: vb,
        vcRaw,
        vcEngV: vc,
        vnRaw,
        vnEngV: vn,
        qIa: qualityPhsA,
        qVa: qualityVoltage,
      });
    }

    return samples;
  }

  /**
   * Reconstruct fundamental frequency phasors using full-cycle Discrete Fourier Transform (DFT).
   * Matches actual numerical protective relay algorithms (e.g. MiCOM P546, SIPROTEC 5 7UT85).
   */
  public static calculateFourierPhasors(samples: SampledPoint[]): ReconstructedPhasors {
    const N = samples.length;
    if (N === 0) {
      return {
        ia: { magRms: 0, phaseDeg: 0 },
        ib: { magRms: 0, phaseDeg: 0 },
        ic: { magRms: 0, phaseDeg: 0 },
        in: { magRms: 0, phaseDeg: 0 },
        va: { magRms: 0, phaseDeg: 0 },
        vb: { magRms: 0, phaseDeg: 0 },
        vc: { magRms: 0, phaseDeg: 0 },
        vn: { magRms: 0, phaseDeg: 0 },
        posSeqCurrentI1: 0,
        negSeqCurrentI2: 0,
        zeroSeqCurrentI0: 0,
        unbalanceRatioPercent: 0,
        activePowerMw: 0,
        reactivePowerMvar: 0,
        apparentPowerMva: 0,
        calculatedFrequencyHz: 50.0,
      };
    }

    // Helper for 1-cycle DFT extraction of real (Cosine) and imag (Sine) components
    const dft = (values: number[]) => {
      let real = 0;
      let imag = 0;
      for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * k) / N;
        real += values[k] * Math.cos(theta);
        imag += -values[k] * Math.sin(theta);
      }
      real = (2 / N) * real;
      imag = (2 / N) * imag;
      const magPeak = Math.sqrt(real * real + imag * imag);
      const magRms = magPeak / Math.SQRT2;
      let phaseDeg = (Math.atan2(imag, real) * 180) / Math.PI;
      return { magRms, phaseDeg, realRms: real / Math.SQRT2, imagRms: imag / Math.SQRT2 };
    };

    const iaDft = dft(samples.map((s) => s.iaEngA));
    const ibDft = dft(samples.map((s) => s.ibEngA));
    const icDft = dft(samples.map((s) => s.icEngA));
    const inDft = dft(samples.map((s) => s.inEngA));

    const vaDft = dft(samples.map((s) => s.vaEngV));
    const vbDft = dft(samples.map((s) => s.vbEngV));
    const vcDft = dft(samples.map((s) => s.vcEngV));
    const vnDft = dft(samples.map((s) => s.vnEngV));

    // Fortescue Symmetrical Components (I0, I1, I2)
    // a = exp(j * 120 deg) = -0.5 + j * sqrt(3)/2
    // a^2 = exp(j * 240 deg) = -0.5 - j * sqrt(3)/2
    const complexAdd = (c1: [number, number], c2: [number, number]): [number, number] => [c1[0] + c2[0], c1[1] + c2[1]];
    const complexMul = (c1: [number, number], c2: [number, number]): [number, number] => [
      c1[0] * c2[0] - c1[1] * c2[1],
      c1[0] * c2[1] + c1[1] * c2[0],
    ];

    const cIa: [number, number] = [iaDft.realRms, iaDft.imagRms];
    const cIb: [number, number] = [ibDft.realRms, ibDft.imagRms];
    const cIc: [number, number] = [icDft.realRms, icDft.imagRms];

    const a: [number, number] = [-0.5, Math.sqrt(3) / 2];
    const a2: [number, number] = [-0.5, -Math.sqrt(3) / 2];

    // I0 = 1/3 * (Ia + Ib + Ic)
    const sumI0 = complexAdd(complexAdd(cIa, cIb), cIc);
    const i0Rms = Math.sqrt(sumI0[0] ** 2 + sumI0[1] ** 2) / 3;

    // I1 = 1/3 * (Ia + a*Ib + a^2*Ic)
    const aIb = complexMul(a, cIb);
    const a2Ic = complexMul(a2, cIc);
    const sumI1 = complexAdd(complexAdd(cIa, aIb), a2Ic);
    const i1Rms = Math.sqrt(sumI1[0] ** 2 + sumI1[1] ** 2) / 3;

    // I2 = 1/3 * (Ia + a^2*Ib + a*Ic)
    const a2Ib = complexMul(a2, cIb);
    const aIc = complexMul(a, cIc);
    const sumI2 = complexAdd(complexAdd(cIa, a2Ib), aIc);
    const i2Rms = Math.sqrt(sumI2[0] ** 2 + sumI2[1] ** 2) / 3;

    const unbalanceRatioPercent = i1Rms > 5 ? Math.min(100, (i2Rms / i1Rms) * 100) : 0;

    // Active & Reactive Power 3-Phase: P = Va*Ia*cos(phi) + Vb*Ib*cos(phi) + Vc*Ic*cos(phi)
    const pA = iaDft.realRms * vaDft.realRms + iaDft.imagRms * vaDft.imagRms;
    const pB = ibDft.realRms * vbDft.realRms + ibDft.imagRms * vbDft.imagRms;
    const pC = icDft.realRms * vcDft.realRms + icDft.imagRms * vcDft.imagRms;
    const totalActivePowerMw = (pA + pB + pC) / 1e6;

    const qA = vaDft.realRms * iaDft.imagRms - vaDft.imagRms * iaDft.realRms;
    const qB = vbDft.realRms * ibDft.imagRms - vbDft.imagRms * ibDft.realRms;
    const qC = vcDft.realRms * icDft.imagRms - vcDft.imagRms * icDft.realRms;
    const totalReactivePowerMvar = (qA + qB + qC) / 1e6;

    const apparentMva = Math.sqrt(totalActivePowerMw ** 2 + totalReactivePowerMvar ** 2);

    return {
      ia: { magRms: Math.round(iaDft.magRms), phaseDeg: Number(iaDft.phaseDeg.toFixed(1)) },
      ib: { magRms: Math.round(ibDft.magRms), phaseDeg: Number(ibDft.phaseDeg.toFixed(1)) },
      ic: { magRms: Math.round(icDft.magRms), phaseDeg: Number(icDft.phaseDeg.toFixed(1)) },
      in: { magRms: Math.round(inDft.magRms), phaseDeg: Number(inDft.phaseDeg.toFixed(1)) },
      va: { magRms: Math.round(vaDft.magRms), phaseDeg: Number(vaDft.phaseDeg.toFixed(1)) },
      vb: { magRms: Math.round(vbDft.magRms), phaseDeg: Number(vbDft.phaseDeg.toFixed(1)) },
      vc: { magRms: Math.round(vcDft.magRms), phaseDeg: Number(vcDft.phaseDeg.toFixed(1)) },
      vn: { magRms: Math.round(vnDft.magRms), phaseDeg: Number(vnDft.phaseDeg.toFixed(1)) },
      posSeqCurrentI1: Math.round(i1Rms),
      negSeqCurrentI2: Math.round(i2Rms),
      zeroSeqCurrentI0: Math.round(i0Rms),
      unbalanceRatioPercent: Number(unbalanceRatioPercent.toFixed(1)),
      activePowerMw: Number(totalActivePowerMw.toFixed(2)),
      reactivePowerMvar: Number(totalReactivePowerMvar.toFixed(2)),
      apparentPowerMva: Number(apparentMva.toFixed(2)),
      calculatedFrequencyHz: 50.0,
    };
  }

  /**
   * Evaluate multi-function protective IED trip conditions on the sampled values stream.
   * Emulates real relay hardware response (ANSI 50/51, ANSI 21 Distance, ANSI 87L Differential).
   */
  public static evaluateProtectionResponse(
    phasors: ReconstructedPhasors,
    params: SvInjectionParameters
  ): ProtectionTripEvaluation {
    // 1. Instantaneous Overcurrent 50 Threshold (set to 2500 A)
    const iMax = Math.max(phasors.ia.magRms, phasors.ib.magRms, phasors.ic.magRms);
    const overcurrent50InstantTrip = iMax >= 2500;
    const overcurrent50Pickup = iMax >= 1000;

    // 2. Earth Fault 51N (Neutral zero sequence current > 200 A)
    const groundFault51NTrip = phasors.zeroSeqCurrentI0 >= 200 || phasors.in.magRms >= 300;

    // 3. Distance Protection 21 Zone 1 Loop Impedance (Z_reach = 12 Ohm)
    // Z = V_fault / (I_fault + k0 * 3*I0)
    let calculatedZ1Ohm = 999;
    if (phasors.ia.magRms > 100) {
      const vPhsV = phasors.va.magRms;
      const iPhsA = phasors.ia.magRms;
      calculatedZ1Ohm = Number((vPhsV / Math.max(1, iPhsA)).toFixed(2));
    }
    const distance21Zone1Trip = calculatedZ1Ohm < 12.0 && phasors.ia.magRms > 1200;

    // 4. Line Differential 87L (Idiff > 400 A and slope check)
    // In our single-end injection bench, remote end is simulated at 630 A normal
    const iRemoteA = 630;
    const calculatedIdiffA = Math.abs(phasors.ia.magRms - iRemoteA);
    const calculatedIbiasA = (phasors.ia.magRms + iRemoteA) / 2;
    // Harmonic restraint: if 2nd harmonic > 15%, differential is BLOCKED (inrush safety)
    const isHarmonicBlocked = params.harmonic2Percent >= 15;
    const differential87LTrip = !isHarmonicBlocked && calculatedIdiffA > 800 && (calculatedIdiffA / calculatedIbiasA) > 0.4;

    const anyTrip = overcurrent50InstantTrip || groundFault51NTrip || distance21Zone1Trip || differential87LTrip;

    let tripReasonFr = 'Régime Normal · Aucun dépassement de seuil';
    let tripReasonEn = 'Normal Operation · No trip threshold crossed';

    if (differential87LTrip) {
      tripReasonFr = `Déclenchement 87L (Différentielle Ligne) : Idiff = ${calculatedIdiffA} A > 800 A (Blocage H2 inactif)`;
      tripReasonEn = `87L Line Differential Trip: Idiff = ${calculatedIdiffA} A > 800 A (H2 blocking inactive)`;
    } else if (isHarmonicBlocked && calculatedIdiffA > 800) {
      tripReasonFr = `Blocage Harmonique 2 Actif (H2 = ${params.harmonic2Percent}%) : Déclenchement 87L inhibé avec succès (Enclenchement Transfo)`;
      tripReasonEn = `Harmonic 2 Restraint Active (H2 = ${params.harmonic2Percent}%): 87L differential trip safely restrained (Transformer Inrush)`;
    } else if (distance21Zone1Trip) {
      tripReasonFr = `Déclenchement 21 Zone 1 (Protection de Distance) : Z1 = ${calculatedZ1Ohm} Ω < 12.0 Ω (Instantané t = 0 ms)`;
      tripReasonEn = `21 Zone 1 Distance Trip: Z1 = ${calculatedZ1Ohm} Ω < 12.0 Ω (Instantaneous t = 0 ms)`;
    } else if (groundFault51NTrip) {
      tripReasonFr = `Déclenchement 51N (Défaut à la Terre) : Courant homopolaire 3I0 = ${phasors.in.magRms} A > 300 A`;
      tripReasonEn = `51N Ground Fault Trip: Residual zero sequence 3I0 = ${phasors.in.magRms} A > 300 A`;
    } else if (overcurrent50InstantTrip) {
      tripReasonFr = `Déclenchement 50 (Maximum de Courant Instantané) : Imax = ${iMax} A > 2500 A`;
      tripReasonEn = `50 Instantaneous Overcurrent Trip: Imax = ${iMax} A > 2500 A`;
    }

    // Simulated GOOSE Trip Packet payload in hex
    const goosePacketHex = anyTrip
      ? '01 0C CD 01 00 01 00 50 C2 88 92 01 81 00 80 04 88 B8 61 81 94 80 0E 4D 41 4E 47 5F 42 41 59 5F 54 52 49 50 81 02 00 0A 82 08 50 54 52 43 31 54 52 49 50 83 04 00 00 00 01 84 04 00 00 00 02 85 01 01 86 01 01 87 01 00'
      : '01 0C CD 01 00 01 00 50 C2 88 92 01 81 00 80 04 88 B8 61 81 94 80 0E 4D 41 4E 47 5F 42 41 59 5F 54 52 49 50 81 02 03 E8 82 08 50 54 52 43 31 54 52 49 50 83 04 00 00 00 01 84 04 00 00 00 01 85 01 00 86 01 00 87 01 00';

    return {
      overcurrent50InstantTrip,
      overcurrent50Pickup,
      groundFault51NTrip,
      distance21Zone1Trip,
      calculatedZ1Ohm,
      differential87LTrip,
      calculatedIdiffA,
      calculatedIbiasA,
      iedProcessingLatencyMs: 3.4, // Processing latency under 4 ms per IEC 61850-5 class P1
      gooseTripPacketPublished: anyTrip,
      goosePacketHex,
      tripReasonFr,
      tripReasonEn,
    };
  }

  /**
   * Generates a fully disassembled, Wireshark-grade IEC 61850-9-2LE APDU byte stream
   * for a specific sample index (e.g. smpCnt = 0).
   */
  public static generateSampledValuePacketHex(
    sample: SampledPoint,
    muConfig: MergingUnitConfig,
    ptpStatus: PtpSyncStatus
  ): { hexRaw: string; dissectorTree: { name: string; hex: string; value: string; desc: string }[] } {
    const toHex2 = (n: number) => (n & 0xff).toString(16).padStart(2, '0').toUpperCase();
    const toHex4 = (n: number) => (n & 0xffff).toString(16).padStart(4, '0').toUpperCase();
    const toHex8 = (n: number) => ((n >>> 0) & 0xffffffff).toString(16).padStart(8, '0').toUpperCase();

    const macDstHex = muConfig.macDst.replace(/-/g, ' ');
    const macSrcHex = muConfig.macSrc.replace(/-/g, ' ');
    const etherType = '88 BA'; // IEC 61850-9-2 Sampled Values
    const appIdHex = muConfig.appId.replace('0x', '').padStart(4, '0');

    const smpCntHex = toHex4(sample.smpCnt);
    const smpSynchHex = toHex2(ptpStatus.smpSynchFlag); // 02 = Global GPS sync

    const iaHex = toHex8(sample.iaRaw);
    const qIaHex = toHex8(sample.qIa);
    const ibHex = toHex8(sample.ibRaw);
    const qIbHex = toHex8(sample.qIa);
    const icHex = toHex8(sample.icRaw);
    const qIcHex = toHex8(sample.qIa);
    const inHex = toHex8(sample.inRaw);
    const qInHex = toHex8(sample.qIa);

    const vaHex = toHex8(sample.vaRaw);
    const qVaHex = toHex8(sample.qVa);
    const vbHex = toHex8(sample.vbRaw);
    const qVbHex = toHex8(sample.qVa);
    const vcHex = toHex8(sample.vcRaw);
    const qVcHex = toHex8(sample.qVa);
    const vpHex = toHex8(sample.vnRaw);
    const qVpHex = toHex8(sample.qVa);

    const dissectorTree = [
      {
        name: 'Ethernet II Header',
        hex: `${macDstHex} ${macSrcHex} 81 00 80 04 ${etherType}`,
        value: `Dst: ${muConfig.macDst} (Multicast Process Bus), Src: ${muConfig.macSrc}, VLAN ID: 4, EtherType: 0x88BA (IEC 61850-9-2)`,
        desc: 'Couche liaison de données standard IEEE 802.3 avec balisage de priorité 802.1Q (Priority 4)',
      },
      {
        name: 'SavPdu Header',
        hex: `${appIdHex.slice(0, 2)} ${appIdHex.slice(2, 4)} 00 68 00 00 00 00`,
        value: `APPID: ${muConfig.appId}, Length: 104 octets, Reserved: 0x0000 0x0000`,
        desc: 'Entête PDU Valeurs Échantillonnées identifiant le flux applicatif de la Merging Unit',
      },
      {
        name: 'ASDU Header (Application Service Data Unit)',
        hex: `80 0E ${Array.from(muConfig.svId).map((c) => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join(' ')} 82 02 ${smpCntHex} 83 04 00 00 00 01 85 01 ${smpSynchHex}`,
        value: `svID: "${muConfig.svId}", smpCnt: ${sample.smpCnt}, confRev: 1, smpSynch: ${ptpStatus.smpSynchFlag === 2 ? 'Global PTP Sync (2)' : 'Local (1)'}`,
        desc: 'Compteur d’échantillon (0-3999) réinitialisé à chaque seconde entière (Top PTP 1PPS)',
      },
      {
        name: 'PhsA Current (Ia) + Quality',
        hex: `${iaHex} ${qIaHex}`,
        value: `${sample.iaRaw} cts (${sample.iaEngA.toFixed(1)} A) · Qualité: 0x${qIaHex} (${sample.qIa === 0 ? 'Good' : 'Flagged'})`,
        desc: 'Intensité phase A codée en entier complément à 2 (échelle 1 mA/LSB) et mot d’état qualité',
      },
      {
        name: 'PhsB Current (Ib) + Quality',
        hex: `${ibHex} ${qIbHex}`,
        value: `${sample.ibRaw} cts (${sample.ibEngA.toFixed(1)} A) · Qualité: 0x${qIbHex}`,
        desc: 'Intensité phase B codée en entier complément à 2',
      },
      {
        name: 'PhsC Current (Ic) + Quality',
        hex: `${icHex} ${qIcHex}`,
        value: `${sample.icRaw} cts (${sample.icEngA.toFixed(1)} A) · Qualité: 0x${qIcHex}`,
        desc: 'Intensité phase C codée en entier complément à 2',
      },
      {
        name: 'Neut Current (In) + Quality',
        hex: `${inHex} ${qInHex}`,
        value: `${sample.inRaw} cts (${sample.inEngA.toFixed(1)} A) · Qualité: 0x${qInHex}`,
        desc: 'Courant de neutre résiduel calculé par la Merging Unit (In = Ia + Ib + Ic)',
      },
      {
        name: 'PhsA Voltage (Va) + Quality',
        hex: `${vaHex} ${qVaHex}`,
        value: `${sample.vaRaw} cts (${(sample.vaEngV / 1000).toFixed(2)} kV) · Qualité: 0x${qVaHex}`,
        desc: 'Tension simple phase A (échelle 10 mV/LSB = 100 cts/V)',
      },
      {
        name: 'PhsB Voltage (Vb) + Quality',
        hex: `${vbHex} ${qVbHex}`,
        value: `${sample.vbRaw} cts (${(sample.vbEngV / 1000).toFixed(2)} kV) · Qualité: 0x${qVbHex}`,
        desc: 'Tension simple phase B',
      },
      {
        name: 'PhsC Voltage (Vc) + Quality',
        hex: `${vcHex} ${qVcHex}`,
        value: `${sample.vcRaw} cts (${(sample.vcEngV / 1000).toFixed(2)} kV) · Qualité: 0x${qVcHex}`,
        desc: 'Tension simple phase C',
      },
      {
        name: 'Neut Voltage (Vn) + Quality',
        hex: `${vpHex} ${qVpHex}`,
        value: `${sample.vnRaw} cts (${(sample.vnEngV / 1000).toFixed(2)} kV) · Qualité: 0x${qVpHex}`,
        desc: 'Tension résiduelle homopolaire V0',
      },
    ];

    const hexRaw = dissectorTree.map((d) => d.hex).join(' ');

    return { hexRaw, dissectorTree };
  }
}
