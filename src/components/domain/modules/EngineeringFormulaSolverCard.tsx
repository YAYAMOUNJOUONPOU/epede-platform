// src/components/domain/modules/EngineeringFormulaSolverCard.tsx
import React, { useState } from 'react';
import { Calculator, CheckCircle2, Info, ArrowRight, RotateCcw } from 'lucide-react';

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

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
              {locale === 'fr' ? 'Équation & Résolveur Interactif' : 'Equation & Interactive Solver'}
            </span>
            {standardRef && (
              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {standardRef}
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
            {locale === 'fr' ? titleFr : titleEn}
          </h4>
        </div>

        {onOpenFullCalculator && (
          <button
            type="button"
            onClick={onOpenFullCalculator}
            className="text-xs font-mono font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{locale === 'fr' ? 'Calculateur complet' : 'Full Calculator'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Math Formula Display Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-purple-200 font-mono text-sm sm:text-base font-bold flex items-center justify-between overflow-x-auto shadow-inner">
        <span className="tracking-wide">{expression}</span>
        <span className="text-[10px] text-slate-400 font-normal ml-3 shrink-0">
          Système International (SI)
        </span>
      </div>

      {/* Variables Definition Table (Turn2Engineering style) */}
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-slate-700 uppercase block">
          {locale === 'fr' ? 'Définition des variables & unités :' : 'Variable Definitions & Units:'}
        </span>
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
              <tr>
                <th className="py-2 px-3">{locale === 'fr' ? 'Symbole' : 'Symbol'}</th>
                <th className="py-2 px-3">{locale === 'fr' ? 'Grandeur Physique' : 'Physical Quantity'}</th>
                <th className="py-2 px-3">{locale === 'fr' ? 'Unité' : 'SI Unit'}</th>
                <th className="py-2 px-3">{locale === 'fr' ? 'Plage Typique' : 'Typical Range'}</th>
                <th className="py-2 px-3 text-right">{locale === 'fr' ? 'Paramètre' : 'Input'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {variables.map((v) => (
                <tr key={v.symbol} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-bold text-purple-700">{v.symbol}</td>
                  <td className="py-2 px-3 text-slate-800 font-sans">
                    {locale === 'fr' ? v.nameFr : v.nameEn}
                  </td>
                  <td className="py-2 px-3 text-slate-500 font-bold">{v.unit}</td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">{v.typicalRange}</td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      value={inputs[v.symbol] !== undefined ? inputs[v.symbol] : ''}
                      onChange={(e) => handleInputChange(v.symbol, parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 text-right rounded border border-slate-300 font-mono text-xs font-bold bg-white text-slate-900 focus:ring-1 focus:ring-purple-500 focus:outline-none"
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
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="font-mono text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span>{locale === 'fr' ? 'Hypothèses de Calcul' : 'Engineering Assumptions'}</span>
          </span>
          <ul className="space-y-1 font-mono text-[11px] text-slate-600">
            {(locale === 'fr' ? assumptionsFr : assumptionsEn).map((hyp, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-purple-600">•</span>
                <span>{hyp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Result Box */}
        <div className="p-4 rounded-xl bg-purple-900 text-white border border-purple-950 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-purple-300 font-bold uppercase">
              {locale === 'fr' ? 'Résultat Immédiat' : 'Immediate Computed Result'}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] font-mono text-purple-300 hover:text-white flex items-center gap-1"
              title="Reset default values"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
              {calculated.resultValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className="font-mono text-sm font-bold text-purple-200">
              {calculated.unit}
            </span>
          </div>

          <p className="font-sans text-xs text-purple-100 leading-snug">
            {locale === 'fr' ? calculated.explanationFr : calculated.explanationEn}
          </p>
        </div>
      </div>
    </div>
  );
};
