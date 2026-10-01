// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 15 : JUMEAU NUMÉRIQUE SPATIAL & TÉLÉ-MAINTENANCE AR
// BIM / IFC (ISO 19650), AR Guided Work Orders & Industrial IoT Telemetry Mesh
// ============================================================================

import React, { useState } from 'react';
import {
  Glasses,
  Layers,
  Cpu,
  Wifi,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Box,
  Wrench,
  Lock,
  Gauge,
  Maximize2,
  Zap,
} from 'lucide-react';
import {
  POWERHOUSE_BIM_COMPONENTS,
  AR_MAINTENANCE_PROCEDURES,
  IOT_SENSOR_MESH,
} from '../../data/hydropowerSpatialTwinData';
import type { SpatialBimComponent } from '../../types/hydropowerSpatialTwin';

interface HydropowerSpatialTwinViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerSpatialTwinView: React.FC<HydropowerSpatialTwinViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bim' | 'ar' | 'iot'>('bim');

  // Sub-Tab 1: Selected BIM component
  const [selectedBimGuid, setSelectedBimGuid] = useState<string>('IFC-G1-RUNNER-001');

  // Sub-Tab 2: Selected AR procedure & step
  const [selectedProcId, setSelectedProcId] = useState<string>('AR-PROC-01');
  const [currentArStepIndex, setCurrentArStepIndex] = useState<number>(0);

  const selectedBim =
    POWERHOUSE_BIM_COMPONENTS.find((c) => c.guid === selectedBimGuid) ||
    POWERHOUSE_BIM_COMPONENTS[0];

  const currentProc =
    AR_MAINTENANCE_PROCEDURES.find((p) => p.procedureId === selectedProcId) ||
    AR_MAINTENANCE_PROCEDURES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#140E1E] via-[#1D142C] to-[#120B1A] border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 15 • JUMEAU NUMÉRIQUE SPATIAL & TÉLÉ-MAINTENANCE AR' : 'STEP 15 • SPATIAL DIGITAL TWIN & AR TELE-MAINTENANCE'}
              </span>
              <span className="text-xs font-mono text-neutral-400">ISO 19650 / OPEN BIM IFC4x3 / WIRELESSHART</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Glasses className="h-6 w-6 text-purple-400" />
              <span>
                {locale === 'fr'
                  ? 'Jumeau Spatial BIM/IFC, Réalité Augmentée Industrielle & Mesh IoT'
                  : 'Spatial BIM/IFC Twin, Augmented Reality Tele-Maintenance & IoT Mesh'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Exploration 3D des composants électromécaniques de l\'usine (ISO 19650), guidage holographique en réalité augmentée pour les techniciens sur site et maillage de capteurs IoT haute fréquence.'
                : '3D spatial BIM breakdown of powerhouse assets, AR smart-glasses overlay for precision torque calibration, and high-frequency wireless IoT sensor mesh.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('ISO-55000')}
                className="px-3 py-2 rounded-xl bg-[#281A3C] hover:bg-[#3B2658] border border-purple-500/40 text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>ISO 19650 (BIM Twin)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#2F1F46]">
          <button
            type="button"
            onClick={() => setActiveSubTab('bim')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'bim'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-[#221636] text-neutral-300 hover:text-white border border-[#3E295E]'
            }`}
          >
            <Box className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Maquette Spatiale BIM / IFC' : '1. Spatial BIM / IFC Model'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ar'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-[#221636] text-neutral-300 hover:text-white border border-[#3E295E]'
            }`}
          >
            <Glasses className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Télé-Maintenance AR & HoloLens' : '2. AR Smart-Glasses HUD'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('iot')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'iot'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-[#221636] text-neutral-300 hover:text-white border border-[#3E295E]'
            }`}
          >
            <Wifi className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Réseau Maillé IoT Haute Fréquence' : '3. High-Freq IoT Mesh'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: BIM / IFC SPATIAL ASSET EXPLORER                          */}
      {/* ==================================================================== */}
      {activeSubTab === 'bim' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Component List (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Box className="h-4 w-4 text-purple-400" />
                  <span>{locale === 'fr' ? 'Composants IFC4x3 Usine' : 'Powerhouse IFC4x3 Objects'}</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold">
                  NIVEAU LOD 400
                </span>
              </div>

              <div className="space-y-2">
                {POWERHOUSE_BIM_COMPONENTS.map((comp) => {
                  const isSelected = selectedBimGuid === comp.guid;
                  return (
                    <div
                      key={comp.guid}
                      onClick={() => setSelectedBimGuid(comp.guid)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1F152E] border-purple-500/60 shadow-md ring-1 ring-purple-500/40'
                          : 'bg-[#141A23] border-[#252E38] hover:bg-[#1A2330]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold text-xs truncate max-w-[240px]">
                          {comp.name[locale]}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            comp.maintenanceStatus === 'optimal'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {comp.maintenanceStatus === 'optimal' ? 'OPTIMAL' : 'CONTRÔLE'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>GUID : {comp.guid}</span>
                        <span className="text-purple-300 font-bold">Santé : {comp.healthScorePercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3D Spatial Inspector (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <div>
                    <span className="text-[10px] text-purple-400 uppercase font-bold">{selectedBim.ifcClass}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{selectedBim.name[locale]}</h4>
                  </div>
                  <div className="text-right text-[10px] text-neutral-400">
                    <div>Coord. X:{selectedBim.spatialCoordinates.x}m Y:{selectedBim.spatialCoordinates.y}m Z:{selectedBim.spatialCoordinates.z}m</div>
                    <div className="text-neutral-500">Masse : {(selectedBim.massKg / 1000).toFixed(1)} tonnes</div>
                  </div>
                </div>

                {/* Spatial Isometric Diagram Wireframe */}
                <div className="p-5 rounded-xl bg-[#080D14] border border-[#252E38] flex flex-col items-center justify-center relative overflow-hidden select-none">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">
                    {locale === 'fr' ? 'REPRÉSENTATION GÉOMÉTRIQUE SPATIALE 3D (LOD 400)' : '3D SPATIAL ISOMETRIC WIREFRAME (LOD 400)'}
                  </div>
                  <svg viewBox="0 0 240 140" className="w-64 h-36">
                    {/* Isometric Powerhouse Shaft Cylinder & Runner Wireframe */}
                    <ellipse cx="120" cy="30" rx="70" ry="18" fill="none" stroke="#6B21A8" strokeWidth="2" />
                    <ellipse cx="120" cy="70" rx="70" ry="18" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
                    <ellipse cx="120" cy="110" rx="70" ry="18" fill="#1E1B4B" fillOpacity="0.4" stroke="#8B5CF6" strokeWidth="2.5" />
                    <line x1="50" y1="30" x2="50" y2="110" stroke="#4B5563" strokeWidth="1.5" />
                    <line x1="190" y1="30" x2="190" y2="110" stroke="#4B5563" strokeWidth="1.5" />
                    <line x1="120" y1="12" x2="120" y2="128" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 2" />

                    {/* Component Highlight Node */}
                    <circle cx="120" cy="110" r="8" fill="#A855F7" className="animate-ping opacity-75" />
                    <circle cx="120" cy="110" r="5" fill="#C084FC" />
                    <text x="135" y="114" fill="#E9D5FF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {selectedBim.guid}
                    </text>
                  </svg>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[9px] text-neutral-400 uppercase">Vibration RMS</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">
                      {selectedBim.vibrationRmsMmS} <span className="text-xs font-normal">mm/s</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[9px] text-neutral-400 uppercase">Température Métal</div>
                    <div className="text-lg font-black text-cyan-300 mt-0.5">
                      {selectedBim.temperatureDegC} <span className="text-xs font-normal">°C</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[9px] text-neutral-400 uppercase">Heures de Marche</div>
                    <div className="text-lg font-black text-white mt-0.5">
                      {selectedBim.operatingHours.toLocaleString()} <span className="text-xs font-normal">h</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141A23] border border-purple-500/30">
                    <div className="text-[9px] text-neutral-400 uppercase">Indice de Santé</div>
                    <div className="text-lg font-black text-purple-300 mt-0.5">
                      {selectedBim.healthScorePercent} <span className="text-xs font-normal">%</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-300 p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                  <span className="text-neutral-400 uppercase font-bold text-[9px] block">Nuance Métallurgique & Spécification :</span>
                  <p className="mt-0.5">{selectedBim.material}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: AR SMART-GLASSES TELE-MAINTENANCE HUD                     */}
      {/* ==================================================================== */}
      {activeSubTab === 'ar' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Procedure Selector */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0A0E14] border border-[#252E38]">
            <span className="text-neutral-400 text-xs font-bold uppercase">
              {locale === 'fr' ? 'Gamme Opératoire AR :' : 'AR Work Order:'}
            </span>
            {AR_MAINTENANCE_PROCEDURES.map((proc) => (
              <button
                key={proc.procedureId}
                type="button"
                onClick={() => {
                  setSelectedProcId(proc.procedureId);
                  setCurrentArStepIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedProcId === proc.procedureId
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#141A23] text-neutral-400 hover:text-white border border-[#252E38]'
                }`}
              >
                {proc.title[locale]}
              </button>
            ))}
          </div>

          {/* AR Smart-Glasses HUD Viewport */}
          <div className="p-6 rounded-2xl border border-purple-500/40 bg-[#06090E] relative overflow-hidden shadow-2xl">
            {/* Holographic HUD Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/30 text-[10px]">
              <div className="flex items-center gap-2 text-purple-300">
                <Glasses className="h-4 w-4 animate-pulse" />
                <span className="font-bold tracking-widest">AR HUD ACTIVE • HOLOLENS 2 CALIBRATED</span>
              </div>
              <div className="text-neutral-400 flex items-center gap-3">
                <span>FPS: 60</span>
                <span>LATENCE: 12ms</span>
                <span className="text-emerald-400 font-bold">SPATIAL ANCHOR: LOCKED</span>
              </div>
            </div>

            {/* AR Live Step Screen */}
            <div className="my-6 p-6 rounded-xl bg-[#0B1019] border border-purple-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-600 text-purple-300 font-bold text-xs">
                  ÉTAPE {currentArStepIndex + 1} / {currentProc.arOverlaySteps.length}
                </span>
                <span className="text-cyan-300 text-xs font-bold">
                  Cible Holographique : {currentProc.arOverlaySteps[currentArStepIndex].highlightZone}
                </span>
              </div>

              <div className="text-base text-white font-bold leading-relaxed">
                {currentProc.arOverlaySteps[currentArStepIndex].instruction[locale]}
              </div>

              {currentProc.arOverlaySteps[currentArStepIndex].torqueSpecNm && (
                <div className="mt-4 p-3 rounded-lg bg-purple-950/40 border border-purple-500/50 inline-flex items-center gap-3 text-purple-200">
                  <Wrench className="h-4 w-4 text-purple-400" />
                  <span>
                    Couple Dynamométrique de Précision Requis :{' '}
                    <strong className="text-white text-sm">
                      {currentProc.arOverlaySteps[currentArStepIndex].torqueSpecNm} Nm
                    </strong>
                  </span>
                </div>
              )}

              {currentProc.arOverlaySteps[currentArStepIndex].safetyCaution && (
                <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/50 flex items-center gap-2.5 text-red-200 text-xs">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>{currentProc.arOverlaySteps[currentArStepIndex].safetyCaution![locale]}</span>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1C2634]">
                <button
                  type="button"
                  disabled={currentArStepIndex === 0}
                  onClick={() => setCurrentArStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-[#141A23] border border-[#252E38] text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1E2734]"
                >
                  ← Étape Précédente
                </button>

                <button
                  type="button"
                  disabled={currentArStepIndex === currentProc.arOverlaySteps.length - 1}
                  onClick={() =>
                    setCurrentArStepIndex((prev) =>
                      Math.min(currentProc.arOverlaySteps.length - 1, prev + 1)
                    )
                  }
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Valider & Étape Suivante →
                </button>
              </div>
            </div>

            {/* LOTO & Safety Lockouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="p-4 rounded-xl bg-[#0F1622] border border-[#252E38] space-y-2">
                <span className="text-red-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Consignations LOTO Obligatoires :</span>
                </span>
                <ul className="space-y-1 text-neutral-300">
                  {currentProc.safetyLockoutsRequired.map((loto, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{loto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1622] border border-[#252E38] space-y-2">
                <span className="text-purple-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Outillage Spécifique Requis :</span>
                </span>
                <ul className="space-y-1 text-neutral-300">
                  {currentProc.toolingRequired.map((tool, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: HIGH-FREQUENCY WIRELESS IOT SENSOR MESH                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'iot' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Nœuds Capteurs Sans Fil (WirelessHART / BLE Mesh)' : 'Wireless Sensor Mesh Telemetry'}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                5 NŒUDS SYNCHRONISÉS (100% ACTIFS)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {IOT_SENSOR_MESH.map((sensor) => (
                <div key={sensor.nodeId} className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 text-xs">{sensor.nodeId}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold">
                      {sensor.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-white font-bold text-[11px] line-clamp-1">
                    {sensor.mountLocation[locale]}
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-cyan-300">{sensor.currentReading}</span>
                    <span className="text-neutral-400 text-xs">{sensor.unit}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 pt-2 border-t border-[#1C2634]">
                    <div>
                      Échantillonnage : <strong className="text-white">{sensor.samplingRateKhz} kHz</strong>
                    </div>
                    <div>
                      Signal RSSI : <strong className="text-emerald-400">{sensor.meshRssiDbm} dBm</strong>
                    </div>
                    <div>
                      Batterie Li-SOCl₂ : <strong className="text-cyan-300">{sensor.batteryHealthPercent}%</strong>
                    </div>
                    <div>
                      Seuil Alerte : <strong className="text-amber-400">{sensor.thresholdAlert}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
