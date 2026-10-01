// src/components/substations/modules/StationServicesAtsEngine.tsx
// 400V Station Services Dual-Incomer Automatic Transfer Switch (ATS) & Load Shedding Engine

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Power,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Cpu,
  Clock,
  ArrowRight,
  Play,
  Pause,
  Sliders,
  Activity
} from 'lucide-react';

interface StationServicesAtsEngineProps {
  locale: 'fr' | 'en';
}

type AtsPowerSource = 'TSA_1' | 'TSA_2' | 'DIESEL_EDG' | 'TOTAL_BLACKOUT';

export const StationServicesAtsEngine: React.FC<StationServicesAtsEngineProps> = ({ locale }) => {
  // Grid condition states
  const [gridState, setGridState] = useState<'NOMINAL' | 'LOSS_OF_TSA1' | 'TOTAL_BLACKOUT'>('NOMINAL');
  const [atsMode, setAtsMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  
  // Breaker states
  const [breakerTsa1, setBreakerTsa1] = useState<boolean>(true);
  const [breakerTsa2, setBreakerTsa2] = useState<boolean>(false);
  const [breakerCoupler, setBreakerCoupler] = useState<boolean>(true);
  const [breakerEdg, setBreakerEdg] = useState<boolean>(false);

  // Diesel Generator State Machine
  const [edgRunning, setEdgRunning] = useState<boolean>(false);
  const [edgFrequencyHz, setEdgFrequencyHz] = useState<number>(0);
  const [edgVoltageV, setEdgVoltageV] = useState<number>(0);
  const [atsTimerSec, setAtsTimerSec] = useState<number>(0);

  // Load Shedding Stages
  const [shedStage1Hvac, setShedStage1Hvac] = useState<boolean>(false); // Comfort HVAC
  const [shedStage2Lighting, setShedStage2Lighting] = useState<boolean>(false); // Yard Floodlights

  // Simulate ATS automation controller logic
  useEffect(() => {
    if (gridState === 'NOMINAL') {
      setBreakerTsa1(true);
      setBreakerTsa2(false);
      setBreakerCoupler(true);
      setBreakerEdg(false);
      setEdgRunning(false);
      setEdgFrequencyHz(0);
      setEdgVoltageV(0);
      setAtsTimerSec(0);
      setShedStage1Hvac(false);
      setShedStage2Lighting(false);
    } else if (gridState === 'LOSS_OF_TSA1') {
      // Automatic transfer from TSA1 to TSA2 after 1.5s delay
      setBreakerTsa1(false);
      const timer = setTimeout(() => {
        setBreakerTsa2(true);
        setBreakerCoupler(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (gridState === 'TOTAL_BLACKOUT') {
      // Total AC blackout: both TSA1 and TSA2 lost
      setBreakerTsa1(false);
      setBreakerTsa2(false);
      // Initiate shedding of non-essential loads immediately
      setShedStage1Hvac(true);
      setShedStage2Lighting(true);

      // Start Diesel EDG sequence (cranking & warm up)
      const crankTimer = setTimeout(() => {
        setEdgRunning(true);
        setEdgFrequencyHz(50.0);
        setEdgVoltageV(400);
        // After EDG reaches nominal parameters, close EDG breaker
        setTimeout(() => {
          setBreakerEdg(true);
        }, 1500);
      }, 2000);

      return () => clearTimeout(crankTimer);
    }
  }, [gridState]);

  // Total Load calculation
  const baseEssentialKw = 45; // Chargers, SF6 compressors, Oil pumps
  const hvacKw = shedStage1Hvac ? 0 : 35;
  const lightingKw = shedStage2Lighting ? 0 : 20;
  const currentTotalKw = baseEssentialKw + hvacKw + lightingKw;

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>TABLEAU 400V BT SERVICES AUXILIAIRES & INVERSEUR DE SOURCE ATS</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-1">
            {locale === 'fr'
              ? 'Basculement Automatique Normal / Secours (TSA 1 / TSA 2 / Groupe Diesel 250 kVA)'
              : 'Dual-Incomer Automatic Transfer Switch (ATS) & Priority Load Shedding'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {locale === 'fr'
              ? 'Gestion des pertes de sources AC selon la norme CEI 61439-2. Interverrouillage mécanique et électrique 4 pôles avec délestage automatique des charges non prioritaires.'
              : 'AC source loss management per IEC 61439-2. 4-pole electrical and mechanical interlocking with automatic shedding of non-essential loads.'}
          </p>
        </div>

        {/* Operating Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGridState('NOMINAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              gridState === 'NOMINAL'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
            }`}
          >
            ● {locale === 'fr' ? 'Réseau Nominal (TSA 1)' : 'Nominal (TSA 1)'}
          </button>

          <button
            type="button"
            onClick={() => setGridState('LOSS_OF_TSA1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              gridState === 'LOSS_OF_TSA1'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ {locale === 'fr' ? 'Perte TSA 1 &rarr; Bascule TSA 2' : 'TSA 1 Loss &rarr; TSA 2'}
          </button>

          <button
            type="button"
            onClick={() => setGridState('TOTAL_BLACKOUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              gridState === 'TOTAL_BLACKOUT'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 animate-pulse'
                : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
            }`}
          >
            🚨 {locale === 'fr' ? 'Blackout Total &rarr; Diesel EDG' : 'Full Blackout &rarr; EDG'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Single Line Mimic of ATS Switchboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 cols: Mimic Schematic */}
        <div className="lg:col-span-8 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E2634] pb-2.5">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Synoptique Fonctionnel de Distribution AC 400V</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Interverrouillage 4P Mécanique + Électrique
            </span>
          </div>

          {/* Graphical Mimic Card */}
          <div className="bg-[#0D121B] border border-[#1E2634] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono mb-4">
              {/* Source 1: TSA 1 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  gridState === 'NOMINAL'
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] block opacity-80">SOURCE PRINCIPALE</span>
                <span className="font-bold text-sm block mt-0.5">TSA 1 (250 kVA)</span>
                <span className="text-[10px] block text-slate-400">15 kV &rarr; 400 V</span>
                <div className="mt-2 pt-1 border-t border-slate-800">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      breakerTsa1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Disj. Q1: {breakerTsa1 ? 'FERMÉ' : 'OUVERT'}
                  </span>
                </div>
              </div>

              {/* Source 2: TSA 2 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  breakerTsa2
                    ? 'bg-amber-950/30 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] block opacity-80">SOURCE SECOURS 1</span>
                <span className="font-bold text-sm block mt-0.5">TSA 2 (250 kVA)</span>
                <span className="text-[10px] block text-slate-400">Réseau Auxiliaire 2</span>
                <div className="mt-2 pt-1 border-t border-slate-800">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      breakerTsa2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Disj. Q2: {breakerTsa2 ? 'FERMÉ' : 'OUVERT'}
                  </span>
                </div>
              </div>

              {/* Source 3: Emergency Diesel Generator */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  breakerEdg
                    ? 'bg-sky-950/30 border-sky-500 text-sky-300'
                    : edgRunning
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] block opacity-80">SOURCE ULTIME</span>
                <span className="font-bold text-sm block mt-0.5">DIESEL EDG (250 kVA)</span>
                <span className="text-[10px] block text-slate-400">
                  {edgRunning ? `${edgFrequencyHz.toFixed(1)} Hz · ${edgVoltageV} V` : 'Arrêté (Veille chauffée)'}
                </span>
                <div className="mt-2 pt-1 border-t border-slate-800">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      breakerEdg ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Disj. Q_GE: {breakerEdg ? 'FERMÉ' : 'OUVERT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Central 400V AC Busbar */}
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${breakerTsa1 || breakerTsa2 || breakerEdg ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                  JEU DE BARRES GÉNÉRAL 400V BT (ACDB)
                </span>
                <span className="text-emerald-400 font-bold">
                  {breakerTsa1 || breakerTsa2 || breakerEdg ? '400.2 V · 50.0 Hz' : '0.0 V (HORS TENSION)'}
                </span>
              </div>

              {/* Feeders Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                {/* Feeder 1: Battery Chargers */}
                <div className="p-2 rounded-lg bg-[#0D121B] border border-emerald-900/50">
                  <span className="text-[9px] text-emerald-400 font-bold block">PRIORITÉ 1 (ESSENTIEL)</span>
                  <span className="text-white font-bold text-xs block">Chargeurs 110V</span>
                  <span className="text-[10px] text-slate-400 block">Redresseurs A & B (25 kW)</span>
                  <span className="text-[9px] text-emerald-400 font-mono mt-1 block">● En service permanent</span>
                </div>

                {/* Feeder 2: Transformer Cooling */}
                <div className="p-2 rounded-lg bg-[#0D121B] border border-emerald-900/50">
                  <span className="text-[9px] text-emerald-400 font-bold block">PRIORITÉ 1 (ESSENTIEL)</span>
                  <span className="text-white font-bold text-xs block">Refroidissement TR</span>
                  <span className="text-[10px] text-slate-400 block">Pompes & Vents (20 kW)</span>
                  <span className="text-[9px] text-emerald-400 font-mono mt-1 block">● Maintenu sous GE</span>
                </div>

                {/* Feeder 3: HVAC / Building Comfort (Sheddable) */}
                <div className={`p-2 rounded-lg border transition-all ${
                  shedStage1Hvac ? 'bg-red-950/20 border-red-800/60 opacity-60' : 'bg-[#0D121B] border-slate-800'
                }`}>
                  <span className="text-[9px] text-amber-400 font-bold block">DÉLESTAGE ÉTAGE 1</span>
                  <span className="text-white font-bold text-xs block">Climatisation HVAC</span>
                  <span className="text-[10px] text-slate-400 block">Bâtiment (35 kW)</span>
                  <span className={`text-[9px] font-mono mt-1 block ${shedStage1Hvac ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {shedStage1Hvac ? '✖ DÉLESTÉ SUR DIESEL' : '● En service'}
                  </span>
                </div>

                {/* Feeder 4: Yard Floodlights (Sheddable) */}
                <div className={`p-2 rounded-lg border transition-all ${
                  shedStage2Lighting ? 'bg-red-950/20 border-red-800/60 opacity-60' : 'bg-[#0D121B] border-slate-800'
                }`}>
                  <span className="text-[9px] text-amber-400 font-bold block">DÉLESTAGE ÉTAGE 2</span>
                  <span className="text-white font-bold text-xs block">Éclairage Extérieur</span>
                  <span className="text-[10px] text-slate-400 block">Projecteurs Poste (20 kW)</span>
                  <span className={`text-[9px] font-mono mt-1 block ${shedStage2Lighting ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {shedStage2Lighting ? '✖ DÉLESTÉ SUR DIESEL' : '● En service'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 cols: ATS Controller Status & Load Management */}
        <div className="lg:col-span-4 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-4">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1E2634] pb-2.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>{locale === 'fr' ? 'Automate ATS & Bilan de Puissance' : 'ATS Controller & Power Balance'}</span>
          </h4>

          {/* Active Power Balance Card */}
          <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Puissance AC Total Appelée</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-sky-400">{currentTotalKw} kW</span>
              <span className="text-xs font-mono text-slate-500">/ Capacité 200 kW</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  currentTotalKw > 150 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${(currentTotalKw / 200) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              {gridState === 'TOTAL_BLACKOUT'
                ? 'Délestage actif : Le groupe diesel opère à charge optimale (45 kW / 22.5%).'
                : 'Alimentation réseau : L\'ensemble des auxiliaires et du confort sont desservis.'}
            </span>
          </div>

          {/* Chronometric Times of Transfer */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between">
              <span className="text-slate-400">Délai Temporisation Baisse V (ANSI 27)</span>
              <span className="font-bold text-white">1.5 s</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between">
              <span className="text-slate-400">Délai Démarrage Groupe Diesel</span>
              <span className="font-bold text-sky-400">12.0 s</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between">
              <span className="text-slate-400">Stabilisation Fréquence & Tension</span>
              <span className="font-bold text-emerald-400">&plusmn; 1% (Class G3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
