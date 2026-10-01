// src/components/transmission/EpedeDataReuseMap.tsx
// EPEDE D03 - Data Reuse Map from Existing EPEDE Modules & Systemic Cross-Links

import React, { useState } from 'react';
import {
  Share2,
  ArrowRight,
  Database,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  GitFork,
  Cpu,
  Code2,
  Copy,
  Check,
  FileJson
} from 'lucide-react';
import { EPEDE_MODULE_REUSE_MAP } from './data/transmissionData';
import type { EpedeModuleReuse } from './types';

interface EpedeDataReuseMapProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
}

const SAMPLE_PAYLOADS: Record<string, object> = {
  D01: {
    $schema: "https://epede.org/schema/cim/iec61970/generation-unit.json",
    dispatch_plant: "Hydro-Nachtigal-GSU",
    rated_mva: 420.0,
    nominal_generation_kv: 11.0,
    stepped_up_transmission_kv: 225.0,
    active_power_dispatch_mw: 350.0,
    reactive_capability_mvar: { min: -120.0, max: 180.0 },
    inertia_constant_H_s: 3.85,
    governor_droop_percent: 4.0
  },
  D02: {
    $schema: "https://epede.org/schema/cim/iec61970/grid-topology.json",
    corridor_id: "TL-225-NAC-NOM",
    slack_bus: "BUS-NACHTIGAL-225",
    intertie_receiving_bus: "BUS-NOMAYOS-225",
    n_minus_1_criteria_status: "COMPLIANT_NO_LOAD_SHED",
    loss_factor_percent: 2.14,
    power_transfer_distribution_factors: { NAC_NOM: 0.62, SEC_LOOP: 0.38 },
    angular_separation_deg: 14.2
  },
  D04: {
    $schema: "https://epede.org/schema/cim/iec62271/substation-bay.json",
    substation_bay_id: "BAY-NAC-L01-225KV",
    rated_voltage_kv: 245.0,
    busbar_bil_lightning_impulse_kv: 1050,
    breaker_breaking_current_ka: 40.0,
    surge_arrester_mcov_kv: 198.0,
    ct_ratio: "1200/1 A class 5P20",
    vt_ratio: "225000:sqrt(3) / 100:sqrt(3) class 0.2"
  },
  D11: {
    $schema: "https://epede.org/schema/relay/ieee-c37/protection-coordination.json",
    protected_element_id: "LINE-225KV-NAC-NOM-105KM",
    positive_sequence_z1_ohm: { r: 5.86, x: 30.65 },
    zero_sequence_z0_ohm: { r: 18.20, x: 92.40 },
    zero_sequence_compensation_k0: 0.67,
    zone1_distance_reach_percent: 85.0,
    zone1_trip_time_ms: 0,
    zone2_reach_percent: 120.0,
    zone2_selective_delay_s: 0.35,
    teleprotection_scheme: "POTT_OPGW_C37.94"
  },
  D14: {
    $schema: "https://epede.org/schema/cigre/tb/civil-structural.json",
    tower_series_code: "SUSPENSION_LATTICE_WAISTED_225",
    conductor_spec: "ASTER_570_TWIN_BUNDLE",
    max_working_tension_dan: 4250,
    transverse_wind_pressure_dan: 1850,
    vertical_conductor_weight_dan: 3400,
    foundation_uplift_safety_factor: 1.65,
    lidar_min_ground_clearance_at_75c_m: 8.5
  },
  D15: {
    $schema: "https://epede.org/schema/ieee-80/grounding-lightning.json",
    target_footing_resistance_rt_ohm: 9.5,
    opgw_lightning_shielding_angle_deg: 28.0,
    soil_apparent_resistivity_layer1_ohmm: 280,
    keraunic_level_ng_flashes_km2_yr: 12.4,
    estimated_backflashover_rate: "0.18 / 100km / an",
    cable_sheath_cross_bonding_spacing_m: 450
  },
  "Calculateurs EPEDE": {
    $schema: "https://epede.org/schema/analytical/iec60287-solver.json",
    line_total_length_km: 105.0,
    conductor_operating_temp_c: 75.0,
    power_transit_mw: 320.0,
    calculated_voltage_drop_percent: 2.68,
    calculated_active_joule_losses_mw: 6.82,
    ferranti_no_load_voltage_rise_kv: 3.40,
    surge_impedance_loading_sil_mw: 142.5
  }
};

export const EpedeDataReuseMap: React.FC<EpedeDataReuseMapProps> = ({
  locale,
  onNavigate
}) => {
  const [selectedModuleSource, setSelectedModuleSource] = useState<string>(
    EPEDE_MODULE_REUSE_MAP[0].source_module
  );
  const [showJsonPayload, setShowJsonPayload] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedModule =
    EPEDE_MODULE_REUSE_MAP.find((m) => m.source_module === selectedModuleSource) ||
    EPEDE_MODULE_REUSE_MAP[0];

  const currentPayload = SAMPLE_PAYLOADS[selectedModule.source_module] || SAMPLE_PAYLOADS["D01"];

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PILLIER 9 · RÉUTILISATION DES DONNÉES DE L'ÉCOSYSTÈME EPEDE
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Matrice d\'Échange & Réutilisation des Données EPEDE'
                  : 'EPEDE Cross-Module Data Reuse Matrix & Interface Architecture'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'D03 s\'interface en amont avec la production D01 et l\'architecture D02, et en aval avec les postes D04, les protections D11, le génie civil D14, la foudre D15 et les calculateurs analytiques.'
                : 'D03 interfaces upstream with generation D01 and grid architecture D02, and downstream with substations D04, protections D11, civil D14, grounding D15, and analytical solvers.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#0D1117] text-emerald-400 border border-[#252E38] font-bold">
              7 Modules Interconnectés
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interconnected Modules List (5 Cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 font-mono text-xs shadow-xl">
          <span className="text-slate-400 font-bold uppercase text-[11px] block border-b border-[#252E38] pb-2">
            Modules Fournisseurs / Consommateurs :
          </span>

          <div className="space-y-2">
            {EPEDE_MODULE_REUSE_MAP.map((mod) => {
              const isSelected = mod.source_module === selectedModuleSource;
              return (
                <button
                  key={mod.source_module}
                  type="button"
                  onClick={() => setSelectedModuleSource(mod.source_module)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/10'
                      : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
                      {mod.source_module}
                    </span>
                    <span className="truncate max-w-[200px] text-xs">
                      {locale === 'fr' ? mod.source_name_fr : mod.source_name_en}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Data Exchange Dossier (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
          
          <div className="flex items-start justify-between gap-3 border-b border-[#252E38] pb-3">
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                INTERCONNEXION D03 ↔ {selectedModule.source_module}
              </span>
              <h3 className="text-base font-bold text-white font-mono mt-1">
                {locale === 'fr' ? selectedModule.source_name_fr : selectedModule.source_name_en}
              </h3>
            </div>

            {selectedModule.link_route && (
              <button
                type="button"
                onClick={() => onNavigate?.(selectedModule.link_route, selectedModule.source_module.startsWith('D') ? selectedModule.source_module : undefined)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all text-xs"
              >
                <span>Ouvrir Module</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Flowing In / Flowing Out Data Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Data In */}
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-sky-500/30 space-y-2">
              <span className="text-sky-400 font-bold text-[11px] block flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                Données Entrantes vers D03 (In) :
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {selectedModule.data_flowing_in.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-400 mt-0.5">↳</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Out */}
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-amber-500/30 space-y-2">
              <span className="text-amber-400 font-bold text-[11px] block flex items-center gap-1.5">
                <GitFork className="h-3.5 w-3.5" />
                Données Sortantes de D03 (Out) :
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {selectedModule.data_flowing_out.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">↱</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Shared Interfaces */}
          <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-1.5">
            <span className="text-slate-400 font-bold text-[11px] block uppercase">
              Interfaces Physiques & Électriques Partagées :
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {selectedModule.shared_interfaces.map((iface, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                  {iface}
                </span>
              ))}
            </div>
          </div>

          {/* Engineering Rationale */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-emerald-500/20 space-y-1">
            <span className="text-emerald-400 font-bold text-[11px] block">
              Justification & Continuité d'Ingénierie Système :
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              {locale === 'fr'
                ? selectedModule.engineering_rationale_fr
                : selectedModule.engineering_rationale_en}
            </p>
          </div>

          {/* CIM Schema & JSON-LD Inter-Module Payload Inspector */}
          <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
                <FileJson className="h-3.5 w-3.5" />
                <span>SPÉCIFICATION D'ÉCHANGE DE DONNÉES (CIM IEC 61970 / IEC 61850)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowJsonPayload(!showJsonPayload)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Code2 className="h-3 w-3" />
                  <span>{showJsonPayload ? 'Masquer Schéma' : 'Voir Schéma CIM JSON'}</span>
                </button>
                {showJsonPayload && (
                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
                  </button>
                )}
              </div>
            </div>

            {showJsonPayload ? (
              <pre className="p-3 rounded-lg bg-[#0D1117] border border-emerald-500/30 text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(currentPayload, null, 2)}
              </pre>
            ) : (
              <p className="text-[10px] text-slate-500">
                Cliquez sur « Voir Schéma CIM JSON » pour inspecter la charge utile standardisée transmise au module {selectedModule.source_module}.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
