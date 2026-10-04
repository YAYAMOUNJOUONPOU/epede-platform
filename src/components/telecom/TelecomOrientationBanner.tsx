// src/components/telecom/TelecomOrientationBanner.tsx
// EPEDE D13 - Executive First-View Architecture & 7 Orientation Questions Banner for Utility Telecom & IEC 61850

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Radio,
  Network,
  Activity,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Server
} from 'lucide-react';

interface TelecomOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const TelecomOrientationBanner: React.FC<TelecomOrientationBannerProps> = ({
  locale,
  onNavigateStage,
  onNavigateDomain
}) => {
  const isFr = locale === 'fr';
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const questionsData = [
    {
      id: 'where',
      qFr: '1. Où suis-je ?',
      qEn: '1. Where am I?',
      aFr: 'Domaine 13 : Télécommunications de Réseau, Postes Numériques CEI 61850 & Technologies Opérationnelles (EPEDE D13). Le système nerveux numérique assurant la transmission déterministe et ultra-rapide des flux de protection et de contrôle-commande.',
      aEn: 'Domain 13: Utility Telecommunications, IEC 61850 Digital Substations & Operational Technology (EPEDE D13). The digital nervous system guaranteeing deterministic, ultra-low-latency transmission for protection and SCADA control.',
      color: 'border-teal-500/30 text-teal-400 bg-teal-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L\'infrastructure matérielle et protocolaire unifiée : bus de process optique (Sampled Values CEI 61869-9 / 9-2LE), bus de poste à télé-déclenchement GOOSE (CEI 61850-8-1), réseaux Ethernet industriels à redondance sans coupure (PRP / HSR selon CEI 62439-3), synchronisation PTP (IEEE 1588v2), câbles de garde à fibres optiques (OPGW) et courants porteurs (CPL).',
      aEn: 'The unified protocol and hardware infrastructure: optical process bus (Sampled Values IEC 61869-9 / 9-2LE), station bus GOOSE tripping (IEC 61850-8-1), zero-recovery redundant Ethernet (PRP / HSR IEC 62439-3), sub-microsecond PTP synchronization (IEEE 1588v2), OPGW fiber optics, and power line carrier (PLC).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Remplacer des kilomètres de câbles de cuivre filaires vulnérables aux surtensions par des fibres optiques insensibles à la CEM, éliminer le risque d\'explosion des circuits secondaires de TC, réduire les temps d\'élimination des défauts sous les 50 ms et interconnecter les centres de dispatching nationaux (SCADA Sonatrel/Eneo).',
      aEn: 'Replace miles of copper cabling vulnerable to induction with EMI-immune optical fibers, eliminate secondary CT open-circuit explosive hazards, compress fault clearance times below 50 ms, and interconnect dispatching control centers over nationwide WANs.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: 'Tensions et courants instantanés issus des réducteurs de mesure (TC/TT conventionnels ou capteurs optiques NCIT Rogowski), signaux de référence temporelle GNSS (GPS/Galileo), positions TOR de disjoncteurs et télécommandes de téléconduite.',
      aEn: 'Instantaneous voltages and currents from instrument transformers (conventional CT/VT or optical NCIT Rogowski coils), GNSS atomic clock references (GPS/Galileo), breaker auxiliary contacts, and SCADA control commands.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'process',
      qFr: '5. Que s’y passe-t-il ?',
      qEn: '5. What happens inside it?',
      aFr: 'Échantillonnage synchrone à 4000 Hz ou 12800 Hz dans les Merging Units (SAMU), encapsulation Ethernet directe sans pile TCP/IP (Ethertype 0x88BA et 0x88B8), duplication transparente des trames PRP sur double LAN indépendant et horodatage au nanoseconde par Transparent Clock (TC).',
      aEn: 'Synchronous digitization at 4000 Hz or 12800 Hz in Merging Units (SAMU), layer-2 direct Ethernet encapsulation (Ethertype 0x88BA & 0x88B8), seamless PRP packet duplication across dual LANs, and nanosecond Transparent Clock (TC) transit correction.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What leaves this system?',
      aFr: 'Flux multicast Sampled Values vers les relais de protection numériques, rafales d\'ordres de déclenchement GOOSE prioritaires (VLAN 802.1Q PCP 6/7) acheminées en moins de 3 ms, télémesures SCADA MMS vers le dispatching et faisceaux optiques OPGW longue distance.',
      aEn: 'Multicast Sampled Values streams to digital protection IEDs, high-priority GOOSE trip burst frames (VLAN 802.1Q PCP 6/7) delivered in < 3 ms, SCADA MMS telemetry to dispatchers, and long-range OPGW optical links.',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'fail',
      qFr: '7. Défaillance si absent / mal conçu ?',
      qEn: '7. What if it fails?',
      aFr: 'Désynchronisation temporelle PTP entraînant le déclenchement intempestif des protections différentielles 87L par fausse dérive angulaire, tempête de diffusion paralysant les relais, non-élimination de court-circuit HTB et destruction irréversible des transformateurs de puissance.',
      aEn: 'PTP timing loss causing catastrophic false tripping of line differential 87L relays via phase drift, broadcast packet storms paralyzing substation LANs, failure to clear high-voltage faults, and transformer catastrophic destruction.',
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
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm tracking-wide">
                {isFr 
                  ? 'Orientation Exécutive : Les 7 Questions Fondamentales du Domaine D13' 
                  : 'Executive Orientation: The 7 Core Architectural Questions of Domain D13'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                CEI 61850 · PRP/HSR · PTP · OPGW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              {isFr 
                ? 'Compréhension immédiate du réseau de communication, du bus de process numérique et des liaisons de télé-protection' 
                : 'Instant engineering clarity on utility telecom networks, digital process bus, and teleprotection links'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {isOpen ? (isFr ? 'Réduire' : 'Collapse') : (isFr ? 'Développer' : 'Expand')}
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
                    {isFr ? q.qFr : q.qEn}
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                    {isFr ? q.aFr : q.aEn}
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
                {isFr ? questionsData[6].qFr : questionsData[6].qEn}
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed max-w-4xl">
                {isFr ? questionsData[6].aFr : questionsData[6].aEn}
              </p>
            </div>

            <button
              onClick={() => onNavigateStage(5)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all"
            >
              <span>{isFr ? 'Voir Cas Réels & DQE' : 'View Real Cases & BOQ'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progressive Journey Jump Bar */}
          <div className="pt-2 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-400 font-sans">
              {isFr ? 'Accès direct aux étapes du parcours Télécom CEI 61850 :' : 'Direct access to IEC 61850 telecom engineering stages:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { s: 1, labelFr: '1. Bus de Process SV', labelEn: '1. Process Bus SV' },
                { s: 2, labelFr: '2. GOOSE & PRP/HSR', labelEn: '2. GOOSE & PRP/HSR' },
                { s: 3, labelFr: '3. PTP IEEE 1588v2', labelEn: '3. PTP IEEE 1588v2' },
                { s: 4, labelFr: '4. WAN OPGW & CPL', labelEn: '4. WAN OPGW & PLC' },
                { s: 5, labelFr: '5. Cas Cameroun & DQE', labelEn: '5. Cameroon & BOQ' }
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => onNavigateStage(st.s as any)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-teal-500/40 transition-all font-mono"
                >
                  {isFr ? st.labelFr : st.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
