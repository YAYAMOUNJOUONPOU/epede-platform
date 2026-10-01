// src/components/visual/EngineeringLayersExploration.tsx
import React, { useState } from 'react';
import {
  Zap,
  Network,
  Cpu,
  Calculator,
  Server,
  BookOpen,
  ArrowDown,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

export interface EngineeringLayersExplorationProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onNavigateSection?: (section: string) => void;
}

interface LayerDefinition {
  layerNumber: number;
  layerId: 'ENERGY' | 'SYSTEM' | 'EQUIPMENT' | 'ENGINEERING' | 'DIGITAL' | 'KNOWLEDGE';
  nameFr: string;
  nameEn: string;
  icon: any;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  subtitleFr: string;
  subtitleEn: string;
  detailsFr: string;
  detailsEn: string;
  keyAssets: string[];
}

export const EngineeringLayersExploration: React.FC<EngineeringLayersExplorationProps> = ({
  domainCode,
  locale,
  onNavigateSection,
}) => {
  const [activeLayer, setActiveLayer] = useState<string>('ENERGY');

  const LAYERS: LayerDefinition[] = [
    {
      layerNumber: 1,
      layerId: 'ENERGY',
      nameFr: 'Niveau 1 : Couche Énergie & Conversion Physique',
      nameEn: 'Layer 1 : Energy & Physical Conversion',
      icon: Zap,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      subtitleFr: 'Source primaire, conversion d\'énergie et flux d\'électrons',
      subtitleEn: 'Primary energy resource, conversion physics and electron flow',
      detailsFr: 'Transformation de l\'énergie hydraulique, thermique, solaire ou éolienne en énergie électrique triphasée synchrone. Équilibre dynamique P-f (puissance active - fréquence) et Q-V (puissance réactive - tension).',
      detailsEn: 'Conversion of hydro, thermal, solar or wind into synchronous three-phase electrical energy. Dynamic P-f (frequency) and Q-V (voltage) system balance.',
      keyAssets: ['Chute hydraulique', 'Rayonnement solaire', 'Alternateur synchrone', 'Réseau triphasé 50 Hz'],
    },
    {
      layerNumber: 2,
      layerId: 'SYSTEM',
      nameFr: 'Niveau 2 : Couche Système & Topologie Réseau',
      nameEn: 'Layer 2 : System & Grid Topology',
      icon: Network,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/10',
      subtitleFr: 'Topologie unifilaire, étages de tension et interconnexions',
      subtitleEn: 'Single-line topology, voltage tiers and transmission corridors',
      detailsFr: 'Organisation spatiale et électrique : Postes d\'évacuation 225 kV, réseaux de grand transport interconnectés, artères de répartition 90 kV, dorsales de distribution 30 kV et réseaux de desserte BT 400 V.',
      detailsEn: 'Spatial and topological layout: 225 kV bulk substations, high-voltage interconnections, 90 kV sub-transmission, 30 kV distribution feeders and 400 V LV customer networks.',
      keyAssets: ['Jeux de barres doubles', 'Lignes 225 kV', 'Postes AIS/GIS', 'Schéma unifilaire SLD'],
    },
    {
      layerNumber: 3,
      layerId: 'EQUIPMENT',
      nameFr: 'Niveau 3 : Couche Appareillage & Matériel Électrique',
      nameEn: 'Layer 3 : Electrical Equipment & Physical Assets',
      icon: Cpu,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      subtitleFr: 'Transformateurs, disjoncteurs, sectionneurs, câbles et cellules',
      subtitleEn: 'Power transformers, breakers, disconnectors, cables and switchgear',
      detailsFr: 'Composants physiques de forte puissance conçus pour supporter les contraintes diélectriques (choc de foudre BIL), thermiques (échauffement nominal) et électrodynamiques (court-circuit 40 kA).',
      detailsEn: 'Heavy power apparatus engineered to withstand dielectric stresses (lightning BIL), continuous thermal rise and electrodynamic short-circuit forces (40 kA).',
      keyAssets: ['Transfo 40 MVA', 'Disjoncteur SF6', 'TC/TT de mesure', 'Cellules métalliques HTA'],
    },
    {
      layerNumber: 4,
      layerId: 'ENGINEERING',
      nameFr: 'Niveau 4 : Couche Ingénierie, Calculs & Physique',
      nameEn: 'Layer 4 : Engineering Physics, Sizing & Studies',
      icon: Calculator,
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-500/10',
      subtitleFr: 'Courts-circuits, plan de protection, chute de tension et stabilité',
      subtitleEn: 'Short-circuit analysis, protection coordination and stability',
      detailsFr: 'Modélisation mathématique du réseau : Calcul des courants de court-circuit symétriques et dissymétriques selon CEI 60909, étude d\'écoulement de charge (Load Flow), coordination sélective ampèremétrique et chronométrique.',
      detailsEn: 'Mathematical system modeling: IEC 60909 short-circuit calculation, Newton-Raphson load flow, thermal cable sizing, and protection discrimination curves.',
      keyAssets: ['CEI 60909 (Ik")', 'Courbes sélectivité', 'Bilan de puissances', 'Stabilité transitoire'],
    },
    {
      layerNumber: 5,
      layerId: 'DIGITAL',
      nameFr: 'Niveau 5 : Couche Numérique, SCADA & Contrôle-Commande',
      nameEn: 'Layer 5 : Digital Systems, SCADA & Substation LAN',
      icon: Server,
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-500/10',
      subtitleFr: 'Relais numériques (IED), CEI 61850 GOOSE/MMS, RTU et téléconduite',
      subtitleEn: 'Protective IEDs, IEC 61850 GOOSE/MMS, RTUs and SCADA telecontrol',
      detailsFr: 'Infrastructure d\'automatisation et de communication : Réseau Ethernet optique durci en anneau (RSTP/PRP), calculateurs de tranche (BCU), trames GOOSE sub-millisecondes et transmission vers le Dispatching National.',
      detailsEn: 'Substation automation infrastructure: Ruggedized fiber Ethernet ring (RSTP/PRP), Bay Control Units (BCU), peer-to-peer GOOSE trips and IEC 60870-5-104 dispatching links.',
      keyAssets: ['Relais ANSI 87T/50/51', 'Bus de poste CEI 61850', 'Superviseur SCADA', 'RTU téléconduite'],
    },
    {
      layerNumber: 6,
      layerId: 'KNOWLEDGE',
      nameFr: 'Niveau 6 : Couche Connaissances, Normes & Cycle de Vie',
      nameEn: 'Layer 6 : Knowledge, Standards & Asset Lifecycle',
      icon: BookOpen,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-500/10',
      subtitleFr: 'Normes internationales CEI/IEEE, habilitation électrique et maintenance',
      subtitleEn: 'International IEC/IEEE standards, electrical safety and commissioning',
      detailsFr: 'Cadre réglementaire et humain : Normes de conception CEI 61936 / NF C 13-200, procédures d\'accès et de consignation NFC 18-510, essais de mise en service (FAT/SAT), maintenance prédictive et rôles métier.',
      detailsEn: 'Regulatory and governance framework: Design codes IEC 61936, lock-out/tag-out safety rules, factory & site acceptance testing (FAT/SAT), lifecycle asset management and engineering roles.',
      keyAssets: ['Normes CEI / IEEE', 'Habilitation NFC 18-510', 'Essais FAT / SAT', 'Ingénieurs & Techniciens'],
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#0A0E17] text-slate-100 overflow-hidden shadow-2xl font-mono">
      
      {/* Top Header */}
      <div className="bg-[#050810] border-b border-slate-800 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            ARCHITECTURE DES 6 COUCHES SYSTÈMES EPEDE
          </span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-slate-400 text-xs">{domainCode}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
          {locale === 'fr'
            ? 'Relations Verticales Fondamentales : De l\'Énergie Physique aux Normes & Métiers'
            : 'Fundamental Vertical Relationship: From Physical Energy to Standards & Roles'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-4xl leading-relaxed">
          {locale === 'fr'
            ? 'Toute installation électrique obéit à un empilement vertical continu. Chaque niveau dépend mécaniquement, électriquement ou logiquement du niveau précédent.'
            : 'Every electrical installation is structured in a continuous vertical pipeline. Each tier directly depends on the physics, equipment and signals of the preceding tier.'}
        </p>
      </div>

      {/* Vertical Pipeline Cards */}
      <div className="p-4 sm:p-6 space-y-3 bg-[#080D1A]">
        {LAYERS.map((layer, index) => {
          const Icon = layer.icon;
          const isSelected = activeLayer === layer.layerId;
          return (
            <React.Fragment key={layer.layerId}>
              <div
                onClick={() => setActiveLayer(layer.layerId)}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${layer.borderColor} ${layer.bgColor} shadow-lg ring-1 ring-cyan-400/30`
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-slate-950 border border-slate-800 ${layer.accentColor} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${layer.accentColor}`}>
                          NIVEAU 0{layer.layerNumber} · {layer.layerId}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-sans mt-0.5">
                        {locale === 'fr' ? layer.nameFr : layer.nameEn}
                      </h4>
                      <div className="text-xs text-slate-400 font-sans mt-0.5">
                        {locale === 'fr' ? layer.subtitleFr : layer.subtitleEn}
                      </div>
                    </div>
                  </div>

                  {/* Key Assets Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {layer.keyAssets.map((asset, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 font-mono"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 font-sans leading-relaxed">
                    {locale === 'fr' ? layer.detailsFr : layer.detailsEn}
                  </div>
                )}
              </div>

              {/* Connecting Down Arrow between layers */}
              {index < LAYERS.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                    <ArrowDown className="h-3.5 w-3.5 text-slate-500 animate-bounce" />
                    <span>ALIMENTE &amp; CONDITIONNE</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
