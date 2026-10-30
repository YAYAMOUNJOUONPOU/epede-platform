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
  FileText,
  Sun,
  Moon,
  FlaskConical,
  BookOpen
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
  onNavigateAssetManagement?: () => void;
  onToggleContextHUD?: () => void;
  isContextHUDOpen?: boolean;
  onOpenAudit?: () => void;
  onNavigate?: (view: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onNavigateReferenceHub?: () => void;
  onNavigateLaboratory?: () => void;
  onNavigateGlossary?: () => void;
  onNavigateAbout?: () => void;
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
  onNavigateAssetManagement,
  onToggleContextHUD,
  isContextHUDOpen = false,
  onOpenAudit,
  onNavigate,
  theme = 'dark',
  onToggleTheme,
  onNavigateReferenceHub,
  onNavigateLaboratory,
  onNavigateGlossary,
  onNavigateAbout,
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
        case 'reference-hub':
          if (onNavigateReferenceHub) onNavigateReferenceHub();
          else if (onNavigate) onNavigate('reference-hub');
          else window.location.hash = '#/centre-reference';
          break;
        case 'diagrams': onNavigateDiagrams?.(); break;
        case 'calculators': onNavigateCalculators?.(); break;
        case 'cameroon-grid': onNavigateCameroonGrid?.(); break;
        case 'standards': onNavigateStandards?.(); break;
        case 'hydropower': onNavigateHydropower?.(); break;
        case 'context-stack': onNavigateContextStack?.(); break;
        case 'industrial-projects': onNavigateIndustrialProjects?.(); break;
        case 'engineers-chain': onNavigateEngineersChain?.(); break;
        case 'ecosystem': onNavigateEcosystem ? onNavigateEcosystem() : onNavigate?.('ecosystem'); break;
        case 'protection': onNavigate ? onNavigate('protection') : (window.location.hash = '#/protection'); break;
        case 'commissioning': onNavigate ? onNavigate('commissioning') : (window.location.hash = '#/commissioning'); break;
        case 'architectures': onNavigate ? onNavigate('architectures') : onNavigateArchitectures?.(); break;
        case 'asset-management': onNavigate ? onNavigate('asset-management') : (onNavigateAssetManagement ? onNavigateAssetManagement() : (window.location.hash = '#/asset-management')); break;
        case 'laboratory': onNavigateLaboratory ? onNavigateLaboratory() : (onNavigate ? onNavigate('laboratory') : (window.location.hash = '#/laboratoire')); break;
        case 'glossary': onNavigateGlossary ? onNavigateGlossary() : (onNavigate ? onNavigate('glossary') : (window.location.hash = '#/glossaire')); break;
        case 'about': onNavigateAbout ? onNavigateAbout() : (onNavigate ? onNavigate('about') : (window.location.hash = '#/a-propos')); break;
        default: onNavigateHome?.(); break;
      }
    }
  };

  return (
    <header
      id="epede-minimal-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 specular-border ${
        isScrolled
          ? 'bg-[#0B0F12]/95 backdrop-blur-xl border-b border-[#567A87]/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2'
          : 'bg-[#0B0F12]/90 backdrop-blur-lg border-b border-[#567A87]/20 shadow-sm py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={locale === 'fr' ? 'Afficher/Masquer le volet' : 'Toggle navigation menu'}
            title={locale === 'fr' ? 'Afficher/Masquer le volet' : 'Toggle navigation menu'}
            className="p-2 rounded-xl text-[#A9ADA5] hover:text-[#F4F1E8] hover:bg-[#151C1E] border border-[#567A87]/30 hover:border-[#D7A64A]/60 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4 text-[#D7A64A]" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 text-[#F4F1E8]" />
            )}
          </button>

          <a
            href="#/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('home');
              }
            }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer select-none no-underline"
          >
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-[#151C1E] border border-[#D7A64A]/60 group-hover:border-[#D7A64A] transition-all shadow-md shrink-0">
              <span className="font-mono font-black text-sm text-[#D7A64A] group-hover:scale-105 transition-transform">
                E⚡
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight uppercase text-[#F4F1E8] font-display leading-none group-hover:text-[#D7A64A] transition-colors">
                  EPEDE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold text-[#D7A64A] bg-[#D7A64A]/10 px-2 py-0.5 rounded-full border border-[#D7A64A]/30">
                  POWER SYSTEMS
                </span>
              </div>
              <p className="text-[9px] text-[#A9ADA5] uppercase tracking-tight font-mono hidden md:block leading-tight mt-0.5 truncate max-w-[290px]">
                Electrical Power Engineering Digital Environment
              </p>
            </div>
          </a>
        </div>

        {/* Center: EPEDE 2.0 7-Item Intuitive Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 font-sans text-xs font-semibold text-[#A9ADA5]">
          
          {/* 1. HOME */}
          <a
            href="#/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('home');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all select-none no-underline ${
              currentView === 'home'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            {locale === 'fr' ? 'Accueil' : 'Home'}
          </a>

          {/* 2. LEARN (8 Progressive Learning Pathways) */}
          <a
            href="#/en/learn"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('thematic-journeys');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all select-none no-underline ${
              currentView === 'thematic-journeys' || currentView === 'scenarios'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            {locale === 'fr' ? 'Apprendre' : 'Learn'}
          </a>

          {/* 3. ELECTRICAL SYSTEMS (9-Stage Visual Power System Explorer) */}
          <a
            href="#/en/electrical-systems"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('journey');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all select-none no-underline ${
              currentView === 'journey' || currentView === 'follow-the-energy'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            {locale === 'fr' ? 'Systèmes Électriques' : 'Electrical Systems'}
          </a>

          {/* 4. EQUIPMENT (Visual Catalogue of Electrical Components) */}
          <a
            href="#/en/equipment"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('equipment-list');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 select-none no-underline ${
              currentView === 'equipment-list' || currentView === 'equipment' || currentView === 'equipment-reference'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            <span>{locale === 'fr' ? 'Équipements' : 'Equipment'}</span>
          </a>

          {/* 5. INDUSTRIAL ENGINEERING */}
          <a
            href="#/en/industrial-engineering"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('industrial-projects');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all select-none no-underline ${
              currentView === 'industrial-projects'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            {locale === 'fr' ? 'Génie Industriel' : 'Industrial Engineering'}
          </a>

          {/* 6. ENGINEERING LIBRARY (Dropdown for 21 Domains, Cameroon Grid, Standards, Glossary, SLDs & Lab) */}
          <div ref={systemsMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setSystemsDropdownOpen(!systemsDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                ['domains', 'domain', 'cameroon-grid', 'standards', 'glossary', 'diagrams', 'laboratory', 'simulation', 'calculators', 'reference-hub'].includes(currentView)
                  ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                  : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
              }`}
            >
              <span>{locale === 'fr' ? 'Bibliothèque Technique' : 'Engineering Library'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${systemsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {systemsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#151C1E] border border-[#567A87]/40 shadow-2xl py-2 z-50 animate-in fade-in-50 duration-100 text-xs">
                <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D7A64A] font-bold border-b border-[#567A87]/20">
                  {locale === 'fr' ? 'Référentiels & Exploration' : 'Knowledge & Reference Library'}
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('domains')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? '21 Domaines de Connaissances' : '21 Knowledge Domains (D01–D16)'}</span>
                  <span className="text-[10px] font-mono text-[#D7A64A] font-bold">D01–L05</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('cameroon-grid')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Réseau Électrique du Cameroun' : 'Cameroon Power Network (RIS/RIN)'}</span>
                  <span className="text-[10px] font-mono text-[#D7A64A] font-bold">🇨🇲 GRID</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('diagrams')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Schémas Unifilaires Interactifs' : 'Interactive Single-Line Diagrams'}</span>
                  <span className="text-[10px] font-mono text-[#A9ADA5] font-bold">SLD</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('standards')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Normes CEI / IEEE / NF C' : 'IEC / IEEE / NF C Standards'}</span>
                  <span className="text-[10px] font-mono text-[#A9ADA5] font-bold">80+</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('glossary')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Glossaire Technique Bilingue' : 'Bilingual Technical Glossary'}</span>
                  <span className="text-[10px] font-mono text-[#A9ADA5] font-bold">IEC 60050</span>
                </button>
                <div className="my-1 border-t border-[#567A87]/20" />
                <button
                  type="button"
                  onClick={() => navigateTo('laboratory')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Laboratoire Virtuel & Simulateurs' : 'Virtual Simulation Laboratory'}</span>
                  <span className="text-[10px] font-mono text-[#D7A64A] font-bold">LAB</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('reference-hub')}
                  className="w-full text-left px-3.5 py-2.5 text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#0B0F12]/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Abaques & Outils d’Étude' : 'Reference Tables & Study Tools'}</span>
                  <span className="text-[10px] font-mono text-[#A9ADA5] font-bold">REF</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. ABOUT EPEDE */}
          <a
            href="#/en/about"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('about');
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition-all select-none no-underline ${
              currentView === 'about'
                ? 'text-[#0B0F12] bg-[#D7A64A] font-bold shadow-sm'
                : 'text-[#F4F1E8] hover:text-[#D7A64A] hover:bg-[#151C1E] border border-transparent hover:border-[#567A87]/40'
            }`}
          >
            {locale === 'fr' ? 'À Propos' : 'About EPEDE'}
          </a>
        </nav>

        {/* Right Actions: Search + Language Switch + AI Guide */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A] text-[#F4F1E8] hover:text-[#D7A64A] transition-all text-xs font-mono cursor-pointer"
            title="Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-[#D7A64A]" />
            <span className="hidden lg:inline">{locale === 'fr' ? 'Rechercher' : 'Search'}</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-[#0B0F12] text-[#A9ADA5] rounded border border-[#567A87]/30">⌘K</kbd>
          </button>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => handleLocale(locale === 'fr' ? 'en' : 'fr')}
            className="px-2.5 py-1.5 rounded-xl bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A] text-[#F4F1E8] hover:text-[#D7A64A] text-xs font-mono font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            title={locale === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            {locale === 'en' ? 'EN · FR' : 'FR · EN'}
          </button>

          {/* AI Learning Guide trigger */}
          <button
            type="button"
            onClick={handleAssistant}
            className="px-3 py-1.5 rounded-xl bg-[#D7A64A]/15 hover:bg-[#D7A64A]/25 text-[#D7A64A] border border-[#D7A64A]/40 hover:border-[#D7A64A] transition-all hidden sm:flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs font-mono text-xs font-bold"
            title={locale === 'fr' ? 'Guide Pédagogique IA' : 'AI Learning Guide'}
            aria-label="AI Learning Guide"
          >
            <Bot className="h-4 w-4 text-[#D7A64A]" />
            <span>{locale === 'fr' ? 'Guide IA' : 'AI Guide'}</span>
          </button>

          {/* User Profile / Role Menu */}
          <div ref={userMenuRef} className="relative flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A] text-[#F4F1E8] transition-all text-xs cursor-pointer"
              title={locale === 'fr' ? 'Profil & Niveau d’apprentissage' : 'Learning Profile & Settings'}
            >
              {user ? (
                user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full object-cover border border-[#D7A64A]/50" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#D7A64A]/20 text-[#D7A64A] flex items-center justify-center font-bold text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#0B0F12] text-[#D7A64A] flex items-center justify-center font-bold text-[10px]">
                  <UserIcon className="h-3 w-3" />
                </div>
              )}
              <ChevronDown className="h-3 w-3 text-[#A9ADA5]" />
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
