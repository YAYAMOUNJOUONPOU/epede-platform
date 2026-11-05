// src/data/iec60826TensionSagEngine.ts
// EPEDE 2.0: IEC 60826 / Cigré TB 273 / EN 50341 Overhead Transmission Line Mechanical Tension-Sag & Conductor State Engine
// Normative standards: IEC 60826:2017 (Design criteria of overhead transmission lines),
// Cigré Technical Brochure 273 (Conductor Sag-Tension Calculation Methods),
// EN 50341-1:2012 (Overhead electrical lines exceeding AC 1 kV), IEEE Std 738 (Bare overhead line temperature)

export type ConductorAlloyType = 'AAAC_ASTER' | 'ACSR' | 'AAC' | 'ACAR';

export interface ConductorMechanicalProperties {
  codeName: string;
  nominalSectionMm2: number; // A (mm²)
  totalSectionMm2: number;
  outerDiameterMm: number; // d (mm)
  linearMassKgPerM: number; // m' (kg/m)
  linearWeightNPerM: number; // wc = m' · 9.80665 (N/m)
  ratedTensileStrengthKn: number; // RTS / UTS (kN)
  modulusOfElasticityMpa: number; // E (N/mm² or MPa)
  thermalExpansionCoeffPerC: number; // α (1/°C)
  dcResistance20OhmPerKm: number; // R20 (Ω/km)
}

export const CANONICAL_CONDUCTORS: Record<string, ConductorMechanicalProperties> = {
  aster_570: {
    codeName: 'Aster 570 mm² (AAAC Almelec)',
    nominalSectionMm2: 570,
    totalSectionMm2: 570.2,
    outerDiameterMm: 31.05,
    linearMassKgPerM: 1.572,
    linearWeightNPerM: 1.572 * 9.80665, // ~15.42 N/m
    ratedTensileStrengthKn: 166.0,
    modulusOfElasticityMpa: 60000,
    thermalExpansionCoeffPerC: 23.0e-6,
    dcResistance20OhmPerKm: 0.0583
  },
  aster_228: {
    codeName: 'Aster 228 mm² (AAAC Almelec)',
    nominalSectionMm2: 228,
    totalSectionMm2: 228.0,
    outerDiameterMm: 19.50,
    linearMassKgPerM: 0.637,
    linearWeightNPerM: 0.637 * 9.80665, // ~6.25 N/m
    ratedTensileStrengthKn: 67.4,
    modulusOfElasticityMpa: 60000,
    thermalExpansionCoeffPerC: 23.0e-6,
    dcResistance20OhmPerKm: 0.1440
  },
  aster_148: {
    codeName: 'Aster 148 mm² (AAAC Almelec)',
    nominalSectionMm2: 148,
    totalSectionMm2: 148.1,
    outerDiameterMm: 15.75,
    linearMassKgPerM: 0.413,
    linearWeightNPerM: 0.413 * 9.80665, // ~4.05 N/m
    ratedTensileStrengthKn: 43.9,
    modulusOfElasticityMpa: 60000,
    thermalExpansionCoeffPerC: 23.0e-6,
    dcResistance20OhmPerKm: 0.2240
  },
  curlew_acsr_590: {
    codeName: 'Curlew 590 mm² (ACSR Aluminium-Steel)',
    nominalSectionMm2: 590,
    totalSectionMm2: 593.4,
    outerDiameterMm: 31.65,
    linearMassKgPerM: 1.982,
    linearWeightNPerM: 1.982 * 9.80665, // ~19.44 N/m
    ratedTensileStrengthKn: 194.0,
    modulusOfElasticityMpa: 75000,
    thermalExpansionCoeffPerC: 19.3e-6,
    dcResistance20OhmPerKm: 0.0551
  }
};

export interface TensionSagInput {
  conductorKey: string; // Key in CANONICAL_CONDUCTORS or custom
  customConductor?: ConductorMechanicalProperties;
  rulingSpanMeters: number; // a_r (m)
  
  // State 1: Stringing / Reference State (typically EDS condition)
  state1TemperatureC: number; // θ1 (°C, typically 15°C or 20°C)
  state1TensionPercentRts: number; // % of RTS (typically 18% to 22% for EDS)
  state1WindSpeedMPerS?: number; // Usually 0 m/s at stringing
  
  // State 2: Critical Evaluation State (e.g. Max Temp 75°C or Max Wind 30 m/s)
  state2TemperatureC: number; // θ2 (°C)
  state2WindSpeedMPerS: number; // v_w (m/s)
  airDensityKgPerM3?: number; // ρ_air (default 1.225 kg/m³)
  windDragCoeff?: number; // Cd (default 1.0)
  
  // Tower & Environmental Clearance Requirements
  minRequiredGroundClearanceM: number; // e.g. 7.5 m for 225 kV, 6.5 m for 90 kV
  crossarmAttachmentHeightM: number; // Height of suspension insulator clamp above ground (m)
}

export interface TemperatureStepPoint {
  temperatureC: number;
  horizontalTensionKn: number;
  mechanicalStressMpa: number;
  midSpanSagMeters: number;
  groundClearanceMeters: number;
  safetyFactorRts: number;
}

export interface TensionSagCalculationResult {
  // Conductor Specifications
  conductor: ConductorMechanicalProperties;
  rulingSpanM: number;
  
  // State 1 (Reference) Conditions
  state1: {
    temperatureC: number;
    horizontalTensionN: number;
    horizontalTensionKn: number;
    mechanicalStressMpa: number;
    midSpanSagMeters: number;
    percentRts: number;
  };

  // State 2 (Climatic/Operating) Conditions
  state2: {
    temperatureC: number;
    windSpeedMPerS: number;
    windPressurePa: number;
    windForcePerMeterN: number;
    resultantWeightPerMeterN: number;
    windDeflectionAngleDeg: number;
    horizontalTensionN: number;
    horizontalTensionKn: number;
    mechanicalStressMpa: number;
    totalMidSpanSagMeters: number;
    verticalSagMeters: number;
    horizontalSwingMeters: number;
    maxTensionAtSupportKn: number;
    safetyFactorAgainstRts: number;
    percentRts: number;
    actualGroundClearanceMeters: number;
    isGroundClearanceCompliant: boolean;
    isTensionSafetyCompliant: boolean;
  };

  // Temperature Sweeping Profile Table (10°C to 90°C)
  temperatureProfile: TemperatureStepPoint[];

  // Overall Verdict & Technical Advisory
  overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT';
  advisoryInterpretation: { fr: string; en: string };
}

export interface CameroonTransmissionLinePreset {
  id: string;
  name: { fr: string; en: string };
  corridor: { fr: string; en: string };
  facility?: { fr: string; en: string };
  voltageLevel: string;
  input: TensionSagInput;
  description: { fr: string; en: string };
}

export class Iec60826TensionSagEngine {
  public static readonly GRAVITY = 9.80665; // m/s²

  /**
   * Solves the cubic change-of-state equation (Blondel / Truxa / Cigré TB 273):
   * σ2² · [ σ2 + K_const ] = [ E · (γ2 · a)² ] / 24
   * Where K_const = [ E · (γ1 · a)² ] / (24 · σ1²) + E · α · (θ2 - θ1) - σ1
   */
  public static solveCubicChangeOfState(
    sigma1: number, // N/mm²
    gamma1: number, // N/(m · mm²)
    gamma2: number, // N/(m · mm²)
    a: number, // m
    E: number, // N/mm² (MPa)
    alpha: number, // 1/°C
    deltaTheta: number // °C
  ): number {
    const term1 = (E * Math.pow(gamma1 * a, 2)) / (24 * Math.pow(sigma1, 2));
    const termThermal = E * alpha * deltaTheta;
    const K = term1 + termThermal - sigma1;
    const C = (E * Math.pow(gamma2 * a, 2)) / 24;

    // Standard cubic polynomial: f(σ) = σ³ + K·σ² - C = 0
    // Newton-Raphson iteration starting from positive estimate
    let sigma2 = Math.max(10.0, sigma1 * (gamma2 / Math.max(1e-5, gamma1)));
    for (let iter = 0; iter < 100; iter++) {
      const f = Math.pow(sigma2, 3) + K * Math.pow(sigma2, 2) - C;
      const fPrime = 3 * Math.pow(sigma2, 2) + 2 * K * sigma2;
      if (Math.abs(fPrime) < 1e-9) break;
      const delta = f / fPrime;
      sigma2 -= delta;
      if (Math.abs(delta) < 1e-6) break;
    }

    return Math.max(0.1, sigma2);
  }

  /**
   * Evaluates complete mechanical tension-sag analysis according to IEC 60826 and Cigré TB 273
   */
  public static solve(input: TensionSagInput): TensionSagCalculationResult {
    const conductor = input.customConductor || CANONICAL_CONDUCTORS[input.conductorKey] || CANONICAL_CONDUCTORS.aster_570;
    const a = input.rulingSpanMeters;
    const A = conductor.totalSectionMm2;
    const d = conductor.outerDiameterMm;
    const wc = conductor.linearWeightNPerM;
    const E = conductor.modulusOfElasticityMpa;
    const alpha = conductor.thermalExpansionCoeffPerC;
    const RTS = conductor.ratedTensileStrengthKn * 1000; // N

    const rhoAir = input.airDensityKgPerM3 || 1.225; // kg/m³
    const Cd = input.windDragCoeff || 1.0;

    // 1. State 1 (Stringing / Initial EDS Condition)
    const H1 = (input.state1TensionPercentRts / 100) * RTS; // N
    const sigma1 = H1 / A; // N/mm²
    const gamma1 = wc / A; // N/(m · mm²)
    const f1 = (wc * Math.pow(a, 2)) / (8 * H1); // m

    // 2. State 2 (Climatic / Operating Condition)
    const deltaTheta = input.state2TemperatureC - input.state1TemperatureC;
    const vw = input.state2WindSpeedMPerS;
    
    // Dynamic wind pressure qw = 0.5 · ρ · vw² (Pa = N/m²)
    const windPressurePa = 0.5 * rhoAir * Math.pow(vw, 2);
    // Wind force per linear meter Fw = qw · Cd · (d / 1000) (N/m)
    const windForcePerMeterN = windPressurePa * Cd * (d / 1000);
    // Resultant unit load Wres2 = √(wc² + Fw²) (N/m)
    const resultantWeightPerMeterN = Math.sqrt(Math.pow(wc, 2) + Math.pow(windForcePerMeterN, 2));
    const gamma2 = resultantWeightPerMeterN / A;

    // Wind deflection angle (swing): tan(φ) = Fw / wc
    const windDeflectionAngleDeg = (Math.atan2(windForcePerMeterN, wc) * 180) / Math.PI;

    // Solve State 2 stress σ2 via cubic change-of-state equation
    const sigma2 = this.solveCubicChangeOfState(sigma1, gamma1, gamma2, a, E, alpha, deltaTheta);
    const H2 = sigma2 * A; // N
    
    // Total geometric sag along inclined plane of resultant force
    const totalMidSpanSagMeters = (resultantWeightPerMeterN * Math.pow(a, 2)) / (8 * H2);
    // Vertical sag component: f_vert = f_total · cos(φ)
    const verticalSagMeters = totalMidSpanSagMeters * Math.cos((windDeflectionAngleDeg * Math.PI) / 180);
    // Horizontal wind blowout swing: f_horiz = f_total · sin(φ)
    const horizontalSwingMeters = totalMidSpanSagMeters * Math.sin((windDeflectionAngleDeg * Math.PI) / 180);

    // Maximum tension at support clamp: Tmax = H2 + Wres2 · f2
    const maxTensionAtSupportKn = (H2 + resultantWeightPerMeterN * totalMidSpanSagMeters) / 1000;
    const safetyFactorAgainstRts = RTS / (maxTensionAtSupportKn * 1000);
    const isTensionSafetyCompliant = safetyFactorAgainstRts >= 2.5; // IEC 60826 minimum safety factor 2.5

    // Ground clearance evaluation
    const actualGroundClearanceMeters = input.crossarmAttachmentHeightM - verticalSagMeters;
    const isGroundClearanceCompliant = actualGroundClearanceMeters >= input.minRequiredGroundClearanceM;

    // 3. Multi-Temperature Sweep Profile Table (10°C to 90°C with 0 wind)
    const tempSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const temperatureProfile: TemperatureStepPoint[] = tempSteps.map((temp) => {
      const dTh = temp - input.state1TemperatureC;
      const sig = this.solveCubicChangeOfState(sigma1, gamma1, gamma1, a, E, alpha, dTh);
      const hN = sig * A;
      const sagM = (wc * Math.pow(a, 2)) / (8 * hN);
      const clearanceM = input.crossarmAttachmentHeightM - sagM;
      const sf = RTS / (hN + wc * sagM);

      return {
        temperatureC: temp,
        horizontalTensionKn: Number((hN / 1000).toFixed(2)),
        mechanicalStressMpa: Number(sig.toFixed(2)),
        midSpanSagMeters: Number(sagM.toFixed(2)),
        groundClearanceMeters: Number(clearanceM.toFixed(2)),
        safetyFactorRts: Number(sf.toFixed(2))
      };
    });

    const overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT' =
      (isGroundClearanceCompliant && isTensionSafetyCompliant) ? 'COMPLIANT' : 'NON_COMPLIANT';

    const advisoryInterpretation = {
      fr: overallVerdict === 'COMPLIANT'
        ? `Ligne aérienne 100% CONFORME selon CEI 60826 : Avec une flèche verticale maximale de ${verticalSagMeters.toFixed(2)} m sous ${input.state2TemperatureC}°C (vent ${vw} m/s), la garde au sol réelle de ${actualGroundClearanceMeters.toFixed(2)} m respecte la distance réglementaire minimale (${input.minRequiredGroundClearanceM} m) avec une marge de +${(actualGroundClearanceMeters - input.minRequiredGroundClearanceM).toFixed(2)} m. Le coefficient de sécurité mécanique vis-à-vis de la charge de rupture RTS est de ${safetyFactorAgainstRts.toFixed(2)} ≥ 2.5.`
        : `NON CONFORME selon CEI 60826 : ${!isGroundClearanceCompliant ? `Garde au sol insuffisante (${actualGroundClearanceMeters.toFixed(2)} m < ${input.minRequiredGroundClearanceM} m réglementaire) ! Risque critique d'amorçage à la terre avec la végétation ou le trafic routier. ` : ''}${!isTensionSafetyCompliant ? `Tension mécanique excessive : coefficient de sécurité ${safetyFactorAgainstRts.toFixed(2)} < 2.5 (surcharge sur les pylônes).` : ''} Réduire la portée équivalente ou surélever les supports.`,
      en: overallVerdict === 'COMPLIANT'
        ? `Overhead line 100% COMPLIANT per IEC 60826: Maximum vertical sag of ${verticalSagMeters.toFixed(2)} m at ${input.state2TemperatureC}°C (${vw} m/s wind) maintains an actual ground clearance of ${actualGroundClearanceMeters.toFixed(2)} m, exceeding the statutory minimum of ${input.minRequiredGroundClearanceM} m (margin +${(actualGroundClearanceMeters - input.minRequiredGroundClearanceM).toFixed(2)} m). Mechanical safety factor against RTS is ${safetyFactorAgainstRts.toFixed(2)} ≥ 2.5.`
        : `NON-COMPLIANT under IEC 60826: ${!isGroundClearanceCompliant ? `Insufficient ground clearance (${actualGroundClearanceMeters.toFixed(2)} m < ${input.minRequiredGroundClearanceM} m minimum)! Risk of flashover to ground, vegetation or road traffic. ` : ''}${!isTensionSafetyCompliant ? `Excessive mechanical tension: safety factor ${safetyFactorAgainstRts.toFixed(2)} < 2.5.` : ''} Shorten ruling span or increase tower attachment height.`
    };

    return {
      conductor,
      rulingSpanM: a,
      state1: {
        temperatureC: input.state1TemperatureC,
        horizontalTensionN: Number(H1.toFixed(1)),
        horizontalTensionKn: Number((H1 / 1000).toFixed(2)),
        mechanicalStressMpa: Number(sigma1.toFixed(2)),
        midSpanSagMeters: Number(f1.toFixed(2)),
        percentRts: input.state1TensionPercentRts
      },
      state2: {
        temperatureC: input.state2TemperatureC,
        windSpeedMPerS: vw,
        windPressurePa: Number(windPressurePa.toFixed(1)),
        windForcePerMeterN: Number(windForcePerMeterN.toFixed(2)),
        resultantWeightPerMeterN: Number(resultantWeightPerMeterN.toFixed(2)),
        windDeflectionAngleDeg: Number(windDeflectionAngleDeg.toFixed(1)),
        horizontalTensionN: Number(H2.toFixed(1)),
        horizontalTensionKn: Number((H2 / 1000).toFixed(2)),
        mechanicalStressMpa: Number(sigma2.toFixed(2)),
        totalMidSpanSagMeters: Number(totalMidSpanSagMeters.toFixed(2)),
        verticalSagMeters: Number(verticalSagMeters.toFixed(2)),
        horizontalSwingMeters: Number(horizontalSwingMeters.toFixed(2)),
        maxTensionAtSupportKn: Number(maxTensionAtSupportKn.toFixed(2)),
        safetyFactorAgainstRts: Number(safetyFactorAgainstRts.toFixed(2)),
        percentRts: Number(((maxTensionAtSupportKn * 1000 / RTS) * 100).toFixed(1)),
        actualGroundClearanceMeters: Number(actualGroundClearanceMeters.toFixed(2)),
        isGroundClearanceCompliant,
        isTensionSafetyCompliant
      },
      temperatureProfile,
      overallVerdict,
      advisoryInterpretation
    };
  }
}

/**
 * Authentic Cameroon Overhead Transmission Line Presets
 */
export const CAMEROON_TRANSMISSION_LINE_PRESETS: CameroonTransmissionLinePreset[] = [
  {
    id: 'songloulou-mangombe-225kv-aster570',
    name: {
      fr: 'Ligne 225 kV Song Loulou — Mangombé (Edéa) [Aster 570 mm²]',
      en: '225 kV Song Loulou — Mangombé Line (Edéa) [Aster 570 mm²]'
    },
    corridor: {
      fr: 'Corridor d\'Évacuation Hydroélectrique Song Loulou (RIS)',
      en: 'Song Loulou Hydro Step-Up Transmission Corridor (RIS)'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Ligne dorsale majeure du Réseau Interconnecté Sud (RIS). Portée équivalente de 380 m, conducteur Almelec Aster 570 mm² (RTS = 166 kN). Vérification de la flèche maximale à 75°C et de la garde au sol minimale de 7.5 m.',
      en: 'Core transmission backbone of the Cameroon Southern Interconnected Grid. 380 m ruling span, Aster 570 mm² AAAC conductor (RTS 166 kN). Maximum sag verification at 75°C and 7.5 m statutory ground clearance.'
    },
    input: {
      conductorKey: 'aster_570',
      rulingSpanMeters: 380,
      state1TemperatureC: 15,
      state1TensionPercentRts: 18.0, // EDS ~ 29.88 kN
      state2TemperatureC: 75,
      state2WindSpeedMPerS: 0,
      minRequiredGroundClearanceM: 7.5,
      crossarmAttachmentHeightM: 22.0
    }
  },
  {
    id: 'nachtigal-bafoussam-225kv-mountain',
    name: {
      fr: 'Ligne 225 kV Nachtigal — Bafoussam (Franchissement Montagneux Ouest)',
      en: '225 kV Nachtigal — Bafoussam Mountain Crossing (Western Highlands)'
    },
    corridor: {
      fr: 'Interconnexion Nachtigal — Poste 225/90 kV de Bafoussam',
      en: 'Nachtigal — Bafoussam 225/90 kV Regional Intertie'
    },
    facility: {
      fr: 'Interconnexion Nachtigal — Poste 225/90 kV de Bafoussam',
      en: 'Nachtigal — Bafoussam 225/90 kV Regional Intertie'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Franchissement des vallées et reliefs escarpés de la région de l\'Ouest. Portée moyenne de 520 m sous fortes rafales de vent (32 m/s = 115 km/h) et vérification du débattement latéral (balancement du conducteur).',
      en: 'Valley crossing in the rugged highlands of Western Cameroon. 520 m long ruling span subjected to 32 m/s wind gusts (115 km/h) with conductor swing and blowout clearance check.'
    },
    input: {
      conductorKey: 'aster_570',
      rulingSpanMeters: 520,
      state1TemperatureC: 15,
      state1TensionPercentRts: 20.0,
      state2TemperatureC: 25,
      state2WindSpeedMPerS: 32.0,
      minRequiredGroundClearanceM: 8.5,
      crossarmAttachmentHeightM: 32.0
    }
  },
  {
    id: 'edea-douala-90kv-coastal',
    name: {
      fr: 'Ligne 90 kV Edéa — Douala (Logbaba / Bassa) [Aster 228 mm²]',
      en: '90 kV Edéa — Douala Line (Logbaba / Bassa) [Aster 228 mm²]'
    },
    corridor: {
      fr: 'Liaison Littorale Centrale Edéa — Pôle Industriel Douala',
      en: 'Edéa Coastal Link — Douala Industrial Economic Hub'
    },
    facility: {
      fr: 'Liaison Littorale Centrale Edéa — Pôle Industriel Douala',
      en: 'Edéa Coastal Link — Douala Industrial Economic Hub'
    },
    voltageLevel: 'HTB 90 kV',
    description: {
      fr: 'Alimentation du grand pôle industriel de Douala depuis le nœud d\'Edéa. Conducteur Aster 228 mm² (RTS 67.4 kN), portée de 260 m, garde au sol de 6.5 m en zone péri-urbaine.',
      en: 'High-voltage industrial supply to Douala from Edéa hub. Aster 228 mm² conductor (RTS 67.4 kN), 260 m ruling span, 6.5 m statutory ground clearance in peri-urban terrain.'
    },
    input: {
      conductorKey: 'aster_228',
      rulingSpanMeters: 260,
      state1TemperatureC: 20,
      state1TensionPercentRts: 20.0,
      state2TemperatureC: 70,
      state2WindSpeedMPerS: 0,
      minRequiredGroundClearanceM: 6.5,
      crossarmAttachmentHeightM: 16.5
    }
  },
  {
    id: 'bafoussam-bamenda-30kv-rural',
    name: {
      fr: 'Départ Mixte 30 kV Bafoussam — Mbouda — Bamenda [Aster 148 mm²]',
      en: '30 kV Bafoussam — Mbouda — Bamenda Feeder [Aster 148 mm²]'
    },
    corridor: {
      fr: 'Réseau Moyenne Tension Inter-Régional Ouest / Nord-Ouest',
      en: 'West / North-West Inter-Regional Distribution Feeder'
    },
    facility: {
      fr: 'Réseau Moyenne Tension Inter-Régional Ouest / Nord-Ouest',
      en: 'West / North-West Inter-Regional Distribution Feeder'
    },
    voltageLevel: 'HTA 30 kV',
    description: {
      fr: 'Ligne moyenne tension 30 kV sur poteaux béton/bois en zone de collines. Conducteur Aster 148 mm², portée de 180 m, garde au sol réglementaire de 6.0 m au-dessus des cultures.',
      en: '30 kV medium-voltage line across highland terrain. Aster 148 mm² conductor, 180 m span, 6.0 m statutory clearance above agricultural terrain.'
    },
    input: {
      conductorKey: 'aster_148',
      rulingSpanMeters: 180,
      state1TemperatureC: 20,
      state1TensionPercentRts: 20.0,
      state2TemperatureC: 60,
      state2WindSpeedMPerS: 0,
      minRequiredGroundClearanceM: 6.0,
      crossarmAttachmentHeightM: 12.0
    }
  }
];
