// src/services/UsageLevelContext.tsx
// EPEDE - Global Multi-Level Usage Engine
// Implements Priority #6: 3 Usage Levels (Découverte, Technique, Exploitation & Ingénierie)

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UsageLevel = 'DISCOVERY' | 'TECHNICAL' | 'ENGINEERING';

interface UsageLevelContextValue {
  usageLevel: UsageLevel;
  setUsageLevel: (level: UsageLevel) => void;
  isDiscovery: boolean;
  isTechnical: boolean;
  isEngineering: boolean;
  levelMeta: {
    labelFr: string;
    labelEn: string;
    badgeColor: string;
    tag: string;
    descFr: string;
    descEn: string;
  };
}

const LEVEL_META: Record<
  UsageLevel,
  { labelFr: string; labelEn: string; badgeColor: string; tag: string; descFr: string; descEn: string }
> = {
  DISCOVERY: {
    labelFr: 'Découverte',
    labelEn: 'Discovery',
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
    tag: 'NIVEAU 1',
    descFr: 'Vue simplifiée, schémas synoptiques clairs et pédagogie sans jargon pour débuter.',
    descEn: 'Simplified views, clear synoptic diagrams, and jargon-free fundamentals.'
  },
  TECHNICAL: {
    labelFr: 'Technique',
    labelEn: 'Technical',
    badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40',
    tag: 'NIVEAU 2',
    descFr: 'Équations physiques, courbes TCC, grandeurs assignées et normes CEI/IEEE.',
    descEn: 'Physical equations, TCC curves, rated parameters, and IEC/IEEE standards.'
  },
  ENGINEERING: {
    labelFr: 'Exploitation & Ingénierie',
    labelEn: 'Engineering & Grid Ops',
    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/40',
    tag: 'NIVEAU 3',
    descFr: 'Horodatage SOE au milliseconde, télémesures SCADA, incidents réseau et calculs experts.',
    descEn: 'Millisecond SOE sequence of events, SCADA telemetry, incident replays, and expert analysis.'
  }
};

const UsageLevelContext = createContext<UsageLevelContextValue | undefined>(undefined);

export const UsageLevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usageLevel, setUsageLevelState] = useState<UsageLevel>(() => {
    try {
      const stored = localStorage.getItem('epede_usage_level');
      if (stored === 'DISCOVERY' || stored === 'TECHNICAL' || stored === 'ENGINEERING') {
        return stored;
      }
    } catch {
      // localStorage may fail in private mode
    }
    return 'TECHNICAL';
  });

  const setUsageLevel = (level: UsageLevel) => {
    setUsageLevelState(level);
    try {
      localStorage.setItem('epede_usage_level', level);
    } catch {
      // ignore
    }
  };

  const value: UsageLevelContextValue = {
    usageLevel,
    setUsageLevel,
    isDiscovery: usageLevel === 'DISCOVERY',
    isTechnical: usageLevel === 'TECHNICAL',
    isEngineering: usageLevel === 'ENGINEERING',
    levelMeta: LEVEL_META[usageLevel]
  };

  return <UsageLevelContext.Provider value={value}>{children}</UsageLevelContext.Provider>;
};

export const useUsageLevel = (): UsageLevelContextValue => {
  const ctx = useContext(UsageLevelContext);
  if (!ctx) {
    // Return safe fallback if used outside provider
    return {
      usageLevel: 'TECHNICAL',
      setUsageLevel: () => {},
      isDiscovery: false,
      isTechnical: true,
      isEngineering: false,
      levelMeta: LEVEL_META.TECHNICAL
    };
  }
  return ctx;
};
