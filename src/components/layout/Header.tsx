// src/components/layout/Header.tsx
// EPEDE ProCode Editorial Header (72px Desktop & Accessible Mobile Navigation + Grouped Searchable Library Panel)

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bot,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Check,
  Activity,
  Layers,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { CANONICAL_ROLES } from '../../types/engineeringRoles';
import { DOMAINS } from '../../data/epedeData';
import type { DomainCode } from '../../types/epede';
import { soundEffects } from '../../services/soundEffectsService';

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
  activeDomainCode?: DomainCode;
  onSelectDomain?: (code: DomainCode) => void;
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
  onMenuToggle,
  onToggleSidebar,
  currentView,
  onSelectDomain,
  onNavigateHome,
  onNavigateJourney,
  onNavigateDomains,
  onNavigateEquipment,
  onNavigateEquipmentReference,
  onNavigateStandards,
  onNavigateDiagrams,
  onNavigateCalculators,
  onNavigateCameroonGrid,
  onNavigateHydropower,
  onNavigateIndustrialProjects,
  onNavigateEngineersChain,
  onNavigateEcosystem,
  onNavigateArchitectures,
  onNavigateAssetManagement,
  onNavigate,
  onNavigateReferenceHub,
  onNavigateLaboratory,
  onNavigateGlossary,
  onNavigateAbout,
}) => {
  const isFr = locale === 'fr';
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const libraryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);

  const {
    user,
    activeRoleSlug,
    setActiveRoleSlug,
    signInWithGoogle,
    signOutUser,
    bookmarks,
    calculationNotes,
    sldAnnotations,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (libraryRef.current && !libraryRef.current.contains(event.target as Node)) {
        setLibraryOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLibraryOpen(false);
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (libraryOpen) {
      setTimeout(() => libraryInputRef.current?.focus(), 40);
    } else {
      setLibraryQuery('');
    }
  }, [libraryOpen]);

  const handleLocale = (l: 'fr' | 'en') => {
    soundEffects.playSwitchClick();
    if (onLocaleChange) onLocaleChange(l);
    else if (onToggleLocale) onToggleLocale(l);
  };

  const handleSearch = () => {
    soundEffects.playSwitchClick();
    setLibraryOpen(false);
    setMobileMenuOpen(false);
    if (onSearchClick) onSearchClick();
    else if (onOpenSearch) onOpenSearch();
  };

  const handleAssistant = () => {
    soundEffects.playSwitchClick();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onAIAssistantClick) onAIAssistantClick();
    else if (onOpenAssistant) onOpenAssistant();
  };

  const handleSidebarToggle = () => {
    soundEffects.playSwitchClick();
    setUserDropdownOpen(false);
    if (onMenuToggle) onMenuToggle();
    else if (onToggleSidebar) onToggleSidebar();
  };

  const navigateTo = (view: string) => {
    soundEffects.playSwitchClick();
    setLibraryOpen(false);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (view.startsWith('domain:')) {
      const code = view.split(':')[1] as DomainCode;
      if (onSelectDomain) {
        onSelectDomain(code);
        return;
      }
      window.location.hash = isFr ? `#/domaines/${code}` : `#/en/domains/${code}`;
      return;
    }
    if (onNavigate) {
      onNavigate(view);
    } else {
      switch (view) {
        case 'home': onNavigateHome?.(); break;
        case 'journey': onNavigateJourney?.(); break;
        case 'domains': onNavigateDomains?.(); break;
        case 'equipment-list':
        case 'equipment': onNavigateEquipment?.(); break;
        case 'equipment-reference': onNavigateEquipmentReference ? onNavigateEquipmentReference() : onNavigateEquipment?.(); break;
        case 'reference-hub': onNavigateReferenceHub?.(); break;
        case 'diagrams': onNavigateDiagrams?.(); break;
        case 'calculators': onNavigateCalculators?.(); break;
        case 'cameroon-grid': onNavigateCameroonGrid?.(); break;
        case 'standards': onNavigateStandards?.(); break;
        case 'hydropower': onNavigateHydropower?.(); break;
        case 'industrial-projects': onNavigateIndustrialProjects?.(); break;
        case 'engineers-chain': onNavigateEngineersChain?.(); break;
        case 'ecosystem': onNavigateEcosystem?.(); break;
        case 'architectures': onNavigateArchitectures?.(); break;
        case 'asset-management': onNavigateAssetManagement?.(); break;
        case 'laboratory': onNavigateLaboratory?.(); break;
        case 'glossary': onNavigateGlossary?.(); break;
        case 'about': onNavigateAbout?.(); break;
        default: onNavigateHome?.(); break;
      }
    }
  };

  const q = libraryQuery.trim().toLowerCase();
  const physicalDomains = DOMAINS.filter((d) => ['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].includes(d.code)).filter(
    (d) =>
      !q ||
      d.code.toLowerCase().includes(q) ||
      d.name_en.toLowerCase().includes(q) ||
      d.name_fr.toLowerCase().includes(q)
  );
  const transversalDomains = DOMAINS.filter((d) => !['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].includes(d.code)).filter(
    (d) =>
      !q ||
      d.code.toLowerCase().includes(q) ||
      d.name_en.toLowerCase().includes(q) ||
      d.name_fr.toLowerCase().includes(q)
  );

  const libraryWorkbenches = [
    {
      view: 'domains',
      code: 'D01–D16',
      label: isFr ? 'Répertoire complet des 16 domaines' : 'All 16 engineering domains directory',
    },
    {
      view: 'cameroon-grid',
      code: 'RIS/RIN',
      label: isFr ? 'Réseau électrique du Cameroun (RIS / RIN)' : 'Cameroon power grid (RIS / RIN)',
    },
    {
      view: 'calculators',
      code: '19 SOLVERS',
      label: isFr ? 'Calculateurs électrotechniques CEI/IEEE' : 'IEC / IEEE engineering calculators',
    },
    {
      view: 'simulation',
      code: '19 LABS',
      label: isFr ? 'Laboratoire de simulation numérique' : 'Simulation laboratory workbenches',
    },
    {
      view: 'diagrams',
      code: 'SLD',
      label: isFr ? 'Schémas unifilaires & postes HTB/HTA' : 'SLD & substation bay topologies',
    },
    {
      view: 'hydropower',
      code: 'HYDRO',
      label: isFr ? 'Complexe hydroélectrique & jumeau' : 'Hydropower water-to-wire suite',
    },
    {
      view: 'standards',
      code: 'IEC/IEEE',
      label: isFr ? 'Normes internationales & conformité' : 'International standards reference',
    },
    {
      view: 'regulatory',
      code: 'LAW/CODE',
      label: isFr ? 'Cadre réglementaire & Code réseau' : 'Regulatory & grid code observatory',
    },
    {
      view: 'glossary',
      code: 'IEC 60050',
      label: isFr ? 'Glossaire électrotechnique bilingue' : 'Bilingual electrotechnical glossary',
    },
  ].filter(
    (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
  );

  const isLibraryActive = [
    'domains',
    'domain',
    'cameroon-grid',
    'standards',
    'glossary',
    'diagrams',
    'laboratory',
    'simulation',
    'calculators',
    'reference-hub',
    'regulatory',
    'hydropower',
  ].includes(currentView);

  return (
    <>
      {/* Top 2px Continuous Scroll Progress Indicator */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[2px] z-[60] bg-[#147C78] transition-[width] duration-150 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        id="epede-minimal-header"
        className={`fixed top-0 inset-x-0 z-50 h-[72px] transition-colors duration-200 ${
          isScrolled || mobileMenuOpen || libraryOpen
            ? 'bg-[#FFFDF9]/94 border-b border-[#E4E0D5] backdrop-blur-md'
            : 'bg-[#F6F4EE]/82 border-b border-transparent backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href={isFr ? '#/' : '#/en/'}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('home');
              }
            }}
            className="inline-flex items-center gap-2.5 text-[#17282C] font-extrabold text-[19px] tracking-[-0.03em] no-underline shrink-0"
          >
            <span className="w-7 h-7 rounded-[7px] bg-[#17282C] text-[#F6F4EE] grid place-items-center text-sm font-extrabold">
              E
            </span>
            <span>EPEDE</span>
          </a>

          {/* Primary Desktop Navigation (7 Concise Items) */}
          <nav
            aria-label={isFr ? 'Navigation principale' : 'Primary'}
            className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-semibold"
          >
            <a
              href={isFr ? '#/' : '#/en/'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('home');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'home' ? 'text-[#147C78] font-bold' : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'Accueil' : 'Home'}
            </a>

            <a
              href={isFr ? '#/apprendre' : '#/en/learn'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('thematic-journeys');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'thematic-journeys' || currentView === 'scenarios'
                  ? 'text-[#147C78] font-bold'
                  : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'Apprendre' : 'Learn'}
            </a>

            <a
              href={isFr ? '#/systemes-electriques' : '#/en/electrical-systems'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('journey');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'journey' || currentView === 'follow-the-energy'
                  ? 'text-[#147C78] font-bold'
                  : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'Systèmes électriques' : 'Electrical Systems'}
            </a>

            <a
              href={isFr ? '#/materiel' : '#/en/equipment'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('equipment-list');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'equipment-list' ||
                currentView === 'equipment' ||
                currentView === 'equipment-reference'
                  ? 'text-[#147C78] font-bold'
                  : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'Équipements' : 'Equipment'}
            </a>

            <a
              href={isFr ? '#/genie-industriel' : '#/en/industrial-engineering'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('industrial-projects');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'industrial-projects'
                  ? 'text-[#147C78] font-bold'
                  : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'Ingénierie industrielle' : 'Industrial Engineering'}
            </a>

            {/* Grouped, Searchable Library Panel Trigger */}
            <div ref={libraryRef} className="relative">
              <button
                type="button"
                aria-expanded={libraryOpen}
                aria-haspopup="dialog"
                onClick={() => setLibraryOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 py-2 bg-transparent border-0 cursor-pointer transition-colors ${
                  isLibraryActive || libraryOpen
                    ? 'text-[#147C78] font-bold'
                    : 'text-[#17282C] hover:text-[#147C78]'
                }`}
              >
                <span>{isFr ? 'Bibliothèque' : 'Library'}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    libraryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {libraryOpen && (
                <div
                  role="dialog"
                  aria-label={isFr ? 'Bibliothèque technique EPEDE' : 'EPEDE Engineering Library'}
                  className="fixed left-1/2 -translate-x-1/2 top-[72px] w-[min(1120px,calc(100vw-32px))] max-h-[calc(100vh-92px)] overflow-y-auto bg-[#FFFDF9] border border-[#DEDACF] shadow-[0_24px_60px_rgba(23,40,44,0.14)] p-6 sm:p-8 z-50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#DEDACF]">
                    <div className="flex-1 min-w-[240px]">
                      <label
                        htmlFor="epede-library-filter"
                        className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#5C6C70] mb-1.5"
                      >
                        {isFr
                          ? 'FILTRER LES DOMAINES D01–D16, LE RÉSEAU CAMEROUNAIS ET LES OUTILS'
                          : 'FILTER DOMAINS D01–D16, CAMEROON GRID AND WORKBENCHES'}
                      </label>
                      <input
                        ref={libraryInputRef}
                        id="epede-library-filter"
                        type="search"
                        value={libraryQuery}
                        onChange={(e) => setLibraryQuery(e.target.value)}
                        placeholder={
                          isFr
                            ? 'ex. D04, postes, protection, calculateurs, Cameroun…'
                            : 'e.g. D04, substations, protection, calculators, Cameroon…'
                        }
                        className="w-full h-11 px-3.5 bg-[#F6F4EE] border border-[#CFCABD] text-[#17282C] text-sm font-medium focus:outline-none focus:border-[#147C78]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo('domains')}
                        className="h-11 px-4 bg-[#147C78] hover:bg-[#0E5E5B] text-[#FFFDF9] font-bold text-xs rounded-full border-0 cursor-pointer"
                      >
                        {isFr ? 'Ouvrir l’index D01–D16 →' : 'Open full D01–D16 directory →'}
                      </button>
                      <button
                        type="button"
                        aria-label={isFr ? 'Fermer la bibliothèque' : 'Close library'}
                        onClick={() => setLibraryOpen(false)}
                        className="h-11 w-11 grid place-items-center border border-[#DEDACF] bg-transparent text-[#17282C] hover:border-[#17282C] rounded-full cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    {/* Column 1: Physical Chain D01-D06 */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#147C78] mb-3">
                        {isFr ? '01 · CHAÎNE PHYSIQUE (D01–D06)' : '01 · PHYSICAL POWER CHAIN (D01–D06)'}
                      </div>
                      <div className="border-t border-[#17282C]">
                        {physicalDomains.map((d) => (
                          <button
                            key={d.code}
                            type="button"
                            onClick={() => navigateTo(`domain:${d.code}`)}
                            className="w-full text-left py-2.5 px-2 border-b border-[#EEEAE0] bg-transparent hover:bg-[#F6F4EE] flex items-baseline justify-between gap-3 cursor-pointer"
                          >
                            <span className="text-sm font-semibold text-[#17282C]">
                              <span className="font-mono text-xs text-[#B8872D] mr-2">{d.code}</span>
                              {isFr ? d.name_fr : d.name_en}
                            </span>
                            <span className="text-[#147C78] text-xs shrink-0">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Transversal & Protection D07-D16 */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#147C78] mb-3">
                        {isFr
                          ? '02 · DISCIPLINES TRANSVERSALES & SÉCURITÉ (D07–D16)'
                          : '02 · TRANSVERSAL, PROTECTION & SAFETY (D07–D16)'}
                      </div>
                      <div className="border-t border-[#17282C] max-h-[340px] overflow-y-auto">
                        {transversalDomains.map((d) => (
                          <button
                            key={d.code}
                            type="button"
                            onClick={() => navigateTo(`domain:${d.code}`)}
                            className="w-full text-left py-2 px-2 border-b border-[#EEEAE0] bg-transparent hover:bg-[#F6F4EE] flex items-baseline justify-between gap-3 cursor-pointer"
                          >
                            <span className="text-sm font-semibold text-[#17282C]">
                              <span className="font-mono text-xs text-[#B8872D] mr-2">{d.code}</span>
                              {isFr ? d.name_fr : d.name_en}
                            </span>
                            <span className="text-[#147C78] text-xs shrink-0">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Grid, Workbenches & Standards */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#147C78] mb-3">
                        {isFr
                          ? '03 · RÉSEAU CAMEROUN, ATELIERS & NORMES'
                          : '03 · CAMEROON GRID, WORKBENCHES & STANDARDS'}
                      </div>
                      <div className="border-t border-[#17282C]">
                        {libraryWorkbenches.map((item) => (
                          <button
                            key={item.view}
                            type="button"
                            onClick={() => navigateTo(item.view)}
                            className="w-full text-left py-2.5 px-2 border-b border-[#EEEAE0] bg-transparent hover:bg-[#F6F4EE] flex items-baseline justify-between gap-3 cursor-pointer"
                          >
                            <span className="text-sm font-semibold text-[#17282C]">{item.label}</span>
                            <span className="font-mono text-[11px] text-[#5C6C70] shrink-0">
                              {item.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href={isFr ? '#/a-propos' : '#/en/about'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('about');
                }
              }}
              className={`no-underline py-2 transition-colors ${
                currentView === 'about'
                  ? 'text-[#147C78] font-bold'
                  : 'text-[#17282C] hover:text-[#147C78]'
              }`}
            >
              {isFr ? 'À propos' : 'About'}
            </a>
          </nav>

          {/* Right Controls: Search, EN/FR, Profile, Enter EPEDE, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSearch}
              aria-label={isFr ? 'Rechercher' : 'Search'}
              className="h-11 px-3 border-0 bg-transparent text-[#17282C] hover:text-[#147C78] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Search className="h-4 w-4 text-[#17282C]" />
              <span className="hidden sm:inline">{isFr ? 'Rechercher' : 'Search'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLocale(locale === 'fr' ? 'en' : 'fr')}
              aria-label={isFr ? 'Passer en anglais' : 'Switch language to French'}
              className="h-11 px-2.5 border-0 bg-transparent font-mono text-[13px] text-[#5C6C70] hover:text-[#17282C] cursor-pointer"
            >
              {locale === 'en' ? 'EN · fr' : 'FR · en'}
            </button>

            {/* Restrained Profile / Settings Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-label={isFr ? 'Profil et outils' : 'Profile and settings'}
                aria-expanded={userDropdownOpen}
                className="h-11 w-11 rounded-full border border-[#D8D4C8] bg-[#FFFDF9] text-[#17282C] hover:border-[#17282C] inline-flex items-center justify-center cursor-pointer"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-4 w-4 text-[#17282C]" />
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#FFFDF9] border border-[#DEDACF] shadow-[0_20px_50px_rgba(23,40,44,0.15)] p-4 z-50 text-xs space-y-3.5">
                  <div className="pb-3 border-b border-[#EEEAE0] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#17282C] text-sm">
                        {user
                          ? user.displayName || 'Engineer'
                          : isFr
                          ? 'Session Ingénieur'
                          : 'Engineer Workspace'}
                      </div>
                      <div className="text-[11px] text-[#5C6C70] font-mono">
                        {user ? user.email : isFr ? 'Stockage local actif' : 'Local study storage active'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSidebarToggle}
                      className="h-9 px-2.5 border border-[#DEDACF] bg-[#F6F4EE] text-[#17282C] font-mono text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PanelLeftOpen className="h-3.5 w-3.5" />
                      <span>{isFr ? 'Volet' : 'Index'}</span>
                    </button>
                  </div>

                  {/* Saved Studies / Bookmarks / SLD Topologies */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => navigateTo('calculators')}
                      className="p-2.5 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] cursor-pointer"
                    >
                      <div className="font-mono font-bold text-sm text-[#147C78]">
                        {calculationNotes.length}
                      </div>
                      <div className="text-[11px] text-[#5C6C70]">
                        {isFr ? 'Études' : 'Studies'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('equipment-list')}
                      className="p-2.5 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] cursor-pointer"
                    >
                      <div className="font-mono font-bold text-sm text-[#17282C]">
                        {bookmarks.length}
                      </div>
                      <div className="text-[11px] text-[#5C6C70]">
                        {isFr ? 'Signets' : 'Saved'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('diagrams')}
                      className="p-2.5 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] cursor-pointer"
                    >
                      <div className="font-mono font-bold text-sm text-[#B8872D]">
                        {Object.keys(sldAnnotations).length}
                      </div>
                      <div className="text-[11px] text-[#5C6C70]">SLD</div>
                    </button>
                  </div>

                  {/* Active Engineering Role */}
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#5C6C70] mb-1.5">
                      {isFr ? 'RÔLE D’INGÉNIERIE ACTIF' : 'ACTIVE ENGINEERING ROLE'}
                    </div>
                    <div className="max-h-40 overflow-y-auto border-t border-[#EEEAE0]">
                      {CANONICAL_ROLES.map((r) => {
                        const isSelected = r.slug === activeRoleSlug;
                        return (
                          <button
                            key={r.slug}
                            type="button"
                            onClick={() => setActiveRoleSlug(r.slug)}
                            className={`w-full flex items-center justify-between py-2 px-2 border-b border-[#EEEAE0] text-left cursor-pointer ${
                              isSelected ? 'bg-[#E3EFEC] text-[#17282C] font-bold' : 'bg-transparent text-[#33474B]'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-[11px] text-[#147C78] mr-1.5">
                                {r.domain_code}
                              </span>
                              {isFr ? r.name_fr : r.name_en}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#147C78] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Assistant & Studio Links */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAssistant}
                      className="w-full h-10 px-3 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] text-[#17282C] font-semibold inline-flex items-center justify-between cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Bot className="h-4 w-4 text-[#147C78]" />
                        {isFr ? 'Guide pédagogique IA' : 'AI Engineering Guide'}
                      </span>
                      <span className="text-[#147C78]">→</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('protection')}
                        className="h-9 px-2.5 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] text-[#17282C] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Activity className="h-3.5 w-3.5 text-[#147C78]" />
                        <span>Protection</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo('commissioning')}
                        className="h-9 px-2.5 bg-[#F6F4EE] border border-[#DEDACF] hover:border-[#147C78] text-[#17282C] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="h-3.5 w-3.5 text-[#B8872D]" />
                        <span>FAT / SAT</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EEEAE0]">
                    {user ? (
                      <button
                        type="button"
                        onClick={() => {
                          signOutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full h-10 border border-[#DEDACF] bg-transparent text-[#B91C1C] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>{isFr ? 'Déconnexion' : 'Sign Out'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          signInWithGoogle();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full h-10 bg-[#17282C] text-[#F6F4EE] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer border-0"
                      >
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>{isFr ? 'Synchronisation Google' : 'Google Cloud Sync'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Restrained Secondary Pill CTA on Desktop */}
            <a
              href={isFr ? '#/systemes-electriques' : '#/en/electrical-systems'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  navigateTo('journey');
                }
              }}
              className="hidden xl:inline-flex h-10 px-4 border border-[#17282C] rounded-full text-[#17282C] hover:bg-[#17282C] hover:text-[#F6F4EE] text-[13px] font-bold items-center no-underline transition-colors"
            >
              {isFr ? 'Entrer dans EPEDE' : 'Enter EPEDE'}
            </a>

            {/* Mobile Menu Toggle Button (Explicit Label + >=44px Target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? isFr
                    ? 'Fermer le menu'
                    : 'Close navigation menu'
                  : isFr
                  ? 'Ouvrir le menu'
                  : 'Open navigation menu'
              }
              className="lg:hidden h-11 px-4 border border-[#D8D4C8] rounded-full bg-[#FFFDF9] text-[#17282C] text-sm font-bold cursor-pointer"
            >
              {mobileMenuOpen ? (isFr ? 'Fermer' : 'Close') : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Navigation Sheet */}
        {mobileMenuOpen && (
          <nav
            aria-label={isFr ? 'Menu mobile' : 'Mobile'}
            className="lg:hidden bg-[#FFFDF9] border-b border-[#E4E0D5] px-5 pt-2 pb-6 max-h-[calc(100vh-72px)] overflow-y-auto flex flex-col"
          >
            {[
              { label: isFr ? 'Accueil' : 'Home', view: 'home', href: isFr ? '#/' : '#/en/' },
              {
                label: isFr ? 'Apprendre (8 parcours)' : 'Learn',
                view: 'thematic-journeys',
                href: isFr ? '#/apprendre' : '#/en/learn',
              },
              {
                label: isFr ? 'Systèmes électriques (9 étapes)' : 'Electrical Systems',
                view: 'journey',
                href: isFr ? '#/systemes-electriques' : '#/en/electrical-systems',
              },
              {
                label: isFr ? 'Équipements (39 fiches)' : 'Equipment',
                view: 'equipment-list',
                href: isFr ? '#/materiel' : '#/en/equipment',
              },
              {
                label: isFr ? 'Ingénierie industrielle' : 'Industrial Engineering',
                view: 'industrial-projects',
                href: isFr ? '#/genie-industriel' : '#/en/industrial-engineering',
              },
              {
                label: isFr ? 'Bibliothèque D01–D16' : 'Library (D01–D16)',
                view: 'domains',
                href: isFr ? '#/domaines' : '#/en/domains',
              },
              {
                label: isFr ? 'Réseau électrique du Cameroun' : 'Cameroon Grid (RIS/RIN)',
                view: 'cameroon-grid',
                href: isFr ? '#/reseau-cameroun' : '#/en/cameroon-grid',
              },
              {
                label: isFr ? 'Calculateurs électrotechniques' : 'Calculators (19 solvers)',
                view: 'calculators',
                href: isFr ? '#/calculateurs' : '#/en/calculators',
              },
              {
                label: isFr ? 'Laboratoire de simulation' : 'Simulation Lab',
                view: 'simulation',
                href: '#/simulation',
              },
              {
                label: isFr ? 'Schémas unifilaires & postes' : 'SLD & Substations',
                view: 'diagrams',
                href: '#/diagrams',
              },
              {
                label: isFr ? 'Normes & Réglementation' : 'Standards & Regulatory',
                view: 'standards',
                href: isFr ? '#/normes' : '#/en/standards',
              },
              {
                label: isFr ? 'À propos d’EPEDE' : 'About',
                view: 'about',
                href: isFr ? '#/a-propos' : '#/en/about',
              },
            ].map((item) => (
              <a
                key={item.view}
                href={item.href}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    navigateTo(item.view);
                  }
                }}
                className="min-h-[52px] flex items-center justify-between border-b border-[#EEEAE0] text-[#17282C] text-[17px] font-semibold no-underline"
              >
                <span>{item.label}</span>
                <span className="text-[#147C78]">→</span>
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};
