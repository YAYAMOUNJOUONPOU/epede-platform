// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 18 : STEP RÉVERSIBLE, COMPENSATEUR SYNCHRONE
// & ROBOTIQUE SUBAQUATIQUE ROV/AUV
// Pumped Storage (PSH), Tailwater Depressed Synchronous Condenser & Subsea Inspection
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Zap,
  Gauge,
  Sliders,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Waves,
  Eye,
  Anchor,
  Compass,
  Layers,
  Wind,
  Cpu,
  Activity,
} from 'lucide-react';
import {
  DEFAULT_PSH_PARAMS,
  DEFAULT_SYNC_CONDENSER_PARAMS,
  DEFAULT_ROV_SYSTEM,
  calculatePshOperatingMetrics,
  generate24HourPshDispatch,
} from '../../data/hydropowerPshStorageData';
import type { PshOperatingMode } from '../../types/hydropowerPshStorage';

interface HydropowerPshStorageViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerPshStorageView: React.FC<HydropowerPshStorageViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'psh_dfig' | 'sync_condenser' | 'subsea_rov'>('psh_dfig');

  // Sub-Tab 1: PSH Controls
  const [operatingMode, setOperatingMode] = useState<PshOperatingMode>('generating');
  const [ratedTurbineMw, setRatedTurbineMw] = useState<number>(200);
  const [dfigSpeedOffset, setDfigSpeedOffset] = useState<number>(0); // -10% to +10%
  const [reactiveSetpointMvar, setReactiveSetpointMvar] = useState<number>(45);
  const [grossHeadM, setGrossHeadM] = useState<number>(110);

  // Sub-Tab 2: Synchronous Condenser Controls
  const [scoReactiveQ, setScoReactiveQ] = useState<number>(120); // -90 to +160 Mvar
  const [airDepressionPressureBar, setAirDepressionPressureBar] = useState<number>(4.8);
  const [rocofDisturbanceMw, setRocofDisturbanceMw] = useState<number>(80); // Tripping 80 MW

  // Sub-Tab 3: ROV Inspection Station
  const [selectedZoneId, setSelectedZoneId] = useState<string>('trashrack_intake');

  // Computed PSH Metrics
  const pshMetrics = useMemo(() => {
    return calculatePshOperatingMetrics(
      operatingMode,
      ratedTurbineMw,
      DEFAULT_PSH_PARAMS.ratedPumpCapacityMw,
      dfigSpeedOffset,
      reactiveSetpointMvar,
      grossHeadM
    );
  }, [operatingMode, ratedTurbineMw, dfigSpeedOffset, reactiveSetpointMvar, grossHeadM]);

  // 24-Hour Dispatch Simulation
  const dispatch24h = useMemo(() => {
    return generate24HourPshDispatch();
  }, []);

  // Selected ROV Zone
  const selectedZone = useMemo(() => {
    return (
      DEFAULT_ROV_SYSTEM.targetZones.find((z) => z.id === selectedZoneId) ||
      DEFAULT_ROV_SYSTEM.targetZones[0]
    );
  }, [selectedZoneId]);

  // RoCoF Calculation (Hz/s) = df/dt = -(f0 * DeltaP) / (2 * H * S_total)
  const rocofAnalysis = useMemo(() => {
    const f0 = 50.0;
    const baseInertiaMWs = 420 * 3.8; // Base Nachtigal hydro inertia
    const pshInertiaMWs = 200 * DEFAULT_SYNC_CONDENSER_PARAMS.inertiaConstantHSeconds; // +840 MW.s
    
    const rocofWithoutSCO = -(f0 * rocofDisturbanceMw) / (2 * baseInertiaMWs);
    const rocofWithSCO = -(f0 * rocofDisturbanceMw) / (2 * (baseInertiaMWs + pshInertiaMWs));

    return {
      rocofWithout: Number(rocofWithoutSCO.toFixed(3)),
      rocofWith: Number(rocofWithSCO.toFixed(3)),
      dampingPercent: Number((((Math.abs(rocofWithoutSCO) - Math.abs(rocofWithSCO)) / Math.abs(rocofWithoutSCO)) * 100).toFixed(1)),
    };
  }, [rocofDisturbanceMw]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C1520] via-[#121F2D] to-[#091018] border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                {locale === 'fr'
                  ? 'ÉTAPE 18 • STEP RÉVERSIBLE, COMPENSATEUR SYNCHRONE & ROBOTIQUE ROV'
                  : 'STEP 18 • PUMPED STORAGE (PSH), SYNCHRONOUS CONDENSER & SUBSEA ROV'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEC 60034-3 / IEC 61362 / IEEE 2800 / ICOLD BULLETIN 180</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <RotateCcw className="h-6 w-6 text-cyan-400" />
              <span>
                {locale === 'fr'
                  ? 'Station de Transfert d\'Énergie par Pompage (STEP), Dénoiement d\'Aube & Inspection Subaquatique'
                  : 'Pumped Storage Hydro (PSH), Tailwater Depressed Condenser & Subsea ROV'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Extension du complexe de Nachtigal avec une STEP 200 MW à vitesse variable DFIG (bassin perché 14.5 Mm³), mode compensateur synchrone à roue dénoyée pour soutien de tension/inertie 225 kV, et surveillance des pertuis par drone ROV 3D.'
                : 'Expansion of the Nachtigal complex with 200 MW variable-speed DFIG PSH (14.5 Mm³ upper reservoir), tailwater-depressed synchronous condenser for 225 kV grid inertia, and subsea 3D ROV inspection.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC-60041')}
                className="px-3 py-2 rounded-xl bg-[#142333] hover:bg-[#1C324A] border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEC 60034-3 / ICOLD B.180</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1E3043]">
          <button
            type="button"
            onClick={() => setActiveSubTab('psh_dfig')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'psh_dfig'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#0E1A26] text-neutral-300 hover:text-white border border-[#203347]'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. STEP Réversible & Régulation DFIG' : '1. Reversible PSH & DFIG Control'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sync_condenser')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'sync_condenser'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#0E1A26] text-neutral-300 hover:text-white border border-[#203347]'
            }`}
          >
            <Wind className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Compensateur Synchrone & Inertie Réseau' : '2. Synchronous Condenser & Inertia'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('subsea_rov')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'subsea_rov'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#0E1A26] text-neutral-300 hover:text-white border border-[#203347]'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Inspection Subaquatique Drone ROV (ICOLD)' : '3. Subsea ROV Inspection (ICOLD)'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: REVERSIBLE PUMP-TURBINE & VARIABLE SPEED DFIG             */}
      {/* ==================================================================== */}
      {activeSubTab === 'psh_dfig' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key PSH Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Active Échangée</div>
              <div
                className={`text-2xl font-black mt-1 ${
                  pshMetrics.activePowerMw > 0
                    ? 'text-emerald-400'
                    : pshMetrics.activePowerMw < 0
                    ? 'text-amber-400'
                    : 'text-neutral-400'
                }`}
              >
                {pshMetrics.activePowerMw > 0 ? `+${pshMetrics.activePowerMw}` : pshMetrics.activePowerMw}{' '}
                <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                {operatingMode === 'generating'
                  ? 'Turbinage vers réseau 225 kV'
                  : operatingMode === 'pumping'
                  ? 'Pompage de charge hydraulique'
                  : operatingMode === 'sync_condenser'
                  ? 'Pertes de ventilation en air comprimé'
                  : 'Mode transitoire'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-blue-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Débit Volumique Transit</div>
              <div
                className={`text-2xl font-black mt-1 ${
                  pshMetrics.waterDischargeM3s > 0
                    ? 'text-cyan-300'
                    : pshMetrics.waterDischargeM3s < 0
                    ? 'text-blue-400'
                    : 'text-neutral-400'
                }`}
              >
                {pshMetrics.waterDischargeM3s > 0 ? `+${pshMetrics.waterDischargeM3s}` : pshMetrics.waterDischargeM3s}{' '}
                <span className="text-xs font-normal text-neutral-400">m³/s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Chute nette : {grossHeadM} m • Diamètre conduite : 4.6 m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Rendement de Cycle (RTE)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {DEFAULT_PSH_PARAMS.roundTripEfficiencyPercent}{' '}
                <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Turbinage 91.5% × Pompage 88.2% × Perte charge 98.5%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Vitesse DFIG & Fréquence Rotor</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {375 + (dfigSpeedOffset / 100) * 37.5}{' '}
                <span className="text-xs font-normal text-neutral-400">tr/min</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Glissement rotor : {dfigSpeedOffset > 0 ? `+${dfigSpeedOffset}` : dfigSpeedOffset} % (f_slip = {(50 * Math.abs(dfigSpeedOffset) / 100).toFixed(1)} Hz)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#203347]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Modes Opératoires de la STEP' : 'PSH Operational Modes'}</span>
                </h3>
              </div>

              {/* Mode Buttons */}
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase font-bold block">
                  {locale === 'fr' ? 'Sélection du Mode Fonctionnel :' : 'Select Operating Mode:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'generating', labelFr: 'Turbinage (200 MW)', labelEn: 'Turbining (200 MW)', color: 'border-emerald-500 text-emerald-300' },
                    { id: 'pumping', labelFr: 'Pompage (190 MW)', labelEn: 'Pumping (190 MW)', color: 'border-amber-500 text-amber-300' },
                    { id: 'sync_condenser', labelFr: 'Compensateur Synchrone', labelEn: 'Sync Condenser', color: 'border-cyan-500 text-cyan-300' },
                    { id: 'hydraulic_short', labelFr: 'Court-Circuit Hydr.', labelEn: 'Hydraulic Short-Circuit', color: 'border-purple-500 text-purple-300' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOperatingMode(m.id as PshOperatingMode)}
                      className={`p-2.5 rounded-xl border text-left font-bold text-[10px] transition-all ${
                        operatingMode === m.id
                          ? `bg-cyan-950/80 ${m.color} shadow-lg shadow-cyan-950/40`
                          : 'bg-[#101722] border-[#203347] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{locale === 'fr' ? m.labelFr : m.labelEn}</span>
                        {operatingMode === m.id && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider: Turbine Capacity */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Nominale Turbine :' : 'Turbine Rated Capacity:'}</span>
                  <span className="text-cyan-300 font-bold">{ratedTurbineMw} MW</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={ratedTurbineMw}
                  onChange={(e) => setRatedTurbineMw(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Slider: DFIG Speed Offset */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Variation Vitesse DFIG (+/- 10%) :' : 'DFIG Speed Regulation (+/- 10%):'}</span>
                  <span className="text-purple-300 font-bold">{dfigSpeedOffset > 0 ? `+${dfigSpeedOffset}` : dfigSpeedOffset} %</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={dfigSpeedOffset}
                  onChange={(e) => setDfigSpeedOffset(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>-10% (337.5 tr/min - Min charge)</span>
                  <span>+10% (412.5 tr/min - Max débit)</span>
                </div>
              </div>

              {/* Slider: Gross Head */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Hauteur de Chute Brute :' : 'Gross Hydraulic Head:'}</span>
                  <span className="text-amber-400 font-bold">{grossHeadM} m</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  step="5"
                  value={grossHeadM}
                  onChange={(e) => setGrossHeadM(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* DFIG Advantage Info Card */}
              <div className="p-3 rounded-xl bg-[#101722] border border-[#203347] space-y-1.5 text-[11px] text-neutral-300">
                <span className="text-cyan-400 font-bold text-[10px] uppercase block">
                  {locale === 'fr' ? 'Avantage Technologique DFIG (Machine Asynchrone Double Alimentation) :' : 'DFIG Variable Speed Technology Benefit:'}
                </span>
                <p>
                  Contrairement aux groupes vitesse fixe qui pompent à puissance rigide constante, le convertisseur rotorique DFIG permet de moduler la consommation de pompage entre <strong>140 MW et 215 MW</strong>.
                  Cette flexibilité dynamique permet d'absorber exactement la production intermittente du solaire flottant et d'assurer le réglage primaire de fréquence en mode pompage.
                </p>
              </div>
            </div>

            {/* Right Schematic & Animation (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#203347]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Synoptique Hydraulique Haute Chute de la STEP' : 'High-Head PSH Hydraulic Schematic'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                  DFIG 2x100 MW
                </span>
              </div>

              {/* Graphic SVG */}
              <div className="p-4 rounded-xl bg-[#080D14] border border-[#203347] flex flex-col items-center justify-center">
                <svg viewBox="0 0 500 230" className="w-full h-60 select-none">
                  {/* Upper Reservoir Mountain Basin */}
                  <path d="M 30,50 L 140,50 L 160,85 L 10,85 Z" fill="#0C2D48" stroke="#0284C7" strokeWidth="2" />
                  <text x="35" y="42" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    BASSIN SUPÉRIEUR PERCHÉ
                  </text>
                  <text x="35" y="70" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                    Cote 515 m • 14.5 Mm³ (8.2 h stock)
                  </text>

                  {/* Water level upper */}
                  <line x1="25" y1="58" x2="145" y2="58" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Intake & Penstock */}
                  <path
                    d="M 150,75 L 260,165"
                    fill="none"
                    stroke={operatingMode === 'pumping' ? '#F59E0B' : '#06B6D4'}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Flow direction indicators */}
                  {operatingMode === 'generating' && (
                    <>
                      <polygon points="190,115 198,125 204,113" fill="#38BDF8" />
                      <polygon points="230,147 238,157 244,145" fill="#38BDF8" />
                    </>
                  )}
                  {operatingMode === 'pumping' && (
                    <>
                      <polygon points="204,113 198,125 190,115" fill="#F59E0B" />
                      <polygon points="244,145 238,157 230,147" fill="#F59E0B" />
                    </>
                  )}

                  {/* Surge Tank (Cheminée d'équilibre) */}
                  <rect x="235" y="85" width="20" height="70" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                  <text x="220" y="78" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                    Cheminée d'Équilibre
                  </text>

                  {/* Powerhouse Underground Cavern */}
                  <rect x="270" y="140" width="105" height="70" rx="8" fill="#111C28" stroke="#0284C7" strokeWidth="2" />
                  <text x="280" y="158" fill="#F8FAFC" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    USINE STEP
                  </text>
                  <text x="280" y="172" fill="#38BDF8" fontSize="8" fontFamily="monospace">
                    2x Francis RPT
                  </text>
                  <text x="280" y="185" fill="#A855F7" fontSize="8" fontFamily="monospace">
                    DFIG VFD 375 rpm
                  </text>
                  <text x="280" y="198" fill="#10B981" fontSize="8" fontFamily="monospace">
                    Mode : {operatingMode.toUpperCase()}
                  </text>

                  {/* Tailrace tunnel */}
                  <path
                    d="M 375,185 L 430,185"
                    fill="none"
                    stroke={operatingMode === 'pumping' ? '#F59E0B' : '#06B6D4'}
                    strokeWidth="6"
                  />

                  {/* Lower Reservoir (Sanaga / Retenue Nachtigal) */}
                  <path d="M 420,165 L 490,165 L 490,205 L 410,205 Z" fill="#0C2538" stroke="#0284C7" strokeWidth="2" />
                  <text x="422" y="160" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    SANAGA
                  </text>
                  <text x="422" y="180" fill="#94A3B8" fontSize="7" fontFamily="monospace">
                    Cote 405 m PHE
                  </text>
                  <line x1="415" y1="172" x2="485" y2="172" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />

                  {/* 225 kV Substation connection */}
                  <line x1="322" y1="140" x2="322" y2="35" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
                  <rect x="290" y="15" width="65" height="24" rx="4" fill="#292008" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="297" y="30" fill="#FDE68A" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    POSTE 225 kV
                  </text>
                </svg>
              </div>

              {/* Fast Transition Times Table */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2.5 rounded-xl bg-[#101722] border border-[#203347]">
                  <div className="text-neutral-400 text-[9px] uppercase">Arrêt → Turbinage</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">65 s</div>
                  <div className="text-neutral-500 text-[8px]">Démarrage rapide</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#101722] border border-[#203347]">
                  <div className="text-neutral-400 text-[9px] uppercase">Turbinage → Pompage</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">90 s</div>
                  <div className="text-neutral-500 text-[8px]">Inversion de rotation</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#101722] border border-[#203347]">
                  <div className="text-neutral-400 text-[9px] uppercase">Pompage → Turbinage</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">55 s</div>
                  <div className="text-neutral-500 text-[8px]">Secours déclenchement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: SYNCHRONOUS CONDENSER (DÉNOIEMENT) & GRID INERTIA         */}
      {/* ==================================================================== */}
      {activeSubTab === 'sync_condenser' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Réactive (Q) Injectée</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {scoReactiveQ > 0 ? `+${scoReactiveQ}` : scoReactiveQ}{' '}
                <span className="text-xs font-normal text-neutral-400">Mvar</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Plage continue : <strong>-90 Mvar à +160 Mvar</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Pression Dénoiement Air Comprimé</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {airDepressionPressureBar} <span className="text-xs font-normal text-neutral-400">bar</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Niveau d'eau abaissé sous la roue de turbine
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Constante d'Inertie Synchrone H</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                4.2 <span className="text-xs font-normal text-neutral-400">s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Énergie cinétique rotative : <strong>840 MW·s par groupe</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Amortissement RoCoF Réseau</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                +{rocofAnalysis.dampingPercent} <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Freinage du gradient de fréquence sur incident
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Synchronous Condenser Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#203347]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Régulateur de Puissance Réactive & Dénoiement' : 'AVR Reactive & Tailwater Controls'}</span>
                </h3>
              </div>

              {/* Reactive Setpoint Slider */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Consigne Réactive Q (kV Boost / Buck) :' : 'Reactive Power Setpoint Q:'}</span>
                  <span className={`font-bold ${scoReactiveQ >= 0 ? 'text-cyan-300' : 'text-amber-400'}`}>
                    {scoReactiveQ >= 0 ? `+${scoReactiveQ} Mvar (Capacitif - Hausse U)` : `${scoReactiveQ} Mvar (Inductif - Baisse U)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="160"
                  step="5"
                  value={scoReactiveQ}
                  onChange={(e) => setScoReactiveQ(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Air Pressure Slider */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Pression Réservoir d\'Air Comprimé :' : 'Air Blowdown Pressure:'}</span>
                  <span className="text-emerald-400 font-bold">{airDepressionPressureBar} bar</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="6.5"
                  step="0.1"
                  value={airDepressionPressureBar}
                  onChange={(e) => setAirDepressionPressureBar(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Simulated Grid Trip Disturbance */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Perte Brusque de Production Réseau (Incident) :' : 'Sudden Generation Loss Event:'}</span>
                  <span className="text-amber-400 font-bold">{rocofDisturbanceMw} MW</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  step="10"
                  value={rocofDisturbanceMw}
                  onChange={(e) => setRocofDisturbanceMw(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Physical Principle Card */}
              <div className="p-4 rounded-xl bg-[#101722] border border-[#203347] space-y-2 text-[11px] text-neutral-300">
                <div className="text-cyan-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Principe Physique du Dénoiement d\'Aube :' : 'Tailwater Depression Physics:'}</span>
                </div>
                <p>
                  Les directrices sont hermétiquement fermées. L'air comprimé à <strong>{airDepressionPressureBar} bar</strong> est injecté dans le plafond de la turbine pour chasser l'eau dans l'aspirateur sous la roue en <strong>42 secondes</strong>.
                </p>
                <p>
                  La roue tourne alors dans l'air, réduisant la traînée de frottement de 7.5 MW à seulement <strong>1.8 MW</strong>, tout en injectant jusqu'à <strong>160 Mvar</strong> pour stabiliser le réseau 225 kV Sonatrel sans gaspiller une seule goutte d'eau.
                </p>
              </div>
            </div>

            {/* RoCoF & Dynamic Stability Curves (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#203347]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Analyse Dynamique du Gradient de Fréquence (RoCoF)' : 'Dynamic RoCoF Frequency Gradient Analysis'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  IEEE 2800-2022
                </span>
              </div>

              {/* RoCoF Comparison Box */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#171010] border border-red-500/30 space-y-1">
                  <div className="text-red-400 text-[10px] uppercase font-bold">Sans Compensateur Synchrone</div>
                  <div className="text-2xl font-black text-red-300">
                    {rocofAnalysis.rocofWithout} <span className="text-xs font-normal">Hz/s</span>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Risque élevé de déclenchement intempestif des relais de délestage UFLS (&gt; 0.8 Hz/s).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1A17] border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400 text-[10px] uppercase font-bold">Avec Compensateur Synchrone STEP</div>
                  <div className="text-2xl font-black text-emerald-300">
                    {rocofAnalysis.rocofWith} <span className="text-xs font-normal">Hz/s</span>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Inertie physique additionnelle (+840 MW·s) amortissant la chute de fréquence de <strong>{rocofAnalysis.dampingPercent}%</strong>.
                  </p>
                </div>
              </div>

              {/* Chronogram of Frequency Event SVG */}
              <div className="p-4 rounded-xl bg-[#080D14] border border-[#203347]">
                <div className="text-[10px] text-neutral-400 mb-2 uppercase font-bold flex justify-between">
                  <span>Trajectoire Fréquence après incident ({rocofDisturbanceMw} MW)</span>
                  <span className="text-cyan-300">Nadir f_min : {(50.0 - (rocofDisturbanceMw / 280)).toFixed(2)} Hz</span>
                </div>
                <svg viewBox="0 0 450 140" className="w-full h-36 select-none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="430" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="24" fill="#64748B" fontSize="8" fontFamily="monospace">50.0</text>

                  <line x1="40" y1="60" x2="430" y2="60" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="64" fill="#64748B" fontSize="8" fontFamily="monospace">49.6</text>

                  <line x1="40" y1="100" x2="430" y2="100" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="104" fill="#EF4444" fontSize="8" fontFamily="monospace">49.2</text>

                  {/* Red Curve: Without SCO */}
                  <path
                    d="M 40,20 L 70,20 L 110,95 L 170,110 L 260,85 L 430,75"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Green Curve: With SCO */}
                  <path
                    d="M 40,20 L 70,20 L 120,62 L 190,68 L 270,45 L 430,35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />

                  {/* Legend */}
                  <circle cx="160" cy="125" r="3" fill="#10B981" />
                  <text x="170" y="128" fill="#A7F3D0" fontSize="9" fontFamily="monospace">
                    Avec STEP Synchrone (Nadir freiné)
                  </text>

                  <circle cx="310" cy="125" r="3" fill="#EF4444" />
                  <text x="320" y="128" fill="#FCA5A5" fontSize="9" fontFamily="monospace">
                    Sans Inertie Synchrone
                  </text>
                </svg>
              </div>

              {/* Voltage Boost Comparison */}
              <div className="p-3 rounded-xl bg-[#101722] border border-[#203347] flex items-center justify-between text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-neutral-400 uppercase">Tension Bus 225 kV Nachtigal :</span>
                  <div className="text-white font-bold text-xs">
                    {(225.0 + (scoReactiveQ / 160) * 8.5).toFixed(1)} kV ({((225.0 + (scoReactiveQ / 160) * 8.5) / 225.0).toFixed(3)} p.u.)
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  CONFORME SONATREL GRID CODE [0.95 - 1.05 p.u.]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: SUBSEA ROV / AUV DRONE INSPECTION (ICOLD B. 180)          */}
      {/* ==================================================================== */}
      {activeSubTab === 'subsea_rov' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top Drone Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Vecteur ROV Actif</div>
              <div className="text-lg font-black text-cyan-300 mt-1 truncate">
                {DEFAULT_ROV_SYSTEM.rovModel}
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Profondeur max certifiée : <strong>{DEFAULT_ROV_SYSTEM.maxOperatingDepthMeters} m</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Autonomie Batterie LiFePO4</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {DEFAULT_ROV_SYSTEM.batteryAutonomyHours} <span className="text-xs font-normal text-neutral-400">h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Ombilical fibre optique 500 m neutre</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Positionnement Hydro-Acoustique</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                USBL <span className="text-xs font-normal text-neutral-400">Transponder</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Précision millimétrique RTK surface</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Score d'Intégrité de la Zone</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {selectedZone.integrityScorePercent} <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Statut : <strong className={selectedZone.status === 'normal' ? 'text-emerald-400' : 'text-amber-400'}>{selectedZone.status.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Zone Selector (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#203347]">
                <Anchor className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Points d\'Inspection Immergés' : 'Subaquatic Target Zones'}</span>
              </h3>

              <div className="space-y-2">
                {DEFAULT_ROV_SYSTEM.targetZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedZoneId === zone.id
                        ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/40'
                        : 'bg-[#101722] border-[#203347] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">
                        {locale === 'fr' ? zone.nameFr : zone.nameEn}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          zone.status === 'normal'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {zone.depthM} m
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>{zone.inspectionType.replace('_', ' ')}</span>
                      <span className="font-bold text-cyan-300">{zone.integrityScorePercent}%</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Sensor Payload List */}
              <div className="pt-3 border-t border-[#203347] space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Capteurs Embarqués ROV :</span>
                <ul className="space-y-1 text-[10px] text-neutral-300">
                  {DEFAULT_ROV_SYSTEM.payloadSensors.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Inspection Station & 3D Findings (8 Cols) */}
            <div className="lg:col-span-8 p-5 rounded-2xl border border-[#203347] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#203347]">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Compass className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Rapport d\'Auscultation Bathymétrique & Photogrammétrie' : 'Bathymetric & Photogrammetry Diagnostic Dossier'}</span>
                  </h4>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Cible active : <strong className="text-cyan-300">{locale === 'fr' ? selectedZone.nameFr : selectedZone.nameEn}</strong> (Profondeur : {selectedZone.depthM} m)
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                  ICOLD BULLETIN 180 COMPLIANT
                </span>
              </div>

              {/* Visual Simulated Sonar Camera Feed */}
              <div className="relative rounded-xl overflow-hidden border border-[#203347] bg-[#04080E] p-4">
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[9px] text-red-400 font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>ROV FEED LIVE 4K • 60 FPS • DEPTH {selectedZone.depthM}.0 M</span>
                </div>

                <div className="absolute top-3 right-3 text-[9px] text-cyan-300 font-mono">
                  USBL: 04°21'18"N 11°38'02"E
                </div>

                {/* Subsea Graphical Canvas SVG */}
                <svg viewBox="0 0 460 160" className="w-full h-44 select-none mt-4">
                  {/* Water dark gradient background */}
                  <rect x="10" y="10" width="440" height="140" rx="6" fill="#06121E" stroke="#0E2842" strokeWidth="1.5" />

                  {/* Sonar sweep line effect */}
                  <circle cx="230" cy="80" r="60" fill="none" stroke="#0EA5E9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                  <circle cx="230" cy="80" r="40" fill="none" stroke="#0EA5E9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx="230" cy="80" r="20" fill="none" stroke="#0EA5E9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" />

                  {/* Concrete structure boundary */}
                  <path d="M 60,30 L 140,30 L 180,130 L 80,130 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                  <text x="85" y="85" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                    BÉTON HYDRAULIQUE
                  </text>

                  {/* ROV Drone Glyph */}
                  <rect x="280" y="65" width="55" height="30" rx="4" fill="#0369A1" stroke="#38BDF8" strokeWidth="2" />
                  <circle cx="290" cy="80" r="4" fill="#FDE047" />
                  <text x="300" y="83" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    ROV
                  </text>
                  {/* Thruster flares */}
                  <line x1="280" y1="72" x2="270" y2="72" stroke="#38BDF8" strokeWidth="2" />
                  <line x1="280" y1="88" x2="270" y2="88" stroke="#38BDF8" strokeWidth="2" />
                  {/* Sonar Beam */}
                  <polygon points="290,80 160,50 170,110" fill="#0284C7" opacity="0.18" />
                  <line x1="290" y1="80" x2="160" y2="50" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="290" y1="80" x2="170" y2="110" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Laser Measurement Annotation */}
                  <circle cx="165" cy="80" r="3" fill="#EF4444" />
                  <text x="175" y="78" fill="#FCA5A5" fontSize="8" fontFamily="monospace">
                    Écart profil &lt; 0.3 mm
                  </text>
                </svg>
              </div>

              {/* Findings Card */}
              <div className="p-4 rounded-xl bg-[#101722] border border-[#203347] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    {locale === 'fr' ? 'Constats d\'Inspection Détaillés :' : 'Detailed Inspection Observations:'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Dernière mission : <strong>Juin 2026 (Après crue saisonnière)</strong>
                  </span>
                </div>
                <p className="text-neutral-200 text-xs leading-relaxed">
                  {locale === 'fr' ? selectedZone.findingsFr : selectedZone.findingsEn}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-xl bg-[#141F2C] border border-[#203347] flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Action Préconisée ICOLD :</span>
                  <div className="text-white font-medium">
                    {selectedZone.status === 'normal'
                      ? 'Aucune intervention requise. Prochaine auscultation ROV programmée dans 12 mois.'
                      : 'Dragage ciblé par suceuse subaquatique préconisé avant la prochaine grande crue (seuil de vanne).'}
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-all shrink-0"
                >
                  {locale === 'fr' ? 'Générer PV Auscultation' : 'Export PDF Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
