// src/components/journey/ThematicJourneysWorkbench.tsx
// EPEDE 2.0 - "Learn" Hub (Le Centre d'Apprentissage & Parcours Pédagogiques)
// Features both:
// 1. The 8 Core Progressive Pathways (01 to 08) from Zero to Advanced Systems
// 2. The 7 Engineering Masterclass Case Studies (Hospital Power, Substation, Hydro, etc.)
// Styled in canonical engineering palette (#0B0F12, #151C1E, #D7A64A, #567A87, #F4F1E8).

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap,
  Layers,
  ArrowRight,
  SlidersHorizontal,
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
import { useUsageLevel, UsageLevel } from '../../services/UsageLevelContext';
import type { AppViewType } from '../../services/routerService';
import type { DomainCode } from '../../types/epede';

interface ThematicJourneysWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: AppViewType, context?: any) => void;
  initialJourneyId?: string;
}

type LearningTabMode = 'PATHWAYS' | 'MASTERCLASSES';

export const ThematicJourneysWorkbench: React.FC<ThematicJourneysWorkbenchProps> = ({
  locale,
  onNavigate,
  initialJourneyId,
}) => {
  const { usageLevel } = useUsageLevel();

  // Tab mode: Core 8 Pathways vs Advanced Masterclass Case Studies
  const [activeTab, setActiveTab] = useState<LearningTabMode>(() => {
    if (initialJourneyId && initialJourneyId.startsWith('journey-')) {
      return 'MASTERCLASSES';
    }
    return 'PATHWAYS';
  });

  // Level filter
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'beginner' | 'technician' | 'engineer'>('ALL');

  // Progressive Pathway State (01 - 08)
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

  // Thematic Masterclass Journey State
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

  // Completed items tracking stored in localStorage
  const [completedItems, setCompletedItems] = useState<Record<string, number[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('epede-learning-completed-items');
        if (saved) return JSON.parse(saved);
      } catch (e) {
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
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const isCompleted = (id: string, stepNumber: number) => {
    return (completedItems[id] || []).includes(stepNumber);
  };

  // Filtered pathways
  const filteredPathways = useMemo(() => {
    return PROGRESSIVE_LEARNING_PATHWAYS.filter((p) => {
      if (levelFilter === 'ALL') return true;
      return p.level === levelFilter;
    });
  }, [levelFilter]);

  // Reset quiz state when switching lessons
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
      case 'Zap': return <Zap className={`${className} text-[#D7A64A]`} />;
      case 'Cpu': return <Cpu className={`${className} text-[#567A87]`} />;
      case 'Building2': return <Building2 className={`${className} text-sky-400`} />;
      case 'Compass': return <Compass className={`${className} text-purple-400`} />;
      case 'Activity': return <Activity className={`${className} text-amber-400`} />;
      case 'ShieldCheck': return <ShieldCheck className={`${className} text-emerald-400`} />;
      case 'Globe': return <Globe className={`${className} text-emerald-400`} />;
      default: return <BookOpen className={`${className} text-[#D7A64A]`} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans text-[#F4F1E8]">
      
      {/* ── Top Header & Mode Switcher ────────────────────────── */}
      <div className="bg-[#151C1E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D7A64A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#567A87]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded-full bg-[#D7A64A]/20 text-[#D7A64A] border border-[#D7A64A]/40 flex items-center gap-1.5 shadow-xs">
                <GraduationCap className="h-4 w-4" />
                <span>EPEDE 2.0 · LEARN HUB</span>
              </span>
              <span className="font-mono text-xs text-[#A9ADA5]">
                {locale === 'fr'
                  ? 'Du zéro absolu à l’ingénierie des réseaux électriques'
                  : 'From zero knowledge to power systems engineering'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black tracking-tight text-white uppercase">
              {locale === 'fr' ? 'Parcours d’Apprentissage Électrique' : 'Electrical Learning Pathways'}
            </h1>
            <p className="text-sm text-[#A9ADA5] max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Une progression visuelle et concrète : comprenez d’abord le phénomène physique avec des analogies du monde réel, observez l’intérieur des équipements réels, associez les symboles CEI normalisés et explorez les cas d’application au Cameroun et en Afrique.'
                : 'A progressive visual curriculum: first grasp the physical principle through intuitive real-world analogies, inspect internal equipment cutaways, connect standardized IEC symbols, and explore African and Cameroon grid applications.'}
            </p>
          </div>

          {/* Mode Switcher: 8 Progressive Pathways vs Engineering Masterclasses */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#0B0F12] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('PATHWAYS')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${
                activeTab === 'PATHWAYS'
                  ? 'bg-[#D7A64A] text-[#0B0F12] shadow-md'
                  : 'text-[#A9ADA5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{locale === 'fr' ? '8 Parcours Progressifs (01 - 08)' : '8 Progressive Pathways (01 - 08)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('MASTERCLASSES')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all ${
                activeTab === 'MASTERCLASSES'
                  ? 'bg-[#567A87] text-white shadow-md'
                  : 'text-[#A9ADA5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{locale === 'fr' ? '7 Études de Cas & Masterclass' : '7 Applied Masterclasses'}</span>
            </button>
          </div>
        </div>

        {/* Level Filters for Pathways */}
        {activeTab === 'PATHWAYS' && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#A9ADA5]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D7A64A]" />
              <span>{locale === 'fr' ? 'Niveau technique :' : 'Technical Level:'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setLevelFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  levelFilter === 'ALL'
                    ? 'bg-[#D7A64A]/20 text-[#D7A64A] border border-[#D7A64A]/40'
                    : 'text-[#A9ADA5] hover:text-white bg-[#0B0F12] border border-white/5'
                }`}
              >
                {locale === 'fr' ? 'Tous les niveaux (01 à 08)' : 'All Levels (01 to 08)'}
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('beginner')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  levelFilter === 'beginner'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-[#A9ADA5] hover:text-white bg-[#0B0F12] border border-white/5'
                }`}
              >
                {locale === 'fr' ? 'Débutant & Fondations (01, 02, 08)' : 'Beginner & Foundations'}
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('technician')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  levelFilter === 'technician'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-[#A9ADA5] hover:text-white bg-[#0B0F12] border border-white/5'
                }`}
              >
                {locale === 'fr' ? 'Technicien Terrain (03, 06, 07)' : 'Field Technician'}
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('engineer')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  levelFilter === 'engineer'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                    : 'text-[#A9ADA5] hover:text-white bg-[#0B0F12] border border-white/5'
                }`}
              >
                {locale === 'fr' ? 'Ingénieur Réseaux & Systèmes (04, 05)' : 'Power Systems Engineer'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODE 1: CORE 8 PROGRESSIVE PATHWAYS ────────────────── */}
      {activeTab === 'PATHWAYS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Pathway Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-[#A9ADA5] uppercase tracking-wider px-1 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Les 8 Parcours Pédagogiques' : 'The 8 Learning Pathways'}</span>
              <span className="text-[#D7A64A]">{filteredPathways.length}</span>
            </div>

            <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
              {filteredPathways.map((pathway) => {
                const isSelected = selectedPathway.id === pathway.id;
                const completedCount = (completedItems[pathway.id] || []).length;
                const totalLessons = pathway.lessons.length;
                const progressPct = Math.round((completedCount / totalLessons) * 100);

                return (
                  <motion.div
                    key={pathway.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setSelectedPathway(pathway);
                      setActiveLessonIndex(0);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#151C1E] border-[#D7A64A] shadow-lg ring-1 ring-[#D7A64A]/50'
                        : 'bg-[#151C1E]/60 border-white/10 hover:border-white/20 hover:bg-[#151C1E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black px-2 py-1 rounded bg-[#0B0F12] text-[#D7A64A] border border-[#D7A64A]/30">
                          {pathway.orderNumber}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-white/5">
                            {pathway.levelBadge[locale]}
                          </span>
                          <div className="text-xs font-mono text-[#A9ADA5] mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A9ADA5]/70" />
                            <span>~{pathway.estimatedMinutes} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-emerald-400">{progressPct}%</span>
                        <div className="w-12 bg-[#0B0F12] h-1.5 rounded-full overflow-hidden mt-1 border border-white/10">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold font-mono text-white mt-3 leading-snug">
                      {pathway.title[locale]}
                    </h3>
                    <p className="text-xs text-[#A9ADA5] mt-1 line-clamp-2 leading-relaxed">
                      {pathway.tagline[locale]}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A9ADA5]">
                      <span>{pathway.lessons.length} {locale === 'fr' ? 'leçons visuelles' : 'visual lessons'}</span>
                      <span className="text-[#D7A64A] font-semibold flex items-center gap-0.5">
                        <span>{locale === 'fr' ? 'Étudier' : 'Learn'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Interactive Lesson Workbench (8 Cols) */}
          <div className="lg:col-span-8 bg-[#151C1E] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
            
            {/* Pathway Header */}
            <div className="border-b border-white/10 pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0B0F12] border border-[#D7A64A]/30">
                    {getIcon(selectedPathway.iconName, 'w-6 h-6')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#D7A64A]">
                        {locale === 'fr' ? `PARCOURS ${selectedPathway.orderNumber}` : `PATHWAY ${selectedPathway.orderNumber}`}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-white/10">
                        {selectedPathway.levelBadge[locale]}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                      {selectedPathway.title[locale]}
                    </h2>
                  </div>
                </div>

                {/* Lesson Navigation Arrows */}
                <div className="flex items-center gap-1.5 font-mono text-xs bg-[#0B0F12] p-1.5 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => activeLessonIndex > 0 && setActiveLessonIndex(activeLessonIndex - 1)}
                    disabled={activeLessonIndex === 0}
                    className="p-1.5 rounded-lg text-[#A9ADA5] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-bold text-white">
                    {activeLessonIndex + 1} / {selectedPathway.lessons.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => activeLessonIndex < selectedPathway.lessons.length - 1 && setActiveLessonIndex(activeLessonIndex + 1)}
                    disabled={activeLessonIndex === selectedPathway.lessons.length - 1}
                    className="p-1.5 rounded-lg text-[#A9ADA5] hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lesson Tabs Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {selectedPathway.lessons.map((ls, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isDone = isCompleted(selectedPathway.id, ls.number);

                  return (
                    <button
                      key={ls.number}
                      type="button"
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all font-mono text-xs ${
                        isActive
                          ? 'bg-[#D7A64A]/20 border-[#D7A64A] text-white font-bold ring-1 ring-[#D7A64A]/40'
                          : isDone
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#0B0F12]/60 border-white/10 text-[#A9ADA5] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{locale === 'fr' ? `Leçon ${ls.number}` : `Lesson ${ls.number}`}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Lesson Content */}
            {activeLesson && (
              <div className="space-y-6">
                
                {/* Lesson Title & Summary */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#D7A64A] uppercase tracking-wider font-bold">
                    {locale === 'fr' ? `LEÇON 0${activeLesson.number} · COMPRÉHENSION CONCRÈTE` : `LESSON 0${activeLesson.number} · CORE PRINCIPLE`}
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white">
                    {activeLesson.title[locale]}
                  </h3>
                  <p className="text-sm text-[#F4F1E8] bg-[#0B0F12] p-4 rounded-xl border border-white/10 leading-relaxed">
                    {activeLesson.summary[locale]}
                  </p>
                </div>

                {/* 1. Real World Analogy (No Jargon First) */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#D7A64A]/10 via-[#0B0F12] to-[#0B0F12] border border-[#D7A64A]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D7A64A] uppercase">
                    <Sparkles className="w-4 h-4 text-[#D7A64A]" />
                    <span>{locale === 'fr' ? 'Analogie Réelle (Comprendre sans formule)' : 'Real-World Analogy (No Jargon First)'}</span>
                  </div>
                  <p className="text-sm text-[#F4F1E8] leading-relaxed">
                    {activeLesson.realWorldAnalogy[locale]}
                  </p>
                </div>

                {/* 2. Physical Principle & Internal Anatomy */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[#A9ADA5] uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>{locale === 'fr' ? 'Principe Physique & Fonctionnement Interne' : 'Physical Principle & Internal Operation'}</span>
                  </h4>
                  <div className="text-sm text-[#A9ADA5] bg-[#0B0F12]/80 p-4 rounded-xl border border-white/10 leading-relaxed space-y-2">
                    <p>{activeLesson.physicalPrinciple[locale]}</p>
                  </div>
                </div>

                {/* Real Equipment Photo & IEC Symbol if present */}
                {activeLesson.equipmentPhotoUrl && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0B0F12]">
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={activeLesson.equipmentPhotoUrl}
                          alt={activeLesson.title[locale]}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#0B0F12]/90 text-[#D7A64A] border border-[#D7A64A]/40">
                          {locale === 'fr' ? 'Photo Réelle sur le Terrain' : 'Real Field Photograph'}
                        </span>
                      </div>
                      {activeLesson.equipmentPhotoCaption && (
                        <div className="p-3 text-xs text-[#A9ADA5] font-sans">
                          {activeLesson.equipmentPhotoCaption[locale]}
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#567A87] block">
                          {locale === 'fr' ? 'Symbole CEI 60617 & Repérage Normalisé' : 'IEC 60617 Symbol & Terminal Markings'}
                        </span>
                        <p className="text-xs text-[#A9ADA5] leading-relaxed">
                          {activeLesson.iecSymbolDescription
                            ? activeLesson.iecSymbolDescription[locale]
                            : locale === 'fr'
                            ? 'Repérage normalisé des pôles de puissance et contacts auxiliaires selon la norme CEI 60617.'
                            : 'Standardized IEC 60617 graphical symbol and terminal block designations.'}
                        </p>
                      </div>

                      {/* Formulas if any */}
                      {activeLesson.keyFormulas && activeLesson.keyFormulas.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1.5 font-mono text-xs text-[#D7A64A]">
                          {activeLesson.keyFormulas.map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <code className="text-[#D7A64A] bg-[#151C1E] px-2 py-0.5 rounded border border-white/5">
                                {f}
                              </code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Cameroon Field Experience Note */}
                {activeLesson.cameroonFieldNote && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Pratique Terrain au Cameroun (SONATREL / Eneo / Ateliers)' : 'Field Practice in Cameroon (SONATREL / Eneo)'}</span>
                    </div>
                    <p className="text-emerald-200/90 leading-relaxed font-sans">
                      {activeLesson.cameroonFieldNote[locale]}
                    </p>
                  </div>
                )}

                {/* Direct Action Link */}
                {activeLesson.targetAction && (
                  <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/40 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-[#567A87] uppercase">
                        {locale === 'fr' ? 'Passerelle Pratique Immédiate :' : 'Hands-On Tool:'}
                      </span>
                      <div className="text-sm font-bold font-mono text-white">
                        {activeLesson.targetAction.label[locale]}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunchTargetTool(activeLesson.targetAction)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#567A87] hover:bg-[#567A87]/80 text-white font-mono text-xs font-bold transition-all shadow-md"
                    >
                      <span>{locale === 'fr' ? 'Ouvrir l’Équipement / Outil' : 'Open Equipment / Tool'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 4. Interactive Knowledge Check Quiz */}
                <div className="p-5 rounded-2xl bg-[#0B0F12] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D7A64A] uppercase">
                      <HelpCircle className="w-4 h-4" />
                      <span>{locale === 'fr' ? 'Validation des Acquis de la Leçon' : 'Lesson Knowledge Check'}</span>
                    </div>
                    {isCompleted(selectedPathway.id, activeLesson.number) && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? 'Leçon Validée' : 'Completed'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-white font-mono">
                    {activeLesson.quiz.question[locale]}
                  </p>

                  <div className="space-y-2">
                    {activeLesson.quiz.options.map((opt, optIdx) => {
                      const isSelected = pathwayAnswer === optIdx;
                      const isCorrect = optIdx === activeLesson.quiz.correctAnswerIndex;

                      let btnClass = 'bg-[#151C1E] border-white/10 text-[#A9ADA5] hover:border-white/20';
                      if (isPathwayAnswerSubmitted) {
                        if (isCorrect) {
                          btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnClass = 'bg-[#D7A64A]/20 border-[#D7A64A] text-white font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => !isPathwayAnswerSubmitted && setPathwayAnswer(optIdx)}
                          disabled={isPathwayAnswerSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border font-mono text-xs transition-all flex items-center justify-between ${btnClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#0B0F12] border border-white/10">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt[locale]}</span>
                          </div>
                          {isPathwayAnswerSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                          {isPathwayAnswerSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
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
                      className="w-full py-2.5 rounded-lg bg-[#D7A64A] hover:bg-[#D7A64A]/90 disabled:opacity-30 text-[#0B0F12] font-mono text-xs font-black transition-all shadow-md"
                    >
                      {locale === 'fr' ? 'Valider ma Réponse' : 'Submit Answer'}
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#151C1E] border border-white/10 text-xs font-sans space-y-2">
                      <div className="font-mono font-bold text-white flex items-center gap-1.5">
                        {pathwayAnswer === activeLesson.quiz.correctAnswerIndex ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{locale === 'fr' ? 'Excellente réponse !' : 'Excellent answer!'}</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <X className="w-4 h-4" />
                            <span>{locale === 'fr' ? 'Réponse incorrecte' : 'Incorrect answer'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[#A9ADA5] leading-relaxed">
                        {activeLesson.quiz.explanation[locale]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => activeLessonIndex > 0 && setActiveLessonIndex(activeLessonIndex - 1)}
                    disabled={activeLessonIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B0F12] hover:bg-white/5 disabled:opacity-30 text-[#A9ADA5] font-mono text-xs transition-colors border border-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{locale === 'fr' ? 'Leçon Précédente' : 'Previous Lesson'}</span>
                  </button>

                  {activeLessonIndex < selectedPathway.lessons.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D7A64A] hover:bg-[#D7A64A]/90 text-[#0B0F12] font-mono text-xs font-black transition-colors"
                    >
                      <span>{locale === 'fr' ? 'Leçon Suivante' : 'Next Lesson'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>{locale === 'fr' ? 'Fin de ce Parcours !' : 'Pathway Completed!'}</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ── MODE 2: THEMATIC MASTERCLASS CASE STUDIES ─────────── */}
      {activeTab === 'MASTERCLASSES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Masterclass Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-[#A9ADA5] uppercase tracking-wider px-1 flex items-center justify-between">
              <span>{locale === 'fr' ? '7 Études de Cas d’Ingénierie' : '7 Engineering Masterclasses'}</span>
              <span className="text-[#567A87]">{THEMATIC_JOURNEYS.length}</span>
            </div>

            <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
              {THEMATIC_JOURNEYS.map((journey) => {
                const isSelected = selectedJourney.id === journey.id;
                const completedCount = (completedItems[journey.id] || []).length;
                const progressPct = Math.round((completedCount / journey.steps.length) * 100);

                return (
                  <motion.div
                    key={journey.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setSelectedJourney(journey);
                      setActiveMasterclassStepIndex(0);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#151C1E] border-[#567A87] shadow-lg ring-1 ring-[#567A87]/50'
                        : 'bg-[#151C1E]/60 border-white/10 hover:border-white/20 hover:bg-[#151C1E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#0B0F12] border border-white/10">
                          {getIcon(journey.iconName)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-white/5">
                            {journey.targetProfile}
                          </span>
                          <div className="text-xs font-mono text-[#A9ADA5] mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A9ADA5]/70" />
                            <span>~{journey.estimatedMinutes} min</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-emerald-400">{progressPct}%</span>
                        <div className="w-12 bg-[#0B0F12] h-1.5 rounded-full overflow-hidden mt-1 border border-white/10">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold font-mono text-white mt-3">
                      {journey.title[locale]}
                    </h3>
                    <p className="text-xs text-[#A9ADA5] mt-1 line-clamp-2 leading-relaxed">
                      {journey.description[locale]}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A9ADA5]">
                      <span>{journey.steps.length} {locale === 'fr' ? 'étapes guidées' : 'guided steps'}</span>
                      <span className="text-[#567A87] font-semibold flex items-center gap-0.5">
                        <span>{locale === 'fr' ? 'Explorer' : 'Start'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Masterclass Guide Workbench (8 Cols) */}
          <div className="lg:col-span-8 bg-[#151C1E] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0B0F12] border border-[#567A87]/30">
                    {getIcon(selectedJourney.iconName, 'w-6 h-6')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#567A87]">
                        MASTERCLASS #{selectedJourney.order}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-white/10">
                        {selectedJourney.targetProfile}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                      {selectedJourney.title[locale]}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs bg-[#0B0F12] p-1.5 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => activeMasterclassStepIndex > 0 && setActiveMasterclassStepIndex(activeMasterclassStepIndex - 1)}
                    disabled={activeMasterclassStepIndex === 0}
                    className="p-1.5 rounded-lg text-[#A9ADA5] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-bold text-white">
                    {activeMasterclassStepIndex + 1} / {selectedJourney.steps.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => activeMasterclassStepIndex < selectedJourney.steps.length - 1 && setActiveMasterclassStepIndex(activeMasterclassStepIndex + 1)}
                    disabled={activeMasterclassStepIndex === selectedJourney.steps.length - 1}
                    className="p-1.5 rounded-lg text-[#A9ADA5] hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {selectedJourney.steps.map((st, idx) => {
                  const isActive = idx === activeMasterclassStepIndex;
                  const isDone = isCompleted(selectedJourney.id, st.stepNumber);

                  return (
                    <button
                      key={st.stepNumber}
                      type="button"
                      onClick={() => setActiveMasterclassStepIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all font-mono text-xs ${
                        isActive
                          ? 'bg-[#567A87]/30 border-[#567A87] text-white font-bold ring-1 ring-[#567A87]/40'
                          : isDone
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#0B0F12]/60 border-white/10 text-[#A9ADA5] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Étape {st.stepNumber}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step */}
            {activeMasterclassStep && (
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#567A87] uppercase tracking-wider font-bold">
                    {locale === 'fr' ? `ÉTAPE ${activeMasterclassStep.stepNumber} : ÉTUDE APPLIQUÉE` : `STEP ${activeMasterclassStep.stepNumber}: APPLIED STUDY`}
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white">
                    {activeMasterclassStep.title[locale]}
                  </h3>
                  <p className="text-sm text-[#F4F1E8] bg-[#0B0F12] p-4 rounded-xl border border-white/10 leading-relaxed font-sans">
                    {activeMasterclassStep.summary[locale]}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[#A9ADA5] uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>{locale === 'fr' ? 'Approfondissement & Physique du Système' : 'System Operation & Physical Principles'}</span>
                  </h4>
                  <div className="text-sm text-[#A9ADA5] bg-[#0B0F12]/80 p-4 rounded-xl border border-white/10 leading-relaxed space-y-2">
                    <p>{activeMasterclassStep.deepExplanation[locale]}</p>
                  </div>
                </div>

                {activeMasterclassStep.keyFormulas && activeMasterclassStep.keyFormulas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-[#A9ADA5] uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Formulations Mathématiques' : 'Mathematical Formulations'}</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-[#0B0F12] border border-white/10 space-y-1.5 font-mono text-xs text-[#D7A64A]">
                      {activeMasterclassStep.keyFormulas.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[#A9ADA5] font-bold">({i + 1})</span>
                          <code className="text-[#D7A64A] bg-[#151C1E] px-2 py-0.5 rounded border border-white/5">
                            {f}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeMasterclassStep.fieldEngineeringTips && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Retour Terrain Cameroun (SONATREL / Eneo)' : 'Cameroon Grid Utility Field Tip'}</span>
                    </div>
                    <p className="text-emerald-200/90 leading-relaxed font-sans">
                      {activeMasterclassStep.fieldEngineeringTips[locale]}
                    </p>
                  </div>
                )}

                {/* Target Tool Action */}
                <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/40 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#567A87] uppercase">
                      {locale === 'fr' ? 'Mise en Pratique Immédiate :' : 'Hands-On Practice:'}
                    </span>
                    <div className="text-sm font-bold font-mono text-white">
                      {activeMasterclassStep.targetAction.label[locale]}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunchTargetTool(activeMasterclassStep.targetAction)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#567A87] hover:bg-[#567A87]/80 text-white font-mono text-xs font-bold transition-all shadow-md"
                  >
                    <span>{locale === 'fr' ? 'Ouvrir l’Outil' : 'Launch Tool'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Quiz */}
                <div className="p-5 rounded-2xl bg-[#0B0F12] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                      <HelpCircle className="w-4 h-4" />
                      <span>{locale === 'fr' ? 'Contrôle des Connaissances' : 'Step Knowledge Check'}</span>
                    </div>
                    {isCompleted(selectedJourney.id, activeMasterclassStep.stepNumber) && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? 'Validé' : 'Completed'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-white font-mono">
                    {activeMasterclassStep.quiz.question[locale]}
                  </p>

                  <div className="space-y-2">
                    {activeMasterclassStep.quiz.options.map((opt, optIdx) => {
                      const isSelected = masterclassAnswer === optIdx;
                      const isCorrect = optIdx === activeMasterclassStep.quiz.correctAnswerIndex;

                      let btnClass = 'bg-[#151C1E] border-white/10 text-[#A9ADA5] hover:border-white/20';
                      if (isMasterclassAnswerSubmitted) {
                        if (isCorrect) {
                          btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnClass = 'bg-[#567A87]/30 border-[#567A87] text-white font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => !isMasterclassAnswerSubmitted && setMasterclassAnswer(optIdx)}
                          disabled={isMasterclassAnswerSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border font-mono text-xs transition-all flex items-center justify-between ${btnClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#0B0F12] border border-white/10">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt[locale]}</span>
                          </div>
                          {isMasterclassAnswerSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                          {isMasterclassAnswerSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
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
                      className="w-full py-2.5 rounded-lg bg-[#567A87] hover:bg-[#567A87]/90 disabled:opacity-40 text-white font-mono text-xs font-bold transition-all shadow-md"
                    >
                      {locale === 'fr' ? 'Valider ma Réponse' : 'Submit Answer'}
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#151C1E] border border-white/10 text-xs font-sans space-y-2">
                      <div className="font-mono font-bold text-white flex items-center gap-1.5">
                        {masterclassAnswer === activeMasterclassStep.quiz.correctAnswerIndex ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{locale === 'fr' ? 'Excellente réponse !' : 'Excellent answer!'}</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <X className="w-4 h-4" />
                            <span>{locale === 'fr' ? 'Réponse incorrecte' : 'Incorrect answer'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[#A9ADA5] leading-relaxed">
                        {activeMasterclassStep.quiz.explanation[locale]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Nav */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => activeMasterclassStepIndex > 0 && setActiveMasterclassStepIndex(activeMasterclassStepIndex - 1)}
                    disabled={activeMasterclassStepIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B0F12] hover:bg-white/5 disabled:opacity-30 text-[#A9ADA5] font-mono text-xs transition-colors border border-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{locale === 'fr' ? 'Étape Précédente' : 'Previous Step'}</span>
                  </button>

                  {activeMasterclassStepIndex < selectedJourney.steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveMasterclassStepIndex(activeMasterclassStepIndex + 1)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#567A87] hover:bg-[#567A87]/90 text-white font-mono text-xs font-bold transition-colors"
                    >
                      <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Step'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>{locale === 'fr' ? 'Fin du Cursus !' : 'Curriculum Completed!'}</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
