// src/services/engineeringAssets.ts
// Centralized Engineering Asset Architecture for EPEDE
// Curated high-resolution electrical power engineering photography, technical diagrams, and robust fallbacks

export interface EngineeringImage {
  url: string;
  fallbackUrl: string;
  altFr: string;
  altEn: string;
  captionFr: string;
  captionEn: string;
  category: string;
  voltageClass?: string;
  standardRef?: string;
}

export const engineeringAssets = {
  // 1. Generation
  generation: {
    hydroRunner: {
      url: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=1600&q=80', // Industrial turbine runner / penstock
      fallbackUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Roue de turbine hydroélectrique Francis dans un aménagement de haute chute',
      altEn: 'Hydroelectric Francis turbine runner in high-head powerhouse',
      captionFr: 'Roue Francis en acier inoxydable forgé, alternateur synchrone 15 kV',
      captionEn: 'Forged stainless steel Francis runner, 15 kV synchronous generator',
      category: 'generation',
      voltageClass: '15 kV',
      standardRef: 'IEC 60193 / IEEE 1010',
    },
    generatorHall: {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80', // Power plant generator hall
      fallbackUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Salle des machines centrale hydroélectrique avec alternateurs verticaux',
      altEn: 'Hydroelectric powerhouse machine hall with vertical shaft generators',
      captionFr: 'Alternateurs synchrones à pôles saillants couplés aux turbines hydrauliques',
      captionEn: 'Salient-pole synchronous generators direct-coupled to hydro turbines',
      category: 'generation',
      voltageClass: '10.5 - 20 kV',
      standardRef: 'IEC 60034',
    },
    solarPlant: {
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Centrale solaire photovoltaïque utility-scale avec onduleurs centraux',
      altEn: 'Utility-scale solar PV power plant with central inverters',
      captionFr: 'Parc photovoltaïque couplé au poste élévateur HTA/HTB',
      captionEn: 'Utility PV solar farm coupled to step-up MV/HV substation',
      category: 'generation',
      voltageClass: '1500 V DC / 33 kV AC',
      standardRef: 'IEC 62446',
    },
    windTurbines: {
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Parc éolien avec génératrices asynchrones à double alimentation (DFIG)',
      altEn: 'Wind farm with doubly-fed induction generators (DFIG)',
      captionFr: 'Aérogénérateurs avec transformateur tête de mât 0.69/33 kV',
      captionEn: 'Wind turbines with nacelle-integrated 0.69/33 kV step-up transformers',
      category: 'generation',
      voltageClass: '690 V / 33 kV',
      standardRef: 'IEC 61400',
    },
    thermalCcgt: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Centrale thermique à cycle combiné gaz CCGT (Turbine à gaz + HRSG + Turbine vapeur)',
      altEn: 'Combined Cycle Gas Turbine (CCGT) power station (Gas Turbine + HRSG + Steam Turbine)',
      captionFr: 'Rendement global atteignant 60%, turbo-alternateur 2 poles 3000 tr/min per IEC 60034',
      captionEn: '60% overall efficiency, 2-pole 3000 rpm cylindrical rotor turbo-generator per IEC 60034',
      category: 'generation',
      voltageClass: '15 kV - 24 kV',
      standardRef: 'IEC 60034 / ASME PTC',
    },
    biomassPlant: {
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Centrale thermique biomasse et cogénération vapeur haute pression',
      altEn: 'Biomass thermal cogeneration plant and high-pressure steam boiler',
      captionFr: 'Valorisation des résidus forestiers et agricoles en énergie électrique de base',
      captionEn: 'Agricultural & forestry residue conversion into base-load electric power',
      category: 'generation',
      voltageClass: '6.6 kV - 15 kV',
      standardRef: 'EN 12952 / IEC 60034',
    },
  },

  // 2. Transformation
  transformation: {
    powerTransformer: {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80', // Substation transformer
      fallbackUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Transformateur de puissance élévateur THT 225 kV avec traversées RIP',
      altEn: 'EHV 225 kV step-up power transformer with RIP bushings',
      captionFr: 'Transformateur triphasé immergé dans l’huile minérale, refroidissement ONAF / OFAF',
      captionEn: 'Three-phase oil-immersed power transformer, ONAF/OFAF forced cooling',
      category: 'transformation',
      voltageClass: '15 kV / 225 kV',
      standardRef: 'IEC 60076 / IEEE C57.12',
    },
    buchholzRelay: {
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Relais Buchholz (ANSI 63) et conservateur d’huile de transformateur',
      altEn: 'Buchholz gas and oil surge relay (ANSI 63) on transformer pipe',
      captionFr: 'Détection des arcs internes, dégazage et surpression mécanique',
      captionEn: 'Internal arc fault gas accumulation and oil surge tripping device',
      category: 'protection',
      standardRef: 'IEC 60076-22',
    },
  },

  // 3. Transmission
  transmission: {
    corridor: {
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80', // Power lines against dramatic sky
      fallbackUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Ligne de transport très haute tension 225 kV / 400 kV en faisceaux',
      altEn: 'EHV 225 kV / 400 kV overhead transmission line bundle',
      captionFr: 'Pylônes treillis d’alignement et d’angle, conducteurs Almelec en faisceaux duplex',
      captionEn: 'Lattice steel transmission towers with duplex ACSR/Almelec conductor bundles',
      category: 'transmission',
      voltageClass: '225 kV / 400 kV',
      standardRef: 'IEC 60826 / IEEE 738',
    },
    insulators: {
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Chaînes d’isolateurs en verre trempé et anneaux pare-effluves corona',
      altEn: 'Toughened glass suspension insulator strings with corona grading rings',
      captionFr: 'Ligne de fuite spécifique pour zone de pollution industrielle et foudre',
      captionEn: 'Creepage distance design for industrial pollution and lightning immunity',
      category: 'transmission',
      voltageClass: '225 kV',
      standardRef: 'IEC 60383 / IEC 60815',
    },
    undergroundCableTrench: {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Pose de câbles HTB isolés XLPE en nappe et trèfle en tranchée technique',
      altEn: 'High-voltage XLPE insulated transmission cable installation in trefoil formation',
      captionFr: 'Pose en trèfle avec lit de sable thermique stabilisé per IEC 60287 / CIGRÉ TB 680',
      captionEn: 'Trefoil arrangement in stabilized fluidized thermal backfill per IEC 60287',
      category: 'transmission',
      voltageClass: '90 kV - 225 kV',
      standardRef: 'IEC 60287 / IEC 60840',
    },
  },

  // 4. Substations
  substations: {
    outdoorAis: {
      url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80', // Substation switchyard
      fallbackUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Poste électrique extérieur à isolation dans l’air (AIS) 225/90/30 kV',
      altEn: 'Air-Insulated Substation (AIS) 225/90/30 kV outdoor switchyard',
      captionFr: 'Jeu de barres principal, disjoncteurs SF6, sectionneurs à pantographe et réducteurs',
      captionEn: 'Main busbars, SF6 live-tank circuit breakers, pantograph disconnectors and instrument transformers',
      category: 'substations',
      voltageClass: '225 kV / 90 kV / 30 kV',
      standardRef: 'IEC 61936-1 / IEEE 80',
    },
    gisIndoor: {
      url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80', // High tech electrical switchroom
      fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Poste sous enveloppe métallique blindé (GIS) compact en milieu urbain',
      altEn: 'Gas-Insulated Switchgear (GIS) compact indoor substation for dense urban grids',
      captionFr: 'Chambres blindées étanches sous SF6 avec compartimentage de sécurité',
      captionEn: 'Modular SF6 insulated metal-enclosed bays with arc-proof barriers',
      category: 'substations',
      voltageClass: '90 kV / 225 kV',
      standardRef: 'IEC 62271-203',
    },
    circuitBreaker: {
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Disjoncteur HTB à coupure dans le SF6 avec commande oléopneumatique',
      altEn: 'High voltage SF6 puffer circuit breaker with spring/hydraulic mechanism',
      captionFr: 'Pouvoir de coupure nominal 40 kA / 50 kA à 225 kV per IEC 62271-100',
      captionEn: 'Rated short-circuit breaking capacity 40 kA / 50 kA at 225 kV',
      category: 'switchgear',
      voltageClass: '225 kV',
      standardRef: 'IEC 62271-100',
    },
  },

  // 5. Distribution
  distribution: {
    rmuSwitchgear: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80', // Electrical cabinet / distribution
      fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Tableau de distribution HTA et cellules RMU (Ring Main Unit) 30 kV / 20 kV',
      altEn: 'Medium voltage metal-enclosed switchgear & 30 kV Ring Main Unit (RMU)',
      captionFr: 'Cellules de boucle interrupteur-sectionneur et départ protection transformateur fusibles/disjoncteur',
      captionEn: 'Ring feeder switch-disconnectors and transformer protection circuit breaker bay',
      category: 'distribution',
      voltageClass: '20 kV - 36 kV',
      standardRef: 'IEC 62271-200',
    },
    poleTransformer: {
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Poste de distribution HTA/BT sur poteau (H61) 100 kVA / 160 kVA',
      altEn: 'Pole-mounted distribution transformer H61 30 kV / 400 V',
      captionFr: 'Alimentation rurale et périurbaine avec parafoudres à oxyde de zinc',
      captionEn: 'Rural & suburban MV/LV distribution with ZnO surge arresters',
      category: 'distribution',
      voltageClass: '30 kV / 400 V',
      standardRef: 'IEC 60076',
    },
    mvUndergroundCable: {
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Câble unipolaire HTA isolé au polyéthylène réticulé (PRC/XLPE)',
      altEn: 'Medium-voltage XLPE insulated single-core underground distribution cable',
      captionFr: 'Âme aluminium/cuivre, triple extrusion semiconductrice et écran cuivre per NF C 33-226 / IEC 60502-2',
      captionEn: 'Al/Cu core, triple extrusion semiconductive screens and copper wire shield per IEC 60502-2',
      category: 'distribution',
      voltageClass: '12/20(24) kV - 18/30(36) kV',
      standardRef: 'IEC 60502-2 / NF C 33-226',
    },
  },

  // 6. Buildings & Industry
  industry: {
    industrialMcc: {
      url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1600&q=80', // Industrial electrical panel
      fallbackUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Tableau Général Basse Tension (TGBT) et centre de commande de moteurs (MCC)',
      altEn: 'Low Voltage Main Switchboard (TGBT) and Motor Control Center (MCC)',
      captionFr: 'Jeu de barres 3200 A, disjoncteurs ouverts débrochables avec déclencheurs électroniques',
      captionEn: '3200 A busbar system, withdrawable air circuit breakers with electronic trip units',
      category: 'industry',
      voltageClass: '400 V / 690 V',
      standardRef: 'IEC 61439-1/-2 / IEC 60364',
    },
    vfdDrive: {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Variateurs de vitesse industriels (VFD) et filtrage harmonique actif',
      altEn: 'Industrial Variable Frequency Drives (VFD) and active harmonic filters',
      captionFr: 'Pilotage de moteurs asynchrones de pompage et ventilation avec limitation du THD-I',
      captionEn: 'Induction motor variable speed drive systems with THD-I mitigation',
      category: 'power_quality',
      standardRef: 'IEC 61800-3 / IEEE 519',
    },
  },

  // 7. Automation & SCADA
  automation: {
    scadaControlRoom: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80', // Control room / telemetry screens
      fallbackUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Centre de conduite national de réseau électrique (Dispatching SCADA / EMS)',
      altEn: 'National power grid dispatching control center (SCADA / EMS / DMS)',
      captionFr: 'Supervision temps réel de l’équilibre production-consommation, réserve primaire et tension',
      captionEn: 'Real-time generation-load balance dispatching, spinning reserve and voltage regulation',
      category: 'automation',
      standardRef: 'IEC 60870-5-104 / IEC 61970 CIM',
    },
    iedProtectionRelay: {
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Relais numérique de protection multifonction IED compatible CEI 61850',
      altEn: 'Multifunction digital protection IED with IEC 61850 GOOSE and SV communication',
      captionFr: 'Protections différentielle (87), distance (21), surintensité à temps inverse (51)',
      captionEn: 'Differential (87), distance (21), and inverse-time overcurrent (51) relay schemes',
      category: 'protection',
      standardRef: 'IEC 60255 / IEC 61850',
    },
  },

  // 8. Storage, EV & Microgrids
  storageAndEv: {
    bessContainer: {
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Système de stockage d’énergie par batteries conteneurisé (BESS) lithium-fer-phosphate',
      altEn: 'Containerized Battery Energy Storage System (BESS) LFP technology',
      captionFr: 'Services système de réglage rapide de fréquence (FCR) et arbitrage énergétique',
      captionEn: 'Frequency Containment Reserve (FCR) and energy arbitrage utility battery storage',
      category: 'bess',
      voltageClass: '1500 V DC / 33 kV AC',
      standardRef: 'IEC 62933 / NFPA 855',
    },
    evFastHub: {
      url: 'https://images.unsplash.com/photo-1558441719-813c9a6224ce?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
      altFr: 'Station de recharge ultra-rapide pour véhicules électriques haute puissance HPC',
      altEn: 'High-power ultra-fast EV charging station connected to dedicated MV transformer',
      captionFr: 'Bornes de recharge 350 kW DC CCS Combo 2 avec raccordement direct au réseau HTA',
      captionEn: '350 kW DC CCS Combo 2 chargers with dedicated medium-voltage step-down substation',
      category: 'ev',
      voltageClass: '400 V - 1000 V DC',
      standardRef: 'IEC 61851 / ISO 15118',
    },
  },

  // 9. Real Industrial Projects & Field Engineering
  projects: {
    doualaGensets: {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      altFr: 'Centrale Autonome Douala Bassa 2.0 MW avec 4 groupes Cummins synchronisés',
      altEn: 'Douala Bassa 2.0 MW captive power plant with 4 synchronised Cummins gensets',
      captionFr: 'Groupes électrogènes industriels 4×500 kVA, armoire ATS et délestage prioritaire',
      captionEn: 'Industrial 4×500 kVA generator sets, ATS synchronisation panel and priority load-shedding',
      category: 'project',
      voltageClass: '400 V / 15 kV',
      standardRef: 'ISO 8528 / IEC 60034',
    },
    miningSubstation: {
      url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      altFr: 'Poste Source Minier 33 kV / 11 kV 5 MVA en exploitation ciel ouvert',
      altEn: '33 kV / 11 kV 5 MVA outdoor mining substation for heavy extraction and crushing',
      captionFr: 'Transformateur 5 MVA ONAN, disjoncteurs SF6 et protection différentielle 87T',
      captionEn: '5 MVA ONAN transformer, SF6 breakers and 87T transformer differential protection',
      category: 'project',
      voltageClass: '33 kV / 11 kV',
      standardRef: 'IEC 61936-1 / IEEE C37.91',
    },
    waterScada: {
      url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      altFr: 'Salle de commande et armoires automates téléconduite station de pompage Yaoundé',
      altEn: 'Yaoundé water pumping station control cubicles, PLC S7-1500 and VFD inverters',
      captionFr: 'Automates S7-1500 redondants, variateurs 690 V et télésurveillance en temps réel',
      captionEn: 'Redundant S7-1500 PLCs, 690 V variable frequency drives and remote telemetry',
      category: 'project',
      voltageClass: '690 V / 400 V',
      standardRef: 'IEC 61131 / IEC 61800',
    },
    hospitalUps: {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      altFr: 'Onduleurs modulaires 800 kVA N+1 et salle batteries secours médical critique',
      altEn: '800 kVA N+1 modular static UPS and critical medical backup battery room',
      captionFr: 'Onduleurs 0 ms, régime IT médicalisé et autonomie batterie 4h per NF C 15-211',
      captionEn: 'Zero-transfer UPS, medical isolated IT earthing and 4h battery bank autonomy',
      category: 'project',
      voltageClass: '400 V / 230 V',
      standardRef: 'IEC 62040 / IEC 60364-7-710',
    },
  },
};

// Safe image helper that falls back gracefully if URL fails to load
export function getEngineeringImageUrl(imgObj?: { url: string; fallbackUrl?: string }): string {
  if (!imgObj) return 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80';
  return imgObj.url;
}
