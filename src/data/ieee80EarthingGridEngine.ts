// src/data/ieee80EarthingGridEngine.ts
// EPEDE 2.0: IEEE Std 80-2013 & IEC 60479 Substation Earthing Grid Physics Engine
// Solves: Sverak grid resistance Rg, GPR, mesh voltage Em, step voltage Es,
// surface crushed rock derating factor Cs, and 2D touch/step potential gradient fields.

export interface EarthingGridInput {
  // Substation geometric dimensions
  lengthM: number;
  widthM: number;
  meshCountX: number; // number of conductor meshes along X
  meshCountY: number; // number of conductor meshes along Y
  burialDepthM: number; // conductor depth h (typical 0.5 - 1.0 m)
  conductorDiameterMm: number; // conductor diameter d (typical 10 - 16 mm)
  groundRodsCount: number; // vertical earth rods Nr
  groundRodLengthM: number; // length of each rod Lr (typical 3 m)
  
  // Soil & Surface Layer Parameters
  soilResistivityOhmM: number; // native soil rho
  hasCrushedRockLayer: boolean;
  crushedRockThicknessCm: number; // hs (cm)
  crushedRockResistivityOhmM: number; // rho_s (typical 2500 - 4000 Ohm.m)
  
  // Electrical Fault Parameters
  faultCurrentRmsKa: number; // symmetrical fault current If (kA)
  faultClearingTimeSec: number; // fault duration ts (seconds)
  currentSplitFactorSf: number; // grid split factor (typical 0.5 - 0.7)
  bodyWeightKg: 50 | 70; // IEEE 80 body weight standard
}

export interface EarthingGridOutput {
  // Geometric metrics
  gridAreaM2: number;
  perimeterM: number;
  conductorsLengthM: number;
  rodsTotalLengthM: number;
  totalBuriedLengthLtM: number;
  meshSpacingXM: number;
  meshSpacingYM: number;
  averageMeshSpacingM: number;
  
  // Factors
  nFactor: number;
  kmFactor: number;
  kiFactor: number;
  ksFactor: number;
  csDerating: number;
  
  // Tolerable thresholds (Safety Limits)
  tolerableTouchVoltageV: number;
  tolerableStepVoltageV: number;
  
  // Grid Electrical Quantities
  gridResistanceRgOhm: number;
  gridCurrentIgA: number;
  groundPotentialRiseV: number;
  
  // Attained Voltages (Worst-Case)
  meshVoltageCalculatedV: number;
  stepVoltageCalculatedV: number;
  
  // Safety Assessment
  isTouchSafe: boolean;
  isStepSafe: boolean;
  touchSafetyMarginV: number;
  stepSafetyMarginV: number;
  complianceStatus: 'COMPLIANT' | 'WARNING' | 'DANGEROUS';
  
  // Heatmap Grid and Profile
  heatmapResolution: number; // e.g. 25x25 grid
  gridSurfacePotentials: number[][]; // normalized surface potential phi(x,y)
  crossSectionProfile: {
    distanceFromCenterM: number;
    surfacePotentialV: number;
    touchVoltageV: number;
    stepVoltageV: number;
    tolerableTouchV: number;
    tolerableStepV: number;
    locationType: 'INSIDE_GRID' | 'PERIMETER' | 'OUTSIDE_FENCE';
  }[];
  
  // Normative Clauses & Advisory
  recommendations: { fr: string; en: string }[];
}

export interface CameroonSubstationPreset {
  id: string;
  name: { fr: string; en: string };
  region: { fr: string; en: string };
  gridType: { fr: string; en: string };
  input: EarthingGridInput;
  description: { fr: string; en: string };
}

export const CAMEROON_SUBSTATION_EARTHING_PRESETS: CameroonSubstationPreset[] = [
  {
    id: 'bekoko-225kv',
    name: {
      fr: 'Poste d’Interconnexion 225/90 kV de Békoko (Douala)',
      en: 'Békoko 225/90 kV Interconnection Substation (Douala)',
    },
    region: {
      fr: 'Réseau Interconnecté Sud (RIS) - Nœud Métropolitain Littoral',
      en: 'Southern Interconnected Grid (RIS) - Littoral Metropolitan Hub',
    },
    gridType: {
      fr: 'Poste HTB AIS extérieur 225/90/15 kV avec fort courant de court-circuit',
      en: 'Outdoor AIS 225/90/15 kV substation with high fault level',
    },
    input: {
      lengthM: 120,
      widthM: 90,
      meshCountX: 12,
      meshCountY: 9,
      burialDepthM: 0.8,
      conductorDiameterMm: 14, // 120 mm² Cu
      groundRodsCount: 36,
      groundRodLengthM: 3.0,
      soilResistivityOhmM: 80, // coastal alluvium / humid clay
      hasCrushedRockLayer: true,
      crushedRockThicknessCm: 15,
      crushedRockResistivityOhmM: 3000,
      faultCurrentRmsKa: 31.5,
      faultClearingTimeSec: 0.2,
      currentSplitFactorSf: 0.60,
      bodyWeightKg: 70,
    },
    description: {
      fr: 'Poste stratégique alimentant la zone industrielle de Bonabéri et le Grand Douala. Sol limoneux alluvial de basse résistivité avec forte exigence de dissipation thermique lors des défauts 31.5 kA.',
      en: 'Strategic node supplying Bonabéri industrial cluster and greater Douala. Low-resistivity alluvial soil subject to 31.5 kA fault currents.',
    },
  },
  {
    id: 'oyomabang-225kv',
    name: {
      fr: 'Poste Source 225/30 kV d’Oyomabang (Yaoundé)',
      en: 'Oyomabang 225/30 kV Main Bulk Substation (Yaoundé)',
    },
    region: {
      fr: 'Réseau Interconnecté Sud (RIS) - Tête de desserte Capitale',
      en: 'Southern Interconnected Grid (RIS) - Capital Transmission Feeder',
    },
    gridType: {
      fr: 'Poste de transformation 225/90/30 kV sur sol latéritique collinaire',
      en: '225/90/30 kV transformation substation on hillside lateritic soil',
    },
    input: {
      lengthM: 90,
      widthM: 65,
      meshCountX: 10,
      meshCountY: 7,
      burialDepthM: 0.8,
      conductorDiameterMm: 13, // 95 mm² Cu
      groundRodsCount: 28,
      groundRodLengthM: 3.0,
      soilResistivityOhmM: 220, // Lateritic clay
      hasCrushedRockLayer: true,
      crushedRockThicknessCm: 15,
      crushedRockResistivityOhmM: 2800,
      faultCurrentRmsKa: 25.0,
      faultClearingTimeSec: 0.25,
      currentSplitFactorSf: 0.65,
      bodyWeightKg: 70,
    },
    description: {
      fr: 'Principal poste de réception de l’énergie de Song Loulou et Nachtigal pour Yaoundé. Sol latéritique à résistivité moyenne nécessitant une couche de gravier pour contenir la tension de toucher.',
      en: 'Primary transmission intake substation for Yaoundé from Song Loulou and Nachtigal. Medium-resistivity laterite requiring gravel layer to meet IEEE 80 touch voltage thresholds.',
    },
  },
  {
    id: 'mangombe-225kv',
    name: {
      fr: 'Poste Élévateur & Nœud 225 kV de Mangombé (Edéa)',
      en: 'Mangombé 225 kV Hydro Evacuation & Switchyard Node (Edéa)',
    },
    region: {
      fr: 'Réseau Interconnecté Sud (RIS) - Évacuation Hydro & ALUCAM',
      en: 'Southern Interconnected Grid (RIS) - Hydro Evacuation & ALUCAM Smelter',
    },
    gridType: {
      fr: 'Grand poste de manœuvre 225 kV avec puissance de court-circuit maximale',
      en: 'Major 225 kV switching station with maximum short-circuit capacity',
    },
    input: {
      lengthM: 140,
      widthM: 100,
      meshCountX: 14,
      meshCountY: 10,
      burialDepthM: 0.8,
      conductorDiameterMm: 15, // 150 mm² Cu
      groundRodsCount: 48,
      groundRodLengthM: 3.0,
      soilResistivityOhmM: 150, // Granitic bedrock mix
      hasCrushedRockLayer: true,
      crushedRockThicknessCm: 15,
      crushedRockResistivityOhmM: 3500,
      faultCurrentRmsKa: 40.0, // Edéa switchyard 40 kA
      faultClearingTimeSec: 0.15, // Fast distance protection
      currentSplitFactorSf: 0.55,
      bodyWeightKg: 70,
    },
    description: {
      fr: 'Carrefour électrique central interconnectant Edéa, Song Loulou et les départs vers Douala/Yaoundé. Courant de court-circuit très élevé (40 kA) imposant une grille en cuivre renforcée.',
      en: 'Core transmission intersection tying Edéa hydro, Song Loulou, and industrial feeders. Very high fault current (40 kA) necessitating dense copper grid geometry.',
    },
  },
  {
    id: 'maroua-90kv',
    name: {
      fr: 'Poste 90/15 kV de Maroua (Extrême-Nord / RIN)',
      en: 'Maroua 90/15 kV Regional Grid Substation (Far North / RIN)',
    },
    region: {
      fr: 'Réseau Interconnecté Nord (RIN) - Zone Sahélienne Semi-Aride',
      en: 'Northern Interconnected Grid (RIN) - Semi-Arid Sahelian Zone',
    },
    gridType: {
      fr: 'Poste MT/HTB en milieu aride sableux à haute résistivité',
      en: 'MV/HV substation in high-resistivity arid sandy ground',
    },
    input: {
      lengthM: 60,
      widthM: 50,
      meshCountX: 8,
      meshCountY: 6,
      burialDepthM: 0.9,
      conductorDiameterMm: 12, // 70 mm² Cu
      groundRodsCount: 20,
      groundRodLengthM: 3.0,
      soilResistivityOhmM: 480, // Dry sandy granite soil
      hasCrushedRockLayer: true,
      crushedRockThicknessCm: 12,
      crushedRockResistivityOhmM: 2500,
      faultCurrentRmsKa: 12.5,
      faultClearingTimeSec: 0.3,
      currentSplitFactorSf: 0.70,
      bodyWeightKg: 70,
    },
    description: {
      fr: 'Poste régional du Grand Nord camerounais. En saison sèche, la résistivité élevée du sol (480 Ω·m) entraîne un risque accru de tension de pas et de toucher sans lit de gravier.',
      en: 'Regional hub of the Northern Grid. In the dry season, high soil resistivity (480 Ω·m) poses critical touch/step hazards without crushed rock surfacing.',
    },
  },
];

export class Ieee80EarthingGridEngine {
  /**
   * Solves complete IEEE Std 80-2013 substation ground grid equations
   */
  public static solve(input: EarthingGridInput): EarthingGridOutput {
    const {
      lengthM: Lx,
      widthM: Ly,
      meshCountX: Nx,
      meshCountY: Ny,
      burialDepthM: h,
      conductorDiameterMm: dMm,
      groundRodsCount: Nr,
      groundRodLengthM: Lr,
      soilResistivityOhmM: rho,
      hasCrushedRockLayer,
      crushedRockThicknessCm: hsCm,
      crushedRockResistivityOhmM: rhoS,
      faultCurrentRmsKa: IfKa,
      faultClearingTimeSec: ts,
      currentSplitFactorSf: Sf,
      bodyWeightKg,
    } = input;

    const d = dMm / 1000; // conductor diameter in meters
    const hsM = hsCm / 100; // gravel thickness in meters
    const gridAreaM2 = Lx * Ly;
    const perimeterM = 2 * (Lx + Ly);

    // Mesh spacing
    const meshSpacingXM = Lx / Nx;
    const meshSpacingYM = Ly / Ny;
    const D = (meshSpacingXM + meshSpacingYM) / 2; // average spacing D

    // Total length of grid conductors Lc
    // Conductors parallel to X: (Ny + 1) lines of length Lx
    // Conductors parallel to Y: (Nx + 1) lines of length Ly
    const conductorsLengthM = (Ny + 1) * Lx + (Nx + 1) * Ly;
    const rodsTotalLengthM = Nr * Lr;
    const totalBuriedLengthLtM = conductorsLengthM + rodsTotalLengthM;

    // 1. Surface layer derating factor Cs (IEEE Std 80 Eq. 27)
    let csDerating = 1.0;
    let surfaceResistivityEffective = rho;

    if (hasCrushedRockLayer && hsM > 0 && rhoS > 0) {
      surfaceResistivityEffective = rhoS;
      // Reflection factor K = (rho - rhoS) / (rho + rhoS)
      // Cs = 1 - (0.09 * (1 - rho / rhoS)) / (2 * hs + 0.09)
      csDerating = Math.max(
        0.55,
        1 - (0.09 * (1 - rho / rhoS)) / (2 * hsM + 0.09)
      );
    }

    // 2. Body current constant k_body (IEEE 80 Eq. 29 & 30)
    // 0.157 for 70 kg, 0.116 for 50 kg
    const kBody = bodyWeightKg === 70 ? 0.157 : 0.116;

    // Tolerable Touch Voltage (E_touch)
    // E_touch = (1000 + 1.5 * Cs * rho_s) * (k_body / sqrt(ts))
    const tolerableTouchVoltageV =
      (1000 + 1.5 * csDerating * surfaceResistivityEffective) *
      (kBody / Math.sqrt(Math.max(0.02, ts)));

    // Tolerable Step Voltage (E_step)
    // E_step = (1000 + 6.0 * Cs * rho_s) * (k_body / sqrt(ts))
    const tolerableStepVoltageV =
      (1000 + 6.0 * csDerating * surfaceResistivityEffective) *
      (kBody / Math.sqrt(Math.max(0.02, ts)));

    // 3. Grid Resistance Rg (Sverak simplified formula IEEE 80 Eq. 54)
    // Rg = rho * [ 1/Lt + 1/sqrt(20*A) * (1 + 1 / (1 + h * sqrt(20/A))) ]
    const term1 = 1 / Math.max(1, totalBuriedLengthLtM);
    const sqrt20A = Math.sqrt(20 * gridAreaM2);
    const term2 = (1 / sqrt20A) * (1 + 1 / (1 + h * (sqrt20A / gridAreaM2)));
    const gridResistanceRgOhm = rho * (term1 + term2);

    // 4. Fault Current to Grid and Ground Potential Rise (GPR)
    const gridCurrentIgA = IfKa * 1000 * Math.max(0.1, Math.min(1.0, Sf));
    const groundPotentialRiseV = gridCurrentIgA * gridResistanceRgOhm;

    // 5. Mesh Factor Km (IEEE 80 Eq. 81)
    // Geometric n factor = na * nb * nc * nd
    const na = (2 * conductorsLengthM) / perimeterM;
    const nb = Math.sqrt(perimeterM / (4 * Math.sqrt(gridAreaM2)));
    const nc = Math.pow((Lx * Ly) / gridAreaM2, (0.7 * gridAreaM2) / (Lx * Ly));
    const nd = 1.0;
    const nFactor = na * nb * nc * nd;

    // Kii: 1 for grids with ground rods along perimeter
    const kii = Nr > 0 ? 1.0 : Math.pow(1 / (2 * nFactor), 2 / nFactor);
    // Kh = sqrt(1 + h/h0) with h0 = 1.0 m
    const kh = Math.sqrt(1 + h / 1.0);

    const kmPart1 =
      Math.pow(D, 2) / (16 * h * d) +
      Math.pow(D + 2 * h, 2) / (8 * D * d) -
      h / (4 * d);
    const kmPart2 = (kii / kh) * Math.log(8 / (Math.PI * (2 * nFactor - 1)));
    const kmFactor = (1 / (2 * Math.PI)) * (Math.log(Math.max(1.01, kmPart1)) + kmPart2);

    // 6. Irregularity Factor Ki (IEEE 80 Eq. 89)
    const kiFactor = 0.644 + 0.148 * nFactor;

    // 7. Step Factor Ks (IEEE 80 Eq. 90)
    const ksFactor =
      (1 / Math.PI) *
      (1 / (2 * h) + 1 / (D + h) + (1 / D) * (1 - Math.pow(0.5, Math.max(0, nFactor - 2))));

    // Effective buried lengths Lm (mesh) and Ls (step)
    const lm =
      conductorsLengthM +
      (1.55 + 1.22 * (Lr / Math.sqrt(Math.pow(Lx, 2) + Math.pow(Ly, 2)))) *
        rodsTotalLengthM;
    const ls = 0.75 * conductorsLengthM + 0.85 * rodsTotalLengthM;

    // 8. Calculated Mesh Voltage Em and Step Voltage Es
    const meshVoltageCalculatedV = (rho * gridCurrentIgA * kmFactor * kiFactor) / lm;
    const stepVoltageCalculatedV = (rho * gridCurrentIgA * ksFactor * kiFactor) / ls;

    // Safety checks
    const isTouchSafe = meshVoltageCalculatedV <= tolerableTouchVoltageV;
    const isStepSafe = stepVoltageCalculatedV <= tolerableStepVoltageV;
    const touchSafetyMarginV = tolerableTouchVoltageV - meshVoltageCalculatedV;
    const stepSafetyMarginV = tolerableStepVoltageV - stepVoltageCalculatedV;

    let complianceStatus: 'COMPLIANT' | 'WARNING' | 'DANGEROUS' = 'COMPLIANT';
    if (!isTouchSafe || !isStepSafe) {
      complianceStatus = 'DANGEROUS';
    } else if (touchSafetyMarginV < tolerableTouchVoltageV * 0.15) {
      complianceStatus = 'WARNING';
    }

    // 9. 2D Surface Potential Heatmap Matrix (21 x 21 resolution)
    const heatmapRes = 21;
    const gridSurfacePotentials: number[][] = [];
    // Domain goes from -15% outside left to +115% outside right
    const marginRatio = 0.20; // 20% margin around grid perimeter
    const xMin = -Lx * marginRatio;
    const xMax = Lx * (1 + marginRatio);
    const yMin = -Ly * marginRatio;
    const yMax = Ly * (1 + marginRatio);

    for (let iy = 0; iy < heatmapRes; iy++) {
      const row: number[] = [];
      const y = yMin + (iy / (heatmapRes - 1)) * (yMax - yMin);
      for (let ix = 0; ix < heatmapRes; ix++) {
        const x = xMin + (ix / (heatmapRes - 1)) * (xMax - xMin);

        // Normalized surface potential function Phi(x, y)
        // High inside grid, valleys between conductor lines, decay outside perimeter
        const isInside = x >= 0 && x <= Lx && y >= 0 && y <= Ly;

        let phi = 0;
        if (isInside) {
          // Distance to nearest grid conductor line
          const distToXLine = Math.min(
            ...Array.from({ length: Ny + 1 }, (_, i) => Math.abs(y - i * meshSpacingYM))
          );
          const distToYLine = Math.min(
            ...Array.from({ length: Nx + 1 }, (_, i) => Math.abs(x - i * meshSpacingXM))
          );
          const distToMeshLine = Math.min(distToXLine, distToYLine);

          // Center vs corner attenuation
          const normDistFromCenter = Math.sqrt(
            Math.pow((x - Lx / 2) / (Lx / 2), 2) + Math.pow((y - Ly / 2) / (Ly / 2), 2)
          );
          // Corner mesh has deeper potential dip, resulting in highest touch voltage
          const conductorEffect = Math.exp(-distToMeshLine / (h * 2.2));
          phi = 0.88 - 0.14 * (1 - conductorEffect) - 0.08 * Math.min(1, normDistFromCenter);
        } else {
          // Outside perimeter fence: hyperbolic decay toward remote earth
          const dxOut = x < 0 ? -x : x > Lx ? x - Lx : 0;
          const dyOut = y < 0 ? -y : y > Ly ? y - Ly : 0;
          const distOut = Math.sqrt(dxOut * dxOut + dyOut * dyOut);
          const decayConst = Math.sqrt(gridAreaM2) / 3.0;
          phi = 0.70 / (1 + distOut / decayConst);
        }

        row.push(Number(Math.max(0.05, Math.min(0.95, phi)).toFixed(3)));
      }
      gridSurfacePotentials.push(row);
    }

    // 10. 1D Cross-Section Potential Profile (Diagonal cut from center to outside fence)
    const crossSectionProfile: EarthingGridOutput['crossSectionProfile'] = [];
    const maxProfileDist = Math.sqrt(Math.pow(Lx / 2, 2) + Math.pow(Ly / 2, 2)) + 15; // 15m past fence
    const numProfileSteps = 30;

    for (let i = 0; i <= numProfileSteps; i++) {
      const dist = (i / numProfileSteps) * maxProfileDist;
      const cornerRadius = Math.sqrt(Math.pow(Lx / 2, 2) + Math.pow(Ly / 2, 2));
      const isPastFence = dist > cornerRadius;
      const isNearPerimeter = Math.abs(dist - cornerRadius) <= D * 0.75;

      // Surface potential V(dist)
      let phiProfile = 0.88;
      if (!isPastFence) {
        // sinusoidal ripple due to meshes
        const ripple = 0.06 * Math.cos((dist / D) * 2 * Math.PI);
        phiProfile = 0.84 - 0.10 * (dist / cornerRadius) + ripple;
      } else {
        const outDist = dist - cornerRadius;
        phiProfile = 0.68 / (1 + outDist / 8.0);
      }

      const surfacePotV = groundPotentialRiseV * phiProfile;
      const touchV = Math.max(0, groundPotentialRiseV - surfacePotV);
      // Step potential is derivative of surface potential over 1 meter
      const stepSlope = isPastFence
        ? (groundPotentialRiseV * 0.68 * 8.0) / Math.pow(8.0 + (dist - cornerRadius), 2)
        : (groundPotentialRiseV * 0.12) / D;
      const stepV = Math.min(touchV * 0.8, stepSlope * 1.0);

      crossSectionProfile.push({
        distanceFromCenterM: Number(dist.toFixed(1)),
        surfacePotentialV: Math.round(surfacePotV),
        touchVoltageV: Math.round(touchV),
        stepVoltageV: Math.round(stepV),
        tolerableTouchV: Math.round(tolerableTouchVoltageV),
        tolerableStepV: Math.round(tolerableStepVoltageV),
        locationType: isPastFence
          ? 'OUTSIDE_FENCE'
          : isNearPerimeter
          ? 'PERIMETER'
          : 'INSIDE_GRID',
      });
    }

    // 11. Recommendations
    const recommendations: { fr: string; en: string }[] = [];
    if (gridResistanceRgOhm > 1.0) {
      recommendations.push({
        fr: `Résistance de terre Rg = ${gridResistanceRgOhm.toFixed(2)} Ω > 1.0 Ω. Pour les postes HTB/HTA, densifier le quadrillage ou ajouter des forages profonds pour abaisser Rg sous 1.0 Ω.`,
        en: `Ground resistance Rg = ${gridResistanceRgOhm.toFixed(2)} Ω > 1.0 Ω. Add deep borehole rods or reduce mesh spacing to bring Rg under 1.0 Ω.`,
      });
    }
    if (!isTouchSafe) {
      recommendations.push({
        fr: `Tension de maille Em (${meshVoltageCalculatedV.toFixed(0)} V) excède le seuil tolérable (${tolerableTouchVoltageV.toFixed(0)} V). Action obligatoire : porter le gravier à 15-20 cm d'épaisseur (Cs=${csDerating.toFixed(2)}) ou resserrer le maillage D=${D.toFixed(1)} m.`,
        en: `Mesh touch voltage (${meshVoltageCalculatedV.toFixed(0)} V) exceeds safety limit (${tolerableTouchVoltageV.toFixed(0)} V). Mandatory: increase crushed rock thickness or reduce mesh spacing D.`,
      });
    }
    if (!isStepSafe) {
      recommendations.push({
        fr: `Tension de pas Es (${stepVoltageCalculatedV.toFixed(0)} V) excède le seuil tolérable (${tolerableStepVoltageV.toFixed(0)} V). Prévoir une boucle d'équipotentialité enterrée à 1 m à l'extérieur de la clôture (conducteur de garde périmétrique).`,
        en: `Step voltage (${stepVoltageCalculatedV.toFixed(0)} V) exceeds limit. Install an outer grading ring conductor 1 m outside the perimeter fence.`,
      });
    }
    if (isTouchSafe && isStepSafe && recommendations.length === 0) {
      recommendations.push({
        fr: `Conception 100% conforme IEEE Std 80-2013. Les marges de sécurité au pas (${stepSafetyMarginV.toFixed(0)} V) et au toucher (${touchSafetyMarginV.toFixed(0)} V) garantissent la non-fibrillation pour un intervenant de ${bodyWeightKg} kg.`,
        en: `Fully compliant with IEEE Std 80-2013. Step (${stepSafetyMarginV.toFixed(0)} V) and touch (${touchSafetyMarginV.toFixed(0)} V) margins prevent ventricular fibrillation for a ${bodyWeightKg} kg worker.`,
      });
    }

    return {
      gridAreaM2: Math.round(gridAreaM2),
      perimeterM: Math.round(perimeterM),
      conductorsLengthM: Math.round(conductorsLengthM),
      rodsTotalLengthM: Math.round(rodsTotalLengthM),
      totalBuriedLengthLtM: Math.round(totalBuriedLengthLtM),
      meshSpacingXM: Number(meshSpacingXM.toFixed(2)),
      meshSpacingYM: Number(meshSpacingYM.toFixed(2)),
      averageMeshSpacingM: Number(D.toFixed(2)),
      nFactor: Number(nFactor.toFixed(2)),
      kmFactor: Number(kmFactor.toFixed(3)),
      kiFactor: Number(kiFactor.toFixed(3)),
      ksFactor: Number(ksFactor.toFixed(3)),
      csDerating: Number(csDerating.toFixed(3)),
      tolerableTouchVoltageV: Math.round(tolerableTouchVoltageV),
      tolerableStepVoltageV: Math.round(tolerableStepVoltageV),
      gridResistanceRgOhm: Number(gridResistanceRgOhm.toFixed(3)),
      gridCurrentIgA: Math.round(gridCurrentIgA),
      groundPotentialRiseV: Math.round(groundPotentialRiseV),
      meshVoltageCalculatedV: Math.round(meshVoltageCalculatedV),
      stepVoltageCalculatedV: Math.round(stepVoltageCalculatedV),
      isTouchSafe,
      isStepSafe,
      touchSafetyMarginV: Math.round(touchSafetyMarginV),
      stepSafetyMarginV: Math.round(stepSafetyMarginV),
      complianceStatus,
      heatmapResolution: heatmapRes,
      gridSurfacePotentials,
      crossSectionProfile,
      recommendations,
    };
  }
}

