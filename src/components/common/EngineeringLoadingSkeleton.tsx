// src/components/common/EngineeringLoadingSkeleton.tsx
// EPEDE Branded Engineering Suspense Loading Fallback
import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';

interface EngineeringLoadingSkeletonProps {
  locale?: 'fr' | 'en';
  message?: string;
}

export const EngineeringLoadingSkeleton: React.FC<EngineeringLoadingSkeletonProps> = ({
  locale = 'fr',
  message
}) => {
  const isFr = locale === 'fr';

  return (
    <div 
      className="w-full min-h-[420px] rounded-2xl border border-[#1E293B]/80 bg-[#0A0F1D]/80 backdrop-blur-md p-8 flex flex-col items-center justify-center relative overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label={message || (isFr ? 'Chargement du module d\'ingénierie...' : 'Loading engineering module...')}
    >
      {/* Background Animated CAD Grid Line */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

      {/* Futuristic Center Scanner Indicator */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer Pulsing Rings */}
        <div className="absolute w-20 h-20 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
        <div className="absolute w-16 h-16 rounded-full border border-sky-400/30 animate-pulse" />
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <Activity className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-amber-400/60">
          <Zap className="w-2.5 h-2.5 text-amber-400" />
        </div>
      </div>

      {/* Loading Status Text & Telemetry Badges */}
      <div className="text-center space-y-2 relative z-10 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{isFr ? 'EPEDE • MOTEUR DE CALCUL EN LIGNE' : 'EPEDE • ONLINE COMPUTING CORE'}</span>
        </div>
        <h3 className="text-base font-bold font-mono text-white tracking-wide">
          {message || (isFr ? 'Initialisation du Module Haute Fidélité...' : 'Initializing High-Fidelity Module...')}
        </h3>
        <p className="text-xs text-slate-400 font-sans">
          {isFr
            ? 'Résolution des graphes topologiques CEI, modèles de calculs et jumeaux numériques...'
            : 'Resolving IEC topological graphs, calculation models, and digital twins...'}
        </p>
      </div>

      {/* Skeleton Wireframe Bars */}
      <div className="w-full max-w-md mt-8 space-y-2.5 opacity-60">
        <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-transparent via-cyan-400 to-transparent w-1/3 animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="flex gap-2">
          <div className="h-2 w-2/3 bg-slate-800/60 rounded-full" />
          <div className="h-2 w-1/3 bg-slate-800/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
