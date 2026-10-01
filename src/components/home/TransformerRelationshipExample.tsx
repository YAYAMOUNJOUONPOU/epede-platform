// src/components/home/TransformerRelationshipExample.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  Fan, 
  Sliders, 
  Anchor, 
  ShieldCheck, 
  Radio, 
  Wrench, 
  BookOpen, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface TransformerRelationshipExampleProps {
  locale: 'fr' | 'en';
  onNavigateEquipment: (id: string) => void;
  onNavigateStandard: (ref: string) => void;
}

interface RelationshipNode {
  id: string;
  nameFr: string;
  nameEn: string;
  categoryFr: string;
  categoryEn: string;
  roleFr: string;
  roleEn: string;
  formulaOrNorm: string;
  icon: string;
}

const NODES: RelationshipNode[] = [
  {
    id: 'hv-busbar',
    nameFr: 'Jeu de Barres 225 kV',
    nameEn: '225 kV HV Busbar',
    categoryFr: 'Raccordement Haute Tension',
    categoryEn: 'HV Physical Incomer',
    roleFr: 'Alimente les traversées HT du transformateur via le sectionneur et le disjoncteur de travée.',
    roleEn: 'Feeds transformer HV bushings via bay disconnector and SF6 circuit breaker.',
    formulaOrNorm: 'I_nom = S / (√3 · U) = 63 MVA / (√3 · 225 kV) = 161.7 A',
    icon: '⚡',
  },
  {
    id: 'cts',
    nameFr: 'Transformateurs de Courant (TC)',
    nameEn: 'Current Transformers (CT)',
    categoryFr: 'Instrumentation & Mesure',
    categoryEn: 'Measurement Transducers',
    roleFr: 'Mesurent les courants primaires (225 kV) et secondaires (30 kV) pour alimenter la protection différentielle.',
    roleEn: 'Scale primary and secondary currents down to 1 A / 5 A inputs for 87T differential protection relays.',
    formulaOrNorm: 'Classe 5P20 / Classe 0.2S (CEI 61869-2)',
    icon: '🧭',
  },
  {
    id: 'vts',
    nameFr: 'Transformateurs de Tension (TT)',
    nameEn: 'Voltage Transformers (VT)',
    categoryFr: 'Mesure & Synchronisation',
    categoryEn: 'Voltage Measurement',
    roleFr: 'Mesurent la tension pour la régulation sous charge OLTC, les protections de surtension et la mesure d\'énergie.',
    roleEn: 'Deliver 100 V / √3 secondary voltage to automatic voltage regulator (AVR) and metering instruments.',
    formulaOrNorm: 'U_sec = 100 V / √3 (CEI 61869-3)',
    icon: '📐',
  },
  {
    id: 'diff-87t',
    nameFr: 'Protection Différentielle 87T',
    nameEn: 'Transformer Differential (87T)',
    categoryFr: 'Protection Unitaire',
    categoryEn: 'Unit Protection',
    roleFr: 'Compare instantanément les courants entrants et sortants pour déclencher en < 30 ms en cas de court-circuit interne.',
    roleEn: 'Compares vector sum of currents entering and leaving the transformer to trip in < 30 ms on internal winding faults.',
    formulaOrNorm: 'I_diff = |I_prim + I_sec| > k · I_retenue + I_seuil',
    icon: '🛡️',
  },
  {
    id: 'cooling-onan',
    nameFr: 'Refroidissement ONAN / ONAF',
    nameEn: 'Cooling System (ONAN/ONAF)',
    categoryFr: 'Thermique & Dissipation',
    categoryEn: 'Thermal Dissipation',
    roleFr: 'Évacue les pertes fer (P_0) et les pertes cuivre (P_k) par circulation naturelle ou forcée d\'huile et ventilateurs.',
    roleEn: 'Dissipates no-load iron losses and copper I²R load losses via radiators and motorized forced-air fans.',
    formulaOrNorm: 'Δθ_huile ≤ 60 K, Δθ_enroulement ≤ 65 K (CEI 60076-2)',
    icon: '❄️',
  },
  {
    id: 'oltc',
    nameFr: 'Régleur sous Charge (OLTC)',
    nameEn: 'On-Load Tap Changer (OLTC)',
    categoryFr: 'Contrôle de Tension',
    categoryEn: 'Voltage Regulation',
    roleFr: 'Modifie le rapport de transformation (ex: ±9 x 1.5%) sous pleine charge pour maintenir 30 kV stable.',
    roleEn: 'Adjusts winding turns ratio under load to maintain constant secondary 30 kV busbar voltage.',
    formulaOrNorm: 'Plage : ±13.5% en 17 échelons (CEI 60214-1)',
    icon: '🎛️',
  },
  {
    id: 'neutral-earthing',
    nameFr: 'Mise à la Terre du Neutre',
    nameEn: 'Neutral Grounding Resistor',
    categoryFr: 'Sécurité & Réseau',
    categoryEn: 'Neutral Regimes',
    roleFr: 'Limite le courant de défaut phase-terre côté 30 kV à 300 A ou 1000 A pour protéger les câbles et éviter les surtensions.',
    roleEn: 'Limits single phase-to-ground fault current on 30 kV side to 300 A or 1000 A to prevent dangerous step voltages.',
    formulaOrNorm: 'R_neutre = V_phase / I_limite = (30 000 / √3) / 300 A ≈ 57.7 Ω',
    icon: '⚓',
  },
  {
    id: 'surge-arresters',
    nameFr: 'Parafoudres Haute Tension',
    nameEn: 'Surge Arresters (ZnO)',
    categoryFr: 'Coordination de l\'Isolement',
    categoryEn: 'Insulation Coordination',
    roleFr: 'Écrêtent les ondes de choc de foudre atmosphérique et les surtensions de manœuvre pour protéger les isolants.',
    roleEn: 'Clamp lightning impulses and switching surges below the basic lightning impulse insulation level (BIL).',
    formulaOrNorm: 'BIL 225 kV = 1050 kVcrête (CEI 60099-4)',
    icon: '⚡',
  },
  {
    id: 'dc-trip',
    nameFr: 'Alimentation 110 V DC & Déclenchement',
    nameEn: 'DC Auxiliary & Trip Circuit',
    categoryFr: 'Auxiliaires Sécurisés',
    categoryEn: 'Emergency Power',
    roleFr: 'Fournit l\'énergie secourue par batterie d\'accumulateurs pour alimenter les bobines de déclenchement des disjoncteurs.',
    roleEn: 'Guarantees uninterruptible 110 V DC power from station battery bank to trip breakers even during blackout.',
    formulaOrNorm: 'Autonomie 10 h à 72 h (Batterie plomb étanche ou Ni-Cd)',
    icon: '🔋',
  },
  {
    id: 'iec-61850',
    nameFr: 'Automatismes CEI 61850',
    nameEn: 'IEC 61850 Station Bus',
    categoryFr: 'Numérique & Protocoles',
    categoryEn: 'Digital Substation',
    roleFr: 'Transmet les alarmes (Buchholz, thermostat) et les ordres de déclenchement par messages ultra-rapides GOOSE.',
    roleEn: 'Transmits Buchholz relay trips, temperature alarms, and interlocking states via peer-to-peer GOOSE messages.',
    formulaOrNorm: 'Temps de transit GOOSE Classe P1 : t ≤ 3 ms',
    icon: '📡',
  },
  {
    id: 'dga-oil',
    nameFr: 'Analyse des Gaz Dissous (DGA)',
    nameEn: 'Dissolved Gas Analysis (DGA)',
    categoryFr: 'Maintenance Prévisionnelle',
    categoryEn: 'Predictive Health',
    roleFr: 'Détecte les amorçages internes et surchauffes par chromatographie des gaz : H2, CH4, C2H4, C2H2, CO.',
    roleEn: 'Identifies incipient internal arcing, partial discharges, and hot spots using dissolved gas ratios in transformer oil.',
    formulaOrNorm: 'Méthode des triangles de Duval / CEI 60599',
    icon: '🧪',
  },
  {
    id: 'standards-roles',
    nameFr: 'Normes CEI 60076 & Métiers',
    nameEn: 'Standards & Engineering Roles',
    categoryFr: 'Ingénierie & Conformité',
    categoryEn: 'Governance & Roles',
    roleFr: 'Définit les règles d\'échauffement, diélectriques, essais en court-circuit et qualifications d\'ingénieurs poste.',
    roleEn: 'Governs design tolerances, insulation levels, routine/type tests, and commissioning roles.',
    formulaOrNorm: 'CEI 60076 (Parties 1 à 8) / CIGRE WG A2',
    icon: '📜',
  }
];

export const TransformerRelationshipExample: React.FC<TransformerRelationshipExampleProps> = ({
  locale,
  onNavigateEquipment,
  onNavigateStandard,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('diff-87t');
  const activeNode = NODES.find((n) => n.id === selectedNodeId) || NODES[3];

  return (
    <section 
      id="transformer-relationship-ecosystem" 
      aria-label="One Object, Many Engineering Relationships"
      className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-10 space-y-8 shadow-xs"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-500">
            {locale === 'fr' 
              ? 'COMMENT LE SYSTÈME CONNECTE LA CONNAISSANCE' 
              : 'HOW EPEDE CONNECTS ENGINEERING KNOWLEDGE'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
          {locale === 'fr' 
            ? 'Un équipement. De multiples relations d’ingénierie.' 
            : 'One object. Many engineering relationships.'}
        </h3>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {locale === 'fr'
            ? 'Prenez un transformateur 63 MVA 225/30 kV. Dans un manuel ordinaire, vous lisez une définition isolée. Dans EPEDE, vous visualisez l\'écosystème d\'ingénierie complet auquel il est lié.'
            : 'Take a 63 MVA 225/30 kV power transformer. In a traditional textbook, you read a static definition. In EPEDE, you interact with the complete interconnected engineering ecosystem around it.'}
        </p>
      </div>

      {/* Main Interactive Diagram Layout: Centerpiece + 12 Surrounding Nodes */}
      <div className="space-y-6">
        
        {/* Centerpiece Banner */}
        <div className="p-6 rounded-2xl bg-white border-2 border-amber-400/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-800 uppercase px-2 py-0.5 rounded bg-amber-100">
                  {locale === 'fr' ? 'ÉQUIPEMENT CENTRAL' : 'CENTERPIECE ASSET'}
                </span>
                <span className="font-mono text-xs text-slate-500">TAG: TR-225-30-63MVA</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-sans mt-1">
                {locale === 'fr' 
                  ? 'Transformateur de Puissance 63 MVA · 225 kV / 30 kV' 
                  : 'Power Transformer 63 MVA · 225 kV / 30 kV'}
              </h4>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Couplage YNd11 · Fréquence 50.00 Hz · Huile Minérale · Régleur OLTC ±9 positions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateEquipment('eq-exp-sub-trafo-225-30')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <span>{locale === 'fr' ? 'Voir Fiche Appareillage' : 'Inspect Equipment'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 12 Surrounding Relationship Nodes Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="font-bold uppercase">
              {locale === 'fr' ? '12 Nœuds d\'Interconnexion Technique :' : '12 Interconnected Engineering Nodes:'}
            </span>
            <span>{locale === 'fr' ? 'Cliquez pour analyser l\'interaction' : 'Click to analyze interaction'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {NODES.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group active:scale-[0.98] ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{node.icon}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-amber-600 text-amber-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isSelected ? 'ACTIF' : 'RELATION'}
                    </span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase block truncate font-semibold ${
                      isSelected ? 'text-amber-100' : 'text-slate-400'
                    }`}>
                      {locale === 'fr' ? node.categoryFr : node.categoryEn}
                    </span>
                    <h5 className={`font-sans font-bold text-xs mt-0.5 leading-snug line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-amber-800'
                    }`}>
                      {locale === 'fr' ? node.nameFr : node.nameEn}
                    </h5>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Relationship Deep Dive Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeNode.icon}</span>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-800 uppercase">
                  {locale === 'fr' ? activeNode.categoryFr : activeNode.categoryEn}
                </span>
                <h4 className="text-lg font-bold text-slate-900 font-sans">
                  {locale === 'fr' ? activeNode.nameFr : activeNode.nameEn}
                </h4>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
              {activeNode.formulaOrNorm}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            
            {/* Column 1: Interaction Explanation */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">
                {locale === 'fr' ? 'POURQUOI CETTE RELATION EST CRITIQUE' : 'WHY THIS INTERACTION IS CRITICAL'}
              </span>
              <p className="text-slate-800 font-sans text-sm leading-relaxed">
                {locale === 'fr' ? activeNode.roleFr : activeNode.roleEn}
              </p>
            </div>

            {/* Column 2: Formulations / Normative Link */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">
                {locale === 'fr' ? 'CADRE NORMATIF & RÈGLES' : 'NORMATIVE FRAMEWORK'}
              </span>
              <p className="text-slate-900 font-mono text-xs font-bold">
                {activeNode.formulaOrNorm}
              </p>
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC 60076')}
                className="text-xs font-mono font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 pt-1"
              >
                <span>{locale === 'fr' ? 'Consulter CEI 60076' : 'View IEC 60076'}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
