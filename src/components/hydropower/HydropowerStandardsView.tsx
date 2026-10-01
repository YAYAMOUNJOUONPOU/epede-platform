import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Filter,
  FileText,
  BookmarkCheck,
  ChevronRight,
  Calculator,
  ClipboardCheck,
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  Check,
  XCircle,
  FileSpreadsheet,
  Award,
  Zap,
  Download,
  Printer,
  Gauge,
  Cpu,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { HYDRO_STANDARDS_CATALOGUE } from '../../data/hydropowerData';
import type { HydroStandardItem, StandardIssuer, StandardCategory } from '../../data/hydropowerStandardsData';
import type { HydroSubsystemId } from '../../types/hydropower';
import { auditSettingsStore } from '../../data/auditSettingsStore';

interface HydropowerStandardsViewProps {
  locale: 'fr' | 'en';
  initialStandardRef?: string;
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
}

type StandardsMainTab = 'catalogue' | 'calculators' | 'audit' | 'protocols';
type CalculatorId = 'iec60041' | 'iso20816' | 'ieee_c37_102' | 'iec60193' | 'ieee421_pss';

interface AuditItemState {
  id: string;
  domainFr: string;
  domainEn: string;
  reference: string;
  titleFr: string;
  titleEn: string;
  requirementFr: string;
  requirementEn: string;
  status: 'compliant' | 'minor_gap' | 'critical_nc' | 'in_progress';
  commentsFr: string;
  commentsEn: string;
}

const INITIAL_AUDIT_CHECKLIST: AuditItemState[] = [
  {
    id: 'aud-01',
    domainFr: 'Rendement Hydraulique Prototype',
    domainEn: 'Prototype Hydraulic Efficiency',
    reference: 'IEC 60041 §9',
    titleFr: 'Mesure du débit par acoustique multipente',
    titleEn: 'Discharge measurement via multi-path acoustic transit time',
    requirementFr: 'Incertitude globale de mesure de débit inférieure ou égale à ±1.2% sous régime stabilisé.',
    requirementEn: 'Total expanded discharge measurement uncertainty <= ±1.2% under steady-state regime.',
    status: 'compliant',
    commentsFr: 'Validé avec banc acoustique 8 cordes croisées. Incertitude calculée ±1.08%.',
    commentsEn: 'Validated using 8-chord crossed acoustic spool. Measured uncertainty ±1.08%.',
  },
  {
    id: 'aud-02',
    domainFr: 'Similitude & Maquette Usine',
    domainEn: 'Scale Model Hydraulic Similitude',
    reference: 'IEC 60193 §7',
    titleFr: 'Formulation Step-Up Reynolds & Cavitation',
    titleEn: 'Reynolds Step-Up Conversion & Inception Sigma',
    requirementFr: 'Vérification de la marge de cavitation σ_installation >= 1.20 x σ_critique.',
    requirementEn: 'Verification of cavitation margin σ_plant >= 1.20 x σ_crit.',
    status: 'compliant',
    commentsFr: 'Essais de plateforme Grenoble conformes avec marge de sécurité de 1.32.',
    commentsEn: 'Platform testing in Grenoble confirmed with safety margin of 1.32.',
  },
  {
    id: 'aud-03',
    domainFr: 'Automatisme & Séquenceur Groupe',
    domainEn: 'Automation & Unit Sequencer',
    reference: 'IEC 62270 §4',
    titleFr: 'Redondance des automates de tranche',
    titleEn: 'Governor & Unit PLC Redundancy',
    requirementFr: 'Architecture redondante 1-out-of-2 hot standby avec basculement bumpless en moins de 10 ms.',
    requirementEn: 'Dual-redundant 1-out-of-2 hot standby architecture with bumpless transfer < 10 ms.',
    status: 'compliant',
    commentsFr: 'Automates redondants testés sans à-coup sur l\'ouverture du distributeur.',
    commentsEn: 'Redundant CPUs tested with zero bump on turbine guide vane position.',
  },
  {
    id: 'aud-04',
    domainFr: 'Arrêt d\'Urgence Matériel',
    domainEn: 'Hardware Safety Interlocks',
    reference: 'IEC 62270 §6',
    titleFr: 'Boucle d\'arrêt d\'urgence câblée fail-safe',
    titleEn: 'Dedicated hardwired emergency trip loop',
    requirementFr: 'Circuits d\'arrêt d\'urgence câblés en fil-à-fil indépendants du bus Ethernet et des calculateurs.',
    requirementEn: 'Direct hardwired fail-safe tripping loops physically decoupled from Ethernet bus.',
    status: 'compliant',
    commentsFr: 'Bobines à émission et à manque de tension indépendantes du réseau automate.',
    commentsEn: 'Shunt trip and undervoltage release coils wired directly without network bus.',
  },
  {
    id: 'aud-05',
    domainFr: 'Protection Différentielle Alternateur',
    domainEn: 'Generator Differential Protection',
    reference: 'IEEE C37.102 §4.1',
    titleFr: 'Protection différentielle stator 87G',
    titleEn: 'Stator differential percentage relay 87G',
    requirementFr: 'Temps d\'élimination de défaut entre phases interne < 40 ms sans déclenchement intempestif traversant.',
    requirementEn: 'Internal phase-to-phase fault clearance time < 40 ms with zero external through-fault trips.',
    status: 'compliant',
    commentsFr: 'Pente 1 à 15%, coude à 1.25 In, pente 2 à 60%. Test d\'injection secondaire validé.',
    commentsEn: 'Slope 1 set to 15%, knee at 1.25 In, slope 2 at 60%. Secondary injection verified.',
  },
  {
    id: 'aud-06',
    domainFr: 'Protection Perte d\'Excitation',
    domainEn: 'Loss of Field Protection',
    reference: 'IEEE C37.102 §4.5',
    titleFr: 'Relais d\'impédance mho offset ANSI 40',
    titleEn: 'Offset mho impedance protection ANSI 40',
    requirementFr: 'Deux zones de calage dans le plan R-X protégeant le rotor contre l\'échauffement en régime asynchrone.',
    requirementEn: 'Two zones calibrated in the R-X plane protecting rotor against asynchronous slip heating.',
    status: 'compliant',
    commentsFr: 'Zone 1 à t=0.1s et Zone 2 à t=0.6s programmées sur relais numérique.',
    commentsEn: 'Zone 1 (0.1s) and Zone 2 (0.6s) programmed on numerical protection relay.',
  },
  {
    id: 'aud-07',
    domainFr: 'Stabilité & Régulation de Tension',
    domainEn: 'AVR & Grid Stability',
    reference: 'IEEE 421.5 §8',
    titleFr: 'Stabilisateur de puissance réseau PSS2B',
    titleEn: 'Dual-input Power System Stabilizer PSS2B',
    requirementFr: 'Amortissement modal des oscillations de puissance inter-zones (0.2 - 2.0 Hz) avec coefficient d\'amortissement ζ >= 15%.',
    requirementEn: 'Modal damping of inter-area power oscillations (0.2 - 2.0 Hz) with damping ratio ζ >= 15%.',
    status: 'compliant',
    commentsFr: 'Calage des filtres de bande PSS2B validé sur l\'interconnexion 225 kV Yaoundé-Douala. Taux d\'amortissement mesuré ζ = 18.4% (> 15%).',
    commentsEn: 'PSS2B lead-lag bandpass calibration certified on 225 kV Yaoundé-Douala intertie. Measured modal damping ratio ζ = 18.4% (> 15%).',
  },
  {
    id: 'aud-08',
    domainFr: 'Surveillance Vibratoire Paliers',
    domainEn: 'Bearing Vibration Monitoring',
    reference: 'ISO 20816-5 §4',
    titleFr: 'Vitesse vibratoire globale RMS sur corps de paliers',
    titleEn: 'Overall broadband RMS velocity on bearing housings',
    requirementFr: 'Vitesse vibratoire RMS <= 2.5 mm/s (Zone B) en régime permanent stable de puissance nominale.',
    requirementEn: 'Broadband RMS vibration velocity <= 2.5 mm/s (Zone B) in steady rated operation.',
    status: 'compliant',
    commentsFr: 'V_rms mesuré à 1.45 mm/s sur PGT et 1.20 mm/s sur PGA (Zone A - machine neuve).',
    commentsEn: 'V_rms measured at 1.45 mm/s at TGB and 1.20 mm/s at GGB (Zone A - new machine).',
  },
  {
    id: 'aud-09',
    domainFr: 'Protection Incendie Transformateur',
    domainEn: 'Transformer Fire Protection',
    reference: 'NFPA 851 §6.2',
    titleFr: 'Déluge eau automatique & Fosse de rétention',
    titleEn: 'High-velocity water deluge & containment pit',
    requirementFr: 'Arrosage automatique 10.2 L/min/m² et rétention de 100% huile + 10 min eau sans rejet rivière.',
    requirementEn: 'Automatic water spray 10.2 L/min/m² and containment of 100% oil + 10 min water without river spill.',
    status: 'compliant',
    commentsFr: 'Pompe déluge diesel de secours et séparateur hydrocarbures conformes aux directives environnementales.',
    commentsEn: 'Backup diesel deluge pump and oil-water separator fully compliant with environmental norms.',
  },
  {
    id: 'aud-10',
    domainFr: 'Auscultation Barrage & Poussée Béton',
    domainEn: 'Dam Surveillance & Alkali Reaction',
    reference: 'ICOLD Bulletin 158 §9',
    titleFr: 'Surveillance piézométrique & Déformation RAG',
    titleEn: 'Foundation piezometers & ASR deformation tracking',
    requirementFr: 'Mesure continue de la sous-pression et surveillance extensométrique triaxiale du béton.',
    requirementEn: 'Continuous uplift pressure measurement and 3D extensometer array monitoring of concrete growth.',
    status: 'compliant',
    commentsFr: 'Périmètre Songloulou ausculté par pendules et fentes de décompression préventives opérationnelles.',
    commentsEn: 'Songloulou dam surveyed by inverted pendulums and preventive slot-cutting joints active.',
  },
];

interface TestingProtocol {
  id: string;
  stepNumber: number;
  stage: 'FAT' | 'SAT';
  name: { fr: string; en: string };
  normativeReference: string;
  governingStandard: string;
  targetEquipment: string;
  objective: { fr: string; en: string };
  prerequisites: string[];
  testSequence: Array<{ step: number; fr: string; en: string }>;
  acceptanceCriteria: { fr: string; en: string };
  safetyPrecautions: { fr: string; en: string };
}

const TESTING_PROTOCOLS: TestingProtocol[] = [
  {
    id: 'prot-01',
    stepNumber: 1,
    stage: 'FAT',
    name: {
      fr: 'Essai Diélectrique Haute Tension & Tangente Delta Stator',
      en: 'High-Voltage Dielectric Withstand & Stator Tan Delta Test',
    },
    normativeReference: 'IEC 60034-1 §10 & IEC 60034-27',
    governingStandard: 'IEC 60034-1',
    targetEquipment: 'Alternateur Synchrone (Bobinage Statorique)',
    objective: {
      fr: 'Valider la rigidité diélectrique des barres Roebel et déceler d\'éventuels vides d\'imprégnation ou amorces de décharges partielles avant expédition sur site.',
      en: 'Verify the dielectric strength of Roebel transposed stator bars and detect impregnation voids or partial discharges before site shipment.',
    },
    prerequisites: [
      'Bobinage statorique complet et fretté en usine constructeur',
      'Résistance d\'isolement R_iso > 1 000 MΩ à 20 °C sous 5 kV DC',
      'Évacuation de la zone d\'essai et balisage de sécurité haute tension',
    ],
    testSequence: [
      { step: 1, fr: 'Mesure de la résistance d\'isolement (Megger) et de l\'indice de polarisation (IP = R10min / R1min >= 2.0).', en: 'Measure insulation resistance and Polarization Index (PI = R10min / R1min >= 2.0).' },
      { step: 2, fr: 'Mesure du facteur de pertes diélectriques Tangente Delta (tan δ) par paliers de 0.2 Un jusqu\'à 1.0 Un.', en: 'Measure dielectric dissipation factor Tan Delta (tan δ) in steps of 0.2 Un up to 1.0 Un.' },
      { step: 3, fr: 'Application de la tension d\'épreuve industrielle 50 Hz : U_test = 2 x U_nom + 1 kV (ex. 23 kV pour 11 kV) pendant 60 secondes par phase.', en: 'Apply power-frequency test voltage: U_test = 2 x U_nom + 1 kV (e.g. 23 kV for 11 kV) for 60 seconds per phase.' },
      { step: 4, fr: 'Décharge complète à la terre et recontrôle de la résistance d\'isolement finale.', en: 'Complete solid earth discharge and verify final post-test insulation resistance.' },
    ],
    acceptanceCriteria: {
      fr: 'Zéro claquage ou contournement sous 23 kV pendant 60 s. Écart Δtan δ (Tip-up) entre 0.2 Un et 0.6 Un inférieur à 0.5 x 10^-2.',
      en: 'Zero breakdown or flashover under 23 kV for 60 s. Tan Delta Tip-up (0.6 Un - 0.2 Un) < 0.5 x 10^-2.',
    },
    safetyPrecautions: {
      fr: 'Enceinte fermée avec interrupteur à clé captive, perches de mise à la terre automatique et surveillance vidéo.',
      en: 'Interlocked test cell with captive key system, automatic grounding sticks, and camera surveillance.',
    },
  },
  {
    id: 'prot-02',
    stepNumber: 2,
    stage: 'FAT',
    name: {
      fr: 'Essai d\'Équilibrage Rotor & Survitesse d\'Emballement en Puits Blindé',
      en: 'Rotor Dynamic Balancing & Runaway Overspeed Pit Test',
    },
    normativeReference: 'ISO 21940-11 & IEC 60034-1 §9',
    governingStandard: 'IEC 60034-1',
    targetEquipment: 'Rotor Alternateur & Pôles Saillants',
    objective: {
      fr: 'S\'assurer de la tenue mécanique sous contrainte centrifuge extrême et limiter le balourd résiduel pour garantir un fonctionnement silencieux et sans vibration.',
      en: 'Confirm structural integrity under centrifugal stresses and balance residual unbalance to guarantee vibration-free operation.',
    },
    prerequisites: [
      'Puits d\'éclatement en béton armé sous vide partiel ou air comprimé',
      'Pôles saillants clavetés et cales interpolaires définitivement bloquées',
      'Capteurs de déplacement d\'arbre et de vibration aux paliers de fosse',
    ],
    testSequence: [
      { step: 1, fr: 'Montée progressive à la vitesse nominale et équilibrage dynamique en 2 plans (Grade G2.5 selon ISO 21940).', en: 'Ramp to rated speed and execute 2-plane dynamic balancing (ISO 21940 Grade G2.5).' },
      { step: 2, fr: 'Accélération jusqu\'à la vitesse d\'emballement maximale garantie (Runaway Speed, typiquement 175-200% de la vitesse nominale).', en: 'Accelerate to maximum guaranteed runaway overspeed (typically 175-200% of nominal speed).' },
      { step: 3, fr: 'Maintien du palier de survitesse maximale pendant exactement 2 minutes.', en: 'Maintain maximum overspeed plateau for exactly 2 minutes.' },
      { step: 4, fr: 'Décélération, arrêt et contrôle métrologique des déformations plastiques résiduelles des pôles et des frettes.', en: 'Decelerate, stop, and execute dimensional inspection of residual plastic pole strain.' },
    ],
    acceptanceCriteria: {
      fr: 'Aucune déformation plastique permanente mesurable sur les attaches de pôles. Balourd résiduel conforme à la classe G2.5.',
      en: 'Zero measurable permanent deformation on pole dovetails. Residual unbalance conforms to Grade G2.5.',
    },
    safetyPrecautions: {
      fr: 'Interdiction formelle de présence humaine dans le hall de fosse lors de la montée en survitesse ; blindage pare-éclats.',
      en: 'Strict personnel clearance from test hall during overspeed ramp; blast-proof containment shielding.',
    },
  },
  {
    id: 'prot-03',
    stepNumber: 3,
    stage: 'SAT',
    name: {
      fr: 'Premier Remplissage Hydraulique & Épreuve Pression Conduite Forcée',
      en: 'Initial Hydraulic Watering & Penstock Pressure Proof Test',
    },
    normativeReference: 'ASCE Manual 79 & DIN 19704',
    governingStandard: 'ASCE Manual 79',
    targetEquipment: 'Prise d\'Eau, Galerie d\'Amenée, Cheminée & Conduite Forcée',
    objective: {
      fr: 'Mettre en eau progressivement les ouvrages sous pression, vérifier l\'étanchéité des joints de virole, contrôler le tassement des massifs d\'ancrage et évacuer l\'air emprisonné.',
      en: 'Gradually water pressurized waterways, verify penstock joint watertightness, monitor anchor block deflections, and exhaust trapped air.',
    },
    prerequisites: [
      'Vanne papillon ou vanne sphérique de pied de chute fermée et verrouillée mécaniquement',
      'Toutes les ventouses automatiques d\'échappement d\'air inspectées et libres de mouvement',
      'Réseau de drainage de la centrale asséché et pompes d\'exhaure en service automatique',
    ],
    testSequence: [
      { step: 1, fr: 'Ouverture du by-pass d\'équilibrage de la vanne de tête pour un débit de remplissage contrôlé (vitesse de montée du plan d\'eau <= 5 m/h).', en: 'Crack open headgate filling bypass at controlled rate (water elevation rise rate <= 5 m/h).' },
      { step: 2, fr: 'Arrêts par paliers à 25%, 50%, 75% et 100% de la hauteur de chute statique avec inspection visuelle des fuites aux soudures.', en: 'Step holds at 25%, 50%, 75%, and 100% static head with visual weld seam leakage inspections.' },
      { step: 3, fr: 'Montée en pression hydrostatique à 1.50 x P_stat à l\'aide d\'une pompe d\'épreuve haute pression mobile.', en: 'Pressurize to 1.50 x static design pressure utilizing high-pressure hydraulic test pump.' },
      { step: 4, fr: 'Maintien de la pression d\'épreuve pendant 4 heures avec enregistrement graphique continu de la pression.', en: 'Sustain proof pressure for 4 hours with continuous calibrated pressure data logging.' },
    ],
    acceptanceCriteria: {
      fr: 'Aucune fuite traversante détectée. Débit de suintement total des garnitures inférieur aux seuils contractuels.',
      en: 'Zero through-wall leaks detected. Packing gland seepage discharge within contractual tolerances.',
    },
    safetyPrecautions: {
      fr: 'Évacuation du puits de conduite forcée pendant la phase de surpression ; contrôle radio permanent avec la prise d\'eau.',
      en: 'Personnel evacuation from penstock tunnel during overpressure phase; dedicated radio link to intake tower.',
    },
  },
  {
    id: 'prot-04',
    stepNumber: 4,
    stage: 'SAT',
    name: {
      fr: 'Premier Dévirage Mécanique & Auscultation des Paliers d\'Arbre',
      en: 'Initial Mechanical Spin & Shaft Bearing Lubrication Commissioning',
    },
    normativeReference: 'ISO 20816-5 & ISO 7919-5',
    governingStandard: 'ISO 20816-5',
    targetEquipment: 'Ligne d\'Arbre, Paliers Guides & Butée Axiale',
    objective: {
      fr: 'Vérifier l\'alignement de la ligne d\'arbre, le bon établissement du film d\'huile hydrodynamique et surveiller les températures de coussinets à très faible vitesse.',
      en: 'Verify shaft verticality and run-out, confirm hydrodynamic oil film establishment, and monitor bearing babbitt temperatures.',
    },
    prerequisites: [
      'Injection d\'huile haute pression (Hydrostatic Oil Lift) de butée activée et pression confirmée (> 120 bar)',
      'Circuit de réfrigération eau des échangeurs de paliers en service normal',
      'Instrumentation de vibration (Bently Nevada X-Y) et sondes RTD de coussinets étalonnées',
    ],
    testSequence: [
      { step: 1, fr: 'Ouverture infime des directrices pour amorcer la rotation (vitesse < 10% nominale) pendant 15 minutes.', en: 'Crack guide vanes to initiate slow spin (< 10% rated speed) for 15 minutes.' },
      { step: 2, fr: 'Contrôle visuel du sens de rotation et vérification de l\'absence de tout bruit de frottement mécanique ou de cavitation.', en: 'Confirm correct direction of rotation and verify absence of mechanical rubbing sounds.' },
      { step: 3, fr: 'Accélération par paliers : 25%, 50%, 75% puis 100% de la vitesse nominale avec coupure de l\'injection HP au-delà de 75%.', en: 'Step acceleration: 25%, 50%, 75%, and 100% rated speed with HP oil lift cut-off above 75% speed.' },
      { step: 4, fr: 'Stabilisation thermique à vitesse nominale à vide pendant 2 heures ; relevé des orbites d\'arbres.', en: 'Thermal heat run at rated speed no-load for 2 hours; log shaft orbits and bearing temperatures.' },
    ],
    acceptanceCriteria: {
      fr: 'Température maximale des coussinets de butée <= 65 °C. Vitesse vibratoire RMS <= 1.6 mm/s (Zone A).',
      en: 'Maximum thrust bearing babbitt temperature <= 65 °C. RMS vibration velocity <= 1.6 mm/s (Zone A).',
    },
    safetyPrecautions: {
      fr: 'Opérateur positionné près de la commande manuelle du clapet de fermeture rapide de sécurité.',
      en: 'Station attendant stationed at manual emergency gate drop lever with dedicated comms.',
    },
  },
  {
    id: 'prot-05',
    stepNumber: 5,
    stage: 'SAT',
    name: {
      fr: 'Essais à Vide, Saturation Statorique & Réglage Régulateur AVR',
      en: 'No-Load Saturation Curve & Automatic Voltage Regulator (AVR) Tuning',
    },
    normativeReference: 'IEEE 421.5 & IEC 60034-1',
    governingStandard: 'IEEE 421.5',
    targetEquipment: 'Système d\'Excitation & Régulateur AVR',
    objective: {
      fr: 'Tracer la courbe de saturation à vide U_stator = f(I_rotor), mesurer les pertes fer et régler les boucles de régulation de tension en boucle fermée.',
      en: 'Plot open-circuit saturation curve U_stator = f(I_rotor), evaluate core iron losses, and calibrate AVR closed-loop step response.',
    },
    prerequisites: [
      'Disjoncteur de groupe (GCB) ouvert et verrouillé en position d\'essai',
      'Système d\'extinction incendie automatique de l\'alternateur armé et opérationnel',
      'Protection surtension (ANSI 59) et protection V/Hz (ANSI 24) en service actif',
    ],
    testSequence: [
      { step: 1, fr: 'Fermeture de l\'interrupteur d\'excitation et amorçage par flashage continu (Field Flashing 110 V DC).', en: 'Close field breaker and execute field flashing from 110 V DC station battery.' },
      { step: 2, fr: 'Montée progressive de la tension statorique par pas de 10% jusqu\'à 100% Un, puis palier à 110% Un pour relever la saturation.', en: 'Ramp stator terminal voltage in 10% steps up to 100% Un, then 110% Un to map core saturation.' },
      { step: 3, fr: 'Application d\'un échelon de consigne de tension de ±5% pour mesurer le temps de réponse et le dépassement de l\'AVR.', en: 'Inject ±5% voltage reference step to record AVR response time and transient overshoot.' },
      { step: 4, fr: 'Essai de désexcitation rapide par décharge dans la résistance de désexcitation (Crowbar).', en: 'Execute rapid de-excitation field suppression test into discharge resistor.' },
    ],
    acceptanceCriteria: {
      fr: 'Dépassement de tension lors de l\'échelon <= 10%, temps de réponse <= 50 ms. Suppression de tension complète en moins de 1.0 s.',
      en: 'Step voltage overshoot <= 10%, rise time <= 50 ms. Total field de-excitation collapse < 1.0 s.',
    },
    safetyPrecautions: {
      fr: 'Vérifier l\'isolement des transformateurs de mesure de tension (TT) pour éviter toute réinjection vers le réseau.',
      en: 'Confirm secondary isolation of voltage instrument transformers (VT) to prevent back-feed to switchyard.',
    },
  },
  {
    id: 'prot-06',
    stepNumber: 6,
    stage: 'SAT',
    name: {
      fr: 'Premier Couplage Réseau & Prise de Charge Progressive (25% à 100%)',
      en: 'Initial Grid Synchronization & Incremental Load Ramp (25% to 100%)',
    },
    normativeReference: 'IEEE C37.102 & IEC 62270',
    governingStandard: 'IEEE C37.102',
    targetEquipment: 'Disjoncteur Groupe GCB, Synchroniseur Automatique & Réseau Transport',
    objective: {
      fr: 'Valider l\'ordre de phases, la concordance des tensions et l\'automatisme de synchronisation avant de fermer le disjoncteur groupe sur le réseau national.',
      en: 'Verify phase sequence, voltage matching, and automatic synchronizer operation prior to closing main generator breaker to the national grid.',
    },
    prerequisites: [
      'Autorisation écrite formelle du Dispatching National de Transport (Sonatrel)',
      'Contrôle de concordance de phase (Rotation horaire L1-L2-L3 vérifiée au synchronoscope)',
      'Toutes les protections électriques différentielles 87G et 87T armées',
    ],
    testSequence: [
      { step: 1, fr: 'Activation du synchroniseur automatique numérique : égalisation automatique de tension, fréquence et phase (ΔU < 2%, Δf < 0.1 Hz, Δθ < 5°).', en: 'Engage automatic synchronizer: auto match voltage, frequency, and phase angle (ΔU < 2%, Δf < 0.1 Hz, Δθ < 5°).' },
      { step: 2, fr: 'Ordre de fermeture du disjoncteur groupe (GCB) au zéro de phase ; prise de charge minimale immédiate à 5 MW pour éviter le déclenchement 32R.', en: 'Close GCB breaker at phase zero crossing; immediately pick up 5 MW active block to avoid 32R reverse power trip.' },
      { step: 3, fr: 'Montée en charge progressive par paliers de 2 heures : 25% (15 MW), 50% (30 MW), 75% (45 MW) et 100% (60 MW).', en: 'Progressive load ramp with 2-hour plateaus at 25% (15 MW), 50% (30 MW), 75% (45 MW), and 100% (60 MW).' },
      { step: 4, fr: 'Surveillance des températures stator (RTD Pt100) et des vibrations lors du passage de la zone de torche (vortex rope).', en: 'Continuous stator RTD thermal logging and vibration spectrum analysis through partial load vortex rope zone.' },
    ],
    acceptanceCriteria: {
      fr: 'Couplage doux sans à-coup de puissance mesurable. Échauffement thermique statorique inférieur à 105 K à 100% de charge.',
      en: 'Smooth synchronization with no severe transient power spike. Steady stator temperature rise < 105 K at 100% load.',
    },
    safetyPrecautions: {
      fr: 'Opérateur au poste de commande prêt à déclencher manuellement en cas de désynchronisation ou de pompage de puissance.',
      en: 'Control engineer primed for manual trip in case of pole slip or severe power swings.',
    },
  },
  {
    id: 'prot-07',
    stepNumber: 7,
    stage: 'SAT',
    name: {
      fr: 'Essai de Délestage Brut à 100% de Charge & Mesure Coup de Bélier',
      en: 'Full 100% Load Rejection Test & Water Hammer Transient Verification',
    },
    normativeReference: 'IEC 60041 §12 & IEEE 125',
    governingStandard: 'IEC 60041',
    targetEquipment: 'Turbine, Régulateur de Vitesse, Conduite Forcée & Cheminée',
    objective: {
      fr: 'Provoquer l\'ouverture brutale du disjoncteur groupe à pleine puissance pour vérifier que la surpression hydraulique et la survitesse mécanique restent strictement sous les limites contractuelles.',
      en: 'Trigger full-load breaker trip at 100% rated power to prove that water hammer overpressure and generator runaway overspeed remain strictly below guaranteed design limits.',
    },
    prerequisites: [
      'Groupe stabilisé à 100% de puissance nominale depuis au moins 1 heure',
      'Capteurs de pression piézorésistifs haute fréquence installés à l\'entrée de bâche spirale et au pied de conduite',
      'Coordination préalable avec le Dispatching Sonatrel pour la compensation instantanée de puissance sur le réseau',
    ],
    testSequence: [
      { step: 1, fr: 'Déclenchement volontaire du disjoncteur groupe GCB à P = 100% P_nom (ex. 60 MW).', en: 'Initiate manual trip of generator breaker GCB at P = 100% P_nom (e.g. 60 MW).' },
      { step: 2, fr: 'Fermeture rapide automatique des directrices sous l\'action des servomoteurs oléohydrauliques du régulateur.', en: 'Automated rapid emergency closure of turbine wicket gates driven by hydraulic servomotors.' },
      { step: 3, fr: 'Enregistrement transitoire haute vitesse (1 kHz) : montée en pression (coup de bélier +ΔH), dépression (-ΔH), survitesse rotor (+ΔN) et oscillation du niveau dans la cheminée d\'équilibre.', en: 'High-speed transient logging (1 kHz): peak water hammer surge (+ΔH), penstock depression (-ΔH), rotor overspeed (+ΔN), and surge shaft oscillation.' },
      { step: 4, fr: 'Retour automatique du groupe à la vitesse nominale à vide sans arrêt complet.', en: 'Automatic stabilization of the unit back to rated no-load idling speed without full shutdown.' },
    ],
    acceptanceCriteria: {
      fr: 'Surpression transitoire max +ΔH <= +25% de la pression statique. Survitesse maximale du rotor +ΔN <= +45% de la vitesse nominale.',
      en: 'Maximum transient water hammer surge +ΔH <= +25% static head. Maximum rotor overspeed peak +ΔN <= +45% rated RPM.',
    },
    safetyPrecautions: {
      fr: 'Présence d\'une équipe d\'inspection visuelle à la cheminée d\'équilibre pour vérifier l\'absence de débordement.',
      en: 'Inspection team dispatched to surge tank platform to confirm zero crest overtopping.',
    },
  },
  {
    id: 'prot-08',
    stepNumber: 8,
    stage: 'SAT',
    name: {
      fr: 'Essai de Reconstitution du Réseau & Démarrage Autonome (Black Start)',
      en: 'Black Start Capability & Islanded Grid Restoration Test',
    },
    normativeReference: 'IEC 62270 §8 & Sonatrel Grid Code',
    governingStandard: 'IEC 62270',
    targetEquipment: 'Groupe Diesel de Secours, Auxiliaires Usine & Ligne THT 225 kV',
    objective: {
      fr: 'Prouver la capacité de l\'aménagement à démarrer sans aucune alimentation électrique externe en cas d\'effondrement général du réseau national (Blackout).',
      en: 'Prove the facility\'s ability to restart from complete dead-station blackout conditions without external grid power and energize transmission backbone.',
    },
    prerequisites: [
      'Centrale totalement découplée du réseau électrique externe (îlotage complet simulé)',
      'Batteries 110 V DC et 48 V DC chargées à 100%',
      'Réservoirs de carburant du groupe électrogène diesel d\'urgence pleins',
    ],
    testSequence: [
      { step: 1, fr: 'Démarrage automatique du groupe électrogène diesel de secours 1.5 MVA et réalimentation du tableau 400 V auxiliaires essentiels.', en: 'Auto-start 1.5 MVA emergency black-start diesel generator and re-energize 400 V essential auxiliaries bus.' },
      { step: 2, fr: 'Mise en marche des motopompes oléohydrauliques du régulateur de vitesse et des pompes de circulation d\'eau de réfrigération.', en: 'Power up governor hydraulic oil pumps and unit cooling water circulation pumps.' },
      { step: 3, fr: 'Ouverture de la vanne de tête, dévirage du groupe hydroélectrique, amorçage de l\'excitation et montée à 11 kV nominal.', en: 'Open intake gate, spin up hydro unit, flash excitation field, and stabilize at 11 kV terminal voltage.' },
      { step: 4, fr: 'Sous-tensionnement de la ligne 225 kV à vide (charge capacitive) vers le poste de Mangombé / Oyomabang.', en: 'Energize un-loaded 225 kV transmission line to absorb line charging Ferranti reactive MVAR.' },
    ],
    acceptanceCriteria: {
      fr: 'Alimentation du premier groupe hydroélectrique rétablie en moins de 30 minutes après ordre de black-start.',
      en: 'First hydro generating unit fully synchronized and ready for transmission energization within 30 minutes from blackout initiation.',
    },
    safetyPrecautions: {
      fr: 'Surveillance étroite de la surtension par effet Ferranti sur la ligne 225 kV à vide (maintien de U <= 1.10 Un par sous-excitation).',
      en: 'Strict monitoring of Ferranti overvoltage along open-ended 225 kV line (maintain U <= 1.10 Un via generator under-excitation).',
    },
  },
];

export const HydropowerStandardsView: React.FC<HydropowerStandardsViewProps> = ({
  locale,
  initialStandardRef,
  onSelectSubsystem,
}) => {
  const [mainTab, setMainTab] = useState<StandardsMainTab>('catalogue');
  const [activeStandardRef, setActiveStandardRef] = useState<string>(
    initialStandardRef || 'IEC 60041'
  );
  const [selectedIssuer, setSelectedIssuer] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update active standard if prop changes
  useEffect(() => {
    if (initialStandardRef) {
      setActiveStandardRef(initialStandardRef);
      setMainTab('catalogue');
    }
  }, [initialStandardRef]);

  // Active Calculator
  const [selectedCalcId, setSelectedCalcId] = useState<CalculatorId>('iec60041');

  // Calculator 1: IEC 60041 State
  const [calc1HeadM, setCalc1HeadM] = useState<number>(50.0);
  const [calc1FlowM3s, setCalc1FlowM3s] = useState<number>(140.0);
  const [calc1ElecMW, setCalc1ElecMW] = useState<number>(60.0);
  const [calc1GenEff, setCalc1GenEff] = useState<number>(97.8);
  const [calc1GuaranteedEff, setCalc1GuaranteedEff] = useState<number>(92.5);
  const [calc1Uncertainty, setCalc1Uncertainty] = useState<number>(1.2);

  // Calculator 2: ISO 20816-5 State
  const [calc2Rpm, setCalc2Rpm] = useState<number>(125);
  const [calc2MachineType, setCalc2MachineType] = useState<string>('francis_vert');
  const [calc2Vrms, setCalc2Vrms] = useState<number>(1.85);
  const [calc2ShaftSpp, setCalc2ShaftSpp] = useState<number>(85); // microns
  const [calc2BearingClearance, setCalc2BearingClearance] = useState<number>(220); // microns

  // Calculator 3: IEEE C37.102 State
  const [calc3Xd, setCalc3Xd] = useState<number>(1.15);
  const [calc3XdPrime, setCalc3XdPrime] = useState<number>(0.32);
  const [calc3MVA, setCalc3MVA] = useState<number>(70.0);
  const [calc3KV, setCalc3KV] = useState<number>(11.0);

  // Calculator 4: IEC 60193 State
  const [calc4ModelDiaM, setCalc4ModelDiaM] = useState<number>(0.35);
  const [calc4ProtoDiaM, setCalc4ProtoDiaM] = useState<number>(4.20);
  const [calc4ModelHeadM, setCalc4ModelHeadM] = useState<number>(15.0);
  const [calc4ProtoHeadM, setCalc4ProtoHeadM] = useState<number>(50.0);
  const [calc4ModelEff, setCalc4ModelEff] = useState<number>(90.4);

  // Calculator 5: IEEE 421.5 PSS2B Modal Damping Simulation State (linked to auditSettingsStore)
  const initialAuditState = auditSettingsStore.getSettings();
  const [pssGainKs1, setPssGainKs1] = useState<number>(initialAuditState.pss2bKs1);
  const [pssT1Lead, setPssT1Lead] = useState<number>(initialAuditState.pss2bT1);
  const [pssT2Lag, setPssT2Lag] = useState<number>(initialAuditState.pss2bT2);
  const [gridOscillationFreqHz, setGridOscillationFreqHz] = useState<number>(initialAuditState.pss2bFreqHz);
  const [pssEnabled, setPssEnabled] = useState<boolean>(true);

  // Synchronize state back into auditSettingsStore whenever auditor adjusts parameters
  useEffect(() => {
    auditSettingsStore.updateSettings({
      pss2bKs1: pssGainKs1,
      pss2bT1: pssT1Lead,
      pss2bT2: pssT2Lag,
      pss2bFreqHz: gridOscillationFreqHz,
    });
  }, [pssGainKs1, pssT1Lead, pssT2Lag, gridOscillationFreqHz, pssEnabled]);

  // Audit Checklist State
  const [auditChecklist, setAuditChecklist] = useState<AuditItemState[]>(INITIAL_AUDIT_CHECKLIST);
  const [auditFacility, setAuditFacility] = useState<string>('Nachtigal Amont (420 MW)');

  // Selected Testing Protocol
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('prot-01');
  const [protocolSignoffs, setProtocolSignoffs] = useState<Record<string, { signed: boolean; signedBy?: string; signDate?: string }>>({
    'prot-01': { signed: true, signedBy: 'Ing. Nsangou (Bureau Veritas / Eneo)', signDate: '2025-11-14' },
    'prot-02': { signed: true, signedBy: 'Expert Alstom Hydro Platform', signDate: '2025-12-02' },
    'prot-03': { signed: true, signedBy: 'Commission FAT Grenoble', signDate: '2026-01-10' },
  });

  // Filter lists
  const issuers: StandardIssuer[] = ['IEC', 'IEEE', 'ISO', 'NFPA', 'CIGRE', 'ASCE', 'DIN', 'ICOLD'];
  const categories: StandardCategory[] = ['hydraulic', 'electrical', 'mechanical', 'control', 'civil', 'safety', 'monitoring'];

  // Filtered Standards
  const filteredStandards = useMemo(() => {
    return HYDRO_STANDARDS_CATALOGUE.filter((std) => {
      if (selectedIssuer !== 'all' && std.issuer !== selectedIssuer) return false;
      if (selectedCategory !== 'all' && std.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRef = std.reference.toLowerCase().includes(q);
        const matchTitle = std.title.fr.toLowerCase().includes(q) || std.title.en.toLowerCase().includes(q);
        const matchScope = std.scope.fr.toLowerCase().includes(q) || std.scope.en.toLowerCase().includes(q);
        const matchReq = std.keyRequirements.some(
          (r) => r.fr.toLowerCase().includes(q) || r.en.toLowerCase().includes(q) || (r.clause && r.clause.toLowerCase().includes(q))
        );
        const matchCam = std.cameroonApplication.fr.toLowerCase().includes(q) || std.cameroonApplication.en.toLowerCase().includes(q);
        const matchSub = std.applicableSubsystems.some((sub) => sub.toLowerCase().includes(q));
        return matchRef || matchTitle || matchScope || matchReq || matchCam || matchSub;
      }
      return true;
    });
  }, [selectedIssuer, selectedCategory, searchQuery]);

  const activeStandard = useMemo(() => {
    return (
      HYDRO_STANDARDS_CATALOGUE.find((s) => s.reference === activeStandardRef) ||
      HYDRO_STANDARDS_CATALOGUE[0]
    );
  }, [activeStandardRef]);

  // Calculator 1 Derived Computation (IEC 60041)
  const calc1Results = useMemo(() => {
    const rho = 1000;
    const g = 9.80665;
    const mechanicalPowerMW = calc1ElecMW / (calc1GenEff / 100);
    const hydraulicPowerMW = (rho * g * calc1FlowM3s * calc1HeadM) / 1e6;
    const measuredEfficiencyPct = (mechanicalPowerMW / hydraulicPowerMW) * 100;
    const deltaEff = measuredEfficiencyPct - calc1GuaranteedEff;
    const lowerGuaranteeBound = calc1GuaranteedEff - calc1Uncertainty;
    const isCompliantDirect = measuredEfficiencyPct >= calc1GuaranteedEff;
    const isCompliantWithinUncertainty = measuredEfficiencyPct >= lowerGuaranteeBound;

    return {
      mechanicalPowerMW,
      hydraulicPowerMW,
      measuredEfficiencyPct,
      deltaEff,
      lowerGuaranteeBound,
      isCompliantDirect,
      isCompliantWithinUncertainty,
    };
  }, [calc1HeadM, calc1FlowM3s, calc1ElecMW, calc1GenEff, calc1GuaranteedEff, calc1Uncertainty]);

  // Calculator 2 Derived Computation (ISO 20816-5)
  const calc2Results = useMemo(() => {
    // ISO 20816-5 thresholds for Francis vertical units
    let zoneALimit = 1.6;
    let zoneBLimit = 2.5;
    let zoneCLimit = 4.0;

    let zone: 'A' | 'B' | 'C' | 'D' = 'A';
    let zoneColor = 'emerald';
    let zoneTitleFr = 'Zone A : Machine Neuve / Réception Conforme';
    let zoneTitleEn = 'Zone A : Newly Commissioned / Fully Compliant';
    let adviceFr = 'Niveaux vibratoires excellents. Aucun écart constaté.';
    let adviceEn = 'Excellent vibration levels. Full baseline clearance.';

    if (calc2Vrms <= zoneALimit) {
      zone = 'A';
      zoneColor = 'emerald';
      zoneTitleFr = 'Zone A : Machine Neuve / Réception Conforme';
      zoneTitleEn = 'Zone A : Newly Commissioned / Fully Compliant';
      adviceFr = 'Vibrations conformes aux critères de réception usine et site les plus stricts.';
      adviceEn = 'Meets the strictest FAT/SAT acceptance criteria for new machinery.';
    } else if (calc2Vrms <= zoneBLimit) {
      zone = 'B';
      zoneColor = 'sky';
      zoneTitleFr = 'Zone B : Exploitation Continue Illimitée';
      zoneTitleEn = 'Zone B : Unrestricted Long-term Operation';
      adviceFr = 'Fonctionnement normal acceptable sans restriction temporelle.';
      adviceEn = 'Normal long-term operation admissible with no time constraints.';
    } else if (calc2Vrms <= zoneCLimit) {
      zone = 'C';
      zoneColor = 'amber';
      zoneTitleFr = 'Zone C : Seuil d\'Alerte & Surveillance Renforcée';
      zoneTitleEn = 'Zone C : Alarm Level & Enhanced Monitoring';
      adviceFr = 'Machine admissible pour une durée limitée. Nécessite une auscultation spectrale (désalignement, cavitation, balourd).';
      adviceEn = 'Admissible for restricted duration only. Plan spectral FFT diagnostics (misalignment, unbalance, cavitation).';
    } else {
      zone = 'D';
      zoneColor = 'red';
      zoneTitleFr = 'Zone D : Danger / Déclenchement d\'Arrêt d\'Urgence Recommandé';
      zoneTitleEn = 'Zone D : Dangerous Vibration / Immediate Trip Required';
      adviceFr = 'Risque élevé d\'endommagement structural des paliers ou de la roue. Déclenchement immédiat prescrit.';
      adviceEn = 'Critical risk of bearing babbitt wiping or runner destruction. Immediate trip mandated.';
    }

    const shaftRatioPct = (calc2ShaftSpp / calc2BearingClearance) * 100;
    const shaftStatus =
      shaftRatioPct > 75 ? 'danger' : shaftRatioPct > 55 ? 'warning' : 'safe';

    return {
      zone,
      zoneColor,
      zoneTitleFr,
      zoneTitleEn,
      adviceFr,
      adviceEn,
      zoneALimit,
      zoneBLimit,
      zoneCLimit,
      shaftRatioPct,
      shaftStatus,
    };
  }, [calc2Vrms, calc2ShaftSpp, calc2BearingClearance]);

  // Calculator 3 Derived Computation (IEEE C37.102)
  const calc3Results = useMemo(() => {
    const zBase = (calc3KV * calc3KV) / calc3MVA;
    const zone1Offset = -calc3XdPrime / 2;
    const zone1Dia = 1.0;
    const zone2Offset = -calc3XdPrime / 2;
    const zone2Dia = calc3Xd;

    const zone1OffsetOhms = zone1Offset * zBase;
    const zone1DiaOhms = zone1Dia * zBase;
    const zone2OffsetOhms = zone2Offset * zBase;
    const zone2DiaOhms = zone2Dia * zBase;

    return {
      zBase,
      zone1Offset,
      zone1Dia,
      zone1OffsetOhms,
      zone1DiaOhms,
      zone2Offset,
      zone2Dia,
      zone2OffsetOhms,
      zone2DiaOhms,
    };
  }, [calc3Xd, calc3XdPrime, calc3MVA, calc3KV]);

  // Calculator 4 Derived Computation (IEC 60193)
  const calc4Results = useMemo(() => {
    const reynoldsRatio =
      (calc4ProtoDiaM / calc4ModelDiaM) * Math.sqrt(calc4ProtoHeadM / calc4ModelHeadM);
    // Standard IEC 60193 step-up scale formula
    const V_star = 0.70; // Standard scalable loss ratio for high performance Francis
    const exponent = 0.16;
    const stepUpEfficiencyPct = V_star * (1 - Math.pow(1 / reynoldsRatio, exponent)) * 100;
    const predictedProtoEff = Math.min(96.5, calc4ModelEff + stepUpEfficiencyPct);

    return {
      reynoldsRatio,
      stepUpEfficiencyPct,
      predictedProtoEff,
    };
  }, [calc4ModelDiaM, calc4ProtoDiaM, calc4ModelHeadM, calc4ProtoHeadM, calc4ModelEff]);

  // Calculator 5 Derived Computation (IEEE 421.5 PSS2B)
  const calc5Results = useMemo(() => {
    const omega = 2 * Math.PI * gridOscillationFreqHz;
    // Phase lead provided by (1 + s*T1)/(1 + s*T2)
    const phaseLeadRad = Math.atan(omega * pssT1Lead) - Math.atan(omega * pssT2Lag);
    const phaseLeadDeg = (phaseLeadRad * 180) / Math.PI;

    // Natural mechanical damping of machine without PSS is low (~3-5%)
    const baselineDamping = 0.04;
    // Additional electrical damping torque produced by PSS in phase with speed deviation
    const pssContributedDamping = pssEnabled
      ? (pssGainKs1 / 100) * Math.cos(phaseLeadRad - 0.2) * 0.78
      : 0;

    const totalDampingRatioZeta = Math.max(0.02, Math.min(0.35, baselineDamping + pssContributedDamping));
    const totalDampingPct = totalDampingRatioZeta * 100;
    const settlingTimeSec = totalDampingRatioZeta > 0.01 ? 4 / (totalDampingRatioZeta * omega) : 15.0;

    const isCompliant = totalDampingPct >= 15.0;

    // Generate 60 time points for dynamic visual swing curve (0 to 6 seconds)
    const timePoints = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * 5.0; // 0 to 5 seconds
      // Response to 0.15 pu step disturbance on intertie
      const envelope = Math.exp(-totalDampingRatioZeta * omega * t);
      const swingPowerPu = 1.0 + 0.25 * envelope * Math.cos(omega * Math.sqrt(1 - totalDampingRatioZeta ** 2) * t);
      timePoints.push({ t: Number(t.toFixed(2)), power: Number(swingPowerPu.toFixed(3)), envelope: Number(envelope.toFixed(3)) });
    }

    return {
      phaseLeadDeg,
      totalDampingRatioZeta,
      totalDampingPct,
      settlingTimeSec,
      isCompliant,
      timePoints,
    };
  }, [gridOscillationFreqHz, pssGainKs1, pssT1Lead, pssT2Lag, pssEnabled]);

  // Audit Checklist Scores
  const auditScore = useMemo(() => {
    const weights: Record<string, number> = {
      compliant: 100,
      minor_gap: 70,
      in_progress: 50,
      critical_nc: 0,
    };
    const totalPoints = auditChecklist.reduce((acc, item) => acc + weights[item.status], 0);
    const maxPoints = auditChecklist.length * 100;
    const percentage = (totalPoints / maxPoints) * 100;
    const compliantCount = auditChecklist.filter((i) => i.status === 'compliant').length;
    const minorGapCount = auditChecklist.filter((i) => i.status === 'minor_gap').length;
    const criticalCount = auditChecklist.filter((i) => i.status === 'critical_nc').length;

    return {
      percentage,
      compliantCount,
      minorGapCount,
      criticalCount,
    };
  }, [auditChecklist]);

  const updateAuditStatus = (
    id: string,
    status: 'compliant' | 'minor_gap' | 'critical_nc' | 'in_progress'
  ) => {
    setAuditChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleExportAuditCertificate = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const textReport = `================================================================================
RÉPUBLIQUE DU CAMEROUN - MINISTÈRE DE L'EAU ET DE L'ÉNERGIE
AGENCE DE RÉGULATION DU SECTEUR DE L'ÉLECTRICITÉ (ARSEL) / SONATREL
CERTIFICAT OFFICIEL D'AUDIT DE CONFORMITÉ NORMATIVE HYDROÉLECTRIQUE
================================================================================
OUVRAGE / AMÉNAGEMENT AUDITÉ : ${auditFacility.toUpperCase()}
DATE D'AUDIT               : ${timestamp}
RÉFÉRENTIEL                : CEI / IEEE / ISO / CIGRE / NFPA / ICOLD
SCORE GLOBAL D'AUDIT       : ${auditScore.percentage.toFixed(1)} % (${auditScore.compliantCount}/${auditChecklist.length} EXIGENCES CONFORMES)
STATUT D'HOMOLOGATION      : ${auditScore.percentage >= 90 ? 'CONFORME CERTIFIÉ (GRADE A)' : 'RÉSERVES MINEURES À LEVER (GRADE B)'}

--------------------------------------------------------------------------------
SYNTHÈSE PAR DOMAINE NORMATIF & RÉSULTATS D'ÉVALUATION :
--------------------------------------------------------------------------------
${auditChecklist
  .map(
    (item, idx) =>
      `[${String(idx + 1).padStart(2, '0')}] ${item.reference.padEnd(20)} | ${item.domainFr.padEnd(35)}
    Exigence : ${item.requirementFr}
    Statut   : ${
      item.status === 'compliant'
        ? 'CONFORME (100%)'
        : item.status === 'minor_gap'
        ? 'ÉCART MINEUR (70%)'
        : item.status === 'in_progress'
        ? 'EN COURS (50%)'
        : 'NON-CONFORME CRITIQUE (0%)'
    }
    Preuves  : ${item.commentsFr}
`
  )
  .join('\n')}
--------------------------------------------------------------------------------
ENGAGEMENTS DE LEVÉE DES ÉCARTS & VALIDATION TECHNIQUE :
- PSS2B (IEEE 421.5) : Calage des filtres de bande pour l'interconnexion Yaoundé-Douala.
- Commission d'Homologation & Auditeurs Certifiés : Équipe d'Ingénierie EPEDE / SONATREL.
================================================================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificat_Audit_${auditFacility.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedProtocol = useMemo(() => {
    return (
      TESTING_PROTOCOLS.find((p) => p.id === selectedProtocolId) || TESTING_PROTOCOLS[0]
    );
  }, [selectedProtocolId]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1420] via-[#091522] to-[#0A1017] p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800">
                {locale === 'fr'
                  ? 'ÉTAPE 5 · STANDARDS INTERNATIONAUX & CONFORMITÉ HYDROÉLECTRIQUE'
                  : 'STEP 5 · INTERNATIONAL STANDARDS & HYDROELECTRIC COMPLIANCE'}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {HYDRO_STANDARDS_CATALOGUE.length} {locale === 'fr' ? 'Codes CEI / IEEE / ISO / NFPA / CIGRE / ASCE' : 'Normative Codes Registered'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {locale === 'fr'
                ? 'Référentiel Normatif, Métrologie & Audit de Conformité'
                : 'Normative Standards Registry, Metrology & Compliance Audit'}
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Suite intégrée de conformité prescriptive pour l\'ingénierie hydroélectrique : répertoire exhaustif des codes internationaux, calculateurs de tolérances métrologiques (CEI 60041, ISO 20816-5, IEEE C37.102), matrice d\'audit réglementaire et guides pas-à-pas des essais de réception FAT & SAT.'
                : 'Comprehensive prescriptive compliance suite for hydroelectric engineering: exhaustive international standards repository, metrological tolerance calculators (IEC 60041, ISO 20816-5, IEEE C37.102), regulatory audit matrix, and step-by-step FAT & SAT testing protocols.'}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">
                {locale === 'fr' ? 'Score Audit' : 'Audit Score'}
              </div>
              <div className="text-lg font-black text-emerald-400">
                {auditScore.percentage.toFixed(1)} %
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">
                {locale === 'fr' ? 'Codes Validés' : 'Active Codes'}
              </div>
              <div className="text-lg font-black text-amber-400">
                {HYDRO_STANDARDS_CATALOGUE.length} Standards
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-[#252E38] flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMainTab('catalogue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              mainTab === 'catalogue'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Répertoire des Normes (16)' : 'Standards Registry (16)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('calculators')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              mainTab === 'calculators'
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>{locale === 'fr' ? 'Calculateurs de Tolérances (4)' : 'Normative Calculators (4)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              mainTab === 'audit'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Matrice d\'Audit Réglementaire' : 'Regulatory Audit Matrix'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('protocols')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              mainTab === 'protocols'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
            <span>{locale === 'fr' ? 'Protocoles d\'Essais FAT & SAT' : 'FAT & SAT Testing Protocols'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. TAB: STANDARDS CATALOGUE & DOSSIER */}
      {/* ==================================================================== */}
      {mainTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Controls Bar: Filters & Search */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] flex flex-wrap items-center justify-between gap-4">
            {/* Issuer Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="font-mono text-xs text-neutral-400 font-bold mr-1">
                {locale === 'fr' ? 'Organisme :' : 'Issuer:'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIssuer('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  selectedIssuer === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                    : 'bg-[#080B10] text-neutral-400 hover:text-white border border-[#252E38]'
                }`}
              >
                TOUS
              </button>
              {issuers.map((iss) => (
                <button
                  key={iss}
                  type="button"
                  onClick={() => setSelectedIssuer(iss)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    selectedIssuer === iss
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                      : 'bg-[#080B10] text-neutral-400 hover:text-white border border-[#252E38]'
                  }`}
                >
                  {iss}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="font-mono text-xs text-neutral-400 font-bold mr-1">
                {locale === 'fr' ? 'Domaine :' : 'Category:'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/60'
                    : 'bg-[#080B10] text-neutral-400 hover:text-white border border-[#252E38]'
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/60'
                      : 'bg-[#080B10] text-neutral-400 hover:text-white border border-[#252E38]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder={locale === 'fr' ? 'Rechercher code, mot-clé, article...' : 'Search code, keyword, clause...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080B10] border border-[#252E38] rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Split Layout: List Left, Dossier Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Scrollable Standard List */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'Répertoire Certifié' : 'Registered Standards'}
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {filteredStandards.length} références
                </span>
              </div>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredStandards.map((std) => {
                  const isSelected = activeStandardRef === std.reference;
                  return (
                    <button
                      key={std.reference}
                      type="button"
                      onClick={() => setActiveStandardRef(std.reference)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all font-mono ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/30 text-amber-200 ring-1 ring-amber-400 shadow-md'
                          : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:text-white hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400">{std.reference}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-sky-400 uppercase">
                            {std.category}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 px-1.5 py-0.2 rounded bg-[#080B10] border border-[#252E38]">
                            {std.issuer}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                        {locale === 'fr' ? std.title.fr : std.title.en}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {std.applicableSubsystems.slice(0, 4).map((sub) => (
                          <span
                            key={sub}
                            className="text-[9px] font-bold px-1 rounded bg-[#090D14] text-sky-400 border border-sky-900/60"
                          >
                            {sub}
                          </span>
                        ))}
                        {std.applicableSubsystems.length > 4 && (
                          <span className="text-[9px] text-neutral-500">
                            +{std.applicableSubsystems.length - 4}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Cols: Detailed Standard Dossier */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
                {/* Standard Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252E38]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-amber-400 px-2.5 py-0.5 rounded bg-amber-950 border border-amber-800">
                        {activeStandard.reference}
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-400 uppercase px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800">
                        {activeStandard.category}
                      </span>
                      <span className="font-mono text-xs text-neutral-400 font-bold">
                        {activeStandard.issuer} · Édition {activeStandard.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white font-mono mt-2 leading-tight">
                      {locale === 'fr' ? activeStandard.title.fr : activeStandard.title.en}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMainTab('calculators');
                        if (activeStandard.reference === 'IEC 60041') setSelectedCalcId('iec60041');
                        else if (activeStandard.reference === 'ISO 20816-5') setSelectedCalcId('iso20816');
                        else if (activeStandard.reference === 'IEEE C37.102') setSelectedCalcId('ieee_c37_102');
                        else if (activeStandard.reference === 'IEC 60193') setSelectedCalcId('iec60193');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/60 hover:bg-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Ouvrir Calculateur Lié' : 'Launch Associated Tool'}</span>
                    </button>
                  </div>
                </div>

                {/* Scope */}
                <div className="mt-4">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    {locale === 'fr' ? 'Périmètre & Portée Technique' : 'Scope & Technical Field'}
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                    {locale === 'fr' ? activeStandard.scope.fr : activeStandard.scope.en}
                  </p>
                </div>

                {/* Project Lifecycle Stages */}
                <div className="mt-5">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    {locale === 'fr' ? 'Phases du Cycle de Vie Applicables' : 'Applicable Project Lifecycle Stages'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStandard.lifecycleStages.map((stg) => (
                      <span
                        key={stg}
                        className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#080B10] border border-[#252E38] text-neutral-300 flex items-center gap-1.5"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{stg}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Prescriptive Clauses & Requirements */}
                <div className="mt-5">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Exigences Prescriptives & Articles Majeurs' : 'Major Prescriptive Clauses'}</span>
                  </h4>
                  <div className="space-y-2">
                    {activeStandard.keyRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#090D14] border border-[#252E38] text-xs font-mono text-neutral-300 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                          <span>{req.clause || `Article §${idx + 1}`}</span>
                        </div>
                        <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                          {locale === 'fr' ? req.fr : req.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceptance Criteria */}
                {activeStandard.acceptanceCriteria && (
                  <div className="mt-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60">
                    <div className="font-mono text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'CRITÈRE DE RÉCEPTION & GARANTIE :' : 'ACCEPTANCE & GUARANTEE CRITERIA:'}</span>
                    </div>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                      {locale === 'fr'
                        ? activeStandard.acceptanceCriteria.fr
                        : activeStandard.acceptanceCriteria.en}
                    </p>
                  </div>
                )}

                {/* Tolerances and Quantitative Limits Table */}
                {activeStandard.tolerancesAndLimits && activeStandard.tolerancesAndLimits.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-sky-400" />
                      <span>{locale === 'fr' ? 'Seuils Quantitatifs & Tolérances Admissibles' : 'Quantitative Thresholds & Tolerances'}</span>
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-[#252E38]">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#080B10] text-neutral-400 text-[10px] uppercase border-b border-[#252E38]">
                          <tr>
                            <th className="p-2.5">Paramètre Normé</th>
                            <th className="p-2.5">Valeur Limite / Tolérance</th>
                            <th className="p-2.5">Réf. Normative</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1C2634] bg-[#0A0E17]">
                          {activeStandard.tolerancesAndLimits.map((t, idx) => (
                            <tr key={idx} className="hover:bg-[#0F1622] transition-colors">
                              <td className="p-2.5 font-bold text-white">{t.parameter}</td>
                              <td className="p-2.5 text-amber-300 font-bold">
                                {t.limit} {t.unit ? t.unit : ''}
                              </td>
                              <td className="p-2.5 text-neutral-400">{t.standardReference}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Cameroon Fleet Application */}
                <div className="mt-5 p-4 rounded-xl bg-linear-to-r from-sky-950/30 to-[#080B10] border border-sky-900/60">
                  <div className="font-mono text-xs font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'APPLICATION SUR LE PARC DU CAMEROUN :' : 'CAMEROON FLEET APPLICATION:'}</span>
                  </div>
                  <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                    {locale === 'fr'
                      ? activeStandard.cameroonApplication.fr
                      : activeStandard.cameroonApplication.en}
                  </p>
                </div>

                {/* Linked Subsystems */}
                <div className="mt-6 pt-5 border-t border-[#252E38]">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>{locale === 'fr' ? 'Sous-Systèmes Directement Concernés' : 'Directly Linked Subsystems'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStandard.applicableSubsystems.map((subId) => (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => onSelectSubsystem?.(subId as HydroSubsystemId)}
                        className="px-3 py-1.5 rounded-lg bg-[#080B10] hover:bg-[#141C28] border border-sky-900/60 text-sky-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 group"
                      >
                        <span>{subId}</span>
                        <ChevronRight className="w-3 h-3 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TAB: NORMATIVE CALCULATORS */}
      {/* ==================================================================== */}
      {mainTab === 'calculators' && (
        <div className="space-y-6">
          {/* Calculator Selector Tabs */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCalcId('iec60041')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedCalcId === 'iec60041'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm'
                  : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>1. CEI 60041 · Rendement Hydraulique</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCalcId('iso20816')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedCalcId === 'iso20816'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                  : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. ISO 20816-5 · Diagnostic Vibratoire</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCalcId('ieee_c37_102')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedCalcId === 'ieee_c37_102'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                  : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>3. IEEE C37.102 · Calage Relais Alternateur</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCalcId('iec60193')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedCalcId === 'iec60193'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-sm'
                  : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>4. CEI 60193 · Step-Up Maquette/Prototype</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCalcId('ieee421_pss')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedCalcId === 'ieee421_pss'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                  : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>5. IEEE 421.5 · Stabilisateur PSS2B (Audit AUD-07)</span>
            </button>
          </div>

          {/* CALCULATOR 1: IEC 60041 */}
          {selectedCalcId === 'iec60041' && (
            <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  CEI 60041 §9, §11 · ESSAI DE RÉCEPTION SUR SITE
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Calculateur de Rendement Hydraulique & Budget d\'Incertitude'
                    : 'Hydraulic Efficiency & Uncertainty Budget Calculator'}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  {locale === 'fr'
                    ? 'Vérifie si la turbine prototype satisfait la garantie contractuelle compte tenu de l\'incertitude métrologique composée.'
                    : 'Verifies whether prototype turbine meets contractual efficiency guarantees factoring composite measurement uncertainty.'}
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-sky-400 font-bold">Chute nette (Hn)</span>
                    <span className="text-white font-bold">{calc1HeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="0.5"
                    value={calc1HeadM}
                    onChange={(e) => setCalc1HeadM(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Ex: Nachtigal 50 m · Songloulou 40 m</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">Débit mesuré (Q)</span>
                    <span className="text-white font-bold">{calc1FlowM3s} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="250"
                    step="1"
                    value={calc1FlowM3s}
                    onChange={(e) => setCalc1FlowM3s(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Méthode acoustique multipente</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-emerald-400 font-bold">Puissance électrique mesurée (P_elec)</span>
                    <span className="text-white font-bold">{calc1ElecMW} MW</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="0.5"
                    value={calc1ElecMW}
                    onChange={(e) => setCalc1ElecMW(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Aux bornes alternateur 11 kV</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">Rendement alternateur (η_alt)</span>
                    <span className="text-white font-bold">{calc1GenEff} %</span>
                  </div>
                  <input
                    type="range"
                    min="95"
                    max="99"
                    step="0.1"
                    value={calc1GenEff}
                    onChange={(e) => setCalc1GenEff(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Bilan pertes CEI 60034-2</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-purple-400 font-bold">Rendement garanti contractuel</span>
                    <span className="text-white font-bold">{calc1GuaranteedEff} %</span>
                  </div>
                  <input
                    type="range"
                    min="85"
                    max="96"
                    step="0.1"
                    value={calc1GuaranteedEff}
                    onChange={(e) => setCalc1GuaranteedEff(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Spécification du contrat EPC</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-yellow-400 font-bold">Incertitude métrologique (f_inc)</span>
                    <span className="text-white font-bold">±{calc1Uncertainty} %</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={calc1Uncertainty}
                    onChange={(e) => setCalc1Uncertainty(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">CEI 60041 impose f_inc &lt; ±1.5%</div>
                </div>
              </div>

              {/* Results Display */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                <div>
                  <div className="text-neutral-500 uppercase">Puissance Hydraulique Brute</div>
                  <div className="text-lg font-black text-white mt-1">
                    {calc1Results.hydraulicPowerMW.toFixed(2)} MW
                  </div>
                  <div className="text-[10px] text-neutral-500">P = ρ·g·Q·H</div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Puissance sur Arbre (Méc.)</div>
                  <div className="text-lg font-black text-white mt-1">
                    {calc1Results.mechanicalPowerMW.toFixed(2)} MW
                  </div>
                  <div className="text-[10px] text-neutral-500">P_meca = P_elec / η_alt</div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Rendement Turbine Mesuré</div>
                  <div className="text-2xl font-black text-sky-400 mt-1">
                    {calc1Results.measuredEfficiencyPct.toFixed(2)} %
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Écart garantie : {calc1Results.deltaEff >= 0 ? '+' : ''}
                    {calc1Results.deltaEff.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Verdict CEI 60041</div>
                  <div className="mt-1">
                    {calc1Results.isCompliantDirect ? (
                      <span className="inline-flex items-center gap-1 font-black text-emerald-400 text-sm">
                        <Check className="w-4 h-4" /> CONFORME (Marge +)
                      </span>
                    ) : calc1Results.isCompliantWithinUncertainty ? (
                      <span className="inline-flex items-center gap-1 font-black text-amber-400 text-sm">
                        <Info className="w-4 h-4" /> CONFORME (Tolérance Incert.)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-black text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4" /> NON-CONFORME (Pénalité)
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Seuil légal : {calc1Results.lowerGuaranteeBound.toFixed(2)} %
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 2: ISO 20816-5 */}
          {selectedCalcId === 'iso20816' && (
            <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  ISO 20816-5 & ISO 7919-5 · DIAGNOSTIC VIBRATOIRE PALIERS & ARBRES
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Calculateur de Sévérité Vibratoire & Diagnostic de Zone A/B/C/D'
                    : 'Vibration Severity & Diagnostic Zone Classifier (A/B/C/D)'}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  {locale === 'fr'
                    ? 'Évalue la vitesse RMS sur les corps de paliers et le déplacement dynamique relatif de l\'arbre par rapport au jeu du coussinet.'
                    : 'Evaluates broad-band RMS velocity on bearing brackets and relative dynamic shaft peak-to-peak orbit displacement.'}
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-emerald-400 font-bold">Vitesse vibratoire RMS (V_rms)</span>
                    <span className="text-white font-bold">{calc2Vrms} mm/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="6.0"
                    step="0.05"
                    value={calc2Vrms}
                    onChange={(e) => setCalc2Vrms(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    Limite Zone B: 2.5 mm/s · Alarme Zone C: 4.0 mm/s
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-sky-400 font-bold">Déplacement crête d\'arbre (Sp-p)</span>
                    <span className="text-white font-bold">{calc2ShaftSpp} µm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={calc2ShaftSpp}
                    onChange={(e) => setCalc2ShaftSpp(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Sondes inductives à 90° (X-Y)</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">Jeu radial palier (Clearance)</span>
                    <span className="text-white font-bold">{calc2BearingClearance} µm</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="10"
                    value={calc2BearingClearance}
                    onChange={(e) => setCalc2BearingClearance(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Épaisseur nominale film d\'huile</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-purple-400 font-bold">Vitesse de rotation</span>
                    <span className="text-white font-bold">{calc2Rpm} tr/min</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="750"
                    step="5"
                    value={calc2Rpm}
                    onChange={(e) => setCalc2Rpm(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Nachtigal 125 · Songloulou 214</div>
                </div>
              </div>

              {/* Classification Result Card */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                <div>
                  <div className="text-xs text-neutral-500 uppercase">Zone de Sévérité ISO 20816-5</div>
                  <div className="text-3xl font-black text-white mt-1 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-lg ${
                        calc2Results.zone === 'A'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : calc2Results.zone === 'B'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : calc2Results.zone === 'C'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      ZONE {calc2Results.zone}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 mt-2 font-sans">
                    {locale === 'fr' ? calc2Results.zoneTitleFr : calc2Results.zoneTitleEn}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 uppercase">Ratio Déplacement Arbre / Jeu Palier</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {calc2Results.shaftRatioPct.toFixed(1)} %
                  </div>
                  <div className="w-full bg-[#18212D] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${
                        calc2Results.shaftStatus === 'safe'
                          ? 'bg-emerald-400'
                          : calc2Results.shaftStatus === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(calc2Results.shaftRatioPct, 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {calc2Results.shaftStatus === 'safe'
                      ? 'Film hydrodynamique sain (< 55%)'
                      : calc2Results.shaftStatus === 'warning'
                      ? 'Alerte : Risque de laminage d\'huile'
                      : 'Danger critique : Risque frottement régule'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 uppercase">Prescription d\'Exploitation</div>
                  <div className="p-3 rounded-lg bg-[#0D1420] border border-[#252E38] text-xs text-neutral-300 font-sans mt-1 leading-relaxed">
                    {locale === 'fr' ? calc2Results.adviceFr : calc2Results.adviceEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 3: IEEE C37.102 */}
          {selectedCalcId === 'ieee_c37_102' && (
            <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  IEEE C37.102 §4.5 · PROTECTION PERTE D'EXCITATION (ANSI 40)
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Calculateur de Calage Relais Mho Offset pour Alternateur Hydro'
                    : 'Loss of Field (ANSI 40) Offset Mho Impedance Settings Calculator'}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  {locale === 'fr'
                    ? 'Calcule les impédances de calage des cercles de mho Zone 1 et Zone 2 dans le plan R-X pour protéger l\'alternateur contre la perte d\'excitation.'
                    : 'Calculates primary and secondary impedance settings for Zone 1 and Zone 2 offset mho circles in the complex R-X plane.'}
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">Réactance synchrone (Xd)</span>
                    <span className="text-white font-bold">{calc3Xd} p.u.</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.6"
                    step="0.02"
                    value={calc3Xd}
                    onChange={(e) => setCalc3Xd(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Alternateur à pôles saillants</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-sky-400 font-bold">Réactance transitoire (X'd)</span>
                    <span className="text-white font-bold">{calc3XdPrime} p.u.</span>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="0.45"
                    step="0.01"
                    value={calc3XdPrime}
                    onChange={(e) => setCalc3XdPrime(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Utilisé pour le décalage négatif</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-emerald-400 font-bold">Puissance assignée</span>
                    <span className="text-white font-bold">{calc3MVA} MVA</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="1"
                    value={calc3MVA}
                    onChange={(e) => setCalc3MVA(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Base de calcul d'impédance</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">Tension assignée (Un)</span>
                    <span className="text-white font-bold">{calc3KV} kV</span>
                  </div>
                  <input
                    type="range"
                    min="6.6"
                    max="18.0"
                    step="0.2"
                    value={calc3KV}
                    onChange={(e) => setCalc3KV(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Tension bornes stator</div>
                </div>
              </div>

              {/* R-X Plane Calculated Settings */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div>
                  <div className="text-neutral-500 uppercase">Impédance de Base Z_base</div>
                  <div className="text-xl font-black text-white mt-1">
                    {calc3Results.zBase.toFixed(3)} Ω
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Z_base = U² / S</div>
                </div>

                <div>
                  <div className="text-amber-400 font-bold uppercase">Zone 1 Mho (Déclenchement Rapide)</div>
                  <div className="space-y-1 text-neutral-300 mt-1">
                    <div>Offset : <span className="font-bold text-white">{calc3Results.zone1Offset.toFixed(3)} p.u.</span> ({calc3Results.zone1OffsetOhms.toFixed(2)} Ω)</div>
                    <div>Diamètre : <span className="font-bold text-white">{calc3Results.zone1Dia.toFixed(3)} p.u.</span> ({calc3Results.zone1DiaOhms.toFixed(2)} Ω)</div>
                    <div className="text-emerald-400 font-bold">Temporisation : t1 = 0.10 s</div>
                  </div>
                </div>

                <div>
                  <div className="text-sky-400 font-bold uppercase">Zone 2 Mho (Couverture Totale)</div>
                  <div className="space-y-1 text-neutral-300 mt-1">
                    <div>Offset : <span className="font-bold text-white">{calc3Results.zone2Offset.toFixed(3)} p.u.</span> ({calc3Results.zone2OffsetOhms.toFixed(2)} Ω)</div>
                    <div>Diamètre : <span className="font-bold text-white">{calc3Results.zone2Dia.toFixed(3)} p.u.</span> ({calc3Results.zone2DiaOhms.toFixed(2)} Ω)</div>
                    <div className="text-amber-400 font-bold">Temporisation : t2 = 0.60 s</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 4: IEC 60193 */}
          {selectedCalcId === 'iec60193' && (
            <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                  CEI 60193 §7 · FORMULE D'EFFET D'ÉCHELLE STEP-UP
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Prédiction du Rendement Prototype à Partir du Modèle Réduit'
                    : 'Scale Model to Prototype Efficiency Step-Up Conversion'}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  {locale === 'fr'
                    ? 'Applique la formulation normalisée CEI 60193 pour convertir les essais sur maquette de laboratoire en garanties contractuelles pour la turbine réelle.'
                    : 'Applies standard IEC 60193 scale-effect formula accounting for boundary layer Reynolds friction variations.'}
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-purple-400 font-bold">Diamètre modèle (Dm)</span>
                    <span className="text-white font-bold">{calc4ModelDiaM} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="0.50"
                    step="0.01"
                    value={calc4ModelDiaM}
                    onChange={(e) => setCalc4ModelDiaM(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">CEI 60193 impose Dm &gt;= 0.25 m</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-sky-400 font-bold">Diamètre prototype (Dp)</span>
                    <span className="text-white font-bold">{calc4ProtoDiaM} m</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.1"
                    value={calc4ProtoDiaM}
                    onChange={(e) => setCalc4ProtoDiaM(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Roue réelle Francis sur site</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">Chute banc maquette (Hm)</span>
                    <span className="text-white font-bold">{calc4ModelHeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={calc4ModelHeadM}
                    onChange={(e) => setCalc4ModelHeadM(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Banc d'essai hydraulique accrédité</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">Chute site prototype (Hp)</span>
                    <span className="text-white font-bold">{calc4ProtoHeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="1"
                    value={calc4ProtoHeadM}
                    onChange={(e) => setCalc4ProtoHeadM(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Chute nette nominale de l'ouvrage</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-emerald-400 font-bold">Rendement mesuré modèle (η_m)</span>
                    <span className="text-white font-bold">{calc4ModelEff} %</span>
                  </div>
                  <input
                    type="range"
                    min="85"
                    max="94"
                    step="0.1"
                    value={calc4ModelEff}
                    onChange={(e) => setCalc4ModelEff(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Sur la plateforme d'essais usine</div>
                </div>
              </div>

              {/* Step-Up Calculations Output */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div>
                  <div className="text-neutral-500 uppercase">Ratio des Reynolds (Re_p / Re_m)</div>
                  <div className="text-xl font-black text-white mt-1">
                    {calc4Results.reynoldsRatio.toFixed(1)}x
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Effet d'échelle hydrodynamique</div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Gain Step-Up Normalisé (Δη)</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    +{calc4Results.stepUpEfficiencyPct.toFixed(2)} %
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Selon formule CEI V* = 0.70
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Rendement Prédit Prototype</div>
                  <div className="text-3xl font-black text-sky-400 mt-1">
                    {calc4Results.predictedProtoEff.toFixed(2)} %
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Base de calcul des garanties de puissance
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 5: IEEE 421.5 PSS2B DYNAMIC MODAL DAMPING (AUDIT AUD-07 PROOF) */}
          {selectedCalcId === 'ieee421_pss' && (
            <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
                    IEEE 421.5 §8 · STABILISATEUR DE PUISSANCE PSS2B · AUDIT AUD-07
                  </span>
                  <h3 className="text-xl font-black text-white font-mono mt-1">
                    {locale === 'fr'
                      ? 'Simulateur d\'Amortissement Modal & Réponse Oscillatoire Inter-Zones'
                      : 'Inter-Area Modal Damping & Power Swing Dynamic Simulator'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-1">
                    {locale === 'fr'
                      ? 'Démontre la conformité aux exigences ARSEL / SONATREL (taux d\'amortissement ζ >= 15%) sur l\'axe d\'interconnexion Yaoundé-Douala.'
                      : 'Validates compliance with ARSEL / SONATREL grid codes (damping ratio ζ >= 15%) on the Yaoundé-Douala intertie corridor.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setPssEnabled(!pssEnabled)}
                    className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                      pssEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-red-500/20 text-red-300 border-red-500/50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${pssEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span>{pssEnabled ? (locale === 'fr' ? 'PSS2B Activé (En Service)' : 'PSS2B Active') : (locale === 'fr' ? 'PSS2B Désactivé (Bypassé)' : 'PSS2B Bypassed')}</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-rose-400 font-bold">Gain PSS (KS1)</span>
                    <span className="text-white font-bold">{pssGainKs1.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="0.5"
                    value={pssGainKs1}
                    onChange={(e) => setPssGainKs1(Number(e.target.value))}
                    className="w-full accent-rose-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Gain boucle de vitesse Δω</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">Avance de Phase T1 (Lead)</span>
                    <span className="text-white font-bold">{pssT1Lead.toFixed(2)} s</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.01"
                    value={pssT1Lead}
                    onChange={(e) => setPssT1Lead(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Constante de compensation d'avance</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-sky-400 font-bold">Retard T2 (Lag)</span>
                    <span className="text-white font-bold">{pssT2Lag.toFixed(2)} s</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.10"
                    step="0.005"
                    value={pssT2Lag}
                    onChange={(e) => setPssT2Lag(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Constante de filtrage HF</div>
                </div>

                <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">Fréquence d'Oscillation</span>
                    <span className="text-white font-bold">{gridOscillationFreqHz.toFixed(2)} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="1.80"
                    step="0.05"
                    value={gridOscillationFreqHz}
                    onChange={(e) => setGridOscillationFreqHz(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">Mode inter-zones Sanaga - Littoral</div>
                </div>
              </div>

              {/* Dynamic Waveform Simulation Visualization */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    <span>{locale === 'fr' ? 'Courbe Oscillatoire de Puissance Active P(t) [0 - 5.0 s]' : 'Active Power Swing Transient Response P(t)'}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400">
                    {locale === 'fr' ? 'Perturbation type : Échelon de charge +15% sur la ligne 225 kV' : 'Disturbance: +15% load step on 225 kV line'}
                  </span>
                </div>

                {/* SVG Visual Waveform */}
                <div className="h-44 w-full bg-[#05070B] border border-[#1C2634] rounded-xl p-2 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#1C2634" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#252E38" strokeWidth="1.5" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#1C2634" strokeDasharray="3 3" />

                    {/* Damping Envelope upper and lower */}
                    <path
                      d={calc5Results.timePoints
                        .map((p, idx) => {
                          const x = (p.t / 5.0) * 500;
                          const y = 60 - p.envelope * 48;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke={pssEnabled ? '#10B981' : '#EF4444'}
                      strokeWidth="1"
                      strokeDasharray="4 3"
                      opacity="0.5"
                    />
                    <path
                      d={calc5Results.timePoints
                        .map((p, idx) => {
                          const x = (p.t / 5.0) * 500;
                          const y = 60 + p.envelope * 48;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke={pssEnabled ? '#10B981' : '#EF4444'}
                      strokeWidth="1"
                      strokeDasharray="4 3"
                      opacity="0.5"
                    />

                    {/* Swing Trajectory */}
                    <path
                      d={calc5Results.timePoints
                        .map((p, idx) => {
                          const x = (p.t / 5.0) * 500;
                          // 1.0 pu maps to y=60, 1.25 maps to y=12, 0.75 maps to y=108
                          const y = 60 - (p.power - 1.0) * 190;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(110, y))}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke={pssEnabled ? '#38BDF8' : '#F43F5E'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Graph Annotations */}
                  <div className="absolute top-2 left-3 font-mono text-[10px] text-neutral-400">
                    P_max = 1.25 p.u.
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 font-mono text-[10px] text-emerald-400 font-bold">
                    P_nom = 1.00 p.u.
                  </div>
                  <div className="absolute bottom-2 right-3 font-mono text-[10px] text-neutral-400">
                    t = 5.0 s
                  </div>
                </div>
              </div>

              {/* Damping KPIs & Audit Verdict */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
                <div>
                  <div className="text-neutral-500 uppercase">Avance de Phase Φ_lead</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    +{calc5Results.phaseLeadDeg.toFixed(1)}°
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Compense le retard inductif de l'excitation
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Taux d'Amortissement Modal ζ</div>
                  <div className={`text-3xl font-black mt-1 ${calc5Results.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                    {calc5Results.totalDampingPct.toFixed(1)} %
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Seuil réglementaire : ζ ≥ 15.0 %
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Temps d'Atténuation (2%)</div>
                  <div className="text-2xl font-black text-sky-400 mt-1">
                    {calc5Results.settlingTimeSec.toFixed(2)} s
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Amortissement sous les 5% d'écart
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 uppercase">Verdict Audit AUD-07</div>
                  <div className={`text-sm font-bold mt-1 px-2.5 py-1 rounded inline-flex items-center gap-1.5 ${
                    calc5Results.isCompliant
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {calc5Results.isCompliant ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>CONFORME (HOMOLOGUÉ)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>NON-CONFORME (ÉCART)</span>
                      </>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {calc5Results.isCompliant
                      ? 'Oscillations éliminées en < 3.5s'
                      : 'Amortissement insuffisant'}
                  </div>
                </div>
              </div>

              {/* Automatic Propagation Notice to Main SLD Substation & Engineering Dossier */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    {locale === 'fr'
                      ? 'Synchronisation SLD & Dossier active : Ces paramètres PSS2B et seuils 87G/40 sont automatiquement répercutés sur le nœud Alternateur G1 et le Dossier d’Ingénierie CEI.'
                      : 'Active SLD & Dossier Sync: These PSS2B settings and 87G/40 thresholds automatically propagate to Generator G1 and the IEC Engineering Dossier.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    auditSettingsStore.resetToAuditedDefaults();
                    const defs = auditSettingsStore.getSettings();
                    setPssGainKs1(defs.pss2bKs1);
                    setPssT1Lead(defs.pss2bT1);
                    setPssT2Lag(defs.pss2bT2);
                    setGridOscillationFreqHz(defs.pss2bFreqHz);
                    setPssEnabled(true);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-[11px] font-mono transition ml-2 flex-shrink-0"
                >
                  {locale === 'fr' ? 'Rétablir Calage Homologué' : 'Reset to Certified Audit'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TAB: REGULATORY AUDIT MATRIX */}
      {/* ==================================================================== */}
      {mainTab === 'audit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            {/* Header & Facility Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#252E38]">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'MATRICE D\'AUDIT DE CONFORMITÉ RÉGLEMENTAIRE' : 'REGULATORY COMPLIANCE AUDIT MATRIX'}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Grille d\'Évaluation & Surveillance Normative de la Centrale'
                    : 'Plant Normative Surveillance & Compliance Checklist'}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-neutral-400">{locale === 'fr' ? 'Centrale auditée :' : 'Facility:'}</span>
                <select
                  value={auditFacility}
                  onChange={(e) => setAuditFacility(e.target.value)}
                  className="bg-[#080B10] border border-[#252E38] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Nachtigal Amont (420 MW)">Nachtigal Amont (420 MW - 2024)</option>
                  <option value="Songloulou (384 MW)">Songloulou (384 MW - Eneo)</option>
                  <option value="Edéa (276 MW)">Edéa (276 MW - Eneo)</option>
                  <option value="Lom Pangar (30 MW)">Lom Pangar (30 MW - EDC)</option>
                  <option value="Centrale Générique Hydro">Centrale Générique / Référence Type</option>
                </select>
                <button
                  type="button"
                  onClick={() => setAuditChecklist(INITIAL_AUDIT_CHECKLIST)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                  title="Réinitialiser l'audit"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportAuditCertificate}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Télécharger le certificat officiel d'audit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Exporter Certificat (.txt)' : 'Export Certificate'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Imprimer la grille d'audit"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Imprimer' : 'Print'}</span>
                </button>
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-6 p-4 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div>
                <div className="text-neutral-500 uppercase">Score Global de Conformité</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {auditScore.percentage.toFixed(1)} %
                </div>
              </div>
              <div>
                <div className="text-neutral-500 uppercase">Critères Conformes</div>
                <div className="text-2xl font-black text-sky-400 mt-0.5">
                  {auditScore.compliantCount} / {auditChecklist.length}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 uppercase">Écarts Mineurs</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  {auditScore.minorGapCount}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 uppercase">Non-Conformités Critiques</div>
                <div className="text-2xl font-black text-red-400 mt-0.5">
                  {auditScore.criticalCount}
                </div>
              </div>
            </div>

            {/* Audit Items Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#252E38] rounded-xl overflow-hidden">
                <thead className="bg-[#080B10] text-neutral-400 text-[10px] uppercase border-b border-[#252E38]">
                  <tr>
                    <th className="p-3">Réf & Domaine</th>
                    <th className="p-3">Exigence Normative Prescrite</th>
                    <th className="p-3">Statut Actuel de Conformité</th>
                    <th className="p-3">Observations d'Audit & Preuves</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2634] bg-[#0A0E17]">
                  {auditChecklist.map((item) => (
                    <tr key={item.id} className="hover:bg-[#0F1622] transition-colors">
                      <td className="p-3 align-top min-w-[200px]">
                        <div className="font-bold text-amber-400">{item.reference}</div>
                        <div className="text-white font-bold mt-0.5">
                          {locale === 'fr' ? item.domainFr : item.domainEn}
                        </div>
                      </td>
                      <td className="p-3 align-top max-w-sm font-sans text-neutral-300">
                        <div className="font-bold text-white mb-1 font-mono text-[11px]">
                          {locale === 'fr' ? item.titleFr : item.titleEn}
                        </div>
                        {locale === 'fr' ? item.requirementFr : item.requirementEn}
                      </td>
                      <td className="p-3 align-top min-w-[170px]">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateAuditStatus(item.id, e.target.value as any)
                          }
                          className={`w-full p-1.5 rounded-lg border font-mono text-xs font-bold ${
                            item.status === 'compliant'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              : item.status === 'minor_gap'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                              : item.status === 'critical_nc'
                              ? 'bg-red-950/60 text-red-300 border-red-800'
                              : 'bg-sky-950/60 text-sky-300 border-sky-800'
                          }`}
                        >
                          <option value="compliant">Conforme (100%)</option>
                          <option value="minor_gap">Écart Mineur (70%)</option>
                          <option value="in_progress">En Cours (50%)</option>
                          <option value="critical_nc">Non-Conforme (0%)</option>
                        </select>
                      </td>
                      <td className="p-3 align-top font-sans text-neutral-400 text-xs">
                        {locale === 'fr' ? item.commentsFr : item.commentsEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB: FAT & SAT TESTING PROTOCOLS */}
      {/* ==================================================================== */}
      {mainTab === 'protocols' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Protocol Step List */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'Chronologie des 8 Essais' : '8 Testing Protocols'}
                </span>
                <span className="font-mono text-[10px] text-neutral-500">FAT & SAT</span>
              </div>

              <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1 scrollbar-thin">
                {TESTING_PROTOCOLS.map((prot) => {
                  const isSelected = selectedProtocolId === prot.id;
                  return (
                    <button
                      key={prot.id}
                      type="button"
                      onClick={() => setSelectedProtocolId(prot.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all font-mono ${
                        isSelected
                          ? 'border-purple-400 bg-purple-950/30 text-purple-200 ring-1 ring-purple-400 shadow-md'
                          : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:text-white hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-400 uppercase px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                          Étape {prot.stepNumber} · {prot.stage}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {protocolSignoffs[prot.id]?.signed && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" />
                              <span>PV Signé</span>
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-neutral-400">
                            {prot.governingStandard}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white mt-2 leading-snug">
                        {locale === 'fr' ? prot.name.fr : prot.name.en}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1 truncate">
                        {prot.targetEquipment}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Cols: Detailed Protocol Card */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
                {/* Protocol Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252E38]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400 px-2.5 py-0.5 rounded bg-purple-950 border border-purple-800 uppercase">
                        {selectedProtocol.stage} · Étape {selectedProtocol.stepNumber} sur 8
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        {selectedProtocol.normativeReference}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white font-mono mt-2">
                      {locale === 'fr' ? selectedProtocol.name.fr : selectedProtocol.name.en}
                    </h3>
                    <div className="font-mono text-xs text-sky-400 mt-1">
                      {locale === 'fr' ? 'Équipement cible :' : 'Target equipment:'} {selectedProtocol.targetEquipment}
                    </div>
                  </div>

                  {/* Sign-off button & status */}
                  <div className="flex items-center gap-3">
                    {protocolSignoffs[selectedProtocol.id]?.signed ? (
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-right">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 justify-end">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{locale === 'fr' ? 'ESSAI HOMOLOGUÉ & SIGNÉ' : 'TEST SIGNED & APPROVED'}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {protocolSignoffs[selectedProtocol.id]?.signedBy} · {protocolSignoffs[selectedProtocol.id]?.signDate}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const engineer = prompt(
                            locale === 'fr'
                              ? 'Nom & fonction de l\'ingénieur d\'essais habilité :'
                              : 'Lead Commissioning Engineer Name & Title:',
                            'Ing. Essais SAT / SONATREL'
                          );
                          if (engineer) {
                            setProtocolSignoffs((prev) => ({
                              ...prev,
                              [selectedProtocol.id]: {
                                signed: true,
                                signedBy: engineer,
                                signDate: new Date().toISOString().split('T')[0],
                              },
                            }));
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
                      >
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>{locale === 'fr' ? 'Signer le Procès-Verbal (PV)' : 'Sign Protocol Sign-off'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Objective */}
                <div className="mt-4">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    {locale === 'fr' ? 'Objectif Métrologique & Normatif' : 'Metrological & Normative Objective'}
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                    {locale === 'fr' ? selectedProtocol.objective.fr : selectedProtocol.objective.en}
                  </p>
                </div>

                {/* Prerequisites */}
                <div className="mt-4">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'fr' ? 'Conditions Préalables d\'Exécution' : 'Execution Prerequisites'}</span>
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs text-neutral-300">
                    {selectedProtocol.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#080B10] border border-[#252E38]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step-by-Step Test Sequence */}
                <div className="mt-5">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span>{locale === 'fr' ? 'Séquence Opératoire Chronologique' : 'Step-by-Step Test Sequence'}</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedProtocol.testSequence.map((step) => (
                      <div
                        key={step.step}
                        className="p-3 rounded-xl bg-[#090D14] border border-[#252E38] font-mono text-xs flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-800 text-[10px] flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <span className="font-sans text-neutral-200">
                          {locale === 'fr' ? step.fr : step.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceptance Criteria & Safety */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60">
                    <div className="font-mono text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'CRITÈRES D\'ACCEPTATION :' : 'ACCEPTANCE CRITERIA:'}</span>
                    </div>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                      {locale === 'fr' ? selectedProtocol.acceptanceCriteria.fr : selectedProtocol.acceptanceCriteria.en}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/60">
                    <div className="font-mono text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'CONSIGNES DE SÉCURITÉ :' : 'SAFETY CONSTRAINTS:'}</span>
                    </div>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                      {locale === 'fr' ? selectedProtocol.safetyPrecautions.fr : selectedProtocol.safetyPrecautions.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
