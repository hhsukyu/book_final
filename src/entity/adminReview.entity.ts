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
// import { StoreReview } from './storeReview.entity';
@Entity({
  name: 'admin_review',
})
export class AdminReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @Column()
  storeReviewId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Store, (store) => store.admin_reviews)
  store: Relation<Store>;

  // @ManyToOne(() => StoreReview, (store_review) => store_review.admin_reviews)
  // store_review: Relation<StoreReview>[];
}
