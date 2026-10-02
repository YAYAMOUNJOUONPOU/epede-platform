import React, { useState } from 'react';
import { 
  Globe2, 
  ArrowRightLeft, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Leaf, 
  AlertTriangle, 
  Building2, 
  Layers, 
  Compass, 
  Info,
  CheckCircle2,
  Activity,
  Cpu
} from 'lucide-react';

export const RegionalInterconnectionPirectWorkbench: React.FC = () => {
  // Simulator State
  const [transitRisToRinMW, setTransitRisToRinMW] = useState<number>(185); // 0 to 300 MW
  const [exportToChadMW, setExportToChadMW] = useState<number>(85); // 0 to 120 MW
  const [tibatiOfftakeMW, setTibatiOfftakeMW] = useState<number>(25); // 0 to 50 MW
  const [contingencyActive, setContingencyActive] = useState<boolean>(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  // Constants
  const lineCapacityMW = 300; // 225 kV Single circuit rated capacity
  const pirectExportLimitMW = 100; // Contractual firm capacity to SNE Chad

  // Effective flow calculations
  const totalFlowFromNachtigal = transitRisToRinMW;
  const flowAtNgaoundere = Math.max(0, transitRisToRinMW - tibatiOfftakeMW);
  const effectiveChadExport = Math.min(exportToChadMW, flowAtNgaoundere * 0.95);
  const lineLoadingPct = Math.round((totalFlowFromNachtigal / lineCapacityMW) * 100);

  // Economic & Ecological impact of displacing heavy fuel/diesel in North & Chad
  // 1 MWh diesel displaced saves ~ 0.28 L diesel and ~ 0.72 tCO2/MWh, fuel cost ~ $210/MWh vs Hydro wheeling ~ $65/MWh
  const annualMWhExport = effectiveChadExport * 8760 * 0.85; // 85% capacity factor
  const annualMWhRinSavings = (transitRisToRinMW - effectiveChadExport) * 8760 * 0.8;
  const dieselSavingsFCFA = Math.round((annualMWhExport + annualMWhRinSavings) * (140 - 45) * 1000 / 1000000); // Million FCFA
  const co2AvoidedTons = Math.round(((annualMWhExport + annualMWhRinSavings) * 0.68));

  const corridorSegments = [
    {
      id: 'seg-1',
      name: 'Tronçon 1: Nachtigal (RIS) ➔ Tibati',
      lengthKm: 275,
      voltageKV: 225,
      circuit: 'Simple terne armé 225 kV (Almelec 570 mm²)',
      substations: ['Poste Élévateur Nachtigal (420 MW)', 'Poste d\'Interconnexion Tibati (225/30 kV)'],
      status: 'Phase finale d\'essais & mise en tension',
      flowMW: totalFlowFromNachtigal,
      lossesMW: +(totalFlowFromNachtigal * 0.024).toFixed(1),
      description: 'Liaison structurante franchissant le plateau de l\'Adamaoua, évacuant l\'énergie de la Sanaga vers le septentrion.'
    },
    {
      id: 'seg-2',
      name: 'Tronçon 2: Tibati ➔ Ngaoundéré',
      lengthKm: 185,
      voltageKV: 225,
      circuit: 'Simple terne 225 kV avec OPGW fibres optiques',
      substations: ['Poste de Tibati', 'Poste Hub Ngaoundéré 225/110 kV'],
      status: 'Opérationnel / Raccordement RIN',
      flowMW: flowAtNgaoundere,
      lossesMW: +(flowAtNgaoundere * 0.019).toFixed(1),
      description: 'Point de jonction critique unifiant pour la première fois dans l\'histoire nationale le RIS (Sud) et le RIN (Nord).'
    },
    {
      id: 'seg-3',
      name: 'Tronçon 3 (PIRECT Cam): Ngaoundéré ➔ Garoua ➔ Maroua',
      lengthKm: 414,
      voltageKV: 225,
      circuit: 'Dorsale Nord 225 kV remplaçant l\'ancienne ligne 110 kV de Lagdo',
      substations: ['Ngaoundéré 225 kV', 'Garoua Djamboutou 225/110 kV', 'Maroua Salak 225/30 kV'],
      status: 'Travaux de génie civil et pylônes achevés',
      flowMW: flowAtNgaoundere - 45, // minus local Northern load
      lossesMW: +((flowAtNgaoundere - 45) * 0.031).toFixed(1),
      description: 'Renforcement du transit vers la Bénoué et l\'Extrême-Nord, sécurisant l\'appoint aux centrales solaires Scatec (30 MWp).'
    },
    {
      id: 'seg-4',
      name: 'Tronçon 4 (PIRECT Transfrontalier): Maroua ➔ Bongor ➔ N\'Djamena',
      lengthKm: 310,
      voltageKV: 225,
      circuit: 'Interconnexion Internationale 225 kV AC synchrone / Liaison Tchad',
      substations: ['Maroua (Cameroon)', 'Bongor (Tchad)', 'Guelendeng', 'Poste de Farcha 2 / N\'Djamena (SNE)'],
      status: 'Postes frontaliers en cours d\'équipement par SNE / SONATREL',
      flowMW: effectiveChadExport,
      lossesMW: +(effectiveChadExport * 0.038).toFixed(1),
      description: 'Première interconnexion transfrontalière d\'Afrique Centrale sous l\'égide du PEAC, alimentant la capitale tchadienne.'
    }
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <Globe2 className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    PEAC • World Bank IDA • AfDB • IsDB
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Projet Stratégique Majeur
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Liaison RIS ➔ RIN & Interconnexion Régionale PIRECT Cameroun–Tchad
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dorsale à très haute tension (225 kV) de plus de <strong className="text-indigo-300">1 024 km</strong> reliant la centrale 
              hydroélectrique de Nachtigal (Sanaga) à N'Djamena (Tchad), unifiant les réseaux Sud et Nord et concrétisant le marché commun de l'électricité en Afrique Centrale (PEAC).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Transit RIS ➔ RIN</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{transitRisToRinMW} MW</div>
              <div className="text-[10px] text-slate-500">Capacité: 300 MW</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Export Tchad (SNE)</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{effectiveChadExport} MW</div>
              <div className="text-[10px] text-slate-500">Ferme contractuel: 100 MW</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Charge Dorsale</div>
              <div className={`text-xl font-bold font-mono mt-0.5 ${lineLoadingPct > 85 ? 'text-amber-400' : 'text-indigo-400'}`}>
                {lineLoadingPct}%
              </div>
              <div className="text-[10px] text-slate-500">225 kV Simple Terne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Realtime Dash */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Simulateur de Flux & Dispatching</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">SONATREL COD 2026</span>
            </div>

            {/* Slider 1: RIS to RIN Injection */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Injection Nachtigal vers le Nord</span>
                <span className="font-mono text-cyan-400 font-bold">{transitRisToRinMW} MW</span>
              </div>
              <input 
                type="range" 
                min={20} 
                max={300} 
                step={5}
                value={transitRisToRinMW}
                onChange={(e) => setTransitRisToRinMW(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20 MW (Minimum technique)</span>
                <span>300 MW (Plafond thermique)</span>
              </div>
            </div>

            {/* Slider 2: Export Chad */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Exportation Ferme vers N'Djamena (Tchad)</span>
                <span className="font-mono text-emerald-400 font-bold">{exportToChadMW} MW</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={120} 
                step={5}
                value={exportToChadMW}
                onChange={(e) => setExportToChadMW(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 MW (Îlotage Tchad)</span>
                <span>100 MW (Contrat PPA)</span>
                <span>120 MW (Pointe)</span>
              </div>
            </div>

            {/* Slider 3: Tibati / Adamawa Offtake */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Soutirage Régional Tibati / Adamaoua</span>
                <span className="font-mono text-indigo-400 font-bold">{tibatiOfftakeMW} MW</span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={50} 
                step={1}
                value={tibatiOfftakeMW}
                onChange={(e) => setTibatiOfftakeMW(Number(e.target.value))}
                className="w-full accent-indigo-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Électrification rurale Adamaoua</span>
                <span>50 MW max</span>
              </div>
            </div>

            {/* Contingency switch */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${contingencyActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-semibold text-white">Simulation Îlotage Tchad / Défaut N-1</div>
                    <div className="text-[10px] text-slate-400">Déclenchement automate d'action réflexe</div>
                  </div>
                </div>
                <button
                  onClick={() => setContingencyActive(!contingencyActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    contingencyActive 
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {contingencyActive ? 'ACTIF' : 'NORMAL'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Régulation de Fréquence:</span>
            <span className="text-emerald-400 font-mono font-bold">50.00 Hz (Interconnecté)</span>
          </div>
        </div>

        {/* Dynamic Topology Flow Diagram */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Architecture de la Ligne & Postes Interconnectés</h3>
              </div>
              <span className="text-xs text-indigo-400 font-mono font-semibold">1 024 km • 225 kV</span>
            </div>

            {/* SVG Visual Flow Schematic */}
            <div className="relative bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 overflow-x-auto">
              <svg viewBox="0 0 850 180" className="w-full min-w-[700px] h-44">
                <defs>
                  <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="45%" stopColor="#6366f1" />
                    <stop offset="80%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <filter id="glowFlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Backbone Line */}
                <line x1="80" y1="90" x2="770" y2="90" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                <line 
                  x1="80" 
                  y1="90" 
                  x2="770" 
                  y2="90" 
                  stroke="url(#corridorGrad)" 
                  strokeWidth="4" 
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />

                {/* Substation Nodes */}
                {/* 1. Nachtigal */}
                <g className="cursor-pointer group" onClick={() => setActiveSegmentIndex(0)}>
                  <circle cx="80" cy="90" r="16" fill="#030712" stroke="#06b6d4" strokeWidth="3" />
                  <circle cx="80" cy="90" r="6" fill="#06b6d4" className="animate-ping" />
                  <text x="80" y="55" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Nachtigal</text>
                  <text x="80" y="70" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">420 MW Hydro</text>
                  <text x="80" y="125" fill="#94a3b8" fontSize="10" textAnchor="middle">Injecté: {transitRisToRinMW} MW</text>
                  <text x="80" y="140" fill="#64748b" fontSize="9" textAnchor="middle">Poste 225 kV</text>
                </g>

                {/* 2. Tibati */}
                <g className="cursor-pointer group" onClick={() => setActiveSegmentIndex(0)}>
                  <circle cx="260" cy="90" r="12" fill="#030712" stroke="#6366f1" strokeWidth="2.5" />
                  <circle cx="260" cy="90" r="4" fill="#6366f1" />
                  <text x="260" y="60" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">Tibati</text>
                  <text x="260" y="120" fill="#a5b4fc" fontSize="10" textAnchor="middle">Soutirage: {tibatiOfftakeMW} MW</text>
                  <text x="260" y="135" fill="#64748b" fontSize="9" textAnchor="middle">Adamaoua</text>
                </g>

                {/* 3. Ngaoundéré */}
                <g className="cursor-pointer group" onClick={() => setActiveSegmentIndex(1)}>
                  <circle cx="430" cy="90" r="14" fill="#030712" stroke="#818cf8" strokeWidth="3" />
                  <circle cx="430" cy="90" r="5" fill="#818cf8" />
                  <text x="430" y="55" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Ngaoundéré</text>
                  <text x="430" y="70" fill="#818cf8" fontSize="9" fontFamily="monospace" textAnchor="middle">Hub RIS ⇄ RIN</text>
                  <text x="430" y="120" fill="#94a3b8" fontSize="10" textAnchor="middle">Transit: {flowAtNgaoundere} MW</text>
                  <text x="430" y="135" fill="#64748b" fontSize="9" textAnchor="middle">225/110 kV</text>
                </g>

                {/* 4. Maroua / Garoua */}
                <g className="cursor-pointer group" onClick={() => setActiveSegmentIndex(2)}>
                  <circle cx="600" cy="90" r="13" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="600" cy="90" r="4" fill="#10b981" />
                  <text x="600" y="55" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">Garoua / Maroua</text>
                  <text x="600" y="70" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">RIN Nord</text>
                  <text x="600" y="120" fill="#94a3b8" fontSize="10" textAnchor="middle">Appoint Solaire 30MW</text>
                  <text x="600" y="135" fill="#64748b" fontSize="9" textAnchor="middle">Extrême-Nord</text>
                </g>

                {/* Border marker */}
                <line x1="680" y1="30" x2="680" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="680" y="25" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">FRONTIÈRE CAMEROUN ⇄ TCHAD</text>

                {/* 5. N'Djamena (Chad) */}
                <g className="cursor-pointer group" onClick={() => setActiveSegmentIndex(3)}>
                  <circle cx="770" cy="90" r="16" fill="#030712" stroke="#22c55e" strokeWidth="3" />
                  <circle cx="770" cy="90" r="6" fill="#22c55e" className="animate-pulse" />
                  <text x="770" y="55" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">N'Djamena</text>
                  <text x="770" y="70" fill="#86efac" fontSize="9" fontFamily="monospace" textAnchor="middle">SNE (Tchad)</text>
                  <text x="770" y="120" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {effectiveChadExport} MW
                  </text>
                  <text x="770" y="135" fill="#64748b" fontSize="9" textAnchor="middle">Poste Farcha 2</text>
                </g>
              </svg>
            </div>

            {/* Segment Inspector Switcher */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {corridorSegments.map((seg, idx) => (
                <button
                  key={seg.id}
                  onClick={() => setActiveSegmentIndex(idx)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    activeSegmentIndex === idx 
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold truncate text-[11px]">Tronçon {idx + 1}</div>
                  <div className="text-[10px] text-slate-400 truncate">{seg.lengthKm} km • {seg.voltageKV} kV</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Segment Detail Flyout */}
          <div className="mt-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{corridorSegments[activeSegmentIndex].name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {corridorSegments[activeSegmentIndex].status}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {corridorSegments[activeSegmentIndex].description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
              <div>
                <span className="text-slate-500">Longueur: </span>
                <span className="text-slate-200 font-bold">{corridorSegments[activeSegmentIndex].lengthKm} km</span>
              </div>
              <div>
                <span className="text-slate-500">Flux Actif: </span>
                <span className="text-cyan-400 font-bold">{corridorSegments[activeSegmentIndex].flowMW} MW</span>
              </div>
              <div>
                <span className="text-slate-500">Pertes Ligne: </span>
                <span className="text-amber-400 font-bold">{corridorSegments[activeSegmentIndex].lossesMW} MW</span>
              </div>
              <div>
                <span className="text-slate-500">Conducteur: </span>
                <span className="text-slate-200">Almelec 570mm²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Indicators & Governance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Economic Yield */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Coins className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-white text-sm">Gains Économiques Annuels</h4>
              <p className="text-[10px] text-slate-400">Substitution fuel lourd / gasoil</p>
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {dieselSavingsFCFA.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-400">M FCFA / an</span>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Économie majeure sur la subvention d'équilibre de l'État pour l'alimentation des centrales thermiques isolées de Djamboutou (Garoua), Maroua et Meiganga.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">PPA Tchad Export:</span>
            <span className="font-mono text-white font-semibold">Recettes devises SONATREL</span>
          </div>
        </div>

        {/* Environmental Decarbonization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Leaf className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-white text-sm">Décarbonation & Climat</h4>
              <p className="text-[10px] text-slate-400">Émissions de GES évitées</p>
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-cyan-400">
            {co2AvoidedTons.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-400">tCO₂e / an</span>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Remplacement de la production thermique fossile du Tchad (SNE) et du Nord-Cameroun par l'hydroélectricité propre et renouvelable du fleuve Sanaga.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Contribution NDC Cameroun:</span>
            <span className="font-mono text-white font-semibold">-35% Horizon 2030</span>
          </div>
        </div>

        {/* Institutional & Financial Backers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-white text-sm">Bailleurs de Fonds & Financement</h4>
              <p className="text-[10px] text-slate-400">Montant total: ~ 550 Milliards FCFA</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Banque Mondiale (IDA)</span>
              <span className="font-mono text-indigo-300 font-bold">385 M$ USD</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Banque Africaine de Dévelop. (BAD)</span>
              <span className="font-mono text-indigo-300 font-bold">310 M€ EUR</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Banque Islamique (IsDB) / UE</span>
              <span className="font-mono text-indigo-300 font-bold">120 M€ EUR</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Maîtrise d'ouvrage conjointe: SONATREL (CMR) & SNE (TCD)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
