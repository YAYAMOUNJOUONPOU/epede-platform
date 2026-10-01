// src/components/grid/CameroonContractualDemarcationViewer.tsx
// EPEDE - Cameroon Electric Power Sector Contractual Demarcation & Responsibility Boundaries Viewer
// Interactive engineering matrix implementing Porte 3 validation criteria

import React, { useState } from 'react';
import {
  Scale,
  Shield,
  Layers,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  Cpu,
  Zap,
  Activity,
  DollarSign,
  Gavel,
  BookOpen,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  CAMEROON_CONTRACTUAL_BOUNDARIES,
  CameroonContractualBoundary
} from '../../data/cameroonContractualBoundariesData';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface CameroonContractualDemarcationViewerProps {
  locale: 'fr' | 'en';
  embedded?: boolean;
}

type BoundaryTab = 'demarcation' | 'responsibilities' | 'commercial' | 'fault_liability' | 'legal';

export const CameroonContractualDemarcationViewer: React.FC<CameroonContractualDemarcationViewerProps> = ({
  locale,
  embedded = false
}) => {
  const isFr = locale === 'fr';
  const [selectedBoundaryId, setSelectedBoundaryId] = useState<string>(CAMEROON_CONTRACTUAL_BOUNDARIES[0].id);
  const [activeTab, setActiveTab] = useState<BoundaryTab>('demarcation');

  const currentBoundary =
    CAMEROON_CONTRACTUAL_BOUNDARIES.find((b) => b.id === selectedBoundaryId) ||
    CAMEROON_CONTRACTUAL_BOUNDARIES[0];

  const tabs: Array<{ id: BoundaryTab; label_fr: string; label_en: string; icon: React.ReactNode }> = [
    {
      id: 'demarcation',
      label_fr: 'Points de Coupure & Démarcation',
      label_en: 'Cutoff Points & Demarcation',
      icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      id: 'responsibilities',
      label_fr: 'Obligations Opérationnelles & Réseau',
      label_en: 'Operational Grid Obligations',
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      id: 'commercial',
      label_fr: 'Comptage & Facturation TURPE',
      label_en: 'Metering & TURPE Settlement',
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      id: 'fault_liability',
      label_fr: 'Imputabilité des Défauts & Perturbations',
      label_en: 'Fault Liability & Perturbation Analysis',
      icon: <Gavel className="w-3.5 h-3.5 text-rose-400" />
    },
    {
      id: 'legal',
      label_fr: 'Cadre Légal & Réglementaire',
      label_en: 'Legal & Regulatory Framework',
      icon: <BookOpen className="w-3.5 h-3.5 text-purple-400" />
    }
  ];

  return (
    <div className={`space-y-6 font-sans ${embedded ? '' : 'p-4 sm:p-6 max-w-7xl mx-auto'}`}>
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFr ? 'PORTE 3 · RÉGLEMENTATION & RESPONSABILITÉ CONTRACTUELLE' : 'GATE 3 · CONTRACTUAL RESPONSIBILITY BOUNDARIES'}</span>
              </span>
              <EvidenceTrustBadge level="CAMEROON_CONTEXT" locale={locale} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
              {isFr
                ? 'Frontières Contractuelles & Démarcation du Réseau Camerounais'
                : 'Contractual Demarcation & Responsibility Matrix in Cameroon'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isFr
                ? 'Délimitation juridique, technique et financière des responsabilités entre Producteurs (Eneo, NHPC, IPP), Transporteur (SONATREL), Distributeur (ENEO), Régulateur Hydrologique (EDC) et l\'Autorité Sectorielle (ARSEL).'
                : 'Legal, electrotechnical, and commercial boundary mapping between Independent Producers, TSO (SONATREL), DSO (ENEO), Hydrological Authority (EDC), and the Regulator (ARSEL).'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1 shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              {isFr ? 'RÉFÉRENCE LÉGALE MAÎTRESSE :' : 'MASTER LEGAL REFERENCE :'}
            </div>
            <div className="text-amber-300 font-bold">Loi N° 2011/022</div>
            <div className="text-[11px] text-slate-400">Décret N° 2015/454 (SONATREL)</div>
          </div>
        </div>

        {/* 4 Boundary Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-xs">
          {CAMEROON_CONTRACTUAL_BOUNDARIES.map((boundary) => {
            const isSelected = selectedBoundaryId === boundary.id;
            return (
              <button
                key={boundary.id}
                type="button"
                onClick={() => setSelectedBoundaryId(boundary.id)}
                className={`px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="opacity-75 font-mono text-[10px]">{boundary.code}</span>
                <span>{isFr ? boundary.title_fr.split('↔')[0].trim() : boundary.title_en.split('↔')[0].trim()}</span>
                <ArrowRightLeft className="w-3 h-3 opacity-60" />
                <span>{isFr ? boundary.title_fr.split('↔')[1]?.trim() : boundary.title_en.split('↔')[1]?.trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Demarcation Diagram */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0F14] p-5 shadow-xl font-mono">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isFr ? 'SCHÉMA D\'ÉCHANGE & LIGNE DE DÉMARCATION JURIDIQUE :' : 'INTERCHANGE SCHEMATIC & LEGAL CUTOFF LINE :'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-stretch text-xs">
          {/* Left: Upstream Party */}
          <div className="md:col-span-3 p-4 rounded-xl bg-[#0E141F] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${currentBoundary.upstreamParty.badgeColor}`}>
                {isFr ? currentBoundary.upstreamParty.role_fr : currentBoundary.upstreamParty.role_en}
              </span>
              <h3 className="text-sm font-bold text-white">
                {isFr ? currentBoundary.upstreamParty.name_fr : currentBoundary.upstreamParty.name_en}
              </h3>
            </div>
            <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
              <strong className="text-slate-300 font-mono">{isFr ? 'Point amont :' : 'Upstream node :'}</strong>{' '}
              {isFr ? currentBoundary.demarcationPoint.physical_fr.split('.')[0] : currentBoundary.demarcationPoint.physical_en.split('.')[0]}
            </div>
          </div>

          {/* Middle: The Demarcation Interface */}
          <div className="md:col-span-1 p-3 rounded-xl bg-amber-500/10 border border-dashed border-amber-500/40 flex flex-col items-center justify-center text-center space-y-1">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase text-amber-400 leading-tight">
              {isFr ? 'FRONTIÈRE LÉGALE' : 'LEGAL CUTOFF'}
            </span>
            <span className="text-[9px] text-amber-200/80">
              {currentBoundary.commercialAndFinancial.meteringClass.split(' ')[0]}
            </span>
          </div>

          {/* Right: Downstream Party */}
          <div className="md:col-span-3 p-4 rounded-xl bg-[#0E141F] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${currentBoundary.downstreamParty.badgeColor}`}>
                {isFr ? currentBoundary.downstreamParty.role_fr : currentBoundary.downstreamParty.role_en}
              </span>
              <h3 className="text-sm font-bold text-white">
                {isFr ? currentBoundary.downstreamParty.name_fr : currentBoundary.downstreamParty.name_en}
              </h3>
            </div>
            <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
              <strong className="text-slate-300 font-mono">{isFr ? 'Point aval :' : 'Downstream node :'}</strong>{' '}
              {isFr ? currentBoundary.demarcationPoint.metering_fr.split(':')[0] : currentBoundary.demarcationPoint.metering_en.split(':')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Detailed Articles */}
      <div className="rounded-2xl border border-slate-800 bg-[#080C12] overflow-hidden shadow-2xl">
        <div className="px-4 bg-[#0A0F16] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{isFr ? tab.label_fr : tab.label_en}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 text-xs">
          
          {/* TAB 1: DEMARCATION POINTS */}
          {activeTab === 'demarcation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-cyan-400">
                  <span className="p-1 rounded bg-cyan-500/15 border border-cyan-500/30">1</span>
                  <span>{isFr ? 'Point de Démarcation Physique & Mécanique' : 'Physical & Mechanical Demarcation'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.demarcationPoint.physical_fr : currentBoundary.demarcationPoint.physical_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
                  <span className="p-1 rounded bg-amber-500/15 border border-amber-500/30">2</span>
                  <span>{isFr ? 'Spécification Électrotechnique & Isolation' : 'Electrotechnical & Insulation Level'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.demarcationPoint.electrical_fr : currentBoundary.demarcationPoint.electrical_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-emerald-400">
                  <span className="p-1 rounded bg-emerald-500/15 border border-emerald-500/30">3</span>
                  <span>{isFr ? 'Point Frontière de Comptage Transactionnel' : 'Settlement Revenue Metering Point'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.demarcationPoint.metering_fr : currentBoundary.demarcationPoint.metering_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-purple-400">
                  <span className="p-1 rounded bg-purple-500/15 border border-purple-500/30">4</span>
                  <span>{isFr ? 'Interface Téléconduite & SCADA' : 'SCADA & Telemetry Interface'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.demarcationPoint.scada_fr : currentBoundary.demarcationPoint.scada_en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATIONAL RESPONSIBILITIES */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-amber-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>{isFr ? 'Réglage Fréquence & Énergie Active (P)' : 'Frequency Response & Active Power (P)'}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.operationalResponsibilities.frequencyAndActivePower_fr : currentBoundary.operationalResponsibilities.frequencyAndActivePower_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{isFr ? 'Tenue de Tension & Énergie Réactive (Q / tan φ)' : 'Voltage Support & Reactive Power (Q / tan φ)'}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.operationalResponsibilities.voltageAndReactivePower_fr : currentBoundary.operationalResponsibilities.voltageAndReactivePower_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'Procédure de Consignation & Interverrouillages' : 'Lockout-Tagout (LOTO) & Cross-Interlocking'}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.operationalResponsibilities.maintenanceAndInterlocking_fr : currentBoundary.operationalResponsibilities.maintenanceAndInterlocking_en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMERCIAL & FINANCIAL SETTLEMENT */}
          {activeTab === 'commercial' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-bold text-emerald-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{isFr ? 'Formule de Règlement & Tarification Énergétique' : 'Settlement Formula & Power Tariff'}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/50">
                    {currentBoundary.commercialAndFinancial.meteringClass}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.commercialAndFinancial.settlementFormula_fr : currentBoundary.commercialAndFinancial.settlementFormula_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                <h4 className="font-mono font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{isFr ? 'Pénalités d\'Écart de Programme & Puissance Réactive' : 'Imbalance Charges & Reactive Penalties'}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.commercialAndFinancial.penaltiesAndImbalances_fr : currentBoundary.commercialAndFinancial.penaltiesAndImbalances_en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: FAULT LIABILITY & EVENT INVESTIGATION */}
          {activeTab === 'fault_liability' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <h4 className="font-mono font-bold text-rose-300 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-rose-400" />
                  <span>{isFr ? 'Critères d\'Imputabilité & Temps d\'Élimination du Court-Circuit' : 'Fault Clearing Criteria & Breaker Failure Liability'}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isFr ? currentBoundary.faultLiabilityProtocol.faultClearingCriteria_fr : currentBoundary.faultLiabilityProtocol.faultClearingCriteria_en}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h5 className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isFr ? 'Horodatage & Perturbographie' : 'GPS Time-Sync & Fault Recording'}</span>
                  </h5>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {currentBoundary.faultLiabilityProtocol.recordingEquipment}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h5 className="font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isFr ? 'Procédure de Résolution des Litiges' : 'Dispute Resolution Protocol'}</span>
                  </h5>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {isFr ? currentBoundary.faultLiabilityProtocol.disputeResolution_fr : currentBoundary.faultLiabilityProtocol.disputeResolution_en}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEGAL & REGULATORY FRAMEWORK */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-purple-300 text-xs">
                    {isFr ? 'Loi Fondatrice du Secteur Électrique :' : 'Governing Primary Legislation :'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-mono text-[10px] font-bold border border-purple-700/50">
                    MINEE / ARSEL
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {currentBoundary.legalFramework.primaryLaw}
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="font-mono font-bold text-slate-300 text-xs uppercase block">
                  {isFr ? 'Décrets d\'Application & Règlements Techniques Associés :' : 'Enabling Decrees & Technical Grid Regulations :'}
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-xs font-sans">
                  {currentBoundary.legalFramework.decreesAndCodes.map((code, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {code}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
