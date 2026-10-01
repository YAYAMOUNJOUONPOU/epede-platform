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
