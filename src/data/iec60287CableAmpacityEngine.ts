// src/data/iec60287CableAmpacityEngine.ts
// EPEDE 2.0: IEC 60287 / IEC 60853 Advanced Cable Ampacity & 2D Trench Soil Heatmap Engine
// Normative standards: IEC 60287-1-1, IEC 60287-2-1, IEC 60853-1, IEC 60949, NF C 15-105
// Physics: Neher-McGrath thermal ladder network, Kennelly image superposition for 2D soil isotherm mesh,
// skin & proximity AC resistance derating, dielectric & sheath losses, and cyclic load rating factor M.

export type ConductorMetal = 'copper' | 'aluminium';
export type InsulationMaterial = 'xlpe_90' | 'epr_90' | 'pvc_70';
export type TrenchCableArrangement = 'trefoil' | 'flat_touching' | 'flat_spaced' | 'two_circuits_spaced';

export interface CableConstructionInput {
  voltageKv: number; // e.g., 0.4, 15, 20, 30, 90, 225 kV
  conductorMaterial: ConductorMetal;
  crossSectionMm2: number; // e.g. 95, 150, 185, 240, 300, 400, 500, 630
  insulationType: InsulationMaterial;
  insulationThicknessMm?: number;
  sheathThicknessMm?: number;
  hasMetallicScreen: boolean;
  hasArmour: boolean;
  operatingFrequencyHz: 50 | 60;
}

export interface TrenchEnvironmentInput {
  arrangement: TrenchCableArrangement;
  axialSpacingMm: number; // Center-to-center spacing s (e.g. 100 to 400 mm)
  burialDepthM: number; // Depth to center of cable group L (e.g. 0.8 to 1.5 m)
  soilThermalResistivityKmPerW: number; // rho_s: 0.8 (wet), 1.0 (moist), 1.5 (standard), 2.2 (dry Sahel/sand)
  ambientGroundTempC: number; // theta_a: 25 to 35°C in tropical environments
  cyclicLoadFactorMu: number; // Daily loss load factor mu (0.5 to 1.0; 1.0 = 100% steady continuous load)
  phaseNumber: 3;
}

export interface CableThermalNode {
  xM: number; // horizontal coordinate relative to trench center (m)
  yM: number; // depth below ground surface (m, positive downwards)
  cableIndex: number;
  phaseId: string;
  circuitId: number;
  conductorTempC: number;
  heatLossWPerM: number;
}

export interface TrenchSoilGridPoint {
  xM: number;
  yM: number;
  tempC: number;
}

export interface Iec60287AmpacityOutput {
  // Conductor AC Resistance & Loss Metrics
  rDcAt20COhmPerKm: number;
  rDcAtMaxTempOhmPerKm: number;
  skinEffectFactorYs: number;
  proximityEffectFactorYp: number;
  rAcOhmPerKm: number;
  dielectricLossWPerM: number;
  sheathLossRatioLambda1: number;
  armourLossRatioLambda2: number;

  // Thermal Resistances (K·m/W)
  t1_insulation: number;
  t2_bedding: number;
  t3_outerSheath: number;
  t4_externalSoilSelf: number;
  t4_mutualProximity: number;
  t4_totalSurrounding: number;
  totalThermalResistanceRth: number;

  // Ampacity Ratings (Amperes)
  continuousAmpacityA: number;
  cyclicAmpacityA: number;
  cyclicBoostFactorM: number;
  maxContinuousTempC: number;
  conductorOperatingTempC: number;
  outerSheathTempC: number;

  // Short-Circuit Adiabatic Withstand (IEC 60949)
  shortCircuitAdiabaticConstantK: number;
  oneSecondShortCircuitKa: number;

  // Geometry & 2D Temperature Field
  cableExternalDiameterMm: number;
  cables: CableThermalNode[];
  heatmapGrid: TrenchSoilGridPoint[][]; // 2D grid matrix
  heatmapBounds: { minX: number; maxX: number; minY: number; maxY: number };
  maxSoilTempInTrenchC: number;
  surfaceGroundMaxTempC: number;

  // Diagnostic & Advisory Warnings
  isSafeOperation: boolean;
  soilDryingRisk: boolean; // Flagged when soil interface exceeds 50°C
  advisoryNotes: { fr: string; en: string }[];
}

export interface CameroonCablePreset {
  id: string;
  name: { fr: string; en: string };
  location: { fr: string; en: string };
  cable: CableConstructionInput;
  trench: TrenchEnvironmentInput;
  description: { fr: string; en: string };
}

export class Iec60287CableAmpacityEngine {
  /**
   * Reference conductor DC resistivity at 20°C in Ohm·mm²/m (IEC 60228)
   */
  public static readonly RHO_20_CU = 0.017241;
  public static readonly RHO_20_AL = 0.028264;
  public static readonly ALPHA_20_CU = 0.00393;
  public static readonly ALPHA_20_AL = 0.00403;

  /**
   * Thermal resistivity of insulation materials in K·m/W (IEC 60287-2-1 Table 1)
   */
  public static readonly RHO_THERMAL_XLPE = 3.5;
  public static readonly RHO_THERMAL_EPR = 3.5;
  public static readonly RHO_THERMAL_PVC = 6.0;
  public static readonly RHO_THERMAL_SHEATH_PE = 3.5;

  /**
   * Standard conductor diameter approximation dc = 2 * sqrt(S / (pi * compactionFactor))
   */
  public static estimateConductorDiameterMm(crossSectionMm2: number): number {
    const compactionFactor = 0.88; // stranded compact conductor
    return Math.sqrt((4 * crossSectionMm2) / (Math.PI * compactionFactor));
  }

  /**
   * Standard insulation radial thickness based on voltage class (IEC 60502-1, IEC 60502-2, IEC 60840)
   */
  public static getStandardInsulationThicknessMm(voltageKv: number, crossSectionMm2: number): number {
    if (voltageKv <= 1.0) {
      if (crossSectionMm2 <= 16) return 1.0;
      if (crossSectionMm2 <= 70) return 1.4;
      if (crossSectionMm2 <= 185) return 2.0;
      return 2.4;
    }
    if (voltageKv <= 15) return 4.5;
    if (voltageKv <= 20) return 5.5;
    if (voltageKv <= 36) return 8.0;
    if (voltageKv <= 90) return 14.0;
    return 21.0; // 225 kV
  }

  /**
   * Comprehensive IEC 60287 & IEC 60853 solver
   */
  public static solve(
    cableInput: CableConstructionInput,
    trenchInput: TrenchEnvironmentInput,
    operatingCurrentA?: number
  ): Iec60287AmpacityOutput {
    const {
      voltageKv,
      conductorMaterial,
      crossSectionMm2,
      insulationType,
      hasMetallicScreen,
      hasArmour,
      operatingFrequencyHz
    } = cableInput;

    const {
      arrangement,
      axialSpacingMm,
      burialDepthM,
      soilThermalResistivityKmPerW,
      ambientGroundTempC,
      cyclicLoadFactorMu
    } = trenchInput;

    // 1. Thermal and electrical limits
    const maxContinuousTempC = insulationType === 'pvc_70' ? 70 : 90;
    const deltaTheta = maxContinuousTempC - ambientGroundTempC;

    // Conductor diameter and dimensions
    const dcMm = Iec60287CableAmpacityEngine.estimateConductorDiameterMm(crossSectionMm2);
    const tInsMm = cableInput.insulationThicknessMm || Iec60287CableAmpacityEngine.getStandardInsulationThicknessMm(voltageKv, crossSectionMm2);
    const dOverInsMm = dcMm + 2 * tInsMm;
    const tSheathMm = cableInput.sheathThicknessMm || (voltageKv >= 15 ? 2.5 : 1.8);
    const deExtMm = dOverInsMm + (hasMetallicScreen ? 1.0 : 0) + (hasArmour ? 2.5 : 0) + 2 * tSheathMm;
    const deExtM = deExtMm / 1000;

    // 2. Conductor DC and AC Resistance (IEC 60287-1-1 Section 2)
    const rho20 = conductorMaterial === 'copper' ? this.RHO_20_CU : this.RHO_20_AL;
    const alpha20 = conductorMaterial === 'copper' ? this.ALPHA_20_CU : this.ALPHA_20_AL;
    
    // R_dc at 20°C (Ohm/km)
    const rDc20OhmPerKm = (rho20 * 1000) / crossSectionMm2;
    // R_dc at max continuous temperature
    const rDcMaxOhmPerKm = rDc20OhmPerKm * (1 + alpha20 * (maxContinuousTempC - 20));

    // Skin effect factor ys (IEC 60287-1-1 Eq. 3)
    const ks = 1.0; // round stranded conductor
    const xsSquared = (8 * Math.PI * operatingFrequencyHz * 1e-4 * ks) / (rDcMaxOhmPerKm);
    const ys = xsSquared <= 2.8 
      ? (xsSquared * xsSquared) / 192 
      : (xsSquared * xsSquared) / (192 + 0.8 * xsSquared * xsSquared);

    // Proximity effect factor yp (IEC 60287-1-1 Eq. 6)
    const kp = 0.8;
    const sMm = Math.max(axialSpacingMm, deExtMm);
    const xpSquared = (8 * Math.PI * operatingFrequencyHz * 1e-4 * kp) / (rDcMaxOhmPerKm);
    const yp = (xpSquared * xpSquared) / (192 + 0.8 * xpSquared * xpSquared) * Math.pow(dcMm / sMm, 2) * (sMm > 0 ? 1 : 0);

    // AC Resistance R_ac at max operating temperature (Ohm/km and Ohm/m)
    const rAcOhmPerKm = rDcMaxOhmPerKm * (1 + ys + yp);
    const rAcOhmPerM = rAcOhmPerKm / 1000;

    // 3. Dielectric Losses W_d in W/m (IEC 60287-1-1 Section 2.2)
    let dielectricLossWPerM = 0;
    if (voltageKv >= 15) {
      const u0V = (voltageKv * 1000) / Math.sqrt(3);
      const epsR = insulationType === 'xlpe_90' ? 2.5 : insulationType === 'epr_90' ? 3.0 : 4.0;
      const tanDelta = insulationType === 'xlpe_90' ? 0.0004 : insulationType === 'epr_90' ? 0.005 : 0.05;
      // Capacitance C = 2*pi*eps_0*eps_r / ln(Di / dc) in F/m
      const eps0 = 8.854e-12;
      const capFPerM = (2 * Math.PI * eps0 * epsR) / Math.log(dOverInsMm / dcMm);
      dielectricLossWPerM = 2 * Math.PI * operatingFrequencyHz * capFPerM * Math.pow(u0V, 2) * tanDelta;
    }

    // 4. Sheath and Armour Loss Factors lambda1 & lambda2 (IEC 60287-1-1 Section 2.3)
    let sheathLossRatioLambda1 = 0;
    let armourLossRatioLambda2 = 0;
    if (hasMetallicScreen && voltageKv >= 15) {
      // Circulating and eddy current losses in sheath for single core cables
      const dSheathMeanMm = dOverInsMm + tSheathMm;
      const rsSheathOhmPerM = 0.00035; // typical lead or copper tape sheath
      const xSheathOhmPerM = 2 * Math.PI * operatingFrequencyHz * 2e-7 * Math.log((2 * sMm) / dSheathMeanMm);
      sheathLossRatioLambda1 = (rsSheathOhmPerM / rAcOhmPerM) * (Math.pow(xSheathOhmPerM, 2) / (Math.pow(rsSheathOhmPerM, 2) + Math.pow(xSheathOhmPerM, 2)));
      sheathLossRatioLambda1 = Math.min(0.25, Math.max(0.02, sheathLossRatioLambda1));
    }
    if (hasArmour) {
      armourLossRatioLambda2 = 0.05;
    }

    // 5. Thermal Resistances of Cable Internals (IEC 60287-2-1)
    const rhoIns = insulationType === 'pvc_70' ? this.RHO_THERMAL_PVC : this.RHO_THERMAL_XLPE;
    // T1: Insulation thermal resistance
    const t1_insulation = (rhoIns / (2 * Math.PI)) * Math.log(dOverInsMm / dcMm);

    // T2: Bedding
    const t2_bedding = hasArmour ? 0.03 : 0.0;

    // T3: Outer Sheath
    const rhoSheath = this.RHO_THERMAL_SHEATH_PE;
    const t3_outerSheath = (rhoSheath / (2 * Math.PI)) * Math.log(deExtMm / (dOverInsMm + (hasArmour ? 2.5 : 0)));

    // 6. External Surrounding Thermal Resistance T4 (Kennelly Method, IEC 60287-2-1 Eq. 17)
    const uSelf = (2 * burialDepthM) / deExtM;
    const t4_externalSoilSelf = (soilThermalResistivityKmPerW / (2 * Math.PI)) * Math.log(uSelf + Math.sqrt(Math.max(1, uSelf * uSelf - 1)));

    // Mutual thermal interference factor for grouped conductors
    let mutualFactor = 0;
    let numberOfLoadedConductorsN = 3;

    if (arrangement === 'trefoil') {
      numberOfLoadedConductorsN = 3;
      // Trefoil proximity ratio (IEC 60287-2-1 Table 3)
      const uMutual = (2 * burialDepthM) / (deExtM * 1.15);
      mutualFactor = (soilThermalResistivityKmPerW / (2 * Math.PI)) * 2 * Math.log(uMutual);
    } else if (arrangement === 'flat_touching' || arrangement === 'flat_spaced') {
      numberOfLoadedConductorsN = 3;
      const sM = sMm / 1000;
      const d12 = sM;
      const d13 = 2 * sM;
      const d12_prime = Math.sqrt(Math.pow(2 * burialDepthM, 2) + Math.pow(d12, 2));
      const d13_prime = Math.sqrt(Math.pow(2 * burialDepthM, 2) + Math.pow(d13, 2));
      mutualFactor = (soilThermalResistivityKmPerW / (2 * Math.PI)) * (Math.log(d12_prime / d12) + Math.log(d13_prime / d13));
    } else {
      // two_circuits_spaced (6 conductors)
      numberOfLoadedConductorsN = 6;
      const sM = sMm / 1000;
      const dPrime = Math.sqrt(Math.pow(2 * burialDepthM, 2) + Math.pow(sM, 2));
      mutualFactor = (soilThermalResistivityKmPerW / (2 * Math.PI)) * 2 * Math.log(dPrime / sM);
    }

    const t4_mutualProximity = Math.max(0, mutualFactor / numberOfLoadedConductorsN);
    const t4_totalSurrounding = t4_externalSoilSelf + t4_mutualProximity;

    const totalThermalResistanceRth = t1_insulation + (1 + sheathLossRatioLambda1) * t2_bedding + (1 + sheathLossRatioLambda1 + armourLossRatioLambda2) * (t3_outerSheath + t4_totalSurrounding);

    // 7. Permissible Continuous Current I_continuous (IEC 60287-1-1 Eq. 1)
    // For single-core cables installed in trefoil, flat, or grouped formation, n = 1 conductor per cable
    // Mutual heating from adjacent cables is accounted for in T4_mutual
    const nConductorsInCable = 1;
    const numerator = deltaTheta - dielectricLossWPerM * (0.5 * t1_insulation + nConductorsInCable * (t2_bedding + t3_outerSheath + t4_totalSurrounding));
    const denominator = rAcOhmPerM * (t1_insulation + nConductorsInCable * (1 + sheathLossRatioLambda1) * t2_bedding + nConductorsInCable * (1 + sheathLossRatioLambda1 + armourLossRatioLambda2) * (t3_outerSheath + t4_totalSurrounding));

    const continuousAmpacityA = numerator > 0 && denominator > 0
      ? Math.sqrt(numerator / denominator)
      : 0;

    // 8. Cyclic Rating Factor M (IEC 60853-1 Section 3)
    // Daily cyclic boost factor M = 1 / sqrt(mu + (1 - mu) * (T_int / T_ext))
    // Typically M ranges from 1.05 to 1.25 for industrial duty cycles (mu = 0.65 to 0.85)
    const internalRatio = (t1_insulation + t2_bedding + t3_outerSheath) / totalThermalResistanceRth;
    const cyclicBoostFactorM = cyclicLoadFactorMu < 1.0
      ? 1 / Math.sqrt(cyclicLoadFactorMu + (1 - cyclicLoadFactorMu) * internalRatio)
      : 1.0;
    const cyclicAmpacityA = continuousAmpacityA * cyclicBoostFactorM;

    // 9. Short-Circuit Adiabatic Withstand (IEC 60949)
    let kAdiabatic = 143; // Cu / XLPE
    if (conductorMaterial === 'copper' && insulationType === 'pvc_70') kAdiabatic = 115;
    if (conductorMaterial === 'aluminium' && insulationType === 'xlpe_90') kAdiabatic = 94;
    if (conductorMaterial === 'aluminium' && insulationType === 'pvc_70') kAdiabatic = 76;

    const oneSecondShortCircuitKa = (kAdiabatic * crossSectionMm2) / 1000;

    // 10. Cable Thermal Nodes Geometrical Layout (Coordinates in meters)
    const cables: CableThermalNode[] = [];
    const activeCurrentA = operatingCurrentA !== undefined ? operatingCurrentA : continuousAmpacityA;
    const heatLossWPerM = Math.pow(activeCurrentA, 2) * rAcOhmPerM * (1 + sheathLossRatioLambda1 + armourLossRatioLambda2) + dielectricLossWPerM;

    const sM = sMm / 1000;
    const depthM = burialDepthM;

    if (arrangement === 'trefoil') {
      const rTrefoilM = (deExtM / Math.sqrt(3));
      cables.push(
        { xM: -deExtM / 2, yM: depthM + (deExtM * Math.sqrt(3)) / 6, cableIndex: 0, phaseId: 'L1', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: deExtM / 2, yM: depthM + (deExtM * Math.sqrt(3)) / 6, cableIndex: 1, phaseId: 'L2', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: 0, yM: depthM - (deExtM * Math.sqrt(3)) / 3, cableIndex: 2, phaseId: 'L3', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM }
      );
    } else if (arrangement === 'flat_touching' || arrangement === 'flat_spaced') {
      cables.push(
        { xM: -sM, yM: depthM, cableIndex: 0, phaseId: 'L1', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: 0, yM: depthM, cableIndex: 1, phaseId: 'L2', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: sM, yM: depthM, cableIndex: 2, phaseId: 'L3', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM }
      );
    } else {
      // two_circuits_spaced
      const c1Offset = -sM * 1.5;
      const c2Offset = sM * 1.5;
      cables.push(
        { xM: c1Offset - deExtM, yM: depthM, cableIndex: 0, phaseId: 'C1-L1', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: c1Offset, yM: depthM, cableIndex: 1, phaseId: 'C1-L2', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: c1Offset + deExtM, yM: depthM, cableIndex: 2, phaseId: 'C1-L3', circuitId: 1, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: c2Offset - deExtM, yM: depthM, cableIndex: 3, phaseId: 'C2-L1', circuitId: 2, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: c2Offset, yM: depthM, cableIndex: 4, phaseId: 'C2-L2', circuitId: 2, conductorTempC: maxContinuousTempC, heatLossWPerM },
        { xM: c2Offset + deExtM, yM: depthM, cableIndex: 5, phaseId: 'C2-L3', circuitId: 2, conductorTempC: maxContinuousTempC, heatLossWPerM }
      );
    }

    // 11. 2D Soil Thermal Mesh Heatmap Grid Computation
    // Grid bounds: X from -0.8m to +0.8m; Y from 0.0m (ground surface) to +1.6m (subsoil)
    const gridResX = 25;
    const gridResY = 25;
    const minX = -0.8;
    const maxX = 0.8;
    const minY = 0.0;
    const maxY = 1.6;

    const heatmapGrid: TrenchSoilGridPoint[][] = [];
    let maxSoilTempInTrenchC = ambientGroundTempC;
    let surfaceGroundMaxTempC = ambientGroundTempC;

    for (let iy = 0; iy < gridResY; iy++) {
      const row: TrenchSoilGridPoint[] = [];
      const yM = minY + (iy / (gridResY - 1)) * (maxY - minY);

      for (let ix = 0; ix < gridResX; ix++) {
        const xM = minX + (ix / (gridResX - 1)) * (maxX - minX);

        // Analytical Kennelly Line Source + Mirror Sink Superposition
        // T(x, y) = T_ambient + sum [ (rho_s * W_k) / (2 * pi) * ln( d_prime_k / d_k ) ]
        let tempRiseSum = 0;

        for (const cable of cables) {
          const dDirect = Math.sqrt(Math.pow(xM - cable.xM, 2) + Math.pow(yM - cable.yM, 2));
          // Clamping minimum distance to cable external radius to prevent singularity at core
          const dClamped = Math.max(deExtM / 2, dDirect);
          // Mirror image source located at (x_k, -y_k)
          const dMirror = Math.sqrt(Math.pow(xM - cable.xM, 2) + Math.pow(yM + cable.yM, 2));

          const deltaT = (soilThermalResistivityKmPerW * cable.heatLossWPerM) / (2 * Math.PI) * Math.log(dMirror / dClamped);
          tempRiseSum += Math.max(0, deltaT);
        }

        const pointTempC = Number((ambientGroundTempC + tempRiseSum).toFixed(1));
        row.push({ xM, yM, tempC: pointTempC });

        if (pointTempC > maxSoilTempInTrenchC) {
          maxSoilTempInTrenchC = pointTempC;
        }

        // Check ground surface temperature (iy === 0)
        if (iy === 0 && pointTempC > surfaceGroundMaxTempC) {
          surfaceGroundMaxTempC = pointTempC;
        }
      }
      heatmapGrid.push(row);
    }

    // 12. Operating diagnostics
    const outerSheathTempC = Number((ambientGroundTempC + (maxContinuousTempC - ambientGroundTempC) * (t4_totalSurrounding / totalThermalResistanceRth)).toFixed(1));
    const conductorOperatingTempC = maxContinuousTempC;
    const soilDryingRisk = outerSheathTempC > 50.0;
    const isSafeOperation = continuousAmpacityA > 0 && !soilDryingRisk;

    const advisoryNotes: { fr: string; en: string }[] = [];

    if (soilDryingRisk) {
      advisoryNotes.push({
        fr: `Risque d’assèchement du sol (Soil Drying-Out) : La température d'interface gaine/terre (${outerSheathTempC}°C) excède le seuil critique de 50°C. Prévoir un remblai stabilisé en sable dolomitique ou lit de bentonite thermique pour éviter l'emballement thermique.`,
        en: `Soil Drying-Out hazard: Cable-soil interface temperature (${outerSheathTempC}°C) exceeds the 50°C threshold. Specify stabilized thermal backfill or fluid sand-bentonite slurry to prevent thermal runaway.`
      });
    }

    if (cyclicBoostFactorM > 1.05) {
      advisoryNotes.push({
        fr: `Gain de charge cyclique CEI 60853-1 : Le facteur de charge journalier μ = ${cyclicLoadFactorMu.toFixed(2)} autorise une surintensité cyclique de +${((cyclicBoostFactorM - 1) * 100).toFixed(1)}% (${Math.round(cyclicAmpacityA)} A admissible en pointe de production).`,
        en: `IEC 60853-1 Cyclic Rating Benefit: Daily loss load factor μ = ${cyclicLoadFactorMu.toFixed(2)} grants a cyclic overload boost of +${((cyclicBoostFactorM - 1) * 100).toFixed(1)}% (${Math.round(cyclicAmpacityA)} A peak capacity).`
      });
    }

    if (arrangement === 'trefoil') {
      advisoryNotes.push({
        fr: `Pose en trèfle jointif : Minimise les courants induits dans les écrans métalliques (λ1 = ${(sheathLossRatioLambda1 * 100).toFixed(1)}%) et annule quasiment le champ magnétique externe en surface.`,
        en: `Touching trefoil formation: Minimizes circulating sheath currents (λ1 = ${(sheathLossRatioLambda1 * 100).toFixed(1)}%) and suppresses external magnetic field at ground level.`
      });
    }

    return {
      rDcAt20COhmPerKm: Number(rDc20OhmPerKm.toFixed(5)),
      rDcAtMaxTempOhmPerKm: Number(rDcMaxOhmPerKm.toFixed(5)),
      skinEffectFactorYs: Number(ys.toFixed(4)),
      proximityEffectFactorYp: Number(yp.toFixed(4)),
      rAcOhmPerKm: Number(rAcOhmPerKm.toFixed(5)),
      dielectricLossWPerM: Number(dielectricLossWPerM.toFixed(3)),
      sheathLossRatioLambda1: Number(sheathLossRatioLambda1.toFixed(3)),
      armourLossRatioLambda2: Number(armourLossRatioLambda2.toFixed(3)),
      t1_insulation: Number(t1_insulation.toFixed(4)),
      t2_bedding: Number(t2_bedding.toFixed(4)),
      t3_outerSheath: Number(t3_outerSheath.toFixed(4)),
      t4_externalSoilSelf: Number(t4_externalSoilSelf.toFixed(4)),
      t4_mutualProximity: Number(t4_mutualProximity.toFixed(4)),
      t4_totalSurrounding: Number(t4_totalSurrounding.toFixed(4)),
      totalThermalResistanceRth: Number(totalThermalResistanceRth.toFixed(4)),
      continuousAmpacityA: Math.round(continuousAmpacityA),
      cyclicAmpacityA: Math.round(cyclicAmpacityA),
      cyclicBoostFactorM: Number(cyclicBoostFactorM.toFixed(3)),
      maxContinuousTempC,
      conductorOperatingTempC,
      outerSheathTempC,
      shortCircuitAdiabaticConstantK: kAdiabatic,
      oneSecondShortCircuitKa: Number(oneSecondShortCircuitKa.toFixed(2)),
      cableExternalDiameterMm: Number(deExtMm.toFixed(1)),
      cables,
      heatmapGrid,
      heatmapBounds: { minX, maxX, minY, maxY },
      maxSoilTempInTrenchC,
      surfaceGroundMaxTempC,
      isSafeOperation,
      soilDryingRisk,
      advisoryNotes
    };
  }
}

export const CAMEROON_CABLE_PRESETS: CameroonCablePreset[] = [
  {
    id: 'nomayos-225kv-feeder',
    name: {
      fr: 'Poste 225 kV Nomayos (Yaoundé) — Liaison Souterraine Évacuation 630 mm² Al XLPE',
      en: 'Nomayos 225 kV Substation (Yaoundé) — 630 mm² Al XLPE Underground Transmission Bay'
    },
    location: {
      fr: 'Poste Interconnexion Nomayos / Corridor Gazoduc — Yaoundé Sud',
      en: 'Nomayos Interconnection Substation / Pipeline Corridor — Yaoundé South'
    },
    cable: {
      voltageKv: 225,
      conductorMaterial: 'aluminium',
      crossSectionMm2: 630,
      insulationType: 'xlpe_90',
      hasMetallicScreen: true,
      hasArmour: false,
      operatingFrequencyHz: 50
    },
    trench: {
      arrangement: 'trefoil',
      axialSpacingMm: 140,
      burialDepthM: 1.4,
      soilThermalResistivityKmPerW: 1.6, // Red lateritic clay of Centre Region
      ambientGroundTempC: 30,
      cyclicLoadFactorMu: 0.75,
      phaseNumber: 3
    },
    description: {
      fr: 'Liaison haute tension 225 kV évacuant l’énergie du barrage de Memve’ele vers l’agglomération de Yaoundé en tranchée profonde sous sol latéritique sec.',
      en: '225 kV high-voltage underground transmission link routing Memve’ele hydro power into Yaoundé metropolis in deep trench through dry lateritic soil.'
    }
  },
  {
    id: 'bassa-30kv-industrial',
    name: {
      fr: 'Zone Industrielle Bassa (Douala) — Artère HTA 30 kV Double Terne 240 mm² Al',
      en: 'Bassa Industrial Zone (Douala) — 30 kV MV Double Circuit Feeder 240 mm² Al'
    },
    location: {
      fr: 'Avenue Douala Bassa — Zone Portuaire & Brasseries SABC',
      en: 'Douala Bassa Avenue — Port Industrial Area & SABC Brewery'
    },
    cable: {
      voltageKv: 30,
      conductorMaterial: 'aluminium',
      crossSectionMm2: 240,
      insulationType: 'xlpe_90',
      hasMetallicScreen: true,
      hasArmour: true,
      operatingFrequencyHz: 50
    },
    trench: {
      arrangement: 'two_circuits_spaced',
      axialSpacingMm: 300,
      burialDepthM: 1.0,
      soilThermalResistivityKmPerW: 1.0, // Moist alluvial coastal soil of Douala
      ambientGroundTempC: 32,
      cyclicLoadFactorMu: 0.85,
      phaseNumber: 3
    },
    description: {
      fr: 'Double liaison HTA 30 kV alimentant les laminoirs et usines agro-alimentaires en sol alluvionnaire côtier humide à forte capacité thermique.',
      en: 'Double-circuit 30 kV MV underground trunk line powering steel rolling mills and breweries in humid coastal alluvial soil with high thermal conductance.'
    }
  },
  {
    id: 'garoua-15kv-sahel',
    name: {
      fr: 'Poste 90/15 kV Garoua (Nord) — Départ Urbain Souterrain 150 mm² Cu XLPE',
      en: 'Garoua 90/15 kV Substation (North) — 150 mm² Cu XLPE Urban Underground Feeder'
    },
    location: {
      fr: 'Garoua Centre — Réseau Interconnecté Nord (RIN)',
      en: 'Garoua Downtown — Northern Interconnected Network (RIN)'
    },
    cable: {
      voltageKv: 15,
      conductorMaterial: 'copper',
      crossSectionMm2: 150,
      insulationType: 'xlpe_90',
      hasMetallicScreen: true,
      hasArmour: false,
      operatingFrequencyHz: 50
    },
    trench: {
      arrangement: 'flat_spaced',
      axialSpacingMm: 220,
      burialDepthM: 0.9,
      soilThermalResistivityKmPerW: 2.2, // Dry Sahelian sandy soil with poor thermal conductivity
      ambientGroundTempC: 36,
      cyclicLoadFactorMu: 0.70,
      phaseNumber: 3
    },
    description: {
      fr: 'Départ HTA 15 kV urbain en zone sahélienne chaude soumis à une forte résistivité thermique du sol sableux (2.2 K·m/W) exigeant un déclassement rigoureux.',
      en: 'Urban 15 kV feeder in hot Sahelian conditions subject to dry sandy soil with high thermal resistivity (2.2 K·m/W) demanding rigorous thermal derating.'
    }
  },
  {
    id: 'nachtigal-400v-aux',
    name: {
      fr: 'Centrale Hydro Nachtigal (420 MW) — Services Auxiliaires 400 V BT 300 mm² Cu',
      en: 'Nachtigal Hydro Plant (420 MW) — 400 V LV Power Plant Auxiliaries 300 mm² Cu'
    },
    location: {
      fr: 'Barrage Nachtigal Amont — Sanaga / Batchenga',
      en: 'Nachtigal Dam Site — Sanaga River / Batchenga'
    },
    cable: {
      voltageKv: 0.4,
      conductorMaterial: 'copper',
      crossSectionMm2: 300,
      insulationType: 'xlpe_90',
      hasMetallicScreen: false,
      hasArmour: true,
      operatingFrequencyHz: 50
    },
    trench: {
      arrangement: 'flat_touching',
      axialSpacingMm: 110,
      burialDepthM: 0.8,
      soilThermalResistivityKmPerW: 1.2,
      ambientGroundTempC: 28,
      cyclicLoadFactorMu: 0.90,
      phaseNumber: 3
    },
    description: {
      fr: 'Câbles de puissance BT alimentant les vannes de prise d’eau et pompes de drainage sous galerie technique et tranchée remblayée en sable stabilisé.',
      en: 'LV power cables feeding intake gates and drainage dewatering pumps in powerhouse technical trench with compacted stabilized sand bedding.'
    }
  }
];
