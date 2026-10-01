// src/components/domain/modules/DomainVisualEngineeringAsset.tsx
import React, { useState } from 'react';
import type { DomainCode } from '../../../types/epede';
import { InteractiveSldDiagram } from '../../visual/InteractiveSldDiagram';
import { InteractiveScadaHmiView } from '../../visual/InteractiveScadaHmiView';
import { CircuitBreakerCutawayWorkbench } from '../../equipment/CircuitBreakerCutawayWorkbench';
import { Eye, Network, Cpu, Box } from 'lucide-react';

interface DomainVisualEngineeringAssetProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
}

export const DomainVisualEngineeringAsset: React.FC<DomainVisualEngineeringAssetProps> = ({
  domainCode,
  locale,
}) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'sld' | 'scada' | 'cutaway'>('schematic');

  const sldTopology =
    ['D01', 'D09'].includes(domainCode) ? 'generation_transmission' :
    ['D02', 'D03', 'D04', 'D11'].includes(domainCode) ? 'substation_double_bus' :
    ['D05', 'D14', 'D15'].includes(domainCode) ? 'distribution_feeder' :
    'industrial_mcc';

  const scadaMode =
    ['D01', 'D09'].includes(domainCode) ? 'generation' :
    ['D02', 'D03', 'D04', 'D11', 'D13'].includes(domainCode) ? 'substation' :
    ['D05', 'D14', 'D15'].includes(domainCode) ? 'distribution' :
    domainCode === 'D10' ? 'bess' :
    'industry';

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 text-white overflow-hidden shadow-xl">
      {/* Header Tag & Visual View Switcher */}
      <div className="px-4 py-2.5 bg-slate-950/95 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            {locale === 'fr' ? 'VISUALISATION TECHNIQUE AVANCÉE' : 'ADVANCED TECHNICAL VISUALIZATION'}
          </span>
          <span className="text-slate-600 text-[10px] hidden md:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            {domainCode} · {locale === 'fr' ? 'Normes CEI & IEEE' : 'IEC & IEEE Standards'}
          </span>
        </div>

        {/* 4 Visualization Modes */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode('schematic')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'schematic'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Schéma de Principe' : 'Schematic'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('sld')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'sld'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Unifilaire SLD' : 'Interactive SLD'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('scada')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'scada'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'SCADA / HMI' : 'SCADA HMI'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('cutaway')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'cutaway'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Coupe 3D / SF₆' : '3D / SF₆ Cutaway'}</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {viewMode === 'sld' ? (
        <div className="p-3 bg-slate-950">
          <InteractiveSldDiagram
            initialTopology={sldTopology}
            locale={locale}
          />
        </div>
      ) : viewMode === 'scada' ? (
        <div className="p-3 bg-slate-950">
          <InteractiveScadaHmiView
            mode={scadaMode}
            locale={locale}
          />
        </div>
      ) : viewMode === 'cutaway' ? (
        <div className="p-3 bg-slate-950">
          <CircuitBreakerCutawayWorkbench
            locale={locale}
            embedded={true}
            bayName={`${domainCode}-BAY-HTB`}
            voltageKv={['D01', 'D09'].includes(domainCode) ? 15 : 225}
            breakingCapacityKa={['D01', 'D09'].includes(domainCode) ? 63 : 40}
          />
        </div>
      ) : (
        /* Visual Canvas */
        <div className="p-4 sm:p-6 flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 min-h-[220px]">
        
        {/* D01: Hydroelectric Power Station */}
        {domainCode === 'D01' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Dam Wall & Water Reservoir */}
              <path d="M 40 20 L 160 20 L 220 180 L 40 180 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <path d="M 0 50 Q 80 45 150 50 L 150 180 L 0 180 Z" fill="#0284c7" opacity="0.3" />
              <text x="50" y="80" fill="#38bdf8" fontFamily="monospace" fontSize="12" fontWeight="bold">Retenue d'eau (Barrage)</text>

              {/* Penstock */}
              <path d="M 160 100 L 320 150 L 320 170 L 160 120 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <text x="210" y="125" fill="#94a3b8" fontFamily="monospace" fontSize="10">Conduite Forcée</text>

              {/* Turbine Spiral Case & Alternator */}
              <circle cx="360" cy="155" r="28" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="360" cy="155" r="14" fill="#0284c7" />
              <text x="340" y="160" fill="#ffffff" fontFamily="monospace" fontSize="10" fontWeight="bold">Francis</text>

              {/* Shaft & Generator */}
              <rect x="352" y="55" width="16" height="72" fill="#64748b" />
              <rect x="320" y="35" width="80" height="40" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" rx="4" />
              <text x="328" y="58" fill="#c7d2fe" fontFamily="monospace" fontSize="11" fontWeight="bold">Alternateur 15 kV</text>

              {/* GCB & GSU Transformer */}
              <line x1="400" y1="55" x2="470" y2="55" stroke="#f59e0b" strokeWidth="3" />
              <rect x="430" y="45" width="20" height="20" fill="#f59e0b" rx="2" />
              <text x="428" y="40" fill="#fbbf24" fontFamily="monospace" fontSize="9">GCB</text>

              <circle cx="510" cy="55" r="18" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              <circle cx="530" cy="55" r="18" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              <text x="490" y="90" fill="#fda4af" fontFamily="monospace" fontSize="10" fontWeight="bold">Transfo Élévateur 15/225 kV</text>

              {/* Output High Voltage Lines */}
              <line x1="548" y1="55" x2="595" y2="55" stroke="#e11d48" strokeWidth="3" />
              <text x="550" y="45" fill="#f43f5e" fontFamily="monospace" fontSize="11" fontWeight="bold">225 kV THT</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Modèle type : Aménagement hydroélectrique de Nachtigal (7 × 60 MW = 420 MW)</span>
              <span className="text-amber-400 font-bold">Rendement global turbine-alternateur : ~92.4%</span>
            </div>
          </div>
        )}

        {/* D03: Transmission Networks */}
        {domainCode === 'D03' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Lattice Tower 1 */}
              <g transform="translate(100, 20)">
                <line x1="40" y1="0" x2="10" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="0" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <line x1="10" y1="160" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" />
                {/* Crossarms */}
                <line x1="0" y1="40" x2="80" y2="40" stroke="#94a3b8" strokeWidth="3" />
                <line x1="10" y1="70" x2="70" y2="70" stroke="#94a3b8" strokeWidth="3" />
                <line x1="0" y1="100" x2="80" y2="100" stroke="#94a3b8" strokeWidth="3" />
                {/* Insulators */}
                <line x1="0" y1="40" x2="0" y2="60" stroke="#38bdf8" strokeWidth="3" />
                <line x1="80" y1="40" x2="80" y2="60" stroke="#38bdf8" strokeWidth="3" />
                <text x="15" y="-5" fill="#cbd5e1" fontFamily="monospace" fontSize="10">Pylône 225 kV</text>
              </g>

              {/* Lattice Tower 2 */}
              <g transform="translate(420, 20)">
                <line x1="40" y1="0" x2="10" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="0" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <line x1="10" y1="160" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="40" x2="80" y2="40" stroke="#94a3b8" strokeWidth="3" />
                <line x1="10" y1="70" x2="70" y2="70" stroke="#94a3b8" strokeWidth="3" />
                <line x1="0" y1="100" x2="80" y2="100" stroke="#94a3b8" strokeWidth="3" />
              </g>

              {/* Catenary Conductors (Sag) */}
              <path d="M 100 80 Q 280 135 420 80" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              <path d="M 180 80 Q 320 135 500 80" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              {/* Shield wire (OPGW) */}
              <path d="M 140 20 Q 300 45 460 20" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x="270" y="30" fill="#38bdf8" fontFamily="monospace" fontSize="10">Câble OPGW (Fibre + Garde)</text>
              <text x="260" y="150" fill="#f43f5e" fontFamily="monospace" fontSize="11" fontWeight="bold">Faisceau 2 Conducteurs Almélec</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Portée nominale : 400 m · Flèche maximale à 75°C : ~12.8 m</span>
              <span className="text-sky-400 font-bold">Impédance caractéristique Z_c ≈ 380 Ω</span>
            </div>
          </div>
        )}

        {/* D07: Electrical Machines & Electromechanical Conversion */}
        {domainCode === 'D07' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Hydraulic Turbine & Shaft */}
              <g transform="translate(40, 60)">
                <rect x="0" y="25" width="50" height="30" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="3" />
                <path d="M 15 15 L 35 15 L 45 40 L 5 40 Z" fill="#0284c7" opacity="0.6" />
                <text x="5" y="70" fill="#38bdf8" fontFamily="monospace" fontSize="9">Turbine Francis</text>
                {/* Rotating Shaft */}
                <rect x="50" y="35" width="40" height="10" fill="#94a3b8" />
                <path d="M 65 30 A 6 6 0 1 1 65 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
              </g>

              {/* Salient-Pole Synchronous Alternator Cross-Section */}
              <g transform="translate(130, 20)">
                {/* Outer Stator Core */}
                <circle cx="80" cy="80" r="75" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                <circle cx="80" cy="80" r="62" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
                {/* Stator Slots / Windings */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line 
                    key={deg}
                    x1={80 + 64 * Math.cos((deg * Math.PI) / 180)} 
                    y1={80 + 64 * Math.sin((deg * Math.PI) / 180)} 
                    x2={80 + 73 * Math.cos((deg * Math.PI) / 180)} 
                    y2={80 + 73 * Math.sin((deg * Math.PI) / 180)} 
                    stroke="#e11d48" 
                    strokeWidth="2.5" 
                  />
                ))}
                {/* Air-gap */}
                <circle cx="80" cy="80" r="48" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                {/* 4 Salient Rotor Poles */}
                <rect x="66" y="34" width="28" height="24" fill="#d97706" rx="3" />
                <rect x="66" y="102" width="28" height="24" fill="#d97706" rx="3" />
                <rect x="34" y="66" width="24" height="28" fill="#d97706" rx="3" />
                <rect x="102" y="66" width="24" height="28" fill="#d97706" rx="3" />
                {/* Central Shaft */}
                <circle cx="80" cy="80" r="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <text x="45" y="170" fill="#fcd34d" fontFamily="monospace" fontSize="10" fontWeight="bold">Alternateur Synchrone 15 kV</text>
              </g>

              {/* Isolated Phase Bus (IPB) & GCB */}
              <g transform="translate(300, 70)">
                <line x1="0" y1="30" x2="60" y2="30" stroke="#f59e0b" strokeWidth="4" />
                <text x="5" y="20" fill="#fbbf24" fontFamily="monospace" fontSize="9">Gaine IPB 15 kV</text>
                {/* Generator Circuit Breaker (GCB) */}
                <rect x="60" y="15" width="30" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />
                <text x="63" y="34" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold">GCB</text>
                <line x1="90" y1="30" x2="130" y2="30" stroke="#f59e0b" strokeWidth="4" />
              </g>

              {/* Step-Up Transformer (GSU) 15/225 kV */}
              <g transform="translate(440, 50)">
                {/* Transformer Windings Circles */}
                <circle cx="35" cy="50" r="22" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                <circle cx="65" cy="50" r="22" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                <text x="10" y="20" fill="#c4b5fd" fontFamily="monospace" fontSize="10" fontWeight="bold">GSU 15/225 kV</text>
                <text x="25" y="85" fill="#94a3b8" fontFamily="monospace" fontSize="8">Sn = 75 MVA</text>
                {/* 225 kV Output to Grid */}
                <line x1="87" y1="50" x2="145" y2="50" stroke="#e11d48" strokeWidth="3.5" />
                <text x="95" y="42" fill="#f43f5e" fontFamily="monospace" fontSize="10" fontWeight="bold">225 kV THT</text>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Chaîne de conversion : Francis → Alternateur pôles saillants (15 kV) → GCB (63 kA) → Transfo GSU (225 kV)</span>
              <span className="text-amber-400 font-bold">Rendement de conversion : η ≈ 97.2%</span>
            </div>
          </div>
        )}

        {/* D08: Industrial Electrical & Process Systems */}
        {domainCode === 'D08' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Private 90 kV / 15 kV Substation Bay */}
              <g transform="translate(20, 30)">
                <line x1="0" y1="20" x2="60" y2="20" stroke="#f43f5e" strokeWidth="3" />
                <text x="0" y="10" fill="#f43f5e" fontFamily="monospace" fontSize="9" fontWeight="bold">Arrivée 90 kV</text>
                <circle cx="75" cy="20" r="14" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                <circle cx="95" cy="20" r="14" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
                <text x="65" y="48" fill="#cbd5e1" fontFamily="monospace" fontSize="8">Transfo 25 MVA</text>
              </g>

              {/* MV Internal 15 kV Bus */}
              <g transform="translate(140, 30)">
                <line x1="0" y1="20" x2="110" y2="20" stroke="#0ea5e9" strokeWidth="3.5" />
                <text x="15" y="12" fill="#38bdf8" fontFamily="monospace" fontSize="9" fontWeight="bold">Jeu de Barres HTA 15 kV</text>
                
                {/* Feeder to Process Transformer */}
                <line x1="55" y1="20" x2="55" y2="55" stroke="#0ea5e9" strokeWidth="2" />
                <rect x="47" y="55" width="16" height="16" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" rx="2" />
                <text x="68" y="67" fill="#94a3b8" fontFamily="monospace" fontSize="8">Disj. HTA</text>

                {/* Step-down to LV */}
                <circle cx="55" cy="90" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="55" cy="106" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
                <text x="75" y="105" fill="#a7f3d0" fontFamily="monospace" fontSize="8">Transfo 2500 kVA</text>
              </g>

              {/* LV Form 4b Withdrawable MCC */}
              <g transform="translate(290, 25)">
                {/* Main 400 V Busbar */}
                <line x1="0" y1="50" x2="160" y2="50" stroke="#f59e0b" strokeWidth="4" />
                <text x="10" y="40" fill="#fbbf24" fontFamily="monospace" fontSize="9" fontWeight="bold">Jeu de Barres TGBT / MCC 400 V (3200 A)</text>

                {/* MCC Column & Withdrawable Drawers */}
                <rect x="10" y="60" width="140" height="95" fill="#0f172a" stroke="#475569" strokeWidth="2" rx="4" />
                <text x="20" y="74" fill="#94a3b8" fontFamily="monospace" fontSize="8" fontWeight="bold">MCC Colonne Tiroirs Forme 4b</text>

                {/* Drawer 1: DOL Starter */}
                <rect x="15" y="80" width="60" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
                <text x="20" y="93" fill="#38bdf8" fontFamily="monospace" fontSize="7" fontWeight="bold">T1: DOL 45 kW</text>
                <text x="20" y="104" fill="#64748b" fontFamily="monospace" fontSize="6">Relais ANSI 49</text>

                {/* Drawer 2: Soft Starter */}
                <rect x="80" y="80" width="65" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
                <text x="85" y="93" fill="#fbbf24" fontFamily="monospace" fontSize="7" fontWeight="bold">T2: Soft-Start 110 kW</text>
                <text x="85" y="104" fill="#64748b" fontFamily="monospace" fontSize="6">Thyristors Bypass</text>

                {/* Drawer 3: VFD Drive */}
                <rect x="15" y="115" width="130" height="32" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" rx="2" />
                <text x="20" y="128" fill="#34d399" fontFamily="monospace" fontSize="7" fontWeight="bold">T3: Variateur VFD 250 kW (Profinet IED)</text>
                <text x="20" y="140" fill="#6ee7b7" fontFamily="monospace" fontSize="6">Régulation Vitesse / Couple Boucle Fermée</text>
              </g>

              {/* End Motor Loads & ATEX Zone */}
              <g transform="translate(475, 45)">
                {/* Standard Induction Motor */}
                <circle cx="45" cy="40" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="32" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="9" fontWeight="bold">M 3~</text>
                <text x="15" y="75" fill="#94a3b8" fontFamily="monospace" fontSize="8">Broyeur / Pompe</text>

                {/* ATEX Zone Motor */}
                <rect x="10" y="90" width="70" height="40" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" rx="3" />
                <text x="18" y="105" fill="#fca5a5" fontFamily="monospace" fontSize="8" fontWeight="bold">Moteur Ex d IIC</text>
                <text x="15" y="122" fill="#f87171" fontFamily="monospace" fontSize="7">Zone 1 ATEX (T4)</text>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture Usine : Poste 90/15 kV → Boucle HTA → MCC Débrochable 400V (Forme 4b) → Actionneurs & ATEX</span>
              <span className="text-emerald-400 font-bold">Continuité Procédé : SIL 2 / Redondance N+1</span>
            </div>
          </div>
        )}

        {/* D09: Renewable Energy & DER (Solar PV, Wind, Inverters & 33 kV Evacuation) */}
        {domainCode === 'D09' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Solar PV Field with Single-Axis Tracker */}
              <g transform="translate(15, 20)">
                <rect x="0" y="5" width="65" height="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="3" transform="skewY(-10)" />
                <line x1="22" y1="5" x2="22" y2="47" stroke="#0284c7" strokeWidth="1" transform="skewY(-10)" />
                <line x1="44" y1="5" x2="44" y2="47" stroke="#0284c7" strokeWidth="1" transform="skewY(-10)" />
                <line x1="0" y1="26" x2="65" y2="26" stroke="#0284c7" strokeWidth="1" transform="skewY(-10)" />
                <text x="5" y="65" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold">PV Bifacial</text>
                <text x="2" y="76" fill="#94a3b8" fontFamily="monospace" fontSize="7">1500 V DC</text>

                {/* Sun radiation rays */}
                <circle cx="10" cy="-6" r="6" fill="#f59e0b" />
                <line x1="18" y1="-2" x2="28" y2="6" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
                <line x1="12" y1="4" x2="20" y2="15" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
              </g>

              {/* Wind Turbine Generator (PMSG) */}
              <g transform="translate(15, 105)">
                <line x1="30" y1="20" x2="30" y2="75" stroke="#64748b" strokeWidth="3" />
                <circle cx="30" cy="20" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                {/* 3 Blades */}
                <line x1="30" y1="20" x2="10" y2="5" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                <line x1="30" y1="20" x2="50" y2="10" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                <line x1="30" y1="20" x2="30" y2="42" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                <text x="4" y="86" fill="#e2e8f0" fontFamily="monospace" fontSize="8" fontWeight="bold">Éolienne 4.5 MW</text>
              </g>

              {/* DC String Combiner & DC Bus */}
              <line x1="85" y1="45" x2="130" y2="45" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="85" y1="52" x2="130" y2="52" stroke="#0ea5e9" strokeWidth="2.5" />
              <text x="86" y="38" fill="#f87171" fontFamily="monospace" fontSize="8">Bus ±1500V DC</text>

              {/* Inverter Skid (Power Station 3.125 MVA) */}
              <g transform="translate(130, 20)">
                <rect x="0" y="0" width="135" height="155" fill="#090d16" stroke="#06b6d4" strokeWidth="1.8" rx="5" />
                <rect x="0" y="0" width="135" height="20" fill="#083344" rx="4" />
                <text x="8" y="14" fill="#67e8f9" fontFamily="monospace" fontSize="9" fontWeight="bold">SKID CONVERSION HTA</text>

                {/* Inverter Box */}
                <rect x="10" y="28" width="115" height="42" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                <text x="16" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold">Onduleur IGBT 3.125 MVA</text>
                <text x="16" y="56" fill="#94a3b8" fontFamily="monospace" fontSize="7">MPPT / Q(U) / LVRT Ride-Thru</text>
                <text x="16" y="65" fill="#34d399" fontFamily="monospace" fontSize="7">Sortie : 690 V AC (50 Hz)</text>

                {/* Step-up Transformer 690V / 33kV */}
                <g transform="translate(15, 80)">
                  <circle cx="30" cy="20" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="48" cy="20" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
                  <text x="70" y="18" fill="#fbbf24" fontFamily="monospace" fontSize="8" fontWeight="bold">Transfo Skid</text>
                  <text x="70" y="28" fill="#34d399" fontFamily="monospace" fontSize="7">690 V / 33 kV</text>
                </g>

                {/* RMU 33 kV Switchgear */}
                <rect x="10" y="120" width="115" height="24" fill="#0f172a" stroke="#10b981" strokeWidth="1" rx="2" />
                <text x="16" y="135" fill="#6ee7b7" fontFamily="monospace" fontSize="8" fontWeight="bold">Cellule HTA RMU 33 kV (SF6)</text>
              </g>

              {/* 33 kV Underground Collector Line */}
              <line x1="265" y1="150" x2="360" y2="150" stroke="#10b981" strokeWidth="3" strokeDasharray="5,2" />
              <text x="270" y="142" fill="#34d399" fontFamily="monospace" fontSize="8">Câble XLPE 33 kV</text>

              {/* Central Power Plant Controller (PPC) */}
              <g transform="translate(280, 25)">
                <rect x="0" y="0" width="80" height="65" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="4" />
                <text x="8" y="16" fill="#c7d2fe" fontFamily="monospace" fontSize="8" fontWeight="bold">CONTRÔLEUR PPC</text>
                <text x="8" y="28" fill="#a5b4fc" fontFamily="monospace" fontSize="7">Cycle : 20 ms</text>
                <text x="8" y="40" fill="#a5b4fc" fontFamily="monospace" fontSize="7">Régul. Q(U) & P(f)</text>
                <text x="8" y="54" fill="#fbbf24" fontFamily="monospace" fontSize="7">CEI 60870-5-104</text>
                {/* Optical connection line to skid */}
                <line x1="0" y1="35" x2="-35" y2="35" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3,3" />
              </g>

              {/* Main Evacuation Substation & PCC */}
              <g transform="translate(370, 20)">
                <rect x="0" y="0" width="215" height="155" fill="#0f172a" stroke="#e11d48" strokeWidth="1.5" rx="5" />
                <rect x="0" y="0" width="215" height="20" fill="#4c0519" rx="4" />
                <text x="8" y="14" fill="#fda4af" fontFamily="monospace" fontSize="9" fontWeight="bold">POSTE ÉLÉVATEUR D'ÉVACUATION (PCC)</text>

                {/* Substation Transformer 33 / 225 kV */}
                <g transform="translate(15, 32)">
                  <circle cx="25" cy="25" r="18" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="50" cy="25" r="18" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="75" y="24" fill="#fda4af" fontFamily="monospace" fontSize="9" fontWeight="bold">Transfo 33 / 225 kV</text>
                  <text x="75" y="36" fill="#94a3b8" fontFamily="monospace" fontSize="8">40 MVA ONAN/ONAF</text>
                </g>

                {/* Main 225 kV High Voltage Breaker */}
                <line x1="68" y1="57" x2="135" y2="57" stroke="#e11d48" strokeWidth="3" />
                <rect x="135" y="47" width="20" height="20" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" rx="2" />
                <text x="137" y="40" fill="#fbbf24" fontFamily="monospace" fontSize="8">52-HV</text>

                {/* Protections & Meters at PCC */}
                <g transform="translate(15, 85)">
                  <rect x="0" y="0" width="185" height="58" fill="#1e293b" stroke="#64748b" strokeWidth="1" rx="3" />
                  <text x="8" y="16" fill="#e2e8f0" fontFamily="monospace" fontSize="8" fontWeight="bold">POINT DE RACCORDEMENT RÉSEAU (PCC)</text>
                  <text x="8" y="30" fill="#38bdf8" fontFamily="monospace" fontSize="7">Protections : ANSI 27/59 · 81U/O · 78 ROCOF · 67N</text>
                  <text x="8" y="42" fill="#34d399" fontFamily="monospace" fontSize="7">Compteur 4Q Classe 0.2s · Synchrophaseur PMU IEEE C37.118</text>
                  <text x="8" y="52" fill="#cbd5e1" fontFamily="monospace" fontSize="7">Vers Réseau Interconnecté SONATREL (RIN 225 kV)</text>
                </g>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture Centrale EnR : Modules 1500V DC / PMSG → MV Skid Inverter → Collecteur 33 kV → Poste 33/225 kV</span>
              <span className="text-cyan-400 font-bold">Code Réseau : LVRT / FFR / Q(U) &lt; 200 ms</span>
            </div>
          </div>
        )}

        {/* D10: Energy Storage System (BESS 1500V DC, Grid-Forming PCS & 350kW EV Charger) */}
        {domainCode === 'D10' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* BESS Container 40ft */}
              <g transform="translate(10, 15)">
                <rect x="0" y="0" width="170" height="165" fill="#090d16" stroke="#10b981" strokeWidth="1.8" rx="5" />
                <rect x="0" y="0" width="170" height="20" fill="#064e3b" rx="4" />
                <text x="8" y="14" fill="#6ee7b7" fontFamily="monospace" fontSize="9" fontWeight="bold">CONTENEUR BESS LFP 1500V</text>

                {/* Battery Racks 1500 V DC */}
                <g transform="translate(10, 26)">
                  {/* Rack 1 */}
                  <rect x="0" y="0" width="32" height="68" fill="#1e293b" stroke="#34d399" strokeWidth="1.2" rx="2" />
                  <rect x="3" y="4" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="3" y="15" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="3" y="26" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="3" y="37" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="3" y="48" width="26" height="8" fill="#0f766e" rx="1" />
                  <text x="5" y="64" fill="#a7f3d0" fontFamily="monospace" fontSize="6">Rack 1</text>

                  {/* Rack 2 */}
                  <rect x="38" y="0" width="32" height="68" fill="#1e293b" stroke="#34d399" strokeWidth="1.2" rx="2" />
                  <rect x="41" y="4" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="41" y="15" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="41" y="26" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="41" y="37" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="41" y="48" width="26" height="8" fill="#0f766e" rx="1" />
                  <text x="43" y="64" fill="#a7f3d0" fontFamily="monospace" fontSize="6">Rack 2</text>

                  {/* Rack N (Cluster) */}
                  <rect x="76" y="0" width="32" height="68" fill="#1e293b" stroke="#34d399" strokeWidth="1.2" rx="2" />
                  <rect x="79" y="4" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="79" y="15" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="79" y="26" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="79" y="37" width="26" height="8" fill="#0f766e" rx="1" />
                  <rect x="79" y="48" width="26" height="8" fill="#0f766e" rx="1" />
                  <text x="81" y="64" fill="#a7f3d0" fontFamily="monospace" fontSize="6">Rack N</text>

                  {/* High Voltage Box / Master BMS */}
                  <rect x="114" y="0" width="34" height="68" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" rx="2" />
                  <text x="117" y="14" fill="#38bdf8" fontFamily="monospace" fontSize="6" fontWeight="bold">HV-BOX</text>
                  <text x="117" y="26" fill="#94a3b8" fontFamily="monospace" fontSize="6">Master</text>
                  <text x="117" y="36" fill="#94a3b8" fontFamily="monospace" fontSize="6">BMS 3-Tier</text>
                  <circle cx="131" cy="50" r="5" fill="#ef4444" />
                  <text x="123" y="63" fill="#fca5a5" fontFamily="monospace" fontSize="5">Fusible</text>
                </g>

                {/* Liquid Cooling & Thermal HVAC */}
                <g transform="translate(10, 100)">
                  <rect x="0" y="0" width="148" height="22" fill="#0369a1" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1" rx="2" />
                  <text x="6" y="14" fill="#38bdf8" fontFamily="monospace" fontSize="7" fontWeight="bold">CHILLER LIQUIDE EAU-GLYCOL (ΔT &lt; 2.5°C)</text>
                </g>

                {/* Gas Detection & Fire Suppression */}
                <g transform="translate(10, 126)">
                  <rect x="0" y="0" width="148" height="28" fill="#7f1d1d" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" rx="2" />
                  <text x="6" y="12" fill="#f87171" fontFamily="monospace" fontSize="7" fontWeight="bold">SÉCURITÉ INCENDIE NFPA 855</text>
                  <text x="6" y="22" fill="#fca5a5" fontFamily="monospace" fontSize="6">Capteurs CO/H2 + Aérosol Novec 1230</text>
                </g>
              </g>

              {/* DC 1500V Link to PCS */}
              <line x1="180" y1="65" x2="205" y2="65" stroke="#ef4444" strokeWidth="3" />
              <line x1="180" y1="73" x2="205" y2="73" stroke="#0ea5e9" strokeWidth="3" />
              <text x="176" y="58" fill="#fca5a5" fontFamily="monospace" fontSize="6">1500V DC</text>

              {/* Bidirectional PCS Skid (Grid-Forming VSG) */}
              <g transform="translate(205, 15)">
                <rect x="0" y="0" width="145" height="165" fill="#090d16" stroke="#0284c7" strokeWidth="1.8" rx="5" />
                <rect x="0" y="0" width="145" height="20" fill="#0c4a6e" rx="4" />
                <text x="8" y="14" fill="#7dd3fc" fontFamily="monospace" fontSize="9" fontWeight="bold">SKID CONVERTISSEUR PCS</text>

                {/* 4-Quadrant Bidirectional Inverter */}
                <rect x="8" y="28" width="129" height="52" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                <text x="14" y="42" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold">PCS 2.5 MVA (4-Quadrants)</text>
                <text x="14" y="54" fill="#34d399" fontFamily="monospace" fontSize="7">Mode Grid-Forming / VSG Droop</text>
                <text x="14" y="65" fill="#fbbf24" fontFamily="monospace" fontSize="7">FFR &lt; 120 ms · P ± 50 MW</text>
                <text x="14" y="74" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">AC : 690 V Triphasé (50 Hz)</text>

                {/* Step-Up Transformer 690V / 33kV */}
                <g transform="translate(10, 88)">
                  <circle cx="35" cy="20" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="53" cy="20" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
                  <text x="75" y="18" fill="#fbbf24" fontFamily="monospace" fontSize="8" fontWeight="bold">Transfo Skid</text>
                  <text x="75" y="28" fill="#34d399" fontFamily="monospace" fontSize="7">690 V / 33 kV</text>
                </g>

                {/* RMU 33 kV Breaker */}
                <rect x="8" y="130" width="129" height="25" fill="#0f172a" stroke="#10b981" strokeWidth="1" rx="2" />
                <text x="12" y="146" fill="#6ee7b7" fontFamily="monospace" fontSize="8" fontWeight="bold">Cellule HTA 33 kV (Vide)</text>
              </g>

              {/* 33 kV Bus & Grid Interconnection */}
              <line x1="350" y1="145" x2="425" y2="145" stroke="#10b981" strokeWidth="3" />
              <text x="355" y="138" fill="#34d399" fontFamily="monospace" fontSize="8">Réseau 33 kV</text>

              {/* 33 kV Substation Feed & EMS Telemetry */}
              <g transform="translate(425, 15)">
                <rect x="0" y="0" width="165" height="75" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" rx="4" />
                <text x="8" y="15" fill="#c7d2fe" fontFamily="monospace" fontSize="8" fontWeight="bold">SUPERVISEUR EMS & PCC</text>
                <text x="8" y="28" fill="#38bdf8" fontFamily="monospace" fontSize="7">Raccordement Poste Garoua/Maroua</text>
                <text x="8" y="40" fill="#34d399" fontFamily="monospace" fontSize="7">Téléréglage AGC TSO (SONATREL)</text>
                <text x="8" y="52" fill="#fbbf24" fontFamily="monospace" fontSize="7">ANSI 81U/O · 76 DC · 49B · 64R</text>
                <text x="8" y="65" fill="#a5b4fc" fontFamily="monospace" fontSize="6.5">Temps de cycle AGC : 100 ms</text>
              </g>

              {/* EV Ultra-Fast Charging Hub (350 kW DC - IRVE) */}
              <g transform="translate(425, 100)">
                <rect x="0" y="0" width="165" height="80" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                <rect x="0" y="0" width="165" height="18" fill="#78350f" rx="3" />
                <text x="8" y="13" fill="#fde68a" fontFamily="monospace" fontSize="8" fontWeight="bold">BORNE RECHARGE ULTRA-RAPIDE</text>
                
                <rect x="8" y="24" width="70" height="48" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" rx="2" />
                <text x="12" y="38" fill="#fbbf24" fontFamily="monospace" fontSize="7" fontWeight="bold">HPC 350 kW</text>
                <text x="12" y="48" fill="#94a3b8" fontFamily="monospace" fontSize="6">150-1000V DC</text>
                <text x="12" y="58" fill="#38bdf8" fontFamily="monospace" fontSize="6">500A Liquide</text>
                <text x="12" y="68" fill="#34d399" fontFamily="monospace" fontSize="6">ISO 15118</text>

                <g transform="translate(85, 24)">
                  <text x="0" y="12" fill="#e2e8f0" fontFamily="monospace" fontSize="7" fontWeight="bold">Corridor RN3</text>
                  <text x="0" y="23" fill="#94a3b8" fontFamily="monospace" fontSize="6">Douala - Yaoundé</text>
                  <text x="0" y="34" fill="#6ee7b7" fontFamily="monospace" fontSize="6">Dynamic Load</text>
                  <text x="0" y="44" fill="#6ee7b7" fontFamily="monospace" fontSize="6">Management (DLM)</text>
                </g>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture BESS & IRVE : Racks LFP 1500V DC → PCS Grid-Forming 2.5 MVA → Skid 33 kV & Bornes HPC 350 kW</span>
              <span className="text-emerald-400 font-bold">FFR Réserve Primaire &lt; 120 ms · RTE 88.5%</span>
            </div>
          </div>
        )}

        {/* D11: Protection Systems, Digital Relays & IEC 61850 Digital Substation */}
        {domainCode === 'D11' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* High-Voltage Busbar & Line Feeder */}
              <line x1="20" y1="25" x2="580" y2="25" stroke="#ef4444" strokeWidth="4" />
              <text x="25" y="18" fill="#f87171" fontFamily="monospace" fontSize="9" fontWeight="bold">JEU DE BARRES 225 kV · POSTE MANOMBÉ / NACHTIGAL</text>

              {/* Bay 1: Transmission Line Feeder Bay */}
              <line x1="120" y1="25" x2="120" y2="45" stroke="#ef4444" strokeWidth="2.5" />
              {/* Disconnector 89 */}
              <line x1="115" y1="45" x2="125" y2="58" stroke="#38bdf8" strokeWidth="2" />
              <line x1="120" y1="58" x2="120" y2="68" stroke="#ef4444" strokeWidth="2" />
              {/* Circuit Breaker 52 with trip coil */}
              <rect x="106" y="68" width="28" height="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />
              <text x="110" y="84" fill="#fbbf24" fontFamily="monospace" fontSize="9" fontWeight="bold">52-L</text>
              <line x1="120" y1="92" x2="120" y2="108" stroke="#ef4444" strokeWidth="2.5" />

              {/* Instrument Transformers (CT & CVT) */}
              <circle cx="120" cy="115" r="7" fill="none" stroke="#a78bfa" strokeWidth="2" />
              <circle cx="120" cy="122" r="7" fill="none" stroke="#a78bfa" strokeWidth="2" />
              <text x="82" y="122" fill="#c4b5fd" fontFamily="monospace" fontSize="8">TC 5P20</text>
              <line x1="120" y1="129" x2="120" y2="155" stroke="#ef4444" strokeWidth="2.5" />
              {/* Line Reactor / Wave Trap / Output to Line */}
              <line x1="120" y1="155" x2="120" y2="185" stroke="#ef4444" strokeWidth="2.5" />
              <text x="50" y="175" fill="#f87171" fontFamily="monospace" fontSize="8" fontWeight="bold">Ligne 225 kV</text>
              <text x="50" y="186" fill="#94a3b8" fontFamily="monospace" fontSize="7">vers Bekoko</text>

              {/* Process Bus Merging Unit (MU) */}
              <rect x="155" y="105" width="85" height="35" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" rx="3" />
              <text x="162" y="118" fill="#22d3ee" fontFamily="monospace" fontSize="7.5" fontWeight="bold">MERGING UNIT</text>
              <text x="162" y="128" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">CEI 61869-9 / 9-2LE</text>
              <text x="162" y="136" fill="#34d399" fontFamily="monospace" fontSize="6">SV 4000 Hz · PTP &lt;1µs</text>
              {/* Analog wiring to MU */}
              <path d="M 127 118 L 155 118" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="2 2" />

              {/* Optical Fiber Process Bus (Cyan Dash) */}
              <path d="M 240 122 L 280 122 L 280 75 L 305 75" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" fill="none" />
              <text x="245" y="112" fill="#22d3ee" fontFamily="monospace" fontSize="7">Process Bus (SV)</text>

              {/* Protection IED 1: Distance Relay ANSI 21/21N */}
              <rect x="305" y="45" width="125" height="52" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" rx="4" />
              <rect x="310" y="50" width="30" height="20" fill="#020617" stroke="#38bdf8" strokeWidth="1" rx="2" />
              {/* R-X plane mini polygon */}
              <polygon points="314,64 326,53 336,55 330,67" fill="none" stroke="#22c55e" strokeWidth="1" />
              <text x="345" y="58" fill="#a5b4fc" fontFamily="monospace" fontSize="8" fontWeight="bold">RELAIS DISTANCE</text>
              <text x="345" y="68" fill="#818cf8" fontFamily="monospace" fontSize="7">ANSI 21/21N &amp; 67N</text>
              <text x="312" y="82" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Zone 1: 85% (&lt;20ms)</text>
              <text x="312" y="91" fill="#fcd34d" fontFamily="monospace" fontSize="6.5">Téléaction POTT / OPGW</text>

              {/* High-Speed GOOSE Trip Order to Breaker */}
              <path d="M 305 60 L 134 60 L 134 72" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
              <text x="145" y="56" fill="#fbbf24" fontFamily="monospace" fontSize="6.5" fontWeight="bold">GOOSE Trip &lt;2.5ms</text>

              {/* Bay 2: Power Transformer 225/30 kV */}
              <line x1="490" y1="25" x2="490" y2="45" stroke="#ef4444" strokeWidth="2.5" />
              <rect x="476" y="45" width="28" height="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />
              <text x="480" y="59" fill="#fbbf24" fontFamily="monospace" fontSize="8" fontWeight="bold">52-T</text>
              <line x1="490" y1="67" x2="490" y2="85" stroke="#ef4444" strokeWidth="2" />
              <circle cx="490" cy="85" r="5" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <circle cx="484" cy="108" r="16" fill="none" stroke="#ec4899" strokeWidth="2" />
              <circle cx="496" cy="118" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="490" cy="142" r="5" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <text x="515" y="112" fill="#f472b6" fontFamily="monospace" fontSize="7.5" fontWeight="bold">TRANSFO 80 MVA</text>
              <text x="515" y="122" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">225 kV / 33 kV</text>

              {/* Protection IED 2: Differential Relay ANSI 87T */}
              <rect x="305" y="112" width="125" height="52" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" rx="4" />
              <rect x="310" y="117" width="30" height="20" fill="#020617" stroke="#ec4899" strokeWidth="1" rx="2" />
              {/* Differential slope curve */}
              <path d="M 313 133 L 322 133 L 336 120" stroke="#f472b6" strokeWidth="1" fill="none" />
              <text x="345" y="125" fill="#fbcfe8" fontFamily="monospace" fontSize="8" fontWeight="bold">RELAIS DIFF 87T</text>
              <text x="345" y="135" fill="#f472b6" fontFamily="monospace" fontSize="7">CEI 60255-187-1</text>
              <text x="312" y="149" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Retenue H2 (Inrush)</text>
              <text x="312" y="158" fill="#34d399" fontFamily="monospace" fontSize="6.5">Déclenchement &lt; 18 ms</text>

              {/* Station Bus IEC 61850 MMS / SCADA */}
              <line x1="260" y1="180" x2="570" y2="180" stroke="#10b981" strokeWidth="2" />
              <circle cx="265" cy="180" r="3" fill="#10b981" />
              <text x="275" y="176" fill="#34d399" fontFamily="monospace" fontSize="7.5" fontWeight="bold">STATION BUS CEI 61850 MMS · REDONDANCE PRP/HSR</text>
              <text x="275" y="191" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Synchronisation PTP IEEE 1588v2 Grandmaster &lt; 1 µs · Supervision SCADA SONATREL</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture Poste Numérique CEI 61850 : Merging Units → Relais de Distance (21) &amp; Différentiel (87T) → Trame GOOSE &lt; 2.5 ms</span>
              <span className="text-amber-400 font-bold">Élimination de défaut totale &lt; 65 ms</span>
            </div>
          </div>
        )}

        {/* D12: Substation Automation, SCADA, RTU & Operational Control */}
        {domainCode === 'D12' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Level 3: National Dispatching SCADA / EMS (SONATREL) */}
              <rect x="15" y="12" width="165" height="52" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" rx="5" />
              <rect x="25" y="18" width="40" height="24" fill="#020617" stroke="#38bdf8" strokeWidth="1" rx="2" />
              {/* Mini SCADA display */}
              <line x1="29" y1="24" x2="61" y2="24" stroke="#ef4444" strokeWidth="1.5" />
              <circle cx="45" cy="30" r="3" fill="#22c55e" />
              <text x="72" y="27" fill="#38bdf8" fontFamily="monospace" fontSize="7.5" fontWeight="bold">DISPATCHING CNC</text>
              <text x="72" y="37" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">SCADA/EMS Yaoundé</text>
              <text x="25" y="55" fill="#34d399" fontFamily="monospace" fontSize="6.5">CEI 60870-5-104 / TLS 1.3</text>

              {/* OPGW Fiber Link WAN */}
              <path d="M 180 38 L 245 38" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3 2" />
              <text x="187" y="30" fill="#38bdf8" fontFamily="monospace" fontSize="7" fontWeight="bold">OPGW WAN</text>
              <text x="187" y="50" fill="#94a3b8" fontFamily="monospace" fontSize="6">&lt; 15 ms Latence</text>

              {/* Level 2: Substation Level - RTU Gateway & Local HMI */}
              <rect x="245" y="12" width="160" height="52" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" rx="5" />
              <text x="255" y="27" fill="#a5b4fc" fontFamily="monospace" fontSize="8" fontWeight="bold">PASSERELLE RTU / SAS</text>
              <text x="255" y="38" fill="#c7d2fe" fontFamily="monospace" fontSize="7">Double CPU Redondante</text>
              <text x="255" y="49" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">SOE 1 ms · Cybersécurité CEI 62351</text>
              <text x="255" y="58" fill="#34d399" fontFamily="monospace" fontSize="6.5">Serveur MMS &amp; Client 104</text>

              {/* Local HMI Console */}
              <rect x="425" y="12" width="160" height="52" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="5" />
              <text x="435" y="27" fill="#34d399" fontFamily="monospace" fontSize="8" fontWeight="bold">IHM LOCALE TACTILE</text>
              <text x="435" y="38" fill="#a7f3d0" fontFamily="monospace" fontSize="7">Synoptique Unifilaire Dynamique</text>
              <text x="435" y="49" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Consignation Virtuelle / LOTO</text>
              <text x="435" y="58" fill="#fcd34d" fontFamily="monospace" fontSize="6.5">Commandes SBO Sécurisées</text>

              {/* Dual Redundant PRP Station Bus (LAN A: Cyan, LAN B: Amber) */}
              <line x1="20" y1="82" x2="580" y2="82" stroke="#06b6d4" strokeWidth="2.5" />
              <text x="25" y="78" fill="#22d3ee" fontFamily="monospace" fontSize="7" fontWeight="bold">STATION BUS PRP LAN-A (CEI 62439-3) · 1 Gbps OPTIQUE</text>
              <line x1="20" y1="94" x2="580" y2="94" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="25" y="103" fill="#fbbf24" fontFamily="monospace" fontSize="7" fontWeight="bold">STATION BUS PRP LAN-B · ZÉRO TEMPS DE RECOUVREMENT (BUMPLESS)</text>

              {/* Vertical link from RTU & HMI to Station Bus */}
              <line x1="325" y1="64" x2="325" y2="82" stroke="#6366f1" strokeWidth="2" />
              <line x1="505" y1="64" x2="505" y2="82" stroke="#10b981" strokeWidth="2" />

              {/* Level 1: Bay Controllers (BCU) */}
              {/* Bay 1: Line Bay BCU */}
              <rect x="35" y="118" width="155" height="54" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
              <text x="43" y="132" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold">BCU TRAVÉE LIGNE 225 kV</text>
              <text x="43" y="143" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Interverrouillage Logique 89/52</text>
              <text x="43" y="153" fill="#fbbf24" fontFamily="monospace" fontSize="6.5">Contrôle Synchro ANSI 25</text>
              <text x="43" y="163" fill="#34d399" fontFamily="monospace" fontSize="6.5">TCS Surveillance Déclenchement</text>

              {/* Bay 2: Transformer Bay BCU */}
              <rect x="222" y="118" width="155" height="54" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" rx="4" />
              <text x="230" y="132" fill="#c084fc" fontFamily="monospace" fontSize="8" fontWeight="bold">BCU TRAVÉE TRANSFO</text>
              <text x="230" y="143" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Régulateur Automatique Tension (AVR)</text>
              <text x="230" y="153" fill="#f472b6" fontFamily="monospace" fontSize="6.5">Commande Changeur de Prises (OLTC)</text>
              <text x="230" y="163" fill="#34d399" fontFamily="monospace" fontSize="6.5">Surveillance Buchholz &amp; Températures</text>

              {/* Time Server: GPS PTP Grandmaster Clock */}
              <rect x="410" y="118" width="165" height="54" fill="#022c22" stroke="#10b981" strokeWidth="1.5" rx="4" />
              <text x="418" y="132" fill="#34d399" fontFamily="monospace" fontSize="8" fontWeight="bold">HORLOGE PTP GRANDMASTER</text>
              <text x="418" y="143" fill="#a7f3d0" fontFamily="monospace" fontSize="6.5">Synchronisation GPS &lt; 50 ns</text>
              <text x="418" y="153" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Profil Énergie IEEE C37.238</text>
              <text x="418" y="163" fill="#fcd34d" fontFamily="monospace" fontSize="6.5">Maintien Rubidium (Holdover &lt; 1 µs)</text>

              {/* Connections to Bus */}
              <path d="M 112 118 L 112 94" stroke="#06b6d4" strokeWidth="1.5" />
              <path d="M 116 118 L 116 94" stroke="#f59e0b" strokeWidth="1.5" />
              <path d="M 300 118 L 300 94" stroke="#06b6d4" strokeWidth="1.5" />
              <path d="M 304 118 L 304 94" stroke="#f59e0b" strokeWidth="1.5" />
              <path d="M 492 118 L 492 94" stroke="#10b981" strokeWidth="1.5" />

              {/* Level 0 Switchgear Wiring Link */}
              <line x1="35" y1="184" x2="575" y2="184" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <text x="45" y="194" fill="#64748b" fontFamily="monospace" fontSize="7">Niveau 0 : Actionneurs disjoncteurs SF6, sectionneurs motorisés 110 V DC et contacts fin de course 52a/52b</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture Contrôle-Commande Numérique (CCN) : BCU Travées → Double Anneau PRP/HSR → RTU Passerelle CEI 60870-5-104</span>
              <span className="text-cyan-400 font-bold">SOE Horodatage &lt; 1 ms · PRP Basculement 0 ms</span>
            </div>
          </div>
        )}

        {/* D13: Communications, OPGW Fiber & Operational Technology (OT) Networks */}
        {domainCode === 'D13' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* OPGW Cable & Pylon Crossarm Top Left */}
              <rect x="15" y="12" width="165" height="52" fill="#0c1d2e" stroke="#0284c7" strokeWidth="1.5" rx="5" />
              <text x="25" y="27" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold">CÂBLE DE GARDE OPGW 48 FO</text>
              <text x="25" y="38" fill="#bae6fd" fontFamily="monospace" fontSize="7">Tube Inox · Fibre G.652D Monomode</text>
              <text x="25" y="49" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Atténuation : 0.21 dB/km à 1550 nm</text>
              <text x="25" y="58" fill="#34d399" fontFamily="monospace" fontSize="6.5">Boîte de jonction étanche IP68</text>

              {/* Optical Link between OPGW and Substation ODF */}
              <path d="M 180 38 L 225 38" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="187" y="31" fill="#0ea5e9" fontFamily="monospace" fontSize="6.5" fontWeight="bold">FO 1550nm</text>

              {/* Substation Optical Distribution Frame (ODF) & Patch Panel */}
              <rect x="225" y="12" width="155" height="52" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" rx="5" />
              <text x="235" y="27" fill="#22d3ee" fontFamily="monospace" fontSize="8" fontWeight="bold">TIROIR OPTIQUE (ODF)</text>
              <text x="235" y="38" fill="#a5f3fc" fontFamily="monospace" fontSize="7">Connecteurs LC/APC &lt; 0.2 dB</text>
              <text x="235" y="49" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Tête de câble &amp; Jarretières G.657</text>
              <text x="235" y="58" fill="#fbbf24" fontFamily="monospace" fontSize="6.5">Mesure Réflectométrique OTDR</text>

              {/* Link to MPLS-TP Core */}
              <line x1="380" y1="38" x2="420" y2="38" stroke="#06b6d4" strokeWidth="2.5" />

              {/* Multiplexer / Packet Optical MPLS-TP Node */}
              <rect x="420" y="12" width="165" height="52" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" rx="5" />
              <text x="430" y="27" fill="#c084fc" fontFamily="monospace" fontSize="8" fontWeight="bold">NOEUD MPLS-TP DÉTERMINISTE</text>
              <text x="430" y="38" fill="#ddd6fe" fontFamily="monospace" fontSize="7">10 Gbps Anneau de Transport</text>
              <text x="430" y="49" fill="#34d399" fontFamily="monospace" fontSize="6.5">Basculement 1:1 &lt; 50 ms (Bumpless)</text>
              <text x="430" y="58" fill="#f472b6" fontFamily="monospace" fontSize="6.5">Synchronisation PTP IEEE 1588v2</text>

              {/* Dual Bus / Split Layer for Services */}
              <line x1="20" y1="84" x2="580" y2="84" stroke="#8b5cf6" strokeWidth="2.5" />
              <text x="25" y="80" fill="#c084fc" fontFamily="monospace" fontSize="7" fontWeight="bold">BUS DE TRANSPORT CARRIER ETHERNET / MPLS-TP (PRIORISATION CIR/EIR QoS STRICTE)</text>

              {/* Service 1: Teleprotection IEEE C37.94 for Line Diff 87L */}
              <rect x="25" y="112" width="165" height="56" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" rx="4" />
              <text x="33" y="126" fill="#fb7185" fontFamily="monospace" fontSize="8" fontWeight="bold">TÉLÉPROTECTION IEEE C37.94</text>
              <text x="33" y="137" fill="#fecdd3" fontFamily="monospace" fontSize="7">Canal 2 Mbps / N x 64 kbps Dédié</text>
              <text x="33" y="148" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Latence Unidirectionnelle &lt; 5 ms</text>
              <text x="33" y="158" fill="#fbbf24" fontFamily="monospace" fontSize="6.5">Asymétrie Tx/Rx &lt; 0.2 ms (ANSI 87L)</text>

              {/* Service 2: SCADA WAN Router with IEC 62351 Cybersecurity */}
              <rect x="215" y="112" width="170" height="56" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="4" />
              <text x="223" y="126" fill="#34d399" fontFamily="monospace" fontSize="8" fontWeight="bold">ROUTEUR WAN OT CEI 62351</text>
              <text x="223" y="137" fill="#a7f3d0" fontFamily="monospace" fontSize="7">Tunnel IPsec / MACsec Chiffré</text>
              <text x="223" y="148" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Trames SCADA CEI 60870-5-104</text>
              <text x="223" y="158" fill="#38bdf8" fontFamily="monospace" fontSize="6.5">Authentification Certificats X.509</text>

              {/* Service 3: Backup Microwave Radio Link (Faisceau Hertzien) */}
              <rect x="410" y="112" width="165" height="56" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
              <text x="418" y="126" fill="#fbbf24" fontFamily="monospace" fontSize="8" fontWeight="bold">SECOURS FAISCEAU HERTZIEN (FH)</text>
              <text x="418" y="137" fill="#fef3c7" fontFamily="monospace" fontSize="7">Bande 7 GHz / 13 GHz Numérique</text>
              <text x="418" y="148" fill="#94a3b8" fontFamily="monospace" fontSize="6.5">Disponibilité Télécom 99.999%</text>
              <text x="418" y="158" fill="#a3e635" fontFamily="monospace" fontSize="6.5">Relève Automatique en Cas de Coupure</text>

              {/* Vertical link lines to bus */}
              <line x1="500" y1="64" x2="500" y2="84" stroke="#8b5cf6" strokeWidth="2" />
              <line x1="107" y1="84" x2="107" y2="112" stroke="#f43f5e" strokeWidth="1.5" />
              <line x1="300" y1="84" x2="300" y2="112" stroke="#10b981" strokeWidth="1.5" />
              <line x1="492" y1="84" x2="492" y2="112" stroke="#f59e0b" strokeWidth="1.5" />

              {/* Sub-banner note */}
              <line x1="25" y1="184" x2="575" y2="184" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <text x="35" y="194" fill="#64748b" fontFamily="monospace" fontSize="7">Backbone WAN SONATREL : Liaisons OPGW 225 kV Nachtigal - Yaoundé - Douala · Protection 87L · Chiffrement CEI 62351</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Backbone Télécom &amp; OT : Câble OPGW 48 FO G.652D → Nœud MPLS-TP Déterministe → Téléprotection IEEE C37.94</span>
              <span className="text-cyan-400 font-bold">Latence &lt; 5 ms · Asymétrie &lt; 0.2 ms · Chiffrement TLS 1.3</span>
            </div>
          </div>
        )}

        {/* D14: Power Quality, Harmonics, EMC & STATCOM Mitigation */}
        {domainCode === 'D14' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Primary Busbar 30 kV HTA */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="#a855f7" strokeWidth="4" />
              <text x="25" y="20" fill="#c084fc" fontFamily="monospace" fontSize="11" fontWeight="bold">Jeu de Barres HTA 30 kV (PCC - Point de Raccordement Commun)</text>

              {/* Distorted Current Waveform from Industrial Load */}
              <g transform="translate(40, 45)">
                <rect x="0" y="0" width="110" height="60" fill="#18181b" stroke="#71717a" strokeWidth="1.5" rx="4" />
                <path d="M 5 30 Q 15 5 25 30 T 45 30 T 65 30 T 85 30 T 105 30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,1" />
                {/* Harmonic spikes superimposed */}
                <path d="M 5 30 C 12 8, 18 45, 25 30 C 32 15, 38 52, 45 30 C 52 10, 58 48, 65 30 C 72 18, 78 50, 85 30 C 92 12, 98 46, 105 30" fill="none" stroke="#f87171" strokeWidth="1.8" />
                <text x="6" y="14" fill="#f87171" fontFamily="monospace" fontSize="8" fontWeight="bold">Onde Polluée (THDi 28%)</text>
                <text x="6" y="54" fill="#a1a1aa" fontFamily="monospace" fontSize="7.5">Charge Non-Linéaire</text>
              </g>

              {/* Connection to Non-linear Load (Rectifier / Arc Furnace) */}
              <line x1="95" y1="30" x2="95" y2="45" stroke="#a855f7" strokeWidth="2.5" />
              <line x1="95" y1="105" x2="95" y2="125" stroke="#ef4444" strokeWidth="2" />
              <rect x="70" y="125" width="50" height="35" fill="#27272a" stroke="#ef4444" strokeWidth="2" rx="3" />
              <text x="75" y="142" fill="#fca5a5" fontFamily="monospace" fontSize="9" fontWeight="bold">Redresseur</text>
              <text x="77" y="153" fill="#94a3b8" fontFamily="monospace" fontSize="7.5">6/12 Pulses</text>

              {/* Class A Power Quality Analyzer (CEI 61000-4-30) */}
              <g transform="translate(165, 45)">
                <rect x="0" y="0" width="115" height="115" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" rx="4" />
                <rect x="8" y="8" width="99" height="50" fill="#020617" stroke="#334155" rx="2" />
                {/* FFT Spectrum Bars (Fundamental, 5th, 7th, 11th, 13th) */}
                <line x1="20" y1="52" x2="20" y2="16" stroke="#22c55e" strokeWidth="4" />
                <line x1="36" y1="52" x2="36" y2="28" stroke="#ef4444" strokeWidth="4" />
                <line x1="52" y1="52" x2="52" y2="35" stroke="#f59e0b" strokeWidth="4" />
                <line x1="68" y1="52" x2="68" y2="42" stroke="#38bdf8" strokeWidth="4" />
                <line x1="84" y1="52" x2="84" y2="46" stroke="#a855f7" strokeWidth="4" />
                <text x="16" y="57" fill="#64748b" fontFamily="monospace" fontSize="6">H1</text>
                <text x="32" y="57" fill="#f87171" fontFamily="monospace" fontSize="6">H5</text>
                <text x="48" y="57" fill="#fbbf24" fontFamily="monospace" fontSize="6">H7</text>
                <text x="64" y="57" fill="#38bdf8" fontFamily="monospace" fontSize="6">H11</text>
                <text x="80" y="57" fill="#c084fc" fontFamily="monospace" fontSize="6">H13</text>
                
                <text x="10" y="72" fill="#22d3ee" fontFamily="monospace" fontSize="9" fontWeight="bold">Analyseur Classe A</text>
                <text x="10" y="84" fill="#cbd5e1" fontFamily="monospace" fontSize="8">THDu: 1.8% · Pst: 0.65</text>
                <text x="10" y="96" fill="#cbd5e1" fontFamily="monospace" fontSize="8">Déséquilibre u2: 0.8%</text>
                <text x="10" y="108" fill="#10b981" fontFamily="monospace" fontSize="7.5" fontWeight="bold">CEI 61000-4-30 ED3</text>
              </g>
              <line x1="220" y1="30" x2="220" y2="45" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" />

              {/* Shunt Active Power Filter (APF / FAP) */}
              <g transform="translate(295, 45)">
                <rect x="0" y="0" width="130" height="115" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" rx="4" />
                <text x="12" y="18" fill="#c4b5fd" fontFamily="monospace" fontSize="10" fontWeight="bold">Filtre Actif Shunt (APF)</text>
                <text x="12" y="30" fill="#a78bfa" fontFamily="monospace" fontSize="8">Onduleur IGBT 3-Niveaux NPC</text>

                {/* Counter-Phase Compensation Waveform */}
                <rect x="10" y="36" width="110" height="34" fill="#09090b" stroke="#4c1d95" rx="2" />
                <path d="M 15 53 C 22 72, 28 35, 35 53 C 42 70, 48 36, 55 53 C 62 73, 68 38, 75 53 C 82 69, 88 37, 95 53 C 102 71, 108 39, 115 53" fill="none" stroke="#a855f7" strokeWidth="1.8" />
                <text x="14" y="47" fill="#d8b4fe" fontFamily="monospace" fontSize="7.5">Courant Opposé -I_h</text>

                {/* DC Link & Control DSP */}
                <rect x="10" y="76" width="50" height="24" fill="#312e81" rx="2" />
                <text x="14" y="87" fill="#c7d2fe" fontFamily="monospace" fontSize="7.5">Bus DC 800V</text>
                <text x="14" y="96" fill="#818cf8" fontFamily="monospace" fontSize="6.5">Condensateurs</text>

                <rect x="66" y="76" width="54" height="24" fill="#0f172a" stroke="#6366f1" rx="2" />
                <text x="70" y="87" fill="#a5b4fc" fontFamily="monospace" fontSize="7.5">Contrôleur DSP</text>
                <text x="70" y="96" fill="#34d399" fontFamily="monospace" fontSize="6.5">Temps rép. &lt; 5 ms</text>
                <text x="12" y="110" fill="#38bdf8" fontFamily="monospace" fontSize="7.5">Dépollution H5, H7, H11, H13</text>
              </g>
              <line x1="360" y1="30" x2="360" y2="45" stroke="#8b5cf6" strokeWidth="3" />

              {/* STATCOM / Fast Reactive Compensator */}
              <g transform="translate(440, 45)">
                <rect x="0" y="0" width="135" height="115" fill="#14532d" stroke="#22c55e" strokeWidth="2" rx="4" />
                <text x="10" y="18" fill="#86efac" fontFamily="monospace" fontSize="10" fontWeight="bold">STATCOM ±10 Mvar</text>
                <text x="10" y="30" fill="#4ade80" fontFamily="monospace" fontSize="8">Soutien Dynamique Tension</text>

                {/* Inductor & Capacitor Symbol */}
                <g transform="translate(15, 38)">
                  <circle cx="20" cy="18" r="14" fill="none" stroke="#bbf7d0" strokeWidth="2" />
                  <path d="M 12 18 Q 20 6 28 18" fill="none" stroke="#22c55e" strokeWidth="2" />
                  <line x1="55" y1="6" x2="55" y2="30" stroke="#bbf7d0" strokeWidth="2" />
                  <line x1="65" y1="6" x2="65" y2="30" stroke="#bbf7d0" strokeWidth="2" />
                  <text x="44" y="38" fill="#86efac" fontFamily="monospace" fontSize="7">±Q Réactif</text>
                </g>

                <rect x="10" y="76" width="115" height="32" fill="#052e16" stroke="#16a34a" rx="2" />
                <text x="14" y="88" fill="#4ade80" fontFamily="monospace" fontSize="7.5" fontWeight="bold">Atténuation Creux Tension</text>
                <text x="14" y="98" fill="#86efac" fontFamily="monospace" fontSize="7.5">Réduction Flicker (Pst &lt; 0.8)</text>
                <text x="14" y="106" fill="#cbd5e1" fontFamily="monospace" fontSize="6.5">Temps de réponse sub-cycle &lt; 20 ms</text>
              </g>
              <line x1="505" y1="30" x2="505" y2="45" stroke="#22c55e" strokeWidth="3" />

              {/* Clean Output Sine Wave indicator */}
              <g transform="translate(480, 168)">
                <path d="M 0 10 Q 12 -2 25 10 T 50 10 T 75 10" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                <text x="80" y="13" fill="#4ade80" fontFamily="monospace" fontSize="9" fontWeight="bold">Onde Sinusoïdale Purifiée (THDu &lt; 2%)</text>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Power Quality &amp; EMC : Dépollution Harmonique APF + STATCOM Dynamique ±Q + Analyse Classe A CEI 61000-4-30</span>
              <span className="text-purple-400 font-bold">THDu &lt; 5% · THDi &lt; 8% · Pst &lt; 0.8 · IEEE 519-2022</span>
            </div>
          </div>
        )}

        {/* D15: Metering, Smart Grids & Grid Digitalization */}
        {domainCode === 'D15' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Customer Level: Smart Meters */}
              <g transform="translate(15, 20)">
                <rect x="0" y="0" width="120" height="155" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" rx="6" />
                <rect x="0" y="0" width="120" height="24" fill="#0284c7" rx="4" />
                <text x="60" y="16" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {locale === 'fr' ? 'COMPTEUR AMI ABONNÉ' : 'AMI SMART METER'}
                </text>
                
                {/* LCD Display */}
                <rect x="15" y="32" width="90" height="26" fill="#064e3b" stroke="#059669" rx="2" />
                <text x="60" y="49" fill="#34d399" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">
                  004285.6 kWh
                </text>

                {/* Keypad & STS Tokens */}
                <rect x="25" y="66" width="70" height="32" fill="#1e293b" stroke="#475569" rx="3" />
                <text x="60" y="78" fill="#94a3b8" fontFamily="monospace" fontSize="7" textAnchor="middle">Clavier STS 20 Digits</text>
                <text x="60" y="90" fill="#38bdf8" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Prépayé / Post-payé</text>

                {/* Contactor */}
                <rect x="15" y="106" width="90" height="20" fill="#1e293b" stroke="#eab308" rx="2" />
                <text x="60" y="120" fill="#facc15" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">Relais 100A / Anti-Fraude</text>

                {/* Optical & DLMS Ports */}
                <circle cx="35" cy="138" r="5" fill="#64748b" />
                <circle cx="85" cy="138" r="5" fill="#64748b" />
                <text x="60" y="142" fill="#94a3b8" fontFamily="monospace" fontSize="7" textAnchor="middle">DLMS/COSEM Port</text>
              </g>

              {/* Local Communication Channel: G3-PLC / RF Mesh */}
              <g transform="translate(145, 65)">
                <path d="M 0 35 L 45 35" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="45,35 38,31 38,39" fill="#38bdf8" />
                <text x="22" y="24" fill="#38bdf8" fontFamily="monospace" fontSize="7" textAnchor="middle">G3-PLC</text>
                <text x="22" y="48" fill="#94a3b8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">ou RF Mesh</text>
              </g>

              {/* Substation Level: DCU & Totalizer */}
              <g transform="translate(195, 20)">
                <rect x="0" y="0" width="150" height="155" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="6" />
                <rect x="0" y="0" width="150" height="24" fill="#059669" rx="4" />
                <text x="75" y="16" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {locale === 'fr' ? 'POSTE HTA/BT & DCU' : 'MV/LV SUBSTATION & DCU'}
                </text>

                {/* Transformer Symbol */}
                <circle cx="50" cy="52" r="14" fill="none" stroke="#60a5fa" strokeWidth="2" />
                <circle cx="68" cy="52" r="14" fill="none" stroke="#34d399" strokeWidth="2" />
                <text x="100" y="55" fill="#cbd5e1" fontFamily="monospace" fontSize="8">Transfo HTA/BT</text>

                {/* Bulk Feeder Totalizer Meter */}
                <rect x="15" y="75" width="120" height="28" fill="#134e4a" stroke="#14b8a6" rx="2" />
                <text x="75" y="88" fill="#5eead4" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  Compteur Totalisateur Poste
                </text>
                <text x="75" y="97" fill="#ccfbf1" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Mesure Bilan Energie (E_poste)
                </text>

                {/* DCU Unit */}
                <rect x="15" y="110" width="120" height="34" fill="#1e293b" stroke="#3b82f6" rx="2" />
                <text x="75" y="123" fill="#93c5fd" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Concentrateur DCU Linux
                </text>
                <text x="75" y="135" fill="#94a3b8" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Agrégation 200-500 abonnés
                </text>
              </g>

              {/* Secure WAN Link: 4G LTE / OPGW Fiber */}
              <g transform="translate(355, 65)">
                <path d="M 0 35 L 50 35" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                <polygon points="50,35 42,31 42,39" fill="#10b981" />
                <text x="25" y="24" fill="#34d399" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">WAN 4G / OPGW</text>
                <text x="25" y="48" fill="#a7f3d0" fontFamily="monospace" fontSize="6.5" textAnchor="middle">VPN TLS / IEC 61968</text>
              </g>

              {/* Utility Enterprise Level: HES & MDMS */}
              <g transform="translate(415, 20)">
                <rect x="0" y="0" width="170" height="155" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" rx="6" />
                <rect x="0" y="0" width="170" height="24" fill="#7c3aed" rx="4" />
                <text x="85" y="16" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {locale === 'fr' ? 'SERVEUR CENTRAL MDMS & HES' : 'ENTERPRISE MDMS & HES'}
                </text>

                {/* Head-End System */}
                <rect x="15" y="32" width="140" height="26" fill="#2e1065" stroke="#a855f7" rx="2" />
                <text x="85" y="44" fill="#d8b4fe" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Head-End System (HES)
                </text>
                <text x="85" y="53" fill="#c4b5fd" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Collecte & Déchiffrement AES-128
                </text>

                {/* MDMS Engine */}
                <rect x="15" y="64" width="140" height="38" fill="#1e1b4b" stroke="#6366f1" rx="2" />
                <text x="85" y="77" fill="#a5b4fc" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Moteur VEE & Détection Fraude
                </text>
                <text x="85" y="88" fill="#818cf8" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Calcul Pertes : ΔE = E_poste - Σ E_ab
                </text>
                <text x="85" y="96" fill="#f87171" fontFamily="monospace" fontSize="6.5" textAnchor="middle">
                  Alerte Fraude Non-Technique
                </text>

                {/* Billing & ERP Connector */}
                <rect x="15" y="108" width="140" height="36" fill="#1e293b" stroke="#475569" rx="2" />
                <text x="85" y="122" fill="#cbd5e1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Facturation SAP / Eneo STS
                </text>
                <text x="85" y="134" fill="#94a3b8" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Recharge Prépayée & Télédistribution
                </text>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Chaîne AMI Complète : Compteur STS/DLMS → CPL G3 → Concentrateur DCU → WAN → HES/MDMS</span>
              <span className="text-cyan-400 font-bold">DLMS/COSEM · CEI 62056 · CEI 61968 CIM · STS Standard</span>
            </div>
          </div>
        )}

        {/* D16: Electrical Safety, Earthing & Lightning Protection */}
        {domainCode === 'D16' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Lightning Strike & Franklin Air Terminal Rod */}
              <g transform="translate(40, 10)">
                {/* Lightning Bolt */}
                <path d="M 50 0 L 38 35 L 48 35 L 30 75" fill="none" stroke="#facc15" strokeWidth="2.5" />
                <polygon points="30,75 32,68 38,70" fill="#facc15" />
                <text x="60" y="25" fill="#facc15" fontFamily="monospace" fontSize="8" fontWeight="bold">Foudre I_imp 200 kA</text>

                {/* Air Terminal Rod */}
                <line x1="30" y1="75" x2="30" y2="105" stroke="#e2e8f0" strokeWidth="3" />
                <text x="38" y="92" fill="#e2e8f0" fontFamily="monospace" fontSize="7.5">Paratonnerre (LPS Cl. I)</text>

                {/* Down Conductor */}
                <line x1="30" y1="105" x2="30" y2="155" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
                <rect x="22" y="125" width="16" height="12" fill="#0f172a" stroke="#f97316" rx="1" />
                <text x="42" y="133" fill="#fb923c" fontFamily="monospace" fontSize="6.5">Compteur Foudre</text>
              </g>

              {/* Optical Arc Flash Protection in Switchgear Cell */}
              <g transform="translate(140, 20)">
                <rect x="0" y="0" width="125" height="120" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.8" rx="4" />
                <rect x="0" y="0" width="125" height="20" fill="#be123c" rx="3" />
                <text x="62" y="14" fill="#ffffff" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  CELLULE HTA & ARC FLASH
                </text>

                {/* Busbar & Arc Sensor */}
                <line x1="15" y1="35" x2="110" y2="35" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="62" cy="48" r="8" fill="#fb7185" opacity="0.4" />
                <path d="M 58 45 L 66 52 M 66 45 L 58 52" stroke="#f43f5e" strokeWidth="2" />
                <text x="62" y="65" fill="#fda4af" fontFamily="monospace" fontSize="7" textAnchor="middle">Capteur Optique Fibre</text>

                {/* Trip Controller */}
                <rect x="15" y="74" width="95" height="34" fill="#1e1b4b" stroke="#818cf8" rx="2" />
                <text x="62" y="87" fill="#c7d2fe" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">Relais Arc Ultra-Rapide</text>
                <text x="62" y="99" fill="#4ade80" fontFamily="monospace" fontSize="7" textAnchor="middle">Ordre Déclenchement &lt; 2 ms</text>
              </g>

              {/* Neutral Grounding Resistor (NGR) */}
              <g transform="translate(280, 25)">
                <rect x="0" y="0" width="115" height="115" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" rx="4" />
                <rect x="0" y="0" width="115" height="20" fill="#0284c7" rx="3" />
                <text x="57" y="14" fill="#ffffff" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  RPN 30 kV / NEUTRE
                </text>

                {/* Resistor zig-zag symbol */}
                <path d="M 57 28 L 57 40 L 45 46 L 69 52 L 45 58 L 69 64 L 57 70 L 57 85" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <text x="57" y="97" fill="#7dd3fc" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  R = 57.7 Ω · 300 A
                </text>
                <text x="57" y="106" fill="#94a3b8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">
                  Limitation Défaut Ik1 (10s)
                </text>
              </g>

              {/* Human Step & Touch Potential Safety Zone */}
              <g transform="translate(410, 20)">
                <rect x="0" y="0" width="175" height="120" fill="#0f172a" stroke="#22c55e" strokeWidth="1.8" rx="4" />
                <rect x="0" y="0" width="175" height="20" fill="#15803d" rx="3" />
                <text x="87" y="14" fill="#ffffff" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  SÉCURITÉ HUMAINE (IEEE 80)
                </text>

                {/* Touch & Step Potential Curve */}
                <path d="M 15 70 Q 55 40 87 65 T 160 55" fill="none" stroke="#4ade80" strokeWidth="1.5" />
                <text x="87" y="42" fill="#86efac" fontFamily="monospace" fontSize="7" textAnchor="middle">Gradient de Potentiel Sol</text>

                <rect x="15" y="75" width="145" height="35" fill="#14532d" stroke="#22c55e" rx="2" />
                <text x="87" y="88" fill="#bbf7d0" fontFamily="monospace" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  U_touch &lt; 780 V · U_step &lt; 2450 V
                </text>
                <text x="87" y="98" fill="#86efac" fontFamily="monospace" fontSize="7" textAnchor="middle">
                  Couche Gravier 15 cm (ρs = 3000 Ω·m)
                </text>
                <text x="87" y="106" fill="#dcfce7" fontFamily="monospace" fontSize="6.5" textAnchor="middle">
                  Seuil Fibrillation Ventriculaire Dalziel
                </text>
              </g>

              {/* Earth Grid Mesh Surface and Subsurface */}
              <g transform="translate(20, 150)">
                {/* Surface Ground Line */}
                <line x1="0" y1="10" x2="560" y2="10" stroke="#78716c" strokeWidth="3" />
                <text x="10" y="6" fill="#a8a29e" fontFamily="monospace" fontSize="7">Niveau Sol / Gravier Concassé 15 cm</text>

                {/* Buried Grounding Grid Copper Conductors 120 mm² */}
                <line x1="10" y1="28" x2="550" y2="28" stroke="#f97316" strokeWidth="2.5" />
                
                {/* Vertical Earth Rods */}
                <line x1="50" y1="28" x2="50" y2="45" stroke="#ea580c" strokeWidth="3" />
                <line x1="170" y1="28" x2="170" y2="45" stroke="#ea580c" strokeWidth="3" />
                <line x1="310" y1="28" x2="310" y2="45" stroke="#ea580c" strokeWidth="3" />
                <line x1="450" y1="28" x2="450" y2="45" stroke="#ea580c" strokeWidth="3" />
                <line x1="530" y1="28" x2="530" y2="45" stroke="#ea580c" strokeWidth="3" />

                {/* Grounding Symbols */}
                <g transform="translate(50, 43)">
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-4" y1="3" x2="4" y2="3" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-2" y1="6" x2="2" y2="6" stroke="#ea580c" strokeWidth="1.5" />
                </g>
                <g transform="translate(310, 43)">
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-4" y1="3" x2="4" y2="3" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-2" y1="6" x2="2" y2="6" stroke="#ea580c" strokeWidth="1.5" />
                </g>
                <g transform="translate(530, 43)">
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-4" y1="3" x2="4" y2="3" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="-2" y1="6" x2="2" y2="6" stroke="#ea580c" strokeWidth="1.5" />
                </g>

                <text x="280" y="38" fill="#fdba74" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Maillage de Terre Cuivre Enterré 120 mm² (R_terre &lt; 0.5 Ω) · Piquets Verticaux Profonds
                </text>
              </g>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Sécurité &amp; Foudre : Prise de Terre Maillée IEEE 80 + Neutre Limité RPN + Paratonnerre LPS + Arc Flash &lt; 2 ms</span>
              <span className="text-amber-400 font-bold">R_terre &lt; 0.5 Ω · IEEE 80-2013 · NFPA 70E · CEI 62305 · CEI 61936-1</span>
            </div>
          </div>
        )}

        {/* D02: Power-System Architecture & Grid Planning */}
        {domainCode === 'D02' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Generation Hub Node */}
              <circle cx="80" cy="90" r="30" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
              <text x="80" y="85" fill="#c7d2fe" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Nœud Gen</text>
              <text x="80" y="100" fill="#a5b4fc" fontFamily="monospace" fontSize="9" textAnchor="middle">420 MW</text>
              <text x="80" y="135" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">Songloulou / Nachtigal</text>

              {/* Intertie Transmission Lines with Power Flow Arrows */}
              <line x1="110" y1="75" x2="250" y2="75" stroke="#e11d48" strokeWidth="3" />
              <line x1="110" y1="105" x2="250" y2="105" stroke="#e11d48" strokeWidth="3" />
              <polygon points="185,71 195,75 185,79" fill="#f43f5e" />
              <polygon points="185,101 195,105 185,109" fill="#f43f5e" />
              <text x="180" y="65" fill="#f43f5e" fontFamily="monospace" fontSize="9" textAnchor="middle">2 × 225 kV (SIL = 135 MW/ligne)</text>
              <text x="180" y="120" fill="#fda4af" fontFamily="monospace" fontSize="9" textAnchor="middle">Transit P = 360 MW · Q = 45 Mvar</text>

              {/* Intermediate Grid Node (Nyom 2 Substation) */}
              <rect x="250" y="55" width="90" height="70" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="295" y="75" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Poste Nyom 2</text>
              <text x="295" y="90" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">Nœud Carrefour</text>
              <text x="295" y="110" fill="#34d399" fontFamily="monospace" fontSize="9" textAnchor="middle">V = 1.015 p.u.</text>

              {/* Transmission Corridor to Load Center */}
              <line x1="340" y1="90" x2="480" y2="90" stroke="#e11d48" strokeWidth="3" />
              <polygon points="415,86 425,90 415,94" fill="#f43f5e" />
              <text x="410" y="80" fill="#f43f5e" fontFamily="monospace" fontSize="9" textAnchor="middle">Corridor Mangombé 225 kV</text>
              <text x="410" y="115" fill="#fbbf24" fontFamily="monospace" fontSize="9" textAnchor="middle">Δδ = 18.4° &lt; 30° (Marge N-1)</text>

              {/* Load Node (Douala Industrial Basin) */}
              <circle cx="520" cy="90" r="30" fill="#14532d" stroke="#22c55e" strokeWidth="2.5" />
              <text x="520" y="85" fill="#bbf7d0" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Nœud Charge</text>
              <text x="520" y="100" fill="#86efac" fontFamily="monospace" fontSize="9" textAnchor="middle">Douala 380 MW</text>
              <text x="520" y="135" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">Bassin Industriel</text>

              {/* Dispatching / AGC Feedback Symbol */}
              <path d="M 295 130 L 295 165 L 180 165" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x="240" y="180" fill="#fde047" fontFamily="monospace" fontSize="9">Téléréglage AGC / Dispatching SONATREL (50.00 Hz)</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Modèle d'équilibre dynamique : Écoulement de charge Newton-Raphson & Stabilité transitoire</span>
              <span className="text-emerald-400 font-bold">Critère N-1 Respecté · Fréquence 50.02 Hz</span>
            </div>
          </div>
        )}

        {/* D04: Substations & Grid Nodes */}
        {domainCode === 'D04' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Busbar 225 kV */}
              <line x1="30" y1="30" x2="570" y2="30" stroke="#e11d48" strokeWidth="4" />
              <text x="40" y="22" fill="#f43f5e" fontFamily="monospace" fontSize="11" fontWeight="bold">Jeu de Barres Principal 225 kV</text>

              {/* Disconnector 1 */}
              <line x1="120" y1="30" x2="120" y2="60" stroke="#e11d48" strokeWidth="2.5" />
              <line x1="115" y1="60" x2="135" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="140" y="70" fill="#38bdf8" fontFamily="monospace" fontSize="10">Sectionneur Tête</text>

              {/* Circuit Breaker SF6 */}
              <line x1="120" y1="85" x2="120" y2="105" stroke="#e11d48" strokeWidth="2.5" />
              <rect x="105" y="105" width="30" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />
              <text x="145" y="125" fill="#fbbf24" fontFamily="monospace" fontSize="10" fontWeight="bold">Disjoncteur SF6 (52)</text>

              {/* CT / VT */}
              <circle cx="120" cy="150" r="8" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <text x="140" y="155" fill="#cbd5e1" fontFamily="monospace" fontSize="10">TC / TT Mesures</text>

              {/* Surge Arrester */}
              <line x1="120" y1="160" x2="220" y2="160" stroke="#e11d48" strokeWidth="2.5" />
              <rect x="210" y="145" width="20" height="30" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="235" y="165" fill="#34d399" fontFamily="monospace" fontSize="10">Parafoudre ZnO</text>

              {/* Power Transformer */}
              <circle cx="340" cy="160" r="24" fill="none" stroke="#8b5cf6" strokeWidth="3" />
              <circle cx="370" cy="160" r="24" fill="none" stroke="#0ea5e9" strokeWidth="3" />
              <text x="320" y="120" fill="#c4b5fd" fontFamily="monospace" fontSize="11" fontWeight="bold">Transfo 225/30 kV 63 MVA</text>
              <text x="345" y="195" fill="#94a3b8" fontFamily="monospace" fontSize="9">Buchholz / 87T</text>

              {/* 30 kV Outgoing Feeder */}
              <line x1="394" y1="160" x2="550" y2="160" stroke="#0ea5e9" strokeWidth="3" />
              <rect x="470" y="150" width="20" height="20" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" rx="2" />
              <text x="450" y="140" fill="#38bdf8" fontFamily="monospace" fontSize="10">Disjoncteur Vide 30 kV</text>
              <text x="500" y="180" fill="#38bdf8" fontFamily="monospace" fontSize="11" fontWeight="bold">Départ HTA 30 kV</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Topologie : Travée ligne & transformation AIS classique à coupure SF6</span>
              <span className="text-purple-400 font-bold">Pouvoir de coupure assigné I_sc : 31.5 kA / 3s</span>
            </div>
          </div>
        )}

        {/* D05: Distribution Networks */}
        {domainCode === 'D05' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* Primary Substation 30 kV Outgoing Feeder */}
              <rect x="30" y="60" width="90" height="75" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" rx="3" />
              <text x="75" y="80" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Poste Source</text>
              <text x="75" y="95" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">Jeu de Barres 30 kV</text>
              <text x="75" y="115" fill="#fbbf24" fontFamily="monospace" fontSize="9" textAnchor="middle">Disjoncteur Vide 630A</text>

              {/* Underground Cable Feeder Loop */}
              <path d="M 120 95 L 200 95 L 200 65 L 250 65" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <text x="180" y="55" fill="#fbbf24" fontFamily="monospace" fontSize="9">Câble HTA 3×240 mm² Al</text>

              {/* Ring Main Unit (RMU / RM6) Substation */}
              <rect x="250" y="35" width="160" height="120" fill="#0f172a" stroke="#d97706" strokeWidth="2" rx="4" />
              <text x="330" y="52" fill="#fbbf24" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Poste HTA/BT · RMU 24/36 kV</text>
              
              {/* RMU Switchgear: 2 Switches + 1 Breaker */}
              <rect x="260" y="65" width="40" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
              <text x="280" y="88" fill="#38bdf8" fontFamily="monospace" fontSize="9" textAnchor="middle">Arrivée (I)</text>
              
              <rect x="310" y="65" width="40" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
              <text x="330" y="88" fill="#38bdf8" fontFamily="monospace" fontSize="9" textAnchor="middle">Départ (I)</text>

              <rect x="360" y="65" width="40" height="40" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" rx="2" />
              <text x="380" y="88" fill="#fca5a5" fontFamily="monospace" fontSize="9" textAnchor="middle">Prot. (D)</text>
              <text x="330" y="140" fill="#94a3b8" fontFamily="monospace" fontSize="8" textAnchor="middle">FRTU Détecteur Défaut HTA</text>

              {/* Distribution Transformer & LV Distribution */}
              <line x1="380" y1="105" x2="380" y2="125" stroke="#ef4444" strokeWidth="2" />
              <line x1="380" y1="125" x2="450" y2="125" stroke="#ef4444" strokeWidth="2" />

              <circle cx="470" cy="125" r="16" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="490" cy="125" r="16" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x="480" y="98" fill="#6ee7b7" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">Transfo 630 kVA</text>
              <text x="480" y="155" fill="#a7f3d0" fontFamily="monospace" fontSize="8" textAnchor="middle">30 kV / 400 V Dyn11</text>

              {/* LV Feeder 400 V */}
              <line x1="506" y1="125" x2="570" y2="125" stroke="#22c55e" strokeWidth="3" />
              <text x="540" y="115" fill="#4ade80" fontFamily="monospace" fontSize="9" textAnchor="middle">Départs BT 400V</text>

              {/* Return Loop Cable to PONO */}
              <path d="M 350 85 L 440 85 L 440 40 L 530 40" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
              <text x="485" y="32" fill="#fbbf24" fontFamily="monospace" fontSize="8">Vers PONO (Point Ouvert)</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture : Boucle ouverte HTA 30 kV avec détection de défaut directionnelle FRTU</span>
              <span className="text-amber-400 font-bold">Temps de reconfiguration réseau : &lt; 60 s</span>
            </div>
          </div>
        )}

        {/* D06: Electrical Installations & Utilization */}
        {domainCode === 'D06' && (
          <div className="w-full max-w-2xl space-y-3">
            <svg viewBox="0 0 600 200" className="w-full h-auto text-slate-200">
              {/* LV Main Incomer (ACB 3200A) */}
              <rect x="40" y="45" width="80" height="110" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="3" />
              <text x="80" y="65" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Arrivée Transfo</text>
              <text x="80" y="80" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">400 V Triphasé</text>
              <rect x="55" y="95" width="50" height="35" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <text x="80" y="110" fill="#fbbf24" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">Disj. ACB</text>
              <text x="80" y="122" fill="#fbbf24" fontFamily="monospace" fontSize="8" textAnchor="middle">3200 A 4P</text>

              {/* Main Copper Busbar System 4000A */}
              <line x1="120" y1="80" x2="560" y2="80" stroke="#f59e0b" strokeWidth="4" />
              <text x="340" y="70" fill="#fde047" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">Jeu de Barres Principal Cuivre 4000 A · Icw = 65 kA 1s</text>

              {/* Column 1: Power Factor Correction (APFC) */}
              <rect x="160" y="95" width="90" height="85" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="3" />
              <text x="205" y="115" fill="#6ee7b7" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">Compensation APFC</text>
              <text x="205" y="130" fill="#a7f3d0" fontFamily="monospace" fontSize="8" textAnchor="middle">300 kvar Désaccordée</text>
              <text x="205" y="145" fill="#94a3b8" fontFamily="monospace" fontSize="8" textAnchor="middle">Self 7% (189 Hz)</text>
              <text x="205" y="165" fill="#34d399" fontFamily="monospace" fontSize="9" textAnchor="middle">cos φ = 0.98</text>

              {/* Column 2: Motor Control Center (MCC) & Drives */}
              <rect x="280" y="95" width="110" height="85" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" rx="3" />
              <text x="335" y="115" fill="#a5b4fc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">Départs Moteurs MCC</text>
              <text x="335" y="130" fill="#c7d2fe" fontFamily="monospace" fontSize="8" textAnchor="middle">Variateur VFD 160 kW</text>
              <text x="335" y="145" fill="#c7d2fe" fontFamily="monospace" fontSize="8" textAnchor="middle">Démarreur Progressif</text>
              <text x="335" y="165" fill="#818cf8" fontFamily="monospace" fontSize="8" textAnchor="middle">Verrouillage Forme 4b</text>

              {/* Column 3: Tertiary & Sub-distribution Distribution */}
              <rect x="420" y="95" width="110" height="85" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" rx="3" />
              <text x="475" y="115" fill="#f472b6" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">Départs Secondaires</text>
              <text x="475" y="130" fill="#fbcfe8" fontFamily="monospace" fontSize="8" textAnchor="middle">Tableaux Divisionnaires</text>
              <text x="475" y="145" fill="#fbcfe8" fontFamily="monospace" fontSize="8" textAnchor="middle">Parafoudre Type 1+2</text>
              <text x="475" y="165" fill="#ec4899" fontFamily="monospace" fontSize="8" textAnchor="middle">Différentiel 300 mA sélectif</text>
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Conception : TGBT Basse Tension Forme 4b conforme CEI 61439-2 & NF C 15-100</span>
              <span className="text-emerald-400 font-bold">Régime TN-S / TT · Sélectivité Totale Chronométrique</span>
            </div>
          </div>
        )}

        {/* Fallback for any unmapped domain */}
        {(domainCode !== 'D01' && domainCode !== 'D02' && domainCode !== 'D03' && domainCode !== 'D04' && domainCode !== 'D05' && domainCode !== 'D06' && domainCode !== 'D07' && domainCode !== 'D08' && domainCode !== 'D09' && domainCode !== 'D10' && domainCode !== 'D11' && domainCode !== 'D12' && domainCode !== 'D13' && domainCode !== 'D14' && domainCode !== 'D15' && domainCode !== 'D16') && (
          <div className="text-slate-400 font-mono text-xs p-6 text-center">
            {locale === 'fr' ? 'Schéma en cours de modélisation' : 'Schematic model in progress'}
          </div>
        )}

      </div>
    )}
    </div>
  );
};
