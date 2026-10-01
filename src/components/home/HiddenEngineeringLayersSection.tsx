// src/components/home/HiddenEngineeringLayersSection.tsx
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Radio, 
  Lock, 
  Zap, 
  Anchor, 
  ShieldCheck, 
  BookOpen, 
  Wrench, 
  CheckCircle2, 
  UserCheck, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface HiddenEngineeringLayersSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: any) => void;
}

interface LayerItem {
  id: string;
  nameFr: string;
  nameEn: string;
  icon: React.ReactNode;
  sequenceFr: string[];
  sequenceEn: string[];
  descriptionFr: string;
  descriptionEn: string;
  keyStandard: string;
  relatedView: string;
}

const LAYERS: LayerItem[] = [
  {
    id: 'protection',
    nameFr: 'Protection & Sélectivité',
    nameEn: 'Protection & Selectivity',
    icon: <ShieldAlert className="h-4 w-4 text-rose-600" />,
    sequenceFr: ['TC / TP (Réducteurs de Mesure)', 'Relais Numérique (ANSI 87T/50/51)', 'Circuit de Déclenchement 110 V DC', 'Bobine & Disjoncteur SF6', 'Élimination du Court-Circuit (< 60 ms)'],
    sequenceEn: ['CT / VT Instrument Transducers', 'Numerical Protection Relay (87T/50/51)', '110 V DC Trip Circuit', 'Trip Coil & SF6 Breaker Mechanism', 'Fault Clearance Isolation (< 60 ms)'],
    descriptionFr: 'Détection instantanée des surintensités et défauts différentiels pour isoler la travée en défaut tout en préservant le reste du réseau.',
    descriptionEn: 'High-speed detection of overcurrents and differential faults to isolate faulted zone while preserving remaining healthy network.',
    keyStandard: 'CEI 60255 / IEEE C37.90',
    relatedView: 'diagrams',
  },
  {
    id: 'automation',
    nameFr: 'Automatisme & Contrôle',
    nameEn: 'Automation & Control',
    icon: <Cpu className="h-4 w-4 text-sky-600" />,
    sequenceFr: ['Capteurs Procédé (Position / Pression)', 'Automate / IED Contrôleur de Travée', 'Système de Contrôle Commande (SAS)', 'Serveur SCADA & Frontal de Téléconduite', 'Interface Homme-Machine (IHM Dispatcher)'],
    sequenceEn: ['Process Sensors (Position / Pressure)', 'Bay Controller Unit (BCU) / IED', 'Substation Automation System (SAS)', 'SCADA Server & Telecontrol Gateway', 'Human-Machine Interface (Dispatcher HMI)'],
    descriptionFr: 'Acquisition en continu des états d\'appareillages, asservissements d\'interverrouillages et régulation automatique sous charge OLTC.',
    descriptionEn: 'Continuous status acquisition, software interlocking sequences, and automatic on-load tap changer voltage regulation.',
    keyStandard: 'CEI 61850-7 / CEI 61131',
    relatedView: 'diagrams',
  },
  {
    id: 'measurement',
    nameFr: 'Instrumentation & Mesure',
    nameEn: 'Instrumentation & Measurement',
    icon: <Activity className="h-4 w-4 text-blue-600" />,
    sequenceFr: ['Transformateurs de Courant Classe 0.2S', 'Transducteurs Numériques U, I, P, Q, F', 'Centrale de Mesure & Compteur Tarifaire', 'Analyseur de Qualité d\'Énergie (THD)', 'Historisation & Base Temporelle GPS'],
    sequenceEn: ['Class 0.2S Current Transformers', 'Digital U, I, P, Q, F Transducers', 'Multifunction Meter & Billing Unit', 'Power Quality Analyzer (Class A)', 'Historian & GPS Time Synchronization'],
    descriptionFr: 'Mesure de précision des puissances actives et réactives pour l\'équilibrage du réseau et le comptage transactionnel.',
    descriptionEn: 'Precision metering of active and reactive energy flows for grid dispatch balancing and fiscal metering.',
    keyStandard: 'CEI 62053 / CEI 61000-4-30',
    relatedView: 'calculators',
  },
  {
    id: 'communication',
    nameFr: 'Télécommunications Réseau',
    nameEn: 'Communication & Networks',
    icon: <Radio className="h-4 w-4 text-purple-600" />,
    sequenceFr: ['IED de Poste (IEC 61850 GOOSE)', 'Réseau Ethernet Station PRP / HSR', 'Passerelle Téléconduite CEI 60870-5-104', 'Liaison FO OPGW / Faisceau Hertzien', 'Centre National de Conduite (Dispatching)'],
    sequenceEn: ['Bay IEDs (IEC 61850 GOOSE/MMS)', 'Station Ethernet Redundant PRP/HSR', 'Telecontrol Gateway IEC 60870-5-104', 'OPGW Fiber Optic / Microwave Link', 'National Dispatch Center (EMS/SCADA)'],
    descriptionFr: 'Transmission redondante sans perte de paquets des ordres de télé-conduite et des messages ultra-rapides GOOSE (< 4 ms).',
    descriptionEn: 'Zero-loss redundant transmission of remote control commands and high-speed GOOSE peer-to-peer trip signals (< 4 ms).',
    keyStandard: 'CEI 61850-8-1 / CEI 60870-5-104',
    relatedView: 'context-stack',
  },
  {
    id: 'safety',
    nameFr: 'Sécurité Électrique & Consignation',
    nameEn: 'Electrical Safety & LOTO',
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
    sequenceFr: ['Séparation Visible (Ouverture Sectionneurs)', 'Condamnation & Verrouillage (Cadenas)', 'Vérification d\'Absence de Tension (VAT)', 'Mise à la Terre & Court-Circuit (MALT)', 'Délivrance de l\'Autorisation de Travail'],
    sequenceEn: ['Visible Isolation (Open Disconnectors)', 'Lockout / Tagout Mechanical Padlocking', 'Absence of Voltage Verification (VAT)', 'Portable Earthing & Short-Circuiting', 'Issuance of Safety Work Permit'],
    descriptionFr: 'Protocoles stricts de mise en sécurité des ouvrages électriques avant toute intervention humaine sur jeux de barres ou lignes.',
    descriptionEn: 'Rigorous 5-step safety and isolation procedures before maintenance personnel touch HV conductors.',
    keyStandard: 'NF C 18-510 / CEI 61936-1',
    relatedView: 'diagrams',
  },
  {
    id: 'standards',
    nameFr: 'Normes & Exigences Techniques',
    nameEn: 'Standards & Requirements',
    icon: <BookOpen className="h-4 w-4 text-amber-600" />,
    sequenceFr: ['Prescriptions Fondamentales CEI / IEEE', 'Cahier des Charges Techniques Particulières (CCTP)', 'Essais de Type en Laboratoire Indépendant (KEMA)', 'Essais de Réception Usine & Site (FAT/SAT)', 'Conformité au Code Réseau Réglementaire'],
    sequenceEn: ['Foundational IEC / IEEE Requirements', 'Project Technical Specifications', 'Type Testing at Certified Lab (KEMA)', 'Factory & Site Acceptance Tests (FAT/SAT)', 'Grid Code Compliance Verification'],
    descriptionFr: 'Cadre normatif garantissant l\'interopérabilité, la tenue aux courts-circuits et la sécurité sur la durée de vie des ouvrages.',
    descriptionEn: 'Normative framework ensuring interoperability, short-circuit withstand rating, and multi-decade asset safety.',
    keyStandard: 'CEI / IEEE / NF / Grid Code',
    relatedView: 'standards',
  },
  {
    id: 'maintenance',
    nameFr: 'Maintenance & Fiabilité',
    nameEn: 'Maintenance & Reliability',
    icon: <Wrench className="h-4 w-4 text-slate-700" />,
    sequenceFr: ['Surveillance en Ligne (DGA Huile, Pression SF6)', 'Analyse des Modes de Défaillance (FMEA)', 'Thermographie Infrarouge & Décharges Partielles', 'Maintenance Prévisionnelle Basée sur l\'État', 'Remplacement Préventif selon MTBF'],
    sequenceEn: ['Online DGA Oil Monitoring & SF6 Pressure', 'Failure Modes & Effects Analysis (FMEA)', 'Infrared Thermography & Partial Discharge', 'Condition-Based Predictive Maintenance', 'Scheduled Overhaul per MTBF Lifespan'],
    descriptionFr: 'Suivi de santé des actifs haute tension pour prévenir les défaillances catastrophiques et allonger la durée de vie utile.',
    descriptionEn: 'Asset health monitoring to prevent catastrophic transformer or breaker failures and optimize overhaul intervals.',
    keyStandard: 'CEI 60076-7 / IEEE C57.104',
    relatedView: 'equipment',
  },
  {
    id: 'roles',
    nameFr: 'Rôles & Compétences d\'Ingénierie',
    nameEn: 'Engineering Roles & Skills',
    icon: <UserCheck className="h-4 w-4 text-indigo-600" />,
    sequenceFr: ['Ingénieur Études Réseau (Power Factory, ETAP)', 'Spécialiste Protection & Sélectivité Relais', 'Ingénieur Projets Postes & Lignes HTB', 'Technicien Essais & Mise en Service (Commissioning)', 'Opérateur de Conduite & Dispatcher National'],
    sequenceEn: ['Grid Studies Engineer (Load Flow / Faults)', 'Protection & Selectivity Relay Specialist', 'Substation & HV Line Project Engineer', 'Testing & Commissioning Field Engineer', 'System Operator & National Dispatcher'],
    descriptionFr: 'Cartographie des métiers spécialisés requis pour concevoir, modéliser, construire, exploiter et maintenir le réseau.',
    descriptionEn: 'Mapping of specialized technical roles required to plan, simulate, construct, dispatch, and maintain the grid.',
    keyStandard: 'Ingénierie CIGRE / IEEE PES',
    relatedView: 'roles',
  }
];

export const HiddenEngineeringLayersSection: React.FC<HiddenEngineeringLayersSectionProps> = ({
  locale,
  onNavigateView,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('protection');
  const activeLayer = LAYERS.find((l) => l.id === selectedLayerId) || LAYERS[0];

  return (
    <section 
      id="hidden-engineering-layers" 
      aria-label="The Hidden Engineering Layers"
      className="relative rounded-3xl bg-gradient-to-b from-[#060B18]/95 via-[#040813]/95 to-[#02050D]/95 text-slate-100 border border-white/[0.08] p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Specular top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
          <h2 className="font-tech font-bold text-xs uppercase tracking-widest text-cyan-400/90">
            {locale === 'fr' 
              ? 'L\'ÉNERGIE N\'EST QUE LA COUCHE VISIBLE' 
              : 'ENERGY FLOW IS ONLY THE VISIBLE LAYER'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
          {locale === 'fr' 
            ? 'Les Couches d\'Ingénierie Invisibles' 
            : 'The Hidden Engineering Layers'}
        </h3>
        <p className="text-sm text-slate-300/90 max-w-3xl leading-relaxed">
          {locale === 'fr'
            ? 'Le courant circule dans les conducteurs, mais ce sont les couches d\'ingénierie qui le rendent sûr, mesurable, pilotable et durable. Sélectionnez une couche pour révéler sa chaîne technique.'
            : 'Power flows through copper and aluminum conductors, but it is the invisible engineering layers that make it safe, metered, controllable, and reliable. Select a layer to trace its sequence.'}
        </p>
      </div>

      {/* Central Physical Energy Flow Pipeline (Visual Anchor) */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-[#050B16]/80 border border-white/[0.07] space-y-3 backdrop-blur-xl shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-tech font-bold uppercase text-amber-400/95 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {locale === 'fr' ? 'Dorsale Physique Visible :' : 'Visible Physical Energy Flow:'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            P = √3 · U · I · cos φ
          </span>
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-white overflow-x-auto py-1 gap-2.5">
          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 font-bold font-tech shadow-sm">
            {locale === 'fr' ? '1. Production' : '1. Generation'}
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 font-bold font-tech shadow-sm">
            {locale === 'fr' ? '2. Transport THT' : '2. Transmission'}
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 font-bold font-tech shadow-sm">
            {locale === 'fr' ? '3. Postes Sources' : '3. Substations'}
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 font-bold font-tech shadow-sm">
            {locale === 'fr' ? '4. Distribution HTA' : '4. Distribution'}
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 font-bold font-tech shadow-sm">
            {locale === 'fr' ? '5. Usages & Charges' : '5. Loads & Use'}
          </span>
        </div>
      </div>

      {/* Interactive Layer Selection Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {LAYERS.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setSelectedLayerId(layer.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border shadow-sm active:scale-[0.98] ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white border-sky-400/80 shadow-[0_0_16px_rgba(14,165,233,0.3)] ring-2 ring-sky-500/25'
                  : 'bg-white/[0.03] text-slate-300 border-white/[0.07] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]'
              }`}
            >
              <span>{layer.icon}</span>
              <span className="font-tech tracking-wide">{locale === 'fr' ? layer.nameFr : layer.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Layer Technical Chain Breakdown */}
      <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#070D1C]/90 to-[#040812]/95 border border-white/[0.08] space-y-6 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-sky-400 font-tech font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'CHAÎNE TECHNIQUE SPÉCIFIQUE' : 'SPECIFIC ENGINEERING SEQUENCE'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="px-2.5 py-0.5 rounded bg-white/[0.05] text-slate-200 border border-white/[0.08] font-bold font-mono text-[11px]">
                {activeLayer.keyStandard}
              </span>
            </div>
            <h4 className="text-xl font-bold text-white font-display tracking-tight">
              {locale === 'fr' ? activeLayer.nameFr : activeLayer.nameEn}
            </h4>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {locale === 'fr' ? activeLayer.descriptionFr : activeLayer.descriptionEn}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView(activeLayer.relatedView)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-tech text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 self-start md:self-auto shadow-[0_2px_12px_rgba(14,165,233,0.3)] active:scale-[0.98]"
          >
            <span>{locale === 'fr' ? 'Ouvrir l\'Espace Dédié' : 'Explore Layer'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* The Concrete Sequence Flow */}
        <div className="space-y-3">
          <span className="font-tech text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {locale === 'fr' ? 'Séquence opérationnelle de bout en bout :' : 'End-to-End Operational Chain:'}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {(locale === 'fr' ? activeLayer.sequenceFr : activeLayer.sequenceEn).map((step, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] flex flex-col justify-between space-y-2.5 relative transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-400">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px]">STEP 0{idx + 1}</span>
                  {idx < 4 && (
                    <span className="hidden md:inline text-slate-600 group-hover:text-sky-400/60 transition-colors">→</span>
                  )}
                </div>
                <span className="font-sans text-xs font-medium text-slate-200 leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
