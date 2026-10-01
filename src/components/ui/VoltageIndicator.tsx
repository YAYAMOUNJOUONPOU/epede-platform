// src/components/ui/VoltageIndicator.tsx
import React from 'react';
import { VOLTAGE_COLORS, type VoltageLevel } from '../../types/epede';

interface VoltageIndicatorProps {
  level?: VoltageLevel;
  voltageLevel?: VoltageLevel;
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

const VOLTAGE_LABELS: Record<VoltageLevel, { fr: string; en: string; defaultVal: string }> = {
  EHV: { fr: 'Très Haute Tension (THT)', en: 'Extra High Voltage (EHV)', defaultVal: '400 kV' },
  HV:  { fr: 'Haute Tension (HTB)',       en: 'High Voltage (HV)',       defaultVal: '225 kV' },
  MV:  { fr: 'Moyenne Tension (HTA)',     en: 'Medium Voltage (MV)',     defaultVal: '30 kV' },
  LV:  { fr: 'Basse Tension (BT)',        en: 'Low Voltage (LV)',        defaultVal: '400 V' },
  DC:  { fr: 'Courant Continu (DC)',      en: 'Direct Current (DC)',     defaultVal: 'DC' },
};

const DEFAULT_LEVEL_INFO = { fr: 'Niveau de Tension', en: 'Voltage Level', defaultVal: 'Tension' };

export const VoltageIndicator: React.FC<VoltageIndicatorProps> = ({
  level,
  voltageLevel,
  customText,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const effectiveLevel = level || voltageLevel || 'HV';
  const hex = VOLTAGE_COLORS[effectiveLevel] || '#F59E0B';
  const info = VOLTAGE_LABELS[effectiveLevel] || DEFAULT_LEVEL_INFO;
  const text = customText || info.defaultVal;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-0.5 gap-2 font-medium',
    lg: 'text-base px-3.5 py-1 gap-2.5 font-bold',
  }[size];

  return (
    <span
      role="status"
      aria-label={`${text} — ${info.fr}`}
      className={`inline-flex items-center rounded border border-[#374151] bg-[#111827] font-mono tracking-tight text-[#F9FAFB] ${sizeClasses} ${className}`}
      style={{
        borderLeftColor: hex,
        borderLeftWidth: '3px',
      }}
    >
      {showDot && (
        <span
          className="inline-block h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}88` }}
          aria-hidden="true"
        />
      )}
      <span style={{ color: hex }}>{text}</span>
    </span>
  );
};
