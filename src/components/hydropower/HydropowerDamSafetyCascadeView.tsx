// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 9 : SÉCURITÉ BARRAGES, CASCADE & GESTION DES RISQUES
// ICOLD/CIGB Geotechnical Monitoring, Sanaga Cascade, Dam Breach PPI & Pumped Storage
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Droplets,
  Waves,
  Activity,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Layers,
  MapPin,
  Flame,
  Radio,
  Sparkles,
} from 'lucide-react';
import {
  DAM_SAFETY_SENSORS,
  SANAGA_CASCADE_NODES,
  simulateSanagaCascade,
  simulateDamBreach,
  calculatePumpedStorage,
} from '../../data/hydropowerGridSafetyData';
import type {
  DamSafetySensor,
  DamBreachSimulationParams,
  PumpedStorageLabParams,
} from '../../types/hydropowerGridSafety';

interface HydropowerDamSafetyCascadeViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
}

export const HydropowerDamSafetyCascadeView: React.FC<HydropowerDamSafetyCascadeViewProps> = ({
  locale,
  onNavigateStandard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'auscultation' | 'cascade' | 'breach' | 'step'>('auscultation');

  // Auscultation State
  const [selectedSensorId, setSelectedSensorId] = useState<string>('PND-P09-01');

  // Cascade Simulation State
  const [lomPangarReleaseM3s, setLomPangarReleaseM3s] = useState<number>(1050); // m3/s regulatory release
  const [intermediateInflowM3s, setIntermediateInflowM3s] = useState<number>(250);

  // Dam Breach Simulation State
  const [breachParams, setBreachParams] = useState<DamBreachSimulationParams>({
    damHeightM: 14.0, // Nachtigal main RCC weir height ~14m
    reservoirVolumeMm3: 15.0, // Nachtigal pondage ~15 Mm3
    damType: 'gravity_rcc',
    failureMode: 'overtopping_pmf',
  });

  // Pumped Storage (STEP) State
  const [stepParams, setStepParams] = useState<PumpedStorageLabParams>({
    upperReservoirActiveVolumeMm3: 8.0,
    grossHeadM: 180.0,
    pumpingDischargeM3s: 45.0,
    generatingDischargeM3s: 50.0,
    pumpMotorEfficiency: 0.89,
    turbineGenEfficiency: 0.91,
    waterwayEfficiency: 0.96,
    operatingHoursTurbine: 6,
    operatingHoursPump: 7,
  });

  // Derived calculations
  const cascadeResult = useMemo(() => {
    return simulateSanagaCascade(lomPangarReleaseM3s, intermediateInflowM3s);
  }, [lomPangarReleaseM3s, intermediateInflowM3s]);

  const breachResult = useMemo(() => {
    return simulateDamBreach(breachParams);
  }, [breachParams]);

  const stepResult = useMemo(() => {
    return calculatePumpedStorage(stepParams);
  }, [stepParams]);

  const activeSensor = DAM_SAFETY_SENSORS.find((s) => s.id === selectedSensorId) || DAM_SAFETY_SENSORS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0D141F] via-[#101928] to-[#0A101C] border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 9 • SÉCURITÉ BARRAGES & CASCADE' : 'STEP 9 • DAM SAFETY & CASCADE RESILIENCE'}
              </span>
              <span className="text-xs font-mono text-neutral-400">ICOLD / CIGB Bulletins 138 & 158</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Auscultation Géotechnique, Cascade Sanaga & Gestion des Risques (PPI)'
                  : 'Dam Geotechnical Monitoring, Cascade Optimization & Emergency Action Plan'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Surveillance continue des barrages per normes CIGB, optimisation hydro-énergétique de la cascade fluviale (Lom Pangar-Nachtigal-Songloulou-Edéa), modélisation de rupture Froehlich (PPI) et stockage d\'énergie STEP.'
                : 'ICOLD continuous geotechnical dam monitoring, multi-reservoir river cascade dispatch (Lom Pangar-Nachtigal-Songloulou-Edéa), Froehlich breach flood modeling (EAP), and pumped-storage hydro.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('ICOLD-B138')}
                className="px-3 py-2 rounded-xl bg-[#14202F] hover:bg-[#1A2C40] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>CIGB / ICOLD B.138</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C2634]">
          <button
            type="button"
            onClick={() => setActiveSubTab('auscultation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'auscultation'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#14202F] text-neutral-300 hover:text-white border border-[#233346]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Auscultation Barrage (CIGB)' : '1. Dam Auscultation (ICOLD)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('cascade')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'cascade'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#14202F] text-neutral-300 hover:text-white border border-[#233346]'
            }`}
          >
            <Droplets className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Cascade Fluviale Sanaga (1 080 MW)' : '2. Sanaga River Cascade (1,080 MW)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('breach')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'breach'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#14202F] text-neutral-300 hover:text-white border border-[#233346]'
            }`}
          >
            <Waves className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Onde de Submersion & Plan PPI' : '3. Dam Breach Flood Wave & EAP'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('step')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'step'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#14202F] text-neutral-300 hover:text-white border border-[#233346]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Stockage d\'Énergie STEP' : '4. Pumped Storage Hydro (STEP)'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: ICOLD / CIGB DAM AUSCULTATION                             */}
      {/* ==================================================================== */}
      {activeSubTab === 'auscultation' && (
        <div className="space-y-6">
          {/* Sensors Dashboard Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DAM_SAFETY_SENSORS.map((sensor) => (
              <button
                key={sensor.id}
                type="button"
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selectedSensorId === sensor.id
                    ? 'border-emerald-500 bg-emerald-950/30 shadow-md'
                    : 'border-[#252E38] bg-[#0A0E14] hover:bg-[#141A23]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-black text-amber-400">{sensor.id}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 uppercase">
                    {sensor.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{sensor.sensorName[locale]}</div>
                <div className="text-lg font-black text-cyan-300 font-mono mt-1">
                  {sensor.currentValue} {sensor.unit}
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  Nominal: [{sensor.normalRange[0]} - {sensor.normalRange[1]}] {sensor.unit}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Sensor In-Depth Telemetry & Inspection Card */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-[#0A0E14] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400">{activeSensor.id}</span>
                  <h3 className="text-base font-bold text-white font-mono">
                    {activeSensor.sensorName[locale]}
                  </h3>
                </div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">
                  Emplacement : <span className="text-cyan-300">{activeSensor.locationTag}</span>
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-right">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Mesure Instantanée</div>
                <div className="text-xl font-black text-emerald-300 font-mono">
                  {activeSensor.currentValue} {activeSensor.unit}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Seuils Réglementaires CIGB :' : 'ICOLD Regulatory Thresholds:'}
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-neutral-300">
                    <span>Plage Normale Exploitation :</span>
                    <span className="text-emerald-400 font-bold">{activeSensor.normalRange[0]} à {activeSensor.normalRange[1]} {activeSensor.unit}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Seuil de Vigilance (Alerte 1) :</span>
                    <span className="text-amber-400 font-bold">{activeSensor.alertThreshold} {activeSensor.unit}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Seuil d'Alarme Critique (Urgence 2) :</span>
                    <span className="text-red-400 font-bold">{activeSensor.alarmThreshold} {activeSensor.unit}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Interprétation Géotechnique :' : 'Geotechnical Behavior Assessment:'}
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {activeSensor.interpretation[locale]}
                </p>
                <div className="text-[10px] text-emerald-400 font-bold pt-1">
                  Action recommandée : {activeSensor.recommendedAction[locale]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: SANAGA RIVER CASCADE MULTI-RESERVOIR DISPATCH             */}
      {/* ==================================================================== */}
      {activeSubTab === 'cascade' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cascade Flow Sizing Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Régulation Cascade Sanaga' : 'Sanaga Cascade Dispatch'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
                  HYDRO DISPATCH
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Débit Régulateur Lom Pangar :' : 'Lom Pangar Storage Release:'}</span>
                  <span className="text-cyan-400 font-bold">{lomPangarReleaseM3s} m³/s</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1400"
                  step="25"
                  value={lomPangarReleaseM3s}
                  onChange={(e) => setLomPangarReleaseM3s(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Retenue Lom Pangar : 6 milliards m³ de stockage stratégique d'étiage
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Apports Naturels Affluents (Mbam) :' : 'Tributary Inflow (Mbam River):'}</span>
                  <span className="text-amber-400 font-bold">{intermediateInflowM3s} m³/s</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={intermediateInflowM3s}
                  onChange={(e) => setIntermediateInflowM3s(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Cascade Output Summary Hero */}
              <div className="p-4 rounded-xl bg-linear-to-br from-[#141A23] to-[#0D1219] border border-cyan-500/30 space-y-2 text-center">
                <div className="text-[10px] text-neutral-400 uppercase">
                  {locale === 'fr' ? 'Puissance Cumulée Cascade Sanaga' : 'Total Combined Cascade Power'}
                </div>
                <div className="text-3xl font-black text-cyan-300 font-mono tracking-tight">
                  {cascadeResult.totalCascadePowerMW} MW
                </div>
                <div className="text-[11px] text-neutral-300">
                  Production journalière : <span className="text-emerald-400 font-bold">{cascadeResult.totalCascadeEnergyGWhDay} GWh/j</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-[#252E38]">
                  Efficacité volumique : <span className="text-white font-bold">{cascadeResult.waterEfficiencyKWhPerM3} kWh/m³</span> d'eau turbinée
                </div>
              </div>
            </div>

            {/* Plants Along the River Schematic (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Profil des Ouvrages Fluviaux Cascades' : 'Cascaded Hydro Plants Profile'}</span>
                </h4>
                <span className="text-[10px] font-mono text-neutral-400">Total Sanaga : 1 080 MW</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {SANAGA_CASCADE_NODES.map((node) => {
                  let plantPower = 0;
                  if (node.id === 'lom_pangar') plantPower = 30;
                  if (node.id === 'nachtigal') plantPower = cascadeResult.nachtigalPowerMW;
                  if (node.id === 'songloulou') plantPower = cascadeResult.songloulouPowerMW;
                  if (node.id === 'edea') plantPower = cascadeResult.edeaPowerMW;

                  return (
                    <div
                      key={node.id}
                      className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{node.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[9px]">
                            {node.river}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1">
                          Chute H = {node.designHeadM} m | Qd = {node.designDischargeM3s} m³/s | Retenue = {node.storageCapacityMm3} Mm³
                        </div>
                        {node.travelTimeToNextHours > 0 && (
                          <div className="text-[9px] text-amber-300 mt-0.5">
                            Temps d'onde vers aval : ~{node.travelTimeToNextHours} heures ({node.distanceKm} km)
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-emerald-400">
                          {plantPower} MW
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          / {node.installedCapacityMW} MW nominal
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: DAM BREACH & EMERGENCY ACTION PLAN (PPI)                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'breach' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Simulation Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Modélisation Rupture (Froehlich / USBR)' : 'Dam Breach Sizing Model'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300">
                  PPI RISK LAB
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Hauteur d\'Ouvrage H :' : 'Dam Height H:'}</span>
                  <span className="text-red-400 font-bold">{breachParams.damHeightM} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="2"
                  value={breachParams.damHeightM}
                  onChange={(e) => setBreachParams({ ...breachParams, damHeightM: parseFloat(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Volume de Retenue V :' : 'Reservoir Storage V:'}</span>
                  <span className="text-amber-400 font-bold">{breachParams.reservoirVolumeMm3} Mm³</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={breachParams.reservoirVolumeMm3}
                  onChange={(e) => setBreachParams({ ...breachParams, reservoirVolumeMm3: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-400 uppercase">Débit de Pointe Qp</div>
                  <div className="text-lg font-black text-red-400 mt-0.5">
                    {breachResult.peakBreachDischargeM3s} m³/s
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-400 uppercase">Largeur Brèche</div>
                  <div className="text-lg font-black text-amber-300 mt-0.5">
                    {breachResult.averageBreachWidthM} m
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300 space-y-1">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Temps de Formation Brèche :' : 'Breach Formation Time:'}
                </div>
                <div className="text-white font-bold">{breachResult.breachFormationTimeHours} heures ({Math.round(breachResult.breachFormationTimeHours * 60)} min)</div>
                <div className="text-neutral-400 text-[10px]">
                  Vitesse de propagation de l'onde : ~{breachResult.waveFrontVelocityKmH} km/h
                </div>
              </div>
            </div>

            {/* Downstream Flood Propagation & Evacuation Priorities (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Radio className="h-4 w-4 text-red-400" />
                  <span>{locale === 'fr' ? 'Propagation de l\'Onde & Délais d\'Évacuation' : 'Flood Wave Arrival Times & Evacuation'}</span>
                </h4>
                <span className="text-[10px] font-mono text-red-400">PLAN PARTICULIER D'INTERVENTION</span>
              </div>

              <div className="space-y-2.5">
                {breachResult.floodTravelTimes.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{pt.locationName}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                            pt.evacuationPriority === 'immediate'
                              ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                              : pt.evacuationPriority === 'high'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-neutral-900 text-neutral-400'
                          }`}
                        >
                          {pt.evacuationPriority}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Distance : {pt.distanceKm} km | Surélévation crête : +{pt.peakWaterElevationRiseM} m
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-red-400">
                        {pt.arrivalTimeHours} h ({Math.round(pt.arrivalTimeHours * 60)} min)
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        Pointe à {pt.peakArrivalHours} h
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Directives PPI */}
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/10 space-y-2">
                <div className="text-red-300 font-bold uppercase text-[10px]">
                  {locale === 'fr' ? 'Directives Immédiates PPI / SAP :' : 'Emergency Action Plan Directives:'}
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-200">
                  {breachResult.ppiSafetyDirectives.map((dir, i) => (
                    <li key={i}>{dir[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: PUMPED STORAGE HYDRO (STEP / PSS) ENERGY LAB              */}
      {/* ==================================================================== */}
      {activeSubTab === 'step' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* STEP Sizing Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Configuration STEP / PSS' : 'Pumped Storage Configuration'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  ENERGY STORAGE
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Volume Bassin Supérieur :' : 'Upper Reservoir Storage:'}</span>
                  <span className="text-cyan-400 font-bold">{stepParams.upperReservoirActiveVolumeMm3} Mm³</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={stepParams.upperReservoirActiveVolumeMm3}
                  onChange={(e) => setStepParams({ ...stepParams, upperReservoirActiveVolumeMm3: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Chute Brute H_brute :' : 'Gross Head H:'}</span>
                  <span className="text-emerald-400 font-bold">{stepParams.grossHeadM} m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={stepParams.grossHeadM}
                  onChange={(e) => setStepParams({ ...stepParams, grossHeadM: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Débit Turbiné Q_turb :' : 'Generating Discharge:'}</span>
                  <span className="text-amber-400 font-bold">{stepParams.generatingDischargeM3s} m³/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={stepParams.generatingDischargeM3s}
                  onChange={(e) => setStepParams({ ...stepParams, generatingDischargeM3s: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Débit Pompé Q_pump :' : 'Pumping Discharge:'}</span>
                  <span className="text-cyan-400 font-bold">{stepParams.pumpingDischargeM3s} m³/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={stepParams.pumpingDischargeM3s}
                  onChange={(e) => setStepParams({ ...stepParams, pumpingDischargeM3s: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* STEP Yield, Storage MWh & Frequency Support (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Bilan Énergétique & Services Système' : 'Energy Yield & Grid Support'}</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-300">
                  Rendement : {stepResult.roundTripEfficiencyPercent}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                  <div className="text-[10px] text-neutral-400 uppercase">Capacité Énergie Stockée</div>
                  <div className="text-2xl font-black text-emerald-300 mt-1">
                    {stepResult.storedEnergyMWh} MWh
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Équivalent ~{(stepResult.storedEnergyMWh / stepResult.generatingPowerMW).toFixed(1)} h à pleine charge
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                  <div className="text-[10px] text-neutral-400 uppercase">Plage Support Fréquence</div>
                  <div className="text-2xl font-black text-cyan-300 mt-1">
                    ±{stepResult.gridFrequencySupportMW} MW
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Du pompage max à la génération crête
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                  <span className="text-neutral-400">Puissance Turbinage :</span>
                  <span className="font-bold text-amber-300">{stepResult.generatingPowerMW} MW</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                  <span className="text-neutral-400">Puissance Pompage :</span>
                  <span className="font-bold text-cyan-300">{stepResult.pumpingPowerMW} MW</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">
                  {locale === 'fr' ? 'Arbitrage Économique & Stockage Massif :' : 'Economic Arbitrage & Grid Value:'}
                </div>
                <p>
                  {locale === 'fr'
                    ? 'La STEP permet de pomper pendant les heures creuses nocturnes ou lors d\'excédents solaires dans le Grand Nord, et de turbiner aux heures de pointe vespérales (18h-22h) pour substituer le thermique diesel coûteux.'
                    : 'The pumped-storage plant absorbs off-peak base energy and excess solar, releasing peak hydro generation during evening hours (18h-22h) to replace expensive thermal peaker fuels.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
