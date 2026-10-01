// src/components/transmission/RelationshipAndStateModel.tsx
// EPEDE D03 - Topological Relationship Graph & 5-State Asset Lifecycle FSM

import React, { useState } from 'react';
import {
  Network,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  Radio
} from 'lucide-react';
import { TOPOLOGICAL_CORRIDOR_NODES } from './data/transmissionData';
import type { TopologicalNode, OperationalState } from './types';

interface RelationshipAndStateModelProps {
  locale: 'fr' | 'en';
}

export const RelationshipAndStateModel: React.FC<RelationshipAndStateModelProps> = ({
  locale
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-ohl-nac-nom-sec1');
  const [assetState, setAssetState] = useState<OperationalState>('NOMINAL_IN_SERVICE');
  const [fsmMessage, setFsmMessage] = useState<string | null>(null);

  const selectedNode =
    TOPOLOGICAL_CORRIDOR_NODES.find((n) => n.id === selectedNodeId) ||
    TOPOLOGICAL_CORRIDOR_NODES[0];

  // State definitions
  const statesConfig: Record<
    OperationalState,
    { label_fr: string; label_en: string; color: string; badge: string; desc_fr: string; desc_en: string }
  > = {
    NOMINAL_IN_SERVICE: {
      label_fr: '1. En Service Nominal',
      label_en: '1. Nominal In-Service',
      color: 'emerald',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc_fr: 'Transit de puissance stable sous les limites thermiques normales (P < 85% P_max).',
      desc_en: 'Stable power transit well below continuous thermal limits (P < 85% P_max).'
    },
    THERMAL_ALERT: {
      label_fr: '2. Alerte Thermique DLR',
      label_en: '2. Thermal DLR Alert',
      color: 'amber',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc_fr: 'Échauffement du conducteur > 65°C ou transit > 90%. Alerte de flèche critique.',
      desc_en: 'Conductor temperature > 65°C or current > 90%. Critical sag proximity alert.'
    },
    N_MINUS_1_OVERLOAD: {
      label_fr: '3. Surcharge Contingence N-1',
      label_en: '3. N-1 Contingency Override',
      color: 'orange',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      desc_fr: 'Report de charge suite au déclenchement d\'une ligne parallèle. Régime de secours 15-20 min.',
      desc_en: 'Emergency power rerouting following parallel line trip. 15-20 min emergency rating.'
    },
    TRIPPED_FAULT_LOCKOUT: {
      label_fr: '4. Déclenchement & Verrouillage Défaut',
      label_en: '4. Tripped on Fault / Lockout (86)',
      color: 'red',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30',
      desc_fr: 'Déclenchement par protection 21/87L, échec du réenclencheur 79 et verrouillage relais 86.',
      desc_en: 'Line trip via 21/87L, autoreclose 79 lockout, master trip relay 86 energized.'
    },
    EARTHED_MAINTENANCE: {
      label_fr: '5. Consigné & Mis à la Terre',
      label_en: '5. Earthed for Maintenance',
      color: 'blue',
      badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      desc_fr: 'Ouvrage séparé, vérifié hors tension (VAT) et relié à la terre aux deux extrémités.',
      desc_en: 'De-energized, isolated, proven dead, and grounded at both line ends.'
    }
  };

  // State Transition handler
  const transitionTo = (nextState: OperationalState) => {
    // Interlock logic check
    if (assetState === 'NOMINAL_IN_SERVICE' && nextState === 'EARTHED_MAINTENANCE') {
      setFsmMessage(
        locale === 'fr'
          ? 'TRANSITION REFUSÉE : Déclenchement et ouverture préalable des sectionneurs obligatoires avant consignation !'
          : 'FORBIDDEN TRANSITION : Breaker and disconnectors must be tripped before applying grounds!'
      );
      return;
    }
    if (assetState === 'TRIPPED_FAULT_LOCKOUT' && nextState === 'NOMINAL_IN_SERVICE') {
      setFsmMessage(
        locale === 'fr'
          ? 'ACQUITTEMENT REQUIS : Réarmement manuel du relais de verrouillage 86 et contrôle de synchronisme requis !'
          : 'ACKNOWLEDGEMENT REQUIRED : Manual reset of 86 lockout relay and synchro-check required!'
      );
      setAssetState('NOMINAL_IN_SERVICE');
      return;
    }
    setFsmMessage(null);
    setAssetState(nextState);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PILLIER 6 · TOPOLOGIE DE CORRIDOR & MACHINE À ÉTATS FINIS (FSM)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <Network className="h-5 w-5 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Modèle Topologique & Machine d\'États d\'Exploitation'
                  : 'Topological Relationship Graph & Operational FSM Lifecycle'}
              </span>
            </h2>
          </div>

          {/* Current Asset Status Badge */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">État Actuel :</span>
            <span className={`px-2.5 py-1 rounded-lg border font-bold ${statesConfig[assetState].badge}`}>
              {locale === 'fr' ? statesConfig[assetState].label_fr : statesConfig[assetState].label_en}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Section: Interactive Topological Network Corridor */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Radio className="h-4 w-4 text-sky-400" />
            <span>{locale === 'fr' ? 'Graphe Topologique du Corridor Nachtigal - Yaoundé - Douala' : 'Corridor Topological Graph'}</span>
          </span>
          <span className="text-[10px] text-slate-500">
            {locale === 'fr' ? 'Sélectionnez un nœud d\'ouvrage' : 'Select a network node'}
          </span>
        </div>

        {/* Corridor Network Graph */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {TOPOLOGICAL_CORRIDOR_NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400 text-white font-bold shadow-lg shadow-sky-500/10'
                    : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                      {node.voltage_kv} kV
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] leading-tight line-clamp-2">
                    {node.name}
                  </div>
                </div>
                <div className="mt-2 text-[9px] text-sky-400 truncate">
                  {node.type}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Topological Node Deep-Dive (CIM IEC 61970 Attributes) */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252E38] pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                CIM: {selectedNode.type}
              </span>
              <span className="text-white font-bold">{selectedNode.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>Tension de Base : <strong className="text-white">{selectedNode.voltage_kv} kV</strong></span>
              <span>Statut SCADA : <strong className="text-emerald-400 font-mono">{selectedNode.scada_status}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-slate-500 text-[10px] block">Nœuds Topologiques Aval :</span>
              <span className="text-emerald-300 font-mono">
                {selectedNode.connected_to?.length ? selectedNode.connected_to.join(', ') : 'Terminaison / Jeu de barres'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-slate-500 text-[10px] block">Couplage Mutuel Terne Parallèle :</span>
              <span className="text-amber-300 font-mono">
                {selectedNode.mutual_coupling_with || 'Aucun couplage détecté'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
              <span className="text-slate-500 text-[10px] block">Statut d'Exploitation SCADA :</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Télémesure Active & Enregistrée
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: 5-State Finite State Machine (FSM) Engine */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Automate d\'États d\'Exploitation & Transitions Interdépendantes' : 'Operational Lifecycle State Machine (FSM)'}</span>
          </span>
          <span className="text-[10px] text-slate-500">
            Automates SCADA IEC 60870-5-104
          </span>
        </div>

        {/* FSM Warning Banner if interlock prevented */}
        {fsmMessage && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{fsmMessage}</span>
          </div>
        )}

        {/* 5 States Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(Object.keys(statesConfig) as OperationalState[]).map((stateKey) => {
            const isCurrent = assetState === stateKey;
            const cfg = statesConfig[stateKey];
            return (
              <div
                key={stateKey}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? `${cfg.badge} shadow-lg ring-1 ring-white/20`
                    : 'bg-[#0D1117] border-[#252E38] text-slate-400'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[11px]">
                      {locale === 'fr' ? cfg.label_fr : cfg.label_en}
                    </span>
                    {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    {locale === 'fr' ? cfg.desc_fr : cfg.desc_en}
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => transitionTo(stateKey)}
                    className="mt-3 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold transition-colors"
                  >
                    Activer État
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Transition Logic Rules Dossier */}
        <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2">
          <span className="text-slate-400 font-bold uppercase text-[11px] block">
            Règles d'Automates & Conditions de Basculement Interlockées :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">1 → 2 :</span>
              <span>Température conducteur &gt; 65°C mesurée par station météo DLR locale.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">2 → 3 :</span>
              <span>Déclenchement du terne n°2 parallèle forçant le transit total sur le terne n°1.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1/3 → 4 :</span>
              <span>Court-circuit franc éliminé par zone 1 distance, cycle 79 infructueux (défaut permanent).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">4 → 5 :</span>
              <span>Ordre de consignation délivré par le Dispatching SONATREL après ouverture vérifiée.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
