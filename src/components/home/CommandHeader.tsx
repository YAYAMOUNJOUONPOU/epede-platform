// src/components/home/CommandHeader.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Sparkles, 
  Zap, 
  ArrowRight,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface CommandHeaderProps {
  locale: 'fr' | 'en';
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  isReducedMotion?: boolean;
  onToggleMotion?: () => void;
  onOpenSearch: (query?: string) => void;
  onExploreSystem?: () => void;
}

const SEARCH_EXAMPLES = [
  { fr: 'Transformateur 225 kV', en: '225 kV transformer', query: 'transformer' },
  { fr: 'Protection différentielle 87T', en: '87T differential protection', query: '87T' },
  { fr: 'TGBT & Schéma TT/TN', en: 'TGBT & Earthing', query: 'TGBT' },
  { fr: 'Alternateur hydroélectrique', en: 'hydroelectric generator', query: 'generator' },
  { fr: 'Régime de neutre', en: 'earthing system', query: 'earthing' },
  { fr: 'CEI 61850 & GOOSE', en: 'IEC 61850 & GOOSE', query: 'IEC 61850' },
  { fr: 'Cellule RMU 36 kV', en: 'RMU 36 kV switchgear', query: 'RMU' },
  { fr: 'Chute de tension & Icc', en: 'voltage drop & Icc', query: 'voltage drop' },
];

export const CommandHeader: React.FC<CommandHeaderProps> = ({
  locale,
  onOpenSearch,
  onExploreSystem,
}) => {
  const [localInput, setLocalInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch(localInput.trim());
  };

  return (
    <div 
      id="engineering-search-dock" 
      aria-label="Engineering Command Palette & Search"
      className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 border border-slate-800/90 shadow-xl overflow-hidden font-sans"
    >
      {/* Search Input Bar */}
      <div className="p-4 sm:p-6 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="h-4 w-4 text-amber-400" />
            <span className="font-bold uppercase tracking-wider text-slate-200">
              {locale === 'fr' ? 'CONSOLE DE RECHERCHE CAD & INGÉNIERIE' : 'CAD & ENGINEERING SEARCH CONSOLE'}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px]">
              CEI / IEEE
            </span>
          </div>
          {onExploreSystem && (
            <button
              type="button"
              onClick={onExploreSystem}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium text-[11px]"
            >
              <span>{locale === 'fr' ? 'Parcours complet' : 'Full Journey'}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-amber-400 pointer-events-none flex items-center gap-1.5">
              <span className="font-mono text-sm text-amber-400 font-bold">&gt;_</span>
            </div>
            
            <input
              id="home-command-palette-input"
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onFocus={() => onOpenSearch(localInput)}
              placeholder={
                locale === 'fr'
                  ? 'Rechercher systèmes, équipements, protections, normes CEI, formules, postes...'
                  : 'Search power systems, equipment, protection relays, IEC standards, formulas...'
              }
              className="w-full pl-11 sm:pl-14 pr-24 sm:pr-28 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-slate-100 placeholder-slate-400 font-mono text-xs sm:text-sm rounded-xl border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 transition-all outline-none"
            />

            <div className="absolute right-2.5 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-700/90 text-slate-300 font-mono text-[10px] border border-slate-600/80 font-bold">
                Ctrl+K
              </kbd>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{locale === 'fr' ? 'Chercher' : 'Search'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Parametric Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
              {locale === 'fr' ? 'Requêtes techniques rapides :' : 'Quick engineering queries:'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5">
            {SEARCH_EXAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenSearch(item.query)}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center gap-1 active:scale-[0.98]"
              >
                <span className="text-amber-400 text-[10px]">#</span>
                <span>{locale === 'fr' ? item.fr : item.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

