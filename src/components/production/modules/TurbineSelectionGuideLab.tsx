// src/components/production/modules/TurbineSelectionGuideLab.tsx
// EPEDE D01 - Interactive Hydraulic Turbine Selection & Specific Speed (ns) Decision Guide
// Conforms to IEC 60193 & IEC 60041 Hydro Turbine Testing & Selection Standards

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Waves,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface TurbineSelectionGuideLabProps {
  locale: 'fr' | 'en';
  initialHeadM?: number;
  initialFlowM3s?: number;
  initialPowerMw?: number;
}

interface TurbineOption {
  id: string;
  nameFr: string;
  nameEn: string;
  typeFr: 'Action (Impulsion)' | 'Réaction';
  typeEn: 'Impulse' | 'Reaction';
  minHeadM: number;
  maxHeadM: number;
  minNs: number;
  maxNs: number;
  optimalEfficiency: number;
  runnerDiaFormula: string;
  cameroonExamples: string[];
  keyAdvantagesFr: string[];
  keyAdvantagesEn: string[];
  vulnerabilitiesFr: string[];
  vulnerabilitiesEn: string[];
  accentColor: string;
}

const TURBINE_CATALOG: TurbineOption[] = [
  {
    id: 'pelton',
    nameFr: 'Turbine Pelton (À Action / Injecteurs Multiples)',
    nameEn: 'Pelton Turbine (Impulse / Multi-Jet)',
    typeFr: 'Action (Impulsion)',
    typeEn: 'Impulse',
    minHeadM: 200,
    maxHeadM: 1800,
    minNs: 12,
    maxNs: 70,
    optimalEfficiency: 92.5,
    runnerDiaFormula: 'D1 ≈ 38 · √(Hn) / n',
    cameroonExamples: ['Chutes de la Menchum (Projet Haute Chute)', 'Centrales de haute montagne'],
    keyAdvantagesFr: [
      'Excellente tenue de rendement à charge partielle (20% à 100% Pn)',
      'Aucun risque de cavitation dans la roue (pression atmosphérique)',
      'Maintenance aisée des augets et pointeaux d’injecteurs sans démontage alternateur'
    ],
    keyAdvantagesEn: [
      'Outstanding part-load efficiency curve (from 20% to 100% rated load)',
      'Zero cavitation erosion risk (operates at atmospheric pressure)',
      'Easy bucket and spear nozzle inspection without uncoupling generator'
    ],
    vulnerabilitiesFr: [
      'Encombrement important et perte de chute sous la roue (garde d’eau)',
      'Vitesse spécifique faible imposant un grand diamètre ou un multiplicateur'
    ],
    vulnerabilitiesEn: [
      'Large civil footprint and tailwater drop clearance requirement',
      'Low specific speed requiring large diameter or many poles'
    ],
    accentColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  },
  {
    id: 'francis',
    nameFr: 'Turbine Francis (À Réaction / Écoulement Centripète)',
    nameEn: 'Francis Turbine (Reaction / Mixed Centripetal Flow)',
    typeFr: 'Réaction',
    typeEn: 'Reaction',
    minHeadM: 25,
    maxHeadM: 450,
    minNs: 70,
    maxNs: 350,
    optimalEfficiency: 94.8,
    runnerDiaFormula: 'D1 ≈ 4.1 · √(Q / n)',
    cameroonExamples: ['Nachtigal (7 × 60 MW, H = 50 m)', 'Song Loulou (8 × 48 MW, H = 40 m)', 'Edéa III (H = 24 m)'],
    keyAdvantagesFr: [
      'Très haut rendement de pointe (jusqu’à 95% au point de fonctionnement optimum)',
      'Polyvalence exceptionnelle couvrant 70% des grands aménagements mondiaux',
      'Construction robuste avec bâche spirale et avant-distributeur intégré'
    ],
    keyAdvantagesEn: [
      'Highest peak hydraulic efficiency (up to 95% at best efficiency point)',
      'Industry workhorse covering 70% of worldwide commercial hydro fleet',
      'Robust monoblock cast structure with spiral case and stay vanes'
    ],
    vulnerabilitiesFr: [
      'Rendement dégradé sous 50% de charge avec vortex d’aspiration et pulsations de pression',
      'Sensibilité critique à la cavitation au bord de fuite si la cote d’axe Hs est trop haute'
    ],
    vulnerabilitiesEn: [
      'Steep efficiency drop below 50% load with draft tube vortex surge',
      'High vulnerability to trailing edge cavitation if submergence Hs is insufficient'
    ],
    accentColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
  },
  {
    id: 'kaplan',
    nameFr: 'Turbine Kaplan (À Réaction / Double Réglage Pales-Directrices)',
    nameEn: 'Kaplan Turbine (Reaction / Double Regulated Axial Flow)',
    typeFr: 'Réaction',
    typeEn: 'Reaction',
    minHeadM: 5,
    maxHeadM: 55,
    minNs: 300,
    maxNs: 850,
    optimalEfficiency: 93.8,
    runnerDiaFormula: 'D1 ≈ 3.2 · (Q / √(Hn))^0.45',
    cameroonExamples: ['Lagdo (4 × 18 MW, H = 22 m)', 'Edéa I & II (Groupes basse chute fleuve Sanaga)'],
    keyAdvantagesFr: [
      'Double réglage combinatoire (pales mobiles + vannage) assurant un rendement plat de 30% à 100%',
      'Capacité d’absorption de débits massifs sous très faible hauteur de chute',
      'Vitesse spécifique élevée réduisant le nombre de pôles de l’alternateur'
    ],
    keyAdvantagesEn: [
      'Double regulation (movable runner blades + wicket gates) yielding a flat efficiency curve',
      'Massive discharge handling capacity under low heads',
      'High specific speed reducing generator pole count and powerhouse footprint'
    ],
    vulnerabilitiesFr: [
      'Mécanisme interne du moyeu avec servomoteur hydraulique immergé complexe',
      'Risque élevé d’émulsion d’huile dans l’eau en cas de défaillance des joints de pales'
    ],
    vulnerabilitiesEn: [
      'Complex internal hub servomotor and oil distribution head mechanism',
      'Environmental oil spill hazard in case of blade trunnion seal wear'
    ],
    accentColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  },
  {
    id: 'bulb',
    nameFr: 'Turbine Groupe Bulbe (Axiale Submersible / Fil de l’Eau)',
    nameEn: 'Bulb Turbine (Submerged Axial / Low Head Run-of-River)',
    typeFr: 'Réaction',
    typeEn: 'Reaction',
    minHeadM: 2,
    maxHeadM: 18,
    minNs: 650,
    maxNs: 1100,
    optimalEfficiency: 92.0,
    runnerDiaFormula: 'D1 ≈ 3.0 · (Q / √(Hn))^0.45',
    cameroonExamples: ['Sites fluviaux de basse chute Sanaga aval', 'Projets marémoteurs & déversoirs'],
    keyAdvantagesFr: [
      'Écoulement parfaitement rectiligne sans coude d’aspiration, réduisant le coût de génie civil',
      'Idéal pour les centrales de dérivation et passes à poissons intégrées'
    ],
    keyAdvantagesEn: [
      'Straight through horizontal waterflow with no intake bends, lowering civil costs',
      'Ideal for low-head run-of-river and bypass weir installations'
    ],
    vulnerabilitiesFr: [
      'Alternateur compact confiné dans l’ogive étanche immergée, refroidissement complexe',
      'Accès difficile pour la maintenance lourde des enroulements'
    ],
    vulnerabilitiesEn: [
      'Generator confined inside submerged nacelle with complex pressurized cooling',
      'Restricted maintenance accessibility for heavy rotor/stator overhauls'
    ],
    accentColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  },
  {
    id: 'crossflow',
    nameFr: 'Turbine Crossflow / Banki-Michell (Double Traversée)',
    nameEn: 'Crossflow / Banki-Michell Turbine (Transverse Flow)',
    typeFr: 'Action (Impulsion)',
    typeEn: 'Impulse',
    minHeadM: 3,
    maxHeadM: 120,
    minNs: 30,
    maxNs: 180,
    optimalEfficiency: 86.0,
    runnerDiaFormula: 'D1 ≈ 0.3 à 0.8 m',
    cameroonExamples: ['Électrification rurale décentralisée Ouest & Nord-Ouest Cameroun', 'Microcentrales villageoises & caféières'],
    keyAdvantagesFr: [
      'Fabrication 100% locale possible en atelier mécano-soudé sans fonderie de précision',
      'Auto-nettoyante face aux feuilles et sédiments fluviaux',
      'Coût d’investissement (CapEx) le plus bas du marché hydroélectrique'
    ],
    keyAdvantagesEn: [
      'Can be manufactured 100% locally with sheet metal welding (no precision casting)',
      'Self-cleaning blade geometry against leaves and river sediments',
      'Lowest CapEx per kW for rural decentralized electrification'
    ],
    vulnerabilitiesFr: [
      'Rendement maximal plafonné à 85-87%',
      'Puissance limitée aux micro/mini centrales (&lt; 2 MW)'
    ],
    vulnerabilitiesEn: [
      'Peak efficiency capped at 85-87%',
      'Power rating practically restricted to micro/mini plants (&lt; 2 MW)'
    ],
    accentColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
  }
];

export const TurbineSelectionGuideLab: React.FC<TurbineSelectionGuideLabProps> = ({
  locale,
  initialHeadM = 50,
  initialFlowM3s = 140,
  initialPowerMw = 60
}) => {
  // Interactive inputs
  const [headM, setHeadM] = useState<number>(initialHeadM);
  const [flowM3s, setFlowM3s] = useState<number>(initialFlowM3s);
  const [rotationalSpeedRpm, setRotationalSpeedRpm] = useState<number>(125);
  const [tailwaterHeightHs, setTailwaterHeightHs] = useState<number>(-2.5); // Meter below water surface

  // 1. Engineering Calculations
  // P_mech = 9.81 * Q * H * eta_turb (assume eta = 0.93)
  const estimatedPowerMw = useMemo(() => {
    return Number(((9.81 * flowM3s * headM * 0.93) / 1000).toFixed(2));
  }, [flowM3s, headM]);

  // Specific speed ns = n * sqrt(P_kW) / (H^(5/4)) (European metric formula)
  const specificSpeedNs = useMemo(() => {
    const powerKw = estimatedPowerMw * 1000;
    const denominator = Math.pow(headM, 1.25);
    if (denominator === 0) return 0;
    return Number(((rotationalSpeedRpm * Math.sqrt(powerKw)) / denominator).toFixed(1));
  }, [rotationalSpeedRpm, estimatedPowerMw, headM]);

  // Thoma Cavitation Coefficient calculation
  // sigma = (H_atm - H_vap - H_s) / H_net
  // Standard atmospheric pressure at sea level = 10.1 m water, H_vap ~ 0.3 m at 25°C
  const thomaSigma = useMemo(() => {
    const hAtm = 10.1;
    const hVap = 0.3;
    const sigma = (hAtm - hVap - tailwaterHeightHs) / headM;
    return Number(sigma.toFixed(3));
  }, [tailwaterHeightHs, headM]);

  // Critical Thoma sigma for Francis: sigma_crit ≈ 0.0432 * (ns / 100)^1.61
  const criticalSigma = useMemo(() => {
    const sig = 0.0432 * Math.pow(specificSpeedNs / 100, 1.61);
    return Number(sig.toFixed(3));
  }, [specificSpeedNs]);

  const cavitationMargin = useMemo(() => {
    return Number((thomaSigma - criticalSigma).toFixed(3));
  }, [thomaSigma, criticalSigma]);

  // Determine matching turbine recommendations
  const matchScores = useMemo(() => {
    return TURBINE_CATALOG.map((turb) => {
      let score = 0;
      let reasonsFr: string[] = [];
      let reasonsEn: string[] = [];

      // Head range match
      if (headM >= turb.minHeadM && headM <= turb.maxHeadM) {
        score += 50;
        reasonsFr.push(`Haute adéquation de chute (${headM} m ∈ [${turb.minHeadM}, ${turb.maxHeadM}] m)`);
        reasonsEn.push(`Head in optimal range (${headM} m ∈ [${turb.minHeadM}, ${turb.maxHeadM}] m)`);
      } else if (headM >= turb.minHeadM * 0.8 && headM <= turb.maxHeadM * 1.2) {
        score += 25;
        reasonsFr.push(`Chute en zone marginale acceptable`);
        reasonsEn.push(`Head in acceptable marginal zone`);
      }

      // Specific speed match
      if (specificSpeedNs >= turb.minNs && specificSpeedNs <= turb.maxNs) {
        score += 50;
        reasonsFr.push(`Vitesse spécifique ns = ${specificSpeedNs} parfaitement adaptée`);
        reasonsEn.push(`Specific speed ns = ${specificSpeedNs} is well-matched`);
      } else if (specificSpeedNs >= turb.minNs * 0.7 && specificSpeedNs <= turb.maxNs * 1.3) {
        score += 20;
        reasonsFr.push(`ns en limite de faisabilité`);
        reasonsEn.push(`ns on boundary threshold`);
      }

      return {
        turbine: turb,
        score,
        isRecommended: score >= 70,
        reasonsFr,
        reasonsEn
      };
    }).sort((a, b) => b.score - a.score);
  }, [headM, specificSpeedNs]);

  const recommendedTurbine = matchScores[0];

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              {locale === 'fr' ? 'Matrice de Sélection Turbine & Vitesse Spécifique (ns)' : 'Turbine Selection Matrix & Specific Speed (ns)'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              CEI 60193 / CEI 60041
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            {locale === 'fr'
              ? 'Déterminez la technologie optimale (Francis, Kaplan, Pelton, Bulbe, Crossflow) selon la hauteur de chute H, le débit Q et la vitesse de rotation.'
              : 'Determine the optimal runner design (Francis, Kaplan, Pelton, Bulb, Crossflow) based on head H, flow Q, and rotational speed.'}
          </p>
        </div>

        {/* Live Recommendation Badge */}
        {recommendedTurbine && (
          <div className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 ${recommendedTurbine.turbine.accentColor}`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {locale === 'fr' ? 'Sélection Recommandée' : 'Recommended Selection'}
              </div>
              <div className="font-black text-sm text-white">
                {locale === 'fr' ? recommendedTurbine.turbine.nameFr.split('(')[0] : recommendedTurbine.turbine.nameEn.split('(')[0]}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Controls & Live Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sliders Input Panel */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Paramètres Hydrauliques Aménagement' : 'Hydraulic Siting Parameters'}
            </span>
          </div>

          {/* Chute nette H */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Hauteur de chute nette (Hn) :' : 'Net Head (Hn):'}</span>
              <span className="font-bold text-sky-300 font-mono">{headM} m</span>
            </div>
            <input
              type="range"
              min={3}
              max={1000}
              step={1}
              value={headM}
              onChange={(e) => setHeadM(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3 m (Basse Chute)</span>
              <span>100 m</span>
              <span>1000 m (Haute Chute)</span>
            </div>
          </div>

          {/* Débit unitaire Q */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Débit unitaire nominal (Q) :' : 'Unit Nominal Flow (Q):'}</span>
              <span className="font-bold text-cyan-300 font-mono">{flowM3s} m³/s</span>
            </div>
            <input
              type="range"
              min={1}
              max={300}
              step={1}
              value={flowM3s}
              onChange={(e) => setFlowM3s(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 m³/s</span>
              <span>140 m³/s (Nachtigal)</span>
              <span>300 m³/s</span>
            </div>
          </div>

          {/* Vitesse de rotation n */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Vitesse de rotation synchrone (n) :' : 'Synchronous Speed (n):'}</span>
              <span className="font-bold text-amber-300 font-mono">{rotationalSpeedRpm} tr/min</span>
            </div>
            <input
              type="range"
              min={50}
              max={1500}
              step={25}
              value={rotationalSpeedRpm}
              onChange={(e) => setRotationalSpeedRpm(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>75 rpm</span>
              <span>125 rpm (24 pôles)</span>
              <span>1500 rpm</span>
            </div>
          </div>

          {/* Calage sous le niveau d'eau Hs */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{locale === 'fr' ? 'Cote de calage d’axe (Hs) :' : 'Setting Height (Hs):'}</span>
              <span className="font-bold text-purple-300 font-mono">{tailwaterHeightHs} m</span>
            </div>
            <input
              type="range"
              min={-8}
              max={4}
              step={0.5}
              value={tailwaterHeightHs}
              onChange={(e) => setTailwaterHeightHs(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-8 m (Noyé sous aval)</span>
              <span>0 m</span>
              <span>+4 m (Surélevé)</span>
            </div>
          </div>
        </div>

        {/* Calculated Telemetry Indicators */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Calculs Dimensionnels & Cavitation' : 'Dimensional Sizing & Cavitation'}
            </span>
          </div>

          {/* Specific speed card */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Vitesse Spécifique Métrique (ns)' : 'Metric Specific Speed (ns)'}
              </span>
              <span className="text-xs font-bold text-sky-400 font-mono">{specificSpeedNs} rpm·kW^0.5·m^-1.25</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Formule : ns = n · √(P_méc) / (Hn^1.25)
            </div>
          </div>

          {/* Mechanical Power */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Puissance Mécanique Estimée' : 'Estimated Mechanical Power'}
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{estimatedPowerMw} MW</span>
            </div>
            <div className="text-[10px] text-slate-500">
              P = ρ · g · Q · H · η_turb (avec η = 93%)
            </div>
          </div>

          {/* Thoma Cavitation Coefficient Sigma */}
          <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Coefficient de Thoma (σ)' : 'Thoma Cavitation Coeff (σ)'}
              </span>
              <span className={`text-xs font-bold font-mono ${cavitationMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                σ = {thomaSigma} (Critique : {criticalSigma})
              </span>
            </div>
            
            {/* Cavitation status alert */}
            <div className={`p-2 rounded-lg text-[10px] flex items-center gap-1.5 font-bold ${
              cavitationMargin >= 0.05
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : cavitationMargin >= 0
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {cavitationMargin >= 0.05 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{locale === 'fr' ? 'Marge de cavitation saine (+ ' + cavitationMargin + ')' : 'Healthy cavitation margin (+ ' + cavitationMargin + ')'}</span>
                </>
              ) : cavitationMargin >= 0 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{locale === 'fr' ? 'Marge étroite, risque d’érosion à pleine charge' : 'Narrow margin, erosion risk at full load'}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{locale === 'fr' ? 'CAVITATION IMMINENTE : abaisser la cote de calage Hs !' : 'IMMINENT CAVITATION: lower runner elevation Hs!'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Head-Speed Visual Regime Map */}
        <div className="p-4 rounded-2xl bg-[#0E141F] border border-[#222B38] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222B38]">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs uppercase">
              {locale === 'fr' ? 'Plages d’Application & Références Cameroun' : 'Application Zones & Cameroon Fleet'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {TURBINE_CATALOG.map((t) => {
              const isMatch = matchScores.find(m => m.turbine.id === t.id)?.isRecommended;
              return (
                <div
                  key={t.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isMatch
                      ? 'bg-sky-500/20 border-sky-400 shadow-md'
                      : 'bg-[#090D14] border-[#222B38] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">{locale === 'fr' ? t.nameFr.split('(')[0] : t.nameEn.split('(')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400">H: {t.minHeadM}–{t.maxHeadM} m</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>ns: {t.minNs}–{t.maxNs}</span>
                    <span className="text-sky-300 font-semibold">{t.cameroonExamples[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Detailed Turbine Analysis Cards */}
      <div className="space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>{locale === 'fr' ? 'Comparatif Technologique & Recommandation par Adéquation' : 'Technology Comparison & Suitability Ranking'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchScores.map(({ turbine: turb, score, isRecommended, reasonsFr, reasonsEn }) => (
            <div
              key={turb.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isRecommended
                  ? 'bg-[#0E141F] border-sky-400 shadow-xl ring-1 ring-sky-400/30'
                  : 'bg-[#090D14] border-[#222B38] opacity-80'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${turb.accentColor}`}>
                    {locale === 'fr' ? turb.typeFr : turb.typeEn}
                  </span>
                  <h5 className="font-bold text-white text-xs mt-1">
                    {locale === 'fr' ? turb.nameFr : turb.nameEn}
                  </h5>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-base font-black ${isRecommended ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {score}%
                  </span>
                  <div className="text-[9px] text-slate-500 uppercase">{locale === 'fr' ? 'Score' : 'Match'}</div>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#090D14]/80 p-2 rounded-xl border border-[#222B38]">
                <div>
                  <span className="text-slate-500 block">Rendement max :</span>
                  <span className="text-white font-bold">{turb.optimalEfficiency} %</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Diamètre roue :</span>
                  <span className="text-amber-300 font-bold">{turb.runnerDiaFormula}</span>
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-1 text-[11px]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {locale === 'fr' ? 'Avantages Clés :' : 'Key Advantages:'}
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[10px]">
                  {(locale === 'fr' ? turb.keyAdvantagesFr : turb.keyAdvantagesEn).map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              {/* Cameroon references */}
              <div className="pt-2 border-t border-[#222B38] text-[10px] text-slate-400">
                <span className="font-bold text-sky-400">Réf. Cameroun : </span>
                <span>{turb.cameroonExamples.join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
