// src/components/production/EquipmentDetailModal.tsx
import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Shield, 
  Activity, 
  Sliders, 
  FileText, 
  Wrench, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Power
} from 'lucide-react';
import type { ProductionEquipment } from './types';

interface EquipmentDetailModalProps {
  equipment: ProductionEquipment | null;
  onClose: () => void;
  onSelectEquipment?: (equipmentId: string) => void;
  allEquipmentMap?: Record<string, ProductionEquipment>;
  locale?: 'fr' | 'en';
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  equipment,
  onClose,
  onSelectEquipment,
  allEquipmentMap,
  locale = 'fr'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'energy' | 'electrical' | 'protection' | 'maintenance' | 'standards'>('overview');

  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-700/50">
                  {equipment.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {equipment.subsystem}
                </span>
                <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                  Catégorie : {equipment.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {equipment.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 italic">
                {equipment.nameEn}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/80"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            Vue d'Ensemble & Construction
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'energy'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Flux d'Énergie & Rendement
          </button>
          <button
            onClick={() => setActiveTab('electrical')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'electrical'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            Rôles Élec & Contrôle
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'protection'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Protections & Sécurité
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'maintenance'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            États & Maintenance
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'standards'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paramètres & Normes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm leading-relaxed">
          
          {/* TAB 1: OVERVIEW & PHYSICAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Definition and Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <Info className="w-4 h-4" />
                    <span>1. Qu'est-ce que c'est ? (Définition)</span>
                  </div>
                  <p className="text-slate-300">{equipment.definition}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. Rôle & Fonction dans la Centrale</span>
                  </div>
                  <p className="text-slate-300">{equipment.purpose}</p>
                </div>
              </div>

              {/* Operating Principle */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-300">
                  3. Principe de Fonctionnement Physique
                </h4>
                <p className="text-slate-300">{equipment.operatingPrinciple}</p>
              </div>

              {/* Physical Construction */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-300">
                  4. Conception & Construction Physique
                </h4>
                <p className="text-slate-300">{equipment.physicalConstruction}</p>
              </div>

              {/* Main Components */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  5. Composants Principaux & Sous-Ensembles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equipment.mainComponents.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Representations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-mono text-cyan-400 uppercase mb-1">Représentation Physique</div>
                  <p className="text-xs text-slate-300">{equipment.physicalRepresentation}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-mono text-amber-400 uppercase mb-1">Représentation Électrique</div>
                  <p className="text-xs text-slate-300">{equipment.electricalRepresentation}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-mono text-emerald-400 uppercase mb-1">Représentation Fonctionnelle</div>
                  <p className="text-xs text-slate-300">{equipment.functionalRepresentation}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENERGY FLOW & BALANCE */}
          {activeTab === 'energy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-800/40 space-y-4">
                <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Bilan & Transformation de l'Énergie
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <div className="text-xs font-mono uppercase text-sky-400 mb-1 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5" /> Énergie Entrante (Inflow)
                    </div>
                    <p className="text-slate-200">{equipment.energyFlow.inflow}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Énergie Utile Sortante (Outflow)
                    </div>
                    <p className="text-slate-200">{equipment.energyFlow.outflow}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40">
                    <div className="text-xs font-mono uppercase text-rose-400 mb-1">Mécanisme des Pertes</div>
                    <p className="text-slate-300 text-xs">{equipment.energyFlow.lossMechanism}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase text-emerald-400 mb-0.5">Rendement Typique (η)</div>
                      <div className="text-2xl font-bold text-emerald-300">{equipment.energyFlow.efficiencyTypical}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upstream / Downstream flow links */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Relations Fonctionnelles dans la Chaîne de Production
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Équipement(s) Amont
                    </span>
                    <div className="space-y-1.5">
                      {equipment.upstreamEquipment.map((up, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          {up}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" /> Équipement(s) Aval
                    </span>
                    <div className="space-y-1.5">
                      {equipment.downstreamEquipment.map((dn, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          {dn}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ELECTRICAL & CONTROL */}
          {activeTab === 'electrical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Rôle Électrique dans l'Installation</span>
                  </div>
                  <p className="text-slate-300">{equipment.electricalRole}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold">
                    <Sliders className="w-4 h-4" />
                    <span>Rôle Mécanique / Hydraulique</span>
                  </div>
                  <p className="text-slate-300">{equipment.mechanicalRole}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-300">
                  Système de Contrôle, Régulation & Commande
                </h4>
                <p className="text-slate-300">{equipment.control}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Instrumentation & Capteurs Dédiés
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equipment.instrumentation.map((inst, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Systèmes Auxiliaires Requis (BoP Associé)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {equipment.auxiliarySystems.map((aux, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      {aux}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROTECTIONS & SAFETY */}
          {activeTab === 'protection' && (
            <div className="space-y-6">
              {/* Protection Overview */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <Shield className="w-5 h-5" />
                  <span>Architecture de Protection Électrique & Mécanique</span>
                </div>
                <p className="text-slate-300">{equipment.protection.description}</p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-amber-300">
                  <strong>Actions de Déclenchement (Trip Actions) :</strong> {equipment.protection.tripActions}
                </div>

                {equipment.protection.ansiCodes && equipment.protection.ansiCodes.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-mono text-slate-400 block mb-2">Codes ANSI Associés :</span>
                    <div className="flex flex-wrap gap-2">
                      {equipment.protection.ansiCodes.map((code) => (
                        <span key={code} className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-bold">
                          ANSI {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Failure Modes */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Modes de Défaillance Typiques (FMEA)
                </h4>
                <div className="space-y-2">
                  {equipment.failureModes.map((fail, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-amber-900/30 text-slate-300 text-xs flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{fail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Considerations */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Consignes de Sécurité du Personnel & Exploitation
                </h4>
                <div className="space-y-2">
                  {equipment.safetyConsiderations.map((safe, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-rose-900/30 text-slate-300 text-xs flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold shrink-0">•</span>
                      <span>{safe}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STATES & MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Operating States Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  États Fonctionnels d'Exploitation (Cycle de Vie Opérationnel)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-emerald-400 block mb-1">Normal / Nominal</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.normal}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-sky-400 block mb-1">Démarrage (Starting)</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.starting}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-cyan-400 block mb-1">En Marche (Running)</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.running}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-amber-400 block mb-1">Arrêt (Stopping)</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.stopping}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-rose-400 block mb-1">Défaut (Fault Trip)</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.fault}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-mono font-semibold text-purple-400 block mb-1">Consigné (Isolated)</span>
                    <p className="text-xs text-slate-300">{equipment.operatingStates.isolated}</p>
                  </div>
                </div>
              </div>

              {/* Maintenance Protocols */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Protocoles d'Entretien & Contrôles Périodiques
                </h4>
                <div className="space-y-2">
                  {equipment.maintenance.map((maint, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{maint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PARAMETERS & STANDARDS */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              {/* Engineering Parameters Table */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Paramètres & Grandeurs d'Ingénierie Clés
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-300 border-b border-slate-700">
                      <tr>
                        <th className="p-3 font-semibold">Grandeur</th>
                        <th className="p-3 font-semibold">Symbole</th>
                        <th className="p-3 font-semibold">Valeur Typique</th>
                        <th className="p-3 font-semibold">Unité</th>
                        <th className="p-3 font-semibold">Signification en Exploitation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {equipment.parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-medium text-white">{param.label}</td>
                          <td className="p-3 font-mono text-cyan-400">{param.symbol || '-'}</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">{param.typicalValue}</td>
                          <td className="p-3 font-mono text-slate-400">{param.unit}</td>
                          <td className="p-3 text-slate-400 text-xs">{param.significance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Standards / Norms */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Normes Internationales & Réglementations Applicables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equipment.standards.map((std, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-mono">{std}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {locale === 'en' ? 'Subsystem:' : 'Système :'} <span className="text-slate-200">{equipment.subsystem}</span> | Tag : <span className="text-cyan-400">{equipment.tag}</span>
          </div>
          <div className="flex items-center gap-2">
            {onSelectEquipment && (
              <button
                type="button"
                onClick={() => {
                  onSelectEquipment(equipment.id);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold font-mono transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-sky-200" />
                <span>{locale === 'en' ? 'Open in Global Registry' : 'Consulter dans le Référentiel Global EPEDE'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              {locale === 'en' ? 'Close' : 'Fermer le Panneau'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
