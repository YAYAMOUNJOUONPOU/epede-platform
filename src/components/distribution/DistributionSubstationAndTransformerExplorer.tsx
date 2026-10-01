// src/components/distribution/DistributionSubstationAndTransformerExplorer.tsx
// EPEDE D05 - Distribution Substations & MV/LV Transformers Explorer

import React, { useState } from 'react';
import {
  Activity,
  Building2,
  Layers,
  Zap,
  ShieldAlert,
  Flame,
  Thermometer,
  Sliders,
  CheckCircle2,
  Info,
  Droplets,
  Wind
} from 'lucide-react';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import {
  DISTRIBUTION_APPARATUS_CATALOG,
  type DistributionApparatus
} from './data/distributionEquipmentCatalog';

interface DistributionSubstationAndTransformerExplorerProps {
  locale: 'fr' | 'en';
}

export const DistributionSubstationAndTransformerExplorer: React.FC<DistributionSubstationAndTransformerExplorerProps> = ({
  locale
}) => {
  const [selectedSubstationType, setSelectedSubstationType] = useState<'KIOSK' | 'POLE_H61' | 'INDOOR'>('KIOSK');
  const [selectedTapPosition, setSelectedTapPosition] = useState<number>(3); // 1 = +5%, 2 = +2.5%, 3 = Nominal 0%, 4 = -2.5%, 5 = -5%
  const [coolingMode, setCoolingMode] = useState<'OIL_ONAN' | 'DRY_RESIN'>('OIL_ONAN');
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [activeInfographicTab, setActiveInfographicTab] = useState<string>('transformer_nameplate');

  const transformerApparatus = DISTRIBUTION_APPARATUS_CATALOG.find(a => a.id === 'EQ-TRANSFO-DISTRIB')!;

  const tapLabels: Record<number, { label: string; ratio: string; vsec: string }> = {
    1: { label: '+5.0% (Plot 1)', ratio: '31 500 V / 400 V', vsec: '380 V (Compense forte tension)' },
    2: { label: '+2.5% (Plot 2)', ratio: '30 750 V / 400 V', vsec: '390 V' },
    3: { label: '0.0% Nominal (Plot 3)', ratio: '30 000 V / 400 V', vsec: '400 V (Tension Nominale)' },
    4: { label: '-2.5% (Plot 4)', ratio: '29 250 V / 400 V', vsec: '410 V' },
    5: { label: '-5.0% (Plot 5)', ratio: '28 500 V / 400 V', vsec: '420 V (Compense forte chute de tension)' }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Visual Reference: Engineering Infographics for Distribution Transformers */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveInfographicTab('transformer_nameplate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeInfographicTab === 'transformer_nameplate'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {locale === 'fr' ? '1. Plaque Signalétique' : '1. Transformer Nameplate'}
          </button>
          <button
            type="button"
            onClick={() => setActiveInfographicTab('how_a_transformer_works')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeInfographicTab === 'how_a_transformer_works'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {locale === 'fr' ? '2. Fonctionnement Transfo' : '2. How Transformer Works'}
          </button>
          <button
            type="button"
            onClick={() => setActiveInfographicTab('transmission_vs_distribution')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeInfographicTab === 'transmission_vs_distribution'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {locale === 'fr' ? '3. Transport vs Distribution' : '3. Transmission vs Dist'}
          </button>
        </div>

        <EngineeringInfographicCard
          infographicId={activeInfographicTab}
          locale={locale}
          onOpenModal={(id) => setModalInfographicId(id)}
        />
      </div>

      {/* 1. Substation Typology Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'KIOSK',
            name_fr: 'Poste Kiosque Préfabriqué Béton',
            name_en: 'Prefabricated Concrete Kiosk Substation',
            tag: '250 - 1000 kVA',
            app_fr: 'Poste urbain monobloc à couloir ou manœuvre externe, équipé RMU + Transfo + TUR.',
            app_en: 'Urban compact kiosk with external access, housing RMU + Transformer + LV board.'
          },
          {
            id: 'POLE_H61',
            name_fr: 'Poste Perché sur Poteau (H61)',
            name_en: 'Pole-Mounted Substation (H61)',
            tag: '50 - 160 kVA',
            app_fr: 'Poste économique pour électrification rurale fixé sur support béton/bois.',
            app_en: 'Economical rural electrification transformer mounted directly on pole crossarms.'
          },
          {
            id: 'INDOOR',
            name_fr: 'Poste en Cabine Maçonnée Intérieure',
            name_en: 'Indoor Masonry Vault Substation',
            tag: '630 - 2500 kVA',
            app_fr: 'Intégré au sous-sol d\'immeubles denses ou d\'usines avec ventilation coupe-feu.',
            app_en: 'Integrated in building basements or industrial plants with fire dampers.'
          }
        ].map((type) => {
          const isSelected = type.id === selectedSubstationType;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedSubstationType(type.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xl shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-[#090D15] text-slate-300 border-[#222B38] hover:border-amber-500/50 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {type.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold mt-1">
                  {locale === 'fr' ? type.name_fr : type.name_en}
                </h3>
                <p className={`text-xs mt-1.5 font-sans leading-relaxed ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                  {locale === 'fr' ? type.app_fr : type.app_en}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Distribution Transformer Deep Electromagnetic Anatomy */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293B] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2533]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
                Dyn11 · 30 kV / 400 V - 230 V
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-xs font-bold">
                630 kVA (In = 909 A BT)
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {locale === 'fr'
                ? 'ANATOMIE & RÉGLAGE DU TRANSFORMATEUR MT/BT'
                : 'MV/LV TRANSFORMER ANATOMY & REGULATION'}
            </h2>
          </div>

          {/* Cooling Medium Toggle (Oil ONAN vs. Dry Resin) */}
          <div className="flex items-center gap-2 bg-[#06080E] p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold px-2">
              {locale === 'fr' ? 'Technologie :' : 'Technology:'}
            </span>
            <button
              type="button"
              onClick={() => setCoolingMode('OIL_ONAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                coolingMode === 'OIL_ONAN'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Huile Minérale (ONAN)' : 'Mineral Oil (ONAN)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCoolingMode('DRY_RESIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                coolingMode === 'DRY_RESIN'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Sec Enrobé Résine (AN)' : 'Cast-Resin (Dry Type)'}</span>
            </button>
          </div>
        </div>

        {/* Off-Circuit Tap Changer (OCTC) Interactive Regulator */}
        <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'Commutateur de Réglage Hors Tension (5 Plots OCTC)'
                  : 'Off-Circuit Tap Changer Regulation (5-Position OCTC)'}
              </h4>
            </div>
            <span className="text-xs text-amber-300 font-bold">
              {tapLabels[selectedTapPosition].label} · Rapport : {tapLabels[selectedTapPosition].ratio}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Le commutateur permet d\'ajuster le nombre de spires de l\'enroulement primaire pour compenser les variations saisonnières ou géographiques de tension en bout d\'artère.'
              : 'The manual tap changer alters the primary winding turn count to compensate for line voltage drop along distant rural feeder endpoints.'}
          </p>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((plot) => (
              <button
                key={plot}
                type="button"
                onClick={() => setSelectedTapPosition(plot)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedTapPosition === plot
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#0E1522] text-slate-300 border-[#222D40] hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-bold">Plot {plot}</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  {plot === 1 ? '+5%' : plot === 2 ? '+2.5%' : plot === 3 ? '0%' : plot === 4 ? '-2.5%' : '-5%'}
                </div>
              </button>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-[#070A10] border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>{locale === 'fr' ? 'Tension Secondaire à Vide Résultante :' : 'Resulting Secondary No-Load Voltage:'}</span>
            <span className="font-bold text-emerald-400">{tapLabels[selectedTapPosition].vsec}</span>
          </div>
        </div>

        {/* Protection DGPT2 vs. Thermal PT100 Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Protection Multifonction DGPT2 / DMCR :' : 'DGPT2 / DMCR Integrated Protection:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'Combine dans un boîtier unique étanche monté sur le couvercle de la cuve : 1 flotteur émission de gaz (D), 1 pressostat de surpression interne (P), 1 thermostat d\'alarme température 85°C (T1) et 1 thermostat de déclenchement 95°C (T2).'
                : 'Integrates into a single sealed assembly on the tank cover: 1 gas accumulation float (D), 1 internal pressure switch (P), 1 oil temperature alarm switch at 85°C (T1), and 1 high temperature trip switch at 95°C (T2).'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Couplage Dyn11 & Gestion du Neutre :' : 'Dyn11 Vector Group & Neutral Grounding:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'Le primaire en triangle isole les harmoniques de rang 3 générées par les charges électroniques ; le secondaire en étoile offre un point neutre direct permettant de créer les réseaux triphasés 400 V + neutre 230 V.'
                : 'The delta primary traps zero-sequence 3rd harmonic currents; the star secondary provides an accessible neutral conductor enabling 400 V 3-phase and 230 V single-phase dual supply.'}
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}
    </div>
  );
};
