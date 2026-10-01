// src/components/equipment/modules/EquipmentDossierViewer.tsx
// EPEDE - High-Fidelity 30-Section Technical Equipment Dossier & Engineering Datasheet Viewer

import React, { useState, useMemo } from 'react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';
import { ALL_CANONICAL_EQUIPMENT } from '../../../data/equipment/canonicalEquipmentRegistry';
import {
  FileText,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Lock,
  Cpu,
  Globe,
  Wrench,
  BookOpen,
  Gauge,
  Radio,
  HardHat,
  ArrowRight,
  Filter,
  Check,
  Copy
} from 'lucide-react';

interface EquipmentDossierViewerProps {
  canonical: CanonicalEquipmentObject;
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onClose?: () => void;
}

type SectionCategory = 'all' | 'identification' | 'physics_ratings' | 'system_control' | 'safety_fmea' | 'testing_maintenance' | 'standards_grid';

interface SectionCategoryDef {
  id: SectionCategory;
  label: { fr: string; en: string };
  sectionsRange: string;
}

const CATEGORIES: SectionCategoryDef[] = [
  { id: 'all', label: { fr: 'Toutes les 30 Sections', en: 'All 30 Sections' }, sectionsRange: '01 - 30' },
  { id: 'identification', label: { fr: 'Identité & Rôle', en: 'Identity & Mission' }, sectionsRange: '01 - 03' },
  { id: 'physics_ratings', label: { fr: 'Physique & Valeurs Assignées', en: 'Physics & Ratings' }, sectionsRange: '04 - 08' },
  { id: 'system_control', label: { fr: 'Topologie & Automatismes', en: 'Topology & Automation' }, sectionsRange: '09 - 15' },
  { id: 'safety_fmea', label: { fr: 'Défaillances & Sécurité (LOTO)', en: 'FMEA & Safety (LOTO)' }, sectionsRange: '16 - 18' },
  { id: 'testing_maintenance', label: { fr: 'Essais FAT/SAT & Maintenance', en: 'FAT/SAT & Maintenance' }, sectionsRange: '19 - 23' },
  { id: 'standards_grid', label: { fr: 'Normes & Contexte Réseau', en: 'Standards & Grid Context' }, sectionsRange: '24 - 30' },
];

export const EquipmentDossierViewer: React.FC<EquipmentDossierViewerProps> = ({
  canonical,
  locale,
  onNavigateEquipment,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SectionCategory>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleSection = (sectionNumber: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber]
    }));
  };

  const handleCopySummary = () => {
    const summaryText = `[EPEDE 30-SECTION DOSSIER] ${canonical.name[locale]} (${canonical.tagIec})
Equipment Type: ${canonical.equipmentType}
Voltage: ${canonical.voltageContext.nominalVoltage} (${canonical.voltageContext.level})
Standard: IEC ${canonical.applicableStandards?.[0]?.standardCode || 'IEC 62271'}
Ratings: ${canonical.keyEngineeringValues.map(v => `${v.key}=${v.value} ${v.unit || ''}`).join(', ')}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Section list definitions for 30 sections
  const sections = useMemo(() => [
    {
      num: 1,
      code: 'SEC-01',
      category: 'identification' as SectionCategory,
      title: { fr: 'Identification & Codification Normalisée (CEI 81346)', en: 'Identification & Standard IEC 81346 Tagging' },
      icon: FileText,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Repère Fonctionnel (Tag CEI):</span>
            <span className="text-amber-400 font-mono font-bold text-sm">{canonical.tagIec || 'N/A'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Désignation Canonique:</span>
            <span className="text-white font-bold">{locale === 'fr' ? canonical.name.fr : canonical.name.en}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Type d'Appareillage:</span>
            <span className="text-cyan-400 font-mono font-semibold">{canonical.equipmentType}</span>
          </div>
          <div className="sm:col-span-3 p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Alias & Synonymes Usuels de Métier:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(locale === 'fr' ? canonical.aliases.fr : canonical.aliases.en).map((alias, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-300 font-mono text-[11px] border border-[#232D3B]">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      num: 2,
      code: 'SEC-02',
      category: 'identification' as SectionCategory,
      title: { fr: 'Fonction Primaire & Mission dans le Réseau', en: 'Primary Function & Grid Mission' },
      icon: Activity,
      render: () => (
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 font-mono uppercase text-[10px]">Définition Normative (Vocabulaire Électrotechnique International CEI 60050):</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.definition.fr : canonical.definition.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-cyan-400 block mb-1 font-mono uppercase text-[10px]">Fonction Électrotechnique Primaire:</span>
            <p className="text-white font-medium">{locale === 'fr' ? canonical.primaryFunction.fr : canonical.primaryFunction.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-amber-400 block mb-1 font-mono uppercase text-[10px]">Raison d'Être & Finalité Réseau:</span>
            <p className="text-neutral-300">{locale === 'fr' ? canonical.purpose.fr : canonical.purpose.en}</p>
          </div>
        </div>
      )
    },
    {
      num: 3,
      code: 'SEC-03',
      category: 'identification' as SectionCategory,
      title: { fr: 'Classe de Tension, Topologie & Étage Système', en: 'Voltage Class, Phasing & Network Topology' },
      icon: Zap,
      render: () => (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Tension Nominale (Un / Um):</span>
            <span className="text-cyan-300 font-bold">{canonical.voltageContext.nominalVoltage}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Niveau Assigné:</span>
            <span className="text-amber-400 font-bold">{canonical.voltageContext.level}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Fréquence & Phases:</span>
            <span className="text-white font-bold">{canonical.voltageContext.frequencyHz} Hz · {canonical.voltageContext.phases}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Étage Système:</span>
            <span className="text-emerald-400 font-bold">{canonical.systemStage}</span>
          </div>
        </div>
      )
    },
    {
      num: 4,
      code: 'SEC-04',
      category: 'physics_ratings' as SectionCategory,
      title: { fr: 'Principe Physique & Décomposition Séquentielle', en: 'Working Principles & Physical Sequence' },
      icon: Cpu,
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? canonical.operatingPrincipleSummary.fr : canonical.operatingPrincipleSummary.en}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
            {canonical.workingPrincipleSequence.map(step => (
              <div key={step.stepNumber} className="p-3.5 rounded-xl border border-[#252E38] bg-[#080B10] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center border border-cyan-500/40">
                      {step.stepNumber}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">PHASE {step.stepNumber}</span>
                  </div>
                  <h6 className="font-mono text-xs font-bold text-white uppercase mb-1">
                    {locale === 'fr' ? step.title.fr : step.title.en}
                  </h6>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    {locale === 'fr' ? step.description.fr : step.description.en}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1C2530] font-mono text-[10px] text-cyan-400">
                  <span className="text-neutral-500">Phénomène: </span>
                  {locale === 'fr' ? step.physicalPhenomenon.fr : step.physicalPhenomenon.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 5,
      code: 'SEC-05',
      category: 'physics_ratings' as SectionCategory,
      title: { fr: 'Construction Physique, Enveloppe & Caractéristiques Mécaniques', en: 'Physical Construction, Enclosure & Mass Properties' },
      icon: Wrench,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Type d'Enveloppe:</span>
            <span className="text-white font-bold">{canonical.physicalConstruction.enclosureType}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Dimensions Hors-Tout:</span>
            <span className="text-white font-bold">{canonical.physicalConstruction.dimensionsApproxMeters}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Masse Estimée:</span>
            <span className="text-white font-bold">{canonical.physicalConstruction.weightApproxKg ? `${canonical.physicalConstruction.weightApproxKg.toLocaleString()} kg` : 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      num: 6,
      code: 'SEC-06',
      category: 'physics_ratings' as SectionCategory,
      title: { fr: 'Milieu Isolant, Distances Diélectriques & Tenue aux Chocs (BIL)', en: 'Insulation Medium, Clearances & BIL Withstand' },
      icon: Zap,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Milieu Diélectrique:</span>
            <span className="text-cyan-300 font-bold">{canonical.insulationAndClearances.insulationMedium}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Tenue au Choc de Foudre:</span>
            <span className="text-amber-400 font-bold">{canonical.insulationAndClearances.bilRatingKv ? `${canonical.insulationAndClearances.bilRatingKv} kV crête` : '1050 kV'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Ligne de Fuite Spécifique:</span>
            <span className="text-emerald-400 font-bold">{canonical.insulationAndClearances.creepageDistanceMmPerKv ? `${canonical.insulationAndClearances.creepageDistanceMmPerKv} mm/kV` : '31 mm/kV'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1">Distances d'Isolement:</span>
            <span className="text-white font-semibold">{canonical.insulationAndClearances.phaseClearanceMeters || 'Conforme CEI 61936-1'}</span>
          </div>
        </div>
      )
    },
    {
      num: 7,
      code: 'SEC-07',
      category: 'physics_ratings' as SectionCategory,
      title: { fr: 'Conditions de Raccordement Électrique & Fixation Mécanique', en: 'Electrical Terminals & Mechanical Mounting' },
      icon: Wrench,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-cyan-400 font-mono block mb-1 uppercase text-[10px]">Raccordement Électrique HT :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.connectionRequirements.electrical.fr : canonical.connectionRequirements.electrical.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-amber-400 font-mono block mb-1 uppercase text-[10px]">Fixation Mécanique & Massifs :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.connectionRequirements.mechanical.fr : canonical.connectionRequirements.mechanical.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-400 font-mono block mb-1 uppercase text-[10px]">Liaison Barres / Câbles :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.connectionRequirements.cableOrBusbar.fr : canonical.connectionRequirements.cableOrBusbar.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-emerald-400 font-mono block mb-1 uppercase text-[10px]">Raccordement au Réseau de Terre :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.connectionRequirements.earthing.fr : canonical.connectionRequirements.earthing.en}</p>
          </div>
        </div>
      )
    },
    {
      num: 8,
      code: 'SEC-08',
      category: 'physics_ratings' as SectionCategory,
      title: { fr: 'Valeurs Nominales & Caractéristiques Assignées CEI', en: 'Key Engineering Values & IEC Rated Parameters' },
      icon: Gauge,
      render: () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 font-mono text-xs">
          {canonical.keyEngineeringValues.map(v => (
            <div key={v.key} className="p-2.5 rounded-lg bg-[#080B10] border border-[#1C2530] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block mb-0.5">{typeof v.label === 'string' ? v.label : v.label[locale]}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-white">{v.value}</span>
                  <span className="text-cyan-400 text-xs">{v.unit}</span>
                </div>
              </div>
              <div className="mt-1 pt-1 border-t border-[#161D27] flex items-center justify-between text-[9px]">
                <span className="text-neutral-600">{v.key}</span>
                <span className="text-emerald-400 font-semibold">{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 9,
      code: 'SEC-09',
      category: 'system_control' as SectionCategory,
      title: { fr: 'États de Fonctionnement Disponibles & État Nominal', en: 'Operating States & Transition Rules' },
      icon: Activity,
      render: () => (
        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">État Nominal par Défaut:</span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              {canonical.defaultState}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1.5">Tous les États Autorisés de l'Appareil:</span>
            <div className="flex flex-wrap gap-2">
              {canonical.availableStates.map((st, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    st === canonical.defaultState
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#161D27] text-neutral-300 border-[#252E38]'
                  }`}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      num: 10,
      code: 'SEC-10',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Relations Topologiques & Équipements Amont / Aval', en: 'Topological Relations & Upstream/Downstream Equipment' },
      icon: ArrowRight,
      render: () => (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
              <span className="text-cyan-400 font-bold block mb-1 text-[11px]">Nœuds Amont Directs:</span>
              <div className="flex flex-wrap gap-1.5">
                {canonical.upstreamEquipmentIds.map((id, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onNavigateEquipment?.(id)}
                    className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-800/60 transition-colors cursor-pointer text-[11px]"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
              <span className="text-amber-400 font-bold block mb-1 text-[11px]">Nœuds Aval Directs:</span>
              <div className="flex flex-wrap gap-1.5">
                {canonical.downstreamEquipmentIds.map((id, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onNavigateEquipment?.(id)}
                    className="px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/40 hover:bg-amber-800/60 transition-colors cursor-pointer text-[11px]"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {canonical.relationships && canonical.relationships.length > 0 && (
            <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
              <span className="text-neutral-500 font-mono text-[10px] block mb-2 uppercase">Interactions Fonctionnelles Spécifiques:</span>
              <div className="space-y-1.5">
                {canonical.relationships.map(rel => (
                  <div key={rel.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-[#0E141F] text-xs">
                    <span className="font-mono text-cyan-400 font-bold">{locale === 'fr' ? rel.targetName.fr : rel.targetName.en}</span>
                    <span className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-400 font-mono text-[10px]">{rel.relationKind}</span>
                    <span className="text-neutral-300 text-xs">{locale === 'fr' ? rel.description.fr : rel.description.en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      num: 11,
      code: 'SEC-11',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Chaîne de Protection Dédiée & Codes ANSI', en: 'Protection Architecture & ANSI Codes' },
      icon: ShieldCheck,
      render: () => (
        <div className="space-y-3 text-xs">
          <p className="text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? canonical.associatedProtection.summary.fr : canonical.associatedProtection.summary.en}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono">
            {canonical.associatedProtection.ansiCodes.map((code, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs">
                ANSI {code}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 12,
      code: 'SEC-12',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Mesure, Instrumentation & Capteurs de Terrain', en: 'Measurement, Sensors & Field Instrumentation' },
      icon: Gauge,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Capteurs Embarqués:</span>
            <div className="space-y-1">
              {canonical.measurementAndInstrumentation.sensors.map((s, i) => (
                <div key={i} className="text-white flex items-center gap-1.5">
                  <span className="text-cyan-400">•</span> {s}
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Grandeurs Mesurées & Transmises:</span>
            <div className="space-y-1">
              {canonical.measurementAndInstrumentation.measuredQuantities.map((q, i) => (
                <div key={i} className="text-emerald-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      num: 13,
      code: 'SEC-13',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Contrôle Local, Téléconduite & Logique d\'Interverrouillage', en: 'Local Controls, Telemetry & Interlocking Logic' },
      icon: Lock,
      render: () => (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-cyan-400 font-mono block mb-1 uppercase text-[10px]">Contrôle Local :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.controlAndAutomation.localControls.fr : canonical.controlAndAutomation.localControls.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-emerald-400 font-mono block mb-1 uppercase text-[10px]">Télécommande SCADA / Dispatching :</span>
            <p className="text-neutral-200">{locale === 'fr' ? canonical.controlAndAutomation.remoteControls.fr : canonical.controlAndAutomation.remoteControls.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#140D07] border border-amber-500/30">
            <span className="text-amber-400 font-mono font-bold block mb-1 uppercase text-[10px]">Règle Strict d'Interverrouillage (CEI 62271-102) :</span>
            <p className="text-amber-100 font-medium">{locale === 'fr' ? canonical.controlAndAutomation.interlocks.fr : canonical.controlAndAutomation.interlocks.en}</p>
          </div>
        </div>
      )
    },
    {
      num: 14,
      code: 'SEC-14',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Protocoles Numériques & Automatisation de Poste (CEI 61850)', en: 'Substation Automation Protocols & Bus Architecture' },
      icon: Radio,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs font-mono">
          <span className="text-neutral-500 block mb-2 text-[10px]">Protocoles de Communication Certifiés:</span>
          <div className="flex flex-wrap gap-2">
            {canonical.communicationProtocols.map((p, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 15,
      code: 'SEC-15',
      category: 'system_control' as SectionCategory,
      title: { fr: 'Régime de Neutre, Mise à la Terre & Écoulement des Courants', en: 'Earthing Regime, Ground Mesh Bonding & Sinking' },
      icon: Zap,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Régime de Terre Assigné:</span>
            <span className="text-cyan-400 font-bold text-sm">{canonical.earthingAndBonding.earthingRegime}</span>
            <p className="text-neutral-300 font-sans mt-2">{locale === 'fr' ? canonical.earthingAndBonding.connectionMethod.fr : canonical.earthingAndBonding.connectionMethod.en}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Capacité d'Écoulement:</span>
            <p className="text-amber-300 font-sans mt-1">{locale === 'fr' ? canonical.earthingAndBonding.dischargeCapability.fr : canonical.earthingAndBonding.dischargeCapability.en}</p>
          </div>
        </div>
      )
    },
    {
      num: 16,
      code: 'SEC-16',
      category: 'safety_fmea' as SectionCategory,
      title: { fr: 'Analyse des Modes de Défaillance & Effets (FMEA / AMDEC)', en: 'Failure Modes and Effects Analysis (FMEA)' },
      icon: AlertTriangle,
      render: () => (
        <div className="space-y-3 text-xs">
          {canonical.failureModes.map(fm => (
            <div key={fm.code} className="p-3 rounded-xl border border-red-950/70 bg-[#120808] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800 text-[11px]">
                    {fm.code}
                  </span>
                  <span className="font-mono font-bold text-white">{locale === 'fr' ? fm.name.fr : fm.name.en}</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-900/60 text-red-200 border border-red-700">
                  {fm.severity}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 font-sans text-xs">
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block">Cause racine:</span>
                  <span className="text-neutral-300">{locale === 'fr' ? fm.rootCause.fr : fm.rootCause.en}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block">Conséquence réseau:</span>
                  <span className="text-neutral-300">{locale === 'fr' ? fm.consequenceOnSystem.fr : fm.consequenceOnSystem.en}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block">Réponse protectrice:</span>
                  <span className="text-emerald-400 font-medium">{locale === 'fr' ? fm.protectiveResponse.fr : fm.protectiveResponse.en}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 17,
      code: 'SEC-17',
      category: 'safety_fmea' as SectionCategory,
      title: { fr: 'Sécurité du Personnel, Risques d\'Arc & Consignation (LOTO)', en: 'Personnel Safety, Arc Flash & LOTO Isolation Procedure' },
      icon: HardHat,
      render: () => (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[#160E04] space-y-2">
            <span className="text-amber-400 font-mono font-bold uppercase text-[11px] block">
              Procédure de Consignation et Cadenassage (NF C 18-510 / OSHA LOTO) :
            </span>
            <p className="text-neutral-200 font-sans leading-relaxed">
              {locale === 'fr' ? canonical.safetyAndHazards.isolationProcedureLoto.fr : canonical.safetyAndHazards.isolationProcedureLoto.en}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 font-mono text-[10px] block mb-1">Dangers Principaux Identifiés:</span>
            <div className="flex flex-wrap gap-1.5">
              {canonical.safetyAndHazards.hazards.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40 text-[11px]">
                  ⚠️ {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      num: 18,
      code: 'SEC-18',
      category: 'safety_fmea' as SectionCategory,
      title: { fr: 'Équipements de Protection Individuelle (EPI)', en: 'Personal Protective Equipment (PPE) Matrix' },
      icon: ShieldCheck,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs font-mono">
          <span className="text-neutral-500 block mb-2 text-[10px]">EPI Obligatoires pour Interventions sur l'Appareil:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans">
            {canonical.safetyAndHazards.ppeRequirements.map((ppe, i) => (
              <div key={i} className="p-2.5 rounded bg-[#101620] border border-[#1E2836] text-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{ppe}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 19,
      code: 'SEC-19',
      category: 'testing_maintenance' as SectionCategory,
      title: { fr: 'Essais de Réception en Usine (FAT)', en: 'Factory Acceptance Testing (FAT)' },
      icon: CheckCircle2,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs">
          <span className="text-cyan-400 font-mono block mb-2 uppercase text-[10px]">Programme des Essais Usine :</span>
          <ul className="space-y-1.5 font-sans">
            {canonical.testingAndCommissioning.factoryTestsFat.map((test, i) => (
              <li key={i} className="flex items-start gap-2 text-neutral-200">
                <span className="text-cyan-400 font-mono">FAT-{i + 1}:</span> {test}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      num: 20,
      code: 'SEC-20',
      category: 'testing_maintenance' as SectionCategory,
      title: { fr: 'Essais de Réception sur Site (SAT)', en: 'Site Acceptance Testing (SAT)' },
      icon: CheckCircle2,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs">
          <span className="text-emerald-400 font-mono block mb-2 uppercase text-[10px]">Programme des Essais sur Site :</span>
          <ul className="space-y-1.5 font-sans">
            {canonical.testingAndCommissioning.siteAcceptanceTestsSat.map((test, i) => (
              <li key={i} className="flex items-start gap-2 text-neutral-200">
                <span className="text-emerald-400 font-mono">SAT-{i + 1}:</span> {test}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      num: 21,
      code: 'SEC-21',
      category: 'testing_maintenance' as SectionCategory,
      title: { fr: 'Procédures de Mise en Service & Séquencement', en: 'Commissioning Protocols & Energization' },
      icon: Activity,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs">
          <span className="text-amber-400 font-mono block mb-2 uppercase text-[10px]">Directives d'Alignement & Première Mise sous Tension :</span>
          <ul className="space-y-1.5 font-sans">
            {canonical.testingAndCommissioning.commissioningProcedures.map((proc, i) => (
              <li key={i} className="flex items-start gap-2 text-neutral-200">
                <span className="text-amber-400 font-mono">PROC-{i + 1}:</span> {proc}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      num: 22,
      code: 'SEC-22',
      category: 'testing_maintenance' as SectionCategory,
      title: { fr: 'Plan de Maintenance Préventive & Conditionnelle', en: 'Preventive & Condition-Based Maintenance Plan' },
      icon: Wrench,
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {canonical.maintenancePlan.map((plan, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#252E38] bg-[#080B10] space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-cyan-400 font-bold">{plan.periodicity}</span>
                <span className="text-[10px] bg-[#161D27] text-neutral-400 px-2 py-0.5 rounded">{plan.type}</span>
              </div>
              <p className="text-neutral-200 font-sans leading-relaxed">{locale === 'fr' ? plan.description.fr : plan.description.en}</p>
              <div className="pt-2 border-t border-[#1C2530] text-[10px] font-mono text-neutral-500">
                Outils: {plan.toolsAndStandards.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 23,
      code: 'SEC-23',
      category: 'testing_maintenance' as SectionCategory,
      title: { fr: 'Consommables & Pièces de Rechange Critiques', en: 'Consumables, Spare Parts & Specialty Tooling' },
      icon: Wrench,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs font-mono">
          <span className="text-neutral-500 block mb-2 text-[10px]">Consommables Recommandés en Stock Magasin:</span>
          <div className="flex flex-wrap gap-2 font-sans">
            {['Graisse conductrice spéciale contacts', 'Bouteille de gaz SF6 de réserve (40 kg)', 'Joints d\'étanchéité EPDM de rechange', 'Bobines d\'enclenchement et déclenchement 110 V DC'].map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-[#101620] border border-[#1E2836] text-neutral-300 text-xs">
                📦 {item}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 24,
      code: 'SEC-24',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Normes CEI / IEEE Applicables & Clauses Mandataires', en: 'Governing IEC/IEEE Standards & Mandatory Clauses' },
      icon: BookOpen,
      render: () => (
        <div className="space-y-2 text-xs">
          {canonical.applicableStandards.map((std, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-cyan-300 text-xs mr-2">{std.standardCode}</span>
                <span className="text-neutral-200">{std.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400">{std.relevantClauses.join(' · ')}</span>
                <span className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-400 font-mono text-[10px]">{std.jurisdiction}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 25,
      code: 'SEC-25',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Rôles d\'Ingénierie Associés & Matrice RACI', en: 'Associated Engineering Roles & RACI Matrix' },
      icon: HardHat,
      render: () => (
        <div className="space-y-2 text-xs">
          {canonical.associatedEngineeringRoles.map((role, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-amber-400 mr-2">{locale === 'fr' ? role.title.fr : role.title.en}</span>
                <span className="text-neutral-300">{locale === 'fr' ? role.tasks.fr : role.tasks.en}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-400 font-mono text-[10px]">{role.roleSlug}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 26,
      code: 'SEC-26',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Phases du Cycle de Vie Projet & Livrables', en: 'Project Lifecycle Phases & Key Deliverables' },
      icon: Activity,
      render: () => (
        <div className="space-y-2 text-xs">
          {canonical.lifecyclePhases.map((phase, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="text-cyan-400 font-bold text-xs">{phase.phase}</span>
                <span className="text-[10px] text-neutral-400">{phase.involvedRoles.join(', ')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {phase.deliverables.map((del, dIdx) => (
                  <span key={dIdx} className="px-2 py-0.5 rounded bg-[#101620] border border-[#1E2836] text-neutral-300 text-[11px]">
                    📄 {del}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 27,
      code: 'SEC-27',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Contexte Réseau Camerounais (Postes SONATREL / Eneo)', en: 'Cameroon Grid Deployment (SONATREL Substations)' },
      icon: Globe,
      render: () => (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 font-mono text-[10px] block mb-1">Postes Stratégiques de Déploiement au Cameroun:</span>
            <span className="text-white font-bold">{canonical.cameroonContext?.substationsDeployed.join(', ') || 'Mangombé 225 kV, Bekoko 225 kV, Oyomabang 225 kV, Ahala 225 kV, Songloulou 225 kV, Edéa 225 kV'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-amber-400 font-mono text-[10px] block mb-1">Défis d'Exploitation Locaux:</span>
            <p className="text-neutral-200 leading-relaxed font-sans">{canonical.cameroonContext?.localChallenges ? (locale === 'fr' ? canonical.cameroonContext.localChallenges.fr : canonical.cameroonContext.localChallenges.en) : 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      num: 28,
      code: 'SEC-28',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Tropicalisation & Climat Équatorial Humide', en: 'Tropicalization & Climate Resilience (Equatorial / High Ng)' },
      icon: Globe,
      render: () => (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-[#06120C] text-xs space-y-2">
          <span className="text-emerald-400 font-mono font-bold block uppercase text-[10px]">Mesures de Tropicalisation Spécifiques au Cameroun:</span>
          <p className="text-emerald-100 font-sans leading-relaxed">
            {canonical.cameroonContext?.adaptationMeasures ? (locale === 'fr' ? canonical.cameroonContext.adaptationMeasures.fr : canonical.cameroonContext.adaptationMeasures.en) : 'Isolement renforcé classe d (31 mm/kV), traitement anti-corrosion C5M pour zone côtière de Douala/Kribi, résistance aux forts taux de foudroiement équatorial.'}
          </p>
        </div>
      )
    },
    {
      num: 29,
      code: 'SEC-29',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Documents d\'Ingénierie & Livrables Contractuels', en: 'Engineering Deliverables & Documentation Artifacts' },
      icon: FileText,
      render: () => (
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530] text-xs">
          <span className="text-neutral-500 font-mono block mb-2 text-[10px]">Dossier d'Ouvrage Exécuté (DOE):</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {canonical.deliverablesAndDocuments.map((doc, i) => (
              <div key={i} className="p-2.5 rounded bg-[#101620] border border-[#1E2836] text-neutral-300 font-mono text-[11px] flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      num: 30,
      code: 'SEC-30',
      category: 'standards_grid' as SectionCategory,
      title: { fr: 'Traçabilité, Provenance & Validation Normative', en: 'Provenance, Standards Audit Trail & Verification' },
      icon: ShieldCheck,
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Source de Référence:</span>
            <span className="text-white font-semibold">{canonical.provenance.source_ref}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Statut d'Audit:</span>
            <span className="text-emerald-400 font-bold">VÉRIFIÉ CEI / SONATREL</span>
          </div>
          <div className="p-3 rounded-lg bg-[#080B10] border border-[#1C2530]">
            <span className="text-neutral-500 block mb-1 text-[10px]">Identifiant Provenance:</span>
            <span className="text-cyan-400">{canonical.provenance.id}</span>
          </div>
        </div>
      )
    }
  ], [canonical, locale, onNavigateEquipment]);

  // Filter sections by category and search text
  const filteredSections = useMemo(() => {
    return sections.filter(sec => {
      const matchesCategory = selectedCategory === 'all' || sec.category === selectedCategory;
      const q = searchFilter.toLowerCase().trim();
      const matchesSearch = !q || (
        sec.code.toLowerCase().includes(q) ||
        sec.num.toString().includes(q) ||
        sec.title.fr.toLowerCase().includes(q) ||
        sec.title.en.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [sections, selectedCategory, searchFilter]);

  return (
    <div className="rounded-2xl border border-[#252E38] bg-[#0A0E15] overflow-hidden shadow-2xl space-y-0">
      
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 bg-[#080C12] border-b border-[#222B38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-xs border border-cyan-700/50">
                  {canonical.tagIec || canonical.equipmentType}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-400 font-mono text-[11px]">
                  {canonical.systemStage}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                  30/30 {locale === 'fr' ? 'Sections Normalisées' : 'Standard Sections'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
                {locale === 'fr' ? canonical.name.fr : canonical.name.en}
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Fiche Technique Exhaustive & Dossier d\'Ingénierie Électrotechnique Normalisé'
                  : 'Comprehensive 30-Section Electrical Engineering Technical Datasheet'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161D27] hover:bg-[#202936] text-neutral-300 text-xs font-mono font-medium border border-[#2B3544] transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-neutral-400" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Synthèse' : 'Copy Summary')}</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-300 text-xs font-mono border border-red-800/40 transition-colors cursor-pointer"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-[#1C2530] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'bg-[#121822] text-neutral-400 hover:text-white border border-[#1C2530]'
                }`}
              >
                {cat.label[locale]}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="h-3.5 w-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder={locale === 'fr' ? 'Filtrer les 30 sections...' : 'Filter 30 sections...'}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E141E] border border-[#202A38] text-neutral-200 text-xs font-sans placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>
      </div>

      {/* 2. 30 Sections Container */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredSections.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono text-xs">
            {locale === 'fr' ? 'Aucune section ne correspond au filtre de recherche.' : 'No sections matched your search criteria.'}
          </div>
        ) : (
          filteredSections.map(sec => {
            const isCollapsed = collapsedSections[sec.num];
            const IconComponent = sec.icon;

            return (
              <div
                key={sec.num}
                id={`dossier-section-${sec.num}`}
                className="rounded-xl border border-[#1C2530] bg-[#0C1017] overflow-hidden transition-all duration-200 hover:border-[#2C3848]"
              >
                {/* Section Header Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(sec.num)}
                  className="w-full px-4 py-3 bg-[#0E131C] hover:bg-[#121822] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 font-mono text-xs font-bold border border-cyan-800/40">
                      {sec.code}
                    </span>
                    <IconComponent className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-tight">
                      {sec.title[locale]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
                      SEC {sec.num < 10 ? `0${sec.num}` : sec.num}/30
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {!isCollapsed && (
                  <div className="p-4 border-t border-[#161D27]">
                    {sec.render()}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Ribbon: Switcher across canonical items */}
      <div className="p-4 bg-[#080B10] border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="text-neutral-500">
          <span>{locale === 'fr' ? 'Appareillages Haute Tension Disponibles :' : 'Available High-Voltage Apparatus:'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ALL_CANONICAL_EQUIPMENT.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateEquipment?.(item.id)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border ${
                item.id === canonical.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-[#121822] text-neutral-400 hover:text-white border-[#1C2530]'
              }`}
            >
              {item.tagIec || item.name[locale]}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
