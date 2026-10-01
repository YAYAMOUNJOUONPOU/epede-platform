// src/components/common/EngineeringDossierModal.tsx
// EPEDE Wave 2: Printable & Exportable Engineering Dossier Synthesizer
// Generates official-grade calculation sheets, relay settings schedules, and earthing audits with full compliance signoff.

import React, { useState } from 'react';
import {
  EngineeringDossier,
  EngineeringDossierGenerator,
} from '../../data/engineeringDossierGenerator';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  X,
  ShieldCheck,
  Zap,
  Bookmark,
  Award,
  Sliders,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface EngineeringDossierModalProps {
  nodeId: string;
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export const EngineeringDossierModal: React.FC<EngineeringDossierModalProps> = ({
  nodeId,
  locale,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dossier: EngineeringDossier = EngineeringDossierGenerator.generateDossier(nodeId, locale);

  const handleCopyText = () => {
    const textData = `
================================================================================
EPEDE ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT
DOSSIER D'ÉTUDE ÉLECTROTECHNIQUE & NOTE DE CALCUL OFFICIELLE
================================================================================
RÉFÉRENCE DOCUMENTAIRE : ${dossier.documentReference}
RÉVISION               : ${dossier.revision}
DATE D'ÉMISSION        : ${dossier.date}
OUVRAGE CIBLE          : ${dossier.equipmentTag} - ${dossier.equipmentName[locale]}
STATUT QUALITÉ         : ${dossier.complianceSignoff.status}

1. CALCULS DE COURT-CIRCUIT SELON CEI 60909
- Tension Nominale Un : ${dossier.faultAnalysis.voltageLevelKv} kV (Facteur c = ${dossier.faultAnalysis.cFactor})
- Courant initial triphasé (Ik") : ${dossier.faultAnalysis.ik3PhaseKa} kA (Sk" = ${dossier.faultAnalysis.skMva} MVA)
- Courant de choc dynamique (ip) : ${dossier.faultAnalysis.ipPeakKa} kA (Facteur kappa = ${dossier.faultAnalysis.kappaFactor})
- Courant de coupure symétrique (Ib) : ${dossier.faultAnalysis.ibBreakingKa} kA
- Courant biphasé (Ik2") : ${dossier.faultAnalysis.ik2PhaseKa} kA
- Défaut monophasé à la terre (Ik1") : ${(dossier.faultAnalysis.ik1EarthKa * 1000).toFixed(1)} A
- Régime de neutre (SLT) : ${dossier.earthingSummary.regime}
- Surtension phases saines : ${dossier.faultAnalysis.healthyPhaseOvervoltageFactor} x Un

2. CARNET DE RÉGLAGE DES PROTECTIONS (IEC 60255)
${dossier.relaySchedule.map((r) => `  * Relais ${r.relayTag} [${r.ansiCode}]: Type=${r.settingType} | Seuil=${r.thresholdValue} | Temporisation=${r.timeDelay}`).join('\n')}

${dossier.auditCalibration ? `2.BIS RECOMMANDATIONS & CALAGE DE L'ÉQUIPE D'AUDIT
- Réf. Tampon Visa : ${dossier.auditCalibration.auditorSignoff.stampReference} (${dossier.auditCalibration.auditorSignoff.approvalDate})
- Auditeur          : ${dossier.auditCalibration.auditorSignoff.leadAuditor} [${dossier.auditCalibration.auditorSignoff.organization}]
- Norme Référence  : ${dossier.auditCalibration.governingStandard}
- Statut Audit     : ${dossier.auditCalibration.complianceStatus}
- Paramètres Calés :
${dossier.auditCalibration.calibratedParameters.map(p => `  • ${p.name[locale]}: ${p.value} ${p.unit} (Nominal: ${p.nominalOrPreAudit}) [${p.standard}]`).join('\n')}
- Verdict Audit    : ${dossier.auditCalibration.commissioningVerdict[locale]}
` : ''}
3. SERVICES AUXILIAIRES & SÉCURITÉ DC
- Tension DC de commande : ${dossier.auxiliaryPowerCheck.dcVoltage}
- Autonomie batterie : ${dossier.auxiliaryPowerCheck.batteryAutonomy}
- Redondance chargeurs : ${dossier.auxiliaryPowerCheck.chargerRedundancy}

NORMES APPLIQUÉES :
${dossier.complianceSignoff.standardsApplied.map((s) => `  - ${s}`).join('\n')}

APPROBATION & VISA :
Établi par : ${dossier.complianceSignoff.preparedBy}
Vérifié par : ${dossier.complianceSignoff.checkedBy}
    `;

    navigator.clipboard.writeText(textData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-bold text-white font-mono">
                {dossier.documentReference}
              </h2>
              <p className="text-[11px] text-slate-400">
                {dossier.projectTitle[locale]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              title="Copy dossier text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Imprimer' : 'Print'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-6 space-y-6 text-slate-200 text-xs overflow-y-auto max-h-[75vh]">
          {/* Document Header Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Référence' : 'Reference'}</span>
              <span className="font-bold text-slate-200">{dossier.documentReference}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Édition / Date' : 'Issue / Date'}</span>
              <span className="font-bold text-slate-200">{dossier.revision} • {dossier.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Repère KKS / Tag' : 'KKS / Tag'}</span>
              <span className="font-bold text-amber-400">{dossier.equipmentTag}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Statut Validation' : 'Approval Status'}</span>
              <span className="font-bold text-emerald-400">{dossier.complianceSignoff.status}</span>
            </div>
          </div>

          {/* Section 1: Note de Calcul Court-Circuit IEC 60909 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-sm font-bold text-white">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>1. {locale === 'fr' ? 'NOTE DE CALCUL DE COURT-CIRCUIT (CEI 60909)' : 'SHORT-CIRCUIT CALCULATION NOTE (IEC 60909)'}</span>
            </div>

            <table className="w-full text-left border-collapse border border-slate-800 rounded-lg overflow-hidden text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Grandeur Électrotechnique' : 'Electrical Parameter'}</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Symbole' : 'Symbol'}</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Valeur Calculée' : 'Calculated Value'}</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Norme / Formule de Référence' : 'Standard Formula'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr>
                  <td className="p-2.5 text-slate-300">Courant de court-circuit triphasé initial</td>
                  <td className="p-2.5 font-bold text-blue-400">Ik"</td>
                  <td className="p-2.5 font-bold text-red-400">{dossier.faultAnalysis.ik3PhaseKa} kA</td>
                  <td className="p-2.5 text-slate-400 text-[11px]">Ik" = (c · Un) / (√3 · Z(1))</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">Puissance apparente de court-circuit</td>
                  <td className="p-2.5 font-bold text-blue-400">Sk"</td>
                  <td className="p-2.5 text-slate-200">{dossier.faultAnalysis.skMva} MVA</td>
                  <td className="p-2.5 text-slate-400 text-[11px]">Sk" = √3 · Un · Ik"</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">Courant de crête dynamique maximal</td>
                  <td className="p-2.5 font-bold text-blue-400">ip</td>
                  <td className="p-2.5 font-bold text-amber-400">{dossier.faultAnalysis.ipPeakKa} kA</td>
                  <td className="p-2.5 text-slate-400 text-[11px]">ip = κ · √2 · Ik" (κ = {dossier.faultAnalysis.kappaFactor})</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">Courant de coupure symétrique</td>
                  <td className="p-2.5 font-bold text-blue-400">Ib</td>
                  <td className="p-2.5 text-purple-400">{dossier.faultAnalysis.ibBreakingKa} kA</td>
                  <td className="p-2.5 text-slate-400 text-[11px]">Ib = μ · Ik" (t_break = 50 ms)</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">Courant de court-circuit biphasé franc</td>
                  <td className="p-2.5 font-bold text-blue-400">Ik2"</td>
                  <td className="p-2.5 text-slate-200">{dossier.faultAnalysis.ik2PhaseKa} kA</td>
                  <td className="p-2.5 text-slate-400 text-[11px]">Ik2" = (√3 / 2) · Ik"</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-300">Défaut d'isolement monophasé à la terre</td>
                  <td className="p-2.5 font-bold text-blue-400">Ik1"</td>
                  <td className="p-2.5 font-bold text-emerald-400">
                    {(dossier.faultAnalysis.ik1EarthKa * 1000).toFixed(1)} A
                  </td>
                  <td className="p-2.5 text-slate-400 text-[11px]">Ik1" = (√3 · c · Un) / |2Z(1) + Z(0) + 3ZN|</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Carnet de Réglage des Protections */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-sm font-bold text-white">
              <Bookmark className="w-4 h-4 text-blue-400" />
              <span>2. {locale === 'fr' ? 'CARNET DE RÉGLAGE DES PROTECTIONS ÉLECTRIQUES' : 'PROTECTION RELAY SETTINGS SCHEDULE'}</span>
            </div>

            <table className="w-full text-left border-collapse border border-slate-800 rounded-lg overflow-hidden text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Repère Relais' : 'Relay Tag'}</th>
                  <th className="p-2.5 border border-slate-800">Code ANSI</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Fonction / Caractéristique' : 'Function / Curve'}</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Seuil d\'Affichage' : 'Pickup Threshold'}</th>
                  <th className="p-2.5 border border-slate-800">{locale === 'fr' ? 'Temporisation' : 'Time Delay'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {dossier.relaySchedule.map((r, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-slate-200">{r.relayTag}</td>
                    <td className="p-2.5 text-red-400 font-bold">{r.ansiCode}</td>
                    <td className="p-2.5 text-slate-300">{r.settingType}</td>
                    <td className="p-2.5 text-emerald-400 font-bold">{r.thresholdValue}</td>
                    <td className="p-2.5 text-amber-400">{r.timeDelay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2.BIS: Calage & Recommandations de l'Équipe d'Audit */}
          {dossier.auditCalibration && (
            <div className="space-y-3 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>
                    2.BIS {locale === 'fr' ? 'CALAGE AUDIT HOMOLOGUÉ & PARAMÈTRES RÉGLÉS SUR SITE' : 'CERTIFIED AUDIT TUNING & SITE CALIBRATED PARAMETERS'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 font-bold">
                    {dossier.auditCalibration.auditorSignoff.stampReference}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dossier.auditCalibration.auditorSignoff.approvalDate}
                  </span>
                </div>
              </div>

              {/* Commissioning & Normative Verdict */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-300 font-bold">
                    {dossier.auditCalibration.governingStandard}
                  </span>
                  <span className="text-slate-400">
                    {dossier.auditCalibration.auditorSignoff.leadAuditor} ({dossier.auditCalibration.auditorSignoff.organization})
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {dossier.auditCalibration.commissioningVerdict[locale]}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
                  <Lock className="w-3 h-3" />
                  <span>Empreinte cryptographique : {dossier.auditCalibration.auditorSignoff.signatureHash}</span>
                </div>
              </div>

              {/* Table of Calibrated Audit Parameters */}
              <table className="w-full text-left border-collapse border border-slate-800 rounded-lg overflow-hidden text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="p-2 border border-slate-800">{locale === 'fr' ? 'Paramètre / Organe' : 'Parameter / Target'}</th>
                    <th className="p-2 border border-slate-800">{locale === 'fr' ? 'Valeur Calée (Audit)' : 'Tuned Value (Audit)'}</th>
                    <th className="p-2 border border-slate-800">{locale === 'fr' ? 'Tolérance' : 'Tolerance'}</th>
                    <th className="p-2 border border-slate-800">{locale === 'fr' ? 'Valeur Initiale' : 'Pre-Audit Value'}</th>
                    <th className="p-2 border border-slate-800">{locale === 'fr' ? 'Référence Normative' : 'Normative Ref'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {dossier.auditCalibration.calibratedParameters.map((p) => (
                    <tr key={p.key} className="hover:bg-slate-900/40">
                      <td className="p-2 text-slate-200">
                        <div className="font-bold">{p.name[locale]}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{p.description[locale]}</div>
                      </td>
                      <td className="p-2 font-bold text-emerald-400">{p.value}</td>
                      <td className="p-2 text-slate-300">{p.tolerance}</td>
                      <td className="p-2 text-amber-300">{p.nominalOrPreAudit}</td>
                      <td className="p-2 text-purple-300 text-[10px]">{p.standard} - {p.clause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Audit Recommendations */}
              {dossier.auditCalibration.recommendations.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-bold text-amber-300 block">
                    {locale === 'fr' ? 'Prescriptions d’exploitation :' : 'Operating Recommendations:'}
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {dossier.auditCalibration.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec[locale]}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Diagnostic de Régime de Neutre et Auxiliaires DC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {locale === 'fr' ? 'Synthèse Régime de Neutre & Terres' : 'Earthing & Grounding Audit'}
              </h4>
              <p className="text-[11px] text-slate-300">
                <strong>Régime :</strong> {dossier.earthingSummary.regime}
              </p>
              <p className="text-[11px] text-slate-300">
                <strong>Courant de fuite terre limité à :</strong> {dossier.earthingSummary.faultCurrentContribution}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {dossier.earthingSummary.recommendation[locale]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                {locale === 'fr' ? 'Contrôle Sécurité DC & Auxiliaires' : 'Auxiliary DC Power Security'}
              </h4>
              <p className="text-[11px] text-slate-300">
                <strong>Tension DC commande :</strong> {dossier.auxiliaryPowerCheck.dcVoltage}
              </p>
              <p className="text-[11px] text-slate-300">
                <strong>Autonomie secours batterie :</strong> {dossier.auxiliaryPowerCheck.batteryAutonomy}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {dossier.auxiliaryPowerCheck.trippingSecurityStatus}
              </p>
            </div>
          </div>

          {/* Standards Applied & Official Signoff Footer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-mono text-[10px] text-slate-500 uppercase block">
              {locale === 'fr' ? 'Normes de Référence Électrotechniques Appliquées' : 'Governing Standards Applied'}
            </span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {dossier.complianceSignoff.standardsApplied.map((std, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                  {std}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block uppercase">Établi Par / Prepared By</span>
                <span className="text-slate-300 font-bold">{dossier.complianceSignoff.preparedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">Contrôlé Par / Checked By</span>
                <span className="text-emerald-400 font-bold">{dossier.complianceSignoff.checkedBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
