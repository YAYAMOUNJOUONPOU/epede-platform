// src/components/installations/ProjectGeneratorSheddingEngine.tsx
// EPEDE D06/D07 - Standby Generator & Priority Load Shedding Engine
// Compliant with ISO 8528-5 (G1/G2/G3 classes), NF S 61-932 (Safety/SSI), and NF C 15-100 §551

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Zap, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  TrendingDown, 
  Clock, 
  Fuel, 
  Activity, 
  Layers, 
  ArrowRight,
  Flame,
  Building,
  Server,
  Car
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectGeneratorSheddingEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Generator Parameters
  // -------------------------------------------------------------------------
  // Standby Genset Rating (kVA)
  const [gensetRatingKva, setGensetRatingKva] = useState<number>(
    project.backupSupplyContext.generatorRatingKva || 400
  );

  // Alternator Subtransient Reactance X''d (typically 12% to 18%)
  const [subtransientXdPercent, setSubtransientXdPercent] = useState<number>(15);

  // Maximum Direct-On-Line (DOL) Motor Inrush to start on Genset (kW)
  const [largestMotorKw, setLargestMotorKw] = useState<number>(45);

  // Fuel Autonomy Target (hours)
  const [fuelAutonomyHours, setFuelAutonomyHours] = useState<number>(24);

  // Load Shedding Active Toggle
  const [sheddingEnabled, setSheddingEnabled] = useState<boolean>(true);

  // ATS Live Simulation Step ('MAINS_HEALTHY' | 'MAINS_LOST' | 'GENSET_RUNNING' | 'MAINS_RESTORED')
  const [simulatedAtsState, setSimulatedAtsState] = useState<'MAINS_HEALTHY' | 'MAINS_LOST' | 'GENSET_RUNNING'>('MAINS_HEALTHY');

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);
  const totalBuildingPeakKw = powerSummary.demandActivePowerKw;
  const essentialLoadsKw = powerSummary.criticalityBreakdown.essentialKw;
  const emergencyLifeSafetyKw = powerSummary.criticalityBreakdown.emergencyKw;
  const criticalUpsKw = powerSummary.criticalityBreakdown.criticalUpsKw;
  const normalSheddableKw = powerSummary.criticalityBreakdown.normalKw;

  // -------------------------------------------------------------------------
  // 2. Load Shedding & Transient Alternator Sizing Analytics
  // -------------------------------------------------------------------------
  const analytics = useMemo(() => {
    // Tier 1: Life Safety & Emergency (Non-sheddable under any condition)
    const tier1SafetyKw = emergencyLifeSafetyKw + criticalUpsKw;

    // Tier 2: Essential Operations (IT, refrigeration, emergency lifts)
    const tier2EssentialKw = essentialLoadsKw;

    // Tier 3: Sheddable Comfort Loads (HVAC, EV chargers, general lighting)
    const tier3SheddableKw = normalSheddableKw;

    // Unconstrained demand if no shedding occurs on genset
    const unconstrainedGensetKw = totalBuildingPeakKw;

    // Controlled demand with hierarchical shedding:
    // When shedding is active, Tier 3 is shed immediately, only Tier 1 & 2 remain
    const controlledGensetKw = sheddingEnabled ? (tier1SafetyKw + tier2EssentialKw) : unconstrainedGensetKw;
    const controlledGensetKva = controlledGensetKw / 0.8; // Standby genset rated at 0.8 PF

    // Genset loading percentage
    const gensetLoadingPercent = Math.round((controlledGensetKva / gensetRatingKva) * 100);
    const isGensetOverloaded = gensetLoadingPercent > 100;

    // Minimum load constraint (avoid wet-stacking / encrassement moteur diesel):
    // Diesel engines must maintain ≥ 30% load during continuous operation
    const isUnderloaded = gensetLoadingPercent < 30;

    // Transient Voltage Dip (ΔU_dip) during largest motor DOL start on Genset:
    // Starting kVA for DOL motor: ~ 6x rated kVA (with cos phi_start ≈ 0.4)
    const motorStartKva = (largestMotorKw / 0.85) * 6.0;
    // Transient voltage dip formula per ISO 8528-5:
    const voltageDipPercent = Number(((motorStartKva / (gensetRatingKva + motorStartKva * (1 / (subtransientXdPercent / 100) - 1))) * 100).toFixed(1));
    const isVoltageDipAcceptable = voltageDipPercent <= 20.0; // ISO 8528-5 Class G2 limit is 20%

    // Fuel Consumption & Tank Sizing:
    // Average specific consumption: ~ 0.24 Liters / kWh at 75% load
    const hourlyFuelConsumptionLiters = Number(((controlledGensetKw * 0.24)).toFixed(1));
    const totalFuelRequiredLiters = Math.round(hourlyFuelConsumptionLiters * fuelAutonomyHours);

    return {
      tier1SafetyKw,
      tier2EssentialKw,
      tier3SheddableKw,
      unconstrainedGensetKw,
      controlledGensetKw,
      controlledGensetKva: Math.round(controlledGensetKva),
      gensetLoadingPercent,
      isGensetOverloaded,
      isUnderloaded,
      motorStartKva: Math.round(motorStartKva),
      voltageDipPercent,
      isVoltageDipAcceptable,
      hourlyFuelConsumptionLiters,
      totalFuelRequiredLiters
    };
  }, [
    emergencyLifeSafetyKw, 
    criticalUpsKw, 
    essentialLoadsKw, 
    normalSheddableKw, 
    totalBuildingPeakKw, 
    sheddingEnabled, 
    gensetRatingKva, 
    largestMotorKw, 
    subtransientXdPercent, 
    fuelAutonomyHours
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Groupe Électrogène & Délestage Prioritaire' : 'Standby Generator & Priority Load Shedding Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                ISO 8528-5 (G2/G3) / NF S 61-932 / NF C 15-100 §551
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Dimensionnement dynamique de l\'alternateur, creux de tension transitoire au démarrage moteur, automatisme Normal/Secours et délestage hiérarchisé.'
                : 'Dynamic alternator sizing, motor starting voltage dip, ATS transition sequencing, and 3-tier priority load shedding.'}
            </p>
          </div>
        </div>

        {/* Shedding Status Toggle Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setSheddingEnabled(!sheddingEnabled)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold transition ${
              sheddingEnabled
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFr ? 'Délestage Auto :' : 'Auto Shedding:'} {sheddingEnabled ? (isFr ? 'ACTIF (Tier 3 coupé)' : 'ACTIVE (Tier 3 shed)') : (isFr ? 'INACTIF (Surcharge)' : 'OFF (Uncontrolled)')}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top KPI Sizing Metrics                                           */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Puissance Assignée Groupe' : 'Standby Genset Rating'}</span>
          <span className="text-lg font-black text-amber-400">{gensetRatingKva} kVA</span>
          <span className="text-[10px] text-slate-500 block">{Math.round(gensetRatingKva * 0.8)} kW (cos φ = 0.8)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Taux de Charge Groupe' : 'Genset Loading Rate'}</span>
          <span className={`text-lg font-black ${
            analytics.isGensetOverloaded 
              ? 'text-rose-400' 
              : analytics.isUnderloaded 
              ? 'text-amber-400' 
              : 'text-emerald-400'
          }`}>
            {analytics.gensetLoadingPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {analytics.controlledGensetKw} kW / {Math.round(gensetRatingKva * 0.8)} kW {isFr ? 'max' : 'cap'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Creux de Tension Démarrage' : 'Motor Start Voltage Dip'}</span>
          <span className={`text-lg font-black ${analytics.isVoltageDipAcceptable ? 'text-cyan-400' : 'text-rose-400'}`}>
            ΔU = {analytics.voltageDipPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? 'Max 20% admissible (G2)' : 'Max 20% limit (G2)'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Autonomie Cuve Fioul' : 'Fuel Tank Sizing'}</span>
          <span className="text-lg font-black text-white">{analytics.totalFuelRequiredLiters} L</span>
          <span className="text-[10px] text-slate-500 block">
            ~{analytics.hourlyFuelConsumptionLiters} L/h ({fuelAutonomyHours}h {isFr ? 'sécurité' : 'target'})
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Sliders & Sizing Controls                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Taille Groupe (kVA) :' : 'Genset Size (kVA):'}</span>
              <strong className="text-amber-400">{gensetRatingKva} kVA</strong>
            </div>
            <input
              type="range"
              min="100"
              max="1250"
              step="50"
              value={gensetRatingKva}
              onChange={(e) => setGensetRatingKva(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Réactance X\'\'d :' : 'Subtransient X\'\'d:'}</span>
              <strong className="text-cyan-400">{subtransientXdPercent}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="22"
              step="1"
              value={subtransientXdPercent}
              onChange={(e) => setSubtransientXdPercent(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">Classe G2 standard (12-16%)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Plus Gros Moteur DOL :' : 'Largest Motor DOL:'}</span>
              <strong className="text-emerald-400">{largestMotorKw} kW</strong>
            </div>
            <input
              type="range"
              min="15"
              max="132"
              step="5"
              value={largestMotorKw}
              onChange={(e) => setLargestMotorKw(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <span className="text-[10px] text-slate-500 block">Appel ~{analytics.motorStartKva} kVA</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Autonomie Cuve (h) :' : 'Fuel Storage (h):'}</span>
              <strong className="text-white">{fuelAutonomyHours} h</strong>
            </div>
            <input
              type="range"
              min="12"
              max="72"
              step="6"
              value={fuelAutonomyHours}
              onChange={(e) => setFuelAutonomyHours(Number(e.target.value))}
              className="w-full accent-white"
            />
            <span className="text-[10px] text-slate-500 block">Norme ERP : 24h à 48h</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Automated 3-Tier Priority Load Shedding Hierarchy                */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Matrice de Délestage Hiérarchisé par Niveaux de Priorité' : '3-Tier Hierarchical Load Shedding Matrix'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Tier 1: Life Safety */}
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Flame className="w-4 h-4" />
                <span>Tier 1 : Sécurité Incendie (SSI)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                INDÉLESTAGE
              </span>
            </div>
            <div className="text-2xl font-black text-white">{analytics.tier1SafetyKw} kW</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Pompes sprinklers, désenfumage, éclairage de sécurité et blocs opératoires. Alimentation prioritaire garantie.
            </p>
          </div>

          {/* Tier 2: Essential Process */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Server className="w-4 h-4" />
                <span>Tier 2 : Process Essentiels</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                SECOURU TEMPO
              </span>
            </div>
            <div className="text-2xl font-black text-white">{analytics.tier2EssentialKw} kW</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Serveurs informatiques, chaîne du froid, ascenseurs prioritaires (rapatriement niveau RDC).
            </p>
          </div>

          {/* Tier 3: Comfort / Sheddable */}
          <div className={`p-4 rounded-xl border space-y-3 transition ${
            sheddingEnabled 
              ? 'bg-slate-950/60 border-slate-800 opacity-60' 
              : 'bg-slate-950 border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Building className="w-4 h-4" />
                <span>Tier 3 : Charges de Confort</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                sheddingEnabled ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {sheddingEnabled ? 'DÉLESTÉ (COUPÉ)' : 'ALIMENTÉ'}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{analytics.tier3SheddableKw} kW</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Production froid CVC de confort, bornes de recharge IRVE, chauffage électrique direct et éclairage général.
            </p>
          </div>
        </div>

        {/* Warning if shedding is disabled and genset overloaded */}
        {!sheddingEnabled && analytics.isGensetOverloaded && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p>
              {isFr
                ? `SURCHARGE DU GROUPE ÉLECTROGÈNE : Sans délestage automatique, la demande simultanée (${analytics.unconstrainedGensetKw} kW) dépasse la puissance du groupe (${Math.round(gensetRatingKva * 0.8)} kW). L'alternateur subira un écroulement de fréquence et de tension entraînant le calage du moteur diesel. Activez le délestage automatique pour préserver les récepteurs de sécurité.`
                : `GENSET OVERLOAD: Without priority load shedding, unconstrained demand (${analytics.unconstrainedGensetKw} kW) exceeds genset capacity (${Math.round(gensetRatingKva * 0.8)} kW), causing engine stall. Enable automated shedding to maintain life-safety power.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Automatic Transfer Switch (ATS) Chronogram Sequence              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Chronogramme de Commutation Automatique Normal / Secours (ATS)' : 'Automatic Transfer Switch (ATS) Sequencing Chronogram'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">1. Détection Perte Réseau</span>
            <div className="text-slate-300">Temporisation : <strong>T1 = 1.5 s</strong></div>
            <p className="text-slate-500 text-[10px] font-sans">
              Évite les démarrages intempestifs sur micro-coupures transitoires du réseau Enedis.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. Lancement & Montée Vitesse</span>
            <div className="text-slate-300">Temporisation : <strong>T2 = 8 à 10 s</strong></div>
            <p className="text-slate-500 text-[10px] font-sans">
              Ordre de démarrage démarreur électrique, stabilisation fréquence (50Hz) et tension (400V).
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block">3. Permutation Inverseur</span>
            <div className="text-slate-300">Temporisation : <strong>T3 = 0.5 s</strong></div>
            <p className="text-slate-500 text-[10px] font-sans">
              Ouverture disjoncteur Normal, verrouillage mécanique strict, fermeture disjoncteur Secours.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-bold block">4. Retour Réseau & Refroidissement</span>
            <div className="text-slate-300">Temporisation : <strong>T4 = 180 s</strong></div>
            <p className="text-slate-500 text-[10px] font-sans">
              Vérification stabilité du réseau public rétabli, bascule retour, puis cycle à vide de refroidissement moteur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
