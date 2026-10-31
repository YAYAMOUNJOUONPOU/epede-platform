// src/data/workedExamplesRegistry.ts
// EPEDE 2.0 Authoritative Worked Examples Registry (Task T-302)
// Strictly tethered to IEC, IEEE, and NF C standards. Step-by-step arithmetic and didactic boundary proof.

import { WorkedExample, WorkedExampleSchema } from '../types/contentSchemas';

const RAW_WORKED_EXAMPLES: WorkedExample[] = [
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
        substitutionAndCalculation: 'I_n = 66,667 kVA / (sqrt(3) * 15.5 kV) = 66,667 / 26.847 = 2,483.2 A',
        resultWithUnit: '2,483 A',
        explanation: {
          fr: 'Le jeu de barres sous enveloppe et les traversées statoriques de l’alternateur doivent être calibrés pour au moins 2500 A permanent.',
          en: 'Isolated phase busducts and stator terminal bushings must be rated for at least 2500 A continuous.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Puissance réactive disponible pour le réglage de tension (Q_n)', en: 'Reactive power available for AVR voltage control (Q_n)' },
        governingFormula: 'Q_n = S_n * sin(phi) = S_n * sqrt(1 - cos^2(phi))',
        substitutionAndCalculation: 'sin(phi) = sqrt(1 - 0.90^2) = 0.4359 => Q_n = 66.67 * 0.4359 = 29.06 MVAR',
        resultWithUnit: '29.06 MVAR',
        explanation: {
          fr: 'Le régulateur de tension (AVR) dispose d’une marge dynamique de ±29 MVAR pour soutenir la tension du réseau 225 kV de Yaoundé.',
          en: 'The excitation AVR provides a dynamic reserve of ±29 MVAR to support grid bus voltage on the Yaoundé 225 kV ring.',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60034-1 classe d’échauffement F/B. Courant statorique de service : 2483 A à 15.5 kV sous cosφ = 0.90.',
      en: 'Complies with IEC 60034-1 insulation class F/B. Operating continuous current: 2483 A at 15.5 kV, cosφ = 0.90.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Tout dimensionnement réel nécessite une étude thermique rotor/stator certifiée.',
  },
  {
    id: 'we-d04-short-circuit-iec60909',
    domainCode: 'D04',
    title: {
      fr: 'Calcul du Courant de Court-Circuit Triphasé selon CEI 60909-0',
      en: 'Three-Phase Short-Circuit Current Calculation per IEC 60909-0',
    },
    problemStatement: {
      fr: 'Déterminer le courant de court-circuit symétrique initial (Ik3") au jeu de barres 225 kV du poste de Bekoko (Douala), alimenté par le réseau SONATREL avec une puissance de court-circuit amont Sk" = 3000 MVA.',
      en: 'Determine initial symmetrical short-circuit current (Ik3") at the 225 kV busbar of Bekoko substation (Douala), fed by SONATREL transmission grid with upstream Sk" = 3000 MVA.',
    },
    primaryStandard: {
      standard: 'IEC 60909-0:2016',
      clause: 'Clause 4.2.1 (Equation 11)',
      title: {
        fr: 'Courants de court-circuit dans les réseaux triphasés à courant alternatif – Partie 0 : Calcul des courants',
        en: 'Short-circuit currents in three-phase a.c. systems – Part 0: Calculation of currents',
      },
      normativeType: 'IEC',
      editionYear: 2016,
    },
    inputs: [
      {
        symbol: 'S_k_prime',
        unit: 'MVA',
        value: 3000,
        description: { fr: 'Puissance de court-circuit amont du réseau', en: 'Upstream grid short-circuit power' },
      },
      {
        symbol: 'U_n',
        unit: 'kV',
        value: 225,
        description: { fr: 'Tension nominale du jeu de barres', en: 'Nominal busbar voltage' },
      },
      {
        symbol: 'c_factor',
        unit: 'sans unité',
        value: 1.1,
        description: { fr: 'Facteur de tension c_max selon Tableau 1 CEI 60909-0', en: 'Voltage factor c_max per Table 1 IEC 60909-0' },
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { fr: 'Calcul de l’impédance de court-circuit équivalente du réseau (Z_k)', en: 'Calculate equivalent grid short-circuit impedance (Z_k)' },
        governingFormula: 'Z_k = (c * U_n^2) / S_k_prime',
        substitutionAndCalculation: 'Z_k = (1.10 * 225^2) / 3000 = (1.10 * 50625) / 3000 = 55687.5 / 3000 = 18.56 Ω',
        resultWithUnit: '18.56 Ω',
        explanation: {
          fr: 'En haute tension (225 kV), la résistance de ligne est négligeable devant la réactance (R/X < 0.1), donc Z_k ≈ X_k = 18.56 Ω.',
          en: 'At high voltage (225 kV), resistance is negligible compared to reactance (R/X < 0.1), thus Z_k ≈ X_k = 18.56 Ω.',
        },
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul du courant de court-circuit sous-transitoire (I_k3_prime)', en: 'Calculate subtransient short-circuit current (I_k3_prime)' },
        governingFormula: 'I_k3_prime = (c * U_n) / (sqrt(3) * Z_k)',
        substitutionAndCalculation: 'I_k3_prime = (1.10 * 225 kV) / (1.732 * 18.56 Ω) = 247.5 / 32.147 = 7.70 kA',
        resultWithUnit: '7.70 kA',
        explanation: {
          fr: 'Courant de court-circuit triphasé symétrique franc au premier instant du défaut sur le jeu de barres 225 kV.',
          en: 'Bolted three-phase symmetrical fault current at fault inception on the 225 kV busbar.',
        },
      },
      {
        stepNumber: 3,
        title: { fr: 'Vérification du pouvoir de coupure des disjoncteurs SF6 (I_cu)', en: 'Verify SF6 circuit breaker breaking capacity (I_cu)' },
        governingFormula: 'I_cu >= I_k3_prime',
        substitutionAndCalculation: 'I_cu assigné standard SONATREL = 31.5 kA ou 40 kA. Ratio de marge : 31.5 kA / 7.7 kA = 4.09x',
        resultWithUnit: '31.5 kA (Marge: 409%)',
        explanation: {
          fr: 'Le pouvoir de coupure des disjoncteurs 225 kV de Bekoko (31.5 kA) est largement supérieur au défaut calculé (7.70 kA).',
          en: 'Standard 225 kV substation breaker rating (31.5 kA) comfortably clears prospective fault current (7.70 kA).',
        },
      },
    ],
    finalVerification: {
      fr: 'Conforme CEI 60909-0:2016 et CEI 62271-100. Disjoncteur SF6 225 kV 31.5 kA garanti pour coupure sans dépassement thermique.',
      en: 'Complies with IEC 60909-0:2016 and IEC 62271-100. 225 kV 31.5 kA breaker clears fault safely within thermal limits.',
    },
    didacticNotice: 'Exemple Didactique Résolu — Illustratif. Les calculs de réseaux réels requièrent la matrice d’admittance complète.',
  },
  {
    id: 'we-d06-cable-voltage-drop',
    domainCode: 'D06',
    title: {
      fr: 'Dimensionnement d’un Câble Basse Tension et Vérification de la Chute de Tension (NF C 15-100)',
      en: 'LV Cable Sizing and Voltage Drop Verification (NF C 15-100 / IEC 60364)',
    },
    problemStatement: {
      fr: 'Une usine agroalimentaire à Douala alimente un compresseur frigorifique triphasé (I = 160 A, cosφ = 0.85, 400 V) situé à 110 mètres du TGBT via un câble cuivre multiconducteur XLPE enterré sous fourreau. Vérifier si une section de 70 mm² respecte la limite de chute de tension admissible de 5%.',
      en: 'A food plant in Douala powers a three-phase refrigeration compressor (I = 160 A, cosφ = 0.85, 400 V) located 110 m from main switchboard via buried copper XLPE cable in conduit. Verify if 70 mm² conductor meets the 5% max voltage drop limit.',
    },
    primaryStandard: {
      standard: 'NF C 15-100 / IEC 60364-5-52',
      clause: 'Partie 5-52, Annexe G & Tableau 52G',
      title: {
        fr: 'Installations électriques à basse tension – Choix et mise en œuvre des canalisations',
        en: 'Low-voltage electrical installations – Selection and erection of wiring systems',
      },
      normativeType: 'NF_C',
      editionYear: 2008,
    },
    inputs: [
      {
        symbol: 'I_b',
        unit: 'A',
        value: 160,
        description: { fr: 'Courant d’emploi du compresseur', en: 'Design operating load current' },
      },
      {
        symbol: 'L',
        unit: 'm',
        value: 110,
        description: { fr: 'Longueur de la liaison entre TGBT et récepteur', en: 'Feeder run distance from TGBT to load' },
      },
      {
        symbol: 'cos_phi',
        unit: 'sans unité',
        value: 0.85,
        description: { fr: 'Facteur de puissance en régime nominal', en: 'Operating power factor' },
      },
      {
        symbol: 'S_cu',
        unit: 'mm²',
        value: 70,
        description: { fr: 'Section nominale des conducteurs en cuivre', en: 'Copper cross-sectional area' },
      },
      {
        symbol: 'U_n',
        unit: 'V',
        value: 400,
        description: { fr: 'Tension assignée entre phases', en: 'Nominal line-to-line voltage' },
      },
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

// Validate through Zod schema
export const WORKED_EXAMPLES_REGISTRY: WorkedExample[] = RAW_WORKED_EXAMPLES.map((example) => {
  const result = WorkedExampleSchema.safeParse(example);
  if (!result.success) {
    throw new Error(
      `Worked example validation failed for ${example.id}: ${JSON.stringify(result.error.issues)}`
    );
  }
  return result.data;
});

