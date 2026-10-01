// src/components/layout/Header.tsx
// EPEDE Minimalist Premium Engineering Navigation Bar per Section 5 Directive
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bot, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  Globe,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Bookmark,
  Camera,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Check,
  Activity,
  Calculator,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { CANONICAL_ROLES } from '../../types/engineeringRoles';
import { soundEffects } from '../../services/soundEffectsService';
import { pwaService } from '../../services/pwaService';
import { UsageLevelSwitcher } from './UsageLevelSwitcher';

interface HeaderProps {
  locale: 'fr' | 'en';
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onToggleLocale?: (locale: 'fr' | 'en') => void;
  onSearchClick?: () => void;
  onOpenSearch?: () => void;
  onAIAssistantClick?: () => void;
  onOpenAssistant?: () => void;
  onOpenVisionInspector?: () => void;
  onMenuToggle?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  currentView: string;
  onNavigateHome?: () => void;
  onNavigateJourney?: () => void;
  onNavigateDomains?: () => void;
  onNavigateEquipment?: () => void;
  onNavigateEquipmentReference?: () => void;
  onNavigateRoles?: () => void;
  onNavigateStandards?: () => void;
  onNavigateDiagrams?: () => void;
  onNavigateSimulation?: () => void;
  onNavigateCalculators?: () => void;
  onNavigatePhase2?: () => void;
  onNavigateLifecycle?: () => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateContextStack?: () => void;
  onNavigateHydropower?: () => void;
  onNavigateIndustrialProjects?: () => void;
  onNavigateEngineersChain?: () => void;
  onNavigateEcosystem?: () => void;
  onNavigateArchitectures?: () => void;
  onOpenAudit?: () => void;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  onLocaleChange,
  onToggleLocale,
  onSearchClick,
  onOpenSearch,
  onAIAssistantClick,
  onOpenAssistant,
  onOpenVisionInspector,
  onMenuToggle,
  onToggleSidebar,
  isSidebarOpen = false,
  currentView,
  onNavigateHome,
  onNavigateJourney,
  onNavigateDomains,
  onNavigateEquipment,
  onNavigateEquipmentReference,
  onNavigateRoles,
  onNavigateStandards,
  onNavigateDiagrams,
  onNavigateCalculators,
  onNavigateCameroonGrid,
  onNavigateContextStack,
  onNavigateHydropower,
  onNavigateIndustrialProjects,
  onNavigateEngineersChain,
  onNavigateEcosystem,
  onNavigateArchitectures,
  onOpenAudit,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [systemsDropdownOpen, setSystemsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());
  const [isOnline, setIsOnline] = useState(pwaService.getStatus().isOnline);
  const systemsMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { 
    user, 
    profile, 
    activeRole, 
    activeRoleSlug, 
    setActiveRoleSlug, 
    signInWithGoogle, 
    signOutUser, 
    bookmarks,
    calculationNotes,
    sldAnnotations
  } = useAuth();

  useEffect(() => {
    const unsubSound = soundEffects.subscribe((muted) => setIsMuted(muted));
    const unsubPwa = pwaService.subscribe((online) => setIsOnline(online));
    return () => {
      unsubSound();
      unsubPwa();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (systemsMenuRef.current && !systemsMenuRef.current.contains(event.target as Node)) {
        setSystemsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocale = (l: 'fr' | 'en') => {
    soundEffects.playSwitchClick();
    if (onLocaleChange) onLocaleChange(l);
    else if (onToggleLocale) onToggleLocale(l);
  };

  const handleSearch = () => {
    soundEffects.playSwitchClick();
    if (onSearchClick) onSearchClick();
    else if (onOpenSearch) onOpenSearch();
  };

  const handleAssistant = () => {
    soundEffects.playSwitchClick();
    if (onAIAssistantClick) onAIAssistantClick();
    else if (onOpenAssistant) onOpenAssistant();
  };

  const handleToggle = () => {
    soundEffects.playSwitchClick();
    if (onMenuToggle) onMenuToggle();
    else if (onToggleSidebar) onToggleSidebar();
  };

  const navigateTo = (view: string) => {
    soundEffects.playSwitchClick();
    setSystemsDropdownOpen(false);
    if (onNavigate) {
      onNavigate(view);
    } else {
      switch (view) {
        case 'home': onNavigateHome?.(); break;
        case 'journey': onNavigateJourney?.(); break;
        case 'domains': onNavigateDomains?.(); break;
        case 'equipment': onNavigateEquipment?.(); break;
        case 'equipment-reference': onNavigateEquipmentReference ? onNavigateEquipmentReference() : onNavigateEquipment?.(); break;
        case 'diagrams': onNavigateDiagrams?.(); break;
        case 'calculators': onNavigateCalculators?.(); break;
        case 'cameroon-grid': onNavigateCameroonGrid?.(); break;
        case 'standards': onNavigateStandards?.(); break;
        case 'hydropower': onNavigateHydropower?.(); break;
        case 'context-stack': onNavigateContextStack?.(); break;
        case 'industrial-projects': onNavigateIndustrialProjects?.(); break;
        case 'engineers-chain': onNavigateEngineersChain?.(); break;
        case 'ecosystem': onNavigateEcosystem ? onNavigateEcosystem() : onNavigate?.('ecosystem'); break;
        case 'roles': onNavigateRoles ? onNavigateRoles() : (onNavigate ? onNavigate('roles') : null); break;
        case 'protection': onNavigate ? onNavigate('protection') : (window.location.hash = '#/protection'); break;
        case 'commissioning': onNavigate ? onNavigate('commissioning') : (window.location.hash = '#/commissioning'); break;
        case 'architectures': onNavigate ? onNavigate('architectures') : onNavigateArchitectures?.(); break;
        default: onNavigateHome?.(); break;
      }
    }
  };

  return (
    <header
      id="epede-minimal-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 specular-border ${
        isScrolled
          ? 'bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2'
          : 'bg-[#030712]/80 backdrop-blur-lg border-b border-white/[0.06] shadow-sm py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={locale === 'fr' ? 'Afficher/Masquer le volet' : 'Toggle panel'}
            title={locale === 'fr' ? 'Afficher/Masquer le volet' : 'Toggle panel'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4 text-amber-400" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 text-slate-300" />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/25 via-slate-900 to-slate-950 border border-amber-500/50 group-hover:border-amber-400 group-hover:shadow-[0_0_18px_rgba(245,158,11,0.45)] transition-all shadow-md shrink-0">
              <span className="font-mono font-black text-sm text-amber-400 group-hover:scale-110 transition-transform">
                E⚡
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight uppercase text-white font-display leading-none group-hover:text-amber-400 transition-colors">
                  EPEDE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  DIGITAL GRID
                </span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase tracking-tight font-mono hidden md:block leading-tight mt-0.5 truncate max-w-[280px]">
                Electrical Power Engineering Digital Environment
              </p>
            </div>
          </button>
        </div>

        {/* Center / Right: Minimal Navigation Links (EXPLORE, DOMAINS, SYSTEMS, SEARCH, ABOUT) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 font-mono text-xs font-semibold text-slate-300">
          
          {/* 3D ECOSYSTEM (Primary Interactive Gateway) */}
          <button
            type="button"
            onClick={() => navigateTo('ecosystem')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              currentView === 'ecosystem'
                ? 'text-cyan-300 bg-gradient-to-r from-cyan-950/90 to-sky-950/80 border border-cyan-500/70 font-bold shadow-md shadow-cyan-500/25 ring-1 ring-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
            }`}
          >
            <span className="text-amber-400">⚡</span>
            <span>{locale === 'fr' ? 'ÉCOSYSTÈME 3D' : '3D ECOSYSTEM'}</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/40">
              3D
            </span>
          </button>

          {/* EXPLORE */}
          <button
            type="button"
            onClick={() => navigateTo('journey')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              ['journey', 'home'].includes(currentView)
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
            }`}
          >
            {locale === 'fr' ? 'EXPLORER' : 'EXPLORE'}
          </button>

          {/* DOMAINS */}
          <button
            type="button"
            onClick={() => navigateTo('domains')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentView === 'domains'
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
            }`}
          >
            {locale === 'fr' ? 'DOMAINES' : 'DOMAINS'}
          </button>

          {/* REAL-WORLD ELECTRICAL EQUIPMENT REFERENCE */}
          <button
            type="button"
            onClick={() => navigateTo('equipment-reference')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              currentView === 'equipment-reference' || currentView === 'equipment' || currentView === 'equipment-list'
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
            }`}
          >
            <span>{locale === 'fr' ? 'MATÉRIEL' : 'EQUIPMENT'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-black border border-amber-500/40">
              {locale === 'fr' ? 'RÉEL' : 'REAL'}
            </span>
          </button>

          {/* SYSTEMS Dropdown */}
          <div ref={systemsMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setSystemsDropdownOpen(!systemsDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                ['diagrams', 'substations', 'cameroon-grid', 'hydropower', 'installations'].includes(currentView)
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/40 font-bold shadow-sm shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
              }`}
            >
              <span>{locale === 'fr' ? 'SYSTÈMES' : 'SYSTEMS'}</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${systemsDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {systemsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in-50 duration-100 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSystemsDropdownOpen(false);
                    if (onNavigate) onNavigate('domains');
                    else onNavigateDomains?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                >
                  <span>{locale === 'fr' ? 'Réseaux de Transport' : 'Transmission Networks'}</span>
                  <span className="text-[10px] text-sky-400 font-bold">16 Piliers</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('diagrams')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                >
                  <span>{locale === 'fr' ? 'Schéma SLD Unifilaire' : 'Single-Line SLD Diagram'}</span>
                  <span className="text-[10px] text-amber-500">CAD</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('architectures')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                >
                  <span>{locale === 'fr' ? 'Architectures Postes & TCO' : 'Substation Architectures & TCO'}</span>
                  <span className="text-[10px] text-cyan-400 font-bold">AIS/GIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('hydropower')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
                >
                  {locale === 'fr' ? 'Jumeau Numérique Hydro' : 'Hydro Digital Twin'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('cameroon-grid')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
                >
                  {locale === 'fr' ? 'Réseau HTB Cameroun (SONATREL)' : 'Cameroon HV Grid'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('calculators')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
                >
                  {locale === 'fr' ? 'Calculateurs CEI / IEEE' : 'IEC / IEEE Calculators'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('industrial-projects')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between border-t border-slate-800/60 mt-1 pt-2"
                >
                  <span>{locale === 'fr' ? 'Projets Industriels & Cas Réels' : 'Industrial Projects & Field Cases'}</span>
                  <span className="text-[10px] text-sky-400 font-bold">FIELD</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('engineers-chain')}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between border-t border-slate-800/60 mt-1 pt-2"
                >
                  <span>{locale === 'fr' ? 'Ingénieurs de la Chaîne Électrique' : 'Engineers by Domain (Chain)'}</span>
                  <span className="text-[10px] text-amber-400 font-bold">35+ RÔLES</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSystemsDropdownOpen(false);
                    onOpenAudit?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors flex items-center justify-between border-t border-slate-800/60 mt-1 pt-2"
                >
                  <span>{locale === 'fr' ? 'Audit & Maturité Plateforme' : 'Platform Audit & Maturity'}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">16/16 L5</span>
                </button>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all"
            title="Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'RECHERCHE' : 'SEARCH'}</span>
          </button>

          {/* ABOUT */}
          <button
            type="button"
            onClick={() => navigateTo('standards')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'standards'
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            {locale === 'fr' ? 'RÉFÉRENTIEL' : 'ABOUT'}
          </button>
        </nav>

        {/* Live Grid Frequency & Voltage Capsule */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono shadow-inner">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            50.00 Hz
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-sky-300 font-bold">225 kV</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-300 font-bold">1 483 MW</span>
        </div>

        {/* Right Actions: Audit Status + Lang Switcher + Guide IA + Primary CTA "ENTER EPEDE" */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Global Multi-Level Usage Depth Switcher (Priority #6) */}
          <UsageLevelSwitcher locale={locale} />

          {/* Audit Status Button (16/16 L5 Excellence) */}
          {onOpenAudit && (
            <button
              type="button"
              onClick={onOpenAudit}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all shadow-xs hover:border-emerald-400 hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
              title={locale === 'fr' ? 'Audit Qualité & Maturité EPEDE (16 Domaines L5)' : 'EPEDE Platform Maturity Audit (16 L5 Domains)'}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>16/16 L5</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1 py-0.2 rounded font-mono">
                98%
              </span>
            </button>
          )}

          {/* PWA Network / Field Status */}
          <div 
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border transition-colors ${
              isOnline 
                ? 'bg-slate-900/80 text-slate-400 border-slate-800' 
                : 'bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse'
            }`}
            title={isOnline ? (locale === 'fr' ? 'Connecté au Réseau' : 'Online Mode') : (locale === 'fr' ? 'Mode Poste Isolé (Hors-ligne actif)' : 'Offline Substation Field Mode')}
          >
            {isOnline ? (
              <Wifi className="h-3 w-3 text-emerald-400" />
            ) : (
              <WifiOff className="h-3 w-3 text-amber-400" />
            )}
            <span className="hidden lg:inline">{isOnline ? 'GRID SYNC' : 'OFFLINE'}</span>
          </div>

          {/* Audio Haptics / Synthesizer Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const newMuted = soundEffects.toggleMute();
              if (!newMuted) soundEffects.playBreakerClose();
            }}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs ${
              !isMuted 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25 shadow-amber-500/10' 
                : 'bg-slate-900/90 text-slate-500 border-slate-800 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={!isMuted ? (locale === 'fr' ? 'Effets Sonores Électriques Activés' : 'Electrical Sound Effects ON') : (locale === 'fr' ? 'Effets Sonores Désactivés' : 'Electrical Sound Effects OFF')}
            aria-label="Sound Toggle"
          >
            {!isMuted ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => handleLocale(locale === 'fr' ? 'en' : 'fr')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            title={locale === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            {locale.toUpperCase()}
          </button>

          {/* AI Field Equipment Vision Inspector trigger */}
          {onOpenVisionInspector && (
            <button
              type="button"
              onClick={onOpenVisionInspector}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
              title={locale === 'fr' ? 'Diagnostic Photo & Plaque Signalétique' : 'AI Nameplate Photo Diagnostics'}
              aria-label="Vision IA"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}

          {/* AI Assistant trigger */}
          <button
            type="button"
            onClick={handleAssistant}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 transition-all hidden sm:flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs font-mono text-xs font-bold"
            title={locale === 'fr' ? 'Assistant Ingénierie IA' : 'AI Engineering Assistant'}
            aria-label="Assistant IA"
          >
            <Bot className="h-4 w-4 text-amber-400" />
            <span>AI</span>
          </button>

          {/* Engineering Role Badge & Auth Sync Hub */}
          <div ref={userMenuRef} className="relative flex items-center gap-1.5">
            {/* Active Discipline Pill */}
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeRole.badge_color === 'amber'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-400/60'
                  : activeRole.badge_color === 'blue'
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:border-blue-400/60'
                  : activeRole.badge_color === 'purple'
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:border-purple-400/60'
                  : activeRole.badge_color === 'emerald'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/60'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/60'
              }`}
              title={locale === 'fr' ? `Discipline : ${activeRole.name_fr}` : `Role: ${activeRole.name_en}`}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-slate-300">
                {activeRole.domain_code}
              </span>
              <span className="hidden md:inline truncate max-w-[120px]">
                {locale === 'fr' ? activeRole.short_fr : activeRole.short_en}
              </span>
            </button>

            {/* User Profile / Guest Avatar Trigger */}
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-slate-200 transition-all text-xs"
              title={locale === 'fr' ? 'Dossier Ingénieur & Profil' : 'Engineer Dossier & Profile'}
            >
              {user ? (
                user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                  <UserIcon className="h-3 w-3" />
                </div>
              )}
              <span className="hidden lg:inline-block max-w-[85px] truncate text-[11px] font-mono font-bold">
                {user ? (user.displayName || user.email?.split('@')[0]) : (locale === 'fr' ? 'Invité' : 'Guest')}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Engineer Profile & Sync Hub Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-slate-950/98 backdrop-blur-2xl border border-slate-800/90 shadow-2xl p-3.5 z-50 text-xs space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Identity Card */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full object-cover border border-amber-400/50 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {user ? (user.email?.charAt(0).toUpperCase() || 'U') : <UserIcon className="h-4 w-4" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">
                        {user ? (user.displayName || 'Ingénieur') : (locale === 'fr' ? 'Ingénieur Invité' : 'Guest Engineer')}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {user ? user.email : (locale === 'fr' ? 'Session locale active' : 'Local offline session')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 ${
                    user ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{user ? 'CLOUD' : 'LOCAL'}</span>
                  </span>
                </div>

                {/* Discipline Profile Switcher */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    <span>{locale === 'fr' ? 'Discipline d\'Ingénierie Active' : 'Active Engineering Role'}</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('roles')}
                      className="text-amber-400 hover:text-amber-300 lowercase text-[10px]"
                    >
                      {locale === 'fr' ? 'voir référentiel →' : 'view matrix →'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CANONICAL_ROLES.map((r) => {
                      const isSelected = r.slug === activeRoleSlug;
                      return (
                        <button
                          key={r.slug}
                          type="button"
                          onClick={() => {
                            soundEffects.playSwitchClick();
                            setActiveRoleSlug(r.slug);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-xs'
                              : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-amber-300 font-bold shrink-0">
                              {r.domain_code}
                            </span>
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold truncate">
                                {locale === 'fr' ? r.name_fr : r.name_en}
                              </div>
                              <div className="text-[9px] text-slate-400 truncate">
                                {locale === 'fr' ? r.filiere_fr : r.filiere_en}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Engineering Dossier & Synced Metrics */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {locale === 'fr' ? 'Dossier Technique Synchronisé' : 'Synchronized Technical Dossier'}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => navigateTo('calculators')}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors group cursor-pointer"
                    >
                      <div className="text-sm font-mono font-bold text-amber-400 group-hover:scale-105 transition-transform">
                        {calculationNotes.length}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                        {locale === 'fr' ? 'Études' : 'Studies'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('equipment')}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                    >
                      <div className="text-sm font-mono font-bold text-cyan-400 group-hover:scale-105 transition-transform">
                        {bookmarks.length}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                        {locale === 'fr' ? 'Signets' : 'Bookmarks'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('diagrams')}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors group cursor-pointer"
                    >
                      <div className="text-sm font-mono font-bold text-purple-400 group-hover:scale-105 transition-transform">
                        {Object.keys(sldAnnotations).length}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                        {locale === 'fr' ? 'Schémas' : 'SLD Topos'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quick Studio Gateways */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => navigateTo('protection')}
                    className="p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-400/60 text-left cursor-pointer transition-all active:scale-95"
                  >
                    <div className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>Protection</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {locale === 'fr' ? 'Plan de réglages' : 'Relay Settings'}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('commissioning')}
                    className="p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 hover:border-purple-400/60 text-left cursor-pointer transition-all active:scale-95"
                  >
                    <div className="text-[10px] font-mono text-purple-300 font-bold flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      <span>FAT / SAT</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {locale === 'fr' ? 'Essais & Réception' : 'Commissioning'}
                    </div>
                  </button>
                </div>

                {/* Auth Trigger / Sign Out */}
                <div className="pt-2 border-t border-slate-800/80">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        signOutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Déconnexion du Compte' : 'Sign Out Account'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        signInWithGoogle();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Connexion Google (Cloud Sync)' : 'Sign In with Google (Cloud Sync)'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: ENTER EPEDE */}
          <button
            type="button"
            onClick={() => navigateTo('journey')}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 shadow-md shadow-amber-500/20 active:scale-95"
          >
            <span>{locale === 'fr' ? 'ENTRER DANS EPEDE' : 'ENTER EPEDE'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
