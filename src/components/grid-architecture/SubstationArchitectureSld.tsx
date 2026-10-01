// src/components/grid-architecture/SubstationArchitectureSld.tsx
// EPEDE - High-Voltage Substation Architecture & Interactive Switching Interlocks Lab

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Activity, 
  RotateCcw, 
  Cpu, 
  BatteryCharging, 
  Lock, 
  Unlock,
  Info,
  Server
} from 'lucide-react';
import { SUBSTATION_ELEMENTS_INIT, SUBSTATION_AUXILIARY_SYSTEMS } from './data/substationBayData';
import { SubstationSwitchingElement } from './types';

interface SubstationArchitectureSldProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const SubstationArchitectureSld: React.FC<SubstationArchitectureSldProps> = ({
  locale,
  onSelectEquipment
}) => {
  const [elements, setElements] = useState<SubstationSwitchingElement[]>(SUBSTATION_ELEMENTS_INIT);
  const [interlockWarning, setInterlockWarning] = useState<{ title: string; message: string; severity: 'blocked' | 'warning' } | null>(null);
  const [activeSecondaryTab, setActiveSecondaryTab] = useState<'dc_batteries' | 'ac_auxiliaries' | 'iec61850'>('dc_batteries');
  const [selectedElementId, setSelectedElementId] = useState<string>('elem-cb-line');

  const selectedElement = elements.find(e => e.id === selectedElementId) || elements[2];

  // Toggle Breaker / Disconnector / Earth Switch with strict interlock checking
  const handleToggleElement = (elemId: string) => {
    setInterlockWarning(null);

    setElements(prev => {
      const target = prev.find(e => e.id === elemId);
      if (!target) return prev;

      const nextIsOpen = !target.isOpen;

      // -------------------------------------------------------------
      // INTERLOCK RULE 1: Disconnector cannot be operated under load!
      // -------------------------------------------------------------
      if (target.type === 'disconnector') {
        const associatedBreaker = prev.find(e => target.bayId === e.bayId && e.type === 'breaker');
        if (associatedBreaker && !associatedBreaker.isOpen) {
          setInterlockWarning({
            title: locale === 'fr' ? 'VERROUILLAGE BLOQUANT : Manœuvre en charge interdite !' : 'INTERLOCK BLOCKED: Operation under load prohibited!',
            message: locale === 'fr'
              ? `Le sectionneur ${target.tag} ne peut pas être manœuvré tant que le disjoncteur ${associatedBreaker.tag} est fermé ! Les sectionneurs n'ont aucun pouvoir de coupure : tenter d'ouvrir en charge provoquerait un arc électrique explosif dévastateur (IEEE 1584 / NFPA 70E). Ouvrez d'abord le disjoncteur.`
              : `Disconnector ${target.tag} cannot operate while breaker ${associatedBreaker.tag} is closed! Disconnectors have zero breaking capacity: operating under load causes a catastrophic arc-flash explosion. Open the circuit breaker first.`,
            severity: 'blocked'
          });
          return prev; // Block action
        }
      }

      // -------------------------------------------------------------
      // INTERLOCK RULE 2: Earth switch cannot close on an energized section!
      // -------------------------------------------------------------
      if (target.type === 'earth_switch' && !nextIsOpen) { // Attempting to close earth switch
        const lineDiscon = prev.find(e => e.id === 'elem-discon-line-out');
        const breaker = prev.find(e => e.bayId === target.bayId && e.type === 'breaker');

        if ((lineDiscon && !lineDiscon.isOpen) || (breaker && !breaker.isOpen)) {
          setInterlockWarning({
            title: locale === 'fr' ? 'DANGER DE MORT : Fermeture de terre sur circuit sous tension !' : 'DEADLY DANGER: Closing earth switch on energized line!',
            message: locale === 'fr'
              ? `Action formellement bloquée : fermeture du sectionneur de terre ${target.tag} interdite tant que le circuit n'est pas complètement isolé et consigné. Provoquerait un court-circuit franc triphasé-terre direct de 40 kA.`
              : `Strictly interlocked: Closing earthing switch ${target.tag} onto an energized circuit is blocked! This would create a direct 40 kA bolted short-circuit to ground.`,
            severity: 'blocked'
          });
          return prev; // Block action
        }
      }

      // -------------------------------------------------------------
      // INTERLOCK RULE 3: Breaker cannot close if earth switch is closed!
      // -------------------------------------------------------------
      if (target.type === 'breaker' && !nextIsOpen) { // Attempting to close breaker
        const earthSwitch = prev.find(e => e.bayId === target.bayId && e.type === 'earth_switch');
        if (earthSwitch && !earthSwitch.isOpen) {
          setInterlockWarning({
            title: locale === 'fr' ? 'VERROUILLAGE BLOQUANT : Enclenchement sur terre fermé !' : 'INTERLOCK BLOCKED: Closing breaker onto applied ground!',
            message: locale === 'fr'
              ? `Le disjoncteur ${target.tag} est verrouillé contre l'enclenchement tant que le sectionneur de terre ${earthSwitch.tag} est fermé ! Ouvrez d'abord le sectionneur de terre.`
              : `Circuit breaker ${target.tag} is barred from closing while earthing switch ${earthSwitch.tag} is in the closed ground position! Open the earth switch first.`,
            severity: 'blocked'
          });
          return prev; // Block action
        }
      }

      // Update state if all safety interlocks pass
      return prev.map(e => {
        if (e.id === elemId) {
          const updatedIsOpen = !e.isOpen;
          const updatedIsEarthed = e.type === 'earth_switch' ? !updatedIsOpen : e.isEarthed;
          return {
            ...e,
            isOpen: updatedIsOpen,
            isEarthed: updatedIsEarthed,
            isEnergized: updatedIsOpen ? false : true
          };
        }
        return e;
      });
    });
  };

  const resetAllToNormal = () => {
    setElements(SUBSTATION_ELEMENTS_INIT);
    setInterlockWarning(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              POSTE ÉLECTRIQUE HTB 225/30 kV
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {locale === 'fr' ? 'Simulateur d\'Exploitation & Verrouillages de Sécurité' : 'Switching Operations & Safety Interlocking Simulator'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {locale === 'fr' 
              ? 'Architecture de Poste, Schéma Unifilaire & Système de Verrouillage' 
              : 'Substation Single-Line Architecture & Safety Interlocking Lab'}
          </h2>
        </div>

        <button
          type="button"
          onClick={resetAllToNormal}
          className="px-4 py-2 rounded-xl border border-[#252E38] bg-[#161B22] hover:bg-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>{locale === 'fr' ? 'Réinitialiser Schéma Normal' : 'Reset Normal Grid State'}</span>
        </button>
      </div>

      {/* Safety Interlock Alert Box */}
      {interlockWarning && (
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-lg transition-all animate-in fade-in ${
          interlockWarning.severity === 'blocked'
            ? 'bg-red-950/80 border-red-500/60 text-red-200'
            : 'bg-amber-950/80 border-amber-500/60 text-amber-200'
        }`}>
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-red-300">
              {interlockWarning.title}
            </h4>
            <p className="text-xs text-red-200/90 leading-relaxed font-sans">
              {interlockWarning.message}
            </p>
          </div>
        </div>
      )}

      {/* Interactive SLD Bay Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SLD Canvas & Apparatus Bays (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
            <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>{locale === 'fr' ? 'SCHÉMA UNIFILAIRE INTERACTIF (CLIQUEZ POUR SÉLECTIONNER & MANŒUVRER)' : 'INTERACTIVE SINGLE-LINE DIAGRAM (CLICK TO SELECT & OPERATE)'}</span>
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                <span>{locale === 'fr' ? 'Fermé / Enclenché' : 'Closed'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full border border-slate-500 bg-slate-800" />
                <span>{locale === 'fr' ? 'Ouvert' : 'Open'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/20" />
                <span>{locale === 'fr' ? 'À la terre (MALT)' : 'Earthed'}</span>
              </span>
            </div>
          </div>

          {/* SVG Vector SLD Representation */}
          <div className="bg-[#0A0D14] border border-[#1E2633] rounded-xl p-4 sm:p-6 text-white overflow-x-auto shadow-inner">
            <svg viewBox="0 0 740 380" className="w-full h-auto min-w-[620px] select-none font-mono">
              {/* Busbar 1 (225 kV) */}
              <line x1="60" y1="40" x2="680" y2="40" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <text x="70" y="30" fill="#f59e0b" fontSize="11" fontWeight="bold">JEU DE BARRES 1 (225 kV) - BUS 1 · NOMINAL SOUS TENSION</text>

              {/* Busbar 2 (225 kV) */}
              <line x1="60" y1="75" x2="680" y2="75" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6,3" strokeLinecap="round" />
              <text x="70" y="68" fill="#38bdf8" fontSize="10">JEU DE BARRES 2 (225 kV) - BUS 2 · SECOURS / COUPLAGE</text>

              {/* ----------------- BAY 1: INCOMING 225 kV LINE ----------------- */}
              <g transform="translate(180, 0)">
                <text x="0" y="98" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">TRAVÉE LIGNE 225 kV</text>
                
                {/* Vertical feeder line top */}
                <line 
                  x1="0" y1="40" x2="0" y2="105" 
                  stroke={elements[0].isOpen ? '#475569' : '#10b981'} 
                  strokeWidth="3" 
                />
                
                {/* Disconnector Bus 1 */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-discon-line-bus1');
                    handleToggleElement('elem-discon-line-bus1');
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle 
                    cx="0" cy="115" r="15" 
                    fill="#0F172A" 
                    stroke={selectedElementId === 'elem-discon-line-bus1' ? '#38bdf8' : elements[0].isOpen ? '#64748b' : '#10b981'} 
                    strokeWidth={selectedElementId === 'elem-discon-line-bus1' ? '3' : '2'} 
                  />
                  <text x="0" y="119" fill={elements[0].isOpen ? '#94a3b8' : '#10b981'} fontSize="9" textAnchor="middle" fontWeight="bold">
                    {elements[0].tag}
                  </text>
                  <text x="24" y="119" fill="#e2e8f0" fontSize="9">Sect. Barres 1 ({elements[0].isOpen ? 'O' : 'F'})</text>
                </g>

                {/* Line section between disconnector and breaker */}
                <line 
                  x1="0" y1="130" x2="0" y2="168" 
                  stroke={!elements[0].isOpen ? '#10b981' : '#475569'} 
                  strokeWidth="3" 
                />

                {/* Circuit Breaker */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-cb-line');
                    handleToggleElement('elem-cb-line');
                  }}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <rect 
                    x="-20" y="168" width="40" height="38" rx="6" 
                    fill="#0D1117" 
                    stroke={selectedElementId === 'elem-cb-line' ? '#38bdf8' : elements[2].isOpen ? '#ef4444' : '#10b981'} 
                    strokeWidth={selectedElementId === 'elem-cb-line' ? '3.5' : '2.5'} 
                  />
                  <text x="0" y="191" fill={elements[2].isOpen ? '#ef4444' : '#10b981'} fontSize="11" textAnchor="middle" fontWeight="bold">
                    {elements[2].isOpen ? 'OUV' : 'ENCL'}
                  </text>
                  <text x="28" y="191" fill="#38bdf8" fontSize="10" fontWeight="bold">225 kV CB</text>
                </g>

                {/* Line section between breaker and line disconnector */}
                <line 
                  x1="0" y1="206" x2="0" y2="235" 
                  stroke={!elements[0].isOpen && !elements[2].isOpen ? '#10b981' : '#475569'} 
                  strokeWidth="3" 
                />

                {/* Disconnector Line */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-discon-line-out');
                    handleToggleElement('elem-discon-line-out');
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle 
                    cx="0" cy="245" r="15" 
                    fill="#0F172A" 
                    stroke={selectedElementId === 'elem-discon-line-out' ? '#38bdf8' : elements[3].isOpen ? '#64748b' : '#10b981'} 
                    strokeWidth={selectedElementId === 'elem-discon-line-out' ? '3' : '2'} 
                  />
                  <text x="0" y="249" fill={elements[3].isOpen ? '#94a3b8' : '#10b981'} fontSize="9" textAnchor="middle" fontWeight="bold">
                    {elements[3].tag}
                  </text>
                  <text x="24" y="249" fill="#e2e8f0" fontSize="9">Sect. Ligne ({elements[3].isOpen ? 'O' : 'F'})</text>
                </g>

                {/* Line section down towards line */}
                <line 
                  x1="0" y1="260" x2="0" y2="295" 
                  stroke={!elements[4].isOpen ? '#f59e0b' : (!elements[0].isOpen && !elements[2].isOpen && !elements[3].isOpen ? '#10b981' : '#475569')} 
                  strokeWidth="3" 
                />

                {/* Earth Switch */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-earth-line');
                    handleToggleElement('elem-earth-line');
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <rect 
                    x="-18" y="295" width="36" height="26" rx="4" 
                    fill="#0F172A" 
                    stroke={selectedElementId === 'elem-earth-line' ? '#38bdf8' : elements[4].isOpen ? '#64748b' : '#f59e0b'} 
                    strokeWidth={selectedElementId === 'elem-earth-line' ? '3' : '2'} 
                  />
                  <text x="0" y="312" fill={elements[4].isOpen ? '#64748b' : '#f59e0b'} fontSize="10" textAnchor="middle" fontWeight="bold">
                    ⏚ MALT
                  </text>
                  <text x="24" y="312" fill={elements[4].isOpen ? '#64748b' : '#f59e0b'} fontSize="9">
                    {elements[4].isOpen ? 'Terre Ouverte' : 'Terre Appliquée !'}
                  </text>
                </g>

                <line x1="0" y1="321" x2="0" y2="355" stroke={!elements[4].isOpen ? '#f59e0b' : '#38bdf8'} strokeWidth="2.5" />
                <text x="0" y="372" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">LIGNE 225 kV SONGLOULOU - MANGOMBÉ</text>
              </g>

              {/* ----------------- BAY 2: POWER TRANSFORMER 225/30 kV ----------------- */}
              <g transform="translate(480, 0)">
                <text x="0" y="98" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">TRAVÉE TRANSFORMATEUR TR1</text>
                
                <line 
                  x1="0" y1="40" x2="0" y2="105" 
                  stroke={elements[5].isOpen ? '#475569' : '#10b981'} 
                  strokeWidth="3" 
                />
                
                {/* Disconnector Trafo Bus 1 */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-discon-trafo-bus1');
                    handleToggleElement('elem-discon-trafo-bus1');
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle 
                    cx="0" cy="115" r="15" 
                    fill="#0F172A" 
                    stroke={selectedElementId === 'elem-discon-trafo-bus1' ? '#38bdf8' : elements[5].isOpen ? '#64748b' : '#10b981'} 
                    strokeWidth={selectedElementId === 'elem-discon-trafo-bus1' ? '3' : '2'} 
                  />
                  <text x="0" y="119" fill={elements[5].isOpen ? '#94a3b8' : '#10b981'} fontSize="9" textAnchor="middle" fontWeight="bold">
                    {elements[5].tag}
                  </text>
                  <text x="24" y="119" fill="#e2e8f0" fontSize="9">Sect. Barres TR1</text>
                </g>

                <line 
                  x1="0" y1="130" x2="0" y2="168" 
                  stroke={!elements[5].isOpen ? '#10b981' : '#475569'} 
                  strokeWidth="3" 
                />

                {/* Trafo Circuit Breaker */}
                <g 
                  onClick={() => {
                    setSelectedElementId('elem-cb-trafo');
                    handleToggleElement('elem-cb-trafo');
                  }}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <rect 
                    x="-20" y="168" width="40" height="38" rx="6" 
                    fill="#0D1117" 
                    stroke={selectedElementId === 'elem-cb-trafo' ? '#38bdf8' : elements[6].isOpen ? '#ef4444' : '#10b981'} 
                    strokeWidth={selectedElementId === 'elem-cb-trafo' ? '3.5' : '2.5'} 
                  />
                  <text x="0" y="191" fill={elements[6].isOpen ? '#ef4444' : '#10b981'} fontSize="11" textAnchor="middle" fontWeight="bold">
                    {elements[6].isOpen ? 'OUV' : 'ENCL'}
                  </text>
                  <text x="28" y="191" fill="#38bdf8" fontSize="10" fontWeight="bold">TR1 CB</text>
                </g>

                <line 
                  x1="0" y1="206" x2="0" y2="240" 
                  stroke={!elements[5].isOpen && !elements[6].isOpen ? '#10b981' : '#475569'} 
                  strokeWidth="3" 
                />

                {/* Power Transformer 225/30 kV Symbol (Two Interlinked Circles) */}
                <g 
                  onClick={() => setSelectedElementId('elem-trafo-main')}
                  className="cursor-pointer hover:opacity-90"
                >
                  <circle cx="0" cy="254" r="18" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="0" cy="276" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                  <text x="32" y="260" fill="#f59e0b" fontSize="10" fontWeight="bold">TRANSFO TR1 (63 MVA)</text>
                  <text x="32" y="274" fill="#94a3b8" fontSize="9">225 kV / 30 kV Dyn11 · ONAN/ONAF</text>
                </g>

                <line 
                  x1="0" y1="295" x2="0" y2="350" 
                  stroke={!elements[5].isOpen && !elements[6].isOpen ? '#10b981' : '#475569'} 
                  strokeWidth="3" 
                />
                <text x="0" y="372" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">VERS RAMEAUX MT 30 kV VILLE DOUALA / YAOUNDÉ</text>
              </g>
            </svg>
          </div>

          {/* Quick Interlock Guide */}
          <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#252E38] text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                {locale === 'fr'
                  ? 'Essayez d\'ouvrir un sectionneur avec disjoncteur fermé, ou d\'enclencher la terre sous tension pour tester le verrouillage mécanique & électromagnétique !'
                  : 'Try opening a disconnector while the breaker is closed or applying ground while energized to test electromagnetic interlocks!'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-sky-400 font-bold shrink-0">CEI 62271-102</span>
          </div>
        </div>

        {/* Selected Apparatus Inspector & Secondary Systems (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Apparatus Inspector */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                {locale === 'fr' ? 'Appareillage Sélectionné' : 'Selected Apparatus'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {selectedElement.tag}
              </span>
            </div>

            <div>
              <div className="font-bold text-base text-white">
                {selectedElement.name[locale]}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                  selectedElement.isOpen
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedElement.isOpen ? (locale === 'fr' ? 'État : OUVERT' : 'State: OPEN') : (locale === 'fr' ? 'État : FERMÉ' : 'State: CLOSED')}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedElement.ratedVoltage} · {selectedElement.ratedCurrent}
                </span>
              </div>
            </div>

            {/* Interlocking Rule on Selected Element */}
            <div className="p-3.5 bg-[#161B22] border border-amber-500/30 rounded-xl text-xs space-y-1">
              <span className="font-bold font-mono text-amber-300 block flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                {locale === 'fr' ? 'Règle de Verrouillage de Sécurité :' : 'Safety Interlock Rule:'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {locale === 'fr' ? selectedElement.interlockRuleFr : selectedElement.interlockRuleEn}
              </p>
            </div>

            {/* Secondary Integration */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-slate-400 font-bold">{locale === 'fr' ? 'Raccordement Tranche Secondaire :' : 'Secondary Systems Integration:'}</div>
              <div className="p-3 rounded-xl bg-[#161B22] border border-[#252E38] space-y-1">
                <div><span className="text-slate-400">Relais :</span> <span className="text-sky-300 font-bold">{selectedElement.secondaryLink.protectionRelay}</span></div>
                <div><span className="text-slate-400">SCADA :</span> <span className="text-slate-200">{selectedElement.secondaryLink.scadaPoint}</span></div>
                <div><span className="text-slate-400">Alim DC :</span> <span className="text-indigo-300 font-bold">{selectedElement.secondaryLink.dcSupply}</span></div>
              </div>
            </div>

            {/* Direct Switch Trigger */}
            <button
              type="button"
              onClick={() => handleToggleElement(selectedElement.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
            >
              <Activity className="w-3.5 h-3.5 text-sky-200" />
              <span>
                {selectedElement.isOpen 
                  ? (locale === 'fr' ? 'MANŒUVRER POUR FERMER' : 'SWITCH TO CLOSE')
                  : (locale === 'fr' ? 'MANŒUVRER POUR OUVRIR' : 'SWITCH TO OPEN')}
              </span>
            </button>
          </div>

          {/* Substation Secondary Auxiliaries (DC & AC & SAS) */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>{locale === 'fr' ? 'SERVICES AUXILIAIRES DE POSTE' : 'SUBSTATION AUXILIARIES'}</span>
            </div>

            <div className="flex rounded-xl border border-[#252E38] bg-[#161B22] p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSecondaryTab('dc_batteries')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all ${activeSecondaryTab === 'dc_batteries' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                110 V DC
              </button>
              <button
                type="button"
                onClick={() => setActiveSecondaryTab('ac_auxiliaries')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all ${activeSecondaryTab === 'ac_auxiliaries' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                400 V AC TSA
              </button>
              <button
                type="button"
                onClick={() => setActiveSecondaryTab('iec61850')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all ${activeSecondaryTab === 'iec61850' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                CEI 61850
              </button>
            </div>

            {activeSecondaryTab === 'dc_batteries' && (
              <div className="p-3.5 rounded-xl bg-[#161B22] border border-indigo-500/30 text-xs space-y-1.5">
                <span className="font-bold text-indigo-300 block flex items-center gap-1.5 font-mono">
                  <BatteryCharging className="w-4 h-4 text-indigo-400" />
                  {SUBSTATION_AUXILIARY_SYSTEMS.dcSystem.voltage}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {SUBSTATION_AUXILIARY_SYSTEMS.dcSystem.mission}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  Batteries : {SUBSTATION_AUXILIARY_SYSTEMS.dcSystem.batteries}
                </div>
              </div>
            )}

            {activeSecondaryTab === 'ac_auxiliaries' && (
              <div className="p-3.5 rounded-xl bg-[#161B22] border border-sky-500/30 text-xs space-y-1.5">
                <span className="font-bold text-sky-300 block flex items-center gap-1.5 font-mono">
                  <Zap className="w-4 h-4 text-sky-400" />
                  {SUBSTATION_AUXILIARY_SYSTEMS.acSystem.voltage}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Source : {SUBSTATION_AUXILIARY_SYSTEMS.acSystem.source} secouru par {SUBSTATION_AUXILIARY_SYSTEMS.acSystem.backupGenerator}.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  Alimente moteurs, pompes de réfrigération et chargeurs.
                </div>
              </div>
            )}

            {activeSecondaryTab === 'iec61850' && (
              <div className="p-3.5 rounded-xl bg-[#161B22] border border-emerald-500/30 text-xs space-y-1.5 font-mono">
                <span className="font-bold text-emerald-300 block">
                  Standard : {SUBSTATION_AUXILIARY_SYSTEMS.automationSystem.standard}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {SUBSTATION_AUXILIARY_SYSTEMS.automationSystem.stationBus}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  {SUBSTATION_AUXILIARY_SYSTEMS.automationSystem.protocols}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
