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
// import { StoreReview } from '.';
@Entity({
  name: 'admin-review',
})
export class AdminReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  //   @ManyToOne(() => StoreReview, (storeReview) => storeReview.adminReview)
  //   storeReview: Realation<StoreReview>[];
}
