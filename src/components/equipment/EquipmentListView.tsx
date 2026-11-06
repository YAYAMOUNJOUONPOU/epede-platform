// src/components/equipment/EquipmentListView.tsx
// EPEDE ProCode Redesign — Route 4: Equipment Catalogue (#/equipment & #/en/equipment)
// Preserves all 39 equipment entries, search, voltage filters, domain filters (D01–D16),
// safety-critical filter, comparison tray (up to 3 items), and responsive mobile filter drawer.

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
  SlidersHorizontal,
} from 'lucide-react';
import type { DomainCode, Equipment } from '../../types/epede';
import { EquipmentComparisonModal } from './EquipmentComparisonModal';
import { formatEntityType } from '../../utils/engineeringDisplayUtils';
import { DOMAIN_EDITORIAL_ASSETS } from '../../data/assets/editorialAssetManifest';

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
  const isFr = locale === 'fr';
  const [filterVoltage, setFilterVoltage] = useState<string>('ALL');
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [filterSafetyOnly, setFilterSafetyOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
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

  const availableDomains = useMemo(() => {
    const set = new Set(EQUIPMENT_ITEMS.map((eq) => eq.domain_code));
    return ['ALL', ...Array.from(set).sort()];
  }, []);

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_ITEMS.filter((eq) => {
      if (filterVoltage !== 'ALL' && eq.voltage_level !== filterVoltage) {
        return false;
      }
      if (filterDomain !== 'ALL' && eq.domain_code !== filterDomain) {
        return false;
      }
      if (filterSafetyOnly && !eq.is_safety_critical) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameFr = eq.name_fr.toLowerCase().includes(q);
        const matchNameEn = eq.name_en.toLowerCase().includes(q);
        const matchId = eq.id.toLowerCase().includes(q);
        const matchType = eq.entity_type.toLowerCase().includes(q);
        const matchDescFr = eq.description_fr.toLowerCase().includes(q);
        const matchDescEn = eq.description_en.toLowerCase().includes(q);
        const matchLocation =
          eq.typical_location_fr?.toLowerCase().includes(q) ||
          eq.typical_location_en?.toLowerCase().includes(q);
        const matchTech =
          eq.technical &&
          Object.entries(eq.technical).some(
            ([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
          );

        if (
          !matchNameFr &&
          !matchNameEn &&
          !matchId &&
          !matchType &&
          !matchDescFr &&
          !matchDescEn &&
          !matchLocation &&
          !matchTech
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filterVoltage, filterDomain, filterSafetyOnly, searchQuery]);

  const toggleComparisonItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
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

  const hasActiveFilters =
    filterVoltage !== 'ALL' ||
    filterDomain !== 'ALL' ||
    filterSafetyOnly ||
    Boolean(searchQuery.trim());

  const clearAllFilters = () => {
    setFilterVoltage('ALL');
    setFilterDomain('ALL');
    setFilterSafetyOnly(false);
    setSearchQuery('');
  };

  const getEquipmentVisual = (eq: Equipment): string => {
    const anyEq = eq as any;
    if (anyEq.image_url) return anyEq.image_url;
    if (anyEq.photo_url) return anyEq.photo_url;
    const domainAsset = DOMAIN_EDITORIAL_ASSETS[eq.domain_code];
    return domainAsset?.src || '/images/homepage_uploads/4.jpeg';
  };

  return (
    <div className="space-y-10 pb-24 text-[#17282C] font-sans">
      {/* 1. Editorial Page Header */}
      <header className="border-t border-[#17282C] pt-8 sm:pt-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Catalogue Appareillage' : 'Equipment Catalogue'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              {EQUIPMENT_ITEMS.length} {isFr ? 'Fiches Vérifiées' : 'Verified Datasheets'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <h1 className="epede-h1">
                  {isFr ? (
                    <>
                      Appareillage haute, moyenne et{' '}
                      <em className="font-serif-editorial text-[#147C78]">basse tension</em>.
                    </>
                  ) : (
                    <>
                      High, medium, and low voltage{' '}
                      <em className="font-serif-editorial text-[#147C78]">power apparatus</em>.
                    </>
                  )}
                </h1>
                <p className="epede-lead">
                  {isFr
                    ? 'Spécifications de plaque signalétique (Ur, Ir, Isc), niveaux de tension assignés, classification de risque Arc-Flash, vues éclatées et raccordements amont/aval pour les 39 équipements du réseau.'
                    : 'Nameplate ratings (Ur, Ir, Isc), nominal voltage envelopes, Arc-Flash hazard classifications, internal cutaways, and upstream/downstream connections across all 39 grid apparatus entries.'}
                </p>
              </div>

              {/* Search Input + Mobile Filter Button */}
              <div className="w-full lg:w-96 flex items-center gap-2 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#147C78]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isFr
                        ? 'Rechercher appareil, tension, norme...'
                        : 'Search apparatus, voltage, standard...'
                    }
                    className="w-full pl-10 pr-8 py-2.5 rounded-full bg-[#FFFDF9] border border-[#17282C] text-xs font-sans text-[#17282C] placeholder-[#5C6C70] focus:outline-none focus:border-[#147C78]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={isFr ? 'Effacer la recherche' : 'Clear search'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#5C6C70] hover:text-[#17282C]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#FFFDF9] border border-[#17282C] font-mono text-xs font-semibold text-[#17282C]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#147C78]" />
                  <span>{isFr ? 'Filtres' : 'Filters'}</span>
                </button>
              </div>
            </div>

            {/* Responsive Filter Toolbar (Always visible on md+, toggleable drawer on mobile) */}
            <div
              className={`${
                isMobileFilterOpen ? 'block' : 'hidden md:block'
              } bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-4 sm:p-5 space-y-4 font-mono text-xs`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Voltage Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#5C6C70] font-semibold uppercase mr-1 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5 text-[#147C78]" />
                    <span>{isFr ? 'Tension :' : 'Voltage:'}</span>
                  </span>
                  {['ALL', 'EHV', 'HV', 'MV', 'LV'].map((lvl) => {
                    const active = filterVoltage === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFilterVoltage(lvl)}
                        className={`px-3 py-1.5 rounded-full font-semibold uppercase transition-colors border ${
                          active
                            ? 'bg-[#17282C] border-[#17282C] text-[#FFFDF9]'
                            : 'bg-[#F6F4EE] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C]'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>

                {/* Safety Filter + Count */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#B91C1C] bg-[#FFFDF9] border border-[#B91C1C]/40 px-3 py-1.5 rounded-full hover:bg-[#FEE2E2]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={filterSafetyOnly}
                      onChange={(e) => setFilterSafetyOnly(e.target.checked)}
                      className="rounded border-[#B91C1C] text-[#B91C1C] focus:ring-0"
                    />
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{isFr ? 'Critiques Sécurité' : 'Safety-Critical Only'}</span>
                  </label>

                  <div className="text-xs font-mono text-[#5C6C70] bg-[#F6F4EE] px-3 py-1.5 rounded-full border border-[#DEDACF]">
                    <strong className="text-[#147C78]">{filteredEquipment.length}</strong> /{' '}
                    {EQUIPMENT_ITEMS.length} {isFr ? 'appareils' : 'assets'}
                  </div>
                </div>
              </div>

              {/* Domain Filter Row (D01–D16) */}
              <div className="pt-3 border-t border-[#DEDACF] flex flex-wrap items-center gap-1.5">
                <span className="text-[#5C6C70] font-semibold uppercase mr-1">
                  {isFr ? 'Domaine :' : 'Domain:'}
                </span>
                {availableDomains.map((dom) => {
                  const active = filterDomain === dom;
                  return (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setFilterDomain(dom)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase transition-colors border ${
                        active
                          ? 'bg-[#147C78] border-[#147C78] text-[#FFFDF9]'
                          : 'bg-[#F6F4EE] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C]'
                      }`}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>

              {/* Active Filter Chips & Clear Action */}
              {hasActiveFilters && (
                <div className="pt-3 border-t border-[#DEDACF] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-[#5C6C70]">
                      {isFr ? 'Filtres actifs :' : 'Active filters:'}
                    </span>
                    {filterVoltage !== 'ALL' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E3EFEC] text-[#147C78] text-[11px] font-semibold">
                        {filterVoltage}
                        <button type="button" onClick={() => setFilterVoltage('ALL')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filterDomain !== 'ALL' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E3EFEC] text-[#147C78] text-[11px] font-semibold">
                        {filterDomain}
                        <button type="button" onClick={() => setFilterDomain('ALL')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filterSafetyOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold">
                        {isFr ? 'Sécurité Critique' : 'Safety-Critical'}
                        <button type="button" onClick={() => setFilterSafetyOnly(false)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-mono font-semibold text-[#147C78] hover:underline"
                  >
                    {isFr ? 'Réinitialiser tous les filtres' : 'Clear all filters'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Equipment Catalogue Grid (1-Column Editorial Rows on Mobile, 3-Column Technical Index Cards on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEquipment.map((eq) => {
          const isSelected = selectedForComparison.includes(eq.id);
          const canSelect = isSelected || selectedForComparison.length < 3;
          const imgSrc = getEquipmentVisual(eq);

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
              className={`rounded-[10px] border bg-[#FFFDF9] overflow-hidden hover:border-[#147C78] transition-colors cursor-pointer group flex flex-col justify-between relative select-none no-underline ${
                isSelected
                  ? 'border-[#147C78] ring-2 ring-[#147C78]/30 bg-[#E3EFEC]/25'
                  : 'border-[#DEDACF]'
              }`}
            >
              <div>
                {/* Genuine Asset Photograph / Cutaway Header */}
                <div className="relative h-36 w-full bg-[#10191D] overflow-hidden border-b border-[#DEDACF]">
                  <img
                    src={imgSrc}
                    alt={isFr ? eq.name_fr : eq.name_en}
                    className="w-full h-full object-cover epede-photo-grade group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10191D]/80 via-transparent to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectDomain(eq.domain_code);
                      }}
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFFDF9]/95 text-[#17282C] border border-[#DEDACF] uppercase hover:border-[#147C78]"
                    >
                      {eq.domain_code}
                    </span>
                    <SafetyBadge
                      is_safety_critical={eq.is_safety_critical}
                      hazard_level={eq.hazard_level}
                      locale={locale}
                      size="sm"
                    />
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {eq.voltage_level && <VoltageIndicator level={eq.voltage_level} size="sm" />}
                    <button
                      type="button"
                      onClick={(e) => toggleComparisonItem(eq.id, e)}
                      disabled={!canSelect && !isSelected}
                      title={
                        isSelected
                          ? isFr
                            ? 'Retirer du comparatif'
                            : 'Remove from comparison'
                          : selectedForComparison.length >= 3
                          ? isFr
                            ? 'Max 3 appareils atteints'
                            : 'Max 3 units reached'
                          : isFr
                          ? 'Comparer cet appareil'
                          : 'Add to comparison'
                      }
                      className={`p-1.5 rounded bg-[#FFFDF9]/95 border transition-colors ${
                        isSelected
                          ? 'text-[#147C78] border-[#147C78]'
                          : canSelect
                          ? 'text-[#5C6C70] border-[#DEDACF] hover:text-[#17282C]'
                          : 'text-[#DEDACF] border-[#DEDACF] cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-3.5 w-3.5" />
                      ) : (
                        <Square className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#F4F1E8]">
                    <span className="truncate">{formatEntityType(eq.entity_type, locale)}</span>
                    {eq.voltage_level && (
                      <span className="text-[#6CC3BD] shrink-0">{eq.voltage_level}</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#17282C] group-hover:text-[#147C78] transition-colors leading-snug">
                    {isFr ? eq.name_fr : eq.name_en}
                  </h3>

                  <p className="text-xs text-[#33474B] mt-2 line-clamp-2 leading-relaxed">
                    {isFr ? eq.description_fr : eq.description_en}
                  </p>

                  {/* Nameplate Technical Pills */}
                  {eq.technical && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {Object.entries(eq.technical)
                        .slice(0, 2)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2.5 py-0.5 rounded bg-[#F6F4EE] text-[#17282C] border border-[#DEDACF] truncate max-w-full"
                          >
                            <span className="text-[#5C6C70]">{k}:</span>{' '}
                            <strong className="text-[#B8872D]">{v}</strong>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#DEDACF] bg-[#F6F4EE]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[#5C6C70] text-[11px] truncate max-w-[190px]">
                  {(isFr ? eq.typical_location_fr : eq.typical_location_en) || eq.id}
                </span>
                <span className="text-[#147C78] font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                  <span>{isFr ? 'Fiche CEI' : 'Inspect'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="rounded-[10px] border border-[#DEDACF] bg-[#FFFDF9] p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-[#5C6C70] mx-auto" />
          <h3 className="text-base font-bold text-[#17282C]">
            {isFr ? 'Aucun équipement correspondant' : 'No matching equipment found'}
          </h3>
          <p className="text-xs text-[#5C6C70] max-w-md mx-auto">
            {isFr
              ? 'Modifiez vos filtres de tension, de domaine ou votre terme de recherche.'
              : 'Adjust your voltage, domain, or search query filters.'}
          </p>
          <button type="button" onClick={clearAllFilters} className="epede-btn-primary text-xs">
            {isFr ? 'Réinitialiser les filtres' : 'Reset all filters'}
          </button>
        </div>
      )}

      {/* Persistent Floating Comparison Toolbar */}
      {selectedForComparison.length > 0 && (
        <aside
          aria-label={isFr ? 'Barre de comparaison technique' : 'Technical comparison bar'}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4"
        >
          <div className="rounded-full border border-[#17282C] bg-[#FFFDF9]/98 backdrop-blur-md px-5 py-3 shadow-[0_16px_40px_rgba(16,25,29,0.22)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#E3EFEC] flex items-center justify-center text-[#147C78] shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#17282C] uppercase flex items-center gap-1.5">
                  <span>{isFr ? 'Comparateur' : 'Compare Apparatus'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#17282C] text-[#FFFDF9] text-[10px]">
                    {selectedForComparison.length}/3
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#5C6C70] truncate max-w-xs sm:max-w-md">
                  {selectedEquipmentObjects
                    .map((o) => (isFr ? o.name_fr : o.name_en))
                    .join(' · ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedForComparison([])}
                className="px-3 py-1.5 rounded-full text-[#5C6C70] hover:text-[#17282C] text-xs font-mono font-semibold"
              >
                {isFr ? 'Effacer' : 'Clear'}
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="epede-btn-primary text-xs min-h-[38px] px-4"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>
                  {isFr
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
