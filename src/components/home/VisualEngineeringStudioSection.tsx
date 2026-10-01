// src/components/home/VisualEngineeringStudioSection.tsx
import React, { useState } from 'react';
import {
  Layers,
  Network,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Activity,
  FileText
} from 'lucide-react';
import { InteractiveSldDiagram } from '../visual/InteractiveSldDiagram';
import { InteractiveScadaHmiView } from '../visual/InteractiveScadaHmiView';
import { InteractiveProtectionTripDiagram } from '../visual/InteractiveProtectionTripDiagram';

interface VisualEngineeringStudioSectionProps {
  locale: 'fr' | 'en';
  onNavigateDomain?: (domain: string) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
}

export const VisualEngineeringStudioSection: React.FC<VisualEngineeringStudioSectionProps> = ({
  locale,
  onNavigateDomain,
  onNavigateEquipment,
}) => {
  const [activeTab, setActiveTab] = useState<'sld' | 'scada' | 'protection'>('sld');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#070B14] via-[#0D1527] to-[#070B14] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                LABORATOIRE VISUEL INTERACTIF EPEDE
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs font-mono hidden sm:inline">CEI 60617 · CEI 61850 · CEI 62271</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {locale === 'fr'
                ? 'Voir, Manipuler & Comprendre les Systèmes Électriques'
                : 'See, Interact with & Master Electrical Power Systems'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
              {locale === 'fr'
                ? 'L\'ingénierie électrique ne s\'apprend pas par le texte seul. Explorez nos simulateurs opérationnels : basculez les disjoncteurs, validez les interverrouillages de sécurité, observez la télémétrie en temps réel et décomposez l\'élimination d\'un court-circuit en moins de 60 ms.'
                : 'Electrical engineering cannot be mastered through static text alone. Explore our operational simulators: operate circuit breakers, test safety interlocks, monitor real-time telemetry, and analyze sub-60ms fault clearance sequences.'}
            </p>
          </div>

          {/* 3 Main Studio Tabs */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('sld')}
              className={`px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-between gap-3 border ${
                activeTab === 'sld'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg ring-1 ring-amber-400/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Network className="h-4 w-4 text-amber-400" />
                <span>01. {locale === 'fr' ? 'Unifilaire SLD Interactif' : 'Interactive Single-Line'}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scada')}
              className={`px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-between gap-3 border ${
                activeTab === 'scada'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg ring-1 ring-emerald-400/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span>02. {locale === 'fr' ? 'Superviseur SCADA / HMI' : 'SCADA / HMI Telecontrol'}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('protection')}
              className={`px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-between gap-3 border ${
                activeTab === 'protection'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg ring-1 ring-rose-400/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>03. {locale === 'fr' ? 'Physique & Déclenchement' : 'Fault Trip Physics'}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Container */}
      <div className="transition-all duration-300">
        {activeTab === 'sld' && (
          <InteractiveSldDiagram
            locale={locale}
            initialTopology="substation_double_bus"
            onSelectEquipment={onNavigateEquipment}
          />
        )}

        {activeTab === 'scada' && (
          <InteractiveScadaHmiView
            locale={locale}
            mode="substation"
            onNavigateEquipment={onNavigateEquipment}
          />
        )}

        {activeTab === 'protection' && (
          <InteractiveProtectionTripDiagram
            locale={locale}
            faultCurrentKa={31.5}
            relayType="ANSI 50/51"
          />
        )}
      </div>
    </section>
  );
};
