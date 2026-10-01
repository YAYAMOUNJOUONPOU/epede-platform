// src/components/equipment/SafetyBadge.tsx
import React from 'react';
import type { HazardLevel } from '../../types/epede';

interface SafetyConfig {
  label_fr: string;
  label_en: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}

const HAZARD_CONFIGS: Record<Exclude<HazardLevel, 'none'>, SafetyConfig> = {
  high_voltage: {
    label_fr: 'Haute Tension',
    label_en: 'High Voltage',
    bg: 'bg-[#7F1D1D]',
    text: 'text-[#FEE2E2]',
    border: 'border-[#991B1B]',
    icon: '⚡',
  },
  arc_flash: {
    label_fr: 'Risque Arc Flash',
    label_en: 'Arc Flash Risk',
    bg: 'bg-[#7C2D12]',
    text: 'text-[#FED7AA]',
    border: 'border-[#C2410C]',
    icon: '💥',
  },
  thermal_runaway: {
    label_fr: 'Emballement Thermique',
    label_en: 'Thermal Runaway',
    bg: 'bg-[#78350F]',
    text: 'text-[#FEF3C7]',
    border: 'border-[#D97706]',
    icon: '🔥',
  },
  fire_risk: {
    label_fr: 'Risque Incendie',
    label_en: 'Fire Risk',
    bg: 'bg-[#7F1D1D]',
    text: 'text-[#FEE2E2]',
    border: 'border-[#991B1B]',
    icon: '🚒',
  },
  low_voltage: {
    label_fr: 'Basse Tension',
    label_en: 'Low Voltage',
    bg: 'bg-[#1E3A5F]',
    text: 'text-[#BFDBFE]',
    border: 'border-[#2563EB]',
    icon: '⚡',
  },
};

interface SafetyBadgeProps {
  is_safety_critical: boolean;
  hazard_level: HazardLevel;
  locale: 'fr' | 'en';
  size?: 'sm' | 'md' | 'lg';
  voltageText?: string;
  className?: string;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({
  is_safety_critical,
  hazard_level,
  locale,
  size = 'md',
  voltageText,
  className = '',
}) => {
  if (!is_safety_critical || hazard_level === 'none') {
    return null;
  }

  const config = HAZARD_CONFIGS[hazard_level];
  if (!config) return null;

  const label = locale === 'fr' ? config.label_fr : config.label_en;
  const fullAria = `${label} — ${locale === 'fr' ? 'Équipement critique de sécurité' : 'Critical safety hazard'}`;

  if (size === 'lg') {
    return (
      <div
        id="safety-badge-large"
        role="img"
        data-testid="safety-badge"
        aria-label={fullAria}
        className={`w-full rounded-md border ${config.border} ${config.bg} p-4 text-left shadow-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0 select-none">{config.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-base font-black tracking-wider uppercase ${config.text}`}>
                ⚠️ {label} {voltageText ? `· ${voltageText}` : ''}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-300 font-medium">
              {locale === 'fr'
                ? 'Équipement à risque électrique critique · Respecter strictement les consignes de consignation et de sécurité'
                : 'Safety-critical electrical equipment · Mandatory lock-out/tag-out and arc-rated PPE protocols apply'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-mono font-black uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-mono font-black uppercase tracking-wider',
  }[size];

  return (
    <span
      role="img"
      data-testid="safety-badge"
      aria-label={fullAria}
      className={`inline-flex items-center gap-1.5 rounded border ${config.border} ${config.bg} ${config.text} ${sizeClasses} shadow-sm select-none ${className}`}
    >
      <span className="select-none">⚠️</span>
      <span>{label}</span>
      {voltageText && (
        <span className="opacity-90 font-mono text-[10px] ml-0.5">({voltageText})</span>
      )}
    </span>
  );
};
