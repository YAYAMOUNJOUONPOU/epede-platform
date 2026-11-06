// src/components/layout/Header.tsx
// EPEDE Sitewide Fixed Header (68px Desktop & Accessible Mobile Navigation + Grouped Searchable Library Panel)
// Follows SITEWIDE-REDESIGN.md and HOMEPAGE-EXACT-MATCH.md porcelain-and-navy specification.

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
      setIsScrolled(y > 20);
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
      {/* Top Accessible Skip Link */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const mainEl = document.getElementById('main-content');
          if (mainEl) {
            mainEl.focus();
            mainEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-[#0B1B2B] focus:text-[#FBFCFD] focus:font-mono focus:text-xs focus:font-semibold focus:rounded-[4px] focus:shadow-lg"
      >
        {isFr ? 'Aller au contenu principal' : 'Skip to main content'}
      </a>

      {/* Top Amber Continuous Scroll Progress Indicator */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[2px] z-[60] bg-[#F2A541] transition-[width] duration-150 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        id="epede-sitewide-header"
        className={`fixed top-0 inset-x-0 z-50 h-[68px] transition-colors duration-200 ${
          isScrolled || mobileMenuOpen || libraryOpen
            ? 'bg-[#FBFCFD]/95 border-b border-[#D5E0E8] backdrop-blur-md shadow-[0_2px_12px_rgba(11,27,43,0.04)]'
            : 'bg-[#FBFCFD]/85 border-b border-[#D5E0E8]/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1360px] mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href={isFr ? '#/' : '#/en/'}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                navigateTo('home');
              }
            }}
            className="inline-flex items-center gap-2.5 text-[#0B1B2B] font-bold text-[20px] tracking-[-0.03em] no-underline shrink-0"
          >
            <span className="w-7 h-7 rounded-[6px] bg-[#0B1B2B] text-[#FBFCFD] grid place-items-center text-sm font-bold">
              E
            </span>
            <span className="font-['Space_Grotesk']">EPEDE</span>
          </a>

          {/* Primary Desktop Navigation */}
          <nav
            aria-label={isFr ? 'Navigation principale' : 'Primary'}
            className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-medium font-['Space_Grotesk']"
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
                currentView === 'home' ? 'text-[#1F5FAE] font-bold' : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                  ? 'text-[#1F5FAE] font-bold'
                  : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                  ? 'text-[#1F5FAE] font-bold'
                  : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                  ? 'text-[#1F5FAE] font-bold'
                  : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                  ? 'text-[#1F5FAE] font-bold'
                  : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                    ? 'text-[#1F5FAE] font-bold'
                    : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
                  className="fixed left-1/2 -translate-x-1/2 top-[68px] w-[min(1160px,calc(100vw-32px))] max-h-[calc(100vh-88px)] overflow-y-auto bg-[#FBFCFD] border border-[#D5E0E8] shadow-[0_24px_60px_rgba(11,27,43,0.14)] p-6 sm:p-8 z-50 rounded-b-[8px]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#D5E0E8]">
                    <div className="flex-1 min-w-[240px]">
                      <label
                        htmlFor="epede-library-filter"
                        className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#5B6B7B] mb-1.5"
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
                        className="w-full h-11 px-3.5 bg-[#EEF4F8] border border-[#D5E0E8] text-[#0B1B2B] text-sm font-medium rounded-[4px] focus:outline-none focus:border-[#1F5FAE]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo('domains')}
                        className="h-11 px-4 bg-[#0B1B2B] hover:bg-[#1F5FAE] text-white font-bold text-xs rounded-full border-0 cursor-pointer transition-colors"
                      >
                        {isFr ? 'Ouvrir l’index D01–D16 →' : 'Open full D01–D16 directory →'}
                      </button>
                      <button
                        type="button"
                        aria-label={isFr ? 'Fermer la bibliothèque' : 'Close library'}
                        onClick={() => setLibraryOpen(false)}
                        className="h-11 w-11 grid place-items-center border border-[#D5E0E8] bg-transparent text-[#0B1B2B] hover:border-[#0B1B2B] rounded-full cursor-pointer transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    {/* Column 1: Physical Chain D01-D06 */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#1F5FAE] mb-3">
                        {isFr ? '01 · CHAÎNE PHYSIQUE (D01–D06)' : '01 · PHYSICAL POWER CHAIN (D01–D06)'}
                      </div>
                      <div className="border-t border-[#0B1B2B]">
                        {physicalDomains.map((d) => (
                          <button
                            key={d.code}
                            type="button"
                            onClick={() => navigateTo(`domain:${d.code}`)}
                            className="w-full text-left py-2.5 px-2 border-b border-[#D5E0E8]/70 bg-transparent hover:bg-[#EEF4F8] flex items-baseline justify-between gap-3 cursor-pointer transition-colors"
                          >
                            <span className="text-sm font-semibold text-[#0B1B2B]">
                              <span className="font-mono text-xs text-[#1F5FAE] mr-2">{d.code}</span>
                              {isFr ? d.name_fr : d.name_en}
                            </span>
                            <span className="text-[#1F5FAE] text-xs shrink-0">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Transversal & Protection D07-D16 */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#1F5FAE] mb-3">
                        {isFr
                          ? '02 · DISCIPLINES TRANSVERSALES & SÉCURITÉ (D07–D16)'
                          : '02 · TRANSVERSAL, PROTECTION & SAFETY (D07–D16)'}
                      </div>
                      <div className="border-t border-[#0B1B2B] max-h-[340px] overflow-y-auto">
                        {transversalDomains.map((d) => (
                          <button
                            key={d.code}
                            type="button"
                            onClick={() => navigateTo(`domain:${d.code}`)}
                            className="w-full text-left py-2 px-2 border-b border-[#D5E0E8]/70 bg-transparent hover:bg-[#EEF4F8] flex items-baseline justify-between gap-3 cursor-pointer transition-colors"
                          >
                            <span className="text-sm font-semibold text-[#0B1B2B]">
                              <span className="font-mono text-xs text-[#1F5FAE] mr-2">{d.code}</span>
                              {isFr ? d.name_fr : d.name_en}
                            </span>
                            <span className="text-[#1F5FAE] text-xs shrink-0">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Grid, Workbenches & Standards */}
                    <div>
                      <div className="font-mono text-xs tracking-[0.08em] uppercase text-[#1F5FAE] mb-3">
                        {isFr
                          ? '03 · RÉSEAU CAMEROUN, ATELIERS & NORMES'
                          : '03 · CAMEROON GRID, WORKBENCHES & STANDARDS'}
                      </div>
                      <div className="border-t border-[#0B1B2B]">
                        {libraryWorkbenches.map((item) => (
                          <button
                            key={item.view}
                            type="button"
                            onClick={() => navigateTo(item.view)}
                            className="w-full text-left py-2.5 px-2 border-b border-[#D5E0E8]/70 bg-transparent hover:bg-[#EEF4F8] flex items-baseline justify-between gap-3 cursor-pointer transition-colors"
                          >
                            <span className="text-sm font-semibold text-[#0B1B2B]">{item.label}</span>
                            <span className="font-mono text-[11px] text-[#5B6B7B] shrink-0">
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
                  ? 'text-[#1F5FAE] font-bold'
                  : 'text-[#3A4B5C] hover:text-[#1F5FAE]'
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
              className="h-10 px-3 border-0 bg-transparent text-[#0B1B2B] hover:text-[#1F5FAE] text-sm font-medium inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Search className="h-4 w-4 text-[#0B1B2B]" />
              <span className="hidden sm:inline">{isFr ? 'Rechercher' : 'Search'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLocale(locale === 'fr' ? 'en' : 'fr')}
              aria-label={isFr ? 'Passer en anglais' : 'Switch language to French'}
              className="h-10 px-2.5 border-0 bg-transparent font-mono text-[13px] text-[#5B6B7B] hover:text-[#0B1B2B] cursor-pointer transition-colors"
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
                className="h-10 w-10 rounded-full border border-[#D5E0E8] bg-[#FBFCFD] text-[#0B1B2B] hover:border-[#0B1B2B] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-4 w-4 text-[#0B1B2B]" />
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#FBFCFD] border border-[#D5E0E8] shadow-[0_20px_50px_rgba(11,27,43,0.15)] p-4 z-50 text-xs space-y-3.5 rounded-[6px]">
                  <div className="pb-3 border-b border-[#D5E0E8] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0B1B2B] text-sm">
                        {user
                          ? user.displayName || 'Engineer'
                          : isFr
                          ? 'Session Ingénieur'
                          : 'Engineer Workspace'}
                      </div>
                      <div className="text-[11px] text-[#5B6B7B] font-mono">
                        {user ? user.email : isFr ? 'Stockage local actif' : 'Local study storage active'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSidebarToggle}
                      className="h-8 px-2.5 border border-[#D5E0E8] bg-[#EEF4F8] text-[#0B1B2B] font-mono text-[11px] inline-flex items-center gap-1.5 cursor-pointer rounded-[4px] hover:border-[#0B1B2B]"
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
                      className="p-2.5 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] cursor-pointer rounded-[4px] transition-colors"
                    >
                      <div className="font-mono font-bold text-sm text-[#1F5FAE]">
                        {calculationNotes.length}
                      </div>
                      <div className="text-[11px] text-[#5B6B7B]">
                        {isFr ? 'Études' : 'Studies'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('equipment-list')}
                      className="p-2.5 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] cursor-pointer rounded-[4px] transition-colors"
                    >
                      <div className="font-mono font-bold text-sm text-[#0B1B2B]">
                        {bookmarks.length}
                      </div>
                      <div className="text-[11px] text-[#5B6B7B]">
                        {isFr ? 'Signets' : 'Saved'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('diagrams')}
                      className="p-2.5 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] cursor-pointer rounded-[4px] transition-colors"
                    >
                      <div className="font-mono font-bold text-sm text-[#F2A541]">
                        {Object.keys(sldAnnotations).length}
                      </div>
                      <div className="text-[11px] text-[#5B6B7B]">SLD</div>
                    </button>
                  </div>

                  {/* Active Engineering Role */}
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#5B6B7B] mb-1.5">
                      {isFr ? 'RÔLE D’INGÉNIERIE ACTIF' : 'ACTIVE ENGINEERING ROLE'}
                    </div>
                    <div className="max-h-40 overflow-y-auto border-t border-[#D5E0E8]">
                      {CANONICAL_ROLES.map((r) => {
                        const isSelected = r.slug === activeRoleSlug;
                        return (
                          <button
                            key={r.slug}
                            type="button"
                            onClick={() => setActiveRoleSlug(r.slug)}
                            className={`w-full flex items-center justify-between py-2 px-2 border-b border-[#D5E0E8]/70 text-left cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#EEF4F8] text-[#1F5FAE] font-bold' : 'bg-transparent text-[#3A4B5C] hover:bg-[#EEF4F8]'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-[11px] text-[#1F5FAE] mr-1.5">
                                {r.domain_code}
                              </span>
                              {isFr ? r.name_fr : r.name_en}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#1F5FAE] shrink-0" />}
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
                      className="w-full h-9 px-3 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] text-[#0B1B2B] font-semibold inline-flex items-center justify-between cursor-pointer rounded-[4px] transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Bot className="h-4 w-4 text-[#1F5FAE]" />
                        {isFr ? 'Guide pédagogique IA' : 'AI Engineering Guide'}
                      </span>
                      <span className="text-[#1F5FAE]">→</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('protection')}
                        className="h-8 px-2.5 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] text-[#0B1B2B] font-semibold inline-flex items-center gap-1.5 cursor-pointer rounded-[4px] transition-colors"
                      >
                        <Activity className="h-3.5 w-3.5 text-[#1F5FAE]" />
                        <span>Protection</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo('commissioning')}
                        className="h-8 px-2.5 bg-[#EEF4F8] border border-[#D5E0E8] hover:border-[#1F5FAE] text-[#0B1B2B] font-semibold inline-flex items-center gap-1.5 cursor-pointer rounded-[4px] transition-colors"
                      >
                        <Layers className="h-3.5 w-3.5 text-[#F2A541]" />
                        <span>FAT / SAT</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D5E0E8]">
                    {user ? (
                      <button
                        type="button"
                        onClick={() => {
                          signOutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full h-9 border border-[#D5E0E8] bg-transparent text-[#B91C1C] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer rounded-[4px] hover:border-[#B91C1C] transition-colors"
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
                        className="w-full h-9 bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#FBFCFD] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer border-0 rounded-[4px] transition-colors"
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
              className="hidden xl:inline-flex h-9 px-4 border border-[#0B1B2B] rounded-full text-[#0B1B2B] hover:bg-[#0B1B2B] hover:text-[#FBFCFD] text-[13px] font-bold items-center no-underline transition-colors"
            >
              {isFr ? 'Entrer dans EPEDE' : 'Enter EPEDE'}
            </a>

            {/* Mobile Menu Toggle Button */}
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
              className="lg:hidden h-10 px-3.5 border border-[#D5E0E8] rounded-full bg-[#FBFCFD] text-[#0B1B2B] text-sm font-bold cursor-pointer hover:border-[#0B1B2B] transition-colors"
            >
              {mobileMenuOpen ? (isFr ? 'Fermer' : 'Close') : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Navigation Sheet */}
        {mobileMenuOpen && (
          <nav
            aria-label={isFr ? 'Menu mobile' : 'Mobile'}
            className="lg:hidden bg-[#FBFCFD] border-b border-[#D5E0E8] px-5 pt-2 pb-6 max-h-[calc(100vh-68px)] overflow-y-auto flex flex-col shadow-lg"
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
                className="min-h-[50px] flex items-center justify-between border-b border-[#D5E0E8]/70 text-[#0B1B2B] text-[16px] font-medium no-underline hover:text-[#1F5FAE] transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-[#1F5FAE]">→</span>
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};
