// src/components/transmission/modules/CameroonTransmissionCorridorEngine.tsx
// EPEDE D03 - Cameroon National Transmission Grid Corridors & Environmental Engineering Engine

import React from 'react';
import {
  MapPin,
  Zap,
  Activity,
  CloudLightning,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  TreePine,
  Wind
} from 'lucide-react';
import {
  CAMEROON_TRANSMISSION_CORRIDORS,
  type CameroonTransmissionCorridor
} from '../services/useTransmissionProjectStore';

interface CameroonTransmissionCorridorEngineProps {
  locale: 'fr' | 'en';
  selectedCorridorId: string;
  onSelectCorridor: (corridorId: string) => void;
  onNavigateToStage?: (stage: 1 | 2 | 3 | 4 | 5) => void;
}

export const CameroonTransmissionCorridorEngine: React.FC<CameroonTransmissionCorridorEngineProps> = ({
  locale,
  selectedCorridorId,
  onSelectCorridor,
  onNavigateToStage
}) => {
  const activeCorridor = CAMEROON_TRANSMISSION_CORRIDORS[selectedCorridorId] || CAMEROON_TRANSMISSION_CORRIDORS.CORRIDOR_SONG_LOULOU_BEKOKO;
  const corridorsList = Object.values(CAMEROON_TRANSMISSION_CORRIDORS);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#090D14] via-[#101827] to-[#090D14] border border-[#222B38] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold tracking-wider uppercase font-mono">
                {locale === 'fr' ? 'Dorsales de Transport National (SONATREL)' : 'National Transmission Trunks (SONATREL)'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                {activeCorridor.network === 'RIS' ? 'Réseau Interconnecté Sud (RIS)' : activeCorridor.network === 'RIN' ? 'Réseau Interconnecté Nord (RIN)' : 'Interconnexion CEMAC'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              {locale === 'fr' ? activeCorridor.name_fr : activeCorridor.name_en}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              {locale === 'fr' ? activeCorridor.description_fr : activeCorridor.description_en}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 font-mono">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500">
                {locale === 'fr' ? 'Longueur de Ligne' : 'Corridor Length'}
              </div>
              <div className="text-lg font-bold text-sky-400">
                {activeCorridor.lengthKm} km
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500">
                {locale === 'fr' ? 'Capacité Thermique' : 'Thermal Capacity'}
              </div>
              <div className="text-lg font-bold text-amber-400">
                {activeCorridor.normalRatingMva} MVA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
        {corridorsList.map((corr) => {
          const isSelected = corr.id === selectedCorridorId;
          return (
            <button
              key={corr.id}
              type="button"
              onClick={() => onSelectCorridor(corr.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-400/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/30'
                  : 'bg-[#0E141F] border-[#222B38] hover:border-slate-600 hover:bg-[#151D2A]'
              }`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {corr.voltage} • {corr.circuitType === 'DOUBLE_CIRCUIT' ? '2x Terne' : '1x Terne'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                    {corr.lengthKm} km
                  </span>
                </div>

                <div className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {locale === 'fr' ? corr.name_fr.split('(')[0] : corr.name_en.split('(')[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {corr.conductorType} • {corr.bundleType}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#222B38]/60 mt-2">
                <span>SIL : <strong className="text-amber-400">{corr.silMva} MW</strong></span>
                <span className="text-sky-400 font-semibold">{corr.normalRatingMva} MVA</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Environmental & Terrain Reality Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* 1. Lightning Exposure & Shielding */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              {locale === 'fr' ? 'Niveau Kéraunique Nk' : 'Keraunic Days Nk'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeCorridor.isokeraunicDays > 100 ? 'SÉVÈRE' : 'ÉLEVÉ'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeCorridor.isokeraunicDays} <span className="text-xs font-normal text-slate-400">jours orage/an</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {locale === 'fr'
              ? 'Double câble de garde OPGW requis avec angle de protection α ≤ 25° et résistance de pied de pylône R < 10 Ω.'
              : 'Dual OPGW shield wire mandatory with shielding angle α ≤ 25° and tower footing resistance R < 10 Ω.'}
          </div>
        </div>

        {/* 2. Route Terrain & Right-of-Way */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <TreePine className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? 'Servitude & Emprise (RoW)' : 'Right-of-Way (RoW)'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              IEC 60826
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeCorridor.voltage === '225kV' ? '50 mètres' : '35 mètres'}
            <span className="text-xs font-normal text-slate-400"> largeur</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {activeCorridor.routeTerrain === 'EQUATORIAL_RAINFOREST'
              ? (locale === 'fr' ? 'Débroussaillement intensif forêt équatoriale requis pour prévenir les amorçages par feux de brousse.' : 'Intensive rainforest clearing required to prevent flashovers from vegetation and slash fires.')
              : (locale === 'fr' ? 'Corridor estuaire/savane : servitudes d’accès avec pistes d’entretien pour camions nacelles.' : 'Estuary/savanna corridor: established access roads for maintenance crane vehicles.')}
          </div>
        </div>

        {/* 3. Ambient Heat & Solar Gain */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              {locale === 'fr' ? 'Température Ambiante' : 'Ambient Temperature'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              IEEE 738
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeCorridor.ambientMaxTempC}°C <span className="text-xs font-normal text-slate-400">Plein Soleil</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {activeCorridor.ambientMaxTempC > 40
              ? (locale === 'fr' ? 'Conditions caniculaires sahéliennes (Grand Nord) : flèche thermique maximale à 85°C conducteur.' : 'Sahelian extreme heat (Far North): maximum conductor thermal sag evaluated at 85°C.')
              : (locale === 'fr' ? 'Climat tropical humide : échauffement équilibré par vents convectifs côtiers (2.0 m/s).' : 'Humid tropical climate: cooling balanced by ambient convective wind currents (2.0 m/s).')}
          </div>
        </div>

        {/* 4. Wind Velocity & Mechanical Design */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" />
              {locale === 'fr' ? 'Vent Extrême de Calcul' : 'Design Wind Speed'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              120 km/h
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeCorridor.windSpeedDesignMps} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {locale === 'fr'
              ? 'Pression dynamique de vent q = 0.5 * rho * v² dimensionnant les efforts de renversement sur fondations béton.'
              : 'Dynamic wind pressure q = 0.5 * rho * v² sizing overturning moments on concrete tower foundations.'}
          </div>
        </div>

      </div>

      {/* Action to Proceed to Stage 2 */}
      <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {locale === 'fr'
              ? `Corridor actif : ${activeCorridor.name_fr.split('(')[0]} (${activeCorridor.voltage}, ${activeCorridor.lengthKm} km, ${activeCorridor.normalRatingMva} MVA). Prêt pour l'ingénierie électromécanique des pylônes et calcul de flèche caténaire.`
              : `Active corridor: ${activeCorridor.name_en.split('(')[0]} (${activeCorridor.voltage}, ${activeCorridor.lengthKm} km, ${activeCorridor.normalRatingMva} MVA). Ready for tower electromechanical design and catenary sag calculations.`}
          </span>
        </div>
        {onNavigateToStage && (
          <button
            type="button"
            onClick={() => onNavigateToStage(2)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          >
            <span>{locale === 'fr' ? 'Étape 2 : Pylônes & Flèche Caténaire' : 'Stage 2: Towers & Catenary Sag'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
