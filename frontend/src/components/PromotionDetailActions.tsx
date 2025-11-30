'use client';

import { useState, useTransition } from 'react';
import { Share2, Star } from 'lucide-react';
import { Promotion } from '@/types/promotion';
import { favoritePromotion, unFavoritePromotion } from '@/lib/api';
import { showError, showSuccess } from '@/lib/toast';

type Props = {
  promo: Promotion;
};

export function PromotionDetailActions({ promo }: Props) {
  const [optimistic, setOptimistic] = useState(promo);
  const [isPending, startTransition] = useTransition();

  async function handleToggleFavorite() {
    const newValue = !optimistic.isFavorite;
    const oldValue = optimistic.isFavorite;

    setOptimistic(prev => ({ ...prev, isFavorite: newValue }));

    startTransition(async () => {
      try {
        if (newValue) {
          await favoritePromotion(optimistic.id);
          showSuccess('Added to favorites');
        } else {
          await unFavoritePromotion(optimistic.id);
          showSuccess('Removed from favorites');
        }
      } catch (e: any) {
        setOptimistic(prev => ({ ...prev, isFavorite: oldValue }));
        showError(e?.message ?? 'Error updating favorite');
      }
    });
  }

  async function handleShare() {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: optimistic.title,
          text: `Check this promotion from ${optimistic.merchant}`,
          url: shareUrl,
        });
      } catch {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link copied to clipboard');
      } catch {
        showError('Failed to copy link');
      }
    } else {
      showError('Sharing is not supported in this browser');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        disabled={isPending}
        className={
          'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border shadow-sm transition ' +
          (optimistic.isFavorite
            ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
            : 'bg-white/10 backdrop-blur border-borderSoft text-gray-100 hover:bg-indigo-600/20')
        }
      >
        <Star
          className={
            'w-4 h-4 transition ' +
            (optimistic.isFavorite ? 'fill-yellow-300 text-yellow-300' : 'text-gray-300')
          }
        />
        <span>{optimistic.isFavorite ? 'Saved' : 'Save'}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-borderSoft bg-white/10 backdrop-blur text-gray-100 hover:bg-indigo-600/20 transition shadow-sm"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
