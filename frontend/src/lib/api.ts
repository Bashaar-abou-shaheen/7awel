import { Promotion, FavoritesResponse, PromotionsListResponse } from '@/types/promotion';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let message = `Request failed with ${res.status}`;
        try {
            const data = await res.json();
            if (data?.message) message = data.message;
        } catch (_) { }
        throw new Error(message);
    }
    return res.json();
}
export async function getPromotions(params?: {
  page?: number;
  limit?: number;
  q?: string;
  merchant?: string;
  expiresBefore?: string; // صيغة YYYY-MM-DD من input[type="date"]
}): Promise<PromotionsListResponse> {
  const search = new URLSearchParams();

  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.q) search.set('q', params.q);
  if (params?.merchant) search.set('merchant', params.merchant);
  if (params?.expiresBefore) search.set('expiresBefore', params.expiresBefore);

  const url =
    search.toString().length > 0
      ? `${API_BASE_URL}/promotions?${search.toString()}`
      : `${API_BASE_URL}/promotions`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  return handleResponse<PromotionsListResponse>(res);
}

export async function getFavorites(): Promise<FavoritesResponse> {
    const res = await fetch(`${API_BASE_URL}/promotions/favorites`, {
        next: { revalidate: 0 },
    });
    return handleResponse<FavoritesResponse>(res);
}

export async function favoritePromotion(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/promotions/${id}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    await handleResponse(res);
}

export async function unFavoritePromotion(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/promotions/${id}/favorite`, {
        method: 'DELETE',
    });
    await handleResponse(res);
}

export async function getPromotionById(id: string): Promise<Promotion> {
    console.log('fetching id:', id)
  const url = `${API_BASE_URL}/promotions/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse<Promotion>(res);
}