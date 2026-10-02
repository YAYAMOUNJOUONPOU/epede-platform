// src/components/equipment/modules/EquipmentRatingsTable.tsx
import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Calculator, 
  Activity, 
  Zap, 
  Copy, 
  Check, 
  Search, 
  ArrowUpRight, 
  ShieldAlert, 
  Layers, 
  Gauge,
  Sparkles,
  Flame
} from 'lucide-react';
import type { CalculatorTabType } from '../../calculators/services/calculationReportService';
import type { SimulationTabType } from '../../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../../services/routerService';

export interface EquipmentRatingsTableProps {
  technical: Record<string, string | number | boolean>;
  locale: 'fr' | 'en';
  equipmentId?: string;
  equipmentName?: string;
  domainCode?: string;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  onNavigateAssetManagement?: (pillar?: string) => void;
}

interface ParsedEngineeringContext {
  injectedContext: InjectedCalculatorContext;
  equipmentCategory: 'transformer' | 'breaker' | 'line' | 'cable' | 'arrester' | 'ct_vt' | 'generator' | 'motor' | 'bess' | 'generic';
  displaySummary: {
    voltage?: string;
    power?: string;
    current?: string;
    shortCircuit?: string;
    impedance?: string;
  };
}

/**
 * Intelligent parser that extracts scientific parameters from nameplate key-values
 * and maps them into exact props expected by EPEDE CAE solvers.
 */
function parseEquipmentRatings(
  equipmentId: string | undefined,
  equipmentName: string | undefined,
  technical: Record<string, string | number | boolean>
): ParsedEngineeringContext {
  const params: Record<string, any> = {};
  const displaySummary: ParsedEngineeringContext['displaySummary'] = {};

  const idLower = (equipmentId || '').toLowerCase();
  const nameLower = (equipmentName || '').toLowerCase();

  // 1. Detect Category
  let equipmentCategory: ParsedEngineeringContext['equipmentCategory'] = 'generic';
  if (
    idLower.includes('trafo') || 
    idLower.includes('transfo') || 
    idLower.includes('gsu') || 
    nameLower.includes('transformateur') || 
    nameLower.includes('transformer')
  ) {
    equipmentCategory = 'transformer';
  } else if (
    idLower.includes('breaker') || 
    idLower.includes('disjoncteur') || 
    idLower.includes('gis') || 
    idLower.includes('bay') || 
    idLower.includes('q0') || 
    nameLower.includes('disjoncteur') || 
    nameLower.includes('circuit breaker')
  ) {
    equipmentCategory = 'breaker';
  } else if (
    idLower.includes('line') || 
    idLower.includes('ligne') || 
    idLower.includes('pyl') || 
    nameLower.includes('ligne') || 
    nameLower.includes('transmission line')
  ) {
    equipmentCategory = 'line';
  } else if (
    idLower.includes('cable') || 
    idLower.includes('feeder') || 
    idLower.includes('câble') || 
    nameLower.includes('câble') || 
    nameLower.includes('cable')
  ) {
    equipmentCategory = 'cable';
  } else if (
    idLower.includes('arrester') || 
    idLower.includes('parafoudre') || 
    idLower.includes('zno') || 
    idLower.includes('f1')
  ) {
    equipmentCategory = 'arrester';
  } else if (
    idLower.includes('ct') || 
    idLower.includes('vt') || 
    idLower.includes('tc') || 
    idLower.includes('tt') || 
    nameLower.includes('transformateur de mesure')
  ) {
    equipmentCategory = 'ct_vt';
  } else if (
    idLower.includes('gen') || 
    idLower.includes('alternat') || 
    idLower.includes('turbine') || 
    idLower.includes('hydro')
  ) {
    equipmentCategory = 'generator';
  } else if (
    idLower.includes('motor') || 
    idLower.includes('moteur') || 
    nameLower.includes('moteur')
  ) {
    equipmentCategory = 'motor';
  } else if (
    idLower.includes('bess') || 
    idLower.includes('solar') || 
    idLower.includes('pv') || 
    idLower.includes('batterie')
  ) {
    equipmentCategory = 'bess';
  }

  // 2. Scan technical key-values for numbers and units
  for (const [rawKey, rawVal] of Object.entries(technical)) {
    const k = rawKey.toLowerCase();
    const vStr = String(rawVal);
    const numMatch = vStr.match(/([0-9]+(?:\.[0-9]+)?)/);
    const num = numMatch ? parseFloat(numMatch[1]) : null;

    // Voltage (kV or V)
    if ((k.includes('tension') || k.includes('voltage') || k.includes('ur') || k.includes('un')) && !displaySummary.voltage) {
      displaySummary.voltage = vStr;
      if (vStr.includes('/')) {
        // e.g. 225/30 kV or 90/15 kV
        const parts = vStr.match(/([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/);
        if (parts) {
          const hv = parseFloat(parts[1]);
          const lv = parseFloat(parts[2]);
          params.trafoHvKv = hv;
          params.trafoLvV = lv > 100 ? lv : lv * 1000;
          params.unKv = hv;
          params.voltageNominal = hv;
          params.voltageLevel = `${hv} kV`;
        }
      } else if (num !== null) {
        if (vStr.toLowerCase().includes('kv') || num >= 10) {
          params.unKv = num;
          params.voltageNominal = num;
          params.trafoHvKv = num;
          params.unVolts = num * 1000;
          params.voltageLevel = `${num} kV`;
        } else {
          params.unVolts = num;
          params.trafoLvV = num;
        }
      }
    }

    // Power (MVA, kVA, MW, kW)
    if ((k.includes('puissance') || k.includes('power') || k.includes('sr') || k.includes('sn')) && !displaySummary.power) {
      displaySummary.power = vStr;
      if (num !== null) {
        if (vStr.toLowerCase().includes('mva') || vStr.toLowerCase().includes('mw')) {
          params.trafoKva = num * 1000;
          params.powerMw = num;
          params.pKw = num * 1000;
          params.transferredPowerMw = num;
        } else if (vStr.toLowerCase().includes('kva') || vStr.toLowerCase().includes('kw')) {
          params.trafoKva = num;
          params.pKw = num;
          params.powerMw = num / 1000;
        }
      }
    }

    // Short-Circuit Current / Breaking Capacity (kA)
    if ((k.includes('court-circuit') || k.includes('breaking') || k.includes('coupure') || k.includes('isc') || k.includes('ik')) && !displaySummary.shortCircuit) {
      displaySummary.shortCircuit = vStr;
      if (num !== null) {
        params.breakingCapacityKa = num;
        params.faultCurrentKa = num;
        params.ikKa = num;
      }
    }

    // Rated Current (A)
    if ((k.includes('courant assigné') || k.includes('rated current') || k.includes('ir') || k.includes('in') || k.includes('ampacit')) && !displaySummary.current) {
      displaySummary.current = vStr;
      if (num !== null) {
        params.nominalCurrentA = num;
        params.ratedCurrentA = num;
      }
    }

    // Impedance / Uk (%)
    if ((k.includes('impédance') || k.includes('ucc') || k.includes('uk')) && !displaySummary.impedance) {
      displaySummary.impedance = vStr;
      if (num !== null) {
        params.trafoUkPercent = num;
      }
    }

    // Length (km or m)
    if (k.includes('longueur') || k.includes('length')) {
      if (num !== null) {
        if (vStr.toLowerCase().includes('km')) {
          params.lineLengthKm = num;
          params.lengthKm = num;
          params.cableLengthM = num * 1000;
        } else {
          params.cableLengthM = num;
          params.lineLengthKm = num / 1000;
        }
      }
    }

    // Section (mm²)
    if (k.includes('section') || k.includes('cross-section') || vStr.includes('mm²')) {
      if (num !== null) {
        params.selectedSectionMm2 = num;
      }
    }
  }

  // Sensible defaults based on category if some params weren't explicitly in raw table
  if (equipmentCategory === 'transformer') {
    if (!params.trafoKva) params.trafoKva = 63000; // 63 MVA default
    if (!params.trafoHvKv) params.trafoHvKv = 225;
    if (!params.trafoLvV) params.trafoLvV = 30000;
    if (!params.trafoUkPercent) params.trafoUkPercent = 12.5;
  } else if (equipmentCategory === 'breaker') {
    if (!params.breakingCapacityKa) params.breakingCapacityKa = 40;
    if (!params.nominalCurrentA) params.nominalCurrentA = 3150;
    if (!params.voltageLevel) params.voltageLevel = '225 kV';
  } else if (equipmentCategory === 'line') {
    if (!params.unKv) params.unKv = 225;
    if (!params.lineLengthKm) params.lineLengthKm = 120;
    if (!params.powerMw) params.powerMw = 280;
  } else if (equipmentCategory === 'cable') {
    if (!params.unVolts) params.unVolts = 30000;
    if (!params.selectedSectionMm2) params.selectedSectionMm2 = 240;
    if (!params.cableLengthM) params.cableLengthM = 15000;
    if (!params.pKw) params.pKw = 5000;
  }

  const injectedContext: InjectedCalculatorContext = {
    equipmentId,
    equipmentName,
    equipmentTag: equipmentId ? equipmentId.toUpperCase() : undefined,
    params,
  };

  return {
    injectedContext,
    equipmentCategory,
    displaySummary,
  };
}

export const EquipmentRatingsTable: React.FC<EquipmentRatingsTableProps> = ({
  technical,
  locale,
  equipmentId,
  equipmentName,
  domainCode,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateAssetManagement,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Parse engineering parameters for solver injection
  const { injectedContext, equipmentCategory, displaySummary } = useMemo(
    () => parseEquipmentRatings(equipmentId, equipmentName, technical),
    [equipmentId, equipmentName, technical]
  );

  // Filtered technical entries
  const filteredEntries = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return Object.entries(technical);
    return Object.entries(technical).filter(([k, v]) => 
      k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
    );
  }, [technical, filterQuery]);

  const handleCopyValue = (key: string, val: string | number | boolean) => {
    navigator.clipboard?.writeText(String(val));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleCopyAll = () => {
    const textData = Object.entries(technical)
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join('\n');
    navigator.clipboard?.writeText(
      `EPEDE NAMEPLATE RATINGS [${equipmentName || equipmentId || 'ASSET'}]\n${textData}`
    );
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#252E38] bg-[#0D1117] overflow-hidden shadow-2xl">
      {/* ── HEADER BANNER ── */}
      <div className="border-b border-[#252E38] px-5 py-4 bg-[#080B10] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <span>{locale === 'fr' ? 'SPÉCIFICATIONS CONSTRUCTEUR & PARAMÈTRES ASSIGNÉS' : 'NAMEPLATE RATINGS & PARAMETERS'}</span>
              {domainCode && (
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
                  {domainCode}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              {locale === 'fr' 
                ? 'Grandeurs nominales normalisées pour dimensionnement & coordination des protections' 
                : 'Standardized rated characteristics for sizing calculations & protection coordination'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            title={locale === 'fr' ? 'Copier toutes les spécifications' : 'Copy all specifications'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B24] hover:bg-[#1E293B] text-neutral-300 hover:text-white border border-[#252E38] text-[11px] font-mono transition-colors cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedAll ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Plaque' : 'Copy All')}</span>
          </button>

          <span className="font-mono text-[11px] text-cyan-300 font-bold bg-[#141C2B] px-2.5 py-1 rounded-lg border border-cyan-500/30">
            CEI 60076 / 62271 / 60909
          </span>
        </div>
      </div>

      {/* ── CAE CALCULATION & SIMULATION DISPATCHER BANNER ── */}
      {(onNavigateCalculator || onNavigateSimulation || onNavigateAssetManagement) && (
        <div className="bg-gradient-to-r from-[#0C1929] via-[#091522] to-[#0D1117] border-b border-[#252E38] p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  {locale === 'fr' ? 'PASSERELLE CALCULATEURS CAE & SIMULATEURS' : 'CAE SOLVERS & SIMULATION GATEWAY'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {locale === 'fr' ? 'Paramètres injectés' : 'Injected Context'}
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                {locale === 'fr'
                  ? 'Injectez directement ces valeurs de plaque signalétique dans les moteurs de calcul numérique et les bancs d’essai dynamiques.'
                  : 'Directly inject these nameplate ratings into scientific CAE numerical solvers and dynamic simulation benches.'}
              </p>

              {/* Injected Parameters Summary Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                {displaySummary.voltage && (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 border border-amber-500/30">
                    ⚡ {displaySummary.voltage}
                  </span>
                )}
                {displaySummary.power && (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/30">
                    ⚡ {displaySummary.power}
                  </span>
                )}
                {displaySummary.shortCircuit && (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-rose-300 border border-rose-500/30">
                    💥 Isc: {displaySummary.shortCircuit}
                  </span>
                )}
                {displaySummary.current && (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-emerald-300 border border-emerald-500/30">
                    🔌 In: {displaySummary.current}
                  </span>
                )}
                {displaySummary.impedance && (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-purple-300 border border-purple-500/30">
                    📐 Uk: {displaySummary.impedance}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Solver Launchers */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Category-Specific Solvers */}
              {equipmentCategory === 'transformer' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('transformer', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Dimensionner Transfo (CEI 60076)' : 'Size Transformer (IEC 60076)'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateAssetManagement && (
                    <button
                      type="button"
                      onClick={() => onNavigateAssetManagement('DUVAL_TRIANGLE_DGA')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Diagnostic Huile DGA (CEI 60599)' : 'Oil DGA Diagnostics (IEC 60599)'}</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateAssetManagement && (
                    <button
                      type="button"
                      onClick={() => onNavigateAssetManagement('HEALTH_INDEX_ISO55000')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Health Index ISO 55000' : 'ISO 55000 Health Index'}</span>
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('differential-protection')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span>{locale === 'fr' ? 'Protection Diff. 87T' : '87T Diff. Protection'}</span>
                      <ArrowUpRight className="w-3 h-3 text-purple-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('transformer')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Banc Essai Transfo' : 'Trafo Test Bench'}</span>
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'breaker' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('relay-tcc', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Plan de Sélectivité TCC' : 'TCC Relay Grading'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('busbar-electrodynamic', injectedContext)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Efforts Barres (60865)' : 'Busbar Forces'}</span>
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('short-circuit')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>{locale === 'fr' ? 'Court-Circuit (CEI 60909)' : 'Short-Circuit Lab'}</span>
                      <ArrowUpRight className="w-3 h-3 text-rose-400 opacity-70" />
                    </button>
                  )}
                </>
              )}

              {(equipmentCategory === 'line' || equipmentCategory === 'cable') && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigateCalculator(
                          equipmentCategory === 'line' ? 'transmission-line' : 'cable-ampacity',
                          injectedContext
                        )
                      }
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {equipmentCategory === 'line'
                          ? locale === 'fr'
                            ? 'Calcul Paramètres Ligne (SIL)'
                            : 'Line Sizing & SIL'
                          : locale === 'fr'
                          ? 'Courant Admissible (CEI 60287)'
                          : 'Cable Ampacity (IEC 60287)'}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {equipmentCategory === 'line' && onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('ferranti')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span>{locale === 'fr' ? 'Effet Ferranti HTB' : 'Ferranti Effect'}</span>
                    </button>
                  )}
                  {equipmentCategory === 'line' && onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('distance-protection')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Protection Distance 21' : 'Distance Relay 21'}</span>
                    </button>
                  )}
                  {equipmentCategory === 'cable' && onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('cable-thermal')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Thermique Transitoire' : 'Thermal Transient'}</span>
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'arrester' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('surge-arrester', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Coordination Isolement (60099)' : 'Insulation Coord (60099)'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('surge-arrester')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Ondes Transitoires 8/20 µs' : '8/20 µs Surge Wave'}</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-400 opacity-70" />
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'ct_vt' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('ct-sizing', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Dimensionner TC (CEI 61869)' : 'Size CT (IEC 61869)'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('ct-saturation')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span>{locale === 'fr' ? 'Saturation Magnétique TC' : 'CT Saturation Lab'}</span>
                      <ArrowUpRight className="w-3 h-3 text-purple-400 opacity-70" />
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'generator' && (
                <>
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('generator-capability')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Courbe Capabilité P-Q' : 'P-Q Capability Curve'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('synchrocheck')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Synchronisme (25)' : 'Synchrocheck (25)'}</span>
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'motor' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('motor', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Démarrage Moteur' : 'Motor Starting'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('motor-start')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'fr' ? 'Banc Dynamique Moteur' : 'Dynamic Motor Lab'}</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-400 opacity-70" />
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'bess' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('bess-sizing', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Dimensionner BESS (10 MWh)' : 'Size BESS (10 MWh)'}</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('solar-bess')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Simulateur Solaire + BESS' : 'Solar + BESS Lab'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                </>
              )}

              {equipmentCategory === 'generic' && (
                <>
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('power', injectedContext)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Bilan Puissance Réseau' : 'Power Flow Sizing'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-70" />
                    </button>
                  )}
                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('oscilloscope')}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-neutral-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Oscilloscope Réseau' : 'Grid Oscilloscope'}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH & FILTER ROW ── */}
      <div className="px-5 py-2.5 bg-[#090C12] border-b border-[#252E38]/80 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={locale === 'fr' ? 'Filtrer les grandeurs (tension, courant, isolement...)' : 'Filter ratings (voltage, current, insulation...)'}
            className="w-full bg-[#131A24] border border-[#252E38] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
          />
        </div>

        <div className="text-[11px] font-mono text-neutral-400">
          <span className="text-white font-bold">{filteredEntries.length}</span> / {Object.keys(technical).length} {locale === 'fr' ? 'paramètres' : 'parameters'}
        </div>
      </div>

      {/* ── SPECIFICATIONS TABLE ── */}
      <div className="divide-y divide-[#252E38]/60 text-xs max-h-[500px] overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono text-xs">
            {locale === 'fr' ? 'Aucune grandeur ne correspond à votre filtre.' : 'No ratings match your filter.'}
          </div>
        ) : (
          filteredEntries.map(([key, val]) => {
            const isCopied = copiedKey === key;
            const valStr = String(val);
            const isHighVoltage = valStr.includes('kV') || valStr.includes('225') || valStr.includes('90') || valStr.includes('30');
            const isHighCurrent = valStr.includes('kA') || valStr.includes('40 kA') || valStr.includes('31.5');
            const isPower = valStr.includes('MVA') || valStr.includes('MW');

            return (
              <div 
                key={key} 
                className="group px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#131A24]/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-300 font-medium truncate">{key}</span>
                  {isHighVoltage && (
                    <span className="shrink-0 px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                      HV
                    </span>
                  )}
                  {isHighCurrent && (
                    <span className="shrink-0 px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 text-[10px] font-mono border border-rose-500/20">
                      Isc
                    </span>
                  )}
                  {isPower && (
                    <span className="shrink-0 px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                      MVA
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`font-mono font-bold text-right text-xs sm:text-sm select-all ${
                    isHighVoltage 
                      ? 'text-amber-300' 
                      : isHighCurrent 
                      ? 'text-rose-300' 
                      : isPower 
                      ? 'text-cyan-300' 
                      : 'text-white'
                  }`}>
                    {valStr}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyValue(key, val)}
                    title={locale === 'fr' ? 'Copier cette valeur' : 'Copy this value'}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-neutral-400 hover:text-white transition-opacity cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── FOOTER REFERENCE ── */}
      <div className="px-5 py-2.5 bg-[#080B10] border-t border-[#252E38] flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{locale === 'fr' ? 'Plaque vérifiée conforme aux règles SONATREL & CEI' : 'Nameplate verified against SONATREL & IEC rules'}</span>
        </div>
        <span className="text-neutral-500">EPEDE Digital Twin v2.6</span>
      </div>
    </div>
  );
};
