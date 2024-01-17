import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';
import { Store } from './store.entity';
import { StoreReview } from './storeReview.entity';
@Entity({
  name: 'admin-review',
})
export class AdminReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'review_id' })
  reviewId: number;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.adminReviews)
  store: Relation<Store>;

  @ManyToOne(() => StoreReview, (store_review) => store_review.adminReviews)
  storeReview: Relation<StoreReview>[];
}
