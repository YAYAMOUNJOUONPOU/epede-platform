// src/components/production/data/otherTechnologiesData.ts
import type { ProcessStageNode, ProductionEquipment } from '../types';

export interface TechnologyOverview {
  id: string;
  nameFr: string;
  nameEn: string;
  taglineFr: string;
  taglineEn: string;
  energyChain: string;
  keyEquation: string;
  typicalEfficiency: string;
  operatingCharacteristics: string;
  stages: ProcessStageNode[];
  equipmentMap: Record<string, ProductionEquipment>;
}

// -------------------------------------------------------------
// 1. SOLAR PHOTOVOLTAIC (PV)
// -------------------------------------------------------------
export const SOLAR_STAGES: ProcessStageNode[] = [
  {
    id: 'sol-stage-radiation',
    stepNumber: 1,
    labelFr: 'Rayonnement Solaire Incident',
    labelEn: 'Solar Irradiance / Photons',
    subtitleFr: 'Irradiance globale horizontale (GHI) et directe normale (DNI)',
    subtitleEn: 'Global Horizontal (GHI) and Direct Normal Irradiance (DNI)',
    energyStateFr: 'Flux Radiatif Électromagnétique (W/m²)',
    energyStateEn: 'Electromagnetic Radiative Flux (W/m²)',
    equipmentId: 'eq-sol-sun',
    iconName: 'Sun',
    color: '#eab308'
  },
  {
    id: 'sol-stage-pv',
    stepNumber: 2,
    labelFr: 'Modules Photovoltaïques (Strings)',
    labelEn: 'PV Modules / Solar Strings',
    subtitleFr: 'Jonctions P-N silicium monocristallin / effet photovoltaïque',
    subtitleEn: 'Silicon monocrystalline P-N junctions / PV effect',
    voltageLevel: '1 000 - 1 500 Vcc',
    energyStateFr: 'Courant Continu (DC) : P_dc = N_mod · V_mp · I_mp',
    energyStateEn: 'Direct Current (DC) Bulk Power',
    equipmentId: 'eq-sol-modules',
    iconName: 'Grid',
    color: '#f59e0b'
  },
  {
    id: 'sol-stage-combiner',
    stepNumber: 3,
    labelFr: 'Boîte de Jonction / Combiner Box',
    labelEn: 'DC String Combiner Box',
    subtitleFr: 'Parallélisation des chaînes, fusibles gPV et parafoudres DC',
    subtitleEn: 'String paralleling, gPV fuses and Type II DC surge arresters',
    voltageLevel: '1 500 Vcc',
    energyStateFr: 'Collecte CC Sécurisée & Sectionnement',
    energyStateEn: 'Protected DC Collection Bus',
    equipmentId: 'eq-sol-combiner',
    iconName: 'Layers',
    color: '#d97706'
  },
  {
    id: 'sol-stage-inverter',
    stepNumber: 4,
    labelFr: 'Onduleur Centralisé / Chaîne (Inverter)',
    labelEn: 'Solar Inverter (DC/AC)',
    subtitleFr: 'Hachage IGBT triphasé, MPPT et synchronisation réseau',
    subtitleEn: 'Three-phase IGBT bridge, MPPT tracking and grid forming',
    voltageLevel: '1 500 Vcc → 690 Vca',
    energyStateFr: 'Courant Alternatif (AC) Sinusoïdal 50 Hz',
    energyStateEn: 'Sinusoidal AC Active & Reactive Power',
    equipmentId: 'eq-sol-inverter',
    iconName: 'Cpu',
    color: '#ca8a04'
  },
  {
    id: 'sol-stage-trafo',
    stepNumber: 5,
    labelFr: 'Poste de Transformation MT (Skid)',
    labelEn: 'MV Step-Up Transformer Skid',
    subtitleFr: 'Élévation 690 V → 33 kV, cellule disjoncteur et protection',
    subtitleEn: 'Stepping 690 V to 33 kV collector ring with RMU switchgear',
    voltageLevel: '690 V → 33 kV',
    energyStateFr: 'Moyenne Tension de Collecte Parc (MT 33 kV)',
    energyStateEn: 'Medium Voltage Field Collection (33 kV)',
    equipmentId: 'eq-sol-trafo',
    iconName: 'Box',
    color: '#0284c7'
  },
  {
    id: 'sol-stage-substation',
    stepNumber: 6,
    labelFr: 'Poste Évacuation HT & Raccordement',
    labelEn: 'Grid Substation & Interconnection',
    subtitleFr: 'Transformateur 33 kV / 225 kV et injection au réseau',
    subtitleEn: '33 kV / 225 kV substation transformer and grid feeding',
    voltageLevel: '33 kV → 225 kV',
    energyStateFr: 'Énergie Injectée au Réseau Électrique',
    energyStateEn: 'High-Voltage Grid Dispatched Energy',
    equipmentId: 'eq-sol-substation',
    iconName: 'Radio',
    color: '#2563eb'
  }
];

export const SOLAR_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-sol-modules': {
    id: 'eq-sol-modules',
    name: 'Champ de Modules PV Monocristallins (1 500 Vcc)',
    nameEn: 'Monocrystalline PV Module Array (1500 Vdc)',
    tag: 'SOL-MOD-01',
    category: 'power_electronics',
    subsystem: 'Génération Continue Primaire',
    iconName: 'Grid',
    definition: 'Générateur photovoltaïque composé de milliers de cellules en silicium monocristallin dopé P-N connectées en série et parallèle.',
    purpose: 'Convertir directement les photons du rayonnement solaire en paires électron-trou générant un courant continu.',
    operatingPrinciple: 'Effet photovoltaïque : absorption d\'un photon d\'énergie h·ν > Eg (gap de 1.1 eV) créant une paire électron-trou séparée par le champ électrique interne de la jonction.',
    physicalConstruction: 'Cellules silicium passivées (technologie TOPCon ou HJT), verre trempé antireflet de 3.2 mm, encapsulation EVA/POE, feuille arrière Tedlar ou bi-verre, cadre aluminium anodisé et diodes by-pass Schottky.',
    mainComponents: ['Cellules silicium TOPCon n-type', 'Verre trempé solaire', 'Diodes by-pass (3 par module)', 'Connecteurs MC4 étanches IP68'],
    energyFlow: {
      inflow: 'Irradiance solaire : G = 1 000 W/m² (STC)',
      outflow: 'Puissance électrique continue : P_dc = 550 Wc par module sous 1 500 Vcc de tension de chaîne',
      lossMechanism: 'Réflexion optique, recombinaison thermique des porteurs, résistance série des pistes métalliques',
      efficiencyTypical: '22.5% à 23.8%'
    },
    electricalRole: 'Source de courant continu non linéaire dont le point de puissance maximale dépend de l\'éclairement et de la température.',
    mechanicalRole: 'Résiste aux charges statiques de vent (2 400 Pa) et de grêle selon CEI 61215.',
    control: 'Suivi par trackers solaires 1 axe (tracking est-ouest) pour optimiser l\'angle d\'incidence.',
    instrumentation: ['Pyranomètres étalonnés en W/m²', 'Sondes de température de face arrière de module (PT1000)'],
    protection: {
      description: 'Diodes by-pass intégrées protégeant les cellules contre les points chauds (hot-spots) en cas d\'ombrage partiel.',
      tripActions: 'Court-circuitage automatique des strings défaillantes.'
    },
    auxiliarySystems: ['Robots nettoyeurs automatiques sans eau', 'Structures métalliques monopieu à inclinaison asservie'],
    operatingStates: {
      normal: 'Production continue suivant la courbe de soleil diurne',
      starting: 'Mise en conduction dès que G > 50 W/m²',
      running: 'Point de puissance maximale (MPPT)',
      stopping: 'Baisse de tension au crépuscule',
      fault: 'Défaut d\'isolement de string ou claquage d\'une diode',
      maintenance: 'Thermographie infrarouge par drone pour détection de points chauds',
      isolated: 'Sectionnement par interrupteur-sectionneur DC en charge'
    },
    failureModes: ['Dégradation induite par le potentiel (PID)', 'Microfissures des cellules par vibration mécanique', 'Délamination des films EVA'],
    safetyConsiderations: ['Tension continue de 1 500 Vcc mortelle permanente tant qu\'il y a de la lumière (impossible d\'éteindre le soleil)', 'EPI diélectriques obligatoires'],
    maintenance: ['Nettoyage périodique anti-poussière / sables du désert', 'Contrôle thermographique annuel'],
    parameters: [
      { label: 'Puissance crête unitaire', symbol: 'P_mpp', typicalValue: '585', unit: 'Wc', significance: 'Puissance crête standard STC (1000 W/m², 25°C)' },
      { label: 'Tension maximale du système', symbol: 'V_sys', typicalValue: '1 500', unit: 'Vcc', significance: 'Permet de longues chaînes de 30 modules en série' },
      { label: 'Coefficient de température', symbol: 'γ', typicalValue: '-0.30', unit: '%/°C', significance: 'Perte de rendement lorsque le panneau chauffe au soleil' }
    ],
    standards: ['CEI 61215 (Terrestrial PV modules)', 'CEI 61730 (PV module safety qualification)'],
    upstreamEquipment: ['Rayonnement solaire direct et diffus'],
    downstreamEquipment: ['Boîtes de jonction DC', 'Onduleur solaire'],
    physicalRepresentation: 'Longues rangées régulières de panneaux bleus/noirs inclinés face au soleil.',
    electricalRepresentation: 'Générateur de courant avec diode en parallèle et résistances R_s et R_sh.',
    functionalRepresentation: 'Conversion Photovoltaïque : I = I_ph - I_0 · [exp(q·V / n·k·T) - 1].'
  },
  'eq-sol-inverter': {
    id: 'eq-sol-inverter',
    name: 'Onduleur Solaire Multi-Topologies : Centralisé (NPC 3-Niveaux) & Chaîne (String)',
    nameEn: 'Advanced Solar PV Inverter: Central (3-Level NPC) & Multi-MPPT String Converter',
    tag: 'SOL-INV-01',
    category: 'power_electronics',
    subsystem: 'Conversion Électromécanique & Électronique de Puissance Statique',
    iconName: 'Cpu',
    definition: 'Convertisseur statique réversible 4 quadrants assurant la conversion DC/AC triphasée 1500 Vcc vers 690 Vca. Comprend la comparaison intégrée entre topologies centralisées (station conteneurisée 3.125 MVA à point neutre calé 3-level NPC) et réparties (onduleurs de chaîne 250-330 kVA à multi-MPPT indépendants).',
    purpose: 'Assurer la conversion DC/AC à haut rendement (> 99%), la recherche dynamique du point de puissance maximale (MPPT P&O / Incremental Conductance sous irradiance dynamique), le contrôle vectoriel en repère tournant dq0, et les fonctions de support de réseau (Grid-Forming / Grid-Following, FRT, amortissement sous-synchrone, fourniture de puissance réactive Q@Night).',
    operatingPrinciple: 'Modulation de largeur d\'impulsion vectorielle (SVPWM) sur ponts IGBT/SiC en topologie 3 niveaux Neutral Point Clamped (NPC) ou T-Type, divisant par deux la tension de commutation (Vdc/2) et réduisant le dv/dt ainsi que les pertes par commutation. Asservissement en boucle fermée des courants d-q via boucles PI et PLL à synchronisation instantanée.',
    physicalConstruction: 'Topologie Centralisée : conteneur climatisé étanche IP65 avec inductances de lissage de phase à noyau nanocristallin, busbars laminés à faible inductance parasite (< 25 nH), condensateurs de liaison DC à film polypropylène auto-cicatrisant (> 100 000 h), et ponts IGBT 1700V/2400A à caloduc ou refroidissement liquide eau/glycol. Topologie String : châssis aluminium moulé sous pression IP66 à refroidissement naturel sans ventilateur externe avec 12 trackers MPPT indépendants (2 strings par MPPT).',
    mainComponents: [
      'Topologie Centralisée : Pont NPC 3 niveaux à IGBT 1700V / diodes de calage neutre',
      'Topologie String : Étage élévateur Boost DC/DC multi-canaux + onduleur triphasé SiC',
      'Filtre de sortie L-C-L avec amortissement passif/actif résonance réseau',
      'Bus continu DC à condensateurs à film polypropylène métallisé haute densité',
      'Calculateur double cœur DSP + FPGA temps réel (échantillonnage 20 kHz / boucle courant < 50 µs)',
      'Sectionneur motorisé DC 1500 Vcc à coupure visible et disjoncteur AC débrochable'
    ],
    energyFlow: {
      inflow: 'Puissance continue DC : 3 150 kW sous 950 - 1 500 Vcc (Central) ou 12 x 25 kW sous 500 - 1 500 Vcc (String)',
      outflow: 'Puissance alternative AC triphasée : 3 125 kVA sous 690 Vca, 50 Hz, THDi < 1.5%, cos φ réglable de 0.8 inductif à 0.8 capacitif',
      lossMechanism: 'Pertes de conduction IGBT (V_ce0 · I_c + r_ce · I_c²), pertes de commutation (E_on + E_off) · f_sw, pertes fer et cuivre des inductances LCL',
      efficiencyTypical: '99.03% (rendement crête) / 98.7% (rendement européen Euro-ETA)'
    },
    electricalRole: 'Convertisseur bidirectionnel 4 quadrants assurant le réglage dynamique P-f (statos de fréquence) et Q-U (tenue en tension), franchissement des creux de tension (LVRT/HVRT selon CEI 62116), et capacité d\'îlotage intentionnel en mode Grid-Forming (VSM - Virtual Synchronous Machine).',
    mechanicalRole: 'Résistance aux environnements désertiques/côtiers extrêmes (température ambiante -25°C à +60°C sans déclassement jusqu\'à 50°C), étanchéité IP65/NEMA 4X, tenue sismique IEEE 693.',
    control: 'Double contrôle vectoriel en repère dq : boucle interne de courant à temps de réponse < 2 ms et boucle externe de régulation de tension du bus DC / puissance réactive Q. Algorithme MPPT hybride combinant scan global I-V périodique (détection ombrages complexes) et suivi incrémental fin.',
    instrumentation: ['Transducteurs de courant à flux nul (fluxgate) de précision 0.1%', 'Capteurs de tension différentielle DC 2 kV', 'Surveillance thermique par fibre optique ou sondes NTC intégrées aux puces IGBT', 'Détecteur d\'arc électrique DC (AFCI série/parallèle per UL 1699B)'],
    protection: {
      ansiCodes: ['59/27', '81O/U', '78', '47', '51', '67', 'AFCI'],
      description: 'Détection d\'arc électrique DC ultra-rapide (< 100 ms), protection anti-îlotage active avec injection d\'impulsion de dérive de fréquence, parafoudres Type 1+2 DC/AC intégrés, et décharge active du bus continu.',
      tripActions: 'Blocage immédiat des impulsions de grille des IGBT (< 2 µs en cas de surintensité desaturée) et ouverture coordonnée des contacteurs AC/DC.'
    },
    auxiliarySystems: ['Boucle de refroidissement liquide fermée eau-glycol avec pompe redondante', 'Système d\'extinction incendie automatique par aérosol solide pour onduleur centralisé', 'Chauffage anticondensation piloté par hygrométrie'],
    operatingStates: {
      normal: 'Injection continue en mode MPPT optimal avec régulation cos φ dynamique',
      starting: 'Précharge progressive du bus DC par résistance de limitation puis fermeture du contacteur principal',
      running: 'Fonctionnement nominal avec asservissement vectoriel dq0 et équilibrage du point neutre NPC',
      stopping: 'Rampe de réduction de puissance contrôlée (dP/dt < 20% Pn/s)',
      fault: 'Déconnexion immédiate par crowbar logiciel et blocage des drivers IGBT',
      maintenance: 'Décharge active du banc de condensateurs DC sous résistance de purge jusqu’à V < 10 V',
      isolated: 'Verrouillage cadenassable des sectionneurs DC et disjoncteurs AC en position ouverte'
    },
    failureModes: ['Court-circuit par claquage thermique d\'un module IGBT (avalanche)', 'Vieillissement et perte de capacité des condensateurs DC avec augmentation de l\'ondulation résiduelle (ripple)', 'Claquant diélectrique de mode commun sous surtension de résonance câble-filtre'],
    safetyConsiderations: ['Énergie capacitive résiduelle DC potentiellement mortelle (plusieurs milliers de Joules à 1500 Vcc)', 'Zone ATEX / risque d\'arc flash DC élevé nécessitant EPI Catégorie 4'],
    maintenance: ['Contrôle thermographique infrarouge sous pleine charge des busbars et connexions', 'Test annuel de l’équilibrage des potentiels de neutre NPC et mesure d’ESR des condensateurs'],
    parameters: [
      { label: 'Puissance apparente nominale', symbol: 'S_ac', typicalValue: '3 125', unit: 'kVA', significance: 'Capacité de transit en onduleur centralisé (250-330 kVA en string)' },
      { label: 'Plage de tension MPPT', symbol: 'V_mppt', typicalValue: '860 - 1 300', unit: 'Vcc', significance: 'Fenêtre de fonctionnement à puissance maximale garantie' },
      { label: 'Tension maximale absolue DC', symbol: 'V_dc_max', typicalValue: '1 500', unit: 'Vcc', significance: 'Tension de circuit ouvert à température froide minimale' },
      { label: 'Fréquence de découpage PWM', symbol: 'f_sw', typicalValue: '3 000', unit: 'Hz', significance: 'Compromis optimal entre pertes de commutation et volume du filtre LCL' }
    ],
    standards: ['CEI 62109-1/2 (Power converter safety)', 'CEI 62920 (EMC for PV generation)', 'IEEE 1547-2018 (DER Interconnection)', 'VDE-AR-N 4110/4120 (Grid Codes)'],
    upstreamEquipment: ['Champ de modules photovoltaïques 1500 Vcc', 'Boîtes de regroupement / jonction'],
    downstreamEquipment: ['Poste de transformation MT 690 V / 33 kV', 'Cellule de départ RMU'],
    physicalRepresentation: 'Station conteneurisée compacte en béton ou tôle marine abritant les tiroirs de puissance IGBT débrochables et le transformateur élévateur adjacent.',
    electricalRepresentation: 'Schéma unifilaire à pont onduleur 3 niveaux NPC avec bus continu divisé C1/C2, diodes de clamping neutre, et filtre sinusoïdal LCL.',
    functionalRepresentation: 'Conversion Statique Réversible & MPPT : P_ac(t) = η_conv · V_dc(t) · I_dc(t) ; Q_ac = 1.732 · V_ac · I_q.'
  }
};

// -------------------------------------------------------------
// 2. WIND POWER GENERATION (ÉOLIEN)
// -------------------------------------------------------------
export const WIND_STAGES: ProcessStageNode[] = [
  {
    id: 'wind-stage-resource',
    stepNumber: 1,
    labelFr: 'Gisement Éolien (Vent)',
    labelEn: 'Wind Resource & Velocity Profile',
    subtitleFr: 'Vitesse de vent cinétique (v en m/s) à hauteur de moyeu (120 m)',
    subtitleEn: 'Kinetic wind velocity profile at hub height (120 m)',
    energyStateFr: 'Énergie Cinétique Fluide : P_vent = 0.5 · ρ · A · v³',
    energyStateEn: 'Kinetic Atmospheric Fluid Energy',
    equipmentId: 'eq-wind-anemometer',
    iconName: 'Wind',
    color: '#06b6d4'
  },
  {
    id: 'wind-stage-rotor',
    stepNumber: 2,
    labelFr: 'Rotor Éolien & Pales Aérodynamiques',
    labelEn: 'Aerodynamic Rotor & Blades',
    subtitleFr: 'Pales en composite verre/carbone à calage variable (Pitch)',
    subtitleEn: 'Glass/carbon fiber blades with active pitch control',
    energyStateFr: 'Couple Aérodynamique Basse Vitesse (Limite de Betz: 59.3%)',
    energyStateEn: 'Low-Speed Aerodynamic Shaft Torque (Betz Limit)',
    equipmentId: 'eq-wind-rotor',
    iconName: 'RotateCw',
    color: '#0891b2'
  },
  {
    id: 'wind-stage-drivetrain',
    stepNumber: 3,
    labelFr: 'Ligne d\'Arbre & Multiplicateur (Gearbox)',
    labelEn: 'Drivetrain & Planetary Gearbox',
    subtitleFr: 'Multiplication de vitesse (ex: 12 tr/min → 1 500 tr/min)',
    subtitleEn: 'Planetary gear acceleration from 12 rpm to 1 500 rpm',
    energyStateFr: 'Couple Réduit à Haute Vitesse de Rotation',
    energyStateEn: 'High-Speed Mechanical Shaft Power',
    equipmentId: 'eq-wind-gearbox',
    iconName: 'Activity',
    color: '#0e7490'
  },
  {
    id: 'wind-stage-generator',
    stepNumber: 4,
    labelFr: 'Génératrice (DFIG / Asynchrone Double Alimentation)',
    labelEn: 'Generator (DFIG / PMSG)',
    subtitleFr: 'Conversion électromécanique à vitesse variable stator/rotor',
    subtitleEn: 'Variable-speed electromechanical conversion (DFIG or PMSG)',
    voltageLevel: '690 Vca',
    energyStateFr: 'Puissance Électrique Triphasée à Fréquence Fixe',
    energyStateEn: 'Three-Phase AC Electric Power at Variable Slip',
    equipmentId: 'eq-wind-generator',
    iconName: 'Zap',
    color: '#0284c7'
  },
  {
    id: 'wind-stage-converter',
    stepNumber: 5,
    labelFr: 'Convertisseur de Puissance 4 Quadrants',
    labelEn: 'Back-to-Back Frequency Converter',
    subtitleFr: 'Convertisseur AC/DC/AC découplant la vitesse du réseau 50 Hz',
    subtitleEn: 'Grid-side & rotor-side converters enabling active/reactive control',
    voltageLevel: '690 Vca',
    energyStateFr: 'Contrôle Actif/Réactif Indépendant',
    energyStateEn: 'Full Active & Reactive Power Regulation',
    equipmentId: 'eq-wind-converter',
    iconName: 'Cpu',
    color: '#6366f1'
  },
  {
    id: 'wind-stage-trafo',
    stepNumber: 6,
    labelFr: 'Transformateur de Nacelle / Pied de Mât',
    labelEn: 'Turbine Step-Up Transformer (33 kV)',
    subtitleFr: 'Élévation 690 V → 33 kV pour acheminement sous-terrain',
    subtitleEn: 'Stepping to 33 kV internal park collector network',
    voltageLevel: '690 V → 33 kV',
    energyStateFr: 'Moyenne Tension de Collecte Parc Éolien',
    energyStateEn: 'Medium-Voltage Underground Array Power',
    equipmentId: 'eq-wind-trafo',
    iconName: 'Box',
    color: '#4f46e5'
  }
];

export const WIND_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-wind-rotor': {
    id: 'eq-wind-rotor',
    name: 'Rotor Éolien Tripale à Calage Variable (Pitch)',
    nameEn: 'Three-Blade Aerodynamic Rotor with Active Pitch Control',
    tag: 'WND-ROT-01',
    category: 'mechanical',
    subsystem: 'Captage Aérodynamique',
    iconName: 'RotateCw',
    definition: 'Sous-ensemble tournant composé de 3 pales aérodynamiques en matériaux composites reliées à un moyeu central en fonte nodulaire.',
    purpose: 'Extraire l\'énergie cinétique du vent pour créer un couple aérodynamique de rotation à vitesse lente (8 à 16 tr/min).',
    operatingPrinciple: 'Portance et traînée aérodynamiques régies par la théorie de l\'élément de pale (BEM). Le profil d\'aile génère une force de portance perpendiculaire à l\'écoulement relatif.',
    physicalConstruction: 'Pales en résine époxy renforcée de fibres de verre et longerons en fibre de carbone, âme en balsa/mousse PVC, récepteurs de foudre en cuivre sur le bord d\'attaque, moyeu moulé en fonte GS.',
    mainComponents: ['3 pales aérodynamiques de 65 à 85 m de long', 'Système de calage individuel des pales (moteurs pitch électriques)', 'Moyeu central en fonte', 'Roulements de pale à quatre points de contact'],
    energyFlow: {
      inflow: 'Puissance cinétique du vent traversant la surface balayée : P_w = 0.5 · ρ · π · R² · v³',
      outflow: 'Couple mécanique sur l\'arbre lent : P_m = C_p(λ, β) · P_w (rendement aérodynamique C_p jusqu\'à 48%)',
      lossMechanism: 'Tourbillons d\'extrémité de pale, traînée de profil, pertes de sillage',
      efficiencyTypical: '47.5% (proche de la limite physique théorique de Betz à 59.3%)'
    },
    electricalRole: 'Aucun direct ; actionneurs électriques de pitch alimentés par batteries ultracapacités 24 Vcc pour mise en drapeau de sécurité.',
    mechanicalRole: 'Génère un couple de torsion géant sur l\'arbre lent (plus de 2 500 kN·m) et encaisse des poussées axiales de plusieurs centaines de kN.',
    control: 'Contrôleur de pitch asservi : ajuste l\'angle de calage β de 0° (pleine prise au vent) à 90° (mise en drapeau / arrêt complet).',
    instrumentation: ['Anémomètres à ultrasons et girouettes montés sur la nacelle', 'Capteurs de charge à fibres optiques (FBG) intégrés dans les pales'],
    protection: {
      description: 'Mise en drapeau d\'urgence des pales par condensateurs de sauvegarde en cas de vent extrême (v > 25 m/s) ou coupure réseau.',
      tripActions: 'Rotation rapide des 3 pales à 90° en moins de 3 secondes pour casser la portance et freiner l\'éolienne aérodynamiquement.'
    },
    auxiliarySystems: ['Système de graissage automatique des couronnes d\'orientation', 'Système de dégivrage des pales par air chaud ou résistances'],
    operatingStates: {
      normal: 'Régulation de vitesse en zone II (optimisation du ratio λ) et régulation de puissance en zone III (écrêtage par pitch)',
      starting: 'Accélération douce dès que v > 3 m/s (vitesse de démarrage / cut-in)',
      running: 'Production nominale entre 11 m/s et 25 m/s',
      stopping: 'Mise en drapeau progressive si le vent tombe sous 3 m/s',
      fault: 'Arrêt d\'urgence sur vibration anormale ou survitesse',
      maintenance: 'Verrouillage mécanique du rotor par broche hydraulique',
      isolated: 'Rotor verrouillé face au vent neutre'
    },
    failureModes: ['Fissuration de pale par fatigue sous vent turbulent', 'Défaillance d\'un réducteur de pitch empêchant la mise en drapeau', 'Impact de foudre perforant la pointe de pale'],
    safetyConsiderations: ['Verrouillage mécanique obligatoire du rotor avant toute pénétration de technicien dans le moyeu', 'Lignes de vie intérieures'],
    maintenance: ['Contrôle d\'intégrité des pales par inspection télévisuelle ou drones', 'Vérification du couple de serrage des boulons d\'emplanture'],
    parameters: [
      { label: 'Diamètre du rotor', symbol: 'D_rotor', typicalValue: '150', unit: 'm', significance: 'Surface balayée de plus de 17 000 m² captant le vent' },
      { label: 'Vitesse de rotation nominale', symbol: 'n_rotor', typicalValue: '12.5', unit: 'tr/min', significance: 'Vitesse lente adaptée aux grandes dimensions' },
      { label: 'Vitesse de coupure haute', symbol: 'v_cutout', typicalValue: '25.0', unit: 'm/s', significance: 'Arrêt de protection par vent tempétueux (> 90 km/h)' }
    ],
    standards: ['CEI 61400-1 (Wind turbines - Design requirements)', 'CEI 61400-24 (Lightning protection)'],
    upstreamEquipment: ['Ressource de vent atmosphérique'],
    downstreamEquipment: ['Arbre lent', 'Multiplicateur de vitesse (Gearbox)'],
    physicalRepresentation: 'Hélice géante blanche à 3 pales dominant la tour de 120 m.',
    electricalRepresentation: 'Boucle de commande d\'actionneurs électriques de pitch 400 V / secours 24 Vcc.',
    functionalRepresentation: 'Convertisseur Aérodynamique : P_aero = 0.5 · C_p · ρ · A · v³.'
  },
  'eq-wind-generator': {
    id: 'eq-wind-generator',
    name: 'Génératrice Asynchrone à Double Alimentation (DFIG 4 MW)',
    nameEn: '4 MW Doubly-Fed Induction Generator (DFIG)',
    tag: 'WND-GEN-01',
    category: 'electromagnetic',
    subsystem: 'Génération Électrique Nacelle',
    iconName: 'Zap',
    definition: 'Machine asynchrone triphasée à rotor bobiné dont le stator est relié directement au réseau 50 Hz et le rotor est alimenté via un convertisseur 4 quadrants.',
    purpose: 'Produire de l\'électricité à fréquence réseau constante (50 Hz) sur une plage de vitesse de rotation variable de ±30% autour de la vitesse synchrone.',
    operatingPrinciple: 'Loi de composition des fréquences rotor-stator : f_stator = f_mecanique ± f_rotor. Le convertisseur injecte au rotor un courant alternatif à fréquence de glissement exacte pour que le flux statorique reste à 50 Hz.',
    physicalConstruction: 'Stator feuilleté en acier magnétique à faibles pertes avec bobinage triphasé 690 V, rotor bobiné avec bagues collectrices en bronze et balais graphite, enveloppe étanche IP54 intégrée dans la nacelle.',
    mainComponents: ['Stator bobiné 690 V', 'Rotor triphasé à bagues', 'Bagues collectrices et porte-balais', 'Refroidisseur air/eau ou air/air supérieur'],
    energyFlow: {
      inflow: 'Couple mécanique haute vitesse issu du multiplicateur (ex: 1 500 tr/min, 4 080 kW mécaniques)',
      outflow: 'Puissance statorique directe (80% soit 3.2 MW) + Puissance rotorique via convertisseur (20% soit 0.8 MW)',
      lossMechanism: 'Pertes fer stator/rotor, pertes Joule, frottement des balais sur bagues',
      efficiencyTypical: '97.2%'
    },
    electricalRole: 'Permet d\'extraire de la puissance à vitesse sous-synchrone et hyper-synchrone tout en régulant indépendamment le facteur de puissance.',
    mechanicalRole: 'Amortit les à-coups de couple éoliens grâce à son glissement dynamique contrôlé.',
    control: 'Régulateur vectoriel à orientation de flux statorique pilotant le pont rotorique en modulation PWM.',
    instrumentation: ['Codeur incrémental haute résolution d\'arbre pour mesure exacte de position et vitesse', 'Capteurs de température bobinages PT100'],
    protection: {
      ansiCodes: ['87G', '50/51', '64G', '49', 'Crowbar'],
      description: 'Protection Crowbar active court-circuitant le rotor en quelques microsecondes en cas de creux de tension sur le réseau.',
      tripActions: 'Déconnexion immédiate du convertisseur rotorique pour protéger les IGBT contre les surintensités transitoires.'
    },
    auxiliarySystems: ['Système de circulation d\'eau glycolée avec radiateur extérieur sur nacelle', 'Aspirateur de poussières de balais'],
    operatingStates: {
      normal: 'Plage de vitesse de 1 050 à 1 950 tr/min avec cos φ réglable de 0.90 capacitif à 0.90 inductif',
      starting: 'Magnétisation douce du stator par le convertisseur rotorique (synchronisation sans appel de courant)',
      running: 'Production continue suivant la courbe de vent',
      stopping: 'Réduction de puissance et découplage sans à-coup',
      fault: 'Déclenchement Crowbar sur creux de tension réseau sévère',
      maintenance: 'Vérification de l\'usure des balais et de l\'état de surface des bagues',
      isolated: 'Déconnectée'
    },
    failureModes: ['Usure anormale ou flashover sur bagues collectrices', 'Claquant diélectrique de l\'isolation rotorique sous surtension transitoire', 'Surchauffe par défaillance du ventilateur de nacelle'],
    safetyConsiderations: ['Tension induite dangereuse au rotor même machine non raccordée au réseau si le rotor tourne', 'Frein mécanique serré obligatoire'],
    maintenance: ['Remplacement régulier des balais graphite', 'Contrôle d\'isolement mégohmmètre 1 000 V'],
    parameters: [
      { label: 'Puissance nominale', symbol: 'P_nom', typicalValue: '4 000', unit: 'kW', significance: 'Puissance active totale injectée à pleine vitesse' },
      { label: 'Vitesse de synchronisme', symbol: 'n_synchro', typicalValue: '1 500', unit: 'tr/min', significance: 'Machine à 4 pôles à 50 Hz' },
      { label: 'Tension statorique', symbol: 'U_stator', typicalValue: '690', unit: 'Vca', significance: 'Tension basse tension industrielle standard' }
    ],
    standards: ['CEI 60034-1 (Rotating electrical machines)', 'CEI 61400-22 (Wind turbine certification)'],
    upstreamEquipment: ['Multiplicateur de vitesse (Gearbox)'],
    downstreamEquipment: ['Convertisseur de fréquence rotorique', 'Transformateur de mât 33 kV'],
    physicalRepresentation: 'Machine cylindrique compacte de 2.5 m de diamètre logée à l\'arrière de la nacelle éolienne.',
    electricalRepresentation: 'Génératrice asynchrone à rotor bobiné avec stator relié au bus et rotor relié au convertisseur.',
    functionalRepresentation: 'Machine à Vitesse Variable : f_s = f_m ± f_r = 50.0 Hz.'
  },
  'eq-wind-converter': {
    id: 'eq-wind-converter',
    name: 'Convertisseur 4-Quadrants Éolien : DFIG Back-to-Back & PMSG Pleine Puissance',
    nameEn: 'Wind Power Electronic Converter: DFIG Back-to-Back & Full-Scale PMSG System',
    tag: 'WND-CONV-01',
    category: 'power_electronics',
    subsystem: 'Conversion Électromécanique & Régulation Vectorielle',
    iconName: 'Cpu',
    definition: 'Système de conversion électronique de puissance bidirectionnel AC/DC/AC. Couvre les deux architectures dominantes : 1) DFIG (Machine Asynchrone Double Alimentation) à convertisseur partiel (30% Pn) interconnecté entre le rotor et le réseau avec Crowbar actif ; 2) PMSG (Génératrice Synchrone à Aimants Permanents / Direct-Drive) à convertisseur pleine échelle (100% Pn) découplant intégralement la génératrice du réseau électrique.',
    purpose: 'Contrôler le couple électromagnétique et la vitesse mécanique de rotation pour maximiser le coefficient de puissance aérodynamique (MPPT C_p max), synchroniser la fréquence rotorique avec les 50 Hz du réseau, réguler indépendamment les puissances active P et réactive Q, et assurer la tenue aux défauts réseau (LVRT) avec injection de courant réactif capacitif.',
    operatingPrinciple: 'Double modulation SVPWM à orientation de flux (Field-Oriented Control FOC) : le convertisseur côté rotor (RSC) contrôle le glissement rotorique s = (n_s - n)/n_s et le couple électromagnétique Te = 1.5 · p · (L_m / L_s) · psi_s · I_rq ; le convertisseur côté réseau (GSC) régule la tension du bus continu V_dc et le facteur de puissance au point de raccordement via le repère dq.',
    physicalConstruction: 'Armoire métallique étanche IP54 implantée au pied de mât ou dans la nacelle, intégrant 3 tiroirs débrochables IGBT 1700V/3300V refroidis par circuit caloporteur eau-glycol, bus continu à condensateurs polypropylène métallisé, filtre LCL côté réseau, filtre dv/dt côté génératrice, et module Crowbar électronique à thyristors de puissance.',
    mainComponents: [
      'Convertisseur côté rotor/génératrice (RSC / Machine Side Converter)',
      'Convertisseur côté réseau (GSC / Grid Side Converter)',
      'Bus continu intermédiaire DC (Vdc = 1150 V) avec condensateurs à film sec',
      'Circuit de protection Crowbar actif à thyristors et résistance de dissipation pulsée (Chopper)',
      'Filtre de sortie réseau L-C-L avec atténuation des harmoniques de commutation',
      'Contrôleur redondant DSP/FPGA à échantillonnage 10 kHz et liaison optique fibre'
    ],
    energyFlow: {
      inflow: 'Puissance mécanique sur l\'arbre : 4 200 kW ; Puissance rotorique bi-directionnelle : ±800 kW (DFIG) ou 4 000 kW (PMSG)',
      outflow: 'Puissance électrique 690 Vca 50 Hz injectée avec THDi < 2%, cos φ asservi de 0.9 capacitif à 0.9 inductif',
      lossMechanism: 'Pertes de commutation et conduction des modules IGBT/diodes, pertes Joule dans les filtres LCL et câbles de descente',
      efficiencyTypical: '98.5% (DFIG partiel) / 96.8% (PMSG pleine échelle avec redressement total)'
    },
    electricalRole: 'Assure le découplage électromécanique, l’injection d’inertie synthétique (Fast Frequency Response) par décharge de l’énergie cinétique du rotor, et la conformité stricte aux Grid Codes (tenue aux creux de tension LVRT selon CEI 61400-21).',
    mechanicalRole: 'Amortissement actif des oscillations de torsion de la chaîne cinématique (Active Damping of Drivetrain Torsion) via modulation du couple de consigne à la fréquence propre de l\'arbre.',
    control: 'Commande vectorielle FOC découplée d-q : régulation de courant i_d (flux/tension) et i_q (couple/puissance active). Module de recherche MPPT éolien avec table C_p optimal λ_opt asservie au calage des pales (pitch).',
    instrumentation: ['Codeurs optiques absolus 24-bit de position rotorique', 'Sondes à effet Hall LEM pour courants de phase', 'Mesure optique de tension de bus DC', 'Capteurs de température PT100 sur radiateurs IGBT'],
    protection: {
      ansiCodes: ['50/51', '59/27', '81O/U', '64R', 'Crowbar'],
      description: 'Déclenchement du Crowbar actif en moins de 5 µs lors d\'un creux de tension symétrique ou asymétrique pour dévier le courant de défaut rotorique et protéger les IGBT du RSC.',
      tripActions: 'Court-circuitage du rotor sur résistances de décharge et passage des pales en drapeau (feathering).'
    },
    auxiliarySystems: ['Groupe de pompage et aéro-réfrigérant d\'eau glycolée', 'Résistances de précharge du bus DC', 'Filtres antiparasites CEM classe A1'],
    operatingStates: {
      normal: 'Vitesse variable de 900 à 1 800 tr/min en mode MPPT continu',
      starting: 'Précharge progressive du bus DC et magnétisation rotorique sans appel de courant',
      running: 'Régulation de puissance sous vent modéré et écrêtage à Pn sous fort vent par pitch combiné',
      stopping: 'Réduction progressive du couple électromagnétique et ouverture du disjoncteur réseau',
      fault: 'Activation Crowbar, blocage des grilles IGBT et freinage aérodynamique d\'urgence',
      maintenance: 'Consignation LOTO, décharge active du bus continu et mise à la terre',
      isolated: 'Déconnecté physiquement du réseau et de la génératrice'
    },
    failureModes: ['Court-circuit par claquage thermique d\'un module IGBT lors d\'un creux de tension non protégé', 'Surchauffe du circuit de refroidissement eau-glycol', 'Dégradation des condensateurs de filtrage du bus continu'],
    safetyConsiderations: ['Tension continue de 1 150 Vcc sur le bus intermédiaire et tensions transitoires de coupure élevées', 'Présence de tensions induites au rotor même en rotation libre'],
    maintenance: ['Contrôle thermographique semestriel des connexions de puissance', 'Analyse du fluide caloporteur et vérification de la pression du vase d\'expansion'],
    parameters: [
      { label: 'Puissance nominale convertisseur', symbol: 'S_conv', typicalValue: '1 200 (DFIG) / 4 200 (PMSG)', unit: 'kVA', significance: 'Dimensionnement partiel 30% en DFIG vs 100% en PMSG' },
      { label: 'Tension du bus continu', symbol: 'V_dc', typicalValue: '1 150', unit: 'Vcc', significance: 'Tension intermédiaire régulée garantissant la marge de surmodulation' },
      { label: 'Fréquence de découpage', symbol: 'f_sw', typicalValue: '2 500', unit: 'Hz', significance: 'Fréquence PWM optimisée pour minimiser les pertes' },
      { label: 'Temps de réponse de couple', symbol: 't_resp', typicalValue: '< 10', unit: 'ms', significance: 'Permet l\'amortissement actif des rafales et vibrations de tour' }
    ],
    standards: ['CEI 61400-1 (Wind turbines design)', 'CEI 61400-21 (Measurement of power quality characteristics)', 'CEI 61800-5-1 (Adjustable speed electric drive systems)'],
    upstreamEquipment: ['Génératrice éolienne DFIG ou PMSG direct-drive'],
    downstreamEquipment: ['Transformateur élévateur de mât 690 V / 33 kV'],
    physicalRepresentation: 'Armoires métalliques modulaires compartimentées avec modules de puissance extractibles logées au pied de mât éolien.',
    electricalRepresentation: 'Schéma unifilaire à deux ponts triphasés dos-à-dos (Back-to-Back) reliés par bus continu avec Crowbar actif et filtre LCL.',
    functionalRepresentation: 'Contrôle Vectoriel Double Alimentation : T_e = f(i_rq) ; P_gsc = f(V_dc) ; Q_total = Q_stator + Q_gsc.'
  }
};

// -------------------------------------------------------------
// 3. THERMAL POWER GENERATION (CYCLE COMBINÉ GAZ/VAPEUR - CCGT)
// -------------------------------------------------------------
export const THERMAL_STAGES: ProcessStageNode[] = [
  {
    id: 'thm-stage-fuel',
    stepNumber: 1,
    labelFr: 'Alimentation & Traitement Combustible (Gaz Naturel)',
    labelEn: 'Fuel Gas Treatment & Metering Station',
    subtitleFr: 'Comptage, filtration, réchauffage et régulation de pression (35 bar)',
    subtitleEn: 'Gas metering, scrubber filtration, preheating & pressure regulation',
    energyStateFr: 'Énergie Chimique Primaire (Pouvoir Calorifique PCI)',
    energyStateEn: 'Chemical Potential Energy (LHV in MJ/kg)',
    equipmentId: 'eq-thm-fuel',
    iconName: 'Flame',
    color: '#f97316'
  },
  {
    id: 'thm-stage-gasturbine',
    stepNumber: 2,
    labelFr: 'Turbine à Gaz & Chambre de Combustion (GT)',
    labelEn: 'Gas Turbine (Brayton Cycle)',
    subtitleFr: 'Compression d\'air (18:1), combustion à 1 450°C et détente',
    subtitleEn: 'Air compressor, dry low-NOx combustion chamber & expansion',
    energyStateFr: 'Puissance Mécanique sur Arbre GT (Rendement ~38%)',
    energyStateEn: 'High-Temperature Mechanical Shaft Power',
    equipmentId: 'eq-thm-gasturbine',
    iconName: 'RotateCw',
    color: '#ea580c'
  },
  {
    id: 'thm-stage-hrsgs',
    stepNumber: 3,
    labelFr: 'Chaudière de Récupération (HRSG)',
    labelEn: 'Heat Recovery Steam Generator (HRSG)',
    subtitleFr: 'Récupération de la chaleur des fumées d\'échappement à 600°C',
    subtitleEn: 'Three-pressure reheat steam generation from 600°C exhaust gas',
    energyStateFr: 'Énergie Thermique Vapeur Haute Pression (120 bar / 560°C)',
    energyStateEn: 'Superheated High-Pressure Steam Enthalpy',
    equipmentId: 'eq-thm-hrsg',
    iconName: 'Layers',
    color: '#dc2626'
  },
  {
    id: 'thm-stage-steamturbine',
    stepNumber: 4,
    labelFr: 'Turbine à Vapeur (Cycle de Rankine)',
    labelEn: 'Steam Turbine (HP / IP / LP)',
    subtitleFr: 'Détente de vapeur à travers 3 corps de turbine (HP, MP, BP)',
    subtitleEn: 'Multi-stage expansion through HP, IP and LP steam cylinders',
    energyStateFr: 'Puissance Mécanique Additionnelle (Rendement combiné ~60%)',
    energyStateEn: 'Secondary Mechanical Shaft Power',
    equipmentId: 'eq-thm-steamturbine',
    iconName: 'RotateCw',
    color: '#b91c1c'
  },
  {
    id: 'thm-stage-generator',
    stepNumber: 5,
    labelFr: 'Alternateur Synchrone Turbo (2 Pole, 3 000 tr/min)',
    labelEn: 'Turbo-Generator (2-Pole, 3000 rpm)',
    subtitleFr: 'Rotor lisse à 3 000 tr/min, refroidissement hydrogène/eau',
    subtitleEn: 'Cylindrical rotor at 3000 rpm, hydrogen/water cooled',
    voltageLevel: '20 kV',
    energyStateFr: 'Énergie Électrique Triphasée de Forte Puissance',
    energyStateEn: 'High-Power Three-Phase Bulk Electricity',
    equipmentId: 'eq-thm-generator',
    iconName: 'Zap',
    color: '#7c3aed'
  },
  {
    id: 'thm-stage-stepup',
    stepNumber: 6,
    labelFr: 'Transformateur Élévateur 20 kV / 225 kV & Évacuation',
    labelEn: 'GSU Transformer & HV Switchyard Connection',
    subtitleFr: 'Élévation 20 kV → 225 kV et injection en bande de base',
    subtitleEn: 'Voltage step-up to national 225 kV high-voltage grid',
    voltageLevel: '20 kV → 225 kV',
    energyStateFr: 'Puissance Électrique THT Évacuée',
    energyStateEn: 'Grid-Connected Extra-High Voltage Power',
    equipmentId: 'eq-thm-trafo',
    iconName: 'Radio',
    color: '#4f46e5'
  }
];

export const THERMAL_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-thm-gasturbine': {
    id: 'eq-thm-gasturbine',
    name: 'Turbine à Gaz Industrielle Heavy-Duty (Classe F)',
    nameEn: 'Heavy-Duty Industrial Gas Turbine (F-Class, 280 MW)',
    tag: 'THM-GT-01',
    category: 'mechanical',
    subsystem: 'Cycle Brayton Primaire',
    iconName: 'RotateCw',
    definition: 'Turbine à combustion interne continue à flux axial comprenant un compresseur d\'air axial multi-étages, des chambres de combustion et une turbine de détente.',
    purpose: 'Comprimer l\'air atmosphérique, brûler le gaz naturel pour atteindre 1 450°C et détendre les gaz chauds pour produire un couple mécanique puissant.',
    operatingPrinciple: 'Cycle thermodynamique de Brayton : compression isentropique, combustion à pression constante et détente isentropique dans les aubes de turbine.',
    physicalConstruction: 'Compresseur axial à 17 étages avec aubes directrices d\'entrée variables (VIGV), 16 chambres de combustion annulaires à brûleurs DLN (Dry Low NOx), turbine de détente à 4 étages en superalliages monocristallins au nickel revêtus de barrières thermiques céramiques.',
    mainComponents: ['Compresseur axial multi-étages', 'Chambres de combustion DLN à faibles émissions', 'Roue de turbine à ailettes refroidies par air interne', 'Ligne d\'échappement haute température vers la chaudière'],
    energyFlow: {
      inflow: 'Énergie chimique du gaz naturel : Débit de combustible · PCI (ex: 720 MW thermiques)',
      outflow: 'Puissance mécanique sur l\'arbre : 280 MW mécaniques + Chaleur résiduelle d\'échappement : 410 MWth à 600°C',
      lossMechanism: 'Dissipation thermique dans les fumées, rayonnement du carter, frottements mécaniques',
      efficiencyTypical: '39.0% en cycle simple / 60.5% en cycle combiné avec turbine à vapeur'
    },
    electricalRole: 'Entraîne l\'alternateur turbo à 3 000 tr/min pour générer une électricité continue et modulable.',
    mechanicalRole: 'Génère un couple moteur direct de 890 kN·m à 3 000 tr/min.',
    control: 'Système numérique de régulation Mark VIe asservissant le débit de gaz par vannes électrohydrauliques haute précision.',
    instrumentation: ['Pyromètres optiques infrarouges de mesure de température d\'aubes', 'Capteurs de flamme UV', 'Capteurs de pression acoustique de combustion'],
    protection: {
      description: 'Protection contre l\'extinction de flamme (Flameout), le pompage compresseur (Surge) et la surchauffe d\'échappement.',
      tripActions: 'Coupure d\'urgence des vannes d\'arrêt de combustible en moins de 100 millisecondes par décharge hydraulique.'
    },
    auxiliarySystems: ['Moteur de virage d\'arbre (turning gear) pour refroidissement uniforme à l\'arrêt', 'Système de dénoyage et de lavage des aubes'],
    operatingStates: {
      normal: 'Charge de base continue avec température d\'échappement à 610°C',
      starting: 'Lancement par moteur électrique jusqu\'à 800 tr/min, allumage des brûleurs, accélération autonome jusqu\'à 3 000 tr/min',
      running: 'Suivi de consigne de dispatching (rampe de 15 MW/min)',
      stopping: 'Réduction de charge, coupure combustible et bascule automatique sur vireur lent (3 tr/min) pendant 24h',
      fault: 'Trip d\'urgence avec purge de gaz à l\'azote',
      maintenance: 'Inspection boroscopique détaillée des chambres de combustion et aubes de turbine',
      isolated: 'Isole mécanique et gaz purgé'
    },
    failureModes: ['Érosion thermique et perte de barrière thermique céramique sur les aubes', 'Instabilités thermo-acoustiques de flamme (chugging)', 'Colmatage des filtres à air d\'admission'],
    safetyConsiderations: ['Atmosphère explosive ATEX en enceinte acoustique : détection permanente de méthane CH4', 'Système d\'extinction CO2 automatique'],
    maintenance: ['Visite de combustion (CI) toutes les 8 000 heures', 'Révision majeure avec changement d\'aubes chaudes toutes les 32 000 heures'],
    parameters: [
      { label: 'Puissance unitaire', symbol: 'P_gt', typicalValue: '280', unit: 'MW', significance: 'Puissance mécanique fournie à l\'alternateur' },
      { label: 'Température d\'échappement', symbol: 'T_exh', typicalValue: '610', unit: '°C', significance: 'Alimente la chaudière de récupération HRSG' },
      { label: 'Taux de compression', symbol: 'r_p', typicalValue: '18.5', unit: '-', significance: 'Rapport de pression du compresseur axial d\'air' }
    ],
    standards: ['ISO 3977 (Gas turbines - Procurement & Safety)', 'ASME PTC 22 (Gas Turbines Performance)'],
    upstreamEquipment: ['Poste de détente et filtration de gaz naturel'],
    downstreamEquipment: ['Alternateur turbo', 'Chaudière de récupération (HRSG)'],
    physicalRepresentation: 'Longue machine cylindrique carénée de 12 m logée sous une enceinte d\'insonorisation.',
    electricalRepresentation: 'Alimentation des moteurs auxiliaires de démarrage et régulateurs de vannes.',
    functionalRepresentation: 'Moteur Thermique Continu : W_net = W_turbine - W_compresseur.'
  }
};

// -------------------------------------------------------------
// 4. BIOMASS GENERATION (BIOMASSE / COGÉNÉRATION)
// -------------------------------------------------------------
export const BIOMASS_STAGES: ProcessStageNode[] = [
  {
    id: 'bio-stage-feedstock',
    stepNumber: 1,
    labelFr: 'Réception & Préparation de la Biomasse',
    labelEn: 'Biomass Handling, Chipping & Storage',
    subtitleFr: 'Broyage de résidus agricoles (bagasse, bois, coques), séchage',
    subtitleEn: 'Storage silo, magnetic separator, chipper & moisture control',
    energyStateFr: 'Énergie Chimique Renouvelable Stockée (PCI ~ 12 à 18 MJ/kg)',
    energyStateEn: 'Renewable Biomass Chemical Energy',
    equipmentId: 'eq-bio-storage',
    iconName: 'TreePine',
    color: '#16a34a'
  },
  {
    id: 'bio-stage-boiler',
    stepNumber: 2,
    labelFr: 'Chaudière à Grille ou Lit Fluidisé (BFB/CFB)',
    labelEn: 'Biomass Boiler (Grate or Fluidized Bed)',
    subtitleFr: 'Combustion thermique à 850-950°C et transfert d\'eau en vapeur',
    subtitleEn: 'Bubbling/circulating fluidized bed combustion at 850-950°C',
    energyStateFr: 'Vapeur Surchauffée Haute Pression (60 bar / 480°C)',
    energyStateEn: 'High-Pressure Superheated Steam Enthalpy',
    equipmentId: 'eq-bio-boiler',
    iconName: 'Flame',
    color: '#15803d'
  },
  {
    id: 'bio-stage-fluegas',
    stepNumber: 3,
    labelFr: 'Traitement des Fumées & Filtre à Manches',
    labelEn: 'Flue Gas Cleaning & Baghouse Filter',
    subtitleFr: 'Dépoussiérage électrostatique, injection de chaux et DeNOx SNCR',
    subtitleEn: 'Electrostatic precipitation, baghouse filtration & SNCR DeNOx',
    energyStateFr: 'Fumées Épurées Conformes aux Normes Environnementales',
    energyStateEn: 'Treated Clean Exhaust Gas & Fly Ash Collection',
    equipmentId: 'eq-bio-fluegas',
    iconName: 'Filter',
    color: '#047857'
  },
  {
    id: 'bio-stage-turbine',
    stepNumber: 4,
    labelFr: 'Turbine à Vapeur & Soutirage Cogénération',
    labelEn: 'Steam Turbine & Cogeneration Extraction',
    subtitleFr: 'Détente de vapeur dans la turbine avec soutirage industriel',
    subtitleEn: 'Multi-stage steam expansion with industrial heat extraction',
    energyStateFr: 'Puissance Mécanique + Vapeur de Procédé (Cogénération)',
    energyStateEn: 'Mechanical Shaft Torque + Process Steam',
    equipmentId: 'eq-bio-turbine',
    iconName: 'RotateCw',
    color: '#059669'
  },
  {
    id: 'bio-stage-generator',
    stepNumber: 5,
    labelFr: 'Alternateur Synchrone (11 kV)',
    labelEn: 'Synchronous Generator (11 kV, 50 Hz)',
    subtitleFr: 'Génération électrique 11 kV couplée au réducteur de vitesse',
    subtitleEn: '11 kV three-phase generation coupled to speed reduction gear',
    voltageLevel: '11 kV',
    energyStateFr: 'Énergie Électrique Renouvelable Décarbonée',
    energyStateEn: 'Three-Phase Renewable Baseload Electricity',
    equipmentId: 'eq-bio-gen',
    iconName: 'Zap',
    color: '#0d9488'
  },
  {
    id: 'bio-stage-grid',
    stepNumber: 6,
    labelFr: 'Poste Élévateur 11 kV / 33 kV ou 90 kV & Réseau',
    labelEn: 'Substation Interconnection & Evacuation',
    subtitleFr: 'Injection sur le réseau local ou autoconsommation d\'usine',
    subtitleEn: 'Connection to local medium-voltage or regional transmission grid',
    voltageLevel: '11 kV → 33 kV',
    energyStateFr: 'Énergie Injectée au Réseau Électrique',
    energyStateEn: 'Dispatched Green Baseload Energy',
    equipmentId: 'eq-bio-trafo',
    iconName: 'Radio',
    color: '#0284c7'
  }
];

export const BIOMASS_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-bio-boiler': {
    id: 'eq-bio-boiler',
    name: 'Chaudière Biomasse à Lit Fluidisé Barbotant (BFB)',
    nameEn: 'Bubbling Fluidized Bed (BFB) Biomass Boiler (60 t/h Steam)',
    tag: 'BIO-BLR-01',
    category: 'mechanical',
    subsystem: 'Génération Thermique de Vapeur',
    iconName: 'Flame',
    definition: 'Générateur de vapeur haute pression où le combustible biomasse solide broyé est injecté dans un lit de sable chaud en lévitation sous injection d\'air primaire.',
    purpose: 'Assurer une combustion complète, stable et à faibles émissions de matières végétales hétérogènes (taux d\'humidité jusqu\'à 55%) pour produire de la vapeur surchauffée.',
    operatingPrinciple: 'Fluidisation dynamique : l\'air d\'insufflation traverse un lit de sable réfractaire à une vitesse telle que les particules se comportent comme un liquide bouillant à 850°C, assurant un transfert thermique exceptionnel.',
    physicalConstruction: 'Foyer à parois étanches tubées en tubes d\'acier allié (acier au chrome-molybdène 16Mo3), grilles d\'injection de fond en acier inoxydable réfractaire, faisceaux évaporateurs, surchauffeurs radiants et convectifs, et économiseur tubulaire.',
    mainComponents: ['Lit fluidisé avec tuyères d\'air primaire', 'Système d\'alimentation biomasse à vis doseuses étanches', 'Surchauffeur de vapeur étagé avec désurchauffeur à injection d\'eau', 'Économiseur récupérateur de chaleur', 'Réchauffeur d\'air de combustion (LUVO)'],
    energyFlow: {
      inflow: 'Biomasse broyée (bagasse de canne à sucre, copeaux de bois) : 15 tonnes/h à PCI = 13 MJ/kg (~54 MW thermiques)',
      outflow: 'Vapeur surchauffée : 60 tonnes/h à 65 bar et 485°C (~45 MWth dans la vapeur)',
      lossMechanism: 'Pertes par fumées sèches, imbrûlés gazeux (CO) et imbrûlés solides dans les cendres',
      efficiencyTypical: '87.5% de rendement chaudière sur PCI'
    },
    electricalRole: 'Aucun direct ; entraîne les moteurs électriques des ventilateurs de tirage et de fluidisation 400 V.',
    mechanicalRole: 'Enceinte sous pression de 65 bar soumise à la dilatation thermique et à l\'érosion abrasive du sable.',
    control: 'Contrôle automatique du ratio air/combustible par mesure d\'O2 résiduel dans les fumées et régulation de pression de vapeur au dôme.',
    instrumentation: ['Analyseurs d\'oxygène O2 et d\'imbrûlés CO en continu', 'Capteurs de température multiples dans le lit de sable', 'Indicateurs de niveau d\'eau du ballon chaudière'],
    protection: {
      description: 'Protection contre le manque d\'eau (risque d\'explosion du dôme) par pressostats et détecteurs de niveau d\'eau indépendants de sécurité (SIL-2).',
      tripActions: 'Arrêt immédiat de l\'alimentation en combustible et ouverture des soupapes de sécurité vapeur.'
    },
    auxiliarySystems: ['Silo d\'alimentation journalier avec vis de dévoutage', 'Système de décendrage automatique sous lit et sous trémie', 'Souffleurs de suie à vapeur pour nettoyage des tubes'],
    operatingStates: {
      normal: 'Production continue de 60 t/h de vapeur surchauffée',
      starting: 'Préchauffage progressif du lit de sable par brûleur d\'appoint au fioul ou gaz',
      running: 'Alimentation continue régulée en biomasse',
      stopping: 'Consommer le combustible du lit, refroidissement lent contrôlé',
      fault: 'Manque d\'eau ou surpression : vidange de sécurité',
      maintenance: 'Remplacement des tuyères d\'air et rechargement en sable de quartz',
      isolated: 'Vidangée et consignée'
    },
    failureModes: ['Agglomération du lit de sable par réaction chimique avec les cendres de biomasse alcalines', 'Corrosion des tubes de surchauffeur par les chlorures', 'Bouchage des vis d\'alimentation'],
    safetyConsiderations: ['Risque d\'incendie et d\'explosion de poussières de bois dans les silos de stockage (normes ATEX)', 'Détection CO obligatoire'],
    maintenance: ['Contrôle d\'épaisseur des tubes d\'eau par ultrasons', 'Nettoyage chimique et détartrage intérieur'],
    parameters: [
      { label: 'Débit de vapeur surchauffée', symbol: 'Q_vapeur', typicalValue: '60', unit: 't/h', significance: 'Alimente la turbine à vapeur de 15 MW électriques' },
      { label: 'Pression de service vapeur', symbol: 'P_vap', typicalValue: '65', unit: 'bar', significance: 'Pression haute température assurant un bon rendement Rankine' },
      { label: 'Température de surchauffe', symbol: 'T_vap', typicalValue: '485', unit: '°C', significance: 'Garantit l\'absence d\'humidité dans les premiers étages turbine' }
    ],
    standards: ['EN 12952 (Water-tube boilers and auxiliary installations)', 'ASME Boiler and Pressure Vessel Code (Section I)'],
    upstreamEquipment: ['Vis d\'alimentation et trémies de dosage biomasse'],
    downstreamEquipment: ['Turbine à vapeur', 'Filtre de traitement des fumées'],
    physicalRepresentation: 'Grande tour métallique de 25 m de hauteur entourée d\'échelles et de tuyauteries calorifugées.',
    electricalRepresentation: 'Alimentation des moteurs de ventilateurs à tirage forcé et induit (2 x 160 kW).',
    functionalRepresentation: 'Générateur de Vapeur : Q_vapeur · (h_vapeur - h_eau) = η_chaudière · Q_comb · PCI.'
  }
};

// -------------------------------------------------------------
// 5. NUCLEAR POWER GENERATION (PWR / EPR)
// -------------------------------------------------------------
export const NUCLEAR_STAGES: ProcessStageNode[] = [
  {
    id: 'nuc-stage-fission',
    stepNumber: 1,
    labelFr: 'Cœur du Réacteur & Fission Nucléaire',
    labelEn: 'Reactor Core & Controlled Fission',
    subtitleFr: 'Fission induite par neutrons thermiques dans le dioxyde d\'uranium (UO2)',
    subtitleEn: 'Thermal neutron-induced fission in uranium dioxide (UO2) ceramic fuel pellets',
    energyStateFr: 'Énergie de Liaison Nucléaire : E = Δm · c² (200 MeV par fission)',
    energyStateEn: 'Nuclear Binding Energy: E = Δm · c² (200 MeV per fission event)',
    equipmentId: 'eq-nuc-core',
    iconName: 'Atom',
    color: '#8b5cf6'
  },
  {
    id: 'nuc-stage-steam-gen',
    stepNumber: 2,
    labelFr: 'Circuit Primaire & Générateurs de Vapeur',
    labelEn: 'Primary Coolant Loop & Steam Generation',
    subtitleFr: 'Eau pressurisée à 155 bar / 325 °C transférant la chaleur aux tubes en U',
    subtitleEn: 'Pressurized water at 155 bar / 325 °C transferring thermal energy via U-tubes',
    energyStateFr: 'Chaleur Sensible & Enthalpie Fluide : Q_th = m_dot · Cp · ΔT (4 500 MWth)',
    energyStateEn: 'High-Temperature Fluid Enthalpy: Q_th = m_dot · Cp · ΔT (4,500 MWth)',
    equipmentId: 'eq-nuc-steam-generator',
    iconName: 'Waves',
    color: '#6366f1'
  },
  {
    id: 'nuc-stage-turbine',
    stepNumber: 3,
    labelFr: 'Détente Turbines Vapeur HP & BP',
    labelEn: 'Steam Turbines Expansion (HP & LP)',
    subtitleFr: 'Vapeur saturée à 70 bar détendue dans les corps HP et multi-corps BP',
    subtitleEn: 'Saturated steam at 70 bar expanded through HP and multi-casing LP cylinders',
    energyStateFr: 'Couple Mécanique d\'Arbre : P_méc = ω · T_arbre (1 500 tr/min)',
    energyStateEn: 'Rotational Shaft Mechanical Torque: P_mech = ω · T_shaft (1,500 rpm)',
    equipmentId: 'eq-nuc-turbine',
    iconName: 'RotateCw',
    color: '#3b82f6'
  },
  {
    id: 'nuc-stage-generator',
    stepNumber: 4,
    labelFr: 'Alternateur Synchrone 4 Pôles (1 500 tr/min)',
    labelEn: '4-Pole Nuclear Synchronous Alternator',
    subtitleFr: 'Rotor massif à pôles lisses refroidi à l\'H2 sous pression et stator à eau',
    subtitleEn: 'Massive cylindrical rotor cooled by pressurized H2 and water-cooled stator',
    voltageLevel: '24 kV / 50 Hz',
    energyStateFr: 'Puissance Électrique Triphasée : S = √3 · U · I (1 650 MWe / 1 900 MVA)',
    energyStateEn: 'Three-Phase Synchronous AC Power: S = √3 · U · I (1,650 MWe / 1,900 MVA)',
    equipmentId: 'eq-nuc-generator',
    iconName: 'Zap',
    color: '#06b6d4'
  },
  {
    id: 'nuc-stage-condenser',
    stepNumber: 5,
    labelFr: 'Condenseur Sous Vide & Source Froide',
    labelEn: 'Surface Condenser & Heat Sink',
    subtitleFr: 'Recondensation de la vapeur à 0.05 bar par échange avec fleuve ou aéroréfrigérant',
    subtitleEn: 'Steam condensation at 0.05 bar via river/seawater or natural draft cooling tower',
    energyStateFr: 'Rejet Thermique & Fermeture Cycle Rankine : Q_rejet (3 000 MWth)',
    energyStateEn: 'Thermal Heat Rejection & Closed Rankine Cycle Loop: Q_reject (3,000 MWth)',
    equipmentId: 'eq-nuc-condenser',
    iconName: 'Layers',
    color: '#0284c7'
  },
  {
    id: 'nuc-stage-gsu',
    stepNumber: 6,
    labelFr: 'Évacuation THT 400 kV & 4 Barrières de Sûreté',
    labelEn: '400 kV EHV Evacuation & 4 Safety Barriers',
    subtitleFr: 'Transformateur GSU 24/400 kV et disjoncteur SF6 injectant sur l\'épine dorsale THT',
    subtitleEn: 'GSU 24/400 kV transformer and SF6 breaker injecting onto bulk transmission grid',
    voltageLevel: '24 kV → 400 kV',
    energyStateFr: 'Inertie Synchrone Réseau Massive : Constante H = 5.5 s (1 650 MWe fermes)',
    energyStateEn: 'Massive Grid Synchronous Inertia: Inertia Constant H = 5.5 s (1,650 MWe base)',
    equipmentId: 'eq-nuc-gsu',
    iconName: 'ShieldCheck',
    color: '#10b981'
  }
];

export const NUCLEAR_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-nuc-core': {
    id: 'eq-nuc-core',
    name: 'Cœur du Réacteur PWR & Cuve Sous Pression (155 bar)',
    nameEn: 'Pressurized Water Reactor Core & RPV (155 bar)',
    tag: 'NUC-RPV-01',
    category: 'mechanical',
    subsystem: 'Chaudière Nucléaire NSSS',
    iconName: 'Atom',
    definition: 'Enceinte en acier forgé de 250 mm d\'épaisseur contenant 241 assemblages de combustible nucléaire à l\'oxyde d\'uranium enrichi (3 à 5% U-235) et les grappes de commande.',
    purpose: 'Initier, maintenir et contrôler la réaction de fission nucléaire en chaîne pour générer 4 500 MW de puissance thermique continue.',
    operatingPrinciple: 'Fission des noyaux fissiles 235U par des neutrons thermiques libérant 200 MeV par réaction, modérés et refroidis par l\'eau légère sous 155 bar.',
    physicalConstruction: 'Cuve forgée en acier 16MND5 sans soudures longitudinales, revêtement interne en acier inoxydable austenitique de 7 mm contre la corrosion, couvercle amovible boulonné par 60 goujons hydrauliques.',
    mainComponents: ['241 assemblages combustibles UO2 (gaine Zircaloy-4 / M5)', '89 grappes de commande absorbantes (B4C et AIC)', 'Pressuriseur à cannes chauffantes (155 bar)', 'Instrumentation neutronique en cœur et hors cœur'],
    energyFlow: {
      inflow: 'Énergie de liaison nucléaire libérée par fission continue des noyaux U-235',
      outflow: 'Puissance thermique du fluide primaire : Q_th = 4 500 MWth à 325 °C',
      lossMechanism: 'Pertes thermiques pariétales négligeables (< 0.1%), échauffement gamma absorbé dans les structures',
      efficiencyTypical: 'Rendement de libération d\'énergie neutronique > 99.8%'
    },
    electricalRole: 'Source thermique primaire alimentant le cycle thermodynamique. Les mécanismes de commande de grappes (RGL) sont alimentés par des onduleurs de sécurité 220 Vcc / 400 Vca non interruptibles.',
    mechanicalRole: 'Résiste à une pression de service de 155 bar, à une température de 325 °C et au flux neutronique rapide pendant 60 ans.',
    control: 'Contrôle réactif par déplacement des grappes de commande (barres de régulation et barres d\'arrêt) et ajustement de la concentration en acide borique soluble dans le circuit primaire.',
    instrumentation: ['Chambres d\'ionisation hors cœur (gammes source, intermédiaire et puissance)', 'Thermocouples en sortie de cœur (température coeur)', 'Capteurs de pression et de niveau du pressuriseur'],
    protection: {
      description: 'Système d\'arrêt d\'urgence du réacteur (SCRAM / AU) par chute gravitaire instantanée de toutes les grappes de commande en moins de 2.2 secondes sur dépassement de flux neutronique, surpression ou déséquilibre thermique.',
      tripActions: 'Coupure de l\'alimentation des électro-aimants de maintien des grappes ; insertion gravitaire immédiate ; injection de sécurité haute pression (ISMP) si fuite primaire.'
    },
    auxiliarySystems: ['Circuit de contrôle volumétrique et chimique (RCV)', 'Circuit de refroidissement à l\'arrêt (RRA)', 'Circuit d\'injection de sécurité (RIS) à 4 trains indépendants redondants (4 x 100%)'],
    operatingStates: {
      normal: 'Palier de pleine puissance à 100% Pn en régime stationnaire stable',
      starting: 'Divergence neutronique contrôlée, montée en criticité et montée en puissance progressive (5%/h)',
      running: 'Suivi de charge possible entre 50% et 100% de puissance nominale',
      stopping: 'Insertion des grappes de puissance, puis grappes d\'arrêt, borication du primaire',
      fault: 'Arrêt d\'urgence automatique (SCRAM) et maintien du refroidissement de repli',
      maintenance: 'Arrêt pour rechargement du tiers du combustible tous les 18 mois',
      isolated: 'Cuve ouverte, cœur déchargé en piscine de désactivation sous 10 m d\'eau boriquée'
    },
    failureModes: ['Rupture de tuyauterie primaire (APRP / LOCA)', 'Blocage d\'une grappe de commande en position haute', 'Fuite d\'un tube de générateur de vapeur (RTGV)'],
    safetyConsiderations: ['Quatre barrières de sûreté étanches : 1. Pastille UO2, 2. Gaine Zircaloy, 3. Circuit primaire sous pression, 4. Enceinte de confinement double paroi', 'Alimentations électriques de secours par 4 diesels d\'ultime secours bunkérisés'],
    maintenance: ['Contrôle non destructif par ultrasons de la cuve et des piquages tous les 10 ans (Visite Décennale)', 'Remplacement périodique des assemblages usés'],
    parameters: [
      { label: 'Puissance thermique du cœur', symbol: 'P_th', typicalValue: '4 500', unit: 'MWth', significance: 'Permet de générer 1 650 MWe nets à l\'alternateur' },
      { label: 'Pression nominale primaire', symbol: 'P_prim', typicalValue: '155', unit: 'bar', significance: 'Maintient l\'eau liquide à 325 °C sans ébullition en cœur' },
      { label: 'Température moyenne du cœur', symbol: 'T_moy', typicalValue: '310', unit: '°C', significance: 'Température entrée 295 °C, sortie cuve 328 °C' }
    ],
    standards: ['RCC-M (Règles de Conception et de Construction des Matériels Mécaniques des Îlots Nucléaires)', 'AIEA SSR-2/1 (Safety of Nuclear Power Plants: Design)', 'ASME Section III (Nuclear Facility Components)'],
    upstreamEquipment: ['Combustible nucléaire UO2 enrichi', 'Eau déminéralisée boriquée d\'appoint'],
    downstreamEquipment: ['Générateurs de vapeur', 'Pressuriseur', 'Pompes primaires'],
    physicalRepresentation: 'Cuve cylindrique massive en acier de 13 m de hauteur et 5 m de diamètre logée au fond du puits de cuve en béton lourd.',
    electricalRepresentation: 'Alimentation des 89 mécanismes de commande de grappes (bobines électromagnétiques 400 V).',
    functionalRepresentation: 'Bilan Neutronique & Thermique : P_th = Σ_fission · Φ_neutrons · V_coeur · E_fiss.'
  },
  'eq-nuc-steam-generator': {
    id: 'eq-nuc-steam-generator',
    name: 'Générateurs de Vapeur à Tubes en U (GV / Steam Generators)',
    nameEn: 'Vertical U-Tube Steam Generator (155 bar to 70 bar)',
    tag: 'NUC-SG-01/04',
    category: 'mechanical',
    subsystem: 'Boucle d\'Échange Primaire / Secondaire',
    iconName: 'Waves',
    definition: 'Échangeur thermique vertical géant de 22 m de hauteur et 500 tonnes séparant le circuit primaire radioactif du circuit secondaire vapeur.',
    purpose: 'Transférer la chaleur de l\'eau primaire (325 °C, 155 bar) à l\'eau secondaire pour produire de la vapeur saturée sèche à 70 bar sans contamination radioactive.',
    operatingPrinciple: 'L\'eau primaire circule à l\'intérieur de 6 000 tubes en U en alliage Inconel 690 étanches, tandis que l\'eau secondaire bout à l\'extérieur des tubes en calandre sous 70 bar.',
    physicalConstruction: 'Plaque tubulaire en acier forgé de 600 mm d\'épaisseur forée pour 6 000 tubes Inconel 690TT résistants à la corrosion sous contrainte, séparateurs d\'eau centrifuges et sécheurs à chevrons intégrés en dôme supérieur.',
    mainComponents: ['Faisceau tubulaire en Inconel 690 (6 000 tubes)', 'Plaque tubulaire forgée', 'Séparateurs cycloniques de vapeur', 'Anneau de distribution d\'eau alimentaire'],
    energyFlow: {
      inflow: 'Chaleur sensible de l\'eau primaire : 1 125 MWth par générateur de vapeur (4 GV pour 4 500 MWth)',
      outflow: 'Débit de vapeur saturée sèche : 2 400 t/h par GV à 70 bar / 285 °C vers la turbine',
      lossMechanism: 'Résistance thermique de conduction des parois de tubes, perte de charge fluide',
      efficiencyTypical: 'Efficacité d\'échange thermique > 98.5%'
    },
    electricalRole: 'Deuxième barrière de sûreté physique séparant l\'eau activée du circuit secondaire.',
    mechanicalRole: 'Frontière de pression entre le primaire (155 bar) et le secondaire (70 bar).',
    control: 'Régulation automatique à 3 éléments du niveau d\'eau du GV : mesure du niveau d\'eau, du débit de vapeur et du débit d\'eau alimentaire.',
    instrumentation: ['Mesures de niveau d\'eau à large et étroite gamme', 'Débitmètres venturi de vapeur', 'Détecteurs d\'activité azote-16 (N-16) pour détection ultra-précoce de microfuite tube'],
    protection: {
      description: 'Soupapes de sûreté de surpression secondaire (ASG/VVP) et vannes d\'isolement vapeur rapide (VIV) en moins de 3 secondes en cas de rupture de tuyauterie.',
      tripActions: 'Fermeture des vannes d\'isolement de vapeur et démarrage de l\'alimentation de secours en eau des générateurs de vapeur (ASG) par motopompes diesel dédiées.'
    },
    auxiliarySystems: ['Système de purge continue du fond de GV pour éliminer les boues de magnétite', 'Alimentation de secours des GV (ASG)'],
    operatingStates: {
      normal: 'Production continue de 2 400 t/h de vapeur par GV à 70 bar',
      starting: 'Montée en température et mise sous pression progressive par recirculation',
      running: 'Équilibre parfait débit vapeur produite = débit eau alimentaire injectée',
      stopping: 'Évacuation de la puissance résiduelle par contournement vapeur au condenseur',
      fault: 'Rupture de tube (RTGV) : isolement immédiat du GV défaillant',
      maintenance: 'Inspection télévisuelle et par courants de Foucault des 6 000 tubes',
      isolated: 'Isolé côté primaire et secondaire'
    },
    failureModes: ['Corrosion sous contrainte des tubes', 'Vibration des tubes sous l\'écoulement diphasique provoquant une usure par frottement', 'Entartrage de la plaque tubulaire'],
    safetyConsiderations: ['Constitue la barrière entre fluide actif et non actif. Teneur en humidité de vapeur en sortie < 0.25% pour préserver les aubes de turbine.'],
    maintenance: ['Bouchage préventif des tubes fissurés par dudgeonnage de bouchons mécaniques', 'Lavage chimique haute pression des boues de fond de cuve'],
    parameters: [
      { label: 'Débit de vapeur unitaire', symbol: 'Q_vap', typicalValue: '2 400', unit: 't/h', significance: 'Soit près de 10 000 t/h au total alimentant le groupe turbo-alternateur' },
      { label: 'Pression vapeur secondaire', symbol: 'P_sec', typicalValue: '70', unit: 'bar', significance: 'Pression de vapeur saturée sèche à 285 °C' },
      { label: 'Nombre de générateurs de vapeur', symbol: 'N_GV', typicalValue: '4', unit: 'unités', significance: 'Configuration 4 boucles standard EPR / 1 650 MWe' }
    ],
    standards: ['RCC-M Tome I (Matériels de niveau 1)', 'ASME Section III Division 1 Subsection NB', 'CEI 61513 (Instrumentation and control for systems important to safety)'],
    upstreamEquipment: ['Cœur du réacteur', 'Pompes primaires de circulation (4 x 7 MW)'],
    downstreamEquipment: ['Lignes de vapeur vive (VVP)', 'Corps haute pression de la turbine'],
    physicalRepresentation: 'Gigantesque bouteille verticale conique blanche de 22 m de haut dominant le bâtiment réacteur.',
    electricalRepresentation: 'Alimentation des vannes motorisées de régulation et pompes de purge.',
    functionalRepresentation: 'Bilan d\'Échange Thermique : Q_prim · (h_chaud - h_froid) = Q_sec · (h_vap - h_eau_alim).'
  },
  'eq-nuc-turbine': {
    id: 'eq-nuc-turbine',
    name: 'Groupe Turbo-Alternateur Vapeur Nucléaire (HP + 3 BP)',
    nameEn: 'Nuclear Steam Turbine Train (Single HP + Triple Double-Flow LP)',
    tag: 'NUC-TURB-01',
    category: 'mechanical',
    subsystem: 'Salle des Machines & Conversion Thermomécanique',
    iconName: 'RotateCw',
    definition: 'Ligne d\'arbres de 70 m de long tournant à 1 500 tr/min, composée d\'un corps haute pression (HP) à double flux et de trois corps basse pression (BP) à double flux avec des aubes titane de 1.8 m de long.',
    purpose: 'Convertir l\'énergie enthalpique de la vapeur saturée (10 000 t/h à 70 bar) en énergie cinétique rotationnelle puis en couple mécanique sur l\'arbre de l\'alternateur.',
    operatingPrinciple: 'Détente de la vapeur à travers des aubages fixes (distributeurs) et mobiles (roues), séchage intermédiaire et surchauffe à mi-détente (MSR) pour éviter l\'érosion par gouttelettes d\'eau.',
    physicalConstruction: 'Rotors forgés monoblocs en acier allié de 120 tonnes chacun, aubages de dernier étage BP en alliage de titane résistant à la force centrifuge extrême, paliers lisses hydrodynamiques sous film d\'huile sous pression.',
    mainComponents: ['Corps HP double flux', 'Deux sécheurs-surchauffeurs intermédiaires (MSR)', 'Trois corps BP double flux', 'Ligne d\'arbres rigide accouplée de 70 mètres', 'Système de virage mécanique lent'],
    energyFlow: {
      inflow: 'Débit total de vapeur : 2 700 kg/s à 70 bar / 285 °C (enthalpie h = 2 770 kJ/kg)',
      outflow: 'Couple mécanique sur l\'arbre : P_méc = 1 700 MWméc à 1 500 tr/min (vapeur détendue à 0.05 bar)',
      lossMechanism: 'Pertes par condensation humide interne, frottements aérodynamiques, pertes aux paliers mécaniques',
      efficiencyTypical: 'Rendement isentropique turbine : 88% à 91%'
    },
    electricalRole: 'Entraîne directement le rotor de l\'alternateur à la vitesse synchrone exacte de 1 500 tr/min (50 Hz).',
    mechanicalRole: 'Développe un couple d\'arbre titanesque de plus de 10 800 000 N·m en régime nominal continu.',
    control: 'Régulateur électro-hydraulique de vitesse et de puissance (TCS) commandant 4 soupapes d\'admission HP et 4 soupapes d\'interception BP avec temps de fermeture < 150 ms.',
    instrumentation: ['Mesures de vibration des arbres par capteurs de proximité sans contact (Bently Nevada)', 'Capteurs de vitesse à roues dentées magnétiques (redondance 2oo3)', 'Mesures de dilatation différentielle rotor/stator'],
    protection: {
      description: 'Déclenchement d\'urgence turbine par fermeture ultra-rapide des soupapes d\'admission sur survitesse (> 108% Nn), perte d\'huile de graissage, vide condenseur dégradé ou vibrations excessives.',
      tripActions: 'Fermeture des soupapes HP/BP en 120 ms et ouverture automatique du contournement vapeur vers le condenseur.'
    },
    auxiliarySystems: ['Centrale d\'huile de graissage et d\'huile de régulation haute pression (160 bar)', 'Système de vide condenseur par éjecteurs et pompes à anneau liquide', 'Dispositif de virage lent (60 tr/min) pour éviter le flambage thermique à l\'arrêt'],
    operatingStates: {
      normal: 'Rotation synchrone à 1 500 tr/min développant 1 700 MW mécaniques',
      starting: 'Réchauffage des corps, montée en vitesse progressive par paliers critiques',
      running: 'Fonctionnement régulé en puissance ou réglage primaire de fréquence réseau',
      stopping: 'Déclenchement, ralentissement inertiel sur 45 minutes puis passage sur virageur',
      fault: 'Déclenchement d\'urgence survitesse ou rupture d\'huile',
      maintenance: 'Dévirage, ouverture des corps de turbine et contrôle magnétoscopique des aubages',
      isolated: 'Ligne d\'arbre arrêtée et refroidie'
    },
    failureModes: ['Rupture d\'aube basse pression sous contrainte centrifuge et fatigue vibratoire', 'Instabilité de film d\'huile palier (oil whirl / whip)', 'Flambage thermique de l\'arbre en cas d\'arrêt du virageur'],
    safetyConsiderations: ['Vitesse périphérique en bout d\'aube BP supérieure à la vitesse du son (Mach 1.4) ; énergie cinétique de rotation de plusieurs gigajoules protégée par des blindages de carter.'],
    maintenance: ['Équilibrage dynamique in situ de la ligne d\'arbre', 'Contrôle gammagraphique et ressuage des disques frettés'],
    parameters: [
      { label: 'Puissance mécanique nominale', symbol: 'P_méc', typicalValue: '1 700', unit: 'MW', significance: 'Permet de délivrer 1 650 MWe nets au réseau électrique' },
      { label: 'Vitesse de rotation synchrone', symbol: 'N', typicalValue: '1 500', unit: 'tr/min', significance: 'Machine 4 pôles pour réseau 50 Hz (1 800 tr/min en 60 Hz)' },
      { label: 'Longueur de l\'aubage final BP', symbol: 'L_aube', typicalValue: '1 830', unit: 'mm', significance: 'Aube géante en alliage de titane à balayage optimal sous vide poussé' }
    ],
    standards: ['CEI 60045-1 (Steam turbines - Specifications)', 'ISO 10816-2 (Mechanical vibration - Land-based steam turbines and generators)'],
    upstreamEquipment: ['Générateurs de vapeur (vapeur vive 70 bar)'],
    downstreamEquipment: ['Alternateur synchrone 4 pôles', 'Condenseur de surface'],
    physicalRepresentation: 'Immense ligne de machines carénées en gris et bleu de 70 m de long sur socle béton anti-sismique en salle des machines.',
    electricalRepresentation: 'Alimentation des motopompes à huile de graissage secourues sur batterie 220 Vcc.',
    functionalRepresentation: 'Détente Thermodynamique : P_méc = Q_vapeur · (h_admission - h_échappement) · η_isentropique.'
  },
  'eq-nuc-generator': {
    id: 'eq-nuc-generator',
    name: 'Alternateur Synchrone Nucléaire 4 Pôles (1 900 MVA / 24 kV)',
    nameEn: '4-Pole Nuclear Synchronous Alternator (1,900 MVA / 24 kV)',
    tag: 'NUC-ALT-01',
    category: 'electromagnetic',
    subsystem: 'Conversion Électromécanique Synchrone',
    iconName: 'Zap',
    definition: 'Le plus puissant générateur électrique au monde : alternateur synchrone triphasé 4 pôles à rotor lisse de 240 tonnes tournant à 1 500 tr/min.',
    purpose: 'Convertir le couple mécanique de la turbine en puissance électrique triphasée synchrone de 1 650 MW sous 24 kV avec une contribution majeure à l\'inertie synchrone du réseau.',
    operatingPrinciple: 'Induction électromagnétique de Faraday : un champ magnétique continu rotorique tournant induit dans l\'enroulement statorique triphasé distribué un système de tensions sinusoïdales équilibrées 24 kV / 50 Hz.',
    physicalConstruction: 'Rotor monobloc forgé en acier Ni-Cr-Mo, enroulements rotoriques en cuivre à l\'argent refroidis par circulation directe d\'hydrogène gazeux sous 5 bar (H2), stator bobiné à barres Roebel refroidies par eau déminéralisée circulant à l\'intérieur des conducteurs creux.',
    mainComponents: ['Stator avec circuit magnétique en tôles au silicium à faibles pertes', 'Barres statoriques Roebel à conducteurs creux refroidis à l\'eau', 'Rotor lisse 4 pôles refroidi à l\'hydrogène sous 5 bar', 'Système d\'excitation sans balais (brushless) ou statique par ponts thyristors', 'Traversées haute tension isolées SF6 ou huile'],
    energyFlow: {
      inflow: 'Puissance mécanique d\'arbre : P_méc = 1 700 MW à 1 500 tr/min',
      outflow: 'Puissance électrique apparente : S_n = 1 900 MVA sous 24 kV (1 650 MW actifs à cos φ = 0.87)',
      lossMechanism: 'Pertes par effet Joule stator et rotor, pertes fer (hystérésis et courants de Foucault), pertes par ventilation H2',
      efficiencyTypical: 'Rendement exceptionnel : 98.9% à 99.1%'
    },
    electricalRole: 'Générateur synchrone de référence (slack/PV node) fournissant puissance active et réglage de tension/puissance réactive (± 600 Mvar) pour le maintien de l\'équilibre dynamique du réseau.',
    mechanicalRole: 'Rotor de 240 tonnes apportant une énergie cinétique stockée considérable : Constante d\'inertie H = 5.5 s (plus de 9 000 MW·s d\'énergie cinétique stabilisatrice de fréquence).',
    control: 'Régulateur Automatique de Tension (AVR) numérique redondant 2oo3 contrôlant le courant d\'excitation rotorique (If jusqu\'à 8 000 A) avec stabilisateur de puissance système (PSS) anti-oscillations.',
    instrumentation: ['Sondes de température PT100 réparties dans les encoches statoriques', 'Capteurs de pureté et de pression d\'hydrogène H2', 'Détecteurs de décharges partielles en ligne', 'Fluxmètres d\'entrefer'],
    protection: {
      description: 'Protection multifonctionnelle numérique différentielle alternateur (ANSI 87G), perte d\'excitation (ANSI 40), masse stator 100% troisième harmonique (ANSI 64S), déséquilibre courant inverse (ANSI 46) et puissance inverse (ANSI 32R).',
      tripActions: 'Déclenchement instantané du disjoncteur de groupe, désexcitation rapide par ouverture du disjoncteur de champ et arrêt d\'urgence turbine.'
    },
    auxiliarySystems: ['Centrale de refroidissement eau déminéralisée stator (stator water cooling)', 'Centrale de séchage et de régulation de pureté hydrogène H2 (> 98% de pureté pour éviter tout mélange explosif)', 'Système d\'étanchéité d\'arbre par film d\'huile à double bague (seal oil)'],
    operatingStates: {
      normal: 'Production continue de 1 650 MWe synchronisée au réseau 400 kV à cos φ = 0.90',
      starting: 'Montée en vitesse à vide, excitation progressive et synchronisation automatique par synchrocoupleur',
      running: 'Exploitation dans les limites de la courbe de capabilité PQ (limite thermique stator, rotor et stabilité d\'angle)',
      stopping: 'Baisse de charge progressive, déconnexion du disjoncteur de groupe, désexcitation',
      fault: 'Déclenchement instantané sur défaut interne ou anomalie réseau sévère',
      maintenance: 'Inertage de l\'alternateur au CO2 puis à l\'air pour visites d\'inspection',
      isolated: 'Arrêté sous atmosphère d\'air sec'
    },
    failureModes: ['Court-circuit entre spires ou défaut à la masse de barre statorique', 'Perte d\'étanchéité huile d\'arbre provoquant une fuite d\'hydrogène', 'Échauffement excessif par déséquilibre de phases (courant inverse I2)'],
    safetyConsiderations: ['Atmosphère d\'hydrogène explosive : maintien strict de la pureté > 98% H2 et balayage obligatoire au CO2 avant tout contact avec l\'air ambiant.'],
    maintenance: ['Contrôle d\'isolement diélectrique et mesure du facteur de dissipation tg δ', 'Contrôle robotisé de l\'entrefer et du serrage des cales d\'encoche'],
    parameters: [
      { label: 'Puissance apparente assignée', symbol: 'S_n', typicalValue: '1 900', unit: 'MVA', significance: 'Permet de délivrer 1 650 MW actifs avec une réserve de 600 Mvar réactifs' },
      { label: 'Tension assignée statorique', symbol: 'U_n', typicalValue: '24 000', unit: 'V (24 kV)', significance: 'Courant nominal statorique colossal de près de 45 700 A par phase' },
      { label: 'Courant nominal de phase', symbol: 'I_n', typicalValue: '45 700', unit: 'A', significance: 'Nécessite des gaines barres blindées à phase isolée (IPB) de 1.5 m de diamètre' }
    ],
    standards: ['CEI 60034-1 (Rotating electrical machines - Rating and performance)', 'CEI 60034-3 (Specific requirements for synchronous generators driven by steam turbines)', 'IEEE C50.13 (Requirements for 50 Hz and 60 Hz Cylindrical-Rotor Synchronous Generators)'],
    upstreamEquipment: ['Turbine à vapeur HP/BP (accouplement mécanique direct)', 'Pont d\'excitation thyristors'],
    downstreamEquipment: ['Gaines barres blindées à phase isolée (IPB 24 kV)', 'Disjoncteur générateur (GCB)', 'Transformateur élévateur GSU 24/400 kV'],
    physicalRepresentation: 'Immense cylindre bleu/gris de 15 m de long et 4.5 m de diamètre entouré de tuyauteries d\'eau de refroidissement et gaines barres dorées.',
    electricalRepresentation: 'Alternateur synchrone triphasé couplé en étoile avec neutre relié à la terre par transformateur de distribution ou résistance NGR.',
    functionalRepresentation: 'Équation Électromécanique : P = (E · V / X_d) · sin(δ) ; J · (dω/dt) = T_méc - T_élec.'
  },
  'eq-nuc-condenser': {
    id: 'eq-nuc-condenser',
    name: 'Condenseur de Surface Sous Vide & Aéroréfrigérant',
    nameEn: 'Surface Condenser & Natural Draft Cooling Tower',
    tag: 'NUC-COND-01',
    category: 'auxiliary',
    subsystem: 'Source Froide & Clôture du Cycle Rankine',
    iconName: 'Layers',
    definition: 'Échangeur de chaleur colossal sous vide poussé (0.05 bar) situé directement sous les corps BP de turbine, composé de 50 000 tubes en titane balayés par 60 m³/s d\'eau de refroidissement.',
    purpose: 'Condenser instantanément la vapeur détendue sortant de la turbine pour créer un vide poussé augmentant considérablement le rendement thermodynamique du cycle.',
    operatingPrinciple: 'L\'eau de refroidissement froide (15 à 25 °C) circule dans les tubes en titane ; la vapeur détendue se condense à leur contact sous 33 °C et 0.05 bar absolu, créant un appel de vide continu.',
    physicalConstruction: 'Calandre mécano-soudée sous vide de 30 m de long et 15 m de hauteur avec tubes en titane résistants à l\'eau de mer ou à l\'eau de rivière, raccordée à une tour aéroréfrigérante en béton armé hyperboloïde de 165 m de haut.',
    mainComponents: ['Calandre sous vide en acier', '50 000 tubes en titane ou laiton d\'aluminium', 'Pompes d\'extraction des condensats (3 x 50%)', 'Éjecteurs de vide et pompes d\'extraction des gaz incondensables', 'Tour aéroréfrigérante à tirage naturel'],
    energyFlow: {
      inflow: 'Vapeur d\'échappement BP : 2 000 kg/s à 0.05 bar / 33 °C',
      outflow: 'Eau condensée (condensats) renvoyée vers les réchauffeurs à 33 °C',
      lossMechanism: 'Rejet thermique vers la source froide : Q_rejet ≈ 2 800 MWth évacués dans l\'atmosphère par évaporation ou dans le fleuve',
      efficiencyTypical: 'Établit le point froid optimal du cycle de Carnot'
    },
    electricalRole: 'Aucun rôle électrique direct ; ses pompes de circulation d\'eau (3 x 12 MW sous 6.6 kV) constituent l\'un des plus gros consommateurs auxiliaires de la tranche.',
    mechanicalRole: 'Supporte le vide poussé sans implosion et recueille les condensats dégazés.',
    control: 'Régulation du niveau d\'eau dans le puits chaud du condenseur et maintien du vide par extraction continue de l\'air et des incondensables.',
    instrumentation: ['Vacuomètres de haute précision à membrane absolue', 'Conductimètres en ligne pour détection immédiate de prise d\'eau brute (fuite de tube)', 'Sondes thermométriques en nappe'],
    protection: {
      description: 'Déclenchement immédiat de la turbine sur perte de vide (pression supérieure à 0.25 bar absolu) pour éviter l\'échauffement destructeur des aubages basse pression.',
      tripActions: 'Ouverture des casseurs de vide, arrêt turbine et fermeture des vannes d\'extraction.'
    },
    auxiliarySystems: ['Système de nettoyage continu des tubes par circulation de billes élastomères (système Taprogge)', 'Centrale de chloration ou traitement biocide de l\'eau de refroidissement'],
    operatingStates: {
      normal: 'Maintien continu d\'une pression absolue de 0.045 à 0.055 bar',
      starting: 'Mise sous vide préalable par pompes d\'amorçage avant admission de vapeur',
      running: 'Condensation stable absorbant 2 800 MWth',
      stopping: 'Casse du vide contrôlée après arrêt de la turbine',
      fault: 'Perte de débit d\'eau de circulation ou rupture de tube : isolement d\'une demi-caisse',
      maintenance: 'Détartrage et contrôle d\'étanchéité par gaz traceur hélium',
      isolated: 'Vidangé côté eau et aéré'
    },
    failureModes: ['Pollution des condensats par pénétration d\'eau brute (perforation de tube)', 'Perte de vide par entrée d\'air sur les joints d\'arbre turbine', 'Encrassement biologique des faisceaux tubulaires'],
    safetyConsiderations: ['Risque d\'implosion sous dépression extrême ; surveillance continue de la qualité chimique de l\'eau (chimie all-volatile treatment AVT).'],
    maintenance: ['Rebouchage des tubes corrodés', 'Inspection annuelle des diffuseurs d\'eau de l\'aéroréfrigérant'],
    parameters: [
      { label: 'Pression absolue de fonctionnement', symbol: 'P_cond', typicalValue: '0.05', unit: 'bar abs', significance: 'Garantit la détente maximale de la vapeur jusqu\'à 33 °C' },
      { label: 'Débit d\'eau de circulation', symbol: 'Q_circ', typicalValue: '60', unit: 'm³/s', significance: 'Débit d\'eau colossal pompé pour évacuer les 2 800 MW thermiques' },
      { label: 'Hauteur de la tour aéroréfrigérante', symbol: 'H_tour', typicalValue: '165', unit: 'm', significance: 'Génère un tirage naturel thermique puissant sans ventilateur électrique' }
    ],
    standards: ['HEI Standards for Steam Surface Condensers', 'ASME PTC 12.2 (Steam Surface Condensers)'],
    upstreamEquipment: ['Échappement des 3 corps basse pression de la turbine'],
    downstreamEquipment: ['Pompes d\'extraction des condensats', 'Poste d\'eau (bâche dégazante et réchauffeurs)'],
    physicalRepresentation: 'Structure parallélépipédique métallique gigantesque installée sous la turbine au niveau du sol de la salle des machines.',
    electricalRepresentation: 'Alimentation des 3 moteurs 6.6 kV des pompes de circulation d\'eau (3 x 12 000 kW).',
    functionalRepresentation: 'Bilan Thermodynamique Condensat : Q_rejet = Q_vapeur · h_fg_eau(P_vide).'
  },
  'eq-nuc-gsu': {
    id: 'eq-nuc-gsu',
    name: 'Transformateur Élévateur Principal GSU (3 x 650 MVA - 24/400 kV)',
    nameEn: 'Generator Step-Up (GSU) Transformer Bank (3 x 650 MVA - 24/400 kV)',
    tag: 'NUC-GSU-01',
    category: 'transformer',
    subsystem: 'Évacuation Haute Tension & Interconnexion Réseau',
    iconName: 'ShieldCheck',
    definition: 'Banc triphasé de trois transformateurs monophasés géants (3 x 650 MVA) ou bloc triphasé 2 000 MVA élevant la tension de génération de 24 kV à 400 kV THT.',
    purpose: 'Évacuer la puissance totale de la tranche (1 650 MW) sur le réseau de grand transport 400 kV avec le minimum de pertes Joule, tout en assurant l\'isolement galvanique.',
    operatingPrinciple: 'Induction électromagnétique mutuelle de Faraday à flux forcé dans un circuit magnétique en tôles à grains orientés de haute perméabilité.',
    physicalConstruction: 'Cuve blindée étanche remplie d\'huile minérale isolante et refroidissante (ODAF / OFAF), enroulements cuivre transposés continus (CTC) résistant aux efforts électrodynamiques de court-circuit, traversées condensateur 400 kV à porcelaine ou composite.',
    mainComponents: ['Cuve principale avec conservateur d\'huile sous membrane', 'Enroulements BT 24 kV (bobinés pour 46 000 A) et HT 400 kV', 'Traversées 400 kV avec réducteurs de courant tores intégrés', 'Aéroréfrigérants huile/air forcés (OFAF)', 'Relais Buchholz et détecteurs d\'anomalie de gaz sous huile'],
    energyFlow: {
      inflow: 'Puissance brute alternateur : 1 650 MW sous 24 kV (courant de phase 45 700 A)',
      outflow: 'Puissance évacuée sur la ligne 400 kV : 1 640 MW sous 400 kV (courant de phase réduit à 2 400 A)',
      lossMechanism: 'Pertes fer dans le noyau magnétique (environ 800 kW) et pertes Joule cuivre (environ 5 500 kW)',
      efficiencyTypical: 'Rendement exceptionnel : > 99.65%'
    },
    electricalRole: 'Élévation massive de tension réduisant le courant d\'un facteur 16.7, réduisant ainsi les pertes Joules en ligne par un facteur 278 (P_joule = 3·R·I²).',
    mechanicalRole: 'Résiste aux contraintes électrodynamiques colossales de court-circuit asymétrique atteignant plusieurs dizaines de méganewtons sur les calages d\'enroulements.',
    control: 'Régleur en charge (OLTC) côté 400 kV permettant un ajustement de ± 10% en 17 ou 27 prises pour adapter la tension d\'évacuation aux fluctuations du réseau de transport.',
    instrumentation: ['Analyseurs en continu des gaz dissous dans l\'huile (DGA 8 gaz)', 'Moniteurs de température des points chauds fibre optique intégrés aux enroulements', 'Capteurs de pression dynamique et relais Buchholz double flotteur'],
    protection: {
      description: 'Protection différentielle transformateur à pourcentage stabilisé (ANSI 87T), protection Buchholz (ANSI 63), masse cuve (ANSI 50N/51N), surintensité de phase et thermique (ANSI 49).',
      tripActions: 'Déclenchement simultané en 40 ms du disjoncteur groupe 24 kV et du disjoncteur réseau 400 kV avec extinction automatique incendie par déluge d\'eau émulseur.'
    },
    auxiliarySystems: ['Bac de rétention totale avec séparateur eau-huile anti-incendie (système piège à flammes)', 'Dispositif automatique d\'extinction incendie par rideau d\'eau pulvérisée déluge', 'Pompes de circulation forcée d\'huile et ventilateurs de radiateurs'],
    operatingStates: {
      normal: 'Évacuation continue de 1 650 MW / 400 kV en charge thermique stable',
      starting: 'Mise sous tension à vide depuis le réseau 400 kV avec appel de courant d\'enclenchement (inrush)',
      running: 'Fonctionnement permanent sous surveillance télésurveillée DGA en ligne',
      stopping: 'Déconnexion préalable côté charge 400 kV puis côté 24 kV',
      fault: 'Déclenchement différentiel ou Buchholz : isolement total immédiat',
      maintenance: 'Traitement sous vide de l\'huile minérale et mesure de réponse en fréquence diélectrique (DFR)',
      isolated: 'Mis à la terre côté 24 kV et 400 kV'
    },
    failureModes: ['Défaut d\'isolement interne entre spires par vieillissement thermique du papier kraft', 'Amorçage diélectrique de traversée 400 kV', 'Déformation mécanique des enroulements suite à un court-circuit réseau non éliminé à temps'],
    safetyConsiderations: ['Volume d\'huile inflammable de plus de 120 tonnes par unité ; parois coupe-feu béton armé 4 heures séparant chaque phase monophasée.'],
    maintenance: ['Chromatographie annuelle en laboratoire des gaz dissous dans l\'huile', 'Thermographie infrarouge des raccordements haute tension'],
    parameters: [
      { label: 'Puissance assignée totale', symbol: 'S_n', typicalValue: '1 950', unit: 'MVA', significance: 'Composé de 3 unités monophasées de 650 MVA ou bloc triphasé 2 000 MVA' },
      { label: 'Tension primaire / secondaire', symbol: 'U_1 / U_2', typicalValue: '24 / 400', unit: 'kV', significance: 'Rapport de transformation élévateur pour le grand réseau THT' },
      { label: 'Tension de court-circuit', symbol: 'U_cc', typicalValue: '16.5', unit: '%', significance: 'Limite le courant de défaut symétrique côté réseau à une valeur gérable' }
    ],
    standards: ['CEI 60076-1 (Power transformers - General)', 'CEI 60076-5 (Ability to withstand short circuit)', 'IEEE C57.12.00 (General Requirements for Liquid-Immersed Distribution, Power, and Regulating Transformers)'],
    upstreamEquipment: ['Alternateur 24 kV', 'Gaines barres blindées phase isolée IPB'],
    downstreamEquipment: ['Poste de transport 400 kV', 'Lignes THT d\'interconnexion nationale'],
    physicalRepresentation: 'Trois cuves monumentales grises bordées de radiateurs imposants et surmontées de traversées céramiques 400 kV géantes, séparées par de hauts murs anti-déflagration.',
    electricalRepresentation: 'Transformateur élévateur couplage YNd11 (étoile à la terre côté 400 kV, triangle côté 24 kV).',
    functionalRepresentation: 'Transformation Haute Tension : U_sec = m · U_prim ; I_sec = I_prim / m ; Pertes = P_fer + 3·R_eq·I_sec².'
  }
};

