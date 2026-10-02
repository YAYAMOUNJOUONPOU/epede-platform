// src/components/journey/ThematicJourneysWorkbench.tsx
// EPEDE Priority #10 - Parcours Guidés Thématiques (Thematic Guided Learning Journeys)
// Interactive curriculum workbench guiding engineers and students across 7 structured paths
// with progress tracking, interactive quizzes, direct tooling links, and Cameroon grid grounding.

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  ShieldCheck,
  Building2,
  Activity,
  Cpu,
  Globe,
  ShieldAlert,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  THEMATIC_JOURNEYS,
  ThematicJourney,
  JourneyStep,
} from '../../data/thematicJourneysData';
import { useUsageLevel, UsageLevel } from '../../services/UsageLevelContext';
import type { AppViewType } from '../../services/routerService';

interface ThematicJourneysWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: AppViewType, context?: any) => void;
  initialJourneyId?: string;
}

export const ThematicJourneysWorkbench: React.FC<ThematicJourneysWorkbenchProps> = ({
  locale,
  onNavigate,
  initialJourneyId,
}) => {
  const { usageLevel } = useUsageLevel();

  // Active journey state
  const [selectedJourney, setSelectedJourney] = useState<ThematicJourney>(() => {
    if (initialJourneyId) {
      const found = THEMATIC_JOURNEYS.find((j) => j.id === initialJourneyId);
      if (found) return found;
    }
    return THEMATIC_JOURNEYS[0];
  });

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // User completed steps tracking stored in localStorage
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('epede-journey-completed-steps');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {};
  });

  // Profile filter for journeys
  const [profileFilter, setProfileFilter] = useState<'ALL' | UsageLevel>('ALL');

  // Filtered journeys
  const filteredJourneys = useMemo(() => {
    return THEMATIC_JOURNEYS.filter((j) => {
      if (profileFilter !== 'ALL' && j.targetProfile !== profileFilter) return false;
      return true;
    });
  }, [profileFilter]);

  // Current active step
  const activeStep: JourneyStep | undefined = selectedJourney.steps[activeStepIndex];

  // Save progress
  const markStepComplete = (journeyId: string, stepNum: number) => {
    setCompletedSteps((prev) => {
      const current = prev[journeyId] || [];
      if (current.includes(stepNum)) return prev;
      const updated = { ...prev, [journeyId]: [...current, stepNum] };
      try {
        localStorage.setItem('epede-journey-completed-steps', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const isStepCompleted = (journeyId: string, stepNum: number) => {
    return (completedSteps[journeyId] || []).includes(stepNum);
  };

  const getJourneyProgressPercent = (journey: ThematicJourney) => {
    const done = (completedSteps[journey.id] || []).length;
    return Math.round((done / journey.steps.length) * 100);
  };

  // Reset quiz state when switching steps
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  }, [activeStepIndex, selectedJourney.id]);

  const handleSelectJourney = (journey: ThematicJourney) => {
    setSelectedJourney(journey);
    setActiveStepIndex(0);
  };

  const handleNextStep = () => {
    if (activeStepIndex < selectedJourney.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === activeStep?.quiz.correctAnswerIndex) {
      markStepComplete(selectedJourney.id, activeStep.stepNumber);
    }
  };

  const getJourneyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-sky-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      default: return <Compass className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleLaunchTargetTool = (action: JourneyStep['targetAction']) => {
    if (!onNavigate) return;
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
      case 'PROVENANCE':
        onNavigate('traceability');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl text-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 flex items-center gap-1.5 shadow-xs">
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                <span>P10 · PARCOURS GUIDÉS THÉMATIQUES</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {locale === 'fr' ? '7 Cursus d\'Ingénierie & Masterclass' : '7 Engineering Learning Curriculums'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white uppercase">
              {locale === 'fr' ? 'Parcours d\'Apprentissage & Montée en Compétences' : 'Thematic Guided Learning Masterclasses'}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Choisissez un parcours structuré selon vos objectifs : comprendre le réseau national du Cameroun, maîtriser les calculs de court-circuit CEI 60909, devenir ingénieur protection ou concevoir un poste source HTA/BT. Chaque étape inclut théorie, formulations, validation interactive et passerelles directes vers les outils.'
                : 'Select a structured path tailored to your goal: understand Cameroon power grid, master IEC 60909 short-circuit calculations, become a protection engineer, or design an MV/LV substation. Each step includes practical insights, formulas, quiz checks, and instant tooling links.'}
            </p>
          </div>

          {/* Quick Level Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-700 font-mono text-xs shrink-0">
            <button
              type="button"
              onClick={() => setProfileFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                profileFilter === 'ALL'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Tous Profils' : 'All Profiles'}
            </button>
            <button
              type="button"
              onClick={() => setProfileFilter('DISCOVERY')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                profileFilter === 'DISCOVERY'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Découverte' : 'Discovery'}
            </button>
            <button
              type="button"
              onClick={() => setProfileFilter('TECHNICAL')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                profileFilter === 'TECHNICAL'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-sky-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Technique' : 'Technical'}
            </button>
            <button
              type="button"
              onClick={() => setProfileFilter('ENGINEERING')}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                profileFilter === 'ENGINEERING'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Ingénierie' : 'Engineering'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Journey Selector Sidebar (4 cols) & Step-by-Step Workbench (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Journey Card List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>{locale === 'fr' ? 'Les 7 Parcours Disponibles' : 'Available Curriculums'}</span>
            <span className="text-indigo-400">{filteredJourneys.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredJourneys.map((journey) => {
              const isSelected = selectedJourney.id === journey.id;
              const progress = getJourneyProgressPercent(journey);

              return (
                <motion.div
                  key={journey.id}
                  whileHover={{ x: 2 }}
                  onClick={() => handleSelectJourney(journey)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-700">
                        {getJourneyIcon(journey.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {journey.targetProfile}
                        </span>
                        <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>~{journey.estimatedMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-emerald-400">{progress}%</span>
                      <div className="w-12 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold font-mono text-white mt-3 group-hover:text-indigo-300">
                    {journey.title[locale]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {journey.description[locale]}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{journey.steps.length} {locale === 'fr' ? 'étapes guidées' : 'guided steps'}</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                      <span>{locale === 'fr' ? 'Explorer' : 'Start'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Interactive Guide (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-6">
          
          {/* Active Journey Header */}
          <div className="border-b border-slate-800 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-slate-950 border border-slate-700">
                  {getJourneyIcon(selectedJourney.iconName)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                      PARCOURS #{selectedJourney.order}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {selectedJourney.targetProfile}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedJourney.title[locale]}
                  </h2>
                </div>
              </div>

              {/* Step Navigation Pill Indicator */}
              <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-200">
                  {activeStepIndex + 1} / {selectedJourney.steps.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={activeStepIndex === selectedJourney.steps.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Breadcrumbs Progress Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
              {selectedJourney.steps.map((st, idx) => {
                const isActive = idx === activeStepIndex;
                const isDone = isStepCompleted(selectedJourney.id, st.stepNumber);

                return (
                  <button
                    key={st.stepNumber}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2 rounded-lg border text-left transition-all font-mono text-[11px] ${
                      isActive
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 font-bold'
                        : isDone
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
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

          {/* Active Step Content */}
          {activeStep && (
            <div className="space-y-6">
              
              {/* Step Title & Summary */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  {locale === 'fr' ? `Étape ${activeStep.stepNumber} : Concept Clé` : `Step ${activeStep.stepNumber}: Core Concept`}
                </span>
                <h3 className="text-xl font-bold font-mono text-white">
                  {activeStep.title[locale]}
                </h3>
                <p className="text-sm text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800 leading-relaxed font-sans">
                  {activeStep.summary[locale]}
                </p>
              </div>

              {/* Deep Engineering Theory */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>{locale === 'fr' ? 'Approfondissement & Physique du Phénomène' : 'Physical Principles & Deep Engineering'}</span>
                </h4>
                <div className="text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800 leading-relaxed font-sans space-y-2">
                  <p>{activeStep.deepExplanation[locale]}</p>
                </div>
              </div>

              {/* Key Mathematical Formulas if any */}
              {activeStep.keyFormulas && activeStep.keyFormulas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'fr' ? 'Formulations Mathématiques & Normatives' : 'Mathematical Formulations'}</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs text-amber-300">
                    {activeStep.keyFormulas.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">({i + 1})</span>
                        <code className="text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {f}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cameroon Field Engineering Practical Tips */}
              {activeStep.fieldEngineeringTips && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Retour d\'Expérience Terrain Cameroun (SONATREL / Eneo)' : 'Cameroon Grid Utility Field Tip'}</span>
                  </div>
                  <p className="text-emerald-200/90 leading-relaxed">
                    {activeStep.fieldEngineeringTips[locale]}
                  </p>
                </div>
              )}

              {/* Direct Tool Launch Action Banner */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-700/50 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase">
                    {locale === 'fr' ? 'Mise en Pratique Immédiate :' : 'Hands-On Practice:'}
                  </span>
                  <div className="text-sm font-bold font-mono text-white">
                    {activeStep.targetAction.label[locale]}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchTargetTool(activeStep.targetAction)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md"
                >
                  <span>{locale === 'fr' ? 'Ouvrir l\'Outil' : 'Launch Tool'}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Step Quiz Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                    <HelpCircle className="w-4 h-4" />
                    <span>{locale === 'fr' ? 'Point de Contrôle & Validation des Acquis' : 'Step Knowledge Check'}</span>
                  </div>
                  {isStepCompleted(selectedJourney.id, activeStep.stepNumber) && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Validé' : 'Completed'}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-white font-mono">
                  {activeStep.quiz.question[locale]}
                </p>

                {/* Multiple choice options */}
                <div className="space-y-2">
                  {activeStep.quiz.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === activeStep.quiz.correctAnswerIndex;

                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-sky-950/80 border-sky-500 text-sky-200 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => !isAnswerSubmitted && setSelectedAnswer(optIdx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-950 border border-slate-700">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt[locale]}</span>
                        </div>
                        {isAnswerSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submit button & feedback */}
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    {locale === 'fr' ? 'Valider ma Réponse' : 'Submit Answer'}
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans space-y-2">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      {selectedAnswer === activeStep.quiz.correctAnswerIndex ? (
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
                    <p className="text-slate-300 leading-relaxed">
                      {activeStep.quiz.explanation[locale]}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Navigation controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-xs transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{locale === 'fr' ? 'Étape Précédente' : 'Previous Step'}</span>
                </button>

                {activeStepIndex < selectedJourney.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
                  >
                    <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Step'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                    <Award className="w-4 h-4" />
                    <span>{locale === 'fr' ? 'Fin du Parcours !' : 'Curriculum Completed!'}</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
