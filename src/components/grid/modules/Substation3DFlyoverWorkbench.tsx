import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  RotateCw, 
  Thermometer, 
  Gauge, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  Info
} from 'lucide-react';

interface SubstationNode {
  id: string;
  name: string;
  type: string;
  voltageRatio: string;
  location: string;
  role: string;
  installedMVA: number;
  busbars: 'Double Jeu de Barres 225 kV + Tronçonnement' | 'Simple Jeu de Barres 110 kV' | 'Double Jeu de Barres 90 kV';
  baysCount: number;
  sf6PressureBar: number;
  transformerOilTempC: number;
}

interface BayApparatus {
  id: string;
  name: string;
  code: string;
  status: 'CLOSED' | 'OPEN';
  type: 'DISJONCTEUR_SF6' | 'SECTIONNEUR_AIGUILLAGE' | 'SECTIONNEUR_TERRE' | 'TRANSFO_DE_MESURE' | 'PARAFOUDRE_ZNO';
  telemetry: string;
  healthPct: number;
}

export const Substation3DFlyoverWorkbench: React.FC = () => {
  const substations: SubstationNode[] = [
    {
      id: 'mangombe',
      name: 'Poste d\'Interconnexion de Mangombé (Edéa)',
      type: 'Nœud Central National & Dispatching SONATREL',
      voltageRatio: '225 / 90 / 30 / 15 kV',
      location: 'Edéa, Sanaga-Maritime',
      role: 'Cœur névralgique de transport du Cameroun, aiguillage des énergies de Songloulou, Edéa et Nachtigal vers Douala et Yaoundé.',
      installedMVA: 360,
      busbars: 'Double Jeu de Barres 225 kV + Tronçonnement',
      baysCount: 16,
      sf6PressureBar: 6.2,
      transformerOilTempC: 58.4
    },
    {
      id: 'nomayos',
      name: 'Poste d\'Interconnexion de Nomayos (Yaoundé Sud)',
      type: 'Poste d\'Injection Capitale & Interconnexion Sud',
      voltageRatio: '225 / 90 / 15 kV',
      location: 'Nomayos, Entrée Sud de Yaoundé',
      role: 'Point de réception 225 kV de l\'énergie de Memve\'ele et raccordement de la boucle 90 kV ceinturant Yaoundé.',
      installedMVA: 240,
      busbars: 'Double Jeu de Barres 225 kV + Tronçonnement',
      baysCount: 12,
      sf6PressureBar: 6.1,
      transformerOilTempC: 52.1
    },
    {
      id: 'bekoko',
      name: 'Poste Stratégique de Békoko (Douala Ouest)',
      type: 'Poste d\'Évacuation Pôle Économique & Ouest',
      voltageRatio: '225 / 90 / 30 kV',
      location: 'Békoko, Sortie Ouest de Douala',
      role: 'Alimentation du corridor industriel Bonabéri, de l\'usine d\'eau de Yato et départ 225 kV vers le Littoral et l\'Ouest (Bafoussam).',
      installedMVA: 280,
      busbars: 'Double Jeu de Barres 225 kV + Tronçonnement',
      baysCount: 14,
      sf6PressureBar: 6.3,
      transformerOilTempC: 61.2
    },
    {
      id: 'nyom2',
      name: 'Poste d\'Interconnexion de Nyom II (Yaoundé Nord)',
      type: 'Tête d\'Évacuation Centrale Nachtigal',
      voltageRatio: '225 / 90 kV',
      location: 'Nyom, Haute-Sanaga / Centre',
      role: 'Réception des 420 MW de Nachtigal par double ligne 225 kV et redistribution vers la région du Centre et le Nord.',
      installedMVA: 300,
      busbars: 'Double Jeu de Barres 225 kV + Tronçonnement',
      baysCount: 10,
      sf6PressureBar: 6.0,
      transformerOilTempC: 49.8
    }
  ];

  const [selectedSubstationId, setSelectedSubstationId] = useState<string>('mangombe');
  const [selectedBay, setSelectedBay] = useState<string>('bay-trafo-1');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [cameraAngle, setCameraAngle] = useState<number>(35); // degrees
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const currentSubstation = substations.find(s => s.id === selectedSubstationId) || substations[0];

  const [baysApparatus, setBaysApparatus] = useState<Record<string, BayApparatus[]>>({
    'bay-trafo-1': [
      { id: 'app-1', name: 'Disjoncteur Général 225 kV (DJ1)', code: 'Q0-225', status: 'CLOSED', type: 'DISJONCTEUR_SF6', telemetry: 'I = 485 A | Pression SF6 = 6.2 bar | 42 ms', healthPct: 98 },
      { id: 'app-2', name: 'Sectionneur d\'Aiguillage Barre 1', code: 'QS1-225', status: 'CLOSED', type: 'SECTIONNEUR_AIGUILLAGE', telemetry: 'Verrouillé électriquement | Position Fermé', healthPct: 99 },
      { id: 'app-3', name: 'Sectionneur d\'Aiguillage Barre 2', code: 'QS2-225', status: 'OPEN', type: 'SECTIONNEUR_AIGUILLAGE', telemetry: 'Position Ouvert | Isolation galvanique', healthPct: 100 },
      { id: 'app-4', name: 'Transformateurs de Courant 225 kV', code: 'TC-225', status: 'CLOSED', type: 'TRANSFO_DE_MESURE', telemetry: 'Rapport 1000/1 A | Cl. 0.2S Comptage & 5P20 Protec', healthPct: 97 },
      { id: 'app-5', name: 'Parafoudres Haute Tension ZnO', code: 'PF-225', status: 'CLOSED', type: 'PARAFOUDRE_ZNO', telemetry: 'Courant de fuite 142 µA (Seuil max 300 µA)', healthPct: 95 }
    ],
    'bay-line-songloulou': [
      { id: 'app-6', name: 'Disjoncteur Ligne Songloulou 1', code: 'DJ-SL1', status: 'CLOSED', type: 'DISJONCTEUR_SF6', telemetry: 'I = 612 A | Déclencheur SEL-421 prêt', healthPct: 99 },
      { id: 'app-7', name: 'Sectionneur de Ligne avec MALT', code: 'QS-L1', status: 'CLOSED', type: 'SECTIONNEUR_AIGUILLAGE', telemetry: 'Terre ouverte | Verrouillage clé Ronis', healthPct: 100 },
      { id: 'app-8', name: 'Combiné Mesure Tension / Courant', code: 'TT-SL1', status: 'CLOSED', type: 'TRANSFO_DE_MESURE', telemetry: '225 kV / √3 : 100 V / √3 | f = 50.00 Hz', healthPct: 98 }
    ],
    'bay-bus-coupler': [
      { id: 'app-9', name: 'Disjoncteur de Couplage Barres', code: 'DJ-CPL', status: 'CLOSED', type: 'DISJONCTEUR_SF6', telemetry: 'Synchronisme barres vérifié | ΔV = 0.4 kV', healthPct: 100 },
      { id: 'app-10', name: 'Sectionneur Barres 1 Couplage', code: 'QS-CPL1', status: 'CLOSED', type: 'SECTIONNEUR_AIGUILLAGE', telemetry: 'Barre 1 225 kV sélectionnée', healthPct: 99 },
      { id: 'app-11', name: 'Sectionneur Barres 2 Couplage', code: 'QS-CPL2', status: 'CLOSED', type: 'SECTIONNEUR_AIGUILLAGE', telemetry: 'Barre 2 225 kV sélectionnée', healthPct: 99 }
    ]
  });

  const currentApparatusList = baysApparatus[selectedBay] || baysApparatus['bay-trafo-1'];

  const toggleApparatusStatus = (appId: string) => {
    setBaysApparatus(prev => {
      const updatedList = (prev[selectedBay] || []).map(app => {
        if (app.id === appId) {
          return { ...app, status: app.status === 'CLOSED' ? 'OPEN' : 'CLOSED' } as BayApparatus;
        }
        return app;
      });
      return { ...prev, [selectedBay]: updatedList };
    });
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
                <Box className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Jumeau Numérique BIM & Modélisation Isométrique 3D
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    IEC 61850 Substation Automation
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Survol 3D & Téléconduite des Postes Électriques Stratégiques
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Exploration détaillée des équipements haute tension (Transformateurs de puissance 120 MVA, disjoncteurs SF6, sectionneurs 
              d'aiguillage, jeux de barres et parafoudres) des 4 grands carrefours énergétiques de SONATREL.
            </p>
          </div>

          {/* Substation selector */}
          <div className="flex flex-wrap lg:flex-nowrap gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800 backdrop-blur-md">
            {substations.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubstationId(sub.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${
                  selectedSubstationId === sub.id 
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' 
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{sub.name.split(' ')[2] || sub.name.split(' ')[0]}</div>
                <div className="text-[10px] opacity-80 font-mono">{sub.voltageRatio.split(' ')[0]} kV</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Canvas + Bay Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Isometric Interactive Vector Canvas */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm">Vue Isométrique 3D du Poste HT</h3>
              </div>

              {/* Viewport controls */}
              <div className="flex items-center gap-2 text-xs">
                <button 
                  onClick={() => setCameraAngle(prev => (prev + 45) % 360)}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                  title="Faire pivoter l'angle de vue"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="font-mono">{cameraAngle}°</span>
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => prev === 100 ? 125 : prev === 125 ? 75 : 100)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  {zoomLevel}%
                </button>
              </div>
            </div>

            {/* SVG 3D Isometric View */}
            <div className="relative bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 overflow-hidden h-[340px] flex items-center justify-center">
              <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-teal-400 bg-teal-950/50 px-2.5 py-1 rounded-md border border-teal-500/30">
                <Activity className="w-3 h-3" />
                <span>FLUX SCADA ACTIF • IEC 61850 MMS</span>
              </div>

              <svg 
                viewBox="0 0 700 350" 
                className="w-full h-full transition-transform duration-500"
                style={{ transform: `scale(${zoomLevel / 100}) rotate(${cameraAngle * 0.05}deg)` }}
              >
                <defs>
                  <linearGradient id="groundIso" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0b1329" />
                    <stop offset="100%" stopColor="#040711" />
                  </linearGradient>
                  <linearGradient id="busbarGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="trafoMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Ground Platform Grid */}
                <polygon points="350,50 650,150 350,290 50,190" fill="url(#groundIso)" stroke="#1e293b" strokeWidth="1.5" />
                
                {/* Isometric Grid Lines */}
                <line x1="200" y1="120" x2="500" y2="220" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="350" y1="50" x2="350" y2="290" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="500" y1="100" x2="200" y2="240" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />

                {/* 225 kV Busbar 1 (Elevated Overhead) */}
                <g className="cursor-pointer">
                  <line x1="160" y1="90" x2="540" y2="90" stroke="url(#busbarGrad1)" strokeWidth="4" />
                  <text x="555" y="93" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">JDB-1 (225 kV)</text>
                  {/* Bus Supports */}
                  <line x1="220" y1="90" x2="220" y2="140" stroke="#475569" strokeWidth="2" />
                  <line x1="350" y1="90" x2="350" y2="170" stroke="#475569" strokeWidth="2" />
                  <line x1="480" y1="90" x2="480" y2="140" stroke="#475569" strokeWidth="2" />
                </g>

                {/* 225 kV Busbar 2 (Parallel Elevated Overhead) */}
                <g className="cursor-pointer">
                  <line x1="180" y1="115" x2="560" y2="115" stroke="#14b8a6" strokeWidth="4" />
                  <text x="575" y="118" fill="#2dd4bf" fontSize="10" fontFamily="monospace" fontWeight="bold">JDB-2 (225 kV)</text>
                  <line x1="240" y1="115" x2="240" y2="165" stroke="#475569" strokeWidth="2" />
                  <line x1="370" y1="115" x2="370" y2="195" stroke="#475569" strokeWidth="2" />
                  <line x1="500" y1="115" x2="500" y2="165" stroke="#475569" strokeWidth="2" />
                </g>

                {/* Power Transformer 1 (Autotransfo 120 MVA Isometric Box) */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => setSelectedBay('bay-trafo-1')}
                >
                  {/* Main Tank Body */}
                  <polygon points="320,180 380,180 395,210 335,210" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                  <polygon points="380,180 410,165 425,195 395,210" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <polygon points="320,180 350,165 410,165 380,180" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Radiator Banks / Conservator Tank */}
                  <rect x="355" y="152" width="26" height="8" rx="2" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="1" />
                  
                  {/* Bushings (Traversées 225 kV) */}
                  <line x1="340" y1="165" x2="340" y2="140" stroke="#f59e0b" strokeWidth="3" />
                  <line x1="365" y1="165" x2="365" y2="140" stroke="#f59e0b" strokeWidth="3" />
                  <line x1="390" y1="165" x2="390" y2="140" stroke="#f59e0b" strokeWidth="3" />

                  <circle cx="365" cy="195" r="4" fill="#10b981" className="animate-ping" />
                  <text x="365" y="230" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">ATR-1 (120 MVA)</text>
                  <text x="365" y="243" fill="#2dd4bf" fontSize="9" fontFamily="monospace" textAnchor="middle">225/90/15 kV • {currentSubstation.transformerOilTempC}°C</text>
                </g>

                {/* SF6 Circuit Breaker Column (Bay Trafo) */}
                <g className="cursor-pointer" onClick={() => setSelectedBay('bay-trafo-1')}>
                  <rect x="235" y="150" width="10" height="25" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" rx="2" />
                  <circle cx="240" cy="145" r="3" fill="#06b6d4" />
                  <text x="240" y="190" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">DJ1 (SF6)</text>
                </g>

                {/* SF6 Circuit Breaker Column (Bay Line) */}
                <g className="cursor-pointer" onClick={() => setSelectedBay('bay-line-songloulou')}>
                  <rect x="475" y="150" width="10" height="25" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="2" />
                  <circle cx="480" cy="145" r="3" fill="#10b981" />
                  <text x="480" y="190" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">DJ-LIGNE</text>
                </g>

                {/* Control Room / Shelter SCADA */}
                <polygon points="120,180 180,180 190,210 130,210" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <polygon points="180,180 200,165 210,195 190,210" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <polygon points="120,180 140,165 200,165 180,180" fill="#334155" stroke="#475569" strokeWidth="1" />
                <text x="155" y="225" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Bâtiment Commande</text>
              </svg>
            </div>

            {/* Bay Selector Switcher */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { id: 'bay-trafo-1', label: 'Travée Transformateur ATR-1 (225 kV)' },
                { id: 'bay-line-songloulou', label: 'Travée Ligne 225 kV Arrivée' },
                { id: 'bay-bus-coupler', label: 'Travée Couplage Barres JDB1 ⇄ JDB2' }
              ].map(bay => (
                <button
                  key={bay.id}
                  onClick={() => setSelectedBay(bay.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedBay === bay.id 
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {bay.label}
                </button>
              ))}
            </div>
          </div>

          {/* Substation specs footer */}
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-slate-500">Pression SF6: </span>
              <span className="text-emerald-400 font-bold">{currentSubstation.sf6PressureBar} bar</span>
            </div>
            <div>
              <span className="text-slate-500">Temp. Huile Cuve: </span>
              <span className="text-amber-400 font-bold">{currentSubstation.transformerOilTempC} °C</span>
            </div>
            <div>
              <span className="text-slate-500">Puissance Installée: </span>
              <span className="text-white font-bold">{currentSubstation.installedMVA} MVA</span>
            </div>
            <div>
              <span className="text-slate-500">Nombre de Travées: </span>
              <span className="text-teal-300 font-bold">{currentSubstation.baysCount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bay Telemetry & Apparatus Switcher */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-sm">Appareillage de la Travée</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Télécommande IEC 61850</span>
            </div>

            <div className="space-y-3">
              {currentApparatusList.map(app => (
                <div 
                  key={app.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{app.name}</span>
                      <span className="ml-2 font-mono text-[10px] text-teal-400">[{app.code}]</span>
                    </div>
                    <button
                      onClick={() => toggleApparatusStatus(app.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        app.status === 'CLOSED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                      }`}
                    >
                      {app.status === 'CLOSED' ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono">
                    {app.telemetry}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-500">Indice de Santé (Health Index):</span>
                    <span className="font-mono text-emerald-400 font-bold">{app.healthPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-teal-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Verrouillage inter-postes actif (Ronis / Électrique)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Asservissement des sectionneurs de terre et de barres conforme aux règles d'exploitation UTE C 18-510 & Code Réseau SONATREL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
