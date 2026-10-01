// src/components/domain/AdvancedAiDomainView.tsx
import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Cloud, 
  BarChart3, 
  Zap, 
  BatteryCharging, 
  HelpCircle, 
  Eye, 
  Terminal, 
  Radio, 
  Server, 
  Globe2, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  Award,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  ChevronRight,
  FileCheck,
  Search,
  BookOpen
} from 'lucide-react';

interface AdvancedAiDomainViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
}

type TabType = 'connaissances' | 'applications' | 'iot' | 'simulateurs' | 'normes' | 'competences' | 'afrique';

export const AdvancedAiDomainView: React.FC<AdvancedAiDomainViewProps> = ({
  locale,
  onNavigateStandard,
  onNavigateRole
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('connaissances');

  const tabs: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
    { id: 'connaissances', labelFr: 'A. Connaissances Clés', labelEn: 'A. Core Concepts', icon: '🧠' },
    { id: 'applications', labelFr: 'B. Applications IA Électrique', labelEn: 'B. Electrical AI Apps', icon: '⚡' },
    { id: 'iot', labelFr: 'C. IoT & Données', labelEn: 'C. IIoT & Telemetry', icon: '📡' },
    { id: 'simulateurs', labelFr: 'D. Simulateurs & Calculs IA', labelEn: 'D. AI Simulators & Tools', icon: '📐' },
    { id: 'normes', labelFr: 'E. Normes & Standards', labelEn: 'E. Standards', icon: '📋' },
    { id: 'competences', labelFr: 'F. Compétences & Matrice', labelEn: 'F. Skills Matrix', icon: '🎯' },
    { id: 'afrique', labelFr: 'G. IA & Afrique 2030', labelEn: 'G. Africa 2030 Roadmap', icon: '🌍' }
  ];

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans" id="advanced-ai-domain-view">
      
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#080d1f] via-[#0d1030] to-[#080815] border-b-4 border-[#6366f1] rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-[#6366f1]/[0.05] pointer-events-none select-none font-mono">
          D09
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#6366f1]/80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
              ElectroCopilot · Parcours Expert · Domaine 09 / 10
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
              Intelligence Artificielle &amp; <span className="text-[#a5b4fc]">Technologies Avancées</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#a5b4fc]/80 font-bold">
              IA Maintenance · Digital Twin · IoT Industriel · Cybersécurité OT · Cloud · Big Data · BESS LFP · ElectroCopilot IA
            </p>
          </div>

          <div className="self-start sm:self-auto flex flex-col items-start sm:items-end gap-2">
            <div className="bg-[#6366f1]/15 border border-[#6366f1]/40 text-[#a5b4fc] font-mono text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-sm">
              🚀 Technologies du Futur — Aujourd'hui
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              {locale === 'fr' ? 'Conforme IEC 62443 · NIST AI RMF · ISO 27001' : 'Compliant with IEC 62443 · NIST AI RMF · ISO 27001'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1.5 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB A: CONNAISSANCES CLES */}
      {activeTab === 'connaissances' && (
        <div className="space-y-6">
          <div className="bg-[#6366f1]/10 border-l-4 border-[#6366f1] border border-[#6366f1]/20 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-indigo-200 leading-relaxed">
            <strong className="text-[#a5b4fc] font-bold">🚀 Domaine Stratégique ElectroCopilot :</strong> L'IA en génie électrique n'est plus du futur — c'est le présent. Maintenance prédictive par vibration FFT, optimisation énergétique de pointe, jumeaux numériques d'usines, et diagnostic automatisé. Ce domaine positionne ElectroCopilot comme la référence d'ingénierie augmentée pour l'Afrique.
          </div>

          {/* 9 Know Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AiKnowledgeCard
              icon="🧠"
              title="IA & Machine Learning — Bases"
              color="#6366f1"
              items={[
                'ML supervisé : classification et régression pour anticiper les pannes sur données étiquetées',
                'ML non-supervisé : clustering et détection d\'anomalies (Isolation Forest, One-Class SVM)',
                'Deep Learning : réseaux convolutifs 1D (vibrations) et 2D (thermographie infrarouge)',
                'LLM & Agents : raisonnement technique, génération de schémas et orchestration d\'outils',
                'Computer Vision : YOLOv8 pour lecture de plaques signalétiques et conformité d\'armoires',
                'Time Series Analysis : LSTM et Prophet pour prévision de courbe de charge 24h/48h',
                'Reinforcement Learning : optimisation dynamique du stockage batterie et effacement de pointe'
              ]}
            />
            <AiKnowledgeCard
              icon="🔮"
              title="Digital Twin — Jumeau Numérique"
              color="#14b8a6"
              items={[
                'Représentation virtuelle dynamique synchronisée en temps réel avec l\'actif physique',
                'Échelons de maturité : DT1 (données pures), DT2 (modèle statique), DT3 (simulation continue), DT4 (pilotage autonome)',
                'Applications : simulation d\'écoulement de charge, transitoires de démarrage moteur, vieillissement d\'isolant',
                'Plateformes industrielles : Siemens MindSphere, GE Predix, Bentley iTwin, Ignition SCADA Cloud',
                'Chaîne de flux : capteurs IoT → Edge Gateway → Broker MQTT TLS → Modèle analytique → Alertes prédictives',
                'Gains documentés : baisse de 15% à 30% des arrêts imprévus sur turbogénérateurs et transformateurs HT',
                'Stratégie Afrique : MVP accessible via monitoring télémétrique + seuils dynamiques auto-ajustés'
              ]}
            />
            <AiKnowledgeCard
              icon="🛡️"
              title="Cybersécurité OT/ICS (IEC 62443)"
              color="#22c55e"
              items={[
                'Menaces critiques : ransomwares industriels, usurpation d\'ordres SCADA, altération de consignes PLC',
                'Architecture Purdue Model : segmentation stricte IT/OT par zone démilitarisée (DMZ) et double pare-feu',
                'Principe Zero Trust : ne faire confiance à aucun paquet réseau, micro-segmentation VLAN industrielle',
                'Norme IEC 62443 : modèle en zones, conduits et niveaux de sécurité cibles SL1 à SL4',
                'Cartographie des actifs : inventaire automatique et exhaustif de 100% des automates connectés',
                'Sondes de détection d\'anomalies réseau OT : Claroty, Dragos, Nozomi Networks avec analyse de trames Modbus',
                'Facteur humain : sensibilisation anti-phishing et interdiction formelle des clés USB non assainies'
              ]}
            />
            <AiKnowledgeCard
              icon="📊"
              title="Big Data & Analytics Énergie"
              color="#06b6d4"
              items={[
                'Grandeurs collectées : kWh, kVArh, I efficace, U phase-neutre, harmoniques THDu/THDi jusqu\'au rang 50',
                'Fréquences d\'échantillonnage : smart meters (15 min), capteurs de télémétrie (1s), transitoires (1 ms)',
                'Bases de données séries temporelles : TimescaleDB, InfluxDB, VictoriaMetrics pour millions d\'écritures/s',
                'Tableaux de bord opérationnels : Grafana (open source hautement adapté), Power BI, ThingsBoard',
                'Indicateurs clés : talon de consommation nocturne, facteur de puissance tan(φ), taux de charge transfo',
                'Détection de fraudes et fuites : détection d\'anomalies de comptage sur réseau de distribution',
                'Bénéfice direct : réduction de 10% à 25% des factures industrielles par élimination des pointes tarifaires'
              ]}
            />
            <AiKnowledgeCard
              icon="☁️"
              title="Cloud Computing & Edge Industriel"
              color="#3b82f6"
              items={[
                'IaaS & PaaS : conteneurs Docker/Kubernetes pour déploiement rapide de microservices industriels',
                'Edge Computing : traitement local sur passerelle durcie (filtrage FFT, détection seuils, buffer hors-ligne)',
                'Architecture Hybride résiliente : autonomie locale en cas de coupure Internet + synchronisation cloud dès reprise',
                'Protocoles légers IoT : MQTT avec QoS 1/2, Sparkplug B pour standardiser les métadonnées industrielles',
                'Latence et souveraineté : hébergement local des données de production stratégiques (on-premise / cloud souverain)',
                'Bande passante frugale : calcul en bordure (Edge AI) pour n\'envoyer dans le cloud que les alertes pertinentes',
                'Connectivité résiliente Afrique : basculement automatique fibre optique / 4G LTE / liaison satellite Starlink'
              ]}
            />
            <AiKnowledgeCard
              icon="⚡"
              title="Smart Grid & Énergie Intelligente"
              color="#a855f7"
              items={[
                'Smart Grid : boucle de distribution d\'énergie interconnectée avec flux bidirectionnels d\'électrons et d\'octets',
                'AMI (Advanced Metering Infrastructure) : compteurs communicants DLMS/COSEM avec télé-relève et télé-coupure',
                'Demand Response (DRMS) : effacement dynamique et rémunéré de charges lors des pics de tension sur le réseau',
                'Virtual Power Plant (VPP) : agrégation logicielle de toitures photovoltaïques, groupes électrogènes et batteries',
                'DERMS : système d\'orchestration pour intégrer les énergies renouvelables intermittentes sans instabilité',
                'Self-Healing Network : réenclenchement et aiguillage automatique des boucles Moyenne Tension en < 1 seconde',
                'Microgrids hybrides : gestion autonome des transitions réseau connecté / mode îloté pour sites industriels'
              ]}
            />
            <AiKnowledgeCard
              icon="🤖"
              title="ElectroCopilot — Architecture IA"
              color="#f97316"
              items={[
                'Moteur Déterministe + LLM : l\'IA comprend le langage naturel et appelle le moteur certifié sans halluciner',
                'RAG Normatif : injection rigoureuse des normes IEC 60364, NF C 15-100, IEEE C57 et catalogues constructeurs',
                'Vision par ordinateur : reconnaissance instantanée des plaques de moteurs, courbes de déclenchement disjoncteur',
                'Raisonnement par étapes (CoT) : explication pas à pas des choix de calibres, chutes de tension et court-circuit',
                'Adaptation au profil métier : du technicien de chantier (recherche de pannes) à l\'ingénieur d\'études (bilan)',
                'Mode Offline : modèles légers embarqués pour les interventions sur sites isolés non couverts par le réseau',
                'Contextualisation tropicale : prise en compte du détarage thermique 40°C-50°C et des contraintes réseau Eneo'
              ]}
            />
            <AiKnowledgeCard
              icon="🔋"
              title="Stockage d'Énergie BESS & LiFePO4"
              color="#e8a825"
              items={[
                'Chimie LiFePO4 (LFP) : sécurité thermique intrinsèque, aucune propagation d\'incendie, 4000 à 6000 cycles',
                'Comparatif LFP vs NMC : le LFP est l\'étalon-or pour le stockage stationnaire sous fortes chaleurs tropicales',
                'Batteries à flux Redox (Vanadium) : 20+ ans de durée de vie sans perte de capacité pour les centrales multi-MWh',
                'BMS intelligent : équilibrage actif des cellules, suivi d\'état de charge (SOC) et d\'état de santé (SOH)',
                'Onduleurs hybrides bidirectionnels : basculement réseau-secours en moins de 10 millisecondes (seamless UPS)',
                'Cas d\'usage PME Afrique : pack LFP 100 kWh + 50 kWc solaire = zéro coupure de production lors des délestages',
                'Seconde vie : réemploi des batteries de véhicules pour le stockage stationnaire à coût divisé par deux'
              ]}
            />
            <AiKnowledgeCard
              icon="⚠️"
              title="Éthique, Explicabilité & Risques"
              color="#ef4444"
              items={[
                'Principe Human-in-the-Loop : aucune consigne de disjonction ou de sécurité critique sans validation de l\'ingénieur',
                'Biais de modélisation : entraînement systématique sur les spécificités des réseaux émergents et climats chauds',
                'Explicabilité (XAI) : chaque résultat numérique doit être accompagné de la formule exacte et de la référence normative',
                'Sanctuarisation contre l\'hallucination : vérification croisée automatique par solveur d\'équations physiques',
                'Règle d\'or ElectroCopilot : L\'IA oriente et suggère, les algorithmes calculent, l\'ingénieur certifié valide et signe',
                'Responsabilité juridique : le tampon et la responsabilité décennale restent dévolus aux ingénieurs et bureaux d\'études',
                'Confidentialité industrielle : chiffrement de bout en bout et zéro entraînement sur les données privées des clients'
              ]}
            />
          </div>
        </div>
      )}

      {/* 4. TAB B: APPLICATIONS IA EN GENIE ELECTRIQUE */}
      {activeTab === 'applications' && (
        <ElectricalAiApplicationsSection />
      )}

      {/* 5. TAB C: IOT ET TELEMETRIE */}
      {activeTab === 'iot' && (
        <IiotAndTelemetrySection />
      )}

      {/* 6. TAB D: SIMULATEURS & CALCULS IA */}
      {activeTab === 'simulateurs' && (
        <AiSimulatorsSection locale={locale} />
      )}

      {/* 7. TAB E: NORMES ET STANDARDS */}
      {activeTab === 'normes' && (
        <StandardsSection onNavigateStandard={onNavigateStandard} />
      )}

      {/* 8. TAB F: COMPETENCES A DEVELOPPER */}
      {activeTab === 'competences' && (
        <SkillsMatrixSection />
      )}

      {/* 9. TAB G: IA & AFRIQUE 2030 */}
      {activeTab === 'afrique' && (
        <Africa2030Section />
      )}

      {/* 10. DOMAIN FOOTER */}
      <footer className="bg-gradient-to-r from-[#080d1f] via-[#0d1030] to-[#080d1f] border-t-2 border-[#6366f1] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <div className="text-[#a5b4fc] italic font-semibold">
          « L'IA amplifie l'ingénieur — elle ne le remplace jamais. »
        </div>
        <div className="text-slate-500 text-[10px] uppercase tracking-wider">
          ElectroCopilot · Domaine 09/10 · Intelligence Artificielle &amp; Technologies Avancées · Afrique 2030
        </div>
      </footer>

    </div>
  );
};

// ==========================================
// SUBCOMPONENTS
// ==========================================

interface AiKnowledgeCardProps {
  icon: string;
  title: string;
  color: string;
  items: string[];
}

const AiKnowledgeCard: React.FC<AiKnowledgeCardProps> = ({ icon, title, color, items }) => {
  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between shadow-lg">
      <div>
        <div className="p-3 bg-black/25 border-b border-white/10 flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <h3 
            className="font-mono text-xs font-bold uppercase tracking-wider truncate"
            style={{ color }}
          >
            {title}
          </h3>
        </div>
        <div className="p-4 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <span className="font-bold shrink-0 text-sm" style={{ color }}>›</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ELECTRICAL AI APPLICATIONS SECTION
// ==========================================
const ElectricalAiApplicationsSection: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<number>(0);

  const apps = [
    {
      id: 0,
      icon: '🔧',
      title: 'Maintenance Prédictive par IA',
      tagline: 'Vibrations FFT, analyse spectrale de courant MCSA et gaz dissous DGA',
      techs: ['FFT', 'MCSA', 'Random Forest', 'LSTM 1D', 'ISO 10816-3'],
      impact: 'Baisse de 30% à 50% des arrêts non planifiés en usine',
      description: 'L\'IA analyse en continu les signaux vibratoires des roulements, le spectre de courant des moteurs sous charge, et les concentrations de gaz combustibles dans l\'huile de transformateur HT pour détecter les défauts embryonnaires plusieurs semaines avant la rupture catastrophique.',
      workflow: [
        'Collecte accéléromètre piézoélectrique 3 axes (0-10 kHz)',
        'Transformation de Fourier rapide (FFT) calculée en bordure (Edge)',
        'Extraction des fréquences caractéristiques (BPFO, BPFI, BSF, FTF)',
        'Classification automatique par modèle Random Forest / CNN',
        'Calcul de la durée de vie utile résiduelle (RUL) et ordre de travail GMAO'
      ],
      caseStudy: 'Cimencam Figuil & Brasseries du Cameroun (Koumassi) : anticipation des avaries sur pompes de circulation eau glacée et concasseurs à mâchoires.'
    },
    {
      id: 1,
      icon: '⚡',
      title: 'Optimisation Énergétique & Peak Shaving',
      tagline: 'Arbitrage dynamique de charge et effacement de puissance souscrite',
      techs: ['Prophet', 'XGBoost', 'Deep Q-Learning', 'Modbus TCP', 'BESS Control'],
      impact: 'Économie de 15% à 25% sur la facture énergétique globale',
      description: 'Prédit la consommation électrique du site à 24h et 48h en fonction de l\'historique, du planning de production et de la météo. Déclenche automatiquement le délestage de charges non critiques ou l\'injection de batteries pour ne jamais dépasser la puissance souscrite Eneo.',
      workflow: [
        'Télé-relève 15 min des compteurs d\'énergie communicants TGBT',
        'Prévision de charge par algorithme gradient boosting (XGBoost)',
        'Détection d\'un risque de dépassement de puissance 45 min à l\'avance',
        'Démarrage autonome du pack de batteries BESS ou groupe secouru',
        'Écrêtage du pic sans perturber la chaîne de production'
      ],
      caseStudy: 'Complexe agro-industriel Douala Bassa : suppression de 4,2 MFCFA de pénalités mensuelles de dépassement de puissance souscrite.'
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Inspection Visuelle & Thermographie par Drone',
      tagline: 'Computer Vision pour thermographie infrarouge et reconnaissance OCR',
      techs: ['YOLOv8', 'ResNet-50', 'Vision-Language Models', 'Drones FLIR', 'OCR'],
      impact: 'Vitesse d\'inspection multipliée par 8 sur les lignes aériennes HT/MT',
      description: 'Les drones équipés de caméras thermiques et HD survolent les lignes électriques et postes de transformation. Les modèles de Computer Vision détectent automatiquement les échauffements sur les raccords, la corrosion des pylônes et l\'élagage nécessaire de la végétation.',
      workflow: [
        'Vol autonome de drone avec capteur thermique radiométrique',
        'Reconnaissance automatique des isolateurs en verre et pinces d\'ancrage',
        'Calcul automatique du delta thermique (ΔT > 15°C = alerte critique)',
        'Géolocalisation précise GPS RTK de chaque anomalie sur carte SIG',
        'Génération automatique du rapport d\'inspection technique'
      ],
      caseStudy: 'Ligne de transport 225 kV Edéa-Douala (SONATREL) : détection de 14 points chauds sur connecteurs avant fusion de câble.'
    },
    {
      id: 3,
      icon: '📐',
      title: 'Aide à la Conception & Bilans de Puissance IA',
      tagline: 'Extraction normative automatique et calcul certifié sans hallucination',
      techs: ['LLM Orchestration', 'RAG Normatif', 'IEC 60364-5-52', 'NF C 15-100', 'Python Engine'],
      impact: 'Temps de dimensionnement d\'un TGBT divisé par 5 avec zéro erreur de formule',
      description: 'L\'ingénieur décrit le projet en langage naturel (ex: "Alimenter un atelier d\'embouteillage de 180 kVA situé à 95m en câble cuivre enterré sous 40°C"). L\'IA identifie les contraintes, sélectionne les facteurs de correction et appelle le solveur pour délivrer la note de calcul.',
      workflow: [
        'Parsing du cahier des charges et extraction des paramètres électriques',
        'Recherche normatives vectorielle (RAG) dans les tableaux NF C 15-100',
        'Calcul des coefficients de pose k1, k2, k3 et facteur de température kt',
        'Dimensionnement thermique Iz et vérification de la chute de tension ΔU %',
        'Édition de la note de calcul conforme prête pour le bureau de contrôle'
      ],
      caseStudy: 'Cœur technologique d\'ElectroCopilot déployé auprès des bureaux d\'études et ingénieurs consultants en Afrique francophone.'
    },
    {
      id: 4,
      icon: '🌐',
      title: 'Smart Grid & Réseau Auto-Cicatrisant (Self-Healing)',
      tagline: 'Reconfiguration automatique de boucles HTA et détection de défauts',
      techs: ['IEC 61850 GOOSE', 'Self-Healing Algorithm', 'CIM IEC 61970', 'SCADA MT', 'FLISR'],
      impact: 'Réduction du temps moyen de coupure (SAIDI) de 65% sur les départs Moyenne Tension',
      description: 'En cas de défaut sur une ligne moyenne tension (mise à la terre, branche d\'arbre), les organes de manœuvre télécommandés (interrupteurs aériens IAT) communiquent en temps réel. Le système isole le tronçon en défaut et réalimente les abonnés sains en moins d\'une minute.',
      workflow: [
        'Détection du courant de court-circuit par les détecteurs de défauts communicants',
        'Émission de trames prioritaires IEC 61850 vers le superviseur SCADA',
        'Algorithme FLISR (Fault Location, Isolation and Service Restoration)',
        'Ouverture des interrupteurs encadrant le défaut et fermeture du bouclage secours',
        'Envoi des coordonnées GPS de l\'incident aux équipes d\'intervention'
      ],
      caseStudy: 'Projet pilote de modernisation du réseau de distribution 15 kV de Yaoundé Ouest : rétablissement de 70% des clients en 45 secondes.'
    },
    {
      id: 5,
      icon: '📚',
      title: 'Tuteur Pédagogique & Simulateur Virtuel de Pannes',
      tagline: 'Apprentissage adaptatif et entraînement sans risque pour techniciens',
      techs: ['Simulateur Canvas 2D', 'Diagnostic Guidé CoT', 'Électrotechnique Gamifiée', 'NLP'],
      impact: 'Montée en compétence 3x plus rapide sur les schémas de commande et dépannage',
      description: 'L\'IA génère des scénarios de pannes électriques réalistes (contacteur charbonné, disjoncteur différentiel déclenché par humidité, phase manquante sur variateur). L\'apprenant utilise des appareils de mesure virtuels (multimètre, pince) pour poser son diagnostic.',
      workflow: [
        'Génération aléatoire d\'un schéma électrique avec panne injectée',
        'L\'utilisateur place les pointes de touches et lit tension et résistance',
        'L\'assistant IA analyse les étapes de raisonnement de l\'apprenant',
        'Fourniture d\'indices méthodologiques sans donner la réponse brute',
        'Débriefing final avec rappel des règles de sécurité NF C 18-510'
      ],
      caseStudy: 'Formation des étudiants de l\'ENSPY (Polytechnique Yaoundé) et IUT de Douala sur simulateur ElectroCopilot.'
    }
  ];

  const curr = apps[selectedApp];

  return (
    <div className="space-y-6">
      {/* App selection cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {apps.map((app) => {
          const isSelected = selectedApp === app.id;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedApp(app.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#6366f1]/20 border-[#6366f1] shadow-lg shadow-[#6366f1]/20 text-white'
                  : 'bg-[#0f1829] border-white/10 hover:border-white/25 text-slate-300'
              }`}
            >
              <div>
                <div className="text-2xl mb-1.5">{app.icon}</div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider line-clamp-2">
                  {app.title}
                </div>
              </div>
              <div className="mt-2 text-[9px] font-mono text-[#a5b4fc]">
                {isSelected ? '● ACTIF' : '› Explorer'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected App Detailed Deep-Dive Card */}
      <div className="bg-[#0f1829] border border-[#6366f1]/30 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-2xl shrink-0">
              {curr.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">{curr.title}</h2>
              <p className="text-xs font-mono text-[#a5b4fc]">{curr.tagline}</p>
            </div>
          </div>
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg self-start md:self-auto">
            Impact : {curr.impact}
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {curr.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Workflow */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Chaîne de Traitement &amp; Workflow IA
            </div>
            <div className="space-y-2 text-xs text-slate-300 font-sans">
              {curr.workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack & Case Study */}
          <div className="space-y-4">
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2.5">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Technologies &amp; Algorithmes Clés
              </div>
              <div className="flex flex-wrap gap-1.5">
                {curr.techs.map((tech, i) => (
                  <span key={i} className="bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-[11px] px-2.5 py-1 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                Cas Réel d'Application au Cameroun
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {curr.caseStudy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// IIOT AND TELEMETRY SECTION
// ==========================================
const IiotAndTelemetrySection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-white/10 pb-2 flex items-center justify-between">
          <span>📡 Architecture IIoT Industrielle — De la Sonde Terrain au Tableau de Bord</span>
          <span className="text-[10px] text-slate-400">Purdue Model 4.0</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { 
              icon: '🔵', 
              name: 'Niveau 0-1 : Capteurs Intelligents', 
              protocol: 'Modbus RTU / 4-20mA / IO-Link',
              desc: 'Accéléromètres MEMS 3 axes sans fil, sondes de température PT100 à tête émettrice, pinces Rogowski communicantes, capteurs de pression acoustique. Autonomie pile 5 à 10 ans.' 
            },
            { 
              icon: '⚙️', 
              name: 'Niveau 2 : Edge Gateways Durcies', 
              protocol: 'Edge AI / OPC-UA / MQTT TLS',
              desc: 'Passerelles industrielles sans ventilateur (Advantech, Raspberry Pi CM4 durci, Siemens IOT2050). Prétraitement FFT, détection de seuils d\'urgence en local et buffer tampon sans coupure.' 
            },
            { 
              icon: '☁️', 
              name: 'Niveau 3-4 : Plateformes Cloud & Ingestion', 
              protocol: 'ThingsBoard / TimescaleDB / Kafka',
              desc: 'Brokers MQTT distribués, bases de données séries temporelles scalables (TimescaleDB/InfluxDB) et microservices d\'inférence Machine Learning hébergés sur cloud résilient.' 
            },
            { 
              icon: '📱', 
              name: 'Niveau 5 : Restitution & Supervision PWA', 
              protocol: 'Grafana / PWA / WebSockets',
              desc: 'Dashboards dynamiques sur tablette durcie et smartphone Android terrain. Notifications d\'alerte SMS et WhatsApp instantanées pour les chefs de quart lors d\'anomalies thermiques.' 
            }
          ].map((eq, i) => (
            <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-2 hover:border-indigo-500/40 transition-all">
              <div className="text-2xl">{eq.icon}</div>
              <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
              <div className="text-[10px] font-mono text-[#a5b4fc] bg-[#6366f1]/10 px-2 py-0.5 rounded border border-[#6366f1]/20 inline-block">
                {eq.protocol}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Matrix */}
      <div className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 bg-black/25 border-b border-white/10 font-mono text-xs font-bold uppercase tracking-wider text-teal-400">
          🌐 Matrice Comparatif des Protocoles IIoT — Climat &amp; Géographie d'Afrique
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-3">Technologie</th>
              <th className="p-3">Fréquence / Portée</th>
              <th className="p-3">Débit / Latence</th>
              <th className="p-3">Autonomie Pile</th>
              <th className="p-3">Cas d'Usage Idéal Cameroun</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {[
              {
                tech: 'LoRaWAN',
                band: '868 MHz (ISM) / 10-15 km',
                perf: '0.3 - 50 kbps / 1-5 s',
                battery: '8 à 10 ans sur pile Li-SOCl2',
                use: 'Surveillance des postes transformateurs HTA/BT isolés et compteurs d\'eau communaux.'
              },
              {
                tech: 'NB-IoT / LTE-M',
                band: 'Bandes cellulaires opérateurs / 5-10 km',
                perf: '60 - 250 kbps / 100-500 ms',
                battery: '5 à 8 ans selon fréquence',
                use: 'Compteurs communicants Eneo AMI, suivi des groupes électrogènes de chantiers.'
              },
              {
                tech: 'Modbus TCP / MQTT',
                band: 'Ethernet RJ45 ou WiFi industriel / 100m',
                perf: '100 Mbps - 1 Gbps / < 10 ms',
                battery: 'Alimentation 24V DC filaire',
                use: 'Intra-armoire TGBT, supervision continue des variateurs de vitesse et centrales de mesure.'
              },
              {
                tech: 'Satellite LEO (Starlink)',
                band: 'Bande Ku/Ka / Couverture continentale',
                perf: '50 - 220 Mbps / 25-45 ms',
                battery: 'Alimentation secourue 230V',
                use: 'Sites industriels enclavés : barrages hydroélectriques (Song Loulou, Lom Pangar), mines de l\'Est.'
              }
            ].map((p, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="p-3 font-mono font-bold text-white whitespace-nowrap">{p.tech}</td>
                <td className="p-3 text-slate-300 font-mono text-[11px]">{p.band}</td>
                <td className="p-3 text-slate-300 font-mono text-[11px]">{p.perf}</td>
                <td className="p-3 text-emerald-400 font-mono text-[11px]">{p.battery}</td>
                <td className="p-3 text-slate-400 text-xs leading-relaxed">{p.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// AI SIMULATORS SECTION (INTERACTIVE TOOLS)
// ==========================================
const AiSimulatorsSection: React.FC<{ locale: 'fr' | 'en' }> = ({ locale }) => {
  const [activeTool, setActiveTool] = useState<'vibration' | 'peak_shaving' | 'iiot_bandwidth' | 'bess_sizer' | 'cot_prompt'>('vibration');

  return (
    <div className="space-y-6">
      {/* Tool Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'vibration', label: '1. Diagnostic FFT & Moteurs', icon: '🔧' },
          { id: 'peak_shaving', label: '2. Écrêtage Peak Shaving', icon: '⚡' },
          { id: 'iiot_bandwidth', label: '3. Bande Passante IIoT', icon: '📡' },
          { id: 'bess_sizer', label: '4. Dimensionneur BESS', icon: '🔋' },
          { id: 'cot_prompt', label: '5. Assistant RAG ElectroCopilot', icon: '🤖' },
        ].map((tool) => {
          const isSelected = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id as any)}
              className={`p-3 rounded-xl border font-mono text-xs font-bold text-left transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#6366f1] text-white border-[#6366f1] shadow-lg shadow-[#6366f1]/25'
                  : 'bg-[#0f1829] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tool.icon}</span>
              <span className="truncate">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: VIBRATION & FFT DEFECT SIMULATOR */}
      {activeTool === 'vibration' && <VibrationSimulator />}

      {/* TOOL 2: PEAK SHAVING OPTIMIZER */}
      {activeTool === 'peak_shaving' && <PeakShavingOptimizer />}

      {/* TOOL 3: IIOT BANDWIDTH & BATTERY CALCULATOR */}
      {activeTool === 'iiot_bandwidth' && <IiotBandwidthCalculator />}

      {/* TOOL 4: BESS BATTERY STORAGE DIMENSIONER */}
      {activeTool === 'bess_sizer' && <BessStorageDimensioner />}

      {/* TOOL 5: ELECTROPILOT COT PROMPT & AUDIT SANDBOX */}
      {activeTool === 'cot_prompt' && <CotPromptSandbox />}
    </div>
  );
};

// -------------------------------------------------------------
// SIMULATOR 1: VIBRATION & FFT PREDICTIVE MAINTENANCE
// -------------------------------------------------------------
const VibrationSimulator: React.FC = () => {
  const [motorPower, setMotorPower] = useState<number>(75); // kW
  const [defectType, setDefectType] = useState<'healthy' | 'bpfo' | 'bpfi' | 'unbalance' | 'misalignment'>('bpfo');

  // Defect profiles
  const defectData = {
    healthy: {
      label: 'Sain — Aucun défaut',
      isoZone: 'Zone A (Bonne condition)',
      isoColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      vibrationRms: 1.2, // mm/s
      rulHours: 18000,
      confidence: 98.2,
      recommendation: 'Fonctionnement nominal. Prochaine analyse vibratoire systématique dans 3 mois selon planning.',
      spectrum: [15, 8, 4, 3, 2, 2, 1, 1, 1, 0.5]
    },
    bpfo: {
      label: 'Défaut Bague Externe Roulement (BPFO ~3.58x RPM)',
      isoZone: 'Zone C (Alerte / Action requise)',
      isoColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      vibrationRms: 4.8, // mm/s
      rulHours: 1200,
      confidence: 96.7,
      recommendation: 'Écaillage naissant sur la bague extérieure du roulement côté commande. Planifier le remplacement du roulement SKF 6314 lors du prochain arrêt hebdomadaire.',
      spectrum: [18, 12, 10, 48, 15, 8, 38, 12, 5, 2]
    },
    bpfi: {
      label: 'Défaut Bague Interne Roulement (BPFI ~5.42x RPM)',
      isoZone: 'Zone C (Alerte / Action requise)',
      isoColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      vibrationRms: 5.6, // mm/s
      rulHours: 650,
      confidence: 94.8,
      recommendation: 'Dégradation de la piste de roulement interne. Température de palier à surveiller (+8°C constatée). Graissage immédiat et commande de pièce de rechange.',
      spectrum: [20, 14, 12, 18, 55, 12, 22, 10, 6, 3]
    },
    unbalance: {
      label: 'Balourd Mécanique Masse Déséquilibrée (1x RPM)',
      isoZone: 'Zone D (Danger critique immédiat)',
      isoColor: 'text-red-400 bg-red-500/10 border-red-500/30',
      vibrationRms: 9.4, // mm/s
      rulHours: 96,
      confidence: 99.1,
      recommendation: 'Arrêt de sécurité recommandé. Pic prédominant à 1x fréquence de rotation (25 Hz pour 1500 tr/min). Nettoyage de la turbine d\'aspiration et équilibrage dynamique en atelier.',
      spectrum: [92, 14, 8, 6, 4, 3, 2, 2, 1, 1]
    },
    misalignment: {
      label: 'Désalignement d\'Accouplement Moteur-Pompe (2x RPM)',
      isoZone: 'Zone C (Alerte sévère)',
      isoColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      vibrationRms: 6.2, // mm/s
      rulHours: 350,
      confidence: 97.4,
      recommendation: 'Présence d\'harmoniques 2x et 3x de forte amplitude et déphasage axial de 180°. Réalignement au comparateur laser de l\'accouplement manchon élastique.',
      spectrum: [35, 78, 42, 10, 8, 5, 4, 3, 2, 1]
    }
  };

  const curr = defectData[defectType];

  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Simulateur FFT &amp; Diagnostic Prédictif de Moteur Industriel
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Conforme à la norme ISO 10816-3 (Vibrations des machines de 15 kW à 300 kW)
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30">
          IA Inference Engine : 1D-CNN + Random Forest
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Puissance du Moteur Asynchrone (kW) : <strong className="text-indigo-400">{motorPower} kW</strong>
            </label>
            <input
              type="range"
              min="15"
              max="250"
              step="5"
              value={motorPower}
              onChange={(e) => setMotorPower(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>15 kW (Pompe auxiliaire)</span>
              <span>75 kW (Standard)</span>
              <span>250 kW (Concasseur lourd)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Injection de Défaut à Simuler :
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'healthy', label: '1. Moteur Sain (État de Référence)' },
                { id: 'bpfo', label: '2. Bague Externe Roulement (BPFO)' },
                { id: 'bpfi', label: '3. Bague Interne Roulement (BPFI)' },
                { id: 'unbalance', label: '4. Balourd Mécanique Turbine (1x RPM)' },
                { id: 'misalignment', label: '5. Désalignement d\'Arbre (2x RPM)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDefectType(item.id as any)}
                  className={`p-2.5 rounded-lg text-xs font-mono text-left transition-all border ${
                    defectType === item.id
                      ? 'bg-[#6366f1]/20 border-[#6366f1] text-white font-bold'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FFT Spectrum Display & Diagnostic */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase">Spectre FFT Fréquentiel (0 - 500 Hz)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${curr.isoColor}`}>
                {curr.isoZone}
              </span>
            </div>

            {/* SVG FFT Spectrum Graph */}
            <div className="h-32 bg-slate-950/80 rounded-lg p-2 flex items-end justify-between gap-1 border border-white/5">
              {curr.spectrum.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      val > 40 ? 'bg-red-500' : val > 20 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-500">
                    {idx === 0 ? '1x' : idx === 1 ? '2x' : idx === 3 ? 'BPFO' : idx === 4 ? 'BPFI' : `${(idx+1)*50}Hz`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Output KPIs */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
            <div className="bg-white/5 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase">Vibration RMS</div>
              <div className="text-sm font-bold text-white">{curr.vibrationRms} mm/s</div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase">RUL Estimé</div>
              <div className="text-sm font-bold text-[#a5b4fc]">{curr.rulHours} h</div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase">Confiance IA</div>
              <div className="text-sm font-bold text-emerald-400">{curr.confidence}%</div>
            </div>
          </div>

          {/* Prescription Box */}
          <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg p-3 text-xs text-slate-200 leading-relaxed font-sans">
            <strong className="text-[#a5b4fc] font-bold font-mono">Prescription Automatisée : </strong>
            {curr.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SIMULATOR 2: PEAK SHAVING & DIGITAL TWIN OPTIMIZER
// -------------------------------------------------------------
const PeakShavingOptimizer: React.FC = () => {
  const [subscribedKva, setSubscribedKva] = useState<number>(250); // Eneo subscribed kVA
  const [peakDemandKva, setPeakDemandKva] = useState<number>(330); // Real unmanaged peak
  const [bessCapacityKwh, setBessCapacityKwh] = useState<number>(100); // Installed battery

  // Penalty cost per kVA excess in Cameroon (approx. 12 500 FCFA/kVA/month)
  const penaltyPerKva = 12500;
  const rawExcess = Math.max(0, peakDemandKva - subscribedKva);
  
  // Power shaved by battery (max discharge rate C-rate ~ 0.5 to 1C = ~ 60 kW)
  const maxDischargeKw = Math.min(80, bessCapacityKwh * 0.7);
  const remainingExcess = Math.max(0, rawExcess - maxDischargeKw);
  const avoidedExcess = rawExcess - remainingExcess;

  const monthlySavingsFcfa = avoidedExcess * penaltyPerKva;
  const annualSavingsFcfa = monthlySavingsFcfa * 12;

  // Approximate BESS investment cost (approx 150 000 FCFA / kWh LFP installed)
  const bessCapexFcfa = bessCapacityKwh * 150000;
  const paybackYears = monthlySavingsFcfa > 0 ? (bessCapexFcfa / annualSavingsFcfa).toFixed(1) : '∞';

  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Jumeau Numérique Énergétique : Optimisation de Pointe &amp; Peak Shaving BESS
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Modèle d'arbitrage de puissance souscrite et suppression des pénalités Eneo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Sliders */}
        <div className="space-y-4 bg-black/30 p-4 rounded-xl border border-white/10">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Puissance Souscrite Eneo :</span>
              <strong className="text-amber-400">{subscribedKva} kVA</strong>
            </div>
            <input
              type="range"
              min="100"
              max="630"
              step="10"
              value={subscribedKva}
              onChange={(e) => setSubscribedKva(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Pointe Maximale Usine :</span>
              <strong className="text-red-400">{peakDemandKva} kVA</strong>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="10"
              value={peakDemandKva}
              onChange={(e) => setPeakDemandKva(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Capacité Batterie LFP :</span>
              <strong className="text-emerald-400">{bessCapacityKwh} kWh</strong>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="10"
              value={bessCapacityKwh}
              onChange={(e) => setBessCapacityKwh(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* 24h Load Curve Visualization */}
        <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Profil de Charge 24h Simulé</span>
            <span className="text-[10px] text-emerald-400">Écrêtage Actif</span>
          </div>

          <div className="h-32 bg-slate-950/80 rounded-lg p-3 relative flex items-end justify-between border border-white/5">
            {/* Limit Line (Subscribed power) */}
            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400 z-10"
              style={{ bottom: `${(subscribedKva / 800) * 100}%` }}
            >
              <span className="absolute -top-3.5 right-2 text-[9px] font-mono text-amber-300 bg-black/60 px-1 rounded">
                Seuil Eneo ({subscribedKva} kVA)
              </span>
            </div>

            {/* Bars for 24h hours */}
            {[20, 22, 25, 28, 35, 55, 70, 85, 95, 88, 80, 75, 78, 82, 98, 92, 70, 60, 45, 35, 30, 25, 22, 20].map((h, i) => {
              const peakOver = (h / 100) * 800 > subscribedKva;
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className={`w-full rounded-t transition-all ${
                      peakOver
                        ? bessCapacityKwh > 50
                          ? 'bg-emerald-500/80'
                          : 'bg-red-500'
                        : 'bg-indigo-500/50'
                    }`}
                    style={{ height: `${(h / 100) * (peakDemandKva / 800) * 100}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>00h</span>
            <span>06h</span>
            <span>12h (Midi)</span>
            <span>18h (Pointe)</span>
            <span>23h</span>
          </div>
        </div>

        {/* Financial ROI KPIs */}
        <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
              Bilan Financier &amp; Gains Estimés
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-slate-400">Dépassement brut :</span>
                <span className="text-red-400 font-bold">{rawExcess.toFixed(0)} kVA</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-slate-400">Puissance écrêtée BESS :</span>
                <span className="text-emerald-400 font-bold">{avoidedExcess.toFixed(0)} kW</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-slate-400">Pénalités résiduelles :</span>
                <span className="text-slate-300">{remainingExcess.toFixed(0)} kVA</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-lg text-center space-y-1">
            <div className="text-[10px] uppercase font-mono text-emerald-300">Économies Annuelles Nettes</div>
            <div className="text-lg font-black font-mono text-emerald-400">
              {annualSavingsFcfa.toLocaleString()} FCFA / an
            </div>
            <div className="text-[10px] font-mono text-slate-300">
              Temps de Retour BESS : <strong>{paybackYears} ans</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SIMULATOR 3: IIOT BANDWIDTH & TELEMETRY CALCULATOR
// -------------------------------------------------------------
const IiotBandwidthCalculator: React.FC = () => {
  const [sensorsCount, setSensorsCount] = useState<number>(40);
  const [sampleRateSec, setSampleRateSec] = useState<number>(10);
  const [edgeCompression, setEdgeCompression] = useState<boolean>(true);
  const [radioProtocol, setRadioProtocol] = useState<'lorawan' | 'nbiot' | 'wifi'>('lorawan');

  // Payload per packet (approx 32 bytes raw)
  const bytesPerSample = edgeCompression ? 12 : 36;
  const samplesPerDay = (86400 / sampleRateSec) * sensorsCount;
  const totalMbPerDay = (samplesPerDay * bytesPerSample) / (1024 * 1024);

  // Approximate battery consumption
  const batteryYears = radioProtocol === 'lorawan'
    ? (sampleRateSec >= 60 ? 8.5 : sampleRateSec >= 10 ? 4.2 : 1.8)
    : radioProtocol === 'nbiot'
    ? (sampleRateSec >= 60 ? 5.2 : sampleRateSec >= 10 ? 2.5 : 0.9)
    : 0.3; // WiFi is power-hungry

  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          Simulateur d'Architecture Télémétrique &amp; Consommation IIoT
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Dimensionnement du volume de données, bande passante et autonomie de batterie
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Nombre de Sondes Connectées :</span>
              <strong className="text-cyan-400">{sensorsCount} capteurs</strong>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={sensorsCount}
              onChange={(e) => setSensorsCount(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Période d'Échantillonnage :</span>
              <strong className="text-indigo-400">{sampleRateSec} secondes</strong>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={sampleRateSec}
              onChange={(e) => setSampleRateSec(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/10">
            <span className="text-xs font-mono text-slate-300">Compression Edge Computing (Prétraitement) :</span>
            <button
              type="button"
              onClick={() => setEdgeCompression(!edgeCompression)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                edgeCompression ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {edgeCompression ? 'ACTIVÉE (-65%)' : 'DÉSACTIVÉE'}
            </button>
          </div>

          <div>
            <span className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Protocole Radio Choisi :</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lorawan', label: 'LoRaWAN 868' },
                { id: 'nbiot', label: 'NB-IoT 4G' },
                { id: 'wifi', label: 'WiFi Filaire' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setRadioProtocol(p.id as any)}
                  className={`p-2 rounded text-xs font-mono border transition-all ${
                    radioProtocol === p.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                      : 'bg-black/20 border-white/10 text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10 pb-2">
              Indicateurs de Dimensionnement Télécoms
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Volume Données / Jour</div>
                <div className="text-lg font-bold text-cyan-400">{totalMbPerDay.toFixed(1)} Mo / jour</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Bande Passante Débit</div>
                <div className="text-lg font-bold text-indigo-400">
                  {((totalMbPerDay * 8 * 1024) / 86400).toFixed(1)} kbps
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Autonomie Pile Estimée</div>
                <div className="text-lg font-bold text-emerald-400">
                  {radioProtocol === 'wifi' ? 'Secteur 24V requis' : `${batteryYears} ans`}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Coût Forfait SIM Estimé</div>
                <div className="text-lg font-bold text-amber-400">
                  {radioProtocol === 'lorawan' ? '0 FCFA (Réseau privé)' : `${(sensorsCount * 800).toLocaleString()} FCFA/m`}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg text-xs text-slate-200 font-sans leading-relaxed">
            <strong className="text-cyan-300 font-bold font-mono">Conseil Terrain Cameroun : </strong>
            {radioProtocol === 'lorawan' 
              ? 'Excellent choix pour les usines étendues (Bassa, Bonabéri) : aucune dépendance aux opérateurs télécoms locaux et aucune facture mensuelle récurrente.'
              : radioProtocol === 'nbiot'
              ? 'Pratique si les capteurs sont disséminés sur plusieurs sites distants à Douala et Yaoundé via cartes SIM M2M MTN/Orange.'
              : 'Attention : le WiFi requiert une alimentation filaire permanente et est sensible aux coupures de courant locales.'}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SIMULATOR 4: BESS LFP BATTERY DIMENSIONER
// -------------------------------------------------------------
const BessStorageDimensioner: React.FC = () => {
  const [backupLoadKw, setBackupLoadKw] = useState<number>(45); // Essential load
  const [autonomyHours, setAutonomyHours] = useState<number>(4); // Hours of outage
  const [dodPercent, setDodPercent] = useState<number>(85); // Depth of discharge
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(94); // Inverter efficiency

  // Calculations
  const requiredUsefulKwh = backupLoadKw * autonomyHours;
  const totalStorageCapacityKwh = requiredUsefulKwh / ((dodPercent / 100) * (inverterEfficiency / 100));

  // Standard rack modules: 5.12 kWh each (48V 100Ah LiFePO4)
  const moduleCapacityKwh = 5.12;
  const requiredModulesCount = Math.ceil(totalStorageCapacityKwh / moduleCapacityKwh);
  const actualInstalledKwh = requiredModulesCount * moduleCapacityKwh;
  const estimatedWeightKg = requiredModulesCount * 48; // ~48kg per 5kWh rack module

  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-emerald-400" />
          Dimensionneur BESS : Stockage Stationnaire LiFePO4 pour Résilience Électrique
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Optimisé pour les délestages réguliers et températures ambiantes élevées (35°C - 45°C)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Puissance Secourue Essentielle :</span>
              <strong className="text-emerald-400">{backupLoadKw} kW</strong>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={backupLoadKw}
              onChange={(e) => setBackupLoadKw(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Autonomie Souhaitée en Coupure :</span>
              <strong className="text-indigo-400">{autonomyHours} heures</strong>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={autonomyHours}
              onChange={(e) => setAutonomyHours(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-1">Profondeur Décharge (DoD) :</span>
              <select
                value={dodPercent}
                onChange={(e) => setDodPercent(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
              >
                <option value={80}>80% (6000 cycles)</option>
                <option value={85}>85% (5000 cycles)</option>
                <option value={90}>90% (4000 cycles)</option>
              </select>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Rendement Onduleur :</span>
              <select
                value={inverterEfficiency}
                onChange={(e) => setInverterEfficiency(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
              >
                <option value={92}>92% (Standard)</option>
                <option value={94}>94% (Haute Efficacité)</option>
                <option value={96}>96% (Tier 1 Premium)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10 pb-2">
              Spécifications du Banc Batteries Recommandé
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Capacité Utile</div>
                <div className="text-lg font-bold text-white">{requiredUsefulKwh} kWh</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Capacité Nominale</div>
                <div className="text-lg font-bold text-emerald-400">{actualInstalledKwh.toFixed(1)} kWh</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Modules Racks 5.12 kWh</div>
                <div className="text-lg font-bold text-indigo-400">{requiredModulesCount} modules (48V)</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Masse Totale Estimée</div>
                <div className="text-lg font-bold text-slate-300">~{estimatedWeightKg} kg</div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg text-xs text-slate-200 font-sans leading-relaxed">
            <strong className="text-emerald-300 font-bold font-mono">Recommandation Chimique Tropicale : </strong>
            Privilégier impérativement la technologie <span className="text-emerald-400 font-bold">Lithium-Fer-Phosphate (LiFePO4)</span> avec BMS ventilé. Elle supporte jusqu'à 55°C sans risque d'emballement thermique, contrairement aux batteries Lithium NMC qui présentent un danger sous climat chaud africain.
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SIMULATOR 5: COT PROMPT & ELECTROPILOT RAG ENGINE
// -------------------------------------------------------------
const CotPromptSandbox: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);

  const testQueries = [
    {
      query: "Dimensionner le câble d'alimentation pour un compresseur de 55 kW situé à 110 m du TGBT sous 400 V triphasé.",
      steps: [
        { title: '1. Compréhension du Besoin (LLM)', text: 'P = 55 kW, cos φ = 0.85, U = 400 V triphasé, L = 110 m, température ambiante = 40°C.' },
        { title: '2. Appel Moteur Déterministe Python', text: 'Ib = P / (√3 × U × cos φ) = 55000 / (1.732 × 400 × 0.85) = 93.4 A. Calibre disjoncteur In = 100 A ou 125 A.' },
        { title: '3. Facteurs de Correction Normatifs (RAG)', text: 'Pose sur chemin de câbles perforé (Méthode F). k_temp = 0.91 (40°C en Afrique selon NF C 15-100 tableau 52A). Iz nécessaire = 100 / 0.91 = 109.9 A.' },
        { title: '4. Section & Chute de Tension ΔU', text: 'Section cuivre préconisée : 35 mm² (Iz = 159 A). ΔU = √3 × L × Ib × (R cos φ + X sin φ) / U = 1.84% (admissible < 5%).' },
        { title: '5. Validation par Ingénieur Certifié', text: 'Calcul validé avec marge de sécurité thermique de 31%. Exportable en note de calcul officielle.' }
      ]
    },
    {
      query: "Interpréter les gaz dissous dans l'huile d'un transformateur 1000 kVA : Acétylène C2H2 = 45 ppm, Hydrogène H2 = 180 ppm.",
      steps: [
        { title: '1. Compréhension du Besoin (LLM)', text: 'Analyse DGA selon norme IEEE C57.104 et IEC 60599. Détection de décharges ou surchauffes.' },
        { title: '2. Calcul des Ratios de Duval & Rogers', text: 'Ratio C2H2 / C2H4 = 0.85. Ratio CH4 / H2 = 0.35. Positionnement dans le triangle de Duval n°1.' },
        { title: '3. Diagnostic Déterministe IA', text: 'Défaut classé : Arc électrique de haute énergie (Zone D2). Décharges disruptives entre spires ou vers la masse.' },
        { title: '4. Recommandation Terrain d\'Urgence', text: 'Danger imminent. Mise hors tension planifiée sous 48h. Test de rigidité diélectrique et recherche de claquage bobinage.' },
        { title: '5. Validation par Ingénieur Certifié', text: 'Alerte transmise au responsable maintenance haute tension avec fiche de manœuvre consignée.' }
      ]
    },
    {
      query: "Règle de sélectivité chronométrique entre le disjoncteur général TGBT 630 A et un départ moteur 160 A.",
      steps: [
        { title: '1. Compréhension du Besoin (LLM)', text: 'Coordination des protections contre les surintensités et courts-circuits selon IEC 60947-2.' },
        { title: '2. Sélectivité Ampèremétrique', text: 'Ir général = 630 A ≥ 1.6 × Ir départ (160 A) -> Sélectivité thermique totale assurée en surcharge.' },
        { title: '3. Sélectivité Chronométrique (Court-circuit)', text: 'Réglage temporisation retard court tsd : Général réglé à tsd = 200 ms, départ instantané tsd = 20 ms.' },
        { title: '4. Vérification Courbes de Déclenchement', text: 'Aucun croisement des bandes de tolérance. Sélectivité totale garantie jusqu\'au pouvoir de coupure Icu (36 kA).' },
        { title: '5. Validation par Ingénieur Certifié', text: 'Continuité de service maximale garantie pour l\'usine en cas de court-circuit sur le départ moteur.' }
      ]
    }
  ];

  const curr = testQueries[selectedPrompt];

  return (
    <div className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Bac à Sable d'Orchestration ElectroCopilot : LLM + RAG + Solveur Déterministe
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Démonstration de la chaîne de pensée (CoT) garantissant zéro hallucination sur les calculs critiques
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <span className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
            Sélectionner une Requête d'Ingénierie Test :
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {testQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPrompt(idx)}
                className={`p-3 rounded-xl text-xs text-left font-mono transition-all border ${
                  selectedPrompt === idx
                    ? 'bg-[#6366f1]/20 border-[#6366f1] text-white font-bold shadow-md shadow-[#6366f1]/20'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-[#a5b4fc] uppercase mb-1">Cas #{idx + 1}</div>
                <div className="line-clamp-2">{q.query}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CoT Output Flow */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-indigo-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Chaîne de Résolution Déterministe (Chain of Thought)
            </span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Certifié Zéro-Hallucination
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {curr.steps.map((step, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-lg p-3.5 space-y-1">
                <div className="text-[#a5b4fc] font-bold text-[11px] uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {step.title}
                </div>
                <div className="text-slate-300 font-sans leading-relaxed text-xs pl-5">
                  {step.text}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs font-sans text-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Conforme aux normes NF C 15-100 / IEC 60364 / IEEE C57.104.</span>
            </div>
            <div className="font-mono text-[10px] uppercase font-bold text-emerald-400">
              Signature Ingénieur Requise
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STANDARDS SECTION
// ==========================================
const StandardsSection: React.FC<{ onNavigateStandard?: (ref: string) => void }> = ({ onNavigateStandard }) => {
  const [filter, setFilter] = useState<'all' | 'cyber' | 'smartgrid' | 'ai'>('all');

  const standards = [
    { 
      ref: 'IEC 62443', 
      cat: 'cyber', 
      badge: 'Cyber OT', 
      badgeColor: 'bg-indigo-500/20 text-indigo-300', 
      title: 'Sécurité des systèmes d\'automatisation et de commande industrielles (IACS). Exigences pour les zones, conduits et composants connectés aux réseaux d\'énergie.', 
      usage: 'Cybersécurité SCADA & PLC' 
    },
    { 
      ref: 'ISO/IEC 27001', 
      cat: 'cyber', 
      badge: 'Cyber IT', 
      badgeColor: 'bg-indigo-500/20 text-indigo-300', 
      title: 'Systèmes de management de la sécurité de l\'information (SMSI). Standard de référence pour sécuriser les plateformes d\'ingénierie cloud comme ElectroCopilot.', 
      usage: 'Sécurité plateformes cloud' 
    },
    { 
      ref: 'IEC 61968', 
      cat: 'smartgrid', 
      badge: 'Smart Grid', 
      badgeColor: 'bg-amber-500/20 text-amber-300', 
      title: 'Common Information Model (CIM) pour la gestion des réseaux électriques de distribution. Interopérabilité logicielle entre SCADA, DMS et SIG.', 
      usage: 'Intégration logicielle utilities' 
    },
    { 
      ref: 'IEC 61970', 
      cat: 'smartgrid', 
      badge: 'Smart Grid', 
      badgeColor: 'bg-amber-500/20 text-amber-300', 
      title: 'Interface de programmation d\'application de gestion d\'énergie (EMS-API) pour réseaux de transport HT.', 
      usage: 'Dispatching SONATREL' 
    },
    { 
      ref: 'IEC 62056', 
      cat: 'smartgrid', 
      badge: 'Smart Meter', 
      badgeColor: 'bg-amber-500/20 text-amber-300', 
      title: 'DLMS/COSEM — suite universelle de communication pour les compteurs intelligents. Protocole des compteurs prépayés et industriels Eneo.', 
      usage: 'Compteurs Eneo AMI' 
    },
    { 
      ref: 'ISO/IEC 30141', 
      cat: 'ai', 
      badge: 'IIoT', 
      badgeColor: 'bg-teal-500/20 text-teal-300', 
      title: 'Architecture de référence pour l\'Internet des Objets (IoT). Spécifie les couches d\'ingestion, de traitement edge et de restitution analytique.', 
      usage: 'Architecture IoT robuste' 
    },
    { 
      ref: 'NIST AI RMF', 
      cat: 'ai', 
      badge: 'Gouvernance IA', 
      badgeColor: 'bg-purple-500/20 text-purple-300', 
      title: 'Cadre de gestion des risques liés à l\'Intelligence Artificielle. Garantit la fiabilité, l\'explicabilité et la sécurité des modèles d\'ingénierie assistée.', 
      usage: 'Conception éthique ElectroCopilot' 
    },
    { 
      ref: 'IEC 62351', 
      cat: 'cyber', 
      badge: 'Sécurité Réseau', 
      badgeColor: 'bg-emerald-500/20 text-emerald-300', 
      title: 'Sécurité des protocoles de communication pour la gestion des réseaux électriques (IEC 61850, IEC 60870-5, DNP3). Chiffrement et authentification.', 
      usage: 'Téléconduite sécurisée HT/MT' 
    }
  ];

  const filtered = filter === 'all' ? standards : standards.filter(s => s.cat === filter);

  return (
    <div className="space-y-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'Toutes les Normes' },
          { id: 'cyber', label: '🛡️ Cybersécurité OT & IT' },
          { id: 'smartgrid', label: '⚡ Smart Grid & Compteurs' },
          { id: 'ai', label: '🧠 IIoT & IA Responsable' },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setFilter(btn.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filter === btn.id
                ? 'bg-[#6366f1] text-white font-bold shadow'
                : 'bg-[#0f1829] text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-mono font-bold text-[#6366f1]">IEC</div>
          <div className="text-[10px] text-slate-400 uppercase font-mono">62443 Cybersécurité OT</div>
        </div>
        <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-mono font-bold text-[#6366f1]">ISO</div>
          <div className="text-[10px] text-slate-400 uppercase font-mono">27001 Sécurité Info</div>
        </div>
        <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-mono font-bold text-[#6366f1]">NIST</div>
          <div className="text-[10px] text-slate-400 uppercase font-mono">AI Risk Management</div>
        </div>
        <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
          <div className="text-xl font-mono font-bold text-[#6366f1]">IEC</div>
          <div className="text-[10px] text-slate-400 uppercase font-mono">61968 / 61970 CIM</div>
        </div>
      </div>

      <div className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-3">Référence &amp; Domaine</th>
              <th className="p-3">Intitulé &amp; Domaine d'Application</th>
              <th className="p-3 w-44">Usage Terrain</th>
              <th className="p-3 w-24 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                  {row.ref}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono ${row.badgeColor}`}>
                    {row.badge}
                  </span>
                </td>
                <td className="p-3 text-slate-300 font-sans leading-relaxed">{row.title}</td>
                <td className="p-3 text-slate-400 font-mono text-xs">{row.usage}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => onNavigateStandard?.(row.ref)}
                    className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Consulter</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// SKILLS MATRIX & SELF-ASSESSMENT SECTION
// ==========================================
const SkillsMatrixSection: React.FC = () => {
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>({
    's1': true,
    's2': true,
    's8': true,
    's15': true
  });

  const skillGroups = [
    {
      title: 'IA Appliquée au Génie Électrique',
      color: 'text-indigo-400',
      skills: [
        { id: 's1', text: 'Interpréter les résultats d\'un système de maintenance prédictive (vibrations, courant, DGA)' },
        { id: 's2', text: 'Utiliser un LLM comme assistant technique : rédaction de prompts d\'ingénierie rigoureux' },
        { id: 's3', text: 'Identifier les limites de l\'IA (hallucinations, approximations) et valider par calcul formel' },
        { id: 's4', text: 'Déployer un tableau de bord Grafana connecté aux capteurs d\'une usine ou sous-station' },
        { id: 's5', text: 'Mettre en place une chaîne de surveillance IIoT complète (capteur → gateway → cloud)' },
        { id: 's6', text: 'Analyser un profil de charge 24h issu de compteurs intelligents pour optimiser un contrat Eneo' },
        { id: 's7', text: 'Construire et défendre un business case IA chiffré auprès d\'un directeur d\'usine' }
      ]
    },
    {
      title: 'Digital Twin & Simulation',
      color: 'text-teal-400',
      skills: [
        { id: 's8', text: 'Comprendre les 4 niveaux d\'un jumeau numérique : données, modèle statique, dynamique, autonome' },
        { id: 's9', text: 'Modéliser une installation électrique complexe sur un logiciel de calcul (ETAP, Caneco, DIALux)' },
        { id: 's10', text: 'Interpréter les résultats d\'une simulation transitoire ou d\'écoulement de charge' },
        { id: 's11', text: 'Connecter un automate ou SCADA à un tableau de bord cloud pour télégestion en temps réel' },
        { id: 's12', text: 'Définir le périmètre minimal viable (MVP) d\'un jumeau numérique pour une industrie camerounaise' },
        { id: 's13', text: 'Justifier techniquement et financièrement l\'investissement dans un jumeau numérique' },
        { id: 's14', text: 'Maîtriser les protocoles d\'interopérabilité OT/IT : MQTT avec broker TLS et serveurs OPC-UA' }
      ]
    },
    {
      title: 'Cybersécurité OT (IEC 62443)',
      color: 'text-sky-400',
      skills: [
        { id: 's15', text: 'Réaliser un audit cybersécurité OT : inventaire des automates, cartographie réseau et failles' },
        { id: 's16', text: 'Configurer la segmentation réseau VLAN pour isoler strictement le réseau usine du réseau bureautique' },
        { id: 's17', text: 'Paramétrer un pare-feu industriel avec filtrage applicatif des trames Modbus TCP et Profinet' },
        { id: 's18', text: 'Former et sensibiliser les électriciens et opérateurs aux risques cyber (clés USB, pièces jointes)' },
        { id: 's19', text: 'Rédiger une politique de sécurité des systèmes industriels adaptée à une PME africaine' },
        { id: 's20', text: 'Appliquer les correctifs de sécurité (patch management) sans interrompre la production continue' },
        { id: 's21', text: 'Élaborer un plan de continuité et de reprise d\'activité (PCA/PRA) après cyberattaque' }
      ]
    },
    {
      title: 'Stockage & Énergies Renouvelables BESS',
      color: 'text-amber-400',
      skills: [
        { id: 's22', text: 'Dimensionner un système de stockage par batteries BESS (puissance kW / énergie kWh utile)' },
        { id: 's23', text: 'Configurer une installation hybride PV + BESS + groupe électrogène + réseau Eneo avec onduleur hybride' },
        { id: 's24', text: 'Superviser et analyser les paramètres d\'un BMS (état de charge SOC, état de santé SOH, températures)' },
        { id: 's25', text: 'Calculer le temps de retour sur investissement (ROI) d\'une centrale solaire avec stockage au Cameroun' },
        { id: 's26', text: 'Choisir judicieusement la chimie d\'accumulateurs adaptée au climat équatorial (privilégier le LiFePO4)' },
        { id: 's27', text: 'Spécifier un système d\'onduleur hybride capable d\'assurer un basculement sans coupure (< 10 ms)' },
        { id: 's28', text: 'Établir un plan de transition énergétique progressif pour un complexe tertiaire ou industriel' }
      ]
    }
  ];

  const toggleSkill = (id: string) => {
    setCheckedSkills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalSkills = 28;
  const acquiredCount = Object.values(checkedSkills).filter(Boolean).length;
  const scorePercent = Math.round((acquiredCount / totalSkills) * 100);

  const getRank = () => {
    if (scorePercent >= 80) return { title: 'Architecte Systèmes IA & Énergie 4.0', color: 'text-purple-400' };
    if (scorePercent >= 50) return { title: 'Ingénieur Praticien Confirmé', color: 'text-emerald-400' };
    if (scorePercent >= 25) return { title: 'Technicien Avancé', color: 'text-indigo-400' };
    return { title: 'Initié aux Nouvelles Technologies', color: 'text-slate-400' };
  };

  const rank = getRank();

  return (
    <div className="space-y-6">
      {/* Interactive Self-Assessment Gauge */}
      <div className="bg-[#0f1829] border border-[#6366f1]/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#6366f1] font-bold">
            Auto-Évaluation Interactive · Indice de Maturité Ingénieur 4.0
          </div>
          <h2 className="text-xl font-bold text-white font-sans">
            Niveau Actuel : <span className={rank.color}>{rank.title}</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Cochez les compétences maîtrisées ci-dessous pour actualiser votre score et votre plan de progression.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono">
          <div className="text-right">
            <div className="text-2xl font-black text-white">{acquiredCount} / {totalSkills}</div>
            <div className="text-[10px] text-slate-400 uppercase">Compétences validées</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#6366f1] flex items-center justify-center font-black text-lg text-white bg-[#6366f1]/20">
            {scorePercent}%
          </div>
        </div>
      </div>

      {/* 4 Skill Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
            <div className={`font-mono text-xs font-bold uppercase tracking-wider ${group.color} flex items-center gap-2`}>
              <span className="w-1.5 h-3.5 bg-current rounded-sm" />
              {group.title}
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {group.skills.map((s) => {
                const isChecked = !!checkedSkills[s.id];
                return (
                  <li
                    key={s.id}
                    onClick={() => toggleSkill(s.id)}
                    className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded hover:bg-white/5 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#6366f1] rounded cursor-pointer"
                    />
                    <span className={isChecked ? 'text-white' : 'text-slate-400'}>{s.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Final Objective Box */}
      <div className="relative bg-gradient-to-br from-[#0f1829] to-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl p-6 overflow-hidden">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6366f1] font-bold mb-2">
          Objectif Final — Domaine 09
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed italic font-sans">
          Comprendre et appliquer l'IA et les technologies avancées au génie électrique africain : <strong className="text-[#a5b4fc] font-bold not-italic">maintenance prédictive, optimisation énergétique, IIoT, cybersécurité OT, stockage d'énergie et digital twin</strong> — avec une vision claire de ce qui est déployable maintenant au Cameroun vs ce qui est en développement, et comment ElectroCopilot s'inscrit dans cette révolution technologique.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// AFRICA 2030 ROADMAP SECTION
// ==========================================
const Africa2030Section: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <span>🚀</span> Technologies Déployables Maintenant au Cameroun
          </div>
          <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
            <div><strong className="text-white">Monitoring IoT vibrant :</strong> capteurs LoRaWAN sur les pompes et concasseurs critiques → alertes SMS avant casse.</div>
            <div><strong className="text-white">Compteurs intelligents :</strong> exploitation des relevés 15 min des compteurs Eneo pour auditer les puissances souscrites.</div>
            <div><strong className="text-white">ElectroCopilot :</strong> assistant d'ingénierie électrique accessible sur smartphone via une simple connexion 4G.</div>
            <div><strong className="text-white">Photovoltaïque + Stockage LFP :</strong> onduleurs hybrides 10-100 kVA assurant la continuité lors des délestages.</div>
            <div><strong className="text-white">SCADA Cloud PME :</strong> passerelle Ignition connectée en 4G pour surveiller une usine depuis un téléphone portable.</div>
            <div><strong className="text-white">Inspection par Drones :</strong> thermographie infrarouge des lignes de transport HT SONATREL et grands parcs solaires.</div>
            <div><strong className="text-white">Grafana Open Source :</strong> tableaux de bord de consommation déployés sur Raspberry Pi sans frais de licence.</div>
            <div><strong className="text-white">Starlink :</strong> connectivité haut débit immédiate pour superviser les sites miniers et barrages isolés.</div>
          </div>
        </div>

        <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>⚠️</span> Défis Spécifiques — IA en Afrique
          </div>
          <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
            <div><strong className="text-white">Connectivité intermittente :</strong> concevoir impérativement des systèmes "Offline-First" avec mémoire tampon locale.</div>
            <div><strong className="text-white">Historique de données rare :</strong> commencer par une collecte de données fiable avant de lancer des modèles ML complexes.</div>
            <div><strong className="text-white">Compétences hybrides rares :</strong> former les ingénieurs électriciens existants aux outils numériques plutôt qu'importer des data scientists purs.</div>
            <div><strong className="text-white">Perception du coût :</strong> prouver le retour sur investissement immédiat (ex. 2 MFCFA investis = 5 MFCFA d'arrêts évités).</div>
            <div><strong className="text-white">Souveraineté des données :</strong> privilégier le traitement en périphérie (Edge Computing) pour conserver les données sensibles.</div>
            <div><strong className="text-white">Alimentation des passerelles :</strong> protéger chaque équipement de calcul par un petit onduleur secouru.</div>
          </div>
        </div>

        <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <span>💰</span> Opportunités Business — IA &amp; Tech au Cameroun
          </div>
          <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
            <div><strong className="text-white">Audits énergétiques assistés par IA :</strong> analyse des historiques de télé-relève + préconisations : 2 à 5 MFCFA.</div>
            <div><strong className="text-white">Contrats de maintenance prédictive :</strong> pose de capteurs connectés + surveillance mensuelle : 500 000 FCFA/mois.</div>
            <div><strong className="text-white">Centrales solaires avec BESS industriel :</strong> ingénierie et réalisation de projets hybrides : 50 à 300 MFCFA.</div>
            <div><strong className="text-white">Déploiement SCADA Cloud pour PME :</strong> supervision clé en main sur serveur sécurisé : 5 à 15 MFCFA/an.</div>
            <div><strong className="text-white">Formation professionnelle :</strong> bootcamps intensifs "L'IA pour les ingénieurs de terrain" : 500 000 FCFA/participant.</div>
            <div><strong className="text-white">Audits de cybersécurité industrielle :</strong> cartographie et sécurisation des réseaux d'usines : 3 à 10 MFCFA.</div>
          </div>
        </div>

        {/* ElectroCopilot 2030 Roadmap Box */}
        <div className="bg-[#0f1829] border border-[#6366f1]/40 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#a5b4fc] flex items-center gap-2">
            <span>🔮</span> ElectroCopilot — Vision Stratégique 2030
          </div>
          <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
            <div><strong className="text-white">Phase 1 (2025) :</strong> Moteur de calcul déterministe Python + RAG normatif + assistance conversationnelle IA.</div>
            <div><strong className="text-white">Phase 2 (2026) :</strong> Vision par ordinateur pour lecture instantanée des plaques de moteurs et schémas unifilaires.</div>
            <div><strong className="text-white">Phase 3 (2027) :</strong> Intégration de flux IoT en direct pour diagnostic d'installations en production.</div>
            <div><strong className="text-white">Phase 4 (2028) :</strong> Jumeaux numériques complets de bâtiments tertiaires et sous-stations interconnectées.</div>
            <div><strong className="text-white">Phase 5 (2029) :</strong> Maintenance prédictive anticipant les pannes 30 jours avant occurrence.</div>
            <div><strong className="text-white">Phase 6 (2030) :</strong> Référence continentale : 100 000 ingénieurs africains formés et outillés.</div>
            <div className="pt-2 border-t border-white/10 text-cyan-300 italic font-mono text-[11px]">
              « L'IA qui comprend le réseau Eneo, les contraintes climatiques africaines et les normes internationales. »
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
