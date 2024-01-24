import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { StoreReview } from './storeReview.entity';
import { Store } from './store.entity';

@Entity({
  name: 'receipt_auth',
})
export class ReceiptAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => User, (user) => user.receiptAuths)
  user: Relation<User>;

  @OneToOne(() => StoreReview, (store_reviews) => store_reviews.receiptAuth)
  store_reviews: Relation<StoreReview>;

  @ManyToOne(() => Store, (store) => store.receiptAuths)
  store: Relation<Store>;
}
