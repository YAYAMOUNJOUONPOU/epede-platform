// src/components/transmission/EquipmentObjectSchemaInspector.tsx
// EPEDE D03 - Canonical Transmission Equipment Object Schema Inspector (43-Point Schema)

import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Zap,
  Activity,
  ShieldAlert,
  Layers,
  Sparkles,
  ExternalLink,
  Compass,
  Cpu
} from 'lucide-react';
import { CANONICAL_TRANSMISSION_EQUIPMENTS } from './data/transmissionData';
import type { CanonicalTransmissionEquipment } from './types';

interface EquipmentObjectSchemaInspectorProps {
  locale: 'fr' | 'en';
}

export const EquipmentObjectSchemaInspector: React.FC<EquipmentObjectSchemaInspectorProps> = ({
  locale
}) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(
    CANONICAL_TRANSMISSION_EQUIPMENTS[0].id
  );
  const [activeTab, setActiveTab] = useState<
    'IDENTIFICATION' | 'RATINGS' | 'GEOMETRY' | 'SEQUENCE' | 'THERMAL' | 'HEALTH' | 'JSON'
  >('IDENTIFICATION');
  const [copied, setCopied] = useState(false);

  const selectedEquipment =
    CANONICAL_TRANSMISSION_EQUIPMENTS.find((e) => e.id === selectedEquipmentId) ||
    CANONICAL_TRANSMISSION_EQUIPMENTS[0];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEquipment, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PILLIER 4 · SCHÉMA D'OBJET CANONIQUE EPEDE (43 ATTRIBUTS)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Inspecteur de Schéma d\'Équipement Haute Tension'
                  : 'Canonical Transmission Asset Object Schema Inspector'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Standard de métadonnées d\'ingénierie unifié EPEDE pour lignes aériennes et câbles HTB : impédances de séquence (directe/homopolaire), géométrie caténaire, ampacité DLR IEEE 738 et santé CIGRE.'
                : 'Unified EPEDE engineering metadata standard for overhead lines and underground cables: sequence impedances, catenary geometry, IEEE 738 DLR ampacity, and CIGRE health indices.'}
            </p>
          </div>

          {/* Sample Asset Switcher */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {CANONICAL_TRANSMISSION_EQUIPMENTS.map((eq) => {
              const isSelected = eq.id === selectedEquipmentId;
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => setSelectedEquipmentId(eq.id)}
                  className={`px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-white font-bold shadow-lg shadow-sky-500/10'
                      : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-sky-400 font-bold">
                    {eq.classification.voltage_class}
                  </div>
                  <div className="truncate max-w-[140px] text-xs">
                    {eq.classification.system_type}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#252E38] overflow-x-auto">
          {[
            { id: 'IDENTIFICATION', label_fr: '1. Identification & Normes', label_en: '1. Identification' },
            { id: 'RATINGS', label_fr: '2. Caractéristiques Électriques', label_en: '2. Ratings' },
            { id: 'GEOMETRY', label_fr: '3. Géométrie & Mécanique', label_en: '3. Geometry' },
            { id: 'SEQUENCE', label_fr: '4. Impédances de Séquence', label_en: '4. Sequence' },
            { id: 'THERMAL', label_fr: '5. Ampacité & DLR IEEE 738', label_en: '5. Thermal DLR' },
            { id: 'HEALTH', label_fr: '6. Santé d\'Actif CIGRE', label_en: '6. Health Index' },
            { id: 'JSON', label_fr: '{ } JSON Schema Brut', label_en: '{ } Raw JSON' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20'
                    : 'bg-[#0D1117] text-slate-400 hover:text-white border border-[#252E38]'
                }`}
              >
                {locale === 'fr' ? tab.label_fr : tab.label_en}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dynamic Schema Content Panel */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
        
        {/* TAB 1: IDENTIFICATION */}
        {activeTab === 'IDENTIFICATION' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Code Canonique Unique EPEDE</span>
                <div className="text-sm font-bold text-sky-400">{selectedEquipment.canonical_code}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Identifiant Fonctionnel CEI</span>
                <div className="text-sm font-bold text-amber-400">{selectedEquipment.classification.iec_functional_id}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2">
              <div className="text-slate-400 font-bold uppercase text-[11px]">Désignation Officielle de l'Ouvrage</div>
              <div className="text-white text-sm font-bold">
                {locale === 'fr' ? selectedEquipment.name_fr : selectedEquipment.name_en}
              </div>
              <div className="flex gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Domaine {selectedEquipment.domain_code}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Sous-domaine {selectedEquipment.subdomain_code}
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  {selectedEquipment.classification.system_type}
                </span>
              </div>
            </div>

            {selectedEquipment.cameroon_corridor_application && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0D1117] to-[#121820] border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sky-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" />
                    Application Terrain SONATREL Cameroun
                  </span>
                  <span className="text-slate-400">
                    Mise en service : {selectedEquipment.cameroon_corridor_application.commissioning_year}
                  </span>
                </div>
                <div className="text-white font-bold">
                  {selectedEquipment.cameroon_corridor_application.corridor_name}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Exploitant : <span className="text-white">{selectedEquipment.cameroon_corridor_application.owner_operator}</span></div>
                  <div>Longueur Totale : <span className="text-white">{selectedEquipment.cameroon_corridor_application.length_km} km</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RATINGS */}
        {activeTab === 'RATINGS' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Tension Nominale Un</span>
                <div className="text-base font-bold text-sky-400 mt-1">
                  {selectedEquipment.electrical_parameters.rated_voltage_un_kv} kV
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Tension Maximale Um</span>
                <div className="text-base font-bold text-white mt-1">
                  {selectedEquipment.electrical_parameters.highest_voltage_um_kv} kV
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Courant Assigné In</span>
                <div className="text-base font-bold text-amber-400 mt-1">
                  {selectedEquipment.electrical_parameters.rated_continuous_current_a} A
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Tenue Court-Circuit (1s)</span>
                <div className="text-base font-bold text-red-400 mt-1">
                  {selectedEquipment.electrical_parameters.short_circuit_withstand_ka_1s} kA
                </div>
              </div>
            </div>

            {/* Insulation Coordination */}
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-3">
              <div className="text-slate-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Coordination de l'Isolement (CEI 60071-1)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <span className="text-slate-500 text-[10px] block">Niveau d'Isolement Foudre (BIL 1.2/50 µs)</span>
                  <span className="text-cyan-300 font-bold text-sm">
                    {selectedEquipment.electrical_parameters.bil_lightning_impulse_kv_peak} kV crête
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <span className="text-slate-500 text-[10px] block">Niveau d'Isolement Manœuvre (SIL 250/2500 µs)</span>
                  <span className="text-amber-300 font-bold text-sm">
                    {selectedEquipment.electrical_parameters.sil_switching_impulse_kv_peak} kV crête
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEOMETRY */}
        {activeTab === 'GEOMETRY' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Type de Conducteur</span>
                <div className="text-xs font-bold text-white mt-1">
                  {selectedEquipment.physical_geometry.conductor_type}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Section Nominale Métallique</span>
                <div className="text-xs font-bold text-sky-400 mt-1">
                  {selectedEquipment.physical_geometry.cross_section_mm2} mm²
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Configuration du Faisceau</span>
                <div className="text-xs font-bold text-amber-400 mt-1">
                  {selectedEquipment.physical_geometry.bundle_configuration}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Diamètre Extérieur</span>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedEquipment.physical_geometry.overall_diameter_mm} mm
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Masse Linéique</span>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedEquipment.physical_geometry.linear_weight_kg_per_km} kg/km
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Portée Équivalente (Ruling)</span>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedEquipment.physical_geometry.ruling_span_m} m
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Garde au Sol Minimale</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  {selectedEquipment.physical_geometry.min_ground_clearance_m} m
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEQUENCE IMPEDANCES */}
        {activeTab === 'SEQUENCE' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Positive Sequence */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-sky-500/30 space-y-2">
                <span className="text-sky-400 font-bold uppercase text-[11px]">
                  Séquence Directe & Inverse (Z1 = Z2)
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Résistance R1 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.positive_sequence_r1_ohm_per_km} Ω/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Réactance X1 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.positive_sequence_x1_ohm_per_km} Ω/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Susceptance B1 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.positive_sequence_b1_microsiemens_per_km} µS/km</span>
                  </div>
                </div>
              </div>

              {/* Zero Sequence */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">
                  Séquence Homopolaire (Z0)
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Résistance R0 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.zero_sequence_r0_ohm_per_km} Ω/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Réactance X0 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.zero_sequence_x0_ohm_per_km} Ω/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Susceptance B0 :</span>
                    <span className="text-white font-bold">{selectedEquipment.electrical_parameters.zero_sequence_b0_microsiemens_per_km} µS/km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wave parameters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Impédance d'Onde Zc = √(L/C)</span>
                <div className="text-base font-bold text-cyan-300 mt-1">
                  {selectedEquipment.electrical_parameters.surge_impedance_zc_ohms} Ω
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Puissance Naturelle SIL = Un² / Zc</span>
                <div className="text-base font-bold text-amber-300 mt-1">
                  {selectedEquipment.electrical_parameters.surge_impedance_loading_sil_mw} MW
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: THERMAL & DLR */}
        {activeTab === 'THERMAL' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Capacité Continue Hiver</span>
                <div className="text-base font-bold text-sky-400 mt-1">
                  {selectedEquipment.thermal_ampacity.winter_continuous_mva} MVA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Capacité Continue Été (Pointe)</span>
                <div className="text-base font-bold text-amber-400 mt-1">
                  {selectedEquipment.thermal_ampacity.summer_continuous_mva} MVA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase">Secours d'Urgence (15 min)</span>
                <div className="text-base font-bold text-red-400 mt-1">
                  {selectedEquipment.thermal_ampacity.emergency_15min_mva} MVA
                </div>
              </div>
            </div>

            {/* Dynamic Line Rating (DLR) IEEE 738 / CIGRE TB 601 Model */}
            <div className="p-4 rounded-xl bg-[#0D1117] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Calculateur DLR Temps Réel (Bilan Thermique Conducteur)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  q_c(V_wind) + q_r = q_s(Solar) + I²·R(Tc)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <span className="text-slate-500 block text-[10px]">Refroidissement par Convection (qc) :</span>
                  <span className="text-sky-300 font-bold">42.8 W/m</span>
                  <span className="text-[9px] text-slate-500 block">Vent transversal 0.6 m/s</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <span className="text-slate-500 block text-[10px]">Rayonnement Émis (qr) :</span>
                  <span className="text-indigo-300 font-bold">18.4 W/m</span>
                  <span className="text-[9px] text-slate-500 block">Émissivité ε = 0.85</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <span className="text-slate-500 block text-[10px]">Échauffement Solaire (qs) :</span>
                  <span className="text-amber-300 font-bold">24.1 W/m</span>
                  <span className="text-[9px] text-slate-500 block">Flux 1000 W/m²</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[11px] block">
                  Température Maximale Admissible au Conducteur
                </span>
                <span className="text-xs text-slate-500">
                  Limite de recuit et de flèche selon IEEE Standard 738
                </span>
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {selectedEquipment.thermal_ampacity.conductor_max_temp_c}°C
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CIGRE HEALTH */}
        {activeTab === 'HEALTH' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0D1117] border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold uppercase text-[11px] block">
                  Indice de Santé CIGRE (Asset Health Index - AHI)
                </span>
                <span className="text-xs text-slate-400">
                  Âge actuel : {selectedEquipment.cigre_asset_health.current_age_years} ans / {selectedEquipment.cigre_asset_health.estimated_lifespan_years} ans de conception
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {selectedEquipment.cigre_asset_health.health_index_score} / 100
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[11px]">
                Critères Critiques d'Inspection Périodique
              </span>
              <div className="space-y-1.5">
                {selectedEquipment.cigre_asset_health.critical_inspection_criteria.map((crit, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RAW JSON */}
        {activeTab === 'JSON' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">
                Structure standardisée conforme au modèle d'ingénierie EPEDE D03
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30 transition-all font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] text-cyan-300 overflow-x-auto max-h-[400px] text-[11px] leading-relaxed">
              {JSON.stringify(selectedEquipment, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
