// src/components/reference/modules/EquipmentCutawaySvgFallback.tsx
import React, { useState } from 'react';
import { Layers, Info, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';

interface EquipmentCutawaySvgFallbackProps {
  equipment?: Partial<CanonicalEquipmentObject>;
  category?: string;
  isOperating?: boolean;
  locale: 'fr' | 'en';
}

export const EquipmentCutawaySvgFallback: React.FC<EquipmentCutawaySvgFallbackProps> = ({
  equipment,
  category,
  isOperating = true,
  locale
}) => {
  const isFr = locale === 'fr';
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

  const eqType = equipment?.equipmentType?.toLowerCase() || category?.toLowerCase() || '';
  const eqId = equipment?.id?.toLowerCase() || '';

  // Determine apparatus schema style
  const isTrafo = eqType.includes('transformer') || eqId.includes('trafo') || eqType.includes('trafo');
  const isBreaker = eqType.includes('breaker') || eqType.includes('switchgear') || eqId.includes('cb') || eqId.includes('gis');
  const isMotor = eqType.includes('motor') || eqType.includes('generator') || eqId.includes('gen') || eqId.includes('motor');
  const isStorage = eqType.includes('battery') || eqType.includes('inverter') || eqType.includes('evse') || eqId.includes('bess') || eqId.includes('statcom');

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080C14] p-5 shadow-2xl space-y-4 font-mono">
      {/* Schematic Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase tracking-wider">
            {isFr ? 'COUPE VECTORIELLE TECHNIQUE & ORGANES INTERNES' : 'TECHNICAL VECTOR CUTAWAY & INTERNAL ANATOMY'}
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-bold">
            CAD CEI 60617
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {isFr ? 'Survolez les organes pour afficher leurs caractéristiques' : 'Hover over components to view technical specs'}
        </span>
      </div>

      {/* Interactive SVG Stage */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0A101D] to-[#060910] border border-cyan-950 p-4">
        <svg viewBox="0 0 800 320" className="w-full h-auto max-h-[340px]">
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="cutaway-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="copper-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="core-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#cutaway-grid)" />

          {/* 1. TRANSFORMER CUTAWAY */}
          {isTrafo && (
            <g transform="translate(100, 20)">
              {/* Outer Tank */}
              <rect x="120" y="70" width="360" height="200" rx="12" fill="url(#metal-grad)" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
              <text x="135" y="90" fill="#94A3B8" fontSize="11" fontWeight="bold">CUVE D'HUILE ISOLANTE (MINÉRALE)</text>

              {/* Conservator tank */}
              <rect x="230" y="15" width="140" height="40" rx="8" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
              <text x="245" y="38" fill="#38BDF8" fontSize="10" fontWeight="bold">CONSERVATEUR</text>
              <line x1="300" y1="55" x2="300" y2="70" stroke="#0284C7" strokeWidth="4" />

              {/* Buchholz relay on pipe */}
              <circle cx="300" cy="62" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <text x="315" y="66" fill="#FBBF24" fontSize="9">Relais Buchholz (Q1)</text>

              {/* HV Bushings */}
              <g transform="translate(160, 20)">
                <polygon points="0,50 10,0 20,50" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                <line x1="10" y1="0" x2="10" y2="-15" stroke="#F59E0B" strokeWidth="2.5" />
                <circle cx="10" cy="-18" r="4" fill="#F59E0B" />
                <text x="-15" y="-24" fill="#F43F5E" fontSize="9" fontWeight="bold">1U (225 kV)</text>
              </g>
              <g transform="translate(420, 20)">
                <polygon points="0,50 8,10 16,50" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                <line x1="8" y1="10" x2="8" y2="-5" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="8" cy="-8" r="3" fill="#F59E0B" />
                <text x="-5" y="-14" fill="#38BDF8" fontSize="9" fontWeight="bold">2u (30 kV)</text>
              </g>

              {/* Magnetic Core (Laminations) */}
              <rect
                x="190"
                y="110"
                width="220"
                height="130"
                rx="6"
                fill="url(#core-grad)"
                stroke="#64748B"
                strokeWidth="2"
                onMouseEnter={() => setSelectedOrgan('core')}
                className="cursor-pointer hover:stroke-cyan-400"
              />
              {/* Window cutout */}
              <rect x="250" y="130" width="100" height="90" fill="#080C14" stroke="#64748B" strokeWidth="1.5" />

              {/* Left Column Winding (HV / LV) */}
              <g onMouseEnter={() => setSelectedOrgan('winding_hv')} className="cursor-pointer">
                <rect x="200" y="125" width="40" height="100" rx="4" fill="url(#copper-grad)" stroke="#D97706" strokeWidth="1.5" />
                <line x1="205" y1="135" x2="235" y2="135" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="205" y1="155" x2="235" y2="155" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="205" y1="175" x2="235" y2="175" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="205" y1="195" x2="235" y2="195" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="205" y1="215" x2="235" y2="215" stroke="#FEF3C7" strokeWidth="1" />
                <text x="202" y="172" fill="#FFFFFF" fontSize="9" fontWeight="bold">HV</text>
              </g>

              {/* Right Column Winding (LV) */}
              <g onMouseEnter={() => setSelectedOrgan('winding_lv')} className="cursor-pointer">
                <rect x="360" y="125" width="40" height="100" rx="4" fill="url(#copper-grad)" stroke="#D97706" strokeWidth="1.5" />
                <line x1="365" y1="135" x2="395" y2="135" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="365" y1="155" x2="395" y2="155" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="365" y1="175" x2="395" y2="175" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="365" y1="195" x2="395" y2="195" stroke="#FEF3C7" strokeWidth="1" />
                <line x1="365" y1="215" x2="395" y2="215" stroke="#FEF3C7" strokeWidth="1" />
                <text x="365" y="172" fill="#FFFFFF" fontSize="9" fontWeight="bold">LV</text>
              </g>

              {/* Radiator Cooling Fins */}
              <path d="M 120 120 L 90 120 L 90 220 L 120 220" stroke="#0284C7" strokeWidth="3" fill="none" />
              <path d="M 480 120 L 510 120 L 510 220 L 480 220" stroke="#0284C7" strokeWidth="3" fill="none" />
              <text x="25" y="175" fill="#38BDF8" fontSize="9">Aéroréfrigérant</text>
            </g>
          )}

          {/* 2. CIRCUIT BREAKER / GIS CUTAWAY */}
          {isBreaker && (
            <g transform="translate(120, 20)">
              {/* Outer Enclosure / Pole Tank */}
              <rect x="140" y="50" width="320" height="220" rx="16" fill="url(#metal-grad)" stroke="#10B981" strokeWidth="2" />
              <text x="160" y="75" fill="#34D399" fontSize="11" fontWeight="bold">ENVELOPPE ÉTANCHE SF6 (0.60 MPa)</text>

              {/* Arc Interrupter Chamber */}
              <rect x="220" y="100" width="160" height="120" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="235" y="120" fill="#38BDF8" fontSize="10">CHAMBRE DE COUPURE</text>

              {/* Fixed Contact */}
              <rect x="250" y="145" width="25" height="30" fill="url(#copper-grad)" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="240" y="195" fill="#FBBF24" fontSize="8">Contact Fixe</text>

              {/* Moving Contact with Spring Rod */}
              <rect x="325" y="145" width="25" height="30" fill="url(#copper-grad)" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="315" y="195" fill="#FBBF24" fontSize="8">Contact Mobile</text>

              {/* PTFE Nozzle & Plasma Arc */}
              <polygon points="280,140 320,150 320,170 280,180" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="275" y1="160" x2="325" y2="160" stroke="#F43F5E" strokeWidth="3" />
              <circle cx="300" cy="160" r="8" fill="rgba(244, 63, 94, 0.3)" />

              {/* Spring Operating Mechanism */}
              <rect x="240" y="235" width="120" height="25" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1" />
              <text x="250" y="252" fill="#E2E8F0" fontSize="9">Commande à Ressort</text>

              {/* HV Bushings In/Out */}
              <line x1="140" y1="160" x2="80" y2="160" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="75" cy="160" r="6" fill="#F59E0B" />
              <line x1="460" y1="160" x2="520" y2="160" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="525" cy="160" r="6" fill="#F59E0B" />
            </g>
          )}

          {/* 3. MOTOR / ROTATING MACHINE CUTAWAY */}
          {isMotor && (
            <g transform="translate(120, 20)">
              {/* Outer Casing with cooling ribs */}
              <circle cx="300" cy="150" r="120" fill="url(#metal-grad)" stroke="#38BDF8" strokeWidth="2" />

              {/* Stator Core */}
              <circle cx="300" cy="150" r="95" fill="url(#core-grad)" stroke="#64748B" strokeWidth="1.5" />

              {/* Stator Slots / Windings (8 coils around) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 300 + 80 * Math.cos(rad);
                const cy = 150 + 80 * Math.sin(rad);
                return (
                  <circle key={i} cx={cx} cy={cy} r="8" fill="url(#copper-grad)" stroke="#D97706" strokeWidth="1" />
                );
              })}

              {/* Air Gap */}
              <circle cx="300" cy="150" r="65" fill="#080C14" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />

              {/* Rotor Cage & Bars */}
              <circle cx="300" cy="150" r="60" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 300 + 48 * Math.cos(rad);
                const cy = 150 + 48 * Math.sin(rad);
                return (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#F59E0B" />
                );
              })}

              {/* Shaft */}
              <circle cx="300" cy="150" r="22" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
              <rect x="296" y="130" width="8" height="12" fill="#E2E8F0" />

              {/* Labels */}
              <text x="440" y="70" fill="#38BDF8" fontSize="10">Stator Triphasé</text>
              <text x="440" y="150" fill="#F59E0B" fontSize="10">Cage d'Écureuil Rotor</text>
              <text x="440" y="230" fill="#E2E8F0" fontSize="10">Arbre Mécanique</text>
            </g>
          )}

          {/* 4. STORAGE / BESS / INVERTER CUTAWAY */}
          {isStorage && (
            <g transform="translate(100, 20)">
              {/* Outer Container / Rack Frame */}
              <rect x="100" y="50" width="400" height="220" rx="12" fill="url(#metal-grad)" stroke="#A855F7" strokeWidth="2" />
              <text x="120" y="75" fill="#C084FC" fontSize="11" fontWeight="bold">CONTENEUR BESS & CELLULES LFP</text>

              {/* Liquid Cooling Plates Base */}
              <rect x="120" y="240" width="360" height="18" rx="4" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
              <text x="210" y="253" fill="#E0F2FE" fontSize="9">Plaque de Refroidissement Liquide (20-25°C)</text>

              {/* Battery Module Racks */}
              <g transform="translate(120, 90)">
                {[0, 60, 120, 180].map((xOffset, i) => (
                  <g key={i} transform={`translate(${xOffset}, 0)`}>
                    <rect x="0" y="0" width="50" height="135" rx="4" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
                    <rect x="6" y="8" width="38" height="24" rx="2" fill="#065F46" />
                    <rect x="6" y="38" width="38" height="24" rx="2" fill="#065F46" />
                    <rect x="6" y="68" width="38" height="24" rx="2" fill="#065F46" />
                    <rect x="6" y="98" width="38" height="24" rx="2" fill="#065F46" />
                    <text x="12" y="130" fill="#34D399" fontSize="8">Pack #{i+1}</text>
                  </g>
                ))}
              </g>

              {/* PCS Inverter & BMS Control Rack */}
              <g transform="translate(370, 90)">
                <rect x="0" y="0" width="110" height="135" rx="6" fill="#0F172A" stroke="#EC4899" strokeWidth="1.5" />
                <text x="12" y="25" fill="#F472B6" fontSize="10" fontWeight="bold">PCS INVERTER</text>
                <text x="12" y="45" fill="#E2E8F0" fontSize="8">Ponts IGBT / SiC</text>
                <text x="12" y="65" fill="#E2E8F0" fontSize="8">BMS Tier-3 CAN</text>
                <text x="12" y="85" fill="#E2E8F0" fontSize="8">Bus DC 1250 V</text>
                <rect x="12" y="100" width="86" height="22" rx="3" fill="#831843" stroke="#F43F5E" strokeWidth="1" />
                <text x="20" y="115" fill="#FECDD3" fontSize="8" fontWeight="bold">EXTINCTION NOVEC</text>
              </g>
            </g>
          )}

          {/* Fallback generic high-voltage apparatus if none of above */}
          {!isTrafo && !isBreaker && !isMotor && !isStorage && (
            <g transform="translate(140, 40)">
              <rect x="80" y="40" width="360" height="180" rx="12" fill="url(#metal-grad)" stroke="#38BDF8" strokeWidth="2" />
              <text x="110" y="70" fill="#38BDF8" fontSize="12" fontWeight="bold">{equipment.name[locale]}</text>
              <line x1="80" y1="130" x2="440" y2="130" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="260" cy="130" r="28" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
              <text x="235" y="135" fill="#FEF3C7" fontSize="10" fontWeight="bold">{equipment.tagIec || 'CEI 60000'}</text>
            </g>
          )}
        </svg>

        {/* Selected Organ Detail Overlay */}
        {selectedOrgan && (
          <div className="mt-3 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs flex items-center justify-between text-cyan-200">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>
                {selectedOrgan === 'core' && (isFr ? 'Circuit magnétique en tôles au silicium à grains orientés (M4 / HiB) avec pertes <0.8 W/kg.' : 'Grain-oriented silicon steel magnetic core (M4 / HiB) with core losses <0.8 W/kg.')}
                {selectedOrgan === 'winding_hv' && (isFr ? 'Enroulement Haute Tension en galettes de cuivre continu sous isolation papier crêpé et huile.' : 'High-Voltage continuous disc copper winding insulated with kraft paper and oil.')}
                {selectedOrgan === 'winding_lv' && (isFr ? 'Enroulement Basse Tension en hélice de feuillard cuivre à forte tenue aux courants de court-circuit.' : 'Low-Voltage helical copper strip winding designed for extreme short-circuit electrodynamic withstand.')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrgan(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Subcomponents list */}
      {equipment.subcomponents && equipment.subcomponents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {equipment.subcomponents.map((sub) => (
            <div
              key={sub.id}
              className="p-2 rounded-lg bg-[#0F1420] border border-slate-800 text-[11px] space-y-1"
            >
              <div className="font-bold text-slate-200 truncate">{sub.name[locale]}</div>
              <div className="text-[10px] text-slate-400 truncate">{sub.function[locale]}</div>
              <div className="text-[9px] text-cyan-400/90 font-mono truncate">{sub.materialOrTechnology}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
