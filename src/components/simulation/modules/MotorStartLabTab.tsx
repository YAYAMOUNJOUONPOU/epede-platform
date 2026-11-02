// src/components/simulation/modules/MotorStartLabTab.tsx
// EPEDE Layer 04 (Simulation Lab) - Industrial Motor Starting & Electrodynamics
// Directly powered by IndustrialMotorDynamicSimulator & IndustrialMotorDynamicsEngine

import React from 'react';
import { IndustrialMotorDynamicSimulator } from './IndustrialMotorDynamicSimulator';

interface MotorStartLabTabProps {
  locale: 'fr' | 'en';
}

export const MotorStartLabTab: React.FC<MotorStartLabTabProps> = ({ locale }) => {
  return <IndustrialMotorDynamicSimulator locale={locale} initialPresetId="nachtigal-raw-water" />;
};
