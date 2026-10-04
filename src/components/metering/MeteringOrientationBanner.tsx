// src/components/metering/MeteringOrientationBanner.tsx
// EPEDE Domain D15 - Executive First-View Architecture & 7 Orientation Questions Banner for Smart Metering & Grid Digitalization

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Gauge,
  Zap,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Coins,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface MeteringOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const MeteringOrientationBanner: React.FC<MeteringOrientationBannerProps> = ({
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
      aFr: "Domaine 15 : Comptage Intelligent, Smart Grids & Digitalisation du Réseau (EPEDE D15). La frontière commerciale et numérique entre le distributeur d'énergie (Eneo) et les millions d'usagers résidentiels, tertiaires et industriels.",
      aEn: 'Domain 15: Smart Metering, Smart Grids & Grid Digitalization (EPEDE D15). The commercial and digital frontier linking the power distribution utility with residential, commercial, and industrial consumers.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: "L'infrastructure de comptage avancé (AMI) complète : compteurs électroniques communicants (CEI 62053), passerelles CPL G3/4G, protocole sécurisé DLMS/COSEM (CEI 62056), prépaiement STS 20 chiffres (CEI 62055) et plateforme centrale MDM/HES.",
      aEn: 'The full Advanced Metering Infrastructure (AMI): communicating electronic smart meters (IEC 62053), G3-PLC/4G cellular data concentrators, DLMS/COSEM protocol (IEC 62056), STS 20-digit prepayment (IEC 62055), and MDM/HES central software.',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: "Éliminer les pertes non techniques (fraudes, dérivations sauvages atteignant 20-30% au Cameroun), sécuriser les recettes de vente au comptant par prépaiement, piloter la demande en temps réel et automatiser la télé-relève sans agents de terrain.",
      aEn: 'Eliminate non-technical losses (power theft and unmetered taps reaching 20-30% in Cameroon), secure utility cash flow via prepaid vending, enable dynamic demand response, and automate billing without manual meter readers.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: "Énergie brute distribuée aux postes HTA/BT, flux monétaires Mobile Money (MTN MoMo, Orange Money) pour l'achat de tokens STS, relevés métrologiques de courant/tension et alertes anti-fraude d'ouverture de bornier.",
      aEn: 'Gross electrical energy delivered at MV/LV transformers, mobile money payments (MTN MoMo, Orange Money) for STS token vending, physical voltage/current telemetry, and tamper switch alarms.',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'out',
      qFr: '5. Qu’est-ce qui sort ?',
      qEn: '5. What leaves this system?',
      aFr: "Courbes de charge certifiées horodatées (15 min/1 h), tokens chiffrés de recharge d'électricité, bilans de pertes par poste HTA/BT, ordres de coupure/rétablissement à distance (relais 100A) et facturation auditée.",
      aEn: 'Certified time-stamped load profiles (15 min/1 h), encrypted STS electricity recharge tokens, substation energy balances, remote connect/disconnect switching commands (100A latching relay), and audited revenue streams.',
      color: 'border-teal-500/30 text-teal-400 bg-teal-500/10'
    },
    {
      id: 'downstream',
      qFr: '6. Quels sont les domaines dépendants ?',
      qEn: '6. Which domains depend on this?',
      aFr: "Distribution Locale (D05 - équilibrage de charge des transformateurs), Bâtiments & Usagers Finaux (D06 - alimentation des TGBT), Télécoms & Connectivité (D13 - sécurité réseau WAN) et Gestion d'Actifs (D15/D17).",
      aEn: 'Local Distribution (D05 - transformer phase balancing), Buildings & Installations (D06 - consumer switchboards), Telecoms & Cybersecurity (D13 - cellular APN & G3-PLC), and Asset Management (D15/D17).',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'risks',
      qFr: '7. Quels risques en cas de défaillance ?',
      qEn: '7. What happens if this system fails?',
      aFr: "Faillite commerciale par impayés massifs, dérive de l'horloge RTC invalidant la facturation horosaisonnière, cyberattaque sur les clés de chiffrement STS/DLMS et surchauffe des conducteurs par contournement de neutre.",
      aEn: 'Catastrophic utility revenue loss from uncontrolled power theft, RTC clock drift invalidating multi-tariff billing, cryptographic compromise of STS vending keys, and fire hazard from illegal neutral tampering.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md mb-6">
      {/* Banner Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-800/60 transition-colors border-b border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                {locale === 'fr' ? 'ARCHITECTURE D’ORIENTATION DIRECTIVE' : 'EXECUTIVE ARCHITECTURAL ORIENTATION'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                [CEI 62053 / CEI 62055 STS / CEI 62056 DLMS / COSEM]
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
              {locale === 'fr'
                ? "Les 7 Questions Fondamentales d'Ingénierie du Smart Metering & Grid Digitalization"
                : 'The 7 Fundamental Questions of Smart Metering & Grid Digitalization'}
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
              ? "Le déploiement d'un réseau de distribution digitalisé exige la maîtrise de la chaîne complète : du tore de mesure de courant jusqu'aux algorithmes bancaires de vente de tokens par Mobile Money. Cliquez sur une étape ci-dessous pour accéder au banc de conception."
              : 'Deploying a digitalized distribution grid requires mastering the full value chain: from current sensing coils up to mobile money token vending banking protocols. Click any engineering stage below to access design benches.'}
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
              { num: 1, labelFr: '1. Métrologie & DLMS/COSEM', labelEn: '1. Metrology & DLMS' },
              { num: 2, labelFr: '2. Prépaiement STS & Tokens', labelEn: '2. STS Tokens Vending' },
              { num: 3, labelFr: '3. Anti-Fraude & Balance Poste', labelEn: '3. Anti-Tamper & Balance' },
              { num: 4, labelFr: '4. MDM & Télé-conduite Relais', labelEn: '4. MDM & Remote Relay' },
              { num: 5, labelFr: '5. Cas Cameroun & DQE FCFA', labelEn: '5. Cameroon AMI & BOQ' }
            ].map((stg) => (
              <button
                key={stg.num}
                onClick={() => onNavigateStage(stg.num as 1 | 2 | 3 | 4 | 5)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5"
              >
                <span>{locale === 'fr' ? stg.labelFr : stg.labelEn}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
