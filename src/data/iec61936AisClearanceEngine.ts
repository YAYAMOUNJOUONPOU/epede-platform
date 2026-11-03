// src/data/iec61936AisClearanceEngine.ts
// EPEDE 2.0: High-Voltage Air-Insulated Substation (AIS) Clearances & Insulation Coordination Engine
// Normative standards: IEC 61936-1, IEC 60071-1, IEC 60071-2, IEC/TS 60815-1, IEEE Std 1427
// Physics: Minimum phase-to-earth N, phase-to-phase P, pedestrian B1, vehicular B2 clearances,
// altitude dielectric derating ka, insulator creepage under pollution classes, and surge arrester protective margin.

export type SubstationVoltageTier = 15 | 30 | 90 | 225 | 400;
export type PollutionClass = 'class_a_very_light' | 'class_b_light' | 'class_c_medium' | 'class_d_heavy' | 'class_e_very_heavy';
export type SubstationEnvironmentType = 'coastal_marine' | 'tropical_inland' | 'high_plateau' | 'sahelian_dust';

export interface AisClearanceInput {
  nominalVoltageKv: SubstationVoltageTier;
  highestVoltageUmKv: number; // Um (e.g. 17.5, 36, 100, 245, 420 kV)
  bilKvPeak: number; // Basic Lightning Impulse Insulation Level (e.g. 95, 170, 450, 1050 kV)
  silKvPeak?: number; // Switching Impulse Level (for Um >= 245 kV, e.g. 850 kV)
  altitudeMeters: number; // Substation altitude above sea level H (m)
  pollutionClass: PollutionClass;
  surgeArresterDistanceMeters: number; // Distance between arrester and equipment (m)
  surgeArresterResidualVoltageKv: number; // U_res at 10 kA (e.g. 560 kV for 225 kV)
  lightningSteepnessKvPerUs?: number; // Surge wavefront steepness S (typically 1200 kV/us)
  busbarSpanLengthM?: number; // Span length for conductor swing check (m)
  maxWindSpeedMs?: number; // Design wind speed for conductor deflection (m/s)
}

export interface ClearanceBreakdown {
  phaseToEarthNMm: number; // N (minimum clearance in air to earthed structures)
  phaseToPhasePMm: number; // P (minimum clearance in air between phases)
  pedestrianSafetyB1Mm: number; // B1 = H_person (2250) + N (pedestrian ground clearance)
  vehicularSafetyB2Mm: number; // B2 = H_truck (3500) + N + 500 (vehicular circulation clearance)
  boundaryFenceDistanceCMm: number; // C = N + 1500 (fence safety barrier distance)
  solidWallDistanceMm: number; // N + 1000 (solid wall barrier distance)
  minBusbarHeightAboveGroundMm: number; // Minimum height of busbars above yard level
}

export interface AisClearanceOutput {
  nominalVoltageKv: SubstationVoltageTier;
  highestVoltageUmKv: number;
  bilKvPeak: number;
  altitudeMeters: number;

  // Atmospheric & Altitude Derating (IEC 60071-1)
  altitudeCorrectionFactorKa: number;
  isAltitudeDeratingApplied: boolean;
  clearancesStandard: ClearanceBreakdown; // Base clearances at sea level (H <= 1000m)
  clearancesCorrected: ClearanceBreakdown; // Corrected clearances with altitude factor ka

  // Insulator Creepage Sizing (IEC/TS 60815)
  specificCreepageMmPerKv: number;
  minInsulatorCreepageDistanceMm: number;
  recommendedArresterCreepageMm: number;

  // Surge Arrester Insulation Coordination (IEC 60071-2)
  effectiveSurgeSteepnessKvPerUs: number;
  waveReflectionVoltageAtTrafoKvPeak: number;
  surgeArresterProtectiveMarginPercent: number;
  maxAllowableArresterDistanceMeters: number;
  isProtectiveMarginCompliant: boolean; // True if margin >= 20%

  // Equipment Layout & Geometrical Nodes for 2.5D Substation Inspector
  gantryHeightMm: number;
  breakerPhaseSpacingMm: number;
  disconnectorHeightMm: number;
  yardBayWidthMm: number;
  isYardLayoutCompliant: boolean;
  advisoryNotes: { fr: string; en: string }[];
}

export interface CameroonSubstationAisPreset {
  id: string;
  name: { fr: string; en: string };
  location: { fr: string; en: string };
  region: { fr: string; en: string };
  input: AisClearanceInput;
  description: { fr: string; en: string };
}

export class Iec61936AisClearanceEngine {
  /**
   * Reference minimum phase-to-earth N (mm) and phase-to-phase P (mm) at sea level (IEC 61936-1 Table 1 & Table 2)
   */
  public static readonly BASE_CLEARANCES: Record<SubstationVoltageTier, { um: number; bil: number; n: number; p: number }> = {
    15: { um: 17.5, bil: 95, n: 160, p: 200 },
    30: { um: 36.0, bil: 170, n: 320, p: 380 },
    90: { um: 100.0, bil: 450, n: 900, p: 1100 },
    225: { um: 245.0, bil: 1050, n: 1900, p: 2400 },
    400: { um: 420.0, bil: 1425, n: 3100, p: 3900 },
  };

  /**
   * Specific Creepage Distance (SPS) in mm/kV of highest system voltage Um (IEC/TS 60815-1 Table 1)
   */
  public static readonly SPECIFIC_CREEPAGE_MM_PER_KV: Record<PollutionClass, number> = {
    class_a_very_light: 22.0,
    class_b_light: 27.8,
    class_c_medium: 34.7,
    class_d_heavy: 43.3,
    class_e_very_heavy: 53.7,
  };

  /**
   * Computes the Altitude Correction Factor ka according to IEC 60071-1 Clause 4.2
   * For H > 1000 m: ka = e^(m * (H - 1000) / 8150), where m = 1.0 for lightning impulse BIL
   */
  public static calculateAltitudeFactorKa(altitudeMeters: number): number {
    if (altitudeMeters <= 1000) {
      return 1.0;
    }
    const mFactor = 1.0; // conservative for lightning impulse
    const deltaH = altitudeMeters - 1000;
    const exponent = (mFactor * deltaH) / 8150;
    return Number(Math.exp(exponent).toFixed(4));
  }

  /**
   * Solves complete AIS substation clearance metrics and insulation coordination
   */
  public static solve(input: AisClearanceInput): AisClearanceOutput {
    const {
      nominalVoltageKv,
      altitudeMeters,
      pollutionClass,
      surgeArresterDistanceMeters,
      surgeArresterResidualVoltageKv
    } = input;

    const baseData = this.BASE_CLEARANCES[nominalVoltageKv];
    const highestVoltageUmKv = input.highestVoltageUmKv || baseData.um;
    const bilKvPeak = input.bilKvPeak || baseData.bil;

    // 1. Altitude Correction Factor ka
    const altitudeCorrectionFactorKa = this.calculateAltitudeFactorKa(altitudeMeters);
    const isAltitudeDeratingApplied = altitudeCorrectionFactorKa > 1.001;

    // 2. Base Clearances (IEC 61936-1)
    const baseN = baseData.n;
    const baseP = baseData.p;
    const basePedestrianB1 = 2250 + baseN; // 2.25m personnel reach + N
    const baseVehicularB2 = 3500 + baseN + 500; // 3.5m vehicle + safety margin + N
    const baseBoundaryC = baseN + 1500; // 1.5m clearance to wire mesh fence
    const baseWall = baseN + 1000; // 1.0m to solid wall

    const clearancesStandard: ClearanceBreakdown = {
      phaseToEarthNMm: baseN,
      phaseToPhasePMm: baseP,
      pedestrianSafetyB1Mm: basePedestrianB1,
      vehicularSafetyB2Mm: baseVehicularB2,
      boundaryFenceDistanceCMm: baseBoundaryC,
      solidWallDistanceMm: baseWall,
      minBusbarHeightAboveGroundMm: Math.max(basePedestrianB1, baseVehicularB2),
    };

    // 3. Altitude-Corrected Clearances
    const correctedN = Math.ceil(baseN * altitudeCorrectionFactorKa);
    const correctedP = Math.ceil(baseP * altitudeCorrectionFactorKa);
    const correctedPedestrianB1 = 2250 + correctedN;
    const correctedVehicularB2 = 3500 + correctedN + 500;
    const correctedBoundaryC = correctedN + 1500;
    const correctedWall = correctedN + 1000;

    const clearancesCorrected: ClearanceBreakdown = {
      phaseToEarthNMm: correctedN,
      phaseToPhasePMm: correctedP,
      pedestrianSafetyB1Mm: correctedPedestrianB1,
      vehicularSafetyB2Mm: correctedVehicularB2,
      boundaryFenceDistanceCMm: correctedBoundaryC,
      solidWallDistanceMm: correctedWall,
      minBusbarHeightAboveGroundMm: Math.max(correctedPedestrianB1, correctedVehicularB2),
    };

    // 4. Insulator Creepage Distance (IEC/TS 60815-1)
    const specificCreepageMmPerKv = this.SPECIFIC_CREEPAGE_MM_PER_KV[pollutionClass];
    const minInsulatorCreepageDistanceMm = Math.round(specificCreepageMmPerKv * highestVoltageUmKv);
    const recommendedArresterCreepageMm = Math.round(minInsulatorCreepageDistanceMm * 1.05);

    // 5. Surge Arrester Traveling Wave Separation & Protective Margin (IEC 60071-2)
    const effectiveSurgeSteepnessKvPerUs = input.lightningSteepnessKvPerUs || 1200; // kV/us
    const vCelerityMPerUs = 300.0; // speed of light in substation conductors (m/us)

    // Overvoltage at equipment terminals due to reflection:
    // U_T = U_res + 2 * (S / v) * d
    const waveReflectionDeltaKv = (2 * effectiveSurgeSteepnessKvPerUs * surgeArresterDistanceMeters) / vCelerityMPerUs;
    const waveReflectionVoltageAtTrafoKvPeak = Number((surgeArresterResidualVoltageKv + waveReflectionDeltaKv).toFixed(1));

    // Protective Margin: PM = ((BIL / U_T) - 1) * 100%
    const surgeArresterProtectiveMarginPercent = Number((((bilKvPeak / waveReflectionVoltageAtTrafoKvPeak) - 1) * 100).toFixed(1));
    const isProtectiveMarginCompliant = surgeArresterProtectiveMarginPercent >= 20.0;

    // Maximum permissible distance d_max to guarantee PM >= 20%
    // d_max = ((BIL / 1.20) - U_res) * v / (2 * S)
    const maxUtAllowable = bilKvPeak / 1.20;
    const maxDeltaAllowable = Math.max(0, maxUtAllowable - surgeArresterResidualVoltageKv);
    const maxAllowableArresterDistanceMeters = Number(((maxDeltaAllowable * vCelerityMPerUs) / (2 * effectiveSurgeSteepnessKvPerUs)).toFixed(1));

    // 6. Substation Bay Structural Proportions for 2.5D Inspector (mm)
    const gantryHeightMm = Math.max(6500, clearancesCorrected.minBusbarHeightAboveGroundMm + 3000);
    const breakerPhaseSpacingMm = Math.max(correctedP + 400, nominalVoltageKv === 225 ? 3500 : nominalVoltageKv === 90 ? 2200 : 1200);
    const disconnectorHeightMm = clearancesCorrected.pedestrianSafetyB1Mm + 500;
    const yardBayWidthMm = Math.max(8000, breakerPhaseSpacingMm * 3 + 2000);

    const isYardLayoutCompliant = clearancesCorrected.phaseToEarthNMm >= baseData.n && isProtectiveMarginCompliant;

    // 7. Expert Advisory Notes
    const advisoryNotes: { fr: string; en: string }[] = [];

    if (isAltitudeDeratingApplied) {
      advisoryNotes.push({
        fr: `Déclassement diélectrique d'altitude (CEI 60071-1) : À l'altitude de ${altitudeMeters} m, la raréfaction de l'air impose un coefficient multiplicateur ka = ${altitudeCorrectionFactorKa}. La distance phase-masse passe de ${baseN} mm à ${correctedN} mm (+${correctedN - baseN} mm).`,
        en: `Altitude Dielectric Derating (IEC 60071-1): At ${altitudeMeters} m elevation, lower air density demands a safety multiplier ka = ${altitudeCorrectionFactorKa}. Phase-to-earth clearance increases from ${baseN} mm to ${correctedN} mm (+${correctedN - baseN} mm).`
      });
    }

    if (pollutionClass === 'class_d_heavy' || pollutionClass === 'class_e_very_heavy') {
      advisoryNotes.push({
        fr: `Sévérité de pollution saline/industrielle (CEI 60815) : Ligne de fuite minimale de ${minInsulatorCreepageDistanceMm} mm (${specificCreepageMmPerKv} mm/kV). Privilégier des isolateurs en caoutchouc silicone composite (SIR) à profil alterné pour prévenir le contournement par brouillard salin.`,
        en: `High Pollution Severity (IEC 60815): Minimum creepage distance of ${minInsulatorCreepageDistanceMm} mm (${specificCreepageMmPerKv} mm/kV). Specify hydrophobic silicone composite (SIR) insulators with alternating sheds to avert saline fog flashover.`
      });
    }

    if (!isProtectiveMarginCompliant) {
      advisoryNotes.push({
        fr: `ALERTE MARGE DE PROTECTION INSUFFISANTE : La distance parafoudre/transformateur de ${surgeArresterDistanceMeters} m engendre une tension d'onde réfléchie de ${waveReflectionVoltageAtTrafoKvPeak} kV (marge PM = ${surgeArresterProtectiveMarginPercent}% < 20%). Rapprocher le parafoudre à moins de ${maxAllowableArresterDistanceMeters} m des traversées.`,
        en: `INSUFFICIENT PROTECTIVE MARGIN ALERT: Separation distance of ${surgeArresterDistanceMeters} m produces a reflected wave peak of ${waveReflectionVoltageAtTrafoKvPeak} kV (PM = ${surgeArresterProtectiveMarginPercent}% < 20%). Relocate surge arrester within ${maxAllowableArresterDistanceMeters} m of transformer bushings.`
      });
    } else {
      advisoryNotes.push({
        fr: `Coordination de l'isolement conforme : Marge de sécurité onde de choc parafoudre PM = ${surgeArresterProtectiveMarginPercent}% (≥ 20% requis par la CEI 60071-2). Distance maximale admissible : ${maxAllowableArresterDistanceMeters} m.`,
        en: `Insulation coordination compliant: Surge arrester lightning protective margin PM = ${surgeArresterProtectiveMarginPercent}% (≥ 20% required by IEC 60071-2). Maximum permissible separation: ${maxAllowableArresterDistanceMeters} m.`
      });
    }

    return {
      nominalVoltageKv,
      highestVoltageUmKv,
      bilKvPeak,
      altitudeMeters,
      altitudeCorrectionFactorKa,
      isAltitudeDeratingApplied,
      clearancesStandard,
      clearancesCorrected,
      specificCreepageMmPerKv,
      minInsulatorCreepageDistanceMm,
      recommendedArresterCreepageMm,
      effectiveSurgeSteepnessKvPerUs,
      waveReflectionVoltageAtTrafoKvPeak,
      surgeArresterProtectiveMarginPercent,
      maxAllowableArresterDistanceMeters,
      isProtectiveMarginCompliant,
      gantryHeightMm,
      breakerPhaseSpacingMm,
      disconnectorHeightMm,
      yardBayWidthMm,
      isYardLayoutCompliant,
      advisoryNotes
    };
  }
}

export const CAMEROON_AIS_PRESETS: CameroonSubstationAisPreset[] = [
  {
    id: 'bekoko-225kv-coastal',
    name: {
      fr: 'Poste 225/90/15 kV Békoko (Douala Ouest) — Travée Ligne 225 kV Littoral',
      en: 'Békoko 225/90/15 kV Substation (Douala West) — 225 kV Coastal Line Bay'
    },
    location: {
      fr: 'Corridor d’évacuation Nachtigal/Song Loulou — Békoko, Entrée Ouest Douala',
      en: 'Nachtigal/Song Loulou Power Evacuation Corridor — Békoko, West Douala'
    },
    region: {
      fr: 'Littoral (Niveau de la mer, Pollution marine et industrielle forte)',
      en: 'Littoral (Sea level, Heavy maritime and industrial pollution)'
    },
    input: {
      nominalVoltageKv: 225,
      highestVoltageUmKv: 245,
      bilKvPeak: 1050,
      silKvPeak: 850,
      altitudeMeters: 25,
      pollutionClass: 'class_d_heavy',
      surgeArresterDistanceMeters: 8.0,
      surgeArresterResidualVoltageKv: 560,
      lightningSteepnessKvPerUs: 1200,
      busbarSpanLengthM: 14.0,
      maxWindSpeedMs: 32
    },
    description: {
      fr: 'Poste stratégique d’interconnexion 225 kV de l’agglomération de Douala situé en zone côtière humide soumise aux embruns marins et brouillards salins.',
      en: 'Strategic 225 kV interconnection node for the Douala metro area located in humid coastal terrain exposed to saline sea spray and marine corrosion.'
    }
  },
  {
    id: 'nomayos-225kv-inland',
    name: {
      fr: 'Poste 225/90/30 kV Nomayos (Yaoundé Sud) — Travée Transformateur 225 kV',
      en: 'Nomayos 225/90/30 kV Substation (Yaoundé South) — 225 kV Transformer Bay'
    },
    location: {
      fr: 'Yaoundé Sud — Corridor Interconnexion Memve’ele & Boucle 225 kV',
      en: 'Yaoundé South — Memve’ele Transmission Corridor & 225 kV Loop'
    },
    region: {
      fr: 'Centre (Altitude modérée 750 m, Climat tropical humide de forêt)',
      en: 'Centre (Moderate altitude 750 m, Humid tropical forest climate)'
    },
    input: {
      nominalVoltageKv: 225,
      highestVoltageUmKv: 245,
      bilKvPeak: 1050,
      silKvPeak: 850,
      altitudeMeters: 750,
      pollutionClass: 'class_c_medium',
      surgeArresterDistanceMeters: 6.5,
      surgeArresterResidualVoltageKv: 560,
      lightningSteepnessKvPerUs: 1200,
      busbarSpanLengthM: 12.0,
      maxWindSpeedMs: 28
    },
    description: {
      fr: 'Noeud de transformation 225/90 kV alimentant la capitale Yaoundé, soumis aux orages équatoriaux fréquents (niveau kéraunique Nk = 120 jours/an).',
      en: '225/90 kV power transformation hub feeding Yaoundé capital, subject to frequent equatorial lightning storms (keraunic level Nk = 120 days/year).'
    }
  },
  {
    id: 'bafoussam-90kv-highland',
    name: {
      fr: 'Poste 90/30/15 kV Bafoussam (Hauts-Plateaux de l’Ouest) — Travée 90 kV Haute Altitude',
      en: 'Bafoussam 90/30/15 kV Substation (Western Highlands) — 90 kV High-Altitude Bay'
    },
    location: {
      fr: 'Bafoussam Banengo — Réseau Interconnecté Sud (RIS Ouest)',
      en: 'Bafoussam Banengo — Southern Interconnected Grid (Western Ring)'
    },
    region: {
      fr: 'Ouest (Altitude 1520 m, Déclassement diélectrique CEI 60071-1 obligatoire)',
      en: 'West (Elevation 1520 m, Mandatory IEC 60071-1 dielectric derating)'
    },
    input: {
      nominalVoltageKv: 90,
      highestVoltageUmKv: 100,
      bilKvPeak: 450,
      altitudeMeters: 1520,
      pollutionClass: 'class_b_light',
      surgeArresterDistanceMeters: 5.0,
      surgeArresterResidualVoltageKv: 245,
      lightningSteepnessKvPerUs: 1000,
      busbarSpanLengthM: 10.0,
      maxWindSpeedMs: 30
    },
    description: {
      fr: 'Poste de répartition 90 kV perché sur les hauts-plateaux bamiléké à 1520 m nécessitant une surélévation des barres et un élargissement des distances d’isolement.',
      en: '90 kV distribution substation perched in the western highlands at 1520 m requiring elevated busbars and widened air insulation clearances.'
    }
  },
  {
    id: 'ngaoundere-90kv-plateau',
    name: {
      fr: 'Poste 90/15 kV Ngaoundéré (Château d’Eau) — Travée Ligne 90 kV RIN',
      en: 'Ngaoundéré 90/15 kV Substation (Water Tower) — 90 kV Northern Grid Line Bay'
    },
    location: {
      fr: 'Ngaoundéré Ville — Terminus Ligne 90 kV Lagdo / Plateau de l’Adamaoua',
      en: 'Ngaoundéré City — Terminal of 90 kV Lagdo Transmission Line / Adamawa Plateau'
    },
    region: {
      fr: 'Adamaoua (Altitude 1150 m, Poussières d’Harmattan et orages de transition)',
      en: 'Adamawa (Elevation 1150 m, Dry Harmattan dust and transition storms)'
    },
    input: {
      nominalVoltageKv: 90,
      highestVoltageUmKv: 100,
      bilKvPeak: 450,
      altitudeMeters: 1150,
      pollutionClass: 'class_c_medium',
      surgeArresterDistanceMeters: 6.0,
      surgeArresterResidualVoltageKv: 245,
      lightningSteepnessKvPerUs: 1000,
      busbarSpanLengthM: 10.0,
      maxWindSpeedMs: 25
    },
    description: {
      fr: 'Extrémité Sud du Réseau Interconnecté Nord (RIN) sur le plateau de l’Adamaoua exposé aux vents secs de l’Harmattan transportant des poussières abrasives.',
      en: 'Southern terminal of the Northern Interconnected Network (RIN) on the Adamawa plateau exposed to dry Harmattan winds carrying abrasive dust.'
    }
  }
];

