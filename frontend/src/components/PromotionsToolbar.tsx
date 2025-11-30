'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface PromotionsToolbarProps {
  initialSearch?: string;
  initialMerchant?: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function PromotionsToolbar({
  initialSearch = '',
  initialMerchant = '',
  meta,
}: PromotionsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [merchant, setMerchant] = useState(initialMerchant);

  useEffect(() => {
    const qParam = searchParams.get('q') ?? '';
    const merchantParam = searchParams.get('merchant') ?? '';

    setSearch(qParam);
    setMerchant(merchantParam);
  }, [searchParams]);

  function updateQuery(next: { q?: string; merchant?: string; page?: number }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q);
      else params.delete('q');
    }

    if (next.merchant !== undefined) {
      if (next.merchant) params.set('merchant', next.merchant);
      else params.delete('merchant');
    }

    if (next.page !== undefined) {
      if (next.page > 1) params.set('page', String(next.page));
      else params.delete('page');
    } else {
      params.delete('page');
    }

    const queryStr = params.toString();
    router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({ q: search, merchant, page: 1 });
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Form */}
      <form onSubmit={onSubmit} className="flex-1 flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promotions..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Merchant Input */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <Filter className="w-5 h-5 text-gray-400" />
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Merchant"
            className="bg-transparent text-sm text-gray-800 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-sm text-white hover:bg-indigo-500 transition-shadow shadow-sm hover:shadow-md"
        >
          Apply
        </button>
      </form>

      {/* Meta Info */}
      <div className="text-sm text-gray-500 mt-2 md:mt-0">
        <span className="font-medium text-gray-700">{meta.total}</span> results · page{' '}
        {meta.page} of {meta.totalPages}
      </div>
    </div>
  );
}
