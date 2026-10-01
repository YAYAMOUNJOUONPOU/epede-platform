// src/components/transmission/OverheadUndergroundComparison.tsx
// EPEDE D03 - Dedicated Side-by-Side Comparison: Overhead Transmission Lines vs Underground Cables

import React, { useState } from 'react';
import {
  Scale,
  FolderTree,
  Layers,
  Sliders,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

interface OverheadUndergroundComparisonProps {
  locale: 'fr' | 'en';
}

interface ComparisonRow {
  dimension_fr: string;
  dimension_en: string;
  ohl_fr: string;
  ohl_en: string;
  ugc_fr: string;
  ugc_en: string;
  highlight: 'neutral' | 'ohl_advantage' | 'ugc_advantage';
}

const COMPARISON_DIMENSIONS: ComparisonRow[] = [
  {
    dimension_fr: '1. Structure Physique Principale',
    dimension_en: '1. Primary Physical Structure',
    ohl_fr: 'Pylônes métalliques en treillis ou monopoles en acier, isolateurs en verre/composite, conducteurs nus aériens.',
    ohl_en: 'Steel lattice towers or tubular monopoles, glass/composite insulator strings, bare stranded conductors.',
    ugc_fr: 'Câbles isolés multicouches (XLPE super-propre), écran métallique en plomb/aluminium, gaine PE étanche en tranchée.',
    ugc_en: 'Multi-layer insulated cable system (super-clean XLPE), metallic lead/aluminum sheath, protective HDPE jacket in trench.',
    highlight: 'neutral'
  },
  {
    dimension_fr: '2. Visibilité & Emprise Paysagère',
    dimension_en: '2. Visibility & Landscape Impact',
    ohl_fr: 'Hautement visible dans le paysage (hauteur 35–55 m). Forte opposition sociale potentielle en zone habitée.',
    ohl_en: 'Highly visible in the landscape (height 35–55 m). Potential public opposition near residential areas.',
    ugc_fr: 'Totalement invisible en exploitation (enfoui sous terre à 1,5–2,0 m). Impact visuel nul après remise en état.',
    ugc_en: 'Completely invisible once installed (buried 1.5–2.0 m deep). Zero visual impact after landscape restoration.',
    highlight: 'ugc_advantage'
  },
  {
    dimension_fr: '3. Capacité & Puissance Réactive (Qc)',
    dimension_en: '3. Capacitance & Charging Reactive Power',
    ohl_fr: 'Faible capacité linéique (~ 0,011 µF/km). Faible production réactive (~ 140 kvar/km à 225 kV). Longueur critique > 400 km.',
    ohl_en: 'Low shunt capacitance (~ 0.011 µF/km). Low reactive generation (~ 140 kvar/km at 225 kV). Critical length > 400 km.',
    ugc_fr: 'Capacité linéique 15 à 25 fois supérieure (~ 0,20 µF/km). Énorme production réactive (~ 2 500 kvar/km). Nécessite des réactances shunt.',
    ugc_en: '15 to 25 times higher capacitance (~ 0.20 µF/km). Huge charging Mvar (~ 2,500 kvar/km). Requires heavy shunt compensation.',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '4. Évacuation Thermique & Refroidissement',
    dimension_en: '4. Thermal Environment & Heat Dissipation',
    ohl_fr: 'Refroidissement naturel par convection de l\'air ambiant et vent traversier. Possibilité de Dynamic Line Rating (DLR).',
    ohl_en: 'Natural cooling by ambient air convection and crosswind. Amenable to Dynamic Line Rating (DLR).',
    ugc_fr: 'Dissipation thermique contrainte par la résistivité du sol et du lit de sable (séchage thermique critique).',
    ugc_en: 'Heat dissipation constrained by soil thermal resistivity and bedding sand (risk of soil moisture thermal runaway).',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '5. Largeur du Couloir (Right-of-Way)',
    dimension_en: '5. Corridor & Right-of-Way (ROW) Width',
    ohl_fr: 'Couloir large de 35 à 50 m selon la tension pour respecter les distances de sécurité de balancement sous le vent.',
    ohl_en: 'Wide 35 to 50 m right-of-way corridor to maintain safety clearances under severe conductor wind blowout.',
    ugc_fr: 'Bande d\'emprise réduite en surface (5 à 10 m), mais servitudes strictes interdisant les arbres profonds et constructions.',
    ugc_en: 'Narrow surface strip (5 to 10 m), though subject to strict easements prohibiting deep-rooted trees and construction.',
    highlight: 'ugc_advantage'
  },
  {
    dimension_fr: '6. Localisation des Défauts',
    dimension_en: '6. Fault Location Accessibility',
    ohl_fr: 'Localisation visuelle immédiate par patrouille à pied, hélicoptère ou drone; relayage de distance précis.',
    ohl_en: 'Rapid visual inspection via foot patrol, helicopter, or drone; accurate distance relay fault location.',
    ugc_fr: 'Localisation non visible nécessitant des méthodes de réflectométrie (TDR), ponts de Murray ou déchargeurs d\'ondes.',
    ugc_en: 'Non-visible fault requiring time-domain reflectometry (TDR), Murray loop bridge, or acoustic thumper systems.',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '7. Durée des Réparations',
    dimension_en: '7. Repair Duration & Restoration Time',
    ohl_fr: 'Souvent rapide (quelques heures à quelques jours) pour le remplacement d\'un isolateur, manchon ou hauban.',
    ohl_en: 'Often fast (a few hours to several days) for replacing an insulator disc, conductor splice, or guy wire.',
    ugc_fr: 'Beaucoup plus longue (2 à 6 semaines) : terrassement, confection d\'une boîte de jonction propre sous tente stérile, essais diélectriques.',
    ugc_en: 'Significantly longer (2 to 6 weeks): civil excavation, sterile jointing tent installation, precision splicing, and HV resonance testing.',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '8. Travaux de Génie Civil & Pose',
    dimension_en: '8. Civil Works & Installation Complexity',
    ohl_fr: 'Massifs de fondation ponctuels tous les 350–450 m, levage des pylônes, déroulage des conducteurs sous tension mécanique.',
    ohl_en: 'Point foundations every 350–450 m, tower assembly/erection, controlled tension stringing over obstacles.',
    ugc_fr: 'Terrassement continu sur toute la longueur de la liaison, franchissements forés dirigés (HDD), chambres de jonction.',
    ugc_en: 'Continuous trenching along entire route, horizontal directional drilling (HDD) under rivers/roads, reinforced joint bays.',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '9. Exposition à la Foudre & Tempêtes',
    dimension_en: '9. Lightning & Atmospheric Surge Exposure',
    ohl_fr: 'Directement exposée aux coups de foudre directs, surtensions atmosphériques, tempêtes et chutes d\'arbres.',
    ohl_en: 'Directly exposed to direct lightning strikes, atmospheric overvoltages, wind storms, and falling vegetation.',
    ugc_fr: 'Complètement immunisé contre les coups de foudre directs (sensible uniquement aux ondes propagées aux extrémités).',
    ugc_en: 'Completely immune to direct lightning strikes (affected only by incoming traveling waves entering via terminations).',
    highlight: 'ugc_advantage'
  },
  {
    dimension_fr: '10. Inspection & Surveillance d\'État',
    dimension_en: '10. Inspection & Asset Health Monitoring',
    ohl_fr: 'Inspections visuelles périodiques, thermographie infrarouge par drone, contrôle de corrosion des cornières.',
    ohl_en: 'Periodic visual inspection, drone infrared thermography, tower steelwork corrosion and bolt torque audits.',
    ugc_fr: 'Surveillance continue par capteurs intégrés : température par fibre optique DTS, mesures de décharges partielles (HFCT).',
    ugc_en: 'Continuous embedded sensor monitoring: fiber-optic DTS distributed temperature sensing, high-frequency PD monitoring.',
    highlight: 'neutral'
  },
  {
    dimension_fr: '11. Coût d\'Investissement Initial (CAPEX)',
    dimension_en: '11. Capital Investment Cost (CAPEX)',
    ohl_fr: 'Coût de référence (1x). Économiquement très avantageux pour les moyennes et longues distances en milieu ouvert.',
    ohl_en: 'Benchmark baseline cost (1x). Highly cost-effective for medium and long transmission distances across open terrain.',
    ugc_fr: 'Sensiblement plus élevé (4x à 10x le coût aérien en 225–400 kV) selon la complexité du sous-sol et les franchissements.',
    ugc_en: 'Substantially higher (4x to 10x overhead cost at 225–400 kV) depending on civil obstructions and underground crossings.',
    highlight: 'ohl_advantage'
  },
  {
    dimension_fr: '12. Pénétration en Milieu Urbain Dense',
    dimension_en: '12. High-Density Urban Ingress Suitability',
    ohl_fr: 'Très difficile voire impossible en centre-ville en raison des gabarits légaux et de l\'indisponibilité foncière.',
    ohl_en: 'Extremely difficult or prohibited in dense city centers due to mandatory legal clearances and lack of land corridors.',
    ugc_fr: 'Solution incontournable pour amener la haute tension au cœur des métropoles et zones industrielles compactes.',
    ugc_en: 'The indispensable engineering solution for injecting bulk power into dense metropolitan centers and industrial docks.',
    highlight: 'ugc_advantage'
  }
];

export const OverheadUndergroundComparison: React.FC<OverheadUndergroundComparisonProps> = ({
  locale
}) => {
  // Interactive Reactive Power Charging Simulator
  const [simLengthKm, setSimLengthKm] = useState<number>(30);
  const [simVoltageKv, setSimVoltageKv] = useState<number>(225);

  // Capacitances: OHL ~ 0.0115 uF/km; UGC ~ 0.21 uF/km
  const ohlCapacitanceUfPerKm = 0.0115;
  const ugcCapacitanceUfPerKm = 0.21;

  // Reactive power Qc = omega * C * V^2 * length
  const omega = 2 * Math.PI * 50;
  const vVolts = simVoltageKv * 1e3;

  const ohlQcMvar = Number(
    ((omega * (ohlCapacitanceUfPerKm * 1e-6) * (vVolts ** 2) * simLengthKm) / 1e6).toFixed(1)
  );

  const ugcQcMvar = Number(
    ((omega * (ugcCapacitanceUfPerKm * 1e-6) * (vVolts ** 2) * simLengthKm) / 1e6).toFixed(1)
  );

  const ratio = Number((ugcQcMvar / Math.max(0.1, ohlQcMvar)).toFixed(1));

  // Critical length calculation: L_crit = I_rated / (omega * C * V_ph)
  // When charging current equals rated thermal current, no active power can be transmitted without compensation!
  const ugcRatedCurrentA = 1250; // typical 1200 mm2 Cu XLPE cable
  const vPhase = (simVoltageKv * 1e3) / Math.sqrt(3);
  const ugcChargingCurrentPerKm = omega * (ugcCapacitanceUfPerKm * 1e-6) * vPhase;
  const ugcCriticalLengthKm = Math.round((ugcRatedCurrentA / ugcChargingCurrentPerKm) * 10) / 10;

  const ohlRatedCurrentA = 1500; // typical Aster 570 duplex
  const ohlChargingCurrentPerKm = omega * (ohlCapacitanceUfPerKm * 1e-6) * vPhase;
  const ohlCriticalLengthKm = Math.round((ohlRatedCurrentA / ohlChargingCurrentPerKm) * 10) / 10;

  // Shunt reactor requirement for UGC (80% compensation typical)
  const shuntReactorRecommendedMvar = Math.round(ugcQcMvar * 0.8 * 10) / 10;

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38] shadow-xl text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PILLIER 5 · BENCHMARK SYSTÉMIQUE & LONGUEUR CRITIQUE
            </span>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Comparatif Technologique OHL vs UGC (12 Dimensions & Régime Réactif)'
                  : 'Overhead Lines vs Underground Cables Multi-Criteria Comparison'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold">
              Lignes Aériennes (OHL)
            </span>
            <span className="text-slate-500">vs</span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
              Câbles Souterrains (UGC)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#252E38] text-[10px] text-slate-400 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="font-sans">
            {locale === 'fr'
              ? 'Ce comparatif quantitatif met en lumière l\'antagonisme fondamental : la faible impédance capacitive des câbles (effet Ferranti intense et longueur critique thermique) opposée à l\'emprise foncière et la vulnérabilité climatique des lignes aériennes.'
              : 'This quantitative benchmark highlights the fundamental physical trade-off: huge cable charging capacitance (intense Ferranti effect and thermal critical length) versus wide land right-of-way and severe weather vulnerability for overhead lines.'}
          </span>
        </div>
      </div>

      {/* 1.5. Visual Side-by-Side Infrastructure Anatomy (OHL vs UGC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overhead Line Anatomy */}
        <div className="rounded-2xl bg-[#161B22] border border-sky-500/30 overflow-hidden flex flex-col">
          <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
            <img
              src={getEngineeringImageUrl(engineeringAssets.transmission.corridor)}
              alt="225 kV Overhead Transmission Corridor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-sky-500/90 text-slate-950 font-bold text-[10px] font-mono">
              LIGNE AÉRIENNE (OHL) • IEC 60826
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-sky-300">
              <span>Capacité shunt C ≈ 0.011 µF/km</span>
              <span className="text-slate-400">Pylônes treillis acier</span>
            </div>
          </div>
          <div className="p-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-[#252E38]">
              <span className="text-slate-400">Refroidissement :</span>
              <span className="text-emerald-400 font-semibold">Convection naturelle + vent (IEEE 738)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-[#252E38]">
              <span className="text-slate-400">Longueur critique :</span>
              <span className="text-sky-400 font-semibold">&gt; 400 km à 225 kV (très élevée)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Coût d’investissement :</span>
              <span className="text-emerald-400 font-semibold">1.0x (Référence économique)</span>
            </div>
          </div>
        </div>

        {/* Underground Cable Trench Anatomy */}
        <div className="rounded-2xl bg-[#161B22] border border-amber-500/30 overflow-hidden flex flex-col">
          <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
            <img
              src={getEngineeringImageUrl(engineeringAssets.transmission.undergroundCableTrench)}
              alt="225 kV XLPE Underground Cable Trench"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold text-[10px] font-mono">
              CÂBLE SOUTERRAIN (UGC) • IEC 60287
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-amber-300">
              <span>Capacité shunt C ≈ 0.21 µF/km (x20)</span>
              <span className="text-slate-400">Pose trèfle / nappe</span>
            </div>
          </div>
          <div className="p-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-[#252E38]">
              <span className="text-slate-400">Refroidissement :</span>
              <span className="text-amber-400 font-semibold">Conduction sol / sable fluide (CIGRÉ TB 680)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-[#252E38]">
              <span className="text-slate-400">Longueur critique :</span>
              <span className="text-rose-400 font-semibold">~ 40 à 60 km sans réactance shunt</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Coût d’investissement :</span>
              <span className="text-amber-400 font-semibold">4x à 10x (Génie civil et jonctions stériles)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Reactive Power Charging Simulator (Why Cables are Different) */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
          <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>
              {locale === 'fr'
                ? 'Simulateur d\'Effet Capacitif & Longueur Critique (Qc = ω·C·U²·l)'
                : 'Capacitive Charging & Critical Transmission Distance Solver'}
            </span>
          </span>
          <span className="text-[10px] text-slate-500">
            Per CIGRÉ TB 680 / IEC 60287
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Longueur de la Liaison :</span>
                <span className="text-white font-bold">{simLengthKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={simLengthKm}
                onChange={(e) => setSimLengthKm(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Palier de Tension Nominale :</span>
                <span className="text-white font-bold">{simVoltageKv} kV</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[90, 225, 400].map((kv) => (
                  <button
                    key={kv}
                    type="button"
                    onClick={() => setSimVoltageKv(kv)}
                    className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                      simVoltageKv === kv
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-[#161B22] text-slate-400 border-[#252E38] hover:border-slate-600'
                    }`}
                  >
                    {kv} kV
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Length & Shunt Compensation Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Longueur Critique Câble (L_crit) :</span>
                <span className="text-red-400 font-bold">{ugcCriticalLengthKm} km</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Longueur Critique Ligne (OHL) :</span>
                <span className="text-sky-400 font-bold">{ohlCriticalLengthKm} km</span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-sans">
                {locale === 'fr'
                  ? `À ${ugcCriticalLengthKm} km, le courant de charge capacitif consomme 100% de la capacité thermique du câble (${ugcRatedCurrentA} A) : aucun watt actif ne peut plus être transporté sans compensation shunt !`
                  : `At ${ugcCriticalLengthKm} km, the charging current consumes 100% of cable thermal capacity (${ugcRatedCurrentA} A): zero active power can be transmitted without shunt reactors!`}
              </div>
            </div>
          </div>

          {/* Results Comparison (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#0D1117] border border-sky-500/40">
                <span className="text-[10px] text-sky-400 uppercase font-bold block">
                  Ligne Aérienne (OHL)
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  +{ohlQcMvar} Mvar
                </span>
                <span className="text-[10px] text-slate-500">
                  Capacité C ≈ {ohlCapacitanceUfPerKm} µF/km ({Math.round(ohlChargingCurrentPerKm * 10) / 10} A/km)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-amber-500/40">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">
                  Câble Souterrain (UGC)
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  +{ugcQcMvar} Mvar
                </span>
                <span className="text-[10px] text-slate-500">
                  Capacité C ≈ {ugcCapacitanceUfPerKm} µF/km ({Math.round(ugcChargingCurrentPerKm * 10) / 10} A/km)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Ratio de Puissance Réactive Générée :</span>
              <span className="text-amber-400 font-bold">
                Le câble produit {ratio}× plus de réactif que la ligne aérienne équivalente !
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90 flex items-center justify-between">
              <span>Réactance Shunt Requise pour UGC (80%) :</span>
              <span className="font-bold text-amber-300">
                {shuntReactorRecommendedMvar} Mvar inductifs (Postes d'extrémité)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive 12-Dimension Side-by-Side Comparison Table */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
        <span className="text-xs font-bold text-slate-300 uppercase block">
          {locale === 'fr' ? 'Tableau Comparatif Détaillé' : 'Detailed Multi-Criteria Comparison'}
        </span>

        <div className="space-y-2">
          {COMPARISON_DIMENSIONS.map((row, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] grid grid-cols-1 lg:grid-cols-12 gap-3"
            >
              {/* Dimension Name (3 cols) */}
              <div className="lg:col-span-3 text-white font-bold flex items-center gap-1.5">
                <span className="text-cyan-400">◈</span>
                <span>{locale === 'fr' ? row.dimension_fr : row.dimension_en}</span>
              </div>

              {/* OHL Description (4 cols) */}
              <div className="lg:col-span-4 p-2.5 rounded-lg bg-[#161B22] border border-sky-500/20 text-slate-300 text-[11px] leading-relaxed">
                <span className="text-[9px] text-sky-400 font-bold uppercase block mb-1">
                  Ligne Aérienne (OHL)
                </span>
                {locale === 'fr' ? row.ohl_fr : row.ohl_en}
              </div>

              {/* UGC Description (5 cols) */}
              <div className="lg:col-span-5 p-2.5 rounded-lg bg-[#161B22] border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                <span className="text-[9px] text-amber-400 font-bold uppercase block mb-1">
                  Câble Souterrain (UGC)
                </span>
                {locale === 'fr' ? row.ugc_fr : row.ugc_en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
