// src/components/domain/ExtraLowVoltageDomainView.tsx
import React, { useState } from 'react';
import { 
  Network, 
  Video, 
  ShieldCheck, 
  Flame, 
  Bell, 
  Volume2, 
  PhoneCall, 
  Tv, 
  Layers, 
  Zap, 
  Server, 
  Wifi, 
  CheckCircle2, 
  Calculator, 
  Globe2, 
  Building2, 
  Key, 
  Cpu 
} from 'lucide-react';

interface ExtraLowVoltageDomainViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
}

type TabType = 'systemes' | 'reseaux' | 'securite' | 'incendie' | 'normes' | 'competences' | 'formules' | 'afrique';

export const ExtraLowVoltageDomainView: React.FC<ExtraLowVoltageDomainViewProps> = ({
  locale,
  onNavigateStandard,
  onNavigateRole
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('systemes');

  const tabs: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
    { id: 'systemes', labelFr: 'A. Vue d\'Ensemble', labelEn: 'A. Overview', icon: '🌐' },
    { id: 'reseaux', labelFr: 'B. Réseaux & Câblage', labelEn: 'B. Structured Cabling', icon: '🔌' },
    { id: 'securite', labelFr: 'C. Sécurité Électronique', labelEn: 'C. Electronic Security', icon: '📹' },
    { id: 'incendie', labelFr: 'D. Détection Incendie', labelEn: 'D. Fire & Life Safety', icon: '🔥' },
    { id: 'normes', labelFr: 'E. Normes Principales', labelEn: 'E. Standards', icon: '📋' },
    { id: 'competences', labelFr: 'F. Compétences', labelEn: 'F. Skills Matrix', icon: '🎯' },
    { id: 'formules', labelFr: 'G. Calculs Clés', labelEn: 'G. Calculations', icon: '📐' },
    { id: 'afrique', labelFr: 'H. Contexte Africain', labelEn: 'H. African Context', icon: '🌍' }
  ];

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans">
      
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#1a1500] via-[#1f1a00] to-[#151000] border-b-4 border-[#e8a825] rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-[#e8a825]/[0.05] pointer-events-none select-none font-mono">
          D08
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#e8a825]/80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#e8a825] animate-pulse" />
              ElectroCopilot · Parcours Expert · Domaine 08 / 10
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
              Courants Faibles &amp; <span className="text-[#fbbf24]">Systèmes Spéciaux</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#fbbf24]/80 font-bold">
              Réseaux · Vidéosurveillance · Contrôle Accès · Détection Incendie · Sonorisation · Interphonie · Sécurité Électronique
            </p>
          </div>

          <div className="self-start sm:self-auto bg-[#e8a825]/15 border border-[#e8a825]/40 text-[#fbbf24] font-mono text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-sm">
            ⭐ Expertise Principale YAYA
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
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#e8a825] text-slate-950 shadow-md shadow-[#e8a825]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB A: VUE D'ENSEMBLE */}
      {activeTab === 'systemes' && (
        <div className="space-y-6">
          <div className="bg-[#e8a825]/10 border-l-4 border-[#e8a825] border border-[#e8a825]/20 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-amber-200 leading-relaxed">
            <strong className="text-[#fbbf24] font-bold">⭐ Expertise Principale YAYA :</strong> Les courants faibles et systèmes spéciaux constituent le cœur de l'expérience terrain d'ElectroCopilot — plus de 50 projets réalisés. C'est le domaine de différenciation stratégique : intégration multi-systèmes, câblage structuré, sécurité électronique, détection incendie. Marché en forte croissance avec la construction de bâtiments tertiaires et industriels en Afrique.
          </div>

          {/* 8 Families Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '🌐', name: 'Réseaux', feats: ['Câblage structuré Cat6/6A', 'Fibre optique monomode/multimode', 'Switch, routeur, WiFi 6', 'Normes TIA-568, ISO 11801', 'VLAN, QoS, PoE 802.3bt'] },
              { icon: '📹', name: 'Vidéosurveillance', feats: ['Caméras IP / analogiques HD', 'Enregistreur NVR / RAID', 'Analyse vidéo IA intelligente', 'Protocoles ONVIF, IEC 62676', 'Vision nocturne IR, PTZ 36×'] },
              { icon: '🔐', name: 'Contrôle d\'Accès', feats: ['Badges RFID MIFARE / biométrie', 'Contrôleurs de porte IP', 'Électroserrures, ventouses 12V', 'Norme IEC 60839-11', 'Intégration CCTV & anti-passback'] },
              { icon: '🔥', name: 'Détection Incendie', feats: ['Détecteurs fumée/chaleur', 'Centrale incendie ECS adressable', 'Déclencheurs manuels DMI', 'Normes EN 54, NFPA 72', 'Boucles sécurisées rebouclées'] },
              { icon: '🔔', name: 'Intrusion / Alarme', feats: ['Détecteurs PIR double techno', 'Centrale alarme Grade 3', 'Transmetteurs GSM 4G / IP', 'Norme EN 50131 grades 1-4', 'Zones avec / sans fil'] },
              { icon: '🔊', name: 'Sonorisation PA/VA', feats: ['Lignes 100V sécurité', 'Enceintes, amplificateurs', 'Évacuation vocale IEC 60849', 'Intelligibilité STI-PA ≥ 0.5', 'Conférence & diffusion'] },
              { icon: '📞', name: 'Interphonie', feats: ['Interphones IP / visiophones', 'Visiophonie HD tactile', 'PABX / Téléphonie VoIP SIP', 'Intégration ouverture gâche', 'Systèmes d\'appel infirmière'] },
              { icon: '📡', name: 'TV / Antennes', feats: ['Distribution TV collective', 'Antennes satellites VSAT', 'Systèmes IPTV hôteliers', 'Réseaux coaxiaux HFC', 'Distribution satellite multiswitch'] },
            ].map((fam, idx) => (
              <div key={idx} className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden hover:border-[#e8a825]/40 transition-all flex flex-col justify-between shadow-md">
                <div className="p-3 text-center bg-[#e8a825]/[0.06] border-b border-white/10">
                  <div className="text-2xl mb-1">{fam.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#e8a825]">{fam.name}</div>
                </div>
                <div className="p-3 space-y-1 text-slate-400 text-[11px] font-sans">
                  {fam.feats.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-[#e8a825] font-bold">·</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-500/10 text-[#e8a825] text-lg">🏗️</span>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#e8a825]">Intégration Multi-Systèmes</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-[#e8a825] font-bold">›</span> Intégrateur système : maîtrise de tous les sous-systèmes et de leur interconnexion unifiée.</li>
                <li className="flex items-start gap-2"><span className="text-[#e8a825] font-bold">›</span> Plateforme de supervision unique : interface unique pour CCTV, accès, incendie et GTB.</li>
                <li className="flex items-start gap-2"><span className="text-[#e8a825] font-bold">›</span> Protocoles d'intégration : BACnet, Modbus, OPC-UA, webhooks REST API.</li>
                <li className="flex items-start gap-2"><span className="text-[#e8a825] font-bold">›</span> Déclenchements croisés : alarme incendie → arrêt CVC → déverrouillage automatique issues de secours.</li>
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 text-lg">📐</span>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">Câblage Structuré — Niveaux</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-sky-400 font-bold">›</span> Cat6 : 1 Gbps / 250 MHz — standard actuel pour LAN d'entreprise tertiaire.</li>
                <li className="flex items-start gap-2"><span className="text-sky-400 font-bold">›</span> Cat6A : 10 Gbps / 500 MHz jusqu'à 100m — data centers et hôtels 4-5 étoiles.</li>
                <li className="flex items-start gap-2"><span className="text-sky-400 font-bold">›</span> Fibre OM3/OM4 : multimode, 10 Gbps jusqu'à 300-400m — backbones verticaux.</li>
                <li className="flex items-start gap-2"><span className="text-sky-400 font-bold">›</span> Fibre OS2 : monomode 9µm, longue distance inter-bâtiments campus.</li>
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 text-lg">🔌</span>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400">PoE — Power over Ethernet</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">›</span> 802.3af (PoE) : 15.4W par port — caméras fixes, téléphones VoIP.</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">›</span> 802.3at (PoE+) : 30W par port — caméras PTZ, bornes WiFi 6 bi-bandes.</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">›</span> 802.3bt (PoE++) : 60-90W — écrans de signalisation, ventouses, caméras thermiques.</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">›</span> Avantage Afrique : une seule infrastructure cuivre réseau + alimentation sans double prise.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB B: RESEAUX ET CABLAGE */}
      {activeTab === 'reseaux' && (
        <div className="space-y-6">
          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-white/10 pb-2">
              🌐 Architecture Réseau Bâtiment Tertiaire
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🏠', name: 'Baie de Brassage (Rack 19")', desc: 'Standard 19 pouces, de 9U (mural) à 42U. Patch panel Cat6, passe-câbles 1U, switchs, onduleur rackable et PDU monitoré.' },
                { icon: '🔵', name: 'Switch PoE Manageable', desc: '24 ou 48 ports Gigabit, 4 SFP+ 10G uplink fibre. VLANs 802.1Q (segmentation LAN, CCTV, VoIP, WiFi), QoS voix, budget PoE 370-740W.' },
                { icon: '📡', name: 'Point d\'Accès WiFi 6', desc: 'Norme 802.11ax, OFDMA, MU-MIMO. Alimenté en PoE+. Couverture 150-200m². Multi-SSID avec portail captif visiteurs et WPA3 Enterprise.' },
                { icon: '💾', name: 'Salle Serveurs / DataRoom', desc: 'Climatisation de précision (22°C ±1°C), UPS onduleur double conversion (N+1), plancher technique, extinction automatique FM-200/Novec.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-sky-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-white/10 pb-2">
              📡 Fibre Optique — Types et Mise en Œuvre
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🟠', name: 'Fibre OM3 Multimode', desc: '50µm cœur, gaine turquoise. 10 Gbps jusqu\'à 300m. Connecteurs LC Duplex. Idéal liaisons inter-étages et backbones verticaux bâtiment.' },
                { icon: '🟡', name: 'Fibre OS2 Monomode', desc: '9µm cœur, gaine jaune. 10 à 100 Gbps sur 10 à 80km. Connecteurs LC/SC/FC. Liaison inter-bâtiments campus et pénétration opérateur FAI.' },
                { icon: '🔧', name: 'Épissure Fusion', desc: 'Soudure par arc électrique avec soudeuse de précision (Fujikura, Sumitomo). Atténuation < 0.02 dB/épissure. Protection par manchon thermo-rétractable.' },
                { icon: '📊', name: 'Réflectométrie OTDR', desc: 'Mesure de courbe d\'atténuation, localisation précise des défauts et des épissures. Cahier de recette obligatoire pour réception de chantier.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-teal-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB C: SECURITE ELECTRONIQUE */}
      {activeTab === 'securite' && (
        <div className="space-y-6">
          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-2">
              📹 Vidéosurveillance IP — Conception Système
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '📷', name: 'Caméra Dôme IP', desc: 'Résolution 2 à 8 MP (4K), compression H.265+, indice IP67 et anti-vandale IK10. Vision IR 30-50m, PoE 802.3af, profil ONVIF S/T.' },
                { icon: '🔭', name: 'Caméra PTZ Extérieure', desc: 'Pan/Tilt/Zoom motorisé 360°, zoom optique 20× à 36×, auto-tracking de cibles, éclairage IR laser 150m, alimentation PoE+ 30W.' },
                { icon: '💾', name: 'NVR Réseau RAID', desc: 'Enregistreur 16 à 64 canaux, double carte réseau Gigabit, grappe disques durs Surveillance en RAID5, calcul stockage sur 30 jours.' },
                { icon: '🖥️', name: 'Station VMS Centralisée', desc: 'Logiciel de gestion vidéo (HikCentral, Milestone XProtect, Genetec). Mur d\'écrans, recherche intelligente et alertes franchissement de ligne.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-purple-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/10 pb-2">
              🔐 Contrôle d'Accès — Architecture Complète
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🏷️', name: 'Lecteur Badges RFID', desc: 'Technologie haute sécurité 13.56 MHz (MIFARE DESFire EV2/EV3), protocole OSDP v2 chiffré, clavier à code anti-espion, indice IP66.' },
                { icon: '👆', name: 'Lecteur Biométrique', desc: 'Reconnaissance faciale 3D infrarouge et empreinte digitale. Temps d\'identification < 0.2s, détection de faux visages photo/vidéo.' },
                { icon: '⚙️', name: 'Contrôleur de Porte IP', desc: 'Boîtier autonome gérant 2 à 4 portes. Mémoire locale des badges et des événements (mode dégradé sans coupure), batterie 12V secours.' },
                { icon: '🚪', name: 'Verrouillage / Ventouses', desc: 'Ventouse électromagnétique 300-600 kg (fail-safe : libération automatique sur alarme incendie), gâche à émission, bouton poussoir vert.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-cyan-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-white/10 pb-2">
              🚨 Intrusion &amp; Alarme Anti-Effraction
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '👁️', name: 'Détecteur IRP Double Techno', desc: 'Infrarouge passif + hyperfréquence radar. Réduction drastique des fausses alarmes en milieu tropical chaud. Portée 15m à 90°, immunité animaux.' },
                { icon: '🖥️', name: 'Centrale Alarme Grade 3', desc: 'Conforme EN 50131 Grade 3 (banques, bijouteries, sites industriels). Partitionnement par zones, bus surveillé anti-sabotage, autonomie 24h.' },
                { icon: '📱', name: 'Transmetteur 4G + IP', desc: 'Transmission multi-vecteurs redondante : Ethernet principal + GSM/4G de secours. Protocoles SIA DC-09 et Contact ID vers télésurveilleur.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-rose-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB D: DETECTION INCENDIE */}
      {activeTab === 'incendie' && (
        <div className="space-y-6">
          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-red-400 border-b border-white/10 pb-2">
              🔥 Système de Sécurité Incendie (SSI) — Architecture
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🔴', name: 'Détecteur Fumée Optique', desc: 'Principe chambre noire à effet Tyndall. Idéal pour détection précoce des feux couvant lents. Norme EN 54-7. Espacement max 7.5m.' },
                { icon: '🌡️', name: 'Détecteur Chaleur Thermovélo.', desc: 'Mesure montée rapide de température (>10°C/min) ou seuil fixe 58°C/78°C. Idéal cuisines, parkings, locaux techniques (EN 54-5).' },
                { icon: '🚨', name: 'Déclencheur Manuel DMI', desc: 'Boîtier rouge à membrane déformable ou bris de glace. Hauteur 1.30m-1.50m. Câble résistant au feu CR1-C1 (norme EN 54-11).' },
                { icon: '🖥️', name: 'Centrale ECS Adressable', desc: 'Équipement de Contrôle et de Signalisation. Jusqu\'à 250 points par boucle fermée. Asservissements portes coupe-feu, désenfumage, coupure CVC.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-red-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              🔊 Sonorisation d'Évacuation Vocale — Système PA/VA
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '🔊', name: 'Ligne 100V & Enceintes EN 54-24', desc: 'Haut-parleurs plafonniers ou projecteurs de son certifiés EN 54-24 avec transformateur 100V et bornier céramique fusible thermique.' },
                { icon: '🎛️', name: 'Baie PA/VA Redondante', desc: 'Amplificateurs de sécurité classe D avec surveillance continue d\'impédance de ligne (détection court-circuit/coupure) et secours automatique N+1.' },
                { icon: '🎯', name: 'Mesure Intelligibilité STI-PA', desc: 'Indice de transmission de la parole STI ≥ 0.50 exigé en tout point du bâtiment pour garantir que les messages d\'évacuation sont audibles et compris.' }
              ].map((eq, i) => (
                <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3.5 space-y-1.5 hover:border-amber-500/40 transition-all">
                  <div className="text-2xl">{eq.icon}</div>
                  <div className="font-mono text-xs font-bold uppercase text-white">{eq.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB E: NORMES PRINCIPALES */}
      {activeTab === 'normes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#e8a825]">EN 54</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Détection Incendie</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#e8a825]">TIA-568</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Câblage Structuré</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#e8a825]">ONVIF</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Interopérabilité CCTV</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#e8a825]">IEC 62676</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Vidéosurveillance</div>
            </div>
            <div className="bg-[#0f1829] border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-mono font-bold text-[#e8a825]">EN 50131</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Alarme Intrusion</div>
            </div>
          </div>

          <div className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Intitulé &amp; Domaine d'Application</th>
                  <th className="p-3 w-44">Usage Terrain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { ref: 'EN 54', badge: 'Incendie', badgeColor: 'bg-red-500/20 text-red-300', title: 'Systèmes de détection et d\'alarme incendie. Partie 1 (généralités), 2 (ECS), 4 (alimentations), 5 (chaleur), 7 (fumée optique), 11 (déclencheurs manuels), 14 (règles d\'installation). Standard obligatoire Afrique francophone.', usage: 'Détection incendie certifiée' },
                  { ref: 'NFPA 72', badge: 'Incendie US', badgeColor: 'bg-red-500/20 text-red-300', title: 'National Fire Alarm and Signaling Code. Référence américaine exigée dans les ambassades, hôtels des chaînes internationales (Hilton, Radisson) et installations pétrolières.', usage: 'Projets financements US / hôtels' },
                  { ref: 'IEC 62676', badge: 'CCTV', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'Systèmes de vidéosurveillance pour la sécurité. Définition des critères d\'identification, reconnaissance, détection et observation (critères DORI). Référence pour appels d\'offres publics.', usage: 'Spécification CCTV HD' },
                  { ref: 'ONVIF', badge: 'CCTV Protocol', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'Open Network Video Interface Forum. Profils S (flux vidéo), T (analyse vidéo avancée), G (stockage NVR), M (métadonnées IA). Garantit l\'interopérabilité multimarques.', usage: 'Interopérabilité caméras / NVR' },
                  { ref: 'TIA-568', badge: 'Réseaux', badgeColor: 'bg-sky-500/20 text-sky-300', title: 'Commercial Building Telecommunications Cabling Standard. Cat5e, Cat6, Cat6A. Longueur max permanente 90m + 10m cordons. Tests obligatoires : affaiblissement, NEXT, RL.', usage: 'Recette câblage structuré LAN' },
                  { ref: 'ISO/IEC 11801', badge: 'Réseaux ISO', badgeColor: 'bg-sky-500/20 text-sky-300', title: 'Generic cabling for customer premises. Équivalent international de la norme TIA. Classes D (Cat5e), E (Cat6), EA (Cat6A). Référence des bureaux d\'études au Cameroun.', usage: 'Câblage structuré international' },
                  { ref: 'EN 50131', badge: 'Intrusion', badgeColor: 'bg-purple-500/20 text-purple-300', title: 'Systèmes d\'alarme contre l\'intrusion et le hold-up. Grades 1 à 4 selon la criticité du site (Grade 2 résidentiel, Grade 3 banques et commerces sensibles, Grade 4 sites militaires).', usage: 'Alarmes banques & commerces' },
                  { ref: 'IEC 60849 / EN 60849', badge: 'PA/VA', badgeColor: 'bg-amber-500/20 text-amber-300', title: 'Systèmes sonores pour situations d\'urgence. Exigences d\'intelligibilité (STI-PA ≥ 0.5), surveillance permanente des lignes et alimentation secourue par batteries.', usage: 'Évacuation vocale dans ERP' },
                  { ref: 'IEC 60839-11', badge: 'Contrôle Accès', badgeColor: 'bg-cyan-500/20 text-cyan-300', title: 'Systèmes de contrôle d\'accès électronique. Exigences fonctionnelles et environnementales pour lecteurs, contrôleurs et logiciels de gestion des accès.', usage: 'Accès sécurisé entreprises' },
                  { ref: 'NFS 61-932', badge: 'Français ERP', badgeColor: 'bg-emerald-500/20 text-emerald-300', title: 'Règles d\'installation des systèmes de sécurité incendie (SSI). Norme française appliquée au Cameroun définissant les catégories de SSI (A à E) selon le classement ERP.', usage: 'Réception SSI avec sapeurs-pompiers' }
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

      {/* 8. TAB F: COMPETENCES */}
      {activeTab === 'competences' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#e8a825] flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#e8a825] rounded-sm" />
                Conception Systèmes Intégrés
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Concevoir un système courants faibles intégré (réseau + CCTV + accès + incendie)',
                  'Établir un plan de câblage structuré avec zones, baies et chemins de câbles',
                  'Dimensionner un système CCTV : nombre de caméras, résolution, débit, stockage (To)',
                  'Concevoir une installation de détection incendie selon EN 54 et NFS 61-932',
                  'Rédiger un cahier des charges courants faibles (CCTP) pour un hôtel ou mall',
                  'Choisir les équipements selon critères techniques, robustesse tropicale et budget',
                  'Coordonner les courants faibles avec le lot électricité CFO et le lot CVC'
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
                Installation &amp; Configuration
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Poser et connecter un câblage structuré Cat6 : repérage, keystones, patch panels',
                  'Réaliser une épissure sur fibre optique et mesurer la perte avec réflectomètre OTDR',
                  'Configurer un switch manageable : segmentation VLANs (Data, CCTV, VoIP) avec QoS',
                  'Configurer et enregistrer des caméras IP sur NVR (ONVIF, IP statique, PoE budget)',
                  'Programmer une centrale d\'alarme intrusion (zones, temporisations, transmetteur 4G)',
                  'Mettre en service une centrale incendie adressable (adressage, asservissements)',
                  'Paramétrer un système de contrôle d\'accès (badges, droits, plannings horaires)'
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
                Tests &amp; Réception
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Tester le câblage cuivre : certification avec Fluke DSX CableAnalyzer (rapport PASS)',
                  'Mesurer et certifier une liaison fibre optique avec OTDR (bilan optique complet)',
                  'Effectuer les essais de réception du système incendie (tests fumée réelle + asservissements)',
                  'Mesurer le STI-PA d\'une installation de sonorisation d\'évacuation (seuil ≥ 0.50)',
                  'Vérifier les champs de vision caméras conformes aux exigences DORI du client',
                  'Rédiger le PV de réception SSI avec la commission de sécurité des sapeurs-pompiers',
                  'Constituer le DOE complet : plans de récolement as-built, fiches techniques, manuels'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-red-400 rounded-sm" />
                Maintenance &amp; Évolutions
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {[
                  'Réaliser la maintenance préventive annuelle SSI (test 100% détecteurs + centrale + batteries)',
                  'Effectuer la maintenance trimestrielle de l\'alarme intrusion (test des transmissions GSM/IP)',
                  'Diagnostiquer une panne réseau LAN complexe (boucle réseau, défaut câble, collision IP)',
                  'Remplacer une caméra IP défectueuse et reconfigurer sur NVR sans perte d\'historique',
                  'Mettre à jour les firmwares de sécurité des switches et caméras (gestion des vulnérabilités)',
                  'Étendre un système existant : ajout de caméras et badges sans perturber l\'exploitation',
                  'Extraire et sécuriser des séquences vidéo sur réquisition judiciaire (chaîne de preuve)'
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
          <div className="relative bg-gradient-to-br from-[#0f1829] to-[#e8a825]/10 border border-[#e8a825]/30 rounded-xl p-6 overflow-hidden">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8a825] font-bold mb-2">
              Objectif Final — Domaine 08
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed italic font-sans">
              Maîtriser l'intégration complète des systèmes de courants faibles : <strong className="text-[#e8a825] font-bold not-italic">concevoir, installer, configurer, tester et maintenir</strong> l'ensemble des sous-systèmes (réseau, CCTV, accès, incendie, sonorisation, interphonie) dans tout type de bâtiment — de la villa au complexe hôtelier — avec une approche intégrée qui constitue le cœur de l'expertise terrain ElectroCopilot en Afrique.
            </p>
          </div>
        </div>
      )}

      {/* 9. TAB G: CALCULS CLES */}
      {activeTab === 'formules' && (
        <div className="space-y-4">
          {[
            {
              name: 'Stockage CCTV',
              sub: 'Capacité disque dur NVR',
              expr: 'V = (N_cam × Débit_Mbps × 3600 × H × J) / (8 × 1024)',
              vars: 'V = volume stockage (Go) · N_cam = nb caméras · Débit = bitrate moyen (Mbps) · H = heures/jour · J = jours de rétention',
              note: 'Exemple : 16 caméras 4MP en H.265 à 4 Mbps, 24h/24 pendant 30 jours → V = (16 × 4 × 3600 × 24 × 30) / (8 × 1024 × 1024) ≈ 7.7 To. Choisir 8 To net, soit 2 disques de 8 To en RAID1 pour redondance. Ajouter 20% de marge pour les enregistrements sur événement.',
              std: 'IEC 62676 · ONVIF Profile G'
            },
            {
              name: 'Pression Acoustique',
              sub: 'Sonorisation d\'évacuation 100V',
              expr: 'Lp = Ls + 10·log(P / P_ref) - 20·log(d)',
              vars: 'Lp = niveau reçu (dB SPL) · Ls = sensibilité enceinte (dB/1W/1m) · P = puissance injectée (W) · d = distance (m)',
              note: 'Enceinte plafond sensibilité 95 dB SPL/1W/1m alimentée en 4W à 5m de distance : Lp = 95 + 10·log(4) - 20·log(5) = 95 + 6.0 - 14.0 = 87 dB SPL. Exigence sécurité : au minimum 65 dB SPL partout et +10 dB au-dessus du bruit ambiant.',
              std: 'IEC 60849 · EN 60268-16'
            },
            {
              name: 'Budget PoE Switch',
              sub: 'Vérification alimentation PoE',
              expr: 'P_total = Σ(P_PoE_i) ≤ P_budget_switch',
              vars: 'P_PoE_i = puissance appelée par chaque équipement (W) · P_budget = puissance max PoE du switch (W)',
              note: 'Switch 24 ports budget 370W : 12 caméras IP (15.4W = 184.8W) + 8 AP WiFi 6 (25.5W = 204W) + 4 interphones (6.5W = 26W) → Total = 414.8W > 370W : DÉPASSEMENT. Solution : ajouter un second switch PoE ou injecteur midspan.',
              std: 'IEEE 802.3af/at/bt'
            },
            {
              name: 'Atténuation Câble Cat6',
              sub: 'Critères certification TIA-568',
              expr: 'IL_max ≤ 20.9 dB à 250 MHz pour canal 100m',
              vars: 'IL = Insertion Loss · Longueur max = 90m lien permanent + 10m cordons brassage/utilisateur',
              note: 'Critères obligatoires Fluke CableAnalyzer pour un résultat PASS : Perte d\'insertion ≤ 20.9 dB, NEXT ≥ 44.3 dB, PSNEXT ≥ 42.3 dB, Return Loss ≥ 18.0 dB, Propagation delay ≤ 555 ns, Delay skew ≤ 45 ns. Un seul FAIL = recâblage obligatoire.',
              std: 'TIA-568.2-D · ISO/IEC 11801'
            },
            {
              name: 'Champ de Vision Caméra',
              sub: 'Angle et focale optique',
              expr: 'Champ horizontal H = 2 × d × tan(θ / 2)',
              vars: 'H = largeur champ visible (m) · d = distance cible (m) · θ = angle horizontal de l\'objectif',
              note: 'Caméra grand angle 2.8mm (capteur 1/2.8", angle θ ≈ 103°) à 5m : H = 2 × 5 × tan(51.5°) ≈ 12.5m de largeur couverte. Pour identifier un visage selon EN 62676 (critère DORI : 250 pixels/m), la distance max avec 4MP est d\'environ 6m.',
              std: 'IEC 62676-4 (Critères DORI)'
            },
            {
              name: 'Espacement Détecteur Incendie',
              sub: 'Rayon de couverture EN 54-14',
              expr: 'Rayon r_optique = 7.5m · Rayon r_thermique = 5.3m',
              vars: 'Surface couverte = π × r² (≈ 176m² pour fumée) · Hauteur sous plafond max = 12m (fumée) / 7.5m (chaleur)',
              note: 'Pour un local rectangulaire sans obstacle, l\'espacement maximal entre deux détecteurs de fumée est de 2 × 7.5m × 0.707 = 10.6m, et la distance maximale à tout mur est de 7.5m. Réduire les espacements en présence de poutres ou forte ventilation.',
              std: 'EN 54-14 · NFS 61-932'
            },
          ].map((calc, idx) => (
            <div key={idx} className="bg-[#0f1829] border border-white/10 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 hover:border-[#e8a825]/40 transition-all">
              <div className="md:col-span-3 p-4 bg-[#e8a825]/[0.06] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                <div className="font-mono text-sm font-bold text-[#e8a825] uppercase">{calc.name}</div>
                <div className="text-[11px] text-slate-400 italic font-mono">{calc.sub}</div>
              </div>
              <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center bg-black/20">
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-300">{calc.expr}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">{calc.vars}</div>
              </div>
              <div className="md:col-span-4 p-4 flex flex-col justify-center">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{calc.note}</p>
                <div className="font-mono text-[10px] text-[#e8a825]/70 mt-2">{calc.std}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10. TAB H: CONTEXTE AFRICAIN */}
      {activeTab === 'afrique' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#e8a825] flex items-center gap-2">
                <span>⭐</span> Marché Courants Faibles — Cameroun &amp; Afrique Centrale
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Hôtels :</strong> Hilton, Radisson, Pullman Douala → vidéosurveillance, accès RFID, SSI, sonorisation, WiFi → chantiers de 50 à 300 MFCFA.</div>
                <div><strong className="text-white">Centres commerciaux :</strong> Douala Grand Mall, Bastos Mall → sécurité électronique intégrée multi-boutiques.</div>
                <div><strong className="text-white">Secteur Bancaire :</strong> Afriland, UBA, BICEC, Société Générale → contrôle d'accès biométrique Grade 3, caméras IP HD et sas sécurisés.</div>
                <div><strong className="text-white">Secteur Médical :</strong> CHU Yaoundé, Hôpital Général, cliniques privées → appel infirmière, SSI, contrôle d'accès blocs opératoires.</div>
                <div><strong className="text-white">Campus Universitaires :</strong> UY1, UY2, Univ. Douala → câblage structuré fibre campus, WiFi haute densité et contrôle d'accès.</div>
                <div><strong className="text-white">Industries :</strong> huileries, brasseries → vidéosurveillance des chaînes d'embouteillage, contrôle d'accès pont-bascule.</div>
                <div><strong className="text-white">Missions Diplomatiques :</strong> Ambassades USA, France, Chine → normes strictes (ONVIF Profile T, certifications NFPA).</div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span>⚠️</span> Défis Terrain — Systèmes Courants Faibles en Afrique
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Chaleur &amp; humidité :</strong> baies de brassage dans locaux non ventilés → pannes précoces des switches → climatisation dédiée obligatoire.</div>
                <div><strong className="text-white">Surtensions réseau :</strong> foudre tropicale + coupures Eneo → parafoudres RJ45 PoE et parafoudres d'alimentation obligatoires.</div>
                <div><strong className="text-white">Coupures électriques :</strong> NVR ou switches éteints sans onduleur → perte d'images critiques → autonomie UPS de 30 min minimum.</div>
                <div><strong className="text-white">Connectivité Internet :</strong> transmission d'alarmes via double vecteur : fibre optique principale + modem 4G de secours.</div>
                <div><strong className="text-white">Qualité des câbles :</strong> prolifération de câbles CCA (aluminium cuivré) non conformes → exiger du 100% cuivre certifié.</div>
                <div><strong className="text-white">Fausses alarmes SSI :</strong> insectes, poussière rouge → détecteurs combinés double technologie (optique + thermique).</div>
              </div>
            </div>

            <div className="bg-[#0f1829] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span>💰</span> Modèle Économique — Intégrateur Courants Faibles
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Structure de marge :</strong> matériel (50-60%), main d'œuvre spécialisée (20%), études et ingénierie (10%) → marge nette 15 à 25%.</div>
                <div><strong className="text-white">Contrats de maintenance SSI :</strong> 5 à 8% de la valeur de l'installation par an → obligation réglementaire pour les ERP.</div>
                <div><strong className="text-white">Contrat MCO Vidéosurveillance :</strong> 3 à 5% par an incluant nettoyage régulier des dômes, vérification disques et mises à jour.</div>
                <div><strong className="text-white">Télémaintenance sécurisée :</strong> accès VPN sécurisé pour diagnostic à distance sans déplacement sur site.</div>
                <div><strong className="text-white">Formations d'exploitation :</strong> sessions de formation du personnel de sécurité (200 000 à 500 000 FCFA).</div>
                <div><strong className="text-white">Audits de sécurité électronique :</strong> diagnostic de l'existant + préconisations : 500 000 à 2 000 000 FCFA.</div>
              </div>
            </div>

            {/* Practical Case Study */}
            <div className="bg-[#0f1829] border border-amber-500/30 rounded-xl p-5 space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24] flex items-center gap-2">
                <span>🔧</span> Cas Pratique Réel — Hôtel 80 Chambres à Yaoundé
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <div><strong className="text-white">Réseau LAN :</strong> 200 prises Cat6 + 4 baies de brassage + 20 bornes WiFi 6 UniFi + switchs PoE par étage avec liaisons fibre OM3.</div>
                <div><strong className="text-white">CCTV :</strong> 32 caméras IP 4MP (Hikvision) → NVR 16 To RAID5 → rétention 30 jours → supervision sur mur d'écrans à la réception.</div>
                <div><strong className="text-white">Contrôle d'Accès :</strong> 15 portes d'accès contrôlées + badges RFID MIFARE + logiciel centralisé + asservissement aux caméras.</div>
                <div><strong className="text-white">SSI Incendie :</strong> 120 détecteurs adressables combinés + 12 déclencheurs DMI + centrale Hochiki + asservissements portes coupe-feu.</div>
                <div><strong className="text-white">Sonorisation :</strong> 80 enceintes plafonniers 100V + amplificateurs de sécurité + micro pupitre d'évacuation vocale (STI ≥ 0.52).</div>
                <div><strong className="text-white">Téléphonie :</strong> 40 postes VoIP SIP pour les chambres et services administratifs avec PABX IP.</div>
                <div><strong className="text-white">Budget réalisé :</strong> 180 à 250 MFCFA (fourniture, pose et mise en service complète).</div>
                <div><strong className="text-white">Contrat MCO annuel :</strong> 12 MFCFA/an sur 5 ans = 60 MFCFA de revenus récurrents sécurisés.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. DOMAIN FOOTER */}
      <footer className="bg-gradient-to-r from-[#1a1500] via-[#1f1a00] to-[#1a1500] border-t-2 border-[#e8a825] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <div className="text-[#fbbf24] italic font-semibold">
          « Connecter, sécuriser, surveiller — l'intelligence du bâtiment moderne. »
        </div>
        <div className="text-slate-500 text-[10px] uppercase tracking-wider">
          ElectroCopilot · Domaine 08/10 · Courants Faibles &amp; Systèmes Spéciaux · EN 54 · TIA-568 · Cameroun
        </div>
      </footer>

    </div>
  );
};
