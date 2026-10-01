// src/components/distribution/LowVoltageAndConsumerJourney.tsx
// EPEDE D05 - Low-Voltage Distribution & Final Consumer Interface Explorer

import React, { useState } from 'react';
import {
  Home,
  Zap,
  ShieldCheck,
  Building2,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  Radio,
  Wifi,
  Power
} from 'lucide-react';
import {
  DISTRIBUTION_APPARATUS_CATALOG,
  type DistributionApparatus
} from './data/distributionEquipmentCatalog';

interface LowVoltageAndConsumerJourneyProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
}

export const LowVoltageAndConsumerJourney: React.FC<LowVoltageAndConsumerJourneyProps> = ({
  locale,
  onNavigate
}) => {
  const [selectedConsumerProfile, setSelectedConsumerProfile] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL_SME'>('RESIDENTIAL');

  const meterApparatus = DISTRIBUTION_APPARATUS_CATALOG.find(a => a.id === 'EQ-BRANCHEMENT-COMPTAGE')!;

  const profiles = {
    RESIDENTIAL: {
      title_fr: 'Abonné Résidentiel Monophasé (6 à 12 kVA)',
      title_en: 'Single-Phase Residential Consumer (6 to 12 kVA)',
      voltage: '230 V monophasé (Phase + Neutre)',
      breaker_rating: 'Disjoncteur 30-60 A (Différentiel 500 mA)',
      loads_fr: 'Électroménager, éclairage LED, pompe à chaleur, borne de recharge VE monophasée 7.4 kW.',
      loads_en: 'Household appliances, LED lighting, heat pump, single-phase 7.4 kW EV wallbox.',
      earthing: 'Régime TT obligatoire : terre des masses locale indépendante du neutre distributeur.'
    },
    COMMERCIAL: {
      title_fr: 'Commerce & Tertiaire Triphasé (18 à 36 kVA)',
      title_en: 'Three-Phase Commercial Consumer (18 to 36 kVA)',
      voltage: '400 V triphasé + Neutre',
      breaker_rating: 'Disjoncteur tétrapolaire 30-60 A',
      loads_fr: 'Climatisation centrale réversible, fours de boulangerie, éclairage commercial, bornes doubles 22 kW.',
      loads_en: 'Central HVAC, commercial bakery ovens, storefront display lighting, dual 22 kW EV chargers.',
      earthing: 'Régime TT ou TN-S selon présence de poste privatif ou raccordement sur réseau public.'
    },
    INDUSTRIAL_SME: {
      title_fr: 'PME & Atelier Industriel (36 à 160 kVA Tarif Jaune)',
      title_en: 'Small Industrial / SME Workshop (36 to 160 kVA)',
      voltage: '400 V triphasé équilibré',
      breaker_rating: 'Disjoncteur boîtier moulé (MCCB) 100-250 A',
      loads_fr: 'Machines-outils à commande numérique, ponts roulants, compresseurs d\'air, variateurs de vitesse.',
      loads_en: 'CNC machine tools, overhead cranes, air compressors, variable frequency drives.',
      earthing: 'Régime TN-S / TN-C avec transformateur dédié ou branchement à puissance surveillée.'
    }
  };

  const activeProfile = profiles[selectedConsumerProfile];

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header with Link to D06 */}
      <div className="p-4 rounded-2xl bg-[#080C14] border border-[#1E2738] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? 'DU RÉSEAU BASSE TENSION AU DISJONCTEUR CLIENT'
                : 'LOW-VOLTAGE NETWORK TO CONSUMER SERVICE ENTRANCE'}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {locale === 'fr'
                ? 'La frontière exacte où la distribution publique s\'arrête et où l\'installation électrique privative commence'
                : 'The exact physical boundary where public distribution ends and private installation begins'}
            </p>
          </div>
        </div>

        {/* Action button to explore D06 Electrical Installations */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('domain', 'D06')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <span>{locale === 'fr' ? 'Explorer Domaine D06 (Installations)' : 'Explore Domain D06'}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 2. Consumer Connection Profiles Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL_SME'] as const).map((profKey) => {
          const isSelected = selectedConsumerProfile === profKey;
          const p = profiles[profKey];
          return (
            <button
              key={profKey}
              type="button"
              onClick={() => setSelectedConsumerProfile(profKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xl shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-[#090D15] text-slate-300 border-[#20293A] hover:border-amber-500/40 hover:text-white'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">
                  {p.voltage}
                </div>
                <h4 className="text-xs font-bold">{p.title_fr}</h4>
              </div>
              <div className="mt-3 pt-2 border-t border-black/10 text-[11px] font-sans">
                {p.breaker_rating}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Anatomy of the Service Interface Chain */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
          <Layers className="h-4 w-4 text-amber-400" />
          <span>
            {locale === 'fr'
              ? 'Chaîne d\'Appareillages du Branchement d\'Abonné'
              : 'Apparatus Chain of the Consumer Service Connection'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            {
              step: '1. Raccordement Réseau',
              title: 'Dérivation Réseau BT',
              desc: 'Câble souterrain armé ou câble aérien torsadé piquage en façade par connecteurs perforants.',
              owner: 'Distributeur'
            },
            {
              step: '2. Coupe-Circuit CCPI',
              title: 'Fusibles CCPI (AD)',
              desc: 'Coffret plombé équipé de fusibles cylindriques d\'accompagnement (protection contre les courts-circuits violents).',
              owner: 'Distributeur (Plombé)'
            },
            {
              step: '3. Comptage Fiscal',
              title: 'Compteur Communicant',
              desc: 'Enregistrement de l\'énergie active (kWh), réactive (kVARh) et transmission télé-relevée par CPL ou 4G.',
              owner: 'Distributeur (Plombé)'
            },
            {
              step: '4. Disjoncteur AGCP',
              title: 'Disjoncteur de Branchement',
              desc: 'Organe de coupure d\'urgence générale à disposition de l\'abonné, déclencheur différentiel 500 mA sélectif (S).',
              owner: 'Frontière Distributeur / Abonné'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0C111C] border border-[#222E42] space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-amber-400">{item.step}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">{item.owner}</span>
              </div>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Profile Active Electrical Characteristics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#222E42] space-y-2">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Charges & Récepteurs Types :' : 'Representative Consumer Loads:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {activeProfile.loads_fr}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#222E42] space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Régime de Neutre & Protection des Personnes :' : 'Earthing & Life Safety Scheme:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {activeProfile.earthing}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
