// src/components/elv/modules/PoEPowerBudgetCalculator.tsx
// EPEDE D08 - Power over Ethernet (PoE IEEE 802.3af/at/bt) Power Budget & Thermal Dissipation Calculator

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Flame,
  Info,
  Layers,
  Cpu
} from 'lucide-react';

interface PoEPowerBudgetCalculatorProps {
  locale: 'fr' | 'en';
  defaultCameraCount?: number;
}

export const PoEPowerBudgetCalculator: React.FC<PoEPowerBudgetCalculatorProps> = ({
  locale,
  defaultCameraCount = 48
}) => {
  // Quantities of connected PoE endpoints
  const [fixedCamerasCount, setFixedCamerasCount] = useState<number>(defaultCameraCount - 8);
  const [ptzHeatedCamerasCount, setPtzHeatedCamerasCount] = useState<number>(8);
  const [voipPhonesCount, setVoipPhonesCount] = useState<number>(32);
  const [wifi6ApsCount, setWifi6ApsCount] = useState<number>(18);
  const [accessControllersCount, setAccessControllersCount] = useState<number>(16);

  // Switch specification selection
  const [switchPortDensity, setSwitchPortDensity] = useState<24 | 48>(24);
  const [switchPoeBudgetWatts, setSwitchPoeBudgetWatts] = useState<number>(370); // 370W for 24P, 740W for 48P
  const [cableCategory, setCableCategory] = useState<'CAT6_UTP' | 'CAT6A_SFTP'>('CAT6A_SFTP');
  const [ambientTempC, setAmbientTempC] = useState<number>(28);

  // Power ratings per device class per IEEE standards (Watts at PSE port)
  const powerPerFixedCam = 12.0; // Class 3 PoE (802.3af)
  const powerPerPtzCam = 52.0; // Class 6 Type 3 (802.3bt)
  const powerPerVoip = 7.0; // Class 2 PoE (802.3af)
  const powerPerWifiAp = 24.0; // Class 4 PoE+ (802.3at)
  const powerPerAccess = 25.0; // Class 4 PoE+ (802.3at)

  // Sub-totals
  const totalFixedCamWatts = fixedCamerasCount * powerPerFixedCam;
  const totalPtzCamWatts = ptzHeatedCamerasCount * powerPerPtzCam;
  const totalVoipWatts = voipPhonesCount * powerPerVoip;
  const totalWifiWatts = wifi6ApsCount * powerPerWifiAp;
  const totalAccessWatts = accessControllersCount * powerPerAccess;

  const totalConnectedDevices = fixedCamerasCount + ptzHeatedCamerasCount + voipPhonesCount + wifi6ApsCount + accessControllersCount;
  const grossDevicePowerWatts = totalFixedCamWatts + totalPtzCamWatts + totalVoipWatts + totalWifiWatts + totalAccessWatts;

  // Cable transmission Joule losses (up to 90m per channel)
  // Cat 6A S/FTP has lower DC loop resistance (~14 ohms/100m) than Cat 6 UTP (~18 ohms/100m)
  const cableLossFactor = cableCategory === 'CAT6A_SFTP' ? 0.065 : 0.095;
  const cableJouleLossWatts = Number((grossDevicePowerWatts * cableLossFactor).toFixed(1));
  const totalRequiredPsePowerWatts = Number((grossDevicePowerWatts + cableJouleLossWatts).toFixed(1));

  // Required switches based on port count and power budget
  const switchesNeededByPorts = Math.ceil(totalConnectedDevices / (switchPortDensity - 2)); // 2 ports reserved for SFP uplinks
  const switchesNeededByPower = Math.ceil(totalRequiredPsePowerWatts / (switchPoeBudgetWatts * 0.85)); // 15% power supply safety margin
  const recommendedSwitchesCount = Math.max(switchesNeededByPorts, switchesNeededByPower);

  // Average power per switch and utilization %
  const actualPowerPerSwitch = Number((totalRequiredPsePowerWatts / recommendedSwitchesCount).toFixed(1));
  const switchLoadingPct = Number(((actualPowerPerSwitch / switchPoeBudgetWatts) * 100).toFixed(1));

  // Thermal dissipation in BTU/hr for Server Room HVAC sizing
  // 1 Watt = 3.412142 BTU/hr
  const totalHeatDissipationBtuHr = Math.round(totalRequiredPsePowerWatts * 3.412);
  const requiredAirConTons = Number((totalHeatDissipationBtuHr / 12000).toFixed(2)); // 1 Ton HVAC = 12,000 BTU/hr

  // Recommended UPS capacity (kVA) with power factor 0.9 and 20% margin
  const requiredUpsKva = Number(((totalRequiredPsePowerWatts / 0.9 / 1000) * 1.25).toFixed(2));

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Bilan de Puissance PoE (IEEE 802.3af/at/bt) & Évacuation Thermique' : 'PoE Power Budget (IEEE 802.3af/at/bt) & Thermal Sizing'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              IEEE 802.3bt / TIA-568
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Calculez la consommation cumulée des terminaux IP (caméras, Wi-Fi 6, téléphones, contrôle d’accès) et dimensionnez les commutateurs et la climatisation du local technique.'
              : 'Calculate aggregated PoE power draw across endpoints (cameras, Wi-Fi 6, VoIP, access control) and size network switches and server room HVAC.'}
          </p>
        </div>

        {/* Global Power Badge */}
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 shrink-0">
          <Server className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {locale === 'fr' ? 'Puissance PSE Totale' : 'Total PSE Draw'}
            </div>
            <div className="font-black text-sm text-white">
              {totalRequiredPsePowerWatts} W ({recommendedSwitchesCount} Switches)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Sliders for Device Quantities (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Inventaire des Terminaux PoE Raccordés' : 'Connected PoE Devices Inventory'}
            </span>
          </div>

          {/* Caméras Fixes Dôme/Tube */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Caméras IP Fixes 4MP (12W PoE) :' : 'Fixed 4MP IP Cameras (12W PoE):'}</span>
              <span className="font-bold text-amber-300 font-mono">{fixedCamerasCount} ({totalFixedCamWatts} W)</span>
            </div>
            <input
              type="range"
              min={0}
              max={96}
              step={2}
              value={fixedCamerasCount}
              onChange={(e) => setFixedCamerasCount(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Caméras PTZ Extérieures */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Caméras PTZ Chauffées (52W Ultra-PoE bt) :' : 'Heated PTZ Cameras (52W bt Ultra-PoE):'}</span>
              <span className="font-bold text-rose-300 font-mono">{ptzHeatedCamerasCount} ({totalPtzCamWatts} W)</span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={ptzHeatedCamerasCount}
              onChange={(e) => setPtzHeatedCamerasCount(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>

          {/* Bornes Wi-Fi 6 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Bornes Wi-Fi 6 Tri-Band (24W PoE+) :' : 'Wi-Fi 6 APs (24W PoE+):'}</span>
              <span className="font-bold text-sky-300 font-mono">{wifi6ApsCount} ({totalWifiWatts} W)</span>
            </div>
            <input
              type="range"
              min={0}
              max={48}
              step={2}
              value={wifi6ApsCount}
              onChange={(e) => setWifi6ApsCount(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Postes Téléphoniques VoIP */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Postes Téléphoniques VoIP LCD (7W PoE) :' : 'VoIP Phones LCD (7W PoE):'}</span>
              <span className="font-bold text-cyan-300 font-mono">{voipPhonesCount} ({totalVoipWatts} W)</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={4}
              value={voipPhonesCount}
              onChange={(e) => setVoipPhonesCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* UTL Contrôle d'Accès */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'UTL Contrôle d’Accès + Ventouses (25W PoE+) :' : 'Access Control UTLs + Maglock (25W PoE+):'}</span>
              <span className="font-bold text-purple-300 font-mono">{accessControllersCount} ({totalAccessWatts} W)</span>
            </div>
            <input
              type="range"
              min={0}
              max={48}
              step={2}
              value={accessControllersCount}
              onChange={(e) => setAccessControllersCount(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Cable category selector */}
          <div className="pt-2 border-t border-[#222B38] flex items-center justify-between text-xs">
            <span className="text-slate-400">Catégorie Câble Cuivre :</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCableCategory('CAT6A_SFTP')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  cableCategory === 'CAT6A_SFTP' ? 'bg-amber-500 text-slate-950' : 'bg-[#090D14] text-slate-400 border border-[#222B38]'
                }`}
              >
                Cat. 6A S/FTP (Blindé)
              </button>
              <button
                type="button"
                onClick={() => setCableCategory('CAT6_UTP')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  cableCategory === 'CAT6_UTP' ? 'bg-amber-500 text-slate-950' : 'bg-[#090D14] text-slate-400 border border-[#222B38]'
                }`}
              >
                Cat. 6 U/UTP
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Sizing & Telemetry Results (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Dimensionnement Baies VDI & Climatisation' : 'VDI Rack & Server Room Thermal Sizing'}
            </span>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Nombre Total de Ports PoE :</span>
              <div className="text-base font-bold text-white font-mono">{totalConnectedDevices} Prises RJ45</div>
              <div className="text-[10px] text-slate-400">
                Pertes Joule câble : +{cableJouleLossWatts} W
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Commutateurs 24P Requis :</span>
              <div className="text-base font-bold text-amber-300 font-mono">{recommendedSwitchesCount} Unités</div>
              <div className="text-[10px] text-slate-400">
                Taux de charge alim : {switchLoadingPct}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Dissipation Thermique :</span>
              <div className="text-base font-bold text-rose-400 font-mono">{totalHeatDissipationBtuHr.toLocaleString('fr-FR')} BTU/h</div>
              <div className="text-[10px] text-slate-400">
                Climatisation : ~ {requiredAirConTons} Tonnes de froid
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Onduleur Baie Conseillé :</span>
              <div className="text-base font-bold text-emerald-400 font-mono">{requiredUpsKva} kVA</div>
              <div className="text-[10px] text-slate-400">
                Onduleur On-Line Double Conversion
              </div>
            </div>

          </div>

          {/* Standards Compliance Box */}
          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2">
            <span className="text-[10px] font-bold uppercase text-amber-400 block">
              {locale === 'fr' ? 'Règles de Câblage TIA-568 / ISO 11801 :' : 'TIA-568 / ISO 11801 Cabling Guidelines:'}
            </span>
            <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-1">
              <li>
                {locale === 'fr'
                  ? 'Limiter les faisceaux à 24 câbles max en PoE Type 4 pour éviter l’échauffement interne (> 10°C d’élévation).'
                  : 'Restrict bundles to max 24 cables in Type 4 PoE to prevent internal heat rise (> 10°C elevation).'}
              </li>
              <li>
                {locale === 'fr'
                  ? 'Privilégier le câble Cat. 6A S/FTP blindé pour réduire la résistance de boucle continue et minimiser les pertes Joules.'
                  : 'Use shielded Cat. 6A S/FTP to lower DC loop resistance and minimize bundle thermal losses.'}
              </li>
              <li>
                {locale === 'fr'
                  ? 'Maintenir une réserve d’alimentation PoE de 15% sur les commutateurs de distribution d’étage.'
                  : 'Maintain a 15% spare PoE power headroom on floor distribution switches.'}
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
