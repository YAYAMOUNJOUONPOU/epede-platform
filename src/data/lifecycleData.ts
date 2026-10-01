// src/data/lifecycleData.ts
// EPEDE Project Lifecycle (L03) - Canonical EPC Power Engineering Workflow & Gate Review Protocol
// Aligned with IEC, IEEE, FIDIC Silver/Yellow Book, and Cameroon Grid Interconnection Standards

import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';
import type { SimulationTabType } from '../components/simulation/SimulationLabView';

export interface LifecycleDeliverable {
  id: string;
  code: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  responsible_role: string;
  verifying_role: string;
  applicable_standards: string[];
  associated_calculator?: CalculatorTabType;
  associated_simulation?: SimulationTabType;
  is_mandatory_for_gate: boolean;
}

export interface GateReviewCriterion {
  id: string;
  clause: string;
  requirement_fr: string;
  requirement_en: string;
  acceptance_threshold: string;
  verification_method: string;
}

export interface ProjectPhase {
  id: string;
  phase_number: number;
  code: string;
  title_fr: string;
  title_en: string;
  subtitle_fr: string;
  subtitle_en: string;
  objective_fr: string;
  objective_en: string;
  gate_name_fr: string;
  gate_name_en: string;
  gate_code: string;
  typical_duration_months: string;
  key_actors: string[];
  deliverables: LifecycleDeliverable[];
  gate_criteria: GateReviewCriterion[];
  risk_factors: {
    fr: string;
    en: string;
  }[];
}

export const LIFECYCLE_PHASES: ProjectPhase[] = [
  {
    id: 'phase-1-feasibility',
    phase_number: 1,
    code: 'PH-01',
    title_fr: 'Étude d\'Opportunité, Faisabilité & Schéma Directeur',
    title_en: 'Opportunity, Feasibility & Power System Master Plan',
    subtitle_fr: 'Évaluation des besoins réseau, transit de puissance préliminaire et modèle LCOE',
    subtitle_en: 'Grid capacity assessment, preliminary power flow and levelized cost model',
    objective_fr: 'Démontrer la viabilité technique, environnementale et économique du projet électrique avant tout engagement financier lourd.',
    objective_en: 'Demonstrate the technical, environmental and economic viability of the power project prior to capital allocation.',
    gate_name_fr: 'DG1 - Décision de Lancement des Études de Base (Pre-FEED Clearance)',
    gate_name_en: 'DG1 - Pre-FEED Clearance & Strategic Investment Approval',
    gate_code: 'GATE-01',
    typical_duration_months: '3 à 6 mois',
    key_actors: [
      'Ingénieur Planification Réseau (D02)',
      'Ingénieur Économiste de l\'Énergie',
      'Expert Environnemental & Social (EIES)',
      'Direction de la Planification SONATREL / ARSEL'
    ],
    risk_factors: [
      {
        fr: 'Sous-évaluation de la capacité d\'évacuation du réseau de transport local (congestion 225 kV / 90 kV)',
        en: 'Underestimation of transmission grid hosting capacity and nodal congestion at 225 kV / 90 kV'
      },
      {
        fr: 'Écart hydrologique ou solaire majeur par rapport aux moyennes trentenaires',
        en: 'Significant hydrology or solar irradiance deviation against 30-year meteorological baselines'
      }
    ],
    deliverables: [
      {
        id: 'del-01-01',
        code: 'DEL-FS-01',
        title_fr: 'Étude de Raccordement au Réseau National (Impact Réseau)',
        title_en: 'Grid Interconnection Impact Study (Hosting Capacity)',
        description_fr: 'Analyse d\'impact sur le Réseau Interconnecté (RIS / RIN) : transit de puissance N-1, marge de stabilité et tenue en tension aux jeux de barres.',
        description_en: 'System impact analysis on interconnected transmission grid: N-1 contingency power flow, voltage stability margin.',
        responsible_role: 'Ingénieur Études Réseau',
        verifying_role: 'Opérateur Système de Transport (SONATREL)',
        applicable_standards: ['Code Réseau ARSEL', 'IEEE 399', 'CEI 60071'],
        associated_simulation: 'transient-stability',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-01-02',
        code: 'DEL-FS-02',
        title_fr: 'Schéma Unifilaire Conceptuel (Single Line Diagram préliminaire)',
        title_en: 'Conceptual Single Line Diagram (Preliminary SLD)',
        description_fr: 'Architecture générale d\'évacuation ou de distribution, niveau de tension nominal, points de livraison et comptage transactionnel.',
        description_en: 'General evacuation architecture, nominal operating voltage, metering boundary and points of common coupling.',
        responsible_role: 'Ingénieur Électrotechnicien Concepteur',
        verifying_role: 'Chef de Projet Maître d\'Ouvrage',
        applicable_standards: ['CEI 60617', 'CEI 61936-1'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-01-03',
        code: 'DEL-FS-03',
        title_fr: 'Estimation Préliminaire du Court-Circuit Maximal (Ik")',
        title_en: 'Preliminary Maximum Short-Circuit Assessment (Ik")',
        description_fr: 'Calcul enveloppe du courant de court-circuit au point de raccordement pour vérifier le pouvoir de coupure admissible.',
        description_en: 'Envelope fault current calculation at point of common coupling to size minimum switchgear breaking capacity.',
        responsible_role: 'Ingénieur Calculs Réseau',
        verifying_role: 'Bureau d\'Études Indépendant',
        applicable_standards: ['CEI 60909'],
        associated_simulation: 'short-circuit',
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-01-01',
        clause: 'GC-01.1',
        requirement_fr: 'Validation formelle de l\'autorisation de raccordement de principe par le gestionnaire de réseau',
        requirement_en: 'Formal approval in principle for grid connection from transmission system operator',
        acceptance_threshold: 'Avis de faisabilité technique favorable sans réserve bloquante',
        verification_method: 'Revue de la lettre d\'agrément technique SONATREL / ARSEL'
      },
      {
        id: 'crit-01-02',
        clause: 'GC-01.2',
        requirement_fr: 'Rentabilité économique LCOE conforme aux seuils de rentabilité du promoteur',
        requirement_en: 'LCOE and economic internal rate of return compliant with investor hurdle rate',
        acceptance_threshold: 'TRI Projet > 11% et LCOE compétitif face au mix national',
        verification_method: 'Modèle financier audité et certifié'
      }
    ]
  },

  {
    id: 'phase-2-feed',
    phase_number: 2,
    code: 'PH-02',
    title_fr: 'FEED - Ingénierie de Base & Spécifications Systèmes',
    title_en: 'FEED - Front-End Engineering Design & Basic System Specs',
    subtitle_fr: 'Architecture technique unifiée, dimensionnement des équipements majeurs et gel du CCTP',
    subtitle_en: 'Technical architecture consolidation, major equipment sizing and EPC tender specification freeze',
    objective_fr: 'Établir les spécifications techniques fonctionnelles et l\'unifilaire de base permettant de lancer l\'appel d\'offres EPC sans dérive de périmètre.',
    objective_en: 'Establish functional technical specifications and baseline SLDs to launch the EPC tender with zero scope drift.',
    gate_name_fr: 'DG2 - Gel de l\'Ingénierie de Base & Autorisation d\'Appel d\'Offres EPC',
    gate_name_en: 'DG2 - FEED Freeze & Authorization to Tender EPC Package',
    gate_code: 'GATE-02',
    typical_duration_months: '4 à 8 mois',
    key_actors: [
      'Ingénieur d\'Affaires Principal',
      'Ingénieur Systèmes Haute Tension (D03/D04)',
      'Ingénieur Protection & Contrôle-Commande (D11/D12)',
      'Ingénieur Sécurité & Environnement'
    ],
    risk_factors: [
      {
        fr: 'Spécifications incomplètes sur les niveaux d\'isolement ou la tenue aux surtensions de foudre',
        en: 'Incomplete insulation coordination specs or lightning impulse withstand levels (BIL)'
      },
      {
        fr: 'Mauvaise appréciation des contraintes d\'accès site (gabarit routier transformateur de puissance 60 MVA+)',
        en: 'Underestimation of heavy transport logistics for 60 MVA+ power transformers on rural bridges'
      }
    ],
    deliverables: [
      {
        id: 'del-02-01',
        code: 'DEL-FD-01',
        title_fr: 'Schéma Unifilaire Général de Base (FEED SLD 225/30 kV)',
        title_en: 'Baseline FEED Single Line Diagram (225/30 kV Substation)',
        description_fr: 'Topologie de jeux de barres (double barre, travée de couplage, départs lignes et transformateurs, transformateurs de mesure TC/TT).',
        description_en: 'Busbar arrangement (double busbar, bus coupler, line and transformer bays, instrument CT/VT transformers).',
        responsible_role: 'Lead Electrical Engineer FEED',
        verifying_role: 'Directeur Technique Projet',
        applicable_standards: ['CEI 61936-1', 'CEI 62271-200'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-02-02',
        code: 'DEL-FD-02',
        title_fr: 'Philosophie de Protection & Matrice de Déclenchement (Trip Matrix)',
        title_en: 'Protection Philosophy & Cause-and-Effect Trip Matrix',
        description_fr: 'Définition des fonctions ANSI requises (87T, 87B, 21, 50/51, 67N, 81), zones de protection et déclenchement des bobines disjoncteurs.',
        description_en: 'Definition of required ANSI functions (87T, 87B, 21, 50/51, 67N, 81), overlapping zones and tripping logic.',
        responsible_role: 'Ingénieur Protection & Automatismes',
        verifying_role: 'Expert Protection TSO',
        applicable_standards: ['CEI 60255', 'CEI 61850'],
        associated_simulation: 'coordination',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-02-03',
        code: 'DEL-FD-03',
        title_fr: 'Spécification Technique Générale des Transformateurs de Puissance',
        title_en: 'Power Transformer General Technical Specification (GTS)',
        description_fr: 'Puissance MVA, tensions primaires/secondaires, groupe vectoriel (Dyn11 / YNd11), impédance Ucc%, refroidissement (ONAN/ONAF) et OLTC.',
        description_en: 'MVA rating, primary/secondary voltages, vector group (Dyn11/YNd11), Ucc% impedance, cooling (ONAN/ONAF) and OLTC.',
        responsible_role: 'Ingénieur Haute Tension',
        verifying_role: 'Chef de Département Équipements',
        applicable_standards: ['CEI 60076-1', 'CEI 60076-5'],
        associated_calculator: 'transformer',
        associated_simulation: 'transformer',
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-02-01',
        clause: 'GC-02.1',
        requirement_fr: 'Validation de l\'adéquation de la topologie du poste face aux exigences de maintenabilité N-1',
        requirement_en: 'Verification of substation busbar topology for N-1 maintenance continuity',
        acceptance_threshold: 'Capacité de maintenance sur disjoncteur sans coupure d\'alimentation des départs sains',
        verification_method: 'Revue de sûreté de fonctionnement FMECA'
      },
      {
        id: 'crit-02-02',
        clause: 'GC-02.2',
        requirement_fr: 'Cahier des charges EPC gelé et audité sans ambiguïté technique',
        requirement_en: 'EPC Employer\'s Requirements frozen and free of contractual ambiguity',
        acceptance_threshold: 'Approbation conjointe Direction Technique et Direction Juridique',
        verification_method: 'Procès-verbal de clôture du FEED'
      }
    ]
  },

  {
    id: 'phase-3-detailed-design',
    phase_number: 3,
    code: 'PH-03',
    title_fr: 'Ingénierie Détaillée & Dossier Bon Pour Exécution (IFC)',
    title_en: 'Detailed Design & Issued-for-Construction (IFC) Dossier',
    subtitle_fr: 'Notes de calcul certifiées, schémas développés, carnet de câbles et plans GC',
    subtitle_en: 'Certified calculation reports, developed schematics, cable schedules and civil layouts',
    objective_fr: 'Produire l\'ensemble des documents d\'exécution complets et certifiés nécessaires à la commande des équipements et au chantier de montage.',
    objective_en: 'Produce fully certified execution deliverables required for procurement, fabrication and construction erection.',
    gate_name_fr: 'DG3 - Approbation du Dossier "Bon Pour Exécution" (IFC Clearance)',
    gate_name_en: 'DG3 - Issued For Construction (IFC) Sign-Off & Construction Clearance',
    gate_code: 'GATE-03',
    typical_duration_months: '4 à 10 mois',
    key_actors: [
      'Directeur de Projet EPC',
      'Ingénieur Calculs Réseau & Sélectivité',
      'Ingénieur Filerie & Contrôle-Commande',
      'Bureau de Contrôle Technique Indépendant'
    ],
    risk_factors: [
      {
        fr: 'Saturation imprévue des transformateurs de courant (TC) en régime transitoire de court-circuit',
        en: 'Unforeseen current transformer (CT) saturation during deep asymmetrical faults'
      },
      {
        fr: 'Sous-dimensionnement de la section des câbles BT causant une chute de tension excessive au démarrage moteur',
        en: 'Undersized LV cable cross-section causing excessive voltage drop during heavy motor inrush'
      },
      {
        fr: 'Non-conformité de la résistance de terre ou dépassement des tensions de pas et de toucher tolérables',
        en: 'Earthing grid resistance exceeding limits or unsafe step and touch voltages under earth fault'
      }
    ],
    deliverables: [
      {
        id: 'del-03-01',
        code: 'DEL-DD-01',
        title_fr: 'Note de Calcul Court-Circuit Complète selon CEI 60909',
        title_en: 'Complete Short-Circuit Calculation Report per IEC 60909',
        description_fr: 'Courants initiaux Ik", crête Ip, composante thermique Ith et rupture Ib sur tous les jeux de barres 225 kV, 90 kV et 30 kV.',
        description_en: 'Initial symmetrical Ik", peak Ip, thermal Ith and breaking Ib currents across all 225 kV, 90 kV, 30 kV buses.',
        responsible_role: 'Ingénieur Études Réseau EPC',
        verifying_role: 'Bureau de Contrôle Agréé',
        applicable_standards: ['CEI 60909', 'IEEE 399'],
        associated_simulation: 'short-circuit',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-03-02',
        code: 'DEL-DD-02',
        title_fr: 'Étude de Sélectivité Chronométrique & Coordination des Protections',
        title_en: 'Protection Coordination & Time-Current Curves (TCC) Study',
        description_fr: 'Réglages des seuils de courant et temporisations, marges chronométriques Δt ≥ 250 ms, courbes inverses (SI, VI, EI).',
        description_en: 'Current pickup thresholds and time multipliers, grading margins Δt ≥ 250 ms, standard inverse curves (SI, VI, EI).',
        responsible_role: 'Ingénieur Relais de Protection',
        verifying_role: 'Responsable Réseau TSO',
        applicable_standards: ['CEI 60255-151', 'IEEE 242'],
        associated_simulation: 'coordination',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-03-03',
        code: 'DEL-DD-03',
        title_fr: 'Dimensionnement Prise de Terre & Tensions de Sécurité IEEE 80',
        title_en: 'Substation Earthing Grid Design & Safety Voltages IEEE 80',
        description_fr: 'Maillage de terre fond de fouille, piquets verticaux, résistance Rg < 1 Ω, tensions de pas et de toucher admissibles.',
        description_en: 'Buried conductor mesh, ground rods, grid resistance Rg < 1 Ω, tolerable touch and step voltage limits.',
        responsible_role: 'Ingénieur Sécurité & Prises de Terre',
        verifying_role: 'Ingénieur Conseil Client',
        applicable_standards: ['IEEE 80', 'CEI 61936-1'],
        associated_calculator: 'earthing',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-03-04',
        code: 'DEL-DD-04',
        title_fr: 'Étude de Danger Arc Flash & Étiquetage Sécurité IEEE 1584',
        title_en: 'Arc Flash Hazard Assessment & Safety Labeling IEEE 1584',
        description_fr: 'Énergie incidente calorique (cal/cm²), périmètres de sécurité et spécification des EPI obligatoires selon NFPA 70E.',
        description_en: 'Incident thermal energy (cal/cm²), flash boundaries and required PPE categorization per NFPA 70E.',
        responsible_role: 'Ingénieur Santé & Sécurité Électrique',
        verifying_role: 'Responsable QHSE',
        applicable_standards: ['IEEE 1584', 'NFPA 70E'],
        associated_calculator: 'arc-flash',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-03-05',
        code: 'DEL-DD-05',
        title_fr: 'Dimensionnement des Câbles & Vérification Chute de Tension ΔU',
        title_en: 'Cable Sizing & Voltage Drop Verification Schedule',
        description_fr: 'Courants admissibles Iz selon modes de pose, section minimale normalisée et tenue en court-circuit k²S².',
        description_en: 'Ampacity Iz per installation methods, normative minimum cross-sections and k²S² short-circuit withstand.',
        responsible_role: 'Ingénieur Filerie & Câblage',
        verifying_role: 'Directeur Technique EPC',
        applicable_standards: ['NF C 15-100', 'CEI 60364-5-52'],
        associated_calculator: 'voltage-drop',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-03-06',
        code: 'DEL-DD-06',
        title_fr: 'Dimensionnement des TC & Facteur Limite de Précision (ALF)',
        title_en: 'Current Transformer (CT) Sizing & Knee-Point Voltage Engine',
        description_fr: 'Vérification de la tension de coude Vk, charge secondaire Rct + Rloop + Rrelay, et non-saturation sur Ik"max.',
        description_en: 'Verification of knee-point voltage Vk, secondary burden loop, and immunity to saturation under Ik"max.',
        responsible_role: 'Ingénieur Protection Relais',
        verifying_role: 'Ingénieur Contrôle-Commande',
        applicable_standards: ['CEI 61869-2', 'CEI 60255'],
        associated_calculator: 'ct-sizing',
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-03-01',
        clause: 'GC-03.1',
        requirement_fr: 'Validation de l\'ensemble des notes de calcul par un bureau de contrôle agréé indépendant',
        requirement_en: 'Certification of all engineering calculation reports by an independent inspection body',
        acceptance_threshold: '100% des notes de calcul visées "Bon Pour Exécution" sans réserve',
        verification_method: 'Rapport officiel d\'approbation technique'
      },
      {
        id: 'crit-03-02',
        clause: 'GC-03.2',
        requirement_fr: 'Élimination du risque d\'électrocution par tension de pas et de toucher calculées sous les seuils IEEE 80',
        requirement_en: 'Tolerable step and touch voltages rigorously verified below IEEE 80 human body limits',
        acceptance_threshold: 'Vtouch_actual < Vtouch_tolerable et Vstep_actual < Vstep_tolerable',
        verification_method: 'Note de calcul terre IEEE 80 validée'
      }
    ]
  },

  {
    id: 'phase-4-procurement-fat',
    phase_number: 4,
    code: 'PH-04',
    title_fr: 'Approvisionnement, Fabrication & Essais en Usine (FAT)',
    title_en: 'Procurement, Manufacturing & Factory Acceptance Testing (FAT)',
    subtitle_fr: 'Contrôle qualité fournisseurs, essais de série, essais de type et autorisations d\'expédition',
    subtitle_en: 'Vendor QA/QC auditing, routine tests, type testing qualification and release for shipment',
    objective_fr: 'Vérifier la stricte conformité physique et fonctionnelle des équipements fabriqués en usine avant leur expédition vers le Cameroun.',
    objective_en: 'Verify the physical and functional compliance of manufactured equipment at factory test bays prior to shipment.',
    gate_name_fr: 'DG4 - Visa de Réception en Usine (FAT Acceptance Sign-off)',
    gate_name_en: 'DG4 - Factory Acceptance Clearance & Release for Shipment',
    gate_code: 'GATE-04',
    typical_duration_months: '3 à 9 mois',
    key_actors: [
      'Ingénieur Contrôle Qualité & Essais FAT',
      'Inspecteur Tiers Agréé (Inspection Agency)',
      'Responsable Achats & Supply Chain',
      'Représentant Maître d\'Ouvrage'
    ],
    risk_factors: [
      {
        fr: 'Échec à l\'essai de claquage diélectrique ou échauffement excessif lors des essais de type transformateur',
        en: 'Dielectric breakdown or excessive temperature rise failure during transformer factory heat run'
      },
      {
        fr: 'Retard de transit maritime ou avarie de transport sur matériel lourd',
        en: 'Ocean shipping delays or rough sea transport shock damage to delicate 225 kV bushings'
      }
    ],
    deliverables: [
      {
        id: 'del-04-01',
        code: 'DEL-FAT-01',
        title_fr: 'Procès-Verbal d\'Essais en Usine Transformateur de Puissance (CEI 60076)',
        title_en: 'Power Transformer Factory Acceptance Test Protocol (IEC 60076)',
        description_fr: 'Mesure du rapport de transformation, résistance d\'enroulements, pertes à vide Po, pertes en charge Pk, tension de court-circuit Ucc%, diélectrique et DGA.',
        description_en: 'Transformation ratio, winding resistance, no-load losses Po, load losses Pk, Ucc% impedance, dielectric impulse and baseline DGA.',
        responsible_role: 'Ingénieur Essais Constructeur',
        verifying_role: 'Inspecteur Réception Client',
        applicable_standards: ['CEI 60076-1', 'CEI 60076-3'],
        associated_calculator: 'transformer',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-04-02',
        code: 'DEL-FAT-02',
        title_fr: 'Procès-Verbal d\'Essais des Disjoncteurs HTB (CEI 62271-100)',
        title_en: 'HV Circuit Breaker FAT Test Protocol (IEC 62271-100)',
        description_fr: 'Simultanéité des pôles, temps d\'ouverture/fermeture, résistance de contact principale (micro-ohmmètre), étanchéité gaz SF6.',
        description_en: 'Pole pole-to-pole synchronism, opening/closing operating times, main contact resistance, SF6 gas leakage verification.',
        responsible_role: 'Ingénieur Essais Appareillage',
        verifying_role: 'Ingénieur Assurance Qualité Client',
        applicable_standards: ['CEI 62271-100', 'CEI 62271-1'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-04-03',
        code: 'DEL-FAT-03',
        title_fr: 'Plateforme d\'Essais Intégrés SCADA & Téléconduite (CEI 61850)',
        title_en: 'Integrated SCADA & Telecontrol Factory System Integration (IEC 61850)',
        description_fr: 'Validation de l\'interopérabilité des IED, publication GOOSE < 4 ms, flux MMS vers les passerelles de dispatching SONATREL.',
        description_en: 'Verification of multi-vendor IED interoperability, GOOSE trip latency < 4 ms, MMS telemetry streams to SONATREL gateway.',
        responsible_role: 'Ingénieur Automatismes & Réseau',
        verifying_role: 'Expert Téléconduite Dispatching',
        applicable_standards: ['CEI 61850-8-1', 'CEI 60870-5-104'],
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-04-01',
        clause: 'GC-04.1',
        requirement_fr: 'Absence totale de non-conformité majeure sur les essais diélectriques et les pertes en charge',
        requirement_en: 'Zero major non-conformances on high-voltage dielectric insulation and guaranteed load losses',
        acceptance_threshold: 'Pertes mesurées conformes aux garanties contractuelles avec pénalités nulles',
        verification_method: 'Contresignature du PV officiel FAT'
      },
      {
        id: 'crit-04-02',
        clause: 'GC-04.2',
        requirement_fr: 'Délivrance formelle du certificat d\'autorisation d\'expédition (Release for Shipment)',
        requirement_en: 'Formal issuance of Release for Shipment clearance by employer\'s representative',
        acceptance_threshold: 'Dossier constructeur (MDR) complet et approuvé',
        verification_method: 'Attestation signée'
      }
    ]
  },

  {
    id: 'phase-5-construction',
    phase_number: 5,
    code: 'PH-05',
    title_fr: 'Génie Civil, Montage Électromécanique & Chantier',
    title_en: 'Civil Engineering, Electromechanical Erection & Installation',
    subtitle_fr: 'Fouilles, boucle de terre, charpentes HTB, pose d\'appareillage et tirage de câbles',
    subtitle_en: 'Excavation, ground grid burial, steel gantries, switchgear erection and cable pulling',
    objective_fr: 'Réaliser les travaux de construction et d\'assemblage électromécanique sur site conformément aux plans IFC et aux règles d\'art.',
    objective_en: 'Execute on-site construction and electromechanical assembly in strict compliance with IFC drawings and safety regulations.',
    gate_name_fr: 'DG5 - Fin de Montage Mécanique & Autorisation d\'Essais Site (Mechanical Completion)',
    gate_name_en: 'DG5 - Mechanical Completion & Authorization for Site Testing',
    gate_code: 'GATE-05',
    typical_duration_months: '6 à 18 mois',
    key_actors: [
      'Chef de Chantier Électrique',
      'Ingénieur Travaux Génie Civil',
      'Superviseur Montage Appareillage HT',
      'Responsable Sécurité Chantier (HSE)'
    ],
    risk_factors: [
      {
        fr: 'Résistivité du sol réel supérieure aux sondages initiaux nécessitant un renforcement de la grille de terre',
        en: 'Higher real soil resistivity on site requiring deeper ground well drilling to achieve < 1 Ω'
      },
      {
        fr: 'Endommagement de la gaine de câbles HT lors du tirage mécanique dans les caniveaux',
        en: 'Mechanical cable sheath abrasion during heavy winch pulling in concrete trenches'
      }
    ],
    deliverables: [
      {
        id: 'del-05-01',
        code: 'DEL-CT-01',
        title_fr: 'Procès-Verbal de Mesure de la Résistance de Prise de Terre Réelle',
        title_en: 'As-Built Substation Earthing Grid Resistance Measurement Protocol',
        description_fr: 'Mesure par la méthode des 62% au telluromètre haute fréquence pour valider Rg < 1,0 Ω avant toute connexion électrique.',
        description_en: 'Fall-of-potential (62% method) ground resistance test protocol proving Rg < 1.0 Ω prior to any energization.',
        responsible_role: 'Ingénieur Essais Chantier',
        verifying_role: 'Bureau de Contrôle Sécurité',
        applicable_standards: ['IEEE 81', 'IEEE 80'],
        associated_calculator: 'earthing',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-05-02',
        code: 'DEL-CT-02',
        title_fr: 'Rapport d\'Alignement, Serrage Dynamométrique & Remplissage Gaz SF6',
        title_en: 'Switchgear Erection, Torque Tightening & SF6 Gas Filling Log',
        description_fr: 'Contrôle du couple de serrage des raccords barre/appareil, verticalité des isolateurs, remplissage SF6 à pression nominale.',
        description_en: 'Calibrated torque wrench logging of bus clamps, insulator alignment, and SF6 gas filling to rated 6.0 bar gauge.',
        responsible_role: 'Superviseur Montage Haute Tension',
        verifying_role: 'Inspecteur Qualité Client',
        applicable_standards: ['CEI 62271-1', 'CEI 61936-1'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-05-03',
        code: 'DEL-CT-03',
        title_fr: 'Carnet de Tirage & Contrôle d\'Isolement des Câbles (Mégohmmètre)',
        title_en: 'Cable Pulling, Termination & Insulation Resistance Protocol',
        description_fr: 'Mesures d\'isolement phase-phase et phase-terre (5 kV DC / 1 minute) et vérification du repérage selon schémas IFC.',
        description_en: 'Insulation resistance measurements (5 kV DC / 1 min) phase-to-phase and phase-to-earth, and wire labeling audit.',
        responsible_role: 'Chef d\'Équipe Câblage',
        verifying_role: 'Superviseur Essais Site',
        applicable_standards: ['CEI 60502-2', 'NF C 15-100'],
        associated_calculator: 'voltage-drop',
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-05-01',
        clause: 'GC-05.1',
        requirement_fr: 'Résistance globale du réseau de terre mesurée strictement inférieure au seuil contractuel',
        requirement_en: 'Measured substation grid earth resistance strictly below contractual limit',
        acceptance_threshold: 'Rg ≤ 1.0 Ω (ou conforme à l\'étude IEEE 80 pour les sols rocheux)',
        verification_method: 'Rapport de mesure IEEE 81 contresigné'
      },
      {
        id: 'crit-05-02',
        clause: 'GC-05.2',
        requirement_fr: 'Clôture de toutes les fiches de non-conformité de montage mécanique',
        requirement_en: 'Punch list Category A items (safety & operational blockers) fully cleared',
        acceptance_threshold: 'Zéro réserve bloquante de catégorie A',
        verification_method: 'Procès-verbal de fin de montage mécanique'
      }
    ]
  },

  {
    id: 'phase-6-commissioning',
    phase_number: 6,
    code: 'PH-06',
    title_fr: 'Mise en Service, Essais sur Site (SAT) & Enclenchement',
    title_en: 'Commissioning, Site Acceptance Testing (SAT) & Energization',
    subtitle_fr: 'Essais individuels, injection primaire/secondaire, consigne de manœuvre et première mise sous tension',
    subtitle_en: 'Individual testing, secondary/primary injection, switching protocol and first live energization',
    objective_fr: 'Démontrer que tous les systèmes de protection, de commande et d\'évacuation fonctionnent de manière parfaitement coordonnée avant et pendant l\'enclenchement.',
    objective_en: 'Demonstrate that all protection, control, and switching equipment operate in harmony before and during live system energization.',
    gate_name_fr: 'DG6 - Autorisation d\'Enclenchement & Mise en Service Commerciale (COD Clearance)',
    gate_name_en: 'DG6 - Energization Clearance & Commercial Operation Date (COD)',
    gate_code: 'GATE-06',
    typical_duration_months: '2 à 4 mois',
    key_actors: [
      'Commissioning Manager (Chef des Essais)',
      'Ingénieur Essais Protection Relais (Omicron/Doble)',
      'Dispatcher en Chef National (SONATREL)',
      'Chef de Poste Exploitation'
    ],
    risk_factors: [
      {
        fr: 'Inversion de polarité sur les TC provoquant le déclenchement intempestif de la protection différentielle 87T à la montée en charge',
        en: 'CT polarity inversion causing unwanted trip of transformer differential protection 87T upon load pickup'
      },
      {
        fr: 'Non-concordance de phase (déphasage anormal) lors du bouclage sur le réseau 225 kV',
        en: 'Phase angle mismatch or improper vector group synchronization during 225 kV grid closing'
      }
    ],
    deliverables: [
      {
        id: 'del-06-01',
        code: 'DEL-SAT-01',
        title_fr: 'Rapports d\'Essais par Injection Secondaire & Primaire des Relais',
        title_en: 'Relay Protection Secondary & Primary Injection Test Records',
        description_fr: 'Injection de courants de défaut simulés, vérification des seuils de déclenchement ANSI (87T, 21, 50/51, 67N) et temps de coupure.',
        description_en: 'Simulated fault current injection, testing pickup thresholds and operating curves (87T, 21, 50/51, 67N) and breaker clearing.',
        responsible_role: 'Lead Protection Commissioning Engineer',
        verifying_role: 'Ingénieur Protection Dispatching SONATREL',
        applicable_standards: ['CEI 60255', 'CEI 61850'],
        associated_simulation: 'coordination',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-06-02',
        code: 'DEL-SAT-02',
        title_fr: 'Procès-Verbal de Concordance de Phase & Ordre de Succession',
        title_en: 'Phasing-Out & Phase Sequence Verification Protocol',
        description_fr: 'Vérification du sens de rotation direct (1-2-3 / R-S-T) et concordance de phase aux bornes des sectionneurs de couplage.',
        description_en: 'Verification of direct clockwise phase sequence and voltage null between matching phases across open tie disconnectors.',
        responsible_role: 'Ingénieur Essais Haute Tension',
        verifying_role: 'Chef de Quart Dispatching',
        applicable_standards: ['CEI 61936-1', 'IEEE 399'],
        associated_simulation: 'transformer',
        is_mandatory_for_gate: true
      },
      {
        id: 'del-06-03',
        code: 'DEL-SAT-03',
        title_fr: 'Consigne Particulière d\'Enclenchement & Fiche de Manœuvre Validée',
        title_en: 'Substation Energization Sequence & Dispatch Switching Order',
        description_fr: 'Séquence pas-à-pas des manœuvres de mise sous tension à vide (fermeture sectionneurs, réenclencheur bloqué, enclenchement disjoncteur 225 kV).',
        description_en: 'Step-by-step no-load energization sequence, autorecloser blocking, 225 kV breaker closing and 24h soak test observation.',
        responsible_role: 'Chef de Projet Exploitation',
        verifying_role: 'Directeur du Dispatching National (SONATREL)',
        applicable_standards: ['Code Réseau Transport ARSEL'],
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-06-01',
        clause: 'GC-06.1',
        requirement_fr: 'Succès complet de l\'épreuve de maintien sous tension à vide (Soak Test) pendant 24 heures consécutives',
        requirement_en: 'Complete success of 24-hour continuous no-load voltage soak test without trip or abnormal noise/DGA',
        acceptance_threshold: 'Zéro alarme de protection, zéro anomalie thermique ou chromatographique',
        verification_method: 'Attestation de mise sous tension contresignée'
      },
      {
        id: 'crit-06-02',
        clause: 'GC-06.2',
        requirement_fr: 'Transmission en temps réel de toutes les télémesures et télésignalisations vers le SCADA National',
        requirement_en: '100% reliable telemetry, status signaling and remote control active with National Dispatching',
        acceptance_threshold: 'Disponibilité téléconduite = 100% sans perte de paquets CEI 60870-5-104',
        verification_method: 'Validation conjointement signée par le Dispatching'
      }
    ]
  },

  {
    id: 'phase-7-operation-maintenance',
    phase_number: 7,
    code: 'PH-07',
    title_fr: 'Exploitation, Maintenance Conditionnelle (CBM/RCM) & Fin de Vie',
    title_en: 'Operation, Asset Health Management (CBM/RCM) & Decommissioning',
    subtitle_fr: 'Surveillance en ligne DGA, thermographie infrarouge, GMAO et prolongation de durée de vie',
    subtitle_en: 'Online DGA monitoring, infrared thermography, CMMS maintenance and asset life extension',
    objective_fr: 'Garantir une disponibilité maximale des ouvrages électriques, minimiser le SAIDI/SAIFI et optimiser le coût total de possession (TCO).',
    objective_en: 'Guarantee maximum power grid availability, minimize SAIDI/SAIFI outage indices and optimize total cost of ownership (TCO).',
    gate_name_fr: 'DG7 - Réception Définitive & Clôture de Garantie (Final Acceptance / FAC)',
    gate_name_en: 'DG7 - Final Acceptance Certificate (FAC) & Warranty Closeout',
    gate_code: 'GATE-07',
    typical_duration_months: '12 à 24 mois après COD (puis 30+ ans d\'exploitation)',
    key_actors: [
      'Directeur de l\'Exploitation & Maintenance',
      'Ingénieur Fiabilité & Diagnostic Électrique',
      'Responsable GMAO (Gestion de Maintenance)',
      'Expert Diagnostic Transformateurs (DGA)'
    ],
    risk_factors: [
      {
        fr: 'Échauffement anormal non détecté sur les couteaux de sectionneurs 225 kV entraînant un amorçage',
        en: 'Undetected thermal hotspot on 225 kV disconnector jaws resulting in flashover'
      },
      {
        fr: 'Dégradation accélérée de l\'huile diélectrique par humidité tropicale non filtrée',
        en: 'Accelerated dielectric oil degradation due to unfiltered tropical ambient moisture ingress'
      }
    ],
    deliverables: [
      {
        id: 'del-07-01',
        code: 'DEL-OM-01',
        title_fr: 'Plan de Maintenance Préventive & Prédictive Basée sur la Fiabilité (RCM)',
        title_en: 'Reliability-Centered Maintenance (RCM) & Asset Management Plan',
        description_fr: 'Fréquences d\'inspection thermographique, prélèvement semestriel d\'huile pour analyse DGA (CEI 60599), manœuvres préventives des disjoncteurs.',
        description_en: 'Thermographic inspection intervals, semi-annual oil sampling for DGA (IEC 60599), breaker maintenance exercising schedule.',
        responsible_role: 'Ingénieur Méthodes Maintenance',
        verifying_role: 'Directeur Maintenance Électrique',
        applicable_standards: ['CEI 60599', 'IEEE C57.104'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-07-02',
        code: 'DEL-OM-02',
        title_fr: 'Dossier des Ouvrages Exécutés (DOE) & Schémas "Tel Que Construit" (As-Built)',
        title_en: 'Complete As-Built Engineering Dossier & Manufacturer Data Records',
        description_fr: 'Recueil exhaustif de tous les schémas modifiés lors des essais, manuels d\'entretien constructeur et nomenclatures de pièces de rechange.',
        description_en: 'Full repository of as-built wiring prints, manufacturer maintenance manuals, and critical capital spare parts catalog.',
        responsible_role: 'Responsable Documentation EPC',
        verifying_role: 'Chef de Département Ingénierie Exploitation',
        applicable_standards: ['CEI 61082', 'ISO 9001'],
        is_mandatory_for_gate: true
      },
      {
        id: 'del-07-03',
        code: 'DEL-OM-03',
        title_fr: 'Bilan de Santé d\'Actif (Health Index) & Audit de Clôture de Garantie',
        title_en: 'Asset Health Index (HI) & Warranty Period Technical Audit',
        description_fr: 'Évaluation de l\'état de vieillissement des équipements après 12/24 mois d\'exploitation continue avant libération de la caution de bonne fin.',
        description_en: 'Condition assessment scoring after 12/24 months of full commercial service prior to final performance bond release.',
        responsible_role: 'Expert Audit Électrique Indépendant',
        verifying_role: 'Directeur Général Maître d\'Ouvrage',
        applicable_standards: ['CEI 60076', 'CIGRE TB 761'],
        is_mandatory_for_gate: true
      }
    ],
    gate_criteria: [
      {
        id: 'crit-07-01',
        clause: 'GC-07.1',
        requirement_fr: 'Absence d\'avarie non résolue imputable à la conception ou au montage durant la période de garantie',
        requirement_en: 'Zero open defects or warranty claims attributable to design, manufacturing or erection',
        acceptance_threshold: '100% des réserves de garantie levées et approuvées',
        verification_method: 'Rapport d\'inspection finale de garantie'
      },
      {
        id: 'crit-07-02',
        clause: 'GC-07.2',
        requirement_fr: 'Remise complète du Dossier des Ouvrages Exécutés (DOE As-Built) validé',
        requirement_en: 'Final delivery of validated As-Built engineering packages and O&M manuals',
        acceptance_threshold: 'Dossier DOE archivé dans le système documentaire technique',
        verification_method: 'Attestation de réception définitive (FAC)'
      }
    ]
  }
];
