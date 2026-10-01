// src/components/installations/ProjectMotorStartingVfdEngine.tsx
// EPEDE D06/D07 - Motor Starting, Protection & Variable Frequency Drive (VFD) Engine
// Compliant with IEC 60947-4-1 (Motor Starters & Contactors), NF C 15-100 §558, and NF S 61-932 (Smoke Extraction Safety Overrides)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Activity, 
  Flame, 
  ArrowRight, 
  TrendingDown, 
  Gauge, 
  Wind, 
  Info,
  RotateCw
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export type MotorStarterMethod = 'DOL_DIRECT' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD_VARIATEUR';
export type CoordinationType = 'TYPE_1' | 'TYPE_2';

export const ProjectMotorStartingVfdEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Interactive States & Controls
  // -------------------------------------------------------------------------
  // Motor rated shaft power (kW)
  const [motorPowerKw, setMotorPowerKw] = useState<number>(45);

  // Motor nominal efficiency (IE3 standard ~ 94.2%)
  const [motorEfficiencyPercent, setMotorEfficiencyPercent] = useState<number>(94);

  // Motor nominal cos phi (default 0.86)
  const [nominalCosPhi, setNominalCosPhi] = useState<number>(0.86);

  // Selected Starting Method
  const [starterMethod, setStarterMethod] = useState<MotorStarterMethod>('SOFT_STARTER');

  // Coordination type per IEC 60947-4-1
  const [coordinationType, setCoordinationType] = useState<CoordinationType>('TYPE_2');

  // Smoke extraction emergency mode (Désenfumage ERP - thermal trip inhibit)
  const [isSmokeExtractionMode, setIsSmokeExtractionMode] = useState<boolean>(false);

  // Cable length from starter panel to motor (m)
  const [cableLengthM, setCableLengthM] = useState<number>(40);

  // Prospective Short-Circuit Current at motor starter panel (kA)
  const [prospectiveIccKa, setProspectiveIccKa] = useState<number>(25);

  // -------------------------------------------------------------------------
  // 2. Analytical Calculations per IEC 60947-4-1
  // -------------------------------------------------------------------------
  const motorAnalytics = useMemo(() => {
    // 1. Full-load nominal current (In):
    // In = (P_kw * 1000) / (sqrt(3) * 400 * cosPhi * (eta/100))
    const pElectricalKw = motorPowerKw / (motorEfficiencyPercent / 100);
    const nominalCurrentInA = Number(((pElectricalKw * 1000) / (Math.sqrt(3) * 400 * nominalCosPhi)).toFixed(1));

    // 2. Starting Inrush Current Ratio (I_start / In) & Torque Ratio (T_start / Tn):
    let inrushMultiplier = 7.2;
    let torqueMultiplier = 2.2;
    let startingDurationSec = 3.5;
    let harmonicGeneration = false;
    let requiresDvdTFilter = false;

    if (starterMethod === 'DOL_DIRECT') {
      inrushMultiplier = 7.0;
      torqueMultiplier = 2.2;
      startingDurationSec = 2.5;
    } else if (starterMethod === 'STAR_DELTA') {
      inrushMultiplier = 2.4;
      torqueMultiplier = 0.75; // Weak starting torque (T_start = 1/3 Tn)
      startingDurationSec = 6.0;
    } else if (starterMethod === 'SOFT_STARTER') {
      inrushMultiplier = 3.2;
      torqueMultiplier = 1.1;
      startingDurationSec = 5.0;
    } else if (starterMethod === 'VFD_VARIATEUR') {
      inrushMultiplier = 1.1; // Zero current inrush above In
      torqueMultiplier = 1.5; // High torque available from 0 rpm
      startingDurationSec = 8.0;
      harmonicGeneration = true;
      requiresDvdTFilter = cableLengthM > 35; // Motor insulation stress from PWM reflection
    }

    const startingCurrentIstartA = Number((nominalCurrentInA * inrushMultiplier).toFixed(1));

    // 3. Transient Voltage Dip (Delta U_dip %) on TGBT Busbar:
    // Delta U_dip % ≈ (S_start / S_sc_grid) * 100
    // S_start = sqrt(3) * 400 * I_start (kVA)
    const startingApparentKva = (Math.sqrt(3) * 400 * startingCurrentIstartA) / 1000;
    const shortCircuitMva = (Math.sqrt(3) * 400 * prospectiveIccKa * 1000) / 1000000;
    const voltageDipPercent = Number(((startingApparentKva / (shortCircuitMva * 1000)) * 100).toFixed(2));
    const isVoltageDipAcceptable = voltageDipPercent <= 5.0; // Standard allowable dip <= 5% for tertiary/lighting

    // 4. Protective Switchgear Sizing:
    // Contactor size (AC-3 rated current):
    const contactorRatingA = Math.ceil(nominalCurrentInA * 1.15 / 5) * 5;
    
    // Thermal overload relay setting range:
    const thermalRelayMinA = Number((nominalCurrentInA * 0.85).toFixed(1));
    const thermalRelayMaxA = Number((nominalCurrentInA * 1.15).toFixed(1));

    // Magnetic short-circuit breaker setting:
    const magneticTripRatingA = starterMethod === 'DOL_DIRECT' 
      ? Math.round(nominalCurrentInA * 12) 
      : Math.round(nominalCurrentInA * 8);

    return {
      nominalCurrentInA,
      startingCurrentIstartA,
      inrushMultiplier,
      torqueMultiplier,
      startingDurationSec,
      voltageDipPercent,
      isVoltageDipAcceptable,
      contactorRatingA,
      thermalRelayMinA,
      thermalRelayMaxA,
      magneticTripRatingA,
      harmonicGeneration,
      requiresDvdTFilter
    };
  }, [
    motorPowerKw, 
    motorEfficiencyPercent, 
    nominalCosPhi, 
    starterMethod, 
    cableLengthM, 
    prospectiveIccKa
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Démarrage Moteurs, Protection & Variateurs (VFD)' : 'Motor Starting, Protection & VFD Sizing Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                IEC 60947-4-1 / NF C 15-100 §558
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Appel de courant (I_start), creux de tension réseau (ΔU_dip), coordination Type 2 et dérogation désenfumage ERP.'
                : 'Inrush current, grid voltage dip (ΔU_dip), Type 2 contactor coordination, and emergency smoke extraction mode.'}
            </p>
          </div>
        </div>

        {/* Selected Starting Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg border bg-slate-950 text-indigo-400 border-indigo-500/30 flex items-center gap-2 font-bold">
            <Cpu className="w-4 h-4" />
            <span>
              {motorPowerKw} kW — {starterMethod.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Courant Nominal (In)' : 'Rated Current (In)'}</span>
          <span className="text-lg font-black text-white">{motorAnalytics.nominalCurrentInA} A</span>
          <span className="text-[10px] text-slate-500 block">
            400V 3P (η = {motorEfficiencyPercent}%, cos φ = {nominalCosPhi})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Pointe de Courant Démarrage' : 'Inrush Current (I_start)'}</span>
          <span className="text-lg font-black text-rose-400">{motorAnalytics.startingCurrentIstartA} A</span>
          <span className="text-[10px] text-slate-500 block">
            {motorAnalytics.inrushMultiplier} × In ({motorAnalytics.startingDurationSec}s {isFr ? 'durée' : 'duration'})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Creux de Tension Réseau' : 'Grid Voltage Dip (ΔU_dip)'}</span>
          <span className={`text-lg font-black ${motorAnalytics.isVoltageDipAcceptable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {motorAnalytics.voltageDipPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {motorAnalytics.isVoltageDipAcceptable ? (isFr ? 'Conforme (≤ 5% max)' : 'Compliant (≤ 5%)') : (isFr ? 'Pénalisant (> 5%)' : 'Exceeds 5%')}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Coordination Démarreur' : 'Starter Coordination'}</span>
          <span className="text-lg font-black text-cyan-400">{coordinationType}</span>
          <span className="text-[10px] text-slate-500 block">
            {coordinationType === 'TYPE_2' ? (isFr ? 'Sans soudure de contact' : 'No contact welding') : (isFr ? 'Remplacement toléré' : 'Replacement allowed')}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Power, Method, Coordination)                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          {isFr ? 'Sélection du Moteur & Technologie de Démarrage' : 'Motor Characteristics & Starting Mode'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Motor Power */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Puissance Moteur :' : 'Motor Power:'}</span>
              <strong className="text-indigo-400">{motorPowerKw} kW</strong>
            </div>
            <input
              type="range"
              min="4"
              max="250"
              step="1"
              value={motorPowerKw}
              onChange={(e) => setMotorPowerKw(Number(e.target.value))}
              className="w-full accent-indigo-400"
            />
            <span className="text-[10px] text-slate-500 block">Pompe primaire / Chiller / Ventilateur</span>
          </div>

          {/* Starting Method */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Mode de Démarrage :' : 'Starter Technology:'}</span>
            <select
              value={starterMethod}
              onChange={(e) => setStarterMethod(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="DOL_DIRECT">{isFr ? 'Direct (DOL - Pleine tension)' : 'Direct-On-Line (DOL)'}</option>
              <option value="STAR_DELTA">{isFr ? 'Étoile-Triangle (Y-Δ)' : 'Star-Delta (Y-Δ)'}</option>
              <option value="SOFT_STARTER">{isFr ? 'Démarreur Progressif (Altistart)' : 'Soft Starter (Altistart)'}</option>
              <option value="VFD_VARIATEUR">{isFr ? 'Variateur de Vitesse (VFD/Altivar)' : 'Variable Frequency Drive (VFD)'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {starterMethod === 'VFD_VARIATEUR' ? (isFr ? 'Rampe douce, régulation de débit' : 'Smooth ramp, flow control') : 'Démarrage électromécanique'}
            </span>
          </div>

          {/* Coordination Type */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Coordination IEC 60947-4-1 :' : 'IEC Coordination:'}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCoordinationType('TYPE_1')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  coordinationType === 'TYPE_1' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Type 1
              </button>
              <button
                onClick={() => setCoordinationType('TYPE_2')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  coordinationType === 'TYPE_2' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Type 2 (Continuité)
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {coordinationType === 'TYPE_2' ? (isFr ? 'Continuité de service sans remplacement' : 'Zero contact welding allowed') : (isFr ? 'Endommagement contacteur toléré' : 'Contactor replacement allowed')}
            </span>
          </div>

          {/* Smoke Extraction Toggle */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Mode Désenfumage ERP :' : 'Smoke Extraction (ERP):'}</span>
            <button
              onClick={() => setIsSmokeExtractionMode(!isSmokeExtractionMode)}
              className={`w-full py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 text-xs ${
                isSmokeExtractionMode 
                  ? 'bg-rose-600 text-white shadow-md animate-pulse' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              {isSmokeExtractionMode ? (isFr ? 'DÉSENFUMAGE ACTIF' : 'SMOKE EXTRACTION ACTIVE') : (isFr ? 'Mode Standard Normal' : 'Standard Normal Mode')}
            </button>
            <span className="text-[10px] text-slate-500 block">
              {isSmokeExtractionMode ? (isFr ? 'Inhibition déclenchement thermique (NF S 61-932)' : 'Thermal overload tripping inhibited') : 'Protection thermique active'}
            </span>
          </div>
        </div>

        {/* VFD dV/dt cable warning if long run */}
        {motorAnalytics.requiresDvdTFilter && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <p>
              {isFr
                ? `RECOMMANDATION FILTRE dV/dt (CEI 60034-25) : La distance câble variateur-moteur (${cableLengthM} m > 35 m) génère des réflexions d'ondes PWM avec surtensions de crête (> 1200 V) dégradant le vernis d'isolation des bobinages du moteur. L'insertion d'un filtre dV/dt ou d'une self moteur en sortie de variateur est FORTEMENT RECOMMANDÉE.`
                : `dV/dt FILTER RECOMMENDED: Cable length (${cableLengthM}m > 35m) causes high PWM peak reflections (> 1200V) stressing motor winding insulation. A motor reactor or dV/dt filter is strongly recommended.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Switchgear Sizing Schedule (Contactor, Overload, Breaker)        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Bordereau des Équipements de Protection Moteur (Démarreur)' : 'Motor Starter Gear Sizing Schedule'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '1. Disjoncteur Moteur (Magnétique) :' : '1. Motor Circuit Breaker:'}</span>
            <div className="text-lg font-black text-indigo-400">
              {motorAnalytics.magneticTripRatingA} A
            </div>
            <span className="text-[10px] text-slate-400 block">
              {isFr ? 'Déclencheur magnétique calibré sans déclenchement intempestif au démarrage.' : 'Magnetic release set above starting inrush peak.'}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '2. Contacteur de Puissance (AC-3) :' : '2. Power Contactor (AC-3):'}</span>
            <div className="text-lg font-black text-cyan-400">
              {motorAnalytics.contactorRatingA} A (AC-3)
            </div>
            <span className="text-[10px] text-slate-400 block">
              {isFr ? `Catégorie d'emploi AC-3 pour coupure de moteur à cage (${coordinationType}).` : `AC-3 duty category for squirrel-cage motors (${coordinationType}).`}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '3. Relais Thermique de Surcharge :' : '3. Thermal Overload Relay:'}</span>
            <div className="text-lg font-black text-amber-400">
              {motorAnalytics.thermalRelayMinA} - {motorAnalytics.thermalRelayMaxA} A
            </div>
            <span className="text-[10px] text-slate-400 block">
              {isFr ? 'Réglé exactement sur le courant assigné In = ' : 'Adjusted directly on In = '}{motorAnalytics.nominalCurrentInA} A
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
