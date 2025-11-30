'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLoader from 'react-content-loader';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

type FavoriteItem = {
  id: string;
  title: string;
  merchant: string;
  rewardAmount: string;
  rewardCurrency: string;
  description: string;
  terms: string;
  thumbnailUrl: string;
  expiresAt: string;
  createdAt: string;
  isFavorite: boolean;
  daysUntilExpiry: number | null;
};

type FavoritesResponse = {
  active: FavoriteItem[];
  expired: FavoriteItem[];
  stats: {
    total: number;
    active: number;
    expired: number;
  };
};

const EMPTY_DATA: FavoritesResponse = {
  active: [],
  expired: [],
  stats: {
    total: 0,
    active: 0,
    expired: 0,
  },
};

// Skeleton loader
const SkeletonCard = () => (
  <ContentLoader
    uniqueKey="promo-skeleton-1"
    speed={2}
    width="100%"
    height={180}
    viewBox="0 0 400 180"
    backgroundColor="#f3f4f6"
    foregroundColor="#e5e7eb"
    className="rounded-xl"
  >
    <rect x="0" y="0" rx="12" ry="12" width="100%" height="180" />
  </ContentLoader>
);

export default function FavoritesPage() {
  const [data, setData] = useState<FavoritesResponse>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/promotions/favorites`, {
          cache: 'no-store',
        });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Error loading favorites', e);
        setData(EMPTY_DATA);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      {/* Header */}
      <header className="mb-6 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Favorites</h1>

        <div className="text-sm text-gray-500 space-x-4">
          <span>Total: {data.stats.total}</span>
          <span>Active: {data.stats.active}</span>
          <span>Expired: {data.stats.expired}</span>
        </div>
      </header>

      {/* Active Favorites */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active</h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data.active.length === 0 ? (
          <p className="text-gray-500">No active favorites yet.</p>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.active.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 hover:shadow-xl hover:scale-[1.02] transition-transform"
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {p.title}
                  </h3>
                  <p className="text-sm text-indigo-600">{p.merchant}</p>
                  <p className="text-sm font-medium">
                    Reward: {p.rewardAmount} {p.rewardCurrency}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-auto">
                    Expires in:{' '}
                    {p.daysUntilExpiry !== null
                      ? `${p.daysUntilExpiry} days`
                      : '—'}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>

      {/* Expired Favorites */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expired</h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data.expired.length === 0 ? (
          <p className="text-gray-500">No expired favorites.</p>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.expired.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-3 opacity-70 hover:shadow-md hover:scale-[1.02] transition-transform"
                >
                  <h3 className="font-semibold text-gray-700 text-lg">
                    {p.title}
                  </h3>
                  <p className="text-sm text-indigo-600">{p.merchant}</p>
                  <p className="text-sm font-medium">
                    Reward: {p.rewardAmount} {p.rewardCurrency}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="text-xs text-red-500 mt-auto font-medium">
                    Expired
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
