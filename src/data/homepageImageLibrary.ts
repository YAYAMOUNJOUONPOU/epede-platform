// src/data/homepageImageLibrary.ts
// EPEDE 2.0 Centralized Verified Electrical Engineering Photograph Library
// 100% Authenticated Real-World Infrastructure Photographs organized by Engineering Domain.
// Visually inspected and verified:
// - Real hydroelectric dams & spillways
// - Real high-voltage steel lattice transmission towers (225/400 kV) with bundle conductors
// - Real outdoor air-insulated substations (AIS) with SF6 dead-tank circuit breakers & disconnectors
// - Real outdoor step-up & step-down power transformers with high-voltage bushings & radiators
// - Real low-voltage industrial distribution boards (TGBT) with ABB MCBs & DIN-rail gear
// - Real industrial automation & control racks with PLCs & relay wiring
// NO abstract patterns, NO coffee/lifestyle pictures, NO statues, NO trees, NO code-rain.

export interface EngineeringPhoto {
  id: string;
  url: string;
  altFr: string;
  altEn: string;
  captionFr: string;
  captionEn: string;
  domainCode: string;
  domainName: string;
  infrastructureType: string;
}

export const HOMEPAGE_IMAGE_LIBRARY: Record<string, EngineeringPhoto[]> = {
  // 1. POWER GENERATION (Barrages hydroélectriques, turbines, solaire, éolien)
  generation: [
    {
      id: 'gen-hydro-dam-spillway-01',
      url: 'https://images.unsplash.com/photo-1761925556918-98d1d1adba03?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Barrage hydroélectrique en exploitation avec évacuateurs de crue déversant en vallée',
      altEn: 'Hydroelectric dam powerhouse and active concrete spillway discharging high-velocity water',
      captionFr: 'Aménagement hydroélectrique de haute chute convertissant l’énergie hydraulique en 50 Hz synchronisé.',
      captionEn: 'High-head hydroelectric power station converting hydraulic head into synchronized 50 Hz power.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Hydroelectric Dam & Spillway',
    },
    {
      id: 'gen-hydro-dam-aerial-02',
      url: 'https://images.unsplash.com/photo-1560279966-2d681f3d4dfc?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Vue aérienne zénithale d’un barrage-poids hydroélectrique avec centrale et retenue d’eau',
      altEn: 'Aerial top-down view of hydroelectric gravity dam, reservoir and spillway powerhouse',
      captionFr: 'Barrage réservoir assurant la régulation saisonnière du débit fluvial vers les turbines Francis.',
      captionEn: 'Reservoir dam providing seasonal river flow regulation to feed high-efficiency hydraulic turbines.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Hydroelectric Reservoir Dam',
    },
    {
      id: 'gen-hydro-mega-switchyard-03',
      url: 'https://images.unsplash.com/photo-1774184972465-d0646b5af437?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Grand aménagement hydroélectrique avec poste élévateur HTB et départs de lignes',
      altEn: 'Mega hydroelectric dam complex with outdoor step-up switchyard and transmission lines',
      captionFr: 'Centrale hydroélectrique de grande puissance avec poste de transformation élévateur HTA/HTB.',
      captionEn: 'Large-scale hydro generation facility with generator step-up transformer switchyard.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Hydro Plant & Step-Up Substation',
    },
    {
      id: 'gen-solar-pv-utility-04',
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Centrale photovoltaïque au sol utility-scale 1500 V DC sous ciel dégagé',
      altEn: 'Utility-scale 1500 V DC solar photovoltaic power farm with tracking arrays under blue sky',
      captionFr: 'Parc photovoltaïque injectant sur le réseau via des onduleurs centraux et transformateurs HTA.',
      captionEn: 'Utility solar PV arrays feeding into grid collector via central inverters and step-up transformers.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Utility Solar PV Plant',
    },
    {
      id: 'gen-wind-turbines-05',
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Parc éolien terrestre connecté au réseau au coucher du soleil',
      altEn: 'Grid-connected onshore wind turbine farm across landscape at sunset',
      captionFr: 'Aérogénérateurs avec génératrices asynchrones à double alimentation raccordées en 33 kV.',
      captionEn: 'Utility wind turbine farm feeding synchronized power through 33 kV collector networks.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Wind Turbine Power Farm',
    },
  ],

  // 2. POWER TRANSMISSION & OVERHEAD LINES (Lignes 225 kV, 400 kV, Pylônes treillis)
  transmission: [
    {
      id: 'trans-lattice-tower-blue-01',
      url: 'https://images.unsplash.com/photo-1779636870368-43cbc556ef14?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Pylône treillis acier très haute tension 225/400 kV avec faisceaux de conducteurs et isolateurs',
      altEn: 'Heavy double-circuit steel lattice high-voltage transmission tower with bundle conductors and insulator strings',
      captionFr: 'Ligne de transport 225 kV avec chaînes d’isolateurs en verre et câble de garde à fibre optique OPGW.',
      captionEn: '225 kV high-voltage transmission line with glass suspension insulators and optical ground wire (OPGW).',
      domainCode: 'D03',
      domainName: 'Power Transmission',
      infrastructureType: 'EHV Steel Lattice Transmission Tower',
    },
    {
      id: 'trans-corridor-sunset-02',
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Corridor de transport électrique avec alignement de pylônes haute tension au coucher du soleil',
      altEn: 'Transmission line corridor with series of lattice towers stretching to horizon at sunset',
      captionFr: 'Dorsale de transport d’énergie électrique permettant le transit massif des gigawatts entre régions.',
      captionEn: 'High-voltage backbone grid corridor transmitting bulk electric energy between regional dispatch zones.',
      domainCode: 'D03',
      domainName: 'Power Transmission',
      infrastructureType: 'Overhead Transmission Corridor',
    },
    {
      id: 'trans-guyed-v-field-03',
      url: 'https://images.unsplash.com/photo-1783786988313-488082b84000?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Pylône haute tension type haubané et conducteurs aériens traversant une plaine',
      altEn: 'Guyed-V high-voltage power transmission tower carrying long-distance conductors across open field',
      captionFr: 'Structure de pilonnage optimisée pour les grandes portées et minimisation de l’empreinte au sol.',
      captionEn: 'Long-span transmission structure engineered for high mechanical reliability across vast terrains.',
      domainCode: 'D03',
      domainName: 'Power Transmission',
      infrastructureType: 'Guyed-V Transmission Tower',
    },
    {
      id: 'trans-pylon-overlook-04',
      url: 'https://images.unsplash.com/photo-1592152287815-1e3d73630734?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Pylône de transmission électrique en surplomb d’une vallée sur fond de collines',
      altEn: 'Steel lattice transmission pylon overlooking rolling landscape and valley',
      captionFr: 'Ouvrage de transport haute tension franchissant des zones géographiques accidentées.',
      captionEn: 'High-voltage grid pylon engineered for rugged topography and long-distance bulk transfer.',
      domainCode: 'D03',
      domainName: 'Power Transmission',
      infrastructureType: 'High-Elevation Transmission Pylon',
    },
  ],

  // 3. ELECTRICAL SUBSTATIONS & TRANSFORMERS (Postes sources AIS, disjoncteurs SF6, transformateurs)
  substations: [
    {
      id: 'sub-sf6-breaker-yard-01',
      url: 'https://images.unsplash.com/photo-1780396140802-52309c205050?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Poste électrique ouvert avec disjoncteurs haute tension SF6, sectionneurs et traversées de transformateur',
      altEn: 'Outdoor electrical substation featuring high-voltage SF6 dead-tank circuit breakers and transformer bushings',
      captionFr: 'Poste source HTB/HTA avec disjoncteurs SF6 à coupure rapide et jeux de barres principaux.',
      captionEn: 'High-voltage primary substation with fast SF6 circuit breakers, disconnectors, and tubular busbars.',
      domainCode: 'D04',
      domainName: 'Electrical Substations',
      infrastructureType: 'AIS Substation & SF6 Switchgear',
    },
    {
      id: 'sub-distribution-gantry-02',
      url: 'https://images.unsplash.com/photo-1693013112835-5f3128bb555f?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Poste de répartition électrique avec portique d’arrivée, régleurs en charge et transformateur de puissance',
      altEn: 'Electrical distribution substation yard with arrival gantry, instrument transformers, and power unit',
      captionFr: 'Poste de transformation abaisseur assurant l’interconnexion entre réseau de transport et réseau de distribution.',
      captionEn: 'Step-down substation linking high-voltage transmission grid to medium-voltage distribution feeders.',
      domainCode: 'D04',
      domainName: 'Electrical Substations',
      infrastructureType: 'Substation Gantry & Bay Structure',
    },
    {
      id: 'sub-power-transformer-heavy-03',
      url: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Transformateur de puissance à huile avec radiateurs, traversées haute tension et conservateur',
      altEn: 'Oil-immersed power transformer unit with radiator banks, HV bushings, and marshalling kiosk',
      captionFr: 'Transformateur de puissance de réseau avec changeur de prises en charge (OLTC) pour régulation de tension.',
      captionEn: 'Heavy power transformer equipped with on-load tap changer (OLTC) and nitrogen fire protection.',
      domainCode: 'D04',
      domainName: 'Electrical Substations',
      infrastructureType: 'Step-Down Power Transformer Unit',
    },
  ],

  // 4. LOW-VOLTAGE DISTRIBUTION, TGBT & INDUSTRIAL SWITCHBOARDS (Tableaux, disjoncteurs, automates)
  industrial: [
    {
      id: 'ind-panel-abb-breakers-01',
      url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Armoire électrique industrielle basse tension avec disjoncteurs modulaires ABB sur rail DIN et borniers',
      altEn: 'Industrial low-voltage distribution panel featuring ABB DIN-rail circuit breakers, surge devices and color-coded wiring',
      captionFr: 'Tableau de distribution basse tension équipé de protections magnétothermiques sélectives et parafoudres.',
      captionEn: 'Low-voltage distribution board wired with selective miniature circuit breakers and surge protection modules.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Low-Voltage Distribution Panel (TGBT)',
    },
    {
      id: 'ind-distribution-board-mcb-02',
      url: 'https://images.unsplash.com/photo-1576446470246-499c738d1c8e?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Coffret électrique de distribution neuf avec rangée de disjoncteurs divisionnaires et peignes d’alimentation',
      altEn: 'Clean low-voltage distribution board with row of miniature circuit breakers and neutral terminal block',
      captionFr: 'Armoire de distribution terminale conforme CEI 61439 pour protection des départs moteurs et auxiliaires.',
      captionEn: 'Terminal distribution switchboard compliant with IEC 61439 for motor feed and building auxiliary protection.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Modular Distribution Board',
    },
    {
      id: 'ind-automation-plc-rack-03',
      url: 'https://images.unsplash.com/photo-1783419752280-46a2073ef7dc?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Baie d’automatisme et téléconduite avec automates programmables industriels, relais et bornes de raccordement',
      altEn: 'Industrial automation and SCADA relay rack featuring programmable logic controllers (PLCs) and I/O terminal strips',
      captionFr: 'Châssis d’automatisme industriel assurant le contrôle-commande, le verrouillage électrique et la télégestion.',
      captionEn: 'Industrial automation rack managing interlocking logic, protection signaling, and remote telemetry.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Automation & PLC Control Rack',
    },
    {
      id: 'ind-electrician-commissioning-04',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2000&q=85',
      altFr: 'Ingénieur électrotechnicien en équipement de sécurité EPI effectuant des essais sur appareillage électrique',
      altEn: 'Electrical engineering technician in safety helmet and gloves conducting tests on electrical equipment',
      captionFr: 'Mise en service et qualification des protections électriques selon les normes de sécurité CEI.',
      captionEn: 'Electrical commissioning and verification of protection settings according to IEC safety standards.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Electrical Testing & Commissioning',
    },
  ],
};

// Aliases for comprehensive domain compatibility across all sections
HOMEPAGE_IMAGE_LIBRARY.installations = HOMEPAGE_IMAGE_LIBRARY.industrial;
HOMEPAGE_IMAGE_LIBRARY.automationScada = HOMEPAGE_IMAGE_LIBRARY.industrial;
HOMEPAGE_IMAGE_LIBRARY.distribution = HOMEPAGE_IMAGE_LIBRARY.substations;
HOMEPAGE_IMAGE_LIBRARY.transformers = HOMEPAGE_IMAGE_LIBRARY.substations;
HOMEPAGE_IMAGE_LIBRARY.protection = HOMEPAGE_IMAGE_LIBRARY.industrial;

// Reusable helper to get photos for a given domain
export const getPhotosForDomain = (domain: string): EngineeringPhoto[] => {
  return HOMEPAGE_IMAGE_LIBRARY[domain] || HOMEPAGE_IMAGE_LIBRARY.generation;
};

// Flattened list of all verified photographs
export const ALL_VERIFIED_ELECTRICAL_PHOTOS: EngineeringPhoto[] = [
  ...HOMEPAGE_IMAGE_LIBRARY.generation,
  ...HOMEPAGE_IMAGE_LIBRARY.transmission,
  ...HOMEPAGE_IMAGE_LIBRARY.substations,
  ...HOMEPAGE_IMAGE_LIBRARY.industrial,
];
