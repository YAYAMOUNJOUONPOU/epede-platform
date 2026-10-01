// src/components/equipment/EdgeGraph.tsx
import React from 'react';
import type { Edge, RelationType } from '../../types/epede';

interface EdgeGraphProps {
  edges: Edge[];
  locale: 'fr' | 'en';
  onSelectNode?: (targetId: string, targetType: string) => void;
  className?: string;
}

const RELATION_ICONS: Record<RelationType, string> = {
  feeds: '⚡→',
  protects: '🛡→',
  measures: '📊→',
  controls: '🎛→',
  supervises: '👁→',
  communicates_with: '📡↔',
  monitors: '📈→',
  part_of: '🧩→',
  documented_by: '📋→',
  located_at: '📍→',
  requires_fire_suppression: '🔥→',
  enables: '🔑→',
  implemented_by: '👷→',
  governed_by: '🏛→',
  performed_by: '⚙️→',
  contains: '📦→',
  supplies: '⚡→',
  connects_to: '🔗↔',
  transforms: '🔄→',
  communicates_through: '🌐↔',
  used_during: '⏳→',
  produces: '📄→',
  maintained_by: '🔧→',
  applies_in: '🌍→',
};

export const EdgeGraph: React.FC<EdgeGraphProps> = ({
  edges,
  locale,
  onSelectNode,
  className = '',
}) => {
  return (
    <div className={`rounded-lg border border-[#374151] bg-[#111827] overflow-hidden ${className}`}>
      <div className="border-b border-[#374151] px-4 py-3 bg-[#0A1628]/50 flex items-center justify-between">
        <h3 className="font-space font-bold text-sm text-[#F9FAFB] tracking-wide flex items-center gap-2">
          <span className="text-[#D97706]">◈</span>
          {locale === 'fr' ? 'GRAPH DE RELATIONS & INTERCONNEXIONS' : 'RELATION GRAPH & INTERCONNECTIONS'}
        </h3>
        <span className="font-mono text-xs text-[#6B7280]">
          {edges.length} {locale === 'fr' ? 'liaisons typées' : 'typed relations'}
        </span>
      </div>

      <div className="p-3 divide-y divide-[#1F2937]">
        {edges.map((edge) => {
          const icon = RELATION_ICONS[edge.relation] || '→';
          return (
            <div
              key={edge.id}
              className="py-2.5 px-2 hover:bg-[#1F2937]/50 rounded transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-sm text-[#D97706] font-bold shrink-0">
                  {icon}
                </span>
                <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[#0A1628] text-[#9CA3AF] border border-[#374151] shrink-0">
                  {edge.relation}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectNode?.(edge.target_id, edge.target_type)}
                  className="font-medium text-sm text-[#F9FAFB] hover:text-[#D97706] transition-colors truncate text-left underline decoration-[#374151] hover:decoration-[#D97706]"
                >
                  {edge.target_name}
                </button>
              </div>

              {(edge.notes_fr || edge.notes_en) && (
                <span className="text-xs text-[#6B7280] sm:text-right italic shrink-0 max-w-xs truncate">
                  {locale === 'fr' ? edge.notes_fr : edge.notes_en}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
