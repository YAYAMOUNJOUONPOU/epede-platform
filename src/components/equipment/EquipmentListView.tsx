// src/components/equipment/EquipmentListView.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { EQUIPMENT_ITEMS } from '../../data/epedeData';
import { SafetyBadge } from './SafetyBadge';
import { VoltageIndicator } from '../ui/VoltageIndicator';
import { 
  ArrowRight, 
  Filter, 
  ShieldAlert, 
  Search, 
  Scale, 
  CheckSquare, 
  Square, 
  X, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import type { DomainCode, Equipment } from '../../types/epede';
import { EquipmentComparisonModal } from './EquipmentComparisonModal';

interface EquipmentListViewProps {
  locale: 'fr' | 'en';
  onSelectEquipment: (id: string) => void;
  onSelectDomain: (code: DomainCode) => void;
  initialSelectedForComparison?: string[];
}

export const EquipmentListView: React.FC<EquipmentListViewProps> = ({
  locale,
  onSelectEquipment,
  onSelectDomain,
  initialSelectedForComparison,
}) => {
  const [filterVoltage, setFilterVoltage] = useState<string>('ALL');
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [filterSafetyOnly, setFilterSafetyOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(() => {
    return initialSelectedForComparison && initialSelectedForComparison.length > 0
      ? initialSelectedForComparison.slice(0, 3)
      : [];
  });
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialSelectedForComparison && initialSelectedForComparison.length > 0) {
      setSelectedForComparison((prev) => {
        return Array.from(new Set([...prev, ...initialSelectedForComparison])).slice(0, 3);
      });
    }
  }, [initialSelectedForComparison]);

  // Domains represented in equipment list
  const availableDomains = useMemo(() => {
    const set = new Set(EQUIPMENT_ITEMS.map((eq) => eq.domain_code));
    return ['ALL', ...Array.from(set).sort()];
  }, []);

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_ITEMS.filter((eq) => {
      // Voltage filter
      if (filterVoltage !== 'ALL' && eq.voltage_level !== filterVoltage) {
        return false;
      }
      // Domain filter
      if (filterDomain !== 'ALL' && eq.domain_code !== filterDomain) {
        return false;
      }
      // Safety filter
      if (filterSafetyOnly && !eq.is_safety_critical) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameFr = eq.name_fr.toLowerCase().includes(q);
        const matchNameEn = eq.name_en.toLowerCase().includes(q);
        const matchId = eq.id.toLowerCase().includes(q);
        const matchType = eq.entity_type.toLowerCase().includes(q);
        const matchDescFr = eq.description_fr.toLowerCase().includes(q);
        const matchDescEn = eq.description_en.toLowerCase().includes(q);
        const matchLocation = eq.typical_location_fr?.toLowerCase().includes(q) || eq.typical_location_en?.toLowerCase().includes(q);
        const matchTech = eq.technical && Object.entries(eq.technical).some(
          ([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
        );

        if (!matchNameFr && !matchNameEn && !matchId && !matchType && !matchDescFr && !matchDescEn && !matchLocation && !matchTech) {
          return false;
        }
      }
      return true;
    });
  }, [filterVoltage, filterDomain, filterSafetyOnly, searchQuery]);

  // Handle comparison selection
  const toggleComparisonItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening card
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev; // limit to 3 items
      }
      return [...prev, id];
    });
  };

  const removeComparisonItem = (id: string) => {
    setSelectedForComparison((prev) => prev.filter((item) => item !== id));
  };

  const selectedEquipmentObjects = useMemo(() => {
    return selectedForComparison
      .map((id) => EQUIPMENT_ITEMS.find((eq) => eq.id === id))
      .filter((eq): eq is Equipment => eq !== undefined);
  }, [selectedForComparison]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <header className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
              <Layers className="h-4 w-4" />
              <span className="uppercase tracking-wider font-bold">ASSET CATALOG · APPAREILLAGE INDUSTRIEL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
              {locale === 'fr' ? 'Catalogue de l\'Appareillage & Équipements' : 'HV/MV Switchgear & Equipment Catalog'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-medium">
              {locale === 'fr'
                ? 'Spécifications constructeur, niveaux de tension assignés, indices de danger arc flash et liaisons fonctionnelles pour les matériels de réseau HTB, HTA et BT.'
                : 'Manufacturer ratings, nominal voltages, arc flash hazard classifications, and functional relationship graphs for transmission and distribution assets.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'fr' ? 'Rechercher un matériel, tension, norme...' : 'Search equipment, rating, standard...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#080B10] border border-[#252E38] text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-5 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-4 font-mono">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Voltage Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 mr-1 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5 text-cyan-400" />
                <span>{locale === 'fr' ? 'Tension :' : 'Voltage:'}</span>
              </span>
              {['ALL', 'EHV', 'HV', 'MV', 'LV'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterVoltage(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    filterVoltage === lvl
                      ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                      : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap items-center gap-1.5 border-l border-[#252E38] pl-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Domaine :' : 'Domain:'}
              </span>
              {availableDomains.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setFilterDomain(dom)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    filterDomain === dom
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-[#252E38] bg-[#080B10] text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-300 bg-red-950/40 border border-red-800/80 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-red-950/70 transition-colors">
              <input
                type="checkbox"
                checked={filterSafetyOnly}
                onChange={(e) => setFilterSafetyOnly(e.target.checked)}
                className="rounded bg-[#080B10] border-red-800 text-red-500 focus:ring-0"
              />
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>{locale === 'fr' ? 'Critiques uniquement' : 'Safety-critical only'}</span>
            </label>

            {/* Results count */}
            <div className="text-xs font-mono text-neutral-400 bg-[#080B10] px-3 py-1.5 rounded-lg border border-[#252E38]">
              <span className="text-cyan-400 font-bold">{filteredEquipment.length}</span> {locale === 'fr' ? 'équipements' : 'assets'}
            </div>
          </div>

        </div>
      </header>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((eq) => {
          const isSelected = selectedForComparison.includes(eq.id);
          const canSelect = isSelected || selectedForComparison.length < 3;

          return (
            <div
              key={eq.id}
              data-testid={`equipment-card-${eq.id}`}
              onClick={() => onSelectEquipment(eq.id)}
              className={`rounded-xl border bg-[#0D1117] p-5 hover:border-cyan-400 transition-all cursor-pointer group shadow-md flex flex-col justify-between relative ${
                isSelected 
                  ? 'border-cyan-500 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'border-[#252E38]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <SafetyBadge
                      is_safety_critical={eq.is_safety_critical}
                      hazard_level={eq.hazard_level}
                      locale={locale}
                      size="sm"
                    />
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#141B26] text-neutral-400 border border-[#252E38] uppercase">
                      {eq.domain_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {eq.voltage_level && <VoltageIndicator level={eq.voltage_level} size="sm" />}
                    
                    {/* Compare Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={(e) => toggleComparisonItem(eq.id, e)}
                      disabled={!canSelect && !isSelected}
                      title={
                        isSelected 
                          ? (locale === 'fr' ? 'Retirer du comparatif' : 'Remove from comparison')
                          : selectedForComparison.length >= 3 
                          ? (locale === 'fr' ? 'Max 3 appareils atteints' : 'Max 3 units reached')
                          : (locale === 'fr' ? 'Ajouter au comparatif' : 'Add to comparison')
                      }
                      className={`p-1 rounded transition-colors ${
                        isSelected 
                          ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/50' 
                          : canSelect 
                          ? 'text-neutral-500 hover:text-neutral-300 hover:bg-[#1A2332]' 
                          : 'text-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold uppercase tracking-tight text-white group-hover:text-cyan-300 transition-colors mt-2 font-mono">
                  {locale === 'fr' ? eq.name_fr : eq.name_en}
                </h3>
                
                <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 font-medium leading-relaxed">
                  {locale === 'fr' ? eq.description_fr : eq.description_en}
                </p>

                {/* Quick specs pill row */}
                {eq.technical && (
                  <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {Object.entries(eq.technical).slice(0, 2).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded bg-[#080B10] text-neutral-300 border border-[#252E38] truncate max-w-full">
                        <span className="text-neutral-500">{k}:</span> <span className="font-bold text-cyan-400">{v}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#252E38] flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 font-bold uppercase tracking-wider text-[11px]">{eq.entity_type}</span>
                <span className="text-cyan-400 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>{locale === 'fr' ? 'Fiche complète' : 'Details'}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white font-mono uppercase">
            {locale === 'fr' ? 'Aucun équipement correspondant' : 'No matching equipment found'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {locale === 'fr'
              ? 'Modifiez vos filtres de tension, de domaine ou votre terme de recherche.'
              : 'Adjust your voltage, domain, or search query filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterVoltage('ALL');
              setFilterDomain('ALL');
              setFilterSafetyOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#141B26] hover:bg-[#1E293B] border border-[#252E38] text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider transition-colors"
          >
            {locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset all filters'}
          </button>
        </div>
      )}

      {/* Persistent Floating Comparison Toolbar */}
      {selectedForComparison.length > 0 && (
        <aside
          aria-label={locale === 'fr' ? 'Barre de comparaison technique' : 'Technical comparison bar'}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="rounded-2xl border border-cyan-500/50 bg-[#0D131F]/95 backdrop-blur-xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>{locale === 'fr' ? 'Comparateur' : 'Comparison'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-[#080B10] font-black text-[10px]">
                    {selectedForComparison.length}/3
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 truncate max-w-xs sm:max-w-md">
                  {selectedEquipmentObjects.map((o) => (locale === 'fr' ? o.name_fr : o.name_en)).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedForComparison([])}
                className="px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161F2E] border border-transparent hover:border-[#252E38] text-xs font-mono font-bold transition-colors"
              >
                {locale === 'fr' ? 'Effacer' : 'Clear'}
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#080B10] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950 flex items-center gap-1.5"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>
                  {locale === 'fr' 
                    ? `Comparer (${selectedForComparison.length})` 
                    : `Compare (${selectedForComparison.length})`}
                </span>
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* Comparison Modal */}
      <EquipmentComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedEquipments={selectedEquipmentObjects}
        onRemoveEquipment={removeComparisonItem}
        locale={locale}
        onNavigateDetail={(id) => {
          setIsComparisonModalOpen(false);
          onSelectEquipment(id);
        }}
      />

    </div>
  );
};
