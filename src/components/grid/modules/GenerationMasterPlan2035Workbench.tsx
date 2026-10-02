import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Droplets, 
  Sun, 
  Wind, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';

interface PipelineProject {
  id: string;
  name: string;
  capacityMW: number;
  riverOrResource: string;
  location: string;
  targetYear: number;
  developer: string;
  estimatedCostMEur: number;
  status: 'En Construction' | 'Financement Bouclé' | 'Études APD / Négociation PPA' | 'Études de Faisabilité';
  technology: 'HYDRO' | 'SOLAR_BESS' | 'BIOMASS';
  transmissionEvac: string;
  description: string;
}

export const GenerationMasterPlan2035Workbench: React.FC = () => {
  const [selectedHorizonYear, setSelectedHorizonYear] = useState<number>(2030);
  const [filterTech, setFilterTech] = useState<'ALL' | 'HYDRO' | 'SOLAR_BESS'>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('kikot');

  const pipelineProjects: PipelineProject[] = [
    {
      id: 'nachtigal-complete',
      name: 'Nachtigal Amont (Achèvement 7 Groupes)',
      capacityMW: 420,
      riverOrResource: 'Fleuve Sanaga',
      location: 'Nachtigal / Ntui, Région du Centre',
      targetYear: 2026,
      developer: 'NHPC (EDF, IFC, État CMR, Africa50, STOA)',
      estimatedCostMEur: 1200,
      status: 'En Construction',
      technology: 'HYDRO',
      transmissionEvac: 'Double ligne 225 kV Nachtigal ➔ Nyom II (Yaoundé)',
      description: 'Plus grande centrale électrique du Cameroun à ce jour, fournissant à terme 30% des besoins énergétiques du pays à un coût ultra-compétitif.'
    },
    {
      id: 'scatec-solar-ext',
      name: 'Centrales Solaires Hybrides avec BESS (Maroua & Guider Phase 2)',
      capacityMW: 50,
      riverOrResource: 'Gisement Solaire Grand Nord (6.2 kWh/m²/j)',
      location: 'Maroua (Extrême-Nord) & Guider (Nord)',
      targetYear: 2027,
      developer: 'Scatec ASA / Eneo / Release',
      estimatedCostMEur: 65,
      status: 'Financement Bouclé',
      technology: 'SOLAR_BESS',
      transmissionEvac: 'Raccordement postes 110/30 kV Maroua & Guider avec stockage batterie Li-ion',
      description: 'Doublement des parcs solaires couplés à des batteries de stockage pour écrêter la pointe du soir et effacer totalement le thermique diesel.'
    },
    {
      id: 'kikot',
      name: 'Aménagement Hydroélectrique de Kikot-Mbébé',
      capacityMW: 500,
      riverOrResource: 'Fleuve Sanaga (Aval Nachtigal)',
      location: 'Kikot, Frontière Centre / Littoral',
      targetYear: 2030,
      developer: 'KHPC (EDF 50%, République du Cameroun 50%)',
      estimatedCostMEur: 1350,
      status: 'Études APD / Négociation PPA',
      technology: 'HYDRO',
      transmissionEvac: 'Nouvelle dorsale THT 400 kV Kikot ➔ Boumnyébel ➔ Douala & Yaoundé',
      description: 'Deuxième méga-barrage au fil de l\'eau sur la Sanaga régulée par Lom Pangar. Clé de voûte de l\'émergence industrielle 2030 et exportateur PEAC.'
    },
    {
      id: 'menchum',
      name: 'Centrale Hydroélectrique des Chutes de Menchum',
      capacityMW: 72,
      riverOrResource: 'Fleuve Menchum',
      location: 'Bafut, Région du Nord-Ouest',
      targetYear: 2029,
      developer: 'MINEE / Partenariat Public-Privé (PPP)',
      estimatedCostMEur: 320,
      status: 'Études APD / Négociation PPA',
      technology: 'HYDRO',
      transmissionEvac: 'Ligne 225 kV Menchum ➔ Bamenda ➔ Bafoussam & antenne transfrontalière Nigeria',
      description: 'Stabilisation de l\'anneau Ouest / Nord-Ouest et possibilité d\'exportation d\'énergie vers le réseau nigérian (TCN).'
    },
    {
      id: 'grand-eweng',
      name: 'Méga-Centrale Hydroélectrique de Grand Eweng',
      capacityMW: 1000,
      riverOrResource: 'Fleuve Sanaga (Amont Songloulou)',
      location: 'Grand Eweng, Littoral / Centre',
      targetYear: 2033,
      developer: 'Hydromine / État du Cameroun',
      estimatedCostMEur: 2100,
      status: 'Études de Faisabilité',
      technology: 'HYDRO',
      transmissionEvac: 'Dorsale THT 400 kV d\'évacuation de puissance vers les pôles sidérurgiques et portuaires',
      description: 'Projet gigawatt destiné à alimenter la montée en puissance d\'ALUCAM (300 000 t/an), les projets miniers (bauxite de Minim-Martap) et le pool PEAC.'
    },
    {
      id: 'chollet',
      name: 'Projet Hydroélectrique Binational de Chollet',
      capacityMW: 600,
      riverOrResource: 'Rivière Dja (Frontière CMR / Congo)',
      location: 'Frontière Sud Cameroun - République du Congo',
      targetYear: 2032,
      developer: 'Commission Mixte Cameroun-Congo / China Gezhouba',
      estimatedCostMEur: 1400,
      status: 'Études de Faisabilité',
      technology: 'HYDRO',
      transmissionEvac: 'Interconnexion 225 kV Chollet ➔ Djoum ➔ Sangmélima (300 MW part camerounaise)',
      description: 'Projet d\'intégration régionale majeur entre le Cameroun et le Congo, matérialisant l\'axe Sud du Pool Énergétique d\'Afrique Centrale (PEAC).'
    },
    {
      id: 'song-dong',
      name: 'Aménagement Hydroélectrique de Song Dong',
      capacityMW: 280,
      riverOrResource: 'Fleuve Sanaga',
      location: 'Entre Nachtigal et Songloulou',
      targetYear: 2035,
      developer: 'HydroChina / PowerChina & EDC',
      estimatedCostMEur: 750,
      status: 'Études de Faisabilité',
      technology: 'HYDRO',
      transmissionEvac: 'Liaison 225 kV vers le poste de Mangombé',
      description: 'Dernier grand maillon de la cascade de la Sanaga permettant de valoriser à 100% les lâchers régulés du réservoir de Lom Pangar.'
    }
  ];

  // Capacity projections based on horizon year
  const baselineCapacity2025 = 1540; // MW
  const activeProjectsAtHorizon = pipelineProjects.filter(p => p.targetYear <= selectedHorizonYear);
  const additionalCapacityMW = activeProjectsAtHorizon.reduce((sum, p) => sum + p.capacityMW, 0);
  const totalCapacityMW = baselineCapacity2025 + additionalCapacityMW;

  // Key metrics according to Vision 2035
  const estimatedElectrificationRate = Math.min(96, Math.round(68 + (selectedHorizonYear - 2025) * 2.8));
  const cleanEnergyPercentage = Math.min(94, 82 + (selectedHorizonYear >= 2030 ? 7 : 4));

  const filteredProjects = pipelineProjects.filter(p => {
    if (filterTech !== 'ALL' && p.technology !== filterTech) return false;
    return true;
  });

  const selectedProject = pipelineProjects.find(p => p.id === selectedProjectId) || pipelineProjects[2];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Plan Directeur de Production • Vision Émergence 2035
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    3e Potentiel Hydro d'Afrique Sub-Saharienne
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Pipeline Stratégique des Grands Projets de Production (Horizon 2035)
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Le Cameroun dispose de plus de <strong className="text-emerald-300">23 000 MW de potentiel hydroélectrique exploitable</strong>. 
              Visualisez l'évolution prévisionnelle du mix énergétique avec les futures méga-centrales de Kikot (500 MW), Grand Eweng (1 000 MW), Chollet (600 MW) et les parcs solaires BESS.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Puissance Totale ({selectedHorizonYear})</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {totalCapacityMW.toLocaleString('fr-FR')} MW
              </div>
              <div className="text-[10px] text-slate-500">+{additionalCapacityMW} MW ajoutés</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Taux d'Électrification</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {estimatedElectrificationRate}%
              </div>
              <div className="text-[10px] text-slate-500">Cible Vision 2035: &gt;90%</div>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Part Renouvelable</div>
              <div className="text-xl font-bold font-mono text-teal-400 mt-0.5">
                {cleanEnergyPercentage}%
              </div>
              <div className="text-[10px] text-slate-500">Hydro + Solaire BESS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizon Slider Control & Technology Filter */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Curseur Temporel de l'Horizon Prévisionnel</h3>
              <p className="text-[11px] text-slate-400">Glissez pour observer la mise en service échelonnée des centrales</p>
            </div>
          </div>

          {/* Quick milestone pills */}
          <div className="flex items-center gap-2">
            {[2026, 2028, 2030, 2032, 2035].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedHorizonYear(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedHorizonYear === yr 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">2026 (Nachtigal 420 MW en service)</span>
            <span className="text-emerald-400 font-bold text-sm">Horizon Actif : {selectedHorizonYear}</span>
            <span className="text-slate-400">2035 (Grand Eweng 1000 MW & Mix Gigawatt)</span>
          </div>
          <input 
            type="range"
            min={2026}
            max={2035}
            step={1}
            value={selectedHorizonYear}
            onChange={(e) => setSelectedHorizonYear(Number(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2.5 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Aujourd'hui</span>
            <span>2028</span>
            <span>2030 (Kikot 500 MW)</span>
            <span>2032 (Chollet)</span>
            <span>2035 (Vision Cameroun Émergent)</span>
          </div>
        </div>
      </div>

      {/* Projects Grid & Deep Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List with Target Year Status */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">
                Projets du Master Plan ({filteredProjects.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(['ALL', 'HYDRO', 'SOLAR_BESS'] as const).map(tech => (
                <button
                  key={tech}
                  onClick={() => setFilterTech(tech)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    filterTech === tech 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.map((project) => {
            const isSelected = selectedProjectId === project.id;
            const isOnlineAtHorizon = project.targetYear <= selectedHorizonYear;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                  isSelected 
                    ? 'bg-slate-900/90 border-emerald-500/70 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-2.5 rounded-lg border mt-0.5 ${
                      project.technology === 'HYDRO' 
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    }`}>
                      {project.technology === 'HYDRO' ? <Droplets className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-sm">{project.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {project.riverOrResource}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                          isOnlineAtHorizon 
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          {isOnlineAtHorizon ? `Mise en service ${project.targetYear} (EN LIGNE)` : `Horizon ${project.targetYear} (FUTUR)`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>{project.location}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-300">{project.developer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Capacité Installée</div>
                    <div className="text-lg font-black font-mono text-emerald-400">
                      {project.capacityMW} MW
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">~ {project.estimatedCostMEur} M€ Invest.</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Project Technical Dossier */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Fiche de Projet d'Investissement</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">{selectedProject.targetYear}</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black text-white">{selectedProject.name}</h4>
                <div className="text-xs text-emerald-400/90 font-mono mt-0.5">{selectedProject.status}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Puissance Installée:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedProject.capacityMW} MW</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Fleuve / Ressource:</span>
                  <span className="font-mono text-slate-200">{selectedProject.riverOrResource}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Promoteur / Sponsor:</span>
                  <span className="font-mono text-slate-200">{selectedProject.developer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Coût d'Investissement Estimé:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedProject.estimatedCostMEur} M€ (~ {(selectedProject.estimatedCostMEur * 655.957 / 1000).toFixed(1)} Mds FCFA)</span>
                </div>
                <div className="flex flex-col py-1.5">
                  <span className="text-slate-400 mb-1">Évacuation de Puissance SONATREL:</span>
                  <span className="font-mono text-indigo-300 text-[11px] bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    {selectedProject.transmissionEvac}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bailleurs potentiels:</span>
            <span className="text-slate-200 font-semibold">IFC, BEI, BAD, Proparco, KfW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
