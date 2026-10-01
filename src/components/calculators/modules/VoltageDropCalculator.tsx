// src/components/calculators/modules/VoltageDropCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { epedeApi } from '../../../services/epedeApiClient';

interface VoltageDropCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: {
    vDropU?: number;
    vDropCurrentA?: number;
    vDropLengthM?: number;
    vDropSectionMm2?: number;
    vDropCosPhi?: number;
  };
  injectedContextInfo?: {
    equipmentName?: string;
    equipmentTag?: string;
  };
}

export const VoltageDropCalculator: React.FC<VoltageDropCalculatorProps> = ({ 
  locale,
  initialParams,
  injectedContextInfo,
}) => {
  // 2. VOLTAGE DROP CALCULATOR
  const [vDropU, setVDropU] = useState<number>(initialParams?.vDropU || 400); // Three-phase 400V or MV
  const [vDropCurrentA, setVDropCurrentA] = useState<number>(initialParams?.vDropCurrentA || 120);
  const [vDropLengthM, setVDropLengthM] = useState<number>(initialParams?.vDropLengthM || 150);
  const [vDropSectionMm2, setVDropSectionMm2] = useState<number>(initialParams?.vDropSectionMm2 || 35);
  const [vDropCosPhi, setVDropCosPhi] = useState<number>(initialParams?.vDropCosPhi || 0.85);
  const [conductorMaterial, setConductorMaterial] = useState<'cu' | 'al'>('cu');

  // Backend API result
  const [apiResult, setApiResult] = useState<any>(null);
  const [isComputingApi, setIsComputingApi] = useState<boolean>(false);

  // Sync if initialParams changes
  useEffect(() => {
    if (initialParams?.vDropU !== undefined) setVDropU(initialParams.vDropU);
    if (initialParams?.vDropCurrentA !== undefined) setVDropCurrentA(initialParams.vDropCurrentA);
    if (initialParams?.vDropLengthM !== undefined) setVDropLengthM(initialParams.vDropLengthM);
    if (initialParams?.vDropSectionMm2 !== undefined) setVDropSectionMm2(initialParams.vDropSectionMm2);
    if (initialParams?.vDropCosPhi !== undefined) setVDropCosPhi(initialParams.vDropCosPhi);
  }, [initialParams]);

  // Resistivity at 75°C: Cu = 0.0225 Ω·mm²/m, Al = 0.036 Ω·mm²/m
  const rho = conductorMaterial === 'cu' ? 0.0225 : 0.036;
  // Reactance approx 0.08 mΩ/m = 0.00008 Ω/m
  const lambda = 0.00008;
  const sinPhi = Math.sin(Math.acos(Math.min(1, Math.max(0, vDropCosPhi))));
  // ΔU = sqrt(3) * I * L * ((rho/S)*cos_phi + lambda*sin_phi)
  const rPerMeter = rho / vDropSectionMm2;
  const deltaUVolts = Math.sqrt(3) * vDropCurrentA * vDropLengthM * (rPerMeter * vDropCosPhi + lambda * sinPhi);
  const deltaUPercent = (deltaUVolts / vDropU) * 100;
  const isDropCompliant = deltaUPercent <= 5.0; // 5% limit per NF C 15-100 for power

  const handleRunBackendWorkbench = async () => {
    setIsComputingApi(true);
    try {
      const res = await epedeApi.executeCalculation('voltage-drop-workbench', {
        voltage_v: vDropU,
        power_kw: (Math.sqrt(3) * vDropU * vDropCurrentA * vDropCosPhi) / 1000,
        length_m: vDropLengthM,
        cos_phi: vDropCosPhi,
        cable_section_mm2: vDropSectionMm2,
      });
      if (res) {
        setApiResult(res);
      }
    } catch {
      // Graceful fallback
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
            <span>{locale === 'fr' ? 'CALCUL DE CHUTE DE TENSION EN LIGNE SELON NF C 15-100 / CEI 60364' : 'CABLE VOLTAGE DROP'}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${isDropCompliant ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
              {isDropCompliant ? 'CONFORME (≤ 5%)' : 'NON-CONFORME (> 5%)'}
            </span>
          </div>

          {/* Drop results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">CHUTE DE TENSION RELATIVE (ΔU%)</div>
              <div className={`text-3xl font-black ${isDropCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                {deltaUPercent.toFixed(2)} <span className="text-sm font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[10px] text-neutral-500">Limite autorisée : 5.00 %</div>
            </div>

            <div className="bg-[#161C24] p-4 rounded-xl border border-[#252E38] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">CHUTE DE TENSION ABSOLUE (ΔU)</div>
              <div className="text-3xl font-black text-cyan-300">
                {deltaUVolts.toFixed(2)} <span className="text-sm font-normal text-neutral-400">V</span>
              </div>
              <div className="text-[10px] text-neutral-500">Tension résiduelle : {(vDropU - deltaUVolts).toFixed(1)} V</div>
            </div>
          </div>

          {/* Sizing recommendations & backend trigger */}
          <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38] text-xs font-mono space-y-2">
            <div className="text-cyan-400 font-bold uppercase text-[11px] flex items-center justify-between">
              <span>RÈGLES NORMATIVES APPLICABLES (NF C 15-100 §525 / CEI 60364-5-52)</span>
              <button
                type="button"
                onClick={handleRunBackendWorkbench}
                disabled={isComputingApi}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-[10px] transition-all cursor-pointer"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isComputingApi ? 'animate-spin' : ''}`} />
                <span>{isComputingApi ? (locale === 'fr' ? 'Calcul API...' : 'Computing...') : (locale === 'fr' ? 'Évaluer via API Serveur' : 'Run Server API')}</span>
              </button>
            </div>
            <p className="text-neutral-300 leading-relaxed font-sans">
              La chute de tension maximale admise entre l'origine de l'installation et tout point d'utilisation est de <strong>3% pour l'éclairage</strong> et <strong>5% pour les autres usages (force motrice)</strong>.
            </p>
          </div>

          {/* Backend API Verification Note */}
          {apiResult?.engineeringInterpretation && (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-700/60 font-mono text-xs text-cyan-200">
              <div className="font-bold uppercase text-[10px] text-cyan-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'AVIS D’INGÉNIERIE CANONIQUE (API v1)' : 'CANONICAL ENGINEERING OPINION (API v1)'}
              </div>
              {apiResult.engineeringInterpretation[locale]}
            </div>
          )}
        </div>

        {/* Inputs Side Panel */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2">
            PARAMÈTRES DU CÂBLE
          </div>

          {/* Voltage */}
          <div className="space-y-1">
            <label className="text-neutral-300">Tension assignée (U en V) :</label>
            <input
              type="number"
              value={vDropU}
              onChange={(e) => setVDropU(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Current */}
          <div className="space-y-1">
            <label className="text-neutral-300">Courant d'emploi (Ib en A) :</label>
            <input
              type="number"
              value={vDropCurrentA}
              onChange={(e) => setVDropCurrentA(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Length */}
          <div className="space-y-1">
            <label className="text-neutral-300">Longueur du câble (L en m) :</label>
            <input
              type="number"
              value={vDropLengthM}
              onChange={(e) => setVDropLengthM(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Conductor section */}
          <div className="space-y-1">
            <label className="text-neutral-300">Section du conducteur (mm²) :</label>
            <select
              value={vDropSectionMm2}
              onChange={(e) => setVDropSectionMm2(parseFloat(e.target.value))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            >
              {[6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630].map((s) => (
                <option key={s} value={s}>{s} mm²</option>
              ))}
            </select>
          </div>

          {/* Power factor cos phi */}
          <div className="space-y-1">
            <label className="text-neutral-300">Facteur de puissance (cos φ) :</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="1.0"
              value={vDropCosPhi}
              onChange={(e) => setVDropCosPhi(parseFloat(e.target.value) || 0.85)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Material */}
          <div className="space-y-1">
            <label className="text-neutral-300">Matériau de l'âme :</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConductorMaterial('cu')}
                className={`py-1.5 rounded font-bold transition-all cursor-pointer ${
                  conductorMaterial === 'cu' ? 'bg-cyan-500 text-black' : 'bg-[#161C24] text-neutral-400'
                }`}
              >
                Cuivre (Cu)
              </button>
              <button
                type="button"
                onClick={() => setConductorMaterial('al')}
                className={`py-1.5 rounded font-bold transition-all cursor-pointer ${
                  conductorMaterial === 'al' ? 'bg-cyan-500 text-black' : 'bg-[#161C24] text-neutral-400'
                }`}
              >
                Aluminium (Al)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
