import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @Column()
  reviewId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Store, (store) => store.adminReview)
  store: Store[];

  //   @ManyToOne(() => StoreReview, (storeReview) => storeReview.adminReview)
  //   storeReview: Realation<StoreReview>[];
}
