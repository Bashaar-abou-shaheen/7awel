import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoriteAuditEvent } from './entities/favorite-audit-event.entity';
import { GetPromotionsQueryDto } from './dto/get-promotions-query.dto';


export interface PromotionViewModel {
    id: string;
    title: string;
    merchant: string;
    rewardAmount: string;
    rewardCurrency: string;
    description: string;
    terms: string;
    thumbnailUrl: string;
    expiresAt: Date;
    createdAt: Date;
    isFavorite: boolean;
    daysUntilExpiry: number | null;
}


@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepo: Repository<Promotion>,

        @InjectRepository(Favorite)
        private readonly favoriteRepo: Repository<Favorite>,

        @InjectRepository(FavoriteAuditEvent)
        private readonly auditRepo: Repository<FavoriteAuditEvent>,
    ) { }

    private calcDaysUntilExpiry(expiresAt: Date): number | null {
        if (!expiresAt) return null;
        const now = new Date();
        const diffMs = expiresAt.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.ceil(diffDays);
    }

    // ========== 1) GET /promotions ==========
    async getPromotions(userId: string, query: GetPromotionsQueryDto) {
        const { q, merchant, expiresBefore, limit, page } = query;

        const qb = this.promotionRepo.createQueryBuilder('p');

        if (q) {
            qb.andWhere(
                '(p.title LIKE :q OR p.merchant LIKE :q OR p.description LIKE :q)',
                { q: `%${q}%` },
            );
        }

        if (merchant) {
            qb.andWhere('p.merchant = :merchant', { merchant });
        }

        if (expiresBefore) {
            const date = new Date(expiresBefore);
            qb.andWhere('p.expiresAt <= :expiresBefore', { expiresBefore: date });
        }

        const take = limit ?? 20;
        const currentPage = page ?? 1;
        const skip = (currentPage - 1) * take;

        qb.orderBy('p.expiresAt', 'ASC')
            .addOrderBy('p.createdAt', 'DESC')
            .take(take)
            .skip(skip);

        const [promotions, total] = await qb.getManyAndCount();

        if (promotions.length === 0) {
            return {
                items: [],
                meta: {
                    total,
                    page: currentPage,
                    limit: take,
                    totalPages: 0,
                },
            };
        }

        const promotionIds = promotions.map((p) => p.id);

        const favorites = await this.favoriteRepo.find({
            where: { userId, promotionId: In(promotionIds) },
        });

        const favoriteIds = new Set(favorites.map((f) => f.promotionId));

        const items = promotions.map((p) => {
            const daysUntilExpiry = this.calcDaysUntilExpiry(p.expiresAt);

            return {
                id: p.id,
                title: p.title,
                merchant: p.merchant,
                rewardAmount: p.rewardAmount,
                rewardCurrency: p.rewardCurrency,
                description: p.description,
                terms: p.terms,
                thumbnailUrl: p.thumbnailUrl,
                expiresAt: p.expiresAt,
                createdAt: p.createdAt,
                isFavorite: favoriteIds.has(p.id),
                daysUntilExpiry,
            };
        });

        const totalPages = Math.ceil(total / take);

        return {
            items,
            meta: {
                total,
                page: currentPage,
                limit: take,
                totalPages,
            },
        };
    }

    // ========== 2) POST /promotions/:id/favorite ==========
    async favoritePromotion(userId: string, promotionId: string) {
        const promo = await this.promotionRepo.findOne({
            where: { id: promotionId },
        });
        if (!promo) {
            throw new NotFoundException('Promotion not found');
        }

        let favorite = await this.favoriteRepo.findOne({
            where: { userId, promotionId },
        });

        if (!favorite) {
            favorite = this.favoriteRepo.create({ userId, promotionId });
            await this.favoriteRepo.save(favorite);

            const auditEvent = this.auditRepo.create({
                userId,
                promotionId,
                action: 'FAVORITED',
            });
            await this.auditRepo.save(auditEvent);
        }

        return {
            promotionId,
            isFavorite: true,
        };
    }

    // ========== 3) DELETE /promotions/:id/favorite ==========
    async unFavoritePromotion(userId: string, promotionId: string) {
        const promo = await this.promotionRepo.findOne({
            where: { id: promotionId },
        });
        if (!promo) {
            throw new NotFoundException('Promotion not found');
        }

        const favorite = await this.favoriteRepo.findOne({
            where: { userId, promotionId },
        });

        if (favorite) {
            await this.favoriteRepo.remove(favorite);

            const auditEvent = this.auditRepo.create({
                userId,
                promotionId,
                action: 'UNFAVORITED',
            });
            await this.auditRepo.save(auditEvent);
        }

        return {
            promotionId,
            isFavorite: false,
        };
    }

    // ========== 4) GET /promotions/favorites ==========
    async getFavorites(userId: string) {
        const favorites = await this.favoriteRepo.find({
            where: { userId },
        });

        if (favorites.length === 0) {
            return {
                active: [],
                expired: [],
                stats: {
                    total: 0,
                    active: 0,
                    expired: 0,
                },
            };
        }

        const promotionIds = favorites.map((f) => f.promotionId);

        const promos = await this.promotionRepo.find({
            where: { id: In(promotionIds) },
            order: { expiresAt: 'ASC', createdAt: 'DESC' },
        });

        const now = new Date();

        const active: PromotionViewModel[] = [];
        const expired: PromotionViewModel[] = [];

        for (const p of promos) {
            const daysUntilExpiry = this.calcDaysUntilExpiry(p.expiresAt);
            const base = {
                id: p.id,
                title: p.title,
                merchant: p.merchant,
                rewardAmount: p.rewardAmount,
                rewardCurrency: p.rewardCurrency,
                description: p.description,
                terms: p.terms,
                thumbnailUrl: p.thumbnailUrl,
                expiresAt: p.expiresAt,
                createdAt: p.createdAt,
                isFavorite: true,
                daysUntilExpiry,
            };

            if (!p.expiresAt || p.expiresAt > now) {
                active.push(base);
            } else {
                expired.push(base);
            }
        }

        return {
            active,
            expired,
            stats: {
                total: active.length + expired.length,
                active: active.length,
                expired: expired.length,
            },
        };
    }

    async getPromotion(userId: string, id: string) {
        const promo = await this.promotionRepo.findOne({ where: { id } });

        if (!promo) {
            throw new NotFoundException('Promotion not found');
        }

        const favorite = await this.favoriteRepo.findOne({
            where: { userId, promotionId: id },
        });

        const daysUntilExpiry = this.calcDaysUntilExpiry(promo.expiresAt);

        console.log({
            id: promo.id,
            title: promo.title,
            merchant: promo.merchant,
            rewardAmount: promo.rewardAmount,
            rewardCurrency: promo.rewardCurrency,
            description: promo.description,
            terms: promo.terms,
            thumbnailUrl: promo.thumbnailUrl,
            expiresAt: promo.expiresAt,
            createdAt: promo.createdAt,
            isFavorite: !!favorite,
            daysUntilExpiry,
        });
        

        return {
            id: promo.id,
            title: promo.title,
            merchant: promo.merchant,
            rewardAmount: promo.rewardAmount,
            rewardCurrency: promo.rewardCurrency,
            description: promo.description,
            terms: promo.terms,
            thumbnailUrl: promo.thumbnailUrl,
            expiresAt: promo.expiresAt,
            createdAt: promo.createdAt,
            isFavorite: !!favorite,
            daysUntilExpiry,
        };
    }

}
