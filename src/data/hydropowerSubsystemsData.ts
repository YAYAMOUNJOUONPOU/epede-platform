import type { HydroSubsystem } from '../types/hydropower';

export const HYDRO_DOMAINS_COVERAGE = {
  civil: 4,
  hydraulic: 4,
  mechanical: 4,
  electrical: 5,
  control: 4,
  protection: 4,
  auxiliary: 6,
  total: 31,
};

export const HYDRO_SUBSYSTEMS: HydroSubsystem[] = [
  {
    id: 'H01',
    code: 'H01',
    name: { fr: 'Ressource en Eau & Hydrologie de Bassin', en: 'Water Resource & Catchment Hydrology' },
    category: 'civil',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Surveillance et modélisation des apports hydrologiques, courbes des débits classés et gestion prévisionnelle des crues du bassin versant.',
      en: 'Catchment hydrological modeling, flow duration curves, seasonal rainfall inflows, and upstream flood forecasting telemetry.',
    },
    keyComponents: ['Stations limnimétriques télétransmises', 'Capteurs radar de niveau rivière', 'Modèles pluie-débit HEC-HMS', 'Pluviomètres automatiques'],
    designCriteria: [
      { fr: 'Estimation de la crue millénale (Q1000) et de la crue maximale probable (CMP / PMF).', en: 'Design basis flood determination (1,000-year recurrence) and Probable Maximum Flood (PMF).' },
      { fr: 'Respect statutaire du débit écologique réservé en aval de l\'aménagement.', en: 'Statutory minimum environmental flow guarantee downstream of the intake weir.' },
    ],
    failureModes: [
      { fr: 'Sous-estimation des crues de pointe causant la submersion d\'ouvrages non submersibles.', en: 'Underestimation of peak flood discharge causing overtopping of non-overflow dam crests.' },
      { fr: 'Étiage sévère prolongé réduisant la production électrique garantie sous le seuil contractuel.', en: 'Prolonged extreme drought driving firm capacity generation below contractual PPA thresholds.' },
    ],
    protectionMeasures: [
      { fr: 'Réseau de télémesure satellitaire en amont avec alerte précoce d\'onde de crue.', en: 'Satellite-uplink upstream early warning rain/flow gauging network.' },
      { fr: 'Courbes de gestion de retenue dynamiques adaptées à la saisonnalité tropicale.', en: 'Seasonal dynamic reservoir rule curve optimization matching tropical monsoon rhythms.' },
    ],
    standards: ['WMO-No. 168', 'USACE EM 1110-2-1417', 'ICOLD Bulletin 142'],
  },
  {
    id: 'H02',
    code: 'H02',
    name: { fr: 'Barrage, Retenue & Ouvrages de Retenue', en: 'Dam, Reservoir & Impoundment Structures' },
    category: 'civil',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Structure principale de retenue hydraulique (barrage en BCR, béton armé ou enrochement), digues de col et surveillance géotechnique d\'auscultation.',
      en: 'Primary water impoundment structure (RCC gravity, concrete buttress, or rockfill embankment dam) and structural safety instrumentation.',
    },
    keyComponents: ['Corps de barrage BCR / béton', 'Digue fusible latérale', 'Galerie d\'auscultation et drainage', 'Pendules inverses & piézomètres'],
    designCriteria: [
      { fr: 'Stabilité au glissement et au renversement sous sollicitations extrêmes (séisme MCE + crue CMP).', en: 'Sliding and overturning safety factor verification under Maximum Credible Earthquake (MCE) + PMF.' },
      { fr: 'Contrôle des sous-pressions par rideau d\'injection de coulis et forages de drainage profonds.', en: 'Uplift pressure control through high-pressure grout curtain and deep vertical relief drainage holes.' },
    ],
    failureModes: [
      { fr: 'Renard hydraulique ou érosion interne dans la fondation ou le corps de digue.', en: 'Internal erosion and piping within embankment core or porous bedrock foundation.' },
      { fr: 'Fissuration par réaction alcali-granulat (RAG) déformant les bajoyers et pertuis.', en: 'Alkali-Silica Reaction (ASR) swelling inducing differential displacement and gate jamming.' },
    ],
    protectionMeasures: [
      { fr: 'Surveillance auscultation automatisée temps-réel (pendules, fissuromètres, débits de fuite).', en: 'Automated real-time dam surveillance (inverted pendulums, joint meters, drainage seepage weirs).' },
      { fr: 'Sciage régulier de décharge des contraintes mécaniques en cas de RAG (ex: Songloulou).', en: 'Precision stress-relief diamond wire saw cutting for ASR concrete expansion control.' },
    ],
    standards: ['ICOLD Bulletin 138', 'USBR Design of Small Dams', 'Eurocode 7'],
  },
  {
    id: 'H03',
    code: 'H03',
    name: { fr: 'Évacuateur de Crue & Dissipation d\'Énergie', en: 'Spillway & Energy Dissipation System' },
    category: 'civil',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Organes de vidange et de sécurité permettant d\'évacuer sans risque les débits de crue exceptionnels avec bassin d\'amortissement ou saut de ski.',
      en: 'Hydraulic safety release works including gated crest spillways, overflow chutes, flip buckets, and stilling basins.',
    },
    keyComponents: ['Vannes segments à vérins oléohydrauliques', 'Seuil déversant Creager', 'Coursier béton haute résistance', 'Bassin de dissipation à redans'],
    designCriteria: [
      { fr: 'Évacuation de la crue de sécurité de référence avec une vanne majeure bloquée (règle N-1).', en: 'Full spillway discharge capacity ensured under N-1 single gate jamming contingency.' },
      { fr: 'Prévention de l\'érosion régressive du lit fluvial par dissipation complète de l\'énergie cinétique.', en: 'Complete hydraulic jump containment preventing downstream riverbed scour and undermining.' },
    ],
    failureModes: [
      { fr: 'Blocage mécanique d\'une vanne de crue par débris flottants ou panne oléohydraulique.', en: 'Mechanical gate seizure due to floating timber debris or hydraulic power unit actuator failure.' },
      { fr: 'Cavitation hydrodynamique sur le radier du coursier sous grande vitesse d\'écoulement.', en: 'Hydrodynamic cavitation pitting on spillway concrete chute invert at velocities exceeding 25 m/s.' },
    ],
    protectionMeasures: [
      { fr: 'Groupes motopompes diesel de secours dédiés et aération forcée du coursier (aérateurs).', en: 'Dedicated emergency diesel generator and aeration ramps along the spillway chute to aerate flow.' },
      { fr: 'Blindage acier et bétons à ultra-hautes performances (BFUP) aux zones d\'impact.', en: 'Silica fume and steel armor plating in high-turbulence hydraulic jump dissipation basins.' },
    ],
    standards: ['USACE EM 1110-2-1603', 'ICOLD Bulletin 152', 'DIN 19704'],
  },
  {
    id: 'H04',
    code: 'H04',
    name: { fr: 'Prise d\'Eau Usinière & Dégrillage', en: 'Power Water Intake & Trashrack System' },
    category: 'civil',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Ouvrage d\'entonnement d\'eau vers les conduites, équipé de grilles fines, dégrilleurs automatiques et vanne de garde de tête.',
      en: 'Intake structure channeling water into power conduits, equipped with fine trashracks, automated trash rakes, and emergency intake gates.',
    },
    keyComponents: ['Grilles fines inox / acier peint', 'Dégrilleur automatisé oléohydraulique', 'Vanne wagon de garde de tête', 'Conduit d\'aération anti-dépression'],
    designCriteria: [
      { fr: 'Vitesse d\'approche à travers les grilles < 0.8 à 1.0 m/s pour limiter les pertes et protéger la faune.', en: 'Approach velocity across trashrack bars limited to < 0.8 - 1.0 m/s minimizing head losses and fish entrainment.' },
      { fr: 'Dimensionnement structural des barreaux contre les tourbillons de Karman et la résonance aéroélastique.', en: 'Structural bar sizing against vortex-induced vibration (Karman vortex shedding resonance).' },
    ],
    failureModes: [
      { fr: 'Colmatage massif par végétaux flottants créant une pression différentielle provoquant l\'écrasement des grilles.', en: 'Severe trashrack clogging by aquatic weeds creating extreme differential collapse pressure.' },
      { fr: 'Dépression sous vide dans la conduite forcée lors d\'une fermeture de vanne sans évent fonctionnel.', en: 'Catastrophic vacuum collapse of downstream penstock upon gate drop without functional air vent.' },
    ],
    protectionMeasures: [
      { fr: 'Capteurs de pression différentielle amont/aval grilles avec démarrage automatique du dégrilleur.', en: 'Differential head transmitters triggering automatic rake cycles upon reaching 0.20 m head loss.' },
      { fr: 'Cheminée d\'aération surdimensionnée en aval immédiat du pertuis de vanne.', en: 'Generously dimensioned atmospheric snort-pipe air vent immediately downstream of the intake gate slot.' },
    ],
    standards: ['IEC 60041', 'USBR Monograph 3', 'DIN 19704-1'],
  },
  {
    id: 'H05',
    code: 'H05',
    name: { fr: 'Galerie d\'Amenée & Conduite Forcée', en: 'Headrace Waterway & Steel Penstocks' },
    category: 'hydraulic',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Système d\'adduction sous pression reliant la prise d\'eau à la bâche spirale de l\'usine, avec blindage acier, massifs d\'ancrage et compensateurs de dilatation.',
      en: 'High-pressure hydraulic conduits conveying flow to the turbine scrollcase, comprising steel penstocks, anchor blocks, and expansion joints.',
    },
    keyComponents: ['Tuyauterie acier thermo-traité S355 / S690', 'Massifs d\'ancrage en béton armé', 'Compensateurs télescopiques axiaux', 'Vanne papillon ou sphérique de pied'],
    designCriteria: [
      { fr: 'Épaisseur de tôle calculée selon la formule de Barlow avec surépaisseur de corrosion et coup de bélier Allievi.', en: 'Wall thickness calculated via Barlow equation factoring yield stress, corrosion allowance, and Allievi waterhammer surges.' },
      { fr: 'Résistance géotechnique des massifs au cisaillement contre la poussée hydraulique d\'angle.', en: 'Anchor block stability against sliding and overturning under maximum resultant hydrostatic thrust.' },
    ],
    failureModes: [
      { fr: 'Rupture circonférentielle ou déchirure longitudinale sous surpression transitoire de délestage.', en: 'Penstock rupture from overpressure transient following sudden turbine load rejection without relief.' },
      { fr: 'Corrosion sous contrainte ou désancrage d\'un massif lors de tassements différentiels de sol.', en: 'Stress corrosion cracking or anchor block sliding under foundation differential settlement.' },
    ],
    protectionMeasures: [
      { fr: 'Vanne de tête à fermeture par contrepoids avec détection de survitesse d\'écoulement (rupture de conduite).', en: 'Over-velocity paddle trigger closing intake emergency gravity gate within 30 seconds upon pipe burst.' },
      { fr: 'Contrôles non-destructifs ultra-sons et magnétoscopie réguliers des soudures de viroles.', en: 'Periodic phased-array ultrasonic and magnetic particle testing of circumferential welds.' },
    ],
    standards: ['ASCE Penstocks Manual 79', 'AWWA M11', 'EN 13480'],
  },
  {
    id: 'H06',
    code: 'H06',
    name: { fr: 'Cheminée d\'Équilibre & Défense Coup de Bélier', en: 'Surge Tank & Waterhammer Defense System' },
    category: 'hydraulic',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Chambre ou puits d\'expansion vertical à surface libre amortissant les oscillations de masse et ondes de choc consécutives aux manœuvres de vannage.',
      en: 'Vertical surge chamber cushioning mass oscillations and reflection waves caused by rapid governor guide-vane closures.',
    },
    keyComponents: ['Puits d\'équilibre vertical excavé', 'Étranglement d\'orifice (orifice restreint)', 'Chambre d\'expansion supérieure', 'Chambre d\'expansion inférieure'],
    designCriteria: [
      { fr: 'Section transversale minimale conforme au critère de stabilité de Thoma (S > S_thoma * 1.5).', en: 'Cross-sectional area fulfilling the Thoma hydraulic hydrodynamic stability criterion (safety factor > 1.5).' },
      { fr: 'Capacité volumique empêchant le déversement en crête et l\'entraînement d\'air en creux.', en: 'Reservoir volume dimensioned against spillway overtopping at maximum surge and vortex air entrainment at upsurge.' },
    ],
    failureModes: [
      { fr: 'Instabilité oscillatoire auto-entretenue entre le régulateur de vitesse et la masse d\'eau.', en: 'Self-excited governor hunting interacting resonance with the water column surge pendulum.' },
      { fr: 'Cavitation ou dépression en creux entraînant de l\'air dans la conduite haute pression.', en: 'Downsurge vortex sucking air into the penstock causing catastrophic water slug hammers.' },
    ],
    protectionMeasures: [
      { fr: 'Orifice bidirectionnel à perte de charge dissymétrique pour amortir rapidement les oscillations.', en: 'Asymmetrical throttle orifice offering high resistance to upsurge and low resistance to inflow.' },
      { fr: 'Capteurs radar de niveau redondants interverrouillés avec l\'automate de régulateur.', en: 'Redundant non-contact radar level sensors interlocking governor allowable ramp-rates.' },
    ],
    standards: ['Jaeger Engineering Fluid Mechanics', 'USACE EM 1110-2-2401', 'IEC 60041'],
  },
  {
    id: 'H07',
    code: 'H07',
    name: { fr: 'Turbine Hydraulique & Roue (Francis / Kaplan / Pelton)', en: 'Hydraulic Turbine & Runner Assembly' },
    category: 'mechanical',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Organe de conversion thermo-fluidique transformant l\'énergie potentielle et cinétique de l\'eau en couple mécanique rotatif sur l\'arbre principal.',
      en: 'Turbomachinery prime mover converting fluid potential and kinetic head into rotational mechanical torque on the shaft.',
    },
    keyComponents: ['Bâche spirale mécano-soudée', 'Avant-distributeur et directrices', 'Roue en acier 13Cr-4Ni', 'Aspirateur diffuseur (Draft Tube)'],
    designCriteria: [
      { fr: 'Rendement hydraulique de pointe > 95% avec plage d\'exploitation stable sans cavitation.', en: 'Peak prototype hydraulic efficiency > 95% with wide stable operation zone avoiding deep-part load vortex rope.' },
      { fr: 'Résistance mécanique de la roue à la vitesse d\'emballement maximale (> 180% n_nominale).', en: 'Runner mechanical structural integrity under runaway speed centrifuging (> 180% rated RPM).' },
    ],
    failureModes: [
      { fr: 'Érosion de cavitation et fissuration en fatigue au raccordement aube/couronne.', en: 'Cavitation pitting erosion and high-cycle fatigue cracking at blade-crown fillets.' },
      { fr: 'Rupture d\'une biellette de directrice suite au coincement d\'un corps étranger.', en: 'Shear pin fracture on wicket-gate operating linkage upon foreign object jamming.' },
    ],
    protectionMeasures: [
      { fr: 'Injection d\'air comprimé sous la roue pour atténuer la torche tourbillonnaire à charge partielle.', en: 'Atmospheric or forced compressed-air injection into runner cone to cushion part-load vortex rope.' },
      { fr: 'Détecteurs d\'arrachement de goupille de cisaillement avec alarme et blocage de mouvement.', en: 'Proximity sensors monitoring shear pin status on every guide-vane lever mechanism.' },
    ],
    standards: ['IEC 60041', 'IEC 60193', 'ISO 10816-5'],
  },
  {
    id: 'H08',
    code: 'H08',
    name: { fr: 'Ligne d\'Arbre & Paliers (Guide & Butée)', en: 'Turbine Shaft & Bearing Assemblies' },
    category: 'mechanical',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Arbre forgé en acier allié transmettant le couple mécanique, guidé radialement par les paliers et soutenu axialement par le palier de butée hydrodynamique.',
      en: 'Forged alloy steel shafting guided by radial guide bearings and suspended by heavy hydrodynamic thrust bearings.',
    },
    keyComponents: ['Arbre forgé vertical/horizontal', 'Grain de butée et patins oscillants inclinables', 'Palier guide turbine à bain d\'huile', 'Pompe de sustentation haute pression'],
    designCriteria: [
      { fr: 'Capacité portante de la butée sous charge statique + poussée hydraulique maximale (> 500 tonnes).', en: 'Thrust bearing load capacity sized for total rotor weight plus dynamic hydraulic downthrust (> 500 tons).' },
      { fr: 'Vitesse critique de flexion de l\'arbre située à au moins 25% au-dessus de la vitesse d\'emballement.', en: 'Shaft first lateral critical whirling speed located at least 25% above maximum runaway speed.' },
    ],
    failureModes: [
      { fr: 'Rupture du film d\'huile hydrodynamique causant le grippage instantané des patins de butée.', en: 'Hydrodynamic oil film collapse causing catastrophic metal-to-metal babbitt wipe.' },
      { fr: 'Fissuration par fatigue torsionnelle suite à des synchronisations réseau hors-phase.', en: 'Torsional fatigue fracture following out-of-step faulty synchronizing shocks.' },
    ],
    protectionMeasures: [
      { fr: 'Injection d\'huile haute pression (150 bar) de sustentation au démarrage et à l\'arrêt (Jacking).', en: 'High-pressure hydrostatic jacking oil pump lifting rotor before rotation and during braking.' },
      { fr: 'Sondes duplex PT100 encastrées dans le régule des patins avec déclenchement à 85°C.', en: 'Duplex PT100 RTDs embedded in babbitt metal triggering unit trip at 85°C.' },
    ],
    standards: ['ISO 7919-5', 'ISO 20816-5', 'DIN 31652'],
  },
  {
    id: 'H09',
    code: 'H09',
    name: { fr: 'Alternateur Synchrone Hydroélectrique', en: 'Salient-Pole Synchronous Hydro Generator' },
    category: 'electrical',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Machine synchrone à pôles saillants convertissant la puissance mécanique en énergie électrique triphasée 10.5 - 15.75 kV régulée à 50 Hz.',
      en: 'Vertical salient-pole synchronous generator generating clean three-phase power at 10.5 - 15.75 kV and 50 Hz.',
    },
    keyComponents: ['Stator à barres Roebel isolées époxy classe F', 'Rotor à pôles saillants feuilletés', 'Bagues collectrices et porte-balais', 'Freins mécaniques et vérins de levage'],
    designCriteria: [
      { fr: 'Constante d\'inertie H (ou moment d\'inertie GD²) garantissant la stabilité transitoire de fréquence.', en: 'Inertia constant H (or flywheel effect GD²) dimensioned to limit frequency deviation upon full load rejection.' },
      { fr: 'Échauffement thermique des enroulements conforme à la classe d\'isolation B sous service continu classe F.', en: 'Temperature rise restricted to Class B limits despite using Class F VPI insulation system.' },
    ],
    failureModes: [
      { fr: 'Claquant diélectrique d\'une barre statorique provoquant un court-circuit entre spires ou à la masse.', en: 'Inter-turn stator insulation breakdown or stator-to-ground flashover.' },
      { fr: 'Décollement ou déformation d\'un pôle rotorique sous l\'effet de la force centrifuge en survitesse.', en: 'Rotor pole dovetail yielding or damper winding bar rupture under centrifugal overspeed stress.' },
    ],
    protectionMeasures: [
      { fr: 'Système de protection différentielle 87G et décharge partielle en ligne surveillée en continu.', en: 'Numerical differential protection 87G and online partial discharge capacitive couplers.' },
      { fr: 'Refroidissement en boucle fermée par aéroréfrigérants eau-air assurant T_air < 40°C.', en: 'Closed-circuit air-to-water heat exchangers keeping stator cooling air below 40°C.' },
    ],
    standards: ['IEC 60034-1', 'IEEE C50.12', 'IEEE 115'],
  },
  {
    id: 'H10',
    code: 'H10',
    name: { fr: 'Système d\'Excitation & Régulateur de Tension (AVR)', en: 'Generator Excitation & Voltage Regulator (AVR)' },
    category: 'electrical',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Fournit le courant continu magnétique magnétisant les pôles du rotor via un pont de thyristors et régule la tension statorique ainsi que la puissance réactive.',
      en: 'Controls rotor DC field current via static thyristor converters, regulating stator terminal voltage and grid reactive power exchange.',
    },
    keyComponents: ['Transformateur d\'excitation sec', 'Pont redresseur réversible à thyristors (pont complet)', 'Régulateur numérique double canal (AVR)', 'Disjoncteur de champ et résistance de décharge'],
    designCriteria: [
      { fr: 'Plafond de tension d\'excitation (Ceiling Voltage > 2.0 p.u.) pour soutien rapide de tension sur court-circuit.', en: 'Excitation ceiling voltage ratio > 2.0 p.u. with sub-second forcing under severe system faults.' },
      { fr: 'Régulation statique de tension dans une bande de ±0.5% de la consigne nominale.', en: 'Terminal voltage regulation accuracy within ±0.5% of setpoint under full load swings.' },
    ],
    failureModes: [
      { fr: 'Perte d\'excitation par défaillance du pont thyristors transformant l\'alternateur en génératrice asynchrone.', en: 'Loss of field excitation through bridge thyristor gate driver failure, pulling machine out of synchronism.' },
      { fr: 'Sur-excitation prolongée causant la saturation magnétique et l\'échauffement destructif du rotor.', en: 'Overexcitation leading to rotor thermal destruction without prompt protective limiter action.' },
    ],
    protectionMeasures: [
      { fr: 'Limiteur V/Hz, limiteur de courant rotorique OEL et limiteur de sous-excitation UEL intégrés.', en: 'Integrated Overexcitation Limiter (OEL), Underexcitation Limiter (UEL), and Volts/Hertz ratio limiter.' },
      { fr: 'Désexcitation ultra-rapide par basculement du pont thyristor en onduleur puis coupure 41.', en: 'Fast de-excitation through thyristor bridge inversion followed by field breaker 41 trip across discharge crowbar.' },
    ],
    standards: ['IEEE 421.1', 'IEEE 421.5', 'IEC 60034-16'],
  },
  {
    id: 'H11',
    code: 'H11',
    name: { fr: 'Régulateur de Vitesse & Vannage Électro-Hydraulique', en: 'Speed Governor & Hydraulic Regulation' },
    category: 'control',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Asservissement électro-hydraulique à huile haute pression contrôlant l\'ouverture des directrices pour stabiliser la fréquence réseau et moduler la puissance active.',
      en: 'Electro-hydraulic high-pressure governor positioning turbine wicket gates to maintain 50 Hz grid frequency and modulate active power.',
    },
    keyComponents: ['Contrôleur numérique PID/PIDD', 'Servovalve proportionnelle haute dynamique', 'Servomoteurs hydrauliques de directrices', 'Groupe oléopneumatique à accumulateurs (60-160 bar)'],
    designCriteria: [
      { fr: 'Statisme permanent réglable de 0 à 10% pour le partage équitable de la charge entre groupes.', en: 'Permanent droop configurable between 0% and 10% for proportional grid primary reserve allocation.' },
      { fr: 'Temps de fermeture d\'urgence optimisé pour limiter à la fois la survitesse et le coup de bélier.', en: 'Cushioned emergency closing law calibrated to trade off rotor overspeed against penstock surge pressures.' },
    ],
    failureModes: [
      { fr: 'Chute de pression dans l\'accumulateur d\'huile entraînant la perte de contrôle des directrices.', en: 'Governor oil accumulator pressure drop disabling servomotor actuation and runaway defense.' },
      { fr: 'Instabilité de régulation (pompage) due à un décalage des capteurs LVDT de position de vanne.', en: 'Governor hunting and power oscillations caused by feedback LVDT drift or back-lash play.' },
    ],
    protectionMeasures: [
      { fr: 'Fermeture d\'urgence gravitaire par contrepoids ou ressorts indépendante de l\'alimentation électrique.', en: 'Fail-safe mechanical gravity or nitrogen accumulator emergency trip closing cylinder.' },
      { fr: 'Relais centrifuge ou électronique indépendant de survitesse (ANSI 12) déclenchant à 115% n_nom.', en: 'Independent mechanical/electronic overspeed detection relay (12) tripping at 115% nominal RPM.' },
    ],
    standards: ['IEC 61362', 'IEEE 125', 'IEC 60308'],
  },
  {
    id: 'H12',
    code: 'H12',
    name: { fr: 'Circuit d\'Eau de Refroidissement & Échangeurs', en: 'Cooling Water Systems & Heat Exchangers' },
    category: 'auxiliary',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Prélèvement d\'eau brute filtrée ou boucle fermée évacuant les calories perdues des enroulements alternateur, des paliers et des transformateurs.',
      en: 'Raw-water intake or closed-loop cooling circuits dissipating thermal losses from stator windings, bearings, and step-up transformers.',
    },
    keyComponents: ['Filtres automatiques autonettoyants', 'Pompes centrifuges de circulation redondantes', 'Échangeurs tubulaires eau-huile de paliers', 'Batteries de refroidissement statorique eau-air'],
    designCriteria: [
      { fr: 'Redondance intégrale N+1 des motopompes avec permutation automatique en moins de 5 secondes.', en: 'Full N+1 motor pump redundancy with automatic backup switchover within 5 seconds upon loss of flow.' },
      { fr: 'Dimensionnement thermique basé sur la température maximale de l\'eau du fleuve en saison chaude (30°C).', en: 'Thermal sizing based on worst-case tropical river water temperature (30°C).' },
    ],
    failureModes: [
      { fr: 'Colmatage soudain des filtres à panier par limon ou algues entraînant la coupure du débit.', en: 'Basket strainer blinding by river silt or floating biomass causing cooling flow cutoff.' },
      { fr: 'Fuite d\'eau dans les réfrigérants de palier contaminant le bac d\'huile de lubrification.', en: 'Cooler tube rupture introducing raw water contamination into bearing lubricating oil sumps.' },
    ],
    protectionMeasures: [
      { fr: 'Débitmètres électromagnétiques et pressostats différentiels avec alarme et délestage automatique.', en: 'Electromagnetic flowmeters and pressure sensors triggering auto-backwash and unit thermal trip.' },
      { fr: 'Pressurisation de l\'huile de palier à une pression supérieure à celle de l\'eau de refroidissement.', en: 'Maintaining bearing oil pressure higher than cooling water pressure to prevent water ingress.' },
    ],
    standards: ['IEC 60034-6', 'ASME Section VIII', 'HEI Standards for Heat Exchangers'],
  },
  {
    id: 'H13',
    code: 'H13',
    name: { fr: 'Système d\'Huile & Lubrification des Paliers', en: 'Lubrication Oil & High-Pressure Jacking' },
    category: 'auxiliary',
    domainLayer: 'electromechanical',
    description: {
      fr: 'Stockage, filtration, dégazage et circulation d\'huile minérale ou synthétique lubrifiant les paliers guides et la butée du groupe.',
      en: 'Storage, circulation, thermal conditioning, and purification of ISO VG 46/68 oil for hydrodynamic bearings.',
    },
    keyComponents: ['Bacs d\'huile acier inoxydable', 'Groupe de conditionnement d\'huile portable (purificateur)', 'Centrale de sustentation HP (150 bar)', 'Déshuileurs et séparateurs de brouillard'],
    designCriteria: [
      { fr: 'Maintien de la classe de propreté ISO 4406 (16/14/11) par filtration absolue 10 microns.', en: 'Cleanliness standard enforcement per ISO 4406 (16/14/11) via continuous 10-micron absolute filtration.' },
      { fr: 'Refroidissement garantissant une température d\'huile en cuve comprise entre 45°C et 55°C.', en: 'Oil sump bulk temperature stabilized strictly between 45°C and 55°C.' },
    ],
    failureModes: [
      { fr: 'Dégradation par oxydation thermique ou émulsion de l\'huile réduisant le pouvoir lubrifiant.', en: 'Oil oxidation and emulsification reducing lubricating film shear strength and viscosity.' },
      { fr: 'Niveau d\'huile bas dans le bac de butée consécutif à une fuite sur un joint tournant.', en: 'Bearing oil sump level depletion caused by rotating shaft oil-seal leakage.' },
    ],
    protectionMeasures: [
      { fr: 'Surveillance optique en ligne de la teneur en eau (ppm) et capteurs de niveau magnétostrictifs.', en: 'Continuous optical water-in-oil saturation sensors (ppm) and dual float switches.' },
      { fr: 'Arrêt automatique immédiat du groupe sur niveau très bas ou température palier > 85°C.', en: 'Hardwired emergency stop trip interlock on very low oil sump level or bearing temperature > 85°C.' },
    ],
    standards: ['ISO 4406', 'ASTM D4304', 'DIN 51524'],
  },
  {
    id: 'H14',
    code: 'H14',
    name: { fr: 'Transformateur Élévateur Principal (GSU) & Liaison MT', en: 'Generator Step-Up Transformer (GSU) & MV Links' },
    category: 'electrical',
    domainLayer: 'electrical_power',
    description: {
      fr: 'Transformateur triphasé élevant la tension de production (10.5-15 kV) à la tension du réseau de transport (90-225 kV) pour minimiser les pertes Joule.',
      en: 'Power transformer stepping up generation voltage (10.5-15 kV) to bulk transmission grid levels (90-225 kV).',
    },
    keyComponents: ['Transformateur triphasé ONAF/ODAF', 'Gaines à barres blindées phase isolée (IPB)', 'Traversées HT céramique ou RIP', 'Relais Buchholz et soupape de surpression Qualitrol'],
    designCriteria: [
      { fr: 'Tenue aux surtensions de foudre (BIL 1 050 kV pour réseau 225 kV) et surtensions de manœuvre.', en: 'Basic Lightning Impulse Insulation Level (BIL 1,050 kV for 225 kV systems) and switching surge withstand.' },
      { fr: 'Tenue mécanique aux efforts électrodynamiques de court-circuit symétrique franc aux bornes.', en: 'Full mechanical dynamic short-circuit withstand rating during primary terminal bolting faults.' },
    ],
    failureModes: [
      { fr: 'Arc électrique interne entre spires avec décomposition de l\'huile et explosion de cuve.', en: 'Inter-turn dielectric arc producing combustible acetylene gas and explosive tank rupture.' },
      { fr: 'Dégradation diélectrique des traversées capacitives par décharges partielles.', en: 'Capacitive bushing insulation degradation leading to catastrophic phase-to-ground flashover.' },
    ],
    protectionMeasures: [
      { fr: 'Protection différentielle transformateur numérique 87T ultra-rapide (< 20 ms).', en: 'Numerical transformer percentage differential relay (ANSI 87T) with harmonic inrush restraint.' },
      { fr: 'Système d\'analyse en ligne des gaz dissous (DGA hydrogène/acétylène) et relais Buchholz 63.', en: 'Online Dissolved Gas Analysis (DGA) monitoring and mechanical Buchholz gas surge detection.' },
    ],
    standards: ['IEC 60076-1', 'IEEE C57.12.00', 'IEEE C37.91'],
  },
  {
    id: 'H15',
    code: 'H15',
    name: { fr: 'Disjoncteur Groupe (GCB) & Gaines à Barres', en: 'Generator Circuit Breaker (GCB) & Isolated Phase Bus' },
    category: 'electrical',
    domainLayer: 'electrical_power',
    description: {
      fr: 'Disjoncteur moyenne tension haute puissance (SF6 ou vide) intercalé entre l\'alternateur et le transformateur pour sécuriser le couplage et le découplage.',
      en: 'High-current medium-voltage circuit breaker (SF6 or vacuum) providing switching and fault isolation at generator voltage.',
    },
    keyComponents: ['Chambre de coupure SF6 ou ampoule à vide', 'Sectionneur de mise à la terre visible', 'Gaine blindée à phases séparées pressurisée', 'Commande mécanique à ressort ou oléopneumatique'],
    designCriteria: [
      { fr: 'Pouvoir de coupure élevé des courants de court-circuit avec composante apériodique sans passage à zéro.', en: 'Severe asymmetrical short-circuit current breaking capability with delayed current zero crossings.' },
      { fr: 'Courant nominal permanent élevé (4 000 à 12 000 A) sous échauffement maîtrisé.', en: 'High continuous rated current (4,000 to 12,000 A) with forced air or natural convective cooling.' },
    ],
    failureModes: [
      { fr: 'Fuite de gaz SF6 réduisant la rigidité diélectrique et provoquant un réamorçage lors de la coupure.', en: 'SF6 gas pressure loss reducing quenching dielectric strength causing inter-contact restrike.' },
      { fr: 'Refus d\'ouverture du disjoncteur (50BF) lors d\'un ordre de déclenchement de protection.', en: 'Breaker failure to open (50BF) upon protective trip, requiring upstream backup tripping.' },
    ],
    protectionMeasures: [
      { fr: 'Manomètres compensés en température à double seuil d\'alarme et de blocage de manœuvre.', en: 'Temperature-compensated SF6 density monitors with two-stage alarm and trip-lockout interlocks.' },
      { fr: 'Relais de défaillance disjoncteur ANSI 50BF commandant l\'ouverture des disjoncteurs encadrants.', en: 'ANSI 50BF breaker failure scheme shedding adjacent busbar sections within 120 ms.' },
    ],
    standards: ['IEEE C37.013', 'IEC 62271-100', 'IEC 62271-102'],
  },
  {
    id: 'H16',
    code: 'H16',
    name: { fr: 'Poste d\'Évacuation Haute Tension (AIS / GIS)', en: 'High-Voltage Switchyard & Substation (AIS/GIS)' },
    category: 'electrical',
    domainLayer: 'electrical_power',
    description: {
      fr: 'Poste à haute tension (extérieur AIS ouvert ou sous enveloppe métallique GIS SF6) collectant l\'énergie de l\'usine et l\'injectant dans les lignes de transport.',
      en: 'High-voltage substation (air-insulated AIS or gas-insulated GIS) interfacing generation transformers with transmission lines.',
    },
    keyComponents: ['Disjoncteurs 225 kV à gaz SF6', 'Sectionneurs de ligne et de mise à la terre', 'Transformateurs de mesure (TC/TT)', 'Parafoudres à oxyde de zinc (ZnO)'],
    designCriteria: [
      { fr: 'Schéma unifilaire à double jeu de barres ou disjoncteur et demi pour garantir la continuité de service.', en: 'Double busbar or breaker-and-a-half topology ensuring maintenance flexibility and reliability.' },
      { fr: 'Protection coordonnée contre les chocs de foudre par parafoudres et câbles de garde aériens.', en: 'Insulation coordination with surge arresters and overhead shield wires protecting against direct lightning strikes.' },
    ],
    failureModes: [
      { fr: 'Contournement diélectrique sur chaîne d\'isolateurs par pollution ou foudre directe.', en: 'Insulator string flashover driven by environmental pollution, salt fog, or severe lightning overvoltages.' },
      { fr: 'Défaut sur jeu de barres haute tension consécutif à une rupture d\'organe mécanique.', en: 'Busbar short-circuit fault following structural insulator fracture or disconnect switch failure.' },
    ],
    protectionMeasures: [
      { fr: 'Protection différentielle de barres ANSI 87B à haute impédance avec élimination en moins de 15 ms.', en: 'High-impedance or low-impedance numerical busbar differential protection (87B) operating in < 15 ms.' },
      { fr: 'Parafoudres ZnO à haute énergie d\'absorption installés au plus près des traversées.', en: 'Heavy-duty station class metal-oxide surge arresters installed directly adjacent to transformer bushings.' },
    ],
    standards: ['IEC 62271-200', 'IEC 62271-203', 'IEEE C37.122'],
  },
  {
    id: 'H17',
    code: 'H17',
    name: { fr: 'Contrôle-Commande Numérique (DCS) & SCADA Usine', en: 'Distributed Control System (DCS) & Plant SCADA' },
    category: 'control',
    domainLayer: 'automation_defense',
    description: {
      fr: 'Plateforme informatique temps-réel centralisant les télémesures, télésignalisations et commandes pour l\'exploitation automatisée de l\'ensemble du site.',
      en: 'Real-time computer automation architecture centralizing telemetry, alarms, control loops, and HMI supervisory interfaces.',
    },
    keyComponents: ['Automates programmables (PLC) redondants', 'Postes de conduite IHM opérateur', 'Réseau Ethernet industriel déterministe (PRP/HSR)', 'Serveurs d\'archivage et historien SCADA'],
    designCriteria: [
      { fr: 'Architecture tolérante aux pannes sans arrêt de production en cas de panne d\'un processeur.', en: 'Fault-tolerant redundancy with bumpless failover under primary controller or network failure.' },
      { fr: 'Horodatage absolu des événements à la milliseconde via protocole IEEE 1588 PTP ou GPS.', en: 'Sequence of Events (SOE) time-tagging resolution < 1 ms synchronized via GPS and IEEE 1588 PTP.' },
    ],
    failureModes: [
      { fr: 'Perte de communication sur le bus de commande privant l\'opérateur de téléconduite.', en: 'Industrial Ethernet network partition disabling remote supervisory control and alarming.' },
      { fr: 'Plantage logiciel d\'un automate de tranche laissant les vannes dans leur dernière position.', en: 'PLC CPU hang or firmware fault freezing actuator positions in their last commanded state.' },
    ],
    protectionMeasures: [
      { fr: 'Réseaux redondants parallèles selon protocole PRP (CEI 62439-3) sans temps de reconfiguration.', en: 'Dual Parallel Redundancy Protocol (PRP per IEC 62439-3) transmitting frames simultaneously on two LANs.' },
      { fr: 'Commandes de sécurité manuelles câblées indépendantes du système numérique.', en: 'Physical hardwired emergency pushbutton matrix directly operating trip lockouts independently of DCS.' },
    ],
    standards: ['IEC 62270', 'IEC 61850', 'IEEE 1588'],
  },
  {
    id: 'H18',
    code: 'H18',
    name: { fr: 'Séquence Automatique Groupe & Black-Start', en: 'Unit Automation Sequencing & Black-Start' },
    category: 'control',
    domainLayer: 'automation_defense',
    description: {
      fr: 'Ordonnancement séquentiel automatisé des 12 étapes de démarrage, synchronisation automatique et capacité de renvoi de tension réseau sans source externe.',
      en: 'Automated 12-step startup/shutdown state machine, synchrocheck, and black-start grid restoration capability.',
    },
    keyComponents: ['Automate de séquence groupe', 'Synchrocoupleur automatique numérique (ANSI 25)', 'Groupe diesel de démarrage d\'urgence Black-Start', 'Système d\'îlotage automatique'],
    designCriteria: [
      { fr: 'Démarrage à froid complet jusqu\'au couplage au réseau en moins de 3 minutes.', en: 'Cold start sequence from stopped state to grid-synchronized operation completed within 180 seconds.' },
      { fr: 'Capacité de black-start autonome alimentée sur batterie 110 Vcc et groupe diesel auxiliaire.', en: 'Black-start self-restoration energized from station 110 VDC battery banks and emergency diesel.' },
    ],
    failureModes: [
      { fr: 'Refus de couplage par non-concordance de phase lors de la synchronisation au réseau perturbé.', en: 'Synchrocheck permissive timeout caused by severe grid frequency excursions or phase flutter.' },
      { fr: 'Échec d\'amorçage de l\'excitation interrompant le cycle de démarrage automatique.', en: 'Excitation buildup failure blocking automatic start progression and generating sequence lockout.' },
    ],
    protectionMeasures: [
      { fr: 'Contrôle redondant de synchronisme ANSI 25 interdisant la fermeture hors de la fenêtre d\'angle ±5°.', en: 'Hardware synchrocheck interlock preventing GCB closure outside ΔV < 2%, Δf < 0.1 Hz, Δθ < 5° window.' },
      { fr: 'Temporisateurs de surveillance de progression de pas avec repli en sécurité automatique.', en: 'Step progression watchdog timers automatically aborting start and returning unit to safe stop on stall.' },
    ],
    standards: ['IEC 62270', 'IEEE C37.2', 'IEEE 67'],
  },
  {
    id: 'H19',
    code: 'H19',
    name: { fr: 'Surveillance Vibratoire & Diagnostic Prédictif', en: 'Condition Monitoring & Vibration Diagnostics' },
    category: 'control',
    domainLayer: 'automation_defense',
    description: {
      fr: 'Surveillance en temps-réel des grandeurs mécaniques dynamiques : orbites d\'arbre, battements radiaux, vibrations des paliers et entrefer rotor-stator.',
      en: 'Real-time dynamic mechanical monitoring: shaft orbits, runout, bearing vibration spectra, and dynamic air-gap.',
    },
    keyComponents: ['Capteurs de proximité à courants de Foucault (Eddy Current)', 'Accéléromètres piézoélectriques basse fréquence', 'Capteurs capacitifs d\'entrefer rotor/stator', 'Châssis d\'analyse spectrale FFT'],
    designCriteria: [
      { fr: 'Échantillonnage haute fréquence synchronisé au tour (Keyphasor) pour le calcul des spectres d\'ordre.', en: 'Keyphasor once-per-revolution phase reference pulse for accurate synchronous order tracking.' },
      { fr: 'Précision de mesure d\'entrefer de ±0.1 mm sur un entrefer nominal de 12 à 25 mm.', en: 'Air-gap sensor resolution of ±0.1 mm detecting rotor eccentricity and thermal stator ovalization.' },
    ],
    failureModes: [
      { fr: 'Frottement rotor-stator imminent consécutif à une déformation thermique du bâti statorique.', en: 'Impending rotor-stator mechanical rub caused by thermal expansion deformation or pole tilting.' },
      { fr: 'Désalignement angulaire de la ligne d\'arbre ou balourd mécanique excessif.', en: 'Shaft unbalance or angular misalignment generating severe 1X and 2X rotational vibration harmonics.' },
    ],
    protectionMeasures: [
      { fr: 'Alarmes prédictives multiniveaux selon la norme ISO 20816-5 avec alerte et déclenchement d\'urgence.', en: 'Configurable multi-level alarm and trip relays compliant with ISO 20816-5 severity boundary tables.' },
      { fr: 'Détection en temps réel des tourbillons de torche hydraulique par capteurs de pulsation dans l\'aspirateur.', en: 'Draft tube dynamic piezoresistive pressure sensors detecting dangerous full-load rheingans surges.' },
    ],
    standards: ['ISO 20816-5', 'ISO 7919-5', 'EPRI Hydro Condition Monitoring Guidelines'],
  },
  {
    id: 'H20',
    code: 'H20',
    name: { fr: 'Protections Électriques & Relais Numériques', en: 'Electrical Protection Relays & Interlocks' },
    category: 'protection',
    domainLayer: 'automation_defense',
    description: {
      fr: 'Ensemble coordonné de calculateurs numériques de protection assurant la détection instantanée des défauts et l\'isolement sélectif des équipements.',
      en: 'Coordinated numerical protection relays delivering ultrafast fault isolation and equipment security.',
    },
    keyComponents: ['Relais multifonctions groupe (A et B indépendants)', 'Relais différentiels transformateur (87T)', 'Relais de verrouillage bistable (86)', 'Transformateurs de courant (TC) classe 5P20'],
    designCriteria: [
      { fr: 'Architecture de protection redondante intégrale à double chaîne (Chaîne A + Chaîne B) autonome.', en: 'Complete dual-primary redundancy (Main 1 + Main 2) with segregated CT/VT cores and DC trip coils.' },
      { fr: 'Temps total d\'élimination des défauts internes inférieur à 80 ms (relais 20 ms + disjoncteur 60 ms).', en: 'Total fault clearance time < 80 ms (relay calculation 20 ms + circuit breaker mechanical separation 60 ms).' },
    ],
    failureModes: [
      { fr: 'Fonctionnement hors-phase ou retour de puissance motrice (32R) entraînant la cavitation destructrice de la roue.', en: 'Reverse active power flow (ANSI 32R) turning generator into motor driving turbine with churning cavitation.' },
      { fr: 'Sous-impédance ou surintensité non éliminée par défaillance du disjoncteur principal.', en: 'Uncleared high-current faults resulting in catastrophic transformer tank rupture or busbar vaporization.' },
    ],
    protectionMeasures: [
      { fr: 'Relais 32R temporisé réglé à 1.5% P_nominale avec ouverture immédiate du disjoncteur groupe.', en: 'Sensitive reverse power protection (32R) set to 1.0 - 2.0% rated power tripping within 2 to 5 seconds.' },
      { fr: 'Relais bistables 86G et 86T nécessitant un réarmement manuel obligatoire après inspection.', en: 'Dual hand-reset lockout relays (86G/86T) preventing restart until physical investigation is cleared.' },
    ],
    standards: ['IEEE C37.102', 'IEC 60255-1', 'IEEE C37.91'],
  },
  {
    id: 'H21',
    code: 'H21',
    name: { fr: 'Services Auxiliaires AC/DC & Batteries d\'Usine', en: 'Station Service AC/DC & Battery Systems' },
    category: 'auxiliary',
    domainLayer: 'electrical_power',
    description: {
      fr: 'Réseaux de distribution basse tension fournissant l\'énergie vitale aux auxiliaires : pompes, régulateurs, contrôle-commande et éclairage de secours.',
      en: 'Low-voltage distribution boards, inverters, and battery banks providing uninterruptible operational power.',
    },
    keyComponents: ['Banc de batteries étanches au plomb ou Ni-Cd 110 V / 220 V', 'Chargeurs redresseurs industriels redondants', 'Tableaux généraux basse tension (TGBT) 400 V', 'Groupe électrogène diesel de secours usine'],
    designCriteria: [
      { fr: 'Autonomie des batteries d\'au moins 8 heures d\'alimentation continue des sécurités sans recharge.', en: 'DC battery bank sized to power all protective relays, tripping coils, and emergency lube pumps for 8 hours.' },
      { fr: 'Basculement automatique Normal/Secours (ATS) sur source externe ou diesel en moins de 10 secondes.', en: 'Automatic Transfer Switch (ATS) re-energizing essential 400V auxiliaries within 10 seconds of grid loss.' },
    ],
    failureModes: [
      { fr: 'Blackout total des alimentations continues 110 Vcc paralysant tous les relais de protection.', en: 'Total station DC blackout disabling protective tripping coils and emergency shutoff valves.' },
      { fr: 'Défaut d\'isolement ou fuite à la terre sur le réseau continu perturbant la logique des automates.', en: 'Floating DC bus ground fault corrupting PLC input signals or causing false relay trip outputs.' },
    ],
    protectionMeasures: [
      { fr: 'Contrôleurs permanents d\'isolement (CPI) sur réseau continu avec localisation automatique de fuite.', en: 'Continuous ground fault detector monitoring positive and negative DC poles against earth.' },
      { fr: 'Deux bancs de batteries séparés physiquement avec coupleur et double chargeur redondant.', en: 'Two independent 100% battery banks installed in fire-segregated rooms with automatic cross-tie.' },
    ],
    standards: ['IEEE 485', 'IEEE 946', 'IEC 60896'],
  },
  {
    id: 'H22',
    code: 'H22',
    name: { fr: 'Protection Incendie & Sécurité des Personnes', en: 'Fire Suppression & Life Safety Systems' },
    category: 'protection',
    domainLayer: 'balance_of_plant',
    description: {
      fr: 'Réseau de détection thermique/optique et d\'extinction automatique par eau pulvérisée ou gaz inerte protégeant les alternateurs et transformateurs.',
      en: 'Fire detection, deluge spray, gaseous extinguishing, and life safety escape systems for hydro plant infrastructure.',
    },
    keyComponents: ['Système déluge d\'eau pulvérisée haute pression', 'Extinction gaz inerte (CO2 / Novec) dans le puits d\'alternateur', 'Réseau de détection incendie adressable', 'Portes coupe-feu et clapets de désenfumage'],
    designCriteria: [
      { fr: 'Extinction complète d\'un feu de transformateur à huile minérale en moins de 60 secondes.', en: 'Complete flame knockdown of high-voltage oil transformer fires within 60 seconds of deluge discharge.' },
      { fr: 'Temporisation d\'évacuation avec alarme sonore et visuelle avant émission de CO2 dans la cuve alternateur.', en: 'Pre-discharge audible and visual alarm warning allowing personnel evacuation before CO2 release.' },
    ],
    failureModes: [
      { fr: 'Déclenchement intempestif de CO2 mettant en danger le personnel d\'exploitation dans l\'usine.', en: 'Accidental gas discharge in occupied spaces presenting lethal asphyxiation hazard.' },
      { fr: 'Gel ou perte de pression d\'eau dans le réseau d\'incendie lors d\'un sinistre réel.', en: 'Fire main dry-out or booster pump failure during actual major transformer dielectric fire.' },
    ],
    protectionMeasures: [
      { fr: 'Déverrouillage mécanique manuel obligatoire pour la neutralisation lors des interventions humaines.', en: 'Mechanical physical lockout valves disabled during human maintenance access inside generator pits.' },
      { fr: 'Pompes d\'incendie motopompe diesel autonome indépendantes de l\'alimentation électrique usine.', en: 'UL/FM approved dedicated diesel-driven fire pump maintaining 10 bar pressure in ring main.' },
    ],
    standards: ['NFPA 851', 'NFPA 13', 'NFPA 72'],
  },
  {
    id: 'H23',
    code: 'H23',
    name: { fr: 'Drainage, Épuisement & Pompage de Fosse', en: 'Drainage, Dewatering & Sump Pump Systems' },
    category: 'auxiliary',
    domainLayer: 'balance_of_plant',
    description: {
      fr: 'Collecte et évacuation des eaux d\'infiltration rocheuse, fuites de joints et vidange des conduits hydrauliques pour maintenance en cale sèche.',
      en: 'Collection, dewatering, and evacuation of rock seepage, shaft seal leakages, and penstock/draft-tube drainage.',
    },
    keyComponents: ['Bâche de drainage générale', 'Pompes submersibles de relevage eaux claires', 'Pompes d\'épuisement gros débit pour vidange aspirateur', 'Séparateur d\'hydrocarbures à coalescence'],
    designCriteria: [
      { fr: 'Capacité de pompage dimensionnée pour la crue de projet avec 100% de réserve motopompe.', en: 'Drainage pumping capacity sized for peak foundation seepage with 100% standby pump reserve.' },
      { fr: 'Traitement des eaux de fondation garantissant une teneur en huile rejetée < 5 mg/L.', en: 'Oil-water separator treatment ensuring discharged drainage water contains < 5 ppm hydrocarbons.' },
    ],
    failureModes: [
      { fr: 'Inondation de la galerie basse de l\'usine consécutif au blocage des flotteurs de commande des pompes.', en: 'Flooding of lower machine hall galleries caused by sump pump float switch jamming or power failure.' },
      { fr: 'Rupture d\'une vanne de vidange d\'aspirateur submergeant les planchers inférieurs.', en: 'Draft-tube dewatering valve failure under maximum tailwater head inundating the turbine pit.' },
    ],
    protectionMeasures: [
      { fr: 'Capteurs de niveau radar redondants avec seuil d\'inondation d\'urgence fermant les vannes de prise d\'eau.', en: 'Multi-level float and radar sensors triggering emergency plant shutoff and flood door closure.' },
      { fr: 'Alimentation secourue sur tableau de sécurité et clapets anti-retour étanches sur les collecteurs.', en: 'Dual check valves preventing river tailwater backflow into the powerhouse drainage sump.' },
    ],
    standards: ['USBR Powerhouse Dewatering Guidelines', 'DIN 19704', 'ISO 14001'],
  },
  {
    id: 'H24',
    code: 'H24',
    name: { fr: 'Pont Roulant Usine & Moyens de Levage Lourds', en: 'Powerhouse Overhead Cranes & Heavy Hoisting' },
    category: 'mechanical',
    domainLayer: 'balance_of_plant',
    description: {
      fr: 'Équipements de levage lourd (100 à 450 tonnes) permettant le montage, le démontage et la réhabilitation des rotors d\'alternateur et des roues de turbine.',
      en: 'Heavy overhead travelling cranes (100 to 450 tons) handling major component disassembly and maintenance.',
    },
    keyComponents: ['Poutres maîtresses mécano-soudées de pont roulant', 'Treuil principal à câble acier multi-brins', 'Palonnier spécial pour levage de rotor alternateur', 'Variateurs de vitesse à contrôle vectoriel de flux'],
    designCriteria: [
      { fr: 'Capacité nominale capable de lever le rotor complet équipé de ses pôles (+ marge 25%).', en: 'Rated hoisting capacity exceeding combined weight of generator rotor, shaft, and lifting beam (+25% margin).' },
      { fr: 'Vitesse de micro-descente lente (< 0.2 m/min) pour l\'insertion sans frottement dans l\'entrefer.', en: 'Creep hoisting micro-speed (< 0.2 m/min) ensuring zero-clash insertion of rotor into stator air gap.' },
    ],
    failureModes: [
      { fr: 'Rupture d\'un câble de levage ou défaillance du frein de retenue avec chute de charge lourde.', en: 'Hoist rope rupture or mechanical brake slippage during suspended rotor transit across machine hall.' },
      { fr: 'Déraillement du chariot ou flexion excessive de la voie de roulement de pont.', en: 'Crane rail misalignment or structural runway beam excessive deflection under dynamic wheel loads.' },
    ],
    protectionMeasures: [
      { fr: 'Double frein à disque redondant agissant directement sur le tambour de câble principal.', en: 'Dual redundant fail-safe disc brakes acting directly on the main rope drum flange.' },
      { fr: 'Limiteur de charge électronique et système anticollision optique entre ponts multiples.', en: 'Load cell overload limiters and laser anti-collision sensors between tandem bridge cranes.' },
    ],
    standards: ['CMAA Specification 70', 'FEM 1.001', 'ISO 4301'],
  },
  {
    id: 'H25',
    code: 'H25',
    name: { fr: 'Cybersécurité Industrielle (OT) & Réseaux Dédiés', en: 'Operational Technology (OT) Cybersecurity' },
    category: 'control',
    domainLayer: 'automation_defense',
    description: {
      fr: 'Dispositifs matériels et logiciels protégeant les réseaux industriels, automates et téléconduites contre les intrusions, malwares et cyberattaques.',
      en: 'Industrial control cybersecurity segmentation, firewalls, and cryptographic protocols per IEC 62443.',
    },
    keyComponents: ['Pare-feux industriels avec inspection profonde (DPI)', 'Sondes de détection d\'intrusion OT (IDS)', 'Passerelles de télémaintenance sécurisées avec VPN IPsec', 'Serveurs d\'authentification centralisée (RADIUS/TACACS+)'],
    designCriteria: [
      { fr: 'Cloisonnement strict en zones et conduits de sécurité selon la norme internationale CEI 62443.', en: 'Strict network segmentation into security zones and conduits compliant with IEC 62443-3-3.' },
      { fr: 'Isolation galvanique et passerelle unidirectionnelle (Data Diode) vers les réseaux tertiaires.', en: 'Hardware unidirectional data diode isolating the plant control network from corporate IT networks.' },
    ],
    failureModes: [
      { fr: 'Injection de fausses commandes de vanne ou modification non autorisée des consignes de régulation.', en: 'Unauthorized firmware tampering or malicious remote governor setpoint injection.' },
      { fr: 'Attaque par déni de service (DoS) saturant les bus de communication de protection électrique.', en: 'Denial-of-Service flooding saturating IEC 61850 GOOSE and SV optical protection bus.' },
    ],
    protectionMeasures: [
      { fr: 'Chiffrement et authentification cryptographique des messages GOOSE selon CEI 62351.', en: 'Cryptographic authentication of GOOSE and MMS messages per IEC 62351 security specifications.' },
      { fr: 'Blocage physique des ports USB et journalisation inviolable de tous les accès de maintenance.', en: 'Physical USB lockouts, multi-factor authentication, and immutable syslog event archiving.' },
    ],
    standards: ['IEC 62443', 'IEC 62351', 'NIST SP 800-82'],
  },
  {
    id: 'H26',
    code: 'H26',
    name: { fr: 'Dispatching Économique, Marché & Équilibrage', en: 'Economic Dispatch & Grid Ancillary Services' },
    category: 'control',
    domainLayer: 'governance_ops',
    description: {
      fr: 'Optimisation de la production hydroélectrique selon la valeur de l\'eau stockée, le réglage fréquence-puissance primaire/secondaire et le marché.',
      en: 'Water value optimization, automatic generation control (AGC), and primary/secondary ancillary service provision.',
    },
    keyComponents: ['Algorithme d\'optimisation hydraulique hydro-thermique', 'Interface de téléréglage AGC avec le dispatching national', 'Compteurs transactionnels bidirectionnels de haute précision', 'Logiciel de gestion des règlements contractuels'],
    designCriteria: [
      { fr: 'Fourniture de réserve primaire de fréquence (FCR) avec temps de réponse < 2 secondes.', en: 'Fast primary frequency response (FCR) activation with deadband < 20 mHz and response within 2.0 s.' },
      { fr: 'Maximisation de la marge économique sous contraintes de volume résiduel de retenue.', en: 'Economic optimization of peak hydro generation under statutory dry-season storage constraints.' },
    ],
    failureModes: [
      { fr: 'Turbinage excessif précoce entraînant l\'épuisement de la retenue avant la fin de l\'étiage.', en: 'Premature over-drafting depleting reservoir storage before end of dry-season low flows.' },
      { fr: 'Pénalités financières de non-respect de la consigne d\'équilibrage imposée par le dispatching.', en: 'Financial balancing market penalties caused by failure to meet scheduled dispatch obligations.' },
    ],
    protectionMeasures: [
      { fr: 'Courbes guides de gestion de retenue (Rule Curves) avec seuils d\'alerte infranchissables.', en: 'Mandatory seasonal water release envelopes enforced by real-time supervisory algorithms.' },
      { fr: 'Régulateurs de vitesse programmés pour basculer automatiquement en mode de soutien de réseau.', en: 'Automatic governor droop switching supporting system restoration during extreme frequency decay.' },
    ],
    standards: ['ENTSO-E Grid Code', 'IEEE 2800', 'IEEE C37.118'],
  },
  {
    id: 'H27',
    code: 'H27',
    name: { fr: 'Essais de Réception, Essais de Rendement & Commissioning', en: 'Testing, Commissioning & Field Acceptance' },
    category: 'mechanical',
    domainLayer: 'governance_ops',
    description: {
      fr: 'Protocoles métrologiques rigoureux vérifiant la conformité contractuelle : essais de rendement thermodynamique/acoustique et délestage à 100%.',
      en: 'Field commissioning protocols, efficiency thermodynamic/acoustic tests, and full-load rejection transient trials.',
    },
    keyComponents: ['Matériel de mesure de débit temps de transit ultrasonique', 'Capteurs de pression piézorésistifs étalonnés', 'Analyseur de réseau triphasé de précision classe 0.1', 'Enregistreur numérique haute vitesse transitoire'],
    designCriteria: [
      { fr: 'Mesure du rendement hydraulique global avec une incertitude globale inférieure à ±1.2%.', en: 'Hydro plant total efficiency measurement with expanded combined uncertainty < ±1.2% per IEC 60041.' },
      { fr: 'Validation des garanties contractuelles de puissance, survitesse et surpression coup de bélier.', en: 'Full demonstration of contractual guarantees regarding peak MW, runaway RPM, and surge pressures.' },
    ],
    failureModes: [
      { fr: 'Rendement mesuré inférieur aux garanties constructeur entraînant des pénalités financières lourdes.', en: 'Prototype measured efficiency falling short of contractual guarantee curve, invoking liquidated damages.' },
      { fr: 'Défaillance mécanique majeure (arrachement de pale ou rupture de palier) lors de l\'essai d\'emballement.', en: 'Structural yielding, bearing damage, or excessive vibration during full load rejection commissioning trials.' },
    ],
    protectionMeasures: [
      { fr: 'Augmentation par paliers progressifs de charge (25%, 50%, 75%, 100%) avec analyse vibratoire à chaque palier.', en: 'Staged incremental load rejection tests (25%, 50%, 75%, 100%) verifying transient safety before full release.' },
      { fr: 'Étalonnage accrédité préalable de l\'ensemble de la chaîne de mesure sur banc d\'étalonnage certifié.', en: 'Accredited pre-test calibration of all hydraulic pressure, torque, and power measuring instrumentation.' },
    ],
    standards: ['IEC 60041', 'IEC 60193', 'IEEE 115'],
  },
  {
    id: 'H28',
    code: 'H28',
    name: { fr: 'Conformité Normative, Réglementation & Cadre Juridique', en: 'Standards Compliance & Regulatory Framework' },
    category: 'civil',
    domainLayer: 'governance_ops',
    description: {
      fr: 'Gouvernance réglementaire, autorisations d\'exploitation de concession hydraulique et veille de conformité aux normes internationales.',
      en: 'Concession license compliance, water rights management, grid code certifications, and statutory reporting.',
    },
    keyComponents: ['Cahier des charges de concession hydroélectrique', 'Certificats de conformité aux codes de réseau nationaux', 'Rapports périodiques d\'inspection de sécurité des barrages', 'Audits environnementaux et sociaux périodiques'],
    designCriteria: [
      { fr: 'Conformité intégrale aux arrêtés de sécurité des barrages et plans d\'urgence particuliers (PPI).', en: 'Full compliance with national dam safety statutes and Emergency Action Plans (EAP).' },
      { fr: 'Respect des exigences du code de réseau pour la participation à la réserve de puissance.', en: 'Grid Code compliance for voltage ride-through (FRT) and reactive power capability.' },
    ],
    failureModes: [
      { fr: 'Suspension de l\'autorisation de turbiner consécutive au non-respect du débit écologique d\'étiage.', en: 'Statutory suspension of water rights or heavy fines for breaching downstream environmental flow quotas.' },
      { fr: 'Refus de raccordement réseau par non-conformité aux exigences de tenue aux creux de tension.', en: 'Grid operator disconnection order triggered by failure to comply with fault-ride-through (FRT) regulations.' },
    ],
    protectionMeasures: [
      { fr: 'Système d\'enregistrement inviolable des débits et des paramètres de restitution écologique.', en: 'Tamper-proof telemetry logging of environmental release discharge submitted directly to regulators.' },
      { fr: 'Comité d\'experts indépendants (Dam Safety Panel) inspectant l\'ouvrage tous les 5 ans.', en: 'Mandatory quinquennial inspection audits conducted by an independent international dam safety panel.' },
    ],
    standards: ['ICOLD Bulletins', 'World Bank Safeguards', 'ARSEL Guidelines (Cameroon)'],
  },
  {
    id: 'H29',
    code: 'H29',
    name: { fr: 'Cycle de Vie des Actifs, Maintenance & Réhabilitation', en: 'Asset Lifecycle, Maintenance & Overhaul' },
    category: 'mechanical',
    domainLayer: 'governance_ops',
    description: {
      fr: 'Gestion patrimoniale des équipements sur 40 à 100 ans : GMAO, politique de maintenance prédictive, rechargement d\'aubes et modernisation.',
      en: 'Long-term asset stewardship over 40-100 year design lives: CMMS, predictive maintenance, and life extension.',
    },
    keyComponents: ['Système de GMAO d\'usine', 'Atelier d\'usinage et de rechargement par soudage robotisé', 'Stock stratégique de pièces de rechange critiques', 'Outils d\'évaluation de la durée de vie résiduelle (RUL)'],
    designCriteria: [
      { fr: 'Disponibilité technique annuelle des groupes supérieure à 96%.', en: 'Overall technical plant availability target > 96% with planned outage windows optimized for dry season.' },
      { fr: 'Planification des grandes révisions décennales limitant l\'indisponibilité à moins de 60 jours par tranche.', en: 'Ten-year major overhaul planning restricting unit downtime to < 60 days per machine set.' },
    ],
    failureModes: [
      { fr: 'Indisponibilité prolongée due au manque d\'une pièce stratégique à long délai d\'approvisionnement.', en: 'Extended unserved energy outages caused by lack of long-lead strategic spare parts (e.g. runner, GSU).' },
      { fr: 'Usure excessive par abrasion des particules solides abrasives en suspension dans l\'eau fluviale.', en: 'Severe sand erosion wear on wicket gate seals and runner blade trailing edges during monsoon flood flows.' },
    ],
    protectionMeasures: [
      { fr: 'Revêtements céramiques ou carbure de tungstène appliqués par projection thermique HVOF sur les aubes.', en: 'High-Velocity Oxygen-Fuel (HVOF) tungsten-carbide coatings protecting against quartz silt abrasion.' },
      { fr: 'Stockage sur site d\'une roue de secours complète et d\'un jeu complet de directrices et coussinets.', en: 'On-site warehousing of 1 complete spare turbine runner, 1 set of wicket gates, and critical bearing pads.' },
    ],
    standards: ['ISO 55000', 'IEC 62264', 'IEC 60034-27'],
  },
  {
    id: 'H30',
    code: 'H30',
    name: { fr: 'Gestion Environnementale, Passes à Poissons & Sédiments', en: 'Environmental Flow, Fish Passage & Silt Management' },
    category: 'civil',
    domainLayer: 'civil_hydraulic',
    description: {
      fr: 'Dispositifs écologiques de continuité piscicole, restitution continue du débit biologique réservé et vanne de chasse de sédiments.',
      en: 'Fish migration ladders, minimum environmental bypass turbines, and bottom sluiceways for reservoir sediment flushing.',
    },
    keyComponents: ['Passe à poissons à bassins successifs', 'Micro-centrale de turbinage du débit réservé', 'Vannes de chasse de fond de sédiments', 'Barrières acoustiques et électriques répulsives'],
    designCriteria: [
      { fr: 'Vitesse de courant dans la passe à poissons compatible avec la capacité natatoire des espèces locales.', en: 'Fish pass slot velocity calibrated to swimming bursts of native migratory fish species.' },
      { fr: 'Chasses périodiques de sédiments évitant l\'ensablement de la prise d\'eau usinière.', en: 'Periodic controlled bottom sluicing flushing coarse bedload sediments away from intake sill.' },
    ],
    failureModes: [
      { fr: 'Mortalité piscicole par passage à travers les aubes de turbine lors des migrations aval.', en: 'Downstream fish entrainment mortality during passage through high-speed turbine runners.' },
      { fr: 'Envasement progressif de la retenue réduisant le volume utile de stockage de plus de 30%.', en: 'Severe reservoir sedimentation diminishing active storage capacity and choking bottom discharge gates.' },
    ],
    protectionMeasures: [
      { fr: 'Turbines hydroélectriques « Fish-Friendly » à profil d\'aube émoussé et vitesses de cisaillement limitées.', en: 'Fish-friendly turbine runner design with minimized blade leading-edge shear stresses.' },
      { fr: 'Conduites de déviation fluviale et chasses de crue programmées pour évacuer les dépôts limoneux.', en: 'Hydrodynamic sediment bypass tunnels and scheduled low-pool sediment sluicing flushes.' },
    ],
    standards: ['FAO Fisheries Technical Paper 419', 'ICOLD Bulletin 115', 'World Bank ESS 6'],
  },
  {
    id: 'H31',
    code: 'H31',
    name: { fr: 'Interface Réseau Haute Tension & Stabilité Dynamique', en: 'Transmission Grid Interface & Dynamic Stability' },
    category: 'electrical',
    domainLayer: 'electrical_power',
    description: {
      fr: 'Interaction dynamique entre les générateurs hydroélectriques et le réseau national : stabilité de tension, amortissement des oscillations et tenue aux creux.',
      en: 'Electromechanical dynamic interaction with transmission grid: angular stability, PSS damping, and fault ride-through.',
    },
    keyComponents: ['Lignes de transport 225 kV d\'évacuation', 'Stabilisateur de puissance PSS2B', 'Système de mesure vectorielle synchrophasorielle (PMU)', 'Automate de délestage de charge sur sous-fréquence'],
    designCriteria: [
      { fr: 'Maintien de la stabilité transitoire après un court-circuit triphasé de 100 ms sur une ligne d\'évacuation.', en: 'Transient stability retention following 100 ms three-phase bolted fault on the primary evacuation corridor.' },
      { fr: 'Tenue aux creux de tension (FRT) sans décrochage pour une tension résiduelle de 0% pendant 150 ms.', en: 'Low-Voltage Fault Ride-Through (LVFRT) capability down to 0% residual voltage for 150 ms.' },
    ],
    failureModes: [
      { fr: 'Perte de synchronisme (décrochage rotorique) suite à une élimination tardive d\'un défaut externe.', en: 'Out-of-step pole slipping following delayed grid protection fault clearing, inducing severe mechanical torque.' },
      { fr: 'Oscillations électromécaniques inter-zones mal amorties provoquant l\'écroulement du réseau interconnecté.', en: 'Undamped low-frequency inter-area power oscillations (0.2 - 0.8 Hz) leading to systemic grid collapse.' },
    ],
    protectionMeasures: [
      { fr: 'Relais de perte de synchronisme ANSI 78 séparant le groupe avant tout dommage mécanique sur l\'arbre.', en: 'Out-of-step tripping relay (ANSI 78) separating the unit at the first slip cycle to prevent shaft fatigue.' },
      { fr: 'Stabilisateurs de puissance PSS optimisés délivrant un couple amortisseur électrique en phase avec la vitesse.', en: 'Dual-input PSS2B producing positive damping torque in phase with rotor speed deviations.' },
    ],
    standards: ['IEEE 421.5', 'IEEE 2800', 'IEC 61850-90-5'],
  },
];
