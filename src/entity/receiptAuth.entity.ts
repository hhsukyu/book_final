import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
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

  @Column()
  authenticationStatus: boolean;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => User, (user) => user.receiptAuths)
  user: User;

  @OneToOne(() => StoreReview, (store_reviews) => store_reviews.receiptAuth)
  store_reviews: StoreReview;

  @ManyToOne(() => Store, (store) => store.receiptAuths)
  store: Store;
}
