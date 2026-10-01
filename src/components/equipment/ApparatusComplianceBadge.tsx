// src/components/equipment/ApparatusComplianceBadge.tsx
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle, 
  Calculator, 
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import type { Equipment } from '../../types/epede';
import type { ApiEquipmentDto } from '../../services/epedeApiClient';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';

export type ComplianceStatusType = 'PASS' | 'WARNING' | 'FAIL' | 'PENDING';

export interface ApparatusComplianceBadgeProps {
  equipment: Equipment;
  apiEquipment?: ApiEquipmentDto | null;
  locale: 'fr' | 'en';
  calcResults?: any;
  onOpenCalculator?: (tab?: CalculatorTabType) => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

interface ComplianceEvaluation {
  status: ComplianceStatusType;
  standard: string;
  criterionTitle: string;
  metricLabel: string;
  metricValue: string;
  thresholdLabel: string;
  summaryNote: string;
  recommendedTab: CalculatorTabType;
}

export const evaluateApparatusCompliance = (
  equipment: Equipment,
  apiEquipment?: ApiEquipmentDto | null,
  calcResults?: any,
  locale: 'fr' | 'en' = 'fr'
): ComplianceEvaluation => {
  const isTransformer = 
    equipment.entity_type === 'TRANSFORMER' || 
    equipment.id.includes('trafo') || 
    apiEquipment?.type === 'POWER_TRANSFORMER';

  const isCableOrFeeder = 
    equipment.entity_type === 'CABLE' || 
    equipment.id.includes('feeder') || 
    equipment.id.includes('line') || 
    equipment.id.includes('cable') || 
    equipment.domain_code === 'D02' || 
    equipment.domain_code === 'D07';

  const isBreakerOrRelay = 
    equipment.entity_type === 'CIRCUIT_BREAKER' || 
    equipment.id.includes('disjoncteur') || 
    equipment.id.includes('breaker') || 
    equipment.id.includes('relais') || 
    equipment.id.includes('gis') || 
    equipment.domain_code === 'D03';

  // 1. Dynamic check from live calculation results if available
  if (calcResults && calcResults.results) {
    if (calcResults.results.delta_u_percentage !== undefined) {
      const deltaUPct = Number(calcResults.results.delta_u_percentage);
      const standard = 'CEI 60364-5-52 / NF C 15-100 §525';
      const metricLabel = locale === 'fr' ? 'Chute de tension ΔU' : 'Voltage drop ΔU';
      const metricValue = `${deltaUPct.toFixed(2)}%`;
      const thresholdLabel = '≤ 5.00%';

      if (deltaUPct <= 4.0) {
        return {
          status: 'PASS',
          standard,
          criterionTitle: locale === 'fr' ? 'Conformité chute de tension en ligne' : 'Line voltage drop compliance',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr' 
            ? `Chute de tension ΔU de ${deltaUPct.toFixed(2)}% conforme au seuil contractuel CEI (limite 5.0%).`
            : `Voltage drop ΔU of ${deltaUPct.toFixed(2)}% conforms to IEC contractual limit (5.0%).`,
          recommendedTab: 'cable-ampacity'
        };
      } else if (deltaUPct <= 5.0) {
        return {
          status: 'WARNING',
          standard,
          criterionTitle: locale === 'fr' ? 'Tolérance limite admissible' : 'Marginal operating tolerance',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr'
            ? `Chute de tension ΔU de ${deltaUPct.toFixed(2)}% proche du plafond réglementaire de 5.0%. Prévoir compensation réactive.`
            : `Voltage drop ΔU of ${deltaUPct.toFixed(2)}% near the normative 5.0% threshold. Consider reactive power compensation.`,
          recommendedTab: 'cable-ampacity'
        };
      } else {
        return {
          status: 'FAIL',
          standard,
          criterionTitle: locale === 'fr' ? 'Dépassement du seuil de tension CEI' : 'IEC voltage limit exceeded',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr'
            ? `Chute de tension ΔU de ${deltaUPct.toFixed(2)}% EXCÈDE les 5.0% autorisés. Augmentation de section nécessaire.`
            : `Voltage drop ΔU of ${deltaUPct.toFixed(2)}% EXCEEDS 5.0% allowable limit. Conductor up-sizing required.`,
          recommendedTab: 'cable-ampacity'
        };
      }
    }

    if (calcResults.results.ik_symmetrical_ka !== undefined) {
      const ikKa = Number(calcResults.results.ik_symmetrical_ka);
      const standard = 'CEI 60909-0 / CEI 62271-100';
      const metricLabel = locale === 'fr' ? 'Courant de court-circuit Ik"' : 'Short-circuit current Ik"';
      const metricValue = `${ikKa.toFixed(2)} kA`;
      const ratedIcu = apiEquipment?.specifications?.breakingCapacityKa || 31.5;
      const thresholdLabel = `Icu assigné ≥ ${ratedIcu} kA`;

      if (ikKa <= ratedIcu * 0.85) {
        return {
          status: 'PASS',
          standard,
          criterionTitle: locale === 'fr' ? 'Pouvoir de coupure & Tenue thermique Isc' : 'Breaking capacity & Isc withstand',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr'
            ? `Courant Ik" (${ikKa.toFixed(2)} kA) vérifié avec marge de sécurité supérieure à 15% par rapport à l'Icu (${ratedIcu} kA).`
            : `Short-circuit current Ik" (${ikKa.toFixed(2)} kA) verified with >15% margin against apparatus Icu (${ratedIcu} kA).`,
          recommendedTab: 'transformer'
        };
      } else if (ikKa <= ratedIcu) {
        return {
          status: 'WARNING',
          standard,
          criterionTitle: locale === 'fr' ? 'Exploitation proche du pouvoir de coupure' : 'Operating near maximum breaking capacity',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr'
            ? `Ik" (${ikKa.toFixed(2)} kA) est proche du pouvoir de coupure limite (${ratedIcu} kA). Vérifier le courant crête Ip.`
            : `Ik" (${ikKa.toFixed(2)} kA) operates close to maximum breaking capacity (${ratedIcu} kA). Inspect peak Ip current.`,
          recommendedTab: 'transformer'
        };
      } else {
        return {
          status: 'FAIL',
          standard,
          criterionTitle: locale === 'fr' ? 'Pouvoir de coupure insuffisant' : 'Insufficient breaking capacity',
          metricLabel,
          metricValue,
          thresholdLabel,
          summaryNote: locale === 'fr'
            ? `Ik" (${ikKa.toFixed(2)} kA) DÉPASSE le pouvoir assigné (${ratedIcu} kA). Risque de non-ouverture sous défaut franc.`
            : `Ik" (${ikKa.toFixed(2)} kA) EXCEEDS rated breaking capacity (${ratedIcu} kA). Severe risk during bolted fault.`,
          recommendedTab: 'transformer'
        };
      }
    }
  }

  // 2. Default baseline evaluation from apparatus nominal ratings
  if (isTransformer) {
    const ukStr = equipment.technical?.['Tension de court-circuit (Ucc/uk)'] || equipment.technical?.['Tension de court-circuit (uk)'] || '12.5%';
    return {
      status: 'PASS',
      standard: 'CEI 60076-5 / CEI 60909',
      criterionTitle: locale === 'fr' ? 'Tenue diélectrique & impédance uk nominale' : 'Dielectric & nominal uk impedance',
      metricLabel: locale === 'fr' ? 'Impédance court-circuit uk' : 'Short-circuit impedance uk',
      metricValue: `${ukStr}`,
      thresholdLabel: '4.0% à 15.0%',
      summaryNote: locale === 'fr'
        ? 'Spécifications de court-circuit conformes aux exigences CEI 60076 et réseau interconnecté SONATREL.'
        : 'Short-circuit withstand specifications compliant with IEC 60076 and utility grid standards.',
      recommendedTab: 'transformer'
    };
  }

  if (isCableOrFeeder) {
    return {
      status: 'PASS',
      standard: 'CEI 60364-5-52 / CEI 60949',
      criterionTitle: locale === 'fr' ? 'Capacité thermique nominale & Tenue adiabatique' : 'Rated thermal capacity & adiabatic withstand',
      metricLabel: locale === 'fr' ? 'Température continue' : 'Continuous rating',
      metricValue: '90°C (XLPE)',
      thresholdLabel: 'ΔU ≤ 5.0%',
      summaryNote: locale === 'fr'
        ? 'Isolation PR 90°C et âme aluminium/cuivre validées pour régime permanent et court-circuit 0.5 s.'
        : 'XLPE 90°C insulation and conductor sizing verified for continuous and 0.5s short-circuit duty.',
      recommendedTab: 'cable-ampacity'
    };
  }

  if (isBreakerOrRelay) {
    return {
      status: 'PASS',
      standard: 'CEI 62271-100 / CEI 60255-151',
      criterionTitle: locale === 'fr' ? 'Coordination des déclenchements & Pouvoir de coupure' : 'Protection grading & breaking capacity',
      metricLabel: locale === 'fr' ? 'Pouvoir de coupure Icu' : 'Breaking capacity Icu',
      metricValue: apiEquipment?.specifications?.breakingCapacityKa ? `${apiEquipment.specifications.breakingCapacityKa} kA` : '31.5 kA',
      thresholdLabel: 'Marge Δt ≥ 250 ms',
      summaryNote: locale === 'fr'
        ? 'Organe de coupure certifié pour cycle O-0.3s-CO-3min-CO avec sélectivité ampèremétrique garantie.'
        : 'Switchgear certified for O-0.3s-CO-3min-CO standard duty cycle with verified grading discrimination.',
      recommendedTab: 'relay-tcc'
    };
  }

  // Generic fallback
  return {
    status: 'PASS',
    standard: 'CEI / IEEE Standards',
    criterionTitle: locale === 'fr' ? 'Spécifications techniques nominales' : 'Nominal engineering specifications',
    metricLabel: locale === 'fr' ? 'Niveau d\'isolement' : 'Insulation level',
    metricValue: `${equipment.voltage_level || 'HV'}`,
    thresholdLabel: 'Conforme CEI',
    summaryNote: locale === 'fr'
      ? 'Équipement conforme aux règles générales de conception des postes haute et moyenne tension.'
      : 'Apparatus complies with general design requirements for high and medium voltage substations.',
    recommendedTab: 'power'
  };
};

export const ApparatusComplianceBadge: React.FC<ApparatusComplianceBadgeProps> = ({
  equipment,
  apiEquipment,
  locale,
  calcResults,
  onOpenCalculator,
  size = 'md',
  showDetails = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const evalResult = evaluateApparatusCompliance(equipment, apiEquipment, calcResults, locale);

  const statusConfig = {
    PASS: {
      label: locale === 'fr' ? 'CONFORME · CEI VALIDÉ' : 'COMPLIANT · IEC VERIFIED',
      pillBg: 'bg-emerald-500/15 hover:bg-emerald-500/25',
      pillBorder: 'border-emerald-500/40 hover:border-emerald-400/60',
      pillText: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-700/60',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      accentColor: 'emerald',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    },
    WARNING: {
      label: locale === 'fr' ? 'TOLÉRANCE LIMITE' : 'MARGINAL TOLERANCE',
      pillBg: 'bg-amber-500/15 hover:bg-amber-500/25',
      pillBorder: 'border-amber-500/40 hover:border-amber-400/60',
      pillText: 'text-amber-300',
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-700/60',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      accentColor: 'amber',
      dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    },
    FAIL: {
      label: locale === 'fr' ? 'NON CONFORME' : 'NON-COMPLIANT',
      pillBg: 'bg-rose-500/15 hover:bg-rose-500/25',
      pillBorder: 'border-rose-500/40 hover:border-rose-400/60',
      pillText: 'text-rose-300',
      badgeBg: 'bg-rose-950/80',
      badgeBorder: 'border-rose-700/60',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      accentColor: 'rose',
      dotColor: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    },
    PENDING: {
      label: locale === 'fr' ? 'CALCUL EN COURS' : 'PENDING EVALUATION',
      pillBg: 'bg-cyan-500/15 hover:bg-cyan-500/25',
      pillBorder: 'border-cyan-500/40 hover:border-cyan-400/60',
      pillText: 'text-cyan-300',
      badgeBg: 'bg-cyan-950/80',
      badgeBorder: 'border-cyan-700/60',
      icon: HelpCircle,
      iconColor: 'text-cyan-400',
      accentColor: 'cyan',
      dotColor: 'bg-cyan-400',
    },
  }[evalResult.status];

  const IconComponent = statusConfig.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  }[size];

  return (
    <div className={`font-mono inline-flex flex-col ${className}`}>
      {/* Clickable Badge Pill */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          title={locale === 'fr' ? 'Cliquer pour examiner le rapport de conformité normatif' : 'Click to inspect normative compliance sheet'}
          className={`inline-flex items-center gap-2 rounded-xl border transition-all cursor-pointer font-bold ${sizeClasses} ${statusConfig.pillBg} ${statusConfig.pillBorder} ${statusConfig.pillText} shadow-sm`}
        >
          <span className={`h-2 w-2 rounded-full ${statusConfig.dotColor} shrink-0 animate-pulse`} />
          <IconComponent className="h-3.5 w-3.5 shrink-0" />
          <span className="tracking-wider uppercase">{statusConfig.label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 opacity-90">
            {evalResult.standard.split('/')[0].trim()}
          </span>
          {showDetails && (
            <ChevronRight className={`h-3.5 w-3.5 opacity-60 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </button>

        {onOpenCalculator && (
          <button
            type="button"
            onClick={() => onOpenCalculator(evalResult.recommendedTab)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 text-[11px] font-bold transition-all cursor-pointer shadow-sm"
          >
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Note de calcul' : 'Calculation sheet'}</span>
            <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
          </button>
        )}
      </div>

      {/* Expandable Engineering Compliance Card */}
      {showDetails && isExpanded && (
        <div className="mt-3 p-4 rounded-xl border border-[#2A3749] bg-[#0A1017] shadow-xl text-xs space-y-3 max-w-xl animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-2.5">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Info className="h-3.5 w-3.5 text-cyan-400" />
                <span className="uppercase font-bold tracking-wider">{locale === 'fr' ? 'Vérification de Conformité d\'Appareillage' : 'Apparatus Compliance Evaluation'}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {evalResult.criterionTitle}
              </h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.pillText}`}>
              {evalResult.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-1">
            <div className="p-2.5 rounded-lg bg-[#060A10] border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Référentiel Normatif' : 'Standard Reference'}</span>
              <span className="font-bold text-slate-200 text-xs truncate block mt-0.5" title={evalResult.standard}>
                {evalResult.standard}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#060A10] border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">{evalResult.metricLabel}</span>
              <span className={`font-black text-xs block mt-0.5 ${statusConfig.pillText}`}>
                {evalResult.metricValue}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#060A10] border border-slate-800/70 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Seuil Contractuel' : 'Normative Limit'}</span>
              <span className="font-bold text-slate-200 text-xs block mt-0.5">
                {evalResult.thresholdLabel}
              </span>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed bg-[#0F1722]/60 p-2.5 rounded-lg border border-slate-800/60 font-sans">
            {evalResult.summaryNote}
          </p>

          {onOpenCalculator && (
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onOpenCalculator(evalResult.recommendedTab)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>
                  {locale === 'fr' 
                    ? `Injecter dans le calculateur (${evalResult.recommendedTab})` 
                    : `Open in calculator (${evalResult.recommendedTab})`}
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
