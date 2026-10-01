// src/components/epede/SceneConduitConnector.tsx
// Visual electrical energy conduit line connecting continuous scenes
import React from 'react';
import { Zap, ArrowDown } from 'lucide-react';

interface SceneConduitConnectorProps {
  upstreamVoltage: string;
  downstreamVoltage: string;
  transformationLabel?: string;
  isTransformationNode?: boolean;
}

export const SceneConduitConnector: React.FC<SceneConduitConnectorProps> = ({
  upstreamVoltage,
  downstreamVoltage,
  transformationLabel,
  isTransformationNode = false,
}) => {
  return (
    <div className="relative py-4 flex flex-col items-center justify-center my-2 select-none pointer-events-none" aria-hidden="true">
      {/* Vertical Animated Luminous Energy Conduit */}
      <div className="relative h-16 sm:h-20 w-1 bg-slate-800 flex items-center justify-center overflow-hidden rounded-full">
        {/* Glowing moving energy pulse */}
        <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" />
        <div 
          className="absolute w-2 h-8 rounded-full bg-cyan-300 blur-[2px] animate-bounce" 
          style={{ animationDuration: '2s' }} 
        />
      </div>

      {/* Inter-stage voltage status badge */}
      <div className="my-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-slate-300 shadow-xl flex items-center gap-2 pointer-events-auto">
        <Zap className="h-3 w-3 text-amber-400 shrink-0" />
        <span className="text-slate-400">{upstreamVoltage}</span>
        <span className="text-cyan-400 font-bold">→</span>
        <span className="text-amber-400 font-bold">{downstreamVoltage}</span>
        {transformationLabel && (
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[9px] border border-amber-500/30">
            {transformationLabel}
          </span>
        )}
      </div>

      <div className="relative h-4 w-1 bg-slate-800 rounded-full" />
    </div>
  );
};
