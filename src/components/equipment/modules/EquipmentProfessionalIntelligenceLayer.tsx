// src/components/equipment/modules/EquipmentProfessionalIntelligenceLayer.tsx
// EPEDE - Unified Professional Intelligence & Decision Support Layer
// Consolidates Priorities 3, 4, 5, 6, 8, 10 into an industrial-grade engineering module

import React, { useState } from 'react';
import {
  Brain,
  AlertOctagon,
  Compass,
  Scale,
  Network,
  Stethoscope,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { WhyThisMattersCard } from './WhyThisMattersCard';
import { AssumptionsLimitationsCard } from './AssumptionsLimitationsCard';
import { EngineeringDecisionPointsCard } from './EngineeringDecisionPointsCard';
import { SystemBoundaryResponsibilityCard } from './SystemBoundaryResponsibilityCard';
import { FieldDiagnosisFrameworkCard } from './FieldDiagnosisFrameworkCard';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';

export interface EquipmentProfessionalIntelligenceLayerProps {
  equipmentId: string;
  domainCode: string;
  locale: 'fr' | 'en';
}

type IntelligenceTab =
  | 'why_this_matters'
  | 'assumptions_limits'
  | 'decision_points'
  | 'system_boundaries'
  | 'field_diagnostics';

export const EquipmentProfessionalIntelligenceLayer: React.FC<EquipmentProfessionalIntelligenceLayerProps> = ({
  equipmentId,
  domainCode,
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';
  const [activeTab, setActiveTab] = useState<IntelligenceTab>('why_this_matters');

  const tabs: Array<{
    id: IntelligenceTab;
    label_fr: string;
    label_en: string;
    icon: React.ReactNode;
    badgeCount?: string;
  }> = [
    {
      id: 'why_this_matters',
      label_fr: 'Pourquoi C\'est Crucial',
      label_en: 'Why This Matters',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />,
      badgeCount: '3 Riques'
    },
    {
      id: 'assumptions_limits',
      label_fr: 'Limites & Déclassement',
      label_en: 'Boundaries & Derating',
      icon: <Compass className="w-3.5 h-3.5 text-cyan-400" />,
      badgeCount: '4 Limites'
    },
    {
      id: 'decision_points',
      label_fr: 'Arbitrages d\'Ingénierie',
      label_en: 'Engineering Decisions',
      icon: <Scale className="w-3.5 h-3.5 text-purple-400" />,
      badgeCount: '2 Dilemmes'
    },
    {
      id: 'system_boundaries',
      label_fr: 'Frontières & Interfaces',
      label_en: 'Boundaries & Interfaces',
      icon: <Network className="w-3.5 h-3.5 text-blue-400" />,
      badgeCount: '4 Interfaces'
    },
    {
      id: 'field_diagnostics',
      label_fr: 'Diagnostic Terrain & FMEA',
      label_en: 'Field Diagnosis & FMEA',
      icon: <Stethoscope className="w-3.5 h-3.5 text-rose-400" />,
      badgeCount: '3 Cas'
    }
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#080C12] overflow-hidden shadow-2xl font-sans">
      {/* Top Banner */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#0C121C] via-[#0E1624] to-[#0A0F18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Brain className="w-4 h-4 text-amber-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {isFr
                  ? 'COUCHE D\'INTELLIGENCE D\'INGÉNIERIE & DÉCISION MÉTIER'
                  : 'PROFESSIONAL ENGINEERING INTELLIGENCE & DECISION LAYER'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 text-[10px] font-mono border border-amber-700/50 font-bold">
                MATURITÉ L5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              {isFr
                ? 'Compréhension causale approfondie, arbitrage multicritère et continuité opérationnelle'
                : 'Deep causal understanding, multi-criteria tradeoff analysis, and operational continuity'}
            </p>
          </div>
        </div>

        <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="sm" />
      </div>

      {/* Tabs Navigation Bar */}
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
              {tab.badgeCount && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  isActive
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="p-4 sm:p-5">
        {activeTab === 'why_this_matters' && (
          <WhyThisMattersCard
            equipmentId={equipmentId}
            domainCode={domainCode}
            locale={locale}
          />
        )}

        {activeTab === 'assumptions_limits' && (
          <AssumptionsLimitationsCard
            equipmentId={equipmentId}
            domainCode={domainCode}
            locale={locale}
          />
        )}

        {activeTab === 'decision_points' && (
          <EngineeringDecisionPointsCard
            equipmentId={equipmentId}
            domainCode={domainCode}
            locale={locale}
          />
        )}

        {activeTab === 'system_boundaries' && (
          <SystemBoundaryResponsibilityCard
            equipmentId={equipmentId}
            domainCode={domainCode}
            locale={locale}
          />
        )}

        {activeTab === 'field_diagnostics' && (
          <FieldDiagnosisFrameworkCard
            equipmentId={equipmentId}
            domainCode={domainCode}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
};
