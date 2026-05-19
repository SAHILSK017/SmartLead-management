import React from 'react';
import { LeadSource, LeadStatus } from '../../types';

type BadgeVariant = LeadStatus | LeadSource | string;

const variantMap: Record<string, string> = {
  // Status
  new:        'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-glow-blue',
  contacted:  'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30 shadow-glow-yellow',
  qualified:  'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-glow-green',
  lost:       'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30 shadow-glow-red',
  // Source
  website:    'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30',
  instagram:  'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30',
  referral:   'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30',
};

interface BadgeProps {
  value: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ value, className = '' }) => {
  const colorClass =
    variantMap[value] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide',
        colorClass,
        className,
      ].join(' ')}
    >
      {value}
    </span>
  );
};
