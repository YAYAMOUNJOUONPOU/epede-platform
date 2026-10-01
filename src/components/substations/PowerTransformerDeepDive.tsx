// src/components/substations/PowerTransformerDeepDive.tsx
// EPEDE D04 - Power Transformer & On-Load Tap Changer (OLTC) Deep Dive

import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Sliders,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  Cpu,
  RotateCcw,
  Layers,
  Thermometer,
  Gauge,
  FileText
} from 'lucide-react';
import { OltcAvrParallelTransformersSimulator } from './modules/OltcAvrParallelTransformersSimulator';
import { SurgeArresterInsulationCoordinationSimulator } from './modules/SurgeArresterInsulationCoordinationSimulator';

interface PowerTransformerDeepDiveProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
}

export const PowerTransformerDeepDive: React.FC<PowerTransformerDeepDiveProps> = ({
  locale,
  onSelectEquipment
}) => {
  // Tab Navigation: Transformer Anatomy vs OLTC & Parallel AVR Engine vs Surge Arresters
  const [activeSubTab, setActiveSubTab] = useState<'ANATOMY_DIAGNOSTICS' | 'OLTC_PARALLEL_AVR' | 'SURGE_ARRESTERS_BIL'>('ANATOMY_DIAGNOSTICS');

  // Interactive OLTC Tap Position (-8 to +8, default 0)
  const [tapPosition, setTapPosition] = useState<number>(0);
  // Cooling Mode
  const [coolingMode, setCoolingMode] = useState<'ONAN' | 'ONAF' | 'OFAF'>('ONAF');
  // Load Ratio (0% to 120%)
  const [loadRatio, setLoadRatio] = useState<number>(75);

  // Electrical computations
  const nominalHV = 225.0; // kV
  const stepPerTap = 1.25; // % per tap
  const tapVoltageHV = nominalHV * (1 + (tapPosition * stepPerTap) / 100);
  const nominalMV = 90.0; // kV
  const actualSecondaryVoltage = (nominalHV / tapVoltageHV) * nominalMV;

  // Thermal computations
  const ambientTemp = 32.0; // °C (Cameroon tropical baseline)
  const oilRiseNominal = coolingMode === 'ONAN' ? 45 : coolingMode === 'ONAF' ? 38 : 32;
  const oilTemp = ambientTemp + oilRiseNominal * Math.pow(loadRatio / 100, 1.6);
  const hotSpotTemp = oilTemp + (coolingMode === 'ONAN' ? 22 : 16) * Math.pow(loadRatio / 100, 1.8);
  const relativeAgingRate = Math.pow(2, (hotSpotTemp - 98) / 6); // IEEE / IEC Arrhenius insulation aging

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Header with Transformer Specifications */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {locale === 'fr'
                  ? 'Transformateur de Puissance & Régleur en Charge (OLTC)'
                  : 'Power Transformer & On-Load Tap Changer (OLTC)'}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans font-normal">
                {locale === 'fr'
                  ? 'Autopsie technique : circuit magnétique, traversées RIP, refroidissement, régulation de tension et protection différentielle 87T.'
                  : 'Electromagnetic core, RIP bushings, thermal cooling loops, live OLTC regulation, and 87T differential protection.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
              100 MVA · 225/90/15 kV · YNyd11
            </span>
            {onSelectEquipment && (
              <button
                type="button"
                onClick={() => onSelectEquipment('eq-autotrafo-225-90')}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 transition-colors shadow-sm"
                title={locale === 'fr' ? 'Consulter le Dossier d\'Ingénierie Standard 30 Sections' : 'Open 30-Section Engineering Dossier'}
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Fiche 30 Sections (CEI 60076)' : '30-Section Dossier (IEC 60076)'}</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          
          {/* OLTC Tap Selector */}
          <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold">
                {locale === 'fr' ? 'Position Plot OLTC :' : 'OLTC Tap Position:'}
              </span>
              <span className="text-amber-400 font-bold">
                {locale === 'fr' ? 'Plot' : 'Tap'} {tapPosition >= 0 ? `+${tapPosition}` : tapPosition} ({tapPosition * stepPerTap > 0 ? `+${(tapPosition * stepPerTap).toFixed(2)}` : (tapPosition * stepPerTap).toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTapPosition((p) => Math.max(-8, p - 1))}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                {locale === 'fr' ? '-1 Plot' : '-1 Tap'}
              </button>
              <input
                type="range"
                min="-8"
                max="8"
                step="1"
                value={tapPosition}
                onChange={(e) => setTapPosition(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setTapPosition((p) => Math.min(8, p + 1))}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                {locale === 'fr' ? '+1 Plot' : '+1 Tap'}
              </button>
            </div>
          </div>

          {/* Cooling Mode Selector */}
          <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2">
            <span className="text-[11px] text-slate-400 font-bold block">
              {locale === 'fr' ? 'Mode de Refroidissement :' : 'Cooling Mode (IEC 60076):'}
            </span>
            <div className="flex items-center gap-1.5">
              {(['ONAN', 'ONAF', 'OFAF'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCoolingMode(mode)}
                  className={`flex-1 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    coolingMode === mode
                      ? 'bg-sky-500 text-slate-950 border-sky-400'
                      : 'bg-[#070A10] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Load Ratio Slider */}
          <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold">
                {locale === 'fr' ? 'Charge Apparente (MVA) :' : 'Apparent Load Loading:'}
              </span>
              <span className="text-emerald-400 font-bold">
                {loadRatio}% ({(loadRatio * 1.0).toFixed(1)} MVA)
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={loadRatio}
              onChange={(e) => setLoadRatio(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

        </div>

        {/* Sub-Tab Navigation Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#1E2634]">
          <button
            type="button"
            onClick={() => setActiveSubTab('ANATOMY_DIAGNOSTICS')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'ANATOMY_DIAGNOSTICS'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '1. Autopsie & Diagnostic DGA (IEC 60599)' : '1. Transformer Anatomy & DGA'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('OLTC_PARALLEL_AVR')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'OLTC_PARALLEL_AVR'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '2. Régulateur AVR (ANSI 90) & Parallélisme OLTC' : '2. Parallel AVR (ANSI 90) & OLTC'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('SURGE_ARRESTERS_BIL')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'SURGE_ARRESTERS_BIL'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '3. Parafoudres ZnO & BIL (CEI 60071 / 60099)' : '3. ZnO Surge Arresters & BIL (IEC 60071)'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TRANSFORMER ANATOMY & DGA DIAGNOSTICS */}
      {activeSubTab === 'ANATOMY_DIAGNOSTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Cols: Exploded Mechanical & Dielectric Diagram */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'Anatomie Électromécanique du Transformateur' : 'Transformer Mechanical & Electrical Anatomy'}</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Surveillance En Ligne
            </span>
          </div>

          {/* Interactive ASCII Substation Transformer Diagram */}
          <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2634] font-mono text-xs overflow-x-auto shadow-inner text-slate-300">
            <pre className="text-[11px] leading-relaxed select-all whitespace-pre text-amber-200">
{`          [ Traversées HT 225 kV (RIP) ]     [ Traversées MT 90 kV ]
                     │                                   │
    ┌────────────────┴───────────────────────────────────┴────────────────┐
    │  CONSERVATEUR D'HUILE ◄── Relais Buchholz ◄── Cuve Principale       │
    │  (Dessiccateur Silicagel)                                            │
    ├─────────────────────────────────────────────────────────────────────┤
    │                      CUVE EN ACIER BLINDÉ                           │
    │                                                                     │
    │   ┌───────────────┐   ┌────────────────────────┐   ┌────────────┐   │
    │   │  Enroulement  │   │   Circuit Magnétique   │   │ Enroulement│   │
    │   │  Primaire HT  │   │  Tôles Silicium M4     │   │ Secondaire │   │
    │   │  225 kV (YN)  │   │  à Grains Orientés     │   │ 90 kV (yn) │   │
    │   └───────┬───────┘   └────────────────────────┘   └──────┬─────┘   │
    │           │                                               │         │
    │           └───► [ Régleur en Charge (OLTC 17 plots) ] ────┘         │
    │                                                                     │
    │   AÉRORÉFRIGÉRANTS À HUILE (Mode Actif : ${coolingMode.padEnd(4)})                     │
    │   [||||||||||||||||||] Radiateurs + Motoventilateurs                │
    └─────────────────────────────────────────────────────────────────────┘
         │                                                      │
    [ Soupape PRD ]                                     [ Fosse Incendie ]`}
            </pre>
          </div>

          {/* Core Internal Subsystems Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
              <span className="text-amber-400 font-bold text-[11px] block">
                {locale === 'fr' ? '1. Circuit Magnétique & Enroulements' : '1. Magnetic Core & Windings'}
              </span>
              <p className="text-[11px] text-slate-300 font-sans font-normal leading-snug">
                {locale === 'fr'
                  ? "Noyau à 3 colonnes en tôles d'acier au silicium laminées à froid à grains orientés (Hi-B). Enroulements concentriques en cuivre électrolytique isolés au papier crêpé et huile minérale naphténique."
                  : '3-limb core manufactured from high-permeability cold-rolled grain-oriented silicon steel (Hi-B). Concentric copper windings insulated with thermally upgraded kraft paper and mineral oil.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
              <span className="text-sky-400 font-bold text-[11px] block">
                {locale === 'fr' ? '2. Traversées Condensateur (RIP)' : '2. Condenser Bushings (RIP)'}
              </span>
              <p className="text-[11px] text-slate-300 font-sans font-normal leading-snug">
                {locale === 'fr'
                  ? 'Traversées sèches en papier imprégné de résine (Resin Impregnated Paper) avec jupes silicones hydrophobes. Prise de test capacitive intégrée pour mesure continue de tg δ (facteur de dissipation).'
                  : 'Resin Impregnated Paper (RIP) dry-type condenser bushings with hydrophobic silicone sheds. Integrated capacitive test tap for online tan delta (dissipation factor) diagnostic monitoring.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
              <span className="text-emerald-400 font-bold text-[11px] block">
                {locale === 'fr' ? '3. Régleur en Charge (OLTC)' : '3. On-Load Tap Changer (OLTC)'}
              </span>
              <p className="text-[11px] text-slate-300 font-sans font-normal leading-snug">
                {locale === 'fr'
                  ? "Commutateur à coupure sous vide (Vacuum Interrupter) séparé de l'huile de cuve. Permet de changer de prise sous pleine charge sans aucune micro-coupure réseau (résistances de transition)."
                  : 'Vacuum interrupter tap selector housed in a separate diverter compartment. Enables seamless on-load voltage ratio adjustment without network interruption using transition resistors.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
              <span className="text-rose-400 font-bold text-[11px] block">
                {locale === 'fr' ? '4. Organes de Sécurité Cuve' : '4. Tank Safety & Protection Auxiliaries'}
              </span>
              <p className="text-[11px] text-slate-300 font-sans font-normal leading-snug">
                {locale === 'fr'
                  ? "Relais Buchholz double flotteur (alarme gaz / déclenchement coup d'huile rapide > 1 m/s), clapet de surpression mécanique PRD avec drapeau d'actionnement et dessiccateur silicagel déshydratant."
                  : 'Dual-float Buchholz relay (gas accumulation alarm and rapid oil surge trip >1.0 m/s), spring-loaded pressure relief device (PRD) with visual flag, and silica gel dehydrating breather.'}
              </p>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Live Calculated OLTC & Thermal State */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-3">
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Dynamique OLTC & Bilan Thermique' : 'OLTC Dynamics & Thermal Model'}</span>
          </h4>

          {/* Real-time Voltages based on Tap */}
          <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              {locale === 'fr' ? 'Régulation de Tension en Direct :' : 'Real-time Voltage Regulation:'}
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {locale === 'fr' ? 'Tension Primaire Assignée :' : 'Rated Primary Voltage:'}
                </span>
                <span className="text-white font-bold">{tapVoltageHV.toFixed(2)} kV</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {locale === 'fr' ? 'Tension Secondaire Délivrée :' : 'Secondary Output Voltage:'}
                </span>
                <span className="text-emerald-400 font-bold text-sm">{actualSecondaryVoltage.toFixed(2)} kV</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                <span className="text-slate-500">
                  {locale === 'fr' ? 'Écart vs 90 kV Consigne :' : 'Deviation vs 90 kV Setpoint:'}
                </span>
                <span className={`font-bold ${
                  Math.abs(actualSecondaryVoltage - 90) < 1.0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {(actualSecondaryVoltage - 90.0).toFixed(2)} kV ({(((actualSecondaryVoltage - 90) / 90) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Thermal Model & Arrhenius Aging Rate */}
          <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                {locale === 'fr' ? 'Bilan Thermique (IEC 60076-7) :' : 'Thermal Loading Model (IEC 60076-7):'}
              </span>
              <Thermometer className="h-3.5 w-3.5 text-rose-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">
                    {locale === 'fr' ? 'Température Huile Cuve (OTI) :' : 'Top-Oil Temperature (OTI):'}
                  </span>
                  <span className="text-amber-300 font-bold">{oilTemp.toFixed(1)} °C</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${oilTemp > 85 ? 'bg-red-500' : oilTemp > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, (oilTemp / 110) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">
                    {locale === 'fr' ? 'Point Chaud Enroulement (WTI) :' : 'Winding Hot-Spot (WTI):'}
                  </span>
                  <span className="text-rose-400 font-bold text-sm">{hotSpotTemp.toFixed(1)} °C</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${hotSpotTemp > 105 ? 'bg-red-500 animate-pulse' : hotSpotTemp > 90 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, (hotSpotTemp / 140) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  {locale === 'fr' ? 'Vieillissement Relatif Isolant :' : 'Relative Insulation Aging Rate:'}
                </span>
                <span className={`font-bold px-1.5 py-0.5 rounded ${
                  relativeAgingRate > 2.0
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {relativeAgingRate.toFixed(2)}x {locale === 'fr' ? 'normal' : 'baseline'}
                </span>
              </div>
            </div>
          </div>

          {/* Differential Protection 87T Restraint Summary */}
          <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs space-y-1.5">
            <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              {locale === 'fr' ? 'Retenue Harmonique Différentielle 87T :' : '87T Differential Harmonic Restraint:'}
            </span>
            <p className="text-[11px] text-slate-300 font-sans font-normal leading-relaxed">
              {locale === 'fr'
                ? "Le relais différentiel bloque le déclenchement intempestif lors de l'enclenchement grâce au taux d'harmonique 2 (If2/If1 > 15%) généré par l'inrush magnétisant, et stabilise la saturation par le taux d'harmonique 5 (surtension)."
                : 'The transformer differential relay prevents spurious tripping during energization via 2nd harmonic restraint (If2/If1 > 15%) from magnetizing inrush, while 5th harmonic restraint prevents tripping during over-excitation.'}
            </p>
          </div>

          {/* DGA Dissolved Gas Analysis IEC 60599 / Duval Triangle */}
          <div className="p-3.5 rounded-xl bg-[#070A10] border border-sky-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {locale === 'fr'
                  ? 'Chromatographie des Gaz Dissous (DGA - IEC 60599) :'
                  : 'Dissolved Gas Analysis (DGA - IEC 60599):'}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {locale === 'fr' ? 'Sain (Normale)' : 'Normal Condition'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <div className="p-1.5 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">
                  {locale === 'fr' ? 'H₂ (Hydrogène) :' : 'H₂ (Hydrogen):'}
                </span>
                <span className="text-white font-bold">12 ppm</span>
                <span className="text-[8px] text-slate-500 block">&lt; 100 ppm</span>
              </div>
              <div className="p-1.5 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">
                  {locale === 'fr' ? 'CH₄ (Méthane) :' : 'CH₄ (Methane):'}
                </span>
                <span className="text-white font-bold">8 ppm</span>
                <span className="text-[8px] text-slate-500 block">&lt; 120 ppm</span>
              </div>
              <div className="p-1.5 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">
                  {locale === 'fr' ? 'C₂H₂ (Acétylène) :' : 'C₂H₂ (Acetylene):'}
                </span>
                <span className="text-emerald-400 font-bold">0.1 ppm</span>
                <span className="text-[8px] text-slate-500 block">&lt; 2 ppm (Arc)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              {locale === 'fr' ? (
                <>
                  Diagnostic Triangle de Duval : <span className="text-white font-mono font-bold">Zone PD (Décharges partielles minimes, aucun défaut thermique T1/T2/T3 détecté)</span>.
                </>
              ) : (
                <>
                  Duval Triangle Diagnosis: <span className="text-white font-mono font-bold">PD Zone (Benign partial discharge, zero thermal faults T1/T2/T3 detected)</span>.
                </>
              )}
            </div>
          </div>

        </div>

      </div>
      )}

      {/* SUB-TAB 2: OLTC AVR & PARALLEL TRANSFORMERS SIMULATOR */}
      {activeSubTab === 'OLTC_PARALLEL_AVR' && (
        <OltcAvrParallelTransformersSimulator locale={locale} />
      )}

      {/* SUB-TAB 3: HIGH-VOLTAGE SURGE ARRESTERS & BIL INSULATION COORDINATION */}
      {activeSubTab === 'SURGE_ARRESTERS_BIL' && (
        <SurgeArresterInsulationCoordinationSimulator locale={locale} />
      )}

    </div>
  );
};
