// src/components/grid-architecture/data/substationBayData.ts
// EPEDE - Substation Bay Architecture, Apparatus, and Safety Interlocking

import { SubstationBay, SubstationSwitchingElement } from '../types';

export const SUBSTATION_ELEMENTS_INIT: SubstationSwitchingElement[] = [
  // LINE BAY 225 kV
  {
    id: 'elem-discon-line-bus1',
    bayId: 'line_bay',
    tag: 'Q1-BUS1',
    type: 'disconnector',
    name: { fr: 'Sectionneur d\'aiguillage Jeu de Barres 1', en: 'Busbar 1 Selector Disconnector' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: ['elem-cb-line'],
    interlockRuleFr: 'Interdiction formelle de manœuvrer le sectionneur si le disjoncteur de ligne est fermé (danger d\'arc explosif de coupure en charge).',
    interlockRuleEn: 'Strictly interlocked: Cannot operate disconnector while line circuit breaker is closed (arc-flash explosion hazard).',
    ratedVoltage: '245 kV',
    ratedCurrent: '2500 A',
    secondaryLink: {
      protectionRelay: 'IED BCU REC670 / SEL-451',
      scadaPoint: 'DI_Q1_BUS1_STATE (Ouvert/Fermé)',
      dcSupply: '110 V DC Circuit 1'
    }
  },
  {
    id: 'elem-discon-line-bus2',
    bayId: 'line_bay',
    tag: 'Q2-BUS2',
    type: 'disconnector',
    name: { fr: 'Sectionneur d\'aiguillage Jeu de Barres 2', en: 'Busbar 2 Selector Disconnector' },
    isOpen: true,
    isEarthed: false,
    isEnergized: false,
    interlockDependencies: ['elem-cb-line'],
    interlockRuleFr: 'Le disjoncteur de ligne doit être ouvert pour modifier l\'aiguillage sur le jeu de barres 2.',
    interlockRuleEn: 'Line circuit breaker must be open before switching onto Busbar 2.',
    ratedVoltage: '245 kV',
    ratedCurrent: '2500 A',
    secondaryLink: {
      protectionRelay: 'IED BCU REC670 / SEL-451',
      scadaPoint: 'DI_Q2_BUS2_STATE (Ouvert/Fermé)',
      dcSupply: '110 V DC Circuit 1'
    }
  },
  {
    id: 'elem-cb-line',
    bayId: 'line_bay',
    tag: 'Q0-LINE',
    type: 'breaker',
    name: { fr: 'Disjoncteur de Ligne 225 kV', en: '225 kV Line Circuit Breaker' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: ['elem-earth-line', 'elem-earth-bus'],
    interlockRuleFr: 'Le disjoncteur ne peut être fermé que si aucun sectionneur de terre associé n\'est fermé et si les sectionneurs amont/aval sont en position finale.',
    interlockRuleEn: 'Circuit breaker can only close if all associated earthing switches are open and disconnectors are in a definite state.',
    ratedVoltage: '245 kV',
    ratedCurrent: '2500 A',
    breakingCapacity: '40 kA (symétrique initial)',
    secondaryLink: {
      protectionRelay: 'Relais Différentiel Ligne RED670 / SEL-411L + Distance 21',
      scadaPoint: 'DI_Q0_CB_LINE (Déclenché / Enclenché)',
      dcSupply: '110 V DC Double Bobine (Trip Coil 1 & 2)'
    }
  },
  {
    id: 'elem-discon-line-out',
    bayId: 'line_bay',
    tag: 'Q9-LINE',
    type: 'disconnector',
    name: { fr: 'Sectionneur de Ligne (Tête de Ligne)', en: 'Line Outgoing Disconnector' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: ['elem-cb-line'],
    interlockRuleFr: 'Ne peut être ouvert ou fermé qu\'après ouverture préalable du disjoncteur de ligne.',
    interlockRuleEn: 'Can only be operated after the line circuit breaker has been confirmed fully open.',
    ratedVoltage: '245 kV',
    ratedCurrent: '2500 A',
    secondaryLink: {
      protectionRelay: 'IED BCU REC670',
      scadaPoint: 'DI_Q9_LINE_STATE',
      dcSupply: '110 V DC Circuit 1'
    }
  },
  {
    id: 'elem-earth-line',
    bayId: 'line_bay',
    tag: 'Q51-EARTH',
    type: 'earth_switch',
    name: { fr: 'Sectionneur de Terre de Ligne (MALT)', en: 'Line Earthing Switch' },
    isOpen: true,
    isEarthed: false,
    isEnergized: false,
    interlockDependencies: ['elem-discon-line-out', 'elem-cb-line'],
    interlockRuleFr: 'VERROUILLAGE CRITIQUE : Interdiction absolue de fermer la terre si la ligne est sous tension ou si le sectionneur de ligne est fermé ! Risque mortel de court-circuit direct à la terre.',
    interlockRuleEn: 'SAFETY INTERLOCK: Strictly blocked from closing onto an energized line or when line disconnector is closed. Lethal short-circuit hazard.',
    ratedVoltage: '245 kV',
    ratedCurrent: '40 kA (1s court-circuit admissible)',
    secondaryLink: {
      protectionRelay: 'Détecteur d\'absence de tension de ligne (Voltage Presence Relay)',
      scadaPoint: 'DI_Q51_EARTH_LINE',
      dcSupply: '110 V DC Sécurité Mécanique & Électrique'
    }
  },

  // POWER TRANSFORMER BAY 225/30 kV
  {
    id: 'elem-discon-trafo-bus1',
    bayId: 'trafo_bay',
    tag: 'Q1-TR1',
    type: 'disconnector',
    name: { fr: 'Sectionneur Transfo Jeu de Barres 1', en: 'Transformer Bay Busbar 1 Disconnector' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: ['elem-cb-trafo'],
    interlockRuleFr: 'Le disjoncteur transformateur doit être ouvert avant toute manœuvre d\'aiguillage.',
    interlockRuleEn: 'Transformer circuit breaker must be open before operating busbar disconnector.',
    ratedVoltage: '245 kV',
    ratedCurrent: '1250 A',
    secondaryLink: {
      protectionRelay: 'IED BCU REC670',
      scadaPoint: 'DI_Q1_TR1_STATE',
      dcSupply: '110 V DC Circuit 2'
    }
  },
  {
    id: 'elem-cb-trafo',
    bayId: 'trafo_bay',
    tag: 'Q0-TR1',
    type: 'breaker',
    name: { fr: 'Disjoncteur HTB Transformateur TR1', en: '225 kV Transformer Circuit Breaker' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: ['elem-earth-trafo'],
    interlockRuleFr: 'Verrouillé à l\'enclenchement si la terre transformateur ou la terre cuve est fermée.',
    interlockRuleEn: 'Interlocked against closing if transformer earthing switch is applied.',
    ratedVoltage: '245 kV',
    ratedCurrent: '1250 A',
    breakingCapacity: '40 kA',
    secondaryLink: {
      protectionRelay: 'Relais Différentiel Transformateur RET670 (87T) + Buchholz (63)',
      scadaPoint: 'DI_Q0_CB_TR1',
      dcSupply: '110 V DC Double Bobine'
    }
  },
  {
    id: 'elem-trafo-main',
    bayId: 'trafo_bay',
    tag: 'TR1-225/30kV',
    type: 'transformer',
    name: { fr: 'Transformateur de Puissance 63 MVA 225/30 kV', en: '63 MVA 225/30 kV Power Transformer' },
    isOpen: false,
    isEarthed: false,
    isEnergized: true,
    interlockDependencies: [],
    interlockRuleFr: 'Appareil passif de puissance. Surveillé thermiquement et diélectriquement en continu.',
    interlockRuleEn: 'Passive power apparatus. Continuously monitored for thermal and dissolved gas anomalies.',
    ratedVoltage: '225 kV / 30 kV',
    ratedCurrent: '162 A (HT) / 1212 A (MT)',
    secondaryLink: {
      protectionRelay: 'Relais RET670 (87T, 49, 50/51) + Automate Régleur de Prises (TAPCON)',
      scadaPoint: 'AI_TR1_TEMP_OIL, AI_TR1_TAP_POS',
      dcSupply: '110 V DC Système & 400 V Moteur Régleur'
    }
  },
  {
    id: 'elem-earth-trafo',
    bayId: 'trafo_bay',
    tag: 'Q51-TR1',
    type: 'earth_switch',
    name: { fr: 'Sectionneur de Terre HTB Transformateur', en: 'Transformer HV Earthing Switch' },
    isOpen: true,
    isEarthed: false,
    isEnergized: false,
    interlockDependencies: ['elem-cb-trafo', 'elem-discon-trafo-bus1'],
    interlockRuleFr: 'Ne peut être fermé que si le disjoncteur TR1 et les sectionneurs de barres sont complètement ouverts.',
    interlockRuleEn: 'Cannot be closed unless transformer CB and bus disconnectors are verified fully open.',
    ratedVoltage: '245 kV',
    ratedCurrent: '40 kA (1s)',
    secondaryLink: {
      protectionRelay: 'Contrôleur de travée avec clé de consignation',
      scadaPoint: 'DI_Q51_TR1_EARTH',
      dcSupply: '110 V DC'
    }
  }
];

export const SUBSTATION_BAYS_CONFIG: SubstationBay[] = [
  {
    id: 'line_bay_01',
    name: { fr: 'Travée d\'Arrivée Ligne 225 kV (Songloulou)', en: '225 kV Incoming Line Bay (Songloulou)' },
    type: 'incoming_line',
    elements: SUBSTATION_ELEMENTS_INIT.filter(e => e.bayId === 'line_bay'),
    description: {
      fr: 'Travée d\'interconnexion haute tension raccordant la ligne aérienne 225 kV au double jeu de barres du poste.',
      en: 'High-voltage bay interconnecting incoming 225 kV overhead line to the double busbars.'
    }
  },
  {
    id: 'trafo_bay_01',
    name: { fr: 'Travée Transformateur TR1 225/30 kV (63 MVA)', en: '225/30 kV Transformer Bay TR1 (63 MVA)' },
    type: 'power_transformer',
    elements: SUBSTATION_ELEMENTS_INIT.filter(e => e.bayId === 'trafo_bay'),
    description: {
      fr: 'Travée abaisseuse injectant l\'énergie vers le tableau moyenne tension 30 kV urbain.',
      en: 'Step-down bay feeding 30 kV medium-voltage busbar distributing to municipal feeders.'
    }
  }
];

export const SUBSTATION_AUXILIARY_SYSTEMS = {
  acSystem: {
    source: 'Transformateur des Services Auxiliaires (TSA) 30 kV / 400 V - 250 kVA',
    backupGenerator: 'Groupe Électrogène Diesel de Secours 160 kVA avec Inverseur Normal/Secours (ATS)',
    voltage: '400 V triphasé / 230 V monophasé, 50 Hz',
    criticalLoads: [
      'Pompes et ventilateurs de refroidissement des transformateurs (ONAF)',
      'Moteurs d\'armement des ressorts de disjoncteurs et régleurs en charge (OLTC)',
      'Éclairage de sécurité du poste et climatisation de la salle de commande',
      'Redresseurs chargeurs de batteries 110 V DC et 48 V DC'
    ]
  },
  dcSystem: {
    voltage: '110 V DC (Protection & Commande) & 48 V DC (Télécoms & SCADA)',
    batteries: 'Banc d\'accumulateurs Ni-Cd étanches ou Plomb étanche tubulaire (220 Ah, autonomie 10 heures)',
    chargers: 'Double redresseurs chargeurs redondants thyristors/IGBT à basculement automatique',
    mission: 'Alimentation vitale des bobines de déclenchement des disjoncteurs (Trip Coils 1 & 2), des relais de protection numériques (IED) et des automates de tranche.'
  },
  automationSystem: {
    standard: 'CEI 61850 Édition 2',
    stationBus: 'Réseau Ethernet optique redondant 100 Mbps en anneau PRP (Parallel Redundancy Protocol)',
    protocols: 'MMS pour dialogue avec le superviseur SCADA local et le Dispatching, GOOSE pour les verrouillages inter-travées (< 4 ms)'
  }
};
