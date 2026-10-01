// src/services/iec61850SclService.ts
// IEC 61850-6 Substation Configuration Language (SCL) Generator & GOOSE Engineering Service
// Supports SCL formats: SCD (Substation Configuration Description), CID (Configured IED Description), and ICD (IED Capability Description)

export interface LogicalNodeSetting {
  lnClass: string;
  inst: string;
  descFr: string;
  descEn: string;
  dataObjects: {
    name: string;
    desc: string;
    val: string | number | boolean;
    unit?: string;
  }[];
}

export interface IedConfig {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  bayName: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  logicalNodes: LogicalNodeSetting[];
  publishedGoose: GooseStream[];
  subscribedGooseIds: string[];
}

export interface GooseStream {
  id: string;
  gseControlName: string;
  appId: string;
  macAddress: string;
  vlanId: number;
  vlanPriority: number;
  minTimeMs: number;
  maxTimeMs: number;
  dataSetName: string;
  entries: {
    lnClass: string;
    lnInst: string;
    doName: string;
    daName: string;
    desc: string;
  }[];
}

export interface Iec61850SubstationConfig {
  substationName: string;
  voltageLevelKv: number;
  ieds: IedConfig[];
}

export const DEFAULT_IEC61850_CONFIG: Iec61850SubstationConfig = {
  substationName: 'Mangoumbe_225kV_Substation',
  voltageLevelKv: 225,
  ieds: [
    {
      id: 'IED_L01_MANGOUMBE',
      name: 'MANGOUMBE_P546_L01',
      type: 'MiCOM P546 (Firmware v64.C)',
      manufacturer: 'Schneider Electric',
      bayName: 'Travée Ligne L01 (Mangoumbé - Oyomabang)',
      ipAddress: '192.168.10.11',
      subnetMask: '255.255.255.0',
      gateway: '192.168.10.1',
      logicalNodes: [
        {
          lnClass: 'PDIS',
          inst: '1',
          descFr: 'Protection de Distance ANSI 21 (Zones Z1, Z2, Z3)',
          descEn: 'Distance Protection ANSI 21 (Zones Z1, Z2, Z3)',
          dataObjects: [
            { name: 'Z1Reach', desc: 'Portée Zone 1', val: 8.50, unit: 'Ω' },
            { name: 'Z1OpTmms', desc: 'Temporisation Zone 1', val: 0, unit: 'ms' },
            { name: 'Z2Reach', desc: 'Portée Zone 2', val: 14.50, unit: 'Ω' },
            { name: 'Z2OpTmms', desc: 'Temporisation Zone 2', val: 350, unit: 'ms' },
            { name: 'PhsDir', desc: 'Orientation directionnelle', val: 'Forward' },
            { name: 'R1Arc', desc: 'Couverture résistance d\'arc', val: 12.0, unit: 'Ω' },
          ],
        },
        {
          lnClass: 'PDIF',
          inst: '1',
          descFr: 'Différentielle de Ligne ANSI 87L (Téléprotection optique)',
          descEn: 'Line Differential ANSI 87L (Optical teleprotection)',
          dataObjects: [
            { name: 'Is1', desc: 'Seuil de base (Pick-up)', val: 0.20, unit: 'In (120A)' },
            { name: 'k1', desc: 'Pente 1 de retenue', val: 0.30, unit: '30%' },
            { name: 'Is2', desc: 'Courant de coude', val: 1.50, unit: 'In (900A)' },
            { name: 'k2', desc: 'Pente 2 de stabilisation forte', val: 0.70, unit: '70%' },
            { name: 'CapChgComp', desc: 'Compensation courant capacitif Ic', val: true },
          ],
        },
        {
          lnClass: 'PTOC',
          inst: '1',
          descFr: 'Maximum de Courant Temporisé Phase & Terre (ANSI 51/51N)',
          descEn: 'Time Overcurrent Protection (ANSI 51/51N)',
          dataObjects: [
            { name: 'StrVal', desc: 'Courant de démarrage I>', val: 1.20, unit: 'In (720A)' },
            { name: 'TmMult', desc: 'Multiplicateur de temps (TMS)', val: 0.15 },
            { name: 'CrvTyp', desc: 'Caractéristique de courbe', val: 'IEC_Extremely_Inverse' },
          ],
        },
        {
          lnClass: 'PTRC',
          inst: '1',
          descFr: 'Conditionnement du Déclenchement & Verrouillage 86',
          descEn: 'Protection Trip Conditioning & Lockout 86',
          dataObjects: [
            { name: 'TrMod', desc: 'Mode de déclenchement', val: '1-pole / 3-pole' },
            { name: 'OpDlTmms', desc: 'Durée d\'impulsion bobine', val: 150, unit: 'ms' },
          ],
        },
        {
          lnClass: 'RREC',
          inst: '1',
          descFr: 'Réenclencheur Automatique ANSI 79',
          descEn: 'Automatic Recloser ANSI 79',
          dataObjects: [
            { name: 'AutoRecEn', desc: 'Automatisme actif', val: true },
            { name: 'Rec1Tmms', desc: 'Temps mort cycle 1 (monophasé)', val: 1000, unit: 'ms' },
            { name: 'ReclaimTmms', desc: 'Temps de verrouillage (Reclaim)', val: 25000, unit: 'ms' },
          ],
        },
        {
          lnClass: 'XCBR',
          inst: '1',
          descFr: 'Disjoncteur de Ligne 225 kV (Organe 52)',
          descEn: '225 kV Line Circuit Breaker (52)',
          dataObjects: [
            { name: 'Pos', desc: 'État contacts auxiliaires 52a/52b', val: 'Closed' },
            { name: 'BlkOpn', desc: 'Verrouillage ouverture baisse SF6', val: false },
          ],
        },
        {
          lnClass: 'MMXU',
          inst: '1',
          descFr: 'Mesures Électriques RMS & Puissances de Tranche',
          descEn: 'RMS Electrical & Power Measurements',
          dataObjects: [
            { name: 'TotW', desc: 'Puissance active instantanée', val: 142.5, unit: 'MW' },
            { name: 'TotVAr', desc: 'Puissance réactive instantanée', val: 28.2, unit: 'MVAr' },
            { name: 'Hz', desc: 'Fréquence réseau', val: 50.02, unit: 'Hz' },
          ],
        },
      ],
      publishedGoose: [
        {
          id: 'GOOSE_PUB_L01_TRIP',
          gseControlName: 'gcb_L01_TripIntertrip',
          appId: '0x0001',
          macAddress: '01-0C-CD-01-00-01',
          vlanId: 4,
          vlanPriority: 4,
          minTimeMs: 2,
          maxTimeMs: 1000,
          dataSetName: 'ds_L01_TripStatus',
          entries: [
            { lnClass: 'PTRC', lnInst: '1', doName: 'Tr', daName: 'general', desc: 'Ordre de Déclenchement Général (Trip)' },
            { lnClass: 'PDIF', lnInst: '1', doName: 'Op', daName: 'general', desc: 'Déclenchement Différentielle Ligne 87L' },
            { lnClass: 'PDIS', lnInst: '1', doName: 'Op', daName: 'general', desc: 'Déclenchement Distance Zone 1 (21)' },
            { lnClass: 'XCBR', lnInst: '1', doName: 'Pos', daName: 'stVal', desc: 'Position Disjoncteur 52a' },
          ],
        },
      ],
      subscribedGooseIds: ['GOOSE_PUB_L01_REMOTE_TRIP', 'GOOSE_PUB_COUPLER_INTERLOCK'],
    },
    {
      id: 'IED_L01_OYOMABANG',
      name: 'OYOMABANG_7SD87_L01',
      type: 'SIPROTEC 5 7SD87 (V9.20)',
      manufacturer: 'Siemens Energy',
      bayName: 'Travée Ligne L01 Distante (Poste Oyomabang)',
      ipAddress: '192.168.10.12',
      subnetMask: '255.255.255.0',
      gateway: '192.168.10.1',
      logicalNodes: [
        {
          lnClass: 'PDIF',
          inst: '1',
          descFr: 'Protection Différentielle de Ligne Distante ANSI 87L',
          descEn: 'Remote Line Differential ANSI 87L',
          dataObjects: [
            { name: 'Is1', desc: 'Pickup Threshold', val: 0.20, unit: 'In' },
            { name: 'k1', desc: 'Slope 1', val: 0.30, unit: '30%' },
            { name: 'Is2', desc: 'Knee Point', val: 1.50, unit: 'In' },
            { name: 'k2', desc: 'Slope 2', val: 0.70, unit: '70%' },
          ],
        },
        {
          lnClass: 'PDIS',
          inst: '1',
          descFr: 'Secours de Distance ANSI 21 Distant',
          descEn: 'Remote Distance Backup ANSI 21',
          dataObjects: [
            { name: 'Z1Reach', desc: 'Portée Zone 1', val: 8.50, unit: 'Ω' },
            { name: 'Z2Reach', desc: 'Portée Zone 2', val: 14.50, unit: 'Ω' },
          ],
        },
        {
          lnClass: 'XCBR',
          inst: '1',
          descFr: 'Disjoncteur Distant 52',
          descEn: 'Remote Circuit Breaker 52',
          dataObjects: [
            { name: 'Pos', desc: 'Position 52a/52b', val: 'Closed' },
          ],
        },
      ],
      publishedGoose: [
        {
          id: 'GOOSE_PUB_L01_REMOTE_TRIP',
          gseControlName: 'gcb_Oyomabang_Intertrip',
          appId: '0x0002',
          macAddress: '01-0C-CD-01-00-02',
          vlanId: 4,
          vlanPriority: 4,
          minTimeMs: 2,
          maxTimeMs: 1000,
          dataSetName: 'ds_Oyomabang_TripStatus',
          entries: [
            { lnClass: 'PTRC', lnInst: '1', doName: 'Tr', daName: 'general', desc: 'Télé-déclenchement émis par Oyomabang' },
            { lnClass: 'PDIF', lnInst: '1', doName: 'Op', daName: 'general', desc: 'Déclenchement 87L distant' },
          ],
        },
      ],
      subscribedGooseIds: ['GOOSE_PUB_L01_TRIP'],
    },
    {
      id: 'IED_TR01_TRANSFO',
      name: 'MANGOUMBE_RED670_TR01',
      type: 'Relion RET670 (v2.2)',
      manufacturer: 'Hitachi Energy / ABB',
      bayName: 'Travée Transformateur T01 (225/90 kV 120 MVA)',
      ipAddress: '192.168.10.21',
      subnetMask: '255.255.255.0',
      gateway: '192.168.10.1',
      logicalNodes: [
        {
          lnClass: 'PDIF',
          inst: '1',
          descFr: 'Protection Différentielle Transformateur ANSI 87T avec retenue H2',
          descEn: 'Transformer Differential ANSI 87T with H2 Inrush Restraint',
          dataObjects: [
            { name: 'IdMin', desc: 'Seuil différentiel de base', val: 0.25, unit: 'In' },
            { name: 'H2Restr', desc: 'Taux de blocage harmonique 2 (Enclenchement)', val: 15.0, unit: '%' },
            { name: 'H5Restr', desc: 'Taux de blocage harmonique 5 (Surfluxage)', val: 35.0, unit: '%' },
          ],
        },
        {
          lnClass: 'PTOC',
          inst: '1',
          descFr: 'Secours Maximum de Courant Côté HT 225 kV',
          descEn: 'HV 225 kV Overcurrent Backup',
          dataObjects: [
            { name: 'StrVal', desc: 'Seuil I>', val: 1.30, unit: 'In' },
            { name: 'TmMult', desc: 'TMS', val: 0.20 },
          ],
        },
        {
          lnClass: 'XCBR',
          inst: '1',
          descFr: 'Disjoncteur HT Transfo',
          descEn: 'Transformer HV Circuit Breaker',
          dataObjects: [
            { name: 'Pos', desc: 'Position Disjoncteur', val: 'Closed' },
          ],
        },
      ],
      publishedGoose: [
        {
          id: 'GOOSE_PUB_TR01_TRIP',
          gseControlName: 'gcb_TR01_Trip',
          appId: '0x0003',
          macAddress: '01-0C-CD-01-00-03',
          vlanId: 4,
          vlanPriority: 4,
          minTimeMs: 2,
          maxTimeMs: 1000,
          dataSetName: 'ds_TR01_Status',
          entries: [
            { lnClass: 'PTRC', lnInst: '1', doName: 'Tr', daName: 'general', desc: 'Déclenchement 87T / Buchholz Transformateur' },
          ],
        },
      ],
      subscribedGooseIds: ['GOOSE_PUB_L01_TRIP'],
    },
    {
      id: 'IED_BC01_COUPLER',
      name: 'MANGOUMBE_7SJ85_BC01',
      type: 'SIPROTEC 5 7SJ85 (V9.20)',
      manufacturer: 'Siemens Energy',
      bayName: 'Travée Disjoncteur de Couplage Barres 225 kV (BC01)',
      ipAddress: '192.168.10.31',
      subnetMask: '255.255.255.0',
      gateway: '192.168.10.1',
      logicalNodes: [
        {
          lnClass: 'CSWI',
          inst: '1',
          descFr: 'Contrôleur de Commutateur de Couplage & Verrouillages',
          descEn: 'Switching Controller & Interlocking',
          dataObjects: [
            { name: 'Pos', desc: 'Commande/État Couplage', val: 'Closed' },
          ],
        },
        {
          lnClass: 'RSYN',
          inst: '1',
          descFr: 'Contrôle de Synchronisme ANSI 25',
          descEn: 'Synchrocheck ANSI 25',
          dataObjects: [
            { name: 'VDiff', desc: 'Écart de tension admissible ΔU', val: 5.0, unit: '%' },
            { name: 'AngDiff', desc: 'Écart angulaire admissible Δφ', val: 10.0, unit: '°' },
            { name: 'FrqDiff', desc: 'Écart de fréquence admissible Δf', val: 0.10, unit: 'Hz' },
          ],
        },
        {
          lnClass: 'XCBR',
          inst: '1',
          descFr: 'Disjoncteur de Couplage 52',
          descEn: 'Coupler Circuit Breaker 52',
          dataObjects: [
            { name: 'Pos', desc: 'Position Disjoncteur', val: 'Closed' },
          ],
        },
      ],
      publishedGoose: [
        {
          id: 'GOOSE_PUB_COUPLER_INTERLOCK',
          gseControlName: 'gcb_Coupler_Interlocks',
          appId: '0x0004',
          macAddress: '01-0C-CD-01-00-04',
          vlanId: 4,
          vlanPriority: 3,
          minTimeMs: 4,
          maxTimeMs: 1000,
          dataSetName: 'ds_Coupler_Interlocks',
          entries: [
            { lnClass: 'XCBR', lnInst: '1', doName: 'Pos', daName: 'stVal', desc: 'Position Disjoncteur Couplage (Autorisation transfert barres)' },
          ],
        },
      ],
      subscribedGooseIds: ['GOOSE_PUB_L01_TRIP', 'GOOSE_PUB_TR01_TRIP'],
    },
  ],
};

export class Iec61850SclService {
  /**
   * Generates a fully standard-compliant IEC 61850-6 XML string.
   * @param config The substation and IED configuration model
   * @param format 'SCD' (Full Substation Description), 'CID' (Single IED Description), or 'ICD' (IED Capability Template)
   * @param targetIedId Optional ID of specific IED for CID generation
   */
  public static generateSclXml(
    config: Iec61850SubstationConfig = DEFAULT_IEC61850_CONFIG,
    format: 'SCD' | 'CID' | 'ICD' = 'SCD',
    targetIedId?: string
  ): string {
    const timestamp = new Date().toISOString();
    const iedsToRender = (format === 'CID' && targetIedId) 
      ? config.ieds.filter((i) => i.id === targetIedId)
      : config.ieds;

    const selectedIed = iedsToRender[0] || config.ieds[0];
    const docHeaderId = format === 'CID' 
      ? `CID_${selectedIed.name}_${new Date().getFullYear()}`
      : `SCD_${config.substationName}_${new Date().getFullYear()}`;

    // Header section
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.iec.ch/61850/2003/SCL SCL.xsd"
     version="2007"
     revision="B">

  <!-- ===================================================================== -->
  <!-- IEC 61850-6 SUBSTATION CONFIGURATION LANGUAGE (SCL)                   -->
  <!-- Generated by AI Studio Substation Engineering Engine                  -->
  <!-- Standard: IEC 61850 Edition 2.1 / IEEE C37.238 PTP Power Profile      -->
  <!-- ===================================================================== -->
  <Header id="${docHeaderId}"
          version="2"
          revision="1"
          toolID="EPEDE Substation Engineering Studio v4.2"
          nameStructure="IEDName">
    <Text>Engineering configuration file (${format}) for ${config.substationName} (${config.voltageLevelKv} kV).</Text>
    <History>
      <Hitem version="1" revision="0" when="${timestamp}" who="Automated Protection Engine" what="Initial IED calibration &amp; GOOSE matrix generation"/>
    </History>
  </Header>

  <!-- ===================================================================== -->
  <!-- SUBSTATION TOPOLOGY & BAY SPECIFICATIONS                             -->
  <!-- ===================================================================== -->
  <Substation name="${config.substationName}" desc="Poste d'Interconnexion Électrique ${config.voltageLevelKv} kV">
    <VoltageLevel name="V_${config.voltageLevelKv}kV" desc="Jeu de barres ${config.voltageLevelKv} kV">
      <Voltage unit="V" multiplier="k">${config.voltageLevelKv}</Voltage>
`;

    // Bay definitions
    iedsToRender.forEach((ied) => {
      const bayId = `BAY_${ied.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      xml += `      <Bay name="${bayId}" desc="${ied.bayName}">
        <ConductingEquipment name="CB_52_${ied.name}" type="CBR" desc="Disjoncteur Haute Tension">
          <LNode iedName="${ied.name}" ldInst="PROT" lnClass="XCBR" lnInst="1" lnType="XCBR_Custom"/>
        </ConductingEquipment>
      </Bay>\n`;
    });

    xml += `    </VoltageLevel>
  </Substation>

  <!-- ===================================================================== -->
  <!-- COMMUNICATION NETWORK & GOOSE CONTROL ADAPTATIONS                     -->
  <!-- ===================================================================== -->
  <Communication>
    <SubNetwork name="StationBus_Ethernet" desc="Réseau Optique Station Bus IEC 61850-8-1 (PRP/HSR)">
      <BitRate unit="b/s" multiplier="M">100</BitRate>
`;

    iedsToRender.forEach((ied) => {
      xml += `      <ConnectedAP iedName="${ied.name}" apName="AP1">
        <Address>
          <P type="IP">${ied.ipAddress}</P>
          <P type="IP-SUBNET">${ied.subnetMask}</P>
          <P type="IP-GATEWAY">${ied.gateway}</P>
        </Address>
`;
      // GOOSE publishers
      ied.publishedGoose.forEach((g) => {
        xml += `        <GSE ldInst="PROT" cbName="${g.gseControlName}">
          <Address>
            <P type="MAC-Address">${g.macAddress}</P>
            <P type="APPID">${g.appId}</P>
            <P type="VLAN-ID">${g.vlanId}</P>
            <P type="VLAN-PRIORITY">${g.vlanPriority}</P>
          </Address>
          <MinTime unit="s">${(g.minTimeMs / 1000).toFixed(3)}</MinTime>
          <MaxTime unit="s">${(g.maxTimeMs / 1000).toFixed(3)}</MaxTime>
        </GSE>\n`;
      });

      xml += `      </ConnectedAP>\n`;
    });

    xml += `    </SubNetwork>
  </Communication>

  <!-- ===================================================================== -->
  <!-- IED SECTION : LOGICAL DEVICES & LOGICAL NODES (IEC 61850-7-4)         -->
  <!-- ===================================================================== -->
`;

    iedsToRender.forEach((ied) => {
      xml += `  <IED name="${ied.name}"
       type="${ied.type}"
       manufacturer="${ied.manufacturer}"
       configVersion="2026.09"
       desc="${ied.bayName}">
    <Services>
      <DynAssociation max="16"/>
      <SettingGroups>
        <SGEdit/>
        <ConfSG/>
      </SettingGroups>
      <GetDirectory/>
      <GetDataObjectDefinition/>
      <DataObjectDirectory/>
      <GetDataSetValue/>
      <DataSetDirectory/>
      <ConfDataSet max="16" maxAttributes="64"/>
      <GOOSE max="8"/>
      <TimeSyncProt>
        <PTP/>
      </TimeSyncProt>
    </Services>
    <AccessPoint name="AP1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="PROT" desc="Tranche de Protection et Contrôle-Commande">
          
          <!-- LLN0 : Contrôle Général, Jeux de Données (DataSets) & Émission GOOSE -->
          <LN0 lnClass="LLN0" inst="" lnType="LLN0_Custom">
`;

      // DataSets for GOOSE
      ied.publishedGoose.forEach((g) => {
        xml += `            <DataSet name="${g.dataSetName}" desc="Jeu de données pour publication GOOSE rapide">
`;
        g.entries.forEach((e) => {
          xml += `              <FCDA ldInst="PROT" lnClass="${e.lnClass}" lnInst="${e.lnInst}" doName="${e.doName}" daName="${e.daName}" fc="ST"/>\n`;
        });
        xml += `            </DataSet>
            <GSEControl name="${g.gseControlName}"
                        type="GOOSE"
                        appID="${g.appId}"
                        confRev="1"
                        datSet="${g.dataSetName}">
              <IEDName>${ied.name}</IEDName>
            </GSEControl>\n`;
      });

      // GOOSE Subscriptions (Inputs)
      if (ied.subscribedGooseIds.length > 0) {
        xml += `            <Inputs desc="Souscriptions GOOSE reçues des autres IEDs du réseau">\n`;
        ied.subscribedGooseIds.forEach((subId) => {
          xml += `              <ExtRef pDO="Op" pDA="general" intAddr="${subId}_TripLink" desc="Liaison Inter-Déclenchement GOOSE optique"/>\n`;
        });
        xml += `            </Inputs>\n`;
      }

      xml += `          </LN0>\n\n`;

      // Logical Nodes (PDIS, PDIF, PTOC, PTRC, XCBR, MMXU...)
      ied.logicalNodes.forEach((ln) => {
        xml += `          <!-- LN ${ln.lnClass}${ln.inst} : ${ln.descFr} -->
          <LN lnClass="${ln.lnClass}" inst="${ln.inst}" lnType="${ln.lnClass}_Custom" desc="${ln.descFr}">
`;
        ln.dataObjects.forEach((dob) => {
          xml += `            <DOI name="${dob.name}" desc="${dob.desc}">
              <DAI name="setMag">
                <Val>${dob.val}</Val>
              </DAI>
            </DOI>\n`;
        });
        xml += `          </LN>\n\n`;
      });

      xml += `        </LDevice>
      </Server>
    </AccessPoint>
  </IED>\n\n`;
    });

    // DataTypeTemplates Section
    xml += `  <!-- ===================================================================== -->
  <!-- DATA TYPE TEMPLATES (IEC 61850-7-2 / IEC 61850-7-3)                   -->
  <!-- ===================================================================== -->
  <DataTypeTemplates>
    <LNodeType id="LLN0_Custom" lnClass="LLN0">
      <DO name="Mod" type="INC_Mod"/>
      <DO name="Beh" type="INS_Beh"/>
      <DO name="Health" type="INS_Health"/>
      <DO name="NamPlt" type="LPL_LLN0"/>
    </LNodeType>

    <LNodeType id="PDIS_Custom" lnClass="PDIS" desc="Distance Protection Function">
      <DO name="Op" type="ACT_Trip"/>
      <DO name="Z1Reach" type="ASG_Float"/>
      <DO name="Z2Reach" type="ASG_Float"/>
    </LNodeType>

    <LNodeType id="PDIF_Custom" lnClass="PDIF" desc="Differential Protection Function">
      <DO name="Op" type="ACT_Trip"/>
      <DO name="Is1" type="ASG_Float"/>
      <DO name="k1" type="ASG_Float"/>
      <DO name="Is2" type="ASG_Float"/>
      <DO name="k2" type="ASG_Float"/>
    </LNodeType>

    <LNodeType id="PTOC_Custom" lnClass="PTOC" desc="Time Overcurrent Function">
      <DO name="Op" type="ACT_Trip"/>
      <DO name="StrVal" type="ASG_Float"/>
      <DO name="TmMult" type="ASG_Float"/>
    </LNodeType>

    <LNodeType id="PTRC_Custom" lnClass="PTRC" desc="Trip Conditioning">
      <DO name="Tr" type="ACT_Trip"/>
    </LNodeType>

    <LNodeType id="XCBR_Custom" lnClass="XCBR" desc="Circuit Breaker Status &amp; Command">
      <DO name="Pos" type="DPC_BreakerPos"/>
      <DO name="BlkOpn" type="SPC_Boolean"/>
    </LNodeType>

    <LNodeType id="MMXU_Custom" lnClass="MMXU" desc="Measurements">
      <DO name="TotW" type="MV_Float"/>
      <DO name="TotVAr" type="MV_Float"/>
      <DO name="Hz" type="MV_Float"/>
    </LNodeType>

    <!-- Standard DO Types -->
    <DOType id="ACT_Trip" cdc="ACT">
      <DA name="general" bType="BOOLEAN" fc="ST"/>
      <DA name="phsA" bType="BOOLEAN" fc="ST"/>
      <DA name="phsB" bType="BOOLEAN" fc="ST"/>
      <DA name="phsC" bType="BOOLEAN" fc="ST"/>
      <DA name="t" bType="Timestamp" fc="ST"/>
    </DOType>

    <DOType id="DPC_BreakerPos" cdc="DPC">
      <DA name="stVal" bType="Dbpos" fc="ST"/>
      <DA name="q" bType="Quality" fc="ST"/>
      <DA name="t" bType="Timestamp" fc="ST"/>
    </DOType>

    <DOType id="ASG_Float" cdc="ASG">
      <DA name="setMag" bType="FLOAT32" fc="SP"/>
    </DOType>

    <DOType id="MV_Float" cdc="MV">
      <DA name="mag" bType="FLOAT32" fc="MX"/>
      <DA name="q" bType="Quality" fc="MX"/>
    </DOType>
  </DataTypeTemplates>
</SCL>`;

    return xml;
  }
}
