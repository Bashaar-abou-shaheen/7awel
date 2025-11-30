'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLoader from 'react-content-loader';

import { getPromotions } from '@/lib/api';
import { Promotion } from '@/types/promotion';
import { PromotionCard } from '@/components/PromotionCard';
import { PromotionsToolbar } from '@/components/PromotionsToolbar';

type Meta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

const ITEMS_PER_PAGE = 6;

const DEFAULT_META: Meta = {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
};

// Skeleton Card Loader
const SkeletonCard = () => (
    <ContentLoader
        uniqueKey="promo-skeleton-1"
        speed={2}
        width="100%"
        height={160}
        viewBox="0 0 400 160"
        backgroundColor="#f3f4f6"
        foregroundColor="#e5e7eb"
        className="rounded-xl"
    >
        <rect x="0" y="0" rx="12" ry="12" width="100%" height="160" />
    </ContentLoader>
);

export default function PromotionsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [items, setItems] = useState<Promotion[]>([]);
    const [meta, setMeta] = useState<Meta>(DEFAULT_META);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');
        const q = searchParams.get('q') ?? '';
        const merchant = searchParams.get('merchant') ?? '';
        const expiresBefore = searchParams.get('expiresBefore') ?? '';

        const page = pageParam ? Number(pageParam) : 1;
        const limit = limitParam ? Number(limitParam) : ITEMS_PER_PAGE;

        setLoading(true);
        setError(null);

        getPromotions({ page, limit, q, merchant, expiresBefore })
            .then((res) => {
                setItems(res.items);
                setMeta(res.meta);
            })
            .catch((err) => {
                console.error('getPromotions error:', err);
                setError(err.message || 'Failed to load promotions');
                setItems([]);
                setMeta(DEFAULT_META);
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

    const currentQ = searchParams.get('q') ?? '';
    const currentMerchant = searchParams.get('merchant') ?? '';

    const goToPage = (page: number) => {
        if (page < 1 || (meta.totalPages && page > meta.totalPages)) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        params.set('limit', String(ITEMS_PER_PAGE));

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 flex">
            <main className="flex-1 p-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold mb-1 text-gray-800">Promotions</h1>
                    <p className="text-sm text-gray-500">
                        Total: {meta.total} — Page {meta.page} / {meta.totalPages || 1}
                    </p>
                </header>

                <div className="mb-6">
                    <PromotionsToolbar
                        initialSearch={currentQ}
                        initialMerchant={currentMerchant}
                        meta={meta}
                    />
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500 text-center py-8">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                        No promotions found with current filters.
                    </p>
                ) : (
                    <AnimatePresence>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((promo: Promotion) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PromotionCard promo={promo} />
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {meta.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center text-sm text-gray-700 space-x-4">
                        <button
                            onClick={() => goToPage(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        <div className="flex items-center space-x-2">
                            {Array.from({ length: meta.totalPages }).map((_, idx) => {
                                const pageNumber = idx + 1;
                                const isActive = pageNumber === meta.page;

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => goToPage(pageNumber)}
                                        className={`px-3 py-1 rounded-lg border text-sm ${
                                            isActive
                                                ? 'bg-indigo-500 text-white border-indigo-500'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                            className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
