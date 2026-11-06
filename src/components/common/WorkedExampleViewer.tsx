// src/components/common/WorkedExampleViewer.tsx
// EPEDE 2.0 Standardized Didactic Worked Example Viewer (Task T-303)
// Features: Normative standard badge, problem statement, input parameters, step-by-step solution, and safety verification.

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Download,
} from 'lucide-react';
import type { WorkedExample } from '../../types/contentSchemas';

export interface WorkedExampleViewerProps {
  example: WorkedExample;
  locale: 'fr' | 'en';
  onOpenCalculator?: () => void;
  className?: string;
}

export const WorkedExampleViewer: React.FC<WorkedExampleViewerProps> = ({
  example,
  locale,
  onOpenCalculator,
  className = '',
}) => {
  const isFr = locale === 'fr';
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNum: number) => {
    setExpandedStep(expandedStep === stepNum ? null : stepNum);
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0B1522]/95 shadow-xl backdrop-blur-md overflow-hidden text-[#F4F1E8] space-y-6 p-6 ${className}`}
    >
      {/* 1. Header & Normative Standard Tag */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#B8F000]/15 text-[#B8F000] border border-[#B8F000]/30">
              {isFr ? 'EXEMPLE RÉSOLU' : 'WORKED EXAMPLE'} · {example.domainCode}
            </span>
            <span className="font-mono text-[10px] font-bold text-white/50">
              ID: {example.id}
            </span>
          </div>
          <h3 className="text-xl font-black text-white leading-snug">
            {isFr ? example.title.fr : example.title.en}
          </h3>
        </div>

        {/* Normative Standard Chip & Actions */}
        <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <button
            type="button"
            onClick={async () => {
              const { EngineeringCalculationPdfExportService } = await import(
                '../calculators/services/EngineeringCalculationPdfExportService'
              );
              EngineeringCalculationPdfExportService.exportWorkedExamplePdf(example, locale);
            }}
            className="p-3 rounded-xl bg-[#B8F000]/15 hover:bg-[#B8F000]/25 text-[#B8F000] border border-[#B8F000]/30 flex items-center gap-2 font-mono text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
            title={isFr ? 'Télécharger la note technique de calcul au format PDF A4' : 'Download technical calculation sheet as A4 PDF'}
          >
            <Download className="w-4 h-4 text-[#B8F000]" />
            <span className="hidden sm:inline">{isFr ? 'Note PDF A4' : 'A4 PDF Sheet'}</span>
          </button>

          <div className="shrink-0 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5 max-w-sm">
            <BookOpen className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-mono font-bold text-[#38BDF8]">
                {example.primaryStandard.standard}
              </div>
              <div className="text-white/60 text-[11px]">
                {example.primaryStandard.clause}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Problem Statement */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D7A64A]">
          {isFr ? 'ÉNONCÉ DU PROBLÈME D’INGÉNIERIE' : 'ENGINEERING PROBLEM STATEMENT'}
        </div>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
          {isFr ? example.problemStatement.fr : example.problemStatement.en}
        </p>
      </div>

      {/* 3. Input Parameters Table */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/70">
          {isFr ? 'DONNÉES D’ENTRÉE NORMALISÉES' : 'STANDARDIZED INPUT PARAMETERS'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {example.inputs.map((input) => (
            <div
              key={input.symbol}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="font-mono font-black text-sm text-[#B8F000]">
                  {input.symbol}
                </span>
                <p className="text-[10px] text-white/60">
                  {isFr ? input.description.fr : input.description.en}
                </p>
              </div>
              <div className="text-right font-mono text-xs font-bold text-white">
                {input.value}{' '}
                <span className="text-white/60 text-[11px]">{input.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Step-by-Step Calculation Solution */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/70">
          {isFr
            ? 'RÉSOLUTION ÉTAPE PAR ÉTAPE (APPLICATION NUMÉRIQUE)'
            : 'STEP-BY-STEP CALCULATION SOLUTION'}
        </div>

        <div className="space-y-2.5">
          {example.steps.map((step) => {
            const isExpanded = expandedStep === null || expandedStep === step.stepNumber;
            return (
              <div
                key={step.stepNumber}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleStep(step.stepNumber)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B8F000] text-[#102A43] font-mono text-xs font-black flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isFr ? step.title.fr : step.title.en}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#B8F000] font-bold">
                    <span>{step.resultWithUnit}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 space-y-3 border-t border-white/10 bg-black/20 text-xs">
                    {/* Formula & Substitution Box */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5 font-mono text-[11px]">
                      <div className="text-white/50">
                        {isFr ? 'Formule directrice :' : 'Governing formula:'}{' '}
                        <code className="text-[#38BDF8]">{step.governingFormula}</code>
                      </div>
                      <div className="text-[#B8F000] font-bold">
                        {step.substitutionAndCalculation}
                      </div>
                    </div>

                    {/* Engineering Explanation */}
                    <p className="text-white/80 leading-relaxed text-[11px] font-sans">
                      {isFr ? step.explanation.fr : step.explanation.en}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Final Compliance & Sizing Verdict */}
      <div className="p-4 rounded-xl bg-[#102A43]/70 border border-[#B8F000]/40 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#B8F000] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono text-xs font-black text-[#B8F000] uppercase tracking-wider">
            {isFr ? 'VERDICT DE CONFORMITÉ NORMATIVE' : 'NORMATIVE COMPLIANCE VERDICT'}
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-sans">
            {isFr ? example.finalVerification.fr : example.finalVerification.en}
          </p>
        </div>
      </div>

      {/* 6. Non-Dismissible Didactic Notice */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{example.didacticNotice}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => EngineeringCalculationPdfExportService.exportWorkedExamplePdf(example, locale)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8F000]/10 hover:bg-[#B8F000]/20 text-[#B8F000] font-mono text-[10px] font-bold border border-[#B8F000]/30 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B8F000]" />
            <span>{isFr ? 'Exporter PDF' : 'Export PDF'}</span>
          </button>
          {onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold border border-white/20 transition-colors cursor-pointer shrink-0"
            >
              <Calculator className="w-3.5 h-3.5 text-[#B8F000]" />
              <span>{isFr ? 'Calculateur Associé' : 'Related Calculator'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

