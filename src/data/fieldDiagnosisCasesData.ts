// src/data/fieldDiagnosisCasesData.ts
// EPEDE Master Dataset — Field Observation to Engineering Diagnosis Framework
// Connects physical/acoustic/thermal symptoms to root causes, testing standards, protection relays,
// safety LOTO procedures, and utility escalation protocols.
// Grounded in IEC 60599, IEC 60076, IEC 62271, IEC 60255, IEEE C37, and Cameroon grid practices.

import type { EvidenceTrustLevel } from '../types/engineeringIntelligenceExtensions';

export type DiagnosticSymptomCategory =
  | 'DGA_OIL_DIELECTRIC'
  | 'THERMAL_INFRARED'
  | 'ELECTRICAL_TRIP'
  | 'MECHANICAL_PRESSURE'
  | 'ACOUSTIC_VIBRATION'
  | 'SF6_GAS_INSULATION';

export type DiagnosticUrgencyLevel =
  | 'TRIP_IMMEDIATE'
  | 'CRITICAL_24H'
  | 'MONITORING_7D'
  | 'SCHEDULED_OUTAGE';

export interface RequiredFieldTest {
  testName_fr: string;
  testName_en: string;
  measuringInstrument: string;
  governingStandard: string;
  acceptanceThreshold_fr: string;
  acceptanceThreshold_en: string;
  safetyRequirement_fr: string;
  safetyRequirement_en: string;
}

export interface ProtectionFunctionMapping {
  ansiCode: string;
  functionName_fr: string;
  functionName_en: string;
  typicalTripTime: string;
  relayAction_fr: string;
  relayAction_en: string;
}

export interface LotoIsolationStep {
  stepNumber: number;
  action_fr: string;
  action_en: string;
  verificationMethod_fr: string;
  verificationMethod_en: string;
}

export interface FieldDiagnosisCase {
  id: string;
  category: DiagnosticSymptomCategory;
  urgency: DiagnosticUrgencyLevel;
  trustLevel: EvidenceTrustLevel;
  targetEquipmentFamilies: string[]; // e.g. ['transformer', 'circuit_breaker', 'generator', 'line', 'gis']
  
  // 1. Observation
  symptomTitle_fr: string;
  symptomTitle_en: string;
  observableIndicators_fr: string[];
  observableIndicators_en: string[];
  detectionTechnique_fr: string;
  detectionTechnique_en: string;

  // 2. Causal Root Causes (FMEA)
  probableRootCauses: Array<{
    cause_fr: string;
    cause_en: string;
    probabilityPercent: number;
    physicalMechanism_fr: string;
    physicalMechanism_en: string;
  }>;

  // 3. Testing Protocols
  requiredFieldTests: RequiredFieldTest[];

  // 4. Protection Functions
  protectionFunctions: ProtectionFunctionMapping[];

  // 5. LOTO Safety Steps
  lotoIsolationSteps: LotoIsolationStep[];

  // 6. Escalation & Operational Remedy
  escalationProtocol_fr: string;
  escalationProtocol_en: string;
  provisionalRemedy_fr: string;
  provisionalRemedy_en: string;
  definitiveRepair_fr: string;
  definitiveRepair_en: string;

  // Concrete regional reference
  cameroonContextNotes?: {
    fr: string;
    en: string;
  };
}

export const FIELD_DIAGNOSIS_CASES: FieldDiagnosisCase[] = [
  // CASE 1: ACETYLENE IN OIL (HIGH ENERGY ARCING)
  {
    id: 'case-dga-acetylene-arc',
    category: 'DGA_OIL_DIELECTRIC',
    urgency: 'TRIP_IMMEDIATE',
    trustLevel: 'VERIFIED_STANDARD',
    targetEquipmentFamilies: ['transformer', 'autotransformer', 'gsu'],
    symptomTitle_fr: 'Teneur anormale en Acétylène (C₂H₂ > 10 ppm) dans l\'huile diélectrique',
    symptomTitle_en: 'Abnormal Acetylene concentration (C₂H₂ > 10 ppm) in transformer oil',
    observableIndicators_fr: [
      'Analyse chromatographique des gaz dissous (DGA) révélant C₂H₂ > 10 ppm',
      'Ratio C₂H₂ / C₂H₄ > 1 sur le Triangle 1 de Duval (Zone D2 : Décharges de forte énergie)',
      'Légère odeur de brûlé au niveau du conservateur ou du reniflard déshydratant',
      'Éventuel bouillonnement acoustique perceptible à la canne d\'écoute stéthoscopique'
    ],
    observableIndicators_en: [
      'Dissolved Gas Analysis (DGA) showing C₂H₂ > 10 ppm',
      'C₂H₂ / C₂H₄ ratio > 1 on Duval Triangle 1 (Zone D2: High-energy electrical arcing)',
      'Faint acrid burnt odor near oil conservator or silica gel breather',
      'Possible acoustic bubbling audible via acoustic contact wand'
    ],
    detectionTechnique_fr: 'Chromatographie en phase gazeuse périodique (CEI 60599) ou analyseur DGA multivoie en ligne (photo-acoustique).',
    detectionTechnique_en: 'Periodic gas chromatography (IEC 60599) or multi-gas online DGA photoacoustic sensor.',
    probableRootCauses: [
      {
        cause_fr: 'Amorçage d\'arc franc sous huile entre spires ou galettes de l\'enroulement HTB',
        cause_en: 'Direct electrical flashover arcing between HV winding turns or disc sections',
        probabilityPercent: 65,
        physicalMechanism_fr: 'Dégradation diélectrique du papier kraft par vieillissement thermique (DP < 200) ou surtension de foudre ayant rompu la barrière d\'huile.',
        physicalMechanism_en: 'Dielectric breakdown of kraft paper insulation from thermal aging (DP < 200) or lightning impulse puncturing oil duct.'
      },
      {
        cause_fr: 'Court-circuit franc au sélecteur de prises en charge (OLTC)',
        cause_en: 'Flashover across On-Load Tap Changer (OLTC) selector switch contacts',
        probabilityPercent: 25,
        physicalMechanism_fr: 'Usure anormale des contacts au tungstène-cuivre ou rupture des résistances de passage lors de la transition.',
        physicalMechanism_en: 'Severe contact erosion on copper-tungsten tips or open transition resistor during tap change sequence.'
      },
      {
        cause_fr: 'Amorçage pied de traversée capacitive (Bushing OIP/RIP)',
        cause_en: 'Lower terminal breakdown of capacitive transformer bushing (OIP/RIP)',
        probabilityPercent: 10,
        physicalMechanism_fr: 'Pénétration d\'humidité dans le feuilletage condensateur de la traversée créant un chemin conducteur vers la cuve.',
        physicalMechanism_en: 'Moisture ingress inside capacitive foil grading causing conductive path to ground flange.'
      }
    ],
    requiredFieldTests: [
      {
        testName_fr: 'Rapport de transformation & Polarité (TTR)',
        testName_en: 'Transformer Turns Ratio & Polarity (TTR)',
        measuringInstrument: 'Ratiomètre triphasé automatique 250 V',
        governingStandard: 'IEC 60076-1 / IEEE C57.12.90',
        acceptanceThreshold_fr: 'Écart de rapport < 0.5% par rapport à la plaque signalétique sur toutes les prises.',
        acceptanceThreshold_en: 'Ratio deviation < 0.5% against nameplate values on all tap positions.',
        safetyRequirement_fr: 'Consignation totale amont et aval, mise à la terre préalable pour dissiper les charges capacitives.',
        safetyRequirement_en: 'Complete upstream/downstream LOTO, ground connection to drain residual capacitive charge.'
      },
      {
        testName_fr: 'Résistance des enroulements en courant continu (DC)',
        testName_en: 'Winding DC Resistance Measurement',
        measuringInstrument: 'Micro-ohmmètre inductif 10 A avec démagnétiseur',
        governingStandard: 'IEC 60076-1 Cl. 10.2',
        acceptanceThreshold_fr: 'Écart entre phases < 2.0% et concordance avec les PV d\'essais usine ramenés à 75 °C.',
        acceptanceThreshold_en: 'Phase-to-phase deviation < 2.0% matching factory routine test data corrected to 75 °C.',
        safetyRequirement_fr: 'Attendre la décharge magnétique complète de l\'inductance avant de déconnecter les pinces Kelvin.',
        safetyRequirement_en: 'Ensure complete magnetic discharge of core inductance before removing Kelvin clamps.'
      },
      {
        testName_fr: 'Analyse de Réponse en Fréquence (SFRA)',
        testName_en: 'Sweep Frequency Response Analysis (SFRA)',
        measuringInstrument: 'Analyseur SFRA 10 Hz – 2 MHz',
        governingStandard: 'IEC 60076-18',
        acceptanceThreshold_fr: 'Corrélation des signatures spectrales Rxy > 0.999 en basse fréquence et > 0.95 en moyenne fréquence.',
        acceptanceThreshold_en: 'Spectral correlation coefficient Rxy > 0.999 at low frequencies and > 0.95 at mid-frequencies.',
        safetyRequirement_fr: 'Tresses de masse les plus courtes possibles reliées directement à la bride des traversées.',
        safetyRequirement_en: 'Ultra-short coaxial shield earthing braids clamped directly to bushing flanges.'
      }
    ],
    protectionFunctions: [
      {
        ansiCode: '87T',
        functionName_fr: 'Protection Différentielle Transformateur',
        functionName_en: 'Transformer Differential Protection',
        typicalTripTime: '20 – 35 ms',
        relayAction_fr: 'Déclenchement instantané des disjoncteurs amont (225 kV) et aval (30 kV) sans temporisation.',
        relayAction_en: 'Instantaneous tripping of upstream (225 kV) and downstream (30 kV) breakers without intentional delay.'
      },
      {
        ansiCode: '63',
        functionName_fr: 'Clapet de Surpression Rapide (PRD)',
        functionName_en: 'Sudden Pressure Relief Device (PRD)',
        typicalTripTime: '10 – 20 ms mécanique',
        relayAction_fr: 'Évacuation mécanique de la vague d\'huile pour empêcher la rupture de cuve et déclenchement électrique auxiliaire.',
        relayAction_en: 'Mechanical oil wave venting to avert tank rupture accompanied by auxiliary electrical trip command.'
      },
      {
        ansiCode: '49',
        functionName_fr: 'Image Thermique Enroulement (Stator/Transfo)',
        functionName_en: 'Winding Thermal Replica Protection',
        typicalTripTime: 'Courbe thermique à mémoire I²t',
        relayAction_fr: 'Alarme à 105 °C, déclenchement du délestage à 120 °C.',
        relayAction_en: 'Alarm at 105 °C, trip and load disconnection at 120 °C.'
      }
    ],
    lotoIsolationSteps: [
      {
        stepNumber: 1,
        action_fr: 'Ouverture télécommandée ou manuelle du disjoncteur 225 kV primaire puis du disjoncteur 30 kV secondaire.',
        action_en: 'Remote or manual tripping of 225 kV primary circuit breaker followed by 30 kV secondary breaker.',
        verificationMethod_fr: 'Vérification de l\'état OUVERT sur les voyants mécaniques locaux et le mimic SCADA.',
        verificationMethod_en: 'Verify OPEN mechanical indicator on breaker front panel and SCADA mimic display.'
      },
      {
        stepNumber: 2,
        action_fr: 'Ouverture des sectionneurs de barres et de ligne amont et aval (Coupure visible).',
        action_en: 'Open upstream and downstream busbar and line disconnectors (Visible isolation break).',
        verificationMethod_fr: 'Constat visuel direct de l\'écartement physique des couteaux de sectionnement.',
        verificationMethod_en: 'Direct visual confirmation of disconnector blade separation distance.'
      },
      {
        stepNumber: 3,
        action_fr: 'Condamnation mécanique par cadenas des tringleries des sectionneurs et pose de pancartes d\'interdiction.',
        action_en: 'Padlock mechanical interlock linkages on all open disconnectors and affix LOTO warning tags.',
        verificationMethod_fr: 'Clé de sécurité consignée au tableau des cadenas du chef de consignation.',
        verificationMethod_en: 'Safety padlock key locked inside safety lockbox by designated authorized engineer.'
      },
      {
        stepNumber: 4,
        action_fr: 'Vérification d\'Absence de Tension (VAT) avec perche isolante télescopique homologuée 225 kV.',
        action_en: 'Absence of voltage test (VAT) using certified 225 kV telescopic high-voltage detector.',
        verificationMethod_fr: 'Autotest de la perche avant et après vérification sur chaque phase.',
        verificationMethod_en: 'Acoustic and optical self-test of detector wand before and immediately after contact on each phase.'
      },
      {
        stepNumber: 5,
        action_fr: 'Fermeture des sectionneurs de mise à la terre (MALT) et pose des équipements portatifs MALT-CC.',
        action_en: 'Close earthing switches and install portable ground and short-circuit jumper cables.',
        verificationMethod_fr: 'Serrage des pinces sur rail de terre en premier, puis raccordement aux phases.',
        verificationMethod_en: 'Clamp earth-side end first onto substation ground bus, then fasten clamps to phase conductors.'
      }
    ],
    escalationProtocol_fr: 'Alerte immédiate du Dispatching National (SONATREL). Interdiction formelle de réenclenchement sans expertise. Notification de la direction technique pour mobilisation de l\'équipe de diagnostic diélectrique.',
    escalationProtocol_en: 'Immediate emergency alert to National Dispatch Center (SONATREL). Strict lockout preventing reclosing without certified diagnostics. Mobilization of utility dielectric testing team.',
    provisionalRemedy_fr: 'Bascule de la charge sur le transformateur adjacent en redondance N-1 si la capacité thermique le permet, ou délestage contrôlé de départs non prioritaires.',
    provisionalRemedy_en: 'Transfer feeder loads to parallel N-1 transformer if thermal margin permits, otherwise execute selective non-critical feeder load shedding.',
    definitiveRepair_fr: 'Décuvage en atelier spécialisé, extraction de la partie active, remplacement de la galette défaillante ou ré-enroulement complet sous atmosphère contrôlée.',
    definitiveRepair_en: 'Untanking at authorized workshop, active core extraction, damaged winding disc replacement or complete rewinding in dust-controlled cleanroom.',
    cameroonContextNotes: {
      fr: 'Sur le transformateur 63 MVA 225/30 kV de Mangombé (Edéa), un taux d\'acétylène supérieur à 10 ppm impose un signalement immédiat à la SONATREL et à l\'ARSEL en vertu du Code de Transport 2020.',
      en: 'On the 63 MVA 225/30 kV autotransformer at Mangombé (Edéa), acetylene > 10 ppm mandates emergency notification to SONATREL and ARSEL under the 2020 Grid Code.'
    }
  },

  // CASE 2: BUCHHOLZ RELAY GAS COLLECTION
  {
    id: 'case-buchholz-gas-trip',
    category: 'MECHANICAL_PRESSURE',
    urgency: 'TRIP_IMMEDIATE',
    trustLevel: 'VERIFIED_STANDARD',
    targetEquipmentFamilies: ['transformer', 'autotransformer'],
    symptomTitle_fr: 'Déclenchement ou Alarme Relais Buchholz (Dégagement gazeux / Baisse niveau d\'huile)',
    symptomTitle_en: 'Buchholz Relay Trip or Alarm (Gas accumulation / Oil surge)',
    observableIndicators_fr: [
      'Alarme 1er flotteur Buchholz (accumulation de gaz lente)',
      'Déclenchement brutal 2nd flotteur (clapet à volet d\'onde d\'huile > 1.0 m/s)',
      'Présence de gaz visible dans la fenêtre de regard graduée du relais Buchholz',
      'Couleur du gaz collecté : blanchâtre (destruction papier/cellulose) ou grisâtre (arc huile)'
    ],
    observableIndicators_en: [
      'Stage 1 Buchholz alarm (gradual gas accumulation in top chamber)',
      'Stage 2 Buchholz trip (oil surge velocity flap triggered > 1.0 m/s)',
      'Visible gas pocket trapped in graduated inspection window of relay',
      'Gas tint in sight glass: whitish (cellulose paper decomposition) or grayish (arcing under oil)'
    ],
    detectionTechnique_fr: 'Surveillance permanente du relais Buchholz bi-flotteur installé sur la tubulure reliant la cuve au conservateur (pente 2 à 4%).',
    detectionTechnique_en: 'Continuous monitoring via dual-float Buchholz relay installed on the inclined pipe (2-4% grade) between tank and conservator.',
    probableRootCauses: [
      {
        cause_fr: 'Dégagement d\'hydrogène et d\'hydrocarbures par décharge partielle ou point chaud interne',
        cause_en: 'Hydrogen and hydrocarbon release from partial discharges or core hotspot',
        probabilityPercent: 55,
        physicalMechanism_fr: 'Point chaud magnétique sur vis de serrage du circuit magnétique ou court-circuit entre tôles créant un foyer thermique localisé.',
        physicalMechanism_en: 'Magnetic hotspot on core tie-bolts or interlaminar core insulation breakdown creating localized overheating.'
      },
      {
        cause_fr: 'Poche d\'air résiduelle piégée après opération récente de traitement d\'huile',
        cause_en: 'Entrained air pocket trapped following recent oil degasification or filling',
        probabilityPercent: 25,
        physicalMechanism_fr: 'Dégazage incomplet lors du remplissage sous vide de l\'appareil.',
        physicalMechanism_en: 'Incomplete vacuum evacuation during oil circulation and filling procedure.'
      },
      {
        cause_fr: 'Fuite massive d\'huile externe abaissant le niveau sous le relais Buchholz',
        cause_en: 'External oil leakage dropping oil level below Buchholz chamber',
        probabilityPercent: 20,
        physicalMechanism_fr: 'Fissuration de vanne de vidange, défaillance joint aéro-réfrigérant ou rupture de tuyauterie.',
        physicalMechanism_en: 'Drain valve crack, radiator gasket rupture or oil pipe failure causing conservator drainage.'
      }
    ],
    requiredFieldTests: [
      {
        testName_fr: 'Prélèvement et Test de combustibilité du gaz au robinet Buchholz',
        testName_en: 'Buchholz Gas Sampling & Combustibility Flame Test',
        measuringInstrument: 'Tube de prélèvement étanche et burette de gaz',
        governingStandard: 'IEC 60599 / DIN 42566',
        acceptanceThreshold_fr: 'Gaz incombustible (air) = sans danger immédiat. Gaz inflammable = présence d\'arc ou décomposition pyrolytique.',
        acceptanceThreshold_en: 'Non-flammable gas (air) = benign. Flammable gas = internal fault requiring immediate shutdown.',
        safetyRequirement_fr: 'Port de gants ignifugés et lunettes de protection lors du test à la flamme au sommet du transfo.',
        safetyRequirement_en: 'Flame-retardant gloves and face shield when performing open-flame combustibility check.'
      },
      {
        testName_fr: 'Rigidité diélectrique de l\'huile (Tension de claquage)',
        testName_en: 'Oil Dielectric Breakdown Voltage Test',
        measuringInstrument: 'Rigidimètre d\'huile automatique 100 kV (électrodes champignon VDE 0370)',
        governingStandard: 'IEC 60156',
        acceptanceThreshold_fr: 'Tension de claquage > 60 kV pour transfo 225 kV neuf, > 50 kV en service.',
        acceptanceThreshold_en: 'Breakdown voltage > 60 kV for new 225 kV oil, > 50 kV for in-service oil.',
        safetyRequirement_fr: 'Échantillonnage en flacon verre teinté scellé sans bulles d\'air.',
        safetyRequirement_en: 'Sample collected in amber glass sealed bottle avoiding air contact.'
      }
    ],
    protectionFunctions: [
      {
        ansiCode: '63B-1',
        functionName_fr: 'Buchholz Flotteur Supérieur (Alarme)',
        functionName_en: 'Buchholz Upper Float (Alarm)',
        typicalTripTime: 'Temps d\'accumulation (secondes à minutes)',
        relayAction_fr: 'Signalisation au SCADA et déclenchement de la procédure de prélèvement.',
        relayAction_en: 'Alarm sent to control room prompting gas analysis procedure.'
      },
      {
        ansiCode: '63B-2',
        functionName_fr: 'Buchholz Flotteur Inférieur / Clapet de choc (Déclenchement)',
        functionName_en: 'Buchholz Lower Float / Surge Flap (Trip)',
        typicalTripTime: '< 50 ms',
        relayAction_fr: 'Déclenchement instantané irréversible des disjoncteurs MT et HT.',
        relayAction_en: 'Instantaneous lockout trip on all primary and secondary breakers.'
      }
    ],
    lotoIsolationSteps: [
      {
        stepNumber: 1,
        action_fr: 'Ouverture et verrouillage mécanique des disjoncteurs 225 kV et 30 kV.',
        action_en: 'Open and mechanically lock 225 kV and 30 kV circuit breakers.',
        verificationMethod_fr: 'Indicateur mécanique de position et consignation électrique de commande.',
        verificationMethod_en: 'Check mechanical position semaphore and trip coil DC circuit fuses pulled.'
      },
      {
        stepNumber: 2,
        action_fr: 'Séparation visible des sectionneurs associés.',
        action_en: 'Open disconnectors for visible air-break clearance.',
        verificationMethod_fr: 'Vérification visuelle sur site de l\'ouverture complète.',
        verificationMethod_en: 'Direct visual confirmation on site of blade separation.'
      },
      {
        stepNumber: 3,
        action_fr: 'Mise à la terre et en court-circuit (MALT-CC) de part et d\'autre du transformateur.',
        action_en: 'Earthing and short-circuiting on primary and secondary bushings.',
        verificationMethod_fr: 'Test VAT préalable et contrôle du contact des perches de terre.',
        verificationMethod_en: 'Verify absence of voltage (VAT) prior to applying grounding leads.'
      }
    ],
    escalationProtocol_fr: 'En cas de déclenchement du 2nd flotteur, interdiction absolue de remise sous tension sans autorisation expresse du Directeur Technique.',
    escalationProtocol_en: 'In case of stage 2 trip, re-energization is strictly prohibited until formal technical investigation signoff.',
    provisionalRemedy_fr: 'Si seul le 1er flotteur a déclenché et que le gaz est de l\'air pur, purger la chambre du relais et surveiller 48h.',
    provisionalRemedy_en: 'If stage 1 triggered and gas is determined to be atmospheric air, bleed relay chamber and monitor 48h.',
    definitiveRepair_fr: 'Si le gaz est inflammable, analyse DGA complète en laboratoire, test SFRA et ouverture cuve pour inspection visuelle.',
    definitiveRepair_en: 'If flammable, run lab DGA, SFRA sweep and tank opening for active part visual inspection.',
    cameroonContextNotes: {
      fr: 'En période de fortes chaleurs sahéliennes dans le Réseau Interconnecté Nord (RIN) à Garoua/Ngaoundéré, les dégazages intempestifs de dilatation doivent être distingués des arcs réels.',
      en: 'During Sahel dry-season heatwaves in Northern Grid (RIN) at Garoua/Ngaoundéré, thermal gas expansion must be verified versus genuine faults.'
    }
  },

  // CASE 3: SF6 CIRCUIT BREAKER DENSITY DROP
  {
    id: 'case-sf6-density-loss',
    category: 'SF6_GAS_INSULATION',
    urgency: 'CRITICAL_24H',
    trustLevel: 'VERIFIED_STANDARD',
    targetEquipmentFamilies: ['circuit_breaker', 'gis'],
    symptomTitle_fr: 'Baisse anormale de pression / densité de SF₆ sur disjoncteur HTB 225 kV',
    symptomTitle_en: 'Abnormal SF₆ density / pressure drop on 225 kV HV circuit breaker',
    observableIndicators_fr: [
      'Alarme de télésurveillance SCADA : « Pression SF₆ Seuil 1 Basse » (ex. 5.5 bar)',
      'Aiguille du manomètre/densimètre à aiguille dans la zone jaune d\'alerte',
      'Absence de claquement franc lors des manœuvres'
    ],
    observableIndicators_en: [
      'SCADA telemetry alarm: "SF₆ Pressure Low Stage 1" (e.g. 5.5 bar rel.)',
      'Temperature-compensated density gauge needle entering yellow warning zone',
      'Potential risk of trip lockout if stage 2 (e.g. 5.0 bar) is reached'
    ],
    detectionTechnique_fr: 'Densimètre à soufflet compensé en température permanente (CEI 62271-100) et ronde périodique de lecture visuelle.',
    detectionTechnique_en: 'Temperature-compensated bellows density switch (IEC 62271-100) and routine visual dial logs.',
    probableRootCauses: [
      {
        cause_fr: 'Dégradation ou vieillissement d\'un joint torique EPDM de bride de pôle',
        cause_en: 'Degradation or aging of pole flange EPDM O-ring gasket',
        probabilityPercent: 60,
        physicalMechanism_fr: 'Durcissement du polymère sous climat tropical humide et cycles d\'ensoleillement direct.',
        physicalMechanism_en: 'Elastomer hardening from intense tropical UV radiation and ambient temperature swings.'
      },
      {
        cause_fr: 'Micro-fuite sur le raccord d\'alimentation ou clapet Dilo de remplissage',
        cause_en: 'Micro-leak on gas filling check valve (Dilo coupling)',
        probabilityPercent: 25,
        physicalMechanism_fr: 'Défaut d\'étanchéité de la bille de clapet ou résidu métallique de sertissage.',
        physicalMechanism_en: 'Valve seat particle contamination or worn seal inside self-sealing coupling.'
      },
      {
        cause_fr: 'Fissuration d\'isolateur en porcelaine ou composite sous contrainte mécanique',
        cause_en: 'Hairline crack in porcelain or composite hollow insulator',
        probabilityPercent: 15,
        physicalMechanism_fr: 'Effort électrodynamique répété lors de courts-circuits violents ou traction excessive de barre.',
        physicalMechanism_en: 'Cyclic electrodynamic stress from close-in faults or excessive cantilever busbar pull.'
      }
    ],
    requiredFieldTests: [
      {
        testName_fr: 'Recherche de fuite SF₆ par renifleur infrarouge et caméra optique (OGI)',
        testName_en: 'SF₆ Leak Detection via Infrared Sniffer & Optical Gas Camera',
        measuringInstrument: 'Détecteur portatif infrarouge (sensibilité 1 g/an) et caméra FLIR GF306',
        governingStandard: 'IEC 62271-4 / CIGRE TB 276',
        acceptanceThreshold_fr: 'Taux de fuite global < 0.5% de la masse de gaz par an.',
        acceptanceThreshold_en: 'Total enclosure leak rate < 0.5% of gas mass per year.',
        safetyRequirement_fr: 'Ne pas inhaler les gaz résiduels ; aérer le poste si bâtiment fermé (risque d\'asphyxie).',
        safetyRequirement_en: 'Do not inhale vented gas; ventilate indoor halls (SF₆ heavier than air creates asphyxiation hazard).'
      },
      {
        testName_fr: 'Mesure de pureté et d\'humidité du gaz SF₆',
        testName_en: 'SF₆ Gas Purity, Moisture & Decomposition Byproducts Test',
        measuringInstrument: 'Analyseur multi-gaz SF₆ (Dilo / Wika)',
        governingStandard: 'IEC 60480 / IEC 60376',
        acceptanceThreshold_fr: 'Pureté SF₆ > 97%, humidité point de rosée < -36 °C, teneur en SO₂ < 12 ppmv.',
        acceptanceThreshold_en: 'SF₆ purity > 97%, dew point < -36 °C, SO₂ content < 12 ppmv.',
        safetyRequirement_fr: 'Récupération intégrale du gaz testé dans une bouteille de recyclage, rejet zéro à l\'atmosphère.',
        safetyRequirement_en: 'Closed-loop capture of sample gas into recovery cylinder, strictly zero atmospheric venting.'
      }
    ],
    protectionFunctions: [
      {
        ansiCode: '63GL-1',
        functionName_fr: 'Densité SF₆ Seuil 1 (Alarme Exploitation)',
        functionName_en: 'SF₆ Density Stage 1 (Operating Alarm)',
        typicalTripTime: 'Instantané électrique',
        relayAction_fr: 'Alerte SCADA. Le disjoncteur conserve son pouvoir de coupure nominal.',
        relayAction_en: 'SCADA alarm. Breaker retains full rated breaking capacity temporarily.'
      },
      {
        ansiCode: '63GL-2',
        functionName_fr: 'Densité SF₆ Seuil 2 (Blocage Déclenchement / Verrouillage)',
        functionName_en: 'SF₆ Density Stage 2 (Trip Lockout / Interlock)',
        typicalTripTime: 'Instantané électrique',
        relayAction_fr: 'VERROUILLAGE ÉLECTRIQUE : interdiction d\'ouverture locale et distante pour éviter l\'explosion de la chambre.',
        relayAction_en: 'OPENING INTERLOCK LOCKOUT: opening is strictly inhibited to prevent arc chamber explosion.'
      }
    ],
    lotoIsolationSteps: [
      {
        stepNumber: 1,
        action_fr: 'Si seuil 2 non atteint : ouverture du disjoncteur avant déclenchement du verrouillage.',
        action_en: 'If stage 2 not yet locked: trip the breaker while breaking capacity is guaranteed.',
        verificationMethod_fr: 'Indicateur mécanique de contact.',
        verificationMethod_en: 'Mechanical contact indicator.'
      },
      {
        stepNumber: 2,
        action_fr: 'Si seuil 2 atteint (verrouillé) : faire déclencher les disjoncteurs encadrants (jeu de barres amont et ligne aval).',
        action_en: 'If stage 2 locked: trip surrounding upstream bus and downstream line breakers to isolate without operating faulty breaker.',
        verificationMethod_fr: 'Vérification de courant nul sur les TC de travée.',
        verificationMethod_en: 'Zero-current verification on bay CT ammeters.'
      },
      {
        stepNumber: 3,
        action_fr: 'Ouverture des sectionneurs de barres et mise à la terre sécurisée.',
        action_en: 'Open bus disconnectors and close ground switches.',
        verificationMethod_fr: 'Coupure visible et consignation par cadenas.',
        verificationMethod_en: 'Visible clearance and padlock tagout.'
      }
    ],
    escalationProtocol_fr: 'Remplissage sous 24h avec groupe de traitement certifié. Si passage au seuil 2, isoler immédiatement la travée via le disjoncteur de couplage ou les départs amont.',
    escalationProtocol_en: 'Refill within 24h using certified recovery trolley. If stage 2 trip lockout triggers, isolate bay immediately using bus tie breaker.',
    provisionalRemedy_fr: 'Recharge en gaz SF₆ sec jusqu\'à la pression nominale (6.0 bar rel. à 20 °C) avec enregistrement de la masse injectée.',
    provisionalRemedy_en: 'Top up with dry SF₆ gas to rated pressure (6.0 bar rel. at 20 °C), logging injected mass.',
    definitiveRepair_fr: 'Remplacement du pôle fuyard ou des joints lors de la prochaine coupure programmée.',
    definitiveRepair_en: 'Replace leaking pole cylinder or rebuild flange seals during scheduled maintenance window.',
    cameroonContextNotes: {
      fr: 'Dans les postes côtiers (Kribi 225 kV, Bekoko, Oyomabang), l\'air marin chargé en sel accélère la corrosion des boulonneries de bride de disjoncteur.',
      en: 'In coastal substations (Kribi 225 kV, Bekoko, Oyomabang), saline marine atmosphere accelerates flange fastener corrosion.'
    }
  },

  // CASE 4: HYDRO TURBINE GENERATOR STATOR GROUND FAULT
  {
    id: 'case-hydro-generator-stator-ground',
    category: 'ELECTRICAL_TRIP',
    urgency: 'TRIP_IMMEDIATE',
    trustLevel: 'VERIFIED_STANDARD',
    targetEquipmentFamilies: ['generator', 'hydro_turbine'],
    symptomTitle_fr: 'Défaut de masse stator / Déclenchement ANSI 59N ou 64G sur turbo-alternateur',
    symptomTitle_en: 'Stator Ground Fault / ANSI 59N or 64G trip on hydro generator',
    observableIndicators_fr: [
      'Déclenchement d\'urgence du groupe turbo-alternateur avec fermeture des vannes de pied',
      'Alarme SCADA : « Défaut Terre Stator 100% (ANSI 64G / 59N) »',
      'Tension homopolaire V₀ > 5% Un aux bornes du transformateur de point neutre',
      'Arrêt brutal du groupe et décrochage du disjoncteur d\'alternateur (GCB)'
    ],
    observableIndicators_en: [
      'Emergency shutdown of hydro unit with rapid wicket gate and turbine penstock valve closure',
      'SCADA alarm: "100% Stator Ground Fault (ANSI 64G / 59N)"',
      'Residual zero-sequence voltage V₀ > 5% across neutral earthing distribution transformer secondary',
      'Generator circuit breaker (GCB) trip and de-excitation trip'
    ],
    detectionTechnique_fr: 'Relais de protection numérique multifonction connecté au transformateur de point neutre de l\'alternateur (CEI 60255 / IEEE C37.102).',
    detectionTechnique_en: 'Digital generator protection relay connected across generator neutral earthing transformer secondary (IEC 60255 / IEEE C37.102).',
    probableRootCauses: [
      {
        cause_fr: 'Perforation de l\'isolant micacé d\'une barre Roebel dans l\'encoche statorique',
        cause_en: 'Dielectric puncture of Roebel bar mica-epoxy insulation inside stator slot',
        probabilityPercent: 70,
        physicalMechanism_fr: 'Vieillissement thermo-mécanique combiné à l\'abrasion par vibrations à 100 Hz et décharges d\'encoche (slot discharge).',
        physicalMechanism_en: 'Thermo-mechanical fatigue combined with 100 Hz electromagnetic vibration abrasion and slot discharges.'
      },
      {
        cause_fr: 'Corps étranger conducteur dans l\'entrefer ou les têtes de bobines',
        cause_en: 'Conductive foreign object in air gap or end-winding basket',
        probabilityPercent: 20,
        physicalMechanism_fr: 'Desserrage de boulon ou éclat métallique aspiré par la ventilation du rotor.',
        physicalMechanism_en: 'Loose fastener or metal debris pulled into airgap by rotor cooling airflow.'
      },
      {
        cause_fr: 'Défaut d\'isolement du câble de neutre ou du parafoudre neutre',
        cause_en: 'Neutral bus or surge arrester insulation breakdown',
        probabilityPercent: 10,
        physicalMechanism_fr: 'Humidité ou fissure sur l\'isolateur support de neutre.',
        physicalMechanism_en: 'Moisture accumulation or cracked standoff insulator on generator neutral cubicle.'
      }
    ],
    requiredFieldTests: [
      {
        testName_fr: 'Mesure de résistance d\'isolement et Indice de Polarisation (IP) stator',
        testName_en: 'Stator Insulation Resistance & Polarization Index (PI) Test',
        measuringInstrument: 'Mégohmmètre numérique 5 kV DC',
        governingStandard: 'IEEE 43 / IEC 60034-27-1',
        acceptanceThreshold_fr: 'R₁ min > 100 MΩ à 40 °C, Indice de Polarisation IP (R₁₀ min / R₁ min) > 2.0.',
        acceptanceThreshold_en: 'R₁ min > 100 MΩ at 40 °C, Polarization Index PI (R₁₀ min / R₁ min) > 2.0.',
        safetyRequirement_fr: 'Décharger l\'enroulement à la terre pendant au moins 4 fois la durée de test (minimum 40 minutes) pour éviter le rebond capacitif.',
        safetyRequirement_en: 'Discharge winding to ground for at least 4x the test duration (minimum 40 min) to bleed absorbed dielectric charge.'
      },
      {
        testName_fr: 'Localisation de défaut par injection basse tension (Méthode Murray ou TDR)',
        testName_en: 'Fault Pinpointing via Low-Voltage Impulse / TDR Reflectometry',
        measuringInstrument: 'Échomètre câble / Émetteur d\'impulsions TDR',
        governingStandard: 'IEEE 56',
        acceptanceThreshold_fr: 'Localisation exacte de l\'encoche défaillante avant dépose de barre.',
        acceptanceThreshold_en: 'Exact slot identification prior to pulling stator wedge and bar.',
        safetyRequirement_fr: 'Rotor bloqué mécaniquement avec frein de palier serré.',
        safetyRequirement_en: 'Mechanical rotor brake engaged to prevent rotation during inspection.'
      }
    ],
    protectionFunctions: [
      {
        ansiCode: '59N',
        functionName_fr: 'Surtension Homopolaire Neutre (95% du stator)',
        functionName_en: 'Neutral Overvoltage Ground Fault (95% stator coverage)',
        typicalTripTime: '0.2 – 0.5 s',
        relayAction_fr: 'Déclenchement du disjoncteur GCB, coupure de l\'excitation et fermeture vanne de turbine.',
        relayAction_en: 'Trips GCB, opens field excitation breaker and initiates emergency turbine shutdown.'
      },
      {
        ansiCode: '64G',
        functionName_fr: 'Terre Stator 100% (Injection sous-harmonique 20 Hz)',
        functionName_en: '100% Stator Ground Fault (20 Hz Sub-harmonic injection)',
        typicalTripTime: '0.5 – 1.0 s',
        relayAction_fr: 'Protège les 5% résiduels de l\'enroulement près du point neutre.',
        relayAction_en: 'Protects the remaining 5% of winding near the neutral point.'
      }
    ],
    lotoIsolationSteps: [
      {
        stepNumber: 1,
        action_fr: 'Consignation mécanique de la vanne papillon de pied de conduite forcée et verrouillage du vannage.',
        action_en: 'Mechanical lockout of penstock guard valve and hydraulic wicket gate servomotor locking pins.',
        verificationMethod_fr: 'Insertion des broches de verrouillage mécanique et cadenas.',
        verificationMethod_en: 'Insert mechanical lock pins and apply authorized padlocks.'
      },
      {
        stepNumber: 2,
        action_fr: 'Ouverture et débrochage du disjoncteur d\'alternateur (GCB) et du disjoncteur d\'excitation.',
        action_en: 'Open and rack-out generator circuit breaker (GCB) and field discharge breaker.',
        verificationMethod_fr: 'Vérification visuelle des broches de sectionnement du GCB.',
        verificationMethod_en: 'Visual confirmation of racked-out GCB cluster disconnects.'
      },
      {
        stepNumber: 3,
        action_fr: 'Pose des terres mobiles en tête d\'alternateur et au neutre.',
        action_en: 'Apply portable grounding sets on generator line terminals and neutral cubicle.',
        verificationMethod_fr: 'VAT négative sur barres blindées phase U, V, W.',
        verificationMethod_en: 'Negative VAT check on phase busbars U, V, W.'
      }
    ],
    escalationProtocol_fr: 'Information immédiate de la direction de la centrale hydroélectrique. Interdiction de redémarrage. Visite interne stator obligatoire avec inspection boroscopique.',
    escalationProtocol_en: 'Immediate report to Plant Operations Manager. Restart lockout. Mandatory rotor/stator borescope visual inspection.',
    provisionalRemedy_fr: 'Isolement temporaire de la barre Roebel défaillante si le constructeur autorise un fonctionnement avec une encoche shuntée (déclassement puissance 5%).',
    provisionalRemedy_en: 'Temporary jumper bypassing damaged Roebel bar if OEM certifies operating with one bypassed coil (5% power derating).',
    definitiveRepair_fr: 'Extraction de la barre Roebel par chaufferette inductive, remplacement de l\'isolant d\'encoche et nouveau calage avec clinquants semi-conducteurs.',
    definitiveRepair_en: 'Defective Roebel bar extraction, slot insulation replacement and re-wedging with semi-conductive side packing.',
    cameroonContextNotes: {
      fr: 'À la centrale de Songloulou (8 groupes de 48 MW), les groupes G1 à G4 ayant plus de 35 ans d\'exploitation font l\'objet d\'une surveillance accrue de l\'indice de polarisation statorique.',
      en: 'At Songloulou plant (8 units of 48 MW), older units G1-G4 operating over 35 years undergo stringent Polarization Index monitoring.'
    }
  },

  // CASE 5: THERMAL HOTSPOT ON 225 KV TRANSMISSION LINE CLAMP
  {
    id: 'case-line-hotspot-225kv',
    category: 'THERMAL_INFRARED',
    urgency: 'CRITICAL_24H',
    trustLevel: 'FIELD_PRACTICE',
    targetEquipmentFamilies: ['transmission_line', 'substation_bay', 'conductor'],
    symptomTitle_fr: 'Échauffement anormal (ΔT > 40 °C) sur raccord ou pince d\'amarrage 225 kV',
    symptomTitle_en: 'Severe thermal hotspot (ΔT > 40 °C) on 225 kV transmission line clamp / splice',
    observableIndicators_fr: [
      'Image thermographique infrarouge montrant une température ponctuelle > 110 °C sous charge nominale',
      'Décoloration thermique visible du métal ou traces de calamine',
      'Effet de scintillation ou d\'effluve lumineuse visible à la caméra ultraviolette (corona)',
      'Gradient thermique entre conducteurs adjacents de la même phase ΔT > 40 °C'
    ],
    observableIndicators_en: [
      'Infrared thermogram showing localized hotspot > 110 °C under normal load',
      'Visible metal discoloration or oxidation scaling on connector barrel',
      'Corona glow or acoustic crackle detectable via UV / acoustic imager',
      'Phase-to-phase temperature differential ΔT > 40 °C'
    ],
    detectionTechnique_fr: 'Surveillance thermographique aéroportée par drone ou caméra infrarouge portative lors de la ronde au sol (ISO 18434-1).',
    detectionTechnique_en: 'Drone-mounted or ground patrol handheld radiometric thermal camera (ISO 18434-1).',
    probableRootCauses: [
      {
        cause_fr: 'Oxydation galvanique et desserrage des boulons sous vibrations éoliennes',
        cause_en: 'Galvanic oxidation and fastener relaxation from aeolian conductor vibration',
        probabilityPercent: 65,
        physicalMechanism_fr: 'Vibrations éoliennes non amorties ayant détendu le couple de serrage, induisant une résistance de contact $R_c$ qui dissipe $P = R_c I^2$.',
        physicalMechanism_en: 'Unmitigated aeolian vibration loosening bolt tension, escalating contact resistance $R_c$ and Joule losses $P = R_c I^2$.'
      },
      {
        cause_fr: 'Défaut de sertissage ou manque de pâte inhibitrice de corrosion (Contactal)',
        cause_en: 'Improper compression crimping or missing anti-oxidation paste',
        probabilityPercent: 25,
        physicalMechanism_fr: 'Absence de graisse neutre lors de la pose permettant à l\'alumine isolante $\\text{Al}_2\\text{O}_3$ de se reformer entre brins.',
        physicalMechanism_en: 'Lack of zinc-loaded inhibitor paste during line construction letting insulating aluminum oxide form between strands.'
      },
      {
        cause_fr: 'Rupture de brins d\'aluminium sous le manchon par fatigue mécanique',
        cause_en: 'Fatigue breakage of outer aluminum strands under the clamp',
        probabilityPercent: 10,
        physicalMechanism_fr: 'Concentration de contraintes en sortie de pince ayant rompu les brins conducteurs extérieurs.',
        physicalMechanism_en: 'Bending stress concentration at clamp mouth causing mechanical fatigue rupture of outer conductor strands.'
      }
    ],
    requiredFieldTests: [
      {
        testName_fr: 'Mesure de résistance de contact sous micro-ohmmètre de ligne',
        testName_en: 'Micro-ohmmeter Contact Resistance Test across Joint',
        measuringInstrument: 'Micro-ohmmètre haute intensité 100 A DC',
        governingStandard: 'IEC 61284 / CIGRE TB 426',
        acceptanceThreshold_fr: 'Résistance du manchon inférieure à la résistance d\'une même longueur de câble nu sain (ratio R_joint / R_cable < 1.0).',
        acceptanceThreshold_en: 'Splice resistance must be lower than an equivalent length of unbroken conductor (R_joint / R_cable < 1.0).',
        safetyRequirement_fr: 'Ligne consignée et mise à la terre des deux côtés de la travée.',
        safetyRequirement_en: 'De-energized line with grounding applied on both ends of span.'
      }
    ],
    protectionFunctions: [
      {
        ansiCode: '49L',
        functionName_fr: 'Protection Thermique de Ligne',
        functionName_en: 'Transmission Line Thermal Overload Protection',
        typicalTripTime: 'Temporisation thermique inverse',
        relayAction_fr: 'Alerte à 90% de la capacité thermique, délestage automatique à 110%.',
        relayAction_en: 'Alarm at 90% thermal capacity, trip at 110% to prevent conductor annealing.'
      }
    ],
    lotoIsolationSteps: [
      {
        stepNumber: 1,
        action_fr: 'Consignation de la ligne 225 kV aux deux postes d\'extrémité (ex. Songloulou et Bekoko).',
        action_en: 'De-energize 225 kV line at both terminal substations (e.g. Songloulou and Bekoko).',
        verificationMethod_fr: 'Vérification de position ouverte et verrouillage cadenas aux deux extrémités.',
        verificationMethod_en: 'Verify open status and exchange cross-substation safety tokens.'
      },
      {
        stepNumber: 2,
        action_fr: 'Mise à la terre aux postes et pose de terres de travail encadrant le pylône d\'intervention.',
        action_en: 'Close substation line earth switches and apply portable safety grounds on adjacent towers.',
        verificationMethod_fr: 'Élimination des tensions induites par les lignes parallèles sous tension.',
        verificationMethod_en: 'Discharge capacitive and electrostatic induction from parallel energized circuits.'
      }
    ],
    escalationProtocol_fr: 'Si ΔT > 40 °C, intervention sous 24h obligatoire. Risque de fusion du conducteur et de rupture de portée (chute au sol).',
    escalationProtocol_en: 'If ΔT > 40 °C, emergency repair within 24h mandatory. Failure to intervene risks conductor annealing and catastrophic drop.',
    provisionalRemedy_fr: 'Réduction immédiate du transit de puissance sur la ligne par réajustement du dispatching SONATREL.',
    provisionalRemedy_en: 'Immediately throttle power flow over the corridor via SONATREL generation redispatch.',
    definitiveRepair_fr: 'Remplacement de la pince d\'amarrage, brossage des brins sous pâte inhibitrice et serrage au couple dynamométrique prescrit.',
    definitiveRepair_en: 'Cut out damaged splice, wire brush strands under inhibitor paste and install full-tension compression sleeve.',
    cameroonContextNotes: {
      fr: 'Sur le corridor Songloulou – Bekoko 225 kV traversant les zones forestières humides du Littoral, la corrosion galvanique des manchons est accélérée.',
      en: 'On the 225 kV Songloulou – Bekoko corridor through humid Littoral forests, galvanic clamp corrosion is significantly accelerated.'
    }
  }
];
