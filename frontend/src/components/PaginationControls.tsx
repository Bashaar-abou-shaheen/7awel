'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
}

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(target: number) {
    const clamped = Math.max(1, Math.min(totalPages, target));
    const params = new URLSearchParams(searchParams.toString());

    if (clamped > 1) params.set('page', String(clamped));
    else params.delete('page');

    const queryStr = params.toString();
    router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>
        Page <span className="text-slate-100">{page}</span> of{' '}
        <span className="text-slate-100">{totalPages}</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={!canPrev}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-borderSoft bg-surfaceSoft disabled:opacity-40.disabled:cursor-not-allowed hover:border-primary-500 hover:bg-primary-600/10 transition"
        >
          <ChevronLeft className="w-3 h-3" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={!canNext}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-borderSoft bg-surfaceSoft disabled:opacity-40.disabled:cursor-not-allowed hover:border-primary-500 hover:bg-primary-600/10 transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
