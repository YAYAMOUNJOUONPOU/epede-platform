// src/components/context/EngineeringRelationshipTraceCard.tsx
// EPEDE Phase 2 - Universal Engineering Relationship Trace Engine
// Provides 10 cross-discipline trace pathways for any equipment or system:
// Upstream, Downstream, Protection, Measurement, Control, Communication, Earthing, Lifecycle, Roles, Standards.

import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
  Cpu,
  Radio,
  Zap,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { resolveCanonicalEquipment } from '../../data/equipment/canonicalEquipmentRegistry';
import { canonicalGraph } from '../../data/canonicalGraphEngine';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';
import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export type TracePathwayType =
  | 'UPSTREAM'
  | 'DOWNSTREAM'
  | 'PROTECTION'
  | 'MEASUREMENT'
  | 'CONTROL'
  | 'COMMUNICATION'
  | 'EARTHING'
  | 'LIFECYCLE'
  | 'ROLES'
  | 'STANDARDS';

interface EngineeringRelationshipTraceCardProps {
  equipmentId?: string;
  nodeId?: string;
  domainCode?: string;
  locale?: 'fr' | 'en';
  onNavigateToEquipment?: (equipmentId: string) => void;
  onNavigateToStandard?: (standardRef: string) => void;
  onNavigateToRole?: (roleSlug: string) => void;
  onNavigateToDomain?: (domainCode: string) => void;
  initialPathway?: TracePathwayType;
}

export const EngineeringRelationshipTraceCard: React.FC<EngineeringRelationshipTraceCardProps> = ({
  equipmentId = 'eq-trafo-hta-01',
  nodeId,
  domainCode = 'D04',
  locale = 'fr',
  onNavigateToEquipment,
  onNavigateToStandard,
  onNavigateToRole,
  onNavigateToDomain,
  initialPathway = 'UPSTREAM'
}) => {
  const [activePathway, setActivePathway] = useState<TracePathwayType>(initialPathway);
  const isFr = locale === 'fr';

  // Resolve equipment object or fallback to canonical slice
  const equipment: CanonicalEquipmentObject | undefined = resolveCanonicalEquipment(equipmentId);

  // Resolve graph node context if applicable
  const graphContext = nodeId
    ? canonicalGraph.buildContextStack(nodeId)
    : canonicalGraph.buildContextStack(equipmentId);

  const pathways: Array<{
    id: TracePathwayType;
    label_fr: string;
    label_en: string;
    icon: React.ComponentType<{ className?: string }>;
    countBadge?: string | number;
    color: string;
  }> = [
    { id: 'UPSTREAM', label_fr: 'Amont (Sources & Alimentation)', label_en: 'Trace Upstream (Feeds & Inflow)', icon: ArrowUpRight, countBadge: equipment?.upstreamEquipmentIds?.length || 2, color: 'text-amber-400' },
    { id: 'DOWNSTREAM', label_fr: 'Aval (Charges & Distribution)', label_en: 'Trace Downstream (Loads & Feeders)', icon: ArrowDownRight, countBadge: equipment?.downstreamEquipmentIds?.length || 2, color: 'text-cyan-400' },
    { id: 'PROTECTION', label_fr: 'Chaîne de Protection (ANSI)', label_en: 'Protection Path (ANSI Relays)', icon: Shield, countBadge: equipment?.associatedProtection?.ansiCodes?.length || 4, color: 'text-rose-400' },
    { id: 'MEASUREMENT', label_fr: 'Mesures & Capteurs (TC/TP)', label_en: 'Measurement Path (CT/VT/Sensors)', icon: Activity, countBadge: equipment?.measurementAndInstrumentation?.sensors?.length || 3, color: 'text-emerald-400' },
    { id: 'CONTROL', label_fr: 'Contrôle & Verrouillages', label_en: 'Control Path (BCU/Interlocks)', icon: Cpu, countBadge: 'IED', color: 'text-indigo-400' },
    { id: 'COMMUNICATION', label_fr: 'Communication & SCADA', label_en: 'Communication Path (IEC 61850)', icon: Radio, countBadge: equipment?.communicationProtocols?.length || 2, color: 'text-purple-400' },
    { id: 'EARTHING', label_fr: 'Mise à la Terre & Sécurité', label_en: 'Earthing Path (SLT & IEEE 80)', icon: Zap, countBadge: equipment?.earthingAndBonding?.earthingRegime || 'Solid', color: 'text-yellow-400' },
    { id: 'LIFECYCLE', label_fr: 'Cycle de Vie & Jalons', label_en: 'Lifecycle & Milestones', icon: Clock, countBadge: equipment?.lifecyclePhases?.length || 8, color: 'text-sky-400' },
    { id: 'ROLES', label_fr: 'Rôles d\'Ingénierie', label_en: 'Related Roles & Tasks', icon: Users, countBadge: equipment?.associatedEngineeringRoles?.length || 3, color: 'text-teal-400' },
    { id: 'STANDARDS', label_fr: 'Normes CEI / IEEE', label_en: 'Related Standards', icon: BookOpen, countBadge: equipment?.applicableStandards?.length || 3, color: 'text-blue-400' },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090D14] overflow-hidden shadow-2xl font-sans text-slate-200">
      
      {/* Header Banner */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#0C121D] via-[#0E1624] to-[#0A101A] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60">
              {isFr ? 'TRAÇABILITÉ ÉLECTROTECHNIQUE MULTI-DISCIPLINAIRE' : 'CROSS-DISCIPLINE ELECTROTECHNICAL TRACE'}
            </span>
            <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="xs" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>{equipment ? (isFr ? equipment.name.fr : equipment.name.en) : (isFr ? 'Objet d\'Ingénierie' : 'Engineering Object')}</span>
            {equipment?.tagIec && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                {equipment.tagIec}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {isFr
              ? 'Examinez les liaisons amont/aval, les boucles de protection ANSI, l\'instrumentation TC/TP, le contrôle-commande et les régimes de neutre.'
              : 'Inspect upstream/downstream power flows, ANSI protection loops, CT/VT instrumentation, control automation, and earthing regimes.'}
          </p>
        </div>

        {equipment?.voltageContext?.nominalVoltage && (
          <div className="shrink-0 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400">{isFr ? 'Tension Nominale' : 'Nominal Voltage'}</div>
            <div className="text-sm font-mono font-bold text-amber-300">{equipment.voltageContext.nominalVoltage}</div>
          </div>
        )}
      </div>

      {/* Pathway Action Buttons Toolbar (10 Interactive Pathways) */}
      <div className="p-3 bg-[#070A0F] border-b border-slate-800/80 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          {pathways.map((p) => {
            const isActive = activePathway === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePathway(p.id)}
                className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-sky-950/80 border-sky-400 text-white shadow-lg shadow-sky-900/30 scale-[1.02]'
                    : 'bg-[#0E131C] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : p.color}`} />
                <span>{isFr ? p.label_fr : p.label_en}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {p.countBadge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pathway Detail Panel */}
      <div className="p-5 sm:p-6 space-y-5">

        {/* 1. UPSTREAM TRACE */}
        {activePathway === 'UPSTREAM' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                <ArrowUpRight className="w-4 h-4" />
                <span>{isFr ? 'Traçabilité Amont : Alimentation, Source & Organes de Manœuvre' : 'Upstream Pathway: Sources, Incomers & Switching Apparatus'}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{isFr ? 'Sens de l\'Énergie : Amont → Objet' : 'Energy Direction: Upstream → Object'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1: Upstream Incomer */}
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Ligne & Source d\'Alimentation' : 'Infeed Grid Line / Source'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {equipment?.parentDomain === 'D01'
                    ? (isFr ? 'Retenue d\'eau amont, vanne de tête et conduite forcée en acier' : 'Upstream reservoir, intake gate and penstock')
                    : equipment?.parentDomain === 'D04' || equipment?.parentDomain === 'D03'
                    ? (isFr ? 'Ligne aérienne 225 kV Sonatrel depuis poste d\'évacuation Songloulou' : '225 kV transmission line from Songloulou power plant')
                    : (isFr ? 'Départ HTA 30 kV cellule arrivée poste source 225/30 kV' : '30 kV MV outgoing feeder from primary substation')}
                </p>
                <div className="text-[11px] font-mono text-amber-300 pt-1 flex items-center gap-1">
                  <span>→ {isFr ? 'Tension nominale :' : 'Nominal Level:'}</span>
                  <strong className="text-white">{equipment?.voltageContext?.nominalVoltage || '225 kV'}</strong>
                </div>
              </div>

              {/* Step 2: Isolation & Protection Breaker */}
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Appareillage de Coupure & Sectionnement' : 'Switching & Disconnection'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? 'Sectionneur d\'aiguillage de barres (Q1/Q2), disjoncteur HTB/HTA (Q0) avec réenclencheur et sectionneur de ligne (Q9).'
                    : 'Busbar selector disconnectors (Q1/Q2), circuit breaker (Q0) with auto-reclose, and line disconnector (Q9).'}
                </p>
                <div className="text-[11px] font-mono text-cyan-300 pt-1">
                  {isFr ? 'Pouvoir de coupure assigné :' : 'Rated Breaking Capacity:'} <strong>31.5 kA / 3s</strong>
                </div>
              </div>

              {/* Step 3: Terminal Connection */}
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Interface de Raccordement Borne' : 'Terminal Palm Connection'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {equipment?.connectionRequirements?.electrical
                    ? (isFr ? equipment.connectionRequirements.electrical.fr : equipment.connectionRequirements.electrical.en)
                    : (isFr ? 'Traversées condensateur étanches avec parafoudres ZnO adjacents' : 'Capacitor bushings with adjacent ZnO surge arresters')}
                </p>
                <div className="text-[11px] font-mono text-emerald-300 pt-1">
                  {isFr ? 'Protection surtension :' : 'Overvoltage Protection:'} <strong>Parafoudre ZnO Classe 4</strong>
                </div>
              </div>
            </div>

            {/* Direct Link Actions */}
            {equipment?.upstreamEquipmentIds && equipment.upstreamEquipmentIds.length > 0 && (
              <div className="p-3 rounded-xl bg-[#080B10] border border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">{isFr ? 'Équipements Amont Associés :' : 'Direct Upstream Equipment:'}</span>
                {equipment.upstreamEquipmentIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onNavigateToEquipment?.(id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-700 text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{id}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. DOWNSTREAM TRACE */}
        {activePathway === 'DOWNSTREAM' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                <ArrowDownRight className="w-4 h-4" />
                <span>{isFr ? 'Traçabilité Aval : Distribution, Départs & Charges Finales' : 'Downstream Pathway: Distribution, Outgoing Feeders & Final Loads'}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{isFr ? 'Sens de l\'Énergie : Objet → Aval' : 'Energy Direction: Object → Downstream'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Jeu de Barres Secondaire' : 'Secondary Busbar System'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? 'Jeu de barres HTA 30 kV ou Basse Tension 400 V alimentant les départs protégés par cellules modulaires.'
                    : '30 kV MV or 400 V LV busbar supplying outgoing feeders through modular switchgear bays.'}
                </p>
                <div className="text-[11px] font-mono text-cyan-300 pt-1">
                  {isFr ? 'Courant nominal jeu de barres :' : 'Rated Busbar Current:'} <strong>1250 A à 2500 A</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Câbles & Lignes de Distribution' : 'Feeder Distribution Cables'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? 'Câbles unipolaires 30 kV XLPE Aluminium (ex. 3×1×240 mm²) ou réseau aérien Almelec.'
                    : 'Single-core 30 kV XLPE Aluminum cables (e.g. 3×1×240 mm²) or overhead AAAC conductor.'}
                </p>
                <div className="text-[11px] font-mono text-amber-300 pt-1">
                  {isFr ? 'Chute de tension maximale tolérée :' : 'Max Allowed Voltage Drop:'} <strong>≤ 5%</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono">{isFr ? 'Tableau TGBT & Récepteurs' : 'Main LV Switchboard & Loads'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? 'Poste de transformation client 30 kV / 400 V, TGBT principal, inverseur ATS groupe de secours et moteurs industriels.'
                    : 'Customer substation 30 kV / 400 V, Main LV switchboard, ATS backup transfer switch, and industrial motors.'}
                </p>
                <div className="text-[11px] font-mono text-emerald-300 pt-1">
                  {isFr ? 'Régime de neutre BT :' : 'LV Neutral Earthing:'} <strong>TN-S ou TT (CEI 60364)</strong>
                </div>
              </div>
            </div>

            {/* Direct Link Actions */}
            {equipment?.downstreamEquipmentIds && equipment.downstreamEquipmentIds.length > 0 && (
              <div className="p-3 rounded-xl bg-[#080B10] border border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">{isFr ? 'Équipements Aval Associés :' : 'Direct Downstream Equipment:'}</span>
                {equipment.downstreamEquipmentIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onNavigateToEquipment?.(id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{id}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. PROTECTION PATHWAY (ANSI) */}
        {activePathway === 'PROTECTION' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase">
                <Shield className="w-4 h-4" />
                <span>{isFr ? 'Chaîne de Protection : Capteurs → Relais Numérique IED → Bobine de Déclenchement' : 'Protection Path: Sensors → Digital IED Relay → Breaker Trip Coil'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" referenceSource="IEC 60255 / IEEE C37.90" locale={locale} size="xs" />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300 leading-relaxed">
                {equipment?.associatedProtection?.summary
                  ? (isFr ? equipment.associatedProtection.summary.fr : equipment.associatedProtection.summary.en)
                  : (isFr
                    ? 'Protection multi-couches assurée par relais différentiel (87), max de courant à temps dépendant (50/51) et terre restreinte (64R).'
                    : 'Multi-layer protection provided by differential (87), time overcurrent (50/51) and restricted earth fault (64R).')}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {(equipment?.associatedProtection?.ansiCodes || ['87T', '50/51', '51N', '49', '63', '59N']).map((ansi) => (
                  <div key={ansi} className="p-3 rounded-lg bg-[#111827] border border-rose-900/50 text-center">
                    <span className="text-xs font-mono font-bold text-rose-400 block">ANSI {ansi}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {ansi === '87T' || ansi === '87G' ? (isFr ? 'Différentielle' : 'Differential') :
                       ansi === '50/51' ? (isFr ? 'Max Courant' : 'Overcurrent') :
                       ansi === '51N' || ansi === '64G' ? (isFr ? 'Défaut Terre' : 'Earth Fault') :
                       ansi === '21' ? (isFr ? 'Distance' : 'Distance') :
                       ansi === '49' ? (isFr ? 'Image Thermique' : 'Thermal Image') :
                       ansi === '63' ? (isFr ? 'Buchholz Pression' : 'Buchholz Gas') :
                       ansi === '59N' ? (isFr ? 'Déplacement Neutre' : 'Neutral Shift') :
                       (isFr ? 'Protection Assignée' : 'Assigned Protection')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs text-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{isFr ? 'Échelonnement Sélectif Typique (Grading Margin) :' : 'Typical Discrimination Margin (Δt) :'}</span>
                </div>
                <strong className="font-mono text-white">Δt = 250 - 300 ms (CEI 60255-151)</strong>
              </div>
            </div>
          </div>
        )}

        {/* 4. MEASUREMENT PATHWAY */}
        {activePathway === 'MEASUREMENT' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <Activity className="w-4 h-4" />
                <span>{isFr ? 'Chaîne de Mesure & Instrumentation : Réducteurs TC/TP & Sondes' : 'Measurement Path: CT/VT Instrument Transformers & Sensors'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" referenceSource="IEC 61869-1/-2" locale={locale} size="xs" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase font-bold text-emerald-400">{isFr ? 'Transformateurs de Courant (TC)' : 'Current Transformers (CT)'}</h4>
                <p className="text-slate-300">
                  {isFr
                    ? 'Noyaux séparés Mesure (Classe 0.2S / 0.5, FS5) et Protection (Classe 5P20 / 10P20 ou Classe PX selon CEI 61869-2).'
                    : 'Separate cores for Metering (Class 0.2S / 0.5, FS5) and Protection (Class 5P20 / 10P20 or Class PX per IEC 61869-2).'}
                </p>
                <div className="p-2 rounded bg-slate-950 text-slate-400 font-mono text-[11px]">
                  Rapport assigné : <strong>600-1200 / 1 A - 5 A</strong> · Puissance : <strong>15 VA - 30 VA</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase font-bold text-emerald-400">{isFr ? 'Transformateurs de Tension (TP/TT)' : 'Voltage Transformers (VT/CVT)'}</h4>
                <p className="text-slate-300">
                  {isFr
                    ? 'Transformateur inductif ou capacitif (CVT) à double enroulement secondaire : Mesure (100V/√3, Cl 0.2) et Détection Terre (100V/3, Cl 3P).'
                    : 'Inductive or capacitive (CVT) voltage transformer with dual secondary: Metering (100V/√3, Cl 0.2) & Residual Earth (100V/3, Cl 3P).'}
                </p>
                <div className="p-2 rounded bg-slate-950 text-slate-400 font-mono text-[11px]">
                  Rapport assigné : <strong>225 000/√3 / 100/√3 V</strong> · Classe : <strong>0.2 / 3P</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTROL & INTERLOCKING PATHWAY */}
        {activePathway === 'CONTROL' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                <Cpu className="w-4 h-4" />
                <span>{isFr ? 'Contrôle-Commande & Logique de Verrouillage' : 'Control, Automation & Interlocking Logic'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" referenceSource="IEC 62271-102 / IEC 61850" locale={locale} size="xs" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase font-bold text-indigo-300">{isFr ? 'Automate de Travée (BCU)' : 'Bay Control Unit (BCU)'}</h4>
                <p className="text-slate-300">
                  {equipment?.controlAndAutomation?.localControls
                    ? (isFr ? equipment.controlAndAutomation.localControls.fr : equipment.controlAndAutomation.localControls.en)
                    : (isFr ? 'Sélectionneur Local/Distant, commande motorisée des sectionneurs et surveillance des états SF6.' : 'Local/Remote selector, motorized disconnector commands and SF6 density monitoring.')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase font-bold text-indigo-300">{isFr ? 'Logique de Verrouillage de Sécurité' : 'Safety Interlocking Logic'}</h4>
                <p className="text-slate-300">
                  {equipment?.controlAndAutomation?.interlocks
                    ? (isFr ? equipment.controlAndAutomation.interlocks.fr : equipment.controlAndAutomation.interlocks.en)
                    : (isFr ? 'Interdiction formelle de manœuvre des sectionneurs en charge (interlock 52/89 électrique et mécanique).' : 'Strict prohibition of operating disconnectors under load (electrical & mechanical 52/89 interlock).')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. COMMUNICATION & SCADA PATHWAY */}
        {activePathway === 'COMMUNICATION' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                <Radio className="w-4 h-4" />
                <span>{isFr ? 'Réseau de Communication & SCADA Sous-Station' : 'Communication Network & Substation SCADA'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" referenceSource="IEC 61850 / IEC 60870-5-104" locale={locale} size="xs" />
            </div>

            <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-purple-900/40">
                  <span className="font-mono font-bold text-purple-300 block mb-1">Messages GOOSE</span>
                  <p className="text-slate-400 text-[11px]">{isFr ? 'Déclenchement & verrouillage rapide pair-à-pair (< 4 ms) sur bus station.' : 'Fast peer-to-peer trip & interlock signals (< 4 ms) over station bus.'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-purple-900/40">
                  <span className="font-mono font-bold text-purple-300 block mb-1">Rapports MMS</span>
                  <p className="text-slate-400 text-[11px]">{isFr ? 'Télémesures U, I, P, Q et télésignalisations vers superviseur IHM poste.' : 'Telemetry U, I, P, Q and event alarms to station HMI supervisor.'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-purple-900/40">
                  <span className="font-mono font-bold text-purple-300 block mb-1">Téléconduite Dispatching</span>
                  <p className="text-slate-400 text-[11px]">{isFr ? 'Protocole IEC 60870-5-104 vers le dispatching national SONATREL.' : 'IEC 60870-5-104 link to National Dispatching Center.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. EARTHING & SAFETY PATHWAY */}
        {activePathway === 'EARTHING' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 uppercase">
                <Zap className="w-4 h-4" />
                <span>{isFr ? 'Régime de Neutre (SLT) & Raccordement à la Terre' : 'System Earthing Regime & Grounding Grid (IEEE 80)'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" referenceSource="IEEE Std 80 / IEC 60364-5-54" locale={locale} size="xs" />
            </div>

            <div className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-950 border border-yellow-900/40">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{isFr ? 'Régime de Neutre Assigné :' : 'Assigned Earthing Regime :'}</span>
                  <div className="font-mono font-bold text-yellow-400 text-sm">{equipment?.earthingAndBonding?.earthingRegime || 'NGR (Résistance Limitée à 40 A)'}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{isFr ? 'Critère de Sécurité :' : 'Safety Criteria :'}</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">Tension de Toucher E_touch ≤ 650 V (IEEE 80)</div>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {equipment?.earthingAndBonding?.connectionMethod
                  ? (isFr ? equipment.earthingAndBonding.connectionMethod.fr : equipment.earthingAndBonding.connectionMethod.en)
                  : (isFr
                    ? 'Châssis et cuve reliés au maillage de terre en cuivre nu 95 mm² enfoui à 0.8 m avec couche de gravier 15 cm.'
                    : 'Frame and tank solidly bonded to 95 mm² bare copper substation ground mesh buried at 0.8 m with 15 cm crushed rock.')}
              </p>
            </div>
          </div>
        )}

        {/* 8. LIFECYCLE PATHWAY */}
        {activePathway === 'LIFECYCLE' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                <Clock className="w-4 h-4" />
                <span>{isFr ? 'Cycle de Vie Complet & Jalons de Réalisation' : 'Complete Lifecycle & Delivery Milestones'}</span>
              </div>
              <EvidenceTrustBadge level="ENGINEERING_REFERENCE" locale={locale} size="xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { step: '01', titleFr: 'Études & Spécifications', titleEn: 'Design & Sizing', descFr: 'Calcul de court-circuit, note de dimensionnement et schéma unifilaire.', descEn: 'Short-circuit calculation, sizing design note and SLD.' },
                { step: '02', titleFr: 'Essais en Usine (FAT)', titleEn: 'Factory Acceptance (FAT)', descFr: 'Essais diélectriques, échauffement et rigidité diélectrique.', descEn: 'Dielectric tests, temperature rise and withstand verification.' },
                { step: '03', titleFr: 'Mise en Service (SAT)', titleEn: 'Site Commissioning (SAT)', descFr: 'Injection secondaire relais, contrôle des asservissements et mise sous tension.', descEn: 'Secondary relay injection, interlock checks and energization.' },
                { step: '04', titleFr: 'Exploitation & Maintenance', titleEn: 'Asset Management', descFr: 'Analyse DGA huile, thermographie infrarouge et FMEA.', descEn: 'DGA oil analysis, infrared thermography and FMEA.' },
              ].map((phase) => (
                <div key={phase.step} className="p-3.5 rounded-xl bg-[#0E141F] border border-slate-800 space-y-1.5">
                  <span className="font-mono text-xs font-bold text-sky-400">Jalon {phase.step}</span>
                  <h4 className="font-bold text-white text-xs">{isFr ? phase.titleFr : phase.titleEn}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{isFr ? phase.descFr : phase.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. ROLES PATHWAY */}
        {activePathway === 'ROLES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase">
                <Users className="w-4 h-4" />
                <span>{isFr ? 'Rôles & Responsabilités d\'Ingénierie Associés' : 'Associated Engineering Roles & Professional Tasks'}</span>
              </div>
              <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {(equipment?.associatedEngineeringRoles || [
                { roleSlug: 'protection-engineer', title: { fr: 'Ingénieur Protection & Automatismes', en: 'Protection & Automation Engineer' }, tasks: { fr: 'Calcul des réglages relais, courbes temps-courant et coordination sélective.', en: 'Relay settings calculation, time-current curves and selectivity coordination.' } },
                { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Postes HTB/HTA', en: 'Substation Primary Engineer' }, tasks: { fr: 'Implantation mécanique, tenue électrodynamique des jeux de barres et BIL.', en: 'Physical layout, busbar electrodynamic forces and BIL insulation.' } },
                { roleSlug: 'maintenance-engineer', title: { fr: 'Ingénieur Maintenance & Diagnostic', en: 'Asset Maintenance Engineer' }, tasks: { fr: 'Surveillance état diélectrique, thermographie IR et analyse causale des pannes.', en: 'Insulation condition monitoring, IR thermography and causal failure analysis.' } }
              ]).map((roleItem, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-teal-300">Rôle {idx + 1}</span>
                  <h4 className="font-bold text-white text-xs">{isFr ? roleItem.title.fr : roleItem.title.en}</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{isFr ? roleItem.tasks.fr : roleItem.tasks.en}</p>
                  {onNavigateToRole && (
                    <button
                      type="button"
                      onClick={() => onNavigateToRole(roleItem.roleSlug)}
                      className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>{isFr ? 'Voir la fiche métier →' : 'View role sheet →'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. STANDARDS PATHWAY */}
        {activePathway === 'STANDARDS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase">
                <BookOpen className="w-4 h-4" />
                <span>{isFr ? 'Référentiel Normatif International (CEI / IEEE / Code Réseau)' : 'Governing Standards Framework (IEC / IEEE / Grid Code)'}</span>
              </div>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {(equipment?.applicableStandards || [
                { standardCode: 'CEI 60076', title: 'Transformateurs de puissance (Parties 1 à 10)', relevantClauses: ['Cl. 5.1 Tension', 'Cl. 8.2 Échauffement'], jurisdiction: 'International' },
                { standardCode: 'CEI 60909', title: 'Calcul des courants de court-circuit dans les réseaux triphasés', relevantClauses: ['Ik\" Triphasé', 'Facteur kappa'], jurisdiction: 'International' },
                { standardCode: 'IEEE Std 80', title: 'Guide for Safety in AC Substation Grounding', relevantClauses: ['Touch Voltage', 'Step Voltage'], jurisdiction: 'International' },
              ]).map((std, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-300 text-xs">{std.standardCode}</span>
                    <span className="text-[10px] font-mono text-slate-500">{std.jurisdiction}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{std.title}</h4>
                  {onNavigateToStandard && (
                    <button
                      type="button"
                      onClick={() => onNavigateToStandard(std.standardCode)}
                      className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>{isFr ? 'Consulter la norme →' : 'Inspect standard →'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
