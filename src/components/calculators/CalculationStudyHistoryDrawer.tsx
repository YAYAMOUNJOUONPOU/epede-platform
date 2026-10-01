// src/components/calculators/CalculationStudyHistoryDrawer.tsx
// EPEDE — Calculation Study History Drawer
// Slide-in panel showing the last 10 engineering calculation sessions with timestamps,
// input summaries, results, and PDF export per entry

import React, { useState } from 'react';
import { X, Clock, Download, Trash2, FileText, ChevronRight, History } from 'lucide-react';
import { calculationStudyHistory, StudyHistoryEntry } from './CalculationStudyHistoryService';

interface CalculationStudyHistoryDrawerProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

function formatTimestamp(ts: number, locale: 'fr' | 'en'): string {
  const d = new Date(ts);
  const dateStr = d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const timeStr = d.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    hour: '2-digit', minute: '2-digit'
  });
  return `${dateStr} · ${timeStr}`;
}

function generatePdfText(entry: StudyHistoryEntry, locale: 'fr' | 'en'): string {
  const isFr = locale === 'fr';
  return [
    '================================================================',
    isFr ? 'RAPPORT D\'ÉTUDE INGÉNIERIE ÉLECTRIQUE — EPEDE' : 'ELECTRICAL ENGINEERING STUDY REPORT — EPEDE',
    '================================================================',
    '',
    isFr ? `DATE: ${formatTimestamp(entry.timestamp, locale)}` : `DATE: ${formatTimestamp(entry.timestamp, locale)}`,
    isFr ? `CALCULATEUR: ${entry.calculatorName.fr}` : `CALCULATOR: ${entry.calculatorName.en}`,
    isFr ? `NORME: ${entry.standard}` : `STANDARD: ${entry.standard}`,
    '',
    '----------------------------------------------------------------',
    isFr ? 'DONNÉES D\'ENTRÉE:' : 'INPUT DATA:',
    entry.inputSummary,
    '',
    '----------------------------------------------------------------',
    isFr ? 'RÉSULTATS:' : 'RESULTS:',
    entry.resultSummary,
    '',
    '================================================================',
    isFr
      ? 'Note: Résultats calculés selon les normes CEI/IEEE applicables.\nVérifier selon les conditions réelles du site avant application.'
      : 'Note: Results computed per applicable IEC/IEEE standards.\nVerify against actual site conditions before application.',
    '================================================================',
  ].join('\n');
}

export const CalculationStudyHistoryDrawer: React.FC<CalculationStudyHistoryDrawerProps> = ({
  locale,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const isFr = locale === 'fr';
  const [history, setHistory] = useState<StudyHistoryEntry[]>(() => calculationStudyHistory.getHistory());

  const refresh = () => setHistory(calculationStudyHistory.getHistory());

  const handleExportText = (entry: StudyHistoryEntry) => {
    const text = generatePdfText(entry, locale);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EPEDE_Study_${entry.calculatorTab}_${new Date(entry.timestamp).toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    calculationStudyHistory.removeEntry(id);
    refresh();
  };

  const handleClearAll = () => {
    calculationStudyHistory.clearHistory();
    refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
      {/* Drawer */}
      <div
        className="relative w-full max-w-md bg-[#080C14] border-l border-[#1a2235] shadow-2xl flex flex-col pointer-events-auto"
        style={{ animation: 'slideInRight 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2235] bg-[#060A10]">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {isFr ? 'Historique des Études' : 'Study History'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 bg-[#0D1520] px-2 py-0.5 rounded border border-[#1a2235]">
              {history.length} / 10
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-500/60 px-2 py-1 rounded transition-all"
              >
                {isFr ? 'Tout effacer' : 'Clear all'}
              </button>
            )}
            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="h-10 w-10 text-neutral-700 mb-3" />
              <p className="text-sm font-mono text-neutral-500">
                {isFr
                  ? 'Aucune étude enregistrée.\nLancez un calcul pour commencer.'
                  : 'No studies recorded yet.\nRun a calculation to begin.'}
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-[#1a2235] bg-[#0D1520] overflow-hidden hover:border-cyan-500/30 transition-all group"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a2235] bg-[#0A1018]">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {isFr ? entry.calculatorName.fr : entry.calculatorName.en}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">
                    {formatTimestamp(entry.timestamp, locale)}
                  </span>
                </div>
                {/* Standard badge */}
                <div className="px-4 pt-2.5">
                  <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {entry.standard}
                  </span>
                </div>
                {/* Input/Result summary */}
                <div className="px-4 py-2.5 space-y-1.5">
                  <p className="text-[10px] font-mono text-neutral-400 leading-relaxed line-clamp-2">
                    <span className="text-neutral-600">{isFr ? 'Entrées: ' : 'Inputs: '}</span>
                    {entry.inputSummary}
                  </p>
                  <p className="text-[10px] font-mono text-cyan-300 leading-relaxed font-bold line-clamp-2">
                    <span className="text-neutral-600">{isFr ? 'Résultat: ' : 'Result: '}</span>
                    {entry.resultSummary}
                  </p>
                </div>
                {/* Actions */}
                <div className="px-4 pb-3 flex items-center gap-2">
                  <button
                    onClick={() => handleExportText(entry)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1018] border border-[#1a2235] text-[10px] font-mono font-bold text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
                  >
                    <Download className="h-3 w-3" />
                    {isFr ? 'Exporter .txt' : 'Export .txt'}
                  </button>
                  {onNavigate && (
                    <button
                      onClick={() => { onNavigate(entry.calculatorTab); onClose(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1018] border border-[#1a2235] text-[10px] font-mono font-bold text-neutral-400 hover:border-amber-400/50 hover:text-amber-300 transition-all"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {isFr ? 'Rouvrir' : 'Reopen'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-mono text-red-500 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1a2235] bg-[#060A10]">
          <p className="text-[9px] font-mono text-neutral-600 text-center">
            {isFr
              ? 'Les 10 dernières études sont conservées en session locale. Non synchronisé avec un serveur.'
              : 'Last 10 studies stored locally per session. Not synced to a server.'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
