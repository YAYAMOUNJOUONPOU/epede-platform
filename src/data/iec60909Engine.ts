// src/data/iec60909Engine.ts
// EPEDE Wave 2: Standard IEC 60909 Short-Circuit & Asymmetrical Fault Calculation Engine
// Symmetrical (3-phase), Phase-to-Phase (2-phase), and Single Phase-to-Ground (1-phase) calculations
// accounting for positive, negative, and zero-sequence network impedances and System Earthing Regimes (SLT).

import { EarthingRegime } from '../types/epede';

export interface Iec60909FaultResult {
  nodeId: string;
  nodeName: { fr: string; en: string };
  voltageLevelKv: number;
  cFactor: number;
  zPositiveOhms: { r: number; x: number; z: number };
  zZeroOhms: { r: number; x: number; z: number };
  rxRatio: number;
  kappaFactor: number; // Peak factor kappa
  ik3PhaseKa: number; // Initial symmetrical short-circuit current Ik''
  ipPeakKa: number; // Peak short-circuit current ip
  ibBreakingKa: number; // Symmetrical breaking current Ib
  skMva: number; // Short-circuit power Sk''
  ik2PhaseKa: number; // Phase-to-phase short-circuit current Ik2''
  ik1EarthKa: number; // Single phase-to-ground fault current Ik1''
  earthingRegime: EarthingRegime;
  earthingLimitingImpedanceOhms: number;
  healthyPhaseOvervoltageFactor: number; // Ke (e.g. 1.1 to 1.73)
  governingProtections: string[];
  safetyImplication: { fr: string; en: string };
}

export class Iec60909Engine {
  // Calculates fault parameters for any node given its voltage, impedance, and earthing scheme
  public static calculateFault(
    nodeId: string,
    nominalVoltageKv: number,
    earthingRegimeOverride?: EarthingRegime,
    customNgrResistanceOhms?: number
  ): Iec60909FaultResult {
    // 1. Determine base impedances based on physical network slice location
    let r1 = 0.05;
    let x1 = 0.50;
    let r0 = 0.15;
    let x0 = 1.20;
    let defaultRegime: EarthingRegime = 'Solid';
    let defaultRn = 0;
    let name = { fr: 'Nœud Réseau', en: 'Grid Node' };
    let protections = ['ANSI 50/51'];

    switch (nodeId) {
      case 'node-gen-g1':
        name = { fr: 'Bornes Alternateur G1 (10.5 kV)', en: 'Generator G1 Terminals (10.5 kV)' };
        r1 = 0.015;
        x1 = 0.085; // Reactance subtransitoire Xd'' = 0.22 pu sur 48 MVA -> 0.085 Ohm
        r0 = 0.05;
        x0 = 0.04;
        defaultRegime = 'NGR';
        defaultRn = 15.0; // Distribution transformer with secondary resistor
        protections = ['ANSI 87G', 'ANSI 51V', 'ANSI 64G', 'ANSI 40'];
        break;

      case 'node-sub-songloulou':
        name = { fr: 'Poste 225 kV Songloulou', en: 'Songloulou 225 kV Substation' };
        r1 = 0.85;
        x1 = 9.80; // Transfo T1 (12.5% sur 50 MVA) -> 12.6 Ohm
        r0 = 0.85;
        x0 = 9.80;
        defaultRegime = 'Solid';
        defaultRn = 0;
        protections = ['ANSI 87T', 'ANSI 87B', 'ANSI 50/51'];
        break;

      case 'node-sub-oyomabang':
      case 'node-line-225-bekoko':
        name = { fr: 'Jeu de Barres 225 kV Oyomabang', en: 'Oyomabang 225 kV Busbar' };
        r1 = 7.2 + 0.85;
        x1 = 38.4 + 9.80; // Total 120 km line + upstream source
        r0 = 18.5;
        x0 = 115.0;
        defaultRegime = 'Solid';
        defaultRn = 0;
        protections = ['ANSI 21/21N', 'ANSI 87L', 'ANSI 67N'];
        break;

      case 'node-bus-30-oyomabang':
      case 'node-trafo-main-30':
        name = { fr: 'Jeu de Barres HTA 30 kV Oyomabang', en: 'Oyomabang 30 kV MV Busbar' };
        r1 = 0.25;
        x1 = 1.45; // Transfo 63 MVA 225/30 kV Uk = 11.5% -> 1.64 Ohm at 30 kV
        r0 = 0.40;
        x0 = 1.45;
        defaultRegime = 'NGR';
        defaultRn = 433.0; // 30 kV / sqrt(3) / 40 A = 433 Ohms resistor limiting to 40 A
        protections = ['ANSI 87T', 'ANSI 50/51', 'ANSI 51N', 'ANSI 67N', 'ANSI 63'];
        break;

      case 'node-feeder-30-ind':
        name = { fr: 'Départ 30 kV HTA Câble Souterrain (Extrémité)', en: '30 kV Feeder Cable End' };
        r1 = 0.25 + 1.85; // 12 km cable 240 mm2 Al (0.154 Ohm/km)
        x1 = 1.45 + 1.20; // 0.10 Ohm/km
        r0 = 1.20 + 3.60;
        x0 = 1.45 + 2.40;
        defaultRegime = 'NGR';
        defaultRn = 433.0;
        protections = ['ANSI 50/51/51N', 'ANSI 67N', 'ANSI 49'];
        break;

      case 'node-trafo-client-bt':
      case 'node-tgbt-400':
        name = { fr: 'TGBT Principal Basse Tension (400 V)', en: 'Main LV Switchboard TGBT (400 V)' };
        // Transfo 1600 kVA 30 kV / 400 V (Uk = 6.0%) -> Zt = 0.006 Ohm at 400 V
        r1 = 0.0018;
        x1 = 0.0058;
        r0 = 0.0022;
        x0 = 0.0060;
        defaultRegime = 'TN-S';
        defaultRn = 0;
        protections = ['ANSI 50/51 (Micrologic)', 'ANSI 49', 'DDR 300 mA'];
        break;

      case 'node-motor-250':
        name = { fr: 'Bornes Moteur 250 kW (400 V)', en: '250 kW Motor Terminals (400 V)' };
        r1 = 0.0018 + 0.0055; // 40 m cable 240 mm2 Cu
        x1 = 0.0058 + 0.0032;
        r0 = 0.0022 + 0.0080;
        x0 = 0.0060 + 0.0040;
        defaultRegime = 'TN-S';
        defaultRn = 0;
        protections = ['ANSI 49 (Thermique)', 'ANSI 51 (Surintensité)', 'ANSI 37 (Sous-charge)'];
        break;

      case 'node-bess-10mwh':
        name = { fr: 'Plateforme BESS 5 MW / 10 MWh (30 kV)', en: '5 MW / 10 MWh BESS Platform (30 kV)' };
        r1 = 0.35;
        x1 = 10.0; // Transfo élévateur 6.3 MVA 0.69/30 kV Uk = 7.0%
        r0 = 0.50;
        x0 = 10.0;
        defaultRegime = 'NGR';
        defaultRn = 433.0; // Résistance de limitation défaut terre neutre 40 A
        protections = ['ANSI 50/51/51N', 'ANSI 67', 'ANSI 27/59', 'ANSI 81U/O'];
        break;

      case 'node-statcom-50mvar':
        name = { fr: 'Raccordement STATCOM MMC ±50 Mvar (33 kV)', en: 'STATCOM MMC ±50 Mvar Bus (33 kV)' };
        r1 = 0.12;
        x1 = 2.54; // Transfo couplage 60 MVA 225/33 kV Uk = 14.0%
        r0 = 0.15;
        x0 = 2.54;
        defaultRegime = 'NGR';
        defaultRn = 476.0;
        protections = ['ANSI 87T', 'ANSI 50/51', 'ANSI 59N', 'ANSI 27/59'];
        break;
    }

    const regime = earthingRegimeOverride || defaultRegime;
    let rn = customNgrResistanceOhms !== undefined ? customNgrResistanceOhms : defaultRn;

    // Adjust voltage factor c according to IEC 60909:
    // c_max = 1.05 for LV (Un <= 1 kV), 1.10 for MV and HV (Un > 1 kV)
    const cFactor = nominalVoltageKv <= 1.0 ? 1.05 : 1.10;
    const uNominalV = nominalVoltageKv * 1000;
    const cUn_over_sqrt3 = (cFactor * uNominalV) / Math.sqrt(3);

    // 2. Positive sequence impedance
    const z1 = Math.sqrt(r1 * r1 + x1 * x1);

    // 3. Symmetrical 3-phase short-circuit current Ik''
    // Ik'' = (c * Un) / (sqrt(3) * Z1)
    const ik3_A = cUn_over_sqrt3 / z1;
    const ik3_kA = ik3_A / 1000;

    // 4. Peak factor kappa: kappa = 1.02 + 0.98 * e^(-3 * R / X)
    const rxRatio = r1 / Math.max(0.0001, x1);
    const kappa = Math.min(2.0, 1.02 + 0.98 * Math.exp(-3 * rxRatio));
    const ip_kA = kappa * Math.sqrt(2) * ik3_kA;

    // Symmetrical breaking current Ib (for distant faults Ib = Ik'')
    const ib_kA = ik3_kA * 0.98;

    // Short circuit apparent power Sk'' = sqrt(3) * Un * Ik''
    const sk_MVA = (Math.sqrt(3) * nominalVoltageKv * ik3_kA);

    // 5. Phase-to-Phase fault current Ik2'' = sqrt(3)/2 * Ik3''
    const ik2_kA = (Math.sqrt(3) / 2) * ik3_kA;

    // 6. Zero sequence and Earth fault current Ik1''
    // Dependent on Earthing Regime:
    // Ik1'' = sqrt(3) * c * Un / | 2*Z1 + Z0 + 3*ZN |
    let z0 = Math.sqrt(r0 * r0 + x0 * x0);
    let ik1_A = 0;
    let healthyPhaseOvervoltage = 1.1;
    let safetyNotice = { fr: '', en: '' };

    switch (regime) {
      case 'Solid': {
        // ZN = 0
        const rTotal = 2 * r1 + r0;
        const xTotal = 2 * x1 + x0;
        const zLoop = Math.sqrt(rTotal * rTotal + xTotal * xTotal);
        ik1_A = (Math.sqrt(3) * cFactor * uNominalV) / zLoop;
        healthyPhaseOvervoltage = 1.25; // Good earthing factor <= 1.4
        safetyNotice = {
          fr: 'Courant de défaut à la terre très élevé (comparable au court-circuit triphasé). Déclenchement instantané impératif pour éviter l\'échauffement thermique des câbles et les tensions de pas dangereuses.',
          en: 'Very high earth-fault current (comparable to 3-phase fault). Instantaneous trip mandatory to prevent cable thermal damage and hazardous step voltages.'
        };
        break;
      }

      case 'NGR': {
        // 3*RN dominates
        const rTotal = 2 * r1 + r0 + 3 * (rn || 433);
        const xTotal = 2 * x1 + x0;
        const zLoop = Math.sqrt(rTotal * rTotal + xTotal * xTotal);
        ik1_A = (Math.sqrt(3) * cFactor * uNominalV) / zLoop;
        healthyPhaseOvervoltage = 1.45;
        safetyNotice = {
          fr: `Courant de défaut à la terre strictement limité à ${ik1_A.toFixed(1)} A par la résistance de neutre. Protège les tôles magnétiques des transformateurs et limite l\'élévation du potentiel de terre (EPR).`,
          en: `Earth fault current strictly limited to ${ik1_A.toFixed(1)} A by neutral grounding resistor. Prevents magnetic core lamination burning and controls Earth Potential Rise (EPR).`
        };
        break;
      }

      case 'Petersen': {
        // Compensated by Petersen Coil: inductive current cancels network capacitive current
        ik1_A = 12.0; // Residual active current
        healthyPhaseOvervoltage = 1.73; // sqrt(3) on healthy phases
        safetyNotice = {
          fr: 'Courant capacitif compensé par la bobine résonnante. Défaut monophasé auto-extincteur (arc fuyant étouffé). Surtension pleine onde (√3 x Un) sur les deux phases saines.',
          en: 'Capacitive fault current neutralized by resonant tuning coil. Self-extinguishing transient faults. Full line-to-line overvoltage (√3 x Un) on healthy phases.'
        };
        break;
      }

      case 'Isolated': {
        // Capacitive current of the MV grid cables only
        const cableCapacitanceUfPerKm = 0.28;
        const totalCableKm = 35; // Total network length
        const ic_A = Math.sqrt(3) * 2 * Math.PI * 50 * (cableCapacitanceUfPerKm * 1e-6 * totalCableKm) * uNominalV;
        ik1_A = Math.max(2.5, ic_A);
        healthyPhaseOvervoltage = 1.73;
        safetyNotice = {
          fr: 'Neutre isolé : très faible courant de défaut capacitif (< 10 A). Continuité de service autorisée sans déclenchement au 1er défaut, mais détection par CPI ou relais capacitif 67NC obligatoire.',
          en: 'Isolated neutral: very low capacitive fault current (< 10 A). Continuous operation allowed on first fault; detection by insulation monitor or 67NC relay mandatory.'
        };
        break;
      }

      case 'TT': {
        // Low voltage TT: Ra + Rb (e.g. 10 Ohm + 10 Ohm = 20 Ohm)
        ik1_A = (230) / (10 + 10); // ~11.5 A
        healthyPhaseOvervoltage = 1.15;
        safetyNotice = {
          fr: 'Schéma TT : le courant de défaut à la terre (11.5 A) ne fait pas réagir le disjoncteur magnéto-thermique. Coupure obligatoire au 1er défaut par Dispositif Différentiel Résiduel (DDR 300 mA) en moins de 200 ms.',
          en: 'TT Earthing: Earth fault current (11.5 A) is insufficient to trip standard magnetic breaker. Interruption on first fault mandatory via Residual Current Device (RCD 300 mA) within 200 ms.'
        };
        break;
      }

      case 'TN-C':
      case 'TN-S': {
        // Low voltage TN: loop impedance Zloop = Zph + Zpe
        const rLoop = 2 * r1;
        const xLoop = 2 * x1;
        const zLoop = Math.sqrt(rLoop * rLoop + xLoop * xLoop);
        ik1_A = (230) / Math.max(0.005, zLoop);
        healthyPhaseOvervoltage = 1.10;
        safetyNotice = {
          fr: `Schéma TN : le défaut à la terre équivaut à un court-circuit franc Phase-Neutre (Ik1 = ${(ik1_A / 1000).toFixed(1)} kA). Déclenchement instantané par le déclencheur magnétique du disjoncteur général.`,
          en: `TN Earthing: Earth fault is a direct Phase-to-Neutral short circuit (Ik1 = ${(ik1_A / 1000).toFixed(1)} kA). Instantaneous clearance guaranteed by magnetic release of main MCCB/ACB.`
        };
        break;
      }

      case 'IT': {
        // Low voltage IT: 1500 Ohm impedant earthing or isolated
        ik1_A = (230) / 1500; // ~0.15 A
        healthyPhaseOvervoltage = 1.73;
        safetyNotice = {
          fr: 'Schéma IT : courant de premier défaut négligeable (< 0.2 A), tension de contact nulle. Continuité de service totale. Le 2ème défaut doit être éliminé immédiatement comme un court-circuit biphasé.',
          en: 'IT Earthing: negligible first fault current (< 0.2 A), zero touch voltage. Total continuous operation. A second fault must be immediately tripped as a phase-to-phase short circuit.'
        };
        break;
      }
    }

    const ik1_kA = ik1_A / 1000;

    return {
      nodeId,
      nodeName: name,
      voltageLevelKv: nominalVoltageKv,
      cFactor,
      zPositiveOhms: { r: r1, x: x1, z: z1 },
      zZeroOhms: { r: r0, x: x0, z: z0 },
      rxRatio: Number(rxRatio.toFixed(3)),
      kappaFactor: Number(kappa.toFixed(2)),
      ik3PhaseKa: Number(ik3_kA.toFixed(2)),
      ipPeakKa: Number(ip_kA.toFixed(2)),
      ibBreakingKa: Number(ib_kA.toFixed(2)),
      skMva: Number(sk_MVA.toFixed(1)),
      ik2PhaseKa: Number(ik2_kA.toFixed(2)),
      ik1EarthKa: Number(ik1_kA.toFixed(3)),
      earthingRegime: regime,
      earthingLimitingImpedanceOhms: rn,
      healthyPhaseOvervoltageFactor: Number(healthyPhaseOvervoltage.toFixed(2)),
      governingProtections: protections,
      safetyImplication: safetyNotice
    };
  }
}
