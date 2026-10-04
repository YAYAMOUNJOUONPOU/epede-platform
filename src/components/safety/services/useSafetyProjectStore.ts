// src/components/safety/services/useSafetyProjectStore.ts
// EPEDE Domain D16 - Central Reactive Project Store for Electrical Safety, Earthing & Lightning
// Calibrated to IEEE Std 80-2013, IEEE 1584-2018, IEC 62305, IEC 60099-4 & Cameroon High-Keraunic Sites

import { useState, useMemo } from 'react';

export type SafetySiteKey =
  | 'SUBSTATION_OYOMABANG_225KV'
  | 'HYDRO_NACHTIGAL_420MW'
  | 'INDUSTRIAL_CIMENCAM_PLANT'
  | 'URBAN_SUBSTATION_DOUALA_90KV';

export interface SafetySiteProfile {
  id: SafetySiteKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  soilResistivityOhmM: number;
  faultCurrentKa: number;
  faultClearingTimeSec: number;
  gridLengthX: number;
  gridWidthY: number;
  keraunicDaysPerYear: number;
  gridVoltageKv: number;
  targetResistanceOhm: number;
}

export const SAFETY_SITE_PROFILES: Record<SafetySiteKey, SafetySiteProfile> = {
  SUBSTATION_OYOMABANG_225KV: {
    id: 'SUBSTATION_OYOMABANG_225KV',
    nameFr: 'Poste d’Interconnexion HTB 225/90/15 kV d’Oyomabang (Yaoundé)',
    nameEn: 'Oyomabang 225/90/15 kV Grid Interconnection Substation (Yaoundé)',
    cameroonReference: 'Poste Névralgique SONATREL Oyomabang (Sol Latéritique Sévère)',
    soilResistivityOhmM: 1200,
    faultCurrentKa: 25.0,
    faultClearingTimeSec: 0.25,
    gridLengthX: 120,
    gridWidthY: 80,
    keraunicDaysPerYear: 145,
    gridVoltageKv: 225,
    targetResistanceOhm: 1.0
  },
  HYDRO_NACHTIGAL_420MW: {
    id: 'HYDRO_NACHTIGAL_420MW',
    nameFr: 'Centrale Hydroélectrique de Nachtigal (Aménagement 420 MW / Sanaga)',
    nameEn: 'Nachtigal 420 MW Hydro Power Station & Switchyard',
    cameroonReference: 'Poste d’Évacuation 225 kV Nachtigal (Substrat Rocheux Granitique)',
    soilResistivityOhmM: 850,
    faultCurrentKa: 31.5,
    faultClearingTimeSec: 0.20,
    gridLengthX: 150,
    gridWidthY: 90,
    keraunicDaysPerYear: 155,
    gridVoltageKv: 225,
    targetResistanceOhm: 0.8
  },
  INDUSTRIAL_CIMENCAM_PLANT: {
    id: 'INDUSTRIAL_CIMENCAM_PLANT',
    nameFr: 'Complexe Industriel & Broyeurs CIMENCAM (Nomayos & Figuil)',
    nameEn: 'CIMENCAM Cement Industrial Complex & Heavy Grinding Mills',
    cameroonReference: 'Sous-station Usine CIMENCAM (Sol Argilo-Calcaire & TGBT)',
    soilResistivityOhmM: 220,
    faultCurrentKa: 20.0,
    faultClearingTimeSec: 0.15,
    gridLengthX: 70,
    gridWidthY: 50,
    keraunicDaysPerYear: 120,
    gridVoltageKv: 20,
    targetResistanceOhm: 1.5
  },
  URBAN_SUBSTATION_DOUALA_90KV: {
    id: 'URBAN_SUBSTATION_DOUALA_90KV',
    nameFr: 'Poste Urbain Compact 90/15 kV de Koumassi (Douala Littoral)',
    nameEn: 'Koumassi 90/15 kV Urban Compact Substation (Douala Coastal)',
    cameroonReference: 'Poste Haute Densité Eneo Douala (Sol Alluvionnaire Humide & Espace Restreint)',
    soilResistivityOhmM: 95,
    faultCurrentKa: 16.0,
    faultClearingTimeSec: 0.30,
    gridLengthX: 50,
    gridWidthY: 35,
    keraunicDaysPerYear: 160,
    gridVoltageKv: 90,
    targetResistanceOhm: 1.0
  }
};

export interface SafetyCalculations {
  groundResistanceRg: number;
  gprVolts: number;
  tolerableTouchVolts: number;
  tolerableStepVolts: number;
  meshVoltageVolts: number;
  stepVoltageVolts: number;
  isTouchSafe: boolean;
  isStepSafe: boolean;
  isOverallGridSafe: boolean;
  arcIncidentEnergyCalCm2: number;
  arcFlashBoundaryMm: number;
  arcPpeCategory: string;
  expectedLightningStrikesPerYear: number;
  surgeArresterUrKv: number;
  protectiveMarginPercent: number;
  isArresterMarginSafe: boolean;
  totalEstimatedCapExFcfa: number;
  totalEstimatedCapExEur: number;
}

export interface SafetyStoreState {
  activeStage: 1 | 2 | 3 | 4 | 5;
  setActiveStage: (st: 1 | 2 | 3 | 4 | 5) => void;
  selectedSiteId: SafetySiteKey;
  setSelectedSiteId: (id: SafetySiteKey) => void;
  activeSiteProfile: SafetySiteProfile;

  // Key system configuration states
  soilResistivity: number;
  setSoilResistivity: (rho: number) => void;
  faultCurrentKa: number;
  setFaultCurrentKa: (ka: number) => void;
  faultClearingTimeSec: number;
  setFaultClearingTimeSec: (ts: number) => void;
  gridLengthX: number;
  setGridLengthX: (x: number) => void;
  gridWidthY: number;
  setGridWidthY: (y: number) => void;
  bodyWeight: '50kg' | '70kg';
  setBodyWeight: (bw: '50kg' | '70kg') => void;

  calculations: SafetyCalculations;
}

export function useSafetyProjectStore(initialSite: SafetySiteKey = 'SUBSTATION_OYOMABANG_225KV'): SafetyStoreState {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedSiteId, setSelectedSiteId] = useState<SafetySiteKey>(initialSite);

  const activeSiteProfile = useMemo(() => {
    return SAFETY_SITE_PROFILES[selectedSiteId] || SAFETY_SITE_PROFILES.SUBSTATION_OYOMABANG_225KV;
  }, [selectedSiteId]);

  // Controllable quantities initialized from profile
  const [soilResistivity, setSoilResistivity] = useState<number>(activeSiteProfile.soilResistivityOhmM);
  const [faultCurrentKa, setFaultCurrentKa] = useState<number>(activeSiteProfile.faultCurrentKa);
  const [faultClearingTimeSec, setFaultClearingTimeSec] = useState<number>(activeSiteProfile.faultClearingTimeSec);
  const [gridLengthX, setGridLengthX] = useState<number>(activeSiteProfile.gridLengthX);
  const [gridWidthY, setGridWidthY] = useState<number>(activeSiteProfile.gridWidthY);
  const [bodyWeight, setBodyWeight] = useState<'50kg' | '70kg'>('50kg');

  // Sync profile when site changes
  const handleSelectSite = (id: SafetySiteKey) => {
    setSelectedSiteId(id);
    const prof = SAFETY_SITE_PROFILES[id];
    if (prof) {
      setSoilResistivity(prof.soilResistivityOhmM);
      setFaultCurrentKa(prof.faultCurrentKa);
      setFaultClearingTimeSec(prof.faultClearingTimeSec);
      setGridLengthX(prof.gridLengthX);
      setGridWidthY(prof.gridWidthY);
    }
  };

  // Comprehensive Engineering Calculations
  const calculations: SafetyCalculations = useMemo(() => {
    // 1. IEEE 80-2013 Analytical Ground Grid Sizing (Sverak equation)
    const surfaceResistivity = 3000; // Crushed rock wet ohm-m
    const surfaceThickness = 0.15; // 15 cm
    const gridDepth = 0.6; // 60 cm burial depth
    const areaA = gridLengthX * gridWidthY;

    // Conductor counts (approx 8m grid mesh)
    const conductorsX = Math.max(4, Math.round(gridLengthX / 10) + 1);
    const conductorsY = Math.max(4, Math.round(gridWidthY / 10) + 1);
    const groundRodsCount = Math.max(8, Math.round((conductorsX + conductorsY) * 1.2));
    const rodLength = 3.0; // 3m standard copper-clad steel rod

    const horizontalLengthLc = conductorsX * gridWidthY + conductorsY * gridLengthX;
    const verticalLengthLr = groundRodsCount * rodLength;
    const totalLengthLt = horizontalLengthLc + verticalLengthLr;

    // Derating factor Cs
    const Cs = Math.max(0.6, Math.min(1.0, 1 - (0.09 * (1 - soilResistivity / surfaceResistivity)) / (2 * surfaceThickness + 0.09)));

    // Tolerable touch and step voltages
    const factorK = bodyWeight === '50kg' ? 0.116 : 0.157;
    const tolerableTouchVolts = Math.round(((1000 + 1.5 * Cs * surfaceResistivity) * factorK) / Math.sqrt(faultClearingTimeSec));
    const tolerableStepVolts = Math.round(((1000 + 6.0 * Cs * surfaceResistivity) * factorK) / Math.sqrt(faultClearingTimeSec));

    // Sverak formula for ground grid resistance Rg:
    const term1 = 1 / Math.max(1, totalLengthLt);
    const term2 = 1 / Math.sqrt(20 * areaA);
    const term3 = 1 + 1 / (1 + gridDepth * Math.sqrt(20 / areaA));
    const groundResistanceRg = Number((soilResistivity * (term1 + term2 * term3)).toFixed(2));

    // Grid current Ig (with split factor Sf = 0.65)
    const splitFactorSf = 0.65;
    const gridCurrentIg = faultCurrentKa * 1000 * splitFactorSf;
    const gprVolts = Math.round(gridCurrentIg * groundResistanceRg);

    // Mesh and Step voltages
    const D = Math.sqrt(areaA / Math.max(1, (conductorsX - 1) * (conductorsY - 1)));
    const n = Math.sqrt(conductorsX * conductorsY);
    const K_h = Math.sqrt(1 + gridDepth / 1.0);
    const Km = (1 / (2 * Math.PI)) * (
      Math.log((D * D) / (16 * gridDepth * 0.012)) +
      (1 / K_h) * Math.log(8 / (Math.PI * (2 * n - 1)))
    );
    const Ki = 0.644 + 0.148 * n;
    const Lm = horizontalLengthLc + (1.55 + 1.22 * (rodLength / Math.sqrt(gridLengthX * gridLengthX + gridWidthY * gridWidthY))) * verticalLengthLr;
    const meshVoltageVolts = Math.round((soilResistivity * Km * Ki * gridCurrentIg) / Math.max(10, Lm));

    const Ks = (1 / Math.PI) * (1 / (2 * gridDepth) + 1 / (D + gridDepth) + (1 / D) * (1 - Math.pow(0.5, n - 2)));
    const Ls = 0.75 * horizontalLengthLc + 0.85 * verticalLengthLr;
    const stepVoltageVolts = Math.round((soilResistivity * Ks * Ki * gridCurrentIg) / Math.max(10, Ls));

    const isTouchSafe = meshVoltageVolts <= tolerableTouchVolts;
    const isStepSafe = stepVoltageVolts <= tolerableStepVolts;
    const isOverallGridSafe = isTouchSafe && isStepSafe;

    // 2. IEEE 1584-2018 Arc Flash Hazard
    const workingDistanceMm = 457; // 18 inches
    const logIarc = 0.00402 + 0.983 * Math.log10(faultCurrentKa) + 0.08;
    const Iarc = Math.pow(10, logIarc);
    const baseEnergy = (4.184 * 0.55 * Math.pow(Iarc / 20, 1.2) * (faultClearingTimeSec / 0.1) * 1.25) / 4.184;
    const distCorr = Math.pow(610 / workingDistanceMm, 1.47);
    const arcIncidentEnergyCalCm2 = Number((baseEnergy * distCorr).toFixed(1));
    const arcFlashBoundaryMm = Math.round(610 * Math.pow(Math.max(0.1, arcIncidentEnergyCalCm2) / 1.2, 1 / 1.47));

    let arcPpeCategory = 'Cat 2 (8 cal/cm²)';
    if (arcIncidentEnergyCalCm2 <= 4) arcPpeCategory = 'Cat 1 (4 cal/cm²)';
    else if (arcIncidentEnergyCalCm2 <= 8) arcPpeCategory = 'Cat 2 (8 cal/cm²)';
    else if (arcIncidentEnergyCalCm2 <= 25) arcPpeCategory = 'Cat 3 (25 cal/cm²)';
    else if (arcIncidentEnergyCalCm2 <= 40) arcPpeCategory = 'Cat 4 (40 cal/cm²)';
    else arcPpeCategory = 'DANGER EXTRÊME (> 40 cal/cm²)';

    // 3. Lightning Protection IEC 62305 & Density
    const flashDensityNg = Number((0.04 * Math.pow(activeSiteProfile.keraunicDaysPerYear, 1.25)).toFixed(2));
    const collectionAreaKm2 = (areaA + 2 * (gridLengthX + gridWidthY) * 3 * 24) / 1_000_000;
    const expectedLightningStrikesPerYear = Number((collectionAreaKm2 * flashDensityNg).toFixed(3));

    // 4. Surge Arrester Sizing IEC 60099-4
    const UsMax = activeSiteProfile.gridVoltageKv * 1.15;
    const minUc = UsMax / Math.sqrt(3);
    const Utov = 1.4 * minUc;
    const surgeArresterUrKv = Math.max(Math.round(minUc * 1.25), Math.round(Utov / 1.15));
    const Upl = Math.round(surgeArresterUrKv * 2.45);
    const transformerBil = activeSiteProfile.gridVoltageKv === 225 ? 1050 : activeSiteProfile.gridVoltageKv === 90 ? 450 : 170;
    const protectiveMarginPercent = Number((((transformerBil - Upl) / Upl) * 100).toFixed(1));
    const isArresterMarginSafe = protectiveMarginPercent >= 20.0;

    // 5. CapEx in Cameroon (FCFA / EUR)
    // Copper conductor + rods + exothermic welds + crushed rock + surge arresters + testing
    const copperCostFcfa = totalLengthLt * 18_500;
    const rodsCostFcfa = groundRodsCount * 35_000;
    const weldsCostFcfa = (conductorsX * conductorsY) * 14_000;
    const rockCostFcfa = (areaA * 0.15) * 28_000; // 28k FCFA / m3 of crushed rock
    const arrestersCostFcfa = activeSiteProfile.gridVoltageKv === 225 ? 24_000_000 : 12_000_000;
    const testingCostFcfa = 8_000_000;

    const subTotalFcfa = copperCostFcfa + rodsCostFcfa + weldsCostFcfa + rockCostFcfa + arrestersCostFcfa + testingCostFcfa;
    const totalEstimatedCapExFcfa = Math.round(subTotalFcfa * 1.15); // 15% contingencies & installation
    const totalEstimatedCapExEur = Math.round(totalEstimatedCapExFcfa / 655.957);

    return {
      groundResistanceRg,
      gprVolts,
      tolerableTouchVolts,
      tolerableStepVolts,
      meshVoltageVolts,
      stepVoltageVolts,
      isTouchSafe,
      isStepSafe,
      isOverallGridSafe,
      arcIncidentEnergyCalCm2,
      arcFlashBoundaryMm,
      arcPpeCategory,
      expectedLightningStrikesPerYear,
      surgeArresterUrKv,
      protectiveMarginPercent,
      isArresterMarginSafe,
      totalEstimatedCapExFcfa,
      totalEstimatedCapExEur
    };
  }, [
    soilResistivity,
    faultCurrentKa,
    faultClearingTimeSec,
    gridLengthX,
    gridWidthY,
    bodyWeight,
    activeSiteProfile
  ]);

  return {
    activeStage,
    setActiveStage,
    selectedSiteId,
    setSelectedSiteId: handleSelectSite,
    activeSiteProfile,
    soilResistivity,
    setSoilResistivity,
    faultCurrentKa,
    setFaultCurrentKa,
    faultClearingTimeSec,
    setFaultClearingTimeSec,
    gridLengthX,
    setGridLengthX,
    gridWidthY,
    setGridWidthY,
    bodyWeight,
    setBodyWeight,
    calculations
  };
}
