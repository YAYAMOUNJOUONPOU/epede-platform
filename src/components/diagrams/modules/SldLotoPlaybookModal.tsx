// src/components/diagrams/modules/SldLotoPlaybookModal.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  X,
  FileCheck2,
  FileWarning,
  ArrowRight,
  ClipboardList,
  RotateCcw,
  Flame,
  Check
} from 'lucide-react';
import { SldTopologyType } from './SldHeaderToolbar';

export interface LotoStep {
  stepNumber: number;
  action: string;
  deviceTag: string;
  expectedState: 'OPEN' | 'CLOSED' | 'GROUNDED' | 'LOCKED';
  ruleStandard: string;
  riskDescription: string;
  verificationMethod: string;
}

export interface LotoProcedure {
  id: string;
  titleFr: string;
  titleEn: string;
  applicableTopology: SldTopologyType;
  targetEquipment: string;
  objectiveFr: string;
  objectiveEn: string;
  steps: LotoStep[];
}

export const LOTO_PROCEDURES: LotoProcedure[] = [
  {
    id: 'loto-trafo-consignation',
    titleFr: 'Consignation & Condamnation Transformateur 225/30 kV (T1)',
    titleEn: 'LOTO Lockout/Tagout of 225/30 kV Power Transformer (T1)',
    applicableTopology: 'double_bus',
    targetEquipment: 'T1 (40 MVA / 63 MVA)',
    objectiveFr: 'Mise hors tension totale, condamnation mécanique (LOTO) et mise à la terre/court-circuit (MALT/CC) selon norme NF C 18-510 / CEI 62271-102 pour intervention interne sur enroulements ou cuve.',
    objectiveEn: 'Complete de-energization, mechanical lock-out tag-out (LOTO) and earthing/short-circuiting per IEC 62271-102 / NF C 18-510 for internal winding maintenance.',
    steps: [
      {
        stepNumber: 1,
        action: 'Ouvrir le disjoncteur BT/HTA secondaire',
        deviceTag: '52-3 (Q0_BT)',
        expectedState: 'OPEN',
        ruleStandard: 'NF C 18-510 §7.1.1 / CEI 62271-100',
        riskDescription: 'Éliminer toute charge active et éviter tout risque de retour de tension par le réseau 30 kV.',
        verificationMethod: 'Vérification de courant nul I = 0 A sur TC secondaire et index mécanique de position du disjoncteur.'
      },
      {
        stepNumber: 2,
        action: 'Ouvrir le disjoncteur principal THT primaire',
        deviceTag: '52-2 (Q0_T)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-100 / NF C 18-510 §7.1.2',
        riskDescription: 'Coupure du courant à vide magnétisant et séparation du jeu de barres 225 kV.',
        verificationMethod: 'Index de tringlerie SF6 sur [OUVERT], extinction des voyants SCADA, pression SF6 nominale.'
      },
      {
        stepNumber: 3,
        action: 'Ouvrir les sectionneurs d\'aiguillage de barres QST-A et QST-B',
        deviceTag: 'QST-A / QST-B (89A / 89B)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-102 (Verrouillage asservi au disjoncteur Q0_T)',
        riskDescription: 'Interdiction absolue de manœuvrer sous charge. Séparation physique visible à coupure certaine.',
        verificationMethod: 'Contrôle visuel direct des couteaux de sectionnement en position d\'ouverture maximale.'
      },
      {
        stepNumber: 4,
        action: 'Vérification d\'Absence de Tension (VAT) sur les 3 phases',
        deviceTag: 'VAT THT 225 kV & HTA 30 kV',
        expectedState: 'LOCKED',
        ruleStandard: 'CEI 61243-1 (Détecteur capacitif homologué)',
        riskDescription: 'Risque mortel d\'amorçage si la ligne ou les barres sont restées chargées en tension résiduelle.',
        verificationMethod: 'Test préalable du détecteur sur source connue, test in-situ sur les 3 phases, re-test du détecteur.'
      },
      {
        stepNumber: 5,
        action: 'Fermer les sectionneurs de mise à la terre et en court-circuit (MALT/CC)',
        deviceTag: 'Q8-T (MALT Cuve & Bornes)',
        expectedState: 'GROUNDED',
        ruleStandard: 'CEI 62271-102 / NF C 18-510 §7.1.4',
        riskDescription: 'Évacuation des tensions induites par lignes parallèles et décharge des capacités résiduelles.',
        verificationMethod: 'Fermeture franche manuelle ou motorisée, contrôle de continuité de tresse de terre en cuivre.'
      },
      {
        stepNumber: 6,
        action: 'Pose des cadenas de condamnation & pancartes LOTO',
        deviceTag: 'Cadenas Rouge de Sécurité + Tag',
        expectedState: 'LOCKED',
        ruleStandard: 'OSHA 1910.147 / NF C 18-510',
        riskDescription: 'Empêcher toute manœuvre intempestive ou réenclenchement à distance par téléconduite dispatching.',
        verificationMethod: 'Clé unique conservée par le Chargé de Consignation, étiquette nominative datée et signée.'
      }
    ]
  },
  {
    id: 'loto-line-consignation',
    titleFr: 'Consignation Ligne de Transport 225 kV (Départ Bekoko)',
    titleEn: '225 kV Transmission Line Lockout Procedure (Feeder Bekoko)',
    applicableTopology: 'breaker_and_half',
    targetEquipment: 'Ligne 1 Ouest (225 kV)',
    objectiveFr: 'Procédure d\'isolement en schéma 1 disjoncteur et demi (1-1/2 CB) avec continuité de transit maintenue.',
    objectiveEn: 'Isolation procedure in breaker-and-a-half topology while preserving grid flow continuity.',
    steps: [
      {
        stepNumber: 1,
        action: 'Déclencher le disjoncteur encadrant Barre 1',
        deviceTag: '52-1A (Q0_BH_1)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-100',
        riskDescription: 'Ouverture du pôle côté Barre 1 sous contrôle de synchronisme.',
        verificationMethod: 'Index SF6 vert [OUVERT], voyant téléconduite éteint.'
      },
      {
        stepNumber: 2,
        action: 'Déclencher le disjoncteur central de liaison',
        deviceTag: '52-M (Q0_BH_M)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-100',
        riskDescription: 'Isolation complète du point de dérivation ligne tout en laissant la Ligne 2 active sur Barre 2.',
        verificationMethod: 'Contrôle télémesure courant nul.'
      },
      {
        stepNumber: 3,
        action: 'Ouvrir les sectionneurs d\'isolement encadrants QS-1B et QS-M1',
        deviceTag: 'QS-1B & QS-M1',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-102',
        riskDescription: 'Création de l\'intervalle d\'isolement physique diélectrique.',
        verificationMethod: 'Contrôle visuel direct de position ouverte des mâchoires.'
      },
      {
        stepNumber: 4,
        action: 'Ouvrir le sectionneur tête de ligne QS-L1',
        deviceTag: 'QS-L1 (Sectionneur Ligne)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-102',
        riskDescription: 'Séparation galvanique définitive de la travée et du câble aérien.',
        verificationMethod: 'Position d\'ouverture verrouillée mécaniquement.'
      },
      {
        stepNumber: 5,
        action: 'Vérification d\'Absence de Tension (VAT)',
        deviceTag: 'VAT Perche Télescopique 225 kV',
        expectedState: 'LOCKED',
        ruleStandard: 'CEI 61243-1',
        riskDescription: 'Vérifier l\'absence de tension induite par la ligne double terne parallèle.',
        verificationMethod: 'Signal sonore et visuel continu certifiant l\'absence de potentiel.'
      },
      {
        stepNumber: 6,
        action: 'Fermer le sectionneur de mise à la terre ligne Q8-L1',
        deviceTag: 'Q8-L1 (MALT Ligne 225 kV)',
        expectedState: 'GROUNDED',
        ruleStandard: 'CEI 62271-102 / Interverrouillage à serrure Castell',
        riskDescription: 'Écoulement des courants induits magnétiques et électrostatiques.',
        verificationMethod: 'Couteaux de terre verrouillés en contact franc sur le circuit général de terre.'
      }
    ]
  },
  {
    id: 'loto-busbar-transfer',
    titleFr: 'Changement de Jeu de Barres sous Charge (Permutation BB1 → BB2)',
    titleEn: 'On-Load Busbar Transfer Procedure (BB1 → BB2 Coupling)',
    applicableTopology: 'double_bus',
    targetEquipment: 'Jeux de Barres 225 kV (BB1 & BB2)',
    objectiveFr: 'Transfert sans coupure de fourniture d\'un départ 225 kV de la Barre 1 vers la Barre 2 via le disjoncteur de couplage.',
    objectiveEn: 'Uninterrupted on-load transfer of a 225 kV bay from Bus 1 to Bus 2 via bus coupler breaker.',
    steps: [
      {
        stepNumber: 1,
        action: 'Fermer les sectionneurs du disjoncteur de couplage QS-BC1 et QS-BC2',
        deviceTag: 'QS-BC1 & QS-BC2',
        expectedState: 'CLOSED',
        ruleStandard: 'CEI 62271-102 (Disjoncteur couplage 52-BC préalablement OUVERT)',
        riskDescription: 'Préparation du circuit de mise en parallèle sans passage de courant.',
        verificationMethod: 'Position fermée vérifiée sur les deux barres.'
      },
      {
        stepNumber: 2,
        action: 'Fermer le disjoncteur de couplage 52-BC',
        deviceTag: '52-BC (Q0_BC)',
        expectedState: 'CLOSED',
        ruleStandard: 'CEI 62271-100 / Synchrocheck ANSI 25',
        riskDescription: 'Égalisation rigoureuse des potentiels et des angles de phase entre Barre 1 et Barre 2.',
        verificationMethod: 'ΔU < 2%, Δf < 0.1 Hz, Δθ < 5° confirmé par relais de synchronisme.'
      },
      {
        stepNumber: 3,
        action: 'Fermer le sectionneur d\'arrivée sur Barre 2 du départ concerné',
        deviceTag: 'QS1-B (89B)',
        expectedState: 'CLOSED',
        ruleStandard: 'CEI 62271-102 (Manœuvre permise car boucle fermée par 52-BC)',
        riskDescription: 'Mise en parallèle des sectionneurs de barres sans coupure d\'arc destructeur.',
        verificationMethod: 'Couteaux QS1-B fermés à 100%.'
      },
      {
        stepNumber: 4,
        action: 'Ouvrir le sectionneur d\'origine sur Barre 1',
        deviceTag: 'QS1-A (89A)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-102 (Courant dérivé vers la Barre 2 via couplage)',
        riskDescription: 'Séparation du jeu de barres d\'origine sans coupure de transit de charge.',
        verificationMethod: 'Position ouverte constatée sur QS1-A.'
      },
      {
        stepNumber: 5,
        action: 'Ouvrir le disjoncteur de couplage si le découplage est requis',
        deviceTag: '52-BC (Q0_BC)',
        expectedState: 'OPEN',
        ruleStandard: 'CEI 62271-100',
        riskDescription: 'Restauration de la ségrégation des zones différentielles de barres 87B.',
        verificationMethod: 'Voyant vert [OUVERT], puissance transitant exclusivement sur Barre 2.'
      }
    ]
  }
];

interface SldLotoPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  currentTopology: SldTopologyType;
  onApplyProcedureStep?: (deviceTag: string, targetState: 'OPEN' | 'CLOSED') => void;
}

export const SldLotoPlaybookModal: React.FC<SldLotoPlaybookModalProps> = ({
  isOpen,
  onClose,
  locale,
  currentTopology,
  onApplyProcedureStep,
}) => {
  const [selectedProcId, setSelectedProcId] = useState<string>(LOTO_PROCEDURES[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentProc = LOTO_PROCEDURES.find((p) => p.id === selectedProcId) || LOTO_PROCEDURES[0];

  const toggleStepCompleted = (stepNumber: number) => {
    const key = `${currentProc.id}-step-${stepNumber}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetChecklist = () => {
    setCompletedSteps({});
  };

  const allCompleted = currentProc.steps.every(
    (s) => completedSteps[`${currentProc.id}-step-${s.stepNumber}`]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0E17] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F1420]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {locale === 'fr'
                    ? 'Playbook de Manœuvres & Sécurité LOTO (NF C 18-510 / CEI 62271)'
                    : 'Switching Playbook & Safety LOTO Interlocks (IEC 62271 / OSHA 1910.147)'}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  SÉCURITÉ INDUSTRIELLE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {locale === 'fr'
                  ? 'Protocoles normalisés d\'isolement, condamnation mécanique, VAT et mise à la terre'
                  : 'Standardized de-energization, mechanical locking, voltage testing and earthing protocols'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Procedures Tabs */}
        <div className="flex gap-2 p-3 border-b border-slate-800/80 bg-[#0B0F19] overflow-x-auto">
          {LOTO_PROCEDURES.map((proc) => {
            const isMatch = proc.id === selectedProcId;
            return (
              <button
                key={proc.id}
                type="button"
                onClick={() => setSelectedProcId(proc.id)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isMatch
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? proc.titleFr.split('(')[0] : proc.titleEn.split('(')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Procedure Objective Banner */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs">
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>{locale === 'fr' ? currentProc.titleFr : currentProc.titleEn}</span>
            </div>
            <p className="text-slate-300 text-[11px] mt-1 font-sans">
              {locale === 'fr' ? currentProc.objectiveFr : currentProc.objectiveEn}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetChecklist}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 font-mono text-xs">
          {currentProc.steps.map((step) => {
            const isDone = Boolean(completedSteps[`${currentProc.id}-step-${step.stepNumber}`]);
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStepCompleted(step.stepNumber)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                    : 'bg-[#111722] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                    isDone 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isDone ? <Check className="h-3.5 w-3.5" /> : step.stepNumber}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-xs">{step.action}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        {step.deviceTag}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        step.expectedState === 'GROUNDED' ? 'bg-amber-900/60 text-amber-300 border border-amber-600' :
                        step.expectedState === 'OPEN' ? 'bg-rose-900/60 text-rose-300 border border-rose-600' :
                        step.expectedState === 'LOCKED' ? 'bg-purple-900/60 text-purple-300 border border-purple-600' :
                        'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
                      }`}>
                        {step.expectedState}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      <strong className="text-slate-300">Justification sécurité :</strong> {step.riskDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span className="text-cyan-300">Norme : {step.ruleStandard}</span>
                      <span>•</span>
                      <span className="text-slate-400">Contrôle : {step.verificationMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0 flex items-center gap-2">
                  {onApplyProcedureStep && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApplyProcedureStep(step.deviceTag, step.expectedState as any);
                        if (!isDone) toggleStepCompleted(step.stepNumber);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      {locale === 'fr' ? 'Manœuvrer SLD' : 'Operate SLD'}
                    </button>
                  )}
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}>
                    {isDone ? (locale === 'fr' ? 'Validé' : 'Executed') : (locale === 'fr' ? 'À valider' : 'Pending')}
                  </span>
                </div>
              </div>
            );
          })}

          {allCompleted && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-emerald-200">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-xs">
                  {locale === 'fr' ? 'PROCÉDURE LOTO 100% ACCOMPLIE AVEC SUCCÈS' : 'LOTO PROTOCOL 100% COMPLETED SAFELY'}
                </p>
                <p className="text-[11px] text-emerald-300/80 font-sans mt-0.5">
                  {locale === 'fr'
                    ? 'L\'ouvrage est consigné, verrouillé et raccordé à la terre. L\'attestation de consignation pour travaux peut être délivrée au Chef de Chantier.'
                    : 'Equipment is locked out, tagged out, de-energized and grounded. The electrical permit to work can now be issued.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
