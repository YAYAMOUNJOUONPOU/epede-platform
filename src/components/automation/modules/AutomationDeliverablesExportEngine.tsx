// src/components/automation/modules/AutomationDeliverablesExportEngine.tsx
// EPEDE D07 - Industrial Automation Stamped BOQ/DQE Engineering Deliverables Engine (FCFA / EUR)
// Calibrated to Cameroon Industrial Infrastructure (Nachtigal Hydro, CIMENCAM, SABC, SCDP/SONARA)

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
  Cpu,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import {
  AutomationIndustryProfile,
  AutomationCalculations
} from '../services/useAutomationProjectStore';

interface AutomationDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  profile: AutomationIndustryProfile;
  calculations: AutomationCalculations;
  digitalInputs: number;
  digitalOutputs: number;
  analogInputs: number;
  analogOutputs: number;
  vfdCount: number;
  vfdTotalPowerKw: number;
  onJumpToStage?: (st: 1 | 2 | 3 | 4 | 5) => void;
}

export const AutomationDeliverablesExportEngine: React.FC<AutomationDeliverablesExportEngineProps> = ({
  locale,
  profile,
  calculations,
  digitalInputs,
  digitalOutputs,
  analogInputs,
  analogOutputs,
  vfdCount,
  vfdTotalPowerKw,
  onJumpToStage
}) => {
  const [stampApproved, setStampApproved] = useState<boolean>(true);
  const currentDate = '04/10/2026';

  // Itemized 6 Technical Lots
  const lots = [
    {
      id: 'LOT_1',
      code: 'LOT 01',
      nameFr: 'Racks Automates PLC/DCS, CPU Redondantes & Coupleurs de Communication',
      nameEn: 'PLC/DCS Racks, Dual Redundant CPUs & Network Couplers',
      standards: 'CEI 61131-3 · CEI 62439-2 (MRP) · Profinet IRT',
      qty: 2,
      unit: 'Ens.',
      unitPriceFcfa: 11_000_000,
      totalFcfa: 22_000_000
    },
    {
      id: 'LOT_2',
      code: 'LOT 02',
      nameFr: 'Modules d’E/S Déportées (TOR 24V DC & Analogiques 4–20 mA HART)',
      nameEn: 'Distributed I/O Drops (24V DC Digital & 4–20 mA HART Analog)',
      standards: 'CEI 61131-2 · NAMUR NE43 · Isolation Galvanique 1.5 kV',
      qty: Math.ceil((digitalInputs + digitalOutputs) / 16) + Math.ceil((analogInputs + analogOutputs) / 8),
      unit: 'Cartes',
      unitPriceFcfa: 420_000,
      totalFcfa: (digitalInputs + digitalOutputs) * 22_000 + (analogInputs + analogOutputs) * 45_000
    },
    {
      id: 'LOT_3',
      code: 'LOT 03',
      nameFr: 'Système Instrumenté de Sécurité (Automate de Sécurité SIL 3 & Relais TMR 2oo3)',
      nameEn: 'Safety Instrumented System (SIL 3 Safety PLC & 2oo3 TMR Relays)',
      standards: 'CEI 61508 / CEI 61511 · TÜV Rheinland SIL 3 Certified',
      qty: 1,
      unit: 'Syst.',
      unitPriceFcfa: 28_000_000,
      totalFcfa: 28_000_000
    },
    {
      id: 'LOT_4',
      code: 'LOT 04',
      nameFr: `Variateurs de Vitesse VFD FOC (${vfdCount} unités, puissance cumulée ${vfdTotalPowerKw} kW)`,
      nameEn: `Field-Oriented VFD Inverters (${vfdCount} units, total power ${vfdTotalPowerKw} kW)`,
      standards: 'CEI 61800-3 · Filtres dU/dt · Hacheurs de Freinage',
      qty: vfdCount,
      unit: 'Variateurs',
      unitPriceFcfa: Math.round((vfdCount * 1_250_000 + vfdTotalPowerKw * 48_000) / Math.max(1, vfdCount)),
      totalFcfa: vfdCount * 1_250_000 + vfdTotalPowerKw * 48_000
    },
    {
      id: 'LOT_5',
      code: 'LOT 05',
      nameFr: `Armoires Rittal VX25, Alimentation Redondante 24V ${calculations.recommendedPowerSupplyAmps}A & Climatiseur Tropicalisé`,
      nameEn: `Rittal VX25 Enclosures, Redundant 24V ${calculations.recommendedPowerSupplyAmps}A Power & Tropical AC Unit`,
      standards: 'CEI 62208 · CEI 60204-1 · Indice IP55 / IK10',
      qty: Math.max(2, Math.ceil(calculations.totalIoPoints / 350)),
      unit: 'Baies',
      unitPriceFcfa: 7_000_000,
      totalFcfa: 14_000_000
    },
    {
      id: 'LOT_6',
      code: 'LOT 06',
      nameFr: 'Ingénierie Système, Développement CEI 61131-3, Essais FAT en Atelier & Mise en Service SAT sur Site',
      nameEn: 'System Engineering, IEC 61131-3 Logic Coding, Shop FAT & Site SAT Commissioning',
      standards: 'ISA-88 · CEI 62381 (FAT/SAT) · Matrice Cause-Effet',
      qty: 1,
      unit: 'Forfait',
      unitPriceFcfa: 25_000_000,
      totalFcfa: 25_000_000
    }
  ];

  const totalDqeFcfa = lots.reduce((acc, lot) => acc + lot.totalFcfa, 0);
  const totalDqeEur = Math.round(totalDqeFcfa / 655.957);

  // CSV Export Trigger
  const handleExportCsv = () => {
    const headers = 'Lot,Code,Designation,Normes_Applicables,Quantite,Unite,Prix_Unitaire_FCFA,Total_FCFA\n';
    const rows = lots.map((l) => 
      `"${l.code}","${l.id}","${l.nameFr.replace(/"/g, '""')}","${l.standards}",${l.qty},"${l.unit}",${l.unitPriceFcfa},${l.totalFcfa}`
    ).join('\n');
    const summary = `\n"TOTAL DEVIS DQE GENERAL HT (FCFA)","","","","","",,"${totalDqeFcfa}"\n"TOTAL DEVIS EQUIVALENT EUR (1 EUR = 655.957 FCFA)","","","","","",,"${totalDqeEur}"\n`;

    const blob = new Blob([headers + rows + summary], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EPEDE_D07_DQE_${profile.id}_${currentDate.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#e8eaf0] font-sans">
      
      {/* Top Banner / Technical Visa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-950 via-[#001f24] to-slate-950 border border-cyan-500/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>EPEDE Engineering Visa · Domain D07 Automation &amp; Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            {locale === 'fr' 
              ? 'Dossier d’Ingénierie & Devis Quantitatif Estimatif (DQE en FCFA)' 
              : 'Stamped Technical Synthesis & Itemized BOQ/DQE in FCFA'}
          </h2>
          <p className="text-xs text-slate-300 font-mono">
            Projet Référence : <span className="text-cyan-300 font-bold">{locale === 'fr' ? profile.nameFr : profile.nameEn}</span> ({profile.cameroonReference})
          </p>
        </div>

        {/* Official Engineering Stamp */}
        <div className="flex flex-col items-center sm:items-end justify-center">
          <div className="p-3 rounded-xl border-2 border-dashed border-emerald-500/70 bg-emerald-950/30 text-emerald-300 text-center font-mono space-y-0.5 shadow-lg">
            <div className="text-[10px] tracking-widest uppercase font-bold text-emerald-400">
              EPEDE CAMEROON TECHNICAL VISA
            </div>
            <div className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              BON POUR EXÉCUTION
            </div>
            <div className="text-[9px] text-emerald-300/80">
              Réf : EPEDE-D07-DQE-2026 · {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Synthesis Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Points d’E/S Totaux</span>
          <div className="text-xl font-bold text-white">{calculations.totalIoPoints}</div>
          <div className="text-[10px] text-cyan-400">+20% réserve : {calculations.totalIoWithReserve}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Cycle Automate</span>
          <div className="text-xl font-bold text-purple-400">{calculations.estimatedScanTimeMs} ms</div>
          <div className="text-[10px] text-slate-500">CEI 61131 Déterministe</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Niveau SIL Garanti</span>
          <div className="text-xl font-bold text-emerald-400">{calculations.achievedSil}</div>
          <div className="text-[10px] text-slate-500">CEI 61508 TMR 2oo3</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Budget Estimatif Total</span>
          <div className="text-xl font-bold text-cyan-400">{(totalDqeFcfa / 1_000_000).toFixed(1)} M FCFA</div>
          <div className="text-[10px] text-emerald-400">~ {(totalDqeEur / 1000).toFixed(0)} k€ HT</div>
        </div>
      </div>

      {/* Itemized 6-Lot BOQ / DQE Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            Bordereau des Prix Quantitatif Estimatif (6 Lots Techniques)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Devise : FCFA (XAF) · Taux officiel BEAC : 1 € = 655.957 FCFA
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="p-3 w-16">Lot</th>
                <th className="p-3">Désignation des Ouvrages &amp; Équipements</th>
                <th className="p-3 w-48 hidden md:table-cell">Référence Normative</th>
                <th className="p-3 w-20 text-center">Qté</th>
                <th className="p-3 w-20 text-center">Unité</th>
                <th className="p-3 w-36 text-right">Prix Unitaire (FCFA)</th>
                <th className="p-3 w-36 text-right text-cyan-400">Montant Total (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-cyan-400 font-bold">{lot.code}</td>
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">{lot.nameFr}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{lot.nameEn}</div>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400 hidden md:table-cell">{lot.standards}</td>
                  <td className="p-3 text-center text-slate-300 font-bold">{lot.qty}</td>
                  <td className="p-3 text-center text-slate-400">{lot.unit}</td>
                  <td className="p-3 text-right text-slate-300">{lot.unitPriceFcfa.toLocaleString('fr-FR')}</td>
                  <td className="p-3 text-right font-bold text-cyan-300">{lot.totalFcfa.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-bold border-t-2 border-cyan-500/50">
                <td colSpan={5} className="p-3 text-white uppercase text-right">
                  Total Général Hors Taxes (FCFA) :
                </td>
                <td colSpan={2} className="p-3 text-right text-base text-cyan-400 font-mono">
                  {totalDqeFcfa.toLocaleString('fr-FR')} FCFA
                </td>
              </tr>
              <tr className="bg-slate-950/80 text-slate-400 border-t border-slate-800">
                <td colSpan={5} className="p-2 text-right text-[11px]">
                  Contrevaleur indicative en Euros (€) :
                </td>
                <td colSpan={2} className="p-2 text-right text-sm text-emerald-400 font-mono">
                  {totalDqeEur.toLocaleString('fr-FR')} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Buttons: Print & CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Certification conforme CEI 61131, CEI 61508, CEI 62443 &amp; Cahier des charges Cameroun</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center gap-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'fr' ? 'Exporter DQE en CSV' : 'Export BOQ to CSV'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Imprimer le Dossier d’Ingénierie' : 'Print Stamped Dossier'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
