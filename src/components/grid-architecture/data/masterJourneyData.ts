// src/components/grid-architecture/data/masterJourneyData.ts
// EPEDE - Master Power-System Journey: 15-Stage Connected Sequence

import { MasterJourneyStage } from '../types';

export const MASTER_JOURNEY_STAGES: MasterJourneyStage[] = [
  {
    id: 'stage-01-source',
    order: 1,
    code: 'STG.01',
    title: { fr: 'Source Primaire d\'Énergie', en: 'Primary Energy Source' },
    subtitle: { fr: 'Retenue d\'eau, soleil, vent ou combustible', en: 'Water reservoir, sun, wind or fuel' },
    category: 'generation',
    voltageRange: 'N/A (Énergie Mécanique / Thermique)',
    voltageBand: 'LV',
    primaryEquipment: 'Retenue hydraulique, fleuve régulé ou rayonnement solaire',
    equipmentId: 'eq-hydro-songloulou-01',
    downstreamStageId: 'stage-02-plant',
    whyExists: {
      fr: 'Fournit le flux d\'énergie primaire brut indispensable pour alimenter le convertisseur cinétique ou thermodynamique.',
      en: 'Supplies the raw kinetic, thermal, or photon flow required to drive energy conversion.'
    },
    energyTransformation: {
      fr: 'Énergie potentielle de pesanteur (E = m·g·h) ou flux d\'irradiance (W/m²).',
      en: 'Gravitational potential energy (E = m·g·h) or irradiance flux (W/m²).'
    },
    lossMechanism: {
      fr: 'Pertes de charge hydrauliques dans les canaux et frottements de rugosité des galeries.',
      en: 'Hydraulic head losses through intake trash racks and penstock friction.'
    },
    physicalView: {
      description: {
        fr: 'Barrage-poids ou réservoir régulateur avec prise d\'eau, vannes de garde et dégrilleurs.',
        en: 'Gravity dam or regulating reservoir with intake structures, trash racks, and headgates.'
      },
      keyAssets: ['Barrage de retenue', 'Prise d\'eau', 'Dégrilleur motorisé', 'Cheminée d\'équilibre'],
      typicalFootprint: 'Plusieurs km² de retenue (ex. Lom Pangar 6 milliards de m³)',
      environment: { fr: 'Bassin fluvial naturel / Ensoleillement tropical', en: 'River basin corridor / Tropical irradiance' }
    },
    electricalView: {
      sldSymbol: 'Water Reservoir Icon / Potential Source',
      description: {
        fr: 'Origine du bilan énergétique amont ; aucune grandeur électrique à ce stade.',
        en: 'Upstream boundary of energy balance; purely mechanical/fluid medium.'
      },
      nominalParameters: { fr: 'Chute nette H = 37.5 m, Débit Q = 1100 m³/s', en: 'Net head H = 37.5 m, Discharge Q = 1100 m³/s' },
      connectionMode: 'Mécanique / Hydraulique'
    },
    functionalView: {
      protectionFunctions: ['Surveillance niveau d\'eau', 'Limiteur de crue', 'Coup de bélier'],
      controlAutomation: {
        fr: 'Télémesure de niveau de retenue et régulation du débit d\'étiage par vannes de fond.',
        en: 'Reservoir level telemetry and bottom outlet gate automated discharge.'
      },
      instrumentation: ['Limnimètres à ultrasons', 'Capteurs de pression hydrostatique', 'Piézomètres'],
      auxiliaryDependency: {
        fr: 'Alimentation 400 V secourue pour les treuils de vannes de déversoir.',
        en: 'Emergency 400 V diesel backup for spillway gate winches.'
      }
    },
    applicableStandards: ['CEI 60041 (Essais hydro)', 'Directives ICOLD / CIGB Barrages'],
    engineeringRole: { fr: 'Ingénieur Ouvrages Hydrauliques & Génie Civil', en: 'Hydraulic Structures & Civil Engineer' },
    cameroonReference: {
      location: 'Lom Pangar / Fleuve Sanaga',
      description: {
        fr: 'Réservoir régulateur de 6 milliards de m³ garantissant un débit d\'étiage > 1000 m³/s sur la Sanaga.',
        en: 'Regulating reservoir holding 6 billion m³ ensuring > 1000 m³/s dry-season flow on Sanaga.'
      }
    }
  },
  {
    id: 'stage-02-plant',
    order: 2,
    code: 'STG.02',
    title: { fr: 'Centrale de Production (Usine)', en: 'Power Generation Plant' },
    subtitle: { fr: 'Bâtiment usine et conversion mécanique en rotation', en: 'Powerhouse and mechanical rotation' },
    category: 'generation',
    voltageRange: 'Mécanique (Couple & Vitesse)',
    voltageBand: 'LV',
    primaryEquipment: 'Turbine hydraulique Francis / Pelton / Kaplan ou Turbine à combustion',
    equipmentId: 'eq-hydro-songloulou-01',
    upstreamStageId: 'stage-01-source',
    downstreamStageId: 'stage-03-generator',
    whyExists: {
      fr: 'Convertit l\'énergie fluide (eau sous pression) en énergie mécanique de rotation sur l\'arbre vertical.',
      en: 'Converts fluid energy into rotating shaft torque to drive the electric alternator.'
    },
    energyTransformation: {
      fr: 'Énergie cinétique et de pression de l\'eau convertie en puissance mécanique sur l\'arbre : P_mech = ρ·g·Q·H·η_turb.',
      en: 'Hydraulic kinetic and pressure energy converted into shaft mechanical torque.'
    },
    lossMechanism: {
      fr: 'Turbulences, frottements de disque et pertes volumétriques au labyrinthe de turbine (~5 à 8%).',
      en: 'Hydraulic turbulence, disc friction, and runner blade profile friction (~5 to 8%).'
    },
    physicalView: {
      description: {
        fr: 'Usine de pied de barrage abritant la bâche spirale, les directrices de vannage et la roue de turbine.',
        en: 'Powerhouse housing spiral casing, wicket gates distributor, and runner.'
      },
      keyAssets: ['Bâche spirale en acier', 'Directrices de vannage', 'Roue Francis', 'Aspirateur diffuseur'],
      typicalFootprint: 'Bâtiment usine de 180 m × 35 m',
      environment: { fr: 'Galerie usine ventilée avec ponts roulants lourds (150 t)', en: 'Ventilated machine hall with heavy overhead cranes (150 t)' }
    },
    electricalView: {
      sldSymbol: 'Turbine Mechanical Coupling Symbol',
      description: {
        fr: 'Liaison cinématique directe entre l\'arbre turbine et le rotor de l\'alternateur.',
        en: 'Direct kinematic shaft coupling between turbine and generator rotor.'
      },
      nominalParameters: { fr: 'Vitesse 125 tr/min, Débit unitaire 145 m³/s', en: 'Speed 125 rpm, Flow per unit 145 m³/s' },
      connectionMode: 'Accouplement mécanique rigide'
    },
    functionalView: {
      protectionFunctions: ['Survitesse (12)', 'Vibrations paliers', 'Température coussinets (38)'],
      controlAutomation: {
        fr: 'Régulateur oléopneumatique de vitesse commandant les servomoteurs de directrices.',
        en: 'Electro-hydraulic speed governor modulating guide vane servomotors.'
      },
      instrumentation: ['Sondes de vitesse à roues dentées', 'Capteurs de vibrations de palier', 'Sondes PT100'],
      auxiliaryDependency: {
        fr: 'Groupe motopompe oléopneumatique 160 bars pour commande du vannage.',
        en: '160 bar oil-pressure accumulator pumps for wicket gate actuation.'
      }
    },
    applicableStandards: ['CEI 60041', 'CEI 61362 (Régulateurs de vitesse)'],
    engineeringRole: { fr: 'Ingénieur Électromécanicien Turbines', en: 'Electromechanical Turbine Engineer' },
    cameroonReference: {
      location: 'Centrale de Songloulou (384 MW)',
      description: {
        fr: '8 turbines Francis à axe vertical de 48 MW tournant à 125 tr/min sous 37.5 m de chute.',
        en: '8 vertical Francis turbines of 48 MW operating at 125 rpm under 37.5 m head.'
      }
    }
  },
  {
    id: 'stage-03-generator',
    order: 3,
    code: 'STG.03',
    title: { fr: 'Alternateur Synchrone / Convertisseur', en: 'Synchronous Alternator / Inverter' },
    subtitle: { fr: 'Conversion électromécanique en tension alternative', en: 'Electromechanical AC generation' },
    category: 'generation',
    voltageRange: '11 kV à 20 kV AC',
    voltageBand: 'MV',
    primaryEquipment: 'Alternateur synchrone à pôles saillants avec excitatrice statique',
    equipmentId: 'eq-hydro-songloulou-01',
    upstreamStageId: 'stage-02-plant',
    downstreamStageId: 'stage-04-gsu',
    whyExists: {
      fr: 'Génère la tension triphasée alternative par induction électromagnétique selon la loi de Faraday.',
      en: 'Generates three-phase alternating electric current by electromagnetic induction.'
    },
    energyTransformation: {
      fr: 'Couple mécanique converti en puissance électrique triphasée : P = √3 · U · I · cos(φ).',
      en: 'Mechanical shaft power converted to 3-phase AC power: P = √3 · U · I · cos(φ).'
    },
    lossMechanism: {
      fr: 'Pertes Joule stator/rotor, pertes magnétiques dans les tôles d\'induit et frottement aérodynamique (~1.5 à 2%).',
      en: 'Stator/rotor copper losses, iron core hysteresis/eddy currents, and windage (~1.5 to 2%).'
    },
    physicalView: {
      description: {
        fr: 'Stator circulaire feuilleté de grand diamètre avec enroulement barres Roebel, et rotor à pôles bobinés.',
        en: 'Large-diameter laminated stator core with Roebel bars and salient-pole rotor.'
      },
      keyAssets: ['Stator feuilleté', 'Rotor à pôles saillants', 'Pont de diodes tournantes / thyristors', 'Aéroréfrigérants eau-air'],
      typicalFootprint: 'Diamètre stator ~8 m, Hauteur ~4 m, Masse 220 tonnes',
      environment: { fr: 'Puits d\'alternateur ventilé avec circuit d\'extinction CO2 incendie', en: 'Enclosed generator pit with CO2 fire suppression system' }
    },
    electricalView: {
      sldSymbol: 'Synchronous Generator (G) Symbol with Neutral Earthing',
      description: {
        fr: 'Source triphasée 11 kV couplée en étoile avec neutre relié à la terre via résistance ou transformateur de distribution.',
        en: '11 kV star-connected three-phase source with high-resistance grounded neutral.'
      },
      nominalParameters: { fr: '48 MW / 57.6 MVA, 11 kV, Cos φ = 0.85, 50 Hz', en: '48 MW / 57.6 MVA, 11 kV, Cos φ = 0.85, 50 Hz' },
      connectionMode: 'Gaines à barres blindées (Isolated Phase Bus - IPB)'
    },
    functionalView: {
      protectionFunctions: ['87G (Différentielle)', '40 (Perte excitation)', '46 (Déséquilibre)', '64R (Terre rotor)', '59N (Neutre stator)'],
      controlAutomation: {
        fr: 'Régulateur Automatique de Tension (AVR) pilotant le courant d\'excitation continu.',
        en: 'Automatic Voltage Regulator (AVR) controlling static excitation current.'
      },
      instrumentation: ['TC de neutre et de phase', 'TT de mesure tension stator', 'Sondes flux d\'entrefer'],
      auxiliaryDependency: {
        fr: 'Circuit de commande d\'excitation 110 V DC et réfrigération d\'huile de crapaudine.',
        en: '110 V DC excitation control circuits and thrust bearing oil cooling pumps.'
      }
    },
    applicableStandards: ['CEI 60034-1', 'IEEE C50.12 (Hydro generators)'],
    engineeringRole: { fr: 'Ingénieur Alternateurs & Machines Tournantes', en: 'Alternator & Rotating Machine Engineer' },
    cameroonReference: {
      location: 'Songloulou Groupe 1 (11 kV)',
      description: {
        fr: 'Alternateur 48 MW / 57.6 MVA générant sous 11 kV à 50 Hz, raccordé par gaine à barres.',
        en: '48 MW alternator generating at 11 kV, 50 Hz connected to GSU via isolated phase bus.'
      }
    }
  },
  {
    id: 'stage-04-gsu',
    order: 4,
    code: 'STG.04',
    title: { fr: 'Transformateur Élévateur (GSU)', en: 'Generator Step-Up (GSU) Transformer' },
    subtitle: { fr: 'Élévation de tension pour transport à très haut rendement', en: 'Voltage step-up for high-efficiency bulk transport' },
    category: 'substation',
    voltageRange: '11 kV / 225 kV',
    voltageBand: 'EHV',
    primaryEquipment: 'Transformateur de puissance triphasé immergé dans l\'huile minérale (ONAF/OFAF)',
    equipmentId: 'eq-trafo-gsu-01',
    upstreamStageId: 'stage-03-generator',
    downstreamStageId: 'stage-05-switchyard',
    whyExists: {
      fr: 'Élève la tension de 11 kV à 225 kV pour diviser le courant de ligne par 20.45 et réduire les pertes Joule par 418.',
      en: 'Steps up voltage from 11 kV to 225 kV to divide current by 20.45, slashing I²R Joule losses by a factor of 418.'
    },
    energyTransformation: {
      fr: 'Transformation électromagnétique par flux magnétique dans un circuit magnétique en tôles au silicium.',
      en: 'Electromagnetic induction across low-loss grain-oriented silicon steel core.'
    },
    lossMechanism: {
      fr: 'Pertes fer à vide (hystérésis + courants de Foucault) et pertes cuivre en charge (effet de peau et Joule, ~0.4%).',
      en: 'No-load core losses (hysteresis + eddy currents) and load copper winding losses (~0.4%).'
    },
    physicalView: {
      description: {
        fr: 'Cuve étanche en acier remplie d\'huile isolante avec radiateurs aéroréfrigérants, conservateur d\'huile et traversées céramiques/RIP.',
        en: 'Heavy steel tank with mineral oil, cooling radiator banks, conservator tank, and 225 kV RIP bushings.'
      },
      keyAssets: ['Cuve principale étanche', 'Radiateurs ONAF', 'Conservateur d\'huile', 'Traversées HTB 225 kV'],
      typicalFootprint: 'Plateforme extérieure bétonnée avec bac de rétention d\'huile (12 m × 8 m)',
      environment: { fr: 'Parc transformateur extérieur avec murs coupe-feu anti-explosion', en: 'Outdoor transformer bay with blast/fire-retardant concrete walls' }
    },
    electricalView: {
      sldSymbol: 'Two-Winding Transformer Symbol (YNd11)',
      description: {
        fr: 'Primaire triangle (11 kV) et secondaire étoile avec neutre mis à la terre directement (225 kV), déphasage 330° (YNd11).',
        en: 'Delta 11 kV primary and grounded-wye 225 kV secondary, 330° phase shift (YNd11).'
      },
      nominalParameters: { fr: '60 MVA, 11 kV / 225 kV, Ucc = 12%, Pertes totales ~240 kW', en: '60 MVA, 11 kV / 225 kV, Uk = 12%, Total losses ~240 kW' },
      connectionMode: 'Gaine à barres 11 kV en entrée → Câbles ou barres nues 225 kV en sortie'
    },
    functionalView: {
      protectionFunctions: ['87T (Différentielle transfo)', '49 (Image thermique)', 'Relais Buchholz', 'Capteur surpression'],
      controlAutomation: {
        fr: 'Démarrage automatique des groupes de ventilateurs selon la température de point chaud enroulement.',
        en: 'Automated cooling fan bank staging triggered by winding hot-spot fiber-optic sensors.'
      },
      instrumentation: ['Thermomètre à cadran', 'Niveau d\'huile magnétique', 'Sondes d\'analyse d\'hydrogène dissous (DGA)'],
      auxiliaryDependency: {
        fr: 'Alimentation 400 V AC pour les motopompes et ventilateurs de refroidissement.',
        en: '400 V AC auxiliary feed powering oil circulation pumps and radiator fan stages.'
      }
    },
    applicableStandards: ['CEI 60076-1', 'CEI 60076-2 (Échauffement)', 'IEEE C57.12'],
    engineeringRole: { fr: 'Ingénieur Transformateurs de Puissance', en: 'Power Transformer Engineer' },
    cameroonReference: {
      location: 'Songloulou GSU Bloc 1',
      description: {
        fr: 'Transformateur élévateur 11 kV / 225 kV de 60 MVA évacuant le groupe 1 vers le poste de départ.',
        en: '60 MVA 11/225 kV step-up transformer feeding unit 1 into the 225 kV switchyard.'
      }
    }
  },
  {
    id: 'stage-05-switchyard',
    order: 5,
    code: 'STG.05',
    title: { fr: 'Poste d\'Évacuation / Travée Départ HTB', en: 'Generating Switchyard / HV Outgoing Bay' },
    subtitle: { fr: 'Coupure, aiguillage, protection et injection réseau', en: 'HV switching, protection and line injection' },
    category: 'substation',
    voltageRange: '225 kV AC',
    voltageBand: 'EHV',
    primaryEquipment: 'Disjoncteur SF6 225 kV, sectionneurs rotatifs, réducteurs de mesure et parafoudres',
    equipmentId: 'eq-cb-225k-01',
    upstreamStageId: 'stage-04-gsu',
    downstreamStageId: 'stage-06-transmission',
    whyExists: {
      fr: 'Permet la manœuvre de couplage au réseau et l\'interruption instantanée (< 60 ms) des courants de court-circuit (jusqu\'à 40 kA).',
      en: 'Enables grid synchronization and ultra-fast (< 60 ms) interruption of short-circuit faults up to 40 kA.'
    },
    energyTransformation: {
      fr: 'Transit d\'énergie électrique sans transformation de tension ; aiguillage de puissance.',
      en: 'Direct power routing and switching at 225 kV without voltage change.'
    },
    lossMechanism: {
      fr: 'Pertes par effet Joule dans les résistances de contact des disjoncteurs et des barres rigides (très faibles, < 0.02%).',
      en: 'Minor contact resistance and busbar Joule losses (< 0.02%).'
    },
    physicalView: {
      description: {
        fr: 'Poste ouvert classique (AIS) sur portiques métalliques galvanisés avec isolateurs colonnes en verre/composite.',
        en: 'Air-Insulated Switchyard (AIS) with steel gantry structures, post insulators, and overhead rigid tubular busbars.'
      },
      keyAssets: ['Disjoncteur SF6 à autosoufflage', 'Sectionneurs rotatifs à commande motorisée', 'TC/TT combinés', 'Parafoudres ZnO'],
      typicalFootprint: 'Emprise de travée 225 kV ~30 m × 15 m',
      environment: { fr: 'Extérieur, sol recouvert de 10 cm de gravier granitique isolant', en: 'Outdoor crushed gravel yard with perimeter grounding grid' }
    },
    electricalView: {
      sldSymbol: 'Line Bay SLD with CB, Disconnectors, CT, VT, and Earthing Switch',
      description: {
        fr: 'Schéma unifilaire à double jeu de barres ou simple jeu de barres avec sectionneur d\'aiguillage et sectionneur de ligne.',
        en: 'Double-busbar or single-bus line bay with line disconnector and maintenance earthing switches.'
      },
      nominalParameters: { fr: '225 kV, Courant assigné 2000 A, Pouvoir de coupure 40 kA / 1s', en: '225 kV, Rated current 2000 A, Breaking capacity 40 kA / 1s' },
      connectionMode: 'Tubes aluminium rigides ou conducteurs flexibles suspendus'
    },
    functionalView: {
      protectionFunctions: ['21 (Distance)', '87L (Différentielle de ligne)', '50/51 (Surintensité)', '50BF (Défaillance disjoncteur)'],
      controlAutomation: {
        fr: 'Automate de tranche de travée (Bay Controller) avec verrouillages d\'exploitation anti-fausse manœuvre.',
        en: 'Bay Controller Unit (BCU) enforcing electrical interlocking rules preventing disconnector opening under load.'
      },
      instrumentation: ['TC classe 0.2S (mesure) et 5P20 (protection)', 'TT capacitifs de ligne', 'Manomètres SF6'],
      auxiliaryDependency: {
        fr: 'Double circuit de déclenchement 110 V DC alimenté par deux bancs de batteries séparés.',
        en: 'Dual 110 V DC trip coils powered from redundant station battery sets.'
      }
    },
    applicableStandards: ['CEI 62271-100', 'CEI 62271-102', 'CEI 61850'],
    engineeringRole: { fr: 'Ingénieur Postes Haute Tension', en: 'High Voltage Substation Engineer' },
    cameroonReference: {
      location: 'Poste de départ Songloulou 225 kV',
      description: {
        fr: 'Poste 225 kV évacuant la puissance vers Mangombé (Édéa) et Logbaba (Douala).',
        en: '225 kV switchyard dispatching power toward Mangombé and Logbaba substations.'
      }
    }
  },
  {
    id: 'stage-06-transmission',
    order: 6,
    code: 'STG.06',
    title: { fr: 'Ligne de Transport Haute Tension (Corridor 225 kV)', en: 'HV Transmission Line (225 kV Corridor)' },
    subtitle: { fr: 'Transit d\'énergie en vrac sur de grandes distances', en: 'Bulk power wheeling over long geographic spans' },
    category: 'transmission',
    voltageRange: '225 kV triphasé 50 Hz',
    voltageBand: 'EHV',
    primaryEquipment: 'Pylônes treillis tétrapodes en acier galvanisé, conducteurs Almélec (AAAC) et câble de garde OPGW',
    equipmentId: 'eq-cb-225k-01',
    upstreamStageId: 'stage-05-switchyard',
    downstreamStageId: 'stage-07-receiving-sub',
    whyExists: {
      fr: 'Transporte de gros blocs de puissance (200 à 500 MW) sur des dizaines ou centaines de kilomètres avec un rendement > 97%.',
      en: 'Transmits large power blocks (200 to 500 MW) over hundreds of kilometers with > 97% transmission efficiency.'
    },
    energyTransformation: {
      fr: 'Propagation d\'onde électromagnétique guidée à la vitesse de la lumière (~300 000 km/s).',
      en: 'Guided electromagnetic wave propagation at near-light speed along conductors.'
    },
    lossMechanism: {
      fr: 'Pertes Joule proportionnelles au carré du courant (P_loss = 3·R·I²) et pertes par effet couronne en atmosphère humide.',
      en: 'Joule losses proportional to current squared (P_loss = 3·R·I²) and corona losses in humid air.'
    },
    physicalView: {
      description: {
        fr: 'Pylônes treillis tétrapodes de 35 à 45 m de hauteur avec portées de 350 à 450 m, franchissant forêts et fleuves.',
        en: 'Self-supporting steel lattice towers (35-45 m height) spanning 350-450 m across forests and river crossings.'
      },
      keyAssets: ['Pylône d\'alignement / d\'angle', 'Faisceau de conducteurs Aster 570', 'Chaînes d\'isolateurs en verre', 'Câble de garde OPGW'],
      typicalFootprint: 'Couloir de servitude déboisé de 40 m de largeur',
      environment: { fr: 'Forêt équatoriale dense avec très forte densité de foudre (Nk > 100 jours/an)', en: 'Equatorial forest corridor with intense lightning keraunic level (Nk > 100 days/yr)' }
    },
    electricalView: {
      sldSymbol: 'Transmission Line Pi-Model Symbol (R, L, C)',
      description: {
        fr: 'Modèle en Pi à constantes réparties : résistance R = 0.058 Ω/km, réactance X = 0.31 Ω/km, susceptance B = 3.6 µS/km.',
        en: 'Nominal Pi-equivalent model: R = 0.058 Ω/km, X = 0.31 Ω/km, B = 3.6 µS/km.'
      },
      nominalParameters: { fr: '225 kV, Puissance naturelle P_SIL = 133 MW, Capacité thermique ~280 MVA', en: '225 kV, SIL = 133 MW, Thermal rating ~280 MVA' },
      connectionMode: 'Conducteurs aériens nus en alliage Almélec'
    },
    functionalView: {
      protectionFunctions: ['21/21N (Distance quadrilatère/mho)', '87L (Différentielle de ligne sur OPGW)', '67N (Terre directionnelle)'],
      controlAutomation: {
        fr: 'Réenclencheur automatique mono/tripolaire ultra-rapide (0.3 s à 1.0 s) pour éliminer les défauts de foudre fugitifs.',
        en: 'Single-phase / three-phase auto-reclosing (0.3 s dead-time) clearing transient lightning flashes without outage.'
      },
      instrumentation: ['Oscilloperturbographe numérique de ligne', 'Localisateur de défaut haute précision'],
      auxiliaryDependency: {
        fr: 'Communication optique via 48 fibres du câble de garde OPGW reliant les relais de ligne des deux extrémités.',
        en: 'Direct teleprotection signaling over 48 single-mode fiber cores inside the OPGW.'
      }
    },
    applicableStandards: ['CEI 60826 (Calcul mécanique lignes)', 'CEI 61089 (Conducteurs)', 'Code de Réseau SONATREL'],
    engineeringRole: { fr: 'Ingénieur Lignes Aériennes de Transport', en: 'Overhead Transmission Line Engineer' },
    cameroonReference: {
      location: 'Dorsale 225 kV Songloulou - Mangombé - Oyomabang',
      description: {
        fr: 'Liaison 225 kV évacuant la production Sanaga vers les grands centres de charge de Douala et Yaoundé.',
        en: '225 kV transmission backbone wheeling Sanaga hydro power into Douala and Yaoundé load centers.'
      }
    }
  },
  {
    id: 'stage-07-receiving-sub',
    order: 7,
    code: 'STG.07',
    title: { fr: 'Poste de Transport Source / Réception', en: 'Transmission / Bulk Receiving Substation' },
    subtitle: { fr: 'Nœud d\'interconnexion et aiguillage 225 kV', en: 'Interconnection node and 225 kV busbar split' },
    category: 'substation',
    voltageRange: '225 kV / 90 kV',
    voltageBand: 'EHV',
    primaryEquipment: 'Jeux de barres 225 kV, travées d\'arrivée ligne, disjoncteurs et transformateurs de mesure',
    equipmentId: 'eq-cb-225k-01',
    upstreamStageId: 'stage-06-transmission',
    downstreamStageId: 'stage-08-trafo-stepdown',
    whyExists: {
      fr: 'Réceptionne l\'énergie haute tension, interconnecte plusieurs lignes de transport et alimente les transformateurs réducteurs.',
      en: 'Receives bulk transmission power, meshes multiple regional corridors, and feeds local step-down power transformers.'
    },
    energyTransformation: {
      fr: 'Répartition et aiguillage des transits de puissance active et réactive aux nœuds du réseau.',
      en: 'Nodal power routing and reactive power flow distribution.'
    },
    lossMechanism: {
      fr: 'Pertes mineures par effet couronne et pertes Joule dans les conducteurs de jeux de barres.',
      en: 'Minor busbar conductor heating and corona losses.'
    },
    physicalView: {
      description: {
        fr: 'Poste ouvert AIS ou blindé compact GIS (SF6) ceinturé de clôtures de sécurité et maillage de terre en cuivre.',
        en: 'Open AIS yard or compact GIS installation surrounded by security perimeter fencing and copper earth mesh.'
      },
      keyAssets: ['Jeux de barres aluminium', 'Sectionneurs de barres', 'Disjoncteurs 225 kV', 'Bâtiment de commande de poste'],
      typicalFootprint: 'Emprise de 200 m × 120 m pour un poste AIS complet',
      environment: { fr: 'Zone périurbaine ou carrefour de transport électrique', en: 'Suburban perimeter / transmission crossroads' }
    },
    electricalView: {
      sldSymbol: 'Substation Busbar Node Symbol with Multiple Bays',
      description: {
        fr: 'Configuration double jeu de barres avec disjoncteur de couplage permettant l\'exploitation sélective sans coupure.',
        en: 'Double-busbar topology with bus-coupler bay enabling maintenance without supply interruption.'
      },
      nominalParameters: { fr: '225 kV, Tenue aux chocs de foudre BIL = 1050 kV, Isc = 31.5 kA', en: '225 kV, BIL = 1050 kV, Short-circuit rating 31.5 kA' },
      connectionMode: 'Barres tubulaires rigides alu ou câbles souterrains XLPE'
    },
    functionalView: {
      protectionFunctions: ['87B (Différentielle de barres)', '50BF (Défaillance disjoncteur)', '27/59 (Contrôle tension)'],
      controlAutomation: {
        fr: 'Système d\'Automatisation de Poste (SAS) selon CEI 61850 avec bus de station MMS et déclenchements rapides GOOSE.',
        en: 'Substation Automation System (SAS) per IEC 61850 using MMS station bus and high-speed GOOSE trip signals.'
      },
      instrumentation: ['TC classe mesure 0.2S pour comptage transactionnel', 'TT de barres', 'Synchrocoupleur'],
      auxiliaryDependency: {
        fr: 'Transformateur des services auxiliaires (TSA) 30 kV / 400 V de 250 kVA secouru par groupe diesel 160 kVA.',
        en: 'Station auxiliary transformer 30 kV / 400 V (250 kVA) backed by 160 kVA emergency diesel genset.'
      }
    },
    applicableStandards: ['CEI 61936-1', 'CEI 61850', 'IEEE 80 (Mise à la terre)'],
    engineeringRole: { fr: 'Ingénieur Exploitation & Postes de Transport', en: 'Substation Operations & Design Engineer' },
    cameroonReference: {
      location: 'Poste 225/90/30 kV d\'Oyomabang (Yaoundé) / Bekoko (Douala)',
      description: {
        fr: 'Poste nodal stratégique alimentant la capitale Yaoundé depuis les centrales de la Sanaga.',
        en: 'Strategic bulk node powering Yaoundé metropolitan area from Sanaga hydro plants.'
      }
    }
  },
  {
    id: 'stage-08-trafo-stepdown',
    order: 8,
    code: 'STG.08',
    title: { fr: 'Transformateur de Puissance Abaisseur (HV/MV)', en: 'HV/MV Substation Power Transformer' },
    subtitle: { fr: 'Abaissement de 225 kV vers la Moyenne Tension (30 kV)', en: 'Stepping down from 225 kV to Medium Voltage (30 kV)' },
    category: 'substation',
    voltageRange: '225 kV / 30 kV ou 90 kV / 15 kV',
    voltageBand: 'HV',
    primaryEquipment: 'Transformateur de puissance abaisseur 225/30 kV 63 MVA avec régleur en charge (OLTC)',
    equipmentId: 'eq-trafo-main-30',
    upstreamStageId: 'stage-07-receiving-sub',
    downstreamStageId: 'stage-09-mv-switchgear',
    whyExists: {
      fr: 'Adapte la haute tension de transport au niveau de moyenne tension (30 kV au Cameroun) adapté à la distribution urbaine.',
      en: 'Converts high transmission voltages down to medium-voltage levels (30 kV in Cameroon) suitable for regional distribution.'
    },
    energyTransformation: {
      fr: 'Transformation électromagnétique abaisseuse à fréquence constante (50 Hz).',
      en: 'Electromagnetic step-down transformation at constant 50 Hz frequency.'
    },
    lossMechanism: {
      fr: 'Pertes à vide dans le noyau ferromagnétique et pertes Joule dans les bobinages cuivre/aluminium (~0.45%).',
      en: 'No-load magnetic core losses and copper winding I²R load losses (~0.45%).'
    },
    physicalView: {
      description: {
        fr: 'Grande cuve étanche sous bac de rétention d\'huile avec régleur en charge sous vide et conservateur d\'huile.',
        en: 'Large oil-filled steel tank with on-load vacuum tap changer, oil conservator, and ONAF cooling radiators.'
      },
      keyAssets: ['Cuve principale et conservateur', 'Régleur en charge (OLTC)', 'Traversées 225 kV et 30 kV', 'Résistance de neutre 30 kV'],
      typicalFootprint: 'Plateforme extérieure avec pare-feu (14 m × 9 m, masse ~95 tonnes)',
      environment: { fr: 'Parc transformateur avec dalle coupe-feu et fosse étanche pour rétention d\'huile', en: 'Transformer pad with fire walls and oil retention sump' }
    },
    electricalView: {
      sldSymbol: 'Two-Winding Power Transformer Symbol (YNd11 or YNyn0 with OLTC)',
      description: {
        fr: 'Primaire 225 kV étoile neutre sorti, secondaire 30 kV triangle ou étoile avec mise à la terre par résistance de neutre.',
        en: 'Primary 225 kV grounded-wye, secondary 30 kV delta or wye with neutral grounding resistor (NER).'
      },
      nominalParameters: { fr: '63 MVA, 225 kV / 30 kV, Ucc = 12.5%, Régleur ±10% en 17 plots', en: '63 MVA, 225 kV / 30 kV, Uk = 12.5%, On-load tap changer ±10% in 17 steps' },
      connectionMode: 'Arrivée aérienne 225 kV → Sortie câbles souterrains 30 kV XLPE vers salle MT'
    },
    functionalView: {
      protectionFunctions: ['87T (Différentielle transfo)', '50/51 & 51N (Surintensité & Terre)', '49 (Thermique)', '63 (Buchholz / Pression)'],
      controlAutomation: {
        fr: 'Régulateur Automatique de Prises (AVR / TAPCON) maintenant la tension MT à 30 kV ± 1.5% malgré les variations de charge.',
        en: 'Automatic Voltage Regulating relay (OLTC controller) holding 30 kV bus voltage within ± 1.5% deadband.'
      },
      instrumentation: ['Indicateur de position de plot', 'Sondes PT100 huile/enroulement', 'Manomètre Buchholz'],
      auxiliaryDependency: {
        fr: 'Alimentation moteur du régleur de prises (400 V AC) et circuits de sécurité 110 V DC.',
        en: '400 V AC tap-changer motor drive supply and 110 V DC fail-safe trip circuits.'
      }
    },
    applicableStandards: ['CEI 60076-1', 'CEI 60214-1 (Régleurs en charge)'],
    engineeringRole: { fr: 'Ingénieur d\'Études Transformateurs & Postes', en: 'Transformer & Substation Design Engineer' },
    cameroonReference: {
      location: 'Poste Oyomabang TR2 (63 MVA)',
      description: {
        fr: 'Transformateur abaisseur 225/30 kV 63 MVA alimentant les départs MT d\'Eneo pour la ville de Yaoundé.',
        en: '63 MVA 225/30 kV step-down transformer feeding Eneo\'s medium-voltage distribution network for Yaoundé.'
      }
    }
  },
  {
    id: 'stage-09-mv-switchgear',
    order: 9,
    code: 'STG.09',
    title: { fr: 'Tableau de Distribution Moyenne Tension (MT 30 kV)', en: 'Medium-Voltage Switchgear (30 kV Busbar)' },
    subtitle: { fr: 'Jeux de barres et cellules de départs décentralisés', en: 'MV switchgear busbars and feeder breakers' },
    category: 'distribution',
    voltageRange: '30 kV AC (Standard Cameroun) ou 20 kV / 15 kV',
    voltageBand: 'MV',
    primaryEquipment: 'Cellules métalliques modulaires MT avec disjoncteurs dans le vide ou SF6',
    equipmentId: 'eq-cell-mv-30k-01',
    upstreamStageId: 'stage-08-trafo-stepdown',
    downstreamStageId: 'stage-10-mv-feeders',
    whyExists: {
      fr: 'Répartit l\'énergie en moyenne tension sur une dizaine de départs radiaux ou en boucle alimentant les quartiers et zones industrielles.',
      en: 'Distributes MV power across 8-14 feeder lines heading into municipal and industrial districts.'
    },
    energyTransformation: {
      fr: 'Sectionnement et aiguillage de circuits moyenne tension sous enveloppe métallique blindée.',
      en: 'Modular circuit switching and protection under metal-clad enclosure.'
    },
    lossMechanism: {
      fr: 'Pertes Joule minimes dans les jeux de barres en cuivre et les doigts de contact des disjoncteurs.',
      en: 'Very low contact resistance heating inside circuit breaker tulip contacts.'
    },
    physicalView: {
      description: {
        fr: 'Rame de cellules blindées juxtaposées en salle de commande intérieure (Air-Insulated Switchgear AIS).',
        en: 'Indoor row of metal-clad modular switchgear cubicles equipped with arc-deflector chimneys.'
      },
      keyAssets: ['Cellule arrivée transfo 30 kV', 'Cellules départs lignes', 'Cellule couplage barres', 'Cellule mesure TT'],
      typicalFootprint: 'Salle MT climatisée de 18 m × 6 m',
      environment: { fr: 'Bâtiment fermé avec plancher technique surélevé pour cheminement des câbles', en: 'Indoor switchroom with raised false flooring for MV cable trenches' }
    },
    electricalView: {
      sldSymbol: 'MV Switchgear Line-up SLD with Vacuum Circuit Breakers',
      description: {
        fr: 'Jeu de barres triphasé 30 kV en cuivre avec disjoncteurs débrochables et sectionneurs de terre aval.',
        en: '30 kV copper busbar line with drawout vacuum circuit breakers and downstream earthing switches.'
      },
      nominalParameters: { fr: '30 kV (assignée 36 kV), Jeu de barres 2000 A, Pouvoir de coupure 20 kA / 1s', en: '30 kV (rated 36 kV), Busbar 2000 A, Breaking capacity 20 kA / 1s' },
      connectionMode: 'Câbles unipolaires XLPE 30 kV avec boîtes d\'extrémité embrochables'
    },
    functionalView: {
      protectionFunctions: ['50/51 (Surintensité de phase)', '50N/51N (Défaut à la terre)', '67/67N (Directionnelle terre)', 'Détection arc interne'],
      controlAutomation: {
        fr: 'Relais numériques multifonctions (ex. Sepam, MiCOM, SEL) avec automatisme de réenclenchement rapide sur les départs aériens.',
        en: 'Digital multifunctional feeder relays with multi-shot auto-reclosing for overhead lines.'
      },
      instrumentation: ['TC tore pour mesure courant homopolaire', 'Indicateurs de présence de tension à LED', 'Compteurs d\'énergie'],
      auxiliaryDependency: {
        fr: 'Alimentation auxiliaire 110 V DC ou 48 V DC pour bobines de déclenchement et motorisations.',
        en: '110 V DC or 48 V DC station battery feed powering trip coils and spring charging motors.'
      }
    },
    applicableStandards: ['CEI 62271-200 (Appareillage sous enveloppe métallique MT)'],
    engineeringRole: { fr: 'Ingénieur Distribution Moyenne Tension', en: 'Medium-Voltage Distribution Engineer' },
    cameroonReference: {
      location: 'Salle MT Poste d\'Oyomabang',
      description: {
        fr: 'Rame 30 kV alimentant les départs Yaoundé Centre, Biyem-Assi, Mvog-Mbi et Ngoa-Ekellé.',
        en: '30 kV switchboard feeding urban feeders toward Yaoundé commercial and residential districts.'
      }
    }
  },
  {
    id: 'stage-10-mv-feeders',
    order: 10,
    code: 'STG.10',
    title: { fr: 'Réseau de Distribution Moyenne Tension (30 kV)', en: 'Medium-Voltage Distribution Feeders' },
    subtitle: { fr: 'Artères aériennes et câbles souterrains urbains', en: 'Overhead pole routes and underground urban cables' },
    category: 'distribution',
    voltageRange: '30 kV triphasé',
    voltageBand: 'MV',
    primaryEquipment: 'Lignes aériennes sur poteaux béton/bois (conducteurs Almélec) et câbles souterrains XLPE',
    equipmentId: 'eq-cell-mv-30k-01',
    upstreamStageId: 'stage-09-mv-switchgear',
    downstreamStageId: 'stage-11-dist-substation',
    whyExists: {
      fr: 'Achemine l\'énergie moyenne tension depuis le poste source vers les centaines de postes MT/BT disséminés dans l\'agglomération.',
      en: 'Conveys MV power from bulk substations to hundreds of localized distribution substations throughout the community.'
    },
    energyTransformation: {
      fr: 'Transit d\'énergie électrique moyenne tension (rayons de 5 à 40 km).',
      en: 'Power delivery over medium-voltage spans (5 to 40 km reach).'
    },
    lossMechanism: {
      fr: 'Pertes Joule dans les conducteurs (P_loss = 3·R·I²), représentant environ 4 à 8% des pertes totales du réseau de distribution.',
      en: 'Conductor I²R losses representing 4 to 8% of total end-to-end grid losses.'
    },
    physicalView: {
      description: {
        fr: 'Poteaux en béton armé centrifugé ou bois traités le long des voiries avec isolateurs rigides ou suspendus, et câbles souterrains sous fourreaux.',
        en: 'Spun concrete poles along public roadways with pin/suspension insulators, plus underground XLPE cable ducts.'
      },
      keyAssets: ['Poteaux béton 12 m', 'Conducteurs nus ou gainés', 'Interrupteurs aériens télécommandés (IAT)', 'Câbles XLPE'],
      typicalFootprint: 'Réseaux maillés ou arborescents s\'étendant sur des dizaines de kilomètres',
      environment: { fr: 'Voies urbaines denses, zones périurbaines et axes ruraux', en: 'Urban road right-of-ways and rural radial corridors' }
    },
    electricalView: {
      sldSymbol: 'Distribution Feeder Symbol with In-Line Disconnect Switches',
      description: {
        fr: 'Schéma radial avec points de coupure normalement ouverts (NO) permettant le bouclage de secours en cas d\'avarie.',
        en: 'Radial tree layout with Normally Open (NO) tie-points for emergency loop reconfiguration.'
      },
      nominalParameters: { fr: '30 kV, Capacité thermique 150 à 400 A (8 à 20 MVA par départ)', en: '30 kV, Feeder capacity 150 to 400 A (8 to 20 MVA per feeder)' },
      connectionMode: 'Aérien nu ou câble souterrain 3×150 mm² Al XLPE'
    },
    functionalView: {
      protectionFunctions: ['50/51 (Surintensité)', '50N/51N (Terre résistante)', 'Détecteurs de passage de défaut (DPD)'],
      controlAutomation: {
        fr: 'Interrupteurs aériens télécommandés (IAT) communicant en GPRS/4G avec le dispatching distribution pour réisolement rapide de tronçon en défaut.',
        en: 'Remote-controlled pole-top disconnectors (RTU over 4G) isolating faulted segments within 2 minutes.'
      },
      instrumentation: ['Indicateurs lumineux de passage de défaut', 'Sondes de tension capacitive'],
      auxiliaryDependency: {
        fr: 'Coffret de commande IAT alimenté par panneau solaire photovoltaïque et batterie 24 V étanche.',
        en: 'Pole-top actuator powered by small 50 W solar panel with 24 V sealed battery backup.'
      }
    },
    applicableStandards: ['CEI 60287 (Dimensionnement câbles)', 'NF C 11-201 (Réseaux de distribution)'],
    engineeringRole: { fr: 'Ingénieur Exploitation Réseau Distribution', en: 'Distribution Network Operations Engineer' },
    cameroonReference: {
      location: 'Départ 30 kV Biyem-Assi (Yaoundé)',
      description: {
        fr: 'Départ mixte aéro-souterrain 30 kV alimentant plus de 45 postes MT/BT de quartier.',
        en: 'Hybrid overhead/underground 30 kV feeder serving > 45 neighborhood distribution stations.'
      }
    }
  },
  {
    id: 'stage-11-dist-substation',
    order: 11,
    code: 'STG.11',
    title: { fr: 'Poste de Transformation de Quartier (Poste MT/BT)', en: 'Distribution Substation / Ring Main Unit (RMU)' },
    subtitle: { fr: 'Poste cabine ou sur poteau (H61) avec tableau RMU', en: 'Cabin substation or pole-mounted transformer with RMU' },
    category: 'distribution',
    voltageRange: '30 kV / 400 V',
    voltageBand: 'MV',
    primaryEquipment: 'Tableau modulaire compact Ring Main Unit (RMU) et disjoncteur ou interrupteur-fusibles',
    equipmentId: 'eq-trafo-hta-01',
    upstreamStageId: 'stage-10-mv-feeders',
    downstreamStageId: 'stage-12-mv-lv-trafo',
    whyExists: {
      fr: 'Assure le piquage sur la boucle moyenne tension et la protection du transformateur de distribution abaisseur.',
      en: 'Provides ring-in, ring-out switching and fused protection for the localized step-down transformer.'
    },
    energyTransformation: {
      fr: 'Coupure et aiguillage en boucle fermée / ouverte en moyenne tension.',
      en: 'Sectionalizing and ring reconfiguration at medium voltage.'
    },
    lossMechanism: {
      fr: 'Pertes de contact négligeables dans les cuves compactes étanches sous SF6 ou isolées dans l\'air.',
      en: 'Negligible contact resistance heating inside sealed tank switchgear.'
    },
    physicalView: {
      description: {
        fr: 'Poste compact préfabriqué en béton en pied d\'immeuble ou poste aérien perché sur poteau (type H61 jusqu\'à 160 kVA).',
        en: 'Prefabricated kiosk cabin substation or pole-top H61 platform (up to 160 kVA).'
      },
      keyAssets: ['Tableau RMU compact (2 interrupteurs boucle + 1 combiné protection transfo)', 'Parafoudres MT'],
      typicalFootprint: 'Kiosque béton de 3.5 m × 2.2 m ou monté directement sur poteau',
      environment: { fr: 'Trottoirs urbains, abords de résidences ou voiries publiques', en: 'Urban sidewalks, residential blocks or commercial courtyards' }
    },
    electricalView: {
      sldSymbol: 'Ring Main Unit (RMU) SLD Symbol with Fuse/Breaker T-Off',
      description: {
        fr: 'Configuration standard 2I+1P (2 arrivées interrupteurs charge pour la boucle + 1 départ protégé par fusibles ou disjoncteur vers transfo).',
        en: 'Standard 2I+1P RMU configuration (2 ring-switch bays + 1 transformer protection bay).'
      },
      nominalParameters: { fr: 'Tension assignée 36 kV, Courant barres 630 A, Pouvoir de fermeture 16 kA', en: 'Rated 36 kV, Bus current 630 A, Making capacity 16 kA' },
      connectionMode: 'Connecteurs embrochables étanches coudés ou droits'
    },
    functionalView: {
      protectionFunctions: ['Fusibles limiteurs MT (ex. Solefuse 36 kV 16 A / 25 A) ou relais autonome VIP', 'Sectionnement terre'],
      controlAutomation: {
        fr: 'Déclencheur direct par percuteur de fusible ou relais électronique auto-alimenté par les tores de courant.',
        en: 'Direct striker-pin fuse tripping or self-powered electronic trip unit.'
      },
      instrumentation: ['Témoins lumineux de présence de tension VPIS', 'Manomètre d\'état SF6'],
      auxiliaryDependency: {
        fr: 'Fonctionne sans alimentation auxiliaire (relais auto-alimenté sur courant de défaut).',
        en: 'Self-sufficient operation (trip energy derived directly from fault current).'
      }
    },
    applicableStandards: ['CEI 62271-200', 'NF C 13-100 (Postes de livraison MT/BT)'],
    engineeringRole: { fr: 'Ingénieur d\'Études Postes de Distribution', en: 'Distribution Substation Engineer' },
    cameroonReference: {
      location: 'Poste Cabine N°14 Quartier Bastos (Yaoundé)',
      description: {
        fr: 'Poste préfabriqué 30 kV / 400 V alimentant le secteur résidentiel et diplomatique.',
        en: 'Prefabricated distribution kiosk supplying Bastos residential and diplomatic quarter.'
      }
    }
  },
  {
    id: 'stage-12-mv-lv-trafo',
    order: 12,
    code: 'STG.12',
    title: { fr: 'Transformateur de Distribution MT/BT', en: 'MV/LV Distribution Transformer' },
    subtitle: { fr: 'Abaissement final vers 400 V triphasé / 230 V monophasé', en: 'Final step-down to 400 V three-phase / 230 V single-phase' },
    category: 'distribution',
    voltageRange: '30 kV / 400 V - 230 V',
    voltageBand: 'LV',
    primaryEquipment: 'Transformateur triphasé immergé dans l\'huile minérale ou sec enrobé (Dyn11)',
    equipmentId: 'eq-trafo-hta-01',
    upstreamStageId: 'stage-11-dist-substation',
    downstreamStageId: 'stage-13-lv-network',
    whyExists: {
      fr: 'Délivre la tension d\'usage sécurisée (400 V entre phases, 230 V entre phase et neutre) directement utilisable par les usagers finals.',
      en: 'Converts medium voltage down to standard user-safe voltages (400 V line-to-line, 230 V line-to-neutral).'
    },
    energyTransformation: {
      fr: 'Transformation électromagnétique 30 000 V → 400 V avec isolation galvanique totale.',
      en: 'Electromagnetic step-down transformation with full galvanic isolation.'
    },
    lossMechanism: {
      fr: 'Pertes fer constantes à vide (~0.2%) et pertes cuivre à pleine charge (~1.1% selon classe d\'éco-conception).',
      en: 'Continuous core iron losses (~0.2%) and winding copper losses under load (~1.1%).'
    },
    physicalView: {
      description: {
        fr: 'Cuve étanche à remplissage intégral avec ailettes de refroidissement plissées, ou transformateur sec enrobé résine pour intérieur.',
        en: 'Hermetically sealed tank with corrugated cooling fins, or cast-resin dry-type for indoor basements.'
      },
      keyAssets: ['Cuve à ailettes ondulées', 'Traversées porcelaine/enfichables MT', 'Passe-barres BT cuivre', 'Relais DGPT2'],
      typicalFootprint: 'Encombrement ~1.8 m × 1.2 m × 1.6 m, Masse ~2400 kg',
      environment: { fr: 'Local ventilé ou cabine préfabriquée avec bac de rétention d\'huile', en: 'Ventilated substation chamber or outdoor kiosk pad' }
    },
    electricalView: {
      sldSymbol: 'Two-Winding Delta-Wye Grounded Transformer (Dyn11)',
      description: {
        fr: 'Primaire 30 kV en triangle (D) et secondaire 400 V en étoile avec neutre sorti directement mis à la terre (yn11).',
        en: 'Delta 30 kV primary, grounded star 400 V secondary providing accessible neutral line (Dyn11).'
      },
      nominalParameters: { fr: '630 kVA, 30 kV / 400 V, Inom BT = 909 A, Ucc = 4.0%, Rendement ~98.6%', en: '630 kVA, 30 kV / 400 V, Rated LV current 909 A, Uk = 4.0%, Efficiency ~98.6%' },
      connectionMode: 'Câbles MT en amont → Jeu de barres plates cuivre BT en aval'
    },
    functionalView: {
      protectionFunctions: ['DGPT2 (Gaz, Pression, Température 2 seuils)', 'Protection de neutre terre', 'Fusibles HPC ou disjoncteur général BT'],
      controlAutomation: {
        fr: 'Commutateur de prises hors tension (±2.5%, ±5%) réglable manuellement lors de la mise en service.',
        en: 'Off-circuit manual tap changer (±2.5%, ±5%) adjusted during commissioning for local feeder length.'
      },
      instrumentation: ['Thermomètre à cadran plongeur', 'Niveau d\'huile mécanique'],
      auxiliaryDependency: {
        fr: 'Totalement passif et autonome (refroidissement naturel ONAN).',
        en: 'Totally passive and self-cooled (natural oil convection ONAN).'
      }
    },
    applicableStandards: ['CEI 60076-1', 'EN 50588-1 (Éco-conception Pertes Tier 2)'],
    engineeringRole: { fr: 'Ingénieur Matériel Électrique de Distribution', en: 'Distribution Equipment Engineer' },
    cameroonReference: {
      location: 'Poste Eneo 30 kV / 400 V (630 kVA)',
      description: {
        fr: 'Standard urbain Eneo alimentant environ 150 à 250 ménages et commerces de proximité.',
        en: 'Eneo standard distribution unit supplying 150 to 250 residential and commercial customers.'
      }
    }
  },
  {
    id: 'stage-13-lv-network',
    order: 13,
    code: 'STG.13',
    title: { fr: 'Réseau de Distribution Basse Tension (400 V / 230 V)', en: 'Low-Voltage Distribution Grid (400 V / 230 V)' },
    subtitle: { fr: 'Artères de distribution terminale aériennes ou souterraines', en: 'Terminal overhead bundle routes and underground street mains' },
    category: 'distribution',
    voltageRange: '400 V triphasé / 230 V monophasé',
    voltageBand: 'LV',
    primaryEquipment: 'Faisceaux aériens torsadés BT (4×70 mm² Al) sur poteaux et réseaux souterrains',
    equipmentId: 'eq-trafo-hta-01',
    upstreamStageId: 'stage-12-mv-lv-trafo',
    downstreamStageId: 'stage-14-tgbt-service',
    whyExists: {
      fr: 'Distribue l\'électricité à basse tension le long de chaque rue et venelle jusqu\'aux coffrets de branchement des usagers.',
      en: 'Distributes low-voltage current along public streets up to individual customer service head boxes.'
    },
    energyTransformation: {
      fr: 'Transit d\'énergie électrique à basse tension sur de faibles rayons d\'action (< 500 m pour limiter la chute de tension).',
      en: 'Final power delivery over short distances (< 500 m to avoid excessive voltage drops).'
    },
    lossMechanism: {
      fr: 'Pertes Joule élevées dues aux courants forts en BT (Inom élevé) et aux déséquilibres entre phases (~5 à 12% des pertes réseau).',
      en: 'High Joule losses driven by large current magnitudes and phase load unbalance (~5 to 12% of network losses).'
    },
    physicalView: {
      description: {
        fr: 'Câbles torsadés à 4 conducteurs isolés en polyéthylène réticulé fixés sur poteaux béton/bois ou en façade.',
        en: 'Twisted aerial bundle cables (4 insulated cores) clipped to roadside concrete/wood poles or building facades.'
      },
      keyAssets: ['Faisceau torsadé 3 phases + neutre porteur', 'Pinces d\'ancrage et d\'alignement', 'Boîtes de dérivation étanches'],
      typicalFootprint: 'Réseaux de desserte s\'étendant sur 200 à 600 m autour du poste MT/BT',
      environment: { fr: 'Environnement urbain dense, façades de bâtiments et voiries locales', en: 'Urban streetscape, building facades and residential alleys' }
    },
    electricalView: {
      sldSymbol: 'Low Voltage 4-Wire Distribution Main (3 Phases + Neutral)',
      description: {
        fr: 'Régime de neutre TT ou TN-C avec neutre distribué mis à la terre périodiquement le long du parcours.',
        en: 'TT or TN-C grounding system with distributed neutral grounded at multiple line extremities.'
      },
      nominalParameters: { fr: '400 V entre phases, 230 V entre phase et neutre, Chute de tension maximale tolérée 5%', en: '400 V line-to-line, 230 V phase-to-neutral, Max allowable voltage drop 5%' },
      connectionMode: 'Câble torsadé aérien Al 3×70 + 54.6 mm² ou câble souterrain U-1000 AR2V'
    },
    functionalView: {
      protectionFunctions: ['Fusibles couteaux HPC gG en tableau BT (ex. 160 A à 400 A)', 'Protection différentielle en tête de départ'],
      controlAutomation: {
        fr: 'Sectionnement manuel d\'artère et équilibrage périodique des phases en fonction de la charge relevée.',
        en: 'Manual sectioning links and periodic phase rebalancing based on load monitoring.'
      },
      instrumentation: ['Compteurs de tête de départ BT', 'Analyseurs de qualité d\'énergie (harmoniques et déséquilibres)'],
      auxiliaryDependency: {
        fr: 'Aucun système auxiliaire requis.',
        en: 'Passive distribution infrastructure.'
      }
    },
    applicableStandards: ['NF C 15-100', 'CEI 60364', 'NF C 11-201'],
    engineeringRole: { fr: 'Ingénieur Conduite et Exploitation BT', en: 'Low-Voltage Distribution Engineer' },
    cameroonReference: {
      location: 'Réseau BT Eneo Yaoundé / Douala',
      description: {
        fr: 'Lignes BT torsadées remplaçant progressivement les anciens conducteurs nus pour réduire les coupures et les pertes.',
        en: 'Twisted aerial bundle conductors progressively replacing uninsulated bare lines to reduce faults and losses.'
      }
    }
  },
  {
    id: 'stage-14-tgbt-service',
    order: 14,
    code: 'STG.14',
    title: { fr: 'Branchement & Tableau Général Basse Tension (TGBT)', en: 'Service Connection & Main LV Switchboard (TGBT)' },
    subtitle: { fr: 'Point frontière, comptage d\'énergie et distribution principale', en: 'Utility boundary, metering and building main distribution' },
    category: 'utilization',
    voltageRange: '400 V / 230 V AC',
    voltageBand: 'LV',
    primaryEquipment: 'Disjoncteur général de branchement, compteur d\'énergie bidirectionnel et TGBT',
    equipmentId: 'eq-tgbt-400v-01',
    upstreamStageId: 'stage-13-lv-network',
    downstreamStageId: 'stage-15-loads',
    whyExists: {
      fr: 'Matérialise la frontière contractuelle entre le distributeur et l\'usager, assure la protection des personnes contre les contacts indirects et alimente les départs terminaux.',
      en: 'Forms the utility-customer interface, meters energy consumed, protects users against indirect electric shock, and feeds sub-boards.'
    },
    energyTransformation: {
      fr: 'Comptage, sectionnement et distribution de puissance aux circuits terminaux.',
      en: 'Metering, isolation, and power allocation to terminal circuits.'
    },
    lossMechanism: {
      fr: 'Pertes par effet Joule dans les connexions de disjoncteurs et jeux de barres du tableau (très faibles).',
      en: 'Minor I²R losses in internal busbars and terminal lug connections.'
    },
    physicalView: {
      description: {
        fr: 'Armoire métallique ou coffret modulaire en tôle pliée abritant le disjoncteur général, les jeux de barres et les départs modulaires.',
        en: 'Sheet-steel modular enclosure housing main air circuit breaker (ACB/MCCB), distribution comb busbars, and outgoing devices.'
      },
      keyAssets: ['Disjoncteur général TGBT', 'Compteur d\'énergie communicant', 'Parafoudre type 1+2', 'Barre de terre principale'],
      typicalFootprint: 'Armoire de 2.0 m × 0.8 m × 0.6 m ou coffret mural',
      environment: { fr: 'Local technique électrique ventilé dédié du bâtiment', en: 'Dedicated ventilated electrical switchroom' }
    },
    electricalView: {
      sldSymbol: 'Main LV Switchboard (TGBT) SLD with Main Breaker and Sub-feeders',
      description: {
        fr: 'Schéma unifilaire d\'installation intérieure selon NF C 15-100 / CEI 60364 avec schéma de liaison à la terre TT, TN-S ou IT.',
        en: 'Single-line diagram compliant with IEC 60364 / NF C 15-100 supporting TT, TN-S or IT earthing systems.'
      },
      nominalParameters: { fr: '400 V / 230 V, Courant assigné 100 A à 3200 A, Pouvoir de coupure Icu = 25 à 50 kA', en: '400 V / 230 V, Rated current 100 A to 3200 A, Icu = 25 to 50 kA' },
      connectionMode: 'Câbles cuivre R2V sous goulottes ou chemins de câbles perforés'
    },
    functionalView: {
      protectionFunctions: ['Déclencheur magnéto-thermique / électronique Micrologic', 'Disjoncteur différentiel (300 mA sélectif / 30 mA)', 'Parafoudre BT'],
      controlAutomation: {
        fr: 'Centrale de mesure d\'énergie communicante en Modbus/IP pour suivi de consommation et télégestion.',
        en: 'Energy management meter monitoring kWh, power factor, and harmonics via Modbus/IP.'
      },
      instrumentation: ['Compteur électronique communicant Smart Meter', 'Indicateurs de présence tension'],
      auxiliaryDependency: {
        fr: 'Système d\'Inversion Normal/Secours (ATS) raccordé au groupe électrogène de secours du bâtiment.',
        en: 'Automatic Transfer Switch (ATS) coupled to emergency standby diesel generator.'
      }
    },
    applicableStandards: ['NF C 15-100', 'CEI 61439-1/-2 (Ensembles d\'appareillage BT)'],
    engineeringRole: { fr: 'Ingénieur d\'Études Installations Électriques du Bâtiment', en: 'Building Electrical Services Engineer' },
    cameroonReference: {
      location: 'TGBT Siège Eneo / Immeuble de bureaux Yaoundé',
      description: {
        fr: 'TGBT principal 800 A avec inverseur automatique de source groupe électrogène pour garantir la continuité de service.',
        en: '800 A main switchboard with automatic transfer switch to backup genset ensuring business continuity.'
      }
    }
  },
  {
    id: 'stage-15-loads',
    order: 15,
    code: 'STG.15',
    title: { fr: 'Usages Terminaux & Charges Électriques', en: 'Terminal Consumer Loads & Utilization' },
    subtitle: { fr: 'Conversion finale en travail mécanique, lumière, chaleur ou calcul', en: 'Final conversion into work, illumination, heat or data' },
    category: 'utilization',
    voltageRange: '400 V triphasé / 230 V monophasé AC',
    voltageBand: 'LV',
    primaryEquipment: 'Moteurs asynchrones industriels, éclairage LED, serveurs informatiques et appareils électroménagers',
    equipmentId: 'eq-tgbt-400v-01',
    upstreamStageId: 'stage-14-tgbt-service',
    whyExists: {
      fr: 'Point d\'aboutissement final de l\'ensemble du système électrique : l\'énergie est consommée pour rendre un service utile à l\'économie et à la société.',
      en: 'The ultimate terminus of the entire electrical architecture: energy is consumed to deliver productive work and comfort.'
    },
    energyTransformation: {
      fr: 'Conversion de l\'énergie électrique en travail mécanique (moteur), lumière (LED), chaleur (fours/radiateurs) ou traitement d\'information.',
      en: 'Conversion into mechanical work (motors), light (LEDs), thermal heat, or digital compute.'
    },
    lossMechanism: {
      fr: 'Rendements propres aux récepteurs (ex: moteur IE3 ~93%, lampe LED ~85%, radiateur 100% thermique).',
      en: 'End-use appliance losses (induction motor slip and winding loss, LED driver dissipation).'
    },
    physicalView: {
      description: {
        fr: 'Machines tournantes industrielles, luminaires, unités de climatisation, machines de bureaux et appareils domestiques.',
        en: 'Factory induction drives, HVAC chillers, commercial lighting, data server racks, and home appliances.'
      },
      keyAssets: ['Moteur asynchrone triphasé 400 V', 'Variateur de vitesse', 'Climatiseur Inverter', 'Tableaux divisionnaires'],
      typicalFootprint: 'Intérieur d\'usines, commerces, bureaux et foyers',
      environment: { fr: 'Locaux de travail, résidences et zones de production industrielle', en: 'Industrial shopfloors, commercial offices, and residential dwellings' }
    },
    electricalView: {
      sldSymbol: 'Load Symbols (M, Lamp, Heater, Computer Socket)',
      description: {
        fr: 'Circuits terminaux protégés individuellement par disjoncteurs divisionnaires 10 A à 63 A avec différentiel haute sensibilité 30 mA.',
        en: 'Branch circuits protected by miniature circuit breakers (10 A to 63 A) and 30 mA residual current devices (RCD).'
      },
      nominalParameters: { fr: '230 V / 400 V, Facteur de puissance cos(φ) variable (0.75 inductive à 0.98)', en: '230 V / 400 V, Operating power factor ranging from 0.75 inductive to 0.98' },
      connectionMode: 'Câbles rigides cuivre 1.5 mm², 2.5 mm², 6 mm² ou 16 mm²'
    },
    functionalView: {
      protectionFunctions: ['Disjoncteur magnéto-thermique courbe C ou D', 'Protection différentielle 30 mA (Sécurité des personnes)'],
      controlAutomation: {
        fr: 'Gestion Technique du Bâtiment (GTB), variateurs de vitesse et thermostats de régulation.',
        en: 'Building Management System (BMS), variable frequency drives (VFD), and smart thermostats.'
      },
      instrumentation: ['Sous-compteurs divisionnaires', 'Sondes de température d\'ambiance'],
      auxiliaryDependency: {
        fr: 'Onduleur statique (UPS) pour les charges critiques informatiques et médicales.',
        en: 'Uninterruptible Power Supply (UPS) for critical IT and life-safety systems.'
      }
    },
    applicableStandards: ['NF C 15-100 §4-41', 'CEI 60034-30-1 (Classes de rendement moteurs)'],
    engineeringRole: { fr: 'Ingénieur Électrotechnicien d\'Application', en: 'Electrical Applications & Facility Engineer' },
    cameroonReference: {
      location: 'Usine ALUCAM (Édéa) & Quartiers de Douala',
      description: {
        fr: 'De la cuve d\'électrolyse industrielle d\'ALUCAM (180 MW) aux climatiseurs et lampes des ménages urbains.',
        en: 'From the heavy electrolysis potlines of ALUCAM (180 MW) down to residential fans, lights, and appliances.'
      }
    }
  }
];
