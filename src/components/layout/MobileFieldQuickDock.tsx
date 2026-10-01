// src/components/layout/MobileFieldQuickDock.tsx
import React from 'react';
import { 
  Box, 
  Calculator, 
  Activity, 
  Camera, 
  Bot, 
  Layers, 
  Compass,
  CheckSquare,
  QrCode
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';

interface MobileFieldQuickDockProps {
  locale: 'fr' | 'en';
  currentView: string;
  onNavigateView: (view: string) => void;
  onOpenAssistant: () => void;
  onOpenVisionInspector?: () => void;
  onOpenQrScanner?: () => void;
}

export const MobileFieldQuickDock: React.FC<MobileFieldQuickDockProps> = ({
  locale,
  currentView,
  onNavigateView,
  onOpenAssistant,
  onOpenVisionInspector,
  onOpenQrScanner
}) => {
  const isFr = locale === 'fr';

  const handleAction = (action: () => void) => {
    soundEffects.playSwitchClick();
    action();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Reference / Equipment */}
        <button
          type="button"
          onClick={() => handleAction(() => onNavigateView('equipment-reference'))}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
            currentView === 'equipment-reference'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="h-5 w-5" />
          <span className="text-[10px] font-mono leading-none">
            {isFr ? 'Matériel' : 'Apparatus'}
          </span>
        </button>

        {/* Calculators */}
        <button
          type="button"
          onClick={() => handleAction(() => onNavigateView('calculators'))}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
            currentView === 'calculators'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="h-5 w-5" />
          <span className="text-[10px] font-mono leading-none">
            {isFr ? 'Calculs' : 'Calc'}
          </span>
        </button>

        {/* SLD Diagram */}
        <button
          type="button"
          onClick={() => handleAction(() => onNavigateView('diagrams'))}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
            currentView === 'diagrams'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-5 w-5" />
          <span className="text-[10px] font-mono leading-none">
            {isFr ? 'Schéma' : 'SLD'}
          </span>
        </button>

        {/* QR Code Equipment Scanner */}
        {onOpenQrScanner && (
          <button
            type="button"
            onClick={() => handleAction(onOpenQrScanner)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
            title={isFr ? 'Scanner QR Code Matériel' : 'Scan QR Nameplate'}
          >
            <div className="relative">
              <QrCode className="h-5 w-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-[10px] font-mono leading-none text-emerald-300">
              {isFr ? 'Scan QR' : 'QR Scan'}
            </span>
          </button>
        )}

        {/* Camera / AI Inspector */}
        {onOpenVisionInspector && (
          <button
            type="button"
            onClick={() => handleAction(onOpenVisionInspector)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition-all"
            title={isFr ? 'Scanner une plaque signalétique' : 'Scan equipment nameplate'}
          >
            <div className="relative">
              <Camera className="h-5 w-5 text-purple-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple-500 animate-ping" />
            </div>
            <span className="text-[10px] font-mono leading-none text-purple-300">
              {isFr ? 'Scan Plaque' : 'AI Scan'}
            </span>
          </button>
        )}

        {/* AI Engineering Assistant */}
        <button
          type="button"
          onClick={() => handleAction(onOpenAssistant)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-all"
        >
          <Bot className="h-5 w-5 text-amber-400" />
          <span className="text-[10px] font-mono leading-none text-amber-300">
            {isFr ? 'Guide IA' : 'AI Assist'}
          </span>
        </button>
      </div>
    </div>
  );
};
