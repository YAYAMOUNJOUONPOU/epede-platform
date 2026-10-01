// src/components/substations/data/substationTypesData.ts
// EPEDE D04 - Comprehensive Substation Types & Classification Catalog

export interface SubstationTypeDefinition {
  id: string;
  name_fr: string;
  name_en: string;
  category: 'TRANSMISSION' | 'TRANSFORMATION' | 'SWITCHING' | 'DISTRIBUTION_INTERFACE' | 'SPECIALIZED';
  role_fr: string;
  role_en: string;
  representative_voltage: string;
  technology: 'AIS' | 'GIS' | 'HYBRID' | 'ANY' | 'AIS / GIS' | 'AIS / GIS / HYBRID' | 'AIS / GIS / INDOOR';
  primary_topology: string;
  main_equipment_fr: string[];
  main_equipment_en: string[];
  protection_focus_fr: string;
  protection_focus_en: string;
  auxiliary_criticality_fr: string;
  auxiliary_criticality_en: string;
  footprint_indicative: string;
  typical_capex_indicative: string;
  advantages_fr: string[];
  advantages_en: string[];
  limitations_fr: string[];
  limitations_en: string[];
  typical_applications_fr: string;
  typical_applications_en: string;
  upstream_interface_fr: string;
  upstream_interface_en: string;
  downstream_interface_fr: string;
  downstream_interface_en: string;
}

export const SUBSTATION_TYPES_CATALOG: SubstationTypeDefinition[] = [
  {
    id: 'SUB_TRANS_AIS',
    name_fr: 'Poste de Transport Ouvert (AIS)',
    name_en: 'Transmission Substation (AIS)',
    category: 'TRANSMISSION',
    role_fr: 'Nœud stratégique de maillage et d\'interconnexion du réseau de transport haute tension (225/400 kV).',
    role_en: 'Strategic meshing and interconnection node of the high-voltage transmission grid (225/400 kV).',
    representative_voltage: '400 kV / 225 kV',
    technology: 'AIS',
    primary_topology: 'Double Jeu de Barres (Double Busbar) ou Disjoncteur et Demi (1½ CB)',
    main_equipment_fr: [
      'Portiques d\'amarrage des lignes aériennes',
      'Disjoncteurs à coupure dans le SF6 (Live-Tank)',
      'Sectionneurs rotatifs ou pantographes',
      'Sectionneurs de terre rapides et de maintenance',
      'Jeux de barres rigides en tubes d\'aluminium',
      'Transformateurs combinés ou séparés (TC + TTT/CVT)',
      'Parafoudres à oxyde de zinc (ZnO)'
    ],
    main_equipment_en: [
      'Overhead line termination gantries',
      'SF6 live-tank circuit breakers',
      'Center-break or pantograph disconnectors',
      'Fast-acting and maintenance earthing switches',
      'Rigid aluminum tubular busbars',
      'Instrument transformers (CT + VT/CVT)',
      'Zinc-oxide (ZnO) surge arresters'
    ],
    protection_focus_fr: 'Protection différentielle de barres 87B, distance 21/21N, défaillance disjoncteur 50BF.',
    protection_focus_en: 'Busbar differential 87B, distance 21/21N, breaker failure 50BF.',
    auxiliary_criticality_fr: 'Critique classe A : Double batterie 110 Vcc, double chargeur, groupe diesel de secours.',
    auxiliary_criticality_en: 'Class A Critical: Dual 110 V DC battery banks, dual chargers, emergency diesel generator.',
    footprint_indicative: '25 000 à 45 000 m²',
    typical_capex_indicative: 'Référence de base (1.0x)',
    advantages_fr: [
      'Coût initial d\'acquisition des appareillages plus modéré',
      'Visibilité immédiate de l\'état mécanique des sectionneurs (coupure visible)',
      'Simplicité des opérations d\'extension future de travées',
      'Refroidissement thermique naturel optimal dans l\'air ambiant'
    ],
    advantages_en: [
      'Lower initial equipment purchase cost',
      'Immediate visual verification of disconnector open contacts (visible break)',
      'Straightforward civil and electrical future bay extensions',
      'Optimal natural convective air cooling'
    ],
    limitations_fr: [
      'Emprise foncière très vaste (2,5 à 4,5 hectares)',
      'Vulnérabilité aux intempéries, à la foudre directe et à la pollution saline/industrielle',
      'Nécessite des distances d\'isolement importantes dans l\'air (2,5 à 3,5 m à 225 kV)'
    ],
    limitations_en: [
      'Massive land footprint requirement (2.5 to 4.5 hectares)',
      'Direct exposure to weather, lightning strikes, and saline/industrial pollution',
      'Mandatory large phase-to-phase air clearances (2.5 to 3.5 m at 225 kV)'
    ],
    typical_applications_fr: 'Postes d\'interconnexion régionale, arrivées de grandes centrales hydrauliques (ex. Nachtigal, Mangombe, Bekoko).',
    typical_applications_en: 'Regional interconnection nodes, large hydro evacuations (e.g. Nachtigal, Mangombe, Bekoko).',
    upstream_interface_fr: 'Lignes de transport 225 kV / 400 kV issues des centrales ou d\'autres postes.',
    upstream_interface_en: '225 kV / 400 kV transmission lines from power plants or adjacent grid nodes.',
    downstream_interface_fr: 'Liaisons vers postes de sous-transport ou transformateurs d\'abaissement.',
    downstream_interface_en: 'Feeders to regional sub-transmission substations or primary step-down transformers.'
  },
  {
    id: 'SUB_TRANS_GIS',
    name_fr: 'Poste Sous Enveloppe Métallique (GIS)',
    name_en: 'Gas-Insulated Substation (GIS)',
    category: 'TRANSMISSION',
    role_fr: 'Nœud de transport ultra-compact et hermétique pour zones urbaines denses ou environnements pollués.',
    role_en: 'Ultra-compact hermetic transmission node for dense urban areas or aggressive environments.',
    representative_voltage: '400 kV / 225 kV / 90 kV',
    technology: 'GIS',
    primary_topology: 'Double Jeu de Barres ou Disjoncteur et Demi Encastré',
    main_equipment_fr: [
      'Compartiments blindés sous gaz SF6 étanches à la terre',
      'Disjoncteurs blindés tripolaires ou monopolaires',
      'Sectionneurs et sectionneurs de terre blindés à commande motorisée',
      'Jeux de barres blindés coaxiaux',
      'Traversées air/gaz ou interfaces directes câbles/gaz (sealing ends)',
      'Densimètres de gaz avec alarme basse pression et blocage'
    ],
    main_equipment_en: [
      'Earthed aluminum gas-tight compartments with SF6/eco-gas',
      'Enclosed single-pole or three-pole circuit breakers',
      'Motorized enclosed disconnectors and high-speed earth switches',
      'Coaxial gas-insulated busbar tubes',
      'Outdoor SF6-to-air bushings or direct cable plug-in sealing ends',
      'Gas density monitors with low-pressure alarm and lockout stages'
    ],
    protection_focus_fr: 'Protection différentielle de jeu de barres 87B rapide, capteurs de décharges partielles (UHF PD).',
    protection_focus_en: 'High-speed 87B bus differential protection, online UHF partial discharge (PD) monitoring.',
    auxiliary_criticality_fr: 'Critique classe A : Énergie de commande disjoncteurs, surveillance permanente du gaz.',
    auxiliary_criticality_en: 'Class A Critical: Circuit breaker operating energy, continuous gas monitoring.',
    footprint_indicative: '2 500 à 4 500 m² (10% de l\'AIS équivalent)',
    typical_capex_indicative: '1.4x à 1.8x l\'AIS (hors coût foncier)',
    advantages_fr: [
      'Emprise au sol divisée par 8 à 10 par rapport à un poste AIS',
      'Immunité totale aux conditions météorologiques, pollution, poussière et embruns marins',
      'Sécurité humaine maximale (enveloppes métalliques reliées à la terre, zéro risque de contact direct)',
      'Fréquence de maintenance réduite (MTBF > 30 ans sur les compartiments primaires)'
    ],
    advantages_en: [
      'Land footprint divided by 8 to 10 compared to an open AIS layout',
      'Total immunity to weather extremes, dust, salt fog, and environmental pollution',
      'Maximum human touch safety (earthed metal enclosures, zero risk of live contact)',
      'Extended maintenance intervals (MTBF > 30 years for primary enclosed chambers)'
    ],
    limitations_fr: [
      'Coût initial d\'investissement en appareillage plus élevé',
      'Temps moyen de réparation (MTTR) plus long en cas de défaut interne (dégazage/retraitement)',
      'Gestion environnementale rigoureuse du gaz SF6 ou sélection de gaz alternatifs'
    ],
    limitations_en: [
      'Higher initial switchgear procurement and factory testing Capex',
      'Longer Mean Time to Repair (MTTR) in case of internal compartment flashover',
      'Stringent environmental greenhouse gas reporting or alternative fluoronitrile gas handling'
    ],
    typical_applications_fr: 'Centres urbains denses (Douala, Yaoundé), zones industrielles côtières, sites souterrains.',
    typical_applications_en: 'Dense metropolitan city centers (Douala, Yaoundé), coastal chemical hubs, underground stations.',
    upstream_interface_fr: 'Câbles souterrains 225 kV ou lignes aériennes via traversées de transition.',
    upstream_interface_en: '225 kV underground cable circuits or overhead lines via transition yard bushings.',
    downstream_interface_fr: 'Câbles souterrains vers les postes sources et transformateurs de distribution.',
    downstream_interface_en: 'Underground cables feeding city distribution substations and step-down transformers.'
  },
  {
    id: 'SUB_STEP_UP',
    name_fr: 'Poste Évacuateur de Centrale (Step-Up)',
    name_en: 'Generation Switchyard / Step-Up Substation',
    category: 'TRANSFORMATION',
    role_fr: 'Élève la tension de génération (11-18 kV) vers la très haute tension (225-400 kV) pour évacuer l\'énergie.',
    role_en: 'Steps up generator voltage (11-18 kV) to EHV/HV (225-400 kV) for long-distance bulk power evacuation.',
    representative_voltage: '15 kV → 225 kV / 400 kV',
    technology: 'AIS / GIS',
    primary_topology: 'Schéma Unitaire Groupe-Transformateur ou Double Barres',
    main_equipment_fr: [
      'Transformateurs élévateurs de groupe (GSU - Generator Step-Up)',
      'Gaines à barres sous enveloppe isolée (IPB - Isolated Phase Bus)',
      'Disjoncteurs de générateur (GCB) à fort pouvoir de coupure',
      'Disjoncteurs côté THT',
      'Systèmes de synchronisation (ANSI 25)',
      'Parafoudres d\'entrée/sortie'
    ],
    main_equipment_en: [
      'Generator Step-Up (GSU) power transformers',
      'Isolated Phase Bus (IPB) ductwork',
      'High-current Generator Circuit Breakers (GCB)',
      'HV side circuit breakers',
      'Synchro-check units (ANSI 25)',
      'Surge arresters'
    ],
    protection_focus_fr: 'Protection différentielle bloc alternateur-transformateur 87G/87T, perte d\'excitation 40, retour de puissance 32R.',
    protection_focus_en: 'Unit differential 87G/87T, loss of field 40, reverse power 32R, out-of-step 78.',
    auxiliary_criticality_fr: 'Double alimentation depuis les auxiliaires de tranche et le réseau secours (Black-start).',
    auxiliary_criticality_en: 'Dual supply from unit auxiliaries and emergency standby grid (Black-start ready).',
    footprint_indicative: '15 000 à 30 000 m²',
    typical_capex_indicative: 'Élevé (transformateurs GSU de forte puissance 100-300 MVA)',
    advantages_fr: [
      'Réduit drastiquement les courants transitants (I = P / √3 U), minimisant les pertes Joule de transport',
      'Permet d\'injecter de gigantesques puissances (ex. 420 MW Nachtigal) sur le réseau national'
    ],
    advantages_en: [
      'Drastically reduces current transits, minimizing transmission Joule losses',
      'Enables massive power injection (e.g. 420 MW Nachtigal) into national interconnected grid'
    ],
    limitations_fr: [
      'Contraintes thermiques extrêmes sur le GSU (fortes harmoniques et courants de court-circuit)',
      'Dépendance totale de la tranche de production à la disponibilité du poste'
    ],
    limitations_en: [
      'Severe thermal stresses on GSU transformers (generator harmonics, DC offset faults)',
      'Single-point of failure: generator unit shutdown if GSU bay is disabled'
    ],
    typical_applications_fr: 'Poste d\'évacuation de la centrale hydroélectrique de Nachtigal (7x60 MW), Songloulou, Edéa.',
    typical_applications_en: 'Nachtigal hydroelectric evacuation yard (7x60 MW), Songloulou, Edéa.',
    upstream_interface_fr: 'Alternateurs synchrones hydroélectriques ou thermiques (11 à 18 kV).',
    upstream_interface_en: 'Synchronous hydro/thermal alternators (11 to 18 kV).',
    downstream_interface_fr: 'Lignes de transport 225 kV vers les grands centres de charge.',
    downstream_interface_en: '225 kV transmission lines toward metropolitan load centers.'
  },
  {
    id: 'SUB_STEP_DOWN',
    name_fr: 'Poste Source d\'Abaissement (Step-Down)',
    name_en: 'Primary Step-Down Substation',
    category: 'TRANSFORMATION',
    role_fr: 'Abaisse la tension de transport (225 kV) vers la sous-répartition (90 kV) ou la distribution (30/15 kV).',
    role_en: 'Steps down bulk transmission voltage (225 kV) to sub-transmission (90 kV) or primary distribution (30/15 kV).',
    representative_voltage: '225 kV → 90 kV / 15 kV',
    technology: 'AIS / GIS / HYBRID',
    primary_topology: 'Double Jeu de Barres HTB avec Transformateurs en Parallèle',
    main_equipment_fr: [
      'Transformateurs de puissance abaisseurs 225/90/15 kV (ex. 63 MVA ou 100 MVA)',
      'Régleurs en charge (OLTC - On-Load Tap Changer)',
      'Disjoncteurs 225 kV et 90 kV',
      'Tableau moyenne tension sous enveloppe métallique (MV Switchgear 15/30 kV)',
      'Résistances de mise à la terre du neutre (RMN / NGR)',
      'Batteries de condensateurs de compensation MT'
    ],
    main_equipment_en: [
      'Step-down power transformers 225/90/15 kV (e.g. 63 MVA or 100 MVA)',
      'On-Load Tap Changers (OLTC)',
      '225 kV and 90 kV circuit breakers',
      'Metal-clad Medium Voltage distribution switchgear (15/30 kV)',
      'Neutral Grounding Resistors (NGR)',
      'MV power-factor correction capacitor banks'
    ],
    protection_focus_fr: 'Différentielle transformateur 87T, masse-cuve, surintensité à temps inverse 51, Buchholz.',
    protection_focus_en: 'Transformer differential 87T, restricted earth fault 87N, inverse overcurrent 51, Buchholz.',
    auxiliary_criticality_fr: 'Critique classe A : Déclenchement HT/MT, moteurs OLTC, régulation automatique de tension.',
    auxiliary_criticality_en: 'Class A Critical: Dual HV/MV trip coils, OLTC drive motors, Automatic Voltage Regulator.',
    footprint_indicative: '10 000 à 25 000 m²',
    typical_capex_indicative: 'Standard (1.2x)',
    advantages_fr: [
      'Régulation fine de la tension délivrée aux consommateurs via le régleur en charge',
      'Redondance N-1 assurée par la mise en parallèle de deux ou trois transformateurs',
      'Séparation nette entre le transport haute tension et la distribution régionale'
    ],
    advantages_en: [
      'Tight secondary voltage regulation via On-Load Tap Changers',
      'Reliable N-1 redundancy provided by dual or triple parallel power transformers',
      'Clear demarcation between bulk transmission and local distribution grid'
    ],
    limitations_fr: [
      'Courants de court-circuit élevés côté secondaire nécessitant des jeux de barres robustes',
      'Bruit acoustique des transformateurs et risques d\'incendie d\'huile à gérer'
    ],
    limitations_en: [
      'High prospective short-circuit currents on the secondary MV busbars',
      'Acoustic noise and transformer mineral oil fire risk requiring blast walls'
    ],
    typical_applications_fr: 'Postes sources de Bekoko 225/90 kV, Oyomabang 225/90/15 kV, Nyom II 225/90 kV.',
    typical_applications_en: 'Primary distribution nodes: Bekoko 225/90 kV, Oyomabang 225/90/15 kV, Nyom II.',
    upstream_interface_fr: 'Lignes de transport 225 kV.',
    upstream_interface_en: '225 kV transmission lines.',
    downstream_interface_fr: 'Réseau 90 kV vers villes secondaires et départs 15 kV urbains.',
    downstream_interface_en: '90 kV sub-transmission lines to regional towns and 15 kV urban feeders.'
  },
  {
    id: 'SUB_SWITCHING',
    name_fr: 'Poste d\'Aiguillage & Manœuvre (Switching)',
    name_en: 'Switching Substation (Pure Node / No Trafo)',
    category: 'SWITCHING',
    role_fr: 'Poste de maillage pur sans transformateur : interconnecte, sectionne et dérive plusieurs lignes HTB.',
    role_en: 'Pure switching node without power transformers: routes, interconnects, and bypasses multiple HV lines.',
    representative_voltage: '225 kV / 400 kV',
    technology: 'AIS / GIS',
    primary_topology: 'Double Jeu de Barres avec Tronçonnement ou Anneau (Ring Bus)',
    main_equipment_fr: [
      'Disjoncteurs de ligne et de couplage',
      'Sectionneurs d\'aiguillage barres 1 et 2',
      'Sectionneurs de tronçonnement de jeux de barres',
      'Transformateurs de mesure pour chaque départ',
      'Équipements de téléconduite SCADA'
    ],
    main_equipment_en: [
      'Line and bus-coupler circuit breakers',
      'Bus selector disconnectors for Bus 1 and Bus 2',
      'Busbar sectionalizing disconnectors and breakers',
      'Instrument transformers on all terminating lines',
      'SCADA telecontrol RTUs'
    ],
    protection_focus_fr: 'Protection de barres 87B, protections de ligne 21/87L aux deux extrémités, téléactions POTT.',
    protection_focus_en: '87B busbar differential, 21/87L line distance/differential at all terminals, POTT teleprotection.',
    auxiliary_criticality_fr: 'Moyenne : Pas de charges thermiques de transformateurs, batteries pour relais et disjoncteurs.',
    auxiliary_criticality_en: 'Medium: Zero transformer cooling loads, battery supply strictly for IEDs and trip coils.',
    footprint_indicative: '8 000 à 18 000 m²',
    typical_capex_indicative: 'Modéré (pas de transformateurs de puissance)',
    advantages_fr: [
      'Grande flexibilité d\'exploitation du réseau (aiguillage des transits)',
      'Possibilité d\'isoler un tronçon de ligne en défaut sans perturber les autres artères',
      'Coût de maintenance très faible par rapport aux postes de transformation'
    ],
    advantages_en: [
      'Exceptional operational grid flexibility (re-routing bulk power transits)',
      'Enables rapid isolation of faulted lines while preserving through-transits',
      'Significantly lower maintenance cost compared to transformation substations'
    ],
    limitations_fr: [
      'Ne modifie pas le niveau de tension (aucun rôle d\'adaptation de tension)',
      'Nécessite des protections de barres ultra-fiables pour éviter un écroulement de nœud'
    ],
    limitations_en: [
      'Does not transform voltage (strictly a switching routing node)',
      'Requires ultra-reliable busbar protection to prevent losing multiple interconnections'
    ],
    typical_applications_fr: 'Nœuds de dérivation de corridors de transport, postes de coupure en pleine ligne.',
    typical_applications_en: 'Major transmission line junctions, mid-corridor sectionalizing switchyards.',
    upstream_interface_fr: 'Plusieurs lignes HTB 225 kV convergentes.',
    upstream_interface_en: 'Multiple incoming 225 kV transmission lines.',
    downstream_interface_fr: 'Lignes HTB 225 kV rayonnantes.',
    downstream_interface_en: 'Multiple outgoing 225 kV transmission lines.'
  },
  {
    id: 'SUB_INTERCO',
    name_fr: 'Poste d\'Interconnexion Régionale / Internationale',
    name_en: 'Grid Interconnection Substation',
    category: 'TRANSMISSION',
    role_fr: 'Point d\'échange d\'énergie entre réseaux nationaux indépendants (Pools énergétiques : WAPP, PEAC).',
    role_en: 'Power exchange point between independent national grids (Regional Power Pools: WAPP, CAPP/PEAC).',
    representative_voltage: '400 kV / 225 kV',
    technology: 'AIS / GIS',
    primary_topology: 'Disjoncteur et Demi (Breaker-and-a-Half) ou Double Barres Sécurisé',
    main_equipment_fr: [
      'Disjoncteurs à très fort pouvoir de coupure (50-63 kA)',
      'Compteurs d\'énergie de facturation classe 0.2S redondants (Main & Backup)',
      'Systèmes de contrôle de synchronisme précis (ANSI 25)',
      'Réactances shunt de compensation de ligne capacitive',
      'Passerelles de télécommunication inter-dispatchings redondantes'
    ],
    main_equipment_en: [
      'High interrupting capacity circuit breakers (50-63 kA)',
      'Redundant revenue class 0.2S energy meters (Main & Check)',
      'High-precision synchro-check relays (ANSI 25)',
      'Line shunt reactors for capacitive charging compensation',
      'Dual-redundant inter-control center telecommunication links'
    ],
    protection_focus_fr: 'Contrôle de synchronisme 25, déclenchement d\'interconnexion sur perte de synchronisme 78, comptage 0.2S.',
    protection_focus_en: 'Synchro-check 25, out-of-step trip 78, high-accuracy 0.2S revenue metering, PTP time sync.',
    auxiliary_criticality_fr: 'Critique absolue : Double redondance intégrale télécoms, comptage et alimentations CC.',
    auxiliary_criticality_en: 'Absolute Critical: Complete redundancy for revenue metering, SCADA, and dual DC sources.',
    footprint_indicative: '30 000 à 50 000 m²',
    typical_capex_indicative: 'Très élevé (hautes performances et comptage certifié)',
    advantages_fr: [
      'Facilite le commerce d\'électricité transfrontalier et le partage de réserve de secours',
      'Renforce la stabilité dynamique globale des réseaux interconnectés'
    ],
    advantages_en: [
      'Enables cross-border energy trading and mutual spinning reserve sharing',
      'Substantially improves transient stability of interconnected power systems'
    ],
    limitations_fr: [
      'Exige une coordination stricte des codes de réseau et des réglages de protection transfrontaliers',
      'Risque de propagation de perturbations majeures en cas de black-out'
    ],
    limitations_en: [
      'Requires harmonized grid codes and strict international relay setting coordination',
      'Risk of cascade disturbance propagation during regional blackout events'
    ],
    typical_applications_fr: 'Liaisons d\'interconnexion Cameroun - Tchad (225 kV), Nigeria - Cameroun.',
    typical_applications_en: 'Cameroon - Chad 225 kV tie-line, WAPP/PEAC cross-border nodes.',
    upstream_interface_fr: 'Réseau de transport national 225 kV.',
    upstream_interface_en: 'National 225 kV interconnected transmission backbone.',
    downstream_interface_fr: 'Ligne d\'interconnexion transfrontalière 225 kV / 400 kV.',
    downstream_interface_en: 'Cross-border 225 kV / 400 kV intertie transmission line.'
  },
  {
    id: 'SUB_HYBRID',
    name_fr: 'Poste Hybride / Mixte (MTS - Mixed Technology)',
    name_en: 'Hybrid Substation (MTS)',
    category: 'TRANSMISSION',
    role_fr: 'Associe des jeux de barres aériens classiques AIS avec des blocs compacts disjoncteur-sectionneur blindés GIS.',
    role_en: 'Combines open AIS busbars with compact gas-insulated circuit breaker/disconnector modules.',
    representative_voltage: '225 kV / 90 kV',
    technology: 'HYBRID',
    primary_topology: 'Simple ou Double Jeu de Barres AIS avec Modules Blindés Hybrides',
    main_equipment_fr: [
      'Modules intégrés disjoncteur + sectionneur + TC/TT sous enveloppe métallique SF6',
      'Jeux de barres ouverts aériens AIS',
      'Traversées directes air-gaz de raccordement aux barres',
      'Armoire de commande locale intégrée au module'
    ],
    main_equipment_en: [
      'Integrated circuit breaker + disconnector + CT/VT enclosed modules',
      'Conventional open-air AIS busbars',
      'Direct air-to-gas transition bushings',
      'Module-mounted integrated local control cabinet'
    ],
    protection_focus_fr: 'Protection de ligne standard 21/87L avec interface compacte de mesure.',
    protection_focus_en: 'Standard line 21/87L relaying with integrated sensor outputs.',
    auxiliary_criticality_fr: 'Standard classe A.',
    auxiliary_criticality_en: 'Standard Class A.',
    footprint_indicative: '50% d\'un poste AIS standard',
    typical_capex_indicative: '1.2x l\'AIS',
    advantages_fr: [
      'Solution idéale pour l\'extension de postes AIS existants sans extension foncière',
      'Réduction notable de l\'emprise au sol tout en gardant des barres aériennes simples d\'accès',
      'Délai de montage et de mise en service sur site accéléré (modules testés en usine)'
    ],
    advantages_en: [
      'Ideal for brownfield expansion of existing AIS substations with zero land growth',
      'Significant footprint reduction while preserving easy-access overhead busbars',
      'Rapid on-site installation and commissioning (pre-tested factory modules)'
    ],
    limitations_fr: [
      'Mixité technologique exigeant des compétences mixtes AIS et GIS pour la maintenance',
      'Présence de gaz SF6 à surveiller sur chaque module'
    ],
    limitations_en: [
      'Technology hybridization requiring maintenance crews trained on both AIS and GIS',
      'SF6 inventory management on individual bay modules'
    ],
    typical_applications_fr: 'Modernisation et extension de postes anciens saturés (ex. ajout de départs à Mangombe).',
    typical_applications_en: 'Brownfield upgrades of congested legacy substations (e.g. adding bays at Mangombe).',
    upstream_interface_fr: 'Lignes de transport 225 kV / 90 kV.',
    upstream_interface_en: '225 kV / 90 kV incoming transmission lines.',
    downstream_interface_fr: 'Transformateurs ou départs de distribution.',
    downstream_interface_en: 'Power transformers or outgoing sub-transmission lines.'
  },
  {
    id: 'SUB_HV_MV',
    name_fr: 'Poste de Distribution Primaire (HV/MV Substation)',
    name_en: 'Primary Distribution Substation (HV/MV)',
    category: 'DISTRIBUTION_INTERFACE',
    role_fr: 'Abaisse la haute tension (90 kV ou 225 kV) en moyenne tension (15 ou 30 kV) pour alimenter les villes et usines.',
    role_en: 'Transforms HV (90 kV or 225 kV) into MV (15 kV or 30 kV) to feed urban districts and industrial clients.',
    representative_voltage: '90 kV → 15 kV / 30 kV',
    technology: 'AIS / GIS / INDOOR',
    primary_topology: 'Simple ou Double Barres HTB vers Rames Moyenne Tension Compartimentées',
    main_equipment_fr: [
      'Transformateurs HT/MT 90/15 kV (20 à 40 MVA)',
      'Tableaux moyenne tension à coupure sous vide ou SF6 (Cellules départs, arrivées, couplage)',
      'Transformateur de mise à la terre (TMT) avec résistance limitatrice (NGR)',
      'Bobines de point neutre ou bobines de Petersen',
      'Gradateurs ou réactances de compensation',
      'Automates de reprise de service après incident (ADA / Flisr)'
    ],
    main_equipment_en: [
      'HV/MV step-down transformers 90/15 kV (20 to 40 MVA)',
      'Metal-clad MV switchgear with vacuum or SF6 breakers (Incomers, Feeders, Bus Tie)',
      'Neutral Grounding Transformer (NGT) with grounding resistor (NGR)',
      'Arc suppression coil (Petersen coil) where applicable',
      'Distribution Automation System (FLISR / Automatic restoration)'
    ],
    protection_focus_fr: 'Protection à maximum de courant directionnel 67/67N, détection défaut terre sensible 50/51Ns, délestage U/f 81.',
    protection_focus_en: 'Directional overcurrent 67/67N, sensitive earth fault 50/51Ns, underfrequency load shedding 81U.',
    auxiliary_criticality_fr: 'Classe B : Alimentation 48 Vcc ou 110 Vcc pour déclencheurs de cellules et automate de poste.',
    auxiliary_criticality_en: 'Class B: 48 V or 110 V DC battery for MV switchgear trip coils and local RTU.',
    footprint_indicative: '3 000 à 8 000 m²',
    typical_capex_indicative: 'Standard distribution (0.8x)',
    advantages_fr: [
      'Proximité immédiate des centres de consommation urbains',
      'Régulation de tension adaptée au profil de charge de la clientèle',
      'Alimentation sélective et élimination rapide des défauts sur départs radiaux'
    ],
    advantages_en: [
      'Close physical proximity to urban electrical consumption centers',
      'Tailored voltage regulation aligned with consumer load curves',
      'High-speed selective fault clearing on radial distribution feeders'
    ],
    limitations_fr: [
      'Exposition fréquente aux défauts fugitifs sur les réseaux aériens moyenne tension',
      'Contraintes sonores et d\'intégration architecturale en milieu habité'
    ],
    limitations_en: [
      'High incidence of transient faults on overhead distribution feeder networks',
      'Acoustic noise and urban architectural integration constraints'
    ],
    typical_applications_fr: 'Postes urbains de Douala (Bassa, Bonabéri) et Yaoundé (Kondengui, Biyem-Assi).',
    typical_applications_en: 'Urban distribution nodes in Douala (Bassa, Bonabéri) and Yaoundé (Kondengui).',
    upstream_interface_fr: 'Lignes 90 kV ou 225 kV du réseau de transport.',
    upstream_interface_en: '90 kV or 225 kV incoming transmission lines.',
    downstream_interface_fr: '10 à 30 départs souterrains ou aériens 15/30 kV vers les postes MT/BT.',
    downstream_interface_en: '10 to 30 underground or overhead 15/30 kV feeders to MV/LV substations.'
  }
];
