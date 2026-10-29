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
import { formatEntityType } from '../../utils/engineeringDisplayUtils';

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
    <div className="space-y-6 pb-20 text-[#F4F1E8]">
      
      {/* Header */}
      <header className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#D7A64A] mb-1">
              <Layers className="h-4 w-4" />
              <span className="uppercase tracking-wider font-bold">
                {locale === 'fr' ? 'CATALOGUE MATÉRIELS · APPAREILLAGE INDUSTRIEL' : 'EQUIPMENT CATALOG · REAL-WORLD POWER APPARATUS'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F4F1E8] font-mono">
              {locale === 'fr' ? 'Catalogue de l\'Appareillage & Équipements' : 'HV / MV / LV Switchgear & Equipment Catalog'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#A9ADA5] max-w-3xl leading-relaxed font-medium">
              {locale === 'fr'
                ? 'Spécifications constructeur, niveaux de tension assignés, indices de danger arc flash et liaisons fonctionnelles pour les matériels de réseau HTB, HTA et BT.'
                : 'Explore 39 industrial power system apparatus datasheets: manufacturer ratings, nominal voltages (EHV/HV/MV/LV), arc-flash hazard classifications, 3D cutaways, and upstream/downstream network connections.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A9ADA5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'fr' ? 'Rechercher un matériel, tension, norme...' : 'Search equipment, rating, standard...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0B0F12] border border-[#567A87]/40 text-xs font-mono text-[#F4F1E8] placeholder-[#A9ADA5] focus:outline-none focus:border-[#D7A64A] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#A9ADA5] hover:text-[#F4F1E8]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* What You Will Understand Here (Orientation Strip) */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#0B0F12]/90 border border-[#567A87]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D7A64A] font-bold block">
              {locale === 'fr' ? '1. Rôle Physique & Coupure' : '1. Physical Role & Switching'}
            </span>
            <span className="text-[#A9ADA5]">
              {locale === 'fr'
                ? 'Comment chaque appareil (disjoncteur SF6, sectionneur, transfo, relais IED) s\'insère dans la travée.'
                : 'How each apparatus (SF6 breaker, disconnector, power transformer, IED relay) operates inside a bay.'}
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D7A64A] font-bold block">
              {locale === 'fr' ? '2. Grandeurs de Plaque (Ur, Ir, Isc)' : '2. Nameplate Ratings (Ur, Ir, Isc)'}
            </span>
            <span className="text-[#A9ADA5]">
              {locale === 'fr'
                ? 'Lire les tensions assignées, courants continus et pouvoirs de coupure selon CEI 62271 / 60076.'
                : 'Interpret rated voltage, continuous current, and short-circuit breaking capacity per IEC 62271 / 60076.'}
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D7A64A] font-bold block">
              {locale === 'fr' ? '3. Comparaison & Dimensionnement' : '3. Compare & Verify Sizing'}
            </span>
            <span className="text-[#A9ADA5]">
              {locale === 'fr'
                ? 'Sélectionnez jusqu\'à 3 appareils pour comparer leurs caractéristiques côte à côte.'
                : 'Select up to 3 apparatus cards to compare specifications side-by-side or launch linked solvers.'}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-5 pt-5 border-t border-[#567A87]/30 flex flex-wrap items-center justify-between gap-4 font-mono">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Voltage Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#A9ADA5] flex items-center gap-1 mr-1 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5 text-[#D7A64A]" />
                <span>{locale === 'fr' ? 'Tension :' : 'Voltage:'}</span>
              </span>
              {['ALL', 'EHV', 'HV', 'MV', 'LV'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterVoltage(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    filterVoltage === lvl
                      ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A]'
                      : 'border-[#567A87]/35 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap items-center gap-1.5 border-l border-[#567A87]/30 pl-4">
              <span className="text-xs font-bold text-[#A9ADA5] uppercase tracking-wider">
                {locale === 'fr' ? 'Domaine :' : 'Domain:'}
              </span>
              {availableDomains.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setFilterDomain(dom)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    filterDomain === dom
                      ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A]'
                      : 'border-[#567A87]/35 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8]'
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
                className="rounded bg-[#0B0F12] border-red-800 text-red-500 focus:ring-0"
              />
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>{locale === 'fr' ? 'Critiques uniquement' : 'Safety-critical only'}</span>
            </label>

            {/* Results count */}
            <div className="text-xs font-mono text-[#A9ADA5] bg-[#0B0F12] px-3 py-1.5 rounded-lg border border-[#567A87]/35">
              <span className="text-[#D7A64A] font-bold">{filteredEquipment.length}</span> {locale === 'fr' ? 'équipements' : 'assets'}
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
            <a
              key={eq.id}
              href={`#/equipment/${eq.id}`}
              data-testid={`equipment-card-${eq.id}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onSelectEquipment(eq.id);
                }
              }}
              className={`rounded-xl border bg-[#151C1E] p-5 hover:border-[#D7A64A] transition-all cursor-pointer group shadow-md flex flex-col justify-between relative select-none no-underline block ${
                isSelected 
                  ? 'border-[#D7A64A] bg-[#D7A64A]/10 shadow-[0_0_15px_rgba(215,166,74,0.15)]' 
                  : 'border-[#567A87]/35'
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
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0B0F12] text-[#D7A64A] border border-[#567A87]/35 uppercase">
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
                          ? 'text-[#D7A64A] bg-[#0B0F12] border border-[#D7A64A]/50' 
                          : canSelect 
                          ? 'text-[#A9ADA5] hover:text-[#F4F1E8] hover:bg-[#0B0F12]' 
                          : 'text-[#567A87]/40 cursor-not-allowed'
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

                <h3 className="text-base font-bold uppercase tracking-tight text-[#F4F1E8] group-hover:text-[#D7A64A] transition-colors mt-2 font-mono">
                  {locale === 'fr' ? eq.name_fr : eq.name_en}
                </h3>
                
                <p className="text-xs text-[#A9ADA5] mt-1.5 line-clamp-2 font-medium leading-relaxed">
                  {locale === 'fr' ? eq.description_fr : eq.description_en}
                </p>

                {/* Quick specs pill row */}
                {eq.technical && (
                  <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {Object.entries(eq.technical).slice(0, 2).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded bg-[#0B0F12] text-[#F4F1E8] border border-[#567A87]/35 truncate max-w-full">
                        <span className="text-[#A9ADA5]">{k}:</span> <span className="font-bold text-[#D7A64A]">{v}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#567A87]/25 flex items-center justify-between text-xs font-mono">
                <span className="text-[#A9ADA5] font-medium tracking-wide text-[11px] truncate max-w-[180px]">
                  {formatEntityType(eq.entity_type, locale)}
                </span>
                <span className="text-[#D7A64A] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                  <span>{locale === 'fr' ? 'Fiche complète' : 'Inspect Asset'}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-[#A9ADA5] mx-auto" />
          <h3 className="text-base font-bold text-[#F4F1E8] font-mono uppercase">
            {locale === 'fr' ? 'Aucun équipement correspondant' : 'No matching equipment found'}
          </h3>
          <p className="text-xs text-[#A9ADA5] max-w-md mx-auto">
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
            className="px-4 py-2 rounded-lg bg-[#0B0F12] hover:bg-[#567A87]/20 border border-[#567A87]/40 text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider transition-colors"
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
          <div className="rounded-2xl border border-[#D7A64A]/60 bg-[#151C1E]/95 backdrop-blur-xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#D7A64A]/15 border border-[#D7A64A]/40 flex items-center justify-center text-[#D7A64A] shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#F4F1E8] uppercase tracking-wider flex items-center gap-1.5">
                  <span>{locale === 'fr' ? 'Comparateur' : 'Comparison'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#D7A64A] text-[#0B0F12] font-black text-[10px]">
                    {selectedForComparison.length}/3
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#A9ADA5] truncate max-w-xs sm:max-w-md">
                  {selectedEquipmentObjects.map((o) => (locale === 'fr' ? o.name_fr : o.name_en)).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedForComparison([])}
                className="px-2.5 py-1.5 rounded-lg text-[#A9ADA5] hover:text-[#F4F1E8] hover:bg-[#0B0F12] border border-transparent hover:border-[#567A87]/40 text-xs font-mono font-bold transition-colors"
              >
                {locale === 'fr' ? 'Effacer' : 'Clear'}
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-1.5"
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
