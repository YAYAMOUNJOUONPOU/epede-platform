// src/components/equipment/EvidenceTrustModal.tsx
// EPEDE — Master 10-Tier Evidence, Trust & Verification Modal
// Provides complete technical transparency on data provenance, normative authority,
// engineering confidence scores, and acceptable professional application limits.

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Wrench,
  Sparkles,
  Cpu,
  MapPin,
  Building,
  Sliders,
  AlertCircle,
  HelpCircle,
  X,
  Search,
  ExternalLink,
  Info,
  Scale,
  FileCheck
} from 'lucide-react';
import type { EvidenceTrustLevel } from '../../types/engineeringIntelligenceExtensions';
import { EVIDENCE_BADGE_CONFIGS, EvidenceTrustBadge } from './EvidenceTrustBadge';

interface EvidenceTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'fr' | 'en';
  initialHighlightLevel?: EvidenceTrustLevel;
}

interface TrustTierDetailedInfo {
  level: EvidenceTrustLevel;
  category: 'NORMATIVE' | 'FIELD' | 'MODEL' | 'SCRUTINY';
  confidenceRange: string;
  confidenceScore: number;
  admissibleUsage_fr: string;
  admissibleUsage_en: string;
  restrictions_fr: string;
  restrictions_en: string;
  concreteExample_fr: string;
  concreteExample_en: string;
}

const DETAILED_TRUST_TIERS: TrustTierDetailedInfo[] = [
  {
    level: 'VERIFIED_STANDARD',
    category: 'NORMATIVE',
    confidenceRange: '95% – 100%',
    confidenceScore: 98,
    admissibleUsage_fr: 'Notes de calcul d\'exécution, spécifications contractuelles d\'appel d\'offres, critères de réception en usine (FAT) et sur site (SAT).',
    admissibleUsage_en: 'Detailed design calculations, procurement specifications, Factory Acceptance Testing (FAT) & Site Acceptance Testing (SAT).',
    restrictions_fr: 'Vérifier l\'année d\'édition de la norme et ses amendements en vigueur chez le maître d\'ouvrage.',
    restrictions_en: 'Verify effective publication edition and active amendments enforced by asset owner.',
    concreteExample_fr: 'Formules de courant de court-circuit CEI 60909-0, échauffement des enroulements CEI 60076-2.',
    concreteExample_en: 'IEC 60909-0 short-circuit formulas, IEC 60076-2 winding temperature limits.'
  },
  {
    level: 'ENGINEERING_REFERENCE',
    category: 'NORMATIVE',
    confidenceRange: '90% – 95%',
    confidenceScore: 92,
    admissibleUsage_fr: 'Prédimensionnement d\'avant-projet sommaire (APS), modélisation exploratoire, manuels techniques d\'exploitation.',
    admissibleUsage_en: 'Preliminary engineering (FEED), system exploration, standard utility operational handbooks.',
    restrictions_fr: 'Doit être complété par l\'étude d\'exécution spécifique de l\'équipementier désigné.',
    restrictions_en: 'Must be backed by finalized vendor-specific detailed engineering calculations.',
    concreteExample_fr: 'Cahiers Techniques Schneider Electric, Manuels de poste ABB/Hitachi, Brochures techniques CIGRE.',
    concreteExample_en: 'Schneider Electric Technical Guides, ABB/Hitachi Substation Manuals, CIGRE working group brochures.'
  },
  {
    level: 'FIELD_PRACTICE',
    category: 'FIELD',
    confidenceRange: '80% – 90%',
    confidenceScore: 85,
    admissibleUsage_fr: 'Consignes de consignation LOTO, plans de maintenance préventive, vérification visuelle terrain et audits.',
    admissibleUsage_en: 'LOTO procedures, preventative maintenance schedules, field visual checks and utility plant audits.',
    restrictions_fr: 'Sensible aux conditions environnementales locales et aux retours d\'expérience non formalisés.',
    restrictions_en: 'Dependent on localized site conditions and empirical crew maintenance habits.',
    concreteExample_fr: 'Purge des condenseurs d\'eau, contrôle visuel des éclateurs de parafoudres, prélèvements d\'huile transfo.',
    concreteExample_en: 'Water drainage routines, visual inspection of surge arrester spark gaps, periodic oil sampling.'
  },
  {
    level: 'CAMEROON_CONTEXT',
    category: 'FIELD',
    confidenceRange: '90% – 98%',
    confidenceScore: 95,
    admissibleUsage_fr: 'Conformité au réseau interconnecté Sud/Nord du Cameroun, interface SONATREL / ENEO, respect des arrêtés MINEE.',
    admissibleUsage_en: 'Compliance with Cameroon Interconnected Grids (RIS/RIN), SONATREL transmission code, ENEO MV limits.',
    restrictions_fr: 'Applicable exclusivement au périmètre géographique du réseau national camerounais.',
    restrictions_en: 'Strictly restricted to the geographical and regulatory perimeter of Cameroon grid assets.',
    concreteExample_fr: 'Tensions nominales 225 kV / 90 kV / 30 kV / 15 kV, couloir hydroélectrique Sanaga (Songloulou/Edéa/Nachtigal).',
    concreteExample_en: 'SONATREL nominal grid levels 225 kV / 90 kV / 30 kV / 15 kV, Sanaga river hydropower corridor.'
  },
  {
    level: 'MANUFACTURER_SPECIFIC',
    category: 'FIELD',
    confidenceRange: '85% – 95%',
    confidenceScore: 90,
    admissibleUsage_fr: 'Étude d\'intégration et d\'encombrement sur modèle précis, paramétrage de relais numériques d\'un constructeur donné.',
    admissibleUsage_en: 'Physical footprint layout, digital protection relay parameter mapping for a specific brand.',
    restrictions_fr: 'Ne pas extrapoler à des équipements équivalents de constructeurs tiers sans validation croisée.',
    restrictions_en: 'Do not extrapolate to alternative OEMs without cross-manufacturer dimensional review.',
    concreteExample_fr: 'Courbes de déclenchement Micrologic Schneider, automates SIPROTEC Siemens, disjoncteurs GL 314 GE.',
    concreteExample_en: 'Schneider Micrologic trip curves, Siemens SIPROTEC relay mappings, GE GL 314 live tank breakers.'
  },
  {
    level: 'SIMULATION_DATA',
    category: 'MODEL',
    confidenceRange: '75% – 90%',
    confidenceScore: 82,
    admissibleUsage_fr: 'Validation de scénarios d\'exploitation transitoire, analyse dynamique de stabilité, dimensionnement préliminaire.',
    admissibleUsage_en: 'Dynamic transient stability studies, power-flow scenario stress tests, preliminary sizing.',
    restrictions_fr: 'Résultats tributaires de l\'exactitude des impédances amont et hypothèses d\'équilibrage introduites.',
    restrictions_en: 'Results directly depend on entered network equivalent impedances and load assumptions.',
    concreteExample_fr: 'Chute de tension au démarrage de moteur MT, profil harmonique THD d\'un onduleur PV 5 MW.',
    concreteExample_en: 'MV motor starting voltage sag transient curve, PV inverter 5 MW harmonic spectrum synthesis.'
  },
  {
    level: 'CONCEPTUAL_MODEL',
    category: 'MODEL',
    confidenceRange: '70% – 85%',
    confidenceScore: 78,
    admissibleUsage_fr: 'Compréhension intuitive de la chaîne énergétique globale, formation des opérateurs, navigation de synthèse.',
    admissibleUsage_en: 'Intuitive systemic comprehension, engineering student onboarding, executive architectural overviews.',
    restrictions_fr: 'Ne jamais utiliser pour le choix des calibres de protection ou la vérification thermique des câbles.',
    restrictions_en: 'Never use for protection rating selection or final thermal cable sizing.',
    concreteExample_fr: 'Modèle synoptique « De la Source au Travail Utile », schéma fonctionnel à 8 étapes du voyage énergétique.',
    concreteExample_en: 'Ecosystem 8-stage visual flow from turbine to motor shaft, schematic single-line simplified representations.'
  },
  {
    level: 'APPLICATION_DEPENDENT',
    category: 'MODEL',
    confidenceRange: 'Variable',
    confidenceScore: 70,
    admissibleUsage_fr: 'Dimensionnement sur-mesure nécessitant la prise en compte des paramètres spécifiques du site client.',
    admissibleUsage_en: 'Bespoke project design strictly determined by customer site survey and utility grid code at point of connection.',
    restrictions_fr: 'La valeur affichée est indicative : l\'ingénieur de projet doit effectuer le calcul dédié.',
    restrictions_en: 'Values shown are illustrative benchmarks; designated project engineer must compute site-exact numbers.',
    concreteExample_fr: 'Plage de réglage du régleur en charge (OLTC) d\'un transformateur élévateur selon l\'éloignement de ligne.',
    concreteExample_en: 'On-load tap changer (OLTC) step range configuration based on transmission line impedance and length.'
  },
  {
    level: 'SOURCE_GAP',
    category: 'SCRUTINY',
    confidenceRange: '< 50%',
    confidenceScore: 40,
    admissibleUsage_fr: 'Signalement explicite d\'une lacune dans la traçabilité documentaire à destination du bureau d\'études.',
    admissibleUsage_en: 'Explicit transparency flag marking missing formal backing for ongoing engineering resolution.',
    restrictions_fr: 'Interdit pour toute décision engageant la sécurité des biens et des personnes.',
    restrictions_en: 'Strictly prohibited as basis for electrical safety, protection clearance, or purchasing commitments.',
    concreteExample_fr: 'Courbe de détarage thermique sous altitude > 1000 m non fournie dans la fiche technique d\'origine.',
    concreteExample_en: 'Missing manufacturer de-rating curve for tropical ambient conditions above 1,000 meters elevation.'
  },
  {
    level: 'REQUIRES_VALIDATION',
    category: 'SCRUTINY',
    confidenceRange: 'En révision',
    confidenceScore: 50,
    admissibleUsage_fr: 'Mise en évidence des données techniques soumises à la commission de revue contradictoire des ingénieurs EPEDE.',
    admissibleUsage_en: 'Identification of technical parameters under peer-review by the EPEDE Senior Engineering Committee.',
    restrictions_fr: 'Donnée provisoire ; ne pas intégrer dans des rapports officiels avant validation formelle.',
    restrictions_en: 'Provisional technical statement; not authorized for official submittals prior to formal approval.',
    concreteExample_fr: 'Nouvelle modélisation des pertes magnétiques à vide d\'un transformateur amorphe en climat tropical humide.',
    concreteExample_en: 'Novel mathematical core loss model for amorphous core transformers operating in high-humidity tropics.'
  }
];

export const EvidenceTrustModal: React.FC<EvidenceTrustModalProps> = ({
  isOpen,
  onClose,
  locale = 'fr',
  initialHighlightLevel
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'NORMATIVE' | 'FIELD' | 'MODEL' | 'SCRUTINY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<EvidenceTrustLevel | null>(initialHighlightLevel || null);

  const isFr = locale === 'fr';

  useEffect(() => {
    if (initialHighlightLevel) {
      setActiveLevel(initialHighlightLevel);
    }
  }, [initialHighlightLevel]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTiers = DETAILED_TRUST_TIERS.filter((item) => {
    const config = EVIDENCE_BADGE_CONFIGS[item.level];
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = config.label_fr.toLowerCase().includes(q) || config.label_en.toLowerCase().includes(q);
      const matchDesc = config.description_fr.toLowerCase().includes(q) || config.description_en.toLowerCase().includes(q);
      const matchEx = item.concreteExample_fr.toLowerCase().includes(q) || item.concreteExample_en.toLowerCase().includes(q);
      const matchLevel = item.level.toLowerCase().includes(q);
      return matchName || matchDesc || matchEx || matchLevel;
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-4xl bg-[#090D11] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#101720] to-slate-900 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 id="evidence-modal-title" className="text-base sm:text-lg font-bold font-sans text-white">
                {isFr ? 'Système de Badges de Confiance & Preuve d\'Ingénierie' : 'Engineering Evidence & Trust Badge System (10 Tiers)'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
              {isFr
                ? 'Directives d\'intégrité technique EPEDE : qualification rigoureuse de chaque donnée, de la norme vérifiée jusqu\'au signalement explicite des lacunes de sources.'
                : 'EPEDE Technical Integrity Guidelines: systematic qualification of engineering parameters, from verified grid standards to transparent source gap disclosures.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
            title={isFr ? "Fermer (Échap)" : "Close (Esc)"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-[#0D1217] border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'ALL', label_fr: 'Tous les 10 Niveaux', label_en: 'All 10 Tiers' },
              { id: 'NORMATIVE', label_fr: 'Autorité Normative', label_en: 'Normative' },
              { id: 'FIELD', label_fr: 'Terrain & Cameroun', label_en: 'Field & Cameroon' },
              { id: 'MODEL', label_fr: 'Modèles & Simulation', label_en: 'Models & Sim' },
              { id: 'SCRUTINY', label_fr: 'Vigilance & Revue', label_en: 'Scrutiny & Review' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {isFr ? cat.label_fr : cat.label_en}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={isFr ? "Filtrer un badge, une norme..." : "Filter badge, standard..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-[11px] focus:outline-hidden focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Body: Tiers Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#080C0F]">
          {filteredTiers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Info className="w-6 h-6 mx-auto text-slate-600" />
              <p>{isFr ? 'Aucun badge ne correspond à votre recherche.' : 'No trust badge matched your filter criteria.'}</p>
            </div>
          ) : (
            filteredTiers.map((tier) => {
              const config = EVIDENCE_BADGE_CONFIGS[tier.level];
              const isHighlighted = activeLevel === tier.level;

              return (
                <div
                  key={tier.level}
                  onClick={() => setActiveLevel(tier.level)}
                  style={{
                    borderColor: isHighlighted ? config.color : 'rgba(51, 65, 85, 0.45)'
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border bg-gradient-to-r from-[#0C1117] to-[#0A0E13] transition-all cursor-pointer ${
                    isHighlighted ? 'ring-1 shadow-lg' : 'hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-2">
                      <EvidenceTrustBadge level={tier.level} locale={locale} size="sm" />
                      <span className="text-slate-400 font-mono text-[10px]">
                        [{tier.level}]
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-slate-400 font-sans">
                        {isFr ? 'Indice de Confiance :' : 'Confidence Score:'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 sm:w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${tier.confidenceScore}%`,
                              backgroundColor: config.color
                            }}
                          />
                        </div>
                        <strong className="text-white font-mono text-[10px]">{tier.confidenceRange}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Description & Engineering Rules */}
                  <div className="pt-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-[11px] leading-relaxed">
                    
                    {/* Definition */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        {isFr ? 'Définition Technique' : 'Technical Scope'}
                      </span>
                      <p className="text-slate-300">
                        {isFr ? config.description_fr : config.description_en}
                      </p>
                    </div>

                    {/* Admissible Usage */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-emerald-400" />
                        <span>{isFr ? 'Usages Admis' : 'Admissible Usage'}</span>
                      </span>
                      <p className="text-slate-300">
                        {isFr ? tier.admissibleUsage_fr : tier.admissibleUsage_en}
                      </p>
                    </div>

                    {/* Restrictions & Concrete Example */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block flex items-center gap-1">
                          <Scale className="w-3 h-3 text-amber-400" />
                          <span>{isFr ? 'Restrictions / Précautions' : 'Restrictions'}</span>
                        </span>
                        <p className="text-slate-300">
                          {isFr ? tier.restrictions_fr : tier.restrictions_en}
                        </p>
                      </div>

                      <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-cyan-300">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">
                          {isFr ? 'Exemple Concret EPEDE :' : 'Concrete Example:'}
                        </span>
                        {isFr ? tier.concreteExample_fr : tier.concreteExample_en}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Regulatory Responsibility Statement */}
        <div className="p-3.5 sm:p-4 bg-[#0B0F13] border-t border-slate-800 text-[11px] font-sans text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="leading-tight text-[10.5px]">
              {isFr
                ? 'Règle d\'or EPEDE : Tout calcul critique de dimensionnement ou de consignation doit obligatoirement être validé par un ingénieur habilité.'
                : 'EPEDE Rule of Gold: All critical sizing calculations and LOTO electrical isolations must be peer-reviewed by an authorized licensed engineer.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer shrink-0"
          >
            {isFr ? 'Compris' : 'Acknowledge'}
          </button>
        </div>

      </div>
    </div>
  );
};
