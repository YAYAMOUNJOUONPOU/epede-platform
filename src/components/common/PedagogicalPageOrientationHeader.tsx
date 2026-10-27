// src/components/common/PedagogicalPageOrientationHeader.tsx
// Implements Audit Report Section 2.2 & Section 4:
// Answers "Où suis-je ?", "Que vais-je comprendre ?", and "Que puis-je faire ensuite ?"
import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Zap,
  Layers,
  HelpCircle
} from 'lucide-react';

export interface PedagogicalOrientationProps {
  locale: 'fr' | 'en';
  whereAmI: {
    domainName: string;
    roleInGrid: string;
    voltageLevel?: string;
    stageNumber?: string;
    categoryTag?: string;
  };
  learningObjectives: string[];
  nextActions: {
    id: string;
    label: string;
    description?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    badge?: string;
  }[];
}

export const PedagogicalPageOrientationHeader: React.FC<PedagogicalOrientationProps> = ({
  locale,
  whereAmI,
  learningObjectives,
  nextActions,
}) => {
  const isFr = locale === 'fr';
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-r from-sky-50/80 via-white to-amber-50/50 dark:from-sky-950/30 dark:via-slate-900/90 dark:to-slate-900 p-4 sm:p-5 shadow-sm transition-all text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Top Toggle Bar */}
      <div className="flex items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-800">
                {isFr ? 'ORIENTATION PÉDAGOGIQUE' : 'PEDAGOGICAL ORIENTATION'}
              </span>
              {whereAmI.stageNumber && (
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  STAGE {whereAmI.stageNumber}
                </span>
              )}
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {isFr ? 'Comprendre ce domaine en 3 questions clés' : 'Understand this domain in 3 key questions'}
            </h2>
          </div>
        </div>

        <button 
          type="button" 
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 3 Pillars Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. OÙ SUIS-JE ? */}
          <div className="rounded-xl p-3.5 bg-white/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>1. {isFr ? 'Où suis-je ?' : 'Where am I?'}</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {whereAmI.domainName}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {whereAmI.roleInGrid}
            </p>
            {whereAmI.voltageLevel && (
              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-slate-500 font-bold">{isFr ? 'Tension :' : 'Voltage:'}</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">{whereAmI.voltageLevel}</span>
              </div>
            )}
          </div>

          {/* 2. QUE VAIS-JE COMPRENDRE ? */}
          <div className="rounded-xl p-3.5 bg-white/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>2. {isFr ? 'Que vais-je comprendre ?' : 'What will I learn?'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. QUE PUIS-JE FAIRE ENSUITE ? */}
          <div className="rounded-xl p-3.5 bg-white/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>3. {isFr ? 'Que puis-je faire ensuite ?' : 'Next steps'}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {nextActions.slice(0, 3).map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={act.onClick}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block truncate">
                        {act.label}
                      </span>
                      {act.description && (
                        <span className="text-[10px] text-slate-500 block truncate">
                          {act.description}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
