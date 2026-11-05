// src/components/grid/modules/CameroonSubstationArchitectureExplorer.tsx
// Interactive Substation Topologies & Single-Line Architecture Explorer for Cameroon's HV/MV Substations

import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Zap, CheckCircle2, Info } from 'lucide-react';

type BusTopologyId = 'double_busbar' | 'single_segmented' | 'gsu_breaker_half';

interface TopologySpec {
  id: BusTopologyId;
  nameFr: string;
  nameEn: string;
  reliabilityRating: string;
  cameroonSubstationsFr: string[];
  cameroonSubstationsEn: string[];
  principleFr: string;
  principleEn: string;
  operationalAdvantageFr: string;
  operationalAdvantageEn: string;
}

const TOPOLOGIES: TopologySpec[] = [
  {
    id: 'double_busbar',
    nameFr: '1. Double Jeu de Barres avec Disjoncteur de Couplage (225 kV / 90 kV)',
    nameEn: '1. Double Busbar with Bus-Coupler Breaker (225 kV / 90 kV)',
    reliabilityRating: 'Haute disponibilité N-1 (Maintenance d’une barre sans coupure)',
    cameroonSubstationsFr: [
      'Mangombé 225/90 kV (Édéa — Carrefour National)',
      'Nyom II 225/30 kV, Ahala 225/90/30 kV, Nomayos 225/90 kV, Oyomabang (Yaoundé)',
      'Bekoko 225/90/30 kV, Logbaba 225/90/30/15 kV, Bassa 90/15 kV (Douala)',
      'Bafoussam 225/90/30 kV & Garoua 110/30 kV',
    ],
    cameroonSubstationsEn: [
      'Mangombé 225/90 kV (Edéa — National Dispatch Hub)',
      'Nyom II 225/30 kV, Ahala 225/90/30 kV, Nomayos 225/90 kV, Oyomabang (Yaoundé)',
      'Bekoko 225/90/30 kV, Logbaba 225/90/30/15 kV, Bassa 90/15 kV (Douala)',
      'Bafoussam 225/90/30 kV & Garoua 110/30 kV',
    ],
    principleFr:
      'Chaque travée (ligne 225 kV ou transformateur) dispose de deux sectionneurs d’aiguillage (S1 sur Barre I, S2 sur Barre II) encadrant un disjoncteur SF6. Une travée de couplage permet de basculer sous charge les départs d’une barre à l’autre.',
    principleEn:
      'Each feeder or transformer bay is equipped with two bus-selector disconnectors (S1 on Busbar I, S2 on Busbar II) feeding a single SF6 circuit breaker. A bus-coupler bay allows on-load transfer of circuits between busbars.',
    operationalAdvantageFr:
      'Permet d’isoler un jeu de barres complet pour maintenance ou suite à un défaut barre (éliminé par la protection différentielle 87B zone 1 ou 2) tout en maintenant 100% des lignes et transformateurs en service sur la seconde barre.',
    operationalAdvantageEn:
      'Allows complete isolation of one busbar for maintenance or following a busbar fault (cleared selectively by zone-1/zone-2 ANSI 87B differential protection) while keeping all lines and transformers energized on the healthy busbar.',
  },
  {
    id: 'single_segmented',
    nameFr: '2. Simple Jeu de Barres Tronçonné par Disjoncteur / Sectionneur (90 kV / 30 kV)',
    nameEn: '2. Single Segmented Busbar (90 kV / 110 kV / 30 kV Distribution)',
    reliabilityRating: 'Standard économique pour postes terminaux et rames HTA 30/15 kV',
    cameroonSubstationsFr: [
      'Postes régionaux : Bamenda 90/30 kV, Bertoua 90/30 kV, Ngaoundéré 110/30 kV, Maroua 110/30 kV',
      'Rames Moyenne Tension HTA (30 kV et 15 kV) de tous les postes sources Eneo (2 demi-rames alimentées par 2 transformateurs HTB/HTA avec disjoncteur de couplage HTA normalement ouvert ou fermé)',
    ],
    cameroonSubstationsEn: [
      'Regional Substations: Bamenda 90/30 kV, Bertoua 90/30 kV, Ngaoundéré 110/30 kV, Maroua 110/30 kV',
      'Medium-Voltage (30 kV & 15 kV) indoor switchboards at all Eneo primary substations (two half-busbars fed by two HV/MV transformers with a sectionalizing breaker)',
    ],
    principleFr:
      'Un unique jeu de barres est divisé en deux demi-barres (Demi-Rame A et Demi-Rame B) reliées par une cellule de tronçonnement. Chaque demi-barre reçoit un transformateur HTB/HTA et alimente la moitié des départs.',
    principleEn:
      'A single busbar is divided into two sections (Section A and Section B) linked by a bus-section circuit breaker. Each section is fed by a dedicated power transformer and serves half of the outgoing feeders.',
    operationalAdvantageFr:
      'En cas de perte d’un transformateur HTB/HTA (ex: déclenchement Buchholz ou 87T), le basculement automatique de source (ATS / Normal-Secours) ferme le couplage pour réalimenter l’intégralité des départs HTA.',
    operationalAdvantageEn:
      'If one HV/MV transformer trips, an Automatic Transfer Switch (ATS) scheme closes the bus-section breaker so the remaining transformer picks up both half-busbars.',
  },
  {
    id: 'gsu_breaker_half',
    nameFr: '3. Poste Élévateur de Centrale (GSU Bloc) & Architecture Haute Sécurité',
    nameEn: '3. Generator Step-Up (GSU Unit Block) & High-Security Switchyard',
    reliabilityRating: 'Sécurité maximale pour évacuation des grands aménagements (>200 MW)',
    cameroonSubstationsFr: [
      'Poste élévateur 10,5/225 kV de Nachtigal (420 MW — 7 groupes Francis)',
      'Poste élévateur 10,3/225 kV de Songloulou (384 MW — 8 groupes Francis)',
      'Postes élévateurs de Memve’ele (211 MW), Kribi KPDC (216 MW) et Édéa (276 MW)',
    ],
    cameroonSubstationsEn: [
      'Nachtigal 10.5/225 kV Step-Up Switchyard (420 MW — 7 Francis units)',
      'Songloulou 10.3/225 kV Step-Up Switchyard (384 MW — 8 Francis units)',
      'Memve’ele (211 MW), Kribi KPDC (216 MW), and Edéa (276 MW) switchyards',
    ],
    principleFr:
      'Chaque alternateur (10,5 kV) est couplé via son disjoncteur de groupe (GCB) directement à son transformateur élévateur dédié (schéma bloc 10,5/225 kV), qui débite ensuite sur le poste d’évacuation HTB 225 kV vers les lignes SONATREL.',
    principleEn:
      'Each synchronous generator (10.5 kV) connects via a Generator Circuit Breaker (GCB) to its dedicated unit step-up transformer (10.5/225 kV), which feeds the 225 kV evacuation switchyard and outgoing SONATREL lines.',
    operationalAdvantageFr:
      'Isole les forts courants de court-circuit côté 10,5 kV (>40 kA), permet l’alimentation des auxiliaires de tranche par soutirage, et garantit qu’un défaut sur un groupe n’affecte pas les autres turbines de la centrale.',
    operationalAdvantageEn:
      'Isolates high generator-bus fault currents (>40 kA at 10.5 kV), supplies unit auxiliary transformers, and ensures a fault on one generating unit never trips adjacent units.',
  },
];

interface CameroonSubstationArchitectureExplorerProps {
  locale: 'fr' | 'en';
}

export const CameroonSubstationArchitectureExplorer: React.FC<CameroonSubstationArchitectureExplorerProps> = ({
  locale,
}) => {
  const [selectedTopology, setSelectedTopology] = useState<BusTopologyId>('double_busbar');
  const activeSpec = TOPOLOGIES.find((t) => t.id === selectedTopology) || TOPOLOGIES[0];

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-400 font-bold">
            <Layers className="w-4 h-4" />
            <span>
              {locale === 'fr'
                ? 'ARCHITECTURES UNIFILAIRES DES POSTES HTB / HTA AU CAMEROUN'
                : 'CAMEROON HV / MV SUBSTATION SINGLE-LINE ARCHITECTURES'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
            {locale === 'fr'
              ? 'Schémas de Jeux de Barres & Appareillages d’Interconnexion'
              : 'Busbar Configurations & Substation Primary Apparatus'}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {TOPOLOGIES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTopology(t.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedTopology === t.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
              }`}
            >
              {t.id === 'double_busbar'
                ? locale === 'fr'
                  ? 'Double Barre 225/90 kV'
                  : 'Double Busbar 225/90 kV'
                : t.id === 'single_segmented'
                ? locale === 'fr'
                  ? 'Barre Tronçonnée 90/30 kV'
                  : 'Segmented Bus 90/30 kV'
                : locale === 'fr'
                ? 'Poste Bloc GSU Centrale'
                : 'Plant GSU Switchyard'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Single-Line Diagram Canvas */}
      <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-slate-400">
          <span>
            {locale === 'fr'
              ? 'SCHÉMA UNIFILAIRE D’INGÉNIERIE (NORME CEI 60617)'
              : 'ENGINEERING SINGLE-LINE SCHEMATIC (IEC 60617 STANDARD)'}
          </span>
          <span className="text-emerald-400 font-bold">{activeSpec.reliabilityRating}</span>
        </div>

        <svg viewBox="0 0 860 280" className="w-full h-auto min-w-[680px]">
          <rect x="0" y="0" width="860" height="280" rx="10" fill="#080C0E" />

          {selectedTopology === 'double_busbar' && (
            <g>
              {/* Busbar I & Busbar II */}
              <text x="20" y="55" fill="#F43F5E" fontSize="12" fontFamily="monospace" fontWeight="bold">
                JEU DE BARRES I — 225 kV (SONATREL)
              </text>
              <line x1="20" y1="65" x2="830" y2="65" stroke="#F43F5E" strokeWidth="4" />

              <text x="20" y="95" fill="#FB923C" fontSize="12" fontFamily="monospace" fontWeight="bold">
                JEU DE BARRES II — 225 kV (SONATREL)
              </text>
              <line x1="20" y1="105" x2="830" y2="105" stroke="#FB923C" strokeWidth="4" />

              {/* Bay 1: Incoming Line 225 kV (Nachtigal / Songloulou) */}
              <g transform="translate(110, 0)">
                <circle cx="0" cy="65" r="4" fill="#F43F5E" />
                <line x1="0" y1="65" x2="0" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="30" cy="105" r="4" fill="#FB923C" />
                <line x1="30" y1="105" x2="30" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <line x1="0" y1="135" x2="30" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <line x1="15" y1="135" x2="15" y2="160" stroke="#94A3B8" strokeWidth="2" />
                {/* Breaker SF6 */}
                <rect x="5" y="160" width="20" height="20" fill="#10B981" stroke="#059669" strokeWidth="2" />
                <text x="32" y="174" fill="#10B981" fontSize="10" fontFamily="monospace">
                  52-L1 (SF6)
                </text>
                <line x1="15" y1="180" x2="15" y2="245" stroke="#F43F5E" strokeWidth="2.5" />
                <text x="-45" y="265" fill="#E2E8F0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Arrivée 225 kV (Songloulou/Nachtigal)
                </text>
              </g>

              {/* Bay 2: Bus Coupler */}
              <g transform="translate(390, 0)">
                <circle cx="0" cy="65" r="4" fill="#F43F5E" />
                <line x1="0" y1="65" x2="0" y2="160" stroke="#94A3B8" strokeWidth="2" />
                <rect x="-10" y="160" width="20" height="20" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
                <line x1="0" y1="180" x2="0" y2="205" stroke="#94A3B8" strokeWidth="2" />
                <line x1="0" y1="205" x2="50" y2="205" stroke="#94A3B8" strokeWidth="2" />
                <line x1="50" y1="105" x2="50" y2="205" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="50" cy="105" r="4" fill="#FB923C" />
                <text x="-35" y="230" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Travée de Couplage 225 kV
                </text>
              </g>

              {/* Bay 3: Autotransformer 225/90/30 kV */}
              <g transform="translate(660, 0)">
                <circle cx="0" cy="65" r="4" fill="#F43F5E" />
                <line x1="0" y1="65" x2="0" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="30" cy="105" r="4" fill="#FB923C" />
                <line x1="30" y1="105" x2="30" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <line x1="0" y1="135" x2="30" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <line x1="15" y1="135" x2="15" y2="155" stroke="#94A3B8" strokeWidth="2" />
                <rect x="5" y="155" width="20" height="20" fill="#10B981" stroke="#059669" strokeWidth="2" />
                <line x1="15" y1="175" x2="15" y2="195" stroke="#94A3B8" strokeWidth="2" />
                {/* Transformer two circles */}
                <circle cx="15" cy="208" r="13" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                <circle cx="15" cy="224" r="13" fill="none" stroke="#A855F7" strokeWidth="2.5" />
                <text x="36" y="218" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ATR 100 MVA (OLTC)
                </text>
                <text x="-35" y="265" fill="#C084FC" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Vers Barres 90 kV / Rame HTA 30 kV
                </text>
              </g>
            </g>
          )}

          {selectedTopology === 'single_segmented' && (
            <g>
              {/* Two Transformer Infeeds */}
              <text x="80" y="35" fill="#A855F7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Arrivée 90 kV / 110 kV (TR1 — 36 MVA)
              </text>
              <circle cx="180" cy="60" r="12" fill="none" stroke="#A855F7" strokeWidth="2.5" />
              <circle cx="180" cy="75" r="12" fill="none" stroke="#10B981" strokeWidth="2.5" />
              <line x1="180" y1="87" x2="180" y2="135" stroke="#10B981" strokeWidth="2.5" />

              <text x="530" y="35" fill="#A855F7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Arrivée 90 kV / 110 kV (TR2 — 36 MVA)
              </text>
              <circle cx="640" cy="60" r="12" fill="none" stroke="#A855F7" strokeWidth="2.5" />
              <circle cx="640" cy="75" r="12" fill="none" stroke="#10B981" strokeWidth="2.5" />
              <line x1="640" y1="87" x2="640" y2="135" stroke="#10B981" strokeWidth="2.5" />

              {/* Half-Busbar A & Half-Busbar B */}
              <line x1="40" y1="135" x2="395" y2="135" stroke="#10B981" strokeWidth="5" />
              <text x="50" y="125" fill="#10B981" fontSize="12" fontFamily="monospace" fontWeight="bold">
                DEMI-RAME A (30 kV ou 15 kV)
              </text>

              {/* Sectionalizing Breaker */}
              <rect x="395" y="123" width="50" height="24" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
              <text x="380" y="165" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Couplage (ATS)
              </text>

              <line x1="445" y1="135" x2="810" y2="135" stroke="#10B981" strokeWidth="5" />
              <text x="570" y="125" fill="#10B981" fontSize="12" fontFamily="monospace" fontWeight="bold">
                DEMI-RAME B (30 kV ou 15 kV)
              </text>

              {/* Outgoing MV Feeders */}
              {[90, 210, 320, 520, 640, 760].map((xPos, idx) => (
                <g key={xPos} transform={`translate(${xPos}, 135)`}>
                  <line x1="0" y1="0" x2="0" y2="35" stroke="#94A3B8" strokeWidth="2" />
                  <rect x="-8" y="35" width="16" height="16" fill="#0EA5E9" />
                  <line x1="0" y1="51" x2="0" y2="105" stroke="#10B981" strokeWidth="2" />
                  <text x="-32" y="122" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
                    Départ HTA D{idx + 1}
                  </text>
                </g>
              ))}
            </g>
          )}

          {selectedTopology === 'gsu_breaker_half' && (
            <g>
              {/* Unit Blocks 1, 2, 3 */}
              {[130, 390, 650].map((xPos, idx) => (
                <g key={xPos} transform={`translate(${xPos}, 25)`}>
                  {/* Generator Circle */}
                  <circle cx="0" cy="25" r="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                  <text x="-10" y="30" fill="#38BDF8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    G{idx + 1}
                  </text>
                  <text x="26" y="28" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    60 MW · 10,5 kV
                  </text>
                  <line x1="0" y1="45" x2="0" y2="68" stroke="#38BDF8" strokeWidth="2.5" />
                  {/* GCB */}
                  <rect x="-9" y="68" width="18" height="18" fill="#F59E0B" />
                  <text x="15" y="81" fill="#F59E0B" fontSize="10" fontFamily="monospace">
                    GCB 10,5 kV
                  </text>
                  <line x1="0" y1="86" x2="0" y2="105" stroke="#38BDF8" strokeWidth="2.5" />
                  {/* GSU Transformer */}
                  <circle cx="0" cy="117" r="12" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                  <circle cx="0" cy="133" r="12" fill="none" stroke="#F43F5E" strokeWidth="2.5" />
                  <text x="18" y="130" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
                    GSU 70 MVA (YNd11)
                  </text>
                  <line x1="0" y1="145" x2="0" y2="170" stroke="#F43F5E" strokeWidth="2.5" />
                  <rect x="-9" y="170" width="18" height="18" fill="#10B981" />
                  <line x1="0" y1="188" x2="0" y2="215" stroke="#F43F5E" strokeWidth="2.5" />
                </g>
              ))}
              {/* 225 kV Evacuation Bus */}
              <line x1="40" y1="240" x2="820" y2="240" stroke="#F43F5E" strokeWidth="5" />
              <text x="220" y="264" fill="#F43F5E" fontSize="12" fontFamily="monospace" fontWeight="bold">
                COLLECTEUR HTB 225 kV ➔ DOUBLE LIGNE VERS NYOM II / MANGOMBÉ
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Explanation & Real Cameroon Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {locale === 'fr' ? 'Principe & Continuité d’Exploitation' : 'Operating Principle & Grid Continuity'}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            {locale === 'fr' ? activeSpec.principleFr : activeSpec.principleEn}
          </p>
          <p className="text-xs text-emerald-300/90 leading-relaxed pt-2 border-t border-[#252E38]">
            {locale === 'fr' ? activeSpec.operationalAdvantageFr : activeSpec.operationalAdvantageEn}
          </p>
        </div>

        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {locale === 'fr'
              ? 'Postes Camerounais Utilisant cette Configuration'
              : 'Verified Cameroonian Substations Using This Topology'}
          </h4>
          <ul className="space-y-1.5">
            {(locale === 'fr' ? activeSpec.cameroonSubstationsFr : activeSpec.cameroonSubstationsEn).map((sub, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

