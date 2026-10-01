// src/components/engineers/EngineersChainView.tsx
import React, { useState } from 'react';
import {
  Zap,
  Plug,
  Building2,
  Network,
  Factory,
  Wrench,
  Search,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Scale,
  Clock
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import { InteractiveChainFlowSchematic } from './InteractiveChainFlowSchematic';
import { DomainEngineeringSchematic } from './DomainEngineeringSchematic';
import { EngineerRoleComparatorModal } from './EngineerRoleComparatorModal';
import { EngineerDayTimelineModal } from './EngineerDayTimelineModal';

export interface EngineersChainViewProps {
  locale: 'fr' | 'en';
  onNavigateDomain?: (domain: DomainCode) => void;
  onNavigateRole?: (slug: string) => void;
  onNavigateStandard?: (ref: string) => void;
}

const ChainViewContext = React.createContext<{
  openComparator: () => void;
  openTimeline: () => void;
}>({
  openComparator: () => {},
  openTimeline: () => {},
});

export const EngineersChainView: React.FC<EngineersChainViewProps> = ({
  locale,
  onNavigateDomain,
  onNavigateRole,
  onNavigateStandard,
}) => {
  const [activeDomain, setActiveDomain] = useState<string>('production');
  const [activeSource, setActiveSource] = useState<string>('hydro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isComparatorOpen, setIsComparatorOpen] = useState<boolean>(false);
  const [isDayTimelineOpen, setIsDayTimelineOpen] = useState<boolean>(false);

  const DOMAIN_CHAIN = [
    { id: 'production', labelFr: 'Production', labelEn: 'Generation', icon: '⚡', color: '#e8a825', bg: 'rgba(232,168,37,0.12)', border: 'rgba(232,168,37,0.4)', domainCode: 'D01' as DomainCode },
    { id: 'transport', labelFr: 'Transport HT', labelEn: 'Transmission', icon: '🔌', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', domainCode: 'D03' as DomainCode },
    { id: 'substation', labelFr: 'Postes', labelEn: 'Substations', icon: '🏗️', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)', domainCode: 'D04' as DomainCode },
    { id: 'distribution', labelFr: 'Distribution', labelEn: 'Distribution', icon: '🌐', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.4)', domainCode: 'D05' as DomainCode },
    { id: 'batiments', labelFr: 'Bâtiments', labelEn: 'Buildings', icon: '🏢', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', domainCode: 'D06' as DomainCode },
    { id: 'industrie', labelFr: 'Industrie', labelEn: 'Industry', icon: '🏭', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', domainCode: 'D07' as DomainCode },
    { id: 'transversal', labelFr: 'Transversal', labelEn: 'Transversal', icon: '🔧', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.4)', domainCode: 'D11' as DomainCode },
  ];

  return (
    <ChainViewContext.Provider
      value={{
        openComparator: () => setIsComparatorOpen(true),
        openTimeline: () => setIsDayTimelineOpen(true),
      }}
    >
      <div className="min-h-screen bg-[#0d1829] text-[#e8eaf0] font-sans">
      
      {/* 1. PAGE HEADER */}
      <header className="relative bg-gradient-to-br from-[#0a1020] to-[#111828] border-b-[3px] border-[#e8a825] px-6 sm:px-10 py-9 overflow-hidden">
        <div className="absolute right-10 top-5 text-[100px] opacity-[0.04] pointer-events-none select-none font-mono">
          ⚡
        </div>
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#e8a825]/70">
            ElectroCopilot · Référence Métier · Chaîne Électrique Complète
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
            Les <span className="text-[#e8a825]">Ingénieurs</span> de la Chaîne Électrique
          </h1>
          <p className="text-sm sm:text-base text-[#7a8399] max-w-3xl leading-relaxed font-sans">
            {locale === 'fr'
              ? "De la production d'énergie jusqu'à l'abonné final — qui sont les ingénieurs que vous trouverez à chaque étape, et quels sont leurs rôles précis."
              : 'From power generation to the final consumer — who are the engineers at each stage, and what are their exact professional duties.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-[#e8a825] leading-none">7</span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#7a8399]">Étapes Fondamentales</span>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-cyan-400 leading-none">35+</span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#7a8399]">Spécialités d'Ingénieurs</span>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-emerald-400 leading-none">170+</span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#7a8399]">Rôles &amp; Tâches Réelles</span>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-purple-400 leading-none">100%</span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#7a8399]">Contexte Cameroun &amp; Afrique</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HORIZONTAL CHAIN NAVIGATOR */}
      <nav className="bg-black/20 border-b border-white/[0.07] px-6 sm:px-10 py-5 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 min-w-max">
          {DOMAIN_CHAIN.map((node, index) => {
            const isActive = activeDomain === node.id;
            return (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  onClick={() => setActiveDomain(node.id)}
                  className={`flex flex-col items-center group transition-all text-center focus:outline-none ${
                    isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-[66px] h-[66px] rounded-full flex items-center justify-center text-2xl mb-1.5 transition-all border-2 ${
                      isActive
                        ? 'border-[#e8a825] shadow-[0_0_20px_rgba(232,168,37,0.35)] scale-105'
                        : 'border-transparent group-hover:border-white/20'
                    }`}
                    style={{ backgroundColor: node.bg }}
                  >
                    {node.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider font-mono transition-colors w-20 text-center ${
                      isActive ? 'text-[#e8a825]' : 'text-[#7a8399] group-hover:text-white'
                    }`}
                  >
                    {locale === 'fr' ? node.labelFr : node.labelEn}
                  </span>
                </button>

                {index < DOMAIN_CHAIN.length - 1 && (
                  <div className="text-white/20 text-xl font-bold px-1 select-none -mt-4">
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN WORKBENCH CONTENT */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-8">
        
        {/* Interactive Power Architecture Flow & Roles Synoptic Diagram */}
        <InteractiveChainFlowSchematic
          locale={locale}
          activeDomainId={activeDomain}
          onSelectDomain={(domainId) => setActiveDomain(domainId)}
          onNavigateDomain={onNavigateDomain}
        />

        {/* Quick Filter / Search Bar & Tool Actions */}
        <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a8399]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher un rôle, compétence, norme ou équipement (ex: 87T, SCADA, Kribi, KNX, Songloulou...)' : 'Search a role, skill, standard or asset (e.g. 87T, SCADA, Kribi, KNX...)'}
              className="w-full bg-[#131e30] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#7a8399] focus:outline-none focus:border-[#e8a825] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold transition-all hover:scale-105"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '⚖️ Comparer 2 Rôles' : '⚖️ Compare 2 Roles'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDayTimelineOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-mono text-xs font-bold transition-all hover:scale-105"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '⏱️ Journée Terrain' : '⏱️ Field Day'}</span>
            </button>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono text-[#e8a825] hover:underline px-2"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* ═══ 1. PRODUCTION D'ÉNERGIE ═══ */}
        {activeDomain === 'production' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#e8a825]/10 border border-[#e8a825]/30">
                ⚡
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#e8a825]">
                  1. Production d'Énergie
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Centrales hydroélectriques · Thermiques · Solaires · Éoliennes · Nucléaires · Géothermiques · Biomasse
                </div>
              </div>
            </div>

            {/* Overview Box */}
            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                La production est le premier maillon de la chaîne. C'est ici que l'énergie primaire (eau, soleil, vent, combustible, chaleur terrestre) est convertie en électricité. Les ingénieurs de ce secteur sont extrêmement spécialisés par type de source d'énergie, mais partagent tous la nécessité de maîtriser <strong className="text-white font-semibold">les machines électriques tournantes, la protection des générateurs et les systèmes de contrôle-commande (SCADA, DCS)</strong>. Au Cameroun : Songloulou 384MW, Edéa 276MW, Kribi 216MW, Lagdo 72MW — tous hydroélectriques ou thermiques.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="production"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            {/* Source Tabs */}
            <div className="flex gap-2 flex-wrap pb-1">
              {[
                { id: 'hydro', label: '💧 Hydroélectrique' },
                { id: 'thermique', label: '🔥 Thermique' },
                { id: 'solaire', label: '☀️ Solaire PV' },
                { id: 'eolien', label: '💨 Éolien' },
                { id: 'nucleaire', label: '⚛️ Nucléaire' },
                { id: 'geothermie', label: '🌋 Géothermie' },
                { id: 'biomasse', label: '🌿 Biomasse' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSource(s.id)}
                  className={`font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all ${
                    activeSource === s.id
                      ? 'bg-[#e8a825]/15 border-[#e8a825]/40 text-[#e8a825] shadow-sm'
                      : 'border-white/10 text-[#7a8399] hover:text-white bg-[#0f1829]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* HYDRO */}
            {activeSource === 'hydro' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EngineerCard
                    title="Ingénieur Électromécanique"
                    color="#3b82f6"
                    roles={[
                      'Conception et supervision des alternateurs (10-800 MVA)',
                      'Couplage alternateurs au réseau (synchronisation)',
                      "Systèmes d'excitation des générateurs",
                      'Régulateurs de tension automatiques (AVR)',
                      'Protection des générateurs (87G, 40, 32, 21)',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Mécanique Turbines"
                    color="#14b8a6"
                    roles={[
                      'Turbines Francis, Pelton, Kaplan selon chute et débit',
                      'Régulateurs de vitesse (governors) → contrôle fréquence',
                      "Systèmes hydrauliques d'huile de lubrification",
                      'Maintenance prédictive des turbines (vibrations)',
                      'Couplage turbine-alternateur et alignement',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Contrôle-Commande"
                    color="#a855f7"
                    roles={[
                      'DCS (Distributed Control System) pour le contrôle central',
                      'SCADA de supervision de la centrale (Wonderware, Ignition)',
                      'PLC locaux pour chaque groupe turbine-alternateur',
                      "Systèmes d'acquisition de données (capteurs 4-20mA)",
                      'Automatisme de démarrage/arrêt séquencé des groupes',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Génie Civil / Hydraulique"
                    color="#f97316"
                    roles={[
                      'Conception du barrage et des ouvrages annexes',
                      'Gestion des crues et des niveaux du réservoir',
                      "Galeries d'amenée et conduites forcées",
                      'Surveillance instrumentée du barrage (auscultation)',
                      'Calculs hydrologique et hydraulique des débits',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Protection Électrique"
                    color="#ef4444"
                    roles={[
                      'Protection différentielle générateur (87G)',
                      "Protection de perte d'excitation (40)",
                      'Protection de puissance inverse (32)',
                      'Protection de fréquence/tension (81/27/59)',
                      'Réglages des relais de protection et coordination',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Environnement"
                    color="#22c55e"
                    roles={[
                      "Étude d'impact environnemental (EIE)",
                      'Gestion du débit réservé (écologie fluviale)',
                      "Surveillance qualité de l'eau du réservoir",
                      'Programmes de compensation (population déplacée)',
                      'Conformité réglementaire (MINEE Cameroun)',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Cameroun — Hydroélectrique"
                  text="Le Cameroun est dominé par l'hydroélectrique (Songloulou, Edéa, Lom Pangar, Memve'ele, Nachtigal). Les ingénieurs les plus recherchés par AES-Sonel / ACTOM / Eneo / NHPC sont les Ingénieurs Contrôle-Commande (DCS/SCADA) et les Ingénieurs Protection. Les postes de Chef de Groupe (supervision d'un groupe turbine-alternateur) sont les plus nombreux sur le terrain."
                />
              </div>
            )}

            {/* THERMIQUE */}
            {activeSource === 'thermique' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EngineerCard
                    title="Ingénieur Centrale Thermique"
                    color="#f97316"
                    roles={[
                      'Gestion des alternateurs diesel ou gaz (10-300 MW)',
                      'Systèmes de combustion et alimentation en carburant',
                      'Systèmes de refroidissement (eau, air, tour de refroidissement)',
                      'Efficacité thermique et rendement de la centrale',
                      'Maintenance moteurs diesel industriels (Wärtsilä, MAN, Caterpillar)',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Instrumentation"
                    color="#ef4444"
                    roles={[
                      'Capteurs température, pression, débit, niveau sur procédé',
                      'Transmetteurs 4-20mA et boucles de régulation',
                      "Systèmes d'alarme et de sécurité du procédé",
                      'Calibration et étalonnage des instruments de mesure',
                      'Boucles PID pour régulation température chaudière',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Chimiste / Traitement Eau"
                    color="#a855f7"
                    roles={[
                      "Traitement des eaux d'alimentation des chaudières",
                      'Contrôle qualité eau de refroidissement (circuits fermés)',
                      'Traitement des effluents et eaux usées de la centrale',
                      'Analyse des gaz de combustion (NOx, SO2, CO)',
                      'Gestion des huiles moteur et lubrifiants industriels',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Cameroun — Thermique"
                  text="La centrale thermique de Kribi (gaz naturel, 216 MW) est un exemple clé. Les ingénieurs Instrumentation & Contrôle sont très demandés dans ces centrales. La maintenance des moteurs diesel (groupes de Yaoundé, Bafoussam) crée un besoin permanent d'Ingénieurs Électromécaniciens capables de gérer les alternateurs et les protections associées."
                />
              </div>
            )}

            {/* SOLAIRE */}
            {activeSource === 'solaire' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EngineerCard
                    title="Ingénieur Solaire PV"
                    color="#e8a825"
                    roles={[
                      'Dimensionnement champs PV (puissance crête, inclinaison, orientation)',
                      'Calcul des pertes : câblage, ombrage, température, poussière',
                      'Choix des panneaux (monocristallin, polycristallin, bifacial)',
                      'Logiciels de simulation : PVsyst, SAM (NREL), Homer Pro',
                      'Études de bankabilité et rapports pour financement',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Power Electronics"
                    color="#3b82f6"
                    roles={[
                      'Onduleurs solaires (string, central, micro-onduleurs)',
                      'MPPT (Maximum Power Point Tracking) — extraction max puissance',
                      'Connexion réseau (grid-tie) : contrôle puissance active/réactive',
                      'Systèmes de stockage BESS (LFP, NMC) + BMS',
                      "Qualité de l'énergie injectée (THD, cosφ, fréquence)",
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Protection Solaire"
                    color="#22c55e"
                    roles={[
                      'Protection anti-îlotage (islanding detection — 81U/O, 27/59)',
                      'Protection contre les arcs DC (AFCI) dans le champ PV',
                      'Parafoudres DC et AC — protection foudre du champ PV',
                      'Fusibles DC string et coupe-circuits de sécurité',
                      'Mise à la terre du champ PV et des structures métalliques',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Monitoring & Data"
                    color="#06b6d4"
                    roles={[
                      'Systèmes de monitoring de production en temps réel',
                      'Analyse de performance (Performance Ratio, Yield)',
                      'Détection de défauts : modules dégradés, ombrage, déconnexions',
                      'Drones thermiques pour inspection des champs PV',
                      'Rapports de production et O&M (Operations & Maintenance)',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Civil / BOS"
                    color="#f97316"
                    roles={[
                      'Structures de montage (toiture, sol, ombrières, flottant)',
                      'Chemins de câbles DC, tranchées, boîtes de jonction',
                      'Études de sol et fondations des structures',
                      'Permis de construire et raccordement réseau',
                      'BOS (Balance Of System) : tout sauf panneaux et onduleurs',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Cameroun — Solaire PV"
                  text="Le Cameroun reçoit 4.5-5.5 kWh/m²/jour — parmi les meilleures ressources d'Afrique centrale. Le marché PV explose : centrales solaires de Maroua et Guider (30 MWc), installations commerciales, mini-réseaux ruraux. Les compétences recherchées : dimensionnement PVsyst + systèmes hybrides PV+BESS+groupe. C'est un marché accessible dès maintenant pour un ingénieur indépendant."
                />
              </div>
            )}

            {/* EOLIEN */}
            {activeSource === 'eolien' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EngineerCard
                    title="Ingénieur Éolien"
                    color="#06b6d4"
                    roles={[
                      'Analyse de ressource éolienne (rose des vents, Weibull)',
                      'Dimensionnement parc (espacement, effet de sillage)',
                      'Génératrices à induction doublement alimentées (DFIG)',
                      'Systèmes de contrôle de pas (pitch control) et orientation (yaw)',
                      'Intégration réseau et puissance réactive des éoliennes',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Mécanique Turbines Vent"
                    color="#3b82f6"
                    roles={[
                      'Conception des pales (matériaux composites, aérodynamique)',
                      'Boîte de vitesses (gearbox) et transmissions',
                      'Analyse de fatigue et durée de vie des structures',
                      'Maintenance préventive et prédictive des éoliennes',
                      'Surveillance vibratoire des roulements et arbres',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Réseau & Intégration"
                    color="#22c55e"
                    roles={[
                      'Raccordement parc éolien au réseau HT',
                      'Compensation de puissance réactive (SVC, STATCOM)',
                      'Études de stabilité réseau avec injection intermittente',
                      'Prévision de production éolienne (modèles météo + ML)',
                      'Hybridation éolien + stockage BESS pour lissage production',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Afrique Centrale"
                  text="L'éolien est peu développé en Afrique centrale (ressource modérée). Il est plus pertinent au Sahel (Niger, Mali, Mauritanie) et en Afrique du Sud. Au Cameroun, le potentiel existe en zones d'altitude (Adamaoua, Monts Mandara). C'est un domaine à suivre pour le futur mais pas encore une priorité commerciale immédiate."
                />
              </div>
            )}

            {/* NUCLEAIRE */}
            {activeSource === 'nucleaire' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EngineerCard
                    title="Ingénieur Nucléaire"
                    color="#a855f7"
                    roles={[
                      'Physique du réacteur (neutronique, cœur du réacteur)',
                      "Systèmes de sûreté : arrêt d'urgence, refroidissement secours",
                      'Gestion du combustible nucléaire et des déchets radioactifs',
                      'Radioprotection et surveillance radiologique du site',
                      'Conformité aux autorités de sûreté nucléaire (AIEA)',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Matériaux Nucléaires"
                    color="#ef4444"
                    roles={[
                      'Comportement des matériaux sous irradiation',
                      'Inspection non destructive de la cuve du réacteur',
                      'Gestion du vieillissement des composants sous irradiation',
                      'Qualification des soudures et assemblages de sécurité',
                      'Études de durée de vie des centrales (60+ ans)',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Afrique"
                  text="L'Afrique du Sud (Koeberg) possède la seule centrale nucléaire commerciale en Afrique. L'Égypte (El Dabaa), le Ghana et le Nigeria ont des programmes en développement. Pour le Cameroun, c'est un horizon post-2035. Le domaine requiert des certifications internationales rigoureuses."
                />
              </div>
            )}

            {/* GEOTHERMIE */}
            {activeSource === 'geothermie' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EngineerCard
                    title="Ingénieur Géothermique"
                    color="#ef4444"
                    roles={[
                      'Exploration et caractérisation du gisement géothermal',
                      'Forage et équipement des puits géothermaux',
                      'Cycles de conversion : flash, binaire (ORC), dry steam',
                      'Gestion du fluide géothermal (vapeur, eau saumâtre)',
                      'Réinjection des fluides pour durabilité de la ressource',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Géologue"
                    color="#f97316"
                    roles={[
                      'Cartographie géologique des zones à potentiel géothermal',
                      'Études géophysiques (sismique, gravimétrie, magnétométrie)',
                      'Modélisation des réservoirs géothermaux',
                      'Évaluation des risques sismiques induits',
                      'Gestion de la ressource sur le long terme',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Afrique Centrale"
                  text="La géothermie est très développée dans la Rift Valley (Kenya Olkaria, Éthiopie) où elle fournit jusqu'à 40% de l'électricité kenyane. Au Cameroun, le potentiel géothermique existe autour de la Ligne du Mont Cameroun (zone volcanique) mais n'est pas encore exploité commercialement."
                />
              </div>
            )}

            {/* BIOMASSE */}
            {activeSource === 'biomasse' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EngineerCard
                    title="Ingénieur Biomasse / Biogaz"
                    color="#22c55e"
                    roles={[
                      'Valorisation des déchets agricoles en énergie (bagasse, coques de palmier)',
                      'Méthanisation : transformation déchets organiques en biogaz',
                      'Cogénération : électricité + chaleur depuis la biomasse',
                      'Brûleurs et chaudières biomasse pour steam turbines',
                      'Bilan carbone et certification durabilité biomasse',
                    ]}
                  />
                  <EngineerCard
                    title="Ingénieur Process Agro-industriel"
                    color="#84cc16"
                    roles={[
                      'Intégration centrales biomasse aux industries agro (huileries, sucreries)',
                      'Gestion des sous-produits (effluents, cendres) en circuit fermé',
                      "Optimisation de la consommation énergétique de l'usine",
                      'Systèmes de séchage et prétraitement de la biomasse',
                      'Certification ISO 50001 et reporting carbone',
                    ]}
                  />
                </div>

                <CameroonFieldBox
                  title="Contexte Cameroun — Biomasse"
                  text="Le Cameroun a un potentiel biomasse énorme : palmier à huile (Socapalm, CDC), canne à sucre (Sosucam à Mbandjock/Nkoteng), cacao, café. Les huileries brûlent souvent leurs coques de palmier pour produire vapeur et électricité. Les ingénieurs maîtrisant la cogénération biomasse + instrumentation process sont très demandés."
                />
              </div>
            )}
          </div>
        )}

        {/* ═══ 2. TRANSPORT HAUTE TENSION ═══ */}
        {activeDomain === 'transport' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#3b82f6]/10 border border-[#3b82f6]/30">
                🔌
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#3b82f6]">
                  2. Transport Haute Tension
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Lignes 90kV · 225kV · 400kV · Pylônes · Câbles ACSR · SONATREL Cameroun
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                Le transport est la colonne vertébrale du système électrique. Les ingénieurs de ce domaine gèrent l'<strong className="text-white font-semibold">acheminement de l'énergie sur de très longues distances</strong> (jusqu'à des centaines de kilomètres) à très haute tension pour minimiser les pertes par effet Joule. Au Cameroun, la SONATREL gère le réseau de transport 90kV et 225kV. C'est un domaine très technique, avec des ingénieurs rares et bien rémunérés.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="transport"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EngineerCard
                title="Ingénieur Systèmes de Puissance"
                color="#3b82f6"
                roles={[
                  'Analyse des flux de puissance (load flow) sur le réseau HT',
                  'Études de stabilité transitoire et dynamique du réseau',
                  'Calculs de courts-circuits (Icc max et min) en tout point',
                  'Optimisation de la puissance réactive sur le réseau (SVC)',
                  'Logiciels : PSS/E, PowerWorld, DIgSILENT PowerFactory',
                ]}
              />
              <EngineerCard
                title="Ingénieur Protection Lignes HT"
                color="#ef4444"
                roles={[
                  'Protection distance (21) — détection défauts sur lignes longues',
                  'Protection différentielle de ligne (87L) — liaison fibre optique',
                  'Protection de surintensité directionnelle (67)',
                  'Réenclencheur automatique (RAR) — gestion défauts fugitifs',
                  'Coordination avec protections des postes aux deux extrémités',
                ]}
              />
              <EngineerCard
                title="Ingénieur Lignes Aériennes HT"
                color="#f97316"
                roles={[
                  'Conception des lignes : sections ACSR, câbles de garde',
                  'Calculs mécaniques : flèche, tension, pylônes (vent, givre)',
                  "Distances d'isolement et coordination d'isolement (foudre)",
                  'Supervision chantiers de construction de lignes HT',
                  'Inspection par drones et hélicoptères équipés de caméras thermiques',
                ]}
              />
              <EngineerCard
                title="Ingénieur SCADA Réseau"
                color="#a855f7"
                roles={[
                  'EMS (Energy Management System) : supervision du réseau national',
                  'Téléconduite des disjoncteurs et sectionneurs à distance',
                  'Protocoles : IEC 60870-5-101/104, DNP3 sur fibres ou radio',
                  'Gestion des incidents réseau en temps réel depuis le dispatching',
                  'Prévision de charge et optimisation du dispatch des centrales',
                ]}
              />
              <EngineerCard
                title="Ingénieur Télécommunications Réseau"
                color="#14b8a6"
                roles={[
                  'Fibres optiques en câbles de garde (OPGW) sur lignes HT',
                  'Courant porteur en ligne (CPL) pour communication protection',
                  'Réseaux radio point-à-point pour télécommande postes isolés',
                  'Systèmes de synchronisation temporelle (GPS/IRIG-B)',
                  'Communication protection différentielle de ligne (64 Kbps)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Maintenance Lignes HT"
                color="#22c55e"
                roles={[
                  'Maintenance des pylônes (peinture anti-corrosion, galvanisation)',
                  'Remplacement des isolateurs dégradés (pollution, foudre)',
                  'Travaux sous tension (TST) sur lignes HT en service',
                  'Mesures d\'impédance et tests des conducteurs ACSR',
                  'Gestion des droits de passage et végétation sous les lignes',
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Contexte Cameroun — SONATREL"
              text="La SONATREL (Société Nationale de Transport de l'Électricité) gère les réseaux interconnectés Sud (RIS), Nord (RIN) et Est (RIE). Les profils les plus demandés : Ingénieurs Protection & Relayage et Ingénieurs SCADA/EMS pour le Dispatching National de Mangombé (Edéa). Les opportunités incluent aussi les bureaux d'études qui conçoivent de nouvelles lignes pour le compte de la Banque Mondiale et de la BAD (interconnexion Cameroun-Tchad 225 kV)."
            />
          </div>
        )}

        {/* ═══ 3. POSTES ÉLECTRIQUES ═══ */}
        {activeDomain === 'substation' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#a855f7]/10 border border-[#a855f7]/30">
                🏗️
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#a855f7]">
                  3. Postes Électriques (Substations)
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Postes HTB/HTA · Transformateurs de puissance · Disjoncteurs SF6 · Relais numériques · IEC 61850
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                Les postes électriques sont les <strong className="text-white font-semibold">nœuds de transformation et de commutation</strong> du réseau. C'est ici que la tension est élevée pour le transport ou abaissée pour la distribution. Un poste regroupe des transformateurs de puissance, des disjoncteurs HT, des jeux de barres et des systèmes de protection et de contrôle très sophistiqués. Les ingénieurs des postes sont parmi les plus techniques de l'industrie électrique.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="substation"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EngineerCard
                title="Ingénieur Conception de Poste"
                color="#a855f7"
                roles={[
                  'Architecture du poste : AIS (air), GIS (SF6), hybride',
                  'Schéma unifilaire et arrangements de jeux de barres',
                  'Dimensionnement des équipements HT (disjoncteurs, TI, TU)',
                  "Plans d'implantation et distances réglementaires d'isolement",
                  'Calculs de courts-circuits et sélection du matériel',
                ]}
              />
              <EngineerCard
                title="Ingénieur Protection & Relayage"
                color="#ef4444"
                roles={[
                  'Relais numériques multifonction (SEL, GE Multilin, Siemens, ABB)',
                  'Protection différentielle transformateur (87T) — calcul des réglages',
                  'Protection de jeux de barres (87B) — schéma de verrouillage',
                  'Logiciel de réglage : SEL-5010, DIGSI5, PCM600',
                  'Tests de relais : OMICRON CMC 356 — vérification fonctionnelle',
                ]}
              />
              <EngineerCard
                title="Ingénieur Contrôle Poste (SAS)"
                color="#14b8a6"
                roles={[
                  'SAS (Substation Automation System) selon IEC 61850',
                  'IED (Intelligent Electronic Devices) : programmation des nœuds logiques',
                  'GOOSE messaging : protection et verrouillage ultra-rapide (<4ms)',
                  'Intégration SCADA via MMS (Manufacturing Message Specification)',
                  "Horodatage précis (IEEE 1588 PTP) pour analyse d'incidents",
                ]}
              />
              <EngineerCard
                title="Ingénieur Mise en Service (Commissioning)"
                color="#3b82f6"
                roles={[
                  "Tests d'acceptance usine (FAT) des équipements HT",
                  'Tests sur site (SAT) : vérification de tous les circuits',
                  'Essais des transformateurs : rapport de transformation, résistances',
                  'Tests d\'injection primaire et secondaire sur les TI/TU',
                  'Première mise sous tension (énergisation) et vérification',
                ]}
              />
              <EngineerCard
                title="Ingénieur Maintenance Poste"
                color="#f59e0b"
                roles={[
                  'Maintenance préventive des disjoncteurs HT (SF6, mécanisme)',
                  'Analyse d\'huile des transformateurs (DGA — gaz dissous)',
                  'Mesure de résistance de contact des disjoncteurs',
                  'Maintenance des batteries d\'alimentation des relais (48/110V DC)',
                  'Inspection thermographique des connexions HT sous tension',
                ]}
              />
              <EngineerCard
                title="Ingénieur Tests Électriques"
                color="#22c55e"
                roles={[
                  'Tests diélectriques HT (tenue à la tension de choc, AC)',
                  'Mesure du facteur de dissipation (tan δ) des câbles et transfo',
                  'Tests de décharges partielles (PD) sur transformateurs et câbles',
                  'Mesure d\'isolement (Megger) et PI des équipements HT',
                  'Certification et rapport de tests pour l\'autorité de sûreté',
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Contexte Cameroun — Postes"
              text="Les postes source Eneo / SONATREL (Oyomabang, Bekoko, Logbaba, Bafoussam, Ngousso) sont au cœur des plans de réhabilitation. Les profils recherchés : Ingénieurs Protection & Relayage (rares et très valorisés) et Ingénieurs SAS / IEC 61850. ABB, Siemens et Schneider Electric sont les principaux constructeurs dont les ingénieurs commissioning interviennent sur les postes clés."
            />
          </div>
        )}

        {/* ═══ 4. DISTRIBUTION ═══ */}
        {activeDomain === 'distribution' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#f97316]/10 border border-[#f97316]/30">
                🌐
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#f97316]">
                  4. Réseau de Distribution
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Réseau MT 30kV Eneo · Transformateurs MT/BT · Smart Meters · AMI · Câbles BT · Smart Grid
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                La distribution est le réseau qui achemine l'énergie depuis les postes sources jusqu'aux abonnés (résidentiels, commerciaux, industriels). Au Cameroun, Eneo gère le réseau de distribution à 30kV / 15kV (MT) et 400V/230V (BT). C'est le domaine où <strong className="text-white font-semibold">les problématiques de qualité d'onde sont les plus critiques</strong> — coupures, baisses de tension, délestages — et où les ingénieurs interagissent le plus avec les usagers.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="distribution"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EngineerCard
                title="Ingénieur Planification Réseau"
                color="#f97316"
                roles={[
                  'Études de développement du réseau MT et BT (horizon 5-10 ans)',
                  'Calculs de charge et prévision de demande par zone',
                  'Dimensionnement des transformateurs MT/BT 30/0.4kV',
                  'Optimisation du réseau (reconfiguration, réduction pertes)',
                  'Logiciels : CYMDIST, ETAP Distribution, PowerFactory',
                ]}
              />
              <EngineerCard
                title="Ingénieur Protection Distribution"
                color="#3b82f6"
                roles={[
                  'Réglage des protections de départs MT (50/51, 67N)',
                  'Coordination fusibles MT et disjoncteurs de départ',
                  'Réenclencheurs (reclosers) sur lignes MT aériennes',
                  'Sélectivité ampèremétrique et chronométrique',
                  'Protection contre les défauts à la terre (résistance de neutre)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Smart Grid / AMI"
                color="#22c55e"
                roles={[
                  'Déploiement AMI (Advanced Metering Infrastructure) — smart meters',
                  'DMS (Distribution Management System) — supervision MT temps réel',
                  'Télécommande des organes de coupure MT (reconfiguration)',
                  'Intégration ENR distribuées (PV rooftop) dans le réseau BT',
                  'Réduction des pertes techniques et non-techniques (fraudes)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Fiabilité Réseau"
                color="#14b8a6"
                roles={[
                  'Calcul des indicateurs SAIDI, SAIFI, CAIDI par zone',
                  'Analyse des causes racines des incidents réseau',
                  "Plans d'amélioration de la continuité de service",
                  'Gestion des actifs réseau (câbles, transformateurs, cabines)',
                  "Reporting réglementaire à l'ARSEL (régulateur Cameroun)",
                ]}
              />
              <EngineerCard
                title="Ingénieur Travaux Réseau"
                color="#ef4444"
                roles={[
                  'Supervision des travaux de construction réseau MT et BT',
                  'Raccordements MT (jonctions câbles XLPE, cabines préfabriquées)',
                  'Travaux sous tension BT (procédures TST basse tension)',
                  'Coordination avec Eneo pour autorisations de travaux',
                  'Réception et contrôle qualité des travaux de sous-traitants',
                ]}
              />
              <EngineerCard
                title="Ingénieur Raccordement Client"
                color="#06b6d4"
                roles={[
                  'Études de raccordement BT et MT pour nouveaux abonnés',
                  'Calcul de la puissance de raccordement et du calibre DPCC',
                  'Vérification de la conformité des installations avant mise en service',
                  'Suivi des dossiers de raccordement (procédures Eneo Cameroun)',
                  'Gestion des réclamations et plaintes clients sur la qualité',
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Contexte Cameroun — Eneo Distribution"
              text="Eneo Cameroun emploie plusieurs centaines d'ingénieurs dans la distribution. Les profils les plus demandés : Ingénieurs Planification Réseau pour les extensions de réseau et Ingénieurs Smart Grid pour le déploiement des compteurs communicants (AMI/smart meters) en cours. Les bureaux d'études privés travaillent également sur commande Eneo."
            />
          </div>
        )}

        {/* ═══ 5. INSTALLATIONS DES BÂTIMENTS ═══ */}
        {activeDomain === 'batiments' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#22c55e]/10 border border-[#22c55e]/30">
                🏢
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#22c55e]">
                  5. Installations des Bâtiments
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Résidentiel · Tertiaire · Hôtels · Hôpitaux · Sécurité · Courants Faibles · Domotique
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                C'est le domaine le plus proche de l'abonné final. Les ingénieurs de ce secteur conçoivent et réalisent les <strong className="text-white font-semibold">installations électriques intérieures</strong> des bâtiments — des résidences privées aux hôtels 5 étoiles, en passant par les hôpitaux de référence et les tours de bureaux. C'est aussi le secteur d'excellence des <strong className="text-white font-semibold">courants faibles</strong> (réseaux VDI, vidéosurveillance IP, contrôle d'accès, SSI incendie) et de la <strong className="text-white font-semibold">domotique/smart building</strong>.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="batiments"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EngineerCard
                title="Ingénieur MEP (Électricité)"
                color="#22c55e"
                roles={[
                  'Conception des installations BT : TGBT, TD, circuits terminaux',
                  'Calculs : bilan de puissance, câbles, protections, chute tension',
                  "Schémas unifilaires et plans d'exécution (AutoCAD/Revit)",
                  'Note de calcul NFC 15-100 / IEC 60364 (Caneco BT)',
                  'Coordination avec architectes et autres corps d\'état (MEP)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Services du Bâtiment (BMS)"
                color="#3b82f6"
                roles={[
                  'GTB/BMS : supervision centralisée éclairage, CVC, accès',
                  'Protocoles : BACnet, KNX, Modbus pour intégration systèmes',
                  'Gestion énergétique du bâtiment (sous-comptage, reporting)',
                  'Programmation des scénarios (présence, heure, scène)',
                  'Certification BREEAM, HQE, LEED pour bâtiments verts',
                ]}
              />
              <EngineerCard
                title="Ingénieur Courants Faibles"
                color="#e8a825"
                roles={[
                  'Réseaux câblés (Cat6/6A) et fibre optique — câblage structuré',
                  'Vidéosurveillance IP (ONVIF, NVR, VMS) — CCTV',
                  "Contrôle d'accès (RFID, biométrie, contrôleurs)",
                  'Détection incendie (EN 54, centrale adressable, asservissements)',
                  'Sonorisation évacuation PA/VA (IEC 60849, STI-PA)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Domotique / KNX"
                color="#a855f7"
                roles={[
                  'Programmation KNX (ETS5/ETS6) — standard européen domotique',
                  'Gestion éclairage DALI (IEC 62386) — variation, scènes, présence',
                  'Intégration stores, climatisation, audio, sécurité',
                  'Supervision via application mobile (smartphone, tablette)',
                  'Certification KNX Partner — standard international domotique',
                ]}
              />
              <EngineerCard
                title="Ingénieur Hospitalier (IT Médical)"
                color="#f43f5e"
                roles={[
                  "Régime IT médical : transformateur d'isolement + CPI (IEC 60364-7-710)",
                  'Alimentation secours <0.5s pour équipements critiques',
                  'Liaisons équipotentielles supplémentaires (salles d\'opération)',
                  "Systèmes d'appel infirmière et interphonie médicale",
                  'Coordination avec ingénieurs biomédicaux sur équipements médicaux',
                ]}
              />
              <EngineerCard
                title="Ingénieur Éclairage"
                color="#f97316"
                roles={[
                  'Études lumineuses (DIALux, AGi32) — calcul des niveaux en lux',
                  'Spécification des luminaires LED selon IRC, température couleur',
                  'Éclairage de sécurité BAES et SATI (IEC 60598-2-22)',
                  'Systèmes de contrôle éclairage (DALI, capteurs présence, 0-10V)',
                  "Conformité EN 12464-1 (niveaux d'éclairement par type d'espace)",
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Votre Positionnement — Expertise de Premier Plan"
              text="Ce domaine est votre cœur de métier avec plus de 50 projets réalisés. Vous couvrez déjà les rôles d'Ingénieur Courants Faibles et d'Ingénieur MEP Électricité. La montée en compétences vers l'Ingénieur BMS/GTB (KNX, BACnet) et l'Ingénieur Hospitalier (IT médical de bloc opératoire) représente la progression naturelle la plus rémunératrice — ces profils sont très rares au Cameroun et facturent 2× le marché standard."
            />
          </div>
        )}

        {/* ═══ 6. INSTALLATIONS INDUSTRIELLES ═══ */}
        {activeDomain === 'industrie' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                🏭
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#f59e0b]">
                  6. Installations Industrielles
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Moteurs · VFD · MCC · PLC · SCADA · Instrumentation · Maintenance · Efficacité Énergétique
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                L'industrie est le domaine à plus forte valeur commerciale directe. Les usines, brasseries, cimenteries et sites miniers sont des systèmes électriques complexes avec des centaines de moteurs, des boucles de régulation en continu, des systèmes de sécurité fonctionnelle et des factures Eneo MT à plusieurs dizaines de millions FCFA par mois. Les ingénieurs industriels sont parmi les <strong className="text-white font-semibold">mieux rémunérés de la filière électrique</strong>.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="industrie"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EngineerCard
                title="Ingénieur Électrique Industriel"
                color="#f59e0b"
                roles={[
                  'Conception MCC (Motor Control Centre) complet',
                  'Dimensionnement câbles, protections et jeux de barres industriels',
                  'Calculs courts-circuits et coordination des protections',
                  'Gestion de la puissance réactive et des harmoniques (VFD)',
                  'Raccordement MT propre avec transformateur dédié',
                ]}
              />
              <EngineerCard
                title="Ingénieur Entraînements (Drives)"
                color="#3b82f6"
                roles={[
                  'Sélection et dimensionnement des variateurs VFD',
                  'Application loi de similitude pompes/ventilateurs (économies énergie)',
                  'Paramétrage des VFDs (rampes, protection moteur, communication)',
                  'Harmoniques générées par VFDs et filtres compensateurs',
                  'Démarrage progressif (soft starters) pour applications spécifiques',
                ]}
              />
              <EngineerCard
                title="Ingénieur Contrôle (PLC/SCADA)"
                color="#22c55e"
                roles={[
                  'Programmation PLC : Ladder, SFC, Structured Text (IEC 61131-3)',
                  'Développement synoptiques SCADA (Ignition, Wonderware, Aveva)',
                  'Réseau Modbus RTU/TCP entre PLC et VFDs, compteurs',
                  'Régulation PID pour contrôle procédé (température, pression, niveau)',
                  'Sécurité fonctionnelle SIL (IEC 61511) pour arrêts d\'urgence',
                ]}
              />
              <EngineerCard
                title="Ingénieur Instrumentation"
                color="#f97316"
                roles={[
                  'Spécification capteurs 4-20mA : pression, température, niveau, débit',
                  'P&ID (Piping & Instrumentation Diagram) — document de référence',
                  'Boucles de régulation PID en process continu',
                  'HART protocol : calibration et diagnostic capteurs à distance',
                  'Systèmes de sécurité instrumentés (SIS) pour procédés dangereux',
                ]}
              />
              <EngineerCard
                title="Ingénieur Maintenance Industrielle"
                color="#ef4444"
                roles={[
                  'Maintenance préventive et prédictive des moteurs (vibrations, thermographie)',
                  'Analyse de l\'indice de polarisation (PI) des moteurs',
                  'AMDEC (analyse modes de défaillance) pour prioriser maintenance',
                  'MTBF, MTTR et calcul de disponibilité des équipements',
                  'Gestion du stock de pièces de rechange critiques',
                ]}
              />
              <EngineerCard
                title="Ingénieur Énergie / Efficacité"
                color="#14b8a6"
                roles={[
                  'Audit énergétique industriel (mesure, baseline, opportunités)',
                  'Calcul ROI : compensation réactive, VFDs, moteurs IE3/IE4',
                  'Optimisation contrat Eneo MT (puissance souscrite, heures creuses)',
                  'Mise en place ISO 50001 et suivi KPI énergie (kWh/unité produite)',
                  'IPMVP : mesure et vérification des économies réalisées',
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Opportunité Business — Industrie Cameroun"
              text="Les huileries (Socapalm, Safacam), brasseries (SABC, Guinness), cimenteries (Cimencam, Dangote, Medcem), et agroalimentaires (Nestlé, Chococam) sont les plus grands consommateurs industriels. Un ingénieur maîtrisant PLC + VFD + audit énergétique peut facturer 3 à 10 millions FCFA par mission d'audit et optimisation dans ce secteur. C'est la progression stratégique la plus rentable."
            />
          </div>
        )}

        {/* ═══ 7. INGÉNIEURS TRANSVERSAUX ═══ */}
        {activeDomain === 'transversal' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-[#6366f1]/10 border border-[#6366f1]/30">
                🔧
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#6366f1]">
                  7. Ingénieurs Transversaux
                </h2>
                <div className="text-xs text-[#7a8399] font-mono mt-0.5">
                  Protection · Power Electronics · Énergie Renouvelable · Maintenance · R&D · Gestion de Projets
                </div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl p-5 sm:p-6 space-y-2">
              <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#7a8399]">
                Vue d'Ensemble
              </div>
              <p className="text-xs sm:text-sm text-[#7a8399] leading-relaxed">
                Certains ingénieurs ne sont pas cantonnés à un seul maillon de la chaîne — ils travaillent <strong className="text-white font-semibold">sur l'ensemble des domaines</strong>. Ce sont des spécialistes transversaux dont les compétences s'appliquent partout : protection électrique, électronique de puissance, gestion de projets, maintenance, R&D. Ce sont souvent les profils les plus recherchés et les mieux rémunérés de l'industrie.
              </p>
            </div>

            {/* Domain Visual Engineering Schematic */}
            <DomainEngineeringSchematic
              locale={locale}
              domainId="transversal"
              onFocusRole={(role) => setSearchQuery(role)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EngineerCard
                title="Ingénieur Protection (Partout)"
                color="#ef4444"
                roles={[
                  'Présent sur toute la chaîne : génération, transport, postes, distribution',
                  'Calculs de courts-circuits et plans de protection',
                  'Coordination et sélectivité des protections (toute tension)',
                  'Réglages des relais numériques (SEL, GE, Siemens, ABB)',
                  'Tests OMICRON — vérification fonctionnelle des relais',
                  'Études de stabilité dynamique sous défaut',
                  'C\'est le profil le plus rare et le mieux payé de la filière électrique',
                ]}
              />
              <EngineerCard
                title="Ingénieur Power Electronics"
                color="#06b6d4"
                roles={[
                  'UPS (onduleurs) — toutes puissances, tous secteurs',
                  'Variateurs de fréquence VFD — industrie, bâtiment, éolien',
                  'Onduleurs solaires — PV résidentiel, commercial, utilité',
                  'Chargeurs VE (véhicules électriques) — AC, DC, rapid',
                  'HVDC — transmission longue distance, interconnexions',
                  'BESS (Battery Energy Storage System) — stockage toute échelle',
                  'Conception et test des convertisseurs (IGBT, MOSFET)',
                ]}
              />
              <EngineerCard
                title="Ingénieur Maintenance & Fiabilité"
                color="#22c55e"
                roles={[
                  'Maintenance corrective, préventive, prédictive sur tous les sites',
                  'Thermographie IR — tableaux, connexions, transformateurs',
                  'Analyse vibratoire — moteurs, générateurs, turbines',
                  'Mesures électriques : isolement, résistance, THD, harmoniques',
                  'CMMS (logiciel de maintenance) : planification et historique',
                  'RCM (Reliability-Centered Maintenance) — optimisation ressources',
                  'Calcul MTBF, MTTR, disponibilité et coûts d\'arrêt',
                ]}
              />
              <EngineerCard
                title="Ingénieur Commissioning & Tests"
                color="#6366f1"
                roles={[
                  'FAT (Factory Acceptance Test) chez le fabricant',
                  'SAT (Site Acceptance Test) sur site après installation',
                  'Mise en service de tous types d\'installations électriques',
                  'Tests protections, transformateurs, câbles, tableaux',
                  'Rédaction des rapports de tests et certificats de conformité',
                  'Très mobile — travaille sur tous les continents pour constructeurs',
                  'ABB, Siemens, Schneider recrutent énormément pour ce profil',
                ]}
              />
              <EngineerCard
                title="Ingénieur Gestion de Projets"
                color="#e8a825"
                roles={[
                  'Chef de projet électrique — maîtrise du QCD (Qualité Coût Délai)',
                  'Planification MS Project / Primavera — WBS, Gantt, chemin critique',
                  'BOQ et estimation des coûts de travaux électriques',
                  'Gestion des appels d\'offres (AO publics ARMP, AO privés)',
                  'Management des équipes terrain et des sous-traitants',
                  'Certification PMP (PMI) ou PRINCE2 — valorise le profil',
                  'Travaille sur tous les types de projets de la chaîne électrique',
                ]}
              />
              <EngineerCard
                title="Ingénieur R&D & IA"
                color="#84cc16"
                roles={[
                  'Recherche sur smart grids, HVDC, stockage nouvelle génération',
                  'Machine Learning appliqué à la maintenance prédictive électrique',
                  'Algorithmes d\'optimisation pour dispatch énergétique',
                  'Digital Twin des réseaux électriques et des machines',
                  'Développement de plateformes d\'ingénierie assistée par IA',
                  'Publication scientifique et brevets dans les domaines émergents',
                  '→ C\'est le domaine d\'ElectroCopilot',
                ]}
              />
            </div>

            <CameroonFieldBox
              title="Votre Trajectoire Naturelle — ElectroCopilot Vision"
              text="Avec votre base en courants faibles + automatisation + gestion de projets, la trajectoire naturelle vers les profils les plus demandés au Cameroun est : (1) Ingénieur Commissioning & Tests — vos expériences de mise en service sont déjà là. (2) Ingénieur Énergie / Efficacité — audit énergétique industriel, fort ROI client. (3) Ingénieur R&D IA appliquée — ElectroCopilot vous positionne dans ce domaine d'avenir en Afrique."
            />
          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-black/30 border-t border-white/[0.07] px-6 sm:px-10 py-5 text-center mt-12">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#e8eaf0]/30">
          ElectroCopilot · Cartographie des Métiers · Chaîne Électrique Complète · De la Production à l'Abonné · Cameroun &amp; Afrique
        </div>
      </footer>

      {/* 5. INTERACTIVE MODALS */}
      <EngineerRoleComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        locale={locale}
      />

      <EngineerDayTimelineModal
        isOpen={isDayTimelineOpen}
        onClose={() => setIsDayTimelineOpen(false)}
        locale={locale}
      />

    </div>
    </ChainViewContext.Provider>
  );
};

// Sub-Component: Engineer Card
interface EngineerCardProps {
  title: string;
  color: string;
  roles: string[];
  onOpenComparator?: () => void;
  onOpenTimeline?: () => void;
}

const EngineerCard: React.FC<EngineerCardProps> = ({ 
  title, 
  color, 
  roles,
  onOpenComparator,
  onOpenTimeline,
}) => {
  const { openComparator, openTimeline } = React.useContext(ChainViewContext);
  const handleComparator = onOpenComparator || openComparator;
  const handleTimeline = onOpenTimeline || openTimeline;

  return (
    <div className="bg-[#0f1829] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/25 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between gap-2.5 bg-black/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider truncate" style={{ color }}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleComparator}
              title="Comparer ce métier"
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Scale className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleTimeline}
              title="Voir une journée terrain"
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-1.5">
          {roles.map((role, idx) => (
            <div key={idx} className="text-xs text-[#7a8399] flex items-baseline gap-2 py-0.5 border-b border-white/[0.03] last:border-b-0 leading-relaxed font-sans group-hover:text-slate-200 transition-colors">
              <span className="text-[11px] font-bold shrink-0" style={{ color }}>→</span>
              <span>{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Mini-Footer */}
      <div className="px-4 py-2 border-t border-white/[0.04] bg-black/30 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
          Fiche de Poste
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleComparator}
            className="text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>Comparer</span>
          </button>
          <button
            type="button"
            onClick={handleTimeline}
            className="text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>Journée</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-Component: Cameroon Field Box
interface CameroonFieldBoxProps {
  title: string;
  text: string;
}

const CameroonFieldBox: React.FC<CameroonFieldBoxProps> = ({ title, text }) => {
  return (
    <div className="bg-[#e8a825]/[0.08] border border-[#e8a825]/30 border-l-4 border-l-[#e8a825] rounded-lg p-4 sm:p-5 mt-4 space-y-1.5">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8a825] font-bold flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-[#e8a825]" />
        <span>⭐ {title}</span>
      </div>
      <p className="text-xs sm:text-[13px] text-[#fde68a]/90 leading-relaxed font-sans">
        {text}
      </p>
    </div>
  );
};
