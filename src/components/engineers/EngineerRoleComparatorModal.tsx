// src/components/engineers/EngineerRoleComparatorModal.tsx
import React, { useState } from 'react';
import { X, Scale, CheckCircle2, ChevronDown, Layers, Laptop, Wrench, Shield, TrendingUp } from 'lucide-react';

export interface RoleComparisonData {
  id: string;
  nameFr: string;
  domainName: string;
  fieldRatio: number; // e.g. 60%
  officeRatio: number; // e.g. 40%
  category: 'Conception' | 'Exploitation' | 'Protection & Essais' | 'Chantier & Travaux' | 'Automatisme';
  keySoftware: string[];
  ansiCodes: string[];
  keyStandards: string[];
  primaryMission: string;
  criticalChallenge: string;
  cameroonContext: string;
  careerEvolution: string;
}

export const PRESET_ROLES_TO_COMPARE: RoleComparisonData[] = [
  {
    id: 'prot-reseau',
    nameFr: 'Ingénieur Protection & Relayage (Transport)',
    domainName: 'Transport Haute Tension',
    fieldRatio: 45,
    officeRatio: 55,
    category: 'Protection & Essais',
    keySoftware: ['OMICRON Test Universe', 'ETAP', 'DIgSILENT', 'Siemens DIGSI 5'],
    ansiCodes: ['87L', '21', '67/67N', '50/51', '79 RAR'],
    keyStandards: ['IEC 60255', 'IEEE C37.90', 'IEC 61850'],
    primaryMission: 'Régler, modéliser et tester les relais de protection pour éliminer les défauts polyphasés en < 60 ms sans déclenchement intempestif.',
    criticalChallenge: 'Coordination sélective sur lignes mixtes (aérien/câble) et détection des défauts résistants à la terre avec forte impédance d’arc.',
    cameroonContext: 'Postes d’interconnexion 225 kV SONATREL (Mangombé, Oyomabang, Bekoko, Logbaba).',
    careerEvolution: 'Expert National Protection Réseau → Responsable Dispatching National → Chef Département Études Réseau.',
  },
  {
    id: 'dispatch-ems',
    nameFr: 'Ingénieur Dispatcher / Conduite Réseau',
    domainName: 'Transport Haute Tension',
    fieldRatio: 10,
    officeRatio: 90,
    category: 'Exploitation',
    keySoftware: ['SCADA / EMS', 'PowerFactory', 'State Estimator (SE)', 'Contingency Analysis (N-1)'],
    ansiCodes: ['81U/81O', '25 Synchro', '59/27'],
    keyStandards: ['Code de Réseau SONATREL', 'IEEE 399'],
    primaryMission: 'Maintenir la stabilité temps réel tension/fréquence (50 Hz ± 0.2 Hz) et arbitrer le plan de production en régime N-1.',
    criticalChallenge: 'Gestion des effondrements de tension lors de déclenchements d’artères 225 kV et redémarrage Black-Start du RIS.',
    cameroonContext: 'Centre National de Conduite (Dispatching) SONATREL à Yaoundé (Mangombé secours).',
    careerEvolution: 'Chef de Quart Dispatching → Directeur Exploitation Réseau de Transport → Direction Générale.',
  },
  {
    id: 'be-bt',
    nameFr: 'Ingénieur Bureau d’Études BT (Bâtiment)',
    domainName: 'Bâtiments & Installations',
    fieldRatio: 25,
    officeRatio: 75,
    category: 'Conception',
    keySoftware: ['Caneco BT', 'AutoCAD Electrical', 'DIALux Evo', 'Revit MEP (BIM)'],
    ansiCodes: ['50/51', '49', '51G'],
    keyStandards: ['NFC 15-100', 'IEC 60364', 'NFC 13-100'],
    primaryMission: 'Concevoir l’architecture électrique BT : dimensionner les câbles (chute de tension, Ik3/Ik1), calculer le TGBT et assurer la sélectivité.',
    criticalChallenge: 'Garantir la sécurité des personnes (contact indirect), optimiser les sections de cuivre face aux coûts et équilibrer les charges triphasées.',
    cameroonContext: 'Tours de bureaux à Bonanjo, Douala Grand Mall, Hôpitaux régionaux.',
    careerEvolution: 'Chef de Projet Électricité Bâtiment → Directeur Technique BE / MOE → Expert Conseil Indépendant.',
  },
  {
    id: 'auto-industriel',
    nameFr: 'Ingénieur Automatisme & VFD (Industrie)',
    domainName: 'Industrie & Automatismes',
    fieldRatio: 65,
    officeRatio: 35,
    category: 'Automatisme',
    keySoftware: ['TIA Portal Siemens', 'Schneider EcoStruxure', 'Wonderware InTouch', 'Drive Composer ABB'],
    ansiCodes: ['49 Moteur', '51', '66 Démarrages', '27 Sous-tension'],
    keyStandards: ['IEC 61131-3', 'IEC 61800', 'IEC 61439-2'],
    primaryMission: 'Automatiser les lignes de production, programmer les automates (PLC), paramétrer les variateurs de fréquence et superviser via SCADA.',
    criticalChallenge: 'Gérer les perturbations harmoniques (THDi) générées par les VFD et dépanner en urgence sans arrêter la production d’usine.',
    cameroonContext: 'Cimenteries de Bonabéri (Dangote, Cimencam), Brasseries SABC, huileries de palme.',
    careerEvolution: 'Responsable Automatisme Usine → Chef de Maintenance Usine → Directeur Industriel.',
  },
  {
    id: 'turbinier-hydro',
    nameFr: 'Ingénieur Mécanique / Turbinier Hydro',
    domainName: 'Production d’Énergie',
    fieldRatio: 75,
    officeRatio: 25,
    category: 'Exploitation',
    keySoftware: ['SolidWorks', 'ANSYS CFX (Mécanique des fluides)', 'Systèmes de vibration Bently Nevada'],
    ansiCodes: ['12 Survitesse', '38 Paliers', '40'],
    keyStandards: ['IEC 60193', 'IEC 61362', 'ISO 10816'],
    primaryMission: 'Superviser l’état mécanique des turbines hydroélectriques (Francis, Kaplan, Pelton), réguler les débits d’eau et prévenir la cavitation.',
    criticalChallenge: 'Usure abrasive des aubes par les sédiments fluviaux de la Sanaga et gestion des coups de bélier en fermeture rapide.',
    cameroonContext: 'Centrales hydroélectriques de Songloulou (384 MW) et d’Edéa (276 MW).',
    careerEvolution: 'Chef de Centrale Hydroélectrique → Directeur de la Production Hydraulique.',
  },
  {
    id: 'exploitation-distrib',
    nameFr: 'Ingénieur Exploitation Réseau Distribution',
    domainName: 'Distribution Moyenne Tension',
    fieldRatio: 70,
    officeRatio: 30,
    category: 'Exploitation',
    keySoftware: ['CYMDIST', 'GIS Géographique', 'DMS / SCADA Distribution'],
    ansiCodes: ['50/51', '67N Terre', '79 Recloser'],
    keyStandards: ['NFC 13-100', 'IEC 60076-11'],
    primaryMission: 'Piloter les départs HTA urbains et ruraux, superviser les réenclencheurs aériens et coordonner les équipes d’intervention d’urgence.',
    criticalChallenge: 'Réduire le SAIDI / SAIFI face aux chutes d’arbres pendant les orages et localiser rapidement les défauts de câble souterrain.',
    cameroonContext: 'Agences d’exploitation Eneo Douala Nord, Douala Sud, Yaoundé et régions de l’Ouest.',
    careerEvolution: 'Délégué Régional Distribution → Directeur Distribution National.',
  },
];

interface EngineerRoleComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
}

export const EngineerRoleComparatorModal: React.FC<EngineerRoleComparatorModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const [role1Id, setRole1Id] = useState<string>('prot-reseau');
  const [role2Id, setRole2Id] = useState<string>('dispatch-ems');

  if (!isOpen) return null;

  const role1 = PRESET_ROLES_TO_COMPARE.find((r) => r.id === role1Id) || PRESET_ROLES_TO_COMPARE[0];
  const role2 = PRESET_ROLES_TO_COMPARE.find((r) => r.id === role2Id) || PRESET_ROLES_TO_COMPARE[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c1322] border border-white/20 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080d18]">
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-[#e8a825]" />
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white font-sans">
                {locale === 'fr' ? 'Comparateur des Spécialités d’Ingénieurs' : 'Engineer Specializations Comparator'}
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                {locale === 'fr' ? 'Analyse croisée : missions, outils, standards et réalité de terrain' : 'Side-by-side analysis: duties, tools, standards and field reality'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body with Comparative Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Role 1 Selector */}
            <div className="bg-[#111a2d] border border-amber-500/30 rounded-xl p-3">
              <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-1">
                {locale === 'fr' ? 'Ingénieur A' : 'Engineer A'}
              </label>
              <select
                value={role1Id}
                onChange={(e) => setRole1Id(e.target.value)}
                className="w-full bg-[#090e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-amber-400"
              >
                {PRESET_ROLES_TO_COMPARE.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === role2Id}>
                    {r.nameFr} ({r.domainName})
                  </option>
                ))}
              </select>
            </div>

            {/* Role 2 Selector */}
            <div className="bg-[#111a2d] border border-sky-500/30 rounded-xl p-3">
              <label className="block text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold mb-1">
                {locale === 'fr' ? 'Ingénieur B' : 'Engineer B'}
              </label>
              <select
                value={role2Id}
                onChange={(e) => setRole2Id(e.target.value)}
                className="w-full bg-[#090e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-sky-400"
              >
                {PRESET_ROLES_TO_COMPARE.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === role1Id}>
                    {r.nameFr} ({r.domainName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-4">
            
            {/* 1. Field vs Office Split Bar */}
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4">
              <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-3 font-bold flex items-center justify-between">
                <span>{locale === 'fr' ? 'Répartition Terrain vs Bureau' : 'Field vs Office Balance'}</span>
                <span className="text-[10px] text-slate-500">Chantier (Orange) / Études (Bleu)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">{role1.fieldRatio}% Terrain</span>
                    <span className="text-sky-400 font-bold">{role1.officeRatio}% Bureau</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-amber-500" style={{ width: `${role1.fieldRatio}%` }} />
                    <div className="h-full bg-sky-500" style={{ width: `${role1.officeRatio}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">{role2.fieldRatio}% Terrain</span>
                    <span className="text-sky-400 font-bold">{role2.officeRatio}% Bureau</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-amber-500" style={{ width: `${role2.fieldRatio}%` }} />
                    <div className="h-full bg-sky-500" style={{ width: `${role2.officeRatio}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Primary Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a] border border-amber-500/20 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Mission Principale
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {role1.primaryMission}
                </p>
              </div>

              <div className="bg-[#0f172a] border border-sky-500/20 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-sky-400 uppercase font-bold tracking-wider">
                  Mission Principale
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {role2.primaryMission}
                </p>
              </div>
            </div>

            {/* 3. Key Software & Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-amber-400" />
                  <span>Logiciels &amp; Outils Majeurs</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role1.keySoftware.map((sw, i) => (
                    <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-sky-400" />
                  <span>Logiciels &amp; Outils Majeurs</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role2.keySoftware.map((sw, i) => (
                    <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. ANSI Codes & Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-purple-400" />
                  <span>Codes ANSI &amp; Normes Clés</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role1.ansiCodes.map((code, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                      ANSI {code}
                    </span>
                  ))}
                  {role1.keyStandards.map((std, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-purple-400" />
                  <span>Codes ANSI &amp; Normes Clés</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role2.ansiCodes.map((code, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                      ANSI {code}
                    </span>
                  ))}
                  {role2.keyStandards.map((std, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Cameroon Field Context & Career Evolution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                  Terrain Cameroun &amp; Évolution
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-white">Contexte :</strong> {role1.cameroonContext}
                </p>
                <p className="text-xs text-amber-400/90 font-mono pt-1">
                  <strong>Carrière :</strong> {role1.careerEvolution}
                </p>
              </div>

              <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                  Terrain Cameroun &amp; Évolution
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-white">Contexte :</strong> {role2.cameroonContext}
                </p>
                <p className="text-xs text-sky-400/90 font-mono pt-1">
                  <strong>Carrière :</strong> {role2.careerEvolution}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#080d18] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>ElectroCopilot · Matrice Comparative Métiers Électrotechniques</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
