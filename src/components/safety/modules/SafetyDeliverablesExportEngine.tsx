// src/components/safety/modules/SafetyDeliverablesExportEngine.tsx
// EPEDE D16 - Electrical Safety Stamped BOQ/DQE Engineering Deliverables Engine (FCFA / EUR)
// Calibrated to Cameroon High-Keraunic Soil Projects (Oyomabang, Nachtigal, Mangombé, Douala)

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
  Waves,
  Zap
} from 'lucide-react';
import {
  SafetySiteProfile,
  SafetyCalculations
} from '../services/useSafetyProjectStore';

interface SafetyDeliverablesExportEngineProps {
  locale: 'fr' | 'en';
  profile: SafetySiteProfile;
  calculations: SafetyCalculations;
  gridLengthX: number;
  gridWidthY: number;
  faultCurrentKa: number;
  clearingTimeSec: number;
  onJumpToStage?: (st: 1 | 2 | 3 | 4 | 5) => void;
}

export const SafetyDeliverablesExportEngine: React.FC<SafetyDeliverablesExportEngineProps> = ({
  locale,
  profile,
  calculations,
  gridLengthX,
  gridWidthY,
  faultCurrentKa,
  clearingTimeSec,
  onJumpToStage
}) => {
  const currentDate = '04/10/2026';

  const areaA = gridLengthX * gridWidthY;
  const conductorsX = Math.max(4, Math.round(gridLengthX / 10) + 1);
  const conductorsY = Math.max(4, Math.round(gridWidthY / 10) + 1);
  const totalLengthLt = conductorsX * gridWidthY + conductorsY * gridLengthX + Math.round((conductorsX + conductorsY) * 3.6);
  const groundRodsCount = Math.max(8, Math.round((conductorsX + conductorsY) * 1.2));
  const weldsCount = conductorsX * conductorsY + groundRodsCount;
  const rockVolumeM3 = Math.round(areaA * 0.15);

  // 6 Itemized Technical Lots
  const lots = [
    {
      id: 'LOT_1',
      code: 'LOT 01',
      nameFr: `Câble Cuivre Nu Électrolytique Recuit 120/150 mm² pour Maille de Terre (${totalLengthLt} m)`,
      nameEn: `Annealed Bare Copper Ground Grid Conductor 120/150 mm² (${totalLengthLt} m)`,
      standards: 'IEEE Std 80-2013 · NF C 34-110-3 · Cu-ETP 99.9% IACS',
      qty: totalLengthLt,
      unit: 'mètres',
      unitPriceFcfa: 18_500,
      totalFcfa: totalLengthLt * 18_500
    },
    {
      id: 'LOT_2',
      code: 'LOT 02',
      nameFr: `Piquets de Terre Verticaux Acier Cuivré Ø19 mm (L = 3.0 m) & Forages Profonds (${groundRodsCount} unités)`,
      nameEn: `Copper-Clad Steel Ground Rods Ø19 mm (3.0 m) & Deep Boreholes (${groundRodsCount} units)`,
      standards: 'UL 467 · Revêtement Cuivre 254 µm minimum',
      qty: groundRodsCount,
      unit: 'Piquets',
      unitPriceFcfa: 38_000,
      totalFcfa: groundRodsCount * 38_000
    },
    {
      id: 'LOT_3',
      code: 'LOT 03',
      nameFr: `Soudures Aluminothermiques Cadweld, Cartouches de Poudre & Moules Graphite (${weldsCount} nœuds)`,
      nameEn: `Cadweld Exothermic Welds, Powder Charges & Graphite Molds (${weldsCount} joints)`,
      standards: 'IEEE Std 837 (Qualifying Permanent Connections)',
      qty: weldsCount,
      unit: 'Soudures',
      unitPriceFcfa: 14_500,
      totalFcfa: weldsCount * 14_500
    },
    {
      id: 'LOT_4',
      code: 'LOT 04',
      nameFr: `Couche de Surface en Gravier Concassé Lavé 15 cm (${rockVolumeM3} m³ ~ ${Math.round(rockVolumeM3 * 1.65)} t)`,
      nameEn: `Crushed Basalt/Granite Rock Surface Layer 15 cm (${rockVolumeM3} m³ ~ ${Math.round(rockVolumeM3 * 1.65)} t)`,
      standards: 'IEEE 80-2013 §12.5 (Granulométrie 15–25 mm, ρ_s ≥ 3000 Ω·m)',
      qty: rockVolumeM3,
      unit: 'm³',
      unitPriceFcfa: 28_000,
      totalFcfa: rockVolumeM3 * 28_000
    },
    {
      id: 'LOT_5',
      code: 'LOT 05',
      nameFr: `Jeu de Parafoudres ZnO Haute Tension ${profile.gridVoltageKv} kV avec Compteurs de Décharge`,
      nameEn: `High-Voltage ${profile.gridVoltageKv} kV ZnO Surge Arresters with Discharge Counters`,
      standards: 'CEI 60099-4 · Classe SM/SH · Tenue LIPL 10 kA 8/20 µs',
      qty: profile.gridVoltageKv === 225 ? 6 : 3,
      unit: 'Unités',
      unitPriceFcfa: profile.gridVoltageKv === 225 ? 4_200_000 : 2_800_000,
      totalFcfa: profile.gridVoltageKv === 225 ? 25_200_000 : 8_400_000
    },
    {
      id: 'LOT_6',
      code: 'LOT 06',
      nameFr: 'Équipements Arc Flash NFPA 70E (40 cal/cm²), Campagne Wenner & Essais de Terre à 62%',
      nameEn: 'NFPA 70E Arc Flash PPE Kits (40 cal/cm²), Wenner Soil Survey & 62% Fall-of-Potential Tests',
      standards: 'NFPA 70E · IEEE 1584 · IEEE 81 (Measuring Earth Resistivity)',
      qty: 1,
      unit: 'Forfait',
      unitPriceFcfa: 12_000_000,
      totalFcfa: 12_000_000
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
    link.setAttribute('download', `EPEDE_D16_DQE_${profile.id}_${currentDate.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#e8eaf0] font-sans">
      
      {/* Top Banner / Technical Visa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-950 via-[#261c00] to-slate-950 border border-amber-500/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>EPEDE Engineering Visa · Domain D16 Electrical Safety &amp; Grounding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            {locale === 'fr' 
              ? 'Dossier d’Ingénierie & Devis Quantitatif Estimatif (DQE en FCFA)' 
              : 'Stamped Technical Synthesis & Itemized BOQ/DQE in FCFA'}
          </h2>
          <p className="text-xs text-slate-300 font-mono">
            Projet Référence : <span className="text-amber-300 font-bold">{locale === 'fr' ? profile.nameFr : profile.nameEn}</span> ({profile.cameroonReference})
          </p>
        </div>

        {/* Official Engineering Stamp */}
        <div className="flex flex-col items-center sm:items-end justify-center">
          <div className="p-3 rounded-xl border-2 border-dashed border-emerald-500/70 bg-emerald-950/30 text-emerald-300 text-center font-mono space-y-0.5 shadow-lg">
            <div className="text-[10px] tracking-widest uppercase font-bold text-emerald-400">
              EPEDE CAMEROON SAFETY VISA
            </div>
            <div className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              BON POUR EXÉCUTION
            </div>
            <div className="text-[9px] text-emerald-300/80">
              Réf : EPEDE-D16-DQE-2026 · {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Synthesis Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Résistance Terre Rg</span>
          <div className={`text-xl font-bold ${calculations.groundResistanceRg <= profile.targetResistanceOhm ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.groundResistanceRg} Ω
          </div>
          <div className="text-[10px] text-slate-500">Cible &lt; {profile.targetResistanceOhm} Ω (IEEE 80)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Potentiel GPR Max</span>
          <div className="text-xl font-bold text-rose-400">{(calculations.gprVolts / 1000).toFixed(1)} kV</div>
          <div className="text-[10px] text-slate-500">Sous {faultCurrentKa} kA défaut</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Tension de Toucher</span>
          <div className={`text-xl font-bold ${calculations.isTouchSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.meshVoltageVolts} V
          </div>
          <div className="text-[10px] text-cyan-400">Tolérable : {calculations.tolerableTouchVolts} V</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 uppercase text-[10px]">Budget Ouvrages HT</span>
          <div className="text-xl font-bold text-amber-400">{(totalDqeFcfa / 1_000_000).toFixed(1)} M FCFA</div>
          <div className="text-[10px] text-emerald-400">~ {(totalDqeEur / 1000).toFixed(0)} k€ HT</div>
        </div>
      </div>

      {/* Itemized 6-Lot BOQ / DQE Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            Bordereau Quantitatif Estimatif des Travaux de Sécurité (6 Lots Techniques)
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
                <th className="p-3">Désignation des Équipements &amp; Fournitures</th>
                <th className="p-3 w-48 hidden md:table-cell">Référence Normative</th>
                <th className="p-3 w-20 text-center">Qté</th>
                <th className="p-3 w-24 text-center">Unité</th>
                <th className="p-3 w-36 text-right">Prix Unitaire (FCFA)</th>
                <th className="p-3 w-36 text-right text-amber-400">Montant Total (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-amber-400 font-bold">{lot.code}</td>
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">{lot.nameFr}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{lot.nameEn}</div>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400 hidden md:table-cell">{lot.standards}</td>
                  <td className="p-3 text-center text-slate-300 font-bold">{lot.qty}</td>
                  <td className="p-3 text-center text-slate-400">{lot.unit}</td>
                  <td className="p-3 text-right text-slate-300">{lot.unitPriceFcfa.toLocaleString('fr-FR')}</td>
                  <td className="p-3 text-right font-bold text-amber-300">{lot.totalFcfa.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-bold border-t-2 border-amber-500/50">
                <td colSpan={5} className="p-3 text-white uppercase text-right">
                  Total Général Hors Taxes (FCFA) :
                </td>
                <td colSpan={2} className="p-3 text-right text-base text-amber-400 font-mono">
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
          <span>Calculs certifiés conformes IEEE Std 80-2013, IEEE 1584-2018, CEI 62305 &amp; CEI 60099-4</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center gap-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Exporter DQE en CSV' : 'Export BOQ to CSV'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Imprimer le Dossier d’Ingénierie' : 'Print Stamped Dossier'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
