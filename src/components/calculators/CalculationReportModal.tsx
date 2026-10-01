// src/components/calculators/CalculationReportModal.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  X, 
  ShieldCheck, 
  Download, 
  AlertTriangle,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  Bookmark,
  Save,
  CloudCheck
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

export interface ReportItem {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  status?: 'OK' | 'WARN' | 'DANGER' | 'INFO';
}

export interface ApparatusProvenance {
  equipmentId?: string;
  equipmentName?: string;
  equipmentTag?: string;
  substationOrFeeder?: string;
}

export interface CalculationReportData {
  title: string;
  calcType: string;
  standard: string;
  date: string;
  referenceId: string;
  apparatusProvenance?: ApparatusProvenance;
  inputs: ReportItem[];
  formulas: Array<{ name: string; expr: string }>;
  results: ReportItem[];
  complianceVerdict: {
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'INFORMATIONAL';
    message: string;
  };
  engineeringNotes: string[];
}

interface CalculationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  data: CalculationReportData;
}

export const CalculationReportModal: React.FC<CalculationReportModalProps> = ({
  isOpen,
  onClose,
  locale,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const [jsonDownloaded, setJsonDownloaded] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [savingCloud, setSavingCloud] = useState(false);
  const { user, saveCalculationNote, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSaveToCloud = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setSavingCloud(true);
    try {
      await saveCalculationNote({
        title: data.title || `Étude ${data.calcType}`,
        calculatorType: data.calcType,
        parameters: JSON.stringify({
          referenceId: data.referenceId,
          standard: data.standard,
          date: data.date,
          apparatusProvenance: data.apparatusProvenance || null,
          inputs: data.inputs,
          formulas: data.formulas,
          results: data.results,
          complianceVerdict: data.complianceVerdict,
          engineeringNotes: data.engineeringNotes,
        }),
        status: data.complianceVerdict.status === 'COMPLIANT' ? 'validated' : 'draft',
      });
      setSavedToCloud(true);
      setTimeout(() => setSavedToCloud(false), 3000);
    } catch (err) {
      console.error('Error saving calculation note to Firestore:', err);
    } finally {
      setSavingCloud(false);
    }
  };

  // Generate ASCII / Markdown report text for clipboard
  const generateMarkdownReport = (): string => {
    const divider = '================================================================================';
    const subDivider = '--------------------------------------------------------------------------------';
    
    let text = `${divider}\n`;
    text += `  EPEDE — ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT\n`;
    text += `  NOTE TECHNIQUE DE CALCUL / ENGINEERING DESIGN NOTE\n`;
    text += `  RÉFÉRENCE : ${data.referenceId} | DATE : ${data.date}\n`;
    text += `${divider}\n\n`;

    text += `1. OBJET & RÉFÉRENCE NORMATIVE\n`;
    text += `   Titre      : ${data.title}\n`;
    text += `   Norme(s)   : ${data.standard}\n`;
    text += `   Module     : ${data.calcType}\n\n`;

    if (data.apparatusProvenance) {
      text += `2. MATÉRIEL RÉSEAU ASSOCIÉ & PROVENANCE PHYSIQUE\n`;
      text += `${subDivider}\n`;
      if (data.apparatusProvenance.equipmentTag) {
        text += `   • Repère / Tag Appareil : ${data.apparatusProvenance.equipmentTag}\n`;
      }
      if (data.apparatusProvenance.equipmentName) {
        text += `   • Désignation Matériel  : ${data.apparatusProvenance.equipmentName}\n`;
      }
      if (data.apparatusProvenance.equipmentId) {
        text += `   • Identifiant Système   : ${data.apparatusProvenance.equipmentId}\n`;
      }
      if (data.apparatusProvenance.substationOrFeeder) {
        text += `   • Emplacement / Poste   : ${data.apparatusProvenance.substationOrFeeder}\n`;
      }
      text += `\n`;
    }

    const secNumOffset = data.apparatusProvenance ? 1 : 0;

    text += `${2 + secNumOffset}. HYPOTHÈSES & DONNÉES D'ENTRÉE (INPUTS)\n`;
    text += `${subDivider}\n`;
    data.inputs.forEach((item) => {
      const u = item.unit ? ` [${item.unit}]` : '';
      text += `   • ${item.label.padEnd(38, ' ')} : ${item.value}${u}\n`;
    });
    text += `\n`;

    text += `${3 + secNumOffset}. FORMULATIONS MATHÉMATIQUES & MODÈLE APPLIQUÉ\n`;
    text += `${subDivider}\n`;
    data.formulas.forEach((f) => {
      text += `   • ${f.name.padEnd(30, ' ')} = ${f.expr}\n`;
    });
    text += `\n`;

    text += `${4 + secNumOffset}. RÉSULTATS DU CALCUL & DIMENSIONNEMENT\n`;
    text += `${subDivider}\n`;
    data.results.forEach((r) => {
      const u = r.unit ? ` [${r.unit}]` : '';
      const flag = r.status ? ` (${r.status})` : '';
      text += `   ► ${r.label.padEnd(38, ' ')} : ${r.value}${u}${flag}\n`;
    });
    text += `\n`;

    text += `${5 + secNumOffset}. AVIS DE CONFORMITÉ & CONCLUSION TECHNIQUE\n`;
    text += `${subDivider}\n`;
    text += `   Statut : ${data.complianceVerdict.status}\n`;
    text += `   Avis   : ${data.complianceVerdict.message}\n\n`;

    text += `${6 + secNumOffset}. RECOMMANDATIONS & RÈGLES DE L'ART\n`;
    data.engineeringNotes.forEach((note, idx) => {
      text += `   [${idx + 1}] ${note}\n`;
    });

    text += `\n${divider}\n`;
    text += `AVERTISSEMENT : Document généré automatiquement par EPEDE CAD Engine.\n`;
    text += `Toute note d'exécution finale doit être contresignée par un ingénieur d'études agréé.\n`;
    text += `${divider}\n`;

    return text;
  };

  const handleCopy = async () => {
    try {
      const md = generateMarkdownReport();
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Note-Calcul-${data.calcType}-${data.referenceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonPayload = {
      generator: 'EPEDE Power Engineering Digital Environment (CAD Suite)',
      complianceEngineVersion: '2.4.0',
      dossierReference: data.referenceId,
      timestampIso: new Date().toISOString(),
      reportDate: data.date,
      metadata: {
        title: data.title,
        calcType: data.calcType,
        standard: data.standard,
        apparatusProvenance: data.apparatusProvenance || null,
      },
      inputs: data.inputs,
      formulas: data.formulas,
      results: data.results,
      complianceVerdict: data.complianceVerdict,
      engineeringNotes: data.engineeringNotes,
    };

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Note-Calcul-${data.calcType}-${data.referenceId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setJsonDownloaded(true);
    setTimeout(() => setJsonDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D1117] border border-[#252E38] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252E38] bg-[#11161D]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {locale === 'fr' ? 'Note de Calcul Technique' : 'Technical Calculation Note'}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  {data.referenceId}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {data.title} · {data.standard}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={savingCloud}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border cursor-pointer ${
                savedToCloud
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-amber-500/40'
              }`}
              title={locale === 'fr' ? 'Sauvegarder dans mon espace Firestore' : 'Save to my Firestore workspace'}
            >
              {savedToCloud ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Enregistré Firestore !' : 'Saved to Cloud!'}</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-amber-400" />
                  <span>{savingCloud ? '...' : locale === 'fr' ? 'Sauvegarder Étude' : 'Save Study'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#161C24] text-neutral-300 hover:text-white border-[#252E38] hover:border-cyan-500/50'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier' : 'Copy')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border cursor-pointer ${
                jsonDownloaded
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#161C24] text-neutral-300 hover:text-white border-[#252E38] hover:border-amber-500/50'
              }`}
              title={locale === 'fr' ? 'Télécharger Dossier JSON' : 'Download JSON Dossier'}
            >
              <FileCode className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">{jsonDownloaded ? 'JSON ✓' : 'JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-[#161C24] text-neutral-300 hover:text-white border border-[#252E38] hover:border-cyan-500/50 transition-colors cursor-pointer"
              title={locale === 'fr' ? 'Télécharger TXT' : 'Download TXT'}
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">TXT</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-[#161C24] text-neutral-300 hover:text-white border border-[#252E38] hover:border-cyan-500/50 transition-colors cursor-pointer"
              title={locale === 'fr' ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}
            >
              <Printer className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{locale === 'fr' ? 'PDF / Impr.' : 'PDF / Print'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161C24] border border-transparent hover:border-[#252E38] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Engineering Note Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs select-text">
          
          {/* Engineering Letterhead Banner */}
          <div className="p-4 rounded-xl bg-[#161C24] border border-[#252E38] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-cyan-300">EPEDE ENGINEERING CAD SUITE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">ISO 9001 COMPLIANT</span>
              </div>
              <div className="text-neutral-400 text-[11px]">
                {locale === 'fr' ? 'Note de dimensionnement technique et vérification normative' : 'Technical Sizing Note & Regulatory Verification'}
              </div>
            </div>
            <div className="text-right sm:text-right font-mono text-[11px] text-neutral-400">
              <div><span className="text-neutral-500">Réf :</span> <strong className="text-white">{data.referenceId}</strong></div>
              <div><span className="text-neutral-500">Date :</span> {data.date}</div>
              <div><span className="text-neutral-500">Norme :</span> <span className="text-amber-300 font-bold">{data.standard}</span></div>
            </div>
          </div>

          {/* Apparatus Provenance Card (if linked to active equipment) */}
          {data.apparatusProvenance && (
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-1.5">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                    {locale === 'fr' ? 'Appareil Réseau Associé (Provenance Physique)' : 'Associated Network Asset (Physical Provenance)'}
                  </span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                  {locale === 'fr' ? 'SYNCHRONISÉ DU SCHÉMA' : 'LIVE GRID LINKED'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Repère / Tag :</span>
                  <span className="font-bold text-white text-xs">{data.apparatusProvenance.equipmentTag || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Désignation :</span>
                  <span className="font-bold text-cyan-200 text-xs">{data.apparatusProvenance.equipmentName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Emplacement / Ouvrage :</span>
                  <span className="text-slate-300 text-xs">{data.apparatusProvenance.substationOrFeeder || 'Poste 225/30 kV Manga'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Inputs Table */}
          <div className="space-y-2">
            <div className="text-neutral-400 uppercase font-bold text-[11px] border-b border-[#252E38] pb-1 flex justify-between">
              <span>1. HYPOTHÈSES & DONNÉES D'ENTRÉE (INPUTS)</span>
              <span className="text-neutral-500">{data.inputs.length} variables</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {data.inputs.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#11161D] border border-[#252E38] flex flex-col justify-between">
                  <span className="text-neutral-400 text-[10px]">{item.label}</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {item.value} {item.unit && <span className="text-cyan-400 text-xs font-normal">{item.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Applied Mathematical Formulas */}
          <div className="space-y-2">
            <div className="text-neutral-400 uppercase font-bold text-[11px] border-b border-[#252E38] pb-1">
              2. FORMULATIONS THÉORIQUES APPLIQUÉES
            </div>
            <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2">
              {data.formulas.map((f, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] border-b border-neutral-800/60 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-cyan-300 font-semibold">{f.name} :</span>
                  <span className="text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-[11px] border border-amber-500/20">
                    {f.expr}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Calculated Results & Sizing Outputs */}
          <div className="space-y-2">
            <div className="text-neutral-400 uppercase font-bold text-[11px] border-b border-[#252E38] pb-1 flex justify-between">
              <span>3. RÉSULTATS DU CALCUL & DIMENSIONNEMENT</span>
              <span className="text-neutral-500">{data.results.length} grandeurs calculées</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.results.map((r, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    r.highlight 
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-xs' 
                      : 'bg-[#11161D] border-[#252E38]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-neutral-400 text-[11px]">{r.label}</div>
                    <div className="text-base font-bold text-white">
                      {r.value} {r.unit && <span className="text-cyan-300 text-xs font-normal">{r.unit}</span>}
                    </div>
                  </div>
                  {r.status && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      r.status === 'OK' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : r.status === 'WARN'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {r.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Compliance Verdict & Technical Conclusions */}
          <div className="space-y-2">
            <div className="text-neutral-400 uppercase font-bold text-[11px] border-b border-[#252E38] pb-1">
              4. AVIS DE CONFORMITÉ NORMATIVE
            </div>
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              data.complianceVerdict.status === 'COMPLIANT'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : data.complianceVerdict.status === 'NON_COMPLIANT'
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
            }`}>
              <div className="mt-0.5">
                {data.complianceVerdict.status === 'COMPLIANT' ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                ) : data.complianceVerdict.status === 'NON_COMPLIANT' ? (
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                ) : (
                  <FileText className="h-5 w-5 text-cyan-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span>{locale === 'fr' ? 'VERDICT TECHNIQUE :' : 'TECHNICAL VERDICT :'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    data.complianceVerdict.status === 'COMPLIANT'
                      ? 'bg-emerald-500 text-black'
                      : data.complianceVerdict.status === 'NON_COMPLIANT'
                      ? 'bg-rose-500 text-white'
                      : 'bg-cyan-500 text-black'
                  }`}>
                    {data.complianceVerdict.status === 'COMPLIANT'
                      ? (locale === 'fr' ? 'CONFORME AUX NORMES' : 'COMPLIANT')
                      : data.complianceVerdict.status === 'NON_COMPLIANT'
                      ? (locale === 'fr' ? 'NON CONFORME' : 'NON-COMPLIANT')
                      : (locale === 'fr' ? 'INFORMATIF' : 'INFORMATIONAL')}
                  </span>
                </div>
                <div className="text-[11px] leading-relaxed text-neutral-300">
                  {data.complianceVerdict.message}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Engineering Notes & Practical Guidelines */}
          <div className="space-y-2">
            <div className="text-neutral-400 uppercase font-bold text-[11px] border-b border-[#252E38] pb-1">
              5. RECOMMANDATIONS & RÈGLES DE L'ART
            </div>
            <ul className="p-3.5 rounded-xl bg-[#11161D] border border-[#252E38] space-y-2 text-[11px] text-neutral-400 list-disc list-inside">
              {data.engineeringNotes.map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-neutral-300">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Sign-off Block */}
          <div className="pt-4 border-t border-[#252E38] flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 gap-2">
            <div>
              Émis par : <strong className="text-neutral-400">EPEDE Digital Substation Engine</strong> · Document certifié conforme
            </div>
            <div className="font-mono text-[9px] text-neutral-600">
              HASH : {data.referenceId}-{Math.abs(data.title.split('').reduce((a,b)=>(((a<<5)-a)+b.charCodeAt(0))|0,0))}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-[#252E38] bg-[#11161D] flex justify-between items-center text-xs">
          <div className="text-neutral-500 font-mono text-[11px]">
            {locale === 'fr' ? 'Format exportable : PDF, Markdown ASCII, JSON' : 'Exportable format: PDF, ASCII Markdown, JSON'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#161C24] hover:bg-[#202732] text-white border border-[#252E38] font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            {locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
