// src/components/substations/modules/GooseLatencyStormSimulator.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Server,
  Network,
  Radio,
  Sliders,
  Flame,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface GooseLatencyStormSimulatorProps {
  locale: 'fr' | 'en';
}

interface SimulatedPacket {
  id: string;
  timestamp: string;
  source: string;
  dest: string;
  latencyMs: number;
  sqNum: number;
  stNum: number;
  status: 'DELIVERED_FAST' | 'DELIVERED_NORMAL' | 'DELAYED' | 'DROPPED';
  redundancyPath: 'PRP_LAN_A' | 'PRP_LAN_B' | 'DUPLICATE_DISCARDED';
}

export const GooseLatencyStormSimulator: React.FC<GooseLatencyStormSimulatorProps> = ({ locale }) => {
  // Parameters
  const [networkLoadPercent, setNetworkLoadPercent] = useState<number>(35); // 5% to 95%
  const [enablePrpRedundancy, setEnablePrpRedundancy] = useState<boolean>(true); // PRP Dual LAN A + B
  const [lanAFailure, setLanAFailure] = useState<boolean>(false);
  const [lanBFailure, setLanBFailure] = useState<boolean>(false);
  const [isStormActive, setIsStormActive] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(0);
  const [packetsLog, setPacketsLog] = useState<SimulatedPacket[]>([]);

  // Calculate live statistical metrics based on network load and redundancy
  const effectiveLoad = networkLoadPercent + (isStormActive ? 55 : 0);
  const baseLatency = 0.8; // ms in idle fiber
  const queuingDelay = Math.max(0, Math.pow(effectiveLoad / 100, 2.8) * 4.5);
  const simulatedLatencyMs = Math.min(15.0, baseLatency + queuingDelay + (lanAFailure && !enablePrpRedundancy ? 9.2 : 0));
  const packetLossPercent = lanAFailure && lanBFailure
    ? 100
    : (!enablePrpRedundancy && lanAFailure)
    ? 100
    : effectiveLoad > 85
    ? Math.min(25, (effectiveLoad - 85) * 1.5)
    : 0;

  // Simulate packet burst on trip event
  const triggerTripBurst = () => {
    setIsStormActive(true);
    setBurstCount((prev) => prev + 1);

    const now = new Date();
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    const timeStr = `${now.toLocaleTimeString()}.${ms}`;

    // Standard retransmission curve: T0=2ms, T1=4ms, T2=8ms, T3=16ms...
    const bursts: SimulatedPacket[] = [
      {
        id: `PKT-${Date.now()}-0`,
        timestamp: timeStr,
        source: 'IED_L1_PROT (Line 87L)',
        dest: 'MU_L1_PROCESS (XCBR.Op)',
        latencyMs: Math.round(simulatedLatencyMs * 10) / 10,
        sqNum: 0,
        stNum: burstCount + 1,
        status: simulatedLatencyMs < 3.0 ? 'DELIVERED_FAST' : simulatedLatencyMs < 10.0 ? 'DELIVERED_NORMAL' : 'DELAYED',
        redundancyPath: lanAFailure ? 'PRP_LAN_B' : 'PRP_LAN_A'
      },
      {
        id: `PKT-${Date.now()}-1`,
        timestamp: timeStr,
        source: 'IED_L1_PROT (Duplicate)',
        dest: 'MU_L1_PROCESS (XCBR.Op)',
        latencyMs: Math.round((simulatedLatencyMs + 0.1) * 10) / 10,
        sqNum: 1,
        stNum: burstCount + 1,
        status: enablePrpRedundancy && !lanBFailure ? 'DELIVERED_FAST' : 'DROPPED',
        redundancyPath: 'DUPLICATE_DISCARDED'
      },
      {
        id: `PKT-${Date.now()}-2`,
        timestamp: timeStr,
        source: 'IED_L1_PROT (Retransmit T1)',
        dest: 'BCU_BUS_COUPLER (Interlock)',
        latencyMs: Math.round((simulatedLatencyMs + 2.0) * 10) / 10,
        sqNum: 2,
        stNum: burstCount + 1,
        status: 'DELIVERED_NORMAL',
        redundancyPath: lanAFailure ? 'PRP_LAN_B' : 'PRP_LAN_A'
      }
    ];

    setPacketsLog((prev) => [...bursts, ...prev.slice(0, 15)]);

    setTimeout(() => {
      setIsStormActive(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>SIMULATEUR DE TEMPÊTE RÉSEAU & REDONDANCE PRP/HSR (IEC 62439-3)</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-1">
            {locale === 'fr'
              ? 'Latence de Déclenchement GOOSE & Tolérance de Panne Réseau (Bumpless Redundancy)'
              : 'GOOSE Tripping Latency & Fault-Tolerant Network Storm Simulator'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {locale === 'fr'
              ? 'Évaluation de la conformité à la classe de performance CEI 61850-5 Type 1A (Temps de transfert de déclenchement d\'urgence < 3 ms) sous congestion réseau et coupure de fibre optique.'
              : 'Evaluation of IEC 61850-5 Type 1A performance class (Emergency Trip transfer time < 3 ms) under network storm saturation and optical fiber cuts.'}
          </p>
        </div>

        {/* Trigger Emergency Trip Button */}
        <button
          type="button"
          onClick={triggerTripBurst}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-950/40 cursor-pointer animate-pulse"
        >
          <Zap className="w-4 h-4" />
          <span>{locale === 'fr' ? 'Émettre Déclenchement GOOSE (Trip)' : 'Inject GOOSE Trip Burst'}</span>
        </button>
      </div>

      {/* 2. Controls Grid & Redundancy Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 cols: Network Controls */}
        <div className="lg:col-span-5 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-4">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1E2634] pb-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'fr' ? 'Paramètres de Saturation Réseau' : 'Network Saturation Parameters'}</span>
          </h4>

          {/* Network Load Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Charge Réseau Station Bus</span>
              <span
                className={`font-bold ${
                  effectiveLoad > 75 ? 'text-red-400' : effectiveLoad > 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {effectiveLoad}% {isStormActive ? '(Tempête de broadcast active!)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={networkLoadPercent}
              onChange={(e) => setNetworkLoadPercent(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Nominal (10-30%)</span>
              <span>Modéré (40-60%)</span>
              <span>Congestion critique (&gt;80%)</span>
            </div>
          </div>

          {/* PRP Redundancy Toggle */}
          <div className="pt-2 border-t border-[#1E2634] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white font-bold">
                Protocole PRP (IEC 62439-3 Clause 4)
              </span>
              <button
                type="button"
                onClick={() => setEnablePrpRedundancy(!enablePrpRedundancy)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  enablePrpRedundancy
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {enablePrpRedundancy ? 'PRP ACTIF (Dual LAN)' : 'SIMPLE LAN'}
              </button>
            </div>

            {/* Fiber cut fault injection buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanAFailure(!lanAFailure)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  lanAFailure
                    ? 'bg-red-950/40 border-red-500 text-red-300'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] text-slate-400 block">Réseau A (LAN A)</span>
                <span className="font-bold flex items-center gap-1 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${lanAFailure ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {lanAFailure ? 'Fibre Coupée !' : 'Opérationnel'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLanBFailure(!lanBFailure)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  lanBFailure
                    ? 'bg-red-950/40 border-red-500 text-red-300'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] text-slate-400 block">Réseau B (LAN B)</span>
                <span className="font-bold flex items-center gap-1 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${lanBFailure ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {lanBFailure ? 'Fibre Coupée !' : 'Opérationnel'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Latency Metrics & IEC Class Type 1A Compliance */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top 3 KPI metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Measured Latency */}
            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Latence de Transfert GOOSE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    simulatedLatencyMs <= 3.0
                      ? 'text-emerald-400'
                      : simulatedLatencyMs <= 10.0
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {simulatedLatencyMs.toFixed(1)} ms
                </span>
                <span className="text-xs text-slate-400 font-mono">/ Max 3.0 ms</span>
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold">
                {simulatedLatencyMs <= 3.0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Classe Type 1A (Conforme)
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Dépassement Gabarit Temps !
                  </span>
                )}
              </div>
            </div>

            {/* Redundancy Status */}
            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Commutation de Redondance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    packetLossPercent === 0 ? 'text-cyan-400' : 'text-red-400'
                  }`}
                >
                  0 ms
                </span>
                <span className="text-xs text-slate-400 font-mono">Bumpless (PRP)</span>
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold">
                {lanAFailure && lanBFailure ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Rupture Double Fibre !
                  </span>
                ) : lanAFailure || lanBFailure ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secours Transparent Actif
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deux Réseaux A & B OK
                  </span>
                )}
              </div>
            </div>

            {/* Packet Loss */}
            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Pertes de Paquets GOOSE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    packetLossPercent === 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {packetLossPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">Multicast</span>
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold">
                {packetLossPercent === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Trames Délivrées
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Pertes Détectées !
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live Packet Log Table */}
          <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Journal des Événements GOOSE Récents' : 'Recent GOOSE Event Log'}</span>
              <span className="text-slate-500 font-normal">Rafale stNum #{burstCount}</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-[#1E2634]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0D121B] text-slate-400 text-[10px] uppercase border-b border-[#1E2634]">
                  <tr>
                    <th className="p-2.5">Horodatage</th>
                    <th className="p-2.5">Source &rarr; Dest</th>
                    <th className="p-2.5">Chemin Réseau</th>
                    <th className="p-2.5">Latence</th>
                    <th className="p-2.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2634]">
                  {packetsLog.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">
                        {locale === 'fr'
                          ? 'Cliquez sur "Émettre Déclenchement GOOSE" pour tester la chaîne temps réel.'
                          : 'Click "Inject GOOSE Trip Burst" to benchmark real-time delivery.'}
                      </td>
                    </tr>
                  ) : (
                    packetsLog.map((pkt) => (
                      <tr key={pkt.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 text-cyan-400">{pkt.timestamp}</td>
                        <td className="p-2.5 text-slate-300">
                          {pkt.source} &rarr; {pkt.dest}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              pkt.redundancyPath === 'PRP_LAN_A'
                                ? 'bg-cyan-950 text-cyan-300'
                                : pkt.redundancyPath === 'PRP_LAN_B'
                                ? 'bg-indigo-950 text-indigo-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {pkt.redundancyPath}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-white">{pkt.latencyMs} ms</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pkt.status === 'DELIVERED_FAST'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : pkt.status === 'DELIVERED_NORMAL'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {pkt.status === 'DELIVERED_FAST'
                              ? 'Type 1A (<3ms)'
                              : pkt.status === 'DELIVERED_NORMAL'
                              ? 'Normal (<10ms)'
                              : pkt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
