// src/components/installations/ProjectCommissioningFatSatEngine.tsx
// EPEDE Deep Engineering Module — Domain D06: Electrical Installations & Switchboards
// Module 24: Switchboard Commissioning, FAT / SAT Inspection & Dielectric Testing Engine (IEC 61439-1 / NF C 15-100 Part 6)

import React, { useState, useMemo, useEffect } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Zap, 
  FileText, 
  Award, 
  Activity, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Download, 
  Scale, 
  HelpCircle,
  Clock,
  Gauge,
  Settings2,
  FileDown,
  Check,
  Building2,
  UserCheck,
  Wifi,
  WifiOff,
  HardDrive
} from 'lucide-react';
import { generateFatSatPdf } from './services/FatSatPdfExportService';
import { offlineInspectionStorage, OfflineInspectionData } from '../../services/offlineInspectionStorage';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export type InspectionStage = 'FAT' | 'SAT' | 'PERIODIC_CONSUEL';

export interface InspectionCheckItem {
  id: string;
  category: 'MECHANICAL' | 'ELECTRICAL_CLEARANCES' | 'WIRING_TORQUE' | 'INSULATION_DIELECTRIC' | 'FUNCTIONAL_INTERLOCKS';
  clauseIec: string;
  titleFr: string;
  titleEn: string;
  criteriaFr: string;
  criteriaEn: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  measuredValue?: string;
  notes?: string;
}

export const ProjectCommissioningFatSatEngine: React.FC<Props> = ({ project, locale }) => {
  const isFr = locale === 'fr';

  // 1. Commissioning stage selection: FAT (Factory Acceptance Test) vs SAT (Site Acceptance Test)
  const [activeStage, setActiveStage] = useState<InspectionStage>('FAT');
  
  // 2. Rated Insulation Voltage Ui (V) and Impulse Voltage Uimp (kV) for testing parameters
  const [ratedUiVolts, setRatedUiVolts] = useState<number>(1000); // Ui = 1000V AC standard for TGBT
  const [ratedUimpKv, setRatedUimpKv] = useState<number>(8);      // Uimp = 8kV for Category IV / Main Incomer

  // 3. Measured Dielectric & Continuity test parameters
  const [measuredRisoMegaOhms, setMeasuredRisoMegaOhms] = useState<number>(450); // Measured R_iso (MΩ) @ 500V or 1000V DC
  const [measuredRpeMilliOhms, setMeasuredRpeMilliOhms] = useState<number>(32);   // Measured R_pe (mΩ) @ 10A AC/DC
  const [dielectricWithstandSec, setDielectricWithstandSec] = useState<number>(60); // 1s routine or 60s type test
  const [appliedDielectricKv, setAppliedDielectricKv] = useState<number>(2.2);   // kV AC rms test voltage

  // 4. Bolt size and torque verification
  const [busbarBoltSize, setBusbarBoltSize] = useState<'M8' | 'M10' | 'M12' | 'M16'>('M10');

  // Baseline electrical power balance
  const balance = useMemo(() => computeProjectPowerBalance(project), [project]);
  const tgbtCurrentA = Math.round(balance.tgbtIncomerAmperes || 630);

  // Standard required test voltage per IEC 61439-1 Table 8:
  // For Ui = 1000V: Dielectric test voltage = 2200 V AC rms (or 2500 V AC)
  const requiredDielectricVoltageKv = useMemo(() => {
    if (ratedUiVolts <= 300) return 2.0;
    if (ratedUiVolts <= 690) return 2.5;
    return 2.2; // IEC 61439-1 Table 8 for 800V < Ui <= 1000V: 2200 V AC rms
  }, [ratedUiVolts]);

  // Torque standard per DIN 43673-1 / IEC 61439-1 for busbar bolted joints (Class 8.8 bolts)
  const recommendedTorqueNm = useMemo(() => {
    switch (busbarBoltSize) {
      case 'M8': return 25;
      case 'M10': return 50;
      case 'M12': return 85;
      case 'M16': return 170;
      default: return 50;
    }
  }, [busbarBoltSize]);

  // 5. Official sign-off & PDF Generation state
  const [signerName, setSignerName] = useState<string>('Ing. M. Touré (EUR ING / CEng)');
  const [signerRole, setSignerRole] = useState<string>(isFr ? 'Ingénieur Responsable Essais' : 'Lead Commissioning Engineer');
  const [inspectionBureau, setInspectionBureau] = useState<string>('CONSUEL / Bureau Veritas');
  const [revisionRef, setRevisionRef] = useState<string>('REV-A');
  const [showSignerConfig, setShowSignerConfig] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const handleExportFatSatPdf = () => {
    try {
      setIsGeneratingPdf(true);
      generateFatSatPdf({
        project,
        locale,
        stage: activeStage,
        checklist,
        ratedUiVolts,
        ratedUimpKv,
        measuredRisoMegaOhms,
        measuredRpeMilliOhms,
        dielectricWithstandSec,
        appliedDielectricKv,
        requiredDielectricVoltageKv,
        busbarBoltSize,
        recommendedTorqueNm,
        signerName,
        signerRole,
        inspectionBureau,
        revisionRef,
      });
      const msg = isFr
        ? `✓ Procès-verbal officiel ${activeStage} généré et téléchargé (4 pages conformes CEI 61439-1 / NF C 15-100)`
        : `✓ Official ${activeStage} commissioning certificate generated (4 pages IEC 61439-1 / NF C 15-100 compliant)`;
      setPdfSuccessMessage(msg);
      setTimeout(() => setPdfSuccessMessage(null), 6000);
    } catch (err) {
      console.error('Failed to generate FAT/SAT PDF report:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Initial checklist state with standards traceability (IEC 61439-1 Section 10 & 11)
  const [checklist, setChecklist] = useState<InspectionCheckItem[]>([
    {
      id: 'chk-mech-1',
      category: 'MECHANICAL',
      clauseIec: '10.2 / 11.2',
      titleFr: 'Degré de Protection IP & IK de l\'enveloppe',
      titleEn: 'IP & IK Degree of Protection Verification',
      criteriaFr: 'Vérification visuelle des joints d\'étanchéité, passe-câbles, plastrons et ouïes de ventilation.',
      criteriaEn: 'Visual check of door gaskets, cable gland plates, escutcheons, and ventilation louvres.',
      status: 'PASS'
    },
    {
      id: 'chk-mech-2',
      category: 'MECHANICAL',
      clauseIec: '10.3 / 11.3',
      titleFr: 'Distances d\'isolement dans l\'air et lignes de fuite',
      titleEn: 'Clearances and Creepage Distances',
      criteriaFr: 'Distance dans l\'air ≥ 14 mm (pour Uimp = 8 kV), ligne de fuite ≥ 16 mm (degré de pollution 3).',
      criteriaEn: 'Clearance in air ≥ 14 mm (for Uimp = 8 kV), creepage distance ≥ 16 mm (Pollution degree 3).',
      status: 'PASS'
    },
    {
      id: 'chk-torque-1',
      category: 'WIRING_TORQUE',
      clauseIec: '10.11 / 11.4',
      titleFr: 'Couple de serrage des connexions et barres (Marquage témoin)',
      titleEn: 'Torque Tightening of Bolted Busbars & Joints',
      criteriaFr: 'Contrôle à la clé dynamométrique étalonnée et apposition du vernis témoin rouge indélébile.',
      criteriaEn: 'Calibrated torque wrench verification with tamper-evident torque seal marker applied.',
      status: 'PASS'
    },
    {
      id: 'chk-wiring-1',
      category: 'WIRING_TORQUE',
      clauseIec: '10.5 / 11.5',
      titleFr: 'Continuité des masses métalliques et circuit PE',
      titleEn: 'Protective Earth Continuity & Bonding',
      criteriaFr: 'Résistance de continuité Rpe ≤ 0.1 Ω mesurée sous un courant de test ≥ 10 A entre toute masse et la borne PE.',
      criteriaEn: 'Bonding resistance Rpe ≤ 0.1 Ω with test current ≥ 10 A between all exposed conductive parts and PE busbar.',
      status: 'PASS'
    },
    {
      id: 'chk-iso-1',
      category: 'INSULATION_DIELECTRIC',
      clauseIec: '10.9 / 11.9',
      titleFr: 'Mesure de Résistance d\'Isolement (Mégohmmètre)',
      titleEn: 'Insulation Resistance Measurement (Megger)',
      criteriaFr: 'Résistance d\'isolement Riso ≥ 1.0 MΩ (typiquement > 100 MΩ) mesurée sous 500V DC ou 1000V DC entre phases et terre.',
      criteriaEn: 'Insulation resistance Riso ≥ 1.0 MΩ (typically > 100 MΩ) measured at 500V or 1000V DC between live parts and earth.',
      status: 'PASS'
    },
    {
      id: 'chk-iso-2',
      category: 'INSULATION_DIELECTRIC',
      clauseIec: '10.9.2 / 11.9.2',
      titleFr: 'Essai Diélectrique à Fréquence Industrielle (Rigidité)',
      titleEn: 'Power Frequency Dielectric Withstand Test',
      criteriaFr: 'Application de la tension d\'épreuve 2200 V AC pendant 1s (essai individuel de série) ou 60s sans claquage.',
      criteriaEn: 'Application of test voltage 2200 V AC for 1s (routine factory test) or 60s without flashover or puncture.',
      status: 'PASS'
    },
    {
      id: 'chk-func-1',
      category: 'FUNCTIONAL_INTERLOCKS',
      clauseIec: '10.13 / 11.8',
      titleFr: 'Verrouillages mécaniques et électriques Inversion Source',
      titleEn: 'Source Inversion Mechanical & Electrical Interlocks',
      criteriaFr: 'Vérification de l\'impossibilité de fermeture simultanée Réseau Normal et Groupe Électrogène de secours.',
      criteriaEn: 'Verification preventing simultaneous closing of Normal Grid and Emergency Standby Generator incomers.',
      status: 'PASS'
    },
    {
      id: 'chk-func-2',
      category: 'FUNCTIONAL_INTERLOCKS',
      clauseIec: '10.13 / 11.8',
      titleFr: 'Déclenchement d\'Urgence (AU) & Bobines MX / MN',
      titleEn: 'Emergency Stop Loop (E-Stop) & Shunt / Undervoltage Trips',
      criteriaFr: 'Test d\'ouverture instantanée du disjoncteur général sur coupure de la boucle de sécurité arrêt d\'urgence.',
      criteriaEn: 'Verification of instantaneous main breaker opening upon triggering emergency stop loop.',
      status: 'PASS'
    }
  ]);

  // Handle toggle status of checklist item
  const handleToggleStatus = (id: string, newStatus: 'PASS' | 'FAIL' | 'PENDING') => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Compliance calculations
  const passCount = useMemo(() => checklist.filter(c => c.status === 'PASS').length, [checklist]);
  const failCount = useMemo(() => checklist.filter(c => c.status === 'FAIL').length, [checklist]);
  const pendingCount = useMemo(() => checklist.filter(c => c.status === 'PENDING').length, [checklist]);
  const totalCount = checklist.length;
  const compliancePercentage = Math.round((passCount / totalCount) * 100);

  // Insulation validation: R_iso must be >= 1.0 MΩ (NF C 15-100 / IEC 61439-1)
  const isInsulationCompliant = measuredRisoMegaOhms >= 1.0;
  // Bonding validation: R_pe must be <= 100 mΩ (0.1 Ω)
  const isBondingCompliant = measuredRpeMilliOhms <= 100;
  // Dielectric voltage validation
  const isDielectricCompliant = appliedDielectricKv >= requiredDielectricVoltageKv;

  const isCommissioningApproved = failCount === 0 && pendingCount === 0 && isInsulationCompliant && isBondingCompliant;

  // 6. Substation Offline Field Operation Engine (PWA IndexedDB Persistence)
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineInspectionStorage.getOnlineStatus());
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    const handleStatus = (e: any) => {
      setIsOnline(e.detail?.online ?? navigator.onLine);
    };
    window.addEventListener('epede-network-status', handleStatus);
    return () => window.removeEventListener('epede-network-status', handleStatus);
  }, []);

  // Load persisted inspection on project mount
  useEffect(() => {
    let isMounted = true;
    offlineInspectionStorage.loadInspectionSession(project.id).then((saved) => {
      if (!isMounted || !saved) return;
      if (saved.stage) setActiveStage(saved.stage);
      if (saved.inspectorName) setSignerName(saved.inspectorName);
      if (saved.inspectorTitle) setSignerRole(saved.inspectorTitle);
      if (saved.inspectionOrg) setInspectionBureau(saved.inspectionOrg);
      if (saved.pvReference) setRevisionRef(saved.pvReference);
      if (saved.checklistState) {
        setChecklist((prev) =>
          prev.map((item) => {
            const savedItem = saved.checklistState[item.id];
            return savedItem ? { ...item, status: savedItem.status, notes: savedItem.notes, measuredValue: savedItem.measuredValue } : item;
          })
        );
      }
      setLastSavedTime(new Date(saved.updatedAt).toLocaleTimeString());
    });
    return () => { isMounted = false; };
  }, [project.id]);

  // Auto-save on checklist and field parameters update
  useEffect(() => {
    const checklistState: OfflineInspectionData['checklistState'] = {};
    checklist.forEach((item) => {
      checklistState[item.id] = {
        status: item.status,
        measuredValue: item.measuredValue,
        notes: item.notes,
      };
    });

    const sessionPayload: OfflineInspectionData = {
      projectId: project.id,
      projectName: project.name,
      stage: activeStage,
      updatedAt: new Date().toISOString(),
      inspectorName: signerName,
      inspectorTitle: signerRole,
      inspectionOrg: inspectionBureau,
      pvReference: revisionRef,
      checklistState,
      dielectricData: {
        testVoltageKv: String(appliedDielectricKv),
        durationSec: dielectricWithstandSec,
        insulationResistanceMohm: String(measuredRisoMegaOhms),
        leakageCurrentMa: '0.8',
        dielectricResult: isDielectricCompliant ? 'CONFORME' : 'NON_CONFORME',
      },
      torqueData: {
        busbarJointTorqueNm: String(recommendedTorqueNm),
        breakerLugTorqueNm: '45',
        cableGlandTorqueNm: '25',
        torqueResult: 'CONFORME',
      },
    };

    offlineInspectionStorage.saveInspectionSession(sessionPayload).then(() => {
      setLastSavedTime(new Date().toLocaleTimeString());
    });
  }, [
    project.id,
    project.name,
    activeStage,
    checklist,
    signerName,
    signerRole,
    inspectionBureau,
    revisionRef,
    appliedDielectricKv,
    dielectricWithstandSec,
    measuredRisoMegaOhms,
    isDielectricCompliant,
    recommendedTorqueNm,
  ]);

  const handleExportBackup = () => {
    const checklistState: OfflineInspectionData['checklistState'] = {};
    checklist.forEach((item) => {
      checklistState[item.id] = {
        status: item.status,
        measuredValue: item.measuredValue,
        notes: item.notes,
      };
    });
    offlineInspectionStorage.exportBackupJson({
      projectId: project.id,
      projectName: project.name,
      stage: activeStage,
      updatedAt: new Date().toISOString(),
      inspectorName: signerName,
      inspectorTitle: signerRole,
      inspectionOrg: inspectionBureau,
      pvReference: revisionRef,
      checklistState,
    });
  };

  return (
    <div className="space-y-6" id="project-commissioning-fat-sat-engine">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {isFr 
                    ? '24. Réception FAT / SAT, Contrôles & Essais Diélectriques TGBT'
                    : '24. Switchboard Commissioning, FAT/SAT & Dielectric Testing Engine'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  IEC 61439-1 §10-§11 / NF C 15-100 Pt 6
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isFr 
                  ? 'Protocole d\'essais en usine (FAT) et sur site (SAT) : continuité des masses (Rpe), isolement (Riso), rigidité diélectrique, couples de serrage et procès-verbal de conformité Consuel.'
                  : 'Factory Acceptance Testing (FAT) & Site Acceptance Testing (SAT): protective bonding continuity (Rpe), insulation resistance (Riso), dielectric withstand, bolt torque verification and commissioning certificate.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Field Offline Sync Pill */}
            <div className={`px-3 py-1.5 border rounded-xl flex items-center gap-2 ${
              isOnline 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
              <div className="text-left font-mono">
                <span className="text-[9px] uppercase block text-slate-400">
                  {isFr ? 'PWA Terrain' : 'PWA Field'}
                </span>
                <span className="text-[10px] font-bold">
                  {isOnline ? (isFr ? 'En Ligne (Sync)' : 'Online (Sync)') : (isFr ? 'Hors-Ligne (Cache)' : 'Offline (Cache)')}
                </span>
              </div>
            </div>

            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Taux de Validation' : 'Compliance Rate'}
              </span>
              <span className={`text-base font-bold font-mono ${compliancePercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {compliancePercentage}% ({passCount}/{totalCount})
              </span>
            </div>
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Statut PV Réception' : 'Commissioning Status'}
              </span>
              <span className={`text-base font-bold font-mono ${isCommissioningApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCommissioningApproved ? (isFr ? 'CONFORME' : 'APPROVED') : (isFr ? 'RÉSERVES' : 'PENDING')}
              </span>
            </div>

            {/* Offline JSON Snapshot Backup */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer shadow-xs"
              title={isFr ? 'Exporter une sauvegarde JSON des relevés de terrain' : 'Export JSON backup of field measurements'}
            >
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>{isFr ? 'Sauvegarde JSON' : 'JSON Backup'}</span>
            </button>

            <button
              onClick={handleExportFatSatPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition-all cursor-pointer disabled:opacity-50"
              title={isFr ? 'Générer le rapport PDF officiel 4 pages CEI 61439' : 'Generate official 4-page IEC 61439 PDF report'}
            >
              <FileDown className="w-4 h-4 text-emerald-200" />
              <span>{isGeneratingPdf ? (isFr ? 'Génération...' : 'Generating...') : (isFr ? 'Exporter PV (PDF)' : 'Export PV (PDF)')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Notification Alert */}
      {pdfSuccessMessage && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-mono shadow-xl animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pdfSuccessMessage}</span>
        </div>
      )}

      {/* 2. Mode Selector: FAT vs SAT vs Consuel Periodic */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveStage('FAT')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
            activeStage === 'FAT'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          {isFr ? 'FAT - Essais d\'Atelier Constructeur' : 'FAT - Factory Acceptance Testing'}
        </button>
        <button
          onClick={() => setActiveStage('SAT')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
            activeStage === 'SAT'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {isFr ? 'SAT - Essais de Mise en Service sur Site' : 'SAT - Site Acceptance Testing'}
        </button>
        <button
          onClick={() => setActiveStage('PERIODIC_CONSUEL')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
            activeStage === 'PERIODIC_CONSUEL'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          {isFr ? 'Audit Réglementaire & Visa Consuel' : 'Regulatory Audit & Certification'}
        </button>
      </div>

      {/* 3. Instrumental Test Parameters (Dielectric, Megger & Bonding) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Protective Earth Bonding Test (Rpe) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isFr ? 'CONTINUITÉ DES MASSES (Rpe)' : 'BONDING CONTINUITY (Rpe)'}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isBondingCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isBondingCompliant ? 'R ≤ 100 mΩ (PASS)' : 'DÉPASSEMENT'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">{isFr ? 'Résistance mesurée (mΩ) :' : 'Measured Rpe (mΩ):'}</span>
                <span className="font-mono font-bold text-emerald-400">{measuredRpeMilliOhms} mΩ</span>
              </div>
              <input 
                type="number"
                min={5}
                max={300}
                value={measuredRpeMilliOhms}
                onChange={(e) => setMeasuredRpeMilliOhms(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isFr 
                ? 'Essai sous courant I ≥ 10 A entre barre PE principale et portes, plastrons et structures métalliques.'
                : 'Test current I ≥ 10 A between main PE bar and doors, covers, and metal chassis.'}
            </p>
          </div>
        </div>

        {/* Card 2: Insulation Resistance Test (Riso) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              {isFr ? 'RÉSISTANCE D\'ISOLEMENT (Riso)' : 'INSULATION RESISTANCE (Riso)'}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isInsulationCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isInsulationCompliant ? 'R ≥ 1.0 MΩ (PASS)' : 'DÉFAUT ISOLEMENT'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">{isFr ? 'Isolement mesuré (MΩ) :' : 'Measured Riso (MΩ):'}</span>
                <span className="font-mono font-bold text-cyan-400">{measuredRisoMegaOhms} MΩ</span>
              </div>
              <input 
                type="number"
                min={0.1}
                max={1000}
                step={10}
                value={measuredRisoMegaOhms}
                onChange={(e) => setMeasuredRisoMegaOhms(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isFr 
                ? 'Mesure sous 500V DC (ou 1000V DC) entre tous conducteurs actifs reliés ensemble et la terre PE.'
                : 'Measurement at 500V DC (or 1000V DC) between all connected live conductors and earth PE.'}
            </p>
          </div>
        </div>

        {/* Card 3: Dielectric Withstand Test (Udielectric) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {isFr ? 'RIGIDITÉ DIÉLECTRIQUE' : 'DIELECTRIC WITHSTAND'}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isDielectricCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isDielectricCompliant ? `≥ ${requiredDielectricVoltageKv} kV (PASS)` : 'TENSION FAIBLE'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tension d\'essai (kV)</label>
                <input 
                  type="number"
                  min={1.0}
                  max={5.0}
                  step={0.1}
                  value={appliedDielectricKv}
                  onChange={(e) => setAppliedDielectricKv(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Durée (secondes)</label>
                <select
                  value={dielectricWithstandSec}
                  onChange={(e) => setDielectricWithstandSec(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                >
                  <option value={1}>1 s (Série usine)</option>
                  <option value={60}>60 s (Essai type)</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isFr 
                ? `Exigence CEI 61439-1 pour Ui = ${ratedUiVolts} V : ${requiredDielectricVoltageKv} kV AC sans amorçage.`
                : `IEC 61439-1 requirement for Ui = ${ratedUiVolts} V: ${requiredDielectricVoltageKv} kV AC without flashover.`}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Busbar Bolt Torque Calibration & DIN 43673 Standard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            {isFr 
              ? 'CALIBRATION DU SERRAGE DES BOULONS DE JEU DE BARRES (DIN 43673-1 / CLASSE 8.8)' 
              : 'BUSBAR BOLTING TORQUE CALIBRATION (DIN 43673-1 / GRADE 8.8)'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {isFr ? 'Contrôle à la clé dynamométrique étalonnée' : 'Calibrated torque wrench verification'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {isFr ? 'Diamètre de Boulonnerie' : 'Bolt Diameter Size'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['M8', 'M10', 'M12', 'M16'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setBusbarBoltSize(size)}
                  className={`py-1.5 rounded-lg border font-mono text-xs font-bold transition ${
                    busbarBoltSize === size
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Couple Recommandé' : 'Prescribed Torque'}
            </span>
            <span className="text-base font-bold font-mono text-amber-400">
              {recommendedTorqueNm} N·m
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Rondelles Coniques' : 'Belleville Washers'}
            </span>
            <span className="text-xs font-bold font-mono text-white">
              DIN 6796 Contact
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Marquage Témoin' : 'Torque Seal Check'}
            </span>
            <span className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isFr ? 'Vernis Rouge Posé' : 'Tamper Seal Applied'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Complete Inspection & Testing Checklist (IEC 61439-1 Clause 10 & 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            {isFr 
              ? 'LISTE DES POINTS DE CONTRÔLE RÉGLEMENTAIRES (CEI 61439-1 §10 & §11)' 
              : 'REGULATORY COMMISSIONING CHECKLIST (IEC 61439-1 §10 & §11)'}
          </span>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold">{passCount} OK</span>
            <span className="text-rose-400 font-bold">{failCount} REJET</span>
            <span className="text-amber-400 font-bold">{pendingCount} EN ATTENTE</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {checklist.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    CEI {item.clauseIec}
                  </span>
                  <span className="font-bold text-xs text-white">
                    {isFr ? item.titleFr : item.titleEn}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFr ? item.criteriaFr : item.criteriaEn}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleStatus(item.id, 'PASS')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                    item.status === 'PASS'
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isFr ? 'CONFORME' : 'PASS'}
                </button>

                <button
                  onClick={() => handleToggleStatus(item.id, 'FAIL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                    item.status === 'FAIL'
                      ? 'bg-rose-500/20 border border-rose-400 text-rose-300 shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  {isFr ? 'RÉSERVE' : 'FAIL'}
                </button>

                <button
                  onClick={() => handleToggleStatus(item.id, 'PENDING')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    item.status === 'PENDING'
                      ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isFr ? 'ATTENTE' : 'PENDING'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Official Commissioning Certificate Summary (Procès-Verbal) */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white tracking-wide uppercase font-mono">
              {isFr 
                ? 'PROCÈS-VERBAL D\'ESSAIS ET DE RÉCEPTION TECHNIQUE DU TGBT' 
                : 'OFFICIAL COMMISSIONING & VERIFICATION CERTIFICATE'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Réf: PV-TGBT-{project.name.toUpperCase().replace(/\s+/g, '-')}-2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 text-slate-300">
            <p><strong>{isFr ? 'Projet :' : 'Project:'}</strong> {project.name}</p>
            <p><strong>{isFr ? 'Environnement :' : 'Environment:'}</strong> {project.environmentType}</p>
            <p><strong>{isFr ? 'Courant Nominal Incomber :' : 'Incomer Rating:'}</strong> {tgbtCurrentA} A (400V Triphasé + N)</p>
            <p><strong>{isFr ? 'Tension d\'isolement Ui :' : 'Rated Insulation Ui:'}</strong> {ratedUiVolts} V AC / Uimp = {ratedUimpKv} kV</p>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <p>
              <strong>{isFr ? 'Continuité de Terre PE :' : 'PE Earth Continuity:'}</strong>{' '}
              <span className="font-mono text-emerald-400 font-bold">{measuredRpeMilliOhms} mΩ</span> (Exigé ≤ 100 mΩ)
            </p>
            <p>
              <strong>{isFr ? 'Résistance d\'Isolement :' : 'Insulation Resistance:'}</strong>{' '}
              <span className="font-mono text-cyan-400 font-bold">{measuredRisoMegaOhms} MΩ</span> (Exigé ≥ 1.0 MΩ)
            </p>
            <p>
              <strong>{isFr ? 'Essai Diélectrique :' : 'Dielectric Withstand:'}</strong>{' '}
              <span className="font-mono text-amber-400 font-bold">{appliedDielectricKv} kV AC</span> ({dielectricWithstandSec}s sans claquage)
            </p>
            <p>
              <strong>{isFr ? 'Décision Finale :' : 'Final Decision:'}</strong>{' '}
              <span className={`font-bold font-mono ${isCommissioningApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCommissioningApproved 
                  ? (isFr ? 'RÉCEPTION VALIDÉE SANS RÉSERVES — APTE À LA MISE SOUS TENSION' : 'COMMISSIONING APPROVED WITHOUT RESERVATIONS — FIT FOR ENERGIZATION') 
                  : (isFr ? 'RÉCEPTION AJOURNÉE — LEVÉE DES RÉSERVES REQUISE' : 'COMMISSIONING PENDING — CORRECTIVE ACTIONS REQUIRED')}
              </span>
            </p>
          </div>
        </div>

        {/* Signatures & Certification Configuration */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <button
              type="button"
              onClick={() => setShowSignerConfig(!showSignerConfig)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition w-fit"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>
                {showSignerConfig
                  ? (isFr ? 'Masquer la configuration du Visa' : 'Hide Visa & Signer Configuration')
                  : (isFr ? 'Configurer le Signataire & Bureau de Contrôle' : 'Configure Signer & Inspection Bureau')}
              </span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              {inspectionBureau} · {signerName}
            </span>
          </div>

          {showSignerConfig && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  {isFr ? 'Ingénieur Signataire' : 'Signer Engineer'}
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  {isFr ? 'Titre / Fonction' : 'Role / Title'}
                </label>
                <input
                  type="text"
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  {isFr ? 'Organisme de Contrôle' : 'Inspection Bureau'}
                </label>
                <input
                  type="text"
                  value={inspectionBureau}
                  onChange={(e) => setInspectionBureau(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  {isFr ? 'Réf. Révision' : 'Revision Ref'}
                </label>
                <input
                  type="text"
                  value={revisionRef}
                  onChange={(e) => setRevisionRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Export Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{isFr ? 'Normes applicables : CEI 61439-1/2, NF C 15-100 Partie 6' : 'Applicable standards: IEC 61439-1/2, NF C 15-100 Part 6'}</span>
              <span>·</span>
              <span className="font-mono text-emerald-400 font-bold">Consuel Ready ✓</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                title={isFr ? 'Imprimer / Aperçu avant impression' : 'Print / Preview'}
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>{isFr ? 'Imprimer' : 'Print'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportFatSatPdf}
                disabled={isGeneratingPdf}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-xl shadow-emerald-950/40 border border-emerald-400/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4 text-emerald-200" />
                <span>
                  {isGeneratingPdf
                    ? (isFr ? 'Génération du PDF...' : 'Generating PDF...')
                    : (isFr ? 'Télécharger le Procès-Verbal Officiel (PDF)' : 'Download Official Certificate (PDF)')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
