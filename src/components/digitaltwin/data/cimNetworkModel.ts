// src/components/digitaltwin/data/cimNetworkModel.ts
// EPEDE IEC 61970 / IEC 61968 CIM Power System Model & Semantic Topology

import type {
  CimSubstation,
  CimConnectivityNode,
  CimConductingEquipment,
  CimGraphEdge,
  SemanticGraphNode,
  SemanticGraphLink,
  IsolationSolution,
  ContingencyN1Result
} from '../../../types/cim';

export const CIM_SUBSTATIONS: CimSubstation[] = [
  {
    id: 'sub-nachtigal',
    name: 'Poste Évacuation Nachtigal Amont',
    code: 'SS-NCH-225',
    region: 'Centre (Sanaga)',
    voltageLevels: ['15kV', '225kV'],
    gridRole_fr: 'Centrale hydroélectrique majeure (420 MW) & poste élévateur',
    gridRole_en: 'Major hydro power plant (420 MW) & step-up substation'
  },
  {
    id: 'sub-bekoko',
    name: 'Poste Interconnexion Bekoko 400/225 kV',
    code: 'SS-BKK-400',
    region: 'Littoral',
    voltageLevels: ['400kV', '225kV'],
    gridRole_fr: 'Nœud autoroutier d\'interconnexion THT et dispatching régional',
    gridRole_en: 'EHV highway interconnection hub & regional dispatching'
  },
  {
    id: 'sub-oyomabang',
    name: 'Poste Source Oyomabang 225/30 kV',
    code: 'SS-OYM-225',
    region: 'Yaoundé Métropole',
    voltageLevels: ['225kV', '30kV'],
    gridRole_fr: 'Poste de transformation principal alimentant la capitale',
    gridRole_en: 'Main transformation substation supplying the capital city'
  },
  {
    id: 'sub-bassa',
    name: 'Poste Répartiteur Bassa 30 kV',
    code: 'SS-BAS-030',
    region: 'Douala Pôle Industriel',
    voltageLevels: ['30kV', '400V'],
    gridRole_fr: 'Poste de répartition HTA alimentant zone portuaire et complexes industriels',
    gridRole_en: 'MV switching substation supplying industrial hub and port complexes'
  }
];

export const CIM_CONNECTIVITY_NODES: CimConnectivityNode[] = [
  {
    id: 'cnode-gen-15',
    name: 'CN_GEN_15KV',
    topologicalNodeId: 'tnode-1',
    substationId: 'sub-nachtigal',
    voltageLevel: '15kV',
    nominalVoltageKv: 15.0,
    description_fr: 'Jeu de barres stator alternateur hydroélectrique 15 kV',
    description_en: '15 kV hydro generator stator busbar'
  },
  {
    id: 'cnode-nch-225-bb1',
    name: 'CN_NCH_BB1_225',
    topologicalNodeId: 'tnode-2',
    substationId: 'sub-nachtigal',
    voltageLevel: '225kV',
    nominalVoltageKv: 225.0,
    description_fr: 'Jeu de barres 1 225 kV Nachtigal',
    description_en: '225 kV Busbar 1 Nachtigal'
  },
  {
    id: 'cnode-bkk-400-bb',
    name: 'CN_BKK_BB_400',
    topologicalNodeId: 'tnode-3',
    substationId: 'sub-bekoko',
    voltageLevel: '400kV',
    nominalVoltageKv: 400.0,
    description_fr: 'Jeu de barres 400 kV Dorsale Nord-Sud',
    description_en: '400 kV North-South Backbone Busbar'
  },
  {
    id: 'cnode-bkk-225-bb',
    name: 'CN_BKK_BB_225',
    topologicalNodeId: 'tnode-4',
    substationId: 'sub-bekoko',
    voltageLevel: '225kV',
    nominalVoltageKv: 225.0,
    description_fr: 'Jeu de barres 225 kV Interconnexion Littoral',
    description_en: '225 kV Littoral Interconnection Busbar'
  },
  {
    id: 'cnode-oym-225-bb',
    name: 'CN_OYM_BB_225',
    topologicalNodeId: 'tnode-5',
    substationId: 'sub-oyomabang',
    voltageLevel: '225kV',
    nominalVoltageKv: 225.0,
    description_fr: 'Jeu de barres HTB 225 kV Oyomabang',
    description_en: '225 kV HV Busbar Oyomabang'
  },
  {
    id: 'cnode-oym-30-bb',
    name: 'CN_OYM_BB_30',
    topologicalNodeId: 'tnode-6',
    substationId: 'sub-oyomabang',
    voltageLevel: '30kV',
    nominalVoltageKv: 30.0,
    description_fr: 'Rame HTA 30 kV Distribution Urbaine',
    description_en: '30 kV MV Switchgear Urban Distribution'
  },
  {
    id: 'cnode-bas-30-bb',
    name: 'CN_BAS_BB_30',
    topologicalNodeId: 'tnode-7',
    substationId: 'sub-bassa',
    voltageLevel: '30kV',
    nominalVoltageKv: 30.0,
    description_fr: 'Rame 30 kV Zone Industrielle Bassa',
    description_en: '30 kV Industrial Feeder Bus Bassa'
  },
  {
    id: 'cnode-lv-400',
    name: 'CN_LV_400V',
    topologicalNodeId: 'tnode-8',
    substationId: 'sub-bassa',
    voltageLevel: '400V',
    nominalVoltageKv: 0.4,
    description_fr: 'Tableau Général Basse Tension (TGBT) 400 V',
    description_en: 'Main Low Voltage Switchboard (LV) 400 V'
  }
];

export const CIM_CONDUCTING_EQUIPMENT: CimConductingEquipment[] = [
  {
    id: 'eq-gen-nch-01',
    name: 'G1_Nachtigal_Hydro (7x60MW)',
    cimType: 'HydroGeneratingUnit',
    substationId: 'sub-nachtigal',
    voltageLevel: '15kV',
    ratedMva: 70.5,
    nominalVoltageKv: 15.0,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 80,
    y: 220,
    associatedStandards: ['IEC 60034-1', 'IEC 61850-7-410'],
    failureModes_fr: ['Défaut d\'isolement enroulement stator', 'Perte d\'excitation', 'Vibration palier hydro'],
    failureModes_en: ['Stator winding insulation breakdown', 'Loss of excitation', 'Turbine bearing vibration'],
    aasAssetId: 'eq-trafo-gsu-01',
    description_fr: 'Groupe hydroélectrique Francis 60 MW à vitesse synchrone 107.1 tr/min',
    description_en: '60 MW Francis synchronous hydro turbine-generator unit at 107.1 rpm',
    terminals: [
      { id: 'term-g1-1', name: 'T1', sequenceNumber: 1, conductingEquipmentId: 'eq-gen-nch-01', connectivityNodeId: 'cnode-gen-15', connected: true }
    ]
  },
  {
    id: 'eq-trafo-gsu-01',
    name: 'T1_GSU_Elevateur 15/225kV',
    cimType: 'PowerTransformer',
    substationId: 'sub-nachtigal',
    voltageLevel: '225kV',
    ratedMva: 75.0,
    nominalVoltageKv: 225.0,
    resistanceOhm: 0.45,
    reactanceOhm: 14.8,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 230,
    y: 220,
    protectingRelayIds: ['rel-87t-gsu', 'rel-51-gsu'],
    associatedStandards: ['IEC 60076-1', 'IEC 60076-5', 'IEEE C57.12.00'],
    failureModes_fr: ['Court-circuit entre spires', 'Dégradation diélectrique huile', 'Echauffement traversée HTB'],
    failureModes_en: ['Inter-turn winding fault', 'Oil dielectric breakdown', 'HV bushing thermal runaway'],
    aasAssetId: 'eq-trafo-gsu-01',
    description_fr: 'Transformateur élévateur de groupe (GSU) 75 MVA YNd11 à huile avec changeur de prises en charge',
    description_en: '75 MVA YNd11 oil-immersed Generator Step-Up (GSU) transformer with on-load tap changer',
    terminals: [
      { id: 'term-gsu-p', name: 'Prim', sequenceNumber: 1, conductingEquipmentId: 'eq-trafo-gsu-01', connectivityNodeId: 'cnode-gen-15', connected: true },
      { id: 'term-gsu-s', name: 'Sec', sequenceNumber: 2, conductingEquipmentId: 'eq-trafo-gsu-01', connectivityNodeId: 'cnode-nch-225-bb1', connected: true }
    ]
  },
  {
    id: 'eq-brk-gsu-225',
    name: 'DJ_225_GSU_Nachtigal',
    cimType: 'Breaker',
    substationId: 'sub-nachtigal',
    voltageLevel: '225kV',
    ratedAmps: 3150,
    nominalVoltageKv: 225.0,
    status: 'CLOSED',
    isEnergized: true,
    x: 320,
    y: 220,
    associatedStandards: ['IEC 62271-100', 'IEC 61850-7-4'],
    failureModes_fr: ['Baisse pression gaz SF6', 'Refus de déclenchement mécanique', 'Réamorçage coupure arc'],
    failureModes_en: ['SF6 gas pressure drop', 'Trip latch mechanical failure', 'Arc restrike on interruption'],
    aasAssetId: 'eq-disj-sf6-01',
    description_fr: 'Disjoncteur 225 kV SF6 à coupure auto-pneumatique, Icu 50 kA / 3s',
    description_en: '225 kV SF6 puffer circuit breaker, breaking capacity 50 kA / 3s',
    terminals: [
      { id: 'term-brk-gsu-1', name: 'T1', sequenceNumber: 1, conductingEquipmentId: 'eq-brk-gsu-225', connectivityNodeId: 'cnode-nch-225-bb1', connected: true },
      { id: 'term-brk-gsu-2', name: 'T2', sequenceNumber: 2, conductingEquipmentId: 'eq-brk-gsu-225', connectivityNodeId: 'cnode-nch-225-bb1', connected: true }
    ]
  },
  {
    id: 'eq-line-225-nch-oym',
    name: 'L225_Nachtigal_Oyomabang (L12)',
    cimType: 'ACLineSegment',
    substationId: 'sub-nachtigal',
    voltageLevel: '225kV',
    ratedMva: 320.0,
    nominalVoltageKv: 225.0,
    resistanceOhm: 3.12,
    reactanceOhm: 18.5,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 480,
    y: 150,
    protectingRelayIds: ['rel-21-line', 'rel-87l-line'],
    associatedStandards: ['IEC 60826', 'IEC 61850-9-2', 'CIGRE TB 638'],
    failureModes_fr: ['Amorçage coup de foudre', 'Rupture câble de garde OPGW', 'Végétation sous portée'],
    failureModes_en: ['Lightning flashover', 'OPGW earth wire severance', 'Vegetation encroachment flashover'],
    aasAssetId: 'eq-ligne-225-01',
    description_fr: 'Ligne aérienne double terne 225 kV, 65 km, faisceau Almelec-Acier 2x Aster 570',
    description_en: 'Double-circuit 225 kV overhead line, 65 km, twin AAAC 2x Aster 570 bundle',
    terminals: [
      { id: 'term-l12-1', name: 'Nachtigal_Side', sequenceNumber: 1, conductingEquipmentId: 'eq-line-225-nch-oym', connectivityNodeId: 'cnode-nch-225-bb1', connected: true },
      { id: 'term-l12-2', name: 'Oyomabang_Side', sequenceNumber: 2, conductingEquipmentId: 'eq-line-225-nch-oym', connectivityNodeId: 'cnode-oym-225-bb', connected: true }
    ]
  },
  {
    id: 'eq-line-225-nch-bkk',
    name: 'L225_Nachtigal_Bekoko (L14 Interco)',
    cimType: 'ACLineSegment',
    substationId: 'sub-nachtigal',
    voltageLevel: '225kV',
    ratedMva: 400.0,
    nominalVoltageKv: 225.0,
    resistanceOhm: 5.4,
    reactanceOhm: 26.2,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 480,
    y: 310,
    protectingRelayIds: ['rel-21-line2'],
    associatedStandards: ['IEC 60826'],
    failureModes_fr: ['Galop des conducteurs sous tempête', 'Contournement isolateur pollué'],
    failureModes_en: ['Conductor galloping in high wind', 'Insulator pollution flashover'],
    aasAssetId: 'eq-ligne-225-01',
    description_fr: 'Ligne d\'interconnexion Centre-Littoral 225 kV, 140 km vers le pôle économique',
    description_en: 'Centre-Littoral 225 kV interconnection line, 140 km towards economic hub',
    terminals: [
      { id: 'term-l14-1', name: 'Nachtigal_Side', sequenceNumber: 1, conductingEquipmentId: 'eq-line-225-nch-bkk', connectivityNodeId: 'cnode-nch-225-bb1', connected: true },
      { id: 'term-l14-2', name: 'Bekoko_Side', sequenceNumber: 2, conductingEquipmentId: 'eq-line-225-nch-bkk', connectivityNodeId: 'cnode-bkk-225-bb', connected: true }
    ]
  },
  {
    id: 'eq-trafo-bkk-auto',
    name: 'Autotransformateur Bekoko 400/225kV',
    cimType: 'PowerTransformer',
    substationId: 'sub-bekoko',
    voltageLevel: '400kV',
    ratedMva: 300.0,
    nominalVoltageKv: 400.0,
    resistanceOhm: 0.8,
    reactanceOhm: 12.0,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 640,
    y: 340,
    protectingRelayIds: ['rel-87t-auto'],
    associatedStandards: ['IEC 60076-1', 'IEC 60076-3'],
    failureModes_fr: ['Surfluxage transitoire V/f', 'Défaillance enroulement tertiaire'],
    failureModes_en: ['Transient overfluxing V/f', 'Delta tertiary winding failure'],
    aasAssetId: 'eq-trafo-auto-400',
    description_fr: 'Autotransformateur THT 400/225 kV 300 MVA avec tertiaire de stabilisation 30 kV 50 MVAR',
    description_en: 'EHV 400/225 kV 300 MVA autotransformer with 30 kV 50 MVAR delta stabilizing tertiary',
    terminals: [
      { id: 'term-at-400', name: '400kV', sequenceNumber: 1, conductingEquipmentId: 'eq-trafo-bkk-auto', connectivityNodeId: 'cnode-bkk-400-bb', connected: true },
      { id: 'term-at-225', name: '225kV', sequenceNumber: 2, conductingEquipmentId: 'eq-trafo-bkk-auto', connectivityNodeId: 'cnode-bkk-225-bb', connected: true }
    ]
  },
  {
    id: 'eq-brk-oym-in',
    name: 'DJ_Arrivee_225_Oyomabang',
    cimType: 'Breaker',
    substationId: 'sub-oyomabang',
    voltageLevel: '225kV',
    ratedAmps: 2500,
    nominalVoltageKv: 225.0,
    status: 'CLOSED',
    isEnergized: true,
    x: 620,
    y: 150,
    associatedStandards: ['IEC 62271-100'],
    failureModes_fr: ['Défaut commande moteur armement', 'Fuite SF6'],
    failureModes_en: ['Spring charging motor fault', 'SF6 gas leakage'],
    aasAssetId: 'eq-disj-sf6-01',
    description_fr: 'Disjoncteur d\'arrivée ligne 225 kV Oyomabang',
    description_en: '225 kV Line feeder incomer circuit breaker Oyomabang',
    terminals: [
      { id: 'term-brk-oym-1', name: 'T1', sequenceNumber: 1, conductingEquipmentId: 'eq-brk-oym-in', connectivityNodeId: 'cnode-oym-225-bb', connected: true },
      { id: 'term-brk-oym-2', name: 'T2', sequenceNumber: 2, conductingEquipmentId: 'eq-brk-oym-in', connectivityNodeId: 'cnode-oym-225-bb', connected: true }
    ]
  },
  {
    id: 'eq-trafo-oym-stepdown',
    name: 'TR_Oyomabang 225/30kV (63MVA)',
    cimType: 'PowerTransformer',
    substationId: 'sub-oyomabang',
    voltageLevel: '225kV',
    ratedMva: 63.0,
    nominalVoltageKv: 225.0,
    resistanceOhm: 0.95,
    reactanceOhm: 16.2,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 760,
    y: 150,
    protectingRelayIds: ['rel-87t-oym', 'rel-50-51-oym'],
    associatedStandards: ['IEC 60076-1', 'IEC 60076-7'],
    failureModes_fr: ['Défaut masse cuve Buchholz', 'Surcharge thermique enroulements'],
    failureModes_en: ['Tank earth Buchholz gas trip', 'Winding thermal overload'],
    aasAssetId: 'eq-trafo-hta-01',
    description_fr: 'Transformateur abaisseur de sous-station 63 MVA 225/30 kV YNd11 ONAF',
    description_en: 'Substation step-down transformer 63 MVA 225/30 kV YNd11 ONAF cooling',
    terminals: [
      { id: 'term-tr-oym-p', name: '225kV', sequenceNumber: 1, conductingEquipmentId: 'eq-trafo-oym-stepdown', connectivityNodeId: 'cnode-oym-225-bb', connected: true },
      { id: 'term-tr-oym-s', name: '30kV', sequenceNumber: 2, conductingEquipmentId: 'eq-trafo-oym-stepdown', connectivityNodeId: 'cnode-oym-30-bb', connected: true }
    ]
  },
  {
    id: 'eq-feeder-30-bassa',
    name: 'Depart_30kV_Bassa_Express',
    cimType: 'ACLineSegment',
    substationId: 'sub-bassa',
    voltageLevel: '30kV',
    ratedMva: 24.0,
    nominalVoltageKv: 30.0,
    resistanceOhm: 1.8,
    reactanceOhm: 4.2,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 880,
    y: 200,
    protectingRelayIds: ['rel-51n-feeder'],
    associatedStandards: ['IEC 60502-2'],
    failureModes_fr: ['Claquement boîte d\'extrémité câble', 'Défaut homopolaire souterrain'],
    failureModes_en: ['Cable termination breakdown', 'Underground zero-sequence earth fault'],
    aasAssetId: 'eq-feeder-30-01',
    description_fr: 'Départ câble souterrain 30 kV XLPE 3x240 mm² Cu, 18 km',
    description_en: '30 kV underground XLPE cable feeder 3x240 mm² Cu, 18 km',
    terminals: [
      { id: 'term-fdr-1', name: 'Oyomabang_Out', sequenceNumber: 1, conductingEquipmentId: 'eq-feeder-30-bassa', connectivityNodeId: 'cnode-oym-30-bb', connected: true },
      { id: 'term-fdr-2', name: 'Bassa_In', sequenceNumber: 2, conductingEquipmentId: 'eq-feeder-30-bassa', connectivityNodeId: 'cnode-bas-30-bb', connected: true }
    ]
  },
  {
    id: 'eq-trafo-mv-lv-bassa',
    name: 'Poste_HTA_BT_Transformateur 30kV/400V',
    cimType: 'PowerTransformer',
    substationId: 'sub-bassa',
    voltageLevel: '30kV',
    ratedMva: 1.25,
    nominalVoltageKv: 30.0,
    resistanceOhm: 0.04,
    reactanceOhm: 0.18,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 990,
    y: 200,
    associatedStandards: ['IEC 60076-11'],
    failureModes_fr: ['Echauffement résine transformateur sec', 'Surtension foudre secondaire'],
    failureModes_en: ['Cast resin dry-type overheating', 'Secondary lightning impulse overvoltage'],
    aasAssetId: 'eq-trafo-bt-01',
    description_fr: 'Transformateur sec enrobé 1250 kVA 30 kV / 400 V Dyn11 pour usine et tertiaire',
    description_en: 'Cast resin dry-type transformer 1250 kVA 30 kV / 400 V Dyn11 for industrial load',
    terminals: [
      { id: 'term-mvlv-p', name: '30kV', sequenceNumber: 1, conductingEquipmentId: 'eq-trafo-mv-lv-bassa', connectivityNodeId: 'cnode-bas-30-bb', connected: true },
      { id: 'term-mvlv-s', name: '400V', sequenceNumber: 2, conductingEquipmentId: 'eq-trafo-mv-lv-bassa', connectivityNodeId: 'cnode-lv-400', connected: true }
    ]
  },
  {
    id: 'eq-consumer-industry',
    name: 'Charge_Industrielle_Zone_Portuaire (12 MW)',
    cimType: 'EnergyConsumer',
    substationId: 'sub-bassa',
    voltageLevel: '400V',
    ratedMva: 14.0,
    nominalVoltageKv: 0.4,
    status: 'IN_SERVICE',
    isEnergized: true,
    x: 1090,
    y: 200,
    associatedStandards: ['IEC 60364-1', 'IEC 61439-1'],
    failureModes_fr: ['Harmoniques variateurs de vitesse', 'Déséquilibre de phases'],
    failureModes_en: ['Variable speed drive harmonics', 'Phase voltage unbalance'],
    aasAssetId: 'eq-load-ind-01',
    description_fr: 'Usines chimiques, laminoirs et pompage portuaire avec compensation cos phi',
    description_en: 'Chemical plants, rolling mills and harbor pumping with power factor correction',
    terminals: [
      { id: 'term-ind-1', name: 'TGBT_Feeder', sequenceNumber: 1, conductingEquipmentId: 'eq-consumer-industry', connectivityNodeId: 'cnode-lv-400', connected: true }
    ]
  }
];

export const CIM_GRAPH_EDGES: CimGraphEdge[] = [
  {
    id: 'edge-g1-gsu',
    sourceEquipmentId: 'eq-gen-nch-01',
    targetEquipmentId: 'eq-trafo-gsu-01',
    connectivityNodeId: 'cnode-gen-15',
    impedanceZ: 0.05,
    activePowerFlowMw: 60.0,
    reactivePowerFlowMvar: 12.5,
    capacityLimitMw: 70.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-gsu-brk',
    sourceEquipmentId: 'eq-trafo-gsu-01',
    targetEquipmentId: 'eq-brk-gsu-225',
    connectivityNodeId: 'cnode-nch-225-bb1',
    impedanceZ: 0.02,
    activePowerFlowMw: 59.4,
    reactivePowerFlowMvar: 14.8,
    capacityLimitMw: 75.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-brk-line-oym',
    sourceEquipmentId: 'eq-brk-gsu-225',
    targetEquipmentId: 'eq-line-225-nch-oym',
    connectivityNodeId: 'cnode-nch-225-bb1',
    lengthKm: 65,
    impedanceZ: 18.7,
    activePowerFlowMw: 42.0,
    reactivePowerFlowMvar: 8.4,
    capacityLimitMw: 320.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-brk-line-bkk',
    sourceEquipmentId: 'eq-brk-gsu-225',
    targetEquipmentId: 'eq-line-225-nch-bkk',
    connectivityNodeId: 'cnode-nch-225-bb1',
    lengthKm: 140,
    impedanceZ: 26.7,
    activePowerFlowMw: 17.4,
    reactivePowerFlowMvar: 6.4,
    capacityLimitMw: 400.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-line-bkk-auto',
    sourceEquipmentId: 'eq-line-225-nch-bkk',
    targetEquipmentId: 'eq-trafo-bkk-auto',
    connectivityNodeId: 'cnode-bkk-225-bb',
    impedanceZ: 0.1,
    activePowerFlowMw: 17.2,
    reactivePowerFlowMvar: 6.2,
    capacityLimitMw: 300.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-line-oym-brk',
    sourceEquipmentId: 'eq-line-225-nch-oym',
    targetEquipmentId: 'eq-brk-oym-in',
    connectivityNodeId: 'cnode-oym-225-bb',
    impedanceZ: 0.02,
    activePowerFlowMw: 41.5,
    reactivePowerFlowMvar: 8.1,
    capacityLimitMw: 320.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-brk-oym-tr',
    sourceEquipmentId: 'eq-brk-oym-in',
    targetEquipmentId: 'eq-trafo-oym-stepdown',
    connectivityNodeId: 'cnode-oym-225-bb',
    impedanceZ: 0.05,
    activePowerFlowMw: 41.5,
    reactivePowerFlowMvar: 8.1,
    capacityLimitMw: 63.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-tr-oym-feeder',
    sourceEquipmentId: 'eq-trafo-oym-stepdown',
    targetEquipmentId: 'eq-feeder-30-bassa',
    connectivityNodeId: 'cnode-oym-30-bb',
    lengthKm: 18,
    impedanceZ: 4.5,
    activePowerFlowMw: 21.0,
    reactivePowerFlowMvar: 4.8,
    capacityLimitMw: 24.0,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-feeder-mvlv',
    sourceEquipmentId: 'eq-feeder-30-bassa',
    targetEquipmentId: 'eq-trafo-mv-lv-bassa',
    connectivityNodeId: 'cnode-bas-30-bb',
    impedanceZ: 0.18,
    activePowerFlowMw: 1.15,
    reactivePowerFlowMvar: 0.35,
    capacityLimitMw: 1.25,
    isEnergized: true,
    isOverloaded: false
  },
  {
    id: 'edge-mvlv-load',
    sourceEquipmentId: 'eq-trafo-mv-lv-bassa',
    targetEquipmentId: 'eq-consumer-industry',
    connectivityNodeId: 'cnode-lv-400',
    impedanceZ: 0.01,
    activePowerFlowMw: 1.12,
    reactivePowerFlowMvar: 0.33,
    capacityLimitMw: 1.25,
    isEnergized: true,
    isOverloaded: false
  }
];

// Pre-computed graph isolation cut-sets for LOTO / switching safety
export const ISOLATION_SOLUTIONS: Record<string, IsolationSolution> = {
  'eq-trafo-gsu-01': {
    targetEquipmentId: 'eq-trafo-gsu-01',
    targetName: 'T1_GSU_Elevateur 15/225kV',
    minimalIsolationBreakers: ['eq-gen-nch-01', 'eq-brk-gsu-225'],
    deEnergizedEquipments: ['eq-trafo-gsu-01'],
    retainedHealthyLoadsMw: 0.0,
    shedLoadsMw: 60.0,
    switchingSequence_fr: [
      '1. Émettre ordre d\'ouverture au disjoncteur HTB DJ_225_GSU_Nachtigal',
      '2. Réduire consigne P/Q du régulateur de vitesse hydro G1 et déclencher l\'alternateur',
      '3. Ouvrir les sectionneurs d\'aiguillage amont et aval (confirmation visuelle)',
      '4. Vérification d\'Absence de Tension (VAT) sur les 3 phases 225 kV et 15 kV',
      '5. Fermer les sectionneurs de mise à la terre (MALT) et consigner (LOTO cadenas)'
    ],
    switchingSequence_en: [
      '1. Issue trip command to 225 kV breaker DJ_225_GSU_Nachtigal',
      '2. Ramp down hydro governor P/Q setpoint and trip generator G1',
      '3. Open upstream and downstream isolating disconnectors (visual confirmation)',
      '4. Voltage Absence Verification (VAT) on 225 kV and 15 kV terminals',
      '5. Close Earthing Switches (MALT) and apply Lockout/Tagout (LOTO)'
    ]
  },
  'eq-line-225-nch-oym': {
    targetEquipmentId: 'eq-line-225-nch-oym',
    targetName: 'L225_Nachtigal_Oyomabang (L12)',
    minimalIsolationBreakers: ['eq-brk-gsu-225', 'eq-brk-oym-in'],
    deEnergizedEquipments: ['eq-line-225-nch-oym'],
    retainedHealthyLoadsMw: 17.4,
    shedLoadsMw: 42.0,
    switchingSequence_fr: [
      '1. Déclencher le disjoncteur d\'arrivée Oyomabang DJ_Arrivee_225_Oyomabang',
      '2. Déclencher le disjoncteur de départ Nachtigal DJ_225_GSU_Nachtigal',
      '3. Basculer le transit sur la ligne d\'interconnexion L14 Bekoko',
      '4. Vérifier l\'absence de tension par détecteur optique THT',
      '5. Fermer les sectionneurs de mise à la terre aux deux extrémités de la ligne L12'
    ],
    switchingSequence_en: [
      '1. Trip arrival breaker at Oyomabang substation DJ_Arrivee_225_Oyomabang',
      '2. Trip departure breaker at Nachtigal substation DJ_225_GSU_Nachtigal',
      '3. Re-route remaining power dispatch via L14 Bekoko interconnector',
      '4. Verify absence of voltage using EHV optical tester',
      '5. Close line earthing switches at both substations Nachtigal & Oyomabang'
    ]
  },
  'eq-trafo-oym-stepdown': {
    targetEquipmentId: 'eq-trafo-oym-stepdown',
    targetName: 'TR_Oyomabang 225/30kV (63MVA)',
    minimalIsolationBreakers: ['eq-brk-oym-in'],
    deEnergizedEquipments: ['eq-trafo-oym-stepdown', 'eq-feeder-30-bassa', 'eq-trafo-mv-lv-bassa', 'eq-consumer-industry'],
    retainedHealthyLoadsMw: 0.0,
    shedLoadsMw: 41.5,
    switchingSequence_fr: [
      '1. Délestage préventif des départs HTA 30 kV urbains pour éviter le surcourant',
      '2. Ouvrir le disjoncteur 225 kV d\'alimentation du transformateur',
      '3. Isoler le neutre HTA et consigner les cellules 30 kV débrochées',
      '4. VAT et pose de mises à la terre temporaires sur les bornes traversées'
    ],
    switchingSequence_en: [
      '1. Preventively shed 30 kV feeders to prevent downstream inrush',
      '2. Open 225 kV transformer primary circuit breaker',
      '3. Isolate MV neutral point and rack out 30 kV switchgear cubicles',
      '4. Verify voltage absence and apply temporary grounding clamps'
    ]
  }
};

// Pre-computed N-1 Contingency Impacts
export const CONTINGENCY_N1_CASES: Record<string, ContingencyN1Result> = {
  'eq-line-225-nch-oym': {
    trippedElementId: 'eq-line-225-nch-oym',
    trippedElementName: 'L225_Nachtigal_Oyomabang (L12 - 320MW)',
    impactSeverity: 'CRITICAL',
    overloadedBranches: [
      {
        edgeId: 'edge-brk-line-bkk',
        branchName: 'L225_Nachtigal_Bekoko (L14)',
        loadingPercent: 114.2,
        limitMw: 400.0,
        newFlowMw: 456.8
      }
    ],
    voltageViolations: [
      {
        nodeId: 'cnode-oym-225-bb',
        nodeName: 'Poste Oyomabang 225 kV',
        busVoltageKv: 204.8,
        deviationPercent: -8.9
      },
      {
        nodeId: 'cnode-oym-30-bb',
        nodeName: 'Rame 30 kV Yaoundé',
        busVoltageKv: 27.2,
        deviationPercent: -9.3
      }
    ],
    islandedNodes: ['cnode-oym-225-bb', 'cnode-oym-30-bb'],
    lossOfGenerationMw: 0.0,
    lossOfLoadMw: 42.0,
    remedialActions_fr: [
      'Démarrage d\'urgence de la turbine gaz de secours (TAG Oyomabang 30 MW)',
      'Délester 15 MW d\'usines métallurgiques non prioritaires sur le départ HTA Bassa',
      'Enclencher les gradins de condensateurs 225 kV pour remonter la tension au-dessus de 215 kV'
    ],
    remedialActions_en: [
      'Emergency start-up of standby peaker gas turbine (TAG Oyomabang 30 MW)',
      'Under-frequency load shedding of 15 MW non-critical industrial feeders',
      'Engage 225 kV shunt capacitor banks to restore bus voltage above 215 kV'
    ]
  },
  'eq-line-225-nch-bkk': {
    trippedElementId: 'eq-line-225-nch-bkk',
    trippedElementName: 'L225_Nachtigal_Bekoko (L14 - 400MW)',
    impactSeverity: 'HIGH',
    overloadedBranches: [
      {
        edgeId: 'edge-brk-line-oym',
        branchName: 'L225_Nachtigal_Oyomabang (L12)',
        loadingPercent: 88.5,
        limitMw: 320.0,
        newFlowMw: 283.2
      }
    ],
    voltageViolations: [
      {
        nodeId: 'cnode-bkk-225-bb',
        nodeName: 'Poste Bekoko 225 kV',
        busVoltageKv: 212.5,
        deviationPercent: -5.5
      }
    ],
    islandedNodes: [],
    lossOfGenerationMw: 0.0,
    lossOfLoadMw: 0.0,
    remedialActions_fr: [
      'Ajuster les prises en charge de l\'autotransformateur Bekoko 400/225 kV (+2 plots)',
      'Augmenter la production de la centrale thermique de Yassa à Douala (+40 MW)'
    ],
    remedialActions_en: [
      'Step up on-load tap changer on Bekoko 400/225 kV autotransformer (+2 taps)',
      'Ramp up Yassa thermal power plant generation in Douala (+40 MW)'
    ]
  }
};

// Semantic GraphRAG Data Model (Nodes & Relationships)
export const SEMANTIC_GRAPH_NODES: SemanticGraphNode[] = [
  // Equipments
  { id: 'sem-gsu', label_fr: 'Transfo GSU T1 15/225kV', label_en: 'GSU Transformer T1', nodeType: 'EQUIPMENT', category: 'PowerTransformer', referenceId: 'eq-trafo-gsu-01', x: 280, y: 160 },
  { id: 'sem-brk-sf6', label_fr: 'Disjoncteur SF6 225kV', label_en: '225kV SF6 Breaker', nodeType: 'EQUIPMENT', category: 'Breaker', referenceId: 'eq-brk-gsu-225', x: 420, y: 160 },
  { id: 'sem-line-225', label_fr: 'Ligne 225kV Nachtigal-Oyomabang', label_en: '225kV Line L12', nodeType: 'EQUIPMENT', category: 'ACLineSegment', referenceId: 'eq-line-225-nch-oym', x: 580, y: 160 },
  { id: 'sem-tr-stepdown', label_fr: 'Transfo Abaisseur 225/30kV', label_en: 'Step-down Trafo 225/30kV', nodeType: 'EQUIPMENT', category: 'PowerTransformer', referenceId: 'eq-trafo-oym-stepdown', x: 740, y: 160 },

  // Standards
  { id: 'std-iec-60076', label_fr: 'Norme CEI 60076 (Transformateurs)', label_en: 'IEC 60076 (Power Transformers)', nodeType: 'STANDARD', category: 'Standard', x: 280, y: 40 },
  { id: 'std-iec-62271', label_fr: 'Norme CEI 62271 (Appareillage HT)', label_en: 'IEC 62271 (High Voltage Switchgear)', nodeType: 'STANDARD', category: 'Standard', x: 420, y: 40 },
  { id: 'std-iec-60826', label_fr: 'Norme CEI 60826 (Lignes Aériennes)', label_en: 'IEC 60826 (Overhead Transmission Lines)', nodeType: 'STANDARD', category: 'Standard', x: 580, y: 40 },
  { id: 'std-iec-61850', label_fr: 'Norme CEI 61850 (Digital Substation)', label_en: 'IEC 61850 (Substation Automation)', nodeType: 'STANDARD', category: 'Standard', x: 500, y: -40 },

  // Protections ANSI
  { id: 'prot-87t', label_fr: 'Différentielle Transfo (ANSI 87T)', label_en: 'Differential Transformer (ANSI 87T)', nodeType: 'PROTECTION_FUNCTION', category: 'Protection', x: 200, y: 280 },
  { id: 'prot-21', label_fr: 'Protection Distance (ANSI 21)', label_en: 'Distance Relay (ANSI 21)', nodeType: 'PROTECTION_FUNCTION', category: 'Protection', x: 620, y: 280 },
  { id: 'prot-50-51', label_fr: 'Maximum de Courant (ANSI 50/51)', label_en: 'Overcurrent (ANSI 50/51)', nodeType: 'PROTECTION_FUNCTION', category: 'Protection', x: 380, y: 280 },

  // Failure Modes
  { id: 'fail-short-circuit', label_fr: 'Court-circuit Triphasé Franc', label_en: '3-Phase Solid Short Circuit', nodeType: 'FAILURE_MODE', category: 'Failure', x: 500, y: 380 },
  { id: 'fail-sf6-leak', label_fr: 'Fuite Gaz SF6 (< 0.5 MPa)', label_en: 'SF6 Gas Pressure Loss', nodeType: 'FAILURE_MODE', category: 'Failure', x: 340, y: 380 },
  { id: 'fail-thermal-overload', label_fr: 'Surchauffe Diélectrique (> 105°C)', label_en: 'Dielectric Thermal Runaway', nodeType: 'FAILURE_MODE', category: 'Failure', x: 220, y: 380 },

  // AAS Submodels
  { id: 'aas-nameplate', label_fr: 'Digital Nameplate (AAS v3)', label_en: 'Digital Nameplate (AAS v3)', nodeType: 'AAS_SUBMODEL', category: 'AasSubmodel', x: 140, y: 120 },
  { id: 'aas-telemetry', label_fr: 'Operational Telemetry (AAS v3)', label_en: 'Operational Telemetry (AAS v3)', nodeType: 'AAS_SUBMODEL', category: 'AasSubmodel', x: 880, y: 120 }
];

export const SEMANTIC_GRAPH_LINKS: SemanticGraphLink[] = [
  // Standards
  { sourceId: 'sem-gsu', targetId: 'std-iec-60076', relationType: 'STANDARDIZED_BY', label_fr: 'conforme à', label_en: 'complies with' },
  { sourceId: 'sem-brk-sf6', targetId: 'std-iec-62271', relationType: 'STANDARDIZED_BY', label_fr: 'certifié par', label_en: 'certified by' },
  { sourceId: 'sem-line-225', targetId: 'std-iec-60826', relationType: 'STANDARDIZED_BY', label_fr: 'dimensionné selon', label_en: 'designed per' },
  { sourceId: 'sem-brk-sf6', targetId: 'std-iec-61850', relationType: 'STANDARDIZED_BY', label_fr: 'interfacé GOOSE/SV', label_en: 'GOOSE/SV interface' },

  // Protections
  { sourceId: 'prot-87t', targetId: 'sem-gsu', relationType: 'PROTECTED_BY', label_fr: 'protège zone interne', label_en: 'protects unit zone' },
  { sourceId: 'prot-21', targetId: 'sem-line-225', relationType: 'PROTECTED_BY', label_fr: 'surveille impédance', label_en: 'monitors impedance' },
  { sourceId: 'prot-50-51', targetId: 'sem-brk-sf6', relationType: 'PROTECTED_BY', label_fr: 'déclenche bobine', label_en: 'trips shunt coil' },

  // Failures
  { sourceId: 'sem-gsu', targetId: 'fail-thermal-overload', relationType: 'SUBJECT_TO_FAILURE', label_fr: 'vulnérable à', label_en: 'vulnerable to' },
  { sourceId: 'sem-brk-sf6', targetId: 'fail-sf6-leak', relationType: 'SUBJECT_TO_FAILURE', label_fr: 'risque d\'étanchéité', label_en: 'seal leak risk' },
  { sourceId: 'sem-line-225', targetId: 'fail-short-circuit', relationType: 'SUBJECT_TO_FAILURE', label_fr: 'exposition foudre', label_en: 'lightning exposure' },

  // Electrical feeds
  { sourceId: 'sem-gsu', targetId: 'sem-brk-sf6', relationType: 'ELECTRICALLY_FEEDS', label_fr: 'alimente', label_en: 'feeds' },
  { sourceId: 'sem-brk-sf6', targetId: 'sem-line-225', relationType: 'ELECTRICALLY_FEEDS', label_fr: 'commute flux vers', label_en: 'switches power to' },
  { sourceId: 'sem-line-225', targetId: 'sem-tr-stepdown', relationType: 'ELECTRICALLY_FEEDS', label_fr: 'transmet à', label_en: 'transmits to' },

  // AAS Submodels
  { sourceId: 'sem-gsu', targetId: 'aas-nameplate', relationType: 'HAS_AAS_SUBMODEL', label_fr: 'défini par jumeau', label_en: 'defined by twin' },
  { sourceId: 'sem-tr-stepdown', targetId: 'aas-telemetry', relationType: 'HAS_AAS_SUBMODEL', label_fr: 'télémétrie temps-réel', label_en: 'real-time telemetry' }
];

/**
 * Generate IEC 61970-552 CIM RDF/XML snippet for export
 */
export function generateCimRdfXml(): string {
  const timestamp = new Date().toISOString();
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by EPEDE Digital Twin Engine - IEC 61970-552 / IEC 61970-452 CGMES Profile -->
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:cim="http://iec.ch/TC57/2013/CIM-schema-cim16#"
         xmlns:md="http://iec.ch/TC57/61970-552/ModelDescription/1#">
  
  <md:Model rdf:about="urn:uuid:epede-network-model-cameroun-2026">
    <md:Model.created>${timestamp}</md:Model.created>
    <md:Model.scenarioTime>${timestamp}</md:Model.scenarioTime>
    <md:Model.version>3.0.0</md:Model.version>
    <md:Model.description>EPEDE Master Transmission &amp; Distribution Grid (IEC 61970 CIM / IEC 61968)</md:Model.description>
  </md:Model>

${CIM_SUBSTATIONS.map((sub) => `  <cim:Substation rdf:ID="${sub.id}">
    <cim:IdentifiedObject.name>${sub.name}</cim:IdentifiedObject.name>
    <cim:IdentifiedObject.description>${sub.gridRole_en}</cim:IdentifiedObject.description>
    <cim:Substation.Region>${sub.region}</cim:Substation.Region>
  </cim:Substation>`).join('\n\n')}

${CIM_CONNECTIVITY_NODES.map((cn) => `  <cim:ConnectivityNode rdf:ID="${cn.id}">
    <cim:IdentifiedObject.name>${cn.name}</cim:IdentifiedObject.name>
    <cim:ConnectivityNode.ConnectivityNodeContainer rdf:resource="#${cn.substationId}"/>
    <cim:ConnectivityNode.nominalVoltageKv>${cn.nominalVoltageKv}</cim:ConnectivityNode.nominalVoltageKv>
  </cim:ConnectivityNode>`).join('\n\n')}

${CIM_CONDUCTING_EQUIPMENT.map((eq) => `  <cim:${eq.cimType} rdf:ID="${eq.id}">
    <cim:IdentifiedObject.name>${eq.name}</cim:IdentifiedObject.name>
    <cim:Equipment.EquipmentContainer rdf:resource="#${eq.substationId}"/>
    <cim:ConductingEquipment.nominalVoltageKv>${eq.nominalVoltageKv}</cim:ConductingEquipment.nominalVoltageKv>
    <cim:ConductingEquipment.inService>${eq.status !== 'OUT_OF_SERVICE'}</cim:ConductingEquipment.inService>
    ${eq.ratedMva ? `<cim:PowerTransformer.ratedS>${eq.ratedMva}</cim:PowerTransformer.ratedS>` : ''}
    ${eq.ratedAmps ? `<cim:Breaker.ratedCurrent>${eq.ratedAmps}</cim:Breaker.ratedCurrent>` : ''}
    ${eq.terminals.map(t => `<cim:ConductingEquipment.Terminals rdf:resource="#${t.id}"/>`).join('\n    ')}
  </cim:${eq.cimType}>`).join('\n\n')}

${CIM_CONDUCTING_EQUIPMENT.flatMap(eq => eq.terminals).map(t => `  <cim:Terminal rdf:ID="${t.id}">
    <cim:IdentifiedObject.name>${t.name}</cim:IdentifiedObject.name>
    <cim:Terminal.sequenceNumber>${t.sequenceNumber}</cim:Terminal.sequenceNumber>
    <cim:Terminal.ConductingEquipment rdf:resource="#${t.conductingEquipmentId}"/>
    <cim:Terminal.ConnectivityNode rdf:resource="#${t.connectivityNodeId}"/>
    <cim:Terminal.connected>${t.connected}</cim:Terminal.connected>
  </cim:Terminal>`).join('\n\n')}

</rdf:RDF>`;
}

/**
 * Generate JSON-LD CIM format
 */
export function generateCimJsonLd(): string {
  return JSON.stringify(
    {
      "@context": {
        "cim": "http://iec.ch/TC57/CIM100#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "id": "@id",
        "type": "@type"
      },
      "@id": "urn:uuid:epede-network-model-cameroun",
      "type": "cim:PowerSystemModel",
      "cim:substations": CIM_SUBSTATIONS.map((s) => ({
        "id": `urn:epede:substation:${s.id}`,
        "type": "cim:Substation",
        "cim:name": s.name,
        "cim:region": s.region,
        "cim:voltageLevels": s.voltageLevels
      })),
      "cim:equipments": CIM_CONDUCTING_EQUIPMENT.map((e) => ({
        "id": `urn:epede:equipment:${e.id}`,
        "type": `cim:${e.cimType}`,
        "cim:name": e.name,
        "cim:nominalVoltageKv": e.nominalVoltageKv,
        "cim:status": e.status,
        "cim:terminals": e.terminals.map(t => ({
          "id": `urn:epede:terminal:${t.id}`,
          "connectivityNode": `urn:epede:cnode:${t.connectivityNodeId}`
        })),
        "standards": e.associatedStandards
      }))
    },
    null,
    2
  );
}
