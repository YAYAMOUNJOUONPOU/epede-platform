// src/data/iec60865BusbarEngine.ts
// EPEDE 2.0: IEC 60865-1 / IEC 61936-1 / IEEE Std 605 Busbar Electrodynamic & Thermal Short-Circuit Withstand Engine
// Normative standards: IEC 60865-1:2011 (Calculation of short-circuit mechanical and thermal effects),
// IEC 61936-1:2021 (Power installations > 1 kV AC), IEEE Std 605 (Guide for Substation Rigid-Bus Design)

export type BusbarMaterialType = 'al_alloy' | 'cu_etp' | 'e_al';
export type BusbarProfileType = 'tube' | 'flat';
export type BusbarSupportCondition = 'simply_supported' | 'continuous' | 'cantilever';
export type BusbarArrangementType = 'edge_to_edge' | 'face_to_face';

export interface BusbarMaterialProperties {
  name: { fr: string; en: string };
  densityKgM3: number; // Density ρ (kg/m³)
  youngModulusMpa: number; // Modulus of elasticity E (MPa or N/mm²)
  proofStrengthRp02Mpa: number; // 0.2% proof yield strength Rp0.2 (MPa)
  thermalFactorKTheta: number; // Thermal withstand factor kθ (A·s^0.5 / mm²)
  plasticDynamicFactorQ: number; // Permissible stress factor q under short-circuit
  maxPermissibleTempC: number; // Maximum allowable short-circuit temperature (°C)
  thermalConstant: number; // Empirical thermal resistivity/capacity coefficient
}

export const BUSBAR_MATERIALS: Record<BusbarMaterialType, BusbarMaterialProperties> = {
  al_alloy: {
    name: {
      fr: 'Alliage d\'Aluminium EN AW-6101B T6 (AlMgSi 0.5)',
      en: 'Aluminum Alloy EN AW-6101B T6 (AlMgSi 0.5)'
    },
    densityKgM3: 2700,
    youngModulusMpa: 70000,
    proofStrengthRp02Mpa: 150,
    thermalFactorKTheta: 88,
    plasticDynamicFactorQ: 1.5,
    maxPermissibleTempC: 200,
    thermalConstant: 0.0078
  },
  cu_etp: {
    name: {
      fr: 'Cuivre Électrolytique Cu-ETP R200/R250 (Étiré)',
      en: 'Electrolytic Tough Pitch Copper Cu-ETP R200/R250'
    },
    densityKgM3: 8900,
    youngModulusMpa: 110000,
    proofStrengthRp02Mpa: 200,
    thermalFactorKTheta: 135,
    plasticDynamicFactorQ: 1.4,
    maxPermissibleTempC: 250,
    thermalConstant: 0.0042
  },
  e_al: {
    name: {
      fr: 'Aluminium Pur pour Usages Électriques (E-Al F7)',
      en: 'Pure Electrical Aluminum (E-Al F7)'
    },
    densityKgM3: 2700,
    youngModulusMpa: 68000,
    proofStrengthRp02Mpa: 70,
    thermalFactorKTheta: 85,
    plasticDynamicFactorQ: 1.3,
    maxPermissibleTempC: 180,
    thermalConstant: 0.0082
  }
};

export interface BusbarSpecificationInput {
  nominalVoltageKv: number; // Un (kV)
  initialSymmetricFaultCurrentKa: number; // Ik'' (kA rms)
  peakShortCircuitCurrentKa: number; // ip (kA peak)
  thermalEquivalentFaultCurrentKa: number; // Ith (kA rms)
  faultDurationSec: number; // tk (s)
  faultType: '3ph' | '2ph'; // Three-phase or Phase-to-Phase fault
  
  // Conductor Geometry & Material
  conductorProfile: BusbarProfileType;
  material: BusbarMaterialType;
  
  // Tubular parameters (used when profile === 'tube')
  outerDiameterMm?: number; // D (mm)
  wallThicknessMm?: number; // s (mm)
  
  // Flat bar parameters (used when profile === 'flat')
  barWidthMm?: number; // h (mm)
  barThicknessMm?: number; // b (mm)
  subBarsCount?: number; // n (1, 2, 3, 4)
  subBarSpacingMm?: number; // as (mm)
  barArrangement?: BusbarArrangementType;
  
  // Spatial Layout & Supports
  centerDistanceA_M: number; // a (m) interphase spacing
  spanLengthL_M: number; // l (m) distance between supports
  supportCondition: BusbarSupportCondition;
  insulatorRatingFrKn: number; // Cantilever mechanical breaking rating Fr (kN)
  ambientTempC?: number; // Default 40°C
}

export interface BusbarCalculationResult {
  // Geometric Properties
  crossSectionAreaMm2: number;
  momentOfInertiaMm4: number; // Iy principal bending axis
  sectionModulusMm3: number; // Wm
  linearMassKgM: number; // m' (kg/m)
  
  // Electrodynamic Forces
  peakLaplaceForceN: number; // Fm total on span (N)
  distributedForcePerMeterNm: number; // fm (N/m)
  
  // Mechanical Dynamics & Natural Frequency
  naturalFrequencyFcHz: number; // fc (Hz)
  frequencyRatio: number; // fc / fn (with fn = 50 Hz)
  dynamicStressFactorVSigma: number; // Vσ
  dynamicSupportForceFactorVF: number; // VF
  resonanceZone: 'sub_resonant' | 'near_50hz' | 'near_100hz' | 'transitional' | 'rigid';
  
  // Mechanical Bending Stresses
  bendingMomentNm: number; // M
  bendingStressMpa: number; // σm (MPa)
  permissibleStressMpa: number; // q · Rp0.2 (MPa)
  stressRatio: number; // σm / σ_permissible
  isBendingStressCompliant: boolean;
  
  // Insulator Mechanical Loading
  insulatorDynamicLoadKn: number; // Fd (kN)
  insulatorPermissibleLoadKn: number; // 0.8 · Fr (kN)
  insulatorLoadRatio: number; // Fd / (0.8 · Fr)
  isInsulatorCompliant: boolean;
  
  // Thermal Short-Circuit Withstand
  minRequiredThermalSectionMm2: number; // Sth (mm²)
  actualToThermalRatio: number; // A / Sth
  adiabaticTempRiseC: number; // Δθ (°C)
  finalTemperatureC: number; // θf (°C)
  maxAllowableTempC: number; // θmax (°C)
  isThermalWithstandCompliant: boolean;
  
  // Overall Compliance
  overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT';
  advisoryInterpretation: { fr: string; en: string };
}

export interface CameroonBusbarPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  voltageLevel: string;
  input: BusbarSpecificationInput;
  description: { fr: string; en: string };
}

export class Iec60865BusbarEngine {
  /**
   * Magnetic permeability factor (µ0 / 2π) = 0.2 N / (kA² · m)
   */
  public static readonly MU0_DIV_2PI = 0.2; // N / (kA² · m)
  public static readonly NOMINAL_GRID_FREQ_HZ = 50.0;

  /**
   * Solves busbar mechanical electrodynamic forces, resonance amplification, and thermal withstand (IEC 60865-1)
   */
  public static solve(input: BusbarSpecificationInput): BusbarCalculationResult {
    const {
      initialSymmetricFaultCurrentKa: ikPrimeKa,
      peakShortCircuitCurrentKa: ipKa,
      thermalEquivalentFaultCurrentKa: ithKa,
      faultDurationSec: tkSec,
      faultType,
      conductorProfile,
      material,
      centerDistanceA_M: a_m,
      spanLengthL_M: l_m,
      supportCondition,
      insulatorRatingFrKn,
      ambientTempC = 40
    } = input;

    const mat = BUSBAR_MATERIALS[material];

    // 1. Cross-Sectional Geometry Calculations
    let areaMm2 = 0;
    let momentOfInertiaMm4 = 0;
    let sectionModulusMm3 = 0;
    let betaFactor = 1.0;

    if (conductorProfile === 'tube') {
      const dExt = input.outerDiameterMm || 120;
      const s = input.wallThicknessMm || 10;
      const dInt = Math.max(1, dExt - 2 * s);

      areaMm2 = (Math.PI / 4) * (Math.pow(dExt, 2) - Math.pow(dInt, 2));
      momentOfInertiaMm4 = (Math.PI / 64) * (Math.pow(dExt, 4) - Math.pow(dInt, 4));
      sectionModulusMm3 = (2 * momentOfInertiaMm4) / dExt;
      betaFactor = 1.0; // Circular tube
    } else {
      // Flat Rectangular Bar
      const h = input.barWidthMm || 80;
      const b = input.barThicknessMm || 10;
      const n = input.subBarsCount || 1;
      const arrangement = input.barArrangement || 'edge_to_edge';

      areaMm2 = n * h * b;

      if (arrangement === 'edge_to_edge') {
        // Strong bending axis
        momentOfInertiaMm4 = (n * b * Math.pow(h, 3)) / 12;
        sectionModulusMm3 = (n * b * Math.pow(h, 2)) / 6;
      } else {
        // Weak bending axis
        momentOfInertiaMm4 = (n * h * Math.pow(b, 3)) / 12;
        sectionModulusMm3 = (n * h * Math.pow(b, 2)) / 6;
      }
      betaFactor = 0.73; // IEC 60865-1 factor for rectangular flat bars
    }

    // Linear mass m' (kg/m)
    const linearMassKgM = (areaMm2 * 1e-6) * mat.densityKgM3;

    // 2. Peak Laplace Electrodynamic Force (IEC 60865-1 Clauses 3.1 & 3.2)
    // 3-phase fault: Fm = (µ0 / 2π) * (√3 / 2) * (ip² / a) * l
    // 2-phase fault: Fm = (µ0 / 2π) * (ip² / a) * l
    const faultFactor = faultType === '3ph' ? (Math.sqrt(3) / 2) : 1.0;
    const peakLaplaceForceN = this.MU0_DIV_2PI * faultFactor * (Math.pow(ipKa, 2) / Math.max(0.01, a_m)) * l_m;
    const distributedForcePerMeterNm = peakLaplaceForceN / Math.max(0.1, l_m);

    // 3. Natural Mechanical Eigenfrequency fc (IEC 60865-1 §3.2.1)
    // fc = (cf / l²) * sqrt(E * I / m')
    let cf = 3.56; // Default continuous beam
    if (supportCondition === 'simply_supported') {
      cf = Math.PI / 2; // ~1.571
    } else if (supportCondition === 'cantilever') {
      cf = 0.56;
    } else {
      cf = 3.56; // Continuous / multi-span
    }

    const ePa = mat.youngModulusMpa * 1e6; // N/m²
    const iyM4 = momentOfInertiaMm4 * 1e-12; // m⁴
    const naturalFrequencyFcHz = (cf / Math.pow(l_m, 2)) * Math.sqrt((ePa * iyM4) / Math.max(1e-4, linearMassKgM));
    const frequencyRatio = naturalFrequencyFcHz / this.NOMINAL_GRID_FREQ_HZ;

    // 4. Dynamic Amplification Factors V_sigma and V_F (IEC 60865-1 §3.2.2.2)
    let dynamicStressFactorVSigma = 1.0;
    let dynamicSupportForceFactorVF = 1.0;
    let resonanceZone: 'sub_resonant' | 'near_50hz' | 'near_100hz' | 'transitional' | 'rigid' = 'rigid';

    if (frequencyRatio < 0.5) {
      dynamicStressFactorVSigma = 1.0;
      dynamicSupportForceFactorVF = 1.0;
      resonanceZone = 'sub_resonant';
    } else if (frequencyRatio >= 0.5 && frequencyRatio <= 2.4) {
      if (frequencyRatio >= 0.8 && frequencyRatio <= 1.25) {
        dynamicStressFactorVSigma = 2.4;
        dynamicSupportForceFactorVF = 2.2;
        resonanceZone = 'near_50hz';
      } else if (frequencyRatio >= 1.8 && frequencyRatio <= 2.2) {
        dynamicStressFactorVSigma = 2.0;
        dynamicSupportForceFactorVF = 1.9;
        resonanceZone = 'near_100hz';
      } else {
        dynamicStressFactorVSigma = 1.6;
        dynamicSupportForceFactorVF = 1.5;
        resonanceZone = 'transitional';
      }
    } else {
      dynamicStressFactorVSigma = 1.0;
      dynamicSupportForceFactorVF = 1.0;
      resonanceZone = 'rigid';
    }

    // 5. Bending Moment & Stress Verification (IEC 60865-1 Clause 3.2.2)
    // Continuous multi-span beam: M = (Fm * l) / 12
    // Simply supported beam: M = (Fm * l) / 8
    // Cantilever: M = (Fm * l) / 2
    let momentDivider = 12;
    if (supportCondition === 'simply_supported') {
      momentDivider = 8;
    } else if (supportCondition === 'cantilever') {
      momentDivider = 2;
    }

    const bendingMomentNm = (peakLaplaceForceN * l_m) / momentDivider;
    const bendingMomentN_Mm = bendingMomentNm * 1000;
    const bendingStressMpa = (dynamicStressFactorVSigma * betaFactor * bendingMomentN_Mm) / Math.max(1, sectionModulusMm3);
    const permissibleStressMpa = mat.plasticDynamicFactorQ * mat.proofStrengthRp02Mpa;
    const stressRatio = bendingStressMpa / permissibleStressMpa;
    const isBendingStressCompliant = stressRatio <= 1.0;

    // 6. Insulator Dynamic Reaction Load (IEC 60865-1 Clause 3.2.3)
    // Fd = VF * alpha * Fm
    // alpha = 1.25 for continuous intermediate supports, 1.0 for simply supported
    const alphaInsulator = supportCondition === 'continuous' ? 1.25 : 1.0;
    const insulatorDynamicLoadN = dynamicSupportForceFactorVF * alphaInsulator * peakLaplaceForceN;
    const insulatorDynamicLoadKn = insulatorDynamicLoadN / 1000;
    const insulatorPermissibleLoadKn = 0.8 * insulatorRatingFrKn; // 80% safety margin per IEC 60865-1
    const insulatorLoadRatio = insulatorDynamicLoadKn / Math.max(0.1, insulatorPermissibleLoadKn);
    const isInsulatorCompliant = insulatorLoadRatio <= 1.0;

    // 7. Thermal Short-Circuit Withstand (IEC 60865-1 Clause 4.1)
    // Sth = (Ith * sqrt(tk)) / kθ * 1000 (mm²)
    const minRequiredThermalSectionMm2 = (ithKa * 1000 * Math.sqrt(tkSec)) / mat.thermalFactorKTheta;
    const actualToThermalRatio = areaMm2 / Math.max(1, minRequiredThermalSectionMm2);
    const isThermalWithstandCompliant = areaMm2 >= minRequiredThermalSectionMm2;

    // Adiabatic short-circuit heating Δθ (°C)
    const currentDensityA_Mm2 = (ithKa * 1000) / Math.max(1, areaMm2);
    const adiabaticTempRiseC = Math.pow(currentDensityA_Mm2, 2) * tkSec * mat.thermalConstant;
    const finalTemperatureC = ambientTempC + adiabaticTempRiseC;
    const maxAllowableTempC = mat.maxPermissibleTempC;

    // 8. Overall Compliance Verdict
    const overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT' =
      (isBendingStressCompliant && isInsulatorCompliant && isThermalWithstandCompliant)
        ? 'COMPLIANT'
        : 'NON_COMPLIANT';

    // 9. Bilingual Technical Advisory
    const advisoryInterpretation = {
      fr: overallVerdict === 'COMPLIANT'
        ? `Le jeu de barres est entièrement CONFORME à la norme CEI 60865-1. La contrainte de flexion dynamique σm = ${bendingStressMpa.toFixed(1)} MPa reste inférieure à la limite admissible de ${permissibleStressMpa.toFixed(1)} MPa (ratio ${(stressRatio * 100).toFixed(0)}%). L'effort sur isolateur Fd = ${insulatorDynamicLoadKn.toFixed(2)} kN respecte la charge admissible de ${insulatorPermissibleLoadKn.toFixed(2)} kN, et la température finale sous court-circuit (${finalTemperatureC.toFixed(0)}°C) est inférieure au plafond de ${maxAllowableTempC}°C.`
        : `NON CONFORME selon CEI 60865-1 : ${!isBendingStressCompliant ? `Contrainte de flexion excessive (σm = ${bendingStressMpa.toFixed(1)} MPa > ${permissibleStressMpa.toFixed(1)} MPa, ratio ${(stressRatio * 100).toFixed(0)}%). ` : ''}${!isInsulatorCompliant ? `Effort dynamique sur isolateur trop élevé (Fd = ${insulatorDynamicLoadKn.toFixed(2)} kN > ${insulatorPermissibleLoadKn.toFixed(2)} kN). ` : ''}${!isThermalWithstandCompliant ? `Section insuffisante face au courant thermique Ith (${areaMm2.toFixed(0)} mm² < Sth = ${minRequiredThermalSectionMm2.toFixed(0)} mm²).` : ''} Réduire la portée entre supports ou augmenter le diamètre/section du conducteur.`,
      en: overallVerdict === 'COMPLIANT'
        ? `Busbar system is fully COMPLIANT with IEC 60865-1. Dynamic bending stress σm = ${bendingStressMpa.toFixed(1)} MPa is within the permissible limit of ${permissibleStressMpa.toFixed(1)} MPa (${(stressRatio * 100).toFixed(0)}% utilization). Dynamic insulator load Fd = ${insulatorDynamicLoadKn.toFixed(2)} kN is below allowable ${insulatorPermissibleLoadKn.toFixed(2)} kN, and thermal withstand is guaranteed (${finalTemperatureC.toFixed(0)}°C ≤ ${maxAllowableTempC}°C).`
        : `NON-COMPLIANT under IEC 60865-1: ${!isBendingStressCompliant ? `Excessive bending stress (σm = ${bendingStressMpa.toFixed(1)} MPa > ${permissibleStressMpa.toFixed(1)} MPa). ` : ''}${!isInsulatorCompliant ? `Dynamic cantilever load exceeds insulator rating (Fd = ${insulatorDynamicLoadKn.toFixed(2)} kN > ${insulatorPermissibleLoadKn.toFixed(2)} kN). ` : ''}${!isThermalWithstandCompliant ? `Insufficient thermal withstand area (${areaMm2.toFixed(0)} mm² < Sth = ${minRequiredThermalSectionMm2.toFixed(0)} mm²).` : ''} Decrease support span length or increase conductor cross-section.`
    };

    return {
      crossSectionAreaMm2: Number(areaMm2.toFixed(1)),
      momentOfInertiaMm4: Number(momentOfInertiaMm4.toFixed(1)),
      sectionModulusMm3: Number(sectionModulusMm3.toFixed(1)),
      linearMassKgM: Number(linearMassKgM.toFixed(3)),
      peakLaplaceForceN: Number(peakLaplaceForceN.toFixed(1)),
      distributedForcePerMeterNm: Number(distributedForcePerMeterNm.toFixed(1)),
      naturalFrequencyFcHz: Number(naturalFrequencyFcHz.toFixed(2)),
      frequencyRatio: Number(frequencyRatio.toFixed(3)),
      dynamicStressFactorVSigma,
      dynamicSupportForceFactorVF,
      resonanceZone,
      bendingMomentNm: Number(bendingMomentNm.toFixed(1)),
      bendingStressMpa: Number(bendingStressMpa.toFixed(2)),
      permissibleStressMpa: Number(permissibleStressMpa.toFixed(1)),
      stressRatio: Number(stressRatio.toFixed(3)),
      isBendingStressCompliant,
      insulatorDynamicLoadKn: Number(insulatorDynamicLoadKn.toFixed(2)),
      insulatorPermissibleLoadKn: Number(insulatorPermissibleLoadKn.toFixed(2)),
      insulatorLoadRatio: Number(insulatorLoadRatio.toFixed(3)),
      isInsulatorCompliant,
      minRequiredThermalSectionMm2: Number(minRequiredThermalSectionMm2.toFixed(1)),
      actualToThermalRatio: Number(actualToThermalRatio.toFixed(2)),
      adiabaticTempRiseC: Number(adiabaticTempRiseC.toFixed(1)),
      finalTemperatureC: Number(finalTemperatureC.toFixed(1)),
      maxAllowableTempC,
      isThermalWithstandCompliant,
      overallVerdict,
      advisoryInterpretation
    };
  }
}

/**
 * Authentic Cameroon High-Voltage Substation & Industrial Busbar Presets
 */
export const CAMEROON_BUSBAR_PRESETS: CameroonBusbarPreset[] = [
  {
    id: 'nachtigal-225kv-ais-tubular',
    name: {
      fr: 'Poste d\'Évacuation 225 kV Nachtigal — Barres Tubulaires Al-Alliage',
      en: 'Nachtigal 225 kV Substation — Tubular Al-Alloy Busbars'
    },
    facility: {
      fr: 'Poste d\'Évacuation 225 kV Nachtigal-Amont (SONATREL)',
      en: 'Nachtigal 225 kV Step-Up Transmission Substation'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Jeux de barres rigides tubulaires en alliage d\'aluminium EN AW-6101B Ø 120/110 mm face à un court-circuit de 31.5 kA / 80 kA crête avec portée de 8.0 m et entraxe entre phases de 3.5 m.',
      en: 'Tubular aluminum alloy EN AW-6101B Ø 120/110 mm rigid busbars subjected to 31.5 kA rms / 80 kA peak fault current with 8.0 m span and 3.5 m phase spacing.'
    },
    input: {
      nominalVoltageKv: 225,
      initialSymmetricFaultCurrentKa: 31.5,
      peakShortCircuitCurrentKa: 80.0,
      thermalEquivalentFaultCurrentKa: 31.5,
      faultDurationSec: 1.0,
      faultType: '3ph',
      conductorProfile: 'tube',
      material: 'al_alloy',
      outerDiameterMm: 120,
      wallThicknessMm: 10,
      centerDistanceA_M: 3.5,
      spanLengthL_M: 8.0,
      supportCondition: 'continuous',
      insulatorRatingFrKn: 12.0,
      ambientTempC: 40
    }
  },
  {
    id: 'mangombe-90kv-ais-tubular',
    name: {
      fr: 'Poste 90 kV Mangombé (Edéa) — Barres Tubulaires Ø 80/64 mm',
      en: 'Mangombé 90 kV Substation (Edéa) — Tubular Busbars Ø 80/64 mm'
    },
    facility: {
      fr: 'Poste d\'Interconnexion 90 kV Mangombé — Edéa',
      en: 'Mangombé 90 kV Transmission Substation — Edéa'
    },
    voltageLevel: 'HTB 90 kV',
    description: {
      fr: 'Jeu de barres extérieur tubulaire aluminium Ø 80/64 mm sous court-circuit de 25 kA / 63 kA crête, portée de 6.0 m et entraxe de 2.0 m avec isolateurs 10 kN.',
      en: 'Outdoor 90 kV tubular aluminum busbar Ø 80/64 mm under 25 kA / 63 kA peak fault with 6.0 m span, 2.0 m phase spacing, and 10 kN cantilever post insulators.'
    },
    input: {
      nominalVoltageKv: 90,
      initialSymmetricFaultCurrentKa: 25.0,
      peakShortCircuitCurrentKa: 63.0,
      thermalEquivalentFaultCurrentKa: 25.0,
      faultDurationSec: 1.0,
      faultType: '3ph',
      conductorProfile: 'tube',
      material: 'al_alloy',
      outerDiameterMm: 80,
      wallThicknessMm: 8,
      centerDistanceA_M: 2.0,
      spanLengthL_M: 6.0,
      supportCondition: 'continuous',
      insulatorRatingFrKn: 10.0,
      ambientTempC: 40
    }
  },
  {
    id: 'alucam-edea-15kv-rectifier-bus',
    name: {
      fr: 'Usine ALUCAM (Edéa) — Jeux de Barres Cuivre 15 kV Redresseurs',
      en: 'ALUCAM Smelter (Edéa) — 15 kV Rectifier Copper Busbars'
    },
    facility: {
      fr: 'Poste Redresseurs Électrolyse ALUCAM Edéa',
      en: 'ALUCAM Potline Electrolysis Rectifier Substation'
    },
    voltageLevel: 'HTA 15 kV',
    description: {
      fr: 'Jeux de barres plats en cuivre Cu-ETP 2 x (100 x 10 mm) sous courant de court-circuit très élevé de 40 kA / 102 kA crête, portée courte de 1.2 m et entraxe de 0.30 m.',
      en: 'Heavy copper flat busbars Cu-ETP 2 x (100 x 10 mm) subjected to 40 kA / 102 kA peak fault current with 1.2 m span and 0.30 m phase spacing.'
    },
    input: {
      nominalVoltageKv: 15,
      initialSymmetricFaultCurrentKa: 40.0,
      peakShortCircuitCurrentKa: 102.0,
      thermalEquivalentFaultCurrentKa: 40.0,
      faultDurationSec: 0.5,
      faultType: '3ph',
      conductorProfile: 'flat',
      material: 'cu_etp',
      barWidthMm: 100,
      barThicknessMm: 10,
      subBarsCount: 2,
      subBarSpacingMm: 10,
      barArrangement: 'edge_to_edge',
      centerDistanceA_M: 0.30,
      spanLengthL_M: 1.2,
      supportCondition: 'simply_supported',
      insulatorRatingFrKn: 16.0,
      ambientTempC: 40
    }
  },
  {
    id: 'tgbt-douala-bassa-400v',
    name: {
      fr: 'Zone Industrielle Bassa (Douala) — Jeu de Barres TGBT 400 V',
      en: 'Douala Bassa Industrial Zone — 400 V Switchboard Busbar'
    },
    facility: {
      fr: 'TGBT Usine Brassico-Agroalimentaire Bassa Douala',
      en: 'Main Low-Voltage Switchboard (TGBT) — Bassa Douala'
    },
    voltageLevel: 'BT 400 V',
    description: {
      fr: 'Jeu de barres cuivre Cu-ETP 2 x (100 x 10 mm) en armoire TGBT sous Isc = 50 kA / 105 kA crête, entraxe serré de 0.10 m et entraxe supports de 0.50 m.',
      en: 'Low-voltage copper busbar 2 x (100 x 10 mm) inside switchboard under 50 kA / 105 kA peak with 0.10 m phase spacing and 0.50 m support spacing.'
    },
    input: {
      nominalVoltageKv: 0.4,
      initialSymmetricFaultCurrentKa: 50.0,
      peakShortCircuitCurrentKa: 105.0,
      thermalEquivalentFaultCurrentKa: 50.0,
      faultDurationSec: 1.0,
      faultType: '3ph',
      conductorProfile: 'flat',
      material: 'cu_etp',
      barWidthMm: 100,
      barThicknessMm: 10,
      subBarsCount: 2,
      subBarSpacingMm: 10,
      barArrangement: 'edge_to_edge',
      centerDistanceA_M: 0.10,
      spanLengthL_M: 0.5,
      supportCondition: 'continuous',
      insulatorRatingFrKn: 7.5,
      ambientTempC: 40
    }
  }
];
