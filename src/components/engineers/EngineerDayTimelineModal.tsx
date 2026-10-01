// src/components/engineers/EngineerDayTimelineModal.tsx
import React, { useState } from 'react';
import { X, Clock, MapPin, CheckCircle2, AlertTriangle, Shield, Cpu, Award } from 'lucide-react';

interface TimelineStep {
  time: string;
  title: string;
  category: 'Sécurité / Consignation' | 'Mesure / Diagnostic' | 'Coordination' | 'Intervention Technique' | 'Clôture';
  badgeColor: string;
  description: string;
  toolOrStandard: string;
}

interface PersonaDay {
  id: string;
  roleTitle: string;
  location: string;
  gridAsset: string;
  authorQuote: string;
  steps: TimelineStep[];
}

const PERSONA_DAYS: PersonaDay[] = [
  {
    id: 'hydro-songloulou',
    roleTitle: 'Ingénieur d’Exploitation Centrale Hydroélectrique',
    location: 'Centrale Hydro de Songloulou (384 MW, Fleuve Sanaga)',
    gridAsset: '8 Groupes Francis 48 MW · Évacuation 225 kV',
    authorQuote: '« En centrale hydraulique, un bruit de cavitation ou une hausse de 3°C sur un palier turbine se repèrent avant que le SCADA ne siffle. »',
    steps: [
      {
        time: '07h30',
        title: 'Passation de Consigne & Relevé des Niveaux de Retenue',
        category: 'Coordination',
        badgeColor: '#3b82f6',
        description: 'Vérification de la cote amont du barrage, débit turbiné (m³/s) et état d’indisponibilité des 8 groupes. Analyse des journaux d’alarmes de nuit.',
        toolOrStandard: 'SCADA Central · Relevés Piézométriques',
      },
      {
        time: '09h00',
        title: 'Inspection Acoustique & Thermographique en Salle des Machines',
        category: 'Mesure / Diagnostic',
        badgeColor: '#a855f7',
        description: 'Tournée d’inspection des paliers alternateur, surveillance du débit d’huile de graissage et mesure de vibration crête-à-crête sur l’arbre.',
        toolOrStandard: 'Caméra Thermique FLIR · Accéléromètre Bently Nevada',
      },
      {
        time: '11h15',
        title: 'Validation de Consignation pour Maintenance Vanne de Tête',
        category: 'Sécurité / Consignation',
        badgeColor: '#ef4444',
        description: 'Application de la procédure de cadenassage LOTO (Lockout/Tagout). Fermeture vanne papillon, verrouillage mécanique et vérification d’absence de pression résiduelle.',
        toolOrStandard: 'Norme C18-510 / Procédure Eneo LOTO',
      },
      {
        time: '14h00',
        title: 'Supervision de la Prise de Charge Pente Rapide avec le Dispatching',
        category: 'Intervention Technique',
        badgeColor: '#e8a825',
        description: 'Coordination téléphonique avec le dispatching SONATREL. Montée en puissance du Groupe 4 de 20 MW à 45 MW pour compenser la pointe industrielle de Douala.',
        toolOrStandard: 'Régulateur de Vitesse WoodWard · Liaison Télécom',
      },
      {
        time: '16h30',
        title: 'Compte-Rendu Journalier & Analyse Hydro-Énergétique',
        category: 'Clôture',
        badgeColor: '#22c55e',
        description: 'Calcul du productible MWh de la journée, rendement global de chute et planification des interventions de dégrillage de nuit.',
        toolOrStandard: 'GMAO SAP PM · Rapport de Conduite',
      },
    ],
  },
  {
    id: 'prot-mangombe',
    roleTitle: 'Ingénieur Protection & Relayage Poste 225 kV',
    location: 'Poste d’Interconnexion SONATREL Mangombé (Edéa)',
    gridAsset: 'Poste 225/90/30 kV · Nœud vital du Réseau Interconnecté Sud',
    authorQuote: '« Un relais de protection est la ceinture de sécurité du réseau : s’il déclenche à tort, on noie la ville dans le noir ; s’il ne déclenche pas, le transformateur explose. »',
    steps: [
      {
        time: '08h00',
        title: 'Briefing Sécurité & Analyse des Risques Électriques HTB',
        category: 'Sécurité / Consignation',
        badgeColor: '#ef4444',
        description: 'Contrôle du périmètre de sécurité, vérification des distances d’approche sous 225 kV (DLVS > 3.0 m) et mise à la terre des équipements adjacents.',
        toolOrStandard: 'NF C 18-510 HTB · Équipements EPI Classe 4',
      },
      {
        time: '09h30',
        title: 'Raccordement de la Valise d’Injection Secondaire Triphasée',
        category: 'Mesure / Diagnostic',
        badgeColor: '#a855f7',
        description: 'Isolement des circuits TC (courant) par blocs d’essais SecuTest (court-circuitage impératif pour éviter l’arc mortel d’ouverture TC). Connexion au relais différentiel 87T.',
        toolOrStandard: 'OMICRON CMC 356 · Câblage blindé',
      },
      {
        time: '11h30',
        title: 'Tracé de la Pente Différentielle & Test de Retenue Harmonique H2',
        category: 'Intervention Technique',
        badgeColor: '#e8a825',
        description: 'Injection de courants combinés fondamental 50 Hz + 100 Hz (H2) pour vérifier le non-déclenchement lors de la magnétisation du transformateur 63 MVA.',
        toolOrStandard: 'Test Universe · Relais Siemens SIPROTEC 7UT86',
      },
      {
        time: '14h30',
        title: 'Analyse Oscilloperturbographique d’un Déclenchement Récent',
        category: 'Mesure / Diagnostic',
        badgeColor: '#3b82f6',
        description: 'Téléchargement des fichiers COMTRADE via liaison Ethernet. Diagnostic : coup de foudre sur phase A à 18.4 km du poste avec réenclenchement monophasé réussi en 800 ms.',
        toolOrStandard: 'Logiciel SIGRA · Norme IEEE C37.111 COMTRADE',
      },
      {
        time: '17h00',
        title: 'Validation du PV d’Essais FAT/SAT & Signature de Conformance',
        category: 'Clôture',
        badgeColor: '#22c55e',
        description: 'Génération du rapport d’étalonnage horodaté, remise en service des circuits de déclenchement (Trip Coils 1 & 2) et validation avec le chef de poste.',
        toolOrStandard: 'Procès-Verbal SAT · Signature Agréée',
      },
    ],
  },
  {
    id: 'be-grandmall',
    roleTitle: 'Ingénieur Bureau d’Études BT & Chantier',
    location: 'Chantier Tertiaire (Complexe Commercial & Bureaux, Douala)',
    gridAsset: 'Poste Livraison HTA 2x1600 kVA · TGBT Forme 4b · Groupe 1000 kVA',
    authorQuote: '« Sur le plan, un câble fait 3 cm ; sur le chantier, passer 4 x 240 mm² cuivre dans un faux-plafond encombré de gaines de ventilation demande de la rigueur mathématique. »',
    steps: [
      {
        time: '08h00',
        title: 'Visite de Chantier & Recolement des Réservations Béton',
        category: 'Intervention Technique',
        badgeColor: '#e8a825',
        description: 'Vérification du passage des chemins de câbles en gaine technique et conformité des rayons de courbure des câbles d’alimentation principale.',
        toolOrStandard: 'Plan AutoCAD MEP · Mètre Laser Leica',
      },
      {
        time: '10h30',
        title: 'Vérification de la Sélectivité Chronométrique sur Caneco BT',
        category: 'Mesure / Diagnostic',
        badgeColor: '#3b82f6',
        description: 'Ajustement des déclencheurs électroniques Micrologic : seuils court-retard Isd et temporisation tsd pour assurer le déclenchement en aval sans impacter le TGBT.',
        toolOrStandard: 'Caneco BT · Courbes Temps-Courant IEC 60947-2',
      },
      {
        time: '13h30',
        title: 'Contrôle des Liaisons Équipotentielles & Boucle de Fond de Fouille',
        category: 'Sécurité / Consignation',
        badgeColor: '#ef4444',
        description: 'Mesure de résistance de prise de terre au telluromètre (objectif < 1 Ω pour poste HTA et informatique). Continuité des conducteurs de protection PE.',
        toolOrStandard: 'Telluromètre Chauvin Arnoux · NFC 15-100',
      },
      {
        time: '15h30',
        title: 'Essai en Charge de l’Inverseur Normal-Secours (GE 1000 kVA)',
        category: 'Intervention Technique',
        badgeColor: '#e8a825',
        description: 'Simulation de perte secteur HTA : basculement automatique vers le groupe électrogène en moins de 12 secondes avec réamorçage séquentiel des départs moteurs.',
        toolOrStandard: 'Automate ATS Socomec · Analyseur Réseau Fluke 435',
      },
      {
        time: '17h30',
        title: 'Mise à Jour des Plans TQC (Tel Que Construit) & VISA Bureau de Contrôle',
        category: 'Clôture',
        badgeColor: '#22c55e',
        description: 'Intégration des modifications sur plan as-built et levée des réserves formulées par le bureau de contrôle technique (Apave/Bureau Veritas).',
        toolOrStandard: 'Revit MEP / PDF annoté · Visa Technique',
      },
    ],
  },
];

interface EngineerDayTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
}

export const EngineerDayTimelineModal: React.FC<EngineerDayTimelineModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('hydro-songloulou');

  if (!isOpen) return null;

  const currentPersona = PERSONA_DAYS.find((p) => p.id === selectedPersonaId) || PERSONA_DAYS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1220] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070c17]">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-[#e8a825]" />
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white font-sans">
                {locale === 'fr' ? 'Une Journée Type sur le Terrain' : 'A Typical Day in the Field'}
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                {locale === 'fr' ? 'Chronique heure par heure des défis réels d’un ingénieur électrotechnicien' : 'Hour-by-hour account of real electrical engineering challenges'}
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

        {/* Persona Switcher Tabs */}
        <div className="bg-[#0f172a] px-6 py-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {PERSONA_DAYS.map((p) => {
            const isSelected = p.id === selectedPersonaId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersonaId(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#e8a825] text-black shadow-lg shadow-[#e8a825]/20'
                    : 'bg-black/30 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {p.roleTitle.split('(')[0]}
              </button>
            );
          })}
        </div>

        {/* Content Body with Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Persona Header Card */}
          <div className="bg-[#111a2d] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] text-[#e8a825] uppercase tracking-wider font-bold">
                  Poste &amp; Responsabilité
                </span>
                <h4 className="text-base sm:text-lg font-black text-white font-sans">
                  {currentPersona.roleTitle}
                </h4>
              </div>
              <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5 self-start sm:self-auto bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>{currentPersona.location}</span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              <strong className="text-slate-200">Installation :</strong> {currentPersona.gridAsset}
            </div>

            <p className="text-xs sm:text-sm italic text-amber-200/90 font-serif border-l-2 border-[#e8a825] pl-3 py-1">
              {currentPersona.authorQuote}
            </p>
          </div>

          {/* Timeline Sequence */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
            {currentPersona.steps.map((step, idx) => (
              <div key={idx} className="relative group">
                
                {/* Timeline Dot */}
                <div 
                  className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-[#0b1220] shadow-md flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{ backgroundColor: step.badgeColor }}
                />

                {/* Card */}
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-2 hover:border-white/20 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-white bg-black/50 px-2 py-0.5 rounded border border-white/10">
                        {step.time}
                      </span>
                      <span className="text-sm font-bold text-white font-sans">
                        {step.title}
                      </span>
                    </div>

                    <span 
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${step.badgeColor}22`,
                        color: step.badgeColor 
                      }}
                    >
                      {step.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {step.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-amber-400">Outil / Référentiel :</span>
                    <span className="text-slate-200">{step.toolOrStandard}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#070c17] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>ElectroCopilot · Retours d’Expérience de Terrain (Cameroon &amp; International)</span>
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
