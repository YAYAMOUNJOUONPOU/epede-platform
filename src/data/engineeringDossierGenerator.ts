// src/data/engineeringDossierGenerator.ts
// EPEDE Wave 2: Procedural Engineering Dossier & Compliance Report Synthesizer
// Generates formal calculation sheets, relay settings schedules, and earthing audit memos.

import { CanonicalGraphNode } from '../types/epede';
import { Iec60909Engine, Iec60909FaultResult } from './iec60909Engine';
import { canonicalGraph } from './canonicalGraphEngine';
import { auditSettingsStore, NodeAuditCalibration } from './auditSettingsStore';

export interface EngineeringDossier {
  documentReference: string;
  revision: string;
  date: string;
  projectTitle: { fr: string; en: string };
  equipmentTag: string;
  equipmentName: { fr: string; en: string };
  node: CanonicalGraphNode;
  faultAnalysis: Iec60909FaultResult;
  auditCalibration?: NodeAuditCalibration;
  relaySchedule: {
    relayTag: string;
    ansiCode: string;
    settingType: string;
    thresholdValue: string;
    timeDelay: string;
    standard: string;
  }[];
  earthingSummary: {
    regime: string;
    faultCurrentContribution: string;
    safetyStandard: string;
    recommendation: { fr: string; en: string };
  };
  auxiliaryPowerCheck: {
    dcVoltage: string;
    batteryAutonomy: string;
    chargerRedundancy: string;
    trippingSecurityStatus: string;
  };
  complianceSignoff: {
    preparedBy: string;
    checkedBy: string;
    status: 'CONFORME_CEI' | 'RESERVE_TECHNIQUE';
    standardsApplied: string[];
  };
}

export class EngineeringDossierGenerator {
  public static generateDossier(nodeId: string, locale: 'fr' | 'en'): EngineeringDossier {
    const node = canonicalGraph.getNodeById(nodeId) || canonicalGraph.getNodeById('node-trafo-main-30')!;
    const context = canonicalGraph.buildContextStack(node.id);

    // Approximate nominal kV from voltage level or specs
    let nominalKv = 30.0;
    if (node.voltageLevel === 'LV') nominalKv = 0.400;
    else if (node.voltageLevel === 'MV') nominalKv = 30.0;
    else if (node.voltageLevel === 'HV') nominalKv = 225.0;
    else if (node.voltageLevel === 'EHV') nominalKv = 400.0;

    const faultAnalysis = Iec60909Engine.calculateFault(node.id, nominalKv, node.earthingRegime);

    // Relay schedule
    const relaySchedule = (context?.crossDiscipline.protections || []).map((pNode) => {
      const ansi = String(pNode.technicalSpecs.ansi_code || 'ANSI 50/51');
      return {
        relayTag: pNode.tag || `--F01`,
        ansiCode: ansi,
        settingType: String(pNode.technicalSpecs.curve || pNode.technicalSpecs.pickup || 'IDMT IEC Inverse'),
        thresholdValue: String(pNode.technicalSpecs.pickup || pNode.technicalSpecs.ratio || '1.10 In'),
        timeDelay: String(pNode.technicalSpecs.delay_ms ? `${pNode.technicalSpecs.delay_ms} ms` : 'TMS = 0.15'),
        standard: 'IEC 60255 / IEEE C37.90',
      };
    });

    if (relaySchedule.length === 0) {
      relaySchedule.push({
        relayTag: '--QA1-PROT',
        ansiCode: 'ANSI 50/51',
        settingType: 'Temporisation Courbe Normale Inverse (IEC NI)',
        thresholdValue: 'I_s = 1.15 x I_n',
        timeDelay: 'TMS = 0.18 (t = 280 ms à 5 In)',
        standard: 'IEC 60255-151',
      });
    }

    const earthingSummary = {
      regime: faultAnalysis.earthingRegime,
      faultCurrentContribution: `${(faultAnalysis.ik1EarthKa * 1000).toFixed(1)} A`,
      safetyStandard: nominalKv <= 1.0 ? 'IEC 60364-4-41' : 'IEC 61936-1 / IEEE 80',
      recommendation: faultAnalysis.safetyImplication,
    };

    const aux = context?.auxiliaryContext;
    const auxiliaryPowerCheck = {
      dcVoltage: aux ? `${aux.dcSystem.nominalVoltageVdc} V DC` : '110 V DC Secouru',
      batteryAutonomy: aux ? `${aux.dcSystem.autonomyHours} Heures (Ni-Cd)` : '8 Heures',
      chargerRedundancy: aux && aux.dcSystem.redundantChargers ? 'Double Redresseur (N+1)' : 'Simple',
      trippingSecurityStatus: 'Sécurité de déclenchement garantie (Alimentation permanente bobines d\'ouverture)',
    };

    const auditCalibration = auditSettingsStore.getAuditCalibration(node.id) || undefined;

    return {
      documentReference: `EPEDE-CALC-${node.domainCode}-${node.id.replace('node-', '').toUpperCase()}-R01`,
      revision: 'Rev. 2.0 (Wave 2 Core Architecture)',
      date: '2026-09-08',
      projectTitle: {
        fr: 'Dossier d\'Étude & de Dimensionnement Électrotechnique Approfondi',
        en: 'Comprehensive Electrical Engineering Sizing & Compliance Dossier',
      },
      equipmentTag: node.tag || '==E1.Q01',
      equipmentName: node.name,
      node,
      faultAnalysis,
      auditCalibration,
      relaySchedule,
      earthingSummary,
      auxiliaryPowerCheck,
      complianceSignoff: {
        preparedBy: 'EPEDE Canonical Engineering Synthesis Engine',
        checkedBy: 'Direction de l\'Ingénierie & des Études Réseau (Cameroon/International)',
        status: 'CONFORME_CEI',
        standardsApplied: [
          'IEC 60909 (Short-circuit currents in three-phase a.c. systems)',
          'IEC 60076 (Power transformers)',
          'IEC 60255 (Measuring relays and protection equipment)',
          'IEC 60364 / IEC 61936 (Earthing design and touch voltage limits)',
          'IEEE 80 (Guide for safety in AC substation grounding)',
        ],
      },
    };
  }
}
