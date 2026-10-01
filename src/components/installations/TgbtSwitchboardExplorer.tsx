// src/components/installations/TgbtSwitchboardExplorer.tsx
// EPEDE D06 - Main Low-Voltage Switchboard (TGBT) Architecture & Internal Segregation Forms

import React, { useState } from 'react';
import {
  Layers,
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  Box,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  ArrowRight,
  Calculator,
  Compass
} from 'lucide-react';
import {
  INSTALLATION_EQUIPMENT,
  type InstallationComponent
} from './data/installationCatalog';

interface TgbtSwitchboardExplorerProps {
  locale: 'fr' | 'en';
  onSelectEquipment: (equipmentId: string) => void;
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

type InternalForm = 'Form 1' | 'Form 2b' | 'Form 3b' | 'Form 4b';

export const TgbtSwitchboardExplorer: React.FC<TgbtSwitchboardExplorerProps> = ({
  locale,
  onSelectEquipment,
  onNavigateToWorkbenchTab
}) => {
  const [selectedForm, setSelectedForm] = useState<InternalForm>('Form 4b');
  const [activeCubicleIndex, setActiveCubicleIndex] = useState<number>(0);

  const formDescriptions: Record<
    InternalForm,
    { title_fr: string; title_en: string; desc_fr: string; desc_en: string; level: string }
  > = {
    'Form 1': {
      title_fr: 'Forme 1 : Aucune Séparation Interne',
      title_en: 'Form 1: No Internal Separation',
      desc_fr:
        'Aucun cloisonnement interne entre le jeu de barres, les unités fonctionnelles (disjoncteurs) et les bornes de raccordement des câbles. Risque maximal en cas de défaillance ou de maintenance.',
      desc_en:
        'No physical internal partitioning between busbars, functional units (circuit breakers), and outgoing cable termination terminals. Highest risk during servicing.',
      level: 'Usage économique / Petits coffrets'
    },
    'Form 2b': {
      title_fr: 'Forme 2b : Séparation Barres / Unités Fonctionnelles',
      title_en: 'Form 2b: Busbars Separated from Functional Units & Terminals',
      desc_fr:
        'Le jeu de barres principal est isolé dans son compartiment dédié étanche, séparé des disjoncteurs et des bornes de câbles.',
      desc_en:
        'Main busbars are isolated inside a dedicated enclosed compartment, physically partitioned from circuit breakers and outgoing cable terminals.',
      level: 'Tertiaire standard / Bureaux'
    },
    'Form 3b': {
      title_fr: 'Forme 3b : Séparation des Unités Fonctionnelles entre Elles',
      title_en: 'Form 3b: Functional Units Partitioned from Each Other',
      desc_fr:
        'Le jeu de barres est isolé, et chaque unité fonctionnelle (disjoncteur) est logée dans son propre alvéole individuel. Les bornes de raccordement restent groupées.',
      desc_en:
        'Busbars are segregated, and each individual circuit breaker is enclosed within its own discrete cellular compartment. Cable terminals remain grouped.',
      level: 'Industrie moyenne & Bâtiments publics'
    },
    'Form 4b': {
      title_fr: 'Forme 4b : Cloisonnement Intégral Maximal',
      title_en: 'Form 4b: Complete Total Segregation of All Elements',
      desc_fr:
        'Séparation physique totale : Jeu de barres isolé, chaque disjoncteur dans son compartiment étanche ET chaque bornier de raccordement de câble séparé individuellement. Sécurité et continuité maximales sans coupure globale lors du remplacement d\'un départ.',
      desc_en:
        'Total physical segregation: Busbars isolated, each breaker housed in its individual cell, AND every single cable termination terminal separated into its own box. Maximum safety and hot-swappable reliability.',
      level: 'Sites critiques, Hôpitaux, Data Centers'
    }
  };

  const cubicles = [
    {
      id: 'cubicle-incomer',
      number: 1,
      title_fr: 'Colonne 1 : Arrivée Générale & Mesure',
      title_en: 'Column 1: Main Incomer & Metering',
      equipment_id: 'eq-acb-incomer-3200a',
      contents_fr: 'Disjoncteur ouvert ACB 3200 A débrochable, TC de comptage classe 0.5S, centrale de mesure et parafoudre Type 1+2.',
      contents_en: 'Air Circuit Breaker ACB 3200 A withdrawable, class 0.5S metering CTs, multi-function power analyzer, and Type 1+2 SPD.',
      dimensions: 'H 2000 x L 800 x P 800 mm'
    },
    {
      id: 'cubicle-busbar-coupler',
      number: 2,
      title_fr: 'Colonne 2 : Jeu de Barres Principal & Couplage',
      title_en: 'Column 2: Main Busbar & Coupler',
      equipment_id: 'eq-main-copper-busbar',
      contents_fr: 'Jeu de barres cuivre E-Cu 2500 A en compartiment supérieur, sectionneur de couplage normal/secours et barres de transfert.',
      contents_en: 'Solid copper E-Cu 2500 A busbars in top enclosure, bus-tie coupling breaker, and mechanical interlocking transfer shafts.',
      dimensions: 'H 2000 x L 600 x P 800 mm'
    },
    {
      id: 'cubicle-feeders',
      number: 3,
      title_fr: 'Colonne 3 : Départs Divisionnaires Étage',
      title_en: 'Column 3: Outgoing Feeder Modules',
      equipment_id: 'eq-mccb-feeder-400a',
      contents_fr: '6 disjoncteurs boîtier moulé MCCB 160 A à 400 A débrochables avec déclencheurs électroniques et tores différentiels Vigi.',
      contents_en: '6 plug-in molded-case circuit breakers (MCCB 160 A to 400 A) with electronic trip units and Vigi residual current blocks.',
      dimensions: 'H 2000 x L 800 x P 800 mm'
    },
    {
      id: 'cubicle-apfc',
      number: 4,
      title_fr: 'Colonne 4 : Compensation Cos φ Automatique',
      title_en: 'Column 4: Power Factor Correction (APFC)',
      equipment_id: 'eq-apfc-capacitor-bank',
      contents_fr: 'Batterie de condensateurs 300 kvar avec selfs anti-harmoniques 189 Hz, régulateur var-métrique et ventilateurs thermostatés.',
      contents_en: '300 kvar capacitor bank with 189 Hz detuned anti-resonance reactors, microprocessor var-controller, and filtered cooling fans.',
      dimensions: 'H 2000 x L 800 x P 800 mm'
    }
  ];

  const activeCubicle = cubicles[activeCubicleIndex];

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px]">
              TGBT ARCHITECTURE & FORMS
            </span>
            <span className="text-slate-400 text-xs">CEI 61439-1 & CEI 61439-2</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Tableau Général Basse Tension (TGBT) : Colonnes, Barres & Formes de Séparation'
              : 'Main LV Switchboard (TGBT): Cubicles, Busbars & Internal Separation Forms'}
          </h2>
        </div>
      </div>

      {/* Internal Segregation Forms Selector (Forms 1, 2b, 3b, 4b) */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>
              {locale === 'fr'
                ? 'Sélection de la Forme de Séparation Interne (CEI 61439-2) :'
                : 'Select Internal Separation Form (IEC 61439-2):'}
            </span>
          </label>
          <span className="text-[10px] text-slate-400">
            {locale === 'fr' ? 'Niveau d\'application : ' : 'Recommended tier: '}
            <strong className="text-emerald-400">{formDescriptions[selectedForm].level}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Form 1', 'Form 2b', 'Form 3b', 'Form 4b'] as InternalForm[]).map((form) => {
            const isSelected = form === selectedForm;
            return (
              <button
                key={form}
                type="button"
                onClick={() => setSelectedForm(form)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#090D15] text-slate-300 border-[#1C2538] hover:border-amber-400'
                }`}
              >
                <div className="text-[11px] font-bold">{form}</div>
                <div className="text-[9px] opacity-80 mt-0.5">
                  {form === 'Form 1'
                    ? 'Sans séparation'
                    : form === 'Form 2b'
                    ? 'Barres isolées'
                    : form === 'Form 3b'
                    ? 'Unités séparées'
                    : 'Séparation totale'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Form Detailed Card */}
        <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1 text-slate-300">
          <div className="text-[11px] font-bold text-white">
            {locale === 'fr' ? formDescriptions[selectedForm].title_fr : formDescriptions[selectedForm].title_en}
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {locale === 'fr' ? formDescriptions[selectedForm].desc_fr : formDescriptions[selectedForm].desc_en}
          </p>
        </div>
      </div>

      {/* Switchboard Multi-Column Layout (Interactive 4-Column Elevation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300">
            {locale === 'fr'
              ? 'Élévation de Façade du TGBT (4 Colonnes Modulaires) :'
              : 'Switchboard Front Elevation (4 Modular Cubicles):'}
          </span>
          <span className="text-[10px] text-slate-400">
            {locale === 'fr' ? 'Cliquez sur une colonne pour inspecter' : 'Click a column to inspect'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cubicles.map((cub, idx) => {
            const isSelected = idx === activeCubicleIndex;
            return (
              <div
                key={cub.id}
                onClick={() => setActiveCubicleIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                  isSelected
                    ? 'bg-[#101826] border-amber-400 shadow-lg shadow-amber-950/40 scale-[1.01]'
                    : 'bg-[#0B0F19] border-[#1C2538] hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      COLONNE #{cub.number}
                    </span>
                    <span className="text-[9px] text-slate-400">{cub.dimensions.split(' ')[0]}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1.5">
                    {locale === 'fr' ? cub.title_fr : cub.title_en}
                  </h3>

                  <p className="text-[11px] text-slate-300 font-sans line-clamp-3 leading-relaxed">
                    {locale === 'fr' ? cub.contents_fr : cub.contents_en}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1C2538] flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-bold">
                    {selectedForm}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEquipment(cub.equipment_id);
                    }}
                    className="text-sky-400 hover:text-sky-300 underline font-bold flex items-center gap-1"
                  >
                    <span>{locale === 'fr' ? 'Fiche Matériel' : 'Apparatus Spec'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Inspection Panel for Selected Cubicle */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-white">
              {locale === 'fr'
                ? `Inspection détaillée : ${activeCubicle.title_fr}`
                : `Deep Inspection: ${activeCubicle.title_en}`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Dimensions certifiées : <strong className="text-slate-200">{activeCubicle.dimensions}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {locale === 'fr' ? activeCubicle.contents_fr : activeCubicle.contents_en}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#1C2538] text-[10px]">
          <div className="p-2 rounded bg-[#080B12] border border-[#1C2538]">
            <span className="text-slate-400 block mb-0.5">Indice de Protection :</span>
            <strong className="text-amber-400">IP54 / IK10</strong>
          </div>
          <div className="p-2 rounded bg-[#080B12] border border-[#1C2538]">
            <span className="text-slate-400 block mb-0.5">Tenue Arc Interne :</span>
            <strong className="text-emerald-400">65 kA eff. / 0.3 s (CEI 61641)</strong>
          </div>
          <div className="p-2 rounded bg-[#080B12] border border-[#1C2538]">
            <span className="text-slate-400 block mb-0.5">Ventilation :</span>
            <strong className="text-sky-400">Naturelle + Ventilateurs asservis</strong>
          </div>
        </div>

        {/* Workbench Deep Calculation Jump Bar */}
        {onNavigateToWorkbenchTab && (
          <div className="pt-3 border-t border-[#1C2538] flex flex-wrap items-center justify-between gap-2">
            <span className="text-slate-400 text-xs">
              {locale === 'fr' 
                ? 'Concevoir et dimensionner ce tableau dans l\'Atelier Projet :' 
                : 'Design and size this switchboard in the Design Workbench:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('TGBT_ARCHITECTURE')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Architecture TGBT & Formes' : 'TGBT Architecture & Forms'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('FORM_SEPARATION_IP_IK')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Audit Formes & IP/IK' : 'Forms & IP/IK Audit'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
