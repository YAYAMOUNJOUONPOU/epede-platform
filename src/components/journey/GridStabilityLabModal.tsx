// src/components/journey/GridStabilityLabModal.tsx
import React, { useState } from 'react';
import { 
  Activity, 
  X, 
  Sliders, 
  Zap, 
  Compass, 
  RefreshCw, 
  Users, 
  Sun, 
  Moon, 
  Sunset 
} from 'lucide-react';

interface GridStabilityLabModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

type TimeOfDay = 'night' | 'morning' | 'day' | 'evening';

export const GridStabilityLabModal: React.FC<GridStabilityLabModalProps> = ({
  locale,
  isOpen,
  onClose,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('evening');
  const [deltaLoadKw, setDeltaLoadKw] = useState<number>(0);
  const [isCapacitorOn, setIsCapacitorOn] = useState<boolean>(false);

  if (!isOpen) return null;

  // Base loads according to time of day
  const baseLoads: Record<TimeOfDay, number> = {
    night: 24,
    morning: 68,
    day: 55,
    evening: 110,
  };

  const currentTotalLoadKw = Math.max(10, baseLoads[timeOfDay] + deltaLoadKw);

  // Frequency response:
  // Baseline load is 60 kW. If load increases, frequency drops slightly until governor opens turbine guide vanes.
  const nominalLoad = 60;
  const loadDeficit = currentTotalLoadKw - nominalLoad;
  // Dynamic frequency in Hz (target 50.00 Hz)
  const frequencyHz = +(50.00 - (loadDeficit * 0.0035)).toFixed(2);
  
  // Turbine governor opening %
  const governorOpeningPct = Math.min(100, Math.max(15, Math.round((currentTotalLoadKw / 140) * 100)));

  // Voltage response (nominal 230V):
  // Reactive drop compensated if capacitor is ON
  const baseVoltage = 230.0;
  const vDrop = (currentTotalLoadKw * 0.06);
  const capBoost = isCapacitorOn ? 4.5 : 0;
  const voltageV = +(baseVoltage - vDrop + capBoost).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'LABORATOIRE DE STABILITÉ DU RÉSEAU' : 'GRID STABILITY LABORATORY'}</span>
                <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold">
                  P-f & Q-V BALANCE
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Comment le réseau reste stable quand 100 habitants allument ou éteignent leurs appareils' 
                  : 'How the grid balances frequency and voltage across a 100-consumer community'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Dual Balance Core Concept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Power & Frequency */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-bold uppercase">1. ÉQUILIBRE P ↔ f (ACTIF)</span>
                <span className="text-[10px] text-slate-500 font-medium">50.00 Hz Cible</span>
              </div>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'La production doit égaler la consommation à chaque milliseconde. Si la charge augmente, les alternateurs ralentissent (f chute). Le régulateur de vitesse ouvre immédiatement les vannes d\'eau du barrage pour réaccélérer.'
                  : 'Generation must equal consumption at every millisecond. When demand surges, generator rotors decelerate (f drops). The speed governor opens turbine wicket gates to restore 50 Hz.'}
              </p>
            </div>

            {/* Reactive Power & Voltage */}
            <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-cyan-800 font-bold uppercase">2. ÉQUILIBRE Q ↔ V (RÉACTIF)</span>
                <span className="text-[10px] text-slate-500 font-medium">230 V ± 10%</span>
              </div>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {locale === 'fr'
                  ? 'La tension locale dépend du flux d\'énergie réactive (Q). Le régulateur de tension (AVR) excite le rotor de l\'alternateur et les batteries de condensateurs compensent les charges inductives.'
                  : 'Local voltage magnitude depends on reactive power flow (Q). The Automatic Voltage Regulator (AVR) adjusts rotor excitation current, while shunt capacitor banks counteract inductive line drops.'}
              </p>
            </div>
          </div>

          {/* Time-of-Day Community Scenario Controls */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-600" />
                <span>{locale === 'fr' ? 'PROFIL JOURNALIER DE LA COMMUNAUTÉ (100 HABITANTS)' : '100-PERSON COMMUNITY DAILY PROFILE'}</span>
              </span>
              <span className="text-xs text-cyan-700 font-bold">
                {currentTotalLoadKw} kW appelés
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setTimeOfDay('night'); setDeltaLoadKw(0); }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs ${
                  timeOfDay === 'night' 
                    ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold ring-2 ring-sky-400/30' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Moon className="h-4 w-4 text-sky-600" />
                <div className="text-left">
                  <div className="font-bold text-xs">{locale === 'fr' ? 'Nuit (03h00)' : 'Night (03:00)'}</div>
                  <div className="text-[10px] text-slate-500">24 kW (Sommeil)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setTimeOfDay('morning'); setDeltaLoadKw(0); }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs ${
                  timeOfDay === 'morning' 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-2 ring-amber-400/30' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-600" />
                <div className="text-left">
                  <div className="font-bold text-xs">{locale === 'fr' ? 'Matin (07h30)' : 'Morning (07:30)'}</div>
                  <div className="text-[10px] text-slate-500">68 kW (Réveils)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setTimeOfDay('day'); setDeltaLoadKw(0); }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs ${
                  timeOfDay === 'day' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-2 ring-emerald-400/30' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sun className="h-4 w-4 text-emerald-600" />
                <div className="text-left">
                  <div className="font-bold text-xs">{locale === 'fr' ? 'Journée (14h00)' : 'Day (14:00)'}</div>
                  <div className="text-[10px] text-slate-500">55 kW (Activités)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setTimeOfDay('evening'); setDeltaLoadKw(0); }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs ${
                  timeOfDay === 'evening' 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold ring-2 ring-rose-400/30' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sunset className="h-4 w-4 text-rose-600" />
                <div className="text-left">
                  <div className="font-bold text-xs">{locale === 'fr' ? 'Pointe Soir (20h30)' : 'Evening (20:30)'}</div>
                  <div className="text-[10px] text-slate-500">110 kW (Cuisines)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Injections */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-slate-800 font-bold block">
              {locale === 'fr' ? 'PERTURBATIONS IMMÉDIATES SUR LE RÉSEAU :' : 'INSTANTANEOUS LOAD PERTURBATIONS :'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDeltaLoadKw((prev) => prev + 5)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs"
              >
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <span>+5 kW (Allumer 50 lampes LED)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeltaLoadKw((prev) => prev + 25)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs"
              >
                <Zap className="h-3.5 w-3.5 text-rose-600" />
                <span>+25 kW (Démarrer pompage municipal)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeltaLoadKw((prev) => Math.max(-baseLoads[timeOfDay] + 10, prev - 15))}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-sky-800 border border-sky-200 flex items-center gap-1.5 shadow-2xs"
              >
                <span>-15 kW (Arrêt chauffe-eau)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCapacitorOn(!isCapacitorOn)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors shadow-2xs ${
                  isCapacitorOn 
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-emerald-800 border-emerald-200'
                }`}
              >
                <span>{isCapacitorOn ? 'CONDENSATEURS ACTIFS (+4.5V)' : 'ENCLENCHER GRADIN CONDENSATEURS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeltaLoadKw(0)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 border border-slate-200 shadow-2xs"
                title="Remise à zéro perturbation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Live Dynamic Telemetry Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Frequency Gauge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block mb-1 font-medium">FRÉQUENCE RÉSEAU (P-f)</span>
              <span className={`text-2xl font-black ${
                Math.abs(frequencyHz - 50.00) > 0.15 ? 'text-rose-600' : 'text-emerald-700'
              }`}>
                {frequencyHz} Hz
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {frequencyHz === 50.00 ? 'Équilibre parfait' : frequencyHz < 50.00 ? 'Régulateur accélère l\'eau' : 'Régulateur ferme l\'eau'}
              </span>
            </div>

            {/* Voltage Gauge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block mb-1 font-medium">TENSION TERMINALE (Q-V)</span>
              <span className={`text-2xl font-black ${
                voltageV < 220 || voltageV > 240 ? 'text-amber-700' : 'text-cyan-700'
              }`}>
                {voltageV} V
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {isCapacitorOn ? 'Compensation Q active' : 'Chute en ligne naturelle'}
              </span>
            </div>

            {/* Turbine Opening */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block mb-1 font-medium">OUVERTURE DISTRIBUTEUR TURBINE</span>
              <span className="text-2xl font-black text-amber-700">
                {governorOpeningPct} %
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Débit d'eau Francis asservi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
