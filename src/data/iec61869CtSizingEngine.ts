// src/data/iec61869CtSizingEngine.ts
// EPEDE 2.0: IEC 61869-2 / IEC 60044-1 / IEEE C57.13 Instrument Transformer (CT) Sizing & Saturation Engine
// Normative standards: IEC 61869-2 (Class 5P/10P, Class PX/TPS), IEEE Std C57.13 (Class C), IEEE C37.110

export type CtStandardClass = 'IEC_5P' | 'IEC_10P' | 'IEC_PX' | 'IEEE_C';

export interface CtSpecificationInput {
  standardClass: CtStandardClass;
  primaryRatedCurrentA: number; // Ipn (A)
  secondaryRatedCurrentA: 1 | 5; // Isn (1 A or 5 A)
  ratedBurdenVa?: number; // Sn (VA) for Class 5P/10P (e.g. 15 VA, 30 VA)
  ratedAlf?: number; // ALFn (e.g. 10, 15, 20, 30)
  ratedKneePointVoltageV?: number; // Vk (V) for Class PX or IEEE Class C (e.g. 200 V, 400 V)
  ratedMagnetizingCurrentAtVkA?: number; // Ie at Vk or Vk/2 (e.g. 0.02 A, 0.05 A)
  internalSecondaryResistanceRct: number; // Rct (Ω) at 75°C
  wiringLengthM: number; // Distance between CT and relay (one way)
  wiringCrossSectionMm2: number; // Copper section (mm²)
  wiringConnection: 'two_wire' | 'four_wire_common_return'; // 2*L or 1*L loop
  relayBurdenVa: number; // Digital IED or electromechanical burden
  relayBurdenResistanceOhms?: number; // Direct burden Ω if specified
  maxProspectiveFaultCurrentKa: number; // Primary symmetric short-circuit current (kA)
  systemXrRatio: number; // Network X/R ratio at CT location
  faultDurationSec: number; // Primary fault duration (typically 0.04 to 0.10 s)
  safetyFactorK: number; // Sizing safety margin (typically 1.1 to 1.5)
}

export interface CtExcitationCurvePoint {
  excitationCurrentA: number; // Ie (A secondary)
  secondaryVoltageV: number;  // Vs (V secondary)
}

export interface CtSizingCalculationResult {
  // Impedance & Burden Breakdown
  wiringResistanceOhms: number;
  relayResistanceOhms: number;
  totalActualBurdenOhms: number;
  nominalRatedBurdenOhms: number;
  
  // Secondary Currents & Fault Multiples
  secondaryFaultCurrentA: number;
  shortCircuitCurrentFactorKssc: number;
  
  // Transient Offset & Time Constant
  primaryTimeConstantTpSec: number;
  transientDimensioningFactorKtd: number;
  
  // Operating Limits (Class 5P / 10P)
  effectiveAlf: number;
  requiredAlfSymmetric: number;
  requiredAlfTransient: number;
  isAlfCompliant: boolean;
  
  // Knee-Point Voltage Limits (Class PX / TPS / IEEE C)
  requiredKneePointVoltageV: number;
  actualEstimatedKneePointVoltageV: number;
  isKneePointCompliant: boolean;
  
  // Saturation Assessment
  timeToSaturationMs: number; // Time until CT enters non-linear saturation
  isSaturationPrevented: boolean;
  saturationSeverity: 'linear_safe' | 'delayed_saturation' | 'severe_saturation';
  
  // Excitation Characteristic Curve Points
  kneePointCoordinates: { voltageV: number; currentA: number };
  operatingPointCoordinates: { voltageV: number; currentA: number };
  excitationCurve: CtExcitationCurvePoint[];
  
  // Compliance Verdict & Notes
  overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT';
  advisoryInterpretation: { fr: string; en: string };
}

export interface CameroonCtPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  protectionApplication: { fr: string; en: string };
  voltageLevel: string;
  ctInput: CtSpecificationInput;
  description: { fr: string; en: string };
}

export class Iec61869CtSizingEngine {
  /**
   * Evaluates copper resistivity at 75°C (Ω·mm²/m)
   */
  public static readonly RHO_CU_75 = 0.02165; // Ω·mm²/m

  /**
   * Generates the synthetic B-H magnetizing excitation curve Vs(Ie) with knee-point Vk
   * according to IEC 61869-2 definition: Knee point is where +10% V produces +50% Ie.
   */
  public static generateExcitationCurve(
    vk: number,
    ieVk: number = 0.03
  ): CtExcitationCurvePoint[] {
    const points: CtExcitationCurvePoint[] = [];

    // Current multiplier decade steps from 0.01x Ie up to 50x Ie
    const currentMultipliers = [
      0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.85, 1.0, 1.2, 1.5, 2.0, 3.0, 5.0, 8.0, 12.0, 20.0, 35.0, 50.0
    ];

    for (const m of currentMultipliers) {
      const current = ieVk * m;
      let voltage = 0;

      if (m <= 1.0) {
        // Linear & unsaturated region: V = Vk * (m)^0.88
        voltage = vk * Math.pow(m, 0.88);
      } else {
        // Saturated region: asymptotic logarithmic increase: +10% voltage per +50% current
        // V = Vk * [1 + 0.10 * ln(m) / ln(1.5)]
        voltage = vk * (1.0 + 0.10 * (Math.log(m) / Math.log(1.5)));
      }

      points.push({
        excitationCurrentA: Number(current.toFixed(5)),
        secondaryVoltageV: Number(voltage.toFixed(1))
      });
    }

    return points;
  }

  /**
   * Solves CT Burden, ALF, Transient Ktd, Knee-point Vk, and Saturation Time (IEC 61869-2)
   */
  public static solve(input: CtSpecificationInput): CtSizingCalculationResult {
    const {
      standardClass,
      primaryRatedCurrentA: Ipn,
      secondaryRatedCurrentA: Isn,
      internalSecondaryResistanceRct: Rct,
      wiringLengthM: L,
      wiringCrossSectionMm2: S,
      wiringConnection,
      relayBurdenVa,
      relayBurdenResistanceOhms,
      maxProspectiveFaultCurrentKa: IscKa,
      systemXrRatio,
      faultDurationSec: tf,
      safetyFactorK: K_margin
    } = input;

    // 1. Lead Wiring Resistance (2L for 2-wire loop, 1L for 4-wire balanced)
    const loopFactor = wiringConnection === 'four_wire_common_return' ? 1.0 : 2.0;
    const R_lead = (loopFactor * this.RHO_CU_75 * L) / Math.max(0.5, S);

    // 2. Relay Burden Resistance
    const R_relay = relayBurdenResistanceOhms !== undefined
      ? relayBurdenResistanceOhms
      : (relayBurdenVa / Math.pow(Isn, 2));

    // 3. Total Actual Connected Burden (Rb)
    const Rb_actual = R_lead + R_relay;

    // 4. Nominal Rated Burden (Rbn) for Class P
    const Sn = input.ratedBurdenVa || 15;
    const Rbn = Sn / Math.pow(Isn, 2);

    // 5. Short-Circuit Current Factor (Kssc) & Secondary Fault Current
    const IscA = IscKa * 1000;
    const Kssc = IscA / Ipn;
    const iFaultSecA = Kssc * Isn;

    // 6. Network DC Time Constant Tp = (X/R) / (2 * pi * 50)
    const omega = 2 * Math.PI * 50; // 314.159 rad/s
    const Tp = Math.max(0.005, systemXrRatio / omega);

    // 7. Transient Dimensioning Factor (Ktd) for DC Offset
    // Ktd = 1 + omega * Tp * (1 - exp(-tf / Tp)) per IEC 61869-2 Clause 5.3
    const exponent = Math.max(0, tf / Tp);
    const ktd = 1 + (omega * Tp) * (1 - Math.exp(-exponent));

    // 8. Effective Accuracy Limit Factor (ALF_eff) for Class 5P/10P
    const ALFn = input.ratedAlf || 20;
    const alfEffective = ALFn * ((Rct + Rbn) / Math.max(0.01, Rct + Rb_actual));

    // Required ALFs
    const requiredAlfSymmetric = K_margin * Kssc;
    const requiredAlfTransient = K_margin * Kssc * Math.min(ktd, 2.5);

    // 9. Knee-point Voltage Verification (Class PX / TPS / IEEE C)
    const vkRated = input.ratedKneePointVoltageV !== undefined
      ? input.ratedKneePointVoltageV
      : ALFn * Isn * (Rct + Rbn);

    // Required Knee-Point Voltage: Vk_req = K_margin * Ktd * Ifault_sec * (Rct + Rb_actual)
    // For High-Impedance Differential (87), Vk >= 2 * Ifault_sec * (Rct + 2*R_lead)
    const requiredKneePointVoltageV = standardClass === 'IEC_PX'
      ? 2.0 * K_margin * iFaultSecA * (Rct + R_lead)
      : K_margin * Math.min(ktd, 2.0) * iFaultSecA * (Rct + Rb_actual);

    // Operating Secondary Voltage across total circuit under fault:
    const vOperating = iFaultSecA * (Rct + Rb_actual);

    // 10. Time to Saturation (t_sat)
    // Formula: tsat = Tp * ln( 1 / (1 - (ALF_eff - 1)/(Kssc * omega * Tp)) )
    let timeToSaturationMs = 999;
    const termDenominator = Kssc * (omega * Tp);
    const termNumerator = alfEffective - 1;

    if (termDenominator > 0 && termNumerator > 0 && termNumerator < termDenominator) {
      const argument = 1.0 - (termNumerator / termDenominator);
      if (argument > 0 && argument < 1.0) {
        const tsatSec = -Tp * Math.log(argument);
        timeToSaturationMs = Math.max(1, Math.min(999, tsatSec * 1000));
      }
    } else if (termNumerator >= termDenominator) {
      // Complete non-saturation throughout the transient
      timeToSaturationMs = 999;
    } else {
      // Immediate saturation
      timeToSaturationMs = Math.max(1.5, Tp * 1000 * 0.3);
    }

    // 11. Compliance Assessment
    const isAlfCompliant = standardClass === 'IEC_5P' || standardClass === 'IEC_10P'
      ? alfEffective >= requiredAlfSymmetric
      : true;

    const isKneePointCompliant = standardClass === 'IEC_PX' || standardClass === 'IEEE_C'
      ? vkRated >= requiredKneePointVoltageV
      : vkRated >= (vOperating * 0.9);

    const isSaturationPrevented = isAlfCompliant && (isKneePointCompliant || timeToSaturationMs >= 20);

    let saturationSeverity: 'linear_safe' | 'delayed_saturation' | 'severe_saturation' = 'linear_safe';
    if (!isSaturationPrevented) {
      saturationSeverity = timeToSaturationMs < 8 ? 'severe_saturation' : 'delayed_saturation';
    } else if (timeToSaturationMs < 40) {
      saturationSeverity = 'delayed_saturation';
    }

    const overallVerdict: 'COMPLIANT' | 'NON_COMPLIANT' = (isAlfCompliant && isKneePointCompliant) ? 'COMPLIANT' : 'NON_COMPLIANT';

    // 12. Synthetic Excitation Curve Generation
    const ieKnee = input.ratedMagnetizingCurrentAtVkA || (Isn === 1 ? 0.025 : 0.125);
    const excitationCurve = this.generateExcitationCurve(vkRated, ieKnee);

    // 13. Advisory Interpretation
    const advisoryInterpretation = {
      fr: overallVerdict === 'COMPLIANT'
        ? `Le transformateur de courant est dimensionné avec succès selon la norme CEI 61869-2. Avec un ALF effectif de ${alfEffective.toFixed(1)} (pour un besoin symétrique de ${requiredAlfSymmetric.toFixed(1)}) et une tension de coude Vk de ${vkRated.toFixed(0)} V (requis ${requiredKneePointVoltageV.toFixed(0)} V), le noyau magnétique reste dans son domaine de linéarité pendant ${timeToSaturationMs > 900 ? '> 100 ms' : timeToSaturationMs.toFixed(1) + ' ms'}, garantissant la discrimination instantanée des relais.`
        : `ATTENTION : Risque critique de saturation du tore magnétique sous court-circuit franc (${IscKa} kA, X/R = ${systemXrRatio}). L'ALF effectif (${alfEffective.toFixed(1)}) ou la tension de coude (${vkRated.toFixed(0)} V) est insuffisante face à la charge secondaire réelle (${Rb_actual.toFixed(2)} Ω). Le temps à saturation de ${timeToSaturationMs.toFixed(1)} ms est inférieur au temps de décision du relais. Préconisation : augmenter la section filerie ou spécifier un TC de puissance VA / classe supérieure.`,
      en: overallVerdict === 'COMPLIANT'
        ? `Current transformer sizing fully compliant with IEC 61869-2. Effective ALF is ${alfEffective.toFixed(1)} (required ${requiredAlfSymmetric.toFixed(1)}) and rated knee-point voltage is ${vkRated.toFixed(0)} V (required ${requiredKneePointVoltageV.toFixed(0)} V). Core linearity is maintained for ${timeToSaturationMs > 900 ? '> 100 ms' : timeToSaturationMs.toFixed(1) + ' ms'}.`
        : `WARNING: Critical saturation risk under prospective fault current (${IscKa} kA, X/R = ${systemXrRatio}). Effective ALF (${alfEffective.toFixed(1)}) or knee-point voltage (${vkRated.toFixed(0)} V) cannot support connected secondary burden (${Rb_actual.toFixed(2)} Ω). Time-to-saturation (${timeToSaturationMs.toFixed(1)} ms) threatens protection reliability.`
    };

    return {
      wiringResistanceOhms: Number(R_lead.toFixed(3)),
      relayResistanceOhms: Number(R_relay.toFixed(3)),
      totalActualBurdenOhms: Number(Rb_actual.toFixed(3)),
      nominalRatedBurdenOhms: Number(Rbn.toFixed(3)),
      secondaryFaultCurrentA: Number(iFaultSecA.toFixed(2)),
      shortCircuitCurrentFactorKssc: Number(Kssc.toFixed(2)),
      primaryTimeConstantTpSec: Number(Tp.toFixed(4)),
      transientDimensioningFactorKtd: Number(ktd.toFixed(2)),
      effectiveAlf: Number(alfEffective.toFixed(2)),
      requiredAlfSymmetric: Number(requiredAlfSymmetric.toFixed(2)),
      requiredAlfTransient: Number(requiredAlfTransient.toFixed(2)),
      isAlfCompliant,
      requiredKneePointVoltageV: Number(requiredKneePointVoltageV.toFixed(1)),
      actualEstimatedKneePointVoltageV: Number(vkRated.toFixed(1)),
      isKneePointCompliant,
      timeToSaturationMs: Number(timeToSaturationMs.toFixed(1)),
      isSaturationPrevented,
      saturationSeverity,
      kneePointCoordinates: { voltageV: vkRated, currentA: ieKnee },
      operatingPointCoordinates: { voltageV: Number(vOperating.toFixed(1)), currentA: ieKnee * 1.2 },
      excitationCurve,
      overallVerdict,
      advisoryInterpretation
    };
  }
}

/**
 * Authentic Cameroon High-Voltage Substation & Industrial CT Presets
 */
export const CAMEROON_CT_PRESETS: CameroonCtPreset[] = [
  {
    id: 'sonatrel-mangombe-225kv-diff',
    name: {
      fr: 'Poste 225 kV Mangombé (Edéa) — Protection Différentielle Barre 87B (Classe PX)',
      en: 'Mangombé 225 kV Substation (Edéa) — Busbar Differential 87B (Class PX)'
    },
    facility: {
      fr: 'Poste d\'Interconnexion 225 kV Mangombé — SONATREL',
      en: 'Mangombé 225 kV Interconnection Substation — SONATREL'
    },
    protectionApplication: {
      fr: 'Protection Différentielle de Jeu de Barres à Haute Impédance (ANSI 87B)',
      en: 'High-Impedance Busbar Differential Protection (ANSI 87B)'
    },
    voltageLevel: 'HTB 225 kV',
    description: {
      fr: 'Dimensionnement des TC tores tore-de-cuve pour la protection différentielle de barre 87B face à un courant de court-circuit symétrique de 31.5 kA sous X/R = 18. Vérification stricte de la tension de coude Vk et de la stabilité aux défauts externes.',
      en: 'Class PX CT sizing for 87B high-impedance busbar differential protection under 31.5 kA short-circuit current with X/R = 18 and external fault stability proof.'
    },
    ctInput: {
      standardClass: 'IEC_PX',
      primaryRatedCurrentA: 2000,
      secondaryRatedCurrentA: 1,
      ratedKneePointVoltageV: 450,
      ratedMagnetizingCurrentAtVkA: 0.025,
      internalSecondaryResistanceRct: 4.2,
      wiringLengthM: 120,
      wiringCrossSectionMm2: 6.0,
      wiringConnection: 'two_wire',
      relayBurdenVa: 0.2, // Modern Numerical 87B IED
      maxProspectiveFaultCurrentKa: 31.5,
      systemXrRatio: 18,
      faultDurationSec: 0.06,
      safetyFactorK: 1.2
    }
  },
  {
    id: 'alucam-edee-rectifier-5p20',
    name: {
      fr: 'Usine ALUCAM (Edéa) — Arrivée Redresseurs 90 kV (Classe 5P20)',
      en: 'ALUCAM Smelter (Edéa) — 90 kV Rectifier Incomer (Class 5P20)'
    },
    facility: {
      fr: 'Poste d\'Alimentation Séries d\'Électrolyse ALUCAM Edéa',
      en: 'ALUCAM Potline Electrolysis Power Intake — Edéa'
    },
    protectionApplication: {
      fr: 'Protection Surintensité & Court-Circuit Temporisé (ANSI 50/51)',
      en: 'Overcurrent & Instantaneous Definite-Time Protection (ANSI 50/51)'
    },
    voltageLevel: 'HTB 90 kV',
    description: {
      fr: 'Vérification de la précision et non-saturation des TC 1200/5 A classe 5P20 alimentant les relais de protection des transformateurs redresseurs d\'aluminium sous Isc = 25 kA avec liaison secondaire de 75 m.',
      en: '5P20 CT saturation check for 1200/5 A rectifier incomer protections subjected to 25 kA faults with 75 m cabling.'
    },
    ctInput: {
      standardClass: 'IEC_5P',
      primaryRatedCurrentA: 1200,
      secondaryRatedCurrentA: 5,
      ratedBurdenVa: 30,
      ratedAlf: 20,
      internalSecondaryResistanceRct: 0.9,
      wiringLengthM: 75,
      wiringCrossSectionMm2: 6.0,
      wiringConnection: 'two_wire',
      relayBurdenVa: 1.5,
      maxProspectiveFaultCurrentKa: 25.0,
      systemXrRatio: 14,
      faultDurationSec: 0.08,
      safetyFactorK: 1.15
    }
  },
  {
    id: 'nachtigal-hydro-generator-87g',
    name: {
      fr: 'Centrale Nachtigal 420 MW — Différentielle Alternateur 13.8 kV (Classe PX)',
      en: 'Nachtigal 420 MW Hydro Plant — Generator Differential 87G (Class PX)'
    },
    facility: {
      fr: 'Centrale Hydroélectrique de Nachtigal-Amont — Groupe Francis 60 MW',
      en: 'Nachtigal Hydro Powerhouse — 60 MW Francis Unit'
    },
    protectionApplication: {
      fr: 'Protection Différentielle Alternateur Haute Sensibilité (ANSI 87G)',
      en: 'Generator Longitudinal Differential Protection (ANSI 87G)'
    },
    voltageLevel: 'HTA 13.8 kV',
    description: {
      fr: 'Dimensionnement des TC tore tore-de-neutre et tore-de-phase pour le groupe Francis de 60 MW. Rapport X/R élevé de 25 sous court-circuit de 42 kA. Détermination de la marge de coude Vk et immunité à la composante continue.',
      en: '13.8 kV 3150/1 A Class PX CT sizing for 60 MW generator differential protection with extreme X/R = 25 and 42 kA prospective subtransient fault current.'
    },
    ctInput: {
      standardClass: 'IEC_PX',
      primaryRatedCurrentA: 3150,
      secondaryRatedCurrentA: 1,
      ratedKneePointVoltageV: 350,
      ratedMagnetizingCurrentAtVkA: 0.020,
      internalSecondaryResistanceRct: 3.5,
      wiringLengthM: 45,
      wiringCrossSectionMm2: 4.0,
      wiringConnection: 'two_wire',
      relayBurdenVa: 0.3,
      maxProspectiveFaultCurrentKa: 42.0,
      systemXrRatio: 25,
      faultDurationSec: 0.05,
      safetyFactorK: 1.3
    }
  }
];
