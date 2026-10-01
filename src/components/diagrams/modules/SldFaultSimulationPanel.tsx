// src/components/diagrams/modules/SldFaultSimulationPanel.tsx
import React from 'react';
import { Sliders } from 'lucide-react';
import { SldTopologyType } from './SldHeaderToolbar';

export type FaultType =
  | '87T'
  | '50_51'
  | '21'
  | '50N'
  | '49'
  | '64R'
  | '81O_81U'
  | '64_DC'
  | '87B_BUS1'
  | '87B_BUS2'
  | '21_LINE1'
  | '50BF_TIE';

interface SldFaultSimulationPanelProps {
  activeTopology: SldTopologyType;
  onSimulateFault: (type: FaultType) => void;
  onOpenTcc?: () => void;
  locale: 'fr' | 'en';
}

export const SldFaultSimulationPanel: React.FC<SldFaultSimulationPanelProps> = ({
  activeTopology,
  onSimulateFault,
  onOpenTcc,
  locale
}) => {
  return (
    <div className="border-t border-slate-200/90 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-slate-700 font-bold text-[11px]">
          {locale === 'fr' ? 'SCÉNARIOS DE DÉFAUT :' : 'FAULT SCENARIOS:'}
        </span>

        {activeTopology === 'breaker_and_half' ? (
          <>
            <button
              type="button"
              onClick={() => onSimulateFault('87B_BUS1')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut différentiel Jeu de Barres 1 (ANSI 87B) — Déclenche 52-1A sélectivement"
            >
              87B (Diff Barre 1)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('87B_BUS2')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut différentiel Jeu de Barres 2 (ANSI 87B) — Déclenche 52-2A sélectivement"
            >
              87B (Diff Barre 2)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('21_LINE1')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut Ligne 1 (ANSI 21/87L) — Déclenche 52-1A et 52-M"
            >
              21/87L (Défaut Ligne 1)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('50BF_TIE')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaillance Disjoncteur Central (ANSI 50BF) — Déclenche 52-1A et 52-2A"
            >
              50BF (Défaillance 52-M)
            </button>
          </>
        ) : activeTopology === 'solar_bess' ? (
          <>
            <button
              type="button"
              onClick={() => onSimulateFault('81O_81U')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Découplage perte réseau amont RoCoF IEEE 1547"
            >
              81O/81U (Anti-Îlotage)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('64_DC')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut isolement DC champ PV 1500 V"
            >
              64 (Défaut DC PV)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('87T')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Différentiel transformateur 120 MVA 33/225 kV"
            >
              87T (Diff Transfo)
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSimulateFault('87T')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Déclenchement différentiel transformateur 63 MVA"
            >
              87T (Diff Transfo)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('50_51')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-mono font-bold transition-colors shadow-xs"
              title="Surintensité / court-circuit ligne 225 kV"
            >
              50/51 (Surintensité)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('21')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 font-mono font-bold transition-colors shadow-xs"
              title="Protection de distance Zone 1 ligne 225 kV"
            >
              21 (Distance Z1)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('50N')}
              className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut homopolaire terre jeu de barres 30 kV"
            >
              50N/51N (Terre)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('49')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-mono font-bold transition-colors shadow-xs"
              title="Surcharge thermique enroulements"
            >
              49 (Thermique)
            </button>
            <button
              type="button"
              onClick={() => onSimulateFault('64R')}
              className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 font-mono font-bold transition-colors shadow-xs"
              title="Défaut masse cuve transformateur"
            >
              64R (Masse Cuve)
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 shrink-0">
        {onOpenTcc && (
          <button
            type="button"
            onClick={onOpenTcc}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-mono font-bold transition-all shadow-xs"
            title="Ouvrir la courbe de coordination temps-courant TCC (CEI 60255)"
          >
            <Sliders className="h-3.5 w-3.5 text-sky-600" />
            <span>{locale === 'fr' ? 'Courbes TCC' : 'TCC Curves'}</span>
          </button>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span>225 kV HTB</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>{activeTopology === 'solar_bess' ? '33 kV HTA' : '30 kV HTA'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{activeTopology === 'solar_bess' ? '1500 V DC' : '400 V BT'}</span>
        </span>
      </div>
    </div>
  );
};
