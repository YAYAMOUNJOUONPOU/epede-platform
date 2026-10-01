// src/components/visual/InteractiveSldDiagram.tsx
import React, { useState } from 'react';
import {
  Zap,
  Cpu,
  Layers,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Power,
  Save,
  Cloud,
  CloudCheck,
  RotateCcw,
  Lock
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { SldLotoPlaybookModal } from '../diagrams/modules/SldLotoPlaybookModal';

export type SldTopologyType = 
  | 'substation_double_bus' 
  | 'generation_transmission' 
  | 'distribution_feeder' 
  | 'industrial_mcc'
  | 'pv_bess_microgrid';

export interface SldEquipmentDetail {
  tag: string;
  nameFr: string;
  nameEn: string;
  typeFr: string;
  typeEn: string;
  ratedVoltage: string;
  ratedCurrent?: string;
  breakingCapacity?: string;
  standard: string;
  ansiCodes?: string[];
  descriptionFr: string;
  descriptionEn: string;
  maintenanceNoteFr: string;
  maintenanceNoteEn: string;
}

export interface InteractiveSldDiagramProps {
  initialTopology?: SldTopologyType;
  locale: 'fr' | 'en';
  compact?: boolean;
  onSelectEquipment?: (tag: string) => void;
  onSelectStandard?: (standardRef: string) => void;
}

export const InteractiveSldDiagram: React.FC<InteractiveSldDiagramProps> = ({
  initialTopology = 'substation_double_bus',
  locale,
  compact = false,
  onSelectEquipment,
  onSelectStandard,
}) => {
  const [activeTopology, setActiveTopology] = useState<SldTopologyType>(initialTopology);
  const [selectedTag, setSelectedTag] = useState<string | null>('T1');
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [isSavingSld, setIsSavingSld] = useState(false);
  const [justSavedSld, setJustSavedSld] = useState(false);
  const [isLotoOpen, setIsLotoOpen] = useState(false);
  const [interlockAlert, setInterlockAlert] = useState<string | null>(null);

  const { user, sldAnnotations, saveSldAnnotation, signInWithGoogle } = useAuth();

  // Switch states for interactive switching
  const [cbState, setCbState] = useState<Record<string, boolean>>({
    Q0: true,
    Q1: true,
    Q2: false, // Bus coupler or backup bus
    Q51: true,
    Q52: true,
    Q53: true,
  });

  // Sync state from Firestore when activeTopology or annotations update
  React.useEffect(() => {
    const existing = sldAnnotations[activeTopology];
    if (existing && existing.cbStates && Object.keys(existing.cbStates).length > 0) {
      setCbState((prev) => ({
        ...prev,
        ...existing.cbStates,
      }));
    }
  }, [activeTopology, sldAnnotations]);

  const triggerInterlockWarning = (msg: string) => {
    setInterlockAlert(msg);
    setTimeout(() => setInterlockAlert(null), 4000);
  };

  const toggleSwitch = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Safety Interlocking rules (CEI 62271-102)
    if (tag === 'Q1' || tag === 'Q2') {
      // Disconnector cannot open under load if breaker Q0 is closed
      if (cbState.Q0) {
        triggerInterlockWarning(
          locale === 'fr'
            ? 'VERROUILLAGE CEI 62271-102 : Manœuvre du sectionneur interdite sous charge tant que le disjoncteur Q0 est FERMÉ !'
            : 'IEC 62271-102 INTERLOCK: Disconnector operation prohibited under load while circuit breaker Q0 is CLOSED!'
        );
        return;
      }
    }

    setCbState((prev) => {
      const next = {
        ...prev,
        [tag]: !prev[tag],
      };
      return next;
    });
  };

  const handleSaveSldState = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setIsSavingSld(true);
    try {
      await saveSldAnnotation(activeTopology, cbState, `États disjoncteurs pour topologie ${activeTopology}`);
      setJustSavedSld(true);
      setTimeout(() => setJustSavedSld(false), 2500);
    } catch (err) {
      console.error('Failed to sync SLD state:', err);
    } finally {
      setIsSavingSld(false);
    }
  };

  // Detailed apparatus catalog for the inspector drawer
  const EQUIPMENT_DATABASE: Record<string, SldEquipmentDetail> = {
    T1: {
      tag: 'T1',
      nameFr: 'Transformateur de Puissance T1 (225/30 kV - 40 MVA)',
      nameEn: 'Power Transformer T1 (225/30 kV - 40 MVA)',
      typeFr: 'Transformateur Abaisseur immersed in mineral oil',
      typeEn: 'Step-Down Power Transformer',
      ratedVoltage: '225 kV / 30 kV',
      ratedCurrent: '102.6 A (HV) / 770 A (MV)',
      breakingCapacity: 'Ucc = 12.5% · Pertes fer = 22 kW',
      standard: 'CEI 60076-1 / CEI 60076-5',
      ansiCodes: ['87T', '50/51', '51N', '49', '63 (Buchholz)'],
      descriptionFr: 'Transformateur triphasé couplage Dyn11 à refroidissement ONAN/ONAF. Équipé d\'un régleur en charge sous vide (OLTC ±10 × 1.25%) pour maintien rigoureux de la tension HTA à 30 kV.',
      descriptionEn: 'Three-phase Dyn11 power transformer with ONAN/ONAF cooling. Fitted with vacuum on-load tap changer (OLTC ±10 × 1.25%) for strict 30 kV bus voltage regulation.',
      maintenanceNoteFr: 'Analyse chromatographique des gaz dissous (DGA selon CEI 60599) tous les 12 mois. Test diélectrique rigidité huile (> 60 kV).',
      maintenanceNoteEn: 'Dissolved Gas Analysis (DGA per IEC 60599) every 12 months. Oil breakdown dielectric testing (> 60 kV).',
    },
    Q0: {
      tag: 'Q0',
      nameFr: 'Disjoncteur THT 225 kV (SF6)',
      nameEn: '225 kV EHV SF6 Circuit Breaker',
      typeFr: 'Disjoncteur à autosoufflage SF6 triphasé',
      typeEn: 'Three-Phase SF6 Auto-Puffer Circuit Breaker',
      ratedVoltage: '245 kV',
      ratedCurrent: '2500 A',
      breakingCapacity: '40 kA (3s) · I_crête = 100 kA',
      standard: 'CEI 62271-100',
      ansiCodes: ['52', '50BF (Breaker Failure)'],
      descriptionFr: 'Appareil de coupure principal assurant l\'élimination des courts-circuits THT en moins de 50 ms. Commande par ressort hélicoïdal motorisé avec double bobine de déclenchement 110 V CC.',
      descriptionEn: 'Main switching apparatus clearing EHV faults in under 50 ms. Motorized spring operating mechanism with redundant dual trip coils (110 V DC).',
      maintenanceNoteFr: 'Surveillance continue de la densité de gaz SF6 par manostat compensé en température. Mesure de résistance de contact (< 45 µΩ).',
      maintenanceNoteEn: 'Continuous SF6 gas density monitoring via temperature-compensated pressure switch. Contact resistance measurement (< 45 µΩ).',
    },
    Q1: {
      tag: 'Q1',
      nameFr: 'Sectionneur Jeu de Barres 1 (225 kV)',
      nameEn: 'Busbar 1 Disconnector (225 kV)',
      typeFr: 'Sectionneur à ouverture centrale ou semi-pantographe',
      typeEn: 'Center-Break / Semi-Pantograph Disconnector',
      ratedVoltage: '245 kV',
      ratedCurrent: '2500 A',
      breakingCapacity: 'Pouvoir de coupure de courant de transfert de barre (CEI 62271-102)',
      standard: 'CEI 62271-102',
      ansiCodes: ['89'],
      descriptionFr: 'Assure la séparation visuelle galvanique et l\'isolement diélectrique sécurisé entre le jeu de barres BB1 et la travée transformateur. Interverrouillé électromécaniquement avec Q0.',
      descriptionEn: 'Provides galvanic visible clearance and certified dielectric isolation between BB1 busbar and the transformer bay. Electromechanically interlocked with Q0.',
      maintenanceNoteFr: 'Graissage des couteaux de contact argentés et vérification des fins de course moteur tous les 36 mois.',
      maintenanceNoteEn: 'Greasing of silver-plated contact jaws and verification of motorized limit switches every 36 months.',
    },
    TC1: {
      tag: 'TC1',
      nameFr: 'Transformateur de Courant THT (TC)',
      nameEn: 'EHV Current Transformer (CT)',
      typeFr: 'TC de type tête à diélectrique huile-papier ou SF6',
      typeEn: 'Top-Core Oil-Paper / SF6 Current Transformer',
      ratedVoltage: '245 kV (BIL 1050 kV)',
      ratedCurrent: '600-1200 / 1-1-1 A (Multi-enroulements)',
      breakingCapacity: 'Ith = 40 kA (3s) · Idyn = 100 kA',
      standard: 'CEI 61869-2',
      ansiCodes: ['CT'],
      descriptionFr: 'Comporte 4 noyaux secondaires toroïdaux : 2 noyaux de protection (5P20, 30 VA) pour protections différentielle 87T et surintensité 50/51, et 2 noyaux de mesure (Classe 0.2S).',
      descriptionEn: 'Features 4 toroidal secondary cores: 2 protection cores (5P20, 30 VA) for differential 87T and 50/51 overcurrent relays, and 2 revenue metering cores (Class 0.2S).',
      maintenanceNoteFr: 'Mesure de tangente delta (tan δ) de l\'isolation papier-huile et test de saturation de la tension de coude (V_k).',
      maintenanceNoteEn: 'Tan delta (tan δ) dielectric loss measurement and knee-point saturation voltage (V_k) verification.',
    },
    G1: {
      tag: 'G1',
      nameFr: 'Groupe Turbo-Alternateur Synchrone (G1)',
      nameEn: 'Synchronous Turbo-Generator Unit (G1)',
      typeFr: 'Alternateur synchrone à pôles saillants',
      typeEn: 'Salient-Pole Synchronous Alternator',
      ratedVoltage: '15 kV',
      ratedCurrent: '2309 A',
      breakingCapacity: 'Pn = 60 MVA · cosφ = 0.90 · 375 tr/min',
      standard: 'CEI 60034-1',
      ansiCodes: ['87G', '40 (Perte d\'excitation)', '27', '59', '25 (Synchronisme)', '64R'],
      descriptionFr: 'Générateur hydroélectrique entraîné par une turbine Francis. Système d\'excitation brushless statique à thyristors piloté par un régulateur de tension numérique (AVR).',
      descriptionEn: 'Hydroelectric synchronous generator driven by a Francis turbine. Static brushless thyristor excitation system controlled by a digital Automatic Voltage Regulator (AVR).',
      maintenanceNoteFr: 'Inspection endoscopique du bobinage statorique (vernis anti-corona) et mesure de résistance d\'isolement (indice de polarisation IP > 2).',
      maintenanceNoteEn: 'Endoscopic inspection of stator winding (corona shield) and insulation resistance testing (Polarization Index PI > 2).',
    },
    M1: {
      tag: 'M1',
      nameFr: 'Moteur Asynchrone Haute Performance M1',
      nameEn: 'High Performance Induction Motor M1',
      typeFr: 'Moteur triphasé à cage d\'écureuil IE3 / IE4',
      typeEn: 'Three-Phase Squirrel-Cage Induction Motor (IE3/IE4)',
      ratedVoltage: '400 V (Triphasé)',
      ratedCurrent: '430 A',
      breakingCapacity: 'P = 250 kW · 1485 tr/min · cosφ = 0.88',
      standard: 'CEI 60034-30-1',
      ansiCodes: ['49 (Thermique)', '50/51 (Court-circuit)', '46 (Déséquilibre)', '51LR (Rotor bloqué)'],
      descriptionFr: 'Moteur de pompe de recirculation alimenté par variateur de fréquence (VFD) ou départ MCC tiroir débrochable. Équipé de 6 sondes thermiques PT100 insérées dans les encoches stator.',
      descriptionEn: 'Recirculation pump motor fed by Variable Frequency Drive (VFD) or withdrawable MCC drawer. Equipped with 6 embedded PT100 RTDs in the stator slots.',
      maintenanceNoteFr: 'Graissage périodique des roulements et analyse vibratoire selon ISO 10816 (vitesse RMS < 2.8 mm/s).',
      maintenanceNoteEn: 'Periodic bearing relubrication and vibration spectral analysis per ISO 10816 (RMS velocity < 2.8 mm/s).',
    },
  };

  const selectedEquipment = selectedTag ? (EQUIPMENT_DATABASE[selectedTag] || EQUIPMENT_DATABASE['T1']) : null;

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#0A0E17] text-slate-100 overflow-hidden shadow-2xl font-mono">
      
      {/* 1. TOP HEADER & TOPOLOGY SELECTOR */}
      <div className="bg-[#050810] border-b border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              SCHÉMA UNIFILAIRE INTERACTIF (SLD)
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs">CEI 60617 / IEEE 315</span>
          </div>
          <h3 className="text-base font-bold text-white font-sans">
            {locale === 'fr'
              ? 'Topologie Réseau & Visualisation de Puissance Active'
              : 'Network Topology & Active Power-Flow Single-Line'}
          </h3>
        </div>

        {/* Topology Selector & Cloud Sync Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'substation_double_bus', labelFr: 'Poste Double Jeu de Barres', labelEn: 'Double Busbar Substation' },
              { id: 'generation_transmission', labelFr: 'Centrale → Transport', labelEn: 'Generation → EHV Grid' },
              { id: 'distribution_feeder', labelFr: 'Départ HTA → Postes HTA/BT', labelEn: 'MV Feeder → Substations' },
              { id: 'industrial_mcc', labelFr: 'MCC & Moteurs Industriels', labelEn: 'Industrial MCC & Drives' },
            ].map((top) => (
              <button
                key={top.id}
                type="button"
                onClick={() => setActiveTopology(top.id as SldTopologyType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTopology === top.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {locale === 'fr' ? top.labelFr : top.labelEn}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* LOTO Safety Interlocking Playbook Button */}
          <button
            type="button"
            onClick={() => setIsLotoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border whitespace-nowrap cursor-pointer bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-amber-500/40"
            title={locale === 'fr' ? 'Ouvrir les protocoles de manœuvre et consignation LOTO' : 'Open LOTO switching & lockout protocols'}
          >
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Playbook LOTO' : 'LOTO Playbook'}</span>
          </button>

          {/* Cloud Sync Breaker Switching Button */}
          <button
            type="button"
            onClick={handleSaveSldState}
            disabled={isSavingSld}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border whitespace-nowrap cursor-pointer ${
              justSavedSld
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 border-cyan-700/60'
            }`}
            title={locale === 'fr' ? 'Sauvegarder l\'état des disjoncteurs dans Firestore' : 'Sync breaker states to Firestore'}
          >
            {justSavedSld ? (
              <>
                <CloudCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{locale === 'fr' ? 'Synchronisé !' : 'Synced!'}</span>
              </>
            ) : (
              <>
                <Cloud className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isSavingSld ? '...' : locale === 'fr' ? 'Sync Schéma Cloud' : 'Sync SLD Cloud'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety Interlock Warning Banner */}
      {interlockAlert && (
        <div className="mx-4 sm:mx-6 mt-3 px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-between text-rose-200 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="font-bold">{interlockAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setInterlockAlert(null)}
            className="text-rose-400 hover:text-white text-xs px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE: VECTOR SLD CANVAS + EQUIPMENT DOSSIER DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-800">
        
        {/* SLD Canvas (Col 8) */}
        <div className="lg:col-span-8 p-4 sm:p-6 bg-[#080D1A] flex flex-col justify-between border-r border-slate-800/80">
          
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cliquez sur un appareil pour ouvrir son dossier d'ingénierie</span>
            </span>
            <span className="text-[11px] text-amber-400 font-bold">
              {cbState.Q0 ? 'Circuit en charge (Puissance Active: 38.4 MW)' : 'Disjoncteur Q0 Ouvert (Aucun transit)'}
            </span>
          </div>

          {/* SVG Vector SLD Canvas */}
          <div className="w-full bg-[#050810] rounded-xl border border-slate-800 p-4 relative overflow-hidden shadow-inner flex items-center justify-center min-h-[360px]">
            
            {/* TOPOLOGY 1: DOUBLE BUSBAR SUBSTATION */}
            {activeTopology === 'substation_double_bus' && (
              <svg viewBox="0 0 700 360" className="w-full h-auto text-slate-200">
                {/* Busbar 1 (225 kV BB1) */}
                <line x1="40" y1="40" x2="660" y2="40" stroke="#ef4444" strokeWidth="5" />
                <text x="50" y="32" fill="#fca5a5" fontSize="11" fontWeight="bold">JEU DE BARRES 1 (BB1) — 225 kV</text>

                {/* Busbar 2 (225 kV BB2) */}
                <line x1="40" y1="80" x2="660" y2="80" stroke="#f97316" strokeWidth="5" />
                <text x="50" y="72" fill="#fdba74" fontSize="11" fontWeight="bold">JEU DE BARRES 2 (BB2) — 225 kV (RÉSERVE)</text>

                {/* Bay 1: Transformer Feeder Bay */}
                {/* Disconnector Q1 to BB1 */}
                <g
                  transform="translate(240, 40)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('Q1')}
                  onMouseEnter={() => setHoveredTag('Q1')}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <line x1="0" y1="0" x2="0" y2="20" stroke="#ef4444" strokeWidth="2.5" />
                  <line
                    x1="0"
                    y1="20"
                    x2={cbState.Q1 ? '0' : '14'}
                    y2={cbState.Q1 ? '40' : '26'}
                    stroke={cbState.Q1 ? '#10b981' : '#f43f5e'}
                    strokeWidth="3"
                  />
                  <circle cx="0" cy="20" r="3" fill="#cbd5e1" />
                  <circle cx="0" cy="40" r="3" fill="#cbd5e1" />
                  <text x="18" y="34" fill={selectedTag === 'Q1' ? '#38bdf8' : '#94a3b8'} fontSize="10" fontWeight="bold">
                    Q1 (89A)
                  </text>
                  <rect x="-10" y="10" width="80" height="35" fill="transparent" />
                </g>

                {/* Disconnector Q2 to BB2 */}
                <g
                  transform="translate(300, 80)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('Q1')}
                >
                  <line x1="0" y1="0" x2="0" y2="15" stroke="#f97316" strokeWidth="2" />
                  <line x1="0" y1="15" x2="14" y2="22" stroke="#f43f5e" strokeWidth="3" />
                  <circle cx="0" cy="15" r="3" fill="#cbd5e1" />
                  <circle cx="0" cy="35" r="3" fill="#cbd5e1" />
                  <text x="18" y="28" fill="#94a3b8" fontSize="10">Q2 (89B)</text>
                </g>

                {/* Common Bay Node after Disconnectors */}
                <path d="M 240 80 L 240 115 L 270 115 L 270 135" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
                <path d="M 300 115 L 240 115" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />

                {/* Circuit Breaker Q0 */}
                <g
                  transform="translate(270, 135)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('Q0')}
                  onMouseEnter={() => setHoveredTag('Q0')}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <rect
                    x="-18"
                    y="0"
                    width="36"
                    height="32"
                    fill={cbState.Q0 ? '#065f46' : '#881337'}
                    stroke={selectedTag === 'Q0' ? '#38bdf8' : (cbState.Q0 ? '#34d399' : '#f43f5e')}
                    strokeWidth={selectedTag === 'Q0' ? '3' : '2'}
                    rx="4"
                  />
                  <line x1="-10" y1="16" x2="10" y2="16" stroke="#ffffff" strokeWidth="3" />
                  <text x="24" y="16" fill={selectedTag === 'Q0' ? '#38bdf8' : '#ffffff'} fontSize="11" fontWeight="bold">
                    Q0 — Disjoncteur SF6 (52)
                  </text>
                  <text x="24" y="28" fill={cbState.Q0 ? '#34d399' : '#f43f5e'} fontSize="9">
                    {cbState.Q0 ? '[FERMÉ]' : '[OUVERT]'}
                  </text>
                </g>

                {/* Current Transformer TC1 */}
                <g
                  transform="translate(270, 175)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('TC1')}
                >
                  <line x1="0" y1="-8" x2="0" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
                  <circle cx="0" cy="8" r="7" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="0" cy="14" r="7" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="18" y="14" fill="#38bdf8" fontSize="10">TC1 (600/1 A)</text>
                </g>

                {/* Power Transformer T1 */}
                <g
                  transform="translate(270, 220)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('T1')}
                  onMouseEnter={() => setHoveredTag('T1')}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <line x1="0" y1="-18" x2="0" y2="0" stroke="#cbd5e1" strokeWidth="2.5" />
                  <circle
                    cx="0"
                    cy="14"
                    r="16"
                    fill="none"
                    stroke={selectedTag === 'T1' ? '#38bdf8' : '#fbbf24'}
                    strokeWidth={selectedTag === 'T1' ? '3.5' : '2.5'}
                  />
                  <circle
                    cx="0"
                    cy="32"
                    r="16"
                    fill="none"
                    stroke={selectedTag === 'T1' ? '#38bdf8' : '#fbbf24'}
                    strokeWidth={selectedTag === 'T1' ? '3.5' : '2.5'}
                  />
                  <text x="24" y="20" fill={selectedTag === 'T1' ? '#38bdf8' : '#fbbf24'} fontSize="11" fontWeight="bold">
                    T1 — 40 MVA (225/30 kV)
                  </text>
                  <text x="24" y="34" fill="#94a3b8" fontSize="10">Dyn11 · OLTC</text>
                </g>

                {/* Outgoing to 30 kV Bus */}
                <line x1="270" y1="268" x2="270" y2="310" stroke="#eab308" strokeWidth="3" />
                <line x1="60" y1="310" x2="640" y2="310" stroke="#eab308" strokeWidth="5" />
                <text x="70" y="330" fill="#fde047" fontSize="11" fontWeight="bold">JEU DE BARRES 30 kV (HTA)</text>

                {/* 3 outgoing feeders */}
                {[140, 360, 520].map((x, idx) => (
                  <g key={idx} transform={`translate(${x}, 310)`}>
                    <line x1="0" y1="0" x2="0" y2="15" stroke="#eab308" strokeWidth="2.5" />
                    <rect x="-10" y="15" width="20" height="18" fill="#065f46" stroke="#34d399" strokeWidth="1.5" rx="2" />
                    <line x1="0" y1="33" x2="0" y2="45" stroke="#38bdf8" strokeWidth="2" />
                    <polygon points="-4,45 4,45 0,52" fill="#38bdf8" />
                    <text x="-25" y="48" fill="#94a3b8" fontSize="9">Départ {idx + 1}</text>
                  </g>
                ))}
              </svg>
            )}

            {/* TOPOLOGY 2: GENERATION TO TRANSMISSION */}
            {activeTopology === 'generation_transmission' && (
              <svg viewBox="0 0 700 320" className="w-full h-auto text-slate-200">
                {/* Generator G1 */}
                <g
                  transform="translate(100, 160)"
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('G1')}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="#1e1b4b"
                    stroke={selectedTag === 'G1' ? '#38bdf8' : '#818cf8'}
                    strokeWidth="3"
                  />
                  <text x="-8" y="6" fill="#c7d2fe" fontSize="16" fontWeight="bold">G</text>
                  <text x="-40" y="52" fill="#c7d2fe" fontSize="11" fontWeight="bold">G1 (60 MVA - 15 kV)</text>
                  <text x="-35" y="65" fill="#94a3b8" fontSize="10">Hydro Nachtigal</text>
                </g>

                {/* 15 kV Busduct to GCB */}
                <line x1="134" y1="160" x2="220" y2="160" stroke="#38bdf8" strokeWidth="5" />

                {/* Generator Circuit Breaker (GCB) */}
                <g transform="translate(220, 160)" className="cursor-pointer" onClick={() => setSelectedTag('Q0')}>
                  <rect x="0" y="-18" width="36" height="36" fill="#065f46" stroke="#34d399" strokeWidth="2" rx="4" />
                  <text x="4" y="5" fill="#ffffff" fontSize="11" fontWeight="bold">GCB</text>
                  <text x="-10" y="-24" fill="#34d399" fontSize="10">Disjoncteur G1</text>
                </g>

                {/* GSU Step-Up Transformer (15/225 kV) */}
                <g transform="translate(340, 160)" className="cursor-pointer" onClick={() => setSelectedTag('T1')}>
                  <line x1="-84" y1="0" x2="0" y2="0" stroke="#38bdf8" strokeWidth="4" />
                  <circle cx="20" cy="0" r="20" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <circle cx="50" cy="0" r="20" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <text x="5" y="42" fill="#fda4af" fontSize="11" fontWeight="bold">GSU 15/225 kV</text>
                  <text x="15" y="55" fill="#94a3b8" fontSize="10">70 MVA YNd11</text>
                </g>

                {/* High Voltage 225 kV Busbar */}
                <line x1="410" y1="160" x2="480" y2="160" stroke="#ef4444" strokeWidth="4" />
                <line x1="480" y1="60" x2="480" y2="260" stroke="#ef4444" strokeWidth="6" />
                <text x="490" y="80" fill="#fca5a5" fontSize="11" fontWeight="bold">POSTE ÉVACUATION 225 kV</text>

                {/* Outgoing Transmission Lines to Bekoko & Yaoundé */}
                <line x1="480" y1="110" x2="650" y2="110" stroke="#ef4444" strokeWidth="3" />
                <polygon points="650,105 665,110 650,115" fill="#ef4444" />
                <text x="500" y="102" fill="#fda4af" fontSize="10">Ligne 225 kV vers Bekoko (L1)</text>

                <line x1="480" y1="210" x2="650" y2="210" stroke="#ef4444" strokeWidth="3" />
                <polygon points="650,205 665,210 650,215" fill="#ef4444" />
                <text x="500" y="202" fill="#fda4af" fontSize="10">Ligne 225 kV vers Oyomabang (L2)</text>
              </svg>
            )}

            {/* TOPOLOGY 4: INDUSTRIAL MCC & MOTORS */}
            {activeTopology === 'industrial_mcc' && (
              <svg viewBox="0 0 700 320" className="w-full h-auto text-slate-200">
                {/* 400V TGBT Incomer */}
                <line x1="50" y1="60" x2="650" y2="60" stroke="#10b981" strokeWidth="6" />
                <text x="60" y="48" fill="#6ee7b7" fontSize="12" fontWeight="bold">JEU DE BARRES TGBT 400 V (3200 A - 50 kA 1s)</text>

                {/* 3 Motor Drawers in MCC */}
                {/* Motor 1: VFD */}
                <g transform="translate(140, 60)" className="cursor-pointer" onClick={() => setSelectedTag('M1')}>
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="2.5" />
                  <rect x="-15" y="25" width="30" height="24" fill="#065f46" stroke="#34d399" strokeWidth="1.5" rx="2" />
                  <rect x="-24" y="60" width="48" height="34" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="3" />
                  <text x="-16" y="82" fill="#c7d2fe" fontSize="10" fontWeight="bold">VFD</text>
                  <circle cx="0" cy="130" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="-6" y="136" fill="#38bdf8" fontSize="13" fontWeight="bold">M</text>
                  <text x="-40" y="168" fill="#ffffff" fontSize="11" fontWeight="bold">M1 — 250 kW</text>
                  <text x="-35" y="180" fill="#94a3b8" fontSize="9">Pompe Chaudière</text>
                </g>

                {/* Motor 2: Soft Starter */}
                <g transform="translate(350, 60)" className="cursor-pointer" onClick={() => setSelectedTag('M1')}>
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="2.5" />
                  <rect x="-15" y="25" width="30" height="24" fill="#065f46" stroke="#34d399" strokeWidth="1.5" rx="2" />
                  <rect x="-24" y="60" width="48" height="34" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
                  <text x="-20" y="82" fill="#fcd34d" fontSize="9" fontWeight="bold">DÉMARREUR</text>
                  <circle cx="0" cy="130" r="22" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
                  <text x="-6" y="136" fill="#fbbf24" fontSize="13" fontWeight="bold">M</text>
                  <text x="-40" y="168" fill="#ffffff" fontSize="11" fontWeight="bold">M2 — 160 kW</text>
                  <text x="-35" y="180" fill="#94a3b8" fontSize="9">Compresseur Air</text>
                </g>

                {/* Motor 3: Direct-on-line (DOL) */}
                <g transform="translate(540, 60)" className="cursor-pointer" onClick={() => setSelectedTag('M1')}>
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="2.5" />
                  <rect x="-15" y="25" width="30" height="24" fill="#065f46" stroke="#34d399" strokeWidth="1.5" rx="2" />
                  <circle cx="0" cy="130" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                  <text x="-6" y="136" fill="#10b981" fontSize="13" fontWeight="bold">M</text>
                  <text x="-35" y="168" fill="#ffffff" fontSize="11" fontWeight="bold">M3 — 45 kW</text>
                  <text x="-30" y="180" fill="#94a3b8" fontSize="9">Ventilateur Tour</text>
                </g>
              </svg>
            )}

            {/* TOPOLOGY 3: MV DISTRIBUTION FEEDER */}
            {activeTopology === 'distribution_feeder' && (
              <svg viewBox="0 0 700 320" className="w-full h-auto text-slate-200">
                {/* 30 kV Substation Incomer */}
                <line x1="40" y1="40" x2="660" y2="40" stroke="#f59e0b" strokeWidth="5" />
                <text x="50" y="30" fill="#fde047" fontSize="11" fontWeight="bold">POSTE SOURCE — DÉPART 30 kV (CÂBLE SOUTERRAIN 3×240 mm²)</text>

                {/* Substation 1: Ring Main Unit (RMU) */}
                <g transform="translate(180, 40)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke="#f59e0b" strokeWidth="3" />
                  <rect x="-35" y="50" width="70" height="50" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="4" />
                  <text x="-25" y="70" fill="#38bdf8" fontSize="10" fontWeight="bold">RMU 1</text>
                  <text x="-30" y="88" fill="#94a3b8" fontSize="9">Cellule Arrivée</text>
                  {/* Transformer 1 */}
                  <circle cx="0" cy="140" r="16" fill="none" stroke="#eab308" strokeWidth="2" />
                  <circle cx="0" cy="162" r="16" fill="none" stroke="#eab308" strokeWidth="2" />
                  <text x="-40" y="195" fill="#fde047" fontSize="10" fontWeight="bold">Poste 630 kVA</text>
                  <text x="-30" y="208" fill="#94a3b8" fontSize="9">Hôpital Régional</text>
                </g>

                {/* Feeder trunk cable */}
                <line x1="180" y1="75" x2="480" y2="75" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,3" />

                {/* Substation 2: Industrial Client RMU */}
                <g transform="translate(480, 40)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke="#f59e0b" strokeWidth="3" />
                  <rect x="-35" y="50" width="70" height="50" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="4" />
                  <text x="-25" y="70" fill="#10b981" fontSize="10" fontWeight="bold">RMU 2</text>
                  <text x="-30" y="88" fill="#94a3b8" fontSize="9">Client Industriel</text>
                  {/* Transformer 2 */}
                  <circle cx="0" cy="140" r="16" fill="none" stroke="#eab308" strokeWidth="2" />
                  <circle cx="0" cy="162" r="16" fill="none" stroke="#eab308" strokeWidth="2" />
                  <text x="-40" y="195" fill="#fde047" fontSize="10" fontWeight="bold">Poste 1250 kVA</text>
                  <text x="-25" y="208" fill="#94a3b8" fontSize="9">Zone Portuaire</text>
                </g>
              </svg>
            )}
          </div>

          {/* Interactive Legend Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Fermé / En service
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                Ouvert / Déclenché
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                Régleur OLTC
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Symboles normalisés selon norme internationale CEI 60617
            </span>
          </div>
        </div>

        {/* Selected Equipment Deep Engineering Dossier Drawer (Col 4) */}
        <div className="lg:col-span-4 p-5 bg-[#050810] flex flex-col justify-between space-y-5">
          {selectedEquipment ? (
            <div className="space-y-4">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                  FICHE TECHNIQUE · {selectedEquipment.tag}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {selectedEquipment.standard}
                </span>
              </div>

              {/* Title & Type */}
              <div>
                <h4 className="text-base font-bold text-white font-sans">
                  {locale === 'fr' ? selectedEquipment.nameFr : selectedEquipment.nameEn}
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {locale === 'fr' ? selectedEquipment.typeFr : selectedEquipment.typeEn}
                </div>
              </div>

              {/* Physical Ratings Table */}
              <div className="p-3.5 rounded-xl bg-[#080D1A] border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">Tension assignée (Ur) :</span>
                  <span className="font-bold text-amber-400">{selectedEquipment.ratedVoltage}</span>
                </div>
                {selectedEquipment.ratedCurrent && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Courant assigné (Ir) :</span>
                    <span className="font-bold text-cyan-400">{selectedEquipment.ratedCurrent}</span>
                  </div>
                )}
                {selectedEquipment.breakingCapacity && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Tenue Court-Circuit :</span>
                    <span className="font-bold text-white">{selectedEquipment.breakingCapacity}</span>
                  </div>
                )}
              </div>

              {/* Associated ANSI Protection Relays */}
              {selectedEquipment.ansiCodes && selectedEquipment.ansiCodes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">
                    {locale === 'fr' ? 'FONCTIONS DE PROTECTION ASSOCIÉES (ANSI) :' : 'ASSOCIATED ANSI PROTECTION RELAYS:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEquipment.ansiCodes.map((ansi, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold"
                      >
                        ANSI {ansi}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engineering Description */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">
                  {locale === 'fr' ? 'RÔLE PHYSIQUE DANS LE SYSTÈME :' : 'PHYSICAL SYSTEM ROLE:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {locale === 'fr' ? selectedEquipment.descriptionFr : selectedEquipment.descriptionEn}
                </p>
              </div>

              {/* Maintenance & Field Commissioning Note */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed font-sans space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  MAINTENANCE PRÉDICTIVE & ESSAIS :
                </div>
                <div>
                  {locale === 'fr' ? selectedEquipment.maintenanceNoteFr : selectedEquipment.maintenanceNoteEn}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Sélectionnez un appareil sur le schéma
            </div>
          )}

          {/* Direct CTA to Equipment Explorer */}
          {selectedEquipment && onSelectEquipment && (
            <button
              type="button"
              onClick={() => onSelectEquipment(selectedEquipment.tag)}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>{locale === 'fr' ? 'Ouvrir la fiche équipement complète' : 'Open Full Equipment Dossier'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* LOTO Playbook Modal */}
      <SldLotoPlaybookModal
        isOpen={isLotoOpen}
        onClose={() => setIsLotoOpen(false)}
        locale={locale}
        currentTopology={activeTopology === 'substation_double_bus' ? 'double_bus' : 'breaker_and_half'}
      />
    </div>
  );
};
