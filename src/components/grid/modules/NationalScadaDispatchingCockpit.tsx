// src/components/grid/modules/NationalScadaDispatchingCockpit.tsx
// EPEDE Deep Engineering Module — Cameroon Power Grid
// National SCADA Dispatching Cockpit (Centre de Conduite de Mangombé - SONATREL)
// Simulates 50.00 Hz grid frequency dynamics, 24h load curve, spinning reserves, and UFLS load shedding

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Radio,
  Clock,
  Gauge,
  Sliders,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
  Power,
  RotateCcw,
  CheckCircle2,
  Building2,
  Layers
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  onNavigateSimulation?: (tab: string) => void;
  onNavigateCalculator?: (tab: string, context?: any) => void;
}

export const NationalScadaDispatchingCockpit: React.FC<Props> = ({
  locale,
  onNavigateSimulation,
  onNavigateCalculator,
}) => {
  const isFr = locale === 'fr';

  // 1. Time-of-Day Slider (0 to 23 hours)
  const [selectedHour, setSelectedHour] = useState<number>(20); // 20:00 (Peak lighting hour in Cameroon)
  
  // 2. Frequency Offset Slider / Perturbation (-1.5 Hz to +1.0 Hz)
  const [freqOffset, setFreqOffset] = useState<number>(0.02); // 50.02 Hz normal

  // 3. Grid Frequency Calculation
  const currentFrequencyHz = Number((50.0 + freqOffset).toFixed(2));

  // 24-Hour National Load Profile for Cameroon (RIS + RIN)
  const HOURLY_LOAD_PROFILE: Array<{
    hour: number;
    timeLabel: string;
    totalDemandMw: number;
    hydroMw: number;
    thermalGasMw: number;
    thermalHfoMw: number;
    solarMw: number;
    stage: string;
  }> = [
    { hour: 0, timeLabel: '00:00', totalDemandMw: 840, hydroMw: 680, thermalGasMw: 140, thermalHfoMw: 20, solarMw: 0, stage: 'Creux Nuit' },
    { hour: 1, timeLabel: '01:00', totalDemandMw: 810, hydroMw: 660, thermalGasMw: 130, thermalHfoMw: 20, solarMw: 0, stage: 'Creux Nuit' },
    { hour: 2, timeLabel: '02:00', totalDemandMw: 790, hydroMw: 650, thermalGasMw: 120, thermalHfoMw: 20, solarMw: 0, stage: 'Minimum Journalier' },
    { hour: 3, timeLabel: '03:00', totalDemandMw: 800, hydroMw: 650, thermalGasMw: 130, thermalHfoMw: 20, solarMw: 0, stage: 'Creux Nuit' },
    { hour: 4, timeLabel: '04:00', totalDemandMw: 830, hydroMw: 670, thermalGasMw: 140, thermalHfoMw: 20, solarMw: 0, stage: 'Réveil Matinal' },
    { hour: 5, timeLabel: '05:00', totalDemandMw: 890, hydroMw: 720, thermalGasMw: 150, thermalHfoMw: 20, solarMw: 0, stage: 'Ramp-up Matinal' },
    { hour: 6, timeLabel: '06:00', totalDemandMw: 980, hydroMw: 780, thermalGasMw: 170, thermalHfoMw: 30, solarMw: 0, stage: 'Ramp-up Matinal' },
    { hour: 7, timeLabel: '07:00', totalDemandMw: 1120, hydroMw: 850, thermalGasMw: 210, thermalHfoMw: 50, solarMw: 10, stage: 'Démarrage Industriel' },
    { hour: 8, timeLabel: '08:00', totalDemandMw: 1220, hydroMw: 920, thermalGasMw: 216, thermalHfoMw: 60, solarMw: 24, stage: 'Pointe Matinale' },
    { hour: 9, timeLabel: '09:00', totalDemandMw: 1260, hydroMw: 950, thermalGasMw: 216, thermalHfoMw: 66, solarMw: 28, stage: 'Régime Industriel' },
    { hour: 10, timeLabel: '10:00', totalDemandMw: 1280, hydroMw: 960, thermalGasMw: 216, thermalHfoMw: 74, solarMw: 30, stage: 'Plein Ensoleillement' },
    { hour: 11, timeLabel: '11:00', totalDemandMw: 1290, hydroMw: 970, thermalGasMw: 216, thermalHfoMw: 74, solarMw: 30, stage: 'Pic Solaire Scatec' },
    { hour: 12, timeLabel: '12:00', totalDemandMw: 1250, hydroMw: 950, thermalGasMw: 216, thermalHfoMw: 56, solarMw: 28, stage: 'Pause Méridienne' },
    { hour: 13, timeLabel: '13:00', totalDemandMw: 1230, hydroMw: 940, thermalGasMw: 216, thermalHfoMw: 48, solarMw: 26, stage: 'Plateau Après-midi' },
    { hour: 14, timeLabel: '14:00', totalDemandMw: 1240, hydroMw: 950, thermalGasMw: 216, thermalHfoMw: 50, solarMw: 24, stage: 'Reprise Usines' },
    { hour: 15, timeLabel: '15:00', totalDemandMw: 1250, hydroMw: 960, thermalGasMw: 216, thermalHfoMw: 54, solarMw: 20, stage: 'Industrie Plein Régime' },
    { hour: 16, timeLabel: '16:00', totalDemandMw: 1240, hydroMw: 960, thermalGasMw: 216, thermalHfoMw: 52, solarMw: 12, stage: 'Déclin Solaire' },
    { hour: 17, timeLabel: '17:00', totalDemandMw: 1260, hydroMw: 980, thermalGasMw: 216, thermalHfoMw: 60, solarMw: 4, stage: 'Transition Crépuscule' },
    { hour: 18, timeLabel: '18:00', totalDemandMw: 1340, hydroMw: 1020, thermalGasMw: 216, thermalHfoMw: 86, solarMw: 0, stage: 'Allumage Éclairage' },
    { hour: 19, timeLabel: '19:00', totalDemandMw: 1410, hydroMw: 1080, thermalGasMw: 216, thermalHfoMw: 86, solarMw: 0, stage: 'POINTE DU SOIR (PEAK)' },
    { hour: 20, timeLabel: '20:00', totalDemandMw: 1435, hydroMw: 1100, thermalGasMw: 216, thermalHfoMw: 86, solarMw: 0, stage: 'POINTE DU SOIR (MAX)' },
    { hour: 21, timeLabel: '21:00', totalDemandMw: 1390, hydroMw: 1060, thermalGasMw: 216, thermalHfoMw: 86, solarMw: 0, stage: 'Pointe Résidentielle' },
    { hour: 22, timeLabel: '22:00', totalDemandMw: 1200, hydroMw: 920, thermalGasMw: 210, thermalHfoMw: 70, solarMw: 0, stage: 'Décroissance Soir' },
    { hour: 23, timeLabel: '23:00', totalDemandMw: 980, hydroMw: 780, thermalGasMw: 170, thermalHfoMw: 30, solarMw: 0, stage: 'Entrée Nuit' },
  ];

  const currentHourData = HOURLY_LOAD_PROFILE[selectedHour];

  // Under-Frequency Load Shedding (UFLS) Stages per SONATREL Grid Code
  const uflsStatus = useMemo(() => {
    if (currentFrequencyHz >= 49.80) {
      return { stage: 0, textFr: 'Zone Nominale Sécurisée (50.00 ± 0.20 Hz)', textEn: 'Nominal Secure Band', color: 'text-emerald-400', shedMw: 0 };
    }
    if (currentFrequencyHz >= 49.50) {
      return { stage: 0, textFr: 'Déviation Mineure — Mobilisation Réserve Primaire', textEn: 'Minor Deviation — Primary Reserve Active', color: 'text-amber-400', shedMw: 0 };
    }
    if (currentFrequencyHz >= 49.00) {
      return { stage: 1, textFr: 'Délestage Étage 1 (49.2 Hz) : Gros Industriels Non Prioritaires', textEn: 'Stage 1 UFLS (49.2 Hz): Non-critical Industrial Load', color: 'text-orange-400', shedMw: 60 };
    }
    if (currentFrequencyHz >= 48.60) {
      return { stage: 2, textFr: 'Délestage Étage 2 (48.8 Hz) : Départs Mixtes & Secondaires', textEn: 'Stage 2 UFLS (48.8 Hz): Secondary Urban Feeders', color: 'text-rose-400', shedMw: 120 };
    }
    if (currentFrequencyHz >= 48.20) {
      return { stage: 3, textFr: 'Délestage Étage 3 (48.5 Hz) : Distribution Générale Yaoundé/Douala', textEn: 'Stage 3 UFLS (48.5 Hz): General Distribution Shedding', color: 'text-rose-500', shedMw: 200 };
    }
    return { stage: 4, textFr: 'Délestage Étage 4 (48.0 Hz) : Îlotage d\'Urgence et Sauvegarde du Réseau', textEn: 'Stage 4 UFLS (48.0 Hz): Emergency Islanding Triggered', color: 'text-red-500', shedMw: 350 };
  }, [currentFrequencyHz]);

  // Primary & Secondary Reserves (MW)
  const primaryReserveMw = 65; // MW spinning on Songloulou & Nachtigal
  const secondaryReserveMw = 45; // MW dispatchable on gas/hydro

  return (
    <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* 1. Header Cockpit Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">
              {isFr ? 'SONATREL · CENTRE NATIONAL DE CONDUITE DU RÉSEAU (MANGOMBÉ)' : 'SONATREL · NATIONAL GRID CONTROL CENTER (MANGOMBÉ)'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2.5">
            <span>{isFr ? 'Cockpit SCADA & Stabilité Fréquence (50.00 Hz)' : 'SCADA Cockpit & 50.00 Hz Frequency Stability'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              EMS DISPATCH LIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isFr
              ? 'Surveillance temps réel de l\'équilibre Production/Consommation national, réserve tournante primaire/secondaire, et automatisme de délestage fréquencemétrique (UFLS).'
              : 'Real-time monitoring of national generation/demand balance, primary/secondary spinning reserves, and Under-Frequency Load Shedding (UFLS) scheme.'}
          </p>
        </div>

        {/* Live Frequency Dial Metric */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border flex items-center gap-3 shadow-lg ${
            currentFrequencyHz >= 49.80 && currentFrequencyHz <= 50.20
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : currentFrequencyHz < 49.00
                ? 'bg-rose-950/60 border-rose-500/60 animate-pulse'
                : 'bg-amber-950/50 border-amber-500/50'
          }`}>
            <Activity className={`w-6 h-6 ${
              currentFrequencyHz >= 49.80 ? 'text-emerald-400' : 'text-rose-400'
            }`} />
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                {isFr ? 'Fréquence Système' : 'Grid Frequency'}
              </span>
              <span className={`text-2xl font-black font-mono tracking-tight ${
                currentFrequencyHz >= 49.80 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {currentFrequencyHz.toFixed(2)} Hz
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Time-of-Day Slider (24h Profile) */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{isFr ? 'Heure d\'Exploitation & Profil Journalier de Charge' : 'Operating Hour & 24h Daily Demand Profile'}</span>
          </span>
          <span className="text-cyan-400 text-sm font-bold bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800">
            {currentHourData.timeLabel} ({currentHourData.stage})
          </span>
        </div>

        {/* 24-Hour Slider */}
        <input
          type="range"
          min={0}
          max={23}
          step={1}
          value={selectedHour}
          onChange={(e) => setSelectedHour(Number(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer"
        />

        {/* Load Curve Histogram Visualizer */}
        <div className="grid grid-cols-24 gap-1 h-14 items-end pt-2 border-t border-slate-850">
          {HOURLY_LOAD_PROFILE.map((item) => {
            const isCurrent = item.hour === selectedHour;
            const heightPct = Math.round((item.totalDemandMw / 1500) * 100);
            return (
              <div
                key={item.hour}
                onClick={() => setSelectedHour(item.hour)}
                className={`rounded-t transition-all cursor-pointer relative group ${
                  isCurrent
                    ? 'bg-cyan-400 ring-2 ring-white shadow-lg'
                    : item.totalDemandMw >= 1400
                      ? 'bg-rose-500/80 hover:bg-rose-400'
                      : 'bg-slate-700 hover:bg-slate-500'
                }`}
                style={{ height: `${heightPct}%` }}
                title={`${item.timeLabel}: ${item.totalDemandMw} MW (${item.stage})`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 pt-1">
          <span>00:00 (Nuit)</span>
          <span>06:00 (Ramp-up)</span>
          <span>12:00 (Midi)</span>
          <span className="text-rose-400 font-bold">20:00 (POINTE 1 435 MW)</span>
          <span>23:00</span>
        </div>
      </div>

      {/* 3. Real-Time Generation Stack for the Active Hour */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        
        {/* Hydro Contribution */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/50">
          <div className="flex items-center justify-between text-cyan-400 text-[11px] mb-1">
            <span>HYDROÉLECTRIQUE</span>
            <span>{Math.round((currentHourData.hydroMw / currentHourData.totalDemandMw) * 100)}%</span>
          </div>
          <span className="text-lg font-bold text-white block">{currentHourData.hydroMw} MW</span>
          <span className="text-[10px] text-slate-400">Songloulou, Nachtigal, Edéa</span>
        </div>

        {/* Thermal Gas */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-orange-900/50">
          <div className="flex items-center justify-between text-orange-400 text-[11px] mb-1">
            <span>GAZ NATUREL</span>
            <span>{Math.round((currentHourData.thermalGasMw / currentHourData.totalDemandMw) * 100)}%</span>
          </div>
          <span className="text-lg font-bold text-white block">{currentHourData.thermalGasMw} MW</span>
          <span className="text-[10px] text-slate-400">Kribi Gaz (KPDC 216 MW)</span>
        </div>

        {/* Thermal HFO */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/50">
          <div className="flex items-center justify-between text-rose-400 text-[11px] mb-1">
            <span>FIOUL LOURD (HFO)</span>
            <span>{Math.round((currentHourData.thermalHfoMw / currentHourData.totalDemandMw) * 100)}%</span>
          </div>
          <span className="text-lg font-bold text-white block">{currentHourData.thermalHfoMw} MW</span>
          <span className="text-[10px] text-slate-400">Dibamba (86 MW) + Limbe</span>
        </div>

        {/* Solar & BESS */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-yellow-900/50">
          <div className="flex items-center justify-between text-yellow-400 text-[11px] mb-1">
            <span>SOLAIRE & BESS</span>
            <span>{Math.round((currentHourData.solarMw / currentHourData.totalDemandMw) * 100)}%</span>
          </div>
          <span className="text-lg font-bold text-white block">{currentHourData.solarMw} MW</span>
          <span className="text-[10px] text-slate-400">Scatec Maroua & Guider</span>
        </div>
      </div>

      {/* 4. Automated UFLS (Délestage Fréquencemétrique) & Reserve Dynamics */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
        
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Statut du Plan de Délestage Fréquencemétrique (UFLS)' : 'Under-Frequency Load Shedding (UFLS) Status'}</span>
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${uflsStatus.color} bg-slate-900 border border-slate-800`}>
            Étage {uflsStatus.stage} : {uflsStatus.textFr}
          </span>
        </div>

        {/* 4-Stage Progressive Alert Gauge */}
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          <div className={`p-2.5 rounded-lg border ${
            currentFrequencyHz >= 49.80 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="block font-bold">50.00 Hz</span>
            <span className="text-[10px]">Nominal (±0.20)</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            currentFrequencyHz < 49.50 && currentFrequencyHz >= 49.00 ? 'bg-orange-950/80 border-orange-500/60 text-orange-300 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="block font-bold">49.20 Hz</span>
            <span className="text-[10px]">Étage 1 (-60 MW)</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            currentFrequencyHz < 49.00 && currentFrequencyHz >= 48.50 ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="block font-bold">48.80 Hz</span>
            <span className="text-[10px]">Étage 2 (-120 MW)</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            currentFrequencyHz < 48.50 ? 'bg-red-950 border-red-500 text-red-300 font-bold animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="block font-bold">48.50 Hz</span>
            <span className="text-[10px]">Étage 3/4 (Urgence)</span>
          </div>
        </div>

        {/* Perturbation Injection Testing Bar */}
        <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <span className="text-slate-400">
            {isFr ? 'Injecter une perturbation de fréquence :' : 'Inject frequency perturbation:'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFreqOffset(-0.85)} // Drop to 49.15 Hz -> triggers Stage 1
              className="px-2.5 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition-colors cursor-pointer"
            >
              -0.85 Hz (Déficit 120 MW)
            </button>

            <button
              type="button"
              onClick={() => setFreqOffset(-1.60)} // Drop to 48.40 Hz -> triggers Stage 3
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors cursor-pointer"
            >
              -1.60 Hz (Perte Nachtigal)
            </button>

            <button
              type="button"
              onClick={() => setFreqOffset(0.02)} // Reset to 50.02 Hz
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>50.00 Hz (Nominal)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
