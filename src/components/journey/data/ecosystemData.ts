// src/components/journey/data/ecosystemData.ts
import { EcosystemStage, EcosystemEquipment, EngineeringDiscipline, LightningStep, FaultScenario, GridLoadProfile, GridPeriodId } from '../types';

export const ECOSYSTEM_STAGES: EcosystemStage[] = [
  {
    id: 'generation',
    number: 1,
    stepNumber: 1,
    title: { fr: 'Production Hydroélectrique', en: 'Hydroelectric Generation' },
    subtitle: { fr: 'Conversion de l\'énergie hydraulique en énergie électrique', en: 'Conversion of hydraulic potential into electrical energy' },
    description: { fr: 'Conversion de l\'énergie hydraulique en énergie électrique', en: 'Conversion of hydraulic potential into electrical energy' },
    voltageRating: '15 kV',
    voltageLevel: '15 kV',
    keyRole: {
      fr: 'Exploite la chute d\'eau pour entraîner une turbine et un alternateur synchrone triphasé.',
      en: 'Harnesses hydraulic head to drive a turbine and a 3-phase synchronous generator.'
    },
    equipmentIds: ['eq-penstock', 'eq-turbine', 'eq-generator', 'eq-avr-gov', 'eq-gen-breaker', 'eq-gen-relay'],
    physicalSummary: {
      fr: 'Barrage, retenue, prise d\'eau, conduite forcée, turbine Francis/Pelton et alternateur à pôles saillants.',
      en: 'Dam, reservoir, water intake, penstock, Francis/Pelton turbine, and salient pole generator.'
    },
    transformationPrinciple: {
      fr: 'Énergie potentielle d\'eau (E = m·g·h) → Énergie cinétique → Couple mécanique (P = C·ω) → Énergie électromagnétique (P = √3·U·I·cosφ).',
      en: 'Potential hydraulic energy (E = m·g·h) → Kinetic energy → Shaft torque (P = T·ω) → Electromagnetic power (P = √3·U·I·cosφ).'
    },
    physicsTransformation: {
      fr: 'Énergie potentielle d\'eau (E = m·g·h) → Énergie cinétique → Couple mécanique (P = C·ω) → Énergie électromagnétique (P = √3·U·I·cosφ).',
      en: 'Potential hydraulic energy (E = m·g·h) → Kinetic energy → Shaft torque (P = T·ω) → Electromagnetic power (P = √3·U·I·cosφ).'
    },
    primaryDiscipline: { fr: 'Génie Électromécanique & Hydraulique', en: 'Electromechanical & Hydraulic Engineering' },
    keyStandards: ['IEC 60034-1', 'IEC 60041', 'IEEE 421.5']
  },
  {
    id: 'switchyard',
    number: 2,
    stepNumber: 2,
    title: { fr: 'Poste d\'Évacuation & Élévation (GSU)', en: 'Generation Switchyard & Step-Up Substation' },
    subtitle: { fr: 'Élévation de tension pour minimiser les pertes Joule', en: 'Stepping up voltage to drastically minimize Joule losses' },
    description: { fr: 'Élévation de tension pour minimiser les pertes Joule', en: 'Stepping up voltage to drastically minimize Joule losses' },
    voltageRating: '15 kV → 225 kV',
    voltageLevel: '15 kV → 225 kV',
    keyRole: {
      fr: 'Le transformateur élévateur (GSU) multiplie la tension par 15, réduisant le courant par 15 et les pertes en ligne par 225.',
      en: 'GSU transformer multiplies voltage by 15, reducing current by 15 and line resistive losses by 225.'
    },
    equipmentIds: ['eq-gsu-trafo', 'eq-surge-arrester-hv', 'eq-hv-breaker', 'eq-hv-disconnector', 'eq-trafo-relay'],
    physicalSummary: {
      fr: 'Transformateur de puissance à huile avec aéroréfrigérants, disjoncteurs SF6 225 kV, sectionneurs, parafoudres ZnO.',
      en: 'Oil-immersed power transformer with radiators, 225 kV SF6 circuit breakers, disconnectors, ZnO surge arresters.'
    },
    lossExplanation: {
      fr: 'Pertes Joule: P_pertes = 3 · R · I². Pour une puissance P donnée (P = √3·U·I), I = P / (√3·U). Si U est multiplié par 15, I est divisé par 15 et I² est divisé par 225.',
      en: 'Joule losses: P_loss = 3·R·I². For a transmitted power P (P = √3·U·I), current I = P / (√3·U). Multiplying U by 15 divides I by 15 and I² by 225.'
    },
    physicsTransformation: {
      fr: 'Induction électromagnétique (Loi de Faraday-Lenz): élévation 15 kV → 225 kV. Réduction drastique du courant I = P/(√3·U) et division des pertes Joule par 225.',
      en: 'Electromagnetic induction: step-up from 15 kV to 225 kV, cutting current by 15 and Joule line losses by 225.'
    },
    primaryDiscipline: { fr: 'Ingénierie des Postes & Transformateurs HTB', en: 'HV Substation & Transformer Engineering' },
    keyStandards: ['IEC 60076', 'IEC 62271-100', 'IEEE C57.12']
  },
  {
    id: 'transmission',
    number: 3,
    stepNumber: 3,
    title: { fr: 'Ligne de Transport Haute Tension (THT/HTB)', en: 'High-Voltage Transmission Line' },
    subtitle: { fr: 'Interconnexion et transport massif d\'énergie à longue distance', en: 'Bulk power transmission across long distances' },
    description: { fr: 'Interconnexion et transport massif d\'énergie à longue distance', en: 'Bulk power transmission across long distances' },
    voltageRating: '225 kV',
    voltageLevel: '225 kV',
    keyRole: {
      fr: 'Achemine des centaines de mégawatts sur des dizaines à centaines de kilomètres avec un rendement > 98%.',
      en: 'Transfers hundreds of megawatts over hundreds of kilometers with >98% efficiency.'
    },
    equipmentIds: ['eq-lattice-tower', 'eq-bundle-conductor', 'eq-insulator-string', 'eq-opgw-shield', 'eq-vibration-damper', 'eq-distance-relay'],
    physicalSummary: {
      fr: 'Pylônes treillis acier galvanisé, faisceaux de conducteurs Almelec/ACSR, isolateurs en verre/composite, câble de garde OPGW.',
      en: 'Galvanized steel lattice towers, bundled ACSR conductors, composite/glass insulator strings, OPGW optical shield wire.'
    },
    physicsTransformation: {
      fr: 'Propagation d\'ondes électromagnétiques guidées (équations des télégraphistes). Effet Ferranti à vide et amortissement des vibrations éoliennes Stockbridge.',
      en: 'Guided electromagnetic wave propagation. Ferranti effect at light load and mechanical damping of aeolian vibrations.'
    },
    primaryDiscipline: { fr: 'Lignes Aériennes THT & Protection Distante', en: 'HV Overhead Lines & Distance Protection' },
    keyStandards: ['IEC 60826', 'IEC 61284', 'IEC 60255-121']
  },
  {
    id: 'substation',
    number: 4,
    stepNumber: 4,
    title: { fr: 'Poste d\'Interconnexion & Abaissement', en: 'Transmission Grid Node & Step-Down Substation' },
    subtitle: { fr: 'Nœud de maillage du réseau et conversion THT vers Moyenne Tension', en: 'Grid mesh node and EHV to Medium Voltage step-down' },
    description: { fr: 'Nœud de maillage du réseau et conversion THT vers Moyenne Tension', en: 'Grid mesh node and EHV to Medium Voltage step-down' },
    voltageRating: '225 kV → 30 kV',
    voltageLevel: '225 kV → 30 kV',
    keyRole: {
      fr: 'Interconnecte les lignes du réseau, assure le délestage/aiguillage et abaisse la tension pour la distribution urbaine/rurale.',
      en: 'Interconnects grid lines, manages routing/dispatching, and steps down voltage for distribution.'
    },
    equipmentIds: ['eq-stepdown-trafo', 'eq-oltc', 'eq-busbar-225', 'eq-bus-protection', 'eq-scada-rtu', 'eq-dc-batteries'],
    physicalSummary: {
      fr: 'Jeu de barres 225 kV double-barre, autotransformateur 225/30 kV avec régleur en charge (OLTC), bâtiment de commande relayage et SCADA.',
      en: 'Double-bus 225 kV switchyard, 225/30 kV autotransformer with on-load tap changer (OLTC), protection relay & SCADA building.'
    },
    physicsTransformation: {
      fr: 'Conversion de tension 225 kV → 30 kV HTA. Régulation automatique de tension en charge sous les transitoires journaliers (réactance de fuite ~12%).',
      en: 'Voltage step-down 225 kV to 30 kV MV. Automatic on-load tap voltage regulation countering daily grid fluctuations.'
    },
    primaryDiscipline: { fr: 'Automatismes de Poste & Systèmes SCADA', en: 'Substation Automation & SCADA Systems' },
    keyStandards: ['IEC 61850', 'IEC 60870-5-104', 'IEEE 80']
  },
  {
    id: 'distribution',
    number: 5,
    stepNumber: 5,
    title: { fr: 'Distribution Moyenne Tension & Transfo HTA/BT', en: 'Medium-Voltage Distribution & MV/LV Transformer' },
    subtitle: { fr: 'Desserte capillaire des quartiers et transformation finale en basse tension', en: 'Capillary feeder network and final step-down to low voltage' },
    description: { fr: 'Desserte capillaire des quartiers et transformation finale en basse tension', en: 'Capillary feeder network and final step-down to low voltage' },
    voltageRating: '30 kV → 400 V / 230 V',
    voltageLevel: '30 kV → 400 V / 230 V',
    keyRole: {
      fr: 'Distribue l\'électricité à travers artères aériennes/souterraines et alimente le transformateur de distribution de quartier.',
      en: 'Distributes electricity via overhead/underground feeders and feeds the local neighborhood transformer.'
    },
    equipmentIds: ['eq-mv-feeder', 'eq-recloser', 'eq-dist-trafo', 'eq-mv-fuses', 'eq-lv-switchboard'],
    physicalSummary: {
      fr: 'Poteaux béton/bois, câbles souterrains HTA 30 kV, cellule RMU, transformateur sur poteau ou cabine 30 kV/400 V Dyn11.',
      en: 'Concrete/wood poles, 30 kV underground cables, RMU switchgear, pole-mounted or cabin 30 kV/400 V Dyn11 transformer.'
    },
    physicsTransformation: {
      fr: 'Abaissement final 30 kV → 400 V triphasé / 230 V monophasé (couplage Dyn11 pour circulation du neutre et harmoniques 3).',
      en: 'Final distribution step-down 30 kV → 400 V 3-phase / 230 V 1-phase with Dyn11 vector group.'
    },
    primaryDiscipline: { fr: 'Distribution Rurale/Urbaine & Raccordement', en: 'Urban/Rural MV Distribution & Interconnection' },
    keyStandards: ['IEC 60076-1', 'IEC 62271-200', 'NF C 13-100']
  },
  {
    id: 'consumption',
    number: 6,
    stepNumber: 6,
    title: { fr: 'Réseau Basse Tension, Maison & Lampe', en: 'Low-Voltage Network, Home & Lamp' },
    subtitle: { fr: 'De l\'arrivée électrique au bouton d\'interrupteur et à l\'ampoule allumée', en: 'From service entrance to wall switch and glowing lamp' },
    description: { fr: 'De l\'arrivée électrique au bouton d\'interrupteur et à l\'ampoule allumée', en: 'From service entrance to wall switch and glowing lamp' },
    voltageRating: '230 V (Phase-Neutre) / 400 V',
    voltageLevel: '230 V (Phase-Neutre) / 400 V',
    keyRole: {
      fr: 'Distribue l\'énergie de manière sûre au sein du bâtiment, protégée par disjoncteurs divisionnaires et différentiels.',
      en: 'Safely delivers power inside the building, protected by miniature circuit breakers (MCB) and residual current devices (RCD).'
    },
    equipmentIds: ['eq-energy-meter', 'eq-main-breaker', 'eq-rcd-diff', 'eq-mcb-lighting', 'eq-wall-switch', 'eq-lamp-bulb'],
    physicalSummary: {
      fr: 'Coffret de comptage, tableau de répartition électrique résidentiel, câbles cuivre sous gaine, interrupteur mural, ampoule LED.',
      en: 'Service entrance meter, residential distribution board, copper wiring in conduits, wall toggle switch, LED lamp.'
    },
    physicsTransformation: {
      fr: 'Conversion électro-optique finale: flux d\'électrons sous 230 V traversant la diode LED, recombinaison électron-trou émettant des photons visibles.',
      en: 'Electro-optical conversion: electron flow across LED semiconductor p-n junction releasing visible photons.'
    },
    primaryDiscipline: { fr: 'Installations BT & Sécurité des Personnes', en: 'Low Voltage Buildings & Electrical Safety' },
    keyStandards: ['NF C 15-100', 'IEC 60364', 'IEC 61008']
  }
];

export const ECOSYSTEM_EQUIPMENT: Record<string, EcosystemEquipment> = {
  'eq-penstock': {
    id: 'eq-penstock',
    stageId: 'generation',
    name: { fr: 'Conduite Forcée & Vanne de Tête', en: 'Penstock & Head Gate' },
    tag: 'HYD-PEN-01',
    shortDesc: {
      fr: 'Canalisation en acier sous pression guidant l\'eau du barrage vers la turbine.',
      en: 'High-pressure steel conduit channeling reservoir water to the turbine.'
    },
    function: {
      fr: 'Convertit la hauteur de chute brute en énergie cinétique et pression dynamique élevée à l\'entrée des injecteurs/distributeurs.',
      en: 'Converts gross hydraulic head into kinetic energy and high dynamic pressure at turbine inlet.'
    },
    whyExists: {
      fr: 'Sans conduite forcée résistant aux coups de bélier, l\'eau ne pourrait pas acquérir la vitesse nécessaire pour actionner la turbine avec un haut rendement.',
      en: 'Without a penstock engineered for water hammer transients, water could not achieve high kinetic velocity.'
    },
    whereUsed: { fr: 'Centrales hydroélectriques de moyenne et haute chute.', en: 'Medium and high-head hydroelectric power plants.' },
    connectsTo: ['Barrage / Prise d\'eau', 'Bâche spirale de la turbine'],
    measures: ['Pression d\'eau (bar)', 'Débit volumique (m³/s)', 'Vibrations acoustiques'],
    protectedBy: ['Vanne papillon de sécurité de pied', 'Cheminée d\'équilibre (anti-coup de bélier)'],
    controls: ['Servomoteur hydraulique de vanne de tête'],
    communicatesVia: ['Liaison filaire 4-20 mA vers automate centrale'],
    failureModes: [
      {
        mode: { fr: 'Coup de bélier lors d\'un arrêt d\'urgence', en: 'Water hammer on emergency trip' },
        consequence: { fr: 'Surpression destructrice risquant la rupture de la conduite', en: 'Destructive pressure wave risking penstock burst' },
        mitigation: { fr: 'Cheminée d\'équilibre et lois de fermeture progressive des aubes', en: 'Surge tank and governed progressive valve closure' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Annuelle', en: 'Annual' }, action: { fr: 'Contrôle ultrasons des soudures et épaisseur d\'acier', en: 'Ultrasonic testing of welds and steel thickness' } }
    ],
    standards: [{ code: 'IEC 60041', title: 'Field acceptance tests of hydraulic turbines', org: 'IEC' }],
    disciplines: ['Génie Civil', 'Génie Hydraulique', 'Génie Mécanique'],
    levels: {
      level1: { fr: 'Gros tuyau en acier qui conduit l\'eau sous forte pression vers la turbine.', en: 'Large steel pipe directing pressurized water to the turbine.' },
      level2: { fr: 'Conduite en acier fretté calculée pour supporter la pression statique + la surpression dynamique de fermeture.', en: 'Reinforced steel penstock engineered to withstand static head plus dynamic water hammer surges.' },
      level3: { fr: 'Calcul d\'Allievi: ΔH = (a · Δv) / g. Dotée de détecteurs de rupture de veine d\'eau et vanne papillon à contrepoids.', en: 'Allievi wave equation ΔH = (a·Δv)/g. Monitored by pipe rupture velocity sensors and gravity counterweight shutoff valve.' }
    }
  },
  'eq-turbine': {
    id: 'eq-turbine',
    stageId: 'generation',
    name: { fr: 'Turbine Hydraulique (Francis)', en: 'Hydraulic Turbine (Francis)' },
    tag: 'TURB-01',
    shortDesc: {
      fr: 'Roue aubée transformant l\'énergie du fluide en couple mécanique rotatif.',
      en: 'Vane runner converting fluid energy into rotating mechanical shaft torque.'
    },
    function: {
      fr: 'Accélère l\'eau à travers un distributeur réglable pour faire tourner l\'arbre à vitesse synchrone constante (ex: 187.5 tr/min).',
      en: 'Directs water via adjustable wicket gates to rotate the shaft at constant synchronous speed.'
    },
    whyExists: {
      fr: 'C\'est l\'interface mécanique indispensable entre le fluide en mouvement et l\'alternateur électrique.',
      en: 'It is the indispensable mechanical prime mover interface between moving water and the generator.'
    },
    whereUsed: { fr: 'Salles des machines des barrages hydroélectriques.', en: 'Powerhouse caverns in hydroelectric dams.' },
    connectsTo: ['Conduite forcée', 'Arbre d\'accouplement alternateur', 'Canal de fuite'],
    measures: ['Vitesse de rotation (tr/min)', 'Température des paliers (°C)', 'Vibrations radiales (μm)'],
    protectedBy: ['Protection survitesse mécanique/électrique (ANSI 12)', 'Détecteurs de cavitation'],
    controls: ['Régulateur de vitesse (tachymètre + servomoteurs d\'aubes directrices)'],
    communicatesVia: ['Bus de terrain PROFIBUS / Modbus vers SCADA'],
    failureModes: [
      {
        mode: { fr: 'Cavitation des aubes', en: 'Blade cavitation erosion' },
        consequence: { fr: 'Érosion métallique, chute de rendement, vibrations', en: 'Pitting erosion, efficiency loss, excessive vibration' },
        mitigation: { fr: 'Revêtement carbure de tungstène et maintien de la pression d\'aspiration', en: 'Tungsten carbide coating and draft tube pressure control' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 3 ans', en: 'Every 3 years' }, action: { fr: 'Rechargement par soudure inox des zones érodées', en: 'Stainless steel weld build-up and dynamic balancing' } }
    ],
    standards: [{ code: 'IEC 60193', title: 'Hydraulic turbines - Model acceptance tests', org: 'IEC' }],
    disciplines: ['Génie Hydraulique', 'Génie Mécanique', 'Génie des Matériaux'],
    levels: {
      level1: { fr: 'Roue géante à ailettes qui tourne sous la force de l\'eau.', en: 'Giant water wheel that spins under the power of moving water.' },
      level2: { fr: 'Turbine à réaction Francis où l\'eau subit une chute de pression et de vitesse en traversant la roue.', en: 'Francis reaction turbine where water drops in pressure and velocity across the runner.' },
      level3: { fr: 'Équation d\'Euler: P = ρ·Q·(u1·c1u - u2·c2u). Rendement hydraulique ηh > 94%. Guidage par palier à patins oscillants.', en: 'Euler turbine equation P = ρ·Q·(u1·c1u - u2·c2u). Hydraulic efficiency ηh > 94%. Tilting-pad guide bearings.' }
    }
  },
  'eq-generator': {
    id: 'eq-generator',
    stageId: 'generation',
    name: { fr: 'Alternateur Synchrone Triphasé', en: '3-Phase Synchronous Generator' },
    tag: 'GEN-01',
    voltageLevel: '15 kV',
    shortDesc: {
      fr: 'Générateur électromagnétique produisant la tension triphasée 15 kV à 50 Hz.',
      en: 'Electromagnetic machine producing 15 kV 3-phase AC voltage at 50 Hz.'
    },
    function: {
      fr: 'Convertit le couple mécanique de l\'arbre en puissance électrique triphasée synchronisée avec le réseau.',
      en: 'Converts mechanical shaft power into 3-phase grid-synchronized electrical power.'
    },
    whyExists: {
      fr: 'C\'est le cœur de la génération: crée l\'onde sinusoïdale de tension à la fréquence du réseau (50 Hz).',
      en: 'It is the core of generation: produces the 50 Hz sinusoidal voltage waveform.'
    },
    whereUsed: { fr: 'Centrales électriques (hydraulique, thermique, nucléaire, gaz).', en: 'Power generation plants of all types.' },
    connectsTo: ['Arbre turbine', 'Système d\'excitation statique', 'Disjoncteur d\'alternateur 15 kV'],
    measures: ['Tension stator U (kV)', 'Courant I (kA)', 'Puissance P (MW) & Q (MVAr)', 'Fréquence f (Hz)', 'T° enroulements (Pt100)'],
    protectedBy: ['Différentielle alternateur (87G)', 'Défaut terre stator (64S)', 'Perte d\'excitation (40)', 'Surpuissance inverse (32R)'],
    controls: ['Régulateur de tension AVR (Automatic Voltage Regulator)', 'Pont de thyristors d\'excitation'],
    communicatesVia: ['IEC 61850 MMS / GOOSE vers automate de tranche'],
    failureModes: [
      {
        mode: { fr: 'Claquant d\'isolement entre spires statoriques', en: 'Stator winding turn-to-turn insulation breakdown' },
        consequence: { fr: 'Court-circuit interne violent destructeur', en: 'Violent internal phase short circuit' },
        mitigation: { fr: 'Relais différentiel 87G rapide (< 20 ms) et injection CO2 d\'extinction incendie', en: 'Fast 87G differential relay (<20ms) and automatic CO2 deluge' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Semestrielle', en: 'Biannual' }, action: { fr: 'Mesure de résistance d\'isolement (mégohmmètre) et tan δ', en: 'Insulation resistance (megohmmeter) and dissipation factor tan δ' } }
    ],
    standards: [{ code: 'IEC 60034-1', title: 'Rotating electrical machines - Rating and performance', org: 'IEC' }],
    disciplines: ['Génie Électrique', 'Électrotechnique', 'Contrôle-Commande'],
    levels: {
      level1: { fr: 'Machine qui fabrique l\'électricité grâce à des aimants géants qui tournent.', en: 'Machine that creates electricity using huge spinning electromagnets.' },
      level2: { fr: 'Alternateur synchrone à pôles saillants. Le rotor à courant continu crée un champ magnétique tournant qui induit du 15 kV triphasé dans le stator.', en: 'Salient pole synchronous generator. DC rotor creates a rotating magnetic field inducing 15 kV in 3-phase stator.' },
      level3: { fr: 'Fréquence f = (p · n) / 60 = 50 Hz. Modèle de Park (X_d, X_q, X_d\', X_d"). Capacité de tenue thermique classe F isolée résine époxy-mica.', en: 'Synchronous speed f = (p·n)/60 = 50 Hz. Park two-axis model (Xd, Xq, Xd\', Xd"). Class F epoxy-mica insulation.' }
    }
  },
  'eq-avr-gov': {
    id: 'eq-avr-gov',
    stageId: 'generation',
    name: { fr: 'Régulateur de Tension (AVR) & Vitesse (Gov)', en: 'AVR & Speed Governor' },
    tag: 'REG-AVR-GOV-01',
    shortDesc: {
      fr: 'Cerveaux électroniques asservissant la fréquence à 50.0 Hz et la tension à 1.00 p.u.',
      en: 'Electronic controllers governing frequency at 50.0 Hz and voltage at 1.00 p.u.'
    },
    function: {
      fr: 'Le régulateur de vitesse ajuste le débit d\'eau (puissance active P ↔ fréquence f). L\'AVR ajuste le courant d\'excitation rotorique (puissance réactive Q ↔ tension U).',
      en: 'Governor controls water flow (active power P ↔ frequency f). AVR modulates rotor excitation (reactive Q ↔ voltage U).'
    },
    whyExists: {
      fr: 'Garantit que le réseau ne s\'effondre pas lors des variations soudaines de consommation électrique.',
      en: 'Prevents grid blackouts during sudden load or generation imbalances.'
    },
    whereUsed: { fr: 'Contrôle de chaque tranche de production électrique.', en: 'Control bay of every power generating unit.' },
    connectsTo: ['Capteurs de vitesse/tension', 'Distributeur hydraulique', 'Pont d\'excitation rotorique'],
    measures: ['Fréquence réseau (Hz)', 'Tension statorique (V)', 'Angle de charge rotorique δ'],
    protectedBy: ['Limiteur de sous-excitation', 'Limiteur de courant rotorique/statorique'],
    controls: ['Vannes d\'aubes directrices', 'Angle d\'amorçage thyristors'],
    communicatesVia: ['Protocole IEC 60870-5-104 vers le Dispatching National'],
    failureModes: [
      {
        mode: { fr: 'Dérive de mesure de fréquence', en: 'Frequency sensing drift' },
        consequence: { fr: 'Instabilité de puissance ou déclenchement intempestif', en: 'Power oscillations or false unit trip' },
        mitigation: { fr: 'Architecture triple redondante 2 sur 3 (2oo3)', en: 'Triple modular redundant (2oo3) sensing architecture' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Annuelle', en: 'Annual' }, action: { fr: 'Test de réponse à un échelon de consigne de tension et de charge', en: 'Step-response tuning and PSS (Power System Stabilizer) verification' } }
    ],
    standards: [{ code: 'IEEE 421.5', title: 'Excitation system models for power system stability', org: 'IEEE' }],
    disciplines: ['Automatisme', 'Contrôle-Commande', 'Stabilité des Réseaux'],
    levels: {
      level1: { fr: 'Ordinateur qui accélère ou ralentit la centrale pour maintenir exactement 50 Hz.', en: 'Computer that speeds up or slows down the plant to maintain exact 50 Hz.' },
      level2: { fr: 'Boucles d\'asservissement PID avec statisme de fréquence (statisme s = 4%) et régulation U/Q.', en: 'Closed-loop PID controllers with frequency droop (s = 4%) and reactive power/voltage support.' },
      level3: { fr: 'Fonction PSS (Power System Stabilizer) injectant un signal amortisseur de couple dφ/dt pour contrer les oscillations inter-zones (0.2-2 Hz).', en: 'Power System Stabilizer (PSS) injecting damping torque to suppress inter-area low-frequency oscillations (0.2-2 Hz).' }
    }
  },
  'eq-gen-breaker': {
    id: 'eq-gen-breaker',
    stageId: 'generation',
    name: { fr: 'Disjoncteur d\'Alternateur (GCB)', en: 'Generator Circuit Breaker (GCB)' },
    tag: 'GCB-15-01',
    voltageLevel: '15 kV',
    shortDesc: {
      fr: 'Disjoncteur haute intensité capable de couper des courants de court-circuit colossaux (> 63 kA).',
      en: 'Heavy-duty switchgear capable of interrupting massive short-circuit currents (>63 kA).'
    },
    function: {
      fr: 'Connecte et isole l\'alternateur du reste du réseau sous pleine charge ou en cas de défaut interne.',
      en: 'Safely synchronizes and isolates generator under full load or severe internal short circuits.'
    },
    whyExists: {
      fr: 'Permet d\'alimenter les auxiliaires de centrale via le transfo principal même quand la turbine est à l\'arrêt.',
      en: 'Enables powering plant auxiliaries from the grid even when turbine is offline.'
    },
    whereUsed: { fr: 'Entre l\'alternateur et le transformateur élévateur.', en: 'Between generator terminals and step-up transformer.' },
    connectsTo: ['Gaines à barres blindées 15 kV', 'Transformateur élévateur (GSU)'],
    measures: ['État ouvert/fermé', 'Pression gaz SF6', 'Courant traversant'],
    protectedBy: ['Surveillance densité SF6', 'Antiblocage mécanique'],
    controls: ['Bobine d\'enclenchement et double bobine de déclenchement à manque/émission'],
    communicatesVia: ['Contacts secs et bus GOOSE IEC 61850'],
    failureModes: [
      {
        mode: { fr: 'Fuite de gaz SF6', en: 'SF6 gas leakage' },
        consequence: { fr: 'Perte du pouvoir de coupure de l\'arc', en: 'Loss of arc extinguishing capability' },
        mitigation: { fr: 'Pressostat manométrique à 2 seuils (alarme puis verrouillage)', en: 'Two-stage density monitor with trip lockout' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 5 ans', en: 'Every 5 years' }, action: { fr: 'Mesure de résistance de contact (micro-ohmmètre) et temps de manœuvre', en: 'Contact resistance micro-ohmmeter test and timing analysis' } }
    ],
    standards: [{ code: 'IEC/IEEE 62271-37-013', title: 'High-voltage switchgear - Generator circuit-breakers', org: 'IEC' }],
    disciplines: ['Appareillage Électrique', 'Protection Électrique'],
    levels: {
      level1: { fr: 'Interrupteur de sécurité géant qui peut couper tout le courant de la centrale en cas de danger.', en: 'Giant security switch that cuts off power in a fraction of a second during danger.' },
      level2: { fr: 'Disjoncteur SF6 capable de couper des courants continus asymétriques très élevés sans passage à zéro immédiat.', en: 'SF6 breaker designed to interrupt high delayed-current-zero faults occurring close to generator.' },
      level3: { fr: 'Pouvoir de coupure nominal Isc = 80 kA, tension de rétablissement transitoire TRV très sévère selon IEC/IEEE 62271-37-013.', en: 'Rated breaking capacity 80 kA with extremely steep Transient Recovery Voltage (TRV) withstand.' }
    }
  },
  'eq-gen-relay': {
    id: 'eq-gen-relay',
    stageId: 'generation',
    name: { fr: 'Relais Numérique de Protection Groupe', en: 'Generator Protection IED' },
    tag: 'PROT-GEN-87G',
    shortDesc: {
      fr: 'Calculateur temps réel qui surveille l\'alternateur et ordonne le déclenchement en quelques millisecondes.',
      en: 'Real-time microprocessor IED commanding emergency tripping within milliseconds.'
    },
    function: {
      fr: 'Analyse les signaux de TC et TP pour détecter tout court-circuit, perte d\'excitation ou dérive anormale.',
      en: 'Continuously monitors CT and VT waveforms to detect internal electrical faults and trips the breaker.'
    },
    whyExists: {
      fr: 'Empêche la destruction par explosion ou incendie de l\'alternateur coûtant plusieurs dizaines de millions d\'euros.',
      en: 'Prevents multi-million-euro equipment destruction from fires or explosions during faults.'
    },
    whereUsed: { fr: 'Armoires de relayage en salle de commande.', en: 'Protection cubicles in central control room.' },
    connectsTo: ['Transformateurs de courant (TC)', 'Transformateurs de tension (TP)', 'Bobines de déclenchement'],
    measures: ['Courants différentiels ΔI', 'Impédance vue Z', 'Composantes symétriques (I1, I2, I0)'],
    protectedBy: ['Auto-surveillance chien de garde (Watchdog)', 'Alimentation secourue 110 Vcc redondante'],
    controls: ['Relais de déclenchement rapide et bistable de verrouillage (86)'],
    communicatesVia: ['IEC 61850 Station Bus (GOOSE & MMS)'],
    failureModes: [
      {
        mode: { fr: 'Panne d\'alimentation interne de l\'IED', en: 'Internal DC power supply failure' },
        consequence: { fr: 'Perte de protection sur la tranche', en: 'Loss of critical protection coverage' },
        mitigation: { fr: 'Doublement intégral: Système de protection A + Système de protection B indépendants', en: 'Full redundancy: Main 1 (Protection A) + Main 2 (Protection B)' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 2 ans', en: 'Every 2 years' }, action: { fr: 'Injection secondaire de courants/tensions via valise Omicron', en: 'Secondary injection testing via Omicron / Doble test set' } }
    ],
    standards: [{ code: 'IEC 60255-1', title: 'Measuring relays and protection equipment', org: 'IEC' }],
    disciplines: ['Ingénierie des Protections', 'Cybersécurité Industrielle'],
    levels: {
      level1: { fr: 'Ordinateur sentinelle qui détecte les pannes et coupe l\'électricité avant que ça brûle.', en: 'Digital watchdog that senses faults and cuts power before catastrophic fires.' },
      level2: { fr: 'Relais multifonction intégrant ANSI 87G, 64S, 40, 51V, 81U/O, 32R avec enregistrement oscillographique 10 kHz.', en: 'Multifunction numerical relay combining ANSI 87G, 64S, 40, 51V with 10 kHz fault recording.' },
      level3: { fr: 'Caractéristique différentielle à pente double avec retenue harmonique 2 et 5. Matrice de déclenchement configurable.', en: 'Dual-slope percentage differential characteristic with 2nd/5th harmonic restraint and tripping matrix.' }
    }
  },
  'eq-gsu-trafo': {
    id: 'eq-gsu-trafo',
    stageId: 'switchyard',
    name: { fr: 'Transformateur Élévateur Principal (GSU)', en: 'Generator Step-Up Transformer (GSU)' },
    tag: 'TR-GSU-01',
    voltageLevel: '15 kV / 225 kV',
    shortDesc: {
      fr: 'Transformateur géant à bain d\'huile élevant la tension de 15 000 V à 225 000 V.',
      en: 'Immense oil-filled transformer stepping voltage up from 15,000 V to 225,000 V.'
    },
    function: {
      fr: 'Augmente la tension par 15, divisant le courant par 15 et divisant les pertes en ligne par 225 (loi de Joule).',
      en: 'Steps up voltage by 15, reducing transmission current by 15 and cutting line losses by 225.'
    },
    whyExists: {
      fr: 'Sans élévation de tension, transporter 100 MW sur 100 km exigerait des câbles de cuivre de 1 mètre de diamètre!',
      en: 'Without stepping up voltage, transmitting 100 MW over 100 km would require cables as thick as tree trunks!'
    },
    whereUsed: { fr: 'Poste extérieur d\'évacuation de chaque centrale de grande puissance.', en: 'Outdoor switchyard of major power plants.' },
    connectsTo: ['Jeux de barres alternateur 15 kV', 'Poste de départ 225 kV', 'Réseau de terre'],
    measures: ['T° huile sommet de cuve (°C)', 'T° point chaud enroulement (°C)', 'Niveau d\'huile conservateur', 'Pression cuve'],
    protectedBy: ['Relais Buchholz (dégagement gazeux)', 'Soupape de surpression', 'Différentielle transfo (87T)', 'Masse-cuve (64)'],
    controls: ['Pompes de circulation d\'huile et ventilateurs ODAF (Oil Directed Air Forced)'],
    communicatesVia: ['Capteurs numériques Modbus / DGA en ligne vers SCADA'],
    failureModes: [
      {
        mode: { fr: 'Arc électrique interne sous l\'huile', en: 'Internal arcing in transformer oil' },
        consequence: { fr: 'Dégagement massif de gaz risquant l\'explosion de la cuve', en: 'Massive gas generation risking tank explosion and fire' },
        mitigation: { fr: 'Relais Buchholz rapide, clapet à surpression et fosse pare-feu avec lit de galets', en: 'Rapid Buchholz trip, pressure relief device, and pebble-filled fire catchment basin' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Annuelle', en: 'Annual' }, action: { fr: 'Analyse chromatographique des gaz dissous dans l\'huile (DGA)', en: 'Dissolved Gas Analysis (DGA) and dielectric breakdown voltage test' } }
    ],
    standards: [{ code: 'IEC 60076-1', title: 'Power transformers - General', org: 'IEC' }],
    disciplines: ['Ingénierie des Transformateurs', 'Génie Électrique', 'Sécurité Incendie'],
    levels: {
      level1: { fr: 'Appareil géant qui monte la tension à 225 000 Volts pour que l\'électricité voyage loin sans faiblir.', en: 'Giant machine that boosts voltage to 225,000 Volts so power can travel far with minimal loss.' },
      level2: { fr: 'Transformateur triphasé couplage YNd11, puissance 150 MVA, isolement huile minérale avec système de refroidissement forcé ODAF.', en: '150 MVA YNd11 power transformer with mineral oil insulation and ODAF forced cooling.' },
      level3: { fr: 'Tension de court-circuit Ucc = 14%. Tenue diélectrique aux chocs de foudre BIL = 1050 kV. Suivi continu DGA (Duval Triangle).', en: 'Short-circuit impedance Ucc = 14%. Lightning impulse withstand BIL = 1050 kV. Online DGA gas tracking.' }
    }
  },
  'eq-surge-arrester-hv': {
    id: 'eq-surge-arrester-hv',
    stageId: 'switchyard',
    name: { fr: 'Parafoudre Haute Tension ZnO', en: 'HV Metal-Oxide Surge Arrester' },
    tag: 'SA-225-01',
    voltageLevel: '225 kV',
    shortDesc: {
      fr: 'Sentinelle à résistance non linéaire protégeant le matériel contre les surtensions de foudre.',
      en: 'Nonlinear resistor sentinel shielding expensive gear against lightning and switching overvoltages.'
    },
    function: {
      fr: 'Devient conducteur en nanosecondes quand la tension dépasse un seuil dangereux pour écouler la foudre à la terre, puis redevient isolant.',
      en: 'Becomes highly conductive in nanoseconds when overvoltage strikes, safely diverting surge current to earth.'
    },
    whyExists: {
      fr: 'Protège l\'isolation diélectrique fragile et coûteuse des transformateurs contre les chocs de foudre de plusieurs millions de volts.',
      en: 'Shields expensive transformer insulation from catastrophic dielectric puncture caused by lightning impulses.'
    },
    whereUsed: { fr: 'À l\'entrée de chaque travée de ligne et immédiatement aux bornes des transformateurs.', en: 'Line entries and right at transformer high-voltage bushings.' },
    connectsTo: ['Ligne ou traversée THT', 'Ceinture de terre principale du poste'],
    measures: ['Courant de fuite résistif (μA)', 'Compteur d\'impacts de foudre'],
    protectedBy: ['Enveloppe porcelaine ou composite siliconée avec décharge de surpression'],
    controls: ['Autonome (matériau à varistance céramique oxyde de zinc ZnO)'],
    communicatesVia: ['Capteur de fuite connecté sans fil ou bus analogique'],
    failureModes: [
      {
        mode: { fr: 'Emballement thermique par dégradation des pastilles ZnO', en: 'Thermal runaway from degraded ZnO varistors' },
        consequence: { fr: 'Court-circuit franc phase-terre à l\'intérieur du parafoudre', en: 'Direct phase-to-ground fault inside arrester' },
        mitigation: { fr: 'Sectionneur automatique de terre et mesure périodique du 3e harmonique du courant de fuite', en: 'Disconnector device and periodic 3rd harmonic leakage current monitoring' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Annuelle', en: 'Annual' }, action: { fr: 'Lecture du compteur de décharges et mesure du courant de fuite capacitif/résistif', en: 'Surge counter reading and resistive leakage current diagnostic' } }
    ],
    standards: [{ code: 'IEC 60099-4', title: 'Surge arresters - Metal-oxide surge arresters without gaps for AC', org: 'IEC' }],
    disciplines: ['Coordination de l\'Isolement', 'Haute Tension'],
    levels: {
      level1: { fr: 'Évacuateur de surtensions qui dérive les coups de foudre vers le sol en une fraction de seconde.', en: 'Surge protector valve that diverts lightning strikes to the ground in microseconds.' },
      level2: { fr: 'Varistance à oxyde de zinc sans éclateur. Niveau de protection au choc Ur = 198 kV, courant nominal de décharge 10 kA.', en: 'Gapless metal-oxide varistor. Rated voltage Ur = 198 kV, nominal discharge current 10 kA (8/20 μs).' },
      level3: { fr: 'Loi caractéristique I = k·U^α (α > 30). Énergie admissible classe de décharge de ligne 4 (E > 8 kJ/kV).', en: 'Non-linear V-I characteristic I = k·V^α (α > 30). Line discharge class 4 with energy withstand > 8 kJ/kV.' }
    }
  },
  'eq-hv-breaker': {
    id: 'eq-hv-breaker',
    stageId: 'switchyard',
    name: { fr: 'Disjoncteur Haute Tension SF6 225 kV', en: '225 kV SF6 High-Voltage Circuit Breaker' },
    tag: 'CB-225-01',
    voltageLevel: '225 kV',
    shortDesc: {
      fr: 'Interrupteur de puissance sous gaz SF6 capable de couper les courts-circuits du réseau THT.',
      en: 'SF6 gas insulated breaker capable of extinguishing massive EHV grid faults in 40 ms.'
    },
    function: {
      fr: 'Ouvre le circuit en moins de 40 millisecondes en soufflant un gaz isolant (SF6) sur l\'arc électrique.',
      en: 'Opens the circuit in under 40 milliseconds by blasting dielectric SF6 gas across the electrical arc.'
    },
    whyExists: {
      fr: 'Sans disjoncteur haute tension, un court-circuit sur une ligne détruirait instantanément la centrale et priverait le pays d\'électricité.',
      en: 'Without EHV breakers, a single line short circuit would destroy equipment and cause a national blackout.'
    },
    whereUsed: { fr: 'Postes de transport d\'électricité 90 kV, 225 kV et 400 kV.', en: 'Transmission substations worldwide.' },
    connectsTo: ['Transformateur GSU', 'Sectionneurs de travée', 'Jeux de barres 225 kV'],
    measures: ['Pression SF6 (bar)', 'Pression du ressort de manœuvre', 'Position des pôles'],
    protectedBy: ['Verrouillage par manque de pression SF6', 'Protection défaillance disjoncteur (50BF)'],
    controls: ['Bobines de déclenchement commandées par les relais différentiels et de distance'],
    communicatesVia: ['GOOSE IEC 61850 Process Bus vers salle de commande'],
    failureModes: [
      {
        mode: { fr: 'Refus d\'ouverture lors d\'un court-circuit', en: 'Breaker failure to open during fault' },
        consequence: { fr: 'Maintien du court-circuit risquant l\'incendie du transformateur', en: 'Persistent fault threatening transformer fire' },
        mitigation: { fr: 'Protection défaillance disjoncteur 50BF qui fait déclencher tous les disjoncteurs adjacents en 150 ms', en: 'Breaker Failure (50BF) protection tripping all adjacent breakers in 150 ms' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 3 ans', en: 'Every 3 years' }, action: { fr: 'Contrôle du synchronisme des pôles (temps de manœuvre < 2.5 ms d\'écart)', en: 'Pole synchronism timing test and SF6 moisture/decomposition gas test' } }
    ],
    standards: [{ code: 'IEC 62271-100', title: 'High-voltage switchgear - Alternating-current circuit-breakers', org: 'IEC' }],
    disciplines: ['Appareillage Électrique', 'Postes Haute Tension'],
    levels: {
      level1: { fr: 'Coupe-circuit de taille industrielle qui éteint les arcs électriques géants en un éclair.', en: 'Industrial-grade power switch that extinguishes giant electrical arcs in a flash.' },
      level2: { fr: 'Disjoncteur 225 kV à coupure auto-pneumatique sous SF6. Courant assigné de court-circuit 31.5 kA ou 40 kA.', en: '225 kV auto-puffer SF6 breaker. Rated short-circuit breaking current 31.5 kA or 40 kA.' },
      level3: { fr: 'Séquence de manœuvre O - 0.3s - CO - 3min - CO (cycle de réenclenchement rapide). Commande hydraulique ou ressort.', en: 'Standard duty cycle O - 0.3s - CO - 3min - CO for rapid auto-reclosing. Spring-assisted mechanical operating mechanism.' }
    }
  },
  'eq-lattice-tower': {
    id: 'eq-lattice-tower',
    stageId: 'transmission',
    name: { fr: 'Pylône Treillis & Massif de Fondation', en: 'Lattice Tower & Foundation' },
    tag: 'TWR-225-SUSP',
    voltageLevel: '225 kV',
    shortDesc: {
      fr: 'Structure métallique maintenant les câbles conducteurs hors de portée du sol et des obstacles.',
      en: 'Steel structure keeping energized conductors safely suspended above ground and obstacles.'
    },
    function: {
      fr: 'Garantit les distances d\'isolement dans l\'air par rapport au sol, aux arbres, aux routes et cours d\'eau.',
      en: 'Maintains required electrical safety clearances to ground, trees, roads, and waterways.'
    },
    whyExists: {
      fr: 'L\'air à 225 000 V est un isolant si les conducteurs restent à au moins 7.5 mètres du sol et 2.5 mètres des structures métalliques.',
      en: 'Air insulates 225 kV lines only if conductors maintain at least 7.5 m ground clearance and 2.5 m tower clearance.'
    },
    whereUsed: { fr: 'Lignes de transport aériennes sur des centaines de kilomètres.', en: 'Overhead transmission corridors across mountains, forests, and savannas.' },
    connectsTo: ['Chaînes d\'isolateurs', 'Câble de garde OPGW', 'Prises de terre en pattes d\'oie'],
    measures: ['Inclinaison pylône (inclinomètre)', 'Résistance de terre du pied (Ω)', 'Tension mécanique des câbles'],
    protectedBy: ['Galvanisation à chaud anti-corrosion', 'Dispositifs anti-escalade'],
    controls: ['Structure passive'],
    communicatesVia: ['Balises radio d\'alerte aviation si nécessaire'],
    failureModes: [
      {
        mode: { fr: 'Effondrement par tempête ou surcharge de vent extrême', en: 'Tower collapse during extreme gale or microburst' },
        consequence: { fr: 'Rupture de ligne et arrêt brutal du transit d\'énergie', en: 'Severe line breakage and immediate power outage' },
        mitigation: { fr: 'Pylônes d\'arrêt anti-cascade tous les 5 à 10 km pour bloquer l\'effet domino', en: 'Tension/anchor towers every 5 to 10 km to stop cascading domino collapses' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Annuelle', en: 'Annual' }, action: { fr: 'Inspection pédestre et par drone (corrosion, boulonnerie, végétation)', en: 'Foot and drone patrol inspecting corrosion, missing bolts, and encroaching vegetation' } }
    ],
    standards: [{ code: 'IEC 60826', title: 'Design criteria of overhead transmission lines', org: 'IEC' }],
    disciplines: ['Génie Civil', 'Génie Mécanique', 'Lignes Aériennes'],
    levels: {
      level1: { fr: 'Grande tour en métal qui porte les câbles électriques très haut dans le ciel.', en: 'Tall steel tower that holds power cables high in the sky.' },
      level2: { fr: 'Pylône en treillis d\'acier galvanisé calculé aux vents extrêmes et à la rupture unilatérale de conducteur.', en: 'Galvanized lattice steel tower engineered for extreme wind pressure and broken-wire torsional loads.' },
      level3: { fr: 'Calcul mécanique selon Eurocode 3 / IEC 60826. Résistance de terre du pied R_t < 10 Ω pour limiter les amorçages en retour.', en: 'Structural analysis per IEC 60826. Footing resistance R_t < 10 Ω to prevent backflashover from lightning.' }
    }
  },
  'eq-bundle-conductor': {
    id: 'eq-bundle-conductor',
    stageId: 'transmission',
    name: { fr: 'Faisceau de Conducteurs Almelec/ACSR', en: 'Bundled Phase Conductors' },
    tag: 'COND-225-BNDL',
    voltageLevel: '225 kV',
    shortDesc: {
      fr: 'Câbles transportant les courants triphasés de centaines d\'ampères sur de longues distances.',
      en: 'Overhead cables carrying hundreds of amperes across long transmission corridors.'
    },
    function: {
      fr: 'Canalise le flux d\'énergie électrique. L\'agencement en faisceau réduit l\'effet couronne et les pertes par étincellement.',
      en: 'Channels active and reactive electric power. Bundling conductors suppresses corona discharge losses.'
    },
    whyExists: {
      fr: 'L\'effet de faisceau augmente le rayon équivalent du conducteur, réduisant le champ électrique superficiel et le crépitement.',
      en: 'Bundling increases the effective electromagnetic radius, minimizing corona noise and radio interference.'
    },
    whereUsed: { fr: 'Lignes de transport 225 kV et 400 kV.', en: 'EHV and UHV transmission lines.' },
    connectsTo: ['Isolateurs de suspension', 'Poste de départ et d\'arrivée'],
    measures: ['Courant de ligne I (A)', 'Température du conducteur (°C)', 'Flèche géométrique (m)'],
    protectedBy: ['Amortisseurs de vibrations Stockbridge', 'Entretoises d\'écartement'],
    controls: ['Surveillance DLR (Dynamic Line Rating)'],
    communicatesVia: ['Courants porteurs en ligne (CPL) ou passif'],
    failureModes: [
      {
        mode: { fr: 'Flèche excessive par échauffement lors d\'une forte canicule', en: 'Thermal conductor sag during peak summer load' },
        consequence: { fr: 'Amorçage avec la végétation sous la ligne', en: 'Arc flashover to vegetation underneath line' },
        mitigation: { fr: 'Élagage strict des couloirs de ligne et régulation DLR de l\'ampacité', en: 'Right-of-way vegetation clearing and Dynamic Line Rating sensors' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Semestrielle', en: 'Biannual' }, action: { fr: 'Thermographie infrarouge par hélicoptère/drone pour détecter les points chauds aux manchons', en: 'Helicopter/drone infrared thermography to detect hot spots on compression joints' } }
    ],
    standards: [{ code: 'IEC 61089', title: 'Round wire concentric lay overhead electrical stranded conductors', org: 'IEC' }],
    disciplines: ['Lignes Aériennes', 'Électrotechnique'],
    levels: {
      level1: { fr: 'Les câbles épais qui transportent le courant de ville en ville.', en: 'Thick cables carrying power from city to city.' },
      level2: { fr: 'Conducteurs en alliage d\'aluminium (Almelec ou ACSR) en faisceaux de 2 conducteurs espacés de 40 cm.', en: 'Aluminium-alloy conductors (Almelec / ACSR) in twin bundle configuration spaced 40 cm apart.' },
      level3: { fr: 'Équation de la chaînette: y = a·cosh(x/a). Tension de pose mécanique contrôlée à 20% de la charge de rupture.', en: 'Catenary equation y = a·cosh(x/a). Stringing tension calibrated to 20% UTS (Ultimate Tensile Strength).' }
    }
  },
  'eq-opgw-shield': {
    id: 'eq-opgw-shield',
    stageId: 'transmission',
    name: { fr: 'Câble de Garde Optique (OPGW)', en: 'Optical Ground Wire (OPGW)' },
    tag: 'OPGW-225-01',
    shortDesc: {
      fr: 'Câble sommital servant à la fois de paratonnerre et d\'autoroute de télécommunication par fibre optique.',
      en: 'Topmost cable serving as both a lightning shield and a high-speed fiber-optic telecom trunk.'
    },
    function: {
      fr: 'Intercepte les coups de foudre directs avant qu\'ils ne touchent les phases, tout en transmettant les données SCADA et de protection.',
      en: 'Intercepts direct lightning strikes before they hit phase wires while transmitting SCADA and teleprotection data.'
    },
    whyExists: {
      fr: 'Protège la ligne contre les défauts de foudre et permet aux relais des deux extrémités de communiquer en moins de 5 millisecondes.',
      en: 'Shields line conductors from lightning and enables teleprotection relays to communicate in under 5 ms.'
    },
    whereUsed: { fr: 'Au sommet de tous les pylônes haute tension modernes.', en: 'Apex of all modern transmission towers.' },
    connectsTo: ['Sommets des pylônes (liaison métallique)', 'Tiroirs optiques en sous-station'],
    measures: ['Continuité optique', 'Courant d\'écoulement de foudre'],
    protectedBy: ['Tubes inox hermétiques protégeant les fibres contre l\'échauffement de l\'éclair'],
    controls: ['Passif pour la foudre, actif pour les télécoms'],
    communicatesVia: ['Fibres optiques monomodes G.652 / G.655 (vitesses gigabit)'],
    failureModes: [
      {
        mode: { fr: 'Fusion de brins d\'aluminium sous un impact de foudre sévère', en: 'Strand melting under extreme lightning strike' },
        consequence: { fr: 'Affaiblissement mécanique ou rupture des fibres optiques', en: 'Mechanical weakening or severed optical fiber links' },
        mitigation: { fr: 'Dimensionnement thermique I²·t suffisant pour absorber les éclairs de 200 kA', en: 'I²·t thermal rating engineered to withstand 200 kA lightning discharges' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 3 ans', en: 'Every 3 years' }, action: { fr: 'Réflectométrie optique (OTDR) pour vérifier l\'atténuation des fibres', en: 'Optical Time Domain Reflectometer (OTDR) fiber attenuation test' } }
    ],
    standards: [{ code: 'IEEE 1138', title: 'Testing and performance for optical ground wire (OPGW)', org: 'IEEE' }],
    disciplines: ['Télécommunications', 'Protection Foudre', 'Lignes Aériennes'],
    levels: {
      level1: { fr: 'Le câble tout en haut des pylônes qui attire la foudre et contient Internet pour les ingénieurs.', en: 'The top cable on pylons that catches lightning and carries high-speed communications.' },
      level2: { fr: 'Câble composite composé de brins d\'acier/aluminium conducteur avec un tube central étanche contenant 48 fibres optiques.', en: 'Composite cable with conductive steel/aluminum strands surrounding a hermetic tube of 48 optical fibers.' },
      level3: { fr: 'Angle de protection électrogéométrique selon le modèle d\'Armstrong-Whitehead (< 30°). Téléprotection différentielle 87L.', en: 'Electro-geometric lightning shielding angle (<30° per IEEE 1243). Teleprotection differential 87L carrier.' }
    }
  },
  'eq-vibration-damper': {
    id: 'eq-vibration-damper',
    stageId: 'transmission',
    name: { fr: 'Amortisseur de Vibrations Stockbridge', en: 'Stockbridge Vibration Damper' },
    tag: 'DAMP-STCK-01',
    shortDesc: {
      fr: 'Masse d\'équilibrage oscillante absorbant les vibrations causées par le vent sur les câbles.',
      en: 'Tuned mass damper absorbing wind-induced aeolian vibrations on overhead lines.'
    },
    function: {
      fr: 'Dissipe l\'énergie mécanique des tourbillons de vent (vibrations éoliennes de 5 à 50 Hz) avant qu\'elle ne casse les câbles par fatigue.',
      en: 'Dissipates aerodynamic vortex shedding energy (5 to 50 Hz aeolian vibrations) to prevent conductor fatigue breakage.'
    },
    whyExists: {
      fr: 'Sans amortisseurs, les micro-flexions répétées casseraient les brins d\'aluminium au niveau des pinces de suspension en quelques mois.',
      en: 'Without dampers, cyclic micro-bending fatigue would snap conductor strands near suspension clamps in months.'
    },
    whereUsed: { fr: 'Sur les conducteurs et câbles de garde, près de chaque point d\'attache aux pylônes.', en: 'Mounted on conductors and shield wires near suspension hardware.' },
    connectsTo: ['Conducteur de phase', 'Câble porteur en acier doux'],
    measures: ['Amortissement vibratoire mécanique'],
    protectedBy: ['Fixation par pince en aluminium insensible à la corrosion'],
    controls: ['Mécanique passive auto-amortissante'],
    failureModes: [
      {
        mode: { fr: 'Glissement de la pince sur le conducteur', en: 'Clamp slipping along conductor' },
        consequence: { fr: 'Perte de l\'accord d\'amortissement et risque d\'usure du câble', en: 'Loss of tuned damping efficiency and fretting fatigue' },
        mitigation: { fr: 'Serrage au couple calibré avec clé dynamométrique lors de la pose', en: 'Calibrated torque-wrench bolt tightening during installation' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 5 ans', en: 'Every 5 years' }, action: { fr: 'Contrôle visuel par drone de l\'alignement et de l\'état des masses', en: 'Drone inspection checking clamp tightness and mass condition' } }
    ],
    standards: [{ code: 'IEC 61897', title: 'Overhead lines - Requirements and tests for Stockbridge type aeolian vibration dampers', org: 'IEC' }],
    disciplines: ['Génie Mécanique', 'Aérodynamique des Lignes'],
    levels: {
      level1: { fr: 'Petits poids en métal suspendus aux câbles pour les empêcher de trembler au vent.', en: 'Little metal weights dangling from cables to stop wind-induced shaking.' },
      level2: { fr: 'Système résonant à deux masses dissymétriques dissipant l\'énergie par frottement interne des torons d\'acier.', en: 'Asymmetrical two-mass resonant system dissipating energy through inter-strand steel friction.' },
      level3: { fr: 'Couvre la plage de fréquence de Strouhal f = 0.185 · v / d. Conforme aux essais de fatigue mécanique IEC 61897.', en: 'Tunes to Strouhal vortex frequency range f = 0.185·v/d. Complies with IEC 61897 fatigue tests.' }
    }
  },
  'eq-stepdown-trafo': {
    id: 'eq-stepdown-trafo',
    stageId: 'substation',
    name: { fr: 'Autotransformateur d\'Interconnexion 225/30 kV', en: '225/30 kV Grid Step-Down Transformer' },
    tag: 'TR-SUB-225-30',
    voltageLevel: '225 kV / 30 kV',
    shortDesc: {
      fr: 'Cœur du poste de transport transformant l\'électricité THT en Moyenne Tension HTA.',
      en: 'Core of grid substation converting EHV transmission bulk power down to Medium Voltage.'
    },
    function: {
      fr: 'Abaisse la tension de 225 000 V à 30 000 V pour alimenter le réseau de distribution urbain et régional.',
      en: 'Steps voltage down from 225,000 V to 30,000 V to feed regional and municipal distribution rings.'
    },
    whyExists: {
      fr: 'La très haute tension ne peut pas entrer directement dans les villes pour des raisons évidentes de sécurité et d\'encombrement.',
      en: 'EHV cannot directly enter cities or neighborhoods for safety and physical clearance reasons.'
    },
    whereUsed: { fr: 'Postes sources de transformation à la périphérie des grandes agglomérations.', en: 'Primary bulk transmission substations on the outskirts of cities.' },
    connectsTo: ['Jeux de barres 225 kV', 'Régleur en charge (OLTC)', 'Rame Moyenne Tension 30 kV'],
    measures: ['T° huile (°C)', 'Courant primaire/secondaire', 'Position de prise régleur (1 à 19)', 'Teneur en eau ppm'],
    protectedBy: ['Différentielle transfo (87T)', 'Maximum de courant phase/terre (50/51/51N)', 'Buchholz'],
    controls: ['Régulateur automatique de tension de poste (AVR de transfo) commandant l\'OLTC'],
    communicatesVia: ['IEC 61850 vers salle de relayage et SCADA Dispatching'],
    failureModes: [
      {
        mode: { fr: 'Dégradation thermique du papier isolant des enroulements', en: 'Thermal degradation of cellulose winding insulation' },
        consequence: { fr: 'Baisse irréversible de l\'espérance de vie du transformateur', en: 'Irreversible loss of transformer operating lifetime' },
        mitigation: { fr: 'Surveillance continue de la température point chaud et des furaniques dans l\'huile', en: 'Hot-spot temperature monitoring and oil furan analysis' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Semestrielle', en: 'Biannual' }, action: { fr: 'Traitement et dégazage de l\'huile diélectrique sous vide', en: 'Oil dielectric purification and vacuum degassing' } }
    ],
    standards: [{ code: 'IEC 60076-2', title: 'Power transformers - Temperature rise for liquid-immersed transformers', org: 'IEC' }],
    disciplines: ['Transformateurs de Puissance', 'Postes Électriques'],
    levels: {
      level1: { fr: 'Énorme appareil qui calme la puissance du courant pour le rendre utilisable par la ville.', en: 'Huge apparatus that tames high-voltage power for urban distribution.' },
      level2: { fr: 'Transformateur 63 MVA couplé YNyn0(d11) avec enroulement tertiaire de compensation en triangle.', en: '63 MVA YNyn0(d11) power transformer with delta tertiary stabilizing winding.' },
      level3: { fr: 'Enroulement tertiaire delta absorbant le 3e harmonique de courant magnétisant. Équipé d\'un régleur en charge sous vide.', en: 'Delta tertiary winding absorbing 3rd harmonic magnetizing currents. Vacuum on-load tap changer.' }
    }
  },
  'eq-oltc': {
    id: 'eq-oltc',
    stageId: 'substation',
    name: { fr: 'Régleur en Charge (OLTC)', en: 'On-Load Tap Changer (OLTC)' },
    tag: 'OLTC-TR-01',
    voltageLevel: '30 kV',
    shortDesc: {
      fr: 'Mécanisme électromécanique changeant les prises du transformateur sans couper le courant.',
      en: 'Electromechanical mechanism shifting transformer turns ratio without interrupting load current.'
    },
    function: {
      fr: 'Ajuste le ratio du transformateur de ±10% par pas de 1.25% pour maintenir la tension moyenne tension stable malgré la charge.',
      en: 'Adjusts transformer ratio by ±10% in steps of 1.25% to keep distribution voltage constant.'
    },
    whyExists: {
      fr: 'Quand tout le monde allume ses climatiseurs le soir, la tension chute: l\'OLTC monte les prises pour compenser instantanément.',
      en: 'When evening demand surges and voltage drops, the OLTC shifts taps to restore nominal voltage.'
    },
    whereUsed: { fr: 'Intégré à l\'intérieur de la cuve des transformateurs de transport et de distribution.', en: 'Fitted inside the tank of main substation transformers.' },
    connectsTo: ['Prises intermédiaires de l\'enroulement', 'Moteur de commande de régleur'],
    measures: ['Numéro de prise active (1 à 17)', 'Courant moteur', 'T° compartiment régleur'],
    protectedBy: ['Relais de flux d\'huile dédié au régleur (relais pressostatique)'],
    controls: ['Régulateur automatique numérique de tension (ex: REG-D / MicroTAPP)'],
    communicatesVia: ['Liaison série ou bus de terrain vers l\'automate de tranche'],
    failureModes: [
      {
        mode: { fr: 'Usure des résistances de transition ou contacts sous vide', en: 'Wear on transition resistors or vacuum interrupters' },
        consequence: { fr: 'Court-circuit franc entre prises de bobinage destructeur', en: 'Devastating inter-tap dead short circuit' },
        mitigation: { fr: 'Technologie d\'ampoules sous vide ne générant pas de suie dans l\'huile', en: 'Vacuum interrupter technology eliminating carbon contamination in oil' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 100 000 manœuvres', en: 'Every 100,000 operations' }, action: { fr: 'Révision du mécanisme de commande et contrôle des ampoules sous vide', en: 'Drive mechanism overhaul and vacuum bottle contact wear assessment' } }
    ],
    standards: [{ code: 'IEC 60214-1', title: 'Tap-changers - Performance requirements and test methods', org: 'IEC' }],
    disciplines: ['Génie Électromécanique', 'Qualité de l\'Énergie'],
    levels: {
      level1: { fr: 'Boîte de vitesses automatique du transformateur qui garde la tension stable.', en: 'Automatic gearbox for the transformer keeping voltage rock-steady.' },
      level2: { fr: 'Commutateur sous vide à résistances de transition de type Jansen opérant en 50 millisecondes.', en: 'Jansen-type high-speed vacuum tap changer with transition resistors switching in 50 ms.' },
      level3: { fr: 'Évite l\'interruption du courant principal I_load pendant le basculement grâce aux résistances de passage R_trans.', en: 'Bypasses main load current interruption using transient transition resistors during inter-tap changeover.' }
    }
  },
  'eq-dist-trafo': {
    id: 'eq-dist-trafo',
    stageId: 'distribution',
    name: { fr: 'Transformateur HTA/BT de Quartier (Dyn11)', en: 'MV/LV Distribution Transformer (Dyn11)' },
    tag: 'TR-DIST-30-0.4',
    voltageLevel: '30 kV / 400 V',
    shortDesc: {
      fr: 'Le dernier transformateur avant les habitations: convertit le 30 000 V en 400 V triphasé / 230 V monophasé.',
      en: 'The final transformer before homes: converts 30,000 V into safe 400 V / 230 V electricity.'
    },
    function: {
      fr: 'Délivre les tensions d\'utilisation domestiques (230 V entre Phase et Neutre, 400 V entre phases).',
      en: 'Supplies standard consumer voltages (230 V line-to-neutral, 400 V line-to-line).'
    },
    whyExists: {
      fr: 'Rend l\'électricité directement exploitable par les prises, appareils ménagers et éclairages sans danger de claquage HT.',
      en: 'Brings voltage down to safe levels for domestic appliances, light bulbs, and consumer devices.'
    },
    whereUsed: { fr: 'Sur poteau (H61) ou en cabine maçonnée/préfabriquée dans chaque quartier.', en: 'Pole-mounted (H61) or in compact neighborhood kiosks.' },
    connectsTo: ['Ligne HTA 30 kV', 'Fusibles HPC ou disjoncteur HTA', 'Tableau de distribution basse tension'],
    measures: ['T° de l\'huile (thermomètre à cadran)', 'Courant de charge des départs BT'],
    protectedBy: ['Fusibles HTA à haut pouvoir de coupure', 'Disjoncteur général BT ou relais thermique'],
    controls: ['Prises de réglage hors tension à vide (±2.5%, ±5%)'],
    communicatesVia: ['Indicateur de passage de défaut communicant (GPRS/4G)'],
    failureModes: [
      {
        mode: { fr: 'Surcharge prolongée par surconsommation du quartier', en: 'Severe prolonged overload from neighborhood demand' },
        consequence: { fr: 'Surchauffe de l\'huile, déclenchement ou incendie', en: 'Oil overheating, thermal trip, or tank rupture' },
        mitigation: { fr: 'Protection DGPT2 (Détection Gaz, Pression, Température) et équilibrage des phases', en: 'DGPT2 multi-fault relay and load balancing across phases' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 2 ans', en: 'Every 2 years' }, action: { fr: 'Mesure de la prise de terre du neutre et du parafoudre BT', en: 'Neutral grounding rod resistance test and silica gel breather inspection' } }
    ],
    standards: [{ code: 'IEC 60076-11', title: 'Power transformers - Dry-type transformers / Liquid-immersed', org: 'IEC' }],
    disciplines: ['Distribution Électrique', 'Électrotechnique'],
    levels: {
      level1: { fr: 'La boîte grise sur le poteau ou dans la cabine qui fournit le 230 V de nos prises.', en: 'The gray box on the pole or kiosk giving us 230 V power.' },
      level2: { fr: 'Transformateur 400 kVA à remplissage intégral, couplage Dyn11 avec neutre sorti mis à la terre.', en: 'Hermetically sealed 400 kVA Dyn11 transformer with grounded neutral.' },
      level3: { fr: 'Couplage Dyn11: primaire triangle isolant les harmoniques 3, secondaire étoile offrant neutre distribué et déphasage de 30°.', en: 'Dyn11 vector group: delta primary traps triplen harmonics; star secondary provides distributed neutral with 30° phase shift.' }
    }
  },
  'eq-energy-meter': {
    id: 'eq-energy-meter',
    stageId: 'consumption',
    name: { fr: 'Compteur Électronique d\'Énergie (Smart Meter)', en: 'Smart Energy Meter' },
    tag: 'MTR-SMART-01',
    voltageLevel: '230 V',
    shortDesc: {
      fr: 'Appareil de mesure légale comptabilisant l\'énergie consommée en kilowattheures (kWh).',
      en: 'Revenue meter measuring active and reactive energy consumed in kilowatt-hours (kWh).'
    },
    function: {
      fr: 'Mesure U et I en continu, intègre la puissance P = U·I·cosφ dans le temps pour calculer les kWh consommés.',
      en: 'Measures continuous voltage and current, integrating active power P = V·I·cosφ over time into consumed kWh.'
    },
    whyExists: {
      fr: 'Permet la facturation équitable de l\'électricité et la gestion de la puissance souscrite (ex: 6 kVA ou 9 kVA).',
      en: 'Enables accurate billing and enforces contractual power limits (e.g. 6 kVA or 9 kVA).'
    },
    whereUsed: { fr: 'À l\'entrée de chaque maison, appartement ou commerce.', en: 'At the electrical service entrance of every household.' },
    connectsTo: ['Réseau de distribution basse tension', 'Disjoncteur d\'abonné différentiel'],
    measures: ['Énergie active (kWh)', 'Puissance instantanée (W)', 'Tension (V)', 'Courant (A)'],
    protectedBy: ['Fusible d\'accompagnement en amont et boîtier plombé anti-fraude'],
    controls: ['Relais de coupure interne pour limitation de puissance ou prépaiement'],
    communicatesVia: ['Courants porteurs en ligne (CPL G3) ou liaison cellulaire 4G/NB-IoT'],
    failureModes: [
      {
        mode: { fr: 'Surtension foudre sur le réseau basse tension', en: 'Lightning surge on LV incoming line' },
        consequence: { fr: 'Destruction de la carte électronique de mesure', en: 'Burnout of internal metering circuitry' },
        mitigation: { fr: 'Varistance interne et parafoudre de tableau résidentiel type 2', en: 'Internal varistor and Type 2 residential surge protector' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 10 ans', en: 'Every 10 years' }, action: { fr: 'Étalonnage métrologique légal des classes de précision 1.0 ou 0.5', en: 'Metrological calibration audit verifying accuracy class 1.0' } }
    ],
    standards: [{ code: 'IEC 62053-21', title: 'Electricity metering equipment - Static meters for active energy', org: 'IEC' }],
    disciplines: ['Métrologie Électrique', 'Télérelève & Smart Grid'],
    levels: {
      level1: { fr: 'Le compteur qui calcule la facture d\'électricité en fonction de ce qu\'on allume.', en: 'The meter that logs kilowatt-hours used for your electric bill.' },
      level2: { fr: 'Compteur communicant statique à échantillonnage numérique haute fréquence (Linky / STS prépayé).', en: 'Smart electronic meter with high-frequency digital sampling (DLMS/COSEM protocol).' },
      level3: { fr: 'Calcul métrologique vectoriel classe 1 selon IEC 62053-21. Mesure bidirectionnelle injection/soutirage.', en: 'Class 1 active energy vector calculation according to IEC 62053-21 with bidirectional net-metering.' }
    }
  },
  'eq-rcd-diff': {
    id: 'eq-rcd-diff',
    stageId: 'consumption',
    name: { fr: 'Interrupteur Différentiel Haute Sensibilité 30 mA', en: 'Residual Current Device (RCD 30 mA)' },
    tag: 'RCD-30mA-01',
    voltageLevel: '230 V',
    shortDesc: {
      fr: 'Sauveur de vies humaines: coupe le courant en 30 millisecondes si une personne touche un fil dénudé.',
      en: 'Life-saving device: trips in 30 milliseconds if current leaks through a human touch or faulty appliance.'
    },
    function: {
      fr: 'Compare en permanence le courant sortant par la Phase et celui revenant par le Neutre: s\'il y a une différence > 30 mA, il coupe tout.',
      en: 'Continuously monitors Phase and Neutral currents: if a discrepancy > 30 mA leaks to ground, it trips immediately.'
    },
    whyExists: {
      fr: 'Un courant de 50 mA traversant le corps humain provoque un arrêt cardiaque par fibrillation ventriculaire. Le 30 mA sauve la vie.',
      en: 'A current of 50 mA through the human heart causes fatal ventricular fibrillation. The 30 mA threshold prevents electrocution.'
    },
    whereUsed: { fr: 'En tête de chaque rangée du tableau électrique résidentiel.', en: 'At the head of every circuit row in domestic consumer boards.' },
    connectsTo: ['Compteur d\'énergie', 'Disjoncteurs divisionnaires d\'éclairage et prises'],
    measures: ['Courant résiduel différentiel I_delta_n'],
    protectedBy: ['Disjoncteur de branchement en amont'],
    controls: ['Bouton de test mensuel mécanique'],
    communicatesVia: ['Indicateur mécanique visuel de déclenchement'],
    failureModes: [
      {
        mode: { fr: 'Collage mécanique du mécanisme après des années sans test', en: 'Mechanical sticking from years without exercise' },
        consequence: { fr: 'Absence de coupure en cas d\'électrisation accidentelle', en: 'Failure to trip during accidental electric shock' },
        mitigation: { fr: 'Appui mensuel obligatoire sur le bouton de test "T"', en: 'Monthly test button activation by homeowner' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Mensuelle', en: 'Monthly' }, action: { fr: 'Appui sur le bouton test "T" pour vérifier le déclenchement instantané', en: 'Pressing test button "T" to verify mechanical trip mechanism' } }
    ],
    standards: [{ code: 'IEC 61008-1', title: 'Residual current operated circuit-breakers without integral overcurrent protection (RCCBs)', org: 'IEC' }],
    disciplines: ['Sécurité Électrique', 'Normes Basse Tension (NF C 15-100)'],
    levels: {
      level1: { fr: 'Le dispositif de sécurité magique qui coupe l\'électricité avant qu\'on ne s\'électrocute.', en: 'The safety switch that cuts power instantly if someone touches a live wire.' },
      level2: { fr: 'Transformateur tore sommateur détectant le flux résiduel nul en régime sain (I_phase + I_neutre = 0).', en: 'Toroidal core differential transformer detecting zero net magnetic flux during normal operation.' },
      level3: { fr: 'Temps de coupure t < 30 ms selon courbe de sécurité physiologique CEI 60479-1 (seuil de fibrillation cardiaque).', en: 'Tripping speed t < 30 ms compliant with IEC 60479-1 ventricular fibrillation prevention curve.' }
    }
  },
  'eq-wall-switch': {
    id: 'eq-wall-switch',
    stageId: 'consumption',
    name: { fr: 'Interrupteur Mural d\'Éclairage', en: 'Wall Toggle Light Switch' },
    tag: 'SW-LIGHT-01',
    voltageLevel: '230 V',
    shortDesc: {
      fr: 'Le point de contact humain: l\'action physique qui ferme le circuit et appelle l\'énergie de tout l\'écosystème.',
      en: 'The human touchpoint: the simple mechanical toggle that completes the circuit and calls upon the entire grid.'
    },
    function: {
      fr: 'Ferme le contact métallique sur la Phase, permettant à la tension 230 V d\'atteindre les bornes de l\'ampoule.',
      en: 'Closes the phase metallic contact, enabling 230 V potential to reach the lamp terminals.'
    },
    whyExists: {
      fr: 'Donne à l\'occupant le contrôle direct de l\'éclairage de son espace de vie.',
      en: 'Gives the human occupant immediate physical control over room illumination.'
    },
    whereUsed: { fr: 'Sur les murs de chaque pièce, à 1.10 m du sol.', en: 'On room walls beside doorways at accessible height.' },
    connectsTo: ['Phase protégée par disjoncteur 10A/16A', 'Fil de retour lampe (phase coupée)'],
    measures: ['État mécanique Ouvert / Fermé'],
    protectedBy: ['Boîtier isolant thermoplastique anti-choc'],
    controls: ['Action manuelle humaine'],
    communicatesVia: ['Position du basculeur'],
    failureModes: [
      {
        mode: { fr: 'Arc de rupture dégradant les contacts en argent', en: 'Contact arcing erosion over time' },
        consequence: { fr: 'Faux contact, grésillement et échauffement', en: 'Intermittent contact, crackling noise, and localized heating' },
        mitigation: { fr: 'Contacts en alliage d\'argent AgNi résistant à l\'arc et ressort franc', en: 'Silver alloy (AgNi) contacts with snap-action spring mechanism' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Tous les 15 ans', en: 'Every 15 years' }, action: { fr: 'Remplacement en cas de jeu mécanique ou de trace d\'échauffement', en: 'Replacement if mechanical play or heat discoloration is detected' } }
    ],
    standards: [{ code: 'IEC 60669-1', title: 'Switches for household and similar fixed-electrical installations', org: 'IEC' }],
    disciplines: ['Installations Électriques Bâtiment'],
    levels: {
      level1: { fr: 'Le petit bouton sur le mur sur lequel on appuie pour allumer la lumière.', en: 'The little switch on the wall you flick to turn on the light.' },
      level2: { fr: 'Interrupteur unipolaire 10A 250V coupant obligatoirement la Phase (jamais le Neutre selon NF C 15-100).', en: 'Single-pole 10A 250V switch breaking the live Phase wire per safety standards.' },
      level3: { fr: 'Mécanisme à bascule bistable avec ressort à rupture brusque pour minimiser la durée de l\'arc électrique transitoire.', en: 'Snap-action bistable rocker spring minimizing duration of contact arc extinguish.' }
    }
  },
  'eq-lamp-bulb': {
    id: 'eq-lamp-bulb',
    stageId: 'consumption',
    name: { fr: 'Ampoule Lumineuse (LED / Filament)', en: 'Lamp / Light Bulb (LED)' },
    tag: 'LMP-ROOM-01',
    voltageLevel: '230 V',
    shortDesc: {
      fr: 'L\'aboutissement du voyage: la conversion de l\'onde électromagnétique en photons lumineux éclairant la pièce.',
      en: 'The destination of the journey: conversion of electromagnetic energy into photons lighting the room.'
    },
    function: {
      fr: 'Convertit l\'énergie électrique en flux lumineux visible (lumens) grâce à des diodes électroluminescentes semi-conductrices.',
      en: 'Converts electric current into visible luminous flux (lumens) via semiconductor diodes.'
    },
    whyExists: {
      fr: 'Permet à l\'être humain de voir, travailler, lire et vivre confortablement la nuit.',
      en: 'Allows human beings to see, study, work, and thrive safely after sundown.'
    },
    whereUsed: { fr: 'Plafonniers, lampes de chevet, luminaires de tous les foyers.', en: 'Fixtures, chandeliers, desk lamps in every home.' },
    connectsTo: ['Phase coupée par interrupteur', 'Conducteur de Neutre'],
    measures: ['Flux lumineux (lumens)', 'Température de couleur (Kelvin)', 'Puissance absorbée (W)'],
    protectedBy: ['Driver électronique interne à protection de surtension'],
    controls: ['Interrupteur mural ou variateur'],
    communicatesVia: ['Lumière visible (400 - 700 nm)'],
    failureModes: [
      {
        mode: { fr: 'Claquage thermique du condensateur du driver électronique', en: 'Thermal failure of driver electrolytic capacitor' },
        consequence: { fr: 'Clignotement ou extinction définitive de l\'ampoule', en: 'Flickering or permanent blackout of lamp' },
        mitigation: { fr: 'Dissipateur thermique aluminium et composants haute température 105°C', en: 'Aluminium heat sink and 105°C rated electronic components' }
      }
    ],
    maintenance: [
      { frequency: { fr: 'Fin de vie (~25 000 h)', en: 'End of life (~25,000 h)' }, action: { fr: 'Remplacement et recyclage de l\'ampoule usagée', en: 'Replacement and recycling of spent LED bulb' } }
    ],
    standards: [{ code: 'IEC 62560', title: 'Self-ballasted LED-lamps for general lighting services', org: 'IEC' }],
    disciplines: ['Électronique de Puissance', 'Éclairagisme', 'Optoélectronique'],
    levels: {
      level1: { fr: 'L\'ampoule qui brille et éclaire votre chambre quand vous appuyez sur l\'interrupteur.', en: 'The glowing bulb that lights your room when you flick the switch.' },
      level2: { fr: 'Lampe LED 10W produisant 1000 lumens avec un rendement énergétique > 85% par rapport aux anciennes lampes incandescentes.', en: '10W LED bulb producing 1000 lumens with >85% efficiency compared to incandescent bulbs.' },
      level3: { fr: 'Alimentation à découpage flyback régulée en courant constant alimentant une chaîne de LED InGaN émettant dans le bleu avec luminophore jaune.', en: 'Constant-current buck-flyback driver powering InGaN semiconductor blue diodes with yellow phosphor coating.' }
    }
  }
};

export const ENGINEERING_DISCIPLINES: EngineeringDiscipline[] = [
  {
    id: 'hydraulic',
    name: { fr: 'Génie Hydraulique', en: 'Hydraulic Engineering' },
    icon: 'Waves',
    shortDesc: { fr: 'Conception des barrages, prises d\'eau, conduites forcées et mécanique des fluides incompressibles.', en: 'Dams, penstocks, reservoirs, and fluid dynamics.' },
    keyDeliverables: [
      { fr: 'Étude hydrologique et courbe de débit classé', en: 'Hydrological survey and flow duration curves' },
      { fr: 'Calcul du coup de bélier et dimensionnement cheminée d\'équilibre', en: 'Water hammer surge calculations and surge tank design' },
      { fr: 'Profil de la bâche spirale et aubage turbine', en: 'Spiral casing and runner blade profile design' }
    ],
    associatedEquipmentIds: ['eq-penstock', 'eq-turbine']
  },
  {
    id: 'generator',
    name: { fr: 'Ingénierie des Alternateurs', en: 'Generator Engineering' },
    icon: 'Cpu',
    shortDesc: { fr: 'Calcul électromagnétique, thermique et mécanique des machines synchrones de production.', en: 'Electromagnetic, thermal, and mechanical design of synchronous machines.' },
    keyDeliverables: [
      { fr: 'Calcul des réactances de Park (Xd, Xq, X\'d, X"d)', en: 'Park two-axis reactances calculation' },
      { fr: 'Dimensionnement de l\'isolation classe F et calage des barres Roebel', en: 'Class F stator bar insulation and Roebel bar transposition' },
      { fr: 'Bilan thermique des pertes fer et Joule rotor/stator', en: 'Core loss and rotor/stator Joule thermal balance' }
    ],
    associatedEquipmentIds: ['eq-generator', 'eq-avr-gov']
  },
  {
    id: 'transformer',
    name: { fr: 'Ingénierie des Transformateurs', en: 'Transformer Engineering' },
    icon: 'Layers',
    shortDesc: { fr: 'Conception des circuits magnétiques, enroulements, diélectrique huile et régleurs en charge.', en: 'Magnetic cores, windings, oil dielectric, and tap changers.' },
    keyDeliverables: [
      { fr: 'Calcul des forces de court-circuit électrodynamiques axiales et radiales', en: 'Short-circuit electrodynamic axial and radial force analysis' },
      { fr: 'Plan de coordination de l\'isolement et tenue aux chocs de foudre BIL', en: 'Insulation coordination and lightning impulse BIL withstand' },
      { fr: 'Dimensionnement des échangeurs thermiques et circuit d\'huile', en: 'Cooling radiators and oil circulation sizing' }
    ],
    associatedEquipmentIds: ['eq-gsu-trafo', 'eq-stepdown-trafo', 'eq-oltc', 'eq-dist-trafo']
  },
  {
    id: 'transmission',
    name: { fr: 'Lignes Haute Tension', en: 'Transmission Line Engineering' },
    icon: 'Share2',
    shortDesc: { fr: 'Calcul mécanique des pylônes treillis, tension de pose des câbles, effet couronne et isolation.', en: 'Lattice tower civil design, catenary cable sagging, and corona physics.' },
    keyDeliverables: [
      { fr: 'Profil en long et carnet de piquetage des pylônes', en: 'Line plan, elevation profile, and tower spotting' },
      { fr: 'Calcul de la flèche maximale par grand vent et température extrême', en: 'Maximum catenary sag calculation under extreme weather' },
      { fr: 'Étude d\'amortissement des vibrations éoliennes Stockbridge', en: 'Aeolian vibration damper optimization study' }
    ],
    associatedEquipmentIds: ['eq-lattice-tower', 'eq-bundle-conductor', 'eq-opgw-shield', 'eq-vibration-damper']
  },
  {
    id: 'protection',
    name: { fr: 'Ingénierie des Protections', en: 'Protection Systems Engineering' },
    icon: 'ShieldAlert',
    shortDesc: { fr: 'Plan de protection, sélectivité, réglages des relais différentiels et distance.', en: 'Protection schemes, selectivity grading, distance and differential relays.' },
    keyDeliverables: [
      { fr: 'Plan de sélectivité chronométrique et ampèremétrique', en: 'Time-current coordination curves and selectivity matrix' },
      { fr: 'Fiches de réglages des relais numériques ANSI (87, 21, 50/51, 67N)', en: 'Relay setting calculation sheets (ANSI 87, 21, 50/51, 67N)' },
      { fr: 'Étude de stabilité aux transitoires de court-circuit', en: 'Transient stability and fault clearing time simulations' }
    ],
    associatedEquipmentIds: ['eq-gen-relay', 'eq-hv-breaker', 'eq-rcd-diff']
  },
  {
    id: 'scada',
    name: { fr: 'SCADA & Télécommunications', en: 'SCADA & Telecommunications' },
    icon: 'Activity',
    shortDesc: { fr: 'Automatisation des postes, téléconduite nationale, protocoles IEC 61850 et téléprotection.', en: 'Substation automation, national dispatching, IEC 61850, and teleprotection.' },
    keyDeliverables: [
      { fr: 'Architecture réseau Ethernet temps réel PRP/HSR', en: 'Redundant PRP/HSR real-time Ethernet architecture' },
      { fr: 'Configuration des trames GOOSE pour déclenchement ultra-rapide', en: 'GOOSE messaging matrix for inter-bay trip coordination' },
      { fr: 'Synoptique SCADA et télémétries de dispatching', en: 'SCADA mimic diagrams and EMS telemetry points list' }
    ],
    associatedEquipmentIds: ['eq-opgw-shield', 'eq-avr-gov', 'eq-energy-meter']
  },
  {
    id: 'safety',
    name: { fr: 'Sécurité Électrique & Normes', en: 'Electrical Safety & Standards' },
    icon: 'ShieldCheck',
    shortDesc: { fr: 'Protection des personnes contre l\'électrisation, mise à la terre, tensions de pas et de toucher.', en: 'Human safety against electric shock, grounding grids, touch and step voltages.' },
    keyDeliverables: [
      { fr: 'Calcul du maillage de terre selon IEEE 80 / CEI 61936', en: 'Substation grounding grid calculations per IEEE 80' },
      { fr: 'Coordination des disjoncteurs différentiels 30 mA (NF C 15-100)', en: '30 mA residual current selectivity in domestic installations' },
      { fr: 'Plan de balisage et distances de sécurité d\'approche', en: 'Safety clearance boundaries and arc flash hazard analysis' }
    ],
    associatedEquipmentIds: ['eq-rcd-diff', 'eq-surge-arrester-hv', 'eq-wall-switch']
  }
];

export const LIGHTNING_SIMULATION_STEPS: LightningStep[] = [
  {
    stepNumber: 1,
    title: { fr: 'Approche du traceur descendant', en: 'Stepped Leader Approach' },
    description: {
      fr: 'Un nuage d\'orage chargé négativement abaisse un traceur de foudre ionisé vers la ligne de transport.',
      en: 'A negatively charged storm cloud drops an ionized stepped leader towards the transmission line.'
    },
    technicalDetail: {
      fr: 'Gradient de potentiel électrique supérieur à 30 kV/cm dans l\'air humide. Les objets saillants au sol émettent des traceurs ascendants.',
      en: 'Electric field gradient exceeds 30 kV/cm in moist air. Grounded pointed objects emit upward connecting leaders.'
    },
    activeElements: ['Nuage d\'orage', 'Air ionisé'],
    phenomenon: 'approach'
  },
  {
    stepNumber: 2,
    title: { fr: 'Interception par le câble de garde (OPGW)', en: 'Shield Wire Interception' },
    description: {
      fr: 'Le câble de garde sommital intercepte l\'éclair de plein fouet, protégeant les conducteurs de phase situés en dessous.',
      en: 'The top shield wire intercepts the direct lightning stroke, shielding the active phase conductors underneath.'
    },
    technicalDetail: {
      fr: 'Angle de protection électrogéométrique < 30°. L\'éclair injecte un courant impulsionnel de crête de 50 000 à 150 000 Ampères (onde 10/350 μs).',
      en: 'Electro-geometric shielding angle <30°. Lightning injects an impulse current peak of 50 to 150 kA (10/350 μs waveform).'
    },
    activeElements: ['eq-opgw-shield', 'eq-lattice-tower'],
    phenomenon: 'interception'
  },
  {
    stepNumber: 3,
    title: { fr: 'Propagation de l\'onde mobile transitoire', en: 'Transient Traveling Wave' },
    description: {
      fr: 'Une onde de surtension brutale se propage à la vitesse de la lumière le long des câbles vers les deux extrémités.',
      en: 'A severe overvoltage wave propagates at near light-speed along conductors towards both substation ends.'
    },
    technicalDetail: {
      fr: 'Équation des télégraphistes: tension d\'onde U = Z_c · I. Pour une impédance caractéristique Zc = 400 Ω, l\'onde atteint des millions de volts.',
      en: 'Telegrapher wave equation U = Zc·I. Surge impedance Zc = 400 Ω produces multi-megavolt traveling waves.'
    },
    activeElements: ['eq-opgw-shield', 'eq-bundle-conductor'],
    phenomenon: 'transient_wave'
  },
  {
    stepNumber: 4,
    title: { fr: 'Écoulement à la terre par les pieds de pylône', en: 'Tower Footing Discharge' },
    description: {
      fr: 'Le courant s\'échappe vers le sol à travers la structure métallique du pylône et ses piquets de terre.',
      en: 'Surge current discharges into the earth through the steel tower frame and foundation grounding rods.'
    },
    technicalDetail: {
      fr: 'Si la résistance de pied R_t > 15 Ω, le potentiel du sommet monte si haut qu\'un amorçage en retour (backflashover) saute vers la phase.',
      en: 'If footing resistance R_t > 15 Ω, tower top potential rises dangerously, risking a backflashover to phase conductors.'
    },
    activeElements: ['eq-lattice-tower'],
    phenomenon: 'ground_discharge'
  },
  {
    stepNumber: 5,
    title: { fr: 'Écrêtage par le parafoudre ZnO en sous-station', en: 'Surge Arrester Clamping' },
    description: {
      fr: 'À l\'entrée du poste, le parafoudre à oxyde de zinc devient instantanément conducteur et draine l\'onde à la terre.',
      en: 'At the substation entry, the ZnO surge arrester turns conducting within nanoseconds, draining the surge to earth.'
    },
    technicalDetail: {
      fr: 'La tension est écrêtée au niveau de protection Up = 480 kV, bien en-dessous de la limite de claquage du transformateur (BIL = 1050 kV).',
      en: 'Voltage is clamped safely at Up = 480 kV, well below transformer dielectric breakdown rating (BIL = 1050 kV).'
    },
    activeElements: ['eq-surge-arrester-hv', 'eq-gsu-trafo'],
    phenomenon: 'arrester_clamping'
  },
  {
    stepNumber: 6,
    title: { fr: 'Détection par le relais de distance (ANSI 21)', en: 'Distance Relay Detection' },
    description: {
      fr: 'Si un arc s\'est amorcé sur un isolateur, le relais numérique de distance calcule l\'impédance et détecte le court-circuit.',
      en: 'If an insulator flashed over, the numerical distance relay senses the drop in impedance and locates the fault.'
    },
    technicalDetail: {
      fr: 'Calcul de l\'impédance de boucle Z = U / I en moins de 15 ms. L\'impédance tombe dans la zone 1 instantanée (< 85% de la ligne).',
      en: 'Loop impedance calculation Z = V / I in under 15 ms. Fault drops directly inside instantaneous Zone 1.'
    },
    activeElements: ['eq-gen-relay'],
    phenomenon: 'relay_detection'
  },
  {
    stepNumber: 7,
    title: { fr: 'Déclenchement du disjoncteur 225 kV', en: 'Circuit Breaker Tripping' },
    description: {
      fr: 'Le disjoncteur ouvre ses contacts sous SF6 en 40 millisecondes pour éteindre l\'arc de court-circuit.',
      en: 'The 225 kV SF6 circuit breaker opens in 40 milliseconds, blowing out the heavy electrical fault arc.'
    },
    technicalDetail: {
      fr: 'Le souffle de gaz SF6 à haute pression refroidit et dé-ionise le plasma d\'arc au premier passage par zéro du courant.',
      en: 'High-pressure SF6 gas blast quenches and de-ionizes the arc plasma at the first alternating current zero-crossing.'
    },
    activeElements: ['eq-hv-breaker'],
    phenomenon: 'breaker_trip'
  },
  {
    stepNumber: 8,
    title: { fr: 'Réenclenchement automatique réussi', en: 'Successful Auto-Reclosing' },
    description: {
      fr: 'Après 300 millisecondes (temps mort), l\'air ionisé par l\'éclair s\'étant dissipé, le disjoncteur se referme automatiquement.',
      en: 'After a 300 ms dead time during which ionized air dissipates, the breaker automatically recloses with full stability.'
    },
    technicalDetail: {
      fr: '90% des défauts de foudre sur les lignes aériennes sont fugitifs. Le réenclencheur rapide évite ainsi toute coupure d\'électricité pour les usagers!',
      en: '90% of overhead line lightning faults are transient. Fast auto-reclosing restores grid integrity without consumer blackout!'
    },
    activeElements: ['eq-hv-breaker', 'eq-gen-relay'],
    phenomenon: 'auto_reclose'
  }
];

export const FAULT_SCENARIOS: FaultScenario[] = [
  {
    id: 'line',
    title: { fr: 'Défaut Ligne Haute Tension (Branche d\'arbre)', en: 'HV Transmission Line Fault (Tree contact)' },
    location: { fr: 'Ligne 225 kV Nachtigal - Mangombé (km 42)', en: '225 kV Transmission Line km 42' },
    description: {
      fr: 'Une branche d\'arbre touche un conducteur lors d\'un coup de vent. Le relais de distance déclenche et réenclenche.',
      en: 'A tree branch sways into a 225 kV phase conductor. Distance protection trips and successfully auto-recloses.'
    },
    steps: [
      {
        title: { fr: 'Régime Normal', en: 'Normal State' },
        detail: { fr: 'Transit stable de 180 MW sous 225 kV. Courant de charge équilibré 460 A.', en: 'Stable 180 MW flow at 225 kV. Balanced 460 A load current.' },
        activeComponents: ['eq-bundle-conductor', 'eq-hv-breaker'],
        isFaultActive: false,
        isTripActive: false,
        status: 'normal'
      },
      {
        title: { fr: 'Amorçage de l\'arc Phase-Terre', en: 'Phase-to-Ground Flashover' },
        detail: { fr: 'Court-circuit monophasé franc: le courant bondit à 18 500 A, la tension de phase s\'effondre.', en: 'Severe single-phase short: current surges to 18,500 A, voltage sags.' },
        activeComponents: ['eq-bundle-conductor'],
        isFaultActive: true,
        isTripActive: false,
        status: 'disturbed'
      },
      {
        title: { fr: 'Détection Zone 1 & Ordre de déclenchement', en: 'Zone 1 Trip Command' },
        detail: { fr: 'Le relais ANSI 21 calcule Z = 3.2 Ω (< 12 Ω seuil Z1). Ordre de déclenchement envoyé en 14 ms.', en: 'Distance relay detects Z = 3.2 Ω inside Zone 1 reach. Trip sent in 14 ms.' },
        activeComponents: ['eq-gen-relay'],
        isFaultActive: true,
        isTripActive: true,
        status: 'tripped'
      },
      {
        title: { fr: 'Extinction de l\'arc & Temps mort', en: 'Arc Extinguishment & Dead Time' },
        detail: { fr: 'Le disjoncteur 225 kV ouvre ses pôles en 38 ms. L\'arc s\'éteint et la branche se consume.', en: 'Breaker opens in 38 ms. Fault isolated and tree branch vaporizes.' },
        activeComponents: ['eq-hv-breaker'],
        isFaultActive: false,
        isTripActive: true,
        status: 'isolated'
      },
      {
        title: { fr: 'Réenclenchement automatique réussi (Cycle O-0.3s-CO)', en: 'Auto-Reclose Successful' },
        detail: { fr: 'Refermeture à t = 340 ms. Tension nominale restaurée, aucun client n\'a été coupé grâce au maillage.', en: 'Recloser re-energizes line at t=340 ms. Complete recovery with zero customer blackout.' },
        activeComponents: ['eq-hv-breaker', 'eq-bundle-conductor'],
        isFaultActive: false,
        isTripActive: false,
        isRecloseActive: true,
        status: 'restored'
      }
    ]
  },
  {
    id: 'transformer',
    title: { fr: 'Défaut Interne Transformateur (Court-circuit entre spires)', en: 'Internal Transformer Turn-to-Turn Fault' },
    location: { fr: 'Transformateur 225/30 kV Poste Source', en: '225/30 kV Substation Autotransformer' },
    description: {
      fr: 'Rupture d\'isolation interne dans les enroulements du transformateur. La protection différentielle (87T) isole définitivement.',
      en: 'Internal insulation breakdown inside transformer winding. Differential relay 87T trips and locks out.'
    },
    steps: [
      {
        title: { fr: 'Régime Normal', en: 'Normal Operation' },
        detail: { fr: 'Transformateur alimentant 50 MW de charge urbaine. Température d\'huile 62°C.', en: 'Transformer supplying 50 MW urban load. Oil temp 62°C.' },
        activeComponents: ['eq-stepdown-trafo', 'eq-hv-breaker'],
        isFaultActive: false,
        isTripActive: false,
        status: 'normal'
      },
      {
        title: { fr: 'Claquant entre spires & Dégagement gazeux', en: 'Turn Breakdown & Gas Release' },
        detail: { fr: 'Arc électrique sous l\'huile décomposant les hydrocarbures. Courant différentiel I_diff = 4 200 A.', en: 'Arc decomposes oil into acetylene/hydrogen. Differential current I_diff = 4,200 A.' },
        activeComponents: ['eq-stepdown-trafo'],
        isFaultActive: true,
        isTripActive: false,
        status: 'disturbed'
      },
      {
        title: { fr: 'Déclenchement instantané 87T & Buchholz', en: 'Instantaneous 87T & Buchholz Trip' },
        detail: { fr: 'Le relais différentiel compare les courants primaires et secondaires. Déclenchement en 18 ms.', en: 'Differential relay detects current imbalance across bushings and trips in 18 ms.' },
        activeComponents: ['eq-gen-relay'],
        isFaultActive: true,
        isTripActive: true,
        status: 'tripped'
      },
      {
        title: { fr: 'Verrouillage 86 & Basculement sur Transfo de Secours', en: 'Lockout 86 & Standby Transfer' },
        detail: { fr: 'Le relais bistable 86 interdit tout réenclenchement. L\'automate bascule la charge sur le 2e transformateur en 0.8 s.', en: 'Lockout relay 86 prevents reclosing. Automatic transfer switch shifts load to second transformer in 0.8 s.' },
        activeComponents: ['eq-stepdown-trafo', 'eq-hv-breaker'],
        isFaultActive: false,
        isTripActive: true,
        status: 'isolated'
      }
    ]
  },
  {
    id: 'household',
    title: { fr: 'Court-Circuit Résidentiel (Lampe défectueuse)', en: 'Household Short Circuit (Defective cord)' },
    location: { fr: 'Circuit d\'éclairage intérieur de la maison', en: 'Residential lighting circuit inside home' },
    description: {
      fr: 'Un câble de lampe écrasé crée un court-circuit franc dans le salon. Le disjoncteur 10A saute en 10 ms sans couper le reste de la maison ni le quartier.',
      en: 'A pinched lamp cord creates a direct short circuit. The 10A circuit breaker trips in 10 ms, protecting the rest of the house and grid.'
    },
    steps: [
      {
        title: { fr: 'Lampe Allumée', en: 'Lamp Lit' },
        detail: { fr: 'Courant de 0.05 A (ampoule LED 10W sous 230 V). Tout fonctionne normalement.', en: '0.05 A current (10W LED at 230 V). Everything stable.' },
        activeComponents: ['eq-lamp-bulb', 'eq-wall-switch'],
        isFaultActive: false,
        isTripActive: false,
        status: 'normal'
      },
      {
        title: { fr: 'Contact direct Phase - Neutre', en: 'Phase-to-Neutral Contact' },
        detail: { fr: 'Impédance nulle: le courant bondit instantanément à 450 A dans les fils de la maison.', en: 'Zero impedance: current explodes to 450 A in branch wiring.' },
        activeComponents: ['eq-lamp-bulb'],
        isFaultActive: true,
        isTripActive: false,
        status: 'disturbed'
      },
      {
        title: { fr: 'Déclenchement magnétique du disjoncteur 10A', en: 'Magnetic Trip of 10A MCB' },
        detail: { fr: 'Le percuteur électromagnétique du disjoncteur divisionnaire ouvre le contact en moins de 8 millisecondes.', en: 'Electromagnetic plunger in 10A miniature circuit breaker opens contacts in under 8 ms.' },
        activeComponents: ['eq-rcd-diff'],
        isFaultActive: true,
        isTripActive: true,
        status: 'tripped'
      },
      {
        title: { fr: 'Circuit isolé - Sélectivité totale', en: 'Circuit Isolated - Full Selectivity' },
        detail: { fr: 'Seule la lampe s\'éteint! Le frigo, la télévision, le quartier et la centrale électrique restent totalement insensibles.', en: 'Only the faulted lamp turns off! The refrigerator, neighbors, and grid remain completely unaffected.' },
        activeComponents: ['eq-wall-switch'],
        isFaultActive: false,
        isTripActive: true,
        status: 'isolated'
      }
    ]
  }
];

export const GRID_LOAD_PROFILES: Record<GridPeriodId, GridLoadProfile> = {
  night: {
    period: 'night',
    label: { fr: 'Nuit Creuse (03h00)', en: 'Night Valley (03:00)' },
    communityLoadKw: 28,
    systemFreqHz: 50.08,
    systemVoltageKv: 227.5,
    activeGovernorResponse: {
      fr: 'Demande minimale. Les aubes des turbines hydrauliques sont refermées à 25% d\'ouverture pour ne pas emballer la fréquence.',
      en: 'Minimum load. Turbine wicket gates throttled back to 25% to prevent frequency overshoot.'
    },
    activeAvrResponse: {
      fr: 'Lignes THT peu chargées créant un effet capacitif Ferranti (tension qui monte). L\'AVR baisse l\'excitation pour absorber du réactif.',
      en: 'Lightly loaded lines generate Ferranti capacitive boost. AVR reduces excitation to absorb reactive MVAr.'
    },
    powerBalance: 'surplus'
  },
  morning: {
    period: 'morning',
    label: { fr: 'Matin & Réveil (07h30)', en: 'Morning Ramp-Up (07:30)' },
    communityLoadKw: 72,
    systemFreqHz: 50.01,
    systemVoltageKv: 225.2,
    activeGovernorResponse: {
      fr: 'Ramp-up rapide. Les usagers allument chauffe-eau, éclairages et machines. Le régulateur ouvre les vannes pour injecter plus de mégawatts.',
      en: 'Rapid demand ramp. Water heaters and appliances turn on. Governor opens gates to match rising megawatt load.'
    },
    activeAvrResponse: {
      fr: 'Tension stabilisée à la consigne nominale (1.00 p.u.).',
      en: 'Voltage stabilized at nominal setpoint (1.00 p.u.).'
    },
    powerBalance: 'balanced'
  },
  day: {
    period: 'day',
    label: { fr: 'Journée & Industrie (14h00)', en: 'Daytime Industrial (14:00)' },
    communityLoadKw: 85,
    systemFreqHz: 49.98,
    systemVoltageKv: 224.6,
    activeGovernorResponse: {
      fr: 'Charge industrielle et climatisation soutenue. Centrales calées sur leur point de rendement maximal.',
      en: 'Steady industrial and air conditioning load. Hydro units operating at peak efficiency.'
    },
    activeAvrResponse: {
      fr: 'Compensation de réactif enclenchée (batteries de condensateurs en sous-station).',
      en: 'Substation capacitor banks connected to maintain 0.98 power factor.'
    },
    powerBalance: 'balanced'
  },
  evening: {
    period: 'evening',
    label: { fr: 'Pointe du Soir (20h00)', en: 'Evening Peak (20:00)' },
    communityLoadKw: 118,
    systemFreqHz: 49.92,
    systemVoltageKv: 223.1,
    activeGovernorResponse: {
      fr: 'Pointe de consommation maximale! Toutes les lumières et téléviseurs sont allumés. La fréquence fléchit légèrement (49.92 Hz). Le dispatching démarre les réserves rapides.',
      en: 'Peak national demand! All household lights and entertainment ON. Frequency dips to 49.92 Hz, prompting spinning reserve activation.'
    },
    activeAvrResponse: {
      fr: 'Forte chute de tension en bout de ligne. Les régleurs en charge OLTC montent d\'un cran et les alternateurs poussent leur excitation.',
      en: 'Severe line voltage drop. Substation OLTC steps up and generators boost excitation to inject reactive MVAr.'
    },
    powerBalance: 'deficit'
  }
};
