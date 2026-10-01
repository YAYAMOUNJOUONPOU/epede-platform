// src/components/ui/StandardBadge.tsx
import React from 'react';

interface StandardBadgeProps {
  reference: string;
  title?: string;
  onClick?: () => void;
  className?: string;
}

export const StandardBadge: React.FC<StandardBadgeProps> = ({
  reference,
  title,
  onClick,
  className = '',
}) => {
  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded border border-[#374151] bg-[#111827] px-2.5 py-1 text-xs font-mono font-semibold text-[#D97706] hover:border-[#D97706] hover:bg-[#1F2937] transition-all cursor-pointer ${className}`}
      title={title || reference}
    >
      <span className="text-[#9CA3AF] text-[10px]">📋</span>
      <span>{reference}</span>
    </span>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="text-left focus:outline-none">
        {content}
      </button>
    );
  }

  return content;
};
