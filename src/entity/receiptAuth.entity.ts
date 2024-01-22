import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { StoreReview } from './storeReview.entity';

@Entity({
  name: 'Receipt_auth',
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
}
