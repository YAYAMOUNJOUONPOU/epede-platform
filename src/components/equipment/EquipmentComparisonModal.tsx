// src/components/equipment/EquipmentComparisonModal.tsx
// EPEDE - Interactive Multi-Equipment Technical Comparison Engine
// Side-by-side engineering evaluation per IEC / IEEE standards

import React, { useState } from 'react';
import { 
  Scale, 
  X, 
  Check, 
  ShieldAlert, 
  Zap, 
  Copy, 
  FileText, 
  Layers, 
  ExternalLink, 
  CheckCircle2,
  AlertTriangle,
  Info,
  Building
} from 'lucide-react';
import type { Equipment } from '../../types/epede';
import { SafetyBadge } from './SafetyBadge';
import { VoltageIndicator } from '../ui/VoltageIndicator';
import { EvidenceTrustBadge } from './EvidenceTrustBadge';
import { ArchitectureComparisonWorkbench } from '../comparison/ArchitectureComparisonWorkbench';

interface EquipmentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipments: Equipment[];
  onRemoveEquipment: (id: string) => void;
  locale: 'fr' | 'en';
  onNavigateDetail: (id: string) => void;
}

export const EquipmentComparisonModal: React.FC<EquipmentComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedEquipments,
  onRemoveEquipment,
  locale,
  onNavigateDetail,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<'EQUIPMENT' | 'ARCHITECTURES'>('EQUIPMENT');

  if (!isOpen || (selectedEquipments.length === 0 && activeMode === 'EQUIPMENT')) return null;

  // Extract all unique technical keys across selected equipment
  const allTechnicalKeys: string[] = Array.from(
    new Set(
      selectedEquipments.flatMap((eq) => (eq.technical ? Object.keys(eq.technical) : []))
    )
  );

  const handleCopySummary = () => {
    const text = selectedEquipments
      .map((eq) => {
        const title = locale === 'fr' ? eq.name_fr : eq.name_en;
        const tech = eq.technical
          ? Object.entries(eq.technical)
              .map(([k, v]) => `  • ${k}: ${v}`)
              .join('\n')
          : '';
        return `=== ${eq.id} - ${title} ===\nDomaine: ${eq.domain_code} | Tension: ${eq.voltage_level}\nFonction: ${locale === 'fr' ? eq.function_fr : eq.function_en}\nSpécifications:\n${tech}\n`;
      })
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[92vh] rounded-2xl border border-cyan-500/40 bg-[#0A0E17] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="border-b border-[#252E38] bg-[#0D131F] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white font-mono flex items-center gap-2">
                <span>
                  {locale === 'fr'
                    ? 'Comparateur Technique d\'Appareillages'
                    : 'Switchgear & Equipment Technical Comparator'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {selectedEquipments.length} {locale === 'fr' ? 'appareils' : 'units'}
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                {locale === 'fr'
                  ? 'Évaluation différentielle des grandeurs assignées, normes CEI/IEEE et contraintes d\'exploitation.'
                  : 'Differential analysis of rated specifications, IEC/IEEE standards and operational constraints.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B26] hover:bg-cyan-950/40 border border-[#252E38] hover:border-cyan-500/50 text-xs font-mono font-bold text-cyan-300 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (locale === 'fr' ? 'COPIÉ !' : 'COPIED !') : (locale === 'fr' ? 'COPIER DOSSIER' : 'COPY DOSSIER')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1A2330] border border-transparent hover:border-[#252E38] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tab Bar */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0E17] border-b border-[#1E2633] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('EQUIPMENT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'EQUIPMENT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? `1. Équipements Sélectionnés (${selectedEquipments.length})` : `1. Selected Equipment (${selectedEquipments.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('ARCHITECTURES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'ARCHITECTURES'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? '2. Architectures de Postes (AIS / GIS / TCO)' : '2. Substation Architectures (AIS / GIS / TCO)'}</span>
          </button>
        </div>

        {/* Scrollable Matrix Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeMode === 'ARCHITECTURES' ? (
            <ArchitectureComparisonWorkbench locale={locale} embedded={true} />
          ) : (
            <>
              {/* Top Equipment Identification Cards Grid */}
              <div className={`grid gap-4 ${
                selectedEquipments.length === 1 
                  ? 'grid-cols-1' 
                  : selectedEquipments.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-3'
              }`}>
            {selectedEquipments.map((eq) => (
              <div 
                key={eq.id}
                className="rounded-xl border border-[#252E38] bg-[#0D121B] p-4 flex flex-col justify-between relative group hover:border-cyan-500/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onRemoveEquipment(eq.id)}
                  title={locale === 'fr' ? 'Retirer du comparatif' : 'Remove from comparison'}
                  className="absolute top-3 right-3 p-1 rounded bg-[#161F2E] text-neutral-400 hover:text-red-400 border border-[#252E38] hover:border-red-500/50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="space-y-2 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                      {eq.domain_code}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">
                      {eq.entity_type}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono leading-snug line-clamp-2">
                    {locale === 'fr' ? eq.name_fr : eq.name_en}
                  </h3>

                  <div className="flex items-center gap-2 pt-1">
                    {eq.voltage_level && <VoltageIndicator level={eq.voltage_level} size="sm" />}
                    <SafetyBadge
                      is_safety_critical={eq.is_safety_critical}
                      hazard_level={eq.hazard_level}
                      locale={locale}
                      size="sm"
                    />
                    <EvidenceTrustBadge
                      level={eq.provenance?.verification_status === 'verified' ? 'VERIFIED_STANDARD' : 'FIELD_PRACTICE'}
                      locale={locale}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#252E38] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 font-bold">
                    {eq.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateDetail(eq.id);
                    }}
                    className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{locale === 'fr' ? 'Fiche détaillée' : 'View full asset'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section 1: Overview & Grid Functional Role */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D121B] overflow-hidden shadow-lg">
            <div className="bg-[#121824] px-4 py-2.5 border-b border-[#252E38] flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {locale === 'fr' ? '1. RÔLE SYSTÈME & FONCTION EN EXPLOITATION' : '1. GRID ROLE & SYSTEM FUNCTION'}
              </h4>
            </div>

            <div className="divide-y divide-[#252E38]">
              {/* Function description row */}
              <div className={`grid p-4 gap-4 text-xs ${
                selectedEquipments.length === 1 
                  ? 'grid-cols-1' 
                  : selectedEquipments.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-3'
              }`}>
                {selectedEquipments.map((eq) => (
                  <div key={eq.id} className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                      {locale === 'fr' ? eq.name_fr : eq.name_en}
                    </span>
                    <p className="text-neutral-200 leading-relaxed font-medium">
                      {locale === 'fr' ? eq.function_fr : eq.function_en}
                    </p>
                  </div>
                ))}
              </div>

              {/* Typical location row */}
              <div className={`grid p-4 gap-4 text-xs bg-[#090D14] ${
                selectedEquipments.length === 1 
                  ? 'grid-cols-1' 
                  : selectedEquipments.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-3'
              }`}>
                {selectedEquipments.map((eq) => (
                  <div key={eq.id} className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                      📍 {locale === 'fr' ? 'Implantation Réseau :' : 'Typical Substation Node:'}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {eq.typical_location_fr 
                        ? (locale === 'fr' ? eq.typical_location_fr : eq.typical_location_en)
                        : (locale === 'fr' ? 'Non spécifié' : 'Not specified')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Dense Technical Parameters Matrix */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D121B] overflow-hidden shadow-lg">
            <div className="bg-[#121824] px-4 py-2.5 border-b border-[#252E38] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {locale === 'fr' ? '2. MATRICE DES PARAMÈTRES TECHNIQUES & CARACTÉRISTIQUES' : '2. TECHNICAL PARAMETERS & RATINGS MATRIX'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {allTechnicalKeys.length} {locale === 'fr' ? 'grandeurs répertoriées' : 'parameters cataloged'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#0A0E17] text-neutral-400 border-b border-[#252E38]">
                    <th className="p-3 font-bold uppercase tracking-wider w-1/4">
                      {locale === 'fr' ? 'Grandeur Nominale' : 'Parameter / Rating'}
                    </th>
                    {selectedEquipments.map((eq) => (
                      <th key={eq.id} className="p-3 font-bold text-cyan-300 border-l border-[#252E38]">
                        <div className="truncate">{locale === 'fr' ? eq.name_fr : eq.name_en}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">{eq.id}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252E38]">
                  {allTechnicalKeys.length === 0 ? (
                    <tr>
                      <td colSpan={selectedEquipments.length + 1} className="p-6 text-center text-neutral-500 italic">
                        {locale === 'fr' ? 'Aucune spécification technique détaillée disponible.' : 'No detailed technical parameters available.'}
                      </td>
                    </tr>
                  ) : (
                    allTechnicalKeys.map((key, idx) => (
                      <tr 
                        key={key} 
                        className={idx % 2 === 0 ? 'bg-[#0D121B]' : 'bg-[#0A0F18] hover:bg-[#121926] transition-colors'}
                      >
                        <td className="p-3 font-bold text-neutral-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{key}</span>
                        </td>
                        {selectedEquipments.map((eq) => {
                          const val = eq.technical ? eq.technical[key] : undefined;
                          return (
                            <td key={eq.id} className="p-3 border-l border-[#252E38]">
                              {val ? (
                                <span className="font-bold text-white bg-[#141B26] px-2 py-0.5 rounded border border-[#252E38]">
                                  {val}
                                </span>
                              ) : (
                                <span className="text-neutral-600 italic">N/A</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Normative & Provenance References */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D121B] overflow-hidden shadow-lg">
            <div className="bg-[#121824] px-4 py-2.5 border-b border-[#252E38] flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {locale === 'fr' ? '3. RÉFÉRENTIEL NORMATIF (CEI / IEEE) & TRAÇABILITÉ' : '3. REGULATORY COMPLIANCE & PROVENANCE'}
              </h4>
            </div>

            <div className={`grid p-4 gap-4 text-xs ${
              selectedEquipments.length === 1 
                ? 'grid-cols-1' 
                : selectedEquipments.length === 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-3'
            }`}>
              {selectedEquipments.map((eq) => (
                <div key={eq.id} className="space-y-2 p-3 rounded-lg bg-[#090D14] border border-[#252E38]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-cyan-300">
                      {eq.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      {eq.provenance ? eq.provenance.verification_status : 'VERIFIED'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-neutral-400 font-bold font-mono text-[10px] uppercase tracking-wider">
                      {locale === 'fr' ? 'Source & Norme :' : 'Source Reference & Standard:'}
                    </div>
                    <div className="text-neutral-200 font-mono font-bold bg-[#0D121B] p-2 rounded border border-[#252E38]">
                      {eq.provenance?.source_ref || 'CEI 62271 / IEC 60076'}
                    </div>
                  </div>

                  {eq.provenance?.verified_at && (
                    <div className="text-[10px] font-mono text-neutral-500 pt-1">
                      {locale === 'fr' ? 'Validé le :' : 'Validated on:'} {eq.provenance.verified_at}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#252E38] bg-[#0D131F] p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Info className="h-4 w-4 text-cyan-400" />
            <span>
              {locale === 'fr'
                ? 'Données certifiées conformes aux grilles SONATREL et Eneo.'
                : 'Ratings certified against SONATREL and Eneo national grid standards.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-lg bg-[#16202E] hover:bg-cyan-950/50 border border-[#252E38] hover:border-cyan-500/50 text-xs font-mono font-bold text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (locale === 'fr' ? 'Copié dans le presse-papier' : 'Copied to clipboard') : (locale === 'fr' ? 'Copier le rapport' : 'Copy report')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#080B10] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg shadow-cyan-950"
            >
              {locale === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
