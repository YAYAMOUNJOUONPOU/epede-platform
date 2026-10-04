// src/components/ai/modules/AiDeliverablesExportEngine.tsx
// EPEDE D09 - Artificial Intelligence & Advanced Technologies Stamped BOQ/DQE Deliverables Engine (FCFA / EUR)
// Calibrated to Cameroon Critical Power Assets (Songloulou, Oyomabang, Douala AMI, Maroua)

import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Printer,
  Award,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Cpu,
  Flame,
  Activity,
  ShieldAlert,
  Server
} from 'lucide-react';
import {
  type AiSiteProfile,
  type AiCalculations,
  type AiBoqItem
} from '../services/useAiProjectStore';

interface AiDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  profile: AiSiteProfile;
  calculations: AiCalculations;
  billOfQuantities: {
    items: AiBoqItem[];
    totalCostFcfa: number;
    totalCostEur: number;
  };
  onJumpToStage?: (stage: 1 | 2 | 3 | 4 | 5) => void;
}

export const AiDeliverablesExportEngine: React.FC<AiDeliverablesExportEngineProps> = ({
  locale,
  profile,
  calculations,
  billOfQuantities,
  onJumpToStage
}) => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', labelFr: 'Tous les Lots (1 à 6)', labelEn: 'All Lots (1-6)' },
    { id: 'SENSORS', labelFr: 'Capteurs & DGA', labelEn: 'Sensors & DGA' },
    { id: 'EDGE_HARDWARE', labelFr: 'Serveurs Edge', labelEn: 'Edge Servers' },
    { id: 'CYBERSECURITY', labelFr: 'Cybersécurité OT', labelEn: 'OT Cybersecurity' },
    { id: 'DRONES', labelFr: 'Drones & LiDAR', labelEn: 'Drones & LiDAR' },
    { id: 'SOFTWARE', labelFr: 'Licences & MCO', labelEn: 'Software & SLA' }
  ];

  const filteredItems = selectedFilterCategory === 'ALL'
    ? billOfQuantities.items
    : billOfQuantities.items.filter((item) => item.category === selectedFilterCategory);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono text-xs" id="ai-deliverables-export-engine">
      {/* 1. OFFICIAL STAMPED EXECUTIVE SYNTHESIS */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          {/* Engineering Visa Stamp */}
          <div className="border-2 border-emerald-500/80 rounded-xl px-4 py-2 bg-emerald-950/60 text-emerald-300 font-bold uppercase tracking-wider text-center rotate-1 shadow-lg shadow-emerald-950/60">
            <div className="text-[10px] text-emerald-400">EPEDE · INGÉNIERIE IA & OT</div>
            <div className="text-xs text-white">BON POUR EXÉCUTION</div>
            <div className="text-[9px] text-emerald-400 font-mono">VISA ÉTUDES N° D09-2026-CM</div>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              DOSSIER TECHNIQUE OFFICIEL · DOMAINE D09
            </span>
            <span className="text-slate-400 text-[10px]">
              {profile.cameroonReference}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
            {profile.nameFr}
          </h2>

          <p className="text-slate-300 text-xs leading-relaxed">
            Dossier d'ingénierie préliminaire pour l'intégration de capteurs industriels connectés, serveurs Edge de sous-station CEI 61850-3, jumeaux numériques thermiques PINN et sondes cybernétiques d'inspection profonde (DPI). Conforme aux normes IEEE C57.104, CEI 60076-7, ISO 10816 et CEI 62443.
          </p>

          {/* Quick Recap Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase">Diagnostic DGA</span>
              <div className="text-sm font-bold text-indigo-300">{calculations.dgaFaultCode} ({calculations.dgaConfidencePercent}%)</div>
              <span className="text-[10px] text-slate-400">{calculations.dgaFaultName.split('(')[0]}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase">Point Chaud & RUL</span>
              <div className="text-sm font-bold text-amber-300">{calculations.hotSpotTempC} °C</div>
              <span className="text-[10px] text-slate-400">{calculations.remainingUsefulLifeYears} ans restants</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase">Vibration Palier</span>
              <div className="text-sm font-bold text-cyan-300">{calculations.vibrationRmsVelocityMmS} mm/s</div>
              <span className="text-[10px] text-slate-400">Zone {calculations.vibrationIsoZone} ISO 10816</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase">Budget Estimé CapEx</span>
              <div className="text-sm font-bold text-emerald-400">{(billOfQuantities.totalCostFcfa / 1_000_000).toFixed(1)} M FCFA</div>
              <span className="text-[10px] text-slate-400">~ {(billOfQuantities.totalCostEur / 1000).toFixed(0)} k€ HT</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DQE / BILL OF QUANTITIES SECTION */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
              <span>Devis Quantitatif Estimatif (DQE) — Équipements IA & Infrastructure Télécom</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chiffrage unitaire et forfaits matériel / logiciel fondés sur les mercuriales industrielles au Cameroun
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all font-bold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimer / PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedFilterCategory(c.id)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                selectedFilterCategory === c.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {locale === 'fr' ? c.labelFr : c.labelEn}
            </button>
          ))}
        </div>

        {/* DQE Items Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Poste</th>
                <th className="py-2.5 px-3 font-semibold">Désignation des Prestations & Équipements</th>
                <th className="py-2.5 px-3 font-semibold text-center">Unité</th>
                <th className="py-2.5 px-3 font-semibold text-center">Qté</th>
                <th className="py-2.5 px-3 font-semibold text-right">Prix Unitaire (FCFA)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Montant Total (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredItems.map((item) => (
                <tr key={item.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-indigo-400 whitespace-nowrap">{item.code}</td>
                  <td className="py-3 px-3 max-w-md">
                    <div className="text-white font-semibold">{locale === 'fr' ? item.descriptionFr : item.descriptionEn}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-0.5">{item.category}</div>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">{item.unit}</td>
                  <td className="py-3 px-3 text-center font-bold text-white whitespace-nowrap">{item.quantity}</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                    {item.unitPriceFcfa.toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-bold text-emerald-400 font-mono">
                    {item.totalPriceFcfa.toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-white text-xs">
                <td colSpan={5} className="py-3 px-3 text-right uppercase tracking-wider">
                  TOTAL GÉNÉRAL HORS TAXES (FCFA) :
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm font-mono whitespace-nowrap">
                  {billOfQuantities.totalCostFcfa.toLocaleString('fr-FR')} FCFA
                </td>
              </tr>
              <tr className="bg-slate-950 text-slate-400 text-[11px]">
                <td colSpan={5} className="py-1.5 px-3 text-right uppercase">
                  Contrevaleur Indicative en Euros (Parité fixe 1 EUR = 655,957 FCFA) :
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-cyan-300 whitespace-nowrap">
                  ~ {billOfQuantities.totalCostEur.toLocaleString('fr-FR')} € HT
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Contractual and Quality Clauses */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-400 text-[11px] leading-relaxed">
          <div className="text-indigo-400 font-bold uppercase tracking-wider">Clauses Contractuelles d'Ingénierie & de Déploiement :</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Les analyseurs DGA et passerelles Edge doivent disposer de certificats d'essais de type en laboratoire accrédité (KEMA/CESI) attestant de l'immunité CEM selon CEI 61000-6-5 et CEI 61850-3.</li>
            <li>Les algorithmes d'inférence d'IA déployés en périphérie doivent être audités conformément au cadre NIST AI RMF 1.0 (explicabilité des prédictions, absence de biais et tests de robustesse).</li>
            <li>Garantie constructeur et Maintien en Condition Opérationnelle (MCO) de 36 mois avec fourniture des mises à jour de sécurité et signatures de détection d'intrusions MITRE ICS.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
