// src/components/power-quality/services/usePqProjectStore.ts
// EPEDE Domain D17 / D14 - Central Reactive Project Store for Power Quality & EMC Engineering
// Calibrated to IEC 61000-2-4, IEC 61000-4-30 Class A, IEEE 519-2022, SEMI F47, IEEE C57.110 & Cameroon Industrial Sites

import { useState, useMemo } from 'react';

export type PqSiteKey =
  | 'ALUCAM_EDEA_180MW'
  | 'PROMETAL_BASSA_ARC'
  | 'CIMENCAM_NOMAYOS_VFD'
  | 'DOUALA_PORT_LOGISTICS'
  | 'STANDARD_INDUSTRIAL_PCC';

export interface PqSiteProfile {
  id: PqSiteKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  nominalVoltageV: number;
  shortCircuitPowerMva: number;
  contractualPowerMw: number;
  fundamentalCurrentA: number;
  presetHarmonics: {
    h3: number;
    h5: number;
    h7: number;
    h9: number;
    h11: number;
    h13: number;
    h17: number;
    h19: number;
    h23: number;
    h25: number;
  };
  presetSag: {
    retainedPct: number;
    durationMs: number;
  };
  presetFlickerPst: number;
  presetUnbalancePct: number;
  transformerRatingKva: number;
}

export const PQ_SITE_PROFILES: Record<PqSiteKey, PqSiteProfile> = {
  ALUCAM_EDEA_180MW: {
    id: 'ALUCAM_EDEA_180MW',
    nameFr: "Aluminerie d'Édéa - ALUCAM (180 MW - Redresseurs Dodécaphasés)",
    nameEn: 'ALUCAM Aluminum Smelter (Édéa - 180 MW 12-Pulse Rectifiers)',
    cameroonReference: "Pôle Électrométallurgique National d'Édéa sur le Réseau 90 kV SONATREL",
    nominalVoltageV: 400,
    shortCircuitPowerMva: 350,
    contractualPowerMw: 180,
    fundamentalCurrentA: 1850,
    presetHarmonics: {
      h3: 0.8,
      h5: 4.2,
      h7: 2.8,
      h9: 0.4,
      h11: 10.5,
      h13: 8.2,
      h17: 2.4,
      h19: 1.9,
      h23: 1.5,
      h25: 1.2
    },
    presetSag: { retainedPct: 65, durationMs: 180 },
    presetFlickerPst: 0.75,
    presetUnbalancePct: 1.1,
    transformerRatingKva: 2500
  },
  PROMETAL_BASSA_ARC: {
    id: 'PROMETAL_BASSA_ARC',
    nameFr: 'Aciérie PROMETAL 4 & 5 (Zone Industrielle Bassa - Fours à Arc & Induction)',
    nameEn: 'PROMETAL Steelworks 4 & 5 (Douala Bassa - Electric Arc & Induction Furnaces)',
    cameroonReference: 'Site Industriel Lourd de Bassa - Fluctuations Réactives & Flicker Sonatrel 90/15 kV',
    nominalVoltageV: 400,
    shortCircuitPowerMva: 180,
    contractualPowerMw: 45,
    fundamentalCurrentA: 1200,
    presetHarmonics: {
      h3: 8.5,
      h5: 19.5,
      h7: 14.0,
      h9: 4.2,
      h11: 8.0,
      h13: 6.5,
      h17: 4.2,
      h19: 3.5,
      h23: 2.2,
      h25: 1.8
    },
    presetSag: { retainedPct: 40, durationMs: 320 },
    presetFlickerPst: 2.65,
    presetUnbalancePct: 2.8,
    transformerRatingKva: 2000
  },
  CIMENCAM_NOMAYOS_VFD: {
    id: 'CIMENCAM_NOMAYOS_VFD',
    nameFr: 'Cimenterie CIMENCAM Nomayos (Broyeurs Horizontaux & Variateurs Moyenne Tension)',
    nameEn: 'CIMENCAM Nomayos Cement Plant (Heavy Ball Mills & MV Drives)',
    cameroonReference: 'Ligne 90 kV Yaoundé Sud - Sensibilité Orageuse Tropicale & Creux de Tension',
    nominalVoltageV: 400,
    shortCircuitPowerMva: 120,
    contractualPowerMw: 25,
    fundamentalCurrentA: 850,
    presetHarmonics: {
      h3: 1.8,
      h5: 18.2,
      h7: 11.4,
      h9: 0.9,
      h11: 6.8,
      h13: 4.8,
      h17: 2.9,
      h19: 2.1,
      h23: 1.4,
      h25: 1.1
    },
    presetSag: { retainedPct: 35, durationMs: 250 },
    presetFlickerPst: 1.15,
    presetUnbalancePct: 1.6,
    transformerRatingKva: 1600
  },
  DOUALA_PORT_LOGISTICS: {
    id: 'DOUALA_PORT_LOGISTICS',
    nameFr: 'Terminal Portuaire & Entrepôts Frigorifiques (Port Autonome de Douala)',
    nameEn: 'Douala Autonomous Port Cold Storage & Logistics Terminal',
    cameroonReference: 'Quais Portuaires & Chaîne du Froid - Harmoniques Rang 3 & Échauffement du Neutre',
    nominalVoltageV: 400,
    shortCircuitPowerMva: 90,
    contractualPowerMw: 12,
    fundamentalCurrentA: 550,
    presetHarmonics: {
      h3: 14.5,
      h5: 12.0,
      h7: 7.5,
      h9: 3.8,
      h11: 4.2,
      h13: 3.1,
      h17: 1.8,
      h19: 1.4,
      h23: 0.9,
      h25: 0.7
    },
    presetSag: { retainedPct: 70, durationMs: 120 },
    presetFlickerPst: 0.65,
    presetUnbalancePct: 2.2,
    transformerRatingKva: 1000
  },
  STANDARD_INDUSTRIAL_PCC: {
    id: 'STANDARD_INDUSTRIAL_PCC',
    nameFr: 'Usine Manufacturière Standard PCC BT/HTA (Zone Magzi Bassa / Bonabéri)',
    nameEn: 'Standard Manufacturing Plant PCC (Magzi Industrial Zone Douala)',
    cameroonReference: 'Poste de Livraison Privé HTA 15 kV / BT 400 V - Charge Mixte Éclairage & Moteurs VFD',
    nominalVoltageV: 400,
    shortCircuitPowerMva: 100,
    contractualPowerMw: 5,
    fundamentalCurrentA: 400,
    presetHarmonics: {
      h3: 2.5,
      h5: 14.2,
      h7: 8.6,
      h9: 1.2,
      h11: 6.8,
      h13: 4.5,
      h17: 2.8,
      h19: 2.1,
      h23: 1.2,
      h25: 0.9
    },
    presetSag: { retainedPct: 55, durationMs: 200 },
    presetFlickerPst: 0.95,
    presetUnbalancePct: 1.4,
    transformerRatingKva: 630
  }
};

export const usePqProjectStore = (initialSiteKey: PqSiteKey = 'ALUCAM_EDEA_180MW') => {
  // Navigation State
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedSiteKey, setSelectedSiteKey] = useState<PqSiteKey>(initialSiteKey);

  // Active Site Profile
  const activeProfile = PQ_SITE_PROFILES[selectedSiteKey];

  // Base Grid Telemetry
  const [nominalVoltageV, setNominalVoltageV] = useState<number>(activeProfile.nominalVoltageV);
  const [fundamentalCurrentA, setFundamentalCurrentA] = useState<number>(activeProfile.fundamentalCurrentA);
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.0);
  const [shortCircuitPowerMva, setShortCircuitPowerMva] = useState<number>(activeProfile.shortCircuitPowerMva);

  // Harmonic Spectrum (% of fundamental)
  const [h3Pct, setH3Pct] = useState<number>(activeProfile.presetHarmonics.h3);
  const [h5Pct, setH5Pct] = useState<number>(activeProfile.presetHarmonics.h5);
  const [h7Pct, setH7Pct] = useState<number>(activeProfile.presetHarmonics.h7);
  const [h9Pct, setH9Pct] = useState<number>(activeProfile.presetHarmonics.h9);
  const [h11Pct, setH11Pct] = useState<number>(activeProfile.presetHarmonics.h11);
  const [h13Pct, setH13Pct] = useState<number>(activeProfile.presetHarmonics.h13);
  const [h17Pct, setH17Pct] = useState<number>(activeProfile.presetHarmonics.h17);
  const [h19Pct, setH19Pct] = useState<number>(activeProfile.presetHarmonics.h19);
  const [h23Pct, setH23Pct] = useState<number>(activeProfile.presetHarmonics.h23);
  const [h25Pct, setH25Pct] = useState<number>(activeProfile.presetHarmonics.h25);

  // Voltage Sag Telemetry
  const [sagRetainedPct, setSagRetainedPct] = useState<number>(activeProfile.presetSag.retainedPct);
  const [sagDurationMs, setSagDurationMs] = useState<number>(activeProfile.presetSag.durationMs);

  // Active Filter (APF) Mitigation Bench
  const [isApfActive, setIsApfActive] = useState<boolean>(true);
  const [apfCompensationGainPct, setApfCompensationGainPct] = useState<number>(88); // 88% attenuation of harmonics
  const [apfResponseTimeMicroSec, setApfResponseTimeMicroSec] = useState<number>(25);

  // Detuned Capacitor Bank (Pillar 4 LC)
  const [targetCapacitorKvar, setTargetCapacitorKvar] = useState<number>(200);
  const [detuningReactorPct, setDetuningReactorPct] = useState<number>(7.0); // 7% detuning -> 189 Hz anti-resonance
  const [isDetuningEnabled, setIsDetuningEnabled] = useState<boolean>(true);

  // Flicker & Unbalance Telemetry
  const [flickerPst, setFlickerPst] = useState<number>(activeProfile.presetFlickerPst);
  const [flickerPlt, setFlickerPlt] = useState<number>(Number((activeProfile.presetFlickerPst * 0.82).toFixed(2)));
  const [unbalancePct, setUnbalancePct] = useState<number>(activeProfile.presetUnbalancePct);

  // Transformer Telemetry
  const [transformerRatedKva, setTransformerRatedKva] = useState<number>(activeProfile.transformerRatingKva);

  // Handler to switch industrial site profile
  const switchSiteProfile = (key: PqSiteKey) => {
    setSelectedSiteKey(key);
    const profile = PQ_SITE_PROFILES[key];
    setNominalVoltageV(profile.nominalVoltageV);
    setFundamentalCurrentA(profile.fundamentalCurrentA);
    setShortCircuitPowerMva(profile.shortCircuitPowerMva);
    setH3Pct(profile.presetHarmonics.h3);
    setH5Pct(profile.presetHarmonics.h5);
    setH7Pct(profile.presetHarmonics.h7);
    setH9Pct(profile.presetHarmonics.h9);
    setH11Pct(profile.presetHarmonics.h11);
    setH13Pct(profile.presetHarmonics.h13);
    setH17Pct(profile.presetHarmonics.h17);
    setH19Pct(profile.presetHarmonics.h19);
    setH23Pct(profile.presetHarmonics.h23);
    setH25Pct(profile.presetHarmonics.h25);
    setSagRetainedPct(profile.presetSag.retainedPct);
    setSagDurationMs(profile.presetSag.durationMs);
    setFlickerPst(profile.presetFlickerPst);
    setFlickerPlt(Number((profile.presetFlickerPst * 0.82).toFixed(2)));
    setUnbalancePct(profile.presetUnbalancePct);
    setTransformerRatedKva(profile.transformerRatingKva);
  };

  // =========================================================================
  // CALCULATIONS ENGINE: HARMONICS, THD, RMS CURRENT, IEEE 519 & K-FACTOR
  // =========================================================================
  const harmonicAnalytics = useMemo(() => {
    // Current harmonics attenuation if APF is active
    const factor = isApfActive ? (1 - apfCompensationGainPct / 100) : 1.0;

    const effH3 = h3Pct * factor;
    const effH5 = h5Pct * factor;
    const effH7 = h7Pct * factor;
    const effH9 = h9Pct * factor;
    const effH11 = h11Pct * factor;
    const effH13 = h13Pct * factor;
    const effH17 = h17Pct * factor;
    const effH19 = h19Pct * factor;
    const effH23 = h23Pct * factor;
    const effH25 = h25Pct * factor;

    // Raw (unfiltered) THDi
    const rawSumSquares =
      Math.pow(h3Pct, 2) +
      Math.pow(h5Pct, 2) +
      Math.pow(h7Pct, 2) +
      Math.pow(h9Pct, 2) +
      Math.pow(h11Pct, 2) +
      Math.pow(h13Pct, 2) +
      Math.pow(h17Pct, 2) +
      Math.pow(h19Pct, 2) +
      Math.pow(h23Pct, 2) +
      Math.pow(h25Pct, 2);
    const rawThdCurrentPct = Math.sqrt(rawSumSquares);

    // Effective (with APF if on) THDi
    const effSumSquares =
      Math.pow(effH3, 2) +
      Math.pow(effH5, 2) +
      Math.pow(effH7, 2) +
      Math.pow(effH9, 2) +
      Math.pow(effH11, 2) +
      Math.pow(effH13, 2) +
      Math.pow(effH17, 2) +
      Math.pow(effH19, 2) +
      Math.pow(effH23, 2) +
      Math.pow(effH25, 2);
    const effectiveThdCurrentPct = Math.sqrt(effSumSquares);

    // RMS current: Irms = I1 * sqrt(1 + THDi^2)
    const effectiveIrmsA = fundamentalCurrentA * Math.sqrt(1 + Math.pow(effectiveThdCurrentPct / 100, 2));
    const rawIrmsA = fundamentalCurrentA * Math.sqrt(1 + Math.pow(rawThdCurrentPct / 100, 2));

    // Voltage THDv approximation from network short-circuit ratio (Isc / IL)
    // Formula: THDv ~ THDi * (S_load / S_sc)
    const sLoadMva = (Math.sqrt(3) * nominalVoltageV * fundamentalCurrentA) / 1e6;
    const scr = shortCircuitPowerMva / Math.max(0.1, sLoadMva);
    const couplingRatio = Math.max(0.04, Math.min(0.40, 1.8 / Math.sqrt(scr)));

    const rawThdVoltagePct = Math.min(22, Math.max(0.5, rawThdCurrentPct * couplingRatio));
    const effectiveThdVoltagePct = Math.min(22, Math.max(0.5, effectiveThdCurrentPct * couplingRatio));

    // IEEE 519-2022 Compliance limits:
    // For V <= 1 kV: THDv <= 8.0%, each harmonic <= 5.0%
    // For 1 kV < V <= 69 kV: THDv <= 5.0%, each harmonic <= 3.0%
    const isVoltageCompliant = effectiveThdVoltagePct <= 5.0;
    const isCurrentCompliant = effectiveThdCurrentPct <= 12.0;

    // Transformer K-Factor calculation per IEEE C57.110:
    // K = sum( (Ih / I1)^2 * h^2 )
    const kFactorRaw =
      1 +
      Math.pow(h3Pct / 100, 2) * 9 +
      Math.pow(h5Pct / 100, 2) * 25 +
      Math.pow(h7Pct / 100, 2) * 49 +
      Math.pow(h9Pct / 100, 2) * 81 +
      Math.pow(h11Pct / 100, 2) * 121 +
      Math.pow(h13Pct / 100, 2) * 169 +
      Math.pow(h17Pct / 100, 2) * 289 +
      Math.pow(h19Pct / 100, 2) * 361 +
      Math.pow(h23Pct / 100, 2) * 529 +
      Math.pow(h25Pct / 100, 2) * 625;

    const kFactorEffective =
      1 +
      Math.pow(effH3 / 100, 2) * 9 +
      Math.pow(effH5 / 100, 2) * 25 +
      Math.pow(effH7 / 100, 2) * 49 +
      Math.pow(effH9 / 100, 2) * 81 +
      Math.pow(effH11 / 100, 2) * 121 +
      Math.pow(effH13 / 100, 2) * 169 +
      Math.pow(effH17 / 100, 2) * 289 +
      Math.pow(effH19 / 100, 2) * 361 +
      Math.pow(effH23 / 100, 2) * 529 +
      Math.pow(effH25 / 100, 2) * 625;

    // Recommended K-class: K-1, K-4, K-13, K-20, K-30
    let recommendedKClass = 'K-1';
    if (kFactorEffective > 20) recommendedKClass = 'K-30';
    else if (kFactorEffective > 13) recommendedKClass = 'K-20';
    else if (kFactorEffective > 4) recommendedKClass = 'K-13';
    else if (kFactorEffective > 1.5) recommendedKClass = 'K-4';

    // Transformer Derating Factor for standard K-1 transformer:
    // Derating = sqrt( (1 + Pec-r) / (1 + K * Pec-r) ) with Pec-r ~ 0.15 (eddy losses)
    const pecR = 0.15;
    const deratingFactor = Math.sqrt((1 + pecR) / (1 + kFactorEffective * pecR));
    const deratedKva = transformerRatedKva * deratingFactor;

    // Harmonic Current in Amperes needed to be injected by APF
    const harmonicCurrentToCancelA = fundamentalCurrentA * (rawThdCurrentPct / 100) * 1.15;

    return {
      rawThdCurrentPct: Number(rawThdCurrentPct.toFixed(2)),
      effectiveThdCurrentPct: Number(effectiveThdCurrentPct.toFixed(2)),
      rawThdVoltagePct: Number(rawThdVoltagePct.toFixed(2)),
      effectiveThdVoltagePct: Number(effectiveThdVoltagePct.toFixed(2)),
      rawIrmsA: Number(rawIrmsA.toFixed(1)),
      effectiveIrmsA: Number(effectiveIrmsA.toFixed(1)),
      isVoltageCompliant,
      isCurrentCompliant,
      kFactorRaw: Number(kFactorRaw.toFixed(2)),
      kFactorEffective: Number(kFactorEffective.toFixed(2)),
      recommendedKClass,
      deratingFactor: Number(deratingFactor.toFixed(3)),
      deratedKva: Number(deratedKva.toFixed(0)),
      harmonicCurrentToCancelA: Number(harmonicCurrentToCancelA.toFixed(1)),
      effSpectra: {
        h3: effH3,
        h5: effH5,
        h7: effH7,
        h9: effH9,
        h11: effH11,
        h13: effH13,
        h17: effH17,
        h19: effH19,
        h23: effH23,
        h25: effH25
      }
    };
  }, [
    fundamentalCurrentA,
    nominalVoltageV,
    shortCircuitPowerMva,
    h3Pct,
    h5Pct,
    h7Pct,
    h9Pct,
    h11Pct,
    h13Pct,
    h17Pct,
    h19Pct,
    h23Pct,
    h25Pct,
    isApfActive,
    apfCompensationGainPct,
    transformerRatedKva
  ]);

  // =========================================================================
  // CALCULATIONS ENGINE: VOLTAGE SAG & IMMUNITY CURVES (SEMI F47 / ITIC)
  // =========================================================================
  const sagAnalytics = useMemo(() => {
    const sagDepthPct = 100 - sagRetainedPct;

    // Check SEMI F47 compliance:
    // t < 20 ms -> up to 0% retained tolerated
    // 20 ms <= t <= 200 ms -> 50% retained tolerated
    // 200 ms < t <= 500 ms -> 70% retained tolerated
    // 500 ms < t <= 1000 ms -> 80% retained tolerated
    // t > 1000 ms -> continuous operation requires 90%
    let semiF47Pass = true;
    let semiLimitPct = 90;

    if (sagDurationMs <= 20) {
      semiLimitPct = 0;
      semiF47Pass = true;
    } else if (sagDurationMs <= 200) {
      semiLimitPct = 50;
      semiF47Pass = sagRetainedPct >= 50;
    } else if (sagDurationMs <= 500) {
      semiLimitPct = 70;
      semiF47Pass = sagRetainedPct >= 70;
    } else if (sagDurationMs <= 1000) {
      semiLimitPct = 80;
      semiF47Pass = sagRetainedPct >= 80;
    } else {
      semiLimitPct = 90;
      semiF47Pass = sagRetainedPct >= 90;
    }

    // ITIC (CBEMA) curve check
    // 20ms: 70%, 500ms: 80%, 10s: 90%
    let iticPass = true;
    if (sagDurationMs <= 20) iticPass = sagRetainedPct >= 40;
    else if (sagDurationMs <= 500) iticPass = sagRetainedPct >= 70;
    else iticPass = sagRetainedPct >= 80;

    // Trip risk severity
    let tripRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (!semiF47Pass && !iticPass) tripRiskLevel = 'CRITICAL';
    else if (!semiF47Pass) tripRiskLevel = 'HIGH';
    else if (sagRetainedPct < 85) tripRiskLevel = 'MODERATE';

    // Lost Energy Index (proportional to sag depth * duration)
    const lostEnergyIndex = Number(((sagDepthPct / 100) * (sagDurationMs / 1000)).toFixed(3));

    return {
      sagDepthPct,
      semiF47Pass,
      semiLimitPct,
      iticPass,
      tripRiskLevel,
      lostEnergyIndex
    };
  }, [sagRetainedPct, sagDurationMs]);

  // =========================================================================
  // CALCULATIONS ENGINE: DETUNED CAPACITOR BANK & RESONANCE (PILLAR 4)
  // =========================================================================
  const detunedAnalytics = useMemo(() => {
    // Tuning frequency: fr = f0 / sqrt(p/100)
    // For p = 7%: fr = 50 / sqrt(0.07) = 189 Hz (Rang 3.78)
    const resonanceFreqHz = 50 / Math.sqrt(detuningReactorPct / 100);
    const harmonicOrderResonance = Number((resonanceFreqHz / 50).toFixed(2));

    // Parallel resonance risk without reactor:
    // fp = f0 * sqrt(S_sc / Q_c)
    const sScKva = shortCircuitPowerMva * 1000;
    const rawParallelFreqHz = 50 * Math.sqrt(sScKva / Math.max(10, targetCapacitorKvar));
    const dangerousHarmonicOrder = Number((rawParallelFreqHz / 50).toFixed(1));

    // Does raw parallel frequency fall close to 5th (250 Hz) or 7th (350 Hz)?
    const isParallelResonanceDangerous =
      Math.abs(rawParallelFreqHz - 250) < 30 || Math.abs(rawParallelFreqHz - 350) < 30;

    // Overvoltage across capacitor due to detuning reactor:
    // Uc = Un / (1 - p) -> for p = 7%, Uc = 400 / 0.93 = 430 V
    const capacitorWorkingVoltageV = nominalVoltageV / (1 - detuningReactorPct / 100);
    const recommendedCapacitorRatingV = capacitorWorkingVoltageV > 415 ? 480 : 440;

    return {
      resonanceFreqHz: Number(resonanceFreqHz.toFixed(1)),
      harmonicOrderResonance,
      rawParallelFreqHz: Number(rawParallelFreqHz.toFixed(1)),
      dangerousHarmonicOrder,
      isParallelResonanceDangerous,
      capacitorWorkingVoltageV: Number(capacitorWorkingVoltageV.toFixed(1)),
      recommendedCapacitorRatingV
    };
  }, [detuningReactorPct, shortCircuitPowerMva, targetCapacitorKvar, nominalVoltageV]);

  // =========================================================================
  // CALCULATIONS ENGINE: FLICKER & UNBALANCE SEVERITY (PILLAR 5)
  // =========================================================================
  const flickerAnalytics = useMemo(() => {
    // EN 50160 & IEC 61000-4-15 limits: Pst <= 1.0, Plt <= 0.8
    const isPstCompliant = flickerPst <= 1.0;
    const isPltCompliant = flickerPlt <= 0.8;

    // Negative-sequence unbalance ratio u2 = V2 / V1 (limit <= 2.0%)
    const isUnbalanceCompliant = unbalancePct <= 2.0;

    // Additional motor rotor thermal stress factor:
    // Extra losses ~ 2 * (u2 / 100)^2 * P_nom
    const motorDeratingFactor = Math.max(0.75, 1 - 0.05 * Math.pow(unbalancePct, 1.8));

    return {
      isPstCompliant,
      isPltCompliant,
      isUnbalanceCompliant,
      motorDeratingPct: Number(((1 - motorDeratingFactor) * 100).toFixed(1))
    };
  }, [flickerPst, flickerPlt, unbalancePct]);

  return {
    // Navigation & Site
    activeStage,
    setActiveStage,
    selectedSiteKey,
    switchSiteProfile,
    activeProfile,

    // Base Grid Telemetry
    nominalVoltageV,
    setNominalVoltageV,
    fundamentalCurrentA,
    setFundamentalCurrentA,
    gridFrequencyHz,
    setGridFrequencyHz,
    shortCircuitPowerMva,
    setShortCircuitPowerMva,

    // Harmonic Spectrum
    h3Pct,
    setH3Pct,
    h5Pct,
    setH5Pct,
    h7Pct,
    setH7Pct,
    h9Pct,
    setH9Pct,
    h11Pct,
    setH11Pct,
    h13Pct,
    setH13Pct,
    h17Pct,
    setH17Pct,
    h19Pct,
    setH19Pct,
    h23Pct,
    setH23Pct,
    h25Pct,
    setH25Pct,

    // Sag Parameters
    sagRetainedPct,
    setSagRetainedPct,
    sagDurationMs,
    setSagDurationMs,

    // APF State
    isApfActive,
    setIsApfActive,
    apfCompensationGainPct,
    setApfCompensationGainPct,
    apfResponseTimeMicroSec,
    setApfResponseTimeMicroSec,

    // Detuned Bank
    targetCapacitorKvar,
    setTargetCapacitorKvar,
    detuningReactorPct,
    setDetuningReactorPct,
    isDetuningEnabled,
    setIsDetuningEnabled,

    // Flicker & Unbalance
    flickerPst,
    setFlickerPst,
    flickerPlt,
    setFlickerPlt,
    unbalancePct,
    setUnbalancePct,

    // Transformer
    transformerRatedKva,
    setTransformerRatedKva,

    // Reactive Analytics
    harmonicAnalytics,
    sagAnalytics,
    detunedAnalytics,
    flickerAnalytics
  };
};

export type PqProjectStoreType = ReturnType<typeof usePqProjectStore>;
