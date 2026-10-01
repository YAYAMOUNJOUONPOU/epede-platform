// src/components/distribution/data/distributionScenariosData.ts
// EPEDE D05 - Distribution Network Fault, Isolation & Restoration Scenarios Data

export interface ScenarioStep {
  stepNumber: number;
  timeLabel: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  system_state_fr: string;
  system_state_en: string;
  affected_customers: number;
  outage_percent: number;
  highlighted_nodes: string[];
}

export interface DistributionFaultScenario {
  id: 'SCENARIO_TRANSIENT_OVERHEAD' | 'SCENARIO_UNDERGROUND_RING' | 'SCENARIO_TRANSFORMER_FAULT' | 'SCENARIO_LV_FEEDER_FAULT';
  code: string;
  title_fr: string;
  title_en: string;
  category: 'OVERHEAD' | 'UNDERGROUND' | 'SUBSTATION' | 'LOW_VOLTAGE';
  root_cause_fr: string;
  root_cause_en: string;
  initial_state_fr: string;
  initial_state_en: string;
  final_outcome_fr: string;
  final_outcome_en: string;
  protection_involved: string[];
  standards_reference: string;
  steps: ScenarioStep[];
}

export const DISTRIBUTION_SCENARIOS: DistributionFaultScenario[] = [
  {
    id: 'SCENARIO_TRANSIENT_OVERHEAD',
    code: 'SCEN-01-FUGITIF-AERIEN',
    title_fr: 'Défaut Fugitif Aérien & Cycle Réenclencheur (ANSI 79)',
    title_en: 'Transient Overhead Fault & Auto-Reclosing Cycle (ANSI 79)',
    category: 'OVERHEAD',
    root_cause_fr: 'Coup de foudre induit ou branche d\'arbre touchant momentanément deux conducteurs sous l\'effet du vent.',
    root_cause_en: 'Induced lightning surge or momentary tree branch contact caused by high wind gusts across bare overhead spans.',
    initial_state_fr: 'Ligne 30 kV en régime normal alimentant 3 villages (450 foyers et un forage d\'eau).',
    initial_state_en: '30 kV feeder operating under nominal load supplying 3 villages (450 customers and agricultural water pumps).',
    final_outcome_fr: 'Élimination du défaut transitoire en 800 ms sans coupure durable (SAIDI non impacté, seulement micro-coupure).',
    final_outcome_en: 'Transient fault extinguished in 800 ms with complete supply restoration (zero SAIDI impact, momentary interruption only).',
    protection_involved: ['ANSI 50 (Instantaneous Overcurrent)', 'ANSI 79 (Auto-Reclose Controller)', 'ZnO Surge Arresters'],
    standards_reference: 'IEC 62271-111 / IEEE C37.60',
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T = 0 ms',
        title_fr: 'Amorçage de l\'Arc Électrique',
        title_en: 'Electric Arc Ignition',
        description_fr: 'La branche crée un court-circuit biphasé. Le courant de court-circuit grimpe instantanément à 3400 A.',
        description_en: 'The tree branch initiates a phase-to-phase flashover. Fault current spikes instantaneously to 3400 A.',
        system_state_fr: 'DÉFAUT EN COURS : Forte chute de tension globale sur l\'artère 30 kV.',
        system_state_en: 'ACTIVE FAULT: Severe global voltage sag across the 30 kV feeder.',
        affected_customers: 450,
        outage_percent: 100,
        highlighted_nodes: ['rad-line2']
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 45 ms',
        title_fr: 'Déclenchement Instantané du Réenclencheur',
        title_en: 'Instantaneous Recloser Tripping',
        description_fr: 'L\'actionneur magnétique du réenclencheur sépare les contacts sous vide. L\'arc électrique s\'éteint.',
        description_en: 'The recloser magnetic actuator parts vacuum contacts. The arc is quenched at current zero crossing.',
        system_state_fr: 'LIGNE HORS TENSION : Début du temps mort de déionisation de l\'arc (300 ms).',
        system_state_en: 'FEEDER DE-ENERGIZED: Beginning of de-ionizing dead time pause (300 ms).',
        affected_customers: 450,
        outage_percent: 100,
        highlighted_nodes: ['rad-cb']
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 345 ms',
        title_fr: 'Premier Réenclenchement Rapide (Fast Shot)',
        title_en: 'First High-Speed Auto-Reclose Shot',
        description_fr: 'La branche est tombée au sol brûlée par l\'arc. Le réenclencheur se referme automatiquement sous tension.',
        description_en: 'The branch has been vaporized/blown clear by the arc. The recloser automatically recloses onto the feeder.',
        system_state_fr: 'RÉSEAU SAIN : Le courant mesuré redevient le courant de charge nominal (In = 48 A).',
        system_state_en: 'FEEDER HEALTHY: Monitored current returns to nominal steady-state load (In = 48 A).',
        affected_customers: 0,
        outage_percent: 0,
        highlighted_nodes: ['rad-cb', 'rad-line1', 'rad-sub1', 'rad-line2', 'rad-sub2']
      },
      {
        stepNumber: 4,
        timeLabel: 'T + 60 s',
        title_fr: 'Réinitialisation du Compteur de Cycles',
        title_en: 'Cycle Counter Reset to Rest State',
        description_fr: 'La minuterie de confirmation arrive à terme. Le réenclencheur réarme sa réserve de manœuvre complète.',
        description_en: 'The confirmation timer expires successfully. The recloser resets its sequence counter to ready status.',
        system_state_fr: 'SERVICE TOTALEMENT NORMALISÉ : Événement consigné dans le journal d\'événements (SOE).',
        system_state_en: 'FULLY NORMAL OPERATION: Disturbance logged into sequence-of-events memory (SOE).',
        affected_customers: 0,
        outage_percent: 0,
        highlighted_nodes: ['rad-source', 'rad-cb', 'rad-sub1', 'rad-sub2', 'rad-sub3']
      }
    ]
  },
  {
    id: 'SCENARIO_UNDERGROUND_RING',
    code: 'SCEN-02-BOUCLE-SOUTERRAINE',
    title_fr: 'Défaut Câble Permanent & Reconfiguration Boucle Ouverte (FLISR)',
    title_en: 'Permanent Cable Fault & Open-Ring Restoration (FLISR)',
    category: 'UNDERGROUND',
    root_cause_fr: 'Perforation mécanique d\'un câble souterrain 30 kV par une pelleteuse de chantier de voirie urbaine.',
    root_cause_en: 'Mechanical puncture of a 30 kV XLPE underground feeder cable by third-party civil excavation backhoe.',
    initial_state_fr: 'Boucle urbaine de 4 postes kiosques (1640 clients) alimentée par deux postes sources avec NOP ouvert.',
    initial_state_en: 'Urban loop of 4 compact kiosks (1640 customers) fed from two primary substations with central NOP open.',
    final_outcome_fr: 'Isolement du câble détruit et réalimentation de 100% des clients en moins de 45 secondes via fermeture du NOP.',
    final_outcome_en: 'Faulted cable section isolated and 100% customer supply restored in < 45 seconds by closing the NOP.',
    protection_involved: ['ANSI 50/51/67N (Feeder Overcurrent)', 'Fault Passage Indicators (FPI)', 'SCADA Automated FLISR Loop'],
    standards_reference: 'IEC 62271-200 / IEEE Std 1366',
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T = 0.0 s',
        title_fr: 'Court-Circuit Câble & Déclenchement QA',
        title_en: 'Cable Bolted Fault & QA Feeder Trip',
        description_fr: 'Le court-circuit entre phase et écran métallique fait déclencher le disjoncteur QA au poste source A.',
        description_en: 'Phase-to-screen short-circuit triggers instantaneous overcurrent trip of feeder breaker QA at Substation A.',
        system_state_fr: 'PERTE DE SOURCE DEMI-BOUCLE A : Les postes Kiosques A1 et A2 sont totalement privés de tension.',
        system_state_en: 'HALF-LOOP OUTAGE: Kiosks A1 and A2 lose all medium-voltage incoming supply.',
        affected_customers: 840,
        outage_percent: 51,
        highlighted_nodes: ['ring-rmu1', 'ring-rmu2']
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 3.2 s',
        title_fr: 'Télédétection du Défaut par les Indicateurs DPD',
        title_en: 'Fault Passage Indication (FPI) Telemetry',
        description_fr: 'Le DPD du poste A1 a vu passer le courant de défaut, mais pas le DPD du poste A2. Le défaut est entre A1 et A2.',
        description_en: 'FPI at Kiosk A1 flagged fault current; FPI at Kiosk A2 remained clear. Fault is located strictly between A1 and A2.',
        system_state_fr: 'LOCALISATION EFFECTUÉE : Segment de câble A1-A2 identifié en avarie par l\'algorithme FLISR.',
        system_state_en: 'FAULT PINPOINTED: Cable link A1-A2 identified as faulted by SCADA FLISR automation.',
        affected_customers: 840,
        outage_percent: 51,
        highlighted_nodes: ['ring-rmu1', 'ring-rmu2']
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 12.0 s',
        title_fr: 'Télé-Ouverture des Interrupteurs d\'Isolement',
        title_en: 'Remote Sectionalizing Switch Opening',
        description_fr: 'Le SCADA commande l\'ouverture motorisée de l\'interrupteur départ de A1 et de l\'interrupteur arrivée de A2.',
        description_en: 'SCADA motor drives open the outgoing switch of Kiosk A1 and the incoming switch of Kiosk A2.',
        system_state_fr: 'CÂBLE ISOLE : Le tronçon avarié est complètement déconnecté du reste de la boucle.',
        system_state_en: 'CABLE PHYSICALLY ISOLATED: Damaged cable section severed from both loop sides.',
        affected_customers: 840,
        outage_percent: 51,
        highlighted_nodes: ['ring-rmu1', 'ring-rmu2']
      },
      {
        stepNumber: 4,
        timeLabel: 'T + 22.0 s',
        title_fr: 'Réenclenchement de QA & Réalimentation de A1',
        title_en: 'Reclosing QA & Restoring Kiosk A1',
        description_fr: 'Le disjoncteur QA est refermé avec succès. Le poste A1 (Mairie, 480 clients) est immédiatement réalimenté.',
        description_en: 'Feeder breaker QA is reclosed successfully. Kiosk A1 (City Hall, 480 customers) is fully restored.',
        system_state_fr: 'POSTE A1 RÉALIMENTÉ : Le poste A2 reste temporairement en attente d\'alimentation inverse.',
        system_state_en: 'KIOSK A1 RESTORED: Kiosk A2 temporarily awaiting back-feed connection.',
        affected_customers: 360,
        outage_percent: 22,
        highlighted_nodes: ['ring-rmu1']
      },
      {
        stepNumber: 5,
        timeLabel: 'T + 38.0 s',
        title_fr: 'Fermeture du Point d\'Ouverture Normal (NOP)',
        title_en: 'Closing the Normally Open Point (NOP)',
        description_fr: 'L\'interrupteur NOP est fermé sous télécommande. L\'énergie du Poste Source B réalimente le poste A2 par l\'aval.',
        description_en: 'The motorized NOP switch closes. Power from Substation B flows in reverse into Kiosk A2.',
        system_state_fr: '100% DES CLIENTS RÉALIMENTÉS : Restauration intégrale accomplie en moins de 40 secondes.',
        system_state_en: '100% CUSTOMERS RESTORED: Complete service recovery achieved in under 40 seconds.',
        affected_customers: 0,
        outage_percent: 0,
        highlighted_nodes: ['ring-src-a', 'ring-rmu1', 'ring-nop', 'ring-rmu2', 'ring-rmu3', 'ring-rmu4', 'ring-src-b']
      }
    ]
  },
  {
    id: 'SCENARIO_TRANSFORMER_FAULT',
    code: 'SCEN-03-DEFAUT-TRANSFO',
    title_fr: 'Défaut Interne Transformateur MT/BT & Déclenchement DGPT2',
    title_en: 'Internal Distribution Transformer Fault & DGPT2 Tripping',
    category: 'SUBSTATION',
    root_cause_fr: 'Claquant diélectrique entre spires de l\'enroulement moyenne tension 30 kV consécutif à une surtension de manœuvre.',
    root_cause_en: 'Dielectric turn-to-turn flashover on 30 kV primary winding caused by combined thermal aging and switching transients.',
    initial_state_fr: 'Transformateur 630 kVA alimentant un quartier commercial et résidentiel (320 clients).',
    initial_state_en: '630 kVA transformer supplying a dense commercial and residential district (320 customers).',
    final_outcome_fr: 'Coupure sélective du seul transformateur sans perturber la boucle MT ; déploiement groupe électrogène de secours.',
    final_outcome_en: 'Selective disconnection of the faulty transformer without disturbing the MV loop; emergency genset tie-in.',
    protection_involved: ['DGPT2 Relay (Gas / Pressure / Temp)', 'RMU Switch-Fuse Combined Striker', 'LV Main Breaker'],
    standards_reference: 'IEC 60076 / EN 50588-1',
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T = 0 ms',
        title_fr: 'Court-Circuit Inter-Spires & Dégagement Gazeux',
        title_en: 'Turn-to-Turn Short & Oil Decomposition',
        description_fr: 'L\'arc immergé vaporise instantanément l\'huile minérale, produisant une montée brutale de pression et des gaz (H2, C2H2).',
        description_en: 'The submerged arc vaporizes mineral oil, generating severe gas volume (H2, C2H2) and a sharp pressure wavefront.',
        system_state_fr: 'SURPRESSION CUVE : Risque de rupture mécanique de la cuve sans action immédiate.',
        system_state_en: 'TANK OVERPRESSURE: Risk of corrugated tank rupture without sub-cycle relief.',
        affected_customers: 320,
        outage_percent: 100,
        highlighted_nodes: ['rad-sub2']
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 18 ms',
        title_fr: 'Action du Relais DGPT2 & Percuteur Fusibles',
        title_en: 'DGPT2 Pressure Switch & Fuse Striker Trip',
        description_fr: 'Le pressostat du relais DGPT2 actionne la bobine de déclenchement du combiné RMU ; les fusibles HPC fondent.',
        description_en: 'The DGPT2 pressure switch energizes the RMU trip coil; the high-speed striker fuses blow concurrently.',
        system_state_fr: 'TRANSFORMATEUR ISOLÉ DE LA MT : La boucle moyenne tension 30 kV reste totalement saine et fermée.',
        system_state_en: 'TRANSFORMER ISOLATED: The 30 kV ring backbone remains energized and undisturbed.',
        affected_customers: 320,
        outage_percent: 100,
        highlighted_nodes: ['rad-sub2']
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 2.5 h',
        title_fr: 'Raccordement d\'un Groupe Électrogène Mobile BT',
        title_en: 'Mobile Emergency Diesel Generator Tie-In',
        description_fr: 'Une équipe d\'astreinte raccorde un groupe électrogène mobile 500 kVA directement sur le jeu de barres du tableau TUR.',
        description_en: 'Utility emergency response team connects a 500 kVA trailer-mounted diesel generator directly to the TUR busbars.',
        system_state_fr: 'CLIENTS SECOURUS : Rétablissement de l\'alimentation BT pendant le remplacement du transformateur avarié.',
        system_state_en: 'CUSTOMERS RESTORED ON GENSET: Full LV restoration during factory transformer swap-out.',
        affected_customers: 0,
        outage_percent: 0,
        highlighted_nodes: ['rad-sub2']
      }
    ]
  },
  {
    id: 'SCENARIO_LV_FEEDER_FAULT',
    code: 'SCEN-04-DEFAUT-DEPART-BT',
    title_fr: 'Court-Circuit Départ BT & Sélectivité Totale par Fusible HPC',
    title_en: 'Low-Voltage Feeder Short-Circuit & Total Fuse Selectivity',
    category: 'LOW_VOLTAGE',
    root_cause_fr: 'Écrasement d\'un câble basse tension souterrain 400 V lors de travaux de pose de fibre optique en trottoir.',
    root_cause_en: 'Severe mechanical pinching and phase bridging of a 400 V underground cable during fiber-optic trenching works.',
    initial_state_fr: 'Poste kiosque 630 kVA alimentant 5 départs BT distincts (chacun desservant une rue, total 280 foyers).',
    initial_state_en: '630 kVA kiosk supplying 5 distinct radial LV street feeders (total 280 homes, 56 per feeder).',
    final_outcome_fr: 'Fusion instantanée du fusible NH2 de la seule rue sinistrée ; les 4 autres rues restent 100% sous tension.',
    final_outcome_en: 'Instantaneous blowing of NH2 blade fuse on the impacted street; adjacent 4 streets remain fully energized.',
    protection_involved: ['HRC Blade Fuses NH2 gG (250 A)', 'Upstream MV Fuses (Selectivity Margin > 1.6)', 'Disjoncteurs d\'abonnés AGCP'],
    standards_reference: 'IEC 60269 / IEC 61439-5',
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T = 0 ms',
        title_fr: 'Court-Circuit Triphasé Franc sur Câble de Rue',
        title_en: 'Bolted Three-Phase Short-Circuit on Street Main',
        description_fr: 'La trancheuse perfore les 3 phases du câble 4x150 mm² Al. Le courant de court-circuit atteint 12 500 A.',
        description_en: 'The trencher teeth breach all 3 phase conductors. Fault current explodes to 12 500 A peak.',
        system_state_fr: 'DÉFAUT MAJEUR BT : Appel de courant massif limité uniquement par l\'impédance amont du transformateur.',
        system_state_en: 'MAJOR LV FAULT: Massive surge current constrained only by transformer and cable impedance.',
        affected_customers: 56,
        outage_percent: 20,
        highlighted_nodes: ['rad-sub2']
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 4 ms',
        title_fr: 'Fusion de la Lame d\'Argent du Fusible NH2 (Tableau TUR)',
        title_en: 'NH2 Silver Element Rupture (TUR Board)',
        description_fr: 'La lame calibrée du fusible gG fond sous l\'effet Joule ; l\'arc est étouffé par le sable de silice purifié.',
        description_en: 'The calibrated silver ribbon of the gG fuse melts; the arc is quenched and absorbed by purified quartz silica sand.',
        system_state_fr: 'CIRCUIT COUPÉ EN 4 MS : Aucune répercussion sur le fusible MT amont ni sur les 4 autres départs du quartier.',
        system_state_en: 'CLEARED IN 4 MS: Zero sympathetic tripping on upstream MV fuses or adjacent 4 street feeders.',
        affected_customers: 56,
        outage_percent: 20,
        highlighted_nodes: ['rad-sub2']
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 1.2 h',
        title_fr: 'Jonctionnement Réparation & Remplacement Fusible',
        title_en: 'Cable Repair Jointing & Fuse Replacement',
        description_fr: 'Pose d\'une boîte de jonction coulée en résine rétractable et remplacement du fusible NH2 à la poignée isolante.',
        description_en: 'Installation of a heat-shrink resin cable joint and re-insertion of a fresh NH2 fuse using insulated handle.',
        system_state_fr: 'RÉTABLISSEMENT TOTAL DU SERVICE : Tension rétablie à 230 V sur toute la rue.',
        system_state_en: 'COMPLETE RESTORATION: Nominal 230 V restored across all 56 residences.',
        affected_customers: 0,
        outage_percent: 0,
        highlighted_nodes: ['rad-sub2']
      }
    ]
  }
];
