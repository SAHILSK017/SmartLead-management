import React from 'react';
import { Button } from '../ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing page <span className="font-medium text-slate-700 dark:text-slate-200">{page}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{totalPages}</span>{' '}
        &middot; {total} total leads
      </p>
      <div className="flex items-center gap-2">
        <Button
          id="pagination-prev"
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              id={`pagination-page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={[
                'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                page === pageNum
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              {pageNum}
            </button>
          );
        })}
        <Button
          id="pagination-next"
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};
