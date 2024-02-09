import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';
import { AdminReview } from './adminReview.entity';
import { Receipt } from './receipt.entity';

@Entity({
  name: 'store_review', // 데이터베이스 테이블의 이름
})
export class StoreReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.store_reviews)
  store: Relation<Store>;

  @ManyToOne(() => User, (user) => user.store_reviews)
  user: Relation<User>;

  @Column()
  store_id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @Column()
  rating: number;

  @OneToMany(() => AdminReview, (admin_review) => admin_review.store_review)
  admin_review: Relation<AdminReview>[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Receipt, (receipt) => receipt.store_reviews)
  @JoinColumn({ name: 'receipt_id', referencedColumnName: 'id' })
  receipt: Relation<Receipt>;

  @Column({ default: false })
  is_receipt: boolean;

  @Column({ nullable: true })
  receipt_id: number;
}
