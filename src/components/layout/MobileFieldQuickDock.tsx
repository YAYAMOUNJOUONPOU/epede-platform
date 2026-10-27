// src/components/layout/MobileFieldQuickDock.tsx
import React from 'react';
import { Home, Compass, Calculator, Box } from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';

interface MobileFieldQuickDockProps {
  locale: 'fr' | 'en';
  currentView: string;
  onNavigateView: (view: string) => void;
  onOpenAssistant?: () => void;
  onOpenVisionInspector?: () => void;
  onOpenQrScanner?: () => void;
}

export const MobileFieldQuickDock: React.FC<MobileFieldQuickDockProps> = ({
  locale,
  currentView,
  onNavigateView,
}) => {
  const isFr = locale === 'fr';

  const handleAction = (action: () => void) => {
    soundEffects.playSwitchClick();
    action();
  };

  const navItems = [
    {
      id: 'home',
      href: '#/',
      label: isFr ? 'Accueil' : 'Home',
      icon: Home,
      isActive: currentView === 'home',
      action: () => onNavigateView('home')
    },
    {
      id: 'journey',
      href: '#/journey',
      label: isFr ? 'Apprendre' : 'Learn',
      icon: Compass,
      isActive: currentView === 'journey' || currentView === 'engineers-chain',
      action: () => onNavigateView('journey')
    },
    {
      id: 'calculators',
      href: '#/calculators',
      label: isFr ? 'Calculer' : 'Calculate',
      icon: Calculator,
      isActive: currentView === 'calculators',
      action: () => onNavigateView('calculators')
    },
    {
      id: 'equipment',
      href: '#/equipment',
      label: isFr ? 'Matériel' : 'Equipment',
      icon: Box,
      isActive: currentView === 'equipment' || currentView === 'equipment-reference',
      action: () => onNavigateView('equipment')
    }
  ];

  return (
    <nav
      id="mobile-core-dock"
      aria-label={isFr ? 'Navigation mobile principale' : 'Main mobile navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1 shadow-2xl safe-area-bottom"
    >
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  handleAction(item.action);
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none no-underline active:scale-95 ${
                item.isActive
                  ? 'text-cyan-400 bg-cyan-950/40 font-bold border border-cyan-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${item.isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[11px] font-sans font-medium tracking-tight leading-none">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
