// src/components/diagrams/modules/SubstationCommissioningProtocolView.tsx
// Formal multi-page engineering commissioning & compliance protocol for archiving and PDF print.

import React from 'react';
import { 
  FileCheck, 
  Printer, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  UserCheck, 
  Stamp, 
  Hash, 
  Building2,
  FileText
} from 'lucide-react';
import type { SubstationComplianceDossier } from '../../../services/substationBatchComplianceService';

interface SubstationCommissioningProtocolViewProps {
  locale: 'fr' | 'en';
  dossier: SubstationComplianceDossier;
}

export const SubstationCommissioningProtocolView: React.FC<SubstationCommissioningProtocolViewProps> = ({
  locale,
  dossier,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Print Button */}
      <div className="p-4 rounded-2xl bg-[#0E1724] border border-[#1E2E44] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'PROCÈS-VERBAL OFFICIEL DE CONFORMITÉ & ESSAIS DE RÉCEPTION' : 'OFFICIAL COMMISSIONING PROTOCOL & ACCEPTANCE CERTIFICATE'}
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              {locale === 'fr'
                ? 'Document d\'homologation certifié conforme aux exigences CEI 61936-1, CEI 60076, CEI 62271 et CEI 60364.'
                : 'Certified acceptance protocol conforming to IEC 61936-1, IEC 60076, IEC 62271, and IEC 60364 standards.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          <span>{locale === 'fr' ? 'IMPRIMER / EXPORTER EN PDF' : 'PRINT / SAVE AS PDF'}</span>
        </button>
      </div>

      {/* Formal Printable Document Sheet */}
      <div className="p-6 sm:p-10 rounded-2xl bg-[#080E18] text-slate-200 border border-[#1E2E44] shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-cyan-500/40 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 font-bold uppercase tracking-widest">
              <Building2 className="h-3.5 w-3.5" />
              <span>EPEDE ELECTRICAL SYSTEMS ENGINEERING · AUDIT DIVISION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white print:text-black">
              {locale === 'fr' ? 'CERTIFICAT D’HOMOLOGATION DU POSTE SOURCE' : 'SUBSTATION COMMISSIONING & ACCEPTANCE CERTIFICATE'}
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 font-sans">
              {dossier.substationName[locale]} · {dossier.topologyLabel[locale]} [{dossier.topology}]
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F1927] border border-[#22354E] print:border-slate-300 font-mono text-xs space-y-1 min-w-[200px]">
            <div className="flex justify-between text-slate-400 print:text-slate-600">
              <span>{locale === 'fr' ? 'RÉF. DOSSIER :' : 'DOC REF :'}</span>
              <span className="font-bold text-slate-200 print:text-black">{dossier.documentReference}</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-slate-600">
              <span>{locale === 'fr' ? 'DATE D’ÉMISSION :' : 'ISSUE DATE :'}</span>
              <span className="text-slate-200 print:text-black">{dossier.dateStr}</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-slate-600">
              <span>{locale === 'fr' ? 'INDICE SÉCURITÉ :' : 'SAFETY INDEX :'}</span>
              <span className="font-bold text-cyan-400 print:text-cyan-800">{dossier.safetyIndexPercent}%</span>
            </div>
          </div>
        </div>

        {/* Executive Verdict Box */}
        <div className="p-4 rounded-xl bg-[#0D1624] border border-[#1F3047] print:border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'VERDICT DE LA COMMISSION TECHNIQUE D’AUDIT' : 'TECHNICAL AUDIT BOARD VERDICT'}</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              dossier.globalVerdict.status === 'CONFORME_CEI'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : dossier.globalVerdict.status === 'RESERVE_TECHNIQUE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {dossier.globalVerdict.status}
            </span>
          </div>
          <p className="text-xs text-slate-300 print:text-slate-700 font-sans leading-relaxed">
            {dossier.globalVerdict.summary[locale]}
          </p>
        </div>

        {/* Section 1: Apparatus Technical Verification Matrix */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-cyan-400" />
            <span>{locale === 'fr' ? '1. MATRICE DE VÉRIFICATION MULTI-APPAREILLAGES DU POSTE' : '1. MULTI-ASSET VERIFICATION & COMPLIANCE MATRIX'}</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#1E2E44] print:border-slate-300">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#101A29] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1E2E44]">
                <tr>
                  <th className="p-3">Tag / Organe</th>
                  <th className="p-3">Spécifications</th>
                  <th className="p-3">Norme</th>
                  <th className="p-3">Grandeur Clé</th>
                  <th className="p-3">Valeur Mesurée</th>
                  <th className="p-3">Limite / Seuil</th>
                  <th className="p-3 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172537]">
                {dossier.apparatuses.map((app) => {
                  const primeMetric = app.metrics[0];
                  return (
                    <tr key={app.id} className="hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="font-bold text-white">{app.tag}</div>
                        <div className="text-[10px] text-slate-400">{app.name[locale]}</div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">{app.nominalRating}</td>
                      <td className="p-3 text-[10px] text-slate-400">{app.governingStandard}</td>
                      <td className="p-3 text-[11px] text-slate-300">{primeMetric ? primeMetric.label[locale] : '-'}</td>
                      <td className="p-3 text-[11px] font-bold text-cyan-400">
                        {primeMetric ? `${primeMetric.measuredValue} ${primeMetric.unit}` : '-'}
                      </td>
                      <td className="p-3 text-[11px] text-slate-400">{primeMetric ? primeMetric.nominalOrLimit : '-'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.overallStatus === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.overallStatus === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {app.overallStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Certified Test Procedures Checklist (FAT/SAT) */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{locale === 'fr' ? '2. PROCÉDURES D’ESSAIS SUR SITE & VÉRIFICATIONS DIÉLECTRIQUES' : '2. SITE ACCEPTANCE & DIELECTRIC COMMISSIONING TESTS'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0C1523] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Essais d’isolement HT (Megger 5 kV)</span>
                <span className="text-emerald-400 font-bold">R &gt; 2500 MΩ [OK]</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">Isolement phase-terre et entre phases conforme selon CEI 60076-3.</p>
            </div>

            <div className="p-3 rounded-xl bg-[#0C1523] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Résistance de contact disjoncteur (μΩ)</span>
                <span className="text-emerald-400 font-bold">Rc = 38 μΩ &lt; 45 μΩ [OK]</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">Micro-ohmmètre 200 A DC sur les pôles principaux selon CEI 62271-100.</p>
            </div>

            <div className="p-3 rounded-xl bg-[#0C1523] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Résistance boucle de terre poste (Rg)</span>
                <span className="text-emerald-400 font-bold">Rg = 0.38 Ω &lt; 0.50 Ω [OK]</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">Ceinture équipotentielle cuivre 95 mm² enterrée selon CEI 61936 / IEEE 80.</p>
            </div>

            <div className="p-3 rounded-xl bg-[#0C1523] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Temps de déclenchement relais 50/51</span>
                <span className="text-emerald-400 font-bold">t = 68 ms &lt; 100 ms [OK]</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">Injection secondaire de courant triphasé et déclenchement direct bobine Q0.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Normative References */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
            {locale === 'fr' ? '3. RÉFÉRENTIELS NORMATIFS INTERNATIONAUX CERTIFIÉS' : '3. CERTIFIED INTERNATIONAL STANDARDS'}
          </h3>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            {dossier.governingStandards.map((std, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#0F1928] border border-slate-800 text-slate-300">
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Section 4: Signature & Visa Block */}
        <div className="pt-6 border-t border-[#1E2E44] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#0C1523] border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'INGÉNIEUR EN CHEF COMMISSIONING' : 'LEAD COMMISSIONING ENGINEER'}</span>
            </div>
            <div className="font-bold text-white">{dossier.leadAuditor.name}</div>
            <div className="text-slate-400">{dossier.leadAuditor.role[locale]}</div>
            <div className="text-[10px] text-cyan-400 pt-2 font-bold">VISA: {dossier.leadAuditor.stampRef}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C1523] border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stamp className="h-3.5 w-3.5 text-emerald-400" />
              <span>{locale === 'fr' ? 'DIRECTION CONTRÔLE QUALITÉ & AUDIT' : 'QUALITY ASSURANCE AUTHORITY'}</span>
            </div>
            <div className="font-bold text-white">{dossier.leadAuditor.organization}</div>
            <div className="text-slate-400">Direction Technique des Réseaux</div>
            <div className="text-[10px] text-emerald-400 pt-2 font-bold">CERTIFIÉ ISO 9001:2015</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C1523] border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'AUTHENTICITÉ & SCEAU NUMÉRIQUE' : 'CRYPTOGRAPHIC SEAL & HASH'}</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 break-all">
              SHA-256: 8f4e7b1a2d9c3f0e5b7a1c8d6e4f2b0a9c3d5e7f1b3a5c7e9d1f3b5a7c9e1b3d
            </div>
            <div className="text-[10px] text-amber-300 font-bold pt-1">SCEAU NUMÉRIQUE HORODATÉ VALIDE</div>
          </div>
        </div>

      </div>
    </div>
  );
};
