// src/data/cameroonContractualBoundariesData.ts
// EPEDE - Cameroon Electric Power Sector Contractual Demarcation & Responsibility Boundaries Registry
// Grounded in Law N° 2011/022, Decree N° 2015/454 (SONATREL), Grid Code Transport & Eneo Concession

export interface CameroonContractualBoundary {
  id: string;
  code: string;
  title_fr: string;
  title_en: string;
  upstreamParty: {
    name_fr: string;
    name_en: string;
    role_fr: string;
    role_en: string;
    badgeColor: string;
  };
  downstreamParty: {
    name_fr: string;
    name_en: string;
    role_fr: string;
    role_en: string;
    badgeColor: string;
  };
  legalFramework: {
    primaryLaw: string;
    decreesAndCodes: string[];
    governingAuthority: string;
  };
  demarcationPoint: {
    physical_fr: string;
    physical_en: string;
    electrical_fr: string;
    electrical_en: string;
    metering_fr: string;
    metering_en: string;
    scada_fr: string;
    scada_en: string;
  };
  operationalResponsibilities: {
    frequencyAndActivePower_fr: string;
    frequencyAndActivePower_en: string;
    voltageAndReactivePower_fr: string;
    voltageAndReactivePower_en: string;
    maintenanceAndInterlocking_fr: string;
    maintenanceAndInterlocking_en: string;
  };
  commercialAndFinancial: {
    meteringClass: string;
    settlementFormula_fr: string;
    settlementFormula_en: string;
    penaltiesAndImbalances_fr: string;
    penaltiesAndImbalances_en: string;
  };
  faultLiabilityProtocol: {
    faultClearingCriteria_fr: string;
    faultClearingCriteria_en: string;
    recordingEquipment: string;
    disputeResolution_fr: string;
    disputeResolution_en: string;
  };
}

export const CAMEROON_CONTRACTUAL_BOUNDARIES: CameroonContractualBoundary[] = [
  {
    id: 'boundary-gen-tso',
    code: 'FRONT-01',
    title_fr: 'Frontière Producteur Électrique ↔ Gestionnaire Réseau Transport (SONATREL)',
    title_en: 'Power Producer ↔ Transmission System Operator (SONATREL) Boundary',
    upstreamParty: {
      name_fr: 'Centrale de Production (Eneo / NHPC Nachtigal / Globeleq Kribi)',
      name_en: 'Generation Plant (Eneo / NHPC Nachtigal / Globeleq Kribi)',
      role_fr: 'Producteur Concessionnaire ou Indépendant (IPP)',
      role_en: 'Concessionaire or Independent Power Producer (IPP)',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    downstreamParty: {
      name_fr: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      name_en: 'SONATREL (National Electricity Transmission Corporation)',
      role_fr: 'Gestionnaire Unique du Réseau de Transport (TSO)',
      role_en: 'National Transmission System Operator (TSO)',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    legalFramework: {
      primaryLaw: 'Loi N° 2011/022 du 14 décembre 2011 régissant le secteur de l\'électricité au Cameroun',
      decreesAndCodes: [
        'Décret N° 2015/454 du 8 octobre 2015 portant création et organisation de la SONATREL',
        'Code de Réseau de Transport SONATREL (Conditions de raccordement des groupes de production)',
        'Contrat PPA (Power Purchase Agreement) approuvé par l\'ARSEL'
      ],
      governingAuthority: 'ARSEL (Agence de Régulation du Secteur de l\'Électricité) & MINEE'
    },
    demarcationPoint: {
      physical_fr: 'Plages de raccordement haute tension en sortie des sectionneurs d\'aiguillage ou portique de départ poste d\'évacuation 225 kV de la centrale.',
      physical_en: 'High-voltage connection palms at the 225 kV switchyard gantry terminal clamps of the power plant.',
      electrical_fr: 'Tension assignée 225 kV, 50.00 Hz. Niveau de tenue diélectrique : choc de foudre 1050 kV crête, tension assignée à fréquence industrielle 460 kV RMS.',
      electrical_en: 'Nominal 225 kV, 50.00 Hz. Dielectric insulation level: 1050 kV peak lightning impulse (BIL), 460 kV RMS power-frequency withstand.',
      metering_fr: 'Point Frontière de Comptage Transactionnel : deux compteurs numériques multifonctions 4 quadrants classe 0.2S (Principal + Secours) alimentés par TC/TT de classe 0.2 homologués CEI 61869.',
      metering_en: 'Transactional Settlement Metering Point: dual 4-quadrant class 0.2S revenue meters (Main + Backup) fed by dedicated class 0.2 CT/VT units per IEC 61869.',
      scada_fr: 'Interface RTU/Gateway au poste : protocole IEC 60870-5-104 vers le Dispatching National de Mangombé (télémesures P, Q, U, f, positions disjoncteurs, téléréglage AGC).',
      scada_en: 'Substation RTU/Gateway interface: IEC 60870-5-104 link to National Dispatch Center Mangombé (P, Q, U, f telemetry, breaker states, AGC setpoint).'
    },
    operationalResponsibilities: {
      frequencyAndActivePower_fr: 'Le groupe doit participer au réglage primaire de fréquence avec un statif permanent s = 4.0% (bande morte ≤ ±20 mHz) et fournir une réserve tournante FCR de 3% à 5% de sa puissance nominale.',
      frequencyAndActivePower_en: 'The generator must deliver primary frequency response with speed droop s = 4.0% (deadband ≤ ±20 mHz) and maintain 3% to 5% spinning FCR reserve.',
      voltageAndReactivePower_fr: 'Obligation de régulation automatique de tension (AVR) pour maintenir le cos φ entre 0.85 inductif et 0.95 capacitif aux bornes 225 kV selon consigne du CCR Mangombé.',
      voltageAndReactivePower_en: 'Mandatory automatic voltage regulation (AVR) maintaining power factor between 0.85 lagging and 0.95 leading at 225 kV terminals per dispatch dispatch order.',
      maintenanceAndInterlocking_fr: 'Consignation conjointe en 5 étapes. Les sectionneurs de tête de ligne 225 kV sont télécommandés par la SONATREL avec verrouillage mécanique/électrique croisé vers le disjoncteur groupe.',
      maintenanceAndInterlocking_en: 'Joint 5-step LOTO procedure. Line gantry disconnectors are under SONATREL operational control with cross-interlocks to generator breaker.'
    },
    commercialAndFinancial: {
      meteringClass: 'Classe 0.2S CEI 62053-22 (Précision ±0.2% sur énergie active)',
      settlementFormula_fr: 'Facturation mensuelle basée sur l\'Énergie Nette Injectée (MWh) + Rémunération de la Capacité Mise à Disposition (MW/mois) selon contrat d\'achat PPA validé ARSEL.',
      settlementFormula_en: 'Monthly billing based on Net Injected Energy (MWh) + Available Capacity Charge (MW/month) governed by ARSEL-approved PPA.',
      penaltiesAndImbalances_fr: 'Pénalités financières en cas d\'écart entre le programme journalier déclaré et la puissance réelle délivrée hors cas de force majeure hydrologique.',
      penaltiesAndImbalances_en: 'Financial imbalance penalties when delivered active power deviates from declared day-ahead schedule, barring hydrological force majeure.'
    },
    faultLiabilityProtocol: {
      faultClearingCriteria_fr: 'Temps d\'élimination total d\'un court-circuit 225 kV : ≤ 100 ms (protection différentielle 87L ou distance 21). Au-delà de 120 ms, la défaillance disjoncteur 50BF engage la responsabilité de l\'exploitant de l\'ouvrage défaillant.',
      faultClearingCriteria_en: 'Maximum total clearing time for 225 kV faults: ≤ 100 ms (via 87L differential or 21 distance). Beyond 120 ms, breaker failure 50BF establishes fault liability.',
      recordingEquipment: 'Perturbographes numériques DFRE synchronisés GPS IEEE 1588 (PTP) horodatés à 1 ms près aux deux extrémités.',
      disputeResolution_fr: 'Commission paritaire SONATREL-Producteur sous 72h. En cas de désaccord persistant, arbitrage technique de l\'ARSEL.',
      disputeResolution_en: 'Joint technical review panel within 72h. In case of unresolved deadlock, formal technical arbitration by ARSEL.'
    }
  },
  {
    id: 'boundary-tso-dso',
    code: 'FRONT-02',
    title_fr: 'Frontière Réseau Transport (SONATREL) ↔ Réseau Distribution HTA (ENEO)',
    title_en: 'Transmission Operator (SONATREL) ↔ Distribution Operator (ENEO) Boundary',
    upstreamParty: {
      name_fr: 'SONATREL (Poste Source Interconnexion 225/30 kV ou 90/30 kV)',
      name_en: 'SONATREL (225/30 kV or 90/30 kV Primary Grid Substation)',
      role_fr: 'Transporteur & Fournisseur d\'Accès Réseau',
      role_en: 'Transmission Operator & Bulk Power Supplier',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    downstreamParty: {
      name_fr: 'ENEO Cameroon (Direction Distribution)',
      name_en: 'ENEO Cameroon (Distribution Directorate)',
      role_fr: 'Concessionnaire du Service Public de Distribution (DSO)',
      role_en: 'Distribution System Operator (DSO)',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    legalFramework: {
      primaryLaw: 'Loi N° 2011/022 du 14 décembre 2011 & Contrat de Concession Eneo révisé',
      decreesAndCodes: [
        'Convention de Raccordement et d\'Exploitation SONATREL - ENEO',
        'Cahier des Charges du Transporteur et Tarifs d\'Accès au Réseau de Transport (TURPE Cameroun)',
        'Règlement Technique de Distribution HTA / BT homologué par l\'ARSEL'
      ],
      governingAuthority: 'ARSEL & MINEE'
    },
    demarcationPoint: {
      physical_fr: 'Bornes de raccordement aval des cellules de départs HTA 30 kV ou 15 kV situées dans le bâtiment de commande du poste source SONATREL (têtes de câbles souterrains HTA).',
      physical_en: 'Downstream cable termination terminals of the 30 kV / 15 kV switchgear feeder cubicles inside SONATREL primary substation control building.',
      electrical_fr: 'Tension HTA nominale 30 kV (ou 15 kV à Douala Centre / Yaoundé Ouest). Courant de court-circuit assigné de courte durée : 25 kA / 1s ou 16 kA / 1s.',
      electrical_en: 'Nominal MV voltage 30 kV (or 15 kV in Douala Urban / Yaoundé West). Rated short-time withstand current: 25 kA / 1s or 16 kA / 1s.',
      metering_fr: 'Comptage de gros (Bulk Metering) : armoire de comptage transactionnel 30 kV équipée de deux compteurs classe 0.2S mesurant P+, P-, Q1, Q2, Q3, Q4 avec enregistrement de courbe de charge à 10 minutes.',
      metering_en: 'Bulk Delivery Metering: transactional 30 kV metering cubicle fitted with redundant 0.2S meters logging 10-minute active/reactive load curves.',
      scada_fr: 'Liaison téléconduite inter-centres : échange de données ICCP / TASE.2 entre le CCR Transport SONATREL et le CCD Distribution Eneo.',
      scada_en: 'Inter-control-center link: ICCP / TASE.2 data exchange between SONATREL National Dispatch and Eneo Distribution Control Center.'
    },
    operationalResponsibilities: {
      frequencyAndActivePower_fr: 'ENEO est tenue d\'exécuter immédiatement les ordres de délestage d\'urgence transmis par le CCR SONATREL et de maintenir opérationnel le délestage automatique par relais de sous-fréquence (UFLS en 4 paliers : 49.00 Hz, 48.80 Hz, 48.60 Hz, 48.40 Hz).',
      frequencyAndActivePower_en: 'ENEO must execute emergency load-shedding orders issued by SONATREL and maintain four automated UFLS stages (49.00 Hz, 48.80 Hz, 48.60 Hz, 48.40 Hz).',
      voltageAndReactivePower_fr: 'ENEO s\'engage à maintenir le facteur de puissance global de ses départs à cos φ ≥ 0.92 (tan φ ≤ 0.426). Des pénalités de dépassement réactif sont appliquées au-delà de ce seuil.',
      voltageAndReactivePower_en: 'ENEO commits to maintaining feeder power factor at cos φ ≥ 0.92 (tan φ ≤ 0.426). Financial reactive power surcharges apply when exceeded.',
      maintenanceAndInterlocking_fr: 'La cellule de départ 30 kV appartient à la SONATREL jusqu\'aux têtes de câbles. ENEO est responsable des câbles de liaison, de la pose et de la maintenance des relais de départ (ANSI 50/51/51N) coordonnés avec la protection amont transformateur.',
      maintenanceAndInterlocking_en: 'The 30 kV cubicle belongs to SONATREL up to the cable sealing ends. ENEO owns and maintains outgoing distribution cables and feeder relays (ANSI 50/51/51N).'
    },
    commercialAndFinancial: {
      meteringClass: 'Classe 0.2S (CEI 62053-22)',
      settlementFormula_fr: 'Facturation du Tarif d\'Utilisation des Réseaux Publics d\'Électricité (TURPE) basé sur la puissance souscrite (kW) et l\'énergie transitée (kWh) selon barème fixé par l\'ARSEL.',
      settlementFormula_en: 'Transmission grid tariff billing (TURPE) based on subscribed maximum demand (kW) and transported energy (kWh) set by ARSEL.',
      penaltiesAndImbalances_fr: 'Pénalités applicables si le cos φ moyen mensuel descend sous 0.90 aux heures de pointe (18h - 22h).',
      penaltiesAndImbalances_en: 'Monthly reactive power penalties if average power factor drops below 0.90 during evening peak hours (18:00 - 22:00).'
    },
    faultLiabilityProtocol: {
      faultClearingCriteria_fr: 'Temps d\'élimination d\'un défaut sur départ HTA 30 kV : temporisation maximale protection départ = 0.35 s. Si le disjoncteur HTA refuse d\'ouvrir, déclenchement sélectif de la protection secours transformateur (amont) en 0.70 s.',
      faultClearingCriteria_en: 'Fault clearing time on 30 kV feeder: feeder relay trip time ≤ 0.35 s. Upon breaker failure, backup transformer protection trips selectively at 0.70 s.',
      recordingEquipment: 'Horodatage commun GPS des automates BCU et relais de protection numériques CEI 61850.',
      disputeResolution_fr: 'Analyse conjointe des oscilloperturbographies sous 48h pour déterminer si la coupure provient d\'un défaut réseau distribution ou d\'un incident amont transport.',
      disputeResolution_en: 'Joint fault record analysis within 48h to determine if incident originated on Eneo distribution or SONATREL transmission.'
    }
  },
  {
    id: 'boundary-dso-industrial',
    code: 'FRONT-03',
    title_fr: 'Frontière Réseau Distribution HTA (ENEO) ↔ Client Grand Compte / Industriel HTA',
    title_en: 'Distribution System Operator (ENEO) ↔ High-Voltage Industrial Client Boundary',
    upstreamParty: {
      name_fr: 'ENEO Cameroon (Réseau de Distribution HTA 30 kV ou 15 kV)',
      name_en: 'ENEO Cameroon (30 kV or 15 kV MV Distribution Network)',
      role_fr: 'Distributeur Concessionnaire',
      role_en: 'Distribution Utility',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    downstreamParty: {
      name_fr: 'Client Industriel Haute Tension (Cimenteries, Brasseries, Agro-industries, Mines)',
      name_en: 'High-Voltage Industrial Client (Cement, Breweries, Agro-industry, Mining)',
      role_fr: 'Client Éligible Grand Compte HTA',
      role_en: 'Eligible MV Large Industrial Account',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    legalFramework: {
      primaryLaw: 'Loi N° 2011/022 & Conditions Générales de Vente HTA Eneo approuvées ARSEL',
      decreesAndCodes: [
        'Norme NF C 13-100 (Postes de livraison établis à l\'intérieur d\'un bâtiment alimentés par un réseau de distribution HTA)',
        'Contrat Spécial de Fourniture d\'Énergie Électrique HTA',
        'Règlement de Sécurité et d\'Exploitation des Postes d\'Abonnés Privés'
      ],
      governingAuthority: 'ARSEL & Dépôt légal MINEE'
    },
    demarcationPoint: {
      physical_fr: 'Raccordement amont de l\'interrupteur-sectionneur général de livraison ou tête de câble d\'arrivée HTA dans le poste de livraison privé du client (NF C 13-100).',
      physical_en: 'Incoming line terminals of the main MV disconnector/circuit-breaker inside the client\'s private substation cubicle (per NF C 13-100).',
      electrical_fr: 'Tension assignée 30 kV ou 15 kV. Pouvoir de coupure assigné du disjoncteur de protection générale : 12.5 kA ou 16 kA symétrique.',
      electrical_en: 'Nominal 30 kV or 15 kV. Rated breaking capacity of main protection breaker: 12.5 kA or 16 kA symmetrical RMS.',
      metering_fr: 'Cellule de comptage HTA sous scellés Eneo : transformateurs de mesure combinés TC/TT dédiés et compteur communicant AMI avec liaison modem GPRS/4G.',
      metering_en: 'Sealed Eneo MV metering cubicle: dedicated revenue combined CT/VT units and smart AMI meter with cellular 4G modem telemetry.',
      scada_fr: 'Télé-signalisation vers le CCD Eneo : retour d\'état du disjoncteur général client et alarme déclenchement protection homopolaire / phase.',
      scada_en: 'Telemetry to Eneo DCC: client main breaker status feedback and phase/earth fault trip signaling.'
    },
    operationalResponsibilities: {
      frequencyAndActivePower_fr: 'Le client est tenu de ne pas dépasser sa Puissance Souscrite (PS). Tout dépassement de pointe déclenche des pénalités au kW supplémentaire.',
      frequencyAndActivePower_en: 'The industrial client must not exceed Subscribed Maximum Demand (PS). Peak overruns incur instantaneous kW surcharges.',
      voltageAndReactivePower_fr: 'Obligation de maintenir un facteur de puissance cos φ ≥ 0.93 (tan φ ≤ 0.40). Les installations inductives (moteurs > 100 kW) doivent comporter des batteries de condensateurs compensateurs automatiques avec selfs anti-harmoniques.',
      voltageAndReactivePower_en: 'Mandatory power factor cos φ ≥ 0.93 (tan φ ≤ 0.40). Large inductive motors (> 100 kW) require automatic capacitor banks with detuned reactors.',
      maintenanceAndInterlocking_fr: 'Le client est seul responsable de l\'entretien de son transformateur HTA/BT, de ses disjoncteurs BT et de la conformité de son installation intérieure (NF C 15-100). Eneo conserve l\'exclusivité d\'accès à la cellule comptage sous scellés.',
      maintenanceAndInterlocking_en: 'The customer is solely liable for internal MV/LV transformer, LV boards, and NF C 15-100 compliance. Eneo retains exclusive access to sealed metering cell.'
    },
    commercialAndFinancial: {
      meteringClass: 'Classe 0.5S (CEI 62053-22)',
      settlementFormula_fr: 'Tarification à 3 tranches horaires : Heures Pleines, Heures Creuses, Heures de Pointe (18h-22h) + Redevance de prime fixe de puissance (FCFA/kW/mois).',
      settlementFormula_en: '3-tier Time-of-Use tariff: Peak, Standard, Off-Peak + Monthly Capacity Charge (XAF/kW/month).',
      penaltiesAndImbalances_fr: 'Pénalités de réactif (facturation du kVARh excédentaire si tan φ > 0.40) et pénalités de dépassement de puissance souscrite.',
      penaltiesAndImbalances_en: 'Reactive power penalties (excess kVARh billing when tan φ > 0.40) and peak demand overrun fees.'
    },
    faultLiabilityProtocol: {
      faultClearingCriteria_fr: 'La protection générale du client (relais à maximum de courant indépendant) doit être sélective avec le départ Eneo : temps de coupure client ≤ 0.15 s pour éviter tout déclenchement du départ source public.',
      faultClearingCriteria_en: 'Client main protection relay must coordinate selectively with Eneo feeder: client clearing time ≤ 0.15 s to prevent upstream public feeder outage.',
      recordingEquipment: 'Horodatage et enregistrement des creux de tension dans la mémoire interne du compteur communicant.',
      disputeResolution_fr: 'Constat d\'expert agréé par l\'ARSEL en cas de dommages matériels allégués (surtension, claquage moteur, rupture de neutre).',
      disputeResolution_en: 'Certified ARSEL expert survey in case of disputed equipment damage (overvoltage, motor insulation burn, floating neutral).'
    }
  },
  {
    id: 'boundary-hydrology-gen',
    code: 'FRONT-04',
    title_fr: 'Frontière Régulation Hydrologique (EDC) ↔ Concessionnaires Turbinage Sanaga (ENEO / NHPC)',
    title_en: 'Hydrological Regulation (EDC) ↔ Sanaga Hydro Turbining Operators (ENEO / NHPC) Boundary',
    upstreamParty: {
      name_fr: 'Electricity Development Corporation (EDC) - Barrages Réservoirs',
      name_en: 'Electricity Development Corporation (EDC) - Storage Dams',
      role_fr: 'Gestionnaire Public des Réserves Hydrologiques Fluviales',
      role_en: 'Public Water Storage & River Flow Regulator',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    downstreamParty: {
      name_fr: 'Centrales Hydroélectriques de la Sanaga (Nachtigal 420 MW, Songloulou 384 MW, Edéa 276 MW)',
      name_en: 'Sanaga Hydropower Cascade Plants (Nachtigal 420 MW, Songloulou 384 MW, Edéa 276 MW)',
      role_fr: 'Exploitants de Centrales Hydroélectriques au Fil de l\'Eau',
      role_en: 'Run-of-River Hydropower Cascade Operators',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    legalFramework: {
      primaryLaw: 'Loi N° 2011/022 & Décrets portant statut du Barrage Régulateur de Lom Pangar',
      decreesAndCodes: [
        'Règlement d\'Exploitation Hydrologique du Bassin de la Sanaga (Lom Pangar, Mbakaou, Bamendjin, Mapé)',
        'Contrat de Redevance d\'Eau et d\'Étiage EDC - Producteurs Hydroélectriques',
        'Comité de Bassin de la Sanaga présidé par le MINEE'
      ],
      governingAuthority: 'MINEE (Ministère de l\'Eau et de l\'Énergie) & ARSEL'
    },
    demarcationPoint: {
      physical_fr: 'Section de restitution des eaux à l\'aval du barrage-réservoir de Lom Pangar et stations hydrométriques de jaugeage de Goura et Bélabo sur la Sanaga.',
      physical_en: 'Water release channel downstream of Lom Pangar reservoir dam and official Sanaga river flow gauging stations at Goura and Bélabo.',
      electrical_fr: 'Non applicable (frontière hydromécanique et de débit d\'eau volumique).',
      electrical_en: 'Not applicable (hydromechanical and volumetric flow rate boundary).',
      metering_fr: 'Stations limnigraphiques et débitmétriques automatiques télétransmises par satellite, jaugeant le débit instantané (m³/s) entrant dans le bief de Nachtigal.',
      metering_en: 'Automated satellite-linked limnimetric and flow gauging stations measuring instantaneous river flow (m³/s) reaching Nachtigal cascade.',
      scada_fr: 'Plateforme SCADA Hydrométéorologique centralisée EDC partagée en temps réel avec le CCR SONATREL et les salles de contrôle de Nachtigal et Songloulou.',
      scada_en: 'Centralized EDC hydrometeorological SCADA platform streaming real-time flow telemetry to SONATREL NCC and plant control rooms.'
    },
    operationalResponsibilities: {
      frequencyAndActivePower_fr: 'EDC a l\'obligation légale d\'assurer un débit régulé garanti d\'étiage d\'au moins 1050 m³/s à l\'entrée de Nachtigal et Songloulou pendant la saison sèche (décembre à mai), permettant à Nachtigal et Songloulou de tourner à pleine charge nominale.',
      frequencyAndActivePower_en: 'EDC is contractually bound to maintain guaranteed dry-season river flow of at least 1050 m³/s to Nachtigal and Songloulou, securing full rated active power output.',
      voltageAndReactivePower_fr: 'La disponibilité du débit conditionne directement la capacité des alternateurs à fournir la puissance réactive nécessaire au soutien de tension du RIS.',
      voltageAndReactivePower_en: 'Water flow availability directly governs synchronous generator capacity to supply inductive Mvar required for RIS voltage support.',
      maintenanceAndInterlocking_fr: 'Gestion coordonnée des crues : en période pluvieuse (septembre - novembre), EDC et les exploitants coordonnent l\'ouverture des vannes d\'évacuation de crue pour éviter toute submersion d\'usine.',
      maintenanceAndInterlocking_en: 'Coordinated flood management: during high-water season (September - November), spillway gates are synchronized to prevent plant flooding.'
    },
    commercialAndFinancial: {
      meteringClass: 'Jaugeage acoustique Doppler ADCP (Précision ±1.0% sur débit volumique)',
      settlementFormula_fr: 'Redevance d\'eau et de stockage hydroélectrique versée par les producteurs (FCFA/kWh turbiné grâce à la régulation de Lom Pangar) selon décret tarifaire.',
      settlementFormula_en: 'Hydrological storage royalty paid by power producers (XAF/kWh generated enabled by Lom Pangar regulation) per regulatory decree.',
      penaltiesAndImbalances_fr: 'Indemnités dues en cas de non-respect du débit garanti d\'étiage entraînant des déficits de production sur le réseau interconnecté Sud.',
      penaltiesAndImbalances_en: 'Contractual financial damages if dry-season flow drops below guaranteed baseline causing generation shortfalls on the RIS.'
    },
    faultLiabilityProtocol: {
      faultClearingCriteria_fr: 'En cas de rupture d\'ouvrage ou d\'erreur de manœuvre de vannes, application du protocole d\'alerte PUI (Plan d\'Urgence Interne) et responsabilité civile de l\'exploitant de barrage.',
      faultClearingCriteria_en: 'Dam integrity failure or spillway maneuvering errors trigger internal emergency response protocol (PUI) with strict operator civil liability.',
      recordingEquipment: 'Réseau de capteurs piézométriques, inclinomètres de barrage et stations de jaugeage satellitaires redondantes.',
      disputeResolution_fr: 'Arbitrage par le Comité Interministériel de l\'Eau et de l\'Énergie sous tutelle du Premier Ministère.',
      disputeResolution_en: 'Interministerial Water & Energy Committee arbitration under the Prime Minister\'s office.'
    }
  }
];
