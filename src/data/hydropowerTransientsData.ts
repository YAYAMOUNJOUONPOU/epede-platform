/**
 * EPEDE HYDROPOWER MASTER WORKBENCH — STEP 6: TRANSIENTS, FAILURE PROPAGATION & SCADA DISPATCH
 * Authoritative Data Definitions & Transient Physics Models
 * Domain: D01 — Generation | Technology: Hydropower Transients & Dispatch
 * Standards: IEC 60041, IEC 60193, IEC 61362, IEEE C37.102, IEEE 125, ASCE Manual 79
 */

import { HydroFailureScenario, HydroSubsystemId, HydroUnitOperatingState } from '../types/hydropower';

// ============================================================================
// 1. EXTENDED CAUSAL FAILURE PROPAGATION SCENARIOS (SECTION 43 & STEP 6)
// ============================================================================

export const EXTENDED_HYDRO_FAILURE_SCENARIOS: HydroFailureScenario[] = [
  {
    id: 'load_rejection_waterhammer',
    title: {
      fr: 'Délestage Brutal de Charge à 100% & Coup de Bélier',
      en: 'Full 100% Load Rejection & Waterhammer Transient',
    },
    rootCause: 'Déclenchement intempestif de la ligne d\'évacuation 225 kV lors d\'un court-circuit orageux externe alors que la turbine Francis débitait 70 MW à pleine charge.',
    affectedSubsystems: ['H31', 'H15', 'H09', 'H11', 'H07', 'H05', 'H06'],
    standardsReference: ['IEC 60041 §10', 'IEC 61362', 'ASCE Manual 79', 'IEEE 125'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'electrical',
        triggerEvent: 'Ouverture instantanée du disjoncteur réseau 225 kV (protection distance ANSI 21)',
        physicalManifestation: 'Effondrement du couple résistant électrique de 70 MW à 0 MW en 40 millisecondes. Puissance de sortie nulle sur les barres.',
        instrumentationDetection: 'Transducteurs de puissance active MW (H19) mesurent P = 0. TC de groupe mesurent chute de courant I = 0 A.',
        protectionReaction: 'Relais d\'ilotage 81U/81O et relais de survitesse 12 armés. Signal "Délestage Charge" transmis au régulateur H11.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Déséquilibre brutal de couple & emballement dynamique du rotor',
        physicalManifestation: 'Le couple hydraulique moteur non équilibré accélère la ligne d\'arbre à dn/dt = 135 rpm/s jusqu\'à atteindre 142% de la vitesse nominale (710 rpm).',
        instrumentationDetection: 'Capteurs magnétiques de vitesse sur bague dentée (H08) détectent le dépassement du seuil de survitesse (115% puis 130%).',
        protectionReaction: 'Régulateur de vitesse H11 ordonne la fermeture rapide d\'urgence des servomoteurs de directrices en 4.5 secondes.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'hydraulic',
        triggerEvent: 'Fermeture d\'urgence des directrices & onde de choc de coup de bélier (Allievi)',
        physicalManifestation: 'L\'arrêt brutal de la colonne d\'eau de 140 m³/s génère une onde de pression se propageant à a = 1050 m/s vers l\'amont (+34% de surpression hydrostatique).',
        instrumentationDetection: 'Capteurs piézorésistifs en entrée bâche spirale mesurent un pic de pression à 23.5 bar (pression nominale 17.5 bar).',
        protectionReaction: 'Soupapes de décharge synchronisées s\'entrouvrent pour écrêter le front d\'onde et protéger les viroles d\'acier.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'hydraulic',
        triggerEvent: 'Oscillation de masse dans la cheminée d\'équilibre (H06)',
        physicalManifestation: 'Le volume d\'eau refoulé monte de +8.4 mètres dans le puits de la cheminée d\'équilibre, amorçant une onde pendulaire amortie de période T = 42 s.',
        instrumentationDetection: 'Capteur de niveau radar H06 confirme la montée rapide et l\'absence de débordement sous la crête de sécurité.',
        protectionReaction: 'Amortissement visqueux de l\'étranglement bidirectionnel maintenant le gradient d\'onde sous 0.8 bar/s.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 5,
        domainLayer: 'control',
        triggerEvent: 'Stabilisation de la vitesse à vide ou fermeture complète étanche',
        physicalManifestation: 'Vitesse rotor ralentie et stabilisée à 500 rpm (50.0 Hz) par laminage résiduel, machine prête à la resynchronisation réseau.',
        instrumentationDetection: 'Fréquencemètre numérique confirme 50.0 Hz ± 0.15 Hz. Température des patins de butée stabilisée à 62°C.',
        protectionReaction: 'Statut SCADA bascule en "Groupe Déconnecté Prêt au Couplage" (Black-Start capable).',
        resultingPlantState: 'available',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Vérifier visuellement l\'absence de microfissures sur les viroles métalliques et les massifs d\'ancrage en béton de la conduite forcée.',
        'Contrôler le bon état des goupilles de cisaillement et biellettes de liaison du cercle de vannage des directrices.',
        'Vérifier que le niveau d\'eau dans la cheminée d\'équilibre s\'est stabilisé à sa cote hydrostatique de repos avant toute relance.',
        'Inspecter l\'arbre et les accouplements par magnétoscopie en cas de survitesse supérieure à 150% de la vitesse nominale.',
      ],
      en: [
        'Inspect penstock structural anchor blocks, expansion bellows, and steel shells for permanent deformation or micro-cracks.',
        'Examine wicket gate linkage shear pins, servomotor piston rods, and eccentric guide pins for mechanical bending.',
        'Confirm surge tank water level has damped back to quiescent hydrostatic reservoir head before approving unit restart.',
        'Perform non-destructive magnetic particle inspection on shaft coupling bolts if overspeed exceeded 150% rated.',
      ],
    },
  },
  {
    id: 'cooling_failure',
    title: {
      fr: 'Perte Totale du Circuit d\'Eau de Refroidissement Groupe',
      en: 'Complete Generator Cooling Water Failure & Thermal Trip',
    },
    rootCause: 'Rupture d\'accouplement de la motopompe primaire de refroidissement brut avec échec de démarrage de la pompe de secours suite à un collage de contacteur MCC.',
    affectedSubsystems: ['H12', 'H09', 'H13', 'H17', 'H26'],
    standardsReference: ['IEC 60034-1 §8', 'IEEE C37.102 §4.3', 'IEC 62270'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'auxiliary',
        triggerEvent: 'Défaillance mécanique de la pompe primaire d\'eau brute (H12)',
        physicalManifestation: 'Arrêt complet de l\'irrigation des échangeurs tubulaires air-eau du stator et des réfrigérants d\'huile de butée.',
        instrumentationDetection: 'Débitmètre électromagnétique H12 enregistre chute de débit Q < 15 m³/h. Pressostat amont chute sous 1.2 bar.',
        protectionReaction: 'Alarme sonore en salle de commande SCADA. Ordre automatique de basculement sur la pompe motrice 2 (qui échoue).',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Échauffement progressif du cuivre statorique et du film d\'huile des patins de butée',
        physicalManifestation: 'La température des enroulements monte avec un gradient de +2.8°C/min. L\'huile de butée atteint 78°C (viscosité réduite).',
        instrumentationDetection: 'Sondes duplex PT100 encastrées dans les encoches statoriques mesurent 128°C (seuil alerte 120°C dépassé).',
        protectionReaction: 'Automate H18 émet un ordre de délestage automatique de puissance à 50% (35 MW) pour limiter les pertes Joule.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'protection',
        triggerEvent: 'Dépassement du seuil de protection thermique image d\'enroulement (ANSI 49G)',
        physicalManifestation: 'Température du cuivre atteint 145°C, menaçant la tenue diélectrique de la résine époxy-mica classe F.',
        instrumentationDetection: 'Relais numérique multifonction de groupe H17 valide la temporisation de l\'ANSI 49G (courbe thermique I²t saturée).',
        protectionReaction: 'Déclenchement du relais bistable de verrouillage 86G1 (Urgence Groupe).',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'electrical',
        triggerEvent: 'Ouverture du disjoncteur GCB 52G & Désexcitation rotorique',
        physicalManifestation: 'Ouverture des pôles du GCB en 55 ms, ouverture de l\'interrupteur de champ 41 et décharge de l\'énergie inductive du rotor.',
        instrumentationDetection: 'TC statoriques mesurent courant à 0 A. THT côté départ 225 kV reste sous tension.',
        protectionReaction: 'Séparation électrique totale sans injection de puissance résiduelle.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 5,
        domainLayer: 'hydraulic',
        triggerEvent: 'Fermeture contrôlée des directrices par le régulateur H11',
        physicalManifestation: 'Vanne d\'admission fermée, vitesse ramenée à 25%, application progressive des vérins de freins mécaniques à garniture céramique.',
        instrumentationDetection: 'Capteur de rotation confirme l\'arrêt complet (0 rpm).',
        protectionReaction: 'Ventilation naturelle maintenue par les extracteurs de toiture pour dissiper la chaleur emmagasinée.',
        resultingPlantState: 'stopped',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Dépanner le contacteur de puissance MCC de la motopompe auxiliaire n°2 et remplacer le fusible de commande.',
        'Contrôler la propreté des crépines d\'aspiration d\'eau du fleuve et nettoyer le filtre duplex colmaté.',
        'Laisser refroidir les bobinages statoriques sous 80°C avant toute tentative de réarmement du relais 86G1.',
        'Mesurer la résistance d\'isolement du stator (mégohmmètre 5 kV) pour valider l\'absence de claquage thermique de l\'isolation.',
      ],
      en: [
        'Repair the auxiliary pump contactor coil on the MCC and replace the blown control circuit fuse.',
        'Backwash the duplex river raw water strainers and check for silt/debris blockage.',
        'Allow stator windings to cool below 80°C under forced draft ventilation before resetting the 86G1 lockout relay.',
        'Perform 5 kV DC insulation resistance and polarization index (PI) testing to verify stator dielectric integrity.',
      ],
    },
  },
  {
    id: 'transformer_differential',
    title: {
      fr: 'Défaut Interne Transformateur Élévateur (87T) & Déclenchement d\'Urgence',
      en: 'GSU Transformer Internal Fault (87T) & Total Plant Isolation',
    },
    rootCause: 'Amorçage diélectrique entre spires de l\'enroulement haute tension 225 kV suite à un vieillissement accéléré de l\'huile minérale et humidité excessive.',
    affectedSubsystems: ['H14', 'H15', 'H09', 'H17', 'H22'],
    standardsReference: ['IEEE C57.12.00', 'IEEE C37.91', 'NFPA 851', 'IEC 60076-1'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'electrical',
        triggerEvent: 'Court-circuit franc entre spires HT sur la phase V du transformateur 11/225 kV',
        physicalManifestation: 'Arc électrique intense sous huile dégageant une onde de pression mécanique et dissociant l\'huile en hydrogène et acétylène.',
        instrumentationDetection: 'TC tore 11 kV et TC 225 kV mesurent un courant différentiel Id = 4.2 In (seuil de déclenchement 0.3 In).',
        protectionReaction: 'Relais différentiel numérique de transformateur ANSI 87T émet l\'ordre de déclenchement instantané en 18 millisecondes.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'protection',
        triggerEvent: 'Enclenchement du relais bistable de verrouillage 86T (Lockout Transformateur)',
        physicalManifestation: 'Bascule mécanique des contacts d\'isolement du 86T, verrouillant toute possibilité de réenclenchement automatique.',
        instrumentationDetection: 'Contacts auxiliaires signalent le verrouillage à l\'automate de poste SCADA.',
        protectionReaction: 'Déclenchement simultané : GCB 52G (11 kV), Disjoncteur HT 225 kV poste, Désexcitateur 41 et arrêt d\'urgence turbine.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'auxiliary',
        triggerEvent: 'Actionnement mécanique du clapet du relais Buchholz (ANSI 63)',
        physicalManifestation: 'La vague d\'huile projetée vers le conservateur pousse le flotteur inférieur et ferme le contact de déclenchement rapide.',
        instrumentationDetection: 'Relais Buchholz mécanique H14 confirme le défaut interne sévère avec dégagement massif de gaz combustibles.',
        protectionReaction: 'Confirmation redondante du déclenchement sur la bobine à émission de tension 2 du disjoncteur HT.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'balance_of_plant',
        triggerEvent: 'Déclenchement du système de pulvérisation d\'eau déluge anti-incendie (H22)',
        physicalManifestation: 'Ouverture de la vanne déluge : projection de 10.2 L/min/m² d\'eau pulvérisée sous pression sur les parois de la cuve du transformateur.',
        instrumentationDetection: 'Pressostats de la rampe incendie confirment l\'inondation de protection de la cellule transformateur.',
        protectionReaction: 'Pompe incendie diesel H22 démarre automatiquement pour maintenir la pression de barrage.',
        resultingPlantState: 'stopped',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Interdiction absolue de remettre sous tension le transformateur sans prélèvement et analyse chromatographique des gaz dissous (DGA).',
        'Réaliser des mesures de SFRA (réponse en fréquence de balayage), de résistance d\'enroulement en continu et de tangente delta.',
        'Vidanger l\'huile du bac de rétention étanche vers la fosse déshuileuse pour éviter toute pollution environnementale de la rivière.',
        'Remplacer le transformateur par l\'unité de secours ou procéder au rebobinage complet en atelier spécialisé.',
      ],
      en: [
        'Strict prohibition against re-energizing the GSU unit without oil sampling and DGA chromatography test confirmation.',
        'Conduct Sweep Frequency Response Analysis (SFRA), winding DC resistance, and capacitance / tan-delta bushing testing.',
        'Drain oil containment bund via oil-water separator to prevent environmental contamination of the river.',
        'Mobilize spare single-phase/three-phase step-up transformer unit or prepare damaged unit for factory rewind.',
      ],
    },
  },
  {
    id: 'governor_oil_loss',
    title: {
      fr: 'Chute de Pression Huile Régulation (H11) & Fermeture Gravitaire',
      en: 'Governor Hydraulic Oil Pressure Loss & Gravity Counterweight Closure',
    },
    rootCause: 'Rupture d\'une tuyauterie flexible haute pression du groupe motopompe oléohydraulique 40 bar alimentant les servomoteurs de directrices.',
    affectedSubsystems: ['H11', 'H07', 'H17', 'H26'],
    standardsReference: ['IEC 61362 §5', 'IEEE 125', 'IEC 62270'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'control',
        triggerEvent: 'Fuite massive et rupture du circuit oléodynamique 40 bar du régulateur H11',
        physicalManifestation: 'Chute de pression dans l\'accumulateur oléopneumatique à azote de 42 bar à moins de 18 bar en 6 secondes.',
        instrumentationDetection: 'Pressostats analogiques H11 détectent le franchissement du seuil très bas (P < 25 bar).',
        protectionReaction: 'Alarme prioritaire SCADA "Pression Huile Régulateur Critique". Blocage de l\'ordre d\'ouverture.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Relâchement du vérin de maintien & descente du contrepoids de sécurité',
        physicalManifestation: 'La perte d\'assistance hydraulique libère le contrepoids mécanique gravitaire de 8 tonnes attelé au cercle de vannage.',
        instrumentationDetection: 'Capteurs LVDT de recopie de position directrices enregistrent une fermeture ininterrompue vers 0%.',
        protectionReaction: 'L\'action purement gravitaire et passive garantit la fermeture des directrices sans apport d\'énergie électrique.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'electrical',
        triggerEvent: 'Déclenchement par relais de retour de puissance (ANSI 32R)',
        physicalManifestation: 'La fermeture des directrices annule le débit d\'eau : la génératrice passe en moteur synchrone entraîné par le réseau.',
        instrumentationDetection: 'Relais 32R détecte une absorption de puissance active P = -1.8 MW pendant 3 secondes consécutives.',
        protectionReaction: 'Déclenchement immédiat du disjoncteur groupe 52G pour protéger le distributeur et la roue contre la cavitation.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'hydraulic',
        triggerEvent: 'Vanne de tête papillon/sphérique (H05) descendue en position étanche',
        physicalManifestation: 'Fermeture de la vanne papillon de pied de conduite par son propre contrepoids hydraulique amorti.',
        instrumentationDetection: 'Fin de course inductif confirme la fermeture mécanique étanche à 100%.',
        protectionReaction: 'Isolement hydraulique total de la bâche spirale.',
        resultingPlantState: 'stopped',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Remplacer la tuyauterie flexible défectueuse par une canalisation en acier inoxydable rigide sans soudure.',
        'Recharger le bac d\'huile hydraulique ISO VG 46 et procéder à une purge d\'air complète des servomoteurs.',
        'Vérifier la pression de gonflage d\'azote des vessies des accumulateurs oléopneumatiques.',
        'Tester à vide la manœuvre complète d\'ouverture/fermeture gravitaire avant tout redémarrage du groupe.',
      ],
      en: [
        'Replace burst flexible hydraulic hose with rigid seamless stainless-steel piping conforming to ISO 8434.',
        'Replenish governor oil reservoir with filtered ISO VG 46 hydraulic fluid and bleed servomotor air cushions.',
        'Inspect pre-charge nitrogen gas bladder pressure in the oleopneumatic pressure vessels.',
        'Conduct full-stroke deadweight gravity closing time test prior to releasing unit for startup.',
      ],
    },
  },
  {
    id: 'loss_of_excitation_field',
    title: {
      fr: 'Perte Totale d\'Excitation Rotorique (ANSI 40) & Régime Asynchrone',
      en: 'Loss of Excitation Field (ANSI 40) & Asynchronous Operation',
    },
    rootCause: 'Claquer un bras de thyristors du pont redresseur d\'excitation statique H10 avec déclenchement intempestif de l\'interrupteur de champ 41.',
    affectedSubsystems: ['H10', 'H09', 'H17', 'H31'],
    standardsReference: ['IEEE C37.102 §4.5', 'IEC 60034-1', 'IEEE 421.5'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'electrical',
        triggerEvent: 'Ouverture du disjoncteur de champ 41 et coupure du courant d\'excitation rotor If',
        physicalManifestation: 'Le courant inducteur continu s\'annule en 80 ms. Le flux magnétique rotorique décroît exponentiellement.',
        instrumentationDetection: 'Shunt de mesure de courant rotorique mesure If = 0 A. Transducteur de tension d\'excitation Vf = 0 V.',
        protectionReaction: 'Alarme régulateur de tension AVR "Perte d\'Excitation". Relais ANSI 40 entre dans sa zone de calcul.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'electrical',
        triggerEvent: 'Inversion du flux réactif & absorption massive de puissance réactive',
        physicalManifestation: 'La machine cesse de fournir des MVAr au réseau 225 kV et commence à absorber jusqu\'à 50 MVAr pour magnétiser son entrefer.',
        instrumentationDetection: 'Varmètre de tranche mesure Q = -52 MVAr. Chute de tension sur le jeu de barres HT 225 kV de 225 kV à 208 kV.',
        protectionReaction: 'Trajectoire de l\'impédance apparente Z vue des bornes pénètre dans le cercle d\'offset mho Zone 1 du relais ANSI 40.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'mechanical',
        triggerEvent: 'Glissement de vitesse & induction de courants parasites dans le rotor',
        physicalManifestation: 'L\'alternateur décroche du synchronisme et fonctionne en génératrice asynchrone avec un glissement s = 1.8% (509 rpm). Échauffement violent des cales d\'encoches rotoriques.',
        instrumentationDetection: 'Capteur de vitesse magnétique mesure n = 509 rpm (fréquence 50.9 Hz rotorique).',
        protectionReaction: 'Temporisation du relais ANSI 40 arrive à échéance (T = 0.25 s) pour éviter tout flambement thermique du rotor.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'protection',
        triggerEvent: 'Déclenchement du disjoncteur 52G par l\'ANSI 40',
        physicalManifestation: 'Séparation électrique de l\'alternateur du réseau interconnecté pour stopper l\'absorption réactive et stabiliser la tension 225 kV.',
        instrumentationDetection: 'Déclenchement 86G confirmé, signalisation au dispatcher national SONATREL.',
        protectionReaction: 'Régulateur de vitesse H11 ramène immédiatement les directrices à l\'ouverture à vide (12%).',
        resultingPlantState: 'available',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Remplacer le module de puissance thyristor endommagé du pont Graetz d\'excitation statique.',
        'Tester la carte de commande électronique d\'allumage des gâchettes et le régulateur automatique de tension (AVR).',
        'Vérifier par endoscopie l\'absence de brûlures électriques sur les frettes et circuits amortisseurs de Leblanc du rotor.',
        'Mesurer la résistance ohmique de l\'enroulement polaire rotorique et tester l\'isolement à la masse.',
      ],
      en: [
        'Replace failed thyristor hockey-puck disc in the static excitation Graetz full-bridge cubicle.',
        'Verify firing pulse gate driver board pulses and recalibrate the Automatic Voltage Regulator (AVR).',
        'Perform visual and borescope inspection of rotor damper bars (amortisseur winding) for localized thermal discoloration.',
        'Measure field winding DC resistance and perform 1 kV DC insulation resistance check to rotor forging.',
      ],
    },
  },
  {
    id: 'cavitation_vortex_surge',
    title: {
      fr: 'Torche de Cavitation dans l\'Aspirateur & Résonance Basse Fréquence',
      en: 'Draft Tube Vortex Rope & Low-Frequency Hydraulic Resonance',
    },
    rootCause: 'Exploitation prolongée de la turbine Francis à charge partielle (40% d\'ouverture directrices) sous forte chute, générant une torche tourbillonnaire de cavitation dans le coude de l\'aspirateur.',
    affectedSubsystems: ['H07', 'H08', 'H06', 'H19', 'H26'],
    standardsReference: ['IEC 60041 §14', 'IEC 60193 §8', 'ASCE Manual 79'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'hydraulic',
        triggerEvent: 'Fonctionnement hors plage garantie à 38% de charge nominale',
        physicalManifestation: 'La composante tangentielle résiduelle de la vitesse à la sortie de la roue crée un vortex en hélice (torche précessionnelle) tournant à 0.28 fois la vitesse synchrone.',
        instrumentationDetection: 'Capteurs piézoélectriques dynamiques dans le cône de l\'aspirateur enregistrent des pulsations de pression cycliques à f = 2.33 Hz.',
        protectionReaction: 'Système de surveillance vibratoire en ligne (H25) émet une alarme niveau 1 "Pulsations Hydrauliques Aspirateur".',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Transmission des pulsations axiales sur le palier de butée et l\'arbre',
        physicalManifestation: 'La précession du vortex induit une poussée axiale cyclique de ±45 tonnes, faisant vibrer la dalle de la centrale à 2.3 Hz.',
        instrumentationDetection: 'Accéléromètres sismiques sur le corps de palier mesurent une vitesse efficace RMS de vibration v = 5.8 mm/s (Zone C ISO 20816-5).',
        protectionReaction: 'Avertissement de résonance structurelle sur le pupitre SCADA. Limitation du temps de séjour en charge partielle.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'auxiliary',
        triggerEvent: 'Ouverture automatique des soupapes d\'aération de l\'ogive de turbine',
        physicalManifestation: 'Injection d\'air comprimé ou aspiration naturelle d\'air atmosphérique au centre de la roue pour casser le vide de cavitation du vortex.',
        instrumentationDetection: 'Débitmètre d\'air confirme injection d\'air. Amortissement du pic de pression de 40% dans l\'aspirateur.',
        protectionReaction: 'Baisse de l\'amplitude des vibrations RMS de 5.8 mm/s à 2.9 mm/s (retour en Zone B admissible).',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'control',
        triggerEvent: 'Ordre de consigne SCADA de franchissement rapide de la zone interdite',
        physicalManifestation: 'Le dispatching ordonne la montée en charge à 75% ou la descente sous 20% pour quitter immédiatement la plage d\'instabilité hydraulique.',
        instrumentationDetection: 'L\'ouverture directrices passe à 78%, la pulsation à 2.3 Hz s\'éteint complètement.',
        protectionReaction: 'Centrale stabilisée en zone de haut rendement hydrodynamique (>93%).',
        resultingPlantState: 'loaded',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Programmer dans le régulateur H11 une rampe d\'évitement automatique interdisant l\'exploitation stabilisée entre 30% et 55% de charge.',
        'Vérifier le bon fonctionnement des clapets anti-retour d\'admission d\'air et la pression de la réserve d\'air comprimé 7 bar.',
        'Inspecter périodiquement les aubes de la roue et le cône de l\'aspirateur pour déceler d\'éventuels cratères d\'érosion de cavitation.',
        'Envisager la pose d\'ailettes stabilisatrices ou de nervures anti-vortex sur les parois du coude d\'aspirateur.',
      ],
      en: [
        'Program an automatic skip-band ramp in governor H11 prohibiting steady-state operation within the 30%–55% rough load zone.',
        'Verify proper sealing and stroke of atmospheric aeration check valves and 7-bar compressed air injection system.',
        'Perform periodic dye-penetrant and ultrasonic inspection of runner blade suction trailing edges for cavitation pitting.',
        'Consider retrofitting vortex splitter fins or runner cone extension baffles to attenuate draft tube swirl precession.',
      ],
    },
  },
];

// ============================================================================
// 2. WATER HAMMER & ALLIEVI TRANSIENT PRESETS & SOLVER
// ============================================================================

export interface WaterHammerParameters {
  plantName: string;
  grossHeadM: number;          // H0 (m)
  flowM3s: number;             // Q0 (m3/s)
  penstockLengthM: number;     // L (m)
  penstockDiameterM: number;   // D (m)
  wallThicknessMm: number;     // e (mm)
  closureTimeS: number;        // Tc (s)
  surgeTankDiameterM: number;  // D_st (m)
  hasSurgeTank: boolean;
  generatorInertiaTm2: number; // GD^2 (t.m^2)
  nominalSpeedRpm: number;     // N0 (rpm)
}

export const WATER_HAMMER_PRESETS: Record<string, WaterHammerParameters> = {
  nachtigal: {
    plantName: 'Nachtigal Amont (Francis 70 MW)',
    grossHeadM: 50.0,
    flowM3s: 142.0,
    penstockLengthM: 185.0,
    penstockDiameterM: 5.4,
    wallThicknessMm: 22.0,
    closureTimeS: 4.8,
    surgeTankDiameterM: 12.0,
    hasSurgeTank: true,
    generatorInertiaTm2: 4200.0,
    nominalSpeedRpm: 500.0,
  },
  songloulou: {
    plantName: 'Songloulou (Francis 48 MW)',
    grossHeadM: 40.0,
    flowM3s: 135.0,
    penstockLengthM: 125.0,
    penstockDiameterM: 5.0,
    wallThicknessMm: 20.0,
    closureTimeS: 4.0,
    surgeTankDiameterM: 10.0,
    hasSurgeTank: false,
    generatorInertiaTm2: 3800.0,
    nominalSpeedRpm: 428.6,
  },
  edea: {
    plantName: 'Edéa (Kaplan/Francis 20-35 MW)',
    grossHeadM: 24.0,
    flowM3s: 160.0,
    penstockLengthM: 70.0,
    penstockDiameterM: 6.2,
    wallThicknessMm: 18.0,
    closureTimeS: 6.0,
    surgeTankDiameterM: 14.0,
    hasSurgeTank: false,
    generatorInertiaTm2: 5100.0,
    nominalSpeedRpm: 214.3,
  },
  highhead_pelton: {
    plantName: 'Centrale Haute Chute Pelton (Typique 80 MW)',
    grossHeadM: 450.0,
    flowM3s: 20.0,
    penstockLengthM: 1150.0,
    penstockDiameterM: 2.1,
    wallThicknessMm: 32.0,
    closureTimeS: 3.2,
    surgeTankDiameterM: 8.0,
    hasSurgeTank: true,
    generatorInertiaTm2: 2400.0,
    nominalSpeedRpm: 750.0,
  },
};

export interface WaterHammerCalculationResult {
  waveSpeedMs: number;          // a (m/s)
  pipeAreaM2: number;           // A (m^2)
  initialVelocityMs: number;    // v0 (m/s)
  reflectionTimeS: number;      // Tr = 2L/a (s)
  closureType: 'rapid' | 'slow';
  joukowskyHeadRiseM: number;   // deltaH_jouk = a*v0 / g
  allieviRelativeSurge: number; // deltaH / H0
  maxHeadM: number;             // Hmax (m)
  maxPressureBar: number;       // Pmax (bar)
  headRisePercent: number;      // %
  surgeTankPeriodS: number;     // T_osc (s)
  surgeTankMaxUpSurgeM: number; // Zmax (m)
  runawaySpeedRpm: number;      // Nmax (rpm)
  speedRisePercent: number;     // %
}

export function computeWaterHammer(params: WaterHammerParameters): WaterHammerCalculationResult {
  const g = 9.81;
  const K_water = 2.1e9; // Pa
  const E_steel = 2.06e11; // Pa
  const rho_water = 1000; // kg/m^3

  const D = params.penstockDiameterM;
  const e = params.wallThicknessMm / 1000;
  const L = params.penstockLengthM;
  const H0 = params.grossHeadM;
  const Q0 = params.flowM3s;
  const Tc = params.closureTimeS;

  // Celerity / Wave speed 'a' via Halliwell elasticity formula
  // a = sqrt( (K/rho) / (1 + (K/E)*(D/e)) )
  const waveSpeedMs = Math.round(
    Math.sqrt((K_water / rho_water) / (1 + (K_water / E_steel) * (D / e)))
  );

  const pipeAreaM2 = (Math.PI * Math.pow(D, 2)) / 4;
  const initialVelocityMs = Q0 / pipeAreaM2;

  // Reflection time Tr = 2L / a
  const reflectionTimeS = (2 * L) / waveSpeedMs;
  const isRapid = Tc <= reflectionTimeS;
  const closureType = isRapid ? 'rapid' : 'slow';

  // Joukowsky surge (rapid closure): deltaH = a * v0 / g
  const joukowskyHeadRiseM = (waveSpeedMs * initialVelocityMs) / g;

  // Allievi parameter theta = a * v0 / (2 * g * H0)
  const theta = (waveSpeedMs * initialVelocityMs) / (2 * g * H0);
  const mu = Tc / reflectionTimeS;

  let allieviRelativeSurge = 0;
  let maxHeadRiseM = 0;

  if (isRapid) {
    maxHeadRiseM = joukowskyHeadRiseM;
    allieviRelativeSurge = maxHeadRiseM / H0;
  } else {
    // Allievi formula for slow linear closure:
    // deltaH/H0 = (2 * theta / mu) / (1 + (theta / mu)) or complete quadratic
    const xi = theta / mu;
    allieviRelativeSurge = (xi / 2) + Math.sqrt(xi + (Math.pow(xi, 2) / 4));
    maxHeadRiseM = allieviRelativeSurge * H0;
  }

  // Effect of surge tank if present: attenuates effective L and pressure front
  if (params.hasSurgeTank) {
    maxHeadRiseM = maxHeadRiseM * 0.45; // ~55% attenuation
    allieviRelativeSurge = maxHeadRiseM / H0;
  }

  const maxHeadM = H0 + maxHeadRiseM;
  const maxPressureBar = (maxHeadM * rho_water * g) / 100000;
  const headRisePercent = (maxHeadRiseM / H0) * 100;

  // Surge tank oscillation period T_osc = 2*pi * sqrt( (L * A_st) / (g * A_pipe) )
  const A_st = (Math.PI * Math.pow(params.surgeTankDiameterM, 2)) / 4;
  const surgeTankPeriodS = params.hasSurgeTank
    ? Math.round(2 * Math.PI * Math.sqrt((L * A_st) / (g * pipeAreaM2)))
    : 0;

  // Max upsurge in surge tank: Zmax = v0 * sqrt( (L * A_pipe) / (g * A_st) )
  const surgeTankMaxUpSurgeM = params.hasSurgeTank
    ? Math.round((initialVelocityMs * Math.sqrt((L * pipeAreaM2) / (g * A_st))) * 10) / 10
    : 0;

  // Turbine runaway speed estimation via mechanical moment of inertia
  // Delta N / N0 ~ (k_mech * P0 * Tc) / (GD^2 * N0^2)
  const P0_kW = (rho_water * g * Q0 * H0 * 0.92) / 1000;
  const runawaySpeedMultiplier = 1 + (1800 * P0_kW * Math.min(Tc, 4.0)) / (params.generatorInertiaTm2 * Math.pow(params.nominalSpeedRpm, 2) + 1e5);
  const clampedMultiplier = Math.min(Math.max(runawaySpeedMultiplier, 1.15), 1.55);
  const runawaySpeedRpm = Math.round(params.nominalSpeedRpm * clampedMultiplier);
  const speedRisePercent = Math.round((clampedMultiplier - 1) * 100);

  return {
    waveSpeedMs,
    pipeAreaM2: Math.round(pipeAreaM2 * 100) / 100,
    initialVelocityMs: Math.round(initialVelocityMs * 100) / 100,
    reflectionTimeS: Math.round(reflectionTimeS * 1000) / 1000,
    closureType,
    joukowskyHeadRiseM: Math.round(joukowskyHeadRiseM * 10) / 10,
    allieviRelativeSurge: Math.round(allieviRelativeSurge * 1000) / 1000,
    maxHeadM: Math.round(maxHeadM * 10) / 10,
    maxPressureBar: Math.round(maxPressureBar * 10) / 10,
    headRisePercent: Math.round(headRisePercent * 10) / 10,
    surgeTankPeriodS,
    surgeTankMaxUpSurgeM,
    runawaySpeedRpm,
    speedRisePercent,
  };
}

// ============================================================================
// 3. CAMEROON CASCADE & GRID CONTINGENCY SCENARIOS
// ============================================================================

export interface GridContingencyScenario {
  id: string;
  title: { fr: string; en: string };
  badge: string;
  category: 'grid_islanding' | 'flood_routing' | 'black_start';
  description: { fr: string; en: string };
  initialCondition: { fr: string; en: string };
  eventTrigger: { fr: string; en: string };
  cascadeImpacts: Array<{
    plantId: string;
    plantName: string;
    flowChange: string;
    powerChange: string;
    operationalAction: { fr: string; en: string };
  }>;
  scadaAlarms: string[];
  gridFrequencyHz: number;
  voltageKV: number;
  mitigationSteps: { fr: string[]; en: string[] };
}

export const CAMEROON_CONTINGENCY_SCENARIOS: GridContingencyScenario[] = [
  {
    id: 'ris_line_trip_120mw',
    title: {
      fr: 'Déclenchement Ligne 225 kV Songloulou - Mangombé (Perte 120 MW)',
      en: '225 kV Songloulou - Mangombé Line Trip (120 MW Deficit & Islanding Risk)',
    },
    badge: 'RIS STABILITY',
    category: 'grid_islanding',
    description: {
      fr: 'Court-circuit biphasé-terre provoqué par un coup de foudre sur le corridor de transport 225 kV isolant une partie de l\'énergie de Songloulou vers le pôle industriel de Douala.',
      en: 'Double phase-to-ground fault caused by lightning stroke on the 225 kV transmission corridor, trapping generated capacity from Songloulou and isolating Douala industrial loads.',
    },
    initialCondition: {
      fr: 'Réseau RIS équilibré : 940 MW injectés, Fréquence 50.02 Hz, Songloulou débitant 320 MW, Nachtigal à 350 MW.',
      en: 'Balanced Southern Interconnected Grid (RIS): 940 MW dispatched, Frequency 50.02 Hz, Songloulou generating 320 MW, Nachtigal at 350 MW.',
    },
    eventTrigger: {
      fr: 'Ouverture des disjoncteurs ligne 225 kV départ L21 à Songloulou et arrivée Mangombé (ANSI 21/50BF).',
      en: 'Tripping of 225 kV line circuit breakers at Songloulou L21 bay and Mangombé substation (ANSI 21 distance).',
    },
    cascadeImpacts: [
      {
        plantId: 'songloulou',
        plantName: 'Songloulou (384 MW)',
        flowChange: '-180 m³/s',
        powerChange: '-120 MW',
        operationalAction: {
          fr: 'Délestage automatique de 3 groupes de 48 MW pour éviter l\'emballement général de la centrale.',
          en: 'Fast automatic unit runback on 3x 48 MW Francis machines to prevent plant-wide overspeed.',
        },
      },
      {
        plantId: 'nachtigal',
        plantName: 'Nachtigal (420 MW)',
        flowChange: '+95 m³/s',
        powerChange: '+65 MW',
        operationalAction: {
          fr: 'Montée en charge rapide de la réserve tournante par réglage primaire de fréquence (statisme bp = 3.5%).',
          en: 'Primary frequency response spinning reserve mobilization via governor speed droop within 4 seconds.',
        },
      },
      {
        plantId: 'edea',
        plantName: 'Edéa (276 MW)',
        flowChange: 'Stable',
        powerChange: '+20 MW',
        operationalAction: {
          fr: 'Alimentation locale prioritaire de l\'aluminerie ALUCAM et écrêtage par délestage de charges secondaires.',
          en: 'Prioritized island feed to ALUCAM smelter and selective shedding of non-priority feeder feeders.',
        },
      },
    ],
    scadaAlarms: [
      'DISJONCTEUR LIGNE 225kV L21 DECLENCHE (ANSI 21)',
      'SOUS-FREQUENCE RESEAU f = 49.18 Hz (ANSI 81U)',
      'RESERVE TOURNANTE NACHTIGAL ACTIVEE (+65 MW)',
      'DELESTAGE ROTORIQUE SONGLOULOU GROUPE 4, 5 & 6',
    ],
    gridFrequencyHz: 49.18,
    voltageKV: 211.5,
    mitigationSteps: {
      fr: [
        'Enclencher le banc de condensateurs HTA au poste de Mangombé pour soutenir la tension écroulée à 211 kV.',
        'Activer le délestage de détresse palier 1 (49.20 Hz) sur les départs non-prioritaires Eneo à Douala.',
        'Synchroniser les groupes de Songloulou sur la ligne de secours 90 kV vers Oyomabang / Édéa.',
        'Réarmer le départ 225 kV après contrôle de synchro-check ANSI 25 et absence de défaut persistant.',
      ],
      en: [
        'Energize MV capacitor banks at Mangombé substation to boost sagging bus voltage from 211 kV back to nominal.',
        'Trigger Stage-1 under-frequency load shedding (49.20 Hz) on non-critical urban feeders in Douala.',
        'Re-route Songloulou power evacuation via 90 kV secondary transmission ring towards Edéa.',
        'Reclose 225 kV transmission line following synchrocheck verification and transient fault clearance.',
      ],
    },
  },
  {
    id: 'sanaga_flood_routing_3800m3s',
    title: {
      fr: 'Gestion de Crue Centennale Sanaga (3 800 m³/s) & Sécurité des Barrages',
      en: 'Sanaga 100-Year Flood Routing (3,800 m³/s) & Multi-Dam Spillway Coordination',
    },
    badge: 'DAM SAFETY',
    category: 'flood_routing',
    description: {
      fr: 'Front de crue tropicale exceptionnel sur le bassin supérieur de la Sanaga menaçant d\'inondation les plates-formes des usines d\'Edéa et de Songloulou sans régulation dynamique.',
      en: 'Major tropical monsoon storm over the upper Sanaga basin threatening downstream powerhouse basements at Edéa and Songloulou without coordinated upstream reservoir retention.',
    },
    initialCondition: {
      fr: 'Retenue de Lom Pangar à 75% de capacité utile (4.5 milliards m³). Débit naturel amont à 3 800 m³/s.',
      en: 'Lom Pangar reservoir holding 75% active storage (4.5 BCM). Incoming natural upstream inflow at 3,800 m³/s.',
    },
    eventTrigger: {
      fr: 'Alerte hydrologique niveau ROUGE émise par la station limnimétrique de Goyoum (débit > 3 500 m³/s).',
      en: 'RED hydrological alert broadcast by Goyoum river gauging station as inflow exceeds 3,500 m³/s.',
    },
    cascadeImpacts: [
      {
        plantId: 'lompangar',
        plantName: 'Lom Pangar (6.0 BCM Stockage)',
        flowChange: '-1 600 m³/s (Écrêtement)',
        powerChange: 'Turbines à 30 MW',
        operationalAction: {
          fr: 'Fermeture des vannes de fond et stockage temporaire de 1 600 m³/s dans le lac de retenue (amortissement de crue).',
          en: 'Throttle bottom outlet gates to retain 1,600 m³/s inside the 6 BCM lake, flattening the downstream flood peak.',
        },
      },
      {
        plantId: 'nachtigal',
        plantName: 'Nachtigal Amont (420 MW)',
        flowChange: '+850 m³/s (Déversement)',
        powerChange: 'Pleine charge 420 MW',
        operationalAction: {
          fr: 'Ouverture progressive des 6 passes déversoir du barrage principal pour évacuer le débit non turbiné.',
          en: 'Progressive opening of 6 radial spillway crest bays to discharge non-turbined excess flow.',
        },
      },
      {
        plantId: 'songloulou',
        plantName: 'Songloulou (384 MW)',
        flowChange: '+980 m³/s (Déversement)',
        powerChange: '384 MW (Chute réduite 36m)',
        operationalAction: {
          fr: 'Manoeuvre des vannes segment de crue. Surveillance de la surélévation du niveau d\'eau aval (perte de chute).',
          en: 'Operate radial spillway gates while monitoring tailrace backwater rise which reduces effective gross head.',
        },
      },
      {
        plantId: 'edea',
        plantName: 'Edéa (276 MW)',
        flowChange: '+1 100 m³/s',
        powerChange: 'Turbines à 240 MW',
        operationalAction: {
          fr: 'Évacuateurs de crue d\'Edéa ouverts à 100%. Batardeaux de protection installés sur les accès salle des machines.',
          en: '100% capacity opening of Edéa spillway gates. Stoplogs deployed to seal lower machine hall access doors.',
        },
      },
    ],
    scadaAlarms: [
      'ALERTE LIMNIMETRIQUE NIVEAU MAX RETENUE LOM PANGAR El. 672.40m',
      'OUVERTURE VANNES SEGMENT NACHTIGAL PASSE 1 A 6 VALIDE',
      'SURVEILLANCE PRESSION PIEZOMETRIQUE CORPS DE BARRAGE SONGLOULOU',
      'SURÉLÉVATION NIVEAU AVAL ÉDÉA : PERTE DE CHUTE NETTE -4.2 METRES',
    ],
    gridFrequencyHz: 50.04,
    voltageKV: 224.8,
    mitigationSteps: {
      fr: [
        'Coordonner les lâchers d\'eau de Lom Pangar avec un déphasage de 48h correspondant au temps de propagation de l\'onde vers Nachtigal.',
        'Surveiller les piézomètres et pendules auscultatoires du barrage poids de Songloulou pour contrôler la sous-pression.',
        'Maintenir les turbines à pleine charge pour maximiser le débit turbiné (décharge utile productrice).',
        'Fermer les clapets anti-retour d\'assainissement d\'Edéa pour éviter les refoulements dans les caniveaux de câbles.',
      ],
      en: [
        'Coordinate Lom Pangar reservoir retention schedule with a 48-hour hydrodynamic propagation lead time to Nachtigal.',
        'Monitor vibrating-wire piezometers and plumb-lines in Songloulou gravity dam to verify foundation uplift stability.',
        'Maintain all hydro units at full generation dispatch to maximize productive water release through turbines.',
        'Seal machine hall sump backflow non-return flap valves at Edéa to prevent cable gallery flooding.',
      ],
    },
  },
  {
    id: 'black_start_ris_restoration',
    title: {
      fr: 'Procédure Black-Start du Réseau Interconnecté Sud (RIS)',
      en: 'Total Blackout & Black-Start Restoration of the Cameroon RIS Grid',
    },
    badge: 'BLACK-START',
    category: 'black_start',
    description: {
      fr: 'Effondrement complet en cascade de la tension du réseau RIS (Blackout général). Restauration autonome amorcée depuis la centrale hydroélectrique d\'Edéa ou Songloulou sans apport d\'énergie extérieure.',
      en: 'Complete collapse of the Southern Interconnected Grid (Total Blackout). Autonomous system restoration initiated from Edéa or Songloulou hydro stations with zero external auxiliary power.',
    },
    initialCondition: {
      fr: 'Réseau RIS hors tension totale (0.0 Hz, 0.0 kV). Auxiliaires des centrales basculés sur groupes électrogènes diesel de secours.',
      en: 'Complete RIS grid de-energization (0.0 Hz, 0.0 kV). Hydro plant auxiliaries running on black-start diesel generators.',
    },
    eventTrigger: {
      fr: 'Ordre de Black-Start national émis par le Dispatching Central SONATREL (Yaoundé / Douala).',
      en: 'National Black-Start authorization order issued by SONATREL Central Grid Dispatch Office.',
    },
    cascadeImpacts: [
      {
        plantId: 'edea',
        plantName: 'Centrale d\'Edéa (Amorçage Primaire)',
        flowChange: '+45 m³/s (Démarrage G1)',
        powerChange: '+15 MW (À vide)',
        operationalAction: {
          fr: 'Démarrage diesel de secours 1 MW, levée vanne de tête, amorçage excitation batterie 110V, mise sous tension barre 10 kV.',
          en: 'Start 1 MW black-start diesel, raise intake gate, flash field from 110V DC battery, energize 10 kV station bus.',
        },
      },
      {
        plantId: 'mangombe_sub',
        plantName: 'Poste 90/225 kV de Mangombé',
        flowChange: 'N/A',
        powerChange: '0 MW (+20 MVAr capacitif)',
        operationalAction: {
          fr: 'Renvoi de tension progressif sur ligne 90 kV à vide. Maîtrise de l\'effet Ferranti et surtension de ligne.',
          en: 'Progressive line energization on un-loaded 90 kV feeder. Regulate Ferranti overvoltage via under-excitation.',
        },
      },
      {
        plantId: 'songloulou',
        plantName: 'Songloulou (Raccordement Tranche 2)',
        flowChange: '+135 m³/s',
        powerChange: '+48 MW (Bloc Charge)',
        operationalAction: {
          fr: 'Réception de la tension de synchronisation, couplage du premier groupe Francis 48 MW et reprise d\'une première poche de charge.',
          en: 'Receive synchronization reference voltage, couple 1st 48 MW unit, and pick up initial urban load block.',
        },
      },
      {
        plantId: 'nachtigal',
        plantName: 'Nachtigal (Connexion 225 kV)',
        flowChange: '+280 m³/s',
        powerChange: '+140 MW (Stabilisation)',
        operationalAction: {
          fr: 'Mise sous tension de la double ligne 225 kV Nachtigal-Bafoussam-Yaoundé et couplage de 2 groupes pour sécuriser la fréquence.',
          en: 'Energize 225 kV Nachtigal-Yaoundé tie-line and synchronize 2x 70 MW units to solidify grid inertia.',
        },
      },
    ],
    scadaAlarms: [
      'BLACKOUT TOTAL RESEAU RIS CONFIRME (TENSION 0.00 kV)',
      'GROUPE DIESEL BLACK-START EDEA DEMARRE ET COUPLÉ AUXILLIAIRES',
      'VANNE DE TETE GROUPE 1 EDEA OUVERTE - ACCELERATION 500 RPM',
      'EXCITATION SUR BATTERIE 110V DC ACTIVEE - TENSION STATOR 10.5 kV',
      'RENVOI TENSION LIGNE 90kV EDEA - MANGOMBE VALIDE SANS DEFAUT',
    ],
    gridFrequencyHz: 50.08,
    voltageKV: 226.4,
    mitigationSteps: {
      fr: [
        'Vérifier que les disjoncteurs de départ de toutes les lignes interconnectées sont ouverts avant le renvoi de tension.',
        'Exploiter l\'alternateur d\'Edéa en régime de sous-excitation (absorption de MVAr) pour neutraliser l\'effet Ferranti des lignes à vide.',
        'Enclencher les blocs de charge par paliers successifs de 10 à 20 MW maximum pour ne pas faire chuter la fréquence sous 49.0 Hz.',
        'Synchroniser Nachtigal et Songloulou dès que la ligne 225 kV est stabilisée pour rétablir une inertie H > 4.5 s.',
      ],
      en: [
        'Verify open position on all feeder line circuit breakers prior to initiating black-start line energization.',
        'Operate initial hydro unit in under-excited mode (absorbing reactive power) to cancel line Ferranti capacitive surge.',
        'Pick up customer loads in segmented blocks under 20 MW to prevent frequency dip below 49.0 Hz.',
        'Synchronize heavy units at Nachtigal and Songloulou as soon as 225 kV line voltage is stable to restore grid inertia H > 4.5 s.',
      ],
    },
  },
];
