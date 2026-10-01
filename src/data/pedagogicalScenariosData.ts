// src/data/pedagogicalScenariosData.ts
// EPEDE - 10 Pedagogical Physical Scenarios & Millisecond SOE Timeline Engine
// Implements Priority #4 (Scénarios pédagogiques avec timeline) & Priority #5 (Incident Replay SCADA)

export type ScenarioPhaseType =
  | 'HEALTHY_STATE'
  | 'INITIATING_EVENT'
  | 'TRANSIENT_FAULT'
  | 'SENSING_DETECTION'
  | 'TRIP_COMMAND'
  | 'ARC_EXTINCTION'
  | 'POST_FAULT'
  | 'NORMALIZATION';

export interface ScenarioPhase {
  id: string;
  phaseType: ScenarioPhaseType;
  timeMs: number;
  labelFr: string;
  labelEn: string;
  summaryFr: string;
  summaryEn: string;
  physicsDescriptionFr: string;
  physicsDescriptionEn: string;
  currentFactor: number; // multiplier of Inom (e.g. 1.0, 15.2, 0.0)
  voltageFactor: number; // multiplier of Unom (e.g. 1.0, 0.12, 1.0)
  frequencyHz: number;
  breakerState: 'CLOSED' | 'OPENING' | 'OPEN' | 'TRIPPED' | 'RECLOSING';
  activeAlarms: Array<{
    timestampMs: number;
    tag: string;
    source: string;
    messageFr: string;
    messageEn: string;
    severity: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'TRIP';
  }>;
}

export interface PedagogicalScenario {
  id: string;
  code: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  domainCode: string;
  primaryStandard: string;
  cameroonContextFr: string;
  cameroonContextEn: string;
  keyPhenomenonFr: string;
  keyPhenomenonEn: string;
  governingAnsiCodes: string[];
  totalDurationMs: number;
  phases: ScenarioPhase[];
  keyLessonsFr?: string[];
  keyLessonsEn?: string[];
  linkedSimulatorTab?: string;
  linkedEquipmentId?: string;
}

export const PEDAGOGICAL_SCENARIOS: PedagogicalScenario[] = [
  // ── Scénario 1: Court-circuit triphasé sur ligne 225 kV ──
  {
    id: 'scen-1-short-circuit-225kv',
    code: 'SCEN-01',
    titleFr: '1. Court-Circuit Triphasé Franc sur Ligne 225 kV',
    titleEn: '1. Bolted 3-Phase Short Circuit on 225 kV Line',
    subtitleFr: 'Défaut symétrique franc sur la ligne Mangombé - Bekoko avec déclenchement Distance 21 Zone 1',
    subtitleEn: 'Symmetrical dead fault on Mangombe - Bekoko 225 kV line with Zone 1 Distance 21 Trip',
    domainCode: 'D03',
    primaryStandard: 'CEI 60909 / CEI 60255-121',
    cameroonContextFr: 'Ligne 225 kV Mangombé - Bekoko (RIS), artère stratégique d’alimentation de la zone industrielle de Douala.',
    cameroonContextEn: 'Mangombe - Bekoko 225 kV corridor (Southern Interconnected Grid), crucial supply to Douala.',
    keyPhenomenonFr: 'Courant de court-circuit apériodique crête de 31.5 kA provoquant un effondrement quasi-total de la tension de ligne.',
    keyPhenomenonEn: 'Asymmetrical subtransient peak current of 31.5 kA inducing severe voltage collapse across the line.',
    governingAnsiCodes: ['21 (Distance Z1)', '50/51 (Surintensité)', '50BF (Refus Disjoncteur)'],
    totalDurationMs: 1200,
    linkedSimulatorTab: 'short_circuit',
    linkedEquipmentId: 'eq-exp-tower-225kv',
    keyLessonsFr: [
      'La protection Distance ANSI 21 détecte l’effondrement de l’impédance boucle Z sous le seuil Z1 sans temporisation intentionnelle (Zone 1 instantanée t = 0 ms).',
      'Le temps total d’élimination du défaut comprend le temps de décision du relais numérique (~25 ms) et le temps d’ouverture mécanique des pôles SF6 (~40 ms), soit 65 ms au total.',
      'L’extinction de l’arc au premier passage par zéro du courant évite l’instabilité angulaire des alternateurs de Songloulou.'
    ],
    keyLessonsEn: [
      'Distance protection ANSI 21 detects impedance drop below Zone 1 threshold instantaneously without intentional time delay.',
      'Total fault clearing time equals relay processing (~25 ms) + SF6 breaker mechanical interruption (~40 ms) = 65 ms total.',
      'Current zero arc extinction preserves transient angular stability of upstream Songloulou hydro generators.'
    ],
    phases: [
      {
        id: 'p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'État Sain',
        labelEn: 'Healthy State',
        summaryFr: 'Transit nominal équilibré de 180 MW sous 225 kV à 50.0 Hz.',
        summaryEn: 'Balanced 180 MW power transit at 225 kV, 50.0 Hz.',
        physicsDescriptionFr: 'Courant de charge nominal 462 A circulant dans les conducteurs Almelec 570 mm². Impédance vue par le relais dans la zone de charge normale (en dehors de tout polygone de déclenchement R-X).',
        physicsDescriptionEn: 'Rated 462 A load current flowing in Almelec conductors. Impedance seen by distance relay sits safely in normal load area.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 0, tag: 'L225_STAT', source: 'SCADA BEKOKO', messageFr: 'Ligne 225 kV Mangombé en service normal (182 MW)', messageEn: '225 kV line normal service (182 MW)', severity: 'NORMAL' }
        ]
      },
      {
        id: 'p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 15,
        labelFr: 'Événement Initiateur',
        labelEn: 'Fault Initiation',
        summaryFr: 'Chute d’arbre ou amorçage foudre créant un contact métallique triphasé franc.',
        summaryEn: 'Tree contact or lightning strike generating bolted 3-phase metallic fault.',
        physicsDescriptionFr: 'Rupture diélectrique brutale de l’air. L’impédance de boucle chute instantanément de 180 Ω à 4.2 Ω. Début de l’induction de forces électrodynamiques massives sur les jeux de barres.',
        physicsDescriptionEn: 'Sudden air insulation breakdown. Loop impedance collapses instantly from 180 ohms to 4.2 ohms. Massive electrodynamic forces commence.',
        currentFactor: 14.8,
        voltageFactor: 0.18,
        frequencyHz: 49.9,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 15, tag: 'AN_FAULT_DETECT', source: 'IED 7SA87', messageFr: 'Démarrage protection Distance ANSI 21 (Surintensité I > 3.0 In)', messageEn: 'Distance Protection Pick-up (I > 3.0 In)', severity: 'WARNING' }
        ]
      },
      {
        id: 'p3',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 30,
        labelFr: 'Régime Transitoire',
        labelEn: 'Transient Fault Surge',
        summaryFr: 'Courant de court-circuit subtransitoire Ik" avec forte composante continue apériodique.',
        summaryEn: 'Subtransient short-circuit current Ik" with decaying DC offset component.',
        physicsDescriptionFr: 'Le courant atteint une crête ip = 38 kA. Les transformateurs de courant sont sollicités près de leur point de saturation (facteur de surintensité nominale Alf dépassé).',
        physicsDescriptionEn: 'Current peaks at 38 kA. Instrument CTs operate close to magnetic saturation knee point.',
        currentFactor: 16.5,
        voltageFactor: 0.12,
        frequencyHz: 49.8,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 25, tag: 'PROT_21_Z1', source: 'IED 7SA87', messageFr: 'Mesure impédance dans la Zone 1 (85% ligne)', messageEn: 'Impedance inside Zone 1 reach (85% line)', severity: 'CRITICAL' }
        ]
      },
      {
        id: 'p4',
        phaseType: 'SENSING_DETECTION',
        timeMs: 45,
        labelFr: 'Détection & Calcul',
        labelEn: 'Relay Algorithm Decision',
        summaryFr: 'Confirmation par l’algorithme de Fourier numérique (DFT) de la zone 1.',
        summaryEn: 'Digital DFT filtering confirms fault in forward Zone 1 boundary.',
        physicsDescriptionFr: 'Le microprocesseur de l’IED compare la réactance calculée X_mesurée avec le seuil Z1_reach. La condition directionnelle amont/aval est validée positivement.',
        physicsDescriptionEn: 'Microprocessor compares calculated reactance with Zone 1 reach. Forward directional criteria confirmed.',
        currentFactor: 15.2,
        voltageFactor: 0.10,
        frequencyHz: 49.7,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 42, tag: 'ANSI_21_CONFIRM', source: 'IED 7SA87', messageFr: 'Zone 1 Confirmée - Ordre TRIP immédiat', messageEn: 'Zone 1 Confirmed - Instant TRIP issued', severity: 'TRIP' }
        ]
      },
      {
        id: 'p5',
        phaseType: 'TRIP_COMMAND',
        timeMs: 55,
        labelFr: 'Ordre de Déclenchement',
        labelEn: 'Trip Coil Activation',
        summaryFr: 'Émission du pulse électrique 110 V DC sur les bobines d’ouverture du disjoncteur.',
        summaryEn: '110 V DC electrical trip pulse dispatched to circuit breaker opening solenoids.',
        physicsDescriptionFr: 'Le contact statique IGBT de l’IED commute. Le courant d’excitation magnétise la gâchette mécanique du disjoncteur SF6. Déverrouillage des ressorts bandés.',
        physicsDescriptionEn: 'Relay solid-state output triggers breaker opening coil. Mechanical latch unlatches under spring tension.',
        currentFactor: 14.9,
        voltageFactor: 0.11,
        frequencyHz: 49.6,
        breakerState: 'OPENING',
        activeAlarms: [
          { timestampMs: 55, tag: 'CB_TRIP_COIL_1', source: 'DISJ 225kV BEKOKO', messageFr: 'Bobine déclenchement 1 alimentée (GOOSE t=2ms)', messageEn: 'Trip coil 1 energized via GOOSE message', severity: 'TRIP' }
        ]
      },
      {
        id: 'p6',
        phaseType: 'ARC_EXTINCTION',
        timeMs: 85,
        labelFr: 'Coupure & Extinction d’Arc',
        labelEn: 'Arc Interruption in SF6',
        summaryFr: 'Séparation des contacts d’arc et soufflage du plasma par le gaz SF6 auto-pneumatique.',
        summaryEn: 'Arc contact parting and thermal blast arc quenching via SF6 gas auto-puffer nozzle.',
        physicsDescriptionFr: 'La tension d’arc croît fortement. Au premier passage à zéro du courant alternatif (f = 50 Hz), la rigidité diélectrique du gaz SF6 comprimé l’emporte sur la tension de rétablissement transitoire (TRV). Le courant s’annule définitivement.',
        physicsDescriptionEn: 'Arc voltage climbs. At current natural zero-crossing, SF6 dielectric recovery withstands Transient Recovery Voltage (TRV). Current clears to zero.',
        currentFactor: 0.0,
        voltageFactor: 0.88,
        frequencyHz: 49.7,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 85, tag: 'CB_OPEN_CONFIRM', source: 'DISJ 225kV BEKOKO', messageFr: 'Contacts ouverts - Coupure défaut réussie (t_tot = 70 ms)', messageEn: 'Breaker opened - Fault extinguished (t_tot = 70 ms)', severity: 'NORMAL' }
        ]
      },
      {
        id: 'p7',
        phaseType: 'POST_FAULT',
        timeMs: 250,
        labelFr: 'Régime Post-Défaut',
        labelEn: 'Post-Fault Grid Recovery',
        summaryFr: 'Rétablissement de la tension sur le jeu de barres sain et rééquilibrage de fréquence.',
        summaryEn: 'Substation healthy bus voltage restored and system frequency stabilization.',
        physicsDescriptionFr: 'Les autres artères 225 kV absorbent le report de charge sans surcharge critique. Les régulateurs AVR et turbines rétablissent 225 kV et 50.0 Hz en 1.5 seconde.',
        physicsDescriptionEn: 'Parallel corridors absorb transferred load without thermal tripping. AVRs restore nominal voltage in 1.5 seconds.',
        currentFactor: 0.0,
        voltageFactor: 0.99,
        frequencyHz: 49.9,
        breakerState: 'OPEN',
        activeAlarms: [
          { timestampMs: 200, tag: 'BUS_225_V_OK', source: 'SCADA BEKOKO', messageFr: 'Tension jeu de barres 225 kV rétablie à 224.2 kV', messageEn: '225 kV busbar voltage stabilized at 224.2 kV', severity: 'NORMAL' }
        ]
      },
      {
        id: 'p8',
        phaseType: 'NORMALIZATION',
        timeMs: 1000,
        labelFr: 'Normalisation & Bilan',
        labelEn: 'Restoration & SOE Log Review',
        summaryFr: 'Enregistrement de l’oscillogramme COMTRADE et prêt pour cycle de réenclenchement 79.',
        summaryEn: 'COMTRADE disturbance record saved; system ready for Auto-Reclose sequence.',
        physicsDescriptionFr: 'Inspection télé-visuelle et diagnostic de distance métrique au défaut transmis au Dispatching SONATREL de Mangombé (défaut localisé à 24.3 km de Bekoko).',
        physicsDescriptionEn: 'Fault locator yields exact distance (24.3 km from Bekoko) sent to SONATREL national grid dispatch.',
        currentFactor: 0.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'OPEN',
        activeAlarms: [
          { timestampMs: 950, tag: 'SOE_FILE_SAVED', source: 'SCADA ARCHIVE', messageFr: 'Oscillogramme COMTRADE exporté avec succès', messageEn: 'COMTRADE record exported successfully', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 2: Saturation d’un transformateur de courant ──
  {
    id: 'scen-2-ct-saturation',
    code: 'SCEN-02',
    titleFr: '2. Saturation Magnétique d’un Transformateur de Courant (TC)',
    titleEn: '2. Current Transformer (CT) Core Saturation',
    subtitleFr: 'Saturation du circuit magnétique sous composante apériodique continue (ANSI C37.110)',
    subtitleEn: 'Magnetic core saturation induced by DC offset and remanent flux (ANSI C37.110)',
    domainCode: 'D04',
    primaryStandard: 'CEI 61869-2 / IEEE C37.110',
    cameroonContextFr: 'Poste 225/90 kV de Logbaba, départ transformateur 60 MVA sous fort rapport X/R.',
    cameroonContextEn: 'Logbaba 225/90 kV substation, 60 MVA transformer bay with high X/R ratio.',
    keyPhenomenonFr: 'Déformation sévère de la réplique secondaire du courant, risquant d’induire un faux déclenchement différentiel ou un sous-fonctionnement.',
    keyPhenomenonEn: 'Severe secondary current waveform distortion risking false differential trip or relay blindness.',
    governingAnsiCodes: ['ANSI C37.110', 'ANSI 87T (Stabilisation bi-pente)', 'ANSI 50'],
    totalDurationMs: 800,
    linkedSimulatorTab: 'ct_saturation',
    linkedEquipmentId: 'eq-exp-ct-225k',
    keyLessonsFr: [
      'La composante apériodique continue (constante de temps L/R du réseau) déplace le cycle d’hystérésis vers la zone de saturation coudée.',
      'En saturation, le courant secondaire s’effondre pendant chaque demi-onde après quelques millisecondes, créant un faux courant différentiel résiduel.',
      'Les relais modernes intègrent un algorithme de détection de saturation par calcul de la dérivée dI/dt et stabilisation bi-pente.'
    ],
    keyLessonsEn: [
      'The DC decaying component shifts magnetic hysteresis into the deep saturation knee-point.',
      'During saturation, secondary current collapses periodically, synthesizing a spurious false differential current.',
      'Modern IEDs deploy saturation detection algorithms monitoring dI/dt and dual-slope restraint logic.'
    ],
    phases: [
      {
        id: 's2-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Flux Magnétique Linéaire',
        labelEn: 'Linear Magnetic Flux',
        summaryFr: 'Flux sinusoïdal dans le noyau torique bien en dessous du coude de saturation.',
        summaryEn: 'Sinusoidal core flux operating well below the magnetic saturation knee point.',
        physicsDescriptionFr: 'Induction magnétique B = 0.4 T (saturation B_sat = 1.8 T pour tôles Fe-Si). Courant secondaire i_s parfaitement proportionnel à i_p.',
        physicsDescriptionEn: 'Core flux density at 0.4 T (saturation knee at 1.8 T). Secondary current faithfully reproduces primary load waveform.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's2-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 20,
        labelFr: 'Défaut Externe & Forte Composante DC',
        labelEn: 'External Fault with Severe DC Offset',
        summaryFr: 'Apparition d’un court-circuit externe avec angle d’enclenchement θ = 0° (asymétrie 100%).',
        summaryEn: 'External fault occurrence at voltage zero crossing producing 100% DC asymmetrical component.',
        physicsDescriptionFr: 'L’intégrale de la composante continue force le flux magnétique à croître de façon unidirectionnelle sans pouvoir se désaimanter.',
        physicsDescriptionEn: 'Time integral of DC decaying current forces magnetic flux to climb monotonically without zero-crossing resets.',
        currentFactor: 12.0,
        voltageFactor: 0.35,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 20, tag: 'CT_BURDEN_HIGH', source: 'IED TC-225', messageFr: 'Courant primaire 12 x In avec asymétrie maximale', messageEn: '12x In primary current with maximum DC offset', severity: 'WARNING' }
        ]
      },
      {
        id: 's2-p3',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 40,
        labelFr: 'Saturation Brutale du Noyau',
        labelEn: 'Abrupt Core Saturation',
        summaryFr: 'Le noyau atteint B_sat = 1.85 T : la perméabilité relative chute de 50 000 à ~1.',
        summaryEn: 'Core reaches B_sat = 1.85 T: relative permeability collapses from 50,000 to ~1.',
        physicsDescriptionFr: 'L’impédance magnétisante Zm s’effondre. Tout le courant primaire se dérive dans la branche magnétisante, le courant secondaire tombe à zéro brutalement.',
        physicsDescriptionEn: 'Magnetizing impedance collapses. Primary current shunts through magnetizing branch; secondary current drops to near-zero.',
        currentFactor: 0.2, // Secondary current collapsed!
        voltageFactor: 0.30,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 38, tag: 'CT_SAT_FLAG', source: 'IED 87T', messageFr: 'Détection saturation TC par calcul temps d’apparition', messageEn: 'CT saturation detected via time-to-saturate algorithm', severity: 'WARNING' }
        ]
      },
      {
        id: 's2-p4',
        phaseType: 'SENSING_DETECTION',
        timeMs: 65,
        labelFr: 'Blocage Différentiel Bi-Pente',
        labelEn: 'Dual-Slope Restraint Restrains False Trip',
        summaryFr: 'L’algorithme de stabilisation différentielle bloque le déclenchement intempestif.',
        summaryEn: 'Percentage differential restraint algorithm prevents spurious uncoordinated tripping.',
        physicsDescriptionFr: 'Le relais différentiel 87T mesure un fort courant de retenue (Ir) qui élève automatiquement le seuil de déclenchement (Pente 2). Le défaut étant externe, l’équipement est protégé contre un faux déclenchement.',
        physicsDescriptionEn: '87T relay calculates strong through-fault restraint current Ir, shifting operating point into Slope-2 safe restraint zone.',
        currentFactor: 0.4,
        voltageFactor: 0.32,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 60, tag: 'DIFF_BLOCK_EXT', source: 'IED 87T', messageFr: 'Blocage déclenchement différentiel (Défaut Externe Stabilisé)', messageEn: 'Differential trip blocked (Stabilized External Fault)', severity: 'NORMAL' }
        ]
      },
      {
        id: 's2-p5',
        phaseType: 'ARC_EXTINCTION',
        timeMs: 120,
        labelFr: 'Élimination Externe par l’Appareil Dédié',
        labelEn: 'External Fault Cleared by Downstream Breaker',
        summaryFr: 'Le disjoncteur du départ en défaut aval s’ouvre et élimine le défaut.',
        summaryEn: 'Downstream feeder breaker clears external fault correctly in selectivity.',
        physicsDescriptionFr: 'Le courant primaire revient à la valeur de charge normale. Le flux magnétique du TC commence sa relaxation exponentielle.',
        physicsDescriptionEn: 'Primary current returns to nominal load. Remanent core flux undergoes exponential demagnetization.',
        currentFactor: 1.0,
        voltageFactor: 0.98,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 110, tag: 'FE_CLEARED', source: 'SCADA LOGBABA', messageFr: 'Départ aval déclenché sélectivement (Poste préservé)', messageEn: 'Downstream feeder tripped selectively (Bus preserved)', severity: 'NORMAL' }
        ]
      },
      {
        id: 's2-p6',
        phaseType: 'NORMALIZATION',
        timeMs: 500,
        labelFr: 'Désaimantation & Retour Linéaire',
        labelEn: 'Core Demagnetization & Normalcy',
        summaryFr: 'Le noyau retrouve sa perméabilité nominale, réplique exacte restored.',
        summaryEn: 'Toroidal core returns to linear high-permeability regime.',
        physicsDescriptionFr: 'Absence totale de déformation résiduelle. Les mesures de comptage et de protection reprennent avec une précision de classe 0.2S / 5P20.',
        physicsDescriptionEn: 'Full waveform fidelity restored. Metering and protection measurements regain 0.2S / 5P20 accuracy.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 450, tag: 'CT_STATUS_NORMAL', source: 'SUPERVISION', messageFr: 'TC 225 kV : Flux rémanent stabilisé', messageEn: '225 kV CT: Remanent flux stabilized', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 3: Enclenchement d’un transformateur (courant d’inrush) ──
  {
    id: 'scen-3-trafo-inrush',
    code: 'SCEN-03',
    titleFr: '3. Enclenchement de Transformateur & Courant d’Inrush',
    titleEn: '3. Transformer Energization & Magnetizing Inrush',
    subtitleFr: 'Courant magnétisant transitoire dissymétrique riche en harmonique 2 (100 Hz)',
    subtitleEn: 'Asymmetrical transient magnetizing inrush rich in 2nd harmonic (100 Hz)',
    domainCode: 'D04',
    primaryStandard: 'CEI 60076 / IEEE C37.91',
    cameroonContextFr: 'Poste d’Interconnexion de Bekoko, mise sous tension du transformateur T1 60 MVA 225/30 kV.',
    cameroonContextEn: 'Bekoko Substation, energizing 60 MVA 225/30 kV step-down transformer T1.',
    keyPhenomenonFr: 'Appel de courant pouvant atteindre 8 à 10 fois In avec une forme d’onde unipolaire riche en composante harmonique 2 (H2 > 15%).',
    keyPhenomenonEn: 'Inrush peak reaching 8-10x In with unipolar offset and massive 2nd harmonic component (>15%).',
    governingAnsiCodes: ['ANSI 87T (Retenue Harmonique 2)', 'ANSI 50/51'],
    totalDurationMs: 1500,
    linkedSimulatorTab: 'transformer',
    linkedEquipmentId: 'eq-exp-sub-trafo-225-30',
    keyLessonsFr: [
      'Lors de la fermeture du disjoncteur au passage à zéro de la tension, le flux théorique requis double pour satisfaire la loi de Faraday, saturant le circuit magnétique.',
      'Le relais différentiel 87T bloquerait instantanément sans la fonction de retenue d’harmonique 2 (Harmonic Restraint 2nd harmonic filter).',
      'Le seuil typique de blocage H2 est fixé entre 15% et 20% du fondamental 50 Hz.'
    ],
    keyLessonsEn: [
      'Closing at voltage zero demands double core flux to satisfy Faraday’s law, driving the core deep into saturation.',
      'Differential relay 87T would trip erroneously without 2nd harmonic restraint filtering out magnetizing inrush.',
      'Typical H2 threshold is configured between 15% and 20% of the 50 Hz fundamental.'
    ],
    phases: [
      {
        id: 's3-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Transformateur Hors Tension',
        labelEn: 'Transformer De-Energized',
        summaryFr: 'Disjoncteur HTA et disjoncteur HTB ouverts, transfo consigné.',
        summaryEn: 'Primary and secondary circuit breakers open, transformer de-energized.',
        physicsDescriptionFr: 'Flux rémanent B_rem = +0.8 T piégé dans les tôles magnétiques orientées lors de la précédente coupure.',
        physicsDescriptionEn: 'Remanent flux B_rem = +0.8 T trapped in grain-oriented steel laminations from prior de-energization.',
        currentFactor: 0.0,
        voltageFactor: 0.0,
        frequencyHz: 50.0,
        breakerState: 'OPEN',
        activeAlarms: []
      },
      {
        id: 's3-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 25,
        labelFr: 'Fermeture Disjoncteur 225 kV',
        labelEn: '225 kV Breaker Closure',
        summaryFr: 'Ordre de fermeture manuel ou télécommandé depuis le SCADA.',
        summaryEn: 'Closing command issued to 225 kV primary breaker from substation SCADA.',
        physicsDescriptionFr: 'Fermeture des pôles alors que la tension de la phase A passe par zéro : condition la plus sévère pour l’établissement du flux.',
        physicsDescriptionEn: 'Poles make contact near voltage zero crossing of phase A: worst-case condition for magnetic flux establishment.',
        currentFactor: 0.1,
        voltageFactor: 0.85,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 25, tag: 'CB_CLOSE_225', source: 'SCADA BEKOKO', messageFr: 'Enclenchement Transformateur T1 60 MVA', messageEn: 'Energizing 60 MVA Power Transformer T1', severity: 'NORMAL' }
        ]
      },
      {
        id: 's3-p3',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 50,
        labelFr: 'Pic d’Inrush & Saturation Sévère',
        labelEn: 'Inrush Peak & Core Saturation',
        summaryFr: 'Le courant d’appel culmine à 8.5 x Inom (1310 A crête à 225 kV).',
        summaryEn: 'Inrush current peaks at 8.5 x Inom (1310 A peak at 225 kV level).',
        physicsDescriptionFr: 'Le flux total dépasse 2.2 T. La carcasse magnétique ne pouvant plus absorber le flux, le bobinage se comporte comme une simple inductance dans l’air.',
        physicsDescriptionEn: 'Core flux exceeds 2.2 T. Core saturates completely; windings behave as air-core inductors.',
        currentFactor: 8.5,
        voltageFactor: 0.92,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 45, tag: 'INRUSH_SURGE', source: 'IED 87T', messageFr: 'Pic courant d’inrush détecté : 8.5 In', messageEn: 'Inrush current spike detected: 8.5 In', severity: 'WARNING' }
        ]
      },
      {
        id: 's3-p4',
        phaseType: 'SENSING_DETECTION',
        timeMs: 70,
        labelFr: 'Filtrage Harmonique 2 (H2 > 22%)',
        labelEn: 'Harmonic 2 Filter Restraint Active',
        summaryFr: 'Le filtre numérique FFT mesure 22.4% d’harmonique 2 et bloque le déclenchement 87T.',
        summaryEn: 'Digital FFT filter extracts 22.4% second harmonic content, restraining 87T trip.',
        physicsDescriptionFr: 'Contrairement à un vrai court-circuit interne (qui génère un courant purement sinusoïdal à 50 Hz), l’inrush est dissymétrique et riche en composante 100 Hz. Le relais bloque le déclenchement.',
        physicsDescriptionEn: 'Unlike true internal short-circuits (pure 50 Hz), magnetizing inrush exhibits large 100 Hz components. Relay locks out trip.',
        currentFactor: 6.8,
        voltageFactor: 0.95,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 65, tag: '87T_H2_BLOCK', source: 'IED 87T', messageFr: 'Retenue Harmonique 2 active (H2 = 22.4% > Seuil 15%) - TRIP bloqué', messageEn: '2nd Harmonic Restraint active (H2 = 22.4% > 15%) - TRIP inhibited', severity: 'NORMAL' }
        ]
      },
      {
        id: 's3-p5',
        phaseType: 'POST_FAULT',
        timeMs: 400,
        labelFr: 'Amortissement Électromécanique',
        labelEn: 'Damped Magnetizing Decay',
        summaryFr: 'Le courant d’inrush décroît selon la constante de temps L/R du transformateur.',
        summaryEn: 'Inrush current decays exponentially following transformer L/R time constant.',
        physicsDescriptionFr: 'Les pertes fer et cuivre dissipent l’énergie rémanente. Le courant résiduel s’abaisse à 2.0 In puis à la valeur nominale à vide (0.5% In).',
        physicsDescriptionEn: 'Core and copper losses damp transient energy. Magnetizing current settles toward nominal no-load current (0.5% In).',
        currentFactor: 1.8,
        voltageFactor: 0.99,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's3-p6',
        phaseType: 'NORMALIZATION',
        timeMs: 1200,
        labelFr: 'Régime Établi Sous Tension',
        labelEn: 'Steady-State Magnetization',
        summaryFr: 'Le transformateur 60 MVA est magnétisé et prêt pour la prise de charge HTA.',
        summaryEn: '60 MVA transformer fully energized; ready for downstream 30 kV load pickup.',
        physicsDescriptionFr: 'Courant à vide stabilisé à 0.8 A primaire. Tensions secondaires 30 kV triphasées équilibrées prêtes à l’enclenchement des départs industriels.',
        physicsDescriptionEn: 'No-load magnetizing current stable at 0.8 A. 30 kV secondary balanced three-phase voltages ready for feeder loading.',
        currentFactor: 0.05,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 1100, tag: 'TRAFO_READY', source: 'SCADA BEKOKO', messageFr: 'Transfo T1 60 MVA sous tension nominale - Prêt couplage 30 kV', messageEn: 'Transformer T1 energized - Ready for 30 kV busbar loading', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 4: Perte des auxiliaires dans un poste ──
  {
    id: 'scen-4-loss-of-auxiliaries',
    code: 'SCEN-04',
    titleFr: '4. Perte Totale des Auxiliaires AC dans un Poste',
    titleEn: '4. Total Station AC Auxiliary Power Failure',
    subtitleFr: 'Perte du réseau 400/230 V AC et basculement critique sur la batterie station 110 V DC',
    subtitleEn: 'Total 400/230 V AC station service outage and battery 110 V DC continuity handover',
    domainCode: 'D04',
    primaryStandard: 'CEI 60364 / IEEE 485',
    cameroonContextFr: 'Poste 225/90/30 kV d’Oyomabang (Yaoundé), coupure amont du transformateur des services auxiliaires TSA.',
    cameroonContextEn: 'Oyomabang Substation (Yaounde), loss of station auxiliary transformer TSA.',
    keyPhenomenonFr: 'Maintien de l’intégrité des protections et des télécommunications SCADA grâce au banc de batteries plomb-acide étanche 110 V DC sans interruption.',
    keyPhenomenonEn: 'Protection IEDs and SCADA telecom preserved via uninterrupted 110 V DC substation station battery bank.',
    governingAnsiCodes: ['ANSI 27 (Sous-tension AC)', 'ANSI 59DC (Surveillance Batterie)', 'ATS Automatisme'],
    totalDurationMs: 2000,
    linkedSimulatorTab: 'transient',
    linkedEquipmentId: 'eq-exp-gis-bay-225k',
    keyLessonsFr: [
      'Les services auxiliaires 110 V DC alimentent directement les calculateurs de tranche, les IEDs et les bobines d’ouverture.',
      'La batterie de poste doit être dimensionnée selon l’IEEE 485 pour garantir au moins 10 heures d’autonomie avec un cycle complet de manœuvres.',
      'Le démarrage automatique du groupe électrogène de secours de poste intervient dans les 15 secondes.'
    ],
    keyLessonsEn: [
      '110 V DC auxiliary system powers protection relays, teleprotection, and breaker trip coils.',
      'Substation battery bank is sized per IEEE 485 to ensure 10-hour standby plus heavy duty tripping operations.',
      'Emergency diesel generator ATS automatically starts and synchronizes within 15 seconds.'
    ],
    phases: [
      {
        id: 's4-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Alimentation AC & Redresseur Actif',
        labelEn: 'Station AC Feeder & Charger Active',
        summaryFr: 'Réseau 400 V AC en service, redresseur-chargeur maintenant la batterie en floating 127 V DC.',
        summaryEn: '400 V AC grid operational; battery charger maintains float voltage at 127 V DC.',
        physicsDescriptionFr: 'Le transformateur des services auxiliaires (TSA 100 kVA 30 kV / 400 V) alimente les motocompresseurs, pompes, éclairage et redresseurs.',
        physicsDescriptionEn: '100 kVA 30 kV / 400 V auxiliary transformer feeds motor compressors, ventilation, lighting, and chargers.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's4-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 50,
        labelFr: 'Déclenchement du Transformateur TSA',
        labelEn: 'TSA Auxiliary Transformer Trip',
        summaryFr: 'Court-circuit ou défaut câble sur l’arrivée auxiliaire AC.',
        summaryEn: 'Cable fault on 30 kV auxiliary incoming cable leading to TSA breaker trip.',
        physicsDescriptionFr: 'Disparition immédiate de la tension alternative 400 V AC. Arrêt instantané du redresseur. Les diodes anti-retour commutent sans aucun trou de tension (< 1 µs).',
        physicsDescriptionEn: 'Immediate 400 V AC voltage loss. Charger ceases rectification. Blocking diodes transfer load seamlessly to battery (< 1 µs).',
        currentFactor: 1.0,
        voltageFactor: 0.0, // AC collapsed
        frequencyHz: 0.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 52, tag: 'ALARM_AC_FAIL', source: 'TGBT AUX OYOMABANG', messageFr: 'MANQUE TENSION 400V ALTERNATIF SERVICES AUXILIAIRES', messageEn: 'STATION SERVICE 400V AC VOLTAGE COLLAPSED', severity: 'CRITICAL' },
          { timestampMs: 55, tag: 'DC_BATTERY_DISCHARGE', source: 'SUPERVISION 110V', messageFr: 'Batterie station en décharge (Débit 34 A DC sous 121 V)', messageEn: 'Battery discharging (34 A DC at 121 V)', severity: 'WARNING' }
        ]
      },
      {
        id: 's4-p3',
        phaseType: 'SENSING_DETECTION',
        timeMs: 200,
        labelFr: 'Autonomie Batterie & Maintien IEDs',
        labelEn: 'Battery Autonomous Hold & IED Survival',
        summaryFr: 'L’ensemble des relais numériques, liaisons optiques et télécommandes restent 100% opérationnels.',
        summaryEn: 'All digital protection IEDs, fiber multiplexers, and SCADA remain 100% active.',
        physicsDescriptionFr: 'La batterie délivre l’énergie sans transitoire. La tension DC décroît lentement selon la courbe de décharge électrochimique (121 V $\rightarrow$ 118 V).',
        physicsDescriptionEn: 'Station battery discharges smoothly without electrical transients (121 V down to 118 V).',
        currentFactor: 1.0,
        voltageFactor: 0.0,
        frequencyHz: 0.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 150, tag: 'IED_HEALTH_OK', source: 'SUPERVISION BUS IEC 61850', messageFr: 'Tous les IEDs en veille active sous 110 V DC', messageEn: 'All IEDs operating normally under 110 V DC backup', severity: 'NORMAL' }
        ]
      },
      {
        id: 's4-p4',
        phaseType: 'NORMALIZATION',
        timeMs: 1500,
        labelFr: 'Démarrage Groupe Diesel de Secours',
        labelEn: 'Emergency Diesel Generator Startup',
        summaryFr: 'L’automate ATS valide la montée en vitesse du groupe diesel et referme le disjoncteur secours.',
        summaryEn: 'ATS logic verifies diesel generator nominal voltage/frequency and closes emergency tie.',
        physicsDescriptionFr: 'Rétablissement de la tension 400 V AC sur les barres secourues. Redémarrage des redresseurs et basculement de la batterie de décharge en recharge rapide (Boost Charge).',
        physicsDescriptionEn: '400 V AC restored on emergency busbar. Charger switches to boost mode to replenish battery.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 1400, tag: 'GEN_ON_LOAD', source: 'AUTOMATE ATS', messageFr: 'Groupe électrogène couplé aux auxiliaires (400 V rétabli)', messageEn: 'Diesel generator tied to auxiliary bus (400 V restored)', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 5: Îlotage et rupture de synchronisme ──
  {
    id: 'scen-5-islanding-loss-synchronism',
    code: 'SCEN-05',
    titleFr: '5. Îlotage & Rupture de Synchronisme Réseau',
    titleEn: '5. Grid Islanding & Loss of Synchronism (Pole Slip)',
    subtitleFr: 'Déconnexion du corridor 225 kV et dérive angulaire des alternateurs hydroélectriques',
    subtitleEn: '225 kV tie-line separation and angular instability of hydro generating units',
    domainCode: 'D01',
    primaryStandard: 'CEI 60034 / IEEE C37.102',
    cameroonContextFr: 'Interconnexion Songloulou - Mangombé, rupture de synchronisme lors d’un déclenchement en cascade.',
    cameroonContextEn: 'Songloulou - Mangombe corridor, pole slip instability following cascade line trips.',
    keyPhenomenonFr: 'Oscillations violentes de puissance active (P) et réactive (Q) avec passage de l’angle rotorique δ au-delà de 180° (glissement de pôle).',
    keyPhenomenonEn: 'Violent active and reactive power oscillations with rotor angle δ crossing 180 degrees (pole slip).',
    governingAnsiCodes: ['ANSI 78 (Rupture de Synchronisme / Out-of-Step)', 'ANSI 81U/81O', 'ANSI 32'],
    totalDurationMs: 1800,
    linkedSimulatorTab: 'motor',
    linkedEquipmentId: 'eq-exp-hydro-gen-01',
    keyLessonsFr: [
      'La rupture de synchronisme induit des contraintes de torsion mécaniques destructrices sur l’arbre turbine-alternateur.',
      'Le relais ANSI 78 surveille la trajectoire de l’impédance à travers deux caractéristiques lenticulaires ou rectangulaires dans le plan R-X.',
      'Le déclenchement doit s’effectuer impérativement à un angle rotorique favorable (proche de 0° ou 180°) pour soulager le disjoncteur.'
    ],
    keyLessonsEn: [
      'Loss of synchronism inflicts catastrophic mechanical torsional fatigue on turbine-generator shafts.',
      'Out-of-Step relay ANSI 78 tracks impedance trajectory crossing blinder zones in the complex R-X plane.',
      'Tripping must execute at favorable pole-slip angle to minimize breaker transient recovery stress.'
    ],
    phases: [
      {
        id: 's5-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Synchronisme Parfait (δ = 28°)',
        labelEn: 'Synchronous Operation (δ = 28°)',
        summaryFr: 'Alternateur débitant 48 MVA couplé au réseau interconnecté à 50.00 Hz.',
        summaryEn: '48 MVA generator synchronized with interconnected transmission grid at 50.00 Hz.',
        physicsDescriptionFr: 'Angle rotorique stable δ = 28°. Équilibre parfait entre le couple mécanique de la turbine hydraulique et le couple électromagnétique.',
        physicsDescriptionEn: 'Stable rotor angle at 28 degrees. Mechanical hydraulic turbine torque matches grid electromagnetic load torque.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's5-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 100,
        labelFr: 'Déclenchement Ligne d’Évacuation',
        labelEn: 'Transmission Tie-Line Trip',
        summaryFr: 'Ouverture intempestive de la ligne 225 kV vers le centre de consommation.',
        summaryEn: 'Trip of 225 kV transmission artery isolating generator into reduced local island.',
        physicsDescriptionFr: 'Surplus massif de puissance mécanique : la turbine accélère brutalement (loi d’oscillation de swing équation J d²δ/dt² = Pm - Pe).',
        physicsDescriptionEn: 'Massive mechanical power surplus: generator rotor accelerates according to swing equation.',
        currentFactor: 2.5,
        voltageFactor: 0.85,
        frequencyHz: 50.8,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 110, tag: 'FREQ_RISING', source: 'IED 81O', messageFr: 'Hausse de fréquence f = 50.8 Hz (Survitesse turbine)', messageEn: 'Frequency rising to 50.8 Hz (Overspeed)', severity: 'WARNING' }
        ]
      },
      {
        id: 's5-p3',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 400,
        labelFr: 'Premier Glissement de Pôle (δ = 180°)',
        labelEn: 'First Pole Slip Trajectory',
        summaryFr: 'L’angle rotorique franchit 180° : inversion brutale du couple et pulsation de courant.',
        summaryEn: 'Rotor angle crosses 180 degrees: violent torque reversal and current pulsation.',
        physicsDescriptionFr: 'Le centre électrique du système passe à potentiel zéro virtuel au niveau de l’alternateur. L’impédance apparente plonge au cœur de la lentille ANSI 78.',
        physicsDescriptionEn: 'Electrical center passes virtual zero potential near generator stator. Apparent impedance dives through ANSI 78 blinders.',
        currentFactor: 6.2,
        voltageFactor: 0.40,
        frequencyHz: 52.4,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 380, tag: 'ANSI_78_POLE_SLIP', source: 'IED MACHINE 7UM85', messageFr: 'Rupture de synchronisme détectée (Glissement pôle 1)', messageEn: 'Out-of-Step detected (Pole Slip 1)', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's5-p4',
        phaseType: 'TRIP_COMMAND',
        timeMs: 450,
        labelFr: 'Ordre de Déclenchement ANSI 78',
        labelEn: 'Controlled Islanding Breaker Trip',
        summaryFr: 'Ouverture immédiate du disjoncteur groupe pour protéger l’arbre mécanique.',
        summaryEn: 'Instant generator circuit breaker trip to preserve mechanical rotor shaft.',
        physicsDescriptionFr: 'Le disjoncteur groupe s’ouvre à t = 480 ms. Le régulateur de vitesse ferme immédiatement les directrices de la turbine pour limiter la survitesse à 130%.',
        physicsDescriptionEn: 'Generator breaker clears at 480 ms. Governor slams wicket gates closed to arrest overspeed within 130%.',
        currentFactor: 0.0,
        voltageFactor: 1.05,
        frequencyHz: 53.2,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 460, tag: 'GEN_CB_OPEN', source: 'DISJ GROUPE G1', messageFr: 'Disjoncteur alternateur ouvert - Groupe îloté à vide', messageEn: 'Generator breaker open - Unit isolated at no-load', severity: 'TRIP' }
        ]
      },
      {
        id: 's5-p5',
        phaseType: 'NORMALIZATION',
        timeMs: 1500,
        labelFr: 'Stabilisation à Vide 50 Hz',
        labelEn: 'No-Load 50 Hz Stabilization',
        summaryFr: 'Groupe stabilisé à vide sous régulation automatique de vitesse, prêt pour resynchronisation.',
        summaryEn: 'Hydro unit settled at nominal speed and voltage, ready for re-synchronization.',
        physicsDescriptionFr: 'Vitesse ramenée à 150 tr/min (50.0 Hz) par l’asservissement oléo-dynamique. La colonne de synchronisation automatique 25 est armée.',
        physicsDescriptionEn: 'Speed brought back to 150 rpm (50.0 Hz) by governor. Auto-synchronizer 25 armed for grid tie.',
        currentFactor: 0.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'OPEN',
        activeAlarms: [
          { timestampMs: 1450, tag: 'SYNC_READY', source: 'AUTOMATE SYNCHRO 25', messageFr: 'Prêt pour resynchronisation sur le réseau', messageEn: 'Ready for re-synchronization to transmission grid', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 6: Réenclenchement automatique 79 sur défaut fugitif ──
  {
    id: 'scen-6-auto-recloser-79',
    code: 'SCEN-06',
    titleFr: '6. Réenclenchement Automatique (ANSI 79) sur Ligne Aérienne',
    titleEn: '6. Auto-Reclosing (ANSI 79) on Transient Overhead Fault',
    subtitleFr: 'Cycle rapide O - 0.3s - F éliminant un amorçage foudre fugitif sur départ HTA 30 kV',
    subtitleEn: 'Fast O - 0.3s - C cycle extinguishing transient lightning flashover on 30 kV line',
    domainCode: 'D05',
    primaryStandard: 'CEI 60255 / CEI 62271-111',
    cameroonContextFr: 'Réseau HTA 30 kV de la région du Littoral (Eneo), ligne périurbaine exposée aux orages tropicaux.',
    cameroonContextEn: 'Littoral 30 kV distribution network, overhead line exposed to severe tropical thunderstorms.',
    keyPhenomenonFr: 'Plus de 85% des défauts sur lignes aériennes sont fugitifs : une coupure brève de 300 ms permet la déionisation complète du canal d’arc sans coupure durable pour les abonnés.',
    keyPhenomenonEn: 'Over 85% of overhead faults are transient: a brief 300 ms de-energized pause de-ionizes the arc channel, restoring continuity.',
    governingAnsiCodes: ['ANSI 79 (Réenclencheur)', 'ANSI 50/51 (Surintensité)', 'ANSI 67 (Directionnelle)'],
    totalDurationMs: 1000,
    linkedSimulatorTab: 'short_circuit',
    linkedEquipmentId: 'eq-exp-cell-mv-30k',
    keyLessonsFr: [
      'Le temps mort rapide (Dead Time) de 300 ms est calculé pour que les gaz ionisés se dissipent sous le vent.',
      'Si le défaut est permanent, le disjoncteur déclenche à nouveau et enclenche le cycle lent (temps mort 15 s) avant verrouillage définitif (Lockout).',
      'Le réenclenchement automatique améliore drastiquement l’indice de continuité SAIDI du réseau.'
    ],
    keyLessonsEn: [
      'The 300 ms fast dead time is calibrated for natural wind dispersal of ionized arc gases.',
      'If the fault is permanent, breaker trips again and enters slow cycle (15 s dead time) prior to definitive lockout.',
      'Auto-reclosing drastically improves network SAIDI reliability index.'
    ],
    phases: [
      {
        id: 's6-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Distribution Normale 30 kV',
        labelEn: 'Normal 30 kV Distribution',
        summaryFr: 'Départ alimentant 45 postes cabines MT/BT sous courant nominal 240 A.',
        summaryEn: 'Feeder supplying 45 distribution kiosks at nominal 240 A current.',
        physicsDescriptionFr: 'Réseau équilibré à neutre compensé par bobine Petersen. Courant capacitif compensé.',
        physicsDescriptionEn: 'Balanced 30 kV distribution grid with compensated grounding.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's6-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 20,
        labelFr: 'Amorçage Foudre sur Isolateur',
        labelEn: 'Lightning Surge Flashover',
        summaryFr: 'Coup de foudre direct provoquant un contournement d’isolateur en tête de poteau.',
        summaryEn: 'Direct lightning strike causing insulator flashover on overhead pole head.',
        physicsDescriptionFr: 'L’onde de foudre de 150 kV crête dépasse la tenue de choc. Un arc électrique s’établit entre phase et ferrures de mise à la terre.',
        physicsDescriptionEn: '150 kV lightning surge exceeds basic impulse level (BIL), establishing power arc across insulator.',
        currentFactor: 9.5,
        voltageFactor: 0.25,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 22, tag: 'F50_PICKUP', source: 'RELAIS SEPAM S40', messageFr: 'Défaut surintensité phase-phase 9.5 In', messageEn: 'Overcurrent fault pick-up at 9.5 In', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's6-p3',
        phaseType: 'TRIP_COMMAND',
        timeMs: 65,
        labelFr: 'Déclenchement Rapide (Ouverture O)',
        labelEn: 'Fast Trip (Open Operation O)',
        summaryFr: 'Ouverture du disjoncteur HTA sous vide en 45 ms pour couper l’arc de court-circuit.',
        summaryEn: 'Vacuum circuit breaker opens in 45 ms to clear short-circuit arc.',
        physicsDescriptionFr: 'Les ampoules sous vide séparent les contacts à 1.5 m/s. Le courant de défaut est coupé au zéro de courant.',
        physicsDescriptionEn: 'Vacuum interrupter contacts part at 1.5 m/s. Arc clears at natural current zero.',
        currentFactor: 0.0,
        voltageFactor: 0.0,
        frequencyHz: 50.0,
        breakerState: 'OPEN',
        activeAlarms: [
          { timestampMs: 65, tag: 'ANSI_79_RUN', source: 'AUTOMATE REENCLENCHEUR', messageFr: 'Cycle réenclenchement rapide 79 enclenché (Temps mort 300 ms)', messageEn: 'Fast auto-reclose cycle initiated (Dead time 300 ms)', severity: 'WARNING' }
        ]
      },
      {
        id: 's6-p4',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 200,
        labelFr: 'Déionisation du Canal d’Arc',
        labelEn: 'Arc Channel De-Ionization',
        summaryFr: 'Ligne hors tension : recombinaison des électrons et ions libres dans l’air.',
        summaryEn: 'Line de-energized: recombination of free electrons and ions in surrounding air.',
        physicsDescriptionFr: 'En l’absence de tension, l’air retrouve sa rigidité diélectrique naturelle (> 30 kV/cm). Le canal d’arc est totalement éteint.',
        physicsDescriptionEn: 'In zero voltage state, ambient air recovers dielectric withstand (> 30 kV/cm). Plasma path disperses.',
        currentFactor: 0.0,
        voltageFactor: 0.0,
        frequencyHz: 50.0,
        breakerState: 'OPEN',
        activeAlarms: []
      },
      {
        id: 's6-p5',
        phaseType: 'NORMALIZATION',
        timeMs: 380,
        labelFr: 'Réenclenchement Réussi (Fermeture F)',
        labelEn: 'Successful Reclosing (Close Operation F)',
        summaryFr: 'Le disjoncteur se referme avec succès : ligne sous tension saine.',
        summaryEn: 'Breaker recloses successfully: line restored healthy with zero fault residual.',
        physicsDescriptionFr: 'L’arc ayant disparu, le courant reprend sa valeur de charge nominale sans surintensité. Le relais 79 arme sa temporisation de réinitialisation (Reclaim Time 30 s).',
        physicsDescriptionEn: 'Fault cleared; nominal load current resumes smoothly. Relay arms 30-second reclaim timer.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 370, tag: '79_SUCCESS', source: 'SCADA DISPATCHING', messageFr: 'RÉENCLENCHEMENT RAPIDE RÉUSSI (Coupure fugitive < 320 ms)', messageEn: 'FAST AUTO-RECLOSE SUCCESSFUL (Interruption < 320 ms)', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénarios 7 à 10 intégrés pour couvrir les 10 scénarios complets ──
  {
    id: 'scen-7-mv-earth-fault',
    code: 'SCEN-07',
    titleFr: '7. Défaut à la Terre en Réseau HTA (Neutre Compensé)',
    titleEn: '7. Single Phase-to-Earth Fault in MV Network',
    subtitleFr: 'Détection par protection wattmétrique homopolaire ANSI 67N sur neutre impédant/compensé',
    subtitleEn: 'Zero-sequence directional wattmetric relay ANSI 67N detection on compensated grid',
    domainCode: 'D05',
    primaryStandard: 'CEI 60909 / CEI 60255-151',
    cameroonContextFr: 'Poste HTA/BT de Bassa (Douala), câble souterrain 30 kV XLPE dégradé par infiltration d’eau.',
    cameroonContextEn: 'Bassa 30 kV industrial feeder, XLPE cable water tree insulation breakdown.',
    keyPhenomenonFr: 'Faible courant de défaut résiduel (15 à 40 A) masqué par le courant capacitif global du réseau souterrain.',
    keyPhenomenonEn: 'Low residual fault current (15-40 A) swamped by total cable network capacitive currents.',
    governingAnsiCodes: ['ANSI 67N (Directionnelle Terre)', 'ANSI 59N (Déplacement Neutre)', 'ANSI 51N'],
    totalDurationMs: 1400,
    linkedSimulatorTab: 'short_circuit',
    phases: [
      {
        id: 's7-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Tension Phase-Terre Symétrique (17.3 kV)',
        labelEn: 'Symmetrical Phase-to-Earth Voltages',
        summaryFr: 'Tensions simples triphasées parfaitement équilibrées à 17.3 kV.',
        summaryEn: 'Balanced phase-to-ground voltages at 17.3 kV rms.',
        physicsDescriptionFr: 'Tension de neutre V0 = 0 V. Somme des courants capacitifs nulle.',
        physicsDescriptionEn: 'Neutral displacement voltage V0 = 0 V. Sum of capacitive ground currents equals zero.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's7-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 30,
        labelFr: 'Claquant d’Isolant sur Phase A',
        labelEn: 'Phase A Insulation Flashover',
        summaryFr: 'Perforation de la gaine XLPE : la phase A tombe au potentiel de terre.',
        summaryEn: 'XLPE insulation punctured: phase A voltage collapses to earth potential.',
        physicsDescriptionFr: 'La tension simple Va s’effondre à 0 V. Les tensions des phases saines Vb et Vc grimpent instantanément à la tension composée 30 kV (surtension de racine de 3).',
        physicsDescriptionEn: 'Phase A collapses to 0 V; healthy phases B and C climb by sqrt(3) to full line-to-line 30 kV.',
        currentFactor: 1.3,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 35, tag: '59N_TRIP', source: 'IED HTA BASSA', messageFr: 'Déplacement de neutre V0 > 15% (ANSI 59N)', messageEn: 'Neutral displacement voltage V0 > 15%', severity: 'WARNING' }
        ]
      },
      {
        id: 's7-p3',
        phaseType: 'SENSING_DETECTION',
        timeMs: 120,
        labelFr: 'Calcul Wattmétrique Directionnel 67N',
        labelEn: 'Directional Wattmetric 67N Logic',
        summaryFr: 'Le relais wattmétrique extrait la composante active du courant résiduel et identifie le départ en défaut.',
        summaryEn: 'Directional zero-sequence relay detects real power component, pinpointing faulted feeder.',
        physicsDescriptionFr: 'Contrairement aux départs sains où le courant résiduel est purement capacitif (déphasé de +90°), le départ en défaut présente un flux d’énergie active orienté vers la terre.',
        physicsDescriptionEn: 'Faulted feeder exhibits resistive real power flow directed toward fault point.',
        currentFactor: 1.5,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 110, tag: '67N_PICKUP', source: 'IED REF 615', messageFr: 'Défaut Terre Directionnel sur Départ BASSA-04', messageEn: 'Directional Earth Fault on Feeder BASSA-04', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's7-p4',
        phaseType: 'TRIP_COMMAND',
        timeMs: 300,
        labelFr: 'Déclenchement Temporisé & Isolement',
        labelEn: 'Timed Trip & Feeder Isolation',
        summaryFr: 'Ouverture sélective du disjoncteur du départ BASSA-04 après temporisation de sélectivité 250 ms.',
        summaryEn: 'Selective feeder breaker opening after 250 ms coordination delay.',
        physicsDescriptionFr: 'Le départ défectueux est isolé. La tension de neutre V0 revient à zéro. Les autres départs de la ville restent sous tension sans coupure.',
        physicsDescriptionEn: 'Faulted cable isolated; neutral displacement returns to zero. Remaining city feeders stay energized.',
        currentFactor: 0.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 290, tag: 'FEEDER_ISOLATED', source: 'SCADA BASSA', messageFr: 'Départ BASSA-04 isolé - Reste du poste normalisé', messageEn: 'Feeder BASSA-04 isolated - Substation stabilized', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 8: Amorçage d’arc flash en TGBT ──
  {
    id: 'scen-8-arc-flash-tgbt',
    code: 'SCEN-08',
    titleFr: '8. Amorçage d’Arc Flash Interne en TGBT 400 V',
    titleEn: '8. Internal Arc Flash Ignition in 400 V LV Switchboard',
    subtitleFr: 'Court-circuit par arc électrique lors d’une intervention et coupure ultra-rapide par capteur optique',
    subtitleEn: 'Arc flash ignition during maintenance and ultra-fast optical sensor mitigation (< 5 ms)',
    domainCode: 'D06',
    primaryStandard: 'IEEE 1584 / CEI 61439-2',
    cameroonContextFr: 'TGBT d’une usine agroalimentaire à Douala-Bonabéri, intervention sur jeu de barres sous tension.',
    cameroonContextEn: 'Industrial LV switchboard in Douala-Bonaberi, maintenance tool dropped across live busbars.',
    keyPhenomenonFr: 'Émission d’énergie incidente (cal/cm²), onde de surpression mécanique et plasma à 18 000 °C.',
    keyPhenomenonEn: 'Extreme incident energy release (cal/cm2), blast pressure wave, and 18,000 °C ionized plasma.',
    governingAnsiCodes: ['ANSI 50ARC (Protection Optique Arc)', 'IEEE 1584', 'NFPA 70E'],
    totalDurationMs: 600,
    linkedSimulatorTab: 'short_circuit',
    phases: [
      {
        id: 's8-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Service Normal TGBT 400 V',
        labelEn: 'Normal Switchboard Operation',
        summaryFr: 'TGBT débitant 1250 A sous 400 V triphasé.',
        summaryEn: 'LV main switchboard carrying 1250 A load at 400 V.',
        physicsDescriptionFr: 'Jeu de barres en cuivre cuivré sous forme 4b compartimentée.',
        physicsDescriptionEn: 'Form 4b segregated copper busbar compartment under nominal thermal equilibrium.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's8-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 5,
        labelFr: 'Amorçage de l’Arc Électrique',
        labelEn: 'Arc Flash Initiation',
        summaryFr: 'Chute accidentelle d’un outil métallique reliant deux barres de phase (espace 25 mm).',
        summaryEn: 'Accidental tool bridge across phases triggering instantaneous explosive air ionization.',
        physicsDescriptionFr: 'Vaporisation explosive du métal. Le plasma ionisé crée un canal conducteur lumineux de plusieurs dizaines de milliers de lux.',
        physicsDescriptionEn: 'Explosive metal vaporization. Ionized plasma radiates intensive flash exceeding 50,000 lux.',
        currentFactor: 18.0,
        voltageFactor: 0.45,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 6, tag: 'OPTICAL_ARC_FLASH', source: 'RELAIS VAMP 121', messageFr: 'DÉTECTION OPTIQUE ARC FLASH FIBRE (Lumière > 20 000 lux)', messageEn: 'OPTICAL ARC SENSOR FLASH DETECTED (> 20,000 lux)', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's8-p3',
        phaseType: 'TRIP_COMMAND',
        timeMs: 8,
        labelFr: 'Ordre de Coupure Ultra-Rapide (< 4 ms)',
        labelEn: 'Ultra-Fast Optical Breaker Trip (< 4 ms)',
        summaryFr: 'La détection optique combinée à la surintensité I > 2 In déclenche le disjoncteur amont.',
        summaryEn: 'Dual-criteria (light + overcurrent) triggers master upstream circuit breaker in under 4 ms.',
        physicsDescriptionFr: 'L’énergie incidente est contenue sous 1.2 cal/cm² (seuil de brûlure au 2e degré évité grâce à la rapidité de coupure).',
        physicsDescriptionEn: 'Incident energy maintained below 1.2 cal/cm2 (dangerous 2nd degree burn boundary mitigated).',
        currentFactor: 0.0,
        voltageFactor: 0.0,
        frequencyHz: 50.0,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 8, tag: 'ARC_EXTINGUISHED', source: 'RELAIS ARC VAMP', messageFr: 'Ordre coupure disjoncteur général exécuté en 3.8 ms', messageEn: 'Main breaker trip executed in 3.8 ms', severity: 'TRIP' }
        ]
      }
    ]
  },

  // ── Scénario 9: Délestage sur baisse de fréquence (U/f) ──
  {
    id: 'scen-9-underfrequency-shedding',
    code: 'SCEN-09',
    titleFr: '9. Délestage Réseau sur Baisse de Fréquence (ANSI 81U)',
    titleEn: '9. Underfrequency Load Shedding (UFLS - ANSI 81U)',
    subtitleFr: 'Perte soudaine d’une tranche de 120 MW et activation échelonnée des paliers de délestage',
    subtitleEn: 'Sudden loss of 120 MW generation and stepped automatic frequency shedding',
    domainCode: 'D01',
    primaryStandard: 'CEI 60255 / ENTSO-E / SONATREL Grid Code',
    cameroonContextFr: 'Réseau Interconnecté Sud (RIS), déclenchement d’un groupe de Songloulou provoquant un déficit de production.',
    cameroonContextEn: 'Southern Interconnected Grid (RIS), sudden trip of Songloulou hydro units.',
    keyPhenomenonFr: 'Baisse rapide de la fréquence réseau (ROCOF df/dt = -0.8 Hz/s) risquant d’entraîner le black-out général.',
    keyPhenomenonEn: 'Steep rate of change of frequency (ROCOF df/dt = -0.8 Hz/s) risking total grid blackout.',
    governingAnsiCodes: ['ANSI 81U (Sous-fréquence)', 'ANSI 81R (ROCOF df/dt)'],
    totalDurationMs: 2500,
    linkedSimulatorTab: 'transient',
    phases: [
      {
        id: 's9-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Équilibre Offre-Demande (50.00 Hz)',
        labelEn: 'Supply-Demand Balance (50.00 Hz)',
        summaryFr: 'Production totale 850 MW équilibrant exactement la consommation nationale.',
        summaryEn: '850 MW total generation matching national demand at 50.00 Hz.',
        physicsDescriptionFr: 'Énergie cinétique des rotors du réseau stable. Dérivée de fréquence df/dt = 0.00 Hz/s.',
        physicsDescriptionEn: 'Grid rotor kinetic energy in equilibrium. Frequency derivative df/dt = 0.00 Hz/s.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's9-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 100,
        labelFr: 'Perte Brutale de 120 MW',
        labelEn: 'Sudden 120 MW Generation Loss',
        summaryFr: 'Déclenchement fortuit de 3 groupes hydroélectriques : déficit massif instantané.',
        summaryEn: 'Accidental trip of 3 hydro generation units creating instantaneous generation deficit.',
        physicsDescriptionFr: 'L’énergie cinétique des machines restantes est pompée par les charges. La fréquence s’effondre à une vitesse proportionnelle à l’inertie globale H.',
        physicsDescriptionEn: 'Load draws kinetic energy from remaining spinning rotors; system frequency plummets.',
        currentFactor: 1.2,
        voltageFactor: 0.94,
        frequencyHz: 49.3,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 150, tag: 'ROCOF_HIGH', source: 'DISPATCHING MANGOMBE', messageFr: 'Gradient de fréquence critique : df/dt = -0.85 Hz/s', messageEn: 'Critical ROCOF gradient: df/dt = -0.85 Hz/s', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's9-p3',
        phaseType: 'TRIP_COMMAND',
        timeMs: 350,
        labelFr: 'Déclenchement Palier 1 Délestage (49.0 Hz)',
        labelEn: 'Shedding Stage 1 Action (49.0 Hz)',
        summaryFr: 'Ouverture automatique des disjoncteurs de départs non prioritaires (45 MW délestés).',
        summaryEn: 'Automatic opening of non-critical distribution feeders (45 MW shed).',
        physicsDescriptionFr: 'Les relais 81U des postes sources HTA coupent les départs ruraux et industriels interruptibles. Le déficit de puissance est réduit.',
        physicsDescriptionEn: '81U relays in primary substations disconnect interruptible industrial loads, halving deficit.',
        currentFactor: 0.85,
        voltageFactor: 0.97,
        frequencyHz: 49.0,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 350, tag: '81U_STAGE_1', source: 'RELAIS 81U NATIONAL', messageFr: 'DÉLESTAGE PALIER 1 EXÉCUTÉ (45 MW déconnectés)', messageEn: 'STAGE 1 SHEDDING EXECUTED (45 MW disconnected)', severity: 'WARNING' }
        ]
      },
      {
        id: 's9-p4',
        phaseType: 'NORMALIZATION',
        timeMs: 1500,
        labelFr: 'Stabilisation & Rétablissement 50 Hz',
        labelEn: 'Frequency Recovery & Stabilization',
        summaryFr: 'La réserve primaire des autres centrales remonte la fréquence à 49.95 Hz.',
        summaryEn: 'Spinning reserve from Nachtigal restores system frequency to 49.95 Hz.',
        physicsDescriptionFr: 'Le black-out généralisé du Cameroun est évité grâce à la rapidité d’exécution du plan de défense UFLS.',
        physicsDescriptionEn: 'Total system collapse avoided due to millisecond-accurate UFLS defense plan execution.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 49.95,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 1400, tag: 'GRID_STABILIZED', source: 'DISPATCHING NATIONAL', messageFr: 'Fréquence stabilisée à 49.95 Hz - Fin d’alerte', messageEn: 'Frequency stabilized at 49.95 Hz - All clear', severity: 'NORMAL' }
        ]
      }
    ]
  },

  // ── Scénario 10: Perte d’excitation sur alternateur hydroélectrique ──
  {
    id: 'scen-10-loss-of-excitation',
    code: 'SCEN-10',
    titleFr: '10. Perte d’Excitation sur Alternateur Hydroélectrique (ANSI 40)',
    titleEn: '10. Loss of Generator Field Excitation (ANSI 40)',
    subtitleFr: 'Défaillance du pont de thyristors d’excitation et transition en génératrice asynchrone',
    subtitleEn: 'Static exciter thyristor bridge failure and transition to asynchronous induction mode',
    domainCode: 'D01',
    primaryStandard: 'CEI 60034-1 / IEEE C37.102',
    cameroonContextFr: 'Centrale hydroélectrique de Nachtigal (7 x 60 MW), groupe G3 en régime de base.',
    cameroonContextEn: 'Nachtigal Hydro Power Plant (7 x 60 MW), unit G3 operating at baseload.',
    keyPhenomenonFr: 'Absorption massive de puissance réactive (jusqu’à -40 Mvar) provoquant une chute de tension locale et l’échauffement extrême du rotor.',
    keyPhenomenonEn: 'Massive reactive power absorption (up to -40 Mvar) depressing local bus voltage and overheating rotor surface.',
    governingAnsiCodes: ['ANSI 40 (Perte d’Excitation Mho)', 'ANSI 24 (Surfluxage V/Hz)', 'ANSI 46'],
    totalDurationMs: 2200,
    linkedSimulatorTab: 'motor',
    linkedEquipmentId: 'eq-exp-hydro-gen-01',
    phases: [
      {
        id: 's10-p1',
        phaseType: 'HEALTHY_STATE',
        timeMs: 0,
        labelFr: 'Excitation Nominale (Cos φ = 0.85 Arrière)',
        labelEn: 'Nominal Field Excitation',
        summaryFr: 'Groupe délivrant 60 MW et fournissant +25 Mvar au réseau 225 kV.',
        summaryEn: 'Unit delivering 60 MW and supplying +25 Mvar to the 225 kV grid.',
        physicsDescriptionFr: 'Courant rotorique continu I_exc = 680 A DC créant le flux d’excitation principal.',
        physicsDescriptionEn: 'Direct rotor field current I_exc = 680 A DC maintaining main magnetic flux.',
        currentFactor: 1.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: []
      },
      {
        id: 's10-p2',
        phaseType: 'INITIATING_EVENT',
        timeMs: 80,
        labelFr: 'Perte du Redresseur d’Excitation',
        labelEn: 'Exciter Rectifier Failure',
        summaryFr: 'Disjoncteur de champ DC déclenché ou claquage thyristors.',
        summaryEn: 'Field breaker trip or thyristor fuse failure cutting DC excitation current.',
        physicsDescriptionFr: 'Le courant d’excitation I_exc tombe à zéro. La machine perd sa force magnétomotrice rotorique.',
        physicsDescriptionEn: 'Rotor excitation current falls to zero; rotor loses main magnetomotive force.',
        currentFactor: 1.4,
        voltageFactor: 0.92,
        frequencyHz: 50.0,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 90, tag: 'FIELD_BREAKER_OPEN', source: 'AVR EXCITATION', messageFr: 'Disjoncteur d’excitation ouvert (I_exc = 0 A)', messageEn: 'Excitation field breaker open (I_exc = 0 A)', severity: 'CRITICAL' }
        ]
      },
      {
        id: 's10-p3',
        phaseType: 'TRANSIENT_FAULT',
        timeMs: 600,
        labelFr: 'Absorption Réactive & Fonctionnement Asynchrone',
        labelEn: 'Reactive Power Inversion & Asynchronous Slip',
        summaryFr: 'La machine pompe 45 Mvar réactifs sur le réseau pour magnétiser son entrefer.',
        summaryEn: 'Unit draws 45 Mvar reactive power from grid to sustain air-gap magnetization.',
        physicsDescriptionFr: 'L’alternateur glisse au-dessus de la vitesse synchrone (g = +0.5%). Des courants de Foucault massifs circulent dans les pôles amortisseurs du rotor, provoquant un échauffement thermique rapide.',
        physicsDescriptionEn: 'Rotor slips above synchronous speed; heavy eddy currents circulate in rotor forging, inducing rapid overheating.',
        currentFactor: 2.1,
        voltageFactor: 0.82,
        frequencyHz: 50.2,
        breakerState: 'CLOSED',
        activeAlarms: [
          { timestampMs: 550, tag: 'Q_REACTIVE_INVERSION', source: 'SCADA NACHTIGAL', messageFr: 'Inversion de puissance réactive : Q = -42 Mvar absorbés', messageEn: 'Reactive power reversed: Q = -42 Mvar imported', severity: 'WARNING' }
        ]
      },
      {
        id: 's10-p4',
        phaseType: 'TRIP_COMMAND',
        timeMs: 1200,
        labelFr: 'Déclenchement Relais ANSI 40 Mho',
        labelEn: 'Relay ANSI 40 Mho Zone Trip',
        summaryFr: 'L’impédance apparente pénètre dans le cercle de décalage Mho négatif.',
        summaryEn: 'Apparent impedance enters offset negative-reactance Mho circle on R-X plane.',
        physicsDescriptionFr: 'Le relais ANSI 40 temporisé à 0.8 s donne l’ordre d’ouverture au disjoncteur groupe pour empêcher la destruction thermique du rotor.',
        physicsDescriptionEn: 'ANSI 40 relay timed at 0.8 s issues trip command to generator breaker to save rotor poles.',
        currentFactor: 0.0,
        voltageFactor: 1.0,
        frequencyHz: 50.0,
        breakerState: 'TRIPPED',
        activeAlarms: [
          { timestampMs: 1180, tag: 'ANSI_40_TRIP', source: 'IED MACHINE 7UM85', messageFr: 'DÉCLENCHEMENT PERTE D’EXCITATION ANSI 40', messageEn: 'LOSS OF EXCITATION ANSI 40 TRIP', severity: 'TRIP' }
        ]
      }
    ]
  }
];
