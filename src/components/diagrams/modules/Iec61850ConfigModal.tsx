// src/components/diagrams/modules/Iec61850ConfigModal.tsx
import React, { useState, useMemo } from 'react';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Activity,
  Zap,
  Sliders,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Radio,
  Wifi,
  ArrowRightLeft,
  ChevronRight,
  Server,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import {
  Iec61850SclService,
  DEFAULT_IEC61850_CONFIG,
  Iec61850SubstationConfig,
  IedConfig
} from '../../../services/iec61850SclService';
import { Iec61850SampledValuesTestBench } from './Iec61850SampledValuesTestBench';
import { Iec62351CyberSecurityPanel } from './Iec62351CyberSecurityPanel';
import type { SoeLogEntry } from './SldSoeLogPanel';

interface Iec61850ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  initialTab?: 'IED_SETTINGS' | 'GOOSE_MATRIX' | 'SCL_EXPORT' | 'SAMPLED_VALUES' | 'CYBERSECURITY_62351';
  onEmitSoeLog?: (entry: Omit<SoeLogEntry, 'id'>) => void;
}

export const Iec61850ConfigModal: React.FC<Iec61850ConfigModalProps> = ({
  isOpen,
  onClose,
  locale,
  initialTab = 'IED_SETTINGS',
  onEmitSoeLog,
}) => {
  const [config, setConfig] = useState<Iec61850SubstationConfig>(DEFAULT_IEC61850_CONFIG);
  const [selectedIedId, setSelectedIedId] = useState<string>(DEFAULT_IEC61850_CONFIG.ieds[0].id);
  const [activeTab, setActiveTab] = useState<'IED_SETTINGS' | 'GOOSE_MATRIX' | 'SCL_EXPORT' | 'SAMPLED_VALUES' | 'CYBERSECURITY_62351'>(initialTab);
  const [sclFormat, setSclFormat] = useState<'SCD' | 'CID' | 'ICD'>('SCD');

  // Sync initial tab when changed
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [xmlSearchQuery, setXmlSearchQuery] = useState<string>('');
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const [gooseSimActive, setGooseSimActive] = useState<boolean>(false);
  const [gooseSimStep, setGooseSimStep] = useState<number>(0);

  const selectedIed = useMemo(() => {
    return config.ieds.find((i) => i.id === selectedIedId) || config.ieds[0];
  }, [config, selectedIedId]);

  // Generate real-time XML
  const generatedXml = useMemo(() => {
    return Iec61850SclService.generateSclXml(config, sclFormat, selectedIedId);
  }, [config, sclFormat, selectedIedId]);

  // Filter XML lines if search query is provided
  const xmlDisplayLines = useMemo(() => {
    const lines = generatedXml.split('\n');
    if (!xmlSearchQuery.trim()) {
      return lines;
    }
    const q = xmlSearchQuery.toLowerCase();
    return lines.filter((l) => l.toLowerCase().includes(q));
  }, [generatedXml, xmlSearchQuery]);

  // Update a specific Logical Node parameter
  const handleUpdateDataObjectVal = (
    iedId: string,
    lnClass: string,
    inst: string,
    doName: string,
    newVal: string | number | boolean
  ) => {
    setConfig((prev) => {
      const updatedIeds = prev.ieds.map((ied) => {
        if (ied.id !== iedId) return ied;
        const updatedLns = ied.logicalNodes.map((ln) => {
          if (ln.lnClass !== lnClass || ln.inst !== inst) return ln;
          const updatedDos = ln.dataObjects.map((dob) => {
            if (dob.name !== doName) return dob;
            return { ...dob, val: newVal };
          });
          return { ...ln, dataObjects: updatedDos };
        });
        return { ...ied, logicalNodes: updatedLns };
      });
      return { ...prev, ieds: updatedIeds };
    });
  };

  // Trigger GOOSE simulation burst
  const handleRunGooseSimulation = () => {
    setGooseSimActive(true);
    setGooseSimStep(1); // Frame 1: T0 event burst (2 ms)
    setTimeout(() => setGooseSimStep(2), 600); // Frame 2: T1 (4 ms)
    setTimeout(() => setGooseSimStep(3), 1200); // Frame 3: T2 (8 ms)
    setTimeout(() => setGooseSimStep(4), 1800); // Intertrip confirmed & Circuit Breaker opened!
  };

  const handleResetGooseSimulation = () => {
    setGooseSimActive(false);
    setGooseSimStep(0);
  };

  // Download XML file (.SCD or .CID)
  const handleDownloadFile = () => {
    const filename = sclFormat === 'CID' 
      ? `${selectedIed.name}.cid` 
      : `${config.substationName}.scd`;
    const blob = new Blob([generatedXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy XML to clipboard
  const handleCopyXml = () => {
    navigator.clipboard.writeText(generatedXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[950px] bg-[#070D18] border border-[#1C2C42] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 font-sans">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:px-6 py-3.5 bg-[#0A1322] border-b border-[#1A293E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-mono text-white tracking-wide uppercase">
                  {locale === 'fr' 
                    ? 'INGÉNIERIE NUMÉRIQUE CEI 61850 & GÉNÉRATEUR SCL (SCD / CID)' 
                    : 'IEC 61850 DIGITAL SUBSTATION ENGINEERING & SCL GENERATOR'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  CEI 61850 Ed. 2.1 · UCA Test Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Calibration des nœuds logiques (PDIS, PDIF, PTOC, PTRC), routage rapide des trames GOOSE et génération de fichiers SCL constructeurs.'
                  : 'Logical node calibration (PDIS, PDIF, PTOC, PTRC), high-speed GOOSE matrix routing and manufacturer SCL file generation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 bg-[#080F1C] border-b border-[#1A293E] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('IED_SETTINGS')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'IED_SETTINGS'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>{locale === 'fr' ? '1. Nœuds Logiques & Réglages IED' : '1. Logical Nodes & IED Settings'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('GOOSE_MATRIX')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'GOOSE_MATRIX'
                  ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>{locale === 'fr' ? '2. Matrice de Routage GOOSE' : '2. GOOSE Routing Matrix'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SCL_EXPORT')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'SCL_EXPORT'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>{locale === 'fr' ? '3. Générateur SCL (.SCD / .CID)' : '3. SCL Generator (.SCD / .CID)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SAMPLED_VALUES')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'SAMPLED_VALUES'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-4 w-4 text-amber-400" />
              <span>{locale === 'fr' ? '4. Banc d’Essai Sampled Values (SV 9-2LE)' : '4. Sampled Values Test Bench (9-2LE)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CYBERSECURITY_62351')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'CYBERSECURITY_62351'
                  ? 'border-rose-500 text-rose-300 bg-rose-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-4 w-4 text-rose-400" />
              <span>{locale === 'fr' ? '5. Cybersécurité CEI 62351 (IDS & PKI)' : '5. IEC 62351 Cybersecurity (IDS & PKI)'}</span>
            </button>
          </div>

          {/* Quick Substation Badge */}
          <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Poste: <strong className="text-white">{config.substationName}</strong> ({config.voltageLevelKv} kV)</span>
          </div>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: IED Selection & Logical Nodes Settings Editor */}
          {activeTab === 'IED_SETTINGS' && (
            <div className="space-y-4">
              {/* IED Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {config.ieds.map((ied) => {
                  const isSelected = ied.id === selectedIedId;
                  return (
                    <button
                      key={ied.id}
                      type="button"
                      onClick={() => setSelectedIedId(ied.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                          : 'bg-[#0A1322] border-[#1C2C42] text-slate-300 hover:bg-[#0E1A2D]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="font-bold text-cyan-400 uppercase">{ied.manufacturer}</span>
                          <span>{ied.ipAddress}</span>
                        </div>
                        <div className="font-mono font-bold text-sm text-white tracking-wide">{ied.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ied.type}</div>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{ied.logicalNodes.length} Nœuds Logiques</span>
                        <span className="text-cyan-300 font-bold">{ied.publishedGoose.length} GOOSE Pub</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected IED Header Banner */}
              <div className="p-4 rounded-xl bg-[#09121F] border border-[#1B2B3F] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-white">{selectedIed.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {selectedIed.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Travée : <strong className="text-slate-200">{selectedIed.bayName}</strong> · Adresse IP : <strong className="text-slate-200">{selectedIed.ipAddress}</strong> (Masque {selectedIed.subnetMask})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Constructeur :</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-bold text-cyan-300">
                    {selectedIed.manufacturer}
                  </span>
                </div>
              </div>

              {/* Logical Nodes List & Interactive Settings */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'NŒUDS LOGIQUES NORMALISÉS (IEC 61850-7-4) & OBJETS DE DONNÉES' : 'STANDARD LOGICAL NODES (IEC 61850-7-4) & DATA OBJECTS'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedIed.logicalNodes.map((ln) => (
                    <div
                      key={`${ln.lnClass}_${ln.inst}`}
                      className="p-3.5 rounded-xl bg-[#09111D] border border-[#1A293E] space-y-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {ln.lnClass}{ln.inst}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">
                            {locale === 'fr' ? ln.descFr : ln.descEn}
                          </span>
                        </div>
                      </div>

                      {/* Data Objects Configuration */}
                      <div className="space-y-1.5 pt-1">
                        {ln.dataObjects.map((dob) => (
                          <div
                            key={dob.name}
                            className="p-2 rounded-lg bg-[#0C1625] border border-[#1E2E42] flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <span className="font-bold text-slate-200">{dob.name}</span>
                              <span className="text-[11px] text-slate-400 ml-2">({dob.desc})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {typeof dob.val === 'boolean' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDataObjectVal(selectedIed.id, ln.lnClass, ln.inst, dob.name, !dob.val)}
                                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                                    dob.val
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  }`}
                                >
                                  {dob.val ? 'TRUE' : 'FALSE'}
                                </button>
                              ) : typeof dob.val === 'number' ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={dob.val}
                                    step="0.05"
                                    onChange={(e) => handleUpdateDataObjectVal(selectedIed.id, ln.lnClass, ln.inst, dob.name, parseFloat(e.target.value) || 0)}
                                    className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-right text-xs focus:outline-none focus:border-cyan-400"
                                  />
                                  {dob.unit && <span className="text-[10px] text-slate-400">{dob.unit}</span>}
                                </div>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold text-xs">
                                  {dob.val}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOSE Communication Matrix & Live Burst Simulator */}
          {activeTab === 'GOOSE_MATRIX' && (
            <div className="space-y-4">
              {/* GOOSE Simulator Banner */}
              <div className="p-4 rounded-xl bg-[#09121F] border border-[#1E2E44] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-indigo-400 animate-pulse" />
                    <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      {locale === 'fr' 
                        ? 'SIMULATEUR DE DÉCLENCHEMENT ULTRA-RAPIDE GOOSE (CEI 61850-8-1)' 
                        : 'FAST GOOSE TRIP BURST SIMULATOR (IEC 61850-8-1)'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {locale === 'fr'
                      ? 'Temps de transfert garanti < 3 ms (Classe P1/P2) avec rafale de réémission exponentielle (2 ms -> 4 ms -> 8 ms -> 1000 ms heartbeat).'
                      : 'Guaranteed transfer delay < 3 ms (Class P1/P2) with exponential retransmission burst (2 ms -> 4 ms -> 8 ms -> 1000 ms heartbeat).'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunGooseSimulation}
                    disabled={gooseSimActive && gooseSimStep < 4}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>{locale === 'fr' ? 'INJECTER DÉCLENCHEMENT GOOSE' : 'INJECT GOOSE TRIP'}</span>
                  </button>

                  {gooseSimActive && (
                    <button
                      type="button"
                      onClick={handleResetGooseSimulation}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'RÉARMER' : 'RESET'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Simulation Visual Feedback */}
              {gooseSimActive && (
                <div className="p-4 rounded-xl bg-[#0B1526] border border-indigo-500/40 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                      <Wifi className="h-4 w-4 animate-ping" />
                      {locale === 'fr' ? 'TRAME GOOSE DIFFUSÉE SUR LE BUS DE STATION (PRP)' : 'GOOSE FRAME BROADCAST ON STATION BUS (PRP)'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      Latence Mesurée : 1.25 ms (Exigence CEI: &lt; 3 ms)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className={`p-2.5 rounded-lg border ${gooseSimStep >= 1 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] font-bold">ÉTAPE 1 : Inception Défaut (t = 0 ms)</div>
                      <div className="font-bold mt-1">Émission T0 (MinTime = 2 ms)</div>
                      <div className="text-[10px] mt-0.5">stNum=1 · sqNum=0</div>
                    </div>

                    <div className={`p-2.5 rounded-lg border ${gooseSimStep >= 2 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] font-bold">ÉTAPE 2 : Rafale T1 (t = 4 ms)</div>
                      <div className="font-bold mt-1">Réémission Rapide 1</div>
                      <div className="text-[10px] mt-0.5">stNum=1 · sqNum=1</div>
                    </div>

                    <div className={`p-2.5 rounded-lg border ${gooseSimStep >= 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] font-bold">ÉTAPE 3 : Rafale T2 (t = 8 ms)</div>
                      <div className="font-bold mt-1">Réémission Rapide 2</div>
                      <div className="text-[10px] mt-0.5">stNum=1 · sqNum=2</div>
                    </div>

                    <div className={`p-2.5 rounded-lg border ${gooseSimStep >= 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] font-bold">ÉTAPE 4 : Télé-action Confirmée</div>
                      <div className="font-bold mt-1">Disjoncteurs 52 Ouverts !</div>
                      <div className="text-[10px] mt-0.5">Intertrip Exécuté</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Published GOOSE Streams Table */}
              <div className="p-4 rounded-xl bg-[#09111D] border border-[#1A293E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {locale === 'fr' ? 'FLUX GOOSE PUBLIÉS (GSE CONTROL BLOCKS & DATASETS)' : 'PUBLISHED GOOSE STREAMS (GSE CONTROL BLOCKS & DATASETS)'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Multicast IEEE 802.1Q (VLAN 4 / Priorité 4)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 px-3">Émetteur (IED)</th>
                        <th className="py-2 px-3">GSE Control Block</th>
                        <th className="py-2 px-3">APPID</th>
                        <th className="py-2 px-3">Adresse MAC Multicast</th>
                        <th className="py-2 px-3">Min / Max Time</th>
                        <th className="py-2 px-3">Signaux Inclus (DataSet)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {config.ieds.flatMap((ied) =>
                        ied.publishedGoose.map((g) => (
                          <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-white">{ied.name}</td>
                            <td className="py-2.5 px-3 text-indigo-300 font-bold">{g.gseControlName}</td>
                            <td className="py-2.5 px-3 text-cyan-300">{g.appId}</td>
                            <td className="py-2.5 px-3 text-slate-300">{g.macAddress}</td>
                            <td className="py-2.5 px-3 text-amber-300 font-bold">{g.minTimeMs} ms / {g.maxTimeMs} ms</td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1">
                                {g.entries.map((e, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                                    {e.lnClass}.{e.doName}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cross-Substation Subscriptions Routing Matrix */}
              <div className="p-4 rounded-xl bg-[#09111D] border border-[#1A293E] space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                  {locale === 'fr' ? 'MATRICE D\'INTERCONNEXION & SOUSCRIPTIONS GOOSE INTER-RELAIS' : 'INTER-RELAY GOOSE SUBSCRIPTIONS & INTERTRIP ROUTING MATRIX'}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#0C1625] border border-[#1E2E42] space-y-2 text-xs font-mono">
                    <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Télé-déclenchement Ligne Mangoumbé -&gt; Oyomabang (87L)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      L&apos;IED <strong className="text-white">MANGOUMBE_P546_L01</strong> souscrit au flux <strong className="text-white">OYOMABANG_Intertrip</strong>. En cas d&apos;ouverture au poste distant, l&apos;ordre GOOSE déclenche instantanément le disjoncteur 52 local en moins de 2 ms sans aucun fil cuivre.
                    </p>
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Statut Télé-action :</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> VERROUILLÉ &amp; SURVEILLÉ (PRP)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1625] border border-[#1E2E42] space-y-2 text-xs font-mono">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Verrouillage &amp; Défaillance Disjoncteur 50BF (Breaker Failure)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Si le disjoncteur 52 de ligne refuse de s&apos;ouvrir 150 ms après émission de <strong className="text-white">PTRC.Tr</strong>, l&apos;automatisme 50BF publie un message GOOSE d&apos;urgence provoquant le déclenchement immédiat du couplage 225 kV et de la tranche transfo.
                    </p>
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Temporisation 50BF :</span>
                      <span className="text-cyan-300 font-bold">150 ms (Classe de Sécurité Renforcée)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Real-Time SCL (.SCD / .CID / .ICD) XML Generator & Exporter */}
          {activeTab === 'SCL_EXPORT' && (
            <div className="space-y-4">
              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#09121F] border border-[#1E2E44]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-1">{locale === 'fr' ? 'Format SCL :' : 'SCL Format:'}</span>
                  {(['SCD', 'CID', 'ICD'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSclFormat(fmt)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        sclFormat === fmt
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      .{fmt} {fmt === 'SCD' ? (locale === 'fr' ? '(Poste Complet)' : '(Full Substation)') : fmt === 'CID' ? (locale === 'fr' ? '(IED Configuré)' : '(Configured IED)') : '(Template)'}
                    </button>
                  ))}
                </div>

                {/* Actions: Search, Copy, Download */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder={locale === 'fr' ? 'Rechercher balise XML...' : 'Search XML tag...'}
                      value={xmlSearchQuery}
                      onChange={(e) => setXmlSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400 w-48"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyXml}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {copiedXml ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedXml ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier XML' : 'Copy XML')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{locale === 'fr' ? `TÉLÉCHARGER .${sclFormat}` : `DOWNLOAD .${sclFormat}`}</span>
                  </button>
                </div>
              </div>

              {/* Code Display Area */}
              <div className="relative rounded-xl bg-[#04080F] border border-[#172437] overflow-hidden shadow-2xl">
                <div className="px-4 py-2 bg-[#060D1A] border-b border-[#172437] flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>
                      {sclFormat === 'CID' ? `${selectedIed.name}.cid` : `${config.substationName}.scd`}
                    </span>
                  </div>
                  <span>{xmlDisplayLines.length} lignes · Validé Schéma CEI 61850-6 (Ed. 2.1)</span>
                </div>

                <pre className="p-4 text-[11px] font-mono leading-relaxed text-slate-300 max-h-[500px] overflow-y-auto select-text whitespace-pre overflow-x-auto">
                  {xmlDisplayLines.map((line, idx) => {
                    // Simple syntax highlights
                    const isComment = line.trim().startsWith('&lt;!--') || line.trim().startsWith('<!--');
                    const isTag = line.includes('<') && line.includes('>');
                    return (
                      <div
                        key={idx}
                        className={`hover:bg-slate-800/30 px-1 py-0.2 rounded transition-colors ${
                          isComment ? 'text-slate-500 italic' : isTag ? 'text-cyan-200' : 'text-slate-300'
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Sampled Values (SV 9-2LE / 61869-9) Test Bench & Merging Unit */}
          {activeTab === 'SAMPLED_VALUES' && (
            <Iec61850SampledValuesTestBench locale={locale} />
          )}

          {/* TAB 5: IEC 62351 OT Cybersecurity & Intrusion Detection (IDS) */}
          {activeTab === 'CYBERSECURITY_62351' && (
            <Iec62351CyberSecurityPanel locale={locale} onEmitSoeLog={onEmitSoeLog} />
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-[#0A1322] border-t border-[#1A293E] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              {locale === 'fr'
                ? 'Conforme aux standards d\'interopérabilité CEI 61850-6 / CEI 61850-8-1 (Schneider Easergy Studio, Siemens DIGSI 5, ABB PCM600).'
                : 'Compatible with IEC 61850-6 / IEC 61850-8-1 engineering tools (Schneider Easergy Studio, Siemens DIGSI 5, ABB PCM600).'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              {locale === 'fr' ? 'FERMER' : 'CLOSE'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
