// src/components/grid/modules/CameroonDistributionNetworkViewer.tsx
// Comprehensive MV (30/15/20 kV) and LV (400/230 V) Distribution Network Reference Module for Cameroon

import React, { useState } from 'react';
import { CAMEROON_DISTRIBUTION_SPECS } from '../../../data/cameroonGridData';
import {
  Zap,
  ShieldAlert,
  Gauge,
  Cable,
  Box,
  Home,
  Sun,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CameroonDistributionNetworkViewerProps {
  locale: 'fr' | 'en';
}

export const CameroonDistributionNetworkViewer: React.FC<CameroonDistributionNetworkViewerProps> = ({
  locale,
}) => {
  const [selectedVoltageTab, setSelectedVoltageTab] = useState<'mv_30_15' | 'substations_h61' | 'lv_meters_losses' | 'rural_perace'>('mv_30_15');
  const specs = CAMEROON_DISTRIBUTION_SPECS;

  return (
    <div className="space-y-6">
      {/* Header & KPI Strip */}
      <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>
                {locale === 'fr'
                  ? 'RÉSEAUX DE DISTRIBUTION PUBLIQUE HTA (30/15 kV) & BT (400/230 V) — ENEO & AER'
                  : 'PUBLIC MV (30/15 kV) & LV (400/230 V) DISTRIBUTION NETWORK — ENEO & AER'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white mt-1">
              {locale === 'fr'
                ? 'Architecture de la Distribution Électrique au Cameroun'
                : 'Cameroon Medium & Low-Voltage Distribution Engineering'}
            </h2>
            <p className="text-xs text-[#A9ADA5] mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Documentation technique vérifiée des niveaux de tension HTA/BT exploités par Eneo Cameroon, des postes H61 sur poteau et cabines maçonnées, des câbles torsadés, du comptage prépayé STS et de la structure des pertes.'
                : 'Verified technical reference of MV/LV voltage levels operated by Eneo Cameroon, H61 pole-mounted and cabin substations, aerial bundled cables, STS prepayment metering, and technical/commercial loss breakdown.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-2.5 text-center">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">HTA Standard</span>
              <span className="font-mono text-sm font-black text-emerald-400">30 kV / 15 kV</span>
            </div>
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-2.5 text-center">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Basse Tension</span>
              <span className="font-mono text-sm font-black text-sky-400">400 / 230 V</span>
            </div>
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-2.5 text-center">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Couplage HTA/BT</span>
              <span className="font-mono text-sm font-black text-amber-400">Dyn11 (50 Hz)</span>
            </div>
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-2.5 text-center">
              <span className="block font-mono text-[10px] text-slate-400 uppercase">Pertes Globales</span>
              <span className="font-mono text-sm font-black text-rose-400">~{specs.metering_and_losses.total_loss_percent}%</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: 'mv_30_15',
              labelFr: '1. Réseaux HTA (30 kV vs 15 kV) & Câbles',
              labelEn: '1. MV Feeders (30 kV vs 15 kV) & Cables',
            },
            {
              id: 'substations_h61',
              labelFr: '2. Postes HTA/BT (H61 Poteau, Cabines & RMU)',
              labelEn: '2. MV/LV Substations (H61 Pole, Cabins & RMUs)',
            },
            {
              id: 'lv_meters_losses',
              labelFr: '3. Basse Tension 400/230 V, Compteurs STS & Pertes',
              labelEn: '3. LV 400/230 V, STS Prepayment & Grid Losses',
            },
            {
              id: 'rural_perace',
              labelFr: '4. Électrification Rurale (AER / PERACE & Mini-Grids)',
              labelEn: '4. Rural Electrification (AER / PERACE & Mini-Grids)',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedVoltageTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedVoltageTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
              }`}
            >
              {locale === 'fr' ? tab.labelFr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* TAB 1: MV 30 kV vs 15 kV */}
        {selectedVoltageTab === 'mv_30_15' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-emerald-400 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Niveaux de Tension HTA Vérifiés au Cameroun'
                  : 'Verified MV Voltage Levels in Cameroon'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-[#151C1E] border border-emerald-500/30">
                  <div className="font-mono font-bold text-emerald-300 mb-1">
                    • 30 kV (Tension d’isolement assignée Ur = 36 kV — CEI 62271)
                  </div>
                  <p>
                    {locale === 'fr'
                      ? 'Tension HTA normalisée pour toutes les artères périurbaines, interurbaines, régionales et rurales sur les 10 régions (RIS et RIN), ainsi que pour les nouveaux postes sources (Nyom II 225/30 kV, Kribi 225/30 kV, Bertoua 90/30 kV).'
                      : 'Standardized MV voltage across all peri-urban, interurban, regional, and rural feeders across all 10 regions (RIS and RIN), as well as new primary substations (Nyom II 225/30 kV, Kribi 225/30 kV).'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#151C1E] border border-sky-500/30">
                  <div className="font-mono font-bold text-sky-300 mb-1">
                    • 15 kV (Tension d’isolement assignée Ur = 24 kV — CEI 62271)
                  </div>
                  <p>
                    {locale === 'fr'
                      ? 'Tension historique des réseaux souterrains et aéro-souterrains des cœurs métropolitains de Douala (postes de Bassa, Koumassi, Deïdo, Bonabéri, Logbaba) et de Yaoundé (Oyomabang, BRGM, Ngousso, Kondengui).'
                      : 'Historical urban MV level used across dense underground XLPE and overhead networks in central Douala (Bassa, Koumassi, Deïdo, Bonabéri, Logbaba) and central Yaoundé (Oyomabang, BRGM, Ngousso, Kondengui).'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <div className="font-mono font-bold text-amber-300 mb-1">
                    • Régime de Neutre HTA
                  </div>
                  <p>{specs.medium_voltage_levels.system_earthing}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-sky-400 flex items-center gap-2">
                <Cable className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Canalisations Aériennes, Souterraines & Appareillages de Ligne'
                  : 'Overhead Conductors, Underground Cables & Line Switchgear'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-1">
                    {locale === 'fr' ? 'Lignes Aériennes HTA :' : 'Overhead MV Lines:'}
                  </strong>
                  {specs.conductors.overhead_mv}
                </div>
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-1">
                    {locale === 'fr' ? 'Réseaux Souterrains Urbains HTA :' : 'Urban Underground MV Cables:'}
                  </strong>
                  {specs.conductors.underground_mv}
                </div>
                <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-1">
                    {locale === 'fr' ? 'Automatisation & Protection de Départ :' : 'Feeder Automation & Reclosers:'}
                  </strong>
                  {specs.switchgear_and_protection.reclosers}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: H61 & CABIN SUBSTATIONS */}
        {selectedVoltageTab === 'substations_h61' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-amber-400 flex items-center gap-2">
                <Box className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Postes sur Poteau Type H61 & Postes en Cabine Maçonnée (H59)'
                  : 'H61 Pole-Mounted Transformers & Ground-Mounted Cabins'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-amber-300 block font-mono mb-1">
                    1. Poste H61 sur Poteau (50, 100, 160 kVA) :
                  </strong>
                  {specs.transformers.pole_mounted}. Protégé en amont par 3 parafoudres à oxyde de zinc (ZnO) et un sectionneur aérien, et en aval par un disjoncteur BT sur poteau (type D165/D265) ou coffret fusibles HPC.
                </p>
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-emerald-300 block font-mono mb-1">
                    2. Poste en Cabine Basse / Préfabriqué (250, 400, 630, 1000 kVA) :
                  </strong>
                  {specs.transformers.cabin_ground_mounted}. Raccordé en coupure d’artère (boucle ouverte) sur le réseau souterrain 15 kV ou 30 kV.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {specs.transformers.standard_kva_ratings.map((kva) => (
                    <span
                      key={kva}
                      className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold"
                    >
                      {kva} kVA (Dyn11)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-purple-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Cellules HTA Modulaires & Tableaux Compacts RMU'
                  : 'Modular MV Switchgear & Compact Ring Main Units (RMUs)'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-1">
                    Architecture Coupure d’Artère (2 Arrivées + 1 Protection Transfo) :
                  </strong>
                  {specs.switchgear_and_protection.rmu_type}
                </p>
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-1">
                    Protection Transformateur :
                  </strong>
                  {specs.switchgear_and_protection.fuse_switch_ratings}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LV, STS METERS & LOSSES */}
        {selectedVoltageTab === 'lv_meters_losses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-sky-400 flex items-center gap-2">
                <Home className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Basse Tension (400/230 V), Torsadé BT & Comptage Prépayé STS'
                  : 'Low Voltage (400/230 V), Twisted ABC Cables & STS Prepayment Meters'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-sky-300 block font-mono mb-1">
                    Câbles Préassemblés Torsadés BT (NFC 33-209) :
                  </strong>
                  {specs.conductors.overhead_lv}
                </p>
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-emerald-300 block font-mono mb-1">
                    Compteurs Prépayés STS (Standard Transfer Specification) :
                  </strong>
                  {specs.metering_and_losses.prepayment_standard}
                </p>
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38]">
                  <strong className="text-amber-300 block font-mono mb-1">
                    Schéma des Liaisons à la Terre (SLT) :
                  </strong>
                  {specs.low_voltage_levels.system_earthing}
                </p>
              </div>
            </div>

            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {locale === 'fr'
                  ? 'Analyse des Pertes Techniques & Non-Techniques (Commerciales)'
                  : 'Technical vs. Non-Technical (Commercial) Distribution Losses'}
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40">
                    <span className="block font-mono text-[10px] text-rose-300 uppercase">Pertes Totales</span>
                    <span className="font-mono text-lg font-black text-white">
                      {specs.metering_and_losses.total_loss_percent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40">
                    <span className="block font-mono text-[10px] text-amber-300 uppercase">Pertes Techniques</span>
                    <span className="font-mono text-lg font-black text-amber-300">
                      {specs.metering_and_losses.technical_loss_percent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/40">
                    <span className="block font-mono text-[10px] text-purple-300 uppercase">Non-Techniques</span>
                    <span className="font-mono text-lg font-black text-purple-300">
                      {specs.metering_and_losses.commercial_loss_percent}%
                    </span>
                  </div>
                </div>
                <p className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38] leading-relaxed">
                  <strong className="text-white block font-mono mb-1">
                    {locale === 'fr' ? 'Programme d’Assainissement Réseau :' : 'Loss Reduction Engineering Program:'}
                  </strong>
                  {specs.metering_and_losses.loss_reduction_strategy}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RURAL ELECTRIFICATION PERACE / AER */}
        {selectedVoltageTab === 'rural_perace' && (
          <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
            <h3 className="font-mono text-sm font-black uppercase text-amber-400 flex items-center gap-2">
              <Sun className="w-4 h-4" />
              {locale === 'fr'
                ? 'Électrification Rurale, Mini-Réseaux Solaires Hybrides & Programme PERACE'
                : 'Rural Electrification, Solar Hybrid Mini-Grids & World Bank PERACE Program'}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {specs.rural_electrification.isolated_grids}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {specs.rural_electrification.financing_partners.map((partner) => (
                <span
                  key={partner}
                  className="px-3 py-1 rounded-lg bg-[#151C1E] border border-[#567A87]/40 text-xs font-mono text-slate-300"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

