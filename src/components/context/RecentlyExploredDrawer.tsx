// src/components/context/RecentlyExploredDrawer.tsx
// EPEDE - Recently Explored Context & Saved Engineering Study Paths Drawer

import React, { useState, useEffect } from 'react';
import {
  History,
  Bookmark,
  X,
  Trash2,
  Plus,
  ArrowRight,
  Zap,
  FolderOpen,
  Clock,
  ChevronRight,
  Save,
} from 'lucide-react';
import { engineeringContextService } from '../../services/engineeringContextService';
import { ExplorationHistoryEntry, SavedEngineeringPath } from '../../types/contextStack';
import { soundEffects } from '../../services/soundEffectsService';

interface RecentlyExploredDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onNavigateDomain?: (domainCode: string) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateSimulation?: (tab: any) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
}

export const RecentlyExploredDrawer: React.FC<RecentlyExploredDrawerProps> = ({
  isOpen,
  onClose,
  locale,
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateContextStack,
}) => {
  if (!isOpen) return null;

  const [history, setHistory] = useState<ExplorationHistoryEntry[]>(engineeringContextService.getHistory());
  const [savedPaths, setSavedPaths] = useState<SavedEngineeringPath[]>(engineeringContextService.getSavedPaths());
  const [newPathName, setNewPathName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = engineeringContextService.subscribe(() => {
      setHistory(engineeringContextService.getHistory());
      setSavedPaths(engineeringContextService.getSavedPaths());
    });
    return () => unsub();
  }, []);

  const handleEntryClick = (entry: ExplorationHistoryEntry) => {
    soundEffects.playSwitchClick();
    if (entry.nodeId && onNavigateContextStack) {
      onNavigateContextStack(entry.nodeId);
    } else if (entry.equipmentId && onNavigateEquipment) {
      onNavigateEquipment(entry.equipmentId);
    } else if (entry.domainCode && onNavigateDomain) {
      onNavigateDomain(entry.domainCode);
    }
    onClose();
  };

  const handleSavePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathName.trim()) return;
    soundEffects.playSuccessChime();
    engineeringContextService.saveCurrentPath(newPathName.trim());
    setNewPathName('');
    setIsSaving(false);
  };

  const handleClearHistory = () => {
    soundEffects.playSwitchClick();
    engineeringContextService.clearHistory();
    setHistory([]);
  };

  const handleRemovePath = (pathId: string) => {
    soundEffects.playSwitchClick();
    engineeringContextService.removeSavedPath(pathId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase text-sm">
                {locale === 'fr' ? 'HISTORIQUE & PARCOURS D\'ÉTUDE' : 'HISTORY & SAVED PATHS'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            
            {/* Save current path section */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Sauvegarder ce parcours' : 'Save Study Sequence'}</span>
                </span>
                {!isSaving && (
                  <button
                    type="button"
                    onClick={() => setIsSaving(true)}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-colors"
                  >
                    + {locale === 'fr' ? 'Nouveau' : 'New'}
                  </button>
                )}
              </div>

              {isSaving && (
                <form onSubmit={handleSavePath} className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={newPathName}
                    onChange={(e) => setNewPathName(e.target.value)}
                    placeholder={locale === 'fr' ? 'Ex: Traçabilité Songloulou -> Oyomabang' : 'e.g. Songloulou to Oyomabang Sizing'}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSaving(false)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[10px]"
                    >
                      {locale === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition-colors"
                    >
                      {locale === 'fr' ? 'Enregistrer' : 'Save'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Saved study paths */}
            {savedPaths.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {locale === 'fr' ? 'PARCOURS ENREGISTRÉS' : 'SAVED PATHS'} ({savedPaths.length})
                </span>
                <div className="space-y-1.5">
                  {savedPaths.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {p.nodes.length} {locale === 'fr' ? 'éléments' : 'nodes'} · {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePath(p.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                        title={locale === 'fr' ? 'Supprimer le parcours' : 'Remove path'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Exploration History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {locale === 'fr' ? 'DERNIERS ÉLÉMENTS CONSULTÉS' : 'RECENTLY EXPLORED'} ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                  >
                    {locale === 'fr' ? 'Effacer' : 'Clear'}
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-1.5">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleEntryClick(h)}
                      className="w-full text-left p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-300 group-hover:text-amber-300 text-xs truncate">
                          {h.title[locale]}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-500 font-mono">
                          {h.tag && <span className="text-cyan-400 font-bold">{h.tag}</span>}
                          {h.voltageLevel && <span>• {h.voltageLevel}</span>}
                          <span>• {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-slate-500 text-xs">
                  {locale === 'fr' ? 'Aucun élément récent dans l\'historique.' : 'No recent exploration history.'}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              {locale === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
