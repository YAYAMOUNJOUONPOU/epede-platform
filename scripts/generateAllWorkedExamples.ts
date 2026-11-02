// scripts/generateAllWorkedExamples.ts
// Generates complete 16-domain Worked Examples covering D01 to D16
import fs from 'fs';
import path from 'path';
import { WorkedExample, WorkedExampleSchema } from '../src/types/contentSchemas';

const ALL_16_WORKED_EXAMPLES: WorkedExample[] = [
  // D01: Hydro Generator Sizing
  {
    id: 'we-d01-generator-rating',
    domainCode: 'D01',
    title: {
      fr: 'Dimensionnement Électrique d’un Groupe Turbo-Alternateur Hydroélectrique',
      en: 'Electrical Sizing of Hydroelectric Turbogenerator Unit',
    },
    problemStatement: {
      fr: 'Calculer le courant assigné nominal et la puissance active maximale d’un groupe hydroélectrique de Nachtigal (60 MW sous cosφ = 0.90) raccordé sous une tension entre phases de 15.5 kV.',
      en: 'Calculate rated nominal stator current and maximum active power delivery for a Nachtigal hydro unit (60 MW at cosφ = 0.90) connected at 15.5 kV line-to-line.',
    },
    primaryStandard: {
      standard: 'IEC 60034-1:2022',
      clause: 'Clause 6.2 (Ratings and Operating Characteristics)',
      title: {
        fr: 'Machines électriques tournantes – Partie 1 : Caractéristiques assignées et caractéristiques de fonctionnement',
        en: 'Rotating electrical machines – Part 1: Rating and performance',
      },
      normativeType: 'IEC',
      editionYear: 2022,
    },
    inputs: [
      {
        symbol: 'P_n',
        unit: 'MW',
        value: 60,
        description: { fr: 'Puissance active nominale de la turbine', en: 'Nominal turbine active power' },
      },
      {
        symbol: 'cos_phi',
        unit: 'sans unité',
        value: 0.9,
        description: { fr: 'Facteur de puissance nominal assigné', en: 'Rated power factor' },
      },
      {
        symbol: 'U_n',
        unit: 'kV',
        value: 15.5,
        description: { fr: 'Tension assignée entre phases au stator', en: 'Rated line-to-line stator voltage' },
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la puissance apparente assignée (S_n)', en: 'Calculate rated apparent power (S_n)' },
        governingFormula: 'S_n = P_n / cos(phi)',
        substitutionAndCalculation: 'S_n = 60 MW / 0.90 = 66.67 MVA',
        resultWithUnit: '66.67 MVA',
        explanation: {
          fr: 'L’alternateur doit être dimensionné thermiquement pour supporter le flux magnétique et le courant statorique correspondant à 66.67 MVA.',
          en: 'The alternator must be thermally dimensioned to sustain stator magnetic flux and current corresponding to 66.67 MVA.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul du courant nominal statorique assigné (I_n)', en: 'Calculate rated nominal stator current (I_n)' },
        governingFormula: 'I_n = S_n / (sqrt(3) * U_n)',
        substitutionAndCalculation: 'I_n = 66.67 MVA / (1.732 * 15.5 kV) = 66670 kVA / 26.847 kV = 2483.3 A',
        resultWithUnit: '2483.3 A',
        explanation: {
          fr: 'Courant efficace continu maximal circulant dans les enroulements statoriques sous pleine charge nominale.',
          en: 'Continuous RMS current flowing in stator windings at rated full load.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la puissance réactive nominale fournie (Q_n)', en: 'Calculate rated reactive power output (Q_n)' },
        governingFormula: 'Q_n = S_n * sin(phi) = sqrt(S_n^2 - P_n^2)',
        substitutionAndCalculation: 'sin(phi) = sqrt(1 - 0.9^2) = 0.4359 => Q_n = 66.67 MVA * 0.4359 = 29.06 Mvar',
        resultWithUnit: '29.06 Mvar',
        explanation: {
          fr: 'Puissance réactive inductive injectée sur le réseau pour magnétiser les transformateurs et stabiliser la tension du réseau 225 kV.',
          en: 'Inductive reactive power supplied to the grid for transformer magnetization and 225 kV voltage stability.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60034-1 : Courant nominal de 2483 A sous 15.5 kV, puissance apparente 66.67 MVA. Dimensionnement stator et système d’excitation brushless validés.',
      en: 'Complies with IEC 60034-1: 2483 A rated current at 15.5 kV, 66.67 MVA apparent power. Stator and brushless excitation sizing verified.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Le dimensionnement thermique final dépend de la classe d’isolation (Classe F/H) et de l’échauffement admissible selon CEI 60034-1.',
  },

  // D02: Power-System Architecture & Rotor Swing Equation
  {
    id: 'we-d02-rotor-swing-inertia',
    domainCode: 'D02',
    title: {
      fr: 'Stabilité Transitoire du Rotor & Constante d’Inertie H (Song Loulou)',
      en: 'Rotor Transient Stability & Inertia Constant H (Song Loulou)',
    },
    problemStatement: {
      fr: 'Sur un alternateur hydroélectrique de 48 MVA de Song Loulou (H = 3.8 s, f0 = 50 Hz), un court-circuit triphasé franc sur la ligne d’évacuation 225 kV annule subitement la puissance électrique transmise (Pe = 0 MW) alors que la turbine développe sa puissance mécanique nominale Pm = 40.8 MW. Calculer l’accélération angulaire initiale du rotor.',
      en: 'On a 48 MVA Song Loulou hydro generator (H = 3.8 s, f0 = 50 Hz), a bolted 3-phase fault on the 225 kV line drops electrical output to Pe = 0 MW while mechanical power is Pm = 40.8 MW. Calculate initial rotor angular acceleration.',
    },
    primaryStandard: {
      standard: 'IEEE Std 399-1997',
      clause: 'Chapter 8 (Transient Stability Analysis)',
      title: {
        fr: 'Pratiques recommandées IEEE pour l’analyse des réseaux électriques industriels et commerciaux',
        en: 'IEEE Recommended Practice for Industrial and Commercial Power Systems Analysis',
      },
      normativeType: 'IEEE',
      editionYear: 1997,
    },
    inputs: [
      { symbol: 'P_m', unit: 'MW', value: 40.8, description: { fr: 'Puissance mécanique fournie par la turbine', en: 'Mechanical power supplied by turbine' } },
      { symbol: 'S_n', unit: 'MVA', value: 48, description: { fr: 'Puissance apparente assignée de l’alternateur', en: 'Rated generator apparent power' } },
      { symbol: 'H', unit: 's', value: 3.8, description: { fr: 'Constante d’inertie mécanique normalisée', en: 'Normalized mechanical inertia constant' } },
      { symbol: 'f_0', unit: 'Hz', value: 50, description: { fr: 'Fréquence nominale du réseau électrique', en: 'Nominal power system grid frequency' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la puissance accélératrice nette (P_a)', en: 'Calculate net accelerating power (P_a)' },
        governingFormula: 'P_a = P_m - P_e',
        substitutionAndCalculation: 'P_a = 40.8 MW - 0.0 MW = 40.8 MW',
        resultWithUnit: '40.8 MW',
        explanation: {
          fr: 'Toute la puissance mécanique de l’eau sert instantanément à accélérer la masse tournante rotor-turbine.',
          en: 'Total mechanical turbine output instantly accelerates the rotating generator-turbine mass.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de l’énergie cinétique stockée à vitesse synchrone (E_c)', en: 'Calculate kinetic energy stored at synchronous speed (E_c)' },
        governingFormula: 'E_c = H * S_n',
        substitutionAndCalculation: 'E_c = 3.8 s * 48 MVA = 182.4 MJ (MW·s)',
        resultWithUnit: '182.4 MJ',
        explanation: {
          fr: 'Énergie mécanique emmagasinée dans le rotor tournant à sa vitesse nominale de synchronisme.',
          en: 'Stored kinetic energy in rotor spinning at nominal synchronous rotational speed.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de l’accélération rotorique initiale (d²delta/dt²)', en: 'Calculate initial rotor angular acceleration (d²delta/dt²)' },
        governingFormula: 'd2_delta_dt2 = (pi * f_0 * P_a) / (H * S_n)',
        substitutionAndCalculation: 'd2_delta_dt2 = (3.14159 * 50 * 40.8) / 182.4 = 6408.8 / 182.4 = 35.14 rad/s² = 2013.4 °/s²',
        resultWithUnit: '35.14 rad/s² (2013 °/s²)',
        explanation: {
          fr: 'À cette vitesse d’accélération, l’angle interne du rotor avance d’environ 14.5 degrés en 120 ms, ce qui confirme que le défaut doit être éliminé par les protections 225 kV en moins de 140 ms (Temps Critique d’Élimination CCT).',
          en: 'At this rate, internal rotor angle advances by ~14.5° in 120 ms, demonstrating that protections must isolate the fault in under 140 ms (Critical Clearing Time).',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme IEEE 399 : Accélération rotorique calculée à 35.14 rad/s². Stabilité transitoire préservée pour un temps d’élimination inférieur à 140 ms.',
      en: 'Complies with IEEE 399: Initial rotor acceleration of 35.14 rad/s². Transient stability maintained for clearing times under 140 ms.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. La modélisation dynamique complète inclut la régulation de vitesse (gouverneur) et l’action de l’AVR.',
  },

  // D03: Transmission Networks
  {
    id: 'we-d03-transmission-sil-ferranti',
    domainCode: 'D03',
    title: {
      fr: 'Puissance Naturelle (SIL) & Effet Ferranti Ligne 225 kV Songloulou – Bekoko',
      en: 'Surge Impedance Loading (SIL) & Ferranti Effect on 225 kV Bekoko Line',
    },
    problemStatement: {
      fr: 'Sur l’artère 225 kV de 120 km reliant le poste de Songloulou à Bekoko (conducteur Aster 570 en faisceau double), calculer l’impédance d’onde Zc, la puissance naturelle P_SIL et la surtension à vide par effet Ferranti à l’extrémité réceptrice.',
      en: 'On the 120 km 225 kV line connecting Songloulou substation to Bekoko (twin-bundle Aster 570), calculate characteristic impedance Zc, Surge Impedance Loading P_SIL, and no-load Ferranti overvoltage at receiving end.',
    },
    primaryStandard: {
      standard: 'IEC 60071-1:2019',
      clause: 'Clause 5.2 (Continuous power frequency overvoltages)',
      title: {
        fr: 'Coordination de l’isolement – Partie 1 : Définitions, principes et règles',
        en: 'Insulation co-ordination – Part 1: Definitions, principles and rules',
      },
      normativeType: 'IEC',
      editionYear: 2019,
    },
    inputs: [
      { symbol: 'U_n', unit: 'kV', value: 225, description: { fr: 'Tension assignée entre phases de la ligne', en: 'Rated line-to-line transmission voltage' } },
      { symbol: 'L', unit: 'km', value: 120, description: { fr: 'Longueur totale de la ligne aérienne', en: 'Total transmission line physical length' } },
      { symbol: 'L_prime', unit: 'mH/km', value: 0.98, description: { fr: 'Inductance linéique par phase en faisceau', en: 'Bundle linear series inductance' } },
      { symbol: 'C_prime', unit: 'nF/km', value: 11.8, description: { fr: 'Capacité linéique par phase', en: 'Linear shunt capacitance' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’impédance d’onde (Z_c)', en: 'Calculate characteristic surge impedance (Z_c)' },
        governingFormula: 'Z_c = sqrt(L_prime / C_prime)',
        substitutionAndCalculation: 'Z_c = sqrt((0.98e-3) / (11.8e-9)) = sqrt(83050.8) = 288.19 Ω',
        resultWithUnit: '288.19 Ω',
        explanation: {
          fr: 'Impédance caractéristique régissant la propagation des ondes électromagnétiques le long de la ligne HTB.',
          en: 'Characteristic surge impedance governing electromagnetic wave propagation along the HV line.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la puissance naturelle (P_SIL)', en: 'Calculate Surge Impedance Loading (P_SIL)' },
        governingFormula: 'P_SIL = U_n^2 / Z_c',
        substitutionAndCalculation: 'P_SIL = (225 kV)^2 / 288.19 Ω = 50625 / 288.19 = 175.66 MW',
        resultWithUnit: '175.66 MW',
        explanation: {
          fr: 'À cette puissance active de transit (175.7 MW), la ligne ne consomme ni ne produit de puissance réactive nette (Q = 0).',
          en: 'At this active power transfer (175.7 MW), reactive power generated by line capacitance equals series reactive losses (Q = 0).',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la surtension à vide par effet Ferranti (U_rec)', en: 'Calculate no-load Ferranti overvoltage (U_rec)' },
        governingFormula: 'U_rec = U_send / cos(beta * L) avec beta = omega * sqrt(L_prime * C_prime)',
        substitutionAndCalculation: 'beta = (2 * pi * 50) * sqrt(0.98e-6 * 11.8e-12) = 314.16 * 3.4005e-9 = 0.001068 rad/km => theta = 0.001068 * 120 = 0.1282 rad (7.34°) ; cos(0.1282) = 0.9918 => U_rec = 225 / 0.9918 = 226.86 kV (+0.83%)',
        resultWithUnit: '226.86 kV (+0.83%)',
        explanation: {
          fr: 'La surtension à vide reste modérée (+1.86 kV) en raison de la longueur modérée (120 km), ne nécessitant pas de réactance shunt permanente.',
          en: 'No-load voltage rise remains modest (+1.86 kV) due to moderate line length (120 km), avoiding permanent shunt reactor need.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60071-1 : Puissance naturelle P_SIL = 175.7 MW. Surtension Ferranti à vide de 226.9 kV <= limite d’exploitation 245 kV.',
      en: 'Complies with IEC 60071-1: Surge impedance loading 175.7 MW. Ferranti receiving voltage 226.9 kV <= 245 kV highest equipment voltage.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Pour des longueurs supérieures à 250 km, l’effet Ferranti peut atteindre +10% à +15%.',
  },

  // D04: Substations & Grid Nodes
  {
    id: 'we-d04-substation-short-circuit',
    domainCode: 'D04',
    title: {
      fr: 'Calcul du Courant de Court-Circuit Triphasé Subtransitoire (Ik’’) selon CEI 60909-0',
      en: 'Symmetrical Three-Phase Initial Short-Circuit Current (Ik’’) Calculation per IEC 60909-0',
    },
    problemStatement: {
      fr: 'Au poste 225 kV d’Oyomabang, déterminer le courant de court-circuit triphasé franc subtransitoire (Ik’’), la puissance de court-circuit apparente (Sk’’) et le courant de crête (ip) sous une impédance amont équivalente de court-circuit Zk = (8.05 + j48.20) Ω.',
      en: 'At Oyomabang 225 kV substation, determine symmetrical initial short-circuit current (Ik’’), short-circuit apparent power (Sk’’), and peak current (ip) with equivalent network impedance Zk = (8.05 + j48.20) Ω.',
    },
    primaryStandard: {
      standard: 'IEC 60909-0:2016',
      clause: 'Clause 4.2 & 4.3 (Calculation of initial symmetrical short-circuit current)',
      title: {
        fr: 'Courants de court-circuit dans les réseaux triphasés à courant alternatif – Partie 0 : Calcul des courants',
        en: 'Short-circuit currents in three-phase a.c. systems – Part 0: Calculation of currents',
      },
      normativeType: 'IEC',
      editionYear: 2016,
    },
    inputs: [
      { symbol: 'U_n', unit: 'kV', value: 225, description: { fr: 'Tension assignée entre phases du jeu de barres', en: 'Nominal line-to-line busbar voltage' } },
      { symbol: 'c_max', unit: 'sans unité', value: 1.1, description: { fr: 'Facteur de tension maximal en HT selon CEI 60909', en: 'Voltage factor for HV systems' } },
      { symbol: 'R_k', unit: 'Ω', value: 8.05, description: { fr: 'Résistance équivalente de boucle directe', en: 'Positive sequence equivalent resistance' } },
      { symbol: 'X_k', unit: 'Ω', value: 48.2, description: { fr: 'Réactance équivalente de boucle directe', en: 'Positive sequence equivalent reactance' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’impédance directe équivalente (Z_k)', en: 'Calculate positive-sequence equivalent impedance (Z_k)' },
        governingFormula: 'Z_k = sqrt(R_k^2 + X_k^2)',
        substitutionAndCalculation: 'Z_k = sqrt(8.05^2 + 48.20^2) = sqrt(64.80 + 2323.24) = sqrt(2388.04) = 48.87 Ω',
        resultWithUnit: '48.87 Ω',
        explanation: {
          fr: 'Impédance totale de court-circuit ramenée au niveau 225 kV incluant les alternateurs, transformateurs GSU et les lignes de grand transport.',
          en: 'Total equivalent short-circuit impedance referred to 225 kV level.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul du courant de court-circuit subtransitoire initial (Ik’’)', en: 'Calculate initial symmetrical short-circuit current (Ik’’)' },
        governingFormula: 'Ik_prime_prime = (c_max * U_n) / (sqrt(3) * Z_k)',
        substitutionAndCalculation: 'Ik_prime_prime = (1.10 * 225 kV) / (1.732 * 48.87 Ω) = 247.5 kV / 84.64 Ω = 2.924 kA = 2924 A',
        resultWithUnit: '2.924 kA',
        explanation: {
          fr: 'Valeur efficace de la composante symétrique alternative du courant de défaut au premier instant t = 0+.',
          en: 'RMS value of symmetrical AC component of fault current at initial instant t = 0+.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la puissance de court-circuit apparente (Sk’’)', en: 'Calculate initial short-circuit apparent power (Sk’’)' },
        governingFormula: 'Sk_prime_prime = sqrt(3) * U_n * Ik_prime_prime',
        substitutionAndCalculation: 'Sk_prime_prime = 1.732 * 225 kV * 2.924 kA = 1139.5 MVA',
        resultWithUnit: '1139.5 MVA',
        explanation: {
          fr: 'Puissance apparente de court-circuit permettant de caractériser la rigidité du jeu de barres 225 kV d’Oyomabang.',
          en: 'Short-circuit apparent power characterizing 225 kV busbar network stiffness.',
        },
      },
      {
        stepNumber: 4,
        title: { fr: 'Calcul du facteur de crête kappa et du courant de crête (ip)', en: 'Calculate peak factor kappa and peak current (ip)' },
        governingFormula: 'kappa = 1.02 + 0.98 * exp(-3 * R_k / X_k) ; ip = kappa * sqrt(2) * Ik_prime_prime',
        substitutionAndCalculation: 'R/X = 8.05 / 48.20 = 0.1670 => kappa = 1.02 + 0.98 * exp(-3 * 0.1670) = 1.02 + 0.98 * 0.6059 = 1.614 => ip = 1.614 * 1.414 * 2.924 kA = 6.673 kA',
        resultWithUnit: 'ip = 6.673 kA',
        explanation: {
          fr: 'Courant de crête asymétrique maximal gouvernant les contraintes électrodynamiques sur les barres et supports isolateurs selon CEI 60865-1.',
          en: 'Maximum peak asymmetrical short-circuit current governing electrodynamic forces on busbars and post insulators.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60909-0 : Ik’’ = 2.92 kA, ip = 6.67 kA. Pouvoir de coupure nominal des disjoncteurs 225 kV (Icn = 31.5 kA / 40 kA) largement suffisant.',
      en: 'Complies with IEC 60909-0: Ik’’ = 2.92 kA, ip = 6.67 kA. Rated breaking capacity of 225 kV breakers (31.5 kA / 40 kA) offers safe operational margin.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Les calculs réels de dimensionnement d’appareillage de poste doivent intégrer les contributions de tous les groupes interconnectés.',
  },

  // D05: Distribution Networks
  {
    id: 'we-d05-distribution-ngr-earth-fault',
    domainCode: 'D05',
    title: {
      fr: 'Limitation de Défaut Monophasé à la Terre en Réseau HTA 30 kV par Résistance de Neutre (NGR)',
      en: '30 kV MV Distribution Neutral Grounding Resistor (NGR) Earth Fault Limitation',
    },
    problemStatement: {
      fr: 'Sur le réseau HTA 30 kV de Douala/Bassa alimenté par le poste 225/30 kV d’Oyomabang, calculer la valeur ohmique de la résistance de mise à la terre du neutre R_N pour limiter le courant de défaut monophasé à la terre à If = 40 A et vérifier l’énergie thermique dissipée pendant 10 secondes.',
      en: 'On the Douala/Bassa 30 kV MV distribution grid fed by Oyomabang 225/30 kV substation, calculate ohmic resistance of neutral grounding resistor R_N to limit single-phase-to-earth fault to If = 40 A and verify thermal energy dissipation for 10 seconds.',
    },
    primaryStandard: {
      standard: 'IEC 60076-16:2018',
      clause: 'Clause 6 (Rating of neutral earthing devices)',
      title: {
        fr: 'Transformateurs de puissance – Partie 16 : Transformateurs pour éoliennes et dispositifs de neutre',
        en: 'Power transformers – Part 16: Transformers for wind turbine applications & earthing devices',
      },
      normativeType: 'IEC',
      editionYear: 2018,
    },
    inputs: [
      { symbol: 'U_n', unit: 'kV', value: 30, description: { fr: 'Tension assignée entre phases du réseau HTA', en: 'Nominal line-to-line MV grid voltage' } },
      { symbol: 'I_f', unit: 'A', value: 40, description: { fr: 'Courant de défaut monophasé de consigne', en: 'Target earth fault current limit' } },
      { symbol: 't_def', unit: 's', value: 10, description: { fr: 'Durée maximale admissible du défaut terre', en: 'Maximum allowable fault duration' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la tension simple phase-neutre (V_ph)', en: 'Calculate single-phase line-to-neutral voltage (V_ph)' },
        governingFormula: 'V_ph = U_n / sqrt(3)',
        substitutionAndCalculation: 'V_ph = 30000 V / 1.732 = 17320.5 V',
        resultWithUnit: '17320.5 V',
        explanation: {
          fr: 'Tension fondamentale appliquée aux bornes de la résistance lors d’un défaut franc entre une phase et la terre.',
          en: 'Fundamental phase voltage impressed across neutral resistor during a solid single phase-to-ground fault.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la résistance nominale de limitation (R_N)', en: 'Calculate nominal resistance value (R_N)' },
        governingFormula: 'R_N = V_ph / I_f',
        substitutionAndCalculation: 'R_N = 17320.5 V / 40.0 A = 433.01 Ω',
        resultWithUnit: '433.0 Ω',
        explanation: {
          fr: 'Valeur standardisée de résistance de neutre SONATREL/Eneo pour les réseaux 30 kV à neutre impédant.',
          en: 'Standard SONATREL/Eneo neutral resistor rating for 30 kV impedance-grounded distribution networks.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la puissance thermique et énergie dissipée (E_th)', en: 'Calculate thermal power and dissipated energy (E_th)' },
        governingFormula: 'P_N = R_N * I_f^2 ; E_th = P_N * t_def',
        substitutionAndCalculation: 'P_N = 433.0 Ω * (40 A)^2 = 692800 W = 692.8 kW => E_th = 692.8 kW * 10 s = 6.928 MJ',
        resultWithUnit: 'P_N = 692.8 kW, E_th = 6.93 MJ',
        explanation: {
          fr: 'La résistance en acier inoxydable doit être dimensionnée thermiquement pour absorber 6.93 MJ sans élévation de température excessive (> 350°C).',
          en: 'The stainless steel grid resistor must be thermally designed to absorb 6.93 MJ without exceeding permissible temperature rises (> 350°C).',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme standard CEI 60076-16 et SONATREL : Résistance de neutre R_N = 433 Ω / 40 A / 10 s validée. Détection garantie par relais de terre ANSI 51N.',
      en: 'Complies with IEC 60076-16 and SONATREL practice: Neutral resistor 433 Ω / 40 A / 10 s verified. Earth fault detection assured by ANSI 51N relay.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. La présence de câbles souterrains étendus peut introduire un courant capacitif homopolaire résiduel non négligeable.',
  },

  // D06: Electrical Installations & Utilization
  {
    id: 'we-d06-cable-voltage-drop',
    domainCode: 'D06',
    title: {
      fr: 'Dimensionnement de Câble Basse Tension et Vérification de la Chute de Tension (NF C 15-100)',
      en: 'Low-Voltage Cable Sizing & Voltage Drop Verification (IEC 60364-5-52)',
    },
    problemStatement: {
      fr: 'Une ligne triphasée 400 V en câble cuivre 70 mm² PR (XLPE) d’une longueur de 110 m alimente un compresseur industriel absorbant 160 A avec cosφ = 0.85 dans la zone industrielle de Bassa. Vérifier que la chute de tension respecte la limite normative de 5.0%.',
      en: 'A 400 V three-phase 70 mm² copper XLPE cable feeder with run length 110 m supplies an industrial compressor drawing 160 A at cosφ = 0.85 in Bassa industrial zone. Verify that voltage drop complies with 5.0% standard threshold.',
    },
    primaryStandard: {
      standard: 'IEC 60364-5-52:2019',
      clause: 'Clause 525 (Voltage drop in consumers’ installations)',
      title: {
        fr: 'Installations électriques à basse tension – Choix et mise en œuvre des matériels – Canalisations',
        en: 'Low-voltage electrical installations – Selection and erection of electrical equipment – Wiring systems',
      },
      normativeType: 'IEC',
      editionYear: 2019,
    },
    inputs: [
      { symbol: 'I_b', unit: 'A', value: 160, description: { fr: 'Courant d’emploi assigné de la charge', en: 'Design load operating current' } },
      { symbol: 'L', unit: 'm', value: 110, description: { fr: 'Longueur de la liaison entre TGBT et récepteur', en: 'Feeder run distance from TGBT to load' } },
      { symbol: 'cos_phi', unit: 'sans unité', value: 0.85, description: { fr: 'Facteur de puissance en régime nominal', en: 'Operating power factor' } },
      { symbol: 'S_cu', unit: 'mm²', value: 70, description: { fr: 'Section nominale des conducteurs en cuivre', en: 'Copper cross-sectional area' } },
      { symbol: 'U_n', unit: 'V', value: 400, description: { fr: 'Tension assignée entre phases', en: 'Nominal line-to-line voltage' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Paramètres linéiques du câble cuivre 70 mm² à 90°C', en: 'Linear parameters for 70 mm² copper cable at 90°C' },
        governingFormula: 'R_prime = rho_90 / S, X_prime = 0.08 Ω/km',
        substitutionAndCalculation: 'rho_cu_90 = 0.023 Ω·mm²/m => R_prime = 0.023 / 70 = 0.0003285 Ω/m = 0.329 Ω/km ; X_prime = 0.08 Ω/km',
        resultWithUnit: 'R\' = 0.329 Ω/km, X\' = 0.080 Ω/km',
        explanation: {
          fr: 'Pour un isolant PR (XLPE), la température d’âme en service continu est de 90°C selon CEI 60364-5-52.',
          en: 'For XLPE insulation, maximum continuous conductor operating temperature is 90°C per IEC 60364-5-52.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la chute de tension absolue (Delta U)', en: 'Calculate absolute voltage drop (Delta U)' },
        governingFormula: 'Delta_U = sqrt(3) * I * (L / 1000) * (R_prime * cos(phi) + X_prime * sin(phi))',
        substitutionAndCalculation: 'sin(phi) = sqrt(1 - 0.85^2) = 0.5268 => (0.329 * 0.85 + 0.08 * 0.5268) = (0.2796 + 0.0421) = 0.3217 Ω/km ; Delta_U = 1.732 * 160 * 0.110 * 0.3217 = 9.80 V',
        resultWithUnit: '9.80 V',
        explanation: {
          fr: 'Tension perdue le long des 110 mètres de câble sous le courant d’emploi de 160 A.',
          en: 'Voltage dropped along 110 meters of cable under 160 A design load.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la chute de tension relative en pourcentage', en: 'Calculate percentage relative voltage drop' },
        governingFormula: 'Delta_U_percent = (Delta_U / U_n) * 100',
        substitutionAndCalculation: 'Delta_U_percent = (9.80 V / 400 V) * 100 = 2.45%',
        resultWithUnit: '2.45%',
        explanation: {
          fr: 'La norme NF C 15-100 autorise jusqu’à 5% pour les récepteurs de force motrice (moteurs/compresseurs). La valeur de 2.45% offre une excellente marge.',
          en: 'NF C 15-100 permits up to 5% drop for motor loads. 2.45% offers high reliability and safe starting margins.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme NF C 15-100 et CEI 60364-5-52 : Chute de tension mesurée à 2.45% <= limite admissible 5.0%. Section 70 mm² Cu validée.',
      en: 'Complies with NF C 15-100 and IEC 60364-5-52: 2.45% <= 5.0% maximum allowable drop. 70 mm² Cu cross-section verified.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Le dimensionnement thermique complet requiert les facteurs de correction k1, k2, k3.',
  },

  // D07: Industrial Automation, DCS & Drives
  {
    id: 'we-d07-automation-pid-420ma',
    domainCode: 'D07',
    title: {
      fr: 'Bilan Électrique Boucle 4-20 mA HART & Réglage PID Régulateur Numérique',
      en: '4-20 mA HART Instrumentation Loop Budget & Digital PID Tuning',
    },
    problemStatement: {
      fr: 'Vérifier la tension résiduelle disponible aux bornes d’un transmetteur de pression 4-20 mA HART installé sur la bâche spirale de Nachtigal avec 450 m de câble blindé (2 x 0.75 mm² Cu), alimenté en 24V DC sous un courant de saturation NAMUR NE 43 de 21.5 mA à travers une résistance d’entrée PLC de 250 Ω.',
      en: 'Verify residual voltage available at terminals of a 4-20 mA HART pressure transmitter on Nachtigal spiral casing with 450 m cable (2 x 0.75 mm² Cu), fed from 24V DC at NAMUR NE 43 saturation current of 21.5 mA across 250 Ω PLC input.',
    },
    primaryStandard: {
      standard: 'IEC 61131-2:2017',
      clause: 'Clause 5.2.2 (Analogue inputs 4-20 mA characteristics)',
      title: {
        fr: 'Automates programmables – Partie 2 : Exigences et essais des équipements',
        en: 'Programmable controllers – Part 2: Equipment requirements and tests',
      },
      normativeType: 'IEC',
      editionYear: 2017,
    },
    inputs: [
      { symbol: 'U_alim', unit: 'V DC', value: 24, description: { fr: 'Tension de l’alimentation auxiliaire régulée', en: 'Regulated 24V DC power supply voltage' } },
      { symbol: 'I_max', unit: 'mA', value: 21.5, description: { fr: 'Courant maximal de saturation NAMUR NE 43', en: 'Maximum NAMUR NE 43 saturation loop current' } },
      { symbol: 'R_plc', unit: 'Ω', value: 250, description: { fr: 'Résistance de mesure shunt de la carte automate', en: 'PLC input module measurement shunt resistance' } },
      { symbol: 'L_cable', unit: 'm', value: 450, description: { fr: 'Longueur aller du câble d’instrumentation', en: 'One-way cable route distance' } },
      { symbol: 'U_tx_min', unit: 'V DC', value: 12, description: { fr: 'Tension minimale de fonctionnement du transmetteur', en: 'Transmitter minimum operating terminal voltage' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la résistance de boucle de câble aller-retour (R_loop)', en: 'Calculate two-wire round-trip cable loop resistance (R_loop)' },
        governingFormula: 'R_cable = 2 * rho_20 * (L / S)',
        substitutionAndCalculation: 'R_cable = 2 * 0.0175 Ω·mm²/m * (450 m / 0.75 mm²) = 21.0 Ω',
        resultWithUnit: '21.0 Ω',
        explanation: {
          fr: 'Résistance ohmique totale des deux brins conducteurs cuivre de 0.75 mm² sur 450 mètres.',
          en: 'Total ohmic resistance of both 0.75 mm² copper cores along 450 meters.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la chute de tension totale de boucle à saturation', en: 'Calculate total loop voltage drop at saturation current' },
        governingFormula: 'Delta_U_total = (R_plc + R_cable) * I_max',
        substitutionAndCalculation: 'R_total = 250 Ω + 21.0 Ω = 271.0 Ω => Delta_U_total = 271.0 Ω * 0.0215 A = 5.826 V',
        resultWithUnit: '5.83 V',
        explanation: {
          fr: 'Chute de tension maximale provoquée par la résistance de mesure du PLC et la liaison de terrain.',
          en: 'Maximum voltage dropped across PLC shunt resistor and field instrumentation cable.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Vérification de la tension résiduelle aux bornes du transmetteur (U_tx)', en: 'Verify residual transmitter terminal voltage (U_tx)' },
        governingFormula: 'U_tx = U_alim - Delta_U_total',
        substitutionAndCalculation: 'U_tx = 24.00 V - 5.83 V = 18.17 V DC',
        resultWithUnit: '18.17 V DC',
        explanation: {
          fr: 'La tension aux bornes (18.17 V) est largement supérieure au seuil minimal de 12.0 V requis pour le fonctionnement correct du transmetteur et la communication HART.',
          en: 'Terminal voltage (18.17 V) substantially exceeds minimum 12.0 V threshold required for transmitter electronics and HART FSK modems.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 61131-2 et NAMUR NE 43 : Tension résiduelle 18.17 V >= 12.0 V (marge de 6.17 V). Boucle d’instrumentation 4-20 mA validée.',
      en: 'Complies with IEC 61131-2 and NAMUR NE 43: Residual voltage 18.17 V >= 12.0 V (safety margin 6.17 V). 4-20 mA loop sizing verified.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Si des barrières Zener de sécurité intrinsèque Ex-i sont insérées, ajouter ~300 Ω au bilan de résistance.',
  },

  // D08: Building Electrical Systems & Low-Current
  {
    id: 'we-d08-building-neutral-harmonics',
    domainCode: 'D08',
    title: {
      fr: 'Dimensionnement du Conducteur Neutre en Présence d’Harmoniques 3 dans un Immeuble Tertiaire',
      en: 'Neutral Conductor Sizing Under 3rd Harmonics in Commercial Buildings',
    },
    problemStatement: {
      fr: 'Dans un complexe tertiaire et centre de données à Douala, la colonne montante triphasée 400 V alimente des charges informatiques monophasées avec un courant d’emploi Ib = 200 A et un taux d’harmonique 3 de 40%. Calculer le courant dans le conducteur neutre et la section requise selon la CEI 60364-5-52.',
      en: 'In a commercial and data center facility in Douala, a 400 V 3-phase feeder supplies single-phase IT server loads drawing Ib = 200 A with 40% 3rd harmonic content. Calculate neutral conductor current and required cross-section per IEC 60364-5-52.',
    },
    primaryStandard: {
      standard: 'IEC 60364-5-52:2019',
      clause: 'Annex E (Effects of harmonic currents on balanced three-phase systems)',
      title: {
        fr: 'Installations électriques à basse tension – Effet des courants harmoniques sur les systèmes triphasés équilibrés',
        en: 'Low-voltage electrical installations – Effect of harmonic currents on balanced three-phase systems',
      },
      normativeType: 'IEC',
      editionYear: 2019,
    },
    inputs: [
      { symbol: 'I_b', unit: 'A', value: 200, description: { fr: 'Courant d’emploi assigné par phase', en: 'Phase design operating current' } },
      { symbol: 'THD_3', unit: '%', value: 40, description: { fr: 'Taux d’harmonique 3 de courant homopolaire', en: '3rd harmonic zero-sequence current percentage' } },
      { symbol: 'U_n', unit: 'V', value: 400, description: { fr: 'Tension assignée entre phases', en: 'Rated line-to-line voltage' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul du courant circulant dans le conducteur de neutre (I_N)', en: 'Calculate neutral conductor current (I_N)' },
        governingFormula: 'I_N = 3 * I_h3 = 3 * (THD_3 / 100) * I_b',
        substitutionAndCalculation: 'I_N = 3 * 0.40 * 200 A = 240.0 A',
        resultWithUnit: '240.0 A',
        explanation: {
          fr: 'Les courants harmoniques de rang 3 étant en phase (homopolaires), ils s’additionnent arithmétiquement dans le conducteur de neutre, qui dépasse le courant de phase (240 A > 200 A).',
          en: 'Because triplen harmonics are zero-sequence and in-phase, they sum arithmetically in the neutral conductor, exceeding phase current (240 A > 200 A).',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Application du facteur de réduction harmonique selon Annexe E', en: 'Apply harmonic reduction factor per Annex E' },
        governingFormula: 'I_design = I_N / k_h avec k_h = 0.86 pour 33% < THD_3 <= 45%',
        substitutionAndCalculation: 'I_design = 240.0 A / 0.86 = 279.07 A',
        resultWithUnit: '279.07 A',
        explanation: {
          fr: 'La norme CEI impose de dimensionner le câble sur la base du courant de neutre divisé par le facteur de déclassement thermique de 0.86.',
          en: 'IEC standard requires sizing cable cross-section based on neutral current divided by 0.86 thermal derating factor.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Sélection de la section cuivre et vérification d’admissibilité', en: 'Select copper cross-section and check ampacity' },
        governingFormula: 'I_z >= I_design',
        substitutionAndCalculation: 'Section 120 mm² Cu XLPE (Mode de pose F sur chemin de câbles perforé) : I_z = 313 A >= 279 A',
        resultWithUnit: 'Section 120 mm² Cu (I_z = 313 A)',
        explanation: {
          fr: 'Le conducteur neutre doit avoir une section égale à celle des phases (S_N = S_ph = 120 mm² Cu) pour éliminer tout risque d’échauffement destructeur.',
          en: 'Neutral conductor must have identical cross-section as phase conductors (S_N = S_ph = 120 mm² Cu) to prevent thermal degradation.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60364-5-52 Annexe E : Courant neutre 240 A pris en compte. Câble 4 x 120 mm² Cu validé pour résister aux contraintes thermiques harmoniques.',
      en: 'Complies with IEC 60364-5-52 Annex E: Neutral current 240 A accounted for. 4 x 120 mm² Cu cable verified against harmonic thermal stresses.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Pour THD3 > 45%, un filtre actif d’harmoniques ou un transformateur à couplage Dyn11 est recommandé.',
  },

  // D09: AI & Advanced Technologies / Renewable Solar
  {
    id: 'we-d09-solar-pv-performance-ratio',
    domainCode: 'D09',
    title: {
      fr: 'Dimensionnement & Facteur de Performance (PR) d’une Centrale Solaire 10 MWc à Maroua',
      en: '10 MWp Solar PV Sizing & Performance Ratio (PR) at Maroua',
    },
    problemStatement: {
      fr: 'Pour la centrale solaire photovoltaïque de Maroua (Extrême-Nord Cameroun, 10 MWc), calculer la production annuelle d’énergie injectée au réseau sous une irradiation globale horizontale de GHI = 2150 kWh/m²/an avec un facteur de performance estimé à PR = 78.5% en environnement sahélien chaud (40°C ambiant).',
      en: 'For Maroua 10 MWp solar farm (Far North Cameroon), calculate annual grid-injected energy generation under global horizontal irradiance GHI = 2150 kWh/m²/year with an estimated Performance Ratio PR = 78.5% under hot Sahelian climate (40°C ambient).',
    },
    primaryStandard: {
      standard: 'IEC 61724-1:2021',
      clause: 'Clause 9 (Performance metrics and Performance Ratio)',
      title: {
        fr: 'Performances des systèmes photovoltaïques – Partie 1 : Surveillance et métrologie',
        en: 'Photovoltaic system performance – Part 1: Monitoring',
      },
      normativeType: 'IEC',
      editionYear: 2021,
    },
    inputs: [
      { symbol: 'P_peak', unit: 'MWc', value: 10, description: { fr: 'Puissance crête installée des modules PV (STC)', en: 'Installed DC peak PV module rating (STC)' } },
      { symbol: 'GHI', unit: 'kWh/m²/an', value: 2150, description: { fr: 'Irradiation globale annuelle mesurée sur site', en: 'Site annual Global Horizontal Irradiance' } },
      { symbol: 'PR', unit: 'sans unité', value: 0.785, description: { fr: 'Facteur de performance global (Performance Ratio)', en: 'Overall system Performance Ratio' } },
      { symbol: 'G_stc', unit: 'kW/m²', value: 1.0, description: { fr: 'Irradiance de référence aux conditions de test STC', en: 'Standard Test Conditions reference irradiance' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul du nombre d’heures de crête équivalentes (PSH)', en: 'Calculate equivalent Peak Sun Hours (PSH)' },
        governingFormula: 'PSH = GHI / G_stc',
        substitutionAndCalculation: 'PSH = 2150 kWh/m²/an / 1.0 kW/m² = 2150 h/an (soit 5.89 h/jour en moyenne)',
        resultWithUnit: '2150 h/an',
        explanation: {
          fr: 'Durée équivalente annuelle durant laquelle le rayonnement solaire délivrerait 1000 W/m² en continu.',
          en: 'Equivalent annual hours during which solar irradiance would continuously deliver 1000 W/m².',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la production théorique nominale STC (E_theo)', en: 'Calculate theoretical nominal STC yield (E_theo)' },
        governingFormula: 'E_theo = P_peak * PSH',
        substitutionAndCalculation: 'E_theo = 10.0 MWc * 2150 h = 21500 MWh/an',
        resultWithUnit: '21500 MWh/an',
        explanation: {
          fr: 'Production d’énergie théorique sous les conditions parfaites de laboratoire (25°C, AM 1.5).',
          en: 'Theoretical energy generation assuming ideal laboratory conditions (25°C, AM 1.5).',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de l’énergie annuelle réelle injectée au réseau (E_grid)', en: 'Calculate actual annual energy injected into grid (E_grid)' },
        governingFormula: 'E_grid = E_theo * PR',
        substitutionAndCalculation: 'E_grid = 21500 MWh * 0.785 = 16877.5 MWh/an (soit 16.88 GWh/an)',
        resultWithUnit: '16877.5 MWh/an (16.88 GWh)',
        explanation: {
          fr: 'Énergie réelle tenant compte des pertes thermiques des cellules à 60°C (-0.38%/°C), de l’onduleur (rendement 98.5%), du soiling/poussière (4%) et des câbles DC/AC.',
          en: 'Real injected energy accounting for cell thermal coefficient at 60°C (-0.38%/°C), inverter efficiency (98.5%), soiling losses (4%) and cabling.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 61724-1 : Facteur de performance PR = 78.5% validé. Production annuelle attendue de 16.88 GWh injectée sur le réseau interconnecté Nord (RIN).',
      en: 'Complies with IEC 61724-1: 78.5% Performance Ratio verified. Expected annual yield of 16.88 GWh delivered to Cameroon Northern Grid (RIN).',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Les calculs d’exploitation mensuels doivent intégrer les variations saisonnières de brume sèche et d’Harmattan.',
  },

  // D10: Energy Storage & Charging
  {
    id: 'we-d10-bess-container-sizing',
    domainCode: 'D10',
    title: {
      fr: 'Dimensionnement d’un Système de Stockage par Batteries BESS 5 MW / 10 MWh',
      en: '5 MW / 10 MWh Utility BESS Container Sizing & Autonomy',
    },
    problemStatement: {
      fr: 'Dimensionner la capacité nominale brute de stockage électrochimique d’un conteneur BESS LiFePO4 de 5 MW pour assurer 2 heures de décharge à pleine puissance au poste 30 kV d’Oyomabang, avec une profondeur de décharge DoD = 85% et un rendement aller-retour de l’onduleur PCS et des auxiliaires de 91.7%.',
      en: 'Size gross nominal storage capacity of a 5 MW LiFePO4 utility BESS container to sustain 2 hours full-power discharge at Oyomabang 30 kV substation, with 85% DoD and 91.7% round-trip PCS inverter and balance-of-plant efficiency.',
    },
    primaryStandard: {
      standard: 'IEC 62933-2-1:2017',
      clause: 'Clause 5.3 (Energy capacity and rating verification)',
      title: {
        fr: 'Systèmes de stockage de l’énergie électrique (EES) – Partie 2-1 : Paramètres unitaires et méthodes d’essais',
        en: 'Electrical energy storage (EES) systems – Part 2-1: Unit parameters and testing methods',
      },
      normativeType: 'IEC',
      editionYear: 2017,
    },
    inputs: [
      { symbol: 'P_req', unit: 'MW', value: 5, description: { fr: 'Puissance active demandée par le réseau', en: 'Required grid active power discharge' } },
      { symbol: 't_autonomie', unit: 'h', value: 2, description: { fr: 'Durée d’autonomie requise à pleine charge', en: 'Required autonomy duration at full power' } },
      { symbol: 'DoD', unit: 'sans unité', value: 0.85, description: { fr: 'Profondeur de décharge maximale admissible', en: 'Maximum allowable Depth of Discharge' } },
      { symbol: 'eta_bess', unit: 'sans unité', value: 0.917, description: { fr: 'Rendement global aller-retour (batterie + PCS)', en: 'Round-trip efficiency of battery and inverter' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’énergie utile requise par le réseau (E_utile)', en: 'Calculate required usable energy (E_utile)' },
        governingFormula: 'E_utile = P_req * t_autonomie',
        substitutionAndCalculation: 'E_utile = 5.0 MW * 2.0 h = 10.0 MWh',
        resultWithUnit: '10.0 MWh',
        explanation: {
          fr: 'Quantité d’énergie active nette qui doit être injectée sur le jeu de barres 30 kV pendant la pointe de charge.',
          en: 'Net active energy delivered to the 30 kV busbar during peak demand hours.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la capacité nominale brute de batterie (E_brute)', en: 'Calculate gross nominal battery capacity (E_brute)' },
        governingFormula: 'E_brute = E_utile / (DoD * eta_bess)',
        substitutionAndCalculation: 'E_brute = 10.0 MWh / (0.85 * 0.917) = 10.0 / 0.77945 = 12.83 MWh',
        resultWithUnit: '12.83 MWh',
        explanation: {
          fr: 'La batterie doit intégrer une réserve de 15% pour éviter la décharge profonde destructrice des cellules LFP et compenser les pertes de conversion.',
          en: 'Gross capacity incorporates 15% reserve to prevent deep cell degradation and cover inverter/transformer thermal conversion losses.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul du courant de décharge continu sous 800V DC (I_dc)', en: 'Calculate continuous DC discharge current at 800V DC (I_dc)' },
        governingFormula: 'I_dc = (P_req * 10^6) / (U_dc * eta_pcs)',
        substitutionAndCalculation: 'I_dc = (5.0 * 10^6 W) / (800 V * 0.965) = 5000000 / 772 = 6476.7 A DC',
        resultWithUnit: '6476.7 A DC',
        explanation: {
          fr: 'Courant continu réparti sur 4 sous-sections d’onduleurs PCS de 1.25 MW chacune (~1620 A par onduleur).',
          en: 'Continuous DC bus current divided across 4 PCS inverter sub-modules of 1.25 MW each (~1620 A each).',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 62933-2-1 : Capacité brute de 12.83 MWh (5 conteneurs modulaires 40 pieds de 2.56 MWh) validée. Durée de vie cyclique de 6000 cycles à 85% DoD assurée.',
      en: 'Complies with IEC 62933-2-1: Gross capacity 12.83 MWh (5 modular 40-foot containers of 2.56 MWh each) verified for 6000 cycles at 85% DoD.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. La dégradation de capacité SoH (State of Health) de 2.0% par an doit être prise en compte dans le plan d’augmentation.',
  },

  // D11: Protection, Measurements & System Studies
  {
    id: 'we-d11-protection-relay-coordination',
    domainCode: 'D11',
    title: {
      fr: 'Coordination Sélective Temps-Courant (TCC) Relais ANSI 51 Inverse',
      en: 'Overcurrent Protection Time-Current Coordination (TCC) ANSI 51',
    },
    problemStatement: {
      fr: 'Calculer le temps de déclenchement d’un relais numérique de protection à maximum de courant temporisé (ANSI 51) conforme à la courbe CEI Inverse Normale sur un départ 30 kV avec un courant de réglage Is = 200 A et un multiplicateur de temps TMS = 0.15 sous un courant de court-circuit Icc = 2400 A.',
      en: 'Calculate operating tripping time of an inverse-time overcurrent protection relay (ANSI 51) per IEC Standard Inverse curve on a 30 kV feeder with current setting Is = 200 A and Time Multiplier Setting TMS = 0.15 under short-circuit current Icc = 2400 A.',
    },
    primaryStandard: {
      standard: 'IEC 60255-151:2009',
      clause: 'Clause 5.3 (Standard inverse time characteristics)',
      title: {
        fr: 'Relais de mesure et dispositifs de protection – Partie 151 : Exigences fonctionnelles pour la protection à maximum/minimum de courant',
        en: 'Measuring relays and protection equipment – Part 151: Functional requirements for over/under current protection',
      },
      normativeType: 'IEC',
      editionYear: 2009,
    },
    inputs: [
      { symbol: 'I_s', unit: 'A', value: 200, description: { fr: 'Courant de seuil de démarrage assigné du relais', en: 'Relay primary pick-up threshold current' } },
      { symbol: 'I_cc', unit: 'A', value: 2400, description: { fr: 'Courant de court-circuit traversant la protection', en: 'Fault short-circuit current seen by relay' } },
      { symbol: 'TMS', unit: 'sans unité', value: 0.15, description: { fr: 'Multiplicateur d’échelle de temps (Time Multiplier Setting)', en: 'Time Multiplier Setting scale factor' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul du multiple du courant de réglage (M)', en: 'Calculate plug setting multiplier (M)' },
        governingFormula: 'M = I_cc / I_s',
        substitutionAndCalculation: 'M = 2400 A / 200 A = 12.0',
        resultWithUnit: '12.0',
        explanation: {
          fr: 'Le courant de défaut représente exactement 12 fois le courant de seuil du départ.',
          en: 'The fault current represents exactly 12 times the relay rated pick-up threshold.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Application de l’équation caractéristique CEI Inverse Normale', en: 'Apply IEC Standard Inverse characteristic equation' },
        governingFormula: 't = TMS * [ 0.14 / (M^0.02 - 1) ]',
        substitutionAndCalculation: 'M^0.02 = 12.0^0.02 = 1.05096 => Denominateur = 1.05096 - 1 = 0.05096 => Terme de temps = 0.14 / 0.05096 = 2.747 s => t = 0.15 * 2.747 = 0.412 s',
        resultWithUnit: '0.412 s (412 ms)',
        explanation: {
          fr: 'Le relais numérique émettra son ordre de déclenchement (Trip) au disjoncteur après 412 millisecondes.',
          en: 'The numerical IED issues its trip command contact to the circuit breaker after 412 milliseconds.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Vérification de l’intervalle de sélectivité chronométrique (CSI)', en: 'Verify grading margin selective interval (CSI)' },
        governingFormula: 'Delta_t_selectif = t_amont - t_aval',
        substitutionAndCalculation: 't_aval = 0.412 s ; pour t_amont = 0.720 s => Delta_t = 0.720 - 0.412 = 0.308 s (308 ms >= 300 ms)',
        resultWithUnit: '308 ms (>= 300 ms)',
        explanation: {
          fr: 'Marge chronométrique de 308 ms assurant une sélectivité totale avec le disjoncteur de tête amont en tenant compte du temps d’ouverture mécanique (60 ms) et de la tolérance du relais.',
          en: '308 ms grading margin ensures absolute selectivity with upstream breaker, covering breaker opening time (60 ms) and relay overshoot.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60255-151 : Temps de déclenchement t = 412 ms. Intervalle sélectif de 308 ms validé selon les règles de coordination de protection.',
      en: 'Complies with IEC 60255-151: Operating time t = 412 ms. Selective grading margin 308 ms verified per protection coordination guidelines.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Pour les défauts très proches du jeu de barres, l’élément instantané ANSI 50 prend le relais sans temporisation (< 30 ms).',
  },

  // D12: Substation Automation Systems (SAS)
  {
    id: 'we-d12-substation-goose-latency',
    domainCode: 'D12',
    title: {
      fr: 'Budget Temporel & Latence de Déclenchement GOOSE dans un Poste Numérique 225 kV',
      en: 'Digital Substation GOOSE Trip Latency & Network Budget (IEC 61850-8-1)',
    },
    problemStatement: {
      fr: 'Dans un poste numérique CEI 61850 225 kV, calculer le temps total de transmission d’un ordre de déclenchement rapide GOOSE (Trip inter-tranches ANSI 87B vers disjoncteur 225 kV) à travers un commutateur Ethernet durci PRP avec 200 m de fibre optique monomode.',
      en: 'In a 225 kV IEC 61850 digital substation, calculate total transmission time for a fast GOOSE trip command (ANSI 87B busbar differential to 225 kV breaker) traversing a PRP industrial switch and 200 m single-mode fiber.',
    },
    primaryStandard: {
      standard: 'IEC 61850-8-1:2020',
      clause: 'Clause 8.1 & IEC 61850-5 Clause 13.3 (Type 1A fast messages, Class P1)',
      title: {
        fr: 'Réseaux et systèmes de communication pour l’automatisation des services de distribution d’énergie – Spécification des applications particulières',
        en: 'Communication networks and systems for power utility automation – Specific communication service mapping (SCSM)',
      },
      normativeType: 'IEC',
      editionYear: 2020,
    },
    inputs: [
      { symbol: 'T_ied_tx', unit: 'ms', value: 1.2, description: { fr: 'Temps de détection et publication du message par le relais IED', en: 'IED trip detection and GOOSE packet publication time' } },
      { symbol: 'T_serial', unit: 'ms', value: 0.02, description: { fr: 'Temps de sérialisation trame Ethernet 100 Mbps', en: '100 Mbps Ethernet frame serialization time' } },
      { symbol: 'T_switch', unit: 'ms', value: 0.015, description: { fr: 'Temps de traversée du switch durci (Store & Forward)', en: 'PRP Ethernet industrial switch forwarding latency' } },
      { symbol: 'L_fiber', unit: 'm', value: 200, description: { fr: 'Longueur de la liaison fibre optique monomode', en: 'Optical fiber cable route length' } },
      { symbol: 'T_bcu_rx', unit: 'ms', value: 1.0, description: { fr: 'Temps de réception et décodage par le BCU de tranche', en: 'Bay controller reception and output relay activation time' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul du temps de propagation dans la fibre optique (T_prop)', en: 'Calculate optical fiber propagation delay (T_prop)' },
        governingFormula: 'T_prop = L_fiber / v_lumiere_verre avec v = c / 1.47',
        substitutionAndCalculation: 'v = 300000 km/s / 1.47 = 204081 km/s = 204 m/µs => T_prop = 200 m / (204 m/µs) = 0.98 µs = 0.001 ms',
        resultWithUnit: '0.001 ms',
        explanation: {
          fr: 'Délai physique de propagation de la lumière le long des 200 mètres de fibre monomode.',
          en: 'Physical light propagation delay along 200 meters of single-mode fiber optic core.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul du temps de transfert réseau complet (T_net)', en: 'Calculate total network transmission transit delay (T_net)' },
        governingFormula: 'T_net = T_serial + T_switch + T_prop',
        substitutionAndCalculation: 'T_net = 0.020 ms + 0.015 ms + 0.001 ms = 0.036 ms (36 µs)',
        resultWithUnit: '0.036 ms',
        explanation: {
          fr: 'Grâce au marquage de priorité VLAN 802.1Q (priorité 7 pour GOOSE), la trame passe sans file d’attente dans le commutateur.',
          en: 'Thanks to 802.1Q priority tagging (Priority 7 for GOOSE), the packet avoids queuing in switch buffers.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la latence totale de bout en bout (T_total)', en: 'Calculate total end-to-end trip command latency (T_total)' },
        governingFormula: 'T_total = T_ied_tx + T_net + T_bcu_rx',
        substitutionAndCalculation: 'T_total = 1.20 ms + 0.036 ms + 1.00 ms = 2.236 ms',
        resultWithUnit: '2.24 ms',
        explanation: {
          fr: 'Temps global depuis l’apparition du défaut jusqu’à la fermeture du contact de déclenchement vers la bobine du disjoncteur.',
          en: 'Overall elapsed duration from fault detection to physical breaker trip coil output energization.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 61850-5 Classe P1 : Latence totale de 2.24 ms <= limite maximale de 3.0 ms requise pour les déclenchements d’urgence Type 1A.',
      en: 'Complies with IEC 61850-5 Class P1: Total end-to-end latency of 2.24 ms <= 3.0 ms maximum limit for Type 1A trip messages.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. En cas de tempête réseau, le protocole PRP garantit que la trame arrive par le chemin B sans gigue supplémentaire.',
  },

  // D13: Communications & Operational Technology
  {
    id: 'we-d13-ot-network-prp-availability',
    domainCode: 'D13',
    title: {
      fr: 'Disponibilité & Redondance Sans Perte de Paquets PRP d’un Réseau OT',
      en: 'PRP Zero-Loss Redundancy & Availability in Industrial OT Networks',
    },
    problemStatement: {
      fr: 'Calculer la disponibilité annuelle globale et l’indisponibilité attendue d’un réseau opérationnel OT de téléconduite de poste déployé avec le protocole de redondance parallèle PRP (CEI 62439-3) comportant deux réseaux commutés LAN A et LAN B totalement indépendants (MTBF individuel = 80000 heures, MTTR = 8 heures).',
      en: 'Calculate overall annual availability and expected downtime of an industrial OT substation communication network running Parallel Redundancy Protocol (PRP per IEC 62439-3) with two independent LAN A and LAN B backbones (each MTBF = 80,000 h, MTTR = 8 h).',
    },
    primaryStandard: {
      standard: 'IEC 62439-3:2021',
      clause: 'Clause 4 (Parallel Redundancy Protocol - PRP)',
      title: {
        fr: 'Réseaux de communication industriels – Réseaux d’automatisation à haute disponibilité – Partie 3 : Protocoles de redondance sans à-coups (PRP et HSR)',
        en: 'Industrial communication networks – High availability automation networks – Part 3: Seamless redundancy (PRP and HSR)',
      },
      normativeType: 'IEC',
      editionYear: 2021,
    },
    inputs: [
      { symbol: 'MTBF', unit: 'h', value: 80000, description: { fr: 'Temps moyen entre défaillances de chaque réseau LAN', en: 'Mean Time Between Failures for each individual LAN' } },
      { symbol: 'MTTR', unit: 'h', value: 8, description: { fr: 'Temps moyen de réparation / remplacement matériel', en: 'Mean Time To Repair for faulty component' } },
      { symbol: 'T_an', unit: 'h/an', value: 8760, description: { fr: 'Nombre d’heures d’exploitation annuelle', en: 'Annual operating hours' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’indisponibilité individuelle d’un réseau simple (Q_lan)', en: 'Calculate single LAN unavailability (Q_lan)' },
        governingFormula: 'Q_lan = MTTR / (MTBF + MTTR)',
        substitutionAndCalculation: 'Q_lan = 8 h / (80000 h + 8 h) = 8 / 80008 = 0.00009999 = 1.0e-4 (soit A_lan = 99.990%)',
        resultWithUnit: '1.0e-4 (0.01%)',
        explanation: {
          fr: 'Chaque réseau pris individuellement subit environ 52.6 minutes d’arrêt par an.',
          en: 'Each isolated single LAN would experience approximately 52.6 minutes of downtime per year.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de l’indisponibilité combinée du système PRP double LAN (Q_prp)', en: 'Calculate dual-LAN PRP combined system unavailability (Q_prp)' },
        governingFormula: 'Q_prp = Q_lan_A * Q_lan_B',
        substitutionAndCalculation: 'Q_prp = (1.0e-4) * (1.0e-4) = 1.0e-8',
        resultWithUnit: '1.0e-8',
        explanation: {
          fr: 'Le système ne tombe en panne que si les deux réseaux indépendants subissent une panne simultanée.',
          en: 'Communication failure occurs only if both independent networks suffer overlapping simultaneous outages.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Calcul de la disponibilité globale et du temps d’interruption annuel attendu', en: 'Calculate overall availability and expected annual downtime' },
        governingFormula: 'A_prp = 1 - Q_prp ; t_down = Q_prp * 8760 * 3600 s',
        substitutionAndCalculation: 'A_prp = 1 - 1.0e-8 = 0.99999999 (99.999999% - 8 Neufs) => t_down = 1.0e-8 * 31536000 s = 0.315 s/an',
        resultWithUnit: '99.999999% (0.315 s/an)',
        explanation: {
          fr: 'La redondance PRP offre un basculement sans aucune perte de paquet (0 ms) avec une disponibilité industrielle de niveau 8 Neufs.',
          en: 'PRP zero-loss architecture guarantees seamless failover with zero packet loss and 8-Nines carrier-grade availability.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 62439-3 Clause 4 et CEI 62443 : Disponibilité de 99.999999% avec redondance matérielle sans coupure validée pour les téléactions critiques.',
      en: 'Complies with IEC 62439-3 Clause 4 and IEC 62443: 99.999999% availability with zero-loss seamless redundancy verified for critical teleprotection.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. L’indépendance physique stricte des chemins de câbles et des alimentations DC auxiliaires 110V est impérative.',
  },

  // D14: Power Quality & EMC
  {
    id: 'we-d14-power-quality-thd-k-factor',
    domainCode: 'D14',
    title: {
      fr: 'Taux de Distorsion Harmonique (THDu) & Déclassement Facteur K de Transformateur',
      en: 'Voltage Harmonic Distortion (THDv) & Transformer K-Factor Derating',
    },
    problemStatement: {
      fr: 'Sur le jeu de barres TGBT 400 V d’une cimenterie alimentant des broyeurs à variateurs VFD, mesurer la tension efficace fondamentale V1 = 400 V et les harmoniques V5 = 20 V, V7 = 14 V, V11 = 8 V et V13 = 6 V. Calculer le taux de distorsion harmonique global THDu et vérifier la conformité selon IEEE 519.',
      en: 'On a 400 V switchboard busbar at a cement plant supplying VFD drives, fundamental voltage is V1 = 400 V and harmonic voltages are V5 = 20 V, V7 = 14 V, V11 = 8 V, V13 = 6 V. Calculate total voltage harmonic distortion THDv and verify compliance per IEEE 519.',
    },
    primaryStandard: {
      standard: 'IEEE Std 519-2022',
      clause: 'Table 1 (Voltage distortion limits at the Point of Common Coupling)',
      title: {
        fr: 'Norme IEEE pour le contrôle des harmoniques dans les réseaux d’énergie électrique',
        en: 'IEEE Standard for Harmonic Control in Electric Power Systems',
      },
      normativeType: 'IEEE',
      editionYear: 2022,
    },
    inputs: [
      { symbol: 'V_1', unit: 'V', value: 400, description: { fr: 'Tension efficace à la fréquence fondamentale 50 Hz', en: 'Fundamental 50 Hz RMS voltage' } },
      { symbol: 'V_5', unit: 'V', value: 20, description: { fr: 'Tension harmonique de rang 5 (250 Hz)', en: '5th harmonic (250 Hz) voltage component' } },
      { symbol: 'V_7', unit: 'V', value: 14, description: { fr: 'Tension harmonique de rang 7 (350 Hz)', en: '7th harmonic (350 Hz) voltage component' } },
      { symbol: 'V_11', unit: 'V', value: 8, description: { fr: 'Tension harmonique de rang 11 (550 Hz)', en: '11th harmonic (550 Hz) voltage component' } },
      { symbol: 'V_13', unit: 'V', value: 6, description: { fr: 'Tension harmonique de rang 13 (650 Hz)', en: '13th harmonic (650 Hz) voltage component' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la somme quadratique des harmoniques de tension (V_harm)', en: 'Calculate root-sum-square of harmonic voltages (V_harm)' },
        governingFormula: 'V_harm = sqrt(V_5^2 + V_7^2 + V_11^2 + V_13^2)',
        substitutionAndCalculation: 'V_harm = sqrt(20^2 + 14^2 + 8^2 + 6^2) = sqrt(400 + 196 + 64 + 36) = sqrt(696) = 26.38 V',
        resultWithUnit: '26.38 V',
        explanation: {
          fr: 'Tension efficace globale de la pollution harmonique totale présente sur l’onde sinusoïdale.',
          en: 'Total RMS distortion content superimposed on 50 Hz sinusoidal waveform.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul du taux de distorsion harmonique global en tension (THD_u)', en: 'Calculate total harmonic voltage distortion percentage (THD_u)' },
        governingFormula: 'THD_u = (V_harm / V_1) * 100',
        substitutionAndCalculation: 'THD_u = (26.38 V / 400.0 V) * 100 = 6.595%',
        resultWithUnit: '6.60%',
        explanation: {
          fr: 'Le taux THDu atteint 6.60%, ce qui est conforme à la limite générale de 8.0% autorisée par IEEE 519 en basse tension (V <= 1 kV).',
          en: 'THDv reaches 6.60%, which complies with 8.0% general limit permitted by IEEE 519 for LV systems (V <= 1 kV).',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Vérification de la composante individuelle maximale de rang 5', en: 'Verify maximum individual 5th harmonic component' },
        governingFormula: 'V_5_percent = (V_5 / V_1) * 100',
        substitutionAndCalculation: 'V_5_percent = (20.0 V / 400.0 V) * 100 = 5.00%',
        resultWithUnit: '5.00% (limite <= 5.0%)',
        explanation: {
          fr: 'La composante de rang 5 est exactement à la limite admissible individuelle de 5.0%. Un filtre passif anti-harmonique 5 ou un filtre actif shunt est préconisé.',
          en: 'Individual 5th harmonic component is at the 5.0% threshold. A passive detuned filter or active shunt filter is recommended.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme IEEE 519-2022 : THDu = 6.60% <= 8.0%. Tension harmonique individuelle rang 5 = 5.0% <= 5.0%. Facteur de déclassement K-4 recommandé pour le transformateur amont.',
      en: 'Complies with IEEE 519-2022: THDv = 6.60% <= 8.0%. Individual 5th harmonic = 5.0% <= 5.0%. K-factor K-4 derating recommended for upstream transformer.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Les charges polluantes industrielles requièrent des batteries de condensateurs avec selfs de désaccordage 7% (CEI 61642).',
  },

  // D15: Metering, Smart Grids & Grid Digitalization
  {
    id: 'we-d15-smart-metering-metrology',
    domainCode: 'D15',
    title: {
      fr: 'Précision Métrologique & Erreur Maximale Admissible d’un Compteur Intelligent AMI',
      en: 'AMI Smart Meter Metrology Accuracy Class & Maximum Permissible Error',
    },
    problemStatement: {
      fr: 'Vérifier la conformité métrologique d’un compteur d’énergie intelligent triphasé de classe 0.2S installé sur le départ 30 kV d’Oyomabang, sous un courant de charge secondaire TC de I = 5 A et un facteur de puissance cosφ = 0.50 inductif. L’énergie active mesurée est de 1254.2 kWh pour une référence étalon certifiée de 1252.8 kWh.',
      en: 'Verify metrological compliance of an IEC Class 0.2S three-phase smart grid meter installed on 30 kV Oyomabang feeder under secondary CT current I = 5 A and power factor cosφ = 0.50 inductive. Measured active energy is 1254.2 kWh against certified standard of 1252.8 kWh.',
    },
    primaryStandard: {
      standard: 'IEC 62053-22:2020',
      clause: 'Table 3 (Percentage error limits for Class 0.2S meters)',
      title: {
        fr: 'Équipements de comptage de l’électricité – Partie 22 : Compteurs statiques d’énergie active pour courant alternatif (classes 0,1S, 0,2S et 0,5S)',
        en: 'Electricity metering equipment – Part 22: Static meters for AC active energy (classes 0,1S, 0,2S and 0,5S)',
      },
      normativeType: 'IEC',
      editionYear: 2020,
    },
    inputs: [
      { symbol: 'E_mesure', unit: 'kWh', value: 1254.2, description: { fr: 'Énergie active enregistrée par le compteur testé', en: 'Active energy registered by meter under test' } },
      { symbol: 'E_etalon', unit: 'kWh', value: 1252.8, description: { fr: 'Énergie active de référence certifiée par banc étalon', en: 'Certified reference standard bench active energy' } },
      { symbol: 'I_n', unit: 'A', value: 5, description: { fr: 'Courant nominal secondaire des transformateurs de courant', en: 'Rated secondary current of current transformers' } },
      { symbol: 'cos_phi', unit: 'sans unité', value: 0.5, description: { fr: 'Facteur de puissance inductif lors de l’essai', en: 'Operating inductive power factor during test' } },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’écart d’énergie absolu (Delta E)', en: 'Calculate absolute active energy difference (Delta E)' },
        governingFormula: 'Delta_E = E_mesure - E_etalon',
        substitutionAndCalculation: 'Delta_E = 1254.2 kWh - 1252.8 kWh = +1.40 kWh',
        resultWithUnit: '+1.40 kWh',
        explanation: {
          fr: 'Différence absolue positive indiquant une légère surestimation de l’énergie consommée.',
          en: 'Positive absolute difference showing a slight over-registration of energy.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de l’erreur relative en pourcentage (epsilon)', en: 'Calculate percentage relative error (epsilon)' },
        governingFormula: 'epsilon = (Delta_E / E_etalon) * 100',
        substitutionAndCalculation: 'epsilon = (+1.40 kWh / 1252.8 kWh) * 100 = +0.1117%',
        resultWithUnit: '+0.11%',
        explanation: {
          fr: 'Erreur relative de mesure du compteur statique communicant à pleine charge nominale sous cosφ = 0.50.',
          en: 'Relative measurement error of static smart meter at rated secondary current under cosφ = 0.50.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Comparaison à l’Erreur Maximale Admissible (MPE) selon CEI 62053-22', en: 'Compare against Maximum Permissible Error (MPE) per IEC 62053-22' },
        governingFormula: '|epsilon| <= MPE_table_3',
        substitutionAndCalculation: 'Pour Classe 0.2S à In et cosφ = 0.50 ind : MPE = ± 0.30% => |+0.11%| <= 0.30%',
        resultWithUnit: '|+0.11%| <= 0.30%',
        explanation: {
          fr: 'L’erreur (+0.11%) se situe bien en deçà de la limite stricte de ± 0.30% imposée pour la classe 0.2S à faible facteur de puissance.',
          en: 'Error (+0.11%) falls well within the strict ± 0.30% tolerance window mandated for Class 0.2S at low power factor.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 62053-22 Classe 0.2S : Erreur relative de +0.11% <= ± 0.30%. Compteur intelligent AMI homologué pour la facturation d’échange réseau haute précision.',
      en: 'Complies with IEC 62053-22 Class 0.2S: +0.11% relative error <= ± 0.30%. AMI smart meter certified for high-precision commercial grid billing.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. La précision globale de la chaîne de mesure dépend également de la classe des TC et TP (CEI 61869-2/3).',
  },

  // D16: Electrical Safety, Earthing & Lightning
  {
    id: 'we-d16-touch-voltage-tt',
    domainCode: 'D16',
    title: {
      fr: 'Vérification de la Tension de Contact en Régime TT et Calibrage de la Prise de Terre',
      en: 'TT Earthing Touch Voltage Verification & Earth Resistance Sizing',
    },
    problemStatement: {
      fr: 'Sur une installation tertiaire à Yaoundé raccordée au réseau BT Eneo sous régime de neutre TT, le disjoncteur général de branchement est équipé d’une protection différentielle de sensibilité I_Δn = 500 mA. Calculer la résistance maximale admissible de la prise de terre des masses (R_A) pour garantir que la tension de contact ne dépasse jamais la tension limite de sécurité UL = 50 V.',
      en: 'On a commercial facility in Yaoundé connected to Eneo LV grid under TT earthing, the service breaker features a residual current device of sensitivity I_Δn = 500 mA. Calculate maximum allowable earth electrode resistance (R_A) ensuring touch voltage never exceeds safety limit UL = 50 V.',
    },
    primaryStandard: {
      standard: 'IEC 60364-4-41:2017',
      clause: 'Clause 411.5.3 (TT system disconnection conditions)',
      title: {
        fr: 'Installations électriques à basse tension – Protection pour assurer la sécurité – Protection contre les chocs électriques',
        en: 'Low-voltage electrical installations – Protection for safety – Protection against electric shock',
      },
      normativeType: 'IEC',
      editionYear: 2017,
    },
    inputs: [
      {
        symbol: 'U_L',
        unit: 'V',
        value: 50,
        description: { fr: 'Tension limite conventionnelle de sécurité en locaux secs', en: 'Conventional touch voltage limit in dry premises' },
      },
      {
        symbol: 'I_delta_n',
        unit: 'A',
        value: 0.5,
        description: { fr: 'Sensibilité du disjoncteur différentiel de tête (500 mA)', en: 'Rated residual operating current of main RCD' },
      },
      {
        symbol: 'R_measured',
        unit: 'Ω',
        value: 28,
        description: { fr: 'Résistance mesurée sur site au telluromètre', en: 'Site earth resistance measured by earth tester' },
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de la résistance de terre maximale admissible (R_A_max)', en: 'Calculate maximum allowable earth resistance (R_A_max)' },
        governingFormula: 'R_A_max = U_L / I_delta_n',
        substitutionAndCalculation: 'R_A_max = 50 V / 0.500 A = 100.0 Ω',
        resultWithUnit: '100.0 Ω',
        explanation: {
          fr: 'En schéma TT, la carcasse métallique d’un appareil en défaut d’isolement ne doit pas dépasser 50 V avant le déclenchement du DDR.',
          en: 'In TT systems, metal enclosures of faulty equipment must not exceed 50 V before the RCD automatically trips.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul de la tension de contact réelle pour la prise de terre mesurée (28 Ω)', en: 'Calculate prospective touch voltage for site electrode (28 Ω)' },
        governingFormula: 'U_c = R_measured * I_delta_n',
        substitutionAndCalculation: 'U_c = 28.0 Ω * 0.500 A = 14.0 V',
        resultWithUnit: '14.0 V',
        explanation: {
          fr: 'La tension de contact maximale qui apparaîtra en cas de défaut franc d’isolement est de 14.0 V, ce qui est très inférieur à la tension dangereuse.',
          en: 'Peak prospective touch voltage during insulation fault is 14.0 V, far below hazardous physiological thresholds.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Protection complémentaire 30 mA pour circuits prises (Clause 411.3.3)', en: '30 mA additional protection for socket circuits (Clause 411.3.3)' },
        governingFormula: 'U_c_30mA = R_measured * 0.030 A',
        substitutionAndCalculation: 'U_c_30mA = 28 Ω * 0.030 A = 0.84 V ; Seuil de déclenchement ultra-rapide < 40 ms',
        resultWithUnit: '0.84 V (< 40 ms)',
        explanation: {
          fr: 'Les départs prises terminaux protégés par DDR 30 mA éliminent le défaut en moins de 40 ms avec une tension de contact quasi-nulle (0.84 V).',
          en: 'Final socket outlets protected by 30 mA RCDs trip in less than 40 ms at near-zero touch voltage (0.84 V).',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60364-4-41 et NF C 15-100 : Résistance de terre mesurée (28 Ω) <= 100 Ω. Sécurité des personnes garantie.',
      en: 'Complies with IEC 60364-4-41 and NF C 15-100: Measured earth resistance (28 Ω) <= 100 Ω. Personnel safety verified.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. La résistance de terre doit être mesurée annuellement en saison sèche.',
  },
];

console.log('Writing updated workedExamplesRegistry.ts with all 16 domains...');
const targetPath = path.join(process.cwd(), 'src', 'data', 'workedExamplesRegistry.ts');

const fileHeader = `// src/data/workedExamplesRegistry.ts
// EPEDE 2.0 Authoritative Worked Examples Registry (Task T-302 / Option 1 Rollout)
// Comprehensive 16-Domain coverage (D01 to D16) strictly tethered to IEC, IEEE, and NF C standards.
// Features step-by-step arithmetic, physical units, and didactic boundaries.

import { WorkedExample, WorkedExampleSchema } from '../types/contentSchemas';

const RAW_WORKED_EXAMPLES: WorkedExample[] = `;

const fileFooter = `;

// Validate all 16 worked examples through Zod schema
export const WORKED_EXAMPLES_REGISTRY: WorkedExample[] = RAW_WORKED_EXAMPLES.map((example) => {
  const result = WorkedExampleSchema.safeParse(example);
  if (!result.success) {
    throw new Error(
      \`Worked example validation failed for \${example.id}: \${JSON.stringify(result.error.issues)}\`
    );
  }
  return result.data;
});

// Helper lookup functions
export function getWorkedExampleById(id: string): WorkedExample | undefined {
  return WORKED_EXAMPLES_REGISTRY.find((we) => we.id === id);
}

export function getWorkedExamplesForDomain(domainCode: string): WorkedExample[] {
  return WORKED_EXAMPLES_REGISTRY.filter((we) => we.domainCode === domainCode);
}
`;

const fileContent = fileHeader + JSON.stringify(ALL_16_WORKED_EXAMPLES, null, 2) + fileFooter;
fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log('✅ Wrote all 16 worked examples successfully!');

