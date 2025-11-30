export interface Promotion {
  id: string;
  title: string;
  merchant: string;
  rewardAmount: number | string; 
  rewardCurrency: string;
  description: string;
  terms: string;
  thumbnailUrl: string;
  expiresAt: string;
  createdAt: string;
  isFavorite: boolean;
  daysUntilExpiry: number | null;
}

export interface PromotionsListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PromotionsListResponse {
  items: Promotion[];
  meta: PromotionsListMeta;
}


export interface FavoritesResponse {
  active: Promotion[];
  expired: Promotion[];
  stats: {
    total: number;
    active: number;
    expired: number;
  };
}
