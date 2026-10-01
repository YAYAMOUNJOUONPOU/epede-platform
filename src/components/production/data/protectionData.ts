// src/components/production/data/protectionData.ts
import type { ProtectionFunctionDetail } from '../types';

export const GENERATOR_PROTECTION_MATRIX: ProtectionFunctionDetail[] = [
  {
    ansiCode: '87G',
    nameFr: 'Protection Différentielle Générateur',
    nameEn: 'Generator Differential Protection',
    whatItProtects: 'Les trois enroulements statoriques de l\'alternateur contre les courts-circuits internes entre phases ou triphasés.',
    abnormalCondition: 'Différence vectorielle non nulle entre le courant entrant par le neutre et le courant sortant par les bornes principales (I_in - I_out ≠ 0).',
    detectionMethod: 'Comparaison des courants mesurés par deux jeux de transformateurs de courant (TC) tores de même rapport et classe 5P20, avec seuil de stabilisation pourcentage réglable (courbe à pente double pour immunité contre la saturation des TC).',
    actionOccurs: 'Déclenchement instantané (t < 25 ms) non temporisé (Order 1 Trip) : ouverture du disjoncteur groupe (GCB), désexcitation ultra-rapide par ouverture du disjoncteur de champ, fermeture d\'urgence turbine et alarme verrouillante (86G Lockout).',
    equipmentAffected: 'Alternateur, disjoncteur GCB, régulateur AVR, vannage turbine.',
    standard: 'CEI 60255-187-1 / IEEE C37.102'
  },
  {
    ansiCode: '64S / 59N',
    nameFr: 'Protection Terre Statorique 100%',
    nameEn: '100% Stator Ground Fault Protection',
    whatItProtects: 'L\'isolement diélectrique des barres Roebel statoriques contre les défauts d\'isolement monophasés à la terre sur toute la longueur du bobinage (de 0% à 100% y compris le point neutre).',
    abnormalCondition: 'Perte d\'isolement phase-masse, tension homopolaire résiduelle excessive ou altération de la 3ème harmonique résiduelle au neutre.',
    detectionMethod: 'Combinaison d\'une mesure de surtension homopolaire 59N (95% des spires) et d\'une injection sous-harmonique (20 Hz) ou surveillance de la 3ème harmonique résiduelle (0% à 20% côté neutre).',
    actionOccurs: 'Alarme temporisée si courant très faible ou déclenchement groupe immédiat avec désexcitation rapide avant que le défaut monophasé n\'évolue en court-circuit biphasé destructeur pour le fer statorique.',
    equipmentAffected: 'Tôles magnétiques statoriques, résistance de neutre, disjoncteur GCB.',
    standard: 'CEI 60255-151 / IEEE C37.102'
  },
  {
    ansiCode: '64R',
    nameFr: 'Protection Défaut Terre Rotorique',
    nameEn: 'Rotor Earth Fault Protection',
    whatItProtects: 'Le circuit d\'excitation continu tournant (enroulements des pôles du rotor) contre la mise à la masse accidentelle.',
    abnormalCondition: 'Baisse d\'isolement électrique entre le bobinage rotorique en cuivre et la masse mécanique de la roue polaire.',
    detectionMethod: 'Injection d\'une tension continue ou alternative basse fréquence (15 Hz) entre une bague collectrice du rotor et l\'arbre mis à la terre, mesurant la résistance de fuite R_iso.',
    actionOccurs: 'Premier défaut : alarme de surveillance pour permettre un arrêt programmé. Deuxième défaut (qui court-circuiterait des pôles et créerait un balourd magnétique destructeur) : déclenchement immédiat du groupe.',
    equipmentAffected: 'Pôles rotoriques, pont de thyristors d\'excitation, arbre mécanique.',
    standard: 'IEEE C37.102 / CEI 60255-127'
  },
  {
    ansiCode: '51V',
    nameFr: 'Protection Surintensité à Retenue de Tension',
    nameEn: 'Voltage-Controlled / Restrained Overcurrent',
    whatItProtects: 'L\'alternateur contre les courts-circuits externes prolongés non éliminés par les protections aval du réseau ou du transformateur.',
    abnormalCondition: 'Courant statorique dépassant le courant nominal alors que la tension aux bornes de l\'alternateur s\'effondre (indiquant un court-circuit franc sur le réseau).',
    detectionMethod: 'Le seuil de déclenchement du relais à temps inverse diminue automatiquement au fur et à mesure que la tension mesurée par les transformateurs de tension baisse.',
    actionOccurs: 'Déclenchement du disjoncteur de groupe GCB après une temporisation sélective (ex: 0.8 à 1.5 s) pour laisser les protections de réseau réagir en premier.',
    equipmentAffected: 'Alternateur, disjoncteur GCB, réseau interconnecté.',
    standard: 'CEI 60255-151'
  },
  {
    ansiCode: '59',
    nameFr: 'Protection Surtension Statorique',
    nameEn: 'Overvoltage Protection',
    whatItProtects: 'L\'isolation diélectrique des enroulements statoriques contre les surtensions destructrices.',
    abnormalCondition: 'Tension efficace entre phases excédant 110% à 120% de la tension nominale (U > 16.5 kV à 18 kV pour une machine de 15 kV), généralement suite à un délestage brutal ou emballement de l\'AVR.',
    detectionMethod: 'Mesure permanente de la tension efficace via trois transformateurs de tension inductifs.',
    actionOccurs: 'Étage 1 (110%, t = 2 s) : forçage de consigne AVR et alarme. Étage 2 (125%, instantané t = 100 ms) : déclenchement groupe et désexcitation rapide.',
    equipmentAffected: 'Isolants statoriques, traversées 15 kV, parafoudres.',
    standard: 'CEI 60255-127'
  },
  {
    ansiCode: '27',
    nameFr: 'Protection Baisse de Tension',
    nameEn: 'Undervoltage Protection',
    whatItProtects: 'Les auxiliaires moteurs de la centrale et la stabilité électromagnétique du groupe contre un écroulement prolongé de tension.',
    abnormalCondition: 'Tension aux bornes inférieure à 80% de la tension nominale (U < 12 kV) pendant plus de 2 secondes.',
    detectionMethod: 'Mesure de tension triphasée directe avec filtrage anti-harmonique.',
    actionOccurs: 'Alarme préventive et découplage du groupe si la chute compromet la stabilité des moteurs de réfrigération.',
    equipmentAffected: 'Services auxiliaires de centrale, alternateur.',
    standard: 'CEI 60255-127'
  },
  {
    ansiCode: '81O / 81U',
    nameFr: 'Protection Surfréquence / Sous-Fréquence',
    nameEn: 'Over / Under Frequency Protection',
    whatItProtects: 'L\'intégrité aéro-mécanique de la turbine (emballement/survitesse) et les résonances vibratoires des aubes contre les écarts de vitesse du réseau.',
    abnormalCondition: 'Fréquence du réseau dérivant hors de la plage admissible de 50 Hz (ex: f > 52.5 Hz ou f < 47.5 Hz).',
    detectionMethod: 'Algorithme de mesure numérique de fréquence haute précision (résolution 0.005 Hz) calculé sur les passages par zéro de la tension.',
    actionOccurs: 'Plusieurs échelons temporisés : en surfréquence extrême (> 53 Hz), fermeture d\'urgence turbine pour éviter l\'emballement ; en sous-fréquence (< 48 Hz), alarme de délestage de charges réseau puis déclenchement de sauvegarde.',
    equipmentAffected: 'Roue de turbine, rotor alternateur, transformateur GSU.',
    standard: 'CEI 60255-181'
  },
  {
    ansiCode: '32R',
    nameFr: 'Protection Puissance Inverse (Motorisation)',
    nameEn: 'Reverse Power / Anti-Motoring Protection',
    whatItProtects: 'La turbine hydraulique contre le fonctionnement en moteur synchrone lorsque l\'alimentation en eau est coupée.',
    abnormalCondition: 'Flux de puissance active inversé (P < 0) : l\'alternateur absorbe de l\'énergie du réseau pour continuer à entraîner la turbine à 125 tr/min.',
    detectionMethod: 'Calcul vectoriel P = √3 · U · I · cos φ ; détection d\'une absorption active de 0.5% à 2% de P_nom.',
    actionOccurs: 'Temporisation de 5 à 15 secondes (pour éviter les déclenchements intempestifs lors de transitoires de synchronisation) puis ouverture du disjoncteur GCB pour éviter la surchauffe et la cavitation destructive des pales non immergées.',
    equipmentAffected: 'Aubes de turbine, directrices, réducteur.',
    standard: 'CEI 60255-1'
  },
  {
    ansiCode: '40',
    nameFr: 'Protection Perte d\'Excitation (Perte de Champ)',
    nameEn: 'Loss of Field / Loss of Excitation',
    whatItProtects: 'L\'alternateur et le réseau contre le fonctionnement asynchrone hors de contrôle.',
    abnormalCondition: 'Coupure accidentelle du courant d\'excitation continu rotorique (défaillance AVR ou pont de thyristors). L\'alternateur décroche et absorbe une quantité massive de puissance réactive du réseau.',
    detectionMethod: 'Mesure de l\'impédance vue depuis les bornes du stator dans le plan complexe R-X (caractéristique circulaire décalée de mho dans le 4ème quadrant).',
    actionOccurs: 'Déclenchement du disjoncteur GCB après 0.5 à 1.5 s pour empêcher l\'échauffement destructeur de la jante rotorique par courants de Foucault et éviter l\'effondrement de tension du réseau local.',
    equipmentAffected: 'Pôles rotoriques, amortisseurs, stabilité du réseau THT.',
    standard: 'IEEE C37.102'
  },
  {
    ansiCode: '46',
    nameFr: 'Protection Courant Inverse (Déséquilibre)',
    nameEn: 'Negative Sequence Overcurrent',
    whatItProtects: 'Le rotor de l\'alternateur contre la surchauffe superficielle provoquée par les charges asymétriques ou coupures d\'une phase du réseau.',
    abnormalCondition: 'Présence d\'une composante inverse de courant I2 (déséquilibre triphasé I_a ≠ I_b ≠ I_c).',
    detectionMethod: 'Filtrage par décomposition en composantes symétriques de Fortescue : calcul de I2 et intégration de l\'échauffement selon la loi I2² · t = constante.',
    actionOccurs: 'Alarme à I2 > 5% ; déclenchement du groupe avec temporisation inverse avant dépassement de la limite thermique du rotor (I2² · t > 10 s pour machine à pôles saillants).',
    equipmentAffected: 'Paliers, jante rotorique, frettes de pôles.',
    standard: 'CEI 60255-149 / IEEE C37.102'
  },
  {
    ansiCode: '24',
    nameFr: 'Protection Surfluxage (Volt / Hertz)',
    nameEn: 'Overexcitation / Volts-Per-Hertz (V/Hz)',
    whatItProtects: 'Les circuits magnétiques de l\'alternateur et du transformateur élévateur contre la saturation ferromagnétique.',
    abnormalCondition: 'Rapport V / f dépassant 1.1 à 1.2 pu (par exemple tension élevée à basse vitesse lors des phases de démarrage ou d\'arrêt).',
    detectionMethod: 'Calcul permanent du quotient U_mesurée / f_mesurée.',
    actionOccurs: 'Déclenchement rapide sur courbe temps inverse pour éviter l\'échauffement extrême des tirants de cuve et des tôles magnétiques par flux de fuite.',
    equipmentAffected: 'Tôles magnétiques statoriques, transformateur GSU.',
    standard: 'CEI 60255-127'
  },
  {
    ansiCode: '49',
    nameFr: 'Protection Thermique Stator & Rotor',
    nameEn: 'Thermal Overload Protection',
    whatItProtects: 'L\'isolation des barres Roebel contre le vieillissement accéléré dû à une surcharge prolongée.',
    abnormalCondition: 'Température mesurée ou calculée excédant la limite thermique de classe d\'isolation (Classe F / échauffement B : T > 130°C).',
    detectionMethod: 'Mesure directe par sondes PT100 réparties dans les encoches statoriques et modèle thermique mathématique à constante de temps.',
    actionOccurs: 'Alarme à 115°C pour demande de réduction de charge au Dispatching ; déclenchement groupe à 130°C.',
    equipmentAffected: 'Isolation diélectrique résine époxy, cales d\'encoches.',
    standard: 'CEI 60255-149'
  },
  {
    ansiCode: '12',
    nameFr: 'Protection Survitesse Mécanique',
    nameEn: 'Overspeed Protection',
    whatItProtects: 'L\'intégrité physique de la roue de turbine et des pièces polaires du rotor contre l\'éclatement par force centrifuge.',
    abnormalCondition: 'Vitesse de rotation dépassant 115% de la vitesse nominale (n > 144 tr/min pour n_nom = 125 tr/min).',
    detectionMethod: 'Système redondant à double roue phonique opto-électronique et capteur inductif sur arbre, doublé d\'un anneau mécanique centrifuge autonome.',
    actionOccurs: 'Déclenchement de sécurité mécanique prioritaire absolu : vidange des servomoteurs de directrices, fermeture rapide par contrepoids et déclenchement de la vanne papillon MIV.',
    equipmentAffected: 'Ligne d\'arbre complète, roue Francis, rotor.',
    standard: 'CEI 60041 / CEI 61362'
  },
  {
    ansiCode: '25',
    nameFr: 'Contrôleur de Synchronisme (Synchrocheck)',
    nameEn: 'Synchronism Check / Auto-Synchronizer',
    whatItProtects: 'L\'alternateur, l\'arbre et le réseau contre les à-coups de couple destructeurs lors du couplage.',
    abnormalCondition: 'Tentative de fermeture du disjoncteur groupe (GCB) alors que la tension, la fréquence ou l\'angle de phase ne sont pas parfaitement alignés entre l\'alternateur et le réseau.',
    detectionMethod: 'Mesure différentielle permanente de tension (ΔU < 2%), de fréquence (Δf < 0.1 Hz) et d\'angle de phase (Δδ < 5°) avec prédiction du temps de fermeture mécanique du disjoncteur.',
    actionOccurs: 'Autorisation de fermeture délivrée à l\'instant exact où l\'angle atteint zéro (fermeture sans choc de courant ni contrainte mécanique).',
    equipmentAffected: 'Disjoncteur GCB, accouplement d\'arbre, bobinage stator.',
    standard: 'IEEE C37.90'
  },
  {
    ansiCode: '50BF',
    nameFr: 'Protection Défaillance Disjoncteur (Breaker Failure)',
    nameEn: 'Circuit Breaker Failure Protection',
    whatItProtects: 'L\'ensemble de l\'installation si le disjoncteur de groupe refuse de s\'ouvrir après un ordre de déclenchement sur défaut.',
    abnormalCondition: 'Persistance d\'un courant de défaut après émission d\'un ordre d\'ouverture au disjoncteur GCB.',
    detectionMethod: 'Temporisation numérique (t_BF = 120 à 180 ms) déclenchée par l\'ordre d\'ouverture et réinitialisée par la retombée du courant sous le seuil de repos.',
    actionOccurs: 'Émission d\'un ordre de déclenchement étendu à tous les disjoncteurs voisins (disjoncteurs amont du poste 225 kV et désexcitation générale) pour éliminer le défaut.',
    equipmentAffected: 'Disjoncteurs du poste 225 kV, transformateur GSU.',
    standard: 'IEEE C37.119 / CEI 60255'
  }
];
