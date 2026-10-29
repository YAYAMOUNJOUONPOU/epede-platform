// src/components/domain/modules/EngineeringFormulaSolverCard.tsx
import React, { useState } from 'react';
import { Calculator, CheckCircle2, Info, ArrowRight, RotateCcw, Download } from 'lucide-react';
import { EngineeringCalculationPdfExportService } from '../../calculators/services/EngineeringCalculationPdfExportService';
import type { CalculationReportData } from '../../calculators/CalculationReportModal';

interface VariableDef {
  symbol: string;
  nameFr: string;
  nameEn: string;
  unit: string;
  typicalRange: string;
}

interface EngineeringFormulaSolverCardProps {
  id: string;
  titleFr: string;
  titleEn: string;
  expression: string;
  standardRef?: string;
  assumptionsFr: string[];
  assumptionsEn: string[];
  variables: VariableDef[];
  locale: 'fr' | 'en';
  defaultValues: Record<string, number>;
  calculateResult: (values: Record<string, number>) => { resultValue: number; unit: string; explanationFr: string; explanationEn: string };
  onOpenFullCalculator?: () => void;
}

export const EngineeringFormulaSolverCard: React.FC<EngineeringFormulaSolverCardProps> = ({
  id,
  titleFr,
  titleEn,
  expression,
  standardRef,
  assumptionsFr,
  assumptionsEn,
  variables,
  locale,
  defaultValues,
  calculateResult,
  onOpenFullCalculator,
}) => {
  const [inputs, setInputs] = useState<Record<string, number>>(defaultValues);

  const handleInputChange = (symbol: string, val: number) => {
    setInputs((prev) => ({
      ...prev,
      [symbol]: isNaN(val) ? 0 : val,
    }));
  };

  const handleReset = () => {
    setInputs(defaultValues);
  };

  const calculated = calculateResult(inputs);

  const handleExportPdf = () => {
    const reportData: CalculationReportData = {
      title: locale === 'fr' ? titleFr : titleEn,
      calcType: id || 'domain-formula-solver',
      standard: standardRef || 'CEI / IEEE / NF C',
      date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      referenceId: `SOLV-${(id || 'CALC').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Date.now().toString(36).toUpperCase()}`,
      complianceVerdict: {
        status: 'COMPLIANT',
        message: locale === 'fr' ? calculated.explanationFr : calculated.explanationEn,
      },
      inputs: variables.map((v) => ({
        label: `${v.symbol} - ${locale === 'fr' ? v.nameFr : v.nameEn}`,
        value: `${inputs[v.symbol] !== undefined ? inputs[v.symbol] : defaultValues[v.symbol] ?? 0}`,
        unit: v.unit,
        highlight: false,
        status: 'OK',
      })),
      formulas: [
        {
          name: locale === 'fr' ? 'Formulation Analytique Normative' : 'Normative Analytical Formulation',
          expr: expression,
        },
      ],
      results: [
        {
          label: locale === 'fr' ? 'Grandeur Calculée Immédiate' : 'Computed Immediate Outcome',
          value: `${calculated.resultValue.toLocaleString(undefined, { maximumFractionDigits: 3 })}`,
          unit: calculated.unit,
          highlight: true,
          status: 'OK',
        },
      ],
      engineeringNotes: (locale === 'fr' ? assumptionsFr : assumptionsEn).concat([
        locale === 'fr'
          ? 'Calcul analytique instantané selon les bibliothèques et standards officiels du référentiel EPEDE.'
          : 'Instant analytical calculation following official EPEDE standards and engineering libraries.',
      ]),
    };
    EngineeringCalculationPdfExportService.exportCalculationPdf(reportData, locale);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xs space-y-5 font-sans transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 uppercase">
              {locale === 'fr' ? 'Équation & Résolveur Interactif' : 'Equation & Interactive Solver'}
            </span>
            {standardRef && (
              <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {standardRef}
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-sans">
            {locale === 'fr' ? titleFr : titleEn}
          </h4>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xs transition-all cursor-pointer border border-cyan-400/40"
            title={locale === 'fr' ? 'Télécharger la Note Technique PDF A4' : 'Download Official A4 PDF Design Sheet'}
          >
            <Download className="h-3.5 w-3.5 text-white" />
            <span>{locale === 'fr' ? 'Note PDF A4' : 'PDF Sheet A4'}</span>
          </button>

          {onOpenFullCalculator && (
            <button
              type="button"
              onClick={onOpenFullCalculator}
              className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/30 transition-colors cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Calculateur complet' : 'Full Calculator'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Math Formula Display Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-purple-200 font-mono text-sm sm:text-base font-bold flex items-center justify-between overflow-x-auto shadow-inner border border-slate-800">
        <span className="tracking-wide">{expression}</span>
        <span className="text-[10px] text-slate-400 font-normal ml-3 shrink-0">
          Système International (SI)
        </span>
      </div>

      {/* Variables Definition Table */}
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
          {locale === 'fr' ? 'Définition des variables & unités :' : 'Variable Definitions & Units:'}
        </span>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-950/40">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">{locale === 'fr' ? 'Symbole' : 'Symbol'}</th>
                <th className="py-2.5 px-3">{locale === 'fr' ? 'Grandeur Physique' : 'Physical Quantity'}</th>
                <th className="py-2.5 px-3">{locale === 'fr' ? 'Unité' : 'SI Unit'}</th>
                <th className="py-2.5 px-3">{locale === 'fr' ? 'Plage Typique' : 'Typical Range'}</th>
                <th className="py-2.5 px-3 text-right">{locale === 'fr' ? 'Paramètre' : 'Input'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {variables.map((v) => (
                <tr key={v.symbol} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-bold text-purple-700 dark:text-purple-400">{v.symbol}</td>
                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-sans">
                    {locale === 'fr' ? v.nameFr : v.nameEn}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-bold">{v.unit}</td>
                  <td className="py-2.5 px-3 text-slate-400 dark:text-slate-500 text-[11px]">{v.typicalRange}</td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      value={inputs[v.symbol] !== undefined ? inputs[v.symbol] : ''}
                      onChange={(e) => handleInputChange(v.symbol, parseFloat(e.target.value))}
                      className="w-24 px-2 py-1 text-right rounded border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions and Live Computed Outcome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Engineering Assumptions */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>{locale === 'fr' ? 'Hypothèses de Calcul' : 'Engineering Assumptions'}</span>
          </span>
          <ul className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            {(locale === 'fr' ? assumptionsFr : assumptionsEn).map((hyp, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-purple-600 dark:text-purple-400">•</span>
                <span>{hyp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Result Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white border border-purple-800/60 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-purple-300 font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{locale === 'fr' ? 'Résultat Immédiat' : 'Immediate Computed Result'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] font-mono text-purple-300 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
                title="Reset default values"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {calculated.resultValue.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            </span>
            <span className="font-mono text-sm font-bold text-purple-200">
              {calculated.unit}
            </span>
          </div>

          <p className="font-sans text-xs text-purple-100/90 leading-snug">
            {locale === 'fr' ? calculated.explanationFr : calculated.explanationEn}
          </p>

          <div className="pt-2 border-t border-purple-800/40 flex justify-end">
            <button
              type="button"
              onClick={handleExportPdf}
              className="text-[11px] font-mono font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="h-3 w-3 text-cyan-400" />
              <span>{locale === 'fr' ? 'Éditer Note de Calcul (A4)' : 'Generate Design Note (A4)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
