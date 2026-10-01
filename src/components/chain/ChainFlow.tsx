// src/components/chain/ChainFlow.tsx
// Delegated canonical wrapper to InteractiveChainFlowSchematic
import React from 'react';
import type { DomainCode } from '../../types/epede';
import { InteractiveChainFlowSchematic } from '../engineers/InteractiveChainFlowSchematic';

export interface ChainFlowProps {
  locale: 'fr' | 'en';
  activeDomain?: DomainCode | null;
  onSelectDomain: (code: DomainCode) => void;
}

export const ChainFlow: React.FC<ChainFlowProps> = ({
  locale,
  activeDomain,
  onSelectDomain,
}) => {
  return (
    <InteractiveChainFlowSchematic
      locale={locale}
      activeDomainId={activeDomain || 'D01'}
      onSelectDomain={(id) => onSelectDomain(id as DomainCode)}
      onNavigateDomain={onSelectDomain}
    />
  );
};

export default ChainFlow;
