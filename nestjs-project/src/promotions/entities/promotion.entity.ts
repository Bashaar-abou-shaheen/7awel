import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('promotions')
export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    merchant: string;

    @Column('decimal', { precision: 10, scale: 2 })
    rewardAmount: string; 

    @Column()
    rewardCurrency: string;

    @Column('text')
    description: string;

    @Column('text')
    terms: string;

    @Column()
    thumbnailUrl: string;

    @Column({ type: 'datetime' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
