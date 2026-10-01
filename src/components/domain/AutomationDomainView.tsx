// src/components/domain/AutomationDomainView.tsx
import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Network, 
  BookOpen, 
  CheckCircle2, 
  Calculator, 
  Globe2, 
  Flame, 
  Radio, 
  Terminal,
  ShieldAlert,
  Server,
  Activity,
  ArrowRight,
  ExternalLink,
  Code
} from 'lucide-react';

interface AutomationDomainViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
}

type TabType = 'connaissances' | 'langages' | 'protocoles' | 'normes' | 'competences' | 'formules' | 'afrique';

export const AutomationDomainView: React.FC<AutomationDomainViewProps> = ({
  locale,
  onNavigateStandard,
  onNavigateRole
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('connaissances');

  const tabs: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
    { id: 'connaissances', labelFr: 'A. Connaissances Clés', labelEn: 'A. Core Knowledge', icon: '🧠' },
    { id: 'langages', labelFr: 'B. Langages PLC', labelEn: 'B. PLC Languages', icon: '💻' },
    { id: 'protocoles', labelFr: 'C. Protocoles Industriels', labelEn: 'C. Field Protocols', icon: '🔌' },
    { id: 'normes', labelFr: 'D. Normes Principales', labelEn: 'D. Standards', icon: '📋' },
    { id: 'competences', labelFr: 'E. Compétences', labelEn: 'E. Skills Matrix', icon: '🎯' },
    { id: 'formules', labelFr: 'F. Calculs & Paramètres', labelEn: 'F. Calculations', icon: '📐' },
    { id: 'afrique', labelFr: 'G. Contexte Africain', labelEn: 'G. African Context', icon: '🌍' }
  ];

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans">
      
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#001a1a] via-[#001f20] to-[#001515] border-b-4 border-[#06b6d4] rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-[#06b6d4]/[0.05] pointer-events-none select-none font-mono">
          D07
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#06b6d4]/80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
              ElectroCopilot · Parcours Expert · Domaine 07 / 10
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
              Automatisation &amp; <span className="text-[#22d3ee]">Contrôle-Commande</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#22d3ee]/80 font-bold">
              PLC · IHM · SCADA · Réseaux Industriels · Modbus · Profibus · Ethernet/IP · IEC 61131 · Sécurité Fonctionnelle
            </p>
          </div>

          <div className="self-start sm:self-auto bg-[#06b6d4]/15 border border-[#06b6d4]/40 text-[#22d3ee] font-mono text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-sm">
            🤖 Expertise Opérationnelle Haute Valeur
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
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#06b6d4] text-slate-950 shadow-md shadow-[#06b6d4]/20'
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
          <div className="bg-[#06b6d4]/10 border-l-4 border-[#06b6d4] border border-[#06b6d4]/20 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-cyan-200 leading-relaxed">
            <strong className="text-cyan-300 font-bold">🤖 Domaine Clé pour l'Industrie Africaine :</strong> L'automatisation est le domaine qui transforme un électricien en ingénieur système. PLC, SCADA, réseaux industriels — ces compétences sont rares au Cameroun et très bien rémunérées dans les industries minières, agroalimentaires et de traitement des eaux.
          </div>

          {/* Pyramide CIM */}
          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              Architecture Pyramidale — Automatisation Industrielle (Pyramide CIM)
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center min-w-[140px] shrink-0">
                <div className="text-xs font-bold text-purple-400">ERP / MES</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Niveau 4-5 Entreprise</div>
              </div>
              <span className="text-cyan-400/60 font-bold text-lg">↕</span>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center min-w-[140px] shrink-0">
                <div className="text-xs font-bold text-purple-400">SCADA / DCS</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Niveau 3 Supervision</div>
              </div>
              <span className="text-cyan-400/60 font-bold text-lg">↕</span>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center min-w-[140px] shrink-0">
                <div className="text-xs font-bold text-amber-400">PLC / PAC</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Niveau 2 Contrôle</div>
              </div>
              <span className="text-cyan-400/60 font-bold text-lg">↕</span>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center min-w-[140px] shrink-0">
                <div className="text-xs font-bold text-amber-400">IHM / Pupitre</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Niveau 1 Conduite</div>
              </div>
              <span className="text-cyan-400/60 font-bold text-lg">↕</span>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center min-w-[140px] shrink-0">
                <div className="text-xs font-bold text-emerald-400">Capteurs / Actionneurs</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Niveau 0 Terrain</div>
              </div>
            </div>
          </div>

          {/* 9 Know Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KnowledgeCard
              icon="🖥️"
              title="PLC / Automate Programmable"
              color="#06b6d4"
              items={[
                'CPU : unité centrale — exécute le programme cycliquement (scan time 1-100ms)',
                'Modules E/S TOR : entrées/sorties tout-ou-rien (24V DC ou 230V AC)',
                'Modules E/S analogiques : 4-20mA, 0-10V, PT100, thermocouple',
                'Modules comptage rapide : encodeurs, débitmètres impulsionnels',
                'Modules communication : Modbus, Profibus, EtherNet/IP, Profinet',
                'Marques : Schneider (M221/M241/M580), Siemens S7-1200/S7-1500, ABB AC500',
                'Redondance CPU : systèmes critiques — double CPU avec bascule automatique'
              ]}
            />
            <KnowledgeCard
              icon="📊"
              title="SCADA — Supervision & Acquisition"
              color="#3b82f6"
              items={[
                'SCADA : Supervisory Control And Data Acquisition',
                'Fonctions : synoptiques animés, courbes tendance, alarmes, historique',
                'Logiciels : Wonderware InTouch, AVEVA System Platform, Ignition (Inductive Automation)',
                'Logiciels open source : OpenSCADA, SCADA-LTS — coût zéro, adapté Afrique',
                'Architecture client-serveur : serveur OPC-UA central + clients multiples',
                'Redondance serveur : failover automatique en < 5s sur systèmes critiques',
                'Accès distant : VPN sécurisé → supervision depuis bureau ou mobile'
              ]}
            />
            <KnowledgeCard
              icon="🎛️"
              title="IHM — Interface Homme Machine"
              color="#22c55e"
              items={[
                'Pupitre opérateur : écran tactile local de conduite de la machine',
                'Tailles : 4" (compact) → 15" (supervision) → 21" (salle de contrôle)',
                'Connexion PLC : Ethernet, RS485 (Modbus RTU), USB',
                'Marques : Schneider Magelis, Siemens KTP/TP, Allen Bradley PanelView',
                'Ergonomie : couleurs standardisées — vert marche, rouge arrêt/défaut',
                'Alarmes : texte clair + code + horodatage + accusé réception obligatoire',
                'Navigation intuitive : max 3 niveaux pour atteindre toute information'
              ]}
            />
            <KnowledgeCard
              icon="📡"
              title="Capteurs & Instrumentation"
              color="#e8a825"
              items={[
                'Capteur TOR : détecteur inductif, capacitif, photoélectrique, fin de course',
                'Transmetteur analogique 4-20mA : pression, température, niveau, débit',
                'PT100/PT1000 : sondes de température résistives — précision ±0.1°C',
                'Thermocouple type K, J, T : haute température (0-1300°C)',
                'Débitmètre électromagnétique : fluides conducteurs (eau, boues)',
                'Encodeur incrémental : mesure position/vitesse moteur (1000-10000 pts/tour)',
                'Sécurité : capteurs SIL avec boucle de sécurité (4-20mA HART)'
              ]}
            />
            <KnowledgeCard
              icon="⚙️"
              title="Actionneurs & Sorties"
              color="#f97316"
              items={[
                'Contacteur commandé par sortie TOR PLC (relais intermédiaire 24V DC)',
                'Vanne motorisée : tout-ou-rien ou proportionnelle (0-100% ouverture)',
                'VFD commandé par PLC : référence vitesse 4-20mA ou Modbus',
                'Servo-moteur : positionnement précis (axes CNC, robots, convoyeurs)',
                'Électrovanne pneumatique : commande 24V DC → actionneur pneumatique',
                'Chauffage électrique régulé : sortie PWM ou SSR (Solid State Relay)',
                'Boucle de régulation PID : sortie 4-20mA → actionneur proportionnel'
              ]}
            />
            <KnowledgeCard
              icon="🔄"
              title="Régulation PID"
              color="#14b8a6"
              items={[
                'PID : Proportionnel + Intégral + Dérivé — régulateur universel en industrie',
                'Consigne SP (Set Point) : valeur cible (ex : 85°C pour pasteurisateur)',
                'Mesure PV (Process Variable) : valeur réelle mesurée par capteur',
                'Erreur e = SP - PV : écart à corriger par le régulateur',
                'Action P : correction proportionnelle à l\'erreur (Kp)',
                'Action I : élimine l\'erreur résiduelle permanente (Ki)',
                'Action D : anticipe les variations rapides (Kd) — stabilisation'
              ]}
            />
            <KnowledgeCard
              icon="🛡️"
              title="Sécurité Fonctionnelle SIL"
              color="#a855f7"
              items={[
                'SIL (Safety Integrity Level) : niveau de réduction du risque SIL1-SIL4',
                'SIS (Safety Instrumented System) : système dédié sécurité (≠ système contrôle)',
                'SIL1 : réduction risque 10-100× — PFD (Prob. de Défaillance) 0.1-0.01',
                'SIL2 : réduction 100-1000× — pétrochimie, zones ATEX',
                'Arrêt d\'urgence (E-Stop) : catégorie 0 (déclenchement immédiat) ou catégorie 1 (arrêt contrôlé)',
                'Architecture 1oo2, 2oo3 : vote majoritaire pour sécurité redondante',
                'Norme IEC 61511 : instrumentation SIL pour industrie de process'
              ]}
            />
            <KnowledgeCard
              icon="🔒"
              title="Cybersécurité OT (IEC 62443)"
              color="#ef4444"
              items={[
                'OT (Operational Technology) : systèmes qui contrôlent physiquement les processus',
                'Segmentation : zones et conduits (DMZ entre réseau IT et OT)',
                'Principe "défense en profondeur" : plusieurs couches de sécurité',
                'Firewall industriel : filtrage Modbus, Profinet, OPC-UA',
                'Gestion des accès : comptes nominatifs, authentification forte (MFA)',
                'Patch management OT : mises à jour planifiées (différent IT — stabilité prioritaire)',
                'Incidents : ransomware OT → arrêt total production → perte massive'
              ]}
            />
            <KnowledgeCard
              icon="🌐"
              title="IIoT & Industrie 4.0"
              color="#84cc16"
              items={[
                'IIoT : Industrial Internet of Things — capteurs connectés au cloud',
                'Edge Computing : traitement local avant envoi cloud (latence réduite)',
                'Digital Twin : jumeau numérique de l\'installation physique',
                'Protocoles IIoT : MQTT, OPC-UA, AMQP pour transmission données',
                'Plateformes cloud : Azure IoT Hub, AWS IoT Core, Siemens MindSphere',
                'Maintenance prédictive IA : analyse données capteurs → prédiction panne',
                'Afrique : connectivité limitée → Edge First, cloud en complément'
              ]}
            />
          </div>
        </div>
      )}

      {/* 4. TAB B: LANGAGES PLC */}
      {activeTab === 'langages' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">LD</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Ladder Diagram</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Représentation en schéma à contacts (relais logiques). Standard pour électriciens. Contacts (entrées) et bobines (sorties) sur barreaux horizontaux. Très lisible pour logique séquentielle simple.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Commandes marche/arrêt · Verrouillages · Diagnostics · Idéal débutants PLC
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">FBD</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Function Block Diagram</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Blocs fonctionnels graphiques interconnectés. Régulateurs PID, compteurs, temporisateurs. Vue flux de données. Très utilisé en process continu et régulation.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Régulation PID · Process continu · Traitement signal · Calculs analogiques
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">SFC</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Sequential Function Chart</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grafcet — représentation graphique des étapes et transitions d'un process séquentiel. Standard pour automatismes séquentiels complexes. Lisible par tous les acteurs.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Processus séquentiels · Lignes de production · Recettes · Gestion modes
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">ST</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Structured Text</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Langage textuel structuré proche Pascal/C. Puissant pour calculs complexes, algorithmes, manipulation de tableaux. Incontournable pour les automaticiens avancés.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Algorithmes complexes · Calculs mathématiques · Bibliothèques réutilisables
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">IL</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Instruction List</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Langage assembleur PLC. Faibles ressources CPU. En déclin au profit de ST. Encore présent sur anciens systèmes. Compréhension utile pour maintenance legacy.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Systèmes legacy · Faibles ressources CPU · Maintenance anciens PLC
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="font-mono text-sm font-bold text-[#06b6d4]">GRAFCET</div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">IEC 60848 — Outil Analyse</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Norme française de description des automatismes séquentiels. Pas un langage PLC mais un outil d'analyse. Étapes + transitions + actions. Base de la conception avant programmation SFC.
              </p>
              <div className="text-[11px] text-[#14b8a6] italic font-mono pt-2 border-t border-white/5">
                ✓ Spécification · Analyse · Documentation · Base du SFC IEC 61131
              </div>
            </div>
          </div>

          {/* Ladder Example Visual Box */}
          <div className="bg-[#0f1829] border border-[#06b6d4]/40 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-black/40 px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#06b6d4]">
                <Code className="h-4 w-4" />
                <span>💡 Exemple Pratique — Démarrage Moteur en Ladder (LD) avec Auto-maintien</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">IEC 61131-3 LD</span>
            </div>

            <div className="p-5 font-mono text-xs text-cyan-300 leading-relaxed bg-[#050b14] overflow-x-auto">
              <div className="text-slate-500 mb-2">// Réseau 1 : Démarrage moteur (Marche + NON défaut + NON arrêt)</div>
              <div>|--[M_MARCHE]--[/M_ARRET]--[/DEFAUT_THERM]--( KM_MOTEUR )--|</div>
              <div className="mt-1">|--[KM_MOTEUR]-----------------------------------|</div>
              
              <div className="text-slate-500 mt-4 mb-1">// Réseau 2 : Voyant marche (vert)</div>
              <div>|--[KM_MOTEUR]--( VOYANT_VERT )--|</div>
              
              <div className="text-slate-500 mt-4 mb-1">// Réseau 3 : Voyant défaut (rouge)</div>
              <div>|--[DEFAUT_THERM]--( VOYANT_ROUGE )--|</div>

              <div className="text-emerald-400 text-[11px] mt-4 pt-3 border-t border-white/5">
                // Légende : [X] = contact NO · [/X] = contact NF · (Y) = bobine · auto-maintien = bobine + contact en parallèle
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB C: PROTOCOLES INDUSTRIELS */}
      {activeTab === 'protocoles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Modbus RTU', type: 'Série RS485', desc: 'Le plus répandu au monde. Maître/esclave. Vitesse 9600-115200 bps. Jusqu\'à 247 esclaves. 4 types de registres. Simple et robuste.' },
              { name: 'Modbus TCP', type: 'Ethernet TCP/IP', desc: 'Modbus sur Ethernet. Port 502. Même structure que RTU mais encapsulé TCP. Très utilisé pour interface PLC-SCADA sur réseau usine.' },
              { name: 'Profibus DP', type: 'Série RS485', desc: 'Standard Siemens/Europe. Maître/esclave. 12 Mbps max. 126 esclaves. Très robuste en milieu industriel. Répandu sur installations existantes.' },
              { name: 'Profinet', type: 'Ethernet Industriel', desc: 'Évolution Profibus sur Ethernet. Temps réel IRT (250µs). Jusqu\'à 256 appareils. Standard Siemens S7-1500. Intégration IT/OT facilitée.' },
              { name: 'EtherNet/IP', type: 'Ethernet Industriel', desc: 'Standard Allen Bradley (Rockwell). CIP protocol sur Ethernet. Très utilisé en Amérique du Nord et grands groupes multinationaux.' },
              { name: 'CANopen', type: 'Bus CAN', desc: 'Réseau de terrain automobile adapté industrie. 1 Mbps. Utilisé pour capteurs distribués, robots, équipements mobiles.' },
              { name: 'OPC-UA', type: 'Standard Middleware', desc: 'Open Platform Communications Unified Architecture. Middleware universel. Sécurité intégrée. Standard Industrie 4.0 pour intégration IT/OT/Cloud.' },
              { name: 'HART', type: '4-20mA + Digital', desc: 'Highway Addressable Remote Transducer. Signal digital superposé sur 4-20mA. Configuration à distance et diagnostic capteurs de terrain.' },
              { name: 'IEC 61850', type: 'Sous-stations HT', desc: 'Standard communication postes électriques. GOOSE (<4ms), MMS, Sampled Values. Nœuds logiques normalisés. Interopérabilité constructeurs.' },
              { name: 'MQTT', type: 'IIoT / Cloud', desc: 'Lightweight publish/subscribe. Port 1883/8883 TLS. Broker central. Idéal connexions intermittentes — adapté Afrique faible bande passante.' },
              { name: 'DNP3', type: 'SCADA Énergie', desc: 'Protocole SCADA pour réseaux électriques. Utilisé par Eneo/SONATREL. Horodatage millisecondes. Transmission radio ou fibre.' },
              { name: 'Wireless HART', type: 'Sans fil 2.4 GHz', desc: 'HART sur réseau maillé 2.4GHz (IEEE 802.15.4). Idéal capteurs difficiles d\'accès ou mobiles. Autonomie batterie 5-10 ans.' },
            ].map((p, idx) => (
              <div key={idx} className="bg-[#0f1829] border border-white/10 rounded-xl p-3.5 space-y-1.5 hover:border-[#06b6d4]/40 transition-all">
                <div className="font-mono text-sm font-bold text-[#06b6d4]">{p.name}</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#14b8a6]">{p.type}</div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB D: NORMES PRINCIPALES */}
      {activeTab === 'normes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#06b6d4]">IEC</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">61131 — PLC Standard</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#06b6d4]">62443</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Cybersécurité OT</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#06b6d4]">61511</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">SIL Sécurité Process</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#06b6d4]">60848</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">GRAFCET</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#06b6d4]">ISA-88</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Batch Control</div>
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Intitulé &amp; Domaine d'Application</th>
                  <th className="p-3 w-40">Usage Terrain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { ref: 'IEC 61131', badge: 'Primaire', badgeColor: 'bg-cyan-500/20 text-cyan-300', title: 'Automates programmables industriels. Parties 1 (définitions), 2 (matériel), 3 (langages LD, FBD, SFC, ST, IL), 5 (communications). Standard universel pour la programmation de tout PLC moderne.', usage: 'Programmation tous PLC' },
                  { ref: 'IEC 62443', badge: 'Primaire', badgeColor: 'bg-cyan-500/20 text-cyan-300', title: 'Sécurité pour les systèmes d\'automatisation industrielle (IACS). Zones et conduits de sécurité, niveaux SL1-SL4, gestion des risques cybersécurité OT. Essentiel usines, utilities, eau.', usage: 'Cybersécurité OT industrie' },
                  { ref: 'IEC 61511', badge: 'SIL', badgeColor: 'bg-red-500/20 text-red-300', title: 'Instrumentation de sécurité (SIS) pour l\'industrie de process. Allocation SIL, conception SIS, vérification SIL, proof test. Procédés chimiques, pétroliers, mines.', usage: 'Sécurité fonctionnelle process' },
                  { ref: 'IEC 60204-1', badge: 'Primaire', badgeColor: 'bg-cyan-500/20 text-cyan-300', title: 'Sécurité des machines — équipements électriques. Circuits de commande 24V DC, catégories d\'arrêt (0,1,2), câblage armoires machine, protection contre contacts.', usage: 'Armoires commande machines' },
                  { ref: 'IEC 60848', badge: 'Secondaire', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'GRAFCET — langage de spécification des modes de marche et d\'arrêt (GEMMA). Standard pour décrire les automatismes séquentiels avant programmation.', usage: 'Spécification automatismes' },
                  { ref: 'ISA-88 / IEC 61512', badge: 'Secondaire', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'Contrôle des procédés discontinus (batch). Modèle physique et de procédé, recettes, phases, équipements. Industries agroalimentaires, brasseries, cosmétiques.', usage: 'Procédés batch agro' },
                  { ref: 'ISA-95 / IEC 62264', badge: 'Secondaire', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'Intégration systèmes de contrôle et ERP. Modèles d\'échange de données entre SCADA/MES et SAP/ERP pour grandes usines.', usage: 'Intégration MES-ERP' },
                  { ref: 'IEC 61850', badge: 'Énergie', badgeColor: 'bg-emerald-500/20 text-emerald-300', title: 'Communication dans les postes et centrales électriques. GOOSE (<4ms), MMS, Sampled Values. Standard automatisation postes Eneo/SONATREL.', usage: 'Postes électriques automatisés' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                      {row.ref}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono ${row.badgeColor}`}>
                        {row.badge}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans leading-relaxed">{row.title}</td>
                    <td className="p-3 text-slate-400 font-mono text-xs">{row.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB E: COMPETENCES A DEVELOPPER */}
      {activeTab === 'competences' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#06b6d4] flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#06b6d4] rounded-sm" />
                Conception &amp; Architecture
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Concevoir l\'architecture d\'un système automatisé (capteurs → PLC → SCADA → actionneurs)',
                  'Rédiger un cahier des charges automatisme (CDCA) avec spécifications fonctionnelles',
                  'Choisir un PLC selon critères : E/S requises, protocoles, environnement, budget',
                  'Concevoir un schéma GRAFCET d\'un processus séquentiel industriel',
                  'Sélectionner les capteurs et transmetteurs adaptés (technologie, plage, IP, SIL)',
                  'Dimensionner l\'alimentation 24V DC d\'une armoire d\'automatisme',
                  'Concevoir le plan de sécurité fonctionnelle (E-Stop, barrières immatérielles)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-400 rounded-sm" />
                Programmation PLC
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Programmer un automatisme en Ladder (LD) : contacts, bobines, temporisateurs, compteurs',
                  'Programmer en SFC (Grafcet) un processus séquentiel multi-étapes',
                  'Écrire des blocs fonctionnels (FB) réutilisables en Structured Text (ST)',
                  'Configurer et paramétrer un régulateur PID sur un PLC (température, pression, niveau)',
                  'Configurer un réseau Modbus RTU entre PLC maître et VFDs esclaves',
                  'Développer une synoptique IHM avec alarmes, tendances et navigation intuitive',
                  'Documenter le programme : commentaires, schémas as-built, guide opérateur'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-sky-400 rounded-sm" />
                Mise en Service &amp; Tests
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Réaliser le câblage d\'une armoire d\'automatisme selon le schéma électrique',
                  'Tester unitairement chaque entrée/sortie avant mise sous tension (méthode systématique)',
                  'Mettre en service un VFD commandé par PLC via Modbus (paramétrage + test)',
                  'Réaliser les essais FAT (Factory Acceptance Test) avec simulation des capteurs',
                  'Réaliser les essais SAT (Site Acceptance Test) avec le processus réel',
                  'Former les opérateurs à la conduite du système automatisé (ergonomie IHM)',
                  'Rédiger le dossier technique complet (schémas + programme + manuel opérateur)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-amber-400 rounded-sm" />
                Maintenance &amp; Dépannage
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Diagnostiquer une panne PLC : vérifier CPU, E/S, alimentation, communication',
                  'Utiliser le mode monitor (visualisation en ligne) pour détecter l\'étape bloquante',
                  'Forcer une entrée/sortie en mode debug pour isoler une panne (avec précautions sécurité)',
                  'Remplacer un module E/S défectueux sans arrêt total (si rack redondant)',
                  'Analyser un journal d\'alarmes SCADA pour identifier la cause racine d\'un incident',
                  'Mettre à jour un programme PLC en production (procédure de gestion des modifications)',
                  'Sauvegarder et restaurer un programme PLC (gestion des versions, archivage)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Objectif Final Box */}
          <div className="relative bg-gradient-to-br from-[#0f1829] to-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-xl p-6 overflow-hidden">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#06b6d4] font-bold mb-2">
              Objectif Final — Domaine 07
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed italic font-sans">
              Maîtriser l'automatisation industrielle de bout en bout : <strong className="text-[#06b6d4] font-bold not-italic">concevoir l'architecture, programmer en IEC 61131, configurer les réseaux Modbus/Profibus, développer les IHM SCADA, mettre en service et maintenir</strong> tout système automatisé — des machines agroalimentaires aux stations de traitement d'eau en passant par les postes électriques automatisés d'Eneo.
            </p>
          </div>
        </div>
      )}

      {/* 8. TAB F: CALCULS ET PARAMETRES */}
      {activeTab === 'formules' && (
        <div className="space-y-4">
          {[
            {
              name: 'Régulateur PID',
              sub: 'Loi de commande',
              expr: 'u(t) = Kp·e + Ki·∫e dt + Kd·(de/dt)',
              vars: 'u = sortie régulateur (0-100%) · e = erreur SP-PV · Kp = gain prop. · Ki = gain intégral · Kd = gain dérivé',
              note: 'Méthode Ziegler-Nichols pour réglage initial : augmenter Kp jusqu\'à oscillation (Ku), noter période (Tu) → Kp=0.6Ku, Ti=0.5Tu, Td=0.125Tu. En pratique : commencer par P seul, puis ajouter I pour éliminer erreur résiduelle, enfin D si instabilité rapide.',
              std: 'IEC 61131-3'
            },
            {
              name: 'Temps de Cycle PLC',
              sub: 'Scan time',
              expr: 'T_scan = T_entrées + T_programme + T_sorties',
              vars: 'T_scan = temps cycle total (ms) · T_entrées = lecture E/S (0.5-2ms) · T_programme = exécution code · T_sorties = écriture',
              note: 'PLC standard : T_scan = 5-50ms. Règle de Shannon : T_scan ≤ T_process / 10. Process thermique (°C/s) → T_scan 100ms suffisant. Servo-moteur positionnement → T_scan < 1ms nécessaire.',
              std: 'IEC 61131-1'
            },
            {
              name: 'Conversion Signal Analogique',
              sub: '4-20mA → valeur physique',
              expr: 'X = X_min + [(I - 4mA) / 16mA] × (X_max - X_min)',
              vars: 'X = valeur physique · X_min/max = plage capteur · I = courant mesuré (4-20mA)',
              note: 'Exemple : Capteur pression 0-10 bar, lecture = 12mA → X = 0 + (12-4)/16 × 10 = 5.0 bar. Valeur numérique PLC 12 bits (0-4095) : N = (I-4mA)/16mA × 4095. Calibrage annuel requis en milieu tropical.',
              std: 'IEC 60770 · HART'
            },
            {
              name: 'Débit Modbus RTU',
              sub: 'Temps de transaction RS485',
              expr: 'T_msg = (11 bits × N_octets) / Baud_rate',
              vars: 'T_msg = durée transmission (s) · N_octets = taille trame Modbus · Baud_rate = vitesse (bps)',
              note: 'À 9600 bps, trame lecture 10 registres (25 octets) → T = (11×25)/9600 = 28.6ms. Avec délai réponse esclave 5ms → cycle total ≈ 34ms. Pour 20 variateurs VFD en boucle : T_total = 680ms (parfait pour supervision).',
              std: 'Modbus Specification'
            },
            {
              name: 'Alimentation 24V DC',
              sub: 'Dimensionnement armoire',
              expr: 'I_total = Σ(I_PLC + I_ES + I_IHM + I_relais)',
              vars: 'I_total = courant total 24V (A) · I_PLC ≈ 0.5A · I_ES ≈ 0.1A/module · I_IHM ≈ 1-3A · I_relais ≈ 0.05-0.1A',
              note: 'Armoire type : PLC (0.5A) + 8 modules E/S (0.8A) + IHM 7" (1.2A) + 16 relais (0.8A) = 3.3A → choisir alimentation 5A (marge 50%). Redondance : 2 alimentations en parallèle avec diodes OR pour sites critiques.',
              std: 'IEC 60204-1'
            },
            {
              name: 'SIL — PFD Calcul',
              sub: 'Probabilité de défaillance',
              expr: 'PFD_avg = λ_D × T_I / 2',
              vars: 'PFD = Probability of Failure on Demand · λ_D = taux défaillance dangereuse (h⁻¹) · T_I = intervalle proof test (h)',
              note: 'Capteur pression SIL1 : λ_D = 10⁻⁶/h, test annuel T_I = 8760h → PFD = 10⁻⁶ × 8760/2 = 4.4×10⁻³ → SIL1 confirmé (PFD entre 10⁻² et 10⁻¹). Raccourcir l\'intervalle de test permet d\'améliorer le niveau SIL sans changer de matériel.',
              std: 'IEC 61511'
            },
          ].map((calc, idx) => (
            <div key={idx} className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 hover:border-[#06b6d4]/40 transition-all">
              <div className="md:col-span-3 p-4 bg-[#06b6d4]/[0.06] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                <div className="font-mono text-sm font-bold text-[#06b6d4] uppercase">{calc.name}</div>
                <div className="text-[11px] text-slate-400 italic font-mono">{calc.sub}</div>
              </div>
              <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center bg-black/20">
                <div className="font-mono text-xs sm:text-sm font-bold text-cyan-300">{calc.expr}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">{calc.vars}</div>
              </div>
              <div className="md:col-span-4 p-4 flex flex-col justify-center">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{calc.note}</p>
                <div className="font-mono text-[10px] text-[#06b6d4]/70 mt-2">{calc.std}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 9. TAB G: CONTEXTE AFRICAIN */}
      {activeTab === 'afrique' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#06b6d4] flex items-center gap-2">
                <span>🏭</span> Applications Automatisation — Industrie Cameroun
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Huileries palmier :</strong> PLC contrôle stérilisateurs, presses, clarificateurs — Schneider M340/Premium courants.</div>
                <div><strong className="text-white">Brasseries :</strong> SABC/Guinness — systèmes DCS Siemens PCS7 ou Wonderware — process bière automatisé.</div>
                <div><strong className="text-white">Cimenteries :</strong> Cimencam / Dangote — variateurs VFD sur broyeurs + SCADA supervision four rotatif.</div>
                <div><strong className="text-white">Traitement eau :</strong> CDE Douala — PLC gestion stations pompage + SCADA répartition réseau.</div>
                <div><strong className="text-white">Télécoms :</strong> MTN/Orange/Nexttel — automates gestion énergie tours relais (groupe + solaire + batterie).</div>
                <div><strong className="text-white">Mines Est-Cameroun :</strong> cobalt/or — PLC extraction + SCADA sécurité + communication satellite.</div>
                <div><strong className="text-white">Ports :</strong> Port Autonome de Douala — SCADA grues, portiques, contrôle trafic navires.</div>
                <div><strong className="text-white">Aéroports :</strong> ADC — BMS/GTB automatisation HVAC, éclairage, sécurité, accès.</div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span>⚠️</span> Défis Spécifiques — Automatisation Tropicale
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Chaleur :</strong> PLC dans armoire non climatisée → 60°C+ → durée de vie CPU réduite → ventilation forcée ou clim obligatoire.</div>
                <div><strong className="text-white">Poussière :</strong> usines palmier/ciment → IP65 minimum pour les armoires → nettoyage filtres mensuel.</div>
                <div><strong className="text-white">Humidité :</strong> condensation sur cartes électroniques → résistance chauffante anti-condensation 24h/24.</div>
                <div><strong className="text-white">Coupures Eneo :</strong> reset PLC à chaque coupure → UPS double conversion + séquence de reprise automatique.</div>
                <div><strong className="text-white">Surtensions :</strong> foudre fréquente + réseau Eneo instable → parafoudres Type 1+2 sur 24V et communication.</div>
                <div><strong className="text-white">Pièces de rechange :</strong> délai d'importation 4 à 8 semaines → stock obligatoire de 1 CPU spare + cartes E/S.</div>
                <div><strong className="text-white">Compétences :</strong> rareté de développeurs automaticiens locaux qualifiés → opportunité majeure ElectroCopilot.</div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span>💰</span> Opportunités Business — Automatisation Afrique
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Projets greenfield :</strong> nouvelles usines → conception + fourniture armoire + programmation : 50-500 MFCFA.</div>
                <div><strong className="text-white">Rétrofit &amp; Migration :</strong> remplacement d'anciens automates obsolètes (TSX) → 20-100 MFCFA par ligne.</div>
                <div><strong className="text-white">Contrats de maintenance :</strong> 5-10% valeur de l'installation par an → revenus récurrents pérennes.</div>
                <div><strong className="text-white">Formation professionnelle :</strong> sessions programmation PLC 3 jours → 500 000-1 000 000 FCFA/session.</div>
                <div><strong className="text-white">Supervision SCADA Ignition :</strong> alternative moderne à coût réduit sans licence tags prohibitive.</div>
                <div><strong className="text-white">Télémaintenance sécurisée :</strong> passerelle VPN 4G → diagnostic et dépannage à distance de Douala vers l'Est.</div>
              </div>
            </div>

            {/* Practical Case Box */}
            <div className="bg-[#0f1829] border border-sky-500/30 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <span>🔧</span> Cas Pratique — Station de Pompage Douala (CDE)
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Système :</strong> 3 pompes centrifuges 45kW + 1 secours → distribution eau potable quartier Bonabéri.</div>
                <div><strong className="text-white">PLC :</strong> Schneider M241 + modules 16 DI + 8 DO + 4 AI (capteurs 4-20mA pression et niveau bâche).</div>
                <div><strong className="text-white">VFDs :</strong> Schneider Altivar 312 × 3 pilotés en Modbus RTU (RS485, 9600 bps).</div>
                <div><strong className="text-white">Régulation :</strong> PID pression de refoulement (consigne 3.5 bar) → variation de vitesse automatique selon demande.</div>
                <div><strong className="text-white">IHM :</strong> Schneider Magelis 7" tactile avec synoptique animé, marche/défaut et historique alarmes.</div>
                <div><strong className="text-white">Sécurité :</strong> détection manque d'eau par niveau bâche → arrêt instantané anti-cavitation.</div>
                <div><strong className="text-white">Résultat :</strong> pression constante 24h/24 · économie d'énergie 4.2 MFCFA/an (35%) · disponibilité 99.2%.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. DOMAIN FOOTER */}
      <footer className="bg-gradient-to-r from-[#001a1a] via-[#001f20] to-[#001a1a] border-t-2 border-[#06b6d4] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <div className="text-[#22d3ee] italic font-semibold">
          « Programmer, superviser, optimiser — l'automatisation au service de l'Afrique. »
        </div>
        <div className="text-slate-500 text-[10px] uppercase tracking-wider">
          ElectroCopilot · Domaine 07/10 · Automatisation &amp; Contrôle-Commande · IEC 61131
        </div>
      </footer>

    </div>
  );
};

interface KnowledgeCardProps {
  icon: string;
  title: string;
  color: string;
  items: string[];
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ icon, title, color, items }) => {
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
