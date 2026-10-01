// src/components/domain/modules/domainWorkbenchData.ts
import type { DomainCode } from '../../../types/epede';

export interface ArchitectureStage {
  tag: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  parameter: string;
  nominalValue: string;
}

export interface EquipmentWorkbenchItem {
  tag: string;
  nameFr: string;
  nameEn: string;
  category: string;
  standard: string;
  roleFr: string;
  roleEn: string;
  workingPrincipleFr: string;
  workingPrincipleEn: string;
  componentsFr: string[];
  componentsEn: string[];
  ratings: { labelFr: string; labelEn: string; value: string; unit: string }[];
  failureModesFr: string;
  failureModesEn: string;
  epedeEquipmentId?: string;
}

export interface ProtectionWorkbenchItem {
  ansiCode: string;
  nameFr: string;
  nameEn: string;
  standard: string;
  principleFr: string;
  principleEn: string;
  typicalSetting: string;
}

export interface FaultSequenceStep {
  time: string;
  eventFr: string;
  eventEn: string;
  detailFr: string;
  detailEn: string;
}

export interface MonitoredParamItem {
  nameFr: string;
  nameEn: string;
  sensorFr: string;
  sensorEn: string;
  rate: string;
  protocol: string;
}

export interface ControlLevelItem {
  level: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  response: string;
}

export interface EngineeringInteractionItem {
  roleFromFr: string;
  roleFromEn: string;
  roleToFr: string;
  roleToEn: string;
  phase: string;
  dataExchangedFr: string;
  dataExchangedEn: string;
  decisionFr: string;
  decisionEn: string;
  impactFr: string;
  impactEn: string;
}

export interface InteractiveDemo {
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  paramName: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  calculate: (val: number) => {
    labelFr: string;
    labelEn: string;
    value: string;
    unit: string;
    statusFr: string;
    statusEn: string;
  }[];
}

export interface DomainWorkbenchProfile {
  domainCode: DomainCode;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  voltageRange: string;
  primaryStandard: string;
  inputsFr: string;
  inputsEn: string;
  coreTransformFr: string;
  coreTransformEn: string;
  outputsFr: string;
  outputsEn: string;
  faultClearingTime: string;
  architectureStages: ArchitectureStage[];
  interactiveDemo?: InteractiveDemo;
  equipmentList: EquipmentWorkbenchItem[];
  protections: ProtectionWorkbenchItem[];
  faultSequence: FaultSequenceStep[];
  monitoredParameters: MonitoredParamItem[];
  controlLevels: ControlLevelItem[];
  engineeringInteractions: EngineeringInteractionItem[];
  internationalCase: {
    location: string;
    titleFr: string;
    titleEn: string;
    capacity: string;
    highlightsFr: string;
    highlightsEn: string;
  };
  cameroonCase: {
    assetLocation: string;
    titleFr: string;
    titleEn: string;
    notesFr: string;
    notesEn: string;
  };
  relatedDomains: {
    code: string;
    nameFr: string;
    nameEn: string;
    relationshipFr: string;
    relationshipEn: string;
  }[];
}

export const DOMAIN_WORKBENCH_DATA: Partial<Record<DomainCode, DomainWorkbenchProfile>> = {
  // DOMAIN 07: ELECTRICAL MACHINES & POWER CONVERSION
  D07: {
    domainCode: 'D07',
    titleFr: 'Machines Électriques & Conversion Électromécanique',
    titleEn: 'Electrical Machines & Electromechanical Conversion',
    summaryFr: 'Ce domaine traite de la physique des machines synchrones, asynchrones et des transformateurs de puissance : couplage magnétique, saturation ferromagnétique, régulation d\'excitation AVR, échauffement thermique des enroulements et dynamique électromécanique sous perturbation réseau.',
    summaryEn: 'Covers the physical principles and engineering of synchronous generators, induction motors, and power transformers: magnetic flux coupling, core saturation, AVR excitation dynamics, thermal winding insulation limits, and electromechanical swing under grid faults.',
    voltageRange: '0.4 kV – 24 kV',
    primaryStandard: 'CEI 60034 / CEI 60076',
    inputsFr: 'Couple mécanique d\'arbre hydraulique/gaz (MW) ou énergie électrique BT/MT d\'alimentation',
    inputsEn: 'Shaft mechanical torque from turbine (MW) or grid input feed (LV/MV)',
    coreTransformFr: 'Conversion bidirectionnelle d\'énergie électromécanique et transformation d\'induction B(H)',
    coreTransformEn: 'Bidirectional electromechanical energy conversion and ferromagnetic induction B(H)',
    outputsFr: 'Puissance active P (MW) et réactive Q (Mvar) synchronisée, ou couple moteur utile (N·m)',
    outputsEn: 'Synchronized active power P (MW) & reactive Q (Mvar), or usable shaft mechanical torque (N·m)',
    faultClearingTime: '60 ms – 100 ms',
    
    architectureStages: [
      {
        tag: 'ROTOR / STATOR',
        nameFr: '1. Excitation Rotorique & Induction',
        nameEn: '1. Rotor Excitation & Induction',
        descFr: 'Le courant continu d\'excitation If magnétise les pôles rotoriques créant un champ tournant à la fréquence synchrone (50 Hz).',
        descEn: 'DC field current If magnetizes rotor poles establishing a rotating flux wave at synchronous speed (50 Hz).',
        parameter: 'Vitesse Synchrone Ns',
        nominalValue: '187.5 tr/min (Hydro) / 3000 tr/min (Turbo)'
      },
      {
        tag: 'ENTREFER B(θ)',
        nameFr: '2. Distribution d\'Entre-fer & F.É.M.',
        nameEn: '2. Air-Gap Flux & Induced EMF',
        descFr: 'Loi de Faraday : la variation de flux induit une force électromotrice triphasée équilibrée dans les enroulements statoriques.',
        descEn: 'Faraday law: time-varying air-gap magnetic induction generates balanced 3-phase EMF in stator winding bars.',
        parameter: 'Induction d\'Entre-fer Bg',
        nominalValue: '0.85 – 1.05 Tesla'
      },
      {
        tag: 'RÉACTION D\'INDUIT',
        nameFr: '3. Réaction d\'Induit & Réactance Xd',
        nameEn: '3. Armature Reaction & Xd Reactance',
        descFr: 'Le courant débité crée un champ statorique qui déforme le champ principal rotorique, modélisé par les réactances directes et transverses.',
        descEn: 'Stator load current produces an armature reaction MMF modifying the main rotor flux, modeled by d-q axes reactances.',
        parameter: 'Réactance Synchrone Xd',
        nominalValue: '0.90 – 1.40 p.u.'
      },
      {
        tag: 'ISOLATION & REFROIDISSEMENT',
        nameFr: '4. Dissipation Thermique & Classe H',
        nameEn: '4. Heat Rejection & Insulation Class',
        descFr: 'Évacuation des pertes fer et cuivre par air forcé ou hydrogène; surveillance des points chauds selon CEI 60085.',
        descEn: 'Cooling of core and copper Joule losses via forced air, water or H2; hot-spot monitoring per IEC 60085.',
        parameter: 'Échauffement Maximal Δθ',
        nominalValue: '80 K (Classe B) / 105 K (Classe F)'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur : Courbe de Capabilité P-Q & Stabilité Alternateur',
      titleEn: 'Simulator: P-Q Capability Curve & Alternator Stability',
      descFr: 'Ajustez la puissance active P injectée pour observer la limite de courant rotorique (surexcitation) et la marge de stabilité d\'angle interne δ.',
      descEn: 'Adjust active power injection P to observe rotor thermal overexcitation limits and internal rotor angle margin δ.',
      paramName: 'Puissance Active P',
      unit: 'MW',
      min: 10,
      max: 80,
      step: 5,
      initialValue: 60,
      calculate: (pVal: number) => {
        const sn = 70; // MVA
        const qMaxOver = Math.sqrt(Math.max(0, Math.pow(sn, 2) - Math.pow(pVal, 2)));
        const deltaDeg = Math.round(Math.asin(Math.min(0.95, (pVal / sn) * 0.8)) * (180 / Math.PI));
        const rotorCurrentPu = (0.8 + (pVal / sn) * 0.45).toFixed(2);
        return [
          {
            labelFr: 'Marge Réactive Qmax (Surexcitation)',
            labelEn: 'Qmax Margin (Overexcitation)',
            value: qMaxOver.toFixed(1),
            unit: 'Mvar',
            statusFr: qMaxOver > 20 ? 'Zone de fonctionnement saine' : 'Limite thermique rotor atteinte',
            statusEn: qMaxOver > 20 ? 'Safe operating zone' : 'Rotor thermal ceiling approached'
          },
          {
            labelFr: 'Angle Interne Rotorique δ',
            labelEn: 'Internal Rotor Angle δ',
            value: deltaDeg.toString(),
            unit: '° él.',
            statusFr: deltaDeg < 45 ? 'Stabilité dynamique excellente' : 'Alerte : risque de décrochage',
            statusEn: deltaDeg < 45 ? 'Excellent dynamic stability' : 'Warning: pole-slip vulnerability'
          },
          {
            labelFr: 'Courant Rotorique Estimé If',
            labelEn: 'Estimated Field Current If',
            value: rotorCurrentPu,
            unit: 'p.u.',
            statusFr: parseFloat(rotorCurrentPu) <= 1.1 ? 'Normal' : 'Surintensité d\'excitation',
            statusEn: parseFloat(rotorCurrentPu) <= 1.1 ? 'Nominal' : 'Overexcitation trip risk'
          }
        ];
      }
    },

    equipmentList: [
      {
        tag: 'ALT-SYNC-HYDRO',
        nameFr: 'Alternateur Synchrone à Pôles Saillants (Hydro)',
        nameEn: 'Salient-Pole Hydro Synchronous Alternator',
        category: 'Génération Synchrone',
        standard: 'CEI 60034-1 / IEEE C50.12',
        roleFr: 'Convertit l\'énergie cinétique et de pression de la turbine hydraulique en puissance électrique triphasée 50 Hz.',
        roleEn: 'Transforms hydraulic turbine shaft mechanical torque into 50 Hz three-phase electrical power.',
        workingPrincipleFr: 'Rotor multipolaire avec enroulements d\'amortissement amortissant les oscillations pendulaires lors des variations brusques de charge.',
        workingPrincipleEn: 'Multi-pole rotor equipped with amortisseur damping bars to damp electromechanical oscillations during grid disturbances.',
        componentsFr: [
          'Rotor à pôles saillants avec enroulement d\'excitation CC',
          'Stator à tôles magnétiques feuilletées à faibles pertes',
          'Barres Roebel statoriques avec isolation mica-époxy classe F',
          'Système d\'excitation statique à thyristors (AVR)',
          'Paliers de butée hydrodynamiques à patins oscillants'
        ],
        componentsEn: [
          'Salient-pole rotor with DC excitation field windings',
          'Laminated low-loss silicon steel stator magnetic core',
          'Stator Roebel bars with Class F mica-epoxy insulation',
          'Static thyristor excitation system with digital AVR',
          'Tilting-pad hydrodynamic thrust bearings'
        ],
        ratings: [
          { labelFr: 'Puissance Nominale Sn', labelEn: 'Rated Capacity Sn', value: '70', unit: 'MVA' },
          { labelFr: 'Tension Statorique Un', labelEn: 'Stator Voltage Un', value: '15.0', unit: 'kV' },
          { labelFr: 'Courant Nominal In', labelEn: 'Rated Current In', value: '2694', unit: 'A' },
          { labelFr: 'Vitesse de Rotation', labelEn: 'Rated Speed', value: '187.5', unit: 'tr/min' }
        ],
        failureModesFr: 'Décharges partielles dans l\'isolation des barres statoriques, défaut de masse rotorique par perte d\'isolement, desserrage des cales d\'encoches.',
        failureModesEn: 'Slot partial discharge insulation breakdown, rotor ground faults, loose slot wedges under electrodynamic cyclic stress.',
        epedeEquipmentId: 'eq-hydro-songloulou-01'
      },
      {
        tag: 'TRAFO-GSU-ELEVATEUR',
        nameFr: 'Transformateur Élévateur de Groupe (GSU)',
        nameEn: 'Generator Step-Up Transformer (GSU)',
        category: 'Transformation de Puissance',
        standard: 'CEI 60076 / IEEE C57.12.00',
        roleFr: 'Élève la tension de génération (15 kV) au niveau de transport THT (225 kV) pour minimiser les pertes Joule sur la ligne d\'évacuation.',
        roleEn: 'Steps up 15 kV generation voltage to 225 kV bulk transmission levels to minimize Joule transmission losses.',
        workingPrincipleFr: 'Couplage magnétique ferromagnétique immergé dans l\'huile minérale diélectrique, refroidissement forcé ONAF/OFAF.',
        workingPrincipleEn: 'Ferromagnetic induction core immersed in inhibited mineral oil, forced oil and air cooling (ONAF/OFAF).',
        componentsFr: [
          'Noyau magnétique à trois colonnes en tôles à grains orientés',
          'Enroulements BT en nappe cuivre et enroulements HT en disques continus',
          'Traversées condensateur céramique ou RIP 225 kV',
          'Conservateur d\'huile avec dessiccateur à silicagel',
          'Relais de protection Buchholz (gaz et coup de pression)'
        ],
        componentsEn: [
          'Three-limb core made of grain-oriented electrical steel',
          'LV copper foil windings and HV continuous disc windings',
          '225 kV Resin-Impregnated Paper (RIP) condenser bushings',
          'Oil conservator with silica gel breathers',
          'Dual-element Buchholz gas accumulation and oil surge relay'
        ],
        ratings: [
          { labelFr: 'Puissance Nominale Sn', labelEn: 'Rated Capacity Sn', value: '75', unit: 'MVA' },
          { labelFr: 'Rapport de Transformation', labelEn: 'Voltage Ratio', value: '15 / 225', unit: 'kV' },
          { labelFr: 'Tension de Court-Circuit Ucc', labelEn: 'Impedance Ucc', value: '12.5', unit: '%' },
          { labelFr: 'Type de Refroidissement', labelEn: 'Cooling Class', value: 'ONAF', unit: '' }
        ],
        failureModesFr: 'Vieillissement thermique de la cellulose (rupture des liaisons DP du papier), court-circuit entre spires, dégradation diélectrique de l\'huile.',
        failureModesEn: 'Cellulose paper thermal degradation (DP chain breakdown), turn-to-turn inter-winding flashover, moisture oil contamination.',
        epedeEquipmentId: 'eq-trafo-hta-01'
      },
      {
        tag: 'DISJONCTEUR-GROUPE-GCB',
        nameFr: 'Disjoncteur de Groupe (Generator Circuit Breaker - GCB)',
        nameEn: 'Generator Circuit Breaker (GCB)',
        category: 'Appareillage de Coupure',
        standard: 'CEI / IEEE 62271-37-013',
        roleFr: 'Interrompt en toute sécurité les courants de court-circuit très élevés présentant une forte composante continue asymétrique.',
        roleEn: 'Safely interrupts extremely high short-circuit currents characterized by delayed zero-crossings and steep TRV.',
        workingPrincipleFr: 'Coupure dans le gaz SF6 ou sous vide avec soufflage haute pression pour éteindre l\'arc sous fort déphasage inductif.',
        workingPrincipleEn: 'SF6 gas self-blast or vacuum arc quenching engineered to withstand severe transient recovery voltage (TRV) rates.',
        componentsFr: [
          'Chambre de coupure SF6 à double mouvement de contact',
          'Condensateurs de répartition et résistances d\'enclenchement',
          'Mécanisme de manœuvre oléopneumatique ou à ressorts préchargés',
          'Sectionneur d\'isolement intégré avec couteau de mise à la terre'
        ],
        componentsEn: [
          'SF6 dual-motion interrupting chambers',
          'Grading capacitors and transient damping resistors',
          'High-energy spring or hydropneumatic operating mechanism',
          'Integrated disconnector and high-speed earthing switch'
        ],
        ratings: [
          { labelFr: 'Courant Assigné Continu', labelEn: 'Rated Continuous Current', value: '4000', unit: 'A' },
          { labelFr: 'Pouvoir de Coupure Isc', labelEn: 'Breaking Capacity Isc', value: '63', unit: 'kA' },
          { labelFr: 'Asymétrie Continue (DC%)', labelEn: 'DC Component', value: '75', unit: '%' },
          { labelFr: 'Pente de TTR (dv/dt)', labelEn: 'TRV Rate of Rise', value: '3.5', unit: 'kV/µs' }
        ],
        failureModesFr: 'Baisse de densité de SF6 (fuite), usure d\'érosion des contacts d\'arc sous coupures répétées, défaillance d\'armement mécanique.',
        failureModesEn: 'SF6 gas density loss, sacrificial arcing contact erosion under fault duties, spring mechanism latch fatigue.',
        epedeEquipmentId: 'eq-cb-sf6-01'
      }
    ],

    protections: [
      {
        ansiCode: '87G',
        nameFr: 'Protection Différentielle Alternateur',
        nameEn: 'Generator Differential Protection',
        standard: 'IEEE C37.102 / CEI 60255-187',
        principleFr: 'Compare instantanément la somme vectorielle des courants aux extrémités neutre et bornes du stator. Déclenchement instantané si Idiff > Seuil.',
        principleEn: 'Compares instantaneous phasor sum of stator neutral and terminal currents. Immediate trip without intentional time delay if Idiff > Slope.',
        typicalSetting: 'Idiff > 0.15 In · Pente 1: 15% · Pente 2: 70%'
      },
      {
        ansiCode: '40',
        nameFr: 'Perte d\'Excitation (Relais d\'Impédance Mho)',
        nameEn: 'Loss of Field / Excitation Protection',
        standard: 'IEEE C37.102',
        principleFr: 'Détecte la chute de réactance vue des bornes de l\'alternateur lors d\'une défaillance de l\'AVR ou ouverture du disjoncteur de champ.',
        principleEn: 'Monitors impedance trajectory entering the machine d-q capability circle upon loss of DC field excitation current.',
        typicalSetting: 'Cercle Mho décalé : Diamètre = Xd, Décalage = -X\'d / 2, Td = 0.5 s'
      },
      {
        ansiCode: '64R / 64S',
        nameFr: 'Protection Masse Rotor & Stator 100%',
        nameEn: '100% Stator & Rotor Ground Fault Protection',
        standard: 'CEI 60255',
        principleFr: 'Injection basse fréquence (20 Hz) ou surveillance de la 3ème harmonique pour détecter les défauts même proches du point neutre.',
        principleEn: 'Sub-harmonic (20 Hz) voltage injection or 3rd harmonic ratio monitoring to detect ground contacts near stator neutral point.',
        typicalSetting: 'Seuil résistance d\'isolement R < 1000 Ω (Alarme) / R < 200 Ω (Déclenchement)'
      },
      {
        ansiCode: '46',
        nameFr: 'Déséquilibre de Courant (Séquence Inverse I2)',
        nameEn: 'Negative Sequence Overcurrent Protection',
        standard: 'CEI 60034-1',
        principleFr: 'Mesure le courant de composante inverse créant un champ rétrograde tournant à 100 Hz induisant un échauffement destructeur au rotor.',
        principleEn: 'Measures negative sequence current I2 creating a double-frequency (100 Hz) backward flux overheating rotor surface wedges.',
        typicalSetting: 'Constante thermique rotorique I2²·t = 10 s (Pôles saillants)'
      },
      {
        ansiCode: '24',
        nameFr: 'Surfluxage Volts / Hertz (V/Hz)',
        nameEn: 'Volts-per-Hertz Overexcitation Protection',
        standard: 'IEEE C37.102',
        principleFr: 'Protège le circuit magnétique de l\'alternateur et du transformateur GSU contre la saturation magnétique et les flux de fuite massifs.',
        principleEn: 'Protects core laminations against saturation and stray flux overheating when ratio V/f exceeds nominal threshold.',
        typicalSetting: 'V/f > 1.10 p.u. (Temporisé 10 s) · V/f > 1.18 p.u. (Instantané 0.5 s)'
      },
      {
        ansiCode: '63',
        nameFr: 'Détection Pression & Gaz Buchholz (Transfo)',
        nameEn: 'Buchholz Gas & Pressure Surge Detection',
        standard: 'CEI 60076-1',
        principleFr: 'Détecte le dégagement gazeux progressif (arc lent) et l\'onde de choc d\'huile vers le conservateur (court-circuit franc).',
        principleEn: 'Dual float switch detecting slow pyrolysis gas accumulation and high-velocity oil surge caused by severe internal fault arc.',
        typicalSetting: 'Débit d\'huile > 1.0 m/s (Déclenchement instantané)'
      }
    ],

    faultSequence: [
      {
        time: 't = 0 ms',
        eventFr: 'Amorçage d\'un arc entre spires statoriques',
        eventEn: 'Inter-turn stator winding insulation flashover',
        detailFr: 'Courant de défaut local très élevé, distorsion des courants de phase aux bornes.',
        detailEn: 'Localized intense fault arc, rapid distortion of terminal phase currents.'
      },
      {
        time: 't = 15 ms',
        eventFr: 'Détection par le relais différentiel ANSI 87G',
        eventEn: 'Differential relay ANSI 87G trip criteria met',
        detailFr: 'Le courant différentiel vectoriel Idiff franchit la pente de retenue stabilisée.',
        detailEn: 'Vector differential current exceeds restraint characteristic slope.'
      },
      {
        time: 't = 30 ms',
        eventFr: 'Émission des ordres de déclenchement simultanés',
        eventEn: 'Simultaneous master trip commands dispatched',
        detailFr: 'Ordre au GCB (Disjoncteur Groupe), désexcitation rapide et arrêt d\'urgence turbine.',
        detailEn: 'Trip signals issued to GCB, field de-excitation breaker, and turbine emergency gate.'
      },
      {
        time: 't = 75 ms',
        eventFr: 'Ouverture complète des pôles du disjoncteur GCB',
        eventEn: 'GCB poles fully open, arc extinguished',
        detailFr: 'Isolement physique du groupe du réseau 225 kV, extinction de l\'arc dans le SF6.',
        detailEn: 'Generator isolated from 225 kV grid, fault feed interrupted within SF6 chambers.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Températures Enroulements Stator (12 x RTD Pt100)',
        nameEn: 'Stator Winding Temperatures (12 x Pt100 RTDs)',
        sensorFr: 'Sondes platine insérées en fond et entre-deux d\'encoches',
        sensorEn: 'Platinum RTD elements embedded in stator slot cores',
        rate: '1 Hz (Scruté en continu)',
        protocol: 'Modbus TCP / CEI 61850'
      },
      {
        nameFr: 'Vibrations Paliers & Arbre (Accéléromètres 3 axes)',
        nameEn: 'Shaft & Bearing Vibrations (3-Axis Proximity Probes)',
        sensorFr: 'Capteurs à courants de Foucault sans contact + piézoélectriques',
        sensorEn: 'Eddy-current non-contact displacement probes + accelerometers',
        rate: '500 Hz (Analyse spectrale FFT)',
        protocol: 'CEI 60870-5-104'
      },
      {
        nameFr: 'Décharges Partielles (PD) en Ligne',
        nameEn: 'Online Partial Discharge (PD) Activity',
        sensorFr: 'Condensateurs de couplage 80 pF sur barres 15 kV',
        sensorEn: 'High-voltage 80 pF capacitive busbar couplers',
        rate: 'Haute Fréquence (MHz)',
        protocol: 'Système Dédié / Fibre'
      },
      {
        nameFr: 'Courant & Tension d\'Excitation (If, Uf)',
        nameEn: 'Field Voltage & Current (If, Uf)',
        sensorFr: 'Shunt de mesure CC et transducteur galvanique à effet Hall',
        sensorEn: 'DC precision shunt and galvanic Hall effect transducer',
        rate: '100 Hz',
        protocol: 'Bus Numérique AVR'
      }
    ],

    controlLevels: [
      {
        level: 'NIVEAU 0 · LOCAL PHYSIQUE',
        nameFr: 'Régulateur Automatique de Tension (AVR)',
        nameEn: 'Automatic Voltage Regulator (AVR)',
        descFr: 'Boucle fermée ultra-rapide agissant sur l\'angle d\'amorçage des thyristors pour maintenir la tension statorique à 15 kV ± 0.5% et amortir les oscillations (PSS).',
        descEn: 'Ultra-fast closed loop controlling thyristor firing angles to maintain 15 kV ± 0.5% terminal voltage and damp power swings via PSS.',
        response: '< 20 ms'
      },
      {
        level: 'NIVEAU 1 · TRANCHE GROUPE',
        nameFr: 'Automate Programmable de Groupe (Turbine Governor PLC)',
        nameEn: 'Unit DCS & Digital Governor PLC',
        descFr: 'Gestion des séquences de démarrage, vitesse de synchronisation 187.5 tr/min, couplage synchro-coupleur et régulation de puissance active (P).',
        descEn: 'Automated start/stop sequence sequencing, 187.5 rpm speed governor, auto-synchronizer, and droop active power control.',
        response: '50 ms'
      },
      {
        level: 'NIVEAU 2 · CENTRALE / DISPATCHING',
        nameFr: 'Supervision Centrale DCS & Téléréglage SONATREL (AGC)',
        nameEn: 'Central Plant DCS & Grid Dispatch AGC Infeed',
        descFr: 'Réception des consignes de téléréglage fréquence-puissance du dispatching national de Yaoundé pour la participation au réglage secondaire.',
        descEn: 'Execution of automated AGC setpoints received from Yaounde National Dispatching Center for secondary frequency containment.',
        response: '2 s – 5 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Machines Tournantes',
        roleFromEn: 'Electrical Rotating Machines Engineer',
        roleToFr: 'Ingénieur Études Réseau',
        roleToEn: 'Power System Planning Engineer',
        phase: 'Conception / Dimensionnement',
        dataExchangedFr: 'Fiche d\'impédances complètes : Xd, X\'d, X"d, constante d\'inertie H (MW·s/MVA), temps transitoire T\'d0.',
        dataExchangedEn: 'Full reactances data sheet: Xd, X\'d, X"d, inertia constant H (MW·s/MVA), transient open-circuit time T\'d0.',
        decisionFr: 'Validation de la stabilité transitoire d\'angle et dimensionnement des capacités d\'évacuation sur le réseau 225 kV.',
        decisionEn: 'Validation of transient rotor angle stability and sizing of 225 kV transmission evacuation corridors.',
        impactFr: 'Évite le décrochage du groupe sur court-circuit éliminé en temps normal (100 ms).',
        impactEn: 'Prevents generator pole-slipping upon standard cleared grid faults (100 ms).'
      },
      {
        roleFromFr: 'Ingénieur Protections & Contrôle',
        roleFromEn: 'Protection & Control Engineer',
        roleToFr: 'Constructeur Alternateur (OEM)',
        roleToEn: 'Turbine-Generator OEM',
        phase: 'Réglages Relais & Essais Plateforme',
        dataExchangedFr: 'Courbe thermique statorique I²t, tenue en courant inverse I2, limites de surexcitation V/Hz.',
        dataExchangedEn: 'Stator thermal damage curve I²t, continuous negative sequence capability I2, V/Hz core saturation limit.',
        decisionFr: 'Calibrage des seuils différentiels 87G et de la courbe à temps inverse ANSI 46 pour une sélectivité totale.',
        decisionEn: 'Calibration of 87G differential slope and ANSI 46 inverse-time curve for full selectivity without spurious trips.',
        impactFr: 'Garantit la protection intégrale de la machine sans déclenchement intempestif sur creux de tension transitoire.',
        impactEn: 'Guarantees comprehensive machine protection without nuisance tripping during grid-side transient voltage dips.'
      },
      {
        roleFromFr: 'Ingénieur Maintenance & Diagnostic',
        roleFromEn: 'Maintenance & Asset Health Engineer',
        roleToFr: 'Chef de Quart Exploitation',
        roleToEn: 'Plant Shift Supervisor',
        phase: 'Exploitation Temps Réel',
        dataExchangedFr: 'Spectre des décharges partielles (nC) et analyse chromatographique de l\'huile du transformateur GSU (DGA).',
        dataExchangedEn: 'Partial discharge trend patterns (nC) and dissolved gas analysis (DGA - Duval triangle) in GSU transformer oil.',
        decisionFr: 'Décision d\'abaissement temporaire de charge ou d\'arrêt programmé pour revissage de barre statorique.',
        decisionEn: 'Decision to derate generator dispatch load or schedule outage for stator bar wedge tightening.',
        impactFr: 'Empêche l\'apparition d\'un arc destructeur en cuve ou en encoche provoquant des mois d\'arrêt.',
        impactEn: 'Prevents catastrophic core flashover outage saving millions in lost production downtime.'
      }
    ],

    internationalCase: {
      location: 'Centrale Hydroélectrique des Trois-Gorges (Chine)',
      titleFr: 'Groupes Hydroélectriques Francis Géants de 700 MW / 840 MVA',
      titleEn: '700 MW / 840 MVA Giant Francis Hydro Generators',
      capacity: '32 groupes × 700 MW = 22 500 MW au total',
      highlightsFr: 'Rotor de 1800 tonnes, diamètre de 10.6 mètres, enroulement statorique refroidi par circulation interne d\'eau déminéralisée; premier alternateur mondial à intégrer un système de diagnostic vibratoire optique en continu.',
      highlightsEn: '1800-ton rotor, 10.6m diameter, demineralized stator bar internal water cooling; pioneer utility in deploying automated fiber-optic vibration condition monitoring.'
    },

    cameroonCase: {
      assetLocation: 'Aménagement Hydroélectrique de Nachtigal (Fleuve Sanaga) & Song Loulou',
      titleFr: 'Alternateurs Nachtigal 7 × 60 MW (Sn = 70 MVA, Un = 15 kV)',
      titleEn: 'Nachtigal Hydro Generating Units 7 × 60 MW (Sn = 70 MVA, Un = 15 kV)',
      notesFr: 'Les groupes Nachtigal alimentent le Réseau Interconnecté Sud (RIS) via deux lignes 225 kV vers le poste d\'interconnexion de Nyom 2. Le réglage primaire et secondaire de fréquence sur le bassin de la Sanaga est coordonné avec les groupes existants de Song Loulou (8 × 48 MW) et d\'Edéa (276 MW).',
      notesEn: 'Nachtigal units feed the Southern Interconnected Grid (RIS) through twin 225 kV lines to Nyom 2 substation. Primary and secondary frequency regulation along the Sanaga basin is tightly synchronized with legacy Song Loulou (8 × 48 MW) and Edea (276 MW) hydro plants.'
    },

    relatedDomains: [
      {
        code: 'D01',
        nameFr: 'Production d\'Énergie',
        nameEn: 'Power Generation',
        relationshipFr: 'Fournit la turbine hydraulique ou thermique qui entraîne l\'arbre de l\'alternateur.',
        relationshipEn: 'Provides the prime mover turbine providing shaft mechanical drive.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques',
        nameEn: 'Substations & Switchyards',
        relationshipFr: 'Reçoit l\'énergie du transformateur élévateur GSU vers le jeu de barres d\'évacuation.',
        relationshipEn: 'Terminates the GSU transformer high-voltage output at the switchyard busbar.'
      },
      {
        code: 'D11',
        nameFr: 'Systèmes de Protection',
        nameEn: 'Protection Systems',
        relationshipFr: 'Abrite les relais différentiels 87G/87T, protections de terre 64R/64S et désexcitation rapide.',
        relationshipEn: 'Houses unit differential 87G/87T relays, ground fault 64R/64S and field de-excitation.'
      },
      {
        code: 'D15',
        nameFr: 'Gestion d\'Actifs & Diagnostic',
        nameEn: 'Asset Management & Health',
        relationshipFr: 'Surveillance des décharges partielles stator, analyse d\'huile DGA et inspection des cales.',
        relationshipEn: 'Monitors online stator partial discharges, DGA transformer oil and core slot wedge tightness.'
      }
    ]
  },

  // DOMAIN 08: INDUSTRIAL ELECTRICAL & PROCESS SYSTEMS
  D08: {
    domainCode: 'D08',
    titleFr: 'Systèmes Électriques Industriels & Procédés Électro-Intensifs',
    titleEn: 'Industrial Electrical & Process Systems',
    summaryFr: 'Ce domaine traite de l\'électrification des complexes industriels lourds, des usines de transformation continue (alumineries, cimenteries, raffineries, mines) et des installations en atmosphères explosibles (ATEX). Il régit l\'architecture des Centres de Contrôle Moteur (MCC), la continuité de service des procédés critiques, la coordination sélective des protections BT/HTA et l\'atténuation des perturbations harmoniques générées par les charges non linéaires.',
    summaryEn: 'Focuses on heavy industrial power infrastructure, continuous process plants (aluminum smelters, cement plants, oil refineries, mining facilities) and hazardous areas (ATEX). Governs Motor Control Center (MCC) architectures, process power continuity, LV/MV protection selectivity coordination, and mitigation of harmonic pollution caused by massive non-linear process drives.',
    voltageRange: '400 V BT – 30 kV HTA / 90 kV HTB',
    primaryStandard: 'CEI 60364-7 / CEI 61439 / CEI 60079',
    inputsFr: 'Alimentation réseau HTB/HTA (e.g. 90 kV / 15 kV), groupes électrogènes de secours diesel/gaz et alimentations sans interruption (ASI)',
    inputsEn: 'Utility grid supply HV/MV (e.g. 90 kV / 15 kV), emergency diesel/gas generation sets, and UPS backup battery banks',
    coreTransformFr: 'Transformation d\'énergie HTA/BT, conversion de puissance par variateurs VFD et distribution sécurisée vers tableaux MCC débrochables',
    coreTransformEn: 'MV/LV power transformation, VFD variable frequency drive conditioning, and secure distribution via withdrawable MCC cubicles',
    outputsFr: 'Force motrice mécanique pour compresseurs/pompes/broyeurs, puissance thermique pour fours industriels, et bus DC pour électrolyse',
    outputsEn: 'Mechanical drive power for compressors/pumps/mills, thermal smelting power for furnaces, and heavy DC busbars for electrolysis',
    faultClearingTime: '30 ms – 150 ms',

    architectureStages: [
      {
        tag: 'ARRIVÉE HTB/HTA & TRANSFOS',
        nameFr: '1. Poste Source Privé & Découplage Réseau',
        nameEn: '1. Industrial Primary Substation & Decoupling',
        descFr: 'Poste d\'alimentation privé 90/15 kV ou 30 kV avec disjoncteurs SF6, transformateurs à régleurs en charge (OLTC) et protections de découplage ANSI 81U/81O/78.',
        descEn: 'Private 90/15 kV or 30 kV utility interface switchyard with SF6 circuit breakers, on-load tap changers (OLTC) and ANSI 81U/81O/78 grid decoupling relays.',
        parameter: 'Puissance Souscrite P_sous',
        nominalValue: '10 MVA – 250 MVA (Alucam)'
      },
      {
        tag: 'DISTRIBUTION HTA INTERNE',
        nameFr: '2. Boucle Moyenne Tension & Tableaux HTA',
        nameEn: '2. Internal MV Ring & Switchgear Lineup',
        descFr: 'Réseau bouclé ouvert ou double antenne 15 kV / 6.6 kV alimentant les sous-stations de procédé, cellules sous enveloppe métallique LSC2B-PM avec jeux de barres 2500 A.',
        descEn: 'Open-loop or dual-radial 15 kV / 6.6 kV feeders feeding process unit substations, LSC2B-PM metal-clad switchgear with 2500 A busbars.',
        parameter: 'Courant de Court-Circuit Icc',
        nominalValue: '25 kA / 31.5 kA (1s)'
      },
      {
        tag: 'CENTRES MCC BT',
        nameFr: '3. Centres de Contrôle Moteur (MCC 400 V / 690 V)',
        nameEn: '3. Motor Control Centers (MCC 400 V / 690 V)',
        descFr: 'Tableaux formés 3b/4b à tiroirs débrochables intégrant contacteurs sous vide, démarreurs progressifs et variateurs de fréquence VFD en réseau de communication Profinet/Modbus-TCP.',
        descEn: 'Form 3b/4b modular withdrawable drawer cubicles housing vacuum contactors, soft-starters and VFD drives over industrial Profinet/Modbus-TCP fieldbus.',
        parameter: 'Forme de Séparation Interne',
        nominalValue: 'Forme 4b (CEI 61439-2)'
      },
      {
        tag: 'ZONES À RISQUE ATEX',
        nameFr: '4. Équipements Protégés en Atmosphères Explosibles',
        nameEn: '4. Hazardous Area ATEX Equipment',
        descFr: 'Moteurs et luminaires certifiés Ex d (antidéflagrant), Ex e (sécurité augmentée) et boucles d\'instrumentation Ex i (sécurité intrinsèque) selon Directive ATEX / CEI 60079.',
        descEn: 'Motors and fixtures rated Ex d (flameproof), Ex e (increased safety), and Ex i (intrinsic safety) field loops per ATEX Directive / IEC 60079.',
        parameter: 'Classe de Température ATEX',
        nominalValue: 'T3 (200°C) / T4 (135°C) - Zone 1/2'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur : Impact du Démarrage Moteur Asynchrone sur le Creux de Tension',
      titleEn: 'Simulator: Induction Motor Starting Impact on Bus Voltage Sag',
      descFr: 'Simulez le démarrage d\'un gros moteur asynchrone (kW) sur le jeu de barres d\'usine pour évaluer le creux de tension transitoire (ΔU%) et le risque de déclenchement intempestif des contacteurs BT.',
      descEn: 'Simulate the direct-on-line (DOL) or soft start of a large induction motor to evaluate bus voltage sag (ΔU%) and prevent contactor drop-out.',
      paramName: 'Puissance Moteur P_mot',
      unit: 'kW',
      min: 50,
      max: 1200,
      step: 50,
      initialValue: 350,
      calculate: (pVal: number) => {
        const busSscMva = 25; // Puissance de court-circuit du jeu de barres (MVA)
        const motorSstartMva = (pVal * 6.0) / 1000; // Courant de démarrage 6 x In
        const voltDropPercent = ((motorSstartMva / (busSscMva + motorSstartMva)) * 100);
        const contactorTripRisk = voltDropPercent > 15;
        const startDurationSec = (2.0 + (pVal / 300) * 2.5).toFixed(1);

        return [
          {
            labelFr: 'Creux de Tension au Démarrage ΔU',
            labelEn: 'Starting Voltage Sag ΔU',
            value: voltDropPercent.toFixed(1),
            unit: '%',
            statusFr: voltDropPercent <= 10 ? 'Conforme CEI 60034 (Excellent)' : voltDropPercent <= 15 ? 'Tolérable avec démarreur progressif' : 'Critique : risque de décrochage contacteurs',
            statusEn: voltDropPercent <= 10 ? 'Compliant with IEC 60034 (Good)' : voltDropPercent <= 15 ? 'Tolerable with soft-starter' : 'Critical: contactor drop-out danger'
          },
          {
            labelFr: 'Courant d\'Appel Initial I_dem',
            labelEn: 'Inrush Starting Current I_start',
            value: (motorSstartMva * 1000 / (Math.sqrt(3) * 0.4)).toFixed(0),
            unit: 'A',
            statusFr: '6 × In nominal direct',
            statusEn: '6 × In direct-on-line'
          },
          {
            labelFr: 'Durée Transitoire d\'Accélération',
            labelEn: 'Transient Acceleration Time',
            value: startDurationSec,
            unit: 's',
            statusFr: contactorTripRisk ? 'Recommandation : VFD ou Soft-Starter' : 'Démarrage direct DOL admissible',
            statusEn: contactorTripRisk ? 'Recommendation: VFD or Soft-Starter' : 'Direct-on-line (DOL) permissible'
          }
        ];
      }
    },

    equipmentList: [
      {
        tag: 'MCC-400-WITHDRAW',
        nameFr: 'Centre de Contrôle Moteur BT à Tiroirs Débrochables (MCC)',
        nameEn: 'Low-Voltage Withdrawable Motor Control Center (MCC)',
        category: 'Distribution & Manœuvre BT',
        standard: 'CEI 61439-1/2',
        roleFr: 'Alimente, protège et commande de manière centralisée les moteurs asynchrones de procédé en garantissant le remplacement d\'un tiroir sous tension en toute sécurité pour l\'opérateur.',
        roleEn: 'Centralizes power feed, protection, and control for continuous process induction motors, allowing live drawer racking-in/out in total operator safety.',
        workingPrincipleFr: 'Chaque tiroir intègre le sectionnement en amont, un disjoncteur magnéto-thermique ou fusible gG/aM, un contacteur sous vide ou électromécanique classe AC-3/AC-4, un relais de protection moteur électronique communicant et les bornes de télécommande.',
        workingPrincipleEn: 'Each modular drawer houses incoming isolating contacts, motor circuit breaker or fuses, AC-3/AC-4 contactor, smart microprocessor motor protection relay, and control terminal disconnect blocks.',
        componentsFr: [
          'Pinces de contact débrochables argentées (puissance et auxiliaires)',
          'Disjoncteur moteur magnéto-thermique réglable',
          'Contacteur triphasé sous vide ou à soufflage magnétique',
          'Relais numérique de protection moteur avec interface Profinet',
          'Mécanisme d\'interverrouillage porte-tiroir avec positions Embroché/Test/Débroché'
        ],
        componentsEn: [
          'Silver-plated withdrawable power and control tulip contacts',
          'Adjustable motor circuit breaker',
          'Three-phase vacuum or air-break contactor',
          'Digital motor protection relay with Profinet fieldbus',
          'Door-drawer interlock mechanism (Connected/Test/Disconnected positions)'
        ],
        ratings: [
          { labelFr: 'Tension assignée Un', labelEn: 'Rated voltage Un', value: '400 / 690', unit: 'V' },
          { labelFr: 'Courant de jeu de barres principal', labelEn: 'Main busbar current', value: '2500 – 4000', unit: 'A' },
          { labelFr: 'Courant de court-circuit Icw', labelEn: 'Short-time withstand Icw', value: '50 / 65', unit: 'kA (1s)' },
          { labelFr: 'Indice de protection IP', labelEn: 'Ingress protection IP', value: 'IP42 / IP54', unit: '' }
        ],
        failureModesFr: 'Échauffement anormal par relâchement de pression des pinces de contact débrochables; arc interne lors d\'une manœuvre; grippage mécanique du contacteur.',
        failureModesEn: 'Hotspots caused by loose withdrawable contact finger tension; internal arc flash during racking; contactor mechanical welding/seizure.',
        epedeEquipmentId: 'eq-tgbt-bt-01'
      },
      {
        tag: 'VFD-DRIVE-MV',
        nameFr: 'Variateur de Vitesse Moyenne Tension Multi-Niveaux (VFD HTA)',
        nameEn: 'Medium-Voltage Multi-Level Variable Frequency Drive (MV-VFD)',
        category: 'Électronique de Puissance & Entraînement',
        standard: 'CEI 61800-4 / CEI 61800-5',
        roleFr: 'Régule la vitesse et le couple des très gros moteurs asynchrones ou synchrones (pompes d\'alimentation de chaudière, ventilateurs de tirage, broyeurs miniers) sans à-coup mécanique ni appel de courant au démarrage.',
        roleEn: 'Controls speed and torque of large MV motors (boiler feed pumps, induced draft fans, mining ball mills) eliminating mechanical shock and starting current spikes.',
        workingPrincipleFr: 'Topologie à cellules de puissance en cascade (Cascaded H-Bridge) alimentées par un transformateur déphaseur multi-enroulements; produit une tension quasi sinusoïdale en sortie (faible THDu, dV/dt < 500 V/µs).',
        workingPrincipleEn: 'Cascaded H-Bridge (CHB) multi-level cell topology fed by a phase-shifting isolation transformer; delivers near-pure sinusoidal output waveform (low THDu, dV/dt < 500 V/µs).',
        componentsFr: [
          'Transformateur d\'isolement sec à 24 ou 36 enroulements secondaires déphasés',
          'Cellules de puissance débrochables avec ponts IGBT et condensateurs film sec',
          'Unité de contrôle numérique à processeur DSP / FPGA',
          'Filtre sinus de sortie et self de lissage',
          'Système de refroidissement par air forcé ou eau déminéralisée'
        ],
        componentsEn: [
          'Dry-type phase-shifting transformer with 24 or 36 secondary windings',
          'Withdrawable IGBT power cells with dry-film capacitors',
          'DSP / FPGA digital vector control unit',
          'Output sine-wave filter and du/dt suppression choke',
          'Redundant forced-air or demineralized water cooling circuits'
        ],
        ratings: [
          { labelFr: 'Tension assignée réseau', labelEn: 'Rated input voltage', value: '6.6 / 11', unit: 'kV' },
          { labelFr: 'Puissance assignée', labelEn: 'Rated motor power', value: '1.5 – 12', unit: 'MW' },
          { labelFr: 'Taux de distorsion harmonique THDi', labelEn: 'Total harmonic distortion THDi', value: '< 3', unit: '%' },
          { labelFr: 'Rendement global', labelEn: 'Overall efficiency', value: '98.2', unit: '%' }
        ],
        failureModesFr: 'Claquer d\'IGBT sous surtension transitoire; défaillance de ventilateur de cellule; dérive capacitive des condensateurs de filtrage bus DC.',
        failureModesEn: 'IGBT breakdown under line surge; power cell fan failure; DC bus film capacitor degradation.',
        epedeEquipmentId: 'eq-vfd-ind-01'
      },
      {
        tag: 'EX-D-MOTOR',
        nameFr: 'Moteur Asynchrone Antidéflagrant ATEX Ex d IIC T4',
        nameEn: 'Explosion-Proof Induction Motor ATEX Ex d IIC T4',
        category: 'Actionneurs en Atmosphère Dangereuse',
        standard: 'CEI 60079-0 / CEI 60079-1',
        roleFr: 'Actionne les pompes d\'hydrocarbures, compresseurs de gaz et mélangeurs chimiques en zone 1 ou zone 2 sans risque d\'enflammer l\'atmosphère environnante.',
        roleEn: 'Drives hydrocarbon pumps, gas compressors, and chemical agitators in Zone 1 / Zone 2 hazardous areas without igniting surrounding explosive atmospheres.',
        workingPrincipleFr: 'Enveloppe renforcée en fonte GS capable de contenir l\'explosion interne d\'un mélange gazeux inflammable et de refroidir les gaz d\'échappement à travers des joints laminaires étroits (interstices antidéflagrants).',
        workingPrincipleEn: 'Heavy-duty ductile iron flameproof enclosure designed to withstand internal explosion of gas mixtures, cooling emerging exhaust gases through precision laminar flame paths.',
        componentsFr: [
          'Carcasse et flasques en fonte nodulaire à haute résistance mécanique',
          'Boîte à bornes certifiée Ex d avec presse-étoupes barrières certifiés ATEX',
          'Sondes de température PT100 intégrées dans les enroulements et paliers',
          'Bagues d\'étanchéité labyrinthe et joints plats usinés au micron'
        ],
        componentsEn: [
          'High-tensile ductile iron frame and end-shields',
          'Ex d certified terminal box with compound-filled barrier glands',
          'Embedded PT100 RTD sensors in stator windings and bearings',
          'Labyrinth shaft seals and precision-machined flame-gap joints'
        ],
        ratings: [
          { labelFr: 'Zone d\'utilisation ATEX', labelEn: 'ATEX Hazard Zone', value: 'Zone 1 & Zone 2', unit: '' },
          { labelFr: 'Groupe de gaz', labelEn: 'Gas group', value: 'IIC (Hydrogène, Acétylène)', unit: '' },
          { labelFr: 'Classe de température', labelEn: 'Temperature class', value: 'T4 (135°C max surface)', unit: '' },
          { labelFr: 'Indice de protection carcasse', labelEn: 'Enclosure rating', value: 'IP66', unit: '' }
        ],
        failureModesFr: 'Dégradation des interstices pare-flamme par corrosion ou rayure lors d\'une révision; surchauffe statorique par calage rotor.',
        failureModesEn: 'Flame path joint corrosion or scratch during overhaul; rotor stall causing rapid stator overtemperature beyond T-class limits.',
        epedeEquipmentId: 'eq-motor-atex-01'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 49',
        nameFr: 'Protection Thermique contre les Surcharges (Image Thermique)',
        nameEn: 'Thermal Overload Replica Protection',
        standard: 'CEI 60255-149',
        principleFr: 'Intègre mathématiquement les pertes par effet Joule I²·t en continu pour simuler l\'échauffement du cuivre statorique et du fer, avec prise en compte de la constante de temps d\'échauffement et de refroidissement.',
        principleEn: 'Continuously integrates I²·t Joule losses to model copper and rotor heating, using thermal heating and cooling time constants with hot-to-cold memory.',
        typicalSetting: 'Courbe thermique τ = 15-40 min, alarme à 90% d\'échauffement, déclenchement à 100% de la réserve thermique.'
      },
      {
        ansiCode: 'ANSI 51LR',
        nameFr: 'Protection Rotor Bloqué & Démarrage Trop Long',
        nameEn: 'Locked Rotor / Prolonged Starting Protection',
        standard: 'CEI 60947-4-1',
        principleFr: 'Détecte le maintien d\'un courant élevé supérieur à 2.5·In au-delà du temps maximal de démarrage admissible par les barres de la cage rotorique.',
        principleEn: 'Detects sustained overcurrent (> 2.5·In) persisting beyond allowable motor acceleration time to protect rotor cage bars against thermal melting.',
        typicalSetting: 'I_seuil = 2.5·In, temporisation t = T_start + 1.5 s (typiquement 8 à 15 s).'
      },
      {
        ansiCode: 'ANSI 46',
        nameFr: 'Protection contre les Déséquilibres de Courant (Composante Inverse I2)',
        nameEn: 'Negative Phase Sequence Current Unbalance',
        standard: 'CEI 60255-151',
        principleFr: 'La composante inverse de courant I2 induit dans le rotor des courants de Foucault à 100 Hz provoquant un échauffement destructeur foudroyant de la cage d\'écureuil.',
        principleEn: 'Negative sequence current I2 induces 100 Hz double-frequency eddy currents in rotor bars, causing violent thermal damage to the rotor cage.',
        typicalSetting: 'Alarme : I2/I1 > 10% (t = 10 s) ; Déclenchement : I2²·t = constante constructeur (5 à 10 s).'
      },
      {
        ansiCode: 'ANSI 50N/51N',
        nameFr: 'Protection Défaut à la Terre & Fuite Homopolaire',
        nameEn: 'Residual Ground Fault Overcurrent Protection',
        standard: 'CEI 60255-151',
        principleFr: 'Mesure le courant de fuite à la terre via un tore sommateur entourant les 3 phases pour détecter tout amorçage d\'isolement entre bobinage et masse carcasse.',
        principleEn: 'Monitors earth leakage current using a core-balance window current transformer (CBCT) to detect stator insulation breakdown to grounded frame.',
        typicalSetting: 'I_n0 = 300 mA – 1 A pour réseaux à neutre impédant, instantané t = 50 ms.'
      },
      {
        ansiCode: 'ANSI 67',
        nameFr: 'Protection à Maximum de Courant Directionnelle',
        nameEn: 'Directional Phase Overcurrent Protection',
        standard: 'CEI 60255-151',
        principleFr: 'Indispensable sur les départs des boucles industrielles fermées et interconnexions de générateurs de secours pour ne déclencher que vers la zone en défaut.',
        principleEn: 'Crucial on industrial closed ring feeders and captive co-generation tie-lines to trip selectively only toward the internal fault direction.',
        typicalSetting: 'Angle caractéristique RCA = 45°, seuil temporisé coordonné selon chronométrie sélective.'
      }
    ],

    faultSequence: [
      {
        time: 't = 0 ms',
        eventFr: 'Amorçage diélectrique entre phase et carcasse sur moteur de pompe d\'alimentation',
        eventEn: 'Phase-to-ground insulation breakdown on main boiler feed pump motor',
        detailFr: 'La dégradation d\'un isolant de fond d\'encoche provoque un arc électrique sous 6.6 kV. Le courant homopolaire monte instantanément à 450 A.',
        detailEn: 'Degraded slot liner insulation triggers a 6.6 kV flashover arc. Zero-sequence ground current spikes instantaneously to 450 A.'
      },
      {
        time: 't = 25 ms',
        eventFr: 'Détection par tore homopolaire et déclenchement du relais numérique ANSI 50N',
        eventEn: 'Detection via core-balance CT and tripping trigger from ANSI 50N relay',
        detailFr: 'Le relais numérique calcule le dépassement du seuil de courant homopolaire (I0 > 2 A) et active l\'ordre d\'ouverture.',
        detailEn: 'Numerical IED validates earth fault current exceeding threshold (I0 > 2 A) and energizes trip circuit coil.'
      },
      {
        time: 't = 65 ms',
        eventFr: 'Ouverture complète des pôles du disjoncteur à vide sous enveloppe HTA',
        eventEn: 'Full contact separation and arc extinction in MV vacuum circuit breaker',
        detailFr: 'Les ampoules à vide coupent le courant au premier passage à zéro. L\'arc de défaut est éteint sans propagation au reste du jeu de barres.',
        detailEn: 'Vacuum interrupters extinguish arc at first current zero. Fault cleared cleanly with zero damage to adjacent switchgear cells.'
      },
      {
        time: 't = 120 ms',
        eventFr: 'Basculement automatique de procédé (Inversion Automatique de Pompe)',
        eventEn: 'Automatic process rollover (Auto-Start of Standby Motor-Pump Unit)',
        detailFr: 'Le système de contrôle-commande DCS/SCADA détecte la chute de débit et lance le démarrage immédiat de la pompe de secours B.',
        detailEn: 'Process DCS/SCADA detects feed pressure drop and issues start command to redundant Standby Pump Unit B.'
      },
      {
        time: 't = 2.8 s',
        eventFr: 'Rétablissement nominal du procédé sans arrêt d\'usine ni délestage',
        eventEn: 'Full process parameter recovery without plant shutdown or blackout',
        detailFr: 'La pompe de secours atteint sa vitesse nominale; pression d\'eau rétablie dans la chaudière; continuité de production 100% préservée.',
        detailEn: 'Standby unit achieves rated rpm; boiler drum water level stabilized; complete preservation of continuous plant throughput.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Température des Enroulements Stator (RTD PT100)',
        nameEn: 'Stator Winding RTD Temperatures (PT100)',
        sensorFr: '6 à 12 sondes PT100 insérées entre spires dans les encoches statoriques',
        sensorEn: '6 to 12 PT100 platinum RTDs embedded between stator coil sides',
        rate: '1 Hz',
        protocol: 'Modbus-RTU / Profinet'
      },
      {
        nameFr: 'Spectre Vibratoire Paliers & Ligne d\'Arbre (Accéléromètres)',
        nameEn: 'Bearing & Shaft Vibration FFT Spectrum (Accelerometers)',
        sensorFr: 'Accéléromètres piézoélectriques 4-20 mA / IEPE sur paliers côté accouplement et opposé',
        sensorEn: 'Piezoelectric IEPE accelerometers mounted horizontally and vertically on bearings',
        rate: '10 kHz (FFT)',
        protocol: 'Modbus-TCP / Ethernet/IP'
      },
      {
        nameFr: 'Taux de Distorsion Harmonique THDi & THDu du Jeu de Barres',
        nameEn: 'Busbar Harmonic Distortion THDi & THDu',
        sensorFr: 'Centrale de mesure de qualité de l\'onde électrique classe A CEI 61000-4-30',
        sensorEn: 'Class A IEC 61000-4-30 digital power quality analyzer',
        rate: '10 cycles (200 ms)',
        protocol: 'CEI 61850 MMS / Modbus-TCP'
      },
      {
        nameFr: 'Pression & Débit d\'Huile de Lubrification Paliers',
        nameEn: 'Lube Oil Pressure & Flow Rate at Bearings',
        sensorFr: 'Transmetteurs piézorésistifs de pression différentielle certifiés SIL 2',
        sensorEn: 'Differential piezoresistive pressure transmitters SIL 2 certified',
        rate: '10 Hz',
        protocol: 'HART / 4-20 mA'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Local Équipement)',
        nameFr: 'Protections Matérielles & Capteurs d\'Actionneurs',
        nameEn: 'Hardware Protections & Actuator Interlocks',
        descFr: 'Arrêts d\'urgence câblés de sécurité, déclencheurs magnéto-thermiques instantanés, capteurs de fin de course tiroir et disjoncteurs moteurs.',
        descEn: 'Hardwired emergency stop pushbuttons, instantaneous magnetic trip coils, drawer position limit switches, and thermal overload relays.',
        response: '< 20 ms'
      },
      {
        level: 'Niveau 1 (Automatisation Cellule)',
        nameFr: 'Contrôleurs de Tiroir & Relais Numériques Moteur (IED)',
        nameEn: 'Drawer Motor Management Relays & Intelligent IEDs',
        descFr: 'Relais microprocesseurs intégrés dans les tiroirs MCC régulant les cycles de démarrage étoile-triangle, protection thermique et verrouillage séquentiel.',
        descEn: 'Intelligent motor management relays inside MCC cubicles executing start sequences, thermal algorithms, and reverse-inhibit lockouts.',
        response: '20 ms – 100 ms'
      },
      {
        level: 'Niveau 2 (Supervision Procédé)',
        nameFr: 'Automates Programmables Industriels (API / PLC) & DCS',
        nameEn: 'Industrial Programmable Logic Controllers (PLC) & DCS',
        descFr: 'Système de Contrôle Numérique Distribué (DCS) régulant les débits, pressions et boucles PID de l\'ensemble de l\'usine avec redondance chaude.',
        descEn: 'Distributed Control System (DCS) running plant PID loops, automated permissive starts, and emergency inter-trip logic with hot-standby CPUs.',
        response: '100 ms – 500 ms'
      },
      {
        level: 'Niveau 3 (Supervision Usine)',
        nameFr: 'SCADA Usine & Système de Gestion d\'Énergie (EMS)',
        nameEn: 'Plant SCADA & Industrial Energy Management System (EMS)',
        descFr: 'Optimisation de la facture énergétique, effacement de pointe sur dépassement de puissance souscrite, délestage sélectif des charges non prioritaires.',
        descEn: 'Peak-shaving on contracted utility tariff boundaries, load-shedding of non-essential feeders, and enterprise telemetry logging.',
        response: '1 s – 10 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Installations Électriques Industrielles',
        roleFromEn: 'Industrial Electrical Systems Engineer',
        roleToFr: 'Ingénieur Procédé & Mécanique',
        roleToEn: 'Process & Mechanical Engineer',
        phase: 'Ingénierie de Base (FEED)',
        dataExchangedFr: 'Liste des consommateurs moteurs (kW, vitesse, couple résistant C(N), inertie J_charge) et profil de marche.',
        dataExchangedEn: 'Motor consumer load list (kW, rpm, load torque curve C(N), load inertia J_load) and operating duty cycles.',
        decisionFr: 'Choix de la technologie de démarrage (DOL, démarreur progressif ou VFD multi-niveaux) pour ne pas perturber le réseau amont.',
        decisionEn: 'Selection of starting methodology (DOL, soft-starter, or multi-level VFD) to prevent busbar voltage crash.',
        impactFr: 'Évite les creux de tension destructeurs et garantit le couple d\'accélération nécessaire aux machines à forte inertie.',
        impactEn: 'Eliminates prohibitive line voltage sags and guarantees breakaway torque for high-inertia equipment.'
      },
      {
        roleFromFr: 'Ingénieur Électrique Protection & Sécurité',
        roleFromEn: 'Protection & Electrical Safety Engineer',
        roleToFr: 'Ingénieur Sécurité & HSE (ATEX)',
        roleToEn: 'HSE & Hazardous Area Safety Engineer',
        phase: 'Conception Détaillée',
        dataExchangedFr: 'Plan de zonage ATEX (Zone 0, 1, 2) avec nature des gaz (IIC/IIB) et températures d\'auto-inflammation.',
        dataExchangedEn: 'Hazardous area classification drawings (Zones 0, 1, 2) detailing gas groups (IIC/IIB) and auto-ignition temperatures.',
        decisionFr: 'Spécification du marquage antidéflagrant des moteurs (Ex d vs Ex e), choix des boîtes de jonction et barrières zener Ex i.',
        decisionEn: 'Specifying explosion-proof ratings (Ex d vs Ex e), selecting cable entry barrier glands, and intrinsic safety zener barriers.',
        impactFr: 'Conformité légale absolue aux normes de sécurité des personnes et prévention intégrale du risque d\'incendie/explosion.',
        impactEn: 'Strict legal safety compliance safeguarding human life and guaranteeing zero risk of plant vapor cloud explosion.'
      },
      {
        roleFromFr: 'Ingénieur Qualité d\'Énergie & Réseaux',
        roleFromEn: 'Power Quality & Grid Studies Engineer',
        roleToFr: 'Gestionnaire de Réseau de Transport (SONATREL)',
        roleToEn: 'Transmission System Operator (SONATREL)',
        phase: 'Raccordement & Essais',
        dataExchangedFr: 'Spectre d\'émission harmonique des ponts redresseurs (H5, H7, H11, H13) et calculs d\'ondes de tension aux points de livraison.',
        dataExchangedEn: 'Harmonic emission spectra of industrial rectifiers (H5, H7, H11, H13) and point-of-common-coupling (PCC) voltage distortion studies.',
        decisionFr: 'Dimensionnement d\'un filtre harmonique actif ou de compensateurs statiques de réactif (SVC / STATCOM).',
        decisionEn: 'Design and commissioning of active harmonic filters and static Var compensators (SVC / STATCOM).',
        impactFr: 'Respect des gabarits du Code de Réseau national et suppression des résonances avec les transformateurs de transport.',
        impactEn: 'Ensures utility Grid Code compliance, preventing resonance with transmission capacitors and neighboring substations.'
      }
    ],

    internationalCase: {
      location: 'Complexe Sidérurgique & Laminoir ArcelorMittal de Gand (Belgique)',
      titleFr: 'Électrification Haute Performance d\'un Train de Laminage à Chaud (150 MVA)',
      titleEn: 'High-Performance Electrification of Hot Strip Steel Mill (150 MVA)',
      capacity: '150 MVA de transformateurs de procédé · Variateurs cyclo-convertisseurs 20 MW',
      highlightsFr: 'Alimentation sous 150 kV avec jeux de barres blindés doubles, 14 variateurs moyenne tension pour cages de laminoir, compensation réactive ultra-rapide par STATCOM 100 Mvar pour éliminer les à-coups de couple et le flicker réseau.',
      highlightsEn: '150 kV dual-busbar supply, 14 medium-voltage drives powering rolling mill stands, ultra-fast 100 Mvar STATCOM dynamic compensation mitigating severe load-pulse flicker on the regional grid.'
    },

    cameroonCase: {
      assetLocation: 'Complexe Métallurgique d\'ALUCAM (Aluminium du Cameroun) & SOCATRAL – Edéa',
      titleFr: 'Alimentation Électro-Intensive des Cuves d\'Électrolyse d\'Edéa (200+ MW)',
      titleEn: 'Heavy Industrial Electrolysis Potline Power Supply at Edea (200+ MW)',
      notesFr: 'ALUCAM est le plus gros consommateur industriel d\'électricité d\'Afrique Centrale, historiquement raccordé directement à la centrale hydroélectrique d\'Edéa. L\'installation comprend d\'immenses transformateurs-redresseurs fournissant un courant continu supérieur à 100 000 A pour les séries de cuves d\'électrolyse Hall-Héroult, nécessitant une gestion rigoureuse des harmoniques et des jeux de barres magnétiques massifs.',
      notesEn: 'ALUCAM represents Central Africa\'s largest industrial electricity consumer, historically connected directly to the Edea Hydro Station. The facility utilizes massive transformer-rectifier units delivering over 100,000 A DC to Hall-Heroult electrolysis potlines, demanding world-class harmonic filtration and magnetic field shielding.'
    },

    relatedDomains: [
      {
        code: 'D04',
        nameFr: 'Postes Électriques',
        nameEn: 'Substations & Switchyards',
        relationshipFr: 'Fournit le poste d\'interconnexion source privé HTB/HTA (90/15 kV) et les disjoncteurs généraux.',
        relationshipEn: 'Supplies the private industrial HV/MV interconnection substation and main feeder breakers.'
      },
      {
        code: 'D06',
        nameFr: 'Installations Électriques & BT',
        nameEn: 'Electrical Installations & LV',
        relationshipFr: 'Définit les règles de filerie BT, régimes de neutre industriels (TNS/IT) et tableaux de distribution secondaire.',
        relationshipEn: 'Defines LV cabling, industrial earthing schemes (TNS/IT), and secondary distribution boards.'
      },
      {
        code: 'D07',
        nameFr: 'Machines Électriques & Entraînements',
        nameEn: 'Electrical Machines & Drives',
        relationshipFr: 'Fournit les moteurs asynchrones et synchrones commandés par les tiroirs MCC et variateurs VFD.',
        relationshipEn: 'Provides the physical induction and synchronous motors driven by MCC drawers and VFDs.'
      },
      {
        code: 'D14',
        nameFr: 'Qualité d\'Énergie & Harmoniques',
        nameEn: 'Power Quality & EMC',
        relationshipFr: 'Analyse et filtre les harmoniques injectés par les variateurs de fréquence et fours à arc industriels.',
        relationshipEn: 'Analyzes and filters harmonic pollution injected by variable frequency drives and industrial arc furnaces.'
      },
      {
        code: 'D16',
        nameFr: 'Sécurité Électrique, Terre & Foudre',
        nameEn: 'Electrical Safety & Earthing',
        relationshipFr: 'Régit les règles de sécurité en atmosphères explosives ATEX, équipotentialité et ceinturage de terre.',
        relationshipEn: 'Governs ATEX hazardous area safety protocols, equipotential bonding, and low-impedance ground grids.'
      }
    ]
  },

  // DOMAIN 09: RENEWABLE ENERGY & DISTRIBUTED ENERGY RESOURCES (DER)
  D09: {
    domainCode: 'D09',
    titleFr: 'Énergies Renouvelables, Solaire PV, Éolien & Réseaux Décentralisés (EnR & DER)',
    titleEn: 'Renewable Energy, Solar PV, Wind & Distributed Energy Resources (DER)',
    summaryFr: 'Ce domaine couvre l\'ingénierie et l\'intégration réseau des centrales de production renouvelable intermittente : parcs solaires photovoltaïques au sol (Utility-Scale PV), toitures industrielles, aérogénérateurs éoliens terrestres (Onshore) et marins (Offshore), micro-réseaux hybrides (PV-Diesel-BESS) et générateurs basés sur onduleurs (IBR - Inverter-Based Resources). Il régit le suivi du point de puissance maximale (MPPT), l\'architecture du réseau collecteur HTA (20 kV à 33 kV), la conformité aux exigences de tenue aux creux de tension (LVRT/FRT), le support de tension dynamique Q(U) et l\'apport d\'inertie synthétique (Grid-Forming).',
    summaryEn: 'Focuses on power engineering and grid integration for variable renewable energy: utility-scale solar PV farms, commercial rooftops, onshore/offshore wind turbines, hybrid microgrids (PV-Diesel-BESS) and Inverter-Based Resources (IBR). Governs Maximum Power Point Tracking (MPPT), MV collector circuits (20 kV to 33 kV), Low-Voltage Ride-Through (LVRT/FRT) grid-code compliance, dynamic reactive voltage support Q(U), and synthetic inertia provision (Grid-Forming).',
    voltageRange: '600 V – 1500 V DC / 690 V AC / 20 kV – 33 kV HTA / 90 kV – 225 kV HTB',
    primaryStandard: 'CEI 62109 / CEI 61727 / IEEE 1547 / CEI 61400 / EN 50549',
    inputsFr: 'Rayonnement solaire direct et diffus G (W/m²) sur cellules photovoltaïques semi-conductrices / Énergie cinétique du vent v (m/s) captée par les pales de rotor',
    inputsEn: 'Direct and diffuse solar irradiance G (W/m²) on photovoltaic cells / Kinetic wind energy v (m/s) swept by aerofoil rotor blades',
    coreTransformFr: 'Effet photoélectrique générant un courant continu DC, hachage MPPT, ondulation DC/AC triphasée MLI/IGBT (690 V) et élévation de tension vers réseau collecteur HTA (33 kV)',
    coreTransformEn: 'Photoelectric effect generating DC current, MPPT tracking, three-phase PWM IGBT DC/AC inversion (690 V), and step-up to MV collector grid (33 kV)',
    outputsFr: 'Puissance active décarbonée P (MW), soutien dynamique en puissance réactive Q (Mvar), capacité de lissage et réserve de fréquence rapide (FFR)',
    outputsEn: 'Decarbonized active power P (MW), dynamic reactive voltage support Q (Mvar), ramping curtailment, and Fast Frequency Response (FFR)',
    faultClearingTime: '60 ms – 150 ms (Maintien de connexion LVRT imposé)',

    architectureStages: [
      {
        tag: 'GÉNÉRATEURS PRIMAIRES DC / ÉOLIEN',
        nameFr: '1. Champ Photovoltaïque & Turbines Éoliennes',
        nameEn: '1. PV Array Field & Wind Turbine Generators',
        descFr: 'Modules solaires bifaciaux N-Type TOPCon montés sur trackers mono-axe horizontaux à 1500 V DC, ou aérogénérateurs directs multipolaires à aimants permanents (PMSG 4-6 MW).',
        descEn: 'Bifacial N-Type TOPCon PV modules on single-axis horizontal trackers (1500 V DC), or direct-drive permanent magnet synchronous wind turbines (PMSG 4-6 MW).',
        parameter: 'Tension DC Chaîne Voc / Vmpp',
        nominalValue: '1500 V DC (Bifacial TOPCon)'
      },
      {
        tag: 'STATIONS D\'ONDULATION HTA',
        nameFr: '2. Postes de Conversion & Onduleurs Skid HTA',
        nameEn: '2. MV Power Skid Stations & Central Inverters',
        descFr: 'Stations préfabriquées compactes (MV Power Skid 3.125 MVA à 6.25 MVA) intégrant onduleurs MLI/IGBT 3 niveaux, transformateur élévateur 690 V / 33 kV et cellules RMU.',
        descEn: 'Compact turnkey skids (3.125 MVA to 6.25 MVA) housing three-level PWM/IGBT inverters, 690 V / 33 kV step-up transformers, and SF6-insulated RMU switchgear.',
        parameter: 'Rendement de Conversion Onduleur',
        nominalValue: '99.0% (Euro efficiency)'
      },
      {
        tag: 'RÉSEAU COLLECTEUR HTA (33 kV)',
        nameFr: '3. Réseau d\'Interconnexion Souterrain HTA',
        nameEn: '3. MV Underground Collector Cable Grid (33 kV)',
        descFr: 'Boucles ouvertes ou radiales en câbles unipolaires aluminium XLPE 33 kV reliant les différents skids de champ vers le jeu de barres HTA du poste de livraison.',
        descEn: 'Open-loop or radial circuits of 33 kV single-core aluminum XLPE cables routing power from field skids to the central evacuation substation.',
        parameter: 'Pertes Ohmiques Collecteur',
        nominalValue: '< 1.2% à P_crête'
      },
      {
        tag: 'POSTE SOURCE & CONTRÔLEUR PPC',
        nameFr: '4. Poste d\'Évacuation HTB & Contrôleur PPC',
        nameEn: '4. Evacuation Substation & Power Plant Controller (PPC)',
        descFr: 'Poste élévateur 33/90 kV ou 33/225 kV avec régulateur de centrale PPC temps réel (cycle 20 ms), disjoncteur général, et bancs de filtrage harmonique STATCOM.',
        descEn: 'Step-up 33/90 kV or 33/225 kV substation equipped with real-time Power Plant Controller (PPC - 20 ms cycle), main breaker, and STATCOM harmonic filters.',
        parameter: 'Temps de Réponse PPC Régulation Q(U)',
        nominalValue: '< 200 ms (Conformité Grid Code)'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur : Production Solaire PV Utilité & Soutien Réseau Réactif (Q-U)',
      titleEn: 'Simulator: Utility-Scale Solar PV Output & Dynamic Reactive Support (Q-U)',
      descFr: 'Ajustez la puissance crête installée du parc solaire (MWp) pour évaluer la production active crête injectée, la réserve de puissance réactive dynamique pour le soutien de tension (Mvar), et la production annuelle d\'énergie verte.',
      descEn: 'Adjust installed solar PV peak capacity (MWp) to compute injected peak active power, dynamic reactive headroom for voltage stabilization (Mvar), and annual green energy generation.',
      paramName: 'Puissance Crête Installée P_dc',
      unit: 'MWp',
      min: 5,
      max: 100,
      step: 5,
      initialValue: 30,
      calculate: (pDc: number) => {
        const pr = 0.82; // Performance Ratio typique zone sahélienne/tropicale
        const pAc = pDc * pr; // MW
        const sInv = pDc * 0.95; // MVA onduleurs surdimensionnés (DC/AC ratio ~ 1.05-1.1)
        const qMax = Math.sqrt(Math.max(0, sInv * sInv - pAc * pAc)); // Mvar dispo
        const specificYieldKwhPerKwp = 1850; // kWh/kWp/an (Extrême-Nord Cameroun / Maroua-Guider)
        const annualGwh = (pDc * specificYieldKwhPerKwp) / 1000;
        const co2SavedTons = annualGwh * 720; // 720 tCO2/GWh par rapport au thermique diesel

        return [
          {
            labelFr: 'Puissance Active AC Injectée P_ac',
            labelEn: 'Injected Active Power P_ac',
            value: pAc.toFixed(1),
            unit: 'MW',
            statusFr: `PR = ${(pr * 100).toFixed(0)}% (Pertes thermiques & DC/AC déduites)`,
            statusEn: `PR = ${(pr * 100).toFixed(0)}% (Thermal derating & cabling accounted)`
          },
          {
            labelFr: 'Réserve Réactive Dynamique Q_max',
            labelEn: 'Dynamic Reactive Headroom Q_max',
            value: qMax.toFixed(1),
            unit: 'Mvar',
            statusFr: 'Disponible pour régulation Q(U) et maintien LVRT',
            statusEn: 'Available for Q(U) voltage support & LVRT ride-through'
          },
          {
            labelFr: 'Énergie Annuelle Produite',
            labelEn: 'Annual Green Energy Output',
            value: annualGwh.toFixed(1),
            unit: 'GWh/an',
            statusFr: `Évite ~${(co2SavedTons / 1000).toFixed(1)} kt de CO2 / an vs Diesel`,
            statusEn: `Offsets ~${(co2SavedTons / 1000).toFixed(1)} kt of CO2 / yr vs Diesel`
          }
        ];
      }
    },

    equipmentList: [
      {
        tag: 'INV-CENTRAL-3MVA',
        nameFr: 'Onduleur Central Solaire Haute Tension 1500 V DC (3.125 MVA Skid)',
        nameEn: 'Central Utility Solar Inverter 1500 V DC (3.125 MVA Skid)',
        category: 'Électronique de Puissance & Conversion',
        standard: 'CEI 62109-1/2 / IEEE 1547',
        roleFr: 'Convertit l\'énergie continue générée par les chaînes de modules solaires 1500 V en courant alternatif sinusoïdal 690 V triphasé avec suivi MPPT ultra-rapide et soutien dynamique de tension.',
        roleEn: 'Transforms 1500 V DC power from solar string arrays into 690 V three-phase AC sinusoidal waveform with ultra-fast MPPT and dynamic grid voltage support.',
        workingPrincipleFr: 'Pont de puissance à 3 niveaux (topologie NPC ou ANPC) à base de modules IGBT/SiC commutant à haute fréquence (2.5 kHz - 4 kHz). Commande vectorielle en repère dq avec boucle interne de courant à réponse sub-milliseconde. Fonction "Q at Night" pour compenser la tension réseau sans irradiation.',
        workingPrincipleEn: 'Three-level NPC/ANPC bridge topology using advanced IGBT/SiC modules switching at 2.5 - 4 kHz. Vector dq-frame current control with sub-millisecond loop response. Native "Q at Night" feature enabling reactive voltage support in darkness.',
        componentsFr: [
          'Armoire d\'entrée DC avec sectionneurs motorisés et fusibles gPV 1500 V',
          'Pont de puissance IGBT 3 niveaux avec dissipateurs à caloducs ou liquide',
          'Filtre de sortie LC/LCL atténuant les harmoniques de commutation',
          'Unité de contrôle à double DSP + FPGA pour algorithme MPPT et synchronisation PLL',
          'Système de détection de défaut d\'isolement DC (Riso) et parafoudres Type 1+2'
        ],
        componentsEn: [
          'DC input bay with motorized disconnectors and 1500 V gPV fuses',
          'Three-level IGBT power modules with heat-pipe or liquid cooling blocks',
          'Output LC/LCL sine filter suppressing high-frequency PWM switching ripple',
          'Dual DSP + FPGA control boards for MPPT algorithms and fast PLL grid sync',
          'DC insulation monitoring device (IMD) and Type 1+2 surge arresters'
        ],
        ratings: [
          { labelFr: 'Tension DC assignée max', labelEn: 'Max rated DC voltage', value: '1500', unit: 'V' },
          { labelFr: 'Puissance apparente assignée', labelEn: 'Rated apparent power', value: '3125', unit: 'kVA' },
          { labelFr: 'Tension AC assignée sortie', labelEn: 'Rated output AC voltage', value: '690', unit: 'V' },
          { labelFr: 'Rendement maximal CEC', labelEn: 'Peak efficiency', value: '99.02', unit: '%' }
        ],
        failureModesFr: 'Claquer de semi-conducteur IGBT sous surtension transitoire; dérive de capacité des condensateurs film du bus DC; déclenchement intempestif sur défaut d\'isolement DC par humidité matinale.',
        failureModesEn: 'IGBT transistor breakdown under line lightning surges; DC-link film capacitor capacitance decay; morning insulation resistance trip triggered by heavy condensation.',
        epedeEquipmentId: 'eq-inv-solar-01'
      },
      {
        tag: 'WIND-TURBINE-PMSG',
        nameFr: 'Aérogénérateur Synchrone à Aimants Permanents (PMSG Direct-Drive 4.5 MW)',
        nameEn: 'Direct-Drive Permanent Magnet Synchronous Wind Turbine (PMSG 4.5 MW)',
        category: 'Génération Éolienne & Aérodynamique',
        standard: 'CEI 61400-1 / CEI 61400-21',
        roleFr: 'Capte l\'énergie aérodynamique du vent et la transforme en puissance électrique à vitesse variable sans boîte de vitesses mécanique, avec découplage complet vis-à-vis du réseau par convertisseur 100%.',
        roleEn: 'Harnesses aerodynamic wind kinetic energy into variable-frequency electric power without mechanical gearbox (Direct-Drive), fully decoupled from the grid via a 100% full-scale converter.',
        workingPrincipleFr: 'Les 3 pales orientables (Pitch Control) entraînent directement le rotor multipolaire à aimants permanents Néodyme-Fer-Bore (NdFeB). La tension alternative à fréquence variable produite (5 à 25 Hz) est redressée en continu (DC), puis ondulée par un convertisseur MLI dos-à-dos (Back-to-Back) synchronisé à 50 Hz.',
        workingPrincipleEn: 'Three variable-pitch blades drive a high-pole-count rotor embedded with NdFeB permanent magnets. Variable-frequency AC (5 to 25 Hz) is rectified to DC and inverted by a full-scale back-to-back IGBT converter tightly locked to the 50 Hz grid.',
        componentsFr: [
          'Rotor tripale en fibre de verre/carbone avec capteurs de contrainte optique',
          'Système d\'orientation active des pales (Pitch) par motoréducteurs électriques et accumulateurs',
          'Génératrice synchrone annulaire multipolaire à refroidissement direct',
          'Convertisseur de puissance pleine échelle 100% (Back-to-Back 690 V)',
          'Transformateur élévateur de nacelle 690 V / 33 kV à huile diélectrique biodégradable'
        ],
        componentsEn: [
          'Three-bladed fiberglass/carbon rotor with embedded optical fiber strain gauges',
          'Individual electric pitch drive mechanisms backed up by ultracapacitors',
          'Direct-drive annular multipole generator with direct liquid cooling',
          '100% full-scale four-quadrant back-to-back IGBT converter',
          'Nacelle-mounted step-up transformer 690 V / 33 kV with ester biodegradable liquid'
        ],
        ratings: [
          { labelFr: 'Puissance nominale mécanique', labelEn: 'Rated nominal capacity', value: '4.5', unit: 'MW' },
          { labelFr: 'Diamètre du rotor balayé', labelEn: 'Rotor diameter', value: '155', unit: 'm' },
          { labelFr: 'Vitesse de coupure de sécurité', labelEn: 'Cut-out wind speed', value: '25', unit: 'm/s' },
          { labelFr: 'Hauteur de mât au moyeu', labelEn: 'Hub height', value: '120', unit: 'm' }
        ],
        failureModesFr: 'Démagnétisation thermique partielle des aimants permanents du rotor; défaillance du roulement principal de palier d\'arbre; avarie de servomoteur de pitch sous rafale extrême.',
        failureModesEn: 'Thermal demagnetization of rotor permanent magnets; main shaft bearing pitting; blade pitch actuator motor drive fault during severe wind gusts.',
        epedeEquipmentId: 'eq-wind-pmsg-01'
      },
      {
        tag: 'PPC-CONTROLLER',
        nameFr: 'Contrôleur Centralisé de Parc Énergétique (Power Plant Controller - PPC)',
        nameEn: 'Power Plant Controller (PPC) & Grid-Code Manager',
        category: 'Supervision & Régulation Réseau Temps Réel',
        standard: 'CEI 61400-25 / IEEE 2800 / EN 50549-2',
        roleFr: 'Agit comme le chef d\'orchestre temps réel de la centrale pour assurer la conformité absolue aux exigences du Code de Réseau au point de livraison commun (PCC) : régulation de tension Q(U), participation au réglage fréquence P(f), rampes de puissance et maintien lors des creux de tension (LVRT).',
        roleEn: 'Serves as the master real-time controller guaranteeing strict Grid Code compliance at the Point of Common Coupling (PCC): Q(U) voltage regulation, P(f) primary frequency support, active power ramp-rate limiting, and LVRT coordination.',
        workingPrincipleFr: 'Acquiert en continu les tensions et courants au point de livraison via des transformateurs de mesure de classe 0.2s. Calcule en cycle déterministe (10 à 20 ms) les écarts par rapport aux consignes de l\'opérateur de réseau (SONATREL) et dispatche instantanément les points de consigne P et Q à tous les onduleurs de champ via liaisons fibre optique Ethernet déterministes.',
        workingPrincipleEn: 'Samples voltage and current phasors at the PCC from 0.2s class CT/VTs. Executes deterministic control loops (10 to 20 ms) to compute deviation against TSO dispatch setpoints, distributing P and Q commands to all distributed inverters via industrial deterministic fiber optical networks.',
        componentsFr: [
          'Calculateur industriel durci redondant en miroir chaud (Hot-Standby)',
          'Module d\'acquisition de mesures synchronisées synchrophaseurs PMU (IEEE C37.118)',
          'Module d\'algorithme de statisme fréquence-puissance P(f) et régulation de tension Q(U)',
          'Passerelle de téléconduite normalisée CEI 60870-5-104 vers dispatching national',
          'Enregistreur perturbographique haute résolution pour audits de conformité de réseau'
        ],
        componentsEn: [
          'Dual redundant industrial controller in hot-standby configuration',
          'Fast PMU synchrophasor acquisition module compliant with IEEE C37.118',
          'Configurable droop logic engine for P(f) frequency response and Q(U) voltage control',
          'Telecontrol gateway running IEC 60870-5-104 / DNP3 to National Dispatching',
          'High-speed disturbance recorder for post-contingency grid-code compliance audits'
        ],
        ratings: [
          { labelFr: 'Temps de cycle déterministe', labelEn: 'Deterministic execution cycle', value: '10 – 20', unit: 'ms' },
          { labelFr: 'Temps de réponse en boucle fermée', labelEn: 'Closed-loop response time', value: '< 200', unit: 'ms' },
          { labelFr: 'Protocole de téléconduite TSO', labelEn: 'Utility protocol', value: 'CEI 60870-5-104', unit: '' },
          { labelFr: 'Disponibilité du système', labelEn: 'System availability', value: '99.99', unit: '%' }
        ],
        failureModesFr: 'Perte de communication avec les onduleurs de champ provoquant le repli en consigne locale de sécurité; dérive d\'étalonnage des TC de mesure faussant le calcul de puissance réactive.',
        failureModesEn: 'Fieldbus communication loss with inverters triggering fail-safe autonomous fallback; instrument transformer calibration drift corrupting reactive power calculation.',
        epedeEquipmentId: 'eq-ppc-controller-01'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 27/59',
        nameFr: 'Protection à Minimum / Maximum de Tension Réseau (UV/OV)',
        nameEn: 'Undervoltage & Overvoltage Protection',
        standard: 'CEI 60255-127 / IEEE 1547',
        principleFr: 'Surveille la tension phase-phase et phase-terre au point de livraison. Doit discriminer un creux de tension transitoire à traverser (LVRT) d\'une perte définitive du réseau électrique nécessitant l\'ouverture immédiate.',
        principleEn: 'Monitors line-to-line and phase-to-ground voltage at PCC. Discriminates temporary transient sags requiring LVRT ride-through from permanent grid collapse requiring immediate islanding trip.',
        typicalSetting: 'UV1: U < 0.85 Un (t = 2.0 s) ; UV2: U < 0.50 Un (t = 0.3 s) ; OV1: U > 1.10 Un (t = 1.0 s) ; OV2: U > 1.20 Un (t = 100 ms).'
      },
      {
        ansiCode: 'ANSI 81U/81O',
        nameFr: 'Protection à Minimum / Maximum de Fréquence (UF/OF)',
        nameEn: 'Underfrequency & Overfrequency Protection',
        standard: 'CEI 60255-181 / EN 50549-2',
        principleFr: 'Détecte les déséquilibres offre-demande sur le réseau national. Doit assurer une réduction linéaire de puissance active en surfréquence (mode P(f) au-delà de 50.2 Hz) et maintenir l\'injection en sous-fréquence jusqu\'à 47.5 Hz.',
        principleEn: 'Monitors national generation-demand imbalances. Executes active power curtailment during overfrequency (P(f) mode above 50.2 Hz at 40% Pn/Hz) and sustains full output during underfrequency down to 47.5 Hz.',
        typicalSetting: 'UF: f < 47.5 Hz (t = 0.2 s) ; OF: f > 51.5 Hz (t = 0.1 s) ; Statisme P(f) : 2% à 5% réglable.'
      },
      {
        ansiCode: 'ANSI 78 / 81R',
        nameFr: 'Protection Anti-Îlotage & Dérivée de Fréquence (ROCOF df/dt)',
        nameEn: 'Anti-Islanding & Rate of Change of Frequency (ROCOF)',
        standard: 'IEEE 1547-2018 / CEI 62116',
        principleFr: 'Détecte la séparation du parc d\'avec le réseau public interconnecté afin d\'empêcher la formation d\'un îlot non maîtrisé dangereux pour les techniciens et les réenclencheurs automatiques.',
        principleEn: 'Detects islanding condition when utility circuit breaker opens, preventing uncoordinated energized islanding that endangers field maintenance personnel and damages equipment during auto-reclose.',
        typicalSetting: 'Seuil ROCOF df/dt = 1.5 Hz/s à 2.5 Hz/s mesuré sur une fenêtre glissante de 500 ms; Saut de phase Vector Shift = 6° à 12°.'
      },
      {
        ansiCode: 'ANSI 67N',
        nameFr: 'Protection Directionnelle de Terre sur Réseau Collecteur HTA',
        nameEn: 'Directional Earth Fault on MV Collector Circuits',
        standard: 'CEI 60255-151',
        principleFr: 'Indispensable sur les câbles 33 kV en nappe souterraine qui génèrent un fort courant capacitif homopolaire permanent, afin d\'isoler uniquement le départ en défaut sans couper l\'ensemble de la centrale.',
        principleEn: 'Vital on extensive 33 kV underground cable networks with high zero-sequence shunt capacitance, to trip only the faulted collector feeder while keeping unaffected feeders online.',
        typicalSetting: 'Angle caractéristique RCA = -45° à -90°, seuil I0 = 10 A à 30 A temporisé t = 200 ms.'
      },
      {
        ansiCode: 'ANSI 25',
        nameFr: 'Contrôle de Synchronisme & Autorisation de Couplage',
        nameEn: 'Synchrocheck & Automatic Paralleling Relay',
        standard: 'CEI 60255-118',
        principleFr: 'Vérifie avant fermeture du disjoncteur général HTB que la différence d\'amplitude de tension (ΔU), de fréquence (Δf) et l\'écart d\'angle de phase (Δθ) se situent dans des tolérances strictes.',
        principleEn: 'Verifies before closing main evacuation circuit breaker that voltage amplitude difference (ΔU), slip frequency (Δf), and phase angle deviation (Δθ) are within tight limits.',
        typicalSetting: 'ΔU < 5% Un, Δf < 0.1 Hz, Δθ < 10°, temps de confirmation t = 500 ms.'
      }
    ],

    faultSequence: [
      {
        time: 't = 0 ms',
        eventFr: 'Défaut court-circuit biphasé-terre sur ligne de transport 225 kV à proximité',
        eventEn: 'Phase-to-phase-to-ground fault on neighboring 225 kV transmission line',
        detailFr: 'La tension au point de raccordement commun (PCC) chute instantanément à 30% de sa valeur nominale.',
        detailEn: 'Grid voltage at the Point of Common Coupling (PCC) plummets to 30% of nominal rating.'
      },
      {
        time: 't = 15 ms',
        eventFr: 'Détection du creux de tension et basculement automatique en mode LVRT',
        eventEn: 'Voltage dip detection and automatic transition to LVRT ride-through mode',
        detailFr: 'Les onduleurs détectent le creux selon la courbe normalisée CEI/Grid Code et verrouillent le déclenchement de protection sous-tension 27.',
        detailEn: 'Inverters detect sag per Grid Code ride-through profile and inhibit instantaneous undervoltage 27 tripping.'
      },
      {
        time: 't = 35 ms',
        eventFr: 'Injection prioritaire de courant réactif capacitif dynamique Iq',
        eventEn: 'Priority injection of dynamic reactive capacitive current Iq',
        detailFr: 'Les convertisseurs IGBT injectent un courant réactif Iq = 2.0 × (1 - U/Un) × In pour soutenir la tension du réseau et aider les protections de ligne.',
        detailEn: 'Inverters ramp up reactive current Iq = 2.0 × (1 - U/Un) × In to bolster grid voltage and facilitate line protection operation.'
      },
      {
        time: 't = 100 ms',
        eventFr: 'Élimination du court-circuit par les protections différentielles de ligne TSO',
        eventEn: 'Fault cleared by utility transmission line differential protection relays',
        detailFr: 'Le disjoncteur 225 kV défaillant s\'ouvre; la tension au PCC remonte brutalement à 95% de sa valeur nominale.',
        detailEn: 'The faulted 225 kV line breaker trips; bus voltage at PCC instantly recovers to 95% of nominal value.'
      },
      {
        time: 't = 450 ms',
        eventFr: 'Restauration contrôlée de la puissance active P nominale avec rampe limitée',
        eventEn: 'Controlled active power recovery ramp back to pre-fault generation setpoint',
        detailFr: 'Le contrôleur PPC pilote la remontée d\'injection active à un gradient de 20% Pn/s, évitant tout choc de couple ou à-coup de fréquence sur le réseau.',
        detailEn: 'PPC smoothly ramps active power at 20% Pn/s, preventing dynamic frequency swings or torsional stress on grid turbogenerators.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Irradiation Solaire Globale Inclinée (GTI) & Température Cellule',
        nameEn: 'Global Tilted Irradiance (GTI) & Back-of-Module Temperature',
        sensorFr: 'Pyranomètres secondaires Classe A (ISO 9060) calibrés et sondes platine PT1000',
        sensorEn: 'ISO 9060 Class A thermopile pyranometers and calibrated PT1000 RTD surface probes',
        rate: '1 Hz',
        protocol: 'Modbus-RTU / RS-485'
      },
      {
        nameFr: 'Synchrophaseurs de Tension & Fréquence au Point de Livraison (PMU)',
        nameEn: 'PCC Voltage & Frequency Synchrophasors (PMU Phasor Measurement)',
        sensorFr: 'Unité de mesure de phaseurs PMU conforme IEEE C37.118 synchronisée GPS/PTP',
        sensorEn: 'GPS/PTP time-synchronized PMU device complying with IEEE C37.118 standard',
        rate: '50 trames/s (50 Hz)',
        protocol: 'IEEE C37.118 / TCP'
      },
      {
        nameFr: 'Résistance d\'Isolement des Boucles DC (Contrôleur Permanent d\'Isolement)',
        nameEn: 'DC Array Insulation Resistance (Continuous Ground Insulation Monitor)',
        sensorFr: 'Contrôleur permanent d\'isolement (CPI/IMD) mesurant la fuite galvanique entre pôles DC et terre',
        sensorEn: 'Active DC insulation monitoring device (IMD) measuring galvanic leakage to ground',
        rate: '0.1 Hz',
        protocol: 'Modbus-TCP'
      },
      {
        nameFr: 'Puissance Active P, Réactive Q et Facteur de Puissance au PCC',
        nameEn: 'Active Power P, Reactive Power Q and Power Factor at Utility PCC',
        sensorFr: 'Centrale de mesure et compteur transactionnel 4 quadrants de classe de précision 0.2s',
        sensorEn: 'Revenue-grade class 0.2s four-quadrant bidirectional power meter',
        rate: '10 cycles (200 ms)',
        protocol: 'CEI 61850 MMS / Modbus-TCP'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Cellule Semi-Conducteur)',
        nameFr: 'Modulation MLI & Protection Matérielle Désaturation IGBT',
        nameEn: 'PWM Modulation & Hardware IGBT Desaturation Protection',
        descFr: 'Cartes de commande de grille (Gate Drivers) avec extinction douce (Soft Turn-off) en moins de 3 µs sur court-circuit franc.',
        descEn: 'Gate driver optocoupler boards with soft turn-off shutdown in under 3 µs upon Vce desaturation short-circuit detection.',
        response: '< 3 µs'
      },
      {
        level: 'Niveau 1 (Onduleur / Éolienne)',
        nameFr: 'Boucles Rapides de Courant dq & Algorithme MPPT',
        nameEn: 'Fast dq Current Loops & MPPT Algorithm Execution',
        descFr: 'Processeurs de signal numérique (DSP) et FPGA calculant la transformation de Park, le suivi de point de puissance maximale et la synchronisation PLL.',
        descEn: 'Digital signal processors (DSP) and FPGA executing Park transforms, MPPT hill-climbing algorithms, and phase-locked loop (PLL) tracking.',
        response: '100 µs – 1 ms'
      },
      {
        level: 'Niveau 2 (Centrale de Production)',
        nameFr: 'Power Plant Controller (PPC) & Régulation de Tension de Parc',
        nameEn: 'Power Plant Controller (PPC) & Coordinated Farm Regulation',
        descFr: 'Automate temps réel coordonnant tous les onduleurs pour maintenir la consigne de tension au point de livraison commun et gérer les rampes de charge.',
        descEn: 'Master industrial PLC coordinating inverters to fulfill voltage setpoint at the PCC and enforcing active power curtailment ramps.',
        response: '20 ms – 100 ms'
      },
      {
        level: 'Niveau 3 (Dispatching TSO)',
        nameFr: 'Téléconduite EMS / SCADA Réseau & Dispatching National',
        nameEn: 'National Grid EMS / SCADA & Dispatching Remote Control',
        descFr: 'Le centre de conduite SONATREL envoie les ordres de consigne de production active P et réactive Q par protocole CEI 60870-5-104.',
        descEn: 'National Dispatching Center sends AGC power setpoints and reactive power schedules via IEC 60870-5-104 telecontrol links.',
        response: '1 s – 5 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Études Réseau & Intégration EnR',
        roleFromEn: 'Grid Studies & DER Integration Engineer',
        roleToFr: 'Gestionnaire de Réseau de Transport (SONATREL)',
        roleToEn: 'Transmission System Operator (SONATREL)',
        phase: 'Étude d\'Impact Réseau (Grid Impact Study)',
        dataExchangedFr: 'Modèle dynamique RMS et EMT de la centrale (fichiers PSS/E ou DIgSILENT PowerFactory), études de court-circuit, creux de tension LVRT et harmonicité.',
        dataExchangedEn: 'Dynamic RMS and EMT simulation models of the plant (PSS/E or DIgSILENT PowerFactory), short-circuit levels, LVRT curves, and harmonic resonance studies.',
        decisionFr: 'Validation du raccordement au réseau 225 kV, définition des consignes de statisme P(f) et approbation du gabarit P-Q.',
        decisionEn: 'Approval of 225 kV connection agreement, definition of frequency droop parameters, and validation of P-Q capability envelope.',
        impactFr: 'Garantit la stabilité dynamique du réseau national et élimine tout risque de décrochage en cascade lors des perturbations.',
        impactEn: 'Guarantees bulk grid dynamic stability and prevents cascade tripping during transmission contingencies.'
      },
      {
        roleFromFr: 'Ingénieur Concepteur Solaire / Éolien',
        roleFromEn: 'Solar PV & Wind Plant Design Engineer',
        roleToFr: 'Ingénieur Génie Civil & Structures',
        roleToEn: 'Civil & Structural Design Engineer',
        phase: 'Conception Détaillée (FEED)',
        dataExchangedFr: 'Plans d\'implantation des trackers solaires, charges au vent cycloniques, efforts d\'arrachement des pieux battus et résistance géotechnique.',
        dataExchangedEn: 'PV tracker array layouts, cyclonic wind speed loading, structural pile pull-out forces, and geotechnical soil resistivity.',
        decisionFr: 'Choix de la profondeur d\'enfoncement des profilés acier zingué Magnelis et calibrage du mécanisme de mise en sécurité tempête (Stow Position).',
        decisionEn: 'Selection of pile embedment depth, Magnelis anti-corrosion coating, and automated hurricane storm-stow angle positioning.',
        impactFr: 'Assure la pérennité mécanique des installations face aux tornades tropicales et tempêtes de poussière.',
        impactEn: 'Ensures mechanical survival of tracker arrays during tropical storm events and dust squalls.'
      },
      {
        roleFromFr: 'Ingénieur Essais & Mise en Service (Commissioning)',
        roleFromEn: 'Commissioning & Compliance Testing Engineer',
        roleToFr: 'Ingénieur Protection & Contrôle-Commande',
        roleToEn: 'Protection & Substation Automation Engineer',
        phase: 'Essais de Réception & Raccordement',
        dataExchangedFr: 'Rapports d\'essais d\'injection de courant LVRT, enregistrements perturbographiques des gradins de puissance réactive et temps de réponse PPC.',
        dataExchangedEn: 'Test reports from LVRT mobile test containers, disturbance recordings of dynamic reactive step responses, and PPC closed-loop response logs.',
        decisionFr: 'Attestation de conformité au Code de Réseau et autorisation formelle d\'injection commerciale sur le réseau interconnecté.',
        decisionEn: 'Issuance of formal Grid Code Compliance Certificate and commercial operational notification.',
        impactFr: 'Condition légale obligatoire pour la mise en service industrielle et l\'activation du contrat d\'achat d\'électricité (PPA).',
        impactEn: 'Mandatory statutory milestone allowing commercial energization and Power Purchase Agreement (PPA) billing.'
      }
    ],

    internationalCase: {
      location: 'Complexe Solaire Noor Ouarzazate (Maroc)',
      titleFr: 'Le Plus Grand Complexe Solaire Multi-Technologies au Monde (580 MW)',
      titleEn: 'World\'s Largest Multi-Technology Solar Power Complex (580 MW)',
      capacity: '580 MW · Solaire PV + CSP Miroirs Paraboliques & Tour avec 7h de stockage thermique',
      highlightsFr: 'Combinaison innovante de photovoltaïque et de solaire thermodynamique à concentration (CSP), permettant une production continue de jour comme de nuit grâce à des réservoirs de stockage d\'énergie par sels fondus, avec évacuation 225 kV vers le réseau ONEE.',
      highlightsEn: 'Pioneering blend of solar PV and Concentrated Solar Power (CSP parabolic troughs and central tower), supplying continuous base-load power day and night via molten salt thermal storage, evacuated into Morocco\'s 225 kV grid.'
    },

    cameroonCase: {
      assetLocation: 'Centrales Solaires Photovoltaïques de Maroua & Guider (Extrême-Nord Cameroun)',
      titleFr: 'Pionnières de l\'Énergie Solaire Utilité au Cameroun (30 MWp / 40 GWh/an)',
      titleEn: 'First Utility-Scale Solar PV Projects in Cameroon (30 MWp / 40 GWh/yr)',
      notesFr: 'Mises en service en 2022-2023 pour stabiliser d\'urgence le Réseau Interconnecté Nord (RIN) victime des pénuries hydrauliques du barrage de Lagdo. Elles totalisent plus de 80 000 modules monocristallins avec onduleurs de chaîne et permettent d\'économiser des dizaines de millions de litres de gasoil autrefois brûlés par les centrales thermiques diesel de renfort de Maroua et Djamboutou.',
      notesEn: 'Commissioned in 2022-2023 to provide urgent grid reinforcement to the Northern Interconnected Grid (RIN) during hydrologic deficits at Lagdo hydro dam. Featuring over 80,000 monocrystalline modules with string inverters, they offset tens of millions of liters of costly diesel fuel formerly consumed by emergency thermal generator stations in Maroua and Djamboutou.'
    },

    relatedDomains: [
      {
        code: 'D01',
        nameFr: 'Production d\'Énergie',
        nameEn: 'Power Generation',
        relationshipFr: 'Partage l\'équilibrage offre-demande et la compensation de l\'intermittence par l\'hydroélectricité de modulation.',
        relationshipEn: 'Shares system supply-demand balancing and compensation of solar intermittency via flexible hydro plants.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques',
        nameEn: 'Substations & Switchyards',
        relationshipFr: 'Reçoit l\'énergie des câbles collecteurs 33 kV et l\'élève à 90 kV ou 225 kV par le transformateur élévateur de parc.',
        relationshipEn: 'Receives bulk 33 kV collector power and steps it up to 90 kV / 225 kV via the main evacuation transformer.'
      },
      {
        code: 'D10',
        nameFr: 'Stockage d\'Énergie & BESS',
        nameEn: 'Energy Storage & Charging',
        relationshipFr: 'Fournit le stockage électrochimique par batteries pour le lissage de production, l\'arbitrage et la réserve rapide FFR.',
        relationshipEn: 'Provides utility battery storage (BESS) for solar smoothing, energy arbitrage, and Fast Frequency Response (FFR).'
      },
      {
        code: 'D11',
        nameFr: 'Protection & Études de Réseau',
        nameEn: 'Protection & System Studies',
        relationshipFr: 'Coordonne les relais de protection de découplage (ANSI 27/59, 81U/O, 78) et les études de court-circuit avec faible apport IBR.',
        relationshipEn: 'Coordinates grid anti-islanding relays (27/59, 81U/O, 78) and low short-circuit current studies typical of inverters.'
      },
      {
        code: 'D14',
        nameFr: 'Qualité d\'Énergie & Harmoniques',
        nameEn: 'Power Quality & EMC',
        relationshipFr: 'Surveille et filtre les harmoniques de commutation haute fréquence (2 kHz - 10 kHz) émises par les onduleurs.',
        relationshipEn: 'Monitors and mitigates high-frequency PWM switching harmonics (2 kHz - 10 kHz) generated by solar inverters.'
      }
    ]
  },

  D10: {
    domainCode: 'D10',
    titleFr: 'Stockage d\'Énergie BESS, Convertisseurs PCS Réversibles & Infrastructures IRVE',
    titleEn: 'Utility-Scale BESS, Bidirectional PCS Inverters & EV Charging Infrastructure',
    summaryFr: 'Ingénierie des systèmes conteneurisés de stockage électrochimique (BESS LFP 1500 V DC), convertisseurs 4 quadrants réversibles en contrôle Grid-Forming, gestion de charge thermique et stations de recharge ultra-rapide DC (350 kW) pour la résilience et la décarbonation du réseau.',
    summaryEn: 'Engineering of containerized utility-scale electrochemical storage (1500 V DC LFP BESS), 4-quadrant bidirectional inverters in Grid-Forming control, thermal runaway safety management, and 350 kW ultra-fast DC EV charging hubs.',
    voltageRange: 'DC: 950 V – 1 500 V DC | AC: 690 V (Skid PCS) / 33 kV HTA | IRVE: 150 V – 1 000 V DC / 500 A',
    primaryStandard: 'CEI 62933-5-2 / NFPA 855 / IEEE 2800-2022 / ISO 15118',
    inputsFr: 'Énergie électrique excédentaire renouvelable (PV/Éolien) ou puissance de soutirage réseau 33 kV lors des creux de charge.',
    inputsEn: 'Surplus renewable generation (Solar/Wind) or off-peak grid power drawn via 33 kV substation transformers.',
    coreTransformFr: 'Conversion électrochimique réversible (Charge/Décharge LiFePO4) pilotée par PCS 4 quadrants avec contrôle de source de tension virtuelle (VSG).',
    coreTransformEn: 'Reversible electrochemical energy storage (LiFePO4 charge/discharge) driven by 4-quadrant PCS inverters under Virtual Synchronous Generator (VSG) control.',
    outputsFr: 'Puissance active réversible P (FFR < 120 ms, arbitrage, peak shaving) et puissance réactive dynamique Q (soutien de tension sans impact SoC).',
    outputsEn: 'Bidirectional active power P (Fast Frequency Response < 120 ms, arbitrage, peak shaving) and independent dynamic reactive power Q.',
    faultClearingTime: '< 10 ms (Coupure fusible pyrotechnique DC) / < 40 ms (Inhibition IGBT PCS) / < 100 ms (Disjoncteur 33 kV)',

    architectureStages: [
      {
        tag: 'CELL-LFP',
        nameFr: 'Cellules & Modules Électrochimiques LFP',
        nameEn: 'LFP Electrochemical Cells & Modules',
        descFr: 'Cellules prismatiques Lithium-Fer-Phosphate (LiFePO4) 3.2 V 280 Ah assemblées en série/parallèle avec surveillance unitaire de tension et température par cartes BMU esclaves.',
        descEn: 'Prismatic Lithium Iron Phosphate (LiFePO4) 3.2 V 280 Ah cells assembled in series/parallel strings with cell-level voltage and temperature monitoring by slave BMUs.',
        parameter: 'Densité volumique & Chimie',
        nominalValue: '3.2 V nom. / 280 Ah / LFP (Stabilité > 270°C)'
      },
      {
        tag: 'RACK-1500V',
        nameFr: 'Racks Batteries Haute Tension & Master BMS',
        nameEn: 'High-Voltage 1500V Battery Racks & Master BMS',
        descFr: 'Armoires 1500 V DC regroupant 416 à 480 cellules en série (215 à 250 kWh/rack), équipées de contacteurs DC, fusibles ultra-rapides 100 kA, et système d\'extinction locale Novec/Aérosol.',
        descEn: '1500 V DC enclosures housing 416-480 series cells (215-250 kWh/rack), high-voltage DC contactors, 100 kA fast fuses, and local aerosol/clean agent fire protection.',
        parameter: 'Tension de chaîne DC & Énergie',
        nominalValue: '1 331 V DC nominal (1 160 – 1 490 V DC) · 215 kWh'
      },
      {
        tag: 'PCS-CONVERT',
        nameFr: 'Convertisseur Réversible Bidirectionnel PCS',
        nameEn: 'Bidirectional Power Conversion System (PCS)',
        descFr: 'Ponts de conversion IGBT/SiC 4 quadrants réversibles avec filtre LCL, capables d\'opérer en mode Grid-Forming (source de tension virtuelle) ou Grid-Following avec régulation active de cos phi.',
        descEn: 'Four-quadrant reversible IGBT/SiC bridges with LCL output filtering, capable of Grid-Forming (virtual voltage source) and Grid-Following modes with dynamic PF control.',
        parameter: 'Puissance & Temps de réponse',
        nominalValue: '2 500 kVA @ 690 V AC · Temps de montée < 40 ms'
      },
      {
        tag: 'MV-SKID',
        nameFr: 'Skid Élévateur HTA & Cellule RMU 33 kV',
        nameEn: 'MV Step-Up Skid & 33 kV RMU Switchgear',
        descFr: 'Transformateur à huile végétale ou sec 690 V / 33 kV couplé à une cellule de protection HTA sous enveloppe métallique avec relais de protection multifonction et disjoncteur à vide.',
        descEn: 'Eco-fluid or dry-type 690 V / 33 kV step-up transformer connected to a vacuum circuit breaker RMU switchgear bay with feeder protection relay.',
        parameter: 'Tension d\'injection & Coupure',
        nominalValue: '33 kV ±10% · I_sc assigné = 25 kA / 3s'
      },
      {
        tag: 'EMS-CONTROLLER',
        nameFr: 'Système de Gestion d\'Énergie (EMS) & Interface IRVE',
        nameEn: 'Energy Management System (EMS) & EV Charging Hub',
        descFr: 'Superviseur temps réel coordonnant le State-of-Charge (SoC), le State-of-Health (SoH), le dispatching AGC de SONATREL et l\'allocation dynamique de puissance aux bornes IRVE 350 kW.',
        descEn: 'Real-time master controller orchestrating SoC/SoH balancing, TSO automatic generation control (AGC), and dynamic load management for 350 kW EV fast chargers.',
        parameter: 'Algorithme & Communication',
        nominalValue: 'Cycle 10 ms · IEC 60870-5-104 / OCPP 2.0.1 / ISO 15118'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur BESS : Dispatch de Puissance, FFR & État de Charge (SoC)',
      titleEn: 'BESS Power Dispatch, Fast Frequency Response & State of Charge Simulator',
      descFr: 'Ajustez la consigne de puissance active P (-50 MW charge à +50 MW décharge) et observez la réponse inertielle FFR automatique, le rendement global AC-AC et l\'évolution du SoC.',
      descEn: 'Adjust active power setpoint P (-50 MW charge to +50 MW discharge) and observe synthetic FFR response, system round-trip efficiency (RTE), and hourly SoC trajectory.',
      paramName: 'Puissance Consigne BESS (MW)',
      unit: 'MW',
      min: -50,
      max: 50,
      step: 5,
      initialValue: 25,
      calculate: (pMw: number) => {
        const nominalCapacityMWh = 100;
        const baseRTE = 0.885;
        const pAbs = Math.abs(pMw);
        const cRate = pAbs / 50; // 50 MW max
        
        // Auxiliary consumption (cooling pumps, HVAC, BMS electronics)
        const auxLossKw = 150 + pAbs * 12; // kW
        const auxLossMw = auxLossKw / 1000;
        
        // Dynamic round-trip efficiency accounting for C-rate I²R losses
        const dynamicRte = Math.max(0.80, Math.min(0.92, baseRTE - (cRate * 0.045)));
        
        // Frequency response headroom (MW available for 120 ms FFR injection)
        const ffrHeadroomMw = pMw > 0 ? Math.max(0, 50 - pMw) : 50;
        
        // Hourly SoC delta from 60% baseline
        const energyDeltaMWh = pMw > 0 ? (pMw + auxLossMw) : (pMw * dynamicRte);
        const deltaSoCPercent = (energyDeltaMWh / nominalCapacityMWh) * 100;
        const resultingSoC = Math.max(10, Math.min(95, 60 - deltaSoCPercent));

        // Battery cell temperature estimation under liquid cooling
        const cellTempC = 25 + (pAbs / 50) * 11.5;

        return [
          {
            labelFr: 'Régime d\'Exploitation',
            labelEn: 'Operating Mode',
            value: pMw > 0 ? `Décharge Réseau (+${pMw} MW)` : pMw < 0 ? `Charge / Soutirage (${pMw} MW)` : 'Veille Active (Floating)',
            unit: '',
            statusFr: pMw > 0 ? 'Injection active pour soutien du pic RIN' : pMw < 0 ? 'Absorption de surplus solaire' : 'Réserve tournante disponible',
            statusEn: pMw > 0 ? 'Discharging to cover RIN peak load' : pMw < 0 ? 'Charging surplus solar energy' : 'Standby spinning reserve'
          },
          {
            labelFr: 'État de Charge Estimé après 1h',
            labelEn: 'Projected SoC after 1 Hour',
            value: resultingSoC.toFixed(1),
            unit: '%',
            statusFr: resultingSoC > 20 && resultingSoC < 90 ? 'Zone de sécurité optimale (Longévité maximale)' : 'Proche des limites d\'exploitation BESS',
            statusEn: resultingSoC > 20 && resultingSoC < 90 ? 'Optimal battery longevity zone' : 'Near operational boundary limits'
          },
          {
            labelFr: 'Réserve FFR Disponible (< 120 ms)',
            labelEn: 'Fast Frequency Response Headroom',
            value: ffrHeadroomMw.toFixed(1),
            unit: 'MW',
            statusFr: 'Prêt pour injection instantanée sur déclenchement de ligne',
            statusEn: 'Available for instantaneous frequency dip support'
          },
          {
            labelFr: 'Rendement AC-AC Global (RTE)',
            labelEn: 'Round-Trip AC-AC Efficiency',
            value: (dynamicRte * 100).toFixed(1),
            unit: '%',
            statusFr: `Pertes d'auxiliaires thermiques incluses : ${auxLossKw.toFixed(0)} kW`,
            statusEn: `Includes chiller and BMS auxiliary load: ${auxLossKw.toFixed(0)} kW`
          },
          {
            labelFr: 'Température Moyenne Cellules LFP',
            labelEn: 'Average LFP Cell Temperature',
            value: cellTempC.toFixed(1),
            unit: '°C',
            statusFr: cellTempC < 38 ? 'Régulation thermique liquide nominale' : 'Débit de pompage liquide maximum requis',
            statusEn: cellTempC < 38 ? 'Nominal liquid cooling performance' : 'Max chiller pumping speed engaged'
          }
        ];
      }
    },

    equipmentList: [
      {
        tag: 'BESS-50MW',
        nameFr: 'Système Conteneurisé BESS 50 MW / 100 MWh (LFP)',
        nameEn: 'Utility-Scale BESS Container System 50 MW / 100 MWh',
        category: 'Stockage Électrochimique',
        standard: 'CEI 62933-5-2 / NFPA 855',
        roleFr: 'Fournit la réserve primaire FFR, le lissage des intermittences solaires et le soutien de tension sur le Réseau Interconnecté Nord.',
        roleEn: 'Delivers fast frequency response (FFR), solar ramp smoothing, and dynamic voltage support for Northern Interconnected Grid.',
        workingPrincipleFr: 'Regroupement de modules LiFePO4 avec convertisseurs PCS bidirectionnels 4 quadrants et système de gestion thermique liquide en boucle fermée.',
        workingPrincipleEn: 'LiFePO4 modular container array with 4-quadrant bidirectional PCS inverters and closed-loop liquid thermal cooling system.',
        componentsFr: ['Racks LFP 1500 V DC', 'BMU / Master BMS', 'Système liquide eau-glycol', 'Détecteurs multigaz H2/CO', 'Extinction gaz inerte / Novec'],
        componentsEn: ['1500 V DC LFP Racks', 'BMU / Master BMS', 'Water-glycol chiller loop', 'H2/CO early off-gas sensors', 'Inert gas fire suppression'],
        ratings: [
          { labelFr: 'Puissance Nominale', labelEn: 'Rated Power', value: '50', unit: 'MW' },
          { labelFr: 'Capacité Utile', labelEn: 'Usable Energy', value: '100', unit: 'MWh' },
          { labelFr: 'Taux de Décharge', labelEn: 'C-Rate', value: '0.5C (2h)', unit: '' },
          { labelFr: 'Temps de Réponse FFR', labelEn: 'FFR Response Time', value: '< 120', unit: 'ms' }
        ],
        failureModesFr: 'Emballement thermique (Thermal Runaway), dérive de tension cellule hors tolérance, fuite de liquide de refroidissement, défaillance contacteur DC.',
        failureModesEn: 'Thermal runaway, excessive cell voltage divergence, cooling loop coolant leak, DC main contactor welding.',
        epedeEquipmentId: 'eq-bess-utility-50mw'
      },
      {
        tag: 'PCS-GRIDFORM',
        nameFr: 'Convertisseur Réversible BESS 2.5 MVA (PCS Grid-Forming)',
        nameEn: 'Grid-Forming Bidirectional PCS Inverter 2.5 MVA',
        category: 'Conversion d\'Énergie Statique',
        standard: 'IEEE 2800-2022 / CEI 62477-1',
        roleFr: 'Convertit l\'énergie continue des batteries en courant alternatif triphasé 690 V en agissant comme source de tension autonome avec inertie synthétique.',
        roleEn: 'Converts DC battery power to 3-phase 690 V AC while synthesizing virtual inertia and autonomous voltage source characteristics.',
        workingPrincipleFr: 'Onduleur/chargeur réversible 4 quadrants à base d\'IGBT haute fréquence avec algorithme de machine synchrone virtuelle (VSG) et réglage droop P(f) / Q(U).',
        workingPrincipleEn: 'Four-quadrant reversible IGBT converter with Virtual Synchronous Generator (VSG) algorithms and fast droop control for P(f) and Q(U).',
        componentsFr: ['Ponts IGBT 3 niveaux NPC', 'Filtre LCL de sortie', 'Contrôleur DSP temps réel', 'Contacteur de précharge DC', 'Échangeur de chaleur liquide'],
        componentsEn: ['3-level NPC IGBT bridges', 'Output LCL sine filter', 'Dual real-time DSP control', 'DC precharge contactor', 'Liquid cold-plate exchanger'],
        ratings: [
          { labelFr: 'Puissance Apparente', labelEn: 'Apparent Power', value: '2 500', unit: 'kVA' },
          { labelFr: 'Tension DC Bus', labelEn: 'DC Voltage Range', value: '950 – 1 500', unit: 'V DC' },
          { labelFr: 'Tension Sortie AC', labelEn: 'Nominal AC Voltage', value: '690', unit: 'V AC' },
          { labelFr: 'Temps d\'Inversion P', labelEn: 'P Inversion Time', value: '< 40', unit: 'ms' }
        ],
        failureModesFr: 'Claquer IGBT par surtension transitoire, saturation du filtre LCL, défaut de synchronisation PLL, déséquilibre thermique des ponts.',
        failureModesEn: 'IGBT breakdown under lightning surge, LCL inductor saturation, PLL unlock during severe phase jump, bridge thermal asymmetry.',
        epedeEquipmentId: 'eq-pcs-grid-forming-01'
      },
      {
        tag: 'RACK-LFP-215K',
        nameFr: 'Rack Batterie LFP 1500 V DC / 215 kWh avec Refroidissement Liquide',
        nameEn: 'High-Voltage LFP Battery Rack 1500 V DC / 215 kWh',
        category: 'Accumulateurs Électrochimiques',
        standard: 'CEI 62619 / UL 9540A',
        roleFr: 'Unité modulaire de base de stockage assurant la conservation d\'énergie et la protection décentralisée au niveau chaîne.',
        roleEn: 'Modular building block storing energy with string-level overcurrent protection, cell balancing, and individual thermal control.',
        workingPrincipleFr: 'Empilement de 416 cellules prismatiques 280Ah avec plaques froides intercalées et contrôleur de rack (High Voltage Box) avec sectionneur DC sous charge.',
        workingPrincipleEn: 'Stack of 416 prismatic 280Ah cells with sandwiched liquid cold plates, slave BMUs, and a High-Voltage Box with load-break DC disconnect.',
        componentsFr: ['Cellules LFP 280Ah', 'BMU Esclave', 'Capteurs de température NTC', 'Fusible pyrotechnique ultra-rapide', 'Plaque froide aluminium'],
        componentsEn: ['280Ah LFP cells', 'Slave BMU board', 'NTC thermal sensors', 'Fast pyrotechnic DC fuse', 'Aluminum liquid cold plate'],
        ratings: [
          { labelFr: 'Capacité Nominale', labelEn: 'Nominal Capacity', value: '215.3', unit: 'kWh' },
          { labelFr: 'Tension Nominale', labelEn: 'Nominal Voltage', value: '1 331.2', unit: 'V DC' },
          { labelFr: 'Cycles de Vie (80% DoD)', labelEn: 'Cycle Life', value: '≥ 6 000', unit: 'cycles' },
          { labelFr: 'Courant Assigné Continu', labelEn: 'Rated Continuous Current', value: '140', unit: 'A (0.5C)' }
        ],
        failureModesFr: 'Micro-court-circuit interne d\'une cellule, dérive de résistance interne, obstruction du canal de refroidissement, défaillance d\'équilibrage passif.',
        failureModesEn: 'Internal cell micro short-circuit, impedance degradation, coolant micro-channel clogging, passive balancing resistor burnout.',
        epedeEquipmentId: 'eq-bess-rack-lfp'
      },
      {
        tag: 'IRVE-350KW',
        nameFr: 'Borne de Recharge Ultra-Rapide DC 350 kW (HPC - High Power Charging)',
        nameEn: 'Ultra-Fast DC EV Charger 350 kW (High Power Charging)',
        category: 'Infrastructures de Recharge VE',
        standard: 'CEI 61851-23 / ISO 15118',
        roleFr: 'Recharge ultra-rapide des véhicules utilitaires, camions et flottes de bus électriques sur les corridors autoroutiers.',
        roleEn: 'Ultra-fast high-power charging for commercial vehicles, electric buses, and passenger EVs on transit corridors.',
        workingPrincipleFr: 'Convertisseurs AC/DC modulaires à base de MOSFETs SiC (carbure de silicium) avec partage dynamique de puissance et connecteur CCS Combo 2 à refroidissement liquide.',
        workingPrincipleEn: 'Modular AC/DC converter matrix using Silicon Carbide (SiC) switches with dynamic power routing and liquid-cooled CCS Combo 2 cables.',
        componentsFr: ['Modules SiC 50 kW', 'Contrôleur SECC (ISO 15118)', 'Câble CCS refroidi liquide', 'Compteur d\'énergie DC certifié MID', 'Modem 4G/OCPP 2.0.1'],
        componentsEn: ['50 kW SiC rectifiers', 'SECC vehicle comms controller', 'Liquid-cooled CCS cable', 'MID-certified DC energy meter', '4G / OCPP 2.0.1 gateway'],
        ratings: [
          { labelFr: 'Puissance Maximale', labelEn: 'Maximum Power', value: '350', unit: 'kW' },
          { labelFr: 'Plage Tension Sortie', labelEn: 'Output Voltage Range', value: '150 – 1 000', unit: 'V DC' },
          { labelFr: 'Courant Maximal', labelEn: 'Max DC Current', value: '500', unit: 'A' },
          { labelFr: 'Rendement de Conversion', labelEn: 'Peak Efficiency', value: '96.5', unit: '%' }
        ],
        failureModesFr: 'Défaillance de la boucle de refroidissement du câble, perte de communication CPL avec le véhicule (HomePlug Green PHY), défaut d\'isolement DC vers la terre.',
        failureModesEn: 'Cable liquid cooling chiller failure, PLC communication breakdown (HomePlug Green PHY), DC-to-ground isolation fault.',
        epedeEquipmentId: 'eq-ev-charger-350kw'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 81U/O',
        nameFr: 'Protection Sous/Sur-Fréquence & Déclencheur FFR Automatique',
        nameEn: 'Under/Over-Frequency & Autonomous FFR Trigger',
        standard: 'CEI 60255-181',
        principleFr: 'Surveille la fréquence du réseau à 50 Hz. Lors d\'une chute de fréquence (f < 49.80 Hz), commande immédiatement l\'injection maximale du PCS en moins de 100 ms sans attendre d\'ordre SCADA.',
        principleEn: 'Monitors 50 Hz grid frequency. On rapid frequency drop (f < 49.80 Hz), instantaneously commands maximum PCS injection within 100 ms prior to SCADA dispatch.',
        typicalSetting: 'Seuil 1: 49.80 Hz (Régulation proportionnelle droop 2%); Seuil 2: 49.00 Hz (Injection pleine puissance 100% t < 60 ms).'
      },
      {
        ansiCode: 'ANSI 76',
        nameFr: 'Protection Surintensité DC & Court-Circuit Rapide Batteries',
        nameEn: 'DC Overcurrent & High-Speed Battery Short-Circuit Protection',
        standard: 'CEI 60255-151 / UL 9540',
        principleFr: 'Détecte les courts-circuits directs sur le bus DC 1500 V en mesurant le courant continu par shunt ou capteur à effet Hall avec déclenchement pyrotechnique pour isoler le rack en défaut.',
        principleEn: 'Detects bolted faults on 1500 V DC bus via Hall-effect or shunt sensors and fires pyrotechnic disconnection in under 5 ms before fuse explosion.',
        typicalSetting: 'Seuil instantané I_dc > 4.0 In_rack (t < 5 ms avec contacteur d\'ouverture rapide sous charge).'
      },
      {
        ansiCode: 'ANSI 49B',
        nameFr: 'Protection Image Thermique Batteries & Détection Emballement',
        nameEn: 'Battery Thermal Replica & Thermal Runaway Early Detection',
        standard: 'NFPA 855 / CEI 62619',
        principleFr: 'Combine les mesures de température de chaque module avec la détection de gaz hors-gazage précurseurs (CO, H2, COV) pour ordonner l\'arrêt immédiat de la charge et déclencher l\'extinction d\'incendie.',
        principleEn: 'Combines multi-point cell temperature tracking with early off-gas sensors (CO, H2, VOC) to trip charging and trigger fire suppression before flaming occurs.',
        typicalSetting: 'Alarme Temp: T > 50°C; Arrêt d\'urgence: T > 60°C ou concentration CO > 50 ppm; Extinction: Détection simultanée fumée + gaz.'
      },
      {
        ansiCode: 'ANSI 27/59',
        nameFr: 'Protection Minimum & Maximum de Tension Réseau (AC Interface)',
        nameEn: 'AC Undervoltage & Overvoltage Protection at Grid Interface',
        standard: 'CEI 60255-127',
        principleFr: 'Surveille la tension au niveau du transformateur de skid 690 V / 33 kV pour assurer la tenue aux creux (LVRT) et isoler le BESS en cas de surtension dangereuse.',
        principleEn: 'Supervises voltage at 690 V / 33 kV skid transformer to enforce LVRT ride-through during network faults while protecting PCS against severe overvoltages.',
        typicalSetting: '27: 0.85 Un temporisé 1.5 s (avec profil LVRT conforme Code Réseau); 59: 1.15 Un temporisé 200 ms.'
      },
      {
        ansiCode: 'ANSI 64R',
        nameFr: 'Surveillance d\'Isolement DC Flottant & Défaut de Terre',
        nameEn: 'DC Bus Ground Fault & Insulation Resistance Monitor',
        standard: 'CEI 61557-8',
        principleFr: 'Injecte un signal de mesure basse fréquence pour mesurer en continu la résistance d\'isolement des pôles positifs et négatifs du bus DC 1500 V par rapport à la terre.',
        principleEn: 'Continuously monitors insulation resistance between positive/negative 1500 V DC poles and earth using active low-frequency pulse injection.',
        typicalSetting: 'Alarme: R_iso < 100 kΩ (ou 100 Ω/V); Déclenchement: R_iso < 20 kΩ temporisé 1 s.'
      }
    ],

    faultSequence: [
      {
        time: 't = 0 ms',
        eventFr: 'Perte brutale de 35 MW de production hydroélectrique sur le Réseau Interconnecté Nord (RIN)',
        eventEn: 'Sudden loss of 35 MW hydroelectric generation on the Northern Interconnected Grid (RIN)',
        detailFr: 'La fréquence du réseau chute brutalement de 50.00 Hz avec un gradient de déclenchement ROCOF élevé (df/dt = -0.45 Hz/s).',
        detailEn: 'System frequency plunges from 50.00 Hz at a steep ROCOF rate of change (df/dt = -0.45 Hz/s).'
      },
      {
        time: 't = 20 ms',
        eventFr: 'Détection du franchissement de seuil de fréquence par l\'IED BESS (ANSI 81U)',
        eventEn: 'Frequency trigger threshold crossed and detected by BESS protection IED (ANSI 81U)',
        detailFr: 'Le relais numérique mesure f = 49.85 Hz et déclenche la consigne prioritaire d\'injection rapide FFR sur le bus CAN/Fibre.',
        detailEn: 'Digital IED records f = 49.85 Hz and commands priority fast frequency injection over high-speed optical CAN bus.'
      },
      {
        time: 't = 65 ms',
        eventFr: 'Montée en puissance des convertisseurs PCS 4 quadrants (Mode Grid-Forming)',
        eventEn: 'PCS four-quadrant inverters ramp up active power under Grid-Forming control',
        detailFr: 'Les 20 skids PCS augmentent leur injection de 0 MW à 45 MW avec une rampe de puissance de 750 MW/s.',
        detailEn: 'All 20 PCS skids accelerate injection from 0 MW to 45 MW at an ultra-fast ramp rate exceeding 750 MW/s.'
      },
      {
        time: 't = 120 ms',
        eventFr: 'Stabilisation du creux de fréquence (Frequency Nadir) à 49.62 Hz',
        eventEn: 'Frequency nadir arrested and stabilized at 49.62 Hz by BESS injection',
        detailFr: 'L\'apport massif de puissance BESS stoppe la chute de fréquence bien avant le seuil de délestage automatique de charge (49.00 Hz).',
        detailEn: 'Massive BESS injection prevents grid collapse and arrests frequency well above automatic load-shedding threshold (49.00 Hz).'
      },
      {
        time: 't = 1 500 ms',
        eventFr: 'Régulation de fréquence stabilisée et amorce de l\'équilibrage tertiaire par le dispatching',
        eventEn: 'Frequency stabilized and tertiary balancing initiated by central grid dispatching',
        detailFr: 'Le dispatching central SONATREL prend le relais en démarrant des groupes thermiques rapides, permettant au BESS de réguler son SoC.',
        detailEn: 'National dispatching starts fast peaker units, allowing BESS to smoothly ramp back down and preserve storage energy margins.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'État de Charge Global (SoC)',
        nameEn: 'System State of Charge (SoC)',
        sensorFr: 'Algorithme hybride OCV + Comptage Coulombmétrique par Shunt précis',
        sensorEn: 'Hybrid OCV lookup + high-precision current integration shunt',
        rate: '100 ms',
        protocol: 'Modbus TCP / IEC 60870-5-104'
      },
      {
        nameFr: 'Tension & Température par Cellule LFP',
        nameEn: 'Cell Voltage & Temperature Telemetry',
        sensorFr: 'Cartes BMU esclaves montées directement sur les barrettes de connexion',
        sensorEn: 'Slave BMU circuit boards mounted on cell interconnect busbars',
        rate: '20 ms',
        protocol: 'Bus CAN 2.0B / Daisy-Chain opto-isolé'
      },
      {
        nameFr: 'Puissance Active & Réactive au Point de Raccordement (PCC)',
        nameEn: 'Active & Reactive Power at PCC (P, Q, cos phi)',
        sensorFr: 'Transducteurs de mesure Classe 0.2s et synchrophaseur PMU',
        sensorEn: 'Class 0.2s measurement transducers and IEEE C37.118 PMU',
        rate: '10 ms',
        protocol: 'IEC 61850 MMS / GOOSE'
      },
      {
        nameFr: 'Concentration Précurseur Gaz d\'Emballement (CO / H2 / VOC)',
        nameEn: 'Thermal Runaway Gas Precursors (CO / H2 / VOC)',
        sensorFr: 'Capteurs optiques NDIR et semiconducteurs d\'ambiance conteneur',
        sensorEn: 'NDIR optical and semiconductor air composition probes inside container',
        rate: '500 ms',
        protocol: 'Boucle 4-20 mA / Modbus RTU'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Cellule & Module)',
        nameFr: 'Protection Matérielle & Équilibrage Cellulaire',
        nameEn: 'Hardware Protection & Cell Balancing',
        descFr: 'Cartes BMU effectuant l\'échantillonnage de chaque cellule, l\'équilibrage passif et le déclenchement pyrotechnique autonome.',
        descEn: 'BMU boards sampling cell metrics, executing passive balancing, and triggering local pyrotechnic disconnection.',
        response: '< 5 ms'
      },
      {
        level: 'Niveau 1 (Rack & PCS)',
        nameFr: 'Régulation Droop 4 Quadrants & Protection DC',
        nameEn: 'Four-Quadrant Droop & DC Protection',
        descFr: 'Contrôleur DSP du convertisseur PCS assurant la boucle interne de courant et le contrôle de source de tension Grid-Forming.',
        descEn: 'PCS DSP firmware running inner current loops, PWM switching, and Grid-Forming synthetic inertia synthesis.',
        response: '10 – 40 ms'
      },
      {
        level: 'Niveau 2 (BESS Master & EMS)',
        nameFr: 'Gestion d\'Énergie de Centrale (EMS)',
        nameEn: 'Plant-Level Energy Management System (EMS)',
        descFr: 'Automate central coordonnant les conteneurs BESS, optimisant le vieillissement des batteries et arbitrant les charges IRVE.',
        descEn: 'Master industrial PLC balancing container SoC, optimizing degradation trajectories, and managing EV charger demand.',
        response: '100 – 500 ms'
      },
      {
        level: 'Niveau 3 (Dispatching TSO)',
        nameFr: 'Téléconduite Réseau National (SCADA SONATREL)',
        nameEn: 'National Transmission Telecontrol (SCADA SONATREL)',
        descFr: 'Ordres de téléréglage AGC, activation de la réserve rapide et planification d\'arbitrage énergétique jour d\'avance.',
        descEn: 'AGC telemetered setpoints, primary/secondary spinning reserve dispatch, and day-ahead wholesale arbitrage orders.',
        response: '1 – 4 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Conception BESS',
        roleFromEn: 'BESS System Design Engineer',
        roleToFr: 'Ingénieur Sécurité & Protection Incendie',
        roleToEn: 'Fire Safety & Explosion Prevention Engineer',
        phase: 'Ingénierie de Base (FEED)',
        dataExchangedFr: 'Modélisation du risque d\'emballement thermique selon NFPA 855 et résultats d\'essais UL 9540A.',
        dataExchangedEn: 'Thermal runaway propagation modeling per NFPA 855 and UL 9540A large-scale fire test reports.',
        decisionFr: 'Choix de la chimie LFP sécuritaire avec séparation physique des conteneurs de 3 mètres et ventilation d\'urgence des gaz.',
        decisionEn: 'Mandated safe LFP chemistry, 3-meter container physical separation, and blast-rated deflagration venting.',
        impactFr: 'Suppression du risque d\'incendie en chaîne et obtention des permis d\'exploitation et d\'assurance.',
        impactEn: 'Eliminates cascade fire propagation and secures regulatory operating approval and utility insurance.'
      },
      {
        roleFromFr: 'Ingénieur Études de Réseau',
        roleFromEn: 'Power Systems Studies Engineer',
        roleToFr: 'Ingénieur Électronique de Puissance PCS',
        roleToEn: 'PCS Power Electronics Engineer',
        phase: 'Études d\'Interconnexion Réseau',
        dataExchangedFr: 'Niveau de court-circuit au PCC (SCR), profil de creux de tension LVRT et exigence de constante d\'inertie synthétique H.',
        dataExchangedEn: 'Short-circuit ratio (SCR) at PCC, LVRT voltage-time envelope, and virtual inertia constant H requirements.',
        decisionFr: 'Configuration du micrologiciel PCS en mode Grid-Forming (source de tension) avec statisme droop de 2% sur la fréquence.',
        decisionEn: 'Configured PCS firmware for Grid-Forming voltage-source mode with 2% active power frequency droop slope.',
        impactFr: 'Garantie de stabilité du RIN lors des déclenchements de la ligne 225 kV Maroua-Guider sans recours au délestage.',
        impactEn: 'Guarantees RIN network dynamic stability during 225 kV line trips without triggering customer load shedding.'
      }
    ],

    internationalCase: {
      location: 'Moss Landing Energy Storage Facility (Californie, USA)',
      titleFr: 'Plus Grand Système BESS du Monde (750 MW / 3 000 MWh)',
      titleEn: 'World\'s Largest Lithium-Ion BESS (750 MW / 3,000 MWh)',
      capacity: '750 MW / 3 000 MWh (4 heures de décharge)',
      highlightsFr: 'Transformation d\'une ancienne centrale thermique au gaz en gigantesque hub de stockage par batteries raccordé au réseau CAISO 500 kV, fournissant l\'équilibrage de la pénétration massive d\'énergie solaire en fin d\'après-midi (atténuation de la courbe du canard).',
      highlightsEn: 'Repurposing a legacy fossil-fueled thermal plant into a massive 500 kV CAISO battery hub, soaking up solar surplus at midday and discharging to mitigate the California Duck Curve.'
    },

    cameroonCase: {
      assetLocation: 'Postes de Garoua & Maroua (Réseau Interconnecté Nord - RIN) & Corridor Douala-Yaoundé',
      titleFr: 'Projet BESS 50 MW / 100 MWh du RIN & Hubs de Recharge Électromobilité',
      titleEn: '50 MW / 100 MWh Northern Grid BESS Project & Highway EV Charging Hubs',
      notesFr: 'Le Réseau Interconnecté Nord (RIN) du Cameroun, alimenté principalement par le barrage hydroélectrique de Lagdo (72 MW) et les centrales solaires de Maroua (15 MWp) et Guider (15 MWp), souffre de fortes instabilités lors de l\'étiage et des passages nuageux. L\'intégration de 50 MW de stockage BESS LFP à Garoua et Maroua assure l\'injection de réserve rapide (FFR < 120 ms) et élimine les délestages de fréquence. En parallèle, le déploiement de bornes IRVE ultra-rapides 350 kW sur la RN3 prépare l\'électrification des transports routiers interurbains.',
      notesEn: 'Cameroon\'s Northern Interconnected Grid (RIN), powered by Lagdo hydro (72 MW) and Maroua/Guider solar parks (30 MWp total), experiences acute frequency volatility during low water levels and cloud transits. Deploying 50 MW / 100 MWh of LFP BESS containers at Garoua and Maroua substations delivers sub-second frequency support, arresting frequency drops without load shedding. Concurrently, 350 kW DC charging hubs along the Douala-Yaoundé corridor establish heavy transport electrification.'
    },

    relatedDomains: [
      {
        code: 'D02',
        nameFr: 'Architecture & Planification du Réseau',
        nameEn: 'Grid Architecture & Planning',
        relationshipFr: 'Fournit la réserve inertielle et la flexibilité dynamique nécessaires pour intégrer plus de 40% d\'énergie renouvelable intermittente.',
        relationshipEn: 'Provides synthetic inertia and dynamic flexibility required to host over 40% intermittent renewable generation.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Haute Tension',
        nameEn: 'Substations & Switchyards',
        relationshipFr: 'Se raccorde aux jeux de barres 33 kV du poste source via des travées dédiées équipées de disjoncteurs à vide et protections différentielles.',
        relationshipEn: 'Connects to 33 kV substation busbars through dedicated bays featuring vacuum breakers and differential protection relays.'
      },
      {
        code: 'D08',
        nameFr: 'Électronique de Puissance & FACTS',
        nameEn: 'Power Electronics & FACTS',
        relationshipFr: 'Partage les technologies de convertisseurs statiques réversibles, filtres harmoniques LCL et lois de commande Grid-Forming.',
        relationshipEn: 'Shares core bi-directional converter topologies, LCL harmonics filtering, and Grid-Forming voltage source control.'
      },
      {
        code: 'D09',
        nameFr: 'Énergies Renouvelables & DER',
        nameEn: 'Renewable Energy & DER',
        relationshipFr: 'Permet le lissage en temps réel de la puissance injectée par les parcs solaires et éoliens et absorbe les excédents pour éviter le bridage (curtailment).',
        relationshipEn: 'Smooths active power ramps from utility solar and wind farms and absorbs generation excess to eliminate grid curtailment.'
      },
      {
        code: 'D12',
        nameFr: 'Systèmes SCADA & Conduite Réseau',
        nameEn: 'SCADA, EMS & Grid Control',
        relationshipFr: 'Reçoit les consignes d\'arbitrage économique et de réglage AGC (fréquence-puissance) depuis le dispatching national de SONATREL.',
        relationshipEn: 'Receives economic arbitrage dispatches and AGC frequency-power control signals from the SONATREL national dispatching center.'
      }
    ]
  },

  D11: {
    domainCode: 'D11',
    titleFr: 'Systèmes de Protection, Relais Numériques & Études de Réseau',
    titleEn: 'Protection Systems, Digital Relays & Power System Studies',
    summaryFr: 'Ingénierie de protection unitaire et de réseau : calculateurs IED numériques multifonctions (ANSI 87, 21, 50/51, 67, 81), coordination des courbes temps-courant (TCC), calculs de court-circuit CEI 60909, architectures de postes numériques CEI 61850 (Station Bus GOOSE/MMS et Process Bus Sampled Values), et sécurité contre les risques d\'arc électrique (IEEE 1584).',
    summaryEn: 'Unit and system protection engineering: numerical multifunction IEDs (ANSI 87, 21, 50/51, 67, 81), time-current coordination (TCC), IEC 60909 short-circuit analysis, IEC 61850 digital substation architectures (GOOSE/MMS and Process Bus Sampled Values), and IEEE 1584 arc flash mitigation.',
    voltageRange: '0.4 kV – 225 kV',
    primaryStandard: 'CEI 60255 / CEI 61850 / CEI 60909',
    inputsFr: 'Courants secondaires TC (1A/5A ou SV 4000 Hz) et tensions secondaires TT (100V/110V ou SV)',
    inputsEn: 'CT secondary currents (1A/5A or 4000 Hz SV) and VT secondary voltages (100V/110V or SV)',
    coreTransformFr: 'Filtrage FFT spectral, calcul d\'impédance R+jX, somme vectorielle différentielle Idiff, et corrélation sélective TCC',
    coreTransformEn: 'FFT spectral filtering, apparent loop impedance R+jX solver, differential vector summation Idiff, and TCC grading',
    outputsFr: 'Ordres de déclenchement ultra-rapides (< 20 ms), trames GOOSE réseau, fichiers Comtrade et signaux de téléaction POTT',
    outputsEn: 'High-speed trip commands (< 20 ms), multicast GOOSE telegrams, Comtrade fault oscillographies, and POTT carrier commands',
    faultClearingTime: '< 65 ms (Relais < 20 ms + Disjoncteur 45 ms)',

    architectureStages: [
      {
        tag: 'MEASURE-TRANS',
        nameFr: 'Transformateurs de Mesure (TC/TT) & Merging Units',
        nameEn: 'Instrument Transformers (CT/VT) & Merging Units',
        descFr: 'Capteurs de courant (TC classe 5P20, PX) et de tension (TT inductifs/capacitifs) avec numérisation en pied d\'appareil par unités de fusion (Merging Units CEI 61869-9) publiant des valeurs échantillonnées (Sampled Values) sur fibre optique.',
        descEn: 'Protection current transformers (5P20, PX) and voltage transformers (CVT) digitized at switchyard kiosks by Process Bus Merging Units (IEC 61869-9) streaming Sampled Values over fiber optics.',
        parameter: 'Précision & Taux d\'échantillonnage',
        nominalValue: 'Classe 5P20 / Kssc ≥ 20 · 80 éch./période (4 000 Hz) PTP < 1 µs'
      },
      {
        tag: 'DIFF-UNIT',
        nameFr: 'Protection Différentielle Unitaire (ANSI 87T, 87G, 87B)',
        nameEn: 'Unit Differential Protection (ANSI 87T, 87G, 87B)',
        descFr: 'Algorithmes à pourcentage stabilisé mesurant la somme vectorielle des courants entrants et sortants pour transformateurs, alternateurs et jeux de barres, avec retenue harmonique 2 (inrush) et harmonique 5 (surfluxage).',
        descEn: 'Percentage-restrained differential algorithms summing branch currents for transformers, generators and busbars with 2nd harmonic (inrush) and 5th harmonic (overexcitation) restraint.',
        parameter: 'Sensibilité & Vitesse de Déclenchement',
        nominalValue: 'Idiff > 0.20 In · Temps de déclenchement < 18 ms'
      },
      {
        tag: 'DIST-LINE',
        nameFr: 'Protection de Distance Multi-Zones (ANSI 21/21N)',
        nameEn: 'Multi-Zone Distance Protection (ANSI 21/21N)',
        descFr: 'Calcul de l\'impédance de boucle phase-phase et phase-terre sur le plan R-X avec caractéristiques quadrilatérales, compensation du facteur de terre k0, antibasculeur de puissance (ANSI 68) et schémas de téléaction POTT.',
        descEn: 'Apparent loop impedance calculation on R-X plane with polygonal/mho zones, residual earth factor k0, Power Swing Blocking (ANSI 68), and POTT teleprotection schemes.',
        parameter: 'Couverture Zone 1 & Temporisation',
        nominalValue: 'Zone 1: 85% de la ligne (t < 20 ms) · Zone 2: 120% (t = 300 ms)'
      },
      {
        tag: 'BACKUP-DIR',
        nameFr: 'Protections Sélectives à Temps Inverse & Directionnelles (51/67N)',
        nameEn: 'Inverse-Time Overcurrent & Directional Ground Backup (51/67N)',
        descFr: 'Courbes à temps inverse normal, très inverse et extrêmement inverse (CEI 60255) coordonnées selon les marges chronométriques (Δt = 250-300 ms) avec discrimination directionnelle avant/arrière.',
        descEn: 'Standard, very inverse and extremely inverse curves (IEC 60255) graded with 250-300 ms time margins with forward/reverse directional polarization.',
        parameter: 'Marges de coordination & Pentes',
        nominalValue: 'IEC Normal Inverse t = (0.14 · TMS) / ((I/Is)^0.02 - 1) · Δt = 280 ms'
      },
      {
        tag: 'DIGITAL-SUB',
        nameFr: 'Réseau Numérique CEI 61850 & Trames GOOSE',
        nameEn: 'IEC 61850 Substation Bus & Fast GOOSE Inter-Tripping',
        descFr: 'Architecture Ethernet optique redondante PRP/HSR reliant les calculateurs de baie aux disjoncteurs, publiant les ordres de déclenchement ultra-rapides (< 2.5 ms) et le verrouillage sélectif logique (LBB / ANSI 50BF).',
        descEn: 'Dual PRP/HSR fiber optic Ethernet linking bay IEDs to breakers, transmitting ultra-fast trip orders (< 2.5 ms) and Breaker Failure backup intertrips (ANSI 50BF).',
        parameter: 'Latence de transmission & Disponibilité',
        nominalValue: 'Trames GOOSE < 2.5 ms · Zéro temps de reconfiguration (PRP)'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur de Coordination TCC & Élimination de Court-Circuit',
      titleEn: 'TCC Selective Coordination & Fault Clearing Time Simulator',
      descFr: 'Ajustez l\'intensité du court-circuit de défaut (1 kA à 35 kA) au point de raccordement et observez l\'action de la protection de distance (Zone 1 / Zone 2), la courbe inverse de secours (ANSI 51) et l\'énergie d\'arc électrique libérée.',
      descEn: 'Adjust the fault short-circuit current (1 kA to 35 kA) and observe distance relay response (Zone 1 / Zone 2), backup inverse overcurrent (ANSI 51), and calculated arc flash incident energy.',
      paramName: 'Courant de Court-Circuit Ik (kA)',
      unit: 'kA',
      min: 1,
      max: 35,
      step: 1,
      initialValue: 12,
      calculate: (ikKa: number) => {
        // Line nominal current In = 1.0 kA (approx 400 MVA at 225 kV)
        const inA = 1000;
        const ifaultA = ikKa * 1000;
        const multiple = ifaultA / inA;

        // Protection Zone 1 (Instantaneous Distance, < 20 ms relay + 40 ms breaker = 60 ms total)
        const isZone1 = multiple >= 3.0;
        const relayTimeMs = isZone1 ? 18 : 300; // Zone 1 vs Zone 2
        const breakerTimeMs = 45; // SF6 puffer breaker
        const totalClearingTimeMs = relayTimeMs + breakerTimeMs;

        // Backup Overcurrent ANSI 51 (IEC Standard Inverse, TMS = 0.15)
        // t = 0.14 * TMS / ( (I/Is)^0.02 - 1 )
        const isSet = 1.2; // 1.2 * In
        const iRatio = Math.max(1.05, multiple / isSet);
        const tms = 0.15;
        const backupTimeSec = (0.14 * tms) / (Math.pow(iRatio, 0.02) - 1);
        const backupTimeMs = Math.min(5000, Math.max(120, Math.round(backupTimeSec * 1000)));

        // Arc Flash Incident Energy (IEEE 1584 simplified approximation at 225 kV switchyard, working distance 2000 mm)
        // E = 4.184 * 10^(k1 + k2*log(Ia) + 0.001*G) * (t / 0.2) * (610 / D)^x
        const arcDurationSec = totalClearingTimeMs / 1000;
        const incidentEnergyCal = (0.12 * Math.pow(ikKa, 0.95) * arcDurationSec * (225 / 15)).toFixed(2);

        // Coordination margin delta-t between primary and backup
        const coordMarginMs = backupTimeMs - totalClearingTimeMs;

        return [
          {
            labelFr: 'Temps de Fonctionnement Protection Principale (ANSI 21/87)',
            labelEn: 'Primary Protection Operating Time (ANSI 21/87)',
            value: `${relayTimeMs} ms`,
            unit: '',
            statusFr: isZone1 ? 'Déclenchement instantané Zone 1 (< 20 ms)' : 'Temporisation sélective Zone 2 (300 ms)',
            statusEn: isZone1 ? 'Instantaneous Zone 1 trip (< 20 ms)' : 'Delayed Zone 2 backup stage (300 ms)'
          },
          {
            labelFr: 'Temps Total d\'Élimination du Défaut (Relais + Disjoncteur SF6)',
            labelEn: 'Total Fault Clearing Time (Relay + SF6 Breaker)',
            value: `${totalClearingTimeMs} ms`,
            unit: '',
            statusFr: totalClearingTimeMs <= 70 ? 'Conforme aux critères de stabilité transitoire SONATREL' : 'Élimination différée (surveillance thermique impérative)',
            statusEn: totalClearingTimeMs <= 70 ? 'Compliant with SONATREL critical clearing time (CCT)' : 'Delayed clearing (thermal stress on conductors)'
          },
          {
            labelFr: 'Temps de Secours Protection Surintensité (ANSI 51)',
            labelEn: 'Backup Inverse Overcurrent Trip Time (ANSI 51)',
            value: `${backupTimeMs} ms`,
            unit: '',
            statusFr: `Courbe CEI Normale Inverse (TMS = ${tms})`,
            statusEn: `IEC Standard Inverse Curve (TMS = ${tms})`
          },
          {
            labelFr: 'Marge Chronométrique de Sélectivité (Δt)',
            labelEn: 'Selective Grading Time Margin (Δt)',
            value: `${coordMarginMs} ms`,
            unit: '',
            statusFr: coordMarginMs >= 250 ? 'Sélectivité chronométrique garantie (Δt ≥ 250 ms)' : 'Risque d\'empiètement ou de déclenchement intempestif',
            statusEn: coordMarginMs >= 250 ? 'Adequate coordination margin (Δt ≥ 250 ms)' : 'Potential grading overlap risk'
          },
          {
            labelFr: 'Énergie d\'Arc Électrique Estimée (IEEE 1584)',
            labelEn: 'Arc Flash Incident Energy (IEEE 1584)',
            value: incidentEnergyCal,
            unit: 'cal/cm²',
            statusFr: parseFloat(incidentEnergyCal) < 8 ? 'Niveau d\'EPI Catégorie 2 suffisant' : 'Habilitation EPI Arc Flash renforcée Catégorie 4 requise',
            statusEn: parseFloat(incidentEnergyCal) < 8 ? 'PPE Category 2 boundary' : 'Specialized Category 4 Arc Flash suit required'
          }
        ];
      }
    },

    equipmentList: [
      {
        tag: 'RELAY-DIFF-87T',
        nameFr: 'Relais Différentiel Numérique Transformateur & Alternateur (ANSI 87T/87G)',
        nameEn: 'Numerical Transformer & Generator Differential Relay (ANSI 87T/87G)',
        category: 'Protection Unitaire Haute Tension',
        standard: 'CEI 60255-187-1 / IEEE C37.91',
        roleFr: 'Assure la protection unitaire instantanée des transformateurs de puissance et alternateurs sans temporisation intentionnelle.',
        roleEn: 'Provides instantaneous unit protection for power transformers and generators against internal winding and core faults.',
        workingPrincipleFr: 'Mesure la différence vectorielle Idiff = |I1 + I2| par rapport au courant de retenue Irest = (|I1| + |I2|)/2 avec filtrage FFT des harmoniques 2 (inrush) et 5 (surfluxage).',
        workingPrincipleEn: 'Measures vector difference Idiff versus restraint current Irest with digital FFT filtering for 2nd (inrush) and 5th (overexcitation) harmonic blocking.',
        componentsFr: ['Double processeur DSP 32 bits', 'Bloc entrées analogiques TC/TT (16 bits)', 'Module Ethernet PRP/HSR', 'Sorties statiques de déclenchement ultra-rapides (IGBT < 1 ms)', 'Enregistreur perturbographique Comtrade'],
        componentsEn: ['Dual 32-bit floating DSPs', '16-bit CT/VT analog module', 'Dual PRP/HSR optical ports', 'Solid-state high-speed trip contacts (< 1 ms)', 'Comtrade fault recorder'],
        ratings: [
          { labelFr: 'Courant Assigné In', labelEn: 'Rated Current In', value: '1 A ou 5 A', unit: '' },
          { labelFr: 'Pente de Retenue K1', labelEn: 'Restraint Slope K1', value: '25', unit: '%' },
          { labelFr: 'Pente Forte K2', labelEn: 'High Slope K2', value: '70', unit: '%' },
          { labelFr: 'Temps de Réponse', labelEn: 'Trip Response Time', value: '< 18', unit: 'ms' }
        ],
        failureModesFr: 'Saturation précoce des TC sur défaut externe traversant avec composante continue apériodique, fausse retenue harmonique sur défaut interne amorcé en onde pleine.',
        failureModesEn: 'Premature CT saturation on external through-fault with high DC offset, misoperation due to harmonic cross-blocking during genuine internal fault.',
        epedeEquipmentId: 'eq-relay-diff-87t'
      },
      {
        tag: 'RELAY-DIST-21',
        nameFr: 'Relais Numérique de Protection de Distance Ligne 225 kV (ANSI 21/21N)',
        nameEn: '225 kV Line Distance Protection Relay (ANSI 21/21N)',
        category: 'Protection de Lignes de Transport',
        standard: 'CEI 60255-121 / IEEE C37.113',
        roleFr: 'Détecte et localise les courts-circuits sur les lignes aériennes de transport 225 kV et 90 kV avec sélectivité spatiale et temporelle.',
        roleEn: 'Detects and locates phase and earth faults along 225 kV and 90 kV transmission lines with stepped distance impedance zones.',
        workingPrincipleFr: 'Calcule l\'impédance apparente Z = V / (I + k0·I0) de la boucle en défaut et vérifie si le point de fonctionnement se situe à l\'intérieur des polygones de déclenchement programmés.',
        workingPrincipleEn: 'Calculates apparent loop impedance Z = V / (I + k0·I0) and checks if the fault impedance vector falls inside programmed quadrilateral or mho zones.',
        componentsFr: ['Module de calcul d\'impédance multi-zones', 'Détecteur de rupture de synchronisme (ANSI 68)', 'Interface de téléaction OPGW (POTT)', 'Automate de réenclenchement monophasé (ANSI 79)', 'Module synchro-coupleur (ANSI 25)'],
        componentsEn: ['Multi-zone impedance calculation engine', 'Power swing blocking logic (ANSI 68)', 'OPGW teleprotection interface (POTT)', 'Single-pole auto-reclosing controller (ANSI 79)', 'Synchrocheck unit (ANSI 25)'],
        ratings: [
          { labelFr: 'Nombre de Zones', labelEn: 'Impedance Zones', value: '5 (réversibles)', unit: '' },
          { labelFr: 'Portée Zone 1', labelEn: 'Zone 1 Reach', value: '85', unit: '% ligne' },
          { labelFr: 'Portée Zone 2', labelEn: 'Zone 2 Reach', value: '120', unit: '% ligne' },
          { labelFr: 'Temps Détection Zone 1', labelEn: 'Zone 1 Speed', value: '< 15', unit: 'ms' }
        ],
        failureModesFr: 'Sous-portance sur défaut résistant avec fort courant de charge opposé, sur-portance due à un réglage erroné de la compensation mutuelle homopolaire (Z0m).',
        failureModesEn: 'Under-reaching on high-resistance earth faults due to remote infeed, over-reaching caused by uncompensated mutual zero-sequence line coupling (Z0m).',
        epedeEquipmentId: 'eq-relay-dist-21'
      },
      {
        tag: 'IED-61850-BCU',
        nameFr: 'Relais Multifonction CEI 61850 & Contrôleur de Baie (IED/BCU)',
        nameEn: 'IEC 61850 Multifunction Protection & Bay Controller (IED/BCU)',
        category: 'Automatisation & Contrôle-Commande',
        standard: 'CEI 61850-7-4 / CEI 60870-5-104',
        roleFr: 'Intègre les fonctions de protection de secours (50/51/67), les automatismes de tranche, l\'interverrouillage logique et la passerelle SCADA.',
        roleEn: 'Combines backup overcurrent protection (50/51/67), bay interlocking automation, synchrocheck, and substation gateway communications.',
        workingPrincipleFr: 'Reçoit les mesures de courant et tension, exécute les équations logiques de sécurité d\'exploitation (LCC), et publie/souscrit des messages réseau GOOSE prioritaires.',
        workingPrincipleEn: 'Processes sampled analog inputs, executes interlocking safety logic, and publishes/subscribes priority GOOSE multicast telegrams across the station bus.',
        componentsFr: ['Unité centrale multi-cœurs durcie', 'Double port optique Ethernet 1000Base-FX', 'Matrice d\'interverrouillage logique', 'Écran graphique IHM couleur avec synoptique', 'Alimentation secourue 110 V / 220 V DC'],
        componentsEn: ['Ruggedized multi-core CPU', 'Dual optical Ethernet 1000Base-FX ports', 'Software interlocking matrix', 'Front-panel color HMI display', 'Redundant 110 V / 220 V DC power supply'],
        ratings: [
          { labelFr: 'Protocole Réseau', labelEn: 'Network Protocol', value: 'CEI 61850 Ed.2', unit: '' },
          { labelFr: 'Temps Publication GOOSE', labelEn: 'GOOSE Latency', value: '< 2.5', unit: 'ms' },
          { labelFr: 'Redondance Réseau', labelEn: 'LAN Redundancy', value: 'PRP / HSR', unit: '' },
          { labelFr: 'Précision Horloge PTP', labelEn: 'PTP Time Accuracy', value: '< 1', unit: 'µs' }
        ],
        failureModesFr: 'Tempête de diffusion sur le réseau Ethernet local (Broadcast Storm), désynchronisation de l\'horloge grand-maître PTP, défaillance de la carte d\'alimentation auxiliaire DC.',
        failureModesEn: 'Ethernet LAN broadcast storm, loss of IEEE 1588 Grandmaster PTP clock lock, auxiliary DC-DC power converter failure.',
        epedeEquipmentId: 'eq-ied-relay-61850'
      },
      {
        tag: 'MERGING-UNIT-SV',
        nameFr: 'Unité de Fusion Process Bus Haute Tension (Merging Unit CEI 61869-9)',
        nameEn: 'High-Voltage Process Bus Merging Unit (IEC 61869-9)',
        category: 'Interface d\'Appareillage de Poste',
        standard: 'CEI 61869-9 / CEI 61850-9-2LE',
        roleFr: 'Numérise les grandeurs analogiques des TC/TT directement dans la cour haute tension pour transmission optique vers les relais de protection.',
        roleEn: 'Digitizes analog CT/VT outputs directly at the outdoor switchyard bay and streams Sampled Values (SV) to protection IEDs via fiber.',
        workingPrincipleFr: 'Convertisseur A/D sigma-delta 24 bits échantillonnant les 4 courants et 4 tensions à 4000 Hz, avec horodatage nanoseconde PTP et publication Ethernet multicast.',
        workingPrincipleEn: '24-bit sigma-delta A/D converter sampling 4 currents and 4 voltages at 4000 Hz with nanosecond PTP hardware timestamping and multicast streaming.',
        componentsFr: ['Convertisseur A/D 24 bits faible bruit', 'Transceiver optique durci', 'Horloge interne asservie PTP IEEE 1588v2', 'Châssis étanche IP67 résistant aux UV', 'Protections CEM contre les chocs de foudre'],
        componentsEn: ['Low-noise 24-bit A/D converters', 'Ruggedized optical transceivers', 'PTP IEEE 1588v2 slave clock', 'IP67 weatherproof outdoor enclosure', 'Extreme EMC surge suppression'],
        ratings: [
          { labelFr: 'Échantillonnage', labelEn: 'Sampling Frequency', value: '4 000', unit: 'Hz (80 éch/p)' },
          { labelFr: 'Résolution A/D', labelEn: 'A/D Resolution', value: '24', unit: 'bits' },
          { labelFr: 'Indice de Protection', labelEn: 'Enclosure Rating', value: 'IP67', unit: '' },
          { labelFr: 'Plage Température', labelEn: 'Operating Temp', value: '-40 à +85', unit: '°C' }
        ],
        failureModesFr: 'Dérive de gain du convertisseur analogique-numérique, perte du signal d\'horloge PTP provoquant l\'invalidation des échantillons (Sample Quality = Invalid), rupture de jarretière optique.',
        failureModesEn: 'A/D gain drift, loss of PTP synchronization resulting in Sample Quality invalid flag, physical outdoor fiber optic patch cord fracture.',
        epedeEquipmentId: 'eq-mu-61869-9'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 87T / 87G / 87B',
        nameFr: 'Protection Différentielle Unitaire (Transformateur, Alternateur, Barres)',
        nameEn: 'Unit Differential Protection (Transformer, Generator, Busbar)',
        standard: 'CEI 60255-187-1 / IEEE C37.91',
        principleFr: 'Compare instantanément la somme vectorielle des courants entrant et sortant de la zone protégée. Déclenche sans temporisation sur Idiff > seuil avec stabilisation par retenue harmonique (H2 inrush, H5 surfluxage).',
        principleEn: 'Vectorially sums currents entering and leaving the bounded zone. Trips instantaneously on differential current while stabilized against inrush and overexcitation using 2nd and 5th harmonic filtering.',
        typicalSetting: 'Seuil de base: Idiff > 0.25 In; Pente 1 = 30%; Pente 2 = 70%; Blocage H2: 15% de H1; Temps < 20 ms.'
      },
      {
        ansiCode: 'ANSI 21 / 21N',
        nameFr: 'Protection de Distance de Ligne Multi-Zones avec Téléaction',
        nameEn: 'Multi-Zone Line Distance Protection with Teleprotection Schemes',
        standard: 'CEI 60255-121 / IEEE C37.113',
        principleFr: 'Mesure l\'impédance apparente de boucle V/I. Zone 1 instantanée pour 85% de la longueur de ligne, Zone 2 temporisée pour couvrir l\'extrémité distante, avec schéma POTT via fibre optique OPGW.',
        principleEn: 'Measures loop apparent impedance V/I. Instantaneous Zone 1 covers 85% of line length; Zone 2 delayed to cover remote bus, accelerated to < 25 ms using POTT scheme over OPGW fiber.',
        typicalSetting: 'Z1 = 0.85 · Z_line (t = 0 s); Z2 = 1.20 · Z_line (t = 300 ms); Z3 = 1.50 · Z_line (t = 600 ms); k0 = (Z0-Z1)/(3·Z1).'
      },
      {
        ansiCode: 'ANSI 50/51 & 50N/51N',
        nameFr: 'Protection Surintensité & Défaut de Terre à Temps Inverse (Phase & Neutre)',
        nameEn: 'Time & Instantaneous Overcurrent / Earth Fault Protection (Phase & Residual)',
        standard: 'CEI 60255-151 / IEEE C37.112',
        principleFr: 'Mesure le courant efficace et déclenche selon une courbe temps-courant inverse (CEI Normale, Très ou Extrêmement Inverse) avec étage instantané (50) pour les défauts proches violents.',
        principleEn: 'Monitors RMS current and trips per inverse-time characteristics (IEC Standard, Very or Extremely Inverse) complemented by high-set instantaneous element (50) for close-in bolted faults.',
        typicalSetting: '51: I > 1.2 In, TMS = 0.15, Courbe CEI Normale Inverse; 50: I >> 5.0 In, t = 30 ms; 51N: I0 > 0.2 In, TMS = 0.20.'
      },
      {
        ansiCode: 'ANSI 67 / 67N',
        nameFr: 'Protection Surintensité Directionnelle (Phase & Terre)',
        nameEn: 'Directional Phase & Earth Fault Overcurrent Protection',
        standard: 'CEI 60255-151',
        principleFr: 'Détermine le sens d\'écoulement du courant de défaut en comparant la phase du courant par rapport à une tension de polarisation (tension directe pour la phase, tension homopolaire V0 pour la terre).',
        principleEn: 'Determines fault direction by comparing fault current phase angle against a polarizing voltage reference (positive sequence for phase, residual voltage V0 for earth faults).',
        typicalSetting: 'Angle caractéristique RCA = +45° (terre) / +30° (phase); Déclenchement verrouillé en direction inverse (Reverse).'
      },
      {
        ansiCode: 'ANSI 81U / 81O & 81R',
        nameFr: 'Protection Fréquencemétrique & Délestage Automatique (UFLS / ROCOF)',
        nameEn: 'Underfrequency Load Shedding (UFLS) & Rate of Change of Frequency (ROCOF)',
        standard: 'CEI 60255-181 / Code Réseau SONATREL',
        principleFr: 'Surveille la fréquence du réseau et son gradient de dérive (df/dt). Déclenche le délestage automatique par gradins de charges prioritaires pour éviter l\'effondrement global du système (Blackout).',
        principleEn: 'Monitors system frequency and rate of change of frequency (df/dt). Automatically sheds feeder blocks in sequential stages to arrest frequency decline and prevent total grid collapse.',
        typicalSetting: 'Gradin 1: 49.20 Hz (t = 150 ms, -10% charge); Gradin 2: 49.00 Hz; Gradin 3: 48.80 Hz; Gradin 4: 48.50 Hz; Seuil îlotage: 47.50 Hz.'
      },
      {
        ansiCode: 'ANSI 50BF',
        nameFr: 'Protection Défaillance Disjoncteur (Breaker Failure Protection - LBB)',
        nameEn: 'Breaker Failure Protection & Local Backup Intertripping (ANSI 50BF)',
        standard: 'CEI 60255-1 / IEEE C37.119',
        principleFr: 'Initialisé lors de tout ordre de déclenchement d\'un relais de protection. Si le courant continue de circuler après l\'expiration d\'une temporisation de sécurité (100-150 ms), ordonne le déclenchement de tous les disjoncteurs adjacents de la barre.',
        principleEn: 'Initiated upon any protection trip command. If fault current persists beyond a critical confirmation window (100-150 ms), issues instantaneous trip to all adjacent breakers on the same busbar.',
        typicalSetting: 'Temporisation BF: t_BF = 120 ms; Seuil de réarmement courant: I < 0.1 In; Déclenchement barres par GOOSE < 3 ms.'
      }
    ],

    faultSequence: [
      {
        time: 't = 0.0 ms',
        eventFr: 'Amorçage d\'un défaut franc monophasé-terre (Phase A - Terre) sur la ligne 225 kV Mangombé – Bekoko',
        eventEn: 'Phase A-to-earth bolted flashover occurs on the 225 kV Mangombé – Bekoko transmission line',
        detailFr: 'Foudroiement direct en milieu de portée (km 42). Le courant de court-circuit grimpe instantanément à 14.8 kA crête.',
        detailEn: 'Direct lightning strike at mid-span (km 42). Short-circuit current surges instantly to 14.8 kA peak.'
      },
      {
        time: 't = 4.2 ms',
        eventFr: 'Numérisation et publication des valeurs échantillonnées (Sampled Values CEI 61869-9)',
        eventEn: 'Sampled Values digitized and broadcasted by yard Merging Unit (IEC 61869-9)',
        detailFr: 'L\'unité de fusion MU en pied de charpente échantillonne le courant à 4 000 Hz et transmet les trames optiques sur le Process Bus.',
        detailEn: 'Switchyard Merging Unit digitizes 4 kHz waveform and streams optical ethernet frames across redundant Process Bus.'
      },
      {
        time: 't = 16.5 ms',
        eventFr: 'Détection et discrimination par l\'IED de distance (ANSI 21/21N)',
        eventEn: 'Impedance locus enters Zone 1 polygon; detected by Distance IED (ANSI 21/21N)',
        detailFr: 'L\'impédance calculée Z_A = 2.4 + j8.1 Ω se situe au cœur de la Zone 1 (couverture 85%). L\'IED valide le déclenchement instantané unipolaire.',
        detailEn: 'Calculated apparent impedance falls deep within Zone 1 boundary. IED initiates high-speed single-pole trip logic.'
      },
      {
        time: 't = 18.0 ms',
        eventFr: 'Publication du télégramme GOOSE de déclenchement haute vitesse (< 2.5 ms)',
        eventEn: 'High-speed GOOSE trip telegram published onto Station Bus (< 2.5 ms)',
        detailFr: 'Ordre de déclenchement transmis par trame GOOSE multicast avec priorité VLAN 802.1Q vers l\'actionneur du disjoncteur 225 kV et amorce du relais 50BF.',
        detailEn: 'Priority 802.1Q tagged GOOSE frame published to 225 kV breaker controller while initiating Breaker Failure timer (ANSI 50BF).'
      },
      {
        time: 't = 22.0 ms',
        eventFr: 'Excitation de la bobine d\'ouverture du disjoncteur SF6 225 kV',
        eventEn: 'Trip coil of 225 kV SF6 circuit breaker energized',
        detailFr: 'Le circuit de commande 110 V DC actionne le mécanisme à ressort du pôle de phase A du disjoncteur SF6.',
        detailEn: '110 V DC trip circuit energizes the spring-operated mechanism of phase A puffer interrupter.'
      },
      {
        time: 't = 62.0 ms',
        eventFr: 'Extinction de l\'arc électrique et coupure complète du courant de défaut (40 ms d\'arc)',
        eventEn: 'Arc extinguished inside SF6 chamber; fault current completely cleared',
        detailFr: 'Soufflage de l\'arc au passage à zéro du courant. La ligne reste en service biphasé sain (Phases B et C maintenues en charge).',
        detailEn: 'Current extinguished at first zero crossing. Healthy phases B and C remain energized, maintaining partial transmission capacity.'
      },
      {
        time: 't = 362.0 ms',
        eventFr: 'Réenclenchement automatique monophasé réussi (ANSI 79)',
        eventEn: 'Successful single-pole auto-reclose cycle completed (ANSI 79)',
        detailFr: 'Après désionisation de l\'air de l\'intervalle de défaut (temps mort 300 ms), le pôle A se referme avec succès sans réamorçage.',
        detailEn: 'Following 300 ms de-ionizing dead time, phase A recloses cleanly without fault recurrence, restoring full three-phase symmetry.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Courant Différentiel Idiff & Courant de Retenue Irest',
        nameEn: 'Differential & Restraint Currents (Idiff / Irest)',
        sensorFr: 'Algorithme numérique de filtrage FFT sur TC classe 5P20',
        sensorEn: 'Digital FFT filtering on 5P20 protection CT secondaries',
        rate: 'Cycle d\'échantillonnage 4 kHz (CEI 61869-9)',
        protocol: 'CEI 61850-9-2LE / Sampled Values'
      },
      {
        nameFr: 'Lieu d\'Impédance Apparente R-X de Ligne',
        nameEn: 'Apparent Loop Impedance Trajectory (R-X Plane)',
        sensorFr: 'Calculateur numérique de boucle phase-terre & phase-phase',
        sensorEn: 'Numerical multi-loop phase-to-earth & phase-to-phase solver',
        rate: 'Calcul récurrent toutes les 2.5 ms',
        protocol: 'CEI 61850 MMS / Comtrade (IEEE C37.111)'
      },
      {
        nameFr: 'Composante Homopolaire 3I0 & Déphasage Angulaire 67N',
        nameEn: 'Residual Zero-Sequence Current (3I0) & Polarizing Angle',
        sensorFr: 'Sommation vectorielle numérique des 3 courants de phase ou tore de tore Tore homopolaire',
        sensorEn: 'Digital vector summation of phase CTs or core-balance toroidal CT',
        rate: 'Continu (temps réel)',
        protocol: 'CEI 61850 GOOSE & MMS'
      },
      {
        nameFr: 'Fréquence Réseau & Gradient ROCOF (df/dt)',
        nameEn: 'System Frequency & Rate of Change of Frequency (ROCOF)',
        sensorFr: 'Détecteur de passage par zéro filtré avec interpolation polynomiale',
        sensorEn: 'Zero-crossing tracking with polynomial interpolation filter',
        rate: '10 ms (mesure glissante sur 4 périodes)',
        protocol: 'CEI 61850-7-410 / IEEE C37.118 (Synchrophasors PMU)'
      },
      {
        nameFr: 'Latence des Trames GOOSE & Synchronisation Temporelle PTP',
        nameEn: 'GOOSE Network Latency & IEEE 1588 PTP Time Deviation',
        sensorFr: 'Horloge matérielle asservie sur récepteur GPS/GNSS grand-maître',
        sensorEn: 'Substation GNSS grandmaster clock with hardware timestamping',
        rate: 'Contrôle continu toutes les 1 s',
        protocol: 'IEEE 1588v2 PTP (Power Profile C37.238) / SNMP'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Process Yard)',
        nameFr: 'Capteurs de Courant/Tension & Unités de Fusion',
        nameEn: 'Instrument Sensors & Merging Units',
        descFr: 'Transformateurs de mesure TC/TT, unités de fusion (Merging Units), bobines de déclenchement disjoncteur et capteurs SF6.',
        descEn: 'Switchyard instrument transformers (CT/VT), Process Bus Merging Units, breaker trip coils, and SF6 density sensors.',
        response: '< 5 ms'
      },
      {
        level: 'Niveau 1 (Bay Protection IEDs)',
        nameFr: 'Calculateurs de Protection Numérique Autonomes',
        nameEn: 'Autonomous Bay Protection IEDs',
        descFr: 'Calculateurs de protection numériques autonomes (87, 21, 50/51, 67, 81) déclenchant en moins de 20 ms sans dépendance de communication externe.',
        descEn: 'Autonomous numerical protection IEDs executing high-speed tripping algorithms within 20 ms independently of external telecom links.',
        response: '< 20 ms'
      },
      {
        level: 'Niveau 2 (Substation Automation & HMI)',
        nameFr: 'Système de Contrôle-Commande Numérique (CCN) & IHM',
        nameEn: 'Substation Automation System & Local HMI',
        descFr: 'Système de Contrôle-Commande Numérique (CCN) de poste, passerelles CEI 61850 MMS, serveur d\'archivage Comtrade et IHM locale de tranche.',
        descEn: 'Substation Automation System (SAS), IEC 61850 MMS station gateways, Comtrade fault record archive, and local substation touch HMI.',
        response: '50 – 200 ms'
      },
      {
        level: 'Niveau 3 (Dispatching National SCADA / EMS)',
        nameFr: 'Téléconduite & Téléaction Réseau (Dispatching SONATREL)',
        nameEn: 'National Transmission Teleaction & Dispatching',
        descFr: 'Centre National de Conduite SONATREL : téléaction POTT sur réseau optique OPGW, coordination des plans de délestage UFLS et téléparamétrage sécurisé.',
        descEn: 'National Dispatching Center (SONATREL): OPGW teleprotection routing, system-wide UFLS coordination, and remote authenticated IED management.',
        response: '1 – 3 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Études de Réseau & Court-Circuit',
        roleFromEn: 'Power System Studies Engineer',
        roleToFr: 'Ingénieur Paramétrage Protections & IED',
        roleToEn: 'Protection Relay Setting Engineer',
        phase: 'Études de Sélectivité & Coordination (TCC)',
        dataExchangedFr: 'Courants de court-circuit max/min (Ik" tri et Ph-T) selon CEI 60909 et impédances de ligne directe et homopolaire (Z1, Z0).',
        dataExchangedEn: 'Max/min fault levels (Ik" 3ph and 1ph-g) per IEC 60909, positive and zero sequence line impedances (Z1, Z0).',
        decisionFr: 'Réglage des seuils de distance Zone 1 (85% Z_line instantané) et facteur de compensation homopolaire k0 = 0.82.',
        decisionEn: 'Programmed Zone 1 reach at 85% of line impedance and calibrated residual earth factor k0 = 0.82.',
        impactFr: 'Élimination instantanée des défauts sans risque de sur-portance hors de la travée protégée.',
        impactEn: 'Instantaneous fault clearing while preventing overreaching beyond protected transmission section.'
      },
      {
        roleFromFr: 'Ingénieur Paramétrage Protections & IED',
        roleFromEn: 'Protection Setting Engineer',
        roleToFr: 'Ingénieur Poste Haute Tension & Appareillage',
        roleToEn: 'Substation Primary Equipment Engineer',
        phase: 'Vérification Non-Saturation des TC (FEED)',
        dataExchangedFr: 'Courant de court-circuit traversant maximal (31.5 kA), constante de temps apériodique Tp (80 ms) et fardeau de filerie Rb.',
        dataExchangedEn: 'Maximum through-fault current (31.5 kA), DC offset time constant Tp (80 ms), and total secondary wiring burden Rb.',
        decisionFr: 'Spécification de transformateurs de courant classe 5P20 avec tension de coude Vk ≥ 450 V.',
        decisionEn: 'Mandated 5P20 CT class with excitation knee-point voltage Vk ≥ 450 V to prevent differential relay blind spots.',
        impactFr: 'Garantie de non-saturation du TC sur défaut externe violent avec composante continue apériodique maximale.',
        impactEn: 'Eliminates CT saturation misoperation during heavy external through-faults with severe DC offset.'
      }
    ],

    internationalCase: {
      location: 'RTE (France) & TenneT (Allemagne)',
      titleFr: 'Généralisation des Postes Numériques CEI 61850 Process Bus & Capteurs Optiques (NCIT)',
      titleEn: 'Large-Scale Rollout of IEC 61850 Process Bus & Optical Sensors (NCIT)',
      capacity: 'Postes THT 400 kV / 225 kV entièrement numérisés',
      highlightsFr: 'Remplacement total des câbles de cuivre de mesure par des unités de fusion (Merging Units) publiant des valeurs échantillonnées (Sampled Values) sur bus optique redondant PRP. Suppression des risques d\'électrocution par ouverture de circuit TC et réduction de 82% du cuivre en caniveaux.',
      highlightsEn: 'Complete replacement of secondary copper wiring with Process Bus Merging Units streaming Sampled Values over dual PRP fiber rings. Eliminates open-circuit CT hazards and cuts trench copper by 82%.'
    },

    cameroonCase: {
      assetLocation: 'Réseau Interconnecté Sud (RIS) - Lignes 225 kV Mangombé-Bekoko & Poste Nachtigal 420 MW',
      titleFr: 'Modernisation du Système de Protection Numérique & Plan de Délestage UFLS par SONATREL',
      titleEn: 'Digital Protection Modernization & National UFLS Load Shedding Scheme by SONATREL',
      notesFr: 'Remplacement des relais électromécaniques par des IED numériques multifonctions CEI 61850 sur l\'axe d\'évacuation Song Loulou – Mangombé – Bekoko et le poste d\'interconnexion 225 kV de Nachtigal (420 MW). Mise en place d\'un automate national de délestage fréquentiel UFLS à 5 gradins rapides (49.2 Hz à 48.5 Hz) évitant l\'effondrement en cascade du réseau national lors des pertes de groupes.',
      notesEn: 'Upgraded legacy relays to IEC 61850 multifunction IEDs along the Song Loulou – Mangombé – Bekoko 225 kV corridor and Nachtigal 420 MW substation. Commissioned a 5-stage automated Underfrequency Load Shedding (UFLS) scheme (49.2 Hz to 48.5 Hz) preventing systemic grid collapse during abrupt generator outages.'
    },

    relatedDomains: [
      {
        code: 'D02',
        nameFr: 'Architecture & Stabilité Réseau',
        nameEn: 'Grid Architecture & Stability',
        relationshipFr: 'Fournit les paramètres de court-circuit (Sk, Ik) et les temps critiques d\'élimination de défaut (CCT) indispensables au réglage des protections.',
        relationshipEn: 'Supplies short-circuit fault levels (Sk, Ik) and critical fault clearing times (CCT) required to calibrate protection algorithms.'
      },
      {
        code: 'D03',
        nameFr: 'Réseaux de Transport HTB',
        nameEn: 'HV Transmission Networks',
        relationshipFr: 'Protège les conducteurs aériens 225 kV contre les défauts de foudre par déclenchement et réenclenchement monophasé automatique (ANSI 79).',
        relationshipEn: 'Protects 225 kV overhead spans from lightning flashovers via single-pole high-speed auto-reclosing (ANSI 79).'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Déclenche les disjoncteurs SF6 ou sous vide et surveille la défaillance disjoncteur (ANSI 50BF) en coordonnant les verrouillages mécaniques et logiques.',
        relationshipEn: 'Trips SF6/vacuum circuit breakers, coordinates breaker failure backup (50BF), and supervises bay interlocks.'
      },
      {
        code: 'D08',
        nameFr: 'Électronique de Puissance & FACTS',
        nameEn: 'Power Electronics & FACTS',
        relationshipFr: 'Prend en compte la faible contribution de court-circuit des onduleurs (IBR) qui complique la détection de surintensité classique.',
        relationshipEn: 'Adapts algorithms to the weak fault currents of Inverter-Based Resources (IBR) which bypass conventional overcurrent elements.'
      },
      {
        code: 'D12',
        nameFr: 'Automatisation & Téléconduite SCADA',
        nameEn: 'Automation, SCADA & Substation Control',
        relationshipFr: 'Transmet les alarmes de protection, événements chronologiques horodatés (SOE) et fichiers Comtrade au SCADA dispatching.',
        relationshipEn: 'Relays protection trip alarms, Sequence of Events (SOE), and Comtrade oscillography files to the central SCADA dispatching.'
      }
    ]
  },

  D12: {
    domainCode: 'D12',
    titleFr: 'Automatisation, Instrumentation & Téléconduite (CCN / SAS / SCADA)',
    titleEn: 'Automation, Instrumentation & Control Systems (SAS / SCADA / RTU)',
    summaryFr: 'Ingénierie du Contrôle-Commande Numérique (CCN) de poste et des systèmes de téléconduite : architectures d\'automatisation de poste (SAS - Substation Automation System), automates programmables industriels (API / BCU), unités terminales distantes (RTU), protocoles téléconduite CEI 60870-5-104 / DNP3, bus de station CEI 61850 MMS / GOOSE, anneaux Ethernet redondants PRP / HSR et cybersécurité OT CEI 62351.',
    summaryEn: 'Substation Automation Systems (SAS) and telemetry control engineering: bay control units (BCU), remote terminal units (RTU), IEC 60870-5-104 / DNP3 telecontrol protocols, IEC 61850 MMS / GOOSE station bus architectures, dual-homed PRP / HSR redundant industrial networks, and IEC 62351 operational technology (OT) cybersecurity.',
    voltageRange: '0.4 kV – 400 kV (Systèmes BT & Réseaux HTB/HTA)',
    primaryStandard: 'CEI 61850 / CEI 60870-5-104 / CEI 62351',
    inputsFr: 'Télémesures analogiques (MW, Mvar, kV, A, Hz), états tout-ou-rien (TS/TCS) et horodatage GPS (IEEE 1588v2 / IRIG-B)',
    inputsEn: 'Analog telemetries (MW, Mvar, kV, A, Hz), digital double-point statuses (TS/TCS), and GPS time tags (IEEE 1588v2 / IRIG-B)',
    coreTransformFr: 'Concentration RTU, logique d\'enclenchement/verrouillage de travée, filtrage anti-rebond, arbitrage de télécommande Select-Before-Operate (SBO)',
    coreTransformEn: 'RTU concentration, bay interlocking logic, anti-chatter debounce filtering, Select-Before-Operate (SBO) telecontrol arbitration',
    outputsFr: 'Télécommandes sécurisées disjoncteurs/sectionneurs, synoptiques SCADA temps réel, archives d\'événements SOE horodatées à 1 ms et flux ICCP dispatching',
    outputsEn: 'Secure breaker/disconnector telecommands, real-time SCADA single-line mimcs, 1 ms SOE event archives, and ICCP/TASE.2 dispatch streams',
    faultClearingTime: '< 100 ms (Acquisition & transmission télécommande SCADA sécurisée)',

    architectureStages: [
      {
        tag: 'BCU-BAY',
        nameFr: 'Niveau Tranche & Contrôleur de Travée (BCU - Bay Control Unit)',
        nameEn: 'Bay Level & Bay Control Unit (BCU)',
        descFr: 'Acquisition des états de position des appareils HT (contacts auxiliaires fin de course de disjoncteurs et sectionneurs), mesures U, I, P, Q locales, gestion des interverrouillages logiques programmés (LCC) et commande locale motorisée de manœuvre.',
        descEn: 'Direct acquisition of high-voltage switchgear auxiliary contacts (breaker and disconnector double-point statuses), local V, I, P, Q transducers, internal programmable interlocking logic, and local bay motorized drive operation.',
        parameter: 'Résolution E/S & Interverrouillage',
        nominalValue: 'E/S 110 V DC isolées optiquement 2.5 kV · Équations booléennes LCC < 5 ms'
      },
      {
        tag: 'STATION-BUS',
        nameFr: 'Réseau Local de Poste & Anneaux Redondants PRP/HSR (Station Bus)',
        nameEn: 'Substation LAN & PRP/HSR Redundant Ethernet Rings (Station Bus)',
        descFr: 'Infrastructure réseau Ethernet industriel durcie (norme CEI 61850-3 / IEEE 1613), sans temps de recouvrement en cas de coupure (zéro perte de paquet selon CEI 62439-3 PRP / HSR), transportant les rapports d\'états MMS et les messages GOOSE de verrouillage inter-travées.',
        descEn: 'Hardened industrial Ethernet infrastructure (IEC 61850-3 / IEEE 1613 compliant) with zero-second recovery time upon fiber breakage (IEC 62439-3 PRP/HSR dual-network), multiplexing MMS reporting and inter-bay interlocking GOOSE.',
        parameter: 'Temps de recouvrement & Débit',
        nominalValue: '0 ms (Bumpless PRP/HSR) · 1 Gbps optique CEI 61850 MMS/GOOSE'
      },
      {
        tag: 'RTU-GATEWAY',
        nameFr: 'Calculateur Central de Poste & Passerelle Téléconduite RTU',
        nameEn: 'Substation Central Controller & Gateway RTU',
        descFr: 'Concentration de l\'ensemble des données de poste, base de données temps réel locale, traitement de la chronologie des événements SOE horodatés à la milliseconde, serveur OPC UA / MMS et passerelle de conversion vers les protocoles de téléconduite CEI 60870-5-104 et DNP3.',
        descEn: 'Aggregates all station IED telemetry and alarms into a local real-time database, sequence of events (SOE) timestamp resolution, OPC UA / MMS server, and dual-telecontrol protocol conversion gateway (IEC 60870-5-104 & DNP3).',
        parameter: 'Horodatage SOE & Cryptographie',
        nominalValue: 'Résolution SOE ≤ 1 ms GPS PTP · Chiffrement TLS 1.3 CEI 62351'
      },
      {
        tag: 'SCADA-EMS',
        nameFr: 'Poste de Conduite Local (IHM / SAS) & Téléconduite Dispatching National',
        nameEn: 'Local Substation HMI & National Dispatching Telecontrol (SCADA/EMS)',
        descFr: 'Affichage des schémas unifilaires animés avec code couleur normalisé des tensions (225 kV, 110 kV, 30 kV), consignation virtuelle des organes, gestion des listes d\'alarmes par priorité, et liaison télécom OPGW vers le Dispatching National de Conduite (SONATREL).',
        descEn: 'Dynamic single-line animated mimics with standardized voltage color codes, virtual lockout-tagout tag placement, alarm severity lists, and OPGW fiber-optic telecommunication routing to the National Load Dispatch Center.',
        parameter: 'Rafraîchissement & Latence WAN',
        nominalValue: 'IHM locale < 500 ms · Télémesures WAN OPGW < 2.0 s vers Dispatching'
      }
    ],

    equipmentList: [
      {
        tag: 'BCU-BAY-CTRL',
        nameFr: 'Contrôleur Numérique de Travée (BCU - Bay Control Unit)',
        nameEn: 'Digital Bay Control Unit (BCU)',
        category: 'Contrôle-Commande Numérique de Poste',
        standard: 'CEI 61850-7-4 / CEI 60255',
        roleFr: 'Acquiert la position des sectionneurs et du disjoncteur, bloque toute manœuvre dangereuse via les équations booléennes d\'interverrouillage et autorise la commande locale/distante sécurisée.',
        roleEn: 'Acquires disconnector and breaker positions, enforces Boolean bay interlocking equations to prevent hazardous live disconnects, and manages local/remote control modes.',
        workingPrincipleFr: 'Traite les entrées binaires 110 V DC avec filtrage anti-rebond numérique (1 ms), résout les équations d\'interverrouillage logique (LCC) et émet les ordres de manœuvre motorisés via relais de puissance internes.',
        workingPrincipleEn: 'Processes 110 V DC binary inputs with digital debounce filtering (1 ms), solves Boolean logical interlocking equations (LCC), and energizes motorized switchgear mechanisms through heavy-duty output relays.',
        componentsFr: ['CPU temps réel durcie', '32 entrées binaires optocouplées 2.5 kV', '16 sorties relais statiques/électromécaniques', 'Double port Ethernet optique LC 100/1000Base-FX', 'Synoptique unifilaire IHM en face avant'],
        componentsEn: ['Hardened real-time CPU', '32 optocoupled 2.5 kV binary inputs', '16 power relay outputs', 'Dual LC 100/1000Base-FX optical ports', 'Front-panel color single-line HMI'],
        ratings: [
          { labelFr: 'Tension Auxiliaire', labelEn: 'Aux Voltage', value: '110 / 220', unit: 'V DC' },
          { labelFr: 'Horodatage SOE', labelEn: 'SOE Resolution', value: '≤ 1', unit: 'ms' },
          { labelFr: 'Entrées Binaires', labelEn: 'Binary Inputs', value: '32', unit: 'canaux' },
          { labelFr: 'Immunité Choc CEM', labelEn: 'EMC Withstand', value: '5', unit: 'kV' }
        ],
        failureModesFr: 'Défaillance de l\'alimentation à découpage 110 V DC, désynchronisation de l\'horloge interne, collage d\'un contact de sortie de commande, tempête de trames sur le bus de station.',
        failureModesEn: 'Switchmode 110 V DC power supply failure, internal clock desynchronization, output relay contact welding, station bus broadcast storm.',
        epedeEquipmentId: 'eq-bcu-61850'
      },
      {
        tag: 'RTU-SUBSTATION',
        nameFr: 'Unité Terminale Distante & Passerelle Téléconduite (RTU Gateway)',
        nameEn: 'Substation Remote Terminal Unit (RTU Gateway)',
        category: 'Téléconduite & Passerelles SCADA',
        standard: 'CEI 60870-5-104 / CEI 62351-3/5',
        roleFr: 'Convertit les modèles orientés objet CEI 61850 du poste en adresses d\'objets d\'information (IOA) CEI 60870-5-104 chiffrées vers le SCADA national de SONATREL.',
        roleEn: 'Translates IEC 61850 substation object-oriented data models into encrypted IEC 60870-5-104 Information Object Addresses (IOA) transmitted to national dispatching.',
        workingPrincipleFr: 'Concentration de trames MMS et GOOSE des BCU en base de données temps réel locale, traitement des alarmes par priorité et transmission cyclique / sur changement d\'état via liaison OPGW sécurisée TLS 1.3.',
        workingPrincipleEn: 'Aggregates MMS and GOOSE frames into local real-time relational database, processes priority alarms, and routes cyclic / spontaneous telemetry over TLS 1.3 encrypted OPGW WAN.',
        componentsFr: ['Double processeur redondant 64 bits', 'Puce de sécurité cryptographique matérielle (TPM 2.0 / HSM)', 'Ports routeurs WAN OPGW redondants', 'Alimentation secourue 110 V DC redondante'],
        componentsEn: ['Dual redundant 64-bit industrial processors', 'Hardware Cryptographic Security Module (TPM 2.0 / HSM)', 'Redundant OPGW WAN router interfaces', 'Dual 110 V DC backed power supplies'],
        ratings: [
          { labelFr: 'Capacité Points', labelEn: 'Point Capacity', value: '10 000', unit: 'points IOA' },
          { labelFr: 'Chiffrement Réseau', labelEn: 'Encryption', value: 'TLS 1.3 / CEI 62351', unit: '' },
          { labelFr: 'Redondance CPU', labelEn: 'CPU Redundancy', value: 'Hot-Standby < 50', unit: 'ms' },
          { labelFr: 'Ports Réseau', labelEn: 'Network Ports', value: '8 x GbE Optique', unit: '' }
        ],
        failureModesFr: 'Expiration de certificat cryptographique TLS 1.3, corruption de la table de conversion IOA, saturation de la mémoire tampon d\'événements lors d\'une panne générale.',
        failureModesEn: 'TLS 1.3 cryptographic certificate expiration, IOA translation table corruption, event buffer overflow during widespread cascading grid disturbances.',
        epedeEquipmentId: 'eq-rtu-gateway-104'
      },
      {
        tag: 'SWITCH-PRP-REDBOX',
        nameFr: 'Commutateur Industriel Durci & Boîte de Redondance (PRP / HSR RedBox)',
        nameEn: 'Industrial High-Availability Switch & Redundancy Box (PRP / HSR RedBox)',
        category: 'Réseaux Industriels de Poste',
        standard: 'CEI 62439-3 / CEI 61850-3 / IEEE 1613',
        roleFr: 'Duplique chaque trame émise sur deux réseaux physiquement indépendants (LAN A et LAN B) pour éliminer tout temps de coupure ou perte de paquet lors d\'une rupture de fibre.',
        roleEn: 'Duplicates every emitted Ethernet frame across two independent physical LANs (A and B), achieving zero-millisecond bumpless failover upon single fiber fracture.',
        workingPrincipleFr: 'Ajoute une étiquette PRP (Redundancy Tag RCT) de 6 octets avec numéro de séquence, transmet en simultané sur LAN A et LAN B, et élimine la trame dupliquée à la réception sans délai.',
        workingPrincipleEn: 'Appends 6-byte Redundancy Control Trailer (RCT) with sequence counters, transmits simultaneously over LAN A and LAN B, and drops duplicate arrivals instantaneously.',
        componentsFr: ['Châssis métallique fanless sans ventilateur IP40', '16 ports SFP 1 Gbps optiques', 'Processeur ASIC de commutation sans blocage (Wire-speed)', 'Horloge frontière PTP IEEE 1588v2'],
        componentsEn: ['Fanless industrial IP40 metal chassis', '16 x 1 Gbps optical SFP slots', 'Wire-speed non-blocking switching ASIC', 'IEEE 1588v2 PTP boundary clock module'],
        ratings: [
          { labelFr: 'Temps Recouvrement', labelEn: 'Recovery Time', value: '0 (Bumpless)', unit: 'ms' },
          { labelFr: 'Température Service', labelEn: 'Operating Temp', value: '-40 à +85', unit: '°C' },
          { labelFr: 'Bande Passante', labelEn: 'Switch Fabric', value: '32', unit: 'Gbps' },
          { labelFr: 'Immunité Champ B', labelEn: 'Magnetic Immunity', value: '1000', unit: 'A/m impulsion' }
        ],
        failureModesFr: 'Défaillance du module SFP optique en ambiance surchauffée, boucle de commutation broadcast en cas de mauvaise configuration VLAN, perte de l\'asservissement PTP.',
        failureModesEn: 'Optical SFP transceiver degradation in high-ambient switchrooms, broadcast loop on misconfigured trunk VLANs, loss of PTP boundary clock lock.',
        epedeEquipmentId: 'eq-switch-prp-redbox'
      },
      {
        tag: 'GPS-PTP-GRANDMASTER',
        nameFr: 'Horloge Mère GPS Grandmaster & Serveur Temps Substation (IEEE 1588v2)',
        nameEn: 'Substation GPS Grandmaster Time Server (IEEE 1588v2)',
        category: 'Synchronisation & Référence Temporelle',
        standard: 'IEEE 1588v2 / IEEE C37.238 / IRIG-B004',
        roleFr: 'Délivre une référence de temps absolue UTC synchronisée par satellite à tous les relais de protection, BCU et RTU pour permettre l\'analyse post-incident à la milliseconde.',
        roleEn: 'Provides absolute UTC time reference to all protection IEDs, bay controllers, and gateways to ensure accurate sub-millisecond sequence of events post-mortem analysis.',
        workingPrincipleFr: 'Récepteur multi-constellation GNSS (GPS, Galileo, Glonass) pilotant un oscillateur à quartz thermorégulé (OCXO) ou Rubidium avec horodatage matériel nanoseconde des paquets PTP.',
        workingPrincipleEn: 'Multi-constellation GNSS receiver locking an oven-controlled crystal oscillator (OCXO) or Rubidium source with hardware nanosecond packet timestamping.',
        componentsFr: ['Récepteur GNSS 72 canaux anti-brouillage', 'Oscillateur Rubidium haute stabilité', 'Double port optique PTP 1 Gbps', 'Sorties coaxiales BNC IRIG-B non modulées', 'Double alimentation DC'],
        componentsEn: ['72-channel anti-jamming GNSS receiver', 'High-stability Rubidium atomic clock', 'Dual 1 Gbps optical PTP ports', 'BNC unmodulated IRIG-B outputs', 'Dual redundant DC feeds'],
        ratings: [
          { labelFr: 'Précision Temps Réseau', labelEn: 'Time Accuracy', value: '< 50', unit: 'ns (asservi)' },
          { labelFr: 'Dérive Roue Libre', labelEn: 'Holdover Drift', value: '< 1', unit: 'µs / 24h' },
          { labelFr: 'Profil PTP', labelEn: 'PTP Profile', value: 'IEEE C37.238', unit: 'Power Utility' },
          { labelFr: 'Sorties IRIG-B', labelEn: 'IRIG-B Channels', value: '4 x BNC', unit: 'isolées' }
        ],
        failureModesFr: 'Perte de vue satellite ou foudroiement de l\'antenne extérieure GNSS, brouillage intentionnel ou accidentel de fréquences GPS, dérive de l\'oscillateur en mode roue libre prolongé.',
        failureModesEn: 'Lightning strike on rooftop GNSS antenna, satellite signal jamming/spoofing, cumulative oscillator drift during prolonged satellite blackout.',
        epedeEquipmentId: 'eq-gps-ptp-grandmaster'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 74 / TCS',
        nameFr: 'Surveillance Continue du Circuit de Déclenchement (Trip Circuit Supervision)',
        nameEn: 'Trip Circuit Supervision (ANSI 74 / TCS)',
        standard: 'CEI 60255-1 / IEEE C37.90',
        principleFr: 'Injecte un micro-courant constant (< 2 mA) à travers la bobine de déclenchement du disjoncteur en position ouverte et fermée pour détecter immédiatement toute coupure de fil ou défaut d\'alimentation 110 V DC.',
        principleEn: 'Injects continuous supervisory current (< 2 mA) through the circuit breaker trip coil in both open and closed states, detecting wiring breaks or DC fuse failures before a fault occurs.',
        typicalSetting: 'Temporisation alarme t = 200 ms; Seuil courant supervision I > 1.5 mA; Blocage automatique réenclenchement 79.'
      },
      {
        ansiCode: 'ANSI 89L / Interlock',
        nameFr: 'Interverrouillage Logique de Sécurité des Sectionneurs (LCC / CEI 61850)',
        nameEn: 'Switchgear Logic Interlocking & Busbar Selection Safety (ANSI 89L)',
        standard: 'CEI 62271-102 / CEI 61850-7-4',
        principleFr: 'Interdit formellement toute manœuvre d\'un sectionneur sous tension si le disjoncteur associé n\'est pas confirmé ouvert par contacts double-point 52a/52b (anti-arc destructif de manœuvre en charge).',
        principleEn: 'Formally inhibits any motorized disconnector movement unless the series circuit breaker is positively confirmed open by double-point 52a/52b auxiliary contacts.',
        typicalSetting: 'Équation booléenne LCC: Permis_89 = (52_Ouvert == 1) AND (52_Fermé == 0) AND (Sectionneur_Terre == 0); Temps exécution < 5 ms.'
      },
      {
        ansiCode: 'ANSI 25 / Synchro',
        nameFr: 'Contrôle Automatique de Synchronisme (Synchro-Check)',
        nameEn: 'Automatic Synchro-Check & Paralleling Supervision (ANSI 25)',
        standard: 'CEI 60255-181 / IEEE C37.118',
        principleFr: 'Vérifie que l\'écart de tension (ΔU), l\'écart de fréquence (Δf) et le déphasage angulaire (Δθ) sont inférieurs aux limites prescrites avant d\'autoriser la fermeture du disjoncteur interconnectant deux réseaux.',
        principleEn: 'Verifies that voltage difference (ΔV), slip frequency (Δf), and phase angle difference (Δθ) satisfy strict safety margins prior to authorizing circuit breaker closure.',
        typicalSetting: 'ΔU < 10% Un; Δf < 0.10 Hz; Δθ < 15°; Temporisation de stabilisation t = 500 ms; Autorisation barres mortes / ligne vivante (DLLB).'
      },
      {
        ansiCode: 'SBO / CEI 61850',
        nameFr: 'Télécommande Sécurisée "Sélectionner Avant d\'Exécuter" (Select-Before-Operate)',
        nameEn: 'Select-Before-Operate (SBO) Cryptographic Telecommand Verification',
        standard: 'CEI 61850-7-2 / CEI 62351-5',
        principleFr: 'L\'opérateur envoie d\'abord une requête de sélection d\'organe. Le BCU valide l\'absence de conflit, arme l\'appareil pour une fenêtre temporisée (15 s), et exécute la manœuvre uniquement après validation du token Operate.',
        principleEn: 'The operator issues a preliminary Select request. The BCU locks the device against concurrent access for 15 seconds, and executes the physical trip/close only upon receiving a validated Operate token.',
        typicalSetting: 'Fenêtre de garde SBO = 15 s; Chiffrement TLS 1.3; Contrôle d\'unicité de commande; Journalisation SOE avec horodatage GPS 1 ms.'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur d\'Interverrouillage Logique de Travée & Protocole Télécommande SBO',
      titleEn: 'Bay Interlocking Logic & Select-Before-Operate (SBO) Telecontrol Simulator',
      descFr: 'Faites progresser la séquence de commande de manœuvre (0% à 100%) pour analyser la vérification des interverrouillages logiques LCC, le contrôle de synchronisme (ANSI 25) et l\'exécution sécurisée SBO selon la CEI 61850 / CEI 60870-5-104.',
      descEn: 'Step through the bay switching telecommand sequence (0% to 100%) to verify LCC logical interlocks, ANSI 25 synchrocheck validation, and Select-Before-Operate execution per IEC 61850.',
      paramName: 'Séquence Télécommande SBO',
      unit: '% SBO',
      min: 0,
      max: 100,
      step: 25,
      initialValue: 50,
      calculate: (stepVal: number) => {
        const stepNum = Math.round(stepVal / 25);
        const steps = [
          {
            labelFr: 'Phase 0 : État Initial de Sécurité',
            labelEn: 'Phase 0: Initial Safety State',
            statusFr: 'Travée au repos, disjoncteur 225 kV ouvert, surveillance TCS saine, aucun ordre en cours',
            statusEn: 'Bay idle, 225 kV circuit breaker open, TCS healthy, no active commands pending',
            delay: '0 ms',
            state: 'IDLE'
          },
          {
            labelFr: 'Phase 1 : Sélection Préalable (Select)',
            labelEn: 'Phase 1: Select Verification',
            statusFr: 'Requête Select reçue, verrouillage logiciel activé, contrôle booléen LCC validé (Sectionneur 89 fermé)',
            statusEn: 'Select request received, software lock engaged, LCC Boolean interlocking verified (Disconnector 89 closed)',
            delay: '18 ms',
            state: 'SELECTED'
          },
          {
            labelFr: 'Phase 2 : Contrôle de Synchronisme (ANSI 25)',
            labelEn: 'Phase 2: Synchrocheck Check (ANSI 25)',
            statusFr: 'Mesure différentielle ΔU < 5 kV, Δf < 0.10 Hz, Δθ < 15° vérifiée entre jeu de barres et ligne',
            statusEn: 'Differential measurement ΔV < 5 kV, Δf < 0.10 Hz, Δθ < 15° verified across breaker poles',
            delay: '42 ms',
            state: 'SYNCHRO_OK'
          },
          {
            labelFr: 'Phase 3 : Autorisation d\'Exécution (Operate)',
            labelEn: 'Phase 3: Operate Arming',
            statusFr: 'Code d\'authentification TLS / CEI 62351 validé, temporisation SBO active (fenêtre 15 s)',
            statusEn: 'TLS / IEC 62351 authentication token verified, SBO execution window active (15 s timeout)',
            delay: '65 ms',
            state: 'ARMED'
          },
          {
            labelFr: 'Phase 4 : Exécution & Enclenchement Réussi',
            labelEn: 'Phase 4: Breaker Closed & SOE Generated',
            statusFr: 'Contact de commande 110 V DC fermé, confirmation double-point 52a/52b à 1-0, compte-rendu SOE 1 ms',
            statusEn: '110 V DC close coil fired, double-point auxiliary contact 52a/52b confirmed, 1 ms SOE record archived',
            delay: '95 ms',
            state: 'CLOSED'
          }
        ];
        const safeStepIdx = Math.max(0, Math.min(stepNum, steps.length - 1));
        const current = steps[safeStepIdx] || steps[0];
        return [
          {
            labelFr: 'Étape Opérationnelle',
            labelEn: 'Operational Step',
            value: current.state,
            unit: '',
            statusFr: current.labelFr,
            statusEn: current.labelEn
          },
          {
            labelFr: 'Contrôle Interverrouillage & Sécurité',
            labelEn: 'Interlocking & Security Check',
            value: stepNum >= 1 ? 'VALIDE' : 'ATTENTE',
            unit: '',
            statusFr: current.statusFr,
            statusEn: current.statusEn
          },
          {
            labelFr: 'Latence Télécommande Cumulée',
            labelEn: 'Cumulative Telecommand Latency',
            value: current.delay,
            unit: '',
            statusFr: 'Acheminement OPGW + Décryptage RTU + Cycle BCU',
            statusEn: 'OPGW propagation + RTU decryption + BCU cycle'
          }
        ];
      }
    },

    faultSequence: [
      {
        time: 't = 0 ms',
        eventFr: 'Émission d\'une télécommande de fermeture du disjoncteur 225 kV depuis le dispatching SONATREL',
        eventEn: 'Teleclose command dispatched from National Dispatching Center via IEC 60870-5-104',
        detailFr: 'L\'opérateur valide l\'ordre de fermeture sur l\'IHM SCADA. Le paquet IP crypté TLS CEI 60870-5-104 est acheminé par la fibre optique OPGW.',
        detailEn: 'Operator confirms close order on SCADA workstation. The encrypted IEC 60870-5-104 packet traverses the OPGW transmission network.'
      },
      {
        time: 't = 12 ms',
        eventFr: 'Réception par la passerelle RTU et validation de l\'authentification CEI 62351',
        eventEn: 'Gateway RTU receives command and authenticates digital signature per IEC 62351',
        detailFr: 'La RTU vérifie l\'intégrité cryptographique du message, contrôle le rôle de l\'opérateur (RBAC) et traduit l\'ordre en requête MMS CEI 61850.',
        detailEn: 'RTU verifies cryptographic signature, checks Role-Based Access Control credentials, and maps command to IEC 61850 MMS.'
      },
      {
        time: 't = 28 ms',
        eventFr: 'Vérification du synchronisme (ANSI 25) et des équations d\'interverrouillage par le BCU',
        eventEn: 'BCU evaluates bay safety interlocking equations and synchro-check criteria (ANSI 25)',
        detailFr: 'Le contrôleur de travée confirme que les sectionneurs amont/aval sont fermés, que le circuit de déclenchement (TCS) est sain, et que Δθ = 4.2° < 15°.',
        detailEn: 'Bay controller validates healthy breaker TCS, verifies closed disconnectors, and ensures busbar/line phase angle delta is within tolerance.'
      },
      {
        time: 't = 45 ms',
        eventFr: 'Activation du relais de commande et alimentation de la bobine d\'enclenchement 110 V DC',
        eventEn: 'Output command relay energized; 110 V DC close coil engaged',
        detailFr: 'Fermeture du contact de puissance statique. Le mécanisme de réarmement à ressort libère l\'énergie pour rapprocher les pôles SF6.',
        detailEn: 'Solid-state output contact closes, powering breaker spring-release mechanism to drive main SF6 contacts together.'
      },
      {
        time: 't = 105 ms',
        eventFr: 'Fermeture physique complète des pôles du disjoncteur et basculement des contacts fin de course',
        eventEn: 'Main contacts fully closed; mechanical auxiliary switches transition (52a/52b)',
        detailFr: 'Les contacts auxiliaires 52a passent à l\'état fermé (1) et 52b à l\'état ouvert (0). L\'information double passe de "01" (ouvert) à "10" (fermé).',
        detailEn: 'Auxiliary mechanical switches reflect confirmed position change. BCU debounce logic filters transition chatter within 4 ms.'
      },
      {
        time: 't = 120 ms',
        eventFr: 'Publication GOOSE d\'état et transmission de l\'événement SOE horodaté au SCADA',
        eventEn: 'GOOSE status broadcasted and 1 ms SOE event transmitted to national dispatching',
        detailFr: 'Le BCU publie la trame GOOSE de position sur l\'anneau PRP. La RTU transmet le télé-état horodaté à la milliseconde vers le dispatching de Yaoundé.',
        detailEn: 'BCU emits updated GOOSE status across PRP bus while RTU forwards millisecond-accurate SOE telegram back to central dispatch.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Position Double des Appareils HT (TSD 01/10/00/11)',
        nameEn: 'Double-Point Switchgear Status (TSD 01/10/00/11)',
        sensorFr: 'Contacts auxiliaires fins de course 52a (NO) et 52b (NF) sous 110 V DC',
        sensorEn: 'Auxiliary mechanical end-switches 52a (NO) and 52b (NC) at 110 V DC',
        rate: 'Acquisition 1 ms avec filtrage anti-rebond numérique (debounce 10 ms)',
        protocol: 'CEI 61850 GOOSE & CEI 60870-5-104 (Type 30)'
      },
      {
        nameFr: 'Mesures Analogiques de Puissance Active / Réactive (MW / Mvar)',
        nameEn: 'Active and Reactive Power Telemetries (MW / Mvar)',
        sensorFr: 'Transducteurs de mesure numériques 3 phases 4 fils sur secondaires TC/TT',
        sensorEn: '3-phase 4-wire digital multifunction transducers on CT/VT secondaries',
        rate: 'Rafraîchissement périodique 1 s ou par dépassement de seuil mort (deadband 0.5%)',
        protocol: 'CEI 61850 MMS (Reports non tamponnés) / CEI 60870-5-104'
      },
      {
        nameFr: 'Tension de la Batterie de Poste 110 V DC & Température Salle Relais',
        nameEn: 'Substation 110 V DC Battery Voltage & Relay Room Temperature',
        sensorFr: 'Capteur de tension DC isolé galvaniquement et sonde de température ambiante PT100',
        sensorEn: 'Galvanically isolated DC voltage transducer and ambient PT100 RTD sensor',
        rate: 'Surveillance continue toutes les 5 s avec seuils d\'alarme bas/haut',
        protocol: 'Modbus TCP / SNMP v3 / CEI 60870-5-104'
      },
      {
        nameFr: 'État de Santé des Liaisons Réseau PRP (Trames Perdues LAN A/B)',
        nameEn: 'PRP Network Redundancy Link Health (LAN A / LAN B Frame Error Rate)',
        sensorFr: 'Compteurs matériels MIB internes des commutateurs RedBox et cartes d\'interface IED',
        sensorEn: 'Internal hardware MIB counters inside RedBox switches and IED network adapters',
        rate: 'Interrogation cyclique toutes les 10 s',
        protocol: 'SNMP v3 / CEI 62439-3 Supervision MMS'
      },
      {
        nameFr: 'Écart de Synchronisation Temporelle Grandmaster PTP',
        nameEn: 'PTP Grandmaster Time Offset & Clock Drift',
        sensorFr: 'Horloge matérielle asservie sur antenne GNSS avec rapport de verrouillage de phase',
        sensorEn: 'Hardware clock phase-locked to GNSS constellation with lock-status telemetry',
        rate: 'Surveillance permanente (écart < 1 µs)',
        protocol: 'IEEE 1588v2 / IEEE C37.238'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Appareillage Haute Tension)',
        nameFr: 'Actionneurs Motorisés & Contacts Fins de Course',
        nameEn: 'Motorized Drives & Auxiliary Switches',
        descFr: 'Boîtes de commande mécanique des disjoncteurs, sectionneurs et régleurs en charge de transformateur sous 110 V DC.',
        descEn: 'Drive mechanism enclosures of breakers, disconnectors, and on-load tap changers powered by 110 V DC station batteries.',
        response: '< 5 ms'
      },
      {
        level: 'Niveau 1 (Tranche / Bay Level)',
        nameFr: 'Contrôleur de Travée (BCU) & Relais de Protection',
        nameEn: 'Bay Control Unit (BCU) & Multifunction IEDs',
        descFr: 'Acquisition locale, équations d\'interverrouillage autonome de travée et exécution des commandes manuelles et d\'automatismes.',
        descEn: 'Local signal acquisition, standalone bay safety interlocking logic, and execution of local/remote switching sequences.',
        response: '< 20 ms'
      },
      {
        level: 'Niveau 2 (Poste / Substation Level)',
        nameFr: 'Système CCN de Poste (SAS) & Passerelle RTU',
        nameEn: 'Substation Automation System & Gateway RTU',
        descFr: 'IHM de conduite locale, serveur d\'archivage des événements horodatés (SOE) et passerelle de téléconduite sécurisée.',
        descEn: 'Local touch-screen control HMI, millisecond sequence of events archive, and secure dual-telecontrol gateway.',
        response: '50 – 150 ms'
      },
      {
        level: 'Niveau 3 (National / Dispatching Center)',
        nameFr: 'Centre National de Conduite SONATREL (SCADA / EMS)',
        nameEn: 'National Load Dispatch Center (SCADA / EMS)',
        descFr: 'Supervision globale du réseau national interconnecté (RIS / RIN), estimation d\'état, régulation fréquence-puissance et téléconduite.',
        descEn: 'Countrywide electrical grid supervision, state estimation, load-frequency control (LFC/AGC), and contingency analysis.',
        response: '1 – 2 s'
      }
    ],

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Contrôle-Commande Numérique (CCN / SAS)',
        roleFromEn: 'Substation Automation Engineer',
        roleToFr: 'Ingénieur Télécommunications Réseau & OPGW',
        roleToEn: 'Telecommunications & OPGW Engineer',
        phase: 'Ingénierie de Détail Téléconduite (CEI 60870-5-104)',
        dataExchangedFr: 'Table d\'adressage des points d\'information (IOA), temps de réponse réseau admissible (< 50 ms) et allocation des bandes passantes.',
        dataExchangedEn: 'Information Object Address (IOA) list, maximum allowable telecom round-trip latency (< 50 ms), and bandwidth allocation.',
        decisionFr: 'Mise en place d\'un VPN MPLS dédié sécurisé sur fibre OPGW avec chiffrement matériel IPsec / TLS 1.3.',
        decisionEn: 'Configured dedicated secure MPLS VPN over OPGW fiber links with hardware-accelerated IPsec / TLS 1.3 encryption.',
        impactFr: 'Immunité absolue contre les cyber-intrusions et temps de rafraîchissement des télémesures garanti à 1 seconde.',
        impactEn: 'Zero vulnerability to external cyber intrusions and guaranteed 1-second telemetries refresh rate.'
      },
      {
        roleFromFr: 'Ingénieur Exploitation Réseau (Dispatching)',
        roleFromEn: 'Grid Dispatching Operations Engineer',
        roleToFr: 'Ingénieur Poste Haute Tension & Appareillage',
        roleToEn: 'Substation Primary Equipment Engineer',
        phase: 'Validation des Séquences d\'Interverrouillage Logique',
        dataExchangedFr: 'Matrices booléennes de manœuvre (sectionneurs de barres, sectionneur de terre et disjoncteur) et temps d\'ouverture max.',
        dataExchangedEn: 'Boolean interlocking logic matrix (busbar selectors, earthing blades, circuit breaker) and stroke operating times.',
        decisionFr: 'Implémentation d\'un double verrouillage : électrique filaire direct sur les contacteurs moteurs + logique programmable par GOOSE dans le BCU.',
        decisionEn: 'Mandated dual-layer interlock: hardwired auxiliary contact loop on motor contactors plus GOOSE programmable logic in BCU.',
        impactFr: 'Impossibilité physique et logique de fermer un sectionneur sur une ligne sous tension ou de manœuvrer sous charge.',
        impactEn: 'Eliminates human and software errors; physically precludes closing earth switches onto energized busbars.'
      }
    ],

    internationalCase: {
      location: 'National Grid (Royaume-Uni) & Elia (Belgique)',
      titleFr: 'Postes Numériques CEI 61850 Station Bus & Cybersécurité OT CEI 62351',
      titleEn: 'Digital Substation Station Bus Architecture & IEC 62351 OT Cybersecurity',
      capacity: 'Réseau THT 400 kV entièrement téléconduit',
      highlightsFr: 'Déploiement systématique de réseaux Ethernet industriels redondants PRP à double anneau optique avec isolation cryptographique stricte selon la CEI 62351. Élimination totale des câbles filaires de téléconduite traditionnels et mise en place d\'une gestion centralisée des accès basée sur les rôles (RBAC) conforme aux exigences NIS 2.',
      highlightsEn: 'Standardized deployment of IEC 62439-3 PRP dual-homed optical Ethernet rings combined with IEC 62351 cryptographic security. Completely replaced hardwired RTU cables, introducing centralized Role-Based Access Control (RBAC) meeting NIS 2 European cybersecurity standards.'
    },

    cameroonCase: {
      assetLocation: 'SONATREL - Centre National de Conduite (CNC) Yaoundé & Postes 225 kV RIS',
      titleFr: 'Projet de Modernisation du Système SCADA/EMS National & Téléconduite des Postes 225 kV',
      titleEn: 'National SCADA/EMS Modernization & 225 kV Substation Telecontrol Project by SONATREL',
      notesFr: 'Raccordement de 28 postes haute tension (dont Bekoko, Mangombé, Oyomabang, Logbaba et le poste 225 kV d\'évacuation de Nachtigal 420 MW) au nouveau système SCADA/EMS centralisé de Yaoundé. Remplacement des anciennes RTU série par des passerelles numériques CEI 60870-5-104 sur réseau fédérateur OPGW et installation d\'IHM locales tactiles de tranche.',
      notesEn: 'Interconnection of 28 high-voltage substations (including Bekoko, Mangombé, Oyomabang, Logbaba, and the 420 MW Nachtigal evacuation hub) to the modern centralized SCADA/EMS in Yaoundé. Replaced legacy serial RTUs with redundant IEC 60870-5-104 IP gateways over national OPGW fiber and installed local bay HMIs.'
    },

    relatedDomains: [
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Fournit l\'appareillage haute tension (disjoncteurs, sectionneurs motorisés) et les coffrets de regroupement raccordés aux BCU.',
        relationshipEn: 'Supplies primary high-voltage switchgear (breakers, motorized disconnectors) and marshalling kiosks wired to BCU panels.'
      },
      {
        code: 'D11',
        nameFr: 'Protection & Systèmes de Surveillance',
        nameEn: 'Protection & Digital Relays',
        relationshipFr: 'Échange en temps réel les trames d\'alarme, les ordres de déclenchement d\'urgence et les fichiers oscilloperturbographiques Comtrade.',
        relationshipEn: 'Streams real-time protection trip alarms, emergency inter-trips, and Comtrade disturbance records via IEC 61850 station bus.'
      },
      {
        code: 'D13',
        nameFr: 'Télécommunications & Technologies OT',
        nameEn: 'Communications & Operational Technology',
        relationshipFr: 'Achemine les flux de téléconduite CEI 60870-5-104 et les synchronisations d\'horloges PTP sur les câbles de garde à fibres optiques (OPGW).',
        relationshipEn: 'Transports IEC 60870-5-104 telemetry channels and PTP clock synchronizations over transmission line OPGW fiber spans.'
      },
      {
        code: 'D02',
        nameFr: 'Architecture & Stabilité Réseau',
        nameEn: 'Grid Architecture & Stability',
        relationshipFr: 'Exploite les données de télémesure SCADA pour exécuter les calculs d\'estimateur d\'état (SE) et d\'analyse de contingence (N-1).',
        relationshipEn: 'Feeds SCADA telemetries into state estimation engines and real-time N-1 contingency security assessment modules.'
      },
      {
        code: 'D10',
        nameFr: 'Stockage d\'Énergie & BESS',
        nameEn: 'Energy Storage & Charging',
        relationshipFr: 'Transmet les consignes de modulation active P/Q et les ordres de réserve rapide FFR aux onduleurs de stockage réversibles.',
        relationshipEn: 'Dispatches active/reactive P/Q setpoints and fast frequency response (FFR) triggers to utility battery inverters.'
      }
    ]
  },

  // DOMAIN 13: COMMUNICATIONS & OPERATIONAL TECHNOLOGY (OT)
  D13: {
    domainCode: 'D13',
    titleFr: 'Télécommunications, Câbles OPGW & Réseaux OT',
    titleEn: 'Telecommunications, OPGW Fiber & Operational Technology (OT)',
    summaryFr: 'Ce domaine traite de l\'infrastructure de télécommunication industrielle déterministe, ultra-haute disponibilité (99.999%) et sécurisée reliant les postes électriques, les centrales de production et le Dispatching National de Conduite de SONATREL. Il englobe les câbles de garde à fibres optiques (OPGW), les réseaux de transport optique déterministes (MPLS-TP, Carrier Ethernet, SDH), les interfaces de téléprotection normalisées (IEEE C37.94), les liaisons de secours hertziennes (FH) et la cybersécurité des communications de puissance (CEI 62351).',
    summaryEn: 'Covers the mission-critical, ultra-high-availability (99.999%), deterministic utility telecommunication backbone interconnecting power substations, generating plants, and the SONATREL National Dispatching Center. It encompasses Optical Ground Wire (OPGW) cables, deterministic packet-optical transport networks (MPLS-TP, Carrier Ethernet, SDH), standardized teleprotection interfaces (IEEE C37.94), backup microwave radio links, and power system communications cybersecurity (IEC 62351).',
    voltageRange: 'Fibre Optique G.652D (1310 / 1550 nm) · 48 V DC Télécom',
    primaryStandard: 'ITU-T G.652D / IEEE C37.94 / CEI 62351 / ITU-T G.8113.1',
    inputsFr: 'Signaux lumineux sur fibres monomodes, flux de téléconduite CEI 60870-5-104, synchronisation PTP IEEE 1588v2, ordres de téléprotection différentielle',
    inputsEn: 'Single-mode optical signals, IEC 60870-5-104 SCADA frames, IEEE 1588v2 PTP clock feeds, line differential teleprotection trip commands',
    coreTransformFr: 'Multiplexage déterministe MPLS-TP à réservation stricte de bande (CIR/EIR), transmission optique longue distance (> 100 km sans répéteur), basculement bumpless (< 50 ms) et chiffrement matériel MACsec / IPsec',
    coreTransformEn: 'Deterministic MPLS-TP packet-optical transport with strict bandwidth reservation (CIR/EIR), long-haul optical propagation (> 100 km unrepeatered), bumpless protection switching (< 50 ms), and line-rate hardware MACsec/IPsec encryption',
    outputsFr: 'Canal de téléprotection ultra-rapide (< 5 ms, asymétrie < 0.2 ms), liaisons SCADA vers dispatching sécurisées TLS 1.3, distribution de temps PTP < 1 µs',
    outputsEn: 'Ultra-low latency teleprotection pipe (< 5 ms, delay skew < 0.2 ms), secure TLS 1.3 SCADA feeds to dispatching, distributed PTP clock reference < 1 µs',
    faultClearingTime: '< 50 ms (Basculement de chemin MPLS-TP 1:1) / < 5 ms (Latence canal IEEE C37.94)',

    architectureStages: [
      {
        tag: 'OPGW-FIBER',
        nameFr: 'Câble de Garde à Fibres Optiques (OPGW) & Infrastructure Pylône',
        nameEn: 'Optical Ground Wire (OPGW) & Transmission Line Infrastructure',
        descFr: 'Câble mixte installé au sommet des pylônes 225 kV et 110 kV combinant protection contre la foudre (fil de terre) et faisceau de 24 à 48 fibres optiques monomodes G.652D protégées dans un tube d\'acier inoxydable étanche.',
        descEn: 'Dual-purpose shield wire installed at tower peaks combining lightning discharge shielding with 24 to 48 G.652D single-mode optical fibers housed within a hermetic stainless steel loose tube.',
        parameter: 'Atténuation & Dispersion',
        nominalValue: 'α ≤ 0.22 dB/km à 1550 nm · PMD < 0.1 ps/√km · Tenue court-circuit I²t 150 kA²s'
      },
      {
        tag: 'ODF-PATCH',
        nameFr: 'Tiroir de Répartition Optique (ODF) & Têtes de Câble de Poste',
        nameEn: 'Substation Optical Distribution Frame (ODF) & Cable Terminations',
        descFr: 'Point d\'arrivée des câbles OPGW dans le bâtiment de commande du poste : épissures par fusion thermique, cassettes de lovage respectant le rayon de courbure minimal (> 30 mm) et traversées de raccordement LC/APC.',
        descEn: 'Substation entry terminal for incoming OPGW cables: precision fusion splices, fiber splice trays maintaining bend radius > 30 mm, and low-loss LC/APC angle-polished patch interfaces.',
        parameter: 'Pertes d\'Insertion & Réflectance',
        nominalValue: 'Pertes connecteur LC/APC < 0.20 dB · Réflectance optique (Return Loss) > 60 dB'
      },
      {
        tag: 'MPLS-TP-CORE',
        nameFr: 'Nœud de Transport Optique Déterministe MPLS-TP / Carrier Ethernet',
        nameEn: 'Deterministic MPLS-TP / Carrier Ethernet Packet-Optical Core Node',
        descFr: 'Châssis durci industriel assurant le transport multiplexé des flux SCADA, vidéo, voix et téléprotection sur anneaux 10 Gbps avec réservation stricte de bande passante (zéro perte de paquets et gigue < 0.1 ms pour les services critiques).',
        descEn: 'Ruggedized industrial chassis multiplexing SCADA, video, voice, and teleprotection across 10 Gbps rings with strict CIR/EIR bandwidth reservations, zero packet loss, and sub-0.1ms jitter.',
        parameter: 'Temps de Protection & Débit',
        nominalValue: 'Commutation de protection 1:1 < 50 ms (ITU-T G.8113.1) · Débit cœur 10 Gbps duplex'
      },
      {
        tag: 'TELEPROT-C3794',
        nameFr: 'Canal Déterministe Téléprotection IEEE C37.94 & Cybersécurité OT',
        nameEn: 'Deterministic IEEE C37.94 Teleprotection Channel & OT Cybersecurity',
        descFr: 'Interface numérique optique normalisée dédiée aux relais différentiels de ligne (ANSI 87L) et de téléactionnement, associée à des passerelles de chiffrement matériel MACsec (IEEE 802.1AE) et pare-feux industriels CEI 62351.',
        descEn: 'Standardized optical interface dedicated to ANSI 87L line differential relays and direct transfer tripping, paired with hardware line-rate MACsec (IEEE 802.1AE) and IEC 62351 firewalls.',
        parameter: 'Latence & Asymétrie Tx/Rx',
        nominalValue: 'Latence unidirectionnelle < 5.0 ms · Asymétrie Tx/Rx < 0.20 ms · Chiffrement TLS 1.3'
      }
    ],

    equipmentList: [
      {
        tag: 'OPGW-24-48FO',
        nameFr: 'Câble de Garde à Fibres Optiques (OPGW 24/48 FO G.652D)',
        nameEn: 'Optical Ground Wire Cable (OPGW 24/48 FO G.652D)',
        category: 'Lignes de Transport & Infrastructure Physique',
        standard: 'CEI 60794-4-10 / IEEE 1138',
        roleFr: 'Assure la protection contre les coups de foudre directs en crête de pylônes 225 kV et transporte 48 canaux optiques monomodes pour l\'ensemble des télécommunications du réseau électrique.',
        roleEn: 'Provides lightning shielding at the apex of 225 kV lattice towers while transporting 48 single-mode optical fibers for comprehensive utility telecommunications.',
        workingPrincipleFr: 'Tube central en acier inoxydable étanche hermétiquement soudé au laser contenant un gel thixotrope hydrofuge, entouré de torons d\'aluminium et d\'acier plaqué aluminium (ACS) pour absorber le courant de foudre et de court-circuit.',
        workingPrincipleEn: 'Laser-welded hermetic stainless steel loose tube filled with thixotropic water-blocking gel, encircled by aluminum alloy and aluminum-clad steel (ACS) strands to withstand lightning and fault currents.',
        componentsFr: ['Tube inox étanche avec gel hydrofuge', '48 fibres optiques monomodes G.652D colorées', 'Torons en acier plaqué aluminium (ACS)', 'Torons en alliage d\'aluminium (AAAC)', 'Boîtes d\'épissures étanches IP68 en pied/fût de pylône'],
        componentsEn: ['Hermetic stainless steel tube with water-blocking gel', '48 color-coded G.652D single-mode fibers', 'Aluminum-clad steel (ACS) strands', 'Aluminum alloy wires (AAAC)', 'IP68 watertight splice enclosures mounted on towers'],
        ratings: [
          { labelFr: 'Atténuation 1550 nm', labelEn: 'Attenuation 1550nm', value: '≤ 0.22', unit: 'dB/km' },
          { labelFr: 'Capacité Fibre', labelEn: 'Fiber Count', value: '48', unit: 'brins' },
          { labelFr: 'Tenue Court-Circuit', labelEn: 'Short-Circuit Capacity', value: '150', unit: 'kA²s' },
          { labelFr: 'Charge Rupture UTS', labelEn: 'Rated Tensile Strength', value: '115', unit: 'kN' }
        ],
        failureModesFr: 'Coupure par projectile ou tir d\'arme à feu, chute d\'arbre brisant le câble de garde, infiltration d\'eau dans une boîte d\'épissure gelée, écrasement par pince de suspension trop serrée.',
        failureModesEn: 'Severance from gunfire/projectiles, falling tree causing mechanical rupture, water ingress inside degraded splice closure, microbending from overtightened suspension clamps.',
        epedeEquipmentId: 'eq-opgw-48fo'
      },
      {
        tag: 'MPLS-TP-SWITCH',
        nameFr: 'Nœud de Transport Optique Déterministe Hybride SDH / MPLS-TP',
        nameEn: 'Hybrid SDH / Packet Optical MPLS-TP Industrial Transport Node',
        category: 'Réseaux de Transport & Télécommunications OT',
        standard: 'ITU-T G.8113.1 / CEI 61850-3 / IEEE 1613',
        roleFr: 'Agrège et commute l\'intégralité des flux numériques du poste (téléprotection, SCADA CEI 60870-5-104, téléphonie d\'exploitation VoIP, vidéosurveillance CCTV) avec basculement ultra-rapide < 50 ms sans perte de paquets.',
        roleEn: 'Aggregates and switches all digital substation services (teleprotection, IEC 60870-5-104 SCADA, VoIP dispatch voice, CCTV) with sub-50ms bumpless recovery.',
        workingPrincipleFr: 'Utilise le profil de transport déterministe MPLS-TP sans routage dynamique complexe : chemins LSP bidirectionnels statiques pré-provisionnés avec mécanisme OAM de détection de panne BFD matériel (10 ms).',
        workingPrincipleEn: 'Operates deterministic MPLS-TP without complex IP routing: pre-provisioned static bidirectional LSPs with hardware BFD fast-failure detection (10 ms) driving instant 1:1 linear protection.',
        componentsFr: ['Double carte processeur de brassage redondante 1+1', 'Ports SFP+ optiques 10 Gbps / STM-16', 'Cartes d\'accès dédiées IEEE C37.94 et E1 / TDM', 'Alimentation redondante 48 V DC secourue', 'Refroidissement passif sans ventilateur IP40'],
        componentsEn: ['Dual redundant 1+1 cross-connect switching engines', '10 Gbps / STM-16 optical SFP+ interfaces', 'Dedicated IEEE C37.94 and E1/TDM legacy tributary cards', 'Dual redundant 48 V DC feeds', 'Fanless ruggedized IP40 convection cooling'],
        ratings: [
          { labelFr: 'Temps Basculement', labelEn: 'Protection Switch Time', value: '< 50', unit: 'ms (1:1)' },
          { labelFr: 'Bande Passante Cœur', labelEn: 'Core Capacity', value: '64', unit: 'Gbps' },
          { labelFr: 'Gigue Paquets (Jitter)', labelEn: 'Packet Jitter', value: '< 0.1', unit: 'ms' },
          { labelFr: 'Disponibilité Système', labelEn: 'System Availability', value: '99.999', unit: '%' }
        ],
        failureModesFr: 'Défaillance d\'un laser émetteur SFP en surchauffe, rupture simultanée de deux chemins de câble indépendants, désynchronisation de l\'horloge interne, corruption de mémoire de table de commutation.',
        failureModesEn: 'Laser optical degradation under prolonged ambient heat, simultaneous fiber cuts on working and protect paths, network sync reference loss, cross-connect routing memory corruption.',
        epedeEquipmentId: 'eq-mpls-tp-node'
      },
      {
        tag: 'TELEPROT-C3794',
        nameFr: 'Interface Numérique Optique de Téléprotection IEEE C37.94',
        nameEn: 'Standardized IEEE C37.94 Optical Teleprotection Interface',
        category: 'Téléprotection & Contrôle Déterministe',
        standard: 'IEEE C37.94 / CEI 60255-24',
        roleFr: 'Assure la communication directe entre les relais de protection différentielle de ligne 87L et le réseau de transmission optique, éliminant tout risque d\'induction électromagnétique.',
        roleEn: 'Interconnects line differential protection relays (ANSI 87L) to the optical transport multiplexer, completely immune to high-voltage electromagnetic induction.',
        workingPrincipleFr: 'Transmet des trames série synchrones N x 64 kbps (N = 1 à 12, typiquement 2 Mbps) sur fibre optique multimode ou monomode (820 nm / 1310 nm) avec synchronisation d\'horloge rigoureuse et contrôle de redondance cyclique (CRC).',
        workingPrincipleEn: 'Transmits synchronous N x 64 kbps serial frames (N = 1 to 12, typically 2 Mbps) over optical fiber (820 nm / 1310 nm) with rigid clock tracking and cyclic redundancy checks (CRC).',
        componentsFr: ['Transceiver optique ST / LC multimode ou monomode', 'Contrôleur de trames C37.94 avec calcul CRC matériel', 'Circuit de compensation de délai de propagation', 'Sorties d\'alarme matériel par relais sec'],
        componentsEn: ['Multimode/single-mode ST or LC optical transceiver', 'Hardware C37.94 framer with continuous CRC calculation', 'Propagation delay compensation engine', 'Form-C dry contact hardware alarm relays'],
        ratings: [
          { labelFr: 'Débit Utile', labelEn: 'Bit Rate', value: 'N x 64 (jusqu\'à 2048)', unit: 'kbps' },
          { labelFr: 'Latence Matérielle', labelEn: 'Hardware Latency', value: '< 0.3', unit: 'ms' },
          { labelFr: 'Asymétrie Tolérée', labelEn: 'Max Delay Asymmetry', value: '< 0.20', unit: 'ms' },
          { labelFr: 'Distance Optique', labelEn: 'Optical Reach', value: '2 à 120', unit: 'km' }
        ],
        failureModesFr: 'Alarme Yellow Alarm (perte de synchronisation de trame distante), dérive excessive de l\'asymétrie Tx/Rx provoquant le blocage de la protection 87L, encrassement du connecteur optique ST.',
        failureModesEn: 'Yellow Alarm assertion (remote frame sync loss), excessive Tx/Rx asymmetric propagation delay triggering 87L trip blockage, optical connector contamination.',
        epedeEquipmentId: 'eq-teleprot-c3794'
      },
      {
        tag: 'WAN-ROUTER-OT',
        nameFr: 'Routeur WAN Industriel Durci & Pare-feu Chiffrant CEI 62351',
        nameEn: 'Ruggedized Industrial WAN Router & Encrypting Firewall (IEC 62351)',
        category: 'Cybersécurité Réseau & Passerelles OT',
        standard: 'CEI 62351-3/9 / IEEE 802.1AE (MACsec) / FIPS 140-3',
        roleFr: 'Chiffre à la volée l\'intégralité des télémesures et télécommandes SCADA transitant vers le Dispatching National de Conduite et protège le réseau de poste contre les cyberattaques.',
        roleEn: 'Encrypts all SCADA telemetries and telecommands transmitted to National Dispatching on-the-fly and shields substation networks against industrial cyber threats.',
        workingPrincipleFr: 'Chiffrement matériel AES-GCM-256 à vitesse ligne (Line-Rate MACsec ou IPsec) avec négociation périodique de clés basée sur des certificats numériques X.509 gérés par une autorité PKI centrale.',
        workingPrincipleEn: 'Line-rate AES-GCM-256 hardware encryption (MACsec or IPsec) with automated key rotation driven by X.509 digital certificates managed via a centralized utility PKI.',
        componentsFr: ['Processeur cryptographique matériel dédié (Crypto ASIC)', 'Module de plateforme sécurisée (TPM 2.0)', 'Pare-feu avec inspection dynamique des paquets CEI 60870-5-104', 'Ports Ethernet blindés RJ45 / SFP durcis'],
        componentsEn: ['Dedicated hardware cryptographic co-processor (Crypto ASIC)', 'Hardware Trusted Platform Module (TPM 2.0)', 'Stateful firewall with deep packet inspection for IEC 60870-5-104', 'Ruggedized shielded RJ45 / SFP Ethernet ports'],
        ratings: [
          { labelFr: 'Débit Chiffrement', labelEn: 'Encryption Throughput', value: '10', unit: 'Gbps wire-speed' },
          { labelFr: 'Algorithme Chiffrement', labelEn: 'Cipher Algorithm', value: 'AES-GCM-256', unit: '' },
          { labelFr: 'Certificats', labelEn: 'Key Management', value: 'X.509 / CEI 62351-9', unit: '' },
          { labelFr: 'Immunité CEM', labelEn: 'EMC Hardening', value: 'CEI 61850-3 / IEEE 1613', unit: '' }
        ],
        failureModesFr: 'Expiration imprévue d\'un certificat d\'authentification X.509 coupant le tunnel VPN, tentative d\'injection de trames non authentifiées détectée par le pare-feu, saturation de mémoire lors d\'un balayage réseau malveillant.',
        failureModesEn: 'Unscheduled X.509 digital certificate expiration severing the VPN tunnel, firewall rejection of spoofed telecommands, memory exhaustion during aggressive network scans.',
        epedeEquipmentId: 'eq-wan-router-ot'
      }
    ],

    protections: [
      {
        ansiCode: 'MPLS 1:1',
        nameFr: 'Commutation Automatique de Protection de Chemin MPLS-TP 1:1',
        nameEn: 'MPLS-TP 1:1 Linear Path Protection Switching (ITU-T G.8113.1)',
        standard: 'ITU-T G.8113.1 / RFC 6378',
        principleFr: 'Surveille la continuité du chemin optique actif au moyen de trames de détection rapide matérielle (BFD toutes les 3.3 ms). En cas de coupure physique du brin OPGW, le trafic bascule instantanément sur le chemin de secours en moins de 50 ms sans perte de trames critiques.',
        principleEn: 'Monitors optical working path continuity utilizing hardware-accelerated BFD frames sent every 3.3 ms. Upon physical fiber severance, traffic instantaneously diverts to the pre-established protection path in under 50 ms.',
        typicalSetting: 'Intervalle BFD = 3.3 ms; Multiplicateur = 3 (détection panne en 10 ms); Temps total de basculement ≤ 38 ms; Mécanisme Hold-off = 0 ms.'
      },
      {
        ansiCode: 'ANSI 87L Delay',
        nameFr: 'Compensation Automatique d\'Asymétrie de Propagation (Protection Différentielle 87L)',
        nameEn: 'Propagation Delay Asymmetry Compensation & Equalization (ANSI 87L)',
        standard: 'CEI 60255-187-1 / IEEE C37.94',
        principleFr: 'Mesure en continu le temps de propagation aller-retour (RTT) du canal optique. En cas d\'asymétrie de routage (chemin aller et retour de longueurs différentes après basculement réseau), compense le déphasage calculé ou bloque la différentielle pour éviter tout déclenchement intempestif sur courant de charge normal.',
        principleEn: 'Continuously measures optical channel Round-Trip Time (RTT). If route switching causes transmission asymmetry (unequal Tx/Rx transit paths), calculates and compensates phase angle error or restrains 87L tripping to preclude false trips.',
        typicalSetting: 'Seuil d\'asymétrie toléré Δt ≤ 0.20 ms; Temps de mesure RTT = 100 ms; Action sur asymétrie non compensable : repli automatique en protection de distance 21.'
      },
      {
        ansiCode: 'MACsec / 802.1AE',
        nameFr: 'Chiffrement Matériel de Trame à Vitesse Ligne (Line-Rate MACsec)',
        nameEn: 'Line-Rate Hardware Layer-2 Frame Encryption (IEEE 802.1AE MACsec)',
        standard: 'IEEE 802.1AE / CEI 62351-9',
        principleFr: 'Chiffre et authentifie chaque trame Ethernet à la sortie physique de la carte de communication avec un surcoût de latence quasi-nul (< 2 microsecondes), empêchant toute interception malveillante ou injection de fausses mesures sur les fibres OPGW longeant les voies publiques.',
        principleEn: 'Encrypts and authenticates every Ethernet frame at the hardware PHY layer with virtually zero latency penalty (< 2 microseconds), preventing man-in-the-middle eavesdropping or false data injection.',
        typicalSetting: 'Chiffrement AES-GCM-256; Tag d\'intégrité ICV 128 bits; Rotation automatique de clé Session Key < 3600 s; Latence d\'insertion < 2 µs.'
      },
      {
        ansiCode: 'BFD Fast Detect',
        nameFr: 'Détection Bidirectionnelle Ultra-Rapide de Rupture de Lien (Hardware BFD)',
        nameEn: 'Bidirectional Forwarding Detection for Microsecond Link Failure (Hardware BFD)',
        standard: 'RFC 5880 / RFC 5881',
        principleFr: 'Génère des paquets d\'interrogation cycliques traités directement dans le processeur matériel ASIC des interfaces optiques pour détecter la coupure d\'un lien physique ou d\'une fibre sans attendre les temporisations lentes des protocoles de routage standard.',
        principleEn: 'Generates ultra-high-rate cyclic probe packets processed directly in network ASIC hardware to identify physical fiber cuts within milliseconds, bypassing slow standard routing timers.',
        typicalSetting: 'Intervalle Tx/Rx = 3.3 ms; Multiplicateur de perte = 3; Détection panne t = 9.9 ms; Déclenchement automatique de la commutation de protection MPLS-TP.'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur de Bilan Optique de Liaison OPGW & Latence Téléprotection',
      titleEn: 'OPGW Optical Link Budget & Teleprotection Latency Simulator',
      descFr: 'Ajustez la distance kilométrique de la liaison inter-postes HT (10 à 250 km) pour calculer en temps réel l\'atténuation optique totale, la marge de réserve par rapport au budget émetteur SFP (+32 dB), le temps de propagation de phase et la conformité stricte pour la protection différentielle de ligne 87L.',
      descEn: 'Vary the HV line span distance (10 to 250 km) to compute overall optical attenuation, optical power margin (relative to 32 dB SFP transceiver budget), phase propagation delay, and ANSI 87L differential protection compliance in real-time.',
      paramName: 'Distance de la Liaison 225 kV',
      unit: 'km',
      min: 10,
      max: 250,
      step: 10,
      initialValue: 85,
      calculate: (distanceKm: number) => {
        // Attenuation calculation
        const fiberAlpha = 0.22; // dB/km at 1550 nm
        const fiberLoss = distanceKm * fiberAlpha;
        const numSplices = Math.ceil(distanceKm / 4); // one splice every 4km drum
        const spliceLoss = numSplices * 0.05; // 0.05 dB per fusion splice
        const connectorLoss = 2 * 0.25; // 2 patch connectors (ODF near and far)
        const safetyMargin = 3.0; // 3 dB safety aging margin
        const totalLoss = fiberLoss + spliceLoss + connectorLoss + safetyMargin;
        const sfpBudget = 32.0; // 32 dB standard SFP+ optical budget
        const opticalMargin = sfpBudget - totalLoss;

        // Latency calculation: speed of light in silica n = 1.468 -> 4.90 us/km
        const fiberPropagationDelayMs = (distanceKm * 4.90) / 1000;
        const mplsNodeLatencyMs = 0.35; // hardware switching latency
        const c3794CodecLatencyMs = 0.25; // C37.94 framing codec
        const totalOneWayLatencyMs = fiberPropagationDelayMs + mplsNodeLatencyMs + c3794CodecLatencyMs;
        const roundTripTimeMs = totalOneWayLatencyMs * 2;

        const isOpticalBudgetOk = opticalMargin >= 0;
        const isLatencyOk = totalOneWayLatencyMs <= 5.0;

        return [
          {
            labelFr: 'Atténuation Totale de Liaison',
            labelEn: 'Total Optical Link Loss',
            value: totalLoss.toFixed(2),
            unit: 'dB',
            statusFr: `Fibre (${fiberLoss.toFixed(1)} dB) + ${numSplices} épissures + connecteurs + 3 dB marge`,
            statusEn: `Fiber (${fiberLoss.toFixed(1)} dB) + ${numSplices} splices + connectors + 3 dB margin`
          },
          {
            labelFr: 'Marge de Puissance Optique',
            labelEn: 'Optical Power Margin (SFP 32 dB)',
            value: opticalMargin.toFixed(2),
            unit: 'dB',
            statusFr: isOpticalBudgetOk ? (opticalMargin > 6 ? 'EXCELLENT (Signal Robuste)' : 'SATISFAISANT (Marge Réduite)') : 'ATTENTION (Amplificateur Optique Requis)',
            statusEn: isOpticalBudgetOk ? (opticalMargin > 6 ? 'EXCELLENT (Robust Link)' : 'ADEQUATE (Tight Margin)') : 'WARNING (Optical Amplifier Needed)'
          },
          {
            labelFr: 'Latence Unidirectionnelle Téléprotection',
            labelEn: 'One-Way Teleprotection Latency',
            value: totalOneWayLatencyMs.toFixed(2),
            unit: 'ms',
            statusFr: isLatencyOk ? 'CONFORME (Norme IEEE C37.94 < 5.0 ms)' : 'NON CONFORME (Délai Supérieur à 5 ms)',
            statusEn: isLatencyOk ? 'COMPLIANT (IEEE C37.94 < 5.0 ms limit)' : 'NON-COMPLIANT (Exceeds 5 ms threshold)'
          },
          {
            labelFr: 'Statut Protection Différentielle 87L',
            labelEn: 'Line Differential 87L Feasibility',
            value: (isOpticalBudgetOk && isLatencyOk) ? 'AUTORISÉE' : 'REPLI EN DISTANCE',
            unit: '',
            statusFr: (isOpticalBudgetOk && isLatencyOk) ? 'Déclenchement instantané sub-cycle possible sans amplificateur' : 'Répéteur optique EDFA ou repli en protection de distance 21 requis',
            statusEn: (isOpticalBudgetOk && isLatencyOk) ? 'Instantaneous sub-cycle tripping approved without optical repeater' : 'Optical EDFA repeater or fallback to distance protection 21 mandated'
          }
        ];
      }
    },

    faultSequence: [
      {
        time: 't = 0.0 ms',
        eventFr: 'Rupture Brutale d\'un Brin Optique OPGW sur Coup de Vent / Chute d\'Arbre',
        eventEn: 'Abrupt OPGW Optical Fiber Severance Due to Storm / Tree Collapse',
        detailFr: 'Une branche lourde s\'abat sur la portée 225 kV, brisant le câble OPGW. L\'atténuation optique passe instantanément de 18 dB à l\'infini sur le chemin de travail actif (Working Path).',
        detailEn: 'A fallen tree tears into the 225 kV line span, breaking the OPGW cable. Optical attenuation instantaneously surges to infinity on the active Working Path.'
      },
      {
        time: 't = +0.8 ms',
        eventFr: 'Détection Perte de Signal (LOS) & Rupture de Trames BFD',
        eventEn: 'Optical Loss of Signal (LOS) & BFD Frame Timeout Detection',
        detailFr: 'Le récepteur optique SFP+ du nœud MPLS-TP constate l\'absence d\'énergie lumineuse (LOS). En parallèle, 3 trames consécutives BFD matérielles sont manquées.',
        detailEn: 'The optical SFP+ transceiver on the MPLS-TP node registers Loss of Signal (LOS). Simultaneously, 3 consecutive hardware BFD probe frames fail to arrive.'
      },
      {
        time: 't = +9.9 ms',
        eventFr: 'Déclenchement Automatique du Basculement de Protection MPLS-TP 1:1',
        eventEn: 'MPLS-TP 1:1 Linear Path Protection Switching Triggered',
        detailFr: 'L\'automate de commutation matérielle G.8113.1 bascule immédiatement les étiquettes de routage vers le chemin optique de secours géographiquement diversifié (Protect Path).',
        detailEn: 'The ITU-T G.8113.1 hardware switching engine immediately redirects MPLS transport labels onto the geographically diverse backup Protect Path.'
      },
      {
        time: 't = +38.0 ms',
        eventFr: 'Rétablissement Complet du Canal Téléprotection & Re-synchronisation IEEE C37.94',
        eventEn: 'Complete Teleprotection Channel Recovery & IEEE C37.94 Re-synchronization',
        detailFr: 'Le flux de téléprotection différentielle 87L et les paquets SCADA 104 reprennent leur transit normal. Le relais 87L compense le nouveau temps de propagation RTT sans aucun déclenchement intempestif.',
        detailEn: 'The 87L line differential stream and SCADA 104 packets resume seamless transmission. The 87L relay equalizes the new RTT delay with zero false trip assertions.'
      },
      {
        time: 't = +500 ms',
        eventFr: 'Diagnostic Automatique OTDR & Localisation Précise du Pylône Endommagé',
        eventEn: 'Automated OTDR Diagnostics & Precise Damaged Tower Geolocation',
        detailFr: 'L\'appareil de réflectométrie OTDR embarqué émet une impulsion laser et calcule la distance exacte du point de rupture : "Défaut à 43.8 km du poste - Pylône P148". L\'équipe d\'astreinte SONATREL est dépêchée sur place.',
        detailEn: 'The embedded continuous OTDR module fires diagnostic laser pulses, calculating the exact fault distance: "Break detected at 43.8 km - Tower P148". SONATREL emergency line crews are dispatched.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Puissance Optique Reçue (Rx Power) & Émise (Tx Power) par Port SFP',
        nameEn: 'Received (Rx) & Transmitted (Tx) Optical Power per SFP Port',
        sensorFr: 'Circuits de télémétrie numérique intégrés DDM / DOM (Digital Optical Monitoring)',
        sensorEn: 'Embedded Digital Diagnostic Monitoring (DDM / DOM) telemetry on SFP+ modules',
        rate: 'Surveillance continue toutes les secondes avec seuils d\'alerte préventive (-28 dBm)',
        protocol: 'SNMP v3 / Netconf-YANG / CLI'
      },
      {
        nameFr: 'Taux d\'Erreur Binaire (BER) & Trames Erronées CRC sur Canal C37.94',
        nameEn: 'Bit Error Rate (BER) & CRC Errored Seconds on C37.94 Interface',
        sensorFr: 'Compteurs matériels de contrôle de redondance cyclique dans l\'ASIC C37.94',
        sensorEn: 'Hardware cyclic redundancy check (CRC) counters inside C37.94 ASIC controller',
        rate: 'Comptage temps réel au fil de l\'eau (alarme si BER > 10⁻⁶)',
        protocol: 'IEEE C37.94 Yellow Alarm / CEI 61850 MMS'
      },
      {
        nameFr: 'Temps de Transit Aller-Retour (RTT) & Écart d\'Asymétrie Tx/Rx',
        nameEn: 'Round-Trip Propagation Delay (RTT) & Tx/Rx Path Asymmetry Skew',
        sensorFr: 'Horodatage nanoseconde matériel des trames de test de délai de phase',
        sensorEn: 'Nanosecond hardware timestamping of phase delay diagnostic measurement frames',
        rate: 'Calcul cyclique toutes les 100 ms',
        protocol: 'IEEE C37.94 / IEEE 1588v2 PTP'
      },
      {
        nameFr: 'Tension de Batterie 48 V DC & Ondulation Résiduelle Redresseurs Télécom',
        nameEn: 'Telecom 48 V DC Battery String Voltage & Rectifier Ripple Voltage',
        sensorFr: 'Contrôleur numérique d\'atelier d\'énergie avec mesure d\'impédance interne de batterie',
        sensorEn: 'Digital power plant supervisory controller with battery internal resistance tracking',
        rate: 'Échantillonnage toutes les 5 secondes',
        protocol: 'Modbus TCP / SNMP v3'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Support Physique)',
        nameFr: 'Infrastructure Optique & Pylônes Haute Tension',
        nameEn: 'Passive Optical Infrastructure & Transmission Towers',
        descFr: 'Câbles de garde OPGW montés en tête de pylônes 225 kV, boîtes de jonction d\'épissures étanches IP68 et répartiteurs optiques ODF.',
        descEn: 'OPGW shield wires mounted on 225 kV tower apexes, IP68 watertight splice enclosures, and optical distribution frames.',
        response: '< 0.01 ms'
      },
      {
        level: 'Niveau 1 (Couche Physique Active)',
        nameFr: 'Transceivers Optiques & Interfaces de Ligne',
        nameEn: 'Optical Transceivers & Physical Line Interfaces',
        descFr: 'Modules optiques SFP+ 10 Gbps longue portée (1550 nm, budget 32 dB), transceivers C37.94 et amplificateurs optiques à fibre dopée erbium (EDFA).',
        descEn: 'Long-reach 10 Gbps SFP+ optical transceivers (1550 nm, 32 dB budget), C37.94 transceivers, and EDFA optical amplifiers.',
        response: '< 0.3 ms'
      },
      {
        level: 'Niveau 2 (Couche Transport & Commutation)',
        nameFr: 'Châssis MPLS-TP Déterministes & Commutateurs Durcis',
        nameEn: 'Deterministic MPLS-TP Nodes & Ruggedized Core Switches',
        descFr: 'Équipements de multiplexage et commutation de paquets garantissant la réservation de bande passante, le basculement 1:1 < 50 ms et l\'isolation stricte des flux.',
        descEn: 'Packet multiplexing and switching equipment providing guaranteed CIR/EIR bandwidth reservations, sub-50ms protection switching, and strict traffic isolation.',
        response: '< 50 ms'
      },
      {
        level: 'Niveau 3 (Supervision Globale & NOC)',
        nameFr: 'Système de Gestion de Réseau (NMS) & Centre d\'Exploitation Télécom',
        nameEn: 'Network Management System (NMS) & Utility Telecom Operating Center',
        descFr: 'Plateforme centrale de supervision cartographique de l\'ensemble des liens OPGW, alarmes de niveau de signal optique, gestion des certificats CEI 62351 et dispatching des équipes terrain.',
        descEn: 'Centralized network management platform monitoring OPGW link status, optical power alarms, IEC 62351 PKI certificates, and dispatching field repair crews.',
        response: '1 – 2 s'
      }
    ],

    internationalCase: {
      location: 'France & Interconnexions Européennes',
      titleFr: 'Réseau de Télécommunications Optique Déterministe Haut Débit RTE (France)',
      titleEn: 'RTE France High-Speed Deterministic Optical Grid Backbone',
      capacity: 'Plus de 25 000 km de câbles OPGW reliant tous les postes 400 kV et 225 kV',
      highlightsFr: 'Migration intégrale des liaisons SDH/TDM historiques vers une infrastructure tout-paquet MPLS-TP déterministe avec support natif des canaux de téléprotection IEEE C37.94 (< 4 ms de latence moyenne), doublement systématique des chemins optiques et supervision continue de l\'intégrité des fibres par réflectométrie OTDR automatique.',
      highlightsEn: 'Comprehensive utility migration from legacy SDH/TDM to deterministic MPLS-TP packet-optical transport natively supporting IEEE C37.94 teleprotection circuits (< 4 ms average latency), absolute physical path route diversity, and continuous in-service automated OTDR fiber health monitoring.'
    },

    cameroonCase: {
      assetLocation: 'Cameroun (Liaisons 225 kV Nachtigal - Yaoundé - Edéa - Douala)',
      titleFr: 'Dorsale Télécom Optique OPGW du Réseau Interconnecté Sud (SONATREL)',
      titleEn: 'SONATREL Southern Interconnected Grid 225 kV OPGW Optical Backbone',
      notesFr: 'Épine dorsale stratégique de télécommunication de transport d\'électricité au Cameroun : les câbles OPGW 48 FO installés sur les lignes 225 kV Nachtigal - Nyom 2 (Yaoundé) et Mangombé (Edéa) - Oyomabang interconnectent les centrales de production majeures (Nachtigal 420 MW, Song Loulou 384 MW, Edéa 276 MW) avec le Dispatching National de Conduite de SONATREL. Ils assurent simultanément la téléprotection différentielle des lignes, la téléconduite SCADA CEI 60870-5-104 et la téléphonie de sécurité d\'exploitation.',
      notesEn: 'Strategic high-voltage utility communications backbone in Cameroon: 48-fiber OPGW cables installed along 225 kV links (Nachtigal - Nyom 2 Yaoundé, Mangombé Edéa - Oyomabang Douala) interconnect major generating hubs (Nachtigal 420 MW, Song Loulou 384 MW, Edéa 276 MW) with the SONATREL National Dispatching Center. They simultaneously transport line differential teleprotection, encrypted IEC 60870-5-104 SCADA, and operational voice dispatch circuits.'
    },

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Télécommunications Réseau & OPGW',
        roleFromEn: 'Utility Telecommunications & OPGW Engineer',
        roleToFr: 'Ingénieur Lignes Aériennes & Pylônes HT',
        roleToEn: 'Overhead Transmission Lines Engineer',
        phase: 'Étude d\'Armement & Flèche Câble OPGW',
        dataExchangedFr: 'Tension mécanique de pose (UTS), portée maximale entre pylônes et courant de court-circuit admissible I²t.',
        dataExchangedEn: 'Mechanical stringing tension (UTS), ruling span length, and allowable short-circuit thermal capacity I²t.',
        decisionFr: 'Sélection d\'un câble OPGW 48 FO à tube inox central et torons d\'aluminium ACS résistant à 150 kA²s.',
        decisionEn: 'Selected 48-fiber stainless-steel loose-tube OPGW with ACS outer strands rated for 150 kA²s lightning energy.',
        impactFr: 'Protection totale contre la foudre et garantie de durée de vie des fibres supérieure à 35 ans.',
        impactEn: 'Complete lightning shielding immunity and guaranteed fiber operational lifespan exceeding 35 years.'
      },
      {
        roleFromFr: 'Ingénieur Télécommunications Réseau & OPGW',
        roleFromEn: 'Utility Telecommunications & OPGW Engineer',
        roleToFr: 'Ingénieur Protection & Contrôle-Commande (D11)',
        roleToEn: 'Protection & Digital Relay Engineer',
        phase: 'Qualification Canal IEEE C37.94 Protection 87L',
        dataExchangedFr: 'Latence de transit unidirectionnelle mesurée (< 5 ms) et asymétrie maximale de délai Tx/Rx (< 0.20 ms).',
        dataExchangedEn: 'Measured one-way optical propagation delay (< 5 ms) and maximum Tx/Rx asymmetry skew (< 0.20 ms).',
        decisionFr: 'Attribution d\'un pseudowire MPLS-TP à réservation stricte de bande (CIR = 2 Mbps) sans multiplexage statistique.',
        decisionEn: 'Assigned dedicated MPLS-TP pseudowire with hard CIR = 2 Mbps bandwidth reservation and zero statistical oversubscription.',
        impactFr: 'Verrouillage sécurisé des déclenchements différentiels 87L et élimination de tout risque de déclenchement intempestif.',
        impactEn: 'Secure line differential 87L tripping authorization with zero false trips during external faults.'
      },
      {
        roleFromFr: 'Ingénieur Télécommunications Réseau & OPGW',
        roleFromEn: 'Utility Telecommunications & OPGW Engineer',
        roleToFr: 'Ingénieur SCADA & Automatisation Poste (D12)',
        roleToEn: 'Substation SCADA & SAS Engineer',
        phase: 'Déploiement Passerelle Téléconduite CEI 60870-5-104',
        dataExchangedFr: 'Plages d\'adresses IP industrielles, certificats X.509 et tunnels VPN IPsec chiffrés vers le Dispatching SONATREL.',
        dataExchangedEn: 'Industrial subnet addressing, X.509 PKI certificates, and encrypted IPsec VPN tunnels to SONATREL Dispatching.',
        decisionFr: 'Mise en œuvre du chiffrement matériel AES-GCM-256 (CEI 62351-3) avec rotation automatique des clés.',
        decisionEn: 'Deployed hardware-accelerated AES-GCM-256 cipher engines (IEC 62351-3) with automated certificate renewal.',
        impactFr: 'Conformité cybersécurité absolue et temps de transfert des télécommandes < 50 ms.',
        impactEn: 'Full cybersecurity compliance and guaranteed telecommand transmission latency under 50 ms.'
      }
    ],

    relatedDomains: [
      {
        code: 'D03',
        nameFr: 'Lignes de Transport Aériennes & Souterraines',
        nameEn: 'Transmission Lines & Cables',
        relationshipFr: 'Fournit les pylônes et portées pour le déploiement du câble de garde à fibres optiques (OPGW).',
        relationshipEn: 'Supplies transmission towers and spans carrying the Optical Ground Wire (OPGW) overhead backbone.'
      },
      {
        code: 'D11',
        nameFr: 'Protection & Systèmes de Surveillance',
        nameEn: 'Protection & Digital Relays',
        relationshipFr: 'Utilise le canal IEEE C37.94 pour échanger les courants instantanés entre relais différentiels de ligne 87L.',
        relationshipEn: 'Utilizes the IEEE C37.94 optical pipe to exchange instantaneous current samples between 87L differential relays.'
      },
      {
        code: 'D12',
        nameFr: 'Automatisation, SCADA & Contrôle Industriel',
        nameEn: 'Automation & SCADA Control',
        relationshipFr: 'Achemine les flux de télécommande et télémesure CEI 60870-5-104 de la passerelle RTU vers le SCADA national.',
        relationshipEn: 'Transports IEC 60870-5-104 telecommands and telemetries from substation RTU gateways to national SCADA.'
      },
      {
        code: 'D02',
        nameFr: 'Architecture & Stabilité Réseau',
        nameEn: 'Grid Architecture & Stability',
        relationshipFr: 'Relie les postes d\'interconnexion stratégiques au Dispatching National de Conduite (CNC) de Yaoundé.',
        relationshipEn: 'Connects strategic interconnected substations to the SONATREL National Control Center (CNC) in Yaoundé.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage HT',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Héberge les répartiteurs optiques ODF, châssis de télécoms et redresseurs secourus 48 V DC dans le bâtiment de commande.',
        relationshipEn: 'Houses ODF optical patch racks, telecom transport nodes, and 48 V DC battery power systems in the control building.'
      }
    ]
  },

  D14: {
    domainCode: 'D14',
    titleFr: 'Qualité d\'Énergie, Harmoniques, Stabilité Dynamique & CEM',
    titleEn: 'Power Quality, Harmonics, Dynamic Stability & Electromagnetic Compatibility',
    summaryFr: 'Dépollution harmonique active, compensation réactive STATCOM, maîtrise du flicker et immunité CEM selon CEI 61000 & IEEE 519.',
    summaryEn: 'Active harmonic mitigation, STATCOM dynamic reactive support, flicker suppression and substation EMC per IEC 61000 & IEEE 519.',
    voltageRange: '0.4 kV (BT) à 225 kV (HTB) · Nœuds PCC critiques',
    primaryStandard: 'CEI 61000-4-30 (Classe A) / IEEE 519-2022 / EN 50160',
    inputsFr: 'Tension triphasée distordue, courants harmoniques non-linéaires Ih (H5, H7, H11, H13), puissances réactives fluctuantes Q(t).',
    inputsEn: 'Distorted 3-phase bus voltage, non-linear harmonic load currents Ih (5th, 7th, 11th, 13th), dynamic fluctuating reactive power Q(t).',
    coreTransformFr: 'Transformée de Park p-q en temps réel, injection active en opposition de phase (-Ih) par onduleur IGBT 3-niveaux NPC, soutien dynamique de tension par STATCOM MMC ±Q Mvar et filtrage anti-résonance LC désaccordé (p = 7%).',
    coreTransformEn: 'Real-time p-q Park coordinate transformation, active counter-phase harmonic current cancellation (-Ih) via 3-level NPC IGBT converter, sub-cycle STATCOM MMC reactive stabilization, and 7% detuned LC harmonic anti-resonance filtering.',
    outputsFr: 'Tension sinusoïdale pure THDu ≤ 2.5%, courant réseau dépollué THDi ≤ 5%, atténuation du papillotement flicker Pst ≤ 0.8, conformité contractuelle IEEE 519.',
    outputsEn: 'Pure sinusoidal PCC voltage THDu ≤ 2.5%, clean grid current THDi ≤ 5%, flicker attenuation Pst ≤ 0.8, contractual IEEE 519 grid code compliance.',
    faultClearingTime: '< 5 ms (Temps de réponse APF) / < 20 ms (Soutien dynamique STATCOM) / < 100 ms (Protection 51H)',

    architectureStages: [
      {
        tag: 'PCC-BUSBAR',
        nameFr: 'Point de Raccordement Commun (PCC) & Jeu de Barres 30 kV / 225 kV',
        nameEn: 'Point of Common Coupling (PCC) & High-Voltage Busbar Interface',
        descFr: 'Nœud électrique de livraison où s\'exercent les limites contractuelles de qualité d\'onde (IEEE 519 / EN 50160). Les courants harmoniques injectés par les charges industrielles non-linéaires y créent des chutes de tension harmoniques au travers de l\'impédance de court-circuit du réseau.',
        descEn: 'Contractual grid delivery node where utility power quality compliance limits apply (IEEE 519 / EN 50160). Non-linear industrial harmonic currents circulate across grid short-circuit impedance, developing harmonic voltage drops.',
        parameter: 'Taux THDu & Puissance de Court-Circuit',
        nominalValue: 'THDu max ≤ 5.0% (HTA) / ≤ 2.5% (HTB) · Ssc = 500 à 2500 MVA au PCC'
      },
      {
        tag: 'APF-INVERTER',
        nameFr: 'Filtre Actif Shunt Parallèle (APF) & Onduleur IGBT 3-Niveaux NPC',
        nameEn: 'Shunt Active Power Filter (APF) & 3-Level NPC IGBT Inverter',
        descFr: 'Convertisseur statique quatre quadrants branché en parallèle sur le jeu de barres, injectant en temps réel des courants exactement opposés aux courants harmoniques détectés (-Ih) jusqu\'au rang 50, annulant la distorsion en amont.',
        descEn: 'Shunt-connected four-quadrant static converter dynamically injecting instantaneous counter-phase currents (-Ih) up to the 50th harmonic order, neutralizing harmonic flow upstream into the power utility grid.',
        parameter: 'Bande Passante & Temps de Réponse',
        nominalValue: 'Temps de réponse transitoire < 5 ms · Fréquence de découpage IGBT 12-20 kHz · Rendement > 97.5%'
      },
      {
        tag: 'STATCOM-MMC',
        nameFr: 'Compensateur Statique Synchrone (STATCOM) & Réacteur de Liaison',
        nameEn: 'Modular Multilevel Converter STATCOM & Coupling Reactor',
        descFr: 'Source de tension statique basée sur une architecture multi-niveaux modulaire (MMC) capable d\'injecter ou d\'absorber de la puissance réactive dynamique (±Q Mvar) en moins d\'un cycle réseau pour éliminer le flicker et stabiliser la tension.',
        descEn: 'Modular Multilevel Converter (MMC) static voltage source dynamically providing capacitive or inductive reactive power (±Q Mvar) in under one cycle (< 20 ms) to suppress flicker and sustain voltage during network sags.',
        parameter: 'Dynamique Réactive & Sévérité Flicker',
        nominalValue: 'Capacité dynamique ±10 à ±50 Mvar · Réduction du Flicker Pst < 0.8 · Soutien creux tension sub-cycle'
      },
      {
        tag: 'CLASS-A-ANALYZER',
        nameFr: 'Analyseur de Qualité d\'Énergie Certifié Classe A (CEI 61000-4-30 Ed. 3)',
        nameEn: 'Certified Class A Power Quality Analyzer (IEC 61000-4-30 Ed. 3)',
        descFr: 'Instrument numérique d\'étalonnage haute précision mesurant en continu la tension efficace, les harmoniques 10/12 cycles sans trou (FFT CEI 61000-4-7), les creux de tension, les transitoires ultrarapides et le déséquilibre de phase avec synchronisation GPS/PTP.',
        descEn: 'High-precision measurement instrument continuously sampling gapless 10/12-cycle RMS windows (FFT per IEC 61000-4-7), voltage sags/swells, transient surges, and negative-sequence unbalance with GPS/PTP sub-microsecond timestamping.',
        parameter: 'Précision de Mesure & Échantillonnage',
        nominalValue: 'Incertitude de mesure < 0.1% U_nom · Échantillonnage transitoire 1 MHz · Horodatage PTP < 1 µs'
      }
    ],

    equipmentList: [
      {
        tag: 'APF-400-690V',
        nameFr: 'Filtre Actif Shunt Haute Puissance 400 V / 690 V (APF)',
        nameEn: 'High-Power Shunt Active Power Filter (APF) 400 V / 690 V',
        category: 'Systèmes de Dépollution & Filtrage Harmonique',
        standard: 'CEI 62477-1 / IEEE 519',
        roleFr: 'Génère en temps réel les composantes harmoniques d\'opposition pour dépolluer les jeux de barres alimentant les charges non-linéaires industrielles.',
        roleEn: 'Generates instantaneous counter-phase harmonic components neutralizing pollution on busbars feeding heavy non-linear loads.',
        workingPrincipleFr: 'Convertisseur de source de tension à IGBT utilisant la transformée de Park en boucle fermée pour injecter un courant exactement égal à -Ih(t).',
        workingPrincipleEn: 'Voltage-source converter using closed-loop Park coordinates to synthesize and inject instantaneous counter-currents -Ih(t).',
        componentsFr: ['Pont d\'onduleur 3-niveaux IGBT NPC', 'Filtre de couplage inductif LCL', 'Carte DSP / FPGA temps réel', 'Transformateurs de courant de mesure rapide', 'Condensateurs de bus DC haute énergie'],
        componentsEn: ['3-level NPC IGBT inverter bridge', 'Inductive LCL coupling ripple filter', 'Real-time DSP / FPGA processor board', 'High-speed measurement current transformers', 'High-energy DC-link film capacitors'],
        ratings: [
          { labelFr: 'Courant de Compensation', labelEn: 'Compensation Current', value: '300', unit: 'A' },
          { labelFr: 'Atténuation Harmonique', labelEn: 'Harmonic Attenuation', value: '≥ 92', unit: '%' },
          { labelFr: 'Temps de Réponse', labelEn: 'Response Time', value: '< 5', unit: 'ms' },
          { labelFr: 'Tension Bus DC', labelEn: 'DC Bus Voltage', value: '800', unit: 'V' }
        ],
        failureModesFr: 'Claquer thermique des IGBT par défaut de ventilation, perte d\'un capteur TC de mesure faussant l\'algorithme de Park, surtension transitoire sur le bus continu DC.',
        failureModesEn: 'IGBT thermal failure due to ventilation loss, current sensor CT failure distorting Park algorithm, DC-link bus transient overvoltage.'
      },
      {
        tag: 'CAP-DETUNED-7PCT',
        nameFr: 'Batterie de Condensateurs HTA avec Selfs d\'Anti-Résonance 7%',
        nameEn: 'Medium-Voltage Capacitor Bank with 7% Detuning Anti-Resonance Reactors',
        category: 'Systèmes de Dépollution & Filtrage Harmonique',
        standard: 'CEI 60871-1 / CEI 60076-6',
        roleFr: 'Fournit la compensation de facteur de puissance sans créer de résonance parallèle dangereuse avec les harmoniques de rang 5 (250 Hz).',
        roleEn: 'Delivers fundamental reactive power compensation without amplifying dangerous parallel LC resonance at the 5th harmonic (250 Hz).',
        workingPrincipleFr: 'La self en série décale la fréquence de résonance du banc à 189 Hz (en dessous de 250 Hz), rendant la branche inductive pour tous les harmoniques supérieurs.',
        workingPrincipleEn: 'Series reactor tunes bank natural resonance to 189 Hz (below 250 Hz), ensuring inductive behavior for all higher harmonic orders.',
        componentsFr: ['Cellules de condensateurs tout-film à diélectrique polypropylène', 'Selfs à air à linéarité totale', 'Fusibles internes haute capacité', 'Résistances de décharge rapide < 50 V en 60 s', 'Contacteurs à vide à pré-coupure'],
        componentsEn: ['All-film polypropylene dielectric capacitor units', 'Linear air-core detuning reactors', 'Internal high-rupture fuses', 'Rapid discharge bleeders < 50 V in 60s', 'Vacuum contactors with pre-insertion damping'],
        ratings: [
          { labelFr: 'Puissance Réactive', labelEn: 'Reactive Power', value: '6.0', unit: 'Mvar' },
          { labelFr: 'Facteur de Désaccord p', labelEn: 'Detuning Factor p', value: '7.0', unit: '%' },
          { labelFr: 'Fréquence de Résonance fr', labelEn: 'Resonance Frequency', value: '189', unit: 'Hz' },
          { labelFr: 'Tension Nominale', labelEn: 'Rated Voltage', value: '33', unit: 'kV' }
        ],
        failureModesFr: 'Claquer d\'éléments capacitifs internes modifiant la fréquence de résonance, échauffement excessif de la self par forte teneur harmonique H5, claquage diélectrique sur surtension transitoire.',
        failureModesEn: 'Internal dielectric cell breakdown shifting resonance frequency, reactor thermal overload from excessive 5th harmonics, transient lightning surge puncture.'
      },
      {
        tag: 'STATCOM-MMC-25MVAR',
        nameFr: 'Compensateur Statique Synchrone STATCOM MMC ±25 Mvar',
        nameEn: 'Modular Multilevel Converter STATCOM System ±25 Mvar',
        category: 'Compensation Réactive Dynamique & Soutien de Tension',
        standard: 'IEEE 1052 / CEI 62501',
        roleFr: 'Stabilisation dynamique ultra-rapide de la tension du réseau et suppression du papillotement flicker produit par les charges cycliques.',
        roleEn: 'Ultra-fast dynamic voltage stabilization and flicker attenuation produced by fluctuating cyclical loads.',
        workingPrincipleFr: 'Convertisseur multi-niveaux à chaîne de sous-modules générant une tension alternative pure à amplitude et phase ajustables pour absorber ou injecter Q en sub-cycle.',
        workingPrincipleEn: 'Cascaded submodule converter synthesizing near-ideal AC waveform with dynamic amplitude and phase to inject or absorb Q in sub-cycle response.',
        componentsFr: ['Chaîne de sous-modules IGBT demi-pont', 'Réacteurs de bras et d\'interface réseau', 'Système de refroidissement eau déminéralisée', 'Contrôleur de commande rapprochée fibre optique', 'Transformateur d\'élévation HTB 30/90 kV'],
        componentsEn: ['Cascaded half-bridge IGBT submodules', 'Phase arm and grid coupling reactors', 'Deionized closed-loop water cooling system', 'Optical fiber gate control unit', 'Step-up interconnect transformer 30/90 kV'],
        ratings: [
          { labelFr: 'Plage Dynamique Q', labelEn: 'Dynamic Q Range', value: '±25', unit: 'Mvar' },
          { labelFr: 'Temps de Montée', labelEn: 'Response Rise Time', value: '< 15', unit: 'ms' },
          { labelFr: 'Tension Réseau', labelEn: 'Grid Voltage', value: '30', unit: 'kV' },
          { labelFr: 'Distorsion Propre THDu', labelEn: 'Self Harmonic THDu', value: '< 1.0', unit: '%' }
        ],
        failureModesFr: 'Court-circuit interne d\'un condensateur de sous-module contourné par thyristor de bypass, fuite dans le circuit de refroidissement eau, perte de communication optique de gâchette.',
        failureModesEn: 'Submodule DC capacitor internal breakdown isolated via bypass thyristor, deionized water coolant leak, optical gate communication interruption.'
      },
      {
        tag: 'PQ-RECORDER-CLASSA',
        nameFr: 'Centrale de Mesure Qualité Réseau Certifiée Classe A',
        nameEn: 'Certified Class A Power Quality & Disturbance Recorder',
        category: 'Métrologie Classe A, CEM & Protection Transitoire',
        standard: 'CEI 61000-4-30 Ed. 3 Classe A / CEI 61850',
        roleFr: 'Enregistrement permanent certifié conforme pour arbitrage légal des creux, surtensions, harmoniques et flicker selon la norme EN 50160.',
        roleEn: 'Certified continuous monitoring for regulatory contractual audits of sags, swells, harmonics, and flicker per EN 50160 standards.',
        workingPrincipleFr: 'Numérisation continue sans interruption à 1024 points par cycle avec calcul FFT normalisé 10 cycles (CEI 61000-4-7) et horodatage PTP < 1 µs.',
        workingPrincipleEn: 'Continuous gapless 1024 samples/cycle digitization with standardized 10-cycle FFT windows and PTP sub-microsecond timestamping.',
        componentsFr: ['Convertisseur A/N 24 bits haute précision', 'Processeur DSP de transformée de Fourier rapide', 'Horloge synchronisée PTP IEEE 1588 / GPS', 'Mémoire flash durcie pour fichiers PQDIF', 'Port Ethernet optique CEI 61850 MMS'],
        componentsEn: ['High-precision 24-bit A/D converter', 'DSP fast Fourier transform coprocessor', 'PTP IEEE 1588 / GPS synchronization clock', 'Rugged solid-state memory for PQDIF files', 'IEC 61850 MMS optical Ethernet port'],
        ratings: [
          { labelFr: 'Incertitude Mesure U', labelEn: 'Voltage Measurement Accuracy', value: '0.1', unit: '%' },
          { labelFr: 'Échantillonnage Transitoire', labelEn: 'Transient Sampling', value: '1.0', unit: 'MHz' },
          { labelFr: 'Synchronisation PTP', labelEn: 'PTP Synchronization', value: '< 1', unit: 'µs' },
          { labelFr: 'Rangs Harmoniques', labelEn: 'Harmonic Range', value: 'H1-H63', unit: 'ordres' }
        ],
        failureModesFr: 'Désynchronisation de l\'horloge GPS entraînant l\'invalidation de la certification Classe A, corruption du stockage flash suite à coupure d\'alimentation auxiliaire non secourue.',
        failureModesEn: 'Loss of GPS lock invalidating Class A normative legal standing, solid-state flash memory corruption following non-backed-up auxiliary supply drop.'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 51H',
        nameFr: 'Protection contre la Surcharge Harmonique de Banc de Condensateurs',
        nameEn: 'Capacitor Bank Harmonic Overload Thermal Protection',
        standard: 'IEEE C37.99 / CEI 60871',
        principleFr: 'Calcule en temps réel le courant efficace total incluant toutes les composantes harmoniques pour protéger le diélectrique des condensateurs contre l\'emballement thermique.',
        principleEn: 'Continuously measures true RMS current across all harmonic orders to safeguard capacitor cell dielectric against thermal runaway.',
        typicalSetting: 'Seuil d\'alarme à I_rms = 1.15 I_nom; Seuil de déclenchement temporisé à I_rms = 1.30 I_nom pendant t = 2.0 s; Blocage sur appel de courant transitoire.'
      },
      {
        ansiCode: 'ANSI 59 / 59N',
        nameFr: 'Protection contre les Surtensions Temporaires & Ferro-résonance',
        nameEn: 'Temporary Overvoltage (TOV) & Ferroresonance Protection',
        standard: 'CEI 60255-127',
        principleFr: 'Détecte les hausses brutales de tension fondamentale ou homopolaire causées par le rejet de charge ou la résonance série, commandant le déclenchement immédiat des bancs capacitifs.',
        principleEn: 'Identifies sudden fundamental or neutral displacement overvoltages caused by load shedding or series resonance, commanding fast capacitor tripping.',
        typicalSetting: 'Seuil échelon 1 : U > 1.15 Un pendant t = 100 ms; Seuil échelon 2 : U > 1.30 Un instantané t = 20 ms; Ordre de délestage gradins et forçage STATCOM inductif.'
      },
      {
        ansiCode: 'ANSI 47 / 46',
        nameFr: 'Protection contre le Déséquilibre de Tension & Composante Inverse (u2)',
        nameEn: 'Negative-Sequence Voltage Unbalance Protection (u2)',
        standard: 'CEI 61000-2-4 / IEEE 1159',
        principleFr: 'Calcule le ratio de la composante inverse sur la composante directe (u2 = U_inv / U_dir) produit par les charges monophasées ferroviaires ou fours à arc pour protéger les moteurs.',
        principleEn: 'Computes ratio of negative to positive sequence voltage (u2 = U_inv / U_dir) produced by unbalanced industrial or traction loads to prevent rotor overheating.',
        typicalSetting: 'Seuil alarme : u2 > 1.5% pendant t = 10 s; Seuil déclenchement : u2 > 2.0% pendant t = 3.0 s; Déclenchement sélectif des départs industriels asymétriques.'
      },
      {
        ansiCode: 'ANSI 27-PQ',
        nameFr: 'Surveillance Dynamique des Creux de Tension (Voltage Sag Ride-Through)',
        nameEn: 'Dynamic Voltage Sag Supervision & Fault Ride-Through (FRT)',
        standard: 'CEI 61000-4-11 / CEI 61850-7-4',
        principleFr: 'Surveille la profondeur et la durée des creux de tension selon la courbe contractuelle FRT du code réseau, verrouillant les déclenchements intempestifs et ordonnant l\'injection réactive STATCOM.',
        principleEn: 'Tracks voltage dip magnitude and duration per contractual grid code FRT curves, preventing false tripping while commanding STATCOM reactive current injection.',
        typicalSetting: 'Creux détecté si U < 0.85 Un pendant Δt > 20 ms; Verrouillage déclenchement filtres passifs; Forçage consigne réactive STATCOM Iq = 2.0 * (1 - U/Un) * In.'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur d\'Atténuation Harmonique & Risque de Résonance LC (IEEE 519)',
      titleEn: 'Harmonic Attenuation & LC Resonance Risk Simulator (IEEE 519)',
      descFr: 'Ajustez le taux de compensation du filtre actif APF (0 à 100%) pour visualiser en direct la réduction du THD de tension, l\'atténuation des harmoniques de rangs 5 et 7 et la marge de conformité IEEE 519 au point de livraison 30 kV.',
      descEn: 'Adjust the Shunt Active Power Filter (APF) compensation rate (0 to 100%) to observe real-time THD voltage reduction, 5th/7th harmonic cancellation, and IEEE 519 compliance margin at the 30 kV PCC.',
      paramName: 'Taux de Compensation Filtre Actif (APF)',
      unit: '%',
      min: 0,
      max: 100,
      step: 5,
      initialValue: 80,
      calculate: (apfCompRate: number) => {
        const apfCompensationPct = apfCompRate;
        const loadMva = 15;
        const pccShortCircuitMva = 600;
        const detuningFactor = 7.0; // 7% detuned reactor standard SONATREL

        // Raw harmonics for 6-pulse industrial load: H5=20%, H7=14%, H11=9%, H13=7%
        const rawH5 = 0.20;
        const rawH7 = 0.14;
        const rawH11 = 0.09;
        const rawH13 = 0.07;

        // Attenuation factor provided by APF
        const apfReduction = 1.0 - (apfCompensationPct / 100) * 0.94;

        const effH5 = rawH5 * apfReduction;
        const effH7 = rawH7 * apfReduction;
        const effH11 = rawH11 * apfReduction;
        const effH13 = rawH13 * apfReduction;

        const thdiPct = Math.sqrt(effH5 ** 2 + effH7 ** 2 + effH11 ** 2 + effH13 ** 2) * 100;

        const vh5 = effH5 * 5 * (loadMva / pccShortCircuitMva);
        const vh7 = effH7 * 7 * (loadMva / pccShortCircuitMva);
        const vh11 = effH11 * 11 * (loadMva / pccShortCircuitMva);
        const vh13 = effH13 * 13 * (loadMva / pccShortCircuitMva);
        const thduPct = Math.sqrt(vh5 ** 2 + vh7 ** 2 + vh11 ** 2 + vh13 ** 2) * 100;

        const parallelResFreqHz = 50 / Math.sqrt(detuningFactor / 100); // 189 Hz
        const flickerPst = Math.max(0.35, 1.45 * (1.0 - (apfCompensationPct / 100) * 0.65));
        const isIeee519Compliant = thduPct <= 5.0;

        return [
          {
            labelFr: 'Taux THDu Tension au PCC 30 kV',
            labelEn: 'Total Harmonic Voltage Distortion (THDu)',
            value: `${thduPct.toFixed(2)} %`,
            unit: '%',
            statusFr: thduPct <= 5.0 ? 'Conforme norme IEEE 519 / EN 50160 (≤ 5.0%)' : 'Dépassement critique du seuil normatif (> 5.0%)',
            statusEn: thduPct <= 5.0 ? 'Compliant with IEEE 519 / EN 50160 (≤ 5.0%)' : 'Exceeds normative harmonic limit (> 5.0%)'
          },
          {
            labelFr: 'Taux THDi Courant Réseau Résiduel',
            labelEn: 'Residual Grid Current Distortion (THDi)',
            value: `${thdiPct.toFixed(1)} %`,
            unit: '%',
            statusFr: thdiPct <= 12.0 ? 'Excellente dépollution par APF' : 'Distorsion modérée acceptable',
            statusEn: thdiPct <= 12.0 ? 'Superior APF active attenuation' : 'Moderate harmonic current level'
          },
          {
            labelFr: 'Fréquence Résonance LC Réseau (fr)',
            labelEn: 'Grid LC Parallel Resonance Frequency',
            value: `${parallelResFreqHz.toFixed(0)} Hz`,
            unit: 'Hz',
            statusFr: 'Sécurisé : résonance calée à 189 Hz (p = 7%) sous H5',
            statusEn: 'Safe: resonance locked at 189 Hz (p = 7%) below H5'
          },
          {
            labelFr: 'Indice de Sévérité Flicker (Pst)',
            labelEn: 'Short-Term Flicker Severity (Pst)',
            value: `${flickerPst.toFixed(2)}`,
            unit: 'Pst',
            statusFr: flickerPst <= 1.0 ? 'Confort visuel garanti (CEI 61000-4-15)' : 'Papillotement perceptible',
            statusEn: flickerPst <= 1.0 ? 'Compliant with IEC 61000-4-15 (Pst ≤ 1.0)' : 'Perceptible visual flicker'
          },
          {
            labelFr: 'Statut Global Conformité IEEE 519',
            labelEn: 'IEEE 519 Overall Compliance',
            value: isIeee519Compliant ? 'CONFORME (APPROUVÉ)' : 'NON CONFORME (REJETÉ)',
            unit: '',
            statusFr: isIeee519Compliant ? 'Injection harmonique autorisée sur réseau de transport' : 'Risque échauffement transformateurs',
            statusEn: isIeee519Compliant ? 'Harmonic injection authorized on transmission grid' : 'Transformer overheating risk'
          }
        ];
      }
    },

    faultSequence: [
      {
        time: 't = 0.0 ms',
        eventFr: 'Enclenchement Brutal d\'un Four à Arc Industriel / Laminoir 25 MW',
        eventEn: 'Abrupt Industrial Electric Arc Furnace / 25 MW Rolling Mill Energization',
        detailFr: 'Une puissante charge non-linéaire s\'enclenche sur le jeu de barres HTA 30 kV. Un creux de tension plonge la tension résiduelle à 78% et injecte un pic de courant harmonique H5 et H7 de 650 A.',
        detailEn: 'A massive non-linear arc furnace strikes on the 30 kV MV busbar. Voltage dips abruptly to 78% while injecting a combined 5th and 7th harmonic current surge of 650 A.'
      },
      {
        time: 't = +2.5 ms',
        eventFr: 'Détection Haute Vitesse par Processeur DSP du Filtre Actif (APF)',
        eventEn: 'DSP High-Speed Harmonic Detection & Park Transform Computation',
        detailFr: 'L\'algorithme de puissance instantanée p-q extrait en moins d\'un demi-quart de période la composante harmonique et génère les ordres de modulation PWM aux modules IGBT.',
        detailEn: 'The DSP p-q instantaneous power algorithm isolates harmonic current vectors and delivers PWM firing modulation to 3-level IGBT gate drivers within sub-cycle time.'
      },
      {
        time: 't = +12.0 ms',
        eventFr: 'Injection Complète du Courant d\'Opposition (-Ih) & Réponse STATCOM',
        eventEn: 'Full Counter-Phase Injection (-Ih) & Fast STATCOM Reactive Support',
        detailFr: 'Le filtre actif annule 92% des harmoniques H5 et H7 au point de livraison. Simultanément, le STATCOM injecte +12 Mvar capacitifs, ramenant la tension résiduelle de 78% à 98.5%.',
        detailEn: 'The APF cancels 92% of circulating 5th/7th harmonics at the PCC. Concurrently, the STATCOM injects +12 Mvar capacitive, boosting voltage from 78% back to 98.5%.'
      },
      {
        time: 't = +100 ms',
        eventFr: 'Stabilisation Thermique du Banc de Condensateurs & Amortissement de Résonance',
        eventEn: 'Capacitor Bank Thermal Stabilization & Resonance Damping',
        detailFr: 'Grâce à la self de désaccordage 7% (189 Hz), aucune surtension harmonique ne se développe aux bornes des condensateurs. La protection ANSI 51H reste stable sans déclenchement intempestif.',
        detailEn: 'Thanks to the 7% series detuning reactor (189 Hz), no harmonic resonant overvoltage amplifies across capacitor terminals. ANSI 51H relay remains stable with zero false trip.'
      },
      {
        time: 't = +600 s',
        eventFr: 'Génération Automatique du Rapport d\'Événement par l\'Analyseur Classe A',
        eventEn: 'Automated Event Archival & PQDIF Export by Class A Analyzer',
        detailFr: 'L\'enregistreur CEI 61000-4-30 horodate le creux (profondeur 22%, durée 12 ms), confirme la conformité EN 50160 et transmet le fichier Comtrade/PQDIF au centre de conduite de SONATREL.',
        detailEn: 'The IEC 61000-4-30 recorder tags the sag (depth 22%, duration 12 ms), certifies weekly EN 50160 compliance, and forwards Comtrade/PQDIF archives to the SONATREL operations center.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Taux de Distorsion Harmonique Global en Tension (THDu)',
        nameEn: 'Total Harmonic Voltage Distortion (THDu)',
        sensorFr: 'Transformateurs de tension capacitifs/inductifs de précision Classe 0.2',
        sensorEn: 'Precision Class 0.2 Inductive/Capacitive Voltage Transformers',
        rate: 'Fenêtres glissantes continues 10 cycles (CEI 61000-4-7) / Agrégation 10 min',
        protocol: 'CEI 61850 MMS / PQDIF / Modbus TCP'
      },
      {
        nameFr: 'Spectre Harmonique Individuel par Rang (H2 à H50)',
        nameEn: 'Individual Harmonic Spectrum Breakdown (H2 to H50)',
        sensorFr: 'Échantillonnage 1024 points/cycle avec transformée de Fourier rapide (FFT)',
        sensorEn: '1024 samples/cycle continuous sampling with windowed FFT algorithm',
        rate: 'Calcul en temps réel toutes les 200 ms (10 périodes à 50 Hz)',
        protocol: 'CEI 61850-9-2 Sampled Values / MMS'
      },
      {
        nameFr: 'Sévérité du Papillotement (Flicker Court Terme Pst & Long Terme Plt)',
        nameEn: 'Voltage Flicker Severity Indices (Short-Term Pst & Long-Term Plt)',
        sensorFr: 'Modèle mathématique de flickermètre normalisé selon la CEI 61000-4-15',
        sensorEn: 'Certified flickermeter mathematical filter per IEC 61000-4-15',
        rate: 'Calcul Pst toutes les 10 minutes · Calcul Plt toutes les 2 heures',
        protocol: 'CEI 61850 MMS / SNMP v3'
      },
      {
        nameFr: 'Taux de Déséquilibre Inverse de Tension (u2 = U_inv / U_dir)',
        nameEn: 'Negative-Sequence Voltage Unbalance Ratio (u2)',
        sensorFr: 'Décomposition instantanée en composantes symétriques de Fortescue',
        sensorEn: 'Instantaneous Fortescue symmetrical sequence transformation matrix',
        rate: 'Moyenne sur 10 cycles toutes les 200 ms',
        protocol: 'CEI 61850 MMS / DNP3'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 0 (Filtrage Physique & Écran CEM)',
        nameFr: 'Selfs de Choc, Condensateurs Accordés & Blindage Électrostatique',
        nameEn: 'Tuning Reactors, Capacitor Cells & Electrostatic Shielding',
        descFr: 'Composants passifs haute tension assurant le désaccordage physique des bancs de condensateurs, l\'évacuation des transitoires par parafoudres ZnO et le blindage CEM des armoires.',
        descEn: 'High-voltage passive hardware providing fundamental detuning, transient diversion via ZnO arresters, and high-frequency enclosure shielding.',
        response: '< 0.001 ms'
      },
      {
        level: 'Niveau 1 (DSP Temps Réel Convertisseurs)',
        nameFr: 'Contrôleur Rapide FPGA/DSP des Filtres Actifs APF & STATCOM',
        nameEn: 'Real-Time FPGA/DSP Controller for APF & STATCOM Inverters',
        descFr: 'Algorithmes de transformée de Park et régulateurs de courant PI découplés générant les signaux PWM de modulation des IGBT pour l\'annulation harmonique et le soutien de tension.',
        descEn: 'Sub-millisecond Park transform and decoupled PI current regulators generating IGBT gate PWM switching sequences for real-time mitigation.',
        response: '< 5 ms'
      },
      {
        level: 'Niveau 2 (Automate de Poste & Surveillance PQ)',
        nameFr: 'Supervision Qualité d\'Énergie de Poste & Gestionnaire de Gradins',
        nameEn: 'Substation Power Quality Gateway & Capacitor Bank Stage Controller',
        descFr: 'Automate programmable régulant les gradins de condensateurs en fonction du cos phi, surveillant les surcharges thermiques harmoniques (ANSI 51H) et archivant les événements Comtrade.',
        descEn: 'Programmable bay controller stepping capacitor stages to target power factor, monitoring harmonic heating (ANSI 51H), and logging Comtrade records.',
        response: '50 ms – 1 s'
      },
      {
        level: 'Niveau 3 (Supervision Globale & Dispatching SONATREL)',
        nameFr: 'Système SCADA/EMS National & Plateforme Centralisée Qualité d\'Onde',
        nameEn: 'National SCADA/EMS & Centralized Power Quality Analytics Center',
        descFr: 'Supervision cartographique nationale des indicateurs de qualité (THD, creux, flicker), rapports statistiques hebdomadaires EN 50160 et coordination des consignes de tension aux grands consommateurs industriels.',
        descEn: 'Grid-wide analytics dashboard tracking PQ indices (THD, sags, flicker), EN 50160 compliance audits, and coordinating reactive dispatch to heavy consumers.',
        response: '2 – 5 s'
      }
    ],

    internationalCase: {
      location: 'Italie & Réseau Haute Tension Européen (Terna)',
      titleFr: 'Réseau STATCOM & Dépollution Harmonique pour la Transition Énergétique (Terna Italie)',
      titleEn: 'Terna Italy Multi-Terminal STATCOM & Harmonic Mitigation Program',
      capacity: 'Plus de 16 systèmes STATCOM ±125 Mvar installés aux nœuds critiques de transport',
      highlightsFr: 'Déploiement massif de compensateurs statiques synchrones (STATCOM) à technologie MMC pour remplacer l\'inertie et la puissance de court-circuit perdues lors de la fermeture des centrales thermiques à charbon. Intégration de filtres actifs haute tension pour maintenir le THDu sous 1.5% en présence de forts parcs éoliens et liaisons sous-marines HVDC.',
      highlightsEn: 'Extensive deployment of Modular Multilevel STATCOM units (±125 Mvar each) compensating for lost rotational inertia and short-circuit capacity following coal plant decommissioning. Integrated active and passive filters maintain grid THDu below 1.5% amidst massive offshore wind and HVDC interconnections.'
    },

    cameroonCase: {
      assetLocation: 'Cameroun (Complexe Industriel ALUCAM Edéa & Zone Portuaire de Douala)',
      titleFr: 'Maîtrise des Harmoniques des Cuves d\'Électrolyse ALUCAM & Zone Industrielle de Bassa (SONATREL / Eneo)',
      titleEn: 'ALUCAM Smelting Potlines Harmonic Filtering & Douala Industrial Zone Grid Quality',
      notesFr: 'Cas industriel emblématique au Cameroun : les redresseurs de puissance haute intensité (plus de 100 000 A continu) de l\'usine d\'aluminium ALUCAM à Edéa, alimentée directement depuis la centrale hydroélectrique d\'Edéa (276 MW), génèrent des harmoniques caractéristiques majeurs (H5, H7, H11, H13). Des filtres passifs accordés de forte puissance et des réactances de lissage sont indispensables pour éviter la résonance avec le réseau 90 kV et 225 kV de SONATREL. À Douala (Poste de Bassa et Koumassi), les variateurs de fréquence des industries manufacturières nécessitent des batteries désaccordées à 7% pour préserver les transformateurs de distribution contre les surchauffes diélectriques.',
      notesEn: 'Signature high-voltage industrial case study in Cameroon: the massive electrochemical rectifiers (> 100,000 A DC) at the ALUCAM aluminum smelter in Edéa, fed directly from the Edéa hydroelectric station (276 MW), produce severe characteristic harmonics (5th, 7th, 11th, 13th). Heavy-duty tuned passive filter yards and smoothing reactors prevent catastrophic resonance with the SONATREL 90 kV / 225 kV transmission grid. In Douala (Bassa and Koumassi substations), widespread industrial motor drives mandate 7% detuned capacitor banks to safeguard distribution transformers from harmonic overheating.'
    },

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Qualité d\'Énergie & Électronique de Puissance (D14)',
        roleFromEn: 'Power Quality & Power Electronics Engineer',
        roleToFr: 'Ingénieur Postes Électriques & Appareillage (D04)',
        roleToEn: 'Substation & Switchgear Engineer',
        phase: 'Étude d\'Implantation Banc de Condensateurs & Selfs HTA',
        dataExchangedFr: 'Courants harmoniques de dimensionnement, surtensions de crête et facteur de désaccordage p = 7%.',
        dataExchangedEn: 'Harmonic dimensioning currents, peak transient overvoltage, and detuning factor p = 7%.',
        decisionFr: 'Installation de selfs à air à linéarité totale protégées par des parafoudres ZnO classe 3.',
        decisionEn: 'Specified air-core linear tuning reactors backed by class 3 ZnO surge arresters.',
        impactFr: 'Élimination de tout risque de résonance ferromagnétique ou d\'explosion de condensateurs.',
        impactEn: 'Elimination of ferromagnetic resonance hazard and catastrophic capacitor rupture.'
      },
      {
        roleFromFr: 'Ingénieur Qualité d\'Énergie & Électronique de Puissance (D14)',
        roleFromEn: 'Power Quality & Power Electronics Engineer',
        roleToFr: 'Ingénieur Stabilité & Conduite Réseau (D02)',
        roleToEn: 'Grid Dynamics & System Dispatch Engineer',
        phase: 'Réglage Temps de Réponse Dynamique STATCOM ±25 Mvar',
        dataExchangedFr: 'Courbe de soutien de tension FRT, temps d\'injection de puissance réactive capacitive (< 20 ms).',
        dataExchangedEn: 'Fault Ride-Through (FRT) voltage support profile and sub-cycle reactive injection (< 20 ms).',
        decisionFr: 'Validation du gain proportionnel de régulation de tension pour prévenir les oscillations sous-synchrones.',
        decisionEn: 'Approved voltage control proportional gain parameter tuning preventing subsynchronous oscillations.',
        impactFr: 'Maintien de la stabilité de tension lors des défauts réseau N-1 dans la région du Littoral (Douala).',
        impactEn: 'Sustained voltage stability during critical N-1 contingencies across the Littoral (Douala) grid.'
      },
      {
        roleFromFr: 'Ingénieur Qualité d\'Énergie & Électronique de Puissance (D14)',
        roleFromEn: 'Power Quality & Power Electronics Engineer',
        roleToFr: 'Ingénieur Protection & Contrôle-Commande (D11)',
        roleToEn: 'Protection & Relay Engineer',
        phase: 'Coordination Seuils de Surcharge Harmonique ANSI 51H',
        dataExchangedFr: 'Courbe de tolérance thermique I²t des condensateurs et temps d\'élimination des défauts harmoniques.',
        dataExchangedEn: 'Capacitor cell thermal I²t damage curve and maximum allowable harmonic exposure duration.',
        decisionFr: 'Paramétrage du relais numérique avec seuil d\'alarme à 1.15 In et déclenchement sélectif à 1.30 In / 2s.',
        decisionEn: 'Programmed digital relay with early alarm threshold at 1.15 In and selective trip at 1.30 In / 2s.',
        impactFr: 'Protection intégrale des équipements de compensation sans déclenchement intempestif sur transitoires normaux.',
        impactEn: 'Full thermal asset protection with immunity against false trips during normal switching transients.'
      }
    ],

    relatedDomains: [
      {
        code: 'D08',
        nameFr: 'Électronique de Puissance & Convertisseurs',
        nameEn: 'Power Electronics & Inverters',
        relationshipFr: 'Les convertisseurs sont à la fois la source principale des harmoniques et la base technologique des filtres actifs APF et STATCOM.',
        relationshipEn: 'Converters are both the primary source of harmonic distortion and the technology foundation for APF and STATCOM systems.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Héberge les batteries de condensateurs, filtres passifs, réactances de lissage et parafoudres sur les jeux de barres.',
        relationshipEn: 'Houses capacitor banks, passive harmonic filters, smoothing reactors, and surge arresters on substation busbars.'
      },
      {
        code: 'D02',
        nameFr: 'Architecture & Stabilité Réseau',
        nameEn: 'Grid Architecture & Stability',
        relationshipFr: 'Le STATCOM apporte un soutien de tension sub-cycle (< 20 ms) prévenant l\'effondrement de tension sur les longues lignes.',
        relationshipEn: 'STATCOM delivers sub-cycle voltage support (< 20 ms) preventing voltage collapse across long transmission lines.'
      },
      {
        code: 'D07',
        nameFr: 'Machines Tournantes & Moteurs',
        nameEn: 'Rotating Machines & Motors',
        relationshipFr: 'Les harmoniques de tension provoquent un échauffement rotorique anormal et des pertes fer dans les moteurs industriels.',
        relationshipEn: 'Voltage harmonics cause severe rotor surface heating, vibration, and eddy-current losses in industrial machines.'
      },
      {
        code: 'D16',
        nameFr: 'Sécurité Électrique, Prises de Terre & CEM',
        nameEn: 'Electrical Safety, Earthing & EMC',
        relationshipFr: 'La maîtrise de la CEM exige des prises de terre haute fréquence à basse impédance et des blindages équipotentiels.',
        relationshipEn: 'EMC compliance relies on low-impedance high-frequency ground grids and robust equipotential cable shielding.'
      }
    ]
  },

  D15: {
    domainCode: 'D15',
    titleFr: 'Comptage Intelligent, Réseaux Numériques (Smart Grids) & Digitalisation',
    titleEn: 'Advanced Metering Infrastructure (AMI), Smart Grids & Grid Digitalization',
    summaryFr: 'Infrastructure de comptage avancé (AMI), compteurs communicants DLMS/COSEM, concentrateurs de données DCU, plateforme MDMS et optimisation bidirectionnelle de la charge.',
    summaryEn: 'Advanced Metering Infrastructure (AMI), DLMS/COSEM bidirectional smart meters, DCU data concentrators, MDMS analytics platform and digital grid optimization.',
    voltageRange: '230 V / 400 V (BT) à 225 kV (Comptage frontière HTB)',
    primaryStandard: 'CEI 62056 (DLMS/COSEM) / CEI 62053-22 (Classe 0.2S) / CEI 62055 (STS)',
    inputsFr: 'Mesures instantanées P, Q, S, U, I, fréquence, courbes de charge 15 min, index tarifaires TOU, alarmes anti-fraude.',
    inputsEn: 'Real-time 4-quadrant P, Q, S, U, I measurements, 15-minute load curves, Time-of-Use tariff registers, anti-tampering alerts.',
    coreTransformFr: 'Numérisation métrologique DSP haute précision, chiffrement cryptographique AES-128 GCM, télérelève par CPL G3 / 4G LTE / LoRaWAN, consolidation Head-End et réconciliation bilancielle MDMS.',
    coreTransformEn: 'High-precision DSP metrology sampling, AES-128 GCM cryptographic data encryption, G3-PLC / 4G LTE / LoRaWAN backhaul, Head-End ingestion and MDMS grid balance reconciliation.',
    outputsFr: 'Données de facturation certifiées, détection en temps réel des pertes non-techniques (fraudes), gestion dynamique de la pointe (Demand Response), supervision des pannes réseau (Last Gasp).',
    outputsEn: 'Audited billing settlement datasets, real-time non-technical loss (theft) localization, automated Demand Response peak shaving, power outage last-gasp notifications.',
    faultClearingTime: '< 500 ms (Déconnexion disjoncteur interne compteur) / < 2 s (Alerte coupure Last Gasp)',

    architectureStages: [
      {
        tag: 'SMART-METER-ENDPOINTS',
        nameFr: 'Compteurs Communicants Électroniques Triphasés / Monophasés (AMI)',
        nameEn: 'Bidirectional Smart Meter Endpoints (Residential, Commercial & Industrial)',
        descFr: 'Points terminaux de comptage déployés chez les abonnés et aux postes de distribution, réalisant la mesure 4-quadrants de l\'énergie active et réactive avec disjoncteur télécommandable et détection d\'ouverture de capot.',
        descEn: 'Terminal metering points deployed at consumer premises and distribution transformers, performing 4-quadrant active/reactive energy recording with remote disconnect relay and magnetic tamper sensing.',
        parameter: 'Classe de Précision & Fréquence Échantillonnage',
        nominalValue: 'Classe 0.5S ou 1.0 (BT) · 0.2S (Postes HTB) · Résolution courbe 15 min · Chiffrement AES-128'
      },
      {
        tag: 'DCU-CONCENTRATOR',
        nameFr: 'Concentrateur de Données de Poste HTA/BT (Data Concentrator Unit - DCU)',
        nameEn: 'Substation Data Concentrator Unit (DCU) & Neighborhood Area Network',
        descFr: 'Passerelle industrielle installée au poste de transformation HTA/BT, agrégeant les trames de 50 à 500 compteurs via le réseau CPL G3 ou radio maillée RF 868 MHz avant transmission au système central par liaison 4G/Fibre.',
        descEn: 'Substation edge gateway gathering meter packets from 50 to 500 downstream endpoints over G3-PLC or RF mesh 868 MHz, routing consolidated telemetry via 4G/Fiber to central utility servers.',
        parameter: 'Capacité d\'Agrégation & Protocole WAN',
        nominalValue: 'Jusqu\'à 1024 compteurs par DCU · Taux de relève journalier > 99.2% · Liaison 4G LTE Cat-M1 / NBIoT'
      },
      {
        tag: 'HES-HEAD-END',
        nameFr: 'Système d\'Acquisition & Gestion de Flotte (Head-End System - HES)',
        nameEn: 'Head-End System (HES) & Security Key Management Server',
        descFr: 'Serveur centralisé responsable de l\'ordonnancement des relèves de masse, de la gestion des clés cryptographiques PKI, de la mise à jour OTA (Over-the-Air) des firmwares et de l\'émission des ordres de coupure/rétablissement.',
        descEn: 'Central ingestion engine scheduling mass meter interrogations, managing PKI cryptographic security keys, orchestrating Over-The-Air firmware upgrades, and executing remote disconnect/reconnect commands.',
        parameter: 'Débit d\'Ingestion & Chiffrement',
        nominalValue: 'Capacité > 2 000 000 compteurs · Débit > 50 000 transactions/seconde · TLS 1.3 / DLMS Suite 1'
      },
      {
        tag: 'MDMS-ANALYTICS',
        nameFr: 'Plateforme de Gestion des Données de Comptage & IA (MDMS)',
        nameEn: 'Meter Data Management System (MDMS) & Grid Analytics Platform',
        descFr: 'Moteur décisionnel validant, estimant et éditant les données (VEE), calculant le bilan énergétique par départ pour localiser les pertes non-techniques (fraudes) et pilotant la modulation tarifaire horosaisonnière.',
        descEn: 'Core utility database performing Validation, Estimation & Editing (VEE), feeder-level energy balancing to pinpoint non-technical losses (theft), and executing dynamic Time-of-Use billing schedules.',
        parameter: 'Précision Bilan & Détection de Pertes',
        nominalValue: 'Tolérance bilan d\'énergie départ < 1.5% · Détection d\'anomalie par Machine Learning < 24h'
      }
    ],

    equipmentList: [
      {
        tag: 'METER-AMI-02S',
        nameFr: 'Compteur Électronique Haute Précision Classe 0.2S (Frontière HTB/HTA)',
        nameEn: 'High-Precision Class 0.2S Substation Boundary Meter (HV/MV Interconnect)',
        category: 'Comptage Haute Précision & Transactionnel',
        standard: 'CEI 62053-22 / CEI 62056 (DLMS/COSEM)',
        roleFr: 'Mesure transactionnelle officielle des échanges d\'énergie aux frontières de transport SONATREL et aux départs postes sources.',
        roleEn: 'Official revenue settlement metering for transmission interconnect boundaries and distribution substation feeders.',
        workingPrincipleFr: 'Échantillonnage 24 bits sigma-delta des signaux TC/TT avec calcul temps réel des puissances P, Q, S et des composantes harmoniques.',
        workingPrincipleEn: 'High-speed 24-bit sigma-delta digitizer processing CT/VT secondary outputs computing real-time P, Q, S and harmonics.',
        componentsFr: ['Double processeur DSP métrologique', 'Port optique de maintenance IEC 62056-21', 'Carte Ethernet double port CEI 61850 MMS', 'Alimentation auxiliaire redondante AC/DC', 'Batterie de sauvegarde horloge temps réel (RTC)'],
        componentsEn: ['Dual metrology DSP processing cores', 'Front optical communication port IEC 62056-21', 'Dual-redundant IEC 61850 MMS Ethernet card', 'Universal dual AC/DC auxiliary power supply', 'High-accuracy temperature-compensated RTC backup battery'],
        ratings: [
          { labelFr: 'Classe de Précision', labelEn: 'Accuracy Class', value: '0.2S', unit: 'CEI' },
          { labelFr: 'Courant Assigné In (Imax)', labelEn: 'Rated Current In (Imax)', value: '1(10)', unit: 'A' },
          { labelFr: 'Tension Nominale Un', labelEn: 'Nominal Voltage Un', value: '3×57.7/100 à 3×240/415', unit: 'V' },
          { labelFr: 'Résolution Horloge RTC', labelEn: 'RTC Clock Accuracy', value: '< 0.5', unit: 's/jour' }
        ],
        failureModesFr: 'Dérive du quartz d\'horodatage faussant les tranches tarifaires, saturation de la mémoire flash circulaire de courbe de charge, claquage de l\'alimentation auxiliaire sur surtension transitoire.',
        failureModesEn: 'RTC crystal drift corrupting Time-of-Use billing slots, circular flash load-profile storage corruption, auxiliary power supply failure under severe surge.'
      },
      {
        tag: 'DCU-G3-LTE',
        nameFr: 'Concentrateur de Données de Poste HTA/BT CPL-G3 / 4G (DCU)',
        nameEn: 'Substation G3-PLC / 4G LTE Data Concentrator Unit (DCU)',
        category: 'Passerelles & Réseaux de Télérelève',
        standard: 'CEI 61334 / ITU-T G.9903 (G3-PLC) / 3GPP LTE',
        roleFr: 'Collecte automatique par courants porteurs en ligne (CPL) des index de tous les compteurs basse tension raccordés au transformateur de distribution.',
        roleEn: 'Automates powerline carrier (PLC) collection of meter readings across all low-voltage consumers supplied by the distribution transformer.',
        workingPrincipleFr: 'Modulation OFDM multi-porteuse robuste injectée sur les câbles BT 400 V, avec routage dynamique adaptatif LOADng et passerelle IP vers le WAN.',
        workingPrincipleEn: 'OFDM multi-carrier modulation injected directly onto 400 V LV mains, utilizing adaptive LOADng mesh routing with secure IP WAN uplink.',
        componentsFr: ['Modem frontal CPL G3 avec coupleur capacitif BT', 'Module cellulaire 4G LTE Cat-M1 / NBIoT avec double SIM', 'Processeur ARM Cortex-A7 Linux durci', 'Supercondensateur pour alerte de coupure Last Gasp', 'Chiffreur matériel HSM pour clés AES'],
        componentsEn: ['Front-end G3-PLC modem with 3-phase capacitive coupler', 'Dual-SIM 4G LTE Cat-M1 / NBIoT cellular transceiver', 'Rugged industrial ARM Cortex-A7 Linux engine', 'Supercapacitor bank powering Last-Gasp outage alerts', 'Hardware Security Module (HSM) for AES keys'],
        ratings: [
          { labelFr: 'Capacité Compteurs', labelEn: 'Meter Capacity', value: '500', unit: 'unités' },
          { labelFr: 'Bande CPL', labelEn: 'PLC Frequency Band', value: 'CENELEC A (35-90)', unit: 'kHz' },
          { labelFr: 'Débit CPL Utile', labelEn: 'Usable PLC Bitrate', value: '32', unit: 'kbps' },
          { labelFr: 'Autonomie Last Gasp', labelEn: 'Last Gasp Autonomy', value: '> 120', unit: 's' }
        ],
        failureModesFr: 'Bruit parasite haute fréquence sur le réseau BT (variateurs, alimentations à découpage) étouffant le signal CPL, perte de synchronisation réseau cellulaire en zone rurale, surchauffe en armoire extérieure.',
        failureModesEn: 'High-frequency conducted noise on LV mains drowning G3-PLC carriers, cellular connectivity blackout in remote areas, thermal shutdown inside unventilated outdoor kiosk.'
      },
      {
        tag: 'SMART-METER-PREPAY',
        nameFr: 'Compteur Communicant à Prépaiement STS / Post-paiement avec Relais',
        nameEn: 'Split-Type STS Prepayment & Postpayment AMI Smart Meter with Disconnect Relay',
        category: 'Points Terminaux Abonnés',
        standard: 'CEI 62055-41 (STS) / CEI 62053-21 / CEI 62056',
        roleFr: 'Mesure de l\'énergie consommée par l\'abonné, rechargement à distance par jetons STS 20 chiffres ou télérecharge API, et coupure automatique en cas de crédit épuisé ou dépassement de puissance.',
        roleEn: 'Records domestic consumer energy draw, enables remote token top-up via STS 20-digit or direct API, executing automated service suspension upon credit exhaustion.',
        workingPrincipleFr: 'Shunt de mesure haute stabilité, microcontrôleur métrologique avec relais bistable 100 A résistant aux chocs et capteurs d\'inversion de courant et champ magnétique.',
        workingPrincipleEn: 'Precision temperature-compensated shunt, metrology MCU with 100 A latching contactor and dual tamper sensors detecting neutral inversion and strong magnetic fields.',
        componentsFr: ['Relais bistable de coupure unipolaire 100 A', 'Capteur de courant shunt au manganin', 'Capteur à effet Hall anti-aimant néodyme', 'Écran LCD rétroéclairé avec afficheur de crédit restant', 'Clavier numérique 12 touches pour jeton STS'],
        componentsEn: ['100 A motorized latching disconnect relay', 'Manganin alloy precision current shunt', 'Hall-effect anti-neodymium magnetic sensor', 'Backlit multi-segment LCD with credit balance display', '12-key tactile keypad for 20-digit STS token entry'],
        ratings: [
          { labelFr: 'Courant Maximal Imax', labelEn: 'Maximum Current Imax', value: '60 / 100', unit: 'A' },
          { labelFr: 'Classe de Précision Active', labelEn: 'Active Energy Accuracy', value: 'Classe 1.0', unit: 'CEI' },
          { labelFr: 'Pouvoir de Coupure Relais', labelEn: 'Relay Breaking Capacity', value: '100 A / 250 V', unit: 'AC' },
          { labelFr: 'Tenue aux Surtensions', labelEn: 'Surge Impulse Withstand', value: '6', unit: 'kV' }
        ],
        failureModesFr: 'Soudage des contacts du relais de coupure lors d\'un court-circuit aval violent, tentative de pontage mécanique du shunt, pénétration d\'humidité dans le bornier de raccordement.',
        failureModesEn: 'Latching relay contact welding during heavy downstream short-circuit, mechanical shunt bypassing tamper, moisture ingress into non-sealed terminal block.'
      },
      {
        tag: 'MDMS-ENTERPRISE',
        nameFr: 'Système Centralisé de Gestion des Données de Comptage (MDMS)',
        nameEn: 'Enterprise Meter Data Management & Loss Analytics Platform (MDMS)',
        category: 'Logiciels & Systèmes d\'Information Grid',
        standard: 'CEI 61968-9 (CIM for Meter Reading & Control)',
        roleFr: 'Référentiel centralisé traitant les millions d\'index de comptage quotidiens, réconciliant le bilan d\'énergie par départ et calculant les indicateurs clés de pertes (KPI).',
        roleEn: 'Central master database processing millions of daily meter intervals, executing feeder mass balancing, and generating utility non-technical loss analytics.',
        workingPrincipleFr: 'Moteur de base de données relationnelle et séries temporelles avec pipeline de validation VEE, calcul différentiel d\'énergie (Énergie injectée transformateur - Somme compteurs abonnés) et alertes de vol d\'électricité.',
        workingPrincipleEn: 'Time-series distributed big-data engine executing automated VEE pipelines, computing feeder energy differential (Substation delivery minus meter aggregate) to expose fraudulent taps.',
        componentsFr: ['Moteur d\'ingestion haut débit Kafka / MQTT', 'Base de données séries temporelles distribuée', 'Module d\'analyse de fraude par apprentissage supervisé', 'Passerelle d\'intégration ERP / Facturation SAP / Oracle', 'Interface cartographique SIG de localisation des pertes'],
        componentsEn: ['High-throughput Kafka / MQTT ingestion pipeline', 'Distributed time-series database cluster', 'Machine-learning supervised fraud detection engine', 'ERP / Billing gateway (SAP / Oracle Utilities)', 'GIS geospatial feeder loss mapping interface'],
        ratings: [
          { labelFr: 'Capacité de Traitement', labelEn: 'Processing Throughput', value: '100k msg/s', unit: 'msg' },
          { labelFr: 'Temps Calcul Bilan Feeder', labelEn: 'Feeder Balance Run Time', value: '< 15', unit: 'min' },
          { labelFr: 'Disponibilité Système', labelEn: 'System Availability SLA', value: '99.99', unit: '%' },
          { labelFr: 'Rétention Historique', labelEn: 'Historical Data Retention', value: '10', unit: 'ans' }
        ],
        failureModesFr: 'Goulot d\'étranglement de la base de données lors de la relève nocturne simultanée, désynchronisation des métadonnées abonnés entre le SIG et le système commercial.',
        failureModesEn: 'Database ingestion queue saturation during scheduled midnight meter interrogation window, GIS-billing asset metadata synchronization skew.'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 50-MTR',
        nameFr: 'Protection contre la Surcharge & Dépassement de Puissance Souscrite',
        nameEn: 'Contractual Demand Overcurrent & Breaker Disconnect (ANSI 50-MTR)',
        standard: 'CEI 62052-11 / CEI 62055-31',
        principleFr: 'Surveille en temps réel la puissance moyenne appelée sur 15 minutes; commande l\'ouverture du relais interne si P_mesurée dépasse le contrat souscrit (kVA).',
        principleEn: 'Monitors real-time 15-minute moving average demand, triggering the internal motorized contactor if active load exceeds subscribed tariff capacity.',
        typicalSetting: 'Seuil réglable de 5 A à 100 A selon contrat d\'abonnement; temporisation de préavis 60 s avec alerte sonore avant ouverture; réenclenchement autorisé après délestage.'
      },
      {
        ansiCode: 'ANTI-TAMPER',
        nameFr: 'Détection Multifonction Anti-Fraude & Altération Physique (Tamper)',
        nameEn: 'Multi-Vector Anti-Tamper & Physical Intrusion Detection',
        standard: 'CEI 62056-21 / STS Association',
        principleFr: 'Détecte instantanément l\'ouverture du capot bornier, la présence d\'un aimant néodyme externe, l\'inversion phase-neutre ou le déséquilibre courant phase/neutre.',
        principleEn: 'Instantly registers terminal cover opening, external neodymium magnetic fields, phase-neutral inversion, or differential phase-neutral current unbalance.',
        typicalSetting: 'Enregistrement horodaté au millième de seconde dans le journal sécurisé; émission immédiate d\'une alarme critique CPL/cellulaire vers le HES; coupure préventive paramétrable.'
      },
      {
        ansiCode: 'ANSI 59/27-AMI',
        nameFr: 'Surveillance des Niveaux de Tension Extrêmes (Surtension / Sous-tension)',
        nameEn: 'Extreme Voltage Range Threshold Supervision (Swell / Sag Protection)',
        standard: 'EN 50160 / CEI 61000-4-30',
        principleFr: 'Protège l\'électronique du compteur et les appareils de l\'abonné contre les surtensions destructrices de rupture de neutre ou les baisses sévères de tension.',
        principleEn: 'Shields meter internal power supply and consumer appliances against neutral-loss destructive swells and severe low-voltage brownouts.',
        typicalSetting: 'Seuil surtension haute : U > 275 V pendant t > 2 s -> Alerte et ouverture de protection; Seuil sous-tension basse : U < 160 V pendant t > 5 s -> Alerte baisse de qualité.'
      },
      {
        ansiCode: 'LAST-GASP',
        nameFr: 'Détection de Panne Réseau & Émission Télégramme d\'Urgence (Last Gasp)',
        nameEn: 'Zero-Voltage Power Outage Notification (Last-Gasp Telegram)',
        standard: 'DLMS UA 1000-1 / ITU G.9903',
        principleFr: 'Lors de la perte totale de tension réseau, le supercondensateur alimente le microcontrôleur le temps d\'émettre un paquet d\'alerte de coupure horodaté vers le concentrateur.',
        principleEn: 'Upon sudden upstream blackouts, onboard supercapacitors power the transceiver to broadcast a timestamped power-down emergency notification to the DCU.',
        typicalSetting: 'Seuil détection tension U < 20 V efficace; envoi du télégramme en moins de 1.5 s; consolidation HES pour cartographier instantanément l\'étendue de la panne.'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur de Déploiement AMI & Réduction des Pertes Non-Techniques (Fraudes)',
      titleEn: 'AMI Smart Meter Penetration & Non-Technical Loss (Theft) Mitigation Simulator',
      descFr: 'Ajustez le taux de pénétration des compteurs communicants AMI (0 à 100%) sur un réseau de distribution moyenne/basse tension pour observer la réduction drastique des fraudes, l\'amélioration du taux de recouvrement financier et la précision de localisation des branchements clandestins.',
      descEn: 'Adjust AMI smart meter penetration (0 to 100%) on a distribution network to observe non-technical loss reduction, utility revenue recovery enhancement, and illegal bypass pinpointing accuracy.',
      paramName: 'Taux de Déploiement Compteurs AMI',
      unit: '%',
      min: 0,
      max: 100,
      step: 5,
      initialValue: 65,
      calculate: (amiRate: number) => {
        const penetration = amiRate;
        const totalEnergyMwh = 12500; // Monthly energy injected at substation
        const baselineLossPct = 28.5; // Typical baseline losses without AMI (technical + theft)
        const technicalLossPct = 6.2; // Unavoidable Joule losses

        // Non-technical losses reduce dramatically with AMI deployment
        const nonTechLossPct = Math.max(1.8, (baselineLossPct - technicalLossPct) * Math.pow(1 - (penetration / 100) * 0.88, 1.4));
        const totalLossPct = technicalLossPct + nonTechLossPct;
        const energyLostMwh = totalEnergyMwh * (totalLossPct / 100);

        // Revenue recovery in millions FCFA (at 95 FCFA / kWh)
        const kWhPrice = 95;
        const baselineLostEnergyMwh = totalEnergyMwh * (baselineLossPct / 100);
        const savedEnergyMwh = Math.max(0, baselineLostEnergyMwh - energyLostMwh);
        const monthlySavingsMfcfa = (savedEnergyMwh * 1000 * kWhPrice) / 1000000;

        // Balance precision
        const balanceAccuracyPct = Math.min(99.4, 70.0 + (penetration / 100) * 29.4);
        const isTargetMet = totalLossPct <= 10.0;

        return [
          {
            labelFr: 'Taux de Pertes Global Réseau (Techniques + Non-Tech)',
            labelEn: 'Total Feeder Losses (Technical + Non-Technical)',
            value: `${totalLossPct.toFixed(1)} %`,
            unit: '%',
            statusFr: totalLossPct <= 10.0 ? 'Objectif d\'efficience atteint (≤ 10%)' : 'Pertes encore excessives sur départs BT',
            statusEn: totalLossPct <= 10.0 ? 'Efficiency benchmark achieved (≤ 10%)' : 'Losses remain elevated on LV feeders'
          },
          {
            labelFr: 'Pertes Non-Techniques Résiduelles (Fraudes & Vols)',
            labelEn: 'Residual Non-Technical Losses (Theft & Meter Bypasses)',
            value: `${nonTechLossPct.toFixed(1)} %`,
            unit: '%',
            statusFr: nonTechLossPct <= 3.5 ? 'Fraude résiduelle minime sous contrôle MDMS' : 'Vol d\'électricité significatif non détecté',
            statusEn: nonTechLossPct <= 3.5 ? 'Minimal residual theft under MDMS control' : 'Significant unmetered energy theft ongoing'
          },
          {
            labelFr: 'Recouvrement Financier Mensuel Additionnel',
            labelEn: 'Monthly Incremental Revenue Recovery',
            value: `${monthlySavingsMfcfa.toFixed(1)} M FCFA`,
            unit: 'M FCFA',
            statusFr: 'Revenus sécurisés réinjectables dans la maintenance du réseau',
            statusEn: 'Secured revenue ready for grid capital reinforcement'
          },
          {
            labelFr: 'Précision du Bilan d\'Énergie Transformateur/Abonnés',
            labelEn: 'Transformer-to-Customer Mass Balance Precision',
            value: `${balanceAccuracyPct.toFixed(1)} %`,
            unit: '%',
            statusFr: balanceAccuracyPct >= 95.0 ? 'Localisation instantanée des départs fraudeurs' : 'Précision insuffisante pour cibler les interventions',
            statusEn: balanceAccuracyPct >= 95.0 ? 'Instant pinpointing of fraudulent feeder branches' : 'Insufficient accuracy for field intervention targeting'
          },
          {
            labelFr: 'Statut de Digitalisation du Réseau de Distribution',
            labelEn: 'Distribution Grid Digitalization Status',
            value: isTargetMet ? 'EXCELLENT (OPTIMISÉ)' : 'EN TRANSITION (À ACCÉLÉRER)',
            unit: '',
            statusFr: isTargetMet ? 'Réseau communicant bidirectionnel pleinement opérationnel' : 'Poursuivre le remplacement des compteurs électromécaniques',
            statusEn: isTargetMet ? 'Fully operational bidirectional digital smart grid' : 'Continue legacy electromechanical meter replacement program'
          }
        ];
      }
    },

    faultSequence: [
      {
        time: 't = 0.0 s',
        eventFr: 'Tentative de Fraude par Pose d\'un Aimant Néodyme sur le Compteur',
        eventEn: 'Fraud Attempt: External Neodymium Magnet Placement on Meter',
        detailFr: 'Un abonné dépose un aimant puissant de 0.5 Tesla sur le boîtier pour saturer les transformateurs de courant internes et bloquer l\'enregistrement des kWh.',
        detailEn: 'A customer attaches a strong 0.5 Tesla neodymium magnet to the meter enclosure attempting to saturate internal CTs and stall kWh registration.'
      },
      {
        time: 't = 0.05 s',
        eventFr: 'Détection Instantanée par le Capteur à Effet Hall Interne',
        eventEn: 'Instantaneous Hall-Effect Sensor Tamper Detection',
        detailFr: 'Le capteur magnétorésistif détecte un flux magnétique anormal > 30 mT. Le microcontrôleur incrémente le registre d\'infraction horodaté et allume la LED rouge d\'alerte.',
        detailEn: 'The onboard magnetoresistive sensor detects abnormal magnetic field > 30 mT. The MCU increments the secure tamper log and illuminates the red alarm LED.'
      },
      {
        time: 't = 0.8 s',
        eventFr: 'Émission d\'une Alarme Prioritaire CPL/4G vers le Concentrateur (DCU)',
        eventEn: 'Priority CPL/4G Alarm Transmission to Substation Concentrator (DCU)',
        detailFr: 'Le compteur expédie une trame chiffrée AES-128 DLMS/COSEM vers le DCU du poste HTA/BT, identifiant le numéro de compteur, le type d\'agression et l\'horodatage exact.',
        detailEn: 'The meter dispatches an AES-128 encrypted DLMS/COSEM telegram to the substation DCU, transmitting the meter serial number, tamper code, and microsecond timestamp.'
      },
      {
        time: 't = 2.5 s',
        eventFr: 'Réception au Système Central HES & Ordre de Pénalité / Suspension',
        eventEn: 'HES Ingestion, GIS Flagging & Automated Remote Disconnect Execution',
        detailFr: 'Le HES alerte le MDMS et le SIG Eneo/SONATREL. Un ordre de déconnexion automatique du relais interne 100 A est envoyé, coupant l\'électricité jusqu\'au constat de police.',
        detailEn: 'HES alerts utility MDMS and GIS mapping. An automated remote disconnect command opens the 100 A contactor, isolating supply pending technical fraud audit.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Courbe de Charge Énergie Active P & Réactive Q (Intervalle 15 min)',
        nameEn: '15-Minute Interval Active & Reactive Load Profile (P & Q)',
        sensorFr: 'Double échantillonneur DSP métrologique 24 bits sigma-delta',
        sensorEn: 'Dual 24-bit sigma-delta metrology DSP sampling engine',
        rate: 'Intégration toutes les 15 minutes · Stockage circulaire 90 jours',
        protocol: 'DLMS/COSEM (OBIS 1.0.1.29.0.255) / G3-PLC'
      },
      {
        nameFr: 'Tension Efficace V_rms & Écart Contractuel de Qualité',
        nameEn: 'True RMS Voltage & Contractual Power Quality Deviation',
        sensorFr: 'Échantillonnage de tension instantané filtré sur 10 cycles (50 Hz)',
        sensorEn: 'Filtered true RMS voltage sensor computing 10-cycle averages',
        rate: 'Rafraîchissement 1 seconde · Événement si U < 195 V ou U > 253 V',
        protocol: 'DLMS/COSEM / CPL G3 / 4G LTE'
      },
      {
        nameFr: 'Statut Détection Anti-Fraude & Altération Physique (Tamper Flags)',
        nameEn: 'Anti-Tampering Multi-Sensor Security Status Register',
        sensorFr: 'Micro-contacts d\'ouverture capot et capteurs magnétiques à effet Hall',
        sensorEn: 'Optical enclosure micro-switches and Hall-effect magnetic sensors',
        rate: 'Surveillance permanente instantanée · Émission alarme sous 2 s',
        protocol: 'DLMS Event Notification Push / SMS / MQTT'
      },
      {
        nameFr: 'Bilan de Masse d\'Énergie au Transformateur (ΔE = E_poste - Σ E_abonnés)',
        nameEn: 'Substation Transformer Mass Energy Balance Differential (ΔE)',
        sensorFr: 'Calcul différentiel temps réel MDMS entre compteur totalisateur et compteurs abonnés',
        sensorEn: 'MDMS real-time algorithmic differential between bulk feeder meter and customer aggregate',
        rate: 'Calcul horaire et consolidation quotidienne',
        protocol: 'CEI 61968-9 CIM / REST API'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 1 (Point Terminal & Compteur Abonné)',
        nameFr: 'Mesure Métrologique DSP, Relais 100 A & Détection Anti-Fraude',
        nameEn: 'DSP Metrology Sampling, 100 A Latching Contactor & Tamper Sensors',
        descFr: 'Acquisition haute vitesse des tensions et courants, calcul des grandeurs énergétiques toutes les secondes et réaction immédiate aux fraudes physiques.',
        descEn: 'High-speed sampling of voltages and currents, continuous energy integration and sub-second mechanical tamper mitigation.',
        response: '10 – 100 ms'
      },
      {
        level: 'Niveau 2 (Poste de Distribution & Concentrateur DCU)',
        nameFr: 'Concentrateur de Données DCU & Réconciliation de Poste HTA/BT',
        nameEn: 'Substation Data Concentrator Unit (DCU) & Local Feeder Reconciliation',
        descFr: 'Agrégation des courbes de charge des 200 à 500 abonnés du transformateur, calcul du bilan local d\'énergie et transmission sécurisée vers le centre de gestion.',
        descEn: 'Aggregation of load curves from 200 to 500 downstream customers, computing local mass balance and forwarding packets over 4G.',
        response: '1 – 15 min'
      },
      {
        level: 'Niveau 3 (Centre Serveur & Plateforme Nationale MDMS)',
        nameFr: 'Système Centralisé HES/MDMS & Intégration Facturation ERP',
        nameEn: 'Enterprise Head-End System (HES), MDMS Engine & ERP Billing Integration',
        descFr: 'Validation VEE de l\'ensemble du parc national de compteurs (plus de 2 millions d\'abonnés), facturation mensuelle automatisée et cartographie analytique des pertes.',
        descEn: 'Automated VEE validation across the entire utility meter fleet (> 2 million endpoints), automated revenue billing, and macro grid loss analytics.',
        response: 'Heure / Journée'
      }
    ],

    internationalCase: {
      location: 'Italie & Union Européenne (Projet Telegestore Enel)',
      titleFr: 'Déploiement National du Projet Telegestore Enel (32 Millions de Compteurs)',
      titleEn: 'Enel Italy Telegestore Smart Metering Pioneer (32 Million AMI Endpoints)',
      capacity: '32 000 000 compteurs communicants interconnectés par CPL et concentrateurs de poste',
      highlightsFr: 'Premier déploiement mondial de masse d\'infrastructure de comptage avancé (AMI). Enel a remplacé l\'intégralité des compteurs électromécaniques italiens par des compteurs CPL communicants avec les postes de distribution. Résultats spectaculaires : réduction des pertes non-techniques de 8% à moins de 1.5%, télé-opération instantanée des changements de puissance et facturation au réel éliminant les relèves manuelles coûteuses.',
      highlightsEn: 'World\'s first nationwide mass smart metering deployment. Enel replaced all legacy electromechanical meters with powerline carrier digital units interfacing substation DCUs. The program achieved dramatic milestones: non-technical losses plunged from 8% to below 1.5%, remote contractual capacity alterations became instantaneous, and automated billing eradicated manual meter reading costs.'
    },

    cameroonCase: {
      assetLocation: 'Cameroun (Villes de Yaoundé, Douala & Bafoussam - Réseau Eneo / SONATREL)',
      titleFr: 'Programme de Déploiement des Compteurs Communicants Prépayés STS & AMI (Eneo Cameroun)',
      titleEn: 'Eneo Cameroon STS Prepayment Split-Meters & AMI Grid Modernization Program',
      notesFr: 'Cas de référence au Cameroun : Eneo a engagé la migration massive des clients résidentiels et tertiaires vers des compteurs intelligents communicants à prépaiement STS et AMI (notamment à Yaoundé quartier Bastos, Douala Bonanjo et Akwa). Les compteurs sont installés en hauteur sur poteau (Split-Meter) pour empêcher les raccordements frauduleux et reliés à une unité d\'affichage client (CIU) à domicile par câble ou radio. Le rechargement s\'effectue instantanément par Mobile Money (Orange Money / MTN MoMo) via des jetons STS cryptés 20 chiffres ou télé-recharge API. Pour SONATREL et Eneo, ce système a permis de sécuriser les recettes d\'encaissement à 100% avant consommation, de réduire les pertes non-techniques de plus de 15 points sur les départs assainis et de supprimer les litiges de facturation estimée.',
      notesEn: 'Flagship smart grid transformation in Cameroon: utility Eneo rolled out widespread deployment of split-type STS prepaid and AMI smart meters across major cities (Yaoundé, Douala, Bafoussam). Metering cores are pole-mounted in secure high-elevation split enclosures to prevent illegal taps, communicating with customer in-home interface units (CIU) via RF or pilot wire. Recharge is conducted instantly via Mobile Money (Orange Money / MTN MoMo) through 20-digit encrypted STS tokens or automated cloud API. For utilities SONATREL and Eneo, this initiative secured 100% upfront revenue collection, slashed non-technical losses by over 15% on modernized feeders, and virtually eliminated customer estimated billing disputes.'
    },

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Comptage Intelligent & Smart Grid (D15)',
        roleFromEn: 'Smart Metering & AMI Grid Engineer',
        roleToFr: 'Ingénieur Distribution HTA/BT & Départs (D05)',
        roleToEn: 'Distribution & Feeder Automation Engineer',
        phase: 'Bilan de Masse d\'Énergie Poste HTA/BT & Détection de Pertes',
        dataExchangedFr: 'Courbe de charge globale du transformateur 630 kVA vs somme vectorielle des compteurs abonnés.',
        dataExchangedEn: 'Transformer secondary 630 kVA load profile vs aggregate customer meter energy summation.',
        decisionFr: 'Installation d\'un compteur totalisateur de poste Classe 0.5S synchronisé avec le concentrateur DCU.',
        decisionEn: 'Installed a dedicated class 0.5S substation macro-meter synchronized with the DCU gateway.',
        impactFr: 'Identification précise d\'une dérivation clandestine de 45 kW sur la phase 2 du départ commercial.',
        impactEn: 'Pinpointed an unmetered 45 kW illegal commercial tap on phase 2 within 24 hours.'
      },
      {
        roleFromFr: 'Ingénieur Comptage Intelligent & Smart Grid (D15)',
        roleFromEn: 'Smart Metering & AMI Grid Engineer',
        roleToFr: 'Ingénieur Télécommunications & Cybersécurité OT (D13)',
        roleToEn: 'Telecom & OT Cybersecurity Engineer',
        phase: 'Sécurisation des Flux DLMS/COSEM & Clés Cryptographiques PKI',
        dataExchangedFr: 'Clés de chiffrement maître AES-128 GCM, certificats TLS pour passerelles 4G cellulaires.',
        dataExchangedEn: 'Master AES-128 GCM encryption keys, TLS client certificates for 4G cellular routers.',
        decisionFr: 'Cloisonnement du réseau AMI dans un APN privé sécurisé avec authentification mutuelle et HSM.',
        decisionEn: 'Segregated all AMI traffic into a private APN backed by hardware security modules (HSM).',
        impactFr: 'Immunité absolue contre l\'interception de données privées et les attaques par déni de service.',
        impactEn: 'Total protection against customer privacy breaches and grid-level denial-of-service disruptions.'
      },
      {
        roleFromFr: 'Ingénieur Comptage Intelligent & Smart Grid (D15)',
        roleFromEn: 'Smart Metering & AMI Grid Engineer',
        roleToFr: 'Ingénieur Dispatching & Stabilité Réseau (D02)',
        roleToEn: 'National Dispatch & Grid Dynamics Engineer',
        phase: 'Intégration Télémétrie Consommation & Effacement de Pointe (Demand Response)',
        dataExchangedFr: 'Agrégat prévisionnel de consommation nationale, réserve d\'effacement de charge télécommandable.',
        dataExchangedEn: 'Aggregated real-time national consumption forecast, remotely curtailable load reserve.',
        decisionFr: 'Programmation d\'une fonction de délestage contractuel progressif des gros consommateurs lors des pointes.',
        decisionEn: 'Configured automated smart meter load limiting for willing industrial consumers during peak hours.',
        impactFr: 'Évitement d\'un délestage rotatif brutal de 35 MW sur le Réseau Interconnecté Sud (RIS).',
        impactEn: 'Avoided a severe 35 MW rotational blackout across the Cameroon South Interconnected Grid (RIS).'
      }
    ],

    relatedDomains: [
      {
        code: 'D05',
        nameFr: 'Réseaux de Distribution HTA/BT',
        nameEn: 'Medium & Low Voltage Distribution',
        relationshipFr: 'Les compteurs AMI sont installés sur le réseau BT et les départs HTA pour quantifier l\'énergie vendue et les pertes techniques.',
        relationshipEn: 'AMI meters are deployed across MV/LV distribution assets to account for delivered energy and feeder losses.'
      },
      {
        code: 'D06',
        nameFr: 'Installations Basse Tension & Bâtiments',
        nameEn: 'Low Voltage Installations & Buildings',
        relationshipFr: 'Le compteur communicant constitue la frontière contractuelle et de sécurité entre le distributeur et l\'installation intérieure privée.',
        relationshipEn: 'The smart meter serves as the legal, safety, and tariff demarcation between utility and consumer premises.'
      },
      {
        code: 'D13',
        nameFr: 'Télécommunications & Cybersécurité OT',
        nameEn: 'Telecom & OT Cybersecurity',
        relationshipFr: 'Fournit les canaux de communication (CPL-G3, 4G, fibre optique) et l\'infrastructure à clés publiques (PKI) pour la télérelève.',
        relationshipEn: 'Supplies communication networks (G3-PLC, 4G, fiber) and PKI cryptographic frameworks for telemetry.'
      },
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Héberge les compteurs transactionnels de classe 0.2S raccordés aux transformateurs de mesure TC/TT aux frontières de transport.',
        relationshipEn: 'Houses class 0.2S high-precision settlement meters connected to instrument transformers at grid interfaces.'
      },
      {
        code: 'D02',
        nameFr: 'Conduite & Stabilité Réseau',
        nameEn: 'Grid Architecture & Dispatching',
        relationshipFr: 'Alimente le dispatching national en données réelles de consommation et permet l\'effacement ciblé de charge (Demand Response).',
        relationshipEn: 'Feeds national dispatch with real-time demand curves, enabling automated Demand Response peak shaving.'
      }
    ]
  },

  D16: {
    domainCode: 'D16',
    titleFr: 'Sécurité Électrique, Régimes de Neutre, Prises de Terre & Foudre',
    titleEn: 'Electrical Safety, Neutral Earthing, Grounding Grids & Lightning Protection',
    summaryFr: 'Conception des maillages de terre de poste selon IEEE 80, limitation des tensions de pas et de toucher, régimes de neutre HTA/BT, protection foudre par paratonnerres et analyse du risque d\'arc flash NFPA 70E.',
    summaryEn: 'Substation ground grid design per IEEE 80, step and touch voltage mitigation, MV/LV neutral grounding schemes, lightning protection systems (LPS) and NFPA 70E arc flash safety.',
    voltageRange: '0 V (Potentiel de référence) à 225 kV (Tension de tenue impulsionnelle)',
    primaryStandard: 'IEEE 80-2013 / CEI 61936-1 / CEI 62305-1..4 / NFPA 70E / CEI 60479',
    inputsFr: 'Courant de court-circuit à la terre Ik1 (kA), résistivité apparente du sol ρ (Ω·m), durée du défaut tf (s), niveau kéraunique Nk (jours d\'orage/an).',
    inputsEn: 'Single phase-to-ground fault current Ik1 (kA), apparent soil resistivity ρ (Ω·m), fault clearing duration tf (s), keraunic level Nk (storm days/yr).',
    coreTransformFr: 'Modélisation du maillage de terre équipotentiel cuivre, calcul des potentiels de surface par méthode des éléments de frontière, écoulement du courant de foudre par pointes Franklin et parafoudres ZnO, coordination d\'isolement.',
    coreTransformEn: 'Equipotential copper mesh ground network modeling, surface potential distribution via boundary element method, lightning discharge dissipation through Franklin air rods and ZnO arresters, insulation coordination.',
    outputsFr: 'Résistance globale de terre Rg < 0.5 Ω, tensions de pas et de toucher inférieures aux limites physiologiques sécuritaires (CEI 60479), périmètre de sécurité arc flash défini, indice de protection foudre Niveau I.',
    outputsEn: 'Substation ground grid resistance Rg < 0.5 Ω, step and touch potentials clamped below safe physiological thresholds (IEC 60479), arc flash safety boundary, Lightning Protection Level I.',
    faultClearingTime: '< 80 ms (Élimination défaut terre 225 kV) / < 100 ns (Amorçage parafoudre ZnO)',

    architectureStages: [
      {
        tag: 'EARTHING-MESH',
        nameFr: 'Maillage de Terre Principal du Poste en Cuivre Nu Enterré (Ground Grid)',
        nameEn: 'Buried Copper Equipotential Substation Earthing Grid & Ground Rods',
        descFr: 'Réseau de conducteurs en cuivre nu (95 mm² ou 120 mm²) enfouis à 0.8 m de profondeur formant un quadrillage sous l\'ensemble du poste, complété par des piquets de terre verticaux aux nœuds périphériques.',
        descEn: 'Network of bare copper conductors (95 mm² or 120 mm²) buried 0.8 m deep forming an equipotential grid across the entire substation yard, supplemented by vertical driven rods at corner perimeters.',
        parameter: 'Résistance Globale & Section Cuivre',
        nominalValue: 'Résistance de terre Rg < 0.5 Ω (HTB) / < 1.0 Ω (HTA) · Conducteur cuivre nu 120 mm² électrolytique'
      },
      {
        tag: 'SURFACE-GRAVEL',
        nameFr: 'Couche de Gravier Isolant de Surface & Grillage Équipotentiel de Manœuvre',
        nameEn: 'High-Resistivity Crushed Rock Surface Layer & Operator Equipotential Mats',
        descFr: 'Épandage d\'une couche de 10 à 15 cm de gravier concassé propre (résistivité humide > 3000 Ω·m) sur l\'aire du poste et tapis métalliques soudés aux pieds des appareils pour réduire le courant traversant le corps humain.',
        descEn: '10 to 15 cm layer of high-resistivity washed crushed rock (wet resistivity > 3000 Ω·m) across substation yard and welded equipotential operating mats at all disconnectors to suppress body current.',
        parameter: 'Résistivité Gravier & Épaisseur',
        nominalValue: 'Résistivité surfacique ρ_s ≥ 3000 Ω·m (humide) · Épaisseur h_s = 15 cm · Tapis inox 1.2 × 1.2 m'
      },
      {
        tag: 'LPS-AIR-TERMINAL',
        nameFr: 'Système Extérieur de Protection contre la Foudre (SPF / LPS) & Pointes Franklin',
        nameEn: 'External Lightning Protection System (LPS) Air Terminals & Shield Wires',
        descFr: 'Paratonnerres à tige franche (pointes Franklin) juchés sur les portiques du poste et câbles de garde aériens (OPGW) formant une cage de protection selon la méthode de la sphère fictive (CEI 62305).',
        descEn: 'Franklin air terminal rods mounted atop gantries and overhead shield ground wires (including OPGW) forming an electrostatic shield envelope evaluated via the rolling sphere method (IEC 62305).',
        parameter: 'Rayon Sphère Fictive & Niveau Protection',
        nominalValue: 'Niveau I (LPL I) · Rayon de sphère R = 20 m · Tenue impulsionnelle foudre 100 kA (10/350 µs)'
      },
      {
        tag: 'NEUTRAL-GROUNDING',
        nameFr: 'Mise à la Terre du Neutre Transformateur (RPN, BPN ou Neutre Isolé)',
        nameEn: 'Transformer Neutral Grounding Scheme (NGR Resistor, Petersen Coil, Direct)',
        descFr: 'Système de liaison à la terre du point neutre des transformateurs de puissance : résistance de limitation (RPN 30 kV limitant Ik1 à 300 A ou 1000 A) ou bobine d\'extinction de Petersen compensée.',
        descEn: 'Neutral grounding methodology for power transformers: Neutral Grounding Resistor (NGR limiting 30 kV Ik1 to 300 A or 1000 A) or resonant Petersen coil compensating earth fault capacitive currents.',
        parameter: 'Courant Limité Ik1 & Tenue Thermique',
        nominalValue: 'RPN HTA 30 kV : I_lim = 300 A / 10 s · Résistance acier inoxydable ou fonte · Relais ANSI 51N'
      }
    ],

    equipmentList: [
      {
        tag: 'GROUND-GRID-MESH',
        nameFr: 'Maillage de Terre en Cuivre Électrolytique & Liaisons Exothermiques',
        nameEn: 'Substation Solid Copper Ground Grid with Exothermic Welded Joints',
        category: 'Réseaux de Terre & Équipotentialité',
        standard: 'IEEE 80-2013 / IEEE 837 / CEI 61936-1',
        roleFr: 'Écoule en toute sécurité dans le sol les courants de court-circuit à la terre et de foudre sans générer de gradients de potentiel mortels en surface.',
        roleEn: 'Safely dissipates heavy phase-to-ground fault and lightning strike currents into the earth without generating hazardous surface potential gradients.',
        workingPrincipleFr: 'Réseau équipotentiel en cuivre enfoui interconnectant tous les châssis, transformateurs et clôtures avec soudures exothermiques moléculaires inaltérables.',
        workingPrincipleEn: 'Buried copper equipotential mesh bonding all equipment structures, transformer tanks, and boundary fences with permanent molecular exothermic welds.',
        componentsFr: ['Conducteur cuivre recuit nu 120 mm²', 'Piquets de terre verticaux acier cuivré 254 µm (longueur 3 m)', 'Soudures thermochimiques Cadweld / thermite', 'Tresses de masse souples en cuivre étamé 50 mm²', 'Puits de mesure et d\'injection de terre déconnectables'],
        componentsEn: ['Bare annealed electrolytic copper cable 120 mm²', 'Copper-bonded steel driven vertical earth rods (3 m length, 254 µm coating)', 'Cadweld exothermic graphite mold welded connections', 'Flexible tinned copper earth bonding straps 50 mm²', 'Removable test disconnect link inspection wells'],
        ratings: [
          { labelFr: 'Section Conducteur Cuivre', labelEn: 'Copper Cross-Section', value: '120', unit: 'mm²' },
          { labelFr: 'Courant de Court-Circuit 1s', labelEn: 'Rated Short-Circuit Current 1s', value: '31.5', unit: 'kA' },
          { labelFr: 'Résistance de Terre Cible', labelEn: 'Target Grid Resistance Rg', value: '< 0.5', unit: 'Ω' },
          { labelFr: 'Profondeur d\'Enfouissement', labelEn: 'Burial Depth', value: '0.8', unit: 'm' }
        ],
        failureModesFr: 'Corrosion galvanique des piquets de terre en sol acide ou marécageux, vol de cuivre sur les remontées extérieures de terre, sectionnement accidentel lors de travaux d\'excavation.',
        failureModesEn: 'Galvanic soil corrosion of ground rods in acidic wetlands, copper theft on above-ground bonding risers, mechanical severed conductors during civil excavation.'
      },
      {
        tag: 'NGR-RESISTOR-30KV',
        nameFr: 'Résistance de Limitation de Courant de Neutre 30 kV (RPN 300 A / 10 s)',
        nameEn: '30 kV Neutral Grounding Resistor (NGR 300 A / 10s Rating)',
        category: 'Régimes de Neutre & Limitation des Défauts',
        standard: 'IEEE 32 / CEI 60076-16',
        roleFr: 'Limite le courant de court-circuit monophasé à la terre sur le réseau HTA 30 kV pour réduire les contraintes thermiques et les tensions de pas/toucher.',
        roleEn: 'Restricts single phase-to-ground fault currents on 30 kV MV distribution to reduce thermal damage and touch voltage rise.',
        workingPrincipleFr: 'Banque de grilles de résistances en acier inoxydable austénitique raccordée entre le neutre du secondaire du transformateur 225/30 kV et la terre du poste.',
        workingPrincipleEn: 'Austenitic stainless steel resistance grid element bank inserted between the 225/30 kV transformer neutral bushing and the substation earth grid.',
        componentsFr: ['Éléments de résistance en alliage inox AISI 304 / Ni-Cr', 'Isolateurs de support porcelaine ou résine cycloaliphatique 36 kV', 'Transformateur de courant de neutre de mesure (TC Neutre)', 'Enveloppe en tôle d\'acier galvanisé ventilée IP23', 'Sectionneur de terre de neutre manuel verrouillable'],
        componentsEn: ['AISI 304 / Ni-Cr stainless steel resistance grid plates', 'Cycloaliphatic resin / porcelain standoff insulators 36 kV rated', 'Dedicated neutral current measurement transformer (Neutral CT)', 'IP23 naturally ventilated galvanized steel outdoor enclosure', 'Lockable manual neutral disconnect and earthing switch'],
        ratings: [
          { labelFr: 'Tension Nominale Réseau', labelEn: 'Rated System Voltage', value: '30', unit: 'kV' },
          { labelFr: 'Courant Limité de Défaut', labelEn: 'Fault Current Limit', value: '300', unit: 'A' },
          { labelFr: 'Valeur Ohmique R', labelEn: 'Resistance Value R', value: '57.7', unit: 'Ω' },
          { labelFr: 'Durée Assignée du Défaut', labelEn: 'Rated Thermal Duration', value: '10', unit: 's' }
        ],
        failureModesFr: 'Rupture thermique d\'un élément de grille lors d\'un défaut maintenu au-delà de 10 s (laissant le neutre flottant), contournement diélectrique de l\'isolateur par pollution saline.',
        failureModesEn: 'Thermal element burnout if ground fault clearing exceeds 10s rating (resulting in floating neutral), insulator flashover under industrial pollution deposit.'
      },
      {
        tag: 'LPS-LIGHTNING-ROD',
        nameFr: 'Paratonnerre à Tige Métallique & Câble de Descente Foudre (LPS Classe I)',
        nameEn: 'Franklin Air Terminal Rod & Lightning Down-Conductor Assembly (Class I)',
        category: 'Protection contre la Foudre (LPS)',
        standard: 'CEI 62305-3 / NF C 17-102',
        roleFr: 'Intercepte les coups de foudre directs sur le poste et évacue l\'énergie impulsionnelle (jusqu\'à 200 kA) sans amorçage sur les jeux de barres sous tension.',
        roleEn: 'Captures direct atmospheric lightning strikes, channeling high-energy impulses (up to 200 kA) into earth away from energized substation busbars.',
        workingPrincipleFr: 'Création d\'un point préférentiel d\'impact par effet de pointe (ionisation) selon la zone protégée définie par la méthode électrogéométrique de la sphère roulante.',
        workingPrincipleEn: 'Forms a preferential strike interception point based on electrogeometric rolling sphere method geometry, dissipating surge charge via dedicated down-conductors.',
        componentsFr: ['Tige de captage en inox massif Ø 20 mm (hauteur 2 à 4 m)', 'Conducteur de descente cuivre étamé 50 mm² sans boucle brusque', 'Compteur d\'impacts de foudre inductif scellé IP67', 'Raccord de coupure d\'essai de terre', 'Manchon de protection mécanique en pied de support'],
        componentsEn: ['Solid stainless steel air terminal rod Ø 20 mm (2 to 4 m height)', 'Tinned copper 50 mm² down-conductor routing without sharp bends', 'IP67 sealed inductive lightning strike flash counter', 'Removable test disconnect joint', 'Heavy mechanical protective sleeve at ground level'],
        ratings: [
          { labelFr: 'Niveau de Protection (LPL)', labelEn: 'Lightning Protection Level', value: 'Classe I', unit: 'CEI' },
          { labelFr: 'Courant de Foudre Maximal', labelEn: 'Peak Lightning Current Iimp', value: '200', unit: 'kA (10/350)' },
          { labelFr: 'Rayon Sphère Électrogéom.', labelEn: 'Rolling Sphere Radius', value: '20', unit: 'm' },
          { labelFr: 'Masse Conducteur Descente', labelEn: 'Down-Conductor Weight', value: '445', unit: 'g/m' }
        ],
        failureModesFr: 'Étincelles dangereuses ou amorçage en retour (flashover) si la distance de séparation minimale S n\'est pas respectée par rapport aux câbles basse tension ou aux capteurs.',
        failureModesEn: 'Dangerous side-flashing to nearby low-voltage cables if safe physical separation distance S is breached, corroded down-conductor clamps.'
      },
      {
        tag: 'ARC-FLASH-RELAY',
        nameFr: 'Système de Protection Ultra-Rapide contre l\'Arc Électrique (Arc Flash Optique)',
        nameEn: 'Optical Arc Flash Ultra-Fast Detection & Breaker Tripping Relay',
        category: 'Sécurité du Personnel & Équipements',
        standard: 'IEEE 1584-2018 / NFPA 70E / CEI 60255-1',
        roleFr: 'Détecte l\'éclair lumineux produit par un amorçage d\'arc interne dans les cellules HTA 30 kV et déclenche le disjoncteur amont en moins de 2 ms pour éliminer le risque mortel pour les opérateurs.',
        roleEn: 'Detects the intense luminous flash of an internal arc fault inside 30 kV MV switchgear cubicles, commanding upstream breaker trip in < 2 ms to protect human life.',
        workingPrincipleFr: 'Capteurs optiques à fibre optique nue ou à lentilles ponctuelles couplés à un détecteur de surintensité instantanée pour éliminer tout déclenchement intempestif.',
        workingPrincipleEn: 'Optical bare fiber or point lens sensors combined with instantaneous overcurrent confirmation to execute ultra-fast trip within 2 ms without false tripping.',
        componentsFr: ['Boucle de fibre optique de détection continue sur toute la longueur des jeux de barres', 'Capteurs ponctuels à lentille grand angle dans les compartiments disjoncteur et câbles', 'Unité centrale à microprocesseur avec sorties à thyristor IGBT ultra-rapides (< 1 ms)', 'Entrées de synchronisation de courant pour confirmation de surintensité (I >)', 'Auto-surveillance permanente de la continuité de la fibre'],
        componentsEn: ['Continuous bare optical fiber loop installed along MV busbar compartment', 'Point lens sensors mounted inside cable and circuit breaker compartments', 'Central microprocessor unit with high-speed IGBT tripping outputs (< 1 ms)', 'Fast current input channels for overcurrent confirmation (I >)', 'Continuous optical fiber integrity self-supervision'],
        ratings: [
          { labelFr: 'Temps de Détection Optique', labelEn: 'Optical Detection Time', value: '< 2', unit: 'ms' },
          { labelFr: 'Sensibilité Lumineuse', labelEn: 'Light Sensitivity', value: '10 000 à 30 000', unit: 'Lux' },
          { labelFr: 'Temps Déclenchement Total', labelEn: 'Total Arc Clearing Time', value: '< 45', unit: 'ms (avec disjoncteur)' },
          { labelFr: 'Énergie Arc Résiduelle', labelEn: 'Incident Energy Level', value: '< 1.2', unit: 'cal/cm² (Cat 0)' }
        ],
        failureModesFr: 'Poussière ou dépôts de suie occultant les lentilles optiques en environnement industriel, rupture mécanique de la fibre optique lors des opérations de maintenance.',
        failureModesEn: 'Dust or soot deposition occluding point lenses in dusty environments, mechanical pinching of optical fiber during maintenance racking operations.'
      }
    ],

    protections: [
      {
        ansiCode: 'ANSI 51N / 50N',
        nameFr: 'Protection contre les Défauts à la Terre Résiduelle (Maximum de Courant Neutre)',
        nameEn: 'Neutral Residual Ground Overcurrent Protection (ANSI 51N / 50N)',
        standard: 'CEI 60255-151 / IEEE C37.112',
        principleFr: 'Mesure le courant circulant dans le point neutre du transformateur ou la somme vectorielle 3I0 pour éliminer sélectivement les défauts monophasés à la terre.',
        principleEn: 'Monitors current flowing through transformer neutral earthing conductor or residual 3I0 vector sum to selectively trip phase-to-ground faults.',
        typicalSetting: 'Seuil temporisé 51N calé à 10% à 20% de In (ex: 30 A à 60 A sur réseau 30 kV avec RPN 300 A); courbe inverse avec temps de déclenchement t < 0.5 s.'
      },
      {
        ansiCode: 'ANSI 64R / 59N',
        nameFr: 'Protection Terre Rotor & Déplacement du Potentiel Neutre (Tension Résiduelle)',
        nameEn: 'Residual Neutral Voltage Displacement & Ground Fault (ANSI 59N / 64R)',
        standard: 'CEI 60255-127',
        principleFr: 'Mesure la tension homopolaire V0 apparaissant sur le neutre lors d\'un défaut franc à la terre sur réseau à neutre isolé ou compensé par bobine Petersen.',
        principleEn: 'Detects zero-sequence voltage V0 developed across open-delta VT windings during ground faults in isolated or Petersen coil-grounded networks.',
        typicalSetting: 'Seuil alarme V0 = 15% V_nom pendant t = 10 s; Seuil déclenchement V0 = 30% V_nom pendant t = 1.0 s avec déclenchement du départ en défaut.'
      },
      {
        ansiCode: 'ANSI 50-ARC',
        nameFr: 'Protection Flash Optique & Déclenchement Ultra-Rapide d\'Arc Interne',
        nameEn: 'Optical Arc Flash Protection & Fast Breaker Tripping (ANSI 50-ARC)',
        standard: 'IEEE 1584 / NFPA 70E',
        principleFr: 'Combine la détection instantanée de lumière (> 20 000 Lux) et une confirmation de surintensité (I > 1.5 In) pour déclencher en moins de 2 ms.',
        principleEn: 'Combines instantaneous luminous arc detection (> 20 000 Lux) with fast overcurrent confirmation (I > 1.5 In) to output trip command in under 2 ms.',
        typicalSetting: 'Double condition ET (Lumière ET Courant); émission impulsion déclenchement disjoncteur en t < 1.5 ms; réduction de l\'énergie incidente sous 1.2 cal/cm².'
      },
      {
        ansiCode: 'ANSI 64G / 87N',
        nameFr: 'Protection Différentielle Restreinte de Terre (Restricted Earth Fault - REF)',
        nameEn: 'Restricted Earth Fault Differential Protection (ANSI 87N / 64G)',
        standard: 'CEI 60255-187-1',
        principleFr: 'Compare le courant homopolaire résiduel des 3 phases au courant mesuré dans la connexion de neutre du transformateur; protège 100% de l\'enroulement étoile.',
        principleEn: 'Compares residual 3-phase current sum with neutral bushing CT current, providing 100% ground fault coverage of transformer wye windings.',
        typicalSetting: 'Seuil différentiel à haute impédance Id > 0.05 In; résistance stabilisatrice R_stab calculée pour empêcher le déclenchement sur saturation TC lors de défauts externes.'
      }
    ],

    interactiveDemo: {
      titleFr: 'Simulateur de Tensions de Pas & de Toucher de Poste selon IEEE 80',
      titleEn: 'Substation Step & Touch Potential Safety Simulator per IEEE 80',
      descFr: 'Ajustez l\'espacement des mailles de la grille de terre en cuivre (de 2 m à 12 m) pour un poste 225/30 kV avec un courant de défaut de 25 kA. Visualisez l\'évolution de la résistance globale de terre (Rg), la tension de toucher maximale (Etouch) et la conformité avec la limite physiologique admissible pour le corps humain.',
      descEn: 'Adjust the copper grounding grid mesh spacing (from 2 m to 12 m) for a 225/30 kV substation with 25 kA earth fault current. Observe overall ground resistance (Rg), maximum touch potential (Etouch), and compliance with safe human body tolerance per IEEE 80.',
      paramName: 'Espacement des Mailles de Terre (D)',
      unit: 'm',
      min: 2,
      max: 12,
      step: 1,
      initialValue: 5,
      calculate: (meshSpacing: number) => {
        const D = meshSpacing;
        const soilResistivity = 120; // Apparent soil resistivity in Ohm.m
        const crushedRockResistivity = 3000; // Crushed rock surface layer in Ohm.m
        const surfaceThickness = 0.15; // 15 cm crushed rock
        const substationArea = 100 * 80; // 8000 m² substation yard
        const faultCurrentKa = 25; // 25 kA single phase to ground fault
        const faultDurationS = 0.2; // 200 ms clearing time

        // Total conductor length in meters:
        // Number of parallel conductors in X and Y
        const conductorsX = Math.floor(100 / D) + 1;
        const conductorsY = Math.floor(80 / D) + 1;
        const totalConductorLength = conductorsX * 80 + conductorsY * 100 + 40 * 3; // + ground rods

        // Approximate grid resistance per Laurent & Niemann / Sverak formula:
        // Rg = rho * [ 1 / (4 * r) + 1 / L ]
        const equivalentRadius = Math.sqrt(substationArea / Math.PI);
        const Rg = soilResistivity * (1 / (4 * equivalentRadius) + 1 / totalConductorLength);

        // Ground Potential Rise (GPR in Volts)
        // Only a fraction of fault current flows into remote earth (split factor Sf ~ 0.65)
        const gridCurrentA = faultCurrentKa * 1000 * 0.65;
        const gprVolts = gridCurrentA * Rg;

        // Mesh touch voltage (Etouch in Volts):
        // Decreases with tighter mesh spacing
        // Etouch ~ rho * Km * Ki * I_g / L
        const Km = (1 / (2 * Math.PI)) * Math.log((D * D) / (16 * 0.8 * 0.012)); // Simplified Km factor
        const Ki = 0.65 + 0.172 * Math.max(conductorsX, conductorsY);
        const touchVoltageVolts = Math.max(180, (soilResistivity * Math.max(0.12, Km) * Ki * gridCurrentA) / totalConductorLength);

        // Allowable safe touch voltage for 70 kg person per IEEE 80 with crushed rock:
        // Cs reflection factor
        const Cs = 1 - (0.09 * (1 - soilResistivity / crushedRockResistivity)) / (2 * surfaceThickness + 0.09);
        const allowableTouchVolts = (1000 + 1.5 * Cs * crushedRockResistivity) * (0.157 / Math.sqrt(faultDurationS));

        const isSafe = touchVoltageVolts <= allowableTouchVolts;
        const safetyMarginPct = ((allowableTouchVolts - touchVoltageVolts) / allowableTouchVolts) * 100;

        return [
          {
            labelFr: 'Résistance Globale de Terre (Rg)',
            labelEn: 'Overall Ground Grid Resistance (Rg)',
            value: `${Rg.toFixed(2)} Ω`,
            unit: 'Ω',
            statusFr: Rg <= 0.5 ? 'Conforme norme CEI 61936-1 (< 0.5 Ω)' : (Rg <= 1.0 ? 'Acceptable poste HTA' : 'Résistance trop élevée (> 1.0 Ω)'),
            statusEn: Rg <= 0.5 ? 'Compliant with IEC 61936-1 (< 0.5 Ω)' : (Rg <= 1.0 ? 'Acceptable for MV substation' : 'Excessive resistance (> 1.0 Ω)')
          },
          {
            labelFr: 'Montée en Potentiel du Sol (GPR)',
            labelEn: 'Ground Potential Rise (GPR)',
            value: `${(gprVolts / 1000).toFixed(1)} kV`,
            unit: 'kV',
            statusFr: 'Potentiel maximal de référence lors d\'un défaut terre 25 kA',
            statusEn: 'Max grid voltage rise during a 25 kA phase-to-ground fault'
          },
          {
            labelFr: 'Tension de Toucher Maximale de Maille',
            labelEn: 'Maximum Mesh Touch Voltage (Etouch)',
            value: `${touchVoltageVolts.toFixed(0)} V`,
            unit: 'V',
            statusFr: isSafe ? 'Inférieure au seuil mortel physiologique' : 'Danger mortel : risque d\'électrocution par contact',
            statusEn: isSafe ? 'Safely below fatal physiological limit' : 'Fatal hazard: lethal shock exposure on metallic frame'
          },
          {
            labelFr: 'Tension de Toucher Admissible (IEEE 80 70kg)',
            labelEn: 'Allowable Safe Touch Limit (IEEE 80 70kg Body)',
            value: `${allowableTouchVolts.toFixed(0)} V`,
            unit: 'V',
            statusFr: 'Calculée avec 15 cm de gravier de surface (ρ = 3000 Ω·m)',
            statusEn: 'Derived with 15 cm crushed rock surface layer (ρ = 3000 Ω·m)'
          },
          {
            labelFr: 'Marge de Sécurité Corporelle & Conformité',
            labelEn: 'Personnel Safety Margin & Compliance',
            value: isSafe ? `SÉCURISÉ (+${safetyMarginPct.toFixed(0)}%)` : `DANGER (-${Math.abs(safetyMarginPct).toFixed(0)}%)`,
            unit: '',
            statusFr: isSafe ? 'Maillage validé : protection du personnel garantie' : 'Resserrer le maillage ou ajouter des piquets profonds',
            statusEn: isSafe ? 'Validated grid mesh: operator life safety assured' : 'Tighten grid spacing or drive deep auxiliary rods'
          }
        ];
      }
    },

    faultSequence: [
      {
        time: 't = 0.0 ms',
        eventFr: 'Amorçage de Défaut Franc Phase-Terre sur le Jeu de Barres 225 kV',
        eventEn: 'Solid 225 kV Phase-to-Ground Busbar Flashover Event',
        detailFr: 'Un contournement d\'isolateur sous coup de foudre injecte un courant de défaut de 24 500 A directement dans le châssis métallique et le réseau de terre du poste.',
        detailEn: 'Lightning insulator flashover dumps a 24,500 A ground fault directly into the gantry metallic framework and substation earthing grid.'
      },
      {
        time: 't = 12.0 ms',
        eventFr: 'Montée en Potentiel du Réseau de Terre (GPR) & Équipotentialité',
        eventEn: 'Ground Potential Rise (GPR) & Surface Potential Equipotential Distribution',
        detailFr: 'Le maillage en cuivre 120 mm² écoule le courant dans le sol. Grâce à la couche de gravier de 15 cm et au maillage serré, la tension de toucher reste bridée sous 580 V.',
        detailEn: 'The 120 mm² copper mesh disperses current into the earth. The 15 cm crushed rock layer and equipotential mats clamp operator touch voltage below 580 V.'
      },
      {
        time: 't = 28.0 ms',
        eventFr: 'Détection par la Protection Différentielle de Barres & Terre (ANSI 87B / 51N)',
        eventEn: 'Busbar & Earth Fault Differential Relay Trip Signal (ANSI 87B / 51N)',
        detailFr: 'Le relais numérique calcule la somme vectorielle instantanée 3I0 et émet un ordre de déclenchement ultra-rapide aux bobines de déclenchement des disjoncteurs SF6.',
        detailEn: 'The digital relay computes zero-sequence 3I0 current vector sum and dispatches high-speed trip pulses to all surrounding 225 kV SF6 breakers.'
      },
      {
        time: 't = 68.0 ms',
        eventFr: 'Extinction de l\'Arc dans les Disjoncteurs SF6 & Sécurisation Totale',
        eventEn: 'Full Fault Interruption in SF6 Circuit Breakers & System Return to Safe Zero',
        detailFr: 'Les disjoncteurs 225 kV ouvrent leurs pôles en 40 ms. Le défaut est entièrement éliminé; aucune surtension résiduelle ni blessure corporelle n\'est constatée.',
        detailEn: 'The 225 kV circuit breakers interrupt the fault arc in 40 ms. Fault is fully cleared; zero personnel injury or equipment collateral damage sustained.'
      }
    ],

    monitoredParameters: [
      {
        nameFr: 'Résistance Globale de la Prise de Terre de Poste (R_earth)',
        nameEn: 'Substation Earth Grid Total Ground Resistance (R_earth)',
        sensorFr: 'Telluromètre haute fréquence injecteur 25 kHz avec piquets auxiliaires distants',
        sensorEn: 'High-frequency 25 kHz earth grid impedance meter with remote auxiliary probes',
        rate: 'Contrôle périodique annuel et télé-surveillance continue par boucle pilote',
        protocol: 'Rapport d\'essai normalisé IEEE 81 / CEI 61936-1'
      },
      {
        nameFr: 'Tensions de Pas et de Toucher Maximales Calculées (V_step & V_touch)',
        nameEn: 'Maximum Calculated Step and Touch Potentials (V_step & V_touch)',
        sensorFr: 'Modélisation par éléments finis validée par injection de courant simulé 50 A',
        sensorEn: 'Finite element computation validated by low-current 50 A grid injection test',
        rate: 'Audit lors de chaque extension de poste ou augmentation du courant de court-circuit',
        protocol: 'Calcul certifié IEEE 80 / CDEGS'
      },
      {
        nameFr: 'Courant de Fuite Résiduel dans la Résistance de Neutre RPN (I_N)',
        nameEn: 'Residual Continuous Neutral Leakage Current in NGR (I_N)',
        sensorFr: 'Transformateur de courant tore basse tension de précision sur la liaison terre RPN',
        sensorEn: 'Precision low-voltage toroidal current transformer on NGR grounding lead',
        rate: 'Surveillance permanente continue (échantillonnage 1 kHz)',
        protocol: 'CEI 61850 MMS / Modbus TCP'
      },
      {
        nameFr: 'Comptage & Amplitude des Impacts de Foudre Directs (LPS Lightning Counter)',
        nameEn: 'Direct Atmospheric Lightning Strike Count & Peak Current (LPS Sensor)',
        sensorFr: 'Capteur Rogowski étanche et compteur électromécanique avec module radio LoRa/GSM',
        sensorEn: 'Hermetic Rogowski sensor and strike counter with LoRa/cellular telemetry',
        rate: 'Détection instantanée de chaque impulsion (temps de montée 1.2 µs)',
        protocol: 'LoRaWAN / CEI 61850'
      }
    ],

    controlLevels: [
      {
        level: 'Niveau 1 (Point d\'Écoulement & Maillage Équipotentiel)',
        nameFr: 'Conducteurs Cuivre 120 mm², Piquets Verticaux & Tapis de Manœuvre',
        nameEn: 'Buried Copper Grid Mesh, Driven Vertical Rods & Operating Mats',
        descFr: 'Dispersion immédiate sans retard du courant de foudre et de court-circuit dans la terre avec contrôle géométrique des gradients de potentiel superficiels.',
        descEn: 'Instantaneous delay-free dispersion of lightning and short-circuit current into ground controlling surface potential gradients.',
        response: '< 1 µs (Instantané physique)'
      },
      {
        level: 'Niveau 2 (Appareillage de Limitation & Élimination Rapide)',
        nameFr: 'Résistance de Neutre RPN 30 kV & Disjoncteurs SF6 / Vide',
        nameEn: '30 kV Neutral Grounding Resistor & SF6 / Vacuum Circuit Breakers',
        descFr: 'Limitation thermique du courant de défaut à 300 A par la résistance de neutre et coupure sélective par les relais de terre ANSI 51N/50N en moins de 100 ms.',
        descEn: 'Current restriction to 300 A via NGR and selective ground fault disconnection by ANSI 51N/50N relays in under 100 ms.',
        response: '40 – 100 ms'
      },
      {
        level: 'Niveau 3 (Coordination de Sécurité & Surveillance Réglementaire)',
        nameFr: 'Audits Périodiques IEEE 80, Continuité Équipotentielle & Habilitations',
        nameEn: 'Periodic IEEE 80 Earth Testing, Equipotential Audits & Arc Flash PPE',
        descFr: 'Mesure annuelle de la résistance de terre au telluromètre haute fréquence, contrôle de la résistivité du gravier et port obligatoire des EPI selon le niveau d\'arc flash calculé.',
        descEn: 'Annual high-frequency earth resistance testing, surface rock resistivity audits, and mandatory arc flash PPE compliance per IEEE 1584.',
        response: 'Annuel / Continu'
      }
    ],

    internationalCase: {
      location: 'États-Unis & Réseaux de Transport Nord-Américains (TVA / IEEE)',
      titleFr: 'Standardisation Mondiale des Réseaux de Terre selon la Norme IEEE 80 (Tennessee Valley Authority)',
      titleEn: 'Global Standard for Substation Grounding Safety (IEEE 80 / TVA Transmission)',
      capacity: 'Plus de 500 postes 161 kV et 500 kV conçus et audités selon la méthodologie IEEE 80',
      highlightsFr: 'Le standard mondial de sécurité électrique pour les postes haute tension. Développé par le comité de transport et distribution de l\'IEEE à partir des recherches sur la fibrilation ventriculaire de Dalziel, IEEE 80 définit les formules analytiques et informatisées indispensables pour dimensionner les maillages de terre, l\'épaisseur de gravier et l\'équipotentialité des clôtures de poste.',
      highlightsEn: 'The international benchmark for substation high-voltage electrical safety. Developed by the IEEE Substation Committee incorporating Charles Dalziel\'s human ventricular fibrillation tolerance data, IEEE 80 established the analytical foundation for ground grid mesh dimensioning, crushed rock surfacing, and substation boundary fence touch potential bonding.'
    },

    cameroonCase: {
      assetLocation: 'Cameroun (Postes HTB de Mangombé, Bekoko, Nachtigal & Sol Volcanique du Sud-Ouest)',
      titleFr: 'Défi des Prises de Terre en Sol Volcanique & Fort Niveau Kéraunique au Cameroun (SONATREL / Eneo)',
      titleEn: 'Volcanic High-Resistivity Soil Earthing & Severe Lightning Protection in Cameroon',
      notesFr: 'Cas géotechnique et climatique exceptionnel au Cameroun : la région côtière et du Sud-Ouest (Edéa, Douala, Limbé, Nkongsamba) présente l\'un des niveaux kérauniques les plus élevés au monde (Nk > 120 à 150 jours d\'orage par an). De plus, les sols volcaniques autour du Mont Cameroun (Buea, Limbé) présentent des résistivités extrêmement fortes (ρ > 2000 à 5000 Ω·m), rendant très difficile l\'obtention d\'une résistance de terre inférieure à 0.5 Ω. Pour le poste d\'interconnexion 225 kV de Nachtigal et le poste de Bekoko (Douala), SONATREL a déployé des forages profonds jusqu\'à 30 m avec injection de ciment conducteur (bentonite / résine de terre), associés à des pointes paratonnerres à très grande hauteur et des câbles de garde OPGW pour préserver les transformateurs de puissance contre les surtensions atmosphériques destructrices.',
      notesEn: 'Exceptional geotechnical and climatic engineering challenge in Cameroon: the Littoral and South-West regions (Edéa, Douala, Limbé, Nkongsamba) endure among the highest keraunic storm activity on earth (Nk > 120 to 150 thunderstorm days per year). Concurrently, volcanic basalt soils around Mount Cameroon exhibit severe electrical resistivity (ρ > 2000 to 5000 Ω·m), making a sub-0.5 Ω earth grid difficult to achieve. For the Nachtigal 225 kV hydro dispatch substation and the Bekoko bulk hub, utility SONATREL utilized deep drilled boreholes up to 30 m deep backfilled with conductive carbonaceous bentonite compound, paired with elevated Franklin air terminals and continuous OPGW shield wires protecting multi-MVA power transformers against catastrophic direct lightning surges.'
    },

    engineeringInteractions: [
      {
        roleFromFr: 'Ingénieur Sécurité Électrique, Prises de Terre & Foudre (D16)',
        roleFromEn: 'Electrical Safety, Earthing & Lightning Engineer',
        roleToFr: 'Ingénieur Postes Électriques & Appareillage (D04)',
        roleToEn: 'Substation & Switchgear Engineer',
        phase: 'Dimensionnement Maillage de Terre & Couche de Gravier Poste 225 kV',
        dataExchangedFr: 'Courant de défaut Ik1 = 31.5 kA / 1s, plan d\'implantation du matériel et résistivité du sol 4 points Wenner.',
        dataExchangedEn: 'Fault current Ik1 = 31.5 kA / 1s, general layout drawing, and Wenner 4-pin soil resistivity profile.',
        decisionFr: 'Maille de 6 m × 6 m en cuivre 120 mm² avec 15 cm de gravier concassé et tapis de manœuvre aux sectionneurs.',
        decisionEn: 'Specified 6 m × 6 m grid spacing in 120 mm² bare copper with 15 cm crushed rock and operator mats at disconnectors.',
        impactFr: 'Garantie d\'une tension de toucher inférieure à 650 V, protégeant les opérateurs en cas de défaut de terre.',
        impactEn: 'Guaranteed touch potential below 650 V, ensuring total operator life safety during a ground fault.'
      },
      {
        roleFromFr: 'Ingénieur Sécurité Électrique, Prises de Terre & Foudre (D16)',
        roleFromEn: 'Electrical Safety, Earthing & Lightning Engineer',
        roleToFr: 'Ingénieur Lignes de Transport & Pylônes (D03)',
        roleToEn: 'Transmission Lines & Towers Engineer',
        phase: 'Coordination Raccordement Câble de Garde OPGW & Pieds de Pylône',
        dataExchangedFr: 'Courant d\'écoulement de foudre 100 kA, impédance de pied de pylône ciblée R < 10 Ω.',
        dataExchangedEn: 'Lightning discharge current 100 kA, target tower footing resistance R < 10 Ω.',
        decisionFr: 'Installation de contrepoids en pattes d\'oie et parafoudres de ligne sur les 3 derniers pylônes avant le poste.',
        decisionEn: 'Mandated radial crow-foot counterpoise wires and line surge arresters on the final 3 spans entering substation.',
        impactFr: 'Suppression totale des amorçages en retour (back-flashover) sur les portiques d\'entrée de poste.',
        impactEn: 'Total elimination of back-flashover surges on substation line entry gantries.'
      },
      {
        roleFromFr: 'Ingénieur Sécurité Électrique, Prises de Terre & Foudre (D16)',
        roleFromEn: 'Electrical Safety, Earthing & Lightning Engineer',
        roleToFr: 'Ingénieur Protection & Contrôle-Commande (D11)',
        roleToEn: 'Protection & Relay Engineer',
        phase: 'Réglage Protection Détection d\'Arc Flash Optique (ANSI 50-ARC)',
        dataExchangedFr: 'Calcul de l\'énergie incidente NFPA 70E (cal/cm²), temps d\'élimination d\'arc < 40 ms.',
        dataExchangedEn: 'NFPA 70E incident energy calculation (cal/cm²), required arc fault clearing time < 40 ms.',
        decisionFr: 'Déploiement de capteurs optiques à fibre nue dans les cellules HTA 30 kV avec déclenchement direct disjoncteur.',
        decisionEn: 'Deployed point optical lens sensors inside 30 kV switchgear with direct ultra-fast tripping to upstream breaker.',
        impactFr: 'Réduction de l\'énergie incidente de 18 cal/cm² (mortel) à 1.1 cal/cm² (Catégorie 0 sans danger mortel).',
        impactEn: 'Incident arc flash energy slashed from 18 cal/cm² (lethal) down to 1.1 cal/cm² (Category 0 non-hazardous).'
      }
    ],

    relatedDomains: [
      {
        code: 'D04',
        nameFr: 'Postes Électriques & Appareillage',
        nameEn: 'Substations & Switchgear',
        relationshipFr: 'Tous les châssis d\'appareillage, parafoudres et transformateurs sont reliés au maillage de terre équipotentiel du poste.',
        relationshipEn: 'All switchgear steel structures, surge arresters, and transformer tanks bond directly to the substation ground mesh.'
      },
      {
        code: 'D03',
        nameFr: 'Lignes Aériennes & Réseaux de Transport',
        nameEn: 'Overhead Lines & Transmission',
        relationshipFr: 'Les câbles de garde OPGW et les prises de terre des pieds de pylônes écoulent la foudre et réduisent les amorçages en retour.',
        relationshipEn: 'OPGW shield wires and tower footing grounds dissipate lightning surges, preventing catastrophic line back-flashovers.'
      },
      {
        code: 'D05',
        nameFr: 'Réseaux de Distribution HTA/BT',
        nameEn: 'Distribution Networks & Feeders',
        relationshipFr: 'Le régime de neutre HTA (RPN 300 A) conditionne l\'amplitude des défauts à la terre et la sécurité des tiers.',
        relationshipEn: 'MV neutral earthing (300 A NGR) dictates phase-to-ground fault current magnitudes and public safety margins.'
      },
      {
        code: 'D14',
        nameFr: 'Qualité d\'Énergie & CEM',
        nameEn: 'Power Quality & EMC',
        relationshipFr: 'Une prise de terre à faible impédance haute fréquence est indispensable pour l\'évacuation des transitoires et l\'immunité CEM.',
        relationshipEn: 'A low-impedance high-frequency earth grid is mandatory for rapid surge arrester discharge and substation EMC immunity.'
      },
      {
        code: 'D06',
        nameFr: 'Installations Basse Tension & Bâtiments',
        nameEn: 'Low Voltage Installations & Buildings',
        relationshipFr: 'Définit les régimes de neutre BT (TT, TN-S, IT), les dispositifs différentiels DDR et la protection des personnes contre les contacts indirects.',
        relationshipEn: 'Establishes LV earthing schemes (TT, TN-S, IT), RCD protection, and safeguards occupants against indirect contact shocks.'
      }
    ]
  }
};



