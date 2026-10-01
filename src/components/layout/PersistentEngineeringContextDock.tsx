// src/components/layout/PersistentEngineeringContextDock.tsx
// EPEDE - Persistent Engineering Context Stack Dock
// Sits persistently below the header, tracking user's engineering exploration trail,
// allowing step-back, saving paths, copying/sharing, role-based filtering, and trust inspection.

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Map,
  Bookmark,
  Share2,
  Copy,
  Check,
  X,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Trash2,
  Sparkles,
  Shield,
  Wrench,
  Cpu,
  Building,
  Eye,
  Download,
  Upload,
  ShieldCheck,
  ExternalLink,
  Edit2,
  FileText,
  FileCode
} from 'lucide-react';
import {
  contextStackSessionStore,
  type RepresentationViewMode
} from '../../services/contextStackSessionStore';
import type {
  EngineeringContextTrailItem,
  SavedEngineeringPath,
  EngineeringRoleFilter
} from '../../types/engineeringIntelligenceExtensions';
import { EvidenceTrustModal } from '../equipment/EvidenceTrustModal';

interface PersistentEngineeringContextDockProps {
  locale?: 'fr' | 'en';
  onNavigateToTarget?: (target: { view: string; domainCode?: string; equipmentId?: string; nodeId?: string }) => void;
  onReturnToSystemMap?: () => void;
}

export const PersistentEngineeringContextDock: React.FC<PersistentEngineeringContextDockProps> = ({
  locale = 'fr',
  onNavigateToTarget,
  onReturnToSystemMap
}) => {
  const [trail, setTrail] = useState<EngineeringContextTrailItem[]>([]);
  const [savedPaths, setSavedPaths] = useState<SavedEngineeringPath[]>([]);
  const [activeRole, setActiveRole] = useState<EngineeringRoleFilter>('ALL');
  const [activeViewMode, setActiveViewMode] = useState<RepresentationViewMode>('ELECTRICAL');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isSavedPathsDrawerOpen, setIsSavedPathsDrawerOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState<boolean>(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  
  // Modals state
  const [pathNameInput, setPathNameInput] = useState<string>('');
  const [pathNotesInput, setPathNotesInput] = useState<string>('');
  const [shareTab, setShareTab] = useState<'url' | 'markdown' | 'json'>('url');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [jsonImportInput, setJsonImportInput] = useState<string>('');
  const [editingPathId, setEditingPathId] = useState<string | null>(null);
  const [editingPathName, setEditingPathName] = useState<string>('');

  const isFr = locale === 'fr';

  useEffect(() => {
    // Initial fetch from store
    setTrail(contextStackSessionStore.getTrail());
    setSavedPaths(contextStackSessionStore.getSavedPaths());
    setActiveRole(contextStackSessionStore.getActiveRole());
    setActiveViewMode(contextStackSessionStore.getActiveViewMode());
    setIsCollapsed(contextStackSessionStore.isDockCollapsed());

    // Subscribe to store updates
    const unsubscribe = contextStackSessionStore.subscribe(() => {
      setTrail(contextStackSessionStore.getTrail());
      setSavedPaths(contextStackSessionStore.getSavedPaths());
      setActiveRole(contextStackSessionStore.getActiveRole());
      setActiveViewMode(contextStackSessionStore.getActiveViewMode());
      setIsCollapsed(contextStackSessionStore.isDockCollapsed());
    });

    return () => unsubscribe();
  }, []);

  // Close role dropdown when clicking outside
  useEffect(() => {
    if (!isRoleDropdownOpen) return;
    const handleClickOutside = () => setIsRoleDropdownOpen(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isRoleDropdownOpen]);

  const handleToggleCollapse = () => {
    const next = contextStackSessionStore.toggleDockCollapsed();
    setIsCollapsed(next);
  };

  const handleStepBack = () => {
    const prevItem = contextStackSessionStore.goBackOneLevel();
    if (prevItem?.routeTarget && onNavigateToTarget) {
      onNavigateToTarget(prevItem.routeTarget);
    }
  };

  const handleTrailItemClick = (item: EngineeringContextTrailItem) => {
    if (item.routeTarget && onNavigateToTarget) {
      onNavigateToTarget(item.routeTarget);
    }
  };

  const handleSavePath = () => {
    if (!pathNameInput.trim()) return;
    contextStackSessionStore.saveCurrentPath(pathNameInput, pathNotesInput);
    setPathNameInput('');
    setPathNotesInput('');
    setIsSaveModalOpen(false);
  };

  const handleRestoreAndNavigate = (path: SavedEngineeringPath) => {
    contextStackSessionStore.restoreSavedPath(path);
    setIsSavedPathsDrawerOpen(false);
    // Navigate to the final item in the path
    const lastItem = path.items[path.items.length - 1];
    if (lastItem?.routeTarget && onNavigateToTarget) {
      onNavigateToTarget(lastItem.routeTarget);
    }
  };

  const handleCopyText = (text: string, notificationKey: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(notificationKey);
      setTimeout(() => setCopiedNotification(null), 2500);
    }
  };

  const handleDownloadJson = (dataString: string, filename: string) => {
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!jsonImportInput.trim()) return;
    const imported = contextStackSessionStore.importPathFromJson(jsonImportInput);
    if (imported) {
      setJsonImportInput('');
      setCopiedNotification('import-success');
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const handleRoleSelect = (role: EngineeringRoleFilter) => {
    contextStackSessionStore.setActiveRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleViewModeToggle = () => {
    const modes: RepresentationViewMode[] = ['PHYSICAL', 'ELECTRICAL', 'FUNCTIONAL', 'DIGITAL_TWIN'];
    const nextIdx = (modes.indexOf(activeViewMode) + 1) % modes.length;
    contextStackSessionStore.setActiveViewMode(modes[nextIdx]);
  };

  const lastTrailItem = trail.length > 0 ? trail[trail.length - 1] : null;

  return (
    <div className="w-full bg-[#070B10] border-b border-slate-800 text-xs font-mono select-none z-30 transition-all">
      
      {/* ===================================================================== */}
      {/* 1. COLLAPSED VIEW (Ultra-compact 30px sliver)                         */}
      {/* ===================================================================== */}
      {isCollapsed ? (
        <div className="px-3 sm:px-4 py-1 flex items-center justify-between gap-2 bg-[#0A0E13] border-b border-slate-900">
          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              title={isFr ? "Déplier la barre de contexte" : "Expand context dock"}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1 shrink-0">
              <Compass className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">{isFr ? 'PARCOURS :' : 'TRAIL :'}</span>
            </span>

            {lastTrailItem ? (
              <div className="flex items-center gap-1 text-[11px] font-sans truncate text-slate-300">
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                  {lastTrailItem.domainCode}
                </span>
                <span className="font-semibold">{isFr ? lastTrailItem.name_fr : lastTrailItem.name_en}</span>
                {lastTrailItem.voltage && (
                  <span className="text-[10px] text-slate-500 font-mono">({lastTrailItem.voltage})</span>
                )}
                <span className="text-slate-500 text-[10px]">· {trail.length} {isFr ? 'étapes' : 'steps'}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-[11px] italic">
                {isFr ? 'Aucun parcours' : 'No trail recorded'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Step Back button */}
            <button
              type="button"
              onClick={handleStepBack}
              disabled={trail.length <= 1}
              className={`p-1 rounded text-[10px] flex items-center gap-1 ${
                trail.length > 1
                  ? 'text-amber-400 hover:bg-slate-800 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title={isFr ? "Reculer d'un cran" : "Step back"}
            >
              <ArrowLeft className="w-3 h-3" />
            </button>

            {/* Quick Expand Button */}
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-sans cursor-pointer"
            >
              {isFr ? 'Déplier' : 'Expand'}
            </button>
          </div>
        </div>
      ) : (
        /* 2. EXPANDED FULL CONTEXT DOCK */
        <div className="px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 border-b border-slate-900">
          
          {/* Left: YOU ARE EXPLORING (Trail Path) */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 shrink-0">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFr ? 'VOUS EXPLOREZ :' : 'YOU ARE EXPLORING :'}</span>
            </span>

            {trail.length === 0 ? (
              <span className="text-slate-500 text-[11px] italic">
                {isFr ? 'Démarrez votre navigation dans un domaine...' : 'Start exploring any engineering domain...'}
              </span>
            ) : (
              <div className="flex items-center gap-1 shrink-0">
                {trail.map((item, idx) => {
                  const isLast = idx === trail.length - 1;
                  return (
                    <React.Fragment key={`${item.id}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleTrailItemClick(item)}
                        className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                          isLast
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                        title={isFr ? `Retourner à : ${item.name_fr}` : `Jump back to: ${item.name_en}`}
                      >
                        <span className="text-[9px] font-mono text-amber-400/80 font-bold">[{item.domainCode}]</span>
                        <span>{isFr ? item.name_fr : item.name_en}</span>
                        {item.voltage && (
                          <span className="text-[9px] text-slate-500 font-mono">({item.voltage})</span>
                        )}
                      </button>

                      {!isLast && (
                        <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Step Back One Level */}
            <button
              type="button"
              onClick={handleStepBack}
              disabled={trail.length <= 1}
              className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1 transition-all ${
                trail.length > 1
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 cursor-pointer'
                  : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
              }`}
              title={isFr ? "Reculer d'un niveau d'ingénierie" : "Go back one engineering level"}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{isFr ? 'Reculer' : 'Step Back'}</span>
            </button>

            {/* System Map */}
            {onReturnToSystemMap && (
              <button
                type="button"
                onClick={onReturnToSystemMap}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title={isFr ? "Revenir à la carte globale du réseau" : "Return to overall system map"}
              >
                <Map className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden lg:inline">{isFr ? 'Carte Réseau' : 'System Map'}</span>
              </button>
            )}

            {/* Save Path */}
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title={isFr ? "Enregistrer ce chemin d'exploration" : "Save this exploration path"}
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">{isFr ? 'Sauvegarder' : 'Save'}</span>
            </button>

            {/* Saved Paths Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsSavedPathsDrawerOpen(true)}
              className={`p-1.5 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                savedPaths.length > 0
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
              title={isFr ? "Consulter mes parcours d'ingénierie" : "View saved paths"}
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">{savedPaths.length}</span>
            </button>

            {/* Share / Export Trail Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title={isFr ? "Partager ou exporter ce parcours d'ingénierie" : "Share or export this engineering trail"}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">{isFr ? 'Partager' : 'Share'}</span>
            </button>

            {/* Evidence & Trust Master Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsTrustModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title={isFr ? "Explorer le Système des 10 Badges de Confiance d'Ingénierie" : "Explore 10-Tier Evidence & Trust System"}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden 2xl:inline">{isFr ? 'Preuves (10)' : 'Trust (10)'}</span>
            </button>

            {/* Role Filter Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                title={isFr ? "Filtrer selon mon rôle métier" : "Filter by engineering role"}
              >
                <span className="text-[10px] text-slate-500 uppercase font-bold">Rôle :</span>
                <strong className="text-amber-400 font-sans">{activeRole}</strong>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-48 p-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl z-50 space-y-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { id: 'ALL', label_fr: 'Tous les rôles', label_en: 'All Roles', icon: Sparkles },
                    { id: 'PROTECTION', label_fr: 'Ingénieur Protection', label_en: 'Protection Engineer', icon: Shield },
                    { id: 'MAINTENANCE', label_fr: 'Ingénieur Maintenance', label_en: 'Maintenance Engineer', icon: Wrench },
                    { id: 'COMMISSIONING', label_fr: 'Mise en Service (SAT)', label_en: 'Commissioning (SAT)', icon: Cpu },
                    { id: 'BUILDING_ELECTRICAL', label_fr: 'Ingénieur Tertiaire & BT', label_en: 'Building & LV Engineer', icon: Building },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id as EngineeringRoleFilter)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                          activeRole === r.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{isFr ? r.label_fr : r.label_en}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Representation Mode Switcher (Physical / Electrical / Functional / Digital Twin) */}
            <button
              type="button"
              onClick={handleViewModeToggle}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
              title={isFr ? `Mode de représentation actuel : ${activeViewMode}. Cliquez pour basculer.` : `Current representation view: ${activeViewMode}. Click to toggle.`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono text-[10px] text-cyan-300">{activeViewMode}</span>
            </button>

            {/* Collapse Toggle Button */}
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title={isFr ? "Replier la barre de contexte d'ingénierie" : "Collapse engineering context dock"}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: SAVE CURRENT ENGINEERING EXPLORATION PATH                        */}
      {/* ======================================================================= */}
      {isSaveModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md p-5 rounded-2xl bg-[#0F141C] border border-slate-800 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <strong className="text-white text-sm font-sans">
                  {isFr ? 'Enregistrer le Parcours d\'Exploration' : 'Save Engineering Path'}
                </strong>
              </div>
              <button 
                type="button" 
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 text-xs font-sans">
              {isFr 
                ? `Ce parcours comporte ${trail.length} étapes d'ingénierie mémorisées. Donnez-lui un nom pour le retrouver plus tard :`
                : `This trail has ${trail.length} recorded engineering steps. Provide a name to recall it later:`}
            </p>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-sans uppercase font-bold block">
                {isFr ? 'Nom du Parcours :' : 'Path Name:'}
              </label>
              <input
                type="text"
                placeholder={isFr ? "Ex. Corridor Songloulou vers Bekoko 225 kV" : "e.g. Songloulou to Bekoko 225 kV Corridor"}
                value={pathNameInput}
                onChange={(e) => setPathNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-hidden focus:border-amber-500"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-sans uppercase font-bold block">
                {isFr ? 'Notes Techniques d\'Accompagnement (Optionnel) :' : 'Technical Notes (Optional):'}
              </label>
              <textarea
                rows={2}
                placeholder={isFr ? "Ex. Vérification de coordination différentielle 87T et seuils max I 51..." : "e.g. Checking 87T differential coordination and 51 overcurrent..."}
                value={pathNotesInput}
                onChange={(e) => setPathNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSavePath}
                disabled={!pathNameInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isFr ? 'Enregistrer' : 'Save Path'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* DRAWER: SAVED ENGINEERING PATHS LIST                                    */}
      {/* ======================================================================= */}
      {isSavedPathsDrawerOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md h-full bg-[#0F141C] border-l border-slate-800 shadow-2xl p-5 space-y-4 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <strong className="text-white text-sm font-sans">
                  {isFr ? 'Parcours d\'Ingénierie Enregistrés' : 'Saved Engineering Trails'}
                </strong>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                  {savedPaths.length}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsSavedPathsDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {savedPaths.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Bookmark className="w-6 h-6 mx-auto text-slate-600" />
                  <p>{isFr ? 'Aucun parcours enregistré pour le moment.' : 'No saved paths yet.'}</p>
                  <p className="text-[11px] text-slate-600">
                    {isFr ? 'Explorez les domaines et cliquez sur "Sauvegarder".' : 'Explore any domain and click "Save".'}
                  </p>
                </div>
              ) : (
                savedPaths.map((p) => {
                  const isEditing = editingPathId === p.id;

                  return (
                    <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingPathName}
                              onChange={(e) => setEditingPathName(e.target.value)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-full"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                contextStackSessionStore.updateSavedPath(p.id, editingPathName);
                                setEditingPathId(null);
                              }}
                              className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <div>
                            <strong className="text-white font-sans text-xs block">{p.name}</strong>
                            {p.notes && (
                              <p className="text-[10.5px] text-slate-400 font-sans italic mt-0.5">{p.notes}</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPathId(p.id);
                              setEditingPathName(p.name);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-slate-300"
                            title={isFr ? "Renommer ce parcours" : "Rename path"}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const json = contextStackSessionStore.exportPathAsJson(p);
                              handleDownloadJson(json, `epede_path_${p.id}.json`);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-sky-400"
                            title={isFr ? "Télécharger en JSON" : "Download as JSON"}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => contextStackSessionStore.duplicateSavedPath(p.id)}
                            className="p-1 rounded text-slate-500 hover:text-amber-400"
                            title={isFr ? "Dupliquer ce parcours" : "Duplicate path"}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => contextStackSessionStore.deleteSavedPath(p.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            title={isFr ? "Supprimer ce parcours" : "Delete path"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Steps trail sequence */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                        <span className="text-slate-500 font-bold">{p.items.length} {isFr ? 'étapes :' : 'steps:'}</span>
                        {p.items.map((it, itIdx) => (
                          <span key={itIdx} className="inline-flex items-center gap-0.5">
                            <span className="px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[9px]">
                              [{it.domainCode}] {isFr ? it.name_fr : it.name_en}
                            </span>
                            {itIdx < p.items.length - 1 && <span className="text-slate-600">→</span>}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => handleRestoreAndNavigate(p)}
                          className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold transition-all cursor-pointer"
                        >
                          {isFr ? '⚡ Charger & Naviguer' : '⚡ Load & Navigate'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: SHARE & EXPORT ENGINEERING TRAIL                                 */}
      {/* ======================================================================= */}
      {isShareModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg p-5 rounded-2xl bg-[#0F141C] border border-slate-800 shadow-2xl space-y-4 font-mono text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <strong className="text-white text-sm font-sans">
                  {isFr ? 'Partager / Exporter le Parcours d\'Ingénierie' : 'Share / Export Engineering Trail'}
                </strong>
              </div>
              <button 
                type="button" 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs: URL / Markdown / JSON */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setShareTab('url')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  shareTab === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? '1. Lien URL' : '1. URL Link'}
              </button>

              <button
                type="button"
                onClick={() => setShareTab('markdown')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  shareTab === 'markdown' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? '2. Rapport Texte' : '2. Report Text'}
              </button>

              <button
                type="button"
                onClick={() => setShareTab('json')}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  shareTab === 'json' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? '3. JSON & Import' : '3. JSON & Import'}
              </button>
            </div>

            {/* Tab 1: Shareable URL */}
            {shareTab === 'url' && (
              <div className="space-y-3 font-sans">
                <p className="text-slate-300 text-xs">
                  {isFr
                    ? 'Ce lien URL sécurisé encode l\'intégralité des étapes explorées. Toute personne ouvrant ce lien retrouvera votre parcours complet :'
                    : 'This secure URL encodes all recorded exploration steps. Opening this link will restore your exact engineering trail:'}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-amber-300 overflow-hidden">
                  <span className="truncate">{contextStackSessionStore.encodeTrailToUrl()}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(contextStackSessionStore.encodeTrailToUrl(), 'url')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedNotification === 'url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>{isFr ? 'Copié !' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-950" />
                        <span>{isFr ? 'Copier' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Markdown & Text Report */}
            {shareTab === 'markdown' && (
              <div className="space-y-3 font-sans">
                <p className="text-slate-300 text-xs">
                  {isFr
                    ? 'Format structuré prêt à coller dans vos comptes-rendus d\'ingénierie, fiches de synthèse ou correspondances techniques :'
                    : 'Structured technical markdown dossier ready to paste into design reviews or project memos:'}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-48 overflow-y-auto font-mono text-[10.5px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {contextStackSessionStore.exportTrailAsMarkdown(locale)}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(contextStackSessionStore.exportTrailAsText(locale), 'text')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    {copiedNotification === 'text' ? (isFr ? 'Texte Copié !' : 'Text Copied!') : (isFr ? 'Copier en Texte Brut' : 'Copy Plain Text')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(contextStackSessionStore.exportTrailAsMarkdown(locale), 'md')}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono cursor-pointer"
                  >
                    {copiedNotification === 'md' ? (isFr ? 'Markdown Copié !' : 'Markdown Copied!') : (isFr ? 'Copier en Markdown' : 'Copy Markdown')}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: JSON Export & Import */}
            {shareTab === 'json' && (
              <div className="space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">
                    {isFr ? 'Exportation du parcours actif :' : 'Export active trail:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const json = contextStackSessionStore.exportTrailAsJson();
                      handleDownloadJson(json, `epede_trail_${Date.now()}.json`);
                    }}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Télécharger .json' : 'Download .json'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <span className="text-xs text-slate-300 font-bold block">
                    {isFr ? 'Importer un parcours (coller le JSON) :' : 'Import trail (paste JSON):'}
                  </span>
                  <textarea
                    rows={3}
                    placeholder={isFr ? 'Collez ici un export JSON de parcours EPEDE...' : 'Paste EPEDE trail JSON export here...'}
                    value={jsonImportInput}
                    onChange={(e) => setJsonImportInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                  <div className="flex items-center justify-between">
                    {copiedNotification === 'import-success' && (
                      <span className="text-emerald-400 text-[11px] font-bold">
                        {isFr ? '✔ Parcours importé avec succès !' : '✔ Trail imported successfully!'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleImportJson}
                      disabled={!jsonImportInput.trim()}
                      className="ml-auto px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {isFr ? 'Importer dans mes parcours' : 'Import to Saved Paths'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MASTER EVIDENCE TRUST MODAL                                             */}
      {/* ======================================================================= */}
      <EvidenceTrustModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        locale={locale}
      />

    </div>
  );
};
