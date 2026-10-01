// src/components/diagrams/infographics/SolarBessGridInterconnectionDiagram.tsx
// EPEDE Continuous Electrical Engineering Content Improvement Engine
// Bounded Improvement Package: Solar PV & BESS Grid Interconnection (Droop / Virtual Inertia / IEEE 1547 / IEEE 2800)

import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

type BessOperatingState = 'NORMAL_PEAK' | 'UNDER_FREQUENCY' | 'OVER_FREQUENCY' | 'VOLTAGE_SAG_LVRT' | 'EVENING_DISPATCH';

export const SolarBessGridInterconnectionDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [bessState, setBessState] = useState<BessOperatingState>('NORMAL_PEAK');
  const [selectedElement, setSelectedElement] = useState<string>('PPC_PLANT_CONTROLLER');

  const activeElement = selectedHotspotId || selectedElement;

  const handleSelect = (id: string) => {
    setSelectedElement(id);
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr'
                ? "Centrale Solaire PV + Stockage BESS & Support Réseau (IEEE 1547 / 2800)"
                : "Utility-Scale Solar PV + BESS Grid Integration (IEEE 1547 / 2800)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr'
              ? "Modélisation hybride 30 MWp PV + 20 MWh BESS : Réglage primaire P(f), inertie virtuelle, support réactif Q(U) et traversée de creux LVRT"
              : "30 MWp Solar + 20 MWh BESS hybrid: Primary frequency droop, synthetic inertia H, reactive voltage support Q(U), and LVRT ride-through"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
            IEEE 2800-2022 · IEEE 1547-2018 · IEC 62933
          </span>
        </div>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setBessState('NORMAL_PEAK')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            bessState === 'NORMAL_PEAK'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '1. Midi Ensoleillé (Charge BESS)' : '1. Midday Sun (BESS Charge)'}
        </button>

        <button
          type="button"
          onClick={() => setBessState('UNDER_FREQUENCY')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            bessState === 'UNDER_FREQUENCY'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '2. Sous-Fréquence (49.5 Hz) ➔ FFR' : '2. Low Freq (49.5 Hz) ➔ FFR'}
        </button>

        <button
          type="button"
          onClick={() => setBessState('OVER_FREQUENCY')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            bessState === 'OVER_FREQUENCY'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '3. Sur-Fréquence (50.5 Hz) ➔ Écrêt.' : '3. High Freq (50.5 Hz) ➔ P(f)'}
        </button>

        <button
          type="button"
          onClick={() => setBessState('VOLTAGE_SAG_LVRT')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            bessState === 'VOLTAGE_SAG_LVRT'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '4. Creux de Tension (LVRT 0.3 pu)' : '4. Voltage Sag (LVRT 0.3 pu)'}
        </button>

        <button
          type="button"
          onClick={() => setBessState('EVENING_DISPATCH')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            bessState === 'EVENING_DISPATCH'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '5. Pointe du Soir (Décharge BESS)' : '5. Evening Peak (BESS Inject)'}
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[450px] max-h-[640px] relative">
        <svg
          viewBox="0 0 1200 680"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradPvSun" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="gradBessBat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="gradGridBus" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <pattern id="gridBess" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            <filter id="bessGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="1200" height="680" fill="#0A0F1D" />
          <rect width="1200" height="680" fill="url(#gridBess)" />

          {/* ================================================================= */}
          {/* SECTION 1: SOLAR PHOTOVOLTAIC ARRAY (30 MWp / 1500 V DC)          */}
          {/* ================================================================= */}
          <g transform="translate(40, 50)" onClick={() => handleSelect('SOLAR_PV_ARRAY')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="230"
              height="200"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'SOLAR_PV_ARRAY' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeElement === 'SOLAR_PV_ARRAY' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="210" height="28" rx="5" fill="#78350F" />
            <text x="115" y="28" fill="#FEF3C7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CHAMP SOLAIRE PV · 30 MWc
            </text>

            {/* PV Modules Graphic */}
            <g transform="translate(25, 50)">
              {/* Row 1 */}
              <rect x="0" y="0" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="46" y="0" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="92" y="0" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="138" y="0" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              {/* Row 2 */}
              <rect x="0" y="30" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="46" y="30" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="92" y="30" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
              <rect x="138" y="30" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
            </g>

            {/* Operational Output Metrics */}
            <g transform="translate(15, 115)">
              <rect x="0" y="0" width="200" height="70" rx="6" fill="#162032" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                ENSOLEILLEMENT & PUISSANCE DC :
              </text>
              <text
                x="10"
                y="38"
                fill={bessState === 'EVENING_DISPATCH' ? '#64748B' : '#FBBF24'}
                fontSize="14"
                fontWeight="900"
                fontFamily="monospace"
              >
                {bessState === 'EVENING_DISPATCH'
                  ? '0 W/m² (Nuit/Coucher)'
                  : bessState === 'OVER_FREQUENCY'
                  ? '18.2 MW (Écrêté P(f))'
                  : '28.4 MW DC (1000 W/m²)'}
              </text>
              <text x="10" y="56" fill="#38BDF8" fontSize="8" fontFamily="monospace">
                Tension Chaîne: 1 500 V CC · MPPT Actif
              </text>
            </g>

            {/* DC Bus Output Line */}
            <line x1="230" y1="150" x2="310" y2="150" stroke="#F59E0B" strokeWidth="4" />
          </g>

          {/* ================================================================= */}
          {/* SECTION 2: BESS CONTAINER (20 MWh / 10 MW LFP BATTERIES)          */}
          {/* ================================================================= */}
          <g transform="translate(40, 270)" onClick={() => handleSelect('BESS_BATTERY_RACKS')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="230"
              height="210"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'BESS_BATTERY_RACKS' ? '#10B981' : '#1E293B'}
              strokeWidth={activeElement === 'BESS_BATTERY_RACKS' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="210" height="28" rx="5" fill="#065F46" />
            <text x="115" y="28" fill="#D1FAE5" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CONTENEUR BESS · 20 MWh / 10 MW
            </text>

            {/* Battery Rack Graphics */}
            <g transform="translate(25, 50)">
              {/* 4 Racks */}
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i} transform={`translate(${i * 46}, 0)`}>
                  <rect x="0" y="0" width="38" height="60" rx="3" fill="#132E27" stroke="#10B981" strokeWidth="1" />
                  <rect x="4" y="8" width="30" height="6" rx="1" fill="#34D399" />
                  <rect x="4" y="18" width="30" height="6" rx="1" fill="#34D399" />
                  <rect x="4" y="28" width="30" height="6" rx="1" fill="#34D399" />
                  <rect x="4" y="38" width="30" height="6" rx="1" fill="#34D399" />
                  <rect x="4" y="48" width="30" height="6" rx="1" fill="#34D399" />
                </g>
              ))}
            </g>

            {/* BESS State of Charge & Flow */}
            <g transform="translate(15, 125)">
              <rect x="0" y="0" width="200" height="70" rx="6" fill="#162032" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                ÉTAT DE CHARGE (SOC) & FLUX BESS :
              </text>
              <text
                x="10"
                y="38"
                fill={
                  bessState === 'UNDER_FREQUENCY' || bessState === 'EVENING_DISPATCH'
                    ? '#F87171' // Discharging
                    : '#34D399' // Charging
                }
                fontSize="14"
                fontWeight="900"
                fontFamily="monospace"
              >
                {bessState === 'NORMAL_PEAK' && '+10.0 MW (CHARGE 0.5C)'}
                {bessState === 'UNDER_FREQUENCY' && '-10.0 MW (DÉCHARGE FFR)'}
                {bessState === 'OVER_FREQUENCY' && '+10.0 MW (ABSORPTION P(f))'}
                {bessState === 'VOLTAGE_SAG_LVRT' && '0 MW (100% MVAR LVRT)'}
                {bessState === 'EVENING_DISPATCH' && '-10.0 MW (POINTE SOIR)'}
              </text>
              <text x="10" y="56" fill="#A7F3D0" fontSize="8" fontFamily="monospace">
                Chimie: LFP (LiFePO4) · SOC: {bessState === 'EVENING_DISPATCH' ? '54 %' : '78 %'} · BMS OK
              </text>
            </g>

            {/* DC Bus Output Line to PCS */}
            <line x1="230" y1="375" x2="310" y2="375" stroke="#10B981" strokeWidth="4" />
          </g>

          {/* ================================================================= */}
          {/* SECTION 3: BI-DIRECTIONAL POWER CONVERSION SYSTEM (PCS)           */}
          {/* ================================================================= */}
          <g transform="translate(310, 100)" onClick={() => handleSelect('BIDIRECTIONAL_PCS')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="210"
              height="330"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'BIDIRECTIONAL_PCS' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'BIDIRECTIONAL_PCS' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="190" height="28" rx="5" fill="#1E3A8A" />
            <text x="105" y="28" fill="#DBEAFE" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ONDULEURS PCS 4-QUADRANTS
            </text>

            {/* Inverter Bridge Symbols DC/AC */}
            <g transform="translate(35, 60)">
              <rect x="0" y="0" width="140" height="90" rx="6" fill="#13233C" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="140" y2="90" stroke="#475569" strokeWidth="1" />
              <text x="35" y="35" fill="#FBBF24" fontSize="14" fontWeight="bold" textAnchor="middle">
                =
              </text>
              <text x="105" y="65" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle">
                ~
              </text>
              <text x="70" y="105" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Pont IGBT / SiC 1500V ➔ 690V AC
              </text>
            </g>

            {/* Operating 4-Quadrant Mode Badge */}
            <g transform="translate(20, 185)">
              <rect x="0" y="0" width="170" height="60" rx="5" fill="#162032" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                MODE CONVERTISSEUR (P-Q) :
              </text>
              <text
                x="10"
                y="36"
                fill={bessState === 'VOLTAGE_SAG_LVRT' ? '#C084FC' : '#38BDF8'}
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {bessState === 'VOLTAGE_SAG_LVRT' ? 'Q = +15 MVAR (LVRT)' : 'Cos φ = 1.00 (Unitaire)'}
              </text>
              <text x="10" y="50" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                Tension Sortie: 690 V Triphasé
              </text>
            </g>

            {/* Grid-Forming vs Grid-Following indicator */}
            <g transform="translate(20, 260)">
              <rect x="0" y="0" width="170" height="50" rx="5" fill="#14283D" stroke="#0284C7" strokeWidth="1" />
              <text x="10" y="18" fill="#38BDF8" fontSize="8" fontWeight="bold">
                COMMANDE DU CONVERTISSEUR :
              </text>
              <text x="10" y="34" fill="#FDE047" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Grid-Forming (GFM) + Inertie H
              </text>
              <text x="10" y="44" fill="#94A3B8" fontSize="7">
                Source de tension virtuelle IEEE 2800
              </text>
            </g>
          </g>

          {/* Lines from PCS to Collector Transformer */}
          <line x1="520" y1="265" x2="600" y2="265" stroke="#38BDF8" strokeWidth="4" />

          {/* ================================================================= */}
          {/* SECTION 4: STEP-UP TRANSFORMER (0.69 kV / 33 kV)                  */}
          {/* ================================================================= */}
          <g transform="translate(600, 185)" onClick={() => handleSelect('MV_COLLECTOR_XFMR')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="130"
              height="160"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'MV_COLLECTOR_XFMR' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'MV_COLLECTOR_XFMR' ? '2.5' : '1.5'}
            />
            {/* Dual Transformer Circles */}
            <circle cx="65" cy="60" r="32" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="65" cy="100" r="32" fill="none" stroke="#A78BFA" strokeWidth="3" />
            <text x="65" y="145" fill="#DDD6FE" fontSize="9" fontWeight="bold" textAnchor="middle">
              Transfo 35 MVA
            </text>
            <text x="65" y="25" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              0.69 kV / 33 kV
            </text>
          </g>

          {/* Line to Substation POI */}
          <line x1="730" y1="265" x2="820" y2="265" stroke="#A78BFA" strokeWidth="4" />

          {/* ================================================================= */}
          {/* SECTION 5: POINT OF INTERCONNECTION (POI 33 kV / 90 kV)           */}
          {/* ================================================================= */}
          <g transform="translate(820, 80)" onClick={() => handleSelect('POI_GRID_INTERFACE')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="340"
              height="370"
              rx="12"
              fill="#0F172A"
              stroke={activeElement === 'POI_GRID_INTERFACE' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeElement === 'POI_GRID_INTERFACE' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="15" y="15" width="310" height="30" rx="6" fill="url(#gradGridBus)" />
            <text x="170" y="35" fill="#FFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              POSTE D'INTERCONNEXION (POI) · 33 kV / 90 kV
            </text>

            {/* Grid Busbar Graphic */}
            <line x1="30" y1="75" x2="310" y2="75" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
            <text x="170" y="92" fill="#93C5FD" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Jeu de Barres Réseau HTB (RIN 90 kV / 110 kV)
            </text>

            {/* Live Grid Parameters Grid */}
            <g transform="translate(20, 110)">
              {/* Frequency f */}
              <rect x="0" y="0" width="145" height="60" rx="5" fill="#13233C" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                FRÉQUENCE RÉSEAU (f) :
              </text>
              <text
                x="10"
                y="40"
                fill={
                  bessState === 'UNDER_FREQUENCY'
                    ? '#EF4444'
                    : bessState === 'OVER_FREQUENCY'
                    ? '#06B6D4'
                    : '#10B981'
                }
                fontSize="16"
                fontWeight="900"
                fontFamily="monospace"
              >
                {bessState === 'UNDER_FREQUENCY' && '49.50 Hz (-0.50)'}
                {bessState === 'OVER_FREQUENCY' && '50.50 Hz (+0.50)'}
                {bessState === 'NORMAL_PEAK' && '50.00 Hz (Nominal)'}
                {bessState === 'VOLTAGE_SAG_LVRT' && '50.02 Hz (Stable)'}
                {bessState === 'EVENING_DISPATCH' && '49.95 Hz (Creux)'}
              </text>
              <text x="10" y="54" fill="#94A3B8" fontSize="7">
                RoCoF: {bessState === 'UNDER_FREQUENCY' ? '-0.85 Hz/s (Amorti)' : '0.00 Hz/s'}
              </text>

              {/* Voltage U */}
              <rect x="155" y="0" width="145" height="60" rx="5" fill="#13233C" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                TENSION POI (U) :
              </text>
              <text
                x="10"
                y="40"
                fill={bessState === 'VOLTAGE_SAG_LVRT' ? '#EF4444' : '#38BDF8'}
                fontSize="16"
                fontWeight="900"
                fontFamily="monospace"
              >
                {bessState === 'VOLTAGE_SAG_LVRT' ? '0.30 pu (Creux 30%)' : '1.01 pu (33.3 kV)'}
              </text>
              <text x="10" y="54" fill="#94A3B8" fontSize="7">
                {bessState === 'VOLTAGE_SAG_LVRT' ? 'LVRT: Injection Iq max' : 'Stabilité tension: Conforme'}
              </text>
            </g>

            {/* Net Plant Export Power P_net and Q_net */}
            <g transform="translate(20, 185)">
              <rect x="0" y="0" width="300" height="70" rx="6" fill="#162032" />
              <text x="15" y="20" fill="#FBBF24" fontSize="9" fontWeight="bold">
                BILAN DE PUISSANCE INJECTÉE AU POINT DE CONNEXION :
              </text>
              <text x="15" y="42" fill="#FFF" fontSize="15" fontWeight="900" fontFamily="monospace">
                {bessState === 'NORMAL_PEAK' && 'P_net = +18.4 MW | Q_net = 0 MVAR'}
                {bessState === 'UNDER_FREQUENCY' && 'P_net = +28.4 MW (Boost FFR +10MW)'}
                {bessState === 'OVER_FREQUENCY' && 'P_net = +8.2 MW (Écrêté P(f))'}
                {bessState === 'VOLTAGE_SAG_LVRT' && 'P_net = +2.0 MW | Q_net = +15 MVAR'}
                {bessState === 'EVENING_DISPATCH' && 'P_net = +10.0 MW (100% BESS)'}
              </text>
              <text x="15" y="60" fill="#34D399" fontSize="8" fontFamily="monospace">
                Comptage Transactionnel Classe 0.2S · Téléconduite Dispatching SONATREL
              </text>
            </g>

            {/* Grounding & Real Network Case */}
            <g transform="translate(20, 270)">
              <rect x="0" y="0" width="300" height="85" rx="6" fill="#131E34" stroke="#1E293B" strokeWidth="1" />
              <text x="15" y="20" fill="#38BDF8" fontSize="9" fontWeight="bold">
                CAS RÉEL DU RÉSEAU DU CAMEROUN (RIN) :
              </text>
              <text x="15" y="38" fill="#E2E8F0" fontSize="9">
                Centrales Solaires de Maroua (15 MWc + 10 MWh) & Guider (15 MWc + 10 MWh).
              </text>
              <text x="15" y="54" fill="#94A3B8" fontSize="8">
                Stabilisation dynamique de l'interconnexion Nord (RIN) face aux variations du barrage de Lagdo (72 MW).
              </text>
              <text x="15" y="70" fill="#FDE047" fontSize="8" fontFamily="monospace">
                Gain en stabilité : Élimination des délestages de fréquence
              </text>
            </g>
          </g>

          {/* ================================================================= */}
          {/* BOTTOM GOVERNING EQUATIONS & GRID CODE STANDARDS                  */}
          {/* ================================================================= */}
          <g transform="translate(40, 500)" onClick={() => handleSelect('PPC_PLANT_CONTROLLER')}>
            <rect
              x="0"
              y="0"
              width="1120"
              height="155"
              rx="12"
              fill="#0E1626"
              stroke={activeElement === 'PPC_PLANT_CONTROLLER' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeElement === 'PPC_PLANT_CONTROLLER' ? '2.5' : '1.5'}
            />

            {/* Title */}
            <text x="25" y="28" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {locale === 'fr'
                ? "LOIS DE COMMANDE DU CONTRÔLEUR DE CENTRALE (PPC) & GRID CODE (IEEE 2800 / CEI 62933) :"
                : "POWER PLANT CONTROLLER (PPC) CONTROL LAWS & GRID CODE (IEEE 2800 / IEC 62933):"}
            </text>

            {/* Formula 1: Frequency Droop P(f) */}
            <g transform="translate(25, 45)">
              <rect x="0" y="0" width="340" height="92" rx="6" fill="#13233C" stroke="#0284C7" strokeWidth="1" />
              <text x="12" y="18" fill="#38BDF8" fontSize="9" fontWeight="bold">
                1. Statisme en Fréquence P(f) (Droop s = 3 à 5%) :
              </text>
              <text x="12" y="36" fill="#FFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                ΔP = - (P_n / s) · (Δf / f_n)
              </text>
              <text x="12" y="52" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                Bande morte: |Δf| &lt; 0.03 Hz (IEEE 2800-2022)
              </text>
              <text x="12" y="70" fill="#CBD5E1" fontSize="8">
                Réponse ultra-rapide (FFR) du BESS en moins de 150 ms pour freiner la dérive de fréquence.
              </text>
            </g>

            {/* Formula 2: Synthetic / Virtual Inertia H */}
            <g transform="translate(385, 45)">
              <rect x="0" y="0" width="340" height="92" rx="6" fill="#13233C" stroke="#D97706" strokeWidth="1" />
              <text x="12" y="18" fill="#FBBF24" fontSize="9" fontWeight="bold">
                2. Inertie Virtuelle Synthétique (Source GFM) :
              </text>
              <text x="12" y="36" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                P_inertie = - 2 · H · (S_n / f_n) · (df/dt)
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                H_équivalent = 3.5 à 5.0 s (équivalent rotor alternateur synchrone).
              </text>
              <text x="12" y="70" fill="#34D399" fontSize="8" fontFamily="monospace">
                Émule le comportement naturel d'une masse tournante.
              </text>
            </g>

            {/* Formula 3: Reactive Support Q(U) & LVRT */}
            <g transform="translate(745, 45)">
              <rect x="0" y="0" width="350" height="92" rx="6" fill="#13233C" stroke="#7C3AED" strokeWidth="1" />
              <text x="12" y="18" fill="#C4B5FD" fontSize="9" fontWeight="bold">
                3. Support Réactif Q(U) & Tenue aux Creux LVRT :
              </text>
              <text x="12" y="36" fill="#E9D5FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                I_q = K_lvrt · (1.0 - U/U_n) · I_n  (K_lvrt ≥ 2.0)
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                Maintien de connexion garanti jusqu'à U = 0.0 pu pendant 150 ms.
              </text>
              <text x="12" y="70" fill="#E2E8F0" fontSize="8">
                Empêche l'effondrement en cascade de tension lors des courts-circuits HTB.
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Engineering Footnote Summary */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-amber-400 font-bold block mb-1 font-mono">
            Régulation Primaire Décentralisée (FFR) :
          </span>
          <p className="text-[11px] text-slate-400">
            Contrairement aux centrales thermiques (temps de rampe 10-30 s), les batteries LFP injectent leur pleine puissance en moins de 200 ms, divisant le nadir de fréquence par deux.
          </p>
        </div>

        <div>
          <span className="text-cyan-400 font-bold block mb-1 font-mono">
            Réseau Formant vs Réseau Suiveur (GFM / GFL) :
          </span>
          <p className="text-[11px] text-slate-400">
            Les onduleurs GFM créent une référence de tension interne autonome, permettant le redémarrage d'îlots (black-start) et la stabilité sur réseaux faibles à faible courant de court-circuit (SCR &lt; 2.0).
          </p>
        </div>

        <div>
          <span className="text-emerald-400 font-bold block mb-1 font-mono">
            Dimensionnement C-Rate & Cyclabilité LFP :
          </span>
          <p className="text-[11px] text-slate-400">
            Capacité 20 MWh / 10 MW (régime 0.5C), durée de vie &gt; 6 000 cycles à 80% DOD avec gestion thermique liquide prévenant l'emballement thermique (thermal runaway).
          </p>
        </div>
      </div>
    </div>
  );
};
