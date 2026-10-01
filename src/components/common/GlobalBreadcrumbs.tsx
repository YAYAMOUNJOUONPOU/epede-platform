// src/components/common/GlobalBreadcrumbs.tsx
// Hierarchical engineering breadcrumb navigator: System Chain Stage > Domain > Bay / Subsystem > Equipment

import React from 'react';
import { ChevronRight, Home, Zap, Layers, Cpu, ArrowRight } from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import { DOMAINS } from '../../data/epedeData';

export interface BreadcrumbItem {
  id: string;
  label: string;
  type: 'HOME' | 'STAGE' | 'DOMAIN' | 'BAY' | 'EQUIPMENT' | 'TOOL' | 'STANDARD';
  onClick?: () => void;
  active?: boolean;
}

interface GlobalBreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: 'fr' | 'en';
}

export const GlobalBreadcrumbs: React.FC<GlobalBreadcrumbsProps> = ({ items, locale }) => {
  if (!items || items.length <= 1) return null;

  return (
    <nav 
      aria-label="Engineering Hierarchy Breadcrumb" 
      className="w-full flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md font-mono text-xs text-slate-400 overflow-x-auto shadow-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 select-none" />
            )}
            
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 font-medium group"
              >
                {item.type === 'HOME' && <Home className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />}
                {item.type === 'STAGE' && <Zap className="w-3 h-3 text-amber-400" />}
                {item.type === 'DOMAIN' && <Layers className="w-3 h-3 text-sky-400" />}
                {item.type === 'EQUIPMENT' && <Cpu className="w-3 h-3 text-emerald-400" />}
                <span>{item.label}</span>
              </button>
            ) : (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded shrink-0 ${
                isLast ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20' : 'text-slate-400'
              }`}>
                {item.type === 'EQUIPMENT' && <Cpu className="w-3 h-3 text-amber-400" />}
                <span className="truncate max-w-[240px]">{item.label}</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
