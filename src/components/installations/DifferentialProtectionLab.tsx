// src/components/installations/DifferentialProtectionLab.tsx
// EPEDE D06 - Interactive Differential Protection (RCD / RCBO) Physics & Coordination Laboratory
// Demonstrates toroid core magnetic flux balance, residual current leakage detection, trip curves, and Type AC/A/F/B differentiation.

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Scale,
  Sparkles,
  Info,
  Flame,
  Radio
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type RcdType = 'TYPE_AC' | 'TYPE_A' | 'TYPE_F' | 'TYPE_B';
export type RcdSensitivity = 10 | 30 | 100 | 300 | 500;

interface DifferentialProtectionLabProps {
  locale: 'fr' | 'en';
  className?: string;
}

export const DifferentialProtectionLab: React.FC<DifferentialProtectionLabProps> = ({
  locale,
  className = ''
}) => {
  const [rcdType, setRcdType] = useState<RcdType>('TYPE_A');
  const [sensitivityMa, setSensitivityMa] = useState<RcdSensitivity>(30);
  const [isSelectiveS, setIsSelectiveS] = useState<boolean>(false);
  const [leakageCurrentMa, setLeakageCurrentMa] = useState<number>(0);
  const [isTestButtonPressed, setIsTestButtonPressed] = useState<boolean>(false);
  const [isBreakerTripped, setIsBreakerTripped] = useState<boolean>(false);
  const [tripTimeMs, setTripTimeMs] = useState<number | null>(null);

  // Calculate Toroid Flux Balance and Trip State
  const effectiveLeakageMa = isTestButtonPressed ? sensitivityMa * 1.5 : leakageCurrentMa;
  const isTripThresholdReached = effectiveLeakageMa >= sensitivityMa * 0.5; // Trip between 0.5 and 1.0 x IΔn per IEC 61008

  const handleTestButton = () => {
    soundEffects.playSwitchClick();
    setIsTestButtonPressed(true);
    setTimeout(() => {
      soundEffects.playWarningBuzzer();
      setIsBreakerTripped(true);
      setTripTimeMs(isSelectiveS ? 120 : 25);
      setIsTestButtonPressed(false);
    }, 150);
  };

  const handleResetBreaker = () => {
    soundEffects.playSwitchClick();
    setIsBreakerTripped(false);
    setLeakageCurrentMa(0);
    setTripTimeMs(null);
  };

  const handleInjectLeakage = (currentMa: number) => {
    setLeakageCurrentMa(currentMa);
    if (currentMa >= sensitivityMa * 0.5) {
      soundEffects.playWarningBuzzer();
      setIsBreakerTripped(true);
      // Realistic trip time calculation per IEC 61008
      const multiple = currentMa / sensitivityMa;
      let time = 30;
      if (multiple >= 5) time = 15;
      else if (multiple >= 2) time = 25;
      else time = 120;
      if (isSelectiveS) time += 100;
      setTripTimeMs(time);
    } else {
      setIsBreakerTripped(false);
      setTripTimeMs(null);
    }
  };

  const rcdTypesInfo: Record<
    RcdType,
    { title: string; desc_fr: string; desc_en: string; loads_fr: string; loads_en: string; badgeColor: string }
  > = {
    TYPE_AC: {
      title: 'Type AC (Sinusoïdal Pur)',
      desc_fr: 'Détecte uniquement les courants de défaut alternatifs sinusoïdaux purs à 50/60 Hz.',
      desc_en: 'Detects purely sinusoidal AC earth leakage currents at 50/60 Hz only.',
      loads_fr: 'Circuits d\'éclairage incandescent/halogène, convecteurs et radiateurs résistifs simples.',
      loads_en: 'Resistive heating and purely linear incandescent lighting circuits.',
      badgeColor: 'text-slate-300 border-slate-700 bg-slate-900'
    },
    TYPE_A: {
      title: 'Type A (Alternatif + Continu Pulsé)',
      desc_fr: 'Détecte les courants alternatifs et les courants continus pulsés avec ou sans composante continue lissée jusqu\'à 6 mA.',
      desc_en: 'Detects sinusoidal AC and pulsating DC residual currents with smooth DC up to 6 mA.',
      loads_fr: 'Lave-linge, plaques à induction, variateurs électroniques, alimentations LED DALI.',
      loads_en: 'Washing machines, induction hobs, LED drivers, modern electronic power supplies.',
      badgeColor: 'text-amber-300 border-amber-500/40 bg-amber-950/30'
    },
    TYPE_F: {
      title: 'Type F (Fréquences Mixtes Inverter)',
      desc_fr: 'Spécialisé pour les charges monophasées à vitesse variable (inverter) ; immunisé contre les déclenchements intempestifs jusqu\'à 10 ms.',
      desc_en: 'Optimized for single-phase frequency converters (inverters); immunity to surge nuisance tripping.',
      loads_fr: 'Pompes à chaleur Inverter, climatiseurs réversibles, sèche-linge à moteur synchrone.',
      loads_en: 'Inverter heat pumps, variable-speed air conditioning, modern inverter drives.',
      badgeColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30'
    },
    TYPE_B: {
      title: 'Type B (Universel AC / DC Total)',
      desc_fr: 'Protection universelle tout courant : alternatif, pulsé et continu lisse pur jusqu\'à 1 kHz sans saturation du tore.',
      desc_en: 'Universal all-current protection: AC, pulsating DC, and smooth DC leakage up to 1 kHz.',
      loads_fr: 'Bornes de recharge de véhicules électriques (IRVE), onduleurs photovoltaïques sans transfo, variateurs triphasés.',
      loads_en: 'EV charging stations (EVSE), transformerless PV inverters, 3-phase variable-speed drives.',
      badgeColor: 'text-purple-300 border-purple-500/40 bg-purple-950/30'
    }
  };

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Shield className="h-4 w-4" />
            <span>{locale === 'fr' ? 'LABORATOIRE DE PHYSIQUE DE LA PROTECTION DIFFÉRENTIELLE (DDR / RCD / RCBO)' : 'DIFFERENTIAL RCD / RCBO PHYSICS LABORATORY'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Banc d\'Essai & Équilibre Magnétique du Tore' : 'Magnetic Toroid Flux Balance & Trip Simulator'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Comprenez la loi des courants de Kirchhoff (ΣI = 0), simulez les fuites à la terre, testez le bouton de déclenchement et comparez les types AC, A, F et B.'
              : 'Explore Kirchhoff flux balance (ΣI = 0), simulate earth leakages, test the mechanical trip button, and compare Type AC, A, F, and B curves.'}
          </p>
        </div>

        <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 61008-1 / IEC 61009-1" />
      </div>

      {/* RCD Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
        
        {/* Type Selector */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Type de Différentiel :' : 'RCD Detection Type:'}
          </label>
          <select
            value={rcdType}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setRcdType(e.target.value as RcdType);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-xs focus:border-rose-400 focus:outline-none font-bold"
          >
            <option value="TYPE_AC">Type AC (Sinusoïdal Standard)</option>
            <option value="TYPE_A">Type A (Alternatif + Continu Pulsé)</option>
            <option value="TYPE_F">Type F (Inverter / Pompes à chaleur)</option>
            <option value="TYPE_B">Type B (Tout Courant / Bornes VE)</option>
          </select>
        </div>

        {/* Sensitivity Selector */}
        <div className="space-y-1">
          <label className="text-slate-400 font-bold text-[10px] uppercase block">
            {locale === 'fr' ? 'Sensibilité Assignée (IΔn) :' : 'Rated Sensitivity (IΔn):'}
          </label>
          <select
            value={sensitivityMa}
            onChange={(e) => {
              soundEffects.playSwitchClick();
              setSensitivityMa(Number(e.target.value) as RcdSensitivity);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-cyan-300 font-mono text-xs focus:border-rose-400 focus:outline-none font-bold"
          >
            <option value={10}>10 mA (Haute sensibilité · Salles d\'eau & Crèches)</option>
            <option value={30}>30 mA (Protection des personnes · NF C 15-100 standard)</option>
            <option value={100}>100 mA (Tertiaire / Départs protégés)</option>
            <option value={300}>300 mA (Protection incendie / Tête de tableau)</option>
            <option value={500}>500 mA (Disjoncteur de branchement EDF)</option>
          </select>
        </div>

        {/* Selective (S) Mode Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 self-end">
          <div>
            <span className="text-white font-bold block text-[10px] uppercase">{locale === 'fr' ? 'Temporisation Sélective (S) :' : 'Selective (S) Time Delay:'}</span>
            <span className="text-[9px] text-slate-400">Δt = 40 ms - 150 ms</span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setIsSelectiveS(!isSelectiveS);
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              isSelectiveS ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isSelectiveS ? 'OUI (SÉLECTIF)' : 'NON (INSTANTANÉ)'}
          </button>
        </div>

      </div>

      {/* Interactive Toroid Magnetic Simulation Canvas */}
      <div className="p-5 rounded-2xl bg-[#060911] border-2 border-slate-700 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
          <span className="font-bold text-rose-400 flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span>{locale === 'fr' ? 'SCHÉMA PHYSIQUE DU TORE DIFFÉRENTIEL SOMMATEUR' : 'SUMMATION TOROID CURRENT TRANSFORMER PHYSICS'}</span>
          </span>
          <span className="text-slate-400 font-mono">
            {locale === 'fr' ? 'Condition Normale : IL1 + IL2 + IL3 + IN = 0 (Flux Φ = 0)' : 'Normal: IL1 + IL2 + IL3 + IN = 0 (Flux Φ = 0)'}
          </span>
        </div>

        {/* Toroid Core Graphic Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left: Magnetic Toroid Schematic */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <div className="relative flex items-center justify-center p-6">
              {/* Toroid Ring */}
              <div className={`w-44 h-44 rounded-full border-8 flex items-center justify-center transition-all ${
                isBreakerTripped
                  ? 'border-rose-500 bg-rose-950/40 shadow-xl shadow-rose-500/20 animate-pulse'
                  : 'border-cyan-500/60 bg-cyan-950/20'
              }`}>
                {/* Center Conductors Passing Through */}
                <div className="space-y-1 text-[10px] font-bold">
                  <div className="text-amber-400">Phase L1 (I1) ➔</div>
                  <div className="text-cyan-400">Phase L2 (I2) ➔</div>
                  <div className="text-emerald-400">Phase L3 (I3) ➔</div>
                  <div className="text-blue-400">Neutre N (IN) ➔</div>
                </div>
              </div>

              {/* Secondary Sensor Coil */}
              <div className="absolute top-2 right-6 p-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-center">
                <span className="text-slate-400 block text-[9px]">Bobinage de Détection</span>
                <span className={`font-bold ${isTripThresholdReached ? 'text-rose-400' : 'text-emerald-400'}`}>
                  IΔ = {effectiveLeakageMa} mA
                </span>
              </div>
            </div>

            {/* Test Button & Reset Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestButton}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Presser Bouton TEST (T)' : 'Push TEST Button (T)'}</span>
              </button>

              {isBreakerTripped && (
                <button
                  type="button"
                  onClick={handleResetBreaker}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer animate-bounce"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Réarmer le Différentiel' : 'Reset Breaker (ON)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Fault Current Injection Slider & Status */}
          <div className="space-y-4">
            
            {/* Leakage Slider */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">{locale === 'fr' ? 'Injecter un Courant de Fuite à la Terre :' : 'Inject Earth Leakage Current:'}</span>
                <span className="text-amber-400 font-mono font-black text-sm">{leakageCurrentMa} mA</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={leakageCurrentMa}
                onChange={(e) => handleInjectLeakage(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>0 mA (Sain)</span>
                <span>Seuil non-déclenchement (0.5 x IΔn = {sensitivityMa * 0.5} mA)</span>
                <span>Seuil IΔn = {sensitivityMa} mA</span>
              </div>
            </div>

            {/* Breaker Output Status Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              isBreakerTripped
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-lg'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}>
              <div>
                <span className="text-xs font-black uppercase block">
                  {isBreakerTripped
                    ? (locale === 'fr' ? '⚡ DISPOSITIF DÉCLENCHÉ · CIRCUIT COUPÉ' : '⚡ RCD TRIPPED · CIRCUIT ISOLATED')
                    : (locale === 'fr' ? '✓ EN SERVICE · AUCUNE FUITE DÉTECTÉE' : '✓ ENERGIZED · HEALTHY FLUX BALANCE')}
                </span>
                <span className="text-[10px] opacity-80 block mt-0.5">
                  {isBreakerTripped
                    ? `${locale === 'fr' ? 'Temps d\'ouverture' : 'Trip Time'}: ${tripTimeMs} ms (${locale === 'fr' ? 'Conforme CEI' : 'IEC Compliant'})`
                    : `${locale === 'fr' ? 'Flux magnétique résiduel' : 'Residual magnetic flux'}: Φ = 0 Wb`}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${
                isBreakerTripped ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
              }`}>
                {isBreakerTripped ? 'DÉCLENCHÉ' : 'FERMÉ (ON)'}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* RCD Type Comparison Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(rcdTypesInfo) as [RcdType, any][]).map(([typeKey, info]) => {
          const isSelected = rcdType === typeKey;
          return (
            <div
              key={typeKey}
              onClick={() => {
                soundEffects.playSwitchClick();
                setRcdType(typeKey);
              }}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                isSelected
                  ? `${info.badgeColor} ring-2 ring-amber-400/60 shadow-lg scale-102`
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-white block">{info.title}</span>
                <p className="text-[10px] text-slate-300 mt-1 font-sans leading-relaxed">{info[locale === 'fr' ? 'desc_fr' : 'desc_en']}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">{locale === 'fr' ? 'Applications :' : 'Typical Loads:'}</span>
                <span className="text-[10px] text-amber-300 font-sans">{info[locale === 'fr' ? 'loads_fr' : 'loads_en']}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
