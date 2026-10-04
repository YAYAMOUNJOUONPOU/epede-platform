// src/components/elv/ElvOrientationBanner.tsx
// EPEDE D08 - Executive First-View Architecture & 7 Orientation Questions Banner

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Network,
  Video,
  Flame,
  ShieldCheck,
  Building2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface ElvOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const ElvOrientationBanner: React.FC<ElvOrientationBannerProps> = ({
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
      aFr: 'Domaine 08 : Courants Faibles & Systèmes Spéciaux (EPEDE D08). Domaine d’excellence des infrastructures numériques, de sûreté et de sécurité des bâtiments intelligents.',
      aEn: 'Domain 08: Extra Low Voltage & Special Systems (EPEDE D08). Specialty domain for digital infrastructure, security, and smart building life safety.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L’ensemble unifié sous très basse tension (&lt; 50V AC / 120V DC) : câblage VDI (Fibre/Cuivre), vidéosurveillance IP, contrôle d’accès, SSI incendie Cat. A et GTB/BMS.',
      aEn: 'The unified extra-low voltage platform (&lt; 50V AC / 120V DC): structured cabling (Fiber/Copper), IP CCTV, access control, Cat. A fire alarm, and BMS.',
      color: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Sauvegarder les vies humaines (détection incendie EN 54, évacuation vocale), sécuriser les biens (DORI, sas interverrouillés) et piloter l’efficacité énergétique (BACnet/KNX).',
      aEn: 'Protect human life (EN 54 fire detection, voice alarm), secure facilities (DORI, interlocked airlocks), and optimize building energy performance (BACnet/KNX).',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters?',
      aFr: 'Signaux de capteurs optiques de fumée, flux vidéo 4K IP, lectures biométriques RFID, alimentation secourue 24V DC / PoE IEEE 802.3bt et données de comptage d’énergie.',
      aEn: 'Optical smoke detector telemetry, 4K IP video streams, RFID biometric reads, 24V DC / PoE IEEE 802.3bt backup power, and sub-metering data.',
      color: 'border-sky-500/30 text-sky-400 bg-sky-500/10'
    },
    {
      id: 'inside',
      qFr: '5. Que se passe-t-il à l’intérieur ?',
      qEn: '5. What happens inside?',
      aFr: 'Commutation PoE gigabit, encodage vidéo H.265+, corrélation de scénarios d’alarme incendie et asservissements CMSI, contrôle anti-passback et régulation CVC DDC.',
      aEn: 'Gigabit PoE switching, H.265+ encoding, fire scenario correlation and CMSI safety trip sequences, anti-passback logic, and DDC HVAC regulation.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What exits?',
      aFr: 'Pression acoustique d’évacuation certifiée (&gt; 65 dB SPL), déverrouillage de sécurité positive des issues, flux de supervision NVR (30 jours) et devis DQE en FCFA.',
      aEn: 'Certified voice alarm pressure (&gt; 65 dB SPL), fail-safe emergency egress release, 30-day NVR video streams, and stamped BOQ in FCFA.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'next',
      qFr: '7. Que dois-je explorer ensuite ?',
      qEn: '7. What should I explore next?',
      aFr: 'Le Domaine 06 (Installations Électriques & TGBT) pour l’alimentation CFO, ou le parcours structuré en 5 étapes d’ingénierie CFA ci-dessous.',
      aEn: 'Domain 06 (Electrical Installations & Switchboards) for mains supply, or the 5 progressive ELV engineering stages below.',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    }
  ];

  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] overflow-hidden shadow-2xl transition-all">
      {/* Banner Header Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-[#1A1400] via-[#241C00] to-[#0E141F] border-b border-[#222B38] flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs">
                {locale === 'fr' ? 'Orientation Rapide · Les 7 Réponses Clés du Domaine D08' : 'Quick Orientation · 7 Core Answers of Domain D08'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                EPEDE Directive
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {locale === 'fr'
                ? 'Fondements conceptuels, flux d’information entrants/sortants et cadre de conception des Courants Faibles.'
                : 'Conceptual foundation, input/output signal streams, and ELV life-safety engineering framework.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg bg-[#090D14] text-slate-400 hover:text-white border border-[#222B38] transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 7 Answers Grid */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {questionsData.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] hover:border-amber-500/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${item.color}`}>
                    {locale === 'fr' ? item.qFr : item.qEn}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {locale === 'fr' ? item.aFr : item.aEn}
                  </p>
                </div>

                {item.id === 'next' && onNavigateDomain && (
                  <button
                    type="button"
                    onClick={() => onNavigateDomain('D06')}
                    className="w-full mt-2 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{locale === 'fr' ? 'Aller au Domaine 06 (Installations BT)' : 'Go to Domain 06 (Installations)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Stage Shortcuts */}
          <div className="p-3 rounded-xl bg-[#0E141F]/60 border border-[#222B38] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              {locale === 'fr' ? 'Accès direct aux 5 étapes CFA :' : 'Direct access to 5 ELV stages:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { stage: 1 as const, name: '1. VDI & Fibre' },
                { stage: 2 as const, name: '2. CCTV & Accès' },
                { stage: 3 as const, name: '3. SSI Incendie & EN 54-4' },
                { stage: 4 as const, name: '4. GTB & Smart Building' },
                { stage: 5 as const, name: '5. Chantiers Cameroun & DQE' }
              ].map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => onNavigateStage(s.stage)}
                  className="px-2.5 py-1 rounded-lg bg-[#090D14] hover:bg-amber-500/20 border border-[#222B38] text-slate-300 hover:text-amber-300 transition-all font-bold cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
