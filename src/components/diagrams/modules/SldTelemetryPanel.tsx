// src/components/diagrams/modules/SldTelemetryPanel.tsx
import React from 'react';
import { Activity, Sun, Battery, Sliders, ShieldCheck } from 'lucide-react';
import { SldTopologyType } from './SldHeaderToolbar';

interface SldTelemetryPanelProps {
  activeTopology: SldTopologyType;
  locale: 'fr' | 'en';
  // Electrical Telemetry
  isRmuBus_Energized: boolean;
  isTgbt_Energized: boolean;
  isBusA_Energized: boolean;
  isBusB_Energized: boolean;
  isBus225Energized: boolean;
  isBus30Energized: boolean;
  isTrafoEnergized: boolean;
  isGrid225Connected: boolean;
  isTrafoHvEnergized: boolean;
  isBus33Energized: boolean;
  u_hv_nom: number;
  u_mv_nom: number;
  current_hv: number;
  current_mv: number;
  activeLoadMw: number;
  totalExportMw: number;
  solarPowerMw: number;
  bessPowerMw: number;
  reactivePowerMvar: number;
  // Solar BESS settings
  solarIrradiance: number;
  setSolarIrradiance: (val: number) => void;
  bessMode: 'discharge' | 'charge' | 'grid_forming' | 'standby';
  setBessMode: (mode: 'discharge' | 'charge' | 'grid_forming' | 'standby') => void;
  bessPowerSetting: number;
  setBessPowerSetting: (val: number) => void;
  bessSocPercent: number;
  // OLTC
  trafoTap: number;
  setTrafoTap: (tap: number) => void;
}

export const SldTelemetryPanel: React.FC<SldTelemetryPanelProps> = ({
  activeTopology,
  locale,
  isRmuBus_Energized,
  isTgbt_Energized,
  isBusA_Energized,
  isBusB_Energized,
  isBus225Energized,
  isBus30Energized,
  isTrafoEnergized,
  isGrid225Connected,
  isTrafoHvEnergized,
  isBus33Energized,
  u_hv_nom,
  u_mv_nom,
  current_hv,
  current_mv,
  activeLoadMw,
  totalExportMw,
  solarPowerMw,
  bessPowerMw,
  reactivePowerMvar,
  solarIrradiance,
  setSolarIrradiance,
  bessMode,
  setBessMode,
  bessPowerSetting,
  setBessPowerSetting,
  bessSocPercent,
  trafoTap,
  setTrafoTap,
}) => {
  return (
    <div className="space-y-4">
      {/* Telemetry Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="h-4 w-4 text-sky-600" />
          <span>{locale === 'fr' ? 'Télémesures Numériques' : 'Digital Instrumentation'}</span>
        </h3>

        <div className="space-y-3 font-mono">
          {/* Primary Voltage */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {activeTopology === 'rmu_distribution' ? 'U_rmu (30 kV)' : 'U_primary (225 kV)'}
            </div>
            <div className="text-xl font-black text-sky-700">
              {activeTopology === 'rmu_distribution'
                ? (isRmuBus_Energized ? '30.00' : '0.00')
                : activeTopology === 'solar_bess'
                ? (isGrid225Connected || isTrafoHvEnergized ? '225.0' : '0.0')
                : (activeTopology === 'double_bus' ? (isBusA_Energized || isBusB_Energized ? '225.0' : '0.0') : (isBus225Energized ? u_hv_nom.toFixed(1) : '0.0'))} 
              <span className="text-xs font-normal text-slate-500"> kV</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {activeTopology === 'solar_bess'
                ? `I_grid: ${isGrid225Connected ? ((Math.abs(totalExportMw) * 1e6) / (Math.sqrt(3) * 225e3 * 0.98)).toFixed(1) : '0.0'} A`
                : `I_primary: ${current_hv.toFixed(1)} A`}
            </div>
          </div>

          {/* Secondary Voltage */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {activeTopology === 'rmu_distribution' 
                ? 'U_bt (TGBT 400 V)' 
                : activeTopology === 'solar_bess' 
                ? 'U_collecteur (33 kV)' 
                : 'U_secondary (30 kV)'}
            </div>
            <div className="text-xl font-black text-amber-700">
              {activeTopology === 'rmu_distribution'
                ? (isTgbt_Energized ? '400.0' : '0.0')
                : activeTopology === 'solar_bess'
                ? (isBus33Energized ? '33.00' : '0.00')
                : (isBus30Energized ? u_mv_nom.toFixed(2) : '0.00')} 
              <span className="text-xs font-normal text-slate-500"> 
                {activeTopology === 'rmu_distribution' ? 'V' : 'kV'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {activeTopology === 'solar_bess'
                ? `Fréquence: ${isGrid225Connected ? '50.00 Hz' : '0.00 Hz (Îloté)'}`
                : `I_secondary: ${current_mv.toFixed(1)} A`}
            </div>
          </div>

          {/* Active Power MW / kW */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {activeTopology === 'solar_bess' ? 'P_injection Réseau 225 kV' : 'P_active Total'}
            </div>
            <div className="text-xl font-black text-slate-900">
              {activeTopology === 'rmu_distribution'
                ? (isTgbt_Energized ? '480' : '0')
                : activeTopology === 'solar_bess'
                ? totalExportMw.toFixed(1)
                : (isTrafoEnergized ? activeLoadMw.toFixed(1) : '0.0')} 
              <span className="text-xs font-normal text-sky-700"> {activeTopology === 'rmu_distribution' ? 'kW' : 'MW'}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {activeTopology === 'rmu_distribution'
                ? `Charge Transfo: ${isTgbt_Energized ? '76.2%' : '0%'} (630 kVA)`
                : activeTopology === 'solar_bess'
                ? `PV: ${solarPowerMw.toFixed(1)} MW · BESS: ${bessPowerMw >= 0 ? `+${bessPowerMw.toFixed(1)}` : bessPowerMw.toFixed(1)} MW · Q: ${reactivePowerMvar.toFixed(1)} MVAR`
                : `Trafo Loading: ${isTrafoEnergized ? ((activeLoadMw / 63) * 100).toFixed(1) : '0.0'} % (63 MVA)`}
            </div>
          </div>
        </div>
      </div>

      {/* SOLAR & BESS CONTROLS (EMS / PPC) */}
      {activeTopology === 'solar_bess' ? (
        <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-100 pb-3">
            <Sun className="h-4 w-4 text-emerald-600" />
            <span>SUPERVISION SOLAIRE & BESS (PPC / EMS)</span>
          </h3>

          {/* Solar Irradiance Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700">
              <span>Irradiance Solaire (G):</span>
              <span className="font-bold text-amber-700">{solarIrradiance} W/m²</span>
            </div>
            <input
              type="range"
              min="0"
              max="1100"
              step="25"
              value={solarIrradiance}
              onChange={(e) => setSolarIrradiance(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Nuit)</span>
              <span>500 (Nuageux)</span>
              <span>1000 W/m² (Plein Soleil)</span>
            </div>
          </div>

          {/* BESS Mode Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="text-slate-500 font-bold uppercase text-[10px]">
              MODE DE CONTRÔLE DU BESS (CEI 62933) :
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setBessMode('discharge')}
                className={`p-2 rounded-xl border font-bold text-center transition-all ${
                  bessMode === 'discharge'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Décharge (Pointe)
              </button>
              <button
                type="button"
                onClick={() => setBessMode('charge')}
                className={`p-2 rounded-xl border font-bold text-center transition-all ${
                  bessMode === 'charge'
                    ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Recharge (Surplus PV)
              </button>
              <button
                type="button"
                onClick={() => setBessMode('grid_forming')}
                className={`p-2 rounded-xl border font-bold text-center transition-all ${
                  bessMode === 'grid_forming'
                    ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Régulation FCR
              </button>
              <button
                type="button"
                onClick={() => setBessMode('standby')}
                className={`p-2 rounded-xl border font-bold text-center transition-all ${
                  bessMode === 'standby'
                    ? 'bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Veille (Standby)
              </button>
            </div>
          </div>

          {/* BESS Power Setting Slider */}
          {bessMode !== 'standby' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-slate-700">
                <span>Consigne PCS BESS:</span>
                <span className="font-bold text-emerald-700">{bessPowerSetting} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={bessPowerSetting}
                onChange={(e) => setBessPowerSetting(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 MW</span>
                <span>12.5 MW</span>
                <span>25 MW (Max)</span>
              </div>
            </div>
          )}

          {/* Battery SOC Level & Autonomy */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Battery className="h-3.5 w-3.5 text-emerald-600" />
                <span>État de Charge (SOC) :</span>
              </span>
              <span className="font-black text-emerald-700">{bessSocPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${bessSocPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Énergie: {((bessSocPercent / 100) * 50).toFixed(1)} / 50 MWh</span>
              <span>
                Autonomie:{' '}
                {bessPowerSetting > 0 && bessMode === 'discharge'
                  ? `${(((bessSocPercent / 100) * 50) / bessPowerSetting).toFixed(1)} h`
                  : '∞'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Breaker-and-a-Half Supervision Card */
        activeTopology === 'breaker_and_half' ? (
          <div className="bg-white border border-sky-300 rounded-2xl p-5 shadow-sm space-y-4 font-mono text-xs">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-sky-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? 'SÛRETÉ SCHÉMA 1-1/2 (CEI 61936)' : '1-1/2 CB RELIABILITY (IEC 61936)'}</span>
            </h3>

            <div className="space-y-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 text-[11px]">Disponibilité Lignes (N-1) :</span>
                <span className="font-bold text-emerald-700 text-[11px]">100% ININTERROMPUE</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 text-[11px]">Maintenance Disjoncteur :</span>
                <span className="font-bold text-sky-700 text-[11px]">À CHAUD SANS COUPURE</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 text-[11px]">Défaut Barre (ANSI 87B) :</span>
                <span className="font-bold text-indigo-700 text-[11px]">ZÉRO PERTE DE CHARGE</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              {locale === 'fr'
                ? 'Architecture hautement résiliente : 3 disjoncteurs pour 2 départs. Permet l’isolement de n’importe quel disjoncteur ou jeu de barres sans perturber le transit d’énergie.'
                : 'Highly resilient architecture: 3 circuit breakers for 2 line circuits. Allows any breaker or busbar to be isolated without interrupting power transfer.'}
            </div>
          </div>
        ) : activeTopology !== 'rmu_distribution' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? 'Régleur en Charge (OLTC)' : 'Tap Changer (OLTC)'}</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Prise Actuelle (Tap):</span>
                <span className="font-bold text-sky-700 text-sm">
                  {trafoTap > 0 ? `+${trafoTap}` : trafoTap} / 4
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Régulation ΔU:</span>
                <span className="font-bold text-slate-800">
                  {(trafoTap * 1.25).toFixed(2)} %
                </span>
              </div>

              {/* Tap Slider */}
              <input
                type="range"
                min="-4"
                max="4"
                step="1"
                value={trafoTap}
                onChange={(e) => setTrafoTap(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-4 (-5.0%)</span>
                <span>0 (Nominal)</span>
                <span>+4 (+5.0%)</span>
              </div>
            </div>
          </div>
        )
      )}

      {/* Standard Compliance Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3 text-xs font-mono">
        <div className="text-[10px] text-slate-500 uppercase font-bold">NORMES APPLICABLES</div>
        <div className="space-y-1.5 text-slate-700">
          {activeTopology === 'solar_bess' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">▪</span>
                <span className="font-bold text-slate-900">CEI 62933</span>
                <span className="text-slate-500">— Systèmes Stockage BESS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">▪</span>
                <span className="font-bold text-slate-900">IEEE 1547 / CEI 61727</span>
                <span className="text-slate-500">— Interconnexion & Anti-îlotage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">▪</span>
                <span className="font-bold text-slate-900">CEI 62271-200</span>
                <span className="text-slate-500">— Tableaux Collecteur 33 kV</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">▪</span>
                <span className="font-bold text-slate-900">CEI 60076</span>
                <span className="text-slate-500">— Transfo Évacuation 120 MVA</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-600">▪</span>
                <span className="font-bold text-slate-900">CEI 62271-102</span>
                <span className="text-slate-500">— Sectionneurs & Terre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-600">▪</span>
                <span className="font-bold text-slate-900">CEI 62271-100</span>
                <span className="text-slate-500">— Disjoncteurs HTB SF6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-600">▪</span>
                <span className="font-bold text-slate-900">CEI 62271-200</span>
                <span className="text-slate-500">— Tableaux HTA / RMU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sky-600">▪</span>
                <span className="font-bold text-slate-900">CEI 61439-1/2</span>
                <span className="text-slate-500">— Tableaux BT / TGBT</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
