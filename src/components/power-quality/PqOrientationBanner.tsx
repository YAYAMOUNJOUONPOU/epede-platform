// src/components/power-quality/PqOrientationBanner.tsx
// EPEDE Domain D17 / D14 - Executive First-View Architecture & 7 Orientation Questions Banner for Power Quality & EMC

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
  Zap,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Gauge,
  Sparkles
} from 'lucide-react';

interface PqOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const PqOrientationBanner: React.FC<PqOrientationBannerProps> = ({
  locale,
  onNavigateStage,
  onNavigateDomain
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const questionsData = [
    {
      id: 'where',
      qFr: '1. Où suis-je ?',
      qEn: '1. Where am I?',
      aFr: "Domaine 17 / 14 : Qualité de l'Onde Électrique & Compatibilité Électromagnétique (EPEDE D17/D14). Le centre névralgique d'audit, de dépollution harmonique et d'immunité dynamique des réseaux électriques HTA/BT.",
      aEn: 'Domain 17 / 14: Power Quality & Electromagnetic Compatibility (EPEDE D17/D14). The mission-critical engineering center for wave purity, harmonic mitigation, dynamic sag ride-through, and EMC compliance.',
      color: 'border-violet-500/30 text-violet-400 bg-violet-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: "L'écosystème d'assainissement de la forme d'onde : analyseurs CEI 61000-4-30 Classe A, filtres actifs shunt à injection IGBT 20 kHz (APF), batteries de condensateurs avec selfs de dé-résonance p=7% (189 Hz), et conditionneurs de creux de tension AVC.",
      aEn: 'The full waveform conditioning ecosystem: IEC 61000-4-30 Class A power quality analyzers, shunt IGBT active power filters (APF 20 kHz), 7% detuned anti-resonance capacitor banks (189 Hz), and dynamic voltage conditioners (AVC).',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: "Empêcher le vieillissement prématuré des transformateurs par courants de Foucault (déclassement Facteur K IEEE C57.110), éradiquer les arrêts imprévus des chaînes de production lors des creux de tension orageux (SEMI F47), et respecter les limites contractuelles de THDu Enéo / SONATREL.",
      aEn: 'Eliminate thermal destruction and accelerated aging of transformers from eddy currents (IEEE C57.110 K-Factor), stop catastrophic process trips during lightning-induced voltage sags (SEMI F47), and meet contractual grid injection limits.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: "Formes d'ondes déformées par les redresseurs non linéaires (VFD, onduleurs PV, fours à arc), fluctuations cycliques de réactif générant du flicker (Pst > 1), creux de tension transitoires (ΔU > 30%) et harmoniques homopolaires de neutre (h3, h9).",
      aEn: 'Distorted current waveforms from non-linear rectifiers (VFDs, solar inverters, smelters, arc furnaces), fast reactive power swings generating flicker (Pst > 1), deep transient voltage sags (ΔU > 30%), and triplen neutral harmonics (h3, h9).',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'out',
      qFr: '5. Qu’est-ce qui sort ?',
      qEn: '5. What leaves this system?',
      aFr: "Onde sinusoïdale pure à THDu < 5% (IEEE 519-2022), facteur de puissance unitaire compensé (cos φ > 0.96), immunité garantie aux micro-coupures de 200 ms, neutre froid sans courant résiduel et bordereau de prix chiffré (DQE en FCFA).",
      aEn: 'Pristine sinusoidal voltage waveform with THDv < 5% (IEEE 519-2022), stabilized unity power factor (cos phi > 0.96), guaranteed 200 ms sag ride-through, cool neutral conductors, and formal BOQ/DQE costed in FCFA.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'downstream',
      qFr: '6. Quels sont les domaines dépendants ?',
      qEn: '6. Which domains depend on this?',
      aFr: "Automatisme & Contrôle-Commande (D07 - immunité des automates et bus Modbus/Profibus), Postes & Réseaux HTB (D03/D04 - stabilité de tension SONATREL), Installations Industrielles (D15/D17) et IA & Électronique de Puissance (D09/D12).",
      aEn: 'Automation & Control (D07 - PLC immunity and fieldbus integrity), Substation & High-Voltage Grid Nodes (D03/D04 - grid voltage stability), Industrial Installations (D15/D17), and Power Electronics & AI (D09/D12).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'risks',
      qFr: '7. Quels risques en cas de défaillance ?',
      qEn: '7. What happens if this system fails?',
      aFr: "Explosion par résonance parallèle des condensateurs nus au rang 5 (250 Hz), incendie de câbles de neutre surchargés par le rang 3, déclenchement intempestif des variateurs de broyeurs (CIMENCAM / ALUCAM) et pénalités de dépassement contractuel SONATREL.",
      aEn: 'Explosive parallel harmonic resonance on plain capacitor banks at 5th order (250 Hz), neutral conductor fire from triplen overloading, catastrophic trip of critical cement/smelter drives, and severe grid utility penalty billing.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-violet-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md mb-6">
      {/* Banner Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-800/60 transition-colors border-b border-violet-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/60">
                {locale === 'fr' ? 'ARCHITECTURE D’ORIENTATION DIRECTIVE' : 'EXECUTIVE ARCHITECTURAL ORIENTATION'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                [CEI 61000-4-30 / IEEE 519 / SEMI F47 / IEEE C57.110]
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
              {locale === 'fr'
                ? "Les 7 Questions Fondamentales d'Ingénierie de la Qualité de l'Énergie & CEM"
                : 'The 7 Fundamental Questions of Power Quality & Electromagnetic Compatibility'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {isOpen
              ? locale === 'fr'
                ? 'Réduire'
                : 'Collapse'
              : locale === 'fr'
              ? 'Déplier les 7 réponses'
              : 'Expand 7 answers'}
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Questions Grid */}
      {isOpen && (
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl">
            {locale === 'fr'
              ? "Tout projet d'assainissement de réseau électrique industriel doit impérativement répondre à ces sept postulats avant de dimensionner des filtres actifs ou des batteries de condensateurs compensées. Cliquez sur une étape ci-dessous pour activer l'ingénierie correspondante."
              : 'Any industrial electrical mitigation project must rigorously answer these seven engineering postulates prior to sizing active power filters or detuned capacitor banks. Click any stage below to jump directly into design.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {questionsData.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border ${item.color} backdrop-blur-sm transition-all hover:scale-[1.01] hover:shadow-lg space-y-2`}
              >
                <div className="text-xs font-mono font-bold">{locale === 'fr' ? item.qFr : item.qEn}</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {locale === 'fr' ? item.aFr : item.aEn}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stage Progression Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-2">
              {locale === 'fr' ? 'Accès Rapide aux 5 Étapes :' : 'Quick Access 5 Stages:'}
            </span>
            {[
              { num: 1, labelFr: '1. Mesure Classe A & FFT', labelEn: '1. Class A FFT Audit' },
              { num: 2, labelFr: '2. Immunité Creux (SEMI F47)', labelEn: '2. Voltage Sag (SEMI F47)' },
              { num: 3, labelFr: '3. APF Shunt & Dé-résonance LC', labelEn: '3. APF & Detuned 7% LC' },
              { num: 4, labelFr: '4. Flicker & Déséquilibre CEM', labelEn: '4. Flicker & Unbalance EMC' },
              { num: 5, labelFr: '5. Cas Cameroun & DQE FCFA', labelEn: '5. Cameroon Cases & BOQ' }
            ].map((stg) => (
              <button
                key={stg.num}
                onClick={() => onNavigateStage(stg.num as 1 | 2 | 3 | 4 | 5)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800/80 hover:bg-violet-600 hover:text-white text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5"
              >
                <span>{locale === 'fr' ? stg.labelFr : stg.labelEn}</span>
                <ArrowRight className="w-3 h-3 text-violet-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
