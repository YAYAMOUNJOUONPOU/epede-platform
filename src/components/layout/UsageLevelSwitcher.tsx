// src/components/layout/UsageLevelSwitcher.tsx
// EPEDE - Global Usage Level Switcher Pill
// Implements Priority #6

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, Cpu, ShieldAlert, Check } from 'lucide-react';
import { useUsageLevel, type UsageLevel } from '../../services/UsageLevelContext';

interface Props {
  locale: 'fr' | 'en';
}

export const UsageLevelSwitcher: React.FC<Props> = ({ locale }) => {
  const isFr = locale === 'fr';
  const { usageLevel, setUsageLevel } = useUsageLevel();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const LEVELS: Array<{
    id: UsageLevel;
    labelFr: string;
    labelEn: string;
    subFr: string;
    subEn: string;
    icon: React.ReactNode;
    color: string;
    pillBg: string;
  }> = [
    {
      id: 'DISCOVERY',
      labelFr: 'Découverte',
      labelEn: 'Discovery',
      subFr: 'Sans jargon, schémas clairs & principes fondamentaux',
      subEn: 'Jargon-free, clear schematics & core physics',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'text-emerald-300',
      pillBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'TECHNICAL',
      labelFr: 'Technique',
      labelEn: 'Technical',
      subFr: 'Équations, courbes TCC & normes CEI/IEEE',
      subEn: 'Equations, TCC curves & IEC/IEEE standards',
      icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'text-cyan-300',
      pillBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
    },
    {
      id: 'ENGINEERING',
      labelFr: 'Exploitation & Ingénierie',
      labelEn: 'Grid Ops & Engineering',
      subFr: 'Horodatage SOE 10 ms, télémesures SCADA & analyses pannes',
      subEn: 'Millisecond SOE logs, SCADA telemetry & disturbance analysis',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
      color: 'text-purple-300',
      pillBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300'
    }
  ];

  const currentDef = LEVELS.find((l) => l.id === usageLevel) || LEVELS[1];

  return (
    <div ref={containerRef} className="relative z-40">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shadow-xs ${currentDef.pillBg} hover:brightness-125`}
        title={isFr ? 'Changer le niveau d’usage de la plateforme' : 'Change platform engineering depth level'}
      >
        {currentDef.icon}
        <span className="hidden md:inline">{isFr ? currentDef.labelFr : currentDef.labelEn}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl p-2 space-y-1 backdrop-blur-xl font-mono text-xs"
          >
            <div className="px-2.5 py-1.5 border-b border-white/5 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              {isFr ? 'Niveau d’Usage EPEDE :' : 'EPEDE Usage Depth:'}
            </div>

            {LEVELS.map((lvl) => {
              const isSelected = lvl.id === usageLevel;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setUsageLevel(lvl.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                    isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {lvl.icon}
                      <span className={`font-bold ${lvl.color}`}>
                        {isFr ? lvl.labelFr : lvl.labelEn}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans leading-tight">
                      {isFr ? lvl.subFr : lvl.subEn}
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
