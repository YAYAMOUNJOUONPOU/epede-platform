// src/components/grid-architecture/modules/GridPlanningDeliverablesExportEngine.tsx
// EPEDE D02 - Master Grid Planning Deliverables & Stamped DQE Investment Engine (FCFA / EUR)
// Calibrated to Cameroon SONATREL Transmission Master Plan (PDER 2035) & AfDB Infrastructure Benchmarks

import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Download,
  Printer,
  Award,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { GridPlanningScenario } from '../types';
import { GridPlanningCalculations } from '../services/useGridPlanningProjectStore';

interface GridPlanningDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  scenario: GridPlanningScenario;
  voltageKv: number;
  transitPowerMw: number;
  lineLengthKm: number;
  calculations: GridPlanningCalculations;
}

export const GridPlanningDeliverablesExportEngine: React.FC<GridPlanningDeliverablesExportEngineProps> = ({
  locale,
  scenario,
  voltageKv,
  transitPowerMw,
  lineLengthKm,
  calculations
}) => {
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Conversion rate: 1 EUR = 655.957 FCFA
  const rateEur = 655.957;

  // Format currency
  const formatMoney = (amountFcfa: number) => {
    if (currency === 'FCFA') {
      return `${amountFcfa.toLocaleString('fr-FR')} FCFA`;
    }
    const eur = Math.round(amountFcfa / rateEur);
    return `${eur.toLocaleString('fr-FR')} €`;
  };

  // Itemized Investment DQE Line Items based on line length and voltage
  const dqeItems = [
    {
      code: 'LOT-01',
      designationFr: `Ligne Aérienne ${voltageKv} kV Double Terne (Faisceau Almelec, Isolateurs Verre, Pylônes Treillis)`,
      designationEn: `${voltageKv} kV Double-Circuit Overhead Transmission Line (Almelec bundle, glass insulators, steel lattice towers)`,
      quantity: `${lineLengthKm} km`,
      unitPriceFcfa: 185_000_000,
      totalFcfa: lineLengthKm * 185_000_000,
      standard: 'CEI 60826 / CEI 61089'
    },
    {
      code: 'LOT-02',
      designationFr: 'Câble de Garde à Fibre Optique Intégrée (OPGW 48 FO) & Accessoires de Fixation',
      designationEn: 'Optical Ground Wire (OPGW 48 fibers) & Vibration Damper Assemblies',
      quantity: `${lineLengthKm} km`,
      unitPriceFcfa: 12_500_000,
      totalFcfa: lineLengthKm * 12_500_000,
      standard: 'CEI 60794-4-10'
    },
    {
      code: 'LOT-03',
      designationFr: `Travées Ligne ${voltageKv} kV Complètes (Disjoncteurs SF6, Sectionneurs, TC, TT, Parafoudres)`,
      designationEn: `${voltageKv} kV Feeder Bays (SF6 Circuit Breakers, Disconnectors, CTs, VTs, Surge Arresters)`,
      quantity: '2 travées',
      unitPriceFcfa: 1_250_000_000,
      totalFcfa: 2 * 1_250_000_000,
      standard: 'CEI 62271-100 / CEI 61936-1'
    },
    {
      code: 'LOT-04',
      designationFr: 'Système de Compensation Réactive Shunt 50 MVAR (Gradins HTB & Disjoncteur Synchronisé)',
      designationEn: '50 MVAR Shunt Capacitor Bank Compensation (HV steps & point-on-wave switching breaker)',
      quantity: '1 ensemble',
      unitPriceFcfa: 1_450_000_000,
      totalFcfa: 1_450_000_000,
      standard: 'CEI 60871-1 / IEEE 18'
    },
    {
      code: 'LOT-05',
      designationFr: 'Contrôle-Commande Numérique (CCN / SCADA CEI 61850) & Protection Ligne Différentielle (ANSI 87L/21)',
      designationEn: 'Substation Automation System (SAS IEC 61850) & Line Protection Relays (ANSI 87L/21)',
      quantity: '1 lot',
      unitPriceFcfa: 680_000_000,
      totalFcfa: 680_000_000,
      standard: 'CEI 61850 / IEEE C37.90'
    },
    {
      code: 'LOT-06',
      designationFr: 'Études d’Impact Environnemental et Social (EIES), Libération Emprises et Plan de Gestion (PGES)',
      designationEn: 'Environmental & Social Impact Assessment (ESIA), Right-of-Way Clearance & RAP Plan',
      quantity: '1 forfait',
      unitPriceFcfa: 950_000_000,
      totalFcfa: 950_000_000,
      standard: 'Normes SFI / MINEE Cameroun'
    }
  ];

  const subTotalFcfa = dqeItems.reduce((acc, it) => acc + it.totalFcfa, 0);
  const contingenciesFcfa = Math.round(subTotalFcfa * 0.08); // 8% imprévus
  const engineeringSupervisionFcfa = Math.round(subTotalFcfa * 0.05); // 5% MOE / Maîtrise d'œuvre
  const totalProjectCapExFcfa = subTotalFcfa + contingenciesFcfa + engineeringSupervisionFcfa;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `
EPEDE D02 - DOSSIER DE PLANIFICATION RÉSEAU & CRITÈRE N-1
Projet / Scénario : ${scenario.title.fr}
Tension Dorsale : ${voltageKv} kV | Transit : ${transitPowerMw} MW | Longueur : ${lineLengthKm} km
Tension Nodale Arrivée : ${calculations.receivingEndVoltageKv} kV (Chute : ${calculations.voltageDropPct}%)
Pertes Joule de Transport : ${calculations.jouleLossesMw} MW (${calculations.jouleLossesPct}%)
Conformité Critère N-1 : ${calculations.isN1Compliant ? 'CONFORME (Pas de surcharge cascade)' : 'NON-CONFORME (Surcharge inadmissible)'}
Indices de Fiabilité Est. : SAIDI = ${calculations.estimatedSaidiHoursPerYear} h/an | SAIFI = ${calculations.estimatedSaifiEventsPerYear} coupures/an
Investissement Global Estimé : ${formatMoney(totalProjectCapExFcfa)}
Référentiel : Code de Réseau SONATREL & CEI 60038 / CEI 60909
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* 1. Header Toolbar */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Dossier d’Ingénierie Réseau & Devis Estimatif DQE (CapEx)' : 'Transmission Planning Dossier & Stamped CapEx BOQ'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Certifié SONATREL / CEI
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Synthèse technico-économique complète du schéma directeur d’extension, dimensionnement N-1 et bordereau de prix unitaire.'
              : 'Comprehensive techno-economic synthesis of the transmission master plan, N-1 sizing, and unit-rate BOQ schedule.'}
          </p>
        </div>

        {/* Currency Toggle & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-xl border border-[#252E38] bg-[#161B22] p-1 text-xs">
            <button
              type="button"
              onClick={() => setCurrency('FCFA')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'FCFA' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              FCFA
            </button>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'EUR' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EUR (€)
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-[#0E141F] hover:bg-[#141B26] text-slate-300 border border-[#222B38] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <FileCheck className="w-3.5 h-3.5 text-sky-400" />}
            <span>{isCopied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Synthesis Card */}
      <div className="p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              {locale === 'fr' ? 'Fiche d’Adéquation & Évaluation du Schéma Directeur' : 'Adequacy Assessment & Master Plan Card'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {scenario.horizonYears}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Ouvrage Évalué :</span>
            <span className="text-white font-bold">{scenario.title[locale]}</span>
            <div className="text-[10px] text-slate-400 pt-1">
              Dorsale {voltageKv} kV • Longueur {lineLengthKm} km • Transit {transitPowerMw} MW
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Tenue N-1 & Tension Nœud :</span>
            <div className={`font-bold font-mono ${calculations.isN1Compliant ? 'text-emerald-400' : 'text-rose-400'}`}>
              {calculations.isN1Compliant ? 'Critère N-1 Validé (Charge < 105%)' : 'Violation Limite Thermique N-1'}
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Tension Arrivée : {calculations.receivingEndVoltageKv} kV • Chute ΔU : -{calculations.voltageDropKv} kV ({calculations.voltageDropPct}%)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">Bilan Énergétique & Pertes :</span>
            <span className="text-purple-300 font-bold font-mono">{calculations.jouleLossesMw} MW ({calculations.jouleLossesPct}%)</span>
            <div className="text-[10px] text-slate-400 pt-1">
              Pertes annuelles est. : {Math.round(calculations.jouleLossesMw * 8760 * 0.65).toLocaleString('fr-FR')} MWh/an
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Itemized DQE Table */}
      <div className="p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#222B38]">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>{locale === 'fr' ? 'Bordereau des Prix Unitaires & Devis Quantitatif Estimatif (DQE)' : 'Bill of Quantities & Estimated Capital Expenditure'}</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Devise : {currency}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#222B38] text-slate-400 text-[10px] uppercase font-bold bg-[#090D14]">
                <th className="py-2.5 px-3">Lot</th>
                <th className="py-2.5 px-3">Désignation des Prestations & Fournitures</th>
                <th className="py-2.5 px-3">Quantité</th>
                <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                <th className="py-2.5 px-3 text-right">Montant Total ({currency})</th>
                <th className="py-2.5 px-3 text-center">Norme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222B38]/60">
              {dqeItems.map((item) => (
                <tr key={item.code} className="hover:bg-[#141B26] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-400 whitespace-nowrap">{item.code}</td>
                  <td className="py-2.5 px-3 text-slate-200">
                    <div>{locale === 'fr' ? item.designationFr : item.designationEn}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">{item.quantity}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-400 whitespace-nowrap">
                    {formatMoney(item.unitPriceFcfa)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-white whitespace-nowrap">
                    {formatMoney(item.totalFcfa)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {item.standard}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-3 border-t border-[#222B38] space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Sous-Total Fournitures & Travaux HT :</span>
            <span className="font-mono text-white font-bold">{formatMoney(subTotalFcfa)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Imprévus & Aléas Géologiques (8%) :</span>
            <span className="font-mono text-slate-300">{formatMoney(contingenciesFcfa)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Maîtrise d’Œuvre & Supervision Chantier (5%) :</span>
            <span className="font-mono text-slate-300">{formatMoney(engineeringSupervisionFcfa)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#222B38] text-sm">
            <span className="font-bold text-white uppercase">Montant Total Investissement Clé en Main (CapEx) :</span>
            <span className="font-mono font-black text-emerald-400 text-base">{formatMoney(totalProjectCapExFcfa)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
