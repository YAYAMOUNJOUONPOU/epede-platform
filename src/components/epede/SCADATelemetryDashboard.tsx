// src/components/epede/SCADATelemetryDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Server,
  Radio,
} from 'lucide-react';

export interface SCADATelemetryDashboardProps {
  locale: 'fr' | 'en';
}

interface TelemetryPoint {
  time: string;
  load: number;
  frequency: number;
}

interface Asset {
  id: string;
  name: string;
  nameFr: string;
  type: string;
  typeFr: string;
  voltage: string;
  state: 'Normal' | 'Warning' | 'Offline';
  load: number;
  temperature: number;
}

interface Alarm {
  id: number;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  messageFr: string;
  asset: string;
  time: string;
  timeFr: string;
  acknowledged: boolean;
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: 'sub-mangue',
    name: 'Mangombé 225 kV Substation',
    nameFr: 'Poste 225 kV de Mangombé (Édéa)',
    type: 'Substation',
    typeFr: 'Poste THT',
    voltage: '225 kV / 90 kV',
    state: 'Normal',
    load: 74,
    temperature: 62,
  },
  {
    id: 'tx-nachtigal',
    name: 'Nachtigal GSU Transformer TX-01',
    nameFr: 'Transformateur Élévateur TX-01 (Nachtigal)',
    type: 'Step-Up Transformer',
    typeFr: 'Transformateur Élévateur',
    voltage: '15 kV / 225 kV',
    state: 'Normal',
    load: 82,
    temperature: 68,
  },
  {
    id: 'line-bekoko',
    name: 'Songloulou – Bekoko 225 kV Line 1',
    nameFr: 'Ligne 225 kV Songloulou – Bekoko L1',
    type: 'Transmission Line',
    typeFr: 'Ligne de Transport',
    voltage: '225 kV',
    state: 'Warning',
    load: 89,
    temperature: 71,
  },
  {
    id: 'bus-oyomabang',
    name: 'Oyomabang 90 kV Main Bus A',
    nameFr: 'Jeu de Barres 90 kV Oyomabang A',
    type: 'Busbar Bay',
    typeFr: 'Travée Jeu de Barres',
    voltage: '90 kV',
    state: 'Normal',
    load: 64,
    temperature: 46,
  },
];

const INITIAL_ALARMS: Alarm[] = [
  {
    id: 1,
    severity: 'Warning',
    message: 'Transmission line Songloulou-Bekoko approaching thermal rating (89%)',
    messageFr: 'Ligne Songloulou-Bekoko proche de la limite thermique admissible (89%)',
    asset: 'Songloulou – Bekoko 225 kV',
    time: 'Now',
    timeFr: 'À l\'instant',
    acknowledged: false,
  },
  {
    id: 2,
    severity: 'Info',
    message: 'Capacitor bank C-02 automatic switching event completed',
    messageFr: 'Enclenchement automatique de la batterie de condensateurs C-02 achevé',
    asset: 'Oyomabang 90 kV',
    time: '3 min ago',
    timeFr: 'Il y a 3 min',
    acknowledged: false,
  },
  {
    id: 3,
    severity: 'Critical',
    message: 'IEC 61850 GOOSE latency spike detected on bay protection relay',
    messageFr: 'Augmentation de latence GOOSE CEI 61850 détectée sur relais de protection',
    asset: 'Mangombé 225 kV',
    time: '9 min ago',
    timeFr: 'Il y a 9 min',
    acknowledged: false,
  },
];

function buildInitialTelemetry(): TelemetryPoint[] {
  return Array.from({ length: 30 }, (_, index) => ({
    time: `${index - 29}m`,
    load: 62 + Math.sin(index / 3) * 8 + Math.random() * 3,
    frequency: 50.0 + Math.sin(index / 4) * 0.04 + (Math.random() - 0.5) * 0.02,
  }));
}

export const SCADATelemetryDashboard: React.FC<SCADATelemetryDashboardProps> = ({
  locale,
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(buildInitialTelemetry);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [alarms, setAlarms] = useState<Alarm[]>(INITIAL_ALARMS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('sub-mangue');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('12:00:00');

  useEffect(() => {
    if (!isLive) return;

    const timer = window.setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      setTelemetry((prev) => {
        const last = prev[prev.length - 1];
        const nextLoad = Math.max(45, Math.min(95, last.load + (Math.random() - 0.49) * 3.5));
        const nextFreq = Math.max(49.85, Math.min(50.15, 50.0 + (Math.random() - 0.5) * 0.05));
        return [...prev.slice(1), { time: timeStr, load: nextLoad, frequency: nextFreq }];
      });

      setAssets((prev) =>
        prev.map((asset) => ({
          ...asset,
          load: Math.max(30, Math.min(95, asset.load + (Math.random() - 0.48) * 2.2)),
          temperature: Math.max(40, Math.min(85, asset.temperature + (Math.random() - 0.48) * 0.8)),
        }))
      );

      setLastUpdated(timeStr);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isLive]);

  const latest = telemetry[telemetry.length - 1];
  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? assets[0];
  const averageLoad = useMemo(
    () => assets.reduce((sum, a) => sum + a.load, 0) / assets.length,
    [assets]
  );
  const unacknowledgedCount = alarms.filter((a) => !a.acknowledged).length;

  const handleAcknowledge = (id: number) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <section
      className="scada-dashboard-container rounded-2xl border border-[#252E38] bg-[#0B0F12] p-6 sm:p-8 text-[#F4F1E8] shadow-2xl space-y-6"
      aria-label="SCADA telemetry operations view"
    >
      {/* SCADA Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2630] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#D7A64A] uppercase">
            <Radio className="h-4 w-4 text-[#D7A64A]" />
            <span>{locale === 'fr' ? 'CENTRE DE TÉLÉCONDUITE SCADA & DISPATCHING' : 'EPEDE / SCADA GRID OPERATIONS'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-1">
            {locale === 'fr' ? 'Supervision Temps Réel du Réseau' : 'Live Power Grid Telemetry'}
          </h3>
          <p className="text-sm text-[#A9ADA5] mt-1 max-w-2xl">
            {locale === 'fr'
              ? 'Télésignalisation, télémesures de charge active/réactive et télésurveillance des départs critiques.'
              : 'Real-time telemetry, active/reactive load flows, and protection status of monitored network substations.'}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold ${
              isLive
                ? 'bg-[#75A88C]/10 border-[#75A88C]/40 text-[#75A88C]'
                : 'bg-[#D49A4A]/10 border-[#D49A4A]/40 text-[#D49A4A]'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isLive ? 'bg-[#75A88C] animate-pulse shadow-[0_0_8px_#75A88C]' : 'bg-[#D49A4A]'
              }`}
            />
            {isLive ? (locale === 'fr' ? 'Flux Actif' : 'Stream Live') : (locale === 'fr' ? 'En Pause' : 'Stream Paused')}
          </span>

          <button
            type="button"
            onClick={() => setIsLive((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-xl border border-[#252E38] bg-[#151C1E] hover:bg-[#1E2630] text-[#F4F1E8] flex items-center gap-1.5 font-bold transition-all cursor-pointer active:scale-95"
          >
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-[#D7A64A]" />}
            <span>{isLive ? (locale === 'fr' ? 'Mettre en pause' : 'Pause') : (locale === 'fr' ? 'Reprendre' : 'Resume')}</span>
          </button>
        </div>
      </div>

      {/* KPI Grid (4 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Load */}
        <div className="p-4 rounded-xl border border-[#252E38] bg-[#151C1E]/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#D7A64A]" />
          <span className="text-[11px] font-mono text-[#A9ADA5] block uppercase tracking-wider">
            {locale === 'fr' ? 'Charge Globale Réseau' : 'Total Grid Load'}
          </span>
          <strong className="text-2xl font-mono text-white block mt-1">
            {latest.load.toFixed(1)} MW
          </strong>
          <span className="text-[10px] font-mono text-[#75A88C] mt-1 block">
            ▲ +1.8% {locale === 'fr' ? 'tendance horaire' : 'hourly trend'}
          </span>
        </div>

        {/* Frequency */}
        <div className="p-4 rounded-xl border border-[#252E38] bg-[#151C1E]/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#75A88C]" />
          <span className="text-[11px] font-mono text-[#A9ADA5] block uppercase tracking-wider">
            {locale === 'fr' ? 'Fréquence Interconnectée' : 'Grid Frequency'}
          </span>
          <strong className="text-2xl font-mono text-white block mt-1">
            {latest.frequency.toFixed(2)} Hz
          </strong>
          <span className="text-[10px] font-mono text-[#75A88C] mt-1 block">
            ● {locale === 'fr' ? 'Plage nominale 50±0.2 Hz' : 'Nominal 50±0.2 Hz range'}
          </span>
        </div>

        {/* Fleet Average Load */}
        <div className="p-4 rounded-xl border border-[#252E38] bg-[#151C1E]/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#567A87]" />
          <span className="text-[11px] font-mono text-[#A9ADA5] block uppercase tracking-wider">
            {locale === 'fr' ? 'Charge Moyenne Ouvrages' : 'Fleet Utilization'}
          </span>
          <strong className="text-2xl font-mono text-white block mt-1">
            {averageLoad.toFixed(0)}%
          </strong>
          <span className="text-[10px] font-mono text-[#A9ADA5] mt-1 block">
            {assets.length} {locale === 'fr' ? 'postes télécommandés' : 'monitored assets'}
          </span>
        </div>

        {/* Active Alarms */}
        <div className="p-4 rounded-xl border border-[#252E38] bg-[#151C1E]/90 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 bottom-0 w-1 ${
              unacknowledgedCount > 0 ? 'bg-[#D49A4A]' : 'bg-[#75A88C]'
            }`}
          />
          <span className="text-[11px] font-mono text-[#A9ADA5] block uppercase tracking-wider">
            {locale === 'fr' ? 'Alarmes Actives' : 'Active Alarms'}
          </span>
          <strong
            className={`text-2xl font-mono block mt-1 ${
              unacknowledgedCount > 0 ? 'text-[#D49A4A]' : 'text-[#75A88C]'
            }`}
          >
            {unacknowledgedCount}
          </strong>
          <span className="text-[10px] font-mono text-[#A9ADA5] mt-1 block">
            {unacknowledgedCount > 0
              ? (locale === 'fr' ? 'Action requise dispatching' : 'Review required')
              : (locale === 'fr' ? 'Régime normal' : 'Clear')}
          </span>
        </div>
      </div>

      {/* Main Grid: Telemetry Chart + Asset Fleet List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SVG Chart Panel */}
        <div className="lg:col-span-8 p-5 rounded-xl border border-[#252E38] bg-[#151C1E]/75 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider">
                {locale === 'fr' ? 'COURBE TEMPS RÉEL' : 'REAL-TIME TREND'}
              </span>
              <h4 className="text-lg font-bold font-mono text-white">
                {locale === 'fr' ? 'Puissance Active (MW) & Fréquence (Hz)' : 'Active Power (MW) & Grid Frequency (Hz)'}
              </h4>
            </div>
            <span className="text-xs font-mono text-[#A9ADA5]">
              {locale === 'fr' ? `Actualisé à ${lastUpdated}` : `Updated at ${lastUpdated}`}
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 w-full mt-4 relative">
            <svg className="h-full w-full" viewBox="0 0 760 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scadaAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D7A64A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D7A64A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="30"
                  y1={30 + i * 50}
                  x2="730"
                  y2={30 + i * 50}
                  stroke="rgba(169, 173, 165, 0.12)"
                  strokeDasharray="4 6"
                />
              ))}

              {/* Area Under Curve */}
              {(() => {
                const pts = telemetry;
                const path = pts
                  .map((p, idx) => {
                    const x = 30 + (idx / (pts.length - 1)) * 700;
                    const y = 180 - ((p.load - 40) / 60) * 140;
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <path
                    d={`${path} L 730 180 L 30 180 Z`}
                    fill="url(#scadaAreaFill)"
                  />
                );
              })()}

              {/* Load Line */}
              {(() => {
                const pts = telemetry;
                const path = pts
                  .map((p, idx) => {
                    const x = 30 + (idx / (pts.length - 1)) * 700;
                    const y = 180 - ((p.load - 40) / 60) * 140;
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(' ');
                const lastPt = pts[pts.length - 1];
                const lastX = 730;
                const lastY = 180 - ((lastPt.load - 40) / 60) * 140;

                return (
                  <>
                    <path
                      d={path}
                      fill="none"
                      stroke="#D7A64A"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_0_6px_rgba(215,166,74,0.7)]"
                    />
                    <circle
                      cx={lastX}
                      cy={lastY}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#D7A64A"
                      strokeWidth="3"
                    />
                  </>
                );
              })()}

              {/* Frequency Dashed Line */}
              {(() => {
                const pts = telemetry;
                const path = pts
                  .map((p, idx) => {
                    const x = 30 + (idx / (pts.length - 1)) * 700;
                    const y = 180 - ((p.frequency - 49.8) / 0.4) * 140;
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <path
                    d={path}
                    fill="none"
                    stroke="#75A88C"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                );
              })()}
            </svg>
          </div>

          <div className="flex items-center gap-6 mt-3 text-xs font-mono text-[#A9ADA5] pt-2 border-t border-[#252E38]">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-6 rounded bg-[#D7A64A]" />
              {locale === 'fr' ? 'Charge Totale (MW)' : 'Total Load (MW)'}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-6 border-b-2 border-dashed border-[#75A88C]" />
              {locale === 'fr' ? 'Fréquence de Réseau (50.00 Hz)' : 'Grid Frequency (50.00 Hz)'}
            </span>
          </div>
        </div>

        {/* Asset Fleet Selector */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-[#252E38] bg-[#151C1E]/75 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
              <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider">
                {locale === 'fr' ? 'PARC D\'OUVRAGES' : 'ASSET FLEET'}
              </span>
              <span className="text-xs font-mono text-[#A9ADA5]">
                {assets.length} {locale === 'fr' ? 'actifs' : 'online'}
              </span>
            </div>

            <div className="space-y-2 mt-4">
              {assets.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all font-mono text-xs flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#D7A64A] bg-[#D7A64A]/10 text-white shadow-md'
                        : 'border-[#252E38] bg-[#0B0F12]/80 text-[#A9ADA5] hover:text-white hover:border-[#3A4553]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          asset.state === 'Normal'
                            ? 'bg-[#75A88C] shadow-[0_0_6px_#75A88C]'
                            : asset.state === 'Warning'
                            ? 'bg-[#D49A4A] shadow-[0_0_6px_#D49A4A]'
                            : 'bg-[#C86B4B]'
                        }`}
                      />
                      <div>
                        <strong className="block text-white text-xs">
                          {locale === 'fr' ? asset.nameFr : asset.name}
                        </strong>
                        <span className="text-[10px] text-[#A9ADA5]">
                          {asset.voltage} · {locale === 'fr' ? asset.typeFr : asset.type}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white text-right">
                      {asset.load.toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#252E38] text-[11px] font-mono text-[#A9ADA5] flex items-center justify-between">
            <span>{locale === 'fr' ? 'Protocole télésurveillance :' : 'Monitoring protocol:'}</span>
            <span className="text-[#D7A64A] font-bold">IEC 60870-5-104 / 61850</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Selected Asset Inspection + Alarm Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Selected Asset Inspection Card */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-[#252E38] bg-[#151C1E]/75 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider">
                {locale === 'fr' ? 'TÉLÉMESURE DÉTAILLÉE DE L\'OUVRAGE' : 'SELECTED ASSET TELEMETRY'}
              </span>
              <h4 className="text-lg font-bold font-mono text-white">
                {locale === 'fr' ? selectedAsset.nameFr : selectedAsset.name}
              </h4>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                selectedAsset.state === 'Normal'
                  ? 'bg-[#75A88C]/15 text-[#75A88C] border border-[#75A88C]/30'
                  : 'bg-[#D49A4A]/15 text-[#D49A4A] border border-[#D49A4A]/30'
              }`}
            >
              {selectedAsset.state}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38]">
              <span className="text-[10px] text-[#A9ADA5] block uppercase">
                {locale === 'fr' ? 'Type d\'Ouvrage' : 'Asset Type'}
              </span>
              <strong className="text-xs text-white block mt-1">
                {locale === 'fr' ? selectedAsset.typeFr : selectedAsset.type}
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38]">
              <span className="text-[10px] text-[#A9ADA5] block uppercase">
                {locale === 'fr' ? 'Tension' : 'Voltage'}
              </span>
              <strong className="text-xs text-[#D7A64A] block mt-1">
                {selectedAsset.voltage}
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38]">
              <span className="text-[10px] text-[#A9ADA5] block uppercase">
                {locale === 'fr' ? 'Charge Actuelle' : 'Load Ratio'}
              </span>
              <strong className="text-xs text-white block mt-1">
                {selectedAsset.load.toFixed(1)}%
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F12] border border-[#252E38]">
              <span className="text-[10px] text-[#A9ADA5] block uppercase">
                {locale === 'fr' ? 'Température Cuve' : 'Oil Temp'}
              </span>
              <strong className="text-xs text-[#75A88C] block mt-1">
                {selectedAsset.temperature.toFixed(1)} °C
              </strong>
            </div>
          </div>

          {/* Load Capacity Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#A9ADA5] mb-1">
              <span>{locale === 'fr' ? 'Utilisation de la capacité nominale' : 'Capacity Utilization'}</span>
              <span>{selectedAsset.load.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#0B0F12] border border-[#252E38] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, selectedAsset.load)}%`,
                  background:
                    selectedAsset.load > 85
                      ? 'linear-gradient(90deg, #75A88C, #D49A4A, #C86B4B)'
                      : 'linear-gradient(90deg, #567A87, #75A88C)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Alarm & Event Queue */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-[#252E38] bg-[#151C1E]/75 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider">
                {locale === 'fr' ? 'JOURNAL DES ÉVÉNEMENTS & ALARMES' : 'EVENT & ALARM QUEUE'}
              </span>
              <h4 className="text-lg font-bold font-mono text-white">
                {locale === 'fr' ? 'File d\'Attente Dispatcher' : 'Real-Time Relay Events'}
              </h4>
            </div>
            <span className="text-xs font-mono text-[#A9ADA5]">
              {unacknowledgedCount} {locale === 'fr' ? 'non acquittées' : 'unacknowledged'}
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-opacity ${
                  alarm.acknowledged
                    ? 'border-[#1E2630] bg-[#0B0F12]/50 opacity-40'
                    : 'border-[#252E38] bg-[#0B0F12]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      alarm.severity === 'Critical'
                        ? 'bg-[#C86B4B] shadow-[0_0_6px_#C86B4B]'
                        : alarm.severity === 'Warning'
                        ? 'bg-[#D49A4A]'
                        : 'bg-[#567A87]'
                    }`}
                  />
                  <div>
                    <strong className="block text-white text-xs font-medium">
                      {locale === 'fr' ? alarm.messageFr : alarm.message}
                    </strong>
                    <span className="text-[10px] text-[#A9ADA5]">
                      {alarm.asset} · {locale === 'fr' ? alarm.timeFr : alarm.time}
                    </span>
                  </div>
                </div>

                {!alarm.acknowledged && (
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(alarm.id)}
                    className="px-2.5 py-1 rounded border border-[#D7A64A]/50 bg-[#D7A64A]/10 hover:bg-[#D7A64A] hover:text-[#080B0D] text-[#D7A64A] text-[10px] font-bold uppercase transition-all cursor-pointer shrink-0"
                  >
                    {locale === 'fr' ? 'Acquitter' : 'Ack'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-3.5 rounded-xl border border-[#252E38] bg-[#080B0D] text-xs font-mono text-[#A9ADA5] flex items-center gap-3">
        <ShieldCheck className="h-4 w-4 text-[#75A88C] shrink-0" />
        <p className="leading-relaxed">
          {locale === 'fr'
            ? 'Périmètre Pédagogique : Les valeurs affichées sont simulées pour l\'expérimentation d\'interface et la compréhension du pilotage de réseau. Dans un centre de dispatching réel, ces flux sont alimentés via des passerelles sécurisées CEI 60870-5-104 / ICCP / OPC-UA sous homologation ANIF/ART.'
            : 'Educational Boundary: Monitored telemetry values are simulated locally for interface exploration and training. Operational utility dispatch requires secured IEC 60870-5-104 / ICCP / OPC-UA gateways with audited security credentials.'}
        </p>
      </div>
    </section>
  );
};
