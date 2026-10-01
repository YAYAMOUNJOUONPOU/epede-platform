// src/components/production/CameroonFleetExplorer.tsx
import React, { useState } from 'react';
import { 
  Building2, 
  Waves, 
  Flame, 
  Sun, 
  Zap, 
  MapPin, 
  Layers, 
  Activity, 
  CheckCircle2, 
  ExternalLink,
  Filter,
  Shield,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  CAMEROON_GENERATION_FLEET, 
  CAMEROON_NATIONAL_ENERGY_STATS,
  type CameroonPowerPlant 
} from './data/cameroonGenerationFleet';

interface CameroonFleetExplorerProps {
  locale?: 'fr' | 'en';
}

export const CameroonFleetExplorer: React.FC<CameroonFleetExplorerProps> = ({
  locale = 'fr'
}) => {
  const [filterTech, setFilterTech] = useState<'all' | 'hydro' | 'gas_thermal' | 'oil_thermal' | 'solar_pv'>('all');
  const [filterGrid, setFilterGrid] = useState<'all' | 'RIS' | 'RIN'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlantId, setSelectedPlantId] = useState<string>(CAMEROON_GENERATION_FLEET[0].id);

  const filteredPlants = CAMEROON_GENERATION_FLEET.filter(plant => {
    if (filterTech !== 'all' && plant.technology !== filterTech) return false;
    if (filterGrid !== 'all' && plant.gridZone !== filterGrid) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        plant.name.toLowerCase().includes(q) ||
        plant.location.toLowerCase().includes(q) ||
        plant.operator.toLowerCase().includes(q) ||
        plant.basinOrResource.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedPlant = CAMEROON_GENERATION_FLEET.find(p => p.id === selectedPlantId) || filteredPlants[0] || CAMEROON_GENERATION_FLEET[0];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              {locale === 'en' ? 'National Generation Observatory • Cameroon' : 'Observatoire National de la Production • Cameroun'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {locale === 'en' ? 'Power Generation Fleet (RIS & RIN)' : 'Parc de Production Électrique (RIS & RIN)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {locale === 'en'
              ? 'Technical inventory of master power stations, regulated river basins, firm capacities, and 225/110/90 kV grid injection voltages.'
              : 'Inventaire technique des centrales maîtresses, des cours d\'eau régulés, des puissances garanties et des tensions d\'injection 225/110/90 kV.'}
          </p>
        </div>

        {/* National Mix Quick Stats */}
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'en' ? 'Total Capacity' : 'Capacité Totale'}</div>
            <div className="text-base font-bold text-white">
              {CAMEROON_NATIONAL_ENERGY_STATS.totalInstalledCapacityMw} <span className="text-xs font-normal text-slate-400">MW</span>
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-sky-950/60 border border-sky-800/60 text-center">
            <div className="text-[10px] text-sky-400 uppercase">{locale === 'en' ? 'Hydro Share' : 'Part Hydro'}</div>
            <div className="text-base font-bold text-sky-300">
              {CAMEROON_NATIONAL_ENERGY_STATS.hydroPercentage}%
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-center hidden sm:block">
            <div className="text-[10px] text-emerald-400 uppercase">{locale === 'en' ? '2030 Target' : 'Cible 2030'}</div>
            <div className="text-base font-bold text-emerald-300">
              {CAMEROON_NATIONAL_ENERGY_STATS.target2030Mw} <span className="text-xs font-normal text-slate-400">MW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Technology Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterTech('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterTech === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Toutes Filières ({CAMEROON_GENERATION_FLEET.length})
          </button>
          <button
            onClick={() => setFilterTech('hydro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              filterTech === 'hydro'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3 h-3" />
            Hydro (73.5%)
          </button>
          <button
            onClick={() => setFilterTech('gas_thermal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              filterTech === 'gas_thermal'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3" />
            Gaz (15%)
          </button>
          <button
            onClick={() => setFilterTech('solar_pv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              filterTech === 'solar_pv'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            Solaire (2%)
          </button>
        </div>

        {/* Search Input and Grid Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setFilterGrid('all')}
              className={`px-2 py-1 rounded text-[11px] ${filterGrid === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterGrid('RIS')}
              className={`px-2 py-1 rounded text-[11px] ${filterGrid === 'RIS' ? 'bg-sky-900 text-sky-200 font-bold' : 'text-slate-400'}`}
            >
              RIS (Sud)
            </button>
            <button
              onClick={() => setFilterGrid('RIN')}
              className={`px-2 py-1 rounded text-[11px] ${filterGrid === 'RIN' ? 'bg-emerald-900 text-emerald-200 font-bold' : 'text-slate-400'}`}
            >
              RIN (Nord)
            </button>
          </div>

          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher centrale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left list of plants, Right deep-dive card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plant Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredPlants.map((plant) => {
            const isSelected = plant.id === selectedPlant.id;
            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlantId(plant.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-sky-950/90 border-sky-500 shadow-md shadow-sky-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      plant.technology === 'hydro' ? 'bg-sky-400' :
                      plant.technology === 'gas_thermal' ? 'bg-orange-400' :
                      plant.technology === 'oil_thermal' ? 'bg-rose-400' : 'bg-amber-400'
                    }`} />
                    <span className="text-xs font-mono font-bold text-white truncate max-w-[200px]">
                      {plant.name.replace('Centrale Hydroélectrique de ', '').replace('Centrale Thermique ', '').replace('Centrales Solaires PV de ', '')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-sky-300">
                    {plant.installedCapacityMw} MW
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {plant.location} ({plant.region})
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {plant.gridZone} • {plant.voltageInjectionKv} kV
                  </span>
                </div>
              </div>
            );
          })}

          {filteredPlants.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Aucune centrale ne correspond aux critères de recherche.
            </div>
          )}
        </div>

        {/* Plant Spotlight Detail (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-slate-950/70 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                    RÉSEAU {selectedPlant.gridZone} • INJECTION {selectedPlant.voltageInjectionKv} kV
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Mise en service : {selectedPlant.commissionYear}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  {selectedPlant.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedPlant.location}, Région du {selectedPlant.region} | Exploitant : <strong className="text-slate-200">{selectedPlant.operator}</strong>
                </p>
              </div>

              <div className="text-right shrink-0 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Capacité Installée</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  {selectedPlant.installedCapacityMw} <span className="text-xs text-slate-400">MW</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Garantie : {selectedPlant.guaranteedCapacityMw} MW
                </div>
              </div>
            </div>

            {/* Technical Specs & Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-mono text-sky-400 uppercase font-semibold text-[11px] block">
                  Configuration des Groupes
                </span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                  {selectedPlant.unitSpecs}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-mono text-emerald-400 uppercase font-semibold text-[11px] block">
                  Bassin Versant / Ressource Primaire
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedPlant.basinOrResource}
                </p>
              </div>
            </div>

            {/* Strategic Grid Role & Production */}
            <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2 text-xs">
              <span className="font-mono text-amber-400 uppercase font-semibold text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Rôle Clé dans l'Équilibre du Réseau
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedPlant.keyRole}
              </p>
              {selectedPlant.annualGenerationGwh && (
                <div className="text-[11px] text-emerald-300 font-mono pt-1">
                  Productible annuel moyen : <strong>{selectedPlant.annualGenerationGwh} GWh/an</strong>
                </div>
              )}
            </div>

            {/* Engineering Notes */}
            <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/80 text-[11px] text-slate-400 italic">
              <strong>Note d'ingénierie :</strong> {selectedPlant.notes}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Aménagement hydroélectrique & thermique du Cameroun</span>
            <span className="text-emerald-400 font-semibold">Référence Normative SONATREL / ARSEL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
