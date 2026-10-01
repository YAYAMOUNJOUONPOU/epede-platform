// src/components/distribution/MvPowerFlowVisualizer.tsx
// EPEDE D05 - Interactive Medium-Voltage Power-Flow Visualizer & Apparatus Explorer
// Bridges the complete path from Substation to Transformer with Overhead vs Underground real-time simulation.

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sliders,
  Building2,
  Box,
  AlertTriangle,
  Info,
  CheckCircle2,
  Maximize2,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';
import { DISTRIBUTION_APPARATUS_CATALOG, type DistributionApparatus } from './data/distributionEquipmentCatalog';

export type MvDeliveryMode = 'OVERHEAD' | 'UNDERGROUND' | 'HYBRID_URBAN';

interface MvPowerFlowVisualizerProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
  onSelectApparatus?: (apparatusId: string) => void;
  onNavigateToTransformer?: () => void;
  className?: string;
}

export const MvPowerFlowVisualizer: React.FC<MvPowerFlowVisualizerProps> = ({
  locale,
  onSelectEquipment,
  onSelectApparatus,
  onNavigateToTransformer,
  className = ''
}) => {
  const [deliveryMode, setDeliveryMode] = useState<MvDeliveryMode>('UNDERGROUND');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [inspectedApparatusId, setInspectedApparatusId] = useState<string>('EQ-TABLEAU-RMU');
  const [isPowerFlowAnimated, setIsPowerFlowAnimated] = useState<boolean>(true);

  const overheadSteps = [
    {
      id: 'step-post-src',
      code: 'POSTE_SOURCE_30KV',
      title: { fr: 'Poste Source 225/30 kV', en: '225/30 kV Primary Substation' },
      apparatusId: 'EQ-DISJONCTEUR-DEPART',
      type: { fr: 'Départ Rame HTB/HTA', en: 'MV Feeder Bay' },
      specs: '30 kV · 630 A · 25 kA / 1s',
      icon: Building2
    },
    {
      id: 'step-feeder-oh',
      code: 'LIGNE_AERIENNE_30KV',
      title: { fr: 'Ligne Aérienne Almelec 148 mm²', en: 'Overhead 148 mm² Almelec Line' },
      apparatusId: 'EQ-DISJONCTEUR-DEPART',
      type: { fr: 'Conducteur Nu sur Isolateurs', en: 'Bare Conductor on Pin Insulators' },
      specs: '30 kV · 380 A admissible',
      icon: Zap
    },
    {
      id: 'step-recloser',
      code: 'REENCLENCHEUR_ACR',
      title: { fr: 'Disjoncteur Réenclencheur ACR', en: 'Auto-Circuit Recloser (ACR)' },
      apparatusId: 'EQ-ACR-AUTO-RECLOSER',
      type: { fr: 'Coupure Réseau Aérien', en: 'Overhead Feeder Switching' },
      specs: 'Cycle O-0.3s-CO-15s-CO · 630 A',
      icon: Sliders
    },
    {
      id: 'step-arrester-oh',
      code: 'PARAFOUDRE_ZNO_30KV',
      title: { fr: 'Parafoudres ZnO Ligne & H61', en: 'ZnO Surge Arresters 30 kV' },
      apparatusId: 'EQ-PARAFOUDRE-HTA',
      type: { fr: 'Protection Surtensions Foudre', en: 'Lightning Surge Protection' },
      specs: 'Ur 36 kV · In 10 kA (8/20 µs)',
      icon: Shield
    },
    {
      id: 'step-trafo-h61',
      code: 'TRANSFO_HAUT_DE_POTEAU',
      title: { fr: 'Poste Haut de Poteau H61 160 kVA', en: 'Pole-Mounted H61 160 kVA Trafo' },
      apparatusId: 'EQ-TRANSFO-H61',
      type: { fr: 'Transformation 30 kV / 400 V', en: 'Step-Down 30 kV / 400 V' },
      specs: '160 kVA · 30 kV / 400 V Dyn11',
      icon: Layers
    },
    {
      id: 'step-lv-grid-oh',
      code: 'RESEAU_BT_TORSADE',
      title: { fr: 'Départ BT Câble Torsadé 3x70+54.6', en: 'LV Aerial Bundled Conductor (ABC)' },
      apparatusId: 'EQ-TABLEAU-TUR',
      type: { fr: 'Distribution Basse Tension', en: 'Low-Voltage Distribution' },
      specs: '400 V / 230 V · 200 A',
      icon: Box
    }
  ];

  const undergroundSteps = [
    {
      id: 'step-sub-incomer',
      code: 'CELLULE_METALLOCLAD',
      title: { fr: 'Cellule Départ MT Metal-Clad 30 kV', en: '30 kV Metal-Clad Feeder Cubicle' },
      apparatusId: 'EQ-DISJONCTEUR-DEPART',
      type: { fr: 'Disjoncteur Vide Débrochable', en: 'Withdrawable Vacuum Breaker' },
      specs: '30 kV · 1250 A · 25 kA / 1s',
      icon: Building2
    },
    {
      id: 'step-cable-ug',
      code: 'CABLE_SOUTERRAIN_PRC',
      title: { fr: 'Liaison Câble Souterrain 3x240 mm² Al', en: '3x240 mm² Al XLPE Underground Cable' },
      apparatusId: 'EQ-DISJONCTEUR-DEPART',
      type: { fr: 'Isolation PRC sous tranchée', en: 'XLPE Insulation in Trench' },
      specs: '30 kV (18/30 kV) · 410 A',
      icon: Zap
    },
    {
      id: 'step-fpi-indicator',
      code: 'DETECTEUR_DEFAUT_FPI',
      title: { fr: 'Détecteur de Défaut Directionnel FPI', en: 'Fault Passage Indicator (FPI)' },
      apparatusId: 'EQ-DETECTEUR-FPI',
      type: { fr: 'Signalisation Télécommandée', en: 'Remote SCADA Fault Detection' },
      specs: 'Toroid CTs · GSM / 4G / Modbus',
      icon: Activity
    },
    {
      id: 'step-rmu-ring',
      code: 'TABLEAU_RMU_2L1T',
      title: { fr: 'Tableau Urbain Compact RMU 3 Voies', en: 'Compact 3-Way RMU (2L+1T)' },
      apparatusId: 'EQ-TABLEAU-RMU',
      type: { fr: 'Boucle Urbaine 2L + 1T Transfo', en: 'Ring In/Out + Trafo Protection' },
      specs: '30 kV · 630 A (L) / 200 A (T)',
      icon: Sliders
    },
    {
      id: 'step-trafo-kiosk',
      code: 'POSTE_TRANSFO_CABINE',
      title: { fr: 'Poste Kiosque Compact 630 kVA', en: 'Ground-Mounted Kiosk 630 kVA' },
      apparatusId: 'EQ-TRANSFO-IMMERGE',
      type: { fr: 'Huile Minérale / Sec Enrobé', en: 'ONAN Mineral Oil / Dry Resin' },
      specs: '630 kVA · 30 kV / 400 V Dyn11',
      icon: Layers
    },
    {
      id: 'step-tur-board',
      code: 'TABLEAU_URBAIN_TUR',
      title: { fr: 'Tableau Urbain Réduit (TUR 4/8 Départs)', en: 'LV Distribution Feeder Pillar (TUR)' },
      apparatusId: 'EQ-TABLEAU-TUR',
      type: { fr: 'Départs BT Fusibles HPC 250 A', en: 'LV Outgoing HPC Fuse-Ways' },
      specs: '400 V · 1000 A Incomer',
      icon: Box
    }
  ];

  const currentSteps = deliveryMode === 'OVERHEAD' ? overheadSteps : undergroundSteps;

  const handleSelectStep = (idx: number, appaId: string) => {
    soundEffects.playSwitchClick();
    setActiveStepIndex(idx);
    setInspectedApparatusId(appaId);
  };

  const inspectedApparatus =
    DISTRIBUTION_APPARATUS_CATALOG.find((a) => a.id === inspectedApparatusId) ||
    DISTRIBUTION_APPARATUS_CATALOG[1];

  return (
    <div className={`rounded-2xl bg-[#090D15] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Top Bar: Title & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Zap className="h-4 w-4" />
            <span>{locale === 'fr' ? 'SIMULATEUR DE TRANSIT DE PUISSANCE HTA · 30 kV' : 'MV 30 kV POWER-FLOW & APPARATUS PIPELINE'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Du Poste Source au Réseau Basse Tension' : 'From Primary Grid Substation to LV Network'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Suivez le trajet de l\'énergie électrique en moyenne tension, comparez les technologies aériennes et souterraines et inspectez chaque organe fonctionnel.'
              : 'Trace MV power delivery, contrast overhead vs underground technologies, and inspect individual functional organs.'}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setDeliveryMode('UNDERGROUND');
              setActiveStepIndex(0);
              setInspectedApparatusId('EQ-TABLEAU-RMU');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deliveryMode === 'UNDERGROUND'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? '🏙️ Réseau Souterrain (Urbain / RMU)' : '🏙️ Underground (Urban / RMU)'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setDeliveryMode('OVERHEAD');
              setActiveStepIndex(0);
              setInspectedApparatusId('EQ-ACR-AUTO-RECLOSER');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deliveryMode === 'OVERHEAD'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? '🌾 Réseau Aérien (Poteaux / H61)' : '🌾 Overhead (Poles / H61)'}
          </button>
        </div>
      </div>

      {/* Dynamic Animated Power Flow Line */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{locale === 'fr' ? 'LIGNE DE DISTRIBUTION EN CHARGE (FLUX DE PUISSANCE 30 kV) :' : 'ENERGIZED 30 kV DISTRIBUTION LINE FLOW:'}</span>
          </span>
          <span className="text-cyan-400 font-mono">
            {deliveryMode === 'UNDERGROUND' ? '30 kV Câble PRC Cu/Al · Boucle Ouverte' : '30 kV Almelec Aster · Antenne Radiale'}
          </span>
        </div>

        {/* Pipeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {currentSteps.map((stp, idx) => {
            const IconC = stp.icon;
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={stp.id}
                onClick={() => handleSelectStep(idx, stp.apparatusId)}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg scale-102'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    0{idx + 1}
                  </span>
                  <IconC className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-tight font-mono ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {stp.title[locale]}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans line-clamp-1">{stp.type[locale]}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-cyan-300">
                  <span>{stp.specs}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Apparatus Engineering Dossier Panel */}
      {inspectedApparatus && (
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-5">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                  {inspectedApparatus.category}
                </span>
                <span className="text-xs text-slate-400 font-bold font-mono">{inspectedApparatus.code}</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase font-mono">
                {locale === 'fr' ? inspectedApparatus.name_fr : inspectedApparatus.name_en}
              </h3>
              <p className="text-xs text-slate-300 font-sans max-w-2xl leading-relaxed">
                {locale === 'fr' ? inspectedApparatus.purpose_fr : inspectedApparatus.purpose_en}
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-col gap-2 shrink-0">
              <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard={inspectedApparatus.standards[0]} />
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Tension & Tenue :' : 'Voltage Rating:'}</span>
                <span className="text-cyan-300 font-bold">{inspectedApparatus.voltage_level}</span>
              </div>
            </div>
          </div>

          {/* 3-Column Technical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Column 1: Principle & Construction */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Sliders className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Principe & Construction' : 'Working Principle & Build'}</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <p className="text-slate-300 leading-relaxed">
                  {locale === 'fr' ? inspectedApparatus.operating_principle_fr : inspectedApparatus.operating_principle_en}
                </p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase mb-1">
                    {locale === 'fr' ? 'Composants Internes :' : 'Internal Components:'}
                  </span>
                  <ul className="space-y-1">
                    {(locale === 'fr' ? inspectedApparatus.components_list_fr : inspectedApparatus.components_list_en).map((c, i) => (
                      <li key={i} className="text-slate-300 text-[10px] flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Protection & Safety */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-rose-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Protection, Terre & Défaillances' : 'Protection, Earth & Fault Modes'}</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Rôle de Protection :' : 'Protection Role:'}</span>
                  <span className="text-slate-200">{locale === 'fr' ? inspectedApparatus.protection_fr : inspectedApparatus.protection_en}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Régime de Terre / SLT :' : 'Earthing Context:'}</span>
                  <span className="text-amber-300">{locale === 'fr' ? inspectedApparatus.earthing_fr : inspectedApparatus.earthing_en}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-rose-400 block font-bold text-[10px] uppercase mb-1">
                    {locale === 'fr' ? 'Modes de Défaillance :' : 'Critical Failure Modes:'}
                  </span>
                  <ul className="space-y-1">
                    {(locale === 'fr' ? inspectedApparatus.failure_modes_fr : inspectedApparatus.failure_modes_en).map((f, i) => (
                      <li key={i} className="text-rose-300/90 text-[10px] flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">⚠️</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 3: Specs & Maintenance */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Spécifications & Maintenance' : 'Specs & Commissioning'}</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  {Object.entries(inspectedApparatus.representative_specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{k} :</span>
                      <span className="text-emerald-300 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Maintenance & Essais :' : 'Maintenance & Tests:'}</span>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    {locale === 'fr' ? inspectedApparatus.maintenance_fr : inspectedApparatus.maintenance_en}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inspectedApparatus.standards.map((std, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
