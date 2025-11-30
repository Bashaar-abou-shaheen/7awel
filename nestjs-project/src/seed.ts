import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promotion } from './promotions/entities/promotion.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const promotionRepo = app.get(getRepositoryToken(Promotion));

    await promotionRepo.clear();

    const promos: Partial<Promotion>[] = [
        {
            id: '1',
            title: '10% off at Starbucks',
            merchant: 'Starbucks',
            rewardAmount: '10',
            rewardCurrency: 'SAR',
            description: 'Get 10% discount on all drinks.',
            terms: 'Valid once per user.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Starbucks',
            expiresAt: new Date('2025-12-10T00:00:00Z'),
        },
        {
            id: '2',
            title: 'Buy 1 Get 1 Free – Burger King',
            merchant: 'Burger King',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Buy any Whopper and get the second one for free.',
            terms: 'Valid on dine-in and takeaway only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Burger+King',
            expiresAt: new Date('2025-12-05T00:00:00Z'),
        },
        {
            id: '3',
            title: '20 SAR Cashback at Carrefour',
            merchant: 'Carrefour',
            rewardAmount: '20',
            rewardCurrency: 'SAR',
            description: 'Get 20 SAR cashback on purchases above 200 SAR.',
            terms: 'Cashback will be added to your rewards wallet.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Carrefour',
            expiresAt: new Date('2025-11-30T00:00:00Z'),
        },
        {
            id: '4',
            title: 'Free Coffee at Costa',
            merchant: 'Costa Coffee',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Get a free small coffee with any breakfast order.',
            terms: 'Valid once per user per day.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Costa',
            expiresAt: new Date('2025-12-12T00:00:00Z'),
        },
        {
            id: '5',
            title: '15% Off Electronics at Extra',
            merchant: 'Extra',
            rewardAmount: '15',
            rewardCurrency: 'PERCENT',
            description: 'Save 15% on all electronics above 500 SAR.',
            terms: 'Valid online only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Extra',
            expiresAt: new Date('2025-12-15T00:00:00Z'),
        },
        {
            id: '6',
            title: 'Free Dessert at Pizza Hut',
            merchant: 'Pizza Hut',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Get a free dessert with any large pizza order.',
            terms: 'Valid dine-in only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Pizza+Hut',
            expiresAt: new Date('2025-12-08T00:00:00Z'),
        },
        {
            id: '7',
            title: '5% Off at Al Raya',
            merchant: 'Al Raya',
            rewardAmount: '5',
            rewardCurrency: 'PERCENT',
            description: 'Save 5% on your grocery purchases above 100 SAR.',
            terms: 'Valid in-store only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Al+Raya',
            expiresAt: new Date('2025-12-20T00:00:00Z'),
        },
        {
            id: '8',
            title: 'Free Smoothie at Jamba Juice',
            merchant: 'Jamba Juice',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Enjoy a free smoothie with any sandwich.',
            terms: 'Valid once per user.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Jamba+Juice',
            expiresAt: new Date('2025-12-03T00:00:00Z'),
        },
        {
            id: '9',
            title: '25 SAR Off at IKEA',
            merchant: 'IKEA',
            rewardAmount: '25',
            rewardCurrency: 'SAR',
            description: 'Get 25 SAR discount on purchases above 250 SAR.',
            terms: 'Valid on furniture items only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=IKEA',
            expiresAt: new Date('2025-12-18T00:00:00Z'),
        },
        {
            id: '10',
            title: 'Free Appetizer at Chili’s',
            merchant: 'Chili’s',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Receive a free appetizer with any main course.',
            terms: 'Valid for dine-in only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Chilis',
            expiresAt: new Date('2025-12-07T00:00:00Z'),
        },
        {
            id: '11',
            title: '10% Off Apparel at H&M',
            merchant: 'H&M',
            rewardAmount: '10',
            rewardCurrency: 'PERCENT',
            description: 'Save 10% on all clothing items.',
            terms: 'Valid online and in-store.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=H&M',
            expiresAt: new Date('2025-12-14T00:00:00Z'),
        },
        {
            id: '12',
            title: 'Free Drink at McDonald’s',
            merchant: 'McDonald’s',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Get a free soft drink with any meal.',
            terms: 'Valid once per user.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=McDonalds',
            expiresAt: new Date('2025-12-06T00:00:00Z'),
        },
        {
            id: '13',
            title: '20 SAR Off at Carrefour Market',
            merchant: 'Carrefour Market',
            rewardAmount: '20',
            rewardCurrency: 'SAR',
            description: 'Save 20 SAR on purchases above 150 SAR.',
            terms: 'Valid on selected items only.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Carrefour+Market',
            expiresAt: new Date('2025-12-11T00:00:00Z'),
        },
        {
            id: '14',
            title: 'Free Bagel at Einstein Bros',
            merchant: 'Einstein Bros',
            rewardAmount: '1',
            rewardCurrency: 'FREE_ITEM',
            description: 'Enjoy a free bagel with any coffee.',
            terms: 'Valid once per user per day.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Einstein+Bros',
            expiresAt: new Date('2025-12-09T00:00:00Z'),
        },
        {
            id: '15',
            title: '15% Off Beauty Products at Sephora',
            merchant: 'Sephora',
            rewardAmount: '15',
            rewardCurrency: 'PERCENT',
            description: 'Save 15% on all beauty products.',
            terms: 'Valid online and in-store.',
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Sephora',
            expiresAt: new Date('2025-12-13T00:00:00Z'),
        },
    ];


    await promotionRepo.save(promos);

    console.log('✅ Seed completed with', promos.length, 'promotions.');
    await app.close();
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
