// src/components/calculators/modules/TransformerCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Zap, Cpu, CheckCircle2, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { epedeApi } from '../../../services/epedeApiClient';

interface TransformerCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: {
    trafoKva?: number;
    trafoHvKv?: number;
    trafoLvV?: number;
    trafoUkPercent?: number;
  };
  injectedContextInfo?: {
    equipmentName?: string;
    equipmentTag?: string;
  };
}

export const TransformerCalculator: React.FC<TransformerCalculatorProps> = ({ 
  locale,
  initialParams,
  injectedContextInfo,
}) => {
  // 3. TRANSFORMER SIZING & SHORT-CIRCUIT
  const [trafoKva, setTrafoKva] = useState<number>(initialParams?.trafoKva || 1000);
  const [trafoHvKv, setTrafoHvKv] = useState<number>(initialParams?.trafoHvKv || 20);
  const [trafoLvV, setTrafoLvV] = useState<number>(initialParams?.trafoLvV || 400);
  const [trafoUkPercent, setTrafoUkPercent] = useState<number>(initialParams?.trafoUkPercent || 4.5);
  const [skUpstreamMva, setSkUpstreamMva] = useState<number>(2500);

  // Backend API IEC 60909 run state
  const [apiResult, setApiResult] = useState<any>(null);
  const [isComputingApi, setIsComputingApi] = useState<boolean>(false);

  // Sync if initialParams changes
  useEffect(() => {
    if (initialParams?.trafoKva !== undefined) setTrafoKva(initialParams.trafoKva);
    if (initialParams?.trafoHvKv !== undefined) setTrafoHvKv(initialParams.trafoHvKv);
    if (initialParams?.trafoLvV !== undefined) setTrafoLvV(initialParams.trafoLvV);
    if (initialParams?.trafoUkPercent !== undefined) setTrafoUkPercent(initialParams.trafoUkPercent);
  }, [initialParams]);

  // In_LV = S / (sqrt(3) * U_LV)
  const inLvAmps = (trafoKva * 1000) / (Math.sqrt(3) * trafoLvV);
  // Isc_LV = In_LV / (uk / 100)
  const iscTrafoLvKa = (inLvAmps / (trafoUkPercent / 100)) / 1000;
  // In_HV = S / (sqrt(3) * U_HV)
  const inHvAmps = trafoKva / (Math.sqrt(3) * trafoHvKv);

  // Run backend calculation
  const handleRunBackendIec60909 = async () => {
    setIsComputingApi(true);
    try {
      const res = await epedeApi.executeCalculation('short-circuit-iec60909', {
        un_kv: trafoLvV / 1000,
        sk_upstream_mva: skUpstreamMva,
        trafo_s_mva: trafoKva / 1000,
        trafo_uk_pct: trafoUkPercent,
      });
      if (res) {
        setApiResult(res);
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsComputingApi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Injected Equipment Badge Banner if applicable */}
      {injectedContextInfo && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-700/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300">
              {locale === 'fr' ? 'Paramètres synchronisés depuis l’équipement :' : 'Parameters synchronized from equipment:'}
            </span>
            <span className="text-white font-bold">{injectedContextInfo.equipmentName}</span>
            {injectedContextInfo.equipmentTag && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-bold">
                {injectedContextInfo.equipmentTag}
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
            SYNC OK
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
            <span>{locale === 'fr' ? 'DIMENSIONNEMENT DU TRANSFORMATEUR & POUVOIR DE COURT-CIRCUIT' : 'TRANSFORMER & ISC'}</span>
            <span className="text-cyan-400 font-extrabold">{trafoKva >= 1000 ? `${(trafoKva / 1000).toFixed(1)} MVA` : `${trafoKva} kVA`}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">COURANT SECONDAIRE NOMINAL (In2)</div>
              <div className="text-2xl font-black text-cyan-300">
                {inLvAmps.toFixed(0)} <span className="text-sm font-normal text-neutral-400">A</span>
              </div>
              <div className="text-[10px] text-neutral-500">Sous {trafoLvV} V</div>
            </div>

            <div className="bg-[#161C24] p-4 rounded-xl border border-red-900/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">COURANT COURT-CIRCUIT (Isc2)</div>
              <div className="text-2xl font-black text-red-400">
                {iscTrafoLvKa.toFixed(1)} <span className="text-sm font-normal text-neutral-400">kA</span>
              </div>
              <div className="text-[10px] text-neutral-500">Aux bornes BT/HTA (uk = {trafoUkPercent}%)</div>
            </div>

            <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">COURANT PRIMAIRE NOMINAL (In1)</div>
              <div className="text-2xl font-black text-sky-400">
                {inHvAmps.toFixed(1)} <span className="text-sm font-normal text-neutral-400">A</span>
              </div>
              <div className="text-[10px] text-neutral-500">Sous {trafoHvKv} kV</div>
            </div>
          </div>

          <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
            <div className="text-cyan-400 font-bold uppercase text-[11px] flex items-center justify-between">
              <span>CALCUL DU POUVOIR DE COUPURE DES DISJONCTEURS (CEI 60947-2 / CEI 62271-100)</span>
              <button
                type="button"
                onClick={handleRunBackendIec60909}
                disabled={isComputingApi}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-[10px] transition-all cursor-pointer"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isComputingApi ? 'animate-spin' : ''}`} />
                <span>{isComputingApi ? (locale === 'fr' ? 'Calcul API...' : 'Computing...') : (locale === 'fr' ? 'Évaluer avec API IEC 60909' : 'Run API IEC 60909')}</span>
              </button>
            </div>
            <p className="text-neutral-300 leading-relaxed font-sans">
              Le disjoncteur général situé immédiatement en aval du transformateur doit présenter un pouvoir de coupure ultime <strong>Icu ≥ {iscTrafoLvKa.toFixed(1)} kA</strong>.
            </p>
          </div>

          {/* Backend API IEC 60909 Breakdown Card */}
          {apiResult?.results && (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700/60 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  {locale === 'fr' ? 'RÉSULTATS DE SIMULATION CANONIQUE IEC 60909 (API v1)' : 'CANONICAL IEC 60909 SIMULATION RESULTS (API v1)'}
                </span>
                <span className="text-[10px] text-slate-400">{apiResult.status}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0A1019] border border-cyan-900/50">
                  <div className="text-[9px] text-slate-400">Ik" SYMÉTRIQUE</div>
                  <div className="text-lg font-black text-rose-400">{apiResult.results.ik_symmetrical_ka} kA</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A1019] border border-cyan-900/50">
                  <div className="text-[9px] text-slate-400">Ip CRÊTE</div>
                  <div className="text-lg font-black text-amber-300">{apiResult.results.ip_peak_ka} kA</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A1019] border border-cyan-900/50">
                  <div className="text-[9px] text-slate-400">Sk" PUISSANCE</div>
                  <div className="text-lg font-black text-cyan-300">{apiResult.results.sk_shortcircuit_mva} MVA</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A1019] border border-cyan-900/50">
                  <div className="text-[9px] text-slate-400">Z TOTAL</div>
                  <div className="text-lg font-black text-sky-300">{apiResult.results.z_total_ohms} Ω</div>
                </div>
              </div>

              {apiResult.engineeringInterpretation && (
                <div className="text-[11px] text-cyan-200 bg-[#0A1019]/80 p-2.5 rounded-lg border border-cyan-900/40">
                  {apiResult.engineeringInterpretation[locale]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
            CARACTÉRISTIQUES DU TRANSFORMATEUR
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300">Puissance assignée (Sn en kVA) :</label>
            <input
              type="number"
              value={trafoKva}
              onChange={(e) => setTrafoKva(parseFloat(e.target.value) || 100)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300">Tension Primaire (Ur1 en kV) :</label>
            <input
              type="number"
              value={trafoHvKv}
              onChange={(e) => setTrafoHvKv(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300">Tension Secondaire (Ur2 en V) :</label>
            <input
              type="number"
              value={trafoLvV}
              onChange={(e) => setTrafoLvV(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300">Tension de Court-Circuit (uk%) :</label>
            <input
              type="number"
              step="0.5"
              value={trafoUkPercent}
              onChange={(e) => setTrafoUkPercent(parseFloat(e.target.value) || 4)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300">Puissance de Court-Circuit Amont (Sk MVA) :</label>
            <input
              type="number"
              value={skUpstreamMva}
              onChange={(e) => setSkUpstreamMva(parseFloat(e.target.value) || 100)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
