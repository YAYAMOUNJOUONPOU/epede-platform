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
import { PageHeader, DataStrip, FinalCTA } from '../common';

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
    <div className="space-y-10 pb-24 text-[#0B1B2B] font-sans">
      {/* 1. Standard Page Header */}
      <PageHeader
        eyebrow={isFr ? 'Catalogue Appareillage' : 'Equipment Catalogue'}
        title={
          isFr
            ? 'Appareillage haute, moyenne et basse tension'
            : 'High, medium, and low voltage power apparatus'
        }
        intro={
          isFr
            ? 'Spécifications de plaque signalétique (Ur, Ir, Isc), niveaux de tension assignés, classification de risque Arc-Flash, vues éclatées et raccordements amont/aval pour les 39 équipements du réseau.'
            : 'Nameplate ratings (Ur, Ir, Isc), nominal voltage envelopes, Arc-Flash hazard classifications, internal cutaways, and upstream/downstream connections across all 39 grid apparatus entries.'
        }
      />

      {/* 2. Normative Data Strip */}
      <DataStrip
        items={[
          {
            label: isFr ? 'Appareils Normés' : 'Standard Apparatus',
            value: `${EQUIPMENT_ITEMS.length}`,
            subtext: isFr ? 'Fiches CEI actives' : 'Active IEC datasheets',
          },
          {
            label: isFr ? 'Tensions Assignées' : 'Voltage Classes',
            value: '4 Niveaux',
            subtext: 'EHV · HV · MV · LV',
          },
          {
            label: isFr ? 'Critiques Sécurité' : 'Safety-Critical',
            value: `${EQUIPMENT_ITEMS.filter((e) => e.is_safety_critical).length}`,
            subtext: isFr ? 'Arc-Flash & disjoncteurs' : 'Arc-Flash & breakers',
          },
          {
            label: isFr ? 'Normes Référencées' : 'Referenced Standards',
            value: 'CEI 62271 / 60076',
            subtext: isFr ? 'Conformité internationale' : 'Global compliance',
          },
        ]}
      />

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[6px] p-5 sm:p-6 space-y-4 font-mono text-xs shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1F5FAE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFr
                  ? 'Rechercher appareil, tension, norme CEI...'
                  : 'Search apparatus, voltage, IEC standard...'
              }
              className="w-full pl-10 pr-8 py-2.5 rounded-[4px] bg-[#FBFCFD] border border-[#D5E0E8] text-xs font-sans text-[#0B1B2B] placeholder-[#5B6B7B] focus:outline-none focus:border-[#1F5FAE]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={isFr ? 'Effacer la recherche' : 'Clear search'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#5B6B7B] hover:text-[#0B1B2B]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Safety Filter + Asset Counter */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-[#EEF4F8] border border-[#D5E0E8] font-mono text-xs font-semibold text-[#0B1B2B]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#1F5FAE]" />
              <span>{isFr ? 'Filtres' : 'Filters'}</span>
            </button>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#B91C1C] bg-[#FBFCFD] border border-[#B91C1C]/40 px-3 py-1.5 rounded-[4px] hover:bg-[#FEE2E2]/30 transition-colors">
              <input
                type="checkbox"
                checked={filterSafetyOnly}
                onChange={(e) => setFilterSafetyOnly(e.target.checked)}
                className="rounded-[3px] border-[#B91C1C] text-[#B91C1C] focus:ring-0"
              />
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{isFr ? 'Critiques Sécurité' : 'Safety-Critical Only'}</span>
            </label>

            <div className="text-xs font-mono text-[#5B6B7B] bg-[#EEF4F8] px-3 py-1.5 rounded-[4px] border border-[#D5E0E8]">
              <strong className="text-[#1F5FAE]">{filteredEquipment.length}</strong> /{' '}
              {EQUIPMENT_ITEMS.length} {isFr ? 'appareils' : 'assets'}
            </div>
          </div>
        </div>

        {/* Voltage Filters Row */}
        <div
          className={`${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          } pt-3 border-t border-[#D5E0E8] space-y-3`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#5B6B7B] font-semibold uppercase mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-[#1F5FAE]" />
                <span>{isFr ? 'Tension :' : 'Voltage:'}</span>
              </span>
              {['ALL', 'EHV', 'HV', 'MV', 'LV'].map((lvl) => {
                const active = filterVoltage === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFilterVoltage(lvl)}
                    className={`px-3 py-1 rounded-[4px] font-semibold uppercase transition-colors border ${
                      active
                        ? 'bg-[#0B1B2B] border-[#0B1B2B] text-[#FBFCFD]'
                        : 'bg-[#EEF4F8] border-[#D5E0E8] text-[#5B6B7B] hover:text-[#0B1B2B] hover:border-[#1F5FAE]'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-mono font-semibold text-[#1F5FAE] hover:text-[#174A88] hover:underline"
              >
                {isFr ? 'Réinitialiser tous les filtres' : 'Clear all filters'}
              </button>
            )}
          </div>

          {/* Domain Filter Row (D01–D16) */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[#5B6B7B] font-semibold uppercase mr-1">
              {isFr ? 'Domaine :' : 'Domain:'}
            </span>
            {availableDomains.map((dom) => {
              const active = filterDomain === dom;
              return (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setFilterDomain(dom)}
                  className={`px-2.5 py-1 rounded-[4px] text-[11px] font-semibold uppercase transition-colors border ${
                    active
                      ? 'bg-[#1F5FAE] border-[#1F5FAE] text-[#FBFCFD]'
                      : 'bg-[#EEF4F8] border-[#D5E0E8] text-[#5B6B7B] hover:text-[#0B1B2B] hover:border-[#1F5FAE]'
                  }`}
                >
                  {dom}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Equipment Catalogue Grid */}
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
              className={`rounded-[6px] border bg-[#FBFCFD] overflow-hidden hover:border-[#1F5FAE] transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between relative select-none no-underline ${
                isSelected
                  ? 'border-[#1F5FAE] ring-2 ring-[#1F5FAE]/20 bg-[#EEF4F8]/40'
                  : 'border-[#D5E0E8]'
              }`}
            >
              <div>
                {/* Asset Photograph / Cutaway Header */}
                <div className="relative h-40 w-full bg-[#0B1B2B] overflow-hidden border-b border-[#D5E0E8]">
                  <img
                    src={imgSrc}
                    alt={isFr ? eq.name_fr : eq.name_en}
                    className="w-full h-full object-cover epede-photo-grade group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/85 via-transparent to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectDomain(eq.domain_code);
                      }}
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-[#FBFCFD]/95 text-[#0B1B2B] border border-[#D5E0E8] uppercase hover:border-[#1F5FAE]"
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
                      className={`p-1.5 rounded-[3px] bg-[#FBFCFD]/95 border transition-colors ${
                        isSelected
                          ? 'text-[#1F5FAE] border-[#1F5FAE]'
                          : canSelect
                          ? 'text-[#5B6B7B] border-[#D5E0E8] hover:text-[#0B1B2B]'
                          : 'text-[#D5E0E8] border-[#D5E0E8] cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-3.5 w-3.5" />
                      ) : (
                        <Square className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#F3F7FA]">
                    <span className="truncate">{formatEntityType(eq.entity_type, locale)}</span>
                    {eq.voltage_level && (
                      <span className="text-[#F2A541] font-semibold shrink-0">{eq.voltage_level}</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors leading-snug">
                    {isFr ? eq.name_fr : eq.name_en}
                  </h3>

                  <p className="text-xs text-[#3A4B5C] mt-2 line-clamp-2 leading-relaxed">
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
                            className="px-2 py-0.5 rounded-[3px] bg-[#EEF4F8] text-[#0B1B2B] border border-[#D5E0E8] truncate max-w-full"
                          >
                            <span className="text-[#5B6B7B]">{k}:</span>{' '}
                            <strong className="text-[#1F5FAE]">{v}</strong>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#D5E0E8] bg-[#EEF4F8]/50 flex items-center justify-between text-xs font-mono">
                <span className="text-[#5B6B7B] text-[11px] truncate max-w-[190px]">
                  {(isFr ? eq.typical_location_fr : eq.typical_location_en) || eq.id}
                </span>
                <span className="text-[#1F5FAE] font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                  <span>{isFr ? 'Fiche CEI' : 'Inspect'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="rounded-[6px] border border-[#D5E0E8] bg-[#FBFCFD] p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-[#5B6B7B] mx-auto" />
          <h3 className="text-base font-bold text-[#0B1B2B]">
            {isFr ? 'Aucun équipement correspondant' : 'No matching equipment found'}
          </h3>
          <p className="text-xs text-[#5B6B7B] max-w-md mx-auto">
            {isFr
              ? 'Modifiez vos filtres de tension, de domaine ou votre terme de recherche.'
              : 'Adjust your voltage, domain, or search query filters.'}
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-[4px] bg-[#1F5FAE] hover:bg-[#174A88] text-[#FBFCFD] text-xs font-mono font-semibold transition-colors"
          >
            {isFr ? 'Réinitialiser les filtres' : 'Reset all filters'}
          </button>
        </div>
      )}

      {/* 5. Persistent Floating Comparison Toolbar */}
      {selectedForComparison.length > 0 && (
        <aside
          aria-label={isFr ? 'Barre de comparaison technique' : 'Technical comparison bar'}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4"
        >
          <div className="rounded-full border border-[#D5E0E8] bg-[#FBFCFD]/95 backdrop-blur-md px-5 py-3 shadow-[0_16px_40px_rgba(11,27,43,0.15)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#EEF4F8] flex items-center justify-center text-[#1F5FAE] shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#0B1B2B] uppercase flex items-center gap-1.5">
                  <span>{isFr ? 'Comparateur' : 'Compare Apparatus'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0B1B2B] text-[#FBFCFD] text-[10px]">
                    {selectedForComparison.length}/3
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#5B6B7B] truncate max-w-xs sm:max-w-md">
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
                className="px-3 py-1.5 rounded-full text-[#5B6B7B] hover:text-[#0B1B2B] text-xs font-mono font-semibold"
              >
                {isFr ? 'Effacer' : 'Clear'}
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#1F5FAE] hover:bg-[#174A88] text-[#FBFCFD] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
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

      {/* 6. Standard Final Call-to-Action */}
      <FinalCTA
        eyebrow={isFr ? 'Ingénierie & Dimensionnement' : 'Engineering & Sizing'}
        title={
          isFr
            ? 'Passez de la fiche technique aux calculs normatifs.'
            : 'From equipment datasheets to normative calculation.'
        }
        description={
          isFr
            ? 'Validez les calibres de vos disjoncteurs, transformateurs et lignes avec nos calculateurs conformes CEI.'
            : 'Validate circuit breakers, transformer ratings, and transmission lines with our IEC-compliant calculation suite.'
        }
        primaryAction={{
          label: isFr ? 'Ouvrir les calculateurs' : 'Open Calculators',
          onClick: () => {
            window.location.hash = '#/calculators';
          },
        }}
        secondaryAction={{
          label: isFr ? 'Explorer la grille' : 'Explore Grid Map',
          onClick: () => {
            window.location.hash = '#/cameroon-grid';
          },
        }}
      />

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
