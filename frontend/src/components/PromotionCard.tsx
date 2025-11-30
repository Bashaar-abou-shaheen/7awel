'use client';

import { useState, useTransition } from 'react';
import { Promotion } from '@/types/promotion';
import { favoritePromotion, unFavoritePromotion } from '@/lib/api';
import Link from 'next/link';

interface PromotionCardProps {
  promo: Promotion;
  onChange?: (updated: Promotion) => void;
}

export function PromotionCard({ promo, onChange }: PromotionCardProps) {
  const [optimistic, setOptimistic] = useState(promo);
  const [isPending, startTransition] = useTransition();

  const isExpired =
    optimistic.expiresAt && new Date(optimistic.expiresAt) < new Date();

  async function toggleFavorite() {
    const newValue = !optimistic.isFavorite;

    // Optimistic UI
    setOptimistic((prev) => ({ ...prev, isFavorite: newValue }));

    startTransition(async () => {
      try {
        if (newValue) {
          await favoritePromotion(optimistic.id);
        } else {
          await unFavoritePromotion(optimistic.id);
        }
        onChange?.({ ...optimistic, isFavorite: newValue });
      } catch (e) {
        setOptimistic((prev) => ({ ...prev, isFavorite: !newValue }));
        console.error(e);
      }
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row gap-4 hover:shadow-lg transition-transform transform hover:scale-[1.02]">
      

      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800 text-base md:text-lg">
              <Link
                href={`/promotions/${optimistic.id}`}
                className="hover:underline underline-offset-2"
              >
                {optimistic.title}
              </Link>
            </h3>
            <p className="text-sm text-indigo-600">{optimistic.merchant}</p>
          </div>

          <button
            onClick={toggleFavorite}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
              optimistic.isFavorite
                ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{optimistic.isFavorite ? '★' : '☆'}</span>
            <span className="text-sm">
              {optimistic.isFavorite ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {optimistic.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 pt-1">
          <span>
            Reward:{' '}
            <b className="text-gray-800">
              {optimistic.rewardAmount} {optimistic.rewardCurrency}
            </b>
          </span>
          <span
            className={`font-medium ${
              isExpired ? 'text-red-500' : 'text-emerald-500'
            }`}
          >
            {isExpired
              ? 'Expired'
              : optimistic.daysUntilExpiry != null
              ? `${optimistic.daysUntilExpiry} days left`
              : 'No expiry'}
          </span>
        </div>
      </div>
    </div>
  );
}
