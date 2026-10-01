// src/components/installations/ProjectEngineeringDossierExporter.tsx
// EPEDE Formal Engineering Dossier & Calculation Note Exporter (Domain D06)
// Provides print-ready calculation notes, schedules, compliance matrix, and JSON export

import React, { useState } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance, 
  calculateCircuitVoltageDrop 
} from './data/installationProjectModel';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Activity,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectEngineeringDossierExporter: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const powerSummary = computeProjectPowerBalance(project);

  // Generate downloadable JSON
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.id}_engineering_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Executive Summary to Clipboard
  const handleCopySummary = () => {
    const summaryText = `
=== EPEDE NOTE DE CALCUL D'INGÉNIERIE ÉLECTRIQUE BT ===
Projet : ${project.name}
Régime de Neutre (SLT) : ${project.supplyContext.earthingSystem}
Alimentation : Transformateur ${project.supplyContext.transformerRatingKva} kVA (Uk=${project.supplyContext.transformerUkPercent}%)
Puissance Installée Totale : ${powerSummary.installedPowerKw} kW (${powerSummary.installedApparentKva} kVA)
Puissance Appelée de Dimensionnement : ${powerSummary.demandActivePowerKw} kW (${powerSummary.demandApparentPowerKva} kVA)
Courant d'Emploi Total Ib : ${powerSummary.totalDesignCurrentIbA} A (cos φ moyen = ${powerSummary.averagePowerFactor})
Taux de Charge Transformateur : ${powerSummary.transformerUtilizationPercent}%
Compensation Réactif Recommandée : ${powerSummary.recommendedCompensationKvar} kVAR
Déséquilibre Maximal des Phases : ${powerSummary.phaseLoads.unbalancePercent}%
TGBT : ${project.tgbt.name} (${project.tgbt.internalForm}, Busbar ${project.tgbt.ratedCurrentBusbarA}A, Icw ${project.tgbt.shortCircuitIcwKa}kA)
Nombre de Tableaux Divisionnaires : ${project.distributionBoards.length}
Nombre de Circuits Terminaux : ${project.finalCircuits.length}
Normes de Référence : IEC 60364 / NF C 15-100 / IEC 61439-2 / IEC 60909
Avertissement : Document d'ingénierie préliminaire non certifié - Revue d'ingénierie qualifiée requise.
`.trim();

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Action Controls Bar (Print, JSON Download, Copy Text)           */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg print:hidden">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            {isFr ? 'Dossier Technique & Note de Calcul Formelle' : 'Formal Engineering Dossier & Calculation Note'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSuccess ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier Résumé' : 'Copy Summary')}
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
          >
            <Download className="w-4 h-4" />
            {isFr ? 'Exporter Projet (JSON)' : 'Export Project (JSON)'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
          >
            <Printer className="w-4 h-4" />
            {isFr ? 'Imprimer / Dossier PDF' : 'Print / Export PDF'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Formal Printable Document Sheet                                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Document Title Header */}
        <div className="border-b border-slate-800 pb-5 print:border-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 print:border-black print:text-black">
                {isFr ? 'DOSSIER D\'INGÉNIERIE ÉLECTRIQUE BT' : 'LV ELECTRICAL ENGINEERING DOSSIER'}
              </span>
              <h1 className="text-2xl font-black text-white mt-1.5 print:text-black">{project.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5 print:text-slate-600">
                {isFr ? project.description_fr : project.description_en}
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 print:text-slate-700">
              <div>Réf : <strong className="text-white print:text-black">{project.id}</strong></div>
              <div>Date : <strong className="text-white print:text-black">{new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}</strong></div>
              <div>Normes : <strong className="text-cyan-400 print:text-black">IEC 60364 / NF C 15-100</strong></div>
            </div>
          </div>
        </div>

        {/* Regulatory Status Box */}
        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 text-xs space-y-1 print:border-black print:bg-slate-50">
          <div className="flex items-center gap-2 font-mono font-bold text-amber-400 print:text-black">
            <AlertOctagon className="w-4 h-4" />
            <span>STATUS: CONCEPTUAL ENGINEERING WORKBENCH RESULT</span>
          </div>
          <p className="text-slate-300 print:text-black text-[11px] leading-relaxed">
            {isFr
              ? 'Ce document technique est issu d\'un pré-dimensionnement automatisé. Il ne se substitue pas à une étude d\'exécution validée par un bureau d\'études qualifié ni à un visa officiel de conformité (Consuel).'
              : 'This technical document is an automated conceptual sizing output. It does not replace certified construction engineering or statutory safety validation.'}
          </p>
        </div>

        {/* Section A: Power Balance Summary */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-black uppercase font-mono tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 print:text-black" />
            {isFr ? 'A. Synthèse du Bilan de Puissance & Paramètres Source' : 'A. Power Balance Summary & Source Parameters'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">{isFr ? 'Puissance Installée :' : 'Installed Power:'}</span>
              <span className="text-base font-bold text-white print:text-black">{powerSummary.installedPowerKw} kW</span>
              <span className="text-[10px] text-slate-500 block">S = {powerSummary.installedApparentKva} kVA</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">{isFr ? 'Puissance Demandée :' : 'Design Demand:'}</span>
              <span className="text-base font-bold text-emerald-400 print:text-black">{powerSummary.demandActivePowerKw} kW</span>
              <span className="text-[10px] text-slate-500 block">S = {powerSummary.demandApparentPowerKva} kVA</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">{isFr ? 'Courant d\'Emploi (Ib) :' : 'Design Current (Ib):'}</span>
              <span className="text-base font-bold text-amber-400 print:text-black">{powerSummary.totalDesignCurrentIbA} A</span>
              <span className="text-[10px] text-slate-500 block">cos φ = {powerSummary.averagePowerFactor}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">{isFr ? 'Charge Transformateur :' : 'Transformer Loading:'}</span>
              <span className="text-base font-bold text-cyan-400 print:text-black">{powerSummary.transformerUtilizationPercent}%</span>
              <span className="text-[10px] text-slate-500 block">{project.supplyContext.transformerRatingKva} kVA (Uk={project.supplyContext.transformerUkPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Section B: Phase Balance Verification */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-black uppercase font-mono tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400 print:text-black" />
            {isFr ? 'B. Répartition des Phases & Déséquilibre' : 'B. Phase Balancing & Current Distribution'}
          </h3>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">Phase 1 (L1)</span>
              <div className="text-sm font-bold text-white print:text-black">{powerSummary.phaseLoads.L1_Kw} kW</div>
              <div className="text-xs text-amber-400 print:text-black font-bold">{powerSummary.phaseLoads.L1_CurrentA} A</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">Phase 2 (L2)</span>
              <div className="text-sm font-bold text-white print:text-black">{powerSummary.phaseLoads.L2_Kw} kW</div>
              <div className="text-xs text-emerald-400 print:text-black font-bold">{powerSummary.phaseLoads.L2_CurrentA} A</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:border-black print:bg-white">
              <span className="text-slate-400 print:text-slate-600 block">Phase 3 (L3)</span>
              <div className="text-sm font-bold text-white print:text-black">{powerSummary.phaseLoads.L3_Kw} kW</div>
              <div className="text-xs text-indigo-400 print:text-black font-bold">{powerSummary.phaseLoads.L3_CurrentA} A</div>
            </div>
          </div>

          <div className="mt-2 text-xs font-mono flex items-center justify-between bg-slate-950 p-2.5 rounded border border-slate-800 print:border-black print:bg-white">
            <span className="text-slate-400 print:text-slate-700">{isFr ? 'Déséquilibre global calculé :' : 'Computed global unbalance:'}</span>
            <span className={`font-bold ${powerSummary.phaseLoads.unbalancePercent <= 10 ? 'text-emerald-400 print:text-black' : 'text-rose-400 print:text-black'}`}>
              {powerSummary.phaseLoads.unbalancePercent}% {powerSummary.phaseLoads.unbalancePercent <= 10 ? '(Conforme ≤ 10%)' : '(Déséquilibré > 10%)'}
            </span>
          </div>
        </div>

        {/* Section C: Complete Circuit Schedule with Voltage Drop */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-black uppercase font-mono tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 print:text-black" />
            {isFr ? 'C. Bordereau Récapitulatif des Circuits & Chutes de Tension' : 'C. Complete Circuit Schedule & Voltage Drop Verification'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="bg-slate-950 text-slate-400 print:text-black uppercase font-mono text-[10px] border-b border-slate-800 print:border-black">
                <tr>
                  <th className="py-2 px-2.5">{isFr ? 'Repère' : 'Code'}</th>
                  <th className="py-2 px-2.5">{isFr ? 'Tableau' : 'Board'}</th>
                  <th className="py-2 px-2.5">{isFr ? 'Désignation' : 'Description'}</th>
                  <th className="py-2 px-2.5 text-center">{isFr ? 'Phase' : 'Phase'}</th>
                  <th className="py-2 px-2.5 text-right">{isFr ? 'Ib (A)' : 'Ib (A)'}</th>
                  <th className="py-2 px-2.5 text-center">{isFr ? 'Protection' : 'Protection'}</th>
                  <th className="py-2 px-2.5 text-center">{isFr ? 'Section Cu' : 'Section'}</th>
                  <th className="py-2 px-2.5 text-center">{isFr ? 'Longueur' : 'Length'}</th>
                  <th className="py-2 px-2.5 text-right">{isFr ? 'Chute ΔU' : 'ΔU'}</th>
                  <th className="py-2 px-2.5 text-center">{isFr ? 'Conformité' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black font-mono">
                {project.finalCircuits.map((c) => {
                  const vDrop = calculateCircuitVoltageDrop(
                    c.conductor.lengthMeters,
                    c.conductor.crossSectionMm2,
                    c.designCurrentIbA,
                    c.phase === 'THREE_PHASE',
                    0.85
                  );

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                      <td className="py-1.5 px-2.5 font-bold text-cyan-400 print:text-black">{c.circuitCode}</td>
                      <td className="py-1.5 px-2.5 text-slate-400 print:text-slate-700">{c.boardId}</td>
                      <td className="py-1.5 px-2.5 text-white print:text-black font-sans">{c.name}</td>
                      <td className="py-1.5 px-2.5 text-center text-slate-400 print:text-black">{c.phase}</td>
                      <td className="py-1.5 px-2.5 text-right font-bold text-white print:text-black">{c.designCurrentIbA} A</td>
                      <td className="py-1.5 px-2.5 text-center text-amber-300 print:text-black">
                        {c.protectiveDevice.curve} {c.protectiveDevice.ratedCurrentInA}A {c.protectiveDevice.rcdSensitivityMa ? `(30mA)` : ''}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-slate-300 print:text-black">{c.conductor.crossSectionMm2} mm²</td>
                      <td className="py-1.5 px-2.5 text-center text-slate-300 print:text-black">{c.conductor.lengthMeters} m</td>
                      <td className="py-1.5 px-2.5 text-right font-bold text-white print:text-black">{vDrop.deltaPercent}%</td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vDrop.isWithinLimits 
                            ? 'bg-emerald-500/20 text-emerald-400 print:text-black' 
                            : 'bg-rose-500/20 text-rose-400 print:text-black'
                        }`}>
                          {vDrop.isWithinLimits ? 'OK (≤5%)' : 'DÉPASSÉ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature & Engineering Review Block */}
        <div className="border-t border-slate-800 pt-5 print:border-black grid grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 uppercase font-bold block">{isFr ? 'Concepteur / Ingénieur Études :' : 'Design Engineer:'}</span>
            <div className="h-12 border border-dashed border-slate-700 rounded p-2 text-slate-500 print:border-black">
              {isFr ? 'Visa & Signature' : 'Visa & Signature'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 uppercase font-bold block">{isFr ? 'Bureau de Contrôle / Validation :' : 'Statutory Review / Inspection:'}</span>
            <div className="h-12 border border-dashed border-slate-700 rounded p-2 text-slate-500 print:border-black">
              {isFr ? 'Tampon & Approbation' : 'Stamp & Approval'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
