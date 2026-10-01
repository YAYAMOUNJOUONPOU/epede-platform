// src/components/substations/data/substationBaysData.ts
// EPEDE D04 - Substation Bay Architecture & Apparatus Catalog

export interface SubstationBayDefinition {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  category: 'LINE' | 'TRANSFORMER' | 'COUPLER' | 'SECTION' | 'FEEDER' | 'REACTIVE' | 'GENERATOR';
  purpose_fr: string;
  purpose_en: string;
  flow_stages: {
    sequence: number;
    title_fr: string;
    title_en: string;
    apparatus_code: string;
    apparatus_name_fr: string;
    apparatus_name_en: string;
    role_fr: string;
    role_en: string;
  }[];
  primary_apparatus: {
    code: string;
    type: string;
    symbol_iec: string;
    rated_specs: string;
    normal_state: 'CLOSED' | 'OPEN';
    interlocking_rule_fr: string;
    interlocking_rule_en: string;
  }[];
  protection_ieds_fr: string[];
  protection_ieds_en: string[];
  measurement_interfaces: string[];
  auxiliary_dependencies: {
    dc_trip_1: string;
    dc_trip_2: string;
    ac_motor_drive: string;
    ups_telecom: string;
  };
  earthing_safety_fr: string;
  earthing_safety_en: string;
  failure_modes: {
    mode_fr: string;
    mode_en: string;
    mitigation_fr: string;
    mitigation_en: string;
  }[];
}

export const SUBSTATION_BAYS_CATALOG: SubstationBayDefinition[] = [
  {
    id: 'BAY_LINE_225',
    code: 'TRAV-LIGNE-225',
    name_fr: 'Travée Ligne Aérienne 225 kV',
    name_en: '225 kV Overhead Line Bay',
    category: 'LINE',
    purpose_fr: 'Point d\'entrée/sortie d\'une ligne de transport haute tension, assurant le sectionnement, la coupure des courants de défaut, la mesure et la mise à la terre sécurisée.',
    purpose_en: 'Entry/exit terminal for an EHV transmission line, providing physical isolation, fault interruption, measurement, and safe earthing.',
    flow_stages: [
      {
        sequence: 1,
        title_fr: 'Arrivée Ligne & Portique',
        title_en: 'Line Arrival & Gantry',
        apparatus_code: 'GANTRY',
        apparatus_name_fr: 'Portique d\'amarrage et chaînes d\'isolateurs',
        apparatus_name_en: 'Strain gantry and tension insulator strings',
        role_fr: 'Supporte la tension mécanique des conducteurs de phase et du câble de garde OPGW.',
        role_en: 'Anchors mechanical line tension from conductors and OPGW shield wire.'
      },
      {
        sequence: 2,
        title_fr: 'Protection Contre les Surtensions',
        title_en: 'Surge Protection',
        apparatus_code: 'F1-SA',
        apparatus_name_fr: 'Parafoudre à oxyde de zinc (ZnO)',
        apparatus_name_en: 'Metal-oxide surge arrester (ZnO)',
        role_fr: 'Écrête les ondes de foudre et surtensions de manœuvre vers le réseau de terre.',
        role_en: 'Clamps lightning impulses and switching surges safely to the grounding grid.'
      },
      {
        sequence: 3,
        title_fr: 'Mesure de Tension & Détection',
        title_en: 'Voltage Measurement & Sync',
        apparatus_code: 'T1-CVT',
        apparatus_name_fr: 'Transformateur de tension capacitif (CVT)',
        apparatus_name_en: 'Capacitive Voltage Transformer (CVT)',
        role_fr: 'Fournit la tension pour les protections distance 21, le contrôle de synchronisme 25 et le couplage CPL.',
        role_en: 'Feeds voltage signals to distance 21 relays, synchro-check 25, and PLC carrier communications.'
      },
      {
        sequence: 4,
        title_fr: 'Mise à la Terre de Ligne',
        title_en: 'Line Earthing Switch',
        apparatus_code: 'Q8-LINE',
        apparatus_name_fr: 'Sectionneur de terre de ligne (rapide)',
        apparatus_name_en: 'Line earthing switch (fault-make)',
        role_fr: 'Écoule les charges résiduelles et induites lors des travaux de maintenance.',
        role_en: 'Drains residual electrostatic charges and electromagnetic induction during line maintenance.'
      },
      {
        sequence: 5,
        title_fr: 'Sectionnement de Tête de Ligne',
        title_en: 'Line Isolation Disconnector',
        apparatus_code: 'Q9-LINE',
        apparatus_name_fr: 'Sectionneur de ligne à coupure centrale',
        apparatus_name_en: 'Center-break line disconnector',
        role_fr: 'Crée une coupure visible et diélectrique entre la ligne et le poste.',
        role_en: 'Establishes a visible, verifiable dielectric isolating gap between line and switchyard.'
      },
      {
        sequence: 6,
        title_fr: 'Mesure de Courant de Ligne',
        title_en: 'Current Measurement',
        apparatus_code: 'T1-CT',
        apparatus_name_fr: 'Transformateur de courant multi-enroulements (CT)',
        apparatus_name_en: 'Multi-core Current Transformer (CT)',
        role_fr: 'Nourrit les protections 21, 87L, 50/51 et le comptage de précision.',
        role_en: 'Powers line differential 87L, distance 21, backup 50/51, and metering cores.'
      },
      {
        sequence: 7,
        title_fr: 'Appareil de Coupure Principal',
        title_en: 'Primary Interrupting Device',
        apparatus_code: 'Q0-LINE',
        apparatus_name_fr: 'Disjoncteur SF6 à autosoufflage',
        apparatus_name_en: 'SF6 puffer circuit breaker',
        role_fr: 'Interrompt les courants de charge (jusqu\'à 2500 A) et les courts-circuits (40 kA).',
        role_en: 'Interrupts continuous load currents (up to 2500 A) and severe fault currents (40 kA).'
      },
      {
        sequence: 8,
        title_fr: 'Aiguillage Jeux de Barres',
        title_en: 'Busbar Selectors',
        apparatus_code: 'Q1/Q2-BUS',
        apparatus_name_fr: 'Sectionneurs d\'aiguillage Barres 1 et 2',
        apparatus_name_en: 'Bus 1 & Bus 2 selector disconnectors',
        role_fr: 'Sélectionne le jeu de barres d\'exploitation (Barre 1 ou Barre 2).',
        role_en: 'Connects the bay to the designated operating bus (Bus 1 or Bus 2).'
      }
    ],
    primary_apparatus: [
      {
        code: 'Q0-LINE',
        type: 'Circuit Breaker',
        symbol_iec: 'CB-225',
        rated_specs: '245 kV · 2500 A · 40 kA (3s) · O-0.3s-CO-3min-CO',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Ne peut être manœuvré que si la pression SF6 est nominale et le ressort d\'enclenchement armé.',
        interlocking_rule_en: 'Operation blocked if SF6 pressure drops below stage 2 lockout or spring uncharged.'
      },
      {
        code: 'Q9-LINE',
        type: 'Disconnector',
        symbol_iec: 'DS-225',
        rated_specs: '245 kV · 2500 A · 40 kA (3s) · Commande motorisée',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Interdit à la manœuvre si le disjoncteur Q0 est FERMÉ (protection contre l\'arc de charge).',
        interlocking_rule_en: 'Movement interlocked if Q0 breaker is CLOSED (prevents breaking load currents).'
      },
      {
        code: 'Q8-LINE',
        type: 'Earthing Switch',
        symbol_iec: 'ES-225',
        rated_specs: '245 kV · 40 kA (1s) · Pouvoir de fermeture sur court-circuit',
        normal_state: 'OPEN',
        interlocking_rule_fr: 'Fermeture strictement interdite si Q9 est FERMÉ ou si une tension résiduelle est détectée sur le CVT.',
        interlocking_rule_en: 'Closing prohibited if Q9 is CLOSED or if CVT detects residual line voltage.'
      },
      {
        code: 'Q1-BUS1',
        type: 'Bus Disconnector',
        symbol_iec: 'BDS-1',
        rated_specs: '245 kV · 2500 A · 40 kA (3s)',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Manœuvre sous tension permise uniquement si le disjoncteur de couplage est FERMÉ (transfert de barres).',
        interlocking_rule_en: 'On-load operation allowed only if bus coupler breaker is CLOSED (busbar transfer mode).'
      },
      {
        code: 'Q2-BUS2',
        type: 'Bus Disconnector',
        symbol_iec: 'BDS-2',
        rated_specs: '245 kV · 2500 A · 40 kA (3s)',
        normal_state: 'OPEN',
        interlocking_rule_fr: 'Interdit si Q0 est fermé, sauf en phase de couplage actif.',
        interlocking_rule_en: 'Interlocked if Q0 is closed unless coupler loop is fully energized.'
      }
    ],
    protection_ieds_fr: [
      'Protection Principale 1 (Main 1) : Distance numérique ANSI 21/21N (5 zones de mesure mho/quadrilatérale)',
      'Protection Principale 2 (Main 2) : Différentielle de ligne numérique ANSI 87L via liaison optique OPGW',
      'Protection Défaillance Disjoncteur ANSI 50BF (temporisation 150 ms avec réémission vers les barres)',
      'Automate de Réenclenchement Automatique (RAR) mono/tripolaire ANSI 79 avec contrôle de synchro 25'
    ],
    protection_ieds_en: [
      'Main 1 Protection: Numerical distance ANSI 21/21N (5 quadrilateral/mho zones)',
      'Main 2 Protection: Optical current differential ANSI 87L over OPGW fiber channel',
      'Breaker Failure Protection ANSI 50BF (150 ms timer with transfer trip to busbar relays)',
      'Auto-Reclose Automation ANSI 79 (single-phase / three-phase cycles) with synchro-check 25'
    ],
    measurement_interfaces: [
      'Noyau TC 1 (0.2S) : Comptage transactionnel et mesure P, Q, V, I vers SCADA',
      'Noyau TC 2 (5P20) : Chaîne de protection Main 1 (Distance 21)',
      'Noyau TC 3 (5P20) : Chaîne de protection Main 2 (Différentielle 87L)',
      'Noyau TC 4 (Class X) : Protection différentielle de jeu de barres 87B'
    ],
    auxiliary_dependencies: {
      dc_trip_1: 'Batterie 110 Vcc Train A vers Bobine de déclenchement 1 (Shunt Trip Coil 1)',
      dc_trip_2: 'Batterie 110 Vcc Train B vers Bobine de déclenchement 2 (Shunt Trip Coil 2)',
      ac_motor_drive: 'Alimentation 400 Vca pour moteur de réarmement du ressort disjoncteur et moteurs sectionneurs',
      ups_telecom: 'Onduleur 230 Vca pour routeurs optiques multiplexeurs SDH/MPLS de la protection 87L'
    },
    earthing_safety_fr: 'Mise à la terre de chaque pôle et charpente métallique au quadrillage IEEE 80 par méplat cuivre étamé 95 mm².',
    earthing_safety_en: 'Solid bonding of each phase pole and steel pedestal to the IEEE 80 buried earth grid via 95 mm² tinned copper strap.',
    failure_modes: [
      {
        mode_fr: 'Fuite lente de gaz SF6 sur le pôle B du disjoncteur',
        mode_en: 'Slow SF6 gas leakage on Circuit Breaker Pole B',
        mitigation_fr: 'Seuil 1 : Alarme SCADA de regonflage. Seuil 2 : Blocage électrique automatique des manœuvres.',
        mitigation_en: 'Stage 1: SCADA replenishment alarm. Stage 2: Automatic electrical and mechanical lockout.'
      },
      {
        mode_fr: 'Refus d\'ouverture du disjoncteur lors d\'un court-circuit de ligne',
        mode_en: 'Circuit Breaker failure to trip during a severe line fault',
        mitigation_fr: 'Activation du relais 50BF au bout de 150 ms pour déclencher tous les disjoncteurs du jeu de barres associé.',
        mitigation_en: 'Breaker failure 50BF timer fires at 150 ms to trip all adjacent breakers on that busbar.'
      }
    ]
  },
  {
    id: 'BAY_TRAFO_225',
    code: 'TRAV-TRANSFO-225',
    name_fr: 'Travée Transformateur de Puissance 225 kV',
    name_en: '225 kV Power Transformer Bay',
    category: 'TRANSFORMER',
    purpose_fr: 'Raccorde le primaire du transformateur de puissance au jeu de barres HTB, intégrant la protection différentielle 87T et les dispositifs d\'inrush.',
    purpose_en: 'Connects the primary winding of the power transformer to the HV busbar, incorporating 87T differential protection and inrush blocking.',
    flow_stages: [
      {
        sequence: 1,
        title_fr: 'Sélecteurs de Jeux de Barres',
        title_en: 'Busbar Selectors',
        apparatus_code: 'Q1/Q2-TR',
        apparatus_name_fr: 'Sectionneurs d\'aiguillage vers Barres 1 et 2',
        apparatus_name_en: 'Bus 1 & Bus 2 selector disconnectors',
        role_fr: 'Permet d\'alimenter le transformateur depuis la Barre 1 ou la Barre 2.',
        role_en: 'Selects whether the transformer is fed from Busbar 1 or Busbar 2.'
      },
      {
        sequence: 2,
        title_fr: 'Disjoncteur Transformateur HT',
        title_en: 'HV Transformer Circuit Breaker',
        apparatus_code: 'Q0-TR',
        apparatus_name_fr: 'Disjoncteur 245 kV de puissance',
        apparatus_name_en: '245 kV power transformer circuit breaker',
        role_fr: 'Enclenche le transformateur (tenue au courant d\'enclenchement magnétisant inrush) et élimine les défauts internes.',
        role_en: 'Energizes transformer withstanding inrush transient currents and clears internal faults.'
      },
      {
        sequence: 3,
        title_fr: 'Mesure de Courant Primaire',
        title_en: 'Primary Current Measurement',
        apparatus_code: 'T1-CT-TR',
        apparatus_name_fr: 'Transformateur de courant côté HT',
        apparatus_name_en: 'HV side current transformer set',
        role_fr: 'Envoie les courants primaires au relais de protection différentielle 87T.',
        role_en: 'Feeds primary currents to 87T biased differential relay.'
      },
      {
        sequence: 4,
        title_fr: 'Sectionneur de Séparation Transformateur',
        title_en: 'Transformer Isolator',
        apparatus_code: 'Q9-TR',
        apparatus_name_fr: 'Sectionneur de tête de transformateur',
        apparatus_name_en: 'Transformer disconnect switch',
        role_fr: 'Isole physiquement la cuve du transformateur pour les opérations de maintenance d\'huile et régleur.',
        role_en: 'Provides physical separation of transformer tank for oil sampling and OLTC overhauls.'
      },
      {
        sequence: 5,
        title_fr: 'Parafoudres de Protection Cuve',
        title_en: 'Surge Arresters at Bushings',
        apparatus_code: 'F1-SA-TR',
        apparatus_name_fr: 'Parafoudres 225 kV à proximité immédiate des traversées',
        apparatus_name_en: '225 kV surge arresters directly adjacent to bushings',
        role_fr: 'Protège l\'isolation solide et liquide du transformateur contre les surtensions raides.',
        role_en: 'Shields solid cellulose paper and mineral oil insulation against steep-front surges.'
      }
    ],
    primary_apparatus: [
      {
        code: 'Q0-TR',
        type: 'Circuit Breaker',
        symbol_iec: 'CB-TR',
        rated_specs: '245 kV · 3150 A · 40 kA · Synchronisation d\'enclenchement au zéro de tension (Point-on-Wave)',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Interdit à l\'enclenchement si un relais Buchholz, différentielle 87T ou pression cuve est verrouillé (Lockout 86).',
        interlocking_rule_en: 'Closing strictly blocked if Buchholz, 87T, or PRD trip matrix is locked out (ANSI 86).'
      },
      {
        code: 'Q9-TR',
        type: 'Disconnector',
        symbol_iec: 'DS-TR',
        rated_specs: '245 kV · 3150 A · 40 kA (3s)',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Interdit à l\'ouverture si Q0-TR est fermé.',
        interlocking_rule_en: 'Opening prohibited if Q0-TR breaker is closed.'
      }
    ],
    protection_ieds_fr: [
      'Protection Différentielle Transformateur ANSI 87T (avec retenue d\'harmonique 2 pour l\'enclenchement et harmonique 5 pour la sursaturation)',
      'Protection de Terre Restreinte ANSI 87N / REF pour les défauts phase-terre internes profonds',
      'Protection Masse-Cuve transformateur (Tank-to-Earth Leakage)',
      'Relais Buchholz mécanique de cuve et régleur en charge (Alarme dégagement gazeux + Déclenchement coup d\'huile)',
      'Limiteur de surpression mécanique PRD (Pressure Relief Device)',
      'Contrôleurs thermiques OTI / WTI (Températures huile et enroulements hot-spot)'
    ],
    protection_ieds_en: [
      'Biased Transformer Differential ANSI 87T (with 2nd harmonic inrush and 5th harmonic overfluxing restraint)',
      'Restricted Earth Fault ANSI 87N / REF for internal phase-to-ground winding faults near neutral',
      'Tank-to-Ground Leakage Protection',
      'Mechanical Buchholz gas and oil surge relay (gas accumulation alarm + surge trip)',
      'Mechanical Pressure Relief Device (PRD)',
      'Oil and Winding Temperature Indicators (OTI / WTI hot-spot calculation)'
    ],
    measurement_interfaces: [
      'TC HT : Mesure différentielle I_HV (Vector Group Y)',
      'TC MT/BT : Mesure différentielle I_LV (Vector Group d11)',
      'TC Neutre : Mesure I_neutral pour la protection REF 87N',
      'Sondes thermiques PT100 plongées dans les doigts de gant de l\'huile'
    ],
    auxiliary_dependencies: {
      dc_trip_1: 'Batterie Train A pour déclenchement simultané disjoncteur HT et disjoncteur MT',
      dc_trip_2: 'Batterie Train B pour déclenchement de secours et alarme incendie cuve',
      ac_motor_drive: 'Alimentation 400 Vca pour les motopompes et motoventilateurs des aéroréfrigérants',
      ups_telecom: 'Alimentation du régulateur automatique de tension (AVR) du régleur OLTC'
    },
    earthing_safety_fr: 'Cuve mise à la terre en deux points opposés via tresses souples, neutre raccordé à la terre soit directement soit via résistance limitatrice RMN.',
    earthing_safety_en: 'Tank bonded to earth grid at dual diagonal points; neutral grounded solidly or through NGR resistor.',
    failure_modes: [
      {
        mode_fr: 'Court-circuit entre spires d\'un même enroulement',
        mode_en: 'Inter-turn winding insulation short-circuit',
        mitigation_fr: 'Détection instantanée par la différentielle 87T et le relais Buchholz avec déclenchement des deux côtés du transformateur.',
        mitigation_en: 'High-speed tripping by 87T differential and Buchholz surge, clearing both HV and MV breakers.'
      }
    ]
  },
  {
    id: 'BAY_COUPLER_225',
    code: 'TRAV-COUPLAGE-225',
    name_fr: 'Travée de Couplage Jeux de Barres 225 kV',
    name_en: '225 kV Bus Coupler Bay',
    category: 'COUPLER',
    purpose_fr: 'Relie électriquement la Barre 1 et la Barre 2, permettant de basculer des départs d\'une barre à l\'autre sans coupure d\'alimentation et d\'égaliser les charges.',
    purpose_en: 'Electrically bonds Bus 1 and Bus 2 together, allowing live, uninterrupted on-load feeder transfer between busbars and load balancing.',
    flow_stages: [
      {
        sequence: 1,
        title_fr: 'Sectionneur de Raccordement Barre 1',
        title_en: 'Bus 1 Connecting Disconnector',
        apparatus_code: 'Q1-CPL',
        apparatus_name_fr: 'Sectionneur Barre 1',
        apparatus_name_en: 'Bus 1 Coupler Disconnector',
        role_fr: 'Connecte la travée de couplage à la Barre 1.',
        role_en: 'Connects the coupling apparatus to Busbar 1.'
      },
      {
        sequence: 2,
        title_fr: 'Disjoncteur de Couplage',
        title_en: 'Coupler Circuit Breaker',
        apparatus_code: 'Q0-CPL',
        apparatus_name_fr: 'Disjoncteur de couplage 225 kV',
        apparatus_name_en: '225 kV Bus Coupler Circuit Breaker',
        role_fr: 'Établit ou interrompt le parallèle entre les deux jeux de barres.',
        role_en: 'Closes or interrupts the electrical parallel loop between both busbars.'
      },
      {
        sequence: 3,
        title_fr: 'Mesure de Courant de Couplage',
        title_en: 'Coupler Current Measurement',
        apparatus_code: 'T1-CT-CPL',
        apparatus_name_fr: 'Transformateur de courant de couplage',
        apparatus_name_en: 'Bus coupler current transformer',
        role_fr: 'Fournit la valeur du courant d\'échange pour la protection différentielle de barres 87B.',
        role_en: 'Supplies tie current measurements to the centralized 87B busbar differential protection scheme.'
      },
      {
        sequence: 4,
        title_fr: 'Sectionneur de Raccordement Barre 2',
        title_en: 'Bus 2 Connecting Disconnector',
        apparatus_code: 'Q2-CPL',
        apparatus_name_fr: 'Sectionneur Barre 2',
        apparatus_name_en: 'Bus 2 Coupler Disconnector',
        role_fr: 'Connecte la travée de couplage à la Barre 2.',
        role_en: 'Connects the coupling apparatus to Busbar 2.'
      }
    ],
    primary_apparatus: [
      {
        code: 'Q0-CPL',
        type: 'Circuit Breaker',
        symbol_iec: 'CB-CPL',
        rated_specs: '245 kV · 3150 A · 40 kA · Avec synchro-coupleur ANSI 25',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Fermeture subordonnée à la concordance de phase et tension entre Barre 1 et Barre 2 (relais 25).',
        interlocking_rule_en: 'Closing permissive requires synchro-check verification between Bus 1 and Bus 2.'
      },
      {
        code: 'Q1-CPL',
        type: 'Disconnector',
        symbol_iec: 'DS-CPL1',
        rated_specs: '245 kV · 3150 A · 40 kA (3s)',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Ne peut être manœuvré que si Q0-CPL est ouvert, sauf si Q2-CPL est déjà fermé et le courant nul.',
        interlocking_rule_en: 'Interlocked if Q0-CPL is closed carrying through current.'
      },
      {
        code: 'Q2-CPL',
        type: 'Disconnector',
        symbol_iec: 'DS-CPL2',
        rated_specs: '245 kV · 3150 A · 40 kA (3s)',
        normal_state: 'CLOSED',
        interlocking_rule_fr: 'Ne peut être manœuvré que si Q0-CPL est ouvert.',
        interlocking_rule_en: 'Interlocked if Q0-CPL is closed.'
      }
    ],
    protection_ieds_fr: [
      'Protection Différentielle de Barres ANSI 87B (Intégration du TC de couplage pour la séparation des zones Barre 1 et Barre 2)',
      'Protection à maximum de courant de secours ANSI 50/51 sur le couplage',
      'Protection Défaillance Disjoncteur ANSI 50BF'
    ],
    protection_ieds_en: [
      'Busbar Differential Scheme ANSI 87B (coupler CT delineates Zone 1 and Zone 2 boundaries)',
      'Overcurrent backup protection ANSI 50/51 on coupler circuit',
      'Breaker Failure Protection ANSI 50BF'
    ],
    measurement_interfaces: [
      'TC de couplage classe X haute impulsion pour la zone 1 et zone 2 de barres',
      'Mesure du transit actif/réactif entre jeux de barres'
    ],
    auxiliary_dependencies: {
      dc_trip_1: 'Alimentation 110 Vcc Train A pour déclenchement rapide',
      dc_trip_2: 'Alimentation 110 Vcc Train B pour redondance',
      ac_motor_drive: 'Alimentation 400 Vca pour les mécanismes moteurs',
      ups_telecom: 'Synchronisation horaire PTP IEEE 1588'
    },
    earthing_safety_fr: 'Sectionneurs de terre installés de part et d\'autre du disjoncteur pour consignation complète de la travée.',
    earthing_safety_en: 'Earth switches installed on both sides of coupler breaker for safe isolated maintenance.',
    failure_modes: [
      {
        mode_fr: 'Défaut interne sur la travée de couplage (ex. amorçage traversée)',
        mode_en: 'Internal flashover within coupler bay apparatus',
        mitigation_fr: 'La protection 87B déclenche simultanément les disjoncteurs des deux jeux de barres pour éliminer le défaut.',
        mitigation_en: '87B bus differential clears both bus sections simultaneously to isolate the cross-zone fault.'
      }
    ]
  }
];
