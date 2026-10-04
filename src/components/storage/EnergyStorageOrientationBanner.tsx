// src/components/storage/EnergyStorageOrientationBanner.tsx
// EPEDE D10 - Executive First-View Architecture & 7 Orientation Questions Banner for Energy Storage & Charging

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BatteryCharging,
  Zap,
  Cpu,
  Layers,
  ShieldAlert,
  Flame,
  Globe,
  Sparkles
} from 'lucide-react';

interface EnergyStorageOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const EnergyStorageOrientationBanner: React.FC<EnergyStorageOrientationBannerProps> = ({
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
      aFr: 'Domaine 10 : Stockage d\'Énergie BESS, Onduleurs Grid-Forming & IRVE Haute Puissance (EPEDE D10). Le pilier de flexibilité dynamique, de réserve d\'inertie synthétique et de mobilité électrique du réseau.',
      aEn: 'Domain 10: Utility BESS, Grid-Forming Inverters & High-Power EV Charging (EPEDE D10). The engineering core for grid flexibility, synthetic inertia emulation, and electrified transport integration.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L\'ensemble électrochimique et électronique de puissance : conteneurs de batteries stationnaires 1500 V DC (LiFePO4/LFP), onduleurs 4 quadrants réversibles (PCS), régulation de machine synchrone virtuelle (VSG Grid-Forming) et plazas de recharge ultra-rapide (HPC 350 kW) avec gestion dynamique DLM.',
      aEn: 'The combined electrochemical and power electronics platform: 1500 V DC stationary battery containers (LiFePO4/LFP), 4-quadrant bidirectional inverters (PCS), Virtual Synchronous Generator (VSG Grid-Forming) controllers, and ultra-fast charging hubs (HPC 350 kW) with Dynamic Load Management (DLM).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Compenser l’intermittence des énergies renouvelables (solaire/éolien), fournir une réponse ultra-rapide de fréquence (FFR < 20 ms), stabiliser les réseaux faibles à faible inertie (ex: Réseau Interconnecté Nord Cameroun à Guider/Maroua) et éviter la surcharge des transformateurs lors de la recharge de masse des véhicules électriques.',
      aEn: 'Offset renewable generation intermittency, provide sub-20ms Fast Frequency Response (FFR), stabilize low-inertia grids (e.g. Northern Cameroon RIN microgrids at Guider/Maroua), and prevent distribution transformer overloads during mass EV charging peaks.',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: 'Énergie électrique triphasée 30 kV / 690 V AC lors de la recharge, excédents photovoltaïques diurnes, mesures de fréquence réseau (RoCoF à 10 kHz), requêtes de charge CCS2 (ISO 15118) et téléconduite dispatching EMS/SCADA.',
      aEn: '3-phase AC power (30 kV / 690 V) during charging cycles, surplus daytime solar generation, real-time grid frequency telemetry (RoCoF sampled at 10 kHz), CCS2 digital charging requests (ISO 15118), and EMS/SCADA dispatch commands.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'process',
      qFr: '5. Que s’y passe-t-il ?',
      qEn: '5. What happens inside it?',
      aFr: 'Intercalation réversible des ions lithium dans la cathode LFP, équilibrage actif des cellules par le BMS, conversion DC/AC bidirectionnelle par ponts IGBT/SiC, calcul de l\'inertie virtuelle J·dω/dt et lissage thermique par refroidissement liquide eau-glycolée.',
      aEn: 'Reversible lithium ion intercalation in LFP cathodes, active 3-tier BMS cell balancing, high-efficiency bidirectional DC/AC conversion via IGBT/SiC bridges, virtual inertia emulation (J·dω/dt), and closed-loop liquid chiller cooling.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What leaves this system?',
      aFr: 'Puissance active instantanée (MW) et réactive (Mvar) injectées au réseau en millisecondes pour soutenir la tension et la fréquence, recharge continue jusqu\'à 500 A vers les batteries de traction VE, et télémétrie certifiée d\'état de santé (SoH / SoC).',
      aEn: 'Instantaneous active power (MW) and dynamic reactive power (Mvar) injected to grid to arrest frequency dips, regulated DC charging up to 500 A to EV packs, and certified health telemetry (SoH / SoC).',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'fail',
      qFr: '7. Défaillance si absent / mal conçu ?',
      qEn: '7. What if it fails?',
      aFr: 'Emballement thermique catastrophique de batterie (propagation d\'incendie Li-ion sans Novec 1230), décrochage fréquentiel massif et black-out général sur perte de tranche, ou écroulement de tension réseau lors des pointes de recharge simultanées.',
      aEn: 'Catastrophic battery thermal runaway (uncontrolled Li-ion fire propagation violating NFPA 855), severe grid blackouts on major generation loss due to zero system inertia, or widespread voltage collapse during uncoordinated EV charging surges.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] overflow-hidden shadow-2xl transition-all">
      {/* Banner Header with Accordion Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/50 transition-colors border-b border-[#222B38]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm tracking-wide">
                {locale === 'fr' 
                  ? 'Orientation Exécutive : Les 7 Questions Fondamentales du Domaine D10' 
                  : 'Executive Orientation: The 7 Core Architectural Questions of Domain D10'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                BESS · GFM · IRVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              {locale === 'fr' 
                ? 'Compréhension immédiate de la chaîne de valeur du stockage d’énergie, des convertisseurs et des bornes de recharge ultra-rapides' 
                : 'Instant engineering clarity on utility BESS, Grid-Forming PCS and high-power EV charging infrastructure'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {isOpen ? (locale === 'fr' ? 'Réduire' : 'Collapse') : (locale === 'fr' ? 'Développer' : 'Expand')}
          </span>
          <div className="p-1 rounded-md bg-slate-800 text-slate-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Questions Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 bg-slate-950/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {questionsData.slice(0, 6).map((q) => (
              <div 
                key={q.id}
                className={`p-3.5 rounded-xl border ${q.color} transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between`}
              >
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider mb-1.5 opacity-90">
                    {locale === 'fr' ? q.qFr : q.qEn}
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                    {locale === 'fr' ? q.aFr : q.aEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 7th Question: Critical Failure Risk Banner */}
          <div className={`p-3.5 rounded-xl border ${questionsData[6].color} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
            <div className="space-y-1">
              <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                {locale === 'fr' ? questionsData[6].qFr : questionsData[6].qEn}
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed max-w-4xl">
                {locale === 'fr' ? questionsData[6].aFr : questionsData[6].aEn}
              </p>
            </div>

            <button
              onClick={() => onNavigateStage(5)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
            >
              <span>{locale === 'fr' ? 'Voir Sécurité & FMEA' : 'View Safety & FMEA'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progressive Journey Jump Bar */}
          <div className="pt-2 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-400 font-sans">
              {locale === 'fr' ? 'Accès direct aux étapes du parcours BESS :' : 'Direct access to BESS engineering stages:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { s: 1, labelFr: '1. Architecture Conteneur', labelEn: '1. Container Layout' },
                { s: 2, labelFr: '2. SOH Arrhenius', labelEn: '2. SOH Arrhenius' },
                { s: 3, labelFr: '3. Grid-Forming VSG', labelEn: '3. Grid-Forming VSG' },
                { s: 4, labelFr: '4. Bornes IRVE & DLM', labelEn: '4. EV Hub & DLM' },
                { s: 5, labelFr: '5. Cas Cameroun & DQE', labelEn: '5. Cameroon & BOQ' }
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => onNavigateStage(st.s as any)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/40 transition-all font-mono"
                >
                  {locale === 'fr' ? st.labelFr : st.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
