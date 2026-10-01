// src/data/ecosystem/ecosystemIntelligenceRegistry.ts
// EPEDE — Master Registry for Continuous Ecosystem Understanding & Engineering Intelligence
// Implements the 7-Tier Progressive Engineering Architecture:
// Energy → System → Equipment → Engineering → Digital → Knowledge
// Level 1: UNDERSTAND | Level 2: ENGINEER | Level 3: ENGINEERING REFERENCE

export interface DomainEcosystemManifest {
  domainCode: string;
  stageKey: 'generation' | 'transmission' | 'substation' | 'distribution';
  title_fr: string;
  title_en: string;
  tagline_fr: string;
  tagline_en: string;
  chainPosition: {
    stageIndex: number; // 1 to 6
    totalStages: number;
    prevStageName_fr: string | null;
    prevStageName_en: string | null;
    nextStageName_fr: string | null;
    nextStageName_en: string | null;
  };
  whyExists_fr: string;
  whyExists_en: string;
  problemSolved_fr: string;
  problemSolved_en: string;
  inputFlow: {
    energyForm_fr: string;
    energyForm_en: string;
    voltageOrPressure: string;
    sourceOrigin_fr: string;
    sourceOrigin_en: string;
  };
  internalTransformation: {
    coreProcess_fr: string;
    coreProcess_en: string;
    keyPhenomenon_fr: string;
    keyPhenomenon_en: string;
    governingLaw: string;
  };
  outputFlow: {
    energyForm_fr: string;
    energyForm_en: string;
    voltageOrRating: string;
    destination_fr: string;
    destination_en: string;
  };
  upstreamRelationship_fr: string;
  upstreamRelationship_en: string;
  downstreamRelationship_fr: string;
  downstreamRelationship_en: string;
}

export interface FollowTheEnergyStep {
  stepNumber: number;
  stageCode: 'SOURCE' | 'CONVERT' | 'STEP_UP' | 'CORRIDOR' | 'MEASURE' | 'CONTROL' | 'PROTECT' | 'EVACUATE';
  title_fr: string;
  title_en: string;
  shortDesc_fr: string;
  shortDesc_en: string;
  equipmentTargetId: string;
  energyState_fr: string;
  energyState_en: string;
  voltageRating: string;
  physicalEquation?: string;
  hotspotBadgeRef: number;
}

export interface ProgressiveEquipmentData {
  id: string;
  badgeNumber: number;
  engineeringName: { fr: string; en: string };
  commonName: { fr: string; en: string };
  locationInEcosystem: { fr: string; en: string };
  maturityStatus: 'COMPLETE' | 'VERIFIED_STANDARDS' | 'APPLICATION_DEPENDENT' | 'MANUFACTURER_SPECIFIC' | 'NEEDS_FIELD_DATA';

  // LEVEL 1: UNDERSTAND (Simple, Intuitive, Ecosystem-First)
  level1: {
    purposeWhy: { fr: string; en: string }; // Why does it exist? What problem does it solve?
    concreteFunction: { fr: string; en: string }; // What does it do?
    workingPrincipleSimple: { fr: string; en: string }; // Understandable language before deeper jargon
    energyFlow: {
      upstreamInput: { fr: string; en: string };
      equipmentProcessing: { fr: string; en: string };
      downstreamOutput: { fr: string; en: string };
    };
    electricalRoleSummary: {
      voltage: string;
      currentOrPower: string;
      frequency: string;
      powerFactorOrEfficiency?: string;
      insulationOrEnclosure?: string;
    };
  };

  // LEVEL 2: ENGINEER (Parameters, Relationships, Protection, Control, States)
  level2: {
    whyParametersMatter: Array<{
      parameter: string;
      meaning: { fr: string; en: string };
      engineeringImpact: { fr: string; en: string };
    }>;
    engineeringParameters: Array<{
      symbol: string;
      name: { fr: string; en: string };
      typicalValue: string;
      unit: string;
      status: 'VERIFIED' | 'APPLICATION_DEPENDENT' | 'MANUFACTURER_SPECIFIC';
    }>;
    relationships: {
      upstreamFeeder: { fr: string; en: string };
      downstreamFed: { fr: string; en: string };
      protectionChain: {
        ansiCodes: string[];
        relayTypes: { fr: string; en: string };
        operatingTime: string;
      };
      controlSystem: {
        architecture: { fr: string; en: string }; // SCADA, RTU, PLC
        communicationProtocol: string; // IEC 61850, Modbus, DNP3
      };
      meteringSystem: {
        sensors: { fr: string; en: string }; // CT, VT, Rogowski
        accuracyClass: string;
      };
      earthingSystem: { fr: string; en: string };
      auxiliarySupplies: { fr: string; en: string }; // 110Vdc, Cooling, Oil
    };
    operatingStates: Array<{
      state: 'OFF' | 'STARTING' | 'ENERGIZED' | 'NORMAL' | 'ABNORMAL' | 'TRIPPED' | 'MAINTENANCE' | 'RESTORATION';
      label: { fr: string; en: string };
      condition: { fr: string; en: string };
    }>;
    failureSequence: {
      normalState: { fr: string; en: string };
      abnormalCondition: { fr: string; en: string };
      detectionMethod: { fr: string; en: string };
      protectiveAction: { fr: string; en: string };
      isolationAndAlarms: { fr: string; en: string };
      restorationProcedure: { fr: string; en: string };
    };
  };

  // LEVEL 3: ENGINEERING REFERENCE (Standards, Docs, Safety, Cross-Domain)
  level3: {
    verifiedStandards: Array<{
      organization: 'IEC' | 'IEEE' | 'ISO' | 'CIGRE' | 'NFPA' | 'NATIONAL_GRID_CODE';
      standardNumber: string;
      title: string;
      scope: { fr: string; en: string };
      normativeStatus: 'NORMATIVE' | 'REGULATORY' | 'ADVISORY' | 'REQUIRES_VERIFICATION';
      verificationNote?: string;
    }>;
    engineeringDocumentation: Array<{
      documentType: { fr: string; en: string };
      deliverableName: string;
      status: 'AVAILABLE' | 'NOT_YET_ATTACHED' | 'APPLICATION_DEPENDENT';
      standardRef?: string;
    }>;
    safetyLayer: {
      primaryHazards: Array<{ fr: string; en: string }>;
      arcFlashBoundary?: string;
      isolationLOTO: { fr: string; en: string };
      earthingMALT: { fr: string; en: string };
      requiredPPE: Array<{ fr: string; en: string }>;
    };
    crossDomainLinks: Array<{
      domainCode: string;
      domainName: { fr: string; en: string };
      relationshipContext: { fr: string; en: string };
    }>;
  };
}

// -----------------------------------------------------------------------------
// 1. DOMAIN ECOSYSTEM MANIFESTS ("WHERE AM I? WHAT IS THIS DOMAIN?")
// -----------------------------------------------------------------------------
export const DOMAIN_ECOSYSTEM_MANIFESTS: Record<string, DomainEcosystemManifest> = {
  generation: {
    domainCode: 'D01',
    stageKey: 'generation',
    title_fr: "Production d'Énergie Électrique",
    title_en: "Electrical Power Generation",
    tagline_fr: "Conversion des ressources primaires en puissance électrique triphasée synchrone",
    tagline_en: "Conversion of primary energy resources into regulated synchronous three-phase electrical power",
    chainPosition: {
      stageIndex: 1,
      totalStages: 6,
      prevStageName_fr: null, // Point de départ de la chaîne
      prevStageName_en: null,
      nextStageName_fr: "Transport Haute Tension (225 kV)",
      nextStageName_en: "High Voltage Transmission (225 kV)"
    },
    whyExists_fr: "La production d'énergie transforme l'énergie mécanique, thermique ou radiative disponible dans la nature en énergie électrique immédiatement exploitable, stable en fréquence (50 Hz) et en tension.",
    whyExists_en: "Power generation converts raw kinetic, thermodynamic, or solar radiative energy from nature into instantly usable electrical power, precisely regulated in frequency (50 Hz) and voltage.",
    problemSolved_fr: "Fournir en continu la puissance active (MW) pour équilibrer la demande des consommateurs et la puissance réactive (Mvar) pour maintenir le profil de tension du réseau interconnecté.",
    problemSolved_en: "Continuously supply active power (MW) to balance consumer demand and reactive power (Mvar) to sustain the interconnected grid voltage profile.",
    inputFlow: {
      energyForm_fr: "Énergie Primaire : Énergie cinétique et potentielle de l'eau (retenues de barrage), rayonnement solaire, vent ou hydrocarbures gazeux",
      energyForm_en: "Primary Energy: Kinetic and potential water energy (dam reservoirs), solar irradiance, wind kinetic, or gaseous hydrocarbons",
      voltageOrPressure: "Pression hydraulique (ex. 120 bar / chute 110 m à Songloulou) ou Débit massique",
      sourceOrigin_fr: "Ressources naturelles nationales (Bassin de la Sanaga, parcs solaires Grand Nord)",
      sourceOrigin_en: "National natural resources (Sanaga River basin, Grand North solar PV plants)"
    },
    internalTransformation: {
      coreProcess_fr: "Conversion électromécanique via turbines hydrauliques/gaz couplées à des alternateurs synchrones triphasés, régulation de vitesse (gouverneur) et de tension (AVR), puis élévation de tension vers 225 kV.",
      coreProcess_en: "Electromechanical conversion via hydro/gas turbines coupled to 3-phase synchronous generators, frequency governing and excitation control (AVR), followed by step-up transformation to 225 kV.",
      keyPhenomenon_fr: "Induction électromagnétique selon la loi de Faraday-Lenz (E = 4.44 · f · N · Φ)",
      keyPhenomenon_en: "Electromagnetic induction governed by Faraday-Lenz law (E = 4.44 · f · N · Φ)",
      governingLaw: "E = 4.44 \\cdot f \\cdot N \\cdot \\Phi"
    },
    outputFlow: {
      energyForm_fr: "Énergie Électrique Triphasée Haute Tension HTB (225 kV, 50.00 Hz, cos φ ≈ 0.95)",
      energyForm_en: "Three-Phase High Voltage AC Power (225 kV, 50.00 Hz, cos φ ≈ 0.95)",
      voltageOrRating: "10.5-15 kV (bornes alternateur) → 225 kV (sortie transformateur GSU)",
      destination_fr: "Poste d'évacuation de centrale et réseau d'interconnexion transport 225 kV",
      destination_en: "Power plant switchyard and 225 kV interconnected transmission grid"
    },
    upstreamRelationship_fr: "Ressource énergétique primaire amont (retenue hydraulique, gazoduc Kribi, irradiance solaire).",
    upstreamRelationship_en: "Upstream primary resource (hydro reservoir, Kribi natural gas pipeline, solar irradiance).",
    downstreamRelationship_fr: "Alimente directement le Domaine D03 (Réseau de Transport Haute Tension 225 kV) via le poste d'évacuation.",
    downstreamRelationship_en: "Directly supplies Domain D03 (High Voltage Transmission Grid 225 kV) via the generator switchyard."
  },

  transmission: {
    domainCode: 'D03',
    stageKey: 'transmission',
    title_fr: "Réseau de Transport Haute Tension",
    title_en: "High Voltage Transmission Networks",
    tagline_fr: "Corridors de transport d'énergie en vrac sur de longues distances avec pertes minimales",
    tagline_en: "Bulk energy transmission corridors over long distances with minimal Joule losses",
    chainPosition: {
      stageIndex: 2,
      totalStages: 6,
      prevStageName_fr: "Production d'Énergie (D01)",
      prevStageName_en: "Energy Production (D01)",
      nextStageName_fr: "Postes Électriques Sources (D04)",
      nextStageName_en: "Grid Node Substations (D04)"
    },
    whyExists_fr: "Les centres de production (barrages sur la Sanaga, centrales côtières) sont géographiquement éloignés des grands centres de consommation (Douala, Yaoundé). Le transport à très haute tension (225 kV) réduit drastiquement le courant, et donc les pertes par effet Joule.",
    whyExists_en: "Generation centers (dams on the Sanaga River, coastal gas plants) are far from load consumption centers (Douala, Yaoundé). Transmission at 225 kV reduces current dramatically, minimizing Joule losses.",
    problemSolved_fr: "Acheminer des centaines de mégawatts sur 100 à 400 km sans échauffement excessif des conducteurs ni chute de tension inadmissible, tout en interconnectant les réseaux régionaux.",
    problemSolved_en: "Transmit hundreds of megawatts across 100-400 km without thermal overload or unacceptable voltage sag while interconnecting regional networks.",
    inputFlow: {
      energyForm_fr: "Puissance en vrac sous 225 kV injectée par les postes élévateurs de centrale",
      energyForm_en: "Bulk electrical power at 225 kV stepped up from power plant switchyards",
      voltageOrPressure: "225 kV triphasé alternatif (50 Hz)",
      sourceOrigin_fr: "Postes d'évacuation de Songloulou, Nachtigal, Edéa, Kribi",
      sourceOrigin_en: "Switchyards of Songloulou, Nachtigal, Edea, Kribi"
    },
    internalTransformation: {
      coreProcess_fr: "Transit de puissance dans des faisceaux de conducteurs aériens (Almélec/ACSR) suspendus à des pylônes métalliques, contrôle de l'impédance de ligne (surcompensation réactive, FACTS), et protection contre la foudre par câble de garde OPGW.",
      coreProcess_en: "Power transit through bundled overhead conductors (ACSR/AAAC) supported on lattice steel towers, reactive impedance management (shunt compensation, FACTS), and lightning shielding via OPGW optical earth wires.",
      keyPhenomenon_fr: "Équations des lignes télégraphistes et impédance caractéristique (SIL = U² / Zc)",
      keyPhenomenon_en: "Telegrapher line equations and Surge Impedance Loading (SIL = U² / Zc)",
      governingLaw: "P_{joule} = 3 R I^2 = \\frac{R P^2}{U^2 \\cos^2\\varphi}"
    },
    outputFlow: {
      energyForm_fr: "Puissance électrique triphasée 225 kV avec profil de tension stabilisé",
      energyForm_en: "Three-phase 225 kV power with stabilized voltage profile",
      voltageOrRating: "225 kV (tolérance d'exploitation : 200 kV à 245 kV)",
      destination_fr: "Postes d'interconnexion et postes sources régionaux (Bekoko, Mangombe, Oyomabang)",
      destination_en: "Regional interconnecting and primary grid substations (Bekoko, Mangombe, Oyomabang)"
    },
    upstreamRelationship_fr: "Reçoit l'énergie des centrales du Domaine D01 après élévation de tension.",
    upstreamRelationship_en: "Receives bulk power from Domain D01 power plants following step-up transformation.",
    downstreamRelationship_fr: "Alimente le Domaine D04 (Postes Électriques & Noeuds du Réseau) pour l'abaissement de tension.",
    downstreamRelationship_en: "Supplies Domain D04 (Substations & Grid Nodes) for voltage step-down."
  },

  substation: {
    domainCode: 'D04',
    stageKey: 'substation',
    title_fr: "Postes Électriques & Noeuds du Réseau",
    title_en: "Substations & Grid Nodes",
    tagline_fr: "Carrefours stratégiques d'aiguillage, d'abaissement de tension et de protection du réseau",
    tagline_en: "Strategic intersections for routing, voltage step-down, and grid protection",
    chainPosition: {
      stageIndex: 3,
      totalStages: 6,
      prevStageName_fr: "Réseau de Transport (D03)",
      prevStageName_en: "Transmission Networks (D03)",
      nextStageName_fr: "Réseaux de Distribution (D05)",
      nextStageName_en: "Distribution Networks (D05)"
    },
    whyExists_fr: "Le poste électrique est le centre névralgique du réseau : il permet d'abaisser la tension de transport (225 kV) vers la moyenne tension (30 kV / 15 kV), d'isoler les défauts par disjoncteurs pour éviter les blackouts, et d'aiguiller les flux d'énergie.",
    whyExists_en: "The substation is the network's nerve center: it steps down high transmission voltage (225 kV) to medium voltage (30 kV / 15 kV), isolates faults via high-speed breakers to avoid blackouts, and routes energy flows.",
    problemSolved_fr: "Interconnecter plusieurs lignes, transformer la tension aux puissances requises (50-120 MVA), sectionner les ouvrages pour maintenance sans coupure de service, et protéger les équipements critiques contre les courts-circuits.",
    problemSolved_en: "Interconnect multiple lines, transform voltage at required ratings (50-120 MVA), isolate sections for maintenance without power interruption, and protect critical assets from short circuits.",
    inputFlow: {
      energyForm_fr: "Lignes de transport 225 kV ou 90 kV raccordées aux travées de ligne",
      energyForm_en: "225 kV or 90 kV transmission lines connected to incoming line bays",
      voltageOrPressure: "225 kV nominal triphasé",
      sourceOrigin_fr: "Corridors de transport haute tension en provenance des centrales",
      sourceOrigin_en: "High voltage transmission corridors from power generation hubs"
    },
    internalTransformation: {
      coreProcess_fr: "Abaissement de tension par transformateurs de puissance triphasés (225/30 kV ONAF/OFAF), commutation par disjoncteurs SF6 ou sous vide, répartition sur double jeu de barres, et acquisition des mesures TC/TT pour automates numériques.",
      coreProcess_en: "Voltage step-down via three-phase power transformers (225/30 kV ONAF/OFAF), switching via SF6 or vacuum breakers, double-busbar routing, and CT/VT measurement acquisition for digital relays.",
      keyPhenomenon_fr: "Transformation électromagnétique et pouvoir de coupure de l'arc électrique (SF6/vide)",
      keyPhenomenon_en: "Electromagnetic power transformation and arc extinguishing power (SF6/vacuum)",
      governingLaw: "\\frac{U_1}{U_2} \\approx \\frac{N_1}{N_2} = \\frac{I_2}{I_1}"
    },
    outputFlow: {
      energyForm_fr: "Moyenne Tension HTA (30 kV ou 15 kV) distribuée vers les rames de départs",
      energyForm_en: "Medium Voltage MV (30 kV or 15 kV) routed towards feeder switchboard lineups",
      voltageOrRating: "30 kV / 15 kV sous régulation automatique de tension en charge (Changeur de prises OLTC)",
      destination_fr: "Réseaux de distribution urbains et périurbains (postes de répartition et postes MT/BT)",
      destination_en: "Urban and rural distribution networks (distribution feeders and MV/LV substations)"
    },
    upstreamRelationship_fr: "Raccordé au Réseau de Transport Haute Tension 225 kV (Domaine D03).",
    upstreamRelationship_en: "Connected to the High Voltage Transmission Grid 225 kV (Domain D03).",
    downstreamRelationship_fr: "Injecte l'énergie dans les Réseaux de Distribution HTA (Domaine D05).",
    downstreamRelationship_en: "Feeds energy into Medium Voltage Distribution Networks (Domain D05)."
  },

  distribution: {
    domainCode: 'D05',
    stageKey: 'distribution',
    title_fr: "Réseaux de Distribution & Installations",
    title_en: "Distribution Networks & Installations",
    tagline_fr: "Acheminement terminal de proximité, abaissement BT 400V et alimentation des usagers",
    tagline_en: "Local terminal delivery, 400V LV step-down, and end-user power supply",
    chainPosition: {
      stageIndex: 4,
      totalStages: 6,
      prevStageName_fr: "Postes Électriques Sources (D04)",
      prevStageName_en: "Substations & Grid Nodes (D04)",
      nextStageName_fr: "Installations & Utilisation Finale (D06)",
      nextStageName_en: "Electrical Installations & Utilization (D06)"
    },
    whyExists_fr: "La distribution achemine l'énergie électrique au plus près des consommateurs (villes, villages, zones industrielles) et abaisse la moyenne tension en basse tension sécurisée (400 V triphasé / 230 V monophasé) directement utilisable par les équipements.",
    whyExists_en: "Distribution carries electrical energy close to consumers (cities, villages, industrial zones) and steps down medium voltage to safe low voltage (400 V 3-phase / 230 V single-phase) usable by equipment.",
    problemSolved_fr: "Alimenter des milliers de clients dispersés avec une excellente continuité de service (SAIDI/SAIFI maîtrisés), reconfigurer les boucles MT en cas d'avarie (RMU), et adapter la qualité de l'énergie (cos φ, harmoniques).",
    problemSolved_en: "Supply thousands of dispersed consumers with high service reliability (controlled SAIDI/SAIFI), reconfigure MV open loops during faults (RMU), and preserve power quality.",
    inputFlow: {
      energyForm_fr: "Départs Moyenne Tension 30 kV ou 15 kV souterrains ou aériens",
      energyForm_en: "30 kV or 15 kV Medium Voltage underground feeders or overhead lines",
      voltageOrPressure: "30 kV / 15 kV alternatif triphasé",
      sourceOrigin_fr: "Jeux de barres HTA des postes sources régionaux (D04)",
      sourceOrigin_en: "MV busbars of regional primary substations (D04)"
    },
    internalTransformation: {
      coreProcess_fr: "Bouclage et sectionnement par Tableaux Moyenne Tension (RMU 24/36 kV), abaissement en basse tension par transformateurs de distribution MT/BT (Dyn11 100 à 1600 kVA), distribution par tableaux généraux TGBT et protection modulaire.",
      coreProcess_en: "Looping and sectionalizing via Ring Main Units (RMU 24/36 kV), step-down to LV via MV/LV distribution transformers (Dyn11 100-1600 kVA), distribution via main low voltage switchboards (TGBT) and modular protection.",
      keyPhenomenon_fr: "Couplage Dyn11 (création du conducteur neutre BT) et régimes de neutre (TT, TN, IT)",
      keyPhenomenon_en: "Dyn11 vector group (creation of LV neutral conductor) and earthing arrangements (TT, TN, IT)",
      governingLaw: "U_{phase-neutre} = \\frac{U_{phase-phase}}{\\sqrt{3}} = \\frac{400}{\\sqrt{3}} \\approx 230\\text{ V}"
    },
    outputFlow: {
      energyForm_fr: "Basse Tension 400 V triphasé / 230 V monophasé normalisée",
      energyForm_en: "Standardized Low Voltage 400 V three-phase / 230 V single-phase",
      voltageOrRating: "400 V / 230 V (50 Hz), conformité norme CEI 60038",
      destination_fr: "Installations électriques tertiaires, industrielles, résidentielles et bornes de recharge IRVE",
      destination_en: "Commercial buildings, industrial plants, residential dwellings, and EV charging infrastructure"
    },
    upstreamRelationship_fr: "Reçoit l'énergie des postes sources MT du Domaine D04.",
    upstreamRelationship_en: "Receives energy from Domain D04 primary MV substations.",
    downstreamRelationship_fr: "Alimente le Domaine D06 (Installations Électriques & Utilisation Finale) et les charges terminales.",
    downstreamRelationship_en: "Directly supplies Domain D06 (Electrical Installations & Final Loads)."
  }
};

// -----------------------------------------------------------------------------
// 2. THE 8-STEP "FOLLOW THE ENERGY" PHYSICAL PROCESS PIPELINES
// -----------------------------------------------------------------------------
export const FOLLOW_THE_ENERGY_PIPELINES: Record<string, FollowTheEnergyStep[]> = {
  generation: [
    {
      stepNumber: 1,
      stageCode: 'SOURCE',
      title_fr: "1. Énergie Primaire & Retenue",
      title_en: "1. Primary Resource & Dam Intake",
      shortDesc_fr: "Retenue d'eau du barrage (Songloulou/Nachtigal), hauteur de chute H et débit massique Q.",
      shortDesc_en: "Dam water reservoir, net hydraulic head H and mass flow rate Q.",
      equipmentTargetId: 'pin-hydro',
      energyState_fr: "Énergie potentielle de pesanteur (Ep = m·g·h)",
      energyState_en: "Gravitational potential energy (Ep = m·g·h)",
      voltageRating: "Pression statique ~12 bar",
      physicalEquation: "E_p = m \\cdot g \\cdot H",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 2,
      stageCode: 'CONVERT',
      title_fr: "2. Conversion Électromécanique",
      title_en: "2. Electromechanical Conversion",
      shortDesc_fr: "Turbine Francis entraînant le rotor de l'alternateur synchrone triphasé à pôles saillants.",
      shortDesc_en: "Francis turbine driving salient-pole synchronous generator rotor.",
      equipmentTargetId: 'pin-hydro',
      energyState_fr: "Énergie mécanique de rotation (P = C·ω)",
      energyState_en: "Rotational mechanical energy (P = T·ω)",
      voltageRating: "10.5 kV - 15 kV AC",
      physicalEquation: "P_{elec} = \\eta \\cdot \\rho \\cdot g \\cdot Q \\cdot H",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 3,
      stageCode: 'STEP_UP',
      title_fr: "3. Élévation de Tension GSU",
      title_en: "3. Generator Step-Up (GSU)",
      shortDesc_fr: "Transformateur élévateur GSU 10.5 kV / 225 kV réduisant le courant par un facteur 20.",
      shortDesc_en: "GSU step-up transformer 10.5 kV / 225 kV reducing current by factor of 20.",
      equipmentTargetId: 'pin-gsu',
      energyState_fr: "Haute tension alternative HTB (pertes Joule minimisées)",
      energyState_en: "High voltage AC power (Joule losses minimized)",
      voltageRating: "10.5 kV → 225 kV",
      physicalEquation: "P_{joule} = 3 R I^2 = \\frac{R P^2}{U^2 \\cos^2\\varphi}",
      hotspotBadgeRef: 2
    },
    {
      stepNumber: 4,
      stageCode: 'CORRIDOR',
      title_fr: "4. Commutation & Jeu de Barres",
      title_en: "4. Switching & Generator Switchyard",
      shortDesc_fr: "Disjoncteur de groupe et sectionneurs d'aiguillage vers le poste d'évacuation de centrale.",
      shortDesc_en: "Generator circuit breaker and disconnectors routing to power plant switchyard.",
      equipmentTargetId: 'pin-gsu',
      energyState_fr: "Puissance active 420 MW en transit",
      energyState_en: "420 MW active power in transit",
      voltageRating: "225 kV",
      physicalEquation: "I_{sc} = \\frac{U}{\\sqrt{3} \\cdot Z_{sc}}",
      hotspotBadgeRef: 2
    },
    {
      stepNumber: 5,
      stageCode: 'MEASURE',
      title_fr: "5. Métrologie & Capteurs TC/TT",
      title_en: "5. Metering & CT/VT Sensors",
      shortDesc_fr: "Transformateurs de courant (TC) et de tension (TT) de classe 0.2S pour le comptage transactionnel.",
      shortDesc_en: "Class 0.2S current and voltage instrument transformers for fiscal energy metering.",
      equipmentTargetId: 'pin-hydro',
      energyState_fr: "Signaux normalisés 100V / 1A vers instrumentation",
      energyState_en: "Normalized 100V / 1A signals to instrumentation",
      voltageRating: "100V / 1A secondaires",
      physicalEquation: "P_{mesure} = \\sqrt{3} \\cdot k_u U \\cdot k_i I \\cdot \\cos\\varphi",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 6,
      stageCode: 'CONTROL',
      title_fr: "6. Régulation & Contrôle-Commande",
      title_en: "6. Governor & Excitation Control",
      shortDesc_fr: "Régulateur de vitesse (50 Hz) et régulateur d'excitation AVR maintenant la tension constante.",
      shortDesc_en: "Speed governor (50 Hz) and AVR excitation system maintaining stable generator terminal voltage.",
      equipmentTargetId: 'pin-hydro',
      energyState_fr: "Stabilité dynamique de l'angle de puissance δ",
      energyState_en: "Dynamic power angle stability δ",
      voltageRating: "Régulation ±1.5%",
      physicalEquation: "P = \\frac{E \\cdot V}{X_d} \\sin\\delta",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 7,
      stageCode: 'PROTECT',
      title_fr: "7. Protection Différentielle & Réseau",
      title_en: "7. Differential & Machine Protection",
      shortDesc_fr: "Relais numériques ANSI 87G (différentielle alternateur), 87T (transfo) et 40 (perte d'excitation).",
      shortDesc_en: "Digital protection relays ANSI 87G (generator differential), 87T (trafo) and 40 (loss of field).",
      equipmentTargetId: 'pin-gsu',
      energyState_fr: "Surveillance temps réel du courant différentiel",
      energyState_en: "Real-time differential current monitoring",
      voltageRating: "Temps de déclenchement < 40 ms",
      physicalEquation: "I_{diff} = |\\vec{I}_1 - \\vec{I}_2| > I_{seuil}",
      hotspotBadgeRef: 2
    },
    {
      stepNumber: 8,
      stageCode: 'EVACUATE',
      title_fr: "8. Évacuation vers Réseau 225 kV",
      title_en: "8. Evacuation to 225 kV Transmission",
      shortDesc_fr: "Injection directe sur les lignes d'interconnexion 225 kV Songloulou-Mangombe-Bekoko.",
      shortDesc_en: "Direct injection onto 225 kV interconnection lines Songloulou-Mangombe-Bekoko.",
      equipmentTargetId: 'pin-gsu',
      energyState_fr: "Onde électromagnétique guidée vers le réseau national",
      energyState_en: "Guided electromagnetic wave into national power grid",
      voltageRating: "225 kV Triphasé",
      physicalEquation: "P_{transit} = \\frac{U_1 U_2}{X_{ligne}} \\sin\\theta",
      hotspotBadgeRef: 2
    }
  ],

  transmission: [
    {
      stepNumber: 1,
      stageCode: 'SOURCE',
      title_fr: "1. Injection Poste Élévateur",
      title_en: "1. Step-Up Switchyard Injection",
      shortDesc_fr: "Sortie des transformateurs 225 kV des centrales de production (D01).",
      shortDesc_en: "225 kV transformer output from power generation plants (D01).",
      equipmentTargetId: 'pin-trans-gen',
      energyState_fr: "Énergie électrique sous haute tension 225 kV",
      energyState_en: "Electrical energy at 225 kV high voltage",
      voltageRating: "225 kV",
      physicalEquation: "P = \\sqrt{3} U I \\cos\\varphi",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 2,
      stageCode: 'STEP_UP',
      title_fr: "2. Travée de Départ & Sectionnement",
      title_en: "2. Line Bay & Disconnecting",
      shortDesc_fr: "Disjoncteur de ligne SF6 225 kV et sectionneurs avec couteaux de mise à la terre.",
      shortDesc_en: "225 kV SF6 line circuit breaker and disconnectors with earth blades.",
      equipmentTargetId: 'pin-trans-sub-send',
      energyState_fr: "Courant assigné de 1250 A à 2000 A",
      energyState_en: "Rated current 1250 A to 2000 A",
      voltageRating: "225 kV (Tenue foudre 1050 kV)",
      physicalEquation: "I_{th} = 31.5\\text{ kA / 3s}",
      hotspotBadgeRef: 3
    },
    {
      stepNumber: 3,
      stageCode: 'CORRIDOR',
      title_fr: "3. Pylône Métallique & Isolateurs",
      title_en: "3. Lattice Steel Tower & Insulators",
      shortDesc_fr: "Pylônes d'alignement tétranydres maintenant la garde au sol réglementaire (> 8.5 m).",
      shortDesc_en: "Lattice transmission towers ensuring required ground clearance (> 8.5 m).",
      equipmentTargetId: 'pin-tower-main',
      energyState_fr: "Isolation diélectrique par chaînes de verre/composite",
      energyState_en: "Dielectric insulation via glass/composite string sets",
      voltageRating: "Ligne de fuite 25 mm/kV",
      physicalEquation: "d_{sol} \\ge 6.5 + 0.006 \\cdot U",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 4,
      stageCode: 'CORRIDOR',
      title_fr: "4. Faisceau Conducteur & Câble OPGW",
      title_en: "4. Conductor Bundle & OPGW Earth Wire",
      shortDesc_fr: "Conducteurs Almélec (AAAC 570 mm²) en faisceau et câble de garde OPGW télécom.",
      shortDesc_en: "AAAC 570 mm² conductor bundle and OPGW composite optical earth wire.",
      equipmentTargetId: 'pin-bundle',
      energyState_fr: "Transmission guidée dans le corridor aérien",
      energyState_en: "Guided transmission along aerial corridor",
      voltageRating: "225 kV triphasé",
      physicalEquation: "Z_c = \\sqrt{L / C} \\approx 380\\ \\Omega",
      hotspotBadgeRef: 5
    },
    {
      stepNumber: 5,
      stageCode: 'MEASURE',
      title_fr: "5. Mesure Haute Tension & Téléconduite",
      title_en: "5. High Voltage Metering & Telecontrol",
      shortDesc_fr: "Transformateurs de tension capacitifs (CVT) et TC tore de protection.",
      shortDesc_en: "Capacitive voltage transformers (CVT) and protective bushing CTs.",
      equipmentTargetId: 'pin-trans-sub-send',
      energyState_fr: "Mesure de transit P, Q, U, I transmise en SCADA IEC 60870-5-104",
      energyState_en: "Active/reactive power telemetries sent via IEC 60870-5-104",
      voltageRating: "Précision classe 0.2",
      physicalEquation: "Q = \\sqrt{3} U I \\sin\\varphi",
      hotspotBadgeRef: 3
    },
    {
      stepNumber: 6,
      stageCode: 'CONTROL',
      title_fr: "6. Compensation Réactive & Stabilité",
      title_en: "6. Reactive Compensation & Stability",
      shortDesc_fr: "Inductances shunt absorbant l'effet Ferranti à vide et bancs de condensateurs.",
      shortDesc_en: "Shunt reactors mitigating Ferranti effect at light load and capacitor banks.",
      equipmentTargetId: 'pin-trans-sub-rec',
      energyState_fr: "Maintien de la tension dans la plage 0.95 - 1.05 Un",
      energyState_en: "Voltage maintained within 0.95 - 1.05 Un tolerance",
      voltageRating: "-30 Mvar à +50 Mvar",
      physicalEquation: "\\Delta U = \\frac{P R + Q X}{U}",
      hotspotBadgeRef: 7
    },
    {
      stepNumber: 7,
      stageCode: 'PROTECT',
      title_fr: "7. Protection de Distance & Différentielle",
      title_en: "7. Distance & Line Differential Protection",
      shortDesc_fr: "Relais ANSI 21 (Distance à 5 zones de déclenchement) et 87L (Différentielle de ligne sur fibre).",
      shortDesc_en: "ANSI 21 distance relays (5 impedance zones) and 87L line differential via optical fiber.",
      equipmentTargetId: 'pin-tower-main',
      energyState_fr: "Élimination des défauts polyphasés en < 60 ms",
      energyState_en: "Fault clearing of polyphase faults in < 60 ms",
      voltageRating: "Temps d'élimination < 60 ms",
      physicalEquation: "Z_{mesure} = \\frac{U_k}{I_k + k_0 I_0} < Z_{zone1}",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 8,
      stageCode: 'EVACUATE',
      title_fr: "8. Entrée au Poste Source Régional",
      title_en: "8. Entry to Regional Primary Substation",
      shortDesc_fr: "Arrivée aux jeux de barres 225 kV du poste de Bekoko / Oyomabang pour abaissement (D04).",
      shortDesc_en: "Arrival at 225 kV busbars of Bekoko / Oyomabang substation for step-down (D04).",
      equipmentTargetId: 'pin-trans-sub-rec',
      energyState_fr: "Énergie disponible pour l'abaissement et la distribution",
      energyState_en: "Energy ready for step-down transformation and distribution",
      voltageRating: "225 kV → Entrée Postes D04",
      physicalEquation: "S = \\sqrt{P^2 + Q^2}",
      hotspotBadgeRef: 7
    }
  ],

  substation: [
    {
      stepNumber: 1,
      stageCode: 'SOURCE',
      title_fr: "1. Arrivée Ligne 225 kV Transport",
      title_en: "1. Incoming 225 kV Transmission Line",
      shortDesc_fr: "Point d'interface avec le réseau de transport (D03), portique d'ancrage et parafoudre d'entrée.",
      shortDesc_en: "Interface boundary with transmission grid (D03), dead-end gantry and surge arrester.",
      equipmentTargetId: 'pin-sub-trans-in',
      energyState_fr: "Onde 225 kV arrivant de la ligne de transport",
      energyState_en: "225 kV incoming wave from transmission line",
      voltageRating: "225 kV",
      physicalEquation: "U_{res} < U_{BIL} / 1.2",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 2,
      stageCode: 'STEP_UP',
      title_fr: "2. Travée d'Arrivée & Disjoncteur SF6",
      title_en: "2. Line Bay & SF6 Circuit Breaker",
      shortDesc_fr: "Disjoncteur 225 kV 31.5 kA à gaz SF6 assurant l'isolement ultrarapide des défauts réseau.",
      shortDesc_en: "225 kV 31.5 kA SF6 circuit breaker ensuring ultra-fast clearance of network faults.",
      equipmentTargetId: 'pin-sub-cb',
      energyState_fr: "Capacité de coupure 31.5 kA en 50 ms",
      energyState_en: "Breaking capacity 31.5 kA within 50 ms",
      voltageRating: "225 kV (Pouvoir de coupure 31.5 kA)",
      physicalEquation: "I_{breaking} = 31.5\\text{ kA RMS}",
      hotspotBadgeRef: 3
    },
    {
      stepNumber: 3,
      stageCode: 'CORRIDOR',
      title_fr: "3. Double Jeu de Barres 225 kV",
      title_en: "3. 225 kV Double Busbar System",
      shortDesc_fr: "Architecture double barre (Barre A & Barre B) avec sectionneurs d'aiguillage sans coupure.",
      shortDesc_en: "Double busbar arrangement (Bus A & Bus B) with seamless bypass disconnectors.",
      equipmentTargetId: 'pin-sub-bus-225',
      energyState_fr: "Puissance collective centralisée sur les barres",
      energyState_en: "Collective power routed through rigid/flexible buses",
      voltageRating: "225 kV (Barre A / Barre B)",
      physicalEquation: "I_{barre} = \\sum I_{departs}",
      hotspotBadgeRef: 2
    },
    {
      stepNumber: 4,
      stageCode: 'CONVERT',
      title_fr: "4. Transformateur de Puissance 225/30 kV",
      title_en: "4. Power Transformer 225/30 kV",
      shortDesc_fr: "Transformateur abaisseur triphasé 63 MVA ONAF avec changeur de prises en charge (OLTC).",
      shortDesc_en: "63 MVA ONAF three-phase step-down transformer with on-load tap changer (OLTC).",
      equipmentTargetId: 'pin-sub-trafo',
      energyState_fr: "Abaissement de 225 kV vers la moyenne tension 30 kV",
      energyState_en: "Voltage stepped down from 225 kV to 30 kV MV",
      voltageRating: "225 kV / 30 kV (63 MVA)",
      physicalEquation: "U_{sec} = U_{pri} \\cdot \\frac{N_{sec}}{N_{pri} \\pm \\Delta n}",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 5,
      stageCode: 'MEASURE',
      title_fr: "5. Chaîne de Mesure TC/TT & Comptage",
      title_en: "5. Metering & Instrument Sensors",
      shortDesc_fr: "Réducteurs de mesure combinés TC/TT alimentant les calculateurs de travée numériques.",
      shortDesc_en: "Combined CT/VT instrument transformers supplying digital bay controllers.",
      equipmentTargetId: 'pin-sub-trafo',
      energyState_fr: "Acquisition des tensions et courants instantanés",
      energyState_en: "Acquisition of instantaneous voltages and currents",
      voltageRating: "100V / 1A",
      physicalEquation: "S = \\sqrt{3} U I",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 6,
      stageCode: 'CONTROL',
      title_fr: "6. Bâtiment de Commande & SCADA CEI 61850",
      title_en: "6. Control Building & IEC 61850 SCADA",
      shortDesc_fr: "Bus de station CEI 61850 (MMS / GOOSE), automates de travée et contrôle-commande local/distant.",
      shortDesc_en: "IEC 61850 station bus (MMS / GOOSE), bay controllers and local/remote telecontrol.",
      equipmentTargetId: 'pin-sub-control',
      energyState_fr: "Supervision temps réel et téléconduite dispatching",
      energyState_en: "Real-time supervision and dispatching telecontrol",
      voltageRating: "Alimentation auxiliaire 110 Vcc secourue",
      physicalEquation: "t_{GOOSE} < 4\\text{ ms}",
      hotspotBadgeRef: 5
    },
    {
      stepNumber: 7,
      stageCode: 'PROTECT',
      title_fr: "7. Protection Transfo & Jeux de Barres",
      title_en: "7. Transformer & Busbar Protection",
      shortDesc_fr: "Relais numériques ANSI 87T (Diff. Transfo), 87B (Diff. Barres), 63 (Buchholz) et 49 (Thermique).",
      shortDesc_en: "Digital relays ANSI 87T (Trafo Diff), 87B (Bus Diff), 63 (Buchholz gas) and 49 (Thermal image).",
      equipmentTargetId: 'pin-sub-trafo',
      energyState_fr: "Isolement sélectif sans impacter les travées saines",
      energyState_en: "Selective isolation without tripping healthy bays",
      voltageRating: "Déclenchement < 30 ms",
      physicalEquation: "I_{diff} = |I_{225kV} - I_{30kV}^{ramene}|",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 8,
      stageCode: 'EVACUATE',
      title_fr: "8. Rame de Départs HTA 30 kV",
      title_en: "8. 30 kV Medium Voltage Switchboard",
      shortDesc_fr: "Cellules blindées HTA distribuant la puissance vers les réseaux de distribution (D05).",
      shortDesc_en: "Metal-clad MV switchgear cubicles routing power to distribution feeders (D05).",
      equipmentTargetId: 'pin-sub-mv-feeders',
      energyState_fr: "Départs MT 30 kV alimentant les boucles urbaines et rurales",
      energyState_en: "30 kV MV feeders supplying urban and rural loops",
      voltageRating: "30 kV Triphasé",
      physicalEquation: "I_{depart} = \\frac{P_{feeder}}{\\sqrt{3} U \\cos\\varphi}",
      hotspotBadgeRef: 6
    }
  ],

  distribution: [
    {
      stepNumber: 1,
      stageCode: 'SOURCE',
      title_fr: "1. Arrivée Feeder HTA 30 kV / 15 kV",
      title_en: "1. Incoming MV Feeder 30 kV / 15 kV",
      shortDesc_fr: "Câbles souterrains XLPE ou lignes aériennes en provenance du poste source (D04).",
      shortDesc_en: "Underground XLPE cables or overhead conductors coming from primary substation (D04).",
      equipmentTargetId: 'pin-dist-sub',
      energyState_fr: "Moyenne tension HTA 30 kV",
      energyState_en: "30 kV Medium Voltage MV",
      voltageRating: "30 kV / 15 kV",
      physicalEquation: "P_{feeder} = \\sqrt{3} U I \\cos\\varphi",
      hotspotBadgeRef: 1
    },
    {
      stepNumber: 2,
      stageCode: 'CORRIDOR',
      title_fr: "2. Réseau Moyenne Tension & RMU",
      title_en: "2. MV Network & Ring Main Units",
      shortDesc_fr: "Boucle ouverte MT avec tableaux RMU étanches permettant le bouclage et l'isolement de tronçon.",
      shortDesc_en: "Open-ring MV loop with sealed RMU switchgear allowing loop reconfiguration and section isolation.",
      equipmentTargetId: 'pin-dist-lines',
      energyState_fr: "Acheminement HTA dans les quartiers urbains",
      energyState_en: "MV routing throughout urban neighborhoods",
      voltageRating: "24 kV / 36 kV",
      physicalEquation: "I_{boucle} \\le 630\\text{ A}",
      hotspotBadgeRef: 2
    },
    {
      stepNumber: 3,
      stageCode: 'CONVERT',
      title_fr: "3. Transformateur MT/BT 400V",
      title_en: "3. MV/LV Distribution Transformer",
      shortDesc_fr: "Transformateur triphasé Dyn11 (100 à 1000 kVA) abaissant la moyenne tension en 400 V / 230 V.",
      shortDesc_en: "Three-phase Dyn11 transformer (100 to 1000 kVA) stepping down MV to 400 V / 230 V.",
      equipmentTargetId: 'pin-dist-trafo',
      energyState_fr: "Basse tension triphasée + neutre",
      energyState_en: "Three-phase low voltage + neutral",
      voltageRating: "30 kV → 400 V (Dyn11)",
      physicalEquation: "I_{BT} = \\frac{S_{trafo}}{\\sqrt{3} \\cdot 400} \\approx 1.44 \\cdot S_{[kVA]}",
      hotspotBadgeRef: 3
    },
    {
      stepNumber: 4,
      stageCode: 'STEP_UP',
      title_fr: "4. Tableau Général Basse Tension (TGBT)",
      title_en: "4. Main Low Voltage Switchboard (TGBT)",
      shortDesc_fr: "Disjoncteur général ouvert (ACB/DNB) et départs modulaires avec protection magnétothermique.",
      shortDesc_en: "Air circuit breaker (ACB) and outgoing feeder modules with thermal-magnetic protection.",
      equipmentTargetId: 'pin-dist-tgbt',
      energyState_fr: "Distribution Basse Tension sécurisée",
      energyState_en: "Safe Low Voltage power distribution",
      voltageRating: "400 V / 230 V (Isc jusqu'à 50 kA)",
      physicalEquation: "I_{sc\\_BT} = \\frac{S_{trafo}}{\\sqrt{3} \\cdot U_{BT} \\cdot u_{cc}}",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 5,
      stageCode: 'MEASURE',
      title_fr: "5. Comptage Intelligent AMI & Qualité",
      title_en: "5. Smart Metering AMI & Power Quality",
      shortDesc_fr: "Compteurs communicants 3G/GPRS/PLC mesurant l'énergie active kWh, réactive kvarh et le THD.",
      shortDesc_en: "Smart communicative meters measuring active kWh, reactive kvarh, and voltage THD.",
      equipmentTargetId: 'pin-dist-tgbt',
      energyState_fr: "Mesure de consommation certifiée MID / CEI",
      energyState_en: "MID / IEC certified energy consumption metering",
      voltageRating: "Classe 1 ou 0.5S",
      physicalEquation: "E = \\int P(t)\\,dt",
      hotspotBadgeRef: 4
    },
    {
      stepNumber: 6,
      stageCode: 'CONTROL',
      title_fr: "6. Régime de Neutre & Sécurité Usager",
      title_en: "6. Earthing System (TT, TN, IT) & Safety",
      shortDesc_fr: "Configuration du régime de neutre (TT en distribution publique, TN/IT en industrie) et liaison équipotentielle.",
      shortDesc_en: "Earthing arrangement configuration (TT for public grid, TN/IT for industry) and equipotential bonding.",
      equipmentTargetId: 'pin-dist-buildings',
      energyState_fr: "Protection des personnes contre les contacts indirects",
      energyState_en: "Protection against indirect electric shock",
      voltageRating: "Tension limite de sécurité UL = 50 V",
      physicalEquation: "U_{contact} = R_A \\cdot I_{\\Delta n} \\le 50\\text{ V}",
      hotspotBadgeRef: 5
    },
    {
      stepNumber: 7,
      stageCode: 'PROTECT',
      title_fr: "7. Protection Différentielle & Disjoncteurs",
      title_en: "7. Residual Current Devices (RCD) & MCBs",
      shortDesc_fr: "Disjoncteurs divisionnaires et interrupteurs différentiels 30 mA pour la protection des circuits terminaux.",
      shortDesc_en: "Miniature circuit breakers (MCB) and 30 mA residual current devices for branch circuit safety.",
      equipmentTargetId: 'pin-dist-buildings',
      energyState_fr: "Coupure automatique de l'alimentation en < 200 ms",
      energyState_en: "Automatic disconnection of supply within < 200 ms",
      voltageRating: "Sensibilité 30 mA / 300 mA",
      physicalEquation: "I_{diff} = |I_L - I_N| > 30\\text{ mA}",
      hotspotBadgeRef: 5
    },
    {
      stepNumber: 8,
      stageCode: 'EVACUATE',
      title_fr: "8. Utilisation Finale & Charges Électriques",
      title_en: "8. Final Loads & End Utilization",
      shortDesc_fr: "Alimentation des moteurs industriels, climatiseurs, éclairage LED, serveurs et bornes IRVE.",
      shortDesc_en: "Supplying industrial motors, HVAC chillers, LED lighting, data centers, and EV charging points.",
      equipmentTargetId: 'pin-dist-ev',
      energyState_fr: "Conversion en énergie utile : mécanique, thermique, lumineuse",
      energyState_en: "Conversion into useful work: mechanical, thermal, light",
      voltageRating: "400 V Tri / 230 V Mono",
      physicalEquation: "P_{utile} = \\eta \\cdot P_{electrique}",
      hotspotBadgeRef: 6
    }
  ]
};

// -----------------------------------------------------------------------------
// 3. PROGRESSIVE 3-LEVEL EQUIPMENT INTELLIGENCE REGISTRY
// -----------------------------------------------------------------------------
export const PROGRESSIVE_EQUIPMENT_DATA: Record<string, ProgressiveEquipmentData> = {
  // ---------------------------------------------------------------------------
  // GENERATION: HYDROELECTRIC POWER PLANT & ALTERNATOR
  // ---------------------------------------------------------------------------
  'pin-hydro': {
    id: 'pin-hydro',
    badgeNumber: 1,
    engineeringName: {
      fr: "Groupe Turbo-Alternateur Synchrone Triphasé Hydraulique",
      en: "Hydroelectric Three-Phase Synchronous Generator Set"
    },
    commonName: {
      fr: "Centrale Hydroélectrique & Alternateur (Songloulou / Nachtigal)",
      en: "Hydroelectric Powerhouse & Generator (Songloulou / Nachtigal)"
    },
    locationInEcosystem: {
      fr: "Tête de chaîne de production · Salle des machines de la centrale hydroélectrique",
      en: "Head of generation chain · Hydro plant powerhouse generator hall"
    },
    maturityStatus: 'VERIFIED_STANDARDS',
    level1: {
      purposeWhy: {
        fr: "Pourquoi existe-t-il ? Il convertit l'énergie hydraulique naturelle emmagasinée dans le fleuve (la Sanaga) en énergie électrique propre, renouvelable et immédiatement injectable sur le réseau national.",
        en: "Why does it exist? It converts natural potential and kinetic energy stored in river water into clean, renewable, synchronous electrical power ready for national grid injection."
      },
      concreteFunction: {
        fr: "La turbine hydraulique (Francis) transforme la pression de l'eau en couple rotatif mécanique. L'alternateur synchrone solidaire de l'arbre fait tourner son rotor électroaimanté dans le stator pour induire un système de tensions triphasées sinusoïdales à 50 Hz.",
        en: "The Francis turbine turns water pressure into rotating mechanical torque. The synchronous alternator spins its electromagnetic rotor inside the stator to induce a balanced three-phase sinusoidal voltage system at 50 Hz."
      },
      workingPrincipleSimple: {
        fr: "Principe de Faraday : Un champ magnétique tournant (créé par le rotor alimenté en courant continu d'excitation) balaie les enroulements fixes du stator. Cela induit une force électromotrice triphasée proportionnelle à la vitesse de rotation et au flux magnétique.",
        en: "Faraday's Principle: A rotating magnetic field (created by the DC-excited rotor) sweeps across stationary stator winding coils, inducing a 3-phase electromotive force proportional to rotational speed and magnetic flux."
      },
      energyFlow: {
        upstreamInput: {
          fr: "Eau sous pression de la conduite forcée (Pression ~12 bar, Débit Q = 100 m³/s)",
          en: "Pressurized water from penstock (~12 bar static head, Q = 100 m³/s flow rate)"
        },
        equipmentProcessing: {
          fr: "Roue Francis (rendement ~93%) → Arbre mécanique → Alternateur synchrone (rendement ~98%)",
          en: "Francis runner (~93% efficiency) → Drive shaft → Synchronous generator (~98% efficiency)"
        },
        downstreamOutput: {
          fr: "Puissance électrique triphasée 10.5 kV / 60 MW par groupe (cos φ = 0.85 inductif)",
          en: "Three-phase electrical output 10.5 kV / 60 MW per unit (cos φ = 0.85 lagging)"
        }
      },
      electricalRoleSummary: {
        voltage: "10.5 kV - 15.5 kV AC triphasé",
        currentOrPower: "420 MW nominal total (7 x 60 MW)",
        frequency: "50.00 Hz (vitesse synchrone 150 tr/min pour 40 pôles)",
        powerFactorOrEfficiency: "cos φ = 0.85 à 0.90 / Rendement global = 91%",
        insulationOrEnclosure: "Classe d'isolation F (155°C) avec échauffement B (80K)"
      }
    },
    level2: {
      whyParametersMatter: [
        {
          parameter: "Tension Assignée Un (10.5 kV)",
          meaning: {
            fr: "Tension entre phases aux bornes statoriques.",
            en: "Phase-to-phase terminal voltage across stator windings."
          },
          engineeringImpact: {
            fr: "Une tension plus élevée réduit l'intensité du courant statorique (I = P / (√3·U)), ce qui permet de limiter la section des barres de cuivre et les pertes d'échauffement Joule.",
            en: "Higher voltage lowers stator current (I = P / (√3·U)), reducing copper busbar cross-section and heat dissipation."
          }
        },
        {
          parameter: "Rapport de Court-Circuit (SCR / Ik/In)",
          meaning: {
            fr: "Mesure de la robustesse magnétique de la machine.",
            en: "Measurement of machine magnetic stiffness and airgap geometry."
          },
          engineeringImpact: {
            fr: "Un SCR élevé (> 1.0) garantit une grande stabilité en cas de creux de tension sur le réseau transport et permet d'absorber davantage de puissance réactive sans décrochage.",
            en: "High SCR (> 1.0) ensures dynamic stability during transmission line voltage dips and enhances reactive absorption capacity without pole slipping."
          }
        },
        {
          parameter: "Facteur d'Inertie H (secondes)",
          meaning: {
            fr: "Énergie cinétique stockée dans les masses tournantes rotor/turbine.",
            en: "Kinetic energy stored within rotating rotor and turbine masses."
          },
          engineeringImpact: {
            fr: "Crucial pour la stabilité de fréquence du réseau : plus H est grand (H > 3.5 s), plus le réseau résiste au décrochage brutal de fréquence (ROCOF) lors du déclenchement d'une ligne.",
            en: "Critical for network frequency inertia: higher H (H > 3.5 s) slows Rate of Change of Frequency (ROCOF) during sudden load imbalance or tripping."
          }
        }
      ],
      engineeringParameters: [
        { symbol: "Sn", name: { fr: "Puissance Apparente Nominale", en: "Rated Apparent Power" }, typicalValue: "70.6 MVA", unit: "MVA", status: "VERIFIED" },
        { symbol: "Un", name: { fr: "Tension Nominale Statorique", en: "Rated Stator Voltage" }, typicalValue: "10.5 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "In", name: { fr: "Courant Nominal Statorique", en: "Rated Stator Current" }, typicalValue: "3880 A", unit: "A", status: "VERIFIED" },
        { symbol: "fn", name: { fr: "Fréquence Nominale", en: "Rated Frequency" }, typicalValue: "50.00", unit: "Hz", status: "VERIFIED" },
        { symbol: "cos φ", name: { fr: "Facteur de Puissance Nominal", en: "Rated Power Factor" }, typicalValue: "0.85 inductif", unit: "-", status: "VERIFIED" },
        { symbol: "Xd", name: { fr: "Réactance Synchrone Longitudinale", en: "Synchronous Reactance" }, typicalValue: "115 %", unit: "%", status: "VERIFIED" },
        { symbol: "X''d", name: { fr: "Réactance Subtransitoire", en: "Subtransient Reactance" }, typicalValue: "18.5 %", unit: "%", status: "VERIFIED" }
      ],
      relationships: {
        upstreamFeeder: {
          fr: "Vanne de tête et conduite forcée hydraulique / Système d'excitation statique rotor 350 Vcc",
          en: "Intake gate and penstock water feed / Static excitation system 350 Vdc"
        },
        downstreamFed: {
          fr: "Gaine à barres blindées 10.5 kV reliant directement les bornes au transformateur élévateur GSU",
          en: "Isolated phase bus (IPB) 10.5 kV routing directly to Generator Step-Up (GSU) transformer"
        },
        protectionChain: {
          ansiCodes: ["87G (Différentielle)", "50/51 (Surintensité)", "59N (MALT stator)", "40 (Perte d'excitation)", "24 (Volts/Hz)", "32R (Retour de puissance)"],
          relayTypes: { fr: "Relais numérique de protection de groupe multifonction", en: "Digital numerical generator management relay" },
          operatingTime: "< 35 ms pour défauts différentiels internes"
        },
        controlSystem: {
          architecture: { fr: "Régulateur de vitesse hydro (Governor) + Automate de tranche DCS + Régulateur de tension AVR", en: "Governor speed controller + DCS unit PLC + Digital Automatic Voltage Regulator (AVR)" },
          communicationProtocol: "IEC 61850 (MMS / GOOSE) & Modbus TCP"
        },
        meteringSystem: {
          sensors: { fr: "3 Transformateurs de courant tore 4000/1A classe 0.2S + 3 Transformateurs de tension 10500/√3 / 100/√3 V classe 0.2", en: "3x CT 4000/1A class 0.2S + 3x VT 10.5kV/√3 / 100/√3 V class 0.2" },
          accuracyClass: "Classe 0.2S transactionnel"
        },
        earthingSystem: {
          fr: "Neutre statorique relié à la terre via transformateur de distribution monophasé chargé par résistance (MALT à haute impédance limitant le courant de défaut monophasé à 10 A)",
          en: "Stator neutral grounded via distribution transformer with secondary loading resistor (high-resistance grounding limiting ground fault current to < 10 A)"
        },
        auxiliarySupplies: {
          fr: "Centrale d'huile sous pression (lubrification paliers et régulation vanne), circuit de réfrigération eau brute, alimentation secourue 110 Vcc",
          en: "High-pressure oil skid (bearing lubrication & governor servos), cooling water heat exchangers, 110 Vdc battery backup"
        }
      },
      operatingStates: [
        { state: "OFF", label: { fr: "À l'Arrêt Complet", en: "Complete Shutdown" }, condition: { fr: "Vanne papillon fermée, freins mécaniques serrés, alternateur déconnecté", en: "Main inlet valve closed, mechanical brakes set, breaker open" } },
        { state: "STARTING", label: { fr: "Démarrage & Montée en Vitesse", en: "Run-Up Sequence" }, condition: { fr: "Ouverture des directrices, accélération de 0 à 150 tr/min, contrôle des paliers", en: "Guide vanes opening, acceleration from 0 to 150 rpm, bearing temp check" } },
        { state: "ENERGIZED", label: { fr: "Excité à Vide (50 Hz / 10.5 kV)", en: "Excited at No-Load" }, condition: { fr: "Enclenchement de l'excitation AVR, tension statorique stabilisée, synchronoscope actif", en: "AVR enabled, terminal voltage stabilized at 10.5 kV, ready for synchronizer" } },
        { state: "NORMAL", label: { fr: "Couplé au Réseau en Charge", en: "Synchronized on Grid" }, condition: { fr: "Disjoncteur fermé, groupe régulant P (MW) selon consigne et Q (Mvar) en tension", en: "Breaker closed, unit dispatching active MW and regulating grid voltage" } },
        { state: "ABNORMAL", label: { fr: "Condition Anormale / Surcharge", en: "Abnormal Operating State" }, condition: { fr: "Température enroulement > 120°C, déséquilibre phases ou oscillation de puissance", en: "Stator temp > 120°C, negative sequence current, or power swinging" } },
        { state: "TRIPPED", label: { fr: "Déclenché d'Urgence", en: "Emergency Tripped" }, condition: { fr: "Ouverture instantanée disjoncteur + désexcitation rapide + fermeture vannage", en: "Instant breaker opening + rapid de-excitation + emergency gate closure" } },
        { state: "MAINTENANCE", label: { fr: "Consigné pour Entretien", en: "Locked Out for Overhaul" }, condition: { fr: "Vanne cadenassée LOTO, rotor calé, barres stator mises à la terre", en: "LOTO applied, turbine rotor locked, stator terminals earthed" } },
        { state: "RESTORATION", label: { fr: "Contrôle Post-Défaut", en: "Post-Fault Restoration" }, condition: { fr: "Test d'isolement diélectrique, analyse DGA huile, acquittement relais", en: "Megger insulation test, oil DGA check, protection relay reset" } }
      ],
      failureSequence: {
        normalState: {
          fr: "Fonctionnement nominal : 60 MW injectés à 10.5 kV, température stator 85°C, vibrations normales < 2.5 mm/s.",
          en: "Nominal operation: 60 MW injected at 10.5 kV, stator core temp 85°C, vibration < 2.5 mm/s."
        },
        abnormalCondition: {
          fr: "Dégradation d'isolant d'encoche provoquant un court-circuit interne phase-terre dans le stator.",
          en: "Stator slot insulation degradation causing internal phase-to-ground flashover."
        },
        detectionMethod: {
          fr: "Le relais numérique 59N détecte la montée de tension homopolaire aux bornes de la résistance de neutre, tandis que le relais 87G mesure une différence vectorielle |I_amont - I_aval| > 0.1 In.",
          en: "Relay 59N detects neutral displacement voltage while 87G differential relay calculates vector mismatch |I_in - I_out| > 0.1 In."
        },
        protectiveAction: {
          fr: "Ordre de déclenchement ultra-rapide envoyé en 25 ms au disjoncteur de groupe, combiné à l'ouverture du disjoncteur d'excitation (décharge dans résistance d'extinction de champ).",
          en: "Trip signal emitted within 25 ms to generator circuit breaker, paired with field breaker trip into de-excitation discharge resistor."
        },
        isolationAndAlarms: {
          fr: "Isolement électrique total de la machine, fermeture d'urgence des directrices de turbine pour éviter l'emballement, envoi des alarmes horodatées vers le SCADA national.",
          en: "Total machine isolation, fast governor wicket gate closure preventing runaway speed, SOE alarm dispatch to national dispatching."
        },
        restorationProcedure: {
          fr: "Contrôle visuel par endoscope de l'encoche statorique, mesure de décharges partielles, test de résistance d'isolement (Megger 5 kV), autorisation d'intervention rédigée.",
          en: "Borescope visual inspection of stator core, partial discharge measurement, 5 kV DC insulation resistance check, and safety permit sign-off."
        }
      }
    },
    level3: {
      verifiedStandards: [
        {
          organization: "IEC",
          standardNumber: "IEC 60034-1",
          title: "Rotating electrical machines - Part 1: Rating and performance",
          scope: { fr: "Spécifie les caractéristiques assignées, échauffements thermiques et rendements des alternateurs synchrones.", en: "Specifies ratings, temperature rise limits, and operational performances for synchronous machines." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 60034-3",
          title: "Specific requirements for synchronous generators driven by steam turbines or combustion gas turbines and for hydro generators",
          scope: { fr: "Exigences particulières pour turbo-alternateurs et alternateurs hydrauliques (vitesse d'emballement, rigidité rotorique).", en: "Specific requirements for hydro and thermal generators (runaway speed withstand, structural design)." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEEE",
          standardNumber: "IEEE C37.102",
          title: "Guide for AC Generator Protection",
          scope: { fr: "Philosophie de réglage des protections différentielles 87G, perte d'excitation 40 et protection de masse stator 59N.", en: "Philosophy and settings criteria for 87G differential, 40 loss-of-field, and 59N ground protections." },
          normativeStatus: "ADVISORY"
        },
        {
          organization: "NATIONAL_GRID_CODE",
          standardNumber: "Code Réseau Transport Cameroun (SONATREL)",
          title: "Conditions techniques de raccordement des groupes de production au réseau 225 kV",
          scope: { fr: "Exigences d'aptitude au réglage primaire de fréquence (faisceau ±200 mHz) et tenue aux creux de tension (LVRT).", en: "Grid code requirements for primary frequency regulation (droop control) and Low Voltage Ride Through (LVRT)." },
          normativeStatus: "REGULATORY"
        }
      ],
      engineeringDocumentation: [
        { documentType: { fr: "Schéma Unifilaire Général (SLD)", en: "Single-Line Diagram (SLD)" }, deliverableName: "SLD-GEN-HYD-001-REV-C", status: "AVAILABLE", standardRef: "IEC 61082-1" },
        { documentType: { fr: "Schéma de Protection & Mesure (AC/DC)", en: "Protection & Metering Schematics" }, deliverableName: "SCH-PROT-87G-59N-002", status: "AVAILABLE", standardRef: "IEC 60617" },
        { documentType: { fr: "Carnet de Réglages de Protection", en: "Protection Coordination Settings Sheet" }, deliverableName: "CALC-COORD-GEN-PROT-REV2", status: "AVAILABLE", standardRef: "IEEE C37.102" },
        { documentType: { fr: "Rapport d'Essais en Usine (FAT)", en: "Factory Acceptance Test (FAT) Report" }, deliverableName: "FAT-REP-HYDRO-GEN-SN01", status: "AVAILABLE", standardRef: "IEC 60034-1" },
        { documentType: { fr: "Procédure de Mise en Service sur Site (SAT)", en: "Site Commissioning Procedure (SAT)" }, deliverableName: "SAT-PROC-COMM-HYD-04", status: "NOT_YET_ATTACHED" },
        { documentType: { fr: "Manuel d'Exploitation & Maintenance", en: "Operation & Maintenance Manual" }, deliverableName: "O&M-MANUAL-GEN-TURBO-V1", status: "AVAILABLE" }
      ],
      safetyLayer: {
        primaryHazards: [
          { fr: "Haute tension 10.5 kV (risque d'électrocution mortelle et claquage diélectrique)", en: "10.5 kV medium voltage (fatal electrocution hazard and dielectric breakdown)" },
          { fr: "Énergie cinétique des masses tournantes de plusieurs centaines de tonnes (150 tr/min)", en: "Massive rotating kinetic energy (hundreds of tons spinning at 150 rpm)" },
          { fr: "Pression hydraulique colossale en conduite forcée (12 bar / onde de coup de bélier)", en: "Colossal penstock hydraulic pressure (12 bar head / water hammer risk)" },
          { fr: "Arc électrique (Arc flash) d'énergie incidente > 25 cal/cm² sur jeu de barres non protégé", en: "Arc flash incident energy > 25 cal/cm² on unprotected generator switchgear bus" }
        ],
        arcFlashBoundary: "4.2 mètres autour des traversées statoriques non capotées",
        isolationLOTO: {
          fr: "Consignation LOTO stricte : Fermeture et cadenassage mécanique de la vanne de tête, débrochage du disjoncteur de groupe, déconnexion de l'armoire d'excitation rotor, mise en place des terres transportables.",
          en: "Strict LOTO procedure: Mechanical padlock on penstock inlet valve, generator breaker racked out, rotor excitation cubicle isolated, portable grounding clusters applied to all 3 phases."
        },
        earthingMALT: {
          fr: "Vérification d'absence de tension (VAT) avec perche homologuée 24 kV puis pose d'un équipement de mise à la terre et en court-circuit (MALT/CC) dimensionné pour 40 kA / 1s.",
          en: "Voltage absence verification with certified 24 kV live tester, followed by installation of 40 kA / 1s rated short-circuiting earthing cluster."
        },
        requiredPPE: [
          { fr: "Combinaison de protection Arc Flash catégorie 4 (40 cal/cm²)", en: "Arc Flash Category 4 protective suit (40 cal/cm²)" },
          { fr: "Casque isolant avec visière anti-arc et cagoule ignifugée", en: "Dielectric safety helmet with anti-arc face shield and balaclava" },
          { fr: "Gants isolants classe 2 (17 000 V) avec surgants cuir de protection mécanique", en: "Class 2 dielectric gloves (17 kV rating) with protective leather overgloves" },
          { fr: "Chaussures de sécurité diélectriques 20 kV sans parties métalliques traversantes", en: "Dielectric safety boots (20 kV withstand) without through-metal parts" }
        ]
      },
      crossDomainLinks: [
        { domainCode: "D03", domainName: { fr: "Réseau de Transport", en: "Transmission Networks" }, relationshipContext: { fr: "Évacuation de la puissance vers les lignes 225 kV", en: "Bulk power evacuation onto 225 kV lines" } },
        { domainCode: "D08", domainName: { fr: "Protection & Sélectivité", en: "Protection & Selectivity" }, relationshipContext: { fr: "Coordination des déclenchements ANSI 87G / 87T avec le réseau", en: "Coordination of ANSI 87G / 87T trips with transmission line relays" } },
        { domainCode: "D14", domainName: { fr: "Gestion d'Actifs & Maintenance", en: "Asset Management & Maintenance" }, relationshipContext: { fr: "Suivi vibratoire en ligne, analyse DGA de l'huile et thermographie", en: "Online vibration monitoring, oil DGA analysis, and infrared thermography" } },
        { domainCode: "D10", domainName: { fr: "Études de Réseau & Stabilité", en: "Power System Studies & Stability" }, relationshipContext: { fr: "Modélisation PSS/E de la machine synchrone pour études transitoires", en: "PSS/E synchronous generator modeling for transient stability studies" } }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // GENERATION / TRANSMISSION: GENERATOR STEP-UP TRANSFORMER (GSU)
  // ---------------------------------------------------------------------------
  'pin-gsu': {
    id: 'pin-gsu',
    badgeNumber: 2,
    engineeringName: {
      fr: "Transformateur Élévateur Principal de Centrale (GSU)",
      en: "Generator Step-Up (GSU) Power Transformer"
    },
    commonName: {
      fr: "Transformateur Élévateur 10.5 kV / 225 kV",
      en: "Step-Up Transformer 10.5 kV / 225 kV"
    },
    locationInEcosystem: {
      fr: "Poste d'évacuation extérieur de centrale, interface direct alternateur / réseau 225 kV",
      en: "Outdoor generator switchyard, direct interface between generator and 225 kV grid"
    },
    maturityStatus: 'VERIFIED_STANDARDS',
    level1: {
      purposeWhy: {
        fr: "Pourquoi existe-t-il ? Si l'on transportait 420 MW sous 10.5 kV, le courant serait de 23 000 Ampères, ce qui ferait fondre les câbles et entraînerait des pertes catastrophiques. Le GSU élève la tension à 225 kV, divisant le courant par 21 (à peine 1080 A).",
        en: "Why does it exist? Transmitting 420 MW at 10.5 kV would require 23,000 Amps, melting transmission lines through extreme heat. The GSU steps voltage up to 225 kV, dividing current by 21 (down to just 1080 A)."
      },
      concreteFunction: {
        fr: "Il transfère la puissance électrique d'un circuit moyenne tension (10.5 kV) vers un circuit haute tension (225 kV) par couplage magnétique, sans modifier la fréquence (50 Hz).",
        en: "It transfers electrical power from medium voltage (10.5 kV) to high voltage (225 kV) through electromagnetic mutual induction without altering frequency (50 Hz)."
      },
      workingPrincipleSimple: {
        fr: "Loi de l'induction mutuelle : Le courant primaire crée un flux magnétique alternatif dans le noyau d'acier feuilleté. Ce flux traverse l'enroulement secondaire composé d'un nombre de spires 21 fois supérieur, induisant une tension 21 fois plus élevée.",
        en: "Mutual Induction Law: Primary AC current creates alternating magnetic flux inside laminated silicon-steel core. This flux links the secondary winding with 21 times more turns, inducing a voltage 21 times higher."
      },
      energyFlow: {
        upstreamInput: {
          fr: "Puissance brute de l'alternateur sous 10.5 kV (courant fort ~3880 A)",
          en: "Raw generator output at 10.5 kV (heavy current ~3880 A)"
        },
        equipmentProcessing: {
          fr: "Circuit magnétique immergé dans l'huile minérale diélectrique (rendement > 99.4%)",
          en: "Magnetic core immersed in dielectric mineral oil (> 99.4% efficiency)"
        },
        downstreamOutput: {
          fr: "Puissance haute tension 225 kV (courant réduit ~180 A par phase vers le réseau)",
          en: "High voltage 225 kV power (current reduced to ~180 A per phase towards transmission)"
        }
      },
      electricalRoleSummary: {
        voltage: "10.5 kV (BT) / 225 kV (HTB)",
        currentOrPower: "70 MVA par unité (ONAF)",
        frequency: "50 Hz",
        powerFactorOrEfficiency: "Rendement d'ingénierie = 99.5% à pleine charge",
        insulationOrEnclosure: "Cuve métallique étanche IP65 avec huile minérale naphténique (CEI 60296)"
      }
    },
    level2: {
      whyParametersMatter: [
        {
          parameter: "Tension de Court-Circuit ucc / Uk (12.5%)",
          meaning: {
            fr: "Impédance interne ramenée en pourcentage de la tension nominale.",
            en: "Internal winding impedance expressed as percentage of rated voltage."
          },
          engineeringImpact: {
            fr: "Cruciale pour limiter le courant de court-circuit aval (Isc = In / ucc). Une valeur de 12.5% protège les disjoncteurs 225 kV tout en maintenant une bonne régulation de tension.",
            en: "Crucial for limiting downstream fault current (Isc = In / ucc). A 12.5% impedance protects 225 kV breakers while maintaining reasonable voltage regulation."
          }
        },
        {
          parameter: "Mode de Refroidissement (ONAN / ONAF)",
          meaning: {
            fr: "Circulation naturelle ou forcée de l'huile et de l'air sur les radiateurs.",
            en: "Oil Natural Air Natural / Oil Natural Air Forced radiator cooling stages."
          },
          engineeringImpact: {
            fr: "Permet au transformateur de fournir 55 MVA sans ventilateurs (silencieux), et de monter à 70 MVA lorsque les aéroréfrigérants démarrent en période de forte charge.",
            en: "Allows transformer to supply 55 MVA silently without fans, boosting capacity to 70 MVA once cooling fans activate during peak load."
          }
        }
      ],
      engineeringParameters: [
        { symbol: "Sn", name: { fr: "Puissance Nominale", en: "Rated Power" }, typicalValue: "70 MVA ONAF", unit: "MVA", status: "VERIFIED" },
        { symbol: "U1", name: { fr: "Tension Primaire Assignée", en: "Primary Rated Voltage" }, typicalValue: "10.5 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "U2", name: { fr: "Tension Secondaire Assignée", en: "Secondary Rated Voltage" }, typicalValue: "225 kV ± 2 x 2.5%", unit: "kV", status: "VERIFIED" },
        { symbol: "ucc", name: { fr: "Tension de Court-Circuit", en: "Impedance Voltage" }, typicalValue: "12.5 %", unit: "%", status: "VERIFIED" },
        { symbol: "Couplage", name: { fr: "Groupe Vectoriel", en: "Vector Group" }, typicalValue: "YNd11 (Étoile neutre sorti HT / Triangle BT)", unit: "-", status: "VERIFIED" },
        { symbol: "P0", name: { fr: "Pertes à Vide (Fer)", en: "No-Load Core Losses" }, typicalValue: "38 kW", unit: "kW", status: "VERIFIED" },
        { symbol: "Pk", name: { fr: "Pertes en Charge (Cuivre)", en: "Load Copper Losses" }, typicalValue: "245 kW", unit: "kW", status: "VERIFIED" }
      ],
      relationships: {
        upstreamFeeder: {
          fr: "Barres de sortie alternateur 10.5 kV protégées par sectionneur de tranche",
          en: "10.5 kV generator isolated phase busbars fed from generator terminals"
        },
        downstreamFed: {
          fr: "Travée de départ 225 kV vers le jeu de barres d'évacuation de la centrale",
          en: "225 kV outgoing switchyard bay connected to main high voltage transmission bus"
        },
        protectionChain: {
          ansiCodes: ["87T (Diff. Transfo)", "63 (Relais Buchholz)", "49 (Image thermique)", "50G/51G (Terre restreinte REF)", "64R (MALT cuve)"],
          relayTypes: { fr: "Relais de protection différentielle numérique de transformateur", en: "Numerical transformer differential management relay" },
          operatingTime: "< 25 ms pour défauts différentiels internes / < 100 ms pour gaz Buchholz"
        },
        controlSystem: {
          architecture: { fr: "Contrôleur de température d'huile (OTI/WTI) + Régulateur de changeur de prises sous charge (OLTC)", en: "Oil and winding temperature indicators + Automatic tap changer controller" },
          communicationProtocol: "IEC 61850 GOOSE vers disjoncteurs & SCADA"
        },
        meteringSystem: {
          sensors: { fr: "TC tore intégrés aux traversées 225 kV (classe 5P20 pour protection, 0.2S pour comptage)", en: "Bushing current transformers (5P20 for protection, 0.2S for metering)" },
          accuracyClass: "Classe 0.2S comptage / Classe 5P20 protection"
        },
        earthingSystem: {
          fr: "Neutre 225 kV directement mis à la terre (régime neutre à la terre du réseau de transport national)",
          en: "225 kV neutral solidly grounded (solid grounding policy of national 225 kV grid)"
        },
        auxiliarySupplies: {
          fr: "Alimentation 400V triphasée pour les moteurs de ventilateurs et de pompes, 110 Vcc pour le déclenchement",
          en: "400V 3-phase supply for fan/pump motors, 110 Vdc battery bank for trip coils"
        }
      },
      operatingStates: [
        { state: "OFF", label: { fr: "Hors Tension & Déconnecté", en: "De-Energized & Isolated" }, condition: { fr: "Sectionneurs ouverts des deux côtés, mise à la terre appliquée", en: "Disconnectors open on both sides, grounding applied" } },
        { state: "ENERGIZED", label: { fr: "Sous Tension à Vide", en: "Energized at No-Load" }, condition: { fr: "Enclenchement côté 225 kV ou 10.5 kV, courant d'appel d'enclenchement (Inrush) amorti", en: "Energized from grid side, magnetizing inrush current stabilized" } },
        { state: "NORMAL", label: { fr: "En Charge Nominale", en: "On-Load Operation" }, condition: { fr: "Transit continu de 60 MW, température point chaud surveillée < 98°C", en: "Continuous 60 MW transit, hotspot temperature monitored < 98°C" } },
        { state: "ABNORMAL", label: { fr: "Surcharge / Alarme Gaz", en: "Abnormal / Gas Alarm" }, condition: { fr: "Accumulation de gaz lente au Buchholz ou température huile > 85°C", en: "Slow gas accumulation in Buchholz or top oil temp > 85°C" } },
        { state: "TRIPPED", label: { fr: "Déclenché par Protection", en: "Tripped by Protective Relay" }, condition: { fr: "Déclenchement Buchholz déclic (coup d'arc) ou différentielle 87T", en: "Buchholz trip (pressure surge) or 87T internal differential trip" } },
        { state: "MAINTENANCE", label: { fr: "Vidange / Traitement d'Huile", en: "Oil Processing / Maintenance" }, condition: { fr: "Filtration, dégazage de l'huile diélectrique et mesure de rigidité", en: "Vacuum dehydration, oil degassing, and dielectric breakdown testing" } },
        { state: "RESTORATION", label: { fr: "Contrôle Post-Incident", en: "Post-Fault Restoration" }, condition: { fr: "Analyse DGA chromatographie en phase gazeuse, mesure de furanne", en: "Dissolved Gas Analysis (DGA) chromatography, furan analysis" } }
      ],
      failureSequence: {
        normalState: {
          fr: "Fonctionnement continu à 60 MVA, rigidité diélectrique de l'huile > 60 kV/2.5mm, teneur en eau < 15 ppm.",
          en: "Continuous operation at 60 MVA, oil dielectric strength > 60 kV/2.5mm, moisture content < 15 ppm."
        },
        abnormalCondition: {
          fr: "Décharge interne entre spires secondaires 225 kV générant un arc électrique sous huile et vaporisation instantanée d'huile.",
          en: "Inter-turn insulation breakdown in 225 kV winding causing submerged electric arc and rapid oil vaporization."
        },
        detectionMethod: {
          fr: "Le relais Buchholz détecte le violent mouvement d'onde d'huile vers le conservateur (clapet de déclic) en 40 ms ; le relais 87T mesure un déséquilibre différentiel de courant immédiat.",
          en: "Buchholz surge flap detects violent oil displacement towards conservator within 40 ms; 87T detects immediate current differential."
        },
        protectiveAction: {
          fr: "Ouverture simultanée du disjoncteur 10.5 kV alternateur et du disjoncteur 225 kV de départ (déclenchement bilatéral).",
          en: "Simultaneous trip command to both 10.5 kV generator breaker and 225 kV line breaker (bilateral trip)."
        },
        isolationAndAlarms: {
          fr: "Isolement total de la cuve, déclenchement du clapet coupe-feu du bac de rétention et alerte SCADA de niveau 1.",
          en: "Total unit isolation, fire retention pit shutter activation, and Priority 1 SCADA dispatch alarm."
        },
        restorationProcedure: {
          fr: "Prélèvement d'huile pour analyse des gaz dissous (DGA Duval Triangle), mesure du rapport de transformation (TTR) et analyse de réponse en fréquence (SFRA).",
          en: "Oil sampling for Dissolved Gas Analysis (Duval Triangle), Transformer Turns Ratio (TTR) test, and Sweep Frequency Response Analysis (SFRA)."
        }
      }
    },
    level3: {
      verifiedStandards: [
        {
          organization: "IEC",
          standardNumber: "IEC 60076-1",
          title: "Power transformers - Part 1: General",
          scope: { fr: "Spécifie les tolérances sur les pertes, les échauffements et les impédances de court-circuit.", en: "Defines tolerances on losses, temperature rises, and short-circuit impedances." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 60076-3",
          title: "Power transformers - Part 3: Insulation levels, dielectric tests and external clearances in air",
          scope: { fr: "Définit les niveaux d'isolement assignés (BIL 1050 kV pour réseau 225 kV) et les essais de choc de foudre.", en: "Specifies insulation levels (BIL 1050 kV for 225 kV systems) and lightning impulse test protocols." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEEE",
          standardNumber: "IEEE C57.12.00",
          title: "General Requirements for Liquid-Immersed Distribution, Power, and Regulating Transformers",
          scope: { fr: "Exigences de conception mécanique pour la tenue aux efforts électrodynamiques de court-circuit.", en: "Standard mechanical withstand requirements against electrodynamic short-circuit forces." },
          normativeStatus: "ADVISORY"
        },
        {
          organization: "CIGRE",
          standardNumber: "CIGRE TB 445",
          title: "Guide for Transformer Fire Safety Practices",
          scope: { fr: "Recommandations sur les murs pare-feu, bacs de rétention d'huile et systèmes d'extinction déluge eau/émulseur.", en: "Guidelines on transformer firewall design, oil containment basins, and deluge water spray systems." },
          normativeStatus: "ADVISORY"
        }
      ],
      engineeringDocumentation: [
        { documentType: { fr: "Plan d'Ensemble & Vue en Coupe", en: "General Arrangement & Cutaway Drawing" }, deliverableName: "DWG-GSU-GA-225KV-REV2", status: "AVAILABLE", standardRef: "IEC 60076" },
        { documentType: { fr: "Fiche Technique Constructeur (Datasheet)", en: "Equipment Technical Datasheet" }, deliverableName: "DS-TRAFO-GSU-70MVA-225KV", status: "AVAILABLE", standardRef: "IEC 60076-1" },
        { documentType: { fr: "Certificat d'Essais Diélectriques Usine", en: "Factory Routine Test Certificate" }, deliverableName: "CERT-FAT-DIEL-GSU-01", status: "AVAILABLE", standardRef: "IEC 60076-3" },
        { documentType: { fr: "Schéma de Câblage Armoire Régulation OLTC", en: "OLTC Control Cabinet Wiring Schematic" }, deliverableName: "SCH-WIR-OLTC-GSU-003", status: "AVAILABLE" },
        { documentType: { fr: "Rapport d'Analyse SFRA Référence Usine", en: "Baseline Sweep Frequency Response (SFRA)" }, deliverableName: "REP-SFRA-BASELINE-GSU", status: "AVAILABLE", standardRef: "IEC 60076-18" }
      ],
      safetyLayer: {
        primaryHazards: [
          { fr: "Haute tension mortelle 225 kV (distance minimale d'approche = 2.0 mètres)", en: "Lethal 225 kV high voltage (minimum approach distance = 2.0 meters)" },
          { fr: "Risque majeur d'incendie d'huile diélectrique en cas d'explosion de cuve (> 30 000 litres d'huile)", en: "Major mineral oil pool fire hazard in case of tank rupture (> 30,000 liters of combustible oil)" },
          { fr: "Énergie emmagasinée capacitive dans les traversées condensateur après coupure", en: "Stored capacitive energy in condenser bushings following circuit de-energization" }
        ],
        arcFlashBoundary: "5.5 mètres autour des bornes 225 kV non isolées",
        isolationLOTO: {
          fr: "Consignation LOTO double face : Débrochage physique des disjoncteurs amont (10.5 kV) et aval (225 kV), vérification d'absence de tension, fermeture des sectionneurs de terre et mise à la terre de la cuve.",
          en: "Two-ended LOTO lockout: Physical racking out of 10.5 kV and 225 kV breakers, voltage absence test, closure of earth switches, and tank safety earthing."
        },
        earthingMALT: {
          fr: "Vérification au détecteur de tension capacitif 225 kV, puis pose de perches de MALT sur les trois phases HT et BT.",
          en: "Verification with 225 kV capacitive voltage detector, followed by installation of earthing clusters on all HV and LV phases."
        },
        requiredPPE: [
          { fr: "Équipement complet Arc Flash catégorie 4 (40 cal/cm²)", en: "Complete Category 4 Arc Flash suit (40 cal/cm²)" },
          { fr: "Harnais de sécurité antichute pour intervention en haut de cuve", en: "Fall arrest safety harness for work on top of transformer tank" },
          { fr: "Gants isolants haute tension et écran facial polycarbonate", en: "High voltage insulating gloves and polycarbonate face shield" }
        ]
      },
      crossDomainLinks: [
        { domainCode: "D01", domainName: { fr: "Production d'Énergie", en: "Energy Production" }, relationshipContext: { fr: "Raccordé directement à la sortie de l'alternateur", en: "Directly coupled to generator terminal bus" } },
        { domainCode: "D03", domainName: { fr: "Réseau de Transport", en: "Transmission Networks" }, relationshipContext: { fr: "Injecte la puissance sur la ligne 225 kV", en: "Injects step-up power onto 225 kV line" } },
        { domainCode: "D04", domainName: { fr: "Postes Électriques", en: "Substations" }, relationshipContext: { fr: "Partage la même technologie que les autotransformateurs de poste", en: "Shares core technology with substation autotransformers" } },
        { domainCode: "D14", domainName: { fr: "Gestion d'Actifs", en: "Asset Management" }, relationshipContext: { fr: "Suivi du vieillissement de l'isolation papier par DGA Duval", en: "Solid paper insulation aging tracking via DGA Duval Triangle" } }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // TRANSMISSION: 225 KV LATTICE STEEL TOWER & BUNDLED CONDUCTORS
  // ---------------------------------------------------------------------------
  'pin-tower-main': {
    id: 'pin-tower-main',
    badgeNumber: 4,
    engineeringName: {
      fr: "Pylône Métallique en Treillis 225 kV & Faisceau de Conducteurs",
      en: "225 kV Lattice Steel Transmission Tower & Conductor Bundle"
    },
    commonName: {
      fr: "Pylône Haute Tension 225 kV (Corridor Songloulou - Bekoko)",
      en: "225 kV Transmission Pylon (Songloulou - Bekoko Corridor)"
    },
    locationInEcosystem: {
      fr: "Corridor de transport aérien longue distance (emprise de ligne 40 m)",
      en: "Long-distance aerial transmission right-of-way corridor (40 m corridor width)"
    },
    maturityStatus: 'VERIFIED_STANDARDS',
    level1: {
      purposeWhy: {
        fr: "Pourquoi existe-t-il ? Il maintient les conducteurs sous 225 000 Volts à une distance sécuritaire du sol, de la végétation et des habitations, évitant tout amorçage d'arc électrique dans l'air tout en résistant aux vents violents et aux orages tropicaux.",
        en: "Why does it exist? It suspends 225,000 Volt conductors safely away from ground, trees, and public roads, preventing air flashovers while withstanding hurricane winds and equatorial lightning storms."
      },
      concreteFunction: {
        fr: "La structure mécanique en treillis d'acier galvanisé supporte les efforts de traction des câbles (plusieurs dizaines de tonnes), les chaînes d'isolateurs en verre trempé assurent l'isolation diélectrique, et les câbles d'Almélec transportent le courant.",
        en: "The galvanized steel lattice structure withstands heavy mechanical conductor tension (tens of tons), toughened glass insulator strings provide dielectric isolation, and aluminum-alloy conductors transmit bulk current."
      },
      workingPrincipleSimple: {
        fr: "L'air est un isolant naturel : en suspendant les conducteurs à plus de 8.5 mètres du sol et en les espaçant de plus de 4.5 mètres les uns des autres, l'air ambiant empêche l'électricité de s'échapper, tandis que les isolateurs en verre bloquent le passage du courant vers la structure métallique mise à la terre.",
        en: "Air is a natural insulator: by keeping conductors suspended > 8.5 meters above ground and > 4.5 meters apart, ambient air prevents dielectric breakdown, while glass insulators prevent current leaking into the grounded steel frame."
      },
      energyFlow: {
        upstreamInput: {
          fr: "Courant triphasé 225 kV en provenance de la travée de départ du poste élévateur",
          en: "225 kV three-phase current coming from sending-end substation bay"
        },
        equipmentProcessing: {
          fr: "Acheminement aérien sans perte magnétique, pertes Joule réduites (< 2.5% sur 100 km)",
          en: "Aerial transmission without magnetic hysteresis, low Joule dissipation (< 2.5% per 100 km)"
        },
        downstreamOutput: {
          fr: "Courant haute tension injecté dans le poste source d'arrivée régional",
          en: "High voltage current delivered into regional receiving-end substation"
        }
      },
      electricalRoleSummary: {
        voltage: "225 kV nominal (Tension maximale d'exploitation : 245 kV)",
        currentOrPower: "Capacité de transit thermique : 420 MVA par terne (1080 A)",
        frequency: "50 Hz",
        powerFactorOrEfficiency: "Rendement de ligne > 97.5% sur 150 km",
        insulationOrEnclosure: "Isolateurs en verre trempé (ligne de fuite spécifique 25 mm/kV)"
      }
    },
    level2: {
      whyParametersMatter: [
        {
          parameter: "Garde au Sol Réglementaire (> 8.5 m à 75°C)",
          meaning: {
            fr: "Distance verticale minimale entre le point le plus bas du conducteur (flèche maximale) et le sol.",
            en: "Minimum vertical clearance between the conductor sag point at max operating temperature and ground."
          },
          engineeringImpact: {
            fr: "Vital pour la sécurité publique : empêche l'amorçage d'un arc de 225 kV vers les camions, engins agricoles ou personnes passant sous la ligne.",
            en: "Vital for public safety: prevents 225 kV flashovers to vehicles, agricultural machinery, or pedestrians passing underneath."
          }
        },
        {
          parameter: "Faisceau Biconducteur (2 x Almélec 570 mm²)",
          meaning: {
            fr: "Utilisation de deux câbles espacés par phase au lieu d'un seul gros câble.",
            en: "Using two spaced sub-conductors per phase rather than one massive single conductor."
          },
          engineeringImpact: {
            fr: "Augmente le rayon équivalent de la phase, ce qui abaisse le champ électrique de surface sous le seuil d'effet couronne (réduction des pertes par grésillement et perturbations radio).",
            en: "Increases equivalent bundle radius, lowering surface electrical field below the corona discharge inception threshold (eliminating hissing losses and radio noise)."
          }
        }
      ],
      engineeringParameters: [
        { symbol: "Un", name: { fr: "Tension Nominale", en: "Nominal Voltage" }, typicalValue: "225 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "Um", name: { fr: "Tension Maximale Permanente", en: "Highest Voltage for Equipment" }, typicalValue: "245 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "Ith", name: { fr: "Courant Admissible Thermique", en: "Thermal Current Rating" }, typicalValue: "1150 A (75°C)", unit: "A", status: "VERIFIED" },
        { symbol: "BIL", name: { fr: "Tenue aux Chocs de Foudre", en: "Lightning Impulse Withstand" }, typicalValue: "1050 kV crête", unit: "kV", status: "VERIFIED" },
        { symbol: "R' (20°C)", name: { fr: "Résistance Linéique par Phase", en: "Linear Resistance per Phase" }, typicalValue: "0.031 Ω/km", unit: "Ω/km", status: "VERIFIED" },
        { symbol: "X' (50Hz)", name: { fr: "Réactance Linéique par Phase", en: "Linear Reactance per Phase" }, typicalValue: "0.31 Ω/km", unit: "Ω/km", status: "VERIFIED" },
        { symbol: "Portée", name: { fr: "Portée Moyenne entre Pylônes", en: "Average Span Length" }, typicalValue: "350 - 450 m", unit: "m", status: "VERIFIED" }
      ],
      relationships: {
        upstreamFeeder: {
          fr: "Poste élévateur 225 kV de centrale (D01)",
          en: "225 kV sending-end substation (D01)"
        },
        downstreamFed: {
          fr: "Poste source d'abaissement 225/30 kV (D04)",
          en: "225/30 kV primary step-down substation (D04)"
        },
        protectionChain: {
          ansiCodes: ["21 (Distance numérique 5 zones)", "87L (Différentielle de ligne sur fibre OPGW)", "50N/51N (Défaut terre résiduel)", "79 (Réenclencheur automatique mono/triphasé)"],
          relayTypes: { fr: "Double chaîne de protection de distance redondante (Main 1 & Main 2)", en: "Dual redundant line distance and differential protection relays" },
          operatingTime: "< 45 ms en zone 1 instantanée"
        },
        controlSystem: {
          architecture: { fr: "Câble de garde à fibres optiques intégrées (OPGW 48 FO) assurant la téléconduite et les téléprotections", en: "Optical Ground Wire (OPGW 48 fibers) carrying SCADA telecontrol and teleprotection signaling" },
          communicationProtocol: "IEC 60870-5-104 & IEEE C37.94"
        },
        meteringSystem: {
          sensors: { fr: "Transformateurs de tension capacitifs (CVT) et réducteurs de courant d'extrémité de ligne", en: "Capacitive voltage transformers (CVT) and line-end current transformers" },
          accuracyClass: "Classe 0.2 transactionnelle aux extrémités"
        },
        earthingSystem: {
          fr: "Mise à la terre de chaque pied de pylône par patte d'oie en acier galvanisé (résistance visée R < 10 Ω pour limiter les amorçages en retour lors des coups de foudre)",
          en: "Crow's foot galvanized steel grounding at each tower footing (target resistance R < 10 Ω preventing lightning back-flashover)"
        },
        auxiliarySupplies: {
          fr: "Balisage lumineux diurne et nocturne (feux ICAO basse intensité) alimenté par induction capacitive ou panneau solaire autonome sur pylônes spéciaux",
          en: "ICAO day/night obstruction beacons powered by capacitive coupling or solar kits on river crossings"
        }
      },
      operatingStates: [
        { state: "OFF", label: { fr: "Ligne Consignée & Mise à la Terre", en: "De-Energized & Earthed" }, condition: { fr: "Disjoncteurs et sectionneurs ouverts aux deux extrémités, perches MALT posées", en: "Breakers and disconnectors open both sides, safety earths applied" } },
        { state: "ENERGIZED", label: { fr: "Sous Tension à Vide (Effet Ferranti)", en: "Energized at Light Load" }, condition: { fr: "Tension en bout de ligne plus élevée qu'au départ (U2 > U1) par génération capacitive", en: "Receiving voltage rises above sending voltage due to Ferranti line capacitance" } },
        { state: "NORMAL", label: { fr: "En Transit Nominal Permanent", en: "Normal Transit Operation" }, condition: { fr: "Transit de 350 MW équilibré, température des câbles < 65°C, fréquence 50.0 Hz", en: "Balanced 350 MW power flow, conductor core temp < 65°C, 50.0 Hz" } },
        { state: "ABNORMAL", label: { fr: "Surcharge Thermique / Vent Violent", en: "Thermal Overload / High Wind" }, condition: { fr: "Courant > 1100 A pendant plus de 15 minutes, balancement excessif des câbles", en: "Current > 1100 A exceeding 15 min, excessive conductor galloping" } },
        { state: "TRIPPED", label: { fr: "Déclenché par Foudre / Défaut Monophasé", en: "Tripped on Lightning Fault" }, condition: { fr: "Coup de foudre direct provoquant un amorçage phase-terre, éliminé en 45 ms", en: "Direct lightning stroke causing phase-to-ground flashover, cleared in 45 ms" } },
        { state: "MAINTENANCE", label: { fr: "Travaux Sous Tension (TST) ou Hors Tension", en: "Live-Line / Dead-Line Work" }, condition: { fr: "Remplacement d'isolateurs cassés, élagage de la végétation dans le couloir", en: "Insulator string replacement, vegetation trimming within 40m corridor" } },
        { state: "RESTORATION", label: { fr: "Réenclenchement Réussi (Cycle 79)", en: "Auto-Reclose Successful" }, condition: { fr: "Réenclenchement monophasé automatique après 1 seconde : défaut fugitif disparu", en: "Single-pole auto-reclosure after 1.0 s dead time: transient fault cleared" } }
      ],
      failureSequence: {
        normalState: {
          fr: "Transit continu de 350 MW à 225 kV, flèche mécanique conforme, impédance de boucle normale.",
          en: "Continuous 350 MW transmission at 225 kV, mechanical sag within limits, normal line impedance."
        },
        abnormalCondition: {
          fr: "Amorçage diélectrique de la chaîne d'isolateurs suite à un foudroiement direct en milieu de portée (arc de foudre de 100 kA).",
          en: "Insulator string flashover following direct lightning strike at mid-span (100 kA lightning impulse)."
        },
        detectionMethod: {
          fr: "Le relais de distance numérique ANSI 21 détecte l'effondrement de la boucle d'impédance dans la zone 1 (Z_mesure < 85% de la ligne) en moins de 15 millisecondes.",
          en: "ANSI 21 distance relay detects impedance locus collapse inside Zone 1 (Z_measured < 85% of line) within 15 ms."
        },
        protectiveAction: {
          fr: "Ordre d'ouverture monophasée envoyé instantanément au disjoncteur 225 kV (seule la phase foudroyée s'ouvre, maintenant le transit sur les deux autres phases).",
          en: "Single-pole trip command issued to 225 kV breaker (only faulted phase disconnects, keeping 2 phases in service)."
        },
        isolationAndAlarms: {
          fr: "Extinction de l'arc de foudre pendant le temps mort (900 ms), alarme d'impact horodatée envoyée au centre de conduite.",
          en: "Arc deionization during 900 ms dead time, time-stamped fault locator alarm sent to control center."
        },
        restorationProcedure: {
          fr: "Réenclenchement automatique monophasé réussi par l'automate ANSI 79 ; le transit triphasé complet reprend sans coupure pour les usagers finaux.",
          en: "Successful single-pole auto-reclose by ANSI 79 automation; full 3-phase transit restored seamlessly without blackout."
        }
      }
    },
    level3: {
      verifiedStandards: [
        {
          organization: "IEC",
          standardNumber: "IEC 60826",
          title: "Design criteria of overhead transmission lines",
          scope: { fr: "Méthodologie de calcul fiabiliste des efforts de vent, de givre et des charges mécaniques sur pylônes.", en: "Reliability-based design methodology for wind, ice, and mechanical loads on overhead lines." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 61284",
          title: "Overhead lines - Requirements and tests for fittings",
          scope: { fr: "Exigences et essais de fatigue pour pinces de suspension, entretoises amortissantes et bretelles.", en: "Requirements and fatigue tests for suspension clamps, vibration dampers, and conductor spacers." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "CIGRE",
          standardNumber: "CIGRE TB 207",
          title: "Thermal Behavior of Overhead Conductors",
          scope: { fr: "Calcul de la capacité thermique dynamique en temps réel (DLR) en fonction du vent et de l'ensoleillement.", en: "Dynamic Line Rating (DLR) thermal calculation based on ambient wind and solar irradiance." },
          normativeStatus: "ADVISORY"
        },
        {
          organization: "NATIONAL_GRID_CODE",
          standardNumber: "Arrêté Interministériel Réglementant les Couloirs HT (Cameroun)",
          title: "Servitudes d'utilité publique et distances minimales des lignes électriques 225 kV",
          scope: { fr: "Fixe l'emprise inconstructible de 40 mètres et l'interdiction de toute plantation d'arbres à haute tige.", en: "Defines 40-meter mandatory non-building corridor and prohibits high-growth tree planting underneath." },
          normativeStatus: "REGULATORY"
        }
      ],
      engineeringDocumentation: [
        { documentType: { fr: "Profil en Long & Carnet de Piquetage", en: "Profile & Tower Spotting Schedule" }, deliverableName: "PL-LINE-225-SONG-BEK-REV4", status: "AVAILABLE", standardRef: "IEC 60826" },
        { documentType: { fr: "Calcul de Flèche & Tensions Mécaniques", en: "Sag-Tension Mechanical Calculation" }, deliverableName: "CALC-SAG-AAAC-570-75C", status: "AVAILABLE" },
        { documentType: { fr: "Plan d'Exécution du Pylône d'Alignement", en: "Suspension Tower Structural Workshop Drawing" }, deliverableName: "DWG-TOWER-TYPE-S2-225KV", status: "AVAILABLE" },
        { documentType: { fr: "Rapport de Mesure des Prises de Terre Pylône", en: "Tower Footing Resistance Audit Report" }, deliverableName: "REP-EARTH-FOOTING-KM0-150", status: "AVAILABLE" },
        { documentType: { fr: "Plan de Continuité des Fibres Optiques OPGW", en: "OPGW Splicing & Optical Link Budget" }, deliverableName: "OPGW-SPLICE-SCH-SONG-BEK", status: "AVAILABLE" }
      ],
      safetyLayer: {
        primaryHazards: [
          { fr: "Chute de grande hauteur (pylônes de 35 à 60 mètres de hauteur)", en: "Falls from height (towers between 35 and 60 meters high)" },
          { fr: "Induction électrostatique et électromagnétique sur les lignes voisines ou clôtures métalliques", en: "Electrostatic and electromagnetic induction on parallel lines or metal fencing" },
          { fr: "Tension de pas et de toucher dangereuse au pied du pylône lors d'un foudroiement", en: "Dangerous step and touch voltages at tower base during lightning discharge" }
        ],
        arcFlashBoundary: "3.5 mètres en champ libre",
        isolationLOTO: {
          fr: "Consignation de ligne complète : Déclenchement des disjoncteurs aux deux extrémités, verrouillage des sectionneurs de ligne, fermeture des sectionneurs de terre et pose de terres manuelles sur le pylône de travail.",
          en: "Complete line clearance: Both line-end breakers opened, line disconnectors locked open, earth switches closed, and manual grounding cables fitted directly to conductors at the work tower."
        },
        earthingMALT: {
          fr: "Vérification d'absence de tension avec perche télescopique 225 kV, puis raccordement des trois pinces de court-circuit reliées au corps du pylône mis à la terre.",
          en: "Voltage detection with 225 kV telescopic live probe, followed by clamping three short-circuiting cables bonded to the earthed tower structure."
        },
        requiredPPE: [
          { fr: "Harnais complet d'antichute avec longe double à absorbeur d'énergie et antichute à câble", en: "Full-body fall arrest harness with dual lanyard, energy absorber, and cable runner" },
          { fr: "Combinaison de travail conductrice pour travaux sous tension au potentiel (le cas échéant)", en: "Faraday conductive suit for live bare-hand potential work (if applicable)" },
          { fr: "Casque de sécurité de travail en hauteur avec jugulaire conforme EN 12492", en: "Height safety helmet with chin strap complying with EN 12492" }
        ]
      },
      crossDomainLinks: [
        { domainCode: "D01", domainName: { fr: "Production d'Énergie", en: "Energy Production" }, relationshipContext: { fr: "Reçoit l'énergie des centrales hydro et gaz", en: "Receives bulk generation from hydro and gas plants" } },
        { domainCode: "D04", domainName: { fr: "Postes Électriques", en: "Substations" }, relationshipContext: { fr: "Aboutit aux jeux de barres des postes sources 225/30 kV", en: "Terminates on 225/30 kV primary substation busbars" } },
        { domainCode: "D12", domainName: { fr: "Télécommunications & SCADA", en: "Telecom & SCADA" }, relationshipContext: { fr: "Le câble OPGW constitue l'épine dorsale télécom du pays", en: "OPGW earth wire provides the national optical telecom backbone" } }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // SUBSTATION: 225/30 KV STEP-DOWN POWER TRANSFORMER
  // ---------------------------------------------------------------------------
  'pin-sub-trafo': {
    id: 'pin-sub-trafo',
    badgeNumber: 4,
    engineeringName: {
      fr: "Transformateur de Puissance Abaisseur de Poste Source 225/30 kV",
      en: "225/30 kV Primary Substation Step-Down Power Transformer"
    },
    commonName: {
      fr: "Transformateur de Poste Source 63 MVA (Bekoko / Oyomabang)",
      en: "Primary Substation Transformer 63 MVA (Bekoko / Oyomabang)"
    },
    locationInEcosystem: {
      fr: "Plateforme extérieure du poste source de répartition, travée transformateur",
      en: "Outdoor primary substation switchyard, transformer bay"
    },
    maturityStatus: 'VERIFIED_STANDARDS',
    level1: {
      purposeWhy: {
        fr: "Pourquoi existe-t-il ? Il constitue la passerelle indispensable entre le grand transport (225 kV) et la distribution urbaine (30 kV). Sans lui, il serait impossible d'injecter l'énergie dans les câbles de ville sans provoquer d'arcs destructeurs.",
        en: "Why does it exist? It serves as the vital gateway between high voltage transmission (225 kV) and urban distribution (30 kV). Without it, energy cannot enter city cables without catastrophic dielectric destruction."
      },
      concreteFunction: {
        fr: "Il abaisse la tension de 225 kV vers 30 kV tout en ajustant automatiquement la tension de sortie grâce à son changeur de prises sous charge (OLTC) pour compenser les variations de charge de la ville.",
        en: "It steps down voltage from 225 kV to 30 kV while automatically fine-tuning output voltage via its On-Load Tap Changer (OLTC) to compensate for urban load fluctuations."
      },
      workingPrincipleSimple: {
        fr: "L'énergie traverse un champ magnétique confiné dans un noyau d'acier au silicium. Le rapport entre le nombre de spires du bobinage HT (225 kV) et du bobinage MT (30 kV) divise la tension par 7.5, permettant d'alimenter les départs de la ville en toute sécurité.",
        en: "Energy passes through a magnetic field inside a laminated silicon steel core. The ratio between the 225 kV high-voltage winding turns and the 30 kV medium-voltage winding turns divides voltage by 7.5 to safely feed urban feeder networks."
      },
      energyFlow: {
        upstreamInput: {
          fr: "Haute tension 225 kV en provenance du jeu de barres du poste",
          en: "225 kV high voltage from incoming substation busbar"
        },
        equipmentProcessing: {
          fr: "Transformation électromagnétique triphasée avec régulation de tension en charge",
          en: "Three-phase electromagnetic transformation with on-load tap regulation"
        },
        downstreamOutput: {
          fr: "Moyenne tension stabilisée à 30 kV injectée dans la rame de distribution HTA",
          en: "Stabilized 30 kV medium voltage fed into MV distribution switchgear lineup"
        }
      },
      electricalRoleSummary: {
        voltage: "225 kV (Primaire) / 30 kV (Secondaire)",
        currentOrPower: "Puissance assignée 63 MVA ONAF",
        frequency: "50 Hz",
        powerFactorOrEfficiency: "Rendement thermique 99.4%",
        insulationOrEnclosure: "Cuve acier hermétique avec conservateur et respirateur d'air déshydraté"
      }
    },
    level2: {
      whyParametersMatter: [
        {
          parameter: "Changeur de Prises en Charge OLTC (± 8 x 1.25%)",
          meaning: {
            fr: "Dispositif électromécanique interne modifiant le nombre de spires actives sans couper le courant.",
            en: "Internal electromechanical mechanism altering active winding turns without interrupting load current."
          },
          engineeringImpact: {
            fr: "Permet de maintenir strictement 30 kV aux bornes des usagers quelle que soit la demande de pointe ou la chute de tension sur le réseau 225 kV.",
            en: "Maintains strictly 30 kV at consumer feeder terminals regardless of peak load demand or 225 kV transmission line sag."
          }
        },
        {
          parameter: "Couplage Dyn11 / YNyn0",
          meaning: {
            fr: "Configuration géométrique des enroulements primaire et secondaire.",
            en: "Vectorial winding configuration of primary and secondary phases."
          },
          engineeringImpact: {
            fr: "Le couplage avec neutre accessible permet de fixer le régime de neutre du réseau 30 kV (par résistance de limitation de défaut terre) pour sécuriser l'exploitation.",
            en: "Accessible neutral enables setting the 30 kV earthing regime (via neutral grounding resistor) to control single-phase fault currents."
          }
        }
      ],
      engineeringParameters: [
        { symbol: "Sn", name: { fr: "Puissance Nominale", en: "Rated Power" }, typicalValue: "63 MVA", unit: "MVA", status: "VERIFIED" },
        { symbol: "U1", name: { fr: "Tension Primaire", en: "Primary Voltage" }, typicalValue: "225 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "U2", name: { fr: "Tension Secondaire à Vide", en: "No-Load Secondary Voltage" }, typicalValue: "31.5 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "ucc", name: { fr: "Impédance de Court-Circuit", en: "Short-Circuit Impedance" }, typicalValue: "11.5 %", unit: "%", status: "VERIFIED" },
        { symbol: "I1n", name: { fr: "Courant Nominal HT", en: "Rated HV Current" }, typicalValue: "162 A", unit: "A", status: "VERIFIED" },
        { symbol: "I2n", name: { fr: "Courant Nominal MT", en: "Rated MV Current" }, typicalValue: "1155 A", unit: "A", status: "VERIFIED" }
      ],
      relationships: {
        upstreamFeeder: {
          fr: "Travée transformateur 225 kV avec disjoncteur SF6 et sectionneurs de barre",
          en: "225 kV transformer bay with SF6 circuit breaker and busbar disconnectors"
        },
        downstreamFed: {
          fr: "Jeu de barres 30 kV du tableau intérieur sous enveloppe métallique (D05)",
          en: "30 kV busbar inside metal-clad switchgear room (D05)"
        },
        protectionChain: {
          ansiCodes: ["87T (Différentielle transfo)", "50/51 (Surintensité HT/MT)", "51N (Terre)", "63 (Buchholz)", "49 (Image thermique)", "64R (Terre restreinte)"],
          relayTypes: { fr: "Relais numérique multifonction de protection de transformateur", en: "Multifunction numerical transformer protection relay" },
          operatingTime: "< 30 ms pour défaut différentiel"
        },
        controlSystem: {
          architecture: { fr: "Régulateur automatique de tension (AVR) pilotant le moteur du changeur de prises (OLTC) via GOOSE CEI 61850", en: "Automatic Voltage Regulator (AVR) driving tap changer motor via IEC 61850 GOOSE" },
          communicationProtocol: "IEC 61850 MMS / GOOSE"
        },
        meteringSystem: {
          sensors: { fr: "TC tore 200/1A (HT) et 1500/1A (MT) classe 0.2S", en: "Bushing CTs 200/1A (HV) and 1500/1A (MV) class 0.2S" },
          accuracyClass: "Classe 0.2S pour le comptage de transfert d'énergie"
        },
        earthingSystem: {
          fr: "Neutre 30 kV mis à la terre via résistance de limitation de neutre (RNF limitant le courant de défaut terre à 300 A pendant 5 secondes)",
          en: "30 kV neutral grounded via Neutral Grounding Resistor (NGR limiting ground fault current to 300 A for 5 seconds)"
        },
        auxiliarySupplies: {
          fr: "400 Vca pour les motoventilateurs et le moteur d'OLTC, 110 Vcc pour les bobines de déclenchement",
          en: "400 Vac for radiator fans and OLTC motor, 110 Vdc for trip and close coils"
        }
      },
      operatingStates: [
        { state: "OFF", label: { fr: "Consigné Hors Tension", en: "Isolated & Locked Out" }, condition: { fr: "Disjoncteurs 225 kV et 30 kV ouverts et embrochés en position test/sectionné", en: "225 kV and 30 kV breakers open and racked out in disconnected position" } },
        { state: "ENERGIZED", label: { fr: "Enclenché à Vide", en: "Energized at No-Load" }, condition: { fr: "Tension 225 kV appliquée, changeur de prises au cran nominal (cran 0)", en: "225 kV applied, tap changer at nominal tap (Tap 0), core losses present" } },
        { state: "NORMAL", label: { fr: "En Service en Charge", en: "In Service On-Load" }, condition: { fr: "Transit de 45 MVA, régulation automatique de tension maintenant 30.0 kV ± 1%", en: "45 MVA transit, automatic tap control maintaining 30.0 kV ± 1%" } },
        { state: "ABNORMAL", label: { fr: "Alarme Niveau Huile / Échauffement", en: "Oil Level / Temp Alarm" }, condition: { fr: "Température supérieure à 90°C ou baisse lente du niveau d'huile au conservateur", en: "Winding temp exceeding 90°C or slow oil drop in conservator" } },
        { state: "TRIPPED", label: { fr: "Déclenché par Protection", en: "Tripped on Fault" }, condition: { fr: "Surpression Buchholz ou défaut différentiel interne 87T éliminé en 30 ms", en: "Buchholz gas surge or 87T internal phase fault cleared in 30 ms" } },
        { state: "MAINTENANCE", label: { fr: "Entretien Périodique", en: "Routine Maintenance" }, condition: { fr: "Remplacement des contacts d'arc de l'OLTC, contrôle du gel de silice du respirateur", en: "OLTC arcing contact replacement, silica gel breather regeneration" } },
        { state: "RESTORATION", label: { fr: "Remise en Service Validée", en: "Post-Incident Clearance" }, condition: { fr: "Mesure de résistance d'enroulement, test de rigidité d'huile, validation chef de quart", en: "Winding resistance test, oil breakdown voltage test, shift lead clearance" } }
      ],
      failureSequence: {
        normalState: {
          fr: "Exploitation continue à 45 MVA, 30.2 kV régulés, température d'huile 68°C.",
          en: "Continuous operation at 45 MVA, 30.2 kV regulated, top oil temperature 68°C."
        },
        abnormalCondition: {
          fr: "Coup de bélier de foudre traversant les parafoudres et amorçage entre spires de l'enroulement 225 kV.",
          en: "Lightning surge bypassing arresters causing inter-turn flashover in 225 kV winding."
        },
        detectionMethod: {
          fr: "Le relais de protection différentielle 87T mesure un courant différentiel vectoriel de 1200 A ; le relais Buchholz actionne son contact à mercure sous la poussée du clapet.",
          en: "87T differential relay detects 1200 A vector difference; Buchholz relay triggers on violent oil displacement."
        },
        protectiveAction: {
          fr: "Déclenchement instantané (< 30 ms) des disjoncteurs 225 kV amont et 30 kV aval pour isoler le transformateur des deux sources d'alimentation.",
          en: "Instant trip (< 30 ms) of both 225 kV upstream and 30 kV downstream breakers, cutting all feeds."
        },
        isolationAndAlarms: {
          fr: "Verrouillage électrique (ANSI 86 Lockout) empêchant tout réenclenchement intempestif, envoi d'alarme prioritaire vers le SCADA central.",
          en: "ANSI 86 lockout master relay latching against reclose attempts, priority alarm dispatched to SCADA."
        },
        restorationProcedure: {
          fr: "Prélèvement d'huile pour analyse chromatographique des gaz (DGA), mesure du rapport de spires TTR et confirmation de l'état du circuit magnétique.",
          en: "Oil sampling for Dissolved Gas Analysis (DGA), turns ratio (TTR) measurement, and core integrity check."
        }
      }
    },
    level3: {
      verifiedStandards: [
        {
          organization: "IEC",
          standardNumber: "IEC 60076-2",
          title: "Power transformers - Part 2: Temperature rise for liquid-immersed transformers",
          scope: { fr: "Limites d'échauffement de l'huile (60K) et des enroulements (65K) en climat tropical chaud.", en: "Defines oil (60K) and winding (65K) temperature rise limits under hot tropical conditions." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 60214-1",
          title: "Tap-changers - Part 1: Performance requirements and test methods",
          scope: { fr: "Exigences de tenue mécanique et pouvoir de coupure sous l'huile des régleurs en charge OLTC.", en: "Mechanical endurance and breaking capacity specifications for on-load tap changers." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEEE",
          standardNumber: "IEEE C57.104",
          title: "Guide for the Interpretation of Gases Generated in Mineral Oil-Immersed Transformers",
          scope: { fr: "Diagnostic des défauts naissants par chromatographie des gaz dissous (méthane, acétylène, hydrogène).", en: "Diagnosis of incipient faults through dissolved gas chromatography (methane, acetylene, hydrogen)." },
          normativeStatus: "ADVISORY"
        }
      ],
      engineeringDocumentation: [
        { documentType: { fr: "Schéma Unifilaire Détaillé de Poste", en: "Detailed Substation Single-Line Diagram" }, deliverableName: "SLD-SUB-BEK-225-30-REV3", status: "AVAILABLE", standardRef: "IEC 61082" },
        { documentType: { fr: "Spécification Technique Particulière (STP)", en: "Particular Technical Specification (PTS)" }, deliverableName: "STP-SONATREL-TRAFO-63MVA", status: "AVAILABLE" },
        { documentType: { fr: "Rapport d'Essai d'Échauffement Thermique", en: "Temperature Rise Type Test Certificate" }, deliverableName: "TEST-REP-TEMP-RISE-63MVA", status: "AVAILABLE", standardRef: "IEC 60076-2" },
        { documentType: { fr: "Guide d'Exploitation du Régulateur OLTC", en: "OLTC Automatic Controller Manual" }, deliverableName: "MAN-AVR-TAP-REGULATOR-V2", status: "AVAILABLE" }
      ],
      safetyLayer: {
        primaryHazards: [
          { fr: "Haute tension 225 kV et moyenne tension 30 kV présentes simultanément", en: "High voltage 225 kV and medium voltage 30 kV coexisting in same apparatus" },
          { fr: "Risque de surpression et d'explosion de cuve sous arc électrique interne", en: "Risk of tank rupture and explosion under unmitigated internal arc energy" },
          { fr: "Brûlures thermiques par projections d'huile chaude (> 90°C)", en: "Severe thermal burn hazards from hot pressurized dielectric oil discharge (> 90°C)" }
        ],
        arcFlashBoundary: "4.8 mètres côté 225 kV / 2.2 mètres côté 30 kV",
        isolationLOTO: {
          fr: "Procédure LOTO de consignation de tranche : Débrochage des deux disjoncteurs, verrouillage mécanique par clé prisonnière (interverrouillage Castell), mise à la terre des bornes HT et MT.",
          en: "Full bay LOTO procedure: Racking out of both circuit breakers, trapped-key mechanical interlocking (Castell system), and earthing of HV and MV terminals."
        },
        earthingMALT: {
          fr: "Vérification d'absence de tension sur les traversées, mise en place des perches de terre homologuées.",
          en: "Voltage absence testing on all bushings, followed by approved earthing clamp attachment."
        },
        requiredPPE: [
          { fr: "Tenue d'intervention sous poste Arc Flash catégorie 4 (40 cal/cm²)", en: "Arc Flash Category 4 switchyard protective clothing (40 cal/cm²)" },
          { fr: "Casque électricien avec écran facial traité anti-UV et anti-arc", en: "Electrician helmet with UV and anti-arc protective polycarbonate visor" },
          { fr: "Chaussures isolantes et gants composites pour manœuvres d'appareillage", en: "Dielectric footwear and composite electrical switching gloves" }
        ]
      },
      crossDomainLinks: [
        { domainCode: "D03", domainName: { fr: "Réseau de Transport", en: "Transmission Networks" }, relationshipContext: { fr: "Reçoit la puissance de la ligne 225 kV", en: "Receives bulk power from 225 kV transmission line" } },
        { domainCode: "D05", domainName: { fr: "Réseaux de Distribution", en: "Distribution Networks" }, relationshipContext: { fr: "Injecte la puissance dans les feeders 30 kV de la ville", en: "Injects power into 30 kV urban distribution feeders" } },
        { domainCode: "D08", domainName: { fr: "Protection & Contrôle", en: "Protection & Control" }, relationshipContext: { fr: "Relais numériques différentiels 87T et calculateurs de baie", en: "87T differential relays and IEC 61850 bay computers" } }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DISTRIBUTION: MV/LV DISTRIBUTION TRANSFORMER (Dyn11 400V)
  // ---------------------------------------------------------------------------
  'pin-dist-trafo': {
    id: 'pin-dist-trafo',
    badgeNumber: 3,
    engineeringName: {
      fr: "Transformateur de Distribution MT/BT Triphasé Immergé (Dyn11)",
      en: "Three-Phase Oil-Immersed MV/LV Distribution Transformer (Dyn11)"
    },
    commonName: {
      fr: "Transformateur MT/BT 30 kV / 400 V (Poste Cabine ou H61)",
      en: "MV/LV Transformer 30 kV / 400 V (Kiosk or Pole-Mounted H61)"
    },
    locationInEcosystem: {
      fr: "Poste de distribution urbain en cabine maçonnée, poste préfabriqué ou haut de poteau (H61)",
      en: "Urban masonry substation, compact kiosk package substation, or pole-mounted H61"
    },
    maturityStatus: 'COMPLETE',
    level1: {
      purposeWhy: {
        fr: "Pourquoi existe-t-il ? C'est le dernier transformateur de la chaîne électrique : il convertit la moyenne tension dangereuse du quartier (30 000 V) en basse tension sécurisée (400 V triphasé / 230 V monophasé) qui alimente directement les prises, les ordinateurs, les moteurs et les lampes.",
        en: "Why does it exist? It is the final transformer in the electrical energy chain: it converts dangerous neighborhood medium voltage (30,000 V) into safe, usable low voltage (400 V 3-phase / 230 V single-phase) directly powering wall sockets, appliances, lighting, and industrial motors."
      },
      concreteFunction: {
        fr: "Il abaisse la tension de 30 kV à 400 V et crée le conducteur Neutre grâce à son couplage secondaire en étoile (Dyn11), permettant d'obtenir la tension monophasée 230 V entre n'importe quelle phase et le neutre.",
        en: "It steps down voltage from 30 kV to 400 V and generates the Neutral conductor through its secondary star winding (Dyn11), making 230 V single-phase power available between any phase and neutral."
      },
      workingPrincipleSimple: {
        fr: "Principe de transformation statique : Les trois phases MT créent un champ magnétique tournant dans les trois colonnes du circuit magnétique. Les enroulements BT comportent beaucoup moins de spires en gros câble méplat, fournissant un courant fort à basse tension sans bruit ni pièces mobiles.",
        en: "Static transformation principle: The three MV phases produce alternating magnetic flux inside three laminated core legs. Secondary LV coils have far fewer turns of thick copper bar, delivering high current at safe low voltage with zero moving parts."
      },
      energyFlow: {
        upstreamInput: {
          fr: "Feeder souterrain ou aérien HTA 30 kV (courant modéré ~12 A sous 30 kV)",
          en: "30 kV MV underground or overhead feeder (modest current ~12 A at 30 kV)"
        },
        equipmentProcessing: {
          fr: "Noyau magnétique immergé dans l'huile minérale diélectrique (rendement ~98.8%)",
          en: "Dielectric oil-immersed magnetic core (~98.8% energy efficiency)"
        },
        downstreamOutput: {
          fr: "Basse tension 400 V triphasé + neutre (courant fort jusqu'à 910 A par phase)",
          en: "Low voltage 400 V three-phase + neutral (heavy current up to 910 A per phase)"
        }
      },
      electricalRoleSummary: {
        voltage: "30 000 V (Primaire) → 400 V / 230 V (Secondaire)",
        currentOrPower: "630 kVA (débits typiques de 100 à 1600 kVA)",
        frequency: "50 Hz",
        powerFactorOrEfficiency: "Rendement selon directive EcoDesign CEI Tier 2 (> 99%)",
        insulationOrEnclosure: "Cuve étanche à remplissage total (sans matelas gazeux) IP54"
      }
    },
    level2: {
      whyParametersMatter: [
        {
          parameter: "Groupe Vectoriel Dyn11",
          meaning: {
            fr: "Primaire Triangle (D), Secondaire Étoile avec neutre sorti (y-n), déphasage de 330° (11 x 30°).",
            en: "Delta primary (D), Star secondary with neutral (y-n), 330° phase shift (11 x 30°)."
          },
          engineeringImpact: {
            fr: "Le triangle primaire emprisonne les courants harmoniques d'ordre 3 (générés par l'électronique de puissance), évitant leur propagation vers le réseau MT, tandis que l'étoile neutre permet d'alimenter les récepteurs 230V monophasés.",
            en: "Primary delta traps 3rd harmonic currents (from electronic loads) preventing MV grid pollution, while secondary star neutral enables 230V single-phase consumer feeds."
          }
        },
        {
          parameter: "Tension de Court-Circuit ucc (4% à 6%)",
          meaning: {
            fr: "Impédance interne définissant le courant de court-circuit maximal au TGBT.",
            en: "Internal impedance determining peak short-circuit current at the main LV switchboard."
          },
          engineeringImpact: {
            fr: "Une valeur de 4% garantit une très faible chute de tension en charge normale, mais produit un courant de court-circuit Isc BT de 22.7 kA que le disjoncteur général TGBT doit être capable de couper.",
            en: "A 4% impedance ensures low voltage drop under load, but results in a 22.7 kA LV fault current that the main incoming circuit breaker must safely interrupt."
          }
        }
      ],
      engineeringParameters: [
        { symbol: "Sn", name: { fr: "Puissance Assignée", en: "Rated Power" }, typicalValue: "630 kVA", unit: "kVA", status: "VERIFIED" },
        { symbol: "U1", name: { fr: "Tension Primaire Nominale", en: "Primary Voltage" }, typicalValue: "30 kV", unit: "kV", status: "VERIFIED" },
        { symbol: "U20", name: { fr: "Tension Secondaire à Vide", en: "No-Load Secondary Voltage" }, typicalValue: "410 V (pour 400V en charge)", unit: "V", status: "VERIFIED" },
        { symbol: "I2n", name: { fr: "Courant Secondaire Assigné", en: "Rated Secondary Current" }, typicalValue: "909 A", unit: "A", status: "VERIFIED" },
        { symbol: "ucc", name: { fr: "Tension de Court-Circuit", en: "Impedance Voltage" }, typicalValue: "4.0 %", unit: "%", status: "VERIFIED" },
        { symbol: "P0", name: { fr: "Pertes à Vide (Fer)", en: "No-Load Core Losses" }, typicalValue: "800 W", unit: "W", status: "VERIFIED" },
        { symbol: "Pk", name: { fr: "Pertes en Charge (Cuivre)", en: "Load Losses at 75°C" }, typicalValue: "5400 W", unit: "W", status: "VERIFIED" }
      ],
      relationships: {
        upstreamFeeder: {
          fr: "Cellule de protection transformateur par combiné interrupteur-fusibles HTA (ou disjoncteur HTA avec relais VIP)",
          en: "MV transformer cubicle with switch-fuse combination (or MV circuit breaker with self-powered relay)"
        },
        downstreamFed: {
          fr: "Tableau Général Basse Tension (TGBT) par jeu de barres cuivre ou câbles unipolaires XLPE",
          en: "Main Low Voltage Switchboard (TGBT) via copper busway or single-core XLPE cables"
        },
        protectionChain: {
          ansiCodes: ["50/51 (Surintensité MT)", "50N/51N (Terre MT)", "63 (Bloc de protection DGPT2)", "49 (Image thermique BT)"],
          relayTypes: { fr: "Bloc de détection DGPT2 (Décharge gaz, Pression, Température 2 seuils)", en: "DGPT2 integrated protection relay (Gas, Pressure, 2-stage Temperature)" },
          operatingTime: "< 20 ms pour déclenchement fusible / < 100 ms pour pressostat DGPT2"
        },
        controlSystem: {
          architecture: { fr: "Indicateur de température de cuve à cadrant avec contacts de déclenchement reliés à la bobine d'ouverture de la cellule MT amont", en: "Dial thermometer with alarm and trip dry contacts wired to upstream MV trip coil" },
          communicationProtocol: "Contacts secs libres de potentiel vers RTU de quartier"
        },
        meteringSystem: {
          sensors: { fr: "3 TC ouvrants 1000/5A classe 0.5 montés en tête du TGBT", en: "3x split-core CTs 1000/5A class 0.5 mounted at main LV switchboard" },
          accuracyClass: "Classe 0.5 pour le comptage de quartier"
        },
        earthingSystem: {
          fr: "Neutre relié directement à la prise de terre des masses ou terre séparée (selon régime TT ou TN-S)",
          en: "Neutral connected directly to substation earth electrode or separate neutral earth (TT or TN-S)"
        },
        auxiliarySupplies: {
          fr: "Auto-alimenté par la tension réseau, aucun auxiliaire requis (grande fiabilité passive)",
          en: "Passive self-cooled natural circulation, zero external auxiliaries needed"
        }
      },
      operatingStates: [
        { state: "OFF", label: { fr: "Hors Tension Consigné", en: "De-Energized & Isolated" }, condition: { fr: "Sectionneur MT ouvert et mis à la terre, disjoncteur général TGBT ouvert", en: "MV switch open and earthed, main LV breaker open" } },
        { state: "ENERGIZED", label: { fr: "Sous Tension à Vide", en: "Energized at No-Load" }, condition: { fr: "Cellule MT fermée, 410 V mesurés entre phases au TGBT, aucun départ enclenché", en: "MV cubicle closed, 410V measured across LV phases, zero consumer load" } },
        { state: "NORMAL", label: { fr: "En Service en Charge", en: "Normal Load Service" }, condition: { fr: "Courant débité de 200 à 750 A selon l'heure de la journée, température cuve 60°C", en: "Current transit 200 to 750 A depending on time of day, tank temp 60°C" } },
        { state: "ABNORMAL", label: { fr: "Surcharge / Seuil Température T1", en: "Overload / Temp Stage 1" }, condition: { fr: "Thermomètre DGPT2 atteignant 85°C : alarme sonore ou délestage automatique", en: "DGPT2 thermometer reaching 85°C: alarm buzzer or automatic non-priority shedding" } },
        { state: "TRIPPED", label: { fr: "Déclenché par Fusible ou DGPT2", en: "Tripped on Fault" }, condition: { fr: "Fusion d'un fusible HTA ou déclenchement thermostat T2 (100°C) / pressostat", en: "MV fuse blown or DGPT2 stage 2 thermostat (100°C) / pressure switch trip" } },
        { state: "MAINTENANCE", label: { fr: "Contrôle Périodique Annuel", en: "Annual Preventive Check" }, condition: { fr: "Dépoussiérage des traversées porcelaine, resserrage des bornes au couple, test diélectrique", en: "Bushing cleaning, torque check on bus connections, oil breakdown test" } },
        { state: "RESTORATION", label: { fr: "Rétablissement Après Incident", en: "Post-Fault Re-Commissioning" }, condition: { fr: "Remplacement du jeu complet de fusibles MT, contrôle d'isolement 1000V de l'enroulement BT", en: "Replacement of all 3 MV fuses, 1000V Megger test of LV windings, re-energization" } }
      ],
      failureSequence: {
        normalState: {
          fr: "Fonctionnement continu à 400 kVA, tension délivrée 400 V ± 5%, température d'huile 55°C.",
          en: "Continuous operation at 400 kVA, 400 V ± 5% delivered, top oil temp 55°C."
        },
        abnormalCondition: {
          fr: "Court-circuit franc triphasé sur le jeu de barres principal du TGBT aval (courant Isc = 22 700 A).",
          en: "Bolted three-phase short-circuit on main LV busbars downstream (Isc = 22,700 A)."
        },
        detectionMethod: {
          fr: "Les fusibles HTA à haut pouvoir de coupure (HPC) fondent sous l'effet de l'échauffement adiabatique en moins de 10 millisecondes.",
          en: "High-breaking capacity (HBC) MV fuses melt adiabatically in under 10 milliseconds."
        },
        protectiveAction: {
          fr: "Percussion du percuteur de fusible actionnant l'ouverture mécanique tripolaire de l'interrupteur HTA.",
          en: "Striker pin expulsion triggers mechanical three-pole opening of upstream MV load switch."
        },
        isolationAndAlarms: {
          fr: "Coupure de l'arc sans explosion de cuve, signalisation mécanique locale de fusion fusible.",
          en: "Arc extinguished without tank rupture, local mechanical blown-fuse target dropped."
        },
        restorationProcedure: {
          fr: "Élimination du court-circuit au TGBT, remplacement des trois cartouches fusibles par des éléments neufs homologués, réarmement de l'interrupteur.",
          en: "Clearance of LV bus fault, replacement of all 3 fuse cartridges with certified units, manual rearming."
        }
      }
    },
    level3: {
      verifiedStandards: [
        {
          organization: "IEC",
          standardNumber: "IEC 60076-1",
          title: "Power transformers - Part 1: General",
          scope: { fr: "Norme cadre pour la conception et les essais des transformateurs de distribution.", en: "Master standard for design and testing of distribution transformers." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 60076-7",
          title: "Loading guide for mineral-oil-immersed power transformers",
          scope: { fr: "Règles de surcharge admissible et calcul de la vitesse de vieillissement de l'isolation papier.", en: "Rules for permissible overloading and insulation paper life consumption calculation." },
          normativeStatus: "ADVISORY"
        },
        {
          organization: "IEC",
          standardNumber: "IEC 60038",
          title: "IEC standard voltages",
          scope: { fr: "Fixe les tensions normalisées en basse tension (230 V monophasé / 400 V triphasé, tolérance ±10%).", en: "Specifies standard low voltages (230 V single-phase / 400 V 3-phase, ±10% tolerance)." },
          normativeStatus: "NORMATIVE"
        },
        {
          organization: "NATIONAL_GRID_CODE",
          standardNumber: "Norme d'Exploitation Distribution MT/BT (ENEO Cameroun)",
          title: "Spécifications techniques des postes de distribution HTA/BT 30 kV / 400 V",
          scope: { fr: "Impose la tenue diélectrique 36 kV, l'huile minérale inhibée et les fusibles HPC de calibre adapté.", en: "Mandates 36 kV insulation class, inhibited mineral oil, and matched HBC fuse ratings." },
          normativeStatus: "REGULATORY"
        }
      ],
      engineeringDocumentation: [
        { documentType: { fr: "Schéma Électrique du Poste MT/BT", en: "MV/LV Substation Electrical Schematic" }, deliverableName: "SCH-POSTE-CABINE-30K-400V", status: "AVAILABLE", standardRef: "IEC 61082" },
        { documentType: { fr: "Plaque Signalétique Normalisée", en: "Standardized Nameplate Rating Plate" }, deliverableName: "NP-TRAFO-DIST-630KVA-DYN11", status: "AVAILABLE", standardRef: "IEC 60076-1" },
        { documentType: { fr: "Notice de Pose & Raccordement BT", en: "Installation & LV Termination Guide" }, deliverableName: "MAN-INST-CABIN-TRAFO-FR", status: "AVAILABLE" },
        { documentType: { fr: "Rapport d'Essais Diélectriques Individuel", en: "Routine Factory Test Certificate" }, deliverableName: "TEST-CERT-DIST-630-SN847", status: "AVAILABLE" }
      ],
      safetyLayer: {
        primaryHazards: [
          { fr: "Moyenne tension 30 000 V mortelle au primaire (distance d'isolement obligatoire)", en: "Lethal 30,000 V medium voltage at primary bushings" },
          { fr: "Courant de court-circuit très élevé au secondaire BT (22 000 A) générant un souffle d'arc violent", en: "Extreme low-voltage short-circuit current (22 kA) generating severe arc blast" },
          { fr: "Risque de surchauffe et projection d'huile brûlante en cas de défaut interne prolongé", en: "Overheating risk and hot oil spray hazards during unmitigated internal faults" }
        ],
        arcFlashBoundary: "1.8 mètre au niveau du tableau BT ouvert",
        isolationLOTO: {
          fr: "Consignation LOTO stricte : Ouverture de la cellule MT amont, fermeture du sectionneur de terre MT, ouverture du disjoncteur général TGBT et condamnation par cadenas.",
          en: "Strict LOTO clearance: Open upstream MV feeder, close MV earth switch, trip and padlock main LV incoming breaker."
        },
        earthingMALT: {
          fr: "Vérification d'absence de tension sur les plages MT et BT avec détecteur certifié, mise en court-circuit des bornes.",
          en: "Voltage absence verification on MV and LV terminals with certified detector, terminal short-circuiting."
        },
        requiredPPE: [
          { fr: "Écran facial anti-arc électrique classe 2 (GS-ET-29)", en: "Arc flash face shield Class 2 (GS-ET-29)" },
          { fr: "Gants isolants basse tension classe 0 (1 000 V) et gants MT classe 4 pour manœuvre", en: "Class 0 (1000 V) LV insulating gloves and Class 4 MV switching gloves" },
          { fr: "Vêtement de protection 100% coton ininflammable ou veste anti-arc 25 cal/cm²", en: "Flame-resistant 100% cotton clothing or 25 cal/cm² arc-rated jacket" }
        ]
      },
      crossDomainLinks: [
        { domainCode: "D04", domainName: { fr: "Postes Sources", en: "Primary Substations" }, relationshipContext: { fr: "Alimenté par les départs 30 kV du poste source", en: "Fed from primary substation 30 kV outgoing feeders" } },
        { domainCode: "D06", domainName: { fr: "Installations Basse Tension", en: "Low Voltage Installations" }, relationshipContext: { fr: "Origine de l'installation électrique générale BT (TGBT)", en: "Source origin of the entire low voltage installation (TGBT)" } },
        { domainCode: "D07", domainName: { fr: "Qualité de l'Énergie", en: "Power Quality" }, relationshipContext: { fr: "Comportement vis-à-vis des harmoniques et creux de tension", en: "Behavior under harmonic distortion and voltage sags" } }
      ]
    }
  }
};
