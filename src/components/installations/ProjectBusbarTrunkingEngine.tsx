// src/components/installations/ProjectBusbarTrunkingEngine.tsx
// EPEDE D06/D07 - Busbar Trunking Systems (Canalisations Préfabriquées / Canalis) & Rising Mains Engine
// Compliant with IEC 61439-6 (Busbar Trunking Systems), NF C 15-100 §523, NF EN 1366-3 (Fire Barriers EI 120)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Network, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Cpu, 
  Activity, 
  Flame, 
  Building, 
  Scale, 
  Clock, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

interface BusbarRatingPreset {
  ratingA: number;
  rMilliohmPerM: number;
  xMilliohmPerM: number;
  weightKgPerMCu: number;
  weightKgPerMAl: number;
  icwKa1s: number;
  ipkKa: number;
}

const BUSBAR_PRESETS: BusbarRatingPreset[] = [
  { ratingA: 400, rMilliohmPerM: 0.110, xMilliohmPerM: 0.042, weightKgPerMCu: 8.5, weightKgPerMAl: 4.8, icwKa1s: 20, ipkKa: 42 },
  { ratingA: 630, rMilliohmPerM: 0.075, xMilliohmPerM: 0.038, weightKgPerMCu: 12.0, weightKgPerMAl: 6.5, icwKa1s: 30, ipkKa: 63 },
  { ratingA: 800, rMilliohmPerM: 0.052, xMilliohmPerM: 0.032, weightKgPerMCu: 16.5, weightKgPerMAl: 8.8, icwKa1s: 40, ipkKa: 84 },
  { ratingA: 1000, rMilliohmPerM: 0.040, xMilliohmPerM: 0.026, weightKgPerMCu: 21.0, weightKgPerMAl: 11.2, icwKa1s: 50, ipkKa: 105 },
  { ratingA: 1600, rMilliohmPerM: 0.024, xMilliohmPerM: 0.018, weightKgPerMCu: 32.0, weightKgPerMAl: 16.5, icwKa1s: 65, ipkKa: 143 },
  { ratingA: 2000, rMilliohmPerM: 0.018, xMilliohmPerM: 0.014, weightKgPerMCu: 41.0, weightKgPerMAl: 21.0, icwKa1s: 80, ipkKa: 176 },
  { ratingA: 2500, rMilliohmPerM: 0.014, xMilliohmPerM: 0.012, weightKgPerMCu: 52.0, weightKgPerMAl: 26.5, icwKa1s: 100, ipkKa: 220 },
  { ratingA: 3200, rMilliohmPerM: 0.010, xMilliohmPerM: 0.010, weightKgPerMCu: 68.0, weightKgPerMAl: 34.0, icwKa1s: 100, ipkKa: 220 },
  { ratingA: 4000, rMilliohmPerM: 0.008, xMilliohmPerM: 0.009, weightKgPerMCu: 86.0, weightKgPerMAl: 43.0, icwKa1s: 120, ipkKa: 264 }
];

export const ProjectBusbarTrunkingEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Interactive States & Configuration
  // -------------------------------------------------------------------------
  // Busbar Trunking Application Scope: 'TGBT_TRANSFO_LINK' vs 'VERTICAL_RISING_MAIN'
  const [applicationScope, setApplicationScope] = useState<'TGBT_TRANSFO_LINK' | 'VERTICAL_RISING_MAIN'>('VERTICAL_RISING_MAIN');

  // Conductor Metallurgy: Copper (Cu) vs Bimetal Aluminum (Al)
  const [metallurgy, setMetallurgy] = useState<'COPPER' | 'ALUMINUM'>('ALUMINUM');

  // Total Length of Busbar Trunking (meters)
  const [totalLengthM, setTotalLengthM] = useState<number>(45);

  // Number of Storeys / Floors for Rising Main (if VERTICAL_RISING_MAIN)
  const [floorCount, setFloorCount] = useState<number>(6);

  // Tap-Off Unit Rating (A) per floor
  const [tapOffUnitRatingA, setTapOffUnitRatingA] = useState<number>(160);

  // Fire Barrier Requirement: EI 120 (NF EN 1366-3) through floor penetrations
  const [hasFirestopBarriers, setHasFirestopBarriers] = useState<boolean>(true);

  // Ambient Temperature (°C) for IEC 61439-6 Derating (35°C baseline standard)
  const [ambientTempC, setAmbientTempC] = useState<number>(35);

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);
  const designCurrentIbA = powerSummary.totalDesignCurrentIbA;

  // -------------------------------------------------------------------------
  // 2. Analytical Engine & Busbar Sizing
  // -------------------------------------------------------------------------
  const busbarAnalytics = useMemo(() => {
    // 1. Automatic selection of closest standard busbar rating >= Ib
    const matchedPreset = BUSBAR_PRESETS.find(p => p.ratingA >= designCurrentIbA) || BUSBAR_PRESETS[BUSBAR_PRESETS.length - 1];
    
    // Thermal derating for temperature: k_temp = 1.0 at 35°C, -0.5% per °C above 35°C
    const tempDeratingFactor = ambientTempC > 35 ? Math.max(0.80, 1.0 - (ambientTempC - 35) * 0.007) : 1.0;
    const deratedCurrentCapacityA = Math.round(matchedPreset.ratingA * tempDeratingFactor);
    const loadingRatioPercent = Math.round((designCurrentIbA / deratedCurrentCapacityA) * 100);

    // 2. Voltage Drop Calculation (IEC 61439-6):
    // Delta U (V) = sqrt(3) * I * L * (R * cosPhi + X * sinPhi)
    // For vertical rising main with distributed loads across floors, equivalent L_eff = L / 2
    const effectiveLengthM = applicationScope === 'VERTICAL_RISING_MAIN' ? totalLengthM / 2 : totalLengthM;
    const cosPhi = 0.85;
    const sinPhi = Math.sin(Math.acos(cosPhi));
    
    // Convert mOhm/m to Ohm/m
    const rPerM = (matchedPreset.rMilliohmPerM / 1000) * (metallurgy === 'ALUMINUM' ? 1.4 : 1.0);
    const xPerM = matchedPreset.xMilliohmPerM / 1000;
    
    const deltaUV = Math.sqrt(3) * designCurrentIbA * effectiveLengthM * (rPerM * cosPhi + xPerM * sinPhi);
    const deltaUPercent = Number(((deltaUV / 400) * 100).toFixed(2));
    const isVoltageDropCompliant = deltaUPercent <= 2.5;

    // 3. Weight & Comparison with Equivalent Cable Solution:
    // Cable equivalent: To carry matchedPreset.ratingA, e.g. 1000A requires 3 parallel 4x240 mm² Cu cables
    const busbarWeightKg = Math.round(totalLengthM * (metallurgy === 'COPPER' ? matchedPreset.weightKgPerMCu : matchedPreset.weightKgPerMAl));
    
    // Equivalent cable bundle weight and copper volume:
    const cableCoresPerPhase = Math.max(1, Math.ceil(matchedPreset.ratingA / 300));
    const cableWeightKgPerM = cableCoresPerPhase * 4 * 2.8; // ~2.8 kg/m for 240mm² Cu + insulation
    const totalCableWeightKg = Math.round(totalLengthM * cableWeightKgPerM);
    const weightSavingsPercent = Math.round(((totalCableWeightKg - busbarWeightKg) / totalCableWeightKg) * 100);

    // 4. Labor / Installation Time Estimation:
    // Canalis: ~0.4 hours/meter. Multi-conductor heavy cables + cable ladder pulling: ~1.2 hours/meter
    const busbarLaborHours = Math.round(totalLengthM * 0.4);
    const cableLaborHours = Math.round(totalLengthM * 1.2);
    const laborSavedHours = cableLaborHours - busbarLaborHours;

    // 5. Fire Barriers & Safety:
    const firestopCount = applicationScope === 'VERTICAL_RISING_MAIN' ? Math.max(1, floorCount - 1) : 1;

    return {
      matchedPreset,
      deratedCurrentCapacityA,
      loadingRatioPercent,
      effectiveLengthM,
      deltaUV: Number(deltaUV.toFixed(2)),
      deltaUPercent,
      isVoltageDropCompliant,
      busbarWeightKg,
      totalCableWeightKg,
      weightSavingsPercent,
      busbarLaborHours,
      cableLaborHours,
      laborSavedHours,
      firestopCount
    };
  }, [
    designCurrentIbA, 
    ambientTempC, 
    applicationScope, 
    totalLengthM, 
    metallurgy, 
    floorCount
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Canalisations Préfabriquées (Canalis) & Colonnes Montantes' : 'Busbar Trunking Systems & Rising Mains Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                IEC 61439-6 / NF C 15-100 §523
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Liaison forte puissance Transfo-TGBT, colonne montante d\'immeuble, gain de poids vs câbles et barrières coupe-feu EI 120.'
                : 'High-power trafo-to-TGBT link, multi-storey rising mains, cable weight comparison, and EI 120 certified firestop penetration.'}
            </p>
          </div>
        </div>

        {/* Selected Rating Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg border bg-slate-950 text-orange-400 border-orange-500/30 flex items-center gap-2 font-bold">
            <Zap className="w-4 h-4" />
            <span>
              {busbarAnalytics.matchedPreset.ratingA} A ({metallurgy === 'COPPER' ? 'Cuivre' : 'Aluminium Bimetal'})
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Calibre Assigné Canalis' : 'Rated Busbar Rating'}</span>
          <span className="text-lg font-black text-orange-400">{busbarAnalytics.matchedPreset.ratingA} A</span>
          <span className="text-[10px] text-slate-500 block">
            Ib = {Math.round(designCurrentIbA)} A ({busbarAnalytics.loadingRatioPercent}% {isFr ? 'charge' : 'load'})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Chute de Tension ΔU' : 'Voltage Drop ΔU'}</span>
          <span className={`text-lg font-black ${busbarAnalytics.isVoltageDropCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
            {busbarAnalytics.deltaUPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {busbarAnalytics.deltaUV} V (max ≤ 2.5%)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Gain de Poids vs Câbles' : 'Weight Savings vs Cables'}</span>
          <span className="text-lg font-black text-cyan-400">-{busbarAnalytics.weightSavingsPercent}%</span>
          <span className="text-[10px] text-slate-500 block">
            {busbarAnalytics.busbarWeightKg} kg vs {busbarAnalytics.totalCableWeightKg} kg
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Temps de Pose Économisé' : 'Saved Installation Time'}</span>
          <span className="text-lg font-black text-emerald-400">-{busbarAnalytics.laborSavedHours} h</span>
          <span className="text-[10px] text-slate-500 block">
            {busbarAnalytics.busbarLaborHours}h vs {busbarAnalytics.cableLaborHours}h ({isFr ? 'pose rapide' : 'fast assembly'})
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Scope, Metallurgy & Dimensions)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-orange-400" />
          {isFr ? 'Configuration du Système de Canalisation Préfabriquée' : 'Busbar Trunking Configuration & Geometry'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Application Scope */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Application Principale :' : 'Main Application:'}</span>
            <select
              value={applicationScope}
              onChange={(e) => setApplicationScope(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="VERTICAL_RISING_MAIN">{isFr ? 'Colonne Montante d\'Étage (Tertiaire)' : 'Vertical Rising Main'}</option>
              <option value="TGBT_TRANSFO_LINK">{isFr ? 'Liaison Transfo → TGBT Forte Puissance' : 'Trafo to TGBT High Power Link'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {applicationScope === 'VERTICAL_RISING_MAIN' 
                ? (isFr ? 'Coffrets de dérivation embrochables' : 'Plug-in floor tap-off boxes')
                : (isFr ? 'Liaison directe continue sans dérivation' : 'Continuous feeder link')}
            </span>
          </div>

          {/* Metallurgy */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Conducteur Métallurgique :' : 'Conductor Metallurgy:'}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setMetallurgy('ALUMINUM')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  metallurgy === 'ALUMINUM' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Aluminium Bimetal
              </button>
              <button
                onClick={() => setMetallurgy('COPPER')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  metallurgy === 'COPPER' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Cuivre Pur
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {metallurgy === 'ALUMINUM' ? (isFr ? 'Plus léger de 50%, économique' : '50% lighter, cost-effective') : (isFr ? 'Encombrement ultra-réduit' : 'Ultra-compact envelope')}
            </span>
          </div>

          {/* Length */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Longueur Totale :' : 'Total Length:'}</span>
              <strong className="text-orange-400">{totalLengthM} m</strong>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={totalLengthM}
              onChange={(e) => setTotalLengthM(Number(e.target.value))}
              className="w-full accent-orange-400"
            />
            <span className="text-[10px] text-slate-500 block">Tracé continu en gaine technique</span>
          </div>

          {/* Floors & Firestop */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Nombre d\'Étages :' : 'Number of Storeys:'}</span>
              <strong className="text-white">{floorCount} {isFr ? 'niveaux' : 'floors'}</strong>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={floorCount}
              onChange={(e) => setFloorCount(Number(e.target.value))}
              className="w-full accent-white"
            />
            <span className="text-[10px] text-emerald-400 block">
              {busbarAnalytics.firestopCount} {isFr ? 'barrières coupe-feu EI 120' : 'firestop penetration barriers'}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Visual Multi-Storey Rising Main Schematic                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Schéma Synoptique de la Colonne Montante d\'Immeuble' : 'Multi-Storey Busbar Rising Main Layout'}
        </h4>

        {/* Floor-by-Floor Visual Diagram */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
          {Array.from({ length: Math.min(6, floorCount) }).map((_, idx) => {
            const currentFloorNum = Math.min(6, floorCount) - idx;
            return (
              <div key={currentFloorNum} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                {/* Floor Level Label */}
                <div className="w-16 font-bold text-slate-300">
                  {currentFloorNum === 1 ? 'RDC' : `R+${currentFloorNum - 1}`}
                </div>

                {/* Central Busbar Segment */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 w-3 rounded bg-orange-500 shadow-md flex items-center justify-center text-[8px] font-black text-black">
                    ||
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-orange-500/50 flex items-center justify-between px-3">
                    <span className="text-[10px] text-slate-400">
                      {isFr ? 'Boîte de dérivation débrochable' : 'Plug-in tap-off unit'} ({tapOffUnitRatingA} A)
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 font-bold">
                      {isFr ? 'Tableau Divisionnaire Étage' : 'Floor Distribution Board'}
                    </span>
                  </div>
                </div>

                {/* Fire Barrier Icon */}
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  EI 120 (2h)
                </div>
              </div>
            );
          })}
          {floorCount > 6 && (
            <div className="text-center text-[10px] text-slate-500 pt-1">
              ... +{floorCount - 6} {isFr ? 'étages supplémentaires identiques' : 'additional identical storeys'}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Direct Comparison: Busbar Trunking vs Cable Bundle              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Analyse Comparative : Gaine Canalis vs Faisceaux de Câbles' : 'Technical & Environmental Benchmark: Busbar vs. Cables'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '1. Encombrement & Poids :' : '1. Footprint & Mass:'}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr
                ? `La canalisation préfabriquée (${busbarAnalytics.busbarWeightKg} kg) allège la charge sur les planchers de ${busbarAnalytics.weightSavingsPercent}% par rapport à un chemin de câbles chargé (${busbarAnalytics.totalCableWeightKg} kg), tout en divisant l'encombrement par 3.`
                : `Compact sandwich busbar (${busbarAnalytics.busbarWeightKg} kg) relieves structural floor load by ${busbarAnalytics.weightSavingsPercent}% compared to multi-cable ladders (${busbarAnalytics.totalCableWeightKg} kg).`}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '2. Sécurité Incendie & Sans Halogène :' : '2. Fire Safety & Zero Halogen:'}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr
                ? 'L\'enveloppe 100% métallique supprime tout potentiel calorifique combustible (absence d\'isolant plastique PVC inflammable). Les traversées de planchers sont sécurisées par un kit coupe-feu certifié EI 120.'
                : 'All-metal aluminum casing presents zero fire load and emits zero halogen gases. Floor penetrations are sealed with certified 2-hour EI 120 firestop collars.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '3. Évolutivité & Flexibilité Tertiaire :' : '3. Modularity & Live Upgrades:'}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr
                ? 'Permet d\'ajouter, de déplacer ou de modifier le calibre d\'une dérivation d\'étage directement sous tension, sans devoir couper l\'alimentation des autres étages ni tirer de nouveaux câbles dans la colonne.'
                : 'Plug-in tap-off boxes can be added or uprated live without de-energizing other floors, avoiding building outages and rewiring.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
