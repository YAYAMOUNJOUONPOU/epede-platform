// src/components/common/SldNodeAuditInspectorModal.tsx
// EPEDE - Interactive SLD Node Inspector Modal with Field Audit Findings & Certified Settings
// Displays calibrated parameters (PSS2B Ks1/T1/T2, 87G/40 generator thresholds, NGR/REF settings),
// normative compliance verification, and official stamp reference for any clicked SLD node.

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Sliders,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { auditSettingsStore, NodeAuditCalibration, CalibratedAuditParameter } from '../../data/auditSettingsStore';

interface SldNodeAuditInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  locale: 'fr' | 'en';
  onOpenFullDossier?: (nodeId: string) => void;
}

export const SldNodeAuditInspectorModal: React.FC<SldNodeAuditInspectorModalProps> = ({
  isOpen,
  onClose,
  nodeId,
  locale,
  onOpenFullDossier,
}) => {
  const [calibration, setCalibration] = useState<NodeAuditCalibration | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeParamTab, setActiveParamTab] = useState<string>('all');

  useEffect(() => {
    const update = () => {
      setCalibration(auditSettingsStore.getAuditCalibration(nodeId));
    };
    update();
    const unsub = auditSettingsStore.subscribe(update);
    return unsub;
  }, [nodeId]);

  if (!isOpen || !calibration) return null;

  const handleCopySummary = () => {
    const lines = [
      `=== EPEDE AUDIT CALIBRATION VISA [${calibration.equipmentTag}] ===`,
      `Document Reference : ${calibration.auditorSignoff.stampReference}`,
      `Equipment          : ${calibration.equipmentName[locale]}`,
      `Governing Standard : ${calibration.governingStandard}`,
      `Audit Finding      : ${calibration.auditFindingId}`,
      `Status             : ${calibration.complianceStatus}`,
      `Auditor            : ${calibration.auditorSignoff.leadAuditor}`,
      `Signoff Date       : ${calibration.auditorSignoff.approvalDate}`,
      `Signature Hash     : ${calibration.auditorSignoff.signatureHash}`,
      `--- Calibrated Parameters ---`,
      ...calibration.calibratedParameters.map(
        p => `• ${p.name[locale]}: ${p.value} ${p.unit} (Nominal: ${p.nominalOrPreAudit}) [${p.standard}]`
      ),
      `--- Verdict ---`,
      calibration.commissioningVerdict[locale],
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-bold">
                  {calibration.equipmentTag}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {calibration.auditFindingId}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80">
                  {locale === 'fr' ? 'CALAGE AUDIT HOMOLOGUÉ' : 'CERTIFIED AUDIT TUNING'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1">
                {calibration.equipmentName[locale]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              title={locale === 'fr' ? 'Copier le visa d’audit' : 'Copy audit signoff'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
            </button>

            {onOpenFullDossier && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullDossier(nodeId);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Dossier Complet' : 'Full Dossier'}</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-200">
          {/* Audit Stamp & Official Visa Badge */}
          <div className="p-4 rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-emerald-950/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">
                    {locale === 'fr' ? 'Visa de Conformité & Tampon d’Audit' : 'Compliance Stamp & Audit Visa'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {calibration.auditorSignoff.stampReference}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {locale === 'fr' ? 'Date de Validation' : 'Validation Date'}
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {calibration.auditorSignoff.approvalDate}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Auditeur Principal' : 'Lead Auditor'}</span>
                <span className="font-semibold text-slate-200">{calibration.auditorSignoff.leadAuditor}</span>
                <span className="text-[10px] text-slate-400 block">{calibration.auditorSignoff.organization}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">{locale === 'fr' ? 'Empreinte Cryptographique' : 'Cryptographic Hash'}</span>
                <span className="text-slate-400 truncate block font-mono text-[10px]">{calibration.auditorSignoff.signatureHash}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3" />
                  {locale === 'fr' ? 'Intégrité du plan de réglage verrouillée' : 'Settings schedule integrity locked'}
                </span>
              </div>
            </div>
          </div>

          {/* Governing Standard & Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                {locale === 'fr' ? 'Norme Internationale de Référence' : 'Governing Reference Standard'}
              </span>
              <span className="text-xs font-bold text-purple-300 font-mono mt-0.5 block">
                {calibration.governingStandard}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                {locale === 'fr' ? 'Périmètre du Contrôle d’Audit' : 'Audit Scope & Focus'}
              </span>
              <span className="text-xs font-medium text-slate-200 mt-0.5 block">
                {calibration.auditScope[locale]}
              </span>
            </div>
          </div>

          {/* Commissioning Verdict */}
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Verdict & Conclusions de Commissioning' : 'Commissioning Verdict & Findings'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              {calibration.commissioningVerdict[locale]}
            </p>
          </div>

          {/* Calibrated Parameters Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Paramètres Étalonnés & Calés sur Site' : 'Site Calibrated & Tuned Parameters'}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {calibration.calibratedParameters.length} {locale === 'fr' ? 'consignes vérifiées' : 'settings verified'}
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-800">{locale === 'fr' ? 'Paramètre / Fonction' : 'Parameter / Function'}</th>
                    <th className="p-2.5 border-b border-slate-800">{locale === 'fr' ? 'Valeur Calée' : 'Tuned Value'}</th>
                    <th className="p-2.5 border-b border-slate-800">{locale === 'fr' ? 'Tolérance' : 'Tolerance'}</th>
                    <th className="p-2.5 border-b border-slate-800">{locale === 'fr' ? 'État Initial Pré-Audit' : 'Pre-Audit Nominal'}</th>
                    <th className="p-2.5 border-b border-slate-800">{locale === 'fr' ? 'Clause Normative' : 'Normative Clause'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {calibration.calibratedParameters.map((p: CalibratedAuditParameter) => (
                    <tr key={p.key} className="hover:bg-slate-900/50 transition">
                      <td className="p-2.5 font-bold text-slate-200">
                        <div>{p.name[locale]}</div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">{p.description[locale]}</div>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-400">
                        {p.value}
                      </td>
                      <td className="p-2.5 text-slate-300 text-[11px]">
                        {p.tolerance}
                      </td>
                      <td className="p-2.5 text-amber-300 text-[11px]">
                        {p.nominalOrPreAudit}
                      </td>
                      <td className="p-2.5 text-slate-400 text-[10px]">
                        <div className="font-semibold text-purple-300">{p.standard}</div>
                        <div>{p.clause}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Recommendations */}
          {calibration.recommendations.length > 0 && (
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Prescriptions & Recommandations de l’Équipe d’Audit' : 'Audit Team Prescriptions & Recommendations'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                {calibration.recommendations.map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {rec[locale]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            {locale === 'fr' ? 'Synchronisé avec le dossier d’ingénierie formel CEI' : 'Synchronized with formal IEC Engineering Dossier'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            {locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
