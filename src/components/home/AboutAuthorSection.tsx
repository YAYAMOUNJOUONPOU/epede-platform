// src/components/home/AboutAuthorSection.tsx
import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  FileCode2, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';
import { EPEDE_AUTHOR, EPEDE_CANONICAL_METRICS } from '../../data/canonicalEngineeringMetrics';

interface AboutAuthorSectionProps {
  locale: 'fr' | 'en';
}

export const AboutAuthorSection: React.FC<AboutAuthorSectionProps> = ({ locale }) => {
  const isFr = locale === 'fr';
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [reportCategory, setReportCategory] = useState<'calc' | 'data' | 'typo'>('calc');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setReporterName('');
      setReportNote('');
    }, 4000);
  };

  return (
    <section 
      id="about-and-author" 
      aria-label={isFr ? "À propos de l'auteur et crédibilité" : "About the author and engineering credibility"}
      className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        
        {/* Left Column: Author Bio & Mission */}
        <div className="lg:w-3/5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
            <User className="h-3.5 w-3.5" />
            <span>{isFr ? 'CONCEPTION & DIRECTION TECHNIQUE' : 'LEAD ENGINEERING & AUTHORSHIP'}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {EPEDE_AUTHOR.name}
            </h2>
            <p className="text-cyan-400 font-medium text-sm sm:text-base">
              {isFr ? EPEDE_AUTHOR.titleFr : EPEDE_AUTHOR.titleEn}
            </p>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            {isFr ? EPEDE_AUTHOR.bioFr : EPEDE_AUTHOR.bioEn}
          </p>

          <p className="text-slate-400 text-xs leading-relaxed">
            {isFr 
              ? "EPEDE a été conçu pour répondre à un défi majeur : décloisonner l'ingénierie électrotechnique en Afrique francophone et internationale. De la production hydraulique sur le fleuve Sanaga jusqu'aux récepteurs finaux, la plateforme connecte les modèles physiques réels, les 17 solveurs déterministes et les normes industrielles (CEI, NF, IEEE, ARSEL)."
              : "EPEDE was created to bridge a critical gap: connecting theoretical power system models with real-world equipment and regional grid dynamics. From hydro generation on the Sanaga River to end-use loads, the platform integrates physical equipment specifications, 17 deterministic calculation engines, and international standards (IEC, NF, IEEE, ARSEL)."}
          </p>

          {/* Standards & Sourcing Pills */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isFr ? 'CEI 60909-0 & NF C 15-105' : 'IEC 60909-0 & NF C 15-105'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <FileCode2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isFr ? 'Données Réseau SONATREL / ARSEL 2024-2026' : 'SONATREL / ARSEL Grid Data 2024-2026'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>{isFr ? 'Modèles Déterministes Vérifiés' : 'Deterministic Validated Engines'}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Peer Review & Error Report Box */}
        <div className="lg:w-2/5 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-200">
            <AlertCircle className="h-4 w-4 text-cyan-400" />
            <h3 className="font-sans font-bold text-sm text-white">
              {isFr ? 'Revue par les Pairs & Signalement' : 'Peer Review & Discrepancy Reporting'}
            </h3>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            {isFr 
              ? "Une incohérence de valeur, un doute sur une formule ou une remarque sur les données du réseau camerounais ? Transmettez directement votre observation."
              : "Noticed a calculation discrepancy, a data mismatch, or have field feedback on Cameroon grid figures? Submit your note directly to the engineering team."}
          </p>

          {feedbackSent ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                {isFr 
                  ? "Merci pour votre contribution ! Votre remarque technique a été enregistrée pour revue."
                  : "Thank you! Your engineering note has been registered for review."}
              </span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  {isFr ? 'Votre nom / organisation (optionnel) :' : 'Your name / organization (optional):'}
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder={isFr ? "ex. Ingénieur Exploitation" : "e.g. Substation Engineer"}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  {isFr ? 'Nature de la remarque :' : 'Note category:'}
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="calc">{isFr ? 'Calculateur ou formule' : 'Calculator formula / result'}</option>
                  <option value="data">{isFr ? 'Données réseau ou matériel' : 'Equipment or grid rating'}</option>
                  <option value="typo">{isFr ? 'Précision de vocabulaire / Typo' : 'Terminology / Typo'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  {isFr ? 'Détail technique :' : 'Technical feedback:'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder={isFr ? "Précisez l'équipement, la formule ou la page concernée..." : "Specify the apparatus, equation, or page..."}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md shadow-cyan-950/50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isFr ? 'Transmettre le retour technique' : 'Submit Technical Feedback'}</span>
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{isFr ? 'Contact direct :' : 'Direct contact:'}</span>
            <a 
              href={`mailto:${EPEDE_AUTHOR.contactEmail}`}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Mail className="h-3 w-3" />
              <span>{EPEDE_AUTHOR.contactEmail}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
