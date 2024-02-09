import { Status } from '../receipt/types/receiptStatus.type';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StoreReview } from './storeReview.entity';
import { Store } from './store.entity';

@Entity({
  name: 'receipts',
})
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  data: string;

  @Column({ type: 'text' })
  receipt_img: string;

  @Column({ type: 'enum', enum: Status, default: Status.pendding })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.receipts)
  user: Relation<User>;

  @OneToOne(() => StoreReview, (store_reviews) => store_reviews.receipt)
  store_reviews: Relation<StoreReview>;

  @ManyToOne(() => Store, (store) => store.receipts)
  store: Relation<Store>;
}
