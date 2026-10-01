// src/components/installations/ProjectEngineeringChecksAndSchedules.tsx
// EPEDE Engineering Checks, Earthing System Matrix, Selectivity, and Project Schedules

import React, { useState } from 'react';
import { 
  InstallationProject, 
  EarthingSystem,
  calculateCircuitVoltageDrop 
} from './data/installationProjectModel';
import { 
  ShieldAlert, 
  FileSpreadsheet, 
  Sliders, 
  CheckSquare, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Zap, 
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
  onUpdateProject: (updatedProject: InstallationProject) => void;
}

export const ProjectEngineeringChecksAndSchedules: React.FC<Props> = ({
  project,
  locale,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<'EARTHING' | 'CHECKS' | 'SCHEDULES' | 'ASSUMPTIONS'>('EARTHING');

  const isFr = locale === 'fr';

  // Earthing specs descriptions
  const earthingDetails: Record<EarthingSystem, {
    title: string;
    faultCurrentDesc: string;
    touchVoltageDesc: string;
    requiredProtection: string;
    advantages: string;
    disadvantages: string;
  }> = {
    TT: {
      title: isFr ? 'Régime TT (Neutre à la terre, Masses à la terre séparée)' : 'TT System (Earthed Neutral, Separately Earthed Exposed Frames)',
      faultCurrentDesc: isFr ? 'Courant de défaut limité par les prises de terre (Id = U0 / (Ra + Rb) ≈ 10 à 25 A).' : 'Fault current limited by earth rod resistances (Id = U0 / (Ra + Rb) ≈ 10 to 25 A).',
      touchVoltageDesc: isFr ? 'Tension de contact dangereuse Uc = Ra · Id > 50V sans coupure automatique.' : 'Hazardous touch voltage Uc = Ra · Id > 50V without fast automatic disconnection.',
      requiredProtection: isFr ? 'Dispositifs Différentiels Résiduels (DDR 30mA et 300mA) OBLIGATOIRES.' : 'Residual Current Devices (RCD 30mA and 300mA) MANDATORY.',
      advantages: isFr ? 'Simplicité de conception, pas de report de défaut sur les masses des voisins.' : 'Design simplicity, no fault transfer between installations.',
      disadvantages: isFr ? 'Déclenchement au premier défaut, sensibilité aux orages et à la foudre.' : 'Trips on first fault, vulnerable to lightning surges.'
    },
    TN_S: {
      title: isFr ? 'Régime TN-S (Conducteurs Neutre N et PE strictement séparés)' : 'TN-S System (Separate Neutral N and PE Conductors)',
      faultCurrentDesc: isFr ? 'Défaut franc métallique équivalent à un court-circuit Phase-Neutre (Ik ≈ 1.5 à 6 kA).' : 'Direct metallic fault equivalent to a Phase-Neutral short-circuit (Ik ≈ 1.5 to 6 kA).',
      touchVoltageDesc: isFr ? 'Uc = U0 / 2 ≈ 115V pendant le temps de coupure (élimination en < 0.4s).' : 'Uc = U0 / 2 ≈ 115V during fault clearance time (cleared in < 0.4s).',
      requiredProtection: isFr ? 'Disjoncteurs magnétothermiques ordinaires (vérification du déclenchement magnétique).' : 'Standard overcurrent circuit breakers (magnetic instantaneous trip verification).',
      advantages: isFr ? 'Sécurité élevée, compatibilité électromagnétique (CEM) optimale, pas de courant dans le PE en régime sain.' : 'High safety, optimal EMC, zero continuous circulating currents in PE conductor.',
      disadvantages: isFr ? 'Nécessite 5 conducteurs (3P+N+PE), risque d\'incendie en cas de coupure lente.' : 'Requires 5 conductors (3P+N+PE), fire risk if fault is sustained.'
    },
    TN_C: {
      title: isFr ? 'Régime TN-C (Conducteur combiné PEN)' : 'TN-C System (Combined PEN Conductor)',
      faultCurrentDesc: isFr ? 'Court-circuit franc de forte intensité dans le conducteur PEN.' : 'High metallic short-circuit current through PEN conductor.',
      touchVoltageDesc: isFr ? 'Risque de report de potentiel dangereux si le PEN est rompu.' : 'Hazardous potential rise if PEN conductor is accidentally broken.',
      requiredProtection: isFr ? 'Disjoncteurs standards. DDR STRICTEMENT INTERDITS (car le PE et N sont confondus).' : 'Standard breakers. RCDs STRICTLY FORBIDDEN (since PE and N are merged).',
      advantages: isFr ? 'Économie d\'un conducteur sur les fortes sections (> 10 mm² Cu).' : 'Cost saving on heavy cross-section feeders (> 10 mm² Cu).',
      disadvantages: isFr ? 'Perturbations harmoniques et courants vagabonds, interdit en amont des DDR et en zones à risque d\'incendie.' : 'Harmonic circulation, forbidden upstream of RCDs and in fire-hazard zones.'
    },
    TN_C_S: {
      title: isFr ? 'Régime TN-C-S (PEN en amont, séparé N + PE en aval)' : 'TN-C-S System (PEN Upstream, Separate N + PE Downstream)',
      faultCurrentDesc: isFr ? 'Comportement TN-C côté réseau public, TN-S à l\'intérieur du bâtiment.' : 'TN-C behavior on public supply, TN-S inside customer premises.',
      touchVoltageDesc: isFr ? 'Équipotentiel garanti par la liaison de terre principale (LEP).' : 'Equipotentiality ensured by main bonding bar.',
      requiredProtection: isFr ? 'DDR autorisés uniquement sur la partie TN-S aval.' : 'RCDs permitted strictly on the downstream TN-S section.',
      advantages: isFr ? 'Standard dans de nombreux pays anglo-saxons (PME).' : 'Standard utility connection in many countries (PME).',
      disadvantages: isFr ? 'Reconnexion PE et N strictement interdite en aval de la séparation.' : 'Strictly forbidden to re-merge PE and N downstream of split point.'
    },
    IT: {
      title: isFr ? 'Régime IT (Neutre Isolé ou Impédant, Masses à la terre)' : 'IT System (Isolated Neutral, Earthed Frames)',
      faultCurrentDesc: isFr ? 'Au premier défaut phase-masse, le courant de défaut est quasi nul (quelques mA capacitifs).' : 'At 1st phase-to-earth fault, fault current is negligible (a few mA capacitive).',
      touchVoltageDesc: isFr ? 'Tension de contact Uc ≈ 0 V au premier défaut, aucun risque d\'électrisation.' : 'Touch voltage Uc ≈ 0 V at first fault, zero electrocution hazard.',
      requiredProtection: isFr ? 'Contrôleur Permanent d\'Isolement (CPI) obligatoire + Disjoncteurs pour le 2ème défaut.' : 'Insulation Monitoring Device (IMD / CPI) mandatory + Breakers for 2nd fault.',
      advantages: isFr ? 'Continuité de service ABSOLUE au premier défaut (Blocs opératoires, usines de process continu).' : 'ABSOLUTE continuity of service on 1st fault (Operating theaters, process plants).',
      disadvantages: isFr ? 'Nécessite une équipe de maintenance qualifiée pour localiser le premier défaut avant l\'apparition du second.' : 'Requires dedicated maintenance staff to locate 1st fault before 2nd fault occurs.'
    }
  };

  const currentEarthing = earthingDetails[project.supplyContext.earthingSystem];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Navigation Tabs */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            {isFr ? 'Vérifications Techniques, Régimes de Neutre & Annexes de Calcul' : 'Engineering Checks, Earthing Systems & Design Schedules'}
          </h3>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('EARTHING')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'EARTHING' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFr ? 'Régime de Neutre' : 'Earthing (SLT)'}
          </button>
          <button
            onClick={() => setActiveTab('CHECKS')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'CHECKS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFr ? 'Points de Contrôle' : 'Engineering Checks'}
          </button>
          <button
            onClick={() => setActiveTab('SCHEDULES')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'SCHEDULES' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFr ? 'Bordereaux & Tableaux' : 'Schedules'}
          </button>
          <button
            onClick={() => setActiveTab('ASSUMPTIONS')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'ASSUMPTIONS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFr ? 'Registre Hypothèses' : 'Assumptions'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. TAB: EARTHING SYSTEM COMPARISON */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'EARTHING' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono">{isFr ? 'Schéma de Liaison à la Terre Actif' : 'Active Earthing System'}</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{currentEarthing.title}</h4>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">{isFr ? 'Changer de régime :' : 'Change System:'}</label>
                <select
                  value={project.supplyContext.earthingSystem}
                  onChange={(e) => {
                    const newSys = e.target.value as EarthingSystem;
                    onUpdateProject({
                      ...project,
                      supplyContext: {
                        ...project.supplyContext,
                        earthingSystem: newSys
                      }
                    });
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono font-bold rounded px-3 py-1"
                >
                  <option value="TT">Régime TT</option>
                  <option value="TN_S">Régime TN-S</option>
                  <option value="TN_C">Régime TN-C</option>
                  <option value="TN_C_S">Régime TN-C-S</option>
                  <option value="IT">Régime IT</option>
                </select>
              </div>
            </div>

            {/* Matrix comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <span className="text-slate-400 block font-mono uppercase mb-1">{isFr ? 'Comportement en Cas de Défaut :' : 'Fault Behavior:'}</span>
                <p className="text-white leading-relaxed">{currentEarthing.faultCurrentDesc}</p>
                <div className="mt-2 text-amber-300 font-mono">{currentEarthing.touchVoltageDesc}</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <span className="text-slate-400 block font-mono uppercase mb-1">{isFr ? 'Prescription de Protection Requise :' : 'Required Protection Rule:'}</span>
                <p className="text-emerald-400 font-semibold leading-relaxed">{currentEarthing.requiredProtection}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <span className="text-slate-400 block font-mono uppercase mb-1">{isFr ? 'Avantages Majeurs :' : 'Major Advantages:'}</span>
                <p className="text-slate-300">{currentEarthing.advantages}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <span className="text-slate-400 block font-mono uppercase mb-1">{isFr ? 'Contraintes & Inconvénients :' : 'Constraints & Trade-offs:'}</span>
                <p className="text-rose-300">{currentEarthing.disadvantages}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 3. TAB: ENGINEERING CHECKS & LIMITATION WARNINGS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'CHECKS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              {isFr ? 'Revue de Conformité & Points de Contrôle d\'Ingénierie' : 'Compliance Review & Engineering Checkpoints'}
            </h4>

            <div className="space-y-3 text-xs">
              {/* Check 1: Voltage Drop Limit */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">{isFr ? 'Contrôle de Chute de Tension Globale (ΔU)' : 'Total Voltage Drop Check (ΔU)'}</div>
                  <div className="text-slate-400 mt-0.5">
                    {isFr 
                      ? 'Vérification que la chute de tension cumulée depuis l\'origine BT (TGBT) jusqu\'au récepteur le plus éloigné ne dépasse pas 3% pour l\'éclairage et 5% pour la force motrice (NF C 15-100 §525 / IEC 60364-5-52).'
                      : 'Verification that cumulative voltage drop from low-voltage source to terminal loads remains within 3% (lighting) and 5% (power).'
                    }
                  </div>
                </div>
              </div>

              {/* Check 2: Overload Condition */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">{isFr ? 'Condition de Protection contre les Surcharges (Ib ≤ In ≤ Iz)' : 'Overload Protection Rule (Ib ≤ In ≤ Iz)'}</div>
                  <div className="text-slate-400 mt-0.5">
                    {isFr
                      ? 'Le courant d\'emploi Ib doit être inférieur ou égal au calibre In du disjoncteur, lui-même inférieur ou égal au courant admissible corrigé Iz de la canalisation.'
                      : 'Design current Ib must not exceed breaker rating In, which in turn must not exceed cable derated ampacity Iz.'
                    }
                  </div>
                </div>
              </div>

              {/* Check 3: Breaking Capacity */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">{isFr ? 'Pouvoir de Coupure Disjoncteur (Icu / Icn ≥ Icc max)' : 'Breaking Capacity Check (Icu / Icn ≥ Icc max)'}</div>
                  <div className="text-slate-400 mt-0.5">
                    {isFr
                      ? 'Le pouvoir de coupure ultime de chaque appareil doit être supérieur au courant de court-circuit maximal présumé au point d\'installation.'
                      : 'Breaker interrupting capacity must safely exceed maximum prospective short-circuit current at its installation point.'
                    }
                  </div>
                </div>
              </div>

              {/* Check 4: RCD Life Safety in TT */}
              {project.supplyContext.earthingSystem === 'TT' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3.5 flex items-start gap-3 text-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{isFr ? 'Exigence Particulière Régime TT : DDR 30mA Obligatoire' : 'TT System Constraint: 30mA RCD Mandatory'}</div>
                    <div className="text-amber-200/80 mt-0.5">
                      {isFr
                        ? 'En régime TT, tous les circuits de prises de courant de calibre ≤ 32A et les circuits en locaux humides doivent être protégés par un DDR haute sensibilité ≤ 30 mA.'
                        : 'In TT installations, all socket circuits up to 32A and damp locations must be covered by 30 mA high-sensitivity RCDs.'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 4. TAB: ENGINEERING SCHEDULES */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'SCHEDULES' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              {isFr ? 'Bordereau Récapitulatif des Départs TGBT' : 'TGBT Feeder Schedule'}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">{isFr ? 'Repère' : 'Feeder Code'}</th>
                    <th className="py-2.5 px-3">{isFr ? 'Désignation & Destination' : 'Description & Destination'}</th>
                    <th className="py-2.5 px-3 text-right">{isFr ? 'P (kW)' : 'P (kW)'}</th>
                    <th className="py-2.5 px-3 text-right">{isFr ? 'Ib (A)' : 'Ib (A)'}</th>
                    <th className="py-2.5 px-3 text-center">{isFr ? 'Disjoncteur' : 'Protection'}</th>
                    <th className="py-2.5 px-3 text-center">{isFr ? 'Liaison Câble' : 'Cable Link'}</th>
                    <th className="py-2.5 px-3 text-right">{isFr ? 'Chute ΔU' : 'Volt Drop'}</th>
                    <th className="py-2.5 px-3 text-center">{isFr ? 'Criticité' : 'Criticality'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {project.tgbt.feeders.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3 font-mono font-bold text-cyan-400">{f.feederCode}</td>
                      <td className="py-2 px-3 font-medium text-white">{f.name}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400 font-bold">{f.demandKw} kW</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-white">{f.designCurrentIbA} A</td>
                      <td className="py-2 px-3 text-center font-mono text-amber-300">
                        {f.protectiveDevice.type} {f.protectiveDevice.ratingInA}A ({f.protectiveDevice.tripUnitType})
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-300">
                        {f.cableLink.crossSectionMm2} mm² Cu ({f.cableLink.lengthMeters}m)
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                        {f.cableLink.calculatedVoltageDropPercent}%
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {f.criticality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 5. TAB: DESIGN ASSUMPTIONS REGISTER */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === 'ASSUMPTIONS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              {isFr ? 'Registre Officiel des Hypothèses de Dimensionnement' : 'Design Assumptions Register'}
            </h4>

            <div className="space-y-3">
              {project.assumptions.map((asm) => (
                <div key={asm.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white text-sm">{isFr ? asm.label_fr : asm.label_en}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] border border-blue-500/20">
                      {asm.standardReference}
                    </span>
                  </div>
                  <div className="font-mono text-amber-300 mb-1">{asm.value}</div>
                  {(asm.notes_fr || asm.notes_en) && (
                    <div className="text-slate-400 italic">
                      {isFr ? asm.notes_fr : asm.notes_en}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
