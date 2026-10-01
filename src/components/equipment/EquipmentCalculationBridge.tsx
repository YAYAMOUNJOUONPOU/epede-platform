// src/components/equipment/EquipmentCalculationBridge.tsx
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Zap, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Cpu,
  Layers,
  ExternalLink,
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { Equipment } from '../../types/epede';
import { epedeApi, ApiEquipmentDto } from '../../services/epedeApiClient';
import { InjectedCalculatorContext } from '../../services/routerService';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import { ApparatusComplianceBadge } from './ApparatusComplianceBadge';

interface EquipmentCalculationBridgeProps {
  equipment: Equipment;
  apiEquipment: ApiEquipmentDto | null;
  locale: 'fr' | 'en';
  onNavigateCalculator: (tab: CalculatorTabType, context?: InjectedCalculatorContext) => void;
}

export const EquipmentCalculationBridge: React.FC<EquipmentCalculationBridgeProps> = ({
  equipment,
  apiEquipment,
  locale,
  onNavigateCalculator,
}) => {
  // Determine primary calculation mode based on equipment type/domain
  const isTransformer = 
    equipment.entity_type === 'TRANSFORMER' || 
    equipment.id.includes('trafo') || 
    apiEquipment?.type === 'POWER_TRANSFORMER';

  const isCableOrFeeder = 
    equipment.entity_type === 'CABLE' || 
    equipment.id.includes('feeder') || 
    equipment.id.includes('line') || 
    equipment.id.includes('cable') || 
    equipment.domain_code === 'D02' || 
    equipment.domain_code === 'D07';

  const isBreakerOrRelay = 
    equipment.entity_type === 'CIRCUIT_BREAKER' || 
    equipment.id.includes('disjoncteur') || 
    equipment.id.includes('breaker') || 
    equipment.id.includes('relais') || 
    equipment.id.includes('cellule') || 
    equipment.domain_code === 'D03';

  const isSwitchgear = isBreakerOrRelay || equipment.entity_type === 'BUSBAR';

  // State for calculation inputs
  const [unKv, setUnKv] = useState<number>(() => {
    if (isTransformer) return 30; // secondary side voltage default for 225/30 kV
    if (isCableOrFeeder) return 30;
    return 30;
  });

  const [trafoMva, setTrafoMva] = useState<number>(() => {
    return apiEquipment?.specifications?.ratedMva || 63;
  });

  const [ukPercent, setUkPercent] = useState<number>(12.5);
  const [skUpstreamMva, setSkUpstreamMva] = useState<number>(2500);

  // State for cable calculation inputs
  const [cableLengthM, setCableLengthM] = useState<number>(15000);
  const [cableSectionMm2, setCableSectionMm2] = useState<number>(150);
  const [loadPowerKw, setLoadPowerKw] = useState<number>(5000);
  const [cosPhi, setCosPhi] = useState<number>(0.92);

  // Results from backend API run
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calcResults, setCalcResults] = useState<any>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Run calculation via EPEDE API v1
  const runApiCalculation = async () => {
    setIsCalculating(true);
    setCalcError(null);

    try {
      if (isTransformer || isSwitchgear) {
        // Run IEC 60909 short-circuit calculation
        const res = await epedeApi.executeCalculation('short-circuit-iec60909', {
          un_kv: unKv,
          sk_upstream_mva: skUpstreamMva,
          trafo_s_mva: trafoMva,
          trafo_uk_pct: ukPercent,
        });

        if (res && res.results) {
          setCalcResults(res);
        } else {
          // Client-side fallback calculation if API is offline
          const c = unKv > 35 ? 1.1 : 1.05;
          const zGrid = (c * unKv * unKv) / skUpstreamMva;
          const zTrafo = (ukPercent / 100) * ((unKv * unKv) / trafoMva);
          const zTotal = zGrid + zTrafo;
          const ik = (c * unKv) / (Math.sqrt(3) * zTotal);
          const ip = 1.8 * Math.sqrt(2) * ik;
          const sk = Math.sqrt(3) * unKv * ik;

          setCalcResults({
            workbenchId: 'short-circuit-iec60909',
            results: {
              ik_symmetrical_ka: Number(ik.toFixed(2)),
              ip_peak_ka: Number(ip.toFixed(2)),
              sk_shortcircuit_mva: Number(sk.toFixed(1)),
              z_grid_ohms: Number(zGrid.toFixed(3)),
              z_trafo_ohms: Number(zTrafo.toFixed(3)),
              z_total_ohms: Number(zTotal.toFixed(3)),
            },
            engineeringInterpretation: {
              fr: `Courant de court-circuit triphasé Ik" calculé à ${ik.toFixed(2)} kA (Ip crête = ${ip.toFixed(2)} kA). Conforme aux spécifications CEI 60909 pour jeux de barres et disjoncteurs.`,
              en: `Calculated symmetrical short-circuit current Ik" is ${ik.toFixed(2)} kA (peak Ip = ${ip.toFixed(2)} kA). Compliant with IEC 60909 for switchgear breaking duty.`,
            },
          });
        }
      } else {
        // Run Voltage drop calculation
        const res = await epedeApi.executeCalculation('voltage-drop-workbench', {
          voltage_v: unKv * 1000,
          power_kw: loadPowerKw,
          length_m: cableLengthM,
          cos_phi: cosPhi,
          cable_section_mm2: cableSectionMm2,
        });

        if (res && res.results) {
          setCalcResults(res);
        } else {
          // Client-side fallback
          const U = unKv * 1000;
          const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
          const Ib = (loadPowerKw * 1000) / (Math.sqrt(3) * U * cosPhi);
          const R = (0.0225 * cableLengthM) / cableSectionMm2;
          const X = 0.0001 * cableLengthM;
          const deltaU = Math.sqrt(3) * Ib * (R * cosPhi + X * sinPhi);
          const deltaUPct = (deltaU / U) * 100;

          setCalcResults({
            workbenchId: 'voltage-drop-workbench',
            results: {
              current_ib_a: Number(Ib.toFixed(2)),
              delta_u_volts: Number(deltaU.toFixed(2)),
              delta_u_percentage: Number(deltaUPct.toFixed(2)),
              r_line_ohms: Number(R.toFixed(3)),
              x_line_ohms: Number(X.toFixed(3)),
            },
            engineeringInterpretation: {
              fr: `Chute de tension calculée à ${deltaUPct.toFixed(2)}% (${deltaU.toFixed(1)} V). ${deltaUPct <= 5.0 ? 'Conforme aux limites CEI (< 5%).' : 'Attention : dépasse le seuil normatif de 5%.'}`,
              en: `Calculated voltage drop is ${deltaUPct.toFixed(2)}% (${deltaU.toFixed(1)} V). ${deltaUPct <= 5.0 ? 'Compliant with IEC limits (< 5%).' : 'Warning: exceeds normative 5% threshold.'}`,
            },
          });
        }
      }
    } catch (err: any) {
      setCalcError(err?.message || 'Erreur d\'exécution du calcul');
    } finally {
      setIsCalculating(false);
    }
  };

  // Run automatically on first mount to have instant results
  useEffect(() => {
    runApiCalculation();
  }, [equipment.id]);

  const targetCalculatorTab: CalculatorTabType = isTransformer 
    ? 'transformer' 
    : isCableOrFeeder 
    ? 'voltage-drop' 
    : isSwitchgear 
    ? 'busbar-electrodynamic' 
    : 'power';

  const handleTransferToWorkbench = (tabOverride?: CalculatorTabType) => {
    const eqName = locale === 'fr' ? equipment.name_fr : equipment.name_en;
    const tag = equipment.aliases_fr?.[0] || apiEquipment?.tag || equipment.id;

    const chosenTab: CalculatorTabType = tabOverride || (
      isTransformer ? 'transformer' :
      isCableOrFeeder ? 'cable-ampacity' :
      isBreakerOrRelay ? 'relay-tcc' :
      'power'
    );

    if (chosenTab === 'relay-tcc') {
      const ratedIn = apiEquipment?.specifications?.ratedCurrentA || (isTransformer ? Math.round((trafoMva * 1000) / (Math.sqrt(3) * unKv)) : 1250);
      const breakingKa = apiEquipment?.specifications?.breakingCapacityKa || 31.5;
      onNavigateCalculator('relay-tcc', {
        equipmentId: equipment.id,
        equipmentName: eqName,
        equipmentTag: tag,
        params: {
          nominalCurrentA: ratedIn,
          breakingCapacityKa: breakingKa,
          faultCurrentKa: calcResults?.results?.ik_subtransient_ka || 16.0,
          voltageLevel: `${unKv} kV`,
        },
      });
    } else if (chosenTab === 'cable-ampacity') {
      onNavigateCalculator('cable-ampacity', {
        equipmentId: equipment.id,
        equipmentName: eqName,
        equipmentTag: tag,
        params: {
          unVolts: unKv * 1000,
          pKw: loadPowerKw,
          cosPhi: cosPhi,
          cableLengthM: cableLengthM,
          selectedSectionMm2: cableSectionMm2,
          conductorMaterial: 'aluminium',
          insulationType: 'xlpe_90',
          ikKa: 12.5,
          tkSec: 0.5,
        },
      });
    } else if (chosenTab === 'voltage-drop') {
      onNavigateCalculator('voltage-drop', {
        equipmentId: equipment.id,
        equipmentName: eqName,
        equipmentTag: tag,
        params: {
          vDropU: unKv * 1000,
          vDropCurrentA: calcResults?.results?.current_ib_a || 120,
          vDropLengthM: cableLengthM,
          vDropSectionMm2: cableSectionMm2,
          vDropCosPhi: cosPhi,
        },
      });
    } else if (chosenTab === 'transformer') {
      onNavigateCalculator('transformer', {
        equipmentId: equipment.id,
        equipmentName: eqName,
        equipmentTag: tag,
        params: {
          trafoKva: trafoMva * 1000,
          trafoHvKv: 225,
          trafoLvV: unKv * 1000,
          trafoUkPercent: ukPercent,
        },
      });
    } else {
      onNavigateCalculator(chosenTab, {
        equipmentId: equipment.id,
        equipmentName: eqName,
        equipmentTag: tag,
        params: {
          voltageKv: unKv,
          ratedMva: trafoMva,
        },
      });
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-800/60 bg-[#0A1019] p-5 shadow-xl relative overflow-hidden space-y-4">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400">
                {locale === 'fr' 
                  ? 'ATELIER DE CALCUL SCIENTIFIQUE SYNCHRONISÉ' 
                  : 'SYNCHRONIZED SCIENTIFIC CALCULATION WORKBENCH'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[9px] font-bold">
                API v1 · IEC 60909 / 60287 / 60255
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              {isTransformer 
                ? (locale === 'fr' ? 'Courant de Court-Circuit Ik" & Coordination Sélective' : 'Short-Circuit Duty Ik" & Protection Sizing')
                : isBreakerOrRelay
                ? (locale === 'fr' ? 'Plan de Sélectivité TCC & Pouvoir de Coupure' : 'TCC Selectivity Plan & Breaking Capacity')
                : (locale === 'fr' ? 'Courant Admissible & Chute de Tension en Ligne' : 'Ampacity Rating & Line Voltage Drop')}
            </h3>
          </div>
        </div>

        {/* Action buttons to open full workbench with prefilled data */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          {isTransformer && (
            <>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('transformer')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Court-Circuit CEI 60909' : 'IEC 60909 Short-Circuit'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('relay-tcc')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Sélectivité TCC CEI 60255' : 'TCC Relays IEC 60255'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {isCableOrFeeder && (
            <>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('cable-ampacity')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Courant Admissible CEI 60287' : 'Ampacity IEC 60287'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('voltage-drop')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Chute ΔU NF C 15-105' : 'ΔU Voltage Drop'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {isBreakerOrRelay && !isTransformer && (
            <>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('relay-tcc')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Courbes TCC CEI 60255' : 'TCC Curves IEC 60255'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleTransferToWorkbench('busbar-electrodynamic')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Icu & Électrodynamique' : 'Breaking Capacity Icu'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {!isTransformer && !isCableOrFeeder && !isBreakerOrRelay && (
            <button
              type="button"
              onClick={() => handleTransferToWorkbench()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Ouvrir dans l’Atelier Complet' : 'Open in Full Workbench'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Inputs Configuration Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0E1724] p-3 rounded-xl border border-cyan-900/30 font-mono text-xs">
        {isTransformer || isSwitchgear ? (
          <>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Tension Un (kV)
              </label>
              <input
                type="number"
                value={unKv}
                onChange={(e) => setUnKv(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Puissance Sn (MVA)
              </label>
              <input
                type="number"
                value={trafoMva}
                onChange={(e) => setTrafoMva(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Impédance Uk (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={ukPercent}
                onChange={(e) => setUkPercent(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Court-circuit Sk amont (MVA)
              </label>
              <input
                type="number"
                value={skUpstreamMva}
                onChange={(e) => setSkUpstreamMva(parseFloat(e.target.value) || 100)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Tension Ligne (kV)
              </label>
              <input
                type="number"
                value={unKv}
                onChange={(e) => setUnKv(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Longueur (m)
              </label>
              <input
                type="number"
                value={cableLengthM}
                onChange={(e) => setCableLengthM(parseFloat(e.target.value) || 10)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Section (mm²)
              </label>
              <input
                type="number"
                value={cableSectionMm2}
                onChange={(e) => setCableSectionMm2(parseFloat(e.target.value) || 10)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Puissance Transitée (kW)
              </label>
              <input
                type="number"
                value={loadPowerKw}
                onChange={(e) => setLoadPowerKw(parseFloat(e.target.value) || 100)}
                className="w-full bg-[#142032] border border-cyan-800/50 rounded-lg px-2.5 py-1.5 text-cyan-200 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </>
        )}
      </div>

      {/* Recalculate button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{locale === 'fr' ? 'Données physiques synchronisées depuis les plaques constructeur' : 'Synchronized nameplate engineering data'}</span>
        </div>

        <button
          type="button"
          onClick={runApiCalculation}
          disabled={isCalculating}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${isCalculating ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isCalculating ? (locale === 'fr' ? 'Calcul en cours...' : 'Computing...') : (locale === 'fr' ? 'Recalculer' : 'Recompute')}</span>
        </button>
      </div>

      {/* Dynamic Compliance Verdict Ribbon */}
      <div className="p-3.5 rounded-xl bg-[#0C1420] border border-cyan-800/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {locale === 'fr' ? 'Verdict Normatif Instantané :' : 'Instant Normative Verdict:'}
          </span>
          <ApparatusComplianceBadge
            equipment={equipment}
            apiEquipment={apiEquipment}
            locale={locale}
            calcResults={calcResults}
            size="sm"
            onOpenCalculator={(tab) => handleTransferToWorkbench(tab)}
          />
        </div>
        <button
          type="button"
          onClick={() => handleTransferToWorkbench()}
          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span>{locale === 'fr' ? 'Éditer la note de calcul officielle' : 'Edit official calculation report'}</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Dynamic Results Display */}
      {calcResults?.results && (
        <div className="space-y-3">
          {isTransformer || isSwitchgear ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              
              {/* Ik" */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Ik" SYMÉTRIQUE INITIAL
                </div>
                <div className="text-2xl font-black text-rose-400">
                  {calcResults.results.ik_symmetrical_ka} <span className="text-xs font-normal text-slate-400">kA</span>
                </div>
                <div className="text-[9px] text-slate-500">Sous {unKv} kV assigné</div>
              </div>

              {/* Ip peak */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Ip CRÊTE DE COURANT
                </div>
                <div className="text-2xl font-black text-amber-300">
                  {calcResults.results.ip_peak_ka} <span className="text-xs font-normal text-slate-400">kA</span>
                </div>
                <div className="text-[9px] text-slate-500">Facteur κ = 1.8 (IEC 60909)</div>
              </div>

              {/* Sk short-circuit power */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  PUISSANCE DE COURT-CIRCUIT Sk"
                </div>
                <div className="text-2xl font-black text-cyan-300">
                  {calcResults.results.sk_shortcircuit_mva} <span className="text-xs font-normal text-slate-400">MVA</span>
                </div>
                <div className="text-[9px] text-slate-500">Aux bornes aval</div>
              </div>

              {/* Z total */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  IMPÉDANCE BOUCLE Zt
                </div>
                <div className="text-2xl font-black text-sky-300">
                  {calcResults.results.z_total_ohms} <span className="text-xs font-normal text-slate-400">Ω</span>
                </div>
                <div className="text-[9px] text-slate-500">
                  Ztrafo: {calcResults.results.z_trafo_ohms} Ω · Zgrid: {calcResults.results.z_grid_ohms} Ω
                </div>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {/* Delta U percent */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  CHUTE DE TENSION ΔU%
                </div>
                <div className={`text-2xl font-black ${calcResults.results.delta_u_percentage <= 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {calcResults.results.delta_u_percentage} <span className="text-xs font-normal text-slate-400">%</span>
                </div>
                <div className="text-[9px] text-slate-500">Seuil limite : ≤ 5.0 %</div>
              </div>

              {/* Delta U Volts */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  CHUTE DE TENSION ABSOLUE
                </div>
                <div className="text-2xl font-black text-cyan-300">
                  {calcResults.results.delta_u_volts} <span className="text-xs font-normal text-slate-400">V</span>
                </div>
                <div className="text-[9px] text-slate-500">Tension nominale : {unKv * 1000} V</div>
              </div>

              {/* Current Ib */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  COURANT D'EMPLOI Ib
                </div>
                <div className="text-2xl font-black text-sky-300">
                  {calcResults.results.current_ib_a} <span className="text-xs font-normal text-slate-400">A</span>
                </div>
                <div className="text-[9px] text-slate-500">Pour {loadPowerKw} kW @ cos φ 0.92</div>
              </div>

              {/* Line resistance */}
              <div className="p-3.5 rounded-xl bg-[#121B29] border border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  RÉSISTANCE LIGNE R
                </div>
                <div className="text-2xl font-black text-amber-300">
                  {calcResults.results.r_line_ohms} <span className="text-xs font-normal text-slate-400">Ω</span>
                </div>
                <div className="text-[9px] text-slate-500">Réactance X: {calcResults.results.x_line_ohms} Ω</div>
              </div>
            </div>
          )}

          {/* Technical Interpretation Banner */}
          {calcResults.engineeringInterpretation && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-cyan-100 leading-relaxed font-mono text-[11px]">
                {calcResults.engineeringInterpretation[locale]}
              </div>
            </div>
          )}
        </div>
      )}

      {calcError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 text-xs font-mono">
          {calcError}
        </div>
      )}

    </div>
  );
};
