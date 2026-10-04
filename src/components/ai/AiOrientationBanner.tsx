// src/components/ai/AiOrientationBanner.tsx
// EPEDE D09 - Executive First-View Architecture & 7 Orientation Questions Banner for AI & Advanced Technologies

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Cpu,
  Sparkles,
  Activity,
  Flame,
  ShieldAlert,
  Server,
  Camera,
  Sun
} from 'lucide-react';

interface AiOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const AiOrientationBanner: React.FC<AiOrientationBannerProps> = ({
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
      aFr: 'Domaine 09 : Intelligence Artificielle & Technologies Avancées (EPEDE D09). Le centre névralgique d\'inférence algorithmique, de jumeaux numériques et de cybersécurité OT pour les actifs électriques critiques.',
      aEn: 'Domain 09: Artificial Intelligence & Advanced Technologies (EPEDE D09). The advanced algorithmic inference, digital twin, and OT cybersecurity operations hub for critical electrical power assets.',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'Une plateforme cyber-physique unifiée couplant capteurs IIoT (DGA, vibrations, caméras infrarouges, compteurs AMI), calculateurs Edge durcis de sous-station (CEI 61850-3), jumeaux numériques guidés par la physique (PINN) et sondes d\'inspection réseau profonde (DPI CEI 62443).',
      aEn: 'A unified cyber-physical platform coupling industrial IoT sensors (DGA, vibration, infrared cameras, AMI smart meters), rugged substation Edge servers (IEC 61850-3), physics-informed neural digital twins (PINN), and deep packet inspection cyber probes (IEC 62443).',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ? (Raison d’être & Mission)',
      qEn: '3. Why does it exist? (Core Mission)',
      aFr: 'Pour passer d’une maintenance curative ou périodique aveugle à une maintenance prédictive prescriptive en temps réel, évitant les blackouts par défaillance brutale de transformateurs 225 kV, prévenant les bris mécaniques des turbines hydroélectriques et détectant les cyberattaques sur le réseau.',
      aEn: 'To shift from blind time-based maintenance to real-time predictive and prescriptive asset health management, preventing major grid blackouts from catastrophic 225 kV transformer failures, turbine damage, and OT cyber intrusions.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'input',
      qFr: '4. Quelles sont les entrées du système ? (Inputs)',
      qEn: '4. What are the system inputs? (Inputs)',
      aFr: 'Chromatographie d’huile en ligne (ppm H2, CH4, C2H2, C2H4, CO), signaux accélérométriques haute fréquence (vibrations 25.6 kHz), thermographie radiométrique LWIR par drone, trames réseau SCADA (CEI 104, GOOSE) et courbes de charge télérelevées AMI.',
      aEn: 'Online oil chromatography (ppm H2, CH4, C2H2, C2H4, CO), high-frequency vibration accelerometry (25.6 kHz), radiometric LWIR thermal drone imagery, substation network frames (IEC 104, GOOSE), and smart meter AMI load profiles.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'process',
      qFr: '5. Que se passe-t-il à l’intérieur ? (Processus & Algorithmes)',
      qEn: '5. What happens inside? (Processing & AI Engines)',
      aFr: 'Inférence trigonometrique du Triangle de Duval 1, résolution des équations différentielles thermiques CEI 60076-7 par réseau de neurones PINN, transformation de Fourier rapide (FFT) pour extraction des fréquences de roulements (BPFO/BPFI), détection d\'objets YOLOv8 et filtrage DPI MITRE ATT&CK.',
      aEn: 'Duval Triangle 1 trigonometric classification, differential thermal equation solving via physics-informed neural networks (PINN IEC 60076-7), FFT vibration spectral decomposition (BPFO/BPFI), YOLOv8 drone computer vision, and DPI MITRE ICS stateful inspection.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'output',
      qFr: '6. Quelles sont les sorties ? (Outputs & Décisions)',
      qEn: '6. What leaves the system? (Outputs & Decisions)',
      aFr: 'Diagnostics de défauts avec niveau de sévérité (PD, T1, T2, T3, D1, D2), indice de vieillissement relatif V, durée de vie résiduelle (RUL en années), alertes de cyber-intrusion avec blocage pare-feu, ordres d\'élagage géoréférencés LiDAR et bilans de redressement de fraude commerciale.',
      aEn: 'Fault diagnostic labels with severity (PD, T1, T2, T3, D1, D2), relative insulation aging acceleration V, Remaining Useful Life (RUL years), automated OT firewall mitigation alerts, georeferenced LiDAR trimming work orders, and commercial revenue recovery reports.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'next',
      qFr: '7. Que dois-je explorer ensuite ? (Parcours Ingénieur)',
      qEn: '7. What should I explore next? (Engineering Journey)',
      aFr: 'Suivre les 5 étapes progressives : 1. Chaîne d\'acquisition IIoT → 2. Jumeau DGA & PINN → 3. Analyse vibratoire FFT → 4. Drone & Cybersécurité DPI → 5. Dossier technique estampillé & Devis DQE en FCFA.',
      aEn: 'Follow the 5 progressive stages: 1. IIoT Data Acquisition → 2. DGA & PINN Digital Twin → 3. FFT Vibration Analytics → 4. Drone Vision & DPI Cybersecurity → 5. Stamped Technical Dossier & BOQ in FCFA.',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    }
  ];

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-5 shadow-2xl backdrop-blur-md">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
            <Compass className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CADRAGE MÉTHODOLOGIQUE D09
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                7 Questions Fondamentales d'Orientation
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
              {locale === 'fr'
                ? 'Architecture & Finalité de l\'Ingénierie IA & Technologies Avancées'
                : 'Architecture & Purpose of Industrial AI & Advanced Technologies'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
        >
          <span>{isOpen ? (locale === 'fr' ? 'Masquer' : 'Hide') : (locale === 'fr' ? 'Afficher les 7 Questions' : 'Show 7 Questions')}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Collapsible Questions Grid */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {questionsData.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border ${item.color} bg-slate-950/60 flex flex-col justify-between space-y-2`}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {locale === 'fr' ? item.qFr : item.qEn}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                    {locale === 'fr' ? item.aFr : item.aEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Question 7: Full width with direct stage jump buttons */}
          <div className="p-4 rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>{locale === 'fr' ? questionsData[6].qFr : questionsData[6].qEn}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {locale === 'fr' ? questionsData[6].aFr : questionsData[6].aEn}
              </p>
            </div>

            {/* Direct Step Jump Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
              {[
                { stage: 1, labelFr: 'Étape 1 : IIoT', labelEn: 'Stage 1: IIoT' },
                { stage: 2, labelFr: 'Étape 2 : DGA/PINN', labelEn: 'Stage 2: DGA' },
                { stage: 3, labelFr: 'Étape 3 : FFT', labelEn: 'Stage 3: FFT' },
                { stage: 4, labelFr: 'Étape 4 : Drone/Cyber', labelEn: 'Stage 4: Cyber' },
                { stage: 5, labelFr: 'Étape 5 : DQE FCFA', labelEn: 'Stage 5: DQE' }
              ].map((btn) => (
                <button
                  key={btn.stage}
                  type="button"
                  onClick={() => onNavigateStage(btn.stage as 1 | 2 | 3 | 4 | 5)}
                  className="px-2.5 py-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 hover:text-white font-mono text-[11px] flex items-center gap-1 transition-all"
                >
                  <span>{locale === 'fr' ? btn.labelFr : btn.labelEn}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
