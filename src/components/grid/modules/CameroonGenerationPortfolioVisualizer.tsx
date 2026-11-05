// src/components/grid/modules/CameroonGenerationPortfolioVisualizer.tsx
// Interactive Generation Portfolio, Capacity Concepts (Installed vs. Available vs. Generated)
// & Seasonal Hydrological Dispatch Simulator (Sanaga Cascade & Benue RIN Basin)

import React, { useState } from 'react';
import {
  Droplets,
  Flame,
  Sun,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Waves,
  Gauge,
} from 'lucide-react';

type HydrologicalSeason = 'wet_season' | 'dry_regulated' | 'dry_drought_rin';

interface SeasonScenario {
  id: HydrologicalSeason;
  titleFr: string;
  titleEn: string;
  periodFr: string;
  periodEn: string;
  sanagaFlowM3s: number;
  lomPangarReleaseM3s: number;
  benueFlowM3s: number;
  risHydroAvailableMw: number;
  risHydroInstalledMw: number;
  rinHydroAvailableMw: number;
  rinHydroInstalledMw: number;
  thermalDispatchMw: number;
  solarBessDispatchMw: number;
  engineeringAnalysisFr: string;
  engineeringAnalysisEn: string;
}

const SEASONAL_SCENARIOS: SeasonScenario[] = [
  {
    id: 'wet_season',
    titleFr: '1. Saison des Hautes Eaux (Crue Hydrologique Septembre – Novembre)',
    titleEn: '1. Wet Season Peak Hydrology (September – November High Flows)',
    periodFr: 'Septembre – Novembre (Remplissage des retenues)',
    periodEn: 'September – November (Reservoir Impoundment)',
    sanagaFlowM3s: 3850,
    lomPangarReleaseM3s: 0,
    benueFlowM3s: 920,
    risHydroAvailableMw: 1240,
    risHydroInstalledMw: 1291,
    rinHydroAvailableMw: 68,
    rinHydroInstalledMw: 72,
    thermalDispatchMw: 145,
    solarBessDispatchMw: 22,
    engineeringAnalysisFr:
      'En saison des pluies, le débit naturel de la Sanaga dépasse 3 500 m³/s (bien au-delà du débit d’équipement de ~1 000–1 200 m³/s des centrales). Nachtigal (420 MW), Songloulou (384 MW) et Édéa (276 MW) fonctionnent à pleine capacité disponible pendant que les barrages-réservoirs (Lom Pangar 6 Gm³, Mbakaou, Bamendjin, Mapé) stockent l’eau. Les centrales thermiques HFO sont mises en réserve froide ; seule la base gaz (Kribi/Logbaba) maintient le plan de tension.',
    engineeringAnalysisEn:
      'During the rainy season, natural Sanaga River discharge exceeds 3,500 m³/s (well above the ~1,000–1,200 m³/s turbine design flow). Nachtigal (420 MW), Songloulou (384 MW), and Edéa (276 MW) operate at maximum available capacity while upstream regulating reservoirs (Lom Pangar 6 Gm³, Mbakaou, Bamendjin, Mapé) store water. HFO thermal plants remain in cold reserve.',
  },
  {
    id: 'dry_regulated',
    titleFr: '2. Étiage Régularisé de la Sanaga (Janvier – Mai avec Lom Pangar)',
    titleEn: '2. Regulated Dry Season on the Sanaga (January – May with Lom Pangar)',
    periodFr: 'Janvier – Mai (Soutien d’étiage par les réservoirs d’EDC)',
    periodEn: 'January – May (EDC Regulating Reservoir Releases)',
    sanagaFlowM3s: 1050,
    lomPangarReleaseM3s: 620,
    benueFlowM3s: 140,
    risHydroAvailableMw: 1120,
    risHydroInstalledMw: 1291,
    rinHydroAvailableMw: 36,
    rinHydroInstalledMw: 72,
    thermalDispatchMw: 340,
    solarBessDispatchMw: 30,
    engineeringAnalysisFr:
      'Sans régulation, le débit naturel de la Sanaga chuterait sous 350 m³/s en mars. Grâce aux lâchers programmés de Lom Pangar (6 milliards m³), de Mbakaou (2,6 Gm³), Bamendjin (1,8 Gm³) et Mapé (3,2 Gm³), le débit est soutenu autour de 1 040 m³/s, garantissant plus de 85% du productible hydroélectrique du RIS, complété par Kribi Gaz (216 MW), Logbaba (105 MW) et Dibamba (86 MW) en pointe.',
    engineeringAnalysisEn:
      'Without regulation, natural Sanaga flow would drop below 350 m³/s in March. Scheduled releases from Lom Pangar (6 Gm³), Mbakaou (2.6 Gm³), Bamendjin (1.8 Gm³), and Mapé (3.2 Gm³) sustain river flow near 1,040 m³/s, securing >85% of RIS hydro capacity, supplemented by Kribi Gas (216 MW), Logbaba (105 MW), and Dibamba (86 MW) for evening peaks.',
  },
  {
    id: 'dry_drought_rin',
    titleFr: '3. Étiage Sévère sur le Bassin de la Bénoué (RIN — Mars à Juin)',
    titleEn: '3. Severe Dry-Season Low Water on the Benue Basin (RIN — March to June)',
    periodFr: 'Mars – Juin (Stress hydrique sahélien sur Lagdo)',
    periodEn: 'March – June (Sahelian Hydrological Stress at Lagdo)',
    sanagaFlowM3s: 980,
    lomPangarReleaseM3s: 650,
    benueFlowM3s: 65,
    risHydroAvailableMw: 1060,
    risHydroInstalledMw: 1291,
    rinHydroAvailableMw: 24,
    rinHydroInstalledMw: 72,
    thermalDispatchMw: 390,
    solarBessDispatchMw: 30,
    engineeringAnalysisFr:
      'Illustre l’écart critique entre puissance installée et puissance disponible : sur le Réseau Interconnecté Nord (RIN), l’envasement et la baisse de cote du lac de Lagdo réduisent la puissance disponible de 72 MW (4 × 18 MW installés) à parfois 20–28 MW. Les centrales solaires PV + BESS de Guider et Maroua (30 MWp) prennent le relais en journée et la centrale thermique de Djamboutou soutient la pointe en attendant l’interconnexion 225 kV RIS–RIN.',
    engineeringAnalysisEn:
      'Illustrates the critical gap between installed and dependable capacity: on the Northern Grid (RIN), low reservoir levels and siltation at Lagdo reduce available output from 72 MW installed (4 × 18 MW) down to 20–28 MW. The Guider and Maroua Solar PV + BESS plants (30 MWp) cover daytime load while Djamboutou thermal units firm the evening peak pending the 225 kV RIS–RIN interconnection.',
  },
];

interface CameroonGenerationPortfolioVisualizerProps {
  locale: 'fr' | 'en';
}

export const CameroonGenerationPortfolioVisualizer: React.FC<CameroonGenerationPortfolioVisualizerProps> = ({
  locale,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<HydrologicalSeason>('dry_regulated');
  const activeScenario =
    SEASONAL_SCENARIOS.find((s) => s.id === selectedSeason) || SEASONAL_SCENARIOS[1];

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
            <Waves className="w-4 h-4" />
            <span>
              {locale === 'fr'
                ? 'INGÉNIERIE DE LA PRODUCTION : CAPACITÉ INSTALLÉE vs DISPONIBLE & RÉGULATION HYDROLOGIQUE'
                : 'GENERATION ENGINEERING: INSTALLED vs. AVAILABLE CAPACITY & HYDROLOGICAL REGULATION'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
            {locale === 'fr'
              ? 'Fonctionnement au Fil de l’Eau vs Barrages-Réservoirs & Équilibre Saisonnier'
              : 'Run-of-River vs. Regulating Reservoirs & Seasonal Dispatch Balance'}
          </h3>
        </div>

        {/* Season Selector */}
        <div className="flex flex-wrap gap-2">
          {SEASONAL_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedSeason(sc.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedSeason === sc.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
              }`}
            >
              {sc.id === 'wet_season'
                ? locale === 'fr'
                  ? 'Hautes Eaux (Crue)'
                  : 'Wet Season (Peak)'
                : sc.id === 'dry_regulated'
                ? locale === 'fr'
                  ? 'Étiage Régulé (Lom Pangar)'
                  : 'Regulated Dry Season'
                : locale === 'fr'
                ? 'Étiage Sévère RIN (Lagdo)'
                : 'RIN Drought Stress'}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Fundamental Power Engineering Definitions: Installed vs Available vs Generated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-amber-400">
              {locale === 'fr' ? '1. Puissance Installée (MW)' : '1. Installed Capacity (MW)'}
            </span>
            <span className="font-mono text-sm font-black text-white">~2 084 MW</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {locale === 'fr'
              ? 'Somme arithmétique des puissances nominales inscrites sur les plaques signalétiques de tous les alternateurs (ex: 7 × 60 MW = 420 MW à Nachtigal ; 8 × 48 MW = 384 MW à Songloulou).'
              : 'Arithmetic sum of nameplate ratings across all generating units (e.g., 7 × 60 MW = 420 MW at Nachtigal; 8 × 48 MW = 384 MW at Songloulou).'}
          </p>
        </div>

        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-emerald-400">
              {locale === 'fr' ? '2. Puissance Disponible (MW)' : '2. Dependable / Available (MW)'}
            </span>
            <span className="font-mono text-sm font-black text-emerald-400">
              {activeScenario.risHydroAvailableMw +
                activeScenario.rinHydroAvailableMw +
                activeScenario.thermalDispatchMw +
                activeScenario.solarBessDispatchMw}{' '}
              MW
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {locale === 'fr'
              ? 'Puissance réellement mobilisable à un instant donné par le Dispatching National de Mangombé après déduction des indisponibilités mécaniques, de l’étiage hydrologique (Lagdo/Sanaga) ou des contraintes d’approvisionnement en combustible.'
              : 'Actual net power dispatchable in real time by the Mangombé National Control Centre after accounting for hydrological head/flow limits, scheduled overhauls, or fuel supply constraints.'}
          </p>
        </div>

        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-sky-400">
              {locale === 'fr' ? '3. Énergie Produite (GWh/an)' : '3. Energy Generated (GWh/yr)'}
            </span>
            <span className="font-mono text-sm font-black text-sky-400">~8 950 GWh/an</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {locale === 'fr'
              ? 'Intégrale de la puissance appelée dans le temps (E = ∫ P(t) dt). Nachtigal produit à lui seul ~2 935 GWh/an (facteur de charge ~80%), tandis qu’une centrale HFO de pointe ne tourne que quelques heures par jour.'
              : 'Time integral of active power delivered over the year (E = ∫ P(t) dt). Nachtigal alone generates ~2,935 GWh/year (~80% capacity factor), whereas peaking HFO plants run only during evening peak hours.'}
          </p>
        </div>
      </div>

      {/* Live Seasonal Simulation Panel */}
      <div className="bg-[#0B0F12] border border-cyan-500/30 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252E38] pb-3">
            <div>
              <h4 className="font-mono text-sm sm:text-base font-black text-white">
                {locale === 'fr' ? activeScenario.titleFr : activeScenario.titleEn}
              </h4>
              <span className="text-xs font-mono text-cyan-400">
                {locale === 'fr' ? activeScenario.periodFr : activeScenario.periodEn}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 font-mono text-xs text-cyan-300 font-bold">
                Sanaga : {activeScenario.sanagaFlowM3s} m³/s
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/40 font-mono text-xs text-purple-300 font-bold">
                Bénoué : {activeScenario.benueFlowM3s} m³/s
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {locale === 'fr'
              ? activeScenario.engineeringAnalysisFr
              : activeScenario.engineeringAnalysisEn}
          </p>

          {/* Capacity Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#151C1E] border border-[#252E38] rounded-lg p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Hydro RIS (Sanaga + Ntem)</span>
                <span className="text-cyan-400 font-bold">
                  {activeScenario.risHydroAvailableMw} / {activeScenario.risHydroInstalledMw} MW
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      (activeScenario.risHydroAvailableMw / activeScenario.risHydroInstalledMw) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-[#151C1E] border border-[#252E38] rounded-lg p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Hydro RIN (Lagdo Bénoué)</span>
                <span className="text-amber-400 font-bold">
                  {activeScenario.rinHydroAvailableMw} / {activeScenario.rinHydroInstalledMw} MW
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      (activeScenario.rinHydroAvailableMw / activeScenario.rinHydroInstalledMw) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Run-of-River vs Reservoir Comparison Box */}
        <div className="bg-[#151C1E] border border-[#252E38] rounded-xl p-4 space-y-3">
          <h5 className="font-mono text-xs uppercase text-amber-400 font-bold">
            {locale === 'fr'
              ? 'Fil de l’Eau vs Barrages-Réservoirs au Cameroun'
              : 'Run-of-River vs. Storage Reservoirs in Cameroon'}
          </h5>
          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-2.5 rounded bg-[#0B0F12] border border-[#252E38]">
              <strong className="text-cyan-300 block font-mono">
                • Centrales au Fil de l’Eau (Run-of-River) :
              </strong>
              {locale === 'fr'
                ? 'Nachtigal (420 MW), Songloulou (384 MW), Édéa (276 MW) et Memve’ele (211 MW) n’ont qu’une retenue journalière : elles turbinent immédiatement le débit entrant du fleuve.'
                : 'Nachtigal (420 MW), Songloulou (384 MW), Edéa (276 MW), and Memve’ele (211 MW) have minimal pondage and depend directly on instantaneous river inflow.'}
            </div>
            <div className="p-2.5 rounded bg-[#0B0F12] border border-[#252E38]">
              <strong className="text-emerald-300 block font-mono">
                • Barrages-Réservoirs (Storage Dams) :
              </strong>
              {locale === 'fr'
                ? 'Lom Pangar (6 Gm³ + 30 MW), Mbakaou (2,6 Gm³), Bamendjin (1,8 Gm³), Mapé (3,2 Gm³) sur le bassin de la Sanaga, et Lagdo (7,7 Gm³ + 72 MW) sur la Bénoué stockent la crue annuelle pour soutenir l’étiage.'
                : 'Lom Pangar (6 Gm³ + 30 MW), Mbakaou (2.6 Gm³), Bamendjin (1.8 Gm³), Mapé (3.2 Gm³) in the Sanaga basin, and Lagdo (7.7 Gm³ + 72 MW) on the Benue store wet-season runoff for dry-season release.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

