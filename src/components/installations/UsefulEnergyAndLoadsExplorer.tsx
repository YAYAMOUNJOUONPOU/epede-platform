// src/components/installations/UsefulEnergyAndLoadsExplorer.tsx
// EPEDE D06 - Electrical to Useful Energy Conversion & Critical Power (UPS / ATS)

import React, { useState } from 'react';
import {
  Lightbulb,
  Wind,
  Flame,
  Cpu,
  Server,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  BatteryCharging
} from 'lucide-react';

interface UsefulEnergyAndLoadsExplorerProps {
  locale: 'fr' | 'en';
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

type LoadCategory = 'LIGHTING' | 'MOTIVE_PUMP' | 'THERMAL_HVAC' | 'COMPUTING_IT';

export const UsefulEnergyAndLoadsExplorer: React.FC<UsefulEnergyAndLoadsExplorerProps> = ({
  locale,
  onNavigateToWorkbenchTab
}) => {
  const [activeCategory, setActiveCategory] = useState<LoadCategory>('LIGHTING');
  const [upsOperatingMode, setUpsOperatingMode] = useState<'NORMAL_INVERTER' | 'BATTERY_DISCHARGE' | 'STATIC_BYPASS' | 'MAINTENANCE_BYPASS'>('NORMAL_INVERTER');

  const categories: {
    id: LoadCategory;
    title_fr: string;
    title_en: string;
    icon: any;
    useful_output_fr: string;
    useful_output_en: string;
    efficiency: string;
    electrical_input: string;
    metrics: { label: string; value: string }[];
  }[] = [
    {
      id: 'LIGHTING',
      title_fr: 'Éclairage & Flux Lumineux (Photons)',
      title_en: 'Lighting & Luminous Flux (Photons)',
      icon: Lightbulb,
      useful_output_fr: 'Flux lumineux visible (Lumens) et éclairement de surface (Lux = lm/m²)',
      useful_output_en: 'Visible luminous flux (Lumens) and surface illuminance (Lux = lm/m²)',
      efficiency: '100 à 150 lm/W (LED moderne)',
      electrical_input: '230 V monophasé · Courant 0.20 A · Facteur de puissance Cos φ = 0.95',
      metrics: [
        { label: 'Flux produit', value: '4500 Lumens' },
        { label: 'Indice d\'éblouissement', value: 'UGR < 19 (Confort)' },
        { label: 'Rendu des couleurs', value: 'IRC (CRI) > 85' },
        { label: 'Perte thermique calorifique', value: 'Env. 55% converti en chaleur' }
      ]
    },
    {
      id: 'MOTIVE_PUMP',
      title_fr: 'Force Motrice & Pompage (Couple N·m & Débit)',
      title_en: 'Motive Power & Pumping (Torque N·m & Flow)',
      icon: Wind,
      useful_output_fr: 'Couple mécanique sur l\'arbre (N·m), vitesse de rotation (tr/min) et débit hydraulique (m³/h)',
      useful_output_en: 'Shaft mechanical torque (N·m), rotational speed (RPM), and hydraulic fluid flow (m³/h)',
      efficiency: '92.1% (Moteur induction IE3 Premium)',
      electrical_input: '400 V triphasé · Courant 28 A · Cos φ = 0.86',
      metrics: [
        { label: 'Couple mécanique nominal', value: '98.5 N·m à 1455 tr/min' },
        { label: 'Débit hydraulique', value: '60 m³/h à 3.2 bars' },
        { label: 'Puissance utile à l\'arbre', value: '15.0 kW mécanique' },
        { label: 'Pertes Joules stator/rotor', value: 'Env. 1.2 kW thermique' }
      ]
    },
    {
      id: 'THERMAL_HVAC',
      title_fr: 'Thermique & Climatisation (Joules & Froid)',
      title_en: 'Thermal & Climate Control (Joules & Cooling)',
      icon: Flame,
      useful_output_fr: 'Énergie calorifique (Chaleur en Joules/kWth) et rafraîchissement thermodynamique (Frigories)',
      useful_output_en: 'Caloric energy (Heat in Joules/kWth) and thermodynamic cooling (Frigories/kWth)',
      efficiency: 'COP = 3.8 à 4.2 (Machine frigorifique à eau glacée)',
      electrical_input: '400 V triphasé · Puissance absorbée 45 kWelectric',
      metrics: [
        { label: 'Puissance frigorifique utile', value: '170 kWth de froid à 7°C' },
        { label: 'Coefficient de performance', value: 'COP 3.8 (1 kWe donne 3.8 kWth)' },
        { label: 'Régime d\'eau glacée', value: 'Aller 7°C / Retour 12°C' },
        { label: 'Condenseur de rejet', value: 'Rejet thermique extérieur 215 kW' }
      ]
    },
    {
      id: 'COMPUTING_IT',
      title_fr: 'Informatique & Calcul Numérique (FLOPs/W)',
      title_en: 'IT Computing & Digital Processing (FLOPs/W)',
      icon: Cpu,
      useful_output_fr: 'Opérations virgule flottante (TFLOPs), transactions sécurisées et stockage de données',
      useful_output_en: 'Floating point operations (TFLOPs), encrypted transactions, and storage I/O',
      efficiency: 'PUE = 1.25 (Power Usage Effectiveness du Data Center)',
      electrical_input: '230 V ondulé pur · 100% de l\'énergie électrique finit en chaleur à dissiper',
      metrics: [
        { label: 'Puissance baie serveur', value: '6.0 kW régulée' },
        { label: 'Facteur de forme PUE', value: 'PUE = 1.22 (Refroidissement optimisé)' },
        { label: 'Tension résiduelle THD-u', value: '< 2.0% (Qualité onde sinusoïdale)' },
        { label: 'Dissipation requise', value: '20 500 BTU/h de climatisation' }
      ]
    }
  ];

  const activeData = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 text-[10px]">
              USEFUL ENERGY CONVERSION & CRITICAL POWER
            </span>
            <span className="text-slate-400 text-xs">De l'électron au service rendu</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Transformation en Énergie Utile & Alimentation sans Interruption (UPS / ATS)'
              : 'Useful Energy Transformation & Uninterruptible Critical Power (UPS / ATS)'}
          </h2>
        </div>
      </div>

      {/* 4 Conversion Archetypes Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-[#0E1522] text-slate-300 border-[#1C2538] hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-bold truncate">
                  {locale === 'fr' ? cat.title_fr.split(' ')[0] : cat.title_en.split(' ')[0]}
                </span>
              </div>
              <div className="text-[9px] opacity-80 truncate">{cat.efficiency}</div>
            </button>
          );
        })}
      </div>

      {/* Conversion Details Card */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1C2538]">
          <h3 className="text-sm font-bold text-white">
            {locale === 'fr' ? activeData.title_fr : activeData.title_en}
          </h3>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
            Rendement utile : {activeData.efficiency}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                {locale === 'fr' ? 'Énergie Électrique Injectée (Entrée) :' : 'Electrical Energy Input:'}
              </span>
              <p className="text-slate-200 font-sans">{activeData.electrical_input}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538]">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                {locale === 'fr' ? 'Travail Utile Produit (Sortie) :' : 'Useful Output Delivered:'}
              </span>
              <p className="text-white font-sans font-bold">
                {locale === 'fr' ? activeData.useful_output_fr : activeData.useful_output_en}
              </p>
            </div>
          </div>

          {/* 4 Quantitative Output Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {activeData.metrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#080B12] border border-[#1C2538] flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 uppercase leading-tight">{m.label}</span>
                <strong className="text-amber-400 text-xs font-black mt-1">{m.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Power System : Online UPS & ATS Interactive Architecture */}
      <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              {locale === 'fr'
                ? 'Architecture Voie Critique : Onduleur Statique (UPS 200 kVA VFI-SS-111)'
                : 'Mission-Critical Power: Online Double-Conversion UPS (200 kVA VFI-SS-111)'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">
            Temps de commutation : 0 ms (Absence totale de micro-coupure)
          </span>
        </div>

        {/* UPS Operating Mode Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'NORMAL_INVERTER', label_fr: 'Mode Normal (Onduleur)', label_en: 'Normal Inverter' },
            { id: 'BATTERY_DISCHARGE', label_fr: 'Décharge Batterie (Secours)', label_en: 'Battery Discharge' },
            { id: 'STATIC_BYPASS', label_fr: 'By-Pass Statique (Surcharge)', label_en: 'Static Bypass' },
            { id: 'MAINTENANCE_BYPASS', label_fr: 'By-Pass Maintenance (Manuel)', label_en: 'Maintenance Bypass' }
          ].map((mode) => {
            const isSelected = mode.id === upsOperatingMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setUpsOperatingMode(mode.id as any)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-[#080B12] text-slate-400 border-[#1C2538] hover:border-emerald-400'
                }`}
              >
                <span className="text-[10px]">
                  {locale === 'fr' ? mode.label_fr : mode.label_en}
                </span>
              </button>
            );
          })}
        </div>

        {/* UPS Internal Path Diagram & Status */}
        <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">
              {locale === 'fr' ? 'Flux actif dans l\'onduleur :' : 'Active UPS internal power path:'}
            </span>
            <span className="text-emerald-400 font-bold">
              {upsOperatingMode === 'NORMAL_INVERTER' && 'Réseau AC 400V ➔ Redresseur IGBT ➔ Bus DC ➔ Onduleur IGBT ➔ Charge Ondulée'}
              {upsOperatingMode === 'BATTERY_DISCHARGE' && 'Batteries Accumulateurs ➔ Bus DC ➔ Onduleur IGBT ➔ Charge Ondulée (Autonomie 30 min)'}
              {upsOperatingMode === 'STATIC_BYPASS' && 'Ligne Réseau Bypass direct ➔ Contacteurs Statiques Thyristors ➔ Charge (Transfert 0 ms)'}
              {upsOperatingMode === 'MAINTENANCE_BYPASS' && 'Sectionneur Mécanique Rotatif fermé ➔ Onduleur consigné pour révision'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#1C2538] text-[10px]">
            <div>
              <span className="text-slate-400 block text-[9px]">Tension de sortie :</span>
              <strong className="text-white">400 V ± 1% sinusoïde pure</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Fréquence stabilisée :</span>
              <strong className="text-emerald-400">50.0 Hz ± 0.1 Hz</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Taux de distorsion harmonique :</span>
              <strong className="text-sky-400">THD-u &lt; 1.5% sous charge non-linéaire</strong>
            </div>
          </div>
        </div>

        {/* Workbench Deep Sizing Gateway */}
        {onNavigateToWorkbenchTab && (
          <div className="pt-3 border-t border-[#1C2538] flex flex-wrap items-center justify-between gap-3">
            <span className="text-slate-400 text-xs">
              {locale === 'fr'
                ? 'Dimensionner l\'autonomie onduleur & le bilan de puissance dans l\'Atelier :'
                : 'Size UPS battery autonomy & power balance in the Design Workbench:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('UPS_BATTERY_AUTONOMY')}
                className="px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '17. Onduleurs (ASI) & Batteries' : '17. UPS & Battery Autonomy'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab('POWER_BALANCE')}
                className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '1. Bilan de Puissance' : '1. Power Balance'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
