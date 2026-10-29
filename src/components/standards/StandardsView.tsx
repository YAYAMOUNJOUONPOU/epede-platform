// src/components/standards/StandardsView.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { STANDARDS } from '../../data/epedeData';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MinusCircle, 
  Calculator, 
  Activity, 
  Zap, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  Layers, 
  Cpu,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { DomainCode, StandardClause } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface StandardsViewProps {
  initialRef?: string | null;
  locale: 'fr' | 'en';
  onBack: () => void;
  onNavigateDomain: (code: DomainCode) => void;
  onNavigateRole: (slug: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
}

type ClauseAuditStatus = 'pass' | 'fail' | 'pending' | 'na';

export const StandardsView: React.FC<StandardsViewProps> = ({
  initialRef,
  locale,
  onBack,
  onNavigateDomain,
  onNavigateRole,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [selectedRef, setSelectedRef] = useState<string>(
    initialRef || STANDARDS[0].reference
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [clauseCategoryFilter, setClauseCategoryFilter] = useState<string>('ALL');
  
  // Audit Checklist State per standard & clause
  const [auditStatuses, setAuditStatuses] = useState<Record<string, Record<string, ClauseAuditStatus>>>(() => {
    try {
      const saved = localStorage.getItem('epede_standards_audit_state');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [copiedReport, setCopiedReport] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('epede_standards_audit_state', JSON.stringify(auditStatuses));
    } catch {
      // ignore
    }
  }, [auditStatuses]);

  useEffect(() => {
    if (initialRef) {
      const exact = STANDARDS.find((s) => s.reference.toLowerCase() === initialRef.toLowerCase());
      if (exact) {
        setSelectedRef(exact.reference);
      } else {
        const prefix = STANDARDS.find((s) => s.reference.toLowerCase().includes(initialRef.toLowerCase()) || initialRef.toLowerCase().includes(s.reference.toLowerCase()));
        if (prefix) {
          setSelectedRef(prefix.reference);
        } else {
          setSearchQuery(initialRef);
        }
      }
    }
  }, [initialRef]);

  const issuers = useMemo(() => {
    const list = Array.from(new Set(STANDARDS.map((s) => s.issuer || 'Other')));
    return ['ALL', ...list];
  }, []);

  const filteredStandards = useMemo(() => {
    return STANDARDS.filter((s) => {
      if (selectedIssuer !== 'ALL' && (s.issuer || 'Other') !== selectedIssuer) {
        return false;
      }
      if (selectedDomain !== 'ALL' && (!s.domain_codes || !s.domain_codes.includes(selectedDomain as DomainCode))) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = s.reference.toLowerCase().includes(q);
        const matchesTitle = (locale === 'fr' ? s.title_fr : s.title_en).toLowerCase().includes(q);
        const matchesScope = ((locale === 'fr' ? s.scope_fr : s.scope_en) || '').toLowerCase().includes(q);
        const matchesEquip = s.applicable_equipment.some((eq) => eq.toLowerCase().includes(q));
        const matchesClauses = (s.clauses || []).some(c => 
          c.clause_number.toLowerCase().includes(q) ||
          (locale === 'fr' ? c.title_fr : c.title_en).toLowerCase().includes(q) ||
          c.acceptance_criteria.toLowerCase().includes(q)
        );
        if (!matchesRef && !matchesTitle && !matchesScope && !matchesEquip && !matchesClauses) {
          return false;
        }
      }
      return true;
    });
  }, [selectedIssuer, selectedDomain, searchQuery, locale]);

  const selectedStandard =
    STANDARDS.find((s) => s.reference === selectedRef) ||
    filteredStandards[0] ||
    STANDARDS[0];

  // Get current standard audit records
  const currentStandardAudit = auditStatuses[selectedStandard.id] || {};

  const clauses = useMemo(() => {
    const raw = selectedStandard.clauses || [];
    if (clauseCategoryFilter === 'ALL') return raw;
    return raw.filter(c => c.category === clauseCategoryFilter);
  }, [selectedStandard, clauseCategoryFilter]);

  // Handle status update for a clause
  const handleSetClauseStatus = (clauseNumber: string, status: ClauseAuditStatus) => {
    setAuditStatuses(prev => ({
      ...prev,
      [selectedStandard.id]: {
        ...(prev[selectedStandard.id] || {}),
        [clauseNumber]: status,
      }
    }));
  };

  // Quick actions: mark all pass / reset
  const handleMarkAllClauses = (status: ClauseAuditStatus) => {
    const nextForStandard: Record<string, ClauseAuditStatus> = {};
    (selectedStandard.clauses || []).forEach(c => {
      nextForStandard[c.clause_number] = status;
    });
    setAuditStatuses(prev => ({
      ...prev,
      [selectedStandard.id]: nextForStandard,
    }));
  };

  // Metrics
  const totalClauses = (selectedStandard.clauses || []).length;
  const passedClauses = (selectedStandard.clauses || []).filter(c => currentStandardAudit[c.clause_number] === 'pass').length;
  const failedClauses = (selectedStandard.clauses || []).filter(c => currentStandardAudit[c.clause_number] === 'fail').length;
  const naClauses = (selectedStandard.clauses || []).filter(c => currentStandardAudit[c.clause_number] === 'na').length;
  const pendingClauses = totalClauses - (passedClauses + failedClauses + naClauses);
  
  const applicableTotal = totalClauses - naClauses;
  const compliancePercentage = applicableTotal > 0 ? Math.round((passedClauses / applicableTotal) * 100) : 100;

  // Generate Educational Self-Assessment / Clause Guide Note
  const handleExportAuditReport = () => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const langFr = locale === 'fr';

    const header = [
      '================================================================================',
      langFr ? 'FICHE D\'AUTO-ÉVALUATION TECHNIQUE & AIDE-MÉMOIRE NORMATIF' : 'NORMATIVE SELF-EVALUATION GUIDE & CLAUSE SUMMARY',
      'EPEDE · Plateforme Numérique d\'Ingénierie Électrique & Énergétique',
      '================================================================================',
      `${langFr ? 'NORME DE RÉFÉRENCE' : 'STANDARD REFERENCE'} : ${selectedStandard.reference}`,
      `${langFr ? 'TITRE' : 'TITLE'}               : ${langFr ? selectedStandard.title_fr : selectedStandard.title_en}`,
      `${langFr ? 'ORGANISME ÉMETTEUR' : 'ISSUER'}         : ${selectedStandard.issuer || 'N/A'} (Édition: ${selectedStandard.edition || 'N/A'})`,
      `${langFr ? 'JURIDICTION' : 'JURISDICTION'}          : ${selectedStandard.jurisdiction}`,
      `${langFr ? 'DATE DE GÉNÉRATION' : 'TIMESTAMP'}        : ${dateStr} UTC`,
      `${langFr ? 'APPAREILS ASSOCIÉS' : 'ASSOCIATED EQUIPMENT'} : ${selectedStandard.applicable_equipment.join(', ')}`,
      '--------------------------------------------------------------------------------',
      `${langFr ? 'SCORE D\'AUTO-ÉVALUATION' : 'SELF-EVALUATION SCORE'} : ${compliancePercentage}% (${passedClauses}/${applicableTotal} ${langFr ? 'critères validés' : 'criteria passed'})`,
      `${langFr ? 'DÉCOMPTE' : 'BREAKDOWN'} : ${passedClauses} ${langFr ? 'Validés' : 'Pass'} | ${failedClauses} ${langFr ? 'Non-remplis' : 'Fail'} | ${pendingClauses} ${langFr ? 'En attente' : 'Pending'} | ${naClauses} N/A`,
      '================================================================================',
      '',
      langFr ? 'DÉTAIL DES CLAUSES NORMATIVES CONSULTÉES :' : 'DETAIL OF CONSULTED NORMATIVE CLAUSES:',
      ''
    ];

    const body = (selectedStandard.clauses || []).map((c, idx) => {
      const status = currentStandardAudit[c.clause_number] || 'pending';
      const statusLabel = status === 'pass' ? '[ VALIDÉ / PASS ]' :
                          status === 'fail' ? '[ NON-REMPLI / FAIL ]' :
                          status === 'na' ? '[ NON APPLICABLE / N/A ]' :
                          '[ EN ATTENTE / PENDING ]';
      return [
        `[${idx + 1}] CLAUSE ${c.clause_number} : ${langFr ? c.title_fr : c.title_en}`,
        `    ${langFr ? 'Catégorie' : 'Category'}     : ${c.category.toUpperCase().replace('_', ' ')}`,
        `    ${langFr ? 'Exigence' : 'Requirement'}   : ${langFr ? c.requirement_fr : c.requirement_en}`,
        `    ${langFr ? 'Critère Seuil' : 'Tolerance'} : ${c.acceptance_criteria}`,
        `    >>> STATUT GUIDE : ${statusLabel}`,
        ''
      ].join('\n');
    });

    const footer = [
      '--------------------------------------------------------------------------------',
      langFr 
        ? 'AVERTISSEMENT LÉGAL & NATURE DU DOCUMENT (NON-CERTIFICATION) :\nCe document constitue un support pédagogique d\'apprentissage et d\'auto-évaluation technique préliminaire.\nIl ne remplace en aucun cas un procès-verbal officiel d\'essais en usine (FAT) ou sur site (SAT), ni une certification de conformité réglementaire délivrée par un organisme agréé.'
        : 'LEGAL NOTICE & DOCUMENT STATUS (NON-CERTIFICATION):\nThis document is an educational training support and preliminary technical self-evaluation tool.\nIt does not replace an official FAT/SAT test protocol signed by an accredited inspection body or certifying authority.',
      '================================================================================'
    ];

    const fullText = [...header, ...body, ...footer].join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 3000);
    });
  };

  // Helper labels for clause categories
  const getCategoryBadge = (cat: StandardClause['category']) => {
    switch (cat) {
      case 'routine_test':
        return {
          label: locale === 'fr' ? 'Essai de Série (FAT)' : 'Routine Test (FAT)',
          color: 'text-amber-400 bg-amber-950/50 border-amber-800/80',
          dot: 'bg-amber-400',
        };
      case 'type_test':
        return {
          label: locale === 'fr' ? 'Essai de Type (Qualification)' : 'Type Test (Qualification)',
          color: 'text-purple-400 bg-purple-950/50 border-purple-800/80',
          dot: 'bg-purple-400',
        };
      case 'special_test':
        return {
          label: locale === 'fr' ? 'Essai Spécial / Site (SAT)' : 'Special / Site Test (SAT)',
          color: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/80',
          dot: 'bg-cyan-400',
        };
      case 'design_rule':
        return {
          label: locale === 'fr' ? 'Règle de Conception' : 'Design Rule',
          color: 'text-sky-400 bg-sky-950/50 border-sky-800/80',
          dot: 'bg-sky-400',
        };
      case 'safety_rule':
        return {
          label: locale === 'fr' ? 'Prescription Sécurité' : 'Safety Mandate',
          color: 'text-rose-400 bg-rose-950/50 border-rose-800/80',
          dot: 'bg-rose-400',
        };
      default:
        return {
          label: cat,
          color: 'text-neutral-400 bg-neutral-900 border-neutral-700',
          dot: 'bg-neutral-400',
        };
    }
  };

  // Helper metadata for computational engine mappings
  const getLinkedCalculatorMeta = (calcKey: string) => {
    switch (calcKey) {
      case 'transformer':
        return {
          tab: 'transformer' as CalculatorTabType,
          title: locale === 'fr' ? 'Calculateur Transformateur & Impédance' : 'Transformer Sizing & Impedance Engine',
          desc: locale === 'fr' ? 'Dimensionnement Ucc, pertes en charge et calcul échauffement' : 'Ucc impedance, load losses and thermal rise rating',
        };
      case 'ct-sizing':
        return {
          tab: 'ct-sizing' as CalculatorTabType,
          title: locale === 'fr' ? 'Dimensionnement TC & Facteur Limite ALF' : 'CT Sizing & Accuracy Limit Factor Engine',
          desc: locale === 'fr' ? 'Protection contre saturation en court-circuit selon CEI 61869-2 / CEI 60255' : 'CT knee-point voltage and secondary burden verification',
        };
      case 'earthing':
        return {
          tab: 'earthing' as CalculatorTabType,
          title: locale === 'fr' ? 'Dimensionnement Prise de Terre IEEE 80' : 'IEEE 80 Substation Grounding Grid Engine',
          desc: locale === 'fr' ? 'Résistance de grille, tensions de pas et de toucher tolérables' : 'Grid resistance, tolerable touch and step voltage limits',
        };
      case 'arc-flash':
        return {
          tab: 'arc-flash' as CalculatorTabType,
          title: locale === 'fr' ? 'Calculateur Arc Flash IEEE 1584 & EPI' : 'IEEE 1584 Arc Flash & PPE Engine',
          desc: locale === 'fr' ? 'Énergie incidente (cal/cm²), frontière d\'arc et catégorie EPI NFPA 70E' : 'Incident energy, arc flash boundary and NFPA 70E category',
        };
      case 'voltage-drop':
        return {
          tab: 'voltage-drop' as CalculatorTabType,
          title: locale === 'fr' ? 'Calcul Chute de Tension & Câbles NF C 15-100' : 'Voltage Drop & Cable Sizing Engine',
          desc: locale === 'fr' ? 'Chute de tension relative ΔU% et section minimale normalisée' : 'Percentage voltage sag and compliant conductor cross-section',
        };
      case 'pfc':
        return {
          tab: 'pfc' as CalculatorTabType,
          title: locale === 'fr' ? 'Dimensionnement Condensateurs PFC CEI 60831' : 'PFC Capacitor Bank Sizing Engine',
          desc: locale === 'fr' ? 'Compensation d\'énergie réactive kVAR et selfs anti-harmoniques' : 'Reactive power compensation and detuned reactor sizing',
        };
      case 'solar':
        return {
          tab: 'solar' as CalculatorTabType,
          title: locale === 'fr' ? 'Dimensionnement Champ Solaire PV CEI 62548' : 'Solar PV Array & Voc Sizing Engine',
          desc: locale === 'fr' ? 'Tension maximale Voc(Tmin), calcul MPP et puissance injectée' : 'Cold-weather Voc ceiling and inverter MPPT coordination',
        };
      case 'bess':
        return {
          tab: 'bess' as CalculatorTabType,
          title: locale === 'fr' ? 'Dimensionnement Stockage Batterie BESS CEI 62933' : 'BESS Battery Energy Storage Sizing Engine',
          desc: locale === 'fr' ? 'Capacité MWh, puissance MW, autonomie et rendement DoD' : 'MWh energy capacity, C-rate, DoD and round-trip efficiency',
        };
      case 'motor':
        return {
          tab: 'motor' as CalculatorTabType,
          title: locale === 'fr' ? 'Calculateur Moteur & Démarrage Industriel' : 'Industrial Motor & Starting Current Engine',
          desc: locale === 'fr' ? 'Courant de démarrage appel Inrush, couple et chute aux barres' : 'Locked-rotor current, torque curve and transient voltage drop',
        };
      case 'surge-arrester':
        return {
          tab: 'surge-arrester' as CalculatorTabType,
          title: locale === 'fr' ? 'Parafoudres & Coordination des Isolements CEI 60099 / 60071' : 'Surge Arrester & Insulation Coordination Engine',
          desc: locale === 'fr' ? 'Dimensionnement Uc, Ur, marges de protection foudre/manœuvre ≥20% et distance séparative critique Lmax' : 'Uc, Ur sizing, lightning/switching margins ≥20% and critical separation distance Lmax',
        };
      case 'busbar-electrodynamic':
        return {
          tab: 'busbar-electrodynamic' as CalculatorTabType,
          title: locale === 'fr' ? 'Forces Électrodynamiques sur Jeux de Barres (CEI 60865-1)' : 'Busbar Electrodynamic Forces & Stress (IEC 60865-1)',
          desc: locale === 'fr' ? 'Effort de crête Fd, contrainte de flexion σtot, fréquence propre et portée maximale entre isolateurs' : 'Peak force Fd, bending stress σtot, natural resonant frequency and max span between post insulators',
        };
      case 'cable-ampacity':
        return {
          tab: 'cable-ampacity' as CalculatorTabType,
          title: locale === 'fr' ? 'Courant Admissible & Déclassement Câbles (CEI 60364-5-52 / CEI 60287)' : 'Cable Sizing, Thermal Derating & Ampacity (IEC 60364 / IEC 60287)',
          desc: locale === 'fr' ? 'Facteurs k1...kh, courant admissible déclassé Iz, tenue thermique court-circuit CEI 60949 et chute ΔU' : 'Derating factors k1...kh, corrected ampacity Iz, adiabatic short-circuit withstand IEC 60949 and voltage drop',
        };
      default:
        return null;
    }
  };

  const getLinkedSimulationMeta = (simKey: string) => {
    switch (simKey) {
      case 'transformer':
        return {
          tab: 'transformer' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Vectoriel Transformateur' : 'Transformer Vector Group & Equivalent Lab',
          desc: locale === 'fr' ? 'Indice horaire, déphasage 30° et schéma équivalent de Kapp' : 'Clock index, 30° phase shift and Kapp equivalent diagram',
        };
      case 'coordination':
        return {
          tab: 'coordination' as SimulationTabType,
          title: locale === 'fr' ? 'Simulateur TCC & Coordination Sélective' : 'TCC Curves & Protection Coordination Lab',
          desc: locale === 'fr' ? 'Courbes temps-courant CEI 60255 (SI, VI, EI) et sélectivité chronométrique' : 'IEC 60255 time-overcurrent curves and grading margins',
        };
      case 'short-circuit':
        return {
          tab: 'short-circuit' as SimulationTabType,
          title: locale === 'fr' ? 'Simulateur de Court-Circuit CEI 60909' : 'IEC 60909 Symmetrical Short-Circuit Lab',
          desc: locale === 'fr' ? 'Courants Ik", crête Ip, asymétrie κ et pouvoir de coupure disjoncteur' : 'Initial symmetrical Ik", peak Ip and breaker rating check',
        };
      case 'power-triangle':
        return {
          tab: 'power-triangle' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Triangle des Puissances P-Q-S' : 'P-Q-S Power Triangle Simulator',
          desc: locale === 'fr' ? 'Visualisation interactive cos φ, compensation réactive et allègement réseau' : 'Interactive vector triangle, power factor improvement',
        };
      case 'ferranti':
        return {
          tab: 'ferranti' as SimulationTabType,
          title: locale === 'fr' ? 'Simulateur Effet Ferranti & Réactances' : 'Ferranti Voltage Rise & Shunt Reactor Lab',
          desc: locale === 'fr' ? 'Montée en tension à vide sur ligne HTB 225 kV et absorption Q' : 'No-load transmission line receiving-end voltage rise',
        };
      case 'motor-start':
        return {
          tab: 'motor-start' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Dynamique Démarrage Moteur' : 'Motor Starting Dynamics & Voltage Sag Lab',
          desc: locale === 'fr' ? 'Creux transitoire au jeu de barres IEEE 399 et temps d\'accélération' : 'Transient busbar voltage drop and acceleration envelope',
        };
      case 'transient-stability':
        return {
          tab: 'transient-stability' as SimulationTabType,
          title: locale === 'fr' ? 'Simulateur Stabilité Transitoire & Code Réseau' : 'Transient Stability & Grid Code Lab',
          desc: locale === 'fr' ? 'Équation d\'oscillation du rotor, temps critique CCT et réglage P/f ARSEL' : 'Swing equation, critical clearing time and ARSEL P/f response',
        };
      case 'harmonic-filter':
        return {
          tab: 'harmonic-filter' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Filtrage Harmonique & Résonance' : 'Harmonic Filter & Resonance Laboratory',
          desc: locale === 'fr' ? 'Impédance Z(f), batteries désaccordées p=7% et conformité IEEE 519 / CEI 61000' : 'Z(f) impedance profiling, p=7% detuned banks and IEEE 519 compliance',
        };
      case 'generator-capability':
        return {
          tab: 'generator-capability' as SimulationTabType,
          title: locale === 'fr' ? 'Capabilité Alternateur P-Q & Relais ANSI 40' : 'Generator P-Q Capability & ANSI 40 Lab',
          desc: locale === 'fr' ? 'Diagramme P-Q, échauffement stator/rotor, limite UEL, courbes de Mordey et protection perte d\'excitation' : 'P-Q capability diagram, stator/rotor thermal limits, UEL limit, Mordey curves, and loss-of-field protection',
        };
      case 'synchrocheck':
        return {
          tab: 'synchrocheck' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Couplage Réseau & Synchrocheck ANSI 25' : 'Grid Paralleling & ANSI 25 Synchrocheck Lab',
          desc: locale === 'fr' ? 'Synchroscope rotatif, lampes de phase, critères ΔU/Δf/Δδ, avance fermeture disjoncteur et choc de couple' : 'Rotary synchroscope, dark/bright lamps, ΔU/Δf/Δδ criteria, breaker lead advance and electromechanical torque shock',
        };
      case 'substation-interlocking':
        return {
          tab: 'substation-interlocking' as SimulationTabType,
          title: locale === 'fr' ? 'Laboratoire Manœuvres de Poste & Verrouillages CEI 62271' : 'Substation Switching & Interlocking Lab',
          desc: locale === 'fr' ? 'Double jeu de barres 225 kV, transfert sous charge sans coupure, consignation LOTO et verrouillages de sécurité' : 'Double busbar 225 kV, on-load seamless transfer, LOTO consignation and safety interlocks',
        };
      default:
        return null;
    }
  };

  const linkedCalc = selectedStandard.associated_calculator ? getLinkedCalculatorMeta(selectedStandard.associated_calculator) : null;
  const linkedSim = selectedStandard.associated_simulation ? getLinkedSimulationMeta(selectedStandard.associated_simulation) : null;

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumbs / Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#A9ADA5] hover:text-[#D7A64A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{locale === 'fr' ? 'RETOUR AU TABLEAU DE BORD' : 'BACK TO HOME'}</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#A9ADA5] font-bold uppercase tracking-wider">
            {locale === 'fr' ? 'FONDATION L01' : 'FOUNDATION L01'}
          </span>
          <span className="font-bold text-[#D7A64A] bg-[#151C1E] px-2.5 py-1 rounded-md border border-[#567A87]/35 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7A64A] animate-pulse" />
            {locale === 'fr' ? 'Référentiel Normatif & Essais' : 'Standards & Compliance Registry'}
          </span>
        </div>
      </div>

      {/* Engineering Header */}
      <header className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#0B0F12] border border-[#D7A64A]/40 rounded-xl text-[#D7A64A] shrink-0 shadow-xs">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F4F1E8] font-mono flex items-center gap-3">
                <span>{locale === 'fr' ? 'Référentiel des Normes & Essais FAT / SAT' : 'Standards, FAT / SAT & Compliance Registry'}</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#A9ADA5] max-w-3xl leading-relaxed font-medium">
                {locale === 'fr'
                  ? 'Exigences normatives internationales CEI / IEEE, réglementations sectorielles ARSEL / NF C et protocole interactif de vérification des essais en usine (FAT) et sur site (SAT).'
                  : 'International IEC / IEEE standards, regional Cameroon ARSEL / NF C regulations, and interactive factory (FAT) and site (SAT) acceptance verification guide.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-[#567A87]/40 bg-[#0B0F12] text-[#F4F1E8] font-bold shadow-xs">
              {STANDARDS.length} {locale === 'fr' ? 'NORMES RÉFÉRENCÉES' : 'STANDARDS LOGGED'}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-[#567A87]/25 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#A9ADA5] flex items-center gap-1 mr-1 uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'ORGANISME :' : 'ISSUER:'}</span>
            </span>
            {issuers.map((iss) => (
              <button
                key={iss}
                type="button"
                onClick={() => setSelectedIssuer(iss)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                  selectedIssuer === iss
                    ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
                    : 'border-[#567A87]/30 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#567A87] shadow-xs'
                }`}
              >
                {iss}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A9ADA5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fr' ? 'Filtrer (ex: 60076, arc, terre, clause...)' : 'Search (e.g. 60076, arc, ground, clause...)'}
              className="w-full bg-[#0B0F12] border border-[#567A87]/35 focus:border-[#D7A64A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F4F1E8] font-mono placeholder:text-[#A9ADA5]/60 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Domain Filter Toolbar */}
        <div className="mt-3 pt-3 border-t border-[#567A87]/25 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-[#A9ADA5] uppercase tracking-wider mr-1">
            {locale === 'fr' ? 'DOMAINE :' : 'DOMAIN:'}
          </span>
          {[
            { code: 'ALL', label: locale === 'fr' ? 'TOUS LES DOMAINES' : 'ALL DOMAINS' },
            { code: 'D01', label: locale === 'fr' ? 'D01 PRODUCTION' : 'D01 GENERATION' },
            { code: 'D02', label: locale === 'fr' ? 'D02 TRANSPORT' : 'D02 TRANSMISSION' },
            { code: 'D03', label: locale === 'fr' ? 'D03 POSTES' : 'D03 SUBSTATIONS' },
            { code: 'D04', label: 'D04 DISTRIBUTION' },
            { code: 'D05', label: locale === 'fr' ? 'D05 INDUSTRIE' : 'D05 INDUSTRIAL' },
            { code: 'D06', label: locale === 'fr' ? 'D06 BÂTIMENTS' : 'D06 BUILDINGS' },
            { code: 'D07', label: 'D07 PROTECTION' },
            { code: 'D08', label: 'D08 SCADA' },
            { code: 'D09', label: 'D09 SMART GRIDS' },
            { code: 'D10', label: 'D10 MAINTENANCE' },
          ].map(d => (
            <button
              key={d.code}
              type="button"
              onClick={() => setSelectedDomain(d.code)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                selectedDomain === d.code
                  ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs'
                  : 'border-[#567A87]/30 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#567A87]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Standards Navigation Chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredStandards.map((s) => {
            const isSelected = selectedStandard.reference === s.reference;
            const hasClauses = (s.clauses || []).length > 0;
            return (
              <button
                key={s.reference}
                type="button"
                onClick={() => setSelectedRef(s.reference)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A] shadow-xs ring-1 ring-[#D7A64A]/30'
                    : 'border-[#567A87]/30 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8] hover:border-[#567A87] shadow-xs'
                }`}
              >
                <span>{s.reference}</span>
                {hasClauses && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7A64A]" title={locale === 'fr' ? 'Clauses FAT/SAT activées' : 'FAT/SAT clauses available'} />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Cameroon National Grid Context & Tropical Specifications */}
      <div className="rounded-xl border border-[#567A87]/35 bg-[#151C1E] p-4 sm:p-5 text-xs font-mono shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[#D7A64A] font-bold text-sm">🇨🇲</span>
            <span className="font-bold text-[#F4F1E8] uppercase tracking-wider">
              {locale === 'fr' ? 'Contexte Réseau National Cameroun (ARSEL / SONATREL / ENEO)' : 'Cameroon National Grid & Tropical Operating Envelope (ARSEL / SONATREL / ENEO)'}
            </span>
          </div>
          <span className="bg-[#0B0F12] border border-[#D7A64A]/40 text-[#D7A64A] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            {locale === 'fr' ? 'Code Réseau & Climat Tropical' : 'Grid Code & Tropical Climate'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#A9ADA5] font-sans text-xs">
          <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30">
            <span className="text-[10px] font-mono font-bold text-[#D7A64A] block uppercase mb-1">
              {locale === 'fr' ? 'Fréquence & Tolérance' : 'Frequency & Tolerance'}
            </span>
            <p className="leading-snug">
              {locale === 'fr' ? (
                <><strong>50.00 Hz</strong> nom. (Plage normale : 49.80 – 50.20 Hz ; exceptionnelle : 49.50 – 50.50 Hz). Déclenchement délestage UFLS sous 49.00 Hz.</>
              ) : (
                <><strong>50.00 Hz</strong> nominal (Normal band: 49.80 – 50.20 Hz; contingency: 49.50 – 50.50 Hz). Automatic UFLS load shedding below 49.00 Hz.</>
              )}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30">
            <span className="text-[10px] font-mono font-bold text-[#D7A64A] block uppercase mb-1">
              {locale === 'fr' ? 'Déclassement Thermique Tropical' : 'Tropical Thermal Derating'}
            </span>
            <p className="leading-snug">
              {locale === 'fr' ? (
                <>Température ambiante de calcul <strong>40 °C à 45 °C</strong> (versus 30 °C CEI 60076). Déclassement puissance continue k_θ ≈ 0.90–0.93.</>
              ) : (
                <>Design ambient temperature <strong>40 °C to 45 °C</strong> (vs. 30 °C IEC 60076 baseline). Continuous thermal derating factor k_θ ≈ 0.90–0.93.</>
              )}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30">
            <span className="text-[10px] font-mono font-bold text-[#D7A64A] block uppercase mb-1">
              {locale === 'fr' ? 'Densité Kéraunique & Foudre' : 'Isokeraunic Level & Lightning'}
            </span>
            <p className="leading-snug">
              {locale === 'fr' ? (
                <>Niveau kéraunique <strong>Nk &gt; 80 j/an</strong>. Parafoudres ZnO classe 1 &amp; 2 (CEI 60099-4) impératifs sur arrivées aériennes et transformateurs.</>
              ) : (
                <>Isokeraunic level <strong>Nk &gt; 80 thunderstorm days/yr</strong>. Class 1 &amp; 2 ZnO surge arresters (IEC 60099-4) mandatory on overhead line bays and transformers.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Standard Detail Card */}
      <div className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] overflow-hidden shadow-xl">
        
        {/* Card Technical Header */}
        <div className="border-b border-[#567A87]/25 bg-[#0B0F12] p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#D7A64A] tracking-wide select-all">
                {selectedStandard.reference}
              </span>
              <span className="font-mono text-[10px] text-[#F4F1E8] bg-[#151C1E] px-2 py-0.5 rounded border border-[#567A87]/40 font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'RÉFÉRENCE TECHNIQUE CEI / IEEE / NF C' : 'TECHNICAL STANDARD IEC / IEEE / NF C'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-[#A9ADA5] bg-[#151C1E] px-2.5 py-1 rounded border border-[#567A87]/35 font-bold uppercase tracking-wider text-[11px] shadow-xs">
                {locale === 'fr' ? 'ORGANISME:' : 'ISSUER:'} <span className="text-[#F4F1E8]">{selectedStandard.issuer || 'N/A'}</span>
              </span>
              <span className="text-[#A9ADA5] bg-[#151C1E] px-2.5 py-1 rounded border border-[#567A87]/35 font-bold uppercase tracking-wider text-[11px] shadow-xs">
                {locale === 'fr' ? 'ÉDITION:' : 'EDITION:'} <span className="text-[#F4F1E8]">{selectedStandard.edition || 'N/A'}</span>
              </span>
              <span className="text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/60 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {selectedStandard.status.toUpperCase()}
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#F4F1E8] font-mono">
            {locale === 'fr' ? selectedStandard.title_fr : selectedStandard.title_en}
          </h2>
        </div>

        {/* Card Content Grid */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* PÉRIMÈTRE / SCOPE */}
          <div>
            <h3 className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span>📋</span> {locale === 'fr' ? 'PÉRIMÈTRE TECHNIQUE & OBJET DE LA NORME' : 'TECHNICAL SCOPE & MANDATE'}
            </h3>
            <div className="bg-[#0B0F12] p-5 rounded-xl border border-[#567A87]/30 font-medium text-sm text-[#F4F1E8] leading-relaxed">
              {locale === 'fr' ? selectedStandard.scope_fr : selectedStandard.scope_en}
            </div>
          </div>

          {/* ASSOCIATED COMPUTATIONAL ENGINES & SIMULATION LABS */}
          {(linkedCalc || linkedSim) && (
            <div className="rounded-xl border border-[#D7A64A]/35 bg-[#0B0F12] p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="font-mono text-xs font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#D7A64A]" />
                  <span>{locale === 'fr' ? 'Moteurs de Calcul & Simulateurs Directement Associés' : 'Directly Linked Calculators & Simulation Labs'}</span>
                </h4>
                <span className="text-[10px] font-mono text-[#D7A64A] bg-[#151C1E] border border-[#D7A64A]/40 px-2 py-0.5 rounded font-bold uppercase">
                  EPEDE COMPUTATIONAL SUITE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedCalc && onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator(linkedCalc.tab)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#151C1E] hover:bg-[#151C1E]/80 border border-[#567A87]/35 hover:border-[#D7A64A] text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/40 text-[#D7A64A] shrink-0 group-hover:scale-105 transition-transform">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#F4F1E8] group-hover:text-[#D7A64A] transition-colors">
                          {linkedCalc.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-[#D7A64A] opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[11px] text-[#A9ADA5] font-sans mt-0.5 line-clamp-2">
                        {linkedCalc.desc}
                      </p>
                    </div>
                  </button>
                )}

                {linkedSim && onNavigateSimulation && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation(linkedSim.tab)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#151C1E] hover:bg-[#151C1E]/80 border border-[#567A87]/35 hover:border-[#D7A64A] text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-[#0B0F12] border border-[#567A87]/40 text-[#F4F1E8] shrink-0 group-hover:scale-105 transition-transform">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#F4F1E8] group-hover:text-[#D7A64A] transition-colors">
                          {linkedSim.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-[#D7A64A] opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[11px] text-[#A9ADA5] font-sans mt-0.5 line-clamp-2">
                        {linkedSim.desc}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* APPLICABILITY 3-COLUMN CAD BLOCKS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            
            {/* APPLICABLE À L'APPAREILLAGE */}
            <div className="bg-[#0B0F12] p-5 rounded-xl border border-[#567A87]/30 space-y-3">
              <h4 className="font-bold text-xs text-[#F4F1E8] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#567A87]/25 pb-2">
                <span className="text-[#D7A64A]">⚡</span>
                <span>{locale === 'fr' ? 'APPAREILLAGES ASSOCIÉS' : 'EQUIPMENT FOCUS'}</span>
              </h4>
              <ul className="space-y-2 text-[#A9ADA5] font-sans">
                {selectedStandard.applicable_equipment.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#D7A64A] font-mono font-bold">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UTILISÉ PAR LES MÉTIERS */}
            <div className="bg-[#0B0F12] p-5 rounded-xl border border-[#567A87]/30 space-y-3">
              <h4 className="font-bold text-xs text-[#F4F1E8] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#567A87]/25 pb-2">
                <span className="text-[#D7A64A]">👷</span>
                <span>{locale === 'fr' ? 'UTILISÉ PAR LES INGÉNIEURS' : 'USER DISCIPLINES'}</span>
              </h4>
              <ul className="space-y-2 text-[#A9ADA5] font-sans">
                {selectedStandard.used_by_roles.map((role) => (
                  <li key={role} className="flex items-start gap-2">
                    <span className="text-[#D7A64A] font-mono font-bold">▪</span>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* JURIDICTION & DOMAINES EPEDE */}
            <div className="bg-[#0B0F12] p-5 rounded-xl border border-[#567A87]/30 space-y-3">
              <h4 className="font-bold text-xs text-[#F4F1E8] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#567A87]/25 pb-2">
                <span className="text-[#D7A64A]">⚖️</span>
                <span>{locale === 'fr' ? 'JURIDICTION & DOMAINES' : 'JURISDICTION & CODES'}</span>
              </h4>
              <p className="text-[#A9ADA5] font-sans leading-relaxed text-xs">
                {selectedStandard.jurisdiction}
              </p>
              
              <div className="pt-2">
                <span className="text-[11px] text-[#A9ADA5] font-bold block mb-1.5 uppercase">
                  {locale === 'fr' ? 'Domaines EPEDE couverts :' : 'Covered EPEDE Domains:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStandard.domain_codes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onNavigateDomain(code)}
                      className="font-mono text-xs font-bold bg-[#151C1E] text-[#D7A64A] hover:text-[#F4F1E8] hover:border-[#D7A64A] px-2.5 py-1 rounded-md border border-[#567A87]/35 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* INTERACTIVE FAT / SAT TESTING & AUDIT VERIFICATION PROTOCOL */}
          <div className="rounded-xl border border-[#567A87]/35 bg-[#0B0F12] overflow-hidden">
            
            {/* Audit Toolbar & Compliance Gauge */}
            <div className="border-b border-[#567A87]/25 p-5 bg-[#151C1E] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-mono font-black text-[#F4F1E8] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#D7A64A]" />
                    <span>{locale === 'fr' ? 'Guide d\'Auto-Évaluation Normative (FAT / SAT & Conception)' : 'Normative Self-Evaluation Guide (FAT / SAT & Design)'}</span>
                  </h3>
                  <span className="font-mono text-[11px] text-[#D7A64A] bg-[#0B0F12] px-2 py-0.5 rounded border border-[#D7A64A]/40 font-bold">
                    {totalClauses} {locale === 'fr' ? 'POINTS DE CONTRÔLE' : 'CHECKPOINTS'}
                  </span>
                </div>
                <p className="text-xs text-[#A9ADA5] font-sans mt-1">
                  {locale === 'fr'
                    ? 'Aide-mémoire interactif des clauses normatives avec critères d\'acceptabilité. Outil indicatif non opposable comme procès-verbal officiel ou certification réglementaire.'
                    : 'Interactive normative clause guide with tolerance criteria. Pedagogical reference not legally binding as official certification.'}
                </p>
              </div>

              {/* Compliance Rating Meter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-[#0B0F12] border border-[#567A87]/35 rounded-xl px-4 py-2 text-right">
                  <div className="font-mono text-[10px] text-[#A9ADA5] uppercase font-bold tracking-wider">
                    {locale === 'fr' ? 'SCORE D\'AUTO-ÉVALUATION' : 'SELF-EVALUATION SCORE'}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`font-mono text-base font-black ${
                      compliancePercentage === 100 ? 'text-emerald-400' :
                      compliancePercentage >= 75 ? 'text-[#D7A64A]' :
                      compliancePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {compliancePercentage}%
                    </span>
                    <span className="text-[11px] font-mono text-[#A9ADA5]">
                      ({passedClauses}/{applicableTotal} {locale === 'fr' ? 'validés' : 'pass'})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportAuditReport}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  {copiedReport ? (
                    <>
                      <Check className="h-4 w-4 text-[#0B0F12]" />
                      <span>{locale === 'fr' ? 'FICHE COPIÉE !' : 'REPORT COPIED!'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 text-[#0B0F12]" />
                      <span>{locale === 'fr' ? 'EXPORTER LA FICHE' : 'EXPORT SUMMARY'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions & Category Filter Chips */}
            <div className="p-4 border-b border-[#567A87]/25 bg-[#0B0F12] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#A9ADA5] font-bold uppercase">{locale === 'fr' ? 'FILTRE TYPE :' : 'TEST TYPE:'}</span>
                {['ALL', 'routine_test', 'type_test', 'special_test', 'design_rule', 'safety_rule'].map(cat => {
                  const label = cat === 'ALL' ? (locale === 'fr' ? 'TOUTES LES CLAUSES' : 'ALL CLAUSES') :
                                cat === 'routine_test' ? (locale === 'fr' ? 'ESSAIS DE SÉRIE' : 'ROUTINE TESTS') :
                                cat === 'type_test' ? (locale === 'fr' ? 'ESSAIS DE TYPE' : 'TYPE TESTS') :
                                cat === 'special_test' ? (locale === 'fr' ? 'ESSAIS SUR SITE (SAT)' : 'SPECIAL / SAT') :
                                cat === 'design_rule' ? (locale === 'fr' ? 'CONCEPTION' : 'DESIGN RULES') :
                                (locale === 'fr' ? 'SÉCURITÉ' : 'SAFETY RULES');
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setClauseCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-colors border ${
                        clauseCategoryFilter === cat 
                          ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A]'
                          : 'border-[#567A87]/30 bg-[#151C1E] text-[#A9ADA5] hover:text-[#F4F1E8]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkAllClauses('pass')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded border border-emerald-900/60 bg-emerald-950/40 transition-colors"
                >
                  ✓ {locale === 'fr' ? 'TOUT VALIDER' : 'PASS ALL'}
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAllClauses('pending')}
                  className="text-[11px] text-[#A9ADA5] hover:text-[#F4F1E8] font-bold px-2 py-1 rounded border border-[#567A87]/35 bg-[#151C1E] transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'RÉINITIALISER' : 'RESET'}</span>
                </button>
              </div>
            </div>

            {/* Clauses List */}
            <div className="p-4 sm:p-6 space-y-3">
              {clauses.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                  {locale === 'fr' ? 'Aucune clause ne correspond aux critères de filtre sélectionnés.' : 'No clauses match the selected category filter.'}
                </div>
              ) : (
                clauses.map((clause) => {
                  const status = currentStandardAudit[clause.clause_number] || 'pending';
                  const catMeta = getCategoryBadge(clause.category);

                  return (
                    <div
                      key={clause.clause_number}
                      className={`rounded-xl border transition-all p-4 sm:p-5 ${
                        status === 'pass' 
                          ? 'border-emerald-900/70 bg-[#081510]'
                          : status === 'fail'
                          ? 'border-rose-900/70 bg-[#17090b]'
                          : status === 'na'
                          ? 'border-[#252E38] bg-[#0A0D12] opacity-60'
                          : 'border-[#252E38] bg-[#0D1117]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        
                        {/* Left Info: Clause Number, Title, Requirement & Acceptance Criteria */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-cyan-400 bg-[#080B10] px-2.5 py-0.5 rounded border border-[#252E38]">
                              CLAUSE {clause.clause_number}
                            </span>
                            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${catMeta.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dot}`} />
                              {catMeta.label}
                            </span>
                          </div>

                          <h4 className="font-mono text-sm font-black text-white">
                            {locale === 'fr' ? clause.title_fr : clause.title_en}
                          </h4>

                          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                            {locale === 'fr' ? clause.requirement_fr : clause.requirement_en}
                          </p>

                          {/* Acceptance Criteria Box */}
                          <div className="mt-2 inline-flex items-center gap-2 bg-[#080B10] px-3 py-1.5 rounded-lg border border-[#252E38] text-xs font-mono">
                            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                              {locale === 'fr' ? 'CRITÈRE D\'ACCEPTATION :' : 'ACCEPTANCE TOLERANCE:'}
                            </span>
                            <span className="text-white font-bold select-all">
                              {clause.acceptance_criteria}
                            </span>
                          </div>
                        </div>

                        {/* Right: Audit Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 font-mono text-xs">
                          
                          {/* PASS BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleSetClauseStatus(clause.clause_number, 'pass')}
                            className={`px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
                              status === 'pass'
                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                                : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-emerald-400 hover:border-emerald-800'
                            }`}
                            title={locale === 'fr' ? 'Marquer comme Conforme' : 'Mark as Compliant'}
                          >
                            <CheckCircle2 className={`h-4 w-4 ${status === 'pass' ? 'text-emerald-400' : ''}`} />
                            <span className="hidden sm:inline">{locale === 'fr' ? 'CONFORME' : 'PASS'}</span>
                          </button>

                          {/* FAIL BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleSetClauseStatus(clause.clause_number, 'fail')}
                            className={`px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
                              status === 'fail'
                                ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-sm'
                                : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-rose-400 hover:border-rose-800'
                            }`}
                            title={locale === 'fr' ? 'Marquer comme Non-conforme' : 'Mark as Failed'}
                          >
                            <XCircle className={`h-4 w-4 ${status === 'fail' ? 'text-rose-400' : ''}`} />
                            <span className="hidden sm:inline">{locale === 'fr' ? 'REJETÉ' : 'FAIL'}</span>
                          </button>

                          {/* PENDING BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleSetClauseStatus(clause.clause_number, 'pending')}
                            className={`px-2 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 transition-all border ${
                              status === 'pending'
                                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                                : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-amber-400 hover:border-amber-800'
                            }`}
                            title={locale === 'fr' ? 'En attente' : 'Pending test'}
                          >
                            <Clock className={`h-3.5 w-3.5 ${status === 'pending' ? 'text-amber-400' : ''}`} />
                            <span className="hidden sm:inline">{locale === 'fr' ? 'ATTENTE' : 'WAIT'}</span>
                          </button>

                          {/* NA BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleSetClauseStatus(clause.clause_number, 'na')}
                            className={`px-2 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 transition-all border ${
                              status === 'na'
                                ? 'border-neutral-500 bg-neutral-500/20 text-neutral-200'
                                : 'border-[#252E38] bg-[#080B10] text-neutral-500 hover:text-neutral-300'
                            }`}
                            title={locale === 'fr' ? 'Non applicable' : 'Not applicable'}
                          >
                            <MinusCircle className="h-3.5 w-3.5" />
                            <span>N/A</span>
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Audit Footer Info */}
            <div className="border-t border-[#252E38] p-4 bg-[#0A0D12] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">DIGITAL SIGNATURE :</span>
                <span className="text-neutral-300">EPEDE-FAT-{(selectedStandard.reference).replace(/[^a-zA-Z0-9]/g, '-')}-{(new Date()).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">✓ {passedClauses} PASS</span>
                <span className="text-rose-400">✗ {failedClauses} FAIL</span>
                <span className="text-amber-400">⏳ {pendingClauses} PENDING</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
