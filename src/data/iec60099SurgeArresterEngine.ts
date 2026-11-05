// src/data/iec60099SurgeArresterEngine.ts
// EPEDE 2.0: IEC 60099-4 / IEC 60071-1 / IEC 60071-2 / IEEE C62.11 Metal-Oxide Surge Arrester & Insulation Coordination Engine
// Normative standards: IEC 60099-4:2014 (Metal-oxide surge arresters without gaps),
// IEC 60071-1:2019 (Insulation co-ordination definitions and rules),
// IEC 60071-2:2018 (Application guidelines and traveling wave reflections),
// IEC 60815-1/2/3 (Selection of insulators under polluted conditions)

export type ArresterGroundingMode = 'solid' | 'impedance' | 'isolated';
export type ArresterPollutionClass = 'low' | 'medium' | 'heavy' | 'very_heavy';
export type ArresterHousingMaterial = 'silicone' | 'porcelain';
export type ArresterDischargeClass = 'DH' | 'SL' | 'SM' | 'SH'; // Distribution High, Station Light, Medium, Heavy

export interface SurgeArresterInput {
  nominalVoltageKv: number; // Un (kV rms)
  highestSystemVoltageUmKv: number; // Um (kV rms)
  groundingMode: ArresterGroundingMode; // Solid, Impedance, or Isolated neutral
  earthFaultDurationSec: number; // Duration of temporary overvoltage tf (s)
  transformerBilKvPeak: number; // Equipment Lightning Impulse Withstand (BIL, kV peak)
  transformerBslKvPeak?: number; // Equipment Switching Impulse Withstand (BSL, kV peak)
  nominalDischargeCurrentKa: 10 | 20; // In (kA 8/20 µs)
  lightningWavefrontSteepnessKvPerUs: number; // S (kV/µs, typically 500 to 1200)
  separationDistanceMeters: number; // Distance between arrester and protected transformer (m)
  pollutionClass: ArresterPollutionClass; // Site pollution severity per IEC 60815
  housingMaterial: ArresterHousingMaterial;
  siteAltitudeMeters?: number; // Altitude H (m above sea level)
}

export interface SurgeArresterCalculationResult {
  // Continuous Operating Voltage (Uc / MCOV)
  phaseToGroundMaxRmsKv: number; // Um / √3
  minContinuousOperatingVoltageUcKv: number; // Uc_min (kV rms)
  selectedContinuousOperatingVoltageUcKv: number; // Uc (commercial rating, kV rms)

  // Temporary Overvoltage (TOV) & Rated Voltage (Ur)
  earthFaultFactorKe: number; // ke (1.40 for solid, 1.50 for impedance, 1.732 for isolated)
  systemTovVoltageKv: number; // ke · (Um / √3)
  arresterTovFactorKtov: number; // ktov(tf) capability factor
  minRatedVoltageByTovUrKv: number; // U_TOV / ktov
  minRatedVoltageByUcUrKv: number; // Uc / 0.80
  selectedRatedVoltageUrKv: number; // Ur (commercial rating, kV rms)

  // Residual Protective Clamping Levels
  lightningImpulseProtectionLevelUplKv: number; // Upl at In (8/20 µs, kV peak)
  switchingImpulseProtectionLevelUpsKv: number; // Ups (30/60 µs, kV peak)
  steepCurrentImpulseProtectionLevelKv: number; // U_steep (1/20 µs, kV peak)

  // Protective Margins (Insulation Coordination)
  effectiveBslKv: number; // BSL (kV peak, ~0.83 · BIL)
  lightningProtectiveMarginPercent: number; // MPL = (BIL - Upl) / Upl · 100% (target ≥ 20%)
  switchingProtectiveMarginPercent: number; // MPS = (BSL - Ups) / Ups · 100% (target ≥ 15%)
  isLightningMarginCompliant: boolean;
  isSwitchingMarginCompliant: boolean;

  // Wave Reflection & Separation Distance (Lmax)
  waveReflectionVoltageAtTrafoKvPeak: number; // Ut = Upl + 2 · (S / v) · d
  maxAllowableSeparationDistanceMeters: number; // Lmax to ensure Ut ≤ BIL / 1.15
  isSeparationDistanceCompliant: boolean;

  // Energy Capability Class & Thermal Absorption
  dischargeClass: ArresterDischargeClass;
  specificThermalEnergyKjPerKv: number; // Wth (kJ/kV of Ur)
  totalThermalEnergyCapacityKj: number; // Wtotal (kJ)

  // Creepage & Environmental Withstand (IEC 60815)
  specificCreepageMmPerKv: number; // USCD (mm/kV of Um)
  minRequiredCreepageDistanceMm: number; // Lcreep (mm)

  // Overall Compliance Verdict & Advisory
  overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT';
  advisoryInterpretation: { fr: string; en: string };
}

export interface CameroonSurgeArresterPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  voltageLevel: string;
  input: SurgeArresterInput;
  description: { fr: string; en: string };
}

export class Iec60099SurgeArresterEngine {
  public static readonly WAVE_PROPAGATION_SPEED_M_PER_US = 300.0; // Speed of light in overhead line air (m/µs)
  public static readonly COORDINATION_SAFETY_FACTOR_KS = 1.15; // Coordination safety factor Ks per IEC 60071-1

  /**
   * Solves Surge Arrester MCOV (Uc), Rated Voltage (Ur), Protective Margins,
   * Wave Reflection Traveling Overvoltage, Energy Class, and Creepage (IEC 60099-4 / IEC 60071-1/2)
   */
  public static solve(input: SurgeArresterInput): SurgeArresterCalculationResult {
    const {
      nominalVoltageKv: unKv,
      highestSystemVoltageUmKv: umKv,
      groundingMode,
      earthFaultDurationSec: tf,
      transformerBilKvPeak: bilKv,
      nominalDischargeCurrentKa: inKa,
      lightningWavefrontSteepnessKvPerUs: S,
      separationDistanceMeters: dSepM,
      pollutionClass
    } = input;

    // 1. Earth Fault Factor ke (IEC 60099-4 Clause 3 / IEC 60071-1)
    let ke = 1.40;
    if (groundingMode === 'solid') {
      ke = 1.40;
    } else if (groundingMode === 'impedance') {
      ke = 1.50;
    } else {
      ke = Math.sqrt(3); // 1.732 isolated or resonant neutral
    }

    // 2. Maximum Phase-to-Ground Continuous Operating Voltage (Uc / MCOV)
    const phaseToGroundMaxRmsKv = umKv / Math.sqrt(3);
    // Standard margin: 1.05 to account for ambient temperature and voltage harmonic distortion
    const minContinuousOperatingVoltageUcKv = phaseToGroundMaxRmsKv * 1.05;
    const selectedContinuousOperatingVoltageUcKv = Math.ceil(minContinuousOperatingVoltageUcKv * 10) / 10;

    // 3. TOV (Temporary Overvoltage) Capability Factor ktov(tf)
    // Standard IEC 60099-4 ZnO TOV curve without prior duty
    let ktov = 1.05;
    if (tf <= 0.2) {
      ktov = 1.15;
    } else if (tf <= 1.0) {
      ktov = 1.05;
    } else if (tf <= 10.0) {
      ktov = 0.98;
    } else {
      ktov = 0.85; // Continuous sustained ground fault
    }

    const systemTovVoltageKv = ke * phaseToGroundMaxRmsKv;
    const minRatedVoltageByTovUrKv = systemTovVoltageKv / ktov;
    // Standard Uc / Ur ratio for ZnO station arresters typically 0.80
    const minRatedVoltageByUcUrKv = selectedContinuousOperatingVoltageUcKv / 0.80;
    const minRatedUr = Math.max(minRatedVoltageByTovUrKv, minRatedVoltageByUcUrKv);
    const selectedRatedVoltageUrKv = Math.ceil(minRatedUr);

    // 4. Residual Protective Clamping Voltages (Upl, Ups, Usteep)
    // Upl (8/20 µs at In): Typically Upl / Uc ≈ 2.50 to 2.70
    const uplRatio = inKa === 20 ? 2.65 : 2.55;
    const lightningImpulseProtectionLevelUplKv = Number((selectedContinuousOperatingVoltageUcKv * uplRatio).toFixed(1));

    // Ups (30/60 µs switching surge): Typically Ups / Uc ≈ 2.10
    const upsRatio = 2.10;
    const switchingImpulseProtectionLevelUpsKv = Number((selectedContinuousOperatingVoltageUcKv * upsRatio).toFixed(1));

    // Usteep (1/20 µs fast wavefront): Typically ~1.10 · Upl
    const steepCurrentImpulseProtectionLevelKv = Number((lightningImpulseProtectionLevelUplKv * 1.10).toFixed(1));

    // 5. Insulation Coordination Margins (IEC 60071-1 / IEEE C62.11)
    const effectiveBslKv = input.transformerBslKvPeak !== undefined
      ? input.transformerBslKvPeak
      : Number((bilKv * 0.83).toFixed(1)); // Standard oil-immersed BSL = 0.83 · BIL

    // Lightning Protective Margin MPL = (BIL - Upl) / Upl * 100% (Normative target ≥ 20%)
    const lightningProtectiveMarginPercent = Number((((bilKv - lightningImpulseProtectionLevelUplKv) / lightningImpulseProtectionLevelUplKv) * 100).toFixed(1));
    const isLightningMarginCompliant = lightningProtectiveMarginPercent >= 20.0;

    // Switching Protective Margin MPS = (BSL - Ups) / Ups * 100% (Normative target ≥ 15%)
    const switchingProtectiveMarginPercent = Number((((effectiveBslKv - switchingImpulseProtectionLevelUpsKv) / switchingImpulseProtectionLevelUpsKv) * 100).toFixed(1));
    const isSwitchingMarginCompliant = switchingProtectiveMarginPercent >= 15.0;

    // 6. Traveling Wave Reflection & Separation Distance (IEC 60071-2)
    // Wave speed in air v = 300 m/µs
    // Peak voltage at transformer terminal due to reflection ramp:
    // Ut = Upl + 2 · (S / v) · d
    const vSpeed = this.WAVE_PROPAGATION_SPEED_M_PER_US;
    const deltaUWaveKv = (2 * (S / vSpeed) * dSepM);
    const waveReflectionVoltageAtTrafoKvPeak = Number((lightningImpulseProtectionLevelUplKv + deltaUWaveKv).toFixed(1));

    // Maximum permissible distance Lmax to keep Ut ≤ BIL / 1.15
    const uMaxAllowedAtTrafo = bilKv / this.COORDINATION_SAFETY_FACTOR_KS;
    const maxAllowableSeparationDistanceMeters = Number(Math.max(0, ((uMaxAllowedAtTrafo - lightningImpulseProtectionLevelUplKv) * vSpeed) / (2 * S)).toFixed(1));
    const isSeparationDistanceCompliant = dSepM <= maxAllowableSeparationDistanceMeters;

    // 7. Energy Capability Class & Repetitive Charge (IEC 60099-4 Ed. 3.0)
    let dischargeClass: ArresterDischargeClass = 'SM';
    let specificThermalEnergyKjPerKv = 5.0; // kJ/kV of Ur

    if (inKa === 20 || unKv >= 225) {
      dischargeClass = 'SH'; // Station Heavy
      specificThermalEnergyKjPerKv = 8.0;
    } else if (unKv <= 36) {
      dischargeClass = 'SL'; // Station Light / Distribution
      specificThermalEnergyKjPerKv = 3.5;
    } else {
      dischargeClass = 'SM'; // Station Medium
      specificThermalEnergyKjPerKv = 5.5;
    }

    const totalThermalEnergyCapacityKj = Number((specificThermalEnergyKjPerKv * selectedRatedVoltageUrKv).toFixed(1));

    // 8. Creepage Distance under Site Pollution (IEC 60815-1/2/3)
    let specificCreepageMmPerKv = 20.0; // Class c (Medium)
    if (pollutionClass === 'low') specificCreepageMmPerKv = 16.0;
    else if (pollutionClass === 'medium') specificCreepageMmPerKv = 20.0;
    else if (pollutionClass === 'heavy') specificCreepageMmPerKv = 25.0;
    else if (pollutionClass === 'very_heavy') specificCreepageMmPerKv = 31.0;

    const minRequiredCreepageDistanceMm = Math.round(specificCreepageMmPerKv * umKv);

    // 9. Overall Compliance Verdict
    const overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT' =
      (isLightningMarginCompliant && isSwitchingMarginCompliant && isSeparationDistanceCompliant)
        ? 'COMPLIANT'
        : 'NON_COMPLIANT';

    // 10. Bilingual Technical Advisory
    const advisoryInterpretation = {
      fr: overallVerdict === 'COMPLIANT'
        ? `Le parafoudre ZnO de calibre Ur = ${selectedRatedVoltageUrKv} kV (Uc = ${selectedContinuousOperatingVoltageUcKv} kV, Classe ${dischargeClass}) assure une coordination d'isolement 100% CONFORME selon les normes CEI 60099-4 et CEI 60071. La marge de protection foudre (MPL = ${lightningProtectiveMarginPercent}% ≥ 20%) et la marge de manœuvre (MPS = ${switchingProtectiveMarginPercent}% ≥ 15%) protègent intégralement le transformateur (BIL ${bilKv} kV). À une distance de ${dSepM} m (inférieure à Lmax = ${maxAllowableSeparationDistanceMeters} m), la surtension d'onde réfléchie reste limitée à ${waveReflectionVoltageAtTrafoKvPeak} kV crête.`
        : `NON CONFORME selon CEI 60099-4 / CEI 60071 : ${!isSeparationDistanceCompliant ? `Distance parafoudre-transformateur excessive (${dSepM} m > Lmax = ${maxAllowableSeparationDistanceMeters} m) : la réflexion d'onde atteint ${waveReflectionVoltageAtTrafoKvPeak} kV crête, excédant le seuil de sécurité admissible (BIL/1.15 = ${uMaxAllowedAtTrafo.toFixed(0)} kV). Rapprocher le parafoudre des traversées. ` : ''}${!isLightningMarginCompliant ? `Marge foudre insuffisante (${lightningProtectiveMarginPercent}% < 20%). ` : ''}${!isSwitchingMarginCompliant ? `Marge de manœuvre insuffisante (${switchingProtectiveMarginPercent}% < 15%).` : ''}`,
      en: overallVerdict === 'COMPLIANT'
        ? `ZnO surge arrester rating Ur = ${selectedRatedVoltageUrKv} kV (Uc = ${selectedContinuousOperatingVoltageUcKv} kV, Class ${dischargeClass}) provides 100% COMPLIANT insulation coordination per IEC 60099-4 and IEC 60071. Lightning margin (MPL = ${lightningProtectiveMarginPercent}% ≥ 20%) and switching margin (MPS = ${switchingProtectiveMarginPercent}% ≥ 15%) fully protect the transformer (BIL ${bilKv} kV). At ${dSepM} m separation (below Lmax = ${maxAllowableSeparationDistanceMeters} m), wave reflection voltage remains limited to ${waveReflectionVoltageAtTrafoKvPeak} kV peak.`
        : `NON-COMPLIANT under IEC 60099-4 / IEC 60071: ${!isSeparationDistanceCompliant ? `Excessive separation distance (${dSepM} m > Lmax = ${maxAllowableSeparationDistanceMeters} m): traveling wave reflection reaches ${waveReflectionVoltageAtTrafoKvPeak} kV peak, exceeding allowable dielectric threshold (BIL/1.15 = ${uMaxAllowedAtTrafo.toFixed(0)} kV). Mount arrester closer to transformer bushings. ` : ''}${!isLightningMarginCompliant ? `Insufficient lightning protective margin (${lightningProtectiveMarginPercent}% < 20%). ` : ''}${!isSwitchingMarginCompliant ? `Insufficient switching protective margin (${switchingProtectiveMarginPercent}% < 15%).` : ''}`
    };

    return {
      phaseToGroundMaxRmsKv: Number(phaseToGroundMaxRmsKv.toFixed(2)),
      minContinuousOperatingVoltageUcKv: Number(minContinuousOperatingVoltageUcKv.toFixed(2)),
      selectedContinuousOperatingVoltageUcKv,
      earthFaultFactorKe: Number(ke.toFixed(3)),
      systemTovVoltageKv: Number(systemTovVoltageKv.toFixed(2)),
      arresterTovFactorKtov: ktov,
      minRatedVoltageByTovUrKv: Number(minRatedVoltageByTovUrKv.toFixed(2)),
      minRatedVoltageByUcUrKv: Number(minRatedVoltageByUcUrKv.toFixed(2)),
      selectedRatedVoltageUrKv,
      lightningImpulseProtectionLevelUplKv,
      switchingImpulseProtectionLevelUpsKv,
      steepCurrentImpulseProtectionLevelKv,
      effectiveBslKv,
      lightningProtectiveMarginPercent,
      switchingProtectiveMarginPercent,
      isLightningMarginCompliant,
      isSwitchingMarginCompliant,
      waveReflectionVoltageAtTrafoKvPeak,
      maxAllowableSeparationDistanceMeters,
      isSeparationDistanceCompliant,
      dischargeClass,
      specificThermalEnergyKjPerKv,
      totalThermalEnergyCapacityKj,
      specificCreepageMmPerKv,
      minRequiredCreepageDistanceMm,
      overallVerdict,
      advisoryInterpretation
    };
  }
}

/**
 * Authentic Cameroon High-Voltage Substation & Transmission Surge Arrester Presets
 */
export const CAMEROON_ARRESTER_PRESETS: CameroonSurgeArresterPreset[] = [
  {
    id: 'nachtigal-225kv-stepup',
    name: {
      fr: 'Centrale Nachtigal 420 MW — Travée Évacuation 225 kV Transformateur GSU',
      en: 'Nachtigal 420 MW Hydro Plant — 225 kV Step-Up Transformer Bay'
    },
    facility: {
      fr: 'Poste d\'Évacuation HTB 225 kV Nachtigal-Amont — SONATREL',
      en: 'Nachtigal 225 kV Step-Up Transmission Substation — SONATREL'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Protection des transformateurs élévateurs 225/13.8 kV de 70 MVA contre les coups de foudre directs et ondes de choc incidentes sur les lignes vers Yaoundé et Bafoussam. Neutre directement à la terre, BIL 1050 kV, distance de 15 m.',
      en: 'Surge protection for 70 MVA 225/13.8 kV GSU transformers against direct lightning strikes on Nachtigal-Yaoundé lines. Solidly grounded neutral, 1050 kV BIL, 15 m separation distance.'
    },
    input: {
      nominalVoltageKv: 225,
      highestSystemVoltageUmKv: 245,
      groundingMode: 'solid',
      earthFaultDurationSec: 0.2,
      transformerBilKvPeak: 1050,
      nominalDischargeCurrentKa: 10,
      lightningWavefrontSteepnessKvPerUs: 1000,
      separationDistanceMeters: 15,
      pollutionClass: 'medium',
      housingMaterial: 'silicone',
      siteAltitudeMeters: 450
    }
  },
  {
    id: 'mangombe-edea-90kv-feeders',
    name: {
      fr: 'Poste 90 kV Mangombé (Edéa) — Arrivée Lignes Transport & Industrie ALUCAM',
      en: 'Mangombé 90 kV Substation (Edéa) — Incomer & ALUCAM Feeder Bays'
    },
    facility: {
      fr: 'Nœud de Dispatching et d\'Interconnexion 90 kV Mangombé — Edéa',
      en: 'Mangombé 90 kV Transmission & Industrial Hub — Edéa'
    },
    voltageLevel: 'HTB 90 kV',
    description: {
      fr: 'Coordination de l\'isolement des transformateurs 90/15 kV alimentant les séries d\'électrolyse ALUCAM sous ambiance de pollution industrielle (fluorures/poussières). Neutre à la terre, BIL 450 kV, classe de décharge SM.',
      en: 'Insulation coordination for 90/15 kV transformers supplying ALUCAM electrolysis potlines under heavy industrial pollution. Solidly grounded neutral, 450 kV BIL, Station Medium class.'
    },
    input: {
      nominalVoltageKv: 90,
      highestSystemVoltageUmKv: 100,
      groundingMode: 'solid',
      earthFaultDurationSec: 0.5,
      transformerBilKvPeak: 450,
      nominalDischargeCurrentKa: 10,
      lightningWavefrontSteepnessKvPerUs: 800,
      separationDistanceMeters: 12,
      pollutionClass: 'heavy',
      housingMaterial: 'silicone',
      siteAltitudeMeters: 50
    }
  },
  {
    id: 'kribi-mvele-225kv-marine',
    name: {
      fr: 'Centrale Gaz Kribi 216 MW — Travée Départ Ligne 225 kV Littoral Marin',
      en: 'Kribi 216 MW Gas Plant — 225 kV Coastal Ocean-Front Outgoing Bay'
    },
    facility: {
      fr: 'Poste d\'Évacuation 225 kV Centrale Thermique Gaz de Kribi (Mpolongwe)',
      en: 'Kribi 225 kV Gas Power Transmission Substation (Mpolongwe)'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Parafoudres de classe Station Heavy (SH, 20 kA) sous atmosphère saline sévère à 1 km de l\'Océan Atlantique. Ligne de fuite minimale de 31 mm/kV (Classe e - Very Heavy), enveloppe silicone hydrophobe.',
      en: 'Station Heavy (SH, 20 kA) surge arresters in severe coastal saline atmosphere 1 km from Atlantic Ocean. Unified specific creepage distance 31 mm/kV with hydrophobic HTV silicone.'
    },
    input: {
      nominalVoltageKv: 225,
      highestSystemVoltageUmKv: 245,
      groundingMode: 'solid',
      earthFaultDurationSec: 0.2,
      transformerBilKvPeak: 1050,
      nominalDischargeCurrentKa: 20,
      lightningWavefrontSteepnessKvPerUs: 1000,
      separationDistanceMeters: 18,
      pollutionClass: 'very_heavy',
      housingMaterial: 'silicone',
      siteAltitudeMeters: 20
    }
  },
  {
    id: 'bafoussam-ouest-30kv-distribution',
    name: {
      fr: 'Poste Source 30 kV Bafoussam — Départs Ruraux Région Ouest (Zone Kéraunique Forte)',
      en: 'Bafoussam 30 kV Substation — Western Highland Rural Feeders (High Keraunic Zone)'
    },
    facility: {
      fr: 'Poste de Répartition 90/30 kV Bafoussam-Banengo',
      en: 'Bafoussam 90/30 kV Regional Distribution Substation'
    },
    voltageLevel: 'HTA 30 kV',
    description: {
      fr: 'Réseau de distribution moyenne tension 30 kV de l\'Ouest Cameroun avec neutre compensé/isolé (ke = √3 = 1.732) et niveau kéraunique exceptionnel (> 100 jours d\'orage/an). Vérification de la tenue TOV longue durée (10s).',
      en: '30 kV MV distribution network in Western Cameroon highlands with isolated/compensated neutral (ke = 1.732) and extreme lightning flash density. Long-duration TOV withstand proof (10s).'
    },
    input: {
      nominalVoltageKv: 30,
      highestSystemVoltageUmKv: 36,
      groundingMode: 'isolated',
      earthFaultDurationSec: 10.0,
      transformerBilKvPeak: 170,
      nominalDischargeCurrentKa: 10,
      lightningWavefrontSteepnessKvPerUs: 500,
      separationDistanceMeters: 8,
      pollutionClass: 'heavy',
      housingMaterial: 'silicone',
      siteAltitudeMeters: 1450
    }
  }
];

