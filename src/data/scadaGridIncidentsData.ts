// src/data/scadaGridIncidentsData.ts
// EPEDE - Master Dataset for Dynamic SCADA Incidents & Sequence of Events (SOE)
// Grounded in IEC 60870-5-104, IEEE C37.118 (Synchrophasors), and Cameroon National Transmission Grid Code (SONATREL).

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'WARNING';

export interface SoeEventLog {
  offsetMs: number;
  sourceIed: string;
  ansiCode?: string;
  message_fr: string;
  message_en: string;
  telemetrySnapshot: {
    freqHz: number;
    voltageKv: number;
    activePowerMw: number;
    reactivePowerMvar: number;
  };
  alarmState: 'NORMAL' | 'ALARM' | 'TRIP' | 'RESTORED';
}

export interface ScadaGridIncident {
  id: string;
  title_fr: string;
  title_en: string;
  location_fr: string;
  location_en: string;
  substationTag: string;
  severity: IncidentSeverity;
  initialDisturbance_fr: string;
  initialDisturbance_en: string;
  physicsExplanation_fr: string;
  physicsExplanation_en: string;
  governingStandards: string[];
  involvedProtections: string[];
  eventsTimeline: SoeEventLog[];
  restorationAction_fr: string;
  restorationAction_en: string;
}

export const SCADA_GRID_INCIDENTS: ScadaGridIncident[] = [
  {
    id: 'TRIP_SONGLOULOU_60MW',
    title_fr: 'Déclenchement Brutal Groupe G4 Songloulou (60 MW)',
    title_en: 'Sudden Loss of Songloulou Hydro Unit G4 (60 MW)',
    location_fr: 'Centrale Hydroélectrique de Songloulou (384 MW - Sanaga)',
    location_en: 'Songloulou Hydroelectric Power Station (384 MW)',
    substationTag: 'HPP-SONG-225',
    severity: 'CRITICAL',
    initialDisturbance_fr: 'Déclenchement du groupe G4 de 60 MW par la protection différentielle stator 87G suite à un amorçage interne.',
    initialDisturbance_en: 'Tripping of 60 MW turbine-generator G4 by 87G stator differential protection following winding flashover.',
    physicsExplanation_fr: 'Le déficit instantané de production (-60 MW) rompt l\'équilibre P-f. L\'énergie cinétique stockée dans les rotors de l\'ensemble des alternateurs connectés au RIS ralentit, provoquant une chute brutale de fréquence (ROCOF df/dt = -0.38 Hz/s) jusqu\'à 49.25 Hz. Mobilisation automatique de la réserve primaire (FCR) puis secondaire (aFRR).',
    physicsExplanation_en: 'Instantaneous generation deficit (-60 MW) breaks P-f power balance. Rotational kinetic inertia decelerates causing severe frequency drop (ROCOF df/dt = -0.38 Hz/s) down to 49.25 Hz. Automatic deployment of Primary Frequency Containment Reserve (FCR) followed by secondary regulation.',
    governingStandards: ['IEC 60870-5-104', 'IEEE C37.118.1', 'SONATREL Grid Code Cl. 14'],
    involvedProtections: ['ANSI 87G (Différentielle Alternateur)', 'ANSI 81R (ROCOF)', 'ANSI 81U (Sous-fréquence)'],
    restorationAction_fr: 'Montée en puissance automatique des groupes de Nachtigal (+40 MW) et démarrage des turbines thermiques de Logbaba.',
    restorationAction_en: 'Automatic power ramp on Nachtigal hydro units (+40 MW) and startup of Logbaba thermal gas engines.',
    eventsTimeline: [
      {
        offsetMs: 0,
        sourceIed: 'IED-SONG-G4-87G',
        ansiCode: 'ANSI 87G',
        message_fr: 'DÉCLENCHEMENT DIFFÉRENTIEL STATOR G4 (Idiff = 4.2 In) - Commande d\'ouverture disjoncteur groupe',
        message_en: 'G4 STATOR DIFFERENTIAL TRIP (Idiff = 4.2 In) - Generator breaker trip initiated',
        telemetrySnapshot: { freqHz: 50.005, voltageKv: 225.10, activePowerMw: 1480.0, reactivePowerMvar: 310.0 },
        alarmState: 'TRIP'
      },
      {
        offsetMs: 65,
        sourceIed: 'CB-SONG-G4',
        message_fr: 'Disjoncteur Groupe G4 OUVERT - Déconnexion réseau 60 MW',
        message_en: 'Generator Circuit Breaker G4 OPEN - 60 MW disconnected from grid',
        telemetrySnapshot: { freqHz: 49.880, voltageKv: 224.60, activePowerMw: 1420.0, reactivePowerMvar: 295.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 350,
        sourceIed: 'RTU-BEKOKO-PMU',
        ansiCode: 'ANSI 81R',
        message_fr: 'Seuil ROCOF franchi : df/dt = -0.38 Hz/s mesuré au poste de Bekoko',
        message_en: 'ROCOF threshold exceeded: df/dt = -0.38 Hz/s recorded at Bekoko substation',
        telemetrySnapshot: { freqHz: 49.520, voltageKv: 223.80, activePowerMw: 1420.5, reactivePowerMvar: 320.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 1200,
        sourceIed: 'DISPATCHING-CCR-MANGOMBE',
        message_fr: 'Fréquence Nadir atteinte à 49.250 Hz - Début de réponse inertielle et réglage primaire',
        message_en: 'Frequency Nadir reached at 49.250 Hz - Primary inertial and governor response mobilizing',
        telemetrySnapshot: { freqHz: 49.250, voltageKv: 222.90, activePowerMw: 1435.0, reactivePowerMvar: 345.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 3500,
        sourceIed: 'GOV-NACHT-G1..G7',
        message_fr: 'Régulateurs de vitesse Nachtigal : ouverture vannage Francis (+35 MW mobilisés)',
        message_en: 'Nachtigal turbine governors: opening Francis guide vanes (+35 MW mobilized)',
        telemetrySnapshot: { freqHz: 49.680, voltageKv: 224.20, activePowerMw: 1465.0, reactivePowerMvar: 325.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 8000,
        sourceIed: 'SCADA-EMS-SONATREL',
        message_fr: 'Réseau stabilisé à 49.950 Hz - Réserve secondaire activée, fin d\'incident critique',
        message_en: 'Grid stabilized at 49.950 Hz - Secondary reserve active, critical disturbance cleared',
        telemetrySnapshot: { freqHz: 49.950, voltageKv: 225.20, activePowerMw: 1481.0, reactivePowerMvar: 312.0 },
        alarmState: 'RESTORED'
      }
    ]
  },
  {
    id: 'FAULT_LINE_225KV_BEKOKO',
    title_fr: 'Court-Circuit Triphasé Ligne 225 kV Mangombé - Bekoko',
    title_en: '3-Phase Bus Fault on 225 kV Mangombe - Bekoko Line',
    location_fr: 'Ligne 225 kV L21 Mangombé - Bekoko (Corridor Sud RIS)',
    location_en: '225 kV Line L21 Mangombe - Bekoko',
    substationTag: 'LINE-MAN-BEK-225',
    severity: 'CRITICAL',
    initialDisturbance_fr: 'Coup de foudre direct sur portée sans câble de garde provoquant un contournement d\'isolateur triphasé franc à 28 km de Bekoko.',
    initialDisturbance_en: 'Direct lightning strike on unshielded span causing 3-phase insulator flashover at 28 km from Bekoko.',
    physicsExplanation_fr: 'Effondrement de la tension U_bus à 68 kV sur l\'ensemble du nœud de Bekoko. Appel de courant de court-circuit triphasé Ik3 = 19.8 kA. Détection instantanée par relais de protection de distance numérique 21 en Zone 1 (temps de déclenchement 38 ms) et télé-action POTT par fibre OPGW.',
    physicsExplanation_en: 'Bus voltage collapse down to 68 kV across Bekoko node. Massive short-circuit current surge Ik3 = 19.8 kA. Sub-cycle detection by numerical distance protection 21 in Zone 1 (38 ms trip) with POTT teleprotection over OPGW fiber.',
    governingStandards: ['IEC 60255-121', 'IEC 60870-5-104', 'IEC 61850-9-2'],
    involvedProtections: ['ANSI 21 (Distance Zone 1)', 'ANSI 50/51 (Surintensité instantanée)', 'ANSI 79 (Réenclencheur automatique mono/tri)'],
    restorationAction_fr: 'Cycle de réenclenchement monophasé automatique réussi en 1.2s après désionisation de l\'arc.',
    restorationAction_en: 'Single-pole auto-reclosure cycle successfully re-energizes line at 1.2s following arc deionization.',
    eventsTimeline: [
      {
        offsetMs: 0,
        sourceIed: 'IED-BEKOKO-LINE-21',
        ansiCode: 'ANSI 21',
        message_fr: 'DÉFAUT TRIPHASÉ FRANC EN ZONE 1 (X = 3.4 Ω, d = 28.2 km) - Ordre de déclenchement disjoncteur L21',
        message_en: 'SOLID 3-PHASE FAULT ZONE 1 (X = 3.4 ohms, d = 28.2 km) - Breaker trip order initiated',
        telemetrySnapshot: { freqHz: 49.990, voltageKv: 68.40, activePowerMw: 920.0, reactivePowerMvar: 820.0 },
        alarmState: 'TRIP'
      },
      {
        offsetMs: 42,
        sourceIed: 'CB-BEK-L21',
        message_fr: 'Pôles A, B, C disjoncteur 225 kV Bekoko OUVERTS (Temps de coupure : 42 ms) - Extinction de l\'arc SF₆',
        message_en: 'Poles A, B, C of 225 kV breaker Bekoko OPEN (Clearance time: 42 ms) - SF₆ arc extinguished',
        telemetrySnapshot: { freqHz: 49.970, voltageKv: 218.00, activePowerMw: 1150.0, reactivePowerMvar: 410.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 80,
        sourceIed: 'TELEPROT-OPGW',
        message_fr: 'Signal de déclenchement direct (DTT) reçu à Mangombé via fibre optique OPGW - Déclenchement côté source',
        message_en: 'Direct Transfer Trip (DTT) received at Mangombe via OPGW fiber - Infeed breaker opened',
        telemetrySnapshot: { freqHz: 49.960, voltageKv: 222.50, activePowerMw: 1220.0, reactivePowerMvar: 360.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 1200,
        sourceIed: 'IED-BEKOKO-79',
        ansiCode: 'ANSI 79',
        message_fr: 'Cycle de réenclenchement automatique 79 : Ordre d\'enclenchement - Ligne saine désionisée',
        message_en: 'Auto-reclosure 79 cycle: Close command sent - Deionized line confirmed healthy',
        telemetrySnapshot: { freqHz: 49.995, voltageKv: 224.80, activePowerMw: 1470.0, reactivePowerMvar: 315.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 1500,
        sourceIed: 'SCADA-EMS-SONATREL',
        message_fr: 'Ligne 225 kV L21 remise en service avec succès - Tensions et transits nominaux rétablis',
        message_en: '225 kV Line L21 fully re-energized - Nominal voltages and power transfer restored',
        telemetrySnapshot: { freqHz: 50.010, voltageKv: 225.40, activePowerMw: 1483.0, reactivePowerMvar: 312.0 },
        alarmState: 'RESTORED'
      }
    ]
  },
  {
    id: 'UFLS_LOAD_SHEDDING',
    title_fr: 'Délestage Fréquencemétrique Automatique d\'Urgence (UFLS Stade 1 & 2)',
    title_en: 'Automatic Under-Frequency Load Shedding (UFLS Stage 1 & 2)',
    location_fr: 'Ensemble des Postes Sources HTA Eneo (Douala & Yaoundé)',
    location_en: 'Primary MV Substations (Douala & Yaoundé)',
    substationTag: 'SYS-UFLS-GRID',
    severity: 'CRITICAL',
    initialDisturbance_fr: 'Effondrement rapide de fréquence sous 49.00 Hz suite à un cumul de déclenchements de lignes d\'évacuation.',
    initialDisturbance_en: 'Rapid frequency decay below 49.00 Hz following multi-line trip cascade on transmission corridors.',
    physicsExplanation_fr: 'Lorsque la fréquence franchit les seuils de sauvegarde du réseau national (49.00 Hz puis 48.80 Hz), les relais 81U de délestage automatique ordonnent l\'ouverture instantanée de départs HTA non prioritaires pour stopper l\'écroulement de fréquence et sauver le pays d\'un blackout généralisé.',
    physicsExplanation_en: 'When frequency crosses national grid defence plan thresholds (49.00 Hz and 48.80 Hz), numerical 81U relays immediately shed non-critical MV distribution feeders to halt frequency collapse and protect national system from total blackout.',
    governingStandards: ['IEC 60255-181', 'IEEE C37.106', 'SONATREL Plan de Défense Réseau'],
    involvedProtections: ['ANSI 81U Stade 1 (49.00 Hz)', 'ANSI 81U Stade 2 (48.80 Hz)', 'Automate Décentralisé UFLS'],
    restorationAction_fr: 'Réenclenchement manuel coordonné par tranches de 10 MW sous ordre du Dispatching National CCR Mangombé.',
    restorationAction_en: 'Coordinated stepped restoration in 10 MW blocks authorized by National Dispatch Center.',
    eventsTimeline: [
      {
        offsetMs: 0,
        sourceIed: 'SYS-FREQ-OBS',
        message_fr: 'ALERTE FRÉQUENCE CRITIQUE : f = 49.05 Hz en baisse rapide (-0.45 Hz/s)',
        message_en: 'CRITICAL FREQUENCY ALERT: f = 49.05 Hz dropping rapidly (-0.45 Hz/s)',
        telemetrySnapshot: { freqHz: 49.050, voltageKv: 221.00, activePowerMw: 1390.0, reactivePowerMvar: 360.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 120,
        sourceIed: 'UFLS-STADE-1',
        ansiCode: 'ANSI 81U',
        message_fr: 'SEUIL UFLS STADE 1 ATTEINT (49.00 Hz) : Déclenchement automatique de 45 MW départs HTA Douala',
        message_en: 'UFLS STAGE 1 REACHED (49.00 Hz): Automatic trip of 45 MW MV feeders in Douala',
        telemetrySnapshot: { freqHz: 48.980, voltageKv: 220.50, activePowerMw: 1345.0, reactivePowerMvar: 340.0 },
        alarmState: 'TRIP'
      },
      {
        offsetMs: 450,
        sourceIed: 'UFLS-STADE-2',
        ansiCode: 'ANSI 81U',
        message_fr: 'SEUIL UFLS STADE 2 ATTEINT (48.80 Hz) : Déclenchement automatique supplémentaire de 35 MW Yaoundé',
        message_en: 'UFLS STAGE 2 REACHED (48.80 Hz): Additional 35 MW MV feeders tripped in Yaounde',
        telemetrySnapshot: { freqHz: 48.800, voltageKv: 222.10, activePowerMw: 1310.0, reactivePowerMvar: 320.0 },
        alarmState: 'TRIP'
      },
      {
        offsetMs: 2500,
        sourceIed: 'RTU-EMS-GRID',
        message_fr: 'Chute de fréquence enrayée : Stabilisation et remontée au-dessus de 49.50 Hz',
        message_en: 'Frequency decay arrested: System stabilized and recovering above 49.50 Hz',
        telemetrySnapshot: { freqHz: 49.580, voltageKv: 224.50, activePowerMw: 1312.0, reactivePowerMvar: 305.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 6000,
        sourceIed: 'DISPATCHING-CCR',
        message_fr: 'Fréquence à 49.920 Hz - Blackout évité grâce au Plan de Défense. Préparation du réarmement des départs',
        message_en: 'Frequency at 49.920 Hz - System blackout averted. Re-energization sequence authorized',
        telemetrySnapshot: { freqHz: 49.920, voltageKv: 225.10, activePowerMw: 1315.0, reactivePowerMvar: 308.0 },
        alarmState: 'RESTORED'
      }
    ]
  },
  {
    id: 'ALUCAM_LOAD_REJECTION_150MW',
    title_fr: 'Rejet Brutal de Charge ALUCAM (150 MW - Surfréquence & Surtension)',
    title_en: 'ALUCAM 150 MW Load Rejection (Overfrequency & Overvoltage)',
    location_fr: 'Poste 90 kV d\'Édéa / Usine d\'Électrolyse ALUCAM',
    location_en: 'Edea 90 kV Substation / ALUCAM Smelter',
    substationTag: 'SUB-EDEA-ALUCAM',
    severity: 'HIGH',
    initialDisturbance_fr: 'Arrêt d\'urgence simultané des cuves d\'électrolyse ALUCAM déchargeant 150 MW en moins de 100 ms.',
    initialDisturbance_en: 'Emergency tripping of ALUCAM electrolysis potlines releasing 150 MW load in under 100 ms.',
    physicsExplanation_fr: 'L\'excédent massif d\'énergie de production fait accélérer tous les rotors hydroélectriques de Songloulou et Édéa. La fréquence grimpe à 50.85 Hz (Surfréquence 81O) et la tension grimpe à 242 kV par effet capacitif Ferranti résiduel. Déchargeurs et régulateurs de tension AVR (ANSI 90) appelés en butée minimale.',
    physicsExplanation_en: 'Sudden massive excess generation accelerates hydro rotors at Songloulou and Edea. Grid frequency spikes to 50.85 Hz (Overfrequency 81O) and bus voltage jumps to 242 kV via Ferranti capacitive rise. Fast AVR exciters (ANSI 90) driven to minimum.',
    governingStandards: ['IEC 60034-1', 'IEEE 421.5 (AVR)', 'IEC 60255-181'],
    involvedProtections: ['ANSI 81O (Surfréquence)', 'ANSI 59 (Surtension HTB)', 'Régulateurs AVR Alternateur'],
    restorationAction_fr: 'Fermeture d\'urgence des directrices des turbines de Songloulou et baisse de consigne de tension AVR.',
    restorationAction_en: 'Emergency guide vane closure on Songloulou turbines and AVR voltage reference stepdown.',
    eventsTimeline: [
      {
        offsetMs: 0,
        sourceIed: 'IED-ALUCAM-TRANS',
        message_fr: 'OUVERTURE DISJONCTEURS ALUCAM : Perte de charge industrielle instantanée de 150 MW',
        message_en: 'ALUCAM BREAKERS OPEN: Instantaneous 150 MW industrial load disconnection',
        telemetrySnapshot: { freqHz: 50.010, voltageKv: 225.20, activePowerMw: 1480.0, reactivePowerMvar: 310.0 },
        alarmState: 'TRIP'
      },
      {
        offsetMs: 80,
        sourceIed: 'AVR-SONG-ALL',
        ansiCode: 'ANSI 59',
        message_fr: 'SURTENSION DÉTECTÉE (U_bus = 241.8 kV) : Excitation alternateurs poussée en désexcitation maximale',
        message_en: 'OVERVOLTAGE DETECTED (U_bus = 241.8 kV): Alternator AVR exciters driven to negative ceiling',
        telemetrySnapshot: { freqHz: 50.350, voltageKv: 241.80, activePowerMw: 1330.0, reactivePowerMvar: 180.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 400,
        sourceIed: 'IED-GRID-81O',
        ansiCode: 'ANSI 81O',
        message_fr: 'SEUIL SURFRÉQUENCE ALERTE (f = 50.850 Hz) : Fermeture rapide des distributeurs hydrauliques',
        message_en: 'OVERFREQUENCY ALARM (f = 50.850 Hz): Fast closing of hydraulic turbine wickets',
        telemetrySnapshot: { freqHz: 50.850, voltageKv: 238.40, activePowerMw: 1332.0, reactivePowerMvar: 195.0 },
        alarmState: 'ALARM'
      },
      {
        offsetMs: 4000,
        sourceIed: 'SCADA-EMS-SONATREL',
        message_fr: 'Fréquence ramenée à 50.150 Hz et tension à 226.5 kV par le contrôle centralisé',
        message_en: 'Frequency restored to 50.150 Hz and voltage to 226.5 kV via AGC dispatch',
        telemetrySnapshot: { freqHz: 50.150, voltageKv: 226.50, activePowerMw: 1330.0, reactivePowerMvar: 280.0 },
        alarmState: 'RESTORED'
      }
    ]
  }
];
