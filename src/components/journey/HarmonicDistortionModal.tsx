// src/components/journey/HarmonicDistortionModal.tsx
// EPEDE - Interactive Harmonics & Power Quality Distortion Lab (IEEE 519 / IEC 61000-3-2)
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Copy, 
  Check, 
  Info,
  Flame,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react';
import { StageId } from './types';

interface HarmonicDistortionModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment?: (equipmentId: string) => void;
}

type LoadPresetType = 'incandescent' | 'cheap_led' | 'pfc_led' | 'vfd_drive' | 'ev_charger';

interface HarmonicPreset {
  id: LoadPresetType;
  name: { fr: string; en: string };
  desc: { fr: string; en: string };
  p_watts: number;
  pf: number;
  spectrum: { h: number; pct: number }[]; // harmonic number h and percentage of fundamental
  standardNotice: string;
}

const LOAD_PRESETS: Record<LoadPresetType, HarmonicPreset> = {
  incandescent: {
    id: 'incandescent',
    name: { fr: 'Ampoule à Incandescence (Tungstène)', en: 'Incandescent Filament Bulb' },
    desc: { 
      fr: 'Charge purement résistive linéaire. Le courant est en phase parfaite avec la tension sinusoïdale.', 
      en: 'Purely resistive linear load. Current is in perfect phase with sinusoidal voltage.' 
    },
    p_watts: 60,
    pf: 1.0,
    spectrum: [
      { h: 1, pct: 100 },
      { h: 3, pct: 0.8 },
      { h: 5, pct: 0.3 },
      { h: 7, pct: 0.1 },
      { h: 9, pct: 0.0 },
      { h: 11, pct: 0.0 },
    ],
    standardNotice: 'CEI 61000-3-2 Classe A (Conforme sans restriction)',
  },
  cheap_led: {
    id: 'cheap_led',
    name: { fr: 'Ampoule LED Bas de Gamme (Alim Capacitive / Pont)', en: 'Budget LED Bulb (Capacitive Dropper / Diode Bridge)' },
    desc: { 
      fr: 'Pont redresseur non filtré sans PFC. Le condensateur ne tire du courant qu\'au sommet de l\'onde, générant une impulsion très déformée riche en harmonique 3.', 
      en: 'Unfiltered diode bridge without PFC. Input capacitor charges in narrow peak pulses, injecting severe 3rd & 5th harmonic currents.' 
    },
    p_watts: 10,
    pf: 0.55,
    spectrum: [
      { h: 1, pct: 100 },
      { h: 3, pct: 68.5 },
      { h: 5, pct: 45.2 },
      { h: 7, pct: 28.1 },
      { h: 9, pct: 16.4 },
      { h: 11, pct: 9.8 },
    ],
    standardNotice: 'Dépassement critique CEI 61000-3-2 Classe C (Non-conforme si P > 25W)',
  },
  pfc_led: {
    id: 'pfc_led',
    name: { fr: 'Luminaire LED Premium avec PFC Actif', en: 'Premium Architectural LED (Active PFC Driver)' },
    desc: { 
      fr: 'Convertisseur abaisseur avec découpage haute fréquence asservi pour forcer le courant à suivre la sinusoïde de tension.', 
      en: 'Active Power Factor Correction buck-boost stage forcing input current to follow voltage waveform.' 
    },
    p_watts: 45,
    pf: 0.98,
    spectrum: [
      { h: 1, pct: 100 },
      { h: 3, pct: 6.2 },
      { h: 5, pct: 4.1 },
      { h: 7, pct: 2.8 },
      { h: 9, pct: 1.2 },
      { h: 11, pct: 0.6 },
    ],
    standardNotice: 'CEI 61000-3-2 Classe C & Energy Star (Excellente conformité)',
  },
  vfd_drive: {
    id: 'vfd_drive',
    name: { fr: 'Variateur de Fréquence Triphasé 6 Impulsions (VFD Pompes)', en: 'Three-Phase 6-Pulse Variable Frequency Drive (VFD)' },
    desc: { 
      fr: 'Redresseur triphasé à diodes non contrôlées (pompes du barrage). Les harmoniques pairs et multiples de 3 s\'annulent, dominé par h=5 (250Hz) et h=7 (350Hz).', 
      en: 'Three-phase uncontrolled diode bridge. Triplen harmonics cancel; dominated by 5th (250Hz) and 7th (350Hz) components.' 
    },
    p_watts: 15000,
    pf: 0.88,
    spectrum: [
      { h: 1, pct: 100 },
      { h: 3, pct: 1.2 },
      { h: 5, pct: 26.4 },
      { h: 7, pct: 14.8 },
      { h: 9, pct: 0.8 },
      { h: 11, pct: 7.2 },
    ],
    standardNotice: 'IEEE Std 519-2022 Limite Isc/IL (Nécessite bobine d\'inductance de ligne 3%)',
  },
  ev_charger: {
    id: 'ev_charger',
    name: { fr: 'Borne de Recharge Véhicule Électrique (EVSE 7.4 kW)', en: 'Electric Vehicle Fast Charger (7.4 kW EVSE)' },
    desc: { 
      fr: 'Chargeur embarqué à découpage synchrone. Injection de faibles harmoniques réparties et résonance HF atténuée.', 
      en: 'High-power active onboard bidirectional rectifier with integrated EMI & harmonic filtering.' 
    },
    p_watts: 7400,
    pf: 0.96,
    spectrum: [
      { h: 1, pct: 100 },
      { h: 3, pct: 11.2 },
      { h: 5, pct: 7.4 },
      { h: 7, pct: 4.5 },
      { h: 9, pct: 2.3 },
      { h: 11, pct: 1.5 },
    ],
    standardNotice: 'CEI 61000-3-12 (Courants d\'entrée entre 16A et 75A)',
  },
};

export const HarmonicDistortionModal: React.FC<HarmonicDistortionModalProps> = ({
  locale,
  isOpen,
  onClose,
  onSelectEquipment,
}) => {
  const [selectedLoadId, setSelectedLoadId] = useState<LoadPresetType>('cheap_led');
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activePreset = LOAD_PRESETS[selectedLoadId];

  // Calculate THD_I based on harmonic spectrum
  const { effectiveSpectrum, thdI, thdV, neutralCurrentFactor, isIeeeCompliant } = useMemo(() => {
    // If Active Harmonic Filter is on, all harmonics h >= 3 are suppressed by ~85%
    const filterReduction = isFilterActive ? 0.12 : 1.0;

    const spectrum = activePreset.spectrum.map((item) => ({
      h: item.h,
      pct: item.h === 1 ? 100 : Number((item.pct * filterReduction).toFixed(1)),
    }));

    // THD_I = sqrt(sum(I_h^2)) / I_1
    const sumSquares = spectrum
      .filter((s) => s.h > 1)
      .reduce((acc, s) => acc + Math.pow(s.pct, 2), 0);
    const thd = Math.sqrt(sumSquares);

    // THD_V is caused by harmonic currents flowing through grid supply impedance Z_grid
    // THD_V ≈ THD_I * (Z_grid / Z_base) ≈ THD_I * 0.05
    const thdVolts = Number((thd * 0.045).toFixed(2));

    // Neutral current multiplier for triplen harmonics: In ≈ 3 * sqrt(I3^2 + I9^2 + I15^2)
    const i3 = (spectrum.find((s) => s.h === 3)?.pct || 0) / 100;
    const i9 = (spectrum.find((s) => s.h === 9)?.pct || 0) / 100;
    const neutralFactor = Number((Math.sqrt(3 * (i3 * i3 + i9 * i9)) * 100).toFixed(1));

    const compliant = thd < 15.0 && thdVolts < 5.0;

    return {
      effectiveSpectrum: spectrum,
      thdI: Number(thd.toFixed(1)),
      thdV: thdVolts,
      neutralCurrentFactor: neutralFactor,
      isIeeeCompliant: compliant,
    };
  }, [activePreset, isFilterActive]);

  if (!isOpen) return null;

  // Generate SVG path for synthesized distorted current waveform i(t)
  const generateWaveformPath = (width: number, height: number) => {
    const points: string[] = [];
    const samples = 120;
    const centerY = height / 2;
    const amp = height * 0.38;

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * (2 * Math.PI); // 1 full cycle
      let val = Math.sin(t); // fundamental h=1

      // Add harmonics
      effectiveSpectrum.forEach((hItem) => {
        if (hItem.h > 1) {
          const ratio = hItem.pct / 100;
          // Phase shifts: 3rd in phase with peak, 5th inverted, 7th in phase
          const phase = hItem.h === 3 ? 0 : hItem.h === 5 ? Math.PI : 0;
          val += ratio * Math.sin(hItem.h * t + phase);
        }
      });

      // Normalize scale
      const y = centerY - (val / 1.8) * amp;
      const x = (i / samples) * width;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const handleCopyReport = () => {
    const text = `=== EPEDE : RAPPORT DE QUALITÉ DE L'ONDE & HARMONIQUES ===
Norme de référence : IEEE Std 519-2022 / CEI 61000-3-2
Charge sélectionnée : ${activePreset.name[locale]} (${activePreset.p_watts} W)
Facteur de puissance (cos φ) : ${activePreset.pf}
Filtre Actif d'Harmoniques (AHF) : ${isFilterActive ? 'ACTIF (Atténuation 88%)' : 'DÉSACTIVÉ'}
THD en Courant (THD_I) : ${thdI}%
THD en Tension (THD_V) : ${thdV}% (Limite IEEE 519 : 5.0%)
Surcharge Courant de Neutre (In) : ${neutralCurrentFactor}% du courant de phase
Spectre Harmonique :
${effectiveSpectrum.map((s) => ` - Harmonique ${s.h} (${s.h * 50} Hz) : ${s.pct}%`).join('\n')}
Conformité IEEE 519 : ${isIeeeCompliant ? 'CONFORME' : 'NON-CONFORME (Risque de résonance & échauffement)'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black font-mono text-slate-900 tracking-wide">
                  {locale === 'fr' 
                    ? 'LABORATOIRE HARMONIQUES & QUALITÉ DE L\'ONDE' 
                    : 'HARMONICS & POWER QUALITY DISTORTION LAB'}
                </h3>
                <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold">
                  IEEE 519 / CEI 61000
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Déformation de la sinusoïde du barrage (15 kV) à l\'ampoule LED (230 V)' 
                  : 'Sinusoidal distortion analysis from hydro generator (15 kV) to domestic LED lamp'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Rapport' : 'Copy Report')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Preset Selector */}
          <div className="space-y-2">
            <span className="text-slate-700 font-bold block text-xs">
              {locale === 'fr' 
                ? '1. CHOIX DE LA CHARGE DOMESTIQUE / INDUSTRIELLE (INJECTION D\'HARMONIQUES) :' 
                : '1. SELECT DOMESTIC / INDUSTRIAL LOAD (HARMONIC INJECTION) :'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {(Object.keys(LOAD_PRESETS) as LoadPresetType[]).map((loadKey) => {
                const item = LOAD_PRESETS[loadKey];
                const isSelected = selectedLoadId === loadKey;
                return (
                  <button
                    key={loadKey}
                    type="button"
                    onClick={() => setSelectedLoadId(loadKey)}
                    className={`p-3 rounded-xl text-left transition-all border shadow-2xs ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">
                      {item.name[locale]}
                    </div>
                    <div className="text-[10px] text-cyan-700 mt-1 font-sans font-medium">
                      {item.p_watts} W · cos φ = {item.pf}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preset Technical Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {locale === 'fr' ? 'MÉCANISME PHYSIQUE DE DÉFORMATION :' : 'PHYSICAL DISTORTION MECHANISM :'}
              </span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {activePreset.desc[locale]}
              </p>
              <span className="text-[10px] text-cyan-700 block pt-1 font-medium">
                Norme : {activePreset.standardNotice}
              </span>
            </div>

            {/* Active Harmonic Filter (AHF) Toggle */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterActive(!isFilterActive)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                  isFilterActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {isFilterActive 
                    ? (locale === 'fr' ? 'FILTRE ACTIF (AHF) ENGAGÉ' : 'ACTIVE FILTER (AHF) ON')
                    : (locale === 'fr' ? 'ENGAGER FILTRE ACTIF (AHF)' : 'ENGAGE ACTIVE FILTER (AHF)')}
                </span>
              </button>
              <span className="text-[10px] text-slate-500">
                {isFilterActive 
                  ? (locale === 'fr' ? 'Atténuation 88% des rangs h≥3' : '88% harmonic attenuation active') 
                  : (locale === 'fr' ? 'Aucune compensation en ligne' : 'No compensation on grid')}
              </span>
            </div>
          </div>

          {/* Telemetry Dashboard Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-medium">THD COURANT (THD_I)</span>
              <span className={`text-lg font-black ${
                thdI > 30 ? 'text-rose-600' : thdI > 15 ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {thdI}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                {thdI > 30 ? 'Sévère (> 30%)' : thdI > 15 ? 'Modéré' : 'Quasi Sinusoïdal'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-medium">THD TENSION (THD_V)</span>
              <span className={`text-lg font-black ${
                thdV > 5.0 ? 'text-rose-600' : 'text-cyan-700'
              }`}>
                {thdV}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                Limite IEEE 519 : 5.0%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-medium">SURCHARGE NEUTRE (I_N)</span>
              <span className={`text-lg font-black ${
                neutralCurrentFactor > 80 ? 'text-rose-600' : neutralCurrentFactor > 33 ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {neutralCurrentFactor}%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                Harmoniques triples (h=3, 9)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-medium">CONFORMITÉ IEEE 519</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {isIeeeCompliant ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">CONFORME</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-600">DÉPASSEMENT</span>
                  </>
                )}
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                PCC Réseau 230V / 30kV
              </span>
            </div>
          </div>

          {/* Visual Dual Displays: Live Oscilloscope Waveform & FFT Spectrum Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Oscilloscope View */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-800 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-600" />
                  <span>{locale === 'fr' ? 'FORME D\'ONDE RECONSTITUÉE i(t)' : 'SYNTHESIZED WAVEFORM i(t)'}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1 Cycle = 20 ms (50 Hz)</span>
              </div>

              {/* SVG Waveform Canvas */}
              <div className="relative h-44 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shadow-2xs">
                {/* Horizontal Center Axis */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
                {/* Grid guidelines */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-40">
                  <div className="border-r border-b border-slate-200" />
                  <div className="border-r border-b border-slate-200" />
                  <div className="border-r border-b border-slate-200" />
                  <div className="border-b border-slate-200" />
                </div>

                <svg viewBox="0 0 400 160" className="w-full h-full">
                  {/* Fundamental reference (dotted blue) */}
                  <path
                    d="M 0 80 Q 100 15 200 80 T 400 80"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                  {/* Synthesized distorted wave */}
                  <path
                    d={generateWaveformPath(400, 160)}
                    fill="none"
                    stroke={thdI > 30 ? '#E11D48' : thdI > 15 ? '#D97706' : '#059669'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Legend badges */}
                <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[10px] bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  <span className="text-sky-700 font-medium">--- Sinusoïde Fondamentale (50Hz)</span>
                  <span className={`font-bold ${thdI > 30 ? 'text-rose-600' : thdI > 15 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    — Courant Réel i(t)
                  </span>
                </div>
              </div>
            </div>

            {/* FFT Harmonic Spectrum Bar Chart */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                  <span>{locale === 'fr' ? 'SPECTRE FFT DES HARMONIQUES' : 'FFT HARMONIC SPECTRUM'}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Ordre h (%)</span>
              </div>

              {/* Harmonic Bars */}
              <div className="h-44 bg-white rounded-lg border border-slate-200 p-3 flex items-end justify-around gap-2 shadow-2xs">
                {effectiveSpectrum.map((item) => {
                  const barHeight = Math.min(100, Math.max(4, item.pct));
                  const isTriplen = item.h === 3 || item.h === 9 || item.h === 15;
                  return (
                    <div key={item.h} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] font-bold text-slate-600">
                        {item.pct}%
                      </span>
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          item.h === 1
                            ? 'bg-cyan-500'
                            : isTriplen
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className={`text-[10px] font-bold ${
                        isTriplen ? 'text-rose-700' : 'text-slate-700'
                      }`}>
                        h={item.h}
                      </span>
                      <span className="text-[8px] text-slate-500">
                        {item.h * 50}Hz
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Triplen Neutral Warning & Engineering Explanation */}
          {neutralCurrentFactor > 33 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
              <Flame className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-rose-700">
                  {locale === 'fr' 
                    ? 'ALERTE SURCHAUFFE DU CONDUCTEUR DE NEUTRE (HARMONIQUES TRIPLES) : ' 
                    : 'TRI-HARMONIC NEUTRAL CONDUCTOR OVERHEATING WARNING : '}
                </span>
                {locale === 'fr'
                  ? 'Les harmoniques d\'ordre 3 (150 Hz) et multiples sont homopolaires (en phase sur les 3 conducteurs). Au lieu de s\'annuler au neutre, elles s\'additionnent arithmétiquement : I_neutre = 3 × I_3. En présence de nombreuses alimentations à découpage (LED/PC), le neutre peut transporter plus de 130% du courant de phase, provoquant un risque d\'incendie. Selon la NF C 15-100 et la CEI 60364, la section du neutre doit être doublée (200% de la phase) ou un transformateur à couplage Dyn11 / filtre actif doit piéger ces composantes.'
                  : '3rd order harmonics (150 Hz) and odd multiples are zero-sequence (in-phase on all 3 lines). Instead of canceling in the neutral, they sum arithmetically: I_neutral = 3 × I_3. In buildings with dense LED drivers and PC switch-mode supplies, the neutral conductor can carry over 130% of rated phase current, causing severe fire hazards. Under IEC 60364 & NF C 15-100, neutral cross-sections must be upsized (200% of phase) or a Dyn11 transformer / active filter deployed.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
