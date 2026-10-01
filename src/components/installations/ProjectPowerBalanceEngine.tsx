// src/components/installations/ProjectPowerBalanceEngine.tsx
// EPEDE Project Power Balance & Load Schedule Engine
// Transparent mathematical calculations, phase balancing, and transformer/source utilization

import React, { useState } from 'react';
import { 
  InstallationProject, 
  ProjectLoad, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Zap, 
  Layers, 
  Plus, 
  Trash2, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  Scale, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
  onUpdateProject: (updatedProject: InstallationProject) => void;
}

export const ProjectPowerBalanceEngine: React.FC<Props> = ({
  project,
  locale,
  onUpdateProject
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isAddingLoad, setIsAddingLoad] = useState(false);

  // New load form state
  const [newLoad, setNewLoad] = useState<Partial<ProjectLoad>>({
    name: locale === 'fr' ? 'Nouveau Récepteur' : 'New Load',
    category: 'LIGHTING',
    areaName: 'Zone 1',
    quantity: 1,
    unitRatingKw: 1.5,
    voltageV: 230,
    phase: '1P_L1',
    powerFactor: 0.9,
    efficiency: 0.9,
    loadFactorKu: 0.8,
    simultaneityKs: 0.8,
    dutyCycle: 'CONTINUOUS',
    criticality: 'NORMAL'
  });

  const powerSummary = computeProjectPowerBalance(project);

  // Helper to update a load field
  const handleUpdateLoad = (loadId: string, field: keyof ProjectLoad, value: any) => {
    const updatedLoads = project.loads.map(ld => {
      if (ld.id === loadId) {
        return { ...ld, [field]: value };
      }
      return ld;
    });
    onUpdateProject({ ...project, loads: updatedLoads });
  };

  const handleDeleteLoad = (loadId: string) => {
    const updatedLoads = project.loads.filter(ld => ld.id !== loadId);
    onUpdateProject({ ...project, loads: updatedLoads });
  };

  const handleAddLoadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ProjectLoad = {
      id: `load-${Date.now()}`,
      name: newLoad.name || 'Load',
      category: newLoad.category as any || 'SOCKETS',
      areaName: newLoad.areaName || 'Main Area',
      quantity: Number(newLoad.quantity) || 1,
      unitRatingKw: Number(newLoad.unitRatingKw) || 1.0,
      voltageV: Number(newLoad.voltageV) as 230 | 400 || 230,
      phase: newLoad.phase as any || '1P_L1',
      powerFactor: Number(newLoad.powerFactor) || 0.9,
      efficiency: Number(newLoad.efficiency) || 0.9,
      loadFactorKu: Number(newLoad.loadFactorKu) || 0.8,
      simultaneityKs: Number(newLoad.simultaneityKs) || 0.8,
      dutyCycle: newLoad.dutyCycle as any || 'CONTINUOUS',
      criticality: newLoad.criticality as any || 'NORMAL'
    };
    onUpdateProject({ ...project, loads: [...project.loads, created] });
    setIsAddingLoad(false);
  };

  // Filter loads
  const filteredLoads = selectedCategoryFilter === 'ALL'
    ? project.loads
    : project.loads.filter(l => l.category === selectedCategoryFilter);

  const isFr = locale === 'fr';

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Banner & Verification Badge */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {isFr ? 'MOTEUR DE BILAN DE PUISSANCE CONCEPTIONNEL' : 'CONCEPTUAL POWER BALANCE ENGINE'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                IEC 60364-5-53 / NF C 15-100
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              {isFr ? 'Inventaire des Charges & Bilan de Puissance Détaillé' : 'Load Inventory & Detailed Power Balance'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {isFr
                ? 'Agrégation transparente des puissances installées, facteurs d\'utilisation (ku), foisonnement (ks), équilibrage des phases L1/L2/L3 et taux de charge des sources (Transformateur, Groupe Électrogène, Onduleur).'
                : 'Transparent aggregation of installed power, utilization factors (ku), simultaneity (ks), phase balancing across L1/L2/L3, and source loading rates (Transformer, Genset, UPS).'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-lg">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-mono uppercase">{isFr ? 'Appel de Courant Total (Ib)' : 'Total Design Current (Ib)'}</div>
              <div className="text-2xl font-black text-amber-400 font-mono">{powerSummary.totalDesignCurrentIbA} A</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-mono uppercase">{isFr ? 'Puissance Appelée' : 'Design Demand'}</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">{powerSummary.demandApparentPowerKva} kVA</div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Key Metrics Grid with Formula Trigger */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Installed Active */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Puissance Installée (P)' : 'Installed Power (P)'}</div>
          <div className="text-lg font-bold text-white font-mono mt-1">{powerSummary.installedPowerKw} kW</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">S = {powerSummary.installedApparentKva} kVA</div>
        </div>

        {/* Demand Active */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Puissance Demandée (P)' : 'Demand Power (P)'}</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{powerSummary.demandActivePowerKw} kW</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">ku·ks appliqué (+{Math.round((project.expansionMarginFactor - 1) * 100)}%)</div>
        </div>

        {/* Reactive Demand */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Réactif Demandé (Q)' : 'Reactive Demand (Q)'}</div>
          <div className="text-lg font-bold text-indigo-400 font-mono mt-1">{powerSummary.demandReactivePowerKvar} kVAR</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">cos φ moyen: {powerSummary.averagePowerFactor}</div>
        </div>

        {/* Transformer Load */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Charge Transformateur' : 'Transformer Load'}</div>
          <div className={`text-lg font-bold font-mono mt-1 ${
            powerSummary.transformerUtilizationPercent > 85 ? 'text-rose-400' :
            powerSummary.transformerUtilizationPercent > 70 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {powerSummary.transformerUtilizationPercent}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {powerSummary.demandApparentPowerKva} / {project.supplyContext.transformerRatingKva} kVA
          </div>
        </div>

        {/* Standby Genset Load */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Charge Groupe Secours' : 'Genset Load'}</div>
          <div className="text-lg font-bold text-amber-400 font-mono mt-1">
            {project.backupSupplyContext.hasStandbyGenerator ? `${powerSummary.generatorUtilizationPercent}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {project.backupSupplyContext.hasStandbyGenerator ? `${project.backupSupplyContext.generatorRatingKva} kVA` : (isFr ? 'Non configuré' : 'Not set')}
          </div>
        </div>

        {/* Compensation Needed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative">
          <div className="text-xs text-slate-400 font-medium">{isFr ? 'Batterie Condensateur' : 'Capacitor Bank'}</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">{powerSummary.recommendedCompensationKvar} kVAR</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{isFr ? 'Cible cos φ = 0.95' : 'Target cos φ = 0.95'}</div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Phase Balance Matrix (L1, L2, L3) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isFr ? 'Équilibrage des Phases & Courants de Ligne' : 'Phase Balancing & Line Currents (L1, L2, L3)'}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{isFr ? 'Déséquilibre Maximal :' : 'Max Unbalance:'}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              powerSummary.phaseLoads.unbalancePercent > 10
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {powerSummary.phaseLoads.unbalancePercent}% {powerSummary.phaseLoads.unbalancePercent <= 10 ? '(Conforme ≤10%)' : '(Déséquilibré >10%)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-400 font-mono">PHASE 1 (L1)</span>
              <span className="text-xs text-slate-400 font-mono">{powerSummary.phaseLoads.L1_Kw} kW</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div 
                className="bg-amber-400 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (powerSummary.phaseLoads.L1_CurrentA / (powerSummary.totalDesignCurrentIbA || 1)) * 100 * 1.5)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{isFr ? 'Courant de Ligne :' : 'Line Current:'}</span>
              <span className="text-white font-mono font-bold">{powerSummary.phaseLoads.L1_CurrentA} A</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-emerald-400 font-mono">PHASE 2 (L2)</span>
              <span className="text-xs text-slate-400 font-mono">{powerSummary.phaseLoads.L2_Kw} kW</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div 
                className="bg-emerald-400 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (powerSummary.phaseLoads.L2_CurrentA / (powerSummary.totalDesignCurrentIbA || 1)) * 100 * 1.5)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{isFr ? 'Courant de Ligne :' : 'Line Current:'}</span>
              <span className="text-white font-mono font-bold">{powerSummary.phaseLoads.L2_CurrentA} A</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-indigo-400 font-mono">PHASE 3 (L3)</span>
              <span className="text-xs text-slate-400 font-mono">{powerSummary.phaseLoads.L3_Kw} kW</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div 
                className="bg-indigo-400 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (powerSummary.phaseLoads.L3_CurrentA / (powerSummary.totalDesignCurrentIbA || 1)) * 100 * 1.5)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{isFr ? 'Courant de Ligne :' : 'Line Current:'}</span>
              <span className="text-white font-mono font-bold">{powerSummary.phaseLoads.L3_CurrentA} A</span>
            </div>
          </div>
        </div>

        {powerSummary.phaseLoads.unbalancePercent > 10 && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {isFr 
                ? 'Alerte déséquilibre : Le déséquilibre dépasse 10%. Réaffectez certains récepteurs monophasés de la phase la plus chargée vers la phase la moins chargée pour éviter l\'échauffement du conducteur neutre.' 
                : 'Unbalance Warning: Phase unbalance exceeds 10%. Reassign single-phase loads from the heaviest phase to the lightest phase to minimize neutral conductor heating.'}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Load Inventory Table & Management */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {isFr ? 'Tableau d\'Inventaire des Récepteurs' : 'Load Inventory Schedule'}
              <span className="text-xs font-mono font-normal text-slate-400">({filteredLoads.length} {isFr ? 'lignes' : 'rows'})</span>
            </h4>

            {/* Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              aria-label={isFr ? 'Filtrer par catégorie' : 'Filter by category'}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">{isFr ? 'Toutes catégories' : 'All Categories'}</option>
              <option value="LIGHTING">{isFr ? 'Éclairage' : 'Lighting'}</option>
              <option value="SOCKETS">{isFr ? 'Prises de courant' : 'Sockets'}</option>
              <option value="HVAC">{isFr ? 'CVC / Climatisation' : 'HVAC'}</option>
              <option value="MOTIVE_PUMP">{isFr ? 'Pompes / Moteurs' : 'Pumps / Motors'}</option>
              <option value="IT_COMPUTING">{isFr ? 'Informatique / Baies' : 'IT / Data'}</option>
              <option value="INDUSTRIAL_MACHINE">{isFr ? 'Machines Industrielles' : 'Industrial Machines'}</option>
              <option value="EMERGENCY_LIFE_SAFETY">{isFr ? 'Sécurité Incendie' : 'Life Safety'}</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddingLoad(!isAddingLoad)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            {isFr ? 'Ajouter un Récepteur' : 'Add Load'}
          </button>
        </div>

        {/* Add Load Form Drawer */}
        {isAddingLoad && (
          <form onSubmit={handleAddLoadSubmit} className="p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Désignation Récepteur' : 'Load Name'}</label>
              <input
                type="text"
                required
                value={newLoad.name}
                onChange={(e) => setNewLoad({ ...newLoad, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Catégorie' : 'Category'}</label>
              <select
                value={newLoad.category}
                onChange={(e) => setNewLoad({ ...newLoad, category: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
              >
                <option value="LIGHTING">{isFr ? 'Éclairage' : 'Lighting'}</option>
                <option value="SOCKETS">{isFr ? 'Prises' : 'Sockets'}</option>
                <option value="HVAC">{isFr ? 'CVC' : 'HVAC'}</option>
                <option value="MOTIVE_PUMP">{isFr ? 'Pompe' : 'Pump'}</option>
                <option value="IT_COMPUTING">{isFr ? 'Informatique' : 'IT'}</option>
                <option value="INDUSTRIAL_MACHINE">{isFr ? 'Machine' : 'Machine'}</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Quantité' : 'Quantity'}</label>
              <input
                type="number"
                min="1"
                value={newLoad.quantity}
                onChange={(e) => setNewLoad({ ...newLoad, quantity: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Puissance Unitaire (kW)' : 'Unit Rating (kW)'}</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={newLoad.unitRatingKw}
                onChange={(e) => setNewLoad({ ...newLoad, unitRatingKw: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Phase & Tension' : 'Phase & Voltage'}</label>
              <select
                value={newLoad.phase}
                onChange={(e) => {
                  const p = e.target.value as any;
                  setNewLoad({ 
                    ...newLoad, 
                    phase: p, 
                    voltageV: p === '3P' ? 400 : 230 
                  });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
              >
                <option value="1P_L1">Monophasé L1 (230V)</option>
                <option value="1P_L2">Monophasé L2 (230V)</option>
                <option value="1P_L3">Monophasé L3 (230V)</option>
                <option value="3P">Triphasé 3P (400V)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Facteur de Puissance (cos φ)' : 'Power Factor'}</label>
              <input
                type="number"
                step="0.01"
                min="0.6"
                max="1.0"
                value={newLoad.powerFactor}
                onChange={(e) => setNewLoad({ ...newLoad, powerFactor: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Facteur Utilisation (ku)' : 'Utilization ku'}</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={newLoad.loadFactorKu}
                onChange={(e) => setNewLoad({ ...newLoad, loadFactorKu: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">{isFr ? 'Criticité' : 'Criticality'}</label>
              <select
                value={newLoad.criticality}
                onChange={(e) => setNewLoad({ ...newLoad, criticality: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
              >
                <option value="NORMAL">Normal</option>
                <option value="ESSENTIAL">Essentiel (Groupe)</option>
                <option value="EMERGENCY">Sécurité / Incendie</option>
                <option value="CRITICAL_UPS">Critique (Onduleur)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingLoad(false)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                {isFr ? 'Enregistrer le Récepteur' : 'Save Load'}
              </button>
            </div>
          </form>
        )}

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{isFr ? 'Récepteur' : 'Load Description'}</th>
                <th className="py-2.5 px-3">{isFr ? 'Catégorie' : 'Category'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Qté' : 'Qty'}</th>
                <th className="py-2.5 px-3 text-right">{isFr ? 'P.Unit (kW)' : 'Unit kW'}</th>
                <th className="py-2.5 px-3 text-right">{isFr ? 'P.Inst (kW)' : 'Inst kW'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'ku' : 'ku'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'ks' : 'ks'}</th>
                <th className="py-2.5 px-3 text-right">{isFr ? 'P.Appelé (kW)' : 'Demand kW'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Phase' : 'Phase'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'cos φ' : 'cos φ'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Criticité' : 'Criticality'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Actions' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLoads.map((load) => {
                const pInst = Math.round(load.quantity * load.unitRatingKw * 100) / 100;
                const pDem = Math.round(pInst * load.loadFactorKu * load.simultaneityKs * 100) / 100;

                return (
                  <tr key={load.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-medium text-white">
                      <div>{load.name}</div>
                      <div className="text-[10px] text-slate-500">{load.areaName}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                        {load.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{load.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-300">{load.unitRatingKw}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white">{pInst}</td>

                    {/* ku modifier */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={load.loadFactorKu}
                        aria-label={`Facteur ku pour ${load.name}`}
                        onChange={(e) => handleUpdateLoad(load.id, 'loadFactorKu', Number(e.target.value))}
                        className="w-14 text-center bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-xs text-amber-300 font-mono"
                      />
                    </td>

                    {/* ks modifier */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={load.simultaneityKs}
                        aria-label={`Facteur ks pour ${load.name}`}
                        onChange={(e) => handleUpdateLoad(load.id, 'simultaneityKs', Number(e.target.value))}
                        className="w-14 text-center bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-xs text-cyan-300 font-mono"
                      />
                    </td>

                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">{pDem}</td>

                    {/* Phase switch */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={load.phase}
                        aria-label={`Phase pour ${load.name}`}
                        onChange={(e) => handleUpdateLoad(load.id, 'phase', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded text-[11px] px-1 py-0.5 text-slate-200 font-mono"
                      >
                        <option value="1P_L1">L1</option>
                        <option value="1P_L2">L2</option>
                        <option value="1P_L3">L3</option>
                        <option value="3P">3P</option>
                      </select>
                    </td>

                    <td className="py-2 px-3 text-center font-mono text-slate-300">{load.powerFactor}</td>

                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        load.criticality === 'CRITICAL_UPS' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        load.criticality === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        load.criticality === 'ESSENTIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {load.criticality}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleDeleteLoad(load.id)}
                        className="p-1 hover:text-rose-400 text-slate-500 transition"
                        title={isFr ? 'Supprimer' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
