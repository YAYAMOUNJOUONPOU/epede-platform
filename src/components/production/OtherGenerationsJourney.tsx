// src/components/production/OtherGenerationsJourney.tsx
import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Flame, 
  TreePine, 
  RotateCw, 
  Grid, 
  Layers, 
  Cpu, 
  Box, 
  Radio, 
  Activity, 
  Zap, 
  Filter, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  SOLAR_STAGES, 
  SOLAR_EQUIPMENT_MAP, 
  WIND_STAGES, 
  WIND_EQUIPMENT_MAP,
  THERMAL_STAGES,
  THERMAL_EQUIPMENT_MAP,
  BIOMASS_STAGES,
  BIOMASS_EQUIPMENT_MAP
} from './data/otherTechnologiesData';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import type { GenerationTechnologyId, ProcessStageNode, ProductionEquipment } from './types';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

interface OtherGenerationsJourneyProps {
  technologyId: GenerationTechnologyId;
  onSelectTechnology: (techId: GenerationTechnologyId) => void;
  onBackToOverview?: () => void;
  locale?: 'fr' | 'en';
  onSelectGlobalEquipment?: (equipmentId: string) => void;
}

const TECH_META = {
  solar: {
    titleFr: 'Solaire Photovoltaïque (PV)',
    titleEn: 'Solar Photovoltaic Generation',
    taglineFr: 'Conversion quantique photon-électron statique sans pièces mobiles.',
    taglineEn: 'Static quantum photon-electron conversion with no moving parts.',
    stages: SOLAR_STAGES,
    equipmentMap: SOLAR_EQUIPMENT_MAP,
    accentColor: 'from-amber-950 via-slate-900 to-yellow-950',
    borderColor: 'border-amber-700/40',
    icon: Sun
  },
  wind: {
    titleFr: 'Énergie Éolienne (Onshore / Offshore)',
    titleEn: 'Wind Power Generation',
    taglineFr: 'Conversion aérodynamique de l\'énergie cinétique atmosphérique.',
    taglineEn: 'Aerodynamic conversion of atmospheric kinetic wind power.',
    stages: WIND_STAGES,
    equipmentMap: WIND_EQUIPMENT_MAP,
    accentColor: 'from-cyan-950 via-slate-900 to-sky-950',
    borderColor: 'border-cyan-700/40',
    icon: Wind
  },
  thermal: {
    titleFr: 'Centrales Thermiques & Cycles Combinés (CCGT)',
    titleEn: 'Thermal CCGT & Gas/Steam Turbines',
    taglineFr: 'Combustion continue, cycle Brayton gaz et cycle Rankine vapeur.',
    taglineEn: 'Continuous combustion, Brayton gas cycle and Rankine steam cycle.',
    stages: THERMAL_STAGES,
    equipmentMap: THERMAL_EQUIPMENT_MAP,
    accentColor: 'from-orange-950 via-slate-900 to-red-950',
    borderColor: 'border-orange-700/40',
    icon: Flame
  },
  biomass: {
    titleFr: 'Biomasse & Cogénération Industrielle',
    titleEn: 'Biomass & Industrial Cogeneration',
    taglineFr: 'Valorisation thermique de sous-produits agricoles et forestiers.',
    taglineEn: 'Thermal recovery of agricultural and forestry by-products.',
    stages: BIOMASS_STAGES,
    equipmentMap: BIOMASS_EQUIPMENT_MAP,
    accentColor: 'from-emerald-950 via-slate-900 to-teal-950',
    borderColor: 'border-emerald-700/40',
    icon: TreePine
  }
};

export const OtherGenerationsJourney: React.FC<OtherGenerationsJourneyProps> = ({
  technologyId,
  onSelectTechnology,
  onBackToOverview,
  locale = 'fr',
  onSelectGlobalEquipment
}) => {
  if (technologyId === 'hydro') {
    return null;
  }

  const meta = TECH_META[technologyId];
  const [activeStageId, setActiveStageId] = useState<string>(meta.stages[1]?.id || meta.stages[0].id);
  const [selectedEquipment, setSelectedEquipment] = useState<ProductionEquipment | null>(null);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);

  const activeStage = meta.stages.find(s => s.id === activeStageId) || meta.stages[0];
  const activeEquipment = meta.equipmentMap[activeStage.equipmentId] || Object.values(meta.equipmentMap)[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${meta.accentColor} border ${meta.borderColor} p-6 sm:p-8 shadow-xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {onBackToOverview && (
                <button
                  onClick={onBackToOverview}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
                >
                  ← {locale === 'en' ? 'Generation Overview' : 'Domaine Production'}
                </button>
              )}
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-slate-700 font-semibold">
                {locale === 'en' ? `Sector: ${meta.titleEn}` : `Filière : ${meta.titleFr}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {locale === 'en' ? `Technical Journey: ${meta.titleEn}` : `Parcours Technique : ${meta.titleFr}`}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {locale === 'en'
                ? `${meta.taglineEn} Complete energy conversion chain from raw primary resource to grid interconnection.`
                : `${meta.taglineFr} Processus complet depuis la ressource primaire jusqu'au raccordement au réseau électrique.`}
            </p>
          </div>

          {/* Quick Technology Switcher */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {(['hydro', 'solar', 'wind', 'thermal', 'biomass'] as GenerationTechnologyId[]).map((tId) => (
              <button
                key={tId}
                onClick={() => onSelectTechnology(tId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left capitalize ${
                  technologyId === tId
                    ? 'bg-white text-slate-950 font-bold shadow'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {tId === 'hydro' ? '💧 Hydroélectricité' :
                 tId === 'solar' ? '☀️ Solaire PV' :
                 tId === 'wind' ? '💨 Éolien' :
                 tId === 'thermal' ? '🔥 Thermique & Gaz' :
                 '🌿 Biomasse'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SPECIAL INFOGRAPHIC: Thermal Power Plant Energy Conversion */}
      {technologyId === 'thermal' && (
        <div className="w-full">
          <EngineeringInfographicCard
            infographicId="thermal_power_conversion"
            locale={locale || 'fr'}
            onOpenModal={(id) => setModalInfographicId(id)}
          />
        </div>
      )}

      {/* Ribbon current state */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider font-mono shrink-0">
          <Sparkles className="w-4 h-4" />
          État Actuel de l'Énergie :
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full py-1 text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 text-white border border-slate-700 font-medium whitespace-nowrap">
            Étape {activeStage.stepNumber} : {activeStage.labelFr}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium whitespace-nowrap">
            {activeStage.energyStateFr}
          </span>
          {activeStage.voltageLevel && (
            <>
              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/60 font-bold whitespace-nowrap font-mono">
                {activeStage.voltageLevel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* The Horizontal Chain Navigator */}
      <div className="space-y-2">
        <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {meta.stages.map((stage, idx) => {
              const isCurrent = stage.id === activeStageId;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveStageId(stage.id)}
                    className={`group relative p-3.5 rounded-xl border text-left transition-all w-48 flex flex-col justify-between h-32 ${
                      isCurrent
                        ? 'bg-slate-800 border-white shadow-lg scale-105 z-10 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCurrent ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {stage.stepNumber}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold line-clamp-2">
                        {stage.labelFr}
                      </div>
                      {stage.voltageLevel && (
                        <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                          {stage.voltageLevel}
                        </span>
                      )}
                    </div>
                  </button>

                  {idx < meta.stages.length - 1 && (
                    <div className="w-4 h-0.5 bg-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Equipment spotlight card */}
      {activeEquipment ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  {activeEquipment.tag}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {activeEquipment.subsystem}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activeEquipment.name}
              </h3>
              <p className="text-xs text-slate-400 italic">
                {activeEquipment.nameEn}
              </p>
            </div>

            <button
              onClick={() => setSelectedEquipment(activeEquipment)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/20 shrink-0"
            >
              <Info className="w-4 h-4" />
              Ouvrir le Dossier Technique Complet (24 Points)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-cyan-400 font-semibold">Définition & Fonction</h4>
              <p className="leading-relaxed">{activeEquipment.purpose}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-emerald-400 font-semibold">Flux & Rendement</h4>
              <p className="leading-relaxed">{activeEquipment.energyFlow.outflow}</p>
              <div className="text-emerald-300 font-bold pt-1">
                Rendement typique : {activeEquipment.energyFlow.efficiencyTypical}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-mono uppercase text-amber-400 font-semibold">Rôle dans la Centrale</h4>
              <p className="leading-relaxed">{activeEquipment.electricalRole}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
          Équipement de cette étape en cours de restitution. Cliquez sur une autre étape pour afficher la fiche technique.
        </div>
      )}

      {/* Equipment detail modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onSelectEquipment={onSelectGlobalEquipment}
          allEquipmentMap={meta.equipmentMap}
          locale={locale}
        />
      )}

      {/* Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale || 'fr'}
        />
      )}
    </div>
  );
};
