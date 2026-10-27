// src/components/laboratory/LaboratoryView.tsx
// EPEDE - Unified Advanced Engineering Laboratory Hub
// Consolidates all interactive simulations, studios, and workbenches in one portal

import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Flame, 
  Gauge, 
  Globe, 
  Waves, 
  Zap, 
  Sliders, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { SldTopologyType } from '../diagrams/modules/SldHeaderToolbar';

interface LaboratoryViewProps {
  locale: 'fr' | 'en';
  onNavigateSimulation: (tab?: SimulationTabType) => void;
  onNavigateDiagrams: (topology?: SldTopologyType) => void;
  onNavigateHydropower: () => void;
  onNavigateProtection: () => void;
  onNavigateEcosystem: () => void;
  onNavigateAssetManagement: () => void;
}

interface LabModule {
  id: string;
  category: 'grid' | 'sld' | 'protection' | 'hydro' | 'diagnostic';
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon: any;
  badge: string;
  standardRef: string;
  action: () => void;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  locale,
  onNavigateSimulation,
  onNavigateDiagrams,
  onNavigateHydropower,
  onNavigateProtection,
  onNavigateEcosystem,
  onNavigateAssetManagement,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'grid' | 'sld' | 'protection' | 'hydro' | 'diagnostic'>('all');

  const modules: LabModule[] = [
    {
      id: 'transient-stability',
      category: 'grid',
      titleFr: 'Simulateur de Stabilité Transitoire & RoCoF',
      titleEn: 'Transient Stability & RoCoF Simulator',
      descFr: 'Résolution dynamique de l\'équation de balancement (Swing Equation), oscillations de fréquence et réponse inertielle sous perte de groupe 420 MW.',
      descEn: 'Dynamic swing equation numerical solution, frequency nadir, and synthetic inertia response upon 420 MW generation loss.',
      icon: Activity,
      badge: 'STABILITÉ DYNAMIQUE',
      standardRef: 'ENTSO-E / IEEE 1547',
      action: () => onNavigateSimulation('transient-stability'),
    },
    {
      id: 'generator-capability',
      category: 'grid',
      titleFr: 'Diagramme P-Q & Limites de Capabilité Alternateur',
      titleEn: 'Alternator P-Q Capability & Stability Limits',
      descFr: 'Tracé interactif des limites thermiques rotor/stator, angle limite de stabilité interne δ = 90° et sous-excitation pour groupe Songloulou 57.6 MVA.',
      descEn: 'Interactive P-Q operating chart, rotor/stator thermal limits, under-excitation stability threshold, and Songloulou 57.6 MVA curve.',
      icon: Gauge,
      badge: 'CAPABILITÉ P-Q',
      standardRef: 'CEI 60034-1',
      action: () => onNavigateSimulation('generator-capability'),
    },
    {
      id: 'interactive-sld',
      category: 'sld',
      titleFr: 'Studio Schéma Unifilaire SLD 225/30 kV Interactif',
      titleEn: '225/30 kV Interactive Single-Line Diagram Studio',
      descFr: 'Manœuvre interactive des disjoncteurs, sectionneurs d\'aiguillage, verrouillages de sécurité LOTO et calcul en temps réel de transit de puissance.',
      descEn: 'Interactive switching of breakers, busbar disconnectors, LOTO interlocks, and real-time power flow state calculation.',
      icon: Zap,
      badge: 'STUDIO SLD',
      standardRef: 'CEI 61936-1 / CEI 62271',
      action: () => onNavigateDiagrams('double_bus'),
    },
    {
      id: 'protection-coordination',
      category: 'protection',
      titleFr: 'Banc de Coordination des Protections & Courbes TCC',
      titleEn: 'Protection Coordination & TCC Curves Workbench',
      descFr: 'Superposition des courbes à temps inverse CEI (SI, VI, EI) pour 3 paliers amont/aval avec calcul de la marge chronométrique Δt ≥ 250 ms.',
      descEn: 'Superposition of IEC inverse-time curves (SI, VI, EI) across 3 coordination tiers with automated Δt ≥ 250 ms grading verification.',
      icon: ShieldCheck,
      badge: 'SÉLECTIVITÉ TCC',
      standardRef: 'CEI 60255-151 / IEEE 242',
      action: () => onNavigateProtection(),
    },
    {
      id: 'ferranti-lab',
      category: 'grid',
      titleFr: 'Simulateur Effet Ferranti & Réactances Shunt',
      titleEn: 'Ferranti Effect & Shunt Reactor Simulator',
      descFr: 'Calcul de la montée en tension en bout de ligne 225 kV à vide et dimensionnement des réactances de compensation réactive shunt.',
      descEn: 'Calculates voltage rise along 225 kV unloaded transmission corridor and sizes inductive shunt compensation reactors.',
      icon: Globe,
      badge: 'SURTENSIONS HTB',
      standardRef: 'CIGRE TB 575',
      action: () => onNavigateSimulation('ferranti'),
    },
    {
      id: 'ct-saturation-lab',
      category: 'protection',
      titleFr: 'Banc de Saturation Transitoire TC & Tension Vk',
      titleEn: 'CT Saturation & Knee-Point Voltage Vk Lab',
      descFr: 'Simulation de la composante apériodique continue du courant de court-circuit, facteur de surdimensionnement transitoire Kssc et courbe d\'aimantation.',
      descEn: 'Simulates DC offset decaying exponential component, transient dimensioning factor Kssc, and B-H magnetization knee-point voltage.',
      icon: Sliders,
      badge: 'TRANSFORMATEURS TC',
      standardRef: 'CEI 61869-2',
      action: () => onNavigateSimulation('ct-saturation'),
    },
    {
      id: 'hydropower-cascade',
      category: 'hydro',
      titleFr: 'Station d\'Ingénierie Hydroélectrique de la Sanaga',
      titleEn: 'Sanaga Hydropower Cascade Engineering Station',
      descFr: 'Bilan hydrologique du bassin versant de la Sanaga : réservoir de Lom Pangar (6 milliards m³), usines de Nachtigal (420 MW), Songloulou et Edéa.',
      descEn: 'Comprehensive hydrological model of the Sanaga river basin: Lom Pangar reservoir (6 billion m³), Nachtigal (420 MW), Songloulou and Edéa cascades.',
      icon: Waves,
      badge: 'CASCADE HYDRO',
      standardRef: 'CEI 60041 / IEEE C37.102',
      action: () => onNavigateHydropower(),
    },
    {
      id: 'dga-ai-workbench',
      category: 'diagnostic',
      titleFr: 'Diagnostic Prédictif IA & Triangles de Duval (DGA)',
      titleEn: 'AI Predictive Diagnostics & Duval Triangles (DGA)',
      descFr: 'Analyse chromatographique des gaz dissous dans l\'huile des transformateurs 225 kV. Classification automatique des défauts thermiques et arcs selon Duval 1/4/5.',
      descEn: 'Transformer oil dissolved gas chromatography analysis. Automated fault classification (arcing, partial discharges, thermal overheating) per Duval 1/4/5.',
      icon: Sparkles,
      badge: 'IA PRÉDICTIVE',
      standardRef: 'CEI 60599 / IEEE C57.104',
      action: () => onNavigateAssetManagement(),
    },
    {
      id: 'ecosystem-3d',
      category: 'sld',
      titleFr: 'Explorateur 3D de l\'Écosystème Électrique',
      titleEn: '3D Electrical Energy Ecosystem Explorer',
      descFr: 'Visualisation spatiale interactive de la chaîne de transport, des postes de transformation, des réseaux de distribution et des flux énergétiques.',
      descEn: 'Interactive 3D spatial visualization of transmission corridors, substations, distribution networks, and cyber-physical energy flows.',
      icon: Compass,
      badge: 'JUMEAU 3D',
      standardRef: 'IEC 61970 / CIM',
      action: () => onNavigateEcosystem(),
    },
  ];

  const filteredModules = modules.filter(
    (m) => activeCategory === 'all' || m.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B131D] to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1.5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span className="uppercase tracking-widest font-bold">
                {locale === 'fr' ? 'LABORATOIRE VIRTUEL D\'INGÉNIERIE RÉSEAU' : 'VIRTUAL POWER SYSTEM LAB'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {locale === 'fr' ? 'Laboratoire & Ateliers de Simulation' : 'Engineering Laboratory & Workbenches'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Portail centralisé regroupant l\'ensemble des bancs de simulation dynamique, studios de schémas unifilaires, analyseurs de protection et outils de diagnostic prédictif de la plateforme EPEDE.'
                : 'Centralized portal gathering all dynamic simulation workbenches, single-line diagram studios, protection analyzers, and AI diagnostic engines across the EPEDE platform.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 font-mono text-xs text-cyan-300 font-bold">
              {modules.length} {locale === 'fr' ? 'Ateliers Disponibles' : 'Active Workbenches'}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto mt-6 pt-5 border-t border-slate-800 scrollbar-none">
          {[
            { id: 'all', labelFr: 'Tous les Ateliers', labelEn: 'All Workbenches' },
            { id: 'grid', labelFr: 'Stabilité & Réseau HTB', labelEn: 'Grid & Stability' },
            { id: 'sld', labelFr: 'Schémas SLD & Postes', labelEn: 'SLD & Substations' },
            { id: 'protection', labelFr: 'Protections & Relais', labelEn: 'Relay Protection' },
            { id: 'hydro', labelFr: 'Hydroélectricité & Bassin', labelEn: 'Hydropower Cascade' },
            { id: 'diagnostic', labelFr: 'Diagnostic Prédictif IA', labelEn: 'AI Diagnostics' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border cursor-pointer select-none ${
                activeCategory === cat.id
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-sm ring-1 ring-cyan-400/20'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {locale === 'fr' ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Workbenches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {mod.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {mod.standardRef}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {locale === 'fr' ? mod.titleFr : mod.titleEn}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-3">
                  {locale === 'fr' ? mod.descFr : mod.descEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {locale === 'fr' ? 'Prêt à l\'emploi' : 'Interactive Lab'}
                </span>
                <button
                  type="button"
                  onClick={mod.action}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-mono text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer group-hover:bg-cyan-600 group-hover:text-white"
                >
                  <span>{locale === 'fr' ? 'Lancer l\'Atelier' : 'Open Lab'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
