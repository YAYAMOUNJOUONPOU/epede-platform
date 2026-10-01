export type StandardIssuer = 'IEC' | 'IEEE' | 'ISO' | 'NFPA' | 'CIGRE' | 'ICOLD' | 'ASCE' | 'DIN';
export type StandardCategory = 'hydraulic' | 'electrical' | 'mechanical' | 'control' | 'civil' | 'safety' | 'monitoring';

export interface HydroStandardRequirement {
  clause?: string;
  fr: string;
  en: string;
}

export interface StandardToleranceLimit {
  parameter: string;
  limit: string;
  unit?: string;
  standardReference: string;
}

export interface HydroStandardItem {
  reference: string;
  issuer: StandardIssuer;
  category: StandardCategory;
  year: number;
  title: { fr: string; en: string };
  scope: { fr: string; en: string };
  lifecycleStages: string[];
  keyRequirements: HydroStandardRequirement[];
  acceptanceCriteria?: { fr: string; en: string };
  tolerancesAndLimits?: StandardToleranceLimit[];
  applicableSubsystems: string[];
  cameroonApplication: { fr: string; en: string };
}

export const HYDRO_STANDARDS_CATALOGUE: HydroStandardItem[] = [
  {
    reference: 'IEC 60041',
    issuer: 'IEC',
    category: 'hydraulic',
    year: 1991,
    title: {
      fr: 'Essais de réception sur place des turbines hydrauliques, pompes d\'accumulation et pompes-turbines',
      en: 'Field acceptance tests to determine the hydraulic performance of hydraulic turbines, storage pumps and pump-turbines',
    },
    scope: {
      fr: 'Définit les méthodes physiques et protocoles métrologiques normalisés pour mesurer avec précision le débit volumique Q, la chute nette Hn et la puissance sur arbre P afin de déterminer le rendement hydraulique absolu des turbines sur site.',
      en: 'Governs precision metrological methods for measuring discharge Q, net head Hn, and mechanical shaft power P to establish absolute prototype hydraulic efficiency under commercial site conditions.',
    },
    lifecycleStages: ['Commissioning', 'Acceptance Testing', 'Performance Guarantee', 'Refurbishment'],
    keyRequirements: [
      {
        clause: '§9 - Débit',
        fr: 'Mesure du débit par méthode temps de transit acoustique multipente (au moins 4 à 8 cordes de Gauss) ou moulinets hydrométriques avec incertitude globale inférieure à ±1.2%.',
        en: 'Discharge measurement via multi-path acoustic transit time (4-8 Gauss chords) or calibrated current meters with combined expanded uncertainty < ±1.2%.',
      },
      {
        clause: '§8 - Chute Nette',
        fr: 'Calcul rigoureux de la chute nette tenant compte de la pression statique différentielle, de l\'énergie cinétique d\'approche (v1²/2g) et de l\'énergie résiduelle au diffuseur (v2²/2g).',
        en: 'Rigorous net head calculation factoring differential static piezometric head, inlet kinetic head (v1²/2g), and draft tube exit kinetic residual head (v2²/2g).',
      },
      {
        clause: '§11 - Puissance',
        fr: 'Mesure de la puissance mécanique sur l\'arbre par couplemètre à jauges étalonné ou par la méthode du bilan des pertes du générateur selon la CEI 60034-2.',
        en: 'Mechanical shaft power measurement via calibrated telemetry torque meter or generator loss summation method per IEC 60034-2.',
      },
      {
        clause: '§14 - Thermodynamique',
        fr: 'Pour les chutes H > 100 m, utilisation autorisée de la méthode thermodynamique basée sur l\'échauffement micro-calorimétrique de l\'eau (ΔT en mK).',
        en: 'For heads H > 100 m, authorized thermodynamic enthalpy differential method based on micro-calorimetric water temperature rise (ΔT in mK).',
      },
    ],
    acceptanceCriteria: {
      fr: 'Le rendement garanti η_garanti est réputé satisfait si le rendement mesuré η_mesuré est supérieur ou égal à (η_garanti - f_incertitude), où f_incertitude est l\'incertitude métrologique globale de la mesure.',
      en: 'Contractual efficiency guarantee is fulfilled if measured efficiency η_meas >= (η_guar - f_uncert), where f_uncert is the total expanded measurement uncertainty.',
    },
    tolerancesAndLimits: [
      { parameter: 'Incertitude débit acoustique multipente', limit: '±1.0% à ±1.5%', standardReference: 'IEC 60041 §9.1' },
      { parameter: 'Incertitude méthode moulinets', limit: '±1.2% à ±1.8%', standardReference: 'IEC 60041 §9.2' },
      { parameter: 'Incertitude méthode thermodynamique (H > 100m)', limit: '±1.0% à ±1.5%', standardReference: 'IEC 60041 §14' },
      { parameter: 'Incertitude mesure chute nette', limit: '±0.5% à ±0.8%', standardReference: 'IEC 60041 §8' },
    ],
    applicableSubsystems: ['H05', 'H07', 'H08', 'H11', 'H27'],
    cameroonApplication: {
      fr: 'Utilisé lors de la réception contractuelle des 7 groupes de 60 MW de Nachtigal Amont (2023-2025) et pour la requalification du rendement des turbines Francis de Songloulou après réhabilitation.',
      en: 'Primary reference standard for commercial commissioning and contractual guarantee verification of Nachtigal 7x 60 MW units (2023-2025) and post-rehab re-rating at Songloulou.',
    },
  },
  {
    reference: 'IEC 60193',
    issuer: 'IEC',
    category: 'hydraulic',
    year: 2019,
    title: {
      fr: 'Turbines hydrauliques, pompes d\'accumulation et pompes-turbines - Essais de réception sur modèle',
      en: 'Hydraulic turbines, storage pumps and pump-turbines - Model acceptance tests',
    },
    scope: {
      fr: 'Règles normatives des essais de similitude hydrodynamique sur modèle réduit en plateforme d\'essais accréditée pour prédire le rendement prototype, la cavitation et la stabilité pulsatoire.',
      en: 'Laboratory scale-model test regulations verifying hydraulic similarity laws, efficiency step-up conversions, cavitation inception sigma, and pressure pulsation signatures.',
    },
    lifecycleStages: ['Design', 'Acceptance Testing', 'Procurement'],
    keyRequirements: [
      {
        clause: '§5 - Similitude',
        fr: 'Respect strict des nombres sans dimension de Froude et de Thoma (sigma). Diamètre minimal de la roue modèle D_M >= 250 mm et nombre de Reynolds Re_M >= 2.0 x 10^6.',
        en: 'Strict adherence to Froude and Thoma (sigma) scaling. Minimum scale model runner diameter D_M >= 250 mm and test Reynolds number Re_M >= 2.0 x 10^6.',
      },
      {
        clause: '§7 - Step-Up Rendement',
        fr: 'Formule de majoration d\'effet d\'échelle de rendement (Step-Up) selon la formulation normalisée CEI pour l\'effet Reynolds sur les pertes par frottement visqueux superficiel.',
        en: 'Prescribed scale-effect step-up formulation factoring Reynolds number boundary-layer skin friction differences between model and prototype.',
      },
      {
        clause: '§8 - Cavitation & Torche',
        fr: 'Essais de cavitation stroboscopique en circuit fermé sous dépression variable, cartographie des pulsations de pression dans le diffuseur à charge partielle (vortex rope).',
        en: 'Stroboscopic cavitation visualization under regulated depression, draft tube pressure pulsation frequency spectrum mapping under partial load regime (vortex rope).',
      },
    ],
    acceptanceCriteria: {
      fr: 'Rendement prototype prédit η_P = η_M + Δη_stepup avec formule CEI 60193. Marge de cavitation minimale σ_installation >= 1.20 x σ_critique pour éviter toute érosion sur la roue prototype.',
      en: 'Prototype predicted efficiency η_P = η_M + Δη_stepup via IEC 60193 formula. Minimum cavitation safety margin σ_plant >= 1.20 x σ_crit to preclude prototype runner pitting.',
    },
    tolerancesAndLimits: [
      { parameter: 'Diamètre minimum roue modèle', limit: '>= 250', unit: 'mm', standardReference: 'IEC 60193 §5.2' },
      { parameter: 'Nombre Reynolds minimal modèle', limit: '>= 2.0 x 10^6', standardReference: 'IEC 60193 §5.3' },
      { parameter: 'Incertitude plateforme d\'essais modèle', limit: '<= ±0.25%', standardReference: 'IEC 60193 §3.4' },
    ],
    applicableSubsystems: ['H07', 'H08', 'H27'],
    cameroonApplication: {
      fr: 'Imposé dans les cahiers des charges de préqualification des fabricants de turbines pour Nachtigal (concepteur GE Hydro) et Lom Pangar (Andritz Hydro).',
      en: 'Mandatory contractual requirement in competitive turbine tendering for Nachtigal (GE Hydro test rig in Grenoble) and Lom Pangar (Andritz Hydro).',
    },
  },
  {
    reference: 'IEC 62270',
    issuer: 'IEC',
    category: 'control',
    year: 2013,
    title: {
      fr: 'Centrales hydroélectriques - Guide pour le contrôle assisté par ordinateur',
      en: 'Hydroelectric power plants - Computer-based control',
    },
    scope: {
      fr: 'Lignes directrices d\'architecture pour les automates programmables industriels (API/PLC), les systèmes de contrôle réparti (DCS/SCADA), l\'automatisation de séquence groupe et le démarrage autonome (Black Start).',
      en: 'Architecture, safety interlock requirements, redundancy topologies, and black-start coordination algorithms for computer-based hydro automation and DCS systems.',
    },
    lifecycleStages: ['Design', 'Commissioning', 'Operation', 'O&M', 'Cybersecurity'],
    keyRequirements: [
      {
        clause: '§4 - Redondance Automates',
        fr: 'Automates de tranche groupe redondants sans point unique de défaillance (1-out-of-2 hot standby) avec basculement bumpless en moins de 10 ms pour la régulation et les séquences.',
        en: 'Dual-redundant 1-out-of-2 hot standby programmable controllers with bumpless switchover < 10 ms for turbine sequencing and governor interface.',
      },
      {
        clause: '§6 - Ligne de Sécurité Câblée',
        fr: 'Liaisons d\'arrêt d\'urgence et de déclenchement mécanique/électrique impérativement câblées en fil-à-fil (Hardwired fail-safe) indépendantes des réseaux de communication Ethernet.',
        en: 'Emergency tripping and safety shutdown circuits must be dedicated hardwired fail-safe loops, physically independent of software fieldbuses or Ethernet links.',
      },
      {
        clause: '§8 - Black-Start & Séquences',
        fr: 'Coordination logicielle automatique des étapes de démarrage autonome en réseau séparé : alimentation auxiliaires diesels, ouverture vanne de tête, amorçage excitation et fermeture disjoncteur.',
        en: 'Automated logical sequencing for islanded black-start restart: diesel gen backup, penstock valve opening, field flashing, AVR ramp-up, and island breaker closing.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Temps de cycle de l\'automate de régulation <= 20 ms. Disponibilité annuelle prouvée du système de contrôle-commande >= 99.98%.',
      en: 'PLC closed-loop control scan time <= 20 ms. Proven annual system availability >= 99.98%.',
    },
    tolerancesAndLimits: [
      { parameter: 'Temps de basculement CPU redondant', limit: '<= 10', unit: 'ms', standardReference: 'IEC 62270 §4.3' },
      { parameter: 'Précision horodatage des événements SOE', limit: '<= 1.0', unit: 'ms', standardReference: 'IEC 62270 §5.1' },
      { parameter: 'Disponibilité architecturale DCS', limit: '>= 99.98%', standardReference: 'IEC 62270 §4.1' },
    ],
    applicableSubsystems: ['H17', 'H18', 'H25'],
    cameroonApplication: {
      fr: 'Architecture moderne déployée au Dispatching National de Sonatrel (Mangombé) et au poste centralisé de conduite de Nachtigal et Songloulou.',
      en: 'Architectural backbone for Sonatrel National Grid Dispatch Center (Mangombé) and digital SCADA DCS at Nachtigal and Songloulou.',
    },
  },
  {
    reference: 'IEEE C37.102',
    issuer: 'IEEE',
    category: 'electrical',
    year: 2006,
    title: {
      fr: 'Guide IEEE pour la protection des alternateurs synchrones à courant alternatif',
      en: 'IEEE Guide for AC Generator Protection',
    },
    scope: {
      fr: 'Recommandations pour la configuration, le calage et la sélectivité des relais de protection numériques dédiés aux alternateurs hydroélectriques à pôles saillants et transformateurs associés.',
      en: 'Comprehensive guidance on relaying philosophies, protective setting calculations, and coordination for salient-pole hydro generators.',
    },
    lifecycleStages: ['Design', 'Commissioning', 'Operation', 'Grid Connection'],
    keyRequirements: [
      {
        clause: '§4.1 - ANSI 87G',
        fr: 'Protection différentielle de stator ANSI 87G avec retenue de pourcentage (Slope 1: 15-20%, Slope 2: 50-80%) et détection instantanée de défauts entre phases en moins de 20 ms.',
        en: 'Dual-slope percentage biased differential stator protection (ANSI 87G) providing instantaneous phase-to-phase internal fault clearance < 20 ms.',
      },
      {
        clause: '§4.3 - ANSI 64S',
        fr: 'Protection terre stator 100% (ANSI 64S) par injection de sous-fréquence 20 Hz ou surveillance du ratio de 3e harmonique au point neutre pour couvrir les derniers 5% près du neutre.',
        en: '100% stator ground fault protection (ANSI 64S) utilizing 20 Hz sub-harmonic voltage injection or neutral third-harmonic ratio schemes covering 0-100% of winding.',
      },
      {
        clause: '§4.5 - ANSI 40',
        fr: 'Protection contre la perte d\'excitation ANSI 40 basée sur deux zones d\'impédance mho à décalage négatif (-Xd\'/2, -Xd) dans le plan R-X pour éviter l\'échauffement rotorique.',
        en: 'Loss-of-field protection (ANSI 40) utilizing dual offset mho impedance zones (-Xd\'/2, -Xd) in the complex R-X plane to prevent rotor end-core thermal destruction.',
      },
      {
        clause: '§4.8 - ANSI 32R',
        fr: 'Protection de retour de puissance active (ANSI 32R) calée à 0.5 - 2.0% de P_nom pour protéger la turbine contre la marche en moteur synchrone lors de la fermeture des directrices.',
        en: 'Reverse power relay (ANSI 32R) calibrated to 0.5 - 2.0% P_nom to protect turbine runner against motoring cavitation and draft tube depression.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Élimination totale des défauts statoriques internes en moins de 60 ms (relais + disjoncteur groupe GCB). Aucun déclenchement intempestif sur court-circuit externe évacué par le réseau.',
      en: 'Complete isolation of internal stator faults < 60 ms (relay + GCB opening). Zero nuisance trip on external grid through-faults.',
    },
    tolerancesAndLimits: [
      { parameter: 'Sensibilité protection 87G', limit: '0.15 - 0.20 x In', standardReference: 'IEEE C37.102 §4.1' },
      { parameter: 'Temporisation retour puissance 32R', limit: '2.0 - 5.0', unit: 's', standardReference: 'IEEE C37.102 §4.8' },
      { parameter: 'Zone 1 Perte d\'excitation (ANSI 40)', limit: 'Offset = -Xd\'/2, Dia = Xd', standardReference: 'IEEE C37.102 §4.5' },
    ],
    applicableSubsystems: ['H09', 'H10', 'H18', 'H20'],
    cameroonApplication: {
      fr: 'Calage des relais numériques multifonctions (SIPROTEC 5 / MICOM) des groupes de Songloulou (48 MW) et de Nachtigal (60 MW) raccordés au RIS 225 kV.',
      en: 'Numerical relay setting criteria (SIPROTEC 5 / MICOM) on Songloulou 48 MW units and Nachtigal 60 MW units injecting into the 225 kV Southern Grid.',
    },
  },
  {
    reference: 'IEEE 421.5',
    issuer: 'IEEE',
    category: 'control',
    year: 2016,
    title: {
      fr: 'Pratique recommandée IEEE pour les modèles de systèmes d\'excitation pour les études de stabilité',
      en: 'IEEE Recommended Practice for Excitation System Models for Power System Stability Studies',
    },
    scope: {
      fr: 'Modélisation mathématique standardisée des systèmes d\'excitation statiques (ST) et sans balais (AC), des régulateurs automatiques de tension (AVR) et des stabilisateurs de réseau de puissance (PSS).',
      en: 'Standardized computer block diagrams and parameters for static and rotating excitation systems, AVR controllers, and PSS stabilizing algorithms.',
    },
    lifecycleStages: ['Design', 'Grid Code', 'Commissioning', 'Operation'],
    keyRequirements: [
      {
        clause: '§7 - Modèle ST1A / ST4B',
        fr: 'Modélisation rigoureuse de la chaîne d\'excitation statique à thyristors avec prise en compte de la chute de tension commutatoire (effet d\'inductance source).',
        en: 'Rigorous block diagram modeling of potential-source static thyristor exciter, factoring commutating voltage drop during severe voltage sags.',
      },
      {
        clause: '§8 - Stabilisateur PSS2B',
        fr: 'Implémentation d\'un stabilisateur de puissance multi-entrées PSS2B (puissance active Pe et vitesse rotorique ω) avec filtres passe-haut et étages d\'avance de phase accordés sur 0.2 - 2.0 Hz.',
        en: 'Implementation of dual-input PSS2B (electrical power Pe and shaft speed ω) with washout filters and tuned lead-lag stages to damp 0.2 - 2.0 Hz inter-area swings.',
      },
      {
        clause: '§11 - Plafond de Tension',
        fr: 'Rapport de plafond de tension d\'excitation (Ceiling Voltage) d\'au moins 2.0 p.u. sous tension nominale pour assurer le maintien de la stabilité transitoire lors des défauts réseau.',
        en: 'Exciter ceiling voltage ratio >= 2.0 p.u. under rated conditions, ensuring rapid field forcing during adjacent transmission grid line faults.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Amortissement des oscillations électromécaniques avec coefficient d\'amortissement modal ζ >= 15% après perturbation réseau.',
      en: 'Inter-area electromechanical oscillatory mode damping ratio ζ >= 15% following transmission fault clearance.',
    },
    tolerancesAndLimits: [
      { parameter: 'Plafond de tension d\'excitation (Ceiling)', limit: '>= 2.0 p.u.', standardReference: 'IEEE 421.5 §11' },
      { parameter: 'Bande passante d\'amortissement PSS', limit: '0.2 à 2.5', unit: 'Hz', standardReference: 'IEEE 421.5 §8' },
      { parameter: 'Temps de réponse AVR (échelon 5%)', limit: '<= 50', unit: 'ms', standardReference: 'IEEE 421.5 §7' },
    ],
    applicableSubsystems: ['H10', 'H18', 'H31'],
    cameroonApplication: {
      fr: 'Indispensable pour l\'accord des PSS à Songloulou et Nachtigal afin d\'éviter les oscillations de puissance entre les zones de consommation de Douala et Yaoundé.',
      en: 'Vital for PSS tuning at Songloulou and Nachtigal to suppress power oscillations between Douala industrial load center and Yaoundé administrative hub.',
    },
  },
  {
    reference: 'ISO 20816-5',
    issuer: 'ISO',
    category: 'mechanical',
    year: 2018,
    title: {
      fr: 'Vibrations mécaniques - Mesurage sur les parties non tournantes des groupes hydroélectriques',
      en: 'Mechanical vibration - Evaluation of machine vibration by measurements on non-rotating parts - Part 5: Machine sets in hydraulic power generating and pump-storage plants',
    },
    scope: {
      fr: 'Critères d\'évaluation et seuils d\'alerte et de déclenchement d\'urgence basés sur la vitesse vibratoire efficace globale RMS (mm/s) mesurée sur les corps de paliers fixes des groupes hydrauliques.',
      en: 'Establishes vibration severity limits and alert/trip zones (A/B/C/D) based on broad-band RMS vibration velocity measured on bearing housings.',
    },
    lifecycleStages: ['Acceptance Testing', 'Commissioning', 'Operation', 'Condition Monitoring'],
    keyRequirements: [
      {
        clause: '§4 - Zones de Sévérité',
        fr: 'Zone A (machine neuve en réception : V_rms < 1.6 mm/s), Zone B (fonctionnement continu illimité : 1.6 à 2.5 mm/s), Zone C (alerte d\'exploitation : 2.5 à 4.0 mm/s), Zone D (danger/déclenchement : > 4.0 mm/s).',
        en: 'Zone A (new machine acceptance: V_rms < 1.6 mm/s), Zone B (unrestricted long-term: 1.6 to 2.5 mm/s), Zone C (alert threshold: 2.5 to 4.0 mm/s), Zone D (danger/trip: > 4.0 mm/s).',
      },
      {
        clause: '§5 - Capteurs Orthogonaux',
        fr: 'Mesures simultanées triaxiales (Radial X, Radial Y, Axial Z) au niveau du palier guide turbine inférieur (PGT), du palier guide alternateur (PGA) et de la butée axiale.',
        en: 'Orthogonal triaxial velocity monitoring (Radial X, Radial Y, Axial Z) at lower turbine guide bearing (TGB), generator guide bearing (GGB), and thrust bracket.',
      },
      {
        clause: '§6 - Régimes Particuliers',
        fr: 'Tolérances majorées autorisées en régime transitoire bref (démarrage, passage de la zone de résonance torche à 40-60% de charge, et emballement).',
        en: 'Adjusted criteria for transient operations (unit startup, crossing partial-load vortex surge zone at 40-60% P_nom, and load rejection runaway).',
      },
    ],
    acceptanceCriteria: {
      fr: 'En régime nominal stable, la vitesse vibratoire RMS ne doit pas excéder la limite de Zone B (2.5 mm/s pour les groupes Francis verticaux 100-300 tr/min).',
      en: 'In steady rated operation, RMS vibration velocity must remain strictly within Zone B limits (2.5 mm/s for Francis vertical units 100-300 RPM).',
    },
    tolerancesAndLimits: [
      { parameter: 'Limite Zone A (Machine neuve)', limit: '< 1.6', unit: 'mm/s RMS', standardReference: 'ISO 20816-5 Tab.1' },
      { parameter: 'Limite Zone B (Exploitation illimitée)', limit: '1.6 - 2.5', unit: 'mm/s RMS', standardReference: 'ISO 20816-5 Tab.1' },
      { parameter: 'Seuil Alarme Zone C', limit: '2.5 - 4.0', unit: 'mm/s RMS', standardReference: 'ISO 20816-5 Tab.1' },
      { parameter: 'Seuil Déclenchement Arrêt d\'Urgence Zone D', limit: '> 4.0', unit: 'mm/s RMS', standardReference: 'ISO 20816-5 Tab.1' },
    ],
    applicableSubsystems: ['H08', 'H09', 'H19'],
    cameroonApplication: {
      fr: 'Surveillance en continu sur le système Bently Nevada 3500 des 8 groupes de Songloulou pour prévenir l\'amplification vibratoire liée au gonflement du béton (RAG).',
      en: 'Continuous condition monitoring on Bently Nevada 3500 racks across Songloulou 8 Francis units to monitor shaft alignment impacted by ASR dam concrete growth.',
    },
  },
  {
    reference: 'NFPA 851',
    issuer: 'NFPA',
    category: 'safety',
    year: 2020,
    title: {
      fr: 'Pratique recommandée pour la protection contre l\'incendie des centrales hydroélectriques',
      en: 'Recommended Practice for Fire Protection for Hydroelectric Generating Plants',
    },
    scope: {
      fr: 'Directives de sécurité incendie applicables aux centrales hydroélectriques de surface et souterraines : transformateurs à huile, galeries de câbles, enceinte alternateur et bacs de rétention.',
      en: 'Fire prevention, extinguishing systems, oil containment bunds, and smoke egress management for surface and underground hydroelectric stations.',
    },
    lifecycleStages: ['Design', 'Safety', 'Operation', 'O&M', 'Insurance'],
    keyRequirements: [
      {
        clause: '§6.2 - Déluge Transformateur',
        fr: 'Système d\'extinction automatique par déluge d\'eau haute vitesse (10.2 L/min/m²) sur l\'ensemble de l\'enveloppe des transformateurs élévateurs GSU à huile minérale.',
        en: 'High-velocity water spray deluge system (10.2 L/min/m²) covering 100% surface area of mineral oil-filled step-up transformers (GSU).',
      },
      {
        clause: '§6.5 - Fosse de Rétention Déportée',
        fr: 'Bacs de rétention d\'huile avec caillebotis coupe-feu et fosse déportée dimensionnée pour 100% du volume d\'huile du transformateur + 10 minutes d\'eau de déluge avec séparateur hydrocarbures.',
        en: 'Oil containment basin with flame trap grating connected to remote pit sized for 100% transformer oil + 10 min deluge runoff with oil-water separator.',
      },
      {
        clause: '§7.1 - Enceinte Alternateur',
        fr: 'Système d\'extinction fixe par gaz inerte (CO2 ou Azote/Argon) ou brouillard d\'eau haute pression dans l\'enveloppe fermée de l\'alternateur asservi aux protections électriques.',
        en: 'Fixed clean-agent CO2 or high-pressure water mist extinguishing system inside closed generator housing interlocked with differential and ground fault relays.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Temps de mise en action du déluge <= 15 s après détection flamme/gaz Buchholz. Confinement absolu des rejets d\'huile sans écoulement vers le cours d\'eau aval.',
      en: 'Deluge activation delay <= 15 s upon thermal/Buchholz trip. Zero hydrocarbon discharge into the river waterway.',
    },
    tolerancesAndLimits: [
      { parameter: 'Débit d\'arrosage déluge transfo GSU', limit: '>= 10.2', unit: 'L/min/m²', standardReference: 'NFPA 851 §6.2' },
      { parameter: 'Capacité bassin rétention', limit: '100% Huile + 10 min Eau', standardReference: 'NFPA 851 §6.5' },
      { parameter: 'Résistance coupe-feu murs séparateurs', limit: '>= 2.0', unit: 'heures', standardReference: 'NFPA 851 §5.3' },
    ],
    applicableSubsystems: ['H14', 'H22'],
    cameroonApplication: {
      fr: 'Conformité stricte exigée sur les plateformes extérieures des transformateurs 11/225 kV de Nachtigal et Songloulou pour protéger la proximité immédiate de la Sanaga.',
      en: 'Strict compliance on outdoor 11/225 kV GSU transformer bays at Nachtigal and Songloulou to prevent ecological oil pollution into the Sanaga River.',
    },
  },
  {
    reference: 'IEEE 125',
    issuer: 'IEEE',
    category: 'control',
    year: 2007,
    title: {
      fr: 'Pratique recommandée IEEE pour la spécification des régulateurs de vitesse de turbines hydrauliques',
      en: 'IEEE Recommended Practice for Preparation of Equipment Specifications for Speed-Governing of Hydraulic Turbines',
    },
    scope: {
      fr: 'Spécifie les performances dynamiques, temps de fermeture rapide, statisme permanent (droop 0-10%), bande morte et réserve de régulation fréquence des régulateurs électro-hydrauliques.',
      en: 'Governs steady-state and dynamic response parameters, permanent droop (0-10%), deadband limits, and servomotor actuator oil volume sizing for hydro turbine governors.',
    },
    lifecycleStages: ['Design', 'Commissioning', 'Operation', 'Grid Support'],
    keyRequirements: [
      {
        clause: '§4.2 - Bande Morte',
        fr: 'Bande morte de fréquence globale inférieure à ±0.01 Hz (±0.02%) pour une réaction instantanée aux déséquilibres production-consommation du réseau.',
        en: 'Overall frequency deadband <= ±0.01 Hz (±0.02%) ensuring instantaneous primary response to national power imbalance.',
      },
      {
        clause: '§4.5 - Réserve d\'Énergie Oléohydraulique',
        fr: 'Accumulateur oléopneumatique à vessie d\'azote dimensionné pour au moins 3 manœuvres complètes d\'ouverture/fermeture sans reprise de motopompe en cas de black-out.',
        en: 'Nitrogen bladder oil accumulator sized to execute at least 3 full strokes (open-close-open) in the event of auxiliary power blackout.',
      },
      {
        clause: '§5.1 - Temps de Manœuvre Directrices',
        fr: 'Temps de fermeture des directrices réglé pour limiter le coup de bélier à +25% de la pression statique nominale et la survitesse à +45% en délestage complet.',
        en: 'Guide vane closing time calibrated to limit water hammer overpressure to +25% H_stat and runaway overspeed to +45% on full load rejection.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Statisme permanent réglable de 2% à 6% (nominale 4%). Temps de réponse à un échelon de consigne de fréquence <= 200 ms.',
      en: 'Adjustable permanent droop from 2% to 6% (nominal 4%). Step response delay to frequency error step <= 200 ms.',
    },
    tolerancesAndLimits: [
      { parameter: 'Bande morte de fréquence', limit: '<= 0.01', unit: 'Hz', standardReference: 'IEEE 125 §4.2' },
      { parameter: 'Plage de statisme permanent réglable', limit: '2.0 à 6.0', unit: '%', standardReference: 'IEEE 125 §4.1' },
      { parameter: 'Nombre de manœuvres sur réserve d\'huile', limit: '>= 3', unit: 'cycles', standardReference: 'IEEE 125 §4.5' },
    ],
    applicableSubsystems: ['H11', 'H18', 'H31'],
    cameroonApplication: {
      fr: 'Régulateurs électro-hydrauliques Woodward / Voith de Songloulou et Edéa assurant le réglage primaire de fréquence pour l\'ensemble du RIS camerounais.',
      en: 'Woodward / Voith digital electro-hydraulic governors at Songloulou and Edéa providing primary grid frequency stabilization across the Cameroon RIS.',
    },
  },
  {
    reference: 'IEC 60034-1',
    issuer: 'IEC',
    category: 'electrical',
    year: 2017,
    title: {
      fr: 'Machines électriques tournantes - Caractéristiques assignées et caractéristiques de fonctionnement',
      en: 'Rotating electrical machines - Part 1: Rating and performance',
    },
    scope: {
      fr: 'Norme fondamentale régissant les échauffements limites de bobinage statorique et rotorique selon la classe d\'isolation (Classe F avec échauffement Classe B), la tenue à la survitesse et les surcharges admises des alternateurs.',
      en: 'Fundamental standard specifying thermal temperature rise limits (Class F insulation utilized at Class B rise), overspeed mechanical withstand, and short-time overload capabilities of synchronous hydro generators.',
    },
    lifecycleStages: ['Design', 'Factory Acceptance Test (FAT)', 'Commissioning'],
    keyRequirements: [
      {
        clause: '§8 - Échauffement Stator',
        fr: 'Échauffement limite du bobinage statorique mesuré par sondes RTD Pt100 <= 105 K pour une température d\'air de refroidissement de 40 °C (Classe F / échauffement B).',
        en: 'Stator winding temperature rise limit via embedded RTD Pt100 <= 105 K with 40 °C cooling air temperature reference (Class F/B margin).',
      },
      {
        clause: '§9 - Survitesse Mécanique',
        fr: 'Rotor et pôles saillants dimensionnés pour résister mécaniquement à la vitesse d\'emballement maximale (Runaway Speed) pendant 2 minutes sans déformation permanente.',
        en: 'Rotor assembly and salient poles mechanically designed to safely withstand maximum turbine runaway speed for 2 minutes without plastic deformation.',
      },
      {
        clause: '§10 - Diélectrique Haute Tension',
        fr: 'Tension d\'essai diélectrique industrielle à fréquence industrielle : U_test = 2 x U_nom + 1 000 V (soit 23 kV pour un alternateur 11 kV) pendant 60 secondes.',
        en: 'Power frequency dielectric withstand test voltage: U_test = 2 x U_nom + 1,000 V (i.e. 23 kV for an 11 kV generator) applied for 60 seconds.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Aucun claquage d\'isolement lors de l\'essai diélectrique 23 kV. Résistance d\'isolement après essai R_iso >= 1 000 MΩ à 20 °C.',
      en: 'Zero breakdown during 23 kV Hi-Pot test. Post-test insulation resistance R_iso >= 1,000 MΩ normalized to 20 °C.',
    },
    tolerancesAndLimits: [
      { parameter: 'Échauffement maximal stator (RTD)', limit: '<= 105', unit: 'K', standardReference: 'IEC 60034-1 §8' },
      { parameter: 'Tenue en survitesse mécanique', limit: '1.20 x Emballement', unit: 'tr/min', standardReference: 'IEC 60034-1 §9' },
      { parameter: 'Tension essai diélectrique stator 11 kV', limit: '23.0', unit: 'kV (1 min)', standardReference: 'IEC 60034-1 §10' },
    ],
    applicableSubsystems: ['H09', 'H10', 'H20'],
    cameroonApplication: {
      fr: 'Spécification appliquée aux alternateurs Alstom / GE 11 kV de Songloulou et aux alternateurs de 60 MW de Nachtigal pour supporter le climat tropical équatorial.',
      en: 'Thermal derating and tropicalization specification applied to Alstom / GE 11 kV units at Songloulou and Nachtigal 60 MW units.',
    },
  },
  {
    reference: 'IEC 60076-1',
    issuer: 'IEC',
    category: 'electrical',
    year: 2011,
    title: {
      fr: 'Transformateurs de puissance - Généralités et tenue aux courts-circuits',
      en: 'Power transformers - Part 1: General and short-circuit withstand capabilities',
    },
    scope: {
      fr: 'Spécifie les caractéristiques assignées, tensions de court-circuit (Uk%), niveaux d\'isolement aux chocs de foudre (BIL), pertes à vide/en charge et échauffements d\'huile des transformateurs élévateurs principaux (GSU).',
      en: 'Specifies rated parameters, short-circuit impedance (Uk%), lightning impulse insulation levels (BIL), no-load/load losses, and oil temperature rise limits for main Generator Step-Up transformers.',
    },
    lifecycleStages: ['Design', 'Factory Acceptance Test (FAT)', 'Commissioning', 'O&M'],
    keyRequirements: [
      {
        clause: '§11 - Échauffement Huile & Enroulement',
        fr: 'Échauffement maximal de l\'huile supérieure <= 60 K et échauffement moyen des enroulements <= 65 K pour transformateurs immergés sous régime ONAF.',
        en: 'Top oil temperature rise limit <= 60 K and average winding rise <= 65 K for mineral oil-immersed ONAF power transformers.',
      },
      {
        clause: '§12 - Tenue au Choc de Foudre (BIL)',
        fr: 'Niveau d\'isolement de base au choc de foudre (BIL) : 1 050 kV crête pour le côté 225 kV et 75 kV crête pour le côté 11 kV.',
        en: 'Basic Lightning Impulse Insulation Level (BIL): 1,050 kV peak for the 225 kV HV terminals and 75 kV peak for 11 kV LV terminals.',
      },
      {
        clause: '§13 - Tenue Électrodynamique Court-Circuit',
        fr: 'Capacité certifiée par calcul et essai de type à résister aux efforts électrodynamiques d\'un court-circuit franc triphasé aux bornes pendant 2.0 secondes sans déplacement de spires.',
        en: 'Certified mechanical withstand capability against radial and axial electrodynamic forces under 3-phase short-circuit for 2.0 seconds without winding deformation.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Impédance de court-circuit Uk mesurée conforme à la valeur garantie à ±7.5%. Pertes totales mesurées dans la tolérance maximale de +10%.',
      en: 'Measured short-circuit impedance Uk within guaranteed value ±7.5%. Total losses within max tolerance +10%.',
    },
    tolerancesAndLimits: [
      { parameter: 'Tolérance impédance Uk%', limit: '±7.5%', standardReference: 'IEC 60076-1 §10' },
      { parameter: 'BIL côté 225 kV RIS', limit: '1 050', unit: 'kV crête', standardReference: 'IEC 60076-3 Tab.2' },
      { parameter: 'Échauffement maximal huile supérieure', limit: '<= 60', unit: 'K', standardReference: 'IEC 60076-2 §6' },
    ],
    applicableSubsystems: ['H14', 'H20'],
    cameroonApplication: {
      fr: 'Cahier des charges des transformateurs élévateurs 11/225 kV 70 MVA de Nachtigal et des unités de remplacement 100 MVA installées au poste d\'évacuation de Songloulou.',
      en: 'Specification for Nachtigal 11/225 kV 70 MVA step-up units and 100 MVA replacement transformers installed at Songloulou HV substation.',
    },
  },
  {
    reference: 'ISO 7919-5',
    issuer: 'ISO',
    category: 'mechanical',
    year: 2005,
    title: {
      fr: 'Vibrations mécaniques des machines non alternatives - Mesurage des vibrations d\'arbres tournants - Groupes hydrauliques',
      en: 'Mechanical vibration - Evaluation of machine vibration by measurements on rotating shafts - Part 5: Machine sets in hydraulic power generating and pump-storage plants',
    },
    scope: {
      fr: 'Critères de déplacement crête-à-crête relatif de l\'arbre (Sp-p en micromètres) mesuré par sondes de proximité inductives (Eddy Current Probes) par rapport au jeu diamétral du coussinet.',
      en: 'Defines shaft relative peak-to-peak displacement vibration criteria (Sp-p in micrometers) measured with eddy current proximity probes relative to bearing diametral clearance.',
    },
    lifecycleStages: ['Acceptance Testing', 'Commissioning', 'Operation', 'Predictive Maintenance'],
    keyRequirements: [
      {
        clause: '§4 - Sondes à Courants de Foucault',
        fr: 'Installation obligatoire de paires de capteurs sans contact montées à 90° sur chaque palier (X-Y) pour tracer l\'orbite de déplacement dynamique de l\'arbre.',
        en: 'Mandatory installation of orthogonal 90° non-contact proximity probe pairs (X-Y) on each guide bearing to plot dynamic shaft orbit and center-line position.',
      },
      {
        clause: '§5 - Seuil Déplacement Relatif',
        fr: 'Le déplacement vibratoire de l\'arbre Sp-p ne doit jamais excéder 75% du jeu d\'huile radial du palier sous peine de rupture de film hydrodynamique et de frottement métal-sur-métal.',
        en: 'Shaft relative displacement Sp-p must never exceed 75% of bearing radial oil clearance to prevent hydrodynamic oil-film breakdown and babbitt metal contact.',
      },
    ],
    acceptanceCriteria: {
      fr: 'En Zone A (machine neuve) : Sp-p <= 0.35 x S_jeu_coussinet. Alarme en Zone C : Sp-p > 0.60 x S_jeu_coussinet.',
      en: 'Zone A limit (new machine): Sp-p <= 0.35 x bearing clearance. Alarm Zone C: Sp-p > 0.60 x bearing clearance.',
    },
    tolerancesAndLimits: [
      { parameter: 'Déplacement maximal admissible Zone B', limit: '<= 0.50 x Jeu palier', standardReference: 'ISO 7919-5 §4' },
      { parameter: 'Déclenchement d\'urgence frottement arbre', limit: '>= 0.75 x Jeu palier', standardReference: 'ISO 7919-5 §5' },
    ],
    applicableSubsystems: ['H08', 'H09', 'H19'],
    cameroonApplication: {
      fr: 'Surveillance des orbites d\'arbres des groupes de Songloulou pour détecter les désalignements provoqués par la poussée de la réaction alcali-granulat du massif de béton.',
      en: 'Shaft orbit monitoring on Songloulou units to identify shaft tilting and misalignment caused by asymmetric ASR dam structural deflection.',
    },
  },
  {
    reference: 'CIGRE TB 642',
    issuer: 'CIGRE',
    category: 'monitoring',
    year: 2015,
    title: {
      fr: 'Guide CIGRE pour l\'analyse des gaz dissous dans l\'huile des transformateurs de puissance (DGA)',
      en: 'CIGRE Technical Brochure 642 - Transformer Dissolved Gas Analysis in Service',
    },
    scope: {
      fr: 'Méthodologie diagnostique d\'interprétation des gaz de décomposition thermique et électrique (H2, CH4, C2H6, C2H4, C2H2, CO, CO2) dissous dans l\'huile isolante des transformateurs élévateurs.',
      en: 'Diagnostic interpretation of dissolved fault gases in transformer mineral oil using Duval Triangle, Rogers ratios, and rate-of-rise criteria to detect early electrical and thermal faults.',
    },
    lifecycleStages: ['Operation', 'O&M', 'Condition Monitoring', 'Failure Investigation'],
    keyRequirements: [
      {
        clause: '§4 - Triangle de Duval',
        fr: 'Classification graphique des défauts en 6 types : décharge partielle (PD), décharge de faible énergie (D1), arc de forte énergie (D2), échauffement thermique < 300°C (T1), 300-700°C (T2), > 700°C (T3).',
        en: 'Duval Triangle 1 graphical fault classification: partial discharges (PD), low-energy discharge (D1), high-energy arc (D2), thermal faults < 300°C (T1), 300-700°C (T2), > 700°C (T3).',
      },
      {
        clause: '§5 - Détection d\'Acétylène (C2H2)',
        fr: 'Toute concentration d\'acétylène C2H2 > 2 ppm signale un amorçage électrique à haute température ou un défaut d\'arc franc nécessitant une mise hors tension d\'investigation immédiate.',
        en: 'Any acetylene C2H2 level > 2 ppm indicates high-temperature arcing or electrical flashover requiring immediate off-line investigation.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Taux d\'accroissement des gaz combustibles totaux (TDCG) <= 10 ppm/jour en service normal. Ratio CO2/CO entre 3 et 10 (vieillissement normal du papier isolant Kraft).',
      en: 'Total dissolved combustible gas (TDCG) rate of rise <= 10 ppm/day. CO2/CO ratio between 3 and 10 indicating normal Kraft paper cellulose aging.',
    },
    tolerancesAndLimits: [
      { parameter: 'Seuil critique acétylène (C2H2)', limit: '< 2.0', unit: 'ppm', standardReference: 'CIGRE TB 642 §5' },
      { parameter: 'Seuil d\'hydrogène (H2 - décharges)', limit: '< 100', unit: 'ppm', standardReference: 'CIGRE TB 642 §4' },
      { parameter: 'Tension de claquage diélectrique huile', limit: '>= 60', unit: 'kV / 2.5 mm', standardReference: 'IEC 60156' },
    ],
    applicableSubsystems: ['H14', 'H20'],
    cameroonApplication: {
      fr: 'Programme de prélèvements trimestriels d\'huile isolante sur les transformateurs élévateurs d\'Edéa, Songloulou et Lagdo pour anticiper les défaillances catastrophiques.',
      en: 'Quarterly routine oil DGA sampling on GSU transformers across Edéa, Songloulou, and Lagdo power plants to prevent sudden catastrophic fires.',
    },
  },
  {
    reference: 'DIN 19704-1',
    issuer: 'DIN',
    category: 'civil',
    year: 2014,
    title: {
      fr: 'Constructions hydrauliques en acier - Partie 1 : Principes de calcul et dimensionnement',
      en: 'Hydraulic steel structures - Part 1: Criteria for design and calculation of gates, stoplogs, and trashracks',
    },
    scope: {
      fr: 'Règles de dimensionnement mécanique, charges de calcul hydrostatiques et hydrodynamiques, et coefficients de sécurité applicables aux vannes de barrage (secteur, clapet), batardeaux et grilles de prise d\'eau.',
      en: 'Design criteria, hydrostatic/hydrodynamic load combinations, and safety factors for spillway radial gates, flap gates, emergency stoplogs, and intake trashracks.',
    },
    lifecycleStages: ['Design', 'Acceptance Testing', 'Operation', 'Dam Safety'],
    keyRequirements: [
      {
        clause: '§6 - Cas de Charge Hydraulique',
        fr: 'Dimensionnement sous cas de charge exceptionnel (crue maximale probable CMP + séisme maximal de projet SMP) avec coefficient de sécurité global >= 1.35 par rapport à la limite élastique.',
        en: 'Structural verification under extreme design load combination (Probable Maximum Flood PMF + Maximum Credible Earthquake MCE) with safety factor >= 1.35 against yield stress.',
      },
      {
        clause: '§9 - Vérins Oléohydrauliques',
        fr: 'Vérins de manœuvre des vannes de déversoir équipés d\'un clapet de parachute anti-descente brutale et de tiges traitées céramique contre la corrosion abrasive.',
        en: 'Spillway gate hydraulic cylinders equipped with pilot-operated check safety valves and ceramic-coated piston rods resisting tropical abrasive atmospheric corrosion.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Capacité certifiée d\'ouverture complète de toutes les vannes de déversoir en cas de perte de courant secteur en moins de 15 minutes sur alimentation de secours.',
      en: 'Certified capability to fully open all spillway radial gates within 15 minutes during total grid blackout on standby power.',
    },
    tolerancesAndLimits: [
      { parameter: 'Coefficient de sécurité acier sous charge normale', limit: '>= 1.50', standardReference: 'DIN 19704-1 §6' },
      { parameter: 'Flèche maximale admissible poutre batardeau', limit: '<= L / 800', standardReference: 'DIN 19704-1 §7' },
    ],
    applicableSubsystems: ['H02', 'H03', 'H04'],
    cameroonApplication: {
      fr: 'Dimensionnement des vannes de crue de 12 000 m³/s du déversoir de Songloulou et des vannes segment du barrage de retenue de Lom Pangar.',
      en: 'Structural design standard for the 12,000 m³/s spillway radial gates at Songloulou and Lom Pangar regulating dam spillway.',
    },
  },
  {
    reference: 'ASCE Manual 79',
    issuer: 'ASCE',
    category: 'civil',
    year: 2020,
    title: {
      fr: 'Conduites forcées en acier - Manuel de conception technique et calcul de coup de bélier',
      en: 'Steel Penstocks - ASCE Manual of Practice No. 79 (Second Edition)',
    },
    scope: {
      fr: 'Manuel de référence pour le dimensionnement structural des conduites forcées aériennes et souterraines en acier : contraintes admissibles, épaisseur de virole, calcul anti-flambement sous dépression et massifs d\'ancrage.',
      en: 'Comprehensive engineering manual for structural design of surface and buried steel penstocks: allowable shell stresses, buckling under vacuum, water hammer pressure allowances, and anchor block stability.',
    },
    lifecycleStages: ['Design', 'Acceptance Testing', 'Commissioning', 'Refurbishment'],
    keyRequirements: [
      {
        clause: '§4 - Formule de Virole',
        fr: 'Calcul de l\'épaisseur de paroi de la virole selon la formule membrane : t = (P_des x D) / (2 x S x E) + c_corrosion, où P_des intègre la surpression de coup de bélier Allievi.',
        en: 'Shell plate thickness formula via hoop stress: t = (P_des x D) / (2 x S x E) + c_corrosion, where design pressure P_des includes Allievi water hammer surge.',
      },
      {
        clause: '§6 - Résistance au Flambement Sous Vide',
        fr: 'Vérification de la stabilité au flambement élastique de la conduite sous vide partiel interne (-1 bar) lors d\'une vidange rapide avec raidisseurs annulaires normalisés.',
        en: 'Elastic buckling stability verification under internal vacuum (-1 bar) during emergency drainage, requiring external ring stiffeners if critical pressure < 1.5 x delta P.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Essai de pression hydrostatique sur site : maintien d\'une pression d\'épreuve de 1.50 x Pression statique nominale pendant 4 heures sans fuite ni déformation permanente.',
      en: 'Site hydrostatic pressure test: sustained test pressure at 1.50 x rated design pressure for 4 hours with zero leakage and zero permanent strain.',
    },
    tolerancesAndLimits: [
      { parameter: 'Surépaisseur de corrosion minimale', limit: '>= 2.0', unit: 'mm', standardReference: 'ASCE MOP 79 §4.2' },
      { parameter: 'Pression d\'épreuve hydrostatique', limit: '1.50 x P_nom', standardReference: 'ASCE MOP 79 §11' },
      { parameter: 'Coefficient sécurité anti-flambement sous vide', limit: '>= 2.0', standardReference: 'ASCE MOP 79 §6' },
    ],
    applicableSubsystems: ['H05', 'H06', 'H07'],
    cameroonApplication: {
      fr: 'Calcul des conduites forcées aériennes de Songloulou (8 conduites de ⌀5.2 m) et des blindages métalliques de puits de chute de Memve\'ele.',
      en: 'Design reference for Songloulou 8x ⌀5.2 m surface penstocks and Memve\'ele high-pressure vertical steel-lined shafts.',
    },
  },
  {
    reference: 'ICOLD Bulletin 158',
    issuer: 'ICOLD',
    category: 'civil',
    year: 2018,
    title: {
      fr: 'Surveillance des barrages et sécurité des ouvrages hydrauliques - Instrumentation et Auscultation',
      en: 'ICOLD Bulletin 158 - Dam Surveillance and Safety Assessment Guidelines',
    },
    scope: {
      fr: 'Directives internationales de la Commission Internationale des Grands Barrages (CIGB/ICOLD) pour l\'auscultation piézométrique, les pendules d\'inversion, le nivellement de crête et la détection précoce du gonflement alcali-silice (RAG).',
      en: 'International Commission on Large Dams guidelines for dam instrumentation, inverted pendulums, crest settlement geodetic monitoring, seepage weir telemetry, and Alkali-Aggregate Reaction (AAR) surveillance.',
    },
    lifecycleStages: ['Design', 'Commissioning', 'Operation', 'Dam Safety', 'O&M'],
    keyRequirements: [
      {
        clause: '§4 - Réseau Piezométrique',
        fr: 'Mesure continue de la sous-pression sous la fondation du barrage par piézomètres à corde vibrante pour vérifier l\'efficacité du rideau d\'injection et du voile de drainage.',
        en: 'Continuous uplift pressure monitoring beneath dam foundation using vibrating wire piezometers to verify grout curtain and drainage curtain efficiency.',
      },
      {
        clause: '§6 - Pendules & Déplacements',
        fr: 'Pendules directs et inversés ancrés dans le rocher sain pour mesurer le déplacement relatif crête-fondation avec une précision sub-millimétrique (±0.05 mm).',
        en: 'Direct and inverted pendulums anchored in bedrock measuring relative crest-to-foundation deflections with sub-millimeter precision (±0.05 mm).',
      },
      {
        clause: '§9 - Surveillance RAG / ASR',
        fr: 'Mesures extensométriques triaxiales au coeur du béton et sciage de fentes de décompression (Slot-cutting) en cas de déformation expansionniste asymétrique bloquant les vannes.',
        en: '3D extensometer embedded arrays and decompression slot-cutting procedures when concrete expansion exceeds 0.05 mm/m/year to prevent gate jamming.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Coefficient de sécurité au glissement du barrage K_glissement >= 1.50 sous crue décamillénale. Débit de fuite global drainé stable et exempt de particules solides (pas d\'érosion interne).',
      en: 'Sliding safety factor K_slide >= 1.50 under 10,000-year design flood. Total drainage seepage discharge stable and completely clear of soil particles (no internal piping).',
    },
    tolerancesAndLimits: [
      { parameter: 'Coefficient de sécurité au glissement barrage poids', limit: '>= 1.50', standardReference: 'ICOLD Bulletin 158 §5' },
      { parameter: 'Précision pendule d\'auscultation', limit: '±0.05', unit: 'mm', standardReference: 'ICOLD Bulletin 158 §6' },
      { parameter: 'Vitesse critique de gonflement RAG', limit: '< 0.05', unit: 'mm/m/an', standardReference: 'ICOLD Bulletin 158 §9' },
    ],
    applicableSubsystems: ['H01', 'H02', 'H03', 'H26'],
    cameroonApplication: {
      fr: 'Référence obligatoire appliquée à Songloulou pour la gestion de l\'alcali-réaction (sciage de fentes régulier) et à Lom Pangar pour la surveillance du plus grand réservoir du pays (6 000 Mm³).',
      en: 'Essential benchmark applied at Songloulou for Alkali-Silica Reaction structural monitoring (periodic slot-cutting) and at Lom Pangar (6,000 Mm³ reservoir surveillance).',
    },
  },
  {
    reference: 'IEC 61362',
    issuer: 'IEC',
    category: 'control',
    year: 2012,
    title: {
      fr: 'Guide pour la spécification des systèmes de régulation de commande des turbines hydrauliques',
      en: 'Guide to specification of hydraulic turbine control systems',
    },
    scope: {
      fr: 'Normalise la caractérisation des fonctions de transfert dynamiques des turbines hydrauliques, de l\'effet d\'inertie de l\'eau (Tw - Water Starting Time) et de l\'inertie mécanique des masses tournantes (Ta / H_constante).',
      en: 'Standardizes dynamic transfer function formulation, water starting time (Tw), mechanical inertia time constant (Ta/H), and servo actuator frequency response specification.',
    },
    lifecycleStages: ['Design', 'Acceptance Testing', 'Commissioning'],
    keyRequirements: [
      {
        clause: '§5 - Constante d\'Inertie Hydraulique Tw',
        fr: 'Calcul normalisé du temps de lancement de la colonne d\'eau : Tw = (L x v) / (g x H_net). Si le ratio Ta / Tw < 2.0, installation requise d\'une cheminée d\'équilibre ou d\'une vanne de décharge synchrone.',
        en: 'Normalized water inertia time constant: Tw = (L x v) / (g x H_net). If stability ratio Ta / Tw < 2.0, mandatory surge tank or synchronous pressure bypass valve required.',
      },
      {
        clause: '§7 - Réponse Fréquentielle Servomoteur',
        fr: 'Fréquence de coupure de l\'asservissement du distributeur hydraulique >= 1.5 Hz avec déphasage inférieur à 45° pour garantir la stabilité de la régulation en réseau isolé.',
        en: 'Servo loop actuator cutoff bandwidth >= 1.5 Hz with phase lag < 45° ensuring robust closed-loop stability under islanded grid conditions.',
      },
    ],
    acceptanceCriteria: {
      fr: 'Stabilité dynamique vérifiée avec marge de phase >= 45° et marge de gain >= 6 dB sur le diagramme de Bode de la boucle ouverte de régulation.',
      en: 'Dynamic stability certified with phase margin >= 45° and gain margin >= 6 dB on open-loop Bode plot.',
    },
    tolerancesAndLimits: [
      { parameter: 'Marge de phase minimale régulateur', limit: '>= 45', unit: 'degrés', standardReference: 'IEC 61362 §7' },
      { parameter: 'Marge de gain minimale régulateur', limit: '>= 6.0', unit: 'dB', standardReference: 'IEC 61362 §7' },
      { parameter: 'Ratio de stabilité Ta / Tw', limit: '>= 2.5', standardReference: 'IEC 61362 §5' },
    ],
    applicableSubsystems: ['H06', 'H07', 'H08', 'H11'],
    cameroonApplication: {
      fr: 'Modélisation de la colonne d\'eau des usines de Songloulou et Nachtigal pour ajuster les gains PID du contrôle-commande et éviter les phénomènes de pompage hydraulique.',
      en: 'Water column inertia modeling at Songloulou and Nachtigal to tune governor PID gains and prevent low-frequency hydraulic hunting.',
    },
  },
];
