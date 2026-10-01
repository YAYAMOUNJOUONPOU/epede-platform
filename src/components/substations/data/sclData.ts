// src/components/substations/data/sclData.ts
// Substation Configuration Language (SCL) Model according to IEC 61850-6
// SCD (Substation Configuration Description) for Batschenga/Oyomabang 225 kV Substation

export interface SclLogicalNode {
  lnClass: string;
  inst: string;
  prefix?: string;
  descFr: string;
  descEn: string;
  group: 'CONTROL' | 'PROTECTION' | 'MEASUREMENT' | 'SUPERVISION' | 'SWITCHGEAR' | 'SYSTEM';
  dataObjects: {
    name: string;
    fc: 'ST' | 'MX' | 'CO' | 'SP' | 'CF' | 'SG';
    type: string;
    value: string | number | boolean;
    unit?: string;
    desc: string;
  }[];
}

export interface SclLogicalDevice {
  inst: string;
  desc: string;
  logicalNodes: SclLogicalNode[];
}

export interface SclIed {
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  ipAddress: string;
  subnet: string;
  macAddressGoose: string;
  macAddressSv?: string;
  roleFr: string;
  roleEn: string;
  redundancyProtocol: 'PRP' | 'HSR' | 'RSTP';
  logicalDevices: SclLogicalDevice[];
}

export interface GoosePublishControlBlock {
  appID: string;
  macAddress: string;
  vlanId: number;
  vlanPriority: number;
  gocbRef: string;
  dataset: string;
  minTimeMs: number;
  maxTimeMs: number;
  descriptionFr: string;
  descriptionEn: string;
  subscribers: string[];
}

export interface SampledValuesControlBlock {
  svID: string;
  macAddress: string;
  vlanId: number;
  appID: string;
  sampleRateHz: number; // 4000 or 4800 (80 samples/cycle at 60/50Hz) or 14400 (IEC 61869-9)
  samplesPerPeriod: number;
  dataset: string;
  descriptionFr: string;
  descriptionEn: string;
}

export const SUBSTATION_SCL_IEDS: SclIed[] = [
  {
    name: 'IED_L1_PROT',
    type: 'Distance & Differential Protection',
    manufacturer: 'Siemens / Schneider',
    model: 'SIPROTEC 5 - 7SL87',
    ipAddress: '192.168.10.11',
    subnet: 'Station_Bus_VLAN10',
    macAddressGoose: '01-0C-CD-01-00-11',
    macAddressSv: '01-0C-CD-04-00-11',
    roleFr: 'Protection principale Ligne 225 kV L1 (Différentielle ANSI 87L & Distance ANSI 21)',
    roleEn: '225 kV Line L1 Main Protection (Line Differential ANSI 87L & Distance ANSI 21)',
    redundancyProtocol: 'PRP',
    logicalDevices: [
      {
        inst: 'PROT',
        desc: 'Protection Logical Device',
        logicalNodes: [
          {
            lnClass: 'PDIF',
            inst: '1',
            descFr: 'Protection différentielle de ligne 87L',
            descEn: 'Line differential protection 87L',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Op', fc: 'ST', type: 'ACT', value: false, desc: 'Trip operate status' },
              { name: 'DifAClc', fc: 'MX', type: 'WYE', value: 0.12, unit: 'A/In', desc: 'Calculated differential current' },
              { name: 'RstAClc', fc: 'MX', type: 'WYE', value: 0.94, unit: 'A/In', desc: 'Calculated restraint current' }
            ]
          },
          {
            lnClass: 'PDIS',
            inst: '1',
            descFr: 'Protection de distance ANSI 21 (Zones Z1, Z2, Z3, Z4)',
            descEn: 'Distance protection ANSI 21 (Z1, Z2, Z3, Z4 zones)',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Op', fc: 'ST', type: 'ACT', value: false, desc: 'Distance trip output' },
              { name: 'OpZ1', fc: 'ST', type: 'ACD', value: false, desc: 'Zone 1 Instantaneous Trip (85%)' },
              { name: 'OpZ2', fc: 'ST', type: 'ACD', value: false, desc: 'Zone 2 Delayed Trip (120%, 300ms)' },
              { name: 'FltZ', fc: 'MX', type: 'CMV', value: '42.5 + j12.8', unit: 'Ohm', desc: 'Measured fault loop impedance' }
            ]
          },
          {
            lnClass: 'PTOC',
            inst: '1',
            descFr: 'Protection maximum de courant à temps inverse ANSI 51',
            descEn: 'Time overcurrent protection ANSI 51',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Str', fc: 'ST', type: 'ACD', value: false, desc: 'Overcurrent pick-up start' },
              { name: 'Op', fc: 'ST', type: 'ACT', value: false, desc: 'Overcurrent trip operate' }
            ]
          },
          {
            lnClass: 'PTRC',
            inst: '1',
            descFr: 'Conditionneur de déclenchement général (Master Trip Matrix)',
            descEn: 'Protection trip conditioning (Master Trip Matrix)',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Tr', fc: 'ST', type: 'ACT', value: false, desc: 'General Trip Output to Breaker' },
              { name: 'OpCntRs', fc: 'ST', type: 'INC', value: 14, desc: 'Cumulative trip operations count' }
            ]
          }
        ]
      },
      {
        inst: 'CTRL',
        desc: 'Control & Interlocking Logical Device',
        logicalNodes: [
          {
            lnClass: 'CSWI',
            inst: '1',
            prefix: 'Q0',
            descFr: 'Contrôleur de commande disjoncteur Q0',
            descEn: 'Breaker Q0 switch controller',
            group: 'CONTROL',
            dataObjects: [
              { name: 'Pos', fc: 'ST', type: 'DPC', value: 'CLOSED', desc: 'Position status (Open/Closed)' },
              { name: 'OpCnt', fc: 'ST', type: 'INS', value: 342, desc: 'Breaker operation count' }
            ]
          },
          {
            lnClass: 'CILO',
            inst: '1',
            descFr: 'Verrouillage logique d\'interverrouillage travée (IEC 62271-102)',
            descEn: 'Bay interlocking logic (IEC 62271-102)',
            group: 'CONTROL',
            dataObjects: [
              { name: 'EnaOpn', fc: 'ST', type: 'SPS', value: true, desc: 'Permissive to open apparatus' },
              { name: 'EnaCls', fc: 'ST', type: 'SPS', value: true, desc: 'Permissive to close apparatus' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'MU_L1_PROCESS',
    type: 'Merging Unit (IEC 61869-9 / 61850-9-2LE)',
    manufacturer: 'ABB / Hitachi Energy',
    model: 'SAM600-CT/VT',
    ipAddress: '192.168.20.101',
    subnet: 'Process_Bus_VLAN20',
    macAddressGoose: '01-0C-CD-01-00-51',
    macAddressSv: '01-0C-CD-04-00-01',
    roleFr: 'Unité de raccordement de process (Merging Unit) : Échantillonnage Rogowski/TC/TT 4800 Hz & Commande directe Q0',
    roleEn: 'Process Merging Unit: Optical CT/VT 4800 Hz Sampled Values & Direct Q0 Breaker I/O',
    redundancyProtocol: 'PRP',
    logicalDevices: [
      {
        inst: 'MU01',
        desc: 'Process Interface & Merging Unit Node',
        logicalNodes: [
          {
            lnClass: 'TCTR',
            inst: '1',
            descFr: 'Transformateur de courant optique/numérique (Phase A, B, C)',
            descEn: 'Current transformer digital interface (Phase A, B, C)',
            group: 'MEASUREMENT',
            dataObjects: [
              { name: 'Amp', fc: 'MX', type: 'SAV', value: 852.4, unit: 'A', desc: 'Instantaneous sampled current' }
            ]
          },
          {
            lnClass: 'TVTR',
            inst: '1',
            descFr: 'Transformateur de tension numérique (Phase A, B, C)',
            descEn: 'Voltage transformer digital interface (Phase A, B, C)',
            group: 'MEASUREMENT',
            dataObjects: [
              { name: 'Vol', fc: 'MX', type: 'SAV', value: 130240, unit: 'V_peak', desc: 'Instantaneous sampled voltage' }
            ]
          },
          {
            lnClass: 'XCBR',
            inst: '1',
            descFr: 'Disjoncteur physique Q0 245 kV 40 kA (Contacteurs & Pression SF6)',
            descEn: 'Physical 245 kV 40 kA circuit breaker Q0 (Aux contacts & SF6 pressure)',
            group: 'SWITCHGEAR',
            dataObjects: [
              { name: 'Pos', fc: 'ST', type: 'DPC', value: 'CLOSED', desc: 'Real contact status' },
              { name: 'BlkOpn', fc: 'ST', type: 'SPS', value: false, desc: 'Trip circuit supervision block' },
              { name: 'BlkCls', fc: 'ST', type: 'SPS', value: false, desc: 'Closing block (SF6 low)' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'IED_TR1_DIFF',
    type: 'Transformer Differential & Thermal Protection',
    manufacturer: 'General Electric / Alstom',
    model: 'MiCOM P643',
    ipAddress: '192.168.10.21',
    subnet: 'Station_Bus_VLAN10',
    macAddressGoose: '01-0C-CD-01-00-21',
    roleFr: 'Protection différentielle Transformateur 225/90/15 kV 100 MVA (ANSI 87T, 49, 24)',
    roleEn: 'Transformer Differential Protection 225/90/15 kV 100 MVA (ANSI 87T, 49, 24)',
    redundancyProtocol: 'PRP',
    logicalDevices: [
      {
        inst: 'TR_PROT',
        desc: 'Transformer Protection Device',
        logicalNodes: [
          {
            lnClass: 'PDIF',
            inst: '1',
            descFr: 'Protection différentielle transformateur 87T avec retenue d\'harmonique 2 (enclenchement) et 5 (surfluxage)',
            descEn: 'Transformer differential 87T with 2nd harmonic (inrush) and 5th harmonic (overfluxing) restraint',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Op', fc: 'ST', type: 'ACT', value: false, desc: 'Differential trip state' },
              { name: 'RstH2', fc: 'ST', type: 'SPS', value: false, desc: '2nd harmonic inrush restraint status' },
              { name: 'RstH5', fc: 'ST', type: 'SPS', value: false, desc: '5th harmonic overfluxing restraint' }
            ]
          },
          {
            lnClass: 'PTTR',
            inst: '1',
            descFr: 'Image thermique et surveillance de point chaud CEI 60076-7',
            descEn: 'Thermal replica & hot-spot monitoring IEC 60076-7',
            group: 'PROTECTION',
            dataObjects: [
              { name: 'Tmp', fc: 'MX', type: 'MV', value: 68.4, unit: '°C', desc: 'Calculated hot-spot temperature' },
              { name: 'AlmThm', fc: 'ST', type: 'SPS', value: false, desc: 'Thermal overload pre-alarm (95°C)' }
            ]
          },
          {
            lnClass: 'MMXU',
            inst: '1',
            descFr: 'Centrale de mesure puissance P, Q, S, cos phi, tension et courant',
            descEn: 'Power measurement unit P, Q, S, cos phi, voltage and current',
            group: 'MEASUREMENT',
            dataObjects: [
              { name: 'TotW', fc: 'MX', type: 'MV', value: 78.4, unit: 'MW', desc: 'Active power' },
              { name: 'TotVAr', fc: 'MX', type: 'MV', value: 19.2, unit: 'Mvar', desc: 'Reactive power' },
              { name: 'TotPF', fc: 'MX', type: 'MV', value: 0.97, unit: '', desc: 'Power factor' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'BCU_BUS_COUPLER',
    type: 'Bay Control Unit (BCU) & Synchrocheck',
    manufacturer: 'Schneider Electric',
    model: 'Easergy P5 / C264',
    ipAddress: '192.168.10.31',
    subnet: 'Station_Bus_VLAN10',
    macAddressGoose: '01-0C-CD-01-00-31',
    roleFr: 'Calculateur de travée et contrôle de synchronisme ANSI 25 pour le disjoncteur de couplage barres 225 kV',
    roleEn: 'Bay control unit and ANSI 25 synchrocheck for 225 kV bus coupler circuit breaker',
    redundancyProtocol: 'HSR',
    logicalDevices: [
      {
        inst: 'SYNC_CTRL',
        desc: 'Synchrocheck & Bus Coupler Control',
        logicalNodes: [
          {
            lnClass: 'RSYN',
            inst: '1',
            descFr: 'Vérificateur de synchronisme ANSI 25 (Delta V, Delta Freq, Delta Angle)',
            descEn: 'Synchrocheck relay ANSI 25 (Delta V, Delta Freq, Delta Angle)',
            group: 'SUPERVISION',
            dataObjects: [
              { name: 'Rel', fc: 'ST', type: 'SPS', value: true, desc: 'Synchrocheck permissive release' },
              { name: 'DifV', fc: 'MX', type: 'MV', value: 1.2, unit: 'kV', desc: 'Voltage difference' },
              { name: 'DifHz', fc: 'MX', type: 'MV', value: 0.02, unit: 'Hz', desc: 'Frequency slip difference' },
              { name: 'DifAng', fc: 'MX', type: 'MV', value: 4.8, unit: 'deg', desc: 'Phase angle difference' }
            ]
          },
          {
            lnClass: 'CSWI',
            inst: '1',
            prefix: 'Q0_CPL',
            descFr: 'Commande du disjoncteur de couplage',
            descEn: 'Bus coupler circuit breaker control',
            group: 'CONTROL',
            dataObjects: [
              { name: 'Pos', fc: 'ST', type: 'DPC', value: 'CLOSED', desc: 'Breaker position' }
            ]
          }
        ]
      }
    ]
  }
];

export const SUBSTATION_GOOSE_CONTROL_BLOCKS: GoosePublishControlBlock[] = [
  {
    appID: '0x0001',
    macAddress: '01-0C-CD-01-00-01',
    vlanId: 10,
    vlanPriority: 7, // Highest priority for protection trips
    gocbRef: 'IED_L1_PROT/PROT/LLN0$GO$gcbTrip',
    dataset: 'dsTripOutput',
    minTimeMs: 2, // Retransmission burst starts at 2ms
    maxTimeMs: 1000, // Heartbeat heartbeat every 1000ms in steady-state
    descriptionFr: 'Déclenchement d\'urgence 87L/21 vers disjoncteur Q0 et télé-action distante',
    descriptionEn: 'Emergency trip 87L/21 to breaker Q0 and remote intertripping',
    subscribers: ['MU_L1_PROCESS', 'IED_TR1_DIFF', 'BCU_BUS_COUPLER', 'SUB_GATEWAY_RTU']
  },
  {
    appID: '0x0002',
    macAddress: '01-0C-CD-01-00-02',
    vlanId: 10,
    vlanPriority: 6,
    gocbRef: 'BCU_BUS_COUPLER/SYNC_CTRL/LLN0$GO$gcbInterlock',
    dataset: 'dsInterlockBus',
    minTimeMs: 4,
    maxTimeMs: 2000,
    descriptionFr: 'Matrice d\'interverrouillage logique de barres (Sélection Q1/Q2 autorisée si couplage actif)',
    descriptionEn: 'Busbar interlocking matrix (Q1/Q2 bus selection allowed if coupler closed)',
    subscribers: ['IED_L1_PROT', 'SUB_GATEWAY_RTU']
  },
  {
    appID: '0x0003',
    macAddress: '01-0C-CD-01-00-03',
    vlanId: 10,
    vlanPriority: 6,
    gocbRef: 'IED_TR1_DIFF/TR_PROT/LLN0$GO$gcbRestraint',
    dataset: 'dsHarmonicBlock',
    minTimeMs: 5,
    maxTimeMs: 2000,
    descriptionFr: 'Blocage harmonique 2ème rang (Courant d\'appel enclenchement transfo)',
    descriptionEn: '2nd harmonic restraint signal (Transformer inrush detection)',
    subscribers: ['IED_L1_PROT', 'SUB_GATEWAY_RTU']
  },
  {
    appID: '0x0004',
    macAddress: '01-0C-CD-01-00-04',
    vlanId: 10,
    vlanPriority: 7,
    gocbRef: 'MU_L1_PROCESS/MU01/LLN0$GO$gcbBreakerStatus',
    dataset: 'dsBreakerPos',
    minTimeMs: 2,
    maxTimeMs: 1000,
    descriptionFr: 'Position réelle des contacts auxiliaires disjoncteur Q0 & alarmes SF6',
    descriptionEn: 'Real auxiliary contacts of breaker Q0 and SF6 gas density alarm',
    subscribers: ['IED_L1_PROT', 'BCU_BUS_COUPLER', 'SUB_GATEWAY_RTU']
  }
];

export const SUBSTATION_SAV_CONTROL_BLOCKS: SampledValuesControlBlock[] = [
  {
    svID: 'MU_L1_SV_STREAM_01',
    macAddress: '01-0C-CD-04-00-01',
    vlanId: 20,
    appID: '0x4000',
    sampleRateHz: 4800, // 80 samples per cycle at 60 Hz or 96 at 50 Hz (IEC 61850-9-2LE standard)
    samplesPerPeriod: 96,
    dataset: 'dsCurrentVoltage92LE',
    descriptionFr: 'Flux SV 9-2LE 3x I + In, 3x U + Un synchronisé par PTP IEEE 1588v2',
    descriptionEn: 'SV 9-2LE stream 3x I + In, 3x U + Un synchronized via IEEE 1588v2 PTP'
  }
];
