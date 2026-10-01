// src/components/production/HydroPowerhouseCutawayModal.tsx
// Physical cross-section cutaway of hydroelectric powerhouse (Francis / Pelton units)
import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  RotateCw, 
  Sliders, 
  Activity, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Waves,
  ArrowRight,
  Gauge
} from 'lucide-react';

interface HydroPowerhouseCutawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'fr' | 'en';
}

type UnitTopology = 'FRANCIS_VERTICAL' | 'PELTON_HORIZONTAL';

export const HydroPowerhouseCutawayModal: React.FC<HydroPowerhouseCutawayModalProps> = ({
  isOpen,
  onClose,
  locale = 'fr'
}) => {
  const [selectedTopology, setSelectedTopology] = useState<UnitTopology>('FRANCIS_VERTICAL');
  const [activeHotspotId, setActiveHotspotId] = useState<string>('scroll_case');
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(true);

  if (!isOpen) return null;

  const francisHotspots = [
    {
      id: 'scroll_case',
      tag: '01',
      x: 34,
      y: 62,
      name_fr: 'Bâche Spirale en Acier Soudé & Cercle Entretoises',
      name_en: 'Welded Steel Spiral Casing & Stay Ring',
      desc_fr: 'Distribuée autour de la roue pour assurer une vitesse circonférentielle constante et uniforme de l\'eau sur tout le pourtour (vitesse 12 à 18 m/s, pression jusqu\'à 25 bar).',
      desc_en: 'Distributes high-pressure penstock discharge evenly around the runner with constant circumferential velocity (12-18 m/s, up to 25 bar).',
      standard: 'IEC 60193 / IEC 60041'
    },
    {
      id: 'wicket_gates',
      tag: '02',
      x: 42,
      y: 62,
      name_fr: 'Directrices Mobiles & Cercle de Vannage (Wicket Gates)',
      name_en: 'Guide Vanes & Wicket Gate Operating Ring',
      desc_fr: 'Aubes directrices profilées orientables manœuvrées par servomoteurs oléopneumatiques haute pression (160 bar) pour réguler le débit turbiné selon la consigne de fréquence 50 Hz.',
      desc_en: 'Aerodynamic guide vanes pitched by dual 160 bar hydraulic servomotors regulating water discharge to govern grid frequency at 50 Hz.',
      standard: 'IEC 61362'
    },
    {
      id: 'francis_runner',
      tag: '03',
      x: 48,
      y: 65,
      name_fr: 'Roue Francis Monobloc Inox Martensitique (13Cr-4Ni)',
      name_en: 'Monoblock Francis Runner (13Cr-4Ni Martensitic Stainless)',
      desc_fr: 'Conversion de la pression et de la vitesse de l\'eau en couple mécanique sur l\'arbre. Aubes résistantes à la cavitation hydrodynamique et à l\'érosion abrasive des sables.',
      desc_en: 'Converts hydrostatic pressure and velocity into mechanical shaft torque. Cavitation-resistant blade geometry forged from 13Cr-4Ni stainless alloy.',
      standard: 'IEC 60609'
    },
    {
      id: 'draft_tube',
      tag: '04',
      x: 48,
      y: 84,
      name_fr: 'Aspirateur-Diffuseur Coudé (Draft Tube)',
      name_en: 'Elbow Draft Tube & Recovery Diffuser',
      desc_fr: 'Récupère l\'énergie cinétique résiduelle à la sortie de la roue par effet venturi divergent en créant une dépression hydraulique sous la roue, maximisant la chute nette efficace.',
      desc_en: 'Recovers residual kinetic energy discharge below runner via divergent diffuser column, generating sub-atmospheric suction that boosts total net head.',
      standard: 'IEC 60193'
    },
    {
      id: 'thrust_bearing',
      tag: '05',
      x: 48,
      y: 40,
      name_fr: 'Pivot Hydrodynamique à Patins Oscillants (Thrust Bearing)',
      name_en: 'Tilting-Pad Hydrodynamic Thrust & Guide Bearing',
      desc_fr: 'Supporte la poussée hydraulique axiale descendante colossale (800 à 1 500 tonnes) plus le poids des masses tournantes sous film d\'huile lubrifiant sous pression 200 bar (huile ISO VG 46/68).',
      desc_en: 'Sustains massive downward hydraulic thrust (800-1500 metric tons) plus rotor deadweight via pressurized oil film wedge on babbitted tilting pads.',
      standard: 'ISO 7919-5'
    },
    {
      id: 'hydro_generator',
      tag: '06',
      x: 48,
      y: 26,
      name_fr: 'Alternateur Synchrone Vertical à Pôles Saillants',
      name_en: 'Vertical Salient-Pole Synchronous Generator',
      desc_fr: 'Rotor multipolaire avec enroulement d\'excitation CC brushless, stator triphasé 15.75 kV en barres Roebel thermo-isolées sous résine époxy classe F (155°C), refroidissement air/eau.',
      desc_en: 'Salient-pole rotor with brushless exciter and 15.75 kV stator winding with transposition Roebel bars insulated with vacuum pressure impregnated (VPI) Class F resin.',
      standard: 'IEC 60034-1'
    },
    {
      id: 'overhead_crane',
      tag: '07',
      x: 48,
      y: 10,
      name_fr: 'Pont Roulant de Salle des Machines (2x 150 Tonnes)',
      name_en: 'Powerhouse Overhead Gantry Crane (2x 150t Tandem)',
      desc_fr: 'Permet le levage et la manutention lourde du rotor d\'alternateur, de l\'arbre vertical et de la roue pour révision quinquennale.',
      desc_en: 'Heavy-duty bridge crane dedicated to lifting the massive generator rotor, vertical shaft, and runner during major overhauls.',
      standard: 'FEM / ISO 4301'
    }
  ];

  const peltonHotspots = [
    {
      id: 'pelton_runner',
      tag: '01',
      x: 48,
      y: 50,
      name_fr: 'Roue Pelton Monobloc à Auges Doubles (Split Buckets)',
      name_en: 'Monoblock Pelton Runner with Split Double-Buckets',
      desc_fr: 'Roue à augets en acier inoxydable 13Cr-4Ni. L\'arête médiane sépare le jet cylindrique en deux nappes déviées à ~165°, restituant la quasi-totalité de la quantité de mouvement cinétique.',
      desc_en: 'Forged 13Cr-4Ni stainless runner. Central splitter knife cleaves water jet into two halves deflected at ~165°, capturing maximum momentum impulse.',
      standard: 'IEC 60193'
    },
    {
      id: 'pelton_injector',
      tag: '02',
      x: 24,
      y: 50,
      name_fr: 'Injecteur Hydraulique à Pointeau & Déflecteur de Jet',
      name_en: 'Spear Needle Injector & Jet Deflector',
      desc_fr: 'Pointeau profilé à commande hydraulique ajustant le diamètre du jet à haute vitesse (jusqu\'à 140 m/s sous 1 000 m de chute). Le déflecteur dévie le jet en 0.2 s en cas de déclenchement réseau pour éviter le coup de bélier.',
      desc_en: 'Hydraulically actuated spear needle throttling supersonic water jet (up to 140 m/s under 1000m head). Rapid auxiliary deflector cuts jet in 0.2s preventing penstock water hammer on load rejection.',
      standard: 'IEC 61362'
    },
    {
      id: 'pelton_casing',
      tag: '03',
      x: 48,
      y: 72,
      name_fr: 'Blindage de Cuve & Évacuation vers Canal de Fuite',
      name_en: 'Free-Discharge Casing & Tailrace Channel',
      desc_fr: 'Enceinte métallique ventilée à la pression atmosphérique empêchant les projections d\'eau de rebondir sur la roue et freinant le rotor.',
      desc_en: 'Atmospherically vented armor casing preventing splashing water from rebounding onto the runner, discharging smoothly into tailrace canal.',
      standard: 'IEC 60041'
    }
  ];

  const currentHotspots = selectedTopology === 'FRANCIS_VERTICAL' ? francisHotspots : peltonHotspots;
  const activeSpot = currentHotspots.find(h => h.id === activeHotspotId) || currentHotspots[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#090D15] border border-sky-500/40 shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A2333] bg-[#0E1422]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  GÉNIE ÉLECTROMÉCANIQUE HYDRO
                </span>
                <span className="text-[10px] font-mono text-slate-400">IEC 60193 / IEC 60034</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {locale === 'fr' ? 'Coupe d\'Usine Hydroélectrique & Salle des Machines' : 'Hydro Powerhouse Cross-Section Cutaway'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Top Controls: Topology Switcher */}
        <div className="p-4 bg-[#0B0F19] border-b border-[#1A2333] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Architecture Groupe :</span>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => {
                  setSelectedTopology('FRANCIS_VERTICAL');
                  setActiveHotspotId('scroll_case');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTopology === 'FRANCIS_VERTICAL'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Francis Axe Vertical (Moyenne Chute 30-400m)
              </button>
              <button
                onClick={() => {
                  setSelectedTopology('PELTON_HORIZONTAL');
                  setActiveHotspotId('pelton_runner');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTopology === 'PELTON_HORIZONTAL'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pelton à Jets Multiples (Haute Chute &gt; 250m)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWaterFlowing(!isWaterFlowing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                isWaterFlowing
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Waves className={`h-3.5 w-3.5 ${isWaterFlowing ? 'animate-pulse text-cyan-400' : ''}`} />
              <span>{isWaterFlowing ? 'Écoulement Actif' : 'Écoulement Figé'}</span>
            </button>
          </div>
        </div>

        {/* Content: Main Cutaway Vector Stage + Engineering Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Left / Center (8 cols): Cutaway Vector Graphic */}
          <div className="lg:col-span-8 p-6 bg-[#06090F] relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#1A2333] overflow-hidden">
            
            {/* Architectural Grid Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* SVG Engineering Cutaway */}
            <div className="relative w-full max-w-[620px] aspect-[4/3]">
              
              {selectedTopology === 'FRANCIS_VERTICAL' ? (
                <svg viewBox="0 0 600 450" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="steelShaft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                  </defs>

                  {/* Concrete Powerhouse Foundation / Structure */}
                  <path d="M 40 420 L 40 180 L 160 180 L 160 110 L 440 110 L 440 180 L 560 180 L 560 420 L 420 420 L 420 340 L 180 340 L 180 420 Z" fill="url(#concreteGrad)" stroke="#475569" strokeWidth="2" />
                  
                  {/* Overhead Crane Structure */}
                  <g>
                    <rect x="80" y="45" width="440" height="14" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                    <rect x="270" y="35" width="60" height="24" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                    <line x1="300" y1="59" x2="300" y2="85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="300" cy="90" r="5" fill="#f59e0b" />
                    <text x="300" y="30" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">PONT 2x 150t</text>
                  </g>

                  {/* Generator Stator Frame & Salient Poles */}
                  <rect x="200" y="115" width="200" height="75" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                  <rect x="220" y="125" width="160" height="55" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  {/* Stator core laminations */}
                  <rect x="225" y="130" width="30" height="45" fill="#ea580c" opacity="0.9" />
                  <rect x="345" y="130" width="30" height="45" fill="#ea580c" opacity="0.9" />
                  {/* Rotor Poles */}
                  <rect x="265" y="132" width="70" height="41" rx="3" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
                  <text x="300" y="156" fill="#090d15" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ROTOR 15.75 kV</text>

                  {/* Thrust Bearing & Oil Bath Housing */}
                  <rect x="250" y="195" width="100" height="24" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="300" cy="207" r="7" fill="#facc15" />
                  <text x="300" y="210" fill="#0f172a" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PIVOT</text>

                  {/* Vertical Steel Shaft */}
                  <rect x="292" y="145" width="16" height="150" fill="url(#steelShaft)" stroke="#475569" strokeWidth="1" />

                  {/* High-Pressure Penstock Inlet (Conduite Forcée) */}
                  <path d="M 40 280 L 190 280 L 190 320 L 40 320 Z" fill="url(#waterGrad)" stroke="#0284c7" strokeWidth="2" />
                  <text x="110" y="305" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">CONDUITE FORCÉE</text>

                  {/* Spiral Case (Bâche Spirale) */}
                  <ellipse cx="230" cy="300" rx="45" ry="32" fill="url(#waterGrad)" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="370" cy="300" rx="35" ry="25" fill="url(#waterGrad)" stroke="#38bdf8" strokeWidth="2" />

                  {/* Wicket Gates / Guide Vanes */}
                  <rect x="260" y="285" width="8" height="28" fill="#f8fafc" stroke="#334155" strokeWidth="1" transform="rotate(-15 264 299)" />
                  <rect x="332" y="285" width="8" height="28" fill="#f8fafc" stroke="#334155" strokeWidth="1" transform="rotate(15 336 299)" />

                  {/* Francis Runner */}
                  <g transform="translate(300, 300)">
                    <path d="M -25 -5 L 25 -5 L 20 25 L -20 25 Z" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
                    {/* Runner Curved Blades */}
                    <path d="M -18 0 Q -10 15 -14 25" stroke="#0f172a" strokeWidth="2" fill="none" />
                    <path d="M 0 0 Q 6 15 2 25" stroke="#0f172a" strokeWidth="2" fill="none" />
                    <path d="M 18 0 Q 22 15 16 25" stroke="#0f172a" strokeWidth="2" fill="none" />
                  </g>

                  {/* Draft Tube (Aspirateur divergent) */}
                  <path d="M 270 325 L 240 420 L 360 420 L 330 325 Z" fill="url(#waterGrad)" stroke="#0284c7" strokeWidth="2" />
                  <text x="300" y="390" fill="#f0f9ff" fontSize="9" fontFamily="monospace" textAnchor="middle">ASPIRATEUR (CANAL DE FUITE)</text>

                  {/* Hotspots Interactive Markers */}
                  {francisHotspots.map((spot) => (
                    <g 
                      key={spot.id} 
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setActiveHotspotId(spot.id)}
                    >
                      <circle 
                        cx={`${spot.x}%`} 
                        cy={`${spot.y}%`} 
                        r={activeHotspotId === spot.id ? 13 : 10} 
                        fill={activeHotspotId === spot.id ? '#0284c7' : '#0f172a'} 
                        stroke={activeHotspotId === spot.id ? '#38bdf8' : '#64748b'} 
                        strokeWidth="2" 
                      />
                      <text 
                        x={`${spot.x}%`} 
                        y={`${spot.y + 1}%`} 
                        fill="#ffffff" 
                        fontSize="9" 
                        fontFamily="monospace" 
                        textAnchor="middle" 
                        fontWeight="bold"
                      >
                        {spot.tag}
                      </text>
                    </g>
                  ))}
                </svg>
              ) : (
                <svg viewBox="0 0 600 450" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Pelton Cutaway Vector Graphic */}
                  <defs>
                    <linearGradient id="peltonWater" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>

                  {/* Powerhouse Vault */}
                  <rect x="50" y="40" width="500" height="370" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <rect x="70" y="60" width="460" height="330" rx="8" fill="#090d15" stroke="#1e293b" strokeWidth="1" />

                  {/* Central Pelton Runner Disc */}
                  <circle cx="330" cy="220" r="90" fill="#334155" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="330" cy="220" r="40" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="330" y="225" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ROUE PELTON</text>

                  {/* Double Buckets around the rim */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <g key={deg} transform={`rotate(${deg} 330 220)`}>
                      <path d="M 330 120 C 320 105 340 105 330 120" stroke="#f8fafc" strokeWidth="4" fill="#64748b" />
                      <circle cx="330" cy="115" r="7" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    </g>
                  ))}

                  {/* High Velocity Injector Nozzle & Needle Spear */}
                  <path d="M 90 205 L 180 205 L 220 216 L 220 224 L 180 235 L 90 235 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="170,220 215,220 185,214" fill="#f59e0b" />
                  <line x1="90" y1="220" x2="180" y2="220" stroke="#f59e0b" strokeWidth="4" />
                  <text x="140" y="195" fill="#f59e0b" fontSize="9" fontFamily="monospace">POINTEAU &amp; BUSE</text>

                  {/* Supersonic Water Jet hitting lower bucket */}
                  <line x1="220" y1="220" x2="330" y2="310" stroke="url(#peltonWater)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 330 310 Q 350 335 380 340" stroke="#38bdf8" strokeWidth="4" fill="none" opacity="0.8" />
                  <path d="M 330 310 Q 310 335 280 340" stroke="#38bdf8" strokeWidth="4" fill="none" opacity="0.8" />

                  {/* Tailrace free water outlet */}
                  <path d="M 220 370 L 440 370 L 440 400 L 220 400 Z" fill="#0284c7" opacity="0.7" />
                  <text x="330" y="390" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">CANAL DE FUITE À SURFACE LIBRE</text>

                  {/* Pelton Hotspots */}
                  {peltonHotspots.map((spot) => (
                    <g 
                      key={spot.id} 
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setActiveHotspotId(spot.id)}
                    >
                      <circle 
                        cx={`${spot.x}%`} 
                        cy={`${spot.y}%`} 
                        r={activeHotspotId === spot.id ? 13 : 10} 
                        fill={activeHotspotId === spot.id ? '#0284c7' : '#0f172a'} 
                        stroke={activeHotspotId === spot.id ? '#38bdf8' : '#64748b'} 
                        strokeWidth="2" 
                      />
                      <text 
                        x={`${spot.x}%`} 
                        y={`${spot.y + 1}%`} 
                        fill="#ffffff" 
                        fontSize="9" 
                        fontFamily="monospace" 
                        textAnchor="middle" 
                        fontWeight="bold"
                      >
                        {spot.tag}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-sky-400" />
              <span>{locale === 'fr' ? 'Cliquez sur les numéros de repère pour inspecter chaque sous-ensemble.' : 'Click numbered callout tags to inspect sub-assemblies.'}</span>
            </div>
          </div>

          {/* Right (4 cols): Detailed Engineering Inspector */}
          <div className="lg:col-span-4 p-5 bg-[#0A0E17] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#1A2333]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
                    {activeSpot.tag}
                  </span>
                  <span className="text-xs font-mono text-sky-400 font-bold uppercase">{activeSpot.standard}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {locale === 'fr' ? activeSpot.name_fr : activeSpot.name_en}
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="font-mono text-slate-400 uppercase text-[10px] font-bold">Fonction Électromécanique :</div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {locale === 'fr' ? activeSpot.desc_fr : activeSpot.desc_en}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-900/50 space-y-1.5 text-xs font-mono">
                <div className="text-sky-400 font-bold flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>Paramètres Critiques de Fonctionnement :</span>
                </div>
                <div className="text-slate-300 text-[11px] space-y-1 font-sans">
                  {selectedTopology === 'FRANCIS_VERTICAL' ? (
                    <>
                      <div>• Poussée axiale combinée : 1 250 tonnes supportée par le pivot d'huile</div>
                      <div>• Vitesse nominale : 150 à 375 tr/min (selon nombre de pôles)</div>
                      <div>• Vitesse d'emballement max : 1.8x la vitesse synchrone nominale</div>
                    </>
                  ) : (
                    <>
                      <div>• Vitesse du jet d'eau : 120 à 150 m/s sous 800-1 200 m de chute</div>
                      <div>• Temps de fermeture déflecteur : &lt; 0.25 s (décharge sans à-coup)</div>
                      <div>• Rendement au pic d'auget : 91.5% à 92.5%</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1A2333] flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Norme CEI Conforme</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Fermer
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
