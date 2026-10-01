// src/components/home/HomeView.tsx
// EPEDE Master Homepage — Driven by the Electrical Energy Ecosystem per Directive
import React from 'react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';

import { LivePowerFlowHero } from './LivePowerFlowHero';
import { PowerChainFlowBanner } from './PowerChainFlowBanner';
import { EnergyEcosystemStage } from './EnergyEcosystemStage';
import { WhatIsEpedeSection } from './WhatIsEpedeSection';
import { HiddenEngineeringLayersSection } from './HiddenEngineeringLayersSection';
import { PrimaryGatewaysSection } from './PrimaryGatewaysSection';
import { PedagogicalWorkflowSection } from './PedagogicalWorkflowSection';
import { AudiencePathsSection } from './AudiencePathsSection';
import { TrustCredibilitySection } from './TrustCredibilitySection';

export interface HomeViewProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateView: (view: 'domains' | 'equipment' | 'equipment-reference' | 'roles' | 'standards' | 'diagrams' | 'simulation' | 'calculators' | 'phase2' | 'lifecycle' | 'cameroon-grid' | 'regulatory' | 'journey' | 'context-stack' | 'hydropower' | 'industrial-projects' | 'engineers-chain' | string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenAssistant: () => void;
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onNavigateJourney?: (stageId?: StageId) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onOpenSearch,
  onOpenAssistant,
  onLocaleChange,
  onNavigateJourney,
  onNavigateStandard,
  onNavigateRole,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
}) => {
  const handleJourneyNavigation = (stageId?: StageId) => {
    if (onNavigateJourney) {
      onNavigateJourney(stageId);
    } else {
      onNavigateView('journey');
    }
  };

  return (
    <div 
      id="epede-home-root"
      className="space-y-10 sm:space-y-14 pb-24 font-sans text-slate-100 bg-slate-950"
    >
      {/* ── SECTION 0 — LIVE POWER FLOW HERO (NEW) ────────────────────── */}
      <LivePowerFlowHero
        locale={locale}
        onOpenSearch={onOpenSearch}
        onNavigateView={(v) => {
          if (v.startsWith('domain:')) {
            onSelectDomain(v.split(':')[1] as DomainCode);
          } else {
            onNavigateView(v as any);
          }
        }}
        onSelectDomain={(code) => onSelectDomain(code as DomainCode)}
        onNavigateJourney={() => handleJourneyNavigation()}
      />

      {/* ── SECTION 0.5 — POWER SYSTEM CHAIN & VOLTAGE TIERS (KEY RECOM.) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PowerChainFlowBanner
          locale={locale}
          onSelectDomain={onSelectDomain}
          onNavigateJourney={(stage) => handleJourneyNavigation(stage as any)}
          onNavigateView={(v) => onNavigateView(v as any)}
        />
      </div>

      {/* SECTION 1 — IMMERSIVE ELECTRICAL ENERGY ECOSYSTEM (MASTER HERO) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnergyEcosystemStage
          locale={locale}
          onNavigateView={(v) => {
            if (v.startsWith('domain:')) {
              const code = v.split(':')[1] as DomainCode;
              onSelectDomain(code);
            } else {
              onNavigateView(v as any);
            }
          }}
          onSelectDomain={onSelectDomain}
          onSelectEquipment={onSelectEquipment}
          onNavigateJourney={(stage) => handleJourneyNavigation(stage as any)}
        />
      </div>

      {/* SECTION 2 — EPEDE IDENTITY & ARCHITECTURE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhatIsEpedeSection
          locale={locale}
          onNavigateView={(v) => onNavigateView(v as any)}
          onSelectDomain={onSelectDomain}
        />
      </div>

      {/* SECTION 3 — CONNECTED ENGINEERING LAYERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HiddenEngineeringLayersSection
          locale={locale}
          onNavigateView={(v) => onNavigateView(v as any)}
        />
      </div>

      {/* SECTION 4 — PRIMARY EXPLORATION GATEWAYS */}
      <PrimaryGatewaysSection
        locale={locale}
        onNavigateView={(v) => onNavigateView(v as any)}
        onSelectDomain={onSelectDomain}
      />

      {/* SECTION 5 & 8 — PEDAGOGICAL WORKFLOW & FINAL CALL TO ACTION */}
      <PedagogicalWorkflowSection
        locale={locale}
        onNavigateView={(v) => onNavigateView(v as any)}
        onOpenSearch={() => onOpenSearch()}
      />

      {/* SECTION 6 — PROFESSIONAL AUDIENCE PATHS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AudiencePathsSection
          locale={locale}
          onNavigateView={(v) => onNavigateView(v as any)}
          onNavigateJourney={() => handleJourneyNavigation()}
          onNavigateDiagrams={() => {
            if (onNavigateDiagram) onNavigateDiagram();
            else onNavigateView('diagrams');
          }}
          onNavigateCalculators={() => {
            if (onNavigateCalculator) onNavigateCalculator(undefined as any);
            else onNavigateView('calculators');
          }}
          onNavigateRegulatory={() => onNavigateView('regulatory')}
        />
      </div>

      {/* SECTION 7 — TRUST, CREDIBILITY & ENGINEERING SCOPE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustCredibilitySection locale={locale} />
      </div>
    </div>
  );
};
