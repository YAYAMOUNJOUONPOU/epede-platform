// src/data/thematicJourneysData.ts
// EPEDE Priority #10 - Parcours Guidés Thématiques (Thematic Guided Learning Journeys)
// Comprehensive curriculum of 10 structured engineering journeys with step-by-step progressions,
// interactive quizzes, direct tooling links, and Cameroon field integration.
// Directly features all 7 user-requested flagship pathways + foundational engineering tracks.

import type { UsageLevel } from '../services/UsageLevelContext';

export interface JourneyStep {
  stepNumber: number;
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  deepExplanation: { fr: string; en: string };
  keyFormulas?: string[];
  fieldEngineeringTips?: { fr: string; en: string };
  targetAction: {
    type: 'EQUIPMENT' | 'CALCULATOR' | 'SIMULATION' | 'GRID' | 'SCENARIO' | 'STANDARDS' | 'PROVENANCE';
    targetId: string;
    label: { fr: string; en: string };
  };
  quiz: {
    question: { fr: string; en: string };
    options: Array<{ fr: string; en: string }>;
    correctAnswerIndex: number;
    explanation: { fr: string; en: string };
  };
}

export interface ThematicJourney {
  id: string;
  order: number;
  title: { fr: string; en: string };
  shortTitle: { fr: string; en: string };
  description: { fr: string; en: string };
  targetProfile: UsageLevel;
  iconName: string;
  accentColor: string;
  estimatedMinutes: number;
  prerequisites: { fr: string; en: string };
  learningObjectives: Array<{ fr: string; en: string }>;
  steps: JourneyStep[];
}

export const THEMATIC_JOURNEYS: ThematicJourney[] = [
  // ─────────────────────────────────────────────────────────────
  // PARCOURS 1 (Flagship 1): Comment l’énergie arrive dans un hôpital ?
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-hospital-power',
    order: 1,
    title: {
      fr: 'Comment l’énergie arrive dans un hôpital ?',
      en: 'How Does Electrical Power Reach a Hospital?',
    },
    shortTitle: { fr: 'Alimentation d\'un Hôpital', en: 'Hospital Power Supply' },
    description: {
      fr: 'De la double adduction HTA 20 kV aux blocs opératoires sous régime IT médical (NF C 15-211), maîtrisez la chaîne critique : inverseurs ATS, groupes électrogènes de secours et onduleurs ASI 0 ms.',
      en: 'From dual MV 20 kV incoming feeders to operating rooms under medical IT earthing, master critical continuity: ATS transfer switches, backup diesel gensets, and 0 ms online UPS.',
    },
    targetProfile: 'TECHNICAL',
    iconName: 'Building2',
    accentColor: 'rose',
    estimatedMinutes: 40,
    prerequisites: {
      fr: 'Notions de distribution basse tension et de régimes de neutre (TT, TN, IT).',
      en: 'Basics of low voltage distribution and earthing systems (TT, TN, IT).',
    },
    learningObjectives: [
      {
        fr: 'Comprendre l’architecture en double adduction HTA avec verrouillage mécanique et électrique.',
        en: 'Understand dual MV incoming topology with mechanical and electrical interlocks.',
      },
      {
        fr: 'Dimensionner et paramétrer le basculement automatique Normal/Secours (ATS) en moins de 15 secondes.',
        en: 'Size and configure Automatic Transfer Switches (ATS) with emergency startup under 15s.',
      },
      {
        fr: 'Maîtriser le régime IT médical NF C 15-211 avec transformateur d\'isolement et contrôleur d\'isolement CPI.',
        en: 'Master medical IT regime with isolation transformers and continuous insulation monitors.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'Double Adduction HTA (20 kV) & Cellules SM6 Motorisées',
          en: 'Dual MV (20 kV) Feeder Infeed & Motorized SM6 Cubicles',
        },
        summary: {
          fr: 'Pour un Centre Hospitalier Régional (ex: Hôpital Général de Douala ou Yaoundé), l’alimentation provient de deux départs HTA physiquement séparés du réseau public.',
          en: 'For regional referral hospitals, power is supplied by two physically segregated utility MV feeders.',
        },
        deepExplanation: {
          fr: 'Le poste de livraison dispose de deux cellules interrupteur-sectionneur motorisées (Arrivée 1 et Arrivée 2) et d’un couplage de barres. Un automatisme de permutation de source (ACO) bascule automatiquement sur la source de réserve en moins de 0.8 s en cas de coupure sur la source prioritaire.',
          en: 'The intake substation features two motorized load-break switchgear cubicles and a bus tie. An automatic changeover system transfers to standby feed within 0.8 s upon primary outage.',
        },
        fieldEngineeringTips: {
          fr: 'Vérifier obligatoirement le verrouillage par serrures Ronis entre disjoncteurs pour interdire tout rebouclage accidentel non synchronisé entre deux sources publiques distinctes.',
          en: 'Always verify Castell/Ronis mechanical key interlocks to strictly prevent unsynchronized backfeeding between different grid feeders.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'cellule-hta-sm6',
          label: { fr: 'Examiner la Cellule HTA Modulaire SM6', en: 'Inspect SM6 Modular MV Cubicle' },
        },
        quiz: {
          question: {
            fr: 'Pourquoi les deux arrivées HTA d\'un hôpital font-elles l\'objet d\'un verrouillage mécanique strict ?',
            en: 'Why do the two MV feeders in a hospital require strict mechanical interlocking?',
          },
          options: [
            { fr: 'Pour empêcher le rebouclage accidentel de deux réseaux non synchronisés', en: 'To prevent accidental paralleling of unsynchronized sources' },
            { fr: 'Pour réduire la tension à 12 volts', en: 'To step down voltage to 12 volts' },
            { fr: 'Pour supprimer l\'effet Joule', en: 'To eliminate Joule heating' },
            { fr: 'Pour autoriser le travail sous tension sans gants', en: 'To permit live-line work without PPE' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! Un couplage accidentel de deux réseaux asynchrones provoquerait un court-circuit d\'une violence extrême et la destruction des cellules.',
            en: 'Correct! Accidental paralleling of asynchronous sources would cause a catastrophic bus fault.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'Groupes Électrogènes Diesel & Inverseur Automatique ATS',
          en: 'Diesel Generators & Automatic Transfer Switch (ATS)',
        },
        summary: {
          fr: 'En cas de perte totale des deux sources HTA, deux groupes électrogènes diesel (2 x 1 250 kVA) démarrent automatiquement en moins de 10 secondes.',
          en: 'Upon total grid outage, twin 1,250 kVA diesel gensets auto-start and take over within 10 seconds.',
        },
        deepExplanation: {
          fr: 'L\'automate de démarrage envoie l\'ordre de lancement aux démarreurs électriques 24 Vcc. Dès que la tension atteint 400 V à 50 Hz avec stabilité prouvée (délai de 3 s), l\'inverseur de source motorisé ATS bascule pour réalimenter le TGBT Secouru.',
          en: 'The ATS controller triggers 24 Vdc starters. Once 400 V and 50 Hz are stabilized (3 s qualifying timer), the motorized ATS closes to feed the Essential Switchboard.',
        },
        keyFormulas: [
          'S_GE >= (P_foisonnee / cos phi) * k_demarrage_moteurs',
          't_reprise <= 15 s (exigence NF C 15-211 pour services de sécurité)',
        ],
        fieldEngineeringTips: {
          fr: 'Les cuves journalières doivent assurer au minimum 48 heures d\'autonomie continue sans ravitaillement, avec double circuit de pompage fuel.',
          en: 'Day fuel tanks must guarantee at least 48 hours of autonomous operation with redundant fuel pumps.',
        },
        targetAction: {
          type: 'SCENARIO',
          targetId: 'scen-4-loss-of-auxiliaries',
          label: { fr: 'Lancer le Scénario : Perte Auxiliaires & Basculement ATS', en: 'Launch Scenario: Station Blackout & ATS Transfer' },
        },
        quiz: {
          question: {
            fr: 'Quel est le temps maximal admissible pour la reprise de l\'alimentation de secours par groupe électrogène en milieu hospitalier (classe 15) ?',
            en: 'What is the maximum permissible restoration time for emergency genset pickup in hospitals (Class 15)?',
          },
          options: [
            { fr: '15 secondes', en: '15 seconds' },
            { fr: '5 minutes', en: '5 minutes' },
            { fr: '30 minutes', en: '30 minutes' },
            { fr: '1 heure', en: '1 hour' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Conforme à la norme NF C 15-211 et CEI 60364-7-710, les circuits de sécurité de classe 15 doivent être réalimentés en 15 secondes maximum.',
            en: 'Per NF C 15-211 and IEC 60364-7-710, Class 15 safety circuits must be re-energized within 15 seconds.',
          },
        },
      },
      {
        stepNumber: 3,
        title: {
          fr: 'Onduleurs ASI / UPS Sans Coupure & Régime IT Médical',
          en: 'No-Break Online UPS & Medical Isolated IT Regime',
        },
        summary: {
          fr: 'Pour les blocs opératoires, unités de réanimation et dialyse, la moindre coupure de 100 ms est inacceptable. L\'ASI garantit une coupure de 0 ms.',
          en: 'For operating theaters, ICUs, and dialysis, even 100 ms outage is unacceptable. Double-conversion UPS provides 0 ms interruption.',
        },
        deepExplanation: {
          fr: 'Dans les salles d\'opération (locaux du groupe 2), la norme impose le schéma IT médical : un transformateur d\'isolement 230 V/230 V monophasé sépare galvaniquement le circuit. En cas de premier défaut d\'isolement, le courant de fuite est infime (< quelques mA), évitant le déclenchement immédiat et protégeant le patient contre la macro et micro-électrisation. Un contrôleur permanent d\'isolement (CPI) signale immédiatement l\'anomalie.',
          en: 'In operating theaters (Group 2 rooms), standards mandate medical IT earthing: a 1:1 isolation transformer galvanically decouples the circuit. At first earth fault, leakage current is negligible (< a few mA), avoiding tripping and preventing microshock to patients. An insulation monitor alarms staff.',
        },
        keyFormulas: [
          'I_defaut_premier = U / Z_capacitif_lignes < 5 mA',
          'R_isolement_seuil >= 50 kOhm (déclenchement alarme sonore/visuelle CPI)',
        ],
        fieldEngineeringTips: {
          fr: 'Le transformateur d\'isolement médical doit être équipé de sondes de température PT100 et limité à une puissance nominale de 0.5 à 10 kVA pour limiter les courants capacitifs de fuite.',
          en: 'Medical isolation transformers must include PT100 thermal sensors and be rated between 0.5 and 10 kVA to minimize capacitive leakage.',
        },
        targetAction: {
          type: 'CALCULATOR',
          targetId: 'ups-sizing',
          label: { fr: 'Calculateur Dimensionnement Onduleur ASI', en: 'UPS Capacity & Autonomy Sizing Tool' },
        },
        quiz: {
          question: {
            fr: 'Quel est le comportement du régime IT médical lors de la survenue du premier défaut d\'isolement dans une salle d\'opération ?',
            en: 'How does medical IT earthing behave upon the first insulation fault in an operating room?',
          },
          options: [
            { fr: 'Aucune coupure de courant ; l\'installation continue de fonctionner en signalant une alarme sonore/visuelle', en: 'No power interruption; system continues operating while raising an audible/visual alarm' },
            { fr: 'Déclenchement instantané du disjoncteur général', en: 'Instantaneous main breaker trip' },
            { fr: 'Inversion de la polarité du courant alternatif', en: 'Polarity reversal of AC supply' },
            { fr: 'Arrêt immédiat de la climatisation', en: 'Immediate shutdown of HVAC' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'C\'est l\'atout fondamental du régime IT médical : la continuité de service totale sans mise en danger du patient lors du premier défaut.',
            en: 'This is the vital advantage of medical IT: total service continuity without risk to patient safety upon the first fault.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 2 (Flagship 2): Comprendre un poste HTA/BT
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-substation-htabt',
    order: 2,
    title: {
      fr: 'Comprendre un poste HTA/BT',
      en: 'Understanding an MV/LV Substation',
    },
    shortTitle: { fr: 'Poste HTA/BT', en: 'MV/LV Substation' },
    description: {
      fr: 'De la cellule modulaire 20 kV au TGBT 400 V : découvrez l’appareillage de coupure, la protection par relais ou fusibles, le relais DGPT2, le régime de neutre TT/TN-S et les condensateurs de cos phi.',
      en: 'From 20 kV modular switchgear to 400 V switchboard: uncover disconnectors, transformer DGPT2 protection, TT/TN earthing, and power factor compensation.',
    },
    targetProfile: 'DISCOVERY',
    iconName: 'Zap',
    accentColor: 'amber',
    estimatedMinutes: 35,
    prerequisites: {
      fr: 'Tensions alternatives 20 000 V et 400 V, notions de neutre et de mise à la terre.',
      en: 'AC voltages 20 kV and 400 V, concepts of neutral and earthing.',
    },
    learningObjectives: [
      {
        fr: 'Décortiquer l’architecture d’un poste HTA/BT en coupure d\'artère ou en antenne.',
        en: 'Deconstruct MV/LV substation architecture in ring-main or radial configuration.',
      },
      {
        fr: 'Identifier les fonctions des 4 capteurs du relais de protection de cuve transformateur DGPT2.',
        en: 'Identify the 4 sensing functions of the transformer DGPT2 gas/pressure/temperature relay.',
      },
      {
        fr: 'Comprendre le rôle du disjoncteur général basse tension débrochable et des départs divisionnaires.',
        en: 'Understand the role of the withdrawable air circuit breaker and distribution outgoing feeders.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'Le Tableau HTA 20 kV : Cellules SM6 en Coupure d\'Artère',
          en: 'The 20 kV MV Switchboard: SM6 Ring-Main Unit Cubicles',
        },
        summary: {
          fr: 'Le poste est raccordé à la boucle HTA urbaine via deux cellules interrupteur (IM) et une cellule de protection transformateur (QM avec fusibles ou DM1-A avec disjoncteur SF6).',
          en: 'The substation hooks into the urban MV loop via two incoming load-break switch bays (IM) and one transformer protection bay (QM or DM1-A).',
        },
        deepExplanation: {
          fr: 'La configuration en boucle ouverte (coupure d\'artère) permet, en cas de défaut sur un câble souterrain, d\'isoler le tronçon avarié et de réalimenter le poste par l\'autre côté de la boucle en moins de 15 minutes. Le sectionneur de mise à la terre (MALT) garantit la sécurité absolue des monteurs lors des consignations.',
          en: 'Open ring topology allows isolating faulty cable sections while restoring substation feed from the opposite side within minutes. The integrated earthing switch guarantees worker safety during maintenance.',
        },
        fieldEngineeringTips: {
          fr: 'Toujours manœuvrer le levier d\'armement d\'un coup sec sans hésiter pour assurer la vitesse de fermeture requise par les ressorts de coupure brusque.',
          en: 'Always operate the manual charging handle with a swift, decisive motion to guarantee spring snap-action closing speed.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'cellule-hta-sm6',
          label: { fr: 'Voir la Vue 3D et Synoptique SM6', en: 'View SM6 3D & Mimic' },
        },
        quiz: {
          question: {
            fr: 'Quel appareillage assure la protection contre les courts-circuits dans une cellule HTA type QM ?',
            en: 'Which device provides short-circuit protection in a QM type MV cubicle?',
          },
          options: [
            { fr: 'Des fusibles HTA à percuteur haute performance', en: 'High-voltage striker pin fuses' },
            { fr: 'Un fusible basse tension 16 A', en: 'A 16 A low voltage fuse' },
            { fr: 'Une simple résistance céramique', en: 'A simple ceramic resistor' },
            { fr: 'Un parasurtenseur BT', en: 'An LV surge arrester' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! Les cellules QM utilisent 3 fusibles HTA calibrés (ex: 43 A sous 20 kV pour 1 000 kVA) équipés de percuteurs qui déclenchent mécaniquement l\'ouverture tripolaire.',
            en: 'Correct! QM cubicles utilize 3 striker-pin MV fuses that mechanically trigger three-phase tripping upon blowing.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'Le Transformateur 20 kV / 400 V & Relais de Sécurité DGPT2',
          en: 'The 20 kV / 400 V Transformer & DGPT2 Safety Relay',
        },
        summary: {
          fr: 'Le transformateur abaisse la tension de 20 000 V à 400 V triphasé. En transformateur à huile hermétique, le relais DGPT2 surveille le gaz, la pression et la température.',
          en: 'The transformer steps down 20 kV to 400 V. On hermetically sealed oil transformers, the DGPT2 monitors gas, pressure, and temperature.',
        },
        deepExplanation: {
          fr: 'L\'acronyme DGPT2 signifie : Détection Gaz (Dégagement de gaz suite à décomposition de l\'huile), Pression (Surpression interne mesurée par soufflet), Température Seuil 1 (Alarme à 85°C), Température Seuil 2 (Déclenchement d\'urgence à 95°C). Un contact de déclenchement actionne la bobine d\'ouverture de la cellule HTA amont.',
          en: 'DGPT2 stands for: Gas detection, Pressure surge, Temperature threshold 1 (85°C alarm), and Temperature threshold 2 (95°C emergency trip). A trip dry contact energizes the upstream MV trip coil.',
        },
        keyFormulas: [
          'I_secondaire_nom = S_transfo / (sqrt(3) * U_bt) = 630 000 / (1.732 * 400) = 909 A',
          'I_cc_secondaire = I_nom / (Ucc / 100) = 909 / 0.04 = 22 725 A (22.7 kA)',
        ],
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'transfo-distribution-htabt',
          label: { fr: 'Ouvrir la Fiche Transformateur HTA/BT', en: 'Open MV/LV Transformer Fiche' },
        },
        quiz: {
          question: {
            fr: 'Que signifie l\'acronyme DGPT2 sur un transformateur à remplissage total immergé dans l\'huile ?',
            en: 'What does the acronym DGPT2 signify on a hermetically sealed oil transformer?',
          },
          options: [
            { fr: 'Détection Gaz, Pression et 2 seuils de Température', en: 'Gas Detection, Pressure, and 2 Temperature thresholds' },
            { fr: 'Disjoncteur Général pour Protection Triphasée', en: 'General Breaker for Three-Phase Protection' },
            { fr: 'Différentiel Global de Puissance Transmise', en: 'Global Differential of Transmitted Power' },
            { fr: 'Dispositif de Guidage des Phases Terrestres', en: 'Phase Guidance Ground Device' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exactement : Détection Gaz (micro-arcs), Pression (défaut franc) et 2 seuils thermostatiques (85°C et 95°C).',
            en: 'Exactly: Gas emission, Pressure rise, and 2 temperature alarm/trip thermostats.',
          },
        },
      },
      {
        stepNumber: 3,
        title: {
          fr: 'Le Tableau Général Basse Tension (TGBT) & Disjoncteur Général',
          en: 'Main Low Voltage Switchboard (MLVS/TGBT) & Main Breaker',
        },
        summary: {
          fr: 'Au secondaire, le jeu de barres en cuivre distribue l\'énergie sous 400 V / 230 V vers les différents départs protégés par disjoncteurs boîtier moulé.',
          en: 'On the secondary side, copper busbars distribute 400 V / 230 V power to feeder breakers.',
        },
        deepExplanation: {
          fr: 'Le disjoncteur général (ex: Masterpact 1 600 A à coupure dans l\'air) intègre un déclencheur électronique Micrologic offrant les protections L (Surcharge long retard), S (Court-circuit court retard), I (Instantané) et G (Défaut à la terre résiduel).',
          en: 'The main air circuit breaker (e.g. Masterpact 1,600 A) incorporates an electronic trip unit with L (Long-time overload), S (Short-time fault), I (Instantaneous), and G (Ground fault) protections.',
        },
        targetAction: {
          type: 'CALCULATOR',
          targetId: 'short-circuit',
          label: { fr: 'Calculer le Courant de Court-Circuit au TGBT', en: 'Calculate MLVS Short-Circuit Level' },
        },
        quiz: {
          question: {
            fr: 'Quel élément protège les installations contre les surcharges lentes et prolongées dans un déclencheur LSI ?',
            en: 'Which protection element handles slow, sustained overloads in an LSI electronic trip unit?',
          },
          options: [
            { fr: 'Le seuil Long Retard (L)', en: 'The Long-time delay (L) threshold' },
            { fr: 'Le seuil Instantané (I)', en: 'The Instantaneous (I) threshold' },
            { fr: 'Le parafoudre de type 1', en: 'Type 1 surge arrester' },
            { fr: 'Le relais à manque de tension', en: 'Undervoltage release' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Le seuil L (Long retard) modélise la courbe d\'échauffement thermique I²t des câbles pour éliminer les surcharges modérées sans déclenchement prématuré.',
            en: 'The L threshold computes cable thermal heating (I²t) to clear sustained overloads safely.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 3 (Flagship 3): Du court-circuit au déclenchement du disjoncteur
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-fault-to-trip',
    order: 3,
    title: {
      fr: 'Du court-circuit au déclenchement du disjoncteur',
      en: 'From Short-Circuit to Circuit Breaker Tripping',
    },
    shortTitle: { fr: 'Du Défaut au Déclenchement', en: 'Fault Inception to Tripping' },
    description: {
      fr: 'Une plongée chronologique ultra-haute résolution (0 à 80 ms) : onde sous-transitoire, induction dans les tores TC, décision numérique ANSI 50/51, excitation de la bobine MX et soufflage de l\'arc dans le SF6.',
      en: 'Ultra-high speed chronology (0 to 80 ms): subtransient wave, CT magnetic induction, digital ANSI 50/51 decision, MX trip coil pulse, and SF6 arc quenching.',
    },
    targetProfile: 'ENGINEERING',
    iconName: 'Activity',
    accentColor: 'rose',
    estimatedMinutes: 45,
    prerequisites: {
      fr: 'Loi d’Ohm, inductance de fuite, temps de réponse des appareillages électromécaniques.',
      en: 'Ohm’s law, leakage reactance, electromechanical equipment response times.',
    },
    learningObjectives: [
      {
        fr: 'Décortiquer chaque milliseconde entre l’apparition de l’arc et l’isolement complet.',
        en: 'Deconstruct every millisecond between fault inception and complete circuit isolation.',
      },
      {
        fr: 'Comprendre la chaîne TC -> Échantillonneur A/N -> Algorithme de filtrage de Fourier -> Sortie relais.',
        en: 'Understand the sensor signal chain: CT -> A/D conversion -> Fourier filtering -> Relay output.',
      },
      {
        fr: 'Analyser la physique de l’extinction d’arc dans le gaz SF6 ou sous vide.',
        en: 'Analyze arc extinction physics in SF6 gas or vacuum interrupter bottles.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 't = 0 à 15 ms : Naissance du Court-Circuit & Onde Asymétrique',
          en: 't = 0 to 15 ms: Fault Inception & Asymmetric Peak Wave',
        },
        summary: {
          fr: 'Un isolateur se rompt ou un engin arrache un câble. En moins de 2 millisecondes, l\'impédance s\'effondre et le courant bondit à sa valeur sous-transitoire maximale.',
          en: 'Insulation breaks down. Within 2 ms, loop impedance collapses and current spikes to peak asymmetrical level.',
        },
        deepExplanation: {
          fr: 'Si le défaut se produit lors du passage par zéro de la tension réseau, la composante apériodique continue (DC offset) atteint son maximum théorique. Le courant de crête ip = kappa * sqrt(2) * Ik" engendre des efforts électrodynamiques proportionnels au carré du courant (F ~ i²), capables de plier les jeux de barres en cuivre.',
          en: 'If fault initiates at voltage zero-crossing, the DC offset component reaches maximum. Peak current ip = kappa * sqrt(2) * Ik" exerts electrodynamic forces proportional to i², threatening switchgear busbar mechanical integrity.',
        },
        keyFormulas: [
          'ip = kappa * sqrt(2) * Ik"',
          'F_electrodynamique = (mu_0 / (2 * pi)) * (i1 * i2 / d) * L',
        ],
        targetAction: {
          type: 'SCENARIO',
          targetId: 'scen-1-short-circuit-225kv',
          label: { fr: 'Rejouer l’Événement dans l’Incident Replay SCADA', en: 'Replay Event in SCADA Incident Replay' },
        },
        quiz: {
          question: {
            fr: 'À quel instant précis du cycle de tension l\'asymétrie du courant de court-circuit est-elle maximale ?',
            en: 'At what exact point in the voltage wave is the short-circuit asymmetry at its peak?',
          },
          options: [
            { fr: 'Au passage par zéro de la tension', en: 'At the voltage zero-crossing' },
            { fr: 'Au sommet de la sinusoïde (crête)', en: 'At the crest of the sinusoid' },
            { fr: 'À l\'instant exact où la fréquence est à 51 Hz', en: 'At the exact moment frequency reaches 51 Hz' },
            { fr: 'Toujours à midi pile', en: 'Always at exactly noon' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! Au passage par zéro de la tension (v(t) = 0), la continuité du flux inductif impose une composante apériodique de valeur initiale maximale.',
            en: 'Correct! At voltage zero crossing, inductive flux continuity requires an initial DC offset equal to peak AC amplitude.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 't = 15 à 35 ms : Mesure TC, Filtrage Numérique et Décision Relais',
          en: 't = 15 to 35 ms: CT Measurement, Digital Filtering & Relay Decision',
        },
        summary: {
          fr: 'Le transformateur de courant (TC 5P20) transmet l’image réduite du courant au relais numérique de protection (ex: Sepam ou SIPROTEC).',
          en: 'The current transformer (5P20) transmits a scaled current image to the digital protection relay.',
        },
        deepExplanation: {
          fr: 'Le processeur DSP du relais échantillonne le signal à 1 000 ou 4 800 Hz. Un filtre de Fourier discret (DFT) extrait le fondamental 50 Hz en rejetant la composante continue et les harmoniques. Constatant que I_RMS dépasse le seuil ANSI 50 (ex: 8 x Inom), le microprocesseur valide l\'ordre de tir en 20 ms et ferme son contact statique de sortie.',
          en: 'The relay DSP samples at 1,000 or 4,800 Hz. A Discrete Fourier Transform extracts the fundamental 50 Hz while rejecting DC offset. Confirming current exceeds ANSI 50 threshold, the processor issues a trip command within 20 ms via static thyristor output.',
        },
        keyFormulas: [
          'I_RMS_fondamental = sqrt(Re{DFT(i(t))}^2 + Im{DFT(i(t))}^2)',
          'Condition ANSI 50 : I_fondamental > I_seuil_regle',
        ],
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'relais-protection-siprotec',
          label: { fr: 'Consulter la Fiche Relais SIPROTEC 5', en: 'View SIPROTEC 5 Relay Fiche' },
        },
        quiz: {
          question: {
            fr: 'Quel algorithme mathématique permet au relais numérique d\'isoler le fondamental 50 Hz en présence d\'une forte composante continue ?',
            en: 'Which mathematical algorithm allows digital relays to isolate fundamental 50 Hz despite large DC offset?',
          },
          options: [
            { fr: 'La transformée de Fourier discrète (DFT)', en: 'Discrete Fourier Transform (DFT)' },
            { fr: 'Une régression linéaire ordinaire', en: 'Ordinary linear regression' },
            { fr: 'Le produit vectoriel', en: 'Cross product' },
            { fr: 'La méthode de Monte Carlo', en: 'Monte Carlo method' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'La DFT (Discrete Fourier Transform) permet d\'extraire les grandeurs phasorielles fondamentales nécessaires à la décision de protection.',
            en: 'DFT extracts the fundamental phasor amplitude and phase angle vital for protection decisions.',
          },
        },
      },
      {
        stepNumber: 3,
        title: {
          fr: 't = 35 à 75 ms : Excitation Bobine MX, Déverrouillage & Soufflage de l\'Arc',
          en: 't = 35 to 75 ms: MX Shunt Trip Coil, Mechanical Unlatching & Arc Quenching',
        },
        summary: {
          fr: 'Le contact du relais alimente la bobine d’ouverture MX (110 Vcc). Le verrouillage mécanique saute et les ressorts d’ouverture écartent violemment les pôles.',
          en: 'The relay closes the 110 Vdc trip circuit to the MX coil. Mechanical latch releases and opening springs pull contacts apart.',
        },
        deepExplanation: {
          fr: 'Entre les contacts qui s\'écartent, la tension ionise le milieu et génère un arc électrique à plus de 10 000°C. Dans les disjoncteurs modernes, un gaz SF6 sous pression ou une ampoule sous vide refroidit violemment le plasma d\'arc. L\'arc s\'éteint définitivement au premier passage naturel par zéro du courant alternatif (vers 65-75 ms). Le circuit est totalement ouvert et le réseau est sauvé.',
          en: 'As contacts separate, an intense 10,000°C electric arc is drawn. Pressurized SF6 gas or vacuum interrupter extinguishes the plasma channel at the next natural AC current zero (around 65-75 ms). Current is interrupted and downstream apparatus is isolated.',
        },
        fieldEngineeringTips: {
          fr: 'Toujours surveiller la pression de gaz SF6 sur le manomètre de densité (Densitostat). Si la pression chute sous 5.0 bar, le disjoncteur est verrouillé pour éviter sa destruction lors d\'une coupure.',
          en: 'Always inspect the SF6 gas density monitor. If pressure drops below threshold, the breaker is locked out to avoid catastrophic failure upon breaking.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'disjoncteur-htb-sf6',
          label: { fr: 'Examiner le Disjoncteur SF6 Haute Tension', en: 'Inspect High Voltage SF6 Circuit Breaker' },
        },
        quiz: {
          question: {
            fr: 'À quel instant l\'arc électrique est-il définitivement éteint par le disjoncteur alternatif ?',
            en: 'At what point is the AC electric arc extinguished by the circuit breaker?',
          },
          options: [
            { fr: 'Au premier passage naturel par zéro du courant après écartement suffisant des pôles', en: 'At the next natural current zero-crossing following sufficient contact travel' },
            { fr: 'Au sommet de la tension', en: 'At the voltage peak' },
            { fr: 'Après 10 minutes d\'attente', en: 'After 10 minutes of delay' },
            { fr: 'Seulement quand l\'opérateur appuie sur le bouton vert', en: 'Only when the operator pushes the green button' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'L\'arc s\'interrompt au passage par zéro du courant si le milieu isolant (SF6 ou vide) a récupéré une rigidité diélectrique supérieure à la tension transitoire de rétablissement (TTR).',
            en: 'Arc interruption occurs at current zero when the dielectric recovery of the medium exceeds the Transient Recovery Voltage (TRV).',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 4 (Flagship 4): Comprendre une centrale hydroélectrique
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-hydro-plant',
    order: 4,
    title: {
      fr: 'Comprendre une centrale hydroélectrique',
      en: 'Understanding a Hydroelectric Power Plant',
    },
    shortTitle: { fr: 'Centrale Hydroélectrique', en: 'Hydroelectric Plant' },
    description: {
      fr: 'Du barrage réservoir de Lom Pangar et des conduites forcées aux 7 turbines Francis de Nachtigal (420 MW) et Songloulou (384 MW) : conversion mécanique, alternateurs verticaux et évacuation 225 kV.',
      en: 'From Lom Pangar storage dam to Nachtigal (420 MW) and Songloulou (384 MW) Francis turbines: hydraulic conversion, salient-pole alternators, and 225 kV grid step-up.',
    },
    targetProfile: 'DISCOVERY',
    iconName: 'Globe',
    accentColor: 'emerald',
    estimatedMinutes: 40,
    prerequisites: {
      fr: 'Notions d\'énergie potentielle de pesanteur, débit hydraulique (m³/s) et hauteur de chute (m).',
      en: 'Potential energy of gravity, hydraulic discharge (m³/s), and net head (m).',
    },
    learningObjectives: [
      {
        fr: 'Calculer la puissance hydraulique théorique et électrique injectée à partir du débit et de la chute.',
        en: 'Compute theoretical hydraulic and net electrical power from discharge and head.',
      },
      {
        fr: 'Comprendre le fonctionnement d’une turbine Francis à axe vertical et de son distributeur à directrices mobiles.',
        en: 'Understand vertical Francis turbine runners and motorized wicket gate distributors.',
      },
      {
        fr: 'Maîtriser la régulation de vitesse tachymétrique pour maintenir la fréquence réseau à 50.00 Hz.',
        en: 'Master governor speed droop control maintaining system frequency at 50.00 Hz.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'De la Retenue Amont à la Conduite Forcée : L\'Énergie de l\'Eau',
          en: 'From Upstream Reservoir to Penstock: Hydraulic Energy',
        },
        summary: {
          fr: 'Sur le fleuve Sanaga au Cameroun, l\'eau accumulée à Lom Pangar est turbinée à Nachtigal sous une chute nette de 50 mètres avec un débit nominal de 980 m³/s.',
          en: 'On the Sanaga river, regulated water from Lom Pangar powers Nachtigal under a 50-meter head at 980 m³/s flow.',
        },
        deepExplanation: {
          fr: 'La formule fondamentale de l\'hydroélectricité est P = rho * g * Q * H * eta. Avec la masse volumique de l\'eau rho = 1 000 kg/m³, g = 9.81 m/s², un débit Q = 140 m³/s par turbine, une hauteur H = 50 m et un rendement global eta = 0.92, chaque groupe génère 60 MW électriques.',
          en: 'The fundamental hydro formula is P = rho * g * Q * H * eta. With density 1,000 kg/m³, gravity 9.81 m/s², 140 m³/s discharge per turbine, 50 m head, and 0.92 efficiency, each unit produces 60 MW.',
        },
        keyFormulas: [
          'P_hydraulique = 1000 * 9.81 * Q * H (en Watts)',
          'P_electrique = P_hydraulique * eta_turbine * eta_alternateur',
        ],
        targetAction: {
          type: 'GRID',
          targetId: 'plant-nachtigal',
          label: { fr: 'Localiser Nachtigal (420 MW) sur le SIG Cameroun', en: 'Locate Nachtigal (420 MW) on Cameroon GIS' },
        },
        quiz: {
          question: {
            fr: 'Quel aménagement en amont sur la Sanaga garantit un débit supérieur à 1 000 m³/s même pendant l\'étiage sec ?',
            en: 'Which upstream asset guarantees over 1,000 m³/s Sanaga flow during severe dry seasons?',
          },
          options: [
            { fr: 'Le barrage réservoir régulateur de Lom Pangar (6 milliards de m³)', en: 'Lom Pangar regulating storage reservoir (6 billion m³)' },
            { fr: 'Le lac Tchad', en: 'Lake Chad' },
            { fr: 'Le fleuve Wouri', en: 'Wouri river' },
            { fr: 'La centrale de Kribi', en: 'Kribi gas plant' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Lom Pangar stocke 6 milliards de m³ d\'eau pendant la saison des pluies pour soutenir l\'étiage de Nachtigal, Songloulou et Édéa.',
            en: 'Lom Pangar impounds 6 billion m³ during rains to sustain dry season discharge for Nachtigal, Songloulou, and Édéa.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'La Turbine Francis, la Bâche Spirale et les Directrices Mobiles',
          en: 'Francis Runner, Spiral Casing & Movable Wicket Gates',
        },
        summary: {
          fr: 'La bâche spirale répartit l’eau de manière homogène sur la périphérie de la turbine, tandis que le distributeur oriente les filets d\'eau.',
          en: 'The spiral casing distributes incoming water uniformly around the turbine runner periphery.',
        },
        deepExplanation: {
          fr: 'Le régulateur de vitesse tachymétrique ajuste en permanence l\'ouverture des directrices mobiles via des vérins oléopneumatiques haute pression (100 bar). Si la fréquence du réseau baisse (49.8 Hz suite à un appel de charge), le régulateur ouvre les aubes pour injecter davantage de mégawatts et rétablir 50.00 Hz.',
          en: 'The governor adjusts wicket gate pitch via high-pressure hydraulic servomotors. If grid frequency droops to 49.8 Hz from load pickup, the governor opens gates to feed more mechanical power and restore 50.00 Hz.',
        },
        targetAction: {
          type: 'SIMULATION',
          targetId: 'generator-governor',
          label: { fr: 'Simuler la Régulation Vitesse / Fréquence', en: 'Simulate Speed / Frequency Governor' },
        },
        quiz: {
          question: {
            fr: 'Quel organe mécanique régule le débit d\'eau entrant dans une turbine hydraulique Francis ?',
            en: 'Which mechanical component modulates water discharge into a Francis hydraulic runner?',
          },
          options: [
            { fr: 'Le distributeur à directrices (aubes directrices mobiles)', en: 'The wicket gate distributor (movable guide vanes)' },
            { fr: 'Le câble à fibre optique', en: 'The fiber optic cable' },
            { fr: 'Le disjoncteur SF6', en: 'The SF6 circuit breaker' },
            { fr: 'Le parafoudre à oxyde de zinc', en: 'The zinc oxide surge arrester' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Les aubes directrices mobiles pivotent pour ajuster précisément le débit volumique Q injecté sur la roue.',
            en: 'Movable guide vanes pivot synchronously to regulate water discharge entering the runner.',
          },
        },
      },
      {
        stepNumber: 3,
        title: {
          fr: 'L\'Alternateur Synchrone et le Poste Élévateur 225 kV',
          en: 'Synchronous Alternator & 225 kV Step-Up Substation',
        },
        summary: {
          fr: 'La roue Francis entraîne le rotor à pôles saillants de l\'alternateur, générant 10.5 kV triphasé à 150 tr/min. Le transformateur élève ensuite la tension à 225 kV.',
          en: 'The Francis runner drives the salient-pole rotor at 150 rpm, generating 10.5 kV stepped up to 225 kV for transmission.',
        },
        deepExplanation: {
          fr: 'Avec 20 paires de pôles (p = 20), la vitesse de synchronisme n = 60 * f / p = 60 * 50 / 20 = 150 tr/min. L\'énergie est évacuée vers le poste de départ 225 kV où des disjoncteurs SF6 injectent la puissance sur l\'artère vers Yaoundé et Bekoko (Douala).',
          en: 'With 20 pole pairs (p = 20), synchronous speed n = 60 * f / p = 60 * 50 / 20 = 150 rpm. Power feeds a step-up GSU transformer to transmit onto the 225 kV grid toward Yaoundé and Douala.',
        },
        keyFormulas: [
          'n_synchronisme = 60 * f / p (avec p = nombre de paires de pôles)',
          'U_stator = 4.44 * f * N * Phi * Kw',
        ],
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'transfo-puissance-htb',
          label: { fr: 'Voir le Transformateur Élévateur de Groupe (GSU)', en: 'View Generator Step-Up (GSU) Transformer' },
        },
        quiz: {
          question: {
            fr: 'Combien de paires de pôles possède un alternateur hydroélectrique tournant à 150 tr/min pour produire du 50 Hz ?',
            en: 'How many pole pairs does a hydro alternator require to generate 50 Hz at 150 rpm?',
          },
          options: [
            { fr: '20 paires de pôles (soit 40 pôles au total)', en: '20 pole pairs (40 poles total)' },
            { fr: '1 seule paire de pôles', en: '1 single pole pair' },
            { fr: '5 paires de pôles', en: '5 pole pairs' },
            { fr: '100 paires de pôles', en: '100 pole pairs' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! p = 60 * f / n = 60 * 50 / 150 = 20 paires de pôles.',
            en: 'Correct! p = 60 * f / n = 60 * 50 / 150 = 20 pole pairs.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 5 (Flagship 5): Intégrer un système PV avec BESS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-pv-bess',
    order: 5,
    title: {
      fr: 'Intégrer un système PV avec BESS',
      en: 'Integrating Solar PV with Battery Storage (BESS)',
    },
    shortTitle: { fr: 'Solaire PV & Batteries BESS', en: 'Solar PV & BESS' },
    description: {
      fr: 'Des centrales solaires de Guider et Maroua (30 MWc + 20 MWh de batteries Li-ion au Cameroun) aux onduleurs bidirectionnels PCS : gestion de l’intermittence, régulation tension/fréquence et écrêtage des pointes.',
      en: 'From Guider and Maroua solar fields (30 MWp + 20 MWh storage in northern Cameroon) to 4-quadrant PCS inverters: intermittency mitigation, grid support, and peak shaving.',
    },
    targetProfile: 'TECHNICAL',
    iconName: 'Cpu',
    accentColor: 'cyan',
    estimatedMinutes: 45,
    prerequisites: {
      fr: 'Courant continu vs alternatif, stockage électrochimique (LiFePO4) et notions de puissance active P et réactive Q.',
      en: 'DC vs AC, lithium battery chemistry, active P and reactive Q power.',
    },
    learningObjectives: [
      {
        fr: 'Comprendre l’architecture hybride DC-coupled et AC-coupled d\'une centrale PV + BESS.',
        en: 'Understand DC-coupled and AC-coupled architectures in utility-scale PV + BESS.',
      },
      {
        fr: 'Configurer un convertisseur 4 quadrants PCS pour le soutien de tension par injection de réactif Q.',
        en: 'Configure 4-quadrant PCS inverters for reactive power Q grid voltage support.',
      },
      {
        fr: 'Maîtriser les fonctions de réserve primaire de fréquence (Fast Frequency Response) par batterie.',
        en: 'Master battery Fast Frequency Response (FFR) sub-second droop injection.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'Le Champ Photovoltaïque & Onduleurs Centraux (Cas de Guider & Maroua)',
          en: 'The Utility Solar Array & Central Inverters (Guider & Maroua Case)',
        },
        summary: {
          fr: 'Dans le Grand Nord du Cameroun (RIN), 30 MWc de panneaux bifaciaux sur trackers à 1 axe convertissent le fort gisement solaire sahélien.',
          en: 'In northern Cameroon, 30 MWp bifacial modules on single-axis trackers harvest high Sahelian irradiance.',
        },
        deepExplanation: {
          fr: 'Les panneaux solaires sont groupés en strings à 1 500 Vcc pour réduire les sections de câble. Des onduleurs centraux de 3.125 MVA équipés de MPPT avancés transforment le courant continu en 630 Vca, immédiatement élevé à 30 kV puis 90 kV vers le poste source de Lagdo/Maroua.',
          en: 'Solar modules are strung to 1,500 Vdc to minimize cable losses. 3.125 MVA central inverters with advanced MPPT convert DC to 630 Vac, stepped up to 30 kV and 90 kV to reinforce the Lagdo-Maroua line.',
        },
        targetAction: {
          type: 'GRID',
          targetId: 'plant-guider-solar',
          label: { fr: 'Voir la Centrale Solaire de Guider sur la Carte', en: 'View Guider Solar Plant on Map' },
        },
        quiz: {
          question: {
            fr: 'Quel est l\'avantage d\'une architecture 1 500 Vcc par rapport à l\'ancien standard 1 000 Vcc en grande centrale solaire ?',
            en: 'What is the key advantage of a 1,500 Vdc architecture over 1,000 Vdc in utility solar?',
          },
          options: [
            { fr: 'Réduire le courant par string, diminuant ainsi les pertes Joule et le nombre de boîtes de jonction', en: 'Reduces current per string, cutting Joule losses and reducing combiner box count' },
            { fr: 'Rendre les panneaux étanches à l\'eau de mer', en: 'Makes panels waterproof against seawater' },
            { fr: 'Éliminer le besoin de transformateur', en: 'Eliminates the transformer requirement' },
            { fr: 'Permettre de produire de l\'électricité la nuit', en: 'Allows night-time electricity generation' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'À puissance égale, augmenter la tension à 1 500 V réduit le courant d\'un tiers, diminuant les pertes en ligne de plus de 50%.',
            en: 'At equal power, 1,500 Vdc lowers current by 33%, reducing ohmic cable losses by more than 50%.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'Le Système BESS LiFePO4 & Convertisseur Bidirectionnel PCS',
          en: 'LiFePO4 BESS Storage & 4-Quadrant PCS Bidirectional Inverter',
        },
        summary: {
          fr: 'Les 20 MWh de batteries au lithium fer phosphate stockent l\'excédent d\'énergie à midi pour le restituer pendant la pointe de consommation vespérale (18h-22h).',
          en: '20 MWh LiFePO4 battery containers store midday solar surplus to inject during evening peak load (6pm-10pm).',
        },
        deepExplanation: {
          fr: 'Le convertisseur de puissance (PCS - Power Conversion System) fonctionne dans les 4 quadrants du plan P-Q : il peut charger la batterie (P < 0) ou la décharger (P > 0), tout en injectant ou absorbant de la puissance réactive (Q) pour réguler la tension du réseau 90 kV indépendamment de l\'état de charge (SoC).',
          en: 'The bidirectional PCS operates across all 4 quadrants of the P-Q plane: charging (P < 0) or discharging (P > 0) while independently supplying or absorbing reactive power (Q) to maintain 90 kV line voltage.',
        },
        keyFormulas: [
          'E_restituable = Capacite_nominale * DoD * eta_round_trip = 20 MWh * 0.90 * 0.88 = 15.84 MWh',
          'S_PCS = sqrt(P^2 + Q^2)',
        ],
        targetAction: {
          type: 'CALCULATOR',
          targetId: 'bess-sizing',
          label: { fr: 'Calculateur Dimensionnement Batterie BESS', en: 'BESS Battery Sizing Calculator' },
        },
        quiz: {
          question: {
            fr: 'Pourquoi la chimie Lithium Fer Phosphate (LiFePO4) est-elle privilégiée pour les conteneurs BESS en climat chaud tropical ?',
            en: 'Why is Lithium Iron Phosphate (LiFePO4) preferred for BESS containers in hot tropical climates?',
          },
          options: [
            { fr: 'Excellente stabilité thermique et résistance à l\'emballement thermique jusqu\'à 270°C', en: 'Superior thermal stability and resistance to thermal runaway up to 270°C' },
            { fr: 'Elle est faite à base d\'eau pure', en: 'It is made of pure water' },
            { fr: 'Elle ne nécessite aucun câble électrique', en: 'It requires zero electrical cabling' },
            { fr: 'Elle est entièrement gratuite', en: 'It is completely free of charge' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Le LFP (LiFePO4) offre une sécurité intrinsèque exceptionnelle contre l\'incendie et une durée de vie supérieure à 6 000 cycles.',
            en: 'LFP chemistry provides exceptional fire safety, robust thermal stability, and long cycle life exceeding 6,000 cycles.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 6 (Flagship 6): Comprendre le délestage sous-fréquence
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-ufls-shedding',
    order: 6,
    title: {
      fr: 'Comprendre le délestage sous-fréquence',
      en: 'Understanding Underfrequency Load Shedding (UFLS)',
    },
    shortTitle: { fr: 'Délestage Sous-Fréquence', en: 'Underfrequency Load Shedding' },
    description: {
      fr: 'Lors de la perte brutale d’un groupe hydroélectrique ou d\'une interconnexion, la fréquence chute. Découvrez l’équation du rotor, l’inertie H, les automates UFLS SONATREL (49.2 Hz / 48.8 Hz) et la parade contre le blackout.',
      en: 'Following sudden loss of generation, grid frequency drops. Uncover rotor swing equation, inertia H, national UFLS stages (49.2 / 48.8 Hz), and blackout prevention.',
    },
    targetProfile: 'ENGINEERING',
    iconName: 'Activity',
    accentColor: 'indigo',
    estimatedMinutes: 40,
    prerequisites: {
      fr: 'Machines synchrones, inertie mécanique et équilibre offre-demande.',
      en: 'Synchronous machines, mechanical inertia, and power balance.',
    },
    learningObjectives: [
      {
        fr: 'Calculer la vitesse initiale de chute de fréquence (RoCoF) en fonction du déficit de puissance Delta_P.',
        en: 'Calculate initial Rate of Change of Frequency (RoCoF) from power deficit Delta_P.',
      },
      {
        fr: 'Paramétrer la grille des 4 stades de délestage UFLS ANSI 81U du réseau camerounais.',
        en: 'Configure the 4-stage UFLS ANSI 81U load shedding schedule of the Cameroon power grid.',
      },
      {
        fr: 'Analyser la reconstitution de la fréquence et le réenclenchement séquentiel des départs.',
        en: 'Analyze frequency recovery and automated sequential feeder reclosing.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'Le Déséquilibre Brutal & l\'Équation d\'Oscillation (Swing Equation)',
          en: 'Sudden Power Imbalance & The Generator Swing Equation',
        },
        summary: {
          fr: 'Si une centrale de 100 MW déclenche subitement, la demande excède l\'offre. L\'énergie cinétique stockée dans les rotors des autres alternateurs est immédiatement absorbée pour combler l\'écart.',
          en: 'If a 100 MW plant suddenly trips, load exceeds generation. Kinetic energy stored in surviving spinning rotors is drained to bridge the gap.',
        },
        deepExplanation: {
          fr: 'En ralentissant, les rotors provoquent la baisse de la fréquence électrique réseau selon l\'équation d\'oscillation : (2 * H / f_0) * (df / dt) = (P_meca - P_elec) / S_base. La vitesse de chute initiale (RoCoF) est directement proportionnelle au déficit de puissance Delta_P et inversement proportionnelle à l\'inertie totale H du réseau.',
          en: 'Decelerating rotors cause grid frequency to plunge per the swing equation: (2 * H / f_0) * (df / dt) = Delta_P / S_base. Initial RoCoF (Rate of Change of Frequency) is proportional to power deficit and inversely proportional to total system inertia H.',
        },
        keyFormulas: [
          'RoCoF = df / dt = (Delta_P * f_0) / (2 * H * S_base) [en Hz/s]',
          'H_equivalent = sum(H_i * S_i) / sum(S_i)',
        ],
        targetAction: {
          type: 'SCENARIO',
          targetId: 'scen-9-underfrequency-shedding',
          label: { fr: 'Rejouer le Scénario Déclenchement UFLS 49.2 Hz', en: 'Replay UFLS 49.2 Hz Trip Scenario' },
        },
        quiz: {
          question: {
            fr: 'Quel paramètre physique retarde la chute brutale de fréquence immédiatement après la perte d\'un générateur ?',
            en: 'Which physical parameter retards instantaneous frequency collapse immediately after losing a generator?',
          },
          options: [
            { fr: 'L\'inertie massique rotative (H) des alternateurs synchrones en service', en: 'Rotational kinetic inertia (H) of synchronized generating units' },
            { fr: 'La résistance électrique des câbles', en: 'Electrical resistance of lines' },
            { fr: 'La température ambiante extérieure', en: 'Ambient outdoor temperature' },
            { fr: 'Le diamètre des tuyaux de refoulement', en: 'Discharge pipe diameter' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'L\'inertie H (exprimée en secondes d\'énergie cinétique stockée) s\'oppose instantanément à la décélération du réseau.',
            en: 'Inertia H (seconds of stored kinetic energy) immediately buffers the system against deceleration.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'La Grille de Délestage UFLS (ANSI 81U) au Cameroun (SONATREL)',
          en: 'The Cameroon UFLS Load Shedding Schedule (SONATREL ANSI 81U)',
        },
        summary: {
          fr: 'Pour stopper la chute avant le seuil fatal de 47.5 Hz (déclenchement des centrales), des relais UFLS déconnectent automatiquement des départs de distribution par paliers.',
          en: 'To arrest decline before 47.5 Hz (where hydro plants self-protect and trip), automated UFLS relays disconnect blocks of distribution feeders.',
        },
        deepExplanation: {
          fr: 'La grille SONATREL comprend 4 stades programmés dans les relais de postes : Stade 1 à 49.2 Hz (délestage de 10% de la charge, t = 100 ms), Stade 2 à 48.8 Hz (15% supplémentaires), Stade 3 à 48.4 Hz (15%), Stade 4 à 48.0 Hz (délestage d\'ultime secours). Dès que la charge est allégée, la puissance mécanique redevient supérieure à la charge électrique et la fréquence remonte vers 50.0 Hz.',
          en: 'The SONATREL UFLS scheme comprises 4 stages: Stage 1 at 49.2 Hz (10% load shed, t = 100 ms), Stage 2 at 48.8 Hz (further 15%), Stage 3 at 48.4 Hz (15%), Stage 4 at 48.0 Hz (ultimate emergency shed). Relieving load arrests the drop and allows governors to restore 50.00 Hz.',
        },
        fieldEngineeringTips: {
          fr: 'Les départs alimentant les hôpitaux, les stations de pompage d\'eau potable (CAMWATER) et les aéroports sont formellement exclus de la grille UFLS.',
          en: 'Hospital feeders, water pumping plants, and airports are strictly exempted from automated underfrequency shedding.',
        },
        targetAction: {
          type: 'PROVENANCE',
          targetId: 'param-ufls-cameroon',
          label: { fr: 'Consulter la Fiche de Donnée Fiable : Seuils UFLS', en: 'Audit Verified Provenance: UFLS Settings' },
        },
        quiz: {
          question: {
            fr: 'Quel est le premier seuil de délestage fréquentiel UFLS (Stade 1) standardisé sur le RIS au Cameroun ?',
            en: 'What is the standardized Stage 1 UFLS frequency threshold on Cameroon\'s Southern Grid?',
          },
          options: [
            { fr: '49.20 Hz', en: '49.20 Hz' },
            { fr: '40.00 Hz', en: '40.00 Hz' },
            { fr: '52.50 Hz', en: '52.50 Hz' },
            { fr: '49.99 Hz', en: '49.99 Hz' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Exact ! 49.20 Hz déclenche le premier bloc de délestage automatique après 100 à 150 ms de temporisation.',
            en: 'Correct! 49.20 Hz triggers the first block of automated feeder trips after a 100-150 ms qualifying delay.',
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PARCOURS 7 (Flagship 7): De l’alternateur au réseau de transport
  // ─────────────────────────────────────────────────────────────
  {
    id: 'journey-alternator-to-grid',
    order: 7,
    title: {
      fr: 'De l’alternateur au réseau de transport',
      en: 'From Alternator to the Transmission Grid',
    },
    shortTitle: { fr: 'Alternateur au Transport', en: 'Alternator to Grid' },
    description: {
      fr: 'Suivez le voyage physique des mégawatts : du stator 10.5 kV aux gaines à barres IPB, au disjoncteur de groupe, au transformateur élévateur GSU 225 kV et aux lignes aériennes sur pylônes treillis.',
      en: 'Follow the physical path of megawatts: from 10.5 kV stator to isolated phase busducts (IPB), generator breaker, 225 kV GSU step-up transformer, and lattice tower overhead lines.',
    },
    targetProfile: 'TECHNICAL',
    iconName: 'Zap',
    accentColor: 'purple',
    estimatedMinutes: 40,
    prerequisites: {
      fr: 'Tensions 10.5 kV et 225 kV, transformateurs de puissance et appareillage HTB.',
      en: '10.5 kV and 225 kV voltages, power transformers, and EHV switchgear.',
    },
    learningObjectives: [
      {
        fr: 'Comprendre l’utilité des gaines à barres à phases séparées (IPB) pour transporter des courants de 4 000 A.',
        en: 'Understand Isolated Phase Bus (IPB) ducting carrying massive 4,000 A currents.',
      },
      {
        fr: 'Analyser le rôle du disjoncteur de groupe générateur (GCB) et son pouvoir de coupure symétrique et asymétrique.',
        en: 'Analyze generator circuit breaker (GCB) duties including delayed current zero interruption.',
      },
      {
        fr: 'Explorer la ligne de transport 225 kV Songloulou - Mangombé - Bekoko.',
        en: 'Explore the Songloulou - Mangombé - Bekoko 225 kV transmission backbone.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          fr: 'Le Stator 10.5 kV & les Gaines à Barres Isolées (IPB)',
          en: '10.5 kV Stator & Isolated Phase Busducts (IPB)',
        },
        summary: {
          fr: 'Pour un alternateur de 60 MW à 10.5 kV, le courant nominal dépasse 3 300 ampères. Des conducteurs en aluminium tubulaires blindés évitent les amorçages entre phases.',
          en: 'For a 60 MW unit at 10.5 kV, nominal current exceeds 3,300 A. Aluminum tubular IPBs prevent phase-to-phase faults.',
        },
        deepExplanation: {
          fr: 'À de tels niveaux d\'intensité, les forces électrodynamiques en cas de court-circuit biphasé franc dépasseraient des dizaines de tonnes. Les gaines IPB (Isolated Phase Bus) enferment chaque phase dans une enveloppe en aluminium mise à la terre continue, éliminant tout risque de court-circuit entre phases et confinant les champs magnétiques.',
          en: 'At such current levels, phase-to-phase fault forces would exceed tens of metric tons. IPB enclosures isolate each phase within grounded aluminum housings, eliminating inter-phase faults and shielding stray magnetic fields.',
        },
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'disjoncteur-htb-sf6',
          label: { fr: 'Voir l\'Appareillage de Coupure Générateur', en: 'View Generator Breaker Equipment' },
        },
        quiz: {
          question: {
            fr: 'Quel est l\'objectif principal d\'une gaine à barres à phases séparées (IPB) en sortie d\'alternateur ?',
            en: 'What is the primary objective of Isolated Phase Bus (IPB) ducting at generator terminals?',
          },
          options: [
            { fr: 'Éliminer le risque de court-circuit entre phases et confiner les champs magnétiques', en: 'Eliminate risk of phase-to-phase faults and contain stray magnetic fields' },
            { fr: 'Chauffer la salle des machines', en: 'Heat the machine room' },
            { fr: 'Transformer le courant alternatif en continu', en: 'Rectify AC to DC' },
            { fr: 'Augmenter la fréquence à 500 Hz', en: 'Boost frequency to 500 Hz' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Les gaines IPB séparent physiquement les trois phases dans des tuyaux blindés reliés à la terre pour rendre tout contact entre phases matériellement impossible.',
            en: 'IPBs mechanically isolate the three phases in grounded metallic shields, making phase-to-phase shorts virtually impossible.',
          },
        },
      },
      {
        stepNumber: 2,
        title: {
          fr: 'Le Transformateur Élévateur de Groupe (GSU) 10.5 / 225 kV',
          en: 'Generator Step-Up (GSU) Transformer (10.5 / 225 kV)',
        },
        summary: {
          fr: 'Le transformateur GSU élève la tension de 10 500 V à 225 000 V pour diviser le courant par 21 et permettre l\'évacuation sur la dorsale nationale.',
          en: 'The GSU transformer steps up 10.5 kV to 225 kV, dividing current by 21 to inject power into the national transmission grid.',
        },
        deepExplanation: {
          fr: 'Un transformateur de 70 MVA 10.5/225 kV utilise un couplage YNd11 (Triangle au primaire BT, Étoile avec neutre sorti à la terre au secondaire HTB). Les traversées haute tension en résine imprégnée de papier (RIP) font la transition vers le jeu de barres aérien du poste de départ.',
          en: 'A 70 MVA 10.5/225 kV transformer adopts a YNd11 vector group. Resin Impregnated Paper (RIP) condenser bushings connect to the substation outdoor overhead busbar.',
        },
        keyFormulas: [
          'Pertes_Joule = 3 * R_ligne * I^2 = 3 * R_ligne * (S / (sqrt(3) * U))^2',
          'Pertes(225 kV) / Pertes(10.5 kV) = (10.5 / 225)^2 = 1 / 459',
        ],
        targetAction: {
          type: 'EQUIPMENT',
          targetId: 'transfo-puissance-htb',
          label: { fr: 'Explorer la Fiche Technique GSU 225 kV', en: 'Explore 225 kV GSU Technical Fiche' },
        },
        quiz: {
          question: {
            fr: 'Par quel facteur les pertes Joule dans la ligne de transport sont-elles divisées en élevant la tension de 10.5 kV à 225 kV ?',
            en: 'By what factor are line ohmic losses reduced when stepping up voltage from 10.5 kV to 225 kV?',
          },
          options: [
            { fr: 'Par environ 460 fois', en: 'By approximately 460 times' },
            { fr: 'Par seulement 2 fois', en: 'By only 2 times' },
            { fr: 'Les pertes augmentent', en: 'Losses actually increase' },
            { fr: 'Par 10 fois', en: 'By 10 times' },
          ],
          correctAnswerIndex: 0,
          explanation: {
            fr: 'Les pertes étant inversement proportionnelles au carré de la tension : (225 / 10.5)² = (21.43)² ≈ 459 fois moins de pertes !',
            en: 'Because ohmic losses scale inversely with voltage squared: (225 / 10.5)² ≈ 459-fold reduction in transmission losses.',
          },
        },
      },
    ],
  },
];
