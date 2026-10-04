// src/components/automation/AutomationOrientationBanner.tsx
// EPEDE D07 - Executive First-View Architecture & 7 Orientation Questions Banner for Industrial Automation

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Cpu,
  Activity,
  Sliders,
  ShieldAlert,
  Server,
  Network,
  Flame,
  Sparkles
} from 'lucide-react';

interface AutomationOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const AutomationOrientationBanner: React.FC<AutomationOrientationBannerProps> = ({
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
      aFr: 'Domaine 07 : Automatisation, Contrôle-Commande & Sécurité Instrumentée (EPEDE D07). Le centre névralgique de commande industrielle, de régulation continue et de sûreté de fonctionnement (SIS/SIL).',
      aEn: 'Domain 07: Industrial Automation, Control Systems & Safety Instrumentation (EPEDE D07). The operational core for plant logic execution, continuous regulation, and life safety shutdown (SIS/SIL).',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L’ensemble unifié matériel et logiciel : automates programmables (PLC/DCS CEI 61131-3), boucles de régulation PID, variateurs de vitesse VFD à contrôle vectoriel, réseaux de terrain Profinet/Modbus et automates de sécurité certifiés SIL 2 / SIL 3 (CEI 61508).',
      aEn: 'The unified hardware and software platform: programmable controllers (PLC/DCS IEC 61131-3), closed-loop PID controllers, field-oriented VFD inverters, Profinet/Modbus networks, and SIL 2 / SIL 3 certified safety systems (IEC 61508).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Assurer la production continue sans erreur humaine, maintenir des grandeurs critiques (pression, débit, vitesse de turbine) avec une précision sub-seconde et garantir l’arrêt d’urgence sécurisé des installations à haut risque technologique.',
      aEn: 'Ensure uninterrupted industrial production without operator errors, maintain tight process targets (pressure, flow, turbine speed) with sub-second accuracy, and enforce emergency shutdown for hazardous facilities.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: 'Grandeurs analogiques (courant 4–20 mA HART, sondes PT100), états discrets TOR 24V DC, ordres opérateurs IHM/SCADA, consignes de cadence et boucles de sécurité de contacts NF.',
      aEn: 'Analog instrument signals (4–20 mA HART loops, PT100 RTDs), discrete 24V DC inputs, operator setpoints from HMI/SCADA, dispatch commands, and fail-safe NC safety trips.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'process',
      qFr: '5. Que s’y passe-t-il ?',
      qEn: '5. What happens inside it?',
      aFr: 'Scrutation cyclique ultra-rapide (cycle 5–20 ms), exécution logique booléenne Ladder/ST, calcul matriciel de découplage Park/Clarke (FOC), algorithmes PID avec anti-emballement et vote majoritaire sécurisé 2oo3 (TMR).',
      aEn: 'Deterministic fast scanning (5–20 ms cycle), Boolean Ladder/ST logic evaluation, vector Park/Clarke decoupling (FOC), anti-windup PID calculations, and 2oo3 safety majority voting (TMR).',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What leaves this system?',
      aFr: 'Ordres de pilotage d’actionneurs (contacteurs, électrovannes pneumatiques, servomoteurs), trains d’impulsions PWM vers moteurs VFD, délestage immédiat et télémesures vers les centres de conduite.',
      aEn: 'Field actuation signals (motor starters, pneumatic valves, dampers), PWM inverter gate pulses, instant load shedding, and process telemetry to dispatching centers.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'fail',
      qFr: '7. Défaillance si absent / mal conçu ?',
      qEn: '7. What if it fails?',
      aFr: 'Emballement thermique ou mécanique, explosion en zone ATEX, cavitation destructrice de turbine hydro, arrêt de tranche non contrôlé et pertes de production massives chiffrées en centaines de millions de FCFA.',
      aEn: 'Runaway thermal reactions, explosions in ATEX hazardous zones, destructive hydro turbine cavitation, uncontrolled plant trips, and catastrophic financial downtime exceeding hundreds of millions of FCFA.',
      color: 'border-red-500/30 text-red-400 bg-red-500/10'
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
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wide uppercase flex items-center gap-2">
              <span>{locale === 'fr' ? 'Cadre d’Orientation Exécutif · Les 7 Piliers de l’Automatisation' : 'Executive Orientation Framework · The 7 Automation Pillars'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-normal border border-cyan-500/30">
                CEI 61131-3 · CEI 61508 · CEI 62443
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {locale === 'fr' 
                ? 'Comprendre la mission, les flux physiques et la criticité du contrôle-commande industriel'
                : 'Understand the mission, physical streams, and critical role of industrial control systems'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] hidden sm:inline">
            {isOpen ? (locale === 'fr' ? 'Réduire' : 'Collapse') : (locale === 'fr' ? 'Déplier les 7 Réponses' : 'Expand 7 Answers')}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {questionsData.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-2`}
              >
                <div className="font-bold text-[11px] uppercase tracking-wider">
                  {locale === 'fr' ? item.qFr : item.qEn}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {locale === 'fr' ? item.aFr : item.aEn}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stage Shortcuts */}
          <div className="pt-3 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {locale === 'fr' ? 'Parcours d’ingénierie séquentiel :' : 'Sequential engineering journey:'}
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { s: 1, fr: '1. E/S & Boucles 4-20mA', en: '1. I/O & 4-20mA' },
                { s: 2, fr: '2. PLC CEI 61131 & Hot-Standby', en: '2. PLC & Redundancy' },
                { s: 3, fr: '3. PID & Variateurs VFD', en: '3. PID & VFD Drives' },
                { s: 4, fr: '4. Sécurité SIL 3 & Réseaux', en: '4. SIL 3 & Networks' },
                { s: 5, fr: '5. Chantiers Cameroun & DQE', en: '5. Cameroon & DQE' }
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => onNavigateStage(st.s as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-all flex items-center gap-1"
                >
                  <span>{locale === 'fr' ? st.fr : st.en}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
