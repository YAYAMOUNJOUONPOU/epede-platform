// src/data/vectorVoltageDropEngine.ts
// EPEDE 2.0: Exact Vector AC Voltage Drop & Feeder Voltage Profile Physics Engine
// Normative standards: IEC 60364-5-52, NF C 15-105 Clause 525, IEEE Std 141 (Red Book), IEEE Std 399

export type VoltageSystemType = 'three_phase_ac' | 'single_phase_ac';
export type ConductorMetal = 'copper' | 'aluminium' | 'almelec_overhead';
export type CableInstallationType = 'cable_in_air' | 'cable_underground' | 'overhead_line' | 'busway_canalis';

export interface ConductorSpecs {
  crossSectionMm2: number;
  conductorMetal: ConductorMetal;
  installationType: CableInstallationType;
  operatingTempC: number; // typically 70°C for PVC, 90°C for XLPE/EPR
  lengthM: number;
  customResistanceOhmPerKm?: number;
  customReactanceOhmPerKm?: number;
}

export interface FeederLoadNode {
  nodeId: string;
  name: { fr: string; en: string };
  distanceM: number; // Cumulative distance from substation
  activePowerKw: number;
  reactivePowerKvar: number;
  cosPhi: number;
  capacitorBoostKvar?: number; // Optional shunt capacitor installed at this bus
  isCriticalBus?: boolean;
}

export interface FeederProfileSection {
  sectionIndex: number;
  fromNodeId: string;
  toNodeId: string;
  lengthM: number;
  conductors: ConductorSpecs;
}

export interface FeederTopologyInput {
  substationVoltageV: number;
  systemType: VoltageSystemType;
  frequencyHz: number;
  sections: FeederProfileSection[];
  nodes: FeederLoadNode[];
}

export interface SingleLineVoltageDropResult {
  voltageNominalV: number;
  receivingVoltageV: number;
  deltaUVoltsExact: number;
  deltaUPercentExact: number;
  deltaUVoltsApprox: number;
  longitudinalDropV: number; // (R*P + X*Q) / V
  transverseDropV: number;   // (X*P - R*Q) / V
  quadratureCorrectionV: number; // (X*P - R*Q)^2 / (2*V^3)
  phaseAngleDeltaRad: number;
  phaseAngleDeltaDeg: number;
  resistanceOhm: number;
  reactanceOhm: number;
  impedanceZohm: number;
  currentAmps: number;
  activePowerKw: number;
  reactivePowerKvar: number;
  powerFactorCosPhi: number;
  isCompliant: boolean;
  maxPermissibleDropPercent: number;
  voltageRegulationRatioPercent: number; // (V1 - V2) / V2 * 100
}

export interface FeederNodeProfileResult {
  nodeId: string;
  name: { fr: string; en: string };
  distanceM: number;
  voltageV: number;
  voltagePerUnit: number; // V / V_nominal
  cumulativeDropVolts: number;
  cumulativeDropPercent: number;
  phaseAngleDeg: number;
  activePowerKw: number;
  reactivePowerKvar: number;
  capacitorBoostKvar: number;
  voltageBoostFromCapacitorV: number;
  status: 'compliant' | 'warning' | 'non_compliant';
}

export interface FeederVoltageProfileOutput {
  substationVoltageV: number;
  totalLengthM: number;
  nodes: FeederNodeProfileResult[];
  worstNode: FeederNodeProfileResult;
  isEntireFeederCompliant: boolean;
  totalActiveLossesKw: number;
  totalReactiveLossesKvar: number;
  withCapacitorBoostApplied: boolean;
}

export interface CameroonFeederPreset {
  id: string;
  name: { fr: string; en: string };
  facility: { fr: string; en: string };
  voltageLevel: string;
  nominalVoltageV: number;
  systemType: VoltageSystemType;
  description: { fr: string; en: string };
  feederTopology: FeederTopologyInput;
  normativeLimitPercent: number;
}

export class VectorVoltageDropEngine {
  /**
   * Returns resistivity in Ohm·mm²/m at operating temperature T (°C)
   * Base at 20°C: Cu = 0.0178, Al = 0.0282, Almelec = 0.0325
   */
  public static getResistivity(metal: ConductorMetal, tempC: number): number {
    let rho20 = 0.0178;
    let alpha = 0.00393;

    if (metal === 'aluminium') {
      rho20 = 0.0282;
      alpha = 0.00403;
    } else if (metal === 'almelec_overhead') {
      rho20 = 0.0325;
      alpha = 0.00360;
    }

    return rho20 * (1 + alpha * (tempC - 20));
  }

  /**
   * Returns typical line reactance in Ohm/km based on installation type & cross section
   */
  public static getReactanceOhmPerKm(installation: CableInstallationType, crossSectionMm2: number): number {
    if (installation === 'overhead_line') {
      // Typical MV overhead line 15-33 kV with ~1m spacing: 0.35 to 0.40 Ohm/km
      return 0.380;
    }
    if (installation === 'busway_canalis') {
      // Ultra-low compact sandwich busbar reactance: 0.025 to 0.045 Ohm/km
      return 0.035;
    }
    if (installation === 'cable_underground') {
      // Trefoil or touching single/multi-core: 0.075 to 0.110 Ohm/km depending on section
      return crossSectionMm2 >= 150 ? 0.080 : 0.095;
    }
    // Cable in air / ladder
    return 0.085;
  }

  /**
   * Solves exact vector AC voltage drop for a single lumped circuit (IEC 60364-5-52 / IEEE 141)
   */
  public static solveSingleBranch(
    voltageNominalV: number,
    currentA: number,
    cosPhi: number,
    specs: ConductorSpecs,
    systemType: VoltageSystemType = 'three_phase_ac',
    maxPermissibleDropPercent: number = 5.0
  ): SingleLineVoltageDropResult {
    const rhoT = this.getResistivity(specs.conductorMetal, specs.operatingTempC);
    const rOhmPerM = specs.customResistanceOhmPerKm !== undefined
      ? specs.customResistanceOhmPerKm / 1000
      : (rhoT / specs.crossSectionMm2);

    const xOhmPerM = specs.customReactanceOhmPerKm !== undefined
      ? specs.customReactanceOhmPerKm / 1000
      : (this.getReactanceOhmPerKm(specs.installationType, specs.crossSectionMm2) / 1000);

    const R = rOhmPerM * specs.lengthM;
    const X = xOhmPerM * specs.lengthM;
    const Z = Math.sqrt(R * R + X * X);

    const clampedCosPhi = Math.max(0.1, Math.min(1.0, cosPhi));
    const sinPhi = Math.sqrt(1 - clampedCosPhi * clampedCosPhi);

    let activePowerKw = 0;
    let reactivePowerKvar = 0;
    let deltaUVoltsExact = 0;
    let deltaUVoltsApprox = 0;
    let longitudinalDropV = 0;
    let transverseDropV = 0;
    let quadratureCorrectionV = 0;
    let phaseAngleDeltaRad = 0;
    let receivingVoltageV = voltageNominalV;

    if (systemType === 'three_phase_ac') {
      // Three-Phase Power
      activePowerKw = (Math.sqrt(3) * voltageNominalV * currentA * clampedCosPhi) / 1000;
      reactivePowerKvar = (Math.sqrt(3) * voltageNominalV * currentA * sinPhi) / 1000;

      // Exact Vector Voltage Drop in Three-Phase Line-to-Line:
      // Longitudinal (in-phase) drop: Delta V_long = (R*P + X*Q) / V1
      longitudinalDropV = (R * activePowerKw * 1000 + X * reactivePowerKvar * 1000) / voltageNominalV;
      
      // Transverse (quadrature) drop: delta V_trans = (X*P - R*Q) / V1
      transverseDropV = (X * activePowerKw * 1000 - R * reactivePowerKvar * 1000) / voltageNominalV;

      // Receiving voltage phasor magnitude V2:
      // V2 = sqrt( (V1 - Delta V_long)^2 + (delta V_trans)^2 )
      const vDirect = voltageNominalV - longitudinalDropV;
      receivingVoltageV = Math.sqrt(Math.max(0, vDirect * vDirect + transverseDropV * transverseDropV));

      deltaUVoltsExact = voltageNominalV - receivingVoltageV;

      // Quadrature 2nd-order term: (X*P - R*Q)^2 / (2 * V1^3)
      quadratureCorrectionV = Math.pow(transverseDropV, 2) / (2 * voltageNominalV);
      deltaUVoltsApprox = longitudinalDropV + quadratureCorrectionV;

      // Phase displacement angle between sending and receiving end
      phaseAngleDeltaRad = Math.atan2(transverseDropV, vDirect);
    } else {
      // Single-phase circuit: 2 conductors (Phase + Neutral) -> Factor 2
      activePowerKw = (voltageNominalV * currentA * clampedCosPhi) / 1000;
      reactivePowerKvar = (voltageNominalV * currentA * sinPhi) / 1000;

      const rLoop = 2 * R;
      const xLoop = 2 * X;

      longitudinalDropV = (rLoop * activePowerKw * 1000 + xLoop * reactivePowerKvar * 1000) / voltageNominalV;
      transverseDropV = (xLoop * activePowerKw * 1000 - rLoop * reactivePowerKvar * 1000) / voltageNominalV;

      const vDirect = voltageNominalV - longitudinalDropV;
      receivingVoltageV = Math.sqrt(Math.max(0, vDirect * vDirect + transverseDropV * transverseDropV));
      deltaUVoltsExact = voltageNominalV - receivingVoltageV;
      quadratureCorrectionV = Math.pow(transverseDropV, 2) / (2 * voltageNominalV);
      deltaUVoltsApprox = longitudinalDropV + quadratureCorrectionV;
      phaseAngleDeltaRad = Math.atan2(transverseDropV, vDirect);
    }

    const deltaUPercentExact = (deltaUVoltsExact / voltageNominalV) * 100;
    const voltageRegulationRatioPercent = receivingVoltageV > 0
      ? ((voltageNominalV - receivingVoltageV) / receivingVoltageV) * 100
      : 100;

    const isCompliant = deltaUPercentExact <= maxPermissibleDropPercent;

    return {
      voltageNominalV,
      receivingVoltageV: Number(receivingVoltageV.toFixed(2)),
      deltaUVoltsExact: Number(deltaUVoltsExact.toFixed(2)),
      deltaUPercentExact: Number(deltaUPercentExact.toFixed(3)),
      deltaUVoltsApprox: Number(deltaUVoltsApprox.toFixed(2)),
      longitudinalDropV: Number(longitudinalDropV.toFixed(2)),
      transverseDropV: Number(transverseDropV.toFixed(2)),
      quadratureCorrectionV: Number(quadratureCorrectionV.toFixed(3)),
      phaseAngleDeltaRad,
      phaseAngleDeltaDeg: Number(((phaseAngleDeltaRad * 180) / Math.PI).toFixed(2)),
      resistanceOhm: Number(R.toFixed(4)),
      reactanceOhm: Number(X.toFixed(4)),
      impedanceZohm: Number(Z.toFixed(4)),
      currentAmps: currentA,
      activePowerKw: Number(activePowerKw.toFixed(1)),
      reactivePowerKvar: Number(reactivePowerKvar.toFixed(1)),
      powerFactorCosPhi: clampedCosPhi,
      isCompliant,
      maxPermissibleDropPercent,
      voltageRegulationRatioPercent: Number(voltageRegulationRatioPercent.toFixed(3))
    };
  }

  /**
   * Solves multi-node distributed radial feeder voltage profile (Ladder backward/forward sweep)
   */
  public static solveFeederProfile(
    topology: FeederTopologyInput,
    applyCapacitorBoost: boolean = true,
    maxLimitPercent: number = 5.0
  ): FeederVoltageProfileOutput {
    const { substationVoltageV, sections, nodes } = topology;
    const N = nodes.length;

    // 1. Calculate downstream cumulative power flowing through each section k
    // Section k carries all load from nodes j >= k
    const sectionActiveKw: number[] = new Array(sections.length).fill(0);
    const sectionReactiveKvar: number[] = new Array(sections.length).fill(0);

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      let sumP = 0;
      let sumQ = 0;
      for (let nIdx = sIdx; nIdx < N; nIdx++) {
        const node = nodes[nIdx];
        sumP += node.activePowerKw;
        let qNet = node.reactivePowerKvar;
        if (applyCapacitorBoost && node.capacitorBoostKvar) {
          qNet = Math.max(-500, qNet - node.capacitorBoostKvar);
        }
        sumQ += qNet;
      }
      sectionActiveKw[sIdx] = sumP;
      sectionReactiveKvar[sIdx] = sumQ;
    }

    // 2. Step forward along the feeder from substation busbar (V0)
    let currentV = substationVoltageV;
    let cumulativePhaseRad = 0;
    const nodeResults: FeederNodeProfileResult[] = [];
    let totalLossesP = 0;
    let totalLossesQ = 0;

    for (let i = 0; i < N; i++) {
      const node = nodes[i];
      const section = sections[i] || sections[sections.length - 1];

      // Branch impedance of this section
      const rho = this.getResistivity(section.conductors.conductorMetal, section.conductors.operatingTempC);
      const rSec = (rho / section.conductors.crossSectionMm2) * section.lengthM;
      const xSec = (this.getReactanceOhmPerKm(section.conductors.installationType, section.conductors.crossSectionMm2) / 1000) * section.lengthM;

      const pFlow = sectionActiveKw[i] || 0;
      const qFlow = sectionReactiveKvar[i] || 0;

      // Section voltage drop using local sending voltage
      const dVLong = (rSec * pFlow * 1000 + xSec * qFlow * 1000) / currentV;
      const dVTrans = (xSec * pFlow * 1000 - rSec * qFlow * 1000) / currentV;

      const vDirect = currentV - dVLong;
      const nextV = Math.sqrt(Math.max(0, vDirect * vDirect + dVTrans * dVTrans));
      const sectionDeltaAngle = Math.atan2(dVTrans, vDirect);

      cumulativePhaseRad += sectionDeltaAngle;
      currentV = nextV;

      // Line Losses in section = 3 * I^2 * R
      const currentBranchA = (Math.sqrt(pFlow * pFlow + qFlow * qFlow) * 1000) / (Math.sqrt(3) * currentV);
      const lossP = (3 * currentBranchA * currentBranchA * rSec) / 1000;
      const lossQ = (3 * currentBranchA * currentBranchA * xSec) / 1000;
      totalLossesP += lossP;
      totalLossesQ += lossQ;

      // Boost calculation if capacitor is active
      const qCap = (applyCapacitorBoost && node.capacitorBoostKvar) ? node.capacitorBoostKvar : 0;
      const boostV = qCap > 0 ? (xSec * qCap * 1000) / currentV : 0;

      const cumDropV = substationVoltageV - currentV;
      const cumDropPercent = (cumDropV / substationVoltageV) * 100;
      const pu = currentV / substationVoltageV;

      let status: 'compliant' | 'warning' | 'non_compliant' = 'compliant';
      if (cumDropPercent > maxLimitPercent) {
        status = 'non_compliant';
      } else if (cumDropPercent > maxLimitPercent * 0.8) {
        status = 'warning';
      }

      nodeResults.push({
        nodeId: node.nodeId,
        name: node.name,
        distanceM: node.distanceM,
        voltageV: Number(currentV.toFixed(1)),
        voltagePerUnit: Number(pu.toFixed(4)),
        cumulativeDropVolts: Number(cumDropV.toFixed(1)),
        cumulativeDropPercent: Number(cumDropPercent.toFixed(2)),
        phaseAngleDeg: Number(((cumulativePhaseRad * 180) / Math.PI).toFixed(2)),
        activePowerKw: node.activePowerKw,
        reactivePowerKvar: node.reactivePowerKvar,
        capacitorBoostKvar: qCap,
        voltageBoostFromCapacitorV: Number(boostV.toFixed(2)),
        status
      });
    }

    // Find worst node (highest drop percent)
    let worst = nodeResults[0];
    for (const nr of nodeResults) {
      if (nr.cumulativeDropPercent > worst.cumulativeDropPercent) {
        worst = nr;
      }
    }

    const isEntireFeederCompliant = worst.cumulativeDropPercent <= maxLimitPercent;
    const totalLengthM = nodes[nodes.length - 1]?.distanceM || 0;

    return {
      substationVoltageV,
      totalLengthM,
      nodes: nodeResults,
      worstNode: worst,
      isEntireFeederCompliant,
      totalActiveLossesKw: Number(totalLossesP.toFixed(2)),
      totalReactiveLossesKvar: Number(totalLossesQ.toFixed(2)),
      withCapacitorBoostApplied: applyCapacitorBoost
    };
  }
}

/**
 * Authoritative Cameroon Feeder & Busway Presets
 */
export const CAMEROON_VOLTAGE_DROP_PRESETS: CameroonFeederPreset[] = [
  {
    id: 'bassa-ndokoti-15kv-feeder',
    name: {
      fr: 'Départ 15 kV Bassa - Ndokoti (Douala)',
      en: '15 kV Bassa - Ndokoti Feeder (Douala)'
    },
    facility: {
      fr: 'Poste Source 90/15 kV Bassa — Eneo / SONATREL Littoral',
      en: 'Bassa 90/15 kV Substation — Eneo / SONATREL Grid'
    },
    voltageLevel: 'HTA 15 kV',
    nominalVoltageV: 15000,
    systemType: 'three_phase_ac',
    normativeLimitPercent: 5.0,
    description: {
      fr: 'Desserte radiale arborescente de 8.5 km en câble souterrain et aérien Almelec 148 mm², alimentant 5 postes de distribution HTA/BT dans la zone industrielle et commerciale de Ndokoti.',
      en: '8.5 km radial 15 kV feeder with underground cable and Almelec 148 mm² overhead line supplying 5 distribution substations in Ndokoti industrial and commercial corridor.'
    },
    feederTopology: {
      substationVoltageV: 15000,
      systemType: 'three_phase_ac',
      frequencyHz: 50,
      sections: [
        {
          sectionIndex: 0,
          fromNodeId: 'bus_bassa_source',
          toNodeId: 'node_camlait_zi',
          lengthM: 2200,
          conductors: {
            crossSectionMm2: 240,
            conductorMetal: 'aluminium',
            installationType: 'cable_underground',
            operatingTempC: 75,
            lengthM: 2200
          }
        },
        {
          sectionIndex: 1,
          fromNodeId: 'node_camlait_zi',
          toNodeId: 'node_ndokoti_carrefour',
          lengthM: 2500,
          conductors: {
            crossSectionMm2: 150,
            conductorMetal: 'aluminium',
            installationType: 'cable_underground',
            operatingTempC: 75,
            lengthM: 2500
          }
        },
        {
          sectionIndex: 2,
          fromNodeId: 'node_ndokoti_carrefour',
          toNodeId: 'node_logbaba_zone',
          lengthM: 2100,
          conductors: {
            crossSectionMm2: 148,
            conductorMetal: 'almelec_overhead',
            installationType: 'overhead_line',
            operatingTempC: 70,
            lengthM: 2100
          }
        },
        {
          sectionIndex: 3,
          fromNodeId: 'node_logbaba_zone',
          toNodeId: 'node_terminal_nyalla',
          lengthM: 1700,
          conductors: {
            crossSectionMm2: 95,
            conductorMetal: 'almelec_overhead',
            installationType: 'overhead_line',
            operatingTempC: 70,
            lengthM: 1700
          }
        }
      ],
      nodes: [
        {
          nodeId: 'node_camlait_zi',
          name: { fr: 'Poste 1: Zone Industrielle CAMLAIT', en: 'Substation 1: CAMLAIT Industrial Zone' },
          distanceM: 2200,
          activePowerKw: 1800,
          reactivePowerKvar: 1100,
          cosPhi: 0.85,
          capacitorBoostKvar: 400
        },
        {
          nodeId: 'node_ndokoti_carrefour',
          name: { fr: 'Poste 2: Carrefour Ndokoti Centre Commercial', en: 'Substation 2: Ndokoti Commercial Hub' },
          distanceM: 4700,
          activePowerKw: 2200,
          reactivePowerKvar: 1450,
          cosPhi: 0.83,
          capacitorBoostKvar: 600
        },
        {
          nodeId: 'node_logbaba_zone',
          name: { fr: 'Poste 3: Desserte Gazière Logbaba', en: 'Substation 3: Logbaba Gas Offtake' },
          distanceM: 6800,
          activePowerKw: 1400,
          reactivePowerKvar: 900,
          cosPhi: 0.84,
          capacitorBoostKvar: 300
        },
        {
          nodeId: 'node_terminal_nyalla',
          name: { fr: 'Poste 4: Extrémité Nyalla Résidentiel', en: 'Substation 4: Nyalla Terminal Bus' },
          distanceM: 8500,
          activePowerKw: 1100,
          reactivePowerKvar: 750,
          cosPhi: 0.83,
          capacitorBoostKvar: 350,
          isCriticalBus: true
        }
      ]
    }
  },
  {
    id: 'nachtigal-batchenga-30kv-rural',
    name: {
      fr: 'Ligne 30 kV Nachtigal - Batchenga - Ntui',
      en: '30 kV Nachtigal - Batchenga Rural Feeder'
    },
    facility: {
      fr: 'Poste 225/30 kV d\'Évacuation Usine Nachtigal — Eneo Centre',
      en: 'Nachtigal Hydro 225/30 kV Regional Feeder Bus'
    },
    voltageLevel: 'HTA 30 kV',
    nominalVoltageV: 30000,
    systemType: 'three_phase_ac',
    normativeLimitPercent: 7.0, // Rural distribution allowed up to 7-8%
    description: {
      fr: 'Longue ligne rurale aérienne de 28.5 km en Almelec 93.3 mm² traversant le département de la Haute-Sanaga. Chute de tension inductive sévère au pic de charge compensée par batterie de condensateurs en bout de ligne.',
      en: 'Long 28.5 km rural 30 kV overhead Almelec line in Haute-Sanaga region with heavy reactive voltage drop mitigated by end-of-line shunt capacitor bank.'
    },
    feederTopology: {
      substationVoltageV: 30000,
      systemType: 'three_phase_ac',
      frequencyHz: 50,
      sections: [
        {
          sectionIndex: 0,
          fromNodeId: 'bus_nachtigal_source',
          toNodeId: 'node_batchenga_bourg',
          lengthM: 11000,
          conductors: {
            crossSectionMm2: 93.3,
            conductorMetal: 'almelec_overhead',
            installationType: 'overhead_line',
            operatingTempC: 65,
            lengthM: 11000
          }
        },
        {
          sectionIndex: 1,
          fromNodeId: 'node_batchenga_bourg',
          toNodeId: 'node_pont_sanaga',
          lengthM: 9500,
          conductors: {
            crossSectionMm2: 93.3,
            conductorMetal: 'almelec_overhead',
            installationType: 'overhead_line',
            operatingTempC: 65,
            lengthM: 9500
          }
        },
        {
          sectionIndex: 2,
          fromNodeId: 'node_pont_sanaga',
          toNodeId: 'node_ntui_terminal',
          lengthM: 8000,
          conductors: {
            crossSectionMm2: 54.6,
            conductorMetal: 'almelec_overhead',
            installationType: 'overhead_line',
            operatingTempC: 65,
            lengthM: 8000
          }
        }
      ],
      nodes: [
        {
          nodeId: 'node_batchenga_bourg',
          name: { fr: 'Poste 1: Batchenga Centre', en: 'Substation 1: Batchenga Town' },
          distanceM: 11000,
          activePowerKw: 850,
          reactivePowerKvar: 600,
          cosPhi: 0.82,
          capacitorBoostKvar: 250
        },
        {
          nodeId: 'node_pont_sanaga',
          name: { fr: 'Poste 2: Station de Pompage Fleuve Sanaga', en: 'Substation 2: Sanaga River Pumping Station' },
          distanceM: 20500,
          activePowerKw: 1200,
          reactivePowerKvar: 880,
          cosPhi: 0.81,
          capacitorBoostKvar: 400
        },
        {
          nodeId: 'node_ntui_terminal',
          name: { fr: 'Poste 3: Ntui Extrémité Réseau', en: 'Substation 3: Ntui Rural End-of-Line' },
          distanceM: 28500,
          activePowerKw: 950,
          reactivePowerKvar: 720,
          cosPhi: 0.80,
          capacitorBoostKvar: 500,
          isCriticalBus: true
        }
      ]
    }
  },
  {
    id: 'cimencam-bonaberi-busway-400v',
    name: {
      fr: 'Gaine Barre Canalis 400 V / 2500 A Usine CIMENCAM (Bonabéri)',
      en: '400 V / 2500 A Busway Trunk CIMENCAM Cement Plant'
    },
    facility: {
      fr: 'TGBT Cimenterie CIMENCAM Bonabéri — Douala',
      en: 'Main LV Switchboard CIMENCAM Cement Works — Douala'
    },
    voltageLevel: 'BT 400 V',
    nominalVoltageV: 400,
    systemType: 'three_phase_ac',
    normativeLimitPercent: 3.0, // 3% max for plant feeder to main motor distribution
    description: {
      fr: 'Colonne de distribution compacte 400 V triphasée de 180 m en gaine à barres aluminium cuivre sandwich (Canalis 2500 A) alimentant les départs force motrice des concasseurs et convoyeurs de clinker.',
      en: '180 m compact sandwich 400 V / 2500 A busway trunk feeding clinker crusher drives and heavy conveyor lines with high inrush and power factor variations.'
    },
    feederTopology: {
      substationVoltageV: 400,
      systemType: 'three_phase_ac',
      frequencyHz: 50,
      sections: [
        {
          sectionIndex: 0,
          fromNodeId: 'tgbt_source',
          toNodeId: 'tap_clinker_crusher',
          lengthM: 60,
          conductors: {
            crossSectionMm2: 800,
            conductorMetal: 'copper',
            installationType: 'busway_canalis',
            operatingTempC: 85,
            lengthM: 60
          }
        },
        {
          sectionIndex: 1,
          fromNodeId: 'tap_clinker_crusher',
          toNodeId: 'tap_ball_mill_aux',
          lengthM: 65,
          conductors: {
            crossSectionMm2: 800,
            conductorMetal: 'copper',
            installationType: 'busway_canalis',
            operatingTempC: 85,
            lengthM: 65
          }
        },
        {
          sectionIndex: 2,
          fromNodeId: 'tap_ball_mill_aux',
          toNodeId: 'tap_packing_plant',
          lengthM: 55,
          conductors: {
            crossSectionMm2: 500,
            conductorMetal: 'copper',
            installationType: 'busway_canalis',
            operatingTempC: 85,
            lengthM: 55
          }
        }
      ],
      nodes: [
        {
          nodeId: 'tap_clinker_crusher',
          name: { fr: 'Coffret 1: Concasseur Primaire de Clinker', en: 'Tap 1: Primary Clinker Crusher' },
          distanceM: 60,
          activePowerKw: 420,
          reactivePowerKvar: 310,
          cosPhi: 0.80,
          capacitorBoostKvar: 150
        },
        {
          nodeId: 'tap_ball_mill_aux',
          name: { fr: 'Coffret 2: Auxiliaires Broyeur & Ventilateur Tirage', en: 'Tap 2: Ball Mill Aux & Draft Fan' },
          distanceM: 125,
          activePowerKw: 380,
          reactivePowerKvar: 260,
          cosPhi: 0.82,
          capacitorBoostKvar: 120
        },
        {
          nodeId: 'tap_packing_plant',
          name: { fr: 'Coffret 3: Ensacheuse Rotative & Palettiseur', en: 'Tap 3: Rotary Packer & Palletizer' },
          distanceM: 180,
          activePowerKw: 240,
          reactivePowerKvar: 160,
          cosPhi: 0.83,
          capacitorBoostKvar: 80,
          isCriticalBus: true
        }
      ]
    }
  }
];
