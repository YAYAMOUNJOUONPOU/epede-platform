// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 19 : MODÉLISATION D'ONDE DE RUPTURE DE BARRAGE
// (DAM-BREAK 2D SAINT-VENANT), CARTOGRAPHIE D'INONDATION, PLAN PPI & SIRÈNES SAP
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Waves,
  ShieldAlert,
  Radio,
  Volume2,
  Navigation,
  Sliders,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Layers,
  MapPin,
  Clock,
  Activity,
  Users,
} from 'lucide-react';
import {
  DEFAULT_BREACH_PARAMS,
  DOWNSTREAM_SETTLEMENTS_DATA,
  SIREN_STATIONS_DATA,
  EVACUATION_CORRIDORS_DATA,
  calculateBreachHydraulics,
} from '../../data/hydropowerDamBreakData';
import type { BreachMechanism } from '../../types/hydropowerDamBreak';

interface HydropowerDamBreakViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerDamBreakView: React.FC<HydropowerDamBreakViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'breach_hydro' | 'wave_inundation' | 'ppi_sirens'>('breach_hydro');

  // Sub-Tab 1 Controls: Breach Parameters
  const [breachMechanism, setBreachMechanism] = useState<BreachMechanism>('overtopping');
  const [reservoirVolumeMm3, setReservoirVolumeMm3] = useState<number>(65.0);
  const [damHeightM, setDamHeightM] = useState<number>(14.0);
  const [overtoppingHeightM, setOvertoppingHeightM] = useState<number>(1.2);

  // Sub-Tab 2 Controls: Wave Propagation Focus
  const [selectedSettlementId, setSelectedSettlementId] = useState<string>('batchenga_ferry');

  // Sub-Tab 3 Controls: Siren Emergency Action Plan Console
  const [sirenArmSwitch, setSirenArmSwitch] = useState<boolean>(false);
  const [activeAlertTriggered, setActiveAlertTriggered] = useState<boolean>(false);
  const [sirenFilterStatus, setSirenFilterStatus] = useState<string>('ALL');

  // Computed Breach Hydraulics
  const breachResults = useMemo(() => {
    return calculateBreachHydraulics(breachMechanism, reservoirVolumeMm3, damHeightM, overtoppingHeightM);
  }, [breachMechanism, reservoirVolumeMm3, damHeightM, overtoppingHeightM]);

  // Selected Downstream Settlement
  const selectedSettlement = useMemo(() => {
    return (
      DOWNSTREAM_SETTLEMENTS_DATA.find((s) => s.id === selectedSettlementId) ||
      DOWNSTREAM_SETTLEMENTS_DATA[0]
    );
  }, [selectedSettlementId]);

  // Max peak discharge in hydrograph for SVG scaling
  const maxHydrographQ = useMemo(() => {
    return Math.max(...breachResults.totalOutflowHydrograph.map((p) => p.dischargeM3s), 1000);
  }, [breachResults]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#1A0A0A] via-[#241012] to-[#120808] border border-red-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-red-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/50 text-[10px] font-mono font-bold text-red-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                {locale === 'fr'
                  ? 'ÉTAPE 19 • MODÉLISATION ONDE DE RUPTURE 2D & PLAN PPI'
                  : 'STEP 19 • DAM BREAK HYDRODYNAMIC WAVE 2D & PPI PLAN'}
              </span>
              <span className="text-xs font-mono text-neutral-400">ICOLD BULLETIN 111 / FEMA P-946 / DIRECTIVE SEVESO III / CEI 62682</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <AlertOctagon className="h-6 w-6 text-red-500" />
              <span>
                {locale === 'fr'
                  ? 'Onde de Submersion de Saint-Venant 2D, Cartographie d\'Aléa & Système d\'Alerte Sirènes'
                  : 'Saint-Venant 2D Inundation Wave, Hazard Mapping & Emergency Siren System'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Simulation hydrodynamique de rupture de brèche (Froehlich), propagation de l\'onde de crue sur 168 km le long de la Sanaga (Batchenga, Obala, Monatélé, Ebebda, Song Loulou, Edéa) et armement du Plan Particulier d\'Intervention (PPI) avec réseau de sirènes 130 dB.'
                : 'Dam breach hydrodynamic simulation (Froehlich), 2D flood wave propagation over 168 km along the Sanaga River, and Emergency Action Plan (PPI) armed with 130 dB satellite sirens.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('ICOLD-B111')}
                className="px-3 py-2 rounded-xl bg-[#2A1214] hover:bg-[#3D1A1D] border border-red-500/40 text-xs font-mono font-bold text-red-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>ICOLD B.111 / FEMA P-946</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#351A1C]">
          <button
            type="button"
            onClick={() => setActiveSubTab('breach_hydro')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'breach_hydro'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-[#150B0C] text-neutral-300 hover:text-white border border-[#2D1618]'
            }`}
          >
            <Waves className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Hydrodynamique de Brèche (Froehlich)' : '1. Breach Hydraulics (Froehlich)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('wave_inundation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'wave_inundation'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-[#150B0C] text-neutral-300 hover:text-white border border-[#2D1618]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Onde 2D de Saint-Venant & Aléa Aval' : '2. 2D Saint-Venant Wave & Downstream Hazard'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ppi_sirens')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ppi_sirens'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-[#150B0C] text-neutral-300 hover:text-white border border-[#2D1618]'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Plan PPI, Sirènes 130 dB & Évacuation' : '3. PPI Plan, 130 dB Sirens & Evacuation'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: BREACH HYDRAULICS & HYDROGRAPH GENERATION                */}
      {/* ==================================================================== */}
      {activeSubTab === 'breach_hydro' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Breach Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-red-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Débit de Pointe de Rupture (Qp)</div>
              <div className="text-2xl font-black text-red-400 mt-1">
                {breachResults.peakDischargeM3s.toLocaleString()}{' '}
                <span className="text-xs font-normal text-neutral-400">m³/s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Soit ~<strong>18 fois</strong> le débit de crue décennale
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Largeur Moyenne de Brèche (B_ave)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {breachResults.breachWidthM} <span className="text-xs font-normal text-neutral-400">m</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Talus latéraux Z = 0.7H:1V (Béton BCR)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Temps de Formation de Brèche (tf)</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {breachResults.formationTimeMin} <span className="text-xs font-normal text-neutral-400">min</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Progression érosive Froehlich (2008)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Volume Évacué par la Brèche</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {reservoirVolumeMm3} <span className="text-xs font-normal text-neutral-400">Mm³</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Vidange totale de la retenue en ~3.0 heures
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Breach Parameters Sliders (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D1618]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-red-500" />
                  <span>{locale === 'fr' ? 'Scénario & Paramètres de Brèche' : 'Breach Scenario & Parameters'}</span>
                </h3>
              </div>

              {/* Mechanism Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase font-bold block">
                  {locale === 'fr' ? 'Mécanisme Initiateur de Rupture :' : 'Breach Initiating Mechanism:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'overtopping', labelFr: 'Surverse (PMF)', labelEn: 'Overtopping' },
                    { id: 'piping', labelFr: 'Renard Hydr.', labelEn: 'Piping Erosion' },
                    { id: 'seismic_toe', labelFr: 'Séisme Majeur', labelEn: 'Major Seismic' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setBreachMechanism(m.id as BreachMechanism)}
                      className={`p-2 rounded-xl border text-center font-bold text-[10px] transition-all ${
                        breachMechanism === m.id
                          ? 'bg-red-950/80 border-red-500 text-red-300 shadow-md shadow-red-950/50'
                          : 'bg-[#150B0C] border-[#2D1618] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{locale === 'fr' ? m.labelFr : m.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider: Reservoir Volume */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Volume de Retenue Nachtigal :' : 'Headpond Storage Volume:'}</span>
                  <span className="text-purple-300 font-bold">{reservoirVolumeMm3} Mm³</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={reservoirVolumeMm3}
                  onChange={(e) => setReservoirVolumeMm3(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>20 Mm³ (Étiage sévère)</span>
                  <span>120 Mm³ (Crue extrême Lom Pangar)</span>
                </div>
              </div>

              {/* Slider: Dam Height */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Hauteur du Barrage BCR (hw) :' : 'Dam Height (hw):'}</span>
                  <span className="text-amber-400 font-bold">{damHeightM} m</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="25"
                  step="1"
                  value={damHeightM}
                  onChange={(e) => setDamHeightM(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Slider: Overtopping Height */}
              {breachMechanism === 'overtopping' && (
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Surverse au-dessus de la Crête :' : 'Overtopping Crest Depth:'}</span>
                    <span className="text-red-400 font-bold">{overtoppingHeightM} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.5"
                    step="0.1"
                    value={overtoppingHeightM}
                    onChange={(e) => setOvertoppingHeightM(parseFloat(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="text-[9px] text-neutral-500 mt-0.5">
                    Hauteur de lame déversante sur le couronnement de la digue
                  </div>
                </div>
              )}

              {/* Hydraulic Reference Note */}
              <div className="p-3 rounded-xl bg-[#140C0E] border border-[#2D1618] space-y-1 text-[11px] text-neutral-300">
                <span className="text-red-400 font-bold text-[10px] uppercase block">
                  {locale === 'fr' ? 'Formulation Empirique de Froehlich (2008) :' : 'Froehlich (2008) Breach Formula:'}
                </span>
                <p>
                  Les régressions non-linéaires de Froehlich basées sur 74 ruptures historiques de barrages fournissent la largeur moyenne : <code>B_ave = 0.27·Ko·Vw^0.32·hw^0.04</code> et le temps de formation <code>tf = 63.2·√(Vw / g·hw²)</code>.
                </p>
              </div>
            </div>

            {/* Breach Hydrograph Chart (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D1618]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>{locale === 'fr' ? 'Hydrogramme de Sortie au Droit du Barrage' : 'Outflow Breach Hydrograph'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-800">
                  Q_max = {breachResults.peakDischargeM3s.toLocaleString()} m³/s
                </span>
              </div>

              {/* Hydrograph SVG Chart */}
              <div className="p-4 rounded-xl bg-[#080406] border border-[#2D1618]">
                <div className="flex justify-between text-[10px] text-neutral-400 mb-2 font-mono">
                  <span>Débit Q (m³/s)</span>
                  <span className="text-red-400 font-bold">Pic atteint à t = {breachResults.formationTimeMin} min</span>
                </div>

                <svg viewBox="0 0 500 200" className="w-full h-52 select-none">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="#2D1618" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="24" fill="#991B1B" fontSize="8" fontFamily="monospace">
                    {maxHydrographQ}
                  </text>

                  <line x1="50" y1="80" x2="480" y2="80" stroke="#2D1618" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="84" fill="#64748B" fontSize="8" fontFamily="monospace">
                    {Math.round(maxHydrographQ * 0.6)}
                  </text>

                  <line x1="50" y1="140" x2="480" y2="140" stroke="#2D1618" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="15" y="144" fill="#64748B" fontSize="8" fontFamily="monospace">
                    {Math.round(maxHydrographQ * 0.2)}
                  </text>

                  <line x1="50" y1="180" x2="480" y2="180" stroke="#475569" strokeWidth="1" />
                  <text x="15" y="184" fill="#64748B" fontSize="8" fontFamily="monospace">0</text>

                  {/* Breach Hydrograph Area & Curve */}
                  {(() => {
                    const points = breachResults.totalOutflowHydrograph;
                    const maxT = points[points.length - 1]?.timeMin || 180;
                    const coords = points.map((p) => {
                      const x = 50 + (p.timeMin / maxT) * 430;
                      const y = 180 - (p.dischargeM3s / maxHydrographQ) * 160;
                      return `${x},${y}`;
                    });

                    const pathD = `M 50,180 L ${coords.join(' L ')} L ${coords[coords.length - 1].split(',')[0]},180 Z`;
                    const lineD = `M ${coords.join(' L ')}`;

                    return (
                      <>
                        <path d={pathD} fill="#DC2626" opacity="0.25" />
                        <path d={lineD} fill="none" stroke="#EF4444" strokeWidth="2.5" />
                      </>
                    );
                  })()}

                  {/* Formation Time Vertical Marker */}
                  {(() => {
                    const points = breachResults.totalOutflowHydrograph;
                    const maxT = points[points.length - 1]?.timeMin || 180;
                    const xPeak = 50 + (breachResults.formationTimeMin / maxT) * 430;
                    return (
                      <>
                        <line x1={xPeak} y1="20" x2={xPeak} y2="180" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="4 2" />
                        <circle cx={xPeak} cy="20" r="4" fill="#FDE047" />
                        <text x={xPeak + 6} y="32" fill="#FDE047" fontSize="9" fontWeight="bold" fontFamily="monospace">
                          tf = {breachResults.formationTimeMin} min (Q_peak)
                        </text>
                      </>
                    );
                  })()}

                  {/* Time Axis Labels */}
                  <text x="50" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">0 min</text>
                  <text x="250" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">
                    {Math.round((breachResults.totalOutflowHydrograph[breachResults.totalOutflowHydrograph.length - 1]?.timeMin || 180) / 2)} min
                  </text>
                  <text x="450" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">
                    {breachResults.totalOutflowHydrograph[breachResults.totalOutflowHydrograph.length - 1]?.timeMin || 180} min
                  </text>
                </svg>
              </div>

              {/* Summary of Breached Structure */}
              <div className="p-3.5 rounded-xl bg-[#140C0E] border border-[#2D1618] flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-neutral-400 uppercase text-[10px]">Ouvrage Impacté :</span>
                  <div className="text-white font-bold">Digue Principale en Béton Compacté au Rouleau (BCR)</div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 uppercase text-[10px]">Classe de Rupture CIGB :</span>
                  <div className="text-red-400 font-bold">CATACLYSMIQUE (Coteau Aval Risque Majeur)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: 2D SAINT-VENANT WAVE PROPAGATION & DOWNSTREAM HAZARD     */}
      {/* ==================================================================== */}
      {activeSubTab === 'wave_inundation' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Settlement Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-red-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Temps d'Arrivée du Front d'Onde</div>
              <div className="text-2xl font-black text-red-400 mt-1">
                {selectedSettlement.waveArrivalTimeMinutes}{' '}
                <span className="text-xs font-normal text-neutral-400">min</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Pic d'inondation à <strong>+{selectedSettlement.peakArrivalTimeMinutes} min</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-blue-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Hauteur d'Eau Maximale (h_max)</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                +{selectedSettlement.maxInundationDepthMeters}{' '}
                <span className="text-xs font-normal text-neutral-400">m</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Au-dessus du niveau moyen du lit mineur
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Vitesse Maximale de Courant (v_max)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {selectedSettlement.maxFlowVelocityMs} <span className="text-xs font-normal text-neutral-400">m/s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Soit <strong>{(selectedSettlement.maxFlowVelocityMs * 3.6).toFixed(1)} km/h</strong> en plaine inondable
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Produit Létal de Danger (h × v)</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {selectedSettlement.lethalHazardProduct} <span className="text-xs font-normal text-neutral-400">m²/s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Seuil létal majeur &gt; 1.5 m²/s (Destruction bâtis)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Settlements Selector (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#2D1618]">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>{locale === 'fr' ? 'Localités & Ouvrages Aval' : 'Downstream Settlements & Works'}</span>
              </h3>

              <div className="space-y-2">
                {DOWNSTREAM_SETTLEMENTS_DATA.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedSettlementId(st.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedSettlementId === st.id
                        ? 'bg-red-950/70 border-red-500 shadow-md shadow-red-950/40'
                        : 'bg-[#150B0C] border-[#2D1618] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">
                        {locale === 'fr' ? st.nameFr : st.nameEn}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          st.hazardClassification === 'EXTREME'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : st.hazardClassification === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                        }`}
                      >
                        {st.distanceKm} km
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Arrivée : <strong>{st.waveArrivalTimeMinutes} min</strong></span>
                      <span>h_max : <strong className="text-cyan-300">+{st.maxInundationDepthMeters} m</strong></span>
                      <span>PAR : <strong className="text-amber-400">{st.populationAtRisk.toLocaleString()} hab</strong></span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Legend of Lethal Thresholds */}
              <div className="p-3 rounded-xl bg-[#140C0E] border border-[#2D1618] space-y-1.5 text-[10px] text-neutral-300">
                <span className="text-red-400 font-bold uppercase block">Classification du Risque Hydrodynamique :</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <span><strong>EXTRÊME (h×v &gt; 10 m²/s)</strong> : Rupture des ponts et maçonneries.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span><strong>ÉLEVÉ (1.5 &lt; h×v &lt; 10 m²/s)</strong> : Emportement immédiat des véhicules et piétons.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                  <span><strong>MODÉRÉ (h×v &lt; 1.5 m²/s)</strong> : Inondation lente des rez-de-chaussée.</span>
                </div>
              </div>
            </div>

            {/* Longitudinal River Wave Profile SVG (8 Cols) */}
            <div className="lg:col-span-8 p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D1618]">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Waves className="h-4 w-4 text-red-500" />
                    <span>{locale === 'fr' ? 'Profil Longitudinal de Propagation de l\'Onde le Long de la Sanaga' : 'Longitudinal Flood Wave Profile along Sanaga River'}</span>
                  </h4>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Modélisation équations d'ondes longues de Saint-Venant 2D (Riemann / Schéma de Roe)
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-800">
                  DISTANCE TOTALE 168 KM
                </span>
              </div>

              {/* Interactive Longitudinal Diagram */}
              <div className="p-4 rounded-xl bg-[#080406] border border-[#2D1618]">
                <svg viewBox="0 0 540 200" className="w-full h-52 select-none">
                  {/* River Bed Slope Baseline */}
                  <path d="M 30,170 L 510,185" stroke="#475569" strokeWidth="2" fill="none" />
                  <text x="30" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">
                    Nachtigal PK 0
                  </text>
                  <text x="460" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">
                    Edéa PK 168
                  </text>

                  {/* Base River Flow */}
                  <path d="M 30,165 L 510,180" stroke="#0284C7" strokeWidth="3" fill="none" />

                  {/* Flood Wave Free Surface (Attenuation along the valley) */}
                  <path
                    d="M 30,50 Q 80,75 140,105 T 260,135 T 380,155 T 510,170 L 510,185 L 30,170 Z"
                    fill="#DC2626"
                    opacity="0.3"
                  />
                  <path
                    d="M 30,50 Q 80,75 140,105 T 260,135 T 380,155 T 510,170"
                    stroke="#EF4444"
                    strokeWidth="3"
                    fill="none"
                  />

                  {/* Dam Breach Icon at PK 0 */}
                  <rect x="25" y="45" width="12" height="125" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="22" y="38" fill="#F87171" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    BARRAGE
                  </text>

                  {/* Downstream Checkpoints along river */}
                  {DOWNSTREAM_SETTLEMENTS_DATA.map((pt, idx) => {
                    // Map distance (0 to 168 km) to SVG x coordinate (30 to 510)
                    const x = 30 + (pt.distanceKm / 168) * 480;
                    // Wave height attenuation
                    const yWater = 50 + (pt.distanceKm / 168) * 120;
                    const isSelected = selectedSettlementId === pt.id;

                    return (
                      <g key={pt.id}>
                        <line
                          x1={x}
                          y1={yWater}
                          x2={x}
                          y2="175"
                          stroke={isSelected ? '#FDE047' : '#DC2626'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          strokeDasharray={isSelected ? 'none' : '2 2'}
                        />
                        <circle
                          cx={x}
                          cy={yWater}
                          r={isSelected ? 6 : 4}
                          fill={isSelected ? '#FDE047' : '#EF4444'}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        <text
                          x={x - 15}
                          y={yWater - 10}
                          fill={isSelected ? '#FDE047' : '#E2E8F0'}
                          fontSize={isSelected ? '9' : '8'}
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fontFamily="monospace"
                        >
                          +{pt.maxInundationDepthMeters}m
                        </text>
                        <text
                          x={x - 20}
                          y="165"
                          fill="#94A3B8"
                          fontSize="7"
                          fontFamily="monospace"
                          transform={`rotate(-45, ${x}, 165)`}
                        >
                          {pt.id.split('_')[0].toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Detailed Critical Infrastructure Impact Panel */}
              <div className="p-4 rounded-xl bg-[#140C0E] border border-[#2D1618] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-red-400">
                    {locale === 'fr' ? 'Diagnostic d\'Impact Critique de la Localité Sélectionnée :' : 'Critical Impact Analysis for Selected Settlement:'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Population à évacuer en urgence : <strong className="text-amber-400">{selectedSettlement.populationAtRisk.toLocaleString()} habitants</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                  <div className="p-2.5 rounded-lg bg-[#1F1012] border border-[#3A181C]">
                    <div className="text-neutral-400 uppercase text-[9px]">Délai d'Alerte Utile</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">
                      {selectedSettlement.waveArrivalTimeMinutes} minutes
                    </div>
                    <div className="text-neutral-500 text-[8px]">Avant submersion des premiers bâtis</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1F1012] border border-[#3A181C]">
                    <div className="text-neutral-400 uppercase text-[9px]">Refuges PPI Identifiés</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">
                      {selectedSettlement.evacuationSafeZonesCount} zones refuges
                    </div>
                    <div className="text-neutral-500 text-[8px]">Collines sécurisées hors d'eau</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1F1012] border border-[#3A181C]">
                    <div className="text-neutral-400 uppercase text-[9px]">Sirènes d'Alerte Actives</div>
                    <div className="text-purple-300 font-bold text-sm mt-0.5">
                      {selectedSettlement.sirensActiveCount} sirènes 130 dB
                    </div>
                    <div className="text-neutral-500 text-[8px]">Télécommande Iridium + VHF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: EMERGENCY ACTION PLAN (PPI), SIRENS 130 dB & EVACUATION  */}
      {/* ==================================================================== */}
      {activeSubTab === 'ppi_sirens' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Siren Arming & Broadcast Console */}
          <div className="p-5 rounded-2xl border border-red-500/50 bg-[#140809] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#351A1C]">
              <div>
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                  <span>{locale === 'fr' ? 'Console de Télécommande du Réseau de Sirènes PPI' : 'PPI Emergency Siren Broadcast Console'}</span>
                </h3>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Conformité Directive SEVESO III / Décret National Protection Civile Cameroun (Liaison Iridium satellite + VHF)
                </p>
              </div>

              {/* Armed Switch & Big Trigger Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSirenArmSwitch(!sirenArmSwitch)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    sirenArmSwitch
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-[#201012] text-neutral-400 border-[#3D1A1E] hover:text-white'
                  }`}
                >
                  {sirenArmSwitch ? 'ARMÉ (PRÊT AU DÉCLENCHEMENT)' : 'DÉSARMÉ (SÉCURISÉ)'}
                </button>

                <button
                  type="button"
                  disabled={!sirenArmSwitch}
                  onClick={() => setActiveAlertTriggered(!activeAlertTriggered)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all ${
                    !sirenArmSwitch
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      : activeAlertTriggered
                      ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/50'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                  }`}
                >
                  <Volume2 className="h-4 w-4" />
                  <span>
                    {activeAlertTriggered
                      ? 'SIGNAL D\'ALERTE EN COURS (STOP)'
                      : 'ÉMETTRE SIGNAL D\'ALERTE SAP (130 dB)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Live Alert Status Message when active */}
            {activeAlertTriggered && (
              <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-white uppercase">
                    ALERTE RUPTURE DE BARRAGE DÉCLENCHÉE SUR L'ENSEMBLE DE LA VALLÉE DE LA SANAGA
                  </div>
                  <p className="text-xs">
                    Signal sonore modulé de 130 dB émis sur les 5 stations (Batchenga, Obala, Monatélé, Ebebda).
                    Message Cell Broadcast envoyé à tous les terminaux mobiles du corridor : <em>« ALERTE INONDATION MAJEURE. Évacuez immédiatement vers les zones refuges d'altitude désignées. Ne traversez pas la Sanaga. »</em>
                  </p>
                </div>
              </div>
            )}

            {/* Siren Stations Telemetry Table */}
            <div className="space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase font-bold flex justify-between">
                <span>Stations Sirènes Télécommandées Déployées (5 Stations - Portée 3.5 à 5.0 km) :</span>
                <span className="text-emerald-400">100% OPÉRATIONNELLES</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-[#1D0E10] text-neutral-400 uppercase">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Code Station</th>
                      <th className="p-2.5">Localisation</th>
                      <th className="p-2.5">PK Sanaga</th>
                      <th className="p-2.5">Puissance</th>
                      <th className="p-2.5">Vecteur Télécom</th>
                      <th className="p-2.5">Autonomie</th>
                      <th className="p-2.5 rounded-r-lg text-right">Statut Télémesure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1618]">
                    {SIREN_STATIONS_DATA.map((s) => (
                      <tr key={s.id} className="hover:bg-[#1A0B0D]">
                        <td className="p-2.5 font-bold text-white">{s.code}</td>
                        <td className="p-2.5 text-neutral-200">{s.locationName}</td>
                        <td className="p-2.5 text-neutral-400">PK {s.distanceKm} km</td>
                        <td className="p-2.5 text-amber-400 font-bold">{s.acousticPowerDb} dB (R={s.coverageRadiusKm} km)</td>
                        <td className="p-2.5 text-cyan-300 font-bold">{s.transmissionMedia.replace('_', ' ')}</td>
                        <td className="p-2.5 text-neutral-300">{s.batteryAutonomyHours} heures</td>
                        <td className="p-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              activeAlertTriggered
                                ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {activeAlertTriggered ? 'ALERTE ACTIVE' : 'VEILLE OK'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Evacuation Corridors & Safe Havens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#2D1618]">
                <Navigation className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Corridors d\'Évacuation Pédestre & Routier' : 'Evacuation Corridors & Paths'}</span>
              </h4>

              <div className="space-y-2">
                {EVACUATION_CORRIDORS_DATA.map((corridor) => (
                  <div key={corridor.corridorId} className="p-3 rounded-xl bg-[#140C0E] border border-[#2D1618] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        {locale === 'fr' ? corridor.nameFr : corridor.nameEn}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                        {corridor.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                      <span>Cote Refuge : <strong className="text-cyan-300">{corridor.safeHavenAltitudeM} m</strong> (PHE + 35m)</span>
                      <span>Capacité : <strong className="text-amber-400">{corridor.capacityPersons.toLocaleString()} pers</strong></span>
                      <span>Délai d'accès : <strong className="text-white">{corridor.travelTimeMinutes} min</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Protocol Summary Card */}
            <div className="p-5 rounded-2xl border border-[#2D1618] bg-[#0A0E14] space-y-3 text-[11px] text-neutral-300">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#2D1618]">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span>{locale === 'fr' ? 'Protocole d\'Organisation des Secours (ORSEC / PPI)' : 'Emergency Response Protocol (ORSEC / PPI)'}</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#150B0D] border border-[#351A1E]">
                  <div className="text-red-400 font-bold uppercase text-[10px] mb-1">
                    Phase 1 : Détection & Déclenchement Automatique (0 - 5 min)
                  </div>
                  <p>
                    Les capteurs piézométriques à corde vibrante et caméras IA thermiques de crête détectent la submersion ou l'affaissement. Le SCADA Nachtigal transmet instantanément l'événement aux préfectures de la Haute-Sanaga et du Mbam-et-Kim.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#150B0D] border border-[#351A1E]">
                  <div className="text-amber-400 font-bold uppercase text-[10px] mb-1">
                    Phase 2 : Diffusion du Signal d'Alerte aux Populations (5 - 15 min)
                  </div>
                  <p>
                    Activation des 5 sirènes 130 dB diffusant le signal sonore normalisé (3 cycles de 1 minute 41 secondes séparés par 5 secondes de silence) couplé à la diffusion Cell Broadcast sur les relais 4G de MTN, Orange et Camtel.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#150B0D] border border-[#351A1E]">
                  <div className="text-emerald-400 font-bold uppercase text-[10px] mb-1">
                    Phase 3 : Évacuation vers les Zones Refuges (15 - 45 min)
                  </div>
                  <p>
                    Guidage des riverains le long des 4 corridors prioritaires balisés vers les plateaux de hauteur géodésique supérieure à 440 m, à l'abri complet de l'onde de submersion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
