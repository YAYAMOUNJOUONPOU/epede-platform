// src/components/installations/CameroonInstallationGridRealityEngine.tsx
// EPEDE D06 - Cameroon Grid Reality, Tropicalization & Surge Protection Engine

import React, { useState } from 'react';
import {
  Zap,
  CloudLightning,
  Sun,
  Thermometer,
  ShieldAlert,
  Activity,
  DollarSign,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

interface CameroonInstallationGridRealityEngineProps {
  locale: 'fr' | 'en';
  facilityPowerKW?: number;
}

interface RegionConfig {
  id: string;
  name: string;
  nk: number; // Keraunic level (thunderstorm days/year)
  ambTempMax: number; // Max ambient temp °C
  humidityPct: number;
  altitudeM: number;
  gridVoltageMv: string;
  keraunicRisk: 'EXTREME' | 'HIGH' | 'MODERATE';
  descFr: string;
  descEn: string;
}

const CAMEROON_REGIONS: RegionConfig[] = [
  {
    id: 'DOUALA',
    name: 'Douala / Littoral',
    nk: 110,
    ambTempMax: 38,
    humidityPct: 95,
    altitudeM: 15,
    gridVoltageMv: '15 kV (Poste Koumassi / Bassa)',
    keraunicRisk: 'EXTREME',
    descFr: 'Climat équatorial côtier très humide (95%), foudre intense, corrosion saline et températures en local TGBT dépassant 42°C.',
    descEn: 'Humid equatorial coastal climate (95% RH), extreme lightning flash rate, saline corrosion, TGBT room temperatures exceeding 42°C.'
  },
  {
    id: 'YAOUNDE',
    name: 'Yaoundé / Centre',
    nk: 95,
    ambTempMax: 33,
    humidityPct: 85,
    altitudeM: 750,
    gridVoltageMv: '15 kV (Poste Oyomabang / BRGM)',
    keraunicRisk: 'EXTREME',
    descFr: 'Collines exposées aux impacts directs de foudre, baisses de tension fréquentes en bout de réseau et régimes d\'orages violents.',
    descEn: 'Hilly terrain prone to direct lightning strikes, frequent brownouts on remote feeders, severe storm peaks.'
  },
  {
    id: 'BAFOUSSAM',
    name: 'Bafoussam / Ouest',
    nk: 85,
    ambTempMax: 27,
    humidityPct: 80,
    altitudeM: 1500,
    gridVoltageMv: '30 kV (Poste Bafoussam)',
    keraunicRisk: 'HIGH',
    descFr: 'Hauts plateaux avec altitude nécessitant un déclassement diélectrique et thermique des transformateurs et groupes électrogènes.',
    descEn: 'High-altitude plateau requiring dielectric distance adjustment and thermal derating of gensets and transformers.'
  },
  {
    id: 'GAROUA',
    name: 'Garoua / Maroua (Grand Nord)',
    nk: 70,
    ambTempMax: 45,
    humidityPct: 40,
    altitudeM: 180,
    gridVoltageMv: '30 kV (Poste Garoua Djamboutou)',
    keraunicRisk: 'HIGH',
    descFr: 'Chaleur sahélienne extrême (jusqu\'à 45°C), poussières d\'harmattan très abrasives et déclassement thermique drastique des câbles (k1=0.71).',
    descEn: 'Severe Saharan heat (up to 45°C), abrasive Harmattan dust, severe cable ampacity thermal derating (k1=0.71).'
  },
  {
    id: 'KRIBI',
    name: 'Kribi / Sud Industriel',
    nk: 105,
    ambTempMax: 34,
    humidityPct: 92,
    altitudeM: 10,
    gridVoltageMv: '30 kV (Poste Kribi Mboro)',
    keraunicRisk: 'EXTREME',
    descFr: 'Zone industrielle portuaire, fortes contraintes de continuité de service, atmosphère saline et orages côtiers quotidiens en saison des pluies.',
    descEn: 'Deep seaport industrial zone, high service continuity demands, marine atmosphere and frequent coastal thunderstorms.'
  }
];

export const CameroonInstallationGridRealityEngine: React.FC<CameroonInstallationGridRealityEngineProps> = ({
  locale,
  facilityPowerKW = 250
}) => {
  const isFr = locale === 'fr';

  // Active module tab
  const [activeTab, setActiveTab] = useState<'LIGHTNING_SPD' | 'TROPICAL_DERATING' | 'GRID_BROWNOUT' | 'ENEO_TARIFF'>(
    'LIGHTNING_SPD'
  );

  // Region selection
  const [selectedRegionId, setSelectedRegionId] = useState<string>('DOUALA');
  const region = CAMEROON_REGIONS.find((r) => r.id === selectedRegionId) || CAMEROON_REGIONS[0];

  // 1. Lightning Parameters
  const [hasLpsExternal, setHasLpsExternal] = useState<boolean>(true); // External lightning rod (Paratonnerre)
  const [lineFeedType, setLineFeedType] = useState<'OVERHEAD' | 'UNDERGROUND'>('OVERHEAD');

  // 2. Tropical De-rating Parameters
  const [actualAmbTemp, setActualAmbTemp] = useState<number>(region.ambTempMax);
  const [insulationType, setInsulationType] = useState<'XLPE' | 'PVC'>('XLPE');
  const [isSwitchroomConditioned, setIsSwitchroomConditioned] = useState<boolean>(false);

  // 3. Grid Brownout Parameters
  const [simulatedGridVoltage, setSimulatedGridVoltage] = useState<number>(185); // Volts single-phase (nominal 230V)
  const [motorNominalKw, setMotorNominalKw] = useState<number>(45);

  // 4. Eneo Tariff Parameters
  const [activePowerKw, setActivePowerKw] = useState<number>(facilityPowerKW);
  const [currentCosPhi, setCurrentCosPhi] = useState<number>(0.78);
  const [tariffBracket, setTariffBracket] = useState<'TARIF_2' | 'TARIF_3'>('TARIF_2');

  // =========================================================================
  // CALCULATIONS
  // =========================================================================

  // A. Lightning Strike Density & Surge Protection (CEI 62305 / NF C 15-100 § 443)
  const ng = (region.nk / 10).toFixed(1); // Lightning ground flash density Ng (strikes/km2/year)
  const isType1Mandatory = hasLpsExternal || (lineFeedType === 'OVERHEAD' && region.nk >= 25);
  const recommendedIimpKa = hasLpsExternal ? 25 : 12.5;
  const recommendedInKa = 20;
  const recommendedImaxKa = 40;
  const recommendedUpKv = 1.5;

  // B. Tropical Cable De-rating (IEC 60364-5-52 Table B.52.14)
  const baseTemp = 30; // IEC baseline 30°C
  const effectiveTemp = isSwitchroomConditioned ? Math.min(actualAmbTemp, 25) : actualAmbTemp;
  const maxConductorTemp = insulationType === 'XLPE' ? 90 : 70;
  const k1Derating =
    effectiveTemp <= baseTemp
      ? 1.0
      : Math.sqrt(Math.max(0.1, (maxConductorTemp - effectiveTemp) / (maxConductorTemp - baseTemp)));

  // Genset De-rating (ISO 8528-1: 1% per 5°C above 25°C + 1% per 100m above 1000m)
  const tempExcess = Math.max(0, actualAmbTemp - 25);
  const altExcess = Math.max(0, region.altitudeM - 1000);
  const gensetDeratingPct = (tempExcess / 5) * 1 + (altExcess / 100) * 1;
  const gensetCapacityFactor = Math.max(0.7, (100 - gensetDeratingPct) / 100);

  // C. Motor Current at Brownout Voltage
  // Inom = P / (sqrt(3) * U * cosphi * eta), eta approx 0.91
  const nominalCurrent400V = (motorNominalKw * 1000) / (Math.sqrt(3) * 400 * 0.85 * 0.91);
  const brownout3PhaseVoltage = (simulatedGridVoltage / 230) * 400;
  const actualCurrentBrownout = (motorNominalKw * 1000) / (Math.sqrt(3) * brownout3PhaseVoltage * 0.85 * 0.91);
  const currentIncreasePct = ((actualCurrentBrownout - nominalCurrent400V) / nominalCurrent400V) * 100;
  const copperLossMultiplier = Math.pow(actualCurrentBrownout / nominalCurrent400V, 2);

  // Servo-Stabilizer Sizing
  const stabilizerKva = ((activePowerKw / 0.85) * (230 / simulatedGridVoltage) * 1.15).toFixed(0);

  // D. Eneo ARSEL Tariff & Power Factor Sizing
  const targetCosPhi = 0.95;
  const tanPhi1 = Math.tan(Math.acos(currentCosPhi));
  const tanPhi2 = Math.tan(Math.acos(targetCosPhi));
  const requiredQcKvar = Math.max(0, activePowerKw * (tanPhi1 - tanPhi2)).toFixed(0);

  // Eneo Penalty: If tan phi > 0.40 (cos phi < 0.928)
  const isPenaltyApplicable = tanPhi1 > 0.4;
  const estimatedMonthlyKwh = activePowerKw * 0.65 * 10 * 26; // 10h/day, 26 days/month, 65% load
  const kwhRateFcfa = tariffBracket === 'TARIF_2' ? 95 : 105;
  const baseMonthlyEnergyFcfa = estimatedMonthlyKwh * kwhRateFcfa;
  const reactivePenaltyFcfa = isPenaltyApplicable
    ? baseMonthlyEnergyFcfa * (tanPhi1 - 0.4) * 0.18 // Eneo penalty coefficient approx
    : 0;

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      {/* 1. Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <CloudLightning className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  RÉSEAU CAMEROUN & TROPICALISATION
                </span>
                <span className="text-[10px] text-slate-400">
                  NF C 15-100 § 443 • CEI 62305 • ARSEL • Eneo
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {isFr
                  ? 'Contraintes Réseau Eneo, Foudre Tropicale & Facteur k1'
                  : 'Cameroon Grid Reality, Tropical Lightning & k1 Derating'}
              </h2>
            </div>
          </div>

          {/* Region Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CAMEROON_REGIONS.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  setSelectedRegionId(reg.id);
                  setActualAmbTemp(reg.ambTempMax);
                }}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegionId === reg.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{reg.name.split('/')[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Region Status Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px]">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Niveau Kéraunique :' : 'Keraunic Level:'}</div>
            <div className="text-amber-400 font-black text-sm flex items-center gap-1">
              <CloudLightning className="w-3.5 h-3.5" />
              <span>Nk = {region.nk} j/an</span>
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Densité Foudre Ng :' : 'Flash Density Ng:'}</div>
            <div className="text-amber-300 font-bold text-sm">{ng} coups/km²/an</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Temp. Max Ambiante :' : 'Max Ambient Temp:'}</div>
            <div className="text-rose-400 font-bold text-sm">{region.ambTempMax}°C</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Humidité Relative :' : 'Relative Humidity:'}</div>
            <div className="text-sky-400 font-bold text-sm">{region.humidityPct}% RH</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Réseau Amont :' : 'Upstream Grid:'}</div>
            <div className="text-emerald-400 font-bold text-xs truncate">{region.gridVoltageMv}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">{isFr ? 'Risque Foudre :' : 'Surge Risk:'}</div>
            <div className="text-rose-400 font-black text-xs uppercase">{region.keraunicRisk}</div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Modules Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('LIGHTNING_SPD')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === 'LIGHTNING_SPD'
              ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-md shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CloudLightning className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">{isFr ? '1. Parafoudres & Foudre' : '1. Lightning & SPDs'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'Type 1 + Type 2' : 'Type 1 + Type 2'}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TROPICAL_DERATING')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === 'TROPICAL_DERATING'
              ? 'bg-rose-500/20 border-rose-500 text-white font-bold shadow-md shadow-rose-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">{isFr ? '2. Déclassement Tropical' : '2. Tropical Derating'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'Facteur k1 & Groupe GE' : 'k1 factor & Genset'}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GRID_BROWNOUT')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === 'GRID_BROWNOUT'
              ? 'bg-sky-500/20 border-sky-500 text-white font-bold shadow-md shadow-sky-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">{isFr ? '3. Baisses de Tension Eneo' : '3. Voltage Brownouts'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? '160V-180V & Stabilisateur' : '160V-180V & Stabilizer'}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ENEO_TARIFF')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === 'ENEO_TARIFF'
              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold">{isFr ? '4. Tarifs Eneo & Cos φ' : '4. Eneo Tariffs & Cos φ'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'Pénalités & Condensateurs' : 'Penalties & Capacitors'}</div>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIGHTNING SURGE PROTECTION CALCULATOR                              */}
      {/* ========================================================================= */}
      {activeTab === 'LIGHTNING_SPD' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              <span>{isFr ? 'Paramètres d\'Exposition au Risque' : 'Surge Risk Parameters'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? '1. Présence d\'un Paratonnerre (PDA / Cage Maillée) :' : '1. External Lightning Protection (LPS):'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasLpsExternal(true)}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      hasLpsExternal
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isFr ? 'OUI (Oblige Type 1)' : 'YES (Requires Type 1)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasLpsExternal(false)}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      !hasLpsExternal
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isFr ? 'NON (Sans PDA)' : 'NO (No LPS)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? '2. Nature de l\'Alimentation Basse Tension :' : '2. Service Connection Feed Type:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLineFeedType('OVERHEAD')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      lineFeedType === 'OVERHEAD'
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isFr ? 'Aérien / Poteau Eneo' : 'Overhead Bare/ABC'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLineFeedType('UNDERGROUND')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      lineFeedType === 'UNDERGROUND'
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isFr ? 'Souterrain Intégral' : 'Full Underground'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">{isFr ? 'Règle Normative Cameroun :' : 'Cameroon Normative Rule:'}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isFr
                    ? `Dans la région de ${region.name.split('/')[0]} (Nk = ${region.nk} > 25), un parafoudre en tête de TGBT est rigoureusement OBLIGATOIRE selon la norme NF C 15-100 § 443.`
                    : `In the ${region.name.split('/')[0]} region (Nk = ${region.nk} > 25), an SPD at the service entrance is strictly MANDATORY per NF C 15-100 § 443.`}
                </p>
              </div>
            </div>
          </div>

          {/* Sizing Recommendations Result Column */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'Dimensionnement & Architecture des Parafoudres (SPD)' : 'SPD Sizing & Architecture'}</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isType1Mandatory ? 'TYPE 1 + TYPE 2 COMBINÉ' : 'TYPE 2 RECOMMANDÉ'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary SPD at TGBT Header */}
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs">{isFr ? 'TGBT - Entrée de Poste' : 'Main TGBT Incomer'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {isType1Mandatory ? 'Type 1 + Type 2' : 'Type 2'}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Courant choc Iimp (10/350 µs) :' : 'Impulse current Iimp:'}</span>
                    <span className="font-mono font-bold text-white">{recommendedIimpKa} kA / pôle</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Courant nominal In (8/20 µs) :' : 'Nominal current In:'}</span>
                    <span className="font-mono font-bold text-white">{recommendedInKa} kA</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Niveau de protection Up :' : 'Protection level Up:'}</span>
                    <span className="font-mono font-bold text-emerald-400">≤ {recommendedUpKv} kV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFr ? 'Disjoncteur déconnecteur associé :' : 'Backup Disconnector Breaker:'}</span>
                    <span className="font-mono font-bold text-sky-400">Courbe C 50A / Icu 25kA</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  {isFr
                    ? 'Évacue l\'énergie directe de foudre et protège contre les surtensions atmosphériques transmises par le réseau HTA/BT.'
                    : 'Discharges direct lightning impulse energy and clamps high atmospheric surges transmitted via MV/LV lines.'}
                </p>
              </div>

              {/* Secondary Sub-Distribution SPDs */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400 text-xs">{isFr ? 'Tableaux Divisionnaires (TD)' : 'Sub-Panels (TD)'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                    Type 2 Fin
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Courant nominal In (8/20 µs) :' : 'Nominal current In:'}</span>
                    <span className="font-mono font-bold text-white">5 kA à 10 kA</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Courant max Imax :' : 'Max discharge Imax:'}</span>
                    <span className="font-mono font-bold text-white">{recommendedImaxKa} kA</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{isFr ? 'Niveau de protection Up :' : 'Protection level Up:'}</span>
                    <span className="font-mono font-bold text-emerald-400">≤ 1.1 kV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFr ? 'Règle des 10 mètres :' : '10-meter Rule:'}</span>
                    <span className="font-mono font-bold text-amber-400">Cascade obligatoire</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  {isFr
                    ? 'Indispensable pour protéger les équipements électroniques sensibles (serveurs, automates, climatiseurs Inverter).'
                    : 'Essential to shield sensitive electronic loads (servers, PLCs, Inverter HVAC systems) from residual surges.'}
                </p>
              </div>
            </div>

            {/* Earth Grounding Connection Rule */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-amber-300">{isFr ? 'Règle des 50 cm pour le Raccordement de Terre :' : '50 cm Ground Lead Connection Rule:'}</div>
                <p>
                  {isFr
                    ? 'La longueur totale des conducteurs de raccordement du parafoudre (Phase → Parafoudre + Parafoudre → Barre de Terre PE) ne doit JAMAIS excéder 50 cm. Chaque centimètre supplémentaire ajoute 10 V/cm d\'onde inductive (L·di/dt) réduisant la protection réelle de l\'équipement.'
                    : 'Total wire length (Phase to SPD + SPD to PE ground bar) must NOT exceed 50 cm. Every additional cm adds 10 V/cm inductive drop (L·di/dt), compromising equipment protection.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TROPICAL THERMAL DE-RATING (k1 FACTOR & GENSET)                    */}
      {/* ========================================================================= */}
      {activeTab === 'TROPICAL_DERATING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sun className="w-4 h-4 text-rose-400" />
              <span>{isFr ? 'Température Ambiante & Local' : 'Ambient & Room Temp'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{isFr ? 'Température du Local TGBT :' : 'TGBT Room Temperature:'}</span>
                  <span className="font-mono font-bold text-rose-400">{actualAmbTemp}°C</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={55}
                  value={actualAmbTemp}
                  onChange={(e) => setActualAmbTemp(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>25°C</span>
                  <span>35°C</span>
                  <span>45°C</span>
                  <span>55°C</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? 'Isolant des Câbles :' : 'Conductor Insulation:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsulationType('XLPE')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      insulationType === 'XLPE'
                        ? 'bg-rose-500 text-slate-950 border-rose-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    PR / XLPE (90°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsulationType('PVC')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      insulationType === 'PVC'
                        ? 'bg-rose-500 text-slate-950 border-rose-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    PVC (70°C)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-300">
                  {isFr ? 'Local TGBT Climatisé (25°C) :' : 'Air-Conditioned Switchroom:'}
                </span>
                <input
                  type="checkbox"
                  checked={isSwitchroomConditioned}
                  onChange={(e) => setIsSwitchroomConditioned(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>{isFr ? 'Déclassement des Câbles & du Groupe Électrogène' : 'Cable Ampacity & Genset Derating'}</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                k1 = {k1Derating.toFixed(2)}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cable k1 Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 text-xs">{isFr ? 'Impact sur la Section des Câbles' : 'Cable Sizing Impact'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">CEI 60364-5-52</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {(k1Derating * 100).toFixed(0)}%
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    {isFr ? 'de la capacité nominale' : 'of rated current'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isFr
                    ? `À ${actualAmbTemp}°C en isolant ${insulationType}, un câble calculé pour 100A ne peut transporter en toute sécurité que ${(100 * k1Derating).toFixed(0)}A sous peine de surchauffe et vieillissement prématuré de l'isolant.`
                    : `At ${actualAmbTemp}°C with ${insulationType} insulation, a cable rated for 100A can only safely carry ${(100 * k1Derating).toFixed(0)}A without thermal degradation.`}
                </p>
                <div className="text-[10px] text-amber-400 font-bold">
                  {isFr ? '➔ Règle Cameroun : Augmenter la section d\'un calibre normalisé !' : '➔ Cameroon Rule: Upsize conductor by one standard cross-section!'}
                </div>
              </div>

              {/* Genset Tropicalization Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs">{isFr ? 'Déclassement Groupe Électrogène' : 'Genset Derating'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">ISO 8528-1</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  -{(gensetDeratingPct).toFixed(1)}%
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    ({(gensetCapacityFactor * 100).toFixed(0)}% dispo)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isFr
                    ? `Déclassement cumulé lié à la température (${actualAmbTemp}°C) et à l'altitude de ${region.name.split('/')[0]} (${region.altitudeM}m). Pour alimenter 200 kVA réels, le groupe doit être dimensionné à ${(200 / gensetCapacityFactor).toFixed(0)} kVA.`
                    : `Cumulative derating due to temperature (${actualAmbTemp}°C) and altitude (${region.altitudeM}m). To deliver 200 kVA, genset must be rated at ${(200 / gensetCapacityFactor).toFixed(0)} kVA.`}
                </p>
              </div>
            </div>

            {/* Anti-Condensation Heating Resistors */}
            <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-sky-300">{isFr ? 'Résistances Chauffantes Anti-Condensation TGBT (Obligatoire) :' : 'Anti-Condensation Heaters (Mandatory):'}</div>
                <p>
                  {isFr
                    ? `En raison du taux d'humidité nocturne élevé (${region.humidityPct}% à ${region.name.split('/')[0]}), la baisse de température nocturne provoque le point de rosée sur les jeux de barres en cuivre, créant des amorçages d'arc. Chaque colonne TGBT doit obligatoirement comporter une résistance chauffante de 50W à 100W asservie par hygrostat.`
                    : `Due to high night humidity (${region.humidityPct}% RH), cooling triggers dew-point condensation on copper busbars, provoking flashovers. Every cubicle must include a 50W-100W hygrostat-controlled heating resistor.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GRID BROWNOUTS & VOLTAGE STABILIZER SIZING                        */}
      {/* ========================================================================= */}
      {activeTab === 'GRID_BROWNOUT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <TrendingDown className="w-4 h-4 text-sky-400" />
              <span>{isFr ? 'Tension Réseau Eneo Réelle' : 'Simulated Grid Voltage'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{isFr ? 'Tension Monophasée Réseau :' : '1-Phase Grid Voltage:'}</span>
                  <span className={`font-mono font-bold ${simulatedGridVoltage < 195 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {simulatedGridVoltage} V <span className="text-[10px] text-slate-400">({brownout3PhaseVoltage.toFixed(0)}V 3P)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={250}
                  value={simulatedGridVoltage}
                  onChange={(e) => setSimulatedGridVoltage(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span className="text-rose-400 font-bold">150V (Chute sévère)</span>
                  <span>200V</span>
                  <span className="text-emerald-400 font-bold">230V (Nominal)</span>
                  <span>250V</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? 'Puissance Moteur / Charge Critique :' : 'Motor Load Rating:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={motorNominalKw}
                    onChange={(e) => setMotorNominalKw(Number(e.target.value))}
                    className="p-2 rounded-lg bg-slate-950 text-white font-mono font-bold border border-slate-800 w-full"
                  />
                  <span className="text-slate-400 font-bold text-xs">kW</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-400 text-[10px] font-bold uppercase">{isFr ? 'Diagnostic Relais U < :' : 'Undervoltage Trip (U <):'}</div>
                {simulatedGridVoltage < 195 ? (
                  <div className="text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{isFr ? 'DÉCLENCHEMENT : Tension sous le seuil critique (0.85 Un)' : 'TRIP: Voltage below critical threshold (0.85 Un)'}</span>
                  </div>
                ) : (
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isFr ? 'Tension dans la plage de fonctionnement tolérée' : 'Voltage within acceptable operating tolerance'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sizing & Electrical Impact Result Column */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>{isFr ? 'Impact Moteur & Dimensionnement du Stabilisateur' : 'Motor Thermal Impact & Servo-Stabilizer'}</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                {isFr ? 'Stabilisateur Recommandé :' : 'Recommended Stabilizer:'} {stabilizerKva} kVA
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Motor Thermal Stress */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400">{isFr ? 'Surintensité Moteur (Baisse de Tension)' : 'Motor Current Rise'}</div>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-2xl font-black text-white">{actualCurrentBrownout.toFixed(1)} A</span>
                  <span className="text-xs text-slate-400">vs {nominalCurrent400V.toFixed(1)} A nominal</span>
                </div>
                <div className="text-[11px] text-rose-300 font-bold">
                  {isFr
                    ? `Courant augmenté de +${currentIncreasePct.toFixed(1)}%`
                    : `Current increased by +${currentIncreasePct.toFixed(1)}%`}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isFr
                    ? `L'effet Joule dans les bobinages statoriques est multiplié par ${copperLossMultiplier.toFixed(2)}x (P = R·I²). Sans stabilisateur, les moteurs de climatisation et pompes grillent en quelques heures.`
                    : `Stator winding thermal heating multiplies by ${copperLossMultiplier.toFixed(2)}x (P = R·I²). Without a stabilizer, pump and HVAC motors overheat rapidly.`}
                </p>
              </div>

              {/* Stabilizer Specification Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-2">
                <div className="text-xs font-bold text-sky-400">{isFr ? 'Spécification Technique du Régulateur' : 'Servo-Stabilizer Spec'}</div>
                <div className="text-2xl font-black text-white font-mono">{stabilizerKva} kVA</div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-0.5">
                    <span>{isFr ? 'Technologie :' : 'Technology:'}</span>
                    <span className="font-bold text-white">Servomoteur électromécanique 3P</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-0.5">
                    <span>{isFr ? 'Plage d\'entrée admise :' : 'Input Voltage Range:'}</span>
                    <span className="font-bold text-white">160 V – 260 V par phase</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFr ? 'Précision sortie :' : 'Output Precision:'}</span>
                    <span className="font-bold text-emerald-400">400 V ± 1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ENEO ELECTRICITY TARIFFS & REACTIVE POWER PENALTY                  */}
      {/* ========================================================================= */}
      {activeTab === 'ENEO_TARIFF' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Puissance & Facteur de Puissance' : 'Power & Cos φ Parameters'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? '1. Tranche Tarifaire Eneo :' : '1. Eneo Tariff Category:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTariffBracket('TARIF_2')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      tariffBracket === 'TARIF_2'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Tarif 2 (Tertiaire/Pro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTariffBracket('TARIF_3')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer ${
                      tariffBracket === 'TARIF_3'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Tarif 3 (PME / Usine)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? '2. Puissance Active Souscrite :' : '2. Subscribed Active Power:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={activePowerKw}
                    onChange={(e) => setActivePowerKw(Number(e.target.value))}
                    className="p-2 rounded-lg bg-slate-950 text-white font-mono font-bold border border-slate-800 w-full"
                  />
                  <span className="text-slate-400 font-bold text-xs">kW</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{isFr ? '3. Facteur de Puissance (cos φ) :' : '3. Power Factor (cos φ):'}</span>
                  <span className={`font-mono font-bold ${currentCosPhi < 0.93 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentCosPhi.toFixed(2)} (tan φ = {tanPhi1.toFixed(2)})
                  </span>
                </div>
                <input
                  type="range"
                  min={0.65}
                  max={0.99}
                  step={0.01}
                  value={currentCosPhi}
                  onChange={(e) => setCurrentCosPhi(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span className="text-rose-400">0.65 (Pénalité MAX)</span>
                  <span className="text-amber-400">0.93 (Seuil ARSEL)</span>
                  <span className="text-emerald-400">0.99 (Optimal)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column: Penalties & Compensation */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'Optimisation Facture Eneo & Batterie de Condensateurs' : 'Eneo Bill Optimization & Capacitors'}</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {isFr ? 'Batterie Requise :' : 'Required Bank:'} {requiredQcKvar} kvar
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Penalty Card */}
              <div className={`p-4 rounded-xl border space-y-2 ${isPenaltyApplicable ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-400">{isFr ? 'Pénalité Réactive Eneo (tan φ > 0.40)' : 'Eneo Reactive Surcharge'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Décret ARSEL</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {reactivePenaltyFcfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  <span className="text-xs font-normal text-slate-400 ml-1">/ mois</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isPenaltyApplicable
                    ? isFr
                      ? `Votre installation rejette de l'énergie réactive (cos φ = ${currentCosPhi.toFixed(2)}). Eneo applique une surtaxe sur chaque facture d'environ ${(reactivePenaltyFcfa * 12).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA par an !`
                      : `Facility draws excessive reactive power (cos φ = ${currentCosPhi.toFixed(2)}). Eneo bills approximately ${(reactivePenaltyFcfa * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })} FCFA/year in penalties!`
                    : isFr
                    ? 'Aucune pénalité ! Le facteur de puissance est supérieur à 0.93 (tan φ ≤ 0.40).'
                    : 'No penalties! Power factor exceeds 0.93 threshold.'}
                </p>
              </div>

              {/* Capacitor Solution Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">{isFr ? 'Batterie Automatique à Gradins' : 'Automatic Step Capacitor Bank'}</span>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold">Retour &lt; 8 mois</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{requiredQcKvar} kvar</div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex justify-between border-b border-slate-800 pb-0.5">
                    <span>{isFr ? 'Type de régulateur :' : 'Controller Type:'}</span>
                    <span className="font-bold text-white">Varlogic 6 ou 12 gradins</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-0.5">
                    <span>{isFr ? 'Selfs anti-harmoniques :' : 'Detuned Reactors:'}</span>
                    <span className="font-bold text-amber-400">Obligatoires (fréquence 189 Hz)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFr ? 'Gain annuel estimé :' : 'Estimated Annual Savings:'}</span>
                    <span className="font-bold text-emerald-400">
                      {(reactivePenaltyFcfa * 12).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
