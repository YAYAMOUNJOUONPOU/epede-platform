// src/data/harmonicResonanceEngine.ts
// EPEDE 2.0: Harmonic Spectrum & Resonant Impedance Analyzer Engine
// Normative standards: IEEE Std 519-2022, IEC 61000-3-6, IEC 61000-2-4, IEC 60831-1, IEC 61642, IEEE C57.110
// Solves: Parallel LC anti-resonance frequency fr, series detuning notch fs, impedance scan Z(f) [50..2500 Hz],
// harmonic voltage amplification, THDu, THDi, True Power Factor, and Transformer K-Factor.

export type DetuningFactorOption = 0 | 0.0567 | 0.07 | 0.14;
export type NonLinearLoadProfile = '6-pulse-vfd' | '12-pulse-rectifier' | 'arc-furnace' | 'ups-datacenter';

export interface HarmonicResonanceInput {
  voltageV: number; // Nominal line-to-line voltage (e.g. 400, 690, 6600, 15000, 30000)
  fundamentalFreqHz: 50 | 60;
  activePowerKw: number; // Total active load P (kW)
  initialCosPhi: number; // Displacement power factor before compensation
  targetCosPhi: number; // Target displacement power factor
  supplyTrafoKva: number; // Upstream supply transformer rating Sn (kVA)
  supplyTrafoUkPercent: number; // Transformer short-circuit impedance uk (%)
  upstreamGridSscMva: number; // Upstream HV grid short-circuit power Ssc (MVA)
  xrRatio: number; // System X/R ratio (typical 7 - 15)
  detuningFactorP: DetuningFactorOption; // 0 (none), 0.0567 (5.67% / 210Hz), 0.07 (7% / 189Hz), 0.14 (14% / 134Hz)
  nonLinearLoadSharePercent: number; // % of total load that is non-linear (10% - 90%)
  loadProfile: NonLinearLoadProfile;
}

export interface FrequencyScanPoint {
  freqHz: number;
  harmonicOrder: number;
  zSysOhm: number; // Uncompensated inductive network impedance
  zBareCapBusOhm: number; // Bus impedance with bare capacitor (p = 0)
  zActiveBusOhm: number; // Bus impedance with selected detuning factor p
  amplificationFactorBare: number; // |Z_bare| / |Z_sys|
  amplificationFactorActive: number; // |Z_active| / |Z_sys|
}

export interface HarmonicComponentResult {
  order: number;
  freqHz: number;
  currentPercentOfI1: number;
  currentAmps: number;
  voltagePercentBare: number;
  voltagePercentActive: number;
  ieee519VoltageLimitPercent: number;
  amplificationActive: number;
  isCompliantActive: boolean;
}

export interface HarmonicResonanceOutput {
  // Power Factor Correction metrics
  qRequiredKvar: number;
  qInstalledKvar: number;
  sscTotalMva: number;
  zSysFundamentalOhm: number;

  // Resonance metrics
  naturalParallelResonanceOrderBare: number;
  naturalParallelResonanceFreqBareHz: number;
  parallelResonanceOrderActive: number;
  parallelResonanceFreqActiveHz: number;
  seriesTuningOrder: number | null;
  seriesTuningFreqHz: number | null;
  maxAmplificationBare: number;
  maxAmplificationActive: number;
  isSevereResonanceRiskBare: boolean;

  // Harmonic Distortion & True PF
  thdCurrentPercent: number;
  thdVoltageBarePercent: number;
  thdVoltageActivePercent: number;
  ieee519ThdVoltageLimitPercent: number;
  isIeee519CompliantBare: boolean;
  isIeee519CompliantActive: boolean;

  // True Power Factor & Equipment Stress
  displacementCosPhiAfter: number;
  truePowerFactorAfter: number;
  transformerKFactor: number;
  capacitorRmsCurrentRatio: number; // I_cap_rms / I_cap_1 (IEC 60831 limit = 1.30)
  capacitorRatedVoltageRecommendedV: number;
  iscToIlRatio: number;

  // Data series for interactive plots
  frequencyScan: FrequencyScanPoint[];
  harmonicSpectrum: HarmonicComponentResult[];
  recommendations: { fr: string; en: string }[];
}

export interface CameroonHarmonicPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  input: HarmonicResonanceInput;
  description: { fr: string; en: string };
}

export const CAMEROON_HARMONIC_PRESETS: CameroonHarmonicPreset[] = [
  {
    id: 'sabc-douala-tgbt',
    name: {
      fr: 'Usine d’Embouteillage SABC Ndokoti — TGBT 400 V (Variateurs 6-Pulses)',
      en: 'SABC Ndokoti Bottling Plant — 400 V Main LV Switchboard (6-Pulse VFDs)',
    },
    facility: {
      fr: 'Boissons du Cameroun (Zone Industrielle de Bassa / Ndokoti, Douala)',
      en: 'Boissons du Cameroun (Bassa / Ndokoti Industrial Zone, Douala)',
    },
    input: {
      voltageV: 400,
      fundamentalFreqHz: 50,
      activePowerKw: 850,
      initialCosPhi: 0.78,
      targetCosPhi: 0.96,
      supplyTrafoKva: 1250,
      supplyTrafoUkPercent: 6.0,
      upstreamGridSscMva: 250,
      xrRatio: 8.5,
      detuningFactorP: 0.07,
      nonLinearLoadSharePercent: 45,
      loadProfile: '6-pulse-vfd',
    },
    description: {
      fr: 'Lignes d’embouteillage automatisées et compresseurs frigorifiques pilotés par variateurs PWM 6-pulses. Sans self 7% (189 Hz), la batterie de 400 kvar entre en résonance parallèle directe sur le rang 5 (250 Hz).',
      en: 'Automated bottling lines and refrigeration compressors driven by 6-pulse PWM VFDs. Without a 7% (189 Hz) detuning reactor, the 400 kvar bank hits parallel anti-resonance near the 5th harmonic (250 Hz).',
    },
  },
  {
    id: 'cimencam-bonaberi-mill',
    name: {
      fr: 'Cimenterie CIMENCAM Bonabéri — Jeu de Barres 6.6 kV (Broyeurs & Ventilateurs)',
      en: 'CIMENCAM Bonabéri Cement Plant — 6.6 kV MV Busbar (Milling & ID Fans)',
    },
    facility: {
      fr: 'CIMENCAM (Port Autonome de Douala - Bonabéri)',
      en: 'CIMENCAM (Douala Port Industrial Zone - Bonabéri)',
    },
    input: {
      voltageV: 6600,
      fundamentalFreqHz: 50,
      activePowerKw: 4200,
      initialCosPhi: 0.76,
      targetCosPhi: 0.95,
      supplyTrafoKva: 6300,
      supplyTrafoUkPercent: 7.5,
      upstreamGridSscMva: 350,
      xrRatio: 11.0,
      detuningFactorP: 0.07,
      nonLinearLoadSharePercent: 55,
      loadProfile: '6-pulse-vfd',
    },
    description: {
      fr: 'Entraînements moyenne tension de broyeurs à boulets et exhausteurs de four. Batterie HTA de 2100 kvar nécessitant un accord à 189 Hz (p=7%) pour contenir le THDu sous les 5.0% prescrits par IEEE 519.',
      en: 'Medium-voltage ball mill and kiln fan drives. The 2100 kvar MV capacitor bank requires 189 Hz (p=7%) detuning to keep bus THDu below the 5.0% IEEE 519 MV limit.',
    },
  },
  {
    id: 'prometal-bassa-eaf',
    name: {
      fr: 'Aciérie PROMETAL Douala — Four à Arc & Laminoirs (30 kV / 690 V)',
      en: 'PROMETAL Steelworks Douala — Electric Arc Furnace & Rolling Mill (690 V)',
    },
    facility: {
      fr: 'Complexe Métallurgique PROMETAL (Zone Industrielle Bassa, Douala)',
      en: 'PROMETAL Metallurgical Complex (Bassa Industrial Zone, Douala)',
    },
    input: {
      voltageV: 690,
      fundamentalFreqHz: 50,
      activePowerKw: 2400,
      initialCosPhi: 0.72,
      targetCosPhi: 0.95,
      supplyTrafoKva: 3150,
      supplyTrafoUkPercent: 6.5,
      upstreamGridSscMva: 400,
      xrRatio: 10.0,
      detuningFactorP: 0.14,
      nonLinearLoadSharePercent: 70,
      loadProfile: 'arc-furnace',
    },
    description: {
      fr: 'Charges sidérurgiques fortement fluctuantes générant un spectre riche en harmoniques 3, 5 et 7. Requiert des selfs de désaccordage à 14% (134 Hz) et des condensateurs sur-isolés.',
      en: 'Heavy steelmaking loads generating strong 3rd, 5th, and 7th harmonics. Requires 14% (134 Hz) detuning reactors to block 3rd harmonic amplification.',
    },
  },
  {
    id: 'alucam-edea-rectifier',
    name: {
      fr: 'Électrolyse ALUCAM Édéa — Groupes Redresseurs Dodécaphasés (12-Pulses)',
      en: 'ALUCAM Édéa Aluminum Smelter — 12-Pulse High-Current Rectifiers',
    },
    facility: {
      fr: 'Compagnie Camerounaise de l’Aluminium (Édéa - Nœud Hydro Mangombé)',
      en: 'ALUCAM Smelter Facility (Édéa - Mangombé Hydro Node)',
    },
    input: {
      voltageV: 15000,
      fundamentalFreqHz: 50,
      activePowerKw: 18000,
      initialCosPhi: 0.82,
      targetCosPhi: 0.96,
      supplyTrafoKva: 25000,
      supplyTrafoUkPercent: 9.0,
      upstreamGridSscMva: 1200,
      xrRatio: 14.0,
      detuningFactorP: 0.0567,
      nonLinearLoadSharePercent: 85,
      loadProfile: '12-pulse-rectifier',
    },
    description: {
      fr: 'Sous-station de redressement dodécaphasée (couplage Yy0 / Yd11 éliminant partiellement les rangs 5 et 7, mais concentrant l’énergie sur les rangs 11 et 13). Désaccordage à 5.67% (210 Hz).',
      en: '12-pulse phase-shifted rectifier substation (canceling most 5th and 7th harmonics while concentrating energy at 11th and 13th orders). Uses 5.67% (210 Hz) detuning.',
    },
  },
];

// Canonical harmonic current injection profiles (% of non-linear fundamental current I_NL1)
const LOAD_SPECTRUM_PROFILES: Record<NonLinearLoadProfile, Record<number, number>> = {
  '6-pulse-vfd': {
    3: 2.5,
    5: 32.0,
    7: 14.5,
    11: 7.5,
    13: 5.2,
    17: 3.1,
    19: 2.4,
    23: 1.6,
    25: 1.3,
  },
  '12-pulse-rectifier': {
    3: 1.0,
    5: 4.2,
    7: 2.8,
    11: 9.5,
    13: 7.2,
    17: 1.5,
    19: 1.2,
    23: 3.4,
    25: 2.8,
  },
  'arc-furnace': {
    3: 18.0,
    5: 24.0,
    7: 11.0,
    11: 5.5,
    13: 4.0,
    17: 2.2,
    19: 1.8,
    23: 1.2,
    25: 1.0,
  },
  'ups-datacenter': {
    3: 28.0,
    5: 22.0,
    7: 12.0,
    11: 6.0,
    13: 4.5,
    17: 2.5,
    19: 1.9,
    23: 1.1,
    25: 0.9,
  },
};

export class HarmonicResonanceEngine {
  /**
   * Solves complete harmonic spectrum, frequency impedance scan Z(f), and IEEE 519 compliance
   */
  public static solve(input: HarmonicResonanceInput): HarmonicResonanceOutput {
    const {
      voltageV: U,
      fundamentalFreqHz: f1,
      activePowerKw: P,
      initialCosPhi,
      targetCosPhi,
      supplyTrafoKva: Sn,
      supplyTrafoUkPercent: uk,
      upstreamGridSscMva: SscGridMva,
      xrRatio,
      detuningFactorP: p,
      nonLinearLoadSharePercent,
      loadProfile,
    } = input;

    const cos1 = Math.max(0.4, Math.min(0.99, initialCosPhi));
    const cos2 = Math.max(cos1, Math.min(1.0, targetCosPhi));
    const tan1 = Math.tan(Math.acos(cos1));
    const tan2 = Math.tan(Math.acos(cos2));

    // 1. Reactive Power Compensation Sizing
    const qRequiredKvar = Math.max(25, P * (tan1 - tan2));
    const stepBlock = qRequiredKvar > 1000 ? 100 : qRequiredKvar > 300 ? 50 : 25;
    const qInstalledKvar = Math.ceil(qRequiredKvar / stepBlock) * stepBlock;

    // 2. Short-circuit power & fundamental system impedance Z_sys(1)
    // Z_trafo_pu = uk / 100 on Sn base -> Ssc_trafo = Sn / (uk/100) [kVA]
    const sscTrafoMva = (Sn / 1000) / (Math.max(1, uk) / 100);
    const sscTotalMva = 1 / (1 / sscTrafoMva + 1 / Math.max(10, SscGridMva));
    const sscTotalKva = sscTotalMva * 1000;

    // Fundamental system impedance Z_sys1 = U² / Ssc
    const zSys1Ohm = Math.pow(U, 2) / (sscTotalMva * 1e6);
    const phiSys = Math.atan(Math.max(2, xrRatio));
    const rSys1Ohm = zSys1Ohm * Math.cos(phiSys);
    const xSys1Ohm = zSys1Ohm * Math.sin(phiSys);

    // Parallel load damping resistance R_load = U² / (P * 1000)
    const rLoadOhm = Math.pow(U, 2) / (Math.max(10, P) * 1000);

    // 3. Capacitor and Detuning Reactor reactances at f1
    // Net reactive power delivered at f1 is qInstalledKvar
    // X_net1 = U² / (Q_installed * 1000)
    const xNet1Ohm = Math.pow(U, 2) / (qInstalledKvar * 1000);
    // Bare capacitor (p = 0)
    const xCapBare1Ohm = xNet1Ohm;

    // With detuning reactor p = X_L1 / X_C1, and X_net1 = X_C1 - X_L1 = X_C1 * (1 - p)
    const xCapActive1Ohm = p > 0 ? xNet1Ohm / (1 - p) : xNet1Ohm;
    const xReactorActive1Ohm = p * xCapActive1Ohm;
    const rReactor1Ohm = xReactorActive1Ohm > 0 ? xReactorActive1Ohm / 45 : xCapActive1Ohm * 0.002; // Q_reactor ~ 45

    // 4. Resonant Frequencies
    // Bare parallel resonance order hr_bare = sqrt(Ssc / Qc)
    const naturalParallelResonanceOrderBare = Math.sqrt(sscTotalKva / qInstalledKvar);
    const naturalParallelResonanceFreqBareHz = f1 * naturalParallelResonanceOrderBare;

    // Active parallel resonance order with detuning reactor:
    // At resonance: h * (X_sys1 + X_L1) = X_C1 / h  =>  h_r = sqrt(X_C1 / (X_sys1 + X_L1))
    const parallelResonanceOrderActive = Math.sqrt(
      xCapActive1Ohm / (xSys1Ohm + xReactorActive1Ohm)
    );
    const parallelResonanceFreqActiveHz = f1 * parallelResonanceOrderActive;

    // Series tuning notch frequency (where capacitor + reactor branch has zero reactance)
    const seriesTuningOrder = p > 0 ? 1 / Math.sqrt(p) : null;
    const seriesTuningFreqHz = seriesTuningOrder ? f1 * seriesTuningOrder : null;

    // Helper to compute complex parallel impedance magnitude at harmonic order h
    const computeBusImpedance = (h: number, useDetuned: boolean): number => {
      // Upstream grid impedance Z_sys(h) = R_sys1 * sqrt(h) + j * h * X_sys1
      const rSysH = rSys1Ohm * Math.sqrt(h);
      const xSysH = h * xSys1Ohm;

      // Capacitor branch impedance Z_cap(h)
      const xCap1 = useDetuned ? xCapActive1Ohm : xCapBare1Ohm;
      const xL1 = useDetuned ? xReactorActive1Ohm : 0;
      const rCapH = useDetuned && p > 0
        ? rReactor1Ohm * Math.sqrt(h)
        : xCap1 * 0.003;
      const xCapBranchH = h * xL1 - xCap1 / h;

      // Admittance Y_total = 1/Z_sys + 1/Z_cap + 1/R_load
      const zSysMag2 = rSysH * rSysH + xSysH * xSysH;
      const gSys = rSysH / zSysMag2;
      const bSys = -xSysH / zSysMag2;

      const zCapMag2 = rCapH * rCapH + xCapBranchH * xCapBranchH;
      const gCap = rCapH / zCapMag2;
      const bCap = -xCapBranchH / zCapMag2;

      // Active load damping (60% resistive damping at harmonic frequencies)
      const gLoad = 0.6 / rLoadOhm;

      const gTot = gSys + gCap + gLoad;
      const bTot = bSys + bCap;
      const yTotMag = Math.sqrt(gTot * gTot + bTot * bTot);

      return 1 / Math.max(1e-9, yTotMag);
    };

    // 5. Frequency Scan from h = 1.0 to 50.0 (step 0.5 -> 99 points)
    const frequencyScan: FrequencyScanPoint[] = [];
    let maxAmplificationBare = 1.0;
    let maxAmplificationActive = 1.0;

    for (let h = 1.0; h <= 30.0; h += 0.25) {
      const freqHz = Number((h * f1).toFixed(1));
      const zSysOhm = Math.sqrt(
        Math.pow(rSys1Ohm * Math.sqrt(h), 2) + Math.pow(h * xSys1Ohm, 2)
      );
      const zBareCapBusOhm = computeBusImpedance(h, false);
      const zActiveBusOhm = computeBusImpedance(h, true);

      const ampBare = zBareCapBusOhm / zSysOhm;
      const ampActive = zActiveBusOhm / zSysOhm;

      if (ampBare > maxAmplificationBare) maxAmplificationBare = ampBare;
      if (ampActive > maxAmplificationActive) maxAmplificationActive = ampActive;

      frequencyScan.push({
        freqHz,
        harmonicOrder: Number(h.toFixed(2)),
        zSysOhm: Number(zSysOhm.toFixed(5)),
        zBareCapBusOhm: Number(zBareCapBusOhm.toFixed(5)),
        zActiveBusOhm: Number(zActiveBusOhm.toFixed(5)),
        amplificationFactorBare: Number(ampBare.toFixed(2)),
        amplificationFactorActive: Number(ampActive.toFixed(2)),
      });
    }

    // 6. Harmonic Spectrum Synthesis & Voltage Distortion Calculation
    const iLoadFundamentalA = (P * 1000) / (Math.sqrt(3) * U * cos2);
    const nonLinearShare = Math.max(0.05, Math.min(1.0, nonLinearLoadSharePercent / 100));
    const spectrumTemplate = LOAD_SPECTRUM_PROFILES[loadProfile];
    const characteristicOrders = [3, 5, 7, 11, 13, 17, 19, 23, 25];

    // IEEE 519-2022 Voltage Limits:
    // V <= 1.0 kV: Individual = 5.0%, THDu = 8.0%
    // 1 kV < V <= 69 kV: Individual = 3.0%, THDu = 5.0%
    const isMv = U > 1000;
    const ieee519IndividualVoltageLimit = isMv ? 3.0 : 5.0;
    const ieee519ThdVoltageLimitPercent = isMv ? 5.0 : 8.0;

    const uPhaseNominalV = U / Math.sqrt(3);
    const harmonicSpectrum: HarmonicComponentResult[] = [];

    let sumIhSquared = 0;
    let sumUhBareSquared = 0;
    let sumUhActiveSquared = 0;
    let sumKFactorNum = 1.0; // h=1 term
    let sumCapHarmonicCurrentSquared = 0;

    for (const h of characteristicOrders) {
      const basePct = spectrumTemplate[h] || 0;
      const ihPercentOfI1 = basePct * nonLinearShare;
      const ihAmps = iLoadFundamentalA * (ihPercentOfI1 / 100);

      const zSysH = Math.sqrt(
        Math.pow(rSys1Ohm * Math.sqrt(h), 2) + Math.pow(h * xSys1Ohm, 2)
      );
      const zBareH = computeBusImpedance(h, false);
      const zActiveH = computeBusImpedance(h, true);

      const vhBareV = ihAmps * zBareH;
      const vhActiveV = ihAmps * zActiveH;

      const uhBarePct = (vhBareV / uPhaseNominalV) * 100;
      const uhActivePct = (vhActiveV / uPhaseNominalV) * 100;

      sumIhSquared += Math.pow(ihPercentOfI1, 2);
      sumUhBareSquared += Math.pow(uhBarePct, 2);
      sumUhActiveSquared += Math.pow(uhActivePct, 2);
      sumKFactorNum += Math.pow(ihPercentOfI1 / 100, 2) * Math.pow(h, 2);

      // Harmonic current flowing into the active capacitor bank branch
      const xCapBranchActiveH = Math.abs(h * xReactorActive1Ohm - xCapActive1Ohm / h);
      const ihCapBranchA = vhActiveV / Math.max(0.001, xCapBranchActiveH);
      sumCapHarmonicCurrentSquared += Math.pow(ihCapBranchA, 2);

      harmonicSpectrum.push({
        order: h,
        freqHz: h * f1,
        currentPercentOfI1: Number(ihPercentOfI1.toFixed(2)),
        currentAmps: Number(ihAmps.toFixed(1)),
        voltagePercentBare: Number(uhBarePct.toFixed(2)),
        voltagePercentActive: Number(uhActivePct.toFixed(2)),
        ieee519VoltageLimitPercent: ieee519IndividualVoltageLimit,
        amplificationActive: Number((zActiveH / zSysH).toFixed(2)),
        isCompliantActive: uhActivePct <= ieee519IndividualVoltageLimit,
      });
    }

    const thdCurrentPercent = Math.sqrt(sumIhSquared);
    const thdVoltageBarePercent = Math.sqrt(sumUhBareSquared);
    const thdVoltageActivePercent = Math.sqrt(sumUhActiveSquared);

    // True Power Factor = cos(phi_1) / sqrt(1 + (THDi/100)^2)
    const truePowerFactorAfter =
      cos2 / Math.sqrt(1 + Math.pow(thdCurrentPercent / 100, 2));

    // Transformer K-Factor
    const totalIrmsSquaredPu = 1 + Math.pow(thdCurrentPercent / 100, 2);
    const transformerKFactor = sumKFactorNum / totalIrmsSquaredPu;

    // Capacitor RMS Current overload ratio I_cap_rms / I_cap_1
    const iCapFundamentalA = (qInstalledKvar * 1000) / (Math.sqrt(3) * U);
    const iCapTotalRmsA = Math.sqrt(
      Math.pow(iCapFundamentalA, 2) + sumCapHarmonicCurrentSquared
    );
    const capacitorRmsCurrentRatio = iCapTotalRmsA / Math.max(1, iCapFundamentalA);

    // Recommended capacitor voltage rating due to reactor voltage rise U_cap = U / (1 - p)
    const capacitorRatedVoltageRecommendedV =
      U === 400
        ? p >= 0.14
          ? 480
          : p >= 0.05
          ? 440
          : 400
        : Math.ceil((U / (1 - p)) * 1.05);

    // Short-circuit ratio Isc / IL
    const iscAmps = (sscTotalMva * 1e6) / (Math.sqrt(3) * U);
    const iscToIlRatio = iscAmps / Math.max(1, iLoadFundamentalA);

    // Check if bare resonance falls near h=5 (4.2..5.8), h=7 (6.2..7.8), or h=11 (10.2..11.8)
    const isSevereResonanceRiskBare =
      (naturalParallelResonanceOrderBare >= 4.2 && naturalParallelResonanceOrderBare <= 5.8) ||
      (naturalParallelResonanceOrderBare >= 6.2 && naturalParallelResonanceOrderBare <= 7.8) ||
      (naturalParallelResonanceOrderBare >= 10.2 && naturalParallelResonanceOrderBare <= 11.8) ||
      thdVoltageBarePercent > ieee519ThdVoltageLimitPercent;

    const isIeee519CompliantBare = thdVoltageBarePercent <= ieee519ThdVoltageLimitPercent;
    const isIeee519CompliantActive =
      thdVoltageActivePercent <= ieee519ThdVoltageLimitPercent &&
      harmonicSpectrum.every((h) => h.isCompliantActive);

    // 7. Normative Engineering Recommendations
    const recommendations: { fr: string; en: string }[] = [];
    if (p === 0 && isSevereResonanceRiskBare) {
      recommendations.push({
        fr: `ALERTE RÉSONANCE PARALLÈLE : La fréquence propre de la batterie nue (fr = ${naturalParallelResonanceFreqBareHz.toFixed(0)} Hz, rang h = ${naturalParallelResonanceOrderBare.toFixed(1)}) provoque une amplification sévère (THDu = ${thdVoltageBarePercent.toFixed(2)}%). Prescription impérative CEI 61642 : Installer des selfs anti-harmoniques 7% (189 Hz).`,
        en: `PARALLEL RESONANCE ALERT: Bare capacitor bank resonance (fr = ${naturalParallelResonanceFreqBareHz.toFixed(0)} Hz, h = ${naturalParallelResonanceOrderBare.toFixed(1)}) causes severe harmonic amplification (THDu = ${thdVoltageBarePercent.toFixed(2)}%). Mandatory IEC 61642 mitigation: Install 7% (189 Hz) detuning reactors.`,
      });
    }
    if (p > 0 && isIeee519CompliantActive) {
      recommendations.push({
        fr: `Désaccordage actif (p = ${(p * 100).toFixed(2)}%, fs = ${seriesTuningFreqHz?.toFixed(0)} Hz) : L'impédance de la batterie est inductive au-dessus de ${seriesTuningFreqHz?.toFixed(0)} Hz, abaissant le THDu de ${thdVoltageBarePercent.toFixed(2)}% à ${thdVoltageActivePercent.toFixed(2)}% (Conforme IEEE Std 519-2022 ≤ ${ieee519ThdVoltageLimitPercent.toFixed(1)}%).`,
        en: `Active detuning (p = ${(p * 100).toFixed(2)}%, fs = ${seriesTuningFreqHz?.toFixed(0)} Hz): Capacitor bank presents an inductive impedance above ${seriesTuningFreqHz?.toFixed(0)} Hz, reducing bus THDu from ${thdVoltageBarePercent.toFixed(2)}% to ${thdVoltageActivePercent.toFixed(2)}% (IEEE Std 519-2022 compliant ≤ ${ieee519ThdVoltageLimitPercent.toFixed(1)}%).`,
      });
    }
    if (!isIeee519CompliantActive) {
      recommendations.push({
        fr: `Le THDu résiduel (${thdVoltageActivePercent.toFixed(2)}%) excède la limite IEEE 519 (${ieee519ThdVoltageLimitPercent.toFixed(1)}%). En complément de la batterie désaccordée, installer un Filtre Actif d'Harmoniques (APF IGBT) pour compenser dynamiquement les courants harmoniques.`,
        en: `Residual THDu (${thdVoltageActivePercent.toFixed(2)}%) exceeds IEEE 519 limit (${ieee519ThdVoltageLimitPercent.toFixed(1)}%). Supplement the detuned bank with an IGBT Active Power Filter (APF).`,
      });
    }
    if (transformerKFactor > 4.0) {
      recommendations.push({
        fr: `Facteur K du transformateur = ${transformerKFactor.toFixed(1)} (> 4.0) : Prévoir un déclassement thermique du transformateur selon IEEE C57.110 ou spécifier un transformateur de classe K-13.`,
        en: `Transformer K-Factor = ${transformerKFactor.toFixed(1)} (> 4.0): Apply thermal derating per IEEE C57.110 or specify a K-13 rated transformer.`,
      });
    }

    return {
      qRequiredKvar: Number(qRequiredKvar.toFixed(1)),
      qInstalledKvar,
      sscTotalMva: Number(sscTotalMva.toFixed(2)),
      zSysFundamentalOhm: Number(zSys1Ohm.toFixed(5)),
      naturalParallelResonanceOrderBare: Number(naturalParallelResonanceOrderBare.toFixed(2)),
      naturalParallelResonanceFreqBareHz: Math.round(naturalParallelResonanceFreqBareHz),
      parallelResonanceOrderActive: Number(parallelResonanceOrderActive.toFixed(2)),
      parallelResonanceFreqActiveHz: Math.round(parallelResonanceFreqActiveHz),
      seriesTuningOrder: seriesTuningOrder ? Number(seriesTuningOrder.toFixed(2)) : null,
      seriesTuningFreqHz: seriesTuningFreqHz ? Math.round(seriesTuningFreqHz) : null,
      maxAmplificationBare: Number(maxAmplificationBare.toFixed(2)),
      maxAmplificationActive: Number(maxAmplificationActive.toFixed(2)),
      isSevereResonanceRiskBare,
      thdCurrentPercent: Number(thdCurrentPercent.toFixed(2)),
      thdVoltageBarePercent: Number(thdVoltageBarePercent.toFixed(2)),
      thdVoltageActivePercent: Number(thdVoltageActivePercent.toFixed(2)),
      ieee519ThdVoltageLimitPercent,
      isIeee519CompliantBare,
      isIeee519CompliantActive,
      displacementCosPhiAfter: Number(cos2.toFixed(3)),
      truePowerFactorAfter: Number(truePowerFactorAfter.toFixed(3)),
      transformerKFactor: Number(transformerKFactor.toFixed(2)),
      capacitorRmsCurrentRatio: Number(capacitorRmsCurrentRatio.toFixed(2)),
      capacitorRatedVoltageRecommendedV,
      iscToIlRatio: Number(iscToIlRatio.toFixed(1)),
      frequencyScan,
      harmonicSpectrum,
      recommendations,
    };
  }
}

