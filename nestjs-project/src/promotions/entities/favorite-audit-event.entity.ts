import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('favorite_audit_events')
export class FavoriteAuditEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  promotionId: string;

  @Column()
  action: 'FAVORITED' | 'UNFAVORITED';

  @CreateDateColumn()
  createdAt: Date;
}
