// src/data/normativeFormulaRegistry.ts
// EPEDE 2.0 Normative Formula Registry (Task T-205)
// Every formula is tethered to an explicit normative standard, clause, validity limits, and parameter definitions.

export interface FormulaParameter {
  symbol: string;
  name: { fr: string; en: string };
  unit: string;
  description: { fr: string; en: string };
}

export interface NormativeFormula {
  id: string;
  domainCode: string;
  title: { fr: string; en: string };
  governingStandard: string;
  clause: string;
  latex: string;
  parameters: FormulaParameter[];
  validityDomain: { fr: string; en: string };
  illustrativeWorkedExample?: string;
}

export const NORMATIVE_FORMULA_REGISTRY: NormativeFormula[] = [
  {
    id: 'form-power-three-phase',
    domainCode: 'D01',
    title: {
      fr: 'Puissance Active Triphasée Équilibrée',
      en: 'Balanced Three-Phase Active Power',
    },
    governingStandard: 'IEC 60038 / IEC 60034-1',
    clause: 'Clause 6.2',
    latex: 'P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi',
    parameters: [
      {
        symbol: 'P',
        name: { fr: 'Puissance active', en: 'Active power' },
        unit: 'W (ou kW, MW)',
        description: { fr: 'Puissance utile transformée en travail mécanique ou thermique', en: 'Useful power converted into mechanical or thermal work' },
      },
      {
        symbol: 'U',
        name: { fr: 'Tension composée entre phases', en: 'Line-to-line voltage' },
        unit: 'V (ou kV)',
        description: { fr: 'Tension efficace entre deux conducteurs de phase', en: 'RMS voltage measured between any two phase conductors' },
      },
      {
        symbol: 'I',
        name: { fr: 'Courant de ligne', en: 'Line current' },
        unit: 'A (ou kA)',
        description: { fr: 'Courant efficace traversant chaque conducteur de phase', en: 'RMS current flowing through each phase line' },
      },
      {
        symbol: '\\cos\\varphi',
        name: { fr: 'Facteur de puissance', en: 'Power factor' },
        unit: 'Sans unité [0 à 1]',
        description: { fr: 'Cosinus du déphasage entre tension et courant fondamental', en: 'Cosine of phase angle between fundamental voltage and current' },
      },
    ],
    validityDomain: {
      fr: 'Régime sinusoïdal triphasé équilibré (50 Hz / 60 Hz). En présence d’harmoniques sévères (THD-I > 10%), appliquer la définition de la norme IEEE 1459.',
      en: 'Balanced sinusoidal three-phase systems (50 Hz / 60 Hz). For high harmonic distortion (THD-I > 10%), apply IEEE 1459 power definitions.',
    },
  },
  {
    id: 'form-joule-losses',
    domainCode: 'D03',
    title: {
      fr: 'Pertes par Effet Joule dans une Ligne Triphasée',
      en: 'Joule (I²R) Heat Losses in Three-Phase Line',
    },
    governingStandard: 'IEC 60287-1-1 / Cigré TB 601',
    clause: 'Clause 2.1',
    latex: 'P_{\\text{loss}} = 3 \\cdot R \\cdot I^2',
    parameters: [
      {
        symbol: 'P_{\\text{loss}}',
        name: { fr: 'Pertes thermiques Joule totales', en: 'Total Joule heat loss' },
        unit: 'W (ou kW, MW)',
        description: { fr: 'Puissance dissipée sous forme de chaleur sur les trois conducteurs', en: 'Thermal power dissipated as heat across all three phase conductors' },
      },
      {
        symbol: 'R',
        name: { fr: 'Résistance linéique par phase', en: 'Single-phase line resistance' },
        unit: 'Ω',
        description: { fr: 'Résistance électrique d’un conducteur à la température de service', en: 'Electrical resistance of one conductor at operating temperature' },
      },
      {
        symbol: 'I',
        name: { fr: 'Courant efficace de phase', en: 'Phase RMS current' },
        unit: 'A',
        description: { fr: 'Courant de transit dans chaque phase', en: 'Transit current in each phase' },
      },
    ],
    validityDomain: {
      fr: 'Conducteurs homogènes à température constante. L’élévation de tension d’un facteur k divise les pertes par k² pour une puissance transportée constante.',
      en: 'Homogeneous conductors at steady-state temperature. Elevating voltage by factor k reduces losses by k² for constant transferred power.',
    },
  },
  {
    id: 'form-iec60909-ik3',
    domainCode: 'D04',
    title: {
      fr: 'Courant de Court-Circuit Triphasé Initial Symétrique',
      en: 'Initial Symmetrical Three-Phase Short-Circuit Current',
    },
    governingStandard: 'IEC 60909-0:2016',
    clause: 'Clause 4.2.1 (Equation 11)',
    latex: 'I_{k3}^{\\prime\\prime} = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot |Z_k|}',
    parameters: [
      {
        symbol: 'I_{k3}^{\\prime\\prime}',
        name: { fr: 'Courant de court-circuit sous-transitoire', en: 'Subtransient short-circuit current' },
        unit: 'kA',
        description: { fr: 'Valeur efficace de la composante alternative symétrique au premier instant du défaut', en: 'RMS value of symmetrical AC component at fault inception' },
      },
      {
        symbol: 'c',
        name: { fr: 'Facteur de tension', en: 'Voltage factor' },
        unit: 'Sans unité',
        description: { fr: 'c_max = 1.05 (BT) ou 1.10 (HTA/HTB) selon tableau 1 de la CEI 60909-0', en: 'c_max = 1.05 (LV) or 1.10 (MV/HV) per IEC 60909-0 Table 1' },
      },
      {
        symbol: 'U_n',
        name: { fr: 'Tension nominale du réseau', en: 'Nominal system voltage' },
        unit: 'kV',
        description: { fr: 'Tension nominale composée entre phases', en: 'Nominal line-to-line RMS system voltage' },
      },
      {
        symbol: 'Z_k',
        name: { fr: 'Impédance de court-circuit équivalente', en: 'Equivalent short-circuit impedance' },
        unit: 'Ω',
        description: { fr: 'Module de l’impédance directe au point de défaut (R_k + j X_k)', en: 'Magnitude of positive-sequence impedance at fault location' },
      },
    ],
    validityDomain: {
      fr: 'Réseaux triphasés 50 Hz ou 60 Hz sans déformation harmonique majeure. Méthode standard internationale pour le dimensionnement du pouvoir de coupure (Icu/Ics).',
      en: '50 Hz or 60 Hz three-phase networks without severe harmonic distortion. Worldwide standard method for circuit breaker breaking capacity sizing.',
    },
  },
  {
    id: 'form-trafo-rated-current',
    domainCode: 'D04',
    title: {
      fr: 'Courant Nominal d’un Transformateur Triphasé',
      en: 'Rated Current of Three-Phase Transformer',
    },
    governingStandard: 'IEC 60076-1',
    clause: 'Clause 4.1',
    latex: 'I_n = \\frac{S_n}{\\sqrt{3} \\cdot U_n}',
    parameters: [
      {
        symbol: 'I_n',
        name: { fr: 'Courant nominal', en: 'Rated current' },
        unit: 'A',
        description: { fr: 'Courant admissible permanent au primaire ou au secondaire', en: 'Continuous allowable current on primary or secondary' },
      },
      {
        symbol: 'S_n',
        name: { fr: 'Puissance apparente assignée', en: 'Rated apparent power' },
        unit: 'kVA (ou MVA)',
        description: { fr: 'Capacité de transit continue du transformateur selon son mode de refroidissement (ONAN/ONAF)', en: 'Continuous power rating per cooling mode (ONAN/ONAF)' },
      },
      {
        symbol: 'U_n',
        name: { fr: 'Tension nominale assignée de l’enroulement', en: 'Rated winding voltage' },
        unit: 'kV',
        description: { fr: 'Tension nominale entre phases de l’enroulement considéré', en: 'Nominal line-to-line voltage of considered winding' },
      },
    ],
    validityDomain: {
      fr: 'Régime permanent à fréquence nominale et température ambiante standard (40°C max selon CEI 60076-2).',
      en: 'Continuous steady-state operation at rated frequency and standard ambient temperature (40°C max per IEC 60076-2).',
    },
  },
  {
    id: 'form-cable-volt-drop',
    domainCode: 'D06',
    title: {
      fr: 'Chute de Tension dans une Liaison Triphasée',
      en: 'Voltage Drop in Three-Phase Cable Feeder',
    },
    governingStandard: 'NF C 15-100 / IEC 60364-5-52',
    clause: 'Annexe G / Clause 525',
    latex: '\\Delta U = \\sqrt{3} \\cdot I \\cdot L \\cdot (R^{\\prime} \\cos\\varphi + X^{\\prime} \\sin\\varphi)',
    parameters: [
      {
        symbol: '\\Delta U',
        name: { fr: 'Chute de tension absolue', en: 'Absolute voltage drop' },
        unit: 'V',
        description: { fr: 'Différence de potentiel entre l’origine et l’extrémité de la canalisation', en: 'Potential difference between feeder origin and load terminal' },
      },
      {
        symbol: 'L',
        name: { fr: 'Longueur de la canalisation', en: 'Feeder route length' },
        unit: 'km',
        description: { fr: 'Distance physique du parcours des conducteurs', en: 'Physical distance of conductor route' },
      },
      {
        symbol: 'R^{\\prime}',
        name: { fr: 'Résistance linéique du conducteur', en: 'Linear resistance of conductor' },
        unit: 'Ω/km',
        description: { fr: 'Résistance à température de service (70°C pour PVC, 90°C pour PR/XLPE)', en: 'Resistance at operating temperature (70°C PVC, 90°C XLPE)' },
      },
      {
        symbol: 'X^{\\prime}',
        name: { fr: 'Réactance linéique du câble', en: 'Linear cable reactance' },
        unit: 'Ω/km',
        description: { fr: 'Réactance inductive (typiquement 0.08 Ω/km pour câbles BT)', en: 'Inductive reactance (typically 0.08 Ω/km for LV cables)' },
      },
    ],
    validityDomain: {
      fr: 'Circuits BT triphasés équilibrés. La chute relative ΔU/Un ne doit pas dépasser 3% pour l’éclairage et 5% pour la force motrice (NF C 15-100).',
      en: 'Balanced LV three-phase circuits. Relative drop ΔU/Un must not exceed 3% for lighting and 5% for motor loads (NF C 15-100).',
    },
  },
  {
    id: 'form-motor-sync-speed',
    domainCode: 'D07',
    title: {
      fr: 'Vitesse de Synchronisme du Champ Tournant',
      en: 'Synchronous Speed of Rotating Magnetic Field',
    },
    governingStandard: 'IEC 60034-1',
    clause: 'Clause 5.3',
    latex: 'n_s = \\frac{60 \\cdot f}{p}',
    parameters: [
      {
        symbol: 'n_s',
        name: { fr: 'Vitesse de synchronisme', en: 'Synchronous speed' },
        unit: 'tr/min (rpm)',
        description: { fr: 'Vitesse de rotation du champ magnétique créé par les enroulements statoriques', en: 'Rotational speed of stator magnetic field' },
      },
      {
        symbol: 'f',
        name: { fr: 'Fréquence du réseau', en: 'Grid frequency' },
        unit: 'Hz',
        description: { fr: '50 Hz au Cameroun et en Europe (60 Hz en Amérique du Nord)', en: '50 Hz in Cameroon/Europe (60 Hz in North America)' },
      },
      {
        symbol: 'p',
        name: { fr: 'Nombre de paires de pôles', en: 'Number of pole pairs' },
        unit: 'Entier (1, 2, 3, 4...)',
        description: { fr: 'Pour p=1 (2 pôles) ns=3000 tr/min ; pour p=2 (4 pôles) ns=1500 tr/min à 50 Hz', en: 'For p=1 (2 poles) ns=3000 rpm; for p=2 (4 poles) ns=1500 rpm at 50 Hz' },
      },
    ],
    validityDomain: {
      fr: 'Moteurs synchrones et asynchrones triphasés. La vitesse réelle du rotor d’un moteur asynchrone est nr = ns · (1 - s) avec glissement s ∈ [1% à 6%].',
      en: 'Synchronous and induction three-phase motors. Actual rotor speed for induction motors is nr = ns · (1 - s) with slip s ∈ [1% to 6%].',
    },
  },
  {
    id: 'form-earthing-touch-voltage',
    domainCode: 'D16',
    title: {
      fr: 'Tension de Contact Présumée en Schéma TT',
      en: 'Prospective Touch Voltage in TT Earthing System',
    },
    governingStandard: 'IEC 60364-4-41',
    clause: 'Clause 411.5.3',
    latex: 'U_c = R_A \\cdot I_{\\Delta n} \\le U_L',
    parameters: [
      {
        symbol: 'U_c',
        name: { fr: 'Tension de contact présumée', en: 'Prospective touch voltage' },
        unit: 'V',
        description: { fr: 'Tension apparaissant sur une carcasse métallique en défaut d’isolement', en: 'Voltage appearing on metal enclosure during insulation fault' },
      },
      {
        symbol: 'R_A',
        name: { fr: 'Résistance de la prise de terre des masses', en: 'Exposed-conductive-part earth resistance' },
        unit: 'Ω',
        description: { fr: 'Résistance de terre locale mesurée au telluromètre (ex: max 100 Ω pour DDR 500 mA)', en: 'Local earth electrode resistance (e.g. max 100 Ω for 500 mA RCD)' },
      },
      {
        symbol: 'I_{\\Delta n}',
        name: { fr: 'Courant différentiel résiduel assigné', en: 'Rated residual operating current' },
        unit: 'A (ou mA)',
        description: { fr: 'Sensibilité du dispositif différentiel (30 mA pour personnes, 300/500 mA pour branchement)', en: 'RCD tripping sensitivity (30 mA for personnel, 300/500 mA main)' },
      },
      {
        symbol: 'U_L',
        name: { fr: 'Tension limite conventionnelle de sécurité', en: 'Conventional safety limit voltage' },
        unit: 'V',
        description: { fr: '50 V AC en locaux secs (25 V AC en locaux humides ou chantiers)', en: '50 V AC in dry environments (25 V AC in wet locations)' },
      },
    ],
    validityDomain: {
      fr: 'Régime de neutre TT selon CEI 60364-4-41. Coupure automatique obligatoire au premier défaut d’isolement par DDR.',
      en: 'TT earthing scheme per IEC 60364-4-41. Mandatory automatic disconnection on first fault via RCD.',
    },
  },
];

