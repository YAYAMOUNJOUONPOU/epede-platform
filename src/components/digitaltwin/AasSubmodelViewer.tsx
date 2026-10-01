// src/components/digitaltwin/AasSubmodelViewer.tsx
// Asset Administration Shell (AAS v3 / IEC 63278) Digital Twin Viewer
// Compliant with IDTA Specifications:
// - IDTA 02006: Digital Nameplate (VDI 2770 / IEC 61406)
// - IDTA 02003: Technical Data (ECLASS / IEC CDD Semantic Identifiers)
// - IDTA 02008: Time Series & Linked Segments
// - OperatorFabric Action Card Operational Stream

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  FileText,
  Download,
  Copy,
  Check,
  Radio,
  Sliders,
  AlertTriangle,
  ShieldCheck,
  QrCode,
  Globe2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Terminal,
  Zap,
  Info,
  X
} from 'lucide-react';
import type { Equipment } from '../../types/epede';

interface AasSubmodelViewerProps {
  equipment: Equipment;
  locale: 'fr' | 'en';
  onClose?: () => void;
}

type SubmodelId = 'nameplate' | 'technical_data' | 'operational_data' | 'operator_fabric' | 'documentation' | 'aasx_export';

export const AasSubmodelViewer: React.FC<AasSubmodelViewerProps> = ({
  equipment,
  locale,
  onClose
}) => {
  const [activeSubmodel, setActiveSubmodel] = useState<SubmodelId>('nameplate');
  const [isSimulatingTelemetry, setIsSimulatingTelemetry] = useState<boolean>(true);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Dynamic Telemetry State (Simulated SCADA / IoT feed)
  const [telemetry, setTelemetry] = useState({
    currentL1: 412.5,
    currentL2: 408.2,
    currentL3: 415.8,
    voltageU12: 224.8,
    frequency: 50.02,
    powerFactor: 0.94,
    temperatureOil: 68.4,
    vibrationRms: 2.1,
    healthIndex: 94.5,
    activeAlertsCount: 1
  });

  // Telemetry fluctuation simulator
  useEffect(() => {
    if (!isSimulatingTelemetry) return;
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        currentL1: +(prev.currentL1 + (Math.random() * 4 - 2)).toFixed(1),
        currentL2: +(prev.currentL2 + (Math.random() * 4 - 2)).toFixed(1),
        currentL3: +(prev.currentL3 + (Math.random() * 4 - 2)).toFixed(1),
        voltageU12: +(prev.voltageU12 + (Math.random() * 0.4 - 0.2)).toFixed(1),
        frequency: +(50.0 + (Math.random() * 0.08 - 0.04)).toFixed(2),
        temperatureOil: +(prev.temperatureOil + (Math.random() * 0.2 - 0.1)).toFixed(1),
        vibrationRms: +(prev.vibrationRms + (Math.random() * 0.1 - 0.05)).toFixed(2)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulatingTelemetry]);

  // AAS Identification Metadata
  const globalAssetId = `urn:epede:equipment:${equipment.id}`;
  const assetIdShort = equipment.id.toUpperCase().replace(/-/g, '_');
  const manufacturer = equipment.id.includes('gis') || equipment.id.includes('trafo')
    ? 'Siemens Energy / Schneider Electric'
    : equipment.id.includes('relay')
    ? 'ABB Power Grids / SEL'
    : 'Schneider Electric France';
  const serialNumber = `SNTR-${equipment.id.toUpperCase().slice(0, 10)}-2024-CM`;
  const eclassCategory = '27-14-23-01 (Transformateur / Appareillage)';

  // Copy JSON-LD
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawAasJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Raw AAS JSON-LD representation (Type 2 REST schema)
  const rawAasJson = {
    "@context": "https://admin-shell.io/aas/3/0",
    "id": globalAssetId,
    "idShort": assetIdShort,
    "assetInformation": {
      "assetKind": "Instance",
      "globalAssetId": `urn:serial:${serialNumber}`,
      "specificAssetIds": [
        { "name": "EneoAssetTag", "value": `ENEO-DOUALA-${equipment.id.slice(0, 6)}` },
        { "name": "IEC61406_QRCodeURI", "value": `https://epede.io/aas/qr/${equipment.id}` }
      ]
    },
    "submodels": [
      {
        "idShort": "DigitalNameplate",
        "semanticId": { "type": "GlobalReference", "value": "0173-1#01-AFZ615#002" },
        "properties": {
          "ManufacturerName": manufacturer,
          "SerialNumber": serialNumber,
          "YearOfConstruction": 2024,
          "ClimaticClass": "Tropical C4/C5, 45°C ambient, 95% RH"
        }
      },
      {
        "idShort": "TechnicalData",
        "semanticId": { "type": "GlobalReference", "value": "0173-1#01-AHF578#001" },
        "properties": equipment.technical || {
          "RatedVoltage": "225 kV",
          "RatedCurrent": "2000 A",
          "BreakingCapacity": "50 kA"
        }
      },
      {
        "idShort": "OperationalData",
        "semanticId": { "type": "GlobalReference", "value": "0173-1#01-AAS008#001" },
        "telemetryEndpoint": `mqtts://telemetry.eneo.cm:8883/substations/bassa/${equipment.id}`,
        "metrics": telemetry
      }
    ]
  };

  const submodelTabs = [
    { id: 'nameplate', labelFr: 'Plaque Signalétique', labelEn: 'Digital Nameplate', icon: '🏷️', badge: 'IDTA 02006' },
    { id: 'technical_data', labelFr: 'Données Techniques (ECLASS)', labelEn: 'Technical Data', icon: '⚙️', badge: 'IDTA 02003' },
    { id: 'operational_data', labelFr: 'Télémétrie & Flux SCADA', labelEn: 'Live Telemetry', icon: '📡', badge: 'IDTA 02008' },
    { id: 'operator_fabric', labelFr: 'Alertes OperatorFabric', labelEn: 'OperatorFabric HMI', icon: '🚨', badge: 'RTE France' },
    { id: 'documentation', labelFr: 'Dossier & Schémas', labelEn: 'Documentation', icon: '📄', badge: 'VDI 2770' },
    { id: 'aasx_export', labelFr: 'Export AAS v3 / JSON-LD', labelEn: 'AASX Export', icon: '💾', badge: 'IEC 63278' },
  ];

  return (
    <div className="bg-[#090D14] border border-[#222B38] rounded-2xl overflow-hidden shadow-2xl font-sans text-slate-200">
      
      {/* 1. AAS TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0d1424] via-[#101b33] to-[#0d1424] border-b border-[#253248] p-5 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Asset Administration Shell · IEC 63278 / IDTA v3.0</span>
              <span className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded text-[9px]">
                Type 2 (REST &amp; MQTT)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>{locale === 'fr' ? equipment.name_fr : equipment.name_en}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-normal">
                {assetIdShort}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
              <span>GlobalAssetID: <strong className="text-slate-200">{globalAssetId}</strong></span>
              <span>•</span>
              <span>S/N: <strong className="text-amber-400">{serialNumber}</strong></span>
              <span>•</span>
              <span>Catégorie ECLASS: <strong className="text-emerald-400">{eclassCategory}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
                title="Fermer la vue Jumeau Numérique"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Real-Time Telemetry Bar at Header Bottom */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Courant IL1</span>
            <span className="font-bold text-white text-sm">{telemetry.currentL1} A</span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Tension U12</span>
            <span className="font-bold text-cyan-400 text-sm">{telemetry.voltageU12} kV</span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Fréquence f</span>
            <span className="font-bold text-emerald-400 text-sm">{telemetry.frequency} Hz</span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Temp. Huile / Bob.</span>
            <span className={`font-bold text-sm ${telemetry.temperatureOil > 75 ? 'text-red-400' : 'text-amber-400'}`}>
              {telemetry.temperatureOil} °C
            </span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Vibration RMS</span>
            <span className="font-bold text-indigo-300 text-sm">{telemetry.vibrationRms} mm/s</span>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Indice Santé (SOH)</span>
            <span className="font-bold text-emerald-400 text-sm">{telemetry.healthIndex}%</span>
          </div>
        </div>
      </div>

      {/* 2. SUBMODEL TAB SELECTOR */}
      <div className="flex gap-1.5 p-2 bg-black/40 border-b border-white/10 overflow-x-auto scrollbar-thin">
        {submodelTabs.map((tab) => {
          const isActive = activeSubmodel === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubmodel(tab.id as SubmodelId)}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-slate-400 border border-white/10">
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SUBMODEL CONTENT PANELS */}
      <div className="p-6">
        
        {/* SUBMODEL 1: DIGITAL NAMEPLATE (IDTA 02006 / VDI 2770) */}
        {activeSubmodel === 'nameplate' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>🏷️</span> IDTA 02006 — Digital Nameplate (Sous-Modèle Plaque Signalétique)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Plaque constructeur normalisée selon IEC 61406, VDI 2770 et décret CEMAC d'homologation.
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">
                SemanticId: 0173-1#01-AFZ615#002
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* QR Code & Identification Visual */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-28 h-28 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-white">IEC 61406 Identification Link</div>
                  <div className="font-mono text-[10px] text-cyan-400 break-all">
                    https://epede.io/aas/{equipment.id}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  Scannable sur chantier via smartphone Android
                </div>
              </div>

              {/* Standard Nameplate Parameters Table */}
              <div className="md:col-span-2 bg-black/30 border border-white/10 rounded-xl p-5 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/10 pb-2">
                  Propriétés Normalisées IDTA
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Fabricant (ManufacturerName)</span>
                    <span className="text-white font-bold">{manufacturer}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Désignation Produit</span>
                    <span className="text-cyan-300 font-bold">{equipment.id.toUpperCase()}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Numéro de Série (SerialNumber)</span>
                    <span className="text-amber-400 font-bold">{serialNumber}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Année de Construction</span>
                    <span className="text-white">2024 (Mise en service réseau 2025)</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Indice de Protection</span>
                    <span className="text-emerald-400 font-bold">IP54 / IP65 Cuve &amp; Armoire</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Classe Climatique Tropicale</span>
                    <span className="text-amber-300 font-bold">C4/C5 · 45°C Ambiant · 95% Humidité</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Marquages &amp; Certifications</span>
                    <span className="text-slate-200">CE, IEC 62271, CIGRE, Homologué SONATREL</span>
                  </div>
                  <div className="border-b border-white/5 pb-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase">Localisation SIG / Poste</span>
                    <span className="text-slate-200">Poste Bassa 225/30 kV · Douala (Cameroun)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODEL 2: TECHNICAL DATA (IDTA 02003 / ECLASS IRDIs) */}
        {activeSubmodel === 'technical_data' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>⚙️</span> IDTA 02003 — Technical Data (Propriétés Sémantiques ECLASS &amp; IEC CDD)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Chaque grandeur électrotechnique est indexée par son identifiant sémantique international unique (IRDI).
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                SemanticId: 0173-1#01-AHF578#001
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/50 border-b border-white/10 text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Propriété IdShort</th>
                    <th className="p-3">Identifiant Sémantique IRDI (ECLASS / IEC CDD)</th>
                    <th className="p-3">Valeur Assignée</th>
                    <th className="p-3">Unité SI</th>
                    <th className="p-3">Statut Vérification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { idShort: 'RatedVoltage', irdi: '0173-1#02-AAB028#007', val: equipment.technical?.['Tension assignée'] || '225', unit: 'kV', status: 'Conforme IEC 62271-1' },
                    { idShort: 'RatedCurrent', irdi: '0173-1#02-AAB027#007', val: equipment.technical?.['Courant assigné'] || '2000', unit: 'A', status: 'Conforme Eneo' },
                    { idShort: 'ShortCircuitBreakingCurrent', irdi: '0173-1#02-BAE123#004', val: equipment.technical?.['Pouvoir de coupure'] || '50', unit: 'kA', status: 'Icu vérifié' },
                    { idShort: 'ShortTimeWithstandCurrent', irdi: '0173-1#02-BAE125#002', val: '50 (3s)', unit: 'kA', status: 'Icw 3 secondes' },
                    { idShort: 'RatedFrequency', irdi: '0173-1#02-AAB029#005', val: '50', unit: 'Hz', status: 'Réseau Interconnecté Sud (RIS)' },
                    { idShort: 'LightningImpulseWithstand', irdi: '0173-1#02-BAF901#003', val: '1050', unit: 'kV (BIL)', status: 'Protection foudre ZnO' },
                    { idShort: 'OperatingSequence', irdi: '0173-1#02-BAG442#001', val: 'O - 0.3s - CO - 3min - CO', unit: 'Cycle', status: 'Cycle rapide cycleur' },
                    { idShort: 'AmbientTemperatureMax', irdi: '0173-1#02-BAA012#008', val: '45', unit: '°C', status: 'Détarage thermique appliqué' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-white">{row.idShort}</td>
                      <td className="p-3 text-cyan-400 text-[11px] font-mono">{row.irdi}</td>
                      <td className="p-3 font-bold text-amber-400">{row.val}</td>
                      <td className="p-3 text-slate-300">{row.unit}</td>
                      <td className="p-3 text-emerald-400 text-[11px] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBMODEL 3: OPERATIONAL DATA & TELEMETRY (IDTA 02008 / Time Series) */}
        {activeSubmodel === 'operational_data' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>📡</span> IDTA 02008 — Operational Data &amp; Linked Time Series
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Connexion dynamique vers le serveur SCADA / Historian via points de terminaison REST et MQTT TLS.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatingTelemetry(!isSimulatingTelemetry)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    isSimulatingTelemetry
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTelemetry ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingTelemetry ? 'Flux Temps Réel ACTIF' : 'Flux Pausé'}</span>
                </button>
              </div>
            </div>

            {/* Endpoints Info Box */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1">
                <span>LinkedSegment SCADA MQTT Topic :</span>
                <span className="text-cyan-400 font-bold">mqtts://telemetry.eneo.cm:8883/substations/bassa/{equipment.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>AAS REST Endpoint (Type 2 API) :</span>
                <span className="text-indigo-400 font-bold">GET /api/v1/aas/{equipment.id}/submodels/OperationalData</span>
              </div>
            </div>

            {/* Live Visual Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-400">Courants de Phase (L1 / L2 / L3)</span>
                  <span className="text-emerald-400">Équilibré (Δ &lt; 2%)</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">I_L1 :</span>
                    <span className="text-white font-bold">{telemetry.currentL1} A</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded h-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded" style={{ width: `${(telemetry.currentL1 / 600) * 100}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">I_L2 :</span>
                    <span className="text-white font-bold">{telemetry.currentL2} A</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded h-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded" style={{ width: `${(telemetry.currentL2 / 600) * 100}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">I_L3 :</span>
                    <span className="text-white font-bold">{telemetry.currentL3} A</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded h-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded" style={{ width: `${(telemetry.currentL3 / 600) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-400">Surveillance Thermique Huile</span>
                  <span className={telemetry.temperatureOil > 75 ? 'text-red-400' : 'text-amber-400'}>
                    Seuil Alerte : 85°C
                  </span>
                </div>
                <div className="flex items-center justify-center p-3">
                  <div className="text-center">
                    <div className="text-3xl font-black font-mono text-white">{telemetry.temperatureOil} °C</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">Refroidissement ONAN Actif</div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded ${telemetry.temperatureOil > 75 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${(telemetry.temperatureOil / 100) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-400">Indice de Santé Global (SOH)</span>
                  <span className="text-emerald-400 font-bold">Très Bon</span>
                </div>
                <div className="flex items-center justify-center p-3">
                  <div className="text-center">
                    <div className="text-3xl font-black font-mono text-emerald-400">{telemetry.healthIndex} %</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">RUL Estimée : 14,200 heures</div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded" style={{ width: `${telemetry.healthIndex}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODEL 4: OPERATORFABRIC ACTION CARDS */}
        {activeSubmodel === 'operator_fabric' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>🚨</span> Flux Opérationnel OperatorFabric (Standard RTE France / LF Energy)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Cartes d'actions et alertes contextuelles pour les opérateurs de dispatching et chefs de quart.
                </p>
              </div>
              <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                1 Action Requise
              </div>
            </div>

            {/* Action Cards Stream */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-amber-950/40 via-black/40 to-black/40 border border-amber-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[10px] font-bold uppercase">
                      AVERTISSEMENT DISPATCHING
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      Échauffement Palier &amp; Charge Crête 88%
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Il y a 4 min</span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  L'appareil subit un échauffement continu (+6.2°C sur la dernière heure) sous une température ambiante extérieure de 41°C à Douala. Risque de déclenchement par protection thermique (Code ANSI 49) dans les 45 prochaines minutes.
                </p>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1.5 font-mono text-xs">
                  <div className="text-cyan-300 font-bold uppercase text-[10px]">Actions Préconisées par l'Assistant IA :</div>
                  <div className="text-slate-300 flex items-center gap-2">
                    <span className="text-cyan-400">1.</span> Enclencher le groupe de ventilation forcée ONAF (Étape 2).
                  </div>
                  <div className="text-slate-300 flex items-center gap-2">
                    <span className="text-cyan-400">2.</span> Basculer 40 kVA de charges non prioritaires vers le réseau de secours ou stockage BESS.
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => alert("Action OperatorFabric transmise au SCADA : Ventilation ONAF forcée activée.")}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-colors"
                  >
                    Exécuter Remédiation (ONAF Stage 2)
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Alerte acquittée par l'opérateur.")}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10 transition-colors"
                  >
                    Acquitter l'Alerte
                  </button>
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Test de synchronisation automatique GOOSE (IEC 61850) : Réussi (&lt; 3 ms)</span>
                </div>
                <span className="text-slate-500 text-[10px]">Aujourd'hui 08:30</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODEL 5: DOCUMENTATION (VDI 2770) */}
        {activeSubmodel === 'documentation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>📄</span> IDTA / VDI 2770 — Handover Documentation &amp; Dossier
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Classification unifiée des documents techniques du constructeur et procédures d'exploitation.
                </p>
              </div>
              <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/20">
                Classification VDI 2770
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {[
                { title: 'Schéma Unifilaire & Plan de Raccordement (CIM/DWG)', ref: 'EPEDE-SLD-DWG-002', type: 'Schéma Électrique', size: '2.4 Mo' },
                { title: 'Manuel d\'Installation, d\'Exploitation & Maintenance (IOM)', ref: 'MAN-SIEM-2024-FR', type: 'Manuel Constructeur', size: '8.1 Mo' },
                { title: 'Rapport d\'Essais en Plateforme Usine (FAT Test Sheet)', ref: 'FAT-CERT-SONATREL-01', type: 'Certificat de Conformité', size: '1.2 Mo' },
                { title: 'Fiche de Réglage des Protections Numériques (IED ANSI)', ref: 'PROT-COORD-225K', type: 'Note de Calcul', size: '940 Ko' },
                { title: 'Procédure de Consignation et Cadenassage (NF C 18-510)', ref: 'LOTO-SOP-CAM-09', type: 'Sécurité & Consignation', size: '620 Ko' },
                { title: 'Certificat d\'Homologation Ministérielle Eneo/MINEE', ref: 'HOMOLOG-DOUALA-2024', type: 'Réglementaire', size: '450 Ko' }
              ].map((doc, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-center justify-between hover:border-cyan-500/40 transition-all">
                  <div className="space-y-1">
                    <div className="font-bold text-white line-clamp-1">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="text-cyan-400">{doc.ref}</span>
                      <span>•</span>
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Téléchargement de ${doc.ref} démarré.`)}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODEL 6: AASX EXPORT & RAW JSON-LD */}
        {activeSubmodel === 'aasx_export' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>💾</span> Export AAS v3 &amp; Échange Interopérable (IEC 63278)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Paquet `.aasx` (Type 1) et schéma JSON-LD pour intégration directe dans Eclipse BaSyx, Mnestix ou Neoception.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copié !' : 'Copier JSON-LD'}</span>
                </button>
              </div>
            </div>

            {/* Syntax-Highlighted AAS JSON-LD */}
            <div className="bg-slate-950 border border-white/10 rounded-xl p-4 overflow-x-auto max-h-96 font-mono text-xs text-cyan-300">
              <pre className="leading-relaxed">
                {JSON.stringify(rawAasJson, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
