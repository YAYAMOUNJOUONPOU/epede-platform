// src/components/layout/MobileFieldQuickDock.tsx
// Restrained Mobile Bottom Dock with >=44px targets and safe-area support

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
      href: isFr ? '#/' : '#/en/',
      label: isFr ? 'Accueil' : 'Home',
      icon: Home,
      isActive: currentView === 'home',
      action: () => onNavigateView('home'),
    },
    {
      id: 'journey',
      href: isFr ? '#/systemes-electriques' : '#/en/electrical-systems',
      label: isFr ? 'Systèmes' : 'Systems',
      icon: Compass,
      isActive: currentView === 'journey' || currentView === 'thematic-journeys',
      action: () => onNavigateView('journey'),
    },
    {
      id: 'calculators',
      href: isFr ? '#/calculateurs' : '#/en/calculators',
      label: isFr ? 'Calculs' : 'Calculators',
      icon: Calculator,
      isActive: currentView === 'calculators',
      action: () => onNavigateView('calculators'),
    },
    {
      id: 'equipment',
      href: isFr ? '#/materiel' : '#/en/equipment',
      label: isFr ? 'Matériel' : 'Equipment',
      icon: Box,
      isActive:
        currentView === 'equipment-list' ||
        currentView === 'equipment' ||
        currentView === 'equipment-reference',
      action: () => onNavigateView('equipment-list'),
    },
  ];

  return (
    <nav
      id="mobile-core-dock"
      aria-label={isFr ? 'Accès rapide mobile' : 'Mobile quick destinations'}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/96 backdrop-blur-md border-t border-[#DEDACF] px-2 py-1 safe-area-bottom"
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
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-lg transition-colors select-none no-underline ${
                item.isActive
                  ? 'text-[#147C78] font-bold bg-[#E3EFEC]/70'
                  : 'text-[#5C6C70] hover:text-[#17282C]'
              }`}
            >
              <Icon
                className={`h-4 w-4 mb-0.5 ${
                  item.isActive ? 'text-[#147C78]' : 'text-[#5C6C70]'
                }`}
              />
              <span className="text-[11px] font-sans leading-none">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
