// src/components/journey/ThematicJourneysWorkbench.tsx
// EPEDE ProCode Redesign — Route 2: Learn (#/en/learn & #/thematic-journeys)
// Bright editorial curriculum with:
// 1. Editorial introduction & Recommended Entry Point for first-time learners
// 2. 9-Stage Power-System Sequence Visual mapping Pathways 01–08 across Stages 01–09
// 3. Keyboard-operable audience filters & readable editorial index rows (not 8 boxed cards)
// 4. Interactive lesson & applied masterclass workbench with knowledge checks preserved

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Zap,
  ShieldCheck,
  Building2,
  Activity,
  Cpu,
  Globe,
  Clock,
  Sparkles,
  HelpCircle,
  Check,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  PROGRESSIVE_LEARNING_PATHWAYS,
  ProgressivePathway,
  PathwayLessonSection,
} from '../../data/learningPathwaysData';
import {
  THEMATIC_JOURNEYS,
  ThematicJourney,
  JourneyStep,
} from '../../data/thematicJourneysData';
import type { AppViewType } from '../../services/routerService';
import { PageHeader, DataStrip, FinalCTA } from '../common';

interface ThematicJourneysWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: AppViewType, context?: any) => void;
  initialJourneyId?: string;
}

type LearningTabMode = 'PATHWAYS' | 'MASTERCLASSES';

const STAGE_SEQUENCE_MAP: Array<{
  stageNum: string;
  stageEn: string;
  stageFr: string;
  voltage: string;
  pathwayOrder: string;
}> = [
  { stageNum: '01', stageEn: 'Generation', stageFr: 'Production', voltage: '10.3 kV', pathwayOrder: '01' },
  { stageNum: '02', stageEn: 'Step-Up', stageFr: 'Élévation', voltage: '10.3/225 kV', pathwayOrder: '02' },
  { stageNum: '03', stageEn: 'HV Grid', stageFr: 'Transport HTB', voltage: '225 kV', pathwayOrder: '04' },
  { stageNum: '04', stageEn: 'Substation', stageFr: 'Poste Source', voltage: '225/90/30 kV', pathwayOrder: '04' },
  { stageNum: '05', stageEn: 'Distribution', stageFr: 'Distribution', voltage: '30/15 kV', pathwayOrder: '03' },
  { stageNum: '06', stageEn: 'LV Panel', stageFr: 'Tableau TGBT', voltage: '400 V', pathwayOrder: '03' },
  { stageNum: '07', stageEn: 'Protection', stageFr: 'Protection', voltage: 'ANSI / IEC', pathwayOrder: '05' },
  { stageNum: '08', stageEn: 'Motors & Loads', stageFr: 'Force Motrice', voltage: '400 V / 6.6 kV', pathwayOrder: '06' },
  { stageNum: '09', stageEn: 'SCADA & Safety', stageFr: 'SCADA & Sécurité', voltage: '24 Vdc / NF C', pathwayOrder: '07 · 08' },
];

export const ThematicJourneysWorkbench: React.FC<ThematicJourneysWorkbenchProps> = ({
  locale,
  onNavigate,
  initialJourneyId,
}) => {
  const isFr = locale === 'fr';

  const [activeTab, setActiveTab] = useState<LearningTabMode>(() => {
    if (initialJourneyId && initialJourneyId.startsWith('journey-')) {
      return 'MASTERCLASSES';
    }
    return 'PATHWAYS';
  });

  const [levelFilter, setLevelFilter] = useState<'ALL' | 'beginner' | 'technician' | 'engineer'>('ALL');

  const [selectedPathway, setSelectedPathway] = useState<ProgressivePathway>(() => {
    if (initialJourneyId && initialJourneyId.startsWith('pathway-')) {
      const found = PROGRESSIVE_LEARNING_PATHWAYS.find((p) => p.id === initialJourneyId);
      if (found) return found;
    }
    return PROGRESSIVE_LEARNING_PATHWAYS[0];
  });
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [pathwayAnswer, setPathwayAnswer] = useState<number | null>(null);
  const [isPathwayAnswerSubmitted, setIsPathwayAnswerSubmitted] = useState<boolean>(false);

  const [selectedJourney, setSelectedJourney] = useState<ThematicJourney>(() => {
    if (initialJourneyId && initialJourneyId.startsWith('journey-')) {
      const found = THEMATIC_JOURNEYS.find((j) => j.id === initialJourneyId);
      if (found) return found;
    }
    return THEMATIC_JOURNEYS[0];
  });
  const [activeMasterclassStepIndex, setActiveMasterclassStepIndex] = useState<number>(0);
  const [masterclassAnswer, setMasterclassAnswer] = useState<number | null>(null);
  const [isMasterclassAnswerSubmitted, setIsMasterclassAnswerSubmitted] = useState<boolean>(false);

  const [completedItems, setCompletedItems] = useState<Record<string, number[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('epede-learning-completed-items');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const markCompleted = (id: string, stepNumber: number) => {
    setCompletedItems((prev) => {
      const current = prev[id] || [];
      if (current.includes(stepNumber)) return prev;
      const updated = { ...prev, [id]: [...current, stepNumber] };
      try {
        localStorage.setItem('epede-learning-completed-items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isCompleted = (id: string, stepNumber: number) => {
    return (completedItems[id] || []).includes(stepNumber);
  };

  const filteredPathways = useMemo(() => {
    return PROGRESSIVE_LEARNING_PATHWAYS.filter((p) => {
      if (levelFilter === 'ALL') return true;
      return p.level === levelFilter;
    });
  }, [levelFilter]);

  useEffect(() => {
    setPathwayAnswer(null);
    setIsPathwayAnswerSubmitted(false);
  }, [activeLessonIndex, selectedPathway.id]);

  useEffect(() => {
    setMasterclassAnswer(null);
    setIsMasterclassAnswerSubmitted(false);
  }, [activeMasterclassStepIndex, selectedJourney.id]);

  const activeLesson: PathwayLessonSection | undefined = selectedPathway.lessons[activeLessonIndex];
  const activeMasterclassStep: JourneyStep | undefined = selectedJourney.steps[activeMasterclassStepIndex];

  const handleLaunchTargetTool = (action?: { type: string; targetId: string }) => {
    if (!onNavigate || !action) return;
    switch (action.type) {
      case 'EQUIPMENT':
        onNavigate('equipment', { equipmentId: action.targetId });
        break;
      case 'CALCULATOR':
        onNavigate('calculators', { calculatorTab: action.targetId });
        break;
      case 'SIMULATION':
        onNavigate('simulation', { simulationTab: action.targetId });
        break;
      case 'GRID':
        onNavigate('cameroon-grid');
        break;
      case 'SCENARIO':
        onNavigate('scenarios', { entityId: action.targetId });
        break;
      case 'STANDARDS':
        onNavigate('standards');
        break;
      default:
        break;
    }
  };

  const getIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Zap':
        return <Zap className={`${className} text-[#B8872D]`} />;
      case 'Cpu':
        return <Cpu className={`${className} text-[#147C78]`} />;
      case 'Building2':
        return <Building2 className={`${className} text-[#147C78]`} />;
      case 'Compass':
        return <Compass className={`${className} text-[#147C78]`} />;
      case 'Activity':
        return <Activity className={`${className} text-[#B8872D]`} />;
      case 'ShieldCheck':
        return <ShieldCheck className={`${className} text-[#15803D]`} />;
      case 'Globe':
        return <Globe className={`${className} text-[#147C78]`} />;
      default:
        return <BookOpen className={`${className} text-[#147C78]`} />;
    }
  };

  const recommendedFirstPathway = PROGRESSIVE_LEARNING_PATHWAYS[0];

  return (
    <div className="space-y-12 pb-20 font-['Space_Grotesk',sans-serif] text-[#0B1B2B] bg-[#FBFCFD]">
      {/* 1. Page Header (SITEWIDE-REDESIGN.md Section 2) */}
      <PageHeader
        breadcrumb={[
          { label: isFr ? 'Accueil' : 'Home', onClick: () => onNavigate?.('home') },
          { label: isFr ? 'Apprendre' : 'Learn' },
          { label: isFr ? '8 Parcours Progressifs' : '8 Guided Pathways' },
        ]}
        eyebrow={isFr ? 'CURSUS GUIDÉ · 8 PARCOURS SYSTÈME' : 'GUIDED CURRICULUM · 8 SYSTEM PATHWAYS'}
        title={
          isFr
            ? 'Apprendre le système électrique dans l’ordre physique'
            : 'Learn the power system in physical sequence'
        }
        intro={
          isFr
            ? 'Comprenez d’abord le phénomène physique avec une analogie concrète, observez l’intérieur de l’appareillage réel, lisez son symbole CEI 60617, puis appliquez le calcul sur le réseau camerounais.'
            : 'First grasp the physical phenomenon through a concrete analogy, inspect real internal switchgear cutaways, read the IEC 60617 symbol, and apply the calculation to Cameroon grid cases.'
        }
      >
        <DataStrip
          items={[
            {
              label: isFr ? 'Parcours Système' : 'System Pathways',
              value: '08',
              subtext: isFr ? 'De la production aux charges' : 'Generation to end-users',
            },
            {
              label: isFr ? 'Masterclasses' : 'Case Studies',
              value: '07',
              subtext: isFr ? 'Études d’ingénierie appliquée' : 'Applied engineering studies',
            },
            {
              label: isFr ? 'Niveaux Techniques' : 'Audience Levels',
              value: '4',
              unit: 'tiers',
              subtext: 'Student · Tech · Engineer · Expert',
            },
            {
              label: isFr ? 'Ancrage Terrain' : 'Field Context',
              value: 'RIS / RIN',
              subtext: 'SONATREL / Eneo Network',
            },
          ]}
        />
      </PageHeader>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Mode Switcher: 8 Pathways vs 7 Applied Masterclasses */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label={isFr ? 'Mode d’apprentissage' : 'Learning curriculum mode'}
            className="inline-flex items-center p-1 rounded-full bg-[#EEF4F8] border border-[#D5E0E8]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'PATHWAYS'}
              onClick={() => setActiveTab('PATHWAYS')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-semibold transition-colors cursor-pointer border-0 ${
                activeTab === 'PATHWAYS'
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] shadow-xs'
                  : 'bg-transparent text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? '8 Parcours (01–08)' : '8 Pathways (01–08)'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'MASTERCLASSES'}
              onClick={() => setActiveTab('MASTERCLASSES')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-semibold transition-colors cursor-pointer border-0 ${
                activeTab === 'MASTERCLASSES'
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] shadow-xs'
                  : 'bg-transparent text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isFr ? '7 Masterclass Appliquées' : '7 Applied Masterclasses'}</span>
            </button>
          </div>
        </div>

        {/* Recommended Entry Point Banner for First-Time Learners */}
        <div className="bg-[#FBFCFD] border border-[#D5E0E8] border-l-[3px] border-l-[#1F5FAE] rounded-[6px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_2px_12px_rgba(11,27,43,0.04)]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-[#1F5FAE] font-bold uppercase tracking-wider">
                {isFr ? 'Point de départ recommandé' : 'Recommended starting point'}
              </span>
              <span className="text-[#D5E0E8]">·</span>
              <span className="text-[#5B6B7B] font-semibold">
                {isFr ? 'Parcours 01 · ~25 min' : 'Pathway 01 · ~25 min'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1B2B] m-0 font-['Space_Grotesk']">
              {recommendedFirstPathway.title[locale]}
            </h2>
            <p className="text-sm text-[#3A4B5C] leading-relaxed m-0 font-['Space_Grotesk']">
              {recommendedFirstPathway.tagline[locale]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('PATHWAYS');
                setSelectedPathway(recommendedFirstPathway);
                setActiveLessonIndex(0);
                const el = document.getElementById('learn-active-workbench');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-10 px-5 rounded-full bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#FBFCFD] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer border-0"
            >
              <span>{isFr ? 'Commencer le Parcours 01' : 'Start Pathway 01'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="h-10 px-4 rounded-full bg-transparent hover:bg-[#EEF4F8] text-[#0B1B2B] border border-[#D5E0E8] font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>{isFr ? 'Voir la chaîne 01–09' : 'View 01–09 Power Chain'}</span>
              </button>
            )}
          </div>
        </div>

      {/* 2. Power-System Sequence Visual — Where Each Pathway Fits on Stages 01–09 */}
      <section className="border-t border-[#DEDACF] pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Séquence du Réseau (Étapes 01–09)' : 'Power-System Sequence (Stages 01–09)'}
            </span>
            <h2 className="text-lg font-bold text-[#17282C] mt-1">
              {isFr
                ? 'Où chaque parcours se situe sur la chaîne physique de puissance'
                : 'Where each pathway sits along the physical power chain'}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#5C6C70]">
            {isFr ? 'Cliquez sur une étape pour ouvrir le parcours correspondant' : 'Select a stage to load its pathway'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 border-y border-[#17282C] bg-[#FFFDF9] divide-y sm:divide-y-0 sm:divide-x divide-[#DEDACF]">
          {STAGE_SEQUENCE_MAP.map((item) => {
            const primaryOrder = item.pathwayOrder.split(' ')[0];
            const isCurrent = selectedPathway.orderNumber === primaryOrder && activeTab === 'PATHWAYS';
            return (
              <button
                key={item.stageNum}
                type="button"
                onClick={() => {
                  const found = PROGRESSIVE_LEARNING_PATHWAYS.find((p) => p.orderNumber === primaryOrder);
                  if (found) {
                    setActiveTab('PATHWAYS');
                    setSelectedPathway(found);
                    setActiveLessonIndex(0);
                  }
                }}
                className={`p-3.5 text-left transition-colors ${
                  isCurrent
                    ? 'bg-[#E3EFEC] border-b-2 border-b-[#147C78]'
                    : 'hover:bg-[#F6F4EE]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#5C6C70]">{item.stageNum}</span>
                  <span className="text-[#147C78] font-semibold">P{item.pathwayOrder}</span>
                </div>
                <div className="font-bold text-xs text-[#17282C] mt-1.5 truncate">
                  {isFr ? item.stageFr : item.stageEn}
                </div>
                <div className="font-mono text-[11px] text-[#B8872D] mt-0.5 truncate">
                  {item.voltage}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MODE 1: CORE 8 PROGRESSIVE PATHWAYS */}
      {activeTab === 'PATHWAYS' && (
        <section className="space-y-10">
          {/* Audience Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DEDACF]">
            <div>
              <h2 className="text-xl font-bold text-[#17282C]">
                {isFr ? 'Répertoire des 8 Parcours Progressifs' : 'Directory of the 8 Progressive Pathways'}
              </h2>
              <p className="text-sm text-[#5C6C70]">
                {isFr
                  ? 'Filtrez par public cible ou sélectionnez directement une ligne pour charger ses leçons.'
                  : 'Filter by audience or select any row to load its visual lessons below.'}
              </p>
            </div>

            <div
              role="group"
              aria-label={isFr ? 'Filtrer par niveau technique' : 'Filter by technical audience'}
              className="flex flex-wrap items-center gap-1.5 font-mono text-xs"
            >
              {[
                { id: 'ALL', label: isFr ? 'Tous (8)' : 'All (8)' },
                { id: 'beginner', label: isFr ? 'Étudiants & Fondations' : 'Students & Foundations' },
                { id: 'technician', label: isFr ? 'Techniciens Terrain' : 'Field Technicians' },
                { id: 'engineer', label: isFr ? 'Ingénieurs Réseaux' : 'Power Engineers' },
              ].map((filter) => {
                const active = levelFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLevelFilter(filter.id as any)}
                    className={`px-3.5 py-2 rounded-full border transition-colors ${
                      active
                        ? 'bg-[#147C78] border-[#147C78] text-[#FFFDF9] font-semibold'
                        : 'bg-[#FFFDF9] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C] hover:border-[#17282C]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="learn-active-workbench"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Readable Editorial Pathway Index Rows (5 Cols) */}
            <div className="lg:col-span-5 divide-y divide-[#DEDACF] border-y border-[#17282C] bg-[#FFFDF9]">
              {filteredPathways.map((pathway) => {
                const isSelected = selectedPathway.id === pathway.id;
                const completedCount = (completedItems[pathway.id] || []).length;
                const totalLessons = pathway.lessons.length;
                const progressPct = Math.round((completedCount / totalLessons) * 100);

                return (
                  <button
                    key={pathway.id}
                    type="button"
                    onClick={() => {
                      setSelectedPathway(pathway);
                      setActiveLessonIndex(0);
                    }}
                    className={`w-full p-4 sm:p-5 text-left transition-colors grid grid-cols-[44px_1fr_auto] gap-3.5 items-start ${
                      isSelected
                        ? 'bg-[#E3EFEC]/75 border-l-4 border-l-[#147C78]'
                        : 'hover:bg-[#F6F4EE]'
                    }`}
                  >
                    <span className="font-mono text-sm font-bold text-[#147C78] pt-0.5">
                      {pathway.orderNumber}
                    </span>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#5C6C70]">
                        <span className="text-[#B8872D] font-semibold">
                          {pathway.levelBadge[locale]}
                        </span>
                        <span>·</span>
                        <span>~{pathway.estimatedMinutes} min</span>
                        <span>·</span>
                        <span>
                          {pathway.lessons.length} {isFr ? 'leçons' : 'lessons'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#17282C] leading-snug">
                        {pathway.title[locale]}
                      </h3>
                      <p className="text-xs text-[#33474B] line-clamp-2 leading-relaxed">
                        {pathway.tagline[locale]}
                      </p>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <span className="text-xs font-semibold text-[#147C78]">
                        {progressPct}%
                      </span>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#17282C]">
                        <span>{isSelected ? (isFr ? 'Actif' : 'Active') : (isFr ? 'Ouvrir' : 'Open')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#147C78]" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Pathway Lesson Reader (7 Cols) */}
            <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-6 sm:p-8 space-y-7">
              {/* Pathway Header */}
              <div className="border-b border-[#DEDACF] pb-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] shrink-0">
                      {getIcon(selectedPathway.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-[#147C78] font-semibold uppercase">
                          {isFr ? `Parcours ${selectedPathway.orderNumber}` : `Pathway ${selectedPathway.orderNumber}`}
                        </span>
                        <span className="text-[#5C6C70]">·</span>
                        <span className="text-[#B8872D] font-semibold">
                          {selectedPathway.levelBadge[locale]}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#17282C] mt-1">
                        {selectedPathway.title[locale]}
                      </h2>
                    </div>
                  </div>

                  {/* Lesson Prev/Next Controls */}
                  <div className="flex items-center gap-1 font-mono text-xs bg-[#F6F4EE] p-1 rounded-full border border-[#DEDACF]">
                    <button
                      type="button"
                      onClick={() => activeLessonIndex > 0 && setActiveLessonIndex(activeLessonIndex - 1)}
                      disabled={activeLessonIndex === 0}
                      aria-label={isFr ? 'Leçon précédente' : 'Previous lesson'}
                      className="p-1.5 rounded-full text-[#17282C] hover:bg-[#FFFDF9] disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2.5 font-semibold text-[#17282C]">
                      {activeLessonIndex + 1} / {selectedPathway.lessons.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        activeLessonIndex < selectedPathway.lessons.length - 1 &&
                        setActiveLessonIndex(activeLessonIndex + 1)
                      }
                      disabled={activeLessonIndex === selectedPathway.lessons.length - 1}
                      aria-label={isFr ? 'Leçon suivante' : 'Next lesson'}
                      className="p-1.5 rounded-full text-[#17282C] hover:bg-[#FFFDF9] disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lesson Step Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedPathway.lessons.map((ls, idx) => {
                    const isActive = idx === activeLessonIndex;
                    const isDone = isCompleted(selectedPathway.id, ls.number);
                    return (
                      <button
                        key={ls.number}
                        type="button"
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-colors ${
                          isActive
                            ? 'bg-[#17282C] border-[#17282C] text-[#FFFDF9] font-semibold'
                            : isDone
                            ? 'bg-[#E3EFEC] border-[#147C78] text-[#147C78] font-semibold'
                            : 'bg-[#F6F4EE] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{isFr ? `Leçon 0${ls.number}` : `Lesson 0${ls.number}`}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Lesson Body */}
              {activeLesson && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="epede-eyebrow block">
                      {isFr
                        ? `Leçon 0${activeLesson.number} · Principe Fondamental`
                        : `Lesson 0${activeLesson.number} · Core Principle`}
                    </span>
                    <h3 className="text-xl font-bold text-[#17282C]">
                      {activeLesson.title[locale]}
                    </h3>
                    <p className="text-base text-[#33474B] bg-[#F6F4EE] p-4 rounded-lg border border-[#DEDACF] leading-relaxed">
                      {activeLesson.summary[locale]}
                    </p>
                  </div>

                  {/* 1. Real-World Analogy */}
                  <div className="p-5 rounded-lg bg-[#FFFDF9] border border-[#DEDACF] border-l-4 border-l-[#B8872D] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#B8872D] uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isFr
                          ? '01 · Analogie Concrète (Comprendre sans formule)'
                          : '01 · Real-World Analogy (Understand before formulas)'}
                      </span>
                    </div>
                    <p className="text-sm text-[#33474B] leading-relaxed">
                      {activeLesson.realWorldAnalogy[locale]}
                    </p>
                  </div>

                  {/* 2. Physical Principle */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs font-semibold text-[#147C78] uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {isFr
                          ? '02 · Loi Physique & Fonctionnement Interne'
                          : '02 · Physical Principle & Internal Operation'}
                      </span>
                    </h4>
                    <div className="text-sm text-[#33474B] bg-[#F6F4EE] p-4 rounded-lg border border-[#DEDACF] leading-relaxed">
                      <p>{activeLesson.physicalPrinciple[locale]}</p>
                    </div>
                  </div>

                  {/* Equipment Photo & IEC 60617 Symbol */}
                  {activeLesson.equipmentPhotoUrl && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <figure className="rounded-lg overflow-hidden border border-[#DEDACF] bg-[#F6F4EE]">
                        <div className="h-44 relative overflow-hidden">
                          <img
                            src={activeLesson.equipmentPhotoUrl}
                            alt={activeLesson.title[locale]}
                            className="w-full h-full object-cover epede-photo-grade"
                            loading="lazy"
                          />
                          <span className="absolute top-2.5 left-2.5 font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded bg-[#10191D]/90 text-[#F4F1E8]">
                            {isFr ? 'Appareillage Réel' : 'Field Apparatus'}
                          </span>
                        </div>
                        {activeLesson.equipmentPhotoCaption && (
                          <figcaption className="p-3 text-xs text-[#5C6C70] leading-relaxed">
                            {activeLesson.equipmentPhotoCaption[locale]}
                          </figcaption>
                        )}
                      </figure>

                      <div className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <span className="font-mono text-[11px] font-semibold uppercase text-[#147C78] block">
                            {isFr
                              ? 'Symbole CEI 60617 & Bornier'
                              : 'IEC 60617 Symbol & Terminal Markings'}
                          </span>
                          <p className="text-xs text-[#33474B] leading-relaxed">
                            {activeLesson.iecSymbolDescription
                              ? activeLesson.iecSymbolDescription[locale]
                              : isFr
                              ? 'Repérage normalisé des pôles de puissance et contacts auxiliaires selon la norme CEI 60617.'
                              : 'Standardized IEC 60617 graphical symbol and terminal block designations.'}
                          </p>
                        </div>

                        {activeLesson.keyFormulas && activeLesson.keyFormulas.length > 0 && (
                          <div className="pt-3 border-t border-[#DEDACF] space-y-1.5 font-mono text-xs">
                            {activeLesson.keyFormulas.map((f, i) => (
                              <div key={i}>
                                <code className="text-[#17282C] bg-[#FFFDF9] px-2.5 py-1 rounded border border-[#DEDACF] inline-block">
                                  {f}
                                </code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Cameroon Field Note */}
                  {activeLesson.cameroonFieldNote && (
                    <div className="p-4 rounded-lg bg-[#E3EFEC]/60 border border-[#147C78]/35 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#147C78] font-mono text-xs font-semibold uppercase">
                        <Globe className="w-3.5 h-3.5" />
                        <span>
                          {isFr
                            ? '03 · Application Terrain au Cameroun (SONATREL / ENEO)'
                            : '03 · Cameroon Grid Field Context (SONATREL / ENEO)'}
                        </span>
                      </div>
                      <p className="text-xs text-[#17282C] leading-relaxed">
                        {activeLesson.cameroonFieldNote[locale]}
                      </p>
                    </div>
                  )}

                  {/* Direct Hands-On Tool Link */}
                  {activeLesson.targetAction && (
                    <div className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-[11px] text-[#5C6C70] uppercase block">
                          {isFr ? 'Passerelle Pratique' : 'Hands-On Workbench'}
                        </span>
                        <div className="text-sm font-bold text-[#17282C]">
                          {activeLesson.targetAction.label[locale]}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLaunchTargetTool(activeLesson.targetAction)}
                        className="epede-btn-primary text-xs px-4 min-h-[40px]"
                      >
                        <span>{isFr ? 'Ouvrir l’Outil' : 'Open Tool'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* 4. Knowledge Check Quiz */}
                  <div className="p-5 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#17282C] uppercase">
                        <HelpCircle className="w-4 h-4 text-[#147C78]" />
                        <span>
                          {isFr ? '04 · Validation des Acquis' : '04 · Lesson Knowledge Check'}
                        </span>
                      </div>
                      {isCompleted(selectedPathway.id, activeLesson.number) && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#15803D] bg-[#FFFDF9] px-2.5 py-0.5 rounded-full border border-[#15803D]/30 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isFr ? 'Validé' : 'Completed'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-[#17282C]">
                      {activeLesson.quiz.question[locale]}
                    </p>

                    <div className="space-y-2">
                      {activeLesson.quiz.options.map((opt, optIdx) => {
                        const isSelected = pathwayAnswer === optIdx;
                        const isCorrect = optIdx === activeLesson.quiz.correctAnswerIndex;

                        let btnClass =
                          'bg-[#FFFDF9] border-[#DEDACF] text-[#33474B] hover:border-[#17282C]';
                        if (isPathwayAnswerSubmitted) {
                          if (isCorrect) {
                            btnClass =
                              'bg-[#E3EFEC] border-[#15803D] text-[#17282C] font-semibold';
                          } else if (isSelected) {
                            btnClass =
                              'bg-[#FEE2E2] border-[#B91C1C] text-[#B91C1C]';
                          }
                        } else if (isSelected) {
                          btnClass =
                            'bg-[#E3EFEC] border-[#147C78] text-[#17282C] font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => !isPathwayAnswerSubmitted && setPathwayAnswer(optIdx)}
                            disabled={isPathwayAnswerSubmitted}
                            className={`w-full text-left p-3.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${btnClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold bg-[#F6F4EE] border border-[#DEDACF] text-[#17282C] shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt[locale]}</span>
                            </div>
                            {isPathwayAnswerSubmitted && isCorrect && (
                              <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                            )}
                            {isPathwayAnswerSubmitted && isSelected && !isCorrect && (
                              <X className="w-4 h-4 text-[#B91C1C] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!isPathwayAnswerSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (pathwayAnswer === null) return;
                          setIsPathwayAnswerSubmitted(true);
                          if (pathwayAnswer === activeLesson.quiz.correctAnswerIndex) {
                            markCompleted(selectedPathway.id, activeLesson.number);
                          }
                        }}
                        disabled={pathwayAnswer === null}
                        className="epede-btn-primary w-full justify-center disabled:opacity-40"
                      >
                        {isFr ? 'Valider ma réponse' : 'Check Answer'}
                      </button>
                    ) : (
                      <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#DEDACF] text-xs space-y-1.5">
                        <div className="font-mono font-bold">
                          {pathwayAnswer === activeLesson.quiz.correctAnswerIndex ? (
                            <span className="text-[#15803D] inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isFr ? 'Réponse exacte' : 'Correct answer'}</span>
                            </span>
                          ) : (
                            <span className="text-[#B91C1C] inline-flex items-center gap-1.5">
                              <X className="w-4 h-4" />
                              <span>{isFr ? 'Réponse à corriger' : 'Review explanation'}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[#33474B] leading-relaxed">
                          {activeLesson.quiz.explanation[locale]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Footer Navigation */}
                  <div className="pt-4 border-t border-[#DEDACF] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        activeLessonIndex > 0 && setActiveLessonIndex(activeLessonIndex - 1)
                      }
                      disabled={activeLessonIndex === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F6F4EE] border border-[#DEDACF] text-xs font-mono text-[#17282C] disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{isFr ? 'Leçon précédente' : 'Previous lesson'}</span>
                    </button>

                    {activeLessonIndex < selectedPathway.lessons.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                        className="epede-btn-primary text-xs px-5 min-h-[40px]"
                      >
                        <span>{isFr ? 'Leçon suivante' : 'Next lesson'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#147C78]">
                        <Award className="w-4 h-4" />
                        <span>{isFr ? 'Parcours terminé' : 'Pathway completed'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. MODE 2: 7 APPLIED ENGINEERING MASTERCLASSES */}
      {activeTab === 'MASTERCLASSES' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editorial Masterclass Index Rows (5 Cols) */}
          <div className="lg:col-span-5 divide-y divide-[#DEDACF] border-y border-[#17282C] bg-[#FFFDF9]">
            {THEMATIC_JOURNEYS.map((journey) => {
              const isSelected = selectedJourney.id === journey.id;
              const completedCount = (completedItems[journey.id] || []).length;
              const progressPct = Math.round((completedCount / journey.steps.length) * 100);

              return (
                <button
                  key={journey.id}
                  type="button"
                  onClick={() => {
                    setSelectedJourney(journey);
                    setActiveMasterclassStepIndex(0);
                  }}
                  className={`w-full p-4 sm:p-5 text-left transition-colors grid grid-cols-[44px_1fr_auto] gap-3.5 items-start ${
                    isSelected
                      ? 'bg-[#E3EFEC]/75 border-l-4 border-l-[#147C78]'
                      : 'hover:bg-[#F6F4EE]'
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-[#B8872D] pt-0.5">
                    0{journey.order}
                  </span>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#5C6C70]">
                      <span className="text-[#147C78] font-semibold">{journey.targetProfile}</span>
                      <span>·</span>
                      <span>~{journey.estimatedMinutes} min</span>
                    </div>
                    <h3 className="text-base font-bold text-[#17282C] leading-snug">
                      {journey.title[locale]}
                    </h3>
                    <p className="text-xs text-[#33474B] line-clamp-2 leading-relaxed">
                      {journey.description[locale]}
                    </p>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <span className="text-xs font-semibold text-[#147C78]">{progressPct}%</span>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#17282C]">
                      <span>{isFr ? 'Ouvrir' : 'Open'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#147C78]" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Masterclass Workbench (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-6 sm:p-8 space-y-7">
            <div className="border-b border-[#DEDACF] pb-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#147C78] font-semibold uppercase">
                      MASTERCLASS 0{selectedJourney.order}
                    </span>
                    <span className="text-[#5C6C70]">·</span>
                    <span className="text-[#B8872D] font-semibold">
                      {selectedJourney.targetProfile}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#17282C] mt-1">
                    {selectedJourney.title[locale]}
                  </h2>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs bg-[#F6F4EE] p-1 rounded-full border border-[#DEDACF]">
                  <button
                    type="button"
                    onClick={() =>
                      activeMasterclassStepIndex > 0 &&
                      setActiveMasterclassStepIndex(activeMasterclassStepIndex - 1)
                    }
                    disabled={activeMasterclassStepIndex === 0}
                    className="p-1.5 rounded-full text-[#17282C] hover:bg-[#FFFDF9] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 font-semibold text-[#17282C]">
                    {activeMasterclassStepIndex + 1} / {selectedJourney.steps.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      activeMasterclassStepIndex < selectedJourney.steps.length - 1 &&
                      setActiveMasterclassStepIndex(activeMasterclassStepIndex + 1)
                    }
                    disabled={activeMasterclassStepIndex === selectedJourney.steps.length - 1}
                    className="p-1.5 rounded-full text-[#17282C] hover:bg-[#FFFDF9] disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedJourney.steps.map((st, idx) => {
                  const isActive = idx === activeMasterclassStepIndex;
                  const isDone = isCompleted(selectedJourney.id, st.stepNumber);
                  return (
                    <button
                      key={st.stepNumber}
                      type="button"
                      onClick={() => setActiveMasterclassStepIndex(idx)}
                      className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-colors ${
                        isActive
                          ? 'bg-[#17282C] border-[#17282C] text-[#FFFDF9] font-semibold'
                          : isDone
                          ? 'bg-[#E3EFEC] border-[#147C78] text-[#147C78] font-semibold'
                          : 'bg-[#F6F4EE] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {isFr ? `Étape 0${st.stepNumber}` : `Step 0${st.stepNumber}`}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeMasterclassStep && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="epede-eyebrow block">
                    {isFr
                      ? `Étape 0${activeMasterclassStep.stepNumber} · Étude Appliquée`
                      : `Step 0${activeMasterclassStep.stepNumber} · Applied Engineering`}
                  </span>
                  <h3 className="text-xl font-bold text-[#17282C]">
                    {activeMasterclassStep.title[locale]}
                  </h3>
                  <p className="text-base text-[#33474B] bg-[#F6F4EE] p-4 rounded-lg border border-[#DEDACF] leading-relaxed">
                    {activeMasterclassStep.summary[locale]}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold text-[#147C78] uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {isFr ? 'Physique & Architecture Système' : 'System Physics & Architecture'}
                    </span>
                  </h4>
                  <div className="text-sm text-[#33474B] bg-[#F6F4EE] p-4 rounded-lg border border-[#DEDACF] leading-relaxed">
                    <p>{activeMasterclassStep.deepExplanation[locale]}</p>
                  </div>
                </div>

                {activeMasterclassStep.keyFormulas && activeMasterclassStep.keyFormulas.length > 0 && (
                  <div className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-2 font-mono text-xs">
                    <span className="text-[#B8872D] font-semibold uppercase block">
                      {isFr ? 'Équations de Dimensionnement' : 'Governing Equations'}
                    </span>
                    {activeMasterclassStep.keyFormulas.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[#5C6C70]">({i + 1})</span>
                        <code className="text-[#17282C] bg-[#FFFDF9] px-2.5 py-1 rounded border border-[#DEDACF]">
                          {f}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {activeMasterclassStep.fieldEngineeringTips && (
                  <div className="p-4 rounded-lg bg-[#E3EFEC]/60 border border-[#147C78]/35 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#147C78] font-mono text-xs font-semibold uppercase">
                      <Globe className="w-3.5 h-3.5" />
                      <span>
                        {isFr ? 'Retour Terrain Cameroun' : 'Cameroon Grid Field Note'}
                      </span>
                    </div>
                    <p className="text-xs text-[#17282C] leading-relaxed">
                      {activeMasterclassStep.fieldEngineeringTips[locale]}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-[#5C6C70] uppercase block">
                      {isFr ? 'Outil Associé' : 'Connected Workbench'}
                    </span>
                    <div className="text-sm font-bold text-[#17282C]">
                      {activeMasterclassStep.targetAction.label[locale]}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunchTargetTool(activeMasterclassStep.targetAction)}
                    className="epede-btn-primary text-xs px-4 min-h-[40px]"
                  >
                    <span>{isFr ? 'Lancer l’Outil' : 'Launch Tool'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Masterclass Step Quiz */}
                <div className="p-5 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#17282C] uppercase">
                      <HelpCircle className="w-4 h-4 text-[#147C78]" />
                      <span>{isFr ? 'Contrôle des Connaissances' : 'Step Knowledge Check'}</span>
                    </div>
                    {isCompleted(selectedJourney.id, activeMasterclassStep.stepNumber) && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#15803D] bg-[#FFFDF9] px-2.5 py-0.5 rounded-full border border-[#15803D]/30 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isFr ? 'Validé' : 'Completed'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-[#17282C]">
                    {activeMasterclassStep.quiz.question[locale]}
                  </p>

                  <div className="space-y-2">
                    {activeMasterclassStep.quiz.options.map((opt, optIdx) => {
                      const isSelected = masterclassAnswer === optIdx;
                      const isCorrect = optIdx === activeMasterclassStep.quiz.correctAnswerIndex;

                      let btnClass =
                        'bg-[#FFFDF9] border-[#DEDACF] text-[#33474B] hover:border-[#17282C]';
                      if (isMasterclassAnswerSubmitted) {
                        if (isCorrect) {
                          btnClass =
                            'bg-[#E3EFEC] border-[#15803D] text-[#17282C] font-semibold';
                        } else if (isSelected) {
                          btnClass = 'bg-[#FEE2E2] border-[#B91C1C] text-[#B91C1C]';
                        }
                      } else if (isSelected) {
                        btnClass =
                          'bg-[#E3EFEC] border-[#147C78] text-[#17282C] font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            !isMasterclassAnswerSubmitted && setMasterclassAnswer(optIdx)
                          }
                          disabled={isMasterclassAnswerSubmitted}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${btnClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold bg-[#F6F4EE] border border-[#DEDACF] text-[#17282C] shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt[locale]}</span>
                          </div>
                          {isMasterclassAnswerSubmitted && isCorrect && (
                            <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                          )}
                          {isMasterclassAnswerSubmitted && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-[#B91C1C] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!isMasterclassAnswerSubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (masterclassAnswer === null) return;
                        setIsMasterclassAnswerSubmitted(true);
                        if (masterclassAnswer === activeMasterclassStep.quiz.correctAnswerIndex) {
                          markCompleted(selectedJourney.id, activeMasterclassStep.stepNumber);
                        }
                      }}
                      disabled={masterclassAnswer === null}
                      className="epede-btn-primary w-full justify-center disabled:opacity-40"
                    >
                      {isFr ? 'Valider ma réponse' : 'Check Answer'}
                    </button>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#DEDACF] text-xs space-y-1.5">
                      <p className="text-[#33474B] leading-relaxed">
                        {activeMasterclassStep.quiz.explanation[locale]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      </div>

      {/* Bottom Final CTA (SITEWIDE-REDESIGN.md Section 3) */}
      <FinalCTA
        eyebrow={isFr ? 'CURSUS D’INGÉNIERIE ÉLECTRIQUE' : 'POWER ENGINEERING CURRICULUM'}
        title={isFr ? 'Approfondissez chaque domaine. Résolvez les études de cas.' : 'Deepen each domain. Solve the masterclasses.'}
        description={
          isFr
            ? 'Passez de la théorie électrotechnique aux schémas réels, aux calculateurs normatifs et à l’analyse du réseau camerounais.'
            : 'Bridge electrotechnical theory with real equipment cutaways, normative calculators, and Cameroon grid operations.'
        }
        primaryAction={{
          label: isFr ? 'Ouvrir les Calculateurs CEI' : 'Open IEC Solvers',
          onClick: () => onNavigate?.('calculators'),
        }}
        secondaryAction={{
          label: isFr ? 'Explorer la Chaîne 9 Étapes' : 'Explore 9-Stage Power Chain',
          onClick: () => onNavigate?.('journey'),
        }}
      />
    </div>
  );
};
