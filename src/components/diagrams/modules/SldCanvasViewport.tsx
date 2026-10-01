// src/components/diagrams/modules/SldCanvasViewport.tsx
import React, { useState } from 'react';
import { Activity, Zap } from 'lucide-react';
import { SldTopologyType } from './SldHeaderToolbar';
import { SingleBusSubstationSvg } from '../SingleBusSubstationSvg';
import { DoubleBusSubstationSvg } from '../DoubleBusSubstationSvg';
import { BreakerAndHalfSubstationSvg } from '../BreakerAndHalfSubstationSvg';
import { RmuDistributionSvg } from '../RmuDistributionSvg';
import { SolarBessSubstationSvg } from '../SolarBessSubstationSvg';
import { SldFaultSimulationPanel, FaultType } from './SldFaultSimulationPanel';
import { ElectronParticleFlowCanvas } from '../../visual/ElectronParticleFlowCanvas';

interface SldCanvasViewportProps {
  locale: 'fr' | 'en';
  activeTopology: SldTopologyType;
  svgContainerRef: React.RefObject<HTMLDivElement>;
  handleToggle: (device: string) => void;
  handleSimulateFault: (type: FaultType) => void;

  // Single Bus States
  qs_line: boolean;
  q0_line: boolean;
  qs_trafo: boolean;
  q0_trafo_hv: boolean;
  q0_trafo_mv: boolean;
  q0_f1: boolean;
  q0_f2: boolean;
  q0_f3: boolean;
  q8_line: boolean;
  isLineEnergized: boolean;
  isBus225Energized: boolean;
  isTrafoEnergized: boolean;
  isBus30Energized: boolean;
  u_hv_nom: number;
  u_mv_nom: number;
  trafoTap: number;
  activeLoadMw?: number;
  current_hv?: number;
  current_mv?: number;

  // Double Bus States
  qs_bc1: boolean;
  q0_bc: boolean;
  qs_bc2: boolean;
  qs1_a: boolean;
  qs1_b: boolean;
  q0_1: boolean;
  qs1_line: boolean;
  q8_1: boolean;
  qs2_a: boolean;
  qs2_b: boolean;
  q0_2: boolean;
  qs2_line: boolean;
  q8_2: boolean;
  qst_a: boolean;
  qst_b: boolean;
  q0_t: boolean;
  isBusA_Energized: boolean;
  isBusB_Energized: boolean;
  isCouplerClosed: boolean;
  isLine1_Energized: boolean;
  isLine2_Energized: boolean;
  isTrafo_Energized: boolean;

  // Breaker and a Half (1-1/2 CB) States
  qs_bh_1a?: boolean;
  q0_bh_1?: boolean;
  qs_bh_1b?: boolean;
  q8_bh_cb1?: boolean;
  qs_bh_l1?: boolean;
  q8_bh_1?: boolean;
  qs_bh_m1?: boolean;
  q0_bh_m?: boolean;
  qs_bh_m2?: boolean;
  q8_bh_cbm?: boolean;
  qs_bh_l2?: boolean;
  q8_bh_2?: boolean;
  qs_bh_2a?: boolean;
  q0_bh_2?: boolean;
  qs_bh_2b?: boolean;
  q8_bh_cb2?: boolean;
  isBus1_Energized?: boolean;
  isBus2_Energized?: boolean;
  isLine1Bh_Energized?: boolean;
  isLine2Bh_Energized?: boolean;
  isNode1_Energized?: boolean;
  isNode2_Energized?: boolean;
  isCbmPath_Energized?: boolean;

  // RMU States
  lbs1: boolean;
  q8_rmu1: boolean;
  lbs2: boolean;
  q8_rmu2: boolean;
  q0_rmu_t: boolean;
  q8_rmu_t: boolean;
  q0_bt: boolean;
  q0_bt_f1: boolean;
  q0_bt_f2: boolean;
  q0_bt_f3: boolean;
  isRing1_Energized: boolean;
  isRing2_Energized: boolean;
  isRmuBus_Energized: boolean;
  isDistTrafo_Energized: boolean;
  isTgbt_Energized: boolean;

  // Solar & BESS States
  q0_pv: boolean;
  q8_pv: boolean;
  q0_bess: boolean;
  q8_bess: boolean;
  q0_aux: boolean;
  qs_33_t: boolean;
  q0_33_t: boolean;
  q0_225_sb: boolean;
  qs_225_line_sb: boolean;
  q8_225_sb: boolean;
  solarIrradiance: number;
  solarPowerMw: number;
  bessMode: 'charge' | 'discharge' | 'standby' | 'grid_forming';
  bessPowerMw: number;
  bessSocPercent: number;
  totalExportMw: number;
  reactivePowerMvar: number;
  isPvGenerating: boolean;
  isBessActive: boolean;
  isBus33Energized: boolean;
  isTrafoHvEnergized: boolean;
  isGrid225Connected: boolean;
  activeFault?: string | null;
  onOpenTcc?: () => void;
}

export const SldCanvasViewport: React.FC<SldCanvasViewportProps> = ({
  locale,
  activeTopology,
  svgContainerRef,
  handleToggle,
  handleSimulateFault,
  activeFault,
  onOpenTcc,

  qs_line,
  q0_line,
  qs_trafo,
  q0_trafo_hv,
  q0_trafo_mv,
  q0_f1,
  q0_f2,
  q0_f3,
  q8_line,
  isLineEnergized,
  isBus225Energized,
  isTrafoEnergized,
  isBus30Energized,
  u_hv_nom,
  u_mv_nom,
  trafoTap,
  activeLoadMw = 48.5,
  current_hv = 130,
  current_mv = 952,

  qs_bc1,
  q0_bc,
  qs_bc2,
  qs1_a,
  qs1_b,
  q0_1,
  qs1_line,
  q8_1,
  qs2_a,
  qs2_b,
  q0_2,
  qs2_line,
  q8_2,
  qst_a,
  qst_b,
  q0_t,
  isBusA_Energized,
  isBusB_Energized,
  isCouplerClosed,
  isLine1_Energized,
  isLine2_Energized,
  isTrafo_Energized,

  // Breaker and a Half (1-1/2 CB)
  qs_bh_1a = true,
  q0_bh_1 = true,
  qs_bh_1b = true,
  q8_bh_cb1 = false,
  qs_bh_l1 = true,
  q8_bh_1 = false,
  qs_bh_m1 = true,
  q0_bh_m = true,
  qs_bh_m2 = true,
  q8_bh_cbm = false,
  qs_bh_l2 = true,
  q8_bh_2 = false,
  qs_bh_2a = true,
  q0_bh_2 = true,
  qs_bh_2b = true,
  q8_bh_cb2 = false,
  isBus1_Energized = true,
  isBus2_Energized = true,
  isLine1Bh_Energized = true,
  isLine2Bh_Energized = true,
  isNode1_Energized = true,
  isNode2_Energized = true,
  isCbmPath_Energized = true,

  lbs1,
  q8_rmu1,
  lbs2,
  q8_rmu2,
  q0_rmu_t,
  q8_rmu_t,
  q0_bt,
  q0_bt_f1,
  q0_bt_f2,
  q0_bt_f3,
  isRing1_Energized,
  isRing2_Energized,
  isRmuBus_Energized,
  isDistTrafo_Energized,
  isTgbt_Energized,

  q0_pv,
  q8_pv,
  q0_bess,
  q8_bess,
  q0_aux,
  qs_33_t,
  q0_33_t,
  q0_225_sb,
  qs_225_line_sb,
  q8_225_sb,
  solarIrradiance,
  solarPowerMw,
  bessMode,
  bessPowerMw,
  bessSocPercent,
  totalExportMw,
  reactivePowerMvar,
  isPvGenerating,
  isBessActive,
  isBus33Energized,
  isTrafoHvEnergized,
  isGrid225Connected,
}) => {
  const [showTelemetryOverlay, setShowTelemetryOverlay] = useState<boolean>(true);
  const [showParticleFlow, setShowParticleFlow] = useState<boolean>(true);

  return (
    <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-6 relative overflow-hidden shadow-sm cad-grid-pattern">
      {/* Top Canvas Bar with Bus Status */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
          <span className="text-slate-500 font-semibold">STATUS:</span>
          <span className="font-bold text-sky-800">
            {activeTopology === 'single_bus' && (
              isBus225Energized ? 'JEU DE BARRES 225 kV SOUS TENSION' : 'JEU DE BARRES 225 kV HORS TENSION'
            )}
            {activeTopology === 'double_bus' && (
              `BARRE 1: ${isBusA_Energized ? 'ACTIVE (225 kV)' : 'ISOLÉE'} | BARRE 2: ${isBusB_Energized ? 'ACTIVE (225 kV)' : 'ISOLÉE'} | COUPLAGE: ${isCouplerClosed ? 'COUPLE' : 'OUVERT'}`
            )}
            {activeTopology === 'breaker_and_half' && (
              `BARRE 1: ${isBus1_Energized ? 'ACTIVE (225 kV)' : 'ISOLÉE'} | BARRE 2: ${isBus2_Energized ? 'ACTIVE (225 kV)' : 'ISOLÉE'} | DJ CENTRAL 52-M: ${q0_bh_m ? 'FERMÉ (INTERCONNEXION)' : 'OUVERT'} | LIGNE 1: ${isLine1Bh_Energized ? 'EN SERVICE' : 'ISOLÉE'} | LIGNE 2: ${isLine2Bh_Energized ? 'EN SERVICE' : 'ISOLÉE'}`
            )}
            {activeTopology === 'rmu_distribution' && (
              `RMU 30 kV: ${isRmuBus_Energized ? 'SOUS TENSION' : 'ISOLÉ'} | TGBT 400 V: ${isTgbt_Energized ? 'EN SERVICE (400 V)' : 'HORS TENSION'}`
            )}
            {activeTopology === 'solar_bess' && (
              `SOLAIRE PV: ${isPvGenerating ? `${solarPowerMw.toFixed(1)} MW` : '0 MW'} | BESS: ${isBessActive ? (bessPowerMw >= 0 ? `+${bessPowerMw.toFixed(1)} MW (DÉCHARGE)` : `${bessPowerMw.toFixed(1)} MW (CHARGE)`) : 'VEILLE'} · SOC ${bessSocPercent}% | BARRE 33 kV: ${isBus33Energized ? 'SOUS TENSION' : 'ISOLÉE'} | RÉSEAU 225 kV: ${isGrid225Connected ? `INJECTION ${totalExportMw.toFixed(1)} MW` : 'DÉCOUPLÉ'}`
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <button
            type="button"
            onClick={() => setShowParticleFlow(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
              showParticleFlow
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
            title={locale === 'fr' ? 'Activer/Désactiver le flux d\'électrons' : 'Toggle electron particle flow'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{showParticleFlow ? (locale === 'fr' ? 'Flux Électrons ON' : 'Electron Flow ON') : (locale === 'fr' ? 'Flux OFF' : 'Flow OFF')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTelemetryOverlay(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
              showTelemetryOverlay
                ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
            title={locale === 'fr' ? 'Activer/Désactiver les incrustations de télémesures SCADA sur le schéma' : 'Toggle live SCADA telemetry badges on SLD'}
          >
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>{showTelemetryOverlay ? (locale === 'fr' ? 'Télémesures ON' : 'Telemetry ON') : (locale === 'fr' ? 'Télémesures OFF' : 'Telemetry OFF')}</span>
          </button>
        </div>
      </div>

      {/* SVG Schematic Layer */}
      <div ref={svgContainerRef} className="w-full flex justify-center py-4 relative">
        {showParticleFlow && (
          <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-50 z-10">
            <ElectronParticleFlowCanvas
              isEnergized={isLineEnergized || isBusA_Energized || isBusB_Energized || isBus1_Energized || isRmuBus_Energized || isBus33Energized}
              voltageKv={225}
              intensity={0.8}
              enableMagneticMouse={true}
              className="w-full h-full"
            />
          </div>
        )}
        {activeTopology === 'single_bus' && (
          <SingleBusSubstationSvg
            qs_line={qs_line}
            q0_line={q0_line}
            qs_trafo={qs_trafo}
            q0_trafo_hv={q0_trafo_hv}
            q0_trafo_mv={q0_trafo_mv}
            q0_f1={q0_f1}
            q0_f2={q0_f2}
            q0_f3={q0_f3}
            q8_line={q8_line}
            onToggle={handleToggle}
            isLineEnergized={isLineEnergized}
            isBus225Energized={isBus225Energized}
            isTrafoEnergized={isTrafoEnergized}
            isBus30Energized={isBus30Energized}
            u_hv_nom={u_hv_nom}
            u_mv_nom={u_mv_nom}
            trafoTap={trafoTap}
            activeLoadMw={activeLoadMw}
            current_hv={current_hv}
            current_mv={current_mv}
            showTelemetryOverlay={showTelemetryOverlay}
            activeFault={activeFault}
            onOpenTcc={onOpenTcc}
          />
        )}

        {activeTopology === 'double_bus' && (
          <DoubleBusSubstationSvg
            qs_bc1={qs_bc1}
            q0_bc={q0_bc}
            qs_bc2={qs_bc2}
            qs1_a={qs1_a}
            qs1_b={qs1_b}
            q0_1={q0_1}
            qs1_line={qs1_line}
            q8_1={q8_1}
            qs2_a={qs2_a}
            qs2_b={qs2_b}
            q0_2={q0_2}
            qs2_line={qs2_line}
            q8_2={q8_2}
            qst_a={qst_a}
            qst_b={qst_b}
            q0_t={q0_t}
            onToggle={handleToggle}
            isBusA_Energized={isBusA_Energized}
            isBusB_Energized={isBusB_Energized}
            isLine1_Energized={isLine1_Energized}
            isLine2_Energized={isLine2_Energized}
            isTrafo_Energized={isTrafo_Energized}
            showTelemetryOverlay={showTelemetryOverlay}
            activeFault={activeFault}
          />
        )}

        {activeTopology === 'breaker_and_half' && (
          <BreakerAndHalfSubstationSvg
            qs_bh_1a={qs_bh_1a}
            q0_bh_1={q0_bh_1}
            qs_bh_1b={qs_bh_1b}
            q8_bh_cb1={q8_bh_cb1}
            qs_bh_l1={qs_bh_l1}
            q8_bh_1={q8_bh_1}
            qs_bh_m1={qs_bh_m1}
            q0_bh_m={q0_bh_m}
            qs_bh_m2={qs_bh_m2}
            q8_bh_cbm={q8_bh_cbm}
            qs_bh_l2={qs_bh_l2}
            q8_bh_2={q8_bh_2}
            qs_bh_2a={qs_bh_2a}
            q0_bh_2={q0_bh_2}
            qs_bh_2b={qs_bh_2b}
            q8_bh_cb2={q8_bh_cb2}
            isBus1_Energized={isBus1_Energized}
            isBus2_Energized={isBus2_Energized}
            isLine1_Energized={isLine1Bh_Energized}
            isLine2_Energized={isLine2Bh_Energized}
            isNode1_Energized={isNode1_Energized}
            isNode2_Energized={isNode2_Energized}
            isCbmPath_Energized={isCbmPath_Energized}
            onToggle={handleToggle}
            locale={locale}
            activeFault={activeFault}
          />
        )}

        {activeTopology === 'rmu_distribution' && (
          <RmuDistributionSvg
            lbs1={lbs1}
            q8_1={q8_rmu1}
            lbs2={lbs2}
            q8_rmu2={q8_rmu2}
            q0_trafo_mv={q0_rmu_t}
            q8_t={q8_rmu_t}
            q0_bt={q0_bt}
            q0_bt_f1={q0_bt_f1}
            q0_bt_f2={q0_bt_f2}
            q0_bt_f3={q0_bt_f3}
            isRing1_Energized={isRing1_Energized}
            isRing2_Energized={isRing2_Energized}
            isRmuBus_Energized={isRmuBus_Energized}
            isDistTrafo_Energized={isDistTrafo_Energized}
            isTgbt_Energized={isTgbt_Energized}
            activeFault={activeFault}
            onToggle={handleToggle}
          />
        )}

        {activeTopology === 'solar_bess' && (
          <SolarBessSubstationSvg
            q0_pv={q0_pv}
            q8_pv={q8_pv}
            q0_bess={q0_bess}
            q8_bess={q8_bess}
            q0_aux={q0_aux}
            qs_33_t={qs_33_t}
            q0_33_t={q0_33_t}
            q0_225={q0_225_sb}
            qs_225_line={qs_225_line_sb}
            q8_225={q8_225_sb}
            solarIrradiance={solarIrradiance}
            solarPowerMw={solarPowerMw}
            bessMode={bessMode}
            bessPowerMw={bessPowerMw}
            bessSocPercent={bessSocPercent}
            totalExportMw={totalExportMw}
            reactivePowerMvar={reactivePowerMvar}
            isPvGenerating={isPvGenerating}
            isBessActive={isBessActive}
            isBus33Energized={isBus33Energized}
            isTrafoHvEnergized={isTrafoHvEnergized}
            isGrid225Connected={isGrid225Connected}
            showTelemetryOverlay={showTelemetryOverlay}
            activeFault={activeFault}
            onToggle={handleToggle}
          />
        )}
      </div>

      {/* Diagram Footer Controls */}
      <SldFaultSimulationPanel
        activeTopology={activeTopology}
        onSimulateFault={handleSimulateFault}
        onOpenTcc={onOpenTcc}
        locale={locale}
      />
    </div>
  );
};
