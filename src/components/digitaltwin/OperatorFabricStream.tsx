// src/components/digitaltwin/OperatorFabricStream.tsx
// OperatorFabric-Style Dispatch Notification & HMI Action Stream
// Inspired by LF Energy / RTE France OperatorFabric Open Source Platform
// Coupled with real-time Power System Solver & Load-Flow Alerts

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Sliders,
  Play,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import type { Equipment } from '../../types/epede';

export interface DispatchAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  titleFr: string;
  titleEn: string;
  assetId: string;
  assetNameFr: string;
  assetNameEn: string;
  messageFr: string;
  messageEn: string;
  remediationActionFr: string;
  remediationActionEn: string;
  suggestedActionId: string;
  acknowledged: boolean;
  executed: boolean;
  busVoltageLevel: '225 kV' | '30 kV' | '400 V';
}

interface OperatorFabricStreamProps {
  locale: 'fr' | 'en';
  onInspectAas?: (equipmentId: string) => void;
}

export const OperatorFabricStream: React.FC<OperatorFabricStreamProps> = ({
  locale,
  onInspectAas
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  // Simulated live grid state
  const [gridMetrics, setGridMetrics] = useState({
    activeGenerationMw: 184.2,
    totalLoadMw: 172.6,
    reactivePowerMvar: 42.1,
    averageFrequencyHz: 50.03,
    maxLineLoadingPct: 89.4,
    criticalContingencyStatus: 'N-1 Sécurisé'
  });

  const [alerts, setAlerts] = useState<DispatchAlert[]>([
    {
      id: 'alert-01',
      timestamp: '11:14:02',
      severity: 'CRITICAL',
      titleFr: 'Surcharge Thermique Transformateur TR-1 (225/30 kV)',
      titleEn: 'Thermal Overload on Transformer TR-1 (225/30 kV)',
      assetId: 'eq-exp-sub-trafo-225-30',
      assetNameFr: 'Transfo Puissance 225/30 kV Bassa',
      assetNameEn: '225/30 kV Power Transformer Bassa',
      messageFr: 'La charge apparente dépasse 91% de la puissance assignée (60 MVA) sous 41°C ambiant. Risque de déclenchement max thermique ANSI 49 d\'ici 25 min.',
      messageEn: 'Apparent load exceeds 91% rated capacity (60 MVA) under 41°C ambient. ANSI 49 thermal trip risk within 25 min.',
      remediationActionFr: 'Démarrer ventilation forcée ONAF-2 et injecter 5 MW depuis le BESS Logbaba.',
      remediationActionEn: 'Start forced cooling ONAF-2 and discharge 5 MW from Logbaba BESS.',
      suggestedActionId: 'action-onaf-bess',
      acknowledged: false,
      executed: false,
      busVoltageLevel: '225 kV'
    },
    {
      id: 'alert-02',
      timestamp: '11:08:45',
      severity: 'WARNING',
      titleFr: 'Baisse Facteur de Puissance Départ HTA Bekoko (cos φ = 0.82)',
      titleEn: 'Low Power Factor on 30 kV Feeder Bekoko (cos φ = 0.82)',
      assetId: 'eq-exp-gis-bay-225k',
      assetNameFr: 'Départ Feeder HTA 30 kV',
      assetNameEn: '30 kV Feeder Bay',
      messageFr: 'Pénalité Eneo réactive imminente (cos φ < 0.85). Courant réactif absorbé : 14.8 Mvar.',
      messageEn: 'Impending Eneo reactive penalty (cos φ < 0.85). Reactive absorbed current: 14.8 Mvar.',
      remediationActionFr: 'Enclencher le gradin 2 (2.5 Mvar) de la batterie de condensateurs HTA.',
      remediationActionEn: 'Engage Step 2 (2.5 Mvar) of the MV capacitor bank.',
      suggestedActionId: 'action-cap-bank',
      acknowledged: false,
      executed: false,
      busVoltageLevel: '30 kV'
    },
    {
      id: 'alert-03',
      timestamp: '10:55:12',
      severity: 'INFO',
      titleFr: 'Bascule Automatique Automate Source TGBT',
      titleEn: 'Automatic Transfer Switch (ATS) Normal Operation',
      assetId: 'eq-exp-relay-ied-61850',
      assetNameFr: 'Inverseur Normal/Secours TGBT 400 V',
      assetNameEn: 'Normal/Emergency ATS 400 V',
      messageFr: 'Test d\'automatisme hebdomadaire sans coupure réalisé avec succès (Temps de transfert : 48 ms).',
      messageEn: 'Weekly seamless ATS test completed successfully (Transfer time: 48 ms).',
      remediationActionFr: 'Aucune action requise.',
      remediationActionEn: 'No action required.',
      suggestedActionId: 'action-none',
      acknowledged: true,
      executed: true,
      busVoltageLevel: '400 V'
    }
  ]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleExecuteRemediation = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, executed: true, acknowledged: true } : a))
    );
    // Dynamically relieve grid metrics
    setGridMetrics((prev) => ({
      ...prev,
      maxLineLoadingPct: +(prev.maxLineLoadingPct - 7.5).toFixed(1),
      reactivePowerMvar: +(prev.reactivePowerMvar - 4.2).toFixed(1)
    }));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'CRITICAL') return a.severity === 'CRITICAL';
    if (filterSeverity === 'WARNING') return a.severity === 'WARNING' || a.severity === 'CRITICAL';
    return true;
  });

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="bg-[#090D14] border border-[#222B38] rounded-2xl overflow-hidden shadow-2xl font-sans text-slate-200">
      
      {/* 1. Header Bar */}
      <div className="bg-[#0e1626] border-b border-[#223048] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                OperatorFabric · Console de Dispatching &amp; Conduite
              </h3>
              {unacknowledgedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold animate-pulse">
                  {unacknowledgedCount} {locale === 'fr' ? 'non acquitté(s)' : 'unacknowledged'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Flux d'événements et d'actions temps réel conforme à la plateforme open source LF Energy / RTE France.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Grid Telemetry KPIs Bar (Solver Output) */}
      {!isCollapsed && (
        <div className="bg-black/40 border-b border-white/10 p-3 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Production Active P</span>
            <span className="text-white font-bold">{gridMetrics.activeGenerationMw} MW</span>
          </div>
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Consommation P</span>
            <span className="text-cyan-400 font-bold">{gridMetrics.totalLoadMw} MW</span>
          </div>
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Réactif Q</span>
            <span className="text-amber-400 font-bold">{gridMetrics.reactivePowerMvar} Mvar</span>
          </div>
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Fréquence Réseau</span>
            <span className="text-emerald-400 font-bold">{gridMetrics.averageFrequencyHz} Hz</span>
          </div>
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Charge Max Ouvrage</span>
            <span className={`font-bold ${gridMetrics.maxLineLoadingPct > 85 ? 'text-red-400' : 'text-emerald-400'}`}>
              {gridMetrics.maxLineLoadingPct}%
            </span>
          </div>
          <div className="bg-white/[0.02] p-2 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">Critère de Sécurité</span>
            <span className="text-indigo-300 font-bold">{gridMetrics.criticalContingencyStatus}</span>
          </div>
        </div>
      )}

      {/* 3. Alerts Filter Ribbon */}
      {!isCollapsed && (
        <div className="p-3 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 mr-2 text-[11px] uppercase">Filtrer :</span>
            {(['ALL', 'CRITICAL', 'WARNING'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                  filterSeverity === sev
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {sev === 'ALL' ? 'Tous les flux' : sev === 'CRITICAL' ? 'Critiques uniquement' : 'Avertissements +'}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-[10px]">
            Synchro Bus SCADA IEC 60870-5-104 / IEC 61850
          </span>
        </div>
      )}

      {/* 4. Action Cards Stream */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 transition-all ${
                  isCritical
                    ? 'bg-gradient-to-r from-red-950/30 via-black/40 to-black/40 border-red-500/40'
                    : isWarning
                    ? 'bg-gradient-to-r from-amber-950/20 via-black/40 to-black/40 border-amber-500/30'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                        isCritical
                          ? 'bg-red-500 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {locale === 'fr' ? alert.titleFr : alert.titleEn}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 font-mono text-[10px]">
                      {alert.busVoltageLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{alert.timestamp}</span>
                    {onInspectAas && (
                      <button
                        type="button"
                        onClick={() => onInspectAas(alert.assetId)}
                        className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Inspecter AAS v3
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {locale === 'fr' ? alert.messageFr : alert.messageEn}
                </p>

                {/* Remediation Block */}
                {alert.remediationActionFr && (
                  <div className="mt-3 bg-black/50 p-3 rounded-lg border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 font-mono text-xs">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                        Action Recommandée (Solveur Couplé) :
                      </span>
                      <span className="text-slate-200">
                        {locale === 'fr' ? alert.remediationActionFr : alert.remediationActionEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!alert.executed ? (
                        <button
                          type="button"
                          onClick={() => handleExecuteRemediation(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{locale === 'fr' ? 'Appliquer Remédiation' : 'Execute Action'}</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{locale === 'fr' ? 'Exécuté' : 'Executed'}</span>
                        </span>
                      )}

                      {!alert.acknowledged && (
                        <button
                          type="button"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-xs border border-white/10 transition-colors"
                        >
                          {locale === 'fr' ? 'Acquitter' : 'Acknowledge'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
