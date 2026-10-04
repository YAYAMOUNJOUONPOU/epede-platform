// src/components/power-quality/modules/PqDeliverablesExportEngine.tsx
// EPEDE Domain D17 / D14 - Stage 5: Cameroon Industrial Feedback & Stamped Engineering BOQ/DQE in FCFA

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  MapPin,
  Building,
  ShieldCheck,
  ExternalLink,
  Coins,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { type PqProjectStoreType } from '../services/usePqProjectStore';

interface PqDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  store: PqProjectStoreType;
}

export const PqDeliverablesExportEngine: React.FC<PqDeliverablesExportEngineProps> = ({
  locale,
  store
}) => {
  const {
    activeProfile,
    harmonicAnalytics,
    sagAnalytics,
    detunedAnalytics,
    flickerAnalytics,
    nominalVoltageV,
    fundamentalCurrentA,
    shortCircuitPowerMva,
    isApfActive,
    detuningReactorPct,
    targetCapacitorKvar
  } = store;

  const [activeSubTab, setActiveSubTab] = useState<'feedback' | 'dqe'>('feedback');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  // Bill of Quantities / DQE Itemized Catalog in FCFA
  const boqItems = [
    {
      ref: 'EPEDE-PQ-APF-150A',
      descFr: "Filtre Actif d'Harmoniques Shunt IGBT 150A 400V 3P+N (Temps de réponse 25 µs, atténuation 95% h2-h50)",
      descEn: 'Shunt Active Power Filter IGBT 150A 400V 3P+N (25 µs response, 95% attenuation h2-h50)',
      qty: Math.max(1, Math.ceil(harmonicAnalytics.harmonicCurrentToCancelA / 150)),
      unitPriceFcfa: 14500000,
      standard: 'CEI 62477 / CEI 61000-4-7'
    },
    {
      ref: 'EPEDE-PQ-CAP-DETUNED',
      descFr: `Batterie de condensateurs automatique à gradins avec selfs anti-résonance p=${detuningReactorPct}% (189 Hz) 400V`,
      descEn: `Automatic stepped capacitor bank with p=${detuningReactorPct}% (189 Hz) detuned iron-core reactors 400V`,
      qty: Math.max(1, Math.ceil(targetCapacitorKvar / 100)),
      unitPriceFcfa: 8750000,
      standard: 'CEI 60831-1 / CEI 61642'
    },
    {
      ref: 'EPEDE-PQ-METER-CLASS-A',
      descFr: "Centrale de mesure et analyseur de qualité d'énergie fixe certifié CEI 61000-4-30 Classe A avec passerelle 4G/IP",
      descEn: 'Fixed Power Quality Analyzer certified IEC 61000-4-30 Class A with 4G/IP Ethernet Gateway',
      qty: 2,
      unitPriceFcfa: 4200000,
      standard: 'CEI 61000-4-30 Ed.3'
    },
    {
      ref: 'EPEDE-PQ-AVC-DYNAMIC',
      descFr: "Conditionneur dynamique de creux de tension AVC 250 kVA (Compensation 100% à 50% Un pendant 1 seconde)",
      descEn: 'Dynamic Active Voltage Conditioner AVC 250 kVA (100% compensation at 50% Un for 1.0 sec)',
      qty: sagAnalytics.semiF47Pass ? 0 : 1,
      unitPriceFcfa: 28500000,
      standard: 'SEMI F47 / CEI 61000-4-34'
    },
    {
      ref: 'EPEDE-PQ-TRAFO-K13',
      descFr: `Transformateur sec enrobé de séparation Classe ${harmonicAnalytics.recommendedKClass} 400 kVA basse induction`,
      descEn: `Dry cast-resin isolation transformer Class ${harmonicAnalytics.recommendedKClass} 400 kVA low-flux density`,
      qty: 1,
      unitPriceFcfa: 12800000,
      standard: 'IEEE C57.110 / CEI 60076-11'
    },
    {
      ref: 'EPEDE-PQ-ING-AUDIT',
      descFr: "Prestation d'audit de l'onde électrique sur site (7 jours selon CEI 61000-4-30 Classe A, rapport timbré)",
      descEn: 'On-site power quality audit campaign (7 days per IEC 61000-4-30 Class A, certified engineering report)',
      qty: 1,
      unitPriceFcfa: 2500000,
      standard: 'Arrêté MINEE / SONATREL'
    }
  ];

  // Financial calculations
  const totalHtFcfa = boqItems.reduce((acc, item) => acc + item.qty * item.unitPriceFcfa, 0);
  const tvaFcfa = Math.round(totalHtFcfa * 0.1925); // 19.25% TVA Cameroon standard
  const totalTtcFcfa = totalHtFcfa + tvaFcfa;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const exportData = {
      project: "EPEDE Power Quality & EMC Engineering Report",
      standard: "IEC 61000-4-30 Class A / IEEE 519-2022",
      site: activeProfile,
      telemetry: {
        nominalVoltageV,
        fundamentalCurrentA,
        shortCircuitPowerMva,
        harmonicAnalytics,
        sagAnalytics,
        detunedAnalytics,
        flickerAnalytics
      },
      boq: {
        items: boqItems,
        totalHtFcfa,
        tvaFcfa,
        totalTtcFcfa
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPEDE_PQ_REPORT_${activeProfile.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setReportGenerated(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'feedback'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{locale === 'fr' ? '1. Retours d’Expérience Chantiers Cameroun' : '1. Cameroon Industrial Case Studies'}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('dqe')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'dqe'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>{locale === 'fr' ? '2. Bordereau DQE & Devis Chiffré en FCFA' : '2. Itemized BOQ / DQE in FCFA'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CAMEROON REAL INDUSTRIAL CASE STUDIES */}
      {/* ========================================================================= */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ALUCAM Édéa Case */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800">
                  ÉLECTROMÉTALLURGIE LOURDE (180 MW)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Édéa / Sanaga</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Dépollution Harmonique des Redresseurs de Cuves ALUCAM (90 kV RIS)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Les séries de cuves d'électrolyse d'aluminium d'Édéa requièrent des courants continus de plus de 100 000 A générés par des groupes de redresseurs dodécaphasés (12 impulsions). En l'absence de compensation, l'injection massive de rangs 11 (550 Hz) et 13 (650 Hz) détériorerait la stabilité de l'ensemble du Réseau Interconnecté Sud (RIS).
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                <div className="text-violet-400 font-bold">Solutions Déployées sur Site :</div>
                <div className="text-slate-300">• Déphasage de 30° par transformateurs étoiles-triangles jumelés.</div>
                <div className="text-slate-300">• Bancs de filtres passifs shunt HTB accordés aux rangs 11 et 13.</div>
                <div className="text-slate-300">• Réduction du THDu au poste d'évacuation sous 1.8%.</div>
              </div>
            </div>

            {/* PROMETAL Douala Bassa Case */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ACIÉRIE & FOURS À ARC (45 MW)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Douala Bassa</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Maîtrise du Flicker & Déséquilibre aux Aciéries Prometal
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                L'allumage des arcs électriques et la fusion des ferrailles provoquent des fluctuations stochastiques de puissance réactive (jusqu'à 30 Mvar en quelques millisecondes). Cela engendre un papillotement lumineux intolérable (Pst &gt; 2.5) et des creux de tension sur les départs 15 kV de la zone industrielle de Bassa.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                <div className="text-cyan-400 font-bold">Solutions Déployées sur Site :</div>
                <div className="text-slate-300">• Compensateur statique de puissance réactive (SVC / STATCOM &plusmn; 40 Mvar).</div>
                <div className="text-slate-300">• Filtre d'amortissement de rang 3 (150 Hz) absorbant les dissymétries d'arc.</div>
                <div className="text-slate-300">• Maintien du flicker Pst sous le seuil contractuel de 1.0.</div>
              </div>
            </div>

            {/* CIMENCAM Nomayos Case */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  CIMENTERIE & VARIATEURS VFD (25 MW)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Nomayos / Yaoundé</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Immunité aux Creux de Tension Orageux sur les Broyeurs de Ciment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                En saison des pluies dans la région du Centre, les coups de foudre sur la ligne 90 kV Oyomabang-Nomayos créent des creux de tension brefs (100 à 300 ms). Sans protection SEMI F47, les variateurs de vitesse des broyeurs à boulets se verrouillent en sécurité sous-tension, provoquant des arrêts de production coûteux.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                <div className="text-amber-400 font-bold">Solutions Déployées sur Site :</div>
                <div className="text-slate-300">• Conditionneurs de tension actifs (AVC) avec injection série ultra-rapide.</div>
                <div className="text-slate-300">• Reprise au vol (flying restart) configurée sur le bus DC des VFD.</div>
                <div className="text-slate-300">• Élimination totale des arrêts intempestifs de ligne de broyage.</div>
              </div>
            </div>

            {/* Douala Port Cold Chain Case */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  TERMINAL PORTUAIRE & FROID (12 MW)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Douala Bonabéri</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Éradication des Courants de Neutre Homopolaires (Rang 3)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                L'alimentation simultanée de centaines de conteneurs frigorifiques reefers et d'éclairages électroniques engendre un cumul d'harmoniques de rang 3 (150 Hz) qui s'additionnent arithmétiquement dans le neutre. Des échauffements dangereux (courant neutre &gt; 140% du courant de phase) menaçaient les TGBT.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                <div className="text-emerald-400 font-bold">Solutions Déployées sur Site :</div>
                <div className="text-slate-300">• Filtres actifs tétrapolaires neutralisant le courant résiduel de neutre.</div>
                <div className="text-slate-300">• Transformateurs de séparation basse impédance homopolaire Dyn11.</div>
                <div className="text-slate-300">• Température du neutre stabilisée sous 45 °C en ambiance tropicale.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ITEMIZED BOQ / DQE IN FCFA WITH STAMP */}
      {/* ========================================================================= */}
      {activeSubTab === 'dqe' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
                  {locale === 'fr'
                    ? 'Bordereau des Prix Quantitatif & Estimatif (DQE)'
                    : 'Bill of Quantities & Engineering Estimate'}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
                  {activeProfile.nameFr}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Export Données JSON' : 'Export JSON Data'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-violet-600/30"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Imprimer / PDF' : 'Print / Save PDF'}</span>
                </button>
              </div>
            </div>

            {/* DQE Items Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Réf. Matériel</th>
                    <th className="p-3">Désignation Technique & Norme</th>
                    <th className="p-3 text-center">Qté</th>
                    <th className="p-3 text-right">Prix Unitaire (FCFA HT)</th>
                    <th className="p-3 text-right">Montant Total (FCFA HT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300">
                  {boqItems.map((item, idx) => {
                    const itemTotal = item.qty * item.unitPriceFcfa;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-violet-400">{item.ref}</td>
                        <td className="p-3">
                          <div className="text-white font-medium">
                            {locale === 'fr' ? item.descFr : item.descEn}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Norme: {item.standard}</div>
                        </td>
                        <td className="p-3 text-center font-bold text-white">{item.qty}</td>
                        <td className="p-3 text-right">{item.unitPriceFcfa.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          {itemTotal.toLocaleString()} FCFA
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4 pt-3">
              <div className="w-full sm:w-80 space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Total Hors Taxes (HT) :</span>
                  <span className="font-bold text-white">{totalHtFcfa.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TVA Cameroun (19.25%) :</span>
                  <span className="font-bold text-white">{tvaFcfa.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-slate-800">
                  <span>Total TTC :</span>
                  <span>{totalTtcFcfa.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Engineering Stamped Certification Box */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-violet-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <span>CERTIFICATION D’INGÉNIERIE QUALITÉ D’ÉNERGIE EPEDE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      VISA TECHNIQUE APPROUVÉ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Garantie de dépollution conforme IEEE 519-2022 et immunité SEMI F47 pour environnement tropical sévère.
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
                <div>DATE : {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}</div>
                <div>AUTORITÉ : EPEDE Digital Grid Lab</div>
                <div>RÉF : CAM-PQ-2026-X9</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
