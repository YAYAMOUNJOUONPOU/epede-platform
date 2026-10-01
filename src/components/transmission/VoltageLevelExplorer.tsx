// src/components/transmission/VoltageLevelExplorer.tsx
// EPEDE D03 - Interactive Voltage-Level Explorer (400 kV, 225 kV, 90 kV)

import React, { useState } from 'react';
import {
  Zap,
  Layers,
  ShieldCheck,
  Compass,
  ArrowRight,
  Info,
  Maximize2,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { TransmissionVoltageContext } from './TransmissionCommandHeader';

interface VoltageLevelExplorerProps {
  locale: 'fr' | 'en';
  activeVoltage: TransmissionVoltageContext;
  onSelectVoltage: (v: TransmissionVoltageContext) => void;
}

interface VoltageData {
  voltage: TransmissionVoltageContext;
  title_fr: string;
  title_en: string;
  nominal_kv: number;
  max_continuous_kv: number;
  role_fr: string;
  role_en: string;
  why_selected_fr: string;
  why_selected_en: string;
  bundle_type_fr: string;
  bundle_type_en: string;
  sil_mw: number;
  row_width_m: number;
  insulator_discs: number;
  creepage_mm_per_kv: number;
  substation_interface_fr: string;
  substation_interface_en: string;
  reactive_issues_fr: string;
  reactive_issues_en: string;
  protection_focus_fr: string;
  protection_focus_en: string;
  cameroon_context_fr: string;
  cameroon_context_en: string;
}

const VOLTAGE_DATABASE: Record<TransmissionVoltageContext, VoltageData> = {
  '400kV': {
    voltage: '400kV',
    nominal_kv: 400,
    max_continuous_kv: 420,
    title_fr: '400 kV — Très Haute Tension d\'Interconnexion Régionale & Supergrid',
    title_en: '400 kV — Extra-High-Voltage Bulk Interconnection & Supergrid',
    role_fr: 'Transport d\'énergie en vrac sur de très longues distances (> 300 km) et interconnexions synchrones transnationales (ex. corridors WAPP / CAPP en Afrique Centrale ou réseau européen ENTSO-E).',
    role_en: 'Bulk long-distance power wheeling (> 300 km) and cross-border synchronous interconnections (e.g. WAPP/CAPP power pools or European ENTSO-E grid).',
    why_selected_fr: 'Divise le courant par près de 4 par rapport au 225 kV pour la même puissance, réduisant les pertes par effet Joule de 75% à 85% sur les grands corridors hydroélectriques.',
    why_selected_en: 'Reduces line current by ~4x compared to 225 kV for identical transit power, slashing Joule losses by 75%–85% across long hydro corridors.',
    bundle_type_fr: 'Faisceau Triple ou Quadruple (3 à 4 conducteurs par phase, espacés de 400–450 mm)',
    bundle_type_en: 'Triple or Quadruple Bundle (3 to 4 conductors per phase, 400–450 mm sub-spacing)',
    sil_mw: 600,
    row_width_m: 50,
    insulator_discs: 22,
    creepage_mm_per_kv: 31,
    substation_interface_fr: 'Postes blindés GIS ou ouverts AIS 400/225 kV, transformateurs d\'interconnexion 400/225 kV de 300 à 600 MVA.',
    substation_interface_en: 'GIS or AIS 400/225 kV substations, 300–600 MVA auto-transformers linking regional backbones.',
    reactive_issues_fr: 'Forte production capacitive naturelle (Qc ~ 600 kvar/km) provoquant un fort effet Ferranti à vide; compensée par réactances shunt de 80 à 120 Mvar.',
    reactive_issues_en: 'Substantial natural charging reactive power (Qc ~ 600 kvar/km) producing severe no-load Ferranti rise; compensated by 80–120 Mvar shunt reactors.',
    protection_focus_fr: 'Schéma double différentiel optique 87L et distance numérique 21 avec téléprotection par fibre OPGW dédiée; réenclenchement monophasé ultra-rapide.',
    protection_focus_en: 'Dual redundant 87L optical line differential and 21 distance relaying via dedicated OPGW fiber; single-pole high-speed autoreclosing.',
    cameroon_context_fr: 'Projet d\'interconnexion future Cameroun - Tchad et évacuation des futurs méga-barrages de la Sanaga (Grand Eweng 1000 MW).',
    cameroon_context_en: 'Planned Cameroon - Chad interconnection and future power evacuation for Sanaga mega-hydro projects (Grand Eweng 1000 MW).'
  },
  '225kV': {
    voltage: '225kV',
    nominal_kv: 225,
    max_continuous_kv: 245,
    title_fr: '225 kV — Dorsale Haute Tension Nationale (Réseau Interconnecté Sud RIS)',
    title_en: '225 kV — National Transmission Backbone (Cameroon Southern Grid RIS)',
    role_fr: 'Colonne vertébrale du réseau de transport national reliant les grandes centrales de production aux principaux pôles de consommation urbains et industriels.',
    role_en: 'National transmission backbone linking major hydropower plants to main urban centers and heavy industrial hubs.',
    why_selected_fr: 'Optimise l\'équilibre investissement / transit pour des distances de 80 à 250 km (capacité de transit typique 250 à 450 MW par terne).',
    why_selected_en: 'Optimizes capital expenditure vs power capability for 80–250 km spans (typical transit capacity 250–450 MW per circuit).',
    bundle_type_fr: 'Faisceau Biconducteur (2 conducteurs Aster 570 mm² par phase, espacement 400 mm)',
    bundle_type_en: 'Twin Bundle (2 conductors Aster 570 mm² per phase, 400 mm spacing)',
    sil_mw: 135,
    row_width_m: 35,
    insulator_discs: 14,
    creepage_mm_per_kv: 25,
    substation_interface_fr: 'Postes d\'évacuation Nachtigal / Edéa / Songloulou vers les postes de transformation Bekoko / Mangombé / Oyomabang 225/90/30 kV.',
    substation_interface_en: 'Generation evacuation substations Nachtigal/Edéa/Songloulou to Bekoko/Mangombé/Oyomabang 225/90/30 kV substations.',
    reactive_issues_fr: 'Production réactive Qc ~ 140 kvar/km. Surtension modérée à vide nécessitant des réactances shunt de 30–40 Mvar lors des heures creuses.',
    reactive_issues_en: 'Charging reactive power Qc ~ 140 kvar/km. Moderate no-load overvoltages mitigated with 30–40 Mvar shunt reactors during off-peak.',
    protection_focus_fr: 'Protection de distance Main 1 (21/21N) avec schéma POTT et protection différentielle Main 2 (87L) sur fibre OPGW 48 fibres.',
    protection_focus_en: 'Main 1 distance protection (21/21N) with POTT scheme and Main 2 line current differential (87L) on 48-fiber OPGW.',
    cameroon_context_fr: 'Réseau opérationnel clé SONATREL : Ligne 225 kV double terne Nachtigal - Nyom 2 (50 km) et boucle 225 kV Yaoundé - Douala.',
    cameroon_context_en: 'Core operational SONATREL grid: Nachtigal - Nyom 2 double-circuit line (50 km) and Yaoundé - Douala 225 kV loop.'
  },
  '90kV': {
    voltage: '90kV',
    nominal_kv: 90,
    max_continuous_kv: 100,
    title_fr: '90 kV — Réseau Régional de Sous-Transport & Rocades Urbaines',
    title_en: '90 kV — Sub-Transmission Regional Distribution & Urban Rings',
    role_fr: 'Alimentation des agglomérations, des sites industriels moyens et interconnexion régionale de distribution primaire vers les postes sources 90/30 kV ou 90/15 kV.',
    role_en: 'Supplying urban areas, regional industries, and primary distribution substations feeding 90/30 kV or 90/15 kV medium-voltage grids.',
    why_selected_fr: 'Permet une emprise au sol restreinte (couloir de 20 m), idéale pour pénétrer les zones périurbaines denses sous forme aérienne ou en câbles souterrains XLPE.',
    why_selected_en: 'Offers compact footprint (20 m right-of-way), well suited for peri-urban ingress using compact overhead lines or XLPE underground cables.',
    bundle_type_fr: 'Conducteur Simple par phase (Monoconducteur Aster 228 ou 366 mm²)',
    bundle_type_en: 'Single Conductor per phase (Single Aster 228 or 366 mm²)',
    sil_mw: 22,
    row_width_m: 20,
    insulator_discs: 7,
    creepage_mm_per_kv: 20,
    substation_interface_fr: 'Postes sources urbains 90/15 kV ou 90/30 kV (ex. Bassa, Bonabéri, Koumassi, Ngousso).',
    substation_interface_en: 'Urban primary substations 90/15 kV or 90/30 kV (e.g. Bassa, Bonabéri, Koumassi, Ngousso).',
    reactive_issues_fr: 'Faible impédance capacitive. En régime de charge, la ligne absorbe du réactif et provoque des chutes de tension compensées par batteries de condensateurs 30 kV.',
    reactive_issues_en: 'Low capacitive charging. Under heavy load, line absorbs reactive power, causing voltage drops mitigated by 30 kV capacitor banks.',
    protection_focus_fr: 'Protection de distance numérique 21 avec secours à maximum de courant directionnel 67/67N; téléaction numérique ou liaisons filaires.',
    protection_focus_en: 'Numerical distance relay 21 with directional overcurrent backup 67/67N; digital teleprotection or copper pilot wires.',
    cameroon_context_fr: 'Boucle 90 kV urbaine de Douala et Yaoundé reliant les postes sources d\'Eneo aux nœuds de transport SONATREL.',
    cameroon_context_en: 'Douala and Yaoundé 90 kV metropolitan rings interconnecting Eneo primary substations with SONATREL grid delivery points.'
  }
};

export const VoltageLevelExplorer: React.FC<VoltageLevelExplorerProps> = ({
  locale,
  activeVoltage,
  onSelectVoltage
}) => {
  const data = VOLTAGE_DATABASE[activeVoltage];

  // Interactive comparative transit & loss calculator for user chosen Power and Distance
  const [transitPowerMw, setTransitPowerMw] = useState<number>(300);
  const [transitDistanceKm, setTransitDistanceKm] = useState<number>(150);

  // Losses calculation: I = P / (sqrt(3) * U * cosPhi)
  // Approximate R per km: 400kV (0.018 ohm/km quad), 225kV (0.030 ohm/km twin), 90kV (0.090 ohm/km single)
  const calcLosses = (kv: number, rKm: number) => {
    const current = (transitPowerMw * 1e6) / (Math.sqrt(3) * kv * 1e3 * 0.95);
    const rTotal = rKm * transitDistanceKm;
    const lossesMw = (3 * rTotal * Math.pow(current, 2)) / 1e6;
    const lossPercent = (lossesMw / Math.max(1, transitPowerMw)) * 100;
    return { current: Math.round(current), lossesMw: Math.round(lossesMw * 10) / 10, lossPercent: Math.round(lossPercent * 10) / 10 };
  };

  const loss400 = calcLosses(400, 0.018);
  const loss225 = calcLosses(225, 0.030);
  const loss90 = calcLosses(90, 0.090);

  return (
    <div className="space-y-6">
      {/* 1. Voltage Context Switcher Tabs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38] shadow-xl font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              PILLIER 4 · EXPLORATEUR COMPARATIF DES PALIERS DE TENSION
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? data.title_fr : data.title_en}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(['400kV', '225kV', '90kV'] as TransmissionVoltageContext[]).map((v) => {
              const isSelected = activeVoltage === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onSelectVoltage(v)}
                  className={`px-3 py-2 rounded-xl border font-bold transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-[#0D1117] text-slate-400 border-[#252E38] hover:text-white'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-3 pt-3 border-t border-[#252E38] text-[10px] text-slate-400 flex items-center gap-1.5 font-sans">
          <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            {locale === 'fr'
              ? 'Exemple représentatif basé sur les standards internationaux (CEI 60038) et les spécifications SONATREL/Eneo. Les dimensions et capacités dépendent de l\'étude de tracé et du cahier des charges du gestionnaire de réseau.'
              : 'Representative benchmark based on IEC 60038 and utility grid codes. Capacities and geometries are subject to route studies and utility specifications.'}
          </span>
        </div>
      </div>

      {/* 2. Interactive Power & Losses Arbitrage Simulator Across 400kV / 225kV / 90kV */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
          <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            <span>
              {locale === 'fr'
                ? 'Simulateur d\'Arbitrage de Pertes Joule P_loss = 3·R·I² (Impact Quadratique de la Tension)'
                : 'Joule Loss Arbitrage Calculator P_loss = 3·R·I² (Quadratic Voltage Scaling)'}
            </span>
          </span>
          <span className="text-[10px] text-slate-500">
            cos φ = 0.95
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Puissance Active à Transporter (P) :</span>
                <span className="text-cyan-400 font-bold">{transitPowerMw} MW</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={transitPowerMw}
                onChange={(e) => setTransitPowerMw(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Distance de Transport (L) :</span>
                <span className="text-white font-bold">{transitDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="30"
                max="400"
                step="10"
                value={transitDistanceKm}
                onChange={(e) => setTransitDistanceKm(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-3 gap-3 text-center">
            {/* 400 kV Card */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              activeVoltage === '400kV' ? 'bg-cyan-500/15 border-cyan-400 shadow-md' : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">Palier 400 kV</span>
                <span className="text-xs text-slate-400 mt-1 block">Courant: {loss400.current} A</span>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-emerald-400">{loss400.lossesMw} MW</span>
                <span className="text-[10px] text-slate-500 block">Pertes ({loss400.lossPercent}%)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Rendement 98.5%+
              </span>
            </div>

            {/* 225 kV Card */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              activeVoltage === '225kV' ? 'bg-cyan-500/15 border-cyan-400 shadow-md' : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Palier 225 kV</span>
                <span className="text-xs text-slate-400 mt-1 block">Courant: {loss225.current} A</span>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-amber-400">{loss225.lossesMw} MW</span>
                <span className="text-[10px] text-slate-500 block">Pertes ({loss225.lossPercent}%)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Standard National
              </span>
            </div>

            {/* 90 kV Card */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              activeVoltage === '90kV' ? 'bg-cyan-500/15 border-cyan-400 shadow-md' : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div>
                <span className="text-[10px] text-red-400 font-bold uppercase block">Palier 90 kV</span>
                <span className="text-xs text-slate-400 mt-1 block">Courant: {loss90.current} A</span>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-red-400">{loss90.lossesMw} MW</span>
                <span className="text-[10px] text-slate-500 block">Pertes ({loss90.lossPercent}%)</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                loss90.lossPercent > 10 ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {loss90.lossPercent > 10 ? 'Surcharge/Inadapté' : 'Sous-transport'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Multi-Dimensional Comparison Grid for the Active Voltage Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        
        {/* Card 1: System Role & Transit Capacity */}
        <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#252E38] pb-2">
            <span className="font-bold uppercase text-[11px] text-cyan-400">Rôle & Capacité</span>
            <span className="text-[10px] text-slate-500">Un = {data.nominal_kv} kV</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {locale === 'fr' ? data.role_fr : data.role_en}
          </p>
          <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">Puissance Naturelle (SIL) :</div>
            <div className="text-base font-bold text-white">{data.sil_mw} MW</div>
            <div className="text-[10px] text-slate-400">Tension Maximale Um : {data.max_continuous_kv} kV</div>
          </div>
        </div>

        {/* Card 2: Conductor Bundling & Physical Dimension */}
        <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#252E38] pb-2">
            <span className="font-bold uppercase text-[11px] text-amber-400">Conducteurs & Gabarit</span>
            <span className="text-[10px] text-slate-500">Couloir ROW</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Faisceau Conducteurs :</span>
            <span className="text-white font-bold text-[11px]">
              {locale === 'fr' ? data.bundle_type_fr : data.bundle_type_en}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[9px] text-slate-500 block">Emprise Couloir</span>
              <span className="text-sm font-bold text-amber-400">{data.row_width_m} m</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-[9px] text-slate-500 block">Disques Isolateurs</span>
              <span className="text-sm font-bold text-white">{data.insulator_discs} disques</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400">
            Ligne de fuite minimale : <span className="text-white font-bold">{data.creepage_mm_per_kv} mm/kV</span>
          </div>
        </div>

        {/* Card 3: Reactive Behavior & Compensation */}
        <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#252E38] pb-2">
            <span className="font-bold uppercase text-[11px] text-sky-400">Comportement Réactif</span>
            <span className="text-[10px] text-slate-500">R-L-C-G</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {locale === 'fr' ? data.reactive_issues_fr : data.reactive_issues_en}
          </p>
          <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38] text-[10px] text-slate-400 space-y-1">
            <span className="text-sky-400 font-bold block uppercase">Interface Postes :</span>
            <span>{locale === 'fr' ? data.substation_interface_fr : data.substation_interface_en}</span>
          </div>
        </div>

        {/* Card 4: Protection Scheme & Field Application */}
        <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#252E38] pb-2">
            <span className="font-bold uppercase text-[11px] text-emerald-400">Plan de Protection</span>
            <span className="text-[10px] text-slate-500">ANSI 21 / 87L</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {locale === 'fr' ? data.protection_focus_fr : data.protection_focus_en}
          </p>
          <div className="p-2.5 rounded-xl bg-[#0D1117] border border-emerald-500/30 text-[10px] text-slate-300 space-y-1">
            <span className="text-emerald-400 font-bold block uppercase">Référence Terrain :</span>
            <span>{locale === 'fr' ? data.cameroon_context_fr : data.cameroon_context_en}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
