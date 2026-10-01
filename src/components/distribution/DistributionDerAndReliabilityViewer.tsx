// src/components/distribution/DistributionDerAndReliabilityViewer.tsx
// EPEDE D05 - DER Hosting Capacity, Reverse Flow & IEEE 1366 Reliability Indices

import React, { useState } from 'react';
import {
  Sun,
  BatteryCharging,
  TrendingUp,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Info,
  Layers
} from 'lucide-react';

interface DistributionDerAndReliabilityViewerProps {
  locale: 'fr' | 'en';
}

export const DistributionDerAndReliabilityViewer: React.FC<DistributionDerAndReliabilityViewerProps> = ({
  locale
}) => {
  const [pvInjectionMw, setPvInjectionMw] = useState<number>(3.5); // MW
  const [cableUndergroundRatio, setCableUndergroundRatio] = useState<number>(50); // %
  const [hasFlisrAutomation, setHasFlisrAutomation] = useState<boolean>(true);

  // Approximate SAIDI / SAIFI estimation based on parameters
  // Base overhead feeder: 180 min SAIDI, 3.5 SAIFI
  // 100% underground: 25 min SAIDI, 0.8 SAIFI
  // FLISR reduces outage duration by 60%
  const baseSaidi = 180 - (180 - 30) * (cableUndergroundRatio / 100);
  const calculatedSaidi = Math.round(hasFlisrAutomation ? baseSaidi * 0.45 : baseSaidi);
  const calculatedSaifi = Number((3.5 - (3.5 - 0.7) * (cableUndergroundRatio / 100)).toFixed(2));
  const calculatedCaidi = calculatedSaifi > 0 ? Math.round(calculatedSaidi / calculatedSaifi) : 0;

  // Voltage rise calculation along the feeder endpoint: ΔU ≈ (P * R + Q * X) / U
  // With R = 0.35 Ω/km for 15 km, P = pvInjectionMw, U = 30 kV
  const deltaUPercent = Number(((pvInjectionMw * 1000 * 0.35 * 12) / (30000 * 30000) * 100).toFixed(2));

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {locale === 'fr'
              ? 'INTÉGRATION DER, FLUX INVERSES & FIABILITÉ (IEEE 1366)'
              : 'DER INTEGRATION, REVERSE FLOW & IEEE 1366 RELIABILITY'}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Capacité d\'accueil photovoltaïque, élévation de tension & Indicateurs SAIDI / SAIFI'
              : 'Solar PV hosting capacity, feeder voltage rise & SAIDI / SAIFI reliability benchmarks'}
          </p>
        </div>
      </div>

      {/* 2. Interactive DER Injection & Voltage Rise Simulator */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#1C2533]">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? 'Simulation d\'Injection Photovoltaïque & Refoulement'
                : 'Solar PV Generation & Reverse Power Flow'}
            </h4>
          </div>
          <span className="text-xs text-amber-300 font-bold">
            {pvInjectionMw} MWc injectés sur l\'artère 30 kV
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{locale === 'fr' ? 'Puissance PV Décentralisée :' : 'Decentralized PV Capacity:'}</span>
                <span className="font-bold text-amber-400">{pvInjectionMw} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={pvInjectionMw}
                onChange={(e) => setPvInjectionMw(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 MW</span>
                <span>4 MW (Équilibre)</span>
                <span>8 MW (Refoulement massif)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? 'Lorsque la production locale excède la consommation des foyers raccordés, le flux de puissance s\'inverse vers le poste source amont. Cela provoque une élévation de tension $\\Delta U \\approx (P \\cdot R - Q \\cdot X) / U_n$.'
                : 'When local PV production exceeds connected customer load, power flows in reverse toward the primary substation. This produces an endpoint voltage rise $\\Delta U \\approx (P \\cdot R - Q \\cdot X) / U_n$.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {locale === 'fr' ? 'Élévation de Tension en Bout de Ligne :' : 'Feeder Endpoint Voltage Rise:'}
              </span>
              <span
                className={`text-sm font-black ${
                  deltaUPercent > 5.0 ? 'text-rose-400' : deltaUPercent > 3.0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                +{deltaUPercent}% ({(30 * (1 + deltaUPercent / 100)).toFixed(2)} kV)
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-sans space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Régulation autonome $Q(U)$ des onduleurs requise (absorption de réactif).</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Protection anti-îlotage active ANSI 81O/81U/ROCOF pour sécurité des agents.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. IEEE 1366 Reliability Indices Benchmark Dashboard */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#1C2533]">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>
              {locale === 'fr'
                ? 'Indicateurs de Qualité & Continuité de Service (IEEE Std 1366)'
                : 'Service Quality & Reliability Benchmark (IEEE Std 1366)'}
            </span>
          </h4>
        </div>

        {/* Sliders for Network Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>{locale === 'fr' ? 'Taux d\'Enfouissement Câble Souterrain :' : 'Underground Cable Share:'}</span>
              <span className="font-bold text-amber-400">{cableUndergroundRatio}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={cableUndergroundRatio}
              onChange={(e) => setCableUndergroundRatio(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-[#1E2738]">
            <span className="text-xs text-slate-300 font-bold">
              {locale === 'fr' ? 'Automatisme de Boucle FLISR / SCADA :' : 'FLISR Automated Loop Restoration:'}
            </span>
            <button
              type="button"
              onClick={() => setHasFlisrAutomation(!hasFlisrAutomation)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                hasFlisrAutomation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {hasFlisrAutomation ? 'ACTIVÉ (-55% SAIDI)' : 'DÉSACTIVÉ'}
            </button>
          </div>
        </div>

        {/* The 3 Indices Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* SAIDI */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              SAIDI (Durée Moyenne de Coupure)
            </div>
            <div className="text-2xl font-black text-amber-400">
              {calculatedSaidi} <span className="text-xs text-slate-400 font-normal">min / client / an</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans pt-1">
              {locale === 'fr'
                ? 'Somme des durées de coupures pondérées par le nombre de clients divisée par le nombre total d\'abonnés.'
                : 'Total customer interruption duration divided by the total number of connected customers.'}
            </p>
          </div>

          {/* SAIFI */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              SAIFI (Fréquence Moyenne de Coupure)
            </div>
            <div className="text-2xl font-black text-sky-400">
              {calculatedSaifi} <span className="text-xs text-slate-400 font-normal">coupures / client / an</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans pt-1">
              {locale === 'fr'
                ? 'Nombre moyen d\'interruptions longues subies par un usager sur une année civile.'
                : 'Average number of sustained interruptions an average customer experiences per year.'}
            </p>
          </div>

          {/* CAIDI */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              CAIDI (Durée par Incident)
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {calculatedCaidi} <span className="text-xs text-slate-400 font-normal">min / incident</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans pt-1">
              {locale === 'fr'
                ? 'Temps moyen nécessaire pour restaurer le courant chez un client privé d\'électricité ($SAIDI / SAIFI$).'
                : 'Average restoration time required to restore supply to an interrupted customer ($SAIDI / SAIFI$).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
